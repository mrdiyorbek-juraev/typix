const illustrationClass = "h-full w-full" as const;

function DefaultEditorIllustration() {
  return (
    <svg className={illustrationClass} viewBox="0 0 320 180" fill="none">
      {/* Toolbar dots */}
      <g opacity="0.7">
        {Array.from({ length: 8 }).map((_, i) => (
          <rect
            key={i}
            x={32 + i * 24}
            y={40}
            width={16}
            height={16}
            rx={4}
            fill="currentColor"
            opacity={0.5}
          />
        ))}
      </g>
      {/* Text lines */}
      <rect
        x="32"
        y="76"
        width="200"
        height="8"
        rx="4"
        fill="currentColor"
        opacity="0.4"
      />
      <rect
        x="32"
        y="96"
        width="256"
        height="8"
        rx="4"
        fill="currentColor"
        opacity="0.3"
      />
      <rect
        x="32"
        y="116"
        width="180"
        height="8"
        rx="4"
        fill="currentColor"
        opacity="0.25"
      />
      <rect
        x="32"
        y="136"
        width="220"
        height="8"
        rx="4"
        fill="currentColor"
        opacity="0.2"
      />
    </svg>
  );
}

function MarkdownIllustration() {
  return (
    <svg className={illustrationClass} viewBox="0 0 320 180" fill="none">
      {/* ## heading */}
      <text
        x="40"
        y="60"
        fill="currentColor"
        opacity="0.6"
        fontSize="20"
        fontWeight="700"
        fontFamily="monospace"
      >
        ##
      </text>
      <rect
        x="76"
        y="46"
        width="160"
        height="10"
        rx="5"
        fill="currentColor"
        opacity="0.45"
      />
      {/* ~~ strikethrough */}
      <text
        x="40"
        y="92"
        fill="currentColor"
        opacity="0.5"
        fontSize="16"
        fontFamily="monospace"
      >
        ~~
      </text>
      <rect
        x="76"
        y="80"
        width="120"
        height="8"
        rx="4"
        fill="currentColor"
        opacity="0.3"
      />
      {/* > blockquote */}
      <rect
        x="40"
        y="112"
        width="4"
        height="32"
        rx="2"
        fill="currentColor"
        opacity="0.5"
      />
      <rect
        x="56"
        y="116"
        width="180"
        height="8"
        rx="4"
        fill="currentColor"
        opacity="0.3"
      />
      <rect
        x="56"
        y="132"
        width="140"
        height="8"
        rx="4"
        fill="currentColor"
        opacity="0.25"
      />
      {/* Cursor */}
      <rect
        x="56"
        y="112"
        width="2"
        height="16"
        rx="1"
        fill="currentColor"
        opacity="0.7"
      />
    </svg>
  );
}

function TablesIllustration() {
  return (
    <svg className={illustrationClass} viewBox="0 0 320 180" fill="none">
      {/* Table outline */}
      <rect
        x="40"
        y="30"
        width="240"
        height="120"
        rx="8"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.4"
      />
      {/* Header row */}
      <rect
        x="40"
        y="30"
        width="240"
        height="30"
        rx="8"
        fill="currentColor"
        opacity="0.15"
      />
      {/* Vertical dividers */}
      <line
        x1="120"
        y1="30"
        x2="120"
        y2="150"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.3"
      />
      <line
        x1="200"
        y1="30"
        x2="200"
        y2="150"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.3"
      />
      {/* Horizontal dividers */}
      <line
        x1="40"
        y1="60"
        x2="280"
        y2="60"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.3"
      />
      <line
        x1="40"
        y1="90"
        x2="280"
        y2="90"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.2"
      />
      <line
        x1="40"
        y1="120"
        x2="280"
        y2="120"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.2"
      />
      {/* Cell content */}
      <rect
        x="56"
        y="40"
        width="48"
        height="8"
        rx="4"
        fill="currentColor"
        opacity="0.4"
      />
      <rect
        x="136"
        y="40"
        width="48"
        height="8"
        rx="4"
        fill="currentColor"
        opacity="0.4"
      />
      <rect
        x="216"
        y="40"
        width="48"
        height="8"
        rx="4"
        fill="currentColor"
        opacity="0.4"
      />
    </svg>
  );
}

