const STORAGE_KEY = "cm-dental-system-v3";
const API_TOKEN_KEY = `${STORAGE_KEY}-api-token`;
const API_ENABLED = location.protocol === "http:" || location.protocol === "https:";

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
    generalCashOpening: 9000,
    generalBankOpening: 10000,
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
  clinicalHistory: [
    { id: "h1", patientId: "p1", date: "2026-05-15", attendedBy: "Maghy", attended: true, reason: "Control de ortodoncia", anamnesis: "Sin cambios relevantes.", exam: "Higiene regular.", diagnosis: "Evolucion favorable", plan: "Continuar controles.", procedure: "Cambio de ligas y revision de brackets.", instructions: "Mantener higiene y volver en 30 dias.", agreedPrice: 80 },
    { id: "h2", patientId: "p2", date: "2026-05-15", attendedBy: "Maghy", attended: true, reason: "Consulta inicial", anamnesis: "Niega alergias.", exam: "Evaluacion intraoral inicial.", diagnosis: "Evaluacion pendiente", plan: "Solicitar radiografia.", procedure: "Revision clinica general.", instructions: "Tomar radiografia panoramica.", agreedPrice: 50 }
  ],
  odontogram: [
    { patientId: "p1", tooth: "11", condition: "Obturado", note: "Control ortodontico" },
    { patientId: "p1", tooth: "26", condition: "Cariado", note: "Revisar restauracion" },
    { patientId: "p2", tooth: "36", condition: "Cariado", note: "Programar curacion" }
  ],
  cashSessions: [],
  dailyClosures: [],
  expenses: [],
  pettyCashAllocations: [],
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
let apiUser = null;
let apiBootstrapped = false;
let apiRefreshing = false;
let patientSaving = false;
let historySaving = false;
let paymentSaving = false;
let forcedPaymentHistoryId = "";
let lastSavedPatientId = "";
let patientEditingId = "";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return normalizeState(structuredClone(seedData));
  try {
    const base = structuredClone(seedData);
    const parsed = JSON.parse(saved);
    const merged = { ...base, ...parsed, config: { ...base.config, ...(parsed.config || {}) } };
    for (const key of ["services", "patients", "appointments", "treatments", "payments", "clinicalHistory", "odontogram", "cashSessions", "dailyClosures", "expenses", "pettyCashAllocations", "users"]) {
      if (!Array.isArray(merged[key])) merged[key] = base[key];
    }
    return normalizeState(merged);
  } catch {
    return normalizeState(structuredClone(seedData));
  }
}

function normalizeState(data) {
  const defaults = seedData.config;
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
  if (!Array.isArray(data.users) || !data.users.length) data.users = structuredClone(seedData.users);
  if (!Array.isArray(data.pettyCashAllocations)) data.pettyCashAllocations = [];
  data.users = data.users.map((user, index) => ({
    id: user.id || uid("user"),
    name: String(user.name || user.username || `Usuario ${index + 1}`).trim(),
    username: String(user.username || "").trim(),
    password: String(user.password || ""),
    role: ["ADMIN", "DOCTOR", "RECEPCION"].includes(user.role) ? user.role : "RECEPCION",
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
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(apiToken ? { Authorization: `Bearer ${apiToken}` } : {}),
      ...(options.headers || {})
    }
  });
  const payload = await response.json().catch(() => ({}));
  if (response.status === 401) {
    localStorage.removeItem(API_TOKEN_KEY);
    apiToken = "";
    throw new Error("Sesion vencida. Cierra sesion e ingresa nuevamente.");
  }
  if (!response.ok) throw new Error(payload.error || "No se pudo conectar con el servidor.");
  return payload;
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
    notes: row.notes || "",
    createdAt: (row.created_at || "").slice(0, 10)
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
    notes: row.notes || ""
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
    creditNote: row.credit_note || row.creditNote || ""
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
    note: row.note || ""
  };
}

function mapApiPayment(row) {
  return {
    id: row.id,
    patientId: row.patient_id || row.patientId,
    historyId: row.history_id || row.historyId || "",
    date: row.date,
    amount: Number(row.amount || 0),
    cashReceived: Number(row.cash_received ?? row.cashReceived ?? 0),
    change: Number(row.change_amount ?? row.change ?? 0),
    method: row.method,
    receipt: row.receipt || "",
    closed: Boolean(row.closed)
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
  state.payments = (payload.payments || []).map(mapApiPayment);
  state.expenses = (payload.expenses || []).map(mapApiExpense);
  state.cashSessions = (payload.cashSessions || []).map(mapApiCashSession);
  state.pettyCashAllocations = (payload.pettyCashAllocations || []).map(mapApiPettyCash);
  if (Array.isArray(payload.users) && payload.users.length) {
    state.users = payload.users.map(mapApiUser);
  }
  if (payload.config) {
    state.config.generalCashOpening = Number(payload.config.generalCashOpening ?? state.config.generalCashOpening);
    state.config.generalBankOpening = Number(payload.config.generalBankOpening ?? state.config.generalBankOpening);
    state.config.clinicName = payload.config.clinicName || state.config.clinicName;
    state.config.start = payload.config.start || state.config.start;
    state.config.end = payload.config.end || state.config.end;
    state.config.interval = Number(payload.config.interval ?? state.config.interval);
    state.config.inactiveDays = Number(payload.config.inactiveDays ?? state.config.inactiveDays);
    state.config.whatsapp = payload.config.whatsapp || state.config.whatsapp;
    state.config.doctors = parseApiList(payload.config.doctors, state.config.doctors);
    state.config.units = parseApiList(payload.config.units, state.config.units);
    if (payload.config.services) {
      state.services = parseApiServices(payload.config.services, state.services);
      state.config.servicesCustomized = true;
    } else {
      state = normalizeState(state);
    }
  }
  apiUser = payload.user || apiUser;
  if (apiUser) currentUserId = apiUser.id;
  apiBootstrapped = true;
  render();
}

async function loadFromApi() {
  if (!API_ENABLED || !apiToken || apiRefreshing) return;
  apiRefreshing = true;
  try {
    const payload = await apiFetch("/api/bootstrap");
    applyApiBootstrap(payload);
  } catch {
    apiToken = "";
    apiUser = null;
    localStorage.removeItem(API_TOKEN_KEY);
    render();
  } finally {
    apiRefreshing = false;
  }
}

function shouldAutoRefreshApi() {
  if (!API_ENABLED || !apiToken) return false;
  if (document.hidden) return false;
  if ($("dialog[open]")) return false;
  const active = document.activeElement;
  if (!active) return true;
  return !["INPUT", "TEXTAREA", "SELECT"].includes(active.tagName);
}

function setupApiAutoRefresh() {
  if (!API_ENABLED) return;
  window.addEventListener("focus", () => {
    if (apiToken) loadFromApi();
  });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && apiToken) loadFromApi();
  });
  setInterval(() => {
    if (shouldAutoRefreshApi()) loadFromApi();
  }, 8000);
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
    notes: patient.notes
  };
  const result = await apiFetch("/api/patients", { method: "POST", body: JSON.stringify(payload) });
  if (result.id) patient.id = result.id;
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

async function savePaymentApi(payment) {
  if (!API_ENABLED || !apiToken) return;
  const result = await apiFetch("/api/payments", { method: "POST", body: JSON.stringify(payment) });
  if (result.id) payment.id = result.id;
}

async function deletePaymentApi(id) {
  if (!API_ENABLED || !apiToken) return;
  await apiFetch("/api/payments", { method: "POST", body: JSON.stringify({ id, delete: true }) });
}

async function saveExpenseApi(expense) {
  if (!API_ENABLED || !apiToken) return;
  const result = await apiFetch("/api/expenses", { method: "POST", body: JSON.stringify(expense) });
  if (result.id) expense.id = result.id;
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
      generalBankOpening: 0
    },
    services: structuredClone(state.services.length ? state.services : seedData.services),
    users: structuredClone(state.users.length ? state.users : seedData.users),
    patients: [],
    appointments: [],
    treatments: [],
    payments: [],
    clinicalHistory: [],
    odontogram: [],
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

function utcTodayISO() {
  return new Date().toISOString().slice(0, 10);
}

function operatingDate() {
  const openSession = state.cashSessions
    .filter((session) => !session.closedAt)
    .sort((a, b) => String(b.openedAt || "").localeCompare(String(a.openedAt || "")))[0];
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
  return new Date(`${date}T00:00:00`).toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" });
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
  return age === null ? "" : `${age} anos`;
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
  const treatmentPaid = state.payments.filter((p) => p.patientId === patientId && !p.historyId).reduce((sum, p) => sum + Number(p.amount || 0), 0);
  return Math.max(0, budget - treatmentPaid) + historyDebt;
}

function historyById(id) {
  return state.clinicalHistory.find((entry) => entry.id === id);
}

function historyPaid(historyId) {
  return state.payments.filter((payment) => payment.historyId === historyId).reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
}

