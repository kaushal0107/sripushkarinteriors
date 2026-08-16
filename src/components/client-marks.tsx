import { clients } from "@/data/site";

function Glyph({ index }: { index: number }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.4 };
  switch (index % 6) {
    case 0:
      return (
        <g {...common}>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 4v16" />
        </g>
      );
    case 1:
      return (
        <g {...common}>
          <rect x="4" y="4" width="16" height="16" />
          <path d="M4 12h16" />
        </g>
      );
    case 2:
      return (
        <g {...common}>
          <path d="M12 3 21 20H3Z" />
        </g>
      );
    case 3:
      return (
        <g {...common}>
          <rect x="5" y="5" width="14" height="14" transform="rotate(45 12 12)" />
        </g>
      );
    case 4:
      return (
        <g {...common}>
          <path d="M4 20V8l8-5 8 5v12" />
          <path d="M10 20v-6h4v6" />
        </g>
      );
    default:
      return (
        <g {...common}>
          <circle cx="9" cy="12" r="5" />
          <circle cx="15" cy="12" r="5" />
        </g>
      );
  }
}

export function ClientMarks({ className = "" }: { className?: string }) {
  return (
    <ul
      className={`grid grid-cols-2 items-center gap-x-8 gap-y-9 sm:grid-cols-3 lg:grid-cols-6 ${className}`}
    >
      {clients.map((name, i) => (
        <li key={name} className="flex items-center justify-center">
          <span className="flex items-center gap-2.5 text-ink-400 transition-colors duration-500 hover:text-ink-700">
            <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5 shrink-0">
              <Glyph index={i} />
            </svg>
            <span className="font-display text-base tracking-tight whitespace-nowrap">
              {name}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}
