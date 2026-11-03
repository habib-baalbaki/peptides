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
  if (C.cfAnalyticsToken && !/^[A-Za-z0-9]+$/.test(C.cfAnalyticsToken)) fail("cfAnalyticsToken should be the bare token from the Cloudflare snippet");
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

function productSchema(p, url) {
  return [
    {
      "@type": "Product",
      "@id": `${url}#product`,
      name: `${p.name} ${p.size}`,
      image: [imgUrl(p)],
      description: p.desc,
      sku: p.id,
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
        { "@type": "ListItem", position: 3, name: `${p.name} ${p.size}`, item: url }
      ]
    }
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
function renderPage(html, { file, root, product }) {
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
    graph = [organization, ...(product ? productSchema(product, url) : []), ...faqSchema(html, url)];
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
    related: () => R.cards(R.related(product), root),
    crumb: () => esc(product.name)
  };

  const names = [...html.matchAll(/<!-- nxt:([\w-]+) -->/g)].map((m) => m[1]);
  for (const name of names) {
    if (!GEN[name]) fail(`${file}: unknown region nxt:${name}`);
    if (["pdp", "related", "crumb"].includes(name) && !product) fail(`${file}: nxt:${name} only works on product pages`);
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

for (const [file, content] of outputs) {
  write(rel(file), content);
  write(path.join(DOCS, file), content);
}

// assets/ is copied byte for byte
(function mirror(dir) {
  for (const e of fs.readdirSync(rel(dir), { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) mirror(f);
    else write(path.join(DOCS, f), fs.readFileSync(rel(f)));
  }
})("assets");

// remove product pages whose product no longer exists
for (const base of [ROOT, DOCS]) {
  const dir = path.join(base, "products");
  for (const f of fs.existsSync(dir) ? fs.readdirSync(dir) : []) {
    if (f.endsWith(".html") && !outputs.has(`products/${f}`)) {
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

if (faqSkipped.length) console.log(`  note: FAQPage schema leaves out ${faqSkipped.length} question(s) with restricted phrases: ${faqSkipped.join(" | ")}`);
if (!C.cfAnalyticsToken) console.log("  note: NXT_CONFIG.cfAnalyticsToken is empty, so no analytics beacon was added (TODO in assets/js/data.js)");
console.log(`build: ${rootPages.length} pages + ${P.length} product pages, sitemap (${indexable.length} URLs), robots, icons. ${changed ? `${changed} file(s) changed.` : "No changes."}`);
