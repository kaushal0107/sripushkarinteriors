import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-3 text-eyebrow uppercase text-brass-600">
      <span aria-hidden className="h-px w-8 bg-brass-400" />
      {children}
    </p>
  );
}

export function Section({
  children,
  className = "",
  ...props
}: ComponentProps<"section">) {
  return (
    <section className={`py-16 md:py-24 lg:py-32 ${className}`} {...props}>
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <div className={align === "center" ? "flex justify-center" : ""}>
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
      )}
      <h2 className="mt-5 text-h2 text-balance">{title}</h2>
      {intro && <p className="mt-5 text-lg leading-relaxed text-ink-500 text-pretty">{intro}</p>}
    </div>
  );
}

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

export function Button({ href, children, variant = "primary", className = "" }: ButtonProps) {
  const styles = {
    primary: "bg-ink-900 text-bone-50 hover:bg-ink-700",
    secondary: "bg-bone-200 text-ink-900 hover:bg-bone-300",
    ghost: "border border-ink-900/20 text-ink-900 hover:border-ink-900/50 hover:bg-bone-100",
  }[variant];

  const cls = `inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium transition duration-300 ${styles} ${className}`;

  return href.startsWith("/") ? (
    <Link href={href} className={cls}>
      {children}
    </Link>
  ) : (
    <a href={href} className={cls}>
      {children}
    </a>
  );
}

export function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={`h-4 w-4 ${className}`}
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
    </svg>
  );
}
