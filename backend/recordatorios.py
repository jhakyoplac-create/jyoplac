"""Recordatorios automaticos de citas por WhatsApp.

El que manda los mensajes no es este servidor: es el servicio de EmpresaFacil,
el mismo que avisa a los pacientes de sus otros consultorios, con un solo
numero de WhatsApp y una sola plantilla aprobada por Meta. Aqui solo hay dos
cosas:

  - darle a ese servicio las citas de mañana cuando las pide (citas_del_dia);
  - preguntarle que paso con cada aviso -si salio, si llego, que boton toco el
    paciente- y anotarlo en la cita (revisar), para que la agenda lo muestre.

Las dos van con una clave compartida, RECORDATORIOS_CLAVE, que se escribe en
Render y en los secretos del servicio. Sin esa variable nada de esto existe: la
direccion responde 404 y el servidor no le pregunta nada a nadie.

Que el paciente toque «Confirmar» marca la cita como confirmada, igual que el
boton de la agenda. «Reprogramar» no toca la cita: el consultorio llama y
decide; solo queda el aviso en la agenda y en Seguimiento de citas.
"""
from datetime import date, timedelta
import hmac
import json
import os
import threading
import time
import urllib.error
import urllib.request

CLAVE = os.environ.get("RECORDATORIOS_CLAVE", "").strip()
URL = (
    os.environ.get("RECORDATORIOS_URL", "").strip()
    or "https://bybapacmjcoupfhjrtee.supabase.co/functions/v1/whatsapp-recordatorios"
)
# Con que direccion se presenta este sistema: el servicio la compara con la que
# tiene anotada para el consultorio. Render la pone sola en RENDER_EXTERNAL_URL.
ORIGEN = (
    os.environ.get("RECORDATORIOS_ORIGEN", "").strip()
    or os.environ.get("RENDER_EXTERNAL_URL", "").strip()
    or "https://cm-odontologia-sistema.onrender.com"
).rstrip("/")

ENVIADO_POR = "WhatsApp automático"
CONFIRMA = "CONFIRMA"
# Las citas que no ocupan un turno tampoco se recuerdan: nadie tiene que venir.
SIN_TURNO = ("CANCELADA", "NO_ASISTIO", "REPROGRAMADA", "ATENDIDA")
PACIENTE_MOSTRADOR = "mostrador"

# Cada cuanto se le pregunta al servicio. Con el servicio encendido, cada cinco
# minutos: la respuesta del paciente tarda eso como mucho en verse en la agenda.
# Apagado o sin contratar, cada media hora, solo para notar que lo encendieron.
CADA_ENCENDIDO = 300
CADA_APAGADO = 1800
TRAS_UN_FALLO = 180
DIAS_HACIA_ATRAS = 2

_candado = threading.Lock()
_vuelta = {"proxima": 0.0, "corriendo": False, "servicio": None}


def configurado():
    return bool(CLAVE)


def clave_valida(recibida):
    return bool(CLAVE) and hmac.compare_digest(str(recibida or "").encode("utf-8"), CLAVE.encode("utf-8"))


def _dia(valor):
    return str(valor or "")[:10]


def citas_del_dia(db, fecha, hoy, config):
    """Lo que el servicio necesita para avisar: las citas de esa fecha que
    siguen en pie, con el nombre y el celular del paciente. «recordadas» son
    las que recepcion ya aviso a mano hoy o ayer: a esas no se les repite."""
    desde = (date.fromisoformat(hoy) - timedelta(days=1)).isoformat()
    marcas = ", ".join("?" for _ in SIN_TURNO)
    with db() as conn:
        filas = conn.execute(
            f"""
            SELECT a.id, a.date, a.time, a.status, a.doctor, a.patient_id,
                   a.reminder_sent_at, a.reminder_sent_by, p.name, p.phone
              FROM appointments a
              LEFT JOIN patients p ON p.id = a.patient_id
             WHERE a.date = ? AND a.status NOT IN ({marcas}) AND a.patient_id <> ?
             ORDER BY a.time ASC
            """,
            (fecha, *SIN_TURNO, PACIENTE_MOSTRADOR),
        ).fetchall()
    citas, pacientes, recordadas = [], {}, []
    for fila in filas:
        citas.append({
            "id": fila["id"],
            "date": _dia(fila["date"]),
            "time": str(fila["time"] or ""),
            "status": fila["status"] or "",
            "doctor": fila["doctor"] or "",
            "patientId": fila["patient_id"] or "",
        })
        pacientes[fila["patient_id"]] = {
            "id": fila["patient_id"] or "",
            "name": fila["name"] or "",
            "phone": fila["phone"] or "",
        }
        a_mano = (fila["reminder_sent_by"] or "") != ENVIADO_POR
        if a_mano and _dia(fila["reminder_sent_at"]) >= desde:
            recordadas.append(fila["id"])
    return {
        "ok": True,
        "fecha": fecha,
        "consultorio": str(config.get("clinicName") or "").strip(),
        "telefono": str(config.get("whatsapp") or "").strip(),
        "citas": citas,
        "pacientes": list(pacientes.values()),
        "recordadas": recordadas,
    }


def _leer(texto):
    if isinstance(texto, dict):
        return texto
    try:
        valor = json.loads(texto) if texto else None
    except (TypeError, ValueError):
        return None
    return valor if isinstance(valor, dict) else None


