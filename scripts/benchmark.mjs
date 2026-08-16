#!/usr/bin/env node
import { chromium } from "playwright";

const TARGETS = [
  { label: "legacy", url: process.env.LEGACY_URL ?? "http://localhost:4320/" },
  { label: "rebuild", url: process.env.NEW_URL ?? "http://localhost:4321/" },
];

const NETWORK = {
  offline: false,
  latency: 150,
  downloadThroughput: (1.6 * 1024 * 1024) / 8,
  uploadThroughput: (750 * 1024) / 8,
};

const OBSERVER_INIT = `
  window.__vitals = { lcp: 0, cls: 0 };
  new PerformanceObserver((list) => {
    const last = list.getEntries().at(-1);
    if (last) window.__vitals.lcp = Math.round(last.startTime);
  }).observe({ type: 'largest-contentful-paint', buffered: true });
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!entry.hadRecentInput) window.__vitals.cls += entry.value;
    }
  }).observe({ type: 'layout-shift', buffered: true });
`;

const browser = await chromium.launch({ channel: "chrome" });

const results = [];

for (const target of TARGETS) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.addInitScript(OBSERVER_INIT);

  const client = await context.newCDPSession(page);
  await client.send("Network.enable");
  await client.send("Network.emulateNetworkConditions", NETWORK);
  await client.send("Emulation.setCPUThrottlingRate", { rate: 4 });

  let bytes = 0;
  let requests = 0;
  let imageBytes = 0;
  let scriptBytes = 0;
  let cssBytes = 0;
  let fontBytes = 0;

  page.on("response", async (response) => {
    requests += 1;
    try {
      const buffer = await response.body();
      const type = response.headers()["content-type"] ?? "";
      bytes += buffer.length;
      if (type.startsWith("image/")) imageBytes += buffer.length;
      else if (type.includes("javascript")) scriptBytes += buffer.length;
      else if (type.includes("css")) cssBytes += buffer.length;
      else if (type.includes("font")) fontBytes += buffer.length;
    } catch {
      return;
    }
  });

  await page.goto(target.url, { waitUntil: "load", timeout: 180000 });
  await page.waitForTimeout(6000);

  const data = await page.evaluate(() => {
    const paints = performance.getEntriesByType("paint");
    const nav = performance.getEntriesByType("navigation")[0];
    return {
      fcp: Math.round(paints.find((p) => p.name === "first-contentful-paint")?.startTime ?? 0),
      lcp: window.__vitals.lcp,
      cls: Number(window.__vitals.cls.toFixed(4)),
      load: Math.round(nav?.loadEventEnd ?? 0),
      images: document.images.length,
      imagesWithoutAlt: [...document.images].filter((i) => !i.hasAttribute("alt")).length,
    };
  });

  results.push({
    label: target.label,
    requests,
    totalKB: Math.round(bytes / 1024),
    imageKB: Math.round(imageBytes / 1024),
    scriptKB: Math.round(scriptBytes / 1024),
    cssKB: Math.round(cssBytes / 1024),
    fontKB: Math.round(fontBytes / 1024),
    ...data,
  });

  await context.close();
}

await browser.close();
console.table(results);
console.log(JSON.stringify(results));
