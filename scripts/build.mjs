#!/usr/bin/env node
/*
 * NXT Peptides Canada: static build. Zero dependencies (Node 18+).
 *
 *   npm run build        (or: node scripts/build.mjs)
 *
 * The HTML files in the repo root are the source. This script:
 *   1. fills every <!-- nxt:NAME -->...<!-- /nxt:NAME --> region in the root pages
 *      (head tags, header/nav, footer, product grids, JSON-LD) from assets/js/data.js,
 *      using the same templates the browser uses (assets/js/render.js);
 *   2. generates products/<id>.html for every product from templates/product.html;
 *   3. writes robots.txt, sitemap.xml and the favicons;
 *   4. mirrors the deployable files into docs/ (what Cloudflare serves).
 *
 * Only the marked regions are rewritten, so everything outside them stays hand-editable.
 * Running it twice gives identical output. Sitemap lastmod dates only move when a page's
 * HTML actually changes (tracked in scripts/lastmod.json).
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import * as icons from "./lib/icons.mjs";
import * as SCI from "../content/science.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DOCS = path.join(ROOT, "docs");
const rel = (...p) => path.join(ROOT, ...p);
const readText = (f) => fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n");
const fail = (msg) => { console.error(`build failed: ${msg}`); process.exit(1); };
// write text with the line endings the checkout already uses (CRLF on Windows with autocrlf)
const EOL = fs.readFileSync(rel("index.html"), "utf8").includes("\r\n") ? "\r\n" : "\n";

/* ---------- catalogue: run data.js + render.js exactly as the browser does ---------- */
const sandbox = {};
sandbox.window = sandbox;
vm.createContext(sandbox);
for (const f of ["assets/js/data.js", "assets/js/render.js"]) vm.runInContext(readText(rel(f)), sandbox, { filename: f });
const { NXT_CONFIG: C, NXT_PRODUCTS: P, NXT_CATEGORIES: CATS, NXT_RENDER: R } = sandbox;
const { esc } = R;

const SITE = `https://${C.domain}`;
const YEAR = new Date().getFullYear();
const TODAY = new Date().toISOString().slice(0, 10);

{
  const seen = new Set();
  for (const p of P) {
    if (!/^[a-z0-9-]+$/.test(p.id)) fail(`product id "${p.id}" must be lowercase letters, digits and dashes`);
    if (seen.has(p.id)) fail(`duplicate product id "${p.id}"`);
    seen.add(p.id);
    if (!CATS.some((c) => c.id === p.cat)) fail(`${p.id}: unknown category "${p.cat}"`);
    if (p.img && !fs.existsSync(rel("assets/img", p.img))) fail(`${p.id}: missing image assets/img/${p.img}`);
  }
  for (const c of CATS) {
    if (!c.slug || !/^[a-z0-9-]+$/.test(c.slug)) fail(`category "${c.id}" needs a lowercase slug`);
    for (const k of ["h1", "title", "desc", "intro"]) if (!c[k]) fail(`category "${c.id}" is missing ${k}`);
  }
  if (new Set(CATS.map((c) => c.slug)).size !== CATS.length) fail("duplicate category slug");
  if (C.cfAnalyticsToken && !/^[A-Za-z0-9]+$/.test(C.cfAnalyticsToken)) fail("cfAnalyticsToken should be the bare token from the Cloudflare snippet");
}

/* ---------- product science content (content/science.mjs) ---------- */
for (const [id, s] of Object.entries(SCI.PRODUCTS)) {
  if (!P.some((p) => p.id === id)) fail(`content/science.mjs: unknown product "${id}"`);
  for (const [c] of s.compounds) if (!SCI.COMPOUNDS[c]) fail(`content/science.mjs: ${id} uses unknown compound "${c}"`);
  for (const para of s.overview) for (const [, k] of para.matchAll(/\[ref:(\w+)\]/g)) if (!SCI.REFS[k]) fail(`content/science.mjs: unknown reference "${k}"`);
}
const pendingCompounds = Object.entries(SCI.COMPOUNDS).filter(([, c]) => c.pending).map(([, c]) => c.name);

