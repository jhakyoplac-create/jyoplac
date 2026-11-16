"""Fotos y radiografias del paciente en el Google Drive del consultorio
(pedido 2026-11-15, igual que en el dental de EmpresaFacil).

El dueño conecta un Gmail una sola vez. El permiso de Google es solo
drive.file: la app ve unicamente los archivos que ella misma subio, nunca el
resto del Drive ni los correos. La llave que deja Google (el refresh token)
se guarda aqui en la base, cifrada; el navegador nunca la ve. Asi la PC, la
tablet y el celular ven las fotos solo con haber entrado al sistema.

En el Drive queda: «CM - Fotos de pacientes / NOMBRE - DNI / foto.jpg», con una
subcarpeta «miniaturas» por paciente. El tipo, la fecha y quien la subio van en
las appProperties de cada archivo y la nota en su descripcion: la lista sale
del Drive mismo y no engorda la base.

Tambien entran documentos en PDF (2026-11-16): resultados de laboratorio,
informes y el consentimiento firmado a mano. Y en la misma cuenta, aparte, se
guarda el respaldo del consultorio cuando el administrador lo pide: carpeta
«CM - Respaldos», las ultimas 30 copias. Nada de eso es automatico.

Usa el proyecto «EmpresaFacil» de Google Cloud. Necesita en Render
GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET, y la direccion de vuelta
https://<este sitio>/api/drive/vuelta cargada en ese cliente de Google.
"""

from datetime import date
import base64
import hashlib
import hmac
import json
import os
import re
import secrets
import time
import urllib.error
import urllib.parse
import urllib.request
import uuid

PERMISO = "https://www.googleapis.com/auth/drive.file"
DRIVE = "https://www.googleapis.com/drive/v3"
SUBIDA = "https://www.googleapis.com/upload/drive/v3/files"
CARPETA = "application/vnd.google-apps.folder"
CAMPOS = "id,name,mimeType,size,createdTime,description,appProperties"
TIPOS = ("radiografia", "intraoral", "extraoral", "antes-despues", "consentimiento", "documento", "otros")
MAX_FOTO = 8 * 1024 * 1024
MAX_PDF = 15 * 1024 * 1024
MAX_MINI = 400 * 1024
PDF = "application/pdf"
MAX_RESPALDO = 40 * 1024 * 1024
CUANTOS_RESPALDOS = 30
CAMPOS_RESPALDO = "id,name,size,createdTime,appProperties"
CONSULTORIO = "cm"


class DriveError(Exception):
    def __init__(self, mensaje, status=424, desconectado=False):
        super().__init__(mensaje)
        self.status = status
        self.desconectado = desconectado


def _cliente():
    return (os.environ.get("GOOGLE_CLIENT_ID") or "").strip(), (os.environ.get("GOOGLE_CLIENT_SECRET") or "").strip()


def configurado():
    cid, secreto = _cliente()
    return bool(cid and secreto)


def _secreto_propio():
    return os.environ.get("TOKEN_SECRET") or os.environ.get("ADMIN_PASSWORD", "cm-odontologia-local-secret")


# ---------- Firmas y cifrado ----------

def _b64url(datos):
    return base64.urlsafe_b64encode(datos).decode("ascii").rstrip("=")


def _de_b64url(texto):
    return base64.urlsafe_b64decode(texto + "=" * (-len(texto) % 4))


def _firma(texto):
    _, secreto = _cliente()
    return _b64url(hmac.new(secreto.encode("utf-8"), texto.encode("utf-8"), hashlib.sha256).digest())


def armar_viaje(datos):
    """El «state» del viaje a Google, firmado y con 15 minutos de vida."""
    cuerpo = _b64url(json.dumps({**datos, "x": int(time.time()) + 900, "n": secrets.token_hex(6)}).encode("utf-8"))
    return f"{cuerpo}.{_firma(cuerpo)}"