function ImagesIllustration() {
  return (
    <svg className={illustrationClass} viewBox="0 0 320 180" fill="none">
      {/* Image frame */}
      <rect
        x="60"
        y="30"
        width="200"
        height="120"
        rx="12"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.4"
      />
      {/* Mountain landscape */}
      <path
        d="M60 120 L120 70 L160 100 L200 60 L260 120"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.3"
        fill="none"
      />
      {/* Sun */}
      <circle
        cx="100"
        cy="60"
        r="16"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.3"
      />
      {/* Image icon */}
      <rect
        x="130"
        y="70"
        width="60"
        height="48"
        rx="8"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.5"
      />
      <path
        d="M137 110 L152 94 L160 102 L172 88 L183 110"
        fill="currentColor"
        opacity="0.2"
      />
      <circle cx="150" cy="84" r="6" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

function FormattingIllustration() {
  return (
    <svg className={illustrationClass} viewBox="0 0 320 180" fill="none">
      {/* Top row: H1 " 99 :: link */}
      <g opacity="0.6">
        <text
          x="40"
          y="52"
          fill="currentColor"
          fontSize="16"
          fontWeight="700"
          fontFamily="sans-serif"
          opacity="0.7"
        >
          H<tspan fontSize="12">1</tspan>
        </text>
        <text
          x="80"
          y="52"
          fill="currentColor"
          fontSize="20"
          fontWeight="700"
          fontFamily="serif"
          opacity="0.6"
        >
          &ldquo;
        </text>
        <text
          x="108"
          y="52"
          fill="currentColor"
          fontSize="14"
          fontFamily="sans-serif"
          opacity="0.6"
        >
          =
        </text>
        <text
          x="140"
          y="50"
          fill="currentColor"
          fontSize="14"
          fontFamily="sans-serif"
          opacity="0.6"
        >
          /
        </text>
      </g>
      {/* Bottom row: B I S U pen */}
      <g opacity="0.6">
        <text
          x="40"
          y="92"
          fill="currentColor"
          fontSize="16"
          fontWeight="700"
          fontFamily="sans-serif"
        >
          B
        </text>
        <text
          x="68"
          y="92"
          fill="currentColor"
          fontSize="16"
          fontStyle="italic"
          fontFamily="sans-serif"
        >
          I
        </text>
        <text
          x="92"
          y="92"
          fill="currentColor"
          fontSize="16"
          fontFamily="sans-serif"
          textDecoration="line-through"
        >
          S
        </text>
        <text
          x="118"
          y="92"
          fill="currentColor"
          fontSize="16"
          fontFamily="sans-serif"
          textDecoration="underline"
        >
          U
        </text>
      </g>
      {/* Alignment rows */}
      <g opacity="0.35">
        <rect
          x="40"
          y="112"
          width="100"
          height="6"
          rx="3"
          fill="currentColor"
        />
        <rect x="40" y="126" width="80" height="6" rx="3" fill="currentColor" />
        <rect
          x="40"
          y="140"
          width="120"
          height="6"
          rx="3"
          fill="currentColor"
        />
        <rect x="40" y="154" width="60" height="6" rx="3" fill="currentColor" />
      </g>
    </svg>
  );
}

function TasksIllustration() {
  return (
    <svg className={illustrationClass} viewBox="0 0 320 180" fill="none">
      {/* Task items */}
      {[0, 1, 2, 3].map((i) => {
        const y = 36 + i * 34;
        const checked = i === 0;
        return (
          <g key={i}>
            <rect
              x="48"
              y={y}
              width="20"
              height="20"
              rx="4"
              stroke="currentColor"
              strokeWidth="2"
              opacity={checked ? 0.6 : 0.35}
              fill={checked ? "currentColor" : "none"}
              fillOpacity={checked ? 0.15 : 0}
            />
            {checked && (
              <path
                d={`M53 ${y + 10} L57 ${y + 14} L63 ${y + 6}`}
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.7"
              />
            )}
            <rect
              x="80"
              y={y + 6}
              width={140 - i * 20}
              height="8"
              rx="4"
              fill="currentColor"
              opacity={checked ? 0.25 : 0.35}
            />
          </g>
        );
      })}
    </svg>
  );
}

function AiChatIllustration() {
  return (
    <svg className={illustrationClass} viewBox="0 0 320 180" fill="none">
      {/* Chat bubbles */}
      <rect
        x="80"
        y="28"
        width="200"
        height="32"
        rx="12"
        fill="currentColor"
        opacity="0.15"
      />
      <rect
        x="96"
        y="38"
        width="120"
        height="8"
        rx="4"
        fill="currentColor"
        opacity="0.35"
      />
      {/* AI response */}
      <rect
        x="40"
        y="72"
        width="220"
        height="52"
        rx="12"
        fill="currentColor"
        opacity="0.1"
      />
      <rect
        x="56"
        y="84"
        width="160"
        height="6"
        rx="3"
        fill="currentColor"
        opacity="0.3"
      />
      <rect
        x="56"
        y="98"
        width="180"
        height="6"
        rx="3"
        fill="currentColor"
        opacity="0.25"
      />
      <rect
        x="56"
        y="112"
        width="100"
        height="6"
        rx="3"
        fill="currentColor"
        opacity="0.2"
      />
      {/* Input bar */}
      <rect
        x="40"
        y="136"
        width="240"
        height="28"
        rx="14"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.3"
      />
      <rect
        x="56"
        y="146"
        width="80"
        height="6"
        rx="3"
        fill="currentColor"
        opacity="0.2"
      />
    </svg>
  );
}

function AiAutocompleteIllustration() {
  return (
    <svg className={illustrationClass} viewBox="0 0 320 180" fill="none">
      {/* Text lines */}
      <rect
        x="40"
        y="40"
        width="200"
        height="8"
        rx="4"
        fill="currentColor"
        opacity="0.4"
      />
      <rect
        x="40"
        y="60"
        width="240"
        height="8"
        rx="4"
        fill="currentColor"
        opacity="0.35"
      />
      <rect
        x="40"
        y="80"
        width="100"
        height="8"
        rx="4"
        fill="currentColor"
        opacity="0.35"
      />
      {/* Ghost autocomplete text */}
      <rect
        x="148"
        y="80"
        width="120"
        height="8"
        rx="4"
        fill="currentColor"
        opacity="0.12"
      />
      {/* Cursor */}
      <rect
        x="144"
        y="76"
        width="2"
        height="16"
        rx="1"
        fill="currentColor"
        opacity="0.6"
      />
      {/* Suggestion popup */}
      <rect
        x="100"
        y="100"
        width="160"
        height="48"
        rx="8"
        fill="currentColor"
        opacity="0.08"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.2"
      />
      <rect
        x="112"
        y="112"
        width="100"
        height="6"
        rx="3"
        fill="currentColor"
        opacity="0.25"
      />
      <rect
        x="112"
        y="128"
        width="80"
        height="6"
        rx="3"
        fill="currentColor"
        opacity="0.15"
      />
    </svg>
  );
}

function SlackIllustration() {
  return (
    <svg className={illustrationClass} viewBox="0 0 320 180" fill="none">
      {/* Channel header */}
      <rect
        x="40"
        y="24"
        width="240"
        height="24"
        rx="4"
        fill="currentColor"
        opacity="0.08"
      />
      <text
        x="52"
        y="41"
        fill="currentColor"
        opacity="0.4"
        fontSize="13"
        fontWeight="600"
        fontFamily="sans-serif"
      >
        # general
      </text>
      {/* Messages */}
      <circle cx="56" cy="72" r="12" fill="currentColor" opacity="0.15" />
      <rect
        x="76"
        y="62"
        width="60"
        height="6"
        rx="3"
        fill="currentColor"
        opacity="0.35"
      />
      <rect
        x="76"
        y="76"
        width="160"
        height="6"
        rx="3"
        fill="currentColor"
        opacity="0.25"
      />
      <circle cx="56" cy="112" r="12" fill="currentColor" opacity="0.15" />
      <rect
        x="76"
        y="102"
        width="80"
        height="6"
        rx="3"
        fill="currentColor"
        opacity="0.35"
      />
      <rect
        x="76"
        y="116"
        width="120"
        height="6"
        rx="3"
        fill="currentColor"
        opacity="0.25"
      />
      {/* Input */}
      <rect
        x="40"
        y="140"
        width="240"
        height="28"
        rx="6"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.25"
      />
    </svg>
  );
}

function CommentIllustration() {
  return (
    <svg className={illustrationClass} viewBox="0 0 320 180" fill="none">
      {/* Comment bubbles */}
      <rect
        x="40"
        y="28"
        width="240"
        height="44"
        rx="8"
        fill="currentColor"
        opacity="0.08"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.15"
      />
      <circle cx="60" cy="50" r="10" fill="currentColor" opacity="0.2" />
      <rect
        x="80"
        y="40"
        width="100"
        height="6"
        rx="3"
        fill="currentColor"
        opacity="0.3"
      />
      <rect
        x="80"
        y="54"
        width="160"
        height="6"
        rx="3"
        fill="currentColor"
        opacity="0.2"
      />
      {/* Reply */}
      <rect
        x="72"
        y="84"
        width="208"
        height="36"
        rx="8"
        fill="currentColor"
        opacity="0.06"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.12"
      />
      <circle cx="90" cy="102" r="8" fill="currentColor" opacity="0.15" />
      <rect
        x="106"
        y="96"
        width="120"
        height="6"
        rx="3"
        fill="currentColor"
        opacity="0.2"
      />
      {/* Reply input */}
      <rect
        x="40"
        y="132"
        width="240"
        height="32"
        rx="8"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.2"
        strokeDasharray="4 4"
      />
      <rect
        x="56"
        y="144"
        width="80"
        height="6"
        rx="3"
        fill="currentColor"
        opacity="0.15"
      />
    </svg>
  );
}

function MinimalNoteIllustration() {
  return (
    <svg className={illustrationClass} viewBox="0 0 320 180" fill="none">
      {/* Centered minimal text */}
      <rect
        x="60"
        y="48"
        width="200"
        height="10"
        rx="5"
        fill="currentColor"
        opacity="0.35"
      />
      <rect
        x="80"
        y="72"
        width="160"
        height="8"
        rx="4"
        fill="currentColor"
        opacity="0.25"
      />
      <rect
        x="90"
        y="92"
        width="140"
        height="8"
        rx="4"
        fill="currentColor"
        opacity="0.2"
      />
      <rect
        x="100"
        y="112"
        width="120"
        height="8"
        rx="4"
        fill="currentColor"
        opacity="0.15"
      />
      {/* Cursor blinking */}
      <rect
        x="158"
        y="130"
        width="2"
        height="18"
        rx="1"
        fill="currentColor"
        opacity="0.5"
      />
    </svg>
  );
}

function CodeEditorIllustration() {
  return (
    <svg className={illustrationClass} viewBox="0 0 320 180" fill="none">
      {/* Line numbers */}
      <g opacity="0.25">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <text
            key={i}
            x="40"
            y={48 + i * 22}
            fill="currentColor"
            fontSize="11"
            fontFamily="monospace"
          >
            {i + 1}
          </text>
        ))}
      </g>
      {/* Divider */}
      <line
        x1="58"
        y1="28"
        x2="58"
        y2="160"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.15"
      />
      {/* Code lines */}
      <rect
        x="68"
        y="38"
        width="40"
        height="7"
        rx="3"
        fill="currentColor"
        opacity="0.45"
      />
      <rect
        x="116"
        y="38"
        width="80"
        height="7"
        rx="3"
        fill="currentColor"
        opacity="0.25"
      />
      <rect
        x="84"
        y="60"
        width="60"
        height="7"
        rx="3"
        fill="currentColor"
        opacity="0.35"
      />
      <rect
        x="152"
        y="60"
        width="40"
        height="7"
        rx="3"
        fill="currentColor"
        opacity="0.2"
      />
      <rect
        x="100"
        y="82"
        width="120"
        height="7"
        rx="3"
        fill="currentColor"
        opacity="0.25"
      />
      <rect
        x="100"
        y="104"
        width="80"
        height="7"
        rx="3"
        fill="currentColor"
        opacity="0.3"
      />
      <rect
        x="84"
        y="126"
        width="30"
        height="7"
        rx="3"
        fill="currentColor"
        opacity="0.35"
      />
      <rect
        x="68"
        y="148"
        width="20"
        height="7"
        rx="3"
        fill="currentColor"
        opacity="0.45"
      />
    </svg>
  );
}

