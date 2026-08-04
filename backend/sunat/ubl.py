"""
Genera el comprobante electronico en UBL 2.1 y lo firma.

Port del generador que ya usa la Edge Function de EmpresaFacil, para que ambos
sistemas produzcan el mismo XML. La firma se hace sobre el texto que se
construye canonizado en xmlcanon, sin librerias de canonizacion.

Del certificado se necesita la clave privada en PKCS#8 DER y el certificado en
X.509 DER. Nunca se guardan en la base de datos ni salen al navegador.
"""

import base64
import hashlib

from .importes import GRAVADO, EXONERADO, calcular, decimal, en_letras, money
from .xmlcanon import el, render

XMLNS = {
    "xmlns": "urn:oasis:names:specification:ubl:schema:xsd:Invoice-2",
    "xmlns:cac": "urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2",
    "xmlns:cbc": "urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2",
    "xmlns:ext": "urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2",
}
C14N = "http://www.w3.org/2001/10/xml-exc-c14n#"
C14N_INCLUSIVO = "http://www.w3.org/TR/2001/REC-xml-c14n-20010315"
RSA_SHA256 = "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"
SHA256 = "http://www.w3.org/2001/04/xmlenc#sha256"
DS = "http://www.w3.org/2000/09/xmldsig#"


def _b64(datos):
    return base64.b64encode(datos).decode("ascii")


def _definicion_impuesto(afectacion):
    if afectacion == GRAVADO:
        return {"categoria": "S", "id": "1000", "nombre": "IGV", "porcentaje": "18.00"}
    if afectacion == EXONERADO:
        return {"categoria": "E", "id": "9997", "nombre": "EXO", "porcentaje": "0.00"}
    return {"categoria": "O", "id": "9998", "nombre": "INA", "porcentaje": "0.00"}


def _categoria_impuesto(afectacion):
    imp = _definicion_impuesto(afectacion)
    return el("cac:TaxCategory", [
        el("cbc:ID", [imp["categoria"]], {
            "schemeID": "UN/ECE 5305",
            "schemeName": "Tax Category Identifier",
            "schemeAgencyName": "United Nations Economic Commission for Europe",
        }),
        el("cbc:Percent", [imp["porcentaje"]]),
        el("cbc:TaxExemptionReasonCode", [afectacion], {
            "listAgencyName": "PE:SUNAT",
            "listName": "Afectacion del IGV",
            "listURI": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo07",
        }),
        el("cac:TaxScheme", [
            el("cbc:ID", [imp["id"]], {"schemeID": "UN/ECE 5153", "schemeAgencyID": "6"}),
            el("cbc:Name", [imp["nombre"]]),
            el("cbc:TaxTypeCode", ["VAT"]),
        ]),
    ])


def _direccion(parte):
    hijos = []
    if parte.get("ubigeo"):
        hijos.append(el("cbc:ID", [parte["ubigeo"]], {
            "schemeAgencyName": "PE:INEI", "schemeName": "Ubigeos"}))
    if parte.get("codigo_establecimiento"):
        hijos.append(el("cbc:AddressTypeCode", [parte["codigo_establecimiento"]], {
            "listAgencyName": "PE:SUNAT", "listName": "Establecimientos anexos"}))
    if parte.get("provincia"):
        hijos.append(el("cbc:CityName", [parte["provincia"]]))
    if parte.get("departamento"):
        hijos.append(el("cbc:CountrySubentity", [parte["departamento"]]))
    if parte.get("distrito"):
        hijos.append(el("cbc:District", [parte["distrito"]]))
    if parte.get("direccion"):
        hijos.append(el("cac:AddressLine", [el("cbc:Line", [parte["direccion"]])]))
    hijos.append(el("cac:Country", [el("cbc:IdentificationCode", ["PE"], {
        "listID": "ISO 3166-1",
        "listAgencyName": "United Nations Economic Commission for Europe",
        "listName": "Country",
    })]))
    return el("cac:RegistrationAddress", hijos)


