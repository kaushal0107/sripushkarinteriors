"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

// useLayoutEffect warns during SSR; on the server there is nothing to arm.
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Fade-and-rise on scroll, via IntersectionObserver.
 *
 * Fails *open*: the server renders the element with no `data-armed` attribute,
 * so without JavaScript — or if the observer never fires — the content is
 * simply visible. Hiding only happens once JS has confirmed it can also
 * un-hide, which is the opposite of the usual `opacity: 0` in a stylesheet.
 *
 * The legacy site animated its counters with jQuery `.animate()` on DOMReady,
 * so the numbers had finished counting long before you scrolled to them, and
 * it ignored `prefers-reduced-motion` entirely.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "article" | "section";
}) {
  const ref = useRef<HTMLElement>(null);
  const [armed, setArmed] = useState(false);
  const [visible, setVisible] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    // Hide only now that we know we can reveal it again.
    setArmed(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.01 },
    );
    observer.observe(el);

    // Belt and braces: if something goes wrong with the observer, don't leave
    // the page permanently blank.
    const failsafe = window.setTimeout(() => setVisible(true), 3000);

    return () => {
      observer.disconnect();
      window.clearTimeout(failsafe);
    };
  }, []);

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={`reveal ${className}`}
      data-armed={armed || undefined}
      data-visible={visible || undefined}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
