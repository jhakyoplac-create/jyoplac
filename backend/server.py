from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from datetime import date, datetime
from pathlib import Path
from urllib.parse import urlparse
import base64
import hashlib
import hmac
import json
import os
import re
import secrets
import socket
import sqlite3
import time
import uuid

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


ROOT = Path(__file__).resolve().parents[1]
DB_DIR = Path(os.environ.get("DATA_DIR", ROOT / "database"))
DB_PATH = DB_DIR / "dental.sqlite3"
SCHEMA_PATH = ROOT / "backend" / "schema.sql"
SESSION_SECONDS = int(os.environ.get("SESSION_SECONDS", 60 * 60 * 4))
DATABASE_URL = os.environ.get("DATABASE_URL", "").strip()
USE_POSTGRES = bool(DATABASE_URL)
TOKEN_SECRET = os.environ.get("TOKEN_SECRET") or os.environ.get("ADMIN_PASSWORD", "cm-odontologia-local-secret")

sessions = {}


def now_id(prefix):
    return f"{prefix}-{uuid.uuid4().hex[:12]}"


def today_lima():
    if ZoneInfo:
        return datetime.now(ZoneInfo("America/Lima")).date().isoformat()
    return date.today().isoformat()


def normalize_role(role):
    value = str(role or "").strip().upper()
    aliases = {
        "ADMINISTRADOR": "ADMIN",
        "RECEPCIONISTA": "RECEPCION",
        "RECEPCIÓN": "RECEPCION",
        "RECEPCION": "RECEPCION",
        "DOCTORA": "DOCTOR",
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


class CompatConnection:
    def __init__(self, conn, postgres=False):
        self.conn = conn
        self.postgres = postgres

    def __enter__(self):
        self.conn.__enter__()
        return self

    def __exit__(self, exc_type, exc, tb):
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


def db():
    if USE_POSTGRES:
        if psycopg is None:
            raise RuntimeError("Instala psycopg para usar DATABASE_URL con PostgreSQL.")
        return CompatConnection(psycopg.connect(DATABASE_URL, row_factory=dict_row), postgres=True)
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
    ensure_column(conn, "clinical_history", "credit_pending", "INTEGER NOT NULL DEFAULT 0")
    ensure_column(conn, "clinical_history", "credit_amount", "REAL NOT NULL DEFAULT 0")
    ensure_column(conn, "clinical_history", "credit_due_date", "TEXT")
    ensure_column(conn, "clinical_history", "credit_note", "TEXT")
    ensure_column(conn, "payments", "cash_amount", "REAL NOT NULL DEFAULT 0")
    ensure_column(conn, "payments", "yape_amount", "REAL NOT NULL DEFAULT 0")
    ensure_column(conn, "payments", "plin_amount", "REAL NOT NULL DEFAULT 0")
    ensure_column(conn, "payments", "card_amount", "REAL NOT NULL DEFAULT 0")
    ensure_column(conn, "payments", "transfer_amount", "REAL NOT NULL DEFAULT 0")
    ensure_column(conn, "appointments", "follow_up_status", "TEXT")
    ensure_column(conn, "appointments", "follow_up_comment", "TEXT")
    ensure_column(conn, "appointments", "new_appointment_id", "TEXT")


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


def list_table(table, order="created_at DESC"):
    with db() as conn:
        return [row_to_dict(row) for row in conn.execute(f"SELECT * FROM {table} ORDER BY {order}").fetchall()]


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

    def do_GET(self):
        parsed = urlparse(self.path)
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
        if parsed.path == "/api/bootstrap":
            return send_json(self, {
                "user": user,
                "patients": list_table("patients", "name ASC"),
                "appointments": list_table("appointments", "date DESC, time DESC"),
                "clinicalHistory": list_table("clinical_history", "date DESC"),
                "treatments": list_table("treatments", "created_at DESC"),
                "odontogram": list_table("odontogram", "patient_id ASC, tooth ASC"),
                "payments": list_table("payments", "date DESC, created_at DESC"),
                "expenses": list_table("expenses", "date DESC, created_at DESC"),
                "cashSessions": list_table("cash_sessions", "date DESC"),
                "pettyCashAllocations": list_table("petty_cash_allocations", "date DESC"),
                "auditEvents": list_audit_events(),
                "users": list_users() if user["role"] == "ADMIN" else [],
                "config": app_config(),
            })
        if parsed.path == "/api/patients":
            return send_json(self, {"patients": list_table("patients", "name ASC")})
        if parsed.path == "/api/appointments":
            return send_json(self, {"appointments": list_table("appointments", "date DESC, time DESC")})
        if parsed.path == "/api/clinical-history":
            return send_json(self, {"clinicalHistory": list_table("clinical_history", "date DESC, created_at DESC")})
        if parsed.path == "/api/treatments":
            return send_json(self, {"treatments": list_table("treatments", "created_at DESC")})
        if parsed.path == "/api/odontogram":
            return send_json(self, {"odontogram": list_table("odontogram", "patient_id ASC, tooth ASC")})
        if parsed.path == "/api/payments":
            return send_json(self, {"payments": list_table("payments", "date DESC, created_at DESC")})
        if parsed.path == "/api/expenses":
            return send_json(self, {"expenses": list_table("expenses", "date DESC, created_at DESC")})
        if parsed.path == "/api/cash-sessions":
            return send_json(self, {"cashSessions": list_table("cash_sessions", "date DESC")})
        if parsed.path == "/api/users":
            if not require_role(self, {"ADMIN"}):
                return
            return send_json(self, {"users": list_users()})
        if parsed.path == "/api/audit-events":
            if not require_role(self, {"ADMIN"}):
                return
            return send_json(self, {"auditEvents": list_audit_events()})

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
            expires_at = int(time.time() + SESSION_SECONDS)
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
            if not require_role(self, {"ADMIN", "DOCTOR", "RECEPCION"}):
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

        if parsed.path == "/api/appointments":
            if not require_role(self, {"ADMIN", "DOCTOR", "RECEPCION"}):
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
            free_statuses = {"CANCELADA", "REPROGRAMADA", "NO_ASISTIO"}
            with db() as conn:
                existing_appointment = conn.execute(
                    "SELECT id, status, patient_id, date, time FROM appointments WHERE id = ?",
                    (item_id,),
                ).fetchone()
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
                      follow_up_status, follow_up_comment, new_appointment_id
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ON CONFLICT(id) DO UPDATE SET
                      date=excluded.date, time=excluded.time, unit=excluded.unit,
                      doctor=excluded.doctor, patient_id=excluded.patient_id,
                      service=excluded.service, duration=excluded.duration,
                      status=excluded.status, notes=excluded.notes,
                      follow_up_status=excluded.follow_up_status,
                      follow_up_comment=excluded.follow_up_comment,
                      new_appointment_id=excluded.new_appointment_id,
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
                    ),
                )
                patient = conn.execute("SELECT name FROM patients WHERE id = ?", (data["patientId"],)).fetchone()
                audit_event = appointment_audit_event(data, existing_appointment, patient["name"] if patient else "")
                if audit_event:
                    action, detail = audit_event
                    add_audit_event(conn, user, action, detail, data["patientId"])
            return send_json(self, {"ok": True, "id": item_id})

        if parsed.path == "/api/clinical-history":
            if not require_role(self, {"ADMIN", "DOCTOR"}):
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

        if parsed.path == "/api/treatments":
            if not require_role(self, {"ADMIN", "DOCTOR"}):
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
                    INSERT INTO odontogram (id, patient_id, tooth, condition, note)
                    VALUES (?, ?, ?, ?, ?)
                    ON CONFLICT(patient_id, tooth) DO UPDATE SET
                      condition=excluded.condition, note=excluded.note,
                      updated_at=CURRENT_TIMESTAMP
                    """,
                    (
                        item_id,
                        data["patientId"],
                        data["tooth"],
                        data["condition"],
                        data.get("note", ""),
                    ),
                )
                row = conn.execute(
                    "SELECT id FROM odontogram WHERE patient_id=? AND tooth=?",
                    (data["patientId"], data["tooth"]),
                ).fetchone()
            return send_json(self, {"ok": True, "id": row["id"] if row else item_id})

        if parsed.path == "/api/payments":
            if not require_role(self, {"ADMIN", "DOCTOR", "RECEPCION"}):
                return
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
                    conn.execute("DELETE FROM payments WHERE id = ?", (item_id,))
                return send_json(self, {"ok": True, "id": item_id})
            item_id = data.get("id") or now_id("pay")
            amount = float(data.get("amount") or 0)
            method = str(data.get("method") or "").upper()
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
                payment_date = open_cash_date(conn) or data["date"]
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
                history = conn.execute("SELECT agreed_price FROM clinical_history WHERE id = ?", (data.get("historyId"),)).fetchone()
                if not history:
                    return send_json(self, {"error": "Selecciona una atencion pendiente valida."}, 400)
                paid = conn.execute(
                    "SELECT COALESCE(SUM(amount), 0) AS total FROM payments WHERE history_id = ? AND id <> ?",
                    (data.get("historyId"), item_id),
                ).fetchone()["total"]
                due = max(0, float(history["agreed_price"] or 0) - float(paid or 0))
                if amount <= 0 or amount > due:
                    return send_json(self, {"error": "El monto debe ser mayor a cero y no puede superar el saldo pendiente."}, 400)
                conn.execute(
                    """
                    INSERT INTO payments (
                      id, patient_id, history_id, date, amount, cash_received,
                      change_amount, cash_amount, yape_amount, plin_amount,
                      card_amount, transfer_amount, method, receipt, closed
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ON CONFLICT(id) DO UPDATE SET
                      patient_id=excluded.patient_id, history_id=excluded.history_id,
                      date=excluded.date, amount=excluded.amount,
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
                        data.get("historyId"),
                        payment_date,
                        amount,
                        cash_received,
                        max(0, cash_received - cash_portion),
                        split["cash_amount"],
                        split["yape_amount"],
                        split["plin_amount"],
                        split["card_amount"],
                        split["transfer_amount"],
                        method,
                        data.get("receipt", ""),
                        1 if data.get("closed") else 0,
                    ),
                )
            return send_json(self, {"ok": True, "id": item_id})

        if parsed.path == "/api/expenses":
            if not require_role(self, {"ADMIN", "RECEPCION"}):
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
                expense_date = open_cash_date(conn) or data["date"]
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
            if "clinicName" in data:
                values["clinicName"] = data["clinicName"]
            for key in ["start", "end", "interval", "inactiveDays", "whatsapp", "doctors", "units"]:
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
            return send_json(self, {"ok": True})

        if parsed.path == "/api/cash/open":
            if not require_role(self, {"ADMIN", "RECEPCION"}):
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
            if not require_role(self, {"ADMIN", "RECEPCION"}):
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
                date_params = [date] + included_dates
                conn.execute(
                    """
                    UPDATE cash_sessions
                    SET closing_cash=?, difference=?, income_total=?, expense_total=?, closed_at=?
                    WHERE id=?
                    """,
                    (closing_cash, difference, income, expenses, data.get("closedAt") or time.strftime("%Y-%m-%dT%H:%M:%S"), session["id"]),
                )
                conn.execute(f"UPDATE payments SET date=? WHERE date IN ({placeholders}) AND closed=0", date_params)
                conn.execute(f"UPDATE expenses SET date=? WHERE date IN ({placeholders}) AND closed=0", date_params)
                extra_open_dates = [item for item in included_dates if item != date]
                if extra_open_dates:
                    extra_placeholders = ",".join(["?"] * len(extra_open_dates))
                    conn.execute(
                        f"DELETE FROM cash_sessions WHERE date IN ({extra_placeholders}) AND closed_at IS NULL",
                        extra_open_dates,
                    )
                conn.execute("UPDATE payments SET closed=1 WHERE date=?", (date,))
                conn.execute("UPDATE expenses SET closed=1 WHERE date=?", (date,))
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
