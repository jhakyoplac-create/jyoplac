/* Ventanas propias del sistema en lugar de las del navegador (alert, confirm,
   prompt), que salian grises y con "empresafacil.pe dice". Se cargan como
   script clasico antes del sistema para que cualquier archivo pueda usarlas,
   tambien odontograma.js (compartido con CM, donde no existen y se cae a las
   del navegador).

   uiAlert(mensaje)                  -> promesa que se resuelve al cerrar
   uiConfirm(mensaje, opciones)      -> promesa con true / false
   uiPrompt(mensaje, porDefecto, op) -> promesa con el texto, o null si cancelan

   Si el mensaje empieza con una pregunta ("¿Eliminar...?"), esa pregunta va de
   titulo y el resto de explicacion. Lo que borra o anula sale con el boton en
   rojo. */
(function () {
  "use strict";

  const PELIGRO = /\b(eliminar|elimina|borrar|borra|anular|quitar|quita|reemplazar|reemplazará|deshace|en cero)\b/i;

  function partir(mensaje, porDefecto) {
    const texto = String(mensaje ?? "").trim();
    const pregunta = texto.match(/^(¿[^?]{2,160}\?)\s*([\s\S]*)$/);
    if (pregunta) return { titulo: pregunta[1], cuerpo: pregunta[2].trim() };
    return { titulo: porDefecto, cuerpo: texto };
  }

  let cola = Promise.resolve();

  function abrir(tipo, mensaje, porDefecto, opciones = {}) {
    // Una ventana a la vez: si llegan dos avisos seguidos, el segundo espera.
    const turno = cola.then(() => mostrar(tipo, mensaje, porDefecto, opciones));
    cola = turno.catch(() => {});
    return turno;
  }

  function mostrar(tipo, mensaje, porDefecto, opciones) {
    return new Promise((resolver) => {
      const tituloBase = tipo === "alert" ? "Aviso" : tipo === "confirm" ? "Confirmar" : "Completa el dato";
      const { titulo, cuerpo } = partir(mensaje, opciones.title || tituloBase);
      const peligro = opciones.danger ?? (tipo === "confirm" && PELIGRO.test(String(mensaje)));

      const dlg = document.createElement("dialog");
      dlg.className = "ui-dialogo" + (peligro ? " ui-dialogo-peligro" : "");
      dlg.innerHTML = `
        <form method="dialog" class="ui-dialogo-caja">
          <div class="ui-dialogo-cabeza">
            <span class="ui-dialogo-icono" aria-hidden="true"></span>
            <h2 class="ui-dialogo-titulo"></h2>
          </div>
          <p class="ui-dialogo-texto"></p>
          ${tipo === "prompt" ? '<input class="ui-dialogo-campo" type="text" autocomplete="off" />' : ""}
          <p class="ui-dialogo-error" hidden></p>
          <menu class="ui-dialogo-botones">
            ${tipo === "alert" ? "" : '<button type="button" class="ghost ui-dialogo-boton" value="cancelar"></button>'}
            <button type="submit" class="primary ui-dialogo-boton" value="aceptar"></button>
          </menu>
        </form>`;
      dlg.querySelector(".ui-dialogo-titulo").textContent = titulo;
      const parrafo = dlg.querySelector(".ui-dialogo-texto");
      parrafo.textContent = cuerpo;
      if (!cuerpo) parrafo.hidden = true;
      const campo = dlg.querySelector(".ui-dialogo-campo");
      if (campo) campo.value = porDefecto == null ? "" : String(porDefecto);
      const botonOk = dlg.querySelector('[value="aceptar"]');
      botonOk.textContent = opciones.okText || (tipo === "alert" ? "Entendido" : peligro ? "Sí, continuar" : "Aceptar");
      const botonNo = dlg.querySelector('[value="cancelar"]');
      if (botonNo) botonNo.textContent = opciones.cancelText || "Cancelar";
      const error = dlg.querySelector(".ui-dialogo-error");

      let resuelto = false;
      const terminar = (valor) => {
        if (resuelto) return;
        resuelto = true;
        dlg.close();
        dlg.remove();
        resolver(valor);
      };
      const cancelar = () => terminar(tipo === "prompt" ? null : tipo === "confirm" ? false : true);

      dlg.querySelector("form").addEventListener("submit", (e) => {
        e.preventDefault();
        if (tipo === "prompt") {
          if (opciones.required && !campo.value.trim()) {
            error.textContent = opciones.requiredMessage || "Este dato es obligatorio.";
            error.hidden = false;
            campo.focus();
            return;
          }
          terminar(campo.value);
        } else terminar(true);
      });
      if (botonNo) botonNo.addEventListener("click", cancelar);
      // Esc cierra como "cancelar"; en los avisos equivale a "Entendido".
      dlg.addEventListener("cancel", (e) => { e.preventDefault(); cancelar(); });
      if (campo) campo.addEventListener("input", () => { error.hidden = true; });

      document.body.appendChild(dlg);
      dlg.showModal();
      setTimeout(() => (campo || botonOk).focus(), 30);
      if (campo) campo.select();
    });
  }

  window.uiAlert = (mensaje, opciones) => abrir("alert", mensaje, null, opciones);
  window.uiConfirm = (mensaje, opciones) => abrir("confirm", mensaje, null, opciones);
  window.uiPrompt = (mensaje, porDefecto, opciones) => abrir("prompt", mensaje, porDefecto, opciones);
})();
