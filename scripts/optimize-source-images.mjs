#!/usr/bin/env node
/**
 * One-off pipeline that produced public/images from the original photo dump.
 *
 * Kept in the repo for provenance: the v1 site shipped 280 MB of untouched
 * camera and WhatsApp exports (401 files, several over 2 MB, filenames like
 * "WhatsApp Image 2020-09-05 at 12.28.46 AM.jpeg"). This script is what turned
 * that into the 9 MB of WebP the site serves now.
 *
 * The originals are not in the working tree any more — they live in git
 * history. To re-run this:
 *
 *   git archive 8b4d0cc "images" | tar -x -C /tmp/spi-originals
 *   node scripts/optimize-source-images.mjs /tmp/spi-originals/images
 *
 * Note that curation (which photos survive) was a manual editorial pass, not
 * something this script reproduces — it converts whatever it is pointed at.
 */
import { mkdir, readdir } from "node:fs/promises";
import { basename, join } from "node:path";

import sharp from "sharp";

const SOURCE_ROOT = process.argv[2];
if (!SOURCE_ROOT) {
  console.error("usage: node scripts/optimize-source-images.mjs <source-images-dir>");
  process.exit(1);
}

/** [source subdirectory, output subdirectory, filename slug, max width, quality] */
const JOBS = [
  ["banner image", "hero", "hero", 2400, 82],
  ["Photos/project images/bedroom", "projects/bedroom", "bedroom", 1800, 80],
  ["Photos/project images/livinig", "projects/living", "living", 1800, 80],
  ["Photos/project images/celing", "projects/ceiling", "ceiling", 1800, 80],
  ["Photos/project images/kichten", "projects/kitchen", "kitchen", 1800, 80],
  ["Photos/project images/hii", "projects/interiors", "interiors", 1800, 80],
  ["Photos/project images/furniture", "projects/furniture", "furniture", 1800, 80],
  ["Photos/project images/constructions", "projects/construction", "construction", 1800, 80],
  ["Photos/project images/COMMERCIAL", "projects/commercial", "commercial", 1800, 80],
  ["Photos/project images/COMMERCIAL/Utkarsh bank", "projects/utkarsh-bank", "utkarsh-bank", 1800, 80],
  ["Photos/project images/COMMERCIAL/SUMERUU", "projects/sumeru", "sumeru", 1800, 80],
  ["Photos/project images/COMMERCIAL/bar", "projects/bar", "bar", 1800, 80],
  ["teamimage", "team", "team", 800, 82],
  ["partnerlogo", "partners", "partner", 480, 85],
];

const EXTENSIONS = /\.(jpe?g|png|webp)$/i;
const collator = new Intl.Collator("en", { numeric: true, sensitivity: "base" });

let total = 0;

for (const [from, to, slug, maxWidth, quality] of JOBS) {
  const sourceDir = join(SOURCE_ROOT, from);
  const outDir = join("public", "images", to);

  let entries;
  try {
    entries = await readdir(sourceDir, { withFileTypes: true });
  } catch {
    console.warn(`skipping missing directory: ${from}`);
    continue;
  }

  await mkdir(outDir, { recursive: true });

  const files = entries
    .filter((e) => e.isFile() && EXTENSIONS.test(e.name))
    .map((e) => e.name)
    .sort(collator.compare);

  let index = 0;
  for (const name of files) {
    index += 1;
    const outName = `${slug}-${String(index).padStart(2, "0")}.webp`;
    try {
      await sharp(join(sourceDir, name))
        // Phone photos store orientation in EXIF; without this a third of the
        // library renders on its side.
        .rotate()
        .resize({ width: maxWidth, withoutEnlargement: true })
        .webp({ quality, effort: 6 })
        .toFile(join(outDir, outName));
      total += 1;
    } catch (error) {
      console.warn(`  !! skipped ${basename(name)}: ${error.message}`);
    }
  }
  console.log(`${to}: ${files.length} files`);
}

console.log(`\nconverted ${total} images`);
