/* Receta medica del paciente. La pidio Oral Clinik (Dr. Degnis Munoz,
   2026-10-22) a partir de las recetas de su sistema anterior, y es de todos
   los consultorios. No es un modulo aparte: es una pestana mas de la historia
   del paciente, al lado de la hoja de evolucion y el consentimiento.

   El doctor escribe como en el papel: el diagnostico, los medicamentos y la
   receta (como tomar cada uno) van en cajas grandes, una linea por cosa, con
   su guion. Cada receta queda guardada en el paciente (patient.recetas) con
   su folio correlativo del consultorio y el doctor que la firma, y se imprime
   en A4 con el membrete del consultorio y el COP del doctor. Del papel de
   muestra se tacharon la talla y la presion arterial: no salen.

   Es el mismo archivo que js/render/recetas.js del dental de EmpresaFacil,
   sin imports y envuelto para que sus nombres no choquen con los de app.js:
   usa de app.js state, patientById, savePatientApi y demas, y de
   hojas-extra.js la fecha y el membrete. Al corregir uno, corregir el otro. */


(function () {
/* Los diagnosticos odontologicos del CIE-10 (capitulo K00 a K14, mas los
   traumatismos dentales y el examen de rutina). Se buscan por codigo o por
   nombre en el campo CIE-10 de la receta. */
const CIE10_ODONTOLOGICOS = [
  ["K00.0", "Anodoncia"],
  ["K00.1", "Dientes supernumerarios"],
  ["K00.2", "Anomalías del tamaño y de la forma del diente"],
  ["K00.3", "Dientes moteados (fluorosis)"],
  ["K00.4", "Alteraciones en la formación dentaria"],
  ["K00.5", "Alteraciones hereditarias de la estructura dentaria"],
  ["K00.6", "Alteraciones en la erupción dentaria"],
  ["K00.7", "Síndrome de la erupción dentaria"],
  ["K00.9", "Trastorno del desarrollo de los dientes, no especificado"],
  ["K01.0", "Dientes incluidos"],
  ["K01.1", "Dientes impactados"],
  ["K02.0", "Caries limitada al esmalte"],
  ["K02.1", "Caries de la dentina"],
  ["K02.2", "Caries del cemento"],
  ["K02.3", "Caries dentaria detenida"],
  ["K02.4", "Odontoclasia"],
  ["K02.8", "Otras caries dentales"],
  ["K02.9", "Caries dental, no especificada"],
  ["K03.0", "Atrición excesiva de los dientes"],
  ["K03.1", "Abrasión de los dientes"],
  ["K03.2", "Erosión de los dientes"],
  ["K03.3", "Reabsorción patológica de los dientes"],
  ["K03.4", "Hipercementosis"],
  ["K03.5", "Anquilosis dental"],
  ["K03.6", "Depósitos (acreciones) en los dientes"],
  ["K03.7", "Cambios posteruptivos del color de los tejidos dentales duros"],
  ["K03.8", "Otras enfermedades de los tejidos duros de los dientes"],
  ["K03.9", "Enfermedad de los tejidos duros de los dientes, no especificada"],
  ["K04.0", "Pulpitis"],
  ["K04.1", "Necrosis de la pulpa"],
  ["K04.2", "Degeneración de la pulpa"],
  ["K04.3", "Formación anormal de tejido duro en la pulpa"],
  ["K04.4", "Periodontitis apical aguda originada en la pulpa"],
  ["K04.5", "Periodontitis apical crónica"],
  ["K04.6", "Absceso periapical con fístula"],
  ["K04.7", "Absceso periapical sin fístula"],
  ["K04.8", "Quiste radicular"],
  ["K04.9", "Otras enfermedades de la pulpa y del tejido periapical"],
  ["K05.0", "Gingivitis aguda"],
  ["K05.1", "Gingivitis crónica"],
  ["K05.2", "Periodontitis aguda"],
  ["K05.3", "Periodontitis crónica"],
  ["K05.4", "Periodontosis"],
  ["K05.5", "Otras enfermedades periodontales"],
  ["K05.6", "Enfermedad del periodonto, no especificada"],
  ["K06.0", "Retracción gingival"],
  ["K06.1", "Hiperplasia gingival"],
  ["K06.2", "Lesiones de la encía y del reborde alveolar asociadas con traumatismo"],
  ["K06.8", "Otros trastornos de la encía y del reborde alveolar"],
  ["K06.9", "Trastorno de la encía y del reborde alveolar, no especificado"],
  ["K07.0", "Anomalías evidentes del tamaño de los maxilares"],
  ["K07.1", "Anomalías de la relación maxilobasilar"],
  ["K07.2", "Anomalías de la relación entre los arcos dentarios"],
  ["K07.3", "Anomalías de la posición del diente"],
  ["K07.4", "Maloclusión de tipo no especificado"],
  ["K07.5", "Anomalías dentofaciales funcionales"],
  ["K07.6", "Trastornos de la articulación temporomaxilar"],
  ["K07.8", "Otras anomalías dentofaciales"],
  ["K07.9", "Anomalía dentofacial, no especificada"],
  ["K08.0", "Exfoliación de los dientes debida a causas sistémicas"],
  ["K08.1", "Pérdida de dientes debida a accidente, extracción o enfermedad periodontal local"],
  ["K08.2", "Atrofia del reborde alveolar desdentado"],
  ["K08.3", "Raíz dental retenida"],
  ["K08.8", "Otras afecciones especificadas de los dientes y de sus estructuras de sostén"],
  ["K08.9", "Trastorno de los dientes y de sus estructuras de sostén, no especificado"],
  ["K09.0", "Quistes originados por el desarrollo de los dientes"],
  ["K09.1", "Quistes de las fisuras (no odontogénicos) de la región bucal"],
  ["K09.2", "Otros quistes de los maxilares"],
  ["K09.8", "Otros quistes de la región bucal, no clasificados en otra parte"],
  ["K09.9", "Quiste de la región bucal, sin otra especificación"],
  ["K10.0", "Trastornos del desarrollo de los maxilares"],
  ["K10.1", "Granuloma central de células gigantes"],
  ["K10.2", "Afecciones inflamatorias de los maxilares"],
  ["K10.3", "Alveolitis del maxilar"],
  ["K10.8", "Otras enfermedades especificadas de los maxilares"],
  ["K10.9", "Enfermedad de los maxilares, no especificada"],
  ["K11.2", "Sialoadenitis"],
  ["K11.3", "Absceso de glándula salival"],
  ["K11.5", "Sialolitiasis"],
  ["K11.7", "Alteraciones de la secreción salival"],
  ["K11.9", "Enfermedad de glándula salival, no especificada"],
  ["K12.0", "Estomatitis aftosa recurrente"],
  ["K12.1", "Otras formas de estomatitis"],
  ["K12.2", "Celulitis y absceso de boca"],
  ["K12.3", "Mucositis oral (ulcerativa)"],
  ["K13.0", "Enfermedades de los labios"],
  ["K13.1", "Mordedura del carrillo y del labio"],
  ["K13.2", "Leucoplasia y otras alteraciones del epitelio bucal, incluyendo la lengua"],
  ["K13.3", "Leucoplasia pilosa"],
  ["K13.4", "Granuloma y lesiones semejantes de la mucosa bucal"],
  ["K13.5", "Fibrosis de la submucosa bucal"],
  ["K13.6", "Hiperplasia irritativa de la mucosa bucal"],
  ["K13.7", "Otras lesiones y las no especificadas de la mucosa bucal"],
  ["K14.0", "Glositis"],
  ["K14.1", "Lengua geográfica"],
  ["K14.2", "Glositis romboidea mediana"],
  ["K14.3", "Hipertrofia de las papilas linguales"],
  ["K14.4", "Atrofia de las papilas linguales"],
  ["K14.5", "Lengua plegada"],
  ["K14.6", "Glosodinia"],
  ["K14.8", "Otras enfermedades de la lengua"],
  ["K14.9", "Enfermedad de la lengua, no especificada"],
  ["S02.5", "Fractura de los dientes"],
  ["S03.2", "Luxación de diente"],
  ["S01.5", "Herida del labio y de la cavidad bucal"],
  ["B37.0", "Estomatitis candidiásica (candidiasis oral)"],
  ["B00.2", "Gingivoestomatitis y faringoamigdalitis herpética"],
  ["Z01.2", "Examen odontológico"],
  ["Z46.3", "Prueba y ajuste de prótesis dental"],
  ["Z46.4", "Prueba y ajuste de dispositivo ortodóncico"]
];

/* Del 2026-10-22 al 2026-10-29 solo la tuvo Aurea, mientras el usuario la
   ajustaba; desde el 2026-10-29 la tienen todos los consultorios. */
function tieneReceta() {
  return true;
}

/* Las sugerencias del buscador CIE-10: por nombre o por codigo, sin tildes,
   las ocho primeras. */
const sinTildes = (texto) => String(texto || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
function sugerenciasCie(texto) {
  const buscado = sinTildes(texto).trim();
  if (!buscado) return [];
  return CIE10_ODONTOLOGICOS
    .filter(([codigo, nombre]) => sinTildes(codigo).includes(buscado) || sinTildes(nombre).includes(buscado))
    .slice(0, 8);
}

/* Los medicamentos se escriben por filas: el nombre a mano, la dosis con
   opciones (o escrita), la presentacion de una lista y la cantidad. Al
   guardar, cada fila se vuelve una linea «Amoxicilina 500 mg · Tableta · 12»
   (pedido 2026-10-29). */
const DOSIS_COMUNES = ["125 mg", "250 mg", "400 mg", "500 mg", "600 mg", "750 mg", "875 mg", "1 g", "5 mg", "10 mg", "20 mg", "50 mg", "100 mg", "0,12 %", "2 %"];
const FRECUENCIAS = ["Cada 4 horas", "Cada 6 horas", "Cada 8 horas", "Cada 12 horas", "Cada 24 horas", "1 vez al día", "2 veces al día", "3 veces al día", "Dosis única", "Antes de dormir"];
const VIAS = ["Oral", "Tópica", "Inyectable", "Sublingual"];
const PRESENTACIONES = ["Tableta", "Cápsula", "Jarabe", "Suspensión", "Ampolla", "Gel", "Crema", "Enjuague bucal", "Gotas", "Sobre", "Otro"];

function filaDeMedicamento(item = {}) {
  const opciones = PRESENTACIONES.map((valor) => `<option value="${escapeHtml(valor)}"${valor === (item.presentacion || "Tableta") ? " selected" : ""}>${escapeHtml(valor)}</option>`).join("");
  return `<div class="rx-med-fila">
    <input data-rx="medicamento" value="${escapeHtml(item.medicamento || "")}" maxlength="80" placeholder="Medicamento" aria-label="Medicamento" autocomplete="off" />
    <select data-rx="dosis" aria-label="Dosis">
      <option value="">Dosis</option>
      ${DOSIS_COMUNES.map((valor) => `<option value="${escapeHtml(valor)}"${valor === item.dosis ? " selected" : ""}>${escapeHtml(valor)}</option>`).join("")}
      ${item.dosis && !DOSIS_COMUNES.includes(item.dosis) ? `<option value="${escapeHtml(item.dosis)}" selected>${escapeHtml(item.dosis)}</option>` : ""}
      <option value="__otra">Otra…</option>
    </select>
    <select data-rx="presentacion" aria-label="Presentación">${opciones}</select>
    <input data-rx="cantidad" value="${escapeHtml(item.cantidad || "")}" maxlength="10" inputmode="numeric" placeholder="Cant." aria-label="Cantidad" />
    <select data-rx="via" aria-label="Vía">${VIAS.map((valor) => `<option value="${escapeHtml(valor)}"${valor === (item.via || "Oral") ? " selected" : ""}>${escapeHtml(valor)}</option>`).join("")}</select>
    <select data-rx="frecuencia" aria-label="Frecuencia">
      <option value="">Frecuencia</option>
      ${FRECUENCIAS.map((valor) => `<option value="${escapeHtml(valor)}"${valor === item.frecuencia ? " selected" : ""}>${escapeHtml(valor)}</option>`).join("")}
      <option value="__otra">Otra…</option>
    </select>
    <input data-rx="dias" value="${escapeHtml(item.dias || "")}" maxlength="3" inputmode="numeric" placeholder="Días" aria-label="Duración en días" />
    <button class="rx-quitar" type="button" title="Quitar este medicamento" data-rx-quitar>×</button>
  </div>`;
}

/* Lo escrito en las filas, como lineas de texto: la hoja impresa y las
   recetas guardadas antes siguen leyendo el mismo campo. */
function medicamentosDeLasFilas(form) {
  return [...form.querySelectorAll(".rx-med-fila")].map((fila) => {
    const campo = (clave) => String(fila.querySelector(`[data-rx="${clave}"]`)?.value || "").trim();
    const nombre = campo("medicamento");
    if (!nombre) return "";
    const cantidad = campo("cantidad");
    const presentacion = campo("presentacion");
    const partes = [[nombre, campo("dosis")].filter(Boolean).join(" ")];
    if (presentacion) partes.push(presentacion);
    if (cantidad) partes.push(`${cantidad} ${Number(cantidad) === 1 ? "unidad" : "unidades"}`);
    const via = campo("via");
    if (via) partes.push(`vía ${via.toLowerCase()}`);
    const frecuencia = campo("frecuencia");
    if (frecuencia) partes.push(frecuencia.charAt(0).toLowerCase() + frecuencia.slice(1));
    const dias = campo("dias");
    if (dias) partes.push(`${dias} ${Number(dias) === 1 ? "día" : "días"}`);
    return partes.join(" · ");
  }).filter(Boolean).join("\n");
}

/* Las mismas filas, pero por partes: la hoja impresa las pone en una tabla
   con columnas (formato de la foto del 2026-10-29). */
function itemsDeLasFilas(form) {
  return [...form.querySelectorAll(".rx-med-fila")].map((fila) => {
    const campo = (clave) => String(fila.querySelector(`[data-rx="${clave}"]`)?.value || "").trim();
    const item = { medicamento: campo("medicamento"), dosis: campo("dosis"), presentacion: campo("presentacion"), cantidad: campo("cantidad"), via: campo("via"), frecuencia: campo("frecuencia"), dias: campo("dias") };
    return item.medicamento ? item : null;
  }).filter(Boolean);
}

const numeroDeReceta = (numero) => `REC-${String(numero || 0).padStart(4, "0")}`;

function recetasDelPaciente(patient) {
  return Array.isArray(patient?.recetas) ? patient.recetas : [];
}

// el folio sigue al ultimo de todo el consultorio, no al ultimo del paciente
function siguienteFolio() {
  const numeros = (state.patients || []).flatMap((patient) => recetasDelPaciente(patient).map((receta) => Number(receta.numero || 0)));
  return Math.max(0, ...numeros) + 1;
}

// quien firma: el usuario si es de los que atienden; si no, el doctor del paciente
function doctorPorDefecto(patient) {
  const usuario = currentUser();
  const doctores = (state.config.doctors || []).filter(Boolean);
  if (usuario?.name && doctores.includes(usuario.name)) return usuario.name;
  return nombreCompletoDelDoctor(patient.doctor) || doctores[0] || "";
}

function guardarEnElPaciente(patient) {
  savePatientApi(patient).catch((error) => uiAlert(error.message));
  if (!API_ENABLED) saveState();
}

const nombreDelCie = (codigo) => CIE10_ODONTOLOGICOS.find(([clave]) => clave === codigo)?.[1] || "";

/* Lo escrito en una caja, linea por linea. Cada linea sale con su guion,
   lo haya puesto el doctor o no: asi la hoja queda pareja. */
function lineas(texto) {
  return String(texto || "").split("\n").map((linea) => linea.trim()).filter(Boolean)
    .map((linea) => linea.replace(/^[-–•·*]+\s*/, ""));
}
const listaImpresa = (texto, clase = "") => {
  const items = lineas(texto);
  return items.length
    ? `<ul class="rx-lineas ${clase}">${items.map((linea) => `<li>${escapeHtml(linea)}</li>`).join("")}</ul>`
    : "";
};

// los codigos CIE-10 escritos en el campo, separados por coma o espacio
const codigosCie = (texto) => [...new Set(String(texto || "").toUpperCase().match(/\b[A-Z]\d{2}(?:\.\d{1,2})?\b/g) || [])];

/* Guarda lo escrito en el formulario como una receta mas del paciente.
   Devuelve la receta guardada, o null si falto algo. */
function guardarReceta(form) {
  if (!canManageClinical()) return null;
  const patient = patientById(form.dataset.paciente);
  if (!patient) return null;
  const datos = new FormData(form);
  const texto = (clave) => String(datos.get(clave) || "").replace(/\r/g, "").trim();
  if (!lineas(texto("diagnostico")).length) {
    uiAlert("Escribe el diagnóstico de la receta.");
    return null;
  }
  const medicamentos = medicamentosDeLasFilas(form);
  if (!lineas(medicamentos).length) {
    uiAlert("Escribe al menos un medicamento.");
    return null;
  }
  const receta = {
    id: uid("rx"),
    numero: siguienteFolio(),
    date: texto("fecha") || todayISO(),
    hora: new Date().toTimeString().slice(0, 5),
    doctor: doctorPorDefecto(patient),
    diagnostico: texto("diagnostico"),
    cie10: codigosCie(texto("cie10")).join(", "),
    tratamiento: texto("tratamiento"),
    peso: texto("peso"),
    medicamentos,
    items: itemsDeLasFilas(form),
    indicaciones: texto("indicaciones")
  };
  patient.recetas = [...recetasDelPaciente(patient), receta];
  guardarEnElPaciente(patient);
  return receta;
}

async function borrarReceta(patientId, recetaId) {
  const patient = patientById(patientId);
  if (!patient || !canManageClinical()) return false;
  const receta = recetasDelPaciente(patient).find((item) => item.id === recetaId);
  if (!receta) return false;
  if (!(await uiConfirm(`¿Borrar la receta ${numeroDeReceta(receta.numero)} de ${patient.name}?`))) return false;
  patient.recetas = recetasDelPaciente(patient).filter((item) => item.id !== recetaId);
  guardarEnElPaciente(patient);
  return true;
}

const colorDeLaHoja = (config) => (/^#[0-9a-f]{6}$/i.test(config.primaryColor || "") ? config.primaryColor : "#0b6e76");

/* La pestana: el formulario de la receta nueva arriba (solo para quien
   atiende) y, debajo, las recetas ya guardadas del paciente. */
function hojaDeRecetas(patientId) {
  const patient = patientById(patientId);
  if (!patient) return `<p class="muted">Elige un paciente para ver sus recetas.</p>`;
  const config = state.config || {};
  const sePuedeEscribir = canManageClinical();
  const edad = ageFromBirthDate(patient.birthDate);

  const formulario = sePuedeEscribir
    ? `<form class="rx-form" data-paciente="${patient.id}" autocomplete="off">
        <h4 class="rx-subtitulo">Nueva receta</h4>
        <!-- el doctor no se elige: firma quien esta usando el sistema si atiende, y si no, el doctor del paciente (pedido 2026-10-29) -->
        <div class="rx-campos rx-cabecera">
          <label>Fecha<input type="date" name="fecha" value="${todayISO()}" required /></label>
          <label>Peso (kg)<input name="peso" inputmode="decimal" placeholder="Ej: 60" /></label>
        </div>
        <label class="rx-caja-ancha">Diagnóstico (procedimiento actual) <small>una línea por diagnóstico</small><textarea name="diagnostico" rows="3" maxlength="600" placeholder="- Pulpitis en pieza 3.6&#10;- Caries de dentina en pieza 1.6" required></textarea></label>
        <!-- Tratamiento no va en el formulario (el usuario quiso dejarlo como estaba, 2026-10-29); en la hoja impresa el Tx. sale con un guion -->
        <!-- el CIE-10 se busca por nombre y el codigo elegido pasa al campo de la derecha (pedido 2026-10-29) -->
        <div class="rx-campos rx-cie">
          <label class="rx-buscador">Diagnóstico CIE-10 <small>escribe el nombre y elige de la lista</small><input name="cieBusqueda" maxlength="60" placeholder="Ej: caries, pulpitis, gingivitis" autocomplete="off" /><div class="rx-sugerencias" hidden></div></label>
          <label>Código CIE-10 <small>se llena al elegir; admite varios</small><input name="cie10" maxlength="60" placeholder="K02.1" /></label>
        </div>
        <!-- medicamentos y receta, cada uno en un rectangulo a todo el ancho, uno debajo del otro (pedido 2026-10-29) -->
        <div class="rx-cajas rx-cajas-largas">
          <div class="rx-meds">
            <span class="rx-meds-titulo">Medicamentos <small>escribe el nombre, a la derecha la dosis, la presentación y la cantidad, y con Enter pasas a la siguiente línea</small></span>
            <div class="rx-med-cuadro">
              <div class="rx-med-cabecera"><span>Medicamento</span><span>Dosis</span><span>Presentación</span><span>Cant.</span><span>Vía</span><span>Frecuencia</span><span>Días</span><span></span></div>
              <div class="rx-med-filas">${filaDeMedicamento()}</div>
            </div>
          </div>
          <label>Indicaciones <small>cómo tomar cada uno y las recomendaciones</small><textarea name="indicaciones" rows="4" maxlength="1500" placeholder="- Amoxicilina: 1 tableta vía oral cada 8 horas por 4 días&#10;- Ibuprofeno: 1 tableta cada 8 horas por 3 días, después de los alimentos&#10;- No mezclar con alcohol"></textarea></label>
        </div>
        <p class="fd-acciones rx-botones">
          <button class="ghost" type="submit" data-rx-imprimir>Guardar e imprimir</button>
          <button class="primary" type="submit">Guardar receta</button>
        </p>
      </form>`
    : "";

  const guardadas = [...recetasDelPaciente(patient)].sort((a, b) => `${b.date || ""} ${b.hora || ""}`.localeCompare(`${a.date || ""} ${a.hora || ""}`));
  const lista = guardadas.length
    ? `<table class="rx-lista">
        <thead><tr><th>Folio</th><th>Fecha</th><th>Doctor</th><th>Diagnóstico</th><th>Medicamentos</th><th></th></tr></thead>
        <tbody>${guardadas.map((receta) => `<tr>
          <td><strong>${escapeHtml(numeroDeReceta(receta.numero))}</strong></td>
          <td>${window.HojasExtra.fecha(receta.date)}</td>
          <td>${escapeHtml(receta.doctor || "")}</td>
          <td>${lineas(receta.diagnostico).map(escapeHtml).join("<br>")}${receta.cie10 ? ` <small>(${escapeHtml(receta.cie10)})</small>` : ""}</td>
          <td>${lineas(receta.medicamentos).map(escapeHtml).join("<br>")}</td>
          <td class="rx-acciones">
            <button class="ghost small-btn" type="button" data-imprimir-receta="${escapeHtml(receta.id)}" data-paciente="${patient.id}">Imprimir</button>
            ${sePuedeEscribir ? `<button class="rx-quitar" type="button" title="Borrar esta receta" data-borrar-receta="${escapeHtml(receta.id)}" data-paciente="${patient.id}">×</button>` : ""}
          </td>
        </tr>`).join("")}</tbody>
      </table>`
    : `<p class="muted">${escapeHtml(patient.name)} todavía no tiene recetas guardadas.</p>`;

  return `<article class="hc-hoja fd rx" style="--fd-color: ${colorDeLaHoja(config)}">
    <header class="fd-cabecera">
      ${window.HojasExtra.membrete(config)}
      <h3 class="fd-titulo">Receta médica</h3>
      <span></span>
    </header>
    <div class="ev-paciente">
      <p class="fd-dato"><span>Paciente:</span><b>${escapeHtml(patient.name)}</b></p>
      <p class="fd-dato"><span>Edad:</span><b>${edad !== null ? `${edad} años` : "—"}</b></p>
    </div>
    ${formulario}
    <h4 class="rx-subtitulo">Recetas guardadas</h4>
    ${lista}
  </article>`;
}

/* La receta como sale en el papel. Una hoja con mas presencia que la del
   sistema anterior: banda de color con el titulo, el folio y la fecha; el
   membrete y el doctor arriba; los datos del paciente en una tira; el
   diagnostico con su CIE-10 y el tratamiento; el Rp. con los medicamentos;
   la receta (como tomarlos); y la firma con el COP. */
/* Los medicamentos en tabla, con una columna por dato, como en la hoja
   que mando el usuario. Las recetas guardadas antes de las filas no tienen
   partes: esas salen como lista. */
function tablaDeMedicamentos(receta) {
  const items = Array.isArray(receta.items) ? receta.items.filter((item) => item?.medicamento) : [];
  if (!items.length) {
    return `<div class="rx-bloque-titulo"><h4><span class="rx-simbolo">Rp.</span> Medicamentos</h4></div>${listaImpresa(receta.medicamentos, "rx-medicamentos")}`;
  }
  const celda = (valor) => `<td>${escapeHtml(valor || "—")}</td>`;
  return `<table class="rx-tabla-meds">
    <thead><tr><th>Medicamento</th><th>Presentación</th><th>Dosis</th><th>Vía</th><th>Frecuencia</th><th>Días</th><th>Cant.</th></tr></thead>
    <tbody>${items.map((item) => `<tr>
      <td class="rx-med-nombre">${escapeHtml(item.medicamento)}</td>
      ${celda(item.presentacion)}${celda(item.dosis)}${celda(item.via)}${celda(item.frecuencia)}${celda(item.dias)}${celda(item.cantidad)}
    </tr>`).join("")}</tbody>
  </table>`;
}

function recetaImpresa(patient, receta) {
  const config = state.config || {};
  const edad = ageFromBirthDate(patient.birthDate, receta.date);
  const usuario = usuarioDelDoctor(receta.doctor);
  const doctor = nombreCompletoDelDoctor(receta.doctor);
  const sexo = patient.sexo === "F" ? "Femenino" : patient.sexo === "M" ? "Masculino" : "—";
  const cies = codigosCie(receta.cie10);
  const contacto = [config.issuerAddress, config.issuerDistrict].filter(Boolean).join(" · ");
  const telefono = config.whatsapp ? `Cel. ${config.whatsapp}` : "";
  const dato = (etiqueta, valor) => `<div class="rx-celda"><span>${etiqueta}</span><b>${valor}</b></div>`;
  return `<article class="hc-hoja fd rx-impresa" style="--fd-color: ${colorDeLaHoja(config)}">
    ${config.logoDataUrl ? `<img class="rx-marca-agua" src="${escapeHtml(config.logoDataUrl)}" alt="" />` : ""}
    <header class="rx-membrete">
      ${window.HojasExtra.membrete(config)}
      <!-- el doctor ya no va en la cabecera (pedido 2026-10-29): queda solo en la firma -->
    </header>
    <div class="rx-banda">
      <h3>Receta médica</h3>
      <div class="rx-folio">
        <span>Folio <b>${escapeHtml(numeroDeReceta(receta.numero))}</b></span>
        <span>Fecha <b>${window.HojasExtra.fecha(receta.date)}</b></span>
      </div>
    </div>
    <div class="rx-tira">
      ${dato("Paciente", escapeHtml(patient.name))}
      ${dato("Edad", edad !== null ? `${edad} años` : "—")}
      ${dato("Sexo", sexo)}
      ${dato("Peso", receta.peso ? `${escapeHtml(receta.peso)} kg` : "—")}
    </div>
    <div class="rx-tira rx-tira-dos">
      ${dato("Alergias", escapeHtml(patient.allergies || "Negadas"))}
      ${dato("Medicación actual", escapeHtml(patient.medications || "Ninguna"))}
    </div>
    <div class="rx-dos-bloques">
      <section class="rx-bloque">
        <div class="rx-bloque-titulo"><h4>Dx. Diagnóstico</h4></div>
        ${listaImpresa(receta.diagnostico)}
        ${cies.length ? `<p class="rx-cie">CIE-10: ${cies.map((codigo) => `<b>${escapeHtml(codigo)}</b>${nombreDelCie(codigo) ? ` ${escapeHtml(nombreDelCie(codigo))}` : ""}`).join(" · ")}</p>` : ""}
      </section>
      <section class="rx-bloque">
        <div class="rx-bloque-titulo"><h4>Tx. Tratamiento</h4></div>
        ${listaImpresa(receta.tratamiento) || `<p class="rx-vacio">—</p>`}
      </section>
    </div>
    <section class="rx-bloque rx-rp">
      ${tablaDeMedicamentos(receta)}
    </section>
    ${lineas(receta.indicaciones).length ? `<section class="rx-bloque">
      <div class="rx-bloque-titulo"><h4>Indicaciones</h4></div>
      ${listaImpresa(receta.indicaciones)}
    </section>` : ""}
    <footer class="rx-pie">
      <div class="rx-firma">
        <span class="rx-linea"></span>
        <strong>${escapeHtml(doctor)}</strong>
        ${usuario?.cop ? `<span>CCDP ${escapeHtml(usuario.cop)}</span>` : ""}
      </div>
      <p class="rx-pie-clinica">${escapeHtml([config.clinicName, contacto, telefono].filter(Boolean).join(" · "))}</p>
    </footer>
  </article>`;
}

function imprimirReceta(patientId, recetaId) {
  const patient = patientById(patientId);
  const receta = recetasDelPaciente(patient).find((item) => item.id === recetaId);
  if (!patient || !receta) return;
  const ventana = window.open("", "_blank", "width=900,height=1100");
  if (!ventana) {
    uiAlert("El navegador bloqueó la ventana de impresión. Permite las ventanas emergentes de esta página.");
    return;
  }
  const hojasDeEstilo = [...document.querySelectorAll('link[rel="stylesheet"][href]')]
    .map((link) => `<link rel="stylesheet" href="${escapeHtml(link.href)}">`)
    .join("");
  ventana.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8">
    <base href="${escapeHtml(location.href)}">
    <title>Receta ${escapeHtml(numeroDeReceta(receta.numero))} ${escapeHtml(patient.name)}</title>
    ${hojasDeEstilo}
    <style>
      @page { size: A4; margin: 0; }
      html, body { background: #fff !important; }
      body { display: block !important; min-height: 0 !important; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .hc-hoja.fd { border: 0 !important; border-radius: 0 !important; box-shadow: none !important; padding: 12mm 15mm !important; max-width: 210mm; min-height: 297mm; box-sizing: border-box; margin: 0 auto; }
    </style></head><body>
    ${recetaImpresa(patient, receta)}
    <script>window.addEventListener("load", function () { setTimeout(function () { window.print(); }, 350); });<\/script>
    </body></html>`);
  ventana.document.close();
}

window.Recetas = { CIE10_ODONTOLOGICOS, sugerenciasCie, DOSIS_COMUNES, FRECUENCIAS, VIAS, PRESENTACIONES, filaDeMedicamento, medicamentosDeLasFilas, itemsDeLasFilas, numeroDeReceta, lineas, tieneReceta, guardarReceta, borrarReceta, hojaDeRecetas, recetaImpresa, imprimirReceta };
})();
