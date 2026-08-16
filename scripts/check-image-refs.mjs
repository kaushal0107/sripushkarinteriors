#!/usr/bin/env node
import { readFile, readdir, access } from "node:fs/promises";
import { dirname, join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "src");
const PUBLIC = join(ROOT, "public");
const CODE = new Set([".ts", ".tsx", ".css"]);
const REFERENCE = /["'`](\/images\/[^"'`\s]+)["'`]/g;

async function collect(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await collect(full)));
    else if (CODE.has(extname(entry.name))) files.push(full);
  }
  return files;
}

const missing = [];
const seen = new Set();

for (const file of await collect(SRC)) {
  const source = await readFile(file, "utf8");
  for (const [, path] of source.matchAll(REFERENCE)) {
    const key = `${file}::${path}`;
    if (seen.has(key)) continue;
    seen.add(key);
    try {
      await access(join(PUBLIC, path));
    } catch {
      missing.push({ file: file.replace(`${ROOT}/`, ""), path });
    }
  }
}

if (missing.length > 0) {
  console.error(`\nBroken image references (${missing.length}):`);
  for (const { file, path } of missing) console.error(`  ${file} -> ${path}`);
  console.error("");
  process.exit(1);
}

console.log(`image-refs: ${seen.size} hard-coded paths, all resolve`);