// Specifications, research overview and FAQ below the buy box. Returns "" for products without content.
function productScience(p, root) {
  const s = SCI.PRODUCTS[p.id];
  if (!s) return "";
  const order = [];
  const cite = (k) => { if (!order.includes(k)) order.push(k); const n = order.indexOf(k) + 1; return `<sup><a href="#ref-${n}" class="cite">[${n}]</a></sup>`; };
  const overview = s.overview.map((para) => `<p>${para.replace(/\s*\[ref:(\w+)\]/g, (_, k) => cite(k))}</p>`).join("");
  const blend = s.compounds.length > 1;
  const tables = s.compounds.map(([id, mg]) => {
    const c = SCI.COMPOUNDS[id];
    const rows = c.pending
      ? [["Identity", "Confirmed by mass spectrometry; see the batch certificate of analysis"]]
      : c.rows;
    return `<div class="sci-card"><h3>${esc(c.name)}${mg ? ` <span class="muted" style="font-weight:400">${esc(mg)}</span>` : ""}</h3>
      <table class="specs">${rows.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join("")}</table>
      ${c.cid ? `<p class="small muted">Source: <a class="link" href="https://pubchem.ncbi.nlm.nih.gov/compound/${c.cid}" rel="noopener" target="_blank">PubChem CID ${c.cid}</a></p>` : ""}</div>`;
  }).join("");
  const refs = order.map((k, i) => {
    const r = SCI.REFS[k];
    return `<li id="ref-${i + 1}">${esc(r.cite)} <a class="link" href="https://pubmed.ncbi.nlm.nih.gov/${r.pmid}/" rel="noopener" target="_blank">PubMed ${r.pmid}</a></li>`;
  }).join("");
  const faq = s.faq.map((x) => `<details class="faq"><summary>${esc(x.q)}</summary><p>${esc(x.a)}</p></details>`).join("");
  return `
  <section class="pdp-more">
    <h2>${blend ? "Composition &amp; specifications" : "Specifications"}</h2>
    ${s.composition ? `<p class="muted">${esc(s.composition)}</p>` : ""}
    <div class="sci-grid">${tables}</div>
    <h2>Research overview</h2>
    <div class="prose">${overview}</div>
    <h3 class="refs-head">References</h3>
    <ol class="refs small">${refs}</ol>
    <h2>${esc(p.name)} FAQ</h2>
    ${faq}
    <p class="ruo">For laboratory research use only. Not for human or veterinary use. Not authorized by Health Canada. We do not provide dosing or usage guidance.</p>
  </section>
`;
}

/* ---------- compliance guard: phrases that must never appear in titles, descriptions or schema ---------- */
const FORBIDDEN = [/made in canada/i, /pharmaceutical[- ]grade/i, /health canada approved/i, /(?<!not )for human use/i];
const forbidden = (s) => FORBIDDEN.find((re) => re.test(s));
const guard = (where, s) => { const re = forbidden(s); if (re) fail(`${where} contains a forbidden phrase (${re})`); };