def _parte(contenedor, parte):
    """Identificacion del emisor o del cliente.

    SUNAT exige el documento en cac:PartyIdentification y el nombre en
    cac:PartyLegalEntity. Ponerlos en cac:PartyTaxScheme, como hacen varios
    ejemplos que circulan, se rechaza con el error 1008: "no existe informacion
    en tipo de documento del emisor". Comprobado contra el entorno beta.
    """
    interior = [
        el("cac:PartyIdentification", [
            el("cbc:ID", [parte["numero_documento"]], {
                "schemeID": parte["tipo_documento"],
                "schemeName": "Documento de Identidad",
                "schemeAgencyName": "PE:SUNAT",
                "schemeURI": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo06",
            }),
        ]),
    ]
    if parte.get("nombre_comercial"):
        interior.append(el("cac:PartyName", [el("cbc:Name", [parte["nombre_comercial"]])]))

    entidad = [el("cbc:RegistrationName", [parte["razon_social"]])]
    if parte.get("direccion") or parte.get("ubigeo"):
        entidad.append(_direccion(parte))
    interior.append(el("cac:PartyLegalEntity", entidad))
    return el(contenedor, [el("cac:Party", interior)])


def _totales_impuesto(calculado):
    grupos = {}
    orden = []
    for linea in calculado["lineas"]:
        afectacion = linea["afectacion"]
        if afectacion not in grupos:
            grupos[afectacion] = {"gravable": 0, "impuesto": 0}
            orden.append(afectacion)
        grupos[afectacion]["gravable"] += linea["valor_cent"]
        grupos[afectacion]["impuesto"] += linea["igv_cent"]

    hijos = [el("cbc:TaxAmount", [money(calculado["igv_cent"])], {"currencyID": "PEN"})]
    for afectacion in orden:
        grupo = grupos[afectacion]
        imp = _definicion_impuesto(afectacion)
        hijos.append(el("cac:TaxSubtotal", [
            el("cbc:TaxableAmount", [money(grupo["gravable"])], {"currencyID": "PEN"}),
            el("cbc:TaxAmount", [money(grupo["impuesto"])], {"currencyID": "PEN"}),
            el("cac:TaxCategory", [
                el("cbc:ID", [imp["categoria"]], {
                    "schemeID": "UN/ECE 5305",
                    "schemeName": "Tax Category Identifier",
                    "schemeAgencyName": "United Nations Economic Commission for Europe",
                }),
                el("cac:TaxScheme", [
                    el("cbc:ID", [imp["id"]], {"schemeID": "UN/ECE 5153", "schemeAgencyID": "6"}),
                    el("cbc:Name", [imp["nombre"]]),
                    el("cbc:TaxTypeCode", ["VAT"]),
                ]),
            ]),
        ]))
    return el("cac:TaxTotal", hijos)


def _firma_agregada(emisor):
    return el("cac:Signature", [
        el("cbc:ID", ["SignatureSP"]),
        el("cac:SignatoryParty", [
            el("cac:PartyIdentification", [el("cbc:ID", [emisor["numero_documento"]])]),
            el("cac:PartyName", [el("cbc:Name", [emisor["razon_social"]])]),
        ]),
        el("cac:DigitalSignatureAttachment", [
            el("cac:ExternalReference", [el("cbc:URI", ["#SignatureSP"])]),
        ]),
    ])


