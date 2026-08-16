#!/usr/bin/env node
import { mkdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "images");

const BONE = ["#fbfaf7", "#f5f2ec", "#ebe6dc", "#d9d1c2", "#b8ab95"];
const INK = ["#6f6a62", "#55504a", "#45403a", "#2d2a26", "#1f1d1a", "#141311"];
const BRASS = ["#d9b779", "#c79c4f", "#ad7f33", "#8a6427"];
const ACCENT = ["#8a9a86", "#b08268", "#7a8794", "#9d8f7a"];

const SCHEMES = [
  { name: "light", bg: BONE[1], plane: BONE[2], solid: BONE[3], line: INK[0], ink: INK[3] },
  { name: "mid", bg: BONE[3], plane: BONE[2], solid: BONE[4], line: INK[2], ink: INK[4] },
  { name: "dark", bg: INK[3], plane: INK[2], solid: INK[1], line: BONE[3], ink: BONE[2] },
];

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = (r, list) => list[Math.floor(r() * list.length)];
const between = (r, lo, hi) => lo + r() * (hi - lo);

function room(r, w, h, s) {
  const floorY = h * between(r, 0.62, 0.74);
  const winX = w * between(r, 0.12, 0.3);
  const winW = w * between(r, 0.24, 0.38);
  const winY = h * between(r, 0.14, 0.24);
  const winH = floorY - winY - h * between(r, 0.06, 0.16);
  const mullions = Math.floor(between(r, 1, 4));
  const pendantX = w * between(r, 0.62, 0.82);
  const pendantR = w * between(r, 0.022, 0.04);
  const pendantY = h * between(r, 0.3, 0.42);
  const accent = pick(r, [...BRASS, ...ACCENT]);

  return `
    <rect width="${w}" height="${h}" fill="${s.bg}"/>
    <rect x="0" y="${floorY}" width="${w}" height="${h - floorY}" fill="${s.plane}"/>
    <rect x="${winX}" y="${winY}" width="${winW}" height="${winH}" fill="${s.solid}"/>
    ${Array.from({ length: mullions }, (_, i) => {
      const x = winX + (winW / (mullions + 1)) * (i + 1);
      return `<line x1="${x}" y1="${winY}" x2="${x}" y2="${winY + winH}" stroke="${s.bg}" stroke-width="${w * 0.006}"/>`;
    }).join("")}
    <line x1="${pendantX}" y1="0" x2="${pendantX}" y2="${pendantY - pendantR}" stroke="${s.line}" stroke-width="${w * 0.003}"/>
    <circle cx="${pendantX}" cy="${pendantY}" r="${pendantR}" fill="${accent}"/>
    <rect x="${w * between(r, 0.55, 0.68)}" y="${floorY - h * between(r, 0.1, 0.18)}"
          width="${w * between(r, 0.22, 0.34)}" height="${h * between(r, 0.1, 0.18)}" fill="${s.ink}" opacity="0.75"/>
    <ellipse cx="${w * 0.5}" cy="${floorY + (h - floorY) * 0.55}" rx="${w * 0.3}" ry="${(h - floorY) * 0.28}" fill="${s.solid}" opacity="0.5"/>
  `;
}

function elevation(r, w, h, s) {
  const cols = Math.floor(between(r, 4, 8));
  const gap = w * 0.006;
  const top = h * between(r, 0.1, 0.18);
  const bottom = h * between(r, 0.82, 0.9);
  const splitAt = Math.floor(between(r, 1, cols));
  const accent = pick(r, [...BRASS, ...ACCENT]);
  const colW = (w - gap * (cols + 1)) / cols;

  return `
    <rect width="${w}" height="${h}" fill="${s.bg}"/>
    ${Array.from({ length: cols }, (_, i) => {
      const x = gap + i * (colW + gap);
      const split = i === splitAt;
      const midY = top + (bottom - top) * between(r, 0.38, 0.62);
      const fill = split ? accent : i % 3 === 0 ? s.solid : s.plane;
      return `
        <rect x="${x}" y="${top}" width="${colW}" height="${midY - top}" fill="${fill}"/>
        <rect x="${x}" y="${midY + gap}" width="${colW}" height="${bottom - midY - gap}" fill="${i % 2 ? s.plane : s.solid}"/>
        <line x1="${x + colW * 0.2}" y1="${midY - h * 0.03}" x2="${x + colW * 0.8}" y2="${midY - h * 0.03}"
              stroke="${s.line}" stroke-width="${h * 0.005}" opacity="0.55"/>`;
    }).join("")}
    <rect x="0" y="${bottom}" width="${w}" height="${h - bottom}" fill="${s.ink}" opacity="0.85"/>
  `;
}