def leer_viaje(viaje):
    try:
        cuerpo, firma = str(viaje or "").split(".", 1)
        if not hmac.compare_digest(firma, _firma(cuerpo)):
            return None
        datos = json.loads(_de_b64url(cuerpo).decode("utf-8"))
        return datos if datos.get("x", 0) > time.time() else None
    except Exception:
        return None


def _llave_de_cifrado():
    return hashlib.sha256(f"google-drive|{_secreto_propio()}".encode("utf-8")).digest()


def cifrar(conexion):
    from cryptography.hazmat.primitives.ciphers.aead import AESGCM
    iv = secrets.token_bytes(12)
    datos = AESGCM(_llave_de_cifrado()).encrypt(iv, json.dumps(conexion).encode("utf-8"), None)
    return json.dumps({"iv": _b64url(iv), "datos": _b64url(datos)})


def descifrar(texto):
    from cryptography.hazmat.primitives.ciphers.aead import AESGCM
    try:
        sobre = json.loads(texto)
        claro = AESGCM(_llave_de_cifrado()).decrypt(_de_b64url(sobre["iv"]), _de_b64url(sobre["datos"]), None)
        return json.loads(claro.decode("utf-8"))
    except Exception:
        return None


# ---------- La conexion (en la base) ----------

def leer_conexion(db):
    with db() as conn:
        fila = conn.execute("SELECT datos FROM google_drive WHERE id = ?", ("principal",)).fetchone()
    return descifrar(fila["datos"]) if fila else None


def guardar_conexion(db, conexion):
    with db() as conn:
        conn.execute(
            """
            INSERT INTO google_drive (id, datos, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(id) DO UPDATE SET datos = excluded.datos, updated_at = CURRENT_TIMESTAMP
            """,
            ("principal", cifrar(conexion)),
        )


def borrar_conexion(db):
    with db() as conn:
        conn.execute("DELETE FROM google_drive WHERE id = ?", ("principal",))


# ---------- Google ----------

def _pedir(url, metodo="GET", cuerpo=None, cabeceras=None, binario=False):
    peticion = urllib.request.Request(url, data=cuerpo, method=metodo, headers=cabeceras or {})
    try:
        with urllib.request.urlopen(peticion, timeout=60) as respuesta:
            datos = respuesta.read()
            if binario:
                return datos, respuesta.headers.get("Content-Type", "image/jpeg")
            return json.loads(datos.decode("utf-8")) if datos else {}
    except urllib.error.HTTPError as error:
        try:
            detalle = json.loads(error.read().decode("utf-8"))
        except Exception:
            detalle = {}
        raise _error_de_google(error.code, detalle)
    except (urllib.error.URLError, TimeoutError, OSError):
        raise DriveError("No se pudo hablar con Google. Vuelve a intentarlo.")


def _error_de_google(status, detalle):
    if isinstance(detalle.get("error"), str):
        error = DriveError(detalle.get("error_description") or detalle["error"], status)
        error.codigo = detalle["error"]
        return error
    mensaje = (detalle.get("error") or {}).get("message") or f"Google Drive respondio {status}."
    if status == 403 and re.search(r"storageQuotaExceeded|quota", mensaje, re.I):
        mensaje = "El Google Drive del consultorio esta lleno."
    return DriveError(mensaje, 404 if status == 404 else 424)


def enlace_de_google(vuelta, viaje):
    cid, _ = _cliente()
    parametros = urllib.parse.urlencode({
        "client_id": cid,
        "redirect_uri": vuelta,
        "response_type": "code",
        "scope": PERMISO,
        "access_type": "offline",
        # sin esto Google no vuelve a dar la llave si ya se conecto antes
        "prompt": "consent",
        "state": viaje,
    })
    return f"https://accounts.google.com/o/oauth2/v2/auth?{parametros}"


def pedir_llaves(campos):
    cid, secreto = _cliente()
    cuerpo = urllib.parse.urlencode({"client_id": cid, "client_secret": secreto, **campos}).encode("utf-8")
    return _pedir("https://oauth2.googleapis.com/token", "POST", cuerpo, {"Content-Type": "application/x-www-form-urlencoded"})