def construir_documento(datos, calculado, firma_xml=None):
    extension = el("ext:UBLExtensions", [
        el("ext:UBLExtension", [el("ext:ExtensionContent", [firma_xml] if firma_xml else [])]),
    ])
    identificador = "%s-%s" % (datos["serie"], datos["numero"])
    moneda = datos.get("moneda", "PEN")

    hijos = [
        extension,
        el("cbc:UBLVersionID", ["2.1"]),
        el("cbc:CustomizationID", ["2.0"], {"schemeAgencyName": "PE:SUNAT"}),
        el("cbc:ProfileID", ["0101"], {
            "schemeAgencyName": "PE:SUNAT",
            "schemeName": "Tipo de Operacion",
            "schemeURI": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo17",
        }),
        el("cbc:ID", [identificador]),
        el("cbc:IssueDate", [datos["fecha_emision"]]),
        el("cbc:IssueTime", [datos["hora_emision"]]),
        el("cbc:InvoiceTypeCode", [datos["tipo_documento"]], {
            "listAgencyName": "PE:SUNAT",
            "listID": "0101",
            "listName": "Tipo de Documento",
            "listURI": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo01",
        }),
        el("cbc:Note", [en_letras(calculado["total_cent"])], {"languageLocaleID": "1000"}),
    ]
    if datos.get("observaciones"):
        hijos.append(el("cbc:Note", [datos["observaciones"]]))
    hijos += [
        el("cbc:DocumentCurrencyCode", [moneda], {
            "listAgencyName": "United Nations Economic Commission for Europe",
            "listID": "ISO 4217 Alpha",
            "listName": "Currency",
        }),
        el("cbc:LineCountNumeric", [str(len(calculado["lineas"]))]),
        _firma_agregada(datos["emisor"]),
        _parte("cac:AccountingSupplierParty", datos["emisor"]),
        _parte("cac:AccountingCustomerParty", datos["cliente"]),
        el("cac:PaymentTerms", [
            el("cbc:ID", ["FormaPago"]),
            el("cbc:PaymentMeansID", ["Contado"]),
        ]),
        _totales_impuesto(calculado),
        el("cac:LegalMonetaryTotal", [
            el("cbc:LineExtensionAmount", [money(calculado["valor_cent"])], {"currencyID": moneda}),
            el("cbc:TaxInclusiveAmount", [money(calculado["total_cent"])], {"currencyID": moneda}),
            el("cbc:PayableAmount", [money(calculado["total_cent"])], {"currencyID": moneda}),
        ]),
    ]

    for indice, linea in enumerate(calculado["lineas"], start=1):
        item = [el("cbc:Description", [linea["descripcion"]])]
        if linea.get("codigo"):
            item.append(el("cac:SellersItemIdentification", [el("cbc:ID", [linea["codigo"]])]))
        hijos.append(el("cac:InvoiceLine", [
            el("cbc:ID", [str(indice)]),
            el("cbc:InvoicedQuantity", [decimal(linea["cantidad"], 6)], {
                "unitCode": linea.get("unidad", "NIU"),
                "unitCodeListAgencyName": "United Nations Economic Commission for Europe",
                "unitCodeListID": "UN/ECE rec 20",
            }),
            el("cbc:LineExtensionAmount", [money(linea["valor_cent"])], {"currencyID": moneda}),
            el("cac:PricingReference", [
                el("cac:AlternativeConditionPrice", [
                    el("cbc:PriceAmount", [decimal(linea["precio_unitario"], 10)], {"currencyID": moneda}),
                    el("cbc:PriceTypeCode", ["01"], {
                        "listAgencyName": "PE:SUNAT",
                        "listName": "Tipo de Precio",
                        "listURI": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo16",
                    }),
                ]),
            ]),
            el("cac:TaxTotal", [
                el("cbc:TaxAmount", [money(linea["igv_cent"])], {"currencyID": moneda}),
                el("cac:TaxSubtotal", [
                    el("cbc:TaxableAmount", [money(linea["valor_cent"])], {"currencyID": moneda}),
                    el("cbc:TaxAmount", [money(linea["igv_cent"])], {"currencyID": moneda}),
                    _categoria_impuesto(linea["afectacion"]),
                ]),
            ]),
            el("cac:Item", item),
            el("cac:Price", [
                el("cbc:PriceAmount", [decimal(linea["valor_unitario"], 10)], {"currencyID": moneda}),
            ]),
        ]))

    return el("Invoice", hijos, XMLNS)


