PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('ADMIN', 'DOCTOR', 'RECEPCION')),
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS patients (
  id TEXT PRIMARY KEY,
  dni TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  birth_date TEXT,
  doctor TEXT,
  main_treatment TEXT,
  status TEXT NOT NULL DEFAULT 'NUEVO',
  notes TEXT,
  created_by_id TEXT,
  created_by_name TEXT,
  created_by_role TEXT,
  hide_from_reception_new INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS appointments (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  unit TEXT NOT NULL,
  doctor TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  service TEXT NOT NULL,
  duration INTEGER,
  status TEXT NOT NULL,
  notes TEXT,
  follow_up_status TEXT,
  follow_up_comment TEXT,
  new_appointment_id TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS clinical_history (
  id TEXT PRIMARY KEY,
  patient_id TEXT NOT NULL,
  date TEXT NOT NULL,
  attended_by TEXT NOT NULL,
  attended INTEGER NOT NULL DEFAULT 0,
  reason TEXT,
  anamnesis TEXT,
  exam TEXT,
  diagnosis TEXT,
  plan TEXT,
  procedure_done TEXT,
  instructions TEXT,
  agreed_price REAL NOT NULL DEFAULT 0,
  credit_pending INTEGER NOT NULL DEFAULT 0,
  credit_amount REAL NOT NULL DEFAULT 0,
  credit_due_date TEXT,
  credit_note TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS treatments (
  id TEXT PRIMARY KEY,
  patient_id TEXT NOT NULL,
  service TEXT NOT NULL,
  teeth TEXT,
  budget REAL NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS odontogram (
  id TEXT PRIMARY KEY,
  patient_id TEXT NOT NULL,
  tooth TEXT NOT NULL,
  condition TEXT NOT NULL,
  note TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(patient_id, tooth),
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  patient_id TEXT NOT NULL,
  history_id TEXT,
  date TEXT NOT NULL,
  amount REAL NOT NULL,
  cash_received REAL NOT NULL DEFAULT 0,
  change_amount REAL NOT NULL DEFAULT 0,
  cash_amount REAL NOT NULL DEFAULT 0,
  yape_amount REAL NOT NULL DEFAULT 0,
  plin_amount REAL NOT NULL DEFAULT 0,
  card_amount REAL NOT NULL DEFAULT 0,
  transfer_amount REAL NOT NULL DEFAULT 0,
  method TEXT NOT NULL,
  receipt TEXT,
  closed INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (history_id) REFERENCES clinical_history(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS electronic_receipts (
  id TEXT PRIMARY KEY,
  payment_id TEXT,
  patient_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('BOLETA', 'FACTURA')),
  series TEXT NOT NULL,
  number INTEGER NOT NULL,
  issue_date TEXT NOT NULL,
  customer_doc_type TEXT NOT NULL,
  customer_doc TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  description TEXT NOT NULL,
  quantity REAL NOT NULL DEFAULT 1,
  unit_value REAL NOT NULL DEFAULT 0,
  total REAL NOT NULL DEFAULT 0,
  tax_condition TEXT NOT NULL DEFAULT 'EXONERADO',
  igv REAL NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'BORRADOR',
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(type, series, number),
  FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE SET NULL,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS expenses (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  detail TEXT NOT NULL,
  amount REAL NOT NULL,
  method TEXT NOT NULL,
  source TEXT NOT NULL,
  receipt TEXT,
  category TEXT,
  person TEXT,
  type TEXT,
  closed INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cash_sessions (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  opening_cash REAL NOT NULL DEFAULT 0,
  opened_at TEXT NOT NULL,
  closing_cash REAL NOT NULL DEFAULT 0,
  difference REAL NOT NULL DEFAULT 0,
  income_total REAL NOT NULL DEFAULT 0,
  expense_total REAL NOT NULL DEFAULT 0,
  closed_at TEXT
);

CREATE TABLE IF NOT EXISTS petty_cash_allocations (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL UNIQUE,
  amount REAL NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS app_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS audit_events (
  id TEXT PRIMARY KEY,
  event_date TEXT NOT NULL,
  action TEXT NOT NULL,
  detail TEXT NOT NULL,
  patient_id TEXT,
  user_id TEXT,
  user_name TEXT,
  user_role TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
