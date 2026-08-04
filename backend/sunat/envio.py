"""
Envio de comprobantes a SUNAT y lectura de su respuesta.

Las facturas se envian con sendBill y SUNAT responde de inmediato con el CDR.
Las boletas van en un resumen diario con sendSummary: SUNAT devuelve un ticket
y el resultado se consulta despues con getStatus, asi que la aceptacion no es
inmediata.

Port del transporte que ya usa la Edge Function de EmpresaFacil.
"""

import base64
import io
import os
import re
import urllib.error
import urllib.request
import zipfile

PRUEBAS = "pruebas"
PRODUCCION = "produccion"

ENDPOINTS = {
    PRUEBAS: "https://e-beta.sunat.gob.pe/ol-ti-itcpfegem-beta/billService",
    PRODUCCION: "https://e-factura.sunat.gob.pe/ol-ti-itcpfegem/billService",
}


def endpoint_de(modo):
    """El endpoint no es configurable a proposito: un error de configuracion no
    debe poder mandar a produccion algo que se creia de prueba."""
    if modo not in ENDPOINTS:
        raise ValueError("Modo SUNAT invalido: %r" % (modo,))
    return ENDPOINTS[modo]


def _escapar(valor):
    return (str(valor).replace("&", "&amp;").replace("<", "&lt;")
            .replace(">", "&gt;").replace('"', "&quot;"))


def _desescapar(valor):
    return (valor.replace("&lt;", "<").replace("&gt;", ">").replace("&quot;", '"')
            .replace("&apos;", "'").replace("&amp;", "&"))


def _primera_etiqueta(xml, nombre):
    patron = r"<(?:[\w.-]+:)?%s(?:\s[^>]*)?>([\s\S]*?)</(?:[\w.-]+:)?%s>" % (nombre, nombre)
    m = re.search(patron, xml, re.I)
    return _desescapar(m.group(1).strip()) if m else ""


def _todas_las_etiquetas(xml, nombre):
    patron = r"<(?:[\w.-]+:)?%s(?:\s[^>]*)?>([\s\S]*?)</(?:[\w.-]+:)?%s>" % (nombre, nombre)
    return [_desescapar(m.group(1).strip()) for m in re.finditer(patron, xml, re.I)]


def comprimir(nombre_archivo, contenido):
    """El comprobante viaja dentro de un ZIP con el nombre que exige SUNAT."""
    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr(nombre_archivo, contenido)
    return buffer.getvalue()


def _leer_cdr(cdr_zip):
    with zipfile.ZipFile(io.BytesIO(cdr_zip)) as z:
        nombres = [n for n in z.namelist() if n.lower().endswith(".xml")]
        if not nombres:
            raise RuntimeError("El ZIP de respuesta de SUNAT no contiene el XML del CDR.")
        nombre = nombres[0]
        cdr_xml = z.read(nombre)
    texto = cdr_xml.decode("utf-8", errors="replace")
    return {
        "codigo": _primera_etiqueta(texto, "ResponseCode"),
        "descripcion": (_primera_etiqueta(texto, "Description")
                        or _primera_etiqueta(texto, "DocumentDescription")),
        "notas": _todas_las_etiquetas(texto, "Note"),
        "cdr_zip": cdr_zip,
        "cdr_xml": cdr_xml,
        "cdr_nombre": nombre,
    }


def _verificar_sin_fault(xml):
    fault = _primera_etiqueta(xml, "faultstring")
    if fault:
        codigo = _primera_etiqueta(xml, "faultcode")
        raise RuntimeError("SUNAT %s: %s" % (codigo or "SOAP Fault", fault))


def _sobre(cuerpo, ruc, usuario_sol, clave_sol):
    return (
        '<?xml version="1.0" encoding="UTF-8"?>'
        '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"'
        ' xmlns:ser="http://service.sunat.gob.pe"'
        ' xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">'
        "<soapenv:Header><wsse:Security><wsse:UsernameToken>"
        "<wsse:Username>%s</wsse:Username>"
        "<wsse:Password>%s</wsse:Password>"
        "</wsse:UsernameToken></wsse:Security></soapenv:Header>"
        "<soapenv:Body>%s</soapenv:Body></soapenv:Envelope>"
    ) % (_escapar("%s%s" % (ruc, usuario_sol)), _escapar(clave_sol), cuerpo)


