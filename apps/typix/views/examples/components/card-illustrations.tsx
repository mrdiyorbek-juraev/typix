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

export const illustrations: Record<string, ComponentType> = {
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
};
