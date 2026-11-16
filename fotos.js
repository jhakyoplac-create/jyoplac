/* Pestaña «Fotos y radiografías» de la historia del paciente (2026-11-15,
   la misma que en el dental de EmpresaFacil).

   Las fotos no van a la base de CM: se guardan en el Google Drive del
   consultorio, que el dueño conecta una sola vez. El navegador habla con
   /api/drive (backend/drive.py), que guarda la llave de Google y sube, lista
   y entrega las imagenes. Asi se ven en la PC, la tablet y el celular sin
   entrar a Google.

   Antes de subir, cada foto se achica aqui mismo (unos 300 KB; las
   radiografias con mas detalle) y se arma una miniatura para la galeria.
   Tambien entran documentos en PDF (2026-11-16): el consentimiento firmado a
   mano, resultados de laboratorio, informes. El PDF sube tal cual.
   Se apoya en lo que app.js deja a la vista: state, patientById, escapeHtml,
   todayISO, currentUser, canManageClinical, puedeAdministrarUsuarios y
   apiToken. */
(function () {
const TIPOS_DE_FOTO = [
  ["radiografia", "Radiografía", "Radiografías"],
  ["intraoral", "Intraoral", "Intraorales"],
  ["extraoral", "Extraoral", "Extraorales"],
  ["antes-despues", "Antes / Después", "Antes / Después"],
  ["consentimiento", "Consentimiento firmado", "Consentimientos"],
  ["documento", "Documento", "Documentos"],
  ["otros", "Otros", "Otros"]
];
const nombreDelTipo = (tipo) => (TIPOS_DE_FOTO.find(([clave]) => clave === tipo) || TIPOS_DE_FOTO[TIPOS_DE_FOTO.length - 1])[1];
const MAX_PDF = 15 * 1024 * 1024;
const esPdf = (archivo) => archivo.type === "application/pdf" || /\.pdf$/i.test(archivo.name || "");

/* ---------- Conversacion con el servidor ---------- */
async function pedir(accion, datos = {}, { binario = false } = {}) {
  let respuesta;
  try {
    respuesta = await fetch("/api/drive", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: binario ? "image/*" : "application/json", ...(apiToken ? { Authorization: `Bearer ${apiToken}` } : {}) },
      body: JSON.stringify({ accion, ...datos })
    });
  } catch {
    throw new Error("Sin conexión. Revisa el internet y vuelve a intentarlo.");
  }
  if (binario && respuesta.ok) return respuesta.blob();
  const cuerpo = await respuesta.json().catch(() => null);
  if (!respuesta.ok) {
    if (cuerpo?.desconectado) Object.assign(drive, { cargado: true, conectado: false });
    throw new Error(cuerpo?.error || `El servidor respondió ${respuesta.status}.`);
  }
  return cuerpo || {};
}

/* La foto viaja en base64 dentro del JSON: ya va achicada (unos 300 KB). */
function enBase64(blob) {
  return new Promise((resolver, rechazar) => {
    const lector = new FileReader();
    lector.onload = () => resolver(String(lector.result).split(",")[1] || "");
    lector.onerror = () => rechazar(new Error("No se pudo preparar la foto."));
    lector.readAsDataURL(blob);
  });
}

/* ---------- Lo que se recuerda mientras la pagina siga abierta ---------- */
const drive = { cargado: false, cargando: false, conectado: false, correo: "", usado: 0, total: 0, error: "" };
const listas = new Map();      // paciente -> { fotos, cargando, error }
const imagenes = new Map();    // "id|mini" o "id|grande" -> URL del blob
const pidiendo = new Map();
let filtro = "todas";
let comparando = false;
let elegidas = [];
let repintarHoja = () => {};

function cargarEstado() {
  if (drive.cargando) return;
  drive.cargando = true;
  pedir("estado")
    .then((datos) => Object.assign(drive, { conectado: Boolean(datos.conectado), correo: datos.correo || "", usado: datos.usado || 0, total: datos.total || 0, error: "" }))
    .catch((error) => { drive.error = error.message; })
    .finally(() => { drive.cargado = true; drive.cargando = false; repintarHoja(); });
}

function cargarLista(patientId, { forzar = false } = {}) {
  const actual = listas.get(patientId);
  if (actual?.cargando || (actual && !forzar && !actual.error)) return;
  listas.set(patientId, { fotos: actual?.fotos || [], cargando: true, error: "" });
  pedir("listar", { paciente: patientId })
    .then((datos) => listas.set(patientId, { fotos: datos.fotos || [], cargando: false, error: "" }))
    .catch((error) => listas.set(patientId, { fotos: actual?.fotos || [], cargando: false, error: error.message }))
    .finally(() => repintarHoja());
}