function AutoLinkIllustration() {
  return (
    <svg className={illustrationClass} viewBox="0 0 320 180" fill="none">
      {/* Text lines */}
      <rect x="40" y="50" width="120" height="8" rx="4" fill="currentColor" opacity="0.35" />
      {/* URL with underline */}
      <rect x="40" y="72" width="160" height="8" rx="4" fill="currentColor" opacity="0.45" />
      <rect x="40" y="82" width="160" height="2" rx="1" fill="currentColor" opacity="0.5" />
      <rect x="40" y="94" width="100" height="8" rx="4" fill="currentColor" opacity="0.3" />
      {/* Chain-link icon */}
      <path
        d="M224 68 C224 64 228 60 232 60 L240 60 C244 60 248 64 248 68 C248 72 244 76 240 76 L238 76"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.6"
      />
      <path
        d="M234 76 C234 80 230 84 226 84 L218 84 C214 84 210 80 210 76 C210 72 214 68 218 68 L220 68"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.6"
      />
      <line x1="222" y1="76" x2="236" y2="68" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
    </svg>
  );
}

function FloatingLinkIllustration() {
  return (
    <svg className={illustrationClass} viewBox="0 0 320 180" fill="none">
      {/* Text with selection highlight */}
      <rect x="40" y="100" width="240" height="8" rx="4" fill="currentColor" opacity="0.25" />
      <rect x="100" y="100" width="80" height="8" rx="4" fill="currentColor" opacity="0.45" />
      {/* Floating popup above selection */}
      <rect x="80" y="50" width="160" height="38" rx="8" fill="currentColor" opacity="0.1"
        stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" />
      {/* Link icon in popup */}
      <path
        d="M102 69 C102 66 105 63 108 63 L113 63 C116 63 119 66 119 69 C119 72 116 75 113 75 L111 75"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.55"
      />
      <path
        d="M109 75 C109 78 106 81 103 81 L98 81 C95 81 92 78 92 75 C92 72 95 69 98 69 L100 69"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.55"
      />
      {/* URL input line */}
      <rect x="128" y="64" width="96" height="8" rx="4" fill="currentColor" opacity="0.3" />
      {/* Caret pointing down */}
      <path d="M155 88 L160 96 L165 88" fill="currentColor" opacity="0.25" />
    </svg>
  );
}