def _peticion_soap(modo, accion, sobre):
    tiempo = int(os.environ.get("SUNAT_HTTP_TIMEOUT_MS") or 30000)
    tiempo = min(120000, max(5000, tiempo)) / 1000.0
    peticion = urllib.request.Request(
        endpoint_de(modo),
        data=sobre.encode("utf-8"),
        headers={
            "Content-Type": "text/xml; charset=utf-8",
            "SOAPAction": "urn:%s" % accion,
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(peticion, timeout=tiempo) as respuesta:
            cuerpo = respuesta.read().decode("utf-8", errors="replace")
    except urllib.error.HTTPError as error:
        # un rechazo de negocio de SUNAT tambien llega como HTTP 500 con Fault
        cuerpo = error.read().decode("utf-8", errors="replace")
        if not _primera_etiqueta(cuerpo, "faultstring"):
            raise RuntimeError("SUNAT respondio HTTP %s." % error.code)
    _verificar_sin_fault(cuerpo)
    return cuerpo


def enviar_comprobante(modo, ruc, usuario_sol, clave_sol, nombre_archivo, zip_bytes):
    """Factura o boleta individual. Devuelve el CDR ya interpretado."""
    cuerpo = (
        "<ser:sendBill><fileName>%s</fileName><contentFile>%s</contentFile></ser:sendBill>"
        % (_escapar(nombre_archivo), base64.b64encode(zip_bytes).decode("ascii"))
    )
    respuesta = _peticion_soap(modo, "sendBill", _sobre(cuerpo, ruc, usuario_sol, clave_sol))
    _verificar_sin_fault(respuesta)
    contenido = _primera_etiqueta(respuesta, "applicationResponse")
    if not contenido:
        raise RuntimeError("SUNAT no devolvio un CDR en applicationResponse.")
    return _leer_cdr(base64.b64decode(contenido))


def enviar_resumen(modo, ruc, usuario_sol, clave_sol, nombre_archivo, zip_bytes):
    """Resumen diario de boletas. Devuelve el ticket para consultar despues."""
    cuerpo = (
        "<ser:sendSummary><fileName>%s</fileName><contentFile>%s</contentFile></ser:sendSummary>"
        % (_escapar(nombre_archivo), base64.b64encode(zip_bytes).decode("ascii"))
    )
    respuesta = _peticion_soap(modo, "sendSummary", _sobre(cuerpo, ruc, usuario_sol, clave_sol))
    ticket = _primera_etiqueta(respuesta, "ticket")
    if not ticket:
        raise RuntimeError("SUNAT no devolvio ticket para el resumen diario.")
    return ticket


def consultar_ticket(modo, ruc, usuario_sol, clave_sol, ticket):
    """Estado del resumen diario. El codigo 98 significa que sigue en proceso."""
    cuerpo = "<ser:getStatus><ticket>%s</ticket></ser:getStatus>" % _escapar(ticket)
    respuesta = _peticion_soap(modo, "getStatus", _sobre(cuerpo, ruc, usuario_sol, clave_sol))
    estado = _primera_etiqueta(respuesta, "statusCode")
    if not estado:
        raise RuntimeError("SUNAT no devolvio statusCode para el ticket.")
    if estado == "98":
        return {"estado": "98", "ticket": ticket, "en_proceso": True}
    contenido = _primera_etiqueta(respuesta, "content")
    if not contenido:
        raise RuntimeError("SUNAT devolvio estado %s sin CDR." % estado)
    resultado = _leer_cdr(base64.b64decode(contenido))
    resultado.update({"estado": estado, "ticket": ticket, "en_proceso": False})
    return resultado