_llave_viva = {}


def llave_de_acceso(conexion):
    viva = _llave_viva.get("principal")
    if viva and viva["vence"] > time.time() + 60 and viva["refresh"] == conexion["refresh"]:
        return viva["llave"]
    try:
        datos = pedir_llaves({"grant_type": "refresh_token", "refresh_token": conexion["refresh"]})
    except DriveError as error:
        if getattr(error, "codigo", "") == "invalid_grant":
            raise DriveError("Google ya no da permiso a este sistema en ese Drive. El dueño tiene que volver a conectarlo.", 409, desconectado=True)
        raise
    _llave_viva["principal"] = {"llave": datos["access_token"], "vence": time.time() + int(datos.get("expires_in", 3600)), "refresh": conexion["refresh"]}
    return datos["access_token"]


def _drive(llave, ruta, metodo="GET", cuerpo=None, cabeceras=None, binario=False):
    url = ruta if ruta.startswith("http") else f"{DRIVE}{ruta}"
    datos = json.dumps(cuerpo).encode("utf-8") if isinstance(cuerpo, (dict, list)) else cuerpo
    extra = {"Content-Type": "application/json"} if isinstance(cuerpo, (dict, list)) else {}
    return _pedir(url, metodo, datos, {"Authorization": f"Bearer {llave}", **extra, **(cabeceras or {})}, binario)


def _comillas(texto):
    return str(texto).replace("\\", "\\\\").replace("'", "\\'")


def _buscar_uno(llave, consulta):
    parametros = urllib.parse.urlencode({"q": f"{consulta} and trashed = false", "fields": "files(id,name)", "pageSize": "1", "spaces": "drive"})
    archivos = _drive(llave, f"/files?{parametros}").get("files") or []
    return archivos[0] if archivos else None


def _crear_carpeta(llave, nombre, padre, propiedades):
    cuerpo = {"name": nombre, "mimeType": CARPETA, "appProperties": {"ef": "1", "empresa": CONSULTORIO, **propiedades}}
    if padre:
        cuerpo["parents"] = [padre]
    return _drive(llave, "/files?fields=id", "POST", cuerpo)["id"]


def carpeta_principal(llave):
    hallada = _buscar_uno(llave, f"appProperties has {{ key='rol' and value='raiz' }} and appProperties has {{ key='empresa' and value='{CONSULTORIO}' }}")
    return hallada["id"] if hallada else _crear_carpeta(llave, "CM - Fotos de pacientes", None, {"rol": "raiz"})


def _carpeta_del_paciente(llave, raiz, paciente, nombre):
    hallada = _buscar_uno(llave, f"'{_comillas(raiz)}' in parents and appProperties has {{ key='rol' and value='paciente' }} and appProperties has {{ key='paciente' and value='{_comillas(paciente)}' }}")
    return hallada["id"] if hallada else _crear_carpeta(llave, nombre or paciente, raiz, {"rol": "paciente", "paciente": paciente})


def _carpeta_de_miniaturas(llave, carpeta, paciente):
    hallada = _buscar_uno(llave, f"'{_comillas(carpeta)}' in parents and appProperties has {{ key='rol' and value='miniaturas' }}")
    return hallada["id"] if hallada else _crear_carpeta(llave, "miniaturas", carpeta, {"rol": "miniaturas", "paciente": paciente})


def _subir_archivo(llave, nombre, padre, mime, datos, propiedades, descripcion=""):
    limite = f"ef{uuid.uuid4().hex}"
    meta = {"name": nombre, "parents": [padre], "mimeType": mime, "appProperties": {"ef": "1", "empresa": CONSULTORIO, **propiedades}}
    if descripcion:
        meta["description"] = descripcion
    cuerpo = (
        f"--{limite}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n{json.dumps(meta)}\r\n--{limite}\r\nContent-Type: {mime}\r\n\r\n"
    ).encode("utf-8") + datos + f"\r\n--{limite}--".encode("utf-8")
    return _drive(llave, f"{SUBIDA}?uploadType=multipart&fields={CAMPOS}", "POST", cuerpo, {"Content-Type": f"multipart/related; boundary={limite}"})


