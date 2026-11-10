/*
 * NXT Peptides Canada: API Worker.
 * Static pages are served from docs/ by the assets binding. Every request except /assets/* runs this
 * code first (run_worker_first in wrangler.jsonc) so old URLs get a 301 to their canonical page
 * (worker/redirects.js) before the asset lookup.
 *
 *   POST /api/order       store an order (totals recomputed here) and email the owner
 *   POST /api/subscribe   store a newsletter signup
 *   GET  /api/admin/export?type=orders|subscribers   CSV download, needs ADMIN_TOKEN
 *
 * Bindings: DB (D1), ORDER_EMAIL (send_email), ADMIN_TOKEN (secret).
 */
import { EmailMessage } from "cloudflare:email";
import { CONFIG, PRODUCTS } from "./catalogue.js";
import { redirectFor } from "./redirects.js";

const MAX_BODY = 10_000;
const PROVINCES = Object.keys(CONFIG.taxRates);
const COINS = { BTC: ["bitcoin", 8], ETH: ["ethereum", 6], USDT: ["tether", 2] };
const EMAIL_RE = /^[^\s@<>"]{1,64}@[^\s@<>"]{1,190}\.[a-z]{2,}$/i;
const POSTAL_RE = /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/;

const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
});
const round2 = (n) => Math.round(n * 100) / 100;
const money = (n) => `$${n.toFixed(2)}`;
const clean = (v, max) => String(v ?? "").replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    try {
      if (url.pathname === "/api/order" && request.method === "POST") return await order(request, env, ctx);
      if (url.pathname === "/api/subscribe" && request.method === "POST") return await subscribe(request, env);
      if (url.pathname === "/api/admin/export" && request.method === "GET") return await exportCsv(request, env, url);
      if (url.pathname.startsWith("/api/")) return json({ error: "Not found" }, 404);
      if (request.method === "GET" || request.method === "HEAD") {
        const to = redirectFor(url);
        if (to) return Response.redirect(new URL(to, url.origin).toString(), 301);
      }
      return env.ASSETS.fetch(request);
    } catch (e) {
      console.error(e);
      return json({ error: "Something went wrong on our side. Please try again." }, 500);
    }
  }
};

async function readJson(request) {
  const len = +request.headers.get("content-length") || 0;
  if (len > MAX_BODY) return null;
  const text = await request.text();
  if (text.length > MAX_BODY) return null;
  try { const v = JSON.parse(text); return v && typeof v === "object" ? v : null; } catch { return null; }
}

const ipOf = (request) => request.headers.get("cf-connecting-ip") || "";

/* simple per-IP limit, counted in D1 so it holds across Worker instances */
async function tooMany(env, table, ip, max, minutes) {
  if (!ip) return false;
  const since = new Date(Date.now() - minutes * 60e3).toISOString();
  const row = await env.DB.prepare(`SELECT COUNT(*) AS n FROM ${table} WHERE ip = ? AND created_at > ?`).bind(ip, since).first();
  return (row?.n || 0) >= max;
}

/* same arithmetic as the cart page in assets/js/site.js */
function totals(items, first, province) {
  const sub = round2(items.reduce((a, i) => a + PRODUCTS[i.id].price * i.qty, 0));
  const off = first ? round2(sub * CONFIG.firstOrderDiscount) : 0;
  const ship = sub >= CONFIG.freeShippingThreshold || sub === 0 ? 0 : CONFIG.flatShipping;
  const rate = CONFIG.taxRates[province];
  const tax = rate ? round2((sub - off + ship) * rate) : 0;
  return { sub, off, ship, rate, tax, total: round2(sub - off + ship + tax) };
}

/* CAD per coin: CoinGecko first, Coinbase as fallback (CoinGecko's free tier 429s shared IPs), cached 60 s */
const RATE_SOURCES = [
  (coin, id) => [`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=cad`, (j) => j?.[id]?.cad],
  (coin) => [`https://api.coinbase.com/v2/exchange-rates?currency=${coin}`, (j) => +j?.data?.rates?.CAD]
];