def firmar_documento(construir, id_firma, clave_privada_der, certificado_der):
    """Firma con el esquema que acepta SUNAT: se calcula el digest del
    documento sin firma, se arma SignedInfo y se firma ese texto tal cual.
    Funciona porque el XML se construye ya canonizado."""
    from cryptography.hazmat.primitives import hashes, serialization
    from cryptography.hazmat.primitives.asymmetric import padding

    documento_sin_firma = render(construir(None))
    digest = _b64(hashlib.sha256(documento_sin_firma.encode("utf-8")).digest())

    signed_info = el("ds:SignedInfo", [
        el("ds:CanonicalizationMethod", [], {"Algorithm": C14N}),
        el("ds:SignatureMethod", [], {"Algorithm": RSA_SHA256}),
        el("ds:Reference", [
            el("ds:Transforms", [
                el("ds:Transform", [], {"Algorithm": DS + "enveloped-signature"}),
                el("ds:Transform", [], {"Algorithm": C14N_INCLUSIVO}),
            ]),
            el("ds:DigestMethod", [], {"Algorithm": SHA256}),
            el("ds:DigestValue", [digest]),
        ], {"URI": ""}),
    ], {"xmlns:ds": DS})

    signed_info_canonico = render(signed_info)
    clave = serialization.load_der_private_key(clave_privada_der, password=None)
    firma = clave.sign(
        signed_info_canonico.encode("utf-8"),
        padding.PKCS1v15(),
        hashes.SHA256(),
    )

    firma_xml = el("ds:Signature", [
        signed_info,
        el("ds:SignatureValue", [_b64(firma)]),
        el("ds:KeyInfo", [
            el("ds:X509Data", [el("ds:X509Certificate", [_b64(certificado_der)])]),
        ]),
    ], {"xmlns:ds": DS, "Id": id_firma})

    documento = render(construir(firma_xml))
    return {
        "xml": '<?xml version="1.0" encoding="UTF-8"?>' + documento,
        "digest": digest,
        "firma": _b64(firma),
        "signed_info": signed_info_canonico,
    }


def construir_comprobante_firmado(datos, clave_privada_der, certificado_der):
    calculado = calcular(datos["items"])
    firmado = firmar_documento(
        lambda firma: construir_documento(datos, calculado, firma),
        "SignatureSP",
        clave_privada_der,
        certificado_der,
    )
    firmado["calculado"] = calculado
    return firmado


# ==================== Resumen diario de boletas ====================
# Las boletas no se envian una por una: se informan en un resumen diario, que
# es UBL 2.0 y no 2.1. SUNAT devuelve un ticket y el resultado se consulta
# despues, asi que la boleta no queda aceptada en el momento de emitirla.

XMLNS_RESUMEN = {
    "xmlns:cac": "urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2",
    "xmlns:cbc": "urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2",
    "xmlns:ext": "urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2",
    "xmlns:p": "urn:sunat:names:specification:ubl:peru:schema:xsd:SummaryDocuments-1",
    "xmlns:sac": "urn:sunat:names:specification:ubl:peru:schema:xsd:SunatAggregateComponents-1",
}


def _firma_resumen(datos):
    return el("cac:Signature", [
        el("cbc:ID", [datos["id_resumen"]]),
        el("cac:SignatoryParty", [
            el("cac:PartyIdentification", [el("cbc:ID", [datos["ruc_emisor"]])]),
            el("cac:PartyName", [el("cbc:Name", [datos["razon_social"]])]),
        ]),
        el("cac:DigitalSignatureAttachment", [
            el("cac:ExternalReference", [el("cbc:URI", ["#" + datos["id_resumen"]])]),
        ]),
    ])