function plan(r, w, h, s) {
  const step = w / between(r, 9, 14);
  const wall = w * 0.012;
  const rooms = Math.floor(between(r, 2, 4));
  const inset = w * 0.08;

  let walls = "";
  let cursor = inset;
  for (let i = 0; i < rooms; i++) {
    const rw = (w - inset * 2) / rooms;
    const rh = between(r, 0.42, 0.72) * (h - inset * 2);
    walls += `<rect x="${cursor}" y="${inset}" width="${rw}" height="${rh}" fill="none" stroke="${s.ink}" stroke-width="${wall}"/>`;
    const doorX = cursor + rw * between(r, 0.3, 0.7);
    walls += `<path d="M ${doorX} ${inset + rh} a ${step} ${step} 0 0 1 ${step} ${-step}"
                 fill="none" stroke="${s.line}" stroke-width="${wall * 0.4}"/>`;
    cursor += rw;
  }

  return `
    <rect width="${w}" height="${h}" fill="${s.bg}"/>
    <g stroke="${s.line}" stroke-width="${w * 0.0015}" opacity="0.28">
      ${Array.from({ length: Math.ceil(w / step) }, (_, i) => `<line x1="${i * step}" y1="0" x2="${i * step}" y2="${h}"/>`).join("")}
      ${Array.from({ length: Math.ceil(h / step) }, (_, i) => `<line x1="0" y1="${i * step}" x2="${w}" y2="${i * step}"/>`).join("")}
    </g>
    ${walls}
    <line x1="${inset}" y1="${h - inset * 0.55}" x2="${w - inset}" y2="${h - inset * 0.55}"
          stroke="${pick(r, BRASS)}" stroke-width="${w * 0.004}"/>
  `;
}

function arches(r, w, h, s) {
  const count = Math.floor(between(r, 3, 6));
  const floorY = h * between(r, 0.78, 0.88);
  const top = h * between(r, 0.14, 0.24);
  const gap = w * 0.02;
  const bayW = (w - gap * (count + 1)) / count;
  const radius = bayW / 2;
  const accentIndex = Math.floor(r() * count);
  const accent = pick(r, [...BRASS, ...ACCENT]);

  return `
    <rect width="${w}" height="${h}" fill="${s.bg}"/>
    ${Array.from({ length: count }, (_, i) => {
      const x = gap + i * (bayW + gap);
      const fill = i === accentIndex ? accent : i % 2 ? s.plane : s.solid;
      return `<path d="M ${x} ${floorY} L ${x} ${top + radius}
                       A ${radius} ${radius} 0 0 1 ${x + bayW} ${top + radius}
                       L ${x + bayW} ${floorY} Z" fill="${fill}"/>`;
    }).join("")}
    <rect x="0" y="${floorY}" width="${w}" height="${h - floorY}" fill="${s.ink}" opacity="0.9"/>
  `;
}

function bands(r, w, h, s) {
  const count = Math.floor(between(r, 4, 8));
  const tones = [s.bg, s.plane, s.solid, s.ink];
  let y = 0;
  let out = `<rect width="${w}" height="${h}" fill="${s.bg}"/>`;
  const brassAt = Math.floor(between(r, 1, count));

  for (let i = 0; i < count; i++) {
    const bandH = i === count - 1 ? h - y : (h / count) * between(r, 0.6, 1.5);
    out += `<rect x="0" y="${y}" width="${w}" height="${bandH}" fill="${tones[i % tones.length]}"/>`;
    if (i === brassAt) {
      out += `<rect x="0" y="${y}" width="${w}" height="${h * 0.012}" fill="${pick(r, BRASS)}"/>`;
    }
    y += bandH;
    if (y >= h) break;
  }
  const vx = w * between(r, 0.55, 0.8);
  out += `<line x1="${vx}" y1="0" x2="${vx}" y2="${h}" stroke="${s.bg}" stroke-width="${w * 0.008}" opacity="0.6"/>`;
  return out;
}

function ceiling(r, w, h, s) {
  const rings = Math.floor(between(r, 3, 6));
  const tones = [s.plane, s.solid, s.bg, s.ink];
  let out = `<rect width="${w}" height="${h}" fill="${s.bg}"/>`;
  for (let i = 0; i < rings; i++) {
    const t = i / rings;
    const ix = w * 0.06 + t * w * 0.3;
    const iy = h * 0.06 + t * h * 0.3;
    out += `<rect x="${ix}" y="${iy}" width="${w - ix * 2}" height="${h - iy * 2}"
                  rx="${w * 0.01}" fill="${tones[i % tones.length]}"/>`;
  }
  const lights = Math.floor(between(r, 3, 6));
  const accent = pick(r, BRASS);
  out += Array.from({ length: lights }, (_, i) => {
    const cx = (w / (lights + 1)) * (i + 1);
    return `<circle cx="${cx}" cy="${h * between(r, 0.44, 0.56)}" r="${w * 0.012}" fill="${accent}"/>`;
  }).join("");
  return out;
}

function facade(r, w, h, s) {
  const cols = Math.floor(between(r, 4, 8));
  const rows = Math.floor(between(r, 3, 6));
  const inset = w * between(r, 0.05, 0.12);
  const gw = (w - inset * 2) / cols;
  const gh = (h - inset * 2) / rows;
  const openW = gw * between(r, 0.44, 0.7);
  const openH = gh * between(r, 0.42, 0.68);
  const accent = pick(r, [...BRASS, ...ACCENT]);
  const litCount = Math.floor(between(r, 1, 4));
  const lit = new Set(Array.from({ length: litCount }, () => Math.floor(r() * cols * rows)));

  return `
    <rect width="${w}" height="${h}" fill="${s.bg}"/>
    <rect x="${inset * 0.4}" y="${inset * 0.4}" width="${w - inset * 0.8}" height="${h - inset * 0.8}" fill="${s.plane}"/>
    ${Array.from({ length: rows * cols }, (_, i) => {
      const cx = inset + (i % cols) * gw + (gw - openW) / 2;
      const cy = inset + Math.floor(i / cols) * gh + (gh - openH) / 2;
      return `<rect x="${cx}" y="${cy}" width="${openW}" height="${openH}" fill="${lit.has(i) ? accent : s.ink}" opacity="${lit.has(i) ? 1 : 0.8}"/>`;
    }).join("")}
  `;
}

function section(r, w, h, s) {
  const steps = Math.floor(between(r, 4, 8));
  const rise = h / (steps + 2);
  const run = w / (steps + 1.5);
  const accent = pick(r, BRASS);
  let path = `M 0 ${h} `;
  for (let i = 0; i < steps; i++) {
    path += `L ${i * run} ${h - i * rise} L ${(i + 1) * run} ${h - i * rise} `;
  }
  path += `L ${steps * run} ${h - steps * rise} L ${w} ${h - steps * rise} L ${w} ${h} Z`;

  return `
    <rect width="${w}" height="${h}" fill="${s.bg}"/>
    <rect x="0" y="${h * between(r, 0.08, 0.2)}" width="${w}" height="${h * 0.012}" fill="${accent}"/>
    <path d="${path}" fill="${s.solid}"/>
    <path d="${path}" fill="none" stroke="${s.ink}" stroke-width="${w * 0.004}"/>
    ${Array.from({ length: 3 }, (_, i) => {
      const y = h * (0.3 + i * 0.16);
      return `<line x1="${w * 0.62}" y1="${y}" x2="${w * 0.94}" y2="${y}" stroke="${s.line}" stroke-width="${w * 0.002}" opacity="0.5"/>`;
    }).join("")}
  `;
}

const COMPOSITIONS = { room, elevation, plan, arches, bands, ceiling, facade, section };

const FAMILIES = {
  residential: ["room", "elevation", "ceiling", "room", "bands", "elevation"],
  commercial: ["plan", "arches", "facade", "ceiling", "arches", "plan"],
  civil: ["section", "plan", "bands", "facade", "section", "elevation"],
};

function grain(w, h, seed) {
  return `
    <filter id="g${seed}" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="${seed}"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>
    <rect width="${w}" height="${h}" filter="url(#g${seed})" opacity="0.045"/>
  `;
}

function svg(seed, w, h, compositionName, forcedScheme) {
  const r = rng(seed * 2654435761);

  const scheme = forcedScheme ?? pick(r, SCHEMES);
  const draw = COMPOSITIONS[compositionName];

  const flip = r() > 0.5;
  const body = draw(r, w, h, scheme);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <g ${flip ? `transform="translate(${w},0) scale(-1,1)"` : ""}>${body}</g>
    ${grain(w, h, seed)}
  </svg>`;
}