/* ---------- helpers ---------- */
const decode = (s) => s.replace(/&(amp|lt|gt|quot|#39);/g, (_, e) => ({ amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'" }[e]));
const plain = (html) => decode(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
const pageUrl = (file) => `${SITE}/${file.replace(/(^|\/)index\.html$/, "$1").replace(/\.html$/, "")}`;
const imgUrl = (p) => `${SITE}/assets/img/${p.img || "vial.svg"}`;
const jsonld = (graph) => JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
const telephone = (s) => { const d = s.replace(/\D/g, ""); return d.length === 11 && d[0] === "1" ? `+1-${d.slice(1, 4)}-${d.slice(4, 7)}-${d.slice(7)}` : s; };

function jpegSize(file) {
  const b = fs.readFileSync(file);
  for (let i = 2; i < b.length - 9;) {
    if (b[i] !== 0xff) { i++; continue; }
    const m = b[i + 1];
    if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m)) return { w: b.readUInt16BE(i + 7), h: b.readUInt16BE(i + 5) };
    i += 2 + b.readUInt16BE(i + 2);
  }
  return null;
}

const HERO = { url: `${SITE}/assets/img/hero.jpg`, ...jpegSize(rel("assets/img/hero.jpg")), alt: "NXT research peptide vials" };
// og:image must be a raster image (Facebook and WhatsApp ignore SVG), so vial.svg products fall back to the hero
function ogImage(p) {
  if (!p || !p.img || !/\.jpe?g$/i.test(p.img)) return HERO;
  return { url: imgUrl(p), ...jpegSize(rel("assets/img", p.img)), alt: `${p.name} ${p.size} vial` };
}

/* ---------- product page copy ---------- */
const productTitle = (p) => `${p.name} ${p.size} | ${p.cat === "supplies" ? "Research Lab Supplies" : "UK-Tested Research Peptide"} | ${C.brand}`;

function productDescription(p, max = 155) {
  const lead = `${p.name} ${p.size}: ${p.tagline.replace(/\.$/, "")}. `;
  const tail = p.cat === "supplies" ? " For laboratory research use only." : " UK-tested. For research use only.";
  let body = p.desc.split(/(?<=\.)\s+/)[0];
  const room = max - lead.length - tail.length;
  if (body.length > room) {
    body = body.slice(0, room - 1);
    body = body.slice(0, body.lastIndexOf(" ")).replace(/[\s,;:(-]+$/, "") + "…";
    if (room < 30) body = "";
  }
  return (lead + body + tail).replace(/\s+/g, " ").trim();
}

/* ---------- JSON-LD ---------- */
const ORG_ID = `${SITE}/#organization`;
const organization = {
  "@type": "Organization",
  "@id": ORG_ID,
  name: C.brand,
  url: `${SITE}/`,
  logo: { "@type": "ImageObject", url: `${SITE}/icon-512.png`, width: 512, height: 512 },
  email: C.email,
  telephone: telephone(C.phone),
  sameAs: [C.facebook].filter(Boolean)
};

function productProperties(p) {
  const s = SCI.PRODUCTS[p.id];
  if (!s || s.compounds.length !== 1) return {};
  const c = SCI.COMPOUNDS[s.compounds[0][0]];
  if (c.pending || !c.cas) return {};
  return { additionalProperty: [
    { "@type": "PropertyValue", name: "CAS number", value: c.cas },
    { "@type": "PropertyValue", name: "Molecular weight", value: c.mw, unitText: "g/mol" }
  ] };
}

function productSchema(p, url) {
  return [
    {
      "@type": "Product",
      "@id": `${url}#product`,
      name: `${p.name} ${p.size}`,
      image: [imgUrl(p)],
      description: p.desc,
      sku: p.id,
      ...productProperties(p),
      category: R.catName(p.cat),
      brand: { "@type": "Brand", name: "NXT" },
      offers: {
        "@type": "Offer",
        url,
        price: p.price.toFixed(2),
        priceCurrency: "CAD",
        availability: "https://schema.org/InStock",
        itemCondition: "https://schema.org/NewCondition",
        seller: { "@id": ORG_ID }
      }
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: "Shop", item: pageUrl("shop.html") },
        { "@type": "ListItem", position: 3, name: R.catName(p.cat), item: pageUrl(R.catHref(R.catById(p.cat))) },
        { "@type": "ListItem", position: 4, name: `${p.name} ${p.size}`, item: url }
      ]
    }
  ];
}

function categorySchema(c, url) {
  const items = P.filter((p) => p.cat === c.id);
  return [
    { "@type": "CollectionPage", "@id": `${url}#page`, url, name: c.h1, description: c.desc,
      mainEntity: { "@type": "ItemList", numberOfItems: items.length,
        itemListElement: items.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: pageUrl(R.productHref(p)), name: `${p.name} ${p.size}` })) } },
    { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Shop", item: pageUrl("shop.html") },
      { "@type": "ListItem", position: 3, name: c.name, item: url }
    ] }
  ];
}

const faqSkipped = [];
function faqSchema(html, url) {
  const qa = [...html.matchAll(/<details class="faq"><summary>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/g)]
    .map(([, q, a]) => ({ q: plain(q), a: plain(a) }));
  if (!qa.length) return [];
  const kept = qa.filter((x) => {
    if (forbidden(x.q + " " + x.a)) { faqSkipped.push(x.q); return false; }
    return true;
  });
  return [{
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    url,
    mainEntity: kept.map((x) => ({ "@type": "Question", name: x.q, acceptedAnswer: { "@type": "Answer", text: x.a } }))
  }];
}

/* ---------- <head> tags ---------- */
// Pages that need something other than the defaults
const PAGE_OPTS = {
  "product.html": { analytics: false, schema: false } // client-side redirect stub for old ?id= links
};