function ContextMenuIllustration() {
  return (
    <svg className={illustrationClass} viewBox="0 0 320 180" fill="none">
      {/* Background text */}
      <rect x="40" y="40" width="180" height="8" rx="4" fill="currentColor" opacity="0.2" />
      <rect x="40" y="58" width="140" height="8" rx="4" fill="currentColor" opacity="0.15" />
      {/* Context menu popup */}
      <rect x="120" y="72" width="140" height="90" rx="8" fill="currentColor" opacity="0.08"
        stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.25" />
      {/* Menu items */}
      {[0, 1, 2, 3].map((i) => {
        const y = 88 + i * 18;
        const selected = i === 0;
        return (
          <g key={i}>
            {selected && (
              <rect x="122" y={y - 4} width="136" height="16" rx="4" fill="currentColor" opacity="0.1" />
            )}
            <rect x="136" y={y} width={80 - i * 8} height="6" rx="3" fill="currentColor"
              opacity={selected ? 0.45 : 0.25} />
          </g>
        );
      })}
      {/* Divider */}
      <line x1="128" y1="154" x2="252" y2="154" stroke="currentColor" strokeWidth="1" opacity="0.15" />
      <rect x="136" y="158" width="60" height="6" rx="3" fill="currentColor" opacity="0.2" />
    </svg>
  );
}

