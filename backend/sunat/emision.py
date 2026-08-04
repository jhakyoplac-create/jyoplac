"""
Emision de comprobantes ante SUNAT desde el sistema.

Las facturas se envian una por una y SUNAT responde al momento. Las boletas se
firman y se guardan, y se informan despues en el resumen diario, que tiene
plazo de siete dias calendario.

El numero de serie lo asigna la base de datos, no el navegador: dos cobros a la
vez no pueden tomar el mismo correlativo, porque SUNAT rechaza los duplicados y
un numero usado no se puede reciclar.
"""

import datetime
import json

from . import config
from .envio import comprimir, consultar_ticket, enviar_comprobante, enviar_resumen
from .importes import calcular
from .ubl import construir_comprobante_firmado, construir_resumen_firmado

# estados propios, para saber en que punto esta cada comprobante
PENDIENTE = "PENDIENTE"      # firmado, esperando el resumen diario
ENVIADO = "ENVIADO"          # el resumen salio, falta la respuesta de SUNAT
ACEPTADO = "ACEPTADO"
RECHAZADO = "RECHAZADO"
ERROR = "ERROR"

TIPO_DOCUMENTO = {"BOLETA": "03", "FACTURA": "01"}
# catalogo 06 de SUNAT
TIPO_DOC_CLIENTE = {"DNI": "1", "RUC": "6", "CE": "4", "PASAPORTE": "7"}


def _fila(conn, sql, params=()):
    return conn.execute(sql, params).fetchone()


def reservar_numero(conn, serie):
    """Devuelve el siguiente correlativo de la serie, de forma atomica.

    Se consume aunque despues falle el envio: SUNAT no permite reutilizar un
    numero, asi que es preferible perder uno a arriesgar un duplicado.
    """
    conn.execute(
        "INSERT INTO sunat_correlativos (serie, siguiente) VALUES (?, 1) "
        "ON CONFLICT(serie) DO NOTHING", (serie,))
    if conn.postgres:
        fila = _fila(conn,
                     "UPDATE sunat_correlativos SET siguiente = siguiente + 1 "
                     "WHERE serie = ? RETURNING siguiente", (serie,))
        return int(fila["siguiente"]) - 1
    conn.execute("UPDATE sunat_correlativos SET siguiente = siguiente + 1 WHERE serie = ?", (serie,))
    fila = _fila(conn, "SELECT siguiente FROM sunat_correlativos WHERE serie = ?", (serie,))
    return int(fila["siguiente"]) - 1


def fijar_correlativo(conn, serie, siguiente):
    """Deja la serie lista para continuar desde un numero concreto. Se usa al
    configurar, cuando la serie ya venia usandose en otro sistema."""
    conn.execute(
        "INSERT INTO sunat_correlativos (serie, siguiente) VALUES (?, ?) "
        "ON CONFLICT(serie) DO UPDATE SET siguiente = excluded.siguiente",
        (serie, int(siguiente)))


def _items_del_comprobante(fila):
    """El comprobante guarda una sola descripcion con su total.

    Todo sale exonerado por la Ley de la Amazonia; ver config.AFECTACION_FIJA.
    """
    cantidad = float(fila["quantity"] or 1) or 1
    total = float(fila["total"] or 0)
    return [{
        "descripcion": (fila["description"] or "Servicio odontologico")[:250],
        "cantidad": cantidad,
        "precio_unitario": total / cantidad,
        "unidad": "NIU",
        "afectacion": config.AFECTACION_FIJA,
    }]


def _datos_para_ubl(fila, serie, numero):
    tipo = str(fila["type"]).upper()
    emitido = str(fila["issue_date"] or "")[:10] or datetime.date.today().isoformat()
    return {
        "tipo_documento": TIPO_DOCUMENTO.get(tipo, "03"),
        "serie": serie,
        "numero": numero,
        "fecha_emision": emitido,
        "hora_emision": (str(fila["created_at"] or "")[11:19] or "00:00:00"),
        "moneda": "PEN",
        "emisor": config.emisor(),
        "cliente": {
            "tipo_documento": TIPO_DOC_CLIENTE.get(
                str(fila["customer_doc_type"] or "DNI").upper(), "1"),
            "numero_documento": str(fila["customer_doc"] or ""),
            "razon_social": str(fila["customer_name"] or ""),
            "direccion": str(fila["customer_address"] or ""),
        },
        "items": _items_del_comprobante(fila),
    }