function headBlock({ root, url, title, description, image, type, noindex, graph, analytics }) {
  const L = [];
  if (!noindex) {
    L.push(
      `<link rel="canonical" href="${url}">`,
      `<meta property="og:type" content="${type}">`,
      `<meta property="og:site_name" content="${esc(C.brand)}">`,
      `<meta property="og:title" content="${esc(title)}">`,
      `<meta property="og:description" content="${esc(description)}">`,
      `<meta property="og:url" content="${url}">`,
      `<meta property="og:image" content="${image.url}">`,
      ...(image.w ? [`<meta property="og:image:width" content="${image.w}">`, `<meta property="og:image:height" content="${image.h}">`] : []),
      `<meta property="og:image:alt" content="${esc(image.alt)}">`,
      `<meta property="og:locale" content="en_CA">`,
      `<meta name="twitter:card" content="summary_large_image">`
    );
  }
  L.push(
    `<link rel="icon" href="${root}favicon.ico" sizes="48x48">`,
    `<link rel="icon" href="${root}favicon.svg" type="image/svg+xml">`,
    `<link rel="apple-touch-icon" href="${root}apple-touch-icon.png">`,
    `<meta name="theme-color" content="#111316">`
  );
  if (graph) L.push(`<script type="application/ld+json">${jsonld(graph)}</script>`);
  if (analytics && C.cfAnalyticsToken) {
    L.push(`<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "${C.cfAnalyticsToken}"}'></script>`);
  }
  return `\n${L.join("\n")}\n`;
}