const GROUPS = [
  ["projects/residential", "residential", 15, 1600, 1200],
  ["projects/commercial", "commercial", 12, 1600, 1200],
  ["projects/civil", "civil", 9, 1600, 1200],
];

await rm(join(OUT, "projects"), { recursive: true, force: true });
await rm(join(OUT, "team"), { recursive: true, force: true });
await rm(join(OUT, "partners"), { recursive: true, force: true });

let made = 0;

for (const [sub, slug, count, w, h] of GROUPS) {
  const dir = join(OUT, sub);
  await mkdir(dir, { recursive: true });
  const family = FAMILIES[slug];
  for (let i = 1; i <= count; i++) {
    const seed = 104729 + made * 31 + i * 7919;
    const markup = svg(seed, w, h, family[i % family.length]);
    await sharp(Buffer.from(markup))
      .webp({ quality: 82, effort: 6 })
      .toFile(join(dir, `${slug}-${String(i).padStart(2, "0")}.webp`));
  }
  made += count;
  console.log(`${sub}: ${count} images`);
}

const HERO_SCHEME = SCHEMES.find((s) => s.name === "dark");
const heroDir = join(OUT, "hero");
await rm(heroDir, { recursive: true, force: true });
await mkdir(heroDir, { recursive: true });
const HERO_COMPOSITIONS = ["arches", "room", "facade"];
for (let i = 1; i <= 3; i++) {
  const markup = svg(20250817 + i * 977, 2400, 1350, HERO_COMPOSITIONS[i - 1], HERO_SCHEME);
  await sharp(Buffer.from(markup))
    .webp({ quality: 82, effort: 6 })
    .toFile(join(heroDir, `hero-0${i}.webp`));
}
console.log("hero: 3 images (dark scheme)");

console.log(`\ngenerated ${made + 3} images`);
