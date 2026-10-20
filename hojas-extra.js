/* Hojas extra del paciente en CM: Ficha de datos (con foto), Ficha
   estomatologica, Hoja de evolucion y el presupuesto impreso. Son las mismas
   del dental de EmpresaFacil (las pidio Smart Medic y se pasaron a CM), sin
   la constancia de pago. No reemplazan ninguna hoja: se suman a la historia.
   Va en su propio archivo, envuelto, para que sus nombres no choquen con los
   de app.js; usa de app.js state, patientById, apiFetch y demas. */
(function () {
/* ---------- Foto del paciente ----------
   No viaja con el resto de los datos: va en su propia tabla del servidor y se
   descarga solo al abrir o imprimir la ficha; despues queda en memoria
   mientras la pagina siga abierta. Se guarda chica -240 x 320, JPEG-. */
const fotos = new Map();
const FOTO_ANCHO = 240;
const FOTO_ALTO = 320;

function conServidor() {
  return Boolean(API_ENABLED && apiToken);
}

function llaveLocal(patientId) {
  return `${STORAGE_KEY}-foto-${patientId}`;
}

function fotoEnMemoria(patientId) {
  return fotos.get(patientId);
}

async function cargarFoto(patientId) {
  if (!patientId) return "";
  if (fotos.has(patientId)) return fotos.get(patientId);
  let foto = "";
  if (conServidor()) {
    try {
      foto = (await apiFetch(`/api/patient-photo?id=${encodeURIComponent(patientId)}`))?.foto || "";
    } catch (error) {
      console.warn("No se pudo traer la foto del paciente.", error);
    }
  } else {
    try { foto = localStorage.getItem(llaveLocal(patientId)) || ""; } catch {}
  }
  fotos.set(patientId, foto);
  return foto;
}

function achicarFoto(archivo) {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.onerror = () => reject(new Error("No se pudo leer la foto."));
    lector.onload = () => achicarImagen(lector.result).then(resolve, reject);
    lector.readAsDataURL(archivo);
  });
}

function achicarImagen(origen) {
  return new Promise((resolve, reject) => {
    const imagen = new Image();
    imagen.onerror = () => reject(new Error("El archivo no es una foto que se pueda abrir."));
    imagen.onload = () => {
      const escala = Math.max(FOTO_ANCHO / imagen.width, FOTO_ALTO / imagen.height);
      const ancho = imagen.width * escala;
      const alto = imagen.height * escala;
      const lienzo = document.createElement("canvas");
      lienzo.width = FOTO_ANCHO;
      lienzo.height = FOTO_ALTO;
      const pincel = lienzo.getContext("2d");
      pincel.fillStyle = "#fff";
      pincel.fillRect(0, 0, FOTO_ANCHO, FOTO_ALTO);
      pincel.drawImage(imagen, (FOTO_ANCHO - ancho) / 2, (FOTO_ALTO - alto) / 2, ancho, alto);
      resolve(lienzo.toDataURL("image/jpeg", 0.72));
    };
    imagen.src = origen;
  });
}

async function guardarFoto(patientId, foto) {
  if (conServidor()) {
    await apiFetch("/api/patient-photo", {
      method: "POST",
      body: JSON.stringify(foto ? { id: patientId, foto } : { id: patientId, delete: true })
    });
  } else {
    try {
      if (foto) localStorage.setItem(llaveLocal(patientId), foto);
      else localStorage.removeItem(llaveLocal(patientId));
    } catch {
      throw new Error("No hay espacio en este equipo para guardar la foto.");
    }
  }
  fotos.set(patientId, foto);
}

async function ponerFoto(patientId, archivo) {
  if (!canManageClinical()) return;
  const foto = await achicarFoto(archivo);
  await guardarFoto(patientId, foto);
}

/* La foto que trajo la consulta del DNI (CODART la manda en "DNI Full"). Pasa
   por el mismo achicado que una foto de camara. */
