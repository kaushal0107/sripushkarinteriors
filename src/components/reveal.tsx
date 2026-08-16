"use client";

import { useCallback, useState, type ElementType, type ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "article" | "section";
}) {
  const Tag: ElementType = as;
  const [armed, setArmed] = useState(false);
  const [visible, setVisible] = useState(false);

  const attach = useCallback((node: HTMLElement | null) => {
    if (!node) return;

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

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
    observer.observe(node);

    const failsafe = window.setTimeout(() => setVisible(true), 3000);

    return () => {
      observer.disconnect();
      window.clearTimeout(failsafe);
    };
  }, []);

  return (
    <Tag
      ref={attach}
      className={`reveal ${className}`}
      data-armed={armed || undefined}
      data-visible={visible || undefined}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