function imagen(id, tamano) {
  const clave = `${id}|${tamano}`;
  if (imagenes.has(clave)) return Promise.resolve(imagenes.get(clave));
  if (pidiendo.has(clave)) return pidiendo.get(clave);
  const promesa = pedir("ver", { id, mini: tamano === "mini" }, { binario: true })
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      imagenes.set(clave, url);
      // de las grandes se guardan pocas: pesan
      const grandes = [...imagenes.keys()].filter((k) => k.endsWith("|grande"));
      if (grandes.length > 12) { URL.revokeObjectURL(imagenes.get(grandes[0])); imagenes.delete(grandes[0]); }
      return url;
    })
    .finally(() => pidiendo.delete(clave));
  pidiendo.set(clave, promesa);
  return promesa;
}

/* ---------- La hoja ---------- */
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const fechaCorta = (iso) => {
  const [a, m, d] = String(iso || "").split("-");
  return a && m && d ? `${d} ${MESES[Number(m) - 1] || m} ${a}` : escapeHtml(iso || "");
};
const gigas = (bytes) => `${(bytes / 1024 ** 3).toFixed(bytes >= 10 * 1024 ** 3 ? 0 : 1)} GB`;

function citaDelDia(patientId, fecha) {
  const citas = (state.appointments || [])
    .filter((cita) => cita.patientId === patientId && cita.date === fecha && !["CANCELADA", "NO_ASISTIO"].includes(cita.status));
  if (!citas.length) return "";
  return citas.map((cita) => [cita.service, cita.doctor].filter(Boolean).join(" · ")).filter(Boolean).join(" / ");
}

function sinConectar() {
  if (!puedeAdministrarUsuarios()) {
    return `<div class="fotos-aviso">
      <h4>Fotos y radiografías</h4>
      <p>Para guardar fotos de los pacientes, el dueño o el administrador tiene que conectar el Google Drive del consultorio. Pídeselo: se hace una sola vez.</p>
    </div>`;
  }
  return `<div class="fotos-aviso">
    <h4>Conecta el Google Drive del consultorio</h4>
    <p>Las fotos y radiografías de los pacientes se guardan en el Google Drive del consultorio, ordenadas en una carpeta por paciente. Se conecta una sola vez y después se ven en la PC, la tablet y el celular, solo con entrar al sistema.</p>
    <ul>
      <li>Usa un Gmail solo para esto, por ejemplo <strong>nombredelconsultorio.fotos@gmail.com</strong>: tiene 15 GB gratis.</li>
      <li>Activa la verificación en dos pasos en ese Gmail. Quien tenga su clave puede borrar fotos desde Drive.</li>
      <li>El sistema solo ve las fotos que él mismo sube; nunca tus correos ni otros archivos.</li>
    </ul>
    <button class="primary" type="button" data-fotos-conectar>Conectar Google Drive</button>
  </div>`;
}

function tarjeta(foto) {
  const elegida = elegidas.includes(foto.id);
  return `<button class="foto-tarjeta${elegida ? " elegida" : ""}" type="button" data-foto-abrir="${escapeHtml(foto.id)}">
    <span class="foto-cuadro"><img data-foto-mini="${escapeHtml(foto.id)}" alt="${escapeHtml(nombreDelTipo(foto.tipo))}" />${foto.pdf ? `<span class="foto-pdf">PDF</span>` : ""}</span>
    <span class="foto-pie">
      <span class="foto-etiqueta tipo-${escapeHtml(foto.tipo)}">${escapeHtml(nombreDelTipo(foto.tipo))}</span>
      ${foto.nota ? `<span class="foto-nota">${escapeHtml(foto.nota)}</span>` : ""}
    </span>
    ${comparando ? `<span class="foto-marca">${elegida ? elegidas.indexOf(foto.id) + 1 : ""}</span>` : ""}
  </button>`;
}