async function ponerFotoDelDni(patientId, dataUri) {
  if (!patientId || !/^data:image\//.test(String(dataUri || ""))) return;
  await guardarFoto(patientId, await achicarImagen(dataUri));
}

async function quitarFoto(patientId) {
  if (!canManageClinical()) return;
  if (!(await uiConfirm("¿Quitar la foto de este paciente?"))) return;
  await guardarFoto(patientId, "");
}


/* ---------- Ficha de datos ---------- */

// las fechas como en el papel de siempre: 05-10-2026
const fecha = (iso) => {
  const [anio, mes, dia] = String(iso || "").slice(0, 10).split("-");
  return anio && mes && dia ? `${dia}-${mes}-${anio}` : "";
};

const raya = (valor) => valor
  ? `<b>${escapeHtml(valor)}</b>`
  : `<i class="fd-raya"></i>`;

// las preguntas ya terminan en "?": no se les agregan los dos puntos
const dato = (etiqueta, valor, clase = "") => `<p class="fd-dato ${clase}"><span>${etiqueta}${etiqueta.endsWith("?") ? "" : ":"}</span>${raya(valor)}</p>`;

const casilla = (marcada) => `<span class="fd-casilla">${marcada ? "X" : ""}</span>`;

/* Las respuestas SI/NO de la ficha viven en el paciente como
   "hepatitis=SI|diabetes=NO": son pocas y no merecen un campo cada una. */
function respuestasSiNo(patient) {
  return new Map(String(patient?.fdSiNo || "").split("|").filter(Boolean).map((par) => par.split("=")));
}

// un clic marca, otro sobre la misma la desmarca, y marcar la otra la cambia
function marcarSiNoDeLaFicha(patientId, pregunta, respuesta) {
  const patient = patientById(patientId);
  if (!patient || !canManageClinical() || !["SI", "NO"].includes(respuesta)) return null;
  const respuestas = respuestasSiNo(patient);
  if (respuestas.get(pregunta) === respuesta) respuestas.delete(pregunta);
  else respuestas.set(pregunta, respuesta);
  patient.fdSiNo = [...respuestas].map(([clave, valor]) => `${clave}=${valor}`).join("|");
  return patient;
}

function membrete(config) {
  const contacto = [config.issuerAddress, config.issuerDistrict].filter(Boolean).join(" · ");
  const telefono = config.whatsapp ? `Cel. ${config.whatsapp}` : "";
  const ruc = config.issuerRuc ? `RUC ${config.issuerRuc}` : "";
  return `<div class="fd-membrete">
      ${config.logoDataUrl ? `<img class="fd-logo" src="${escapeHtml(config.logoDataUrl)}" alt="" />` : ""}
      <div class="fd-clinica">
        <strong>${escapeHtml(config.clinicName || "Consultorio dental")}</strong>
        ${contacto ? `<span>${escapeHtml(contacto)}</span>` : ""}
        ${telefono || ruc ? `<span>${escapeHtml([telefono, ruc].filter(Boolean).join(" · "))}</span>` : ""}
      </div>
    </div>`;
}

/* El numero de historia como en el papel de siempre: el DNI y, al lado, el
   correlativo del consultorio. */
function numeroDeLaFicha(patient) {
  const correlativo = patient.historiaNumero ? numeroDeHistoria(patient.historiaNumero) : "";
  return [patient.dni, correlativo].filter(Boolean).join(" - ");
}

function fichaDeDatos(patientId, { pantalla = true, foto = null } = {}) {
  const patient = patientById(patientId);
  if (!patient) return `<p class="muted">Elige un paciente para ver su ficha de datos.</p>`;
  const config = state.config || {};
  const edad = patient.birthDate ? ageFromBirthDate(patient.birthDate) : null;
  const laFoto = foto ?? fotoEnMemoria(patientId);
  const puedeEditar = pantalla && canManageClinical();
  const firmaDeLaFicha = firmaVirtual({ imagen: patient.firmaFicha, fecha: patient.firmaFichaFecha, por: patient.firmaFichaPor, etiqueta: "Firma del paciente", pantalla: puedeEditar, destino: "paciente", id: patient.id, campo: "firmaFicha" });
  const sexo = patient.sexo === "F" ? "Femenino" : patient.sexo === "M" ? "Masculino" : "";
  const creada = patient.historiaDesde || String(patient.createdAt || "").slice(0, 10) || todayISO();
  const titular = patient.guardianName
    ? `${patient.guardianName}${patient.guardianDni ? ` (DNI ${patient.guardianDni})` : ""}`
    : "";

  const cajaDeFoto = `<div class="fd-foto${laFoto ? "" : " fd-foto-vacia"}" data-foto-de="${patient.id}">
      ${laFoto
        ? `<img src="${escapeHtml(laFoto)}" alt="Foto de ${escapeHtml(patient.name)}" />`
        : laFoto === undefined && pantalla ? `<span>Cargando…</span>` : `<span>Foto</span>`}
    </div>
    ${puedeEditar
      ? `<div class="fd-foto-botones">
          <label class="small-btn fd-foto-subir">${laFoto ? "Cambiar foto" : "Poner foto"}
            <input type="file" accept="image/*" capture="user" data-poner-foto="${patient.id}" hidden />
          </label>
          ${laFoto ? `<button class="small-btn" type="button" data-quitar-foto="${patient.id}">Quitar</button>` : ""}
        </div>`
      : ""}`;

  /* Lo que el sistema no sabe se escribe sobre la misma raya, en pantalla, con
     la misma letra que lo demas; se guarda en el paciente al salir del campo y
     ya sale impreso. Los datos que vienen del registro (DNI, fechas, sexo...)
     se corrigen en el registro, donde se validan. */
  const escribe = (etiqueta, campo, clase = "", valor = patient[campo]) => {
    if (!puedeEditar) return dato(etiqueta, valor, clase);
    const dosPuntos = etiqueta.endsWith("?") ? "" : ":";
    return `<p class="fd-dato ${clase}"><span>${etiqueta}${dosPuntos}</span><b class="hcf-escribible fd-escribible" contenteditable="plaintext-only" role="textbox" tabindex="0" data-destino="paciente" data-campo="${campo}" data-registro="${escapeHtml(patient.id)}">${escapeHtml(String(valor || "").trim())}</b></p>`;
  };
  const respuestas = respuestasSiNo(patient);
  const opcion = (clave, respuesta) => {
    const marcada = respuestas.get(clave) === respuesta;
    if (!puedeEditar) return casilla(marcada);
    return `<span class="fd-casilla es-clic" role="checkbox" tabindex="0" aria-checked="${marcada}" data-fd-sino="${clave}" data-fd-respuesta="${respuesta}" data-paciente="${escapeHtml(patient.id)}">${marcada ? "X" : ""}</span>`;
  };
  const siNo = (clave, pregunta) => `<p class="fd-sino"><span>${pregunta}</span><span class="fd-sino-opciones">SI ${opcion(clave, "SI")} NO ${opcion(clave, "NO")}</span></p>`;
  // el distrito es la primera parte de la procedencia ("MOYOBAMBA, SAN MARTIN"), si no se escribio otro
  const distrito = patient.district || String(patient.origin || "").split(",")[0].trim();

  // el color del consultorio va en la hoja misma: la ventana de impresion no lo hereda
  const color = /^#[0-9a-f]{6}$/i.test(config.primaryColor || "") ? config.primaryColor : "#00a6d6";
  return `<article class="hc-hoja fd" style="--fd-color: ${color}">
    <header class="fd-cabecera">
      ${membrete(config)}
      <h3 class="fd-titulo">Ficha de datos</h3>
      <span></span>
    </header>

    <section class="fd-identidad">
      <div class="fd-foto-columna">${cajaDeFoto}</div>
      <div class="fd-numeros">
        ${dato("N.° Hist. clínica", numeroDeLaFicha(patient), "fd-grande")}
        ${dato("Fecha de creación", fecha(creada), "fd-grande")}
      </div>
    </section>

    <section class="fd-bloque">
      ${dato("Nombres y apellidos", patient.name, "fd-ancho")}
      <div class="fd-dos">
        ${dato("DNI", patient.dni)}
        ${dato("Edad", edad === null ? "" : `${edad} años`)}
      </div>
      <div class="fd-dos">
        ${dato("Fecha de nacimiento", patient.birthDate ? fecha(patient.birthDate) : "")}
        ${dato("Sexo", sexo)}
      </div>
      <div class="fd-dos">
        ${dato("Estado civil", patient.maritalStatus)}
        ${escribe("Ocupación", "occupation")}
      </div>
      <div class="fd-dos">
        ${dato("Titular / apoderado", titular)}
        ${escribe("Parentesco", "guardianRelation")}
      </div>
      ${escribe("Lugar de procedencia", "origin", "fd-ancho", patient.origin || patient.birthPlace)}
      ${escribe("Dirección", "address", "fd-ancho")}
      <div class="fd-dos">
        ${escribe("Distrito", "district", "", distrito)}
        ${dato("Celular", patient.phone)}
      </div>
      <div class="fd-dos">
        ${escribe("Correo", "email")}
        ${escribe("¿Cómo nos conoció?", "fdComoNosConocio")}
      </div>
      ${escribe("Observación", "notes", "fd-ancho")}
      ${dato("Médico tratante", nombreCompletoDelDoctor(patient.doctor), "fd-ancho")}
      ${escribe("Dentista que lo atendió antes y tratamientos realizados", "fdDentistaAnterior", "fd-pregunta")}
    </section>

    <h4 class="fd-seccion">Para casos de emergencia</h4>
    <section class="fd-bloque">
      <div class="fd-dos">
        ${escribe("Médico de confianza", "fdMedicoConfianza")}
        ${escribe("Servicio de ambulancia", "fdAmbulancia")}
      </div>
      ${escribe("En caso de emergencia comunicarse con", "emergencyContact", "fd-ancho")}
    </section>

    <h4 class="fd-seccion fd-centro">Anamnesis</h4>
    <h5 class="fd-subseccion">Antecedentes médicos</h5>
    <section class="fd-bloque">
      ${escribe("Alérgico a", "allergies", "fd-ancho")}
      ${escribe("Está tomando algún medicamento", "medications", "fd-ancho")}
      ${escribe("Nombre de su médico", "fdNombreMedico", "fd-ancho")}
      ${siNo("hepatitis", "¿Ha padecido hepatitis?")}
      ${siNo("diabetes", "¿Sufre de diabetes?")}
      ${siNo("presion", "¿Sufre de presión alta o del corazón?")}
      ${escribe("¿Sufre de alguna enfermedad que ponga en riesgo su vida o que debamos conocer?", "personalHistory", "fd-pregunta")}
    </section>

    <h5 class="fd-subseccion">Antecedentes odontológicos</h5>
    <section class="fd-bloque">
      <div class="fd-dos">
        ${escribe("Frecuencia con que visita al dentista", "fdFrecuencia")}
        ${escribe("Experiencia dental traumática", "fdTraumatica")}
      </div>
      <div class="fd-dos">
        ${escribe("¿Le han extraído muelas?", "fdExtracciones")}
        ${escribe("¿Complicación con la anestesia?", "fdAnestesia")}
      </div>
      <div class="fd-dos">
        ${escribe("¿Le sangran las encías?", "fdSangrado")}
        ${escribe("Fecha de la última profilaxis", "fdProfilaxis")}
      </div>
      <div class="fd-dos">
        ${escribe("Fecha de la última atención", "fdUltimaAtencion")}
        ${escribe("¿Siente chasquidos al masticar o abrir la boca?", "fdChasquidos")}
      </div>
      ${siNo("estetica", "¿Está satisfecho con su estética dental?")}
    </section>

    <footer class="fd-pie">
      <div class="fd-firma">${firmaDeLaFicha.dibujo}<i></i><span>Firma del paciente / tutor</span>${firmaDeLaFicha.dato}${firmaDeLaFicha.boton}</div>
    </footer>
    ${pantalla ? `<p class="fd-acciones"><button class="ghost" type="button" data-imprimir-ficha="${patient.id}">Imprimir ficha de datos</button></p>` : ""}
  </article>`;
}

/* La foto llega despues de pintar la hoja: se busca solo cuando la ficha esta a
   la vista, y al llegar se vuelve a pintar esa ficha. */
function traerFotoDeLaFicha(patientId, repintar) {
  if (!patientId || fotos.has(patientId)) return;
  cargarFoto(patientId).then(() => {
    if (historySheetTab === "ficha") repintar();
  });
}

async function imprimirFichaDeDatos(patientId) {
  const patient = patientById(patientId);
  if (!patient) return;
  // la ventana se abre antes de cualquier espera: despues el navegador la bloquea
  const ventana = window.open("", "_blank", "width=900,height=1100");
  if (!ventana) {
    uiAlert("El navegador bloqueó la ventana de impresión. Permite las ventanas emergentes de esta página.");
    return;
  }
  const foto = await cargarFoto(patientId);
  const hojasDeEstilo = [...document.querySelectorAll('link[rel="stylesheet"][href]')]
    .map((link) => `<link rel="stylesheet" href="${escapeHtml(link.href)}">`)
    .join("");
  ventana.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8">
    <base href="${escapeHtml(location.href)}">
    <title>Ficha de datos ${escapeHtml(patient.name)}</title>
    ${hojasDeEstilo}
    <style>
      @page { size: A4; margin: 0; }
      html, body { background: #fff !important; }
      body { display: block !important; min-height: 0 !important; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .hc-hoja.fd { border: 0 !important; border-radius: 0 !important; box-shadow: none !important; padding: 7mm 11mm !important; max-width: 210mm; margin: 0 auto; line-height: 1.28; }
      /* Una sola hoja: la ficha medía unos 1220 px y el A4 tiene 1123, así que
         la firma se iba sola a una segunda página (Arte Dental, 2026-10-20).
         Se aprietan los renglones y el aire de la firma solo en el papel. */
      .fd-dato, .fd-sino { min-height: 18px; }
      .fd-identidad { margin: 8px 0 6px; }
      .fd-seccion { margin: 8px 0 4px; }
      .fd-subseccion { margin: 6px 0 3px; }
      .fd-pie { margin-top: 44px; break-inside: avoid; }
      .fd-pie:has(img) { margin-top: 6px; }
    </style></head><body>
    ${fichaDeDatos(patientId, { pantalla: false, foto })}
    <script>
      /* Si con todo eso la ficha aún no cabe -respuestas largas-, se encoge lo
         justo para que entre entera en el A4 y la firma no quede sola. */
      window.addEventListener("load", function () {
        var hoja = document.querySelector(".hc-hoja.fd");
        var alto = hoja ? hoja.getBoundingClientRect().height : 0;
        var maximo = 1110;
        if (alto > maximo) hoja.style.zoom = (maximo / alto).toFixed(3);
        setTimeout(function () { window.print(); }, 350);
      });
    <\/script>
    </body></html>`);
  ventana.document.close();
}


/* ---------- Hoja de evolucion ----------
   Lo que la doctora anota cada vez que el paciente se va: una fila por
   atencion, en orden, con lo que escribio y quien atendio. Sin montos: es el
   registro clinico, no el de caja. Al final quedan filas en blanco para seguir
   escribiendo a mano en el papel, como en la hoja de siempre. */
const FILAS_MINIMAS = 20;

// los codigos CIE-10 que la doctora haya escrito en el diagnostico, p. ej. K02.1
function codigosCie(nota) {
  const texto = [nota.finalDiagnosis, nota.diagnosis].filter(Boolean).join(" ");
  const codigos = texto.toUpperCase().match(/\b[A-Z]\d{2}(?:\.\d{1,2})?\b/g) || [];
  return [...new Set(codigos)].join(", ");
}

function atencionesDelPaciente(patientId) {
  return state.clinicalHistory
    .filter((nota) => nota.patientId === patientId && !esSoloDeuda(nota))
    .filter((nota) => String(nota.reason || "").trim() || String(nota.procedure || "").trim())
    .sort((a, b) => `${a.date || ""} ${a.hora || ""}`.localeCompare(`${b.date || ""} ${b.hora || ""}`));
}

/* Lo que se escribe directo en la hoja, sin nota clinica detras: la doctora
   anota la atencion en la fila nueva y queda guardada en el paciente
   (patient.evolucion), con su fecha, su hora y quien atendio. No es una nota:
   no toca la caja, ni el historial de pagos, ni la historia clinica. */
function filasEscritas(patient) {
  return Array.isArray(patient.evolucion) ? patient.evolucion : [];
}

// quien atendio: el usuario que escribe si es de los que atienden; si no, el del paciente
function doctorPorDefecto(patient) {
  const usuario = currentUser();
  const doctores = (state.config.doctors || []).filter(Boolean);
  if (usuario?.name && doctores.includes(usuario.name)) return usuario.name;
  return nombreCompletoDelDoctor(patient.doctor) || doctores[0] || "";
}

function guardarEvolucion(patient) {
  savePatientApi(patient).catch((error) => uiAlert(error.message));
  if (!API_ENABLED) saveState();
}

/* Al salir de una celda. La fila nueva se vuelve fila de verdad cuando tiene
   procedimiento escrito; las ya guardadas se corrigen en su sitio. */
function guardarCeldaDeEvolucion(celda) {
  if (!canManageClinical()) return false;
  const patient = patientById(celda.dataset.paciente);
  if (!patient) return false;
  const valor = String(celda.innerText || "").replace(/ /g, " ").trim();
  if (celda.dataset.evNueva) {
    const fila = celda.closest("tr");
    const texto = String(fila.querySelector('[data-ev-nueva="texto"]')?.innerText || "").trim();
    if (!texto) return false;
    patient.evolucion = [...filasEscritas(patient), {
      id: uid("ev"),
      date: fila.querySelector('[data-ev-nueva="fecha"]')?.value || todayISO(),
      hora: new Date().toTimeString().slice(0, 5),
      texto,
      cie10: String(fila.querySelector('[data-ev-nueva="cie10"]')?.innerText || "").trim().toUpperCase(),
      doctor: fila.querySelector('[data-ev-nueva="doctor"]')?.value || doctorPorDefecto(patient)
    }];
    guardarEvolucion(patient);
    return true;
  }
  const fila = filasEscritas(patient).find((item) => item.id === celda.dataset.evFila);
  const campo = celda.dataset.evCampo;
  if (!fila || !["texto", "cie10"].includes(campo)) return false;
  const nuevo = campo === "cie10" ? valor.toUpperCase() : valor;
  if (String(fila[campo] || "") === nuevo) return false;
  fila[campo] = nuevo;
  guardarEvolucion(patient);
  return true;
}

function cambiarDoctorDeEvolucion(lista) {
  if (!canManageClinical()) return false;
  const patient = patientById(lista.dataset.paciente);
  if (!patient) return false;
  if (lista.dataset.evNueva) return false; // la fila nueva lo lee al guardarse
  const nota = lista.dataset.evNota ? state.clinicalHistory.find((item) => item.id === lista.dataset.evNota) : null;
  if (nota) {
    // en una fila que viene de una nota, el doctor es el "atendido por" de la nota
    nota.attendedBy = lista.value;
    saveClinicalHistoryApi({ ...nota, appointmentId: "" }).catch((error) => uiAlert(error.message));
    if (!API_ENABLED) saveState();
    return true;
  }
  const fila = filasEscritas(patient).find((item) => item.id === lista.dataset.evFila);
  if (!fila) return false;
  fila.doctor = lista.value;
  guardarEvolucion(patient);
  return true;
}

async function borrarFilaDeEvolucion(patientId, filaId) {
  const patient = patientById(patientId);
  if (!patient || !canManageClinical()) return false;
  if (!(await uiConfirm("¿Borrar esta fila de la hoja de evolución?"))) return false;
  patient.evolucion = filasEscritas(patient).filter((item) => item.id !== filaId);
  guardarEvolucion(patient);
  return true;
}

function hojaDeEvolucion(patientId, { pantalla = true } = {}) {
  const patient = patientById(patientId);
  if (!patient) return `<p class="muted">Elige un paciente para ver su hoja de evolución.</p>`;
  const config = state.config || {};
  const color = /^#[0-9a-f]{6}$/i.test(config.primaryColor || "") ? config.primaryColor : "#00a6d6";
  const sePuedeEscribir = pantalla && canManageClinical();
  const doctores = (config.doctors || []).filter(Boolean);

  /* Las filas salen de dos lados, en orden de fecha: las notas clinicas
     guardadas y lo escrito directo en la hoja. En las de las notas el
     procedimiento y el CIE-10 van en campos propios -evolucion y cie10- para
     no tocar el motivo ni el procedimiento de la nota. */
  const deNotas = atencionesDelPaciente(patientId).map((nota) => ({
    tipo: "nota",
    id: nota.id,
    date: nota.date,
    hora: nota.hora || "",
    texto: "evolucion" in nota
      ? String(nota.evolucion || "")
      : [nota.reason, nota.procedure]
        .map((valor) => String(valor || "").trim())
        .filter(Boolean)
        .filter((valor, i, lista) => lista.indexOf(valor) === i)
        .join("\n"),
    cie10: "cie10" in nota ? String(nota.cie10 || "") : codigosCie(nota),
    doctor: nombreCompletoDelDoctor(nota.attendedBy) || nombreCompletoDelDoctor(patient.doctor)
  }));
  const escritas = filasEscritas(patient).map((fila) => ({ tipo: "mano", ...fila }));
  const todas = [...deNotas, ...escritas]
    .sort((a, b) => `${a.date || ""} ${a.hora || ""}`.localeCompare(`${b.date || ""} ${b.hora || ""}`));

  const celdaEditable = (fila, campo, varias) => {
    if (!sePuedeEscribir) return "";
    const comun = ` contenteditable="plaintext-only" role="textbox" tabindex="0" class="hcf-escribible${varias ? " hcf-caja" : ""}"`;
    return fila.tipo === "nota"
      ? `${comun} data-destino="nota" data-campo="${campo === "texto" ? "evolucion" : "cie10"}" data-registro="${escapeHtml(fila.id)}"`
      : `${comun} data-ev-fila="${escapeHtml(fila.id)}" data-ev-campo="${campo}" data-paciente="${patient.id}"`;
  };
  const elegirDoctor = (actual, atributos) => `<select class="ev-doctor" ${atributos}>
      ${(doctores.includes(actual) || !actual ? doctores : [actual, ...doctores])
        .map((nombre) => `<option value="${escapeHtml(nombre)}"${nombre === actual ? " selected" : ""}>${escapeHtml(nombre)}</option>`).join("")}
    </select>`;
  /* Sin la imagen del sello ni la firma dibujada: en cada fila hacian la
     hoja el doble de alta (Aurea, 2026-10-20). Queda el doctor y su COP. */
  const firma = (doctor, selector = "") => {
    const usuario = usuarioDelDoctor(doctor);
    return `${selector || (doctor ? `<span>${escapeHtml(doctor)}</span>` : "")}
      ${usuario?.cop ? `<span>COP ${escapeHtml(usuario.cop)}</span>` : ""}`;
  };

  const filas = todas.map((fila) => `<tr>
      <td class="ev-fecha"><strong>${fecha(fila.date)}</strong>${fila.hora ? `<span>${escapeHtml(fila.hora)}</span>` : ""}</td>
      <td class="ev-detalle"><div${celdaEditable(fila, "texto", true)}>${escapeHtml(fila.texto)}</div></td>
      <td class="ev-cie"><div${celdaEditable(fila, "cie10", false)}>${escapeHtml(fila.cie10)}</div></td>
      <td class="ev-asist"></td>
      <td class="ev-firma">${firma(fila.doctor, sePuedeEscribir && doctores.length
        ? elegirDoctor(fila.doctor, `${fila.tipo === "nota" ? `data-ev-nota="${escapeHtml(fila.id)}"` : `data-ev-fila="${escapeHtml(fila.id)}"`} data-paciente="${patient.id}" aria-label="Doctor que atendió"`)
        : "")}</td>
      <td class="ev-vb">${sePuedeEscribir && fila.tipo === "mano"
        ? `<button class="ev-borrar" type="button" title="Borrar esta fila" data-ev-borrar="${escapeHtml(fila.id)}" data-paciente="${patient.id}">×</button>`
        : ""}</td>
    </tr>`).join("");

  // la fila donde se escribe la atencion de hoy; en el papel no sale
  const nueva = sePuedeEscribir
    ? `<tr class="ev-nueva">
        <td class="ev-fecha"><input type="date" value="${todayISO()}" data-ev-nueva="fecha" aria-label="Fecha de la atención" /></td>
        <td class="ev-detalle"><div contenteditable="plaintext-only" role="textbox" tabindex="0" class="hcf-escribible hcf-caja" data-ev-nueva="texto" data-paciente="${patient.id}" data-pista="Escribe aquí la atención de hoy"></div></td>
        <td class="ev-cie"><div contenteditable="plaintext-only" role="textbox" tabindex="0" class="hcf-escribible" data-ev-nueva="cie10" data-paciente="${patient.id}"></div></td>
        <td class="ev-asist"></td>
        <td class="ev-firma">${doctores.length ? elegirDoctor(doctorPorDefecto(patient), `data-ev-nueva="doctor" data-paciente="${patient.id}" aria-label="Doctor que atendió"`) : ""}</td>
        <td class="ev-vb"></td>
      </tr>`
    : "";
  const vacias = Array.from({ length: Math.max(3, FILAS_MINIMAS - todas.length - (nueva ? 1 : 0)) }, () =>
    `<tr class="ev-vacia"><td></td><td></td><td></td><td></td><td></td><td></td></tr>`).join("");

  return `<article class="hc-hoja fd ev" style="--fd-color: ${color}">
    <header class="fd-cabecera">
      ${membrete(config)}
      <h3 class="fd-titulo">Hoja de evolución</h3>
      <span></span>
    </header>
    <div class="ev-paciente">
      ${dato("Nombres y apellidos", patient.name)}
      ${dato("N.° de historia clínica", numeroDeLaFicha(patient))}
    </div>
    <table class="ev-tabla">
      <colgroup>
        <col class="ev-c-fecha" /><col class="ev-c-detalle" /><col class="ev-c-cie" /><col class="ev-c-asist" /><col class="ev-c-firma" /><col class="ev-c-vb" />
      </colgroup>
      <thead><tr>
        <th>Fecha y hora</th>
        <th>Procedimiento o tratamiento<br><small>(Pza. / Superficie)</small></th>
        <th>CIE-10</th>
        <th>Asist. / Lab.</th>
        <th>Firma y sello del doctor</th>
        <th>V°B°</th>
      </tr></thead>
      <tbody>${filas}${nueva}${vacias}</tbody>
    </table>
    ${pantalla
      ? `<p class="fd-acciones">${sePuedeEscribir ? `<span class="muted">Escribe la atención en la fila que dice «Escribe aquí la atención de hoy»: se guarda al salir de la celda, con su fecha, su hora y el doctor elegido. Lo ya escrito se corrige igual.</span>` : ""}
          <button class="ghost" type="button" data-imprimir-evolucion="${patient.id}">Imprimir hoja de evolución</button></p>`
      : ""}
  </article>`;
}

function imprimirHojaDeEvolucion(patientId) {
  const patient = patientById(patientId);
  if (!patient) return;
  // en horizontal, con mas lugar para lo que se hizo (Smart Medic lo pidio el 2026-10-10 y paso a todos)
  const horizontal = true;
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
    <title>Hoja de evolución ${escapeHtml(patient.name)}</title>
    ${hojasDeEstilo}
    <style>
      @page { size: A4${horizontal ? " landscape" : ""}; margin: 0; }
      html, body { background: #fff !important; }
      body { display: block !important; min-height: 0 !important; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .hc-hoja.fd { border: 0 !important; border-radius: 0 !important; box-shadow: none !important; padding: 8mm 12mm !important; max-width: ${horizontal ? "297mm" : "210mm"}; margin: 0 auto; }
      .hc-hoja.fd.ev { max-width: ${horizontal ? "297mm" : "210mm"}; }
      ${horizontal ? `/* en horizontal el ancho que se gana va al procedimiento: fecha y firma mas angostas */
      .ev-c-fecha { width: 10% !important; }
      .ev-c-detalle { width: 57% !important; }
      .ev-c-cie { width: 8% !important; }
      .ev-c-asist { width: 8% !important; }
      .ev-c-firma { width: 12% !important; }
      .ev-c-vb { width: 5% !important; }` : ""}
      /* si son muchas atenciones la tabla sigue en otra hoja, con su cabecera */
      .ev-tabla thead { display: table-header-group; }
      .ev-tabla tr { break-inside: avoid; }
    </style></head><body>
    ${hojaDeEvolucion(patientId, { pantalla: false })}
    <script>
      /* Que entre en una sola hoja: se quitan filas en blanco del final hasta
         que la hoja quepa en el alto del papel. Lo escrito nunca se quita; si
         no cabe, sigue en la hoja siguiente con su cabecera. */
      function caberEnUnaHoja() {
        var medida = document.createElement("div");
        medida.style.cssText = "position:absolute;visibility:hidden;height:${horizontal ? "210mm" : "297mm"};width:1px";
        document.body.appendChild(medida);
        var alto = medida.getBoundingClientRect().height - 4;
        medida.remove();
        var hoja = document.querySelector(".hc-hoja");
        var vacias = document.querySelectorAll(".ev-vacia");
        for (var i = vacias.length - 1; i >= 0 && hoja.getBoundingClientRect().height > alto; i--) vacias[i].remove();
      }
      window.addEventListener("load", function () { caberEnUnaHoja(); setTimeout(function () { window.print(); }, 350); });
    <\/script>
    </body></html>`);
  ventana.document.close();
}


/* ---------- Presupuesto impreso ----------
   La proforma que ya se le dio al paciente, en el formato de sus papeles: el
   numero arriba al centro, los datos del paciente y del doctor, el odontograma,
   y la tabla con pieza, superficie, tratamiento, precio, descuento y total. Sale
   de una proforma guardada -no del presupuesto en pantalla- porque es la que
   tiene numero, fecha y los precios que se le dijeron. La proforma de siempre
   sigue imprimiendose igual: esto es una opcion mas. */

const soles = (valor) => Number(valor || 0).toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// la superficie viene dentro del texto de la linea del odontograma: "· 2 caras"
function superficieDeLaLinea(linea) {
  const caras = String(linea.detalle || "").match(/(\d+)\s+caras?/i);
  return caras ? `${caras[1]} ${Number(caras[1]) === 1 ? "cara" : "caras"}` : "";
}

function tratamientoDeLaLinea(linea) {
  // sin la superficie, que ya va en su columna
  return String(linea.detalle || linea.servicio || "")
    .replace(/\s*·\s*\d+\s+caras?/i, "")
    .trim();
}

/* El odontograma que le corresponde a esta proforma: el que se guardo con ella.

   Las dadas antes de que la proforma se llevara su copia no la tienen; para
   esas se busca una copia del odontograma guardada ese mismo dia, y si tampoco
   hay, se dibuja el de ahora, que es lo que se hacia siempre. */
function fichaDeLaProforma(proforma, patient) {
  if (proforma.ficha) {
    try {
      return window.Odontograma.normalizarFicha(JSON.parse(proforma.ficha));
    } catch (error) {
      console.warn("No se pudo leer el odontograma guardado con la proforma.", error);
    }
  }
  const copia = (state.odontogramSnapshots || [])
    .filter((item) => item.patientId === proforma.patientId && item.sheet === "inicial" && item.date === proforma.date)
    .sort((a, b) => String(b.savedAt || "").localeCompare(String(a.savedAt || "")))[0];
  if (copia?.ficha) {
    try {
      return window.Odontograma.normalizarFicha(JSON.parse(copia.ficha));
    } catch (error) {
      console.warn("No se pudo leer la copia del odontograma de ese día.", error);
    }
  }
  return odontogramFichaFor(patient.id, "inicial");
}


function presupuestoImpreso(proforma) {
  const patient = patientById(proforma.patientId);
  const config = state.config || {};
  const color = /^#[0-9a-f]{6}$/i.test(config.primaryColor || "") ? config.primaryColor : "#00a6d6";
  const descuento = Math.min(100, Math.max(0, Number(proforma.descuento || 0)));
  const filas = (proforma.lineas || []).map((linea) => {
    const cantidad = Math.max(1, Number(linea.cantidad || 1));
    const precio = Number(linea.precio || 0) * cantidad;
    const rebaja = Math.round(precio * descuento) / 100;
    return { linea, cantidad, precio, rebaja, total: precio - rebaja };
  });
  const suma = filas.reduce((total, fila) => ({
    precio: total.precio + fila.precio,
    rebaja: total.rebaja + fila.rebaja,
    total: total.total + fila.total
  }), { precio: 0, rebaja: 0, total: 0 });

  const dibujo = patient && window.Odontograma ? dibujoDelOdontograma(fichaDeLaProforma(proforma, patient)) : null;
  const firmante = usuarioDelDoctor(proforma.doctor);
  const telefono = config.whatsapp ? `Teléfono para sus consultas: ${config.whatsapp}` : "";

  return `<article class="hc-hoja fd pr" style="--fd-color: ${color}">
    <header class="fd-cabecera">
      ${membrete(config)}
      <h3 class="fd-titulo pr-numero">Presupuesto N.° ${escapeHtml(String(proforma.numero || "").padStart(4, "0"))}</h3>
      <span></span>
    </header>
    <section class="pr-datos">
      ${dato("Fecha", fecha(proforma.date))}
      ${dato("H.C. N.°", patient ? numeroDeLaFicha(patient) : "")}
      ${dato("Paciente", (patient?.name || proforma.patientName || "").toUpperCase())}
      ${dato("Doctor", (proforma.doctor || "").toUpperCase())}
      ${dato("Sede", config.issuerAddress || "")}
      ${dato("DNI", patient?.dni || "")}
    </section>
    ${dibujo
      ? `<h4 class="fd-seccion fd-centro">Odontograma</h4>
        <div class="hc-grafico pr-odontograma"><div class="odo-raiz hc-grafico-lienzo"><div class="odo-arco">${dibujo.html}</div></div></div>`
      : ""}
    <table class="pr-tabla">
      <thead><tr>
        <th>Pieza</th><th>Superficie</th><th class="pr-izq">Tratamientos</th>
        <th>Precio</th><th>Descuento</th><th>Total S/</th>
      </tr></thead>
      <tbody>${filas.map(({ linea, cantidad, precio, rebaja, total }) => `<tr>
        <td class="pr-centro"><strong>${escapeHtml(linea.pieza || "—")}</strong></td>
        <td class="pr-centro">${escapeHtml(superficieDeLaLinea(linea) || "—")}</td>
        <td>${escapeHtml(tratamientoDeLaLinea(linea).toUpperCase())}${cantidad > 1 ? ` <span class="pr-cantidad">× ${cantidad}</span>` : ""}</td>
        <td class="pr-num">${soles(precio)}</td>
        <td class="pr-num">${soles(rebaja)}</td>
        <td class="pr-num"><strong>${soles(total)}</strong></td>
      </tr>`).join("")}</tbody>
      <tfoot>
        <tr class="pr-subtotal">
          <td colspan="3">Total tratamientos</td>
          <td class="pr-num">${soles(suma.precio)}</td>
          <td class="pr-num">${soles(suma.rebaja)}</td>
          <td class="pr-num">${soles(suma.total)}</td>
        </tr>
        <tr class="pr-total">
          <td colspan="5">Total a cancelar</td>
          <td class="pr-num">S/ ${soles(suma.total)}</td>
        </tr>
      </tfoot>
    </table>
    ${descuento > 0 ? `<p class="pr-nota-descuento">Incluye un descuento del ${escapeHtml(String(descuento))} %.</p>` : ""}
    <footer class="pr-firmas">
      <div class="fd-firma">
        ${firmante?.sello ? `<img class="pr-sello" src="${escapeHtml(firmante.sello)}" alt="" />` : ""}
        ${proforma.firmaDoctor ? `<img class="firma-virtual-img" src="${escapeHtml(proforma.firmaDoctor)}" alt="" />` : ""}
        <i></i>
        <span>Firma del odontólogo tratante</span>
        ${proforma.doctor ? `<small>${escapeHtml(proforma.doctor)}${proforma.cop ? ` · COP ${escapeHtml(proforma.cop)}` : ""}</small>` : ""}
      </div>
      <div class="fd-firma">${proforma.firma ? `<img class="firma-virtual-img" src="${escapeHtml(proforma.firma)}" alt="" />` : ""}<i></i><span>Firma del paciente / apoderado</span></div>
    </footer>
    <section class="pr-notas">
      <p>* Después de la evaluación con otro especialista o servicio, el presupuesto podría incrementar o disminuir.</p>
      <p><strong>Nota:</strong></p>
      <ul>
        <li>Presupuesto válido por 30 días desde su fecha.</li>
        <li>Consulte por las facilidades de pago.</li>
      </ul>
      ${telefono ? `<p class="pr-telefono">${escapeHtml(telefono)}</p>` : ""}
    </section>
  </article>`;
}

function imprimirPresupuesto(proformaId, paraImagen = false) {
  const proforma = (state.proformas || []).find((item) => item.id === proformaId);
  if (!proforma) return;
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
    <title>Presupuesto ${escapeHtml(String(proforma.numero || ""))} ${escapeHtml(proforma.patientName || "")}</title>
    ${hojasDeEstilo}
    <style>
      @page { size: A4; margin: 0; }
      html, body { background: #fff !important; }
      body { display: block !important; min-height: 0 !important; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .hc-hoja.fd { border: 0 !important; border-radius: 0 !important; box-shadow: none !important; padding: 8mm 12mm !important; max-width: 210mm; margin: 0 auto; }
      .pr-tabla tr { break-inside: avoid; }
      /* la misma barra verde de la constancia de pago */
      .pr-acciones { max-width: 210mm; margin: 0 auto 6mm; padding: 0 12mm; text-align: right; }
      .pr-whatsapp { display: inline-block; padding: 8px 16px; border: 0; border-radius: 6px; background: #1fa855; color: #fff; font-family: Arial, sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; }
      .pr-whatsapp:disabled { opacity: 0.7; cursor: wait; }
      .pr-aviso { margin: 6px 0 0; font-family: Arial, sans-serif; font-size: 12px; color: #4b5563; }
      @media print { .pr-acciones { display: none; } }
    </style></head><body>
    ${presupuestoImpreso(proforma)}
    <div class="pr-acciones">
      <button class="pr-whatsapp" id="enviarWhatsapp" type="button" data-archivo="${escapeHtml(`Presupuesto ${numeroDeProforma(proforma.numero)} - ${String(proforma.patientName || "paciente").replace(/[\/:*?"<>|]/g, " ").trim()}`)}">Enviar imagen por WhatsApp</button>
      <p class="pr-aviso" id="avisoWhatsapp"></p>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"><\/script>
    <script>
      (function () {
        // el odontograma se encoge para caber en el ancho de la hoja
        function ajustar() {
          document.querySelectorAll(".hc-grafico").forEach(function (caja) {
            var lienzo = caja.firstElementChild;
            if (!lienzo || !caja.clientWidth) return;
            lienzo.style.zoom = "1";
            var ancho = lienzo.scrollWidth;
            var alto = lienzo.scrollHeight;
            var altoMax = Number(caja.dataset.altoMax || 0);
            var zoom = ancho ? Math.min(1, caja.clientWidth / ancho) : 1;
            if (altoMax && alto) zoom = Math.min(zoom, altoMax / alto);
            if (ancho) lienzo.style.zoom = String(zoom);
          });
        }
        /* Una sola hoja. Con pocos tratamientos la hoja entra sola y no se
           toca nada; con muchos -veinte piezas son veinte filas- se pasaba a
           una segunda hoja donde solo caian las ultimas lineas, las firmas y
           las notas, y el total salia repetido arriba y abajo. En vez de dejar
           las letras chicas para todos, se encoge solo cuando hace falta y lo
           justo para que quepa. El tope de 0.72 es para que un presupuesto
           enorme no termine ilegible: ese si se va a dos hojas. */
        function unaSolaHoja() {
          var hoja = document.querySelector(".hc-hoja.fd.pr");
          if (!hoja) return;
          var cabe = 297 * 96 / 25.4;   // una A4 de alto, en pixeles de CSS
          hoja.style.zoom = "1";
          if (!hoja.scrollHeight || hoja.scrollHeight <= cabe) return;

          /* Lo que sobra se le quita primero al odontograma y solo despues a
             la letra: en un presupuesto lo que el paciente lee son los montos,
             y el dibujo se entiende igual mas chico. Sin esto, veinte
             tratamientos dejaban las cifras en menos de 7 puntos. */
          var caja = hoja.querySelector(".pr-odontograma");
          if (caja) {
            var sobra = hoja.scrollHeight - cabe;
            var alto = caja.getBoundingClientRect().height;
            // no baja del 80%: mas chico las siglas de las piezas no se leen
            var corta = Math.max(alto * 0.8, alto - sobra);
            if (alto && corta < alto) {
              caja.dataset.altoMax = String(Math.round(corta));
              ajustar();
            }
          }

          var queda = hoja.scrollHeight;
          if (queda <= cabe) return;
          /* El tope de 0.72 es para que un presupuesto enorme no termine
             ilegible: ese si se va a dos hojas. */
          hoja.style.zoom = String(Math.max(0.72, cabe / queda));
        }
        window.addEventListener("load", function () {
          setTimeout(function () {
            /* Para la imagen, la hoja se arma al ancho de una A4 aunque la
               ventana sea angosta: en el celular lo es, y el odontograma se
               encogia para caber en ese ancho, con las piezas encimadas. */
            if (${paraImagen ? "true" : "false"}) {
              var hoja = document.querySelector(".hc-hoja.fd.pr");
              document.body.style.width = "794px";
              if (hoja) { hoja.style.width = "794px"; hoja.style.maxWidth = "none"; }
            }
            ajustar();
            unaSolaHoja();
            if (!${paraImagen ? "true" : "false"}) window.print();
          }, 350);
        });

        /* La imagen de la hoja al menu Compartir del equipo, y desde ahi a
           WhatsApp. Es el mismo camino de la constancia de pago: en el celular
           sale el menu de compartir; donde no lo hay -casi toda computadora- la
           imagen se descarga para adjuntarla a mano. */
        var boton = document.getElementById("enviarWhatsapp");
        var aviso = document.getElementById("avisoWhatsapp");
        var puedeCompartir = Boolean(navigator.canShare && navigator.share);
        var textoBoton = puedeCompartir ? "Enviar imagen por WhatsApp" : "Descargar imagen";
        boton.textContent = textoBoton;
        function listo(mensaje) {
          boton.disabled = false;
          boton.textContent = textoBoton;
          aviso.textContent = mensaje || "";
        }
        boton.addEventListener("click", function () {
          if (!window.html2canvas) {
            listo("Para armar la imagen hace falta internet. Mientras tanto, imprime el presupuesto.");
            return;
          }
          boton.disabled = true;
          boton.textContent = "Preparando imagen...";
          var nombre = boton.dataset.archivo + ".png";
          /* La hoja se retrata siempre al ancho de una A4 -794 pixeles-, no al
             de la ventana: en el celular la ventana es angosta y la imagen
             salia toda apretada, con las piezas encimadas y la columna del
             precio cortada. Y ahi es justo donde se usa. */
          window.html2canvas(document.querySelector(".hc-hoja.fd.pr"), { scale: 2, backgroundColor: "#ffffff", logging: false, windowWidth: 794 }).then(function (lienzo) {
            lienzo.toBlob(function (imagen) {
              if (!imagen) return listo("No se pudo armar la imagen.");
              var archivo = new File([imagen], nombre, { type: "image/png" });
              if (navigator.canShare && navigator.canShare({ files: [archivo] })) {
                navigator.share({ files: [archivo], title: boton.dataset.archivo }).then(function () {
                  listo("");
                }).catch(function (error) {
                  // cancelar desde el menu de compartir no es un fallo
                  listo(error && error.name === "AbortError" ? "" : "No se pudo compartir la imagen.");
                });
                return;
              }
              var enlace = document.createElement("a");
              enlace.href = URL.createObjectURL(imagen);
              enlace.download = nombre;
              enlace.click();
              setTimeout(function () { URL.revokeObjectURL(enlace.href); }, 4000);
              listo("La imagen se descargo (" + nombre + "). Adjuntala en WhatsApp.");
            }, "image/png");
          }).catch(function () {
            listo("No se pudo armar la imagen.");
          });
        });
      })();
    <\/script>
    </body></html>`);
  ventana.document.close();
}


/* ---------- Ficha estomatologica ----------
   El examen de ingreso en una sola hoja: signos vitales, examen extraoral e
   intraoral, odontograma, examenes auxiliares y diagnostico con su CIE-10.
   Los signos vitales son los mismos de la historia clinica -se escriben sobre
   la misma atencion, asi que lo anotado en una hoja aparece en la otra-. Lo
   que la historia no pide (talla, peso, el detalle del examen, los examenes
   auxiliares) se guarda en el paciente. Las casillas se marcan con un clic; un
   codigo CIE-10 escrito en el diagnostico de una nota marca la suya solo. */

const EXAMENES_AUXILIARES = [
  "Periapical", "Tomografía", "Bitewing", "Panorámica", "Cefalométrica",
  "Periodontograma", "Modelo de estudio", "Fotografía clínica", "Modelo de estudio encerado", "Exámenes de laboratorio"
];

const DIAGNOSTICOS_CIE = [
  ["K02.0", "Caries limitada al esmalte"],
  ["K02.1", "Caries de la dentina"],
  ["K03.1", "Abrasión de los dientes"],
  ["K03.7", "Cambios posteruptivos del color de los tejidos dentales duros"],
  ["K04.0", "Pulpitis"],
  ["K04.1", "Necrosis de la pulpa"],
  ["K05.0", "Gingivitis aguda"],
  ["K05.1", "Gingivitis crónica"],
  ["K05.2", "Periodontitis aguda"],
  ["K05.3", "Periodontitis crónica"],
  ["K01.0", "Dientes incluidos"],
  ["K01.1", "Dientes impactados"],
  ["K07.2", "Anomalías de la relación entre los arcos dentarios"],
  ["K07.3", "Anomalías de la posición del diente"],
  ["K07.6", "Trastornos de la articulación temporomaxilar"],
  ["K08.1", "Pérdida de dientes por accidente, extracción o enfermedad periodontal local"]
];

const lista = (valor) => String(valor || "").split("|").map((item) => item.trim()).filter(Boolean);

function alternarMarcaEstomatologica(patientId, campo, valor) {
  const patient = patientById(patientId);
  if (!patient || !canManageClinical() || !["estAuxiliares", "estCie"].includes(campo)) return null;
  const marcadas = new Set(lista(patient[campo]));
  if (marcadas.has(valor)) marcadas.delete(valor);
  else marcadas.add(valor);
  patient[campo] = [...marcadas].join("|");
  return patient;
}

function fichaEstomatologica(patientId, { pantalla = true } = {}) {
  const patient = patientById(patientId);
  if (!patient) return `<p class="muted">Elige un paciente para ver su ficha estomatológica.</p>`;
  const config = state.config || {};
  const color = /^#[0-9a-f]{6}$/i.test(config.primaryColor || "") ? config.primaryColor : "#00a6d6";
  const sePuedeEscribir = pantalla && canManageClinical();
  const firmaDelDoctor = firmaVirtual({ imagen: patient.firmaEstomatologica, fecha: patient.firmaEstomatologicaFecha, por: patient.firmaEstomatologicaPor, etiqueta: "Firma del doctor tratante", pantalla: sePuedeEscribir, destino: "paciente", id: patient.id, campo: "firmaEstomatologica" });

  // la primera atencion, y la que tenga escrita la parte clinica (como la historia)
  const atenciones = state.clinicalHistory
    .filter((nota) => nota.patientId === patientId && !esSoloDeuda(nota))
    .sort((a, b) => String(a.date || "").localeCompare(String(b.date || "")));
  const primera = atenciones[0] || null;
  const nota = atenciones.find((item) => ["bloodPressure", "pulse", "heartRate", "respRate", "exam", "oralExam", "diagnosis", "finalDiagnosis"]
    .some((campo) => String(item[campo] || "").trim())) || primera || {};

  // un campo de la hoja: escrito si hay dato, y en pantalla se escribe encima
  const campo = (etiqueta, valor, destino, clase = "") => {
    const [tipo, nombre, registro] = String(destino || "").split("|");
    const editable = sePuedeEscribir && tipo && registro
      ? ` contenteditable="plaintext-only" role="textbox" tabindex="0" class="hcf-escribible" data-destino="${tipo}" data-campo="${nombre}" data-registro="${escapeHtml(registro)}"`
      : "";
    /* Los renglones de Especificaciones y Observaciones son rayas de verdad
       detras del texto: una trama de fondo perdia rayas al imprimir o achicar
       la hoja y quedaban huecos disparejos (Aurea, 2026-10-20). Van fuera del
       texto para que no se guarden con lo que se escribe. */
    const renglones = clase.includes("es-renglonado") ? `<span class="es-renglones" aria-hidden="true">${"<i></i>".repeat(16)}</span>` : "";
    return `<p class="fd-dato es-dato ${clase}"><span>${etiqueta}:</span><b${editable}>${escapeHtml(String(valor || "").trim())}</b>${renglones}</p>`;
  };
  const dePaciente = (nombre) => `paciente|${nombre}|${patient.id}`;
  // sin atencion, el primer signo vital abre la de hoy (como en la historia clinica)
  const deNota = (nombre) => (nota.id ? `nota|${nombre}|${nota.id}` : `notanueva|${nombre}|${patient.id}`);

  const marcados = (campoLista) => new Set(lista(patient[campoLista]));
  const auxiliares = marcados("estAuxiliares");
  const codigosEscritos = new Set(atenciones.flatMap((item) =>
    `${item.finalDiagnosis || ""} ${item.diagnosis || ""} ${item.cie10 || ""}`.toUpperCase().match(/\b[A-Z]\d{2}\.\d\b/g) || []));
  const cies = new Set([...marcados("estCie"), ...codigosEscritos]);
  const casilla = (marcada, campoLista, valor) => {
    const atributos = sePuedeEscribir
      ? ` role="checkbox" tabindex="0" aria-checked="${marcada}" data-est-marca="${campoLista}" data-est-valor="${escapeHtml(valor)}" data-paciente="${patient.id}"`
      : "";
    return `<span class="fd-casilla es-casilla${sePuedeEscribir ? " es-clic" : ""}"${atributos}>${marcada ? "X" : ""}</span>`;
  };

  /* El odontograma de esta hoja sale en blanco -permanentes y de leche, sin
     nada marcado- porque el doctor lo llena a mano en el examen de ingreso.
     El de colores sigue en su pestana, en la historia y en el presupuesto. */
  // la casilla junto al titulo elige el dibujo: el de la casa o el esquematico del Colegio
  const colegio = Boolean(config.fichaOdontogramaColegio);
  const dibujo = !colegio && window.Odontograma ? dibujoDelOdontograma(window.Odontograma.fichaVacia(), { completo: true, enBlanco: true }) : null;
  /* El primero de los nombres que sea un usuario registrado: si la atencion
     quedo con el nombre mal escrito ("Carla" por "Karla"), el del paciente
     si trae su sello y su COP (Aurea, 2026-10-20). */
  const nombres = [nota.attendedBy, patient.doctor].map((nombre) => String(nombre || "").trim()).filter(Boolean);
  const elegido = nombres.find((nombre) => usuarioDelDoctor(nombre)) || nombres[0] || "";
  const firmante = usuarioDelDoctor(elegido);
  const doctor = nombreCompletoDelDoctor(elegido);
  const fechaDeIngreso = patient.historiaDesde || primera?.date || String(patient.createdAt || "").slice(0, 10);
  const mitad = Math.ceil(DIAGNOSTICOS_CIE.length / 2);
  const columnaCie = (items) => items.map(([codigo, nombre]) => `<p class="es-cie">
      <span class="es-cie-nombre">${escapeHtml(nombre)}</span>
      <span class="es-cie-codigo">${codigo}</span>
      ${casilla(cies.has(codigo), "estCie", codigo)}
    </p>`).join("");

  return `<article class="hc-hoja fd es" style="--fd-color: ${color}">
    <header class="fd-cabecera">
      ${membrete(config)}
      <h3 class="fd-titulo es-titulo">Ficha estomatológica<small>Examen de ingreso y examen físico</small></h3>
      <span></span>
    </header>

    <div class="es-cabeza">
      ${campo("Fecha", fecha(fechaDeIngreso))}
      ${campo("Motivo de consulta", patient.chiefComplaint || primera?.reason, dePaciente("chiefComplaint"), "es-ancho")}
    </div>

    <div class="es-columnas">
      <section>
        <h4 class="fd-seccion">Signos vitales</h4>
        ${campo("Frecuencia cardiaca", nota.heartRate, deNota("heartRate"))}
        ${campo("Presión arterial", nota.bloodPressure, deNota("bloodPressure"))}
        ${campo("Frecuencia respiratoria", nota.respRate, deNota("respRate"))}
      </section>
      <section>
        <h4 class="fd-seccion">&nbsp;</h4>
        ${campo("Pulso", nota.pulse, deNota("pulse"))}
        ${campo("Talla", patient.estTalla, dePaciente("estTalla"))}
        ${campo("Peso", patient.estPeso, dePaciente("estPeso"))}
      </section>
      <section>
        <h4 class="fd-seccion">Examen extraoral</h4>
        ${campo("Impresión general", patient.estImpresion || nota.exam, dePaciente("estImpresion"))}
        ${campo("Cabeza", patient.estCabeza, dePaciente("estCabeza"))}
        ${campo("Cuello", patient.estCuello, dePaciente("estCuello"))}
        ${campo("Mejillas", patient.estMejillas, dePaciente("estMejillas"))}
      </section>
      <section>
        <h4 class="fd-seccion">Examen intraoral</h4>
        ${campo("Lengua", patient.estLengua, dePaciente("estLengua"))}
        ${campo("Piso de boca", patient.estPisoDeBoca, dePaciente("estPisoDeBoca"))}
        ${campo("Pilares del paladar", patient.estPaladar, dePaciente("estPaladar"))}
        ${campo("Encías", patient.estEncias, dePaciente("estEncias"))}
        ${campo("Vestíbulo", patient.estVestibulo, dePaciente("estVestibulo"))}
      </section>
    </div>

    <div class="es-titulo-odontograma">
      ${sePuedeEscribir
        ? `<label class="es-formato"><input type="checkbox" data-odontograma-colegio${colegio ? " checked" : ""} /> Formato del Colegio</label>`
        : ""}
      <h4 class="fd-seccion fd-centro">Odontograma</h4>
    </div>
    <div class="es-odontograma${colegio ? " es-con-esquema" : ""}">
      ${colegio
        ? `<div class="es-grafico es-esquema">${odontogramaEsquematico()}</div>`
        : dibujo
          ? `<div class="hc-grafico es-grafico" data-alto-max="360"><div class="odo-raiz hc-grafico-lienzo"><div class="odo-arco">${dibujo.html}</div></div></div>`
          : `<p class="muted es-sin-odontograma">Sin odontograma registrado.</p>`}
      <div class="es-notas">
        ${campo("Especificaciones", patient.estEspecificaciones, dePaciente("estEspecificaciones"), "fd-pregunta es-renglonado")}
        ${campo("Observaciones", patient.estObservaciones, dePaciente("estObservaciones"), "fd-pregunta es-renglonado")}
      </div>
    </div>

    <h4 class="fd-seccion">Exámenes auxiliares</h4>
    <div class="es-auxiliares">
      ${EXAMENES_AUXILIARES.map((nombre) => `<label class="es-auxiliar">${casilla(auxiliares.has(nombre), "estAuxiliares", nombre)}<span>${escapeHtml(nombre)}</span></label>`).join("")}
    </div>
    ${campo("Informe radiográfico", patient.estInforme, dePaciente("estInforme"), "es-ancho")}

    <h4 class="fd-seccion">Diagnóstico <small>C.I.E. 10</small></h4>
    <div class="es-diagnosticos">
      <div>${columnaCie(DIAGNOSTICOS_CIE.slice(0, mitad))}</div>
      <div>${columnaCie(DIAGNOSTICOS_CIE.slice(mitad))}</div>
    </div>

    <footer class="es-pie">
      <div class="es-paciente">
        ${campo("Apellidos y nombres del paciente", patient.name)}
        ${campo("N.° de historia clínica", numeroDeLaFicha(patient))}
      </div>
      <div class="fd-firma">
        ${firmante?.sello ? `<img class="pr-sello" src="${escapeHtml(firmante.sello)}" alt="" />` : ""}
        ${firmaDelDoctor.dibujo}
        <i></i>
        <span>Firma y sello del Dr. tratante</span>
        ${doctor ? `<small>${escapeHtml(doctor)}${firmante?.cop ? ` · COP ${escapeHtml(firmante.cop)}` : ""}</small>` : ""}
        ${firmaDelDoctor.dato}${firmaDelDoctor.boton}
      </div>
    </footer>
    ${pantalla
      ? `<p class="fd-acciones">
          <button class="ghost" type="button" data-imprimir-estomatologica="${patient.id}">Imprimir ficha estomatológica</button></p>`
      : ""}
  </article>`;
}

function imprimirFichaEstomatologica(patientId) {
  const patient = patientById(patientId);
  if (!patient) return;
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
    <title>Ficha estomatológica ${escapeHtml(patient.name)}</title>
    ${hojasDeEstilo}
    <style>
      @page { size: A4; margin: 0; }
      html, body { background: #fff !important; }
      body { display: block !important; min-height: 0 !important; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .hc-hoja.fd { border: 0 !important; border-radius: 0 !important; box-shadow: none !important; padding: 8mm 12mm !important; max-width: 210mm; margin: 0 auto; }
    </style></head><body>
    ${fichaEstomatologica(patientId, { pantalla: false })}
    <script>
      (function () {
        function ajustar() {
          document.querySelectorAll(".hc-grafico").forEach(function (caja) {
            var lienzo = caja.firstElementChild;
            if (!lienzo || !caja.clientWidth) return;
            lienzo.style.zoom = "1";
            var ancho = lienzo.scrollWidth;
            var alto = lienzo.scrollHeight;
            var altoMax = Number(caja.dataset.altoMax || 0);
            var zoom = ancho ? Math.min(1, caja.clientWidth / ancho) : 1;
            if (altoMax && alto) zoom = Math.min(zoom, altoMax / alto);
            if (ancho) lienzo.style.zoom = String(zoom);
          });
        }
        /* Una sola hoja: si la ficha no cabe en el A4 -con el sello grande la
           firma se iba a una segunda pagina (Aurea, 2026-10-20)- se achica
           el odontograma lo que sobra, sin bajar de 240 px; si aun asi no
           cabe, se encoge la hoja entera lo justo. */
        function caberEnUnaHoja() {
          var hoja = document.querySelector(".hc-hoja.fd");
          if (!hoja) return;
          var maximo = 1110;
          var sobra = hoja.getBoundingClientRect().height - maximo;
          var grafico = document.querySelector(".es-grafico");
          var esquema = document.querySelector(".esq-odontograma");
          if (sobra > 0 && esquema) {
            // el esquema del Colegio es una imagen: se le baja el tope de alto
            var actual = esquema.getBoundingClientRect().height;
            esquema.style.maxHeight = Math.max(240, Math.floor(actual - sobra - 4)) + "px";
          } else if (sobra > 0 && grafico) {
            var tope = Number(grafico.dataset.altoMax || 360);
            grafico.dataset.altoMax = String(Math.max(240, Math.floor(tope - sobra - 4)));
            ajustar();
          }
          var alto = hoja.getBoundingClientRect().height;
          if (alto > maximo) hoja.style.zoom = (maximo / alto).toFixed(3);
        }
        window.addEventListener("load", function () { setTimeout(function () { ajustar(); caberEnUnaHoja(); window.print(); }, 350); });
      })();
    <\/script>
    </body></html>`);
  ventana.document.close();
}


/* ---------- Odontograma del Colegio ----------
   La imagen oficial del ODONTOGRAMA 2019 (la hoja que entrega el Colegio
   Odontologico), recortada del PDF tal cual: no se redibuja, porque el doctor
   la quiere identica a la del papel. Va en blanco para llenarla a mano y se
   elige con la casilla junto al titulo de la ficha estomatologica. */
function odontogramaEsquematico() {
  return `<img class="esq-odontograma" src="assets/odontograma-colegio-2019.png" alt="Odontograma en blanco, formato del Colegio Odontológico" />`;
}

// la casilla del formato: se guarda en la configuracion del consultorio
function cambiarFormatoDelOdontograma(marcado) {
  if (!canManageClinical()) return false;
  state.config.fichaOdontogramaColegio = Boolean(marcado);
  if (!API_ENABLED) saveState();
  return true;
}

window.HojasExtra = { fichaDeDatos, marcarSiNoDeLaFicha, cargarFoto, ponerFotoDelDni, traerFotoDeLaFicha, imprimirFichaDeDatos, ponerFoto, quitarFoto, hojaDeEvolucion, imprimirHojaDeEvolucion, guardarCeldaDeEvolucion, cambiarDoctorDeEvolucion, borrarFilaDeEvolucion, presupuestoImpreso, imprimirPresupuesto, fichaEstomatologica, imprimirFichaEstomatologica, alternarMarcaEstomatologica, cambiarFormatoDelOdontograma };
})();
