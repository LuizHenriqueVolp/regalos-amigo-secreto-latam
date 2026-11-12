// Build sin dependencias: copia el sitio a dist/, embute el CSS y la config en cada
// HTML (sin recursos que bloqueen el render) y versiona app.js para caché largo.
import { readFileSync, writeFileSync, rmSync, mkdirSync, cpSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";

const OUT = "dist";
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT);
for (const p of ["assets", "assets-ia", "favicon.png"]) cpSync(p, `${OUT}/${p}`, { recursive: true });

const css = readFileSync("assets/styles.css", "utf8")
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/\s+/g, " ")
  .replace(/\s*([{};:,>])\s*/g, "$1")
  .replace(/;}/g, "}")
  .trim();
const config = readFileSync("assets/config.js", "utf8").replace(/^\s*\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "").trim();
const appHash = createHash("sha1").update(readFileSync("assets/app.js")).digest("hex").slice(0, 8);

for (const f of readdirSync(".").filter((f) => f.endsWith(".html"))) {
  let html = readFileSync(f, "utf8");
  html = html.replace('<link rel="stylesheet" href="/assets/styles.css">', `<style>${css}</style>`);
  html = html.replace('<script src="/assets/config.js"></script>', `<script>${config}</script>`);
  html = html.replace('src="/assets/app.js"', `src="/assets/app.js?v=${appHash}"`);
  writeFileSync(`${OUT}/${f}`, html);
}
console.log(`build ok · css ${css.length} B inline · app.js v=${appHash}`);
