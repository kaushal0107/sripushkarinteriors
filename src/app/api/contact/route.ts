import { NextResponse } from "next/server";

import { contactSchema } from "@/lib/contact-schema";

export const runtime = "nodejs";

/**
 * In-memory, per-IP rate limit.
 *
 * Deliberately simple: this is a brochure site whose form sees a handful of
 * submissions a day. On a single instance it is enough to stop a script
 * hammering the endpoint. If the site is ever scaled horizontally this needs
 * to move to Upstash/Redis — noted in the README rather than pretending the
 * Map is durable.
 */
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);

  // Opportunistic cleanup so the Map cannot grow without bound.
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }
  return recent.length > MAX_PER_WINDOW;
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    // Field-keyed messages so the form can render errors inline.
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return NextResponse.json({ error: "Please check the form.", fieldErrors }, { status: 422 });
  }

  const data = parsed.data;

  // Honeypot: respond with success so a bot has no signal to tune against.
  if (data.website) {
    return NextResponse.json({ ok: true });
  }

  if (rateLimited(clientIp(request))) {
    return NextResponse.json(
      { error: "Too many enquiries from this connection. Please call us instead." },
      { status: 429 },
    );
  }

  const enquiry = {
    receivedAt: new Date().toISOString(),
    name: data.name,
    email: data.email,
    phone: data.phone,
    projectType: data.projectType,
    message: data.message,
  };

  // Delivery is intentionally pluggable. With RESEND_API_KEY set the enquiry is
  // emailed; without it (local dev, preview deploys) it is logged and the form
  // still behaves correctly end to end.
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;

  if (apiKey && to) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM_EMAIL ?? "enquiries@sripushkarinteriors.com",
          to: [to],
          // The visitor's address goes in reply_to, never spliced into a header
          // string — this is the specific bug the PHP version had.
          reply_to: data.email,
          subject: `Website enquiry — ${data.name} (${data.projectType})`,
          text: [
            `Name:    ${data.name}`,
            `Email:   ${data.email}`,
            `Phone:   ${data.phone}`,
            `Type:    ${data.projectType}`,
            `Time:    ${enquiry.receivedAt}`,
            "",
            data.message,
          ].join("\n"),
        }),
      });

      if (!response.ok) {
        console.error("contact: delivery failed", response.status, await response.text());
        return NextResponse.json(
          { error: "We could not send that just now. Please call us instead." },
          { status: 502 },
        );
      }
    } catch (error) {
      console.error("contact: delivery threw", error);
      return NextResponse.json(
        { error: "We could not send that just now. Please call us instead." },
        { status: 502 },
      );
    }
  } else {
    console.info("contact: no mail provider configured, logging enquiry", enquiry);
  }

  return NextResponse.json({ ok: true });
}
