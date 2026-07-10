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
let patientSaving = false;
let historySaving = false;
let paymentSaving = false;
let rescheduleSaving = false;
let pendingPaymentContext = null;
let forcedPaymentHistoryId = "";
let lastSavedPatientId = "";
let patientEditingId = "";
let expandedPatientInfoId = "";
let selectedCashViewDate = "";
let selectedProductSaleItems = [];

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
    for (const key of ["services", "patients", "appointments", "treatments", "payments", "electronicReceipts", "clinicalHistory", "odontogram", "cashSessions", "dailyClosures", "expenses", "inventoryProducts", "inventoryMovements", "pettyCashAllocations", "auditEvents", "users"]) {
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
  data.config.generalUtilityOpening = Number(data.config.generalUtilityOpening ?? defaults.generalUtilityOpening ?? 0);
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
    reminderSentBy: row.reminder_sent_by || row.reminderSentBy || ""
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
  state.payments = (payload.payments || []).map(mapApiPayment);
  state.electronicReceipts = (payload.electronicReceipts || []).map(mapApiElectronicReceipt);
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
  }
  rememberApiUser(payload.user || apiUser);
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
    clearApiSession();
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
    if (shouldAutoRefreshApi()) loadFromApi();
  });
  document.addEventListener("visibilitychange", () => {
    if (shouldAutoRefreshApi()) loadFromApi();
  });
  setInterval(() => {
    if (shouldAutoRefreshApi()) loadFromApi();
  }, 30000);
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
    hideFromReceptionNew: Boolean(patient.hideFromReceptionNew)
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
    .reduce((sum, payment) => sum + Math.max(0, Number(payment.amount || 0) - Number(payment.productAmount || 0)), 0);
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