/* ---------- page rendering ---------- */
function renderPage(html, { file, root, product, category }) {
  const opts = { analytics: true, schema: true, ...PAGE_OPTS[file] };
  const page = (html.match(/<body[^>]*\bdata-page="([^"]+)"/) || [])[1];
  if (!page) fail(`${file}: <body> has no data-page`);
  const title = decode((html.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || "");
  const description = decode((html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || "");
  if (!title || !description) fail(`${file}: needs a <title> and a meta description`);
  const noindex = /<meta name="robots" content="[^"]*noindex/.test(html);
  const url = pageUrl(file);
  guard(`${file} <title>`, title);
  guard(`${file} meta description`, description);

  let graph = null;
  if (opts.schema) {
    graph = [organization, ...(product ? productSchema(product, url) : []), ...(category ? categorySchema(category, url) : []), ...faqSchema(product ? html + productScience(product, root) : html, url)];
    guard(`${file} JSON-LD`, JSON.stringify(graph));
  }

  const GEN = {
    head: () => headBlock({ root, url, title, description, image: ogImage(product), type: product ? "product" : "website", noindex, graph, analytics: opts.analytics }),
    header: () => R.header(page, root),
    footer: () => R.footer(root, YEAR),
    best: () => R.cards(P.filter((p) => p.best), root),
    cats: () => R.catTiles(root),
    "all-count": () => esc(R.allCount()),
    chips: () => R.chips(),
    grid: () => R.cards(P, root),
    "result-count": () => esc(R.resultCount(P.length)),
    "lab-name": () => esc(R.labName()),
    "coa-rows": () => R.coaRows(root),
    pdp: () => R.pdp(product, root),
    "pdp-more": () => productScience(product, root),
    related: () => R.cards(R.related(product), root),
    crumb: () => `<a href="${R.catHref(R.catById(product.cat), root)}">${esc(R.catName(product.cat))}</a> / ${esc(product.name)}`,
    "cat-intro": () => category.intro.replaceAll("{{ROOT}}", root),
    "cat-grid": () => R.cards(P.filter((p) => p.cat === category.id), root)
  };

  const names = [...html.matchAll(/<!-- nxt:([\w-]+) -->/g)].map((m) => m[1]);
  for (const name of names) {
    if (!GEN[name]) fail(`${file}: unknown region nxt:${name}`);
    if (["pdp", "pdp-more", "related", "crumb"].includes(name) && !product) fail(`${file}: nxt:${name} only works on product pages`);
    if (["cat-intro", "cat-grid"].includes(name) && !category) fail(`${file}: nxt:${name} only works on category pages`);
    const re = new RegExp(`(<!-- nxt:${name} -->)[\\s\\S]*?(<!-- /nxt:${name} -->)`);
    if (!re.test(html)) fail(`${file}: nxt:${name} has no closing <!-- /nxt:${name} -->`);
    const out = GEN[name]();
    html = html.replace(re, (_, open, close) => open + out + close);
  }
  return { html, url, noindex };
}

/* ---------- build everything in memory ---------- */
const outputs = new Map(); // site-relative path -> string | Buffer
const indexable = []; // { url, file }

const rootPages = fs.readdirSync(ROOT).filter((f) => f.endsWith(".html")).sort();
for (const file of rootPages) {
  const r = renderPage(readText(rel(file)), { file, root: "" });
  outputs.set(file, r.html);
  if (!r.noindex) indexable.push({ url: r.url, file });
}
// home page first in the sitemap
indexable.sort((a, b) => (a.file === "index.html" ? -1 : b.file === "index.html" ? 1 : a.file.localeCompare(b.file)));

const template = readText(rel("templates/product.html"));
for (const p of P) {
  const file = `products/${p.id}.html`;
  const title = productTitle(p);
  const description = productDescription(p);
  let html = template
    .replaceAll("{{ROOT}}", "../")
    .replaceAll("{{TITLE}}", esc(title))
    .replaceAll("{{DESCRIPTION}}", esc(description))
    .replaceAll("{{ID}}", p.id);
  if (html.includes("{{")) fail(`templates/product.html: unknown placeholder ${html.match(/\{\{\w*\}\}/)}`);
  const r = renderPage(html, { file, root: "../", product: p });
  outputs.set(file, r.html);
  indexable.push({ url: r.url, file });
}

const catTemplate = readText(rel("templates/category.html"));
for (const c of CATS) {
  const file = `category/${c.slug}.html`;
  guard(`${file} intro`, c.intro);
  const title = `${c.title} | ${C.brand}`.length <= 75 ? `${c.title} | ${C.brand}` : c.title;
  let html = catTemplate
    .replaceAll("{{ROOT}}", "../")
    .replaceAll("{{TITLE}}", esc(title))
    .replaceAll("{{DESCRIPTION}}", esc(c.desc))
    .replaceAll("{{H1}}", esc(c.h1))
    .replaceAll("{{NAME}}", esc(c.name))
    .replaceAll("{{CAT}}", c.id);
  if (html.includes("{{")) fail(`templates/category.html: unknown placeholder ${html.match(/{{w*}}/)}`);
  const r = renderPage(html, { file, root: "../", category: c });
  outputs.set(file, r.html);
  indexable.push({ url: r.url, file });
}

/* ---------- lastmod: only changes when a page's HTML changes ---------- */
const LASTMOD_FILE = rel("scripts/lastmod.json");
const oldLastmod = fs.existsSync(LASTMOD_FILE) ? JSON.parse(fs.readFileSync(LASTMOD_FILE, "utf8")) : {};
const lastmod = {};
for (const { url, file } of indexable) {
  const hash = crypto.createHash("sha256").update(outputs.get(file)).digest("hex").slice(0, 16);
  const prev = oldLastmod[url];
  lastmod[url] = prev && prev.hash === hash ? prev : { hash, lastmod: TODAY };
}

outputs.set("sitemap.xml", [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...indexable.map(({ url }) => `  <url><loc>${esc(url)}</loc><lastmod>${lastmod[url].lastmod}</lastmod></url>`),
  "</urlset>",
  ""
].join("\n"));

outputs.set("robots.txt", [
  "User-agent: *",
  "Allow: /",
  "Disallow: /cart.html",
  "Disallow: /cart",
  "",
  `Sitemap: ${SITE}/sitemap.xml`,
  ""
].join("\n"));

// IndexNow ownership file (see scripts/indexnow.mjs)
if (C.indexNowKey) {
  if (!/^[a-f0-9]{32}$/.test(C.indexNowKey)) fail("indexNowKey must be 32 hex characters");
  outputs.set(`${C.indexNowKey}.txt`, C.indexNowKey);
}
outputs.set("favicon.svg", icons.svg());
outputs.set("favicon.ico", icons.ico([16, 32, 48]));
outputs.set("apple-touch-icon.png", icons.png(180, { rounded: false }));
outputs.set("icon-512.png", icons.png(512, { rounded: false }));

/* ---------- write: root + docs mirror ---------- */
let changed = 0;
function write(abs, content) {
  const buf = Buffer.isBuffer(content) ? content : Buffer.from(content.replace(/\n/g, EOL), "utf8");
  if (fs.existsSync(abs) && fs.readFileSync(abs).equals(buf)) return;
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, buf);
  changed++;
  console.log(`  wrote ${path.relative(ROOT, abs).replace(/\\/g, "/")}`);
}