function hojaDeFotos(patientId, repintar) {
  repintarHoja = repintar || repintarHoja;
  const patient = patientById(patientId);
  if (!patient) return `<p class="muted">Elige un paciente para ver sus fotos.</p>`;
  if (!drive.cargado) {
    cargarEstado();
    return `<p class="muted fotos-cargando">Revisando la conexión con Google Drive…</p>`;
  }
  if (drive.error && !drive.conectado) {
    return `<div class="fotos-aviso"><p>${escapeHtml(drive.error)}</p><button class="small-btn" type="button" data-fotos-reintentar>Reintentar</button></div>`;
  }
  if (!drive.conectado) return sinConectar();

  const lista = listas.get(patientId);
  if (!lista) cargarLista(patientId);
  const fotos = lista?.fotos || [];
  const cuenta = (tipo) => fotos.filter((foto) => foto.tipo === tipo).length;
  if (filtro !== "todas" && !cuenta(filtro)) filtro = "todas";
  const visibles = filtro === "todas" ? fotos : fotos.filter((foto) => foto.tipo === filtro);
  const porDia = new Map();
  [...visibles].sort((a, b) => (b.fecha + b.subidoEl).localeCompare(a.fecha + a.subidoEl)).forEach((foto) => {
    if (!porDia.has(foto.fecha)) porDia.set(foto.fecha, []);
    porDia.get(foto.fecha).push(foto);
  });
  const filtros = [`<button type="button" class="fotos-filtro${filtro === "todas" ? " activo" : ""}" data-fotos-filtro="todas">Todas · ${fotos.length}</button>`]
    .concat(TIPOS_DE_FOTO.filter(([tipo]) => cuenta(tipo)).map(([tipo, , plural]) =>
      `<button type="button" class="fotos-filtro${filtro === tipo ? " activo" : ""}" data-fotos-filtro="${tipo}">${escapeHtml(plural)} · ${cuenta(tipo)}</button>`))
    .join("");
  const porcentaje = drive.total ? Math.min(100, Math.max(2, Math.round((drive.usado / drive.total) * 100))) : 0;

  const cuerpo = lista?.cargando && !fotos.length
    ? `<p class="muted fotos-cargando">Trayendo las fotos de ${escapeHtml(patient.name)}…</p>`
    : !fotos.length
      ? `<div class="fotos-vacio"><p>${escapeHtml(patient.name)} todavía no tiene fotos ni documentos.</p><p class="muted">Toca «+ Subir fotos o PDF» para agregar radiografías, fotos intraorales, el antes y después, o documentos en PDF como el consentimiento firmado.</p></div>`
      : [...porDia.entries()].map(([fecha, delDia]) => {
        const cita = citaDelDia(patientId, fecha);
        return `<section class="fotos-dia">
          <h5>${fechaCorta(fecha)}${cita ? ` <small>${escapeHtml(cita)}</small>` : ""}</h5>
          <div class="fotos-rejilla">${delDia.map(tarjeta).join("")}</div>
        </section>`;
      }).join("");

  return `<article class="fotos-hoja">
    <div class="fotos-barra">
      ${canManageClinical() ? `<button class="primary" type="button" data-fotos-subir>+ Subir fotos o PDF</button>
      <input type="file" id="fotosArchivos" accept="image/*,application/pdf,.pdf" multiple hidden />` : ""}
      ${fotos.filter((foto) => !foto.pdf).length >= 2 ? `<button class="small-btn${comparando ? " activo" : ""}" type="button" data-fotos-comparar>${comparando ? "Cancelar comparación" : "Antes / Después"}</button>` : ""}
      <div class="fotos-filtros">${fotos.length ? filtros : ""}</div>
      <div class="fotos-drive">
        <span>Google Drive · ${escapeHtml(drive.correo || "conectado")}</span>
        ${drive.total ? `<span class="fotos-medidor" title="${gigas(drive.usado)} de ${gigas(drive.total)}"><i style="width:${porcentaje}%"></i></span><span>${gigas(drive.usado)} de ${gigas(drive.total)}</span>` : ""}
        ${puedeAdministrarUsuarios() ? `<button class="fotos-enlace" type="button" data-fotos-desconectar>Desconectar</button>` : ""}
      </div>
    </div>
    ${comparando ? `<p class="fotos-ayuda">Elige dos fotos: la más antigua sale como «Antes». ${elegidas.length}/2</p>` : ""}
    ${lista?.error ? `<p class="fotos-error">${escapeHtml(lista.error)} <button class="fotos-enlace" type="button" data-fotos-recargar>Reintentar</button></p>` : ""}
    ${cuerpo}
  </article>`;
}

/* Despues de pintar: las miniaturas se piden de a cuatro. */
function despuesDePintarFotos(caja) {
  const pendientes = [...caja.querySelectorAll("img[data-foto-mini]")];
  const siguiente = () => {
    const img = pendientes.shift();
    if (!img) return Promise.resolve();
    return imagen(img.dataset.fotoMini, "mini")
      .then((url) => { if (img.isConnected) img.src = url; })
      .catch(() => { img.closest(".foto-cuadro")?.classList.add("sin-imagen"); })
      .then(siguiente);
  };
  for (let i = 0; i < 4; i += 1) siguiente();
}

