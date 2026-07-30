#!/usr/bin/env node
// CI-only utility: rewrites root-absolute paths in the built dist/ output to be
// prefixed with PAGES_BASE_PATH, so the site works when served from a GitHub
// Pages project subpath (https://<user>.github.io/<repo>/) instead of a domain
// root. This never touches source files — it only rewrites the build artifact,
// so it has no effect on the Cloudflare/production build, which never sets
// PAGES_BASE_PATH.
//
// The codebase uses root-absolute paths everywhere (href="/about-us",
// src="/images/...") to match how Cloudflare serves the site at a domain root.
// Astro's own `base` config does not rewrite hand-written string literals like
// those, only its own internally-generated asset URLs — so a blanket
// attribute/CSS rewrite pass is the reliable fix for a subpath deployment.
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const base = process.env.PAGES_BASE_PATH;
if (!base) {
  console.log("PAGES_BASE_PATH not set; skipping base-path rewrite.");
  process.exit(0);
}

const distDir = path.resolve("dist");

function walk(dir, exts, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, exts, out);
    else if (exts.some((ext) => full.endsWith(ext))) out.push(full);
  }
  return out;
}

const files = [...walk(distDir, [".html"]), ...walk(distDir, [".css"])];

// Matches href="/..., src="/..., srcset="/..., action="/..., poster="/...
// (single and double quoted), but not "//..." (protocol-relative) or
// external absolute URLs, which never start with a bare "/".
const attrPattern = /((?:href|src|srcset|action|poster)=["'])\/(?!\/)/g;
// Matches CSS url(/...) but not url(data:...) or url(http...).
const cssUrlPattern = /(url\(\s*["']?)\/(?!\/)/g;

let changedFiles = 0;
for (const file of files) {
  const before = readFileSync(file, "utf8");
  const after = before
    .replace(attrPattern, `$1${base}/`)
    .replace(cssUrlPattern, `$1${base}/`);
  if (after !== before) {
    writeFileSync(file, after);
    changedFiles++;
  }
}

console.log(
  `Rewrote ${changedFiles} file(s) under dist/ to base path "${base}".`,
);
