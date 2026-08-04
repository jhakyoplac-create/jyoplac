"""
Pruebas del generador UBL.

El XML de referencia (comprobante_sin_firma.xml) corresponde a un comprobante
que el entorno de pruebas de SUNAT acepto con codigo 0. Si alguien cambia el
orden de un elemento o el escapado, esta prueba lo detecta: SUNAT rechaza el
comprobante por diferencias que a simple vista no se ven.

Se ejecuta con:  py backend/sunat/pruebas/test_ubl.py
"""

import io
import json
import os
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(os.path.dirname(AQUI)))

from sunat.importes import calcular, en_letras, money
from sunat.ubl import construir_comprobante_firmado, construir_documento
from sunat.xmlcanon import el, render

fallos = []


def comprobar(nombre, obtenido, esperado):
    if obtenido != esperado:
        fallos.append("%s\n   esperado: %r\n   obtenido: %r" % (nombre, esperado, obtenido))


def caso_de_prueba():
    return json.load(io.open(os.path.join(AQUI, "caso.json"), encoding="utf-8"))


def prueba_xml_de_referencia():
    caso = caso_de_prueba()
    documento = render(construir_documento(caso, calcular(caso["items"]), None))
    referencia = io.open(os.path.join(AQUI, "comprobante_sin_firma.xml"), encoding="utf-8").read()
    if documento != referencia:
        for i, (a, b) in enumerate(zip(referencia, documento)):
            if a != b:
                fallos.append(
                    "El XML cambio respecto de la referencia, en el caracter %d:\n"
                    "   referencia: ...%s...\n   generado:   ...%s..."
                    % (i, referencia[max(0, i - 70):i + 70], documento[max(0, i - 70):i + 70]))
                return
        fallos.append("El XML cambio de largo respecto de la referencia (%d vs %d)."
                      % (len(referencia), len(documento)))


def prueba_canonizacion():
    # los namespaces van primero y el resto alfabetico, como exige exc-C14N
    nodo = el("a", ["x"], {"z": "1", "xmlns:cbc": "urn:y", "xmlns": "urn:x", "b": "2"})
    comprobar("orden de atributos", render(nodo),
              '<a xmlns="urn:x" xmlns:cbc="urn:y" b="2" z="1">x</a>')
    comprobar("escapado de texto", render(el("a", ["1 & 2 < 3"])), "<a>1 &amp; 2 &lt; 3</a>")
    comprobar("escapado de atributo", render(el("a", [], {"v": 'di "hola"'})),
              '<a v="di &quot;hola&quot;"></a>')


def prueba_importes():
    # el precio incluye IGV: 118 soles gravados dan 100 de valor y 18 de impuesto
    c = calcular([{"cantidad": 1, "precio_unitario": 118, "afectacion": "10"}])
    comprobar("valor gravado", c["valor_cent"], 10000)
    comprobar("igv", c["igv_cent"], 1800)
    comprobar("total", c["total_cent"], 11800)

    # lo exonerado no lleva impuesto
    c = calcular([{"cantidad": 2, "precio_unitario": 50, "afectacion": "20"}])
    comprobar("exonerado sin igv", c["igv_cent"], 0)
    comprobar("exonerado total", c["total_cent"], 10000)

    # las lineas tienen que sumar exactamente el total, sin decimales sueltos
    c = calcular([{"cantidad": 3, "precio_unitario": 33.33, "afectacion": "10"}])
    comprobar("suma de lineas", c["valor_cent"] + c["igv_cent"], c["total_cent"])

    comprobar("monto en letras", en_letras(11800), "SON: CIENTO DIECIOCHO CON 00/100 SOLES")
    comprobar("apocope de uno", en_letras(2100), "SON: VEINTIUN CON 00/100 SOLES")
    comprobar("cero", en_letras(50), "SON: CERO CON 50/100 SOLES")
    comprobar("formato de importe", money(11800), "118.00")


