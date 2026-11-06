#!/usr/bin/env node
/*
 * Tell IndexNow search engines (Bing, Yandex, Seznam, Naver; Bing also feeds ChatGPT search,
 * DuckDuckGo and Yahoo) which pages changed, so they're recrawled within hours.
 * Run AFTER the site is deployed:
 *
 *   npm run indexnow            pages whose lastmod is today
 *   npm run indexnow -- --all   every URL in the sitemap (first time, or after a big change)
 *
 * Google does not use IndexNow: it reads sitemap.xml (submitted in Search Console).
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sandbox = {}; sandbox.window = sandbox; vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(ROOT, "assets/js/data.js"), "utf8"), sandbox);
const { domain, indexNowKey: key } = sandbox.NXT_CONFIG;
if (!key) { console.error("NXT_CONFIG.indexNowKey is empty"); process.exit(1); }

const all = process.argv.includes("--all");
const today = new Date().toISOString().slice(0, 10);
const sitemap = fs.readFileSync(path.join(ROOT, "docs/sitemap.xml"), "utf8");
const urls = [...sitemap.matchAll(/<url><loc>([^<]+)<\/loc><lastmod>([^<]+)<\/lastmod><\/url>/g)]
  .filter(([, , mod]) => all || mod === today).map(([, loc]) => loc);
if (!urls.length) { console.log(`no pages changed today (${today}); use --all to submit everything`); process.exit(0); }

const keyLocation = `https://${domain}/${key}.txt`;
const live = await fetch(keyLocation).then((r) => r.ok && r.text()).catch(() => false);
if ((live || "").trim() !== key) { console.error(`${keyLocation} isn't live yet. Deploy first, then rerun.`); process.exit(1); }

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: domain, key, keyLocation, urlList: urls })
});
console.log(`IndexNow: submitted ${urls.length} URL(s), HTTP ${res.status}${res.status === 200 || res.status === 202 ? " (accepted)" : " " + (await res.text())}`);
if (res.status >= 400) process.exit(1);
