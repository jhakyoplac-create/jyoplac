/* GENERADO desde EmpresaFacil (demo/dental/js/domain/preciosOdontograma.js).
   No se edita aqui: se cambia alla y se vuelve a generar, para que los dos
   sistemas busquen el precio igual. */
(function () {
"use strict";
/* De donde sale el precio de cada trabajo que el odontograma manda al plan.

   La lista de precios es del consultorio y cada uno la escribe a su manera:
   "Curaciones Simples", "Resina 1 cara", "Exodoncia", "Instalación de Brackets
   Morelli". Aqui no se cambia ni un nombre ni un precio de esa lista: solo se
   decide cual de sus servicios corresponde a un trabajo del odontograma.

   Cuando hay uno solo que encaja, se toma. Cuando hay varios y el odontograma
   no puede saber cual -la corona de zirconio o la de porcelana, la marca de
   los brackets-, no se adivina: se devuelven todos como opciones, el doctor
   elige con un toque y esa eleccion se recuerda para el consultorio. Poner un
   precio equivocado es peor que dejar la linea sin precio (analisis de las 18
   listas, 2026-11-15).

   No toca el DOM ni el estado: recibe la lista y devuelve la respuesta, para
   poder probarlo con las listas reales y copiarlo tal cual al sistema de CM. */

/* "busca" es la familia de palabras; "tamano" el calificativo que tiene que
   llevar; "porPieza" que se cobra segun donde esta la pieza; "porCaras" que
   el tamano sale de cuantas caras son; "si no hay" a que trabajo se pasa
   cuando el consultorio no tiene ese servicio en su lista. */
const TRABAJO_DEL_ODONTOGRAMA = {
  curacion_simple: { detalle: "Curación simple", busca: "curacion", tamano: "simple" },
  curacion_compuesta: { detalle: "Curación compuesta", busca: "curacion", tamano: "compuesta" },
  curacion_compleja: { detalle: "Curación compleja", busca: "curacion", tamano: "compleja", respaldo: "compuesta" },
  /* La temporal se cambia por una definitiva: se cobra como la curacion de
     esas mismas caras. */
  restauracion_definitiva: { detalle: "Restauración definitiva", busca: "curacion", porCaras: true },
  /* 5.3.8. La restauracion pintada en rojo esta en mal estado y hay que
     rehacerla: una resina o una amalgama se cobran como la curacion de esas
     caras; la incrustacion y la carilla tienen su propio precio. */
  restauracion_rehacer: { detalle: "Restauración en mal estado", busca: "curacion", porCaras: true },
  incrustacion_rehacer: { detalle: "Incrustación", busca: "incrustacion" },
  carilla_rehacer: { detalle: "Carilla", busca: "carilla" },
  sellante_rehacer: { detalle: "Sellante", busca: "sellante" },
  extraccion: { detalle: "Extracción", busca: "extraccion", tamano: "simple" },
  extraccion_molar: { detalle: "Extracción de tercer molar", busca: "extraccion", tamano: "tercer_molar" },
  resto_radicular: { detalle: "Extracción de resto radicular", busca: "resto_radicular", siNoHay: "extraccion" },
  /* El odontograma ve que la pieza necesita corona, pero no si la quieren de
     porcelana, de zirconio o metal-ceramica, y cada una cuesta distinto. */
  corona_definitiva: { detalle: "Corona definitiva", busca: "corona" },
  corona_rehacer: { detalle: "Corona definitiva", busca: "corona" },
  espigo_rehacer: { detalle: "Espigo-muñón", busca: "espigo" },
  implante_rehacer: { detalle: "Implante dental", busca: "implante" },
  fractura: { detalle: "Fractura" },
  /* 5.3.24. La cara gastada es trabajo pendiente, pero que lleve una resina,
     una incrustacion o una ferula lo decide el doctor. Baja sin precio. */
  desgaste: { detalle: "Superficie desgastada" },
  endodoncia: { detalle: "Endodoncia", busca: "endodoncia", porPieza: true },
  pulpotomia: { detalle: "Pulpotomía", busca: "pulpotomia" },
  pulpectomia: { detalle: "Pulpectomía", busca: "pulpectomia" },
  protesis_fija: { detalle: "Prótesis fija", busca: "protesis_fija" },
  protesis_rem: { detalle: "Prótesis removible", busca: "protesis_removible" },
  orto_fija: { detalle: "Ortodoncia fija", busca: "ortodoncia_fija" },
  orto_rem: { detalle: "Ortodoncia removible", busca: "ortodoncia_removible" },
  protesis_total: { detalle: "Prótesis total", busca: "protesis_total" }
};

/* Como puede estar escrito cada trabajo en la lista del consultorio. Son
   raices: "curacion" vale para "Curaciones". Con "+" tienen que estar las dos:
   "protesis+fija". Con "=" la palabra tiene que ser esa exacta: "=poste",
   porque "posterior" tambien empieza asi. Una letra cambiada o de mas se
   perdona en las raices largas ("Endoodncia", "Extracion"); las que se comen
   dos letras van escritas aqui ("endoncia", "ortoncia", "remante"). */
const FAMILIAS_DE_SERVICIO = {
  curacion: ["curacion", "restauracion", "obturacion", "resina", "empaste"],
  incrustacion: ["incrustacion", "inlay", "onlay", "overlay"],
  carilla: ["carilla"],
  sellante: ["sellante", "sellador"],
  extraccion: ["extraccion", "exodoncia"],
  resto_radicular: ["remanente", "remante", "resto+radicular", "raiz+residual", "=rcr", "=rr"],
  endodoncia: ["endodoncia", "endoncia", "conducto", "endodontic"],
  pulpotomia: ["pulpotomia", "biopulpotomia"],
  pulpectomia: ["pulpectomia", "biopulpectomia"],
  corona: ["corona"],
  espigo: ["espigo", "perno", "=poste", "munon"],
  implante: ["implante", "=imp"],
  protesis_fija: ["protesis+fija", "puente"],
  protesis_removible: ["protesis+removible", "protesis+parcial", "protesis+flexible", "ppr"],
  ortodoncia_fija: ["bracket", "braket", "braquet", "ortodoncia+fija", "aparato+fijo", "aparatologia+fija", "instalacion+ortodoncia"],
  ortodoncia_removible: ["ortodoncia+removible", "aparato+removible", "placa+removible", "hawley"],
  protesis_total: ["protesis+total", "protesis+completa", "dentadura"]
};
/* Nombres que pueden ser ese trabajo pero no lo dicen claro: "Ortodoncia" a
   secas puede ser la instalacion o el control del mes. Se ofrecen como opcion,
   pero nunca se toman solos. */
const FAMILIAS_FLOJAS = {
  ortodoncia_fija: ["ortodoncia", "ortoncia"]
};
const TAMANOS_DE_SERVICIO = {
  simple: ["simple"],
  compuesta: ["compuest"],
  compleja: ["complej"],
  tercer_molar: ["tercer", "cordal", "juicio", "3er", "3ra", "3ro", "=3+molar"]
};
/* Donde esta la pieza, para la endodoncia que se cobra distinto por raices:
   anterior (1 a 3), premolar (4 y 5) y molar (6 a 8). */
const UBICACIONES_DE_PIEZA = {
  anterior: ["anterior", "unirradic", "uniradic", "monorradic", "monoradic", "incisiv", "canin"],
  premolar: ["premolar", "birradic", "biradic"],
  molar: ["molar", "posterior", "multirradic", "multiradic", "polirradic", "poliradic"]
};
/* Lo que aparta un servicio: es de ninos (vale solo para dientes de leche), es
   provisional, o se llama parecido pero es otra cosa. */
const RAICES_DE_NINO = ["nino", "ninos", "infantil", "pediatr", "leche", "decidu", "primari", "diente+temporal", "pieza+temporal", "molar+temporal"];
const RAICES_QUE_NO_SON_SIMPLE = ["complej", "quirurg", "incluid", "retenid", "impact", "semi"];
const RAICES_QUE_NO_SON_EL_TRABAJO = ["temporal", "provisional", "retrat", "control", "retiro", "reparacion", "rebase", "cementa", "recementa", "repega", "pegado", "evaluacion", "consulta", "diagnostico"];
/* Y lo que aparta dentro de cada familia: el pegado de un bracket o la cuota
   del mes no son la instalacion; el alargamiento de corona no es la corona. */
const NO_ES_DE_LA_FAMILIA = {
  ortodoncia_fija: ["cuota", "mensual", "pegado", "repega", "despega", "contencion", "retenedor", "planifica", "estudio", "reposicion", "removible", "minitornillo", "microtornillo"],
  ortodoncia_removible: ["mantenedor", "cuota", "mensual", "contencion", "ferula"],
  corona: ["alargamiento", "implante", "=imp", "atache", "adicional"],
  espigo: ["reconstruccion"],
  implante: ["plan", "planifica", "guia", "tomografia"],
  curacion: ["incrustacion", "carilla", "corona", "munon", "reconstruccion", "sellante"],
  incrustacion: ["pulp", "biopulp", "endodoncia"],
  carilla: ["modelo", "laboratorio", "ferula", "placa", "protector", "encerado", "mock"],
  extraccion: ["remanente", "remante", "resto+radicular", "=rcr", "=rr"]
};
const DE_ARRIBA = ["superior", "=sup", "arriba"];
const DE_ABAJO = ["inferior", "=inf", "abajo"];

function sinTildes(texto) {
  return String(texto || "").trim().toLocaleLowerCase("es").normalize("NFD").replace(/[̀-ͯ]/g, "");
}

/* Las palabras del nombre, ya sin tildes ni signos. Las siglas con puntos se
   juntan antes: "Exodoncia R.R" tiene que dar "rr" y no dos erres sueltas. */
function palabrasDelServicio(nombre) {
  return sinTildes(nombre)
    .replace(/(^|[^a-z0-9])((?:[a-z]\.)+[a-z]?)(?![a-z0-9])/g, (todo, antes, sigla) => antes + sigla.replace(/\./g, ""))
    .replace(/[^a-z0-9]+/g, " ").split(" ").filter(Boolean);
}

/* Cuantas letras hay que tocar para pasar de una palabra a otra; dos letras
   cruzadas cuentan como una sola ("endoodncia"). */
function letrasDeDiferencia(a, b) {
  const filas = [];
  for (let i = 0; i <= a.length; i += 1) {
    filas.push([i]);
    for (let j = 1; j <= b.length; j += 1) {
      if (i === 0) { filas[0][j] = j; continue; }
      const costo = a[i - 1] === b[j - 1] ? 0 : 1;
      let valor = Math.min(filas[i - 1][j] + 1, filas[i][j - 1] + 1, filas[i - 1][j - 1] + costo);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) valor = Math.min(valor, filas[i - 2][j - 2] + 1);
      filas[i][j] = valor;
    }
  }
  return filas[a.length][b.length];
}

/* Una palabra vale por una raiz si empieza con ella. Con "perdona", tambien
   si empieza casi con ella: una letra de mas, de menos, cambiada o cruzada,
   y solo en raices de siete letras o mas -en las cortas un cambio ya es otra
   palabra-. */
function valePorRaiz(palabra, parte, perdona) {
  if (parte.startsWith("=")) return palabra === parte.slice(1);
  if (palabra.startsWith(parte)) return true;
  if (!perdona || parte.length < 7 || palabra[0] !== parte[0] || palabra.length < parte.length - 1) return false;
  for (let largo = parte.length - 1; largo <= parte.length + 1; largo += 1) {
    if (largo <= palabra.length && letrasDeDiferencia(palabra.slice(0, largo), parte) <= 1) return true;
  }
  return false;
}
function tieneRaiz(palabras, raices, perdona = false) {
  return raices.some((raiz) => raiz.split("+").every((parte) => palabras.some((palabra) => valePorRaiz(palabra, parte, perdona))));
}

function esDeLeche(pieza) {
  return Number(String(pieza).charAt(0)) >= 5;
}
function ubicacionDePieza(pieza) {
  const n = Number(String(pieza).charAt(1));
  if (esDeLeche(pieza)) return n <= 3 ? "anterior" : "molar";
  if (n <= 3) return "anterior";
  if (n <= 5) return "premolar";
  return "molar";
}
/* En que arcada esta: la pieza suelta, el tramo "16-26" por su primera pieza,
   y "Sup." o "Inf." de la protesis total. */
function arcadaDe(pieza) {
  const texto = sinTildes(pieza);
  if (texto.startsWith("sup")) return "arriba";
  if (texto.startsWith("inf")) return "abajo";
  const cuadrante = Number(texto.charAt(0));
  if ([1, 2, 5, 6].includes(cuadrante)) return "arriba";
  if ([3, 4, 7, 8].includes(cuadrante)) return "abajo";
  return "";
}
function arcadaDelServicio(palabras) {
  const arriba = tieneRaiz(palabras, DE_ARRIBA);
  const abajo = tieneRaiz(palabras, DE_ABAJO);
  if (arriba === abajo) return "";
  return arriba ? "arriba" : "abajo";
}

const mismoNombre = (a, b) => sinTildes(a) === sinTildes(b);
const precioDe = (item) => Number(item.price || 0);
const elMasCorto = (lista) => [...lista].sort((a, b) => a.palabras.length - b.palabras.length)[0];
const todosCuestanIgual = (lista) => lista.every((c) => precioDe(c.item) === precioDe(lista[0].item));

/* Lo que la lista del consultorio tiene para un trabajo del odontograma en una
   pieza. Devuelve:
   - opciones: los servicios de su lista que pueden ser ese trabajo, tal como
     el consultorio los escribio, con su precio;
   - elegido: el que se pone en la linea, o nada si hay que elegir;
   - recuerdo: la clave con la que se guarda lo que el consultorio elija, para
     que la proxima vez baje solo.
   "recordados" es lo ya elegido antes: { clave: nombre del servicio }. */
function opcionesDelTrabajo(servicios, clave, pieza, { caras = 0, recordados = {} } = {}) {
  const trabajo = TRABAJO_DEL_ODONTOGRAMA[clave];
  const nada = { elegido: null, opciones: [], recuerdo: "" };
  if (!trabajo || !trabajo.busca) return nada;
  let tamano = trabajo.tamano || "";
  if (trabajo.porCaras) tamano = caras <= 1 ? "simple" : caras === 2 ? "compuesta" : "compleja";
  const respuesta = buscar(servicios, trabajo, pieza, tamano, recordados);
  // la compleja, donde no la tienen aparte, se cobra como la compuesta
  if (trabajo.busca === "curacion" && tamano === "compleja" && !respuesta.elegido) {
    const comoCompuesta = buscar(servicios, trabajo, pieza, "compuesta", recordados);
    if (comoCompuesta.elegido) return comoCompuesta;
  }
  if (respuesta.opciones.length) return respuesta;
  // el resto radicular, donde no tiene precio propio, es una extraccion simple
  if (trabajo.siNoHay) return opcionesDelTrabajo(servicios, trabajo.siNoHay, pieza, { caras, recordados });
  return respuesta;
}

function buscar(servicios, trabajo, pieza, tamano, recordados) {
  const familia = FAMILIAS_DE_SERVICIO[trabajo.busca] || [];
  const floja = FAMILIAS_FLOJAS[trabajo.busca] || [];
  const fuera = NO_ES_DE_LA_FAMILIA[trabajo.busca] || [];
  const deLeche = esDeLeche(pieza);
  const arcada = arcadaDe(pieza);
  const ubicacion = ubicacionDePieza(pieza);
  const todasLasUbicaciones = Object.values(UBICACIONES_DE_PIEZA).flat();
  const aqui = UBICACIONES_DE_PIEZA[ubicacion] || [];

  let candidatos = (servicios || [])
    .filter((item) => item && item.active !== false && String(item.name || "").trim())
    .map((item) => ({ item, palabras: palabrasDelServicio(item.name) }))
    .map((c) => {
      const fuerte = tieneRaiz(c.palabras, familia, true);
      /* "Instalación" sola, sin decir de que, en una lista dental es la de
         los brackets; se ofrece, no se toma sola. */
      const soloInstalacion = trabajo.busca === "ortodoncia_fija" && c.palabras.length === 1 && valePorRaiz(c.palabras[0], "instalacion", true);
      return { ...c, fuerte, flojo: !fuerte && (soloInstalacion || tieneRaiz(c.palabras, floja, true)) };
    })
    .filter((c) => c.fuerte || c.flojo)
    .filter((c) => !tieneRaiz(c.palabras, fuera))
    /* "Dientes temporales" son los de leche, no una curacion provisional. */
    .filter((c) => !tieneRaiz(c.palabras, RAICES_QUE_NO_SON_EL_TRABAJO.filter((raiz) => raiz !== "temporal" || !tieneRaiz(c.palabras, RAICES_DE_NINO))));

  // "Implante mas corona" es el implante; "Corona sobre implante" es la corona
  if (trabajo.busca === "implante") candidatos = candidatos.filter((c) => !valePorRaiz(c.palabras[0], "corona", false));

  // la de ninos vale para un diente de leche; para una pieza permanente, nunca
  const deNinos = candidatos.filter((c) => tieneRaiz(c.palabras, RAICES_DE_NINO));
  const huboDeNinos = deLeche && deNinos.length > 0;
  candidatos = huboDeNinos ? deNinos : candidatos.filter((c) => !deNinos.includes(c));

  // la que dice "superior" no es para una pieza de abajo, ni al reves
  const dicenArcada = candidatos.some((c) => arcadaDelServicio(c.palabras));
  if (arcada && dicenArcada) candidatos = candidatos.filter((c) => !arcadaDelServicio(c.palabras) || arcadaDelServicio(c.palabras) === arcada);

  let opciones = candidatos;
  let elegido = null;
  let recuerdo = trabajo.busca;

  if (trabajo.busca === "curacion") {
    recuerdo += `:${tamano}`;
    const conTamano = candidatos.filter((c) => tieneRaiz(c.palabras, TAMANOS_DE_SERVICIO[tamano] || []));
    if (conTamano.length) {
      opciones = conTamano;
      elegido = elMasCorto(conTamano);
    } else {
      /* El consultorio no separa por caras: tiene "Resina 3M" o "Restauración
         estética". Se ofrecen las que no dicen otro tamano. */
      opciones = candidatos.filter((c) => !tieneRaiz(c.palabras, Object.values(TAMANOS_DE_SERVICIO).flat()));
      // la restauracion de dientes de leche, si es una sola, es esa
      if (huboDeNinos && opciones.length && todosCuestanIgual(opciones)) elegido = elMasCorto(opciones);
    }
  } else if (tamano === "simple") {
    // "Exodoncia Simple" o "Exodoncia" a secas; nunca la de tercer molar ni la compleja
    opciones = candidatos.filter((c) => !tieneRaiz(c.palabras, TAMANOS_DE_SERVICIO.tercer_molar) && !tieneRaiz(c.palabras, RAICES_QUE_NO_SON_SIMPLE));
    const dichaSimple = opciones.filter((c) => tieneRaiz(c.palabras, TAMANOS_DE_SERVICIO.simple));
    if (opciones.length) elegido = elMasCorto(dichaSimple.length ? dichaSimple : opciones);
  } else if (tamano === "tercer_molar") {
    recuerdo += ":tercer_molar";
    opciones = candidatos.filter((c) => tieneRaiz(c.palabras, TAMANOS_DE_SERVICIO.tercer_molar));
    /* La que no dice "retenida" ni "impactada" es la del molar que ya salio.
       Si todas lo dicen, el odontograma no sabe cual es y no se adivina. */
    const sinApellido = opciones.filter((c) => !tieneRaiz(c.palabras, RAICES_QUE_NO_SON_SIMPLE));
    if (sinApellido.length) elegido = elMasCorto(sinApellido);
  } else if (trabajo.porPieza) {
    recuerdo += `:${ubicacion}`;
    // la que dice la ubicacion de esta pieza gana a la general
    let deAqui = candidatos.filter((c) => tieneRaiz(c.palabras, aqui, true));
    const generales = candidatos.filter((c) => !tieneRaiz(c.palabras, todasLasUbicaciones, true));
    // donde solo separan anterior y posterior, el premolar es posterior
    if (!deAqui.length && ubicacion === "premolar") deAqui = candidatos.filter((c) => tieneRaiz(c.palabras, ["posterior"], true));
    if (deAqui.length > 1 && ubicacion === "anterior") {
      // incisivos y caninos por separado: el 3 es el canino
      const esCanino = Number(String(pieza).charAt(1)) === 3;
      const exacta = deAqui.filter((c) => tieneRaiz(c.palabras, [esCanino ? "canin" : "incisiv"], true));
      if (exacta.length) deAqui = exacta;
    }
    if (deAqui.length) { elegido = elMasCorto(deAqui); opciones = deAqui; }
    else if (generales.length) { elegido = elMasCorto(generales); opciones = generales; }
    /* Si no hay ni la de esta ubicacion ni una general -solo "unirradicular"
       y "multirradicular" para un premolar-, se ofrecen todas y el doctor
       dice cual cobra. */
  } else {
    /* Corona, brackets, protesis, incrustacion: si la lista tiene uno solo, o
       varios al mismo precio, se toma; entre varios de distinto precio no se
       adivina el material ni la marca. */
    const fuertes = candidatos.filter((c) => c.fuerte);
    /* "Puente de 10 piezas" tiene precio de diez piezas: se ofrece, no se toma. */
    const porUnidades = (c) => c.palabras.some((p, i) => /^\d+$/.test(p) && /^(pieza|pza|unidad|und)/.test(c.palabras[i + 1] || ""));
    const claros = fuertes.filter((c) => !porUnidades(c));
    if (claros.length && fuertes.length === claros.length && todosCuestanIgual(claros)) elegido = elMasCorto(claros);
  }

  if (deLeche && huboDeNinos) recuerdo += ":leche";
  if (arcada && dicenArcada) recuerdo += `:${arcada}`;

  // dos servicios con el mismo nombre y precio son uno solo
  const vistos = new Set();
  opciones = opciones.filter((c) => {
    const huella = `${sinTildes(c.item.name)}|${precioDe(c.item)}`;
    if (vistos.has(huella)) return false;
    vistos.add(huella);
    return true;
  });

  // lo que el consultorio ya eligio para este trabajo manda sobre lo automatico
  const recordado = recordados && recordados[recuerdo]
    ? opciones.find((c) => mismoNombre(c.item.name, recordados[recuerdo]))
    : null;
  if (recordado) elegido = recordado;

  return {
    elegido: elegido ? elegido.item : null,
    opciones: opciones.map((c) => c.item),
    recuerdo
  };
}

/* Los trabajos del odontograma para los que la lista del consultorio no tiene
   ningun servicio. Sirve para avisarlo en Configuracion: si lo agregan con su
   precio, baja solo al plan. Cada uno se prueba en una pieza de ejemplo. */
const TRABAJOS_A_REVISAR = [
  ["Curación simple", "curacion_simple", "16"],
  ["Curación compuesta", "curacion_compuesta", "16"],
  ["Sellante", "sellante_rehacer", "16"],
  ["Extracción", "extraccion", "16"],
  ["Extracción de tercer molar", "extraccion_molar", "18"],
  ["Endodoncia", "endodoncia", "16"],
  ["Pulpotomía", "pulpotomia", "55"],
  ["Pulpectomía", "pulpectomia", "55"],
  ["Corona", "corona_definitiva", "16"],
  ["Espigo o perno", "espigo_rehacer", "16"],
  ["Incrustación", "incrustacion_rehacer", "16"],
  ["Carilla", "carilla_rehacer", "11"],
  ["Implante", "implante_rehacer", "16"],
  ["Prótesis fija o puente", "protesis_fija", "16-14"],
  ["Prótesis removible", "protesis_rem", "16-14"],
  ["Prótesis total", "protesis_total", "Sup."],
  ["Brackets u ortodoncia fija", "orto_fija", "17-27"],
  ["Ortodoncia removible", "orto_rem", "17-27"]
];
function trabajosSinPrecio(servicios) {
  return TRABAJOS_A_REVISAR
    .filter(([, clave, pieza]) => !opcionesDelTrabajo(servicios, clave, pieza).opciones.length)
    .map(([nombre]) => nombre);
}

window.PreciosOdontograma = { TRABAJO_DEL_ODONTOGRAMA, opcionesDelTrabajo, trabajosSinPrecio, sinTildes, palabrasDelServicio, esDeLeche, ubicacionDePieza };
})();
