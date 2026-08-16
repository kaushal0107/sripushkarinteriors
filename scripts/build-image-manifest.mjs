#!/usr/bin/env node
/**
 * Regenerates src/data/image-manifest.json by reading the real dimensions of
 * everything in public/images.
 *
 * Why this exists: `next/image` needs intrinsic width and height to reserve
 * space before a photo loads, and this gallery has ~135 of them. Hand-typing
 * those numbers is how the legacy site ended up with `height="181px"
 * width="243px"` attributes on images that were actually 3000px wide — every
 * one of which caused a layout shift.
 *
 * Runs automatically before `next build` via the `prebuild` script.
 */
import { readdir, stat, writeFile, mkdir } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const IMAGES_DIR = join(ROOT, "public", "images");
const OUT_FILE = join(ROOT, "src", "data", "image-manifest.json");
const EXTENSIONS = /\.(webp|png|jpe?g|avif)$/i;

/** Sorts `photo-2` before `photo-10` instead of lexicographically. */
const collator = new Intl.Collator("en", { numeric: true, sensitivity: "base" });

async function walk(dir) {
  const groups = {};
  const entries = await readdir(dir, { withFileTypes: true });

  const files = entries
    .filter((e) => e.isFile() && EXTENSIONS.test(e.name))
    .map((e) => e.name)
    .sort(collator.compare);

  if (files.length > 0) {
    const key = relative(IMAGES_DIR, dir).split("/").join("/");
    groups[key] = await Promise.all(
      files.map(async (name) => {
        const filePath = join(dir, name);
        const { width, height } = await sharp(filePath).metadata();
        const { size } = await stat(filePath);
        return { src: `/images/${key}/${name}`, width, height, bytes: size };
      }),
    );
  }

  for (const entry of entries.filter((e) => e.isDirectory())) {
    Object.assign(groups, await walk(join(dir, entry.name)));
  }
  return groups;
}

const manifest = await walk(IMAGES_DIR);
const ordered = Object.fromEntries(
  Object.entries(manifest).sort(([a], [b]) => collator.compare(a, b)),
);

await mkdir(dirname(OUT_FILE), { recursive: true });
await writeFile(OUT_FILE, `${JSON.stringify(ordered, null, 2)}\n`);

const count = Object.values(ordered).reduce((n, group) => n + group.length, 0);
const bytes = Object.values(ordered)
  .flat()
  .reduce((n, image) => n + image.bytes, 0);

console.log(
  `image-manifest: ${count} images across ${Object.keys(ordered).length} groups, ` +
    `${(bytes / 1024 / 1024).toFixed(1)} MB total`,
);