def prueba_firma():
    """La firma tiene que validar con la clave publica del certificado."""
    try:
        from cryptography import x509
        from cryptography.hazmat.primitives import hashes, serialization
        from cryptography.hazmat.primitives.asymmetric import padding, rsa
    except ImportError:
        fallos.append("Falta la dependencia cryptography.")
        return
    import base64
    import datetime
    import re

    clave = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    nombre = x509.Name([x509.NameAttribute(x509.oid.NameOID.COMMON_NAME, "PRUEBA")])
    inicio = datetime.datetime(2026, 1, 1, tzinfo=datetime.timezone.utc)
    cert = (x509.CertificateBuilder().subject_name(nombre).issuer_name(nombre)
            .public_key(clave.public_key()).serial_number(1)
            .not_valid_before(inicio).not_valid_after(inicio + datetime.timedelta(days=1))
            .sign(clave, hashes.SHA256()))
    clave_der = clave.private_bytes(
        serialization.Encoding.DER, serialization.PrivateFormat.PKCS8,
        serialization.NoEncryption())

    firmado = construir_comprobante_firmado(
        caso_de_prueba(), clave_der, cert.public_bytes(serialization.Encoding.DER))

    signed_info = re.search(r"<ds:SignedInfo.*?</ds:SignedInfo>", firmado["xml"], re.S)
    if not signed_info:
        fallos.append("El XML firmado no contiene SignedInfo.")
        return
    try:
        clave.public_key().verify(
            base64.b64decode(firmado["firma"]),
            signed_info.group(0).encode("utf-8"),
            padding.PKCS1v15(),
            hashes.SHA256(),
        )
    except Exception as error:
        fallos.append("La firma no valida: %s" % error)

    if firmado["xml"].count("<ds:Signature ") != 1:
        fallos.append("El XML debe llevar exactamente una firma.")
    if not firmado["xml"].startswith('<?xml version="1.0" encoding="UTF-8"?>'):
        fallos.append("Falta la declaracion XML.")


def prueba_resumen_diario():
    """El resumen informa todas las boletas del dia en un solo envio."""
    from sunat.importes import calcular
    from sunat.ubl import construir_resumen
    from sunat.xmlcanon import render

    def boleta(numero, importe):
        return {
            "id_documento": "B001-%d" % numero,
            "tipo_documento_cliente": "1",
            "documento_cliente": "0988765%d" % numero,
            "calculado": calcular([{
                "descripcion": "Control", "cantidad": 1,
                "precio_unitario": importe, "afectacion": "20",
            }]),
        }

    datos = {
        "id_resumen": "RC-20260803-1",
        "fecha_emision": "2026-08-03",
        "fecha_referencia": "2026-08-02",
        "ruc_emisor": "10766704391",
        "razon_social": "CLINICA DE PRUEBA",
        "boletas": [boleta(1, 80), boleta(2, 65), boleta(3, 120)],
    }
    xml = render(construir_resumen(datos))
    comprobar("lineas del resumen", xml.count("<sac:SummaryDocumentsLine>"), 3)
    comprobar("numeracion de lineas", xml.count("<cbc:LineID>"), 3)
    for numero in ("1", "2", "3"):
        if "<cbc:LineID>%s</cbc:LineID>" % numero not in xml:
            fallos.append("Falta la linea %s del resumen." % numero)
    # el total exonerado de cada boleta va en el InstructionID 02
    if '<cbc:PaidAmount currencyID="PEN">80.00</cbc:PaidAmount>' not in xml:
        fallos.append("El resumen no lleva el importe exonerado de la primera boleta.")

    try:
        construir_resumen({**datos, "boletas": []})
        fallos.append("Un resumen sin boletas deberia dar error.")
    except ValueError:
        pass


if __name__ == "__main__":
    for prueba in [prueba_canonizacion, prueba_importes, prueba_xml_de_referencia,
                   prueba_resumen_diario, prueba_firma]:
        prueba()
    if fallos:
        print("FALLAN %d comprobaciones:\n" % len(fallos))
        for fallo in fallos:
            print(" - %s\n" % fallo)
        sys.exit(1)
    print("Todas las comprobaciones del generador UBL pasan.")