async function cadRate(coin) {
  const [id] = COINS[coin];
  const key = new Request(`https://rates.internal/${coin}`);
  const cache = typeof caches !== "undefined" ? caches.default : null;
  const hit = cache && await cache.match(key);
  if (hit) return +(await hit.text());
  for (const src of RATE_SOURCES) {
    const [url, pick] = src(coin, id);
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(3000), headers: { accept: "application/json", "user-agent": `${CONFIG.domain} checkout` } });
      const cad = r.ok ? pick(await r.json()) : 0;
      if (cad > 0) {
        if (cache) await cache.put(key, new Response(String(cad), { headers: { "cache-control": "max-age=60" } }));
        return cad;
      }
      console.warn("no CAD rate", coin, new URL(url).host, r.status);
    } catch (e) { console.warn("rate lookup failed", coin, new URL(url).host, String(e)); }
  }
  return 0;
}

async function cryptoAmount(coin, totalCad) {
  const cad = await cadRate(coin);
  return cad > 0 ? (totalCad / cad).toFixed(COINS[coin][1]) : "";
}

function orderNumber() {
  const rnd = crypto.getRandomValues(new Uint8Array(2));
  return `NXT-${Date.now().toString(36).toUpperCase()}${[...rnd].map((b) => (b % 36).toString(36)).join("").toUpperCase()}`;
}

