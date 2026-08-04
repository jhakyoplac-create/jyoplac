"""
Construccion de XML ya canonizado para la firma digital de SUNAT.

El XML que se firma tiene que estar en forma canonica exclusiva (exc-C14N).
En vez de generar XML libre y canonizarlo despues con una libreria externa, se
construye directamente de forma canonica: atributos ordenados, escapado fijo,
sin espacios entre etiquetas y siempre con etiqueta de cierre. Asi el texto que
se firma es exactamente el que viaja a SUNAT, sin depender de xmlsec ni lxml.

Es un port del generador que ya usa la Edge Function de EmpresaFacil, para que
ambos sistemas produzcan el mismo XML byte a byte.
"""


class Nodo:
    __slots__ = ("nombre", "atributos", "hijos")

    def __init__(self, nombre, hijos=None, atributos=None):
        self.nombre = nombre
        self.atributos = atributos or {}
        self.hijos = hijos if hijos is not None else []


def el(nombre, hijos=None, atributos=None):
    return Nodo(nombre, hijos, atributos)


def escapar_texto(valor):
    return (
        str(valor)
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace("\r", "&#xD;")
    )


def escapar_atributo(valor):
    return (
        escapar_texto(valor)
        .replace('"', "&quot;")
        .replace("\t", "&#x9;")
        .replace("\n", "&#xA;")
    )


def _orden_atributos(par):
    """Los namespaces van primero, xmlns antes que xmlns:algo, y el resto
    alfabetico. Es el orden que exige la canonizacion exclusiva."""
    nombre = par[0]
    es_ns = nombre == "xmlns" or nombre.startswith("xmlns:")
    return (0 if es_ns else 1, 0 if nombre == "xmlns" else 1, nombre)


def render(nodo):
    atributos = "".join(
        ' %s="%s"' % (nombre, escapar_atributo(valor))
        for nombre, valor in sorted(nodo.atributos.items(), key=_orden_atributos)
    )
    contenido = "".join(
        escapar_texto(hijo) if isinstance(hijo, str) else render(hijo)
        for hijo in nodo.hijos
    )
    return "<%s%s>%s</%s>" % (nodo.nombre, atributos, contenido, nodo.nombre)
