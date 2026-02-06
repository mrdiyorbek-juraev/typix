"use client";

import {
  AlignLeft,
  Bold,
  ChevronDown,
  Code,
  CodeXml,
  Heading2,
  ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Redo,
  Sparkles,
  Strikethrough,
  Type,
  Underline,
  Undo,
} from "lucide-react";
import { motion } from "motion/react";
import { Separator } from "@/components/ui/separator";

/* ------------------------------------------------------------------ */
/*  Collaborative cursors                                              */
/* ------------------------------------------------------------------ */

const collaborators = [
  { name: "Alice", color: "#f43f5e", x: "72%", y: "27%" },
  { name: "Bob", color: "#3b82f6", x: "38%", y: "58%" },
] as const;

function CollabCursor({
  name,
  color,
  style,
  delay,
}: {
  name: string;
  color: string;
  style: React.CSSProperties;
  delay: number;
}) {
  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      className="pointer-events-none absolute z-20"
      initial={{ opacity: 0, scale: 0.6 }}
      style={style}
      transition={{ duration: 0.4, delay }}
    >
      {/* Cursor arrow */}
      <svg
        className="drop-shadow-md"
        fill="none"
        height="16"
        viewBox="0 0 12 16"
        width="12"
      >
        <path
          d="M0.5 0.5L11 8L5.5 8.5L3 15L0.5 0.5Z"
          fill={color}
          stroke="white"
          strokeWidth="0.8"
        />
      </svg>
      {/* Name tag */}
      <div
        className="-mt-0.5 ml-2.5 whitespace-nowrap rounded px-1.5 py-0.5 font-medium text-[9px] text-white shadow-sm"
        style={{ backgroundColor: color }}
      >
        {name}
      </div>
      {/* Ambient glow */}
      <motion.div
        animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.15, 0.3] }}
        className="-inset-3 absolute rounded-full opacity-30 blur-md"
        style={{ backgroundColor: color }}
        transition={{
          duration: 2.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Cursor movement path (simulates a collaborator moving)            */
/* ------------------------------------------------------------------ */

function MovingCursor({ name, color }: { name: string; color: string }) {
  return (
    <motion.div
      animate={{
        left: ["20%", "55%", "48%", "62%", "20%"],
        top: ["40%", "35%", "52%", "48%", "40%"],
      }}
      className="pointer-events-none absolute z-20"
      initial={{ left: "20%", top: "40%" }}
      transition={{
        duration: 12,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
    >
      <svg
        className="drop-shadow-md"
        fill="none"
        height="16"
        viewBox="0 0 12 16"
        width="12"
      >
        <path
          d="M0.5 0.5L11 8L5.5 8.5L3 15L0.5 0.5Z"
          fill={color}
          stroke="white"
          strokeWidth="0.8"
        />
      </svg>
      <div
        className="-mt-0.5 ml-2.5 whitespace-nowrap rounded px-1.5 py-0.5 font-medium text-[9px] text-white shadow-sm"
        style={{ backgroundColor: color }}
      >
        {name}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  AI suggestion ghost text                                          */
/* ------------------------------------------------------------------ */

function AiSuggestion() {
  return (
    <motion.span
      animate={{ opacity: [0, 0.6, 0.6, 0] }}
      className="inline text-muted-foreground/40 italic"
      initial={{ opacity: 0 }}
      transition={{
        duration: 4,
        repeat: Number.POSITIVE_INFINITY,
        repeatDelay: 3,
        times: [0, 0.15, 0.75, 1],
      }}
    >
      {" "}
      with powerful AI-assisted writing capabilities
    </motion.span>
  );
}

/* ------------------------------------------------------------------ */
/*  AI inline toolbar                                                  */
/* ------------------------------------------------------------------ */

function AiFloatingBar() {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="absolute bottom-3 left-3 z-30 hidden items-center gap-1.5 rounded-lg border border-violet-500/20 bg-background/95 px-2 py-1 shadow-lg backdrop-blur-sm sm:bottom-4 sm:left-5 min-[480px]:flex"
      initial={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.5, delay: 1.2 }}
    >
      <div className="flex size-5 items-center justify-center rounded bg-gradient-to-br from-violet-500 to-fuchsia-500">
        <Sparkles className="size-3 text-white" />
      </div>
      <span className="font-medium text-[10px] text-muted-foreground sm:text-[11px]">
        AI Assist
      </span>
      <Separator className="!h-3.5 mx-0.5" orientation="vertical" />
      {["Improve", "Shorten", "Fix"].map((action) => (
        <div
          className="cursor-default rounded px-1.5 py-0.5 text-[9px] text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground sm:text-[10px]"
          key={action}
        >
          {action}
        </div>
      ))}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Toolbar button                                                     */
/* ------------------------------------------------------------------ */

function ToolbarBtn({
  icon: Icon,
  active,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`flex size-6 cursor-default items-center justify-center rounded-md transition-colors sm:size-7 ${active ? "bg-accent text-accent-foreground" : "text-muted-foreground/70 hover:bg-accent/60 hover:text-muted-foreground"} ${className ?? ""}`}
    >
      <Icon className="size-3 sm:size-3.5" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main editor preview                                                */
/* ------------------------------------------------------------------ */

export function EditorPreview() {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      viewport={{ once: true }}
      whileInView={{ opacity: 1, x: 0 }}
    >
      {/* Glow */}
      <div className="-inset-4 sm:-inset-6 absolute rounded-3xl bg-gradient-to-br from-violet-500/15 via-fuchsia-500/10 to-pink-500/15 blur-2xl sm:blur-3xl" />

      {/* Browser frame */}
      <div className="relative overflow-hidden rounded-xl border border-border/60 bg-card shadow-2xl ring-1 ring-white/5 sm:rounded-2xl">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-border/60 border-b bg-muted/40 px-3 py-2 sm:gap-3 sm:px-4 sm:py-2.5">
          <div className="flex items-center gap-1.5">
            <div className="size-2.5 rounded-full bg-rose-400 shadow-rose-400/30 shadow-sm sm:size-3" />
            <div className="size-2.5 rounded-full bg-amber-400 shadow-amber-400/30 shadow-sm sm:size-3" />
            <div className="size-2.5 rounded-full bg-emerald-400 shadow-emerald-400/30 shadow-sm sm:size-3" />
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="max-w-[180px] truncate rounded-md bg-background/70 px-3 py-1 text-[10px] text-muted-foreground/70 sm:max-w-none sm:px-4 sm:text-[11px]">
              typix-editor.dev/playground
            </div>
          </div>
          {/* Online avatars */}
          <div className="-space-x-1.5 flex items-center">
            {collaborators.map((c) => (
              <div
                className="flex size-5 items-center justify-center rounded-full border-2 border-card font-bold text-[8px] text-white sm:size-6 sm:text-[9px]"
                key={c.name}
                style={{ backgroundColor: c.color }}
                title={c.name}
              >
                {c.name[0]}
              </div>
            ))}
            <div className="flex size-5 items-center justify-center rounded-full border-2 border-card bg-muted font-medium text-[8px] text-muted-foreground sm:size-6 sm:text-[9px]">
              +3
            </div>
          </div>
        </div>

        {/* Toolbar — scrollable on small screens */}
        <div className="scrollbar-none flex items-center gap-0.5 overflow-x-auto border-border/60 border-b bg-muted/20 px-2 py-1 sm:px-3 sm:py-1.5">
          <div className="flex shrink-0 items-center gap-0.5">
            <ToolbarBtn icon={Undo} />
            <ToolbarBtn icon={Redo} />
          </div>
          <Separator
            className="!h-4 mx-1 shrink-0 sm:mx-1.5"
            orientation="vertical"
          />

          <div className="flex h-7 shrink-0 cursor-default items-center gap-1 rounded-md px-2 text-muted-foreground text-xs hover:bg-accent/60">
            <AlignLeft className="size-3.5" />
            <span className="hidden min-[480px]:inline">Paragraph</span>
            <ChevronDown className="size-3 opacity-50" />
          </div>
          <Separator
            className="!h-4 mx-1 shrink-0 sm:mx-1.5"
            orientation="vertical"
          />

          <div className="flex shrink-0 items-center gap-0.5">
            <ToolbarBtn active icon={Bold} />
            <ToolbarBtn icon={Italic} />
            <ToolbarBtn icon={Underline} />
            <ToolbarBtn className="hidden sm:flex" icon={Strikethrough} />
            <ToolbarBtn className="hidden sm:flex" icon={CodeXml} />
          </div>
          <Separator
            className="!h-4 mx-1 shrink-0 sm:mx-1.5"
            orientation="vertical"
          />

          <div className="flex shrink-0 items-center gap-0.5">
            <ToolbarBtn icon={Link2} />
            <ToolbarBtn className="hidden sm:flex" icon={ImageIcon} />
          </div>
          <Separator
            className="!h-4 mx-1 hidden shrink-0 sm:mx-1.5 sm:block"
            orientation="vertical"
          />

          <div className="hidden shrink-0 items-center gap-0.5 sm:flex">
            <ToolbarBtn icon={List} />
            <ToolbarBtn icon={ListOrdered} />
            <ToolbarBtn icon={Quote} />
          </div>

          {/* AI button in toolbar */}
          <Separator
            className="!h-4 mx-1 shrink-0 sm:mx-1.5"
            orientation="vertical"
          />
          <div className="flex shrink-0 cursor-default items-center gap-1 rounded-md px-1.5 py-0.5 font-medium text-[10px] text-violet-400 transition-colors hover:bg-violet-500/10 sm:px-2 sm:text-xs">
            <Sparkles className="size-3 sm:size-3.5" />
            <span className="hidden sm:inline">AI</span>
          </div>
        </div>

        {/* Editor content */}
        <div className="relative min-h-[240px] space-y-3 p-3 sm:min-h-[280px] sm:space-y-4 sm:p-5">
          {/* Collaborative cursors */}
          {collaborators.map((c, i) => (
            <CollabCursor
              color={c.color}
              delay={0.6 + i * 0.3}
              key={c.name}
              name={c.name}
              style={{ left: c.x, top: c.y }}
            />
          ))}
          <MovingCursor color="#a855f7" name="You" />

          {/* Selection highlight from collaborator */}
          <div className="pointer-events-none absolute top-[54%] right-[42%] left-[12%] h-[18px] rounded-sm bg-blue-500/10" />

          {/* Heading */}
          <div className="flex items-center gap-2">
            <span className="font-medium text-[10px] text-violet-400/60 sm:text-xs">
              H2
            </span>
            <h2 className="font-bold text-base tracking-tight sm:text-lg">
              Welcome to Typix
            </h2>
          </div>

          {/* Rich paragraph with AI ghost text */}
          <p className="text-muted-foreground text-xs leading-relaxed sm:text-[13px]">
            A <span className="font-bold text-foreground">headless</span>,
            extensible editor framework that gives you{" "}
            <span className="rounded bg-violet-500/10 px-1 py-0.5 text-violet-400">
              full control
            </span>{" "}
            over your{" "}
            <span className="underline decoration-fuchsia-400/50 decoration-wavy underline-offset-4">
              editing experience
            </span>
            <AiSuggestion />
          </p>

          {/* Code block */}
          <div className="group relative overflow-hidden rounded-lg border border-border/60 bg-neutral-950 dark:bg-neutral-900/60">
            <div className="flex items-center justify-between border-white/5 border-b px-2.5 py-1 sm:px-3 sm:py-1.5">
              <span className="font-medium text-[10px] text-muted-foreground/50">
                tsx
              </span>
              <span className="text-[10px] text-muted-foreground/30">copy</span>
            </div>
            <div className="scrollbar-none overflow-x-auto px-2.5 py-2 font-mono text-[10px] leading-relaxed sm:px-3 sm:py-3 sm:text-xs">
              <span className="text-violet-400">import</span>
              <span className="text-neutral-300">{" { "}</span>
              <span className="text-emerald-400">EditorRoot</span>
              <span className="text-neutral-300">{", "}</span>
              <span className="text-emerald-400">EditorContent</span>
              <span className="text-neutral-300">{" } "}</span>
              <span className="text-violet-400">from</span>
              <span className="text-amber-300">{" '@typix-editor/react'"}</span>
            </div>
          </div>

          {/* Bullet list */}
          <div className="space-y-1.5 pl-1 sm:space-y-2">
            {[
              "Extension-based architecture",
              "Slash commands & mentions",
              "Built on Meta's Lexical engine",
            ].map((line) => (
              <div className="flex items-start gap-2" key={line}>
                <div className="mt-[6px] size-1.5 shrink-0 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400 sm:mt-[7px]" />
                <span className="text-muted-foreground text-xs sm:text-[13px]">
                  {line}
                </span>
              </div>
            ))}
          </div>

          {/* Slash command popup */}
          <motion.div
            className="absolute right-3 bottom-3 z-10 hidden w-40 overflow-hidden rounded-lg border border-border/60 bg-popover shadow-xl sm:right-5 sm:bottom-4 sm:w-48 min-[480px]:block"
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.4, delay: 0.8 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
          >
            <div className="border-border/40 border-b px-2.5 py-1 font-medium text-[9px] text-muted-foreground/60 sm:px-3 sm:py-1.5 sm:text-[10px]">
              Commands
            </div>
            {[
              { icon: Type, label: "Text", active: true },
              { icon: Heading2, label: "Heading" },
              { icon: List, label: "Bullet list" },
              { icon: Code, label: "Code block" },
              { icon: Quote, label: "Quote" },
              { icon: Sparkles, label: "Ask AI", ai: true },
            ].map(({ icon: Icon, label, active, ai }) => (
              <div
                className={`flex items-center gap-2 px-2.5 py-1 text-[11px] sm:gap-2.5 sm:px-3 sm:py-1.5 sm:text-xs ${active ? "bg-accent text-accent-foreground" : ai ? "text-violet-400" : "text-muted-foreground"}`}
                key={label}
              >
                <Icon className="size-3 shrink-0 sm:size-3.5" />
                {label}
              </div>
            ))}
          </motion.div>

          {/* AI floating bar */}
          <AiFloatingBar />
        </div>
      </div>
    </motion.div>
  );
}
