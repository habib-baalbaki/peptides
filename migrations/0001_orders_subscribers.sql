-- Orders placed at checkout and newsletter signups.
CREATE TABLE IF NOT EXISTS orders (
  id            TEXT PRIMARY KEY,          -- NXT-XXXXXXXX, shown to the customer
  created_at    TEXT NOT NULL,             -- ISO 8601 UTC
  status        TEXT NOT NULL DEFAULT 'awaiting_payment',
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  address       TEXT NOT NULL,
  city          TEXT NOT NULL,
  province      TEXT NOT NULL,
  postal        TEXT NOT NULL,
  pay           TEXT NOT NULL,             -- BTC | USDT | ETH
  crypto_amount TEXT,                      -- quoted amount, empty if no live rate
  wallet        TEXT,
  first_order   INTEGER NOT NULL DEFAULT 0,
  items_json    TEXT NOT NULL,             -- [{id,name,size,price,qty}]
  subtotal      REAL NOT NULL,
  discount      REAL NOT NULL,
  shipping      REAL NOT NULL,
  tax           REAL NOT NULL,
  total         REAL NOT NULL,             -- CAD
  ip            TEXT
);
CREATE INDEX IF NOT EXISTS orders_created ON orders (created_at);
CREATE INDEX IF NOT EXISTS orders_email ON orders (email);
CREATE INDEX IF NOT EXISTS orders_ip ON orders (ip, created_at);

CREATE TABLE IF NOT EXISTS subscribers (
  email      TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  ip         TEXT,
  source     TEXT
);
CREATE INDEX IF NOT EXISTS subscribers_ip ON subscribers (ip, created_at);