/* ---------- Achicar antes de subir ---------- */
async function abrirImagen(archivo) {
  if (window.createImageBitmap) {
    try { return await createImageBitmap(archivo, { imageOrientation: "from-image" }); } catch { }
  }
  return new Promise((resolver, rechazar) => {
    const img = new Image();
    img.onload = () => resolver(img);
    img.onerror = () => rechazar(new Error("No se pudo leer la imagen."));
    img.src = URL.createObjectURL(archivo);
  });
}

function achicar(fuente, lado, calidad) {
  const ancho = fuente.width;
  const alto = fuente.height;
  const escala = Math.min(1, lado / Math.max(ancho, alto));
  const lienzo = document.createElement("canvas");
  lienzo.width = Math.max(1, Math.round(ancho * escala));
  lienzo.height = Math.max(1, Math.round(alto * escala));
  const ctx = lienzo.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, lienzo.width, lienzo.height);
  ctx.drawImage(fuente, 0, 0, lienzo.width, lienzo.height);
  return new Promise((resolver, rechazar) => lienzo.toBlob((blob) => (blob ? resolver(blob) : rechazar(new Error("No se pudo preparar la foto."))), "image/jpeg", calidad));
}

/* La miniatura de un PDF: una hoja dibujada con el nombre del archivo. No se
   abre el PDF para sacarle la primera pagina: haria falta una libreria entera
   para una imagen que solo sirve para reconocerlo en la galeria. */
function miniaturaDePdf(nombre) {
  const lienzo = document.createElement("canvas");
  lienzo.width = 420;
  lienzo.height = 315;
  const ctx = lienzo.getContext("2d");
  ctx.fillStyle = "#eceae6";
  ctx.fillRect(0, 0, 420, 315);
  // la hoja, con la esquina doblada
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.moveTo(140, 34); ctx.lineTo(250, 34); ctx.lineTo(280, 64); ctx.lineTo(280, 214); ctx.lineTo(140, 214); ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#d9d6cf";
  ctx.beginPath();
  ctx.moveTo(250, 34); ctx.lineTo(250, 64); ctx.lineTo(280, 64); ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#d9d6cf";
  [92, 112, 132].forEach((y) => ctx.fillRect(158, y, 104, 6));
  ctx.fillStyle = "#c0392b";
  ctx.fillRect(158, 160, 70, 34);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 22px system-ui, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("PDF", 193, 178);
  // el nombre, recortado a lo que entra
  let texto = String(nombre || "documento.pdf").replace(/\.pdf$/i, "");
  ctx.fillStyle = "#3a3f45";
  ctx.font = "600 19px system-ui, Arial, sans-serif";
  if (ctx.measureText(texto).width > 380) {
    while (texto.length > 4 && ctx.measureText(`${texto}…`).width > 380) texto = texto.slice(0, -1);
    texto = `${texto}…`;
  }
  ctx.fillText(texto, 210, 262);
  return new Promise((resolver, rechazar) => lienzo.toBlob((blob) => (blob ? resolver(blob) : rechazar(new Error("No se pudo preparar el documento."))), "image/jpeg", 0.8));
}

/* ---------- Ventanas ---------- */
let ventana = null;
function cerrarVentana() {
  ventana?.remove();
  ventana = null;
  document.removeEventListener("keydown", teclasDelVisor);
}
function abrirVentana(html, clase = "") {
  cerrarVentana();
  ventana = document.createElement("div");
  ventana.className = `fotos-ventana ${clase}`;
  ventana.innerHTML = html;
  ventana.addEventListener("click", (event) => { if (event.target === ventana) cerrarVentana(); });
  document.body.appendChild(ventana);
  // Escape cierra cualquiera; las flechas solo mueven el visor
  document.addEventListener("keydown", teclasDelVisor);
  return ventana;
}

const opcionesDeTipo = (actual) => TIPOS_DE_FOTO.map(([tipo, nombre]) => `<option value="${tipo}"${tipo === actual ? " selected" : ""}>${escapeHtml(nombre)}</option>`).join("");

