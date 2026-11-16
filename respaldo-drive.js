/* Respaldo del consultorio en su propio Google Drive (2026-11-16, igual que en
   el dental de EmpresaFacil).

   Un desplegable en Configuracion, «Respaldo consultorio», que solo ve el
   administrador -el mismo que puede usar «Exportar respaldo»-. Usa el Drive
   que el consultorio ya conecto para las fotos. No hay nada automatico: se
   guarda una copia cuando el administrador lo pide.

   La copia es el mismo archivo que baja «Exportar respaldo» -la base entera,
   sin las claves de los usuarios, que ya no salen del servidor- y queda en la
   carpeta «CM - Respaldos» de su Drive. Se conservan las ultimas 30. Si el
   Drive se desconecta o la copia falla, el sistema sigue igual. El servidor
   esta en backend/drive.py.

   Se apoya en lo que app.js deja a la vista: $, escapeHtml, isAdmin, apiToken,
   API_ENABLED, respaldoCompleto, reminderTimeLabel y currentUser. */
(function () {
const r = {
  cargado: false, cargando: false, disponible: false, conectado: false, correo: "", usado: 0, total: 0,
  copias: [], ocupado: "", aviso: "", todas: false
};

/* ---------- Conversacion con el servidor ---------- */
async function pedir(accion, datos = {}, { binario = false } = {}) {
  let respuesta;
  try {
    respuesta = await fetch("/api/drive", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json", ...(apiToken ? { Authorization: `Bearer ${apiToken}` } : {}) },
      body: JSON.stringify({ accion, ...datos })
    });
  } catch {
    throw new Error("Sin conexión. Revisa el internet y vuelve a intentarlo.");
  }
  if (binario && respuesta.ok) return respuesta.blob();
  const cuerpo = await respuesta.json().catch(() => null);
  if (!respuesta.ok) {
    if (cuerpo?.desconectado) r.conectado = false;
    throw new Error(cuerpo?.error || `El servidor respondió ${respuesta.status}.`);
  }
  return cuerpo || {};
}

function cargar() {
  if (r.cargando) return;
  r.cargando = true;
  pedir("estado")
    .then((datos) => {
      r.disponible = true;
      r.conectado = Boolean(datos.conectado);
      return r.conectado ? pedir("respaldo-estado") : null;
    })
    .then((datos) => {
      if (datos) Object.assign(r, { correo: datos.correo || "", usado: datos.usado || 0, total: datos.total || 0, copias: Array.isArray(datos.copias) ? datos.copias : [] });
    })
    // sin Google Drive activado en el servidor, o sin respuesta: el bloque no se muestra
    .catch(() => { if (!r.conectado) r.disponible = false; })
    .finally(() => { r.cargado = true; r.cargando = false; render(); });
}

/* ---------- El desplegable de Configuracion ---------- */
const DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const gigas = (bytes) => `${(bytes / 1024 ** 3).toFixed(bytes >= 10 * 1024 ** 3 ? 0 : 1)} GB`;
const megas = (bytes) => (bytes >= 1024 ** 2
  ? `${(bytes / 1024 ** 2).toFixed(1).replace(".", ",")} MB`
  : `${Math.max(1, Math.round(bytes / 1024))} KB`);

function horaDe(fecha) {
  return reminderTimeLabel(`${String(fecha.getHours()).padStart(2, "0")}:${String(fecha.getMinutes()).padStart(2, "0")}`);
}

function diaLargo(fecha) {
  const hoy = new Date();
  const anio = fecha.getFullYear() === hoy.getFullYear() ? "" : ` de ${fecha.getFullYear()}`;
  return `${DIAS[fecha.getDay()]} ${fecha.getDate()} de ${MESES[fecha.getMonth()]}${anio}`;
}

function cuenta() {
  const porcentaje = r.total ? Math.min(100, Math.max(1, Math.round((r.usado / r.total) * 100))) : 0;
  return `<div class="respaldo-cuenta">
    <span>Google Drive · ${escapeHtml(r.correo || "conectado")}</span>
    ${r.total ? `<span class="respaldo-medidor" title="${gigas(r.usado)} de ${gigas(r.total)}"><i style="width:${porcentaje}%"></i></span><span>${gigas(r.usado)} de ${gigas(r.total)}</span>` : ""}
  </div>`;
}

function listaDeCopias() {
  if (!r.copias.length) return `<p class="respaldo-vacio">Todavía no hay ninguna copia guardada.</p>`;
  const visibles = r.todas ? r.copias : r.copias.slice(0, 4);
  const filas = visibles.map((copia) => {
    const fecha = new Date(copia.creado);
    const cuando = Number.isNaN(fecha.getTime()) ? escapeHtml(copia.dia) : `${diaLargo(fecha)} <small>· ${horaDe(fecha)} · ${megas(copia.tamano)}</small>`;
    return `<li><span>${cuando}</span><button class="respaldo-enlace" type="button" data-respaldo-bajar="${escapeHtml(copia.id)}" data-nombre="${escapeHtml(copia.nombre)}" ${r.ocupado ? "disabled" : ""}>Descargar</button></li>`;
  });
  if (!r.todas && r.copias.length > visibles.length) {
    filas.push(`<li><span><small>… y ${r.copias.length - visibles.length} más</small></span><button class="respaldo-enlace" type="button" data-respaldo-todas>Ver todas</button></li>`);
  }
  return `<ul class="respaldo-lista">${filas.join("")}</ul>`;
}

function render() {
  const panel = $("#respaldoDrivePanel");
  const caja = $("#respaldoDriveCaja");
  if (!panel || !caja) return;
  if (!isAdmin() || !API_ENABLED || !apiToken) { panel.hidden = true; return; }
  if (!r.cargado) { panel.hidden = true; cargar(); return; }
  if (!r.disponible) { panel.hidden = true; return; }
  panel.hidden = false;
  const ocupado = r.ocupado ? "disabled" : "";
  const aviso = r.aviso ? `<p class="respaldo-aviso" role="status">${escapeHtml(r.aviso)}</p>` : "";

  if (!r.conectado) {
    caja.innerHTML = `<p>Guarda una copia de todo el consultorio en tu propio Google Drive, cuando tú quieras. Primero hay que conectar el Gmail del consultorio; se hace una sola vez.</p>
      <div class="respaldo-botones"><button class="primary" type="button" data-respaldo-conectar ${ocupado}>${r.ocupado === "conectar" ? "Abriendo Google…" : "Conectar Google Drive"}</button></div>
      ${aviso}`;
    return;
  }

  caja.innerHTML = `<p>Guarda una copia de <strong>todo el consultorio</strong> —pacientes, citas, pagos, historias y odontogramas— en tu propio Google Drive, cuando tú quieras. Es tuya: queda en tu correo aunque dejes de usar el sistema.</p>
    ${cuenta()}
    <div class="respaldo-botones">
      <button class="primary" type="button" data-respaldo-ahora ${ocupado}>${r.ocupado === "ahora" ? "Guardando la copia…" : "Guardar una copia ahora"}</button>
    </div>
    ${aviso}
    ${listaDeCopias()}
    <p class="respaldo-pie">Es el mismo archivo de «Exportar respaldo», sin las claves de los usuarios. Se conservan las últimas 30 copias; las más antiguas se borran solas.</p>`;
}

/* ---------- Clics del bloque (una sola vez) ---------- */
async function conOcupado(que, tarea) {
  if (r.ocupado) return;
  r.ocupado = que;
  r.aviso = "";
  render();
  try {
    await tarea();
  } catch (error) {
    r.aviso = error.message;
  } finally {
    r.ocupado = "";
    render();
  }
}

function iniciar() {
  const caja = $("#respaldoDriveCaja");
  if (!caja) return;
  caja.addEventListener("click", async (event) => {
    if (!isAdmin()) return;
    if (event.target.closest("[data-respaldo-conectar]")) {
      await conOcupado("conectar", async () => {
        const { url } = await pedir("conectar", { volver: `${location.pathname}${location.search}` });
        location.href = url;
        // la pagina se va a Google: el boton se queda en «Abriendo…» hasta entonces
        await new Promise((listo) => setTimeout(listo, 4000));
      });
      return;
    }
    if (event.target.closest("[data-respaldo-ahora]")) {
      await conOcupado("ahora", async () => {
        // la base entera, la misma que arma «Exportar respaldo»
        const { estado } = await respaldoCompleto();
        const { copias } = await pedir("respaldo-guardar", { respaldo: estado });
        if (Array.isArray(copias)) r.copias = copias;
        const tantos = (cuantos, uno, varios) => `${cuantos} ${cuantos === 1 ? uno : varios}`;
        r.aviso = `La copia quedó guardada en tu Google Drive: ${tantos(estado.patients.length, "paciente", "pacientes")}, ${tantos(estado.appointments.length, "cita", "citas")} y ${tantos(estado.payments.length, "pago", "pagos")}.`;
      });
      return;
    }
    if (event.target.closest("[data-respaldo-todas]")) { r.todas = true; render(); return; }
    const bajar = event.target.closest("[data-respaldo-bajar]");
    if (bajar) {
      await conOcupado("bajar", async () => {
        const archivo = await pedir("respaldo-bajar", { id: bajar.dataset.respaldoBajar }, { binario: true });
        const enlace = document.createElement("a");
        enlace.href = URL.createObjectURL(archivo);
        enlace.download = bajar.dataset.nombre || "respaldo.json";
        enlace.click();
        setTimeout(() => URL.revokeObjectURL(enlace.href), 30000);
      });
    }
  });
}

window.RespaldoDrive = { render, iniciar };
})();
