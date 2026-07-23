const demos = {
  dental: {
    tag: "App Dental",
    title: "Control para consultorios dentales",
    intro: "Una presentacion breve para explicar como se ordenan citas, pacientes, pagos y reportes.",
    whatsapp:
      "https://wa.me/51930914176?text=Hola%2C%20quiero%20ver%20una%20demo%20de%20la%20App%20Dental.",
    items: [
      ["Agenda diaria", "Citas confirmadas, pendientes y atendidas."],
      ["Ficha del paciente", "Historial, tratamientos, pagos y observaciones."],
      ["Caja", "Resumen de ingresos y pagos por fecha."]
    ]
  },
  abarrotes: {
    tag: "App Abarrotes",
    title: "Control para tiendas y minimarkets",
    intro: "Una forma clara de mostrar ventas rapidas, inventario, alertas y cierre diario.",
    whatsapp:
      "https://wa.me/51930914176?text=Hola%2C%20quiero%20ver%20una%20demo%20de%20la%20App%20Abarrotes.",
    items: [
      ["Ventas rapidas", "Registro simple de productos, precios y ticket."],
      ["Stock", "Control de productos bajos y proveedores."],
      ["Cierre", "Ingresos, egresos y saldo del dia."]
    ]
  },
  billar: {
    tag: "App Billar",
    title: "Control para salas de billar",
    intro: "Un resumen elegante para explicar mesas, tiempos, consumos y cobro final.",
    whatsapp:
      "https://wa.me/51930914176?text=Hola%2C%20quiero%20ver%20una%20demo%20de%20la%20App%20Billar.",
    items: [
      ["Mesas", "Libres, ocupadas y tiempo activo."],
      ["Consumos", "Productos y servicios por mesa."],
      ["Caja", "Cobro final y resumen por turno."]
    ]
  }
};

const modal = document.getElementById("demoModal");
const tag = document.getElementById("demoTag");
const title = document.getElementById("demoTitle");
const intro = document.getElementById("demoIntro");
const list = document.getElementById("demoList");
const whatsapp = document.getElementById("demoWhatsapp");

function openDemo(type) {
  const demo = demos[type] || demos.dental;
  tag.textContent = demo.tag;
  title.textContent = demo.title;
  intro.textContent = demo.intro;
  whatsapp.href = demo.whatsapp;
  list.innerHTML = demo.items
    .map(([heading, text]) => `<article><strong>${heading}</strong><span>${text}</span></article>`)
    .join("");
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
  trigger.addEventListener("click", () => openDemo(trigger.dataset.demoLink));
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
      "Hola, quiero una propuesta de EmpresaFacil.",
      `Nombre: ${data.get("name") || ""}`,
      `Empresa: ${data.get("company") || ""}`,
      `Telefono: ${data.get("phone") || ""}`,
      `Sistema: ${data.get("product") || ""}`,
      `Necesidad: ${data.get("goal") || ""}`
    ].join("\n");
    window.open(`https://wa.me/51930914176?text=${encodeURIComponent(message)}`, "_blank", "noopener");
  });
}