// Internal links use clean URLs (/shop, /products/bpc157, ../): Cloudflare 307-redirects x.html to /x,
// and every .html link would show up in Search Console as "Page with redirect".
function cleanLinks(html) {
  return html.replace(/(\shref=")((?:\.\.\/)*)([^":?#]*?)\.html([?#][^"]*)?"/g, (m, pre, up, p, rest = "") => {
    if (p === "index") return `${pre}${up || "./"}${rest}"`;
    if (p.endsWith("/index")) return `${pre}${up}${p.slice(0, -5)}${rest}"`;
    return `${pre}${up}${p}${rest}"`;
  });
}
for (const [file, c] of outputs) if (file.endsWith(".html") && typeof c === "string") outputs.set(file, cleanLinks(c));

for (const [file, content] of outputs) {
  write(rel(file), content);
  write(path.join(DOCS, file), content);
}

// the API Worker's copy of prices and checkout rules, so server-side totals match the cart page
write(rel("worker/catalogue.js"), [
  "// Generated by scripts/build.mjs from assets/js/data.js. Do not edit.",
  `export const CONFIG = ${JSON.stringify({
    domain: C.domain, currency: C.currency, freeShippingThreshold: C.freeShippingThreshold,
    firstOrderDiscount: C.firstOrderDiscount, flatShipping: C.flatShipping, taxRates: C.taxRates, wallets: C.wallets || {}
  }, null, 2)};`,
  `export const PRODUCTS = ${JSON.stringify(Object.fromEntries(P.map((p) => [p.id, { name: p.name, size: p.size, price: p.price }])), null, 2)};`,
  ""
].join("\n"));

// assets/ is copied byte for byte
(function mirror(dir) {
  for (const e of fs.readdirSync(rel(dir), { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) mirror(f);
    else write(path.join(DOCS, f), fs.readFileSync(rel(f)));
  }
})("assets");

// remove product pages whose product no longer exists
for (const base of [ROOT, DOCS]) for (const sub of ["products", "category"]) {
  const dir = path.join(base, sub);
  for (const f of fs.existsSync(dir) ? fs.readdirSync(dir) : []) {
    if (f.endsWith(".html") && !outputs.has(`${sub}/${f}`)) {
      fs.unlinkSync(path.join(dir, f));
      changed++;
      console.log(`  removed ${path.relative(ROOT, path.join(dir, f)).replace(/\\/g, "/")}`);
    }
  }
}

const manifest = JSON.stringify(Object.fromEntries(Object.keys(lastmod).sort().map((k) => [k, lastmod[k]])), null, 2) + "\n";
write(LASTMOD_FILE, manifest);

// anything in docs/ that the build doesn't produce is probably stale
(function stale(dir) {
  for (const e of fs.readdirSync(path.join(DOCS, dir), { withFileTypes: true })) {
    const f = path.join(dir, e.name).replace(/\\/g, "/");
    if (e.isDirectory()) stale(f);
    else if (f !== ".nojekyll" && !outputs.has(f) && !fs.existsSync(rel(f))) console.warn(`  warning: docs/${f} is not produced by the build`);
  }
})("");

if (pendingCompounds.length) console.log(`  note: chemistry hidden until confirmed against the COA: ${pendingCompounds.join(", ")} (content/science.mjs)`);
if (faqSkipped.length) console.log(`  note: FAQPage schema leaves out ${faqSkipped.length} question(s) with restricted phrases: ${faqSkipped.join(" | ")}`);
if (!C.cfAnalyticsToken) console.log("  note: no analytics beacon in the HTML (cfAnalyticsToken empty); Cloudflare automatic setup injects it at the edge");
console.log(`build: ${rootPages.length} pages + ${P.length} product pages + ${CATS.length} category pages, sitemap (${indexable.length} URLs), robots, icons. ${changed ? `${changed} file(s) changed.` : "No changes."}`);
