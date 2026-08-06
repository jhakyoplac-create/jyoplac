from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from datetime import date, datetime, timedelta
from pathlib import Path
from urllib.parse import parse_qs, quote, urlparse
import urllib.error
import urllib.request
import base64
import hashlib
import hmac
import json
import os
import re
import secrets
import socket
import sqlite3
import threading
import time
import uuid

from sunat import config as sunat_config
from sunat import emision as sunat_emision

try:
    from zoneinfo import ZoneInfo
except ImportError:
    ZoneInfo = None

try:
    import psycopg
    from psycopg.rows import dict_row
except ImportError:
    psycopg = None
    dict_row = None

try:
    from psycopg_pool import ConnectionPool
except ImportError:
    ConnectionPool = None


ROOT = Path(__file__).resolve().parents[1]
DB_DIR = Path(os.environ.get("DATA_DIR", ROOT / "database"))
DB_PATH = DB_DIR / "dental.sqlite3"
SCHEMA_PATH = ROOT / "backend" / "schema.sql"
SESSION_SECONDS = int(os.environ.get("SESSION_SECONDS", 60 * 60 * 4))
DOCTOR_SESSION_SECONDS = int(os.environ.get("DOCTOR_SESSION_SECONDS", 60 * 60 * 12))
DATABASE_URL = os.environ.get("DATABASE_URL", "").strip()
USE_POSTGRES = bool(DATABASE_URL)
TOKEN_SECRET = os.environ.get("TOKEN_SECRET") or os.environ.get("ADMIN_PASSWORD", "cm-odontologia-local-secret")
LIONAPI_KEY = os.environ.get("LIONAPI_KEY", "").strip()
LIONAPI_BASE_URL = os.environ.get("LIONAPI_BASE_URL", "https://www.softwarelion.pe/api/lion-api/v1").rstrip("/")
LIONAPI_DNI_URL = os.environ.get("LIONAPI_DNI_URL", "").strip()
LIONAPI_RUC_URL = os.environ.get("LIONAPI_RUC_URL", "").strip()

sessions = {}


def now_id(prefix):
    return f"{prefix}-{uuid.uuid4().hex[:12]}"


def today_lima():
    if ZoneInfo:
        return datetime.now(ZoneInfo("America/Lima")).date().isoformat()
    return date.today().isoformat()


def add_days_iso(value, days):
    try:
        return date.fromordinal(date.fromisoformat(value).toordinal() + days).isoformat()
    except Exception:
        return value


def normalize_role(role):
    value = str(role or "").strip().upper()
    aliases = {
        "ADMINISTRADOR": "ADMIN",
        "RECEPCIONISTA": "RECEPCION",
        "RECEPCIÓN": "RECEPCION",
        "RECEPCION": "RECEPCION",
        "DOCTORA": "DOCTOR",
        "DOCTOR TRABAJADOR": "DOCTOR_TRABAJADOR",
        "DOCTORA TRABAJADORA": "DOCTOR_TRABAJADOR",
        "DOCTOR_TRABAJADOR": "DOCTOR_TRABAJADOR",
    }
    return aliases.get(value, value)


def validate_patient_payload(data):
    errors = []
    dni = str(data.get("dni") or "").strip()
    phone = str(data.get("phone") or "").strip()
    name = re.sub(r"\s+", " ", str(data.get("name") or "").strip())
    birth_date = str(data.get("birthDate") or data.get("birth_date") or "").strip()
    if not re.fullmatch(r"\d{8}", dni):
        errors.append("El DNI debe tener exactamente 8 digitos.")
    if not re.fullmatch(r"9\d{8}", phone):
        errors.append("El celular debe tener 9 digitos y empezar con 9.")
    if len([part for part in name.split(" ") if part]) < 2:
        errors.append("Ingresa nombres y apellidos completos del paciente.")
    if not re.fullmatch(r"[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]+", name):
        errors.append("El nombre solo debe contener letras y espacios.")
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", birth_date):
        errors.append("Ingresa una fecha de nacimiento valida.")
    else:
        try:
            parsed_birth = datetime.strptime(birth_date, "%Y-%m-%d").date()
            today = date.today()
            age = today.year - parsed_birth.year - ((today.month, today.day) < (parsed_birth.month, parsed_birth.day))
            if parsed_birth > today:
                errors.append("La fecha de nacimiento no puede ser futura.")
            elif age > 120:
                errors.append("La fecha de nacimiento no parece correcta. Verifica el anio.")
        except ValueError:
            errors.append("Ingresa una fecha de nacimiento valida.")
    return errors, {"dni": dni, "phone": phone, "name": name.upper(), "birthDate": birth_date}


def make_token(user_id, expires=None):
    expires = int(expires or time.time() + SESSION_SECONDS)
    payload = f"{user_id}:{expires}"
    signature = hmac.new(TOKEN_SECRET.encode("utf-8"), payload.encode("utf-8"), hashlib.sha256).hexdigest()
    return base64.urlsafe_b64encode(f"{payload}:{signature}".encode("utf-8")).decode("ascii")


def read_token(token):
    try:
        decoded = base64.urlsafe_b64decode(token.encode("ascii")).decode("utf-8")
        user_id, expires, signature = decoded.rsplit(":", 2)
        payload = f"{user_id}:{expires}"
        expected = hmac.new(TOKEN_SECRET.encode("utf-8"), payload.encode("utf-8"), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(signature, expected) or int(expires) < time.time():
            return None
        return user_id
    except Exception:
        return None


def session_seconds_for_role(role, remember_device=False):
    role = normalize_role(role)
    if remember_device and role in {"DOCTOR", "DOCTOR_TRABAJADOR"}:
        return max(SESSION_SECONDS, DOCTOR_SESSION_SECONDS)
    return SESSION_SECONDS


class CompatConnection:
    def __init__(self, conn, postgres=False, release_cm=None):
        self.conn = conn
        self.postgres = postgres
        self._release_cm = release_cm

    def __enter__(self):
        if self._release_cm is not None:
            self.conn = self._release_cm.__enter__()
        else:
            self.conn.__enter__()
        return self

    def __exit__(self, exc_type, exc, tb):
        if self._release_cm is not None:
            return self._release_cm.__exit__(exc_type, exc, tb)
        return self.conn.__exit__(exc_type, exc, tb)

    def execute(self, sql, params=None):
        if self.postgres:
            sql = sql.replace("?", "%s")
        return self.conn.execute(sql, params or ())

    def executescript(self, script):
        if not self.postgres:
            return self.conn.executescript(script)
        statements = [statement.strip() for statement in script.split(";") if statement.strip()]
        for statement in statements:
            if statement.upper().startswith("PRAGMA "):
                continue
            self.execute(statement)


_pg_pool = None
_pg_pool_lock = threading.Lock()


def get_pg_pool():
    global _pg_pool
    if _pg_pool is None:
        with _pg_pool_lock:
            if _pg_pool is None:
                if ConnectionPool is None:
                    raise RuntimeError("Instala psycopg-pool para usar DATABASE_URL con PostgreSQL.")
                _pg_pool = ConnectionPool(
                    DATABASE_URL,
                    min_size=1,
                    max_size=10,
                    kwargs={"row_factory": dict_row},
                    open=True,
                    check=ConnectionPool.check_connection,
                    max_idle=120,
                )
    return _pg_pool


def db():
    if USE_POSTGRES:
        if psycopg is None:
            raise RuntimeError("Instala psycopg para usar DATABASE_URL con PostgreSQL.")
        pool = get_pg_pool()
        return CompatConnection(None, postgres=True, release_cm=pool.connection())
    DB_DIR.mkdir(exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return CompatConnection(conn)


def hash_password(password, salt=None):
    salt = salt or secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 120000)
    return base64.b64encode(salt + digest).decode("ascii")


def verify_password(password, stored):
    try:
        raw = base64.b64decode(stored.encode("ascii"))
        salt, digest = raw[:16], raw[16:]
        test = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 120000)
        return hmac.compare_digest(digest, test)
    except Exception:
        return False


def row_to_dict(row):
    if isinstance(row, dict):
        return dict(row)
    return {key: row[key] for key in row.keys()}


def ensure_column(conn, table, column, definition):
    if conn.postgres:
        exists = conn.execute(
            "SELECT column_name FROM information_schema.columns WHERE table_name = ? AND column_name = ?",
            (table, column),
        ).fetchone()
    else:
        exists = any(row["name"] == column for row in conn.execute(f"PRAGMA table_info({table})").fetchall())
    if not exists:
        conn.execute(f"ALTER TABLE {table} ADD COLUMN {column} {definition}")


def migrate_db(conn):
    ensure_column(conn, "patients", "birth_date", "TEXT")
    ensure_column(conn, "patients", "status", "TEXT NOT NULL DEFAULT 'NUEVO'")
    ensure_column(conn, "patients", "created_by_id", "TEXT")
    ensure_column(conn, "patients", "created_by_name", "TEXT")
    ensure_column(conn, "patients", "created_by_role", "TEXT")
    ensure_column(conn, "patients", "hide_from_reception_new", "INTEGER NOT NULL DEFAULT 0")
    # Resultado de la llamada de seguimiento. contact_snooze evita que el mismo
    # paciente reaparezca al dia siguiente cuando ya se le llamo y quedo en algo.
    ensure_column(conn, "patients", "contact_date", "TEXT")
    ensure_column(conn, "patients", "contact_result", "TEXT")
    ensure_column(conn, "patients", "contact_note", "TEXT")
    ensure_column(conn, "patients", "contact_snooze", "TEXT")
    ensure_column(conn, "patients", "contact_by", "TEXT")
    ensure_column(conn, "clinical_history", "credit_pending", "INTEGER NOT NULL DEFAULT 0")
    ensure_column(conn, "clinical_history", "credit_amount", "REAL NOT NULL DEFAULT 0")
    ensure_column(conn, "clinical_history", "credit_due_date", "TEXT")
    ensure_column(conn, "clinical_history", "credit_note", "TEXT")
    ensure_column(conn, "payments", "cash_amount", "REAL NOT NULL DEFAULT 0")
    ensure_column(conn, "payments", "yape_amount", "REAL NOT NULL DEFAULT 0")
    ensure_column(conn, "payments", "plin_amount", "REAL NOT NULL DEFAULT 0")
    ensure_column(conn, "payments", "card_amount", "REAL NOT NULL DEFAULT 0")
    ensure_column(conn, "payments", "transfer_amount", "REAL NOT NULL DEFAULT 0")
    ensure_column(conn, "payments", "appointment_id", "TEXT")
    ensure_column(conn, "payments", "product_total", "REAL NOT NULL DEFAULT 0")
    ensure_column(conn, "appointments", "follow_up_status", "TEXT")
    ensure_column(conn, "appointments", "follow_up_comment", "TEXT")
    ensure_column(conn, "appointments", "new_appointment_id", "TEXT")
    ensure_column(conn, "appointments", "reminder_sent_at", "TEXT")
    ensure_column(conn, "appointments", "reminder_sent_by", "TEXT")
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS electronic_receipts (
          id TEXT PRIMARY KEY,
          payment_id TEXT,
          patient_id TEXT NOT NULL,
          type TEXT NOT NULL CHECK (type IN ('BOLETA', 'FACTURA')),
          series TEXT NOT NULL,
          number INTEGER NOT NULL,
          issue_date TEXT NOT NULL,
          customer_doc_type TEXT NOT NULL,
          customer_doc TEXT NOT NULL,
          customer_name TEXT NOT NULL,
          customer_address TEXT,
          description TEXT NOT NULL,
          quantity REAL NOT NULL DEFAULT 1,
          unit_value REAL NOT NULL DEFAULT 0,
          total REAL NOT NULL DEFAULT 0,
          tax_condition TEXT NOT NULL DEFAULT 'EXONERADO',
          igv REAL NOT NULL DEFAULT 0,
          status TEXT NOT NULL DEFAULT 'BORRADOR',
          notes TEXT,
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(type, series, number)
        )
        """
    )
    ensure_column(conn, "electronic_receipts", "customer_address", "TEXT")
    # Facturacion electronica ante SUNAT. Son columnas nuevas y vacias: mientras
    # no se configure, el comprobante se sigue registrando solo internamente.
    for columna in ["sunat_estado", "sunat_codigo", "sunat_descripcion", "sunat_ticket",
                    "sunat_xml", "sunat_cdr", "sunat_hash", "sunat_nombre",
                    "sunat_notas", "sunat_enviado_at"]:
        ensure_column(conn, "electronic_receipts", columna, "TEXT")
    # El correlativo lo lleva la base de datos y no el navegador: dos cobros a
    # la vez no pueden tomar el mismo numero, porque SUNAT rechaza duplicados.
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS sunat_correlativos (
          serie TEXT PRIMARY KEY,
          siguiente INTEGER NOT NULL DEFAULT 1
        )
        """
    )
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS sunat_resumenes (
          id TEXT PRIMARY KEY,
          fecha_referencia TEXT NOT NULL,
          ticket TEXT,
          estado TEXT NOT NULL DEFAULT 'ENVIADO',
          codigo TEXT,
          descripcion TEXT,
          xml TEXT,
          cdr TEXT,
          comprobantes TEXT,
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          revisado_at TEXT
        )
        """
    )
    # Hallazgos del odontograma segun la Norma Tecnica del MINSA, en JSON.
    # La columna condition se mantiene con un resumen legible para no romper
    # los registros anteriores ni los respaldos ya generados.
    ensure_column(conn, "odontogram", "findings", "TEXT")
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS inventory_products (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          unit TEXT,
          price REAL NOT NULL DEFAULT 0,
          stock REAL NOT NULL DEFAULT 0,
          min_stock REAL NOT NULL DEFAULT 0,
          active INTEGER NOT NULL DEFAULT 1,
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS inventory_movements (
          id TEXT PRIMARY KEY,
          product_id TEXT NOT NULL,
          date TEXT NOT NULL,
          type TEXT NOT NULL,
          quantity REAL NOT NULL DEFAULT 0,
          unit_price REAL NOT NULL DEFAULT 0,
          total REAL NOT NULL DEFAULT 0,
          detail TEXT,
          payment_id TEXT,
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
        """
    )


