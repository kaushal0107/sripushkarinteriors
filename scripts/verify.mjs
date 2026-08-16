#!/usr/bin/env node
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3000";
const WIDTHS = [320, 375, 414, 768, 1024, 1280, 1920];
const PATHS = ["/", "/about", "/services", "/projects", "/contact", "/case-study"];

const results = [];
const check = (name, pass, detail = "") =>
  results.push({ name, pass: pass ? "PASS" : "FAIL", detail });

const browser = await chromium.launch({ channel: "chrome" });

{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${BASE}/projects`, { waitUntil: "networkidle" });

  const tiles = page.locator("ul li button");
  const tileCount = await tiles.count();
  check("gallery renders tiles", tileCount > 0, `${tileCount} tiles`);

  await tiles.first().focus();
  await page.keyboard.press("Enter");
  const dialog = page.locator('[role="dialog"]');
  await dialog.waitFor({ state: "visible", timeout: 5000 });
  check("lightbox opens from keyboard", await dialog.isVisible());

  const before = await dialog.getAttribute("aria-label");
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(400);
  const after = await dialog.getAttribute("aria-label");
  check("arrow key advances image", before !== after, `${before} -> ${after}`);

  check(
    "focus stays inside the dialog",
    await page.evaluate(
      () =>
        document.querySelector('[role="dialog"]')?.contains(document.activeElement) ?? false,
    ),
  );

  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);
  check("Escape closes lightbox", (await dialog.count()) === 0);
  check(
    "focus returns to the trigger",
    await page.evaluate(() => document.activeElement?.tagName === "BUTTON"),
  );

  await page.getByRole("tab", { name: /Civil/ }).click();
  await page.waitForTimeout(400);
  const civil = await page.locator("ul li button").count();
  check("filter narrows the set", civil > 0 && civil < tileCount, `${civil} civil tiles`);

  await page.close();
}

{
  const page = await browser.newPage({ viewport: { width: 390, height: 812 } });
  await page.goto(BASE, { waitUntil: "networkidle" });

  const toggle = page.locator('button[aria-controls="mobile-nav"]');
  check("burger visible on mobile", await toggle.isVisible());
  check("aria-expanded starts false", (await toggle.getAttribute("aria-expanded")) === "false");

  await toggle.click();
  await page.waitForTimeout(500);
  check("aria-expanded flips to true", (await toggle.getAttribute("aria-expanded")) === "true");

  const coverage = await page.evaluate(() => {
    const panel = document.getElementById("mobile-nav");
    if (!panel) return null;
    const r = panel.getBoundingClientRect();
    const style = getComputedStyle(panel);
    return {
      width: Math.round(r.width),
      height: Math.round(r.height),
      viewportW: window.innerWidth,
      viewportH: window.innerHeight,
      background: style.backgroundColor,
    };
  });
  check(
    "drawer fills the viewport",
    coverage !== null &&
      coverage.width >= coverage.viewportW &&
      coverage.height >= coverage.viewportH,
    coverage ? `${coverage.width}x${coverage.height} vs ${coverage.viewportW}x${coverage.viewportH}` : "no panel",
  );
  check(
    "drawer background is opaque",
    coverage !== null &&
      coverage.background !== "rgba(0, 0, 0, 0)" &&
      !coverage.background.includes("rgba"),
    coverage?.background ?? "",
  );

  const bleed = await page.evaluate(() => {
    const panel = document.getElementById("mobile-nav");
    const mid = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
    return panel?.contains(mid) ?? false;
  });
  check("page content does not show through the drawer", bleed);
  check(
    "body scroll is locked",
    await page.evaluate(() => getComputedStyle(document.body).overflow === "hidden"),
  );
  check(
    "focus moves into the drawer",
    await page.evaluate(
      () => document.getElementById("mobile-nav")?.contains(document.activeElement) ?? false,
    ),
  );

  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);
  check("Escape closes the drawer", (await toggle.getAttribute("aria-expanded")) === "false");
  check(
    "body scroll restored",
    await page.evaluate(() => getComputedStyle(document.body).overflow !== "hidden"),
  );

  await page.close();
}

{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${BASE}/contact`, { waitUntil: "networkidle" });

  await page.getByRole("button", { name: /Request a free consultation/ }).click();
  await page.waitForTimeout(400);
  const alerts = await page.locator('[role="alert"]').count();
  check("empty submit shows inline errors", alerts >= 3, `${alerts} alerts`);
  check(
    "first invalid field is focused",
    await page.evaluate(() => document.activeElement?.getAttribute("name") === "name"),
  );
  check(
    "invalid fields are marked aria-invalid",
    (await page.locator('[aria-invalid="true"]').count()) >= 3,
  );

  await page.fill('input[name="name"]', "Priya Sharma");
  await page.fill('input[name="email"]', "priya@example.com");
  await page.fill('input[name="phone"]', "+91 98765 43210");
  await page.fill('textarea[name="message"]', "2BHK in Baner, around 850 sq ft.");
  await page.getByRole("button", { name: /Request a free consultation/ }).click();
  await page.waitForTimeout(2500);
  check(
    "valid submit reaches the success state",
    await page
      .getByText(/that reached us/i)
      .isVisible()
      .catch(() => false),
  );

  await page.close();
}