function ventanaDeSubida(patientId, archivos) {
  const patient = patientById(patientId);
  const vistas = archivos.map((archivo) => (esPdf(archivo) ? "" : URL.createObjectURL(archivo)));
  const soloPdf = archivos.every(esPdf);
  const cuantos = soloPdf
    ? (archivos.length === 1 ? "1 documento" : `${archivos.length} documentos`)
    : archivos.some(esPdf)
      ? `${archivos.length} archivos`
      : (archivos.length === 1 ? "1 foto" : `${archivos.length} fotos`);
  const caja = abrirVentana(`<div class="fotos-dialogo" role="dialog" aria-label="Subir fotos o documentos">
    <h4>Subir ${cuantos} · ${escapeHtml(patient?.name || "")}</h4>
    <div class="fotos-previas">${vistas.map((url, i) => (url ? `<img src="${url}" alt="" />` : `<span class="previa-pdf"><b>PDF</b><small>${escapeHtml(archivos[i].name)}</small></span>`)).join("")}</div>
    <div class="fotos-campos">
      <label>Tipo<select id="fotosTipo">${opcionesDeTipo(soloPdf ? "documento" : "intraoral")}</select></label>
      <label>Fecha<input type="date" id="fotosFecha" value="${todayISO()}" max="${todayISO()}" /></label>
      <label class="ancho">Nota (opcional)<input type="text" id="fotosNota" maxlength="300" placeholder="Ej.: control a los 3 meses" /></label>
    </div>
    <p class="fotos-progreso" id="fotosProgreso"></p>
    <div class="fotos-botones">
      <button class="small-btn" type="button" data-fotos-cancelar>Cancelar</button>
      <button class="primary" type="button" data-fotos-confirmar>Subir</button>
    </div>
  </div>`);
  const liberar = () => vistas.forEach((url) => { if (url) URL.revokeObjectURL(url); });
  caja.querySelector("[data-fotos-cancelar]").addEventListener("click", () => { liberar(); cerrarVentana(); });
  caja.querySelector("[data-fotos-confirmar]").addEventListener("click", async (event) => {
    const boton = event.currentTarget;
    const tipo = caja.querySelector("#fotosTipo").value;
    const fecha = caja.querySelector("#fotosFecha").value || todayISO();
    const nota = caja.querySelector("#fotosNota").value.trim();
    const progreso = caja.querySelector("#fotosProgreso");
    boton.disabled = true;
    caja.querySelector("[data-fotos-cancelar]").disabled = true;
    const subidas = [];
    const fallas = [];
    for (let i = 0; i < archivos.length; i += 1) {
      progreso.textContent = `Subiendo ${i + 1} de ${archivos.length}…`;
      try {
        let grande;
        let mini;
        const pdf = esPdf(archivos[i]);
        if (pdf) {
          // el PDF sube tal cual: no se achica ni se toca
          if (archivos[i].size > MAX_PDF) throw new Error("pesa más de 15 MB");
          grande = archivos[i];
          mini = await miniaturaDePdf(archivos[i].name);
        } else {
          const fuente = await abrirImagen(archivos[i]);
          const radiografia = tipo === "radiografia";
          grande = await achicar(fuente, radiografia ? 2400 : 1800, radiografia ? 0.9 : 0.85);
          mini = await achicar(fuente, 420, 0.72);
          fuente.close?.();
        }
        const [fotoB64, miniB64] = await Promise.all([enBase64(grande), enBase64(mini)]);
        const { foto: subida } = await pedir("subir", { foto: fotoB64, mini: miniB64, meta: {
          paciente: patientId,
          nombrePaciente: patient?.name || "",
          dni: patient?.dni || patient?.document || "",
          tipo,
          tipoNombre: nombreDelTipo(tipo),
          fecha,
          nota,
          subio: currentUser()?.name || ""
        } });
        subidas.push(subida);
      } catch (error) {
        fallas.push(`${archivos[i].name}: ${error.message}`);
      }
    }
    liberar();
    const lista = listas.get(patientId) || { fotos: [], cargando: false, error: "" };
    listas.set(patientId, { ...lista, fotos: [...subidas, ...lista.fotos] });
    cerrarVentana();
    repintarHoja();
    if (fallas.length) window.uiAlert?.(`${subidas.length ? `Se subieron ${subidas.length}. ` : ""}No se pudieron subir:\n${fallas.join("\n")}`);
    if (subidas.length) cargarEstado();
  });
}

let visor = { patientId: "", ids: [], indice: 0 };

function teclasDelVisor(event) {
  if (event.key === "Escape") cerrarVentana();
  if (!ventana?.classList.contains("visor")) return;
  if (event.key === "ArrowRight") moverVisor(1);
  if (event.key === "ArrowLeft") moverVisor(-1);
}

function moverVisor(paso) {
  if (!visor.ids.length) return;
  visor.indice = (visor.indice + paso + visor.ids.length) % visor.ids.length;
  pintarVisor();
}

function abrirVisor(patientId, id) {
  const fotos = visiblesDe(patientId);
  visor = { patientId, ids: fotos.map((foto) => foto.id), indice: Math.max(0, fotos.findIndex((foto) => foto.id === id)) };
  pintarVisor();
}

function visiblesDe(patientId) {
  const fotos = listas.get(patientId)?.fotos || [];
  const elegidasPorFiltro = filtro === "todas" ? fotos : fotos.filter((foto) => foto.tipo === filtro);
  return [...elegidasPorFiltro].sort((a, b) => (b.fecha + b.subidoEl).localeCompare(a.fecha + a.subidoEl));
}

