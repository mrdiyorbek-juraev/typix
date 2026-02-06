export function TypixLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Editor cursor / text caret — main icon element */}
      <rect
        className="fill-current"
        height="20"
        rx="1.5"
        width="3"
        x="9"
        y="6"
      />
      {/* Top horizontal bar (T-shape, represents "T" in Typix) */}
      <rect
        className="fill-current"
        height="3"
        rx="1.5"
        width="14"
        x="4"
        y="6"
      />
      {/* Decorative pen stroke — angled line */}
      <path
        d="M18 12L26 24"
        stroke="url(#typix-grad)"
        strokeLinecap="round"
        strokeWidth="3"
      />
      {/* Small accent dot */}
      <circle className="fill-violet-500" cx="27" cy="8" r="2" />
      <defs>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="typix-grad"
          x1="18"
          x2="26"
          y1="12"
          y2="24"
        >
          <stop stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#ec4899" />
        </linearGradient>
      </defs>
    </svg>
  );
}