def _impuesto_resumen(igv_cent):
    return el("cac:TaxTotal", [
        el("cbc:TaxAmount", [money(igv_cent)], {"currencyID": "PEN"}),
        el("cac:TaxSubtotal", [
            el("cbc:TaxAmount", [money(igv_cent)], {"currencyID": "PEN"}),
            el("cac:TaxCategory", [
                el("cac:TaxScheme", [
                    el("cbc:ID", ["1000"]),
                    el("cbc:Name", ["IGV"]),
                    el("cbc:TaxTypeCode", ["VAT"]),
                ]),
            ]),
        ]),
    ])


def _linea_resumen(numero, boleta):
    """Una boleta dentro del resumen. El estado 1 es alta; el 3 seria baja,
    para comunicar una boleta anulada."""
    calculado = boleta["calculado"]

    def por_afectacion(afectacion):
        return sum(l["valor_cent"] for l in calculado["lineas"] if l["afectacion"] == afectacion)

    return el("sac:SummaryDocumentsLine", [
        el("cbc:LineID", [str(numero)]),
        el("cbc:DocumentTypeCode", ["03"]),
        el("cbc:ID", [boleta["id_documento"]]),
        el("cac:AccountingCustomerParty", [
            el("cbc:CustomerAssignedAccountID", [boleta.get("documento_cliente") or "-"]),
            el("cbc:AdditionalAccountID", [boleta.get("tipo_documento_cliente") or "-"]),
        ]),
        el("cac:Status", [el("cbc:ConditionCode", [str(boleta.get("condicion", "1"))])]),
        el("sac:TotalAmount", [money(calculado["total_cent"])], {"currencyID": "PEN"}),
        el("sac:BillingPayment", [
            el("cbc:PaidAmount", [money(por_afectacion("10"))], {"currencyID": "PEN"}),
            el("cbc:InstructionID", ["01"]),
        ]),
        el("sac:BillingPayment", [
            el("cbc:PaidAmount", [money(por_afectacion("20"))], {"currencyID": "PEN"}),
            el("cbc:InstructionID", ["02"]),
        ]),
        el("sac:BillingPayment", [
            el("cbc:PaidAmount", [money(por_afectacion("30"))], {"currencyID": "PEN"}),
            el("cbc:InstructionID", ["03"]),
        ]),
        _impuesto_resumen(calculado["igv_cent"]),
    ])


def construir_resumen(datos, firma_xml=None):
    """Un resumen informa todas las boletas de un mismo dia, no una sola:
    asi se manda un envio diario en vez de uno por boleta."""
    boletas = datos["boletas"]
    if not boletas:
        raise ValueError("El resumen diario necesita al menos una boleta.")

    return el("p:SummaryDocuments", [
        el("ext:UBLExtensions", [
            el("ext:UBLExtension", [el("ext:ExtensionContent", [firma_xml] if firma_xml else [])]),
        ]),
        el("cbc:UBLVersionID", ["2.0"]),
        el("cbc:CustomizationID", ["1.1"]),
        el("cbc:ID", [datos["id_resumen"]]),
        el("cbc:ReferenceDate", [datos["fecha_referencia"]]),
        el("cbc:IssueDate", [datos["fecha_emision"]]),
        _firma_resumen(datos),
        el("cac:AccountingSupplierParty", [
            el("cbc:CustomerAssignedAccountID", [datos["ruc_emisor"]]),
            el("cbc:AdditionalAccountID", ["6"]),
            el("cac:Party", [
                el("cac:PartyLegalEntity", [el("cbc:RegistrationName", [datos["razon_social"]])]),
            ]),
        ]),
    ] + [_linea_resumen(i, b) for i, b in enumerate(boletas, start=1)], XMLNS_RESUMEN)


def construir_resumen_firmado(datos, clave_privada_der, certificado_der):
    return firmar_documento(
        lambda firma: construir_resumen(datos, firma),
        datos["id_resumen"],
        clave_privada_der,
        certificado_der,
    )