function CollapsibleIllustration() {
  return (
    <svg className={illustrationClass} viewBox="0 0 320 180" fill="none">
      {/* Header row — expanded */}
      <rect x="40" y="32" width="240" height="28" rx="6" fill="currentColor" opacity="0.08"
        stroke="currentColor" strokeWidth="1" strokeOpacity="0.2" />
      {/* Chevron down */}
      <path d="M56 44 L62 50 L68 44" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        strokeLinejoin="round" opacity="0.55" />
      <rect x="80" y="42" width="120" height="8" rx="4" fill="currentColor" opacity="0.35" />
      {/* Collapsed content */}
      <rect x="52" y="68" width="228" height="8" rx="4" fill="currentColor" opacity="0.25" />
      <rect x="52" y="84" width="200" height="8" rx="4" fill="currentColor" opacity="0.2" />
      <rect x="52" y="100" width="160" height="8" rx="4" fill="currentColor" opacity="0.15" />
      {/* Second collapsed block */}
      <rect x="40" y="120" width="240" height="28" rx="6" fill="currentColor" opacity="0.06"
        stroke="currentColor" strokeWidth="1" strokeOpacity="0.15" />
      {/* Chevron right */}
      <path d="M56 132 L62 138 L56 144" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        strokeLinejoin="round" opacity="0.3" />
      <rect x="80" y="130" width="100" height="8" rx="4" fill="currentColor" opacity="0.2" />
    </svg>
  );
}

