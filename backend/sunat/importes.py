"""
Calculo de importes del comprobante y monto en letras.

Los precios que maneja el sistema ya incluyen el IGV, asi que el valor de venta
se obtiene retirando el impuesto. Todo se trabaja en centimos enteros para que
la suma de las lineas cuadre exactamente con el total, sin arrastrar decimales.

Port del calculo que ya usa la Edge Function de EmpresaFacil.
"""

IGV = 0.18

# 10 = gravado, 20 = exonerado, 30 = inafecto
GRAVADO = "10"
EXONERADO = "20"
INAFECTO = "30"


def _entero_seguro(valor):
    if abs(valor) > 2 ** 53 - 1:
        raise ValueError("El monto del comprobante excede el limite seguro.")
    return int(valor)


def _redondear(valor):
    """Redondeo a entero como el del original: 0.5 siempre hacia arriba.
    Python usa redondeo bancario, que daria 2 en vez de 3 para 2.5."""
    from decimal import Decimal, ROUND_HALF_UP
    return int(Decimal(repr(valor)).quantize(Decimal("1"), rounding=ROUND_HALF_UP))


def calcular(items):
    """items: lista de dicts con descripcion, cantidad, precio_unitario,
    unidad, codigo y afectacion. Devuelve las lineas con sus importes.

    La afectacion es obligatoria a proposito: no tiene valor por defecto.
    Suponer que todo esta gravado haria cobrar y declarar un IGV que no
    corresponde, y los servicios de salud estan exonerados.
    """
    lineas = []
    for item in items:
        cantidad = float(item["cantidad"])
        if cantidad <= 0:
            raise ValueError("La cantidad debe ser mayor que cero.")
        afectacion = item.get("afectacion")
        if afectacion not in (GRAVADO, EXONERADO, INAFECTO):
            raise ValueError(
                "Indica la afectacion del IGV de '%s': %s gravado, %s exonerado o %s inafecto."
                % (item.get("descripcion", "?"), GRAVADO, EXONERADO, INAFECTO))
        total_cent = _entero_seguro(_redondear(cantidad * float(item["precio_unitario"]) * 100))
        if afectacion == GRAVADO:
            valor_cent = _entero_seguro(_redondear(total_cent / (1 + IGV)))
        else:
            valor_cent = total_cent
        igv_cent = total_cent - valor_cent if afectacion == GRAVADO else 0
        linea = dict(item)
        linea.update({
            "afectacion": afectacion,
            "total_cent": total_cent,
            "valor_cent": valor_cent,
            "igv_cent": igv_cent,
            "valor_unitario": (valor_cent / 100.0) / cantidad,
        })
        lineas.append(linea)

    return {
        "lineas": lineas,
        "valor_cent": _entero_seguro(sum(l["valor_cent"] for l in lineas)),
        "igv_cent": _entero_seguro(sum(l["igv_cent"] for l in lineas)),
        "total_cent": _entero_seguro(sum(l["total_cent"] for l in lineas)),
    }


def money(centimos):
    return "%.2f" % (centimos / 100.0)


def decimal(valor, digitos=10):
    texto = ("%." + str(digitos) + "f") % valor
    texto = texto.rstrip("0").rstrip(".")
    return texto or "0"


_UNIDADES = ["", "UNO", "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE", "OCHO", "NUEVE"]
_DIECI = {
    10: "DIEZ", 11: "ONCE", 12: "DOCE", 13: "TRECE", 14: "CATORCE", 15: "QUINCE",
    16: "DIECISEIS", 17: "DIECISIETE", 18: "DIECIOCHO", 19: "DIECINUEVE",
}
_DECENAS = ["", "", "VEINTE", "TREINTA", "CUARENTA", "CINCUENTA", "SESENTA",
            "SETENTA", "OCHENTA", "NOVENTA"]
_CENTENAS = ["", "CIENTO", "DOSCIENTOS", "TRESCIENTOS", "CUATROCIENTOS", "QUINIENTOS",
             "SEISCIENTOS", "SETECIENTOS", "OCHOCIENTOS", "NOVECIENTOS"]


def _centenas(valor):
    if valor == 0:
        return ""
    if valor == 100:
        return "CIEN"
    c, resto = divmod(valor, 100)
    if resto < 10:
        sufijo = _UNIDADES[resto]
    elif resto < 20:
        sufijo = _DIECI[resto]
    elif resto < 30:
        sufijo = "VEINTE" if resto == 20 else "VEINTI" + _UNIDADES[resto - 20]
    else:
        d, u = divmod(resto, 10)
        sufijo = _DECENAS[d] + (" Y " + _UNIDADES[u] if u else "")
    return _CENTENAS[c] + (" " if c and sufijo else "") + sufijo


def _entero_en_letras(valor):
    if valor == 0:
        return "CERO"
    millones, resto = divmod(valor, 1000000)
    miles, unidades = divmod(resto, 1000)
    partes = []
    if millones:
        partes.append("UN MILLON" if millones == 1 else _entero_en_letras(millones) + " MILLONES")
    if miles:
        if miles == 1:
            partes.append("MIL")
        else:
            texto = _centenas(miles)
            if texto.endswith("UNO"):
                texto = texto[:-3] + "UN"
            partes.append(texto + " MIL")
    if unidades:
        partes.append(_centenas(unidades))
    return " ".join(partes)


def en_letras(centimos):
    """Monto en letras como lo exige la representacion impresa.

    Lleva el prefijo SON: para que salga igual que en los comprobantes que la
    clinica ya emitia desde el portal de SUNAT. El UNO final se apocopa: 21
    soles es VEINTIUN, no VEINTIUNO.
    """
    entero, decimales = divmod(int(centimos), 100)
    texto = _entero_en_letras(entero)
    if texto.endswith("UNO"):
        texto = texto[:-3] + "UN"
    return "SON: %s CON %02d/100 SOLES" % (texto, decimales)