def _de_la_fila(fila):
    return {
        "fecha": _dia(fila.get("fecha")),
        "enviadoAt": fila.get("enviado_at") or "",
        "entrega": fila.get("entrega") or "enviado",
        "error": fila.get("error") or "",
        "respuesta": fila.get("respuesta") or "",
        "respuestaTexto": fila.get("respuesta_texto") or "",
        "respondidoAt": fila.get("respondido_at") or "",
    }


def aplicar(db, filas):
    """Vuelca sobre cada cita lo que el servicio sabe de su aviso. Devuelve
    cuantas citas cambiaron."""
    cambios = 0
    with db() as conn:
        for fila in filas or []:
            cita_id = str(fila.get("cita_id") or "")
            if not cita_id:
                continue
            cita = conn.execute(
                "SELECT id, date, whatsapp, reminder_sent_at, confirmada FROM appointments WHERE id = ?",
                (cita_id,),
            ).fetchone()
            # Si la cita se movio de dia despues del aviso, ese aviso ya no
            # habla de esta cita: se ignora y el servicio manda otro para la
            # fecha nueva.
            if not cita or _dia(cita["date"]) != _dia(fila.get("fecha")):
                continue
            nuevo = _de_la_fila(fila)
            previo = _leer(cita["whatsapp"])
            # «Ya lo atendi» se conserva mientras el paciente no vuelva a contestar.
            if previo and previo.get("atendidoAt") and previo.get("respondidoAt") == nuevo["respondidoAt"]:
                nuevo["atendidoAt"] = previo["atendidoAt"]
            # La marca de «ya se le aviso» es la que saca a la cita de la lista
            # de Recordatorios por enviar. Si un equipo con la copia vieja la
            # guardo encima y la borro, se vuelve a poner.
            enviado_at = cita["reminder_sent_at"] or ""
            enviado_por = None
            if nuevo["entrega"] != "fallido" and nuevo["enviadoAt"] and not enviado_at:
                enviado_at, enviado_por = nuevo["enviadoAt"], ENVIADO_POR
            if previo == nuevo and not enviado_por:
                continue
            # Confirmar es lo mismo que marcar «confirmado» en la agenda. Solo
            # la primera vez: si recepcion lo deshace a mano, no se vuelve a poner.
            confirmo = nuevo["respuesta"] == CONFIRMA and (previo or {}).get("respuesta") != CONFIRMA
            conn.execute(
                "UPDATE appointments SET whatsapp = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
                (json.dumps(nuevo, ensure_ascii=False), cita_id),
            )
            if enviado_por:
                conn.execute(
                    "UPDATE appointments SET reminder_sent_at = ?, reminder_sent_by = ? WHERE id = ?",
                    (enviado_at, enviado_por, cita_id),
                )
            if confirmo:
                conn.execute("UPDATE appointments SET confirmada = 1 WHERE id = ?", (cita_id,))
            cambios += 1
    return cambios


def marcar_atendido(conn, cita_id, cuando):
    """El consultorio ya hablo con el paciente que pidio reprogramar: el pedido
    deja de pedir atencion y la cita se queda como esta."""
    cita = conn.execute("SELECT whatsapp FROM appointments WHERE id = ?", (cita_id,)).fetchone()
    info = _leer(cita["whatsapp"]) if cita else None
    if not info:
        return False
    info["atendidoAt"] = str(cuando or "")[:40]
    conn.execute("UPDATE appointments SET whatsapp = ? WHERE id = ?", (json.dumps(info, ensure_ascii=False), cita_id))
    return True


def _preguntar(hoy):
    desde = (date.fromisoformat(hoy) - timedelta(days=DIAS_HACIA_ATRAS)).isoformat()
    pedido = urllib.request.Request(
        URL,
        data=json.dumps({"filas_de": ORIGEN, "desde": desde}).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": "CM-Odontologia/1.0",
            "x-recordatorios-clave": CLAVE,
        },
        method="POST",
    )
    with urllib.request.urlopen(pedido, timeout=20) as respuesta:
        return json.loads(respuesta.read().decode("utf-8") or "{}")


def _dar_la_vuelta(db, hoy):
    espera = TRAS_UN_FALLO
    try:
        datos = _preguntar(hoy)
        hora = datos.get("hora_envio")
        servicio = {
            "contratado": bool(datos.get("contratado")),
            "activo": bool(datos.get("activo")),
            # la medianoche es la hora 0, que no es lo mismo que «sin hora»
            "horaEnvio": int(hora) if hora is not None else 20,
        }
        aplicar(db, datos.get("filas") or [])
        _vuelta["servicio"] = servicio
        espera = CADA_ENCENDIDO if servicio["activo"] else CADA_APAGADO
    except Exception as error:  # la agenda no puede caerse porque el aviso falle
        print(f"[Recordatorios] no se pudo preguntar: {error}")
    finally:
        with _candado:
            _vuelta["proxima"] = time.time() + espera
            _vuelta["corriendo"] = False


def revisar(db, hoy, esperar=False):
    """Si ya toca, pregunta al servicio en segundo plano. Se llama cada vez que
    un equipo pide la agenda: no hay reloj propio, y de noche -sin nadie con el
    sistema abierto- no se pregunta nada."""
    if not CLAVE:
        return
    with _candado:
        if _vuelta["corriendo"] or time.time() < _vuelta["proxima"]:
            return
        _vuelta["corriendo"] = True
    if esperar:
        _dar_la_vuelta(db, hoy)
        return
    threading.Thread(target=_dar_la_vuelta, args=(db, hoy), daemon=True).start()


def servicio():
    """Lo ultimo que se supo: si el consultorio tiene el servicio y desde que
    hora salen los avisos. None mientras no se haya preguntado."""
    return _vuelta["servicio"]
