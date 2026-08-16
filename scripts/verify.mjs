#!/usr/bin/env node
/**
 * Behavioural checks against a running build.
 *
 * These cover the things the v1 site got wrong and that a unit test would not
 * catch: whether the gallery can be opened and navigated by keyboard, whether
 * the mobile drawer traps focus and restores scroll, whether the contact form
 * reports errors accessibly, whether the API rejects a newline in the name
 * field (the header-injection bug), and whether the page is still readable
 * with JavaScript switched off.
 *
 *   npm run build && npm start &
 *   node scripts/verify.mjs
 */
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:4321";
// Uses the Chrome already installed on the machine, so `npx playwright
// install` is not a prerequisite for running these checks.
const browser = await chromium.launch({ channel: "chrome" });

const results = [];
const check = (name, pass, detail = "") => results.push({ name, pass: pass ? "PASS" : "FAIL", detail });

// ---------------------------------------------------------------- lightbox
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${BASE}/projects`, { waitUntil: "networkidle" });

  const tiles = page.locator("ul li button");
  check("gallery renders tiles", (await tiles.count()) === 24, `${await tiles.count()} tiles`);

  // Open via keyboard only, to prove there is a keyboard path in.
  await tiles.first().focus();
  await page.keyboard.press("Enter");
  const dialog = page.locator('[role="dialog"]');
  await dialog.waitFor({ state: "visible", timeout: 5000 });
  check("lightbox opens from keyboard", await dialog.isVisible());

  const label1 = await dialog.getAttribute("aria-label");
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(400);
  const label2 = await dialog.getAttribute("aria-label");
  check("arrow key advances image", label1 !== label2, `${label1} -> ${label2}`);

  check(
    "focus is inside the dialog",
    await page.evaluate(() => document.querySelector('[role="dialog"]')?.contains(document.activeElement) ?? false),
  );

  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);
  check("Escape closes lightbox", (await dialog.count()) === 0);
  check(
    "focus returns to the trigger",
    await page.evaluate(() => document.activeElement?.tagName === "BUTTON"),
  );

  // Filtering
  await page.getByRole("tab", { name: /Civil/ }).click();
  await page.waitForTimeout(400);
  const civilCount = await page.locator("ul li button").count();
  check("filter narrows the set", civilCount > 0 && civilCount < 24, `${civilCount} civil tiles`);

  await page.close();
}

// ------------------------------------------------------------- mobile menu
{
  const page = await browser.newPage({ viewport: { width: 390, height: 812 } });
  await page.goto(BASE, { waitUntil: "networkidle" });

  const toggle = page.locator('button[aria-controls="mobile-nav"]');
  check("burger visible on mobile", await toggle.isVisible());
  check("aria-expanded starts false", (await toggle.getAttribute("aria-expanded")) === "false");

  await toggle.click();
  await page.waitForTimeout(500);
  check("aria-expanded flips to true", (await toggle.getAttribute("aria-expanded")) === "true");
  check(
    "body scroll is locked",
    await page.evaluate(() => getComputedStyle(document.body).overflow === "hidden"),
  );
  check(
    "focus moved into the drawer",
    await page.evaluate(() => document.getElementById("mobile-nav")?.contains(document.activeElement) ?? false),
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

// -------------------------------------------------------------------- form
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

  // Happy path
  await page.fill('input[name="name"]', "Priya Sharma");
  await page.fill('input[name="email"]', "priya@example.com");
  await page.fill('input[name="phone"]', "+91 98765 43210");
  await page.fill('textarea[name="message"]', "2BHK in Kandivali East, around 850 sq ft.");
  await page.getByRole("button", { name: /Request a free consultation/ }).click();
  await page.waitForTimeout(2500);
  check(
    "valid submit reaches the success state",
    await page.getByText(/that reached us/i).isVisible().catch(() => false),
  );

  await page.close();
}

// ------------------------------------------------- header injection attempt
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
}

// -------------------------------------------------------- no-JS still works
{
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  const visible = await page.evaluate?.(() => true).catch(() => null);
  const text = await page.locator("body").innerText();
  check(
    "content readable without JavaScript",
    text.includes("What you are actually buying") && text.includes("Six stages"),
    `${text.length} chars rendered`,
  );
  void visible;
  await context.close();
}

await browser.close();
console.table(results);
const failed = results.filter((r) => r.pass === "FAIL");
console.log(failed.length === 0 ? "\nAll checks passed." : `\n${failed.length} FAILED`);