function pintarVisor() {
  const patient = patientById(visor.patientId);
  const foto = (listas.get(visor.patientId)?.fotos || []).find((item) => item.id === visor.ids[visor.indice]);
  if (!foto) { cerrarVentana(); return; }
  const editable = canManageClinical();
  const caja = abrirVentana(`<div class="fotos-visor" role="dialog" aria-label="${foto.pdf ? "Documento" : "Foto"}">
    <div class="fotos-escenario${foto.pdf ? " es-pdf" : ""}">
      <img alt="${escapeHtml(nombreDelTipo(foto.tipo))}" />
      ${foto.pdf ? `<button class="fotos-abrir-pdf" type="button" data-visor-abrir-pdf>Abrir el PDF</button>` : `<p class="fotos-cargando-grande">Cargando…</p>`}
      ${visor.ids.length > 1 ? `<button class="fotos-flecha izq" type="button" data-visor-paso="-1" aria-label="Anterior">‹</button>
      <button class="fotos-flecha der" type="button" data-visor-paso="1" aria-label="Siguiente">›</button>` : ""}
      <button class="fotos-cerrar" type="button" data-visor-cerrar aria-label="Cerrar">×</button>
    </div>
    <aside class="fotos-lado">
      <h4>${escapeHtml(nombreDelTipo(foto.tipo))}</h4>
      <p class="fotos-sub">${visor.indice + 1} de ${visor.ids.length} · ${escapeHtml(patient?.name || "")}</p>
      <button class="fotos-accion whatsapp" type="button" data-visor-compartir>${navigator.canShare ? "Enviar por WhatsApp" : "Descargar"}</button>
      ${navigator.canShare ? `<button class="fotos-accion" type="button" data-visor-descargar>Descargar</button>` : ""}
      <p class="fotos-sub" id="visorAviso"></p>
      <label>Tipo<select id="visorTipo"${editable ? "" : " disabled"}>${opcionesDeTipo(foto.tipo)}</select></label>
      <label>Fecha<input type="date" id="visorFecha" value="${escapeHtml(foto.fecha)}" max="${todayISO()}"${editable ? "" : " disabled"} /></label>
      <label>Nota<textarea id="visorNota" rows="3" maxlength="1000"${editable ? "" : " disabled"}>${escapeHtml(foto.nota)}</textarea></label>
      ${foto.subio || foto.subidoEl ? `<p class="fotos-sub">Subió ${escapeHtml(foto.subio || "")} ${foto.subidoEl ? `· ${new Date(foto.subidoEl).toLocaleString("es-PE", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}` : ""}</p>` : ""}
      ${editable ? `<button class="small-btn" type="button" data-visor-guardar>Guardar cambios</button>` : ""}
      ${puedeAdministrarUsuarios() ? `<button class="fotos-accion borrar" type="button" data-visor-borrar>${foto.pdf ? "Borrar documento" : "Borrar foto"}</button>` : ""}
    </aside>
  </div>`, "visor");
  const img = caja.querySelector(".fotos-escenario img");
  const mini = imagenes.get(`${foto.id}|mini`);
  if (mini) img.src = mini;
  // de un PDF se muestra su miniatura; el documento se abre aparte, con su boton
  if (foto.pdf) {
    if (!mini) imagen(foto.id, "mini").then((url) => { if (img.isConnected) img.src = url; }).catch(() => {});
  } else {
    imagen(foto.id, "grande")
      .then((url) => { if (img.isConnected) { img.src = url; caja.querySelector(".fotos-cargando-grande")?.remove(); } })
      .catch((error) => { const aviso = caja.querySelector(".fotos-cargando-grande"); if (aviso) aviso.textContent = error.message; });
  }

  let inicio = null;
  const escenario = caja.querySelector(".fotos-escenario");
  escenario.addEventListener("touchstart", (event) => { inicio = event.touches[0].clientX; }, { passive: true });
  escenario.addEventListener("touchend", (event) => {
    if (inicio === null) return;
    const dx = event.changedTouches[0].clientX - inicio;
    inicio = null;
    if (Math.abs(dx) > 50) moverVisor(dx < 0 ? 1 : -1);
  });

  caja.addEventListener("click", async (event) => {
    const paso = event.target.closest("[data-visor-paso]");
    if (paso) { moverVisor(Number(paso.dataset.visorPaso)); return; }
    if (event.target.closest("[data-visor-cerrar]")) { cerrarVentana(); return; }
    const aviso = caja.querySelector("#visorAviso");
    if (event.target.closest("[data-visor-guardar]")) {
      const boton = event.target.closest("[data-visor-guardar]");
      boton.disabled = true;
      try {
        const { foto: editada } = await pedir("editar", {
          id: foto.id, tipo: caja.querySelector("#visorTipo").value, fecha: caja.querySelector("#visorFecha").value, nota: caja.querySelector("#visorNota").value
        });
        const lista = listas.get(visor.patientId);
        if (lista) lista.fotos = lista.fotos.map((item) => (item.id === foto.id ? { ...item, ...editada, mini: item.mini } : item));
        aviso.textContent = "Cambios guardados.";
        repintarHoja();
      } catch (error) {
        aviso.textContent = error.message;
      }
      boton.disabled = false;
      return;
    }
    const nombre = `${(patient?.name || "paciente").replace(/[\\/:*?"<>|]/g, "")} - ${nombreDelTipo(foto.tipo).replace(/\//g, "-")} ${foto.fecha}.${foto.pdf ? "pdf" : "jpg"}`;
    if (event.target.closest("[data-visor-abrir-pdf]")) {
      /* La pestaña se abre en el mismo clic -si se abriera despues de traer
         el archivo, el navegador la bloquearia- y se llena cuando llega. */
      const pestana = window.open("about:blank", "_blank");
      aviso.textContent = "Abriendo el documento…";
      try {
        const url = await imagen(foto.id, "grande");
        if (pestana && !pestana.closed) pestana.location.href = url;
        else { const enlace = document.createElement("a"); enlace.href = url; enlace.download = nombre; enlace.click(); }
        aviso.textContent = "";
      } catch (error) {
        pestana?.close();
        aviso.textContent = error.message;
      }
      return;
    }
    const descargar = async () => {
      const url = await imagen(foto.id, "grande");
      const enlace = document.createElement("a");
      enlace.href = url;
      enlace.download = nombre;
      enlace.click();
    };
    if (event.target.closest("[data-visor-descargar]")) { descargar().catch((error) => { aviso.textContent = error.message; }); return; }
    if (event.target.closest("[data-visor-compartir]")) {
      try {
        const url = await imagen(foto.id, "grande");
        const blob = await (await fetch(url)).blob();
        const archivo = new File([blob], nombre, { type: foto.pdf ? "application/pdf" : (blob.type || "image/jpeg") });
        if (navigator.canShare && navigator.canShare({ files: [archivo] })) {
          await navigator.share({ files: [archivo], title: nombre }).catch((error) => { if (error?.name !== "AbortError") throw error; });
        } else {
          await descargar();
          aviso.textContent = `Se descargó «${nombre}». Adjúntalo en WhatsApp.`;
        }
      } catch (error) {
        aviso.textContent = error.message || "No se pudo compartir el archivo.";
      }
      return;
    }
    if (event.target.closest("[data-visor-borrar]")) {
      if (!(await window.uiConfirm?.(`${foto.pdf ? "El documento" : "La foto"} se manda a la papelera del Google Drive del consultorio. Desde ahí se puede recuperar durante 30 días. ¿Continuar?`))) return;
      try {
        await pedir("borrar", { id: foto.id });
        const lista = listas.get(visor.patientId);
        if (lista) lista.fotos = lista.fotos.filter((item) => item.id !== foto.id);
        visor.ids = visor.ids.filter((id) => id !== foto.id);
        visor.indice = Math.min(visor.indice, visor.ids.length - 1);
        repintarHoja();
        if (visor.ids.length) pintarVisor(); else cerrarVentana();
        cargarEstado();
      } catch (error) {
        aviso.textContent = error.message;
      }
    }
  });
}