function historyBalance(historyId) {
  const entry = historyById(historyId);
  if (!entry) return 0;
  return Math.max(0, Number(entry.agreedPrice || 0) - historyPaid(historyId));
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

function cashSessionToday() {
  const date = operatingDate();
  return state.cashSessions
    .filter((session) => session.date === date && !session.closedAt)
    .slice(-1)[0];
}

function cashSessionsToday() {
  return state.cashSessions.filter((session) => session.date === operatingDate());
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

function pettyCashDeliveredTotal() {
  const dates = [...new Set([
    ...state.pettyCashAllocations.map((item) => item.date),
    ...state.cashSessions.map((session) => session.date)
  ])];
  return dates.reduce((sum, date) => {
    const session = state.cashSessions.filter((item) => item.date === date).slice(-1)[0];
    if (session?.closedAt) return sum;
    return sum + Number(session?.openingCash ?? pettyCashAmount(date) ?? 0);
  }, 0);
}

function incomeForDate(date, method = null) {
  return state.payments
    .filter((payment) => payment.date === date && (!method || payment.method === method))
    .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
}

function openIncomeForDate(date, method = null) {
  return openPaymentsForDate(date)
    .filter((payment) => !method || payment.method === method)
    .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
}

function todayIncome(method = null) {
  return openIncomeForDate(operatingDate(), method);
}

function incomeByMethodsForDate(date, methods) {
  const normalized = methods.map((method) => method.toUpperCase());
  return openPaymentsForDate(date)
    .filter((payment) => normalized.includes(String(payment.method || "").toUpperCase()))
    .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
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

function expenseAffectsDaily(expense) {
  return expense.source !== "CAJA_GENERAL";
}

function dailyExpenseTotal(date, includeGeneral = false) {
  return expensesForDate(date)
    .filter((expense) => includeGeneral || expenseAffectsDaily(expense))
    .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
}

function dailyGeneralExpenseTotal(date) {
  return expensesForDate(date)
    .filter((expense) => expense.source === "CAJA_GENERAL")
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

function patientStatus(patient) {
  const last = lastAppointment(patient.id);
  if (!last) return "NUEVO";
  const diff = Math.floor((new Date() - new Date(`${last.date}T00:00:00`)) / 86400000);
  return diff > Number(state.config.inactiveDays) ? "INACTIVO" : "ACTIVO";
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
  const ids = pendingPatientIds();
  const patients = state.patients
    .filter((patient) => ids.includes(patient.id))
    .sort((a, b) => a.name.localeCompare(b.name));
  select.innerHTML = patients.length
    ? patients.map((patient) => `<option value="${patient.id}">${escapeHtml(patient.name)} - deuda ${money(patientDebt(patient.id))}</option>`).join("")
    : `<option value="">Sin pacientes pendientes</option>`;
  if (selected && patients.some((patient) => patient.id === selected)) select.value = selected;
  else if (patients[0]) select.value = patients[0].id;
}

function fillAppointmentPatientSelectForDate(select, date, selected = "") {
  if (!select) return;
  const historyCountByPatient = state.clinicalHistory
    .filter((entry) => entry.date === date && entry.attended && entry.id !== $("#historyForm")?.id?.value)
    .reduce((map, entry) => {
      map[entry.patientId] = (map[entry.patientId] || 0) + 1;
      return map;
    }, {});
  const appointmentCountByPatient = state.appointments
    .filter((appointment) => appointment.date === date && !["CANCELADA", "REPROGRAMADA"].includes(appointment.status))
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

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
}

const roleLabels = {
  ADMIN: "Administrador",
  DOCTOR: "Doctor",
  RECEPCION: "Recepcion"
};

const roleViews = {
  ADMIN: ["dashboard", "pacientes", "agenda", "historial", "odontograma", "tratamientos", "pagos", "caja-general", "cuentas-cobrar", "panel", "recordatorios", "reportes", "campanas", "configuracion"],
  DOCTOR: ["dashboard", "pacientes", "agenda", "historial", "odontograma", "tratamientos", "pagos", "caja-general", "cuentas-cobrar", "panel", "recordatorios", "reportes", "campanas"],
  RECEPCION: ["dashboard", "pacientes", "agenda", "pagos", "cuentas-cobrar", "panel", "recordatorios"]
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

function canManageAppointments() {
  return ["ADMIN", "DOCTOR", "RECEPCION"].includes(currentUser()?.role);
}

function canManageClinical() {
  return ["ADMIN", "DOCTOR"].includes(currentUser()?.role);
}

function canManagePayments() {
  return ["ADMIN", "DOCTOR", "RECEPCION"].includes(currentUser()?.role);
}

function canManageExpenses() {
  return ["ADMIN", "RECEPCION"].includes(currentUser()?.role);
}

function canManageCash() {
  return ["ADMIN", "RECEPCION"].includes(currentUser()?.role);
}

function canCreatePatients() {
  return ["ADMIN", "DOCTOR", "RECEPCION"].includes(currentUser()?.role);
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
  if (quickAppointmentBtn) quickAppointmentBtn.hidden = !canManageAppointments();
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
  $("#viewTitle").textContent = {
    dashboard: "Dashboard",
    agenda: "Agenda diaria",
    pacientes: "Registrar paciente",
    historial: "Historial clinico dental",
    odontograma: "Odontograma",
    tratamientos: "Tratamientos",
    pagos: "Pagos y caja",
    "caja-general": "Caja general",
    "cuentas-cobrar": "Cuentas por cobrar",
    panel: "Panel para doctores y recepcion",
    recordatorios: "Recordatorios de citas",
    reportes: "Reportes diarios y mensuales",
    campanas: "Campanas",
    configuracion: "Configuracion"
  }[view];
  render();
}

function render() {
  state = normalizeState(state);
  applyAuthState();
  if (!currentUser()) return;
  const todayLabel = $("#todayLabel");
  if (todayLabel) todayLabel.textContent = `${state.config.clinicName} | ${formatDate(todayISO())}`;
  hydrateForms();
  renderDashboard();
  renderAgenda();
  renderPatients();
  renderClinicalHistory();
  renderOdontogram();
  renderTreatments();
  renderPayments();
  renderGeneralCash();
  renderReceivables();
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
  $$('select[name="method"]').forEach((select) => fillSelect(select, state.config.paymentMethods, select.value));
  $$('select[name="source"]').forEach((select) => fillSelect(select, state.config.expenseSources, select.value));
  $$('#staffPaymentForm select[name="type"]').forEach((select) => fillSelect(select, state.config.staffPaymentTypes, select.value));
  $$('select[name="attendedBy"]').forEach((select) => fillSelect(select, state.config.doctors, select.value));
  $$('select[name="patientId"]').forEach((select) => {
    if (select.closest("#paymentForm")) return;
    if (select.closest("#historyForm")) return;
    fillPatientSelect(select, select.value);
  });
  fillAppointmentPatientSelectForDate($('#historyForm select[name="patientId"]'), $('#historyForm input[name="date"]')?.value || todayISO(), $('#historyForm select[name="patientId"]')?.value || "");
  fillPaymentPatientSelect($('#paymentForm select[name="patientId"]'), $('#paymentForm select[name="patientId"]')?.value || "");
  fillPatientSelect($("#historyPatientFilter"), $("#historyPatientFilter").value);
  fillPatientSelect($("#odontogramPatientFilter"), $("#odontogramPatientFilter").value);
  $$('select[name="tooth"]').forEach((select) => fillSelect(select, teeth, select.value));
  $$('select[name="condition"]').forEach((select) => fillSelect(select, toothConditions, select.value));
  fillSelect($("#doctorFilter"), ["Todos los doctores", ...state.config.doctors], $("#doctorFilter").value);
  fillSelect($("#unitFilter"), ["Todas las unidades", ...state.config.units], $("#unitFilter").value);
  renderTreatmentPaymentOptions();
}

function renderTreatmentPaymentOptions() {
  const patientSelect = $('#paymentForm select[name="patientId"]');
  const historySelect = $('#paymentForm select[name="historyId"]');
  if (!patientSelect || !historySelect) return;
  const patientId = patientSelect.value;
  const pending = pendingCashHistories().filter((entry) => entry.patientId === patientId);
  historySelect.innerHTML = pending.length
    ? pending.map((entry) => `<option value="${entry.id}">${formatDate(entry.date)} - ${escapeHtml(entry.reason)} - saldo ${money(historyBalance(entry.id))}</option>`).join("")
    : `<option value="">Sin atenciones pendientes</option>`;
  if (forcedPaymentHistoryId && pending.some((entry) => entry.id === forcedPaymentHistoryId)) historySelect.value = forcedPaymentHistoryId;
  updatePaymentDue();
}

function updatePaymentDue() {
  const form = $("#paymentForm");
  if (!form) return;
  const due = historyBalance(form.historyId.value);
  form.amountDue.value = due || 0;
  form.amount.value = due || "";
  const clearDebtBtn = $("#clearHistoryDebtBtn");
  if (clearDebtBtn) clearDebtBtn.hidden = !isAdmin() || !form.historyId.value || due <= 0;
  updatePaymentChange();
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
  const received = Number(form.cashReceived.value || 0);
  const amount = Number(form.amount.value || 0);
  form.change.value = Math.max(0, received - amount).toFixed(2);
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

function findAppointmentConflict(candidate) {
  const sameDateTime = state.appointments.filter((appointment) =>
    appointment.id !== candidate.id &&
    appointment.date === candidate.date &&
    appointment.time === candidate.time &&
    !["CANCELADA", "REPROGRAMADA"].includes(appointment.status)
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
  agendaTimesForDay(date, start, end).forEach((time) => {
    const cursor = minutes(time);
    const slots = units.map((unitName) => {
      const appointment = state.appointments.find((item) => {
        const doctorOk = !doctor || doctor === "Todos los doctores" || item.doctor === doctor;
        const unitOk = !unit || unit === "Todas las unidades" || item.unit === unit;
        return item.status !== "CANCELADA" && item.date === date && item.time === time && item.unit === unitName && doctorOk && unitOk;
      });
      const isLunch = dayOfWeek(date) !== 6 && cursor >= minutes(state.config.lunchStart) && cursor < minutes(state.config.lunchEnd);
      if (appointment) {
        const patient = patientById(appointment.patientId);
        const debt = patient ? patientDebt(patient.id) : 0;
        const statusText = appointment.status === "ATENDIDA" ? "ATENDIDO" : appointment.status;
        return `<div class="slot busy status-${appointment.status.toLowerCase()}" data-edit-appointment="${appointment.id}">
          <div class="slot-main">
            <strong>${escapeHtml(patient?.name || "")}</strong>
            <span>${escapeHtml(appointment.service)}</span>
          </div>
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
  $("#agendaBoard").innerHTML = rows.join("") || `<div class="appointment-card"><strong>No se pudo construir la agenda.</strong><p class="muted">Revisa horario de inicio, fin e intervalo en Configuracion.</p></div>`;
}

function renderPatients() {
  const query = ($("#globalSearch")?.value || "").trim().toLowerCase();
  const filteredPatients = state.patients
    .filter((patient) => [patient.name, patient.dni, patient.phone, patient.birthDate].join(" ").toLowerCase().includes(query));
  const counter = $("#patientCount");
  if (counter) {
    counter.textContent = query ? `${filteredPatients.length} de ${state.patients.length} pacientes` : `${state.patients.length} pacientes`;
  }
  const rows = filteredPatients
    .map((patient) => {
      const status = patientStatus(patient);
      const ageText = patientAgeText(patient);
      const highlight = patient.id === lastSavedPatientId ? "row-highlight" : "";
      return `<tr class="${highlight}" data-patient-row="${patient.id}">
        <td><strong>${escapeHtml(patient.name)}</strong><br><span class="muted">${escapeHtml(patient.dni)}</span></td>
        <td>${escapeHtml(patient.phone)}${patient.birthDate ? `<br><span class="muted">${formatDate(patient.birthDate)}${ageText ? ` | ${ageText}` : ""}</span>` : ""}</td>
        <td>${escapeHtml(patient.doctor)}</td>
        <td><span class="status ${status === "INACTIVO" ? "danger" : status === "NUEVO" ? "warn" : ""}">${status}</span></td>
        <td>${money(patientDebt(patient.id))}</td>
        <td class="row-actions"><button class="small-btn" data-edit-patient="${patient.id}">Editar</button><button class="small-btn" data-pay-patient="${patient.id}">Pago</button><button class="small-btn danger-btn" data-delete-patient="${patient.id}">Eliminar</button></td>
      </tr>`;
    });
  $("#patientsTable").innerHTML = rows.join("") || `<tr><td colspan="6">No hay pacientes para mostrar.</td></tr>`;
}

function renderTreatments() {
  $("#treatmentsList").innerHTML = state.treatments.map((treatment) => {
    const patient = patientById(treatment.patientId);
    const paid = state.payments.filter((payment) => payment.treatmentId === treatment.id).reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
    const balance = Math.max(0, Number(treatment.budget || 0) - paid);
    return `<article class="treatment-card">
      <div class="card-title">
        <strong>${escapeHtml(patient?.name || "Paciente")}</strong>
        <span class="status">${escapeHtml(treatment.status)}</span>
      </div>
      <p class="muted">${escapeHtml(treatment.service)} | Piezas: ${escapeHtml(treatment.teeth || "-")}</p>
      <p>Presupuesto: <strong>${money(treatment.budget)}</strong> | Pagado: <strong>${money(paid)}</strong> | Saldo: <strong>${money(balance)}</strong></p>
      <p class="muted">${escapeHtml(treatment.notes || "")}</p>
      <button class="small-btn" data-edit-treatment="${treatment.id}">Editar</button>
    </article>`;
  }).join("") || `<p class="muted">Aun no hay tratamientos.</p>`;
}

function renderClinicalHistory() {
  const filter = $("#historyPatientFilter").value || state.patients[0]?.id;
  if (!$('#historyForm input[name="date"]').value) $('#historyForm input[name="date"]').value = todayISO();
  const items = state.clinicalHistory
    .filter((entry) => !filter || entry.patientId === filter)
    .sort((a, b) => b.date.localeCompare(a.date));
  $("#historyTimeline").innerHTML = items.map((entry) => {
    const patient = patientById(entry.patientId);
    const balance = historyBalance(entry.id);
    return `<details class="timeline-item">
      <summary>
        <strong>${formatDate(entry.date)} | ${escapeHtml(patient?.name || "")}</strong>
        <span class="status ${balance > 0 ? "warn" : ""}">${balance > 0 ? "PENDIENTE" : "PAGADO"}</span>
      </summary>
      <p><strong>Atendido por:</strong> ${escapeHtml(entry.attendedBy || "-")} | <strong>Precio pactado:</strong> ${money(entry.agreedPrice)} | <strong>Saldo:</strong> ${money(balance)}</p>
      <p><strong>Motivo:</strong> ${escapeHtml(entry.reason)}</p>
      <p><strong>Plan:</strong> ${escapeHtml(entry.plan || "-")}</p>
      <p class="muted">${escapeHtml(entry.procedure || "")}</p>
      <p><strong>Presupuesto:</strong> ${escapeHtml(entry.instructions || "-")}</p>
      ${entry.creditPending ? `<p><strong>Pago pendiente:</strong> ${money(historyBalance(entry.id))} | <strong>Fecha compromiso:</strong> ${entry.creditDueDate ? formatDate(entry.creditDueDate) : "-"}</p>` : ""}
      <button class="small-btn" data-edit-history="${entry.id}">Editar</button>
    </details>`;
  }).join("") || `<p class="muted">Este paciente aun no tiene historial registrado.</p>`;
}

const odontogramConditionMeta = {
  Sano: { label: "Sano", short: "OK", className: "sano", mark: "" },
  Cariado: { label: "Cariado", short: "CA", className: "cariado", mark: "dot" },
  Obturado: { label: "Obturado", short: "OB", className: "obturado", mark: "square" },
  Perdido: { label: "Perdido", short: "PE", className: "perdido", mark: "x" },
  Ausente: { label: "Ausente", short: "AU", className: "ausente", mark: "x" },
  "Por extraer": { label: "Por extraer", short: "EX", className: "por-extraer", mark: "x" },
  Extraido: { label: "Extraido", short: "EX", className: "extraido", mark: "x" },
  Corona: { label: "Corona", short: "CO", className: "corona", mark: "cap" },
  Endodoncia: { label: "Endodoncia", short: "EN", className: "endodoncia", mark: "line" },
  Implante: { label: "Implante", short: "IM", className: "implante", mark: "pin" },
  Sellante: { label: "Sellante", short: "SE", className: "sellante", mark: "square" },
  Ortodoncia: { label: "Ortodoncia", short: "OR", className: "ortodoncia", mark: "bracket" },
  Protesis: { label: "Protesis", short: "PR", className: "protesis", mark: "bridge" },
  Observacion: { label: "Observacion", short: "OBS", className: "observacion", mark: "note" }
};

function conditionMeta(condition) {
  return odontogramConditionMeta[condition] || odontogramConditionMeta.Sano;
}

function toothFamily(tooth) {
  const last = String(tooth).slice(-1);
  if (["1", "2"].includes(last)) return "incisor";
  if (last === "3") return "canine";
  if (["4", "5"].includes(last)) return "premolar";
  return "molar";
}

function toothSvg(tooth) {
  const family = toothFamily(tooth);
  const topArch = ["18", "17", "16", "15", "14", "13", "12", "11", "21", "22", "23", "24", "25", "26", "27", "28"].includes(String(tooth));
  const rootY = topArch ? 14 : 68;
  const crownY = topArch ? 58 : 22;
  const rootPath = {
    incisor: `M34 ${rootY} C31 ${topArch ? 26 : 56} 30 ${topArch ? 38 : 44} 36 ${crownY - (topArch ? 10 : -10)} C42 ${topArch ? 38 : 44} 41 ${topArch ? 26 : 56} 38 ${rootY} Z`,
    canine: `M35 ${rootY} C29 ${topArch ? 30 : 52} 30 ${topArch ? 44 : 38} 36 ${crownY - (topArch ? 9 : -9)} C44 ${topArch ? 42 : 40} 43 ${topArch ? 28 : 54} 37 ${rootY} Z`,
    premolar: `M29 ${rootY} C25 ${topArch ? 31 : 51} 29 ${topArch ? 43 : 39} 34 ${crownY - (topArch ? 9 : -9)} C39 ${topArch ? 43 : 39} 43 ${topArch ? 31 : 51} 39 ${rootY} Z M39 ${rootY} C35 ${topArch ? 31 : 51} 39 ${topArch ? 43 : 39} 44 ${crownY - (topArch ? 9 : -9)} C49 ${topArch ? 43 : 39} 53 ${topArch ? 31 : 51} 49 ${rootY} Z`,
    molar: `M24 ${rootY} C20 ${topArch ? 30 : 52} 25 ${topArch ? 42 : 40} 30 ${crownY - (topArch ? 9 : -9)} C35 ${topArch ? 42 : 40} 39 ${topArch ? 30 : 52} 35 ${rootY} Z M38 ${rootY} C35 ${topArch ? 31 : 51} 38 ${topArch ? 43 : 39} 43 ${crownY - (topArch ? 8 : -8)} C48 ${topArch ? 43 : 39} 52 ${topArch ? 31 : 51} 49 ${rootY} Z`
  }[family];
  const crown = family === "molar"
    ? "M22 48 C20 37 28 30 36 35 C43 29 55 36 52 49 C53 62 42 68 36 61 C28 67 20 60 22 48 Z"
    : family === "premolar"
      ? "M25 48 C25 37 32 31 39 36 C46 31 53 38 51 48 C52 59 43 66 38 60 C32 66 24 59 25 48 Z"
      : family === "canine"
        ? "M27 49 C27 39 32 32 37 35 C43 31 50 39 49 50 C49 60 42 67 37 60 C31 66 26 59 27 49 Z"
        : "M28 50 C28 39 32 32 38 35 C44 32 49 39 48 50 C49 60 43 66 38 61 C32 66 27 60 28 50 Z";
  return `<svg class="tooth-svg tooth-${family}" viewBox="0 0 74 84" aria-hidden="true">
    <path class="tooth-root" d="${rootPath}"></path>
    <path class="tooth-crown" d="${crown}"></path>
    <path class="tooth-shade" d="M38 35 C44 38 47 45 46 54 C44 60 40 63 37 61 C42 56 42 44 38 35 Z"></path>
  </svg>`;
}

function odontogramMark(meta) {
  if (!meta.mark) return "";
  return `<span class="tooth-mark mark-${meta.mark}" aria-hidden="true"></span>`;
}

function toothSurfaceCross(meta) {
  const active = ["cariado", "obturado", "sellante", "endodoncia"].includes(meta.className) ? " active" : "";
  return `<span class="surface-cross ${meta.className}${active}" aria-hidden="true">
    <i class="surface top"></i>
    <i class="surface left"></i>
    <i class="surface center"></i>
    <i class="surface right"></i>
    <i class="surface bottom"></i>
  </span>`;
}

function renderOdontogramToolbar(currentCondition) {
  const priority = ["Cariado", "Obturado", "Ausente", "Por extraer", "Corona", "Endodoncia", "Implante", "Ortodoncia", "Protesis", "Sellante", "Extraido", "Observacion", "Sano"];
  $("#odontogramToolbar").innerHTML = `<div class="odontogram-type">
    <button class="type-pill active" type="button">Adulto</button>
    <button class="type-pill" type="button" disabled>Nino</button>
  </div>
  <div class="odontogram-symbol-grid">
  ${priority.map((condition) => {
    const meta = conditionMeta(condition);
    const active = condition === currentCondition ? " active" : "";
    return `<button class="condition-chip ${meta.className}${active}" type="button" data-condition-tool="${escapeHtml(condition)}">
      <span class="chip-swatch"></span><span>${escapeHtml(meta.label)}</span>
    </button>`;
  }).join("")}
  </div>
  <button class="ghost compact" type="button" data-condition-tool="Sano">Limpiar pieza</button>`;
}

function renderOdontogram() {
  const patientId = $("#odontogramPatientFilter").value || state.patients[0]?.id;
  const form = $("#odontogramForm");
  const selectedTooth = form?.tooth?.value || "";
  const currentCondition = form?.condition?.value || "Sano";
  const records = state.odontogram.filter((item) => item.patientId === patientId);
  const recordMap = new Map(records.map((item) => [item.tooth, item]));
  renderOdontogramToolbar(currentCondition);
  const arches = [
    { label: "Maxilar superior", teeth: ["18", "17", "16", "15", "14", "13", "12", "11", "21", "22", "23", "24", "25", "26", "27", "28"] },
    { label: "Maxilar inferior", teeth: ["48", "47", "46", "45", "44", "43", "42", "41", "31", "32", "33", "34", "35", "36", "37", "38"] }
  ];
  $("#odontogramGrid").innerHTML = `<div class="odontogram-board">
    <div class="odontogram-sheet-title">
      <strong>Odontograma adulto</strong>
      <span>FDI | selecciona condicion, pieza y guarda</span>
    </div>
    ${arches.map((arch) => {
      const numbers = arch.teeth.map((tooth) => `<span>${tooth}</span>`).join("");
      const buttons = arch.teeth.map((tooth) => {
        const record = recordMap.get(tooth);
        const condition = record?.condition || "Sano";
        const meta = conditionMeta(condition);
        const selected = String(tooth) === String(selectedTooth) ? " selected" : "";
        return `<button class="tooth ${meta.className}${selected}" data-tooth="${tooth}" type="button" title="${escapeHtml(record?.note || condition)}">
          <span class="tooth-condition">${escapeHtml(meta.short)}</span>
          <span class="tooth-art">${toothSvg(tooth)}${odontogramMark(meta)}</span>
          ${toothSurfaceCross(meta)}
        </button>`;
      }).join("");
      return `<section class="odontogram-section">
        <h3>${escapeHtml(arch.label)}</h3>
        <div class="tooth-number-strip">${numbers}</div>
        <div class="odontogram-row">${buttons}</div>
        <div class="tooth-number-strip bottom">${numbers}</div>
      </section>`;
    }).join("")}
  </div>
  <div class="odontogram-summary">
    ${records.length
      ? records.map((record) => `<span><strong>${escapeHtml(record.tooth)}</strong> ${escapeHtml(record.condition)}${record.note ? ` - ${escapeHtml(record.note)}` : ""}</span>`).join("")
      : `<span class="muted">Sin hallazgos registrados para este paciente.</span>`}
  </div>`;
}

function renderPayments() {
  const cashDate = operatingDate();
  const month = cashDate.slice(0, 7);
  const monthIncome = state.payments.filter((payment) => payment.date.startsWith(month)).reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  $("#monthIncome").textContent = money(monthIncome);
  $("#totalDebt").textContent = money(state.patients.reduce((sum, patient) => sum + patientDebt(patient.id), 0));
  renderCashBox();
  renderExpenses();
  const paymentsTable = $("#paymentsTable");
  const paymentsHeader = paymentsTable?.closest("table")?.querySelector("thead tr");
  if (paymentsHeader) {
    paymentsHeader.innerHTML = `
      <th>Fecha</th>
      <th>Paciente</th>
      <th>Metodo</th>
      <th>Monto</th>
      <th>Comprobante</th>
      ${isAdmin() ? "<th>Accion</th>" : ""}
    `;
  }
  $("#paymentsTable").innerHTML = openPaymentsForDate(cashDate)
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((payment) => {
      const patient = patientById(payment.patientId);
      const history = historyById(payment.historyId);
      return `<tr>
        <td>${formatDate(cashDate)}</td>
        <td>${escapeHtml(patient?.name || "")}<br><span class="muted">${escapeHtml(history?.attendedBy ? `Dr(a). ${history.attendedBy}` : "")}</span></td>
        <td>${escapeHtml(payment.method)}</td>
        <td><strong>${money(payment.amount)}</strong><br><span class="muted">Vuelto: ${money(payment.change || 0)}</span></td>
        <td>${escapeHtml(payment.receipt || (history ? history.reason : ""))}</td>
        ${isAdmin() ? `<td class="row-actions"><button class="small-btn danger-btn" data-delete-payment="${payment.id}">Eliminar</button></td>` : ""}
      </tr>`;
    }).join("") || `<tr><td colspan="${isAdmin() ? 6 : 5}">No hay pagos registrados.</td></tr>`;
}

function renderReceivables() {
  const table = $("#receivablesTable");
  if (!table) return;
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
      <td><strong>${escapeHtml(patient?.name || "")}</strong><br><span class="muted">${escapeHtml(entry.creditNote || entry.reason || "")}</span></td>
      <td>${escapeHtml(patient?.phone || "")}</td>
      <td>${escapeHtml(entry.attendedBy || patient?.doctor || "")}</td>
      <td><strong>${money(balance)}</strong></td>
      <td><span class="status ${status === "VENCIDO" ? "danger" : status === "COBRAR HOY" ? "warn" : ""}">${status}</span></td>
      <td class="row-actions">
        <a class="small-btn" href="${wa}" target="_blank" rel="noopener">WhatsApp</a>
        <button class="small-btn" data-pay-history="${entry.id}">Registrar pago</button>
      </td>
    </tr>`;
  }).join("") || `<tr><td colspan="7">No hay cuentas por cobrar pendientes.</td></tr>`;
}

function renderCashBox() {
  const cashDate = operatingDate();
  const session = cashSessionToday();
  const lastSession = cashSessionsToday().slice(-1)[0];
  const suggestedOpening = pettyCashAmount(cashDate);
  const openingInput = $("#openingCash");
  if (!session && openingInput && document.activeElement !== openingInput) openingInput.value = suggestedOpening || "";
  const opening = Number(session?.openingCash ?? openingInput?.value ?? suggestedOpening ?? 0);
  const income = todayIncome();
  const expenses = dailyCashAffectingExpenseTotal(cashDate);
  const cashIncome = todayIncomeByMethods(["EFECTIVO"]);
  const walletIncome = todayIncomeByMethods(["YAPE", "PLIN"]);
  const bankIncome = todayIncomeByMethods(["TARJETA", "TRANSFERENCIA"]);
  const cashNet = opening + cashIncome - todayExpenseByMethods(["EFECTIVO"]);
  const walletNet = walletIncome - todayExpenseByMethods(["YAPE", "PLIN"]);
  const bankNet = bankIncome - todayExpenseByMethods(["TARJETA", "TRANSFERENCIA"]);
  const expected = opening + income - expenses;
  $("#cashStatus").textContent = session ? "ABIERTA" : lastSession?.closedAt ? "CERRADA" : "SIN APERTURA";
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
  const counted = Number($("#closingCash").value || session?.closingCash || 0);
  $("#cashDifference").value = counted ? (counted - expected).toFixed(2) : "";
  toggleCashLockedState(Boolean(session));
}

function renderExpenses() {
  const rows = openExpensesForDate(operatingDate()).filter(expenseAffectsDaily).map((expense) => `<tr>
    <td>${escapeHtml(expense.detail)}<br><span class="muted">${escapeHtml(expense.receipt || "")}</span></td>
    <td>${escapeHtml(expense.method)}</td>
    <td>${escapeHtml(expense.source)}</td>
    <td><strong>${money(expense.amount)}</strong></td>
  </tr>`);
  $("#expensesTable").innerHTML = rows.join("") || `<tr><td colspan="4">No hay egresos registrados hoy.</td></tr>`;
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
  const upcoming = state.appointments
    .filter((appointment) => appointment.date >= todayISO() && !["CANCELADA", "NO_ASISTIO"].includes(appointment.status))
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))
    .slice(0, 30);
  $("#remindersList").innerHTML = upcoming.map((appointment) => {
    const patient = patientById(appointment.patientId);
    const text = `Hola ${patient?.name || ""}, le recordamos su cita odontologica en ${state.config.clinicName} el ${formatDate(appointment.date)} a las ${appointment.time}.`;
    const wa = `https://wa.me/51${patient?.phone || ""}?text=${encodeURIComponent(text)}`;
    return `<article class="campaign-card">
      <div class="card-title">
        <strong>${formatDate(appointment.date)} ${appointment.time}</strong>
        <span class="status">${escapeHtml(appointment.status)}</span>
      </div>
      <p>${escapeHtml(patient?.name || "")}</p>
      <p class="muted">${escapeHtml(appointment.service)} | ${escapeHtml(appointment.doctor)}</p>
      <a class="primary" href="${wa}" target="_blank" rel="noopener">Enviar recordatorio</a>
    </article>`;
  }).join("") || `<p class="muted">No hay citas futuras para recordar.</p>`;
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
  return !["CANCELADA", "REPROGRAMADA"].includes(appointment.status);
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
    .filter((appointment) => appointment.date === date && appointment.status !== "CANCELADA")
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
    .filter((appointment) => appointment.date >= today && appointment.status !== "CANCELADA")
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
  const purchaseExpenses = expenses
    .filter((expense) => expense.category !== "PERSONAL_TERCERO")
    .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  return {
    appointments,
    payments,
    expenses,
    income: payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0),
    staffExpenses,
    purchaseExpenses,
    totalExpenses: staffExpenses + purchaseExpenses,
    newPatients,
    ageGroups,
    oldPatients: oldPatientIds.size,
    inactivePatients: state.patients.filter((patient) => patientStatus(patient) === "INACTIVO").length,
    attended: appointments.filter((appointment) => appointment.status === "ATENDIDA").length,
    patientsSeen: uniquePatientCount(appointments)
  };
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
  $("#reportTreatments").textContent = state.treatments.filter((treatment) => treatment.status === "EN_PROCESO").length;
  $("#reportNewPatients").textContent = metrics.newPatients.length;
  $("#reportOldPatients").textContent = metrics.oldPatients;
  $("#reportInactivePatients").textContent = metrics.inactivePatients;
  $("#reportStaffExpenses").textContent = money(metrics.staffExpenses);
  $("#reportPurchaseExpenses").textContent = money(metrics.purchaseExpenses);

  const compareRows = [
    ["Ingresos", money(metrics.income), money(compare.income), money(metrics.income - compare.income)],
    ["Gastos personal", money(metrics.staffExpenses), money(compare.staffExpenses), money(metrics.staffExpenses - compare.staffExpenses)],
    ["Gastos compras", money(metrics.purchaseExpenses), money(compare.purchaseExpenses), money(metrics.purchaseExpenses - compare.purchaseExpenses)],
    ["Pacientes nuevos", metrics.newPatients.length, compare.newPatients.length, metrics.newPatients.length - compare.newPatients.length],
    ["Pacientes atendidos", metrics.attended, compare.attended, metrics.attended - compare.attended],
    ["Pacientes con cita", metrics.patientsSeen, compare.patientsSeen, metrics.patientsSeen - compare.patientsSeen]
  ].map(([label, current, previous, variation]) => `<tr><td>${label}</td><td>${current}</td><td>${previous}</td><td><strong>${variation}</strong></td></tr>`).join("");
  $("#monthCompareReport").innerHTML = `<table><thead><tr><th>Indicador</th><th>${monthLabel(month)}</th><th>${monthLabel(compareMonth)}</th><th>Variacion</th></tr></thead><tbody>${compareRows}</tbody></table>`;

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

function generalCashBalances() {
  const cashIncome = state.payments
    .filter((payment) => String(payment.method || "").toUpperCase() === "EFECTIVO")
    .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const bankIncome = state.payments
    .filter((payment) => ["YAPE", "PLIN", "TARJETA", "TRANSFERENCIA"].includes(String(payment.method || "").toUpperCase()))
    .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const cashExpenses = state.expenses
    .filter((expense) => expense.source === "CAJA_GENERAL" && String(expense.method || "").toUpperCase() === "EFECTIVO")
    .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  const bankExpenses = state.expenses
    .filter((expense) => expense.source === "CAJA_GENERAL" && ["YAPE", "PLIN", "TARJETA", "TRANSFERENCIA"].includes(String(expense.method || "").toUpperCase()))
    .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  const cash = Number(state.config.generalCashOpening || 0) + cashIncome - cashExpenses - pettyCashDeliveredTotal();
  const bank = Number(state.config.generalBankOpening || 0) + bankIncome - bankExpenses;
  return { cash, bank, total: cash + bank };
}

function renderGeneralCash() {
  const cashDate = operatingDate();
  const balances = generalCashBalances();
  $("#generalCashBalance").textContent = money(balances.cash);
  $("#generalBankBalance").textContent = money(balances.bank);
  $("#generalTotalBalance").textContent = money(balances.total);
  $("#generalTodayIncome").textContent = money(todayIncome());
  const form = $("#generalCashForm");
  if (form && (!document.activeElement || !form.contains(document.activeElement))) {
    form.cash.value = state.config.generalCashOpening;
    form.bank.value = state.config.generalBankOpening;
    form.pettyCash.value = pettyCashAmount(cashDate) || "";
  }
  if (form) {
    form.cash.readOnly = !isAdmin();
    form.bank.readOnly = !isAdmin();
    form.cash.title = isAdmin() ? "" : "Solo el administrador puede cambiar el saldo inicial.";
    form.bank.title = isAdmin() ? "" : "Solo el administrador puede cambiar el saldo inicial.";
  }
  $("#generalDailyTable").innerHTML = allDatesWithCashActivity().reverse().map((date) => {
    const income = incomeForDate(date);
    const opExpenses = dailyExpenseTotal(date);
    const generalExpenses = dailyGeneralExpenseTotal(date);
    const closure = state.dailyClosures.find((item) => item.date === date);
    const details = closure?.rows || printableRowsForDailyClose(date);
    const detailRows = details.map((row) => `<tr><td>${escapeHtml(row.tipo)}</td><td>${escapeHtml(row.detalle)}</td><td>${escapeHtml(row.metodo || "")}</td><td>${escapeHtml(row.origen || "")}</td><td>${moneyForPrint(row.monto)}</td></tr>`).join("");
    return `<tr>
      <td>${formatDate(date)}</td>
      <td>${money(income)}</td>
      <td>${money(opExpenses)}</td>
      <td>${money(generalExpenses)}</td>
      <td><strong>${money(income - opExpenses - generalExpenses)}</strong>
        <details class="day-detail"><summary>Ver detalle</summary>
          <table><thead><tr><th>Tipo</th><th>Detalle</th><th>Metodo</th><th>Origen</th><th>Monto</th></tr></thead><tbody>${detailRows}</tbody></table>
        </details>
      </td>
    </tr>`;
  }).join("") || `<tr><td colspan="5">Aun no hay movimientos.</td></tr>`;
  renderStaffPayments();
}

function staffPayments() {
  return state.expenses
    .filter((expense) => expense.category === "PERSONAL_TERCERO")
    .slice()
    .sort((a, b) => `${b.date || ""}${b.id || ""}`.localeCompare(`${a.date || ""}${a.id || ""}`));
}

function renderStaffPayments() {
  const table = $("#staffPaymentsTable");
  if (!table) return;
  table.innerHTML = staffPayments().map((payment) => `<tr>
    <td>${formatDate(payment.date)}</td>
    <td>${escapeHtml(payment.person || "")}</td>
    <td>${escapeHtml(payment.type || "OTRO")}</td>
    <td>${escapeHtml(payment.method || "")}</td>
    <td><strong>${money(payment.amount)}</strong></td>
    <td>${escapeHtml(payment.detail || "")}</td>
  </tr>`).join("") || `<tr><td colspan="6">Aun no hay pagos de personal o terceros.</td></tr>`;
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
  form.id.value = "";
  const submitButton = form.querySelector('button[type="submit"]');
  if (submitButton) submitButton.textContent = "Guardar paciente";
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
  const stored = state.dailyClosures.find((closure) => closure.date === date && Array.isArray(closure.csvRows));
  if (stored) return stored.csvRows;
  const dates = cashOperationDates(date);
  const session = state.cashSessions.find((item) => item.date === date) || {};
  const opening = Number(session.openingCash || 0);
  const incomeCash = incomeByMethodsForDate(date, ["EFECTIVO"]);
  const incomeWallet = incomeByMethodsForDate(date, ["YAPE", "PLIN"]);
  const incomeBank = incomeByMethodsForDate(date, ["TARJETA", "TRANSFERENCIA"]);
  const incomeTotal = openIncomeForDate(date);
  const operatingExpenses = dailyCashAffectingExpenseTotal(date);
  const expected = opening + incomeTotal - operatingExpenses;
  const rows = [
    { seccion: "RESUMEN", fecha: date, concepto: "Caja chica inicial", metodo: "", origen: "", ingreso: "", egreso: "", saldo: opening, comprobante: "" },
    { seccion: "RESUMEN", fecha: date, concepto: "Ingreso bruto efectivo", metodo: "EFECTIVO", origen: "INGRESOS DEL DIA", ingreso: incomeCash, egreso: "", saldo: "", comprobante: "" },
    { seccion: "RESUMEN", fecha: date, concepto: "Ingreso bruto Yape + Plin", metodo: "YAPE/PLIN", origen: "INGRESOS DEL DIA", ingreso: incomeWallet, egreso: "", saldo: "", comprobante: "" },
    { seccion: "RESUMEN", fecha: date, concepto: "Ingreso bruto tarjeta + transferencia", metodo: "TARJETA/TRANSFERENCIA", origen: "INGRESOS DEL DIA", ingreso: incomeBank, egreso: "", saldo: "", comprobante: "" },
    { seccion: "RESUMEN", fecha: date, concepto: "Total ingresos brutos", metodo: "", origen: "", ingreso: incomeTotal, egreso: "", saldo: "", comprobante: "" },
    { seccion: "RESUMEN", fecha: date, concepto: "Total egresos operativos", metodo: "", origen: "INGRESO_DEL_DIA / CAJA_CHICA", ingreso: "", egreso: operatingExpenses, saldo: "", comprobante: "" },
    { seccion: "RESUMEN", fecha: date, concepto: "Esperado al cierre", metodo: "", origen: "CAJA CHICA + INGRESOS - EGRESOS", ingreso: "", egreso: "", saldo: expected, comprobante: "" },
    { seccion: "RESUMEN", fecha: date, concepto: "Contado al cierre", metodo: "", origen: "", ingreso: "", egreso: "", saldo: Number(session.closingCash || 0), comprobante: "" },
    { seccion: "RESUMEN", fecha: date, concepto: "Diferencia", metodo: "", origen: "", ingreso: "", egreso: "", saldo: Number(session.difference || 0), comprobante: "" }
  ];
  state.payments.filter((payment) => dates.includes(payment.date) && !payment.closed).forEach((payment) => {
    rows.push({
      seccion: "PAGO",
      fecha: date,
      concepto: patientById(payment.patientId)?.name || "",
      metodo: payment.method,
      origen: "INGRESO",
      ingreso: Number(payment.amount || 0),
      egreso: "",
      saldo: "",
      comprobante: payment.receipt || ""
    });
  });
  state.expenses.filter((expense) => dates.includes(expense.date) && !expense.closed).forEach((expense) => {
    rows.push({
      seccion: "EGRESO",
      fecha: date,
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
  const stored = state.dailyClosures.find((closure) => closure.date === date && Array.isArray(closure.rows));
  if (stored) return stored.rows;
  const dates = cashOperationDates(date);
  const session = state.cashSessions.find((item) => item.date === date) || {};
  const opening = Number(session.openingCash || 0);
  const incomeCash = incomeByMethodsForDate(date, ["EFECTIVO"]);
  const incomeWallet = incomeByMethodsForDate(date, ["YAPE", "PLIN"]);
  const incomeBank = incomeByMethodsForDate(date, ["TARJETA", "TRANSFERENCIA"]);
  const operatingExpenses = dailyCashAffectingExpenseTotal(date);
  const expected = opening + openIncomeForDate(date) - operatingExpenses;
  const rows = [
    { tipo: "RESUMEN", detalle: "Caja chica inicial", metodo: "", origen: "", monto: opening, comprobante: "" },
    { tipo: "RESUMEN", detalle: "Ingresos efectivo", metodo: "EFECTIVO", origen: "", monto: incomeCash, comprobante: "" },
    { tipo: "RESUMEN", detalle: "Ingresos Yape + Plin", metodo: "YAPE/PLIN", origen: "", monto: incomeWallet, comprobante: "" },
    { tipo: "RESUMEN", detalle: "Ingresos tarjeta + transferencia", metodo: "TARJETA/TRANSFERENCIA", origen: "", monto: incomeBank, comprobante: "" },
    { tipo: "RESUMEN", detalle: "Egresos operativos", metodo: "", origen: "INGRESO_DIA/CAJA_CHICA", monto: -operatingExpenses, comprobante: "" },
    { tipo: "RESUMEN", detalle: "Esperado", metodo: "", origen: "", monto: expected, comprobante: "" },
    { tipo: "RESUMEN", detalle: "Contado cierre", metodo: "", origen: "", monto: Number(session.closingCash || 0), comprobante: "" },
    { tipo: "RESUMEN", detalle: "Diferencia", metodo: "", origen: "", monto: Number(session.difference || 0), comprobante: "" }
  ];
  state.payments.filter((payment) => dates.includes(payment.date) && !payment.closed).forEach((payment) => {
    rows.push({
      tipo: "PAGO",
      detalle: patientById(payment.patientId)?.name || "",
      metodo: payment.method,
      origen: "INGRESO",
      monto: Number(payment.amount || 0),
      comprobante: payment.receipt || ""
    });
  });
  state.expenses.filter((expense) => dates.includes(expense.date) && !expense.closed).forEach((expense) => {
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

  document.addEventListener("click", (event) => {
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
      apiFetch("/api/login", { method: "POST", body: JSON.stringify({ username: data.username, password: data.password }) })
        .then((payload) => {
          apiToken = payload.token;
          apiUser = payload.user;
          currentUserId = payload.user.id;
          localStorage.setItem(API_TOKEN_KEY, apiToken);
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
    apiToken = "";
    apiUser = null;
    localStorage.removeItem(API_TOKEN_KEY);
    currentUserId = "";
    localStorage.removeItem(`${STORAGE_KEY}-current-user`);
    render();
  });
  $$(".nav-item").forEach((button) => button.addEventListener("click", () => setView(button.dataset.view)));
  $$("[data-go]").forEach((button) => button.addEventListener("click", () => setView(button.dataset.go)));
  on("#globalSearch", "input", renderPatients);
  on("#agendaDate", "change", renderAgenda);
  on("#reportMonth", "change", renderReports);
  on("#compareMonth", "change", renderReports);
  on("#historyPatientFilter", "change", renderClinicalHistory);
  on("#odontogramPatientFilter", "change", renderOdontogram);
  on("#doctorFilter", "change", renderAgenda);
  on("#unitFilter", "change", renderAgenda);
  on("#newAppointmentBtn", "click", () => openAppointment());
  on("#quickAppointmentBtn", "click", () => openAppointment());
  on("#openRescheduleBtn", "click", () => {
    const appointment = state.appointments.find((item) => item.id === $("#appointmentForm").id.value);
    openReschedule(appointment);
  });
  on("#quickPatientBtn", "click", () => {
    setView("pacientes");
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
  });
  on('#historyForm select[name="patientId"]', "change", syncAssignedDoctor);
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

  $("#agendaBoard").addEventListener("click", (event) => {
    if (!canManageAppointments()) return;
    const edit = event.target.closest("[data-edit-appointment]");
    const empty = event.target.closest("[data-new-at]");
    if (edit) openAppointment(state.appointments.find((appointment) => appointment.id === edit.dataset.editAppointment));
    if (empty) openAppointment({ date: $("#agendaDate").value, time: empty.dataset.newAt, unit: empty.dataset.unit });
  });

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
      notes: data.notes
    };
    if (appointment.status === "CANCELADA") {
      try {
        if (data.id) await deleteAppointmentApi(data.id);
      } catch (error) {
        alert(error.message);
        return;
      }
      state.appointments = state.appointments.filter((item) => item.id !== appointment.id);
      if (!API_ENABLED) saveState();
      $("#appointmentDialog").close();
      render();
      return;
    }
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
    try {
      await saveAppointmentApi(appointment);
    } catch (error) {
      alert(error.message);
      return;
    }
    upsert(state.appointments, appointment);
    if (!API_ENABLED) saveState();
    $("#appointmentDialog").close();
    render();
  });

  $("#saveRescheduleBtn").addEventListener("click", async () => {
    if (!canManageAppointments()) {
      alert("Tu usuario no tiene permiso para reprogramar citas.");
      return;
    }
    const data = formData($("#rescheduleForm"));
    const original = state.appointments.find((appointment) => appointment.id === data.appointmentId);
    if (!original) return;
    if (!data.comment.trim()) {
      alert("Agrega un comentario para registrar el seguimiento de la reprogramacion.");
      return;
    }
    const previousStatus = original.status;
    const previousNotes = original.notes;
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
      notes: `Reprogramada desde ${formatDate(original.date)} ${original.time}. ${data.comment.trim()}`
    };
    const availabilityError = appointmentAvailabilityError(newAppointment);
    if (availabilityError) {
      original.status = previousStatus;
      original.notes = previousNotes;
      alert(availabilityError);
      return;
    }
    const conflict = findAppointmentConflict(newAppointment);
    if (conflict) {
      original.status = previousStatus;
      original.notes = previousNotes;
      alert(conflict.message);
      return;
    }
    try {
      await saveAppointmentApi(original);
      await saveAppointmentApi(newAppointment);
    } catch (error) {
      original.status = previousStatus;
      original.notes = previousNotes;
      alert(error.message);
      return;
    }
    state.appointments.push(newAppointment);
    if (!API_ENABLED) saveState();
    $("#rescheduleDialog").close();
    render();
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
    const patient = {
      id: patientEditingId || uid("p"),
      dni: data.dni,
      name: data.name.trim().toUpperCase(),
      phone: data.phone,
      birthDate: data.birthDate,
      doctor: data.doctor,
      mainTreatment: data.mainTreatment,
      createdAt: todayISO(),
      notes: data.notes
    };
    try {
      await savePatientApi(patient);
      if (API_ENABLED && apiToken) await refreshPatientsApi();
    } catch (error) {
      alert(error.message);
      patientSaving = false;
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Guardar paciente";
      }
      return;
    }
    if (!API_ENABLED || !apiToken) upsert(state.patients, patient);
    lastSavedPatientId = patient.id;
    form.reset();
    resetPatientFormMode();
    const search = $("#globalSearch");
    if (search) search.value = "";
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
    const edit = event.target.closest("[data-edit-patient]");
    const pay = event.target.closest("[data-pay-patient]");
    const del = event.target.closest("[data-delete-patient]");
    if (edit) {
      const patient = patientById(edit.dataset.editPatient);
      const form = $("#patientForm");
      patientEditingId = patient.id;
      Object.entries(patient).forEach(([key, value]) => {
        if (form[key]) form[key].value = value;
      });
      const submitButton = form.querySelector('button[type="submit"]');
      if (submitButton) submitButton.textContent = "Actualizar paciente";
    }
    if (pay) {
      setView("pagos");
      fillPaymentPatientSelect($('#paymentForm select[name="patientId"]'), pay.dataset.payPatient);
      renderTreatmentPaymentOptions();
    }
    if (del) {
      const patient = patientById(del.dataset.deletePatient);
      if (!patient || !confirm(`Eliminar paciente ${patient.name} y sus citas, historial, odontograma y pagos?`)) return;
      const id = patient.id;
      try {
        await deletePatientApi(id);
      } catch (error) {
        alert(error.message);
        return;
      }
      state.patients = state.patients.filter((item) => item.id !== id);
      state.appointments = state.appointments.filter((item) => item.patientId !== id);
      state.treatments = state.treatments.filter((item) => item.patientId !== id);
      state.payments = state.payments.filter((item) => item.patientId !== id);
      state.clinicalHistory = state.clinicalHistory.filter((item) => item.patientId !== id);
      state.odontogram = state.odontogram.filter((item) => item.patientId !== id);
      if (!API_ENABLED) saveState();
      render();
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

  $("#receivablesTable")?.addEventListener("click", (event) => {
    const pay = event.target.closest("[data-pay-history]");
    if (!pay) return;
    openPaymentForHistory(pay.dataset.payHistory);
  });

  $("#treatmentForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = formData(event.currentTarget);
    const treatment = {
      id: data.id || uid("t"),
      patientId: data.patientId,
      service: data.service,
      teeth: data.teeth,
      budget: Number(data.budget || 0),
      status: data.status,
      notes: data.notes,
      createdAt: todayISO()
    };
    try {
      await saveTreatmentApi(treatment);
    } catch (error) {
      alert(error.message);
      return;
    }
    upsert(state.treatments, treatment);
    event.currentTarget.reset();
    if (!API_ENABLED) saveState();
    render();
  });

  $("#treatmentsList").addEventListener("click", (event) => {
    const edit = event.target.closest("[data-edit-treatment]");
    if (!edit) return;
    const treatment = treatmentById(edit.dataset.editTreatment);
    const form = $("#treatmentForm");
    Object.entries(treatment).forEach(([key, value]) => {
      if (form[key]) form[key].value = value;
    });
  });

  $("#historyForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    if (historySaving) return;
    if (!canManageClinical()) {
      alert("Tu usuario no tiene permiso para guardar historial clinico.");
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
      creditPending,
      creditAmount,
      creditDueDate: data.creditDueDate || "",
      creditNote: data.creditNote || ""
    };
    try {
      await saveClinicalHistoryApi(entry);
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
    const appointment = state.appointments
      .filter((item) => item.patientId === data.patientId && item.date === data.date)
      .sort((a, b) => a.time.localeCompare(b.time))[0];
    if (appointment) appointment.status = "ATENDIDA";
    $("#historyPatientFilter").value = data.patientId;
    form.reset();
    form.attended.checked = false;
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
  });

  $("#odontogramForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = formData(event.currentTarget);
    const index = state.odontogram.findIndex((item) => item.patientId === data.patientId && item.tooth === data.tooth);
    const record = {
      id: index >= 0 ? state.odontogram[index].id : uid("odo"),
      patientId: data.patientId,
      tooth: data.tooth,
      condition: data.condition,
      note: data.note
    };
    try {
      await saveOdontogramApi(record);
    } catch (error) {
      alert(error.message);
      return;
    }
    if (index >= 0) state.odontogram[index] = record;
    else state.odontogram.push(record);
    $("#odontogramPatientFilter").value = data.patientId;
    event.currentTarget.reset();
    if (!API_ENABLED) saveState();
    render();
  });

  $("#odontogramGrid").addEventListener("click", (event) => {
    const tooth = event.target.closest("[data-tooth]");
    if (!tooth) return;
    const patientId = $("#odontogramPatientFilter").value || state.patients[0]?.id;
    const record = state.odontogram.find((item) => item.patientId === patientId && item.tooth === tooth.dataset.tooth);
    const form = $("#odontogramForm");
    const selectedCondition = form.condition.value || "Sano";
    form.patientId.value = patientId;
    form.tooth.value = tooth.dataset.tooth;
    form.condition.value = record?.condition || selectedCondition;
    form.note.value = record?.note || "";
    renderOdontogram();
  });

  $("#odontogramToolbar").addEventListener("click", (event) => {
    const tool = event.target.closest("[data-condition-tool]");
    if (!tool) return;
    const form = $("#odontogramForm");
    form.condition.value = tool.dataset.conditionTool;
    renderOdontogram();
  });

  $('#paymentForm select[name="patientId"]').addEventListener("change", () => {
    const selectedPatient = $('#paymentForm select[name="patientId"]').value;
    const forcedHistory = historyById(forcedPaymentHistoryId);
    if (!forcedHistory || forcedHistory.patientId !== selectedPatient) forcedPaymentHistoryId = "";
    renderTreatmentPaymentOptions();
  });
  $('#paymentForm select[name="historyId"]').addEventListener("change", () => {
    forcedPaymentHistoryId = "";
    updatePaymentDue();
  });
  $("#clearHistoryDebtBtn")?.addEventListener("click", clearSelectedHistoryDebt);
  $('#paymentForm input[name="amount"]').addEventListener("input", updatePaymentChange);
  $('#paymentForm input[name="cashReceived"]').addEventListener("input", updatePaymentChange);
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
    const cashDate = operatingDate();
    const due = historyBalance(data.historyId);
    const amount = Number(data.amount || 0);
    if (!data.historyId) {
      alert("Selecciona una atencion pendiente para registrar el pago.");
      restorePaymentButton();
      return;
    }
    if (amount <= 0 || amount > due) {
      alert("El monto debe ser mayor a cero y no puede superar el saldo pendiente.");
      restorePaymentButton();
      return;
    }
    const payment = {
      id: data.id || uid("pay"),
      patientId: data.patientId,
      historyId: data.historyId,
      date: cashDate,
      amount,
      cashReceived: Number(data.cashReceived || amount),
      change: Math.max(0, Number(data.cashReceived || amount) - amount),
      method: data.method,
      receipt: data.receipt
    };
    try {
      await savePaymentApi(payment);
    } catch (error) {
      alert(error.message);
      restorePaymentButton();
      return;
    }
    upsert(state.payments, payment);
    if (forcedPaymentHistoryId === payment.historyId) forcedPaymentHistoryId = "";
    form.reset();
    form.date.value = operatingDate();
    if (!API_ENABLED) saveState();
    render();
    restorePaymentButton();
  });

  $("#openCashBtn").addEventListener("click", async () => {
    if (!canManageCash()) {
      alert("Tu usuario no tiene permiso para abrir caja.");
      return;
    }
    const existing = cashSessionToday();
    if (existing) {
      alert("La caja del dia ya esta abierta.");
      return;
    }
    const cashDate = operatingDate();
    const openingCash = Number(pettyCashAmount(cashDate) || 0);
    if (openingCash > generalCashBalances().cash) {
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
    const session = cashSessionToday();
    const cashDate = operatingDate();
    if (!session) {
      alert("Primero abre la caja del dia.");
      return;
    }
    const unresolved = state.appointments.filter((appointment) => {
      if (appointment.date !== cashDate) return false;
      if (appointment.status === "ATENDIDA") return false;
      if (appointment.status === "REPROGRAMADA" && appointment.notes?.trim()) return false;
      return true;
    });
    if (unresolved.length) {
      const names = unresolved.map((appointment) => patientById(appointment.patientId)?.name || "Paciente").join(", ");
      alert(`No puedes cerrar caja. Debes atender o reprogramar con comentario a: ${names}`);
      return;
    }
    if ($("#closingCash").value === "") {
      alert("Ingresa el efectivo contado al cierre antes de cerrar caja.");
      $("#closingCash").focus();
      return;
    }
    const expected = Number(session.openingCash || 0) + todayIncome() - dailyCashAffectingExpenseTotal(cashDate);
    const closing = Number($("#closingCash").value || 0);
    const cashDates = cashOperationDates(cashDate);
    const closureRows = printableRowsForDailyClose(cashDate);
    const closureCsvRows = csvRowsForDailyClose(cashDate);
    session.closingCash = closing;
    session.difference = closing - expected;
    session.incomeTotal = todayIncome();
    session.expenseTotal = dailyCashAffectingExpenseTotal(cashDate);
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
    setPettyCashAllocation(cashDate, 0);
    const existingClosureIndex = state.dailyClosures.findIndex((closure) => closure.date === cashDate);
    const closure = { id: uid("close"), date: cashDate, closedAt: session.closedAt, rows: closureRows, csvRows: closureCsvRows };
    if (existingClosureIndex >= 0) state.dailyClosures[existingClosureIndex] = closure;
    else state.dailyClosures.push(closure);
    if (!API_ENABLED) saveState();
    render();
    printDailyClose(cashDate);
    alert(`Caja cerrada. Diferencia: ${money(session.difference)}`);
  });

  $("#openingCash").addEventListener("input", renderCashBox);
  $("#closingCash").addEventListener("input", renderCashBox);

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

  $("#exportPatientsBtn").addEventListener("click", () => exportCsv("pacientes.csv", state.patients));
  $("#exportTreatmentsBtn").addEventListener("click", () => exportCsv("tratamientos.csv", state.treatments));
  $("#exportPaymentsBtn").addEventListener("click", () => exportCsv("pagos.csv", state.payments));
  $("#exportReceivablesBtn").addEventListener("click", () => exportCsv("cuentas-por-cobrar.csv", receivableEntries().map(({ entry, patient, balance, dueDate }) => ({
    fecha_compromiso: dueDate,
    paciente: patient?.name || "",
    telefono: patient?.phone || "",
    doctor: entry.attendedBy || patient?.doctor || "",
    monto_pendiente: balance,
    comentario: entry.creditNote || entry.reason || ""
  }))));
  $("#exportCloseBtn").addEventListener("click", () => {
    const cashDate = operatingDate();
    exportCsv(`cierre-caja-${cashDate}.csv`, csvRowsForDailyClose(cashDate));
  });
  $("#printCloseBtn").addEventListener("click", () => printDailyClose(operatingDate()));
  $("#generalCashForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = formData(event.currentTarget);
    const configUpdates = {};
    if (isAdmin()) {
      state.config.generalCashOpening = Number(data.cash || 0);
      state.config.generalBankOpening = Number(data.bank || 0);
      configUpdates.generalCashOpening = state.config.generalCashOpening;
      configUpdates.generalBankOpening = state.config.generalBankOpening;
    }
    const pettyAmount = Number(data.pettyCash || 0);
    const cashDate = operatingDate();
    try {
      await saveConfigApi(configUpdates);
      await savePettyCashApi(cashDate, pettyAmount);
    } catch (error) {
      alert(error.message);
      return;
    }
    setPettyCashAllocation(cashDate, pettyAmount);
    const session = cashSessionToday();
    if (session) session.openingCash = pettyAmount;
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
    const data = formData(event.currentTarget);
    const amount = Number(data.amount || 0);
    if (!data.person.trim() || !data.detail.trim() || amount <= 0) {
      alert("Completa la persona, el detalle y un monto mayor a cero.");
      return;
    }
    const expense = {
      id: uid("staff"),
      date: data.date || operatingDate(),
      person: data.person.trim().toUpperCase(),
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
      return;
    }
    state.expenses.push(expense);
    event.currentTarget.reset();
    event.currentTarget.date.value = operatingDate();
    if (!API_ENABLED) saveState();
    render();
  });
  $("#exportGeneralBtn").addEventListener("click", () => {
    const rows = allDatesWithCashActivity().map((date) => ({
      fecha: date,
      ingresos: incomeForDate(date),
      egresos_operativos: dailyExpenseTotal(date),
      egresos_caja_general: dailyGeneralExpenseTotal(date),
      neto: incomeForDate(date) - dailyExpenseTotal(date) - dailyGeneralExpenseTotal(date)
    }));
    exportCsv("caja-general.csv", rows);
  });
  $("#exportStaffPaymentsBtn").addEventListener("click", () => {
    exportCsv("pagos-personal-terceros.csv", staffPayments().map((payment) => ({
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
  $("#exportAgendaDayBtn").addEventListener("click", exportAgendaDay);
  $("#exportAgendaFutureBtn").addEventListener("click", exportFutureAgenda);
  $("#exportRemindersBtn").addEventListener("click", () => exportCsv("recordatorios.csv", state.appointments.filter((appointment) => appointment.date >= todayISO()).map((appointment) => ({ fecha: appointment.date, hora: appointment.time, paciente: patientById(appointment.patientId)?.name, telefono: patientById(appointment.patientId)?.phone, servicio: appointment.service, doctor: appointment.doctor, estado: appointment.status }))));
  $("#exportReportsBtn").addEventListener("click", () => {
    const month = $("#reportMonth").value || todayISO().slice(0, 7);
    const metrics = reportMetrics(month);
    const rows = [
      { seccion: "RESUMEN", indicador: "Ingresos", mes: month, monto: metrics.income },
      { seccion: "RESUMEN", indicador: "Gastos personal", mes: month, monto: -metrics.staffExpenses },
      { seccion: "RESUMEN", indicador: "Gastos compras", mes: month, monto: -metrics.purchaseExpenses },
      { seccion: "RESUMEN", indicador: "Pacientes nuevos", mes: month, cantidad: metrics.newPatients.length },
      { seccion: "RESUMEN", indicador: "Pacientes antiguos", mes: month, cantidad: metrics.oldPatients },
      { seccion: "RESUMEN", indicador: "Pacientes inactivos", mes: month, cantidad: metrics.inactivePatients },
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
}

function init() {
  $("#agendaDate").value = todayISO();
  $('#paymentForm input[name="date"]').value = operatingDate();
  $('#historyForm input[name="date"]').value = todayISO();
  $('#staffPaymentForm input[name="date"]').value = operatingDate();
  $("#reportMonth").value = todayISO().slice(0, 7);
  $("#compareMonth").value = previousMonth($("#reportMonth").value);
  bindEvents();
  setupApiAutoRefresh();
  if (API_ENABLED && apiToken) loadFromApi();
  else render();
}

if ("serviceWorker" in navigator && location.protocol === "https:") {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  });
}

init();