function DraggableBlocksIllustration() {
  return (
    <svg className={illustrationClass} viewBox="0 0 320 180" fill="none">
      {/* Blocks with drag handles on left */}
      {[0, 1, 2].map((i) => {
        const y = 28 + i * 46;
        const dragging = i === 1;
        return (
          <g key={i} opacity={dragging ? 0.9 : 0.7}>
            {/* Drag handle dots */}
            {[0, 1].map((col) =>
              [0, 1, 2].map((row) => (
                <circle
                  key={`${col}-${row}`}
                  cx={52 + col * 6}
                  cy={y + 12 + row * 7}
                  r="1.5"
                  fill="currentColor"
                  opacity={dragging ? 0.7 : 0.35}
                />
              ))
            )}
            {/* Block */}
            <rect
              x="68" y={y} width="200" height="34" rx="6"
              fill="currentColor" opacity={dragging ? 0.12 : 0.07}
              stroke="currentColor" strokeWidth={dragging ? 1.5 : 1}
              strokeOpacity={dragging ? 0.4 : 0.2}
              strokeDasharray={dragging ? "4 3" : undefined}
            />
            <rect x="82" y={y + 13} width={120 - i * 20} height="7" rx="3.5" fill="currentColor"
              opacity={dragging ? 0.4 : 0.3} />
          </g>
        );
      })}
    </svg>
  );
}

function MentionsIllustration() {
  return (
    <svg className={illustrationClass} viewBox="0 0 320 180" fill="none">
      {/* Text line with @mention pill */}
      <rect x="40" y="60" width="80" height="8" rx="4" fill="currentColor" opacity="0.3" />
      {/* @mention pill */}
      <rect x="128" y="56" width="80" height="16" rx="8" fill="currentColor" opacity="0.15"
        stroke="currentColor" strokeWidth="1" strokeOpacity="0.35" />
      <text x="140" y="68" fill="currentColor" fontSize="9" fontFamily="sans-serif" opacity="0.6"
        fontWeight="600">@username</text>
      <rect x="216" y="60" width="60" height="8" rx="4" fill="currentColor" opacity="0.25" />
      {/* Dropdown */}
      <rect x="120" y="80" width="140" height="72" rx="8" fill="currentColor" opacity="0.08"
        stroke="currentColor" strokeWidth="1" strokeOpacity="0.2" />
      {[0, 1, 2].map((i) => {
        const y = 92 + i * 20;
        const active = i === 0;
        return (
          <g key={i}>
            {active && <rect x="122" y={y - 3} width="136" height="16" rx="4" fill="currentColor" opacity="0.1" />}
            <circle cx="136" cy={y + 4} r="6" fill="currentColor" opacity={active ? 0.3 : 0.15} />
            <rect x="148" y={y} width={70 - i * 10} height="6" rx="3" fill="currentColor"
              opacity={active ? 0.4 : 0.2} />
          </g>
        );
      })}
    </svg>
  );
}

