"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Wordmark } from "@/components/wordmark";
import { nav, site } from "@/data/site";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const { body } = document;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    const prev = { overflow: body.style.overflow, padding: body.style.paddingRight };
    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;
    return () => {
      body.style.overflow = prev.overflow;
      body.style.paddingRight = prev.padding;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const onHome = pathname === "/";
  const transparent = onHome && !scrolled && !open;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
          transparent
            ? "bg-transparent"
            : open
              ? "bg-bone-50"
              : "bg-bone-50/85 shadow-[0_1px_0_rgba(0,0,0,0.06)] backdrop-blur-md"
        }`}
      >
        <div className="container-page flex h-20 items-center justify-between gap-4 md:h-24">
          <Link
            href="/"
            className={`relative z-10 transition-colors duration-500 ${
              transparent ? "text-white" : "text-ink-900"
            }`}
            aria-label={`${site.name} — home`}
          >
            <Wordmark />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => {
              const active =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative px-4 py-2 text-sm tracking-wide transition-colors ${
                    transparent
                      ? "text-white/85 hover:text-white"
                      : "text-ink-500 hover:text-ink-900"
                  } ${active ? (transparent ? "text-white" : "text-ink-900") : ""}`}
                >
                  {item.label}
                  {active && (
                    <span
                      aria-hidden
                      className={`absolute inset-x-4 bottom-1 h-px ${
                        transparent ? "bg-white" : "bg-brass-500"
                      }`}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={site.phones[0].href}
              className={`hidden px-2 py-2 text-sm tracking-wide transition-colors md:block lg:ml-2 ${
                transparent ? "text-white/85 hover:text-white" : "text-ink-500 hover:text-ink-900"
              }`}
            >
              {site.phones[0].display}
            </a>
            <Link
              href="/contact"
              className={`hidden rounded-full px-5 py-2.5 text-sm font-medium transition lg:block ${
                transparent
                  ? "bg-white text-ink-900 hover:bg-bone-200"
                  : "bg-ink-900 text-bone-50 hover:bg-ink-700"
              }`}
            >
              Book a consultation
            </Link>

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              className={`relative z-10 -mr-2 flex h-11 w-11 items-center justify-center rounded-full transition lg:hidden ${
                transparent ? "text-white" : "text-ink-900"
              }`}
            >
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
              <span aria-hidden className="relative block h-4 w-6">
                <span
                  className={`absolute left-0 block h-px w-6 bg-current transition-transform duration-300 ${
                    open ? "top-1/2 rotate-45" : "top-0.5"
                  }`}
                />
                <span
                  className={`absolute left-0 block h-px w-6 bg-current transition-transform duration-300 ${
                    open ? "top-1/2 -rotate-45" : "bottom-0.5"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-nav"
        ref={panelRef}
        hidden={!open}
        className="fixed inset-0 z-40 overflow-y-auto bg-bone-50 lg:hidden"
      >
        <div className="container-page flex min-h-full flex-col justify-between pt-28 pb-10">
          <nav aria-label="Primary mobile">
            <ul className="flex flex-col">
              {nav.map((item, i) => {
                const active =
                  item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                return (
                  <li key={item.href} className="border-b border-bone-200">
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-baseline gap-4 py-5 font-display text-3xl ${
                        active ? "text-ink-900" : "text-ink-500"
                      }`}
                    >
                      <span
                        className={`font-sans text-xs tabular-nums ${
                          active ? "text-brass-600" : "text-ink-400"
                        }`}
                      >
                        0{i + 1}
                      </span>
                      {item.label}
                      {active && (
                        <span aria-hidden className="ml-auto h-1.5 w-1.5 self-center rotate-45 bg-brass-500" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="space-y-4">
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="block rounded-full bg-ink-900 px-6 py-4 text-center text-sm font-medium text-bone-50"
            >
              Book a free consultation
            </Link>
            <div className="flex flex-col gap-1 text-sm text-ink-500">
              {site.phones.map((p) => (
                <a key={p.href} href={p.href} className="hover:text-ink-900">
                  {p.display}
                </a>
              ))}
              <a href={`mailto:${site.email}`} className="hover:text-ink-900">
                {site.email}
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