def _guardar_estado(conn, comprobante_id, **campos):
    if not campos:
        return
    asignaciones = ", ".join("%s = ?" % k for k in campos)
    conn.execute(
        "UPDATE electronic_receipts SET %s, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
        % asignaciones,
        tuple(campos.values()) + (comprobante_id,))


def emitir(conn, comprobante_id):
    """Firma el comprobante y, si es factura, lo envia a SUNAT.

    Las boletas quedan en PENDIENTE hasta que salga el resumen diario.
    """
    if not config.configurado():
        raise RuntimeError("La facturacion electronica todavia no esta configurada.")

    fila = _fila(conn, "SELECT * FROM electronic_receipts WHERE id = ?", (comprobante_id,))
    if not fila:
        raise RuntimeError("Comprobante no encontrado.")
    if str(fila["sunat_estado"] or "") in (ACEPTADO, ENVIADO):
        raise RuntimeError("Este comprobante ya fue enviado a SUNAT.")

    tipo = str(fila["type"]).upper()
    serie = config.serie_de(tipo)
    # si ya se le habia reservado numero en esta serie, se conserva
    if str(fila["series"] or "").upper() == serie.upper() and int(fila["number"] or 0) > 0:
        numero = int(fila["number"])
    else:
        numero = reservar_numero(conn, serie)

    credenciales = config.credenciales()
    datos = _datos_para_ubl(fila, serie, numero)
    firmado = construir_comprobante_firmado(
        datos, credenciales["clave_privada_der"], credenciales["certificado_der"])

    nombre = "%s-%s-%s-%s" % (config.emisor()["numero_documento"],
                              datos["tipo_documento"], serie, numero)

    campos = {
        "series": serie,
        "number": numero,
        "sunat_xml": firmado["xml"],
        "sunat_hash": firmado["digest"],
        "sunat_nombre": nombre,
        "sunat_enviado_at": datetime.datetime.now().isoformat(timespec="seconds"),
    }

    if tipo == "FACTURA":
        zip_bytes = comprimir(nombre + ".xml", firmado["xml"].encode("utf-8"))
        try:
            cdr = enviar_comprobante(
                config.modo(), config.emisor()["numero_documento"],
                credenciales["usuario_sol"], credenciales["clave_sol"],
                nombre + ".zip", zip_bytes)
        except Exception as error:
            # el numero ya se consumio: queda registrado para no perderle el rastro
            campos.update({"sunat_estado": ERROR, "sunat_descripcion": str(error)[:400]})
            _guardar_estado(conn, comprobante_id, **campos)
            raise
        aceptado = str(cdr["codigo"]) == "0"
        campos.update({
            "sunat_estado": ACEPTADO if aceptado else RECHAZADO,
            "sunat_codigo": cdr["codigo"],
            "sunat_descripcion": (cdr["descripcion"] or "")[:400],
            "sunat_cdr": _b64(cdr["cdr_zip"]),
            "sunat_notas": json.dumps(cdr["notas"][:10], ensure_ascii=False),
        })
    else:
        campos.update({
            "sunat_estado": PENDIENTE,
            "sunat_descripcion": "Firmada. Se informara en el resumen diario.",
        })

    _guardar_estado(conn, comprobante_id, **campos)
    return {
        "id": comprobante_id,
        "serie": serie,
        "numero": numero,
        "estado": campos["sunat_estado"],
        "codigo": campos.get("sunat_codigo", ""),
        "descripcion": campos.get("sunat_descripcion", ""),
    }


def _b64(datos):
    import base64
    return base64.b64encode(datos).decode("ascii")


def boletas_pendientes(conn, fecha):
    """Boletas ya firmadas de un dia que aun no se informaron."""
    return conn.execute(
        "SELECT * FROM electronic_receipts "
        "WHERE type = 'BOLETA' AND sunat_estado = ? AND substr(issue_date, 1, 10) = ? "
        "ORDER BY number ASC",
        (PENDIENTE, fecha)).fetchall()


