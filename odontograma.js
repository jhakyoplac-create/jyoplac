/*
  Odontograma segun la Norma Tecnica del Odontograma (MINSA).

  Modulo independiente del resto del sistema: no toca el estado global ni la
  base de datos. Recibe una ficha, dibuja el odontograma y avisa por onChange
  cada vez que cambia, indicando que claves hay que guardar.

  Se carga como script clasico (sin export) para poder usarse igual desde el
  sistema de CM y desde el demo de EmpresaFacil, que usa modulos ES.

  Uso:
    const odo = Odontograma.crear({ barra, lienzo, onChange });
    odo.cargar(ficha);
*/
(function () {
  "use strict";

  var UP = ["18", "17", "16", "15", "14", "13", "12", "11", "21", "22", "23", "24", "25", "26", "27", "28"];
  var DOWN = ["48", "47", "46", "45", "44", "43", "42", "41", "31", "32", "33", "34", "35", "36", "37", "38"];
  var PIEZAS = UP.concat(DOWN);
  var COLW = 58;
  var ANCHO = 50;
  var CLAVE_FICHA = "__ficha";

  /* Dimensiones reales de cada ilustracion, para calcular el viewBox sin
     esperar a que carguen las imagenes. */
  var IMGS = {
    "incisivo": { archivo: "incisivo.png", w: 150, h: 424 },
    "canino": { archivo: "canino.png", w: 150, h: 483 },
    "premolar": { archivo: "premolar.png", w: 150, h: 371 },
    "molar-superior": { archivo: "molar-superior.png", w: 150, h: 283 },
    "molar-inferior": { archivo: "molar-inferior.png", w: 150, h: 292 }
  };

  /* Donde termina la corona dentro de cada ilustracion, como fraccion del
     alto. Medido sobre las propias imagenes: la corona es esmalte casi blanco
     y la raiz es beige, asi que el cuello es donde sube la saturacion. */
  var CORONA = {
    "incisivo": 0.390, "canino": 0.387, "premolar": 0.376,
    "molar-superior": 0.401, "molar-inferior": 0.389
  };

  function tipo(t) {
    var ult = String(t).slice(-1), sup = UP.indexOf(String(t)) >= 0;
    if (ult === "1" || ult === "2") return "incisivo";
    if (ult === "3") return "canino";
    if (ult === "4" || ult === "5") return "premolar";
    return sup ? "molar-superior" : "molar-inferior";
  }
  function arcoDe(t) { return UP.indexOf(String(t)) >= 0 ? "up" : "down"; }
  function indiceDe(t) { var l = arcoDe(t) === "up" ? UP : DOWN; return l.indexOf(String(t)); }
  function centroDe(t) { return indiceDe(t) * COLW + COLW / 2; }

  /* --- Tamano de cada pieza ------------------------------------------------
     Hay cinco ilustraciones para treinta y dos piezas, asi que cada una se
     dibuja con su tamano real en vez de repetir el mismo dibujo a la misma
     escala: el incisivo lateral es mas angosto que el central, el canino es
     la pieza mas larga y los molares inferiores son mas anchos que los
     superiores. Medidas en milimetros de la anatomia dental (ancho
     mesiodistal de la corona y largo total de la pieza). */
  var MEDIDAS = {
    "11": [8.5, 23.5], "12": [6.5, 22.0], "13": [7.5, 26.5], "14": [7.0, 22.5],
    "15": [6.7, 22.5], "16": [10.0, 20.0], "17": [9.0, 20.0], "18": [8.5, 17.0],
    "31": [5.0, 21.5], "32": [5.5, 23.5], "33": [7.0, 25.5], "34": [7.0, 22.5],
    "35": [7.1, 22.5], "36": [11.0, 21.0], "37": [10.5, 20.0], "38": [10.0, 18.0]
  };
  // la ilustracion de cada tipo representa a esta pieza, que sirve de patron
  var PATRON = {
    "incisivo": "11", "canino": "13", "premolar": "14",
    "molar-superior": "16", "molar-inferior": "36"
  };
  function medidaDe(t) {
    // las piezas de la izquierda miden igual que su simetrica de la derecha
    var n = String(t), c = n.charAt(0), u = n.charAt(1);
    var clave = (c === "1" || c === "2" ? "1" : "3") + u;
    return MEDIDAS[clave] || MEDIDAS["11"];
  }
  function escalaDe(t) {
    var base = medidaDe(PATRON[tipo(t)]), m = medidaDe(t);
    return { ancho: m[0] / base[0], largo: m[1] / base[1] };
  }
  function anchoDe(t) { return ANCHO * escalaDe(t).ancho; }
  function altoDe(t) {
    var tp = tipo(t);
    return ANCHO * (IMGS[tp].h / IMGS[tp].w) * escalaDe(t).largo;
  }

  /* --- Alineacion por la linea del cuello ---------------------------------
     Si las piezas se apilaran por el borde de la imagen, los caninos
     colgarian mucho mas que los molares. Con la corona y la raiz mas largas
     del juego se fija una altura de celda comun y la altura a la que debe
     caer el cuello en cada maxilar. */
  var MAX_CORONA = 0, MAX_RAIZ = 0;
  PIEZAS.forEach(function (t) {
    var h = altoDe(t), f = CORONA[tipo(t)];
    MAX_CORONA = Math.max(MAX_CORONA, h * f);
    MAX_RAIZ = Math.max(MAX_RAIZ, h * (1 - f));
  });
  var CELDA = Math.round(MAX_CORONA + MAX_RAIZ);
  var CUELLO = { up: Math.round(MAX_RAIZ), down: Math.round(MAX_CORONA) };

  function desplazamiento(t) {
    var tp = tipo(t), arriba = arcoDe(t) === "up", h = altoDe(t);
    // al voltear la imagen la corona pasa abajo, por eso cambia la fraccion
    var cuelloEnImagen = arriba ? h * (1 - CORONA[tp]) : h * CORONA[tp];
    return { top: (arriba ? CUELLO.up : CUELLO.down) - cuelloEnImagen, h: h };
  }

  /* ==================== NOMENCLATURA DE LA NORMA ==================== */
  var CATS = [
    { k: "sup", n: "Superficie" },
    { k: "pieza", n: "Pieza completa" },
    { k: "box", n: "Recuadro" },
    { k: "span", n: "Entre piezas" },
    { k: "arco", n: "Maxilar" }
  ];

  var SIGLAS_BOX = [
    ["DES", "Desgaste oclusal/incisal"], ["DIS", "Diente discromico"],
    ["E", "Diente ectopico"], ["I", "Impactacion"], ["SI", "Semi-impactacion"],
    ["IMP", "Implante"], ["MAC", "Macrodoncia"], ["MIC", "Microdoncia"],
    ["M1", "Movilidad grado 1"], ["M2", "Movilidad grado 2"], ["M3", "Movilidad grado 3"]
  ];

  var TOOLS = [
    { cat: "sup", k: "caries", n: "Caries", c: "rojo",
      hint: "Clic en la cara comprometida: se pinta totalmente de rojo. La palatina y la lingual se marcan en el cuadro de caras." },
    { cat: "sup", k: "restauracion", n: "Restauracion", c: "azul", sig: ["AM", "R", "IV", "IM", "IE"],
      hint: "Se pinta de azul la cara y la sigla del material va al recuadro." },
    { cat: "sup", k: "rest_temp", n: "Restauracion temporal", c: "rojo", borde: true,
      hint: "Solo el contorno de la restauracion, en rojo." },
    { cat: "sup", k: "borrar_sup", n: "Borrar cara", c: "", hint: "Quita el hallazgo de esa cara." },

    { cat: "pieza", k: "ausente", n: "Ausente", c: "azul", hint: "Aspa azul sobre la figura de la pieza." },
    { cat: "pieza", k: "corona_def", n: "Corona definitiva", c: "azul",
      sig: ["CC", "CF", "CMC", "3/4", "4/5", "7/8", "CV", "CJ"],
      hint: "Circunferencia azul que encierra la corona. El color del metal va en especificaciones." },
    { cat: "pieza", k: "corona_tmp", n: "Corona temporal", c: "rojo", hint: "Circunferencia roja sobre la corona." },
    { cat: "pieza", k: "pulpar", n: "Tratamiento pulpar", c: "azul", sig: ["TC", "PC", "PP"],
      hint: "Linea vertical azul sobre la raiz + sigla del tratamiento." },
    { cat: "pieza", k: "fractura", n: "Fractura", c: "rojo", hint: "Linea roja en el sentido de la fractura." },
    { cat: "pieza", k: "rr", n: "Remanente radicular", c: "rojo", hint: "Letras RR en rojo sobre la raiz." },
    { cat: "pieza", k: "extruido", n: "Extruido", c: "azul", hint: "Flecha azul hacia el plano oclusal." },
    { cat: "pieza", k: "intruido", n: "Intruido", c: "azul", hint: "Flecha vertical azul hacia el apice." },
    { cat: "pieza", k: "giroversion", n: "Giroversion", c: "azul", sig: ["horaria", "antihoraria"],
      hint: "Flecha curva azul siguiendo el sentido de la rotacion." },
    { cat: "pieza", k: "migracion", n: "Migracion", c: "azul", sig: ["mesial", "distal"],
      hint: "Flecha recta horizontal azul en el sentido del desplazamiento." },
    { cat: "pieza", k: "clavija", n: "Diente en clavija", c: "azul",
      hint: "Triangulo azul circunscribiendo el numero de la pieza." },
    { cat: "pieza", k: "limpiar", n: "Limpiar pieza", c: "", hint: "Borra todos los hallazgos de la pieza." },

    { cat: "span", k: "protesis_fija", n: "Protesis fija", c: "azul", malo: true,
      hint: "Clic en el pilar inicial y luego en el final: linea con verticales sobre los pilares." },
    { cat: "span", k: "protesis_rem", n: "Protesis removible", c: "azul", malo: true,
      hint: "Dos lineas paralelas a nivel de los apices. El material va en especificaciones." },
    { cat: "span", k: "orto_fija", n: "Ortodoncia fija", c: "azul", malo: true,
      hint: "Cuadrados con cruz en los extremos unidos por una linea." },
    { cat: "span", k: "orto_rem", n: "Ortodoncia removible", c: "azul", malo: true,
      hint: "Linea en zig-zag a la altura de los apices del maxilar en tratamiento." },
    { cat: "span", k: "diastema", n: "Diastema", c: "azul", vecinas: true,
      hint: "Parentesis invertido entre dos piezas correlativas." },
    { cat: "span", k: "supernumerario", n: "Supernumerario", c: "azul", vecinas: true,
      hint: "Letra S en una circunferencia, entre los apices de las piezas adyacentes." },
    { cat: "span", k: "transposicion", n: "Transposicion", c: "azul",
      hint: "Dos flechas curvas entrecruzadas a la altura de los numeros." },
    { cat: "span", k: "geminacion", n: "Geminacion / fusion", c: "azul",
      hint: "Dos circunferencias interceptadas encerrando los numeros." },
    { cat: "span", k: "borrar_span", n: "Borrar trazo", c: "", hint: "Clic sobre una de las dos piezas del trazo." },

    { cat: "arco", k: "edentulo", n: "Edentulo total", c: "azul",
      hint: "Linea horizontal azul sobre las coronas de las piezas ausentes del maxilar." },
    { cat: "arco", k: "protesis_total", n: "Protesis total", c: "azul", malo: true,
      hint: "Dos lineas paralelas sobre las coronas del maxilar." },
    { cat: "arco", k: "borrar_arco", n: "Quitar", c: "", hint: "Quita el trazo del maxilar." }
  ];

  SIGLAS_BOX.forEach(function (par) {
    TOOLS.push({
      cat: "box", k: par[0], n: par[0] + " · " + par[1], c: "azul",
      hint: 'Registra "' + par[0] + '" en azul dentro del recuadro de la pieza.'
    });
  });
  TOOLS.push({ cat: "box", k: "borrar_box", n: "Vaciar recuadro", c: "", hint: "Borra las siglas del recuadro." });

  function meta(k) {
    for (var i = 0; i < TOOLS.length; i++) if (TOOLS[i].k === k) return TOOLS[i];
    return null;
  }
  function col(c) { return c === "rojo" ? "#d32f2f" : "#1565c0"; }

  /* ==================== FICHA ==================== */
  function fichaVacia() {
    var d = {};
    PIEZAS.forEach(function (t) { d[t] = { sup: {}, pieza: {}, box: [], num: null, nota: "" }; });
    return { dientes: d, spans: [], arcada: { up: null, down: null }, esp: "" };
  }
  function normalizarFicha(f) {
    var base = fichaVacia();
    if (!f || typeof f !== "object") return base;
    PIEZAS.forEach(function (t) {
      var o = (f.dientes || {})[t];
      if (!o) return;
      base.dientes[t] = {
        sup: o.sup || {}, pieza: o.pieza || {},
        box: Array.isArray(o.box) ? o.box : [],
        num: o.num || null, nota: o.nota || ""
      };
    });
    base.spans = Array.isArray(f.spans) ? f.spans.filter(function (s) { return meta(s.k); }) : [];
    base.arcada = { up: (f.arcada || {}).up || null, down: (f.arcada || {}).down || null };
    base.esp = f.esp || "";
    return base;
  }

  /* ==================== CARAS DEL DIENTE ==================== */
  /* La cara mesial mira siempre hacia la linea media. Como las arcadas se
     dibujan de la pieza 8 a la 1 y luego de la 1 a la 8, en los cuadrantes 1 y
     4 (mitad derecha del paciente, que va a la izquierda de la pantalla) la
     linea media queda a la derecha, y en los cuadrantes 2 y 3 a la izquierda. */
  function mesialALaDerecha(t) {
    var c = String(t).charAt(0);
    return c === "1" || c === "4";
  }
  /* Los anteriores no tienen cara oclusal sino borde incisal, y la cara
     interna se llama palatina arriba y lingual abajo. */
  function esAnterior(t) {
    var u = String(t).slice(-1);
    return u === "1" || u === "2" || u === "3";
  }
  function nombreCara(t, cara) {
    if (cara === "oclusal") return esAnterior(t) ? "incisal" : "oclusal";
    if (cara === "lingual") return arcoDe(t) === "up" ? "palatina" : "lingual";
    return cara;
  }

  /* Zonas sobre la ilustracion. Coordenadas siempre con la corona arriba: el
     maxilar superior se voltea despues por CSS. La corona va de y=0 al cuello
     y la franja del borde incisal/oclusal es el extremo libre.
     La cara lingual/palatina no aparece aqui porque en vista frontal queda
     detras del diente: se marca en el cuadro de caras. */
  function zonas(t) {
    var im = IMGS[tipo(t)], W = im.w, H = im.h;
    var cuello = H * CORONA[tipo(t)];
    var bordeY = cuello * 0.34;
    var x0 = W * 0.04, x1 = W * 0.96, p = (x1 - x0) / 3;
    var der = mesialALaDerecha(t);
    function R(a, b, ya, yb) { return "M" + a + "," + ya + " L" + b + "," + ya + " L" + b + "," + yb + " L" + a + "," + yb + " Z"; }
    return [
      { s: "oclusal", d: R(x0, x1, 0, bordeY) },
      { s: der ? "distal" : "mesial", d: R(x0, x0 + p, bordeY, cuello) },
      { s: "vestibular", d: R(x0 + p, x0 + 2 * p, bordeY, cuello) },
      { s: der ? "mesial" : "distal", d: R(x0 + 2 * p, x1, bordeY, cuello) }
    ];
  }

  /* Cuadro de caras: la corona vista desde el plano oclusal, que es la unica
     forma de mostrar las cinco caras a la vez. Es el esquema clasico del
     odontograma y va junto a la corona, entre las dos arcadas.
     El vestibular apunta siempre hacia afuera de la boca, asi que en el
     maxilar superior queda arriba y en el inferior abajo. */
  function caras(t) {
    var arriba = arcoDe(t) === "up";
    // El cuadro se dibuja siempre junto a la corona, entre las dos arcadas: en
    // el maxilar superior queda debajo del diente y en el inferior encima. La
    // cara vestibular va del lado que toca la ilustracion, que muestra
    // justamente esa cara, y la palatina o lingual queda al lado opuesto.
    var ladoSuperior = arriba ? "vestibular" : "lingual";
    var ladoInferior = arriba ? "lingual" : "vestibular";
    var ladoDerecho = mesialALaDerecha(t) ? "mesial" : "distal";
    var ladoIzquierdo = mesialALaDerecha(t) ? "distal" : "mesial";
    return [
      { s: ladoSuperior, d: "M0,0 L100,0 L70,30 L30,30 Z" },
      { s: ladoInferior, d: "M0,100 L100,100 L70,70 L30,70 Z" },
      { s: ladoIzquierdo, d: "M0,0 L30,30 L30,70 L0,100 Z" },
      { s: ladoDerecho, d: "M100,0 L100,100 L70,70 L70,30 Z" },
      { s: "oclusal", d: "M30,30 L70,30 L70,70 L30,70 Z" }
    ];
  }

  /* punta de flecha en (x,y) apuntando en la direccion (dx,dy) */
  function punta(x, y, dx, dy, c, gr) {
    var ang = Math.atan2(dy, dx), L = gr * 2.4, a = 0.48;
    var ax = x - L * Math.cos(ang - a), ay = y - L * Math.sin(ang - a);
    var bx = x - L * Math.cos(ang + a), by = y - L * Math.sin(ang + a);
    return '<path d="M' + x + "," + y + " L" + ax + "," + ay + " L" + bx + "," + by + ' Z" fill="' + c + '"/>';
  }
  function flecha(x1, y1, x2, y2, c, gr) {
    return '<path d="M' + x1 + "," + y1 + " L" + x2 + "," + y2 + '" stroke="' + c +
      '" stroke-width="' + gr + '" fill="none" stroke-linecap="round"/>' + punta(x2, y2, x2 - x1, y2 - y1, c, gr);
  }

  /* ==================== CONTROLADOR ==================== */
  function crear(opts) {
    var barra = opts.barra;
    var lienzo = opts.lienzo;
    // el buscador de paciente puede ir en su propio contenedor, arriba de las
    // herramientas; si no se indica uno, se dibuja dentro del lienzo
    var cabecera = opts.cabecera || null;
    var zonaBusqueda = cabecera || lienzo;
    var ruta = opts.rutaImagenes || "assets/dientes/";
    var onChange = opts.onChange || function () { };
    var onPaciente = opts.onPaciente || null;

    var ficha = fichaVacia();
    var tool = { cat: "sup", k: "caries", sig: null };
    var malEstado = false;
    var sel = null, pendiente = null, hist = [];
    var soloLectura = false;
    var pacientes = [], pacienteId = "";
    var hoja = "inicial";

    function src(tp) { return ruta + IMGS[tp].archivo; }
    function colorDe(m) { return (m.malo && malEstado) ? "rojo" : m.c; }
    function esc(s) {
      return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
        .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }

    /* ---------- dibujo de una pieza ---------- */
    function marcas(t) {
      var d = ficha.dientes[t], p = d.pieza, ks = Object.keys(p);
      if (!ks.length) return "";
      var im = IMGS[tipo(t)], W = im.w, H = im.h;
      var cuello = H * CORONA[tipo(t)];
      var x0 = W * 0.06, x1 = W * 0.94, gr = Math.max(4, W * 0.05);
      var arriba = arcoDe(t) === "up";
      var out = "";
      ks.forEach(function (k) {
        var m = meta(k); if (!m) return;
        var c = col(colorDe(m)), sig = p[k];
        function L(dd) {
          return '<path d="' + dd + '" stroke="' + c + '" stroke-width="' + gr + '" fill="none" stroke-linecap="round"/>';
        }
        if (k === "ausente") {
          out += L("M" + x0 + ",2 L" + x1 + "," + cuello) + L("M" + x1 + ",2 L" + x0 + "," + cuello);
        } else if (k === "corona_def" || k === "corona_tmp") {
          out += '<ellipse cx="' + (W / 2) + '" cy="' + (cuello / 2) + '" rx="' + ((x1 - x0) / 2) +
            '" ry="' + (cuello / 2 - 1) + '" fill="none" stroke="' + c + '" stroke-width="' + gr + '"/>';
        } else if (k === "pulpar") {
          out += L("M" + (W / 2) + "," + cuello + " L" + (W / 2) + "," + (H * 0.93));
        } else if (k === "fractura") {
          out += L("M" + (x0 + W * 0.05) + "," + (cuello * 0.92) + " L" + (x1 - W * 0.05) + ",4");
        } else if (k === "extruido") {
          out += flecha(W / 2, -H * 0.02, W / 2, -H * 0.15, c, gr);
        } else if (k === "intruido") {
          out += flecha(W / 2, -H * 0.17, W / 2, -H * 0.04, c, gr);
        } else if (k === "migracion") {
          var der = sig !== "mesial";
          out += flecha(der ? x0 : x1, -H * 0.09, der ? x1 : x0, -H * 0.09, c, gr);
        } else if (k === "giroversion") {
          // arco sobre el plano oclusal, con la punta en el sentido de la rotacion
          var y = -H * 0.08, horaria = sig !== "antihoraria";
          var ini = horaria ? x0 : x1, fin = horaria ? x1 : x0;
          out += '<path d="M' + ini + "," + y + " Q" + (W / 2) + "," + (y - H * 0.12) + " " + fin + "," + y +
            '" stroke="' + c + '" stroke-width="' + gr + '" fill="none" stroke-linecap="round"/>';
          out += punta(fin, y, fin - W / 2, H * 0.12, c, gr);
        } else if (k === "rr") {
          var yy = cuello + (H - cuello) * 0.5;
          var g = arriba ? ' transform="translate(0,' + (2 * yy) + ') scale(1,-1)"' : "";
          out += "<g" + g + '><text x="' + (W / 2) + '" y="' + yy + '" fill="' + c + '" font-size="' + (W * 0.36) +
            '" font-family="Segoe UI,Arial" font-weight="800" text-anchor="middle" dominant-baseline="middle">RR</text></g>';
        }
      });
      return out;
    }

    function dienteHtml(t) {
      var im = IMGS[tipo(t)], d = ficha.dientes[t], arriba = arcoDe(t) === "up";
      var zs = zonas(t);
      var rell = zs.map(function (z) {
        var h = d.sup[z.s]; if (!h) return "";
        var m = meta(h); if (!m) return "";
        return m.borde
          ? '<path d="' + z.d + '" fill="none" stroke="' + col(m.c) + '" stroke-width="' + (im.w * 0.05) + '"/>'
          : '<path d="' + z.d + '" fill="' + col(m.c) + '" opacity=".8"/>';
      }).join("");
      var clic = zs.map(function (z) {
        return '<path class="odo-zona" d="' + z.d + '" data-s="' + z.s + '"></path>';
      }).join("");
      var o = desplazamiento(t);
      var pos = "top:" + o.top.toFixed(1) + "px;height:" + o.h.toFixed(1) + "px";
      var mask = "-webkit-mask-image:url(" + src(tipo(t)) + ");mask-image:url(" + src(tipo(t)) + ")";
      var estado = pendiente === t ? " odo-pendiente" : (sel === t ? " odo-sel" : "");
      var vb = 'viewBox="0 0 ' + im.w + " " + im.h + '" preserveAspectRatio="none"';
      return '<div class="odo-diente' + (arriba ? " odo-arriba" : "") + estado + '" data-t="' + t + '"' +
        ' style="width:' + anchoDe(t).toFixed(1) + "px;height:" + CELDA + 'px">' +
        '<img src="' + src(tipo(t)) + '" alt="Pieza ' + t + '" draggable="false" style="' + pos + '">' +
        '<svg class="odo-hall" ' + vb + ' style="' + pos + ";" + mask + '">' + rell + "</svg>" +
        '<svg class="odo-libre" ' + vb + ' style="' + pos + '">' + marcas(t) + "</svg>" +
        "<svg " + vb + ' style="' + pos + '">' + clic + "</svg></div>";
    }

    /* Cuadro con las cinco caras de la corona vista desde el plano oclusal.
       Aqui si se puede marcar la cara palatina o lingual, que en la
       ilustracion frontal queda escondida detras del diente. */
    function carasHtml(t) {
      var d = ficha.dientes[t];
      var zs = caras(t).map(function (z) {
        var h = d.sup[z.s], relleno = "", m = h ? meta(h) : null;
        // va en style y no como atributo: en SVG los atributos de presentacion
        // pierden frente a la regla CSS de la clase
        if (m) {
          relleno = m.borde
            ? ' style="fill:none;stroke:' + col(m.c) + ';stroke-width:7"'
            : ' style="fill:' + col(m.c) + ';fill-opacity:.85"';
        }
        return '<path class="odo-cara" d="' + z.d + '" data-s="' + z.s + '"' + relleno +
          '><title>' + nombreCara(t, z.s) + "</title></path>";
      }).join("");
      return '<div class="odo-col"><svg class="odo-caras" viewBox="-3 -3 106 106" data-t="' + t + '">' +
        zs + "</svg></div>";
    }

    function filaHtml(lista, kind) {
      return lista.map(function (t) {
        if (kind === "diente") return '<div class="odo-col">' + dienteHtml(t) + "</div>";
        if (kind === "num") return '<div class="odo-col"><span class="odo-num" data-num="' + t + '">' + t + "</span></div>";
        if (kind === "caras") return carasHtml(t);
        var c = ficha.dientes[t].box;
        var txt = c.map(function (x) {
          return '<span class="' + (x.c === "rojo" ? "odo-ro" : "odo-az") + '">' + esc(x.k) + "</span>";
        }).join(" ");
        return '<div class="odo-col"><div class="odo-recuadro" data-box="' + t + '">' + txt + "</div></div>";
      }).join("");
    }

    /* ---------- capa de trazos entre piezas ---------- */
    function capa(arco) {
      var wrap = lienzo.querySelector("#odo-" + arco + "-wrap");
      var svg = lienzo.querySelector("#odo-" + arco + "-ov");
      if (!wrap || !svg) return;
      var W = COLW * 16, H = wrap.offsetHeight;
      svg.setAttribute("viewBox", "0 0 " + W + " " + H);
      svg.setAttribute("width", W); svg.setAttribute("height", H);

      var up = arco === "up";
      var tFila = lienzo.querySelector("#odo-" + arco).offsetTop;
      var nFila = lienzo.querySelector("#odo-" + arco + "-num");
      var numY = nFila.offsetTop + nFila.offsetHeight / 2;
      // en el maxilar superior la raiz queda arriba y la corona abajo
      var apiceY = up ? tFila + 6 : tFila + CELDA - 6;
      var fuera = up ? -1 : 1;   // hacia afuera de la boca desde el apice
      // los trazos que van sobre las coronas se dibujan por fuera del cuadro
      // de caras, para no taparlo
      var cFila = lienzo.querySelector("#odo-" + arco + "-caras");
      var carasY = cFila.offsetTop, carasH = cFila.offsetHeight;
      var coronaY = up ? carasY + carasH + 3 : carasY - 3;
      var carasCY = carasY + carasH / 2;   // altura del hueco entre dos piezas

      var out = "";
      function st(c, gr) {
        return 'stroke="' + col(c) + '" stroke-width="' + (gr || 2.2) + '" fill="none" stroke-linecap="round"';
      }

      var a = ficha.arcada[arco];
      if (a && meta(a)) {
        var ca = colorDe(meta(a)), ya = coronaY - fuera * 4;
        out += '<path d="M6,' + ya + " L" + (W - 6) + "," + ya + '" ' + st(ca, 2.4) + "/>";
        if (a === "protesis_total") {
          out += '<path d="M6,' + (ya - fuera * 5) + " L" + (W - 6) + "," + (ya - fuera * 5) + '" ' + st(ca, 2.4) + "/>";
        }
      }

      ficha.spans.filter(function (s) { return s.arco === arco; }).forEach(function (s) {
        var m = meta(s.k); if (!m) return;
        var c = colorDe(m);
        var xa = Math.min(centroDe(s.a), centroDe(s.b)), xb = Math.max(centroDe(s.a), centroDe(s.b));
        var y = apiceY + fuera * 9;

        if (s.k === "protesis_fija") {
          out += '<path d="M' + xa + "," + y + " L" + xb + "," + y + '" ' + st(c, 2.4) + "/>";
          [xa, xb].forEach(function (x) {
            out += '<path d="M' + x + "," + y + " L" + x + "," + (y + fuera * 11) + '" ' + st(c, 2.4) + "/>";
          });
        } else if (s.k === "protesis_rem") {
          out += '<path d="M' + xa + "," + y + " L" + xb + "," + y + '" ' + st(c, 2.2) + "/>";
          out += '<path d="M' + xa + "," + (y + fuera * 6) + " L" + xb + "," + (y + fuera * 6) + '" ' + st(c, 2.2) + "/>";
        } else if (s.k === "orto_fija") {
          out += '<path d="M' + xa + "," + y + " L" + xb + "," + y + '" ' + st(c, 2.2) + "/>";
          [xa, xb].forEach(function (x) {
            var r = 6;
            out += '<rect x="' + (x - r) + '" y="' + (y - r) + '" width="' + (2 * r) + '" height="' + (2 * r) + '" ' + st(c, 2) + "/>";
            out += '<path d="M' + (x - r) + "," + (y - r) + " L" + (x + r) + "," + (y + r) +
              " M" + (x + r) + "," + (y - r) + " L" + (x - r) + "," + (y + r) + '" ' + st(c, 1.6) + "/>";
          });
        } else if (s.k === "orto_rem") {
          var d = "M" + xa + "," + y, x = xa, k = 0;
          while (x < xb) {
            var nx = Math.min(x + 9, xb);
            d += " L" + nx + "," + (y + (k % 2 ? 0 : fuera * 7));
            x = nx; k++;
          }
          out += '<path d="' + d + '" ' + st(c, 2.2) + "/>";
        } else if (s.k === "diastema") {
          // va en el hueco entre las dos piezas, a la altura del cuadro de caras
          var xm = (centroDe(s.a) + centroDe(s.b)) / 2;
          var y0 = carasCY + 13, y1 = carasCY - 13;
          out += '<path d="M' + (xm - 5) + "," + y0 + " Q" + (xm - 1) + "," + ((y0 + y1) / 2) + " " + (xm - 5) + "," + y1 + '" ' + st(c, 2.2) + "/>";
          out += '<path d="M' + (xm + 5) + "," + y0 + " Q" + (xm + 1) + "," + ((y0 + y1) / 2) + " " + (xm + 5) + "," + y1 + '" ' + st(c, 2.2) + "/>";
        } else if (s.k === "supernumerario") {
          var xs = (centroDe(s.a) + centroDe(s.b)) / 2, ys = apiceY + fuera * 12;
          out += '<circle cx="' + xs + '" cy="' + ys + '" r="9" ' + st(c, 2) + "/>";
          out += '<text x="' + xs + '" y="' + ys + '" fill="' + col(c) +
            '" font-size="11" font-weight="800" font-family="Segoe UI,Arial" text-anchor="middle" dominant-baseline="central">S</text>';
        } else if (s.k === "geminacion") {
          [centroDe(s.a), centroDe(s.b)].forEach(function (x) {
            out += '<ellipse cx="' + x + '" cy="' + numY + '" rx="16" ry="10" ' + st(c, 2) + "/>";
          });
        } else if (s.k === "transposicion") {
          out += flecha(xa, numY - 13, xb, numY + 13, col(c), 2.2);
          out += flecha(xb, numY - 13, xa, numY + 13, col(c), 2.2);
        }
      });

      (up ? UP : DOWN).forEach(function (t) {
        if (ficha.dientes[t].num !== "clavija") return;
        var x = centroDe(t);
        out += '<path d="M' + x + "," + (numY - 11) + " L" + (x + 14) + "," + (numY + 9) +
          " L" + (x - 14) + "," + (numY + 9) + ' Z" ' + st("azul", 1.8) + "/>";
      });

      svg.innerHTML = out;
    }

    /* ---------- descripcion de hallazgos ---------- */
    var ORDEN = ["mesial", "vestibular", "distal", "lingual", "oclusal"];
    function describir(t) {
      var d = ficha.dientes[t], out = [];
      Object.keys(d.pieza).forEach(function (k) {
        var m = meta(k); if (!m) return;
        out.push({ txt: m.n + (d.pieza[k] ? " (" + d.pieza[k] + ")" : ""), c: colorDe(m) });
      });
      ORDEN.forEach(function (z) {
        if (!d.sup[z]) return;
        var m = meta(d.sup[z]); if (!m) return;
        out.push({ txt: m.n + " · " + nombreCara(t, z), c: m.c });
      });
      d.box.forEach(function (x) {
        var m = meta(x.k);   // las siglas de material no son herramienta propia
        out.push({ txt: m ? m.n : "Recuadro: " + x.k, c: x.c });
      });
      if (d.num === "clavija") out.push({ txt: "Diente en clavija", c: "azul" });
      if (d.nota) out.push({ txt: d.nota, c: "azul" });
      return out;
    }
    function listaHallazgos() {
      var filas = [];
      PIEZAS.forEach(function (t) {
        describir(t).forEach(function (x) { filas.push({ t: t, txt: x.txt, c: x.c }); });
      });
      ficha.spans.forEach(function (s) {
        var m = meta(s.k); if (!m) return;
        filas.push({ t: s.a + "-" + s.b, txt: m.n, c: colorDe(m) });
      });
      ["up", "down"].forEach(function (k) {
        var a = ficha.arcada[k]; if (!a || !meta(a)) return;
        filas.push({ t: k === "up" ? "Sup." : "Inf.", txt: meta(a).n, c: colorDe(meta(a)) });
      });
      return filas;
    }

    /* ---------- render ---------- */
    function renderBarra() {
      if (!barra) return;
      var lista = TOOLS.filter(function (x) { return x.cat === tool.cat; });
      var html = '<div class="odo-tabs">' + CATS.map(function (c) {
        return '<button type="button" class="odo-tab' + (tool.cat === c.k ? " on" : "") + '" data-cat="' + c.k + '">' + c.n + "</button>";
      }).join("") + "</div>";

      html += '<div class="odo-row">' + lista.map(function (x) {
        var c = colorDe(x);
        var sw = !x.c ? "background:transparent"
          : x.borde ? "border-color:" + col(c) + ";background:transparent"
            : "background:" + col(c) + ";border-color:transparent";
        return '<button type="button" class="odo-t' + (tool.k === x.k ? " on" : "") + '" data-tool="' + x.k + '">' +
          '<span class="odo-sw" style="' + sw + '"></span>' + esc(x.n) + "</button>";
      }).join("");
      if (lista.some(function (x) { return x.malo; })) {
        html += '<label class="odo-estado"><input type="checkbox" data-malo' + (malEstado ? " checked" : "") + "> Mal estado (rojo)</label>";
      }
      html += "</div>";

      var m = meta(tool.k);
      if (m && m.sig) {
        html += '<div class="odo-sigrow"><em>' +
          (m.k === "giroversion" || m.k === "migracion" ? "Sentido" : "Tipo") + "</em>" +
          m.sig.map(function (s) {
            return '<button type="button" class="odo-sig' + (tool.sig === s ? " on" : "") + '" data-sig="' + esc(s) + '">' + esc(s) + "</button>";
          }).join("") + "</div>";
      }
      var hint = m ? m.hint : "";
      if (pendiente) hint = "<b>Pieza " + pendiente + " seleccionada.</b> Ahora haz clic en la segunda pieza del mismo maxilar.";
      html += '<p class="odo-hint">' + hint + "</p>";
      barra.innerHTML = html;
    }

    /* Guia del cuadro de caras: explica que es la corona vista desde arriba y
       donde queda cada cara, porque la palatina o lingual solo se marca ahi. */
    function guiaCarasHtml() {
      var etiquetas = [
        { s: "Vestibular", x: 50, y: -6 },
        { s: "Palatina o lingual", x: 50, y: 116 },
        { s: "Distal", x: -6, y: 50, anchor: "end" },
        { s: "Mesial", x: 106, y: 50, anchor: "start" },
        { s: "Oclusal", x: 50, y: 52 }
      ];
      var caja = caras("16").map(function (z) {
        return '<path d="' + z.d + '" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>';
      }).join("");
      var texto = etiquetas.map(function (e) {
        return '<text x="' + e.x + '" y="' + e.y + '" font-size="13" fill="currentColor"' +
          ' text-anchor="' + (e.anchor || "middle") + '" dominant-baseline="middle">' + e.s + "</text>";
      }).join("");
      return '<svg viewBox="-64 -16 228 148" class="odo-guia-svg">' + caja + texto + "</svg>" +
        "<p>El cuadro es la corona vista desde arriba. La cara palatina o lingual " +
        "queda detras del diente, por eso solo se puede marcar ahi. " +
        "La mesial siempre mira hacia el centro de la boca.</p>";
    }

    function esqueleto() {
      var buscador = onPaciente
        ? '<div class="odo-buscar">' +
        '<input type="search" class="odo-q" placeholder="Buscar paciente por nombre o documento" autocomplete="off">' +
        '<div class="odo-res" hidden></div>' +
        '<div class="odo-ficha"></div>' +
        '<select class="odo-hoja"><option value="inicial">Odontograma inicial</option>' +
        '<option value="evolucion">Odontograma de evolucion</option></select>' +
        '<button type="button" class="odo-btn odo-imprimir">Imprimir</button></div>'
        : "";
      if (cabecera) cabecera.innerHTML = buscador;
      lienzo.innerHTML = (cabecera ? "" : buscador) +
        '<div class="odo-layout"><div class="odo-arco">' +
        '<p class="odo-titulo">Maxilar superior &mdash; permanente</p>' +
        '<div class="odo-wrap" id="odo-up-wrap">' +
        '<div class="odo-fila" id="odo-up-box"></div>' +
        '<div class="odo-fila odo-linea" id="odo-up-num"></div>' +
        '<div class="odo-fila odo-linea" id="odo-up"></div>' +
        // el cuadro de caras va junto a la corona, mirando al centro de la boca
        '<div class="odo-fila odo-linea" id="odo-up-caras"></div>' +
        '<svg class="odo-capa" id="odo-up-ov"></svg></div>' +
        // espacio para los trazos que la norma dibuja sobre el plano oclusal
        '<div style="height:40px"></div>' +
        '<div class="odo-wrap" id="odo-down-wrap">' +
        '<div class="odo-fila odo-linea" id="odo-down-caras"></div>' +
        '<div class="odo-fila odo-linea" id="odo-down"></div>' +
        '<div class="odo-fila odo-linea" id="odo-down-num"></div>' +
        '<div class="odo-fila" id="odo-down-box"></div>' +
        '<svg class="odo-capa" id="odo-down-ov"></svg></div>' +
        '<p class="odo-titulo" style="margin:8px 0 0">Maxilar inferior &mdash; permanente</p>' +
        "</div>" +
        '<div class="odo-side">' +
        '<h4>Pieza seleccionada</h4><div class="odo-body odo-selbox"></div>' +
        '<h4>Hallazgos <small class="odo-cuenta"></small></h4>' +
        '<div class="odo-body"><ul class="odo-lista"></ul></div>' +
        '<h4>Especificaciones</h4><div class="odo-body">' +
        '<textarea class="odo-esp" rows="3" placeholder="Hallazgos que no pueden registrarse graficamente, piezas con mas de una anomalia, color del metal, tipo de aparatologia o material."></textarea>' +
        '<p class="odo-aviso"></p></div>' +
        '<h4>Como se lee</h4><div class="odo-body odo-ley">' +
        '<span class="odo-az">Azul</span>: tratamiento en buen estado.<br>' +
        '<span class="odo-ro">Rojo</span>: patologia, mal estado o temporal.' +
        '<div class="odo-guia">' + guiaCarasHtml() + "</div>" +
        "</div></div></div>";
    }

    /* La arcada mide 928 px fijos. Como el panel de cada sistema puede ser mas
       angosto, primero se baja el lateral y si aun no entra se reduce el
       conjunto, en vez de dejar una barra de desplazamiento horizontal. */
    function ajustarAncho() {
      var arco = lienzo.querySelector(".odo-arco");
      if (!arco || !lienzo.clientWidth) return;
      lienzo.classList.toggle("odo-estrecho", lienzo.clientWidth < 1240);
      arco.style.zoom = "";
      var disponible = arco.clientWidth - 8;
      var z = disponible / (COLW * 16 + 8);
      if (z < 1) arco.style.zoom = Math.max(z, 0.45).toFixed(3);
    }

    function renderChart() {
      lienzo.querySelector("#odo-up-box").innerHTML = filaHtml(UP, "box");
      lienzo.querySelector("#odo-up-num").innerHTML = filaHtml(UP, "num");
      lienzo.querySelector("#odo-up").innerHTML = filaHtml(UP, "diente");
      lienzo.querySelector("#odo-up-caras").innerHTML = filaHtml(UP, "caras");
      lienzo.querySelector("#odo-down-caras").innerHTML = filaHtml(DOWN, "caras");
      lienzo.querySelector("#odo-down").innerHTML = filaHtml(DOWN, "diente");
      lienzo.querySelector("#odo-down-num").innerHTML = filaHtml(DOWN, "num");
      lienzo.querySelector("#odo-down-box").innerHTML = filaHtml(DOWN, "box");
      capa("up"); capa("down");
      ajustarAncho();
    }

    function renderLateral() {
      var box = lienzo.querySelector(".odo-selbox");
      if (!sel) {
        box.innerHTML = '<div class="odo-selnum">&mdash;</div><div class="odo-selsub">Selecciona una pieza</div>';
      } else {
        var d = describir(sel);
        box.innerHTML = '<div class="odo-selnum">' + sel + "</div>" +
          '<div class="odo-selsub">' + (d.length ? d.map(function (x) { return esc(x.txt); }).join(" · ") : "Sin hallazgos") + "</div>";
      }
      box.innerHTML += '<button type="button" class="odo-btn odo-undo">Deshacer</button>' +
        '<button type="button" class="odo-btn odo-clear">Limpiar pieza</button>';

      var f = listaHallazgos();
      lienzo.querySelector(".odo-lista").innerHTML = f.map(function (x) {
        return "<li><b>" + esc(x.t) + '</b><span class="' + (x.c === "rojo" ? "odo-ro" : "odo-az") + '">' + esc(x.txt) + "</span></li>";
      }).join("") || '<li class="odo-vacio">Sin hallazgos registrados.</li>';
      lienzo.querySelector(".odo-cuenta").textContent = f.length ? f.length + " registrados" : "";

      // la norma pide detallar en especificaciones las piezas con mas de una anomalia
      var multi = PIEZAS.filter(function (t) { return describir(t).length > 1; });
      lienzo.querySelector(".odo-aviso").innerHTML = multi.length
        ? "La norma pide detallar aqui las piezas con mas de una anomalia: <b>" + multi.join(", ") + "</b>."
        : "";
      var esp = lienzo.querySelector(".odo-esp");
      if (document.activeElement !== esp) esp.value = ficha.esp || "";
      esp.disabled = soloLectura;
    }

    function renderPaciente() {
      var cont = zonaBusqueda.querySelector(".odo-ficha");
      if (!cont) return;
      var p = pacientes.filter(function (x) { return x.id === pacienteId; })[0];
      cont.innerHTML = p
        ? '<div class="odo-dato"><i>Paciente</i><b>' + esc(p.nombre) + "</b></div>" +
        (p.doc ? '<div class="odo-dato"><i>Documento</i><b>' + esc(p.doc) + "</b></div>" : "") +
        (p.edad ? '<div class="odo-dato"><i>Edad</i><b>' + esc(p.edad) + "</b></div>" : "")
        : '<div class="odo-dato"><i>Paciente</i><b>Selecciona un paciente</b></div>';
    }

    function render() {
      renderBarra(); renderChart(); renderLateral(); renderPaciente();
      lienzo.classList.toggle("odo-lectura", soloLectura);
    }

    /* ---------- aplicar herramientas ---------- */
    function guardar() {
      hist.push(JSON.stringify(ficha));
      if (hist.length > 40) hist.shift();
    }
    function ponerBox(t, k, c) {
      var box = ficha.dientes[t].box;
      for (var i = 0; i < box.length; i++) {
        if (box[i].k === k) { box.splice(i, 1); return; }
      }
      box.push({ k: k, c: c });
    }
    function avisar(claves) { onChange(ficha, claves); }

    function aplicarPieza(t) {
      var d = ficha.dientes[t], m = meta(tool.k);

      if (tool.cat === "pieza") {
        if (tool.k === "limpiar") {
          ficha.dientes[t] = { sup: {}, pieza: {}, box: [], num: null, nota: "" };
          return [t];
        }
        if (tool.k === "clavija") {
          d.num = d.num === "clavija" ? null : "clavija";
          return [t];
        }
        if (d.pieza[tool.k] !== undefined && (!m.sig || d.pieza[tool.k] === tool.sig)) {
          delete d.pieza[tool.k];
        } else {
          d.pieza[tool.k] = m.sig ? tool.sig : "";
          // las siglas de corona y tratamiento pulpar van al recuadro
          if (m.sig && (tool.k === "corona_def" || tool.k === "pulpar")) ponerBox(t, tool.sig, colorDe(m));
        }
        return [t];
      }

      if (tool.cat === "box") {
        if (tool.k === "borrar_box") d.box = [];
        else ponerBox(t, tool.k, "azul");
        return [t];
      }

      if (tool.cat === "arco") {
        var a = arcoDe(t);
        ficha.arcada[a] = tool.k === "borrar_arco" ? null : (ficha.arcada[a] === tool.k ? null : tool.k);
        return [CLAVE_FICHA];
      }

      if (tool.cat === "span") {
        if (tool.k === "borrar_span") {
          ficha.spans = ficha.spans.filter(function (s) { return s.a !== t && s.b !== t; });
          pendiente = null;
          return [CLAVE_FICHA];
        }
        if (!pendiente) { pendiente = t; return []; }
        if (pendiente === t) { pendiente = null; return []; }
        if (arcoDe(pendiente) !== arcoDe(t)) {
          alert("Las dos piezas deben pertenecer al mismo maxilar.");
          pendiente = t; return [];
        }
        if (m.vecinas && Math.abs(indiceDe(pendiente) - indiceDe(t)) !== 1) {
          alert("Este hallazgo se registra entre dos piezas correlativas.");
          pendiente = t; return [];
        }
        ficha.spans.push({ k: tool.k, a: pendiente, b: t, arco: arcoDe(t) });
        pendiente = null;
        return [CLAVE_FICHA];
      }
      return [];
    }

    /* ---------- eventos ---------- */
    function onClickBarra(ev) {
      var tab = ev.target.closest("[data-cat]");
      if (tab) {
        var prim = TOOLS.filter(function (x) { return x.cat === tab.dataset.cat; })[0];
        tool = { cat: tab.dataset.cat, k: prim.k, sig: prim.sig ? prim.sig[0] : null };
        pendiente = null; renderBarra(); renderChart(); return;
      }
      var b = ev.target.closest("[data-tool]");
      if (b) {
        var m = meta(b.dataset.tool);
        tool = { cat: m.cat, k: m.k, sig: m.sig ? m.sig[0] : null };
        pendiente = null; renderBarra(); renderChart(); return;
      }
      var s = ev.target.closest("[data-sig]");
      if (s) { tool.sig = s.dataset.sig; renderBarra(); return; }
    }
    function onCambioBarra(ev) {
      if (!ev.target.hasAttribute || !ev.target.hasAttribute("data-malo")) return;
      malEstado = ev.target.checked;
      render();
    }

    function onClickLienzo(ev) {
      if (ev.target.closest(".odo-undo")) {
        var u = hist.pop();
        if (u) { ficha = JSON.parse(u); pendiente = null; render(); avisar(null); }
        return;
      }
      if (ev.target.closest(".odo-clear")) {
        if (!sel || soloLectura) return;
        guardar();
        ficha.dientes[sel] = { sup: {}, pieza: {}, box: [], num: null, nota: "" };
        ficha.spans = ficha.spans.filter(function (s) { return s.a !== sel && s.b !== sel; });
        render(); avisar([sel, CLAVE_FICHA]);
        return;
      }
      if (ev.target.closest(".odo-imprimir")) { imprimir(); return; }

      var r = ev.target.closest("[data-paciente]");
      if (r) {
        pacienteId = r.dataset.paciente;
        zonaBusqueda.querySelector(".odo-q").value = "";
        zonaBusqueda.querySelector(".odo-res").hidden = true;
        if (onPaciente) onPaciente(pacienteId, hoja);
        return;
      }

      if (soloLectura) return;

      var num = ev.target.closest("[data-num]");
      if (num) {
        var tn = num.dataset.num;
        if (tool.cat === "span" || (tool.cat === "pieza" && tool.k === "clavija")) {
          guardar();
          var cl = aplicarPieza(tn);
          sel = tn; render(); if (cl.length) avisar(cl);
        } else { sel = tn; render(); }
        return;
      }
      var box = ev.target.closest("[data-box]");
      if (box) {
        var tb = box.dataset.box;
        if (tool.cat === "box") {
          guardar();
          var cb = aplicarPieza(tb);
          sel = tb; render(); avisar(cb);
        } else { sel = tb; render(); }
        return;
      }

      // se marca igual sobre la ilustracion que sobre el cuadro de caras
      var z = ev.target.closest(".odo-zona, .odo-cara");
      if (!z) return;
      var t = z.closest("[data-t]").dataset.t;
      guardar();
      var claves;
      if (tool.cat === "sup") {
        var d = ficha.dientes[t], cara = z.dataset.s;
        if (tool.k === "borrar_sup") delete d.sup[cara];
        else if (d.sup[cara] === tool.k) delete d.sup[cara];
        else {
          d.sup[cara] = tool.k;
          var ms = meta(tool.k);
          if (ms.sig) ponerBox(t, tool.sig, ms.c);
        }
        claves = [t];
      } else {
        claves = aplicarPieza(t);
      }
      sel = t; render();
      if (claves.length) avisar(claves);
    }

    function onInputLienzo(ev) {
      if (ev.target.classList.contains("odo-esp")) {
        ficha.esp = ev.target.value;
        avisar([CLAVE_FICHA]);
        return;
      }
      if (ev.target.classList.contains("odo-q")) {
        var v = normalizar(ev.target.value.trim());
        var res = zonaBusqueda.querySelector(".odo-res");
        if (!v) { res.hidden = true; return; }
        var hits = pacientes.filter(function (p) {
          return normalizar(p.nombre).indexOf(v) >= 0 || String(p.doc || "").indexOf(v) >= 0;
        }).slice(0, 30);
        res.hidden = false;
        res.innerHTML = hits.length
          ? hits.map(function (p) {
            return '<div class="odo-r" data-paciente="' + esc(p.id) + '"><b>' + esc(p.nombre) + "</b>" +
              "<span>" + esc(p.doc || "") + (p.edad ? " · " + esc(p.edad) : "") + "</span></div>";
          }).join("")
          : '<div class="odo-vacio2">Sin coincidencias.</div>';
      }
    }
    function onCambioLienzo(ev) {
      if (!ev.target.classList.contains("odo-hoja")) return;
      hoja = ev.target.value;
      if (onPaciente) onPaciente(pacienteId, hoja);
    }
    function normalizar(s) {
      return String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }

    /* ---------- impresion ---------- */
    function imprimir() {
      var p = pacientes.filter(function (x) { return x.id === pacienteId; })[0] || {};
      var f = listaHallazgos();
      var hoy = new Date();
      var fecha = String(hoy.getDate()).padStart(2, "0") + "/" +
        String(hoy.getMonth() + 1).padStart(2, "0") + "/" + hoy.getFullYear();
      var arco = lienzo.querySelector(".odo-arco").innerHTML;

      var w = window.open("", "_blank", "width=1200,height=800");
      if (!w) { alert("El navegador bloqueo la ventana de impresion."); return; }
      w.document.write(
        '<!doctype html><html lang="es"><head><meta charset="utf-8">' +
        // la ventana nueva parte de about:blank, asi que sin base las rutas
        // relativas de las ilustraciones y de la hoja de estilos no resuelven
        '<base href="' + esc(location.href) + '">' +
        "<title>Odontograma " + esc(p.nombre || "") + "</title>" +
        hojasDeLaPagina() +
        "<style>" + estilosImpresion() + "</style></head><body>" +
        '<div class="cab"><div><h2>Odontograma ' + (hoja === "inicial" ? "inicial" : "de evolucion") + "</h2>" +
        "<p>Ficha estomatologica &mdash; Norma Tecnica del Odontograma (MINSA)</p></div>" +
        '<div style="text-align:right"><p><b>Fecha:</b> ' + fecha + "</p>" +
        (opts.tituloClinica ? "<p><b>" + esc(opts.tituloClinica) + "</b></p>" : "") + "</div></div>" +
        '<div class="grid"><div><i>Paciente</i><br><b>' + esc(p.nombre || "") + "</b></div>" +
        "<div><i>Documento</i><br><b>" + esc(p.doc || "") + "</b></div>" +
        "<div><i>Edad</i><br><b>" + esc(p.edad || "") + "</b></div>" +
        "<div><i>Historia</i><br><b>" + esc(p.hc || "") + "</b></div></div>" +
        '<div class="grafico">' + arco + "</div>" +
        "<div><b>HALLAZGOS REGISTRADOS</b><ul class=\"tabla\">" +
        (f.map(function (x) { return "<li><b>" + esc(x.t) + "</b> &mdash; " + esc(x.txt) + "</li>"; }).join("") || "<li>Sin hallazgos.</li>") +
        "</ul></div><div><b>ESPECIFICACIONES</b>" +
        '<div class="esp">' + (esc(ficha.esp) || "&nbsp;") + "</div></div>" +
        '<div class="firma"><div>Firma y sello del cirujano dentista</div><div>COP N.&deg;</div>' +
        "<div>Firma del paciente</div></div></body></html>"
      );
      w.document.close();
      // las imagenes deben estar cargadas antes de mandar a imprimir
      w.onload = function () { w.focus(); w.print(); };
      setTimeout(function () { try { w.focus(); w.print(); } catch (e) { } }, 1200);
    }

    /* Se reutilizan las hojas de estilo de la pagina para que el grafico salga
       identico al de pantalla. Van como <link> y no como @import para que el
       navegador espere a tenerlas antes de abrir el dialogo de impresion.
       Se copian todas y no solo la del modulo porque el nombre del archivo
       cambia entre sistemas y las versiones vienen en la propia URL. */
    function hojasDeLaPagina() {
      var links = document.querySelectorAll('link[rel="stylesheet"][href]');
      return Array.prototype.map.call(links, function (l) {
        return '<link rel="stylesheet" href="' + esc(l.href) + '">';
      }).join("");
    }

    function estilosImpresion() {
      return "" +
        "@page{size:A4 landscape;margin:8mm}" +
        // se anula la rejilla del sistema, que en pantalla parte el cuerpo en
        // barra lateral y contenido
        "body{display:block!important;font-family:'Segoe UI',Arial,sans-serif;font-size:11px;" +
        "color:#000;background:#fff;margin:0;padding:0;min-height:0;" +
        "-webkit-print-color-adjust:exact;print-color-adjust:exact}" +
        ".cab{display:flex;justify-content:space-between;border-bottom:1.5px solid #000;padding-bottom:5px;margin-bottom:8px}" +
        ".cab h2{margin:0;font-size:14px} .cab p{margin:1px 0;font-size:10px}" +
        ".grid{display:grid;grid-template-columns:repeat(4,1fr);gap:4px 14px;font-size:10px;margin-bottom:6px}" +
        ".grid i{font-style:normal;color:#555}" +
        // se reduce el grafico para que la ficha entre en una sola hoja A4;
        // aun asi la corona supera el centimetro cuadrado que exige la norma
        ".grafico{zoom:.76}" +
        // la pieza marcada en pantalla no debe salir en la ficha impresa
        ".odo-sel::after,.odo-pendiente::before{display:none!important}" +
        ".odo-num:hover,.odo-zona:hover{background:none;fill:transparent}" +
        ".tabla{column-count:3;column-gap:16px;font-size:9px;margin:2px 0 0;padding:0;list-style:none}" +
        ".tabla li{break-inside:avoid;padding:1.5px 0}" +
        ".esp{border:1px solid #000;padding:4px;min-height:34px;font-size:9.5px;margin-top:4px;white-space:pre-wrap}" +
        ".firma{display:flex;gap:40px;margin-top:16px}" +
        ".firma div{flex:1;border-top:1px solid #000;padding-top:4px;font-size:10px;text-align:center}" +
        "b{font-size:9.5px} .odo-capa{position:absolute;left:0;top:0}";
    }

    /* ---------- API publica ---------- */
    // marca los contenedores para que la hoja del modulo pueda anular los
    // estilos del odontograma anterior de cada sistema
    lienzo.classList.add("odo-raiz");
    if (barra) barra.classList.add("odo-raiz");
    if (cabecera) cabecera.classList.add("odo-raiz");
    esqueleto();
    if (barra) {
      barra.addEventListener("click", onClickBarra);
      barra.addEventListener("change", onCambioBarra);
    }
    lienzo.addEventListener("click", onClickLienzo);
    lienzo.addEventListener("input", onInputLienzo);
    lienzo.addEventListener("change", onCambioLienzo);
    if (cabecera) {
      cabecera.addEventListener("click", onClickLienzo);
      cabecera.addEventListener("input", onInputLienzo);
      cabecera.addEventListener("change", onCambioLienzo);
    }
    document.addEventListener("click", function (ev) {
      var res = zonaBusqueda.querySelector(".odo-res");
      if (res && !ev.target.closest(".odo-buscar")) res.hidden = true;
    });
    window.addEventListener("resize", ajustarAncho);

    return {
      cargar: function (f) {
        ficha = normalizarFicha(f);
        hist = []; pendiente = null;
        render();
      },
      ficha: function () { return ficha; },
      pieza: function (t) { return ficha.dientes[t]; },
      resumenPieza: function (t) {
        return describir(t).map(function (x) { return x.txt; }).join("; ");
      },
      setPacientes: function (lista, id) {
        pacientes = lista || [];
        if (id !== undefined) pacienteId = id;
        renderPaciente();
      },
      pacienteId: function () { return pacienteId; },
      hoja: function () { return hoja; },
      setSoloLectura: function (v) { soloLectura = !!v; render(); },
      imprimir: imprimir,
      refrescar: render
    };
  }

  /* Convierte un registro del odontograma antiguo (una condicion por pieza)
     al modelo de la norma. Lo que no tiene equivalente grafico se conserva
     como nota para no perder informacion. */
  function migrarRegistro(condicion, nota) {
    var d = { sup: {}, pieza: {}, box: [], num: null, nota: "" };
    var c = String(condicion || "").trim();
    if (c === "Ausente" || c === "Extraido") d.pieza.ausente = "";
    else if (c === "Corona") d.pieza.corona_def = "CC";
    else if (c === "Endodoncia") { d.pieza.pulpar = "TC"; d.box.push({ k: "TC", c: "azul" }); }
    else if (c === "Cariado") d.sup.vestibular = "caries";
    else if (c === "Obturado") d.sup.vestibular = "restauracion";
    else if (c === "Sellante") d.sup.oclusal = "restauracion";
    else if (c === "Implante") d.box.push({ k: "IMP", c: "azul" });
    else if (c && c !== "Sano") d.nota = c;
    if (nota) d.nota = d.nota ? d.nota + " - " + nota : nota;
    return d;
  }

  window.Odontograma = {
    crear: crear,
    fichaVacia: fichaVacia,
    normalizarFicha: normalizarFicha,
    migrarRegistro: migrarRegistro,
    PIEZAS: PIEZAS,
    CLAVE_FICHA: CLAVE_FICHA
  };
})();