def a_foto(archivo):
    p = archivo.get("appProperties") or {}
    return {
        "id": archivo["id"],
        "nombre": archivo.get("name", ""),
        "tipo": p.get("tipo", "otros"),
        "fecha": p.get("fecha") or str(archivo.get("createdTime", ""))[:10],
        "subio": p.get("subio", ""),
        "subidoEl": archivo.get("createdTime", ""),
        "nota": archivo.get("description", ""),
        "mini": p.get("mini", ""),
        "tamano": int(archivo.get("size") or 0),
        # un documento (laboratorio, informe, consentimiento firmado) y no una imagen
        "pdf": archivo.get("mimeType") == PDF,
    }


def _texto(valor, largo):
    return re.sub(r"[\x00-\x1f]", " ", str(valor if valor is not None else "")).strip()[:largo]


def _tipo_real(b):
    if b[:3] == b"\xff\xd8\xff":
        return "image/jpeg"
    if b[:4] == b"\x89PNG":
        return "image/png"
    if b[:4] == b"RIFF" and b[8:12] == b"WEBP":
        return "image/webp"
    # un PDF empieza con %PDF
    if b[:4] == b"%PDF":
        return PDF
    return ""


def _archivo_propio(llave, id_):
    if not re.match(r"^[\w-]{10,200}$", str(id_ or "")):
        return None
    try:
        archivo = _drive(llave, f"/files/{id_}?fields={CAMPOS},trashed")
    except DriveError:
        return None
    p = archivo.get("appProperties") or {}
    if archivo.get("trashed") or p.get("ef") != "1" or p.get("empresa") != CONSULTORIO:
        return None
    return archivo


# ---------- Lo que pide la pantalla ----------

