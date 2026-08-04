"""
Configuracion de la facturacion electronica.

Todo viene de variables de entorno de Render. El certificado y la Clave SOL
nunca se guardan en la base de datos ni salen al navegador: si alguien obtiene
una copia de la base, no puede emitir a nombre de la clinica.

Mientras no esten configuradas, el sistema sigue funcionando igual que siempre
y solo se registra el comprobante internamente, sin enviarlo a SUNAT.
"""

import base64
import os

from .envio import PRODUCCION, PRUEBAS
from .importes import EXONERADO

# La clinica esta en Moyobamba, San Martin: por la Ley 27037 de la Amazonia sus
# ventas y servicios en la zona estan exonerados del IGV. No se ofrece opcion de
# emitir gravado para que nadie pueda cobrar por error un impuesto que no
# corresponde; el dia que haga falta, se agrega de forma explicita.
AFECTACION_FIJA = EXONERADO


def _texto(nombre, defecto=""):
    return str(os.environ.get(nombre, defecto) or "").strip()


def modo():
    """Solo pruebas o produccion. Ante cualquier valor raro, pruebas."""
    return PRODUCCION if _texto("SUNAT_MODO").lower() == PRODUCCION else PRUEBAS


def emisor():
    return {
        "tipo_documento": "6",
        "numero_documento": _texto("SUNAT_RUC"),
        "razon_social": _texto("SUNAT_RAZON_SOCIAL"),
        "nombre_comercial": _texto("SUNAT_NOMBRE_COMERCIAL"),
        "direccion": _texto("SUNAT_DIRECCION"),
        "ubigeo": _texto("SUNAT_UBIGEO"),
        "departamento": _texto("SUNAT_DEPARTAMENTO"),
        "provincia": _texto("SUNAT_PROVINCIA"),
        "distrito": _texto("SUNAT_DISTRITO"),
        "codigo_establecimiento": _texto("SUNAT_ESTABLECIMIENTO", "0"),
    }


def serie_de(tipo):
    """Serie con la que emite este sistema.

    No se pueden reutilizar las series del portal de SUNAT (las que empiezan
    con E, como EB01 o E001): esas quedan reservadas al portal y mezclarlas
    provocaria numeros duplicados.
    """
    if str(tipo).upper() == "FACTURA":
        return _texto("SUNAT_SERIE_FACTURA", "F001")
    return _texto("SUNAT_SERIE_BOLETA", "B001")


def credenciales():
    """Usuario SOL secundario y material del certificado."""
    usuario = _texto("SUNAT_SOL_USER")
    clave = os.environ.get("SUNAT_SOL_PASSWORD") or ""
    clave_der = _texto("SUNAT_CERT_KEY_DER_B64")
    cert_der = _texto("SUNAT_CERT_DER_B64")
    if not (usuario and clave and clave_der and cert_der):
        raise RuntimeError(
            "Falta configurar la facturacion electronica: revisa SUNAT_SOL_USER, "
            "SUNAT_SOL_PASSWORD, SUNAT_CERT_KEY_DER_B64 y SUNAT_CERT_DER_B64.")
    try:
        return {
            "usuario_sol": usuario,
            "clave_sol": clave,
            "clave_privada_der": base64.b64decode(clave_der),
            "certificado_der": base64.b64decode(cert_der),
        }
    except Exception:
        raise RuntimeError("El certificado configurado no esta en base64 valido.")


def configurado():
    """True si se puede emitir. Se usa para no romper el sistema cuando la
    facturacion todavia no esta encendida."""
    try:
        credenciales()
    except RuntimeError:
        return False
    datos = emisor()
    return bool(datos["numero_documento"] and datos["razon_social"])


def resumen_configuracion():
    """Estado de la configuracion, sin exponer nada secreto."""
    datos = emisor()
    return {
        "configurado": configurado(),
        "modo": modo(),
        "ruc": datos["numero_documento"],
        "razonSocial": datos["razon_social"],
        "nombreComercial": datos["nombre_comercial"],
        "serieBoleta": serie_de("BOLETA"),
        "serieFactura": serie_de("FACTURA"),
        "afectacion": AFECTACION_FIJA,
    }
