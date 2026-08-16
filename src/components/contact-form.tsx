"use client";

import { useId, useRef, useState } from "react";

import { ArrowIcon } from "@/components/ui";
import { contactSchema, PROJECT_TYPES } from "@/lib/contact-schema";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Accessible contact form.
 *
 * The legacy form posted straight to `mail_handler.php` and navigated away to a
 * bare `<h1>Sent Successfully!</h1>` on a white page. Validation was a jQuery
 * file that bound to `.input100` classes the markup never used, so nothing was
 * ever actually validated client-side.
 *
 * Here errors are announced, tied to their input with aria-describedby, and
 * focus moves to the first invalid field.
 */
export function ContactForm() {
  const formId = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const fieldId = (name: string) => `${formId}-${name}`;
  const errorId = (name: string) => `${formId}-${name}-error`;

  function focusFirstError(fieldErrors: Record<string, string>) {
    const first = Object.keys(fieldErrors)[0];
    if (!first) return;
    formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const formData = new FormData(event.currentTarget);
    const raw = Object.fromEntries(formData) as Record<string, string>;

    // Validate with the same schema the server uses, so most mistakes never
    // become a round trip.
    const parsed = contactSchema.safeParse(raw);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        fieldErrors[key] ??= issue.message;
      }
      setErrors(fieldErrors);
      focusFirstError(fieldErrors);
      return;
    }

    setErrors({});
    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        setStatus("error");
        setFormError(body.error ?? "Something went wrong. Please call us instead.");
        if (body.fieldErrors) {
          setErrors(body.fieldErrors);
          focusFirstError(body.fieldErrors);
        }
        return;
      }

      setStatus("success");
      formRef.current?.reset();
    } catch {
      setStatus("error");
      setFormError("We could not reach the server. Please check your connection or call us.");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="flex h-full flex-col items-start justify-center rounded-sm border border-bone-300 bg-bone-100 p-10"
      >
        <span aria-hidden className="text-3xl text-brass-500">
          ✓
        </span>
        <h3 className="mt-4 text-h3">Thank you — that reached us.</h3>
        <p className="mt-3 max-w-sm leading-relaxed text-ink-500 text-pretty">
          One of our designers will call you within one working day to arrange a
          site visit. If it is urgent, phoning is faster than waiting for us.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-medium text-ink-900 underline underline-offset-4"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-sm border border-bone-300 bg-white px-4 py-3 text-ink-900 transition placeholder:text-ink-400 focus:border-brass-500 focus:outline-none focus-visible:outline-none";

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-5">
      {formError && (
        <p
          role="alert"
          className="rounded-sm border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {formError}
        </p>
      )}

      <Field
        label="Your name"
        name="name"
        id={fieldId("name")}
        errorId={errorId("name")}
        error={errors.name}
      >
        <input
          id={fieldId("name")}
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Priya Sharma"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? errorId("name") : undefined}
          className={inputClass}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Email"
          name="email"
          id={fieldId("email")}
          errorId={errorId("email")}
          error={errors.email}
        >
          <input
            id={fieldId("email")}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? errorId("email") : undefined}
            className={inputClass}
          />
        </Field>

        <Field
          label="Phone"
          name="phone"
          id={fieldId("phone")}
          errorId={errorId("phone")}
          error={errors.phone}
        >
          <input
            id={fieldId("phone")}
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="+91 98765 43210"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? errorId("phone") : undefined}
            className={inputClass}
          />
        </Field>
      </div>

      <Field
        label="What kind of project?"
        name="projectType"
        id={fieldId("projectType")}
        errorId={errorId("projectType")}
        error={errors.projectType}
      >
        <select
          id={fieldId("projectType")}
          name="projectType"
          defaultValue="residential"
          aria-invalid={Boolean(errors.projectType)}
          aria-describedby={errors.projectType ? errorId("projectType") : undefined}
          className={inputClass}
        >
          {PROJECT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </Field>

      <Field
        label="About the space"
        name="message"
        id={fieldId("message")}
        errorId={errorId("message")}
        error={errors.message}
        hint="Size, location, rough budget and when you want to start — whatever you know."
      >
        <textarea
          id={fieldId("message")}
          name="message"
          rows={5}
          placeholder="2BHK in Baner, roughly 850 sq ft. Looking to start after Diwali."
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? errorId("message") : undefined}
          className={`${inputClass} resize-y`}
        />
      </Field>

      {/* Honeypot — visually and programmatically hidden from real users. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={fieldId("website")}>Website</label>
        <input id={fieldId("website")} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink-900 px-7 py-4 text-sm font-medium text-bone-50 transition hover:bg-ink-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" ? "Sending…" : "Request a free consultation"}
        {status !== "submitting" && (
          <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-1" />
        )}
      </button>

      <p className="text-xs leading-relaxed text-ink-400">
        We use your details only to respond to this enquiry. No marketing lists,
        no sharing with third parties.
      </p>
    </form>
  );
}

function Field({
  label,
  id,
  errorId,
  error,
  hint,
  children,
}: {
  label: string;
  name: string;
  id: string;
  errorId: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink-700">
        {label}
      </label>
      {hint && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
      <div className="mt-2">{children}</div>
      {error && (
        <p id={errorId} role="alert" className="mt-2 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