def purge_old_audit_events(conn):
    conn.execute("DELETE FROM audit_events WHERE event_date <> ?", (today_lima(),))


def add_audit_event(conn, user, action, detail, patient_id=""):
    purge_old_audit_events(conn)
    conn.execute(
        """
        INSERT INTO audit_events (id, event_date, action, detail, patient_id, user_id, user_name, user_role)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            now_id("audit"),
            today_lima(),
            action,
            detail,
            patient_id or "",
            user.get("id", ""),
            user.get("name", ""),
            normalize_role(user.get("role", "")),
        ),
    )


def appointment_audit_event(data, existing_appointment, patient_name):
    status = str(data.get("status") or "").strip().upper()
    date_value = data.get("date", "")
    time_value = data.get("time", "")
    notes = str(data.get("notes") or "").strip().lower()
    patient_label = patient_name or "Paciente"
    if not existing_appointment:
        if status not in {"CANCELADA", "REPROGRAMADA", "NO_ASISTIO"} and not notes.startswith("reprogramada desde"):
            return ("APPOINTMENT_CREATED", f"Agendo cita: {patient_label} {date_value} {time_value}")
        return None
    previous_status = str(existing_appointment["status"] or "").strip().upper()
    if status != previous_status:
        status_events = {
            "NO_ASISTIO": ("APPOINTMENT_NO_SHOW", "Marco no asistio"),
            "CANCELADA": ("APPOINTMENT_CANCELLED", "Cancelo cita"),
            "REPROGRAMADA": ("APPOINTMENT_RESCHEDULED", "Reprogramo cita"),
        }
        if status in status_events:
            action, label = status_events[status]
            return (action, f"{label}: {patient_label} {date_value} {time_value}")
    if (
        status not in {"CANCELADA", "REPROGRAMADA", "NO_ASISTIO"}
        and (existing_appointment["date"] != date_value or existing_appointment["time"] != time_value)
    ):
        return ("APPOINTMENT_RESCHEDULED", f"Reprogramo cita: {patient_label} {date_value} {time_value}")
    return None


def init_db():
    with db() as conn:
        conn.executescript(SCHEMA_PATH.read_text(encoding="utf-8"))
        migrate_db(conn)
        admin = conn.execute("SELECT id FROM users WHERE username = ?", ("admin",)).fetchone()
        if not admin:
            admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
            conn.execute(
                """
                INSERT INTO users (id, name, username, password_hash, role, active)
                VALUES (?, ?, ?, ?, ?, 1)
                """,
                ("u-admin", "Administrador principal", "admin", hash_password(admin_password), "ADMIN"),
            )
        for key, value in {
            "clinicName": "CM Odontologia Estetica",
            "generalCashOpening": "0",
            "generalBankOpening": "0",
            "generalUtilityOpening": "0",
            "enableAgendaPayments": "true",
        }.items():
            conn.execute(
                "INSERT INTO app_config (key, value) VALUES (?, ?) ON CONFLICT(key) DO NOTHING",
                (key, value),
            )
        bank_opening = conn.execute("SELECT value FROM app_config WHERE key = ?", ("generalBankOpening",)).fetchone()
        try:
            if bank_opening and abs(float(bank_opening["value"]) - 175.5) < 0.01:
                conn.execute(
                    "UPDATE app_config SET value = ? WHERE key = ?",
                    ("453.5", "generalBankOpening"),
                )
        except (TypeError, ValueError):
            pass


def read_json(handler):
    length = int(handler.headers.get("Content-Length", "0") or 0)
    if not length:
        return {}
    return json.loads(handler.rfile.read(length).decode("utf-8"))


def send_json(handler, payload, status=200):
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json; charset=utf-8")
    handler.send_header("Content-Length", str(len(body)))
    handler.end_headers()
    handler.wfile.write(body)


def auth_user(handler):
    token = handler.headers.get("Authorization", "").replace("Bearer ", "").strip()
    user_id = read_token(token)
    if not user_id:
        session = sessions.get(token)
        if not session or session["expires"] < time.time():
            return None
        user_id = session["user_id"]
    with db() as conn:
      user = conn.execute("SELECT id, name, username, role, active FROM users WHERE id = ? AND active = 1", (user_id,)).fetchone()
      data = row_to_dict(user) if user else None
      if data:
          data["role"] = normalize_role(data["role"])
      return data


def require_auth(handler):
    user = auth_user(handler)
    if not user:
        send_json(handler, {"error": "No autorizado"}, 401)
        return None
    return user


def require_role(handler, roles):
    user = require_auth(handler)
    if not user:
        return None
    if normalize_role(user["role"]) not in {normalize_role(role) for role in roles}:
        send_json(handler, {"error": "No tienes permiso para esta accion"}, 403)
        return None
    return user


def first_value(data, keys):
    if not isinstance(data, dict):
        return ""
    for key in keys:
        value = data.get(key)
        if value not in (None, ""):
            return str(value).strip()
    return ""


def lionapi_url(template, number):
    safe_number = quote(str(number), safe="")
    if "{numero}" in template:
        return template.replace("{numero}", safe_number)
    if "{number}" in template:
        return template.replace("{number}", safe_number)
    separator = "&" if "?" in template else "?"
    return f"{template}{separator}numero={safe_number}"


def lionapi_candidates(kind):
    if kind == "dni":
        templates = [
            LIONAPI_DNI_URL,
            f"{LIONAPI_BASE_URL}/dni/{{numero}}",
            f"{LIONAPI_BASE_URL}/dni?numero={{numero}}",
            f"{LIONAPI_BASE_URL}/consulta/dni/{{numero}}",
            f"{LIONAPI_BASE_URL}/consulta/dni?numero={{numero}}",
            f"{LIONAPI_BASE_URL}/consultar/dni/{{numero}}",
            f"{LIONAPI_BASE_URL}/persona/dni/{{numero}}",
            f"{LIONAPI_BASE_URL}/reniec/dni/{{numero}}",
        ]
    else:
        templates = [
            LIONAPI_RUC_URL,
            f"{LIONAPI_BASE_URL}/ruc/{{numero}}",
            f"{LIONAPI_BASE_URL}/ruc?numero={{numero}}",
            f"{LIONAPI_BASE_URL}/consulta/ruc/{{numero}}",
            f"{LIONAPI_BASE_URL}/consulta/ruc?numero={{numero}}",
            f"{LIONAPI_BASE_URL}/consultar/ruc/{{numero}}",
            f"{LIONAPI_BASE_URL}/empresa/ruc/{{numero}}",
            f"{LIONAPI_BASE_URL}/sunat/ruc/{{numero}}",
        ]

    seen = set()
    for template in templates:
        if not template or template in seen:
            continue
        seen.add(template)
        yield template


def lionapi_data_roots(payload):
    roots = []
    if isinstance(payload, dict):
        roots.append(payload)
        for key in ("result", "data", "response"):
            value = payload.get(key)
            if isinstance(value, dict):
                roots.append(value)
    return roots


def normalize_lionapi_response(kind, number, payload):
    data_roots = lionapi_data_roots(payload)
    if kind == "dni":
        full_name = ""
        for data in data_roots:
            full_name = first_value(data, [
                "nombre_completo",
                "nombreCompleto",
                "nombres_apellidos",
                "nombresApellidos",
                "razonSocial",
                "razon_social",
                "nombre",
                "name",
            ])
            if full_name:
                break
        if not full_name:
            for data in data_roots:
                names = " ".join(filter(None, [
                    first_value(data, ["nombres", "names"]),
                    first_value(data, ["apellido_paterno", "apellidoPaterno", "apePaterno", "paterno"]),
                    first_value(data, ["apellido_materno", "apellidoMaterno", "apeMaterno", "materno"]),
                ]))
                if names.strip():
                    full_name = names.strip()
                    break
        return {
            "success": bool(full_name),
            "dni": str(number),
            "name": full_name.upper(),
            "raw": payload,
        }

    legal_name = ""
    address = ""
    for data in data_roots:
        legal_name = first_value(data, [
            "razon_social",
            "razonSocial",
            "nombre_o_razon_social",
            "nombreORazonSocial",
            "nombre",
            "name",
        ])
        address = first_value(data, [
            "direccion",
            "direccion_fiscal",
            "direccionFiscal",
            "domicilio_fiscal",
            "domicilioFiscal",
            "direccionCompleta",
        ])
        if legal_name:
            break
    return {
        "success": bool(legal_name),
        "ruc": str(number),
        "razonSocial": legal_name.upper(),
        "direccionFiscal": address.upper(),
        "raw": payload,
    }


def lionapi_lookup(kind, number):
    if not LIONAPI_KEY:
        return {"error": "LionAPI no configurado. Agrega LIONAPI_KEY en Render."}, 503

    last_404 = ""
    for template in lionapi_candidates(kind):
        request = urllib.request.Request(
            lionapi_url(template, number),
            headers={
                "Accept": "application/json",
                "User-Agent": "CM-Odontologia/1.0",
                "x-api-key": LIONAPI_KEY,
            },
            method="GET",
        )
        try:
            with urllib.request.urlopen(request, timeout=12) as response:
                raw_text = response.read().decode("utf-8")
        except urllib.error.HTTPError as exc:
            try:
                error_text = exc.read().decode("utf-8")
            except Exception:
                error_text = ""
            if exc.code == 404:
                last_404 = error_text[:300]
                continue
            return {"error": f"LionAPI respondio con error {exc.code}.", "detail": error_text[:300]}, 502
        except Exception:
            return {"error": "No se pudo consultar LionAPI."}, 502

        try:
            payload = json.loads(raw_text) if raw_text else {}
        except json.JSONDecodeError:
            return {"error": "LionAPI devolvio una respuesta no valida."}, 502

        return normalize_lionapi_response(kind, number, payload), 200

    return {
        "error": f"No se pudo consultar {kind.upper()} en LionAPI. Completa los datos manualmente.",
        "detail": last_404,
    }, 502


def list_table(table, order="created_at DESC"):
    with db() as conn:
        return [row_to_dict(row) for row in conn.execute(f"SELECT * FROM {table} ORDER BY {order}").fetchall()]


def valid_iso_date(value):
    return bool(isinstance(value, str) and re.match(r"^\d{4}-\d{2}-\d{2}$", value))


def list_table_by_date(table, order="date DESC, created_at DESC", date_column="date", params=None):
    params = params or {}
    single_date = (params.get("date") or [""])[0]
    date_from = (params.get("from") or [""])[0]
    date_to = (params.get("to") or [""])[0]
    values = []
    where = ""
    if valid_iso_date(single_date):
        where = f"WHERE {date_column} = ?"
        values.append(single_date)
    elif valid_iso_date(date_from) and valid_iso_date(date_to):
        where = f"WHERE {date_column} BETWEEN ? AND ?"
        values.extend([date_from, date_to])
    with db() as conn:
        return [
            row_to_dict(row)
            for row in conn.execute(f"SELECT * FROM {table} {where} ORDER BY {order}", values).fetchall()
        ]


def list_appointments(params=None):
    params = params or {}
    single_date = (params.get("date") or [""])[0]
    date_from = (params.get("from") or [""])[0]
    date_to = (params.get("to") or [""])[0]
    patient_id = str((params.get("patientId") or params.get("patient_id") or [""])[0]).strip()
    clauses = []
    values = []
    if valid_iso_date(single_date):
        clauses.append("date = ?")
        values.append(single_date)
    elif valid_iso_date(date_from) and valid_iso_date(date_to):
        clauses.append("date BETWEEN ? AND ?")
        values.extend([date_from, date_to])
    if patient_id:
        clauses.append("patient_id = ?")
        values.append(patient_id)
    where = f"WHERE {' AND '.join(clauses)}" if clauses else ""
    with db() as conn:
        return [
            row_to_dict(row)
            for row in conn.execute(f"SELECT * FROM appointments {where} ORDER BY date DESC, time DESC", values).fetchall()
        ]


# Tratamientos que necesitan control periodico. Un paciente de ortodoncia sin
# cita se nota mucho antes que uno de una limpieza anual.
CONTROL_PERIODICO = [
    ("ORTODONCIA", 35),
    ("BRACKETS", 35),
    ("RETENEDOR", 60),
    ("PERIODONCIA", 120),
    ("IMPLANTE", 120),
    ("PROTESIS", 180),
]


def dias_de_control(tratamiento):
    texto = str(tratamiento or "").upper()
    for clave, dias in CONTROL_PERIODICO:
        if clave in texto:
            return dias
    return None


def list_patients():
    """Pacientes con su ultima atencion y su proxima cita ya calculadas.

    El navegador solo recibe las citas de los proximos dias, asi que no puede
    deducir el estado por su cuenta: un paciente con cita para dentro de dos
    semanas figuraba como INACTIVO en la lista, y solo se corregia al abrir sus
    citas, que es cuando el frontend las descarga.
    """
    hoy = today_lima()
    activos = "('RESERVADA', 'CONFIRMADA', 'EN_ATENCION', 'REPROGRAMADA')"
    with db() as conn:
        return [
            row_to_dict(row)
            for row in conn.execute(
                f"""
                SELECT p.*,
                       (SELECT MAX(a.date) FROM appointments a
                         WHERE a.patient_id = p.id AND a.status = 'ATENDIDA') AS last_attended,
                       (SELECT MIN(a.date) FROM appointments a
                         WHERE a.patient_id = p.id AND a.date >= ?
                           AND a.status IN {activos}) AS next_appointment,
                       (SELECT COUNT(*) FROM appointments a
                         WHERE a.patient_id = p.id) AS total_appointments
                  FROM patients p
                 ORDER BY p.name ASC
                """,
                (hoy,),
            ).fetchall()
        ]


def seguimiento_de_pacientes():
    """Dos listas: a quien llamar y a quien reactivar con una promocion.

    Se calcula aqui y no en el navegador porque el navegador solo recibe las
    citas de los proximos dias: sin el historial completo, un paciente atendido
    hace tres meses parecia no haber venido nunca.
    """
    hoy = today_lima()
    activos = "('RESERVADA', 'CONFIRMADA', 'EN_ATENCION', 'REPROGRAMADA')"
    with db() as conn:
        filas = conn.execute(
            f"""
            SELECT p.id, p.name, p.dni, p.phone, p.doctor, p.main_treatment, p.notes,
                   p.created_at, p.contact_date, p.contact_result, p.contact_note,
                   p.contact_snooze, p.contact_by,
                   (SELECT MAX(a.date) FROM appointments a
                     WHERE a.patient_id = p.id AND a.status = 'ATENDIDA') AS ultima_atencion,
                   (SELECT MAX(a.date) FROM appointments a
                     WHERE a.patient_id = p.id) AS ultimo_contacto,
                   (SELECT COUNT(*) FROM appointments a
                     WHERE a.patient_id = p.id AND a.date >= ?
                       AND a.status IN {activos}) AS citas_futuras,
                   (SELECT COUNT(*) FROM appointments a
                     WHERE a.patient_id = p.id) AS total_citas,
                   (SELECT MAX(a.date) FROM appointments a
                     WHERE a.patient_id = p.id AND a.date < ?
                       AND a.status IN ('REPROGRAMADA', 'CANCELADA', 'NO_ASISTIO')) AS ultima_fallida
              FROM patients p
             ORDER BY p.name ASC
            """,
            (hoy, hoy),
        ).fetchall()

    try:
        limite = int(str(app_config().get("inactiveDays", "30")).strip('" '))
    except (TypeError, ValueError):
        limite = 30
    salida = []
    promociones = []
    for fila in filas:
        row = row_to_dict(fila)
        if int(row.get("citas_futuras") or 0) > 0:
            continue

        # --- inactivos para promociones ---
        # Se mide desde el ultimo contacto y no desde la ultima atencion: quien
        # reprogramo el mes pasado no esta frio, aunque nunca llegara a venir.
        contacto = str(row.get("ultimo_contacto") or "")[:10]
        referencia = contacto or str(row.get("created_at") or "")[:10]
        dias_frio = days_between(referencia, hoy)
        control_promo = dias_de_control(row.get("main_treatment"))
        if dias_frio is not None and dias_frio > limite and not (control_promo and dias_frio <= 90):
            if not contacto:
                segmento = "NUNCA VINO"
            elif dias_frio <= 90:
                segmento = "1 A 3 MESES"
            elif dias_frio <= 180:
                segmento = "3 A 6 MESES"
            else:
                segmento = "MAS DE 6 MESES"
            promociones.append({
                "id": row["id"], "name": row["name"], "dni": row["dni"],
                "phone": row["phone"], "doctor": row["doctor"],
                "mainTreatment": row["main_treatment"],
                "segmento": segmento, "dias": dias_frio, "meses": dias_frio // 30,
                "ultimaAtencion": str(row.get("ultima_atencion") or "")[:10],
            })

        # --- a quien llamar ---
        # ya se le llamo y quedo en algo: no reaparece hasta esa fecha
        snooze = str(row.get("contact_snooze") or "")[:10]
        if snooze and snooze > hoy:
            continue

        atencion = str(row.get("ultima_atencion") or "")[:10]
        fallida = str(row.get("ultima_fallida") or "")[:10]
        creado = str(row.get("created_at") or "")[:10]
        control = dias_de_control(row.get("main_treatment"))

        if not int(row.get("total_citas") or 0):
            motivo, dias, prioridad = "NUNCA VINO", days_between(creado, hoy), 3
        elif fallida and (not atencion or fallida > atencion):
            motivo, dias, prioridad = "NO VINO Y NO REPROGRAMO", days_between(fallida, hoy), 1
        elif atencion:
            dias = days_between(atencion, hoy)
            if control and dias is not None and dias >= control:
                motivo, prioridad = "CONTROL VENCIDO", 0
            elif dias is not None and dias > limite:
                motivo, prioridad = "SIN PROXIMA CITA", 2
            else:
                continue
        else:
            continue
        if dias is None:
            continue

        salida.append({
            "id": row["id"],
            "name": row["name"],
            "dni": row["dni"],
            "phone": row["phone"],
            "doctor": row["doctor"],
            "mainTreatment": row["main_treatment"],
            "notes": row["notes"],
            "motivo": motivo,
            "dias": dias,
            "prioridad": prioridad,
            "ultimaAtencion": atencion,
            "ultimoContacto": str(row.get("ultimo_contacto") or "")[:10],
            "contactDate": str(row.get("contact_date") or "")[:10],
            "contactResult": row.get("contact_result") or "",
            "contactNote": row.get("contact_note") or "",
            "contactBy": row.get("contact_by") or "",
        })

    salida.sort(key=lambda x: (x["prioridad"], -x["dias"]))
    promociones.sort(key=lambda x: x["dias"])
    return {"porLlamar": salida, "promociones": promociones}


def days_between(desde, hasta):
    if not valid_iso_date(str(desde)[:10]) or not valid_iso_date(str(hasta)[:10]):
        return None
    return (date.fromisoformat(hasta[:10]) - date.fromisoformat(desde[:10])).days


def list_bootstrap_appointments():
    today = today_lima()
    next_days = add_days_iso(today, 2)
    with db() as conn:
        return [
            row_to_dict(row)
            for row in conn.execute(
                """
                SELECT * FROM appointments
                WHERE date BETWEEN ? AND ?
                   OR (
                        status IN ('CANCELADA', 'REPROGRAMADA', 'NO_ASISTIO')
                        AND COALESCE(follow_up_status, '') <> 'CERRADO'
                   )
                ORDER BY date DESC, time DESC
                """,
                (today, next_days),
            ).fetchall()
        ]


def list_users():
    with db() as conn:
        return [
            row_to_dict(row)
            for row in conn.execute(
                "SELECT id, name, username, role, active, created_at, updated_at FROM users ORDER BY name ASC"
            ).fetchall()
        ]


def list_audit_events():
    with db() as conn:
        purge_old_audit_events(conn)
        return [
            row_to_dict(row)
            for row in conn.execute(
                "SELECT * FROM audit_events WHERE event_date = ? ORDER BY created_at DESC",
                (today_lima(),),
            ).fetchall()
        ]


def inventory_snapshot(conn):
    return {
        "inventoryProducts": [row_to_dict(row) for row in conn.execute("SELECT * FROM inventory_products ORDER BY name ASC").fetchall()],
        "inventoryMovements": [
            row_to_dict(row)
            for row in conn.execute("SELECT * FROM inventory_movements ORDER BY date DESC, created_at DESC").fetchall()
        ],
    }


def reverse_payment_inventory(conn, payment_id):
    rows = conn.execute(
        "SELECT product_id, quantity FROM inventory_movements WHERE payment_id = ? AND type = 'VENTA'",
        (payment_id,),
    ).fetchall()
    for row in rows:
        conn.execute(
            "UPDATE inventory_products SET stock = stock + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
            (float(row["quantity"] or 0), row["product_id"]),
        )
    conn.execute("DELETE FROM inventory_movements WHERE payment_id = ? AND type = 'VENTA'", (payment_id,))


def apply_payment_inventory(conn, payment_id, payment_date, product_items):
    reverse_payment_inventory(conn, payment_id)
    for item in product_items or []:
        product_id = str(item.get("productId") or item.get("product_id") or "").strip()
        quantity = float(item.get("quantity") or 0)
        if not product_id or quantity <= 0:
            continue
        product = conn.execute("SELECT * FROM inventory_products WHERE id = ? AND active = 1", (product_id,)).fetchone()
        if not product:
            raise ValueError("Producto de inventario no encontrado.")
        if float(product["stock"] or 0) < quantity:
            raise ValueError(f"Stock insuficiente para {product['name']}.")
        unit_price = float(item.get("price") or item.get("unitPrice") or product["price"] or 0)
        total = quantity * unit_price
        conn.execute(
            "UPDATE inventory_products SET stock = stock - ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
            (quantity, product_id),
        )
        conn.execute(
            """
            INSERT INTO inventory_movements (id, product_id, date, type, quantity, unit_price, total, detail, payment_id)
            VALUES (?, ?, ?, 'VENTA', ?, ?, ?, ?, ?)
            """,
            (
                now_id("mov"),
                product_id,
                payment_date,
                quantity,
                unit_price,
                total,
                f"Venta en pago {payment_id}",
                payment_id,
            ),
        )


def open_cash_date(conn):
    row = conn.execute(
        "SELECT date FROM cash_sessions WHERE closed_at IS NULL ORDER BY opened_at ASC LIMIT 1"
    ).fetchone()
    return row["date"] if row else None


def app_config():
    with db() as conn:
        return {row["key"]: row["value"] for row in conn.execute("SELECT key, value FROM app_config").fetchall()}


def set_config(values):
    with db() as conn:
        for key, value in values.items():
            if isinstance(value, (list, dict)):
                value = json.dumps(value, ensure_ascii=False)
            conn.execute(
                "INSERT INTO app_config (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",
                (key, str(value)),
            )


class DentalHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, fmt, *args):
        print(f"[Dental] {self.address_string()} - {fmt % args}")

    def end_headers(self):
        parsed = urlparse(self.path)
        no_cache_paths = {
            "/",
            "/index.html",
            "/app.js",
            "/styles.css",
            "/service-worker.js",
            "/manifest.webmanifest",
        }
        if parsed.path in no_cache_paths:
            self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
            self.send_header("Pragma", "no-cache")
            self.send_header("Expires", "0")
        super().end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        params = parse_qs(parsed.query)
        if not parsed.path.startswith("/api/"):
            return super().do_GET()

        if parsed.path == "/api/health":
            database = "postgresql" if USE_POSTGRES else str(DB_PATH)
            return send_json(self, {"ok": True, "database": database})

        user = require_auth(self)
        if not user:
            return

        if parsed.path == "/api/me":
            return send_json(self, {"user": user})
        if parsed.path == "/api/external/dni":
            number = re.sub(r"\D", "", (params.get("numero") or [""])[0])
            if not re.match(r"^\d{8}$", number):
                return send_json(self, {"error": "El DNI debe tener 8 dígitos."}, 400)
            payload, status = lionapi_lookup("dni", number)
            return send_json(self, payload, status)
        if parsed.path == "/api/external/ruc":
            number = re.sub(r"\D", "", (params.get("numero") or [""])[0])
            if not re.match(r"^\d{11}$", number):
                return send_json(self, {"error": "El RUC debe tener 11 dígitos."}, 400)
            payload, status = lionapi_lookup("ruc", number)
            return send_json(self, payload, status)
        if parsed.path == "/api/bootstrap":
            return send_json(self, {
                "user": user,
                "patients": list_patients(),
                "appointments": list_bootstrap_appointments(),
                "clinicalHistory": list_table("clinical_history", "date DESC"),
                "treatments": list_table("treatments", "created_at DESC"),
                "odontogram": list_table("odontogram", "patient_id ASC, tooth ASC"),
                "payments": list_table("payments", "date DESC, created_at DESC"),
                "electronicReceipts": list_table("electronic_receipts", "issue_date DESC, created_at DESC"),
                "expenses": list_table("expenses", "date DESC, created_at DESC"),
                "inventoryProducts": list_table("inventory_products", "name ASC"),
                "inventoryMovements": list_table("inventory_movements", "date DESC, created_at DESC"),
                "cashSessions": list_table("cash_sessions", "date DESC"),
                "pettyCashAllocations": list_table("petty_cash_allocations", "date DESC"),
                "auditEvents": list_audit_events(),
                "users": list_users() if user["role"] == "ADMIN" else [],
                "config": app_config(),
            })
        if parsed.path == "/api/cash-state":
            return send_json(self, {
                "cashSessions": list_table("cash_sessions", "date DESC"),
                "pettyCashAllocations": list_table("petty_cash_allocations", "date DESC"),
                "config": app_config(),
            })
        if parsed.path == "/api/patients":
            return send_json(self, {"patients": list_patients()})
        if parsed.path == "/api/appointments":
            return send_json(self, {"appointments": list_appointments(params)})
        if parsed.path == "/api/clinical-history":
            return send_json(self, {"clinicalHistory": list_table("clinical_history", "date DESC, created_at DESC")})
        if parsed.path == "/api/treatments":
            return send_json(self, {"treatments": list_table("treatments", "created_at DESC")})
        if parsed.path == "/api/odontogram":
            return send_json(self, {"odontogram": list_table("odontogram", "patient_id ASC, tooth ASC")})
        if parsed.path == "/api/payments":
            return send_json(self, {"payments": list_table_by_date("payments", "date DESC, created_at DESC", "date", params)})
        if parsed.path == "/api/electronic-receipts":
            return send_json(self, {"electronicReceipts": list_table("electronic_receipts", "issue_date DESC, created_at DESC")})
        if parsed.path == "/api/expenses":
            return send_json(self, {"expenses": list_table_by_date("expenses", "date DESC, created_at DESC", "date", params)})
        if parsed.path == "/api/inventory-products":
            return send_json(self, {"inventoryProducts": list_table("inventory_products", "name ASC")})
        if parsed.path == "/api/inventory-movements":
            return send_json(self, {"inventoryMovements": list_table("inventory_movements", "date DESC, created_at DESC")})
        if parsed.path == "/api/cash-sessions":
            return send_json(self, {"cashSessions": list_table("cash_sessions", "date DESC")})
        if parsed.path == "/api/users":
            if not require_role(self, {"ADMIN"}):
                return
            return send_json(self, {"users": list_users()})
        if parsed.path == "/api/patients-to-call":
            if not require_role(self, {"ADMIN", "DOCTOR", "DOCTOR_TRABAJADOR", "RECEPCION"}):
                return
            listas = seguimiento_de_pacientes()
            return send_json(self, {
                "patientsToCall": listas["porLlamar"],
                "promotions": listas["promociones"],
            })

        if parsed.path == "/api/audit-events":
            if not require_role(self, {"ADMIN"}):
                return
            return send_json(self, {"auditEvents": list_audit_events()})

        if parsed.path == "/api/sunat/estado":
            # solo dice si esta lista y con que serie emite; nada secreto
            if not require_role(self, {"ADMIN", "DOCTOR", "DOCTOR_TRABAJADOR", "RECEPCION"}):
                return
            estado = sunat_config.resumen_configuracion()
            with db() as conn:
                pendientes = conn.execute(
                    "SELECT COUNT(*) AS total FROM electronic_receipts WHERE sunat_estado = 'PENDIENTE'"
                ).fetchone()
                sin_respuesta = conn.execute(
                    "SELECT COUNT(*) AS total FROM sunat_resumenes WHERE estado = 'ENVIADO'"
                ).fetchone()
            estado["boletasPendientes"] = int(pendientes["total"] if pendientes else 0)
            estado["resumenesSinRespuesta"] = int(sin_respuesta["total"] if sin_respuesta else 0)
            return send_json(self, estado)

        send_json(self, {"error": "Ruta no encontrada"}, 404)

    def do_POST(self):
        parsed = urlparse(self.path)
        if not parsed.path.startswith("/api/"):
            return send_json(self, {"error": "Ruta no encontrada"}, 404)

        if parsed.path == "/api/login":
            data = read_json(self)
            username = str(data.get("username", "")).strip()
            password = str(data.get("password", ""))
            with db() as conn:
                row = conn.execute("SELECT * FROM users WHERE lower(username) = lower(?) AND active = 1", (username,)).fetchone()
            if not row or not verify_password(password, row["password_hash"]):
                return send_json(self, {"error": "Usuario o contraseña incorrectos"}, 401)
            session_seconds = session_seconds_for_role(row["role"], bool(data.get("rememberDevice")))
            expires_at = int(time.time() + session_seconds)
            token = make_token(row["id"], expires_at)
            sessions[token] = {"user_id": row["id"], "expires": expires_at}
            return send_json(self, {
                "token": token,
                "expiresAt": expires_at * 1000,
                "user": {"id": row["id"], "name": row["name"], "username": row["username"], "role": normalize_role(row["role"]), "active": row["active"]},
            })

        if parsed.path == "/api/logout":
            token = self.headers.get("Authorization", "").replace("Bearer ", "").strip()
            sessions.pop(token, None)
            return send_json(self, {"ok": True})

        if parsed.path == "/api/users":
            if not require_role(self, {"ADMIN"}):
                return
            data = read_json(self)
            item_id = data.get("id") or now_id("user")
            password = str(data.get("password") or "")
            with db() as conn:
                existing = conn.execute("SELECT id, password_hash FROM users WHERE id = ?", (item_id,)).fetchone()
                if not existing and not password:
                    return send_json(self, {"error": "Ingresa una contrasena para crear el usuario."}, 400)
                password_hash = hash_password(password) if password else existing["password_hash"]
                try:
                    conn.execute(
                        """
                        INSERT INTO users (id, name, username, password_hash, role, active)
                        VALUES (?, ?, ?, ?, ?, ?)
                        ON CONFLICT(id) DO UPDATE SET
                          name=excluded.name, username=excluded.username,
                          password_hash=excluded.password_hash, role=excluded.role,
                          active=excluded.active, updated_at=CURRENT_TIMESTAMP
                        """,
                        (
                            item_id,
                            data["name"].strip(),
                            data["username"].strip(),
                            password_hash,
                            normalize_role(data["role"]),
                            1 if data.get("active", True) else 0,
                        ),
                    )
                except sqlite3.IntegrityError:
                    return send_json(self, {"error": "Ese nombre de usuario ya existe."}, 409)
            return send_json(self, {"ok": True, "id": item_id})

        user = require_auth(self)
        if not user:
            return

        if parsed.path == "/api/patients":
            if not require_role(self, {"ADMIN", "DOCTOR", "DOCTOR_TRABAJADOR", "RECEPCION"}):
                return
            data = read_json(self)
            if data.get("hideReceptionNew"):
                if not require_role(self, {"ADMIN"}):
                    return
                item_id = data.get("id")
                if not item_id:
                    return send_json(self, {"error": "Paciente no indicado."}, 400)
                with db() as conn:
                    patient = conn.execute("SELECT id, name, dni FROM patients WHERE id = ?", (item_id,)).fetchone()
                    if not patient:
                        return send_json(self, {"error": "Paciente no encontrado."}, 404)
                    conn.execute(
                        "UPDATE patients SET hide_from_reception_new = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
                        (item_id,),
                    )
                    add_audit_event(
                        conn,
                        user,
                        "PATIENT_RECEPTION_NEW_HIDDEN",
                        f"Oculto de nuevos recepcion: {patient['name']} ({patient['dni']})",
                        item_id,
                    )
                return send_json(self, {"ok": True, "id": item_id})
            if data.get("delete"):
                if not require_role(self, {"ADMIN", "DOCTOR"}):
                    return
                item_id = data.get("id")
                if not item_id:
                    return send_json(self, {"error": "Paciente no indicado."}, 400)
                with db() as conn:
                    row = conn.execute("SELECT id FROM patients WHERE id = ?", (item_id,)).fetchone()
                    if not row:
                        return send_json(self, {"error": "Paciente no encontrado."}, 404)
                    conn.execute("DELETE FROM patients WHERE id = ?", (item_id,))
                return send_json(self, {"ok": True, "id": item_id})
            item_id = data.get("id") or now_id("p")
            validation_errors, patient_values = validate_patient_payload(data)
            if validation_errors:
                return send_json(self, {"error": "\n".join(validation_errors)}, 400)
            with db() as conn:
                existing_patient = conn.execute("SELECT id, name, hide_from_reception_new FROM patients WHERE id = ?", (item_id,)).fetchone()
                duplicate_dni = conn.execute(
                    "SELECT id FROM patients WHERE dni = ? AND id <> ?",
                    (patient_values["dni"], item_id),
                ).fetchone()
                if duplicate_dni:
                    return send_json(self, {"error": "Ya existe otro paciente registrado con ese DNI."}, 409)
                hidden_from_reception_new = (
                    1
                    if data.get("hideFromReceptionNew") or data.get("hide_from_reception_new")
                    else int(existing_patient["hide_from_reception_new"] or 0) if existing_patient else 0
                )
                conn.execute(
                    """
                    INSERT INTO patients (
                      id, dni, name, phone, birth_date, doctor, main_treatment, status, notes,
                      created_by_id, created_by_name, created_by_role, hide_from_reception_new
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ON CONFLICT(id) DO UPDATE SET
                      dni=excluded.dni, name=excluded.name, phone=excluded.phone,
                      birth_date=excluded.birth_date,
                      doctor=excluded.doctor, main_treatment=excluded.main_treatment,
                      status=excluded.status, notes=excluded.notes,
                      hide_from_reception_new=excluded.hide_from_reception_new,
                      updated_at=CURRENT_TIMESTAMP
                    """,
                    (
                        item_id,
                        patient_values["dni"],
                        patient_values["name"],
                        patient_values["phone"],
                        patient_values["birthDate"],
                        data.get("doctor", ""),
                        data.get("mainTreatment", ""),
                        data.get("status", "NUEVO"),
                        data.get("notes", ""),
                        user["id"],
                        user["name"],
                        normalize_role(user["role"]),
                        hidden_from_reception_new,
                    ),
                )
                action = "PATIENT_CREATED" if not existing_patient else "PATIENT_UPDATED"
                label = "Ingreso paciente" if not existing_patient else "Edito paciente"
                add_audit_event(conn, user, action, f"{label}: {patient_values['name']} ({patient_values['dni']})", item_id)
            return send_json(self, {"ok": True, "id": item_id})

        if parsed.path == "/api/patient-contact":
            # Resultado de una llamada de seguimiento. Cada resultado decide
            # cuando vuelve el paciente a la lista, para no llamarlo dos veces
            # por lo mismo ni perderlo si quedo en algo.
            user = require_role(self, {"ADMIN", "DOCTOR", "DOCTOR_TRABAJADOR", "RECEPCION"})
            if not user:
                return
            data = read_json(self)
            patient_id = str(data.get("patientId") or "").strip()
            result = str(data.get("result") or "").strip().upper()
            espera = {
                "VOLVERA": None,          # la fecha la indica quien llama
                "NO_CONTESTO": 3,
                "NUMERO_ERRADO": 365,
                "NO_INTERESA": 180,
                "SIN_RESULTADO": 7,
            }
            if result not in espera:
                return send_json(self, {"error": "Resultado de llamada no valido."}, 400)
            if not patient_id:
                return send_json(self, {"error": "Paciente no indicado."}, 400)

            hoy = today_lima()
            if result == "VOLVERA":
                snooze = str(data.get("snoozeUntil") or "").strip()[:10]
                if not valid_iso_date(snooze) or snooze <= hoy:
                    return send_json(self, {"error": "Indica para cuando quedo el paciente."}, 400)
            else:
                # add_days_iso y no date.fromisoformat: mas abajo do_POST asigna
                # una variable local llamada date, que tapa el import en toda la
                # funcion y hace fallar cualquier uso previo
                snooze = add_days_iso(hoy, espera[result])

            with db() as conn:
                existe = conn.execute("SELECT name FROM patients WHERE id = ?", (patient_id,)).fetchone()
                if not existe:
                    return send_json(self, {"error": "Paciente no encontrado."}, 404)
                conn.execute(
                    """
                    UPDATE patients
                    SET contact_date = ?, contact_result = ?, contact_note = ?,
                        contact_snooze = ?, contact_by = ?, updated_at = CURRENT_TIMESTAMP
                    WHERE id = ?
                    """,
                    (hoy, result, str(data.get("note") or "")[:400], snooze,
                     user["name"], patient_id),
                )
                add_audit_event(conn, user, "PATIENT_CONTACT",
                                f"Llamada a {existe['name']}: {result}", patient_id)
            return send_json(self, {"ok": True, "id": patient_id, "snoozeUntil": snooze})

        if parsed.path == "/api/appointments":
            if not require_role(self, {"ADMIN", "DOCTOR", "DOCTOR_TRABAJADOR", "RECEPCION"}):
                return
            data = read_json(self)
            if data.get("delete"):
                item_id = data.get("id")
                if not item_id:
                    return send_json(self, {"error": "Cita no indicada."}, 400)
                with db() as conn:
                    conn.execute("DELETE FROM appointments WHERE id = ?", (item_id,))
                return send_json(self, {"ok": True, "id": item_id})
            item_id = data.get("id") or now_id("appt")
            follow_up_status = data.get("followUpStatus") or data.get("follow_up_status") or ""
            follow_up_comment = data.get("followUpComment") or data.get("follow_up_comment") or ""
            new_appointment_id = data.get("newAppointmentId") or data.get("new_appointment_id") or ""
            reminder_sent_at = data.get("reminderSentAt") if "reminderSentAt" in data else data.get("reminder_sent_at")
            reminder_sent_by = data.get("reminderSentBy") if "reminderSentBy" in data else data.get("reminder_sent_by")
            free_statuses = {"CANCELADA", "REPROGRAMADA", "NO_ASISTIO"}
            with db() as conn:
                existing_appointment = conn.execute(
                    "SELECT id, status, patient_id, date, time, reminder_sent_at, reminder_sent_by FROM appointments WHERE id = ?",
                    (item_id,),
                ).fetchone()
                if reminder_sent_at is None and existing_appointment:
                    reminder_sent_at = existing_appointment["reminder_sent_at"] or ""
                if reminder_sent_by is None and existing_appointment:
                    reminder_sent_by = existing_appointment["reminder_sent_by"] or ""
                if data.get("status") not in free_statuses:
                    duplicate_patient = conn.execute(
                        """
                        SELECT appointments.time
                        FROM appointments
                        LEFT JOIN patients existing_patient ON existing_patient.id = appointments.patient_id
                        LEFT JOIN patients candidate_patient ON candidate_patient.id = ?
                        WHERE appointments.date = ?
                          AND appointments.id <> ?
                          AND appointments.status NOT IN ('CANCELADA', 'REPROGRAMADA', 'NO_ASISTIO')
                          AND (
                            appointments.patient_id = ?
                            OR UPPER(TRIM(COALESCE(existing_patient.name, ''))) = UPPER(TRIM(COALESCE(candidate_patient.name, '')))
                          )
                        LIMIT 1
                        """,
                        (data["patientId"], data["date"], item_id, data["patientId"]),
                    ).fetchone()
                    if duplicate_patient:
                        return send_json(self, {"error": f"Este paciente ya tiene una cita activa ese dia a las {duplicate_patient['time']}."}, 409)
                    conflict_unit = conn.execute(
                        "SELECT id FROM appointments WHERE date=? AND time=? AND unit=? AND id<>? AND status NOT IN ('CANCELADA', 'REPROGRAMADA', 'NO_ASISTIO')",
                        (data["date"], data["time"], data["unit"], item_id),
                    ).fetchone()
                    conflict_doctor = conn.execute(
                        "SELECT id FROM appointments WHERE date=? AND time=? AND doctor=? AND id<>? AND status NOT IN ('CANCELADA', 'REPROGRAMADA', 'NO_ASISTIO')",
                        (data["date"], data["time"], data["doctor"], item_id),
                    ).fetchone()
                    if conflict_unit:
                        return send_json(self, {"error": "La unidad ya esta ocupada en esa hora."}, 409)
                    if conflict_doctor:
                        return send_json(self, {"error": "El doctor ya tiene una cita en esa hora."}, 409)
                conn.execute(
                    """
                    INSERT INTO appointments (
                      id, date, time, unit, doctor, patient_id, service, duration, status, notes,
                      follow_up_status, follow_up_comment, new_appointment_id, reminder_sent_at, reminder_sent_by
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ON CONFLICT(id) DO UPDATE SET
                      date=excluded.date, time=excluded.time, unit=excluded.unit,
                      doctor=excluded.doctor, patient_id=excluded.patient_id,
                      service=excluded.service, duration=excluded.duration,
                      status=excluded.status, notes=excluded.notes,
                      follow_up_status=excluded.follow_up_status,
                      follow_up_comment=excluded.follow_up_comment,
                      new_appointment_id=excluded.new_appointment_id,
                      reminder_sent_at=excluded.reminder_sent_at,
                      reminder_sent_by=excluded.reminder_sent_by,
                      updated_at=CURRENT_TIMESTAMP
                    """,
                    (
                        item_id,
                        data["date"],
                        data["time"],
                        data["unit"],
                        data["doctor"],
                        data["patientId"],
                        data["service"],
                        data.get("duration"),
                        data["status"],
                        data.get("notes", ""),
                        follow_up_status,
                        follow_up_comment,
                        new_appointment_id,
                        reminder_sent_at or "",
                        reminder_sent_by or "",
                    ),
                )
                patient = conn.execute("SELECT name FROM patients WHERE id = ?", (data["patientId"],)).fetchone()
                audit_event = appointment_audit_event(data, existing_appointment, patient["name"] if patient else "")
                if audit_event:
                    action, detail = audit_event
                    add_audit_event(conn, user, action, detail, data["patientId"])
            return send_json(self, {"ok": True, "id": item_id})

        if parsed.path == "/api/clinical-history":
            if not require_role(self, {"ADMIN", "DOCTOR", "DOCTOR_TRABAJADOR"}):
                return
            data = read_json(self)
            item_id = data.get("id") or now_id("hist")
            with db() as conn:
                conn.execute(
                    """
                    INSERT INTO clinical_history (
                      id, patient_id, date, attended_by, attended, reason, anamnesis,
                      exam, diagnosis, plan, procedure_done, instructions, agreed_price,
                      credit_pending, credit_amount, credit_due_date, credit_note
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ON CONFLICT(id) DO UPDATE SET
                      patient_id=excluded.patient_id, date=excluded.date,
                      attended_by=excluded.attended_by, attended=excluded.attended,
                      reason=excluded.reason, anamnesis=excluded.anamnesis,
                      exam=excluded.exam, diagnosis=excluded.diagnosis,
                      plan=excluded.plan, procedure_done=excluded.procedure_done,
                      instructions=excluded.instructions, agreed_price=excluded.agreed_price,
                      credit_pending=excluded.credit_pending, credit_amount=excluded.credit_amount,
                      credit_due_date=excluded.credit_due_date, credit_note=excluded.credit_note,
                      updated_at=CURRENT_TIMESTAMP
                    """,
                    (
                        item_id,
                        data["patientId"],
                        data["date"],
                        data["attendedBy"],
                        1 if data.get("attended", True) else 0,
                        data.get("reason", ""),
                        data.get("anamnesis", ""),
                        data.get("exam", ""),
                        data.get("diagnosis", ""),
                        data.get("plan", ""),
                        data.get("procedure", ""),
                        data.get("instructions", ""),
                        float(data.get("agreedPrice") or 0),
                        1 if data.get("creditPending") else 0,
                        float(data.get("creditAmount") or data.get("agreedPrice") or 0),
                        data.get("creditDueDate", ""),
                        data.get("creditNote", ""),
                    ),
                )
                if data.get("attended", True):
                    conn.execute(
                        """
                        UPDATE patients
                        SET status = 'ACTIVO', updated_at = CURRENT_TIMESTAMP
                        WHERE id = ?
                        """,
                        (data["patientId"],),
                    )
                    conn.execute(
                        """
                        UPDATE appointments
                        SET status = 'ATENDIDA', updated_at = CURRENT_TIMESTAMP
                        WHERE patient_id = ? AND date = ?
                        """,
                        (data["patientId"], data["date"]),
                    )
                    conn.execute(
                        """
                        UPDATE appointments
                        SET follow_up_status = 'CERRADO', updated_at = CURRENT_TIMESTAMP
                        WHERE new_appointment_id IN (
                          SELECT id FROM appointments WHERE patient_id = ? AND date = ?
                        )
                        """,
                        (data["patientId"], data["date"]),
                    )
            return send_json(self, {"ok": True, "id": item_id})

        if parsed.path == "/api/receivables":
            user = require_role(self, {"ADMIN", "DOCTOR", "DOCTOR_TRABAJADOR", "RECEPCION"})
            if not user:
                return
            data = read_json(self)
            item_id = data.get("id") or now_id("hist")
            edit_amount = bool(data.get("editAmount"))
            with db() as conn:
                existing = conn.execute("SELECT id FROM clinical_history WHERE id = ?", (item_id,)).fetchone()
                if existing and (edit_amount or normalize_role(user["role"]) == "RECEPCION"):
                    if normalize_role(user["role"]) not in {"ADMIN", "DOCTOR"}:
                        return send_json(self, {"error": "Solo doctores y administrador pueden editar el monto."}, 403)
                conn.execute(
                    """
                    INSERT INTO clinical_history (
                      id, patient_id, date, attended_by, attended, reason, anamnesis,
                      exam, diagnosis, plan, procedure_done, instructions, agreed_price,
                      credit_pending, credit_amount, credit_due_date, credit_note
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ON CONFLICT(id) DO UPDATE SET
                      agreed_price=excluded.agreed_price,
                      credit_amount=excluded.credit_amount,
                      credit_due_date=excluded.credit_due_date,
                      credit_note=excluded.credit_note,
                      updated_at=CURRENT_TIMESTAMP
                    """,
                    (
                        item_id,
                        data["patientId"],
                        data.get("date") or date.today().isoformat(),
                        data.get("attendedBy", ""),
                        1,
                        data.get("reason", "Cuenta por cobrar"),
                        data.get("anamnesis", ""),
                        data.get("exam", ""),
                        data.get("diagnosis", ""),
                        data.get("plan", ""),
                        data.get("procedure", ""),
                        data.get("instructions", ""),
                        float(data.get("agreedPrice") or data.get("creditAmount") or 0),
                        1,
                        float(data.get("creditAmount") or data.get("agreedPrice") or 0),
                        data.get("creditDueDate", ""),
                        data.get("creditNote", ""),
                    ),
                )
            return send_json(self, {"ok": True, "id": item_id})

        if parsed.path == "/api/treatments":
            if not require_role(self, {"ADMIN", "DOCTOR", "DOCTOR_TRABAJADOR"}):
                return
            data = read_json(self)
            item_id = data.get("id") or now_id("t")
            with db() as conn:
                conn.execute(
                    """
                    INSERT INTO treatments (id, patient_id, service, teeth, budget, status, notes)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                    ON CONFLICT(id) DO UPDATE SET
                      patient_id=excluded.patient_id, service=excluded.service,
                      teeth=excluded.teeth, budget=excluded.budget,
                      status=excluded.status, notes=excluded.notes,
                      updated_at=CURRENT_TIMESTAMP
                    """,
                    (
                        item_id,
                        data["patientId"],
                        data["service"],
                        data.get("teeth", ""),
                        float(data.get("budget") or 0),
                        data["status"],
                        data.get("notes", ""),
                    ),
                )
            return send_json(self, {"ok": True, "id": item_id})

        if parsed.path == "/api/odontogram":
            if not require_role(self, {"ADMIN", "DOCTOR"}):
                return
            data = read_json(self)
            item_id = data.get("id") or now_id("odo")
            with db() as conn:
                conn.execute(
                    """
                    INSERT INTO odontogram (id, patient_id, tooth, condition, note, findings)
                    VALUES (?, ?, ?, ?, ?, ?)
                    ON CONFLICT(patient_id, tooth) DO UPDATE SET
                      condition=excluded.condition, note=excluded.note,
                      findings=excluded.findings,
                      updated_at=CURRENT_TIMESTAMP
                    """,
                    (
                        item_id,
                        data["patientId"],
                        data["tooth"],
                        data["condition"],
                        data.get("note", ""),
                        data.get("findings", ""),
                    ),
                )
                row = conn.execute(
                    "SELECT id FROM odontogram WHERE patient_id=? AND tooth=?",
                    (data["patientId"], data["tooth"]),
                ).fetchone()
            return send_json(self, {"ok": True, "id": row["id"] if row else item_id})

        if parsed.path == "/api/inventory-products":
            if not require_role(self, {"ADMIN", "DOCTOR", "DOCTOR_TRABAJADOR", "RECEPCION"}):
                return
            data = read_json(self)
            item_id = data.get("id") or now_id("prod")
            name = re.sub(r"\s+", " ", str(data.get("name") or "").strip()).upper()
            if not name:
                return send_json(self, {"error": "Ingresa el nombre del producto."}, 400)
            price = float(data.get("price") or 0)
            stock = float(data.get("stock") or 0)
            min_stock = float(data.get("minStock") or data.get("min_stock") or 0)
            if price < 0 or stock < 0 or min_stock < 0:
                return send_json(self, {"error": "Precio y stock no pueden ser negativos."}, 400)
            with db() as conn:
                conn.execute(
                    """
                    INSERT INTO inventory_products (id, name, unit, price, stock, min_stock, active)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                    ON CONFLICT(id) DO UPDATE SET
                      name=excluded.name, unit=excluded.unit, price=excluded.price,
                      stock=excluded.stock, min_stock=excluded.min_stock,
                      active=excluded.active, updated_at=CURRENT_TIMESTAMP
                    """,
                    (
                        item_id,
                        name,
                        str(data.get("unit") or "Unidad").strip() or "Unidad",
                        price,
                        stock,
                        min_stock,
                        1 if data.get("active", True) else 0,
                    ),
                )
                snapshot = inventory_snapshot(conn)
            return send_json(self, {"ok": True, "id": item_id, **snapshot})

        if parsed.path == "/api/inventory-movements":
            if not require_role(self, {"ADMIN", "DOCTOR", "DOCTOR_TRABAJADOR", "RECEPCION"}):
                return
            data = read_json(self)
            item_id = data.get("id") or now_id("mov")
            product_id = str(data.get("productId") or data.get("product_id") or "").strip()
            movement_type = str(data.get("type") or "").strip().upper()
            quantity = float(data.get("quantity") or 0)
            if movement_type not in {"ENTRADA", "SALIDA", "AJUSTE"}:
                return send_json(self, {"error": "Movimiento de inventario no valido."}, 400)
            if quantity <= 0:
                return send_json(self, {"error": "La cantidad debe ser mayor a cero."}, 400)
            with db() as conn:
                product = conn.execute("SELECT * FROM inventory_products WHERE id = ? AND active = 1", (product_id,)).fetchone()
                if not product:
                    return send_json(self, {"error": "Producto no encontrado."}, 404)
                signed_qty = quantity if movement_type == "ENTRADA" else -quantity
                if movement_type in {"SALIDA", "AJUSTE"} and float(product["stock"] or 0) < quantity:
                    return send_json(self, {"error": "No hay stock suficiente."}, 400)
                unit_price = float(data.get("unitPrice") or data.get("unit_price") or product["price"] or 0)
                conn.execute(
                    "UPDATE inventory_products SET stock = stock + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
                    (signed_qty, product_id),
                )
                conn.execute(
                    """
                    INSERT INTO inventory_movements (id, product_id, date, type, quantity, unit_price, total, detail, payment_id)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        item_id,
                        product_id,
                        data.get("date") or today_lima(),
                        movement_type,
                        quantity,
                        unit_price,
                        quantity * unit_price,
                        str(data.get("detail") or "").strip(),
                        data.get("paymentId") or None,
                    ),
                )
                snapshot = inventory_snapshot(conn)
            return send_json(self, {"ok": True, "id": item_id, **snapshot})

        if parsed.path == "/api/payments":
            if not require_role(self, {"ADMIN", "DOCTOR", "DOCTOR_TRABAJADOR", "RECEPCION"}):
                return
            try:
                data = read_json(self)
                if data.get("delete"):
                    if not require_role(self, {"ADMIN"}):
                        return
                    item_id = data.get("id")
                    if not item_id:
                        return send_json(self, {"error": "Pago no indicado."}, 400)
                    with db() as conn:
                        row = conn.execute("SELECT id FROM payments WHERE id = ?", (item_id,)).fetchone()
                        if not row:
                            return send_json(self, {"error": "Pago no encontrado."}, 404)
                        reverse_payment_inventory(conn, item_id)
                        conn.execute("DELETE FROM payments WHERE id = ?", (item_id,))
                        snapshot = inventory_snapshot(conn)
                    return send_json(self, {"ok": True, "id": item_id, **snapshot})
                item_id = data.get("id") or now_id("pay")
                amount = float(data.get("amount") or 0)
                method = str(data.get("method") or "").upper()
                product_items = data.get("productItems") if isinstance(data.get("productItems"), list) else []
                products_total = sum(float(item.get("quantity") or 0) * float(item.get("price") or item.get("unitPrice") or 0) for item in product_items)
                split = {
                    "cash_amount": float(data.get("cashAmount") or 0),
                    "yape_amount": float(data.get("yapeAmount") or 0),
                    "plin_amount": float(data.get("plinAmount") or 0),
                    "card_amount": float(data.get("cardAmount") or 0),
                    "transfer_amount": float(data.get("transferAmount") or 0),
                }
                if method == "MIXTO":
                    if round(sum(split.values()), 2) != round(amount, 2):
                        return send_json(self, {"error": "La suma del pago mixto debe coincidir con el monto que paga."}, 400)
                else:
                    split = {key: 0.0 for key in split}
                    method_map = {
                        "EFECTIVO": "cash_amount",
                        "YAPE": "yape_amount",
                        "PLIN": "plin_amount",
                        "TARJETA": "card_amount",
                        "TRANSFERENCIA": "transfer_amount",
                    }
                    if method in method_map:
                        split[method_map[method]] = amount
                cash_portion = float(split["cash_amount"] or 0)
                cash_received = float(data.get("cashReceived") or cash_portion or 0) if cash_portion > 0 else 0.0
                with db() as conn:
                    payment_date = data.get("date") or open_cash_date(conn) or today_lima()
                    patient = conn.execute(
                        "SELECT name, dni, phone, birth_date FROM patients WHERE id = ?",
                        (data.get("patientId"),),
                    ).fetchone()
                    if not patient:
                        return send_json(self, {"error": "Paciente no encontrado."}, 404)
                    missing_patient_fields = []
                    if not str(patient["name"] or "").strip():
                        missing_patient_fields.append("nombre completo")
                    if not str(patient["dni"] or "").strip():
                        missing_patient_fields.append("DNI")
                    if not str(patient["phone"] or "").strip():
                        missing_patient_fields.append("numero de celular")
                    if not str(patient["birth_date"] or "").strip():
                        missing_patient_fields.append("fecha de nacimiento")
                    if missing_patient_fields:
                        return send_json(
                            self,
                            {"error": "Antes de registrar el pago, completa los datos del paciente: " + ", ".join(missing_patient_fields) + "."},
                            400,
                        )
                    history_id = str(data.get("historyId") or "").strip()
                    if history_id:
                        history = conn.execute("SELECT agreed_price FROM clinical_history WHERE id = ?", (history_id,)).fetchone()
                        if not history:
                            return send_json(self, {"error": "Selecciona una atencion pendiente valida."}, 400)
                        paid = conn.execute(
                            "SELECT COALESCE(SUM(amount - COALESCE(product_total, 0)), 0) AS total FROM payments WHERE history_id = ? AND id <> ?",
                            (history_id, item_id),
                        ).fetchone()["total"]
                        due = max(0, float(history["agreed_price"] or 0) - float(paid or 0))
                        care_amount = amount - products_total
                        if amount <= 0 or care_amount <= 0 or care_amount > due:
                            return send_json(self, {"error": "El monto debe ser mayor a cero y no puede superar el saldo pendiente."}, 400)
                    elif data.get("appointmentId"):
                        appointment = conn.execute(
                            "SELECT id, patient_id, date, status FROM appointments WHERE id = ?",
                            (data.get("appointmentId"),),
                        ).fetchone()
                        if not appointment or appointment["patient_id"] != data["patientId"] or appointment["date"] != payment_date:
                            return send_json(self, {"error": "Selecciona una cita valida del dia para registrar el pago."}, 400)
                        if str(appointment["status"] or "").upper() in {"CANCELADA", "NO_ASISTIO", "REPROGRAMADA"}:
                            return send_json(self, {"error": "No se puede cobrar una cita cancelada, no asistida o reprogramada."}, 400)
                        if amount <= 0:
                            return send_json(self, {"error": "El monto debe ser mayor a cero."}, 400)
                    elif product_items:
                        if amount <= 0:
                            return send_json(self, {"error": "El monto debe ser mayor a cero."}, 400)
                    else:
                        return send_json(self, {"error": "Selecciona una atencion pendiente, una cita del dia o un producto."}, 400)
                    receipt_value = data.get("receipt", "")
                    if data.get("appointmentId") and not str(receipt_value or "").strip():
                        appointment_service = conn.execute(
                            "SELECT service FROM appointments WHERE id = ?",
                            (data.get("appointmentId"),),
                        ).fetchone()
                        receipt_value = "Cita del dia: " + str(appointment_service["service"] if appointment_service else "Servicio")
                    if product_items and "Productos:" not in str(receipt_value or ""):
                        product_labels = []
                        for item in product_items:
                            product = conn.execute(
                                "SELECT name FROM inventory_products WHERE id = ?",
                                (str(item.get("productId") or item.get("product_id") or ""),),
                            ).fetchone()
                            if product:
                                product_labels.append(f"{float(item.get('quantity') or 0):g} {product['name']}")
                        if product_labels:
                            receipt_value = (str(receipt_value or "").strip() + " | " if str(receipt_value or "").strip() else "") + "Productos: " + ", ".join(product_labels)
                    conn.execute(
                        """
                        INSERT INTO payments (
                          id, patient_id, history_id, appointment_id, date, amount, product_total, cash_received,
                          change_amount, cash_amount, yape_amount, plin_amount,
                          card_amount, transfer_amount, method, receipt, closed
                        )
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        ON CONFLICT(id) DO UPDATE SET
                          patient_id=excluded.patient_id, history_id=excluded.history_id,
                          appointment_id=excluded.appointment_id,
                          date=excluded.date, amount=excluded.amount,
                          product_total=excluded.product_total,
                          cash_received=excluded.cash_received,
                          change_amount=excluded.change_amount,
                          cash_amount=excluded.cash_amount,
                          yape_amount=excluded.yape_amount,
                          plin_amount=excluded.plin_amount,
                          card_amount=excluded.card_amount,
                          transfer_amount=excluded.transfer_amount,
                          method=excluded.method, receipt=excluded.receipt,
                          closed=excluded.closed
                        """,
                        (
                            item_id,
                            data["patientId"],
                            history_id or None,
                            data.get("appointmentId") or None,
                            payment_date,
                            amount,
                            products_total,
                            cash_received,
                            max(0, cash_received - cash_portion),
                            split["cash_amount"],
                            split["yape_amount"],
                            split["plin_amount"],
                            split["card_amount"],
                            split["transfer_amount"],
                            method,
                            receipt_value,
                            1 if data.get("closed") else 0,
                        ),
                    )
                    if data.get("appointmentId"):
                        conn.execute(
                            "UPDATE appointments SET status = 'ATENDIDA' WHERE id = ?",
                            (data.get("appointmentId"),),
                        )
                    apply_payment_inventory(conn, item_id, payment_date, product_items)
                    snapshot = inventory_snapshot(conn)
                return send_json(self, {"ok": True, "id": item_id, **snapshot})
            except Exception as exc:
                return send_json(self, {"error": f"No se pudo guardar el pago: {exc}"}, 500)

        if parsed.path == "/api/electronic-receipts":
            if not require_role(self, {"ADMIN", "DOCTOR_TRABAJADOR", "RECEPCION"}):
                return
            data = read_json(self)
            item_id = data.get("id") or now_id("cpe")
            receipt_type = str(data.get("type") or "").upper()
            if receipt_type not in {"BOLETA", "FACTURA"}:
                return send_json(self, {"error": "Selecciona boleta o factura."}, 400)
            series = str(data.get("series") or "").strip().upper()
            number = int(data.get("number") or 0)
            customer_doc = str(data.get("customerDoc") or "").strip()
            customer_doc_type = str(data.get("customerDocType") or ("RUC" if receipt_type == "FACTURA" else "DNI")).strip().upper()
            customer_name = str(data.get("customerName") or "").strip()
            if receipt_type == "FACTURA" and (customer_doc_type != "RUC" or len(customer_doc) != 11):
                return send_json(self, {"error": "La factura requiere RUC de 11 digitos."}, 400)
            if receipt_type == "BOLETA" and not customer_doc:
                return send_json(self, {"error": "La boleta requiere documento del paciente."}, 400)
            if not series or number <= 0:
                return send_json(self, {"error": "Serie y correlativo obligatorios."}, 400)
            if not customer_name:
                return send_json(self, {"error": "Nombre o razon social obligatoria."}, 400)
            with db() as conn:
                patient = conn.execute("SELECT id FROM patients WHERE id = ?", (data.get("patientId"),)).fetchone()
                if not patient:
                    return send_json(self, {"error": "Paciente no encontrado."}, 404)
                try:
                    conn.execute(
                        """
                        INSERT INTO electronic_receipts (
                          id, payment_id, patient_id, type, series, number, issue_date,
                          customer_doc_type, customer_doc, customer_name, customer_address, description,
                          quantity, unit_value, total, tax_condition, igv, status, notes
                        )
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        ON CONFLICT(id) DO UPDATE SET
                          payment_id=excluded.payment_id,
                          patient_id=excluded.patient_id,
                          type=excluded.type,
                          series=excluded.series,
                          number=excluded.number,
                          issue_date=excluded.issue_date,
                          customer_doc_type=excluded.customer_doc_type,
                          customer_doc=excluded.customer_doc,
                          customer_name=excluded.customer_name,
                          customer_address=excluded.customer_address,
                          description=excluded.description,
                          quantity=excluded.quantity,
                          unit_value=excluded.unit_value,
                          total=excluded.total,
                          tax_condition=excluded.tax_condition,
                          igv=excluded.igv,
                          status=excluded.status,
                          notes=excluded.notes,
                          updated_at=CURRENT_TIMESTAMP
                        """,
                        (
                            item_id,
                            # cadena vacia rompe la clave foranea: sin pago va nulo
                            data.get("paymentId") or None,
                            data.get("patientId"),
                            receipt_type,
                            series,
                            number,
                            data.get("issueDate") or today_lima(),
                            customer_doc_type,
                            customer_doc,
                            customer_name,
                            data.get("customerAddress", ""),
                            data.get("description", "Servicio odontologico"),
                            float(data.get("quantity") or 1),
                            float(data.get("unitValue") or data.get("total") or 0),
                            float(data.get("total") or 0),
                            "EXONERADO",
                            0,
                            data.get("status") or "BORRADOR",
                            data.get("notes", ""),
                        ),
                    )
                except Exception as exc:
                    if "unique" in str(exc).lower() or "duplicate" in str(exc).lower():
                        return send_json(self, {"error": "Ese numero de comprobante ya existe."}, 400)
                    raise
            return send_json(self, {"ok": True, "id": item_id})

        # ---------- Facturacion electronica ante SUNAT ----------
        if parsed.path == "/api/sunat/emitir":
            if not require_role(self, {"ADMIN", "DOCTOR_TRABAJADOR", "RECEPCION"}):
                return
            data = read_json(self)
            comprobante_id = str(data.get("id") or "").strip()
            if not comprobante_id:
                return send_json(self, {"error": "Comprobante no indicado."}, 400)
            try:
                with db() as conn:
                    resultado = sunat_emision.emitir(conn, comprobante_id)
            except Exception as error:
                return send_json(self, {"error": str(error)}, 400)
            return send_json(self, {"ok": True, **resultado})

        if parsed.path == "/api/sunat/resumen":
            if not require_role(self, {"ADMIN", "DOCTOR_TRABAJADOR", "RECEPCION"}):
                return
            data = read_json(self)
            # por defecto el dia anterior, que es lo que toca informar
            fecha = str(data.get("fecha") or "").strip()
            if not fecha:
                ayer = date.fromisoformat(today_lima()) - timedelta(days=1)
                fecha = ayer.isoformat()
            try:
                with db() as conn:
                    resultado = sunat_emision.enviar_resumen_diario(conn, fecha)
            except Exception as error:
                return send_json(self, {"error": str(error)}, 400)
            return send_json(self, {"ok": True, "fecha": fecha, **resultado})

        if parsed.path == "/api/sunat/revisar":
            if not require_role(self, {"ADMIN", "DOCTOR_TRABAJADOR", "RECEPCION"}):
                return
            data = read_json(self)
            ticket = str(data.get("ticket") or "").strip()
            try:
                with db() as conn:
                    if ticket:
                        return send_json(self, {"ok": True, **sunat_emision.revisar_resumen(conn, ticket)})
                    revisados = []
                    for fila in sunat_emision.resumenes_sin_respuesta(conn):
                        try:
                            revisados.append({
                                "ticket": fila["ticket"],
                                **sunat_emision.revisar_resumen(conn, fila["ticket"]),
                            })
                        except Exception as error:
                            revisados.append({"ticket": fila["ticket"], "error": str(error)[:200]})
                    return send_json(self, {"ok": True, "revisados": revisados})
            except Exception as error:
                return send_json(self, {"error": str(error)}, 400)

        if parsed.path == "/api/sunat/correlativo":
            if not require_role(self, {"ADMIN"}):
                return
            data = read_json(self)
            serie = str(data.get("serie") or "").strip().upper()
            siguiente = int(data.get("siguiente") or 0)
            if not serie or siguiente <= 0:
                return send_json(self, {"error": "Indica la serie y el siguiente numero."}, 400)
            with db() as conn:
                sunat_emision.fijar_correlativo(conn, serie, siguiente)
            return send_json(self, {"ok": True, "serie": serie, "siguiente": siguiente})

        if parsed.path == "/api/expenses":
            if not require_role(self, {"ADMIN", "DOCTOR_TRABAJADOR", "RECEPCION"}):
                return
            data = read_json(self)
            if data.get("delete"):
                if not require_role(self, {"ADMIN"}):
                    return
                item_id = data.get("id")
                if not item_id:
                    return send_json(self, {"error": "Egreso no indicado."}, 400)
                with db() as conn:
                    row = conn.execute("SELECT id FROM expenses WHERE id = ?", (item_id,)).fetchone()
                    if not row:
                        return send_json(self, {"error": "Egreso no encontrado."}, 404)
                    conn.execute("DELETE FROM expenses WHERE id = ?", (item_id,))
                return send_json(self, {"ok": True, "id": item_id})
            item_id = data.get("id") or now_id("exp")
            with db() as conn:
                expense_date = data.get("date") or open_cash_date(conn) or today_lima()
                conn.execute(
                    """
                    INSERT INTO expenses (
                      id, date, detail, amount, method, source, receipt,
                      category, person, type, closed
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ON CONFLICT(id) DO UPDATE SET
                      date=excluded.date, detail=excluded.detail, amount=excluded.amount,
                      method=excluded.method, source=excluded.source, receipt=excluded.receipt,
                      category=excluded.category, person=excluded.person, type=excluded.type,
                      closed=excluded.closed
                    """,
                    (
                        item_id,
                        expense_date,
                        data["detail"],
                        float(data.get("amount") or 0),
                        data["method"],
                        data["source"],
                        data.get("receipt", ""),
                        data.get("category", ""),
                        data.get("person", ""),
                        data.get("type", ""),
                        1 if data.get("closed") else 0,
                    ),
                )
            return send_json(self, {"ok": True, "id": item_id})

        if parsed.path == "/api/petty-cash":
            if not require_role(self, {"ADMIN", "DOCTOR"}):
                return
            data = read_json(self)
            amount = float(data.get("amount") or 0)
            date = data.get("date")
            with db() as conn:
                conn.execute(
                    """
                    INSERT INTO petty_cash_allocations (id, date, amount)
                    VALUES (?, ?, ?)
                    ON CONFLICT(date) DO UPDATE SET amount=excluded.amount, updated_at=CURRENT_TIMESTAMP
                    """,
                    (data.get("id") or now_id("petty"), date, amount),
                )
                session = conn.execute("SELECT id FROM cash_sessions WHERE date=? AND closed_at IS NULL", (date,)).fetchone()
                if session:
                    conn.execute("UPDATE cash_sessions SET opening_cash=? WHERE id=?", (amount, session["id"]))
            return send_json(self, {"ok": True})

        if parsed.path == "/api/config":
            if not require_role(self, {"ADMIN"}):
                return
            data = read_json(self)
            values = {}
            if "generalCashOpening" in data:
                values["generalCashOpening"] = data["generalCashOpening"]
            if "generalBankOpening" in data:
                values["generalBankOpening"] = data["generalBankOpening"]
            if "generalUtilityOpening" in data:
                values["generalUtilityOpening"] = data["generalUtilityOpening"]
            if "monthlyOpenings" in data:
                values["monthlyOpenings"] = data["monthlyOpenings"]
            if "clinicName" in data:
                values["clinicName"] = data["clinicName"]
            for key in ["start", "end", "interval", "inactiveDays", "enableAgendaPayments", "whatsapp", "doctors", "units"]:
                if key in data:
                    values[key] = data[key]
            if "services" in data:
                values["services"] = data["services"]
            if "servicesCustomized" in data:
                values["servicesCustomized"] = data["servicesCustomized"]
            set_config(values)
            return send_json(self, {"ok": True})

        if parsed.path == "/api/reset-operational":
            if not require_role(self, {"ADMIN"}):
                return
            with db() as conn:
                for table in [
                    "electronic_receipts",
                    "payments",
                    "expenses",
                    "cash_sessions",
                    "petty_cash_allocations",
                    "odontogram",
                    "treatments",
                    "clinical_history",
                    "appointments",
                    "patients",
                ]:
                    conn.execute(f"DELETE FROM {table}")
                conn.execute(
                    "INSERT INTO app_config (key, value) VALUES ('generalCashOpening', '0') ON CONFLICT(key) DO UPDATE SET value='0'"
                )
                conn.execute(
                    "INSERT INTO app_config (key, value) VALUES ('generalBankOpening', '0') ON CONFLICT(key) DO UPDATE SET value='0'"
                )
                conn.execute(
                    "INSERT INTO app_config (key, value) VALUES ('generalUtilityOpening', '0') ON CONFLICT(key) DO UPDATE SET value='0'"
                )
            return send_json(self, {"ok": True})

        if parsed.path == "/api/cash/open":
            if not require_role(self, {"ADMIN", "DOCTOR_TRABAJADOR", "RECEPCION"}):
                return
            data = read_json(self)
            date = data.get("date")
            opening_cash = float(data.get("openingCash") or 0)
            with db() as conn:
                existing = conn.execute(
                    "SELECT date FROM cash_sessions WHERE closed_at IS NULL ORDER BY opened_at ASC LIMIT 1"
                ).fetchone()
                if existing:
                    return send_json(
                        self,
                        {"error": f"La caja de {existing['date']} sigue abierta. Primero debes cerrar esa caja antes de abrir otra."},
                        409,
                    )
                existing_for_date = conn.execute(
                    "SELECT date FROM cash_sessions WHERE date=? LIMIT 1",
                    (date,),
                ).fetchone()
                if existing_for_date:
                    return send_json(
                        self,
                        {"error": f"La caja de {date} ya fue registrada. Selecciona esa fecha para revisar sus pagos."},
                        409,
                    )
                item_id = data.get("id") or now_id("cash")
                conn.execute(
                    """
                    INSERT INTO cash_sessions (id, date, opening_cash, opened_at)
                    VALUES (?, ?, ?, ?)
                    """,
                    (item_id, date, opening_cash, data.get("openedAt") or time.strftime("%Y-%m-%dT%H:%M:%S")),
                )
            return send_json(self, {"ok": True, "id": item_id})

        if parsed.path == "/api/cash/close":
            if not require_role(self, {"ADMIN", "DOCTOR_TRABAJADOR", "RECEPCION"}):
                return
            data = read_json(self)
            date = data.get("date")
            included_dates = data.get("includedDates") or [date]
            included_dates = [str(item) for item in included_dates if item]
            if date and date not in included_dates:
                included_dates.append(date)
            closing_cash = float(data.get("closingCash") or 0)
            with db() as conn:
                session = conn.execute("SELECT * FROM cash_sessions WHERE date=? AND closed_at IS NULL", (date,)).fetchone()
                if not session:
                    return send_json(self, {"error": "Primero abre la caja del dia."}, 400)
                placeholders = ",".join(["?"] * len(included_dates))
                income = conn.execute(
                    f"SELECT COALESCE(SUM(amount), 0) AS total FROM payments WHERE date IN ({placeholders}) AND closed=0",
                    included_dates,
                ).fetchone()["total"]
                expenses = conn.execute(
                    f"SELECT COALESCE(SUM(amount), 0) AS total FROM expenses WHERE date IN ({placeholders}) AND closed=0 AND source <> 'CAJA_GENERAL'",
                    included_dates,
                ).fetchone()["total"]
                expected = float(session["opening_cash"] or 0) + float(income or 0) - float(expenses or 0)
                difference = closing_cash - expected
                if abs(difference) > 0.009:
                    return send_json(
                        self,
                        {
                            "error": (
                                f"No puedes cerrar caja con diferencia. Esperado S/ {expected:.2f}, "
                                f"contado S/ {closing_cash:.2f}, diferencia S/ {difference:.2f}."
                            )
                        },
                        400,
                    )
                conn.execute(
                    """
                    UPDATE cash_sessions
                    SET closing_cash=?, difference=?, income_total=?, expense_total=?, closed_at=?
                    WHERE id=?
                    """,
                    (closing_cash, difference, income, expenses, data.get("closedAt") or time.strftime("%Y-%m-%dT%H:%M:%S"), session["id"]),
                )
                extra_open_dates = [item for item in included_dates if item != date]
                if extra_open_dates:
                    extra_placeholders = ",".join(["?"] * len(extra_open_dates))
                    conn.execute(
                        f"DELETE FROM cash_sessions WHERE date IN ({extra_placeholders}) AND closed_at IS NULL",
                        extra_open_dates,
                    )
                conn.execute(f"UPDATE payments SET closed=1 WHERE date IN ({placeholders})", included_dates)
                conn.execute(f"UPDATE expenses SET closed=1 WHERE date IN ({placeholders})", included_dates)
                conn.execute(
                    """
                    INSERT INTO petty_cash_allocations (id, date, amount)
                    VALUES (?, ?, 0)
                    ON CONFLICT(date) DO UPDATE SET amount=0, updated_at=CURRENT_TIMESTAMP
                    """,
                    (now_id("petty"), date),
                )
            return send_json(self, {"ok": True, "difference": difference})

        send_json(self, {"error": "Ruta no encontrada"}, 404)


def main():
    init_db()
    port = int(os.environ.get("PORT", "8787"))
    host = os.environ.get("HOST") or ("0.0.0.0" if os.environ.get("RENDER") or os.environ.get("RAILWAY_ENVIRONMENT") else "127.0.0.1")
    server = ThreadingHTTPServer((host, port), DentalHandler)
    print(f"Sistema dental con base de datos: http://127.0.0.1:{port}/index.html")
    if host in {"0.0.0.0", ""}:
        print(f"Acceso desde otras laptops: http://{local_ip()}:{port}/index.html")
    print(f"Base de datos: {DB_PATH}")
    server.serve_forever()


def local_ip():
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as sock:
            sock.connect(("8.8.8.8", 80))
            return sock.getsockname()[0]
    except OSError:
        return socket.gethostbyname(socket.gethostname())


if __name__ == "__main__":
    main()
