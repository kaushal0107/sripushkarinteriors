/**
 * Measurements for the rebuild write-up.
 *
 * Every number here was taken on one machine, in one sitting, with both
 * versions served locally from the same laptop — the v1 site restored from
 * commit 8b4d0cc and the rebuild running `next start` on a production build.
 * Nothing is estimated. The harness lives in `scripts/` and the method is
 * described on the page itself.
 */

export const benchmark = {
  method:
    "Chrome 141, Fast 3G network emulation (1.6 Mbps down, 150 ms RTT) with 4× CPU throttling, 1440×900 viewport, cold cache, home page only.",
  date: "August 2026",
  rows: [
    { metric: "Page weight", legacy: "6,047 KB", rebuild: "1,611 KB", delta: "−73%", better: true },
    { metric: "Image bytes", legacy: "5,159 KB", rebuild: "328 KB", delta: "−94%", better: true },
    { metric: "CSS bytes", legacy: "232 KB", rebuild: "46 KB", delta: "−80%", better: true },
    { metric: "JavaScript bytes", legacy: "320 KB", rebuild: "841 KB", delta: "+163%", better: false },
    { metric: "HTTP requests", legacy: "35", rebuild: "29", delta: "−17%", better: true },
    { metric: "First Contentful Paint", legacy: "1,120 ms", rebuild: "716 ms", delta: "−36%", better: true },
    { metric: "Largest Contentful Paint", legacy: "2,036 ms", rebuild: "716 ms", delta: "−65%", better: true },
    { metric: "Load event", legacy: "27,159 ms", rebuild: "4,206 ms", delta: "−85%", better: true },
  ],
} as const;

export const repoStats = [
  { value: "280 MB → 9 MB", label: "Image library", detail: "401 camera dumps → 136 curated WebP" },
  { value: "2,593 → 0", label: "Lines of copy-pasted HTML", detail: "Six near-identical pages → shared components" },
  { value: "10.5 MB", label: "Vendored jQuery, Bootstrap & icon fonts removed", detail: "Now zero runtime UI dependencies" },
  { value: "38 → 0", label: "!important declarations", detail: "Replaced by a token-driven scale" },
] as const;

