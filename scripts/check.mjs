#!/usr/bin/env node
/*
 * Checks the built site in docs/ (what Cloudflare serves). Zero dependencies.
 *   npm run check
 * - every local href/src in every HTML page resolves to a real file
 * - every JSON-LD block parses
 * - sitemap.xml is well-formed and lists only URLs that exist, and every indexable page
 * - titles and meta descriptions are present, unique and not too long
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DOCS = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "docs");
const errors = [];
const err = (m) => errors.push(m);

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
const files = walk(DOCS);
const pages = files.filter((f) => f.endsWith(".html"));
const relp = (f) => path.relative(DOCS, f).replace(/\\/g, "/");

// Cloudflare serves /x for x.html and /dir/ for dir/index.html
function urlToFile(u) {
  const p = decodeURIComponent(new URL(u).pathname).replace(/^\//, "");
  const candidates = p === "" || p.endsWith("/") ? [p + "index.html"] : [p, p + ".html"];
  return candidates.map((c) => path.join(DOCS, c)).find((c) => fs.existsSync(c) && fs.statSync(c).isFile());
}

const titles = new Map(), descs = new Map(), indexable = new Set();
let links = 0, jsonBlocks = 0;

for (const file of pages) {
  const html = fs.readFileSync(file, "utf8");
  const name = relp(file);

  for (const [, attr, raw] of html.matchAll(/\s(href|src)="([^"]*)"/g)) {
    if (/^(https?:|mailto:|tel:|data:|#|javascript:)/i.test(raw) || raw.includes("${")) continue;
    links++;
    const target = path.resolve(path.dirname(file), raw.split(/[?#]/)[0] || path.basename(file));
    if (!target.startsWith(DOCS) || !fs.existsSync(target)) err(`${name}: broken ${attr}="${raw}"`);
  }

  for (const [, json] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    jsonBlocks++;
    try {
      const data = JSON.parse(json);
      const types = (data["@graph"] || [data]).map((n) => n["@type"]);
      if (!types.includes("Organization")) err(`${name}: JSON-LD has no Organization`);
      if (name.startsWith("products/") && !(types.includes("Product") && types.includes("BreadcrumbList"))) err(`${name}: missing Product/BreadcrumbList`);
    } catch (e) { err(`${name}: JSON-LD does not parse (${e.message})`); }
  }

  const noindex = /<meta name="robots" content="[^"]*noindex/.test(html);
  const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [])[1];
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1];
  if (!title) err(`${name}: no <title>`);
  if (!desc) err(`${name}: no meta description`);
  if (noindex) continue;
  indexable.add(name);
  if (!/<h1[\s>]/.test(html)) err(`${name}: no <h1>`);
  if (!/<link rel="canonical" href="https:\/\/[^"]+">/.test(html)) err(`${name}: no canonical`);
  if (desc && desc.length > 160) err(`${name}: meta description is ${desc.length} chars`);
  for (const [map, v, label] of [[titles, title, "title"], [descs, desc, "description"]]) {
    if (map.has(v)) err(`${name}: same ${label} as ${map.get(v)}`); else map.set(v, name);
  }
}

// sitemap
const sm = fs.readFileSync(path.join(DOCS, "sitemap.xml"), "utf8");
if (!/^<\?xml version="1\.0" encoding="UTF-8"\?>\s*<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">[\s\S]*<\/urlset>\s*$/.test(sm)) err("sitemap.xml: bad wrapper");
const stripped = sm.replace(/<\?xml[^>]*\?>/, "").replace(/<url><loc>[^<&]+<\/loc><lastmod>\d{4}-\d{2}-\d{2}<\/lastmod><\/url>/g, "")
  .replace(/<\/?urlset[^>]*>/g, "").trim();
if (stripped) err(`sitemap.xml: unexpected content: ${stripped.slice(0, 80)}`);
const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const listed = new Set();
for (const loc of locs) {
  const f = urlToFile(loc);
  if (!f) { err(`sitemap.xml: ${loc} has no file`); continue; }
  listed.add(relp(f));
  if (!indexable.has(relp(f))) err(`sitemap.xml: ${loc} is noindex`);
}
for (const p of indexable) if (!listed.has(p)) err(`sitemap.xml: missing ${p}`);
if (new Set(locs).size !== locs.length) err("sitemap.xml: duplicate URLs");

const robots = fs.readFileSync(path.join(DOCS, "robots.txt"), "utf8");
if (!/^Sitemap: https:\/\/\S+\/sitemap\.xml$/m.test(robots)) err("robots.txt: no Sitemap line");

console.log(`checked ${pages.length} pages, ${links} local links, ${jsonBlocks} JSON-LD blocks, ${locs.length} sitemap URLs`);
if (errors.length) { console.error(errors.map((e) => "  ✗ " + e).join("\n")); process.exit(1); }
console.log("all checks passed");