function CharacterLimitIllustration() {
  return (
    <svg className={illustrationClass} viewBox="0 0 320 180" fill="none">
      {/* Text lines */}
      <rect x="40" y="44" width="240" height="8" rx="4" fill="currentColor" opacity="0.35" />
      <rect x="40" y="62" width="200" height="8" rx="4" fill="currentColor" opacity="0.3" />
      <rect x="40" y="80" width="160" height="8" rx="4" fill="currentColor" opacity="0.25" />
      {/* Progress bar track */}
      <rect x="40" y="114" width="240" height="8" rx="4" fill="currentColor" opacity="0.1" />
      {/* Progress bar fill — 78% */}
      <rect x="40" y="114" width="187" height="8" rx="4" fill="currentColor" opacity="0.45" />
      {/* Count text */}
      <text x="242" y="122" fill="currentColor" fontSize="9" fontFamily="monospace" opacity="0.5">186/240</text>
      {/* Warning — near limit */}
      <rect x="40" y="132" width="100" height="6" rx="3" fill="currentColor" opacity="0.18" />
    </svg>
  );
}

function KeywordsIllustration() {
  return (
    <svg className={illustrationClass} viewBox="0 0 320 180" fill="none">
      {/* Text line 1 — keyword highlighted */}
      <rect x="40" y="52" width="60" height="8" rx="4" fill="currentColor" opacity="0.3" />
      <rect x="108" y="48" width="72" height="16" rx="4" fill="currentColor" opacity="0.18"
        stroke="currentColor" strokeWidth="1" strokeOpacity="0.35" />
      <rect x="114" y="53" width="60" height="7" rx="3" fill="currentColor" opacity="0.45" />
      <rect x="188" y="52" width="80" height="8" rx="4" fill="currentColor" opacity="0.3" />
      {/* Text line 2 */}
      <rect x="40" y="78" width="240" height="8" rx="4" fill="currentColor" opacity="0.25" />
      {/* Text line 3 — another keyword */}
      <rect x="40" y="104" width="100" height="8" rx="4" fill="currentColor" opacity="0.3" />
      <rect x="148" y="100" width="60" height="16" rx="4" fill="currentColor" opacity="0.18"
        stroke="currentColor" strokeWidth="1" strokeOpacity="0.35" />
      <rect x="154" y="105" width="48" height="7" rx="3" fill="currentColor" opacity="0.45" />
      <rect x="216" y="104" width="64" height="8" rx="4" fill="currentColor" opacity="0.25" />
    </svg>
  );
}

function TabFocusIllustration() {
  return (
    <svg className={illustrationClass} viewBox="0 0 320 180" fill="none">
      {/* Editor box with focus ring */}
      <rect x="48" y="32" width="224" height="100" rx="10"
        stroke="currentColor" strokeWidth="2" strokeOpacity="0.45" />
      <rect x="44" y="28" width="232" height="108" rx="12"
        stroke="currentColor" strokeWidth="1" strokeOpacity="0.15" strokeDasharray="4 3" />
      {/* Text lines inside */}
      <rect x="64" y="52" width="160" height="8" rx="4" fill="currentColor" opacity="0.3" />
      <rect x="64" y="70" width="192" height="8" rx="4" fill="currentColor" opacity="0.25" />
      <rect x="64" y="88" width="120" height="8" rx="4" fill="currentColor" opacity="0.2" />
      {/* Cursor */}
      <rect x="190" y="86" width="2" height="14" rx="1" fill="currentColor" opacity="0.6" />
      {/* Tab key symbol */}
      <rect x="116" y="148" width="88" height="24" rx="6" fill="currentColor" opacity="0.1"
        stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" />
      <text x="131" y="164" fill="currentColor" fontSize="10" fontFamily="monospace"
        fontWeight="600" opacity="0.5">Tab ⇥</text>
    </svg>
  );
}

