const TINTS = [
  { bg: "var(--color-bone-200)", fg: "var(--color-ink-700)", rule: "var(--color-brass-400)" },
  { bg: "var(--color-ink-800)", fg: "var(--color-bone-100)", rule: "var(--color-brass-300)" },
  { bg: "var(--color-bone-300)", fg: "var(--color-ink-800)", rule: "var(--color-ink-600)" },
];

export function Avatar({
  initials,
  index = 0,
  className = "",
}: {
  initials: string;
  index?: number;
  className?: string;
}) {
  const tint = TINTS[index % TINTS.length];

  return (
    <svg
      viewBox="0 0 400 500"
      role="img"
      aria-hidden
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="400" height="500" fill={tint.bg} />

      <circle cx="200" cy="215" r="62" fill={tint.fg} opacity="0.16" />
      <path
        d="M200 300c-62 0-112 42-124 100h248c-12-58-62-100-124-100Z"
        fill={tint.fg}
        opacity="0.16"
      />

      <text
        x="200"
        y="232"
        textAnchor="middle"
        fill={tint.fg}
        fontFamily="var(--font-display)"
        fontSize="104"
        letterSpacing="2"
      >
        {initials}
      </text>

      <rect x="160" y="286" width="80" height="3" fill={tint.rule} />
    </svg>
  );
}