def atender(db, accion, datos, usuario, vuelta):
    """Devuelve (respuesta, status) o (bytes, content-type) para «ver»."""
    if not configurado():
        return {"error": "Falta activar la conexión con Google Drive en el servidor.", "sinConfigurar": True}, 503

    if accion == "conectar":
        viaje = armar_viaje({"v": _texto(datos.get("volver"), 300), "p": _texto(usuario.get("name"), 80)})
        return {"url": enlace_de_google(vuelta, viaje)}, 200

    conexion = leer_conexion(db)
    if accion == "estado" and not conexion:
        return {"activo": True, "conectado": False}, 200
    if not conexion:
        return {"error": "Este consultorio todavía no conectó su Google Drive.", "desconectado": True}, 409

    if accion == "desconectar":
        try:
            _pedir(f"https://oauth2.googleapis.com/revoke?token={urllib.parse.quote(conexion['refresh'])}", "POST", b"")
        except DriveError:
            pass
        borrar_conexion(db)
        return {"conectado": False}, 200

    try:
        llave = llave_de_acceso(conexion)
    except DriveError as error:
        if error.desconectado:
            borrar_conexion(db)
            return {"error": str(error), "desconectado": True}, 409
        return {"error": "No se pudo hablar con Google. Vuelve a intentarlo."}, 424

    try:
        if accion == "estado":
            acerca = _drive(llave, "/about?fields=storageQuota(limit,usage)")
            cuota = acerca.get("storageQuota") or {}
            return {
                "activo": True, "conectado": True, "correo": conexion.get("correo", ""),
                "usado": int(cuota.get("usage") or 0), "total": int(cuota.get("limit") or 0),
            }, 200

        if accion == "subir":
            return _subir(db, llave, conexion, datos)

        if accion == "respaldo-estado":
            acerca = _drive(llave, "/about?fields=storageQuota(limit,usage)")
            cuota = acerca.get("storageQuota") or {}
            return {
                "conectado": True, "correo": conexion.get("correo", ""),
                "usado": int(cuota.get("usage") or 0), "total": int(cuota.get("limit") or 0),
                "copias": _listar_respaldos(llave)[:CUANTOS_RESPALDOS],
            }, 200

        if accion == "respaldo-guardar":
            return _guardar_respaldo(llave, datos, usuario)

        if accion == "respaldo-bajar":
            copia = _archivo_propio(llave, datos.get("id"))
            if not copia or (copia.get("appProperties") or {}).get("rol") != "respaldo":
                return {"error": "Esa copia ya no está en el Drive del consultorio."}, 404
            cuerpo, _ = _drive(llave, f"/files/{copia['id']}?alt=media", binario=True)
            return (cuerpo, "application/json; charset=utf-8"), "binario"

        if accion == "listar":
            paciente = _texto(datos.get("paciente"), 60)
            if not re.match(r"^[\w-]{1,60}$", paciente):
                return {"error": "Falta el paciente."}, 400
            q = " and ".join([
                f"appProperties has {{ key='empresa' and value='{CONSULTORIO}' }}",
                f"appProperties has {{ key='paciente' and value='{_comillas(paciente)}' }}",
                "appProperties has { key='rol' and value='foto' }",
                "trashed = false",
            ])
            fotos, pagina = [], ""
            while True:
                parametros = {"q": q, "fields": f"nextPageToken,files({CAMPOS})", "pageSize": "200", "orderBy": "createdTime desc", "spaces": "drive"}
                if pagina:
                    parametros["pageToken"] = pagina
                respuesta = _drive(llave, f"/files?{urllib.parse.urlencode(parametros)}")
                fotos.extend(a_foto(a) for a in respuesta.get("files") or [])
                pagina = respuesta.get("nextPageToken") or ""
                if not pagina or len(fotos) >= 2000:
                    break
            return {"fotos": fotos}, 200

        archivo = _archivo_propio(llave, datos.get("id"))
        # las fotos y los documentos: una copia de respaldo no se toca desde aqui
        if not archivo or (archivo.get("appProperties") or {}).get("rol") != "foto":
            return {"error": "Esa foto ya no está en el Drive del consultorio."}, 404
        p = archivo.get("appProperties") or {}

        if accion == "ver":
            id_ = p.get("mini") if datos.get("mini") and p.get("mini") else archivo["id"]
            return _drive(llave, f"/files/{id_}?alt=media", binario=True), "binario"

        if accion == "editar":
            propiedades = {}
            if datos.get("tipo") in TIPOS:
                propiedades["tipo"] = datos["tipo"]
            if re.match(r"^\d{4}-\d{2}-\d{2}$", str(datos.get("fecha") or "")):
                propiedades["fecha"] = datos["fecha"]
            cambios = {"appProperties": propiedades}
            if isinstance(datos.get("nota"), str):
                cambios["description"] = _texto(datos["nota"], 1000)
            editado = _drive(llave, f"/files/{archivo['id']}?fields={CAMPOS}", "PATCH", cambios)
            if p.get("mini"):
                try:
                    _drive(llave, f"/files/{p['mini']}?fields=id", "PATCH", {"appProperties": propiedades})
                except DriveError:
                    pass
            return {"foto": a_foto(editado)}, 200

        if accion == "borrar":
            _drive(llave, f"/files/{archivo['id']}?fields=id", "PATCH", {"trashed": True})
            if p.get("mini"):
                try:
                    _drive(llave, f"/files/{p['mini']}?fields=id", "PATCH", {"trashed": True})
                except DriveError:
                    pass
            return {"borrada": True}, 200

        return {"error": "Pedido no válido."}, 400
    except DriveError as error:
        return {"error": str(error)}, error.status