function MaxLengthIllustration() {
  return (
    <svg className={illustrationClass} viewBox="0 0 320 180" fill="none">
      {/* Text lines — all full width (limit reached) */}
      <rect x="40" y="44" width="240" height="8" rx="4" fill="currentColor" opacity="0.35" />
      <rect x="40" y="62" width="240" height="8" rx="4" fill="currentColor" opacity="0.3" />
      <rect x="40" y="80" width="240" height="8" rx="4" fill="currentColor" opacity="0.25" />
      <rect x="40" y="98" width="190" height="8" rx="4" fill="currentColor" opacity="0.22" />
      {/* Cursor at limit edge */}
      <rect x="234" y="96" width="2" height="14" rx="1" fill="currentColor" opacity="0.7" />
      {/* Progress bar track */}
      <rect x="40" y="124" width="240" height="8" rx="4" fill="currentColor" opacity="0.08" />
      {/* Progress bar — 100% full */}
      <rect x="40" y="124" width="240" height="8" rx="4" fill="currentColor" opacity="0.5" />
      {/* MAX badge */}
      <rect x="248" y="140" width="32" height="16" rx="8" fill="currentColor" opacity="0.15"
        stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
      <rect x="254" y="145" width="20" height="6" rx="3" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

function SpeechToTextIllustration() {
  return (
    <svg className={illustrationClass} viewBox="0 0 320 180" fill="none">
      {/* Microphone body */}
      <rect x="148" y="28" width="24" height="44" rx="12" fill="currentColor" opacity="0.35" />
      {/* Microphone stand */}
      <path d="M136 68 C136 80 184 80 184 68" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" fill="none" opacity="0.45" />
      <line x1="160" y1="80" x2="160" y2="92" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" opacity="0.4" />
      <line x1="148" y1="92" x2="172" y2="92" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" opacity="0.4" />
      {/* Waveform bars */}
      {[
        { x: 40, h: 16 },
        { x: 56, h: 28 },
        { x: 72, h: 40 },
        { x: 88, h: 20 },
        { x: 104, h: 32 },
        { x: 208, h: 32 },
        { x: 224, h: 20 },
        { x: 240, h: 40 },
        { x: 256, h: 28 },
        { x: 272, h: 16 },
      ].map(({ x, h }, i) => (
        <rect
          key={i}
          x={x}
          y={60 - h / 2}
          width="8"
          height={h}
          rx="4"
          fill="currentColor"
          opacity={0.25 + (h / 40) * 0.3}
        />
      ))}
      {/* Transcription text */}
      <rect x="64" y="118" width="192" height="8" rx="4" fill="currentColor" opacity="0.3" />
      <rect x="80" y="136" width="160" height="8" rx="4" fill="currentColor" opacity="0.2" />
    </svg>
  );
}

export const illustrations: Record<string, any> = {
  "default-editor": DefaultEditorIllustration,
  "markdown-shortcuts": MarkdownIllustration,
  tables: TablesIllustration,
  images: ImagesIllustration,
  formatting: FormattingIllustration,
  tasks: TasksIllustration,
  "ai-chat": AiChatIllustration,
  "ai-autocomplete": AiAutocompleteIllustration,
  "slack-messenger": SlackIllustration,
  "comment-thread": CommentIllustration,
  "minimal-note": MinimalNoteIllustration,
  "code-editor": CodeEditorIllustration,
  // New illustrations
  "auto-link": AutoLinkIllustration,
  "floating-link": FloatingLinkIllustration,
  "context-menu": ContextMenuIllustration,
  collapsible: CollapsibleIllustration,
  "draggable-blocks": DraggableBlocksIllustration,
  mentions: MentionsIllustration,
  "character-limit": CharacterLimitIllustration,
  "max-length": MaxLengthIllustration,
  keywords: KeywordsIllustration,
  "tab-focus": TabFocusIllustration,
  "speech-to-text": SpeechToTextIllustration,
};