function abrirComparacion(patientId) {
  const fotos = (listas.get(patientId)?.fotos || []).filter((foto) => elegidas.includes(foto.id))
    .sort((a, b) => (a.fecha + a.subidoEl).localeCompare(b.fecha + b.subidoEl));
  if (fotos.length !== 2) return;
  const caja = abrirVentana(`<div class="fotos-comparar" role="dialog" aria-label="Antes y después">
    <button class="fotos-cerrar" type="button" data-visor-cerrar aria-label="Cerrar">×</button>
    ${fotos.map((foto, i) => `<figure>
      <img data-comparar="${escapeHtml(foto.id)}" alt="" />
      <figcaption><strong>${i === 0 ? "Antes" : "Después"}</strong><span>${fechaCorta(foto.fecha)}</span></figcaption>
    </figure>`).join("")}
  </div>`, "comparacion");
  caja.querySelector("[data-visor-cerrar]").addEventListener("click", cerrarVentana);
  caja.querySelectorAll("img[data-comparar]").forEach((img) => {
    const mini = imagenes.get(`${img.dataset.comparar}|mini`);
    if (mini) img.src = mini;
    imagen(img.dataset.comparar, "grande").then((url) => { if (img.isConnected) img.src = url; }).catch(() => {});
  });
}

/* ---------- Clics de la hoja (una sola vez, en la caja de la historia) ---------- */
function iniciarFotos() {
  /* Vuelta de Google despues de conectar: se avisa y se limpia la direccion. */
  const parametros = new URLSearchParams(location.search);
  const resultado = parametros.get("drive");
  if (resultado) {
    const motivo = parametros.get("drive_motivo") || "";
    parametros.delete("drive");
    parametros.delete("drive_motivo");
    history.replaceState(null, "", `${location.pathname}${parametros.toString() ? `?${parametros}` : ""}${location.hash}`);
    setTimeout(() => {
      window.uiAlert?.(resultado === "ok"
        ? "Google Drive quedó conectado. Ya se pueden subir fotos desde Historial clínico › Fotos y radiografías, y guardar el respaldo desde Configuración."
        : `No se pudo conectar Google Drive. ${motivo}`);
    }, 600);
  }

  const caja = document.getElementById("historyTimeline");
  if (!caja) return;
  caja.addEventListener("click", async (event) => {
    if (!event.target.closest(".fotos-hoja, .fotos-aviso")) return;
    const patientId = document.getElementById("historyPatientFilter")?.value || "";
    if (event.target.closest("[data-fotos-reintentar]")) { drive.cargado = false; drive.error = ""; repintarHoja(); return; }
    if (event.target.closest("[data-fotos-recargar]")) { cargarLista(patientId, { forzar: true }); return; }
    if (event.target.closest("[data-fotos-conectar]")) {
      const boton = event.target.closest("[data-fotos-conectar]");
      boton.disabled = true;
      boton.textContent = "Abriendo Google…";
      try {
        const { url } = await pedir("conectar", { volver: `${location.pathname}${location.search}`, quien: currentUser()?.name || "" });
        location.href = url;
      } catch (error) {
        boton.disabled = false;
        boton.textContent = "Conectar Google Drive";
        window.uiAlert?.(error.message);
      }
      return;
    }
    if (event.target.closest("[data-fotos-desconectar]")) {
      if (!(await window.uiConfirm?.(`Se desconecta el Google Drive ${drive.correo}. Las fotos se quedan en ese Drive, pero el sistema deja de mostrarlas hasta que se vuelva a conectar. ¿Desconectar?`))) return;
      try {
        await pedir("desconectar");
        Object.assign(drive, { conectado: false, correo: "", usado: 0, total: 0 });
        listas.clear();
        repintarHoja();
      } catch (error) {
        window.uiAlert?.(error.message);
      }
      return;
    }
    const filtroBoton = event.target.closest("[data-fotos-filtro]");
    if (filtroBoton) { filtro = filtroBoton.dataset.fotosFiltro; repintarHoja(); return; }
    if (event.target.closest("[data-fotos-subir]")) { document.getElementById("fotosArchivos")?.click(); return; }
    if (event.target.closest("[data-fotos-comparar]")) { comparando = !comparando; elegidas = []; repintarHoja(); return; }
    const abrir = event.target.closest("[data-foto-abrir]");
    if (abrir) {
      const id = abrir.dataset.fotoAbrir;
      // un PDF no se compara: el antes y después es de fotos
      if (comparando && (listas.get(patientId)?.fotos || []).find((foto) => foto.id === id)?.pdf) return;
      if (comparando) {
        elegidas = elegidas.includes(id) ? elegidas.filter((item) => item !== id) : [...elegidas, id].slice(-2);
        repintarHoja();
        if (elegidas.length === 2) {
          abrirComparacion(patientId);
          comparando = false;
          elegidas = [];
          repintarHoja();
        }
        return;
      }
      abrirVisor(patientId, id);
    }
  });
  caja.addEventListener("change", (event) => {
    if (event.target.id !== "fotosArchivos") return;
    const archivos = [...(event.target.files || [])].filter((archivo) => /^image\//.test(archivo.type) || esPdf(archivo) || /\.(jpe?g|png|webp|heic|heif)$/i.test(archivo.name));
    event.target.value = "";
    const patientId = document.getElementById("historyPatientFilter")?.value || "";
    if (!archivos.length || !patientId) return;
    if (archivos.length > 20) { window.uiAlert?.("Sube hasta 20 archivos a la vez."); return; }
    ventanaDeSubida(patientId, archivos);
  });
}

window.FotosDrive = { hojaDeFotos, despuesDePintarFotos, iniciarFotos };
})();