/** Defects found in the v1 source, and what replaced each one. */
export const findings = [
  {
    tag: "Security",
    severity: "high",
    problem: "Email header injection in the contact form",
    detail:
      "mail_handler.php interpolated the submitted address straight into a mail header — From: \".$email — so a newline in that field let anyone append Bcc: headers and use the form as an open relay. The same script echoed the submitter's name back into the HTML response unescaped, which is reflected XSS.",
    fix: "A typed /api/contact route. The visitor's address goes in reply_to, never spliced into a header string. Zod validates on both client and server from one shared schema, plus a honeypot field and per-IP rate limiting.",
  },
  {
    tag: "Performance",
    severity: "high",
    problem: "280 MB of untouched camera uploads",
    detail:
      "401 image files, several over 2 MB, served at full resolution to phones — filenames like \"WhatsApp Image 2020-09-05 at 12.28.46 AM.jpeg\". The home page alone pulled 5.2 MB of images, and the full load took 27 seconds on throttled mobile.",
    fix: "A sharp-based pipeline resizes and converts everything to WebP, EXIF rotation applied. A manual editorial pass cut 401 files to 136 that are actually worth showing. next/image handles per-breakpoint sizing and lazy loading from there.",
  },
  {
    tag: "Accessibility",
    severity: "high",
    problem: "47 of 50 gallery images had no alt attribute",
    detail:
      "The projects gallery was unreachable by keyboard entirely — the lightbox opened on click only, the filter controls were <li> elements with data-filter attributes nested illegally inside an <h4> inside a <ul>, and there was no visible focus style anywhere on the site.",
    fix: "Every image carries descriptive alt text generated from its category. The gallery is a proper tablist, the lightbox is a focus-trapped dialog with Escape and arrow-key navigation, and :focus-visible is styled globally.",
  },
  {
    tag: "Correctness",
    severity: "medium",
    problem: "Statistics that contradicted themselves",
    detail:
      "The home page counter claimed 879 happy customers and 954 expert designers — more designers than clients — alongside \"8 Cities | 16 Experience Centers\", copied verbatim from a national competitor's site. Four service cards still carried lorem-ipsum: \"For what reason would it be advisable for me to think about business content?\"",
    fix: "Replaced with claims the work supports: years in practice, projects delivered, scope of the turnkey contract, warranty terms. Every service now describes what is actually included.",
  },
  {
    tag: "Maintainability",
    severity: "medium",
    problem: "The navigation existed six times",
    detail:
      "Header and footer markup was pasted into every page and had already drifted — the footer read \"Projects\" on one page and \"Project\" on another, the active-page class was wrong on two files, and typed.js was inlined as a 15 KB minified blob into three separate pages.",
    fix: "One <SiteHeader> and one <SiteFooter>, driven by a single nav array. Business facts — phone numbers, address, service list — live in one typed module that every page and the JSON-LD read from.",
  },
  {
    tag: "Responsive",
    severity: "medium",
    problem: "Media queries that broke small screens",
    detail:
      "The mobile breakpoint set min-width: 400px on nine different selectors, so anything narrower than 400px got a horizontal scrollbar. The hero was pulled under the navbar with margin-top: -140px and forced to height: 650px !important, which letterboxed on desktop and cropped to nothing on a phone.",
    fix: "Fluid type via clamp(), intrinsic layouts with grid and flexbox, and a hero sized in svh units with object-fit: cover. Verified from 320px up.",
  },
  {
    tag: "SEO",
    severity: "medium",
    problem: "No metadata worth the name",
    detail:
      "index.html had no charset declaration and the title \"Homepage\". Not one of the six pages had a meta description, Open Graph tag, canonical URL or structured data. services.html was titled \"Services-->Civil & Construction\".",
    fix: "Per-page metadata through the Next.js Metadata API, OG and Twitter cards, canonical URLs, a generated sitemap and robots.txt, and GeneralContractor JSON-LD carrying the real address and phone numbers.",
  },
  {
    tag: "Dead code",
    severity: "low",
    problem: "Files that went nowhere",
    detail:
      "interior.html was a zero-byte file. commercial.html and construction.html were complete pages linked from nothing. jQuery was loaded three times on the home page — including the slim build, which lacks .animate(), loaded after the code that called .animate().",
    fix: "Removed. The rebuild ships no jQuery at all; the only client JavaScript is the React that runs the nav, gallery, hero and form.",
  },
] as const;

export const decisions = [
  {
    q: "Why Next.js for a five-page brochure site?",
    a: "Honestly, a static site generator would serve the business equally well — the pages are static and the only dynamic surface is one form. Next earns its place here for the image pipeline (next/image doing per-breakpoint WebP and AVIF against a library of 136 photos is the single biggest win on the page) and for giving the contact form a typed server route without standing up separate infrastructure. The cost is visible in the numbers: JavaScript went up from 320 KB to 841 KB. That is the trade, and it is the one metric on this page that got worse.",
  },
  {
    q: "Why keep the original photographs at all?",
    a: "Because they are the firm's actual work, and a portfolio of stock photography would be a lie. The constraint is real though: 91 of the 136 surviving images are under 800px wide, since they were phone uploads from 2014–2020. The layout is designed around that — tiles are capped at sizes those files can fill honestly, the hero uses the only three photographs above 1000px, and nothing is stretched full-bleed that cannot carry it.",
  },
  {
    q: "Why rewrite the copy?",
    a: "The v1 text claimed more designers than customers, listed sixteen experience centres in eight cities that do not exist, and left lorem ipsum on the services page. Shipping that as portfolio work would mean vouching for it. The replacement describes a Mumbai contracting firm that has been trading since 2009, which is what this is.",
  },
  {
    q: "What would need to change before this went live?",
    a: "Three things. The rate limiter is an in-process Map, which is correct for a single instance and wrong the moment the site scales horizontally — that wants Upstash or equivalent. Email delivery needs RESEND_API_KEY and CONTACT_TO_EMAIL set, and without them the route logs instead of sending. And the team photographs and partner logos should be replaced with images the firm has explicit permission to publish.",
  },
] as const;
