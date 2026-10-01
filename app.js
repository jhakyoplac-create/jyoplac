const STORAGE_KEY = "cm-dental-system-v3";
const API_TOKEN_KEY = `${STORAGE_KEY}-api-token`;
const API_TOKEN_EXPIRES_KEY = `${STORAGE_KEY}-api-token-expires`;
const API_USER_KEY = `${STORAGE_KEY}-api-user`;
const API_ENABLED = location.protocol === "http:" || location.protocol === "https:";
const API_SESSION_MS = 4 * 60 * 60 * 1000;

const seedData = {
  config: {
    clinicName: "CM Odontologia Estetica",
    start: "09:00",
    end: "20:00",
    interval: 30,
    lunchStart: "13:00",
    lunchEnd: "15:00",
    inactiveDays: 30,
    whatsapp: "930914176",
    doctors: ["Carlos", "Maghy", "Tercero (por contratar)"],
    units: ["Unidad 1", "Unidad 2"],
    statuses: ["RESERVADA", "CONFIRMADA", "EN_ATENCION", "ATENDIDA", "NO_ASISTIO", "CANCELADA", "REPROGRAMADA"],
    paymentMethods: ["EFECTIVO", "YAPE", "PLIN", "TARJETA", "TRANSFERENCIA"],
    treatmentStatuses: ["PRESUPUESTADO", "EN_PROCESO", "TERMINADO", "PAUSADO"],
    expenseSources: ["INGRESO_DEL_DIA", "CAJA_CHICA", "CAJA_GENERAL"],
    staffPaymentTypes: ["DOCTOR", "ASISTENTE", "DOCTOR_EXTERNO", "CONTADOR", "LABORATORIO", "OTRO"],
    issuerRuc: "10766704391",
    issuerLegalName: "TORRES LLANOS MAGHY CAROL",
    issuerTradeName: "C.O CM ODONTOLOGIA ESTETICA",
    issuerAddress: "JR. PEDRO PASCASIO NORIEGA 891",
    issuerDistrict: "MOYOBAMBA",
    issuerProvince: "MOYOBAMBA",
    issuerDepartment: "SAN MARTIN",
    receiptSeriesBoleta: "EB01",
    receiptSeriesFactura: "E001",
    receiptStartBoleta: 1113,
    receiptStartFactura: 17,
    generalCashOpening: 9000,
    generalBankOpening: 10000,
    generalUtilityOpening: 0,
    monthlyOpenings: {},
    enableAgendaPayments: true,
    servicesCustomized: false
  },
  services: [
    { name: "Consulta", category: "General", duration: 20, price: 30, active: true },
    { name: "Evaluacion", category: "General", duration: 30, price: 0, active: true },
    { name: "Profilaxis / Limpieza", category: "Periodoncia", duration: 30, price: 50, active: true },
    { name: "Destartraje / Limpieza General", category: "Periodoncia", duration: 60, price: 80, active: true },
    { name: "Frenectomia", category: "Periodoncia", duration: 60, price: 400, active: true },
    { name: "Gingivectomia", category: "Periodoncia", duration: 60, price: 300, active: true },
    { name: "Instalacion de Brackets Orthodontic", category: "Ortodoncia", duration: 90, price: 300, active: true },
    { name: "Instalacion de Brackets Orthometric", category: "Ortodoncia", duration: 90, price: 400, active: true },
    { name: "Instalacion de Brackets Morelli", category: "Ortodoncia", duration: 90, price: 500, active: true },
    { name: "Instalacion de Brackets Mor / autoliga", category: "Ortodoncia", duration: 90, price: 1000, active: true },
    { name: "Instalacion de Brackets Zafiro", category: "Ortodoncia", duration: 90, price: 2000, active: true },
    { name: "Control de Ortodoncia", category: "Ortodoncia", duration: 30, price: 80, active: true },
    { name: "Retiro de Brackets", category: "Ortodoncia", duration: 60, price: 0, active: true },
    { name: "Endodoncia", category: "Endodoncia", duration: 60, price: 600, active: true },
    { name: "Curaciones Simples", category: "Operatoria", duration: 30, price: 40, active: true },
    { name: "Curaciones Compuestas", category: "Operatoria", duration: 60, price: 60, active: true },
    { name: "Restauraciones Esteticas", category: "Operatoria", duration: 60, price: 90, active: true },
    { name: "Carillas de Resinas", category: "Operatoria", duration: 60, price: 150, active: true },
    { name: "Carillas de Ceramicas", category: "Operatoria", duration: 90, price: 900, active: true },
    { name: "Perno Dental", category: "Rehabilitacion Oral", duration: 60, price: 150, active: true },
    { name: "PPR Removible", category: "Rehabilitacion Oral", duration: 30, price: 500, active: true },
    { name: "Corona Zirconio", category: "Rehabilitacion Oral", duration: 30, price: 900, active: true },
    { name: "Corona Porcelana", category: "Rehabilitacion Oral", duration: 30, price: 500, active: true },
    { name: "Extraccion Simple", category: "Cirugia", duration: 30, price: 50, active: true },
    { name: "Extraccion Tercer Molar", category: "Cirugia", duration: 30, price: 300, active: true }
  ],
  patients: [
    { id: "p1", dni: "00831463", name: "BRISSA CORDOVA VILCA", phone: "980420884", doctor: "Maghy", mainTreatment: "Control de Ortodoncia", createdAt: "2026-05-06", notes: "" },
    { id: "p2", dni: "41097373", name: "MIRIAN CUBAS", phone: "916082948", doctor: "Maghy", mainTreatment: "Consulta", createdAt: "2026-05-06", notes: "" },
    { id: "p3", dni: "NIÑO", name: "LIAM CUBAS", phone: "916082948", doctor: "Maghy", mainTreatment: "Consulta", createdAt: "2026-05-06", notes: "" },
    { id: "p4", dni: "75713685", name: "JADI CRUZ TINEO", phone: "927361283", doctor: "Maghy", mainTreatment: "Control de Ortodoncia", createdAt: "2026-05-06", notes: "" },
    { id: "p5", dni: "61098463", name: "ALEXANDRA LOPEZ", phone: "983829630", doctor: "Carlos", mainTreatment: "Control de Ortodoncia", createdAt: "2026-05-06", notes: "" },
    { id: "p6", dni: "60160195", name: "JUAN GARCIA", phone: "999761941", doctor: "Maghy", mainTreatment: "Control de Ortodoncia", createdAt: "2026-05-06", notes: "" },
    { id: "p7", dni: "00000001", name: "PIERO NEIRA PERALTA", phone: "999111222", doctor: "Carlos", mainTreatment: "Evaluacion", createdAt: "2026-05-09", notes: "" },
    { id: "p8", dni: "00000002", name: "PAOLA ROJAS", phone: "988222333", doctor: "Carlos", mainTreatment: "Control de Ortodoncia", createdAt: "2026-05-10", notes: "" }
  ],
  appointments: [
    { id: "CI-000001", date: "2026-06-06", time: "10:00", unit: "Unidad 1", doctor: "Maghy", patientId: "p1", service: "Control de Ortodoncia", status: "CONFIRMADA", notes: "" },
    { id: "CI-000002", date: "2026-06-05", time: "03:00", unit: "Unidad 1", doctor: "Maghy", patientId: "p1", service: "Control de Ortodoncia", status: "ATENDIDA", notes: "" },
    { id: "CI-000003", date: "2026-05-09", time: "12:00", unit: "Unidad 2", doctor: "Carlos", patientId: "p7", service: "Evaluacion", status: "RESERVADA", notes: "" },
    { id: "CI-000004", date: "2026-06-06", time: "10:00", unit: "Unidad 2", doctor: "Carlos", patientId: "p8", service: "Control de Ortodoncia", status: "CONFIRMADA", notes: "" },
    { id: "CI-000005", date: "2026-05-15", time: "09:30", unit: "Unidad 1", doctor: "Carlos", patientId: "p5", service: "Control de Ortodoncia", status: "CONFIRMADA", notes: "" },
    { id: "CI-000006", date: "2026-05-15", time: "11:00", unit: "Unidad 2", doctor: "Maghy", patientId: "p2", service: "Consulta", status: "RESERVADA", notes: "" }
  ],
  treatments: [
    { id: "t1", patientId: "p1", service: "Control de Ortodoncia", teeth: "General", budget: 800, status: "EN_PROCESO", notes: "Control mensual de brackets.", createdAt: "2026-05-06" },
    { id: "t2", patientId: "p5", service: "Control de Ortodoncia", teeth: "General", budget: 800, status: "EN_PROCESO", notes: "", createdAt: "2026-05-06" },
    { id: "t3", patientId: "p2", service: "Consulta", teeth: "", budget: 30, status: "PRESUPUESTADO", notes: "Evaluar plan integral.", createdAt: "2026-05-06" }
  ],
  payments: [
    { id: "pay1", patientId: "p1", historyId: "h1", date: "2026-05-15", amount: 80, cashReceived: 100, change: 20, method: "YAPE", receipt: "Control mayo" },
    { id: "pay2", patientId: "p5", historyId: "", date: "2026-05-15", amount: 80, cashReceived: 80, change: 0, method: "EFECTIVO", receipt: "Control mayo" }
  ],
  electronicReceipts: [],
  clinicalHistory: [
    { id: "h1", patientId: "p1", date: "2026-05-15", attendedBy: "Maghy", attended: true, reason: "Control de ortodoncia", anamnesis: "Sin cambios relevantes.", exam: "Higiene regular.", diagnosis: "Evolucion favorable", plan: "Continuar controles.", procedure: "Cambio de ligas y revision de brackets.", instructions: "Mantener higiene y volver en 30 dias.", agreedPrice: 80 },
    { id: "h2", patientId: "p2", date: "2026-05-15", attendedBy: "Maghy", attended: true, reason: "Consulta inicial", anamnesis: "Niega alergias.", exam: "Evaluacion intraoral inicial.", diagnosis: "Evaluacion pendiente", plan: "Solicitar radiografia.", procedure: "Revision clinica general.", instructions: "Tomar radiografia panoramica.", agreedPrice: 50 }
  ],
  odontogramSnapshots: [],
  proformas: [],
  consentimientos: [],
  // lo que el consultorio escribe en la ventana de Precios
  listaDePrecios: [],
  odontogram: [
    { patientId: "p1", tooth: "11", condition: "Obturado", note: "Control ortodontico" },
    { patientId: "p1", tooth: "26", condition: "Cariado", note: "Revisar restauracion" },
    { patientId: "p2", tooth: "36", condition: "Cariado", note: "Programar curacion" }
  ],
  cashSessions: [],
  dailyClosures: [],
  expenses: [],
  inventoryProducts: [],
  inventoryMovements: [],
  pettyCashAllocations: [],
  auditEvents: [],
  users: [
    { id: "u-admin", name: "Administrador principal", username: "admin", password: "admin123", role: "ADMIN", active: true }
  ]
};

const odontogramRows = [
  { label: "Superior derecha", teeth: ["18", "17", "16", "15", "14", "13", "12", "11"] },
  { label: "Superior izquierda", teeth: ["21", "22", "23", "24", "25", "26", "27", "28"] },
  { label: "Inferior derecha", teeth: ["48", "47", "46", "45", "44", "43", "42", "41"] },
  { label: "Inferior izquierda", teeth: ["31", "32", "33", "34", "35", "36", "37", "38"] }
];
const teeth = odontogramRows.flatMap((row) => row.teeth);
const toothConditions = ["Sano", "Cariado", "Obturado", "Perdido", "Ausente", "Por extraer", "Extraido", "Corona", "Endodoncia", "Implante", "Sellante", "Ortodoncia", "Protesis", "Observacion"];

let state = loadState();
let currentView = "dashboard";
let currentUserId = localStorage.getItem(`${STORAGE_KEY}-current-user`) || "";
let apiToken = localStorage.getItem(API_TOKEN_KEY) || "";
let apiUser = loadApiUser();
let apiBootstrapped = false;
let apiRefreshing = false;
let apiCashRefreshing = false;
let patientSaving = false;
let historySaving = false;
let paymentSaving = false;
let rescheduleSaving = false;
let pendingPaymentContext = null;
let forcedPaymentHistoryId = "";
let lastSavedPatientId = "";
let patientEditingId = "";
let expandedPatientInfoId = "";
const patientAppointmentHistoryLoaded = new Set();
let selectedCashViewDate = "";
let selectedProductSaleItems = [];
let selectedCashReportRange = null;
/* Lo que el servidor sabe de la facturacion electronica. Vive aparte del estado
   guardado porque depende del servidor, no de este navegador. */
let sunatStatus = {
  configurado: false,
  modo: "",
  ruc: "",
  serieBoleta: "",
  serieFactura: "",
  boletasPendientes: 0,
  resumenesSinRespuesta: 0
};
let sunatOcupado = false;

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function clearApiSession() {
  apiToken = "";
  apiUser = null;
  localStorage.removeItem(API_TOKEN_KEY);
  localStorage.removeItem(API_TOKEN_EXPIRES_KEY);
  localStorage.removeItem(API_USER_KEY);
}

function loadApiUser() {
  try {
    return JSON.parse(localStorage.getItem(API_USER_KEY) || "null");
  } catch {
    return null;
  }
}

function rememberApiUser(user) {
  apiUser = user || null;
  if (apiUser) {
    currentUserId = apiUser.id || currentUserId;
    localStorage.setItem(API_USER_KEY, JSON.stringify(apiUser));
    localStorage.setItem(`${STORAGE_KEY}-current-user`, currentUserId);
  } else {
    localStorage.removeItem(API_USER_KEY);
  }
}

function rememberApiSession(token, expiresAt, user = null) {
  apiToken = token || "";
  if (!apiToken) {
    clearApiSession();
    return;
  }
  const fallbackExpires = Date.now() + API_SESSION_MS;
  const normalizedExpires = Number(expiresAt) || fallbackExpires;
  localStorage.setItem(API_TOKEN_KEY, apiToken);
  localStorage.setItem(API_TOKEN_EXPIRES_KEY, String(normalizedExpires));
  if (user) rememberApiUser(user);
}

function apiSessionExpired() {
  const expiresAt = Number(localStorage.getItem(API_TOKEN_EXPIRES_KEY) || 0);
  return Boolean(expiresAt && Date.now() >= expiresAt);
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return normalizeState(structuredClone(seedData));
  try {
    const base = structuredClone(seedData);
    const parsed = JSON.parse(saved);
    const merged = { ...base, ...parsed, config: { ...base.config, ...(parsed.config || {}) } };
    for (const key of ["services", "patients", "appointments", "treatments", "payments", "electronicReceipts", "clinicalHistory", "odontogram", "odontogramSnapshots", "cashSessions", "dailyClosures", "expenses", "inventoryProducts", "inventoryMovements", "pettyCashAllocations", "auditEvents", "users"]) {
      if (!Array.isArray(merged[key])) merged[key] = base[key];
    }
    return normalizeState(merged);
  } catch {
    return normalizeState(structuredClone(seedData));
  }
}

function normalizeState(data) {
  const defaults = seedData.config;
  if (!Array.isArray(data.proformas)) data.proformas = [];
  if (!Array.isArray(data.consentimientos)) data.consentimientos = [];
  if (!Array.isArray(data.listaDePrecios)) data.listaDePrecios = [];
  data.config = { ...defaults, ...(data.config || {}) };
  if (!Array.isArray(data.services) || !data.services.length) data.services = structuredClone(seedData.services);
  if (!data.config.servicesCustomized && !data.services.some((service) => String(service.name || "").toLowerCase() === "retiro de brackets")) {
    data.services.push({ name: "Retiro de Brackets", category: "Ortodoncia", duration: 60, price: 0, active: true });
  }
  if (!Array.isArray(data.config.doctors) || !data.config.doctors.filter(Boolean).length) data.config.doctors = [...defaults.doctors];
  if (!Array.isArray(data.config.units) || !data.config.units.filter(Boolean).length) data.config.units = [...defaults.units];
  if (!Array.isArray(data.config.statuses) || !data.config.statuses.filter(Boolean).length) data.config.statuses = [...defaults.statuses];
  if (!Array.isArray(data.config.paymentMethods) || !data.config.paymentMethods.filter(Boolean).length) data.config.paymentMethods = [...defaults.paymentMethods];
  if (!Array.isArray(data.config.treatmentStatuses) || !data.config.treatmentStatuses.filter(Boolean).length) data.config.treatmentStatuses = [...defaults.treatmentStatuses];
  if (!Array.isArray(data.config.expenseSources) || !data.config.expenseSources.filter(Boolean).length) data.config.expenseSources = [...defaults.expenseSources];
  if (!Array.isArray(data.config.staffPaymentTypes) || !data.config.staffPaymentTypes.filter(Boolean).length) data.config.staffPaymentTypes = [...defaults.staffPaymentTypes];
  data.config.doctors = data.config.doctors.map((item) => String(item).trim()).filter(Boolean);
  data.config.units = data.config.units.map((item) => String(item).trim()).filter(Boolean);
  data.config.staffPaymentTypes = data.config.staffPaymentTypes.map((item) => String(item).trim()).filter(Boolean);
  data.config.start = validTime(data.config.start) ? data.config.start : defaults.start;
  data.config.end = validTime(data.config.end) ? data.config.end : defaults.end;
  data.config.lunchStart = validTime(data.config.lunchStart) ? data.config.lunchStart : defaults.lunchStart;
  data.config.lunchEnd = validTime(data.config.lunchEnd) ? data.config.lunchEnd : defaults.lunchEnd;
  data.config.interval = Number(data.config.interval) > 0 ? Number(data.config.interval) : defaults.interval;
  data.config.inactiveDays = Number(data.config.inactiveDays) > 0 ? Number(data.config.inactiveDays) : defaults.inactiveDays;
  data.config.generalCashOpening = Number(data.config.generalCashOpening ?? defaults.generalCashOpening);
  data.config.generalBankOpening = Number(data.config.generalBankOpening ?? defaults.generalBankOpening);
  data.config.generalUtilityOpening = Number(data.config.generalUtilityOpening ?? defaults.generalUtilityOpening ?? 0);
  if (!data.config.monthlyOpenings || typeof data.config.monthlyOpenings !== "object" || Array.isArray(data.config.monthlyOpenings)) {
    data.config.monthlyOpenings = {};
  }
  if (!data.config.monthlyOpenings["2026-06"]) {
    data.config.monthlyOpenings["2026-06"] = {
      cash: Number(data.config.generalCashOpening || 0),
      bank: Number(data.config.generalBankOpening || 0)
    };
  }
  data.config.monthlyOpenings = Object.fromEntries(Object.entries(data.config.monthlyOpenings).map(([month, opening]) => [month, {
    cash: Number(opening?.cash || 0),
    bank: Number(opening?.bank || 0)
  }]));
  data.config.enableAgendaPayments = String(data.config.enableAgendaPayments).toLowerCase() !== "false";
  if (!Array.isArray(data.users) || !data.users.length) data.users = structuredClone(seedData.users);
  if (!Array.isArray(data.electronicReceipts)) data.electronicReceipts = [];
  if (!Array.isArray(data.inventoryProducts)) data.inventoryProducts = [];
  if (!Array.isArray(data.inventoryMovements)) data.inventoryMovements = [];
  if (!Array.isArray(data.pettyCashAllocations)) data.pettyCashAllocations = [];
  if (!Array.isArray(data.auditEvents)) data.auditEvents = [];
  data.auditEvents = data.auditEvents.filter((event) => event.eventDate === todayISO());
  data.users = data.users.map((user, index) => ({
    id: user.id || uid("user"),
    name: String(user.name || user.username || `Usuario ${index + 1}`).trim(),
    username: String(user.username || "").trim(),
    password: String(user.password || ""),
    role: ["ADMIN", "DOCTOR", "DOCTOR_TRABAJADOR", "RECEPCION"].includes(user.role) ? user.role : "RECEPCION",
    active: user.active !== false
  })).filter((user) => user.username);
  return data;
}

function validTime(value) {
  return typeof value === "string" && /^\d{2}:\d{2}$/.test(value);
}

function saveState() {
  state = normalizeState(state);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

async function apiFetch(path, options = {}) {
  let response;
  try {
    response = await fetch(path, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(apiToken ? { Authorization: `Bearer ${apiToken}` } : {}),
        ...(options.headers || {})
      }
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor. Revisa internet o espera que Render termine de despertar.");
  }
  const responseText = await response.text();
  let payload = {};
  try {
    payload = responseText ? JSON.parse(responseText) : {};
  } catch {
    payload = {};
  }
  if (response.status === 401) {
    clearApiSession();
    throw new Error("Sesion vencida. Cierra sesion e ingresa nuevamente.");
  }
  if (!response.ok) throw new Error(payload.error || responseText || `Servidor respondio con error ${response.status}.`);
  return payload;
}

function onlyDigits(value) {
  return String(value || "").replace(/\D/g, "");
}

async function lookupExternalDni(dni) {
  return apiFetch(`/api/external/dni?numero=${encodeURIComponent(dni)}`);
}

async function lookupExternalRuc(ruc) {
  return apiFetch(`/api/external/ruc?numero=${encodeURIComponent(ruc)}`);
}

function parsePresupuesto(valor) {
  if (!valor) return null;
  if (typeof valor === "object") return valor;
  try {
    return JSON.parse(valor);
  } catch (error) {
    return null;
  }
}


/* La proforma llega con sus lineas en texto JSON: se congelaron el dia en que
   se entrego y no se vuelven a calcular. */
/* El consentimiento viaja con la firma dibujada dentro: es una imagen en
   texto, larga, pero sin ella el documento no vale nada. */
function mapApiConsentimiento(row) {
  return {
    id: row.id,
    patientId: row.patient_id || row.patientId || "",
    tipo: row.tipo || "",
    fecha: (row.fecha || "").slice(0, 10),
    firma: row.firma || "",
    firmante: row.firmante || "",
    doctor: row.doctor || "",
    registradoPor: row.registrado_por || row.registradoPor || "",
    createdAt: row.created_at || row.createdAt || "",
  };
}


function mapApiProforma(row) {
  let lineas = row.lineas;
  if (typeof lineas === "string") {
    try {
      lineas = JSON.parse(lineas);
    } catch (error) {
      lineas = [];
    }
  }
  return {
    id: row.id,
    patientId: row.patient_id || row.patientId || "",
    patientName: row.patient_name || row.patientName || "",
    numero: Number(row.numero || 0),
    date: (row.date || "").slice(0, 10),
    lineas: Array.isArray(lineas) ? lineas : [],
    descuento: Number(row.descuento || 0),
    doctor: row.doctor || "",
    cop: row.cop || "",
    aceptadaEl: (row.aceptada_el || row.aceptadaEl || "").slice(0, 10),
    tratamientoId: row.tratamiento_id || row.tratamientoId || ""
  };
}


/* La lista de precios son objetos, no textos: parseApiList los volveria
   "[object Object]". */
function parseListaDePrecios(value, fallback) {
  if (!value) return fallback;
  let lista = value;
  if (typeof lista === "string") {
    try {
      lista = JSON.parse(lista);
    } catch (error) {
      return fallback;
    }
  }
  if (!Array.isArray(lista)) return fallback;
  return lista
    .filter((linea) => linea && linea.name)
    .map((linea) => ({ name: String(linea.name).trim(), price: Number(linea.price || 0) }));
}


function mapApiPatient(row) {
  return {
    id: row.id,
    dni: row.dni,
    name: row.name,
    phone: row.phone || "",
    birthDate: row.birth_date || row.birthDate || "",
    doctor: row.doctor || "",
    mainTreatment: row.main_treatment || row.mainTreatment || "",
    status: row.status || "NUEVO",
    notes: row.notes || "",
    createdById: row.created_by_id || row.createdById || "",
    createdByName: row.created_by_name || row.createdByName || "",
    createdByRole: row.created_by_role || row.createdByRole || "",
    hideFromReceptionNew: Boolean(row.hide_from_reception_new ?? row.hideFromReceptionNew ?? false),
    contactDate: row.contact_date || row.contactDate || "",
    contactResult: row.contact_result || row.contactResult || "",
    contactNote: row.contact_note || row.contactNote || "",
    contactSnooze: (row.contact_snooze || row.contactSnooze || "").slice(0, 10),
    contactBy: row.contact_by || row.contactBy || "",
    /* El presupuesto del paciente viaja como texto JSON desde el servidor: el
       precio que se dejo en cada linea, el descuento y lo elegido a mano. */
    presupuesto: parsePresupuesto(row.presupuesto),
    /* Los datos de la historia clinica del Colegio: domicilio, el
       representante del menor y los antecedentes. */
    address: row.address || row.address || "",
    sexo: row.sexo || row.sexo || "",
    birthPlace: row.birth_place || row.birthPlace || "",
    origin: row.origin || row.origin || "",
    education: row.education || row.education || "",
    maritalStatus: row.marital_status || row.maritalStatus || "",
    occupation: row.occupation || row.occupation || "",
    travels: row.travels || row.travels || "",
    emergencyContact: row.emergency_contact || row.emergencyContact || "",
    chiefComplaint: row.chief_complaint || row.chiefComplaint || "",
    companion: row.companion || row.companion || "",
    allergies: row.allergies || row.allergies || "",
    medications: row.medications || row.medications || "",
    personalHistory: row.personal_history || row.personalHistory || "",
    familyHistory: row.family_history || row.familyHistory || "",
    currentIllness: row.current_illness || row.currentIllness || "",
    illnessTime: row.illness_time || row.illnessTime || "",
    symptoms: row.symptoms || row.symptoms || "",
    anamnesis: row.anamnesis || row.anamnesis || "",
    biologicalFunctions: row.biological_functions || row.biologicalFunctions || "",
    guardianName: row.guardian_name || row.guardianName || "",
    guardianDni: row.guardian_dni || row.guardianDni || "",
    guardianRelation: row.guardian_relation || row.guardianRelation || "",
    guardianPhone: row.guardian_phone || row.guardianPhone || "",
    guardianAddress: row.guardian_address || row.guardianAddress || "",
    // calculados por el servidor: el navegador no tiene todas las citas
    lastAttended: (row.last_attended || row.lastAttended || "").slice(0, 10),
    nextAppointment: (row.next_appointment || row.nextAppointment || "").slice(0, 10),
    totalAppointments: Number(row.total_appointments ?? row.totalAppointments ?? 0),
    estado: row.estado || "",
    historiaNumero: Number(row.historia_numero ?? row.historiaNumero ?? 0) || 0,
    historiaDesde: row.historia_desde || row.historiaDesde || "",
    historiaHora: row.historia_hora || row.historiaHora || "",
    createdAt: (row.created_at || "").slice(0, 10)
  };
}

function mapApiAuditEvent(row) {
  return {
    id: row.id,
    eventDate: row.event_date || row.eventDate || "",
    action: row.action || "",
    detail: row.detail || "",
    patientId: row.patient_id || row.patientId || "",
    userId: row.user_id || row.userId || "",
    userName: row.user_name || row.userName || "",
    userRole: row.user_role || row.userRole || "",
    createdAt: row.created_at || row.createdAt || ""
  };
}

function mapApiAppointment(row) {
  return {
    id: row.id,
    date: row.date,
    time: row.time,
    unit: row.unit,
    doctor: row.doctor,
    patientId: row.patient_id || row.patientId,
    service: row.service,
    duration: row.duration,
    status: row.status,
    notes: row.notes || "",
    followUpStatus: row.follow_up_status || row.followUpStatus || "",
    followUpComment: row.follow_up_comment || row.followUpComment || "",
    newAppointmentId: row.new_appointment_id || row.newAppointmentId || "",
    reminderSentAt: row.reminder_sent_at || row.reminderSentAt || "",
    reminderSentBy: row.reminder_sent_by || row.reminderSentBy || "",
    // la base la guarda como 0 o 1; en el navegador se trabaja con si o no
    confirmada: Boolean(row.confirmada)
  };
}

function mapApiClinicalHistory(row) {
  return {
    id: row.id,
    patientId: row.patient_id || row.patientId,
    date: row.date,
    attendedBy: row.attended_by || row.attendedBy || "",
    attended: Boolean(row.attended),
    reason: row.reason || "",
    anamnesis: row.anamnesis || "",
    exam: row.exam || "",
    diagnosis: row.diagnosis || "",
    plan: row.plan || "",
    procedure: row.procedure_done || row.procedure || "",
    instructions: row.instructions || "",
    agreedPrice: Number(row.agreed_price ?? row.agreedPrice ?? 0),
    creditPending: Boolean(row.credit_pending ?? row.creditPending ?? false),
    creditAmount: Number(row.credit_amount ?? row.creditAmount ?? 0),
    creditDueDate: row.credit_due_date || row.creditDueDate || "",
    creditNote: row.credit_note || row.creditNote || "",
    planBudget: Number(row.plan_budget ?? row.planBudget ?? 0),
    /* Lo que pide el formato del Colegio: la enfermedad actual, los
       antecedentes, los signos vitales, el pronostico y la firma. */
    currentIllness: row.current_illness || row.currentIllness || "",
    illnessTime: row.illness_time || row.illnessTime || "",
    symptoms: row.symptoms || row.symptoms || "",
    biologicalFunctions: row.biological_functions || row.biologicalFunctions || "",
    familyHistory: row.family_history || row.familyHistory || "",
    personalHistory: row.personal_history || row.personalHistory || "",
    bloodPressure: row.blood_pressure || row.bloodPressure || "",
    pulse: row.pulse || row.pulse || "",
    temperature: row.temperature || row.temperature || "",
    heartRate: row.heart_rate || row.heartRate || "",
    respRate: row.resp_rate || row.respRate || "",
    oralExam: row.oral_exam || row.oralExam || "",
    finalDiagnosis: row.final_diagnosis || row.finalDiagnosis || "",
    workPlan: row.work_plan || row.workPlan || "",
    prognosis: row.prognosis || row.prognosis || "",
    recommendations: row.recommendations || row.recommendations || "",
    followUp: row.follow_up || row.followUp || "",
    professional: row.professional || row.professional || "",
    firma: row.firma || row.firma || "",
    firmadaPor: row.firmada_por || row.firmadaPor || "",
    firmadaEl: row.firmada_el || row.firmadaEl || "",
    discharged: Boolean(row.discharged),
  };
}

function mapApiTreatment(row) {
  return {
    id: row.id,
    patientId: row.patient_id || row.patientId,
    service: row.service || "",
    teeth: row.teeth || "",
    budget: Number(row.budget || 0),
    status: row.status || "",
    notes: row.notes || "",
    createdAt: (row.created_at || row.createdAt || "").slice(0, 10)
  };
}

function mapApiOdontogram(row) {
  return {
    id: row.id,
    patientId: row.patient_id || row.patientId,
    tooth: row.tooth,
    condition: row.condition || "Sano",
    note: row.note || "",
    findings: row.findings || ""
  };
}

function mapApiOdontogramSnapshot(row) {
  return {
    id: row.id,
    patientId: row.patient_id || row.patientId,
    sheet: row.sheet === "evolucion" ? "evolucion" : "inicial",
    date: (row.date || "").slice(0, 10),
    savedAt: row.saved_at || row.savedAt || "",
    doctor: row.doctor || "",
    note: row.note || "",
    ficha: row.ficha || ""
  };
}

function mapApiPayment(row) {
  return {
    id: row.id,
    patientId: row.patient_id || row.patientId,
    historyId: row.history_id || row.historyId || "",
    appointmentId: row.appointment_id || row.appointmentId || "",
    date: row.date,
    amount: Number(row.amount || 0),
    productAmount: Number(row.product_total ?? row.productAmount ?? 0),
    cashReceived: Number(row.cash_received ?? row.cashReceived ?? 0),
    change: Number(row.change_amount ?? row.change ?? 0),
    method: row.method,
    cashAmount: Number(row.cash_amount ?? row.cashAmount ?? 0),
    yapeAmount: Number(row.yape_amount ?? row.yapeAmount ?? 0),
    plinAmount: Number(row.plin_amount ?? row.plinAmount ?? 0),
    cardAmount: Number(row.card_amount ?? row.cardAmount ?? 0),
    transferAmount: Number(row.transfer_amount ?? row.transferAmount ?? 0),
    receipt: row.receipt || "",
    comprobante: row.comprobante || "",
    registeredBy: row.registered_by || row.registeredBy || "",
    treatmentId: row.treatment_id || row.treatmentId || "",
    tipo: row.tipo || "",
    descontado: Number(row.descontado ?? 0),
    closed: Boolean(row.closed)
  };
}

function mapApiElectronicReceipt(row) {
  return {
    id: row.id,
    paymentId: row.payment_id || row.paymentId || "",
    patientId: row.patient_id || row.patientId || "",
    type: row.type || "BOLETA",
    series: row.series || "",
    number: Number(row.number || 0),
    issueDate: row.issue_date || row.issueDate || "",
    customerDocType: row.customer_doc_type || row.customerDocType || "",
    customerDoc: row.customer_doc || row.customerDoc || "",
    customerName: row.customer_name || row.customerName || "",
    customerAddress: row.customer_address || row.customerAddress || "",
    description: row.description || "",
    quantity: Number(row.quantity || 1),
    unitValue: Number(row.unit_value ?? row.unitValue ?? 0),
    total: Number(row.total || 0),
    taxCondition: row.tax_condition || row.taxCondition || "EXONERADO",
    igv: Number(row.igv || 0),
    status: row.status || "BORRADOR",
    notes: row.notes || "",
    sunatEstado: row.sunat_estado || row.sunatEstado || "",
    sunatCodigo: row.sunat_codigo || row.sunatCodigo || "",
    sunatDescripcion: row.sunat_descripcion || row.sunatDescripcion || "",
    sunatTicket: row.sunat_ticket || row.sunatTicket || "",
    sunatEnviadoAt: row.sunat_enviado_at || row.sunatEnviadoAt || "",
    createdAt: row.created_at || row.createdAt || ""
  };
}

function mapApiInventoryProduct(row) {
  return {
    id: row.id,
    name: row.name || "",
    unit: row.unit || "Unidad",
    price: Number(row.price || 0),
    stock: Number(row.stock || 0),
    minStock: Number(row.min_stock ?? row.minStock ?? 0),
    active: row.active !== 0 && row.active !== false,
    createdAt: row.created_at || row.createdAt || "",
    updatedAt: row.updated_at || row.updatedAt || ""
  };
}

function mapApiInventoryMovement(row) {
  return {
    id: row.id,
    productId: row.product_id || row.productId || "",
    date: row.date || "",
    type: row.type || "",
    quantity: Number(row.quantity || 0),
    unitPrice: Number(row.unit_price ?? row.unitPrice ?? 0),
    total: Number(row.total || 0),
    detail: row.detail || "",
    paymentId: row.payment_id || row.paymentId || "",
    createdAt: row.created_at || row.createdAt || ""
  };
}

function mapApiExpense(row) {
  return {
    id: row.id,
    date: row.date,
    detail: row.detail || "",
    amount: Number(row.amount || 0),
    method: row.method || "",
    source: row.source || "",
    receipt: row.receipt || "",
    category: row.category || "",
    person: row.person || "",
    type: row.type || "",
    closed: Boolean(row.closed)
  };
}

function mapApiCashSession(row) {
  return {
    id: row.id,
    date: row.date,
    openingCash: Number(row.opening_cash ?? row.openingCash ?? 0),
    openedAt: row.opened_at || row.openedAt || "",
    closedAt: row.closed_at || row.closedAt || "",
    closingCash: Number(row.closing_cash ?? row.closingCash ?? 0),
    difference: Number(row.difference || 0),
    incomeTotal: Number(row.income_total ?? row.incomeTotal ?? 0),
    expenseTotal: Number(row.expense_total ?? row.expenseTotal ?? 0)
  };
}

function mapApiPettyCash(row) {
  return {
    id: row.id,
    date: row.date,
    amount: Number(row.amount || 0)
  };
}

function mapApiUser(row) {
  return {
    id: row.id,
    name: row.name || "",
    username: row.username || "",
    password: "",
    role: row.role || "RECEPCION",
    active: row.active !== 0 && row.active !== false
  };
}

function parseApiList(value, fallback) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.map((item) => String(item).trim()).filter(Boolean);
  } catch {
    return String(value).split(",").map((item) => item.trim()).filter(Boolean);
  }
  return fallback;
}

function parseApiServices(value, fallback) {
  if (!value) return fallback;
  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : value;
    if (Array.isArray(parsed)) {
      return parsed.map((item) => {
        if (typeof item === "string") return { name: item.trim(), category: "General", duration: 30, price: 0, active: true };
        return {
          name: String(item.name || "").trim(),
          category: item.category || "General",
          duration: Number(item.duration || 30),
          price: Number(item.price || 0),
          active: item.active !== false
        };
      }).filter((service) => service.name);
    }
  } catch {
    return String(value).split(",").map((name) => name.trim()).filter(Boolean).map((name) => ({ name, category: "General", duration: 30, price: 0, active: true }));
  }
  return fallback;
}

function applyApiBootstrap(payload) {
  state.patients = (payload.patients || []).map(mapApiPatient);
  state.appointments = (payload.appointments || []).map(mapApiAppointment);
  state.clinicalHistory = (payload.clinicalHistory || []).map(mapApiClinicalHistory);
  state.treatments = (payload.treatments || []).map(mapApiTreatment);
  state.odontogram = (payload.odontogram || []).map(mapApiOdontogram);
  state.odontogramSnapshots = (payload.odontogramSnapshots || []).map(mapApiOdontogramSnapshot);
  state.proformas = (payload.proformas || []).map(mapApiProforma);
  state.consentimientos = (payload.consentimientos || []).map(mapApiConsentimiento);
  state.payments = (payload.payments || []).map(mapApiPayment);
  state.electronicReceipts = (payload.electronicReceipts || []).map(mapApiElectronicReceipt);
  refreshSunatStatus();
  state.expenses = (payload.expenses || []).map(mapApiExpense);
  state.inventoryProducts = (payload.inventoryProducts || []).map(mapApiInventoryProduct);
  state.inventoryMovements = (payload.inventoryMovements || []).map(mapApiInventoryMovement);
  state.cashSessions = (payload.cashSessions || []).map(mapApiCashSession);
  state.pettyCashAllocations = (payload.pettyCashAllocations || []).map(mapApiPettyCash);
  state.auditEvents = (payload.auditEvents || []).map(mapApiAuditEvent);
  if (Array.isArray(payload.users) && payload.users.length) {
    state.users = payload.users.map(mapApiUser);
  }
  if (payload.config) {
    state.config.generalCashOpening = Number(payload.config.generalCashOpening ?? state.config.generalCashOpening);
    state.config.generalBankOpening = Number(payload.config.generalBankOpening ?? state.config.generalBankOpening);
    state.config.generalUtilityOpening = Number(payload.config.generalUtilityOpening ?? state.config.generalUtilityOpening);
    if (payload.config.monthlyOpenings !== undefined) {
      try {
        state.config.monthlyOpenings = typeof payload.config.monthlyOpenings === "string"
          ? JSON.parse(payload.config.monthlyOpenings)
          : payload.config.monthlyOpenings;
      } catch {
        state.config.monthlyOpenings = state.config.monthlyOpenings || {};
      }
    }
    state.config.clinicName = payload.config.clinicName || state.config.clinicName;
    state.config.start = payload.config.start || state.config.start;
    state.config.end = payload.config.end || state.config.end;
    state.config.interval = Number(payload.config.interval ?? state.config.interval);
    state.config.inactiveDays = Number(payload.config.inactiveDays ?? state.config.inactiveDays);
    if (payload.config.enableAgendaPayments !== undefined) {
      state.config.enableAgendaPayments = String(payload.config.enableAgendaPayments).toLowerCase() !== "false";
    }
    state.config.whatsapp = payload.config.whatsapp || state.config.whatsapp;
    ["issuerRuc", "issuerLegalName", "issuerTradeName", "issuerAddress", "issuerDistrict", "issuerProvince", "issuerDepartment", "receiptSeriesBoleta", "receiptSeriesFactura", "receiptStartBoleta", "receiptStartFactura"].forEach((key) => {
      if (payload.config[key] !== undefined) state.config[key] = payload.config[key];
    });
    state.config.doctors = parseApiList(payload.config.doctors, state.config.doctors);
    state.config.units = parseApiList(payload.config.units, state.config.units);
    if (payload.config.services) {
      state.services = parseApiServices(payload.config.services, state.services);
      state.config.servicesCustomized = true;
    } else {
      state = normalizeState(state);
    }
    /* La lista de precios del consultorio: lo que se escribio en la ventana de
       Precios. Viaja como texto JSON, igual que los servicios. */
    state.listaDePrecios = parseListaDePrecios(payload.config.listaDePrecios, state.listaDePrecios || []);
  }
  state = normalizeState(state);
  rememberApiUser(payload.user || apiUser);
  apiBootstrapped = true;
  render();
}

function applyApiCashState(payload) {
  if (Array.isArray(payload.cashSessions)) {
    state.cashSessions = payload.cashSessions.map(mapApiCashSession);
  }
  if (Array.isArray(payload.pettyCashAllocations)) {
    state.pettyCashAllocations = payload.pettyCashAllocations.map(mapApiPettyCash);
  }
  if (payload.config) {
    state.config.generalCashOpening = Number(payload.config.generalCashOpening ?? state.config.generalCashOpening);
    state.config.generalBankOpening = Number(payload.config.generalBankOpening ?? state.config.generalBankOpening);
    state.config.generalUtilityOpening = Number(payload.config.generalUtilityOpening ?? state.config.generalUtilityOpening);
    if (payload.config.monthlyOpenings !== undefined) {
      try {
        state.config.monthlyOpenings = typeof payload.config.monthlyOpenings === "string"
          ? JSON.parse(payload.config.monthlyOpenings)
          : payload.config.monthlyOpenings;
      } catch {
        state.config.monthlyOpenings = state.config.monthlyOpenings || {};
      }
    }
  }
  state = normalizeState(state);
}

async function loadFromApi() {
  if (!API_ENABLED || !apiToken || apiRefreshing) return;
  apiRefreshing = true;
  try {
    const payload = await apiFetch("/api/bootstrap");
    applyApiBootstrap(payload);
  } catch {
    clearApiSession();
    render();
  } finally {
    apiRefreshing = false;
  }
}

function replaceDateRange(list, items, from, to) {
  const incoming = items.map((item) => ({ ...item }));
  return dedupeById([
    ...list.filter((item) => item.date < from || item.date > to),
    ...incoming
  ]);
}

function replacePatientAppointments(list, items, patientId) {
  const incoming = items.map((item) => ({ ...item }));
  return dedupeById([
    ...list.filter((item) => String(item.patientId || "") !== String(patientId || "")),
    ...incoming
  ]);
}

function dedupeById(items) {
  const map = new Map();
  items.forEach((item) => {
    const key = item?.id || JSON.stringify(item);
    map.set(key, item);
  });
  return [...map.values()];
}

function queryRange(from, to) {
  const params = new URLSearchParams();
  params.set("from", from);
  params.set("to", to);
  return params.toString();
}

/* Antes, si ya habia una carga en vuelo la nueva se descartaba en silencio. Al
   cambiar la fecha de la agenda en ese momento justo, la peticion se perdia y
   nadie la reintentaba: la pantalla quedaba vacia por mas que se esperara. Las
   que nacen de una accion de la persona ahora hacen cola en vez de perderse. */
let colaDeRefresco = Promise.resolve();

function enFilaDeRefresco(tarea) {
  const turno = colaDeRefresco.then(tarea, tarea);
  colaDeRefresco = turno.then(() => {}, () => {});
  return turno;
}

async function refreshOperationalRangeApi(from, to, { rerender = true, esperarTurno = false } = {}) {
  if (!API_ENABLED || !apiToken || !from || !to) return;
  /* El refresco automatico es oportunista: si hay algo en vuelo se saltea, que
     para eso vuelve a correr solo a los pocos segundos. */
  if (!esperarTurno && apiRefreshing) return;
  return enFilaDeRefresco(() => cargarRangoOperativo(from, to, rerender));
}

async function cargarRangoOperativo(from, to, rerender) {
  apiRefreshing = true;
  try {
    const query = queryRange(from, to);
    const [appointmentsResult, paymentsResult, expensesResult] = await Promise.all([
      apiFetch(`/api/appointments?${query}`),
      apiFetch(`/api/payments?${query}`),
      apiFetch(`/api/expenses?${query}`)
    ]);
    if (Array.isArray(appointmentsResult.appointments)) {
      state.appointments = replaceDateRange(state.appointments, appointmentsResult.appointments.map(mapApiAppointment), from, to);
    }
    if (Array.isArray(paymentsResult.payments)) {
      state.payments = replaceDateRange(state.payments, paymentsResult.payments.map(mapApiPayment), from, to);
    }
    if (Array.isArray(expensesResult.expenses)) {
      state.expenses = replaceDateRange(state.expenses, expensesResult.expenses.map(mapApiExpense), from, to);
    }
    if (rerender) render();
  } finally {
    apiRefreshing = false;
  }
}

async function refreshRangeThenRender(from, to, renderFn = render) {
  if (!from || !to) return;
  try {
    /* Siempre sale de un cambio de filtro hecho a mano, asi que espera turno. */
    await refreshOperationalRangeApi(from, to, { rerender: false, esperarTurno: true });
    renderFn();
  } catch {
    // El refresco por rango es una mejora de velocidad; no debe bloquear la pantalla.
  }
}

async function refreshPatientAppointmentsApi(patientId) {
  if (!API_ENABLED || !apiToken || !patientId || patientAppointmentHistoryLoaded.has(patientId)) return;
  /* Esto sale de abrir las citas de un paciente. Si se descartaba por haber otra
     carga en vuelo, la ficha se quedaba mostrando que no tiene citas cuando en
     realidad no habian llegado todavia. */
  return enFilaDeRefresco(() => cargarCitasDePaciente(patientId));
}

async function cargarCitasDePaciente(patientId) {
  if (patientAppointmentHistoryLoaded.has(patientId)) return;
  apiRefreshing = true;
  try {
    const result = await apiFetch(`/api/appointments?patientId=${encodeURIComponent(patientId)}`);
    if (Array.isArray(result.appointments)) {
      state.appointments = replacePatientAppointments(state.appointments, result.appointments.map(mapApiAppointment), patientId);
      patientAppointmentHistoryLoaded.add(patientId);
      renderPatients();
    }
  } catch {
    // Si falla la carga puntual, se mantiene la informacion ya visible.
  } finally {
    apiRefreshing = false;
  }
}

function activeViewRefreshRange() {
  const today = todayISO();
  if (currentView === "agenda") {
    const date = $("#agendaDate")?.value || today;
    return { from: date, to: date };
  }
  if (currentView === "pagos") {
    const dates = cashOperationDates(cashViewDate()).sort();
    return { from: dates[0] || today, to: dates[dates.length - 1] || today };
  }
  if (currentView === "recordatorios") {
    return { from: today, to: addDaysISO(today, 2) };
  }
  if (currentView === "dashboard" || currentView === "panel") {
    return { from: today, to: today };
  }
  if (currentView === "caja-general" && selectedCashReportRange?.from && selectedCashReportRange?.to) {
    return { from: selectedCashReportRange.from, to: selectedCashReportRange.to };
  }
  if (currentView === "caja-general") {
    return { from: today, to: today };
  }
  if (currentView === "reportes") {
    const month = $("#reportMonth")?.value || today.slice(0, 7);
    const compareMonth = $("#compareMonth")?.value || previousMonth(month);
    return reportRefreshRange(month, compareMonth);
  }
  return null;
}

async function refreshCashStateApi({ rerender = true } = {}) {
  if (!API_ENABLED || !apiToken || apiCashRefreshing) return;
  apiCashRefreshing = true;
  try {
    const payload = await apiFetch("/api/cash-state");
    applyApiCashState(payload);
    if (rerender) render();
  } finally {
    apiCashRefreshing = false;
  }
}

/* porAccionDelUsuario distingue el refresco de fondo -que puede saltearse- de
   uno pedido a mano al cambiar de fecha o de vista, que no se puede perder. */
async function refreshActiveViewApi({ porAccionDelUsuario = false } = {}) {
  const range = activeViewRefreshRange();
  if (!range) return;
  const opciones = { rerender: false, esperarTurno: porAccionDelUsuario };
  try {
    if (currentView === "pagos") {
      await Promise.all([
        refreshOperationalRangeApi(range.from, range.to, opciones),
        refreshCashStateApi({ rerender: false })
      ]);
      renderPayments();
      return;
    }
    if (currentView === "caja-general") {
      await Promise.all([
        refreshOperationalRangeApi(range.from, range.to, opciones),
        refreshCashStateApi({ rerender: false })
      ]);
      renderGeneralCash();
      return;
    }
    await refreshOperationalRangeApi(range.from, range.to, { ...opciones, rerender: true });
  } catch {
    // El refresco liviano no debe cerrar sesion ni interrumpir el trabajo.
  }
}

/* Elegir una fecha o un filtro no es cargar informacion: son controles para
   mirar. Como quedan enfocados despues de usarlos, tratarlos como captura
   congelaba el refresco justo cuando mas falta hace -al cambiar la fecha de la
   agenda- y la pantalla no se actualizaba hasta tocar otra cosa. */
const FILTROS_DE_VISTA = new Set([
  "agendaDate", "doctorFilter", "unitFilter", "globalSearch",
  "reportMonth", "compareMonth",
  "cashTitleMonthPicker", "cashTitleFrom", "cashTitleTo",
  "generalSummaryFrom", "generalSummaryTo", "staffPaymentMonth"
]);

function focoEnCapturaDeDatos({ incluirSelect }) {
  const activo = document.activeElement;
  if (!activo) return false;
  if (FILTROS_DE_VISTA.has(activo.id)) return false;
  const etiquetas = incluirSelect ? ["INPUT", "TEXTAREA", "SELECT"] : ["INPUT", "TEXTAREA"];
  return etiquetas.includes(activo.tagName);
}

function shouldAutoRefreshApi() {
  if (!API_ENABLED || !apiToken) return false;
  if (document.hidden) return false;
  if ($("dialog[open]")) return false;
  return !focoEnCapturaDeDatos({ incluirSelect: true });
}

function shouldFastRefreshCriticalApi() {
  if (!API_ENABLED || !apiToken) return false;
  if (document.hidden) return false;
  if (!["pagos", "caja-general", "agenda"].includes(currentView)) return false;
  if ($("dialog[open]")) return false;
  return !focoEnCapturaDeDatos({ incluirSelect: false });
}

async function refreshPatientsThenRender() {
  try {
    await refreshPatientsApi();
    render();
  } catch {
    // Refresco liviano de pacientes; si falla se mantiene la lista ya cargada.
  }
}

function setupApiAutoRefresh() {
  if (!API_ENABLED) return;
  window.addEventListener("focus", () => {
    if (shouldAutoRefreshApi()) { refreshActiveViewApi(); refreshPatientsThenRender(); }
  });
  document.addEventListener("visibilitychange", () => {
    if (shouldAutoRefreshApi()) { refreshActiveViewApi(); refreshPatientsThenRender(); }
  });
  setInterval(() => {
    if (shouldAutoRefreshApi()) { refreshActiveViewApi(); refreshPatientsThenRender(); }
  }, 30000);
  setInterval(() => {
    if (shouldFastRefreshCriticalApi()) refreshActiveViewApi();
  }, 5000);
}

async function savePatientApi(patient) {
  if (!API_ENABLED || !apiToken) return;
  const payload = {
    id: patient.id,
    dni: patient.dni,
    name: patient.name,
    phone: patient.phone,
    birthDate: patient.birthDate || "",
    doctor: patient.doctor,
    mainTreatment: patient.mainTreatment,
    status: patient.status || "NUEVO",
    notes: patient.notes,
    hideFromReceptionNew: Boolean(patient.hideFromReceptionNew),
    presupuesto: patient.presupuesto || null,
    historiaHora: patient.historiaHora || "",
    address: patient.address || "",
    sexo: patient.sexo || "",
    birthPlace: patient.birthPlace || "",
    origin: patient.origin || "",
    education: patient.education || "",
    maritalStatus: patient.maritalStatus || "",
    occupation: patient.occupation || "",
    travels: patient.travels || "",
    emergencyContact: patient.emergencyContact || "",
    chiefComplaint: patient.chiefComplaint || "",
    companion: patient.companion || "",
    allergies: patient.allergies || "",
    medications: patient.medications || "",
    personalHistory: patient.personalHistory || "",
    familyHistory: patient.familyHistory || "",
    currentIllness: patient.currentIllness || "",
    illnessTime: patient.illnessTime || "",
    symptoms: patient.symptoms || "",
    anamnesis: patient.anamnesis || "",
    biologicalFunctions: patient.biologicalFunctions || "",
    guardianName: patient.guardianName || "",
    guardianDni: patient.guardianDni || "",
    guardianRelation: patient.guardianRelation || "",
    guardianPhone: patient.guardianPhone || "",
    guardianAddress: patient.guardianAddress || "",
  };
  const result = await apiFetch("/api/patients", { method: "POST", body: JSON.stringify(payload) });
  if (result.id) patient.id = result.id;
}

async function saveProformaApi(proforma) {
  if (!API_ENABLED || !apiToken) return;
  await apiFetch("/api/proformas", { method: "POST", body: JSON.stringify(proforma) });
}


async function saveConsentimientoApi(consentimiento) {
  if (!API_ENABLED || !apiToken) return;
  await apiFetch("/api/consentimientos", { method: "POST", body: JSON.stringify(consentimiento) });
}


async function deleteProformaApi(id, patientId) {
  if (!API_ENABLED || !apiToken) return;
  await apiFetch("/api/proformas", { method: "POST", body: JSON.stringify({ id, patientId, borrar: true }) });
}


async function refreshPatientsApi() {
  if (!API_ENABLED || !apiToken) return;
  const result = await apiFetch("/api/patients");
  if (Array.isArray(result.patients)) {
    state.patients = result.patients.map(mapApiPatient);
  }
}

async function deletePatientApi(id) {
  if (!API_ENABLED || !apiToken) return;
  await apiFetch("/api/patients", { method: "POST", body: JSON.stringify({ id, delete: true }) });
}

async function hideReceptionNewPatientApi(id) {
  if (!API_ENABLED || !apiToken) return;
  await apiFetch("/api/patients", { method: "POST", body: JSON.stringify({ id, hideReceptionNew: true }) });
}

async function saveAppointmentApi(appointment) {
  if (!API_ENABLED || !apiToken) return;
  const result = await apiFetch("/api/appointments", { method: "POST", body: JSON.stringify(appointment) });
  if (result.id) appointment.id = result.id;
}

async function deleteAppointmentApi(id) {
  if (!API_ENABLED || !apiToken) return;
  await apiFetch("/api/appointments", { method: "POST", body: JSON.stringify({ id, delete: true }) });
}

async function saveClinicalHistoryApi(entry) {
  if (!API_ENABLED || !apiToken) return;
  const result = await apiFetch("/api/clinical-history", { method: "POST", body: JSON.stringify(entry) });
  if (result.id) entry.id = result.id;
}

async function saveReceivableApi(entry, options = {}) {
  if (!API_ENABLED || !apiToken) return;
  const result = await apiFetch("/api/receivables", { method: "POST", body: JSON.stringify({ ...entry, ...options }) });
  if (result.id) entry.id = result.id;
}

async function saveTreatmentApi(treatment) {
  if (!API_ENABLED || !apiToken) return;
  const result = await apiFetch("/api/treatments", { method: "POST", body: JSON.stringify(treatment) });
  if (result.id) treatment.id = result.id;
}

async function saveOdontogramApi(record) {
  if (!API_ENABLED || !apiToken) return;
  const result = await apiFetch("/api/odontogram", { method: "POST", body: JSON.stringify(record) });
  if (result.id) record.id = result.id;
}

async function saveOdontogramSnapshotApi(copia) {
  if (!API_ENABLED || !apiToken) return;
  const result = await apiFetch("/api/odontogram-snapshots", { method: "POST", body: JSON.stringify(copia) });
  if (result.id) copia.id = result.id;
}

async function savePaymentApi(payment) {
  if (!API_ENABLED || !apiToken) return;
  const result = await apiFetch("/api/payments", { method: "POST", body: JSON.stringify(payment) });
  if (result.id) payment.id = result.id;
  applyInventoryApiPayload(result);
}

async function saveElectronicReceiptApi(receipt) {
  if (!API_ENABLED || !apiToken) return;
  const result = await apiFetch("/api/electronic-receipts", { method: "POST", body: JSON.stringify(receipt) });
  if (result.id) receipt.id = result.id;
  // con la facturacion encendida el correlativo lo asigna el servidor
  if (result.series) receipt.series = result.series;
  if (Number(result.number) > 0) receipt.number = Number(result.number);
}

async function refreshSunatStatus() {
  if (!API_ENABLED || !apiToken) return sunatStatus;
  try {
    const estado = await apiFetch("/api/sunat/estado");
    if (estado) sunatStatus = { ...sunatStatus, ...estado };
  } catch {
    // si no se puede preguntar, la pantalla sigue mostrando lo ultimo que supo
  }
  return sunatStatus;
}

async function refreshElectronicReceiptsApi() {
  if (!API_ENABLED || !apiToken) return;
  const payload = await apiFetch("/api/electronic-receipts");
  state.electronicReceipts = (payload.electronicReceipts || []).map(mapApiElectronicReceipt);
}

async function emitReceiptToSunatApi(id) {
  return apiFetch("/api/sunat/emitir", { method: "POST", body: JSON.stringify({ id }) });
}

async function sendSunatSummaryApi(fecha) {
  return apiFetch("/api/sunat/resumen", { method: "POST", body: JSON.stringify({ fecha }) });
}

async function checkSunatSummariesApi() {
  return apiFetch("/api/sunat/revisar", { method: "POST", body: JSON.stringify({}) });
}

async function deletePaymentApi(id) {
  if (!API_ENABLED || !apiToken) return;
  const result = await apiFetch("/api/payments", { method: "POST", body: JSON.stringify({ id, delete: true }) });
  applyInventoryApiPayload(result);
}

function applyInventoryApiPayload(result) {
  if (Array.isArray(result?.inventoryProducts)) state.inventoryProducts = result.inventoryProducts.map(mapApiInventoryProduct);
  if (Array.isArray(result?.inventoryMovements)) state.inventoryMovements = result.inventoryMovements.map(mapApiInventoryMovement);
}

async function saveInventoryProductApi(product) {
  if (!API_ENABLED || !apiToken) return;
  const result = await apiFetch("/api/inventory-products", { method: "POST", body: JSON.stringify(product) });
  if (result.id) product.id = result.id;
  applyInventoryApiPayload(result);
}

async function saveInventoryMovementApi(movement) {
  if (!API_ENABLED || !apiToken) return;
  const result = await apiFetch("/api/inventory-movements", { method: "POST", body: JSON.stringify(movement) });
  if (result.id) movement.id = result.id;
  applyInventoryApiPayload(result);
}

async function saveExpenseApi(expense) {
  if (!API_ENABLED || !apiToken) return;
  const result = await apiFetch("/api/expenses", { method: "POST", body: JSON.stringify(expense) });
  if (result.id) expense.id = result.id;
}

async function deleteExpenseApi(id) {
  if (!API_ENABLED || !apiToken) return;
  await apiFetch("/api/expenses", { method: "POST", body: JSON.stringify({ id, delete: true }) });
}

async function savePettyCashApi(date, amount) {
  if (!API_ENABLED || !apiToken) return;
  await apiFetch("/api/petty-cash", { method: "POST", body: JSON.stringify({ date, amount }) });
}

async function saveConfigApi(values) {
  if (!API_ENABLED || !apiToken || !Object.keys(values).length) return;
  await apiFetch("/api/config", { method: "POST", body: JSON.stringify(values) });
}

async function saveUserApi(user) {
  if (!API_ENABLED || !apiToken) return;
  const payload = {
    id: user.id,
    name: user.name,
    username: user.username,
    password: user.password,
    role: user.role,
    active: user.active
  };
  const result = await apiFetch("/api/users", { method: "POST", body: JSON.stringify(payload) });
  if (result.id) user.id = result.id;
}

async function resetOperationalApi() {
  if (!API_ENABLED || !apiToken) return;
  await apiFetch("/api/reset-operational", { method: "POST", body: JSON.stringify({}) });
}

async function openCashApi(session) {
  if (!API_ENABLED || !apiToken) return;
  const result = await apiFetch("/api/cash/open", { method: "POST", body: JSON.stringify(session) });
  if (result.id) session.id = result.id;
}

async function closeCashApi(payload) {
  if (!API_ENABLED || !apiToken) return null;
  return apiFetch("/api/cash/close", { method: "POST", body: JSON.stringify(payload) });
}

function blankStateFromCurrent() {
  return normalizeState({
    ...structuredClone(seedData),
    config: {
      ...state.config,
      generalCashOpening: 0,
      generalBankOpening: 0,
      generalUtilityOpening: 0
    },
    services: structuredClone(state.services.length ? state.services : seedData.services),
    users: structuredClone(state.users.length ? state.users : seedData.users),
    patients: [],
    appointments: [],
    treatments: [],
    payments: [],
    electronicReceipts: [],
    inventoryProducts: [],
    inventoryMovements: [],
    clinicalHistory: [],
    odontogram: [],
    odontogramSnapshots: [],
    proformas: [],
    consentimientos: [],
    listaDePrecios: [],
    cashSessions: [],
    dailyClosures: [],
    expenses: [],
    pettyCashAllocations: []
  });
}

function uid(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function appointmentId() {
  return `CI-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

function money(value) {
  return `S/ ${Number(value || 0).toLocaleString("es-PE", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

function todayISO() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDaysISO(date, days) {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  parsed.setDate(parsed.getDate() + days);
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function utcTodayISO() {
  return new Date().toISOString().slice(0, 10);
}

function activeOpenCashSession() {
  return state.cashSessions
    .filter((session) => !session.closedAt)
    .sort((a, b) => String(a.openedAt || "").localeCompare(String(b.openedAt || "")))[0];
}

function operatingDate() {
  const openSession = activeOpenCashSession();
  return openSession?.date || todayISO();
}

function cashOperationDates(date = operatingDate()) {
  const dates = [date];
  const realDate = todayISO();
  const utcDate = utcTodayISO();
  const hasOpenSession = state.cashSessions.some((session) => session.date === date && !session.closedAt);
  if (hasOpenSession && realDate !== date) dates.push(realDate);
  if (hasOpenSession && utcDate !== date) dates.push(utcDate);
  return [...new Set(dates)];
}

function formatDate(date) {
  if (!date) return "";
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" });
}

function reminderDateLabel(date) {
  if (!date) return "";
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("es-PE", { weekday: "long", day: "numeric", month: "long" });
}

function reminderTimeLabel(time) {
  if (!time) return "";
  const [hourText, minuteText = "00"] = String(time).split(":");
  const hour = Number(hourText);
  if (Number.isNaN(hour)) return time;
  const suffix = hour >= 12 ? "p. m." : "a. m.";
  const displayHour = hour % 12 || 12;
  return `${String(displayHour).padStart(2, "0")}:${minuteText.padStart(2, "0")} ${suffix}`;
}

function politeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Buenos días";
  if (hour < 19) return "Buenas tardes";
  return "Buenas noches";
}

function reminderClinicName(name) {
  return String(name || "CM Odontología Estética")
    .replace(/Odontologia/g, "Odontología")
    .replace(/Estetica/g, "Estética");
}

function friendlyName(name) {
  return String(name || "").toLowerCase().replace(/\b[\p{L}]/gu, (letter) => letter.toUpperCase());
}

function appointmentDayPhrase(date) {
  const target = new Date(`${date}T00:00:00`);
  const today = new Date(`${todayISO()}T00:00:00`);
  if (Number.isNaN(target.getTime())) return `el ${formatDate(date)}`;
  const diffDays = Math.round((target - today) / 86400000);
  const label = reminderDateLabel(date);
  return diffDays === 1 ? `mañana ${label}` : `el ${label}`;
}

function appointmentReminderMessage(appointment, patient) {
  const patientName = friendlyName(patient?.name || "");
  const clinicName = reminderClinicName(state.config.clinicName);
  const service = appointment.service || "su cita";
  const dayPhrase = appointmentDayPhrase(appointment.date);
  const hour = reminderTimeLabel(appointment.time);
  return `${politeGreeting()} *${patientName}*, te saludamos del consultorio odontológico *${clinicName}*, para hacerte recordar que ${dayPhrase} tienes ${service} a las ${hour}. Agradeceríamos tu confirmación por favor.`;
}

function ageFromBirthDate(birthDate, referenceDate = todayISO()) {
  if (!birthDate) return null;
  const birth = new Date(`${birthDate}T00:00:00`);
  const reference = new Date(`${referenceDate}T00:00:00`);
  if (Number.isNaN(birth.getTime()) || birth > reference) return null;
  let age = reference.getFullYear() - birth.getFullYear();
  const hadBirthday = reference.getMonth() > birth.getMonth() || (reference.getMonth() === birth.getMonth() && reference.getDate() >= birth.getDate());
  if (!hadBirthday) age -= 1;
  return age;
}

function patientAgeText(patient, referenceDate = todayISO()) {
  const age = ageFromBirthDate(patient?.birthDate, referenceDate);
  return age === null ? "" : `${age} años`;
}

function validISODate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ""))) return false;
  const parsed = new Date(`${value}T00:00:00`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function validatePatientData(data) {
  const errors = [];
  const dni = String(data.dni || "").trim();
  const phone = String(data.phone || "").trim();
  const name = String(data.name || "").trim().replace(/\s+/g, " ");
  const birthDate = String(data.birthDate || "").trim();
  if (!/^\d{8}$/.test(dni)) errors.push("El DNI debe tener exactamente 8 digitos.");
  if (!/^9\d{8}$/.test(phone)) errors.push("El celular debe tener 9 digitos y empezar con 9.");
  if (!name || name.split(" ").filter(Boolean).length < 2) errors.push("Ingresa nombres y apellidos completos del paciente.");
  if (!/^[A-ZÁÉÍÓÚÜÑ ]+$/i.test(name)) errors.push("El nombre solo debe contener letras y espacios.");
  if (!validISODate(birthDate)) errors.push("Ingresa una fecha de nacimiento valida.");
  else {
    const age = ageFromBirthDate(birthDate);
    if (age === null) errors.push("La fecha de nacimiento no puede ser futura.");
    else if (age > 120) errors.push("La fecha de nacimiento no parece correcta. Verifica el anio.");
  }
  return { errors, values: { dni, phone, name, birthDate } };
}

function patientAgeGroup(patient, referenceDate = todayISO()) {
  const age = ageFromBirthDate(patient?.birthDate, referenceDate);
  if (age === null) return "Sin fecha";
  if (age <= 12) return "Ninos 0-12";
  if (age <= 17) return "Adolescentes 13-17";
  if (age <= 29) return "Jovenes 18-29";
  if (age <= 59) return "Adultos 30-59";
  return "Adultos mayores 60+";
}

function patientById(id) {
  return state.patients.find((patient) => patient.id === id);
}

function serviceByName(name) {
  return state.services.find((service) => service.name === name);
}

function inventoryProductById(id) {
  return state.inventoryProducts.find((product) => product.id === id);
}

function activeInventoryProducts() {
  return state.inventoryProducts
    .filter((product) => product.active !== false)
    .slice()
    .sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""), "es"));
}

function paymentProductTotal() {
  return selectedProductSaleItems.reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.price || 0), 0);
}

function productSaleDescription(items = selectedProductSaleItems) {
  return items
    .filter((item) => Number(item.quantity || 0) > 0)
    .map((item) => `${Number(item.quantity || 0)} ${item.name}`)
    .join(", ");
}

function buildPaymentReceiptText(receipt, appointment, productItems = []) {
  const parts = [];
  const receiptText = String(receipt || "").trim();
  if (receiptText) parts.push(receiptText);
  else if (appointment) parts.push(`Cita del dia: ${appointment.service || "Servicio"}`);
  const products = productSaleDescription(productItems);
  if (products) parts.push(`Productos: ${products}`);
  return parts.join(" | ");
}

function treatmentById(id) {
  return state.treatments.find((treatment) => treatment.id === id);
}

function minutes(time) {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

function timeFromMinutes(total) {
  const hour = Math.floor(total / 60).toString().padStart(2, "0");
  const minute = (total % 60).toString().padStart(2, "0");
  return `${hour}:${minute}`;
}

function agendaTimeLabel(time) {
  const [hourText, minute] = time.split(":");
  const hour = Number(hourText);
  const displayHour = hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minute}`;
}

function agendaTimesForDay(date, start, end) {
  const interval = Number(state.config.interval || 30);
  const lunchStart = minutes(state.config.lunchStart || "13:00");
  const lunchEnd = minutes(state.config.lunchEnd || "15:00");
  const times = [];
  for (let cursor = start; cursor < end; cursor += interval) {
    const isLunch = cursor >= lunchStart && cursor < lunchEnd;
    if (!isLunch || cursor % 60 === 0) times.push(timeFromMinutes(cursor));
  }
  if (dayOfWeek(date) === 6 && end === lunchStart) {
    const closingTime = timeFromMinutes(end);
    if (!times.includes(closingTime)) times.push(closingTime);
  }
  state.appointments
    .filter((appointment) => appointment.date === date)
    .forEach((appointment) => {
      if (!times.includes(appointment.time)) times.push(appointment.time);
    });
  return times.sort((a, b) => minutes(a) - minutes(b));
}

function dayOfWeek(date) {
  return new Date(`${date}T00:00:00`).getDay();
}

function businessDayInfo(date) {
  const day = dayOfWeek(date);
  if (day === 0) return { open: false, start: null, end: null, message: "Domingo no laborable" };
  const start = minutes(state.config.start);
  const normalEnd = minutes(state.config.end);
  const end = day === 6 ? Math.min(normalEnd, minutes("13:00")) : normalEnd;
  return {
    open: start < end,
    start,
    end,
    message: day === 6 ? "Sabado: atencion hasta la 1:00 p.m." : ""
  };
}

function appointmentAvailabilityError(candidate) {
  const day = dayOfWeek(candidate.date);
  const info = businessDayInfo(candidate.date);
  if (!info.open) return "No hay atencion los domingos. Selecciona otra fecha.";
  const appointmentStart = minutes(candidate.time);
  const service = serviceByName(candidate.service);
  const appointmentEnd = appointmentStart + Number(candidate.duration || service?.duration || state.config.interval);
  const lunchStart = minutes(state.config.lunchStart);
  const lunchEnd = minutes(state.config.lunchEnd);
  if (day === 6) {
    if (appointmentStart < info.start || appointmentStart > info.end) {
      return info.message || `La atencion solo esta disponible de ${timeFromMinutes(info.start)} a ${timeFromMinutes(info.end)}.`;
    }
    return "";
  }
  if (appointmentStart < info.start || appointmentEnd > info.end) {
    return info.message || `La atencion solo esta disponible de ${timeFromMinutes(info.start)} a ${timeFromMinutes(info.end)}.`;
  }
  if (appointmentStart < lunchEnd && appointmentEnd > lunchStart) {
    return `No hay atencion de ${agendaTimeLabel(state.config.lunchStart)} a ${agendaTimeLabel(state.config.lunchEnd)} por horario de almuerzo.`;
  }
  return "";
}

function patientDebt(patientId) {
  const budget = state.treatments.filter((t) => t.patientId === patientId).reduce((sum, t) => sum + Number(t.budget || 0), 0);
  const historyDebt = state.clinicalHistory.filter((h) => h.patientId === patientId).reduce((sum, h) => sum + historyBalance(h.id), 0);
  const treatmentPaid = state.payments.filter((p) => p.patientId === patientId && !p.historyId && !isAgendaPayment(p)).reduce((sum, p) => sum + Number(p.amount || 0), 0);
  return Math.max(0, budget - treatmentPaid) + historyDebt;
}

function isAgendaPayment(payment) {
  return Boolean(payment?.appointmentId || String(payment?.receipt || "").startsWith("Cita del dia:"));
}

function historyById(id) {
  return state.clinicalHistory.find((entry) => entry.id === id);
}

function historyPaid(historyId) {
  return state.payments
    .filter((payment) => payment.historyId === historyId)
    // lo descontado del tratamiento tambien cubre la atencion, aunque no sea dinero
    .reduce((sum, payment) => sum + Math.max(0, Number(payment.amount || 0) - Number(payment.productAmount || 0)) + Number(payment.descontado || 0), 0);
}

function historyBalance(historyId) {
  const entry = historyById(historyId);
  if (!entry) return 0;
  return Math.max(0, Number(entry.agreedPrice || 0) - historyPaid(historyId));
}

/* Tratamiento con costo total. La nota clinica solo lo crea -plan y costo
   total- y el dinero se maneja en Pagos y caja, como una cuenta con dos
   movimientos:
   - Pagado: cobros con treatmentId que entran a caja con su boleta.
   - Usado: lo que recepcion descuenta en cada control. No es dinero que entra:
     se guarda como un movimiento de S/ 0 que lleva aparte lo descontado, asi
     ninguna suma de caja ni de reportes lo cuenta.
   Reemplaza a la pantalla Tratamientos, donde ningun pago podia asignarse y lo
   pagado siempre marcaba S/ 0. */
const DESCUENTO_TRATAMIENTO = "DESCUENTO_TRATAMIENTO";

function esDescuentoDeTratamiento(payment) {
  return payment?.tipo === DESCUENTO_TRATAMIENTO;
}

/* Una ficha que solo lleva una deuda de Cuentas por cobrar no es una atencion:
   la crea ese modulo con el motivo "Cuenta por cobrar" y nada clinico escrito. */
function esSoloDeuda(entry) {
  if (!entry) return false;
  const vacio = (valor) => !String(valor || "").trim();
  return String(entry.reason || "").trim() === "Cuenta por cobrar"
    && vacio(entry.anamnesis) && vacio(entry.exam) && vacio(entry.diagnosis)
    && vacio(entry.plan) && vacio(entry.procedure) && vacio(entry.instructions);
}

function esTratamiento(entry) {
  return Boolean(entry && !esSoloDeuda(entry) && String(entry.plan || "").trim() && Number(entry.planBudget || 0) > 0);
}

function avanceDelTratamiento(tratamiento) {
  const movimientos = state.payments.filter((payment) => payment.treatmentId && payment.treatmentId === tratamiento.id);
  const pagado = movimientos
    .filter((payment) => !esDescuentoDeTratamiento(payment))
    .reduce((suma, payment) => suma + Math.max(0, Number(payment.amount || 0) - Number(payment.productAmount || 0)), 0);
  const usado = movimientos
    .filter(esDescuentoDeTratamiento)
    .reduce((suma, payment) => suma + Number(payment.descontado || 0), 0);
  const presupuesto = Number(tratamiento.planBudget || 0);
  return {
    presupuesto,
    pagado,
    usado,
    porPagar: Math.max(0, presupuesto - pagado),
    disponible: Math.max(0, pagado - usado),
    terminado: presupuesto > 0 && usado >= presupuesto
  };
}

function tratamientosDelPaciente(patientId) {
  return state.clinicalHistory
    .filter((entry) => entry.patientId === patientId && esTratamiento(entry))
    .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")))
    .map((entry) => ({ entry, ...avanceDelTratamiento(entry) }));
}

function tratamientoPorId(id) {
  const entry = historyById(id);
  return esTratamiento(entry) ? { entry, ...avanceDelTratamiento(entry) } : null;
}

// el tratamiento mas reciente que todavia tiene dinero pagado sin usar
function tratamientoParaDescontar(patientId) {
  return tratamientosDelPaciente(patientId).find((t) => t.disponible > 0) || null;
}

function descripcionDelTratamiento(payment) {
  const entry = payment?.treatmentId ? historyById(payment.treatmentId) : null;
  return entry?.plan ? `Tratamiento de ${entry.plan}` : "";
}

function pendingHistories() {
  return state.clinicalHistory.filter((entry) => entry.attended && historyBalance(entry.id) > 0);
}

function pendingCashHistories() {
  return pendingHistories().filter((entry) => !entry.creditPending || entry.id === forcedPaymentHistoryId);
}

function receivableEntries() {
  return pendingHistories()
    .filter((entry) => entry.creditPending)
    .map((entry) => ({
      entry,
      patient: patientById(entry.patientId),
      balance: historyBalance(entry.id),
      dueDate: entry.creditDueDate || entry.date
    }))
    .sort((a, b) => `${a.dueDate} ${a.patient?.name || ""}`.localeCompare(`${b.dueDate} ${b.patient?.name || ""}`));
}

function pendingPatientIds() {
  return [...new Set(pendingCashHistories().map((entry) => entry.patientId))];
}

function pendingCashDebtForPatient(patientId) {
  return pendingCashHistories()
    .filter((entry) => entry.patientId === patientId)
    .reduce((sum, entry) => sum + historyBalance(entry.id), 0);
}

function pendingCashDebtTotal() {
  return pendingCashHistories().reduce((sum, entry) => sum + historyBalance(entry.id), 0);
}

function cashSessionToday() {
  return activeOpenCashSession();
}

function cashSessionsToday() {
  return state.cashSessions.filter((session) => session.date === operatingDate());
}

function cashViewDate() {
  return selectedCashViewDate || operatingDate();
}

function cashSessionForDate(date) {
  const active = activeOpenCashSession();
  if (active && active.date !== date) {
    return state.cashSessions
      .filter((session) => session.date === date && session.closedAt)
      .sort((a, b) => String(b.openedAt || "").localeCompare(String(a.openedAt || "")))[0];
  }
  return state.cashSessions
    .filter((session) => session.date === date)
    .sort((a, b) => String(b.openedAt || "").localeCompare(String(a.openedAt || "")))[0];
}

function pettyCashAllocation(date = todayISO()) {
  return state.pettyCashAllocations.find((item) => item.date === date);
}

function pettyCashAmount(date = todayISO()) {
  return Number(pettyCashAllocation(date)?.amount || 0);
}

function setPettyCashAllocation(date, amount) {
  const existing = pettyCashAllocation(date);
  if (existing) existing.amount = Number(amount || 0);
  else state.pettyCashAllocations.push({ id: uid("petty"), date, amount: Number(amount || 0) });
}

function pettyCashDeliveredTotal(month = null, fromDate = null) {
  const dates = [...new Set([
    ...state.pettyCashAllocations.map((item) => item.date),
    ...state.cashSessions.map((session) => session.date)
  ])].filter((date) => (!month || String(date || "").startsWith(month)) && (!fromDate || String(date || "") >= fromDate));
  return dates.reduce((sum, date) => sum + pettyCashDeliveredForDate(date), 0);
}

function pettyCashDeliveredForDate(date) {
  const session = state.cashSessions.filter((item) => item.date === date).slice(-1)[0];
  if (session?.closedAt) return 0;
  return Number(session?.openingCash ?? pettyCashAmount(date) ?? 0);
}

const paymentSplitFields = [
  { method: "EFECTIVO", key: "cashAmount", label: "Efectivo" },
  { method: "YAPE", key: "yapeAmount", label: "Yape" },
  { method: "PLIN", key: "plinAmount", label: "Plin" },
  { method: "TARJETA", key: "cardAmount", label: "Tarjeta" },
  { method: "TRANSFERENCIA", key: "transferAmount", label: "Transferencia" }
];

function cents(value) {
  return Math.round(Number(value || 0) * 100);
}

function paymentSplit(payment) {
  const amount = Number(payment.amount || 0);
  const split = paymentSplitFields.reduce((result, field) => {
    result[field.method] = Number(payment[field.key] || 0);
    return result;
  }, {});
  const explicitSplit = paymentSplitFields.some((field) => Number(payment[field.key] || 0) > 0);
  const method = String(payment.method || "").toUpperCase();
  if (explicitSplit || method === "MIXTO") return split;
  if (Object.prototype.hasOwnProperty.call(split, method)) split[method] = amount;
  return split;
}

function paymentAmountForMethods(payment, methods) {
  const split = paymentSplit(payment);
  return methods
    .map((method) => String(method || "").toUpperCase())
    .reduce((sum, method) => sum + Number(split[method] || 0), 0);
}

function paymentMethodLabel(payment) {
  const method = String(payment.method || "").toUpperCase();
  if (method !== "MIXTO") return payment.method || "";
  const split = paymentSplit(payment);
  const walletAmount = Number(split.YAPE || 0) + Number(split.PLIN || 0) + Number(split.TRANSFERENCIA || 0);
  const parts = [
    Number(split.EFECTIVO || 0) > 0 ? `Efectivo ${money(split.EFECTIVO)}` : "",
    walletAmount > 0 ? `Yape/Plin/Transf. ${money(walletAmount)}` : "",
    Number(split.TARJETA || 0) > 0 ? `Tarjeta ${money(split.TARJETA)}` : ""
  ].filter(Boolean);
  return parts.length ? `MIXTO (${parts.join(" + ")})` : "MIXTO";
}

function receiptFullNumber(receipt) {
  return `${receipt.series}-${Number(receipt.number || 0)}`;
}

function nextReceiptNumber(type) {
  const isInvoice = type === "FACTURA";
  const series = isInvoice ? state.config.receiptSeriesFactura : state.config.receiptSeriesBoleta;
  const start = Number(isInvoice ? state.config.receiptStartFactura : state.config.receiptStartBoleta) || 1;
  const used = state.electronicReceipts
    .filter((receipt) => receipt.type === type && receipt.series === series)
    .map((receipt) => Number(receipt.number || 0));
  return Math.max(start - 1, ...used) + 1;
}

function receiptSeriesForType(type) {
  return type === "FACTURA" ? state.config.receiptSeriesFactura : state.config.receiptSeriesBoleta;
}

function paymentCashPortion(payment) {
  const method = String(payment?.method || "").toUpperCase();
  if (method === "MIXTO") return Number(payment?.cashAmount || 0);
  return method === "EFECTIVO" ? Number(payment?.amount || 0) : 0;
}

function incomeForDate(date, method = null) {
  return state.payments
    .filter((payment) => payment.date === date)
    .reduce((sum, payment) => sum + (method ? paymentAmountForMethods(payment, [method]) : Number(payment.amount || 0)), 0);
}

function openIncomeForDate(date, method = null) {
  return openPaymentsForDate(date)
    .reduce((sum, payment) => sum + (method ? paymentAmountForMethods(payment, [method]) : Number(payment.amount || 0)), 0);
}

function todayIncome(method = null) {
  return openIncomeForDate(operatingDate(), method);
}

function incomeByMethodsForDate(date, methods) {
  return openPaymentsForDate(date)
    .reduce((sum, payment) => sum + paymentAmountForMethods(payment, methods), 0);
}

function todayIncomeByMethods(methods) {
  return incomeByMethodsForDate(operatingDate(), methods);
}

function expenseByMethodsForDate(date, methods) {
  const normalized = methods.map((method) => method.toUpperCase());
  return expensesForDate(date)
    .filter((expense) => expenseAffectsDaily(expense) && normalized.includes(String(expense.method || "").toUpperCase()))
    .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
}

function operationalExpenseByMethodsForDate(date, methods) {
  const normalized = methods.map((method) => method.toUpperCase());
  return expensesForDate(date)
    .filter((expense) =>
      expenseAffectsDaily(expense) &&
      normalized.includes(String(expense.method || "").toUpperCase())
    )
    .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
}

function generalCashExpenseByMethodsForDate(date, methods) {
  const normalized = methods.map((method) => method.toUpperCase());
  return expensesForDate(date)
    .filter((expense) =>
      isGeneralCashExpense(expense) &&
      normalized.includes(String(expense.method || "").toUpperCase())
    )
    .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
}

function totalExpenseByMethodsForDate(date, methods) {
  const normalized = methods.map((method) => method.toUpperCase());
  return expensesForDate(date)
    .filter((expense) => normalized.includes(String(expense.method || "").toUpperCase()))
    .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
}

function cashBoxDetailExpenseByMethodsForDate(date, methods) {
  const normalized = methods.map((method) => method.toUpperCase());
  return expensesForDate(date)
    .filter((expense) =>
      normalized.includes(String(expense.method || "").toUpperCase()) &&
      !isUtilityContribution(expense) &&
      !isUtilityPurchase(expense)
    )
    .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
}

function todayExpenseByMethods(methods) {
  return expenseByMethodsForDate(operatingDate(), methods);
}

function expensesForDate(date) {
  return state.expenses.filter((expense) => expense.date === date);
}

function openPaymentsForDate(date) {
  const dates = cashOperationDates(date);
  return state.payments.filter((payment) => dates.includes(payment.date) && !payment.closed);
}

function openExpensesForDate(date) {
  const dates = cashOperationDates(date);
  return state.expenses.filter((expense) => dates.includes(expense.date) && !expense.closed);
}

function paymentsForCashView(date) {
  const session = cashSessionForDate(date);
  if (session && !session.closedAt) return openPaymentsForDate(date);
  return state.payments.filter((payment) => payment.date === date);
}

function expensesForCashView(date) {
  const session = cashSessionForDate(date);
  if (session && !session.closedAt) return openExpensesForDate(date);
  return expensesForDate(date);
}

function visiblePaymentsForCashView(date) {
  const dates = cashOperationDates(date);
  return state.payments.filter((payment) => dates.includes(payment.date));
}

function visibleExpensesForCashView(date) {
  const dates = cashOperationDates(date);
  return state.expenses.filter((expense) => dates.includes(expense.date));
}

function visibleIncomeForCashView(date, method = null) {
  return visiblePaymentsForCashView(date)
    .reduce((sum, payment) => sum + (method ? paymentAmountForMethods(payment, [method]) : Number(payment.amount || 0)), 0);
}

function visibleIncomeByMethodsForCashView(date, methods) {
  return visiblePaymentsForCashView(date)
    .reduce((sum, payment) => sum + paymentAmountForMethods(payment, methods), 0);
}

function visibleExpenseByMethodsForCashView(date, methods) {
  const normalized = methods.map((method) => method.toUpperCase());
  return visibleExpensesForCashView(date)
    .filter((expense) => expenseAffectsDaily(expense) && normalized.includes(String(expense.method || "").toUpperCase()))
    .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
}

function visibleCashAffectingExpenseTotalForView(date) {
  return visibleExpensesForCashView(date)
    .filter((expense) => expenseAffectsDaily(expense))
    .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
}

function hasOnlyClosedVisibleCashMovements(date) {
  const pendingIncome = cents(incomeForCashView(date));
  const pendingExpenses = cents(cashAffectingExpenseTotalForView(date));
  const visibleIncome = cents(visibleIncomeForCashView(date));
  const visibleExpenses = cents(visibleCashAffectingExpenseTotalForView(date));
  return pendingIncome === 0 && pendingExpenses === 0 && (visibleIncome !== 0 || visibleExpenses !== 0);
}

function incomeForCashView(date, method = null) {
  return paymentsForCashView(date)
    .reduce((sum, payment) => sum + (method ? paymentAmountForMethods(payment, [method]) : Number(payment.amount || 0)), 0);
}

function incomeByMethodsForCashView(date, methods) {
  return paymentsForCashView(date)
    .reduce((sum, payment) => sum + paymentAmountForMethods(payment, methods), 0);
}

function expenseByMethodsForCashView(date, methods) {
  const normalized = methods.map((method) => method.toUpperCase());
  return expensesForCashView(date)
    .filter((expense) => expenseAffectsDaily(expense) && normalized.includes(String(expense.method || "").toUpperCase()))
    .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
}

function cashAffectingExpenseTotalForView(date) {
  return expensesForCashView(date)
    .filter((expense) => expenseAffectsDaily(expense))
    .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
}

function expenseAffectsDaily(expense) {
  return !["CAJA_GENERAL", "UTILIDAD"].includes(expense.source);
}

function isUtilityContribution(expense) {
  return expense.category === "UTILIDAD_APORTE";
}

function isUtilityPurchase(expense) {
  return expense.category === "UTILIDAD_COMPRA";
}

function isGeneralCashExpense(expense) {
  return expense.source === "CAJA_GENERAL" && !isUtilityContribution(expense) && !isUtilityPurchase(expense);
}

/* Egresos que ya tienen su propio sitio en Caja general: el aporte y la compra
   de utilidad, el pago al personal y la comision del POS. No salen del dinero
   del dia, y verlos en Pagos y caja hacia pensar que si -de ahi venia la
   sensacion de que la compra con la utilidad se restaba dos veces-.

   Un egreso suelto marcado como caja general si se queda: la lista del dia es
   el unico lugar donde se puede ver y borrar, y esconderlo seria perderlo. */
function expenseBelongsToGeneralCashView(expense) {
  return isUtilityContribution(expense)
    || isUtilityPurchase(expense)
    || isCardFee(expense)
    || expense.category === "PERSONAL_TERCERO";
}

/* El POS deposita la venta del dia siguiente ya descontada, y la comision no es
   fija. Como el dia ya cerro y no se puede corregir el cobro, la diferencia se
   cuadra al final del mes contra lo que realmente entro a la cuenta. */
function isCardFee(expense) {
  return expense.category === "COMISION_TARJETA";
}

function cardChargedForMonth(month) {
  if (!month) return 0;
  return state.payments
    .filter((payment) => String(payment.date || "").slice(0, 7) === month)
    .reduce((sum, payment) => sum + paymentAmountForMethods(payment, ["TARJETA"]), 0);
}

/* La comision se guarda con fecha del ultimo dia del mes que cuadra, asi que el
   mes sale de la propia fecha y no hace falta un campo aparte. */
function cardFeeMonth(expense) {
  return String(expense.date || "").slice(0, 7);
}

function cardFeesForMonth(month) {
  if (!month) return [];
  return state.expenses.filter((expense) => isCardFee(expense) && cardFeeMonth(expense) === month);
}

function cardFeeTotalForMonth(month) {
  return cardFeesForMonth(month).reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
}

function lastDayOfMonth(month) {
  const [year, monthNumber] = String(month || "").split("-").map(Number);
  if (!year || !monthNumber) return todayISO();
  const dia = new Date(year, monthNumber, 0).getDate();
  return `${year}-${String(monthNumber).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
}

/* Los saldos solo cuentan movimientos hasta hoy. Si se cuadra el mes en curso,
   fechar la comision el ultimo dia del mes la dejaria en el futuro y el saldo de
   tarjeta no bajaria, asi que en ese caso se fecha hoy. */
function cardFeeDateForMonth(month) {
  const ultimo = lastDayOfMonth(month);
  const hoy = todayISO();
  return ultimo > hoy ? hoy : ultimo;
}

function utilityContributionTotalForDate(date) {
  return expensesForDate(date)
    .filter(isUtilityContribution)
    .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
}

function utilityContributionByMethodsForDate(date, methods) {
  const normalized = methods.map((method) => method.toUpperCase());
  return expensesForDate(date)
    .filter((expense) => isUtilityContribution(expense) && normalized.includes(String(expense.method || "").toUpperCase()))
    .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
}

function dailyExpenseTotal(date, includeGeneral = false) {
  return expensesForDate(date)
    .filter((expense) => includeGeneral || expenseAffectsDaily(expense))
    .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
}

function dailyGeneralExpenseTotal(date) {
  return expensesForDate(date)
    .filter(isGeneralCashExpense)
    .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
}

function dailyCashAffectingExpenseTotal(date) {
  return openExpensesForDate(date)
    .filter((expense) => expenseAffectsDaily(expense))
    .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
}

function allDatesWithCashActivity() {
  return [...new Set([
    ...state.payments.map((payment) => payment.date),
    ...state.expenses.map((expense) => expense.date),
    ...state.pettyCashAllocations.map((item) => item.date),
    ...state.cashSessions.map((session) => session.date),
    ...state.dailyClosures.map((closure) => closure.date)
  ])].filter(Boolean).sort();
}

function lastAppointment(patientId) {
  return state.appointments
    .filter((appointment) => appointment.patientId === patientId && appointment.status === "ATENDIDA")
    .sort((a, b) => b.date.localeCompare(a.date))[0];
}

function hasUpcomingActiveAppointment(patientId) {
  const today = todayISO();
  const activeStatuses = new Set(["RESERVADA", "CONFIRMADA", "EN_ATENCION", "REPROGRAMADA"]);
  return state.appointments.some((appointment) => {
    if (appointment.patientId !== patientId || !appointment.date) return false;
    return appointment.date >= today && activeStatuses.has(String(appointment.status || "").toUpperCase());
  });
}

function appointmentSortKey(appointment) {
  return `${appointment.date || ""} ${appointment.time || ""}`;
}

function appointmentStatusText(status) {
  const labels = {
    RESERVADA: "Reservada",
    CONFIRMADA: "Confirmada",
    EN_ATENCION: "En atención",
    ATENDIDA: "Atendida",
    NO_ASISTIO: "No asistió",
    CANCELADA: "Cancelada",
    REPROGRAMADA: "Reprogramada"
  };
  const normalized = String(status || "").trim().toUpperCase();
  return labels[normalized] || normalized.replace(/_/g, " ") || "Reservada";
}

function appointmentAuditEvent(existingAppointment, appointment) {
  const status = String(appointment.status || "").trim().toUpperCase();
  const patient = patientById(appointment.patientId);
  const patientLabel = patient?.name || "Paciente";
  const dateText = `${appointment.date || ""} ${appointment.time || ""}`.trim();
  const notes = String(appointment.notes || "").trim().toLowerCase();
  if (!existingAppointment) {
    if (!["CANCELADA", "REPROGRAMADA", "NO_ASISTIO"].includes(status) && !notes.startsWith("reprogramada desde")) {
      return {
        action: "APPOINTMENT_CREATED",
        detail: `Agendo cita: ${patientLabel} ${dateText}`
      };
    }
    return null;
  }
  const previousStatus = String(existingAppointment.status || "").trim().toUpperCase();
  if (status !== previousStatus) {
    const statusEvents = {
      NO_ASISTIO: ["APPOINTMENT_NO_SHOW", "Marco no asistio"],
      CANCELADA: ["APPOINTMENT_CANCELLED", "Cancelo cita"],
      REPROGRAMADA: ["APPOINTMENT_RESCHEDULED", "Reprogramo cita"]
    };
    if (statusEvents[status]) {
      const [action, label] = statusEvents[status];
      return { action, detail: `${label}: ${patientLabel} ${dateText}` };
    }
  }
  if (
    !["CANCELADA", "REPROGRAMADA", "NO_ASISTIO"].includes(status) &&
    (existingAppointment.date !== appointment.date || existingAppointment.time !== appointment.time)
  ) {
    return {
      action: "APPOINTMENT_RESCHEDULED",
      detail: `Reprogramo cita: ${patientLabel} ${dateText}`
    };
  }
  return null;
}

function patientAppointmentSummary(patientId) {
  const appointments = state.appointments
    .filter((appointment) => String(appointment.patientId) === String(patientId))
    .slice()
    .sort((a, b) => appointmentSortKey(a).localeCompare(appointmentSortKey(b)));
  const next = appointments.find((appointment) => {
    const status = String(appointment.status || "").toUpperCase();
    return appointment.date >= todayISO() && !["ATENDIDA", "CANCELADA", "NO_ASISTIO"].includes(status);
  });
  if (next) {
    const status = String(next.status || "").toUpperCase();
    return {
      className: status === "REPROGRAMADA" ? "rescheduled" : "scheduled",
      title: status === "REPROGRAMADA" ? "Reprogramada" : "Citado",
      detail: `${formatDate(next.date)}${next.time ? ` | ${agendaTimeLabel(next.time)}` : ""}${next.unit ? ` | ${next.unit}` : ""} | ${appointmentStatusText(next.status)}`
    };
  }
  const last = appointments.slice().reverse()[0];
  if (last) {
    const status = String(last.status || "").toUpperCase();
    const detail = `Última: ${formatDate(last.date)}${last.time ? ` | ${agendaTimeLabel(last.time)}` : ""}`;
    if (status === "CANCELADA") return { className: "cancelled", title: "Cita cancelada", detail };
    if (status === "NO_ASISTIO") return { className: "missed", title: "No asistió", detail };
    if (status === "REPROGRAMADA") return { className: "rescheduled", title: "Reprogramada", detail };
  }
  return { className: "none", title: "No citado", detail: "Sin cita futura registrada" };
}

function renderPatientAppointmentSummary(patientId) {
  const summary = patientAppointmentSummary(patientId);
  return `<div class="patient-appointment patient-appointment-${summary.className}">
    <strong>${escapeHtml(summary.title)}</strong>
    <span>${escapeHtml(summary.detail)}</span>
  </div>`;
}

function appointmentDetailText(appointment) {
  return `${formatDate(appointment.date)}${appointment.time ? ` | ${agendaTimeLabel(appointment.time)}` : ""}${appointment.unit ? ` | ${appointment.unit}` : ""}${appointment.doctor ? ` | Dr(a). ${appointment.doctor}` : ""}`;
}

/* Reparte los pagos del paciente entre sus citas, cada pago en una sola.

   El que apunta a una cita va a esa. El que no apunta a ninguna -se cobro
   desde Pagos y caja y no desde la agenda- se le da a UNA cita del mismo dia:
   la ultima atendida, o la ultima del dia si ninguna se atendio. Repartirlo a
   todas las del dia seria lo facil, pero un dia con dos citas mostraria el
   mismo cobro dos veces y pareceria el doble de dinero.

   Los que no caen en ningun dia con cita -un adelanto, una cuota que se pago
   sin venir- se devuelven aparte para que salgan igual. Lo que se ve en el
   historial tiene que sumar lo mismo que Pagos y caja: la caja es la que dice
   cuanto entro de verdad, y un cobro que no aparece ahi es un cobro que
   alguien va a terminar buscando a mano. */
function pagosPorCita(patientId, appointments) {
  const porCita = new Map(appointments.map((cita) => [cita.id, []]));
  const porRepartir = [];
  for (const pago of state.payments) {
    if (String(pago.patientId || "") !== String(patientId)) continue;
    const idCita = String(pago.appointmentId || "");
    if (idCita) {
      if (porCita.has(idCita)) porCita.get(idCita).push(pago);
    } else {
      porRepartir.push(pago);
    }
  }
  const sueltos = [];
  for (const pago of porRepartir) {
    const delDia = appointments
      .filter((cita) => cita.date === pago.date)
      .sort((a, b) => appointmentSortKey(a).localeCompare(appointmentSortKey(b)));
    if (!delDia.length) {
      sueltos.push(pago);
      continue;
    }
    const atendidas = delDia.filter((cita) => String(cita.status || "").toUpperCase() === "ATENDIDA");
    const candidatas = atendidas.length ? atendidas : delDia;
    const elegida = candidatas[candidatas.length - 1];
    porCita.get(elegida.id).push(pago);
  }
  return { porCita, sueltos };
}


/* Lo cobrado, para la esquina derecha de la fila. Sin nada cobrado devuelve
   cadena vacia y no se muestra importe, que es distinto de mostrar S/ 0: una
   cita reservada todavia no tiene por que haber cobrado nada. */
function resumenDePagos(payments) {
  const total = payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  if (!payments.length || cents(total) === 0) return "";
  const methods = [...new Set(payments.map((payment) => String(payment.method || "").trim()).filter(Boolean))].join(", ");
  return methods ? `${money(total)} | ${methods}` : money(total);
}

function renderPatientAppointmentDetail(patientId) {
  const patient = patientById(patientId);
  const summary = patientAppointmentSummary(patientId);
  const appointments = state.appointments
    .filter((appointment) => String(appointment.patientId) === String(patientId))
    .slice()
    .sort((a, b) => appointmentSortKey(b).localeCompare(appointmentSortKey(a)));
  const { porCita, sueltos } = pagosPorCita(patientId, appointments);
  /* Lo que se le hizo ese dia, para guiarse sin abrir otra pantalla. Sale de
     donde de verdad esta escrito: primero la nota del cobro, y si el paciente
     se atendio sin pagar -queda en S/ 0, que pasa seguido- del motivo de
     consulta de su historia clinica de esa fecha. */
  const notaDelDia = (appointment, pagos) => {
    const deLosPagos = pagos.map((pago) => String(pago.receipt || "").trim()).filter(Boolean).join(" · ");
    if (deLosPagos) return deLosPagos;
    const historia = state.clinicalHistory.find((entrada) =>
      String(entrada.patientId) === String(patientId) && entrada.date === appointment.date);
    return String(historia?.reason || "").trim();
  };

  /* El numero de la boleta o factura que salio de ese cobro. Va en la linea de
     la fecha, al costado del doctor, aprovechando el sitio que ahi sobra: asi
     no se confunde con la nota ni le agrega una linea a la fila. */
  const comprobantesDe = (pagos) =>
    pagos.map((pago) => String(pago.comprobante || "").trim()).filter(Boolean).join(" · ");
  /* Citas y pagos sueltos van en una sola lista ordenada por fecha, para que
     el historial se lea de corrido y no haya que cruzar dos bloques. */
  const entradas = [
    ...appointments.map((appointment) => {
      const status = appointmentStatusText(appointment.status);
      const comment = appointment.notes || appointment.note || appointment.followUpComment || "";
      const pagos = porCita.get(appointment.id) || [];
      const paymentText = resumenDePagos(pagos);
      const nota = notaDelDia(appointment, pagos);
      const comprobantes = comprobantesDe(pagos);
      /* La nota va en el hueco que queda entre el estado y el importe, en una
         sola linea y en letra chica: la fila no crece de alto, y el texto
         completo se ve al pasar el mouse. */
      return {
        orden: appointmentSortKey(appointment),
        html: `<div class="patient-appointment-item">
      <div class="patient-appointment-item-head">
        <strong>${escapeHtml(status)}</strong>
        ${nota ? `<span class="patient-appointment-note" title="${escapeHtml(nota)}">${escapeHtml(nota)}</span>` : ""}
        ${paymentText ? `<strong class="patient-appointment-payment">${escapeHtml(paymentText)}</strong>` : ""}
      </div>
      <span class="patient-appointment-line"><span class="patient-appointment-when">${escapeHtml(appointmentDetailText(appointment))}</span>${comprobantes ? `<span class="patient-appointment-note" title="${escapeHtml(comprobantes)}">${escapeHtml(comprobantes)}</span>` : ""}</span>
      <span>${escapeHtml(appointment.service || patient?.mainTreatment || "Consulta")}</span>
      ${comment && comment !== nota ? `<span class="muted">${escapeHtml(comment)}</span>` : ""}
    </div>`
      };
    }),
    ...sueltos.map((pago) => ({
      // sin hora: cae junto a las citas de su dia, que no las hay
      orden: `${pago.date || ""} `,
      html: `<div class="patient-appointment-item">
      <div class="patient-appointment-item-head">
        <strong>Pago sin cita</strong>
        ${pago.comprobante ? `<span class="patient-appointment-note" title="${escapeHtml(pago.comprobante)}">${escapeHtml(pago.comprobante)}</span>` : ""}
        <strong class="patient-appointment-payment">${escapeHtml(resumenDePagos([pago]))}</strong>
      </div>
      <span>${escapeHtml(formatDate(pago.date))}</span>
      <span>${escapeHtml(pago.receipt || pago.concept || "Cobro registrado en caja")}</span>
    </div>`
    }))
  ].sort((a, b) => b.orden.localeCompare(a.orden));
  const list = entradas.map((entrada) => entrada.html).join("") || `<p class="muted">No tiene citas ni pagos registrados.</p>`;
  return `<div class="patient-appointment-panel patient-appointment-${summary.className}">
    <div class="patient-appointment-status">
      <strong>${escapeHtml(summary.title)}</strong>
      <span>${escapeHtml(summary.detail)}</span>
    </div>
    <div class="patient-appointment-grid">
      <span><strong>Paciente</strong>${escapeHtml(patient?.name || "-")}</span>
      <span><strong>DNI</strong>${escapeHtml(patient?.dni || "-")}</span>
      <span><strong>Celular</strong>${escapeHtml(patient?.phone || "-")}</span>
      <span><strong>Doctor</strong>${escapeHtml(patient?.doctor || "-")}</span>
    </div>
    <div class="patient-appointment-list">${list}</div>
  </div>`;
}

function daysSince(date) {
  if (!date) return null;
  const desde = new Date(`${String(date).slice(0, 10)}T00:00:00`);
  if (Number.isNaN(desde.getTime())) return null;
  return Math.floor((new Date(`${todayISO()}T00:00:00`) - desde) / 86400000);
}

const CLASE_ESTADO = {
  ACTIVO: "",
  NUEVO: "warn",
  "SIN CITA": "warn",
  "CONTROL VENCIDO": "danger",
  INACTIVO: "danger",
};
const TITULO_ESTADO = {
  "SIN CITA": "Se atendio pero no tiene proxima cita agendada",
  "CONTROL VENCIDO": "Su tratamiento necesita control periodico y ya paso la fecha",
  INACTIVO: "Sin venir desde hace mas del limite configurado",
};

/* Traduce el estado a lo que hay que hacer con ese paciente. En el CSV el
   estado solo dice como esta; esta columna dice que le falta, que es lo que
   recepcion necesita para trabajar la lista. */
function queLeFalta(patient, estado, dias) {
  if (patient.nextAppointment) return `Citado para ${formatDate(patient.nextAppointment)}`;
  if (estado === "CONTROL VENCIDO") return `Control vencido hace ${dias} dias, llamar`;
  if (estado === "SIN CITA") return "Falta agendarle la proxima cita";
  if (estado === "INACTIVO") {
    return dias === null
      ? "No ha venido nunca, va a promociones"
      : `No viene hace ${dias} dias, va a promociones`;
  }
  if (estado === "NUEVO") return "Registrado, todavia no viene";
  return "";
}

function patientStatus(patient) {
  if (!patient?.id) return patient?.status || "NUEVO";
  // el servidor lo calcula con todas las citas a la vista; aqui solo se muestra
  if (patient.estado) return patient.estado;
  const limite = Number(state.config.inactiveDays);

  /* Se usan la proxima cita y la ultima atencion que calcula el servidor. El
     navegador solo recibe las citas de los proximos dias, asi que por su
     cuenta no puede saberlo: un paciente con cita para dentro de dos semanas
     salia INACTIVO en la lista y solo se corregia al abrir sus citas, que es
     cuando el frontend las descarga. Si no vienen (modo local sin API), se
     recurre a lo que haya cargado en memoria. */
  const proxima = patient.nextAppointment || null;
  const atendida = patient.lastAttended || null;
  const tieneDatosDelServidor = "totalAppointments" in patient;

  if (proxima || (!tieneDatosDelServidor && hasUpcomingActiveAppointment(patient.id))) return "ACTIVO";

  const ultima = atendida || (tieneDatosDelServidor ? null : lastAppointment(patient.id)?.date);
  if (!ultima) {
    // Nunca se atendio. Antes se quedaba como NUEVO para siempre, aunque
    // llevara meses registrado sin venir, y esos pacientes no aparecian en
    // ninguna lista para llamarlos.
    const desdeRegistro = daysSince(patient.createdAt);
    if (desdeRegistro !== null && desdeRegistro > limite) return "INACTIVO";
    return patient.status || "NUEVO";
  }
  const diff = daysSince(ultima);
  return diff !== null && diff > limite ? "INACTIVO" : "ACTIVO";
}

/* ---- Pacientes que hay que llamar --------------------------------------
   El estado activo/inactivo no basta para saber a quien llamar: un paciente
   atendido hace dos semanas sin proxima cita figura como ACTIVO y no aparece
   en ninguna lista, justo cuando todavia es facil recuperarlo. Aqui se separa
   el motivo concreto de cada caso.

   Los tratamientos con control periodico (ortodoncia) tienen su propio plazo:
   esperar el mes general es demasiado para un paciente con brackets. */
/* ---- Seguimiento de pacientes ------------------------------------------
   Las dos listas (a quien llamar y a quien reactivar con una promocion) las
   calcula el servidor en /api/patients-to-call. No se hacen aqui porque el
   navegador solo recibe las citas de los proximos dias: sin el historial
   completo, un paciente atendido hace tres meses parecia no haber venido
   nunca. */

/* La utilidad no es dinero fisico: vive en una cuenta. Pasar dinero a utilidad
   puede salir de cualquier bolsa -de ahi se descuenta, asi que el metodo importa
   y estan todos-, pero una compra hecha con la utilidad se paga desde esa
   cuenta, nunca con billetes. Ofrecer EFECTIVO ahi solo servia para elegirlo por
   error, que es como quedaron registradas las compras de agosto. */
const METODOS_DE_COMPRA_CON_UTILIDAD = ["YAPE", "PLIN", "TRANSFERENCIA"];

function utilityMethodOptions() {
  const tipo = $('#utilityForm select[name="type"]')?.value || "APORTE";
  if (tipo !== "COMPRA") return state.config.paymentMethods;
  return state.config.paymentMethods
    .filter((metodo) => METODOS_DE_COMPRA_CON_UTILIDAD.includes(String(metodo).toUpperCase()));
}

function fillSelect(select, options, selected = "") {
  if (!select) return;
  const cleanOptions = options.map((option) => String(option ?? "").trim()).filter(Boolean);
  select.innerHTML = cleanOptions.map((option) => `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`).join("");
  if (selected && cleanOptions.includes(selected)) select.value = selected;
  else if (cleanOptions.length) select.value = cleanOptions[0];
}

function fillPatientSelect(select, selected = "", includeBlank = false) {
  if (!select) return;
  const blankOption = includeBlank ? `<option value="">Selecciona paciente</option>` : "";
  select.innerHTML = blankOption + state.patients
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((patient) => `<option value="${patient.id}">${escapeHtml(patient.name)} - ${escapeHtml(patient.dni)}</option>`)
    .join("");
  if (selected && state.patients.some((patient) => patient.id === selected)) select.value = selected;
  else if (includeBlank) select.value = "";
  else if (state.patients[0]) select.value = state.patients[0].id;
}

function fillPaymentPatientSelect(select, selected = "") {
  if (!select) return;
  // tambien entra quien solo tiene un tratamiento por pagar, sin deuda de notas
  const porPagarDe = (patientId) => tratamientosDelPaciente(patientId).reduce((suma, t) => suma + t.porPagar, 0);
  const conTratamiento = [...new Set(state.clinicalHistory.filter(esTratamiento).map((entry) => entry.patientId))]
    .filter((patientId) => porPagarDe(patientId) > 0);
  const ids = [...new Set([...pendingPatientIds(), ...conTratamiento])];
  const patients = state.patients
    .filter((patient) => ids.includes(patient.id))
    .sort((a, b) => a.name.localeCompare(b.name));
  const debtOptions = patients.map((patient) => {
    const deuda = pendingCashDebtForPatient(patient.id);
    const detalle = deuda > 0 ? `deuda ${money(deuda)}` : `tratamiento por pagar ${money(porPagarDe(patient.id))}`;
    return `<option value="${patient.id}">${escapeHtml(patient.name)} - ${detalle}</option>`;
  });
  const agendaOptions = agendaPaymentAppointments()
    .map((appointment) => {
      const patient = patientById(appointment.patientId);
      return `<option value="appt:${escapeHtml(appointment.id)}">${agendaTimeLabel(appointment.time)} - ${escapeHtml(patient?.name || "Paciente")} - ${escapeHtml(appointment.service || "")}</option>`;
    });
  const usedIds = new Set([...patients.map((patient) => patient.id), ...agendaPaymentAppointments().map((appointment) => appointment.patientId)]);
  const selectedPatient = selected && !String(selected).startsWith("appt:") ? patientById(selected) : null;
  const selectedOption = selectedPatient && !usedIds.has(selectedPatient.id)
    ? `<option value="${selectedPatient.id}">${escapeHtml(selectedPatient.name)} - ${escapeHtml(selectedPatient.dni || "")}</option>`
    : "";
  const groups = [];
  if (selectedOption) groups.push(`<optgroup label="Paciente seleccionado">${selectedOption}</optgroup>`);
  if (debtOptions.length) groups.push(`<optgroup label="Atenciones pendientes">${debtOptions.join("")}</optgroup>`);
  if (agendaOptions.length) groups.push(`<optgroup label="Citas del dia">${agendaOptions.join("")}</optgroup>`);
  select.innerHTML = groups.length ? groups.join("") : `<option value="">Sin pacientes pendientes</option>`;
  if (selected && paymentSelectionExists(selected)) select.value = selected;
  else if (patients[0]) select.value = patients[0].id;
  else if (agendaOptions.length) select.value = agendaPaymentAppointments()[0]?.id ? `appt:${agendaPaymentAppointments()[0].id}` : "";
  else select.value = "";
}

function agendaPaymentAppointments() {
  if (state.config.enableAgendaPayments === false) return [];
  const date = operatingDate();
  const seen = new Set();
  return state.appointments
    .filter((appointment) => {
      const status = String(appointment.status || "").toUpperCase();
      return appointment.date === date
        && !["CANCELADA", "NO_ASISTIO", "REPROGRAMADA", "ATENDIDA"].includes(status)
        && !appointmentHasRegisteredPayment(appointment);
    })
    .filter((appointment) => {
      const key = [
        appointment.patientId || "",
        appointment.date || "",
        appointment.time || "",
        appointment.unit || "",
        appointment.service || ""
      ].join("|");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => `${a.time || ""} ${patientById(a.patientId)?.name || ""}`.localeCompare(`${b.time || ""} ${patientById(b.patientId)?.name || ""}`));
}

function appointmentHasRegisteredPayment(appointment) {
  if (!appointment) return false;
  const patientDateAppointments = state.appointments.filter((item) => (
    String(item.patientId || "") === String(appointment.patientId || "")
    && item.date === appointment.date
  )).length;
  return state.payments.some((payment) => {
    /* Un descuento del tratamiento no cobra la cita: si la cubre entera ya la
       dejo ATENDIDA, y si no la cubre la cita debe seguir en la lista para
       cobrar el resto como pago normal. */
    if (esDescuentoDeTratamiento(payment)) return false;
    if (String(payment.appointmentId || "") === String(appointment.id || "")) return true;
    if (payment.appointmentId) return false;
    return patientDateAppointments === 1
      && String(payment.patientId || "") === String(appointment.patientId || "")
      && payment.date === appointment.date
      && isAgendaPayment(payment);
  });
}

function appointmentFromPaymentSelection(value) {
  const id = String(value || "").startsWith("appt:") ? String(value).slice(5) : "";
  return id ? state.appointments.find((appointment) => appointment.id === id) : null;
}

function patientIdFromPaymentSelection(value) {
  const appointment = appointmentFromPaymentSelection(value);
  return appointment?.patientId || value || "";
}

function paymentSelectionExists(value) {
  if (!value) return false;
  if (appointmentFromPaymentSelection(value)) return true;
  return state.patients.some((patient) => patient.id === value);
}

function fillAppointmentPatientSelectForDate(select, date, selected = "") {
  if (!select) return;
  const historyCountByPatient = state.clinicalHistory
    // una ficha que solo lleva una deuda no es una atencion: no quita al
    // paciente de la lista, o la doctora no podria escribirle su nota
    .filter((entry) => entry.date === date && entry.attended && !esSoloDeuda(entry) && entry.id !== $("#historyForm")?.id?.value)
    .reduce((map, entry) => {
      map[entry.patientId] = (map[entry.patientId] || 0) + 1;
      return map;
    }, {});
  const appointmentCountByPatient = state.appointments
    .filter((appointment) => appointment.date === date && isSlotBlockingAppointment(appointment))
    .reduce((map, appointment) => {
      map[appointment.patientId] = (map[appointment.patientId] || 0) + 1;
      return map;
    }, {});
  const ids = Object.entries(appointmentCountByPatient)
    .filter(([patientId, count]) => Number(count) > Number(historyCountByPatient[patientId] || 0))
    .map(([patientId]) => patientId);
  const patients = state.patients
    .filter((patient) => ids.includes(patient.id))
    .sort((a, b) => a.name.localeCompare(b.name));
  select.innerHTML = patients.length
    ? patients.map((patient) => `<option value="${patient.id}">${escapeHtml(patient.name)} - ${escapeHtml(patient.dni)}</option>`).join("")
    : `<option value="">Sin pacientes pendientes de atencion en esta fecha</option>`;
  if (selected && patients.some((patient) => patient.id === selected)) select.value = selected;
  else if (patients[0]) select.value = patients[0].id;
  syncAssignedDoctor();
}

/* La cita "abierta" del paciente en una fecha: se dejan fuera las canceladas,
   las reprogramadas, las que no asistieron y las ya atendidas. Con hasta, solo
   las que ya empezaron o empiezan antes de esa hora. */
function citaAbiertaDelPaciente(patientId, date, hasta = "") {
  if (!patientId || !date) return null;
  return state.appointments
    .filter((appointment) => {
      if (appointment.patientId !== patientId || appointment.date !== date) return false;
      const status = String(appointment.status || "").toUpperCase();
      if (["CANCELADA", "NO_ASISTIO", "REPROGRAMADA", "ATENDIDA"].includes(status)) return false;
      return !hasta || String(appointment.time || "") <= hasta;
    })
    .sort((a, b) => String(a.time || "").localeCompare(String(b.time || "")))[0] || null;
}

/* La cita que se pone en verde al guardar una nota clinica. Antes el servidor
   marcaba todas las citas del paciente ese dia: una cancelada volvia como
   atendida. Cada nota del dia explica una cita atendida; si ya hay tantas
   verdes como notas no se toca nada -asi editar una nota vieja no marca otra-.
   Si falta, la primera cita abierta que ya empezo o empieza dentro de la hora
   (el paciente que llega temprano); la de la tarde no se marca por la nota de
   la manana. */
function citaParaLaNota(patientId, date, notaId = "") {
  const hoy = todayISO();
  if (!patientId || !date || date > hoy) return null;
  const atendidas = state.appointments.filter((cita) =>
    cita.patientId === patientId && cita.date === date &&
    String(cita.status || "").toUpperCase() === "ATENDIDA").length;
  // la nota que se guarda cuenta aunque todavia no este en la lista
  const notas = state.clinicalHistory.filter((entry) =>
    entry.patientId === patientId && entry.date === date && entry.attended &&
    !esSoloDeuda(entry) && entry.id !== notaId).length + 1;
  if (atendidas >= notas) return null;
  const hasta = date === hoy ? timeFromMinutes(minutes(new Date().toTimeString().slice(0, 5)) + 60) : "";
  return citaAbiertaDelPaciente(patientId, date, hasta);
}

/* La fecha de atencion que se propone al anotar una deuda: la cita mas
   reciente del paciente hasta hoy, mirando una semana atras. Cubre al que se
   atendio ayer y recien hoy se recuerda que debia; mas atras se propone hoy,
   para no colgar una deuda nueva de una atencion de hace un mes. Se puede
   cambiar a mano. */
function fechaDeAtencionSugerida(patientId) {
  const hoy = todayISO();
  const desde = addDaysISO(hoy, -7);
  const fechas = state.appointments
    .filter((appointment) => {
      if (String(appointment.patientId) !== String(patientId)) return false;
      if (appointment.date > hoy || appointment.date < desde) return false;
      const status = String(appointment.status || "").toUpperCase();
      return !["CANCELADA", "NO_ASISTIO", "REPROGRAMADA"].includes(status);
    })
    .map((appointment) => appointment.date)
    .sort();
  return fechas.length ? fechas[fechas.length - 1] : hoy;
}

/* La cita que se pone en verde al anotar la deuda de quien se atendio. Con las
   reglas del cobro: si ese dia ya tiene una cita atendida no se toca nada -el
   que se atendio ayer en S/ 0 y hoy se le anota lo que debe-, una cita que
   todavia no empieza no se da por atendida, y una fecha futura nunca. */
function citaParaLaDeuda(patientId, date) {
  const hoy = todayISO();
  if (!patientId || !date || date > hoy) return null;
  const yaAtendida = state.appointments.some((appointment) =>
    String(appointment.patientId) === String(patientId) && appointment.date === date &&
    String(appointment.status || "").toUpperCase() === "ATENDIDA");
  if (yaAtendida) return null;
  return citaAbiertaDelPaciente(patientId, date, date === hoy ? new Date().toTimeString().slice(0, 5) : "");
}

/* Aviso, nada mas: si el paciente elegido ya tiene una cuenta por cobrar ese
   dia, se le recuerda a quien escribe la nota. La deuda ya lleva el monto; si
   en la nota se vuelve a poner, el paciente quedaria debiendo dos veces. */
/* El aviso sale solo cuando el cobro doble esta por ocurrir: el paciente ya
   tiene una cuenta por cobrar de ese mismo dia y ademas se escribio un cobro en
   la nota. Antes aparecia apenas se elegia al paciente y estorbaba todo el
   rato. La nota que se esta corrigiendo no se avisa a si misma. */
function avisoDeDeudaDelDia() {
  const form = $("#historyForm");
  const aviso = $("#historyDebtNotice");
  if (!form || !aviso) return;
  const patientId = form.elements.namedItem("patientId")?.value || "";
  const date = form.elements.namedItem("date")?.value || "";
  const cobro = Number(form.elements.namedItem("agreedPrice")?.value || 0);
  const editando = form.elements.namedItem("id")?.value || "";
  const deudas = state.clinicalHistory.filter((entry) =>
    entry.patientId === patientId && entry.date === date && entry.id !== editando && esSoloDeuda(entry));
  const total = deudas.reduce((suma, entry) => suma + Number(entry.agreedPrice || 0), 0);
  const choca = Boolean(deudas.length) && cobro > 0;
  aviso.hidden = !choca;
  aviso.textContent = choca
    ? `Ojo: este paciente ya tiene una cuenta por cobrar de ${money(total)} de hoy. Si este cobro es el mismo, deja «Cobro de hoy» en S/ 0: la deuda ya lleva el monto.`
    : "";
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
}

const roleLabels = {
  ADMIN: "Administrador",
  DOCTOR: "Doctor",
  DOCTOR_TRABAJADOR: "Doctor trabajador",
  RECEPCION: "Recepcion"
};

const roleViews = {
  ADMIN: ["dashboard", "pacientes", "agenda", "historial", "odontograma", "inventario", "pagos", "comprobantes", "caja-general", "cuentas-cobrar", "seguimiento-citas", "panel", "recordatorios", "reportes", "campanas", "configuracion"],
  DOCTOR: ["dashboard", "pacientes", "agenda", "historial", "odontograma", "inventario", "pagos", "caja-general", "cuentas-cobrar", "seguimiento-citas", "panel", "recordatorios", "reportes", "campanas"],
  DOCTOR_TRABAJADOR: ["dashboard", "pacientes", "agenda", "historial", "odontograma", "inventario", "pagos", "cuentas-cobrar", "seguimiento-citas", "panel", "recordatorios"],
  RECEPCION: ["dashboard", "pacientes", "agenda", "inventario", "pagos", "comprobantes", "cuentas-cobrar", "seguimiento-citas", "panel", "recordatorios"]
};

function currentUser() {
  if (API_ENABLED) return apiUser;
  return state.users.find((user) => user.id === currentUserId && user.active);
}

function hasRoleView(view) {
  const user = currentUser();
  return Boolean(user && (roleViews[user.role] || []).includes(view));
}

function isAdmin() {
  return currentUser()?.role === "ADMIN";
}

function addLocalAuditEvent(action, detail, patientId = "") {
  if (API_ENABLED) return;
  const user = currentUser();
  state.auditEvents = state.auditEvents.filter((event) => event.eventDate === todayISO());
  state.auditEvents.unshift({
    id: uid("audit"),
    eventDate: todayISO(),
    action,
    detail,
    patientId,
    userId: user?.id || "",
    userName: user?.name || "Usuario",
    userRole: user?.role || "",
    createdAt: new Date().toISOString()
  });
}

function canManageAppointments() {
  return ["ADMIN", "DOCTOR", "DOCTOR_TRABAJADOR", "RECEPCION"].includes(currentUser()?.role);
}

function canManageClinical() {
  return ["ADMIN", "DOCTOR", "DOCTOR_TRABAJADOR"].includes(currentUser()?.role);
}

function canEditReceivableAmount() {
  return ["ADMIN", "DOCTOR"].includes(currentUser()?.role);
}

function canManagePayments() {
  return ["ADMIN", "DOCTOR", "DOCTOR_TRABAJADOR", "RECEPCION"].includes(currentUser()?.role);
}

function canManageExpenses() {
  return ["ADMIN", "DOCTOR_TRABAJADOR", "RECEPCION"].includes(currentUser()?.role);
}

function canManageCash() {
  return ["ADMIN", "DOCTOR_TRABAJADOR", "RECEPCION"].includes(currentUser()?.role);
}

function canManageInventory() {
  return ["ADMIN", "DOCTOR", "DOCTOR_TRABAJADOR", "RECEPCION"].includes(currentUser()?.role);
}

function canCreatePatients() {
  return ["ADMIN", "DOCTOR", "DOCTOR_TRABAJADOR", "RECEPCION"].includes(currentUser()?.role);
}

function canDeletePatients() {
  return ["ADMIN", "DOCTOR"].includes(currentUser()?.role);
}

function applyAuthState() {
  const user = currentUser();
  document.body.classList.toggle("locked", !user);
  if (!user) return;
  $("#sessionUser").textContent = user.name;
  $("#sessionRole").textContent = roleLabels[user.role] || user.role;
  $$(".nav-item").forEach((button) => {
    button.hidden = !hasRoleView(button.dataset.view);
  });
  const quickAppointmentBtn = $("#quickAppointmentBtn");
  if (quickAppointmentBtn) {
    quickAppointmentBtn.hidden = currentView === "cuentas-cobrar" ? false : !canManageAppointments();
    quickAppointmentBtn.textContent = currentView === "cuentas-cobrar" ? "Buscar" : "Nueva cita";
  }
  const patientTopActions = $("#patientTopActions");
  if (patientTopActions) patientTopActions.hidden = currentView !== "pacientes";
  const agendaAppointmentBtn = $("#newAppointmentBtn");
  if (agendaAppointmentBtn) agendaAppointmentBtn.hidden = !canManageAppointments();
  const quickPatientBtn = $("#quickPatientBtn");
  if (quickPatientBtn) quickPatientBtn.hidden = !canCreatePatients();
  $("#backupBtn").hidden = !isAdmin();
  $(".file-label").hidden = !isAdmin();
  const userAdminPanel = $("#userAdminPanel");
  if (userAdminPanel) userAdminPanel.hidden = !isAdmin();
  const openExpenseBtn = $("#openExpenseBtn");
  if (openExpenseBtn) openExpenseBtn.hidden = !canManageExpenses();
  if (!hasRoleView(currentView)) setView((roleViews[user.role] || ["dashboard"])[0]);
}

/* La cabecera sube con la pagina, como cualquier otra cosa. Lo que se apunta
   aqui no es cuanto mide, sino cuanto de ella sigue viendose: es desde ahi
   donde empieza el menu, para no montarsele encima mientras el logo este a la
   vista y para pegarse arriba en cuanto se haya ido. */
function medirCabecera() {
  const cabecera = document.querySelector(".topbar");
  const visible = cabecera ? Math.max(0, Math.round(cabecera.getBoundingClientRect().bottom)) : 0;
  document.documentElement.style.setProperty("--alto-cabecera", `${visible}px`);
}

window.addEventListener("resize", medirCabecera);
window.addEventListener("scroll", medirCabecera, { passive: true });


function setView(view) {
  if (!hasRoleView(view)) view = (roleViews[currentUser()?.role] || ["dashboard"])[0];
  currentView = view;
  if (view === "historial") {
    const historyDate = $('#historyForm input[name="date"]');
    const agendaDate = $("#agendaDate");
    if (historyDate && agendaDate?.value) historyDate.value = agendaDate.value;
  }
  $$(".view").forEach((element) => element.classList.toggle("active", element.id === view));
  $$(".nav-item").forEach((button) => button.classList.toggle("active", button.dataset.view === view));
  /* Registrar paciente es la ficha mas larga del sistema: ahi el menu se va a
     la izquierda para que la ficha se lleve el ancho entero, y sus campos se
     reparten en dos columnas. El menu vuelve por el borde izquierdo y se queda
     hasta que se entre otra vez aqui. En los demas modulos, todo normal. */
  const enRegistro = view === "pacientes";
  // el menu arranca donde termine la cabecera, y eso cambia al cambiar de vista
  setTimeout(medirCabecera, 0);
  document.body.classList.toggle("ficha-en-dos-columnas", enRegistro);
  document.body.classList.toggle("sin-menu", enRegistro);
  if (enRegistro) document.body.classList.remove("menu-a-la-vista");
  $("#viewTitle").textContent = {
    dashboard: "Dashboard",
    agenda: "Agenda diaria",
    pacientes: "Registrar paciente",
    historial: "Historial clínico dental",
    odontograma: "Odontograma",
    inventario: "Inventario",
    pagos: "Pagos y caja",
    comprobantes: "Comprobantes electrónicos",
    "caja-general": "Caja general",
    "cuentas-cobrar": "Cuentas por cobrar",
    panel: "Panel para doctores y recepción",
    recordatorios: "Recordatorios de citas",
    reportes: "Reportes diarios y mensuales",
    campanas: "Campañas",
    configuracion: "Configuración"
  }[view];
  const cashPeriodButton = $("#openCashPeriodBtn");
  if (cashPeriodButton) cashPeriodButton.hidden = view !== "caja-general";
  const cashRangeControls = $("#cashTitleRangeControls");
  if (cashRangeControls) cashRangeControls.hidden = view !== "caja-general";
  render();
  refreshActiveViewApi({ porAccionDelUsuario: true });
}

function render() {
  state = normalizeState(state);
  applyAuthState();
  if (!currentUser()) return;
  const todayLabel = $("#todayLabel");
  if (todayLabel) todayLabel.textContent = `${state.config.clinicName} | ${formatDate(todayISO())}`;
  hydrateForms();
  renderActiveView();
}

function renderActiveView() {
  switch (currentView) {
    case "dashboard":
      renderDashboard();
      break;
    case "agenda":
      renderAgenda();
      break;
    case "pacientes":
      renderPatients();
      break;
    case "historial":
      renderClinicalHistory();
      renderOdontogramSnapshots();
      break;
    case "odontograma":
      renderOdontogram();
      break;
    case "inventario":
      renderInventory();
      break;
    case "pagos":
      renderPayments();
      break;
    case "comprobantes":
      renderElectronicReceipts();
      refreshSunatStatus().then(renderElectronicReceipts);
      break;
    case "caja-general":
      renderGeneralCash();
      break;
    case "cuentas-cobrar":
      renderReceivables();
      break;
    case "seguimiento-citas":
      renderAppointmentFollowUps();
      renderPatientsToCall();
      refreshPatientsToCall().then(renderPatientsToCall);
      break;
    case "panel":
      renderStaffPanel();
      break;
    case "recordatorios":
      renderReminders();
      break;
    case "reportes":
      renderReports();
      break;
    case "campanas":
      renderCampaigns();
      break;
    case "configuracion":
      renderConfig();
      break;
    default:
      renderDashboard();
      break;
  }
}

function renderFullApp() {
  renderDashboard();
  renderAgenda();
  renderPatients();
  renderClinicalHistory();
  renderOdontogramSnapshots();
  renderOdontogram();
  renderInventory();
  renderPayments();
  renderElectronicReceipts();
  renderGeneralCash();
  renderReceivables();
  renderAppointmentFollowUps();
  renderPatientsToCall();
  renderStaffPanel();
  renderReminders();
  renderReports();
  renderCampaigns();
  renderConfig();
}

function hydrateForms() {
  const serviceNames = state.services.filter((service) => service.active).map((service) => service.name);
  $$('select[name="doctor"]').forEach((select) => fillSelect(select, state.config.doctors, select.value));
  $$('select[name="unit"]').forEach((select) => fillSelect(select, state.config.units, select.value));
  $$('select[name="service"], select[name="mainTreatment"]').forEach((select) => fillSelect(select, serviceNames, select.value));
  $$('select[name="status"]').forEach((select) => {
    const options = select.closest("#treatmentForm") ? state.config.treatmentStatuses : state.config.statuses;
    fillSelect(select, options, select.value);
  });
  $$('select[name="method"]').forEach((select) => {
    if (select.closest("#utilityForm")) return fillSelect(select, utilityMethodOptions(), select.value);
    const methods = select.closest("#paymentForm")
      ? [...state.config.paymentMethods, "MIXTO"].filter((value, index, list) => list.indexOf(value) === index)
      : state.config.paymentMethods;
    fillSelect(select, methods, select.value);
  });
  $$('select[name="source"]').forEach((select) => fillSelect(select, state.config.expenseSources, select.value));
  $$('#staffPaymentForm select[name="type"]').forEach((select) => fillSelect(select, state.config.staffPaymentTypes, select.value));
  $$('select[name="attendedBy"]').forEach((select) => fillSelect(select, state.config.doctors, select.value));
  $$('select[name="patientId"]').forEach((select) => {
    if (select.closest("#paymentForm")) return;
    if (select.closest("#historyForm")) return;
    fillPatientSelect(select, select.value);
  });
  fillAppointmentPatientSelectForDate($('#historyForm select[name="patientId"]'), $('#historyForm input[name="date"]')?.value || todayISO(), $('#historyForm select[name="patientId"]')?.value || "");
  avisoDeDeudaDelDia();
  fillPaymentPatientSelect($('#paymentForm select[name="patientId"]'), $('#paymentForm select[name="patientId"]')?.value || "");
  fillPatientSelect($("#historyPatientFilter"), $("#historyPatientFilter").value);
  $$('select[name="tooth"]').forEach((select) => fillSelect(select, teeth, select.value));
  $$('select[name="condition"]').forEach((select) => fillSelect(select, toothConditions, select.value));
  fillSelect($("#doctorFilter"), ["Todos los doctores", ...state.config.doctors], $("#doctorFilter").value);
  fillSelect($("#unitFilter"), ["Todas las unidades", ...state.config.units], $("#unitFilter").value);
  renderTreatmentPaymentOptions();
  fillInventoryProductSelects();
  toggleMixedPaymentFields();
}

/* Lo que falta pagar de cada tratamiento del paciente, para cobrarlo como
   una atencion mas. */
function opcionesDeCobroDeTratamiento(patientId) {
  return tratamientosDelPaciente(patientId)
    .filter((t) => t.porPagar > 0)
    .map((t) => `<option value="trat:${escapeHtml(t.entry.id)}">Tratamiento ${escapeHtml(t.entry.plan)} - por pagar ${money(t.porPagar)}</option>`)
    .join("");
}

function renderTreatmentPaymentOptions() {
  const patientSelect = $('#paymentForm select[name="patientId"]');
  const historySelect = $('#paymentForm select[name="historyId"]');
  if (!patientSelect || !historySelect) return;
  /* La lista se vuelve a armar en cada dibujo y lo elegido no debe perderse,
     pero solo mientras siga el mismo paciente o cita: al pasar de cobrar el
     tratamiento a la cita del dia, quedaba marcado el cobro del tratamiento. */
  const mismaSeleccion = historySelect.dataset.seleccion === patientSelect.value;
  const previo = mismaSeleccion ? historySelect.value : "";
  historySelect.dataset.seleccion = patientSelect.value;
  const existe = (valor) => [...historySelect.options].some((option) => option.value === valor);
  const appointment = appointmentFromPaymentSelection(patientSelect.value);
  if (appointment) {
    const amount = Number(serviceByName(appointment.service)?.price || 0);
    const cobros = opcionesDeCobroDeTratamiento(appointment.patientId);
    historySelect.innerHTML = `<option value="">Cita del dia - ${escapeHtml(appointment.service || "Servicio")}</option>${cobros}`;
    // con un tratamiento por pagar se puede elegir cobrarlo en vez de la cita
    historySelect.disabled = !cobros;
    if (previo && existe(previo)) historySelect.value = previo;
    if (String(historySelect.value).startsWith("trat:")) {
      updatePaymentDue();
      return;
    }
    const form = $("#paymentForm");
    if (form?.amount) form.amount.readOnly = false;
    if (form?.amountDue) form.amountDue.value = amount || 0;
    if (form?.date) form.date.value = appointment.date || operatingDate();
    if (form?.amount && (!Number(form.amount.value || 0) || form.dataset.paymentMode !== "agenda")) form.amount.value = amount || "";
    if (form) {
      form.dataset.paymentMode = "agenda";
      form.dataset.basePaymentAmount = Number(form.amount?.value || 0);
      applyProductTotalToPaymentForm();
    }
    const clearDebtBtn = $("#clearHistoryDebtBtn");
    if (clearDebtBtn) clearDebtBtn.hidden = true;
    updatePaymentChange();
    aplicarCuadroDeDescuento();
    return;
  }
  const patientId = patientIdFromPaymentSelection(patientSelect.value);
  const pending = pendingCashHistories().filter((entry) => entry.patientId === patientId);
  const cobros = opcionesDeCobroDeTratamiento(patientId);
  historySelect.disabled = false;
  historySelect.innerHTML = pending.length || cobros
    ? pending.map((entry) => `<option value="${entry.id}">${formatDate(entry.date)} - ${escapeHtml(entry.reason)} - saldo ${money(historyBalance(entry.id))}</option>`).join("") + cobros
    : `<option value="">Sin atenciones pendientes</option>`;
  if (forcedPaymentHistoryId && pending.some((entry) => entry.id === forcedPaymentHistoryId)) historySelect.value = forcedPaymentHistoryId;
  else if (previo && existe(previo)) historySelect.value = previo;
  const form = $("#paymentForm");
  if (form) form.dataset.paymentMode = "debt";
  updatePaymentDue();
}

function updatePaymentDue() {
  const form = $("#paymentForm");
  if (!form) return;
  const clearDebtBtn = $("#clearHistoryDebtBtn");
  const valor = String(form.historyId.value || "");
  if (valor.startsWith("trat:")) {
    /* Cobrar el tratamiento: llega con lo que falta pagar del costo total. Se
       puede cobrar menos -un adelanto parcial-, no mas. Entra a caja con su
       boleta, como cualquier cobro. */
    const tratamiento = tratamientoPorId(valor.slice(5));
    const porPagar = tratamiento ? tratamiento.porPagar : 0;
    form.amountDue.value = porPagar;
    form.amount.value = porPagar || "";
    form.amount.readOnly = false;
    form.dataset.paymentMode = "tratamiento";
    form.dataset.basePaymentAmount = Number(form.amount.value || 0);
    if (clearDebtBtn) clearDebtBtn.hidden = true;
    applyProductTotalToPaymentForm();
    updatePaymentChange();
    aplicarCuadroDeDescuento();
    return;
  }
  if (appointmentFromPaymentSelection(form.patientId.value)) {
    // se dejo de cobrar el tratamiento: vuelve el precio de la cita
    if (form.dataset.paymentMode === "tratamiento") {
      renderTreatmentPaymentOptions();
      return;
    }
    form.amount.readOnly = false;
    form.dataset.basePaymentAmount = Number(form.amount.value || 0);
    applyProductTotalToPaymentForm();
    updatePaymentChange();
    aplicarCuadroDeDescuento();
    return;
  }
  const due = historyBalance(form.historyId.value);
  form.amountDue.value = due || 0;
  form.amount.value = due || "";
  form.dataset.paymentMode = "debt";
  form.dataset.basePaymentAmount = Number(form.amount.value || 0);
  /* Llega con la deuda entera puesta, que es lo mas comun, pero se puede
     cambiar: el paciente que debe 110 y trae 30 abona esos 30 y queda debiendo
     80. El saldo no es un numero guardado -se saca de lo acordado menos lo que
     ya pago-, asi que va bajando solo hasta que la cuenta desaparece de la
     lista. Lo que no deja el guardado es pasarse del saldo ni poner cero. */
  form.amount.readOnly = false;
  if (clearDebtBtn) clearDebtBtn.hidden = !isAdmin() || !form.historyId.value || due <= 0;
  applyProductTotalToPaymentForm();
  updatePaymentChange();
  aplicarCuadroDeDescuento();
}

/* El check "Descontar del tratamiento". Solo aparece si el paciente tiene
   dinero pagado de un tratamiento que todavia no se uso, y si hay algo que
   descontar: una cita del dia o una atencion pendiente. Marcado, se van los
   campos de dinero -no se recibe nada- y el boton dice cuanto se descuenta. */
function aplicarCuadroDeDescuento() {
  const form = $("#paymentForm");
  const caja = $("#treatmentDiscountBox");
  const info = $("#treatmentDiscountInfo");
  if (!form || !caja || !info) return;
  const check = form.elements.namedItem("descontarTratamiento");
  const seleccion = form.patientId.value;
  const valor = String(form.historyId.value || "");
  // cobrar el tratamiento y descontar de el a la vez no tiene sentido
  const hayAtencion = !valor.startsWith("trat:") && Boolean(appointmentFromPaymentSelection(seleccion) || valor);
  const tratamiento = hayAtencion ? tratamientoParaDescontar(patientIdFromPaymentSelection(seleccion)) : null;
  caja.hidden = !tratamiento;
  if (!tratamiento && check) check.checked = false;
  const activo = Boolean(tratamiento && check?.checked);
  form.classList.toggle("modo-descuento", activo);
  ["cashReceived", "change", "method"].forEach((nombre) => {
    const etiqueta = form.elements.namedItem(nombre)?.closest("label");
    if (etiqueta) etiqueta.hidden = activo;
  });
  const mixto = $("#mixedPaymentFields");
  if (mixto && activo) mixto.hidden = true;
  else if (mixto) toggleMixedPaymentFields();
  const etiquetaMonto = form.amount.closest("label")?.firstChild;
  if (etiquetaMonto?.nodeType === Node.TEXT_NODE) etiquetaMonto.nodeValue = activo ? "Monto a descontar S/" : "Monto que paga S/";
  const boton = form.querySelector('button[type="submit"]');
  if (!activo) {
    info.hidden = true;
    if (boton && !paymentSaving) boton.textContent = "Guardar pago";
    return;
  }
  if (Number(form.amount.value || 0) > tratamiento.disponible) form.amount.value = tratamiento.disponible;
  const monto = Number(form.amount.value || 0);
  info.hidden = false;
  info.innerHTML = `<strong>${escapeHtml(tratamiento.entry.plan)}</strong>` +
    `<span>Disponible ${money(tratamiento.disponible)} → queda ${money(Math.max(0, tratamiento.disponible - monto))}</span>` +
    `<span>No entra a caja · sin boleta</span>`;
  if (boton && !paymentSaving) boton.textContent = `Descontar ${money(monto)}`;
}

async function guardarDescuentoDeTratamiento({ form, data, restorePaymentButton }) {
  const appointment = appointmentFromPaymentSelection(data.patientId);
  const patientId = patientIdFromPaymentSelection(data.patientId);
  const patient = patientById(patientId);
  const tratamiento = tratamientoParaDescontar(patientId);
  const monto = Math.round(Number(data.amount || 0) * 100) / 100;
  const fallar = (mensaje) => {
    alert(mensaje);
    restorePaymentButton();
    aplicarCuadroDeDescuento();
  };
  if (!tratamiento) return fallar("Este paciente ya no tiene saldo disponible en su tratamiento.");
  if ((selectedProductSaleItems || []).some((item) => Number(item.quantity || 0) > 0)) {
    return fallar("Los productos se cobran aparte: quítalos o desmarca el descuento.");
  }
  if (monto <= 0 || monto > tratamiento.disponible) {
    return fallar(`El monto debe ser mayor a cero y no pasar de lo disponible (${money(tratamiento.disponible)}).`);
  }
  const historyId = appointment ? "" : String(data.historyId || "");
  const pendiente = appointment ? Number(form.amountDue.value || 0) : historyBalance(historyId);
  if (!appointment && monto > pendiente) return fallar("El monto no puede superar el saldo de la atención.");
  const resto = Math.max(0, pendiente - monto);
  const payment = {
    id: uid("pay"),
    patientId,
    historyId,
    appointmentId: appointment?.id || "",
    date: appointment?.date || operatingDate(),
    amount: 0,
    productAmount: 0,
    cashReceived: 0,
    change: 0,
    method: "TRATAMIENTO",
    cashAmount: 0,
    yapeAmount: 0,
    plinAmount: 0,
    cardAmount: 0,
    transferAmount: 0,
    tipo: DESCUENTO_TRATAMIENTO,
    treatmentId: tratamiento.entry.id,
    descontado: monto,
    // la cita se da por atendida solo si el descuento la cubre entera
    marcarCita: Boolean(appointment) && resto <= 0,
    productItems: [],
    receipt: String(data.receipt || "").trim() || `Descontado de ${tratamiento.entry.plan}`,
    registeredBy: currentUser()?.name || ""
  };
  try {
    await savePaymentApi(payment);
  } catch (error) {
    return fallar(error.message);
  }
  upsert(state.payments, payment);
  addLocalAuditEvent("TRATAMIENTO_DESCUENTO", `Descontó ${money(monto)} de ${tratamiento.entry.plan}: ${patient?.name || "Paciente"}`, patientId);
  if (appointment && resto <= 0 && state.config.enableAgendaPayments !== false) {
    appointment.status = "ATENDIDA";
    addLocalAuditEvent(
      "APPOINTMENT_ATTENDED",
      `Marco atendida desde descuento de tratamiento: ${patient?.name || "Paciente"} ${appointment.date} ${appointment.time}`,
      patientId
    );
  }
  if (!API_ENABLED) saveState();
  restorePaymentButton();
  /* Si el control cuesta mas de lo que quedaba, la cita sigue en la lista y el
     formulario queda listo para cobrar el resto como un pago normal. */
  if (resto > 0) {
    form.elements.namedItem("descontarTratamiento").checked = false;
    render();
    if (appointment) form.amount.value = resto;
    else if (form.historyId) {
      form.historyId.value = historyId;
      updatePaymentDue();
    }
    aplicarCuadroDeDescuento();
    updatePaymentChange();
    alert(`Se descontaron ${money(monto)} del tratamiento. Falta cobrar ${money(resto)} como pago normal.`);
    return;
  }
  form.reset();
  selectedProductSaleItems = [];
  renderPaymentProductSummary();
  form.date.value = operatingDate();
  render();
}

function renderInventory() {
  fillInventoryProductSelects();
  const productRows = $("#inventoryProductsTable");
  const movementRows = $("#inventoryMovementsTable");
  if (!productRows || !movementRows) return;
  const products = activeInventoryProducts();
  productRows.innerHTML = products.map((product) => {
    const lowStock = Number(product.stock || 0) <= Number(product.minStock || 0) && Number(product.minStock || 0) > 0;
    return `<tr>
      <td><strong>${escapeHtml(product.name)}</strong><br><span class="muted">${escapeHtml(product.unit || "Unidad")}</span></td>
      <td><span class="status ${lowStock ? "danger" : ""}">${Number(product.stock || 0)}</span></td>
      <td>${money(product.price)}</td>
      <td>${Number(product.minStock || 0)}</td>
      <td class="row-actions"><button class="small-btn" data-edit-product="${product.id}">Editar</button></td>
    </tr>`;
  }).join("") || `<tr><td colspan="5">Aun no hay productos registrados.</td></tr>`;

  const movements = state.inventoryMovements.slice().sort((a, b) => `${b.date || ""}${b.createdAt || ""}`.localeCompare(`${a.date || ""}${a.createdAt || ""}`));
  movementRows.innerHTML = movements.slice(0, 80).map((movement) => {
    const product = inventoryProductById(movement.productId);
    return `<tr>
      <td>${formatDate(movement.date)}</td>
      <td>${escapeHtml(product?.name || "Producto")}</td>
      <td><span class="status ${movement.type === "SALIDA" || movement.type === "VENTA" ? "danger" : ""}">${escapeHtml(movement.type)}</span></td>
      <td>${Number(movement.quantity || 0)}</td>
      <td>${money(movement.total)}</td>
      <td>${escapeHtml(movement.detail || "")}</td>
    </tr>`;
  }).join("") || `<tr><td colspan="6">Sin movimientos de inventario.</td></tr>`;
}

function applyProductTotalToPaymentForm() {
  const form = $("#paymentForm");
  if (!form) return;
  const base = Number(form.dataset.basePaymentAmount || form.amount?.value || 0);
  const productTotal = paymentProductTotal();
  const total = base + productTotal;
  if (form.amount) form.amount.value = total ? cents(total) / 100 : "";
  renderPaymentProductSummary();
  updatePaymentChange();
}

function renderPaymentProductSummary() {
  const summary = $("#paymentProductSummary");
  if (!summary) return;
  if (!selectedProductSaleItems.length) {
    summary.hidden = true;
    summary.innerHTML = "";
    return;
  }
  summary.hidden = false;
  summary.innerHTML = `
    <strong>Productos: ${money(paymentProductTotal())}</strong>
    <span>${escapeHtml(productSaleDescription())}</span>
    <button type="button" class="inline-edit-btn" id="removePaymentProductsBtn">Quitar</button>
  `;
}

function fillInventoryProductSelects() {
  const products = activeInventoryProducts();
  const options = products.map((product) => `${product.name} - stock ${Number(product.stock || 0)}`);
  const values = products.map((product) => product.id);
  $$('#inventoryMovementForm select[name="productId"]').forEach((select) => {
    const selected = select.value;
    select.innerHTML = values.map((value, index) => `<option value="${value}">${escapeHtml(options[index])}</option>`).join("");
    if (selected && values.includes(selected)) select.value = selected;
  });
}

function openProductSaleDialog() {
  const dialog = $("#productSaleDialog");
  if (!dialog) return;
  renderProductSaleDialog();
  dialog.showModal();
}

function productSaleItemById(productId) {
  return selectedProductSaleItems.find((item) => item.productId === productId);
}

function setProductSaleQuantity(productId, quantity) {
  const product = inventoryProductById(productId);
  if (!product) return;
  const normalizedQty = Math.max(0, Math.min(Number(product.stock || 0), Number(quantity || 0)));
  const existing = productSaleItemById(productId);
  if (normalizedQty <= 0) {
    selectedProductSaleItems = selectedProductSaleItems.filter((item) => item.productId !== productId);
  } else if (existing) {
    existing.quantity = normalizedQty;
    existing.price = Number(product.price || 0);
    existing.name = product.name;
  } else {
    selectedProductSaleItems.push({
      productId,
      name: product.name,
      quantity: normalizedQty,
      price: Number(product.price || 0)
    });
  }
  renderProductSaleDialog();
  applyProductTotalToPaymentForm();
}

function renderProductSaleDialog() {
  const list = $("#productSaleList");
  const total = $("#productSaleTotal");
  const summary = $("#productSaleModalSummary");
  if (!list || !total) return;
  const products = activeInventoryProducts().filter((product) => Number(product.stock || 0) > 0);
  list.innerHTML = products.map((product) => {
    const selected = productSaleItemById(product.id);
    const qty = Number(selected?.quantity || 0);
    return `<article class="product-sale-card ${qty ? "selected" : ""}">
      <div>
        <strong>${escapeHtml(product.name)}</strong>
        <span>${money(product.price)} · Stock ${Number(product.stock || 0)}</span>
      </div>
      <div class="qty-stepper">
        <button type="button" data-product-step="${product.id}" data-step="-1">-</button>
        <input type="number" min="0" max="${Number(product.stock || 0)}" step="1" value="${qty}" data-product-qty="${product.id}" />
        <button type="button" data-product-step="${product.id}" data-step="1">+</button>
      </div>
    </article>`;
  }).join("") || `<p class="muted">No hay productos con stock disponible.</p>`;
  total.textContent = `Total ${money(paymentProductTotal())}`;
  if (summary) summary.textContent = selectedProductSaleItems.length ? productSaleDescription() : "Selecciona productos en stock.";
}

async function clearSelectedHistoryDebt() {
  if (!isAdmin()) return;
  const form = $("#paymentForm");
  const history = historyById(form?.historyId?.value);
  if (!history) return;
  const balance = historyBalance(history.id);
  if (balance <= 0) return;
  const patient = patientById(history.patientId);
  if (!confirm(`Quitar la deuda pendiente de ${patient?.name || "paciente"} por ${money(balance)}? La atencion y la agenda quedaran registradas.`)) return;
  const updated = {
    ...history,
    agreedPrice: historyPaid(history.id),
    creditPending: false,
    creditAmount: 0,
    creditDueDate: "",
    creditNote: ""
  };
  try {
    await saveClinicalHistoryApi(updated);
  } catch (error) {
    alert(error.message);
    return;
  }
  upsert(state.clinicalHistory, updated);
  if (forcedPaymentHistoryId === history.id) forcedPaymentHistoryId = "";
  if (!API_ENABLED) saveState();
  render();
}

function updatePaymentChange() {
  const form = $("#paymentForm");
  if (!form) return;
  const amount = Number(form.amount.value || 0);
  const method = String(form.method?.value || "").toUpperCase();
  const cashPortion = method === "MIXTO" ? Number(form.cashAmount?.value || 0) : method === "EFECTIVO" ? amount : 0;
  if (cashPortion <= 0) {
    form.cashReceived.value = "";
    form.cashReceived.disabled = true;
    form.change.value = "";
    updateMixedPaymentSummary();
    return;
  }
  form.cashReceived.disabled = false;
  const received = Number(form.cashReceived.value || cashPortion || 0);
  form.change.value = Math.max(0, received - cashPortion).toFixed(2);
  updateMixedPaymentSummary();
}

function mixedPaymentTotalFromDialog() {
  const dialogForm = $("#mixedPaymentForm");
  if (!dialogForm) return 0;
  return Number(dialogForm.cashAmount.value || 0) + Number(dialogForm.walletAmount.value || 0);
}

function updateMixedPaymentDialogSummary() {
  const paymentForm = $("#paymentForm");
  const dialogSummary = $("#mixedPaymentDialogSummary");
  if (!paymentForm || !dialogSummary) return;
  const amount = Number(paymentForm.amount.value || 0);
  const total = mixedPaymentTotalFromDialog();
  const diff = amount - total;
  dialogSummary.textContent = cents(diff) === 0
    ? `Distribuido ${money(total)} completo.`
    : `${diff > 0 ? "Falta" : "Sobra"} ${money(Math.abs(diff))}`;
  dialogSummary.classList.toggle("invalid", cents(diff) !== 0);
}

function openMixedPaymentDialog() {
  const paymentForm = $("#paymentForm");
  const dialog = $("#mixedPaymentDialog");
  const dialogForm = $("#mixedPaymentForm");
  if (!paymentForm || !dialog || !dialogForm) return;
  dialogForm.cashAmount.value = Number(paymentForm.cashAmount?.value || 0) || "";
  dialogForm.walletAmount.value = Number(paymentForm.yapeAmount?.value || 0) || "";
  updateMixedPaymentDialogSummary();
  dialog.showModal();
}

function applyMixedPaymentDialog() {
  const paymentForm = $("#paymentForm");
  const dialog = $("#mixedPaymentDialog");
  const dialogForm = $("#mixedPaymentForm");
  if (!paymentForm || !dialogForm) return;
  const amount = Number(paymentForm.amount.value || 0);
  const cashAmount = Number(dialogForm.cashAmount.value || 0);
  const walletAmount = Number(dialogForm.walletAmount.value || 0);
  if (cents(cashAmount + walletAmount) !== cents(amount)) {
    alert("La suma del pago mixto debe coincidir con el monto que paga.");
    updateMixedPaymentDialogSummary();
    return;
  }
  paymentForm.cashAmount.value = cashAmount || "";
  paymentForm.yapeAmount.value = walletAmount || "";
  paymentForm.plinAmount.value = "";
  paymentForm.cardAmount.value = "";
  paymentForm.transferAmount.value = "";
  updatePaymentChange();
  dialog?.close();
}

function toggleMixedPaymentFields() {
  const form = $("#paymentForm");
  const fields = $("#mixedPaymentFields");
  if (!form || !fields) return;
  const isMixed = String(form.method?.value || "").toUpperCase() === "MIXTO";
  fields.hidden = !isMixed;
  if (isMixed) openMixedPaymentDialog();
  updateMixedPaymentSummary();
}

function updateMixedPaymentSummary() {
  const form = $("#paymentForm");
  const summary = $("#mixedPaymentSummary");
  if (!form || !summary) return;
  const isMixed = String(form.method?.value || "").toUpperCase() === "MIXTO";
  if (!isMixed) {
    summary.textContent = "";
    summary.classList.remove("invalid");
    return;
  }
  const amount = Number(form.amount.value || 0);
  const total = paymentSplitFields.reduce((sum, field) => sum + Number(form[field.key]?.value || 0), 0);
  const diff = amount - total;
  summary.textContent = cents(diff) === 0
    ? `Mixto: efectivo ${money(Number(form.cashAmount?.value || 0))} + Yape/Plin/Transferencia ${money(Number(form.yapeAmount?.value || 0))}.`
    : `${diff > 0 ? "Falta" : "Sobra"} ${money(Math.abs(diff))}`;
  summary.classList.toggle("invalid", cents(diff) !== 0);
}

function paymentSplitFromForm(data, amount) {
  const method = String(data.method || "").toUpperCase();
  const split = { cashAmount: 0, yapeAmount: 0, plinAmount: 0, cardAmount: 0, transferAmount: 0 };
  if (method === "MIXTO") {
    paymentSplitFields.forEach((field) => {
      split[field.key] = Number(data[field.key] || 0);
    });
    const total = Object.values(split).reduce((sum, value) => sum + Number(value || 0), 0);
    if (cents(total) !== cents(amount)) {
      return { error: "La suma del pago mixto debe coincidir con el monto que paga.", split };
    }
    return { split };
  }
  const field = paymentSplitFields.find((item) => item.method === method);
  if (field) split[field.key] = amount;
  return { split };
}

function openPaymentForHistory(historyId) {
  const history = historyById(historyId);
  if (!history) return;
  forcedPaymentHistoryId = historyId;
  setView("pagos");
  fillPaymentPatientSelect($('#paymentForm select[name="patientId"]'), history.patientId);
  renderTreatmentPaymentOptions();
  const historySelect = $('#paymentForm select[name="historyId"]');
  if (historySelect) historySelect.value = historyId;
  const form = $("#paymentForm");
  if (form?.date) form.date.value = operatingDate();
  updatePaymentDue();
  setTimeout(() => $('#paymentForm input[name="cashReceived"]')?.focus(), 0);
}

function receivableEntryFromForm(data) {
  const patient = patientById(data.patientId);
  const amount = Number(data.creditAmount || 0);
  return {
    id: uid("h"),
    patientId: data.patientId,
    /* La fecha de la atencion, no la de hoy. Antes siempre era hoy: la deuda de
       quien se atendio ayer quedaba colgando del dia equivocado, y si ese
       paciente tenia cita hoy lo sacaba de la lista de Historial de hoy. */
    date: data.attentionDate || todayISO(),
    attendedBy: patient?.doctor || currentUser()?.name || "",
    attended: true,
    reason: "Cuenta por cobrar",
    anamnesis: "",
    exam: "",
    diagnosis: "",
    plan: "",
    procedure: "",
    instructions: "",
    agreedPrice: amount,
    creditPending: true,
    creditAmount: amount,
    creditDueDate: data.creditDueDate || todayISO(),
    creditNote: data.creditNote || ""
  };
}

function receivablePatientMatches(query) {
  const normalized = String(query || "").trim().toLowerCase();
  if (normalized.length < 3) return [];
  return state.patients
    .filter((patient) => [patient.name, patient.dni, patient.phone].join(" ").toLowerCase().includes(normalized))
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, 12);
}

function patientOptionLabel(patient) {
  return `${patient.name} - ${patient.dni}`;
}

function selectReceivablePatient(patient) {
  const form = $("#manualReceivableForm");
  if (!form || !patient) return;
  form.patientId.value = patient.id;
  form.patientSearch.value = patientOptionLabel(patient);
  if (form.attentionDate) form.attentionDate.value = fechaDeAtencionSugerida(patient.id);
  const suggestions = $("#receivablePatientSuggestions");
  if (suggestions) suggestions.innerHTML = "";
}

function renderReceivablePatientSuggestions() {
  const form = $("#manualReceivableForm");
  const suggestions = $("#receivablePatientSuggestions");
  if (!form || !suggestions) return;
  const query = form.patientSearch.value;
  const matches = receivablePatientMatches(query);
  if (form.patientId.value) {
    const selected = patientById(form.patientId.value);
    if (!selected || form.patientSearch.value !== patientOptionLabel(selected)) form.patientId.value = "";
  }
  suggestions.innerHTML = matches.map((patient) => `
    <button type="button" data-select-receivable-patient="${patient.id}">
      <strong>${escapeHtml(patient.name)}</strong>
      <span>${escapeHtml(patient.dni)}${patient.phone ? ` | ${escapeHtml(patient.phone)}` : ""}</span>
    </button>
  `).join("");
}

async function updateReceivableAmount(entry, amount) {
  const updated = { ...entry, agreedPrice: amount, creditAmount: amount };
  await saveReceivableApi(updated, { editAmount: true });
  upsert(state.clinicalHistory, updated);
  if (!API_ENABLED) saveState();
  render();
}

/* Anular una deuda que ya no corresponde -anotada por error, perdonada-. No
   se borra: la ficha queda, solo deja de estar pendiente y sale de la agenda
   de cobro. Lo que ya se abono sigue en caja. */
async function voidReceivable(entry) {
  const updated = { ...entry, creditPending: false, creditAmount: 0 };
  await saveReceivableApi(updated, { editAmount: true });
  upsert(state.clinicalHistory, updated);
  if (!API_ENABLED) saveState();
  render();
}

function openCreditDialog() {
  const historyForm = $("#historyForm");
  const creditForm = $("#creditForm");
  if (!historyForm || !creditForm) return;
  creditForm.creditAmount.value = historyForm.agreedPrice.value || historyForm.creditAmount.value || "";
  creditForm.creditDueDate.value = historyForm.creditDueDate.value || todayISO();
  creditForm.creditNote.value = historyForm.creditNote.value || "";
  $("#creditDialog").showModal();
}

function updateCreditSummary() {
  const form = $("#historyForm");
  const summary = $("#creditSummary");
  if (!form || !summary) return;
  const checked = Boolean(form.creditPending.checked);
  summary.hidden = !checked;
  summary.textContent = checked
    ? `Pago pendiente: ${money(Number(form.creditAmount.value || form.agreedPrice.value || 0))} para ${form.creditDueDate.value ? formatDate(form.creditDueDate.value) : "fecha por definir"}${form.creditNote.value ? ` - ${form.creditNote.value}` : ""}`
    : "";
}

function syncAssignedDoctor() {
  const historyForm = $("#historyForm");
  if (historyForm?.patientId && historyForm?.attendedBy) {
    const patient = patientById(historyForm.patientId.value);
    historyForm.attendedBy.value = patient?.doctor || "";
  }
}

function syncAppointmentDoctor() {
  const form = $("#appointmentForm");
  if (!form?.patientId || !form?.doctor) return;
  const patient = patientById(form.patientId.value);
  if (patient?.doctor) form.doctor.value = patient.doctor;
}

function normalizedPatientName(patient) {
  return String(patient?.name || "").trim().replace(/\s+/g, " ").toUpperCase();
}

function patientPaymentMissingFields(patient) {
  const missing = [];
  if (!String(patient?.name || "").trim()) missing.push("nombre completo");
  if (!String(patient?.dni || "").trim()) missing.push("DNI");
  if (!String(patient?.phone || "").trim()) missing.push("numero de celular");
  if (!String(patient?.birthDate || "").trim()) missing.push("fecha de nacimiento");
  return missing;
}

const SLOT_FREE_STATUSES = ["CANCELADA", "NO_ASISTIO", "REPROGRAMADA"];

function isSlotBlockingAppointment(appointment) {
  return Boolean(appointment && !SLOT_FREE_STATUSES.includes(appointment.status));
}

function appointmentFollowUpStatus(appointment) {
  if (!appointment) return "";
  if (appointment.followUpStatus) return appointment.followUpStatus;
  if (["CANCELADA", "NO_ASISTIO"].includes(appointment.status)) return "PENDIENTE_REPROGRAMAR";
  if (appointment.status === "REPROGRAMADA") return appointment.newAppointmentId ? "REPROGRAMADO" : "PENDIENTE_REPROGRAMAR";
  return "";
}

function relatedFollowUpAppointments(appointment) {
  if (!appointment) return [];
  return state.appointments
    .filter((item) => {
      if (item.id === appointment.id || item.patientId !== appointment.patientId) return false;
      if (appointmentSortKey(item) <= appointmentSortKey(appointment)) return false;
      return !["CANCELADA", "NO_ASISTIO", "REPROGRAMADA"].includes(String(item.status || "").toUpperCase());
    })
    .sort((a, b) => appointmentSortKey(a).localeCompare(appointmentSortKey(b)));
}

function attendedAfterFollowUp(appointment) {
  return relatedFollowUpAppointments(appointment).find((item) => String(item.status || "").toUpperCase() === "ATENDIDA");
}

function nextAppointmentAfterFollowUp(appointment) {
  return relatedFollowUpAppointments(appointment).find((item) => String(item.status || "").toUpperCase() !== "ATENDIDA") || null;
}

/* Una cita que se reprograma y vuelve a fallar deja dos filas: la vieja, que ya
   no aporta nada, y la nueva, que es el caso vivo. Con tres reprogramaciones son
   tres filas del mismo paciente. Solo interesa la ultima. */
function haySeguimientoMasReciente(appointment) {
  return state.appointments.some((item) => {
    if (item.id === appointment.id || item.patientId !== appointment.patientId) return false;
    if (appointmentSortKey(item) <= appointmentSortKey(appointment)) return false;
    if (String(item.followUpStatus || "").toUpperCase() === "CERRADO") return false;
    return ["CANCELADA", "NO_ASISTIO", "REPROGRAMADA"].includes(String(item.status || "").toUpperCase());
  });
}

function isFollowUpOpen(appointment) {
  const status = appointmentFollowUpStatus(appointment);
  if (!status || status === "CERRADO") return false;
  if (attendedAfterFollowUp(appointment)) return false;
  if (haySeguimientoMasReciente(appointment)) return false;
  if (status === "REPROGRAMADO") {
    const next = appointment.newAppointmentId ? state.appointments.find((item) => item.id === appointment.newAppointmentId) : null;
    return !next || next.status !== "ATENDIDA";
  }
  return status === "PENDIENTE_REPROGRAMAR";
}

function appointmentFollowUps() {
  return state.appointments
    .filter(isFollowUpOpen)
    .sort((a, b) => appointmentSortKey(b).localeCompare(appointmentSortKey(a)));
}

function followUpLabel(appointment) {
  if (nextAppointmentAfterFollowUp(appointment)) return "REPROG.";
  return appointmentFollowUpStatus(appointment) === "REPROGRAMADO" ? "REPROG." : "PENDIENTE";
}

function followUpClass(appointment) {
  return nextAppointmentAfterFollowUp(appointment) || appointmentFollowUpStatus(appointment) === "REPROGRAMADO" ? "followup-rescheduled" : "followup-pending";
}

function followUpNextText(appointment) {
  const next = (appointment.newAppointmentId ? state.appointments.find((item) => item.id === appointment.newAppointmentId) : null) || nextAppointmentAfterFollowUp(appointment);
  return next ? `${formatDate(next.date)} ${agendaTimeLabel(next.time)} | ${appointmentStatusText(next.status)}` : "Pendiente";
}

function whatsappPhone(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (!digits) return "";
  return digits.startsWith("51") ? digits : `51${digits}`;
}

function findAppointmentConflict(candidate) {
  const candidatePatient = patientById(candidate.patientId);
  const candidateName = normalizedPatientName(candidatePatient);
  const duplicatePatientAppointment = state.appointments.find((appointment) => {
    if (appointment.id === candidate.id || appointment.date !== candidate.date || !isSlotBlockingAppointment(appointment)) return false;
    if (String(appointment.patientId) === String(candidate.patientId)) return true;
    return Boolean(candidateName && normalizedPatientName(patientById(appointment.patientId)) === candidateName);
  });
  if (duplicatePatientAppointment) {
    return {
      type: "patient",
      message: `${candidatePatient?.name || "Este paciente"} ya tiene una cita activa el ${formatDate(duplicatePatientAppointment.date)} a las ${agendaTimeLabel(duplicatePatientAppointment.time)}. Revisa la agenda antes de duplicar el nombre.`
    };
  }
  const sameDateTime = state.appointments.filter((appointment) =>
    appointment.id !== candidate.id &&
    appointment.date === candidate.date &&
    appointment.time === candidate.time &&
    isSlotBlockingAppointment(appointment)
  );
  const unitConflict = sameDateTime.find((appointment) => appointment.unit === candidate.unit);
  if (unitConflict) {
    return {
      type: "unit",
      message: `La ${candidate.unit} ya esta ocupada a las ${candidate.time}. Cambia a otra unidad disponible, por ejemplo Unidad 2 si esta libre.`
    };
  }
  const doctorConflict = sameDateTime.find((appointment) => appointment.doctor === candidate.doctor);
  if (doctorConflict) {
    const patient = patientById(doctorConflict.patientId);
    return {
      type: "doctor",
      message: `${candidate.doctor} ya tiene una cita a las ${candidate.time} con ${patient?.name || "otro paciente"}. Cambia la hora o selecciona otro doctor.`
    };
  }
  return null;
}

function renderDashboard() {
  const today = todayISO();
  const appointmentsToday = state.appointments.filter((appointment) => appointment.date === today);
  const cashToday = state.payments.filter((payment) => payment.date === today).reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const totalDebtValue = state.patients.reduce((sum, patient) => sum + patientDebt(patient.id), 0);
  $("#kpiToday").textContent = appointmentsToday.length;
  $("#kpiActive").textContent = state.patients.filter((patient) => patientStatus(patient) !== "INACTIVO").length;
  $("#kpiCash").textContent = money(cashToday);
  $("#kpiDebt").textContent = money(totalDebtValue);

  $("#todayAppointments").innerHTML = appointmentsToday.length
    ? appointmentsToday.map(appointmentCard).join("")
    : `<p class="muted">No hay citas registradas para hoy.</p>`;

  const debtors = state.patients.filter((patient) => patientDebt(patient.id) > 0).slice(0, 4);
  const inactive = state.patients.filter((patient) => patientStatus(patient) === "INACTIVO");
  $("#alertsList").innerHTML = [
    `<div class="appointment-card"><strong>${inactive.length} pacientes inactivos</strong><p class="muted">Listos para campana de WhatsApp.</p></div>`,
    ...debtors.map((patient) => `<div class="appointment-card"><strong>${escapeHtml(patient.name)}</strong><p class="muted">Saldo pendiente: ${money(patientDebt(patient.id))}</p></div>`)
  ].join("");
}

function appointmentCard(appointment) {
  const patient = patientById(appointment.patientId);
  const statusClass = ["NO_ASISTIO", "CANCELADA"].includes(appointment.status) ? "danger" : appointment.status === "RESERVADA" ? "warn" : "";
  return `<article class="appointment-card">
    <div class="card-title">
      <strong>${appointment.time} | ${escapeHtml(patient?.name || "Paciente")}</strong>
      <span class="status ${statusClass}">${escapeHtml(appointment.status)}</span>
    </div>
    <p class="muted">${escapeHtml(appointment.service)} | ${escapeHtml(appointment.doctor)} | ${escapeHtml(appointment.unit)}</p>
  </article>`;
}

function renderAgenda() {
  if (!$("#agendaDate").value) $("#agendaDate").value = todayISO();
  const date = $("#agendaDate").value;
  const doctor = $("#doctorFilter").value;
  const unit = $("#unitFilter").value;
  const dayInfo = businessDayInfo(date);
  if (!dayInfo.open) {
    $("#agendaBoard").innerHTML = `<div class="appointment-card nonwork-day"><strong>Domingo no laborable</strong><p class="muted">Selecciona otra fecha para registrar citas.</p></div>`;
    return;
  }
  const start = dayInfo.start;
  const end = dayInfo.end;
  const units = state.config.units.length ? state.config.units : seedData.config.units;
  const rows = dayInfo.message ? [`<div class="agenda-notice">${dayInfo.message}</div>`] : [];
  const appointmentsForDay = state.appointments.filter((item) => item.date === date && isSlotBlockingAppointment(item));
  agendaTimesForDay(date, start, end).forEach((time) => {
    const cursor = minutes(time);
    const slots = units.map((unitName) => {
      const appointment = appointmentsForDay.find((item) => {
        const doctorOk = !doctor || doctor === "Todos los doctores" || item.doctor === doctor;
        const unitOk = !unit || unit === "Todas las unidades" || item.unit === unit;
        return item.time === time && item.unit === unitName && doctorOk && unitOk;
      });
      const isLunch = dayOfWeek(date) !== 6 && cursor >= minutes(state.config.lunchStart) && cursor < minutes(state.config.lunchEnd);
      if (appointment) {
        const patient = patientById(appointment.patientId);
        const debt = patient ? patientDebt(patient.id) : 0;
        const statusText = appointment.status === "ATENDIDA" ? "ATENDIDO" : appointment.status;
        /* El boton de confirmado va aparte del estado de la cita. Que el
           paciente conteste el recordatorio no es lo mismo que haber venido:
           una cita confirmada sigue siendo RESERVADA hasta que se atiende, y
           por eso la franja no cambia de color. Solo se pinta el boton. */
        return `<div class="slot busy status-${appointment.status.toLowerCase()}" data-edit-appointment="${appointment.id}">
          <div class="slot-main">
            <strong>${escapeHtml(patient?.name || "Paciente")}</strong>
            <span>${escapeHtml(appointment.service)}</span>
          </div>
          <button class="slot-confirm${appointment.confirmada ? " confirmada" : ""}" type="button" data-confirm-appointment="${appointment.id}" aria-pressed="${Boolean(appointment.confirmada)}" title="${appointment.confirmada ? "El paciente confirmó. Clic para deshacer." : "Marcar que el paciente confirmó"}">Confir</button>
          <div class="slot-meta">
            <span>${escapeHtml(appointment.doctor)}</span>
            <span>${escapeHtml(statusText)}</span>
            <span>${money(debt)}</span>
          </div>
        </div>`;
      }
      return `<div class="slot ${isLunch ? "lunch" : ""}" ${isLunch ? "" : `data-new-at="${time}" data-unit="${escapeHtml(unitName)}"`}>
        <div class="slot-main">
          <strong>${escapeHtml(unitName)}</strong>
          <span class="muted">${isLunch ? "Almuerzo flexible" : "Disponible"}</span>
        </div>
      </div>`;
    });
    rows.push(`<div class="agenda-row" style="grid-template-columns: 50px repeat(${units.length}, minmax(0, 1fr));"><div class="time-cell">${agendaTimeLabel(time)}</div>${slots.join("")}</div>`);
  });
  $("#agendaBoard").innerHTML = rows.join("") || `<div class="appointment-card"><strong>No se pudo construir la agenda.</strong><p class="muted">Revisa horario de inicio, fin e intervalo en Configuración.</p></div>`;
}

function renderPatients() {
  const query = ($("#globalSearch")?.value || "").trim().toLowerCase();
  const filteredPatients = state.patients
    .filter((patient) => [patient.name, patient.dni, patient.phone, patient.birthDate].join(" ").toLowerCase().includes(query));
  const showAppointmentDetails = Boolean(query);
  if (!showAppointmentDetails) {
    expandedPatientInfoId = "";
  } else if (filteredPatients.length === 1) {
    expandedPatientInfoId = filteredPatients[0].id;
  } else if (!filteredPatients.some((patient) => patient.id === expandedPatientInfoId)) {
    expandedPatientInfoId = "";
  }
  const counter = $("#patientCount");
  if (counter) {
    counter.textContent = query ? `${filteredPatients.length} de ${state.patients.length} pacientes` : `${state.patients.length} pacientes`;
  }
  const rows = filteredPatients
    .map((patient) => {
      const status = patientStatus(patient);
      const ageText = patientAgeText(patient);
      const highlight = patient.id === lastSavedPatientId ? "row-highlight" : "";
      const expanded = showAppointmentDetails && expandedPatientInfoId === patient.id;
      const detailButton = showAppointmentDetails ? `<button class="small-btn" data-toggle-patient-info="${patient.id}">${expanded ? "Ocultar citas" : "Ver citas"}</button>` : "";
      const mainRow = `<tr class="${highlight}" data-patient-row="${patient.id}">
        <td><strong>${escapeHtml(patient.name)}</strong><br><span class="muted">${escapeHtml(patient.dni)}</span></td>
        <td>${escapeHtml(patient.phone)}${patient.birthDate ? `<br><span class="muted">${formatDate(patient.birthDate)}${ageText ? ` | ${ageText}` : ""}</span>` : ""}</td>
        <td>${escapeHtml(patient.doctor)}</td>
        <td><span class="status ${CLASE_ESTADO[status] ?? ""}" ${TITULO_ESTADO[status] ? `title="${TITULO_ESTADO[status]}"` : ""}>${status}</span></td>
        <td>${money(patientDebt(patient.id))}</td>
        <td class="row-actions">${detailButton}<button class="small-btn" data-edit-patient="${patient.id}">Editar</button><button class="small-btn" data-pay-patient="${patient.id}">Pago</button>${canDeletePatients() ? `<button class="small-btn danger-btn" data-delete-patient="${patient.id}">Eliminar</button>` : ""}</td>
      </tr>`;
      const detailRow = expanded ? `<tr class="patient-detail-row"><td colspan="6">${renderPatientAppointmentDetail(patient.id)}</td></tr>` : "";
      return mainRow + detailRow;
    });
  $("#patientsTable").innerHTML = rows.join("") || `<tr><td colspan="6">No hay pacientes para mostrar.</td></tr>`;
}

/* ============ Historia clinica del paciente ============
   Antes el historial era una tira de tarjetas sueltas: sin orden y sin forma
   de entregarsela al paciente. Ahora es una hoja con secciones -datos,
   tratamiento en curso, odontograma, atenciones y deudas- que se ve igual en
   pantalla y en papel: lo que se mira es lo que se imprime. */

const numeroDeHistoria = (numero) => `HC N.° ${String(numero).padStart(4, "0")}`;

let vistaDeLaHoja = null;
let lienzoDeLaHoja = null;

/* El dibujo sale del mismo modulo del odontograma, en una copia de solo
   lectura fuera de la vista, igual que hace su propia hoja de impresion. Asi
   no se toca odontograma.js, que esta copiado a mano en los dos sistemas. Se
   usa la ultima copia guardada; si no hay ninguna, el odontograma actual. */
/* El dibujo de una ficha cualquiera, no solo la del paciente: el presupuesto
   lo necesita para poner la boca al lado de los precios. Devuelve el html del
   arco, los hallazgos y las especificaciones, igual que la hoja. */
function dibujoDelOdontograma(ficha) {
  if (typeof Odontograma === "undefined" || !ficha) return null;
  const compacta = fichaCompacta(ficha);
  if (!Object.keys(compacta.dientes).length && !compacta.spans.length && !compacta.esp && !compacta.nino) return null;
  prepararVistaDeLaHoja();
  vistaDeLaHoja.cargar(ficha);
  const arco = lienzoDeLaHoja.querySelector(".odo-arco");
  return {
    html: arco ? arco.innerHTML : "",
    hallazgos: (Odontograma.PIEZAS || [])
      .map((pieza) => ({ pieza, texto: vistaDeLaHoja.resumenPieza(pieza) }))
      .filter((item) => item.texto),
    especificaciones: ficha.esp || ""
  };
}


/* La copia de solo lectura fuera de la vista donde se dibuja: una sola para
   todo el sistema, que se vuelve a cargar con cada ficha. */
function prepararVistaDeLaHoja() {
  if (vistaDeLaHoja) return;
  const caja = document.createElement("div");
  caja.className = "hc-odontograma-oculto";
  caja.setAttribute("aria-hidden", "true");
  const cabecera = document.createElement("div");
  lienzoDeLaHoja = document.createElement("div");
  caja.append(cabecera, lienzoDeLaHoja);
  document.body.appendChild(caja);
  vistaDeLaHoja = Odontograma.crear({ barra: null, cabecera, lienzo: lienzoDeLaHoja, rutaImagenes: "assets/dientes/" });
  vistaDeLaHoja.setPacientes([], "");
  vistaDeLaHoja.setSoloLectura(true);
}


function odontogramaParaLaHoja(patientId) {
  if (typeof Odontograma === "undefined" || !patientId) return null;
  const copia = copiasDelOdontograma(patientId)[0] || null;
  const ficha = copia
    ? Odontograma.normalizarFicha(parseFindings(copia.ficha))
    : odontogramFichaFor(patientId, "inicial");
  const compacta = fichaCompacta(ficha);
  if (!Object.keys(compacta.dientes).length && !compacta.spans.length && !compacta.esp) return null;
  if (!vistaDeLaHoja) {
    const caja = document.createElement("div");
    caja.className = "hc-odontograma-oculto";
    caja.setAttribute("aria-hidden", "true");
    const cabecera = document.createElement("div");
    lienzoDeLaHoja = document.createElement("div");
    caja.append(cabecera, lienzoDeLaHoja);
    document.body.appendChild(caja);
    vistaDeLaHoja = Odontograma.crear({ barra: null, cabecera, lienzo: lienzoDeLaHoja, rutaImagenes: "assets/dientes/" });
    vistaDeLaHoja.setPacientes([], "");
    vistaDeLaHoja.setSoloLectura(true);
  }
  vistaDeLaHoja.cargar(ficha);
  const arco = lienzoDeLaHoja.querySelector(".odo-arco");
  return {
    html: arco ? arco.innerHTML : "",
    hallazgos: (Odontograma.PIEZAS || [])
      .map((pieza) => ({ pieza, texto: vistaDeLaHoja.resumenPieza(pieza) }))
      .filter((item) => item.texto),
    especificaciones: ficha.esp || "",
    origen: copia
      ? `copia del ${formatDate(copia.date)}${copia.sheet === "evolucion" ? " · evolución" : ""}${copia.doctor ? ` · ${copia.doctor}` : ""}`
      : "odontograma actual, sin copia guardada"
  };
}

/* El grafico mide lo mismo que en la pantalla del odontograma, mas ancho que
   la hoja: se reduce hasta que entre. Sin ancho -la pantalla oculta- no se
   toca, porque quedaria en cero. */
function ajustarGraficos(raiz) {
  raiz.querySelectorAll(".hc-grafico").forEach((caja) => {
    const lienzo = caja.firstElementChild;
    if (!lienzo || !caja.clientWidth) return;
    lienzo.style.zoom = "1";
    const ancho = lienzo.scrollWidth;
    if (ancho) lienzo.style.zoom = String(Math.min(1, caja.clientWidth / ancho));
  });
}

/* La hoja es la HISTORIA CLINICA ODONTOLOGICA del formato 2019: los mismos
   titulos, en el mismo orden y con las mismas rayas de puntos. En pantalla se
   escribe encima -cada raya es el campo, y al salir de ella se guarda sola-;
   impresa es el papel, con sus renglones en blanco para llenarlos a mano.
   La filiacion sale del registro del paciente y la fecha y hora de su cita; lo
   clinico, de su atencion. */
/* Lo que la norma pide en la historia clinica y que solo escribe el doctor. Se
   llena en la primera atencion -los controles siguen con la nota corta- y por
   eso la hoja lo busca en la atencion mas antigua que tenga algo escrito.
   Los nombres anamnesis, exam y diagnosis vienen de fichas viejas: se
   reaprovechan para que lo ya guardado vuelva a verse. */
const CAMPOS_CLINICOS = [
  "currentIllness", "illnessTime", "symptoms", "anamnesis", "biologicalFunctions",
  "familyHistory", "personalHistory",
  "bloodPressure", "pulse", "temperature", "heartRate", "respRate", "exam", "oralExam",
  "diagnosis", "finalDiagnosis", "workPlan", "prognosis", "recommendations", "followUp"
];


/* Guardar la historia es abrirla: se le da su numero y la fecha de apertura, y
   ese numero la acompana el resto de su vida. Por eso se pregunta antes: no hay
   vuelta atras y los numeros no se repiten. El numero lo da el servidor, para
   que dos equipos no entreguen el mismo. */
async function guardarHistoriaClinica(patientId) {
  const patient = patientById(patientId);
  if (!patient || patient.historiaNumero || !canManageClinical()) return;
  if (!confirm(`Se abre la historia clínica de ${patient.name}.

Se le asigna su número, que queda fijo y no se puede cambiar. ¿Continuar?`)) return;
  try {
    if (API_ENABLED && apiToken) {
      const resultado = await apiFetch("/api/patients", { method: "POST", body: JSON.stringify({ id: patient.id, asignarHistoria: true }) });
      patient.historiaNumero = Number(resultado.historiaNumero || 0);
      patient.historiaDesde = resultado.historiaDesde || todayISO();
      patient.historiaHora = resultado.historiaHora || new Date().toTimeString().slice(0, 5);
    } else {
      patient.historiaNumero = Math.max(0, ...state.patients.map((item) => Number(item.historiaNumero || 0))) + 1;
      patient.historiaDesde = todayISO();
      // la hoja pide fecha y hora de apertura, y son las de este momento
      patient.historiaHora = new Date().toTimeString().slice(0, 5);
      saveState();
    }
  } catch (error) {
    alert(error.message);
    return;
  }
  addLocalAuditEvent("HISTORIA_CLINICA_NUMERO", `Abrió la ${numeroDeHistoria(patient.historiaNumero)} de ${patient.name}`, patient.id);
  renderClinicalHistory();
}


/* Guarda lo que se acaba de escribir sobre una raya de la historia clinica. El
   campo dice a que registro pertenece -la atencion o la ficha del paciente- y
   solo se guarda si cambio, para no escribir en la nube en cada clic. */
function guardarCampoDeLaHoja(campo) {
  const { destino, campo: nombre, registro } = campo.dataset;
  if (campo.dataset.cancelado) {
    delete campo.dataset.cancelado;
    return;
  }
  if (!destino || !nombre || !registro) return;
  if (!canManageClinical()) return;
  const valor = String(campo.innerText || "").replace(/ /g, " ").trim();
  if (destino === "paciente") {
    const paciente = patientById(registro);
    if (!paciente || String(paciente[nombre] || "") === valor) return;
    paciente[nombre] = valor;
    savePatientApi(paciente).catch((error) => alert(error.message));
    if (!API_ENABLED) saveState();
    renderClinicalHistory();
    return;
  }
  const entrada = state.clinicalHistory.find((item) => item.id === registro);
  if (!entrada || String(entrada[nombre] || "") === valor) return;
  entrada[nombre] = valor;
  saveClinicalHistoryApi(entrada).catch((error) => alert(error.message));
  if (!API_ENABLED) saveState();
  renderClinicalHistory();
}


function hojaDeLaHistoria(patientId, { pantalla = false } = {}) {
  const patient = patientById(patientId);
  if (!patient) return `<p class="muted">Elige un paciente para ver su historia.</p>`;
  const config = state.config || {};
  const edad = ageFromBirthDate(patient.birthDate);
  const notas = state.clinicalHistory
    .filter((entry) => entry.patientId === patientId)
    .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
  const odontograma = odontogramaParaLaHoja(patientId);
  const atenciones = notas.filter((entry) => !esSoloDeuda(entry));
  const primeraAtencion = atenciones.length ? atenciones[atenciones.length - 1] : null;
  /* La historia se escribe en la primera atencion y desde ahi acompana al
     paciente: por eso se busca en la atencion mas antigua que tenga algo
     escrito y, si ninguna lo tiene, en la primera. Los controles siguen con la
     nota corta y salen en Control y evolucion. */
  const nota = [...atenciones].reverse().find((entry) =>
    CAMPOS_CLINICOS.some((campo) => String(entry[campo] || "").trim())) || primeraAtencion || {};
  const alta = notas.find((entry) => entry.discharged);
  /* La hora no la escribe nadie dos veces: es la de la cita de ese dia. */
  const citaDeLaAtencion = primeraAtencion
    ? (state.appointments || [])
      .filter((cita) => cita.patientId === patientId && cita.date === primeraAtencion.date)
      .sort((a, b) => String(a.time || "").localeCompare(String(b.time || "")))[0]
    : null;

  /* La fecha y la hora de la hoja son las de cuando se abrio la historia, que
     es cuando se pulsa Guardar y se le da su numero. Mientras no se haya
     guardado se adelanta lo que ya se sabe -el dia de la primera atencion y la
     hora de su cita-, para que la hoja no salga en blanco. */
  const fechaDeApertura = patient.historiaDesde
    ? formatDate(patient.historiaDesde)
    : (primeraAtencion ? formatDate(primeraAtencion.date) : "");
  /* La hora se puede escribir a mano sobre la raya: las historias que se
     abrieron antes de que se apuntara sola no tienen ninguna, y no habria
     forma de completarlas. */
  const horaDeApertura = patient.historiaHora || citaDeLaAtencion?.time || "";

  const texto = (valor) => escapeHtml(String(valor || "").trim());
  /* Un campo se escribe en la hoja cuando se esta viendo en pantalla y hay
     donde guardarlo. En el papel es solo la raya. */
  const sePuedeEscribir = pantalla && canManageClinical();
  const deNota = (campo) => (nota.id ? `nota|${campo}|${nota.id}` : "");
  const dePaciente = (campo) => `paciente|${campo}|${patient.id}`;
  const escribible = (destino, pista = "") => {
    if (!sePuedeEscribir || !destino) return "";
    const [tipo, campo, registro] = destino.split("|");
    return ` class="hcf-escribible" contenteditable="plaintext-only" role="textbox" tabindex="0"`
      + ` data-destino="${tipo}" data-campo="${campo}" data-registro="${escapeHtml(registro)}"`
      + (pista ? ` data-pista="${escapeHtml(pista)}"` : "");
  };

  /* Una fila del formato: el rotulo y su raya de puntos al lado, como en el
     papel. Varios rotulos en la misma fila cuando el formato los junta. */
  const fila = (...pares) => `<p class="hcf-fila">${pares
    .map(([rotulo, valor, ancho = 1, destino = ""]) =>
      `<span>${rotulo}</span><b style="flex:${ancho}"${escribible(destino)}>${texto(valor)}</b>`)
    .join("")}</p>`;
  /* Lo que se escribe largo va debajo del rotulo. En pantalla es una caja que
     crece; en el papel, los renglones en blanco del formato. */
  const bloque = (rotulo, valor, renglones = 2, destino = "") => {
    const escrito = String(valor || "").trim();
    const cabeza = rotulo ? `<span>${rotulo}</span>` : "";
    if (sePuedeEscribir && destino) {
      return `<div class="hcf-bloque">${cabeza}<b class="hcf-caja"${escribible(destino)}
        style="min-height:${renglones * 17}px">${escapeHtml(escrito)}</b></div>`;
    }
    return `<div class="hcf-bloque">
      ${cabeza}
      ${escrito ? `<b>${escapeHtml(escrito)}</b>` : ""}
      ${Array.from({ length: escrito ? 1 : renglones }, () => `<i class="hcf-raya"></i>`).join("")}
    </div>`;
  };
  const titulo = (nombre) => `<h4 class="hcf-titulo">${nombre}</h4>`;
  const subtitulo = (nombre) => `<p class="hcf-subtitulo">${nombre}</p>`;

  /* Al lado del logo, guardar la historia: ahi se le asigna su numero y ese
     numero ya no cambia nunca. Antes lo daba la impresion, que es un momento
     raro para abrir un registro: se imprime tambien en blanco, o dos veces. */
  const cabecera = `<header class="hc-cabecera">
      <div class="hc-clinica">
        <img class="hc-logo" src="assets/logo-cm.png" alt="" onerror="this.remove()" />
        <div>
          <h3>${escapeHtml(config.clinicName || "CM Odontología Estética")}</h3>
          <p>${escapeHtml(config.issuerAddress || "")}</p>
        </div>
      </div>
      ${pantalla
        ? `<div class="hc-numero">
            ${patient.historiaNumero
              ? `<strong>${escapeHtml(numeroDeHistoria(patient.historiaNumero))}</strong>
                 <p>Abierta el ${formatDate(patient.historiaDesde || patient.createdAt || "")}</p>`
              : sePuedeEscribir
                ? `<button class="primary" type="button" data-guardar-historia="${patient.id}">Guardar</button>
                   <p>Al guardar se le asigna su número de historia</p>`
                : `<strong>Sin N.° de historia</strong>`}
          </div>`
        : ""}
    </header>`;

  /* Sin una atencion guardada no hay donde escribir lo clinico: la historia se
     cuelga de la atencion, no del aire. */
  const aviso = sePuedeEscribir && !nota.id
    ? `<p class="hcf-aviso">Escribe aquí mismo sobre cada línea. Lo clínico se guarda en la atención del paciente, así que primero registra su nota clínica arriba; la filiación ya se puede llenar.</p>`
    : sePuedeEscribir
      ? `<p class="hcf-aviso">Escribe aquí mismo sobre cada línea: se guarda solo al salir del campo.</p>`
      : "";

  const lugarYFecha = [patient.birthPlace, patient.birthDate ? formatDate(patient.birthDate) : ""]
    .filter(Boolean).join(", ");

  const filiacion = `${subtitulo("Filiación:")}
    ${fila(
      ["Nombres del paciente", patient.name, 4],
      ["Edad", edad === null ? "" : `${edad} años`, 1],
      ["Sexo", patient.sexo === "F" ? "Femenino" : patient.sexo === "M" ? "Masculino" : "", 1]
    )}
    ${fila(["Lugar y fecha de nacimiento", lugarYFecha])}
    ${fila(["Dirección", patient.address, 1, dePaciente("address")])}
    ${fila(["Procedencia", patient.origin, 2, dePaciente("origin")], ["Ocupación", patient.occupation, 2, dePaciente("occupation")])}
    ${fila(["Viajes en el último año", patient.travels, 1, dePaciente("travels")])}
    ${fila(["Teléfono", patient.phone, 1, dePaciente("phone")])}
    ${fila(["En caso de emergencia comunicarse a", patient.emergencyContact, 1, dePaciente("emergencyContact")])}`;

  /* El motivo sale de lo que el paciente dijo al registrarse; si ahi no se
     anoto nada, del motivo de su primera atencion. */
  const motivo = `${titulo("Motivo de consulta")}
    ${bloque("", patient.chiefComplaint || primeraAtencion?.reason, 2, dePaciente("chiefComplaint"))}`;

  /* La enfermedad actual la puede tomar recepcion al registrar; lo que escriba
     la doctora en la atencion manda sobre eso, igual que en los antecedentes. */
  const enfermedad = `${titulo("Enfermedad actual")}
    ${bloque("", nota.currentIllness || patient.currentIllness, 2, deNota("currentIllness"))}
    ${fila(["Tiempo de enfermedad", nota.illnessTime || patient.illnessTime, 1, deNota("illnessTime")])}
    ${fila(["Signos y síntomas principales", nota.symptoms || patient.symptoms, 1, deNota("symptoms")])}
    ${fila(["Relato cronológico", nota.anamnesis || patient.anamnesis, 1, deNota("anamnesis")])}
    ${bloque("Funciones biológicas", nota.biologicalFunctions || patient.biologicalFunctions, 2, deNota("biologicalFunctions"))}`;

  /* Los antecedentes los escribe la doctora en la historia; si recepcion ya
     habia anotado algo al registrar al paciente, eso es lo que sale hasta que
     ella lo cambie. La alergia va aparte y destacada: es el dato que puede
     evitar un accidente y en una hoja larga se pierde. */
  const antecedentes = `${titulo("Antecedentes")}
    ${String(patient.allergies || "").trim() ? `<p class="hcf-alergia"><span>Alérgico a:</span> ${escapeHtml(patient.allergies)}</p>` : ""}
    ${bloque("Antecedentes familiares", nota.familyHistory || patient.familyHistory, 2, deNota("familyHistory"))}
    ${bloque("Antecedentes personales", nota.personalHistory || patient.personalHistory, 2, deNota("personalHistory"))}`;

  const examen = `${titulo("Examen clínico")}
    ${fila(
      ["Signos vitales. P.A.", nota.bloodPressure, 1, deNota("bloodPressure")],
      ["Pulso", nota.pulse, 1, deNota("pulse")],
      ["Temp.", nota.temperature, 1, deNota("temperature")],
      ["F.C.", nota.heartRate, 1, deNota("heartRate")],
      ["F. Resp.", nota.respRate, 1, deNota("respRate")]
    )}
    ${bloque("Examen clínico general", nota.exam, 2, deNota("exam"))}
    ${bloque("Examen clínico odontoestomatológico", nota.oralExam, 2, deNota("oralExam"))}`;

  const diagnostico = `${titulo("Diagnóstico (CIE 10)")}
    ${bloque("Diagnóstico presuntivo", nota.diagnosis, 2, deNota("diagnosis"))}
    ${bloque("Diagnóstico definitivo", nota.finalDiagnosis, 2, deNota("finalDiagnosis"))}`;

  const plan = `${titulo("Plan de tratamiento")}
    ${bloque("", nota.workPlan, 2, deNota("workPlan"))}`;

  const pronostico = `${titulo("Pronóstico")}
    ${bloque("", nota.prognosis, 1, deNota("prognosis"))}`;

  const recomendaciones = `${titulo("Tratamiento / Recomendaciones")}
    <p class="hcf-aclaracion">(Nombre genérico del medicamento, dosis, vía de administración, tiempo de administración, cuidados, medidas higiénico-dietéticas, preventivas)</p>
    ${bloque("", nota.recommendations, 3, deNota("recommendations"))}`;

  /* Control y evolucion tiene dos partes: lo que la doctora escribe a mano y,
     debajo, lo que cada control dejo dicho por si solo. Lo segundo no se toca:
     es lo que ya ocurrio, con su fecha. */
  const controles = atenciones
    .filter((entry) => entry.id !== nota.id)
    .slice()
    .reverse()
    .map((entry) => {
      const detalle = [entry.reason, entry.procedure, entry.followUp]
        .map((valor) => String(valor || "").trim()).filter(Boolean).join(" · ");
      return detalle ? `<li><strong>${formatDate(entry.date)}</strong> ${escapeHtml(detalle)}</li>` : "";
    })
    .filter(Boolean)
    .join("");
  const evolucion = `${titulo("Control y evolución")}
    ${bloque("", nota.followUp, controles ? 2 : 5, deNota("followUp"))}
    ${controles ? `<ul class="hcf-controles">${controles}</ul>` : ""}`;

  const altaDelPaciente = `${titulo("Alta del paciente")}
    ${bloque("", alta ? `Dada de alta el ${formatDate(alta.date)}` : "", 1)}`;

  /* Quien firma la historia se elige: en un consultorio con varios doctores no
     siempre atiende el de la ficha, y el nombre del pie tiene que ser el de
     quien de verdad la cierra. */
  const profesional = nombreCompletoDelDoctor(nota.professional)
    || nombreCompletoDelDoctor(nota.attendedBy)
    || nombreCompletoDelDoctor(patient.doctor)
    || "";
  const usuarioQueFirma = usuarioDelDoctor(profesional);
  const cop = usuarioQueFirma?.cop || "";
  // el sello es de quien firma, no del consultorio: cada doctor tiene el suyo
  const sello = usuarioQueFirma?.sello || "";
  const doctores = (config.doctors || []).filter(Boolean);
  const elegirProfesional = sePuedeEscribir && nota.id && doctores.length
    ? `<p class="hcf-fila"><span>Nombres y apellidos del profesional</span>
        <select class="hcf-doctor" data-profesional="${nota.id}">
          ${doctores.map((nombre) => `<option value="${escapeHtml(nombre)}"${nombre === profesional ? " selected" : ""}>${escapeHtml(nombre)}</option>`).join("")}
        </select></p>`
    : fila(["Nombres y apellidos del profesional", profesional]);

  /* La firma NO se guarda en la configuracion para volver a estamparla: eso
     dejaria que cualquiera con acceso sacara historias firmadas. Se dibuja en
     el momento, se guarda dentro de esta historia y queda anotado quien firmo y
     cuando. El sello del consultorio si es fijo: identifica al consultorio, no
     autoriza nada por si solo. */
  const firmada = Boolean(nota.firma);
  const cierre = `<div class="hcf-cierre">
      ${elegirProfesional}
      ${cop ? `<p class="hcf-cop">COP N.° ${escapeHtml(cop)}</p>` : ""}
      ${sello ? `<img class="hcf-sello-imagen" src="${escapeHtml(sello)}" alt="Sello de ${escapeHtml(profesional)}" />` : ""}
      <div class="hcf-sello">
        ${firmada ? `<img class="hcf-firma" src="${escapeHtml(nota.firma)}" alt="Firma del profesional" />` : ""}
        <span>Sello y firma</span>
        ${sePuedeEscribir && nota.id
          ? `<button class="small-btn" type="button" data-firmar-profesional="${nota.id}">${firmada ? "Firmar de nuevo" : "Firmar"}</button>`
          : ""}
        ${/* Imprimir vive al final de la hoja, no arriba: se imprime cuando ya
              se termino de leerla y de firmarla, no antes. */
          pantalla ? `<button class="ghost hcf-imprimir" type="button" data-imprimir-historia="${patient.id}">Imprimir historia</button>` : ""}
      </div>
      ${firmada
        ? `<p class="hcf-firmada">Firmada por ${escapeHtml(nota.firmadaPor || profesional)} el ${formatDate(String(nota.firmadaEl || "").slice(0, 10))}${String(nota.firmadaEl || "").slice(11, 16) ? ` a las ${String(nota.firmadaEl).slice(11, 16)}` : ""}</p>`
        : pantalla ? `<p class="hcf-sin-firma">Todavía sin firmar.</p>` : ""}
    </div>`;

  /* En pantalla el odontograma vive en su propia pestana -con el inicial y el
     de evolucion, como pide la norma-, asi que aqui se omite para no verlo dos
     veces. En la hoja impresa si va, al final: el papel que se archiva se
     entrega completo. */
  const odonto = pantalla || !odontograma ? "" : `<section class="hcf-odontograma">
      ${titulo(`Odontograma · ${escapeHtml(odontograma.origen)}`)}
      <div class="hc-grafico"><div class="odo-raiz hc-grafico-lienzo"><div class="odo-arco">${odontograma.html}</div></div></div>
      ${odontograma.hallazgos.length ? `<ul class="hc-hallazgos">${odontograma.hallazgos.map((item) => `<li><strong>${escapeHtml(item.pieza)}</strong> ${escapeHtml(item.texto)}</li>`).join("")}</ul>` : ""}
      ${odontograma.especificaciones ? `<p class="hc-observacion"><span>Especificaciones:</span> ${escapeHtml(odontograma.especificaciones)}</p>` : ""}
    </section>`;

  return `<article class="hc-hoja hcf">
    ${cabecera}
    <h3 class="hcf-encabezado">Historia clínica odontológica</h3>
    ${aviso}
    ${fila(
      ["HC:", patient.historiaNumero ? String(patient.historiaNumero).padStart(4, "0") : (pantalla ? "Se asigna al guardarla" : ""), 2],
      ["Fecha:", fechaDeApertura, 2],
      ["Hora:", horaDeApertura, 1, dePaciente("historiaHora")]
    )}
    ${titulo("Anamnesis")}
    ${filiacion}
    ${motivo}
    ${enfermedad}
    ${antecedentes}
    ${examen}
    ${diagnostico}
    ${plan}
    ${pronostico}
    ${recomendaciones}
    ${evolucion}
    ${altaDelPaciente}
    ${cierre}
    ${odonto}
  </article>`;
}

function renderClinicalHistory() {
  if (!$('#historyForm input[name="date"]').value) $('#historyForm input[name="date"]').value = todayISO();
  // el tratamiento se elige del catalogo de servicios, sin impedir escribir otro
  const sugerencias = $("#historyPlanOptions");
  if (sugerencias) {
    sugerencias.innerHTML = (state.services || [])
      .filter((servicio) => servicio.active !== false && servicio.name)
      .map((servicio) => `<option value="${escapeHtml(servicio.name)}"></option>`)
      .join("");
  }
  const caja = $("#historyTimeline");
  if (!caja) return;
  const patientId = $("#historyPatientFilter").value || state.patients[0]?.id || "";
  const hoja = historySheetTab || "historia";
  $("#historySheetTabs")?.querySelectorAll("[data-hoja]").forEach((boton) => {
    boton.classList.toggle("activa", boton.dataset.hoja === hoja);
  });
  /* La lista de copias acompana al odontograma y a nada mas: colgada debajo del
     historial de pagos no pinta nada. */
  const copias = document.querySelector(".odontogram-copies-panel");
  if (copias) copias.hidden = hoja !== "odontograma";
  caja.innerHTML = contenidoDeLaPestana(patientId);
  if (hoja === "plan") alinearBotonDePrecios(caja);
  ajustarGraficos(caja);
}


function contenidoDeLaPestana(patientId) {
  const hoja = historySheetTab || "historia";
  if (hoja === "plan") return hojaDelPlan(patientId);
  if (hoja === "historial") return historialDePagos(patientId);
  if (hoja === "odontograma") return hojaDelOdontograma(patientId);
  if (hoja === "consentimiento") return hojaDelConsentimiento(patientId);
  return hojaDeLaHistoria(patientId, { pantalla: true });
}

/* El numero de historia se da la primera vez que se imprime: no todos los
   pacientes la piden, y asi el correlativo cuenta solo las historias que de
   verdad se entregaron. Lo asigna el servidor, para que dos equipos no den el
   mismo numero. */
async function imprimirHistoria(patientId) {
  const patient = patientById(patientId);
  if (!patient) {
    alert("Elige primero un paciente.");
    return;
  }
  /* El numero lo da el boton Guardar de la hoja, no la impresion: se imprime
     tambien en blanco, o dos veces, y abrir un registro ahi es un mal momento. */
  if (!patient.historiaNumero
    && !confirm(`La historia de ${patient.name} todavía no tiene número. Se imprimirá sin él. ¿Continuar?`)) return;
  // la ventana se abre antes de cualquier espera: despues el navegador la bloquea
  const ventana = window.open("", "_blank", "width=900,height=1100");
  if (!ventana) {
    alert("El navegador bloqueó la ventana de impresión. Permite las ventanas emergentes de esta página.");
    return;
  }
  const hojasDeEstilo = [...document.querySelectorAll('link[rel="stylesheet"][href]')]
    .map((link) => `<link rel="stylesheet" href="${escapeHtml(link.href)}">`)
    .join("");
  ventana.document.open();
  ventana.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8">
    <base href="${escapeHtml(location.href)}">
    <title>Historia clínica ${escapeHtml(patient.name)}</title>
    ${hojasDeEstilo}
    <style>
      @page { size: A4; margin: 12mm; }
      html, body { background: #fff !important; }
      body { display: block !important; min-height: 0 !important; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .hc-hoja { border: 0 !important; border-radius: 0 !important; padding: 0 !important; max-width: 186mm; margin: 0 auto; }
      .hc-seccion-odontograma, .hc-tratamiento, .hc-firma, tr { break-inside: avoid; }
      .table-wrap { overflow: visible !important; }
    </style></head><body>
    ${hojaDeLaHistoria(patient.id, { pantalla: false })}
    <script>
      (function () {
        var impreso = false;
        function ajustar() {
          document.querySelectorAll(".hc-grafico").forEach(function (caja) {
            var lienzo = caja.firstElementChild;
            if (!lienzo || !caja.clientWidth) return;
            lienzo.style.zoom = "1";
            var ancho = lienzo.scrollWidth;
            if (ancho) lienzo.style.zoom = String(Math.min(1, caja.clientWidth / ancho));
          });
        }
        function imprimir() {
          if (impreso) return;
          impreso = true;
          ajustar();
          window.focus();
          window.print();
        }
        window.addEventListener("load", function () { setTimeout(imprimir, 300); });
        setTimeout(imprimir, 2500);
      })();
    <\/script></body></html>`);
  ventana.document.close();
  renderClinicalHistory();
}

/* ============ Odontograma (Norma Tecnica del Odontograma - MINSA) ============
   El dibujo y las reglas de la norma viven en odontograma.js. Aqui solo se
   conecta con el estado del sistema: que paciente esta seleccionado y como se
   guarda cada hallazgo.

   Los hallazgos se guardan en la misma tabla odontogram de siempre, uno por
   pieza, con el detalle en la columna findings (JSON). La columna condition
   conserva un resumen legible para que los registros y respaldos anteriores
   sigan sirviendo. La hoja de evolucion usa el prefijo "E:" en la pieza, y la
   fila "__ficha" guarda lo que no pertenece a una pieza concreta: protesis,
   ortodoncia, trazos de maxilar y especificaciones. */
let odontogramView = null;
let odontogramPatientId = "";
let odontogramSheet = "inicial";
let odontogramLoadedKey = "";
let odontogramLoadedSign = "";
const odontogramPending = new Set();
let odontogramTimer = null;

function odontogramRowKey(sheet, tooth) {
  return sheet === "evolucion" ? `E:${tooth}` : tooth;
}

function parseFindings(raw) {
  if (!raw) return {};
  try {
    const value = typeof raw === "string" ? JSON.parse(raw) : raw;
    return value && typeof value === "object" ? value : {};
  } catch (error) {
    return {};
  }
}

function odontogramRowsFor(patientId, sheet) {
  return state.odontogram.filter((row) => {
    if (row.patientId !== patientId) return false;
    const isEvolution = String(row.tooth).startsWith("E:");
    return isEvolution === (sheet === "evolucion");
  });
}

function odontogramSignature(patientId, sheet) {
  return odontogramRowsFor(patientId, sheet)
    .map((row) => `${row.tooth}:${row.findings || row.condition}:${row.note || ""}`)
    .sort()
    .join("|");
}

function odontogramFichaFor(patientId, sheet) {
  const ficha = Odontograma.fichaVacia();
  if (!patientId) return ficha;
  odontogramRowsFor(patientId, sheet).forEach((row) => {
    const tooth = String(row.tooth).replace(/^E:/, "");
    const saved = parseFindings(row.findings);
    if (tooth === Odontograma.CLAVE_FICHA) {
      ficha.spans = Array.isArray(saved.spans) ? saved.spans : [];
      ficha.arcada = saved.arcada || { up: null, down: null };
      ficha.esp = row.note || "";
      return;
    }
    if (!ficha.dientes[tooth]) return;
    ficha.dientes[tooth] = saved.sup || saved.pieza
      ? {
        sup: saved.sup || {},
        pieza: saved.pieza || {},
        box: Array.isArray(saved.box) ? saved.box : [],
        num: saved.num || null,
        nota: saved.nota || ""
      }
      // registro anterior a la norma: una sola condicion por pieza
      : Odontograma.migrarRegistro(row.condition, row.note);
  });
  return Odontograma.normalizarFicha(ficha);
}

function odontogramQueueSave(claves) {
  if (!claves || !claves.length || !odontogramPatientId) return;
  claves.forEach((clave) => odontogramPending.add(clave));
  clearTimeout(odontogramTimer);
  // se agrupa para no mandar una peticion por cada tecla de especificaciones
  odontogramTimer = setTimeout(odontogramFlush, 600);
}

async function odontogramFlush() {
  clearTimeout(odontogramTimer);
  if (!odontogramPending.size || !odontogramView || !odontogramPatientId) return;
  const claves = [...odontogramPending];
  odontogramPending.clear();
  const ficha = odontogramView.ficha();
  const patientId = odontogramPatientId;
  const sheet = odontogramSheet;

  for (const clave of claves) {
    const esFicha = clave === Odontograma.CLAVE_FICHA;
    const tooth = odontogramRowKey(sheet, clave);
    const previo = state.odontogram.find((item) => item.patientId === patientId && item.tooth === tooth);
    const record = {
      id: previo ? previo.id : uid("odo"),
      patientId,
      tooth,
      condition: esFicha ? "Ficha" : (odontogramView.resumenPieza(clave) || "Sano"),
      note: esFicha ? (ficha.esp || "") : (ficha.dientes[clave]?.nota || ""),
      findings: JSON.stringify(esFicha
        ? { spans: ficha.spans, arcada: ficha.arcada }
        : ficha.dientes[clave])
    };
    try {
      await saveOdontogramApi(record);
    } catch (error) {
      alert(error.message);
      return;
    }
    if (previo) Object.assign(previo, record);
    else state.odontogram.push(record);
  }
  odontogramLoadedSign = odontogramSignature(patientId, sheet);
  if (!API_ENABLED) saveState();
}

function odontogramPatientList() {
  return state.patients.map((patient) => {
    const edad = ageFromBirthDate(patient.birthDate);
    return {
      id: patient.id,
      nombre: patient.name || "Paciente",
      doc: patient.dni || "",
      edad: edad === null ? "" : `${edad} años`
    };
  });
}

/* ---- Copias fechadas del odontograma ------------------------------------

   El odontograma vivo se sobrescribe pieza por pieza: al marcar un diente, lo
   que decia antes deja de existir. Eso hace imposible responder "como estaba
   esta boca en junio" y deja el trabajo sin respaldo. Una copia guarda la
   ficha entera con su fecha, quien la hizo y una nota.

   La pantalla NO se limpia al guardar: el odontograma es acumulativo -una
   pieza restaurada sigue restaurada el mes que viene-, asi que empezar de cero
   obligaria a remarcar toda la boca en cada cita. */

let odontogramSnapshotId = "";

/* Una copia por hoja y dia, la ultima guardada. Las repetidas de antes siguen
   en la base -no se borran-, pero no se muestran. */
function copiasDelOdontograma(patientId) {
  const ultima = new Map();
  (state.odontogramSnapshots || [])
    .filter((copia) => copia.patientId === patientId)
    .forEach((copia) => {
      const llave = `${copia.sheet}|${copia.date}`;
      const previa = ultima.get(llave);
      const orden = (item) => `${item.savedAt || ""}|${item.id || ""}`;
      if (!previa || orden(copia) > orden(previa)) ultima.set(llave, copia);
    });
  return [...ultima.values()]
    .sort((a, b) => String(b.savedAt || "").localeCompare(String(a.savedAt || "")));
}

function copiaDelOdontograma(id) {
  return (state.odontogramSnapshots || []).find((copia) => copia.id === id) || null;
}

function piezaVacia(diente) {
  return !Object.keys(diente?.sup || {}).length
    && !Object.keys(diente?.pieza || {}).length
    && !(diente?.box || []).length
    && !diente?.num
    && !String(diente?.nota || "").trim();
}

function fichaDeLaCopia(copia) {
  return Odontograma.normalizarFicha(parseFindings(copia.ficha));
}


/* El dinero del paciente visto desde su historia: lo que pago, cuando y con
   que. Es la primera pestaña porque es lo que mas se consulta al atender -"¿ya
   pago?"-, y hasta ahora habia que salir a Pagos y caja a buscarlo. */
function historialDePagos(patientId) {
  const patient = patientById(patientId);
  if (!patient) return `<p class="muted">Elige un paciente para ver su historial.</p>`;
  /* Todo lo que le paso al paciente en una sola linea de tiempo: la atencion y
     el dinero. Se atiende sin cobrar mas seguido de lo que parece -un control,
     una atencion que se paga despues- y una lista de solo pagos hacia parecer
     que ese dia no vino nadie. */
  const notas = (state.clinicalHistory || [])
    .filter((entry) => entry.patientId === patientId)
    .map((entry) => {
      const saldo = historyBalance(entry.id);
      const precio = Number(entry.agreedPrice || 0);
      const detalle = [entry.reason, entry.procedure].map((texto) => String(texto || "").trim()).filter(Boolean).join(" · ");
      return {
        fecha: entry.date || "",
        orden: 0,
        etiqueta: esSoloDeuda(entry) ? "Deuda" : "Atención",
        clase: esSoloDeuda(entry) ? "warn" : "",
        detalle: detalle || (esSoloDeuda(entry) ? "Cuenta por cobrar" : "Atención sin motivo escrito"),
        segunda: [entry.attendedBy ? `Atendió ${entry.attendedBy}` : "", saldo > 0 ? `Debe ${money(saldo)}` : ""].filter(Boolean).join(" · "),
        medio: "",
        comprobante: "",
        monto: precio,
        sinMonto: precio <= 0,
        // la atencion se abre desde aqui para escribirle la historia clinica
        notaId: entry.id,
      };
    });
  const pagos = (state.payments || [])
    .filter((pago) => pago.patientId === patientId)
    .map((pago) => {
      const descuento = esDescuentoDeTratamiento(pago);
      /* Lo que se le vendio en ese cobro -una cera, un cepillo- vive dentro del
         propio pago. Sin esto la fila decia solo "Pago" y el producto no se
         veia por ningun lado en la historia del paciente. */
      const productos = (Array.isArray(pago.productItems) ? pago.productItems : [])
        .map((item) => {
          const producto = inventoryProductById(item.productId);
          const cantidad = Number(item.quantity || 0);
          const nombre = producto?.name || "Producto";
          return cantidad > 1 ? `${nombre} x${cantidad}` : nombre;
        })
        .filter(Boolean)
        .join(", ");
      const escrito = String(pago.receipt || "").trim();
      return {
        fecha: pago.date || "",
        orden: 1,
        etiqueta: descuento ? "Del tratamiento" : "Pago",
        clase: "",
        detalle: [escrito || (descuento ? "Descuento del tratamiento" : "Pago"), productos].filter(Boolean).join(" · "),
        segunda: descuento ? "No entra a caja: se usa del tratamiento ya pagado" : "",
        medio: descuento ? "Tratamiento" : (pago.method || ""),
        comprobante: pago.comprobante || (pago.sunatComprobante?.serie ? `${pago.sunatComprobante.serie}-${pago.sunatComprobante.numero}` : ""),
        monto: descuento ? Number(pago.descontado || 0) : Number(pago.amount || 0),
        sinMonto: false,
        esPago: !descuento,
      };
    });
  const movimientos = [...notas, ...pagos]
    .sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)) || a.orden - b.orden);
  if (!movimientos.length) return `<p class="muted">${escapeHtml(patient.name)} todavía no tiene atenciones ni pagos registrados.</p>`;
  const cobrado = pagos.filter((item) => item.esPago).reduce((suma, item) => suma + item.monto, 0);
  const filas = movimientos.map((item) => `<tr>
      <td class="hc-fecha">${formatDate(item.fecha)}</td>
      <td><span class="status ${item.clase}">${escapeHtml(item.etiqueta)}</span></td>
      <td>${escapeHtml(item.detalle)}${item.segunda ? `<br><span class="muted">${escapeHtml(item.segunda)}</span>` : ""}</td>
      <td>${escapeHtml(item.medio || "-")}</td>
      <td>${escapeHtml(item.comprobante || "-")}</td>
      <td class="num">${item.sinMonto
        ? `<span class="muted">-</span>`
        // el precio de la atencion va en gris: lo que entro a caja es el pago
        : item.orden === 0 ? `<span class="muted">${money(item.monto)}</span>` : `<strong>${money(item.monto)}</strong>`}</td>
      <td class="num">${item.notaId ? `<button class="small-btn" type="button" data-edit-history="${item.notaId}">Editar</button>` : ""}</td>
    </tr>`).join("");
  /* El boton lleva la atencion al formulario de arriba, con todo lo que ya
     tiene: es donde el doctor escribe la historia clinica de esa visita. Antes
     vivia en la hoja de Historia clinica, que ahora es el formato en papel. */
  return `<article class="hc-hoja">
    <section class="hc-seccion">
      <h4>Historial · ${escapeHtml(patient.name)}</h4>
      <div class="table-wrap"><table class="hc-tabla">
        <thead><tr><th>Fecha</th><th>Tipo</th><th>Detalle</th><th>Medio</th><th>Comprobante</th><th class="num">Monto</th><th></th></tr></thead>
        <tbody>${filas}</tbody>
        <tfoot><tr><td colspan="5">Total cobrado</td><td class="num"><strong>${money(cobrado)}</strong></td><td></td></tr></tfoot>
      </table></div>
    </section>
  </article>`;
}

/* La hoja del odontograma como la pide la norma: el inicial, que es la primera
   revision y no se vuelve a tocar, y el final, que se va actualizando con cada
   control. Cada uno con sus hallazgos, sus especificaciones y la observacion
   que se escribio al guardar esa copia. */


/* La hoja del odontograma como la pide la norma: el inicial, que es la primera
   revision y no se vuelve a tocar, y el final, que se va actualizando con cada
   control. Cada uno con sus hallazgos, sus especificaciones y la observacion
   que se escribio al guardar esa copia. */
function bloqueDelOdontograma(titulo, copia, { pie = "", aviso = "", completo = false } = {}) {
  const dibujo = copia ? dibujoDelOdontograma(fichaDeLaCopia(copia), { completo }) : null;
  const fecha = copia ? `${formatDate(copia.date)}${copia.doctor ? ` · ${escapeHtml(copia.doctor)}` : ""}` : "";
  /* Las dos se escriben en la pantalla del Odontograma -las especificaciones en
     su campo, la observacion al pulsar "Guardar en la historia"- y aqui solo se
     leen: esta hoja es la historia del paciente, no el lugar de trabajo. */
  // las copias viejas guardaban la observacion solo en la nota de la copia
  const observaciones = copia ? (fichaDeLaCopia(copia).obs || copia.note || "") : "";
  const textos = copia
    ? `<p class="hc-observacion"><span>Especificaciones:</span> ${escapeHtml(dibujo?.especificaciones || "-")}</p>
      <p class="hc-observacion"><span>Observaciones:</span> ${escapeHtml(observaciones || "-")}</p>`
    : "";
  return `<section class="hc-seccion hc-seccion-odontograma">
      <div class="odo-hoja-cabecera">
        <h4>${titulo}</h4>
        <p class="odo-hoja-fecha">Fecha: ${fecha ? fecha : "&nbsp;"}</p>
      </div>
      ${aviso ? `<p class="muted">${aviso}</p>` : ""}
      ${dibujo
        ? `<div class="hc-grafico"><div class="odo-raiz hc-grafico-lienzo"><div class="odo-arco">${dibujo.html}</div></div></div>
          ${dibujo.hallazgos.length ? `<ul class="hc-hallazgos">${dibujo.hallazgos.map((item) => `<li><strong>${escapeHtml(item.pieza)}</strong> ${escapeHtml(item.texto)}</li>`).join("")}</ul>` : ""}`
        : `<p class="muted">Todavía no hay una copia guardada. Se guarda desde la pantalla del Odontograma, con "Guardar en la historia".</p>`}
      ${textos}
      ${pie}
    </section>`;
}


function hojaDelOdontograma(patientId, { pantalla = true } = {}) {
  const patient = patientById(patientId);
  if (!patient) return `<p class="muted">Elige un paciente para ver su odontograma.</p>`;
  // de la mas nueva a la mas vieja: la primera revision es la ultima de la lista
  const copias = copiasDelOdontograma(patientId);
  const inicial = copias[copias.length - 1] || null;
  const ultima = copias[0] || null;
  /* Los dos botones del pie: imprimir la hoja, y seguir marcando donde se
     quedo -editar lleva a la pantalla del odontograma con la ultima copia
     cargada, para no volver a empezar-. */
  const imprimir = pantalla && (inicial || ultima)
    ? `<p class="hc-editar-odontograma">
        <button class="small-btn" type="button" data-editar-odontograma="${patientId}">Editar odontograma</button>
        <button class="small-btn" type="button" data-imprimir-odontograma="${patientId}">Imprimir odontograma</button>
      </p>`
    : "";
  const unaSola = inicial && ultima && inicial.id === ultima.id;
  return `<article class="hc-hoja hc-hoja-odontograma">
    ${bloqueDelOdontograma("ODONTOGRAMA INICIAL", inicial, { completo: !pantalla })}
    ${bloqueDelOdontograma("ODONTOGRAMA DE EVOLUCIÓN", ultima, {
      completo: !pantalla,
      pie: imprimir,
      aviso: unaSola ? "Todavía es la misma copia inicial: al guardar el odontograma otro día, este bloque pasa a mostrar el último control." : "",
    })}
  </article>`;
}


/* Las dos hojas del paciente -la inicial y la de evolucion- salen como en el
   formato del Colegio: una por pagina, con su titulo en el recuadro, la fecha
   al costado y, debajo del dibujo, las especificaciones y las observaciones. */
function imprimirOdontogramas(patientId) {
  const patient = patientById(patientId);
  if (!patient) {
    alert("Elige primero un paciente.");
    return;
  }
  if (!copiasDelOdontograma(patientId).length) {
    alert("Todavía no hay ninguna copia guardada del odontograma. Se guarda desde la pantalla del Odontograma, con \"Guardar en la historia\".");
    return;
  }
  // la ventana se abre antes de cualquier espera: despues el navegador la bloquea
  const ventana = window.open("", "_blank", "width=1100,height=900");
  if (!ventana) {
    alert("El navegador bloqueó la ventana de impresión. Permite las ventanas emergentes de esta página.");
    return;
  }
  const config = state.config || {};
  const hojasDeEstilo = [...document.querySelectorAll('link[rel="stylesheet"][href]')]
    .map((link) => `<link rel="stylesheet" href="${escapeHtml(link.href)}">`)
    .join("");
  const edad = ageFromBirthDate(patient.birthDate);
  const cabecera = `<header class="odo-impreso-cabecera">
      <div class="hc-clinica">
        ${config.logoDataUrl ? `<img class="hc-logo" src="${escapeHtml(config.logoDataUrl)}" alt="" />` : ""}
        <div>
          <h3>${escapeHtml(config.clinicName || "Consultorio dental")}</h3>
          <p>${escapeHtml(config.issuerAddress || "")}</p>
        </div>
      </div>
      <div class="odo-impreso-paciente">
        <strong>${escapeHtml(patient.name)}</strong>
        <p>DNI ${escapeHtml(patient.dni || "-")}${edad === null ? "" : ` · ${edad} años`}${patient.historiaNumero ? ` · HC N.° ${escapeHtml(numeroDeHistoria(patient.historiaNumero))}` : ""}</p>
      </div>
    </header>`;
  ventana.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8">
    <base href="${escapeHtml(location.href)}">
    <title>Odontograma ${escapeHtml(patient.name)}</title>
    ${hojasDeEstilo}
    <style>
      @page { size: A4; margin: 0; }
      html, body { background: #fff !important; }
      body { display: block !important; min-height: 0 !important; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .hc-hoja-odontograma { border: 0 !important; border-radius: 0 !important; padding: 0 !important; max-width: 186mm; margin: 0 auto; }
      /* la cabecera vive fuera de la hoja, asi que necesita su mismo ancho y
         centrado: sin esto el logo y el nombre del paciente quedaban pegados
         a los bordes del papel */
      .odo-impreso-cabecera { max-width: 186mm; margin: 0 auto; display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; padding: 12mm 0 4mm; border-bottom: 1.5px solid #000; }
      .odo-impreso-cabecera .hc-clinica { display: flex; align-items: center; gap: 12px; }
      .odo-impreso-cabecera .hc-logo { max-height: 18mm; max-width: 34mm; object-fit: contain; }
      .odo-impreso-cabecera h3 { margin: 0; font-size: 15px; }
      .odo-impreso-cabecera .hc-clinica p { margin: 3px 0 0; font-size: 11px; }
      .odo-impreso-paciente { text-align: right; font-size: 11px; }
      .odo-impreso-paciente p { margin: 2px 0 0; }
      /* cada odontograma en su hoja, como las dos paginas del formato */
      .hc-seccion-odontograma { break-inside: avoid; padding-top: 6mm; }
      .hc-seccion-odontograma + .hc-seccion-odontograma { break-before: page; padding-top: 10mm; }
      .hc-editar-odontograma { display: none !important; }
      .table-wrap { overflow: visible !important; }
    </style></head><body>
    ${cabecera}
    ${hojaDelOdontograma(patient.id, { pantalla: false })}
    <script>
      (function () {
        var impreso = false;
        /* Cuanto mide una hoja A4 de verdad, en los pixeles de esta ventana. Se
           mide en vez de calcularla: asi vale igual en cualquier pantalla. */
        function altoDeLaHoja() {
          var regla = document.createElement("div");
          regla.style.cssText = "position:absolute;visibility:hidden;height:297mm";
          document.body.appendChild(regla);
          var alto = regla.getBoundingClientRect().height;
          regla.parentNode.removeChild(regla);
          return alto;
        }
        /* El dibujo se achica hasta que su bloque entre entero en la hoja, a lo
           ancho y a lo alto. Antes solo se miraba el ancho: el bloque salia mas
           alto que el papel, el navegador lo empujaba a la pagina siguiente y
           dejaba la anterior en blanco. */
        function ajustar() {
          var hoja = altoDeLaHoja();
          var cabecera = document.querySelector(".odo-impreso-cabecera");
          var arriba = cabecera ? cabecera.getBoundingClientRect().height : 0;
          var secciones = document.querySelectorAll(".hc-seccion-odontograma");
          Array.prototype.forEach.call(secciones, function (seccion, i) {
            var caja = seccion.querySelector(".hc-grafico");
            var lienzo = caja && caja.firstElementChild;
            if (!lienzo || !caja.clientWidth) return;
            lienzo.style.zoom = "1";
            var ancho = lienzo.scrollWidth;
            var alto = lienzo.scrollHeight;
            if (!ancho || !alto) return;
            // lo que ocupa el resto del bloque: el titulo, los hallazgos y los textos
            var resto = seccion.getBoundingClientRect().height - caja.getBoundingClientRect().height;
            // la cabecera con el logo solo comparte hoja con el primer bloque
            var sitio = hoja - resto - (i === 0 ? arriba : 0) - 20;
            lienzo.style.zoom = String(Math.max(0.3, Math.min(1, caja.clientWidth / ancho, sitio / alto)));
          });
        }
        function imprimir() {
          if (impreso) return;
          impreso = true;
          ajustar();
          window.focus();
          window.print();
        }
        window.addEventListener("load", function () { setTimeout(imprimir, 300); });
        setTimeout(imprimir, 2500);
      })();
    <\/script></body></html>`);
  ventana.document.close();
}


/* La firma que se esta dibujando ahora mismo: de quien es, sobre que documento
   y si ya hay trazos. Vive fuera porque el lienzo y el boton de guardar la
   miran desde sitios distintos. */
let firmaEnCurso = null;
/* Cual de los consentimientos se esta mirando en la pestana. */
let consentimientoElegido = "";


/* ==================== CONSENTIMIENTOS ====================
   Los textos que el paciente firma antes de cada tratamiento, con su firma
   dibujada. Vienen del sistema dental de EmpresaFacil; aqui se guardan en el
   servidor, en la tabla consentimientos.
   ========================================================== */

/* Los consentimientos que firma el consultorio, tal como estan en sus hojas de
   Word, uno por tratamiento. Viven aparte de clinical.js porque son texto largo
   y fijo: quien los corrija no tiene que entrar al codigo de la historia.

   Cada uno devuelve sus parrafos. El marco -quien firma, el DECLARO con el
   nombre del dentista, la ciudad, la fecha y las firmas- lo pone clinical.js,
   que es igual en todos. Una entrada puede ser texto o { lista: [...] } para
   las enumeraciones de riesgos. */

const CONSENTIMIENTOS = [
  { clave: "ortodoncia", titulo: "Ortodoncia", encabezado: "Consentimiento informado para ortodoncia" },
  { clave: "exodoncia", titulo: "Exodoncia simple", encabezado: "Consentimiento informado para la exodoncia simple" },
  { clave: "tercer-molar", titulo: "Tercer molar", encabezado: "Consentimiento informado para exodoncia quirúrgica de terceros molares incluidos" },
  { clave: "endodoncia", titulo: "Endodoncia", encabezado: "Consentimiento informado para endodoncia" },
  { clave: "rehabilitacion", titulo: "Rehabilitación oral", encabezado: "Consentimiento informado en rehabilitación oral" },
  { clave: "implantes", titulo: "Implantes", encabezado: "Consentimiento informado para implantes dentales" },
];

const CIERRE_COMUN = [
  "He comprendido lo que se me ha explicado de forma clara, con un lenguaje sencillo, habiendo resuelto todas las dudas que se me han planteado, y la información complementaria que he solicitado.",
  "Me queda claro que en cualquier momento y sin necesidad de dar ninguna explicación, puedo revocar este consentimiento.",
];

const ANESTESIA = "El tratamiento que voy a recibir implica la administración de anestesia local, que consiste en proporcionar, mediante una inyección, sustancias que provocan un bloqueo reversible de los nervios, de tal manera que se inhibe transitoriamente la sensibilidad con el fin de realizar el tratamiento sin dolor. Tendré la sensación de adormecimiento del labio o de la cara, que normalmente desaparece en dos o tres horas. La administración de la anestesia puede provocar, en el punto de la inyección, ulceración de la mucosa y dolor, y menos frecuentemente, limitaciones en el movimiento de apertura de la boca, que pueden requerir tratamiento posterior; también puede provocar baja de la presión arterial que, en casos menos frecuentes, puede provocar un síncope o fibrilación ventricular, que deben tratarse posteriormente e, incluso, excepcionalmente, la muerte. Comprendo que, aunque de mis antecedentes personales no se deducen posibles alergias al agente anestésico, la anestesia puede provocar urticaria, dermatitis, asma o edema angioneurótico (asfixia), que en casos extremos puede requerir tratamiento urgente.";

const TEXTOS = {
  ortodoncia: () => [
    "me ha explicado que es conveniente en mi situación proceder a realizar un tratamiento ortodóntico, con objeto de conseguir una mejor alineación de los dientes, para de esta manera prevenir problemas posteriores, mejorando a la vez la masticación y la estética.",
    "Para ello se emplean aparatos de ortodoncia que pueden ser removibles o fijos.",
    "Sé que es posible que los aparatos removibles se pierdan fácilmente si no están en la boca, y que en este caso el costo de reposición correrá por mi cuenta.",
    "El Dentista me ha explicado que los aparatos pueden producir úlceras o llagas, dolor en los dientes que están con los aparatos y que es frecuente que con el tiempo se produzca reabsorción de las raíces, de manera que estas queden más pequeñas, así como la disminución de las encías, que pueden requerir tratamiento posterior. También me ha explicado que el tratamiento puede requerir la extracción de algún o algunos dientes sanos, incluso puede ser necesaria la extracción de las muelas del juicio.",
    "También sé que el tratamiento ortodóntico puede ser largo en el tiempo, meses e incluso años, lo que no depende de la técnica empleada ni de su correcta realización sino de factores generalmente biológicos y de la respuesta de mi organismo, totalmente impredecibles, y que durante todo este tiempo deberé extremar las medidas de higiene de la boca para evitar caries y enfermedad de las encías.",
    "El Dentista me ha explicado que suspenderá el tratamiento si la higiene no es la adecuada, porque corre gran riesgo mi dentición de sufrir lesiones cariosas múltiples u otros padecimientos derivados de la escasez de higiene oral.",
    "Asimismo, me ha informado que tras la conclusión del tratamiento se pueden producir algunos movimientos dentarios no deseados y que deberé acudir periódicamente para ser revisado, para evitar recaídas.",
    ...CIERRE_COMUN,
    "Estoy satisfecho con la información recibida y comprendido el alcance y riesgos de este tratamiento, y por ello, <strong>DOY MI CONSENTIMIENTO</strong> para que se me practique el tratamiento de ortodoncia.",
  ],

  exodoncia: () => [
    "me ha explicado que es conveniente en mi situación realizar la extracción de una o más piezas dentarias:",
    "1. En consecuencia, comprendo que no mantendré esa o esas piezas dentarias y que únicamente podrán ser sustituidas por una prótesis o implante. Que podría recurrir a técnicas conservadoras como la periodoncia o la endodoncia, y las descarto por el estado que presenta, que no hace razonable su conservación.",
    `2. ${ANESTESIA}`,
    "3. La intervención consiste en el empleo alternado de instrumental especializado quirúrgico, aplicando fuerza manual, de leve a moderada, cuya finalidad es movilizar y finalmente extraer del alveolo la pieza o piezas dentales problema.",
    "4. Aunque se me han realizado los medios diagnósticos que se han estimado precisos, comprendo que es posible que el estado inflamatorio del diente o molar que se me va a extraer pueda producir un proceso infeccioso, que puede requerir tratamiento con antibióticos y/o antiinflamatorios; del mismo modo, en el curso del procedimiento puede producirse una hemorragia, que exigiría para cohibirla la colocación en el alvéolo de una torunda de algodón seca u otro producto hemostático, incluso sutura. También sé que en el curso del procedimiento pueden producirse, aunque no es frecuente, la rotura de la corona, heridas en la mucosa de la mejilla o en la lengua, intrusión de la raíz en el seno maxilar o fractura del maxilar, que no dependen de la forma o modo de practicarse la intervención ni de su correcta realización, sino que son imprevisibles, en cuyo caso el cirujano dentista tomará las medidas pertinentes para continuar con el tratamiento.",
    "5. Mi dentista me ha explicado que todo acto quirúrgico lleva implícitas una serie de complicaciones comunes y potencialmente serias que podrían requerir tratamientos complementarios, tanto médicos como quirúrgicos.",
    ...CIERRE_COMUN,
    "Estoy satisfecho con la información recibida y comprendido el alcance y riesgos de este tratamiento, y por ello, <strong>DOY MI CONSENTIMIENTO</strong> para que se me practique el tratamiento de extracción simple.",
  ],

  "tercer-molar": () => [
    "me ha explicado que es conveniente en mi situación proceder a la extracción quirúrgica de terceros molares incluidos, y en consecuencia lo autorizo, junto con sus colaboradores, para que me sea realizado ese procedimiento.",
    "La extracción de las muelas del juicio incluidas está indicada en ocasiones para evitar problemas como dolor, inflamación, infección, formación de quistes, enfermedad periodontal, caries, maloclusión, pérdida prematura de otros dientes y pérdida prematura de hueso.",
    "Este procedimiento se realiza con el fin de conseguir un indudable beneficio; sin embargo, no está exento de posibles complicaciones, algunas de ellas inevitables en casos excepcionales, siendo las estadísticamente más frecuentes:",
    { lista: [
      "Alergia al anestésico u otro medicamento utilizado, antes, durante o después de la cirugía.",
      "Hematoma e hinchazón de la región, hemorragia e infección postoperatoria.",
      "Apertura de los puntos de sutura.",
      "Apertura limitada de la boca durante días o semanas.",
      "Daño a los dientes o tejidos vecinos.",
      "Abandono accidental de un pequeño fragmento de raíz, cuya extracción supondría una ampliación injustificada de la cirugía.",
      "Falta de sensibilidad parcial o total, temporal o permanente, del nervio dentario inferior (labio inferior).",
      "Falta de sensibilidad parcial o total, temporal o permanente, del nervio lingual (lengua y gusto).",
      "Sinusitis o comunicación entre la boca y la nariz o los senos maxilares.",
      "Fracturas óseas y desplazamiento de dientes a estructuras vecinas.",
      "Tragado o aspiración de dientes o de alguna de sus partes.",
      "Rotura de instrumentos o de la aguja de anestesia.",
    ] },
    "En fumadores, los riesgos de infección o de apertura de la herida son mayores. La intervención puede realizarse con anestesia general o local, con el riesgo inherente asociado a las mismas, y los fármacos utilizados pueden producir alteraciones del nivel de conciencia, por lo que no podré realizar determinadas actividades inmediatamente, como conducir un vehículo.",
    "En ocasiones excepcionales, durante la cirugía pueden surgir situaciones imprevistas que obliguen al cirujano a realizar algún procedimiento adicional o distinto al planificado. En ese caso, autorizo al cirujano a tomar las decisiones que crea más justificadas y convenientes para mi salud.",
    ...CIERRE_COMUN,
    "Estoy satisfecho con la información recibida y comprendido el alcance y riesgos de este tratamiento, y por ello, <strong>DOY MI CONSENTIMIENTO</strong> para que se me practique la exodoncia quirúrgica de terceros molares.",
  ],

  endodoncia: () => [
    "me ha explicado que es conveniente en mi situación proceder a realizar el tratamiento endodóntico de mi pieza dentaria, para lo que me ha informado debidamente de lo siguiente:",
    "El propósito principal de la intervención es la eliminación del tejido pulpar inflamado o infectado del interior del diente, para evitar secuelas dolorosas o infecciosas.",
    ANESTESIA,
    "La intervención consiste en la eliminación y el relleno de la cámara pulpar y los tejidos radiculares con un material que selle la cavidad e impida el paso a las bacterias y toxinas infecciosas, conservando el diente o molar.",
    "Se me ha informado que, a pesar de realizarse correctamente la técnica, cabe la posibilidad de que la infección o el proceso quístico o granulomatoso no se eliminen totalmente, por lo que puede ser necesario acudir a la cirugía periapical al cabo de algunas semanas, meses o incluso años. Igualmente, es posible que no se obtenga el relleno total de los conductos, por lo que también puede ser necesario repetir el tratamiento, como en el caso de que el relleno quede corto o largo.",
    "También me ha advertido que es muy posible que después de la endodoncia el diente cambie de color y se oscurezca ligeramente, y que es frecuente que el diente o molar tratado se debilite y tienda a fracturarse, por lo que puede ser necesario realizar coronas protésicas e insertar refuerzos interradiculares.",
    "Me ha informado de que todo acto quirúrgico lleva implícitas una serie de complicaciones comunes y potencialmente serias que podrían requerir tratamientos complementarios, tanto médicos como quirúrgicos.",
    ...CIERRE_COMUN,
    "Estoy satisfecho con la información recibida y comprendido el alcance y riesgos de este tratamiento, y por ello, <strong>DOY MI CONSENTIMIENTO</strong> para que se me practique el tratamiento de endodoncia.",
  ],

  rehabilitacion: () => [
    "me ha explicado que es conveniente en mi situación proceder a realizar un tratamiento de rehabilitación oral, que puede precisar distintos tipos de técnicas y tratamientos, entre ellos:",
    `1. Anestesia local. ${ANESTESIA}`,
    "2. Extracciones simples. La intervención consiste en la aplicación de un fórceps a la corona, practicando la luxación con movimientos de lateralidad, de manera que pueda desprenderse fácilmente del alvéolo donde está insertada. Comprendo que el estado inflamatorio del diente puede producir un proceso infeccioso que requiera antibióticos y/o antiinflamatorios, y que en el curso del procedimiento puede producirse una hemorragia, la rotura de la corona, heridas en la mucosa de la mejilla o en la lengua, inserción de la raíz en el seno maxilar o fractura del maxilar o de la tuberosidad, que son imprevisibles.",
    "3. Obturaciones o empastes. El propósito principal es restaurar los tejidos dentarios duros y proteger la pulpa, para conservar el diente o molar y su función, restableciendo al tiempo, siempre que sea posible, la estética adecuada. Es frecuente que se produzca una mayor sensibilidad, sobre todo al frío, que normalmente desaparecerá de modo espontáneo. Comprendo que el sellado hermético puede reactivar procesos infecciosos que hagan necesaria la endodoncia y que, especialmente si la caries es profunda, el diente puede quedar frágil y ser necesario otro tipo de reconstrucción o una funda protésica. También comprendo que es posible que no me encuentre satisfecho con la forma o el color del diente tras el tratamiento, porque las cualidades de los empastes nunca serán idénticas a su aspecto sano.",
    "4. Endodoncia. El propósito principal es la eliminación del tejido pulpar inflamado o infectado, o de un proceso granulomatoso o quístico, rellenando la cámara pulpar y los tejidos radiculares con un material que selle la cavidad. A pesar de realizarse correctamente la técnica, cabe la posibilidad de que la infección no se elimine totalmente y sea necesaria una apicectomía al cabo de semanas, meses o años; que no se obtenga el relleno total de los conductos y haya que repetir el tratamiento; que el diente cambie de color y se oscurezca; y que se debilite y tienda a fracturarse, por lo que puede ser necesario realizar coronas protésicas e insertar espigos.",
    "5. Prótesis. Me ha explicado la necesidad de tallar los pilares de la prótesis, lo que conlleva la posibilidad de aproximación excesiva a la cámara pulpar, que obligaría a realizar una endodoncia y, en algunos casos, si el muñón quedase frágil, a realizar un espigo colado o de fibra. También se me ha explicado la necesidad de mantener una higiene escrupulosa para evitar caries, gingivitis y enfermedad periodontal, y la importancia de las visitas periódicas —entre seis meses y un año— para controlar la situación de la prótesis y su entorno. Existe la posibilidad de fractura de cualquiera de los componentes de la prótesis, muy relacionada con el uso que yo haga de la misma.",
    "El Dentista me ha explicado que todo acto odontológico lleva implícitas una serie de complicaciones comunes y potencialmente serias que podrían requerir tratamientos complementarios, tanto médicos como quirúrgicos.",
    ...CIERRE_COMUN,
    "Estoy satisfecho con la información recibida y comprendido el alcance y riesgos de este tratamiento, y por ello, <strong>DOY MI CONSENTIMIENTO</strong> para que se me practique el tratamiento de rehabilitación oral.",
  ],

  implantes: () => [
    "me ha explicado que el propósito de la intervención es la reposición de los dientes perdidos mediante la fijación de tornillos o láminas al hueso, y posteriormente la colocación de uno o más pilares metálicos que soportarán las futuras piezas dentales artificiales.",
    "He sido informado de otras alternativas de tratamiento mediante la utilización de prótesis convencionales. Para llevar a cabo el procedimiento se aplicará anestesia, de cuyos posibles riesgos también he sido informado. Igualmente se me ha informado de que existen ciertos riesgos potenciales en toda intervención quirúrgica realizada en la boca, concretamente:",
    { lista: [
      "Alergia al anestésico, antes, durante o después de la cirugía.",
      "Molestias, hematomas e inflamación postoperatoria durante los primeros días.",
      "Sangrado e infección postoperatoria que requiera tratamiento posterior.",
      "Lesión de raíces de dientes adyacentes.",
      "Lesión nerviosa que provoque hipoestesia o anestesia del labio inferior, superior, mentón, dientes, encía y/o lengua, que suele ser transitoria y excepcionalmente permanente.",
      "Comunicación con los senos nasales o con las fosas nasales.",
      "Aspiración o deglución de algún instrumento quirúrgico de pequeño tamaño.",
      "Desplazamiento del implante a estructuras vecinas y rotura de instrumentos.",
    ] },
    "Los implantes se utilizan ampliamente en todo el mundo desde hace más de 25 años y son un procedimiento considerado seguro por la comunidad internacional; sin embargo, se me ha explicado que, aunque la técnica se realice correctamente, existe un porcentaje de fracasos de entre el 8 y el 10 por ciento. He sido informado de las complicaciones potenciales de este procedimiento quirúrgico, que incluyen además de las anteriores:",
    { lista: [
      "Apertura de la sutura y exposición del implante.",
      "Falta de integración del implante con el hueso que lo rodea, con la consiguiente pérdida precoz o tardía del implante y la posible replanificación de la prótesis.",
      "Imposibilidad de colocar un implante en la localización prevista, por las características del hueso remanente.",
      "En casos excepcionales, con atrofia ósea importante, fractura mandibular que requiera tratamiento posterior.",
      "Fractura del implante o de algún componente de la prótesis.",
      "Complicaciones inherentes a la prótesis dental: no cumplir las expectativas estéticas, dificultad para la fonación, etc.",
    ] },
    "Entiendo que el tratamiento no concluye con la colocación del implante, sino que será preciso visitar periódicamente al profesional y seguir escrupulosamente las normas de higiene que me ha explicado.",
    ...CIERRE_COMUN,
    "Estoy satisfecho con la información recibida y comprendido el alcance y riesgos de este tratamiento, y por ello, <strong>DOY MI CONSENTIMIENTO</strong> para que se me practique el tratamiento de implantes.",
  ],
};


// lo que el sistema todavia no sabe se imprime como linea para llenar a mano
const RAYA = `<span class="ci-raya"></span>`;

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "setiembre", "octubre", "noviembre", "diciembre"];

/* Mayor o menor de edad sale de la fecha de nacimiento que ya esta en la ficha;
   sin fecha no se afirma nada y queda la linea para escribirlo.

   El parrafo del representante legal va siempre, tambien en la hoja de un
   adulto, porque asi esta el papel que se firma. */
function bloqueDeQuienFirma(patient) {
  const edad = ageFromBirthDate(patient.birthDate);
  /* El nombre del representado solo se escribe en la hoja de un menor: en la de
     un adulto ese parrafo entero queda en blanco, porque nadie firma por el. */
  const menor = edad !== null && edad < 18;
  const condicion = edad === null ? RAYA : (menor ? "menor de edad" : "mayor de edad");
  // lo que la ficha ya sabe se escribe; lo que falta queda como linea
  const dato = (valor) => (String(valor || "").trim() ? `<strong>${escapeHtml(String(valor).trim())}</strong>` : RAYA);
  /* Sin representante registrado la linea queda vacia entera: poner ahi el
     domicilio del paciente seria atribuirselo a alguien que no existe. Si hay
     representante y no se anoto su domicilio, se asume el del paciente, que es
     lo normal en un menor que vive con quien lo acompaña. */
  const domicilioDelRepresentante = String(patient.guardianName || "").trim()
    ? (patient.guardianAddress || patient.address)
    : "";
  return `<p class="ci-parrafo">Yo <strong>${escapeHtml(patient.name)}</strong> (como paciente), con DNI No. <strong>${escapeHtml(patient.dni || "")}</strong>, ${condicion}, y con domicilio en ${dato(patient.address)}</p>
    <p class="ci-parrafo">o Yo ${dato(patient.guardianName)} con DNI No. ${dato(patient.guardianDni)} mayor de edad, y con domicilio en ${dato(domicilioDelRepresentante)} en calidad de representante legal de ${menor ? `<strong>${escapeHtml(patient.name)}</strong>${patient.guardianRelation ? ` (${escapeHtml(patient.guardianRelation)})` : ""}` : RAYA}.</p>`;
}

/* En la agenda la doctora se llama por su nombre corto -"Maghy"-, pero un
   consentimiento es un documento y ahi va el nombre completo. Se busca entre
   los usuarios registrados por su primer nombre; si hubiera dos que empiezan
   igual no se adivina: se deja lo que diga la ficha. */
function usuarioDelDoctor(etiqueta) {
  const corto = String(etiqueta || "").trim();
  if (!corto) return null;
  const enMinusculas = (texto) => String(texto || "").trim().toLocaleLowerCase("es");
  const usuarios = (state.users || []).filter((usuario) => usuario.active !== false && String(usuario.name || "").trim());
  const exacto = usuarios.find((usuario) => enMinusculas(usuario.name) === enMinusculas(corto));
  if (exacto) return exacto;
  const clinicos = ["DOCTOR", "DOCTOR_TRABAJADOR", "ADMIN"];
  const candidatos = usuarios.filter((usuario) =>
    clinicos.includes(usuario.role) && enMinusculas(usuario.name).split(/\s+/)[0] === enMinusculas(corto));
  return candidatos.length === 1 ? candidatos[0] : null;
}

function nombreCompletoDelDoctor(etiqueta) {
  const corto = String(etiqueta || "").trim();
  return usuarioDelDoctor(corto)?.name.trim() || corto;
}


/* Una sola hoja para todos: cambia el titulo y los parrafos, que viven en
   consentimientos.js. El resto -quien firma, el DECLARO con el nombre del
   dentista, la ciudad, la fecha y las firmas- es igual en todos los
   tratamientos y se arma aqui. */
function armarConsentimiento(clave, patient, opciones = {}) {
  const definicion = CONSENTIMIENTOS.find((item) => item.clave === clave);
  const parrafos = TEXTOS[clave];
  if (!definicion || !parrafos) return "";
  const config = state.config || {};
  const hoy = new Date();
  const ciudad = config.issuerDistrict || config.issuerProvince || "";
  const dentista = nombreCompletoDelDoctor(patient.doctor || (config.doctors || [])[0] || "");
  const bloques = parrafos().map((parrafo, indice) => {
    if (parrafo && parrafo.lista) {
      return `<ul class="ci-lista">${parrafo.lista.map((item) => `<li>${item}</li>`).join("")}</ul>`;
    }
    // el primero cuelga del DECLARO y lleva el nombre del cirujano dentista
    return indice === 0
      ? `<p class="ci-parrafo">Que el Cirujano Dentista ${dentista ? `<strong>${escapeHtml(dentista)}</strong>` : RAYA} ${parrafo}</p>`
      : `<p class="ci-parrafo">${parrafo}</p>`;
  }).join("");
  return `<h5 class="ci-titulo">${escapeHtml(definicion.encabezado)}</h5>
    ${bloqueDeQuienFirma(patient)}
    <p class="ci-declaro">DECLARO</p>
    ${bloques}
    <p class="ci-parrafo">En ${ciudad ? `<strong>${escapeHtml(ciudad)}</strong>` : RAYA}, ${hoy.getDate()} de ${MESES[hoy.getMonth()]} del ${hoy.getFullYear()}.</p>
    ${bloqueDeFirmas(patient, clave, opciones)}`;
}

/* Un consentimiento firmado no se cambia: es el documento que respalda la
   atencion. Si hubo un error se firma uno nuevo, no se corrige el anterior. */
function guardarFirmaDelConsentimiento(patientId, tipo, firma) {
  const patient = patientById(patientId);
  if (!patient || !tipo || !firma) return false;
  if (!canManageClinical()) {
    alert("Tu usuario no puede registrar consentimientos.");
    return false;
  }
  if (consentimientoFirmado(patientId, tipo)) {
    alert("Este consentimiento ya está firmado.");
    return false;
  }
  const consentimiento = {
    id: uid("consent"),
    patientId,
    tipo,
    fecha: todayISO(),
    firma,
    firmante: patient.name || "",
    doctor: patient.doctor || "",
    registradoPor: currentUser()?.name || "",
    createdAt: new Date().toISOString(),
  };
  state.consentimientos.push(consentimiento);
  /* Se guarda en el servidor sin hacer esperar al paciente: la hoja ya se ve
     firmada en pantalla. Si el envio falla se avisa y se quita de la lista,
     para que nadie se quede creyendo que firmo algo que no se guardo. */
  saveConsentimientoApi(consentimiento).catch((error) => {
    state.consentimientos = state.consentimientos.filter((item) => item.id !== consentimiento.id);
    renderClinicalHistory();
    alert("No se pudo guardar el consentimiento: " + (error?.message || "error de conexión"));
  });
  addLocalAuditEvent(
    "CONSENTIMIENTO_FIRMADO",
    `Firmó el consentimiento de ${tipo}: ${patient.name || "Paciente"}`,
    patientId
  );
  return true;
}

function consentimientoFirmado(patientId, tipo) {
  return (state.consentimientos || []).find((item) => item.patientId === patientId && item.tipo === tipo) || null;
}

/* La firma del paciente se dibuja en la pantalla y se queda con el documento.
   La del dentista va a mano sobre el papel: es quien lo entrega, y su sello y
   su colegiatura van ahi mismo. */
function bloqueDeFirmas(patient, tipo, { pantalla = true } = {}) {
  const firmado = consentimientoFirmado(patient.id, tipo);
  const firma = firmado?.firma
    ? `<img class="ci-firma" src="${escapeHtml(firmado.firma)}" alt="Firma del paciente" />
      <small>Firmado el ${formatDate(firmado.fecha)}${firmado.firmante ? ` por ${escapeHtml(firmado.firmante)}` : ""}</small>`
    : pantalla
      ? `<button class="small-btn" type="button" data-firmar-consentimiento="${tipo}">Firmar aquí</button>`
      : "";
  // el COP se guarda en el usuario de la doctora; si no lo puso, queda la linea
  const cop = usuarioDelDoctor(patient.doctor || (state.config?.doctors || [])[0] || "")?.cop || "";
  return `<div class="ci-firmas">
      <div>${firma}Paciente o Representante legal</div>
      <div>Cirujano Dentista<br>COP N.º ${cop ? escapeHtml(cop) : RAYA}</div>
    </div>`;
}

function hojaDelConsentimiento(patientId) {
  const patient = patientById(patientId);
  if (!patient) return `<p class="muted">Elige un paciente para ver su consentimiento.</p>`;
  const config = state.config || {};
  const elegido = consentimientoElegido || "";
  const opciones = CONSENTIMIENTOS.map((item) =>
    `<button class="hc-pestana${item.clave === elegido ? " activa" : ""}" type="button" data-consentimiento="${item.clave}">${escapeHtml(item.titulo)}</button>`
  ).join("");
  const titulo = CONSENTIMIENTOS.find((item) => item.clave === elegido)?.titulo || "";
  const hayTexto = Boolean(TEXTOS[elegido]);
  const cuerpo = hayTexto
    ? `<div class="ci-hoja">
        <header class="hc-cabecera">
          <div class="hc-clinica">
            ${config.logoDataUrl ? `<img class="hc-logo" src="${escapeHtml(config.logoDataUrl)}" alt="" />` : ""}
            <div>
              <h3>${escapeHtml(config.clinicName || "Consultorio dental")}</h3>
              <p>${escapeHtml(config.issuerAddress || "")}</p>
            </div>
          </div>
        </header>
        ${armarConsentimiento(elegido, patient)}
        <p class="hc-editar-odontograma"><button class="small-btn" type="button" data-imprimir-consentimiento="${elegido}">Imprimir consentimiento</button></p>
      </div>`
    : `<p class="muted">${elegido
      ? `Consentimiento de ${escapeHtml(titulo.toLowerCase())} para ${escapeHtml(patient.name)}: en preparación.`
      : "Elige el tratamiento del que se firma el consentimiento."}</p>`;
  return `<article class="hc-hoja">
    <section class="hc-seccion">
      <h4>Consentimiento informado</h4>
      <div class="hc-pestanas hc-pestanas-hijas">${opciones}</div>
      ${cuerpo}
    </section>
  </article>`;
}

/* La hoja firmada se entrega en papel, asi que se imprime sola, sin la pantalla
   alrededor: misma ventana aparte que usa la historia clinica. */
function imprimirConsentimiento(patientId, clave) {
  const patient = patientById(patientId);
  if (!patient || !TEXTOS[clave]) return;
  const config = state.config || {};
  const ventana = window.open("", "_blank");
  if (!ventana) {
    alert("El navegador bloqueó la ventana de impresión. Permite las ventanas emergentes e inténtalo de nuevo.");
    return;
  }
  ventana.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8" />
    <title>Consentimiento · ${escapeHtml(patient.name)}</title>
    <base href="${location.origin}${location.pathname}" />
    <link rel="stylesheet" href="../../assets/css/design-system.css" />
    <link rel="stylesheet" href="styles.css" />
    <style>
      /* Sin margen de pagina el navegador no imprime su encabezado con el
         titulo y la direccion -"about:blank"- encima de la hoja del paciente.
         El margen real lo pone el documento. */
      @page { size: A4; margin: 0; }
      html, body { background: #fff !important; }
      body { display: block !important; min-height: 0 !important; margin: 0; padding: 0; }
      .ci-hoja { max-width: 178mm; margin: 0 auto; padding: 16mm 0; }
      .ci-parrafo { break-inside: avoid; }
    </style></head><body>
    <div class="ci-hoja">
      <header class="hc-cabecera">
        <div class="hc-clinica">
          ${config.logoDataUrl ? `<img class="hc-logo" src="${escapeHtml(config.logoDataUrl)}" alt="" />` : ""}
          <div>
            <h3>${escapeHtml(config.clinicName || "Consultorio dental")}</h3>
            <p>${escapeHtml(config.issuerAddress || "")}</p>
          </div>
        </div>
      </header>
      ${armarConsentimiento(clave, patient, { pantalla: false })}
    </div>
    <script>window.addEventListener("load", function () { setTimeout(function () { window.print(); }, 350); });<\/script>
    </body></html>`);
  ventana.document.close();
}


function abrirFirmaDelConsentimiento(patientId, tipo) {
  if (!patientId || !tipo) return;
  if (!canManageClinical()) {
    alert("Tu usuario no puede registrar consentimientos.");
    return;
  }
  prepararLienzoDeFirma(
    { patientId, tipo },
    `${patientById(patientId)?.name || "El paciente"} firma con el dedo o con el mouse dentro del recuadro.`
  );
}


/* La firma del profesional se dibuja en el momento, en el mismo recuadro que la
   del paciente, y se guarda DENTRO de esa historia junto con quien firmo y
   cuando. No se guarda una firma reutilizable: una imagen guardada dejaria que
   cualquiera con acceso al sistema sacara historias firmadas sin que el doctor
   se entere. */
function abrirFirmaDelProfesional(historiaId) {
  if (!canManageClinical()) {
    alert("Tu usuario no puede firmar historias clínicas.");
    return;
  }
  const entrada = state.clinicalHistory.find((item) => item.id === historiaId);
  if (!entrada) return;
  if (entrada.firma && !confirm(`Esta historia ya está firmada por ${entrada.firmadaPor || "el profesional"}. ¿Reemplazar la firma por la tuya?`)) return;
  const quien = currentUser();
  prepararLienzoDeFirma(
    { destino: "historia", historiaId },
    `${quien?.name || "El profesional"} firma con el dedo o con el mouse dentro del recuadro.`
  );
}


/* El recuadro de firmar es grande y en una tablet se dibuja al doble de puntos
   por pulgada, asi que la imagen tal cual pesa cinco veces mas de lo que hace
   falta y se guarda dentro del estado que viaja a la nube en cada cambio. Se
   recorta al trazo -casi todo el recuadro es aire- y se baja a un ancho fijo,
   que para una firma sobra: queda en una fraccion de lo que pesaba. */
function firmaComprimida(lienzo, anchoMaximo = 420) {
  const pincel = lienzo.getContext("2d");
  let datos;
  try {
    datos = pincel.getImageData(0, 0, lienzo.width, lienzo.height).data;
  } catch (error) {
    return lienzo.toDataURL("image/png");
  }
  let izq = lienzo.width;
  let der = -1;
  let arr = lienzo.height;
  let aba = -1;
  for (let y = 0; y < lienzo.height; y += 1) {
    for (let x = 0; x < lienzo.width; x += 1) {
      if (datos[(y * lienzo.width + x) * 4 + 3] > 12) {
        if (x < izq) izq = x;
        if (x > der) der = x;
        if (y < arr) arr = y;
        if (y > aba) aba = y;
      }
    }
  }
  if (der < 0) return "";
  const margen = 8;
  izq = Math.max(0, izq - margen);
  arr = Math.max(0, arr - margen);
  der = Math.min(lienzo.width - 1, der + margen);
  aba = Math.min(lienzo.height - 1, aba + margen);
  const ancho = der - izq + 1;
  const alto = aba - arr + 1;
  const escala = Math.min(1, anchoMaximo / ancho);
  const destino = document.createElement("canvas");
  destino.width = Math.max(1, Math.round(ancho * escala));
  destino.height = Math.max(1, Math.round(alto * escala));
  const copia = destino.getContext("2d");
  copia.imageSmoothingQuality = "high";
  copia.drawImage(lienzo, izq, arr, ancho, alto, 0, 0, destino.width, destino.height);
  /* Se queda con la mas liviana de las dos: webp suele pesar la cuarta parte en
     un trazo como este, pero si el navegador no lo sabe hacer devuelve un png
     disfrazado y entonces gana el png de verdad. */
  const png = destino.toDataURL("image/png");
  const webp = destino.toDataURL("image/webp", 0.9);
  return webp.startsWith("data:image/webp") && webp.length < png.length ? webp : png;
}


function prepararLienzoDeFirma(datos, pistaTexto) {
  const dialogo = $("#signatureDialog");
  const lienzo = $("#signatureCanvas");
  if (!dialogo || !lienzo) return;
  firmaEnCurso = { ...datos, trazos: false };
  const pista = $("#signatureHint");
  if (pista) pista.textContent = pistaTexto;
  dialogo.showModal();
  const escala = window.devicePixelRatio || 1;
  const ancho = lienzo.clientWidth || 640;
  const alto = lienzo.clientHeight || 220;
  lienzo.width = Math.round(ancho * escala);
  lienzo.height = Math.round(alto * escala);
  const pincel = lienzo.getContext("2d");
  pincel.scale(escala, escala);
  pincel.clearRect(0, 0, ancho, alto);
  pincel.lineWidth = 2.2;
  pincel.lineCap = "round";
  pincel.lineJoin = "round";
  pincel.strokeStyle = "#17323d";
  firmaEnCurso.pincel = pincel;
}

function bindFirmaDelConsentimiento() {
  const lienzo = $("#signatureCanvas");
  if (!lienzo) return;
  let dibujando = false;
  const punto = (evento) => {
    const caja = lienzo.getBoundingClientRect();
    return { x: evento.clientX - caja.left, y: evento.clientY - caja.top };
  };
  lienzo.addEventListener("pointerdown", (evento) => {
    if (!firmaEnCurso?.pincel) return;
    evento.preventDefault();
    dibujando = true;
    lienzo.setPointerCapture(evento.pointerId);
    const p = punto(evento);
    firmaEnCurso.pincel.beginPath();
    firmaEnCurso.pincel.moveTo(p.x, p.y);
  });
  lienzo.addEventListener("pointermove", (evento) => {
    if (!dibujando || !firmaEnCurso?.pincel) return;
    evento.preventDefault();
    const p = punto(evento);
    firmaEnCurso.pincel.lineTo(p.x, p.y);
    firmaEnCurso.pincel.stroke();
    firmaEnCurso.trazos = true;
  });
  ["pointerup", "pointercancel", "pointerleave"].forEach((nombre) => {
    lienzo.addEventListener(nombre, () => { dibujando = false; });
  });

  // addEventListener directo: "on" vive dentro de bindEvents y aqui no existe
  $("#clearSignatureBtn")?.addEventListener("click", () => {
    if (!firmaEnCurso?.pincel) return;
    firmaEnCurso.pincel.clearRect(0, 0, lienzo.width, lienzo.height);
    firmaEnCurso.trazos = false;
  });

  $("#saveSignatureBtn")?.addEventListener("click", () => {
    if (!firmaEnCurso) return;
    if (!firmaEnCurso.trazos) {
      alert("Todavía no hay ninguna firma dibujada.");
      return;
    }
    const imagen = firmaComprimida(lienzo);
    if (!imagen) return;
    if (firmaEnCurso.destino === "historia") {
      const entrada = state.clinicalHistory.find((item) => item.id === firmaEnCurso.historiaId);
      if (!entrada) return;
      const quien = currentUser();
      entrada.firma = imagen;
      entrada.firmadaPor = quien?.name || "";
      // la hora del consultorio, no la de Greenwich: toISOString restaba 5 horas
      const ahora = new Date();
      entrada.firmadaEl = `${todayISO()}T${String(ahora.getHours()).padStart(2, "0")}:${String(ahora.getMinutes()).padStart(2, "0")}`;
      saveClinicalHistoryApi(entrada).catch((error) => alert(error.message));
          addLocalAuditEvent("HISTORIA_CLINICA_FIRMADA", `Firmó la historia clínica de ${patientById(entrada.patientId)?.name || "un paciente"}`, entrada.patientId);
      firmaEnCurso = null;
      $("#signatureDialog")?.close("ok");
      renderClinicalHistory();
      return;
    }
    const guardado = guardarFirmaDelConsentimiento(firmaEnCurso.patientId, firmaEnCurso.tipo, imagen);
    if (!guardado) return;
    firmaEnCurso = null;
    $("#signatureDialog")?.close("ok");
    // render vive dentro de bindEvents; aqui se redibuja la hoja del paciente
    renderClinicalHistory();
  });
}


/* ==================== PLAN DE TRATAMIENTO ====================
   El presupuesto que sale del odontograma, la ventana de precios donde el
   consultorio escribe lo que cobra, y las proformas que se le entregan al
   paciente. Viene del sistema dental de EmpresaFacil, adaptado a esta base:
   aqui el presupuesto del paciente y la lista de precios viven en el servidor.
   ============================================================ */

let historySheetTab = "historia";
let planSubTab = "plan";
let serviciosBorrador = null;

/* Arma la proforma de hoy con lo que el presupuesto tiene en pantalla: sus
   lineas, sus precios y su descuento, mas quien la da. Se congela aqui para que
   no la mueva nada de lo que cambie despues. */
function proformaDelPresupuesto(patientId) {
  const patient = patientById(patientId);
  if (!patient) return null;
  const { guardado, lineas: todas } = lineasDelPresupuesto(patientId);
  const lineas = todas
    .filter((linea) => !linea.quitada)
    .map((linea) => ({
      pieza: linea.pieza,
      detalle: linea.detalle,
      servicio: linea.servicio,
      cantidad: Math.max(1, Number(linea.cantidad || 1)),
      precio: Number(linea.precio || 0)
    }));
  if (!lineas.length) return null;
  const doctor = patient.doctor || "";
  return {
    id: uid("prof"),
    patientId,
    patientName: patient.name,
    date: todayISO(),
    numero: Math.max(0, ...(state.proformas || []).map((item) => Number(item.numero || 0))) + 1,
    lineas,
    descuento: Math.min(100, Math.max(0, guardado.descuento)),
    doctor,
    cop: ""
  };
}


/* Una proforma es el presupuesto congelado del dia en que se dio: el paciente
   se la lleva y el consultorio sabe que precio le dijo. Por eso guarda sus
   lineas y sus precios, y no se recalcula nunca mas aunque cambien la lista de
   servicios o el odontograma. Si otro dia vuelve, la siguiente proforma sale
   sola con lo que quede pendiente: al hacer el trabajo, el odontograma pasa de
   rojo a azul y esa linea ya no aparece. */
function proformasDelPaciente(patientId) {
  return (state.proformas || [])
    .filter((item) => item.patientId === patientId)
    .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")) || String(b.id).localeCompare(String(a.id)));
}


const numeroDeProforma = (numero) => `P-${String(numero || 0).padStart(4, "0")}`;


/* Lo que suman las lineas de una proforma. Las dadas antes de que existiera la
   cantidad no la traen: valen por una, que es lo que decian cuando se
   imprimieron. */
const sumaDeLaProforma = (proforma) => (proforma?.lineas || [])
  .reduce((total, linea) => total + Number(linea.precio || 0) * Math.max(1, Number(linea.cantidad || 1)), 0);


/* La hoja que se imprime y se lleva el paciente: el logo del consultorio, sus
   datos, lo que se le va a hacer con su precio, el total y hasta cuando vale.
   La misma en pantalla y en papel. */
function hojaDeLaProforma(proforma) {
  const patient = patientById(proforma.patientId);
  const config = state.config || {};
  const subtotal = sumaDeLaProforma(proforma);
  const rebaja = Math.round(subtotal * Number(proforma.descuento || 0)) / 100;
  return `<article class="hc-hoja proforma-hoja">
    <header class="hc-cabecera">
      <div class="hc-clinica">
        ${config.logoDataUrl ? `<img class="hc-logo" src="${escapeHtml(config.logoDataUrl)}" alt="" />` : ""}
        <div>
          <h3>${escapeHtml(config.clinicName || "Consultorio dental")}</h3>
          <p>${escapeHtml(config.issuerAddress || "")}${config.phone ? ` · ${escapeHtml(config.phone)}` : ""}</p>
        </div>
      </div>
      <div class="hc-numero">
        <strong>Proforma ${escapeHtml(numeroDeProforma(proforma.numero))}</strong>
        <p>${formatDate(proforma.date)}</p>
      </div>
    </header>
    <h3 class="proforma-titulo">Presupuesto de tratamiento</h3>
    <p class="proforma-paciente"><span>Paciente</span> <strong>${escapeHtml(patient?.name || proforma.patientName || "")}</strong>${patient?.dni ? ` · DNI ${escapeHtml(patient.dni)}` : ""}</p>
    <div class="table-wrap"><table class="hc-tabla">
      <thead><tr><th>Pieza</th><th>Tratamiento</th><th class="num">Cantidad</th><th class="num">Precio unitario</th><th class="num">Total</th></tr></thead>
      <tbody>${(proforma.lineas || []).map((linea) => {
        const cantidad = Math.max(1, Number(linea.cantidad || 1));
        return `<tr>
        <td><strong>${escapeHtml(linea.pieza || "")}</strong></td>
        <td>${escapeHtml(linea.detalle || "")}</td>
        <td class="num">${cantidad}</td>
        <td class="num">${money(linea.precio || 0)}</td>
        <td class="num">${money(Number(linea.precio || 0) * cantidad)}</td>
      </tr>`;
      }).join("")}</tbody>
      <tfoot>
        <tr><td colspan="4">Suma de los tratamientos</td><td class="num">${money(subtotal)}</td></tr>
        ${Number(proforma.descuento || 0) > 0
          ? `<tr><td colspan="4">Descuento ${escapeHtml(String(proforma.descuento))} %</td><td class="num">− ${money(rebaja)}</td></tr>`
          : ""}
        <tr class="proforma-total"><td colspan="4"><strong>Total</strong></td><td class="num"><strong>${money(subtotal - rebaja)}</strong></td></tr>
      </tfoot>
    </table></div>
    <p class="proforma-nota">Este presupuesto cubre los tratamientos detallados arriba. Los precios se mantienen 30 días desde la fecha de esta proforma. Si durante el tratamiento aparece algo que hoy no se ve, se conversa antes de hacerlo.</p>
    <footer class="hc-firma">
      <div>${escapeHtml(proforma.doctor || "")}<br>Cirujano dentista${proforma.cop ? ` · COP N.° ${escapeHtml(proforma.cop)}` : ""}</div>
      <div>Firma del paciente</div>
    </footer>
  </article>`;
}


/* Aceptar la proforma es abrir el tratamiento: desde ese momento el paciente
   debe ese total y lo va abonando, y cada trabajo que se le hace se descuenta
   de lo abonado. Es la misma mecanica que ya lleva la ortodoncia, asi que Pagos
   y caja lo cobra sin aprender nada nuevo. */
async function aceptarProforma(proformaId) {
  const proforma = (state.proformas || []).find((item) => item.id === proformaId);
  if (!proforma || proforma.aceptadaEl || !canManageClinical()) return;
  const patient = patientById(proforma.patientId);
  if (!patient) return;
  const suma = sumaDeLaProforma(proforma);
  const total = suma - Math.round(suma * Number(proforma.descuento || 0)) / 100;
  if (!confirm(`${patient.name} acepta la proforma ${numeroDeProforma(proforma.numero)} por ${money(total)}.\n\nSe abre su tratamiento con ese monto: desde ahora se le cobra a cuenta en Pagos y caja y cada trabajo se descuenta de lo abonado. ¿Continuar?`)) return;
  const tratamiento = {
    id: uid("h"),
    patientId: proforma.patientId,
    date: todayISO(),
    attendedBy: proforma.doctor || patient.doctor || "",
    attended: true,
    reason: `Plan de tratamiento ${numeroDeProforma(proforma.numero)}`,
    procedure: (proforma.lineas || []).map((linea) => {
      const cantidad = Math.max(1, Number(linea.cantidad || 1));
      return `${linea.pieza ? `${linea.pieza} ` : ""}${linea.detalle}${cantidad > 1 ? ` x${cantidad}` : ""}`.trim();
    }).join(" · "),
    plan: `Plan ${numeroDeProforma(proforma.numero)}`,
    planBudget: total,
    agreedPrice: 0,
    creditPending: false,
    creditAmount: 0,
    creditDueDate: "",
    creditNote: "",
    soloDeuda: false
  };
  upsert(state.clinicalHistory, tratamiento);
  proforma.aceptadaEl = todayISO();
  proforma.tratamientoId = tratamiento.id;
  try {
    await saveClinicalHistoryApi(tratamiento);
    await saveProformaApi(proforma);
  } catch (error) {
    alert(error.message);
    return;
  }
  render();
}


function imprimirProforma(proformaId) {
  const proforma = (state.proformas || []).find((item) => item.id === proformaId);
  if (!proforma) return;
  const patient = patientById(proforma.patientId);
  const ventana = window.open("", "_blank", "width=900,height=1100");
  if (!ventana) {
    alert("El navegador bloqueó la ventana de impresión. Permite las ventanas emergentes de esta página.");
    return;
  }
  const hojasDeEstilo = [...document.querySelectorAll('link[rel="stylesheet"][href]')]
    .map((link) => `<link rel="stylesheet" href="${escapeHtml(link.href)}">`)
    .join("");
  ventana.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8">
    <base href="${escapeHtml(location.href)}">
    <title>Proforma ${escapeHtml(numeroDeProforma(proforma.numero))} ${escapeHtml(patient?.name || "")}</title>
    ${hojasDeEstilo}
    <style>
      @page { size: A4; margin: 0; }
      html, body { background: #fff !important; }
      body { display: block !important; min-height: 0 !important; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .hc-hoja { border: 0 !important; border-radius: 0 !important; padding: 16mm 0 !important; max-width: 178mm; margin: 0 auto; }
      tr, .hc-firma { break-inside: avoid; }
      .table-wrap { overflow: visible !important; }
    </style></head><body>
    ${hojaDeLaProforma(proforma)}
    <script>window.addEventListener("load", function () { setTimeout(function () { window.print(); }, 350); });<\/script>
    </body></html>`);
  ventana.document.close();
}


/* Lo que el odontograma dice que falta por hacer. La norma ya lo deja marcado:
   lo rojo esta pendiente y lo azul ya se hizo, asi que no hay que inventar
   nada, solo leer la ficha. Una caries en una cara es una curacion simple; en
   dos o mas, compuesta, que es como se cobra. */
const TRABAJO_DEL_ODONTOGRAMA = {
  curacion_simple: { detalle: "Curación simple", servicio: "Curaciones Simples" },
  curacion_compuesta: { detalle: "Curación compuesta", servicio: "Curaciones Compuestas" },
  restauracion_definitiva: { detalle: "Cambiar restauración temporal", servicio: "Restauraciones Estéticas" },
  extraccion: { detalle: "Extracción", servicio: "Extracción Simple" },
  extraccion_molar: { detalle: "Extracción de tercer molar", servicio: "Extracción Tercer Molar" },
  resto_radicular: { detalle: "Extracción de resto radicular", servicio: "Extracción Simple" },
  corona_definitiva: { detalle: "Cambiar corona temporal por definitiva", servicio: "Corona Porcelana" },
  fractura: { detalle: "Fractura, el tratamiento lo decide el doctor", servicio: "" }
};

const TERCEROS_MOLARES = ["18", "28", "38", "48"];

function sinTildes(texto) {
  return String(texto || "").trim().toLocaleLowerCase("es").normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function precioDelServicio(nombre) {
  if (!nombre) return null;
  const servicio = (state.services || [])
    .find((item) => item.active !== false && sinTildes(item.name) === sinTildes(nombre));
  return servicio ? Number(servicio.price || 0) : null;
}

/* Lee la ficha viva del paciente y devuelve una linea por cada trabajo
   pendiente, con su precio de la lista de servicios. Es una propuesta: el
   doctor cambia el precio o quita la linea, porque la boca manda sobre el
   cuadro. */
function presupuestoDelOdontograma(patientId) {
  if (!Odontograma || !patientId) return [];
  const ficha = odontogramFichaFor(patientId, "inicial");
  const lineas = [];
  const agregar = (pieza, clave, nota = "") => {
    const trabajo = TRABAJO_DEL_ODONTOGRAMA[clave];
    if (!trabajo) return;
    lineas.push({
      clave: `${pieza}:${clave}`,
      pieza,
      detalle: trabajo.detalle + (nota ? ` · ${nota}` : ""),
      servicio: trabajo.servicio,
      precioLista: precioDelServicio(trabajo.servicio)
    });
  };
  (Odontograma.PIEZAS || []).forEach((pieza) => {
    const diente = ficha.dientes[pieza];
    if (!diente) return;
    const caras = Object.keys(diente.sup || {});
    const conCaries = caras.filter((cara) => diente.sup[cara] === "caries");
    if (conCaries.length === 1) agregar(pieza, "curacion_simple", "1 cara");
    if (conCaries.length > 1) agregar(pieza, "curacion_compuesta", `${conCaries.length} caras`);
    if (caras.some((cara) => diente.sup[cara] === "rest_temp")) agregar(pieza, "restauracion_definitiva");
    const de = diente.pieza || {};
    if ("por_extraer" in de) {
      agregar(pieza, TERCEROS_MOLARES.includes(pieza) ? "extraccion_molar" : "extraccion");
    }
    if ("rr" in de) agregar(pieza, "resto_radicular");
    if ("corona_tmp" in de) agregar(pieza, "corona_definitiva");
    if ("fractura" in de) agregar(pieza, "fractura");
  });
  return lineas;
}


/* El presupuesto guardado del paciente: el precio que el doctor dejo en cada
   linea y el descuento del total. Lo demas se vuelve a leer del odontograma
   cada vez, para que cambiar la boca cambie el presupuesto. */
function presupuestoGuardado(patient) {
  const guardado = patient?.presupuesto || {};
  return {
    descuento: Number(guardado.descuento || 0),
    precios: guardado.precios && typeof guardado.precios === "object" ? guardado.precios : {},
    quitadas: Array.isArray(guardado.quitadas) ? guardado.quitadas : [],
    /* Lo que no sale del odontograma: brackets, limpieza, endodoncia, una PPR.
       La boca no los marca en rojo pero se cobran igual, asi que se eligen de
       la lista de tratamientos y se guardan aqui, con su cantidad. */
    sueltos: Array.isArray(guardado.sueltos) ? guardado.sueltos : []
  };
}


/* Las lineas del presupuesto: las que el odontograma propone y las que se
   eligieron a mano, todas con su cantidad y su precio ya resuelto. Un solo
   sitio arma la lista, para que la pantalla, la proforma y el papel digan lo
   mismo. */
function lineasDelPresupuesto(patientId) {
  const patient = patientById(patientId);
  if (!patient) return { guardado: presupuestoGuardado(null), lineas: [] };
  const guardado = presupuestoGuardado(patient);
  const delOdontograma = presupuestoDelOdontograma(patientId).map((linea) => {
    const propio = guardado.precios[linea.clave];
    return {
      ...linea,
      cantidad: 1,
      aMano: false,
      precio: Number(propio === undefined || propio === "" ? (linea.precioLista || 0) : propio),
      quitada: guardado.quitadas.includes(linea.clave)
    };
  });
  const aMano = guardado.sueltos.map((suelto) => {
    const propio = guardado.precios[suelto.clave];
    const deLista = precioDelServicio(suelto.servicio);
    return {
      clave: suelto.clave,
      pieza: String(suelto.pieza || "").trim(),
      detalle: suelto.servicio || suelto.detalle || "Tratamiento",
      servicio: suelto.servicio || "",
      cantidad: Math.max(1, Number(suelto.cantidad || 1)),
      aMano: true,
      // el precio de la lista puede haber cambiado: manda el que se escribio
      precio: Number(propio === undefined || propio === "" ? (suelto.precio ?? deLista ?? 0) : propio),
      quitada: guardado.quitadas.includes(suelto.clave)
    };
  });
  return { guardado, lineas: [...delOdontograma, ...aMano] };
}


/* Lo que suma una linea: en el papel del consultorio la cantidad va en su
   columna y el total es la multiplicacion, igual que en su talonario. */
const totalDeLaLinea = (linea) => Number(linea.precio || 0) * Math.max(1, Number(linea.cantidad || 1));


/* El plan de tratamiento del paciente: lo que la doctora escribio en su
   historia y, debajo, el dinero de cada tratamiento abierto -presupuesto, lo
   pagado, lo ya usado en atenciones y lo que queda-. Vivia en la hoja y se
   quedo sin sitio cuando la hoja paso a ser el formato del Colegio. */
/* Las filas de la ventana de precios son de tres clases:
   - "plantilla": un tratamiento ya guardado, con su precio. Se le escribe la
     pieza y se marca como cualquier otra; el nombre es ademas un boton, y cada
     clic baja otra linea igual, para el mismo tratamiento en otra pieza.
   - "trabajo": esas lineas de mas. Viven solo mientras la ventana esta abierta.
   - "nueva": la fila en blanco donde se escribe un tratamiento que no estaba;
     al salir del campo se vuelve plantilla y se guarda.
   Al cerrar la ventana el borrador se tira, asi que al volver a abrirla estan
   las plantillas y nada mas: las lineas de trabajo no se acumulan. */
function borradorDeServicios() {
  if (!Array.isArray(serviciosBorrador)) {
    serviciosBorrador = [
      ...(state.listaDePrecios || []).map((linea) => ({ tipo: "plantilla", name: linea.name, price: linea.price, pz: "" })),
      { tipo: "nueva", name: "", price: "", pz: "" }
    ];
  }
  return serviciosBorrador;
}


function olvidarBorradorDePrecios() {
  serviciosBorrador = null;
}


/* El precio se escribe y se lee como en el papel: S/200.00. Se guarda el
   numero, y al teclear se admite con o sin el S/ y los decimales. */
const precioEscrito = (valor) => (valor === "" || valor === undefined || valor === null ? "" : `S/${Number(valor || 0).toFixed(2)}`);
const precioLeido = (texto) => {
  const limpio = String(texto ?? "").replace(/[^\d.]/g, "");
  return limpio === "" ? "" : Math.max(0, Number(limpio) || 0);
};


function leerTablaDeServicios() {
  const cuerpo = $("#servicesTable");
  const lista = borradorDeServicios();
  if (!cuerpo) return lista;
  serviciosBorrador = [...cuerpo.querySelectorAll("tr[data-servicio]")].map((fila) => {
    const base = lista[Number(fila.dataset.servicio)] || {};
    return {
      tipo: fila.dataset.tipo || base.tipo || "nueva",
      name: String(fila.querySelector('[data-campo="name"]')?.value ?? base.name ?? "").trim(),
      price: fila.querySelector('[data-campo="price"]') ? precioLeido(fila.querySelector('[data-campo="price"]').value) : (base.price ?? ""),
      pz: String(fila.querySelector('[data-campo="pz"]')?.value ?? base.pz ?? "").trim()
    };
  });
  return serviciosBorrador;
}


/* Solo las plantillas se guardan: son la lista del consultorio. Las lineas de
   trabajo son de este paciente y de hoy. */
function guardarListaDePrecios() {
  state.listaDePrecios = borradorDeServicios()
    .filter((linea) => linea.tipo === "plantilla" && linea.name)
    .map((linea) => ({ name: linea.name, price: linea.price === "" ? 0 : Number(linea.price || 0) }));
  /* La lista es del consultorio, no de este navegador: se guarda en el
     servidor para que la vean todos los equipos. Solo el administrador puede
     tocarla, asi que a los demas se les queda en pantalla sin subirla. */
  if (!API_ENABLED || !isAdmin()) return;
  saveConfigApi({ listaDePrecios: state.listaDePrecios }).catch((error) => alert(error.message));
}


function hojaDePrecios(patientId) {
  const lineas = borradorDeServicios();
  /* Un mismo tratamiento puede estar en varias piezas, asi que la marca se
     busca por tratamiento y pieza juntos: si no, marcar el sellante de la 1.5
     dejaba marcado tambien el de la 2.6. */
  const puestos = new Set(presupuestoGuardado(patientById(patientId)).sueltos
    .map((suelto) => `${suelto.servicio}|${String(suelto.pieza || "").trim()}`));
  const fila = (linea, i) => {
    const trabajo = linea.tipo === "trabajo";
    const plantilla = linea.tipo === "plantilla";
    return `<tr data-servicio="${i}" data-tipo="${linea.tipo}">
      <td>${plantilla
        ? `<button class="precio-opcion" type="button" data-usar-precio="${i}" title="Pulsa para agregar una línea y escribir la pieza"><span>${escapeHtml(linea.name)}</span><span class="precio-opcion-mas" aria-hidden="true">+</span></button>`
        : trabajo
          ? `<span class="precio-trabajo">${escapeHtml(linea.name)}</span>`
          : `<input class="servicio-campo" data-campo="name" value="${escapeHtml(linea.name || "")}" />`}</td>
      <td class="num">${linea.tipo === "nueva"
        ? ""
        : `<input class="servicio-campo servicio-num servicio-pieza" data-campo="pz" inputmode="decimal" value="${escapeHtml(String(linea.pz || ""))}" aria-label="Pieza" />`}</td>
      <td class="num"><input class="servicio-campo servicio-num" data-campo="price" value="${precioEscrito(linea.price)}" aria-label="Precio" /></td>
      <td class="num">${linea.tipo === "nueva"
        ? ""
        : `<label class="check"><input type="checkbox" data-elegir-servicio="${i}" data-paciente="${patientId}"${linea.name && puestos.has(`${linea.name}|${String(linea.pz || "").trim()}`) ? " checked" : ""} aria-label="Poner en el presupuesto" /></label>`}</td>
      <td class="num">${linea.tipo === "nueva" ? "" : `<button class="plan-quitar" type="button" title="Quitar la línea" data-quitar-precio="${i}">×</button>`}</td>
    </tr>`;
  };
  return `<aside class="plan-precios-ventana">
      <table class="hc-tabla servicios-tabla">
        <thead><tr><th>Tratamientos</th><th class="num">Pz</th><th class="num">Precio</th><th></th><th></th></tr></thead>
        <tbody id="servicesTable">${lineas.map(fila).join("")}</tbody>
      </table>
      <p class="plan-precios-pie">
        <button class="small-btn" type="button" id="addServiceBtn">Añadir</button>
        <button class="small-btn" type="button" id="exitPricesBtn">Salir</button>
      </p>
    </aside>`;
}


/* El boton de los precios se coloca debajo de la pestaña "Plan de tratamiento",
   empezando justo donde esa pestaña termina. No se puede dejar en el CSS: el
   boton vive en otro contenedor que las pestañas, y el ancho de estas cambia
   con el texto. Si no cabe, se queda pegado al borde derecho. */
function alinearBotonDePrecios(caja) {
  const fila = caja.querySelector(".plan-precios-boton");
  if (!fila) return;
  const pestanas = $("#historySheetTabs");
  const ultima = pestanas?.querySelector("[data-hoja]:last-of-type");
  const boton = fila.querySelector("button");
  if (!ultima || !boton) return;
  const desde = ultima.getBoundingClientRect().right - caja.getBoundingClientRect().left;
  const tope = fila.clientWidth - boton.getBoundingClientRect().width;
  fila.style.paddingLeft = `${Math.max(0, Math.min(desde, tope))}px`;
}


function hojaDelPlan(patientId) {
  const patient = patientById(patientId);
  if (!patient) return `<p class="muted">Elige un paciente para ver su plan.</p>`;
  /* Un solo boton, debajo de la pestaña del plan y pegado a la derecha, como
     lo pidio el usuario: al pulsarlo se ve la lista de precios del consultorio
     y al volver a pulsarlo, el presupuesto del paciente. Lleva la misma forma
     que las pestañas de arriba, y se pinta del color del consultorio cuando
     los precios estan a la vista. */
  const subHoja = planSubTab === "precios" ? "precios" : "plan";
  const botonDePrecios = `<div class="plan-precios-boton">
      <button class="hc-pestana${subHoja === "precios" ? " activa" : ""}" type="button" data-plan-hoja="${subHoja === "precios" ? "plan" : "precios"}">Precios</button>
      ${subHoja === "precios" ? hojaDePrecios(patientId) : ""}
    </div>`;
  const config = state.config || {};
  const notas = state.clinicalHistory
    .filter((entry) => entry.patientId === patientId)
    .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
  const escrito = notas.find((entry) => String(entry.workPlan || "").trim());
  const tratamientos = tratamientosDelPaciente(patientId);

  const plan = escrito
    ? `<section class="hc-seccion">
        <h4>Plan escrito en la historia</h4>
        <p class="hc-observacion">${escapeHtml(escrito.workPlan)}</p>
        <p class="muted">Escrito el ${formatDate(escrito.date)}${escrito.attendedBy ? ` por ${escapeHtml(escrito.attendedBy)}` : ""}. Se cambia en la pestaña Historia clínica.</p>
      </section>`
    : `<section class="hc-seccion">
        <h4>Plan escrito en la historia</h4>
        <p class="muted">Todavía no hay un plan escrito. Se escribe en la pestaña Historia clínica, en «Plan de tratamiento».</p>
      </section>`;

  const dinero = `<section class="hc-seccion">
      <h4>Tratamientos y su dinero</h4>
      ${tratamientos.length ? tratamientos.map((t) => {
        const pagadoPct = t.presupuesto ? Math.min(100, Math.round((t.pagado / t.presupuesto) * 100)) : 0;
        const usadoPct = t.presupuesto ? Math.min(100, Math.round((t.usado / t.presupuesto) * 100)) : 0;
        return `<div class="hc-tratamiento">
          <div class="hc-tratamiento-cabeza">
            <strong>${escapeHtml(t.entry.plan)} <small>desde el ${formatDate(t.entry.date)}</small></strong>
            <span class="status ${t.terminado ? "" : "warn"}">${t.terminado ? "TERMINADO" : "EN CURSO"}</span>
          </div>
          <div class="hc-tratamiento-montos">
            <span>Presupuesto <strong>${money(t.presupuesto)}</strong></span>
            <span>Pagado <strong>${money(t.pagado)}</strong></span>
            <span>Usado <strong>${money(t.usado)}</strong></span>
            <span>Disponible <strong>${money(t.disponible)}</strong></span>
            ${t.porPagar > 0 ? `<span>Por pagar <strong class="hc-falta">${money(t.porPagar)}</strong></span>` : ""}
          </div>
          <div class="hc-barra" role="img" aria-label="Pagado ${pagadoPct}%, usado ${usadoPct}%"><i class="hc-barra-pagado" style="width:${pagadoPct}%"></i><i class="hc-barra-usado" style="width:${usadoPct}%"></i></div>
        </div>`;
      }).join("") : `<p class="muted">Sin tratamiento abierto. Se abre escribiendo el tratamiento y su costo en «Plan y presupuesto», dentro de la nota clínica.</p>`}
    </section>`;

  /* El presupuesto sale del odontograma: lo que esta marcado en rojo es lo que
     falta por hacer, y cada cosa tiene su precio en la lista de servicios. Es
     una propuesta, no una factura: el doctor cambia el precio de la linea o la
     quita, y el descuento se aplica al total. */
  const { guardado, lineas } = lineasDelPresupuesto(patientId);
  const vivas = lineas.filter((linea) => !linea.quitada);
  const subtotal = vivas.reduce((suma, linea) => suma + totalDeLaLinea(linea), 0);
  const descuento = Math.min(100, Math.max(0, guardado.descuento));
  const rebaja = Math.round(subtotal * descuento) / 100;
  const puedeEditar = canManageClinical();

  /* El odontograma al lado del presupuesto: se marca una caries a la derecha y
     se ve aparecer su linea a la izquierda, sin cambiar de pantalla. */
  const dibujo = Odontograma ? dibujoDelOdontograma(odontogramFichaFor(patientId, "inicial")) : null;

  /* El cuadro de la izquierda es ya la proforma: el logo y el nombre del
     consultorio arriba, para quien esta al otro lado de la mesa, el descuento,
     la lista de piezas con su monto, el total y el boton de guardarla. Se ve lo
     mismo en pantalla que en el papel que se lleva el paciente. */
  const cuadroDelTotal = `<div class="plan-caja">
      <div class="plan-membrete">
        ${config.logoDataUrl ? `<img class="plan-logo" src="${escapeHtml(config.logoDataUrl)}" alt="" />` : ""}
        <div>
          <strong>${escapeHtml(config.clinicName || "Consultorio dental")}</strong>
          <span>Presupuesto para ${escapeHtml(patient.name)}</span>
        </div>
      </div>
      <label class="plan-descuento">Descuento comercial
        ${puedeEditar
          ? `<span><input class="presupuesto-descuento" type="number" min="0" max="100" step="1" value="${descuento}" data-descuento="1" data-paciente="${patientId}" /> %</span>`
          : `<strong>${descuento} %</strong>`}
      </label>
      <div class="table-wrap"><table class="hc-tabla presupuesto-tabla">
        <thead><tr><th>Pieza</th><th>Tratamiento</th><th class="num">Cant.</th><th class="num">P. unitario S/</th><th class="num">Total S/</th>${puedeEditar ? "<th></th>" : ""}</tr></thead>
        <tbody>${lineas.map((linea) => `<tr class="${linea.quitada ? "presupuesto-fuera" : ""}">
          <td><strong>${escapeHtml(linea.pieza || "—")}</strong></td>
          <td>${escapeHtml(linea.detalle)}${linea.servicio && linea.servicio !== linea.detalle ? `<br><span class="muted">${escapeHtml(linea.servicio)}</span>` : ""}</td>
          <td class="num">${linea.quitada
            ? `<span class="muted">—</span>`
            : Math.max(1, Number(linea.cantidad || 1))}</td>
          <td class="num">${linea.quitada
            ? `<span class="muted">—</span>`
            : puedeEditar
              ? `<input class="presupuesto-precio" type="number" min="0" step="1" value="${Number(linea.precio || 0)}" data-precio="${escapeHtml(linea.clave)}" data-paciente="${patientId}" />`
              : money(linea.precio || 0)}</td>
          <td class="num">${linea.quitada ? `<span class="muted">—</span>` : `<strong>${money(totalDeLaLinea(linea))}</strong>`}</td>
          ${puedeEditar
            ? `<td class="num"><button class="plan-quitar${linea.quitada ? " plan-volver" : ""}" type="button" title="${linea.quitada ? "Volver a ponerlo" : "Quitar del presupuesto"}" data-quitar-linea="${escapeHtml(linea.clave)}" data-paciente="${patientId}"${linea.aMano ? ` data-suelto="1"` : ""}>${linea.quitada ? "+" : "×"}</button></td>`
            : ""}
        </tr>`).join("")}</tbody>
      </table></div>
      ${rebaja > 0
        ? `<p class="plan-caja-linea"><span>Suma de los trabajos</span><strong>${money(subtotal)}</strong></p>
           <p class="plan-caja-linea"><span>Se le baja</span><strong>− ${money(rebaja)}</strong></p>`
        : ""}
      <p class="plan-caja-total"><span>Total</span><strong>${money(subtotal - rebaja)}</strong></p>
      ${puedeEditar && vivas.length
        ? `<button class="primary plan-guardar" type="button" data-guardar-proforma="${patientId}">Guardar como proforma</button>`
        : ""}
    </div>`;

  /* El odontograma no marca todo lo que se cobra: unos brackets, una limpieza,
     una endodoncia o una PPR no salen de la boca pintada de rojo. Se eligen de
     la lista de tratamientos, con su cantidad, igual que en el talonario del
     consultorio. */
  const catalogo = (() => {
    if (!puedeEditar) return "";
    const activos = (state.services || []).filter((service) => service.active !== false);
    if (!activos.length) {
      return `<details class="plan-catalogo"><summary>Agregar tratamientos de la lista</summary>
        <p class="muted">Todavía no hay tratamientos en la lista.</p>
      </details>`;
    }
    const porCategoria = new Map();
    activos.forEach((service) => {
      const grupo = String(service.category || "").trim() || "General";
      if (!porCategoria.has(grupo)) porCategoria.set(grupo, []);
      porCategoria.get(grupo).push(service);
    });
    return `<details class="plan-catalogo">
      <summary>Agregar tratamientos de la lista</summary>
      <p class="muted">Marca lo que se le va a hacer y pon cuántas veces. El precio entra solo, y se puede retocar después línea por línea.</p>
      ${[...porCategoria.entries()].map(([grupo, servicios]) => `<div class="plan-catalogo-grupo">
        <h5>${escapeHtml(grupo)}</h5>
        ${servicios.map((service, i) => {
          const campo = `svc-${grupo.replace(/\W+/g, "")}-${i}`;
          return `<div class="plan-catalogo-item">
          <input type="checkbox" id="${campo}" data-servicio-elegido="${escapeHtml(service.name)}" />
          <label for="${campo}">${escapeHtml(service.name)}</label>
          <span class="plan-catalogo-precio">${money(service.price || 0)}</span>
          <input class="plan-catalogo-cantidad" type="number" min="1" step="1" value="1" aria-label="Cantidad de ${escapeHtml(service.name)}" data-cantidad-de="${escapeHtml(service.name)}" />
        </div>`;
        }).join("")}
      </div>`).join("")}
      <button class="primary plan-guardar" type="button" data-agregar-tratamientos="${patientId}">Agregar al presupuesto</button>
    </details>`;
  })();

  const presupuesto = `<section class="hc-seccion">
      <h4>Presupuesto del paciente</h4>
      ${lineas.length
        ? `<div class="plan-columnas">
          <div class="plan-izquierda">
            ${cuadroDelTotal}
            <p class="muted">Las líneas con número de pieza salen de lo que está marcado en rojo en el odontograma; las demás se eligieron de la lista. Si cambias un precio aquí, se guarda para este paciente.</p>
            ${catalogo}
          </div>
          <div class="plan-derecha">
            ${dibujo
              ? `<div class="hc-grafico"><div class="odo-raiz hc-grafico-lienzo"><div class="odo-arco">${dibujo.html}</div></div></div>`
              : ""}
            ${patientId ? `<p class="hc-editar-odontograma"><button class="small-btn" type="button" data-editar-odontograma="${patientId}">Editar odontograma</button></p>` : ""}
          </div>
        </div>`
        : `<p class="muted">El odontograma de ${escapeHtml(patient.name)} no tiene nada marcado como pendiente. Marca en rojo lo que hay que hacer -caries, piezas por extraer- y el presupuesto se arma solo; lo que no sale de la boca -brackets, limpieza, una prótesis- se agrega aquí abajo.</p>
          ${catalogo}`}
    </section>`;

  /* Las proformas ya dadas: cada una con su numero, su fecha y su total, y la
     hoja entera plegada detras para verla tal como se la llevo el paciente. */
  const dadas = proformasDelPaciente(patientId);
  const proformas = `<section class="hc-seccion">
      <h4>Proformas entregadas</h4>
      ${dadas.length
        ? dadas.map((item) => {
          const suma = sumaDeLaProforma(item);
          const baja = Math.round(suma * Number(item.descuento || 0)) / 100;
          return `<div class="proforma-fila">
            <div class="proforma-cabeza">
              <strong>${escapeHtml(numeroDeProforma(item.numero))}</strong>
              <span class="muted">${formatDate(item.date)} · ${(item.lineas || []).length} tratamiento${(item.lineas || []).length === 1 ? "" : "s"}</span>
              <strong class="proforma-monto">${money(suma - baja)}</strong>
              ${item.aceptadaEl
                ? `<span class="status">Aceptada el ${formatDate(item.aceptadaEl)}</span>`
                : puedeEditar ? `<button class="small-btn proforma-aceptar" type="button" data-aceptar-proforma="${item.id}">Aceptar</button>` : ""}
              <button class="small-btn" type="button" data-imprimir-proforma="${item.id}">Imprimir</button>
              ${puedeEditar && !item.aceptadaEl ? `<button class="small-btn" type="button" data-borrar-proforma="${item.id}">Borrar</button>` : ""}
            </div>
            <details class="proforma-ver"><summary>Ver la hoja</summary>${hojaDeLaProforma(item)}</details>
          </div>`;
        }).join("")
        : `<p class="muted">Todavía no se le ha entregado ninguna proforma.</p>`}
    </section>`;

  return `${botonDePrecios}
  <article class="hc-hoja">
    <section class="hc-seccion">
      <h4>Plan de tratamiento · ${escapeHtml(patient.name)}</h4>
    </section>
    ${plan}
    ${presupuesto}
    ${proformas}
    ${dinero}
  </article>`;
}


/* El plan es una pestana mas de la historia: redibujarlo es redibujar la hoja
   que se este viendo. */
function renderPlanDeTratamiento() {
  renderClinicalHistory();
}


/* Se guardan solo las piezas con algo escrito: una ficha entera son 32 dientes
   vacios que ocupan sitio y no dicen nada. normalizarFicha reconstruye el
   resto al abrirla. */
function fichaCompacta(ficha) {
  const dientes = {};
  Object.entries(ficha?.dientes || {}).forEach(([pieza, diente]) => {
    if (diente && !piezaVacia(diente)) dientes[pieza] = diente;
  });
  return {
    dientes,
    spans: Array.isArray(ficha?.spans) ? ficha.spans : [],
    arcada: ficha?.arcada || { up: null, down: null },
    // si el paciente lleva piezas de leche, la copia guardada lo dice: asi la
    // historia y el impreso salen con las cuatro filas, como se marco
    nino: Boolean(ficha?.nino),
    esp: ficha?.esp || "",
    obs: ficha?.obs || ""
  };
}

function hojaLegible(sheet) {
  return sheet === "evolucion" ? "Evolución" : "Inicial";
}

async function guardarCopiaDelOdontograma(nota) {
  if (!canEditOdontogram()) {
    alert("Tu usuario no puede guardar copias del odontograma.");
    return false;
  }
  if (!odontogramPatientId || !odontogramView) {
    alert("Elige primero un paciente.");
    return false;
  }
  if (odontogramSnapshotId) {
    alert("Estás viendo una copia anterior. Vuelve al odontograma actual para guardar.");
    return false;
  }
  await odontogramFlush();
  const ficha = fichaCompacta(odontogramView.ficha());
  if (!Object.keys(ficha.dientes).length && !ficha.spans.length && !ficha.esp) {
    alert("El odontograma está vacío: no hay nada que guardar.");
    return false;
  }
  /* Una copia por paciente, hoja y dia: guardar otra vez hoy reemplaza la
     copia de hoy. La nota nueva manda, y si viene vacia se conserva la que ya
     tenia. */
  const hoy = todayISO();
  const delDia = copiasDelOdontograma(odontogramPatientId).find((item) => item.sheet === odontogramSheet && item.date === hoy);
  const copia = {
    id: delDia?.id || uid("odocopia"),
    patientId: odontogramPatientId,
    sheet: odontogramSheet,
    date: hoy,
    savedAt: new Date().toISOString(),
    doctor: currentUser()?.name || "",
    note: String(nota || "").trim() || delDia?.note || "",
    ficha: JSON.stringify(ficha)
  };
  try {
    await saveOdontogramSnapshotApi(copia);
  } catch (error) {
    alert(error.message);
    return false;
  }
  // el servidor devuelve el id de la copia del dia que actualizo
  const previa = (state.odontogramSnapshots || []).find((item) => item.id === copia.id) || delDia;
  if (previa) Object.assign(previa, copia);
  else state.odontogramSnapshots.push(copia);
  if (!API_ENABLED) saveState();
  return true;
}

/* Volver atras no borra la copia: escribe la ficha guardada encima del
   odontograma vivo de esa hoja. Las piezas que hoy tienen algo y en la copia
   no lo tenian se quedan sin marcas, que es lo que significa volver a como
   estaba ese dia. Se escriben vacias en vez de borrarlas para que el servidor
   se entere igual que con cualquier otra correccion. */
async function restaurarCopiaDelOdontograma(id) {
  const copia = copiaDelOdontograma(id);
  if (!copia) return false;
  if (!canEditOdontogram()) {
    alert("Tu usuario no puede restaurar el odontograma.");
    return false;
  }
  const ficha = Odontograma.normalizarFicha(parseFindings(copia.ficha));
  const sheet = copia.sheet === "evolucion" ? "evolucion" : "inicial";
  const previas = new Map(odontogramRowsFor(copia.patientId, sheet).map((row) => [row.tooth, row]));

  const escribir = async (record) => {
    await saveOdontogramApi(record);
    const previo = previas.get(record.tooth);
    if (previo) Object.assign(previo, record);
    else state.odontogram.push(record);
    previas.delete(record.tooth);
  };

  try {
    for (const [clave, diente] of Object.entries(ficha.dientes)) {
      if (piezaVacia(diente)) continue;
      const tooth = odontogramRowKey(sheet, clave);
      await escribir({
        id: previas.get(tooth)?.id || uid("odo"),
        patientId: copia.patientId,
        tooth,
        condition: "Restaurado de copia",
        note: diente.nota || "",
        findings: JSON.stringify(diente)
      });
    }
    const toothFicha = odontogramRowKey(sheet, Odontograma.CLAVE_FICHA);
    await escribir({
      id: previas.get(toothFicha)?.id || uid("odo"),
      patientId: copia.patientId,
      tooth: toothFicha,
      condition: "Ficha",
      note: ficha.esp || "",
      findings: JSON.stringify({ spans: ficha.spans, arcada: ficha.arcada })
    });
    // lo que la copia no tenia deja de estar marcado
    for (const [tooth, row] of previas) {
      await escribir({
        id: row.id,
        patientId: copia.patientId,
        tooth,
        condition: "Sano",
        note: "",
        findings: JSON.stringify({ sup: {}, pieza: {}, box: [], num: null, nota: "" })
      });
    }
  } catch (error) {
    alert(error.message);
    return false;
  }

  odontogramSnapshotId = "";
  odontogramPatientId = copia.patientId;
  odontogramSheet = sheet;
  odontogramLoadedKey = "";
  odontogramLoadedSign = "";
  if (!API_ENABLED) saveState();
  return true;
}

function verCopiaDelOdontograma(id) {
  const copia = copiaDelOdontograma(id);
  if (!copia) return;
  odontogramSnapshotId = id;
  odontogramPatientId = copia.patientId;
  odontogramSheet = copia.sheet === "evolucion" ? "evolucion" : "inicial";
  odontogramLoadedKey = "";
  odontogramLoadedSign = "";
}

function volverAlOdontogramaActual() {
  odontogramSnapshotId = "";
  odontogramLoadedKey = "";
  odontogramLoadedSign = "";
}

/* La lista se mira en Historial clinico, que es donde se consulta lo clinico
   de un paciente; la pantalla del odontograma es para trabajar. */
function renderOdontogramSnapshots() {
  const caja = $("#odontogramSnapshots");
  if (!caja) return;
  const patientId = $("#historyPatientFilter")?.value || state.patients[0]?.id || "";
  const copias = copiasDelOdontograma(patientId);
  if (!copias.length) {
    caja.innerHTML = `<p class="muted">Todavía no hay copias guardadas de este paciente. Se guardan desde la pantalla del Odontograma.</p>`;
    return;
  }
  caja.innerHTML = `<table class="table"><thead><tr>
      <th>Fecha</th><th>Hoja</th><th>Guardó</th><th>Nota</th><th>Acción</th>
    </tr></thead><tbody>${copias.map((copia) => `<tr>
      <td>${escapeHtml(formatDate(copia.date))}</td>
      <td>${escapeHtml(hojaLegible(copia.sheet))}</td>
      <td>${escapeHtml(copia.doctor || "")}</td>
      <td>${escapeHtml(copia.note || "")}</td>
      <td class="row-actions">
        <button class="small-btn" data-ver-copia-odontograma="${copia.id}">Ver</button>
        ${canEditOdontogram() ? `<button class="small-btn" data-restaurar-copia-odontograma="${copia.id}">Restaurar</button>` : ""}
      </td>
    </tr>`).join("")}</tbody></table>`;
}

function canEditOdontogram() {
  // el backend solo acepta escrituras del odontograma de ADMIN y DOCTOR
  return ["ADMIN", "DOCTOR"].includes(currentUser()?.role);
}

function renderOdontogram() {
  const lienzo = $("#odontogramGrid");
  if (!lienzo || typeof Odontograma === "undefined") return;

  if (!odontogramView) {
    odontogramView = Odontograma.crear({
      barra: $("#odontogramToolbar"),
      cabecera: $("#odontogramHeader"),
      lienzo,
      rutaImagenes: "assets/dientes/",
      tituloClinica: "CM Odontologia Estetica",
      onChange: (ficha, claves) => odontogramQueueSave(claves),
      onPaciente: (id, hoja) => {
        odontogramFlush();
        odontogramPatientId = id;
        odontogramSheet = hoja;
        renderOdontogram();
      }
    });
  }

  if (!odontogramPatientId || !state.patients.some((p) => p.id === odontogramPatientId)) {
    odontogramPatientId = state.patients[0]?.id || "";
  }
  odontogramView.setPacientes(odontogramPatientList(), odontogramPatientId);

  /* Mirando una copia anterior no se puede escribir: nadie deberia corregir
     hoy un registro de hace un mes creyendo que edita el actual. */
  const copia = odontogramSnapshotId ? copiaDelOdontograma(odontogramSnapshotId) : null;
  if (odontogramSnapshotId && !copia) odontogramSnapshotId = "";
  odontogramView.setSoloLectura(Boolean(copia) || !canEditOdontogram());
  const aviso = $("#odontogramViewingCopy");
  if (aviso) {
    aviso.hidden = !copia;
    if (copia) {
      aviso.innerHTML = `<span>Estás viendo la copia del <strong>${escapeHtml(formatDate(copia.date))}</strong>` +
        `${copia.doctor ? ` guardada por ${escapeHtml(copia.doctor)}` : ""}` +
        `${copia.note ? ` &mdash; ${escapeHtml(copia.note)}` : ""}. No se puede editar.</span>` +
        `<button class="small-btn" type="button" id="backToLiveOdontogram">Volver al odontograma actual</button>`;
    }
  }
  const guardarCaja = $("#odontogramSaveCopy");
  if (guardarCaja) guardarCaja.hidden = Boolean(copia) || !canEditOdontogram();

  // no se recarga mientras hay cambios sin guardar, para no perder lo escrito
  if (odontogramPending.size) return;
  const clave = copia ? `copia:${copia.id}` : `${odontogramPatientId}|${odontogramSheet}`;
  const firma = copia ? copia.id : odontogramSignature(odontogramPatientId, odontogramSheet);
  if (clave === odontogramLoadedKey && firma === odontogramLoadedSign) return;
  odontogramLoadedKey = clave;
  odontogramLoadedSign = firma;
  odontogramView.cargar(copia
    ? Odontograma.normalizarFicha(parseFindings(copia.ficha))
    : odontogramFichaFor(odontogramPatientId, odontogramSheet));
}

function renderPayments() {
  const cashDate = cashViewDate();
  const cashDateInput = $("#cashViewDate");
  if (cashDateInput && document.activeElement !== cashDateInput) cashDateInput.value = cashDate;
  $("#totalDebt").textContent = money(pendingCashDebtTotal());
  renderCashBox(cashDate);
  renderExpenses(cashDate);
  const paymentsTable = $("#paymentsTable");
  const paymentsHeader = paymentsTable?.closest("table")?.querySelector("thead tr");
  if (paymentsHeader) {
    paymentsHeader.innerHTML = `
      <th>Fecha</th>
      <th>Paciente</th>
      <th>Metodo</th>
      <th>Monto</th>
      <th>Notas</th>
      ${isAdmin() ? "<th>Accion</th>" : ""}
    `;
  }
  $("#paymentsTable").innerHTML = visiblePaymentsForCashView(cashDate)
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((payment) => {
      const patient = patientById(payment.patientId);
      const history = historyById(payment.historyId);
      const showChange = paymentCashPortion(payment) > 0;
      return `<tr>
        <td>${formatDate(payment.date || cashDate)}</td>
        <td>${escapeHtml(patient?.name || "Paciente")}<br><span class="muted">${escapeHtml(history?.attendedBy ? `Dr(a). ${history.attendedBy}` : "")}</span></td>
        <td>${esDescuentoDeTratamiento(payment) ? `<span class="payment-discount-tag">Tratamiento</span>` : escapeHtml(paymentMethodLabel(payment))}</td>
        <td><strong>${money(payment.amount)}</strong>${esDescuentoDeTratamiento(payment) ? `<br><span class="muted">Descontado ${money(payment.descontado)} · no entra a caja</span>` : ""}${showChange ? `<br><span class="muted">Vuelto: ${money(payment.change || 0)}</span>` : ""}</td>
        <td>${escapeHtml(payment.receipt || (history ? history.reason : ""))}${payment.comprobante ? `<br><span class="muted">${escapeHtml(payment.comprobante)}</span>` : ""}</td>
        ${isAdmin() ? `<td class="row-actions"><button class="small-btn danger-btn" data-delete-payment="${payment.id}">Eliminar</button></td>` : ""}
      </tr>`;
    }).join("") || `<tr><td colspan="${isAdmin() ? 6 : 5}">No hay pagos registrados.</td></tr>`;
}

/* Lo que va en la descripcion del comprobante cuando no se escribe nada.
   Vive en una sola funcion porque la usan el campo -que la muestra en gris como
   sugerencia- y la emision. Estaban separadas y ya decian cosas distintas: la
   del campo tomaba en cuenta el servicio de la cita y la de la emision no, asi
   que dejar el campo vacio habria emitido "Servicio odontologico" en una cita
   que tenia su servicio escrito. */
function descripcionPorDefecto(payment) {
  const patient = patientById(payment?.patientId);
  const history = historyById(payment?.historyId);
  const appointment = state.appointments.find((item) => item.id === payment?.appointmentId);
  return descripcionDelTratamiento(payment) || history?.reason || appointment?.service || patient?.mainTreatment || "Servicio odontologico";
}

function buildElectronicReceiptFromPayment(payment, formDataValues) {
  const type = String(formDataValues.electronicReceiptType || formDataValues.type || "").toUpperCase();
  if (!type) return null;
  const patient = patientById(payment.patientId);
  const history = historyById(payment.historyId);
  const customerDoc = String(formDataValues.receiptCustomerDoc || formDataValues.customerDoc || patient?.dni || "").trim();
  const customerName = String(formDataValues.receiptCustomerName || formDataValues.customerName || patient?.name || "").trim().toUpperCase();
  const description = String(formDataValues.description || descripcionPorDefecto(payment)).trim();
  const series = receiptSeriesForType(type);
  const number = nextReceiptNumber(type);
  return {
    id: uid("cpe"),
    paymentId: payment.id,
    patientId: payment.patientId,
    type,
    series,
    number,
    issueDate: payment.date,
    customerDocType: type === "FACTURA" ? "RUC" : "DNI",
    customerDoc,
    customerName,
    customerAddress: String(formDataValues.customerAddress || "").trim().toUpperCase(),
    description,
    quantity: 1,
    unitValue: payment.amount,
    total: payment.amount,
    taxCondition: "EXONERADO",
    igv: 0,
    status: "BORRADOR",
    notes: "Operacion exonerada de IGV"
  };
}

/* Como se lee cada estado del motor de facturacion. La boleta no se acepta al
   momento: se firma, y recien el resumen diario le trae la respuesta. */
const SUNAT_ESTADOS = {
  ACEPTADO: { texto: "Aceptado por SUNAT", clase: "" },
  PENDIENTE: { texto: "Firmada, falta el resumen", clase: "warn" },
  ENVIADO: { texto: "En resumen, esperando respuesta", clase: "warn" },
  RECHAZADO: { texto: "Rechazado por SUNAT", clase: "danger" },
  ERROR: { texto: "No llego a SUNAT", clase: "danger" }
};

function receiptSunatState(receipt) {
  return String(receipt.sunatEstado || "").toUpperCase();
}

function receiptSunatBadge(receipt) {
  const estado = receiptSunatState(receipt);
  if (!estado) {
    return sunatStatus.configurado
      ? `<span class="status warn">Sin enviar</span>`
      : `<span class="status warn">${escapeHtml(receipt.status || "BORRADOR")}</span>`;
  }
  const info = SUNAT_ESTADOS[estado] || { texto: estado, clase: "warn" };
  const detalle = [
    receipt.sunatCodigo ? `Codigo ${receipt.sunatCodigo}` : "",
    receipt.sunatDescripcion || ""
  ].filter(Boolean).join(" - ");
  return `<span class="status${info.clase ? ` ${info.clase}` : ""}">${escapeHtml(info.texto)}</span>${detalle ? `<br><span class="muted">${escapeHtml(detalle)}</span>` : ""}`;
}

function renderSunatPanel() {
  const notice = $("#sunatStatusNotice");
  const bar = $("#sunatSummaryBar");
  if (!notice) return;
  if (!API_ENABLED || !apiToken) {
    notice.className = "notice";
    notice.textContent = "Sin conexion con el servidor: los comprobantes solo quedan en este navegador.";
    if (bar) bar.hidden = true;
    return;
  }
  if (!sunatStatus.configurado) {
    notice.className = "notice";
    notice.textContent = "Registro interno exonerado de IGV. Todavia no envia a SUNAT: falta cargar el certificado y la Clave SOL en el servidor.";
    if (bar) bar.hidden = true;
    return;
  }
  const enProduccion = sunatStatus.modo === "produccion";
  notice.className = enProduccion ? "notice subtle" : "notice";
  const cabecera = enProduccion
    ? `Emitiendo a SUNAT con el RUC ${sunatStatus.ruc}.`
    : `MODO PRUEBAS: lo que se emita aqui no tiene valor legal. RUC ${sunatStatus.ruc}.`;
  notice.textContent = `${cabecera} Boletas ${sunatStatus.serieBoleta}, facturas ${sunatStatus.serieFactura}. Todo exonerado de IGV por la Ley de la Amazonia.`;
  if (!bar) return;
  bar.hidden = false;
  const fecha = $("#sunatSummaryDate");
  // por defecto el dia anterior, que es el que toca informar
  if (fecha && !fecha.value) fecha.value = addDaysISO(todayISO(), -1);
  const hint = $("#sunatSummaryHint");
  if (hint) {
    const partes = [];
    if (sunatStatus.boletasPendientes) partes.push(`${sunatStatus.boletasPendientes} boleta(s) sin informar`);
    if (sunatStatus.resumenesSinRespuesta) partes.push(`${sunatStatus.resumenesSinRespuesta} resumen(es) esperando respuesta`);
    hint.textContent = partes.join(" | ") || "Todas las boletas estan informadas.";
  }
}

function renderElectronicReceipts() {
  renderSunatPanel();
  const table = $("#electronicReceiptsTable");
  if (!table) return;
  const rows = state.electronicReceipts
    .slice()
    .sort((a, b) => `${b.issueDate || ""}${b.createdAt || ""}`.localeCompare(`${a.issueDate || ""}${a.createdAt || ""}`));
  table.innerHTML = rows.map((receipt) => {
    const estado = receiptSunatState(receipt);
    /* Un rechazo no se reintenta: ese numero ya se quemo y hay que emitir otro
       comprobante corregido. Solo se reenvia lo que nunca llego. */
    const puedeEnviar = sunatStatus.configurado && (!estado || estado === "ERROR");
    return `<tr>
    <td>${formatDate(receipt.issueDate)}</td>
    <td><strong>${escapeHtml(receiptFullNumber(receipt))}</strong><br><span class="muted">${escapeHtml(receipt.type)}</span></td>
    <td>${escapeHtml(receipt.customerName)}<br><span class="muted">${escapeHtml(receipt.customerDocType)} ${escapeHtml(receipt.customerDoc)}</span></td>
    <td>${escapeHtml(receipt.description)}<br><span class="muted">${escapeHtml(receipt.taxCondition)} | IGV ${money(receipt.igv)}</span></td>
    <td><strong>${money(receipt.total)}</strong></td>
    <td>${receiptSunatBadge(receipt)}</td>
    <td><button class="small-btn" data-print-receipt="${receipt.id}">PDF</button>${puedeEnviar ? ` <button class="small-btn" data-send-sunat="${receipt.id}">${estado === "ERROR" ? "Reintentar" : "Enviar a SUNAT"}</button>` : ""}</td>
  </tr>`;
  }).join("") || `<tr><td colspan="7">Aun no hay comprobantes emitidos.</td></tr>`;
}

/* Manda el comprobante a SUNAT. La factura se acepta o se rechaza al momento;
   la boleta queda firmada y sale despues en el resumen diario. */
async function enviarComprobanteASunat(receipt, { avisar = false } = {}) {
  if (!API_ENABLED || !apiToken) return null;
  if (!sunatStatus.configurado) await refreshSunatStatus();
  if (!sunatStatus.configurado) return null;
  try {
    const result = await emitReceiptToSunatApi(receipt.id);
    receipt.series = result.serie || receipt.series;
    receipt.number = Number(result.numero || receipt.number || 0);
    receipt.sunatEstado = result.estado || "";
    receipt.sunatCodigo = result.codigo || "";
    receipt.sunatDescripcion = result.descripcion || "";
    upsert(state.electronicReceipts, receipt);
    if (avisar && receipt.sunatEstado === "RECHAZADO") {
      alert(`SUNAT rechazo ${receiptFullNumber(receipt)}:\n${receipt.sunatDescripcion || "sin detalle"}`);
    }
    return result;
  } catch (error) {
    /* El pago y el comprobante ya quedaron guardados: solo falto el envio, y
       desde esta misma pantalla se puede reintentar. */
    receipt.sunatEstado = "ERROR";
    receipt.sunatDescripcion = error.message || "No se pudo enviar a SUNAT.";
    upsert(state.electronicReceipts, receipt);
    if (avisar) alert(`El pago quedo guardado, pero SUNAT no recibio el comprobante:\n${error.message}`);
    return null;
  }
}

async function reintentarComprobanteSunat(id) {
  if (sunatOcupado) return;
  const receipt = state.electronicReceipts.find((item) => item.id === id);
  if (!receipt) return;
  sunatOcupado = true;
  try {
    const result = await enviarComprobanteASunat(receipt, { avisar: true });
    if (result) {
      await refreshSunatStatus();
      if (result.estado === "ACEPTADO") alert(`SUNAT acepto ${receiptFullNumber(receipt)}.`);
      if (result.estado === "PENDIENTE") alert(`${receiptFullNumber(receipt)} quedo firmada. Se informa en el resumen diario.`);
    }
  } finally {
    sunatOcupado = false;
    renderElectronicReceipts();
  }
}

async function enviarResumenDiarioDeBoletas() {
  if (sunatOcupado) return;
  const fecha = $("#sunatSummaryDate")?.value || "";
  if (!fecha) {
    alert("Elige la fecha de las boletas que vas a informar.");
    return;
  }
  if (!confirm(`Se informaran a SUNAT las boletas del ${formatDate(fecha)}. Continuar?`)) return;
  sunatOcupado = true;
  try {
    const result = await sendSunatSummaryApi(fecha);
    if (!result.enviado) alert(result.motivo || "No habia boletas pendientes de esa fecha.");
    else alert(`Resumen ${result.resumen} enviado con ${result.boletas} boleta(s). SUNAT responde en unos minutos: usa "Revisar respuesta".`);
    await refreshElectronicReceiptsApi();
    await refreshSunatStatus();
  } catch (error) {
    alert(error.message);
  } finally {
    sunatOcupado = false;
    renderElectronicReceipts();
  }
}

async function revisarResumenesSunat() {
  if (sunatOcupado) return;
  sunatOcupado = true;
  try {
    const result = await checkSunatSummariesApi();
    const revisados = result.revisados || [];
    if (!revisados.length) alert("No hay resumenes esperando respuesta.");
    else {
      const detalle = revisados.map((item) => {
        if (item.error) return `${item.ticket}: ${item.error}`;
        if (!item.listo) return `${item.ticket}: SUNAT todavia lo esta procesando.`;
        return `${item.ticket}: ${item.estado}${item.descripcion ? ` - ${item.descripcion}` : ""}`;
      }).join("\n");
      alert(detalle);
    }
    await refreshElectronicReceiptsApi();
    await refreshSunatStatus();
  } catch (error) {
    alert(error.message);
  } finally {
    sunatOcupado = false;
    renderElectronicReceipts();
  }
}

function numberToSpanish(value) {
  const n = Math.trunc(Number(value) || 0);
  const units = ["CERO", "UNO", "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE", "OCHO", "NUEVE"];
  const teens = ["DIEZ", "ONCE", "DOCE", "TRECE", "CATORCE", "QUINCE", "DIECISEIS", "DIECISIETE", "DIECIOCHO", "DIECINUEVE"];
  const twenties = ["VEINTE", "VEINTIUNO", "VEINTIDOS", "VEINTITRES", "VEINTICUATRO", "VEINTICINCO", "VEINTISEIS", "VEINTISIETE", "VEINTIOCHO", "VEINTINUEVE"];
  const tens = ["", "", "VEINTE", "TREINTA", "CUARENTA", "CINCUENTA", "SESENTA", "SETENTA", "OCHENTA", "NOVENTA"];
  const hundreds = ["", "CIENTO", "DOSCIENTOS", "TRESCIENTOS", "CUATROCIENTOS", "QUINIENTOS", "SEISCIENTOS", "SETECIENTOS", "OCHOCIENTOS", "NOVECIENTOS"];
  if (n < 10) return units[n];
  if (n < 20) return teens[n - 10];
  if (n < 30) return twenties[n - 20];
  if (n < 100) {
    const rest = n % 10;
    return `${tens[Math.trunc(n / 10)]}${rest ? ` Y ${units[rest]}` : ""}`;
  }
  if (n === 100) return "CIEN";
  if (n < 1000) {
    const rest = n % 100;
    return `${hundreds[Math.trunc(n / 100)]}${rest ? ` ${numberToSpanish(rest)}` : ""}`;
  }
  if (n < 1000000) {
    const thousand = Math.trunc(n / 1000);
    const rest = n % 1000;
    const prefix = thousand === 1 ? "MIL" : `${numberToSpanish(thousand)} MIL`;
    return `${prefix}${rest ? ` ${numberToSpanish(rest)}` : ""}`;
  }
  return String(n);
}

function amountInWords(value) {
  const amount = Number(value) || 0;
  const integer = Math.trunc(amount);
  const cents = Math.round((amount - integer) * 100);
  return `${numberToSpanish(integer)} Y ${String(cents).padStart(2, "0")}/100 SOLES`;
}

function receiptDateSlash(date) {
  const value = String(date || "");
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return formatDate(date);
  return `${match[3]}/${match[2]}/${match[1]}`;
}

function printElectronicReceipt(id) {
  const receipt = state.electronicReceipts.find((item) => item.id === id);
  if (!receipt) return;
  const issuer = state.config;
  const w = window.open("", "_blank");
  if (!w) return;
  const logoUrl = `${location.origin}/assets/logo-cm.png`;
  const isInvoice = receipt.type === "FACTURA";
  const total = Number(receipt.total || 0);
  const unitValue = Number(receipt.unitValue || receipt.total || 0);
  const quantity = Number(receipt.quantity || 1);
  const amountWords = amountInWords(total);
  const receiptMoney = (value) => `S/ ${Number(value || 0).toFixed(2)}`;
  const issuerPlace = `${issuer.issuerDistrict} - ${issuer.issuerProvince} - ${issuer.issuerDepartment}`;
  const title = isInvoice ? "FACTURA ELECTRONICA" : "BOLETA DE VENTA ELECTRONICA";
  const customerDocLabel = isInvoice ? "RUC" : "DNI";
  const detailRows = isInvoice
    ? `<tr>
        <td class="right">${quantity.toFixed(2)}</td>
        <td class="center">UNIDAD</td>
        <td>${escapeHtml(String(receipt.description || "").toUpperCase())}</td>
        <td class="right">${unitValue.toFixed(2)}</td>
      </tr>`
    : `<tr>
        <td class="right">${quantity.toFixed(2)}</td>
        <td class="center">UNIDAD</td>
        <td>${escapeHtml(String(receipt.description || "").toUpperCase())}</td>
        <td class="right">${unitValue.toFixed(2)}</td>
        <td class="right">0.00</td>
        <td class="right">${total.toFixed(2)}</td>
      </tr>`;
  const detailHead = isInvoice
    ? `<tr><th>Cantidad</th><th>Unidad Medida</th><th>Descripcion</th><th>Valor Unitario</th></tr>`
    : `<tr><th>Cantidad</th><th>Unidad<br>Medida</th><th>Descripcion</th><th>Valor Unitario(*)</th><th>Descuento(*)</th><th>Importe de Venta(**)</th></tr>`;
  const totalsBox = isInvoice
    ? `<div class="split">
        <div>
          <p class="free-line">Valor de Venta de Operaciones Gratuitas : <span>S/ 0.00</span></p>
          <p class="amount-text">SON: ${escapeHtml(amountWords)}</p>
        </div>
        <table class="totals"><tbody>
          <tr><td>Sub Total Ventas</td><td>${receiptMoney(total)}</td></tr>
          <tr><td>Anticipos</td><td>S/ 0.00</td></tr>
          <tr><td>Descuentos</td><td>S/ 0.00</td></tr>
          <tr><td>Valor Venta</td><td>${receiptMoney(total)}</td></tr>
          <tr><td>ISC</td><td>S/ 0.00</td></tr>
          <tr><td>IGV</td><td>S/ 0.00</td></tr>
          <tr><td>Otros Cargos</td><td>S/ 0.00</td></tr>
          <tr><td>Otros Tributos</td><td>S/ 0.00</td></tr>
          <tr><td>Monto de redondeo</td><td>S/ 0.00</td></tr>
          <tr><td>Importe Total</td><td>${receiptMoney(total)}</td></tr>
        </tbody></table>
      </div>`
    : `<div class="boleta-lower">
        <div>
          <p>(*) Sin impuestos.<br>(**) Incluye impuestos, de ser Op. Gravada.</p>
          <p class="amount-text">SON: ${escapeHtml(amountWords)}</p>
        </div>
        <div>
          <p class="amount-text right">SON: ${escapeHtml(amountWords)}</p>
          <table class="totals"><tbody>
            <tr><td>Op. Gravada</td><td>S/ 0.00</td></tr>
            <tr><td>Op. Exonerada</td><td>${receiptMoney(total)}</td></tr>
            <tr><td>Op. Inafecta</td><td>S/ 0.00</td></tr>
            <tr><td>ISC</td><td>S/ 0.00</td></tr>
            <tr><td>IGV</td><td>S/ 0.00</td></tr>
            <tr><td>Otros Cargos</td><td>S/ 0.00</td></tr>
            <tr><td>Otros Tributos</td><td>S/ 0.00</td></tr>
            <tr><td>Monto de Redondeo</td><td>S/ 0.00</td></tr>
            <tr class="grand"><td>Importe Total</td><td>${receiptMoney(total)}</td></tr>
          </tbody></table>
        </div>
      </div>`;
  /* La leyenda cambia segun lo que SUNAT ya respondio: mientras no se emita de
     verdad, el papel tiene que decir que es solo un registro interno. */
  const nombreDocumento = isInvoice ? "Factura Electronica" : "Boleta de Venta Electronica";
  const estadoSunat = receiptSunatState(receipt);
  let note = `Esta es una representacion interna con formato referencial de ${nombreDocumento}. Pendiente de envio y validacion real en SUNAT.`;
  if (estadoSunat === "ACEPTADO") {
    note = `Representacion impresa de la ${nombreDocumento}. Aceptada por SUNAT; puedes consultarla en su portal.`;
  } else if (estadoSunat === "PENDIENTE" || estadoSunat === "ENVIADO") {
    note = `Representacion impresa de la ${nombreDocumento}. Firmada y declarada a SUNAT en el resumen diario.`;
  }

  w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(receiptFullNumber(receipt))}</title>
  <style>
    @page{size:A4;margin:12mm}
    *{box-sizing:border-box}
    body{font-family:Arial,Helvetica,sans-serif;color:#000;margin:0;background:#fff;font-size:11px}
    .actions{position:sticky;top:0;background:#fff;padding:8px 0;text-align:right}
    button{border:1px solid #111;background:#fff;padding:6px 10px;font-weight:700;cursor:pointer}
    .doc{width:100%;max-width:980px;margin:0 auto;border:1px solid #000;padding:4px 6px 0}
    .header{display:grid;grid-template-columns:1fr 340px;gap:14px;align-items:start;border-bottom:1px solid #000;padding:4px 2px 6px}
    .issuer{display:grid;grid-template-columns:62px 1fr;gap:8px;align-items:start;font-size:13px;line-height:1.15}
    .issuer img{width:56px;height:auto;margin-top:3px}
    .issuer strong{font-size:14px}
    .doc-box{border:3px solid #000;text-align:center;font-weight:700;font-size:16px;line-height:1.15;padding:5px 8px}
    .meta{display:grid;grid-template-columns:minmax(420px,1fr) 1fr 150px;gap:8px;padding:7px 2px 6px;font-size:12px;line-height:1.45}
    .meta.boleta-meta{grid-template-columns:1fr}
    .meta .label{display:grid;grid-template-columns:175px 10px minmax(0,1fr)}
    .meta strong{font-weight:700}
    table{width:100%;border-collapse:collapse}
    .items{border:1px solid #000;margin-top:2px;font-size:11.5px}
    th{font-weight:700;text-align:center;border-bottom:1px solid #000;padding:2px 4px}
    td{padding:3px 5px;vertical-align:top}
    .items tbody td{border-top:1px solid #000}
    .center{text-align:center}.right{text-align:right}
    .split{display:grid;grid-template-columns:1fr 500px;gap:8px;min-height:185px;padding:18px 6px 8px}
    .free-line{font-size:12px;margin:0 0 74px 40px}.free-line span{display:inline-block;min-width:180px;border:1px solid #000;padding:2px 4px}
    .amount-text{font-weight:700;font-size:14px;margin:0 0 0 4px}
    .totals{font-size:11.5px}
    .totals td{padding:2px 5px}
    .totals td:first-child{text-align:right;width:64%}
    .totals td:last-child{text-align:right;border:1px solid #000}
    .totals .grand td{font-size:16px;font-weight:700}
    .boleta-lower{display:grid;grid-template-columns:1fr 520px;gap:10px;border-left:1px solid #000;border-right:1px solid #000;border-bottom:1px solid #000;min-height:230px;padding:18px 8px 8px;font-size:11.5px}
    .boleta-lower .amount-text{margin-top:80px}
    .note{border:1px solid #000;border-top:0;text-align:center;font-style:italic;font-size:14px;line-height:1.25;padding:8px 18px}
    @media print{.actions{display:none}.doc{max-width:none}.note{font-size:13px}}
  </style></head><body>
    <div class="actions"><button onclick="window.print()">Imprimir / guardar PDF</button></div>
    <div class="doc">
      <div class="header">
        <div class="issuer">
          <img src="${escapeHtml(logoUrl)}" alt="Logo CM">
          <div>
            <strong>${escapeHtml(issuer.issuerTradeName || "C.O CM ODONTOLOGIA ESTETICA")}</strong><br>
            <strong>${escapeHtml(issuer.issuerLegalName || "")}</strong><br>
            ${escapeHtml(issuer.issuerAddress || "")}<br>
            ${escapeHtml(issuerPlace)}
          </div>
        </div>
        <div class="doc-box">${title}<br>RUC: ${escapeHtml(issuer.issuerRuc || "")}<br>${escapeHtml(receiptFullNumber(receipt))}</div>
      </div>
      <div class="meta ${isInvoice ? "invoice-meta" : "boleta-meta"}">
        <div>
          ${isInvoice ? "" : `<div class="label"><span>Fecha de Vencimiento</span><span>:</span><strong></strong></div>`}
          <div class="label"><span>Fecha de Emision</span><span>:</span><strong>${receiptDateSlash(receipt.issueDate)}</strong></div>
          <div class="label"><span>Señor(es)</span><span>:</span><strong>${escapeHtml(String(receipt.customerName || "").toUpperCase())}</strong></div>
          <div class="label"><span>${customerDocLabel}</span><span>:</span><strong>${escapeHtml(receipt.customerDoc || "")}</strong></div>
          ${isInvoice ? `<div class="label"><span>Establecimiento del Emisor</span><span>:</span><strong>${escapeHtml(issuer.issuerAddress || "")}<br>${escapeHtml(issuerPlace)}</strong></div>` : ""}
          <div class="label"><span>Tipo de Moneda</span><span>:</span><strong>SOLES</strong></div>
          <div class="label"><span>Observacion</span><span>:</span><strong></strong></div>
        </div>
        ${isInvoice ? `<div>${receipt.customerAddress ? `<strong>${escapeHtml(String(receipt.customerAddress).toUpperCase())}</strong>` : ""}</div><div>Forma de pago: Contado</div>` : ""}
      </div>
      <table class="items">
        <thead>${detailHead}</thead>
        <tbody>${detailRows}</tbody>
      </table>
      ${!isInvoice ? `<table class="totals" style="width:360px;margin:8px 12px 0 auto"><tbody><tr><td>Otros Cargos</td><td>S/ 0.00</td></tr><tr><td>Otros Tributos</td><td>S/ 0.00</td></tr><tr><td>Importe Total</td><td>${receiptMoney(total)}</td></tr></tbody></table>` : ""}
      ${totalsBox}
    </div>
    <div class="doc" style="border-top:0;padding:0"><div class="note">${note}</div></div>
  </body></html>`);
  w.document.close();
}

function openPaymentReceiptPrompt(context) {
  pendingPaymentContext = context;
  $("#receiptPromptDialog")?.showModal();
}

function setupReceiptIssueForm() {
  const context = pendingPaymentContext;
  const form = $("#receiptIssueForm");
  if (!context || !form) return;
  const patient = patientById(context.payment.patientId);
  form.reset();
  form.elements.namedItem("type").value = "BOLETA";
  form.elements.namedItem("customerDoc").placeholder = "DNI";
  form.elements.namedItem("customerDoc").value = patient?.dni || "";
  form.elements.namedItem("customerName").value = patient?.name || "";
  form.elements.namedItem("customerAddress").value = "";
  /* Vacio a proposito, con lo que saldria en gris: asi no hay que borrar lo
     puesto para escribir otra cosa, y quien no lo toca obtiene lo de siempre. */
  form.elements.namedItem("description").placeholder = descripcionPorDefecto(context.payment);
  $("#receiptAddressLabel").hidden = true;
  $("#receiptLookupHint").textContent = "Boleta: busca primero en pacientes registrados.";
}

function applyReceiptTypeUI() {
  const form = $("#receiptIssueForm");
  if (!form) return;
  const typeField = form.elements.namedItem("type");
  const docField = form.elements.namedItem("customerDoc");
  const nameField = form.elements.namedItem("customerName");
  const addressField = form.elements.namedItem("customerAddress");
  const isInvoice = typeField.value === "FACTURA";
  docField.placeholder = isInvoice ? "RUC" : "DNI";
  $("#receiptAddressLabel").hidden = !isInvoice;
  $("#receiptLookupHint").textContent = isInvoice ? "Factura: consulta RUC o completa manualmente." : "Boleta: busca primero en pacientes registrados.";
  if (isInvoice) {
    docField.value = "";
    nameField.value = "";
    addressField.value = "";
  } else {
    const patient = patientById(pendingPaymentContext?.payment?.patientId);
    docField.value = patient?.dni || "";
    nameField.value = patient?.name || "";
    addressField.value = "";
  }
}

async function lookupReceiptDocument() {
  const form = $("#receiptIssueForm");
  const hint = $("#receiptLookupHint");
  if (!form) return;
  const type = form.elements.namedItem("type").value;
  const docField = form.elements.namedItem("customerDoc");
  const nameField = form.elements.namedItem("customerName");
  const addressField = form.elements.namedItem("customerAddress");
  const doc = onlyDigits(docField.value);
  docField.value = doc;
  if (type === "BOLETA") {
    if (!/^\d{8}$/.test(doc)) {
      if (hint) hint.textContent = "El DNI debe tener 8 dígitos.";
      return;
    }
    const patient = state.patients.find((item) => String(item.dni || "").trim() === doc);
    if (patient) {
      nameField.value = patient.name || "";
      if (hint) hint.textContent = "Paciente encontrado en la base interna.";
      return;
    }
    if (!API_ENABLED || !apiToken) {
      if (hint) hint.textContent = "DNI no encontrado internamente. Completa el nombre manualmente.";
      return;
    }
    if (hint) hint.textContent = "Buscando DNI...";
    try {
      const payload = await lookupExternalDni(doc);
      if (payload?.name) {
        nameField.value = payload.name;
        if (hint) hint.textContent = "Nombre encontrado por DNI.";
      } else if (hint) {
        hint.textContent = "No se encontró el DNI. Completa el nombre manualmente.";
      }
    } catch (error) {
      if (hint) hint.textContent = error.message || "No se pudo consultar DNI. Completa manualmente.";
    }
    return;
  }
  if (!/^\d{11}$/.test(doc)) {
    if (hint) hint.textContent = "El RUC debe tener 11 dígitos.";
    return;
  }
  if (doc === state.config.issuerRuc) {
    nameField.value = state.config.issuerLegalName;
    addressField.value = `${state.config.issuerAddress}, ${state.config.issuerDistrict} - ${state.config.issuerProvince} - ${state.config.issuerDepartment}`;
    if (hint) hint.textContent = "Datos encontrados en la ficha RUC cargada.";
    return;
  }
  if (!API_ENABLED || !apiToken) {
    if (hint) hint.textContent = "Completa razón social y dirección fiscal manualmente.";
    return;
  }
  if (hint) hint.textContent = "Consultando RUC...";
  try {
    const payload = await lookupExternalRuc(doc);
    if (payload?.razonSocial) nameField.value = payload.razonSocial;
    if (payload?.direccionFiscal) addressField.value = payload.direccionFiscal;
    if (hint) {
      hint.textContent = payload?.razonSocial
        ? "Datos encontrados por RUC."
        : "No se encontró el RUC. Completa los datos manualmente.";
    }
  } catch (error) {
    if (hint) hint.textContent = error.message || "No se pudo consultar RUC. Completa manualmente.";
  }
}

async function lookupPatientDni() {
  const form = $("#patientForm");
  const hint = $("#patientDniLookupHint");
  const button = $("#lookupPatientDniBtn");
  if (!form) return;
  const dniField = form.elements.namedItem("dni");
  const nameField = form.elements.namedItem("name");
  const phoneField = form.elements.namedItem("phone");
  const birthDateField = form.elements.namedItem("birthDate");
  const doctorField = form.elements.namedItem("doctor");
  const treatmentField = form.elements.namedItem("mainTreatment");
  const currentId = form.elements.namedItem("id")?.value || "";
  const dni = onlyDigits(dniField.value);
  dniField.value = dni;
  if (!/^\d{8}$/.test(dni)) {
    if (hint) hint.textContent = "El DNI debe tener 8 dígitos.";
    return;
  }
  const existingPatient = state.patients.find((patient) => String(patient.dni || "").trim() === dni && patient.id !== currentId);
  if (existingPatient) {
    nameField.value = existingPatient.name || "";
    if (phoneField && existingPatient.phone) phoneField.value = existingPatient.phone;
    if (birthDateField && existingPatient.birthDate) birthDateField.value = existingPatient.birthDate;
    if (doctorField && existingPatient.doctor) doctorField.value = existingPatient.doctor;
    if (treatmentField && existingPatient.mainTreatment) treatmentField.value = existingPatient.mainTreatment;
    if (hint) hint.textContent = "Paciente encontrado en la base interna.";
    return;
  }
  if (!API_ENABLED || !apiToken) {
    if (hint) hint.textContent = "Completa los datos manualmente.";
    return;
  }
  if (button) {
    button.disabled = true;
    button.textContent = "Buscando...";
  }
  if (hint) hint.textContent = "Buscando DNI...";
  try {
    const payload = await lookupExternalDni(dni);
    if (payload?.name) {
      nameField.value = payload.name;
      if (hint) hint.textContent = "Nombre encontrado por DNI. Completa celular y fecha.";
    } else if (hint) {
      hint.textContent = "No se encontró el DNI. Completa los datos manualmente.";
    }
  } catch (error) {
    if (hint) hint.textContent = error.message || "No se pudo consultar DNI. Completa manualmente.";
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = "Buscar DNI";
    }
  }
}

// el ultimo DNI que se consulto, para no preguntar dos veces por lo mismo
let ultimoDniDelRepresentante = "";

/* Poner el valor a mano no avisa a nadie: sin este aviso, el nombre traido por
   la consulta no se copiaba al contacto de emergencia. */
function avisarDelRepresentante(campo) {
  campo.dispatchEvent(new Event("input", { bubbles: true }));
}

/* El representante legal tambien se busca por su DNI, igual que el paciente:
   quien lo atiende ya escribio ocho numeros, no tiene por que escribir ademas
   el nombre. Primero se mira en la base del consultorio -la madre suele ser
   paciente tambien, y ahi esta su celular- y solo si no esta se consulta
   afuera. Un nombre ya escrito no se pisa: en recepcion se corrigen tildes y
   el orden de los apellidos, y perder esa correccion molesta mas que ayuda. */
async function buscarNombreDelRepresentante() {
  const form = $("#patientForm");
  const hint = $("#guardianDniHint");
  const dniField = form?.elements?.guardianDni;
  const nameField = form?.elements?.guardianName;
  const phoneField = form?.elements?.guardianPhone;
  if (!dniField || !nameField) return;
  const dni = onlyDigits(dniField.value);
  if (dniField.value !== dni) dniField.value = dni;
  if (dni.length !== 8 || dni === ultimoDniDelRepresentante) return;
  if (String(nameField.value || "").trim()) return;
  ultimoDniDelRepresentante = dni;

  const yaEsPaciente = state.patients.find((patient) => String(patient.dni || "").trim() === dni);
  if (yaEsPaciente) {
    nameField.value = yaEsPaciente.name || "";
    if (phoneField && !String(phoneField.value || "").trim() && yaEsPaciente.phone) {
      phoneField.value = yaEsPaciente.phone;
    }
    if (hint) hint.textContent = "Encontrado en la base del consultorio.";
    avisarDelRepresentante(nameField);
    return;
  }
  if (!API_ENABLED || !apiToken) {
    if (hint) hint.textContent = "";
    ultimoDniDelRepresentante = "";
    return;
  }
  if (hint) hint.textContent = "Buscando el nombre...";
  try {
    const encontrado = await lookupExternalDni(dni);
    if (encontrado?.name && !String(nameField.value || "").trim()) {
      nameField.value = encontrado.name;
      if (hint) hint.textContent = "Nombre encontrado por DNI. Revísalo antes de guardar.";
      avisarDelRepresentante(nameField);
    } else if (hint) {
      hint.textContent = "No se encontró el DNI. Escribe el nombre a mano.";
    }
  } catch (error) {
    // el registro no se detiene por esto: se avisa y se sigue a mano
    if (hint) hint.textContent = error.message || "No se pudo consultar. Escribe el nombre a mano.";
    ultimoDniDelRepresentante = "";
  }
}


async function completePendingPayment(receiptValues = null) {
  const context = pendingPaymentContext;
  if (!context) return;
  const { payment, form, restorePaymentButton } = context;
  const optimisticSave = !receiptValues;
  const appointment = payment.appointmentId && state.config.enableAgendaPayments !== false
    ? state.appointments.find((item) => item.id === payment.appointmentId)
    : null;
  const previousAppointmentStatus = appointment?.status || "";
  const finishPaymentUi = () => {
    if (forcedPaymentHistoryId === payment.historyId) forcedPaymentHistoryId = "";
    form.reset();
    selectedProductSaleItems = [];
    renderPaymentProductSummary();
    form.date.value = operatingDate();
    pendingPaymentContext = null;
    $("#receiptPromptDialog")?.close("ok");
    $("#receiptIssueDialog")?.close("ok");
    if (currentView === "pagos") renderPayments();
    else render();
    restorePaymentButton();
  };
  const applyPaymentLocally = () => {
    upsert(state.payments, payment);
    if (!API_ENABLED && Array.isArray(payment.productItems)) {
      state.inventoryMovements = state.inventoryMovements.filter((movement) => movement.paymentId !== payment.id);
      payment.productItems.forEach((item) => {
        const product = inventoryProductById(item.productId);
        if (!product) return;
        const quantity = Number(item.quantity || 0);
        product.stock = Math.max(0, Number(product.stock || 0) - quantity);
        state.inventoryMovements.unshift({
          id: uid("mov"),
          productId: product.id,
          date: payment.date,
          type: "VENTA",
          quantity,
          unitPrice: Number(item.price || product.price || 0),
          total: quantity * Number(item.price || product.price || 0),
          detail: `Venta en pago ${payment.id}`,
          paymentId: payment.id,
          createdAt: new Date().toISOString()
        });
      });
    }
    if (appointment) {
      appointment.status = "ATENDIDA";
      addLocalAuditEvent(
        "APPOINTMENT_ATTENDED",
        `Marco atendida desde pago: ${patientById(appointment.patientId)?.name || "Paciente"} ${appointment.date} ${appointment.time}`,
        appointment.patientId
      );
    }
    if (!API_ENABLED) saveState();
  };
  if (optimisticSave) {
    applyPaymentLocally();
    finishPaymentUi();
  }
  try {
    await savePaymentApi(payment);
    if (receiptValues) {
      const receipt = buildElectronicReceiptFromPayment(payment, receiptValues);
      if (receipt) {
        await saveElectronicReceiptApi(receipt);
        upsert(state.electronicReceipts, receipt);
        /* El numero va en su propio campo. Antes se escribia sobre receipt,
           que es donde la persona anota que se le hizo al paciente: emitir el
           comprobante le borraba la nota y nadie se enteraba hasta buscarla. */
        payment.comprobante = receiptFullNumber(receipt);
        await savePaymentApi(payment);
        await enviarComprobanteASunat(receipt, { avisar: true });
      }
    }
    if (!optimisticSave) applyPaymentLocally();
  } catch (error) {
    if (optimisticSave) {
      state.payments = state.payments.filter((item) => item.id !== payment.id);
      if (appointment) appointment.status = previousAppointmentStatus;
      if (!API_ENABLED) saveState();
      render();
    }
    alert(error.message);
    restorePaymentButton();
    return;
  }
  if (!optimisticSave) finishPaymentUi();
}

/* Lo que el paciente ya fue abonando, debajo de su nombre. Sin esto, la fila
   solo decia cuanto falta: quien no registro el cobro no tenia como saber si
   ese dinero entro, ni quien lo recibio. Cada abono es un pago de la caja de
   su dia, asi que la caja de ese dia tiene que cuadrar con esto. */
function abonosDeLaCuenta(historyId) {
  const abonos = state.payments
    .filter((pago) => pago.historyId === historyId)
    .slice()
    .sort((a, b) => String(a.date || "").localeCompare(String(b.date || "")));
  if (!abonos.length) return "";
  return abonos.map((pago) => `<br><span class="muted">${esDescuentoDeTratamiento(pago) ? `Se descontó ${money(pago.descontado)} del tratamiento` : `Abonó ${money(pago.amount)}`} el ${escapeHtml(formatDate(pago.date))}${pago.registeredBy ? ` — ${escapeHtml(pago.registeredBy)}` : ""}</span>`).join("");
}

function renderReceivables() {
  const table = $("#receivablesTable");
  if (!table) return;
  const form = $("#manualReceivableForm");
  if (form) {
    if (form.creditDueDate && !form.creditDueDate.value) form.creditDueDate.value = todayISO();
    if (form.attentionDate && !form.attentionDate.value) form.attentionDate.value = todayISO();
  }
  const rows = receivableEntries();
  const today = todayISO();
  $("#receivablesTotal").textContent = money(rows.reduce((sum, item) => sum + item.balance, 0));
  $("#receivablesOverdue").textContent = rows.filter((item) => item.dueDate && item.dueDate < today).length;
  $("#receivablesToday").textContent = rows.filter((item) => item.dueDate === today).length;
  table.innerHTML = rows.map(({ entry, patient, balance, dueDate }) => {
    const status = dueDate < today ? "VENCIDO" : dueDate === today ? "COBRAR HOY" : "PROGRAMADO";
    const text = `Hola ${patient?.name || ""}, le saludamos de ${state.config.clinicName}. Le recordamos su pago pendiente de ${money(balance)} para el ${formatDate(dueDate)}.`;
    const wa = `https://wa.me/51${patient?.phone || ""}?text=${encodeURIComponent(text)}`;
    return `<tr>
      <td>${formatDate(dueDate)}</td>
      <td><strong>${escapeHtml(patient?.name || "")}</strong><br><span class="muted">${escapeHtml(entry.creditNote || entry.reason || "")}</span>${abonosDeLaCuenta(entry.id)}</td>
      <td>${escapeHtml(patient?.phone || "")}</td>
      <td>${escapeHtml(entry.attendedBy || patient?.doctor || "")}</td>
      <td><strong>${money(balance)}</strong></td>
      <td><span class="status ${status === "VENCIDO" ? "danger" : status === "COBRAR HOY" ? "warn" : ""}">${status}</span>${canEditReceivableAmount() ? `<button class="inline-edit-btn" data-edit-receivable="${entry.id}" title="Editar monto">Editar</button>` : ""}</td>
      <td class="row-actions">
        <a class="small-btn" href="${wa}" target="_blank" rel="noopener">WhatsApp</a>
        <button class="small-btn" data-pay-history="${entry.id}">Registrar pago</button>
        ${canEditReceivableAmount() ? `<button class="small-btn danger-btn" data-void-receivable="${entry.id}" title="Anular esta deuda">Anular</button>` : ""}
      </td>
    </tr>`;
  }).join("") || `<tr><td colspan="7">No hay cuentas por cobrar pendientes.</td></tr>`;
}

const CLASE_MOTIVO = {
  "CONTROL VENCIDO": "danger",
  "NO VINO Y NO REPROGRAMO": "danger",
  "SIN PROXIMA CITA": "warn",
  "NUNCA VINO": "",
};

/* La lista la calcula el servidor: el navegador solo recibe las citas de los
   proximos dias, y sin el historial completo un paciente atendido hace meses
   parecia no haber venido nunca. */
let patientsToCall = [];

async function refreshPatientsToCall() {
  if (!API_ENABLED || !apiToken) return;
  try {
    const result = await apiFetch("/api/patients-to-call");
    patientsToCall = result.patientsToCall || [];
  } catch (error) {
    patientsToCall = [];
  }
}

function renderPatientsToCall() {
  const table = $("#patientsToCallTable");
  if (!table) return;
  const contador = $("#toCallCount");
  if (contador) contador.textContent = `${patientsToCall.length} pendientes`;

  table.innerHTML = patientsToCall.map((fila) => {
    const wa = whatsappPhone(fila.phone);
    const mensaje = `Hola ${fila.name}, le saludamos de ${state.config.clinicName}. Queriamos saber como se encuentra y coordinar su proxima cita.`;
    const llamada = fila.contactDate
      ? `${formatDate(fila.contactDate)}<br><span class="muted">${escapeHtml(RESULTADOS_LLAMADA[fila.contactResult] || fila.contactResult || "")}</span>`
      : `<span class="muted">Sin registro</span>`;
    return `<tr>
      <td><span class="status ${CLASE_MOTIVO[fila.motivo] ?? ""}">${escapeHtml(fila.motivo)}</span>
        <br><span class="muted">${fila.dias ?? "-"} dias</span></td>
      <td><strong>${escapeHtml(fila.name)}</strong><br><span class="muted">${escapeHtml(fila.mainTreatment || "")}</span></td>
      <td>${escapeHtml(fila.phone || "-")}</td>
      <td>${fila.ultimaAtencion ? formatDate(fila.ultimaAtencion) : "<span class='muted'>Nunca</span>"}</td>
      <td>${llamada}</td>
      <td class="row-actions">
        ${wa ? `<a class="small-btn" target="_blank" rel="noopener" href="https://wa.me/${wa}?text=${encodeURIComponent(mensaje)}">WhatsApp</a>` : ""}
        <button class="small-btn" type="button" data-call-patient="${fila.id}">Registrar llamada</button>
      </td>
    </tr>`;
  }).join("") || `<tr><td colspan="6">No hay pacientes pendientes de llamar.</td></tr>`;
}

async function registrarLlamada(patientId) {
  const patient = patientById(patientId);
  if (!patient) return;
  const opciones = Object.entries(RESULTADOS_LLAMADA)
    .map(([clave, texto], indice) => `${indice + 1}. ${texto}`)
    .join("\n");
  const eleccion = prompt(`Llamada a ${patient.name}\n\n${opciones}\n\nEscribe el numero:`, "1");
  if (!eleccion) return;
  const claves = Object.keys(RESULTADOS_LLAMADA);
  const result = claves[Number(eleccion) - 1];
  if (!result) return alert("Opcion no valida.");

  const cuerpo = { patientId, result, note: "" };
  if (result === "VOLVERA") {
    const fecha = prompt("Para cuando quedo? (AAAA-MM-DD)", addDaysISO(todayISO(), 14));
    if (!fecha) return;
    if (!validISODate(fecha) || fecha <= todayISO()) return alert("Fecha no valida.");
    cuerpo.snoozeUntil = fecha;
  }
  cuerpo.note = prompt("Comentario (opcional):", "") || "";

  try {
    await apiFetch("/api/patient-contact", { method: "POST", body: JSON.stringify(cuerpo) });
  } catch (error) {
    return alert(error.message);
  }
  await refreshPatientsToCall();
  renderPatientsToCall();
}

function renderAppointmentFollowUps() {
  const table = $("#appointmentFollowUpsTable");
  if (!table) return;
  const rows = appointmentFollowUps();
  const count = $("#followUpCount");
  if (count) count.textContent = `${rows.length} pendientes`;
  table.innerHTML = rows.map((appointment) => {
    const patient = patientById(appointment.patientId);
    const waPhone = whatsappPhone(patient?.phone);
    const message = `Hola ${patient?.name || ""}, le saludamos de ${state.config.clinicName}. Tenemos pendiente reprogramar su cita dental. Podemos ayudarle con una nueva fecha.`;
    const wa = `https://wa.me/${waPhone}?text=${encodeURIComponent(message)}`;
    return `<tr class="${followUpClass(appointment)}">
      <td>${formatDate(appointment.date)}<br><span class="muted">${agendaTimeLabel(appointment.time)} | ${escapeHtml(appointment.unit || "")}</span></td>
      <td><strong>${escapeHtml(patient?.name || "Paciente")}</strong><br><span class="muted">${escapeHtml(appointment.service || "")}</span></td>
      <td>${escapeHtml(patient?.phone || "-")}</td>
      <td><span class="status ${followUpLabel(appointment) === "REPROG." ? "warn" : "danger"}">${escapeHtml(followUpLabel(appointment))}</span></td>
      <td>${escapeHtml(followUpNextText(appointment))}</td>
      <td>${escapeHtml(appointment.followUpComment || appointment.notes || "")}</td>
      <td class="row-actions">
        ${canManageAppointments() ? `<button class="small-btn" data-followup-reschedule="${appointment.id}">Reprogramar</button>` : ""}
        ${waPhone ? `<a class="small-btn" href="${wa}" target="_blank" rel="noopener">WhatsApp</a>` : ""}
        ${canManageAppointments() ? `<button class="small-btn danger-btn" data-followup-close="${appointment.id}">Cerrar</button>` : ""}
      </td>
    </tr>`;
  }).join("") || `<tr><td colspan="7">No hay citas en seguimiento.</td></tr>`;
}

function renderCashBox(cashDate = cashViewDate()) {
  const session = cashSessionForDate(cashDate);
  const isOpen = Boolean(session && !session.closedAt);
  const suggestedOpening = pettyCashAmount(cashDate);
  const openingInput = $("#openingCash");
  if (!session && openingInput && document.activeElement !== openingInput) openingInput.value = suggestedOpening || "";
  const opening = Number(session?.openingCash ?? openingInput?.value ?? suggestedOpening ?? 0);
  const income = visibleIncomeForCashView(cashDate);
  const expenses = visibleCashAffectingExpenseTotalForView(cashDate);
  const cashIncome = visibleIncomeByMethodsForCashView(cashDate, ["EFECTIVO"]);
  const walletIncome = visibleIncomeByMethodsForCashView(cashDate, ["YAPE", "PLIN"]);
  const bankIncome = visibleIncomeByMethodsForCashView(cashDate, ["TARJETA", "TRANSFERENCIA"]);
  const cashNet = opening + cashIncome - visibleExpenseByMethodsForCashView(cashDate, ["EFECTIVO"]);
  const walletNet = walletIncome - visibleExpenseByMethodsForCashView(cashDate, ["YAPE", "PLIN"]);
  const bankNet = bankIncome - visibleExpenseByMethodsForCashView(cashDate, ["TARJETA", "TRANSFERENCIA"]);
  const expected = opening + income - expenses;
  $("#cashStatus").textContent = isOpen ? "ABIERTA" : session?.closedAt ? "CERRADA" : "SIN APERTURA";
  $("#cashOpeningLabel").textContent = money(opening);
  $("#cashIncomeLabel").textContent = money(income);
  $("#cashExpenseLabel").textContent = money(expenses);
  $("#cashExpectedLabel").textContent = money(expected);
  $("#cashMethodCash").textContent = money(cashNet);
  $("#cashMethodWallet").textContent = money(walletNet);
  $("#cashMethodBank").textContent = money(bankNet);
  if (session && openingInput) openingInput.value = opening;
  if (openingInput) {
    openingInput.readOnly = true;
    openingInput.title = "La caja chica se modifica desde Caja general.";
  }
  const closingInput = $("#closingCash");
  if (session?.closedAt && closingInput && document.activeElement !== closingInput) closingInput.value = Number(session.closingCash || 0);
  const counted = Number(closingInput?.value || session?.closingCash || 0);
  $("#cashDifference").value = counted ? (counted - expected).toFixed(2) : "";
  toggleCashLockedState(isOpen && cashDate === operatingDate());
}

function renderExpenses(cashDate = cashViewDate()) {
  const expensesTable = $("#expensesTable");
  const expensesHeader = expensesTable?.closest("table")?.querySelector("thead tr");
  if (expensesHeader) {
    expensesHeader.innerHTML = `
      <th>Detalle</th>
      <th>Metodo</th>
      <th>Origen</th>
      <th>Monto</th>
      ${isAdmin() ? "<th>Accion</th>" : ""}
    `;
  }
  const sourceLabel = (expense) => {
    if (isUtilityContribution(expense)) return "A utilidad";
    if (expense.source === "UTILIDAD") return "Utilidad";
    if (expense.source === "CAJA_GENERAL") return "Caja general";
    if (expense.source === "CAJA_CHICA") return "Caja chica";
    if (expense.source === "INGRESO_DEL_DIA") return "Caja del dia";
    return expense.source || "";
  };
  const rows = visibleExpensesForCashView(cashDate)
    .filter((expense) => !expenseBelongsToGeneralCashView(expense))
    .map((expense) => `<tr>
    <td>${escapeHtml(expense.detail)}<br><span class="muted">${escapeHtml(expense.receipt || "")}</span></td>
    <td>${escapeHtml(expense.method)}</td>
    <td>${escapeHtml(sourceLabel(expense))}</td>
    <td><strong>${money(expense.amount)}</strong></td>
    ${isAdmin() ? `<td class="row-actions"><button class="small-btn danger-btn" data-delete-expense="${expense.id}">Eliminar</button></td>` : ""}
  </tr>`);
  expensesTable.innerHTML = rows.join("") || `<tr><td colspan="${isAdmin() ? 5 : 4}">No hay egresos registrados en esta fecha.</td></tr>`;
}

function toggleCashLockedState(isOpen) {
  const paymentForm = $("#paymentForm");
  if (paymentForm) {
    $$("input, select, textarea, button", paymentForm).forEach((control) => {
      if (control.type !== "button") control.disabled = !isOpen;
    });
  }
  const openExpenseBtn = $("#openExpenseBtn");
  if (openExpenseBtn) {
    openExpenseBtn.disabled = !isOpen || !canManageExpenses();
    openExpenseBtn.hidden = !canManageExpenses();
  }
  const openCashBtn = $("#openCashBtn");
  const closeCashBtn = $("#closeCashBtn");
  if (openCashBtn) openCashBtn.disabled = !canManageCash();
  if (closeCashBtn) closeCashBtn.disabled = !isOpen || !canManageCash();
  const lockedMessage = $("#cashLockedMessage");
  if (lockedMessage) lockedMessage.hidden = isOpen;
}

function renderCampaigns() {
  const inactivePatients = state.patients.filter((patient) => patientStatus(patient) === "INACTIVO" || patientDebt(patient.id) > 0);
  $("#campaignList").innerHTML = inactivePatients.map((patient) => {
    const debt = patientDebt(patient.id);
    const text = debt > 0
      ? `Hola ${patient.name}, le saludamos de ${state.config.clinicName}. Tiene un saldo pendiente de ${money(debt)}. Podemos ayudarle a regularizarlo.`
      : `Hola ${patient.name}, le saludamos de ${state.config.clinicName}. Queremos recordarle que puede agendar su control dental.`;
    const wa = `https://wa.me/51${patient.phone}?text=${encodeURIComponent(text)}`;
    return `<article class="campaign-card">
      <div class="card-title">
        <strong>${escapeHtml(patient.name)}</strong>
        <span class="status ${debt > 0 ? "warn" : ""}">${debt > 0 ? "SALDO" : "INACTIVO"}</span>
      </div>
      <p class="muted">${escapeHtml(patient.phone)} | ${escapeHtml(patient.mainTreatment)}</p>
      <p>${escapeHtml(text)}</p>
      <a class="primary" href="${wa}" target="_blank" rel="noopener">Enviar WhatsApp</a>
    </article>`;
  }).join("") || `<p class="muted">No hay pacientes pendientes para campana.</p>`;
}

function renderStaffPanel() {
  const today = todayISO();
  const todayAppointments = state.appointments.filter((appointment) => appointment.date === today);
  $("#panelWaiting").textContent = todayAppointments.filter((appointment) => ["RESERVADA", "CONFIRMADA"].includes(appointment.status)).length;
  $("#panelAttention").textContent = todayAppointments.filter((appointment) => appointment.status === "EN_ATENCION").length;
  $("#panelDone").textContent = todayAppointments.filter((appointment) => appointment.status === "ATENDIDA").length;
  $("#panelMissed").textContent = todayAppointments.filter((appointment) => appointment.status === "NO_ASISTIO").length;

  $("#receptionQueue").innerHTML = todayAppointments
    .sort((a, b) => a.time.localeCompare(b.time))
    .map((appointment) => {
      const patient = patientById(appointment.patientId);
      return `<article class="appointment-card">
        <div class="card-title">
          <strong>${appointment.time} | ${escapeHtml(patient?.name || "")}</strong>
          <span class="status">${escapeHtml(appointment.status)}</span>
        </div>
        <p class="muted">${escapeHtml(appointment.unit)} | ${escapeHtml(appointment.doctor)} | ${escapeHtml(appointment.service)}</p>
      </article>`;
    }).join("") || `<p class="muted">No hay pacientes en agenda para hoy.</p>`;

  const max = Math.max(1, todayAppointments.length);
  $("#doctorPanel").innerHTML = state.config.doctors.map((doctor) => {
    const count = todayAppointments.filter((appointment) => appointment.doctor === doctor).length;
    const percent = Math.round((count / max) * 100);
    return `<article class="doctor-card">
      <strong>${escapeHtml(doctor)}</strong>
      <p class="muted">${count} citas hoy</p>
      <div class="metric-bar"><span style="width:${percent}%"></span></div>
    </article>`;
  }).join("");
}

function renderReminders() {
  const startDate = todayISO();
  const endDate = addDaysISO(startDate, 2);
  /* Un recordatorio vale por el dia en que se manda, no para siempre. El aviso
     sale la noche anterior a todo el que tenga cita; uno enviado hace ocho dias
     -al agendar, o para una fecha que despues se reprogramo- ya no le recuerda
     nada a nadie, y sin embargo borraba al paciente de la lista para siempre.
     Cuenta solo el de hoy o el de ayer: asi lo enviado anoche no reaparece por
     la manana, y lo viejo vuelve a la lista como una cita mas por avisar. */
  const cuentaDesde = addDaysISO(startDate, -1);
  const avisadoHacePoco = (appointment) => String(appointment.reminderSentAt || "").slice(0, 10) >= cuentaDesde;
  const pendientes = state.appointments
    .filter((appointment) =>
      appointment.date >= startDate &&
      appointment.date <= endDate &&
      !avisadoHacePoco(appointment) &&
      isSlotBlockingAppointment(appointment)
    )
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
  /* Se cortaba en 60 tarjetas para tres dias. Aqui se atienden unos 20
     pacientes diarios, asi que el corte dejaba fuera a los del final -los de
     pasado manana- sin avisar que faltaban. */
  const upcoming = pendientes.slice(0, 200);
  const resumen = $("#remindersSummary");
  if (resumen) {
    const porDia = (fecha) => pendientes.filter((appointment) => appointment.date === fecha).length;
    resumen.hidden = !pendientes.length;
    resumen.textContent = `Por enviar: hoy ${porDia(startDate)} · mañana ${porDia(addDaysISO(startDate, 1))} · pasado mañana ${porDia(endDate)}. Total ${pendientes.length}.`;
  }
  $("#remindersList").innerHTML = upcoming.map((appointment) => {
    const patient = patientById(appointment.patientId);
    const text = appointmentReminderMessage(appointment, patient);
    const wa = `https://wa.me/51${patient?.phone || ""}?text=${encodeURIComponent(text)}`;
    return `<article class="campaign-card">
      <div class="card-title">
        <strong>${formatDate(appointment.date)} ${reminderTimeLabel(appointment.time)}</strong>
        <span class="status">${escapeHtml(appointment.status)}</span>
      </div>
      <p>${escapeHtml(friendlyName(patient?.name || ""))}</p>
      <p class="muted">${escapeHtml(appointment.service)} | ${escapeHtml(appointment.doctor)}</p>
      <button class="primary" type="button" data-send-reminder="${appointment.id}" data-wa="${escapeHtml(wa)}">Enviar recordatorio</button>
    </article>`;
  }).join("") || `<p class="muted">No hay recordatorios pendientes para hoy, mañana o pasado mañana.</p>`;
}

function monthLabel(month) {
  if (!month) return "";
  const [year, value] = month.split("-");
  const date = new Date(Number(year), Number(value) - 1, 1);
  return date.toLocaleDateString("es-PE", { month: "short", year: "numeric" });
}

function previousMonth(month) {
  const [year, value] = month.split("-").map(Number);
  const date = new Date(year, value - 2, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function uniquePatientCount(items) {
  return new Set(items.map((item) => item.patientId).filter(Boolean)).size;
}

function isReportAppointment(appointment) {
  return isSlotBlockingAppointment(appointment);
}

function agendaExportRow(appointment) {
  const patient = patientById(appointment.patientId);
  return {
    fecha: appointment.date,
    hora: appointment.time,
    unidad: appointment.unit,
    paciente: patient?.name || "",
    dni: patient?.dni || "",
    telefono: patient?.phone || "",
    doctor: appointment.doctor,
    servicio: appointment.service,
    estado: appointment.status,
    notas: appointment.notes || ""
  };
}

function exportAgendaDay() {
  const date = $("#agendaDate")?.value || todayISO();
  if (date < todayISO()) {
    alert("Por seguridad solo se puede exportar agenda de hoy o fechas futuras.");
    return;
  }
  const rows = state.appointments
    .filter((appointment) => appointment.date === date && isSlotBlockingAppointment(appointment))
    .sort((a, b) => `${a.time} ${a.unit}`.localeCompare(`${b.time} ${b.unit}`))
    .map(agendaExportRow);
  if (!rows.length) {
    alert("No hay citas para exportar en esa fecha.");
    return;
  }
  exportCsv(`agenda-${date}.csv`, rows);
}

function exportFutureAgenda() {
  const today = todayISO();
  const rows = state.appointments
    .filter((appointment) => appointment.date >= today && isSlotBlockingAppointment(appointment))
    .sort((a, b) => `${a.date} ${a.time} ${a.unit}`.localeCompare(`${b.date} ${b.time} ${b.unit}`))
    .map(agendaExportRow);
  if (!rows.length) {
    alert("No hay citas futuras para exportar.");
    return;
  }
  exportCsv(`agenda-desde-${today}.csv`, rows);
}

function reportMetrics(month) {
  const appointments = state.appointments.filter((appointment) => appointment.date.startsWith(month) && isReportAppointment(appointment));
  const payments = state.payments.filter((payment) => payment.date.startsWith(month));
  const expenses = state.expenses.filter((expense) => expense.date.startsWith(month));
  const newPatients = state.patients.filter((patient) => patient.createdAt?.startsWith(month));
  const receptionNewPatients = newPatients.filter((patient) => patient.createdByRole === "RECEPCION" && !patient.hideFromReceptionNew);
  const seenPatients = [...new Set(appointments.map((appointment) => appointment.patientId).filter(Boolean))]
    .map((patientId) => patientById(patientId))
    .filter(Boolean);
  const ageGroups = ["Ninos 0-12", "Adolescentes 13-17", "Jovenes 18-29", "Adultos 30-59", "Adultos mayores 60+", "Sin fecha"]
    .map((group) => ({
      group,
      count: seenPatients.filter((patient) => patientAgeGroup(patient, `${month}-28`) === group).length
    }));
  const oldPatientIds = new Set(
    appointments
      .map((appointment) => patientById(appointment.patientId))
      .filter((patient) => patient && !patient.createdAt?.startsWith(month))
      .map((patient) => patient.id)
  );
  const staffExpenses = expenses
    .filter((expense) => expense.category === "PERSONAL_TERCERO")
    .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  const utilityPurchases = expenses
    .filter(isUtilityPurchase)
    .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  const purchaseExpenses = expenses
    .filter((expense) => expense.category !== "PERSONAL_TERCERO" && !isUtilityPurchase(expense) && !isUtilityContribution(expense))
    .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  return {
    appointments,
    payments,
    expenses,
    income: payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0),
    staffExpenses,
    purchaseExpenses,
    utilityPurchases,
    totalExpenses: staffExpenses + purchaseExpenses + utilityPurchases,
    newPatients,
    receptionNewPatients,
    ageGroups,
    oldPatients: oldPatientIds.size,
    inactivePatients: state.patients.filter((patient) => patientStatus(patient) === "INACTIVO").length,
    attended: appointments.filter((appointment) => appointment.status === "ATENDIDA").length,
    patientsSeen: uniquePatientCount(appointments)
  };
}

function monthRangeForReports(referenceMonth) {
  const [year, month] = referenceMonth.split("-").map(Number);
  const months = [];
  for (let offset = 5; offset >= 0; offset -= 1) {
    const date = new Date(year, month - 1 - offset, 1);
    months.push(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`);
  }
  return months;
}

function reportRefreshRange(month, compareMonth) {
  const months = [...new Set([...monthRangeForReports(month), compareMonth].filter(Boolean))].sort();
  const from = monthStart(months[0] || month);
  const to = monthEnd(months[months.length - 1] || month);
  return { from, to };
}

async function refreshReportsRange() {
  const month = $("#reportMonth")?.value || todayISO().slice(0, 7);
  const compareMonth = $("#compareMonth")?.value || previousMonth(month);
  const range = reportRefreshRange(month, compareMonth);
  await refreshRangeThenRender(range.from, range.to, renderReports);
}

function monthlyCareData(referenceMonth) {
  return monthRangeForReports(referenceMonth).map((month) => ({
    month,
    label: monthLabel(month).replace(".", ""),
    count: state.appointments.filter((appointment) => appointment.date.startsWith(month) && appointment.status === "ATENDIDA").length
  }));
}

function renderMiniLineChart(container, data) {
  if (!container) return;
  const width = 420;
  const height = 170;
  const padX = 34;
  const padTop = 28;
  const padBottom = 38;
  const max = Math.max(1, ...data.map((item) => item.count));
  const points = data.map((item, index) => {
    const x = padX + (index * (width - padX * 2)) / Math.max(1, data.length - 1);
    const y = height - padBottom - (item.count / max) * (height - padTop - padBottom);
    return { ...item, x, y };
  });
  const polyline = points.map((point) => `${point.x},${point.y}`).join(" ");
  const area = `${padX},${height - padBottom} ${polyline} ${width - padX},${height - padBottom}`;
  const total = data.reduce((sum, item) => sum + item.count, 0);
  const current = data[data.length - 1]?.count || 0;
  const previous = data[data.length - 2]?.count || 0;
  const variation = current - previous;
  const gridLines = [0, 0.5, 1].map((ratio) => {
    const y = padTop + ratio * (height - padTop - padBottom);
    return `<line x1="${padX}" y1="${y}" x2="${width - padX}" y2="${y}" class="chart-grid"></line>`;
  }).join("");
  container.innerHTML = `
    <div class="chart-summary">
      <span>Ultimos 6 meses</span>
      <strong>${total}</strong>
      <small>${variation >= 0 ? "+" : ""}${variation} vs mes anterior</small>
    </div>
    <svg class="report-line-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="Atenciones mensuales">
      <defs>
        <linearGradient id="careAreaGradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="#18b89f" stop-opacity="0.22"></stop>
          <stop offset="100%" stop-color="#18b89f" stop-opacity="0.02"></stop>
        </linearGradient>
      </defs>
      ${gridLines}
      <polygon points="${area}" class="chart-area"></polygon>
      <polyline points="${polyline}" class="chart-line" fill="none"></polyline>
      ${points.map((point) => `<circle cx="${point.x}" cy="${point.y}" r="5"></circle>`).join("")}
      ${points.map((point) => `<text x="${point.x}" y="${height - 12}" text-anchor="middle">${escapeHtml(point.label.split(" ")[0])}</text>`).join("")}
      ${points.map((point) => `<text x="${point.x}" y="${Math.max(18, point.y - 11)}" text-anchor="middle" class="chart-value">${point.count}</text>`).join("")}
    </svg>
  `;
}

function receptionNewPatientsForMonth(month) {
  return state.patients
    .filter((patient) => patient.createdAt?.startsWith(month) && patient.createdByRole === "RECEPCION" && !patient.hideFromReceptionNew)
    .sort((a, b) => `${b.createdAt || ""} ${b.name || ""}`.localeCompare(`${a.createdAt || ""} ${a.name || ""}`));
}

function renderReceptionNewPatientsWidget(month) {
  const container = $("#monthlyCareChart");
  if (!container) return;
  const patients = receptionNewPatientsForMonth(month);
  container.insertAdjacentHTML("beforeend", `
    <div class="reception-new-card">
      <div>
        <span>Pacientes nuevos por recepción</span>
        <strong>${patients.length}</strong>
        <small>${monthLabel(month)}</small>
      </div>
      <button class="open-mini-modal" id="openReceptionPatientsBtn" type="button" aria-label="Abrir registro de pacientes nuevos">↗</button>
    </div>
  `);
}

function renderReceptionPatientsModal(month = $("#reportMonth")?.value || todayISO().slice(0, 7)) {
  const title = $("#receptionPatientsTitle");
  const body = $("#receptionPatientsBody");
  if (!title || !body) return;
  const patients = receptionNewPatientsForMonth(month);
  title.textContent = `Pacientes nuevos de recepción | ${monthLabel(month)}`;
  body.innerHTML = patients.map((patient) => `
    <tr>
      <td>${formatDate(patient.createdAt)}</td>
      <td><strong>${escapeHtml(patient.name)}</strong><br><span class="muted">${escapeHtml(patient.createdByName || "Recepcion")}</span></td>
      <td>${escapeHtml(patient.dni)}</td>
      <td>${escapeHtml(patient.phone)}</td>
      <td class="row-actions">${isAdmin() ? `<button class="small-btn danger-btn" data-hide-reception-patient="${patient.id}">Ocultar</button>` : ""}</td>
    </tr>
  `).join("") || `<tr><td colspan="5">No hay pacientes nuevos registrados por recepción este mes.</td></tr>`;
}

function openReceptionPatientsModal() {
  renderReceptionPatientsModal();
  $("#receptionPatientsDialog")?.showModal();
}

function renderDailyAuditReport() {
  const events = state.auditEvents.filter((event) => event.eventDate === todayISO()).slice(0, 12);
  const rows = events.map((event) => {
    const time = event.createdAt ? new Date(event.createdAt).toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" }) : "";
    return `<tr>
      <td>${escapeHtml(time)}</td>
      <td>${escapeHtml(event.userName || "Usuario")}</td>
      <td>${escapeHtml(roleLabels[event.userRole] || event.userRole || "")}</td>
      <td>${escapeHtml(event.detail || "")}</td>
    </tr>`;
  }).join("");
  $("#dailyAuditReport").innerHTML = `<table><thead><tr><th>Hora</th><th>Usuario</th><th>Rol</th><th>Accion</th></tr></thead><tbody>${rows || `<tr><td colspan="4">Sin actividad registrada hoy.</td></tr>`}</tbody></table>`;
}

function dailyIncomeBreakdownRows(month) {
  const dates = [...new Set([
    ...state.payments.filter((payment) => payment.date.startsWith(month)).map((payment) => payment.date),
    ...state.expenses.filter((expense) => expense.date.startsWith(month)).map((expense) => expense.date)
  ])].sort();
  return dates.map((date) => {
    const gross = incomeForDate(date);
    const cash = incomeForDate(date, "EFECTIVO");
    const yape = incomeForDate(date, "YAPE");
    const plin = incomeForDate(date, "PLIN");
    const transfer = incomeForDate(date, "TRANSFERENCIA");
    const card = incomeForDate(date, "TARJETA");
    const operationalExpenses = dailyExpenseTotal(date);
    const generalExpenses = dailyGeneralExpenseTotal(date);
    const utilityTransfer = utilityContributionTotalForDate(date);
    const operationalExpenseMethods = {
      cash: operationalExpenseByMethodsForDate(date, ["EFECTIVO"]),
      yape: operationalExpenseByMethodsForDate(date, ["YAPE"]),
      plin: operationalExpenseByMethodsForDate(date, ["PLIN"]),
      transfer: operationalExpenseByMethodsForDate(date, ["TRANSFERENCIA"]),
      card: operationalExpenseByMethodsForDate(date, ["TARJETA"])
    };
    const generalExpenseMethods = {
      cash: generalCashExpenseByMethodsForDate(date, ["EFECTIVO"]),
      yape: generalCashExpenseByMethodsForDate(date, ["YAPE"]),
      plin: generalCashExpenseByMethodsForDate(date, ["PLIN"]),
      transfer: generalCashExpenseByMethodsForDate(date, ["TRANSFERENCIA"]),
      card: generalCashExpenseByMethodsForDate(date, ["TARJETA"])
    };
    const net = gross - operationalExpenses - generalExpenses - utilityTransfer;
    return { date, gross, cash, yape, plin, transfer, card, operationalExpenses, generalExpenses, utilityTransfer, operationalExpenseMethods, generalExpenseMethods, net };
  });
}

function renderDailyIncomeBreakdown(month) {
  const rows = dailyIncomeBreakdownRows(month).map((row) => {
    return `<tr>
      <td>${formatDate(row.date)}</td>
      <td><strong>${money(row.gross)}</strong></td>
      <td>${money(row.cash)}</td>
      <td>${money(row.yape)}</td>
      <td>${money(row.plin)}</td>
      <td>${money(row.transfer)}</td>
      <td>${money(row.card)}</td>
      <td>${money(row.operationalExpenses)}</td>
      <td>${money(row.operationalExpenseMethods.cash)}</td>
      <td>${money(row.operationalExpenseMethods.yape)}</td>
      <td>${money(row.operationalExpenseMethods.plin)}</td>
      <td>${money(row.operationalExpenseMethods.transfer)}</td>
      <td>${money(row.operationalExpenseMethods.card)}</td>
      <td>${money(row.generalExpenses)}</td>
      <td>${money(row.generalExpenseMethods.cash)}</td>
      <td>${money(row.generalExpenseMethods.yape)}</td>
      <td>${money(row.generalExpenseMethods.plin)}</td>
      <td>${money(row.generalExpenseMethods.transfer)}</td>
      <td>${money(row.generalExpenseMethods.card)}</td>
      <td>${money(row.utilityTransfer)}</td>
      <td><strong>${money(row.net)}</strong></td>
    </tr>`;
  }).join("");
  $("#dailyIncomeBreakdownReport").innerHTML = `<table class="daily-income-table"><thead><tr><th>Fecha</th><th>Bruto</th><th>Efectivo</th><th>Yape</th><th>Plin</th><th>Transfer.</th><th>Tarjeta</th><th>Egresos oper.</th><th>Op. efectivo</th><th>Op. yape</th><th>Op. plin</th><th>Op. transfer.</th><th>Op. tarjeta</th><th>Egresos caja gral.</th><th>Caja efectivo</th><th>Caja yape</th><th>Caja plin</th><th>Caja transfer.</th><th>Caja tarjeta</th><th>A utilidad</th><th>Neto</th></tr></thead><tbody>${rows || `<tr><td colspan="21">Sin ingresos registrados este mes.</td></tr>`}</tbody></table>`;
}

function renderReports() {
  if (!$("#reportMonth").value) $("#reportMonth").value = todayISO().slice(0, 7);
  if (!$("#compareMonth").value) $("#compareMonth").value = previousMonth($("#reportMonth").value);
  const month = $("#reportMonth").value;
  const compareMonth = $("#compareMonth").value;
  const metrics = reportMetrics(month);
  const compare = reportMetrics(compareMonth);
  const appointments = metrics.appointments;
  $("#reportAppointments").textContent = appointments.length;
  $("#reportIncome").textContent = money(metrics.income);
  $("#reportNewPatients").textContent = metrics.newPatients.length;
  $("#reportReceptionNewPatients").textContent = metrics.receptionNewPatients.length;
  $("#reportOldPatients").textContent = metrics.oldPatients;
  $("#reportInactivePatients").textContent = metrics.inactivePatients;
  $("#reportStaffExpenses").textContent = money(metrics.staffExpenses);
  $("#reportPurchaseExpenses").textContent = money(metrics.purchaseExpenses);
  $("#reportUtilityPurchases").textContent = money(metrics.utilityPurchases);

  const compareRows = [
    ["Ingresos", money(metrics.income), money(compare.income), money(metrics.income - compare.income)],
    ["Gastos compras", money(metrics.purchaseExpenses), money(compare.purchaseExpenses), money(metrics.purchaseExpenses - compare.purchaseExpenses)],
    ["Compras con utilidad", money(metrics.utilityPurchases), money(compare.utilityPurchases), money(metrics.utilityPurchases - compare.utilityPurchases)],
    ["Pagos a terceros", money(metrics.staffExpenses), money(compare.staffExpenses), money(metrics.staffExpenses - compare.staffExpenses)],
    ["Pacientes nuevos", metrics.newPatients.length, compare.newPatients.length, metrics.newPatients.length - compare.newPatients.length],
    ["Pacientes atendidos", metrics.attended, compare.attended, metrics.attended - compare.attended],
    ["Pacientes con cita", metrics.patientsSeen, compare.patientsSeen, metrics.patientsSeen - compare.patientsSeen]
  ].map(([label, current, previous, variation]) => `<tr><td>${label}</td><td>${current}</td><td>${previous}</td><td><strong>${variation}</strong></td></tr>`).join("");
  $("#monthCompareReport").innerHTML = `<table><thead><tr><th>Indicador</th><th>${monthLabel(month)}</th><th>${monthLabel(compareMonth)}</th><th>Variacion</th></tr></thead><tbody>${compareRows}</tbody></table>`;
  renderDailyIncomeBreakdown(month);

  const doctorRows = state.config.doctors.map((doctor) => {
    const count = appointments.filter((appointment) => appointment.doctor === doctor).length;
    const attended = appointments.filter((appointment) => appointment.doctor === doctor && appointment.status === "ATENDIDA").length;
    const assignedPatients = state.patients.filter((patient) => patient.doctor === doctor).length;
    const newAssigned = metrics.newPatients.filter((patient) => patient.doctor === doctor).length;
    return `<tr><td>${escapeHtml(doctor)}</td><td>${assignedPatients}</td><td>${newAssigned}</td><td>${count}</td><td>${attended}</td></tr>`;
  }).join("");
  $("#doctorReport").innerHTML = `<table><thead><tr><th>Doctor</th><th>Pacientes</th><th>Nuevos mes</th><th>Citas</th><th>Atendidas</th></tr></thead><tbody>${doctorRows}</tbody></table>`;

  const serviceMap = appointments.reduce((map, appointment) => {
    map[appointment.service] = (map[appointment.service] || 0) + 1;
    return map;
  }, {});
  const serviceRows = Object.entries(serviceMap)
    .sort((a, b) => b[1] - a[1])
    .map(([service, count]) => `<tr><td>${escapeHtml(service)}</td><td>${count}</td></tr>`)
    .join("");
  $("#serviceReport").innerHTML = `<table><thead><tr><th>Servicio</th><th>Citas</th></tr></thead><tbody>${serviceRows || `<tr><td colspan="2">Sin datos</td></tr>`}</tbody></table>`;

  const ageRows = metrics.ageGroups
    .map((item) => `<tr><td>${escapeHtml(item.group)}</td><td>${item.count}</td></tr>`)
    .join("");
  $("#ageReport").innerHTML = `<table><thead><tr><th>Grupo de edad</th><th>Pacientes con cita</th></tr></thead><tbody>${ageRows}</tbody></table>`;
  renderDailyAuditReport();
  renderMiniLineChart($("#monthlyCareChart"), monthlyCareData(month));
  renderReceptionNewPatientsWidget(month);
}

function renderConfig() {
  const form = $("#configForm");
  if (!(document.activeElement && form.contains(document.activeElement))) {
    form.clinicName.value = state.config.clinicName;
    form.start.value = state.config.start;
    form.end.value = state.config.end;
    form.interval.value = state.config.interval;
    form.inactiveDays.value = state.config.inactiveDays;
    form.whatsapp.value = state.config.whatsapp;
    form.enableAgendaPayments.checked = state.config.enableAgendaPayments !== false;
    form.doctors.value = state.config.doctors.join(", ");
    form.units.value = state.config.units.join(", ");
    form.services.value = state.services.filter((service) => service.active).map((service) => service.name).join(", ");
  }
  renderUsers();
}

function renderUsers() {
  const table = $("#usersTable");
  if (!table) return;
  table.innerHTML = state.users.map((user) => `<tr>
    <td>${escapeHtml(user.name)}</td>
    <td>${escapeHtml(user.username)}</td>
    <td>${roleLabels[user.role] || user.role}</td>
    <td>${user.active ? "Activo" : "Inactivo"}</td>
    <td>
      <button class="ghost" data-edit-user="${user.id}">Editar</button>
      ${user.id !== "u-admin" ? `<button class="ghost" data-toggle-user="${user.id}">${user.active ? "Desactivar" : "Activar"}</button>` : ""}
    </td>
  </tr>`).join("");
}

function cashBalanceStartDate() {
  const today = todayISO();
  const day = Number(today.slice(8, 10));
  const month = today.slice(0, 7);
  return `${day <= 5 ? previousMonth(month) : month}-01`;
}

function isFromCashBalancePeriod(item) {
  return String(item?.date || "") >= cashBalanceStartDate();
}

function cashBalancePeriodLabel() {
  return `${formatDate(cashBalanceStartDate())} - ${formatDate(todayISO())}`;
}

function nextMonth(month) {
  const [year, value] = String(month || todayISO().slice(0, 7)).split("-").map(Number);
  const date = new Date(year, value, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthKeysInRange(fromDate, toDate) {
  const months = [];
  let month = String(fromDate || todayISO()).slice(0, 7);
  const lastMonth = String(toDate || fromDate || todayISO()).slice(0, 7);
  while (month <= lastMonth) {
    months.push(month);
    month = nextMonth(month);
  }
  return months;
}

function monthlyOpening(month) {
  const opening = state.config.monthlyOpenings?.[month] || {};
  return {
    cash: Number(opening.cash || 0),
    bank: Number(opening.bank || 0)
  };
}

function monthlyOpeningForRange(fromDate, toDate) {
  return monthKeysInRange(fromDate, toDate).reduce((total, month) => {
    const opening = monthlyOpening(month);
    total.cash += opening.cash;
    total.bank += opening.bank;
    return total;
  }, { cash: 0, bank: 0 });
}

function openingMonthForForm() {
  return selectedCashReportRange?.month || todayISO().slice(0, 7);
}

function generalCashBalances(options = {}) {
  const fromDate = options.from || cashBalanceStartDate();
  const toDate = options.to || todayISO();
  const opening = monthlyOpeningForRange(fromDate, toDate);
  const inRange = (item) => {
    const date = String(item?.date || "");
    return date >= fromDate && date <= toDate;
  };
  const balancePayments = state.payments.filter(inRange);
  const balanceExpenses = state.expenses.filter(inRange);
  const allUtilityMovements = state.expenses.filter((expense) => isUtilityContribution(expense) || isUtilityPurchase(expense));
  const pettyCashDates = [...new Set([
    ...state.pettyCashAllocations.map((item) => item.date),
    ...state.cashSessions.map((session) => session.date)
  ])].filter((date) => String(date || "") >= fromDate && String(date || "") <= toDate);
  const pettyCash = pettyCashDates.reduce((sum, date) => sum + pettyCashDeliveredForDate(date), 0);
  const cashIncome = balancePayments
    .reduce((sum, payment) => sum + paymentAmountForMethods(payment, ["EFECTIVO"]), 0);
  const walletIncome = balancePayments
    .reduce((sum, payment) => sum + paymentAmountForMethods(payment, ["YAPE", "PLIN"]), 0);
  const transferIncome = balancePayments
    .reduce((sum, payment) => sum + paymentAmountForMethods(payment, ["TRANSFERENCIA"]), 0);
  /* La tarjeta entra por el POS, no por la billetera: es su propia bolsa. */
  const cardIncome = balancePayments
    .reduce((sum, payment) => sum + paymentAmountForMethods(payment, ["TARJETA"]), 0);
  const cashExpenses = balanceExpenses
    .filter((expense) => expense.source !== "UTILIDAD" && String(expense.method || "").toUpperCase() === "EFECTIVO")
    .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  const walletExpenses = balanceExpenses
    .filter((expense) => expense.source !== "UTILIDAD" && ["YAPE", "PLIN"].includes(String(expense.method || "").toUpperCase()))
    .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  const transferExpenses = balanceExpenses
    .filter((expense) => expense.source !== "UTILIDAD" && String(expense.method || "").toUpperCase() === "TRANSFERENCIA")
    .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  const cardExpenses = balanceExpenses
    .filter((expense) => expense.source !== "UTILIDAD" && String(expense.method || "").toUpperCase() === "TARJETA")
    .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  const utilityContributions = allUtilityMovements
    .filter(isUtilityContribution)
    .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  const utilityPurchases = allUtilityMovements
    .filter(isUtilityPurchase)
    .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  const cash = opening.cash + cashIncome - cashExpenses - pettyCash;
  const wallet = opening.bank + walletIncome - walletExpenses;
  const transfer = transferIncome - transferExpenses;
  const card = cardIncome - cardExpenses;
  const bank = wallet + transfer + card;
  const utility = Number(state.config.generalUtilityOpening || 0) + utilityContributions - utilityPurchases;
  return {
    cash,
    bank,
    wallet,
    transfer,
    card,
    utility,
    total: cash + bank,
    cashOpening: opening.cash,
    bankOpening: opening.bank,
    utilityOpening: Number(state.config.generalUtilityOpening || 0),
    cashIncome,
    walletIncome,
    transferIncome,
    cardIncome,
    cashExpenses,
    walletExpenses,
    transferExpenses,
    cardExpenses,
    utilityContributions,
    utilityPurchases,
    pettyCash,
    fromDate,
    toDate
  };
}

function openGeneralBalanceDetail(type, options = {}) {
  const title = $("#generalBalanceDetailTitle");
  const summary = $("#generalBalanceDetailSummary");
  const head = $("#generalBalanceDetailHead");
  const body = $("#generalBalanceDetailBody");
  if (!title || !summary || !head || !body) return;
  const isCash = type === "cash";
  const isUtility = type === "utility";
  const fromDate = options.from || cashBalanceStartDate();
  const toDate = options.to || todayISO();
  const periodLabel = options.label || `${formatDate(fromDate)} - ${formatDate(toDate)}`;
  const balances = generalCashBalances({ from: fromDate, to: toDate });
  if (isUtility) {
    const movements = utilityMovements();
    const totalContributions = movements.filter(isUtilityContribution).reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const totalPurchases = movements.filter(isUtilityPurchase).reduce((sum, item) => sum + Number(item.amount || 0), 0);
    title.textContent = "Movimientos de utilidad";
    summary.innerHTML = `<span>Utilidad inicial: <strong>${money(balances.utilityOpening)}</strong></span><span>Aportes: <strong>${money(totalContributions)}</strong></span><span>Compras: <strong>${money(totalPurchases)}</strong></span><span>Saldo actual: <strong>${money(balances.utility)}</strong></span>`;
    head.innerHTML = `<tr><th>Fecha</th><th>Movimiento</th><th>Metodo</th><th>Monto</th><th>Detalle</th></tr>`;
    body.innerHTML = movements.map((item) => {
      const isPurchase = isUtilityPurchase(item);
      return `<tr>
        <td>${formatDate(item.date)}</td>
        <td><span class="status ${isPurchase ? "danger" : ""}">${isPurchase ? "COMPRA" : "APORTE"}</span></td>
        <td>${escapeHtml(item.method || "")}</td>
        <td><strong>${isPurchase ? "-" : ""}${money(item.amount)}</strong></td>
        <td>${escapeHtml(item.detail || "")}</td>
      </tr>`;
    }).join("") || `<tr><td colspan="5">Aun no hay movimientos de utilidad.</td></tr>`;
    $("#generalBalanceDetailDialog")?.showModal();
    return;
  }
  const rows = allDatesWithCashActivity()
    .filter((date) => date >= fromDate && date <= toDate)
    .sort()
    .map((date) => ({
      date,
      cash: incomeForDate(date, "EFECTIVO"),
      yape: incomeForDate(date, "YAPE"),
      plin: incomeForDate(date, "PLIN"),
      transfer: incomeForDate(date, "TRANSFERENCIA"),
      card: incomeForDate(date, "TARJETA")
    }));
  const titlePrefix = isCash ? "Ingresos efectivo" : "Ingresos billeteras y bancos";
  const startLabel = formatDate(fromDate);
  title.textContent = `${titlePrefix} | ${periodLabel}`;
  const total = rows.reduce((sum, row) => {
    return sum + (isCash ? row.cash : row.yape + row.plin + row.transfer + row.card);
  }, 0);
  if (isCash) {
    const cashRows = rows.map((row) => ({
      ...row,
      cashExpense: cashBoxDetailExpenseByMethodsForDate(row.date, ["EFECTIVO"]),
      pettyCash: pettyCashDeliveredForDate(row.date),
      utilityOut: utilityContributionByMethodsForDate(row.date, ["EFECTIVO"])
    })).filter((row) => row.cash > 0 || row.cashExpense > 0 || row.pettyCash > 0 || row.utilityOut > 0);
    const totalExpense = cashRows.reduce((sum, row) => sum + row.cashExpense, 0);
    const totalPettyCash = cashRows.reduce((sum, row) => sum + row.pettyCash, 0);
    const utilityOut = cashRows.reduce((sum, row) => sum + row.utilityOut, 0);
    summary.innerHTML = `<span>Saldo inicial: <strong>${money(balances.cashOpening)}</strong></span><span>Desde ${startLabel}: <strong>${money(total)}</strong></span><span>Egresos efectivo: <strong>${money(totalExpense)}</strong></span><span>Salida caja chica: <strong>${money(totalPettyCash)}</strong></span><span>A utilidad: <strong>${money(utilityOut)}</strong></span><span>Neto disponible: <strong>${money(total - totalExpense - totalPettyCash - utilityOut)}</strong></span><span>Saldo actual: <strong>${money(balances.cash)}</strong></span>`;
    head.innerHTML = `<tr><th>Fecha</th><th>Efectivo</th><th>Egreso efectivo</th><th>Caja chica</th><th>A utilidad</th><th>Neto disponible</th></tr>`;
    body.innerHTML = cashRows.map((row) => `<tr>
      <td>${formatDate(row.date)}</td>
      <td>${money(row.cash)}</td>
      <td>${money(row.cashExpense)}</td>
      <td>${money(row.pettyCash)}</td>
      <td>${money(row.utilityOut)}</td>
      <td><strong>${money(row.cash - row.cashExpense - row.pettyCash - row.utilityOut)}</strong></td>
    </tr>`).join("") || `<tr><td colspan="6">Sin movimientos en efectivo desde ${startLabel}.</td></tr>`;
  } else {
    const bankRows = rows.map((row) => ({
      ...row,
      bankExpense: cashBoxDetailExpenseByMethodsForDate(row.date, ["YAPE", "PLIN", "TRANSFERENCIA", "TARJETA"]),
      utilityOut: utilityContributionByMethodsForDate(row.date, ["YAPE", "PLIN", "TRANSFERENCIA", "TARJETA"])
    })).filter((row) => row.yape + row.plin + row.transfer + row.card > 0 || row.bankExpense > 0 || row.utilityOut > 0);
    const totalExpense = bankRows.reduce((sum, row) => sum + row.bankExpense, 0);
    const utilityOut = bankRows.reduce((sum, row) => sum + row.utilityOut, 0);
    summary.innerHTML = `<span>Saldo inicial: <strong>${money(balances.bankOpening)}</strong></span><span>Desde ${startLabel}: <strong>${money(total)}</strong></span><span>Egresos billeteras/bancos: <strong>${money(totalExpense)}</strong></span><span>A utilidad: <strong>${money(utilityOut)}</strong></span><span>Neto disponible: <strong>${money(total - totalExpense - utilityOut)}</strong></span><span>Saldo actual: <strong>${money(balances.bank)}</strong></span>`;
    head.innerHTML = `<tr><th>Fecha</th><th>Yape</th><th>Plin</th><th>Transferencia</th><th>Tarjeta</th><th>Egresos</th><th>A utilidad</th><th>Neto disponible</th></tr>`;
    body.innerHTML = bankRows.map((row) => {
      const dayTotal = row.yape + row.plin + row.transfer + row.card;
      return `<tr>
        <td>${formatDate(row.date)}</td>
        <td>${money(row.yape)}</td>
        <td>${money(row.plin)}</td>
        <td>${money(row.transfer)}</td>
        <td>${money(row.card)}</td>
        <td>${money(row.bankExpense)}</td>
        <td>${money(row.utilityOut)}</td>
        <td><strong>${money(dayTotal - row.bankExpense - row.utilityOut)}</strong></td>
      </tr>`;
    }).join("") || `<tr><td colspan="8">Sin movimientos por billeteras o bancos desde ${startLabel}.</td></tr>`;
  }
  $("#generalBalanceDetailDialog")?.showModal();
}

function generalSummaryDates() {
  const fromInput = $("#generalSummaryFrom");
  const toInput = $("#generalSummaryTo");
  const defaultFrom = todayISO();
  const defaultTo = todayISO();
  if (fromInput && !fromInput.value) fromInput.value = defaultFrom;
  if (toInput && !toInput.value) toInput.value = defaultTo;
  const from = fromInput?.value || defaultFrom;
  const to = toInput?.value || defaultTo;
  return allDatesWithCashActivity()
    .filter((date) => date >= from && date <= to)
    .sort()
    .reverse();
}

function monthStart(month = todayISO().slice(0, 7)) {
  return `${month}-01`;
}

function monthEnd(month = todayISO().slice(0, 7)) {
  const [year, value] = month.split("-").map(Number);
  const date = new Date(year, value, 0);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function cashReportRangeForMonth(month) {
  const from = monthStart(month);
  const to = month === todayISO().slice(0, 7) ? todayISO() : monthEnd(month);
  return {
    from,
    to,
    month,
    mode: "month",
    label: `${formatDate(from)} - ${formatDate(to)}`
  };
}

function cashReportRangeForDates(from, to) {
  let start = from || todayISO();
  let end = to || start;
  if (start > end) [start, end] = [end, start];
  return {
    from: start,
    to: end,
    month: start.slice(0, 7) === end.slice(0, 7) ? start.slice(0, 7) : "",
    mode: "range",
    label: `${formatDate(start)} - ${formatDate(end)}`
  };
}

/* El periodo se arma con dos fechas y solo se aplica cuando estan las dos. Entre
   una y otra hay un momento en que solo hay media respuesta escrita: si un
   refresco entra justo ahi y limpia los campos, la persona nunca llega a poner
   la segunda fecha y parece que el sistema no la deja elegir el periodo.
   Por eso solo se limpia cuando alguien lo pide de verdad -al elegir un mes-,
   no en cada repintado. */
function syncCashTitleRangeInputs({ limpiarSiNoHayRango = false } = {}) {
  const fromInput = $("#cashTitleFrom");
  const toInput = $("#cashTitleTo");
  if (!fromInput || !toInput) return;
  if (selectedCashReportRange?.mode === "range") {
    fromInput.value = selectedCashReportRange.from;
    toInput.value = selectedCashReportRange.to;
    return;
  }
  if (!limpiarSiNoHayRango) return;
  fromInput.value = "";
  toInput.value = "";
}

function openCashPeriodDialog() {
  const month = todayISO().slice(0, 7);
  const picker = $("#cashTitleMonthPicker");
  if (picker) picker.value = selectedCashReportRange?.month || month;
  picker?.focus();
  if (!picker?.showPicker) {
    openCashPeriodForMonth(month);
    return;
  }
  try {
    picker.showPicker();
  } catch (error) {
    openCashPeriodForMonth(month);
  }
}

function openCashPeriodForMonth(month) {
  selectedCashReportRange = cashReportRangeForMonth(month);
  /* Al elegir un mes si corresponde vaciar las fechas sueltas: son otra forma
     de pedir el periodo y quedarian contradiciendo al mes elegido. */
  syncCashTitleRangeInputs({ limpiarSiNoHayRango: true });
  const picker = $("#cashTitleMonthPicker");
  if (picker) picker.value = month;
  const summaryFrom = $("#generalSummaryFrom");
  const summaryTo = $("#generalSummaryTo");
  if (summaryFrom) summaryFrom.value = selectedCashReportRange.from;
  if (summaryTo) summaryTo.value = selectedCashReportRange.to;
  renderGeneralCash();
  refreshRangeThenRender(selectedCashReportRange.from, selectedCashReportRange.to, renderGeneralCash);
}

function openCashPeriodForDateRange(from, to) {
  selectedCashReportRange = cashReportRangeForDates(from, to);
  syncCashTitleRangeInputs();
  const picker = $("#cashTitleMonthPicker");
  if (picker) picker.value = selectedCashReportRange.month || "";
  const summaryFrom = $("#generalSummaryFrom");
  const summaryTo = $("#generalSummaryTo");
  if (summaryFrom) summaryFrom.value = selectedCashReportRange.from;
  if (summaryTo) summaryTo.value = selectedCashReportRange.to;
  renderGeneralCash();
  refreshRangeThenRender(selectedCashReportRange.from, selectedCashReportRange.to, renderGeneralCash);
}

function utilityMovements() {
  return state.expenses
    .filter((expense) => isUtilityContribution(expense) || isUtilityPurchase(expense))
    .slice()
    .sort((a, b) => `${b.date || ""}${b.id || ""}`.localeCompare(`${a.date || ""}${a.id || ""}`));
}

function renderUtilityMovements() {
  const table = $("#utilityMovementsTable");
  if (!table) return;
  table.innerHTML = utilityMovements().map((item) => {
    const isPurchase = isUtilityPurchase(item);
    const action = isAdmin() && isPurchase
      ? `<button class="small-btn" data-utility-to-contribution="${item.id}">Pasar a utilidad</button>`
      : "";
    const deleteAction = isAdmin()
      ? `<button class="small-btn danger-btn" data-delete-utility-movement="${item.id}">Eliminar</button>`
      : "";
    return `<tr>
      <td>${formatDate(item.date)}</td>
      <td><span class="status ${isPurchase ? "danger" : ""}">${isPurchase ? "COMPRA" : "APORTE"}</span></td>
      <td>${escapeHtml(item.method || "")}</td>
      <td><strong>${isPurchase ? "-" : ""}${money(item.amount)}</strong></td>
      <td>${escapeHtml(item.detail || "")}</td>
      <td class="row-actions">${action}${deleteAction}</td>
    </tr>`;
  }).join("") || `<tr><td colspan="6">Aun no hay movimientos de utilidad.</td></tr>`;
}

function renderCardFees() {
  const form = $("#cardFeeForm");
  const table = $("#cardFeeTable");
  if (!form || !table) return;
  const month = form.month.value || "";
  const cobrado = cardChargedForMonth(month);
  const registrado = cardFeeTotalForMonth(month);
  const neto = cobrado - registrado;
  $("#cardFeeCharged").textContent = money(cobrado);
  $("#cardFeeRegistered").textContent = money(registrado);
  $("#cardFeeNet").textContent = money(neto);

  const nota = $("#cardFeeNote");
  if (!month) nota.textContent = "Elige el mes que quieres cuadrar.";
  else if (cobrado <= 0) nota.textContent = `No hay cobros con tarjeta en ${monthLabel(month)}.`;
  else if (registrado > 0) nota.textContent = `Ya se registró ${money(registrado)} de comisión para ${monthLabel(month)}. Si vuelves a registrar, se suma a lo anterior.`;
  else nota.textContent = `Si el banco depositó ${money(neto)}, no hubo comisión que registrar.`;

  const meses = [...new Set(state.expenses.filter(isCardFee).map(cardFeeMonth))]
    .filter(Boolean)
    .sort()
    .reverse();
  table.innerHTML = meses.map((mes) => {
    const comision = cardFeeTotalForMonth(mes);
    const cobradoMes = cardChargedForMonth(mes);
    const depositado = cobradoMes - comision;
    const porcentaje = cobradoMes > 0 ? `${(comision / cobradoMes * 100).toFixed(2)} %` : "-";
    const borrar = isAdmin()
      ? `<button class="small-btn danger-btn" data-delete-card-fee="${escapeHtml(mes)}">Eliminar</button>`
      : "";
    return `<tr>
      <td>${escapeHtml(monthLabel(mes))}</td>
      <td>${money(cobradoMes)}</td>
      <td><strong>-${money(comision)}</strong></td>
      <td>${money(depositado)}</td>
      <td>${porcentaje}</td>
      <td class="row-actions">${borrar}</td>
    </tr>`;
  }).join("") || `<tr><td colspan="6">Aún no se cuadraron comisiones de tarjeta.</td></tr>`;
}

function renderGeneralCash() {
  const cashDate = todayISO();
  syncCashTitleRangeInputs();
  const balanceOptions = selectedCashReportRange
    ? { from: selectedCashReportRange.from, to: selectedCashReportRange.to }
    : {};
  const balances = generalCashBalances(balanceOptions);
  $("#generalCashBalance").textContent = money(balances.cash);
  $("#generalBankBalance").textContent = money(balances.bank);
  $("#generalWalletBalance").textContent = money(balances.wallet);
  $("#generalTransferBalance").textContent = money(balances.transfer);
  $("#generalCardBalance").textContent = money(balances.card);
  $("#utilityBalance").textContent = money(balances.utility);
  $("#generalTotalBalance").textContent = money(balances.total);
  $("#generalTodayIncome").textContent = money(todayIncome());
  const form = $("#generalCashForm");
  if (form && (!document.activeElement || !form.contains(document.activeElement))) {
    const openingMonth = openingMonthForForm();
    const opening = monthlyOpening(openingMonth);
    form.openingMonth.value = openingMonth;
    form.cash.value = opening.cash;
    form.bank.value = opening.bank;
    form.utility.value = state.config.generalUtilityOpening || "";
    form.pettyCash.value = pettyCashAmount(cashDate) || "";
  }
  if (form) {
    form.openingMonth.disabled = !isAdmin();
    form.cash.readOnly = !isAdmin();
    form.bank.readOnly = !isAdmin();
    form.utility.readOnly = !isAdmin();
    form.cash.title = isAdmin() ? "" : "Solo el administrador puede cambiar el saldo inicial.";
    form.bank.title = isAdmin() ? "" : "Solo el administrador puede cambiar el saldo inicial.";
    form.utility.title = isAdmin() ? "" : "Solo el administrador puede cambiar la utilidad inicial.";
  }
  $("#generalDailyTable").innerHTML = generalSummaryDates().map((date) => {
    const income = incomeForDate(date);
    const opExpenses = dailyExpenseTotal(date);
    const generalExpenses = dailyGeneralExpenseTotal(date);
    const utilityTransfer = utilityContributionTotalForDate(date);
    const details = printableRowsForDailyClose(date);
    const detailRows = details.map((row) => `<tr><td>${escapeHtml(row.tipo)}</td><td>${escapeHtml(row.detalle)}</td><td>${escapeHtml(row.metodo || "")}</td><td>${escapeHtml(row.origen || "")}</td><td>${moneyForPrint(row.monto)}</td></tr>`).join("");
    return `<tr>
      <td>${formatDate(date)}</td>
      <td>${money(income)}</td>
      <td>${money(opExpenses)}</td>
      <td>${money(generalExpenses)}</td>
      <td>${money(utilityTransfer)}</td>
      <td><strong>${money(income - opExpenses - generalExpenses - utilityTransfer)}</strong>
        <details class="day-detail"><summary>Ver detalle</summary>
          <table><thead><tr><th>Tipo</th><th>Detalle</th><th>Metodo</th><th>Origen</th><th>Monto</th></tr></thead><tbody>${detailRows}</tbody></table>
        </details>
      </td>
    </tr>`;
  }).join("") || `<tr><td colspan="6">No hay movimientos en el rango seleccionado.</td></tr>`;
  renderUtilityMovements();
  renderCardFees();
  renderStaffPayments();
  ajustarCifrasDeSaldo();
}

/* Los saldos crecen con el negocio y "S/ 30,301.86" ya no entraba en su tarjeta:
   el navegador lo partia en dos lineas y esa tarjeta perdia la forma de las
   demas. En vez de achicar todas las cifras por si acaso, cada una arranca en
   su tamano normal y solo baja la que no entra. */
function ajustarCifrasDeSaldo() {
  const MINIMO = 16;
  $$("#caja-general .kpi strong").forEach((cifra) => {
    /* Se parte del tamano que manda la hoja de estilos, no de uno fijo: en
       celular las cifras ya arrancan mas chicas. */
    cifra.style.fontSize = "";
    if (!cifra.clientWidth) return;
    let tamano = parseFloat(getComputedStyle(cifra).fontSize) || 28;
    /* La comparacion va contra el ancho de la propia cifra, que al ser un
       bloque ya vale el espacio util de la tarjeta. Medir contra el padre
       daba 32px de mas -su relleno- y las cifras largas se colaban. */
    while (cifra.scrollWidth > cifra.clientWidth && tamano > MINIMO) {
      tamano -= 1;
      cifra.style.fontSize = `${tamano}px`;
    }
  });
}

function staffPayments() {
  return state.expenses
    .filter((expense) => expense.category === "PERSONAL_TERCERO")
    .slice()
    .sort((a, b) => `${b.date || ""}${b.id || ""}`.localeCompare(`${a.date || ""}${a.id || ""}`));
}

/* La lista completa se vuelve larga con los meses, y casi siempre se revisa un
   mes a la vez. El filtro solo ofrece los meses que tienen pagos. */
function staffPaymentMonths() {
  return [...new Set(staffPayments().map((payment) => String(payment.date || "").slice(0, 7)))]
    .filter(Boolean)
    .sort()
    .reverse();
}

function selectedStaffPaymentMonth() {
  return $("#staffPaymentMonth")?.value || "";
}

function staffPaymentsForSelectedMonth() {
  const month = selectedStaffPaymentMonth();
  const pagos = staffPayments();
  return month ? pagos.filter((payment) => String(payment.date || "").slice(0, 7) === month) : pagos;
}

function renderStaffPaymentMonths() {
  const select = $("#staffPaymentMonth");
  if (!select) return;
  const meses = staffPaymentMonths();
  const elegido = select.value;
  select.innerHTML = `<option value="">Todos los meses</option>` +
    meses.map((mes) => `<option value="${escapeHtml(mes)}">${escapeHtml(monthLabel(mes))}</option>`).join("");
  /* Al entrar se muestra el mes mas reciente; despues manda lo que haya elegido,
     aunque sea "todos". */
  if (meses.includes(elegido)) select.value = elegido;
  else if (select.dataset.tocado) select.value = "";
  else if (meses.length) select.value = meses[0];
}

function renderStaffPayments() {
  const table = $("#staffPaymentsTable");
  if (!table) return;
  renderStaffPaymentMonths();
  const visibles = staffPaymentsForSelectedMonth();
  const total = visibles.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const resumen = $("#staffPaymentTotal");
  if (resumen) {
    const mes = selectedStaffPaymentMonth();
    resumen.textContent = visibles.length
      ? `${visibles.length} pago${visibles.length === 1 ? "" : "s"} en ${mes ? monthLabel(mes) : "todos los meses"}: ${money(total)}`
      : "";
  }
  table.innerHTML = visibles.map((payment) => `<tr>
    <td>${formatDate(payment.date)}</td>
    <td>${escapeHtml(payment.person || "")}</td>
    <td>${escapeHtml(payment.type || "OTRO")}</td>
    <td>${escapeHtml(payment.method || "")}</td>
    <td><strong>${money(payment.amount)}</strong></td>
    <td>${escapeHtml(payment.detail || "")}</td>
    <td class="row-actions">${isAdmin() ? `<button class="small-btn danger-btn" data-delete-staff-payment="${payment.id}">Eliminar</button>` : ""}</td>
  </tr>`).join("") || `<tr><td colspan="7">${staffPayments().length ? "No hay pagos en el mes elegido." : "Aún no hay pagos de personal o terceros."}</td></tr>`;
}

function openAppointment(appointment = {}) {
  const form = $("#appointmentForm");
  const isNew = !appointment.id;
  fillPatientSelect(form.patientId, appointment.patientId || "", isNew);
  form.id.value = appointment.id || "";
  form.date.value = appointment.date || $("#agendaDate").value || todayISO();
  form.time.value = appointment.time || "09:00";
  form.unit.value = appointment.unit || state.config.units[0];
  form.patientId.value = appointment.patientId || "";
  form.doctor.value = appointment.doctor || patientById(form.patientId.value)?.doctor || "";
  form.service.value = appointment.service || state.services[0]?.name || "";
  form.status.value = appointment.status || "RESERVADA";
  form.notes.value = appointment.notes || "";
  $("#openRescheduleBtn").style.display = appointment.id ? "inline-flex" : "none";
  $("#appointmentDialog").showModal();
}

function openReschedule(appointment) {
  if (!appointment?.id) return;
  const form = $("#rescheduleForm");
  form.appointmentId.value = appointment.id;
  form.comment.value = appointment.notes || "";
  form.date.value = appointment.date;
  form.time.value = appointment.time;
  form.unit.value = appointment.unit || state.config.units[0];
  form.doctor.value = appointment.doctor || patientById(appointment.patientId)?.doctor || "";
  $("#appointmentDialog").close();
  $("#rescheduleDialog").showModal();
}

function formData(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function resetPatientFormMode() {
  patientEditingId = "";
  const form = $("#patientForm");
  if (!form) return;
  const idInput = form.elements.namedItem("id");
  if (idInput) idInput.value = "";
  const submitButton = form.querySelector('button[type="submit"]');
  if (submitButton) submitButton.textContent = "Guardar paciente";
}

async function deletePatientRecord(id) {
  try {
    await deletePatientApi(id);
  } catch (error) {
    alert(error.message);
    return false;
  }
  state.patients = state.patients.filter((item) => item.id !== id);
  state.appointments = state.appointments.filter((item) => item.patientId !== id);
  state.treatments = state.treatments.filter((item) => item.patientId !== id);
  state.payments = state.payments.filter((item) => item.patientId !== id);
  state.clinicalHistory = state.clinicalHistory.filter((item) => item.patientId !== id);
  state.odontogram = state.odontogram.filter((item) => item.patientId !== id);
  if (!API_ENABLED) saveState();
  render();
  return true;
}

function upsert(collection, item) {
  const index = collection.findIndex((current) => current.id === item.id);
  if (index >= 0) collection[index] = item;
  else collection.push(item);
}

function exportCsv(filename, rows) {
  if (!rows.length) return;
  const headers = [...new Set(rows.flatMap((row) => Object.keys(row)))];
  const csv = [
    headers.join(";"),
    ...rows.map((row) => headers.map((header) => csvCell(row[header])).join(";"))
  ].join("\r\n");
  download(filename, `\uFEFF${csv}`, "text/csv;charset=utf-8");
}

function csvCell(value) {
  const text = value == null ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

function csvRowsForDailyClose(date = todayISO()) {
  const session = state.cashSessions.find((item) => item.date === date) || {};
  const opening = Number(session.openingCash || 0);
  const incomeCash = incomeByMethodsForCashView(date, ["EFECTIVO"]);
  const incomeWallet = incomeByMethodsForCashView(date, ["YAPE", "PLIN"]);
  const incomeBank = incomeByMethodsForCashView(date, ["TARJETA", "TRANSFERENCIA"]);
  const incomeTotal = incomeForCashView(date);
  const operatingExpenses = cashAffectingExpenseTotalForView(date);
  const expected = opening + incomeTotal - operatingExpenses;
  const closingCash = Number(session.closingCash || 0);
  const difference = session.closedAt ? Number(session.difference || closingCash - expected) : Number(session.difference || 0);
  const rows = [
    { seccion: "RESUMEN", fecha: date, concepto: "Caja chica inicial", metodo: "", origen: "", ingreso: "", egreso: "", saldo: opening, comprobante: "" },
    { seccion: "RESUMEN", fecha: date, concepto: "Ingreso bruto efectivo", metodo: "EFECTIVO", origen: "INGRESOS DEL DIA", ingreso: incomeCash, egreso: "", saldo: "", comprobante: "" },
    { seccion: "RESUMEN", fecha: date, concepto: "Ingreso bruto Yape + Plin", metodo: "YAPE/PLIN", origen: "INGRESOS DEL DIA", ingreso: incomeWallet, egreso: "", saldo: "", comprobante: "" },
    { seccion: "RESUMEN", fecha: date, concepto: "Ingreso bruto tarjeta + transferencia", metodo: "TARJETA/TRANSFERENCIA", origen: "INGRESOS DEL DIA", ingreso: incomeBank, egreso: "", saldo: "", comprobante: "" },
    { seccion: "RESUMEN", fecha: date, concepto: "Total ingresos brutos", metodo: "", origen: "", ingreso: incomeTotal, egreso: "", saldo: "", comprobante: "" },
    { seccion: "RESUMEN", fecha: date, concepto: "Total egresos operativos", metodo: "", origen: "INGRESO_DEL_DIA / CAJA_CHICA", ingreso: "", egreso: operatingExpenses, saldo: "", comprobante: "" },
    { seccion: "RESUMEN", fecha: date, concepto: "Esperado al cierre", metodo: "", origen: "CAJA CHICA + INGRESOS - EGRESOS", ingreso: "", egreso: "", saldo: expected, comprobante: "" },
    { seccion: "RESUMEN", fecha: date, concepto: "Contado al cierre", metodo: "", origen: "", ingreso: "", egreso: "", saldo: closingCash, comprobante: "" },
    { seccion: "RESUMEN", fecha: date, concepto: "Diferencia", metodo: "", origen: "", ingreso: "", egreso: "", saldo: difference, comprobante: "" }
  ];
  paymentsForCashView(date).forEach((payment) => {
    rows.push({
      seccion: "PAGO",
      fecha: payment.date || date,
      concepto: patientById(payment.patientId)?.name || "",
      metodo: paymentMethodLabel(payment),
      origen: "INGRESO",
      ingreso: Number(payment.amount || 0),
      egreso: "",
      saldo: "",
      comprobante: payment.receipt || ""
    });
  });
  expensesForCashView(date).forEach((expense) => {
    rows.push({
      seccion: "EGRESO",
      fecha: expense.date || date,
      concepto: expense.detail,
      metodo: expense.method,
      origen: expense.source,
      ingreso: "",
      egreso: Number(expense.amount || 0),
      saldo: "",
      comprobante: expense.receipt || ""
    });
  });
  return rows;
}

function printableRowsForDailyClose(date = todayISO()) {
  const session = state.cashSessions.find((item) => item.date === date) || {};
  const opening = Number(session.openingCash || 0);
  const incomeCash = incomeByMethodsForCashView(date, ["EFECTIVO"]);
  const incomeWallet = incomeByMethodsForCashView(date, ["YAPE", "PLIN"]);
  const incomeBank = incomeByMethodsForCashView(date, ["TARJETA", "TRANSFERENCIA"]);
  const operatingExpenses = cashAffectingExpenseTotalForView(date);
  const expected = opening + incomeForCashView(date) - operatingExpenses;
  const closingCash = Number(session.closingCash || 0);
  const difference = session.closedAt ? Number(session.difference || closingCash - expected) : Number(session.difference || 0);
  const rows = [
    { tipo: "RESUMEN", detalle: "Caja chica inicial", metodo: "", origen: "", monto: opening, comprobante: "" },
    { tipo: "RESUMEN", detalle: "Ingresos efectivo", metodo: "EFECTIVO", origen: "", monto: incomeCash, comprobante: "" },
    { tipo: "RESUMEN", detalle: "Ingresos Yape + Plin", metodo: "YAPE/PLIN", origen: "", monto: incomeWallet, comprobante: "" },
    { tipo: "RESUMEN", detalle: "Ingresos tarjeta + transferencia", metodo: "TARJETA/TRANSFERENCIA", origen: "", monto: incomeBank, comprobante: "" },
    { tipo: "RESUMEN", detalle: "Egresos operativos", metodo: "", origen: "INGRESO_DIA/CAJA_CHICA", monto: -operatingExpenses, comprobante: "" },
    { tipo: "RESUMEN", detalle: "Esperado", metodo: "", origen: "", monto: expected, comprobante: "" },
    { tipo: "RESUMEN", detalle: "Contado cierre", metodo: "", origen: "", monto: closingCash, comprobante: "" },
    { tipo: "RESUMEN", detalle: "Diferencia", metodo: "", origen: "", monto: difference, comprobante: "" }
  ];
  paymentsForCashView(date).forEach((payment) => {
    rows.push({
      tipo: "PAGO",
      detalle: patientById(payment.patientId)?.name || "",
      metodo: paymentMethodLabel(payment),
      origen: "INGRESO",
      monto: Number(payment.amount || 0),
      comprobante: payment.receipt || ""
    });
  });
  expensesForCashView(date).forEach((expense) => {
    rows.push({
      tipo: "EGRESO",
      detalle: expense.detail,
      metodo: expense.method,
      origen: expense.source,
      monto: -Number(expense.amount || 0),
      comprobante: expense.receipt || ""
    });
  });
  return rows;
}

function moneyForPrint(value) {
  const amount = Number(value || 0);
  if (amount < 0) return `S/ (${Math.abs(amount).toLocaleString("es-PE", { minimumFractionDigits: 0, maximumFractionDigits: 2 })})`;
  return money(amount);
}

function printDailyClose(date = todayISO()) {
  const rows = printableRowsForDailyClose(date);
  const htmlRows = rows.map((row) => `<tr class="${row.tipo.toLowerCase()}"><td>${escapeHtml(row.tipo)}</td><td>${escapeHtml(row.detalle)}</td><td>${escapeHtml(row.metodo || "")}</td><td>${escapeHtml(row.origen || "")}</td><td class="amount">${moneyForPrint(row.monto)}</td><td>${escapeHtml(row.comprobante || "")}</td></tr>`).join("");
  const w = window.open("", "_blank");
  w.document.write(`<!doctype html><html><head><title>Cierre de caja ${date}</title><style>
    body{font-family:Arial,sans-serif;padding:24px;color:#111}
    h1{margin:0 0 4px;font-size:22px}
    p{margin:0 0 18px}
    table{width:100%;border-collapse:collapse;font-size:14px}
    td,th{border:1px solid #cfcfcf;padding:8px 10px;text-align:left}
    th{background:#eaf7fa;font-weight:700}
    tr.resumen td{font-weight:600}
    tr.egreso td{color:#9b1c1c}
    .amount{white-space:nowrap;font-weight:700}
    @media print{body{padding:12px} button{display:none}}
  </style></head><body><h1>Cierre de caja ${formatDate(date)}</h1><p>${escapeHtml(state.config.clinicName)}</p><table><thead><tr><th>Tipo</th><th>Detalle</th><th>Metodo</th><th>Origen</th><th>Monto</th><th>Comprobante</th></tr></thead><tbody>${htmlRows}</tbody></table><script>window.print();</script></body></html>`);
  w.document.close();
}

function download(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function bindEvents() {
  const on = (selector, eventName, handler) => {
    const element = $(selector);
    if (element) element.addEventListener(eventName, handler);
  };

  /* El menu vuelve solo por el borde izquierdo: acercando el puntero o
     deslizando el dedo desde ahi. No hay boton, y no se cierra por retirar el
     puntero ni por tiempo: se queda hasta que se vuelva a entrar a Registrar
     paciente. Son clases, no un redibujado: lo escrito en la ficha no se toca. */
  on("#edgeZone", "pointerenter", () => {
    document.body.classList.add("menu-a-la-vista");
  });
  /* Al salir el puntero del menu se vuelve a esconder: en Registrar paciente
     estorba encima de la ficha. Si se eligio otro modulo ya no hay nada que
     esconder, porque el menu volvio a su sitio. */
  on(".sidebar", "pointerleave", () => {
    document.body.classList.remove("menu-a-la-vista");
  });
  // en una tablet no hay puntero que se retire: se cierra tocando fuera
  document.addEventListener("pointerdown", (event) => {
    if (!document.body.classList.contains("menu-a-la-vista")) return;
    if (event.target.closest(".sidebar") || event.target.closest("#edgeZone")) return;
    document.body.classList.remove("menu-a-la-vista");
  });
  let dedo = null;
  document.addEventListener("touchstart", (event) => {
    if (!document.body.classList.contains("sin-menu")) return;
    if (document.body.classList.contains("menu-a-la-vista")) return;
    const toque = event.touches[0];
    dedo = toque && toque.clientX <= 28 ? { x: toque.clientX, y: toque.clientY } : null;
  }, { passive: true });
  document.addEventListener("touchmove", (event) => {
    if (!dedo) return;
    const toque = event.touches[0];
    if (!toque) return;
    const aLoAncho = toque.clientX - dedo.x;
    // si el dedo va mas hacia abajo que de lado, es desplazar la ficha
    if (Math.abs(toque.clientY - dedo.y) > Math.abs(aLoAncho)) { dedo = null; return; }
    if (aLoAncho > 40) {
      document.body.classList.add("menu-a-la-vista");
      dedo = null;
    }
  }, { passive: true });
  document.addEventListener("touchend", () => { dedo = null; }, { passive: true });

  document.addEventListener("click", async (event) => {
    const generalDetail = event.target.closest("[data-open-general-detail]");
    if (generalDetail) {
      const detailType = generalDetail.dataset.openGeneralDetail;
      const useSelectedRange = selectedCashReportRange && ["cash", "bank"].includes(detailType);
      openGeneralBalanceDetail(detailType, useSelectedRange ? {
        from: selectedCashReportRange.from,
        to: selectedCashReportRange.to,
        label: selectedCashReportRange.label
      } : {});
      return;
    }
    const printReceipt = event.target.closest("[data-print-receipt]");
    if (printReceipt) {
      printElectronicReceipt(printReceipt.dataset.printReceipt);
      return;
    }
    const sendSunat = event.target.closest("[data-send-sunat]");
    if (sendSunat) {
      reintentarComprobanteSunat(sendSunat.dataset.sendSunat);
      return;
    }
    const openReceptionRegistry = event.target.closest("#openReceptionPatientsBtn");
    if (openReceptionRegistry) {
      openReceptionPatientsModal();
      return;
    }
    const hideReceptionPatient = event.target.closest("[data-hide-reception-patient]");
    if (hideReceptionPatient) {
      if (!isAdmin()) {
        alert("Solo el administrador puede ocultar pacientes de este registro.");
        return;
      }
      const patient = patientById(hideReceptionPatient.dataset.hideReceptionPatient);
      if (!patient || !confirm(`Quitar a ${patient.name} solo de la lista de pacientes nuevos de recepción? No se eliminará su ficha, citas, historial, odontograma ni pagos.`)) return;
      try {
        await hideReceptionNewPatientApi(patient.id);
        patient.hideFromReceptionNew = true;
        addLocalAuditEvent("PATIENT_RECEPTION_NEW_HIDDEN", `Ocultó de nuevos recepción: ${patient.name} (${patient.dni})`, patient.id);
        if (!API_ENABLED) saveState();
      } catch (error) {
        alert(error.message);
        return;
      }
      renderReports();
      if ($("#receptionPatientsDialog")?.open) renderReceptionPatientsModal();
      return;
    }
    const reminderButton = event.target.closest("[data-send-reminder]");
    if (reminderButton) {
      const appointment = state.appointments.find((item) => item.id === reminderButton.dataset.sendReminder);
      if (!appointment) return;
      const updated = {
        ...appointment,
        reminderSentAt: new Date().toISOString(),
        reminderSentBy: currentUser()?.name || ""
      };
      reminderButton.disabled = true;
      reminderButton.textContent = "Abriendo WhatsApp...";
      try {
        await saveAppointmentApi(updated);
      } catch (error) {
        alert(error.message);
        reminderButton.disabled = false;
        reminderButton.textContent = "Enviar recordatorio";
        return;
      }
      upsert(state.appointments, updated);
      if (!API_ENABLED) saveState();
      window.open(reminderButton.dataset.wa, "_blank", "noopener");
      renderReminders();
      return;
    }
    const closeButton = event.target.closest("[data-close-dialog]");
    if (!closeButton) return;
    const dialog = document.getElementById(closeButton.dataset.closeDialog);
    if (dialog?.open) dialog.close("cancel");
  });

  $("#loginForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const submitButton = form.querySelector('button[type="submit"]');
    const data = formData(event.currentTarget);
    if (API_ENABLED) {
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Ingresando...";
      }
      $("#loginMessage").textContent = "Conectando con el sistema...";
      apiFetch("/api/login", { method: "POST", body: JSON.stringify({ username: data.username, password: data.password, rememberDevice: data.rememberDevice === "on" }) })
        .then((payload) => {
          rememberApiSession(payload.token, payload.expiresAt, payload.user);
          $("#loginMessage").textContent = "Cargando datos...";
          form.reset();
          return loadFromApi();
        })
        .then(() => {
          $("#loginMessage").textContent = "";
        })
        .catch((error) => {
          $("#loginMessage").textContent = error.message;
        })
        .finally(() => {
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = "Ingresar";
          }
        });
      return;
    }
    const user = state.users.find((item) =>
      item.active && item.username.toLowerCase() === data.username.trim().toLowerCase() && item.password === data.password
    );
    if (!user) {
      $("#loginMessage").textContent = "Usuario o contrasena incorrectos.";
      return;
    }
    currentUserId = user.id;
    localStorage.setItem(`${STORAGE_KEY}-current-user`, currentUserId);
    $("#loginMessage").textContent = "";
    event.currentTarget.reset();
    render();
  });
  $("#logoutBtn").addEventListener("click", () => {
    if (API_ENABLED && apiToken) {
      apiFetch("/api/logout", { method: "POST", body: "{}" }).catch(() => {});
    }
    clearApiSession();
    currentUserId = "";
    localStorage.removeItem(`${STORAGE_KEY}-current-user`);
    render();
  });
  $$(".nav-item").forEach((button) => button.addEventListener("click", () => setView(button.dataset.view)));
  $$("[data-go]").forEach((button) => button.addEventListener("click", () => setView(button.dataset.go)));
  on("#globalSearch", "input", () => {
    if (currentView === "cuentas-cobrar") renderReceivables();
    else renderPatients();
  });
  /* Buscar el nombre por DNI sin que nadie pulse nada. La consulta ya existia
     -y el servidor tambien- pero nada la llamaba: quedo escrita esperando un
     boton que nunca se puso en la pantalla.

     Se dispara al completar los ocho digitos y tambien al salir del campo,
     porque en el celular el numero se pega de un tiron y el evento de tecla no
     siempre llega. No se repite la consulta del mismo DNI, y nunca pisa un
     nombre ya escrito: en recepcion se corrigen tildes y el orden de los
     apellidos, y perder esa correccion molesta mas de lo que ayuda. */
  let ultimoDniConsultado = "";
  async function autocompletarPacientePorDni() {
    const form = $("#patientForm");
    const dniField = form?.elements.namedItem("dni");
    const nameField = form?.elements.namedItem("name");
    if (!dniField || !nameField) return;
    const numero = onlyDigits(dniField.value);
    if (numero.length !== 8 || numero === ultimoDniConsultado) return;
    if (String(nameField.value || "").trim()) return;
    ultimoDniConsultado = numero;
    await lookupPatientDni();
  }
  /* El representante legal solo se pide si el paciente es menor: a un adulto
     no se le pregunta quien firma por el. */
  const ajustarRepresentante = () => {
    const bloque = $("#patientGuardian");
    if (!bloque) return;
    const fecha = $('#patientForm input[name="birthDate"]')?.value || "";
    const edad = ageFromBirthDate(fecha);
    bloque.hidden = !(edad !== null && edad < 18);
  };
  on('#patientForm input[name="birthDate"]', "change", ajustarRepresentante);
  on('#patientForm input[name="birthDate"]', "input", ajustarRepresentante);
  on("#patientForm", "reset", () => setTimeout(ajustarRepresentante, 0));

  /* El detalle de la enfermedad nace cerrado: el que viene a una limpieza no
     tiene relato cronologico que contar. Se abre al escribir la enfermedad
     actual y se queda abierto si ya habia algo dentro. */
  const ajustarDetalleDeEnfermedad = () => {
    const detalle = $("#patientIllnessDetail");
    if (!detalle) return;
    const form = $("#patientForm");
    const hayMal = String(form?.elements?.currentIllness?.value || "").trim();
    const hayDetalle = ["illnessTime", "symptoms", "anamnesis", "biologicalFunctions"]
      .some((campo) => String(form?.elements?.[campo]?.value || "").trim());
    detalle.hidden = !(hayMal || hayDetalle);
  };
  on('#patientForm [name="currentIllness"]', "input", ajustarDetalleDeEnfermedad);
  on("#patientForm", "reset", () => setTimeout(ajustarDetalleDeEnfermedad, 0));

  /* Si el paciente es menor, a quien se llama en una emergencia es a quien lo
     trae: se copia el representante con su celular. Se deja de copiar en cuanto
     alguien escribe otra cosa ahi, porque puede ser otra persona. */
  const copiarEmergenciaDelRepresentante = () => {
    const form = $("#patientForm");
    const destino = form?.elements?.emergencyContact;
    const bloque = $("#patientGuardian");
    if (!destino || !bloque || bloque.hidden) return;
    const nombre = String(form.elements.guardianName?.value || "").trim();
    const celular = String(form.elements.guardianPhone?.value || "").trim();
    const copia = [nombre, celular].filter(Boolean).join(" - ");
    const escrito = String(destino.value || "").trim();
    if (escrito && escrito !== destino.dataset.copiado) return;
    destino.value = copia;
    destino.dataset.copiado = copia;
  };
  ["guardianName", "guardianPhone"].forEach((campo) => {
    on(`#patientForm [name="${campo}"]`, "input", copiarEmergenciaDelRepresentante);
  });

  on('#patientForm input[name="dni"]', "input", autocompletarPacientePorDni);
  on('#patientForm input[name="dni"]', "blur", autocompletarPacientePorDni);
  on('#patientForm input[name="guardianDni"]', "input", buscarNombreDelRepresentante);
  on('#patientForm input[name="guardianDni"]', "blur", buscarNombreDelRepresentante);
  on("#patientForm", "reset", () => {
    ultimoDniConsultado = "";
    ultimoDniDelRepresentante = "";
    const hint = $("#patientDniLookupHint");
    if (hint) hint.textContent = "";
    const hintRepresentante = $("#guardianDniHint");
    if (hintRepresentante) hintRepresentante.textContent = "";
  });

  on("#agendaDate", "change", () => {
    renderAgenda();
    refreshActiveViewApi({ porAccionDelUsuario: true });
  });
  on("#reportMonth", "change", () => {
    renderReports();
    refreshReportsRange();
  });
  on("#compareMonth", "change", () => {
    renderReports();
    refreshReportsRange();
  });
  on("#historyPatientFilter", "change", () => {
    // el consentimiento abierto era de ese paciente, no del siguiente
    consentimientoElegido = "";
    renderClinicalHistory();
    renderOdontogramSnapshots();
  });

  on("#saveOdontogramCopyBtn", "click", async (event) => {
    const boton = event.currentTarget;
    const campo = $("#odontogramCopyNote");
    boton.disabled = true;
    boton.textContent = "Guardando...";
    const guardado = await guardarCopiaDelOdontograma(campo?.value || "");
    boton.disabled = false;
    boton.textContent = "Guardar en la historia";
    if (!guardado) return;
    if (campo) campo.value = "";
    render();
    alert("Copia guardada. Puedes verla en Historial clínico.");
  });

  on("#odontogramViewingCopy", "click", (event) => {
    if (!event.target.closest("#backToLiveOdontogram")) return;
    volverAlOdontogramaActual();
    render();
  });

  on("#odontogramSnapshots", "click", async (event) => {
    const ver = event.target.closest("[data-ver-copia-odontograma]");
    if (ver) {
      verCopiaDelOdontograma(ver.dataset.verCopiaOdontograma);
      setView("odontograma");
      render();
      return;
    }
    const restaurar = event.target.closest("[data-restaurar-copia-odontograma]");
    if (!restaurar) return;
    if (!confirm("El odontograma actual de este paciente se reemplazará por esta copia. La copia no se borra y puedes volver a la que quieras. ¿Continuar?")) return;
    if (!(await restaurarCopiaDelOdontograma(restaurar.dataset.restaurarCopiaOdontograma))) return;
    setView("odontograma");
    render();
  });
  on("#doctorFilter", "change", renderAgenda);
  on("#unitFilter", "change", renderAgenda);
  on("#newAppointmentBtn", "click", () => openAppointment());
  on("#quickAppointmentBtn", "click", () => {
    if (currentView === "cuentas-cobrar") {
      renderReceivablePatientSuggestions();
      $("#manualReceivableForm input[name='patientSearch']")?.focus();
      return;
    }
    openAppointment();
  });
  on("#openRescheduleBtn", "click", () => {
    const appointment = state.appointments.find((item) => item.id === $("#appointmentForm").id.value);
    openReschedule(appointment);
  });
  on("#quickPatientBtn", "click", () => {
    setView("pacientes");
    const form = $("#patientForm");
    if (form) {
      form.reset();
      resetPatientFormMode();
    }
    setTimeout(() => $('#patientForm input[name="dni"]')?.focus(), 0);
  });
  on("#openExpenseBtn", "click", () => {
    if (!canManageExpenses()) {
      alert("Tu usuario no tiene permiso para registrar egresos.");
      return;
    }
    if (!cashSessionToday()) {
      alert("Primero abre la caja del dia para registrar egresos.");
      return;
    }
    const form = $("#expenseForm");
    form.date.value = operatingDate();
    form.detail.value = "";
    form.amount.value = "";
    form.receipt.value = "";
    $("#expenseDialog").showModal();
  });
  on('#appointmentForm select[name="patientId"]', "change", syncAppointmentDoctor);
  on('#historyForm input[name="date"]', "change", () => {
    fillAppointmentPatientSelectForDate($('#historyForm select[name="patientId"]'), $('#historyForm input[name="date"]').value, $('#historyForm select[name="patientId"]').value);
    avisoDeDeudaDelDia();
  });
  on('#historyForm select[name="patientId"]', "change", () => {
    syncAssignedDoctor();
    avisoDeDeudaDelDia();
  });
  on('#historyForm input[name="creditPending"]', "change", (event) => {
    if (event.target.checked) openCreditDialog();
    else {
      const form = $("#historyForm");
      form.creditAmount.value = "";
      form.creditDueDate.value = "";
      form.creditNote.value = "";
      updateCreditSummary();
    }
  });
  on("#cancelCreditBtn", "click", () => {
    const form = $("#historyForm");
    form.creditPending.checked = false;
    form.creditAmount.value = "";
    form.creditDueDate.value = "";
    form.creditNote.value = "";
    updateCreditSummary();
    $("#creditDialog").close();
  });
  on("#saveCreditBtn", "click", () => {
    const historyForm = $("#historyForm");
    const creditForm = $("#creditForm");
    if (!creditForm.reportValidity()) return;
    historyForm.creditAmount.value = creditForm.creditAmount.value;
    historyForm.creditDueDate.value = creditForm.creditDueDate.value;
    historyForm.creditNote.value = creditForm.creditNote.value;
    historyForm.creditPending.checked = true;
    updateCreditSummary();
    $("#creditDialog").close();
  });

  $("#agendaBoard").addEventListener("click", async (event) => {
    if (!canManageAppointments()) return;
    /* Se atiende antes que el de editar: el boton vive dentro de la franja, y
       la franja entera abre la cita. Sin esto, marcar confirmado abriria
       tambien el formulario encima. */
    const confirmar = event.target.closest("[data-confirm-appointment]");
    if (confirmar) {
      event.stopPropagation();
      const cita = state.appointments.find((item) => item.id === confirmar.dataset.confirmAppointment);
      if (!cita) return;
      const antes = Boolean(cita.confirmada);
      const marcada = !antes;
      /* Se pinta al instante y recien despues se guarda. Antes se esperaba la
         respuesta del servidor -el viaje a Render y de ahi a la base- y el
         boton se quedaba gris varios segundos: parecia que el clic no habia
         entrado y se volvia a pulsar, que es justo lo que lo deshace. */
      const pintar = (valor) => {
        confirmar.classList.toggle("confirmada", valor);
        confirmar.setAttribute("aria-pressed", String(valor));
        confirmar.title = valor ? "El paciente confirmó. Clic para deshacer." : "Marcar que el paciente confirmó";
      };
      cita.confirmada = marcada;
      pintar(marcada);
      confirmar.disabled = true;
      try {
        await saveAppointmentApi(cita);
      } catch (error) {
        // si el servidor no lo acepta se deshace: la agenda no puede decir que
        // el paciente confirmo cuando eso no quedo guardado en ningun lado
        cita.confirmada = antes;
        pintar(antes);
        confirmar.disabled = false;
        alert(error.message || "No se pudo guardar la confirmacion.");
        return;
      }
      confirmar.disabled = false;
      /* Mientras se guardaba pudo entrar un refresco por rango y reemplazar la
         cita por la copia del servidor, que todavia no tenia la confirmacion. */
      const vigente = state.appointments.find((item) => item.id === cita.id);
      if (vigente) vigente.confirmada = marcada;
      if (!API_ENABLED) saveState();
      renderAgenda();
      return;
    }
    const edit = event.target.closest("[data-edit-appointment]");
    const empty = event.target.closest("[data-new-at]");
    if (edit) openAppointment(state.appointments.find((appointment) => appointment.id === edit.dataset.editAppointment));
    if (empty) openAppointment({ date: $("#agendaDate").value, time: empty.dataset.newAt, unit: empty.dataset.unit });
  });

  const followUpsTable = $("#appointmentFollowUpsTable");
  if (followUpsTable) {
    followUpsTable.addEventListener("click", async (event) => {
      const reschedule = event.target.closest("[data-followup-reschedule]");
      if (reschedule && canManageAppointments()) {
        const appointment = state.appointments.find((item) => item.id === reschedule.dataset.followupReschedule);
        if (appointment) openReschedule(appointment);
        return;
      }
      const close = event.target.closest("[data-followup-close]");
      if (close && canManageAppointments()) {
        const appointment = state.appointments.find((item) => item.id === close.dataset.followupClose);
        if (!appointment) return;
        const patient = patientById(appointment.patientId);
        if (!confirm("Cerrar este seguimiento? El paciente quedara como INACTIVO para recuperarlo luego en campanas.")) return;
        const updated = {
          ...appointment,
          followUpStatus: "CERRADO",
          followUpComment: appointment.followUpComment || appointment.notes || "No continuara"
        };
        const inactivePatient = patient ? { ...patient, status: "INACTIVO" } : null;
        try {
          await saveAppointmentApi(updated);
          if (inactivePatient) await savePatientApi(inactivePatient);
        } catch (error) {
          alert(error.message);
          return;
        }
        upsert(state.appointments, updated);
        if (inactivePatient) upsert(state.patients, inactivePatient);
        if (!API_ENABLED) saveState();
        render();
      }
    });
  }

  $("#saveAppointmentBtn").addEventListener("click", async () => {
    if (!canManageAppointments()) {
      alert("Tu usuario solo puede visualizar la agenda.");
      return;
    }
    const data = formData($("#appointmentForm"));
    if (!data.patientId) {
      alert("Selecciona el paciente antes de guardar la cita.");
      return;
    }
    const service = serviceByName(data.service);
    const existingAppointment = state.appointments.find((item) => item.id === (data.id || ""));
    const appointment = {
      id: data.id || appointmentId(),
      date: data.date,
      time: data.time,
      unit: data.unit,
      doctor: data.doctor,
      patientId: data.patientId,
      service: data.service,
      duration: service?.duration || state.config.interval,
      status: data.status,
      notes: data.notes,
      reminderSentAt: existingAppointment?.reminderSentAt || "",
      reminderSentBy: existingAppointment?.reminderSentBy || ""
    };
    if (["CANCELADA", "NO_ASISTIO"].includes(appointment.status)) {
      appointment.followUpStatus = "PENDIENTE_REPROGRAMAR";
      appointment.followUpComment = appointment.notes || existingAppointment?.followUpComment || "";
      appointment.newAppointmentId = "";
    } else if (appointment.status === "REPROGRAMADA") {
      appointment.followUpStatus = existingAppointment?.newAppointmentId ? "REPROGRAMADO" : "PENDIENTE_REPROGRAMAR";
      appointment.followUpComment = appointment.notes || existingAppointment?.followUpComment || "";
      appointment.newAppointmentId = existingAppointment?.newAppointmentId || "";
    } else {
      appointment.followUpStatus = "";
      appointment.followUpComment = "";
      appointment.newAppointmentId = "";
    }
    if (isSlotBlockingAppointment(appointment)) {
      const availabilityError = appointmentAvailabilityError(appointment);
      if (availabilityError) {
        alert(availabilityError);
        return;
      }
      const conflict = findAppointmentConflict(appointment);
      if (conflict) {
        alert(conflict.message);
        return;
      }
    }
    try {
      await saveAppointmentApi(appointment);
    } catch (error) {
      alert(error.message);
      return;
    }
    upsert(state.appointments, appointment);
    const auditEvent = appointmentAuditEvent(existingAppointment, appointment);
    if (auditEvent) addLocalAuditEvent(auditEvent.action, auditEvent.detail, appointment.patientId);
    if (!API_ENABLED) saveState();
    $("#appointmentDialog").close();
    render();
  });

  $("#saveRescheduleBtn").addEventListener("click", async () => {
    if (rescheduleSaving) return;
    const button = $("#saveRescheduleBtn");
    const restoreRescheduleButton = () => {
      rescheduleSaving = false;
      if (button) {
        button.disabled = false;
        button.textContent = "Guardar reprogramacion";
      }
    };
    rescheduleSaving = true;
    if (button) {
      button.disabled = true;
      button.textContent = "Guardando...";
    }
    if (!canManageAppointments()) {
      alert("Tu usuario no tiene permiso para reprogramar citas.");
      restoreRescheduleButton();
      return;
    }
    const data = formData($("#rescheduleForm"));
    const original = state.appointments.find((appointment) => appointment.id === data.appointmentId);
    if (!original) {
      restoreRescheduleButton();
      return;
    }
    if (!data.comment.trim()) {
      alert("Agrega un comentario para registrar el seguimiento de la reprogramacion.");
      restoreRescheduleButton();
      return;
    }
    const previousStatus = original.status;
    const previousNotes = original.notes;
    const previousFollowUpStatus = original.followUpStatus;
    const previousFollowUpComment = original.followUpComment;
    const previousNewAppointmentId = original.newAppointmentId;
    original.status = "REPROGRAMADA";
    original.notes = data.comment.trim();
    const newAppointment = {
      id: appointmentId(),
      date: data.date,
      time: data.time,
      unit: data.unit,
      doctor: data.doctor,
      patientId: original.patientId,
      service: original.service,
      duration: original.duration || serviceByName(original.service)?.duration || state.config.interval,
      status: "RESERVADA",
      notes: `Reprogramada desde ${formatDate(original.date)} ${original.time}. ${data.comment.trim()}`,
      followUpStatus: "",
      followUpComment: "",
      newAppointmentId: ""
    };
    original.followUpStatus = "REPROGRAMADO";
    original.followUpComment = data.comment.trim();
    original.newAppointmentId = newAppointment.id;
    const availabilityError = appointmentAvailabilityError(newAppointment);
    if (availabilityError) {
      original.status = previousStatus;
      original.notes = previousNotes;
      original.followUpStatus = previousFollowUpStatus;
      original.followUpComment = previousFollowUpComment;
      original.newAppointmentId = previousNewAppointmentId;
      alert(availabilityError);
      restoreRescheduleButton();
      return;
    }
    const conflict = findAppointmentConflict(newAppointment);
    if (conflict) {
      original.status = previousStatus;
      original.notes = previousNotes;
      original.followUpStatus = previousFollowUpStatus;
      original.followUpComment = previousFollowUpComment;
      original.newAppointmentId = previousNewAppointmentId;
      alert(conflict.message);
      restoreRescheduleButton();
      return;
    }
    try {
      await saveAppointmentApi(original);
      await saveAppointmentApi(newAppointment);
    } catch (error) {
      original.status = previousStatus;
      original.notes = previousNotes;
      original.followUpStatus = previousFollowUpStatus;
      original.followUpComment = previousFollowUpComment;
      original.newAppointmentId = previousNewAppointmentId;
      alert(error.message);
      restoreRescheduleButton();
      return;
    }
    state.appointments.push(newAppointment);
    addLocalAuditEvent(
      "APPOINTMENT_RESCHEDULED",
      `Reprogramo cita: ${patientById(original.patientId)?.name || "Paciente"} ${original.date} ${original.time}`,
      original.patientId
    );
    if (!API_ENABLED) saveState();
    $("#rescheduleDialog").close();
    render();
    restoreRescheduleButton();
  });

  $("#patientForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    if (patientSaving) return;
    const form = event.currentTarget;
    const submitButton = form.querySelector('button[type="submit"]');
    const saveMessage = $("#patientSaveMessage");
    patientSaving = true;
    if (saveMessage) saveMessage.hidden = true;
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Guardando...";
    }
    const data = formData(form);
    const editingId = form.elements.namedItem("id")?.value || "";
    const validation = validatePatientData(data);
    if (validation.errors.length) {
      alert(validation.errors.join("\n"));
      patientSaving = false;
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = editingId ? "Actualizar paciente" : "Guardar paciente";
      }
      return;
    }
    const duplicateDni = state.patients.find((patient) => patient.id !== editingId && String(patient.dni || "") === validation.values.dni);
    if (duplicateDni) {
      alert(`Ya existe otro paciente registrado con ese DNI: ${duplicateDni.name}.`);
      patientSaving = false;
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = editingId ? "Actualizar paciente" : "Guardar paciente";
      }
      return;
    }
    const existingPatient = editingId ? patientById(editingId) : null;
    const user = currentUser();
    const patient = {
      id: editingId || uid("p"),
      dni: validation.values.dni,
      name: validation.values.name.toUpperCase(),
      phone: validation.values.phone,
      birthDate: validation.values.birthDate,
      doctor: data.doctor,
      mainTreatment: data.mainTreatment,
      status: existingPatient?.status || "NUEVO",
      createdAt: existingPatient?.createdAt || todayISO(),
      createdById: existingPatient?.createdById || user?.id || "",
      createdByName: existingPatient?.createdByName || user?.name || "",
      createdByRole: existingPatient?.createdByRole || user?.role || "",
      hideFromReceptionNew: Boolean(existingPatient?.hideFromReceptionNew),
      // el presupuesto que el doctor ajusto: no se pierde al editar la ficha
      presupuesto: existingPatient?.presupuesto,
      /* El numero de historia y el momento en que se abrio no se tocan desde la
         ficha: se dan una sola vez y acompanan al paciente. */
      historiaNumero: existingPatient?.historiaNumero || 0,
      historiaDesde: existingPatient?.historiaDesde || "",
      historiaHora: existingPatient?.historiaHora || "",
      // el acompanante dejo de pedirse, pero lo ya escrito se conserva
      companion: existingPatient?.companion || "",
      /* Domicilio, representante y antecedentes: los pide la historia del
         Colegio y hasta ahora se llenaban a mano en cada hoja. */
      address: String(data.address || "").trim(),
      sexo: data.sexo === "F" || data.sexo === "M" ? data.sexo : "",
      birthPlace: String(data.birthPlace || "").trim(),
      origin: String(data.origin || "").trim(),
      education: String(data.education || "").trim(),
      maritalStatus: String(data.maritalStatus || "").trim(),
      occupation: String(data.occupation || "").trim(),
      travels: String(data.travels || "").trim(),
      emergencyContact: String(data.emergencyContact || "").trim(),
      chiefComplaint: String(data.chiefComplaint || "").trim(),
      allergies: String(data.allergies || "").trim(),
      medications: String(data.medications || "").trim(),
      personalHistory: String(data.personalHistory || "").trim(),
      familyHistory: String(data.familyHistory || "").trim(),
      currentIllness: String(data.currentIllness || "").trim(),
      illnessTime: String(data.illnessTime || "").trim(),
      symptoms: String(data.symptoms || "").trim(),
      anamnesis: String(data.anamnesis || "").trim(),
      biologicalFunctions: String(data.biologicalFunctions || "").trim(),
      guardianName: String(data.guardianName || "").trim().toUpperCase(),
      guardianDni: String(data.guardianDni || "").trim(),
      guardianRelation: String(data.guardianRelation || "").trim(),
      guardianPhone: String(data.guardianPhone || "").trim(),
      guardianAddress: String(data.guardianAddress || "").trim(),
      notes: data.notes
    };
    const previousPatient = existingPatient ? { ...existingPatient } : null;
    upsert(state.patients, patient);
    lastSavedPatientId = patient.id;
    form.reset();
    resetPatientFormMode();
    const search = $("#globalSearch");
    if (search) search.value = "";
    if (!API_ENABLED) saveState();
    render();
    if (saveMessage) {
      saveMessage.textContent = "Paciente guardado. Sincronizando con la nube...";
      saveMessage.hidden = false;
    }
    try {
      await savePatientApi(patient);
    } catch (error) {
      if (previousPatient) upsert(state.patients, previousPatient);
      else state.patients = state.patients.filter((item) => item.id !== patient.id);
      if (!API_ENABLED) saveState();
      render();
      Object.entries(patient).forEach(([key, value]) => {
        const field = form.elements.namedItem(key);
        if (field) field.value = value;
      });
      if (editingId) patientEditingId = editingId;
      alert(error.message);
      patientSaving = false;
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = editingId ? "Actualizar paciente" : "Guardar paciente";
      }
      return;
    }
    addLocalAuditEvent(existingPatient ? "PATIENT_UPDATED" : "PATIENT_CREATED", `${existingPatient ? "Edito paciente" : "Ingreso paciente"}: ${patient.name} (${patient.dni})`, patient.id);
    if (!API_ENABLED) saveState();
    render();
    if (saveMessage) {
      saveMessage.textContent = `Paciente guardado correctamente. Total registrado: ${state.patients.length} pacientes.`;
      saveMessage.hidden = false;
    }
    setTimeout(() => {
      document.querySelector(`[data-patient-row="${lastSavedPatientId}"]`)?.scrollIntoView({ block: "center", behavior: "smooth" });
    }, 0);
    patientSaving = false;
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = "Guardar paciente";
    }
  });

  $("#patientForm").addEventListener("reset", () => {
    setTimeout(resetPatientFormMode, 0);
  });

  $("#patientsTable").addEventListener("click", async (event) => {
    const toggleInfo = event.target.closest("[data-toggle-patient-info]");
    const edit = event.target.closest("[data-edit-patient]");
    const pay = event.target.closest("[data-pay-patient]");
    const del = event.target.closest("[data-delete-patient]");
    if (toggleInfo) {
      const patientId = toggleInfo.dataset.togglePatientInfo;
      const opening = expandedPatientInfoId !== patientId;
      expandedPatientInfoId = opening ? patientId : "";
      renderPatients();
      if (opening) await refreshPatientAppointmentsApi(patientId);
      return;
    }
    if (edit) {
      const patient = patientById(edit.dataset.editPatient);
      const form = $("#patientForm");
      patientEditingId = patient.id;
      Object.entries(patient).forEach(([key, value]) => {
        const field = form.elements.namedItem(key);
        if (!field) return;
        // el sexo son dos redondeles, no un cuadro de texto
        if (field instanceof RadioNodeList || field.type === "radio") {
          form.querySelectorAll(`[name="${key}"]`).forEach((radio) => { radio.checked = radio.value === value; });
          return;
        }
        field.value = value;
      });
      /* El representante y el detalle de la enfermedad se abren solos si el
         paciente los tiene: al editar hay que volver a mirarlos. */
      ajustarRepresentante();
      ajustarDetalleDeEnfermedad();
      const submitButton = form.querySelector('button[type="submit"]');
      if (submitButton) submitButton.textContent = "Actualizar paciente";
    }
    if (pay) {
      setView("pagos");
      fillPaymentPatientSelect($('#paymentForm select[name="patientId"]'), pay.dataset.payPatient);
      renderTreatmentPaymentOptions();
    }
    if (del) {
      if (!canDeletePatients()) {
        alert("Tu usuario no tiene permiso para eliminar pacientes.");
        return;
      }
      const patient = patientById(del.dataset.deletePatient);
      if (!patient || !confirm(`Eliminar paciente ${patient.name} y sus citas, historial, odontograma y pagos?`)) return;
      await deletePatientRecord(patient.id);
    }
  });

  $("#paymentsTable")?.addEventListener("click", async (event) => {
    const del = event.target.closest("[data-delete-payment]");
    if (!del || !isAdmin()) return;
    const payment = state.payments.find((item) => item.id === del.dataset.deletePayment);
    if (!payment) return;
    const patient = patientById(payment.patientId);
    if (!confirm(`Eliminar este pago de ${patient?.name || "paciente"} por ${money(payment.amount)}? La caja se recalculara automaticamente.`)) return;
    try {
      await deletePaymentApi(payment.id);
    } catch (error) {
      alert(error.message);
      return;
    }
    state.payments = state.payments.filter((item) => item.id !== payment.id);
    if (!API_ENABLED) saveState();
    render();
  });

  const handleExpenseDelete = async (event) => {
    const del = event.target.closest("[data-delete-expense]");
    if (!del || !isAdmin()) return;
    const expense = state.expenses.find((item) => item.id === del.dataset.deleteExpense);
    if (!expense) return;
    if (!confirm(`Eliminar este egreso por ${money(expense.amount)}? La caja se recalculara automaticamente.`)) return;
    try {
      await deleteExpenseApi(expense.id);
    } catch (error) {
      alert(error.message);
      return;
    }
    state.expenses = state.expenses.filter((item) => item.id !== expense.id);
    if (!API_ENABLED) saveState();
    render();
  };
  $("#expensesTable")?.addEventListener("click", handleExpenseDelete);
  $("#utilityMovementsTable")?.addEventListener("click", async (event) => {
    const del = event.target.closest("[data-delete-utility-movement]");
    if (del && isAdmin()) {
      const expense = state.expenses.find((item) => item.id === del.dataset.deleteUtilityMovement && (isUtilityContribution(item) || isUtilityPurchase(item)));
      if (!expense) return;
      if (!confirm(`Eliminar este movimiento de utilidad por ${money(expense.amount)}? Los saldos se recalcularan automaticamente.`)) return;
      try {
        await deleteExpenseApi(expense.id);
      } catch (error) {
        alert(error.message);
        return;
      }
      state.expenses = state.expenses.filter((item) => item.id !== expense.id);
      if (!API_ENABLED) saveState();
      render();
      return;
    }
    const convert = event.target.closest("[data-utility-to-contribution]");
    if (!convert || !isAdmin()) return;
    const expense = state.expenses.find((item) => item.id === convert.dataset.utilityToContribution);
    if (!expense || !isUtilityPurchase(expense)) return;
    if (!confirm(`Cambiar ${money(expense.amount)} de compra a aporte de utilidad? Esto sumara utilidad y descontara caja general segun su metodo.`)) return;
    const updated = {
      ...expense,
      source: "CAJA_GENERAL",
      category: "UTILIDAD_APORTE",
      receipt: "Aporte a utilidad"
    };
    try {
      await saveExpenseApi(updated);
    } catch (error) {
      alert(error.message);
      return;
    }
    upsert(state.expenses, updated);
    if (!API_ENABLED) saveState();
    render();
  });
  $("#staffPaymentsTable")?.addEventListener("click", async (event) => {
    const del = event.target.closest("[data-delete-staff-payment]");
    if (!del || !isAdmin()) return;
    const expense = state.expenses.find((item) => item.id === del.dataset.deleteStaffPayment && item.category === "PERSONAL_TERCERO");
    if (!expense) return;
    if (!confirm(`Eliminar este pago de ${expense.person || "personal/tercero"} por ${money(expense.amount)}? La caja general se recalculara automaticamente.`)) return;
    try {
      await deleteExpenseApi(expense.id);
    } catch (error) {
      alert(error.message);
      return;
    }
    state.expenses = state.expenses.filter((item) => item.id !== expense.id);
    if (!API_ENABLED) saveState();
    render();
  });

  $("#receivablesTable")?.addEventListener("click", (event) => {
    const edit = event.target.closest("[data-edit-receivable]");
    if (edit) {
      if (!canEditReceivableAmount()) {
        alert("Solo doctores y administrador pueden editar el monto.");
        return;
      }
      const entry = historyById(edit.dataset.editReceivable);
      if (!entry) return;
      const currentBalance = historyBalance(entry.id);
      const currentPaid = historyPaid(entry.id);
      const value = prompt("Nuevo saldo pendiente S/", String(currentBalance));
      if (value === null) return;
      const amount = Number(value);
      if (!amount || amount <= 0) {
        alert("Ingresa un monto valido.");
        return;
      }
      const newAgreedPrice = currentPaid + amount;
      updateReceivableAmount(entry, newAgreedPrice).catch((error) => alert(error.message));
      return;
    }
    const voidBtn = event.target.closest("[data-void-receivable]");
    if (voidBtn) {
      if (!canEditReceivableAmount()) {
        alert("Solo doctores y administrador pueden anular una deuda.");
        return;
      }
      const entry = historyById(voidBtn.dataset.voidReceivable);
      if (!entry) return;
      if (!confirm("¿Anular esta deuda? El paciente dejará de aparecer en cuentas por cobrar.")) return;
      voidReceivable(entry).catch((error) => alert(error.message));
      return;
    }
    const pay = event.target.closest("[data-pay-history]");
    if (!pay) return;
    openPaymentForHistory(pay.dataset.payHistory);
  });

  $("#manualReceivableForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = formData(form);
    let patient = patientById(data.patientId);
    if (!patient) {
      const matches = receivablePatientMatches(data.patientSearch);
      if (matches.length === 1) {
        patient = matches[0];
        form.patientId.value = patient.id;
        data.patientId = patient.id;
      }
    }
    if (!patient) {
      alert("Busca y selecciona un paciente de la lista.");
      return;
    }
    const amount = Number(data.creditAmount || 0);
    if (!amount || amount <= 0) {
      alert("Ingresa el monto de deuda.");
      return;
    }
    const entry = receivableEntryFromForm(data);
    // la cita que se pone en verde; el servidor la marca junto con la deuda
    const citaDeLaDeuda = citaParaLaDeuda(entry.patientId, entry.date);
    entry.appointmentId = citaDeLaDeuda?.id || "";
    try {
      await saveReceivableApi(entry);
    } catch (error) {
      alert(error.message);
      return;
    }
    upsert(state.clinicalHistory, entry);
    if (citaDeLaDeuda) {
      citaDeLaDeuda.status = "ATENDIDA";
      addLocalAuditEvent(
        "APPOINTMENT_ATTENDED",
        `Marcó atendida desde cuenta por cobrar: ${patient?.name || "Paciente"} ${citaDeLaDeuda.date} ${citaDeLaDeuda.time}`,
        citaDeLaDeuda.patientId
      );
    }
    form.reset();
    form.creditDueDate.value = todayISO();
    if (form.attentionDate) form.attentionDate.value = todayISO();
    const suggestions = $("#receivablePatientSuggestions");
    if (suggestions) suggestions.innerHTML = "";
    if (!API_ENABLED) saveState();
    render();
  });

  on('#manualReceivableForm input[name="patientSearch"]', "input", (event) => {
    const form = $("#manualReceivableForm");
    if (form?.patientId) form.patientId.value = "";
    renderReceivablePatientSuggestions();
  });

  $("#receivablePatientSuggestions")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-select-receivable-patient]");
    if (!button) return;
    const patient = patientById(button.dataset.selectReceivablePatient);
    selectReceivablePatient(patient);
  });

  $("#historyForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    if (historySaving) return;
    if (!canManageClinical()) {
      alert("Tu usuario no tiene permiso para guardar historial clínico.");
      return;
    }
    const form = event.currentTarget;
    const submitButton = form.querySelector('button[type="submit"]');
    historySaving = true;
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Guardando...";
    }
    const data = formData(event.currentTarget);
    if (!data.attended) {
      alert("Marca la opcion Atendido para poder guardar el historial.");
      historySaving = false;
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Guardar historial";
      }
      return;
    }
    // un costo sin nombre no abre ningun tratamiento y nadie se enteraria
    if (Number(data.planBudget || 0) > 0 && !String(data.plan || "").trim()) {
      alert("Escribe qué tratamiento es, por ejemplo Ortodoncia.");
      historySaving = false;
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Guardar historial";
      }
      const pliegue = form.querySelector(".form-more");
      if (pliegue) pliegue.open = true;
      form.elements.namedItem("plan")?.focus();
      return;
    }
    const creditPending = data.creditPending === "on";
    const creditAmount = Number(data.creditAmount || data.agreedPrice || 0);
    if (creditPending && !data.creditDueDate) {
      alert("Completa la fecha compromiso del pago pendiente.");
      historySaving = false;
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Guardar historial";
      }
      openCreditDialog();
      return;
    }
    const entry = {
      id: data.id || uid("h"),
      patientId: data.patientId,
      date: data.date,
      attendedBy: data.attendedBy,
      attended: true,
      reason: data.reason || "",
      anamnesis: data.anamnesis || "",
      exam: data.exam || "",
      diagnosis: data.diagnosis || "",
      plan: data.plan || "",
      procedure: data.procedure || "",
      instructions: data.instructions || "",
      agreedPrice: Number(data.agreedPrice || 0),
      planBudget: Number(data.planBudget || 0),
      creditPending,
      creditAmount,
      creditDueDate: data.creditDueDate || "",
      creditNote: data.creditNote || ""
    };
    // la cita de esta nota; el servidor marca solo esa
    const citaDeLaNota = citaParaLaNota(data.patientId, data.date, data.id || "");
    entry.appointmentId = citaDeLaNota?.id || "";
    const attendedPatient = patientById(data.patientId);
    const activePatient = attendedPatient ? { ...attendedPatient, status: "ACTIVO" } : null;
    try {
      await saveClinicalHistoryApi(entry);
      if (activePatient) await savePatientApi(activePatient);
    } catch (error) {
      alert(error.message);
      historySaving = false;
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Guardar historial";
      }
      return;
    }
    upsert(state.clinicalHistory, entry);
    if (activePatient) upsert(state.patients, activePatient);
    if (citaDeLaNota) citaDeLaNota.status = "ATENDIDA";
    $("#historyPatientFilter").value = data.patientId;
    form.reset();
    form.creditPending.checked = false;
    form.creditAmount.value = "";
    form.creditDueDate.value = "";
    form.creditNote.value = "";
    updateCreditSummary();
    $('#historyForm input[name="date"]').value = todayISO();
    if (!API_ENABLED) saveState();
    render();
    historySaving = false;
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = "Guardar historial";
    }
  });

  // plan y presupuesto se abre desde un boton junto al titulo de la nota
  $("#historyForm .hn-plan-toggle")?.addEventListener("click", () => {
    const pliegue = $("#historyForm .form-more");
    if (pliegue) pliegue.open = !pliegue.open;
  });
  // el boton dice si esta abierto, lo abra el boton, Editar o Limpiar
  $("#historyForm .form-more")?.addEventListener("toggle", (event) => {
    const boton = $("#historyForm .hn-plan-toggle");
    if (!boton) return;
    const abierto = event.currentTarget.open;
    boton.setAttribute("aria-expanded", String(abierto));
    boton.textContent = abierto ? "− Plan y presupuesto" : "+ Plan y presupuesto";
  });
  /* Con costo total, el cobro de hoy queda en S/ 0: el tratamiento ya se cobra
     en Pagos, y poner el mismo monto en los dos lados lo cobraba dos veces. Si
     la persona escribe un cobro de hoy -la consulta aparte-, se respeta. */
  const ajustarCobroDeHoy = () => {
    const form = $("#historyForm");
    if (!form) return;
    const costo = Number(form.elements.namedItem("planBudget")?.value || 0);
    const cobro = form.elements.namedItem("agreedPrice");
    if (costo > 0 && cobro && !cobro.dataset.manual) cobro.value = "0";
    const aviso = $("#historyChargeHint");
    if (aviso) aviso.hidden = !(costo > 0);
  };
  $('#historyForm input[name="planBudget"]')?.addEventListener("input", ajustarCobroDeHoy);
  $('#historyForm input[name="agreedPrice"]')?.addEventListener("input", (event) => {
    event.target.dataset.manual = event.target.value !== "" ? "1" : "";
    // el aviso de la deuda del dia mira este campo: solo estorba si hay cobro
    avisoDeDeudaDelDia();
  });
  $("#historyForm")?.addEventListener("reset", () => {
    const masDetalles = $("#historyForm .form-more");
    if (masDetalles) masDetalles.open = false;
    const cobro = $('#historyForm input[name="agreedPrice"]');
    if (cobro) cobro.dataset.manual = "";
    const avisoCobro = $("#historyChargeHint");
    if (avisoCobro) avisoCobro.hidden = true;
    const avisoDeuda = $("#historyDebtNotice");
    if (avisoDeuda) avisoDeuda.hidden = true;
  });

  /* La hoja de la historia se escribe encima: cada raya es su campo y al salir
     de ella se guarda sola, sin boton. Es como se llena en papel, y evita ir y
     volver al formulario de la nota por cada dato. */
  $("#historyTimeline")?.addEventListener("focusout", (event) => {
    const campo = event.target.closest("[data-campo][contenteditable]");
    if (campo) guardarCampoDeLaHoja(campo);
  });
  /* Enter cierra el campo de una linea en vez de partirlo en dos; en las cajas
     de varias lineas se escribe con Enter como en cualquier otro sitio. */
  $("#historyTimeline")?.addEventListener("keydown", (event) => {
    const campo = event.target.closest("[data-campo][contenteditable]");
    if (!campo) return;
    if (event.key === "Escape") {
      campo.dataset.cancelado = "1";
      campo.blur();
      renderClinicalHistory();
      return;
    }
    if (event.key === "Enter" && !campo.classList.contains("hcf-caja")) {
      event.preventDefault();
      campo.blur();
    }
  });
  /* Quien firma la historia se elige: en un consultorio con varios doctores no
     siempre atiende el de la ficha. */
  $("#historyTimeline")?.addEventListener("change", (event) => {
    const select = event.target.closest("[data-profesional]");
    if (!select || !canManageClinical()) return;
    const entrada = state.clinicalHistory.find((item) => item.id === select.dataset.profesional);
    if (!entrada || entrada.professional === select.value) return;
    entrada.professional = select.value;
    saveClinicalHistoryApi(entrada).catch((error) => alert(error.message));
    if (!API_ENABLED) saveState();
    renderClinicalHistory();
  });
  /* Abrir la historia, firmarla e imprimirla: los tres botones del pie. */
  $("#historyTimeline")?.addEventListener("click", (event) => {
    const abrirHistoria = event.target.closest("[data-guardar-historia]");
    if (abrirHistoria) {
      guardarHistoriaClinica(abrirHistoria.dataset.guardarHistoria);
      return;
    }
    const firmarHistoria = event.target.closest("[data-firmar-profesional]");
    if (firmarHistoria) {
      abrirFirmaDelProfesional(firmarHistoria.dataset.firmarProfesional);
      return;
    }
    const imprimirHoja = event.target.closest("[data-imprimir-historia]");
    if (imprimirHoja) imprimirHistoria(imprimirHoja.dataset.imprimirHistoria);
  });

  bindFirmaDelConsentimiento();

  /* El consentimiento: elegir el tratamiento, firmarlo e imprimirlo. */
  $("#historyTimeline")?.addEventListener("click", (event) => {
    const elegir = event.target.closest("[data-consentimiento]");
    if (elegir) {
      consentimientoElegido = elegir.dataset.consentimiento;
      renderClinicalHistory();
      return;
    }
    const firmar = event.target.closest("[data-firmar-consentimiento]");
    if (firmar) {
      abrirFirmaDelConsentimiento($("#historyPatientFilter")?.value || "", firmar.dataset.firmarConsentimiento);
      return;
    }
    const imprimir = event.target.closest("[data-imprimir-consentimiento]");
    if (imprimir) imprimirConsentimiento($("#historyPatientFilter")?.value || "", imprimir.dataset.imprimirConsentimiento);
  });

  $("#historySheetTabs")?.addEventListener("click", (event) => {
    const pestana = event.target.closest("[data-hoja]");
    if (!pestana) return;
    historySheetTab = pestana.dataset.hoja;
    if (historySheetTab !== "plan") olvidarBorradorDePrecios();
    renderClinicalHistory();
  });

  /* Los dos botones del pie del odontograma: seguir marcando donde se quedo, o
     llevarse la hoja impresa. */
  $("#historyTimeline")?.addEventListener("click", (event) => {
    const editar = event.target.closest("[data-editar-odontograma]");
    if (editar) {
      const patientId = editar.dataset.editarOdontograma;
      if (!patientId) return;
      odontogramPatientId = patientId;
      setView("odontograma");
      render();
      return;
    }
    const imprimir = event.target.closest("[data-imprimir-odontograma]");
    if (imprimir) imprimirOdontogramas(imprimir.dataset.imprimirOdontograma);
  });

  /* ---------- Plan de tratamiento ---------- */
  const guardarPresupuesto = async (paciente) => {
    try {
      await savePatientApi(paciente);
    } catch (error) {
      alert(error.message);
    }
    renderPlanDeTratamiento();
  };

  const presupuestoDeLaFicha = (paciente) => {
    const guardado = paciente?.presupuesto || {};
    return {
      descuento: Number(guardado.descuento || 0),
      precios: { ...(guardado.precios || {}) },
      quitadas: Array.isArray(guardado.quitadas) ? [...guardado.quitadas] : [],
      sueltos: Array.isArray(guardado.sueltos) ? guardado.sueltos.map((suelto) => ({ ...suelto })) : []
    };
  };

  $("#historyTimeline")?.addEventListener("change", async (event) => {
    const precio = event.target.closest("[data-precio]");
    const rebaja = event.target.closest("[data-descuento]");
    if (precio || rebaja) {
      const control = precio || rebaja;
      const paciente = patientById(control.dataset.paciente);
      if (!paciente || !canManageClinical()) return;
      const presupuesto = presupuestoDeLaFicha(paciente);
      if (precio) presupuesto.precios = { ...presupuesto.precios, [precio.dataset.precio]: Number(precio.value || 0) };
      else presupuesto.descuento = Math.min(100, Math.max(0, Number(rebaja.value || 0)));
      paciente.presupuesto = presupuesto;
      await guardarPresupuesto(paciente);
      return;
    }
    // el tratamiento y el precio se graban en cuanto se terminan de escribir
    const campo = event.target.closest(".servicio-campo[data-campo='name'], .servicio-campo[data-campo='price']");
    if (campo) {
      const lineas = leerTablaDeServicios();
      let cambio = false;
      lineas.forEach((linea) => {
        if (linea.tipo === "nueva" && linea.name) { linea.tipo = "plantilla"; cambio = true; }
      });
      if (cambio && !lineas.some((linea) => linea.tipo === "nueva")) {
        lineas.push({ tipo: "nueva", name: "", price: "", pz: "" });
      }
      guardarListaDePrecios();
      if (cambio) renderPlanDeTratamiento();
      return;
    }
    const casilla = event.target.closest("[data-elegir-servicio]");
    if (!casilla) return;
    const paciente = patientById(casilla.dataset.paciente);
    if (!paciente || !canManageClinical()) return;
    const lineas = leerTablaDeServicios();
    const linea = lineas[Number(casilla.dataset.elegirServicio)];
    if (!linea?.name) return;
    const presupuesto = presupuestoDeLaFicha(paciente);
    // pz es la pieza a la que se le hace, no cuantas veces: va en su columna
    const pieza = String(linea.pz || "").trim();
    const esLaMisma = (suelto) => suelto.servicio === linea.name && String(suelto.pieza || "").trim() === pieza;
    if (!casilla.checked) {
      presupuesto.sueltos = presupuesto.sueltos.filter((suelto) => !esLaMisma(suelto));
    } else {
      const precioLinea = Number(linea.price || 0);
      const yaEsta = presupuesto.sueltos.find(esLaMisma);
      if (yaEsta) Object.assign(yaEsta, { pieza, precio: precioLinea });
      else {
        presupuesto.sueltos = [...presupuesto.sueltos, {
          clave: uid("mano"), pieza, servicio: linea.name, detalle: linea.name, cantidad: 1, precio: precioLinea
        }];
      }
    }
    paciente.presupuesto = presupuesto;
    await guardarPresupuesto(paciente);
  });

  $("#historyTimeline")?.addEventListener("click", async (event) => {
    const subPestana = event.target.closest("[data-plan-hoja]");
    if (subPestana) {
      planSubTab = subPestana.dataset.planHoja;
      if (planSubTab !== "precios") olvidarBorradorDePrecios();
      renderPlanDeTratamiento();
      return;
    }
    const usar = event.target.closest("[data-usar-precio]");
    if (usar) {
      const lineas = leerTablaDeServicios();
      const i = Number(usar.dataset.usarPrecio);
      const plantilla = lineas[i];
      if (!plantilla?.name) return;
      lineas.splice(i + 1, 0, { tipo: "trabajo", name: plantilla.name, price: plantilla.price, pz: "" });
      renderPlanDeTratamiento();
      const nueva = $("#servicesTable")?.querySelectorAll("tr")[i + 1]?.querySelector("[data-campo='pz']");
      if (nueva) nueva.focus();
      return;
    }
    if (event.target.closest("#addServiceBtn")) {
      leerTablaDeServicios().push({ tipo: "nueva", name: "", price: "", pz: "" });
      renderPlanDeTratamiento();
      const ultima = $("#servicesTable")?.querySelector("tr:last-child [data-campo='name']");
      if (ultima) ultima.focus();
      return;
    }
    if (event.target.closest("#exitPricesBtn")) {
      leerTablaDeServicios();
      guardarListaDePrecios();
      olvidarBorradorDePrecios();
      planSubTab = "plan";
      renderPlanDeTratamiento();
      return;
    }
    const quitarPrecio = event.target.closest("[data-quitar-precio]");
    if (quitarPrecio) {
      const lineas = leerTablaDeServicios();
      const i = Number(quitarPrecio.dataset.quitarPrecio);
      const fuera = lineas[i];
      const conSusLineas = fuera?.tipo === "plantilla"
        ? lineas.filter((linea, j) => j !== i && !(linea.tipo === "trabajo" && linea.name === fuera.name))
        : lineas.filter((linea, j) => j !== i);
      serviciosBorrador = conSusLineas.length ? conSusLineas : [{ tipo: "nueva", name: "", price: "", pz: "" }];
      guardarListaDePrecios();
      const paciente = patientById($("#historyPatientFilter")?.value || "");
      if (fuera?.name && paciente && canManageClinical()) {
        const presupuesto = presupuestoDeLaFicha(paciente);
        const pieza = String(fuera.pz || "").trim();
        presupuesto.sueltos = presupuesto.sueltos.filter((suelto) => suelto.servicio !== fuera.name
          || (fuera.tipo === "trabajo" && String(suelto.pieza || "").trim() !== pieza));
        paciente.presupuesto = presupuesto;
        await guardarPresupuesto(paciente);
        return;
      }
      renderPlanDeTratamiento();
      return;
    }
    const quitarLinea = event.target.closest("[data-quitar-linea]");
    if (quitarLinea) {
      const paciente = patientById(quitarLinea.dataset.paciente);
      if (!paciente || !canManageClinical()) return;
      const presupuesto = presupuestoDeLaFicha(paciente);
      const clave = quitarLinea.dataset.quitarLinea;
      if (quitarLinea.dataset.suelto) {
        presupuesto.sueltos = presupuesto.sueltos.filter((suelto) => suelto.clave !== clave);
        delete presupuesto.precios[clave];
      } else {
        presupuesto.quitadas = presupuesto.quitadas.includes(clave)
          ? presupuesto.quitadas.filter((item) => item !== clave)
          : [...presupuesto.quitadas, clave];
      }
      paciente.presupuesto = presupuesto;
      await guardarPresupuesto(paciente);
      return;
    }
    const guardarProf = event.target.closest("[data-guardar-proforma]");
    if (guardarProf) {
      if (!canManageClinical()) return;
      const proforma = proformaDelPresupuesto(guardarProf.dataset.guardarProforma);
      if (!proforma) {
        alert("No hay nada en el presupuesto para entregar.");
        return;
      }
      upsert(state.proformas, proforma);
      try {
        await saveProformaApi(proforma);
      } catch (error) {
        alert(error.message);
        return;
      }
      renderPlanDeTratamiento();
      return;
    }
    const aceptarProf = event.target.closest("[data-aceptar-proforma]");
    if (aceptarProf) {
      await aceptarProforma(aceptarProf.dataset.aceptarProforma);
      return;
    }
    const imprimirProf = event.target.closest("[data-imprimir-proforma]");
    if (imprimirProf) {
      imprimirProforma(imprimirProf.dataset.imprimirProforma);
      return;
    }
    const borrarProf = event.target.closest("[data-borrar-proforma]");
    if (borrarProf) {
      if (!canManageClinical()) return;
      const proforma = (state.proformas || []).find((item) => item.id === borrarProf.dataset.borrarProforma);
      if (!proforma) return;
      if (!confirm("¿Borrar la proforma " + numeroDeProforma(proforma.numero) + "? Si el paciente ya se la llevó, quedará sin respaldo en el sistema.")) return;
      state.proformas = state.proformas.filter((item) => item.id !== proforma.id);
      try {
        await deleteProformaApi(proforma.id, proforma.patientId);
      } catch (error) {
        alert(error.message);
        return;
      }
      renderPlanDeTratamiento();
      return;
    }
  });

  $("#historyTimeline").addEventListener("click", (event) => {
    const edit = event.target.closest("[data-edit-history]");
    if (!edit) return;
    const entry = state.clinicalHistory.find((item) => item.id === edit.dataset.editHistory);
    const form = $("#historyForm");
    fillPatientSelect(form.patientId, entry.patientId);
    Object.entries(entry).forEach(([key, value]) => {
      if (!form[key]) return;
      if (form[key].type === "checkbox") form[key].checked = Boolean(value);
      else form[key].value = value;
    });
    updateCreditSummary();
    const masDetalles = form.querySelector(".form-more");
    if (masDetalles) masDetalles.open = Boolean(String(entry.plan || "").trim() || Number(entry.planBudget || 0) > 0 || String(entry.instructions || "").trim());
    // una nota guardada ya tiene su cobro de hoy decidido: no se pisa
    if (form.agreedPrice) form.agreedPrice.dataset.manual = "1";
    avisoDeDeudaDelDia();
    const avisoCobro = $("#historyChargeHint");
    if (avisoCobro) avisoCobro.hidden = !(Number(entry.planBudget || 0) > 0);
  });

  // El odontograma se maneja por completo dentro de odontograma.js: sus
  // eventos los registra el propio modulo al crearse en renderOdontogram().

  $('#paymentForm select[name="patientId"]').addEventListener("change", () => {
    const selectedPatient = patientIdFromPaymentSelection($('#paymentForm select[name="patientId"]').value);
    const forcedHistory = historyById(forcedPaymentHistoryId);
    if (!forcedHistory || forcedHistory.patientId !== selectedPatient) forcedPaymentHistoryId = "";
    renderTreatmentPaymentOptions();
  });
  $('#paymentForm select[name="historyId"]').addEventListener("change", () => {
    forcedPaymentHistoryId = "";
    updatePaymentDue();
  });
  $("#clearHistoryDebtBtn")?.addEventListener("click", clearSelectedHistoryDebt);
  $('#paymentForm input[name="amount"]').addEventListener("input", () => {
    /* La cifra escrita a mano pasa a ser la base sobre la que se suman los
       productos. Sin esto, agregar un producto despues de escribir un abono de
       30 devolvia el total de la deuda y se cobraba de mas. */
    const form = $("#paymentForm");
    if (form) form.dataset.basePaymentAmount = Math.max(0, Number(form.amount.value || 0) - paymentProductTotal());
    updatePaymentChange();
    aplicarCuadroDeDescuento();
  });
  $('#paymentForm input[name="descontarTratamiento"]')?.addEventListener("change", aplicarCuadroDeDescuento);
  $('#paymentForm input[name="cashReceived"]').addEventListener("input", updatePaymentChange);
  $('#paymentForm select[name="method"]').addEventListener("change", () => {
    toggleMixedPaymentFields();
    updatePaymentChange();
  });
  $("#openMixedPaymentBtn")?.addEventListener("click", openMixedPaymentDialog);
  $("#saveMixedPaymentBtn")?.addEventListener("click", applyMixedPaymentDialog);
  $("#mixedPaymentForm")?.addEventListener("input", updateMixedPaymentDialogSummary);
  $("#openProductSaleBtn")?.addEventListener("click", openProductSaleDialog);
  $("#paymentProductSummary")?.addEventListener("click", (event) => {
    if (!event.target.closest("#removePaymentProductsBtn")) return;
    selectedProductSaleItems = [];
    applyProductTotalToPaymentForm();
  });
  $("#productSaleList")?.addEventListener("click", (event) => {
    const stepButton = event.target.closest("[data-product-step]");
    if (!stepButton) return;
    const productId = stepButton.dataset.productStep;
    const current = Number(productSaleItemById(productId)?.quantity || 0);
    setProductSaleQuantity(productId, current + Number(stepButton.dataset.step || 0));
  });
  $("#productSaleList")?.addEventListener("change", (event) => {
    const input = event.target.closest("[data-product-qty]");
    if (!input) return;
    setProductSaleQuantity(input.dataset.productQty, Number(input.value || 0));
  });
  $("#clearProductSaleBtn")?.addEventListener("click", () => {
    selectedProductSaleItems = [];
    renderProductSaleDialog();
    applyProductTotalToPaymentForm();
  });
  $("#saveProductSaleBtn")?.addEventListener("click", () => {
    applyProductTotalToPaymentForm();
    $("#productSaleDialog")?.close("ok");
  });
  $("#savePaymentOnlyBtn")?.addEventListener("click", () => completePendingPayment(null));
  $("#openReceiptIssueBtn")?.addEventListener("click", () => {
    $("#receiptPromptDialog")?.close("emitir");
    setupReceiptIssueForm();
    $("#receiptIssueDialog")?.showModal();
  });
  $("#cancelReceiptIssueBtn")?.addEventListener("click", () => {
    $("#receiptIssueDialog")?.close("cancel");
    pendingPaymentContext?.restorePaymentButton();
    pendingPaymentContext = null;
  });
  $("#receiptIssueForm")?.elements.namedItem("type")?.addEventListener("change", applyReceiptTypeUI);
  $("#lookupReceiptDocBtn")?.addEventListener("click", lookupReceiptDocument);
  $("#receiptIssueForm")?.elements.namedItem("customerDoc")?.addEventListener("blur", lookupReceiptDocument);
  $("#receiptIssueForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = formData(form);
    if (values.type === "FACTURA" && !/^\d{11}$/.test(String(values.customerDoc || ""))) {
      alert("Para factura ingresa RUC de 11 digitos.");
      return;
    }
    if (!String(values.customerName || "").trim()) {
      alert("Ingresa el nombre o razon social.");
      return;
    }
    await completePendingPayment(values);
  });
  $("#receiptIssueDialog")?.addEventListener("close", () => {
    if (pendingPaymentContext && $("#receiptIssueDialog")?.returnValue !== "ok") {
      pendingPaymentContext.restorePaymentButton();
      pendingPaymentContext = null;
    }
  });
  $("#receiptPromptDialog")?.addEventListener("close", () => {
    if (pendingPaymentContext && $("#receiptPromptDialog")?.returnValue === "cancel") {
      pendingPaymentContext.restorePaymentButton();
      pendingPaymentContext = null;
    }
  });
  $("#paymentForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    if (paymentSaving) return;
    const form = event.currentTarget;
    const submitButton = form.querySelector('button[type="submit"]');
    const restorePaymentButton = () => {
      paymentSaving = false;
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Guardar pago";
      }
    };
    paymentSaving = true;
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Guardando...";
    }
    if (!cashSessionToday()) {
      alert("Primero abre la caja del dia para registrar pagos.");
      restorePaymentButton();
      return;
    }
    if (!canManagePayments()) {
      alert("Tu usuario no tiene permiso para registrar pagos.");
      restorePaymentButton();
      return;
    }
    const data = formData(form);
    // descontar del tratamiento no es un cobro: no pide boleta ni toca caja
    if (data.descontarTratamiento === "on") {
      await guardarDescuentoDeTratamiento({ form, data, restorePaymentButton });
      return;
    }
    const appointment = appointmentFromPaymentSelection(data.patientId);
    const cashDate = appointment?.date || operatingDate();
    const paymentPatientId = patientIdFromPaymentSelection(data.patientId);
    const tratamientoCobrado = String(data.historyId || "").startsWith("trat:") ? tratamientoPorId(String(data.historyId).slice(5)) : null;
    const due = tratamientoCobrado ? tratamientoCobrado.porPagar : appointment ? 0 : historyBalance(data.historyId);
    const amount = Number(data.amount || 0);
    const productsTotal = paymentProductTotal();
    const hasProducts = productsTotal > 0 && selectedProductSaleItems.length > 0;
    const careAmount = Math.max(0, amount - productsTotal);
    if (!appointment && !data.historyId && !hasProducts) {
      alert("Selecciona una atencion pendiente, una cita del dia o agrega un producto.");
      restorePaymentButton();
      return;
    }
    const paymentPatient = patientById(paymentPatientId);
    const missingPatientFields = patientPaymentMissingFields(paymentPatient);
    if (missingPatientFields.length) {
      alert(`Antes de registrar el pago, completa los datos del paciente: ${missingPatientFields.join(", ")}.`);
      restorePaymentButton();
      setView("pacientes");
      const patientForm = $("#patientForm");
      if (paymentPatient && patientForm) {
        patientEditingId = paymentPatient.id;
        Object.entries(paymentPatient).forEach(([key, value]) => {
          const field = patientForm.elements.namedItem(key);
          if (field) field.value = value;
        });
        const submitButton = patientForm.querySelector('button[type="submit"]');
        if (submitButton) submitButton.textContent = "Actualizar paciente";
      }
      return;
    }
    if (amount <= 0 || ((tratamientoCobrado || (!appointment && data.historyId)) && (careAmount <= 0 || careAmount > due))) {
      alert(appointment ? "El monto debe ser mayor a cero." : "El monto debe ser mayor a cero y no puede superar el saldo pendiente.");
      restorePaymentButton();
      return;
    }
    const splitResult = paymentSplitFromForm(data, amount);
    if (splitResult.error) {
      alert(splitResult.error);
      restorePaymentButton();
      return;
    }
    const split = splitResult.split;
    const cashPortion = Number(split.cashAmount || 0);
    const cashReceived = cashPortion > 0 ? Number(data.cashReceived || cashPortion || 0) : 0;
    const payment = {
      id: data.id || uid("pay"),
      patientId: paymentPatientId,
      historyId: appointment || tratamientoCobrado ? "" : data.historyId,
      appointmentId: appointment?.id || "",
      treatmentId: tratamientoCobrado?.entry.id || "",
      date: cashDate,
      amount,
      productAmount: productsTotal,
      cashReceived,
      change: Math.max(0, cashReceived - cashPortion),
      method: String(data.method || "").toUpperCase(),
      ...split,
      productItems: selectedProductSaleItems.map((item) => ({
        productId: item.productId,
        name: item.name,
        quantity: Number(item.quantity || 0),
        price: Number(item.price || 0)
      })),
      receipt: tratamientoCobrado && !String(data.receipt || "").trim()
        ? `Tratamiento: ${tratamientoCobrado.entry.plan}`
        : buildPaymentReceiptText(data.receipt, appointment, selectedProductSaleItems),
      /* El servidor guarda quien cobro tomandolo de la sesion, no de aqui. Se
         anota igual en la copia local para que la fila lo muestre al momento y
         no recien despues de recargar; es el mismo usuario, asi que coincide. */
      registeredBy: currentUser()?.name || ""
    };
    openPaymentReceiptPrompt({ payment, form, restorePaymentButton });
  });
  $("#paymentForm")?.addEventListener("reset", () => {
    selectedProductSaleItems = [];
    setTimeout(() => {
      renderPaymentProductSummary();
      const form = $("#paymentForm");
      if (form) form.dataset.basePaymentAmount = "";
      aplicarCuadroDeDescuento();
    }, 0);
  });

  $("#inventoryProductForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!canManageInventory()) return;
    const form = event.currentTarget;
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton?.disabled) return;
    const data = formData(form);
    const product = {
      id: data.id || uid("prod"),
      name: String(data.name || "").trim().toUpperCase(),
      unit: String(data.unit || "Unidad").trim() || "Unidad",
      price: Number(data.price || 0),
      stock: Number(data.stock || 0),
      minStock: Number(data.minStock || 0),
      active: true
    };
    if (!product.name || product.price < 0 || product.stock < 0) {
      alert("Completa nombre, precio y stock del producto.");
      return;
    }
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Guardando...";
    }
    try {
      await saveInventoryProductApi(product);
    } catch (error) {
      alert(error.message || "No se pudo guardar el producto.");
      return;
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Guardar producto";
      }
    }
    if (!API_ENABLED) upsert(state.inventoryProducts, product);
    if (!API_ENABLED) saveState();
    form.reset();
    if (form.id) form.id.value = "";
    render();
  });

  $("#inventoryProductForm")?.addEventListener("reset", (event) => {
    const form = event.currentTarget;
    setTimeout(() => {
      if (form.id) form.id.value = "";
      const submitButton = form.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Guardar producto";
      }
    }, 0);
  });

  $("#inventoryMovementForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!canManageInventory()) return;
    const form = event.currentTarget;
    const data = formData(form);
    const product = inventoryProductById(data.productId);
    const quantity = Number(data.quantity || 0);
    if (!product || quantity <= 0) {
      alert("Selecciona producto y cantidad.");
      return;
    }
    const movement = {
      id: uid("mov"),
      productId: product.id,
      date: todayISO(),
      type: data.type,
      quantity,
      unitPrice: Number(data.unitPrice || product.price || 0),
      total: quantity * Number(data.unitPrice || product.price || 0),
      detail: String(data.detail || "").trim()
    };
    if (["SALIDA", "VENTA"].includes(movement.type) && quantity > Number(product.stock || 0)) {
      alert("No hay stock suficiente para registrar la salida.");
      return;
    }
    try {
      await saveInventoryMovementApi(movement);
    } catch (error) {
      alert(error.message);
      return;
    }
    if (!API_ENABLED) {
      const signedQty = movement.type === "ENTRADA" ? quantity : -quantity;
      product.stock = Number(product.stock || 0) + signedQty;
      state.inventoryMovements.unshift(movement);
      saveState();
    }
    form.reset();
    render();
  });
  $("#inventoryProductsTable")?.addEventListener("click", (event) => {
    const edit = event.target.closest("[data-edit-product]");
    if (!edit) return;
    const product = inventoryProductById(edit.dataset.editProduct);
    const form = $("#inventoryProductForm");
    if (!product || !form) return;
    form.id.value = product.id;
    form.name.value = product.name;
    form.price.value = product.price;
    form.stock.value = product.stock;
    form.minStock.value = product.minStock || 0;
    form.unit.value = product.unit || "Unidad";
    form.name.focus();
  });

  $("#openCashBtn").addEventListener("click", async () => {
    if (!canManageCash()) {
      alert("Tu usuario no tiene permiso para abrir caja.");
      return;
    }
    const existing = cashSessionToday();
    if (existing) {
      alert(`La caja de ${formatDate(existing.date)} sigue abierta. Primero debes cerrar esa caja antes de abrir otra.`);
      return;
    }
    const cashDate = todayISO();
    const sessionForDate = state.cashSessions.find((session) => session.date === cashDate);
    if (sessionForDate) {
      alert(`La caja de ${formatDate(cashDate)} ya fue registrada. Para revisar sus pagos, selecciona esa fecha en Fecha de caja.`);
      selectedCashViewDate = cashDate;
      render();
      return;
    }
    const openingCash = Number(pettyCashAmount(cashDate) || 0);
    // en centimos enteros: el saldo acumulado arrastra fracciones invisibles y
    // entregar justo lo que hay en caja se rechazaba por una millonesima
    if (Math.round(openingCash * 100) > Math.round(Number(generalCashBalances().cash || 0) * 100)) {
      alert("La caja general no tiene suficiente efectivo para entregar esa caja chica.");
      return;
    }
    const session = { id: uid("cash"), date: cashDate, openingCash, openedAt: new Date().toISOString(), closedAt: "", closingCash: 0, difference: 0 };
    try {
      await openCashApi(session);
    } catch (error) {
      alert(error.message);
      return;
    }
    state.cashSessions.push(session);
    if (!API_ENABLED) saveState();
    render();
  });

  $("#closeCashBtn").addEventListener("click", async () => {
    if (!canManageCash()) {
      alert("Tu usuario no tiene permiso para cerrar caja.");
      return;
    }
    const session = activeOpenCashSession();
    const cashDate = session?.date || cashViewDate();
    if (!session) {
      alert("Primero abre la caja del dia.");
      return;
    }
    const unresolved = state.appointments.filter(
      (appointment) => appointment.date === cashDate && isSlotBlockingAppointment(appointment) && appointment.status !== "ATENDIDA"
    );
    if (unresolved.length) {
      const names = unresolved.map((appointment) => patientById(appointment.patientId)?.name || "Paciente").join(", ");
      alert(`No puedes cerrar caja. Debes atender o reprogramar con comentario a: ${names}`);
      return;
    }
    const pendingFollowUps = appointmentFollowUps().filter((appointment) => appointment.date === cashDate);
    if (pendingFollowUps.length) {
      const names = pendingFollowUps.map((appointment) => patientById(appointment.patientId)?.name || "Paciente").join(", ");
      if (!confirm(`Hay citas en seguimiento pendientes: ${names}. Puedes cerrar caja, pero recuerda gestionarlas. ¿Continuar?`)) return;
    }
    if ($("#closingCash").value === "") {
      alert("Ingresa el efectivo contado al cierre antes de cerrar caja.");
      $("#closingCash").focus();
      return;
    }
    const incomeTotal = incomeForCashView(cashDate);
    const expenseTotal = cashAffectingExpenseTotalForView(cashDate);
    const expected = Number(session.openingCash || 0) + incomeTotal - expenseTotal;
    const reviewOnlyClose = hasOnlyClosedVisibleCashMovements(cashDate);
    let closing = Number($("#closingCash").value || 0);
    if (reviewOnlyClose) {
      closing = expected;
      $("#closingCash").value = expected.toFixed(2);
    }
    const difference = closing - expected;
    if (Math.abs(difference) > 0.009) {
      alert(`No puedes cerrar caja con diferencia. Esperado: ${money(expected)}. Contado: ${money(closing)}. Diferencia: ${money(difference)}. Corrige el efectivo contado hasta que la diferencia sea S/ 0.00.`);
      $("#closingCash").focus();
      renderCashBox(cashDate);
      return;
    }
    const cashDates = cashOperationDates(cashDate);
    const closureRows = printableRowsForDailyClose(cashDate);
    const closureCsvRows = csvRowsForDailyClose(cashDate);
    session.closingCash = closing;
    session.difference = difference;
    session.incomeTotal = incomeTotal;
    session.expenseTotal = expenseTotal;
    session.closedAt = new Date().toISOString();
    try {
      await closeCashApi({ date: cashDate, includedDates: cashDates, closingCash: closing, closedAt: session.closedAt });
    } catch (error) {
      alert(error.message);
      return;
    }
    state.payments.forEach((payment) => {
      if (cashDates.includes(payment.date)) payment.closed = true;
    });
    state.expenses.forEach((expense) => {
      if (cashDates.includes(expense.date)) expense.closed = true;
    });
    state.cashSessions = state.cashSessions.filter((item) => item.date === cashDate || item.closedAt);
    setPettyCashAllocation(cashDate, 0);
    const existingClosureIndex = state.dailyClosures.findIndex((closure) => closure.date === cashDate);
    const closure = { id: uid("close"), date: cashDate, closedAt: session.closedAt, rows: closureRows, csvRows: closureCsvRows };
    if (existingClosureIndex >= 0) state.dailyClosures[existingClosureIndex] = closure;
    else state.dailyClosures.push(closure);
    if (!API_ENABLED) saveState();
    render();
    printDailyClose(cashDate);
    alert(reviewOnlyClose
      ? `Caja cerrada sin volver a sumar movimientos ya registrados. Diferencia: ${money(session.difference)}`
      : `Caja cerrada. Diferencia: ${money(session.difference)}`);
  });

  $("#openingCash").addEventListener("input", () => renderCashBox());
  $("#closingCash").addEventListener("input", () => renderCashBox());
  $("#cashViewDate")?.addEventListener("change", (event) => {
    selectedCashViewDate = event.target.value || "";
    renderPayments();
    refreshActiveViewApi({ porAccionDelUsuario: true });
  });

  $("#saveExpenseBtn").addEventListener("click", async () => {
    if (!canManageExpenses()) {
      alert("Tu usuario no tiene permiso para registrar egresos.");
      return;
    }
    if (!cashSessionToday()) {
      alert("Primero abre la caja del dia para registrar egresos.");
      return;
    }
    const data = formData($("#expenseForm"));
    if (!data.detail.trim() || Number(data.amount || 0) <= 0) {
      alert("Completa el detalle y el monto del egreso.");
      return;
    }
    const expense = {
      id: uid("exp"),
      date: operatingDate(),
      detail: data.detail.trim(),
      amount: Number(data.amount || 0),
      method: data.method,
      source: data.source,
      receipt: data.receipt
    };
    try {
      await saveExpenseApi(expense);
    } catch (error) {
      alert(error.message);
      return;
    }
    state.expenses.push(expense);
    if (!API_ENABLED) saveState();
    $("#expenseDialog").close();
    render();
  });

  $("#configForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!isAdmin()) {
      alert("Solo el administrador puede cambiar la configuracion.");
      return;
    }
    const data = formData(event.currentTarget);
    const doctors = data.doctors.split(",").map((item) => item.trim()).filter(Boolean);
    const units = data.units.split(",").map((item) => item.trim()).filter(Boolean);
    const serviceNames = data.services.split(",").map((item) => item.trim()).filter(Boolean);
    const previousServices = new Map(state.services.map((service) => [service.name.toLowerCase(), service]));
    state.services = (serviceNames.length ? serviceNames : seedData.services.map((service) => service.name)).map((name) => {
      const existing = previousServices.get(name.toLowerCase()) || seedData.services.find((service) => service.name.toLowerCase() === name.toLowerCase());
      return {
        name,
        category: existing?.category || "General",
        duration: Number(existing?.duration || state.config.interval || 30),
        price: Number(existing?.price || 0),
        active: true
      };
    });
    state.config = {
      ...state.config,
      clinicName: data.clinicName,
      start: data.start,
      end: data.end,
      interval: Number(data.interval),
      inactiveDays: Number(data.inactiveDays),
      enableAgendaPayments: data.enableAgendaPayments === "on",
      whatsapp: data.whatsapp,
      doctors: doctors.length ? doctors : seedData.config.doctors,
      units: units.length ? units : seedData.config.units,
      servicesCustomized: true
    };
    try {
      await saveConfigApi({
        clinicName: state.config.clinicName,
        start: state.config.start,
        end: state.config.end,
        interval: state.config.interval,
        inactiveDays: state.config.inactiveDays,
        enableAgendaPayments: state.config.enableAgendaPayments,
        whatsapp: state.config.whatsapp,
        doctors: state.config.doctors,
        units: state.config.units,
        services: state.services,
        servicesCustomized: state.config.servicesCustomized
      });
    } catch (error) {
      alert(error.message);
      return;
    }
    if (!API_ENABLED) saveState();
    render();
  });

  $("#resetDataBtn").addEventListener("click", () => {
    if (!isAdmin()) return;
    if (!confirm("Se reemplazaran los datos guardados por los datos iniciales. Deseas continuar?")) return;
    state = structuredClone(seedData);
    saveState();
    render();
  });
  $("#blankDataBtn").addEventListener("click", async () => {
    if (!isAdmin()) return;
    if (!confirm("Esto dejara el sistema en cero: sin pacientes, citas, pagos, historiales, caja ni saldos iniciales. Se conservaran configuracion, servicios y usuarios. Deseas continuar?")) return;
    try {
      await resetOperationalApi();
    } catch (error) {
      alert(error.message);
      return;
    }
    state = blankStateFromCurrent();
    if (!API_ENABLED) saveState();
    setView("dashboard");
  });

  $("#backupBtn").addEventListener("click", () => {
    if (!isAdmin()) return;
    download("respaldo-cm-odontologia.json", JSON.stringify(state, null, 2), "application/json");
  });
  $("#restoreInput").addEventListener("change", async (event) => {
    if (!isAdmin()) return;
    const file = event.target.files[0];
    if (!file) return;
    state = JSON.parse(await file.text());
    saveState();
    render();
  });

  $("#exportPatientsBtn").addEventListener("click", () => {
    exportCsv(`pacientes-${todayISO()}.csv`, state.patients.map((patient) => {
      const estado = patientStatus(patient);
      const dias = patient.lastAttended ? daysSince(patient.lastAttended) : null;
      return {
        estado,
        que_falta: queLeFalta(patient, estado, dias),
        proxima_cita: patient.nextAppointment || "",
        ultima_atencion: patient.lastAttended || "",
        dias_sin_venir: dias === null ? "" : dias,
        paciente: patient.name,
        dni: patient.dni,
        celular: patient.phone,
        edad: patientAgeText(patient) || "",
        doctor: patient.doctor,
        tratamiento: patient.mainTreatment,
        saldo: patientDebt(patient.id),
        veces_atendido: patient.totalAppointments ?? "",
        ultima_llamada: patient.contactDate || "",
        resultado_llamada: RESULTADOS_LLAMADA[patient.contactResult] || "",
        comentario_llamada: patient.contactNote || "",
        notas: patient.notes,
        nacimiento: patient.birthDate,
        registrado: patient.createdAt,
        registrado_por: patient.createdByName,
        id: patient.id,
      };
    }));
  });
  $("#patientsToCallTable")?.addEventListener("click", (event) => {
    const boton = event.target.closest("[data-call-patient]");
    if (!boton) return;
    registrarLlamada(boton.dataset.callPatient);
  });
  $("#exportToCallBtn")?.addEventListener("click", () => $("#exportFollowUpBtn")?.click());

  $("#exportFollowUpBtn")?.addEventListener("click", async () => {
    await refreshPatientsToCall();
    const filas = patientsToCall.map((fila) => ({
      motivo: fila.motivo,
      dias: fila.dias ?? "",
      paciente: fila.name,
      celular: fila.phone,
      dni: fila.dni,
      doctor: fila.doctor || "",
      tratamiento: fila.mainTreatment || "",
      ultima_atencion: fila.ultimaAtencion || "",
      ultimo_contacto: fila.ultimoContacto || "",
      saldo: patientDebt(fila.id),
      observaciones: fila.notes || "",
      ultima_llamada: fila.contactDate || "",
      resultado_anterior: RESULTADOS_LLAMADA[fila.contactResult] || "",
      comentario_llamada: fila.contactNote || "",
      llamado: "",
      resultado: "",
    }));
    if (!filas.length) {
      alert("No hay pacientes pendientes de llamar.");
      return;
    }
    exportCsv(`pacientes-por-llamar-${todayISO()}.csv`, filas);
  });

  $("#exportPaymentsBtn").addEventListener("click", () => {
    const cashDate = cashViewDate();
    exportCsv(`pagos-${cashDate}.csv`, visiblePaymentsForCashView(cashDate).map((payment) => ({
      fecha: payment.date || cashDate,
      paciente: patientById(payment.patientId)?.name || "",
      metodo: payment.method,
      monto: Number(payment.amount || 0),
      vuelto: Number(payment.change || 0),
      comprobante: payment.receipt || historyById(payment.historyId)?.reason || ""
    })));
  });
  $("#exportReceivablesBtn").addEventListener("click", () => exportCsv("cuentas-por-cobrar.csv", receivableEntries().map(({ entry, patient, balance, dueDate }) => ({
    fecha_compromiso: dueDate,
    paciente: patient?.name || "",
    telefono: patient?.phone || "",
    doctor: entry.attendedBy || patient?.doctor || "",
    monto_pendiente: balance,
    comentario: entry.creditNote || entry.reason || ""
  }))));
  $("#exportCloseBtn").addEventListener("click", () => {
    const cashDate = cashViewDate();
    exportCsv(`cierre-caja-${cashDate}.csv`, csvRowsForDailyClose(cashDate));
  });
  $("#printCloseBtn").addEventListener("click", () => printDailyClose(cashViewDate()));
  $("#generalCashForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = formData(event.currentTarget);
    const configUpdates = {};
    const cashDate = operatingDate();
    const previousMonthlyOpenings = JSON.parse(JSON.stringify(state.config.monthlyOpenings || {}));
    const previousCashOpening = state.config.generalCashOpening;
    const previousBankOpening = state.config.generalBankOpening;
    const previousUtilityOpening = state.config.generalUtilityOpening;
    const previousPettyAllocation = pettyCashAllocation(cashDate);
    const previousPettyAmount = previousPettyAllocation ? Number(previousPettyAllocation.amount || 0) : null;
    const session = cashSessionToday();
    const previousSessionOpening = session ? session.openingCash : undefined;
    if (isAdmin()) {
      const openingMonth = data.openingMonth || todayISO().slice(0, 7);
      state.config.monthlyOpenings = {
        ...(state.config.monthlyOpenings || {}),
        [openingMonth]: {
          cash: Number(data.cash || 0),
          bank: Number(data.bank || 0)
        }
      };
      if (openingMonth === "2026-06") {
        state.config.generalCashOpening = Number(data.cash || 0);
        state.config.generalBankOpening = Number(data.bank || 0);
        configUpdates.generalCashOpening = state.config.generalCashOpening;
        configUpdates.generalBankOpening = state.config.generalBankOpening;
      }
      state.config.generalUtilityOpening = Number(data.utility || 0);
      configUpdates.monthlyOpenings = state.config.monthlyOpenings;
      configUpdates.generalUtilityOpening = state.config.generalUtilityOpening;
    }
    const pettyAmount = Number(data.pettyCash || 0);
    setPettyCashAllocation(cashDate, pettyAmount);
    if (session) session.openingCash = pettyAmount;
    if (!API_ENABLED) saveState();
    render();
    try {
      await saveConfigApi(configUpdates);
      await savePettyCashApi(cashDate, pettyAmount);
    } catch (error) {
      state.config.monthlyOpenings = previousMonthlyOpenings;
      state.config.generalCashOpening = previousCashOpening;
      state.config.generalBankOpening = previousBankOpening;
      state.config.generalUtilityOpening = previousUtilityOpening;
      if (previousPettyAllocation) previousPettyAllocation.amount = previousPettyAmount;
      else state.pettyCashAllocations = state.pettyCashAllocations.filter((item) => item.date !== cashDate);
      if (session) session.openingCash = previousSessionOpening;
      if (!API_ENABLED) saveState();
      render();
      alert(error.message);
      return;
    }
  });
  $("#generalCashForm").openingMonth?.addEventListener("change", (event) => {
    const form = event.currentTarget.form;
    const opening = monthlyOpening(event.currentTarget.value || todayISO().slice(0, 7));
    form.cash.value = opening.cash;
    form.bank.value = opening.bank;
  });
  $("#suggestUtilityTransferBtn")?.addEventListener("click", () => {
    const form = $("#utilityForm");
    if (!form) return;
    /* El saldo de "billeteras y bancos" son en realidad dos bolsas distintas:
       Yape, Plin y tarjeta por un lado, y transferencia por el otro. Antes se
       sugeria el total de las dos pero se registraba siempre como
       TRANSFERENCIA, asi que si el dinero estaba en Yape el sistema lo
       descontaba de transferencia y dejaba el saldo de Yape intacto: los dos
       medios quedaban descuadrados, uno en negativo y el otro de sobra.
       Ahora se propone una bolsa a la vez, con su propio metodo. */
    const balances = generalCashBalances();
    const bolsas = [
      { metodo: "EFECTIVO", saldo: balances.cash, nombre: "efectivo" },
      { metodo: "YAPE", saldo: balances.wallet, nombre: "Yape y Plin" },
      { metodo: "TRANSFERENCIA", saldo: balances.transfer, nombre: "transferencias" },
      { metodo: "TARJETA", saldo: balances.card, nombre: "tarjeta" },
    ].filter((bolsa) => bolsa.saldo > 0.009);

    if (!bolsas.length) {
      alert("No queda saldo del mes para pasar a utilidad.");
      return;
    }
    const elegida = bolsas[0];
    form.type.value = "APORTE";
    form.method.value = elegida.metodo;
    form.amount.value = elegida.saldo.toFixed(2);
    form.detail.value = `Cierre de mes: traslado a utilidad ${monthLabel(operatingDate().slice(0, 7))}`;
    renderGeneralCash();

    if (bolsas.length > 1) {
      alert(
        `Queda saldo en ${bolsas.length} medios distintos y cada uno se pasa por separado:\n\n` +
        bolsas.map((b) => `  ${b.nombre}: ${money(b.saldo)}`).join("\n") +
        `\n\nSe cargo el de ${elegida.nombre}. Guarda ese movimiento y vuelve a ` +
        `pulsar el boton para el siguiente.`
      );
    }
  });
  /* El metodo depende del movimiento, asi que se rehace al cambiarlo. Si estaba
     puesto EFECTIVO y se pasa a una compra, fillSelect cae a la primera opcion
     que si es valida. */
  $('#utilityForm select[name="type"]')?.addEventListener("change", () => {
    const select = $('#utilityForm select[name="method"]');
    fillSelect(select, utilityMethodOptions(), select?.value);
  });
  $("#utilityForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!isAdmin()) {
      alert("Solo el administrador puede registrar movimientos de utilidad.");
      return;
    }
    const form = event.currentTarget;
    const data = formData(form);
    const amount = Number(data.amount || 0);
    const isPurchase = data.type === "COMPRA";
    if (!data.detail.trim() || amount <= 0) {
      alert("Completa el detalle y un monto mayor a cero.");
      return;
    }
    /* Los saldos se acumulan sumando importe por importe, y esas sumas dejan
       una fraccion invisible: un saldo que en pantalla dice 11 127,60 puede
       valer 11 127,599999999999. Si se compara tal cual, pasar a utilidad el
       sobrante exacto que muestra la pantalla se rechaza por una millonesima
       de centimo. Por eso el dinero se compara en centimos enteros. */
    const centimos = (valor) => Math.round(Number(valor || 0) * 100);

    if (isPurchase && centimos(amount) > centimos(generalCashBalances().utility)) {
      alert("La compra supera la utilidad disponible.");
      return;
    }

    /* Para el aporte se toma el saldo mas favorable entre el periodo corriente
       y el del mes al que pertenece el movimiento. Al cerrar un mes el
       sobrante se registra con fecha del ultimo dia, y no tiene por que quedar
       bloqueado por gastos posteriores que no salieron de ese dinero. */
    const fechaMovimiento = data.date || todayISO();
    const balances = generalCashBalances();
    const balancesDelMes = generalCashBalances({
      from: `${fechaMovimiento.slice(0, 7)}-01`,
      to: fechaMovimiento,
    });
    const disponible = Math.max(
      balances.cash + balances.bank,
      balancesDelMes.cash + balancesDelMes.bank,
    );
    if (!isPurchase && centimos(amount) > centimos(disponible)) {
      alert(
        `El aporte de ${money(amount)} supera lo disponible.\n\n` +
        `Hoy: ${money(balances.cash + balances.bank)}\n` +
        `Al ${formatDate(fechaMovimiento)}: ${money(balancesDelMes.cash + balancesDelMes.bank)}`
      );
      return;
    }
    const expense = {
      id: uid(isPurchase ? "utcompra" : "utaporte"),
      date: data.date || todayISO(),
      detail: data.detail.trim(),
      amount,
      method: data.method || "TRANSFERENCIA",
      source: isPurchase ? "UTILIDAD" : "CAJA_GENERAL",
      category: isPurchase ? "UTILIDAD_COMPRA" : "UTILIDAD_APORTE",
      receipt: isPurchase ? "Compra desde utilidad" : "Aporte a utilidad"
    };
    try {
      await saveExpenseApi(expense);
    } catch (error) {
      alert(error.message);
      return;
    }
    state.expenses.push(expense);
    form.reset();
    form.date.value = todayISO();
    if (!API_ENABLED) saveState();
    render();
  });
  $("#userForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!isAdmin()) {
      alert("Solo el administrador puede crear usuarios.");
      return;
    }
    const data = formData(event.currentTarget);
    const username = data.username.trim();
    const duplicate = state.users.find((user) => user.username.toLowerCase() === username.toLowerCase() && user.id !== data.id);
    if (duplicate) {
      alert("Ese nombre de usuario ya existe.");
      return;
    }
    const existing = state.users.find((user) => user.id === data.id);
    if (!existing && !data.password) {
      alert("Ingresa una contrasena para crear el usuario.");
      return;
    }
    const user = {
      id: data.id || uid("user"),
      name: data.name.trim(),
      username,
      password: data.password || existing?.password || "",
      role: data.role,
      active: data.active === "on"
    };
    if (existing?.id === "u-admin") user.active = true;
    try {
      await saveUserApi(user);
    } catch (error) {
      alert(error.message);
      return;
    }
    user.password = "";
    upsert(state.users, user);
    event.currentTarget.reset();
    event.currentTarget.active.checked = true;
    if (!API_ENABLED) saveState();
    render();
  });
  $("#clearUserFormBtn").addEventListener("click", () => {
    const form = $("#userForm");
    form.reset();
    form.id.value = "";
    form.active.checked = true;
  });
  $("#usersTable").addEventListener("click", (event) => {
    if (!isAdmin()) return;
    const edit = event.target.closest("[data-edit-user]");
    const toggle = event.target.closest("[data-toggle-user]");
    if (edit) {
      const user = state.users.find((item) => item.id === edit.dataset.editUser);
      const form = $("#userForm");
      form.id.value = user.id;
      form.name.value = user.name;
      form.username.value = user.username;
      form.password.value = "";
      form.role.value = user.role;
      form.active.checked = user.active;
    }
    if (toggle) {
      const user = state.users.find((item) => item.id === toggle.dataset.toggleUser);
      if (!user || user.id === "u-admin") return;
      const previous = user.active;
      user.active = !user.active;
      saveUserApi(user).catch((error) => {
        user.active = previous;
        alert(error.message);
        render();
      });
      if (!API_ENABLED) saveState();
      render();
    }
  });
  $("#staffPaymentForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.dataset.saving === "1") return;
    const submitButton = form.querySelector('button[type="submit"]');
    const previousText = submitButton?.textContent || "Guardar pago";
    form.dataset.saving = "1";
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Guardando...";
    }
    const data = formData(form);
    const amount = Number(data.amount || 0);
    if (!data.person.trim() || !data.detail.trim() || amount <= 0) {
      alert("Completa la persona, el detalle y un monto mayor a cero.");
      delete form.dataset.saving;
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = previousText;
      }
      return;
    }
    const normalizedPerson = data.person.trim().toUpperCase();
    const normalizedDetail = data.detail.trim().toUpperCase();
    const duplicate = state.expenses.find((expense) =>
      expense.category === "PERSONAL_TERCERO" &&
      expense.date === (data.date || todayISO()) &&
      String(expense.person || "").toUpperCase() === normalizedPerson &&
      String(expense.detail || "").toUpperCase() === normalizedDetail &&
      String(expense.method || "").toUpperCase() === String(data.method || "").toUpperCase() &&
      cents(expense.amount) === cents(amount)
    );
    if (duplicate && !confirm("Ya existe un pago igual registrado en esa fecha. Deseas guardarlo nuevamente?")) {
      delete form.dataset.saving;
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = previousText;
      }
      return;
    }
    const expense = {
      id: uid("staff"),
      date: data.date || todayISO(),
      person: normalizedPerson,
      type: data.type || "OTRO",
      detail: data.detail.trim(),
      amount,
      method: data.method,
      source: "CAJA_GENERAL",
      category: "PERSONAL_TERCERO",
      receipt: "Pago personal / tercero"
    };
    try {
      await saveExpenseApi(expense);
    } catch (error) {
      alert(error.message);
      delete form.dataset.saving;
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = previousText;
      }
      return;
    }
    state.expenses.push(expense);
    form.reset();
    form.date.value = todayISO();
    delete form.dataset.saving;
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = previousText;
    }
    if (!API_ENABLED) saveState();
    render();
  });
  $("#exportGeneralBtn").addEventListener("click", () => {
    const rows = generalSummaryDates().slice().reverse().map((date) => ({
      fecha: date,
      ingresos: incomeForDate(date),
      egresos_operativos: dailyExpenseTotal(date),
      egresos_caja_general: dailyGeneralExpenseTotal(date),
      aportes_utilidad: state.expenses.filter((expense) => expense.date === date && isUtilityContribution(expense)).reduce((sum, expense) => sum + Number(expense.amount || 0), 0),
      compras_utilidad: state.expenses.filter((expense) => expense.date === date && isUtilityPurchase(expense)).reduce((sum, expense) => sum + Number(expense.amount || 0), 0),
      neto: incomeForDate(date) - dailyExpenseTotal(date) - dailyGeneralExpenseTotal(date) - utilityContributionTotalForDate(date)
    }));
    exportCsv("caja-general.csv", rows);
  });
  $("#openCashPeriodBtn")?.addEventListener("click", openCashPeriodDialog);
  const applyCashTitleMonth = (event) => {
    if (event.target.value) openCashPeriodForMonth(event.target.value);
  };
  $("#cashTitleMonthPicker")?.addEventListener("input", applyCashTitleMonth);
  $("#cashTitleMonthPicker")?.addEventListener("change", applyCashTitleMonth);
  const applyCashTitleRange = () => {
    const from = $("#cashTitleFrom")?.value;
    const to = $("#cashTitleTo")?.value;
    if (from && to) openCashPeriodForDateRange(from, to);
  };
  $("#cashTitleFrom")?.addEventListener("change", applyCashTitleRange);
  $("#cashTitleTo")?.addEventListener("change", applyCashTitleRange);
  /* Los dos campos son la misma cuenta vista al reves: el banco puede informar
     el deposito o la comision, y se escriba el que se escriba el otro sale
     solo, para no obligar a sacar la resta a mano. */
  const sincronizarComision = (origen) => {
    const form = $("#cardFeeForm");
    if (!form) return;
    const month = form.month.value || "";
    const neto = cardChargedForMonth(month) - cardFeeTotalForMonth(month);
    if (origen === "deposited") {
      const depositado = form.deposited.value;
      form.fee.value = depositado === "" ? "" : Math.max(0, neto - Number(depositado || 0)).toFixed(2);
    } else {
      const comision = form.fee.value;
      form.deposited.value = comision === "" ? "" : Math.max(0, neto - Number(comision || 0)).toFixed(2);
    }
  };
  $('#cardFeeForm [name="deposited"]')?.addEventListener("input", () => sincronizarComision("deposited"));
  $('#cardFeeForm [name="fee"]')?.addEventListener("input", () => sincronizarComision("fee"));
  $('#cardFeeForm [name="month"]')?.addEventListener("change", () => {
    const form = $("#cardFeeForm");
    form.deposited.value = "";
    form.fee.value = "";
    renderCardFees();
  });

  $("#cardFeeForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!isAdmin()) {
      alert("Solo el administrador puede registrar comisiones de tarjeta.");
      return;
    }
    const form = event.currentTarget;
    const month = form.month.value || "";
    if (!month) {
      alert("Elige el mes que quieres cuadrar.");
      return;
    }
    const comision = Number(form.fee.value || 0);
    if (comision <= 0) {
      alert("Pon lo que depositó el banco, o la comisión directamente, para calcular la diferencia.");
      return;
    }
    const cobrado = cardChargedForMonth(month);
    const neto = cobrado - cardFeeTotalForMonth(month);
    const centimos = (valor) => Math.round(Number(valor || 0) * 100);
    if (centimos(comision) > centimos(neto)) {
      alert(`La comisión de ${money(comision)} supera lo que queda por cuadrar de ${monthLabel(month)}, que es ${money(neto)}.`);
      return;
    }
    const depositado = neto - comision;
    if (!confirm(
      `Cuadrar ${monthLabel(month)}:\n\n` +
      `  Cobrado con tarjeta: ${money(cobrado)}\n` +
      `  Comisión del banco: ${money(comision)}\n` +
      `  Queda en tarjeta: ${money(depositado)}\n\n` +
      `Se registra la comisión como egreso del ${formatDate(cardFeeDateForMonth(month))}.`
    )) return;

    const expense = {
      id: uid("exp"),
      date: cardFeeDateForMonth(month),
      detail: `Comisión de tarjeta ${monthLabel(month)}`,
      amount: comision,
      method: "TARJETA",
      source: "CAJA_GENERAL",
      category: "COMISION_TARJETA",
      receipt: ""
    };
    try {
      await saveExpenseApi(expense);
    } catch (error) {
      alert(error.message);
      return;
    }
    state.expenses.push(expense);
    if (!API_ENABLED) saveState();
    form.deposited.value = "";
    form.fee.value = "";
    render();
  });

  $("#cardFeeTable")?.addEventListener("click", async (event) => {
    const boton = event.target.closest("[data-delete-card-fee]");
    if (!boton || !isAdmin()) return;
    const mes = boton.dataset.deleteCardFee;
    const comisiones = cardFeesForMonth(mes);
    if (!comisiones.length) return;
    if (!confirm(`¿Eliminar la comisión de ${monthLabel(mes)} por ${money(cardFeeTotalForMonth(mes))}? El saldo de tarjeta vuelve a subir.`)) return;
    for (const expense of comisiones) {
      try {
        await deleteExpenseApi(expense.id);
      } catch (error) {
        alert(error.message);
        return;
      }
      state.expenses = state.expenses.filter((item) => item.id !== expense.id);
    }
    if (!API_ENABLED) saveState();
    render();
  });

  $("#exportCardFeeBtn")?.addEventListener("click", () => {
    const meses = [...new Set(state.expenses.filter(isCardFee).map(cardFeeMonth))]
      .filter(Boolean)
      .sort()
      .reverse();
    exportCsv("comisiones-tarjeta.csv", meses.map((mes) => {
      const comision = cardFeeTotalForMonth(mes);
      const cobrado = cardChargedForMonth(mes);
      return {
        mes,
        cobrado_por_tarjeta: cobrado,
        comision: -comision,
        depositado: cobrado - comision,
        porcentaje: cobrado > 0 ? Number((comision / cobrado * 100).toFixed(2)) : 0
      };
    }));
  });

  $("#exportUtilityBtn")?.addEventListener("click", () => {
    exportCsv("movimientos-utilidad.csv", utilityMovements().map((item) => ({
      fecha: item.date,
      movimiento: isUtilityPurchase(item) ? "COMPRA" : "APORTE",
      metodo: item.method,
      monto: isUtilityPurchase(item) ? -Number(item.amount || 0) : Number(item.amount || 0),
      detalle: item.detail,
      comprobante: item.receipt || ""
    })));
  });
  $("#generalSummaryFrom")?.addEventListener("change", renderGeneralCash);
  $("#generalSummaryTo")?.addEventListener("change", renderGeneralCash);
  $("#exportReceiptsBtn")?.addEventListener("click", () => {
    exportCsv("comprobantes-internos.csv", state.electronicReceipts.map((receipt) => ({
      fecha: receipt.issueDate,
      tipo: receipt.type,
      serie: receipt.series,
      numero: receipt.number,
      comprobante: receiptFullNumber(receipt),
      cliente_documento: receipt.customerDoc,
      cliente_nombre: receipt.customerName,
      descripcion: receipt.description,
      condicion: receipt.taxCondition,
      igv: receipt.igv,
      total: receipt.total,
      estado: receipt.status,
      estado_sunat: receipt.sunatEstado || "",
      respuesta_sunat: receipt.sunatDescripcion || ""
    })));
  });
  $("#refreshReceiptsBtn")?.addEventListener("click", async () => {
    try {
      await refreshElectronicReceiptsApi();
      await refreshSunatStatus();
    } catch (error) {
      alert(error.message);
    }
    renderElectronicReceipts();
  });
  $("#sendSunatSummaryBtn")?.addEventListener("click", enviarResumenDiarioDeBoletas);
  $("#checkSunatSummaryBtn")?.addEventListener("click", revisarResumenesSunat);
  /* Al cambiar el ancho de la ventana cambia el espacio de cada tarjeta, asi
     que las cifras se vuelven a medir. */
  let recalculoDeCifras = null;
  window.addEventListener("resize", () => {
    clearTimeout(recalculoDeCifras);
    recalculoDeCifras = setTimeout(ajustarCifrasDeSaldo, 120);
  });

  $("#staffPaymentMonth")?.addEventListener("change", (event) => {
    /* Marcar que la eleccion es suya: sin esto, cada refresco volveria al mes
       mas reciente y le quitaria de la vista el mes que esta mirando. */
    event.currentTarget.dataset.tocado = "1";
    renderStaffPayments();
  });
  $("#exportStaffPaymentsBtn").addEventListener("click", () => {
    const mes = selectedStaffPaymentMonth();
    const nombre = mes ? `pagos-personal-terceros-${mes}.csv` : "pagos-personal-terceros.csv";
    exportCsv(nombre, staffPaymentsForSelectedMonth().map((payment) => ({
      fecha: payment.date,
      persona: payment.person,
      tipo: payment.type,
      metodo: payment.method,
      origen: payment.source,
      monto: -Number(payment.amount || 0),
      detalle: payment.detail
    })));
  });
  $("#exportCampaignBtn").addEventListener("click", () => exportCsv("campanas.csv", state.patients.map((patient) => ({ nombre: patient.name, telefono: patient.phone, estado: patientStatus(patient), saldo: patientDebt(patient.id) }))));

  $("#exportPromoBtn")?.addEventListener("click", async () => {
    let promociones = [];
    try {
      promociones = (await apiFetch("/api/patients-to-call")).promotions || [];
    } catch (error) {
      return alert(error.message);
    }
    const filas = promociones.map((fila) => ({
      segmento: fila.segmento,
      meses_sin_venir: fila.meses,
      paciente: fila.name,
      celular: fila.phone,
      dni: fila.dni,
      tratamiento: fila.mainTreatment || "",
      ultima_atencion: fila.ultimaAtencion || "",
      doctor: fila.doctor || "",
      saldo: patientDebt(fila.id),
      tiene_deuda: patientDebt(fila.id) > 0 ? "SI" : "NO",
    }));
    if (!filas.length) {
      alert("No hay pacientes inactivos para promocionar.");
      return;
    }
    exportCsv(`promociones-inactivos-${todayISO()}.csv`, filas);
  });
  $("#exportAgendaDayBtn").addEventListener("click", exportAgendaDay);
  $("#exportAgendaFutureBtn").addEventListener("click", exportFutureAgenda);
  $("#exportRemindersBtn").addEventListener("click", () => exportCsv("recordatorios.csv", state.appointments.filter((appointment) => appointment.date >= todayISO()).map((appointment) => ({ fecha: appointment.date, hora: appointment.time, paciente: patientById(appointment.patientId)?.name, telefono: patientById(appointment.patientId)?.phone, servicio: appointment.service, doctor: appointment.doctor, estado: appointment.status }))));
  $("#exportReportsBtn").addEventListener("click", () => {
    const month = $("#reportMonth").value || todayISO().slice(0, 7);
    const metrics = reportMetrics(month);
    const rows = [
      { seccion: "RESUMEN", indicador: "Ingresos", mes: month, monto: metrics.income },
      { seccion: "RESUMEN", indicador: "Gastos compras", mes: month, monto: -metrics.purchaseExpenses },
      { seccion: "RESUMEN", indicador: "Compras con utilidad", mes: month, monto: -metrics.utilityPurchases },
      { seccion: "RESUMEN", indicador: "Pagos a terceros", mes: month, monto: -metrics.staffExpenses },
      { seccion: "RESUMEN", indicador: "Pacientes nuevos", mes: month, cantidad: metrics.newPatients.length },
      { seccion: "RESUMEN", indicador: "Pacientes nuevos recepción", mes: month, cantidad: metrics.receptionNewPatients.length },
      { seccion: "RESUMEN", indicador: "Pacientes antiguos", mes: month, cantidad: metrics.oldPatients },
      { seccion: "RESUMEN", indicador: "Pacientes inactivos", mes: month, cantidad: metrics.inactivePatients },
      ...dailyIncomeBreakdownRows(month).map((row) => ({
        seccion: "INGRESOS POR DIA",
        fecha: row.date,
        bruto: row.gross,
        efectivo: row.cash,
        yape: row.yape,
        plin: row.plin,
        transferencia: row.transfer,
        tarjeta: row.card,
        egresos_operativos: row.operationalExpenses,
        egresos_operativos_efectivo: row.operationalExpenseMethods.cash,
        egresos_operativos_yape: row.operationalExpenseMethods.yape,
        egresos_operativos_plin: row.operationalExpenseMethods.plin,
        egresos_operativos_transferencia: row.operationalExpenseMethods.transfer,
        egresos_operativos_tarjeta: row.operationalExpenseMethods.card,
        egresos_caja_general: row.generalExpenses,
        egresos_caja_general_efectivo: row.generalExpenseMethods.cash,
        egresos_caja_general_yape: row.generalExpenseMethods.yape,
        egresos_caja_general_plin: row.generalExpenseMethods.plin,
        egresos_caja_general_transferencia: row.generalExpenseMethods.transfer,
        egresos_caja_general_tarjeta: row.generalExpenseMethods.card,
        a_utilidad: row.utilityTransfer,
        neto: row.net
      })),
      ...monthlyCareData(month).map((item) => ({ seccion: "ATENCIONES_MENSUALES", mes: item.month, cantidad: item.count })),
      ...metrics.ageGroups.map((item) => ({ seccion: "EDAD", grupo: item.group, mes: month, cantidad: item.count })),
      ...state.config.doctors.map((doctor) => ({
        seccion: "DOCTOR",
        doctor,
        pacientes_asignados: state.patients.filter((patient) => patient.doctor === doctor).length,
        pacientes_nuevos_mes: metrics.newPatients.filter((patient) => patient.doctor === doctor).length,
        citas_mes: metrics.appointments.filter((appointment) => appointment.doctor === doctor).length,
        atendidas_mes: metrics.appointments.filter((appointment) => appointment.doctor === doctor && appointment.status === "ATENDIDA").length
      })),
      ...metrics.appointments.map((appointment) => ({
        seccion: "CITA",
        fecha: appointment.date,
        hora: appointment.time,
        paciente: patientById(appointment.patientId)?.name,
        servicio: appointment.service,
        doctor: appointment.doctor,
        estado: appointment.status
      }))
    ];
    exportCsv("reporte-mensual.csv", rows);
  });
  $("#exportDailyIncomeBreakdownBtn")?.addEventListener("click", () => {
    const month = $("#reportMonth").value || todayISO().slice(0, 7);
    const rows = dailyIncomeBreakdownRows(month).map((row) => ({
      fecha: row.date,
      bruto: row.gross,
      efectivo: row.cash,
      yape: row.yape,
      plin: row.plin,
      transferencia: row.transfer,
      tarjeta: row.card,
      egresos_operativos: row.operationalExpenses,
      egresos_operativos_efectivo: row.operationalExpenseMethods.cash,
      egresos_operativos_yape: row.operationalExpenseMethods.yape,
      egresos_operativos_plin: row.operationalExpenseMethods.plin,
      egresos_operativos_transferencia: row.operationalExpenseMethods.transfer,
      egresos_operativos_tarjeta: row.operationalExpenseMethods.card,
      egresos_caja_general: row.generalExpenses,
      egresos_caja_general_efectivo: row.generalExpenseMethods.cash,
      egresos_caja_general_yape: row.generalExpenseMethods.yape,
      egresos_caja_general_plin: row.generalExpenseMethods.plin,
      egresos_caja_general_transferencia: row.generalExpenseMethods.transfer,
      egresos_caja_general_tarjeta: row.generalExpenseMethods.card,
      a_utilidad: row.utilityTransfer,
      neto: row.net
    }));
    exportCsv(`ingresos-por-dia-${month}.csv`, rows);
  });
}

function init() {
  if (API_ENABLED && apiSessionExpired()) clearApiSession();
  $("#agendaDate").value = todayISO();
  $('#paymentForm input[name="date"]').value = operatingDate();
  $('#historyForm input[name="date"]').value = todayISO();
  $('#staffPaymentForm input[name="date"]').value = todayISO();
  $('#utilityForm input[name="date"]').value = todayISO();
  /* Las comisiones se cuadran cuando el banco ya informo el mes completo, o sea
     sobre el mes pasado. */
  const campoMesComision = $('#cardFeeForm input[name="month"]');
  if (campoMesComision && !campoMesComision.value) {
    campoMesComision.value = previousMonth(todayISO().slice(0, 7));
  }
  $("#reportMonth").value = todayISO().slice(0, 7);
  $("#compareMonth").value = previousMonth($("#reportMonth").value);
  bindEvents();
  setupApiAutoRefresh();
  render();
  if (API_ENABLED && apiToken) loadFromApi();
}

if ("serviceWorker" in navigator && location.protocol === "https:") {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  });
}

try {
  init();
} catch (error) {
  console.error(error);
  document.body.classList.add("locked");
  const message = $("#loginMessage");
  if (message) message.textContent = "No se pudo cargar la pantalla. Actualiza la pagina o borra cache si el problema continua.";
}