def _subir(db, llave, conexion, datos):
    try:
        foto = base64.b64decode(str(datos.get("foto") or ""), validate=True)
        mini = base64.b64decode(str(datos.get("mini") or ""), validate=True)
    except Exception:
        return {"error": "No llegó la foto."}, 400
    if not foto or not mini or len(foto) > MAX_PDF or len(mini) > MAX_MINI:
        return {"error": "El archivo pesa demasiado: las fotos hasta 8 MB y los PDF hasta 15 MB."}, 400
    mime, mime_mini = _tipo_real(foto), _tipo_real(mini)
    # la miniatura siempre es una imagen, tambien la de un PDF
    if not mime or not mime_mini or mime_mini == PDF:
        return {"error": "Solo se pueden subir fotos (JPG, PNG o WebP) y documentos en PDF."}, 400
    if mime != PDF and len(foto) > MAX_FOTO:
        return {"error": "La foto debe pesar menos de 8 MB."}, 400
    meta = datos.get("meta") or {}
    paciente = _texto(meta.get("paciente"), 60)
    if not re.match(r"^[\w-]{1,60}$", paciente):
        return {"error": "Falta el paciente."}, 400
    tipo = meta.get("tipo") if meta.get("tipo") in TIPOS else "otros"
    fecha = meta.get("fecha") if re.match(r"^\d{4}-\d{2}-\d{2}$", str(meta.get("fecha") or "")) else date.today().isoformat()
    nombre_paciente = _texto(meta.get("nombrePaciente"), 120) or paciente
    dni = re.sub(r"[^\dA-Za-z-]", "", _texto(meta.get("dni"), 15))

    # la carpeta principal pudo borrarse a mano desde el Drive: se rehace
    raiz = conexion.get("raiz")
    try:
        if not raiz or _drive(llave, f"/files/{raiz}?fields=id,trashed").get("trashed"):
            raise DriveError("sin carpeta")
    except DriveError:
        raiz = carpeta_principal(llave)
        guardar_conexion(db, {**conexion, "raiz": raiz})
    carpeta = _carpeta_del_paciente(llave, raiz, paciente, f"{nombre_paciente} - {dni}" if dni else nombre_paciente)
    miniaturas = _carpeta_de_miniaturas(llave, carpeta, paciente)
    base = re.sub(r'[\\/:*?"<>|]', "-", f"{fecha} {_texto(meta.get('tipoNombre'), 30) or tipo}")
    extension = {"image/png": "png", "image/webp": "webp", PDF: "pdf"}.get(mime, "jpg")
    propiedades = {"paciente": paciente, "tipo": tipo, "fecha": fecha, "subio": _texto(meta.get("subio"), 60)}
    chica = _subir_archivo(llave, f"{base}.jpg", miniaturas, mime_mini, mini, {**propiedades, "rol": "mini"})
    grande = _subir_archivo(llave, f"{base}.{extension}", carpeta, mime, foto, {**propiedades, "rol": "foto", "mini": chica["id"]}, _texto(meta.get("nota"), 1000))
    return {"foto": a_foto(grande)}, 200


# ---------- El respaldo del consultorio ----------

def _carpeta_de_respaldos(llave):
    hallada = _buscar_uno(llave, f"appProperties has {{ key='rol' and value='respaldos' }} and appProperties has {{ key='empresa' and value='{CONSULTORIO}' }}")
    return hallada["id"] if hallada else _crear_carpeta(llave, "CM - Respaldos", None, {"rol": "respaldos"})


def _a_copia(archivo):
    p = archivo.get("appProperties") or {}
    return {
        "id": archivo["id"],
        "nombre": archivo.get("name", ""),
        "dia": p.get("dia") or str(archivo.get("createdTime", ""))[:10],
        "creado": archivo.get("createdTime", ""),
        "tamano": int(archivo.get("size") or 0),
        "por": p.get("por", ""),
    }


def _listar_respaldos(llave):
    q = " and ".join([
        f"appProperties has {{ key='empresa' and value='{CONSULTORIO}' }}",
        "appProperties has { key='rol' and value='respaldo' }",
        "trashed = false",
    ])
    parametros = {"q": q, "fields": f"files({CAMPOS_RESPALDO})", "pageSize": "100", "orderBy": "createdTime desc", "spaces": "drive"}
    return [_a_copia(a) for a in _drive(llave, f"/files?{urllib.parse.urlencode(parametros)}").get("files") or []]


