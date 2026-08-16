#!/usr/bin/env node
/**
 * Layout checks across seven viewport widths.
 *
 * The v1 stylesheet set `min-width: 400px` on nine selectors, so every page had
 * a horizontal scrollbar below 400px. This asserts that no element escapes the
 * viewport at any width from 320px up, and flags interactive elements smaller
 * than the WCAG 2.5.8 target size.
 *
 *   npm run build && npm start &
 *   node scripts/check-responsive.mjs
 */
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:4321";
const PATHS = ["/", "/about", "/services", "/projects", "/contact", "/case-study"];
const WIDTHS = [320, 375, 414, 768, 1024, 1280, 1920];

const browser = await chromium.launch({ channel: "chrome" });
const problems = [];

for (const width of WIDTHS) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
  for (const path of PATHS) {
    await page.goto(BASE + path, { waitUntil: "networkidle", timeout: 60000 });
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight * 0.8) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
    });

    const report = await page.evaluate((vw) => {
      const doc = document.documentElement;
      const overflowing = [];
      for (const el of document.querySelectorAll("body *")) {
        const rect = el.getBoundingClientRect();
        if (rect.width === 0) continue;
        // Ignore deliberately-clipped marquee track and fixed overlays.
        if (el.closest("[aria-label='What we build']")) continue;
        if (rect.right > vw + 1.5 || rect.left < -1.5) {
          overflowing.push(
            `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)} [${Math.round(rect.left)}..${Math.round(rect.right)}]`,
          );
        }
      }
      // Tap-target check on interactive elements.
      const small = [];
      for (const el of document.querySelectorAll("a, button")) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        // Skip links are deliberately 1x1 until focused.
        if (el.className.includes("sr-only")) continue;
        // WCAG 2.5.8 exempts links inside a sentence of running text.
        const parent = el.parentElement;
        if (parent && ["P", "ADDRESS", "LI", "SPAN"].includes(parent.tagName) && parent.textContent.trim() !== el.textContent.trim()) continue;
        if (r.height < 24 || r.width < 24) small.push(`${el.tagName.toLowerCase()}: "${el.textContent.trim().slice(0, 28)}" ${Math.round(r.width)}x${Math.round(r.height)}`);
      }
      return {
        scrollW: doc.scrollWidth,
        clientW: doc.clientWidth,
        overflowing: overflowing.slice(0, 4),
        small: small.slice(0, 4),
      };
    }, width);

    if (report.scrollW > report.clientW + 1) {
      problems.push(`${width}px ${path}: horizontal scroll (${report.scrollW} > ${report.clientW}) ${report.overflowing.join(" | ")}`);
    }
    if (report.small.length) {
      problems.push(`${width}px ${path}: small tap targets — ${report.small.join(" | ")}`);
    }
  }
  await page.close();
  console.log(`checked ${width}px`);
}

await browser.close();
if (problems.length === 0) {
  console.log("\nNo horizontal overflow or undersized tap targets at any width.");
} else {
  console.log(`\n${problems.length} problems:`);
  for (const p of problems) console.log("  - " + p);
}
