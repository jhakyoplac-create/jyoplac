/* El ojito de las contraseñas.
   ---------------------------------------------------------------------------
   Escribir una contraseña a ciegas y que te digan "incorrecta" sin saber si
   fallaste tú o es que de verdad no es esa, es de las cosas que más cansan a
   quien atiende. Este archivo le pone a cada campo de contraseña un ojo para
   mirar lo que escribió.

   Se aplica solo a todos los campos que existan en la página -y a los que
   aparezcan después- en vez de ir uno por uno: así ningún formulario nuevo se
   queda sin él por olvido. Los estilos viajan aquí dentro porque el mismo
   archivo sirve al portal, al dental y a los demás, que tienen hojas y colores
   distintos; con currentColor el icono toma el color del texto de cada uno. */
(() => {
  "use strict";

  const MARCA = "data-ojo-puesto";

  function ponerEstilos() {
    if (document.getElementById("estilos-ver-contrasena")) return;
    const estilo = document.createElement("style");
    estilo.id = "estilos-ver-contrasena";
    estilo.textContent = `
      .campo-con-ojo {
        position: relative;
        display: block;
      }
      .campo-con-ojo > input {
        width: 100%;
        box-sizing: border-box;
        padding-right: 40px;
      }
      /* Edge pone su propio ojo en los campos de contraseña: con el nuestro
         saldrían dos, uno encima del otro. */
      .campo-con-ojo > input::-ms-reveal,
      .campo-con-ojo > input::-ms-clear {
        display: none;
      }
      .boton-ojo {
        position: absolute;
        top: 50%;
        right: 6px;
        transform: translateY(-50%);
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        padding: 0;
        border: 0;
        border-radius: 8px;
        background: none;
        color: inherit;
        opacity: .55;
        cursor: pointer;
      }
      .boton-ojo:hover,
      .boton-ojo:focus-visible {
        opacity: 1;
      }
      .boton-ojo svg {
        width: 18px;
        height: 18px;
        display: block;
      }
    `;
    document.head.appendChild(estilo);
  }

  const OJO = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
      stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12Z"/>
      <circle cx="12" cy="12" r="2.6"/>
    </svg>`;

  const OJO_TACHADO = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
      stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M2 12s3.5-6.5 10-6.5c1.6 0 3 .4 4.2 1M22 12s-3.5 6.5-10 6.5c-1.6 0-3-.4-4.2-1"/>
      <path d="M9.6 9.7a2.6 2.6 0 0 0 3.6 3.7"/>
      <path d="M3 3l18 18"/>
    </svg>`;

  function ponerOjo(campo) {
    if (!campo || campo.hasAttribute(MARCA)) return;
    if (campo.type !== "password") return;
    campo.setAttribute(MARCA, "1");

    const caja = document.createElement("span");
    caja.className = "campo-con-ojo";
    campo.parentNode.insertBefore(caja, campo);
    caja.appendChild(campo);

    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "boton-ojo";
    boton.innerHTML = OJO;
    boton.setAttribute("aria-label", "Mostrar la contraseña");
    boton.title = "Mostrar la contraseña";
    caja.appendChild(boton);

    const mostrar = (visible) => {
      campo.type = visible ? "text" : "password";
      boton.innerHTML = visible ? OJO_TACHADO : OJO;
      const texto = visible ? "Ocultar la contraseña" : "Mostrar la contraseña";
      boton.setAttribute("aria-label", texto);
      boton.title = texto;
    };

    boton.addEventListener("click", () => {
      mostrar(campo.type === "password");
      campo.focus();
    });

    /* Al enviar vuelve a taparse: si no, la contraseña se queda a la vista en
       la pantalla del mostrador hasta que alguien se acuerde de esconderla. */
    campo.form?.addEventListener("submit", () => mostrar(false));
    campo.form?.addEventListener("reset", () => mostrar(false));
  }

  function revisar(raiz = document) {
    raiz.querySelectorAll?.('input[type="password"]').forEach(ponerOjo);
  }

  function arrancar() {
    ponerEstilos();
    revisar();
    /* Los formularios que se dibujan después -el de crear usuarios, por
       ejemplo- también lo llevan, sin que nadie tenga que acordarse. */
    new MutationObserver((cambios) => {
      for (const cambio of cambios) {
        cambio.addedNodes.forEach((nodo) => {
          if (nodo.nodeType !== 1) return;
          if (nodo.matches?.('input[type="password"]')) ponerOjo(nodo);
          else revisar(nodo);
        });
      }
    }).observe(document.documentElement, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", arrancar);
  } else {
    arrancar();
  }
})();