def _guardar_respaldo(llave, datos, usuario):
    """Guarda en el Drive el respaldo que arma la pantalla: el mismo archivo
    que baja «Exportar respaldo», que ya viene sin las claves de los usuarios."""
    respaldo = datos.get("respaldo")
    if not isinstance(respaldo, dict) or not isinstance(respaldo.get("patients"), list):
        return {"error": "No llegó el respaldo."}, 400
    cuerpo = json.dumps(respaldo, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
    if len(cuerpo) > MAX_RESPALDO:
        return {"error": "El respaldo pesa demasiado para guardarlo en Drive."}, 413
    # el dia y la hora del consultorio: Lima va cinco horas detras de UTC
    lima = time.gmtime(time.time() - 5 * 3600)
    dia, hora = time.strftime("%Y-%m-%d", lima), time.strftime("%H%M", lima)
    carpeta = _carpeta_de_respaldos(llave)
    subido = _subir_archivo(
        llave, f"respaldo-cm-odontologia-{dia}-{hora}.json", carpeta, "application/json", cuerpo,
        {"rol": "respaldo", "dia": dia, "por": _texto(usuario.get("name"), 60)},
    )
    # se conservan las ultimas: las mas antiguas van a la papelera de su Drive
    copias = _listar_respaldos(llave)
    for vieja in copias[CUANTOS_RESPALDOS:]:
        try:
            _drive(llave, f"/files/{vieja['id']}?fields=id", "PATCH", {"trashed": True})
        except DriveError:
            pass
    return {"copia": _a_copia({**subido, "size": subido.get("size") or len(cuerpo)}), "copias": copias[:CUANTOS_RESPALDOS]}, 200


def vuelta_de_google(db, parametros, vuelta):
    """Google vuelve aqui despues de aceptar. Devuelve la direccion a la que
    hay que mandar al navegador."""
    viaje = leer_viaje((parametros.get("state") or [""])[0])

    def volver(resultado, motivo=""):
        destino = urllib.parse.urlparse((viaje or {}).get("v") or "/")
        ruta = destino.path if destino.path.startswith("/") and not destino.netloc else "/"
        consulta = urllib.parse.parse_qs(destino.query)
        consulta["drive"] = [resultado]
        if motivo:
            consulta["drive_motivo"] = [motivo[:160]]
        return f"{ruta}?{urllib.parse.urlencode(consulta, doseq=True)}"

    if not configurado():
        return volver("error", "Falta activar la conexión con Google en el servidor.")
    if not viaje:
        return volver("error", "El enlace para conectar venció. Vuelve a tocar «Conectar Google Drive».")
    if parametros.get("error"):
        return volver("error", "No se dio el permiso en Google." if parametros["error"][0] == "access_denied" else "Google no completó la conexión.")
    codigo = (parametros.get("code") or [""])[0]
    if not codigo:
        return volver("error", "Google no completó la conexión.")
    try:
        llaves = pedir_llaves({"grant_type": "authorization_code", "code": codigo, "redirect_uri": vuelta})
        if not llaves.get("refresh_token"):
            return volver("error", "Google no entregó el permiso permanente. Vuelve a intentarlo.")
        if "drive.file" not in str(llaves.get("scope", "")):
            return volver("error", "Hay que marcar el permiso de Google Drive al conectar.")
        acerca = _drive(llaves["access_token"], "/about?fields=user(emailAddress)")
        raiz = carpeta_principal(llaves["access_token"])
        guardar_conexion(db, {
            "refresh": llaves["refresh_token"],
            "correo": (acerca.get("user") or {}).get("emailAddress", ""),
            "raiz": raiz,
            "conectadoEl": date.today().isoformat(),
            "conectadoPor": _texto(viaje.get("p"), 80),
        })
        return volver("ok")
    except DriveError as error:
        return volver("error", str(error))