def enviar_resumen_diario(conn, fecha):
    """Informa en un solo envio todas las boletas firmadas de esa fecha."""
    if not config.configurado():
        raise RuntimeError("La facturacion electronica todavia no esta configurada.")

    filas = boletas_pendientes(conn, fecha)
    if not filas:
        return {"enviado": False, "motivo": "No hay boletas pendientes de esa fecha."}

    hoy = datetime.date.today().isoformat()
    # el correlativo del resumen es por dia de generacion: si no coincide con la
    # fecha del nombre del archivo, SUNAT lo rechaza con el error 2346
    numero = reservar_numero(conn, "RC-" + hoy)
    id_resumen = "RC-%s-%d" % (hoy.replace("-", ""), numero)

    boletas = []
    for fila in filas:
        boletas.append({
            "id_documento": "%s-%s" % (fila["series"], fila["number"]),
            "tipo_documento_cliente": TIPO_DOC_CLIENTE.get(
                str(fila["customer_doc_type"] or "DNI").upper(), "1"),
            "documento_cliente": str(fila["customer_doc"] or ""),
            "calculado": calcular(_items_del_comprobante(fila)),
        })

    credenciales = config.credenciales()
    ruc = config.emisor()["numero_documento"]
    resumen = construir_resumen_firmado({
        "id_resumen": id_resumen,
        "fecha_emision": hoy,
        "fecha_referencia": fecha,
        "ruc_emisor": ruc,
        "razon_social": config.emisor()["razon_social"],
        "boletas": boletas,
    }, credenciales["clave_privada_der"], credenciales["certificado_der"])

    nombre = "%s-%s" % (ruc, id_resumen)
    zip_bytes = comprimir(nombre + ".xml", resumen["xml"].encode("utf-8"))
    ticket = enviar_resumen(config.modo(), ruc, credenciales["usuario_sol"],
                            credenciales["clave_sol"], nombre + ".zip", zip_bytes)

    conn.execute(
        "INSERT INTO sunat_resumenes (id, fecha_referencia, ticket, estado, xml, comprobantes) "
        "VALUES (?, ?, ?, ?, ?, ?)",
        (id_resumen, fecha, ticket, ENVIADO, resumen["xml"],
         json.dumps([b["id_documento"] for b in boletas])))
    for fila in filas:
        _guardar_estado(conn, fila["id"], sunat_estado=ENVIADO, sunat_ticket=ticket,
                        sunat_descripcion="Informada en el resumen %s." % id_resumen)

    return {"enviado": True, "resumen": id_resumen, "ticket": ticket, "boletas": len(boletas)}


def revisar_resumen(conn, ticket):
    """Consulta el resultado de un resumen ya enviado y actualiza sus boletas."""
    credenciales = config.credenciales()
    estado = consultar_ticket(config.modo(), config.emisor()["numero_documento"],
                              credenciales["usuario_sol"], credenciales["clave_sol"], ticket)
    if estado.get("en_proceso"):
        return {"listo": False, "estado": "98"}

    aceptado = str(estado["codigo"]) == "0"
    nuevo = ACEPTADO if aceptado else RECHAZADO
    conn.execute(
        "UPDATE sunat_resumenes SET estado = ?, codigo = ?, descripcion = ?, cdr = ?, "
        "revisado_at = CURRENT_TIMESTAMP WHERE ticket = ?",
        (nuevo, estado["codigo"], (estado["descripcion"] or "")[:400],
         _b64(estado["cdr_zip"]), ticket))
    conn.execute(
        "UPDATE electronic_receipts SET sunat_estado = ?, sunat_codigo = ?, "
        "sunat_descripcion = ?, updated_at = CURRENT_TIMESTAMP WHERE sunat_ticket = ?",
        (nuevo, estado["codigo"], (estado["descripcion"] or "")[:400], ticket))
    return {"listo": True, "estado": nuevo, "codigo": estado["codigo"],
            "descripcion": estado["descripcion"]}


def resumenes_sin_respuesta(conn):
    return conn.execute(
        "SELECT ticket FROM sunat_resumenes WHERE estado = ? ORDER BY created_at ASC",
        (ENVIADO,)).fetchall()