function appointmentPaymentSummary(appointment) {
  const payments = state.payments.filter((payment) => {
    if (String(payment.appointmentId || "") === String(appointment.id || "")) return true;
    if (payment.appointmentId) return false;
    return String(payment.patientId || "") === String(appointment.patientId || "")
      && payment.date === appointment.date
      && isAgendaPayment(payment);
  });
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
  const list = appointments.map((appointment) => {
    const status = appointmentStatusText(appointment.status);
    const comment = appointment.notes || appointment.note || appointment.followUpComment || "";
    const paymentText = appointmentPaymentSummary(appointment);
    return `<div class="patient-appointment-item">
      <div class="patient-appointment-item-head">
        <strong>${escapeHtml(status)}</strong>
        ${paymentText ? `<strong class="patient-appointment-payment">${escapeHtml(paymentText)}</strong>` : ""}
      </div>
      <span>${escapeHtml(appointmentDetailText(appointment))}</span>
      <span>${escapeHtml(appointment.service || patient?.mainTreatment || "Consulta")}</span>
      ${comment ? `<span class="muted">${escapeHtml(comment)}</span>` : ""}
    </div>`;
  }).join("") || `<p class="muted">No tiene citas registradas.</p>`;
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

function patientStatus(patient) {
  if (patient.status === "INACTIVO") return "INACTIVO";
  const last = lastAppointment(patient.id);
  if (!last) return patient.status || "NUEVO";
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
  const debtOptions = patients.map((patient) => `<option value="${patient.id}">${escapeHtml(patient.name)} - deuda ${money(patientDebt(patient.id))}</option>`);
  const agendaOptions = agendaPaymentAppointments()
    .map((appointment) => {
      const patient = patientById(appointment.patientId);
      return `<option value="appt:${escapeHtml(appointment.id)}">${agendaTimeLabel(appointment.time)} - ${escapeHtml(patient?.name || "Paciente")} - ${escapeHtml(appointment.service || "")}</option>`;
    });
  const usedIds = new Set([...patients.map((patient) => patient.id), ...agendaPaymentAppointments().map((appointment) => appointment.patientId)]);
  const otherOptions = state.patients
    .filter((patient) => !usedIds.has(patient.id))
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((patient) => `<option value="${patient.id}">${escapeHtml(patient.name)} - ${escapeHtml(patient.dni || "")}</option>`);
  const groups = [];
  if (debtOptions.length) groups.push(`<optgroup label="Atenciones pendientes">${debtOptions.join("")}</optgroup>`);
  if (agendaOptions.length) groups.push(`<optgroup label="Citas del dia">${agendaOptions.join("")}</optgroup>`);
  if (otherOptions.length) groups.push(`<optgroup label="Otros pacientes">${otherOptions.join("")}</optgroup>`);
  select.innerHTML = groups.length ? groups.join("") : `<option value="">Sin pacientes pendientes</option>`;
  if (selected && paymentSelectionExists(selected)) select.value = selected;
  else if (patients[0]) select.value = patients[0].id;
  else if (agendaOptions.length) select.value = agendaPaymentAppointments()[0]?.id ? `appt:${agendaPaymentAppointments()[0].id}` : "";
  else if (otherOptions.length) select.value = state.patients.slice().sort((a, b) => a.name.localeCompare(b.name))[0]?.id || "";
}

function agendaPaymentAppointments() {
  if (state.config.enableAgendaPayments === false) return [];
  const date = operatingDate();
  return state.appointments
    .filter((appointment) => {
      const status = String(appointment.status || "").toUpperCase();
      return appointment.date === date && !["CANCELADA", "NO_ASISTIO", "REPROGRAMADA", "ATENDIDA"].includes(status);
    })
    .sort((a, b) => `${a.time || ""} ${patientById(a.patientId)?.name || ""}`.localeCompare(`${b.time || ""} ${patientById(b.patientId)?.name || ""}`));
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
    .filter((entry) => entry.date === date && entry.attended && entry.id !== $("#historyForm")?.id?.value)
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

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
}

const roleLabels = {
  ADMIN: "Administrador",
  DOCTOR: "Doctor",
  RECEPCION: "Recepcion"
};

const roleViews = {
  ADMIN: ["dashboard", "pacientes", "agenda", "historial", "odontograma", "tratamientos", "inventario", "pagos", "comprobantes", "caja-general", "cuentas-cobrar", "seguimiento-citas", "panel", "recordatorios", "reportes", "campanas", "configuracion"],
  DOCTOR: ["dashboard", "pacientes", "agenda", "historial", "odontograma", "tratamientos", "inventario", "pagos", "caja-general", "cuentas-cobrar", "seguimiento-citas", "panel", "recordatorios", "reportes", "campanas"],
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
  return ["ADMIN", "DOCTOR", "RECEPCION"].includes(currentUser()?.role);
}

function canManageClinical() {
  return ["ADMIN", "DOCTOR"].includes(currentUser()?.role);
}

function canEditReceivableAmount() {
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

function canManageInventory() {
  return ["ADMIN", "DOCTOR", "RECEPCION"].includes(currentUser()?.role);
}

function canCreatePatients() {
  return ["ADMIN", "DOCTOR", "RECEPCION"].includes(currentUser()?.role);
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
    historial: "Historial clínico dental",
    odontograma: "Odontograma",
    tratamientos: "Tratamientos",
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
  render();
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
      break;
    case "odontograma":
      renderOdontogram();
      break;
    case "tratamientos":
      renderTreatments();
      break;
    case "inventario":
      renderInventory();
      break;
    case "pagos":
      renderPayments();
      break;
    case "comprobantes":
      renderElectronicReceipts();
      break;
    case "caja-general":
      renderGeneralCash();
      break;
    case "cuentas-cobrar":
      renderReceivables();
      break;
    case "seguimiento-citas":
      renderAppointmentFollowUps();
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
  renderOdontogram();
  renderTreatments();
  renderInventory();
  renderPayments();
  renderElectronicReceipts();
  renderGeneralCash();
  renderReceivables();
  renderAppointmentFollowUps();
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
  fillPaymentPatientSelect($('#paymentForm select[name="patientId"]'), $('#paymentForm select[name="patientId"]')?.value || "");
  fillPatientSelect($("#historyPatientFilter"), $("#historyPatientFilter").value);
  fillPatientSelect($("#odontogramPatientFilter"), $("#odontogramPatientFilter").value);
  $$('select[name="tooth"]').forEach((select) => fillSelect(select, teeth, select.value));
  $$('select[name="condition"]').forEach((select) => fillSelect(select, toothConditions, select.value));
  fillSelect($("#doctorFilter"), ["Todos los doctores", ...state.config.doctors], $("#doctorFilter").value);
  fillSelect($("#unitFilter"), ["Todas las unidades", ...state.config.units], $("#unitFilter").value);
  renderTreatmentPaymentOptions();
  fillInventoryProductSelects();
  toggleMixedPaymentFields();
}

function renderTreatmentPaymentOptions() {
  const patientSelect = $('#paymentForm select[name="patientId"]');
  const historySelect = $('#paymentForm select[name="historyId"]');
  if (!patientSelect || !historySelect) return;
  const appointment = appointmentFromPaymentSelection(patientSelect.value);
  if (appointment) {
    const amount = Number(serviceByName(appointment.service)?.price || 0);
    historySelect.innerHTML = `<option value="">Cita del dia - ${escapeHtml(appointment.service || "Servicio")}</option>`;
    historySelect.disabled = true;
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
    return;
  }
  const patientId = patientIdFromPaymentSelection(patientSelect.value);
  const pending = pendingCashHistories().filter((entry) => entry.patientId === patientId);
  historySelect.disabled = false;
  historySelect.innerHTML = pending.length
    ? pending.map((entry) => `<option value="${entry.id}">${formatDate(entry.date)} - ${escapeHtml(entry.reason)} - saldo ${money(historyBalance(entry.id))}</option>`).join("")
    : `<option value="">Sin atenciones pendientes</option>`;
  if (forcedPaymentHistoryId && pending.some((entry) => entry.id === forcedPaymentHistoryId)) historySelect.value = forcedPaymentHistoryId;
  const form = $("#paymentForm");
  if (form) form.dataset.paymentMode = "debt";
  updatePaymentDue();
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

function updatePaymentDue() {
  const form = $("#paymentForm");
  if (!form) return;
  if (appointmentFromPaymentSelection(form.patientId.value)) {
    form.amount.readOnly = false;
    form.dataset.basePaymentAmount = Number(form.amount.value || 0);
    applyProductTotalToPaymentForm();
    updatePaymentChange();
    return;
  }
  const due = historyBalance(form.historyId.value);
  form.amountDue.value = due || 0;
  form.amount.value = due || "";
  form.dataset.basePaymentAmount = Number(form.amount.value || 0);
  form.amount.readOnly = true;
  const clearDebtBtn = $("#clearHistoryDebtBtn");
  if (clearDebtBtn) clearDebtBtn.hidden = !isAdmin() || !form.historyId.value || due <= 0;
  applyProductTotalToPaymentForm();
  updatePaymentChange();
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
    date: todayISO(),
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

function isFollowUpOpen(appointment) {
  const status = appointmentFollowUpStatus(appointment);
  if (!status || status === "CERRADO") return false;
  if (attendedAfterFollowUp(appointment)) return false;
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
        <td><span class="status ${status === "INACTIVO" ? "danger" : status === "NUEVO" ? "warn" : ""}">${status}</span></td>
        <td>${money(patientDebt(patient.id))}</td>
        <td class="row-actions">${detailButton}<button class="small-btn" data-edit-patient="${patient.id}">Editar</button><button class="small-btn" data-pay-patient="${patient.id}">Pago</button>${canDeletePatients() ? `<button class="small-btn danger-btn" data-delete-patient="${patient.id}">Eliminar</button>` : ""}</td>
      </tr>`;
      const detailRow = expanded ? `<tr class="patient-detail-row"><td colspan="6">${renderPatientAppointmentDetail(patient.id)}</td></tr>` : "";
      return mainRow + detailRow;
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
  const cashDate = cashViewDate();
  const cashDateInput = $("#cashViewDate");
  if (cashDateInput && document.activeElement !== cashDateInput) cashDateInput.value = cashDate;
  $("#totalDebt").textContent = money(state.patients.reduce((sum, patient) => sum + patientDebt(patient.id), 0));
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
      <th>Comprobante</th>
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
        <td>${escapeHtml(patient?.name || "")}<br><span class="muted">${escapeHtml(history?.attendedBy ? `Dr(a). ${history.attendedBy}` : "")}</span></td>
        <td>${escapeHtml(paymentMethodLabel(payment))}</td>
        <td><strong>${money(payment.amount)}</strong>${showChange ? `<br><span class="muted">Vuelto: ${money(payment.change || 0)}</span>` : ""}</td>
        <td>${escapeHtml(payment.receipt || (history ? history.reason : ""))}</td>
        ${isAdmin() ? `<td class="row-actions"><button class="small-btn danger-btn" data-delete-payment="${payment.id}">Eliminar</button></td>` : ""}
      </tr>`;
    }).join("") || `<tr><td colspan="${isAdmin() ? 6 : 5}">No hay pagos registrados.</td></tr>`;
}

function buildElectronicReceiptFromPayment(payment, formDataValues) {
  const type = String(formDataValues.electronicReceiptType || formDataValues.type || "").toUpperCase();
  if (!type) return null;
  const patient = patientById(payment.patientId);
  const history = historyById(payment.historyId);
  const customerDoc = String(formDataValues.receiptCustomerDoc || formDataValues.customerDoc || patient?.dni || "").trim();
  const customerName = String(formDataValues.receiptCustomerName || formDataValues.customerName || patient?.name || "").trim().toUpperCase();
  const description = String(formDataValues.description || history?.reason || patient?.mainTreatment || "Servicio odontologico").trim();
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

function renderElectronicReceipts() {
  const table = $("#electronicReceiptsTable");
  if (!table) return;
  const rows = state.electronicReceipts
    .slice()
    .sort((a, b) => `${b.issueDate || ""}${b.createdAt || ""}`.localeCompare(`${a.issueDate || ""}${a.createdAt || ""}`));
  table.innerHTML = rows.map((receipt) => `<tr>
    <td>${formatDate(receipt.issueDate)}</td>
    <td><strong>${escapeHtml(receiptFullNumber(receipt))}</strong><br><span class="muted">${escapeHtml(receipt.type)}</span></td>
    <td>${escapeHtml(receipt.customerName)}<br><span class="muted">${escapeHtml(receipt.customerDocType)} ${escapeHtml(receipt.customerDoc)}</span></td>
    <td>${escapeHtml(receipt.description)}<br><span class="muted">${escapeHtml(receipt.taxCondition)} | IGV ${money(receipt.igv)}</span></td>
    <td><strong>${money(receipt.total)}</strong></td>
    <td><span class="status warn">${escapeHtml(receipt.status)}</span></td>
    <td><button class="small-btn" data-print-receipt="${receipt.id}">PDF</button></td>
  </tr>`).join("") || `<tr><td colspan="7">Aun no hay comprobantes internos.</td></tr>`;
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
  const note = isInvoice
    ? "Esta es una representacion interna con formato referencial de factura electronica. Pendiente de envio y validacion real en SUNAT."
    : "Esta es una representacion interna con formato referencial de Boleta de Venta Electronica. Pendiente de envio y validacion real en SUNAT.";

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
  const history = historyById(context.payment.historyId);
  const appointment = state.appointments.find((item) => item.id === context.payment.appointmentId);
  form.reset();
  form.elements.namedItem("type").value = "BOLETA";
  form.elements.namedItem("customerDoc").placeholder = "DNI";
  form.elements.namedItem("customerDoc").value = patient?.dni || "";
  form.elements.namedItem("customerName").value = patient?.name || "";
  form.elements.namedItem("customerAddress").value = "";
  form.elements.namedItem("description").value = history?.reason || appointment?.service || patient?.mainTreatment || "Servicio odontologico";
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
  const doc = String(docField.value || "").trim();
  if (type === "BOLETA") {
    const patient = state.patients.find((item) => String(item.dni || "").trim() === doc);
    if (patient) {
      nameField.value = patient.name || "";
      if (hint) hint.textContent = "Paciente encontrado en la base interna.";
    } else if (hint) {
      hint.textContent = "DNI no encontrado internamente. Completa el nombre manualmente.";
    }
    return;
  }
  if (!/^\d{11}$/.test(doc)) {
    if (hint) hint.textContent = "El RUC debe tener 11 digitos.";
    return;
  }
  if (doc === state.config.issuerRuc) {
    nameField.value = state.config.issuerLegalName;
    addressField.value = `${state.config.issuerAddress}, ${state.config.issuerDistrict} - ${state.config.issuerProvince} - ${state.config.issuerDepartment}`;
    if (hint) hint.textContent = "Datos encontrados en la ficha RUC cargada.";
    return;
  }
  if (hint) hint.textContent = "Consulta SUNAT automatica pendiente de proveedor/API. Completa razon social y direccion fiscal.";
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
    render();
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
    if (optimisticSave) render();
    if (receiptValues) {
      const receipt = buildElectronicReceiptFromPayment(payment, receiptValues);
      if (receipt) {
        await saveElectronicReceiptApi(receipt);
        upsert(state.electronicReceipts, receipt);
        payment.receipt = receiptFullNumber(receipt);
        await savePaymentApi(payment);
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

function renderReceivables() {
  const table = $("#receivablesTable");
  if (!table) return;
  const form = $("#manualReceivableForm");
  if (form) {
    if (form.creditDueDate && !form.creditDueDate.value) form.creditDueDate.value = todayISO();
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
      <td><strong>${escapeHtml(patient?.name || "")}</strong><br><span class="muted">${escapeHtml(entry.creditNote || entry.reason || "")}</span></td>
      <td>${escapeHtml(patient?.phone || "")}</td>
      <td>${escapeHtml(entry.attendedBy || patient?.doctor || "")}</td>
      <td><strong>${money(balance)}</strong></td>
      <td><span class="status ${status === "VENCIDO" ? "danger" : status === "COBRAR HOY" ? "warn" : ""}">${status}</span>${canEditReceivableAmount() ? `<button class="inline-edit-btn" data-edit-receivable="${entry.id}" title="Editar monto">Editar</button>` : ""}</td>
      <td class="row-actions">
        <a class="small-btn" href="${wa}" target="_blank" rel="noopener">WhatsApp</a>
        <button class="small-btn" data-pay-history="${entry.id}">Registrar pago</button>
      </td>
    </tr>`;
  }).join("") || `<tr><td colspan="7">No hay cuentas por cobrar pendientes.</td></tr>`;
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
  const rows = visibleExpensesForCashView(cashDate).filter(expenseAffectsDaily).map((expense) => `<tr>
    <td>${escapeHtml(expense.detail)}<br><span class="muted">${escapeHtml(expense.receipt || "")}</span></td>
    <td>${escapeHtml(expense.method)}</td>
    <td>${escapeHtml(expense.source)}</td>
    <td><strong>${money(expense.amount)}</strong></td>
    ${isAdmin() ? `<td class="row-actions"><button class="small-btn danger-btn" data-delete-expense="${expense.id}">Eliminar</button></td>` : ""}
  </tr>`);
  expensesTable.innerHTML = rows.join("") || `<tr><td colspan="${isAdmin() ? 5 : 4}">No hay egresos registrados hoy.</td></tr>`;

  const generalExpensesTable = $("#generalExpensesTable");
  const generalExpensesHeader = generalExpensesTable?.closest("table")?.querySelector("thead tr");
  if (generalExpensesHeader) {
    generalExpensesHeader.innerHTML = `
      <th>Detalle</th>
      <th>Metodo</th>
      <th>Monto</th>
      ${isAdmin() ? "<th>Accion</th>" : ""}
    `;
  }
  if (generalExpensesTable) {
    const generalRows = visibleExpensesForCashView(cashDate)
      .filter((expense) => expense.source === "CAJA_GENERAL")
      .map((expense) => `<tr>
        <td>${escapeHtml(expense.detail)}<br><span class="muted">${escapeHtml(expense.receipt || "")}</span></td>
        <td>${escapeHtml(expense.method)}</td>
        <td><strong>${money(expense.amount)}</strong></td>
        ${isAdmin() ? `<td class="row-actions"><button class="small-btn danger-btn" data-delete-expense="${expense.id}">Eliminar</button></td>` : ""}
      </tr>`);
    generalExpensesTable.innerHTML = generalRows.join("") || `<tr><td colspan="${isAdmin() ? 4 : 3}">No hay egresos de caja general en esta fecha.</td></tr>`;
  }
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
  const upcoming = state.appointments
    .filter((appointment) =>
      appointment.date >= startDate &&
      appointment.date <= endDate &&
      !appointment.reminderSentAt &&
      isSlotBlockingAppointment(appointment)
    )
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))
    .slice(0, 60);
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
  $("#reportTreatments").textContent = state.treatments.filter((treatment) => treatment.status === "EN_PROCESO").length;
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

function generalCashBalances() {
  const balancePayments = state.payments.filter(isFromCashBalancePeriod);
  const balanceExpenses = state.expenses.filter(isFromCashBalancePeriod);
  const allUtilityMovements = state.expenses.filter((expense) => isUtilityContribution(expense) || isUtilityPurchase(expense));
  const pettyCash = pettyCashDeliveredTotal(null, cashBalanceStartDate());
  const cashIncome = balancePayments
    .reduce((sum, payment) => sum + paymentAmountForMethods(payment, ["EFECTIVO"]), 0);
  const walletIncome = balancePayments
    .reduce((sum, payment) => sum + paymentAmountForMethods(payment, ["YAPE", "PLIN", "TARJETA"]), 0);
  const transferIncome = balancePayments
    .reduce((sum, payment) => sum + paymentAmountForMethods(payment, ["TRANSFERENCIA"]), 0);
  const cashExpenses = balanceExpenses
    .filter((expense) => expense.source !== "UTILIDAD" && String(expense.method || "").toUpperCase() === "EFECTIVO")
    .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  const walletExpenses = balanceExpenses
    .filter((expense) => expense.source !== "UTILIDAD" && ["YAPE", "PLIN", "TARJETA"].includes(String(expense.method || "").toUpperCase()))
    .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  const transferExpenses = balanceExpenses
    .filter((expense) => expense.source !== "UTILIDAD" && String(expense.method || "").toUpperCase() === "TRANSFERENCIA")
    .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  const utilityContributions = allUtilityMovements
    .filter(isUtilityContribution)
    .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  const utilityPurchases = allUtilityMovements
    .filter(isUtilityPurchase)
    .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  const cash = Number(state.config.generalCashOpening || 0) + cashIncome - cashExpenses - pettyCash;
  const wallet = Number(state.config.generalBankOpening || 0) + walletIncome - walletExpenses;
  const transfer = transferIncome - transferExpenses;
  const bank = wallet + transfer;
  const utility = Number(state.config.generalUtilityOpening || 0) + utilityContributions - utilityPurchases;
  return {
    cash,
    bank,
    wallet,
    transfer,
    utility,
    total: cash + bank,
    cashOpening: Number(state.config.generalCashOpening || 0),
    bankOpening: Number(state.config.generalBankOpening || 0),
    utilityOpening: Number(state.config.generalUtilityOpening || 0),
    cashIncome,
    walletIncome,
    transferIncome,
    cashExpenses,
    walletExpenses,
    transferExpenses,
    utilityContributions,
    utilityPurchases,
    pettyCash
  };
}

function openGeneralBalanceDetail(type) {
  const title = $("#generalBalanceDetailTitle");
  const summary = $("#generalBalanceDetailSummary");
  const head = $("#generalBalanceDetailHead");
  const body = $("#generalBalanceDetailBody");
  if (!title || !summary || !head || !body) return;
  const isCash = type === "cash";
  const isUtility = type === "utility";
  const fromDate = cashBalanceStartDate();
  const toDate = todayISO();
  const balances = generalCashBalances();
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
  title.textContent = `${titlePrefix} | ${cashBalancePeriodLabel()}`;
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

function renderGeneralCash() {
  const cashDate = todayISO();
  const balances = generalCashBalances();
  $("#generalCashBalance").textContent = money(balances.cash);
  $("#generalBankBalance").textContent = money(balances.bank);
  $("#generalWalletBalance").textContent = money(balances.wallet);
  $("#generalTransferBalance").textContent = money(balances.transfer);
  $("#utilityBalance").textContent = money(balances.utility);
  $("#generalTotalBalance").textContent = money(balances.total);
  $("#generalTodayIncome").textContent = money(todayIncome());
  const form = $("#generalCashForm");
  if (form && (!document.activeElement || !form.contains(document.activeElement))) {
    form.cash.value = state.config.generalCashOpening;
    form.bank.value = state.config.generalBankOpening;
    form.utility.value = state.config.generalUtilityOpening || "";
    form.pettyCash.value = pettyCashAmount(cashDate) || "";
  }
  if (form) {
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
    <td class="row-actions">${isAdmin() ? `<button class="small-btn danger-btn" data-delete-staff-payment="${payment.id}">Eliminar</button>` : ""}</td>
  </tr>`).join("") || `<tr><td colspan="7">Aun no hay pagos de personal o terceros.</td></tr>`;
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

  document.addEventListener("click", async (event) => {
    const generalDetail = event.target.closest("[data-open-general-detail]");
    if (generalDetail) {
      openGeneralBalanceDetail(generalDetail.dataset.openGeneralDetail);
      return;
    }
    const printReceipt = event.target.closest("[data-print-receipt]");
    if (printReceipt) {
      printElectronicReceipt(printReceipt.dataset.printReceipt);
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
  on("#agendaDate", "change", renderAgenda);
  on("#reportMonth", "change", renderReports);
  on("#compareMonth", "change", renderReports);
  on("#historyPatientFilter", "change", renderClinicalHistory);
  on("#odontogramPatientFilter", "change", renderOdontogram);
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
      expandedPatientInfoId = expandedPatientInfoId === toggleInfo.dataset.togglePatientInfo ? "" : toggleInfo.dataset.togglePatientInfo;
      renderPatients();
      return;
    }
    if (edit) {
      const patient = patientById(edit.dataset.editPatient);
      const form = $("#patientForm");
      patientEditingId = patient.id;
      Object.entries(patient).forEach(([key, value]) => {
        const field = form.elements.namedItem(key);
        if (field) field.value = value;
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
  $("#generalExpensesTable")?.addEventListener("click", handleExpenseDelete);
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
    try {
      await saveReceivableApi(entry);
    } catch (error) {
      alert(error.message);
      return;
    }
    upsert(state.clinicalHistory, entry);
    form.reset();
    form.creditDueDate.value = todayISO();
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
  $('#paymentForm input[name="amount"]').addEventListener("input", updatePaymentChange);
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
    const appointment = appointmentFromPaymentSelection(data.patientId);
    const cashDate = appointment?.date || operatingDate();
    const paymentPatientId = patientIdFromPaymentSelection(data.patientId);
    const due = appointment ? 0 : historyBalance(data.historyId);
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
    if (amount <= 0 || (!appointment && data.historyId && (careAmount <= 0 || careAmount > due))) {
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
      historyId: appointment ? "" : data.historyId,
      appointmentId: appointment?.id || "",
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
      receipt: buildPaymentReceiptText(data.receipt, appointment, selectedProductSaleItems)
    };
    openPaymentReceiptPrompt({ payment, form, restorePaymentButton });
  });
  $("#paymentForm")?.addEventListener("reset", () => {
    selectedProductSaleItems = [];
    setTimeout(() => {
      renderPaymentProductSummary();
      const form = $("#paymentForm");
      if (form) form.dataset.basePaymentAmount = "";
    }, 0);
  });

  $("#inventoryProductForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!canManageInventory()) return;
    const form = event.currentTarget;
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
    try {
      await saveInventoryProductApi(product);
    } catch (error) {
      alert(error.message);
      return;
    }
    if (!API_ENABLED) upsert(state.inventoryProducts, product);
    if (!API_ENABLED) saveState();
    form.reset();
    render();
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

  $("#exportPatientsBtn").addEventListener("click", () => exportCsv("pacientes.csv", state.patients));
  $("#exportTreatmentsBtn").addEventListener("click", () => exportCsv("tratamientos.csv", state.treatments));
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
    if (isAdmin()) {
      state.config.generalCashOpening = Number(data.cash || 0);
      state.config.generalBankOpening = Number(data.bank || 0);
      state.config.generalUtilityOpening = Number(data.utility || 0);
      configUpdates.generalCashOpening = state.config.generalCashOpening;
      configUpdates.generalBankOpening = state.config.generalBankOpening;
      configUpdates.generalUtilityOpening = state.config.generalUtilityOpening;
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
  $("#suggestUtilityTransferBtn")?.addEventListener("click", () => {
    const form = $("#utilityForm");
    if (!form) return;
    const balances = generalCashBalances();
    form.type.value = "APORTE";
    form.method.value = "TRANSFERENCIA";
    form.amount.value = Math.max(0, balances.bank).toFixed(2);
    form.detail.value = `Cierre de mes: traslado a utilidad ${monthLabel(operatingDate().slice(0, 7))}`;
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
    if (isPurchase && amount > generalCashBalances().utility) {
      alert("La compra supera la utilidad disponible.");
      return;
    }
    const balances = generalCashBalances();
    if (!isPurchase && amount > balances.cash + balances.bank) {
      alert("El aporte supera el total disponible.");
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
      estado: receipt.status
    })));
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
