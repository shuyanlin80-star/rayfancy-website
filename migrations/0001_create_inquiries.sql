CREATE TABLE IF NOT EXISTS inquiries (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  company TEXT,
  email TEXT NOT NULL,
  inquiry_type TEXT,
  message TEXT NOT NULL,
  country TEXT,
  quantity TEXT,
  product_interest TEXT,
  source_page TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries (created_at);
CREATE INDEX IF NOT EXISTS idx_inquiries_email ON inquiries (email);