{
  const response = await fetch(`${BASE}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Attacker\nBcc: victim@example.com",
      email: "a@b.com",
      phone: "+919876543210",
      projectType: "residential",
      message: "Testing header injection through the name field.",
    }),
  });
  check("newline in name is rejected", response.status === 422, `HTTP ${response.status}`);

  const headers = await fetch(BASE).then((r) => r.headers);
  check(
    "security headers present",
    Boolean(headers.get("content-security-policy")) &&
      headers.get("x-content-type-options") === "nosniff" &&
      headers.get("x-frame-options") === "DENY",
    headers.get("content-security-policy") ? "CSP set" : "CSP missing",
  );
  check("x-powered-by removed", !headers.get("x-powered-by"));
}

{
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  const text = await page.locator("body").innerText();
  check(
    "content readable without JavaScript",
    text.includes("What you are actually buying") && text.includes("Six stages"),
    `${text.length} chars rendered`,
  );
  await context.close();
}

{
  const problems = [];
  for (const width of WIDTHS) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      reducedMotion: "reduce",
    });

    await page.route("**/_next/image**", (route) => route.abort());

    for (const path of PATHS) {
      await page.goto(BASE + path, { waitUntil: "load", timeout: 60000 });
      await page.waitForTimeout(200);
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight * 0.8) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 60));
        }
        window.scrollTo(0, 0);
      });

      const report = await page.evaluate(() => {
        const doc = document.documentElement;
        const small = [];
        for (const el of document.querySelectorAll("a, button")) {
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) continue;
          if (String(el.className).includes("sr-only")) continue;
          const parent = el.parentElement;
          if (
            parent &&
            ["P", "ADDRESS", "LI", "SPAN"].includes(parent.tagName) &&
            parent.textContent.trim() !== el.textContent.trim()
          ) {
            continue;
          }
          if (r.height < 24 || r.width < 24) {
            small.push(`"${el.textContent.trim().slice(0, 24)}" ${Math.round(r.width)}x${Math.round(r.height)}`);
          }
        }
        return { scrollW: doc.scrollWidth, clientW: doc.clientWidth, small: small.slice(0, 3) };
      });

      if (report.scrollW > report.clientW + 1) {
        problems.push(`${width}px ${path}: horizontal scroll (${report.scrollW} > ${report.clientW})`);
      }
      if (report.small.length) {
        problems.push(`${width}px ${path}: small targets — ${report.small.join(", ")}`);
      }
    }
    await page.close();
  }
  check(
    `no overflow or small targets at ${WIDTHS.length} widths`,
    problems.length === 0,
    problems.slice(0, 3).join(" | "),
  );
}

await browser.close();
console.table(results);
const failed = results.filter((r) => r.pass === "FAIL");
console.log(failed.length === 0 ? "\nAll checks passed." : `\n${failed.length} FAILED`);
process.exit(failed.length === 0 ? 0 : 1);
