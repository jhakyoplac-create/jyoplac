const demoData = {
  dental: {
    tag: "App Dental",
    title: "Demo visual para consultorios dentales",
    intro: "Una presentacion breve para explicar agenda, pacientes, tratamientos, pagos y caja sin saturar al cliente.",
    image: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1100&q=82",
    whatsapp:
      "https://wa.me/51930914176?text=Hola%2C%20quiero%20ver%20la%20demo%20completa%20de%20la%20App%20Dental.",
    steps: [
      ["Agenda del dia", "Citas, pacientes confirmados y pendientes visibles."],
      ["Ficha del paciente", "Historial, tratamientos, pagos y observaciones."],
      ["Caja y reportes", "Resumen diario para saber cuanto ingreso."]
    ]
  },
  abarrotes: {
    tag: "App Abarrotes",
    title: "Demo visual para bodegas y minimarkets",
    intro: "Muestra como registrar ventas rapidas, controlar stock y cerrar caja de forma clara.",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1100&q=82",
    whatsapp:
      "https://wa.me/51930914176?text=Hola%2C%20quiero%20ver%20la%20demo%20completa%20de%20la%20App%20Abarrotes.",
    steps: [
      ["Venta rapida", "Productos, precios y ticket en pocos pasos."],
      ["Inventario", "Stock bajo, proveedores y categorias."],
      ["Cierre diario", "Ingresos, egresos y saldo del dia."]
    ]
  },
  billar: {
    tag: "App Billar",
    title: "Demo visual para salas de billar",
    intro: "Pensada para explicar mesas activas, tiempo de juego, consumos y cobro final.",
    image: "https://images.unsplash.com/photo-1518799175676-a0fed7996acb?auto=format&fit=crop&w=1100&q=82",
    whatsapp:
      "https://wa.me/51930914176?text=Hola%2C%20quiero%20ver%20la%20demo%20completa%20de%20la%20App%20Billar.",
    steps: [
      ["Mesas", "Libres, ocupadas y tiempo activo."],
      ["Consumo", "Bebidas, productos y servicios por mesa."],
      ["Cobro", "Cuenta final, caja y resumen del turno."]
    ]
  }
};

const modal = document.getElementById("demoModal");
const title = document.getElementById("demoTitle");
const tag = document.getElementById("demoTag");
const intro = document.getElementById("demoIntro");
const media = document.getElementById("demoMedia");
const steps = document.getElementById("demoSteps");
const whatsapp = document.getElementById("demoWhatsapp");

function openDemo(name) {
  const demo = demoData[name] || demoData.dental;
  tag.textContent = demo.tag;
  title.textContent = demo.title;
  intro.textContent = demo.intro;
  media.style.backgroundImage = `linear-gradient(rgba(0,0,0,.12), rgba(0,0,0,.12)), url("${demo.image}")`;
  steps.innerHTML = demo.steps
    .map(([heading, text]) => `<article><strong>${heading}</strong><span>${text}</span></article>`)
    .join("");
  whatsapp.href = demo.whatsapp;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("demo-open");
}

function closeDemo() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("demo-open");
}

document.querySelectorAll("[data-demo-link]").forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    openDemo(trigger.dataset.demoLink);
  });
});

document.querySelectorAll("[data-demo-close]").forEach((trigger) => {
  trigger.addEventListener("click", closeDemo);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeDemo();
});

const leadForm = document.getElementById("leadForm");

if (leadForm) {
  leadForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(leadForm);
    const message = [
      "Hola, quiero informacion de EmpresaFacil.",
      `Nombre: ${data.get("name") || ""}`,
      `Email: ${data.get("email") || ""}`,
      `Empresa: ${data.get("company") || ""}`,
      `Telefono: ${data.get("phone") || ""}`,
      `Sistema: ${data.get("product") || ""}`,
      `Objetivo: ${data.get("goal") || ""}`,
      `Web/redes: ${data.get("website") || ""}`
    ].join("\n");
    window.open(`https://wa.me/51930914176?text=${encodeURIComponent(message)}`, "_blank", "noopener");
  });
}