async function order(request, env, ctx) {
  const b = await readJson(request);
  if (!b) return json({ error: "Invalid request." }, 400);
  if (b.website) return json({ ok: true, order: orderNumber(), total: 0, amount: "" }); // honeypot: pretend success

  const f = {
    name: clean(b.name, 120), email: clean(b.email, 254).toLowerCase(), address: clean(b.address, 200),
    city: clean(b.city, 80), province: clean(b.province, 2).toUpperCase(), postal: clean(b.postal, 7).toUpperCase(),
    pay: clean(b.pay, 4).toUpperCase(), first: b.first === true
  };
  const problems = [];
  if (!f.name) problems.push("name");
  if (!EMAIL_RE.test(f.email)) problems.push("email");
  if (!f.address) problems.push("street address");
  if (!f.city) problems.push("city");
  if (!PROVINCES.includes(f.province)) problems.push("province");
  if (!POSTAL_RE.test(f.postal)) problems.push("postal code");
  if (!COINS[f.pay]) problems.push("payment method");
  if (b.confirm !== true) problems.push("research-use confirmation");

  const merged = new Map();
  for (const i of Array.isArray(b.items) ? b.items.slice(0, 50) : []) {
    const id = String(i?.id), qty = Math.floor(+i?.qty);
    if (!Object.hasOwn(PRODUCTS, id) || !(qty >= 1 && qty <= 99)) return json({ error: "Your cart contains an item we don't recognise. Please refresh the page and try again." }, 400);
    merged.set(id, Math.min(99, (merged.get(id) || 0) + qty));
  }
  const items = [...merged].map(([id, qty]) => ({ id, qty }));
  if (!items.length) problems.push("cart items");
  if (problems.length) return json({ error: `Please check: ${problems.join(", ")}.` }, 400);

  const ip = ipOf(request);
  if (await tooMany(env, "orders", ip, 5, 15)) return json({ error: "Too many orders from this connection. Please wait a few minutes or contact us." }, 429);

  const t = totals(items, f.first, f.province);
  const amount = await cryptoAmount(f.pay, t.total);
  const id = orderNumber(), now = new Date().toISOString();
  const lines = items.map((i) => ({ id: i.id, name: PRODUCTS[i.id].name, size: PRODUCTS[i.id].size, price: PRODUCTS[i.id].price, qty: i.qty }));
  const wallet = CONFIG.wallets[f.pay] || "";

  await env.DB.prepare(`INSERT INTO orders
    (id, created_at, status, name, email, address, city, province, postal, pay, crypto_amount, wallet, first_order,
     items_json, subtotal, discount, shipping, tax, total, ip)
    VALUES (?, ?, 'awaiting_payment', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .bind(id, now, f.name, f.email, f.address, f.city, f.province, f.postal, f.pay, amount, wallet, f.first ? 1 : 0,
      JSON.stringify(lines), t.sub, t.off, t.ship, t.tax, t.total, ip)
    .run();

  ctx.waitUntil(notifyOwner(env, { id, now, f, t, lines, amount, wallet }).catch((e) => console.error("order email failed", id, e)));
  return json({ ok: true, order: id, total: t.total, amount, coin: f.pay, wallet });
}

async function subscribe(request, env) {
  const b = await readJson(request);
  if (!b) return json({ error: "Invalid request." }, 400);
  if (b.website) return json({ ok: true });
  const email = clean(b.email, 254).toLowerCase();
  if (!EMAIL_RE.test(email)) return json({ error: "Please enter a valid email address." }, 400);
  const ip = ipOf(request);
  if (await tooMany(env, "subscribers", ip, 10, 60)) return json({ error: "Too many signups from this connection. Please try later." }, 429);
  await env.DB.prepare("INSERT INTO subscribers (email, created_at, ip, source) VALUES (?, ?, ?, ?) ON CONFLICT(email) DO NOTHING")
    .bind(email, new Date().toISOString(), ip, clean(b.source, 40) || "home").run();
  return json({ ok: true });
}

/* ---------- owner email ---------- */
function orderText({ id, now, f, t, lines, amount, wallet }) {
  return [
    `New order ${id}`, `Placed: ${now}`, "",
    ...lines.map((l) => `${l.qty} x ${l.name} ${l.size} @ ${money(l.price)}`), "",
    `Subtotal: ${money(t.sub)}`, ...(t.off ? [`First-order discount: -${money(t.off)}  (check this email hasn't ordered before)`] : []),
    `Shipping: ${t.ship ? money(t.ship) : "Free"}`, `GST/HST (${f.province}): ${money(t.tax)}`, `Total: ${money(t.total)} ${CONFIG.currency}`, "",
    `Payment: ${amount ? `${amount} ${f.pay}` : `${f.pay} (no live rate; email the customer the exact amount)`}`,
    ...(wallet ? [`Wallet: ${wallet}`] : []), "",
    `Name: ${f.name}`, `Email: ${f.email}`, `Ship to: ${f.address}, ${f.city}, ${f.province} ${f.postal}`, "",
    "Customer confirmed: 18+ and laboratory research use only."
  ].join("\n");
}

const b64 = (s) => btoa(String.fromCharCode(...new TextEncoder().encode(s)));
const b64Lines = (s) => b64(s).replace(/.{1,76}/g, "$&\r\n");

async function notifyOwner(env, o) {
  if (!env.ORDER_EMAIL) { console.log(orderText(o)); return; }
  const from = env.ORDER_FROM || `orders@${CONFIG.domain}`;
  const to = env.ORDER_TO;
  const raw = [
    `From: NXT Canada Orders <${from}>`,
    `To: ${to}`,
    `Reply-To: ${o.f.email}`,
    `Subject: =?UTF-8?B?${b64(`New order ${o.id}: ${money(o.t.total)} (${o.f.pay})`)}?=`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${o.id}.${Date.now()}@${CONFIG.domain}>`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=utf-8",
    "Content-Transfer-Encoding: base64",
    "", b64Lines(orderText(o))
  ].join("\r\n");
  await env.ORDER_EMAIL.send(new EmailMessage(from, to, raw));
}

/* ---------- admin CSV export ---------- */
function sameToken(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

const csvCell = (v) => {
  let s = v == null ? "" : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; // stop spreadsheet formula injection
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

async function exportCsv(request, env, url) {
  const auth = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || url.searchParams.get("token") || "";
  if (!sameToken(auth, env.ADMIN_TOKEN || "")) return json({ error: "Unauthorized" }, 401);
  const type = url.searchParams.get("type");
  const sql = { orders: "SELECT * FROM orders ORDER BY created_at DESC", subscribers: "SELECT email, created_at, source FROM subscribers ORDER BY created_at DESC" }[type];
  if (!sql) return json({ error: "type must be orders or subscribers" }, 400);
  const { results } = await env.DB.prepare(sql).all();
  const cols = results.length ? Object.keys(results[0]) : [];
  const body = [cols.join(","), ...results.map((r) => cols.map((c) => csvCell(r[c])).join(","))].join("\r\n");
  return new Response("﻿" + body, {
    headers: {
      "content-type": "text/csv; charset=utf-8", "cache-control": "no-store",
      "content-disposition": `attachment; filename="nxt-${type}-${new Date().toISOString().slice(0, 10)}.csv"`
    }
  });
}
