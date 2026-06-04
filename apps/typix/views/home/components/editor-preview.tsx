"use client";

import {
  Bold,
  ChevronDown,
  Code,
  ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Pilcrow,
  Quote,
  Redo,
  Sparkles,
  Strikethrough,
  Underline,
  Undo,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";

/* ------------------------------------------------------------------ */
/*  Collaborators (real avatar URLs + colors)                         */
/* ------------------------------------------------------------------ */

const collaborators = [
  {
    name: "Alice Chen",
    color: "#e11d48", // rose-600 — only used for cursor labels
    avatar: "https://i.pravatar.cc/64?img=47",
  },
  {
    name: "Bob Martin",
    color: "#2563eb", // blue-600
    avatar: "https://i.pravatar.cc/64?img=12",
  },
  {
    name: "Casey Lee",
    color: "#7c3aed", // violet-600
    avatar: "https://i.pravatar.cc/64?img=33",
  },
] as const;

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
      className={`flex size-7 cursor-default items-center justify-center rounded-md transition-colors sm:size-[30px] ${
        active
          ? "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-400/15 dark:text-emerald-400"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      } ${className ?? ""}`}
    >
      <Icon className="size-3.5" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Typewriter — loops type → hold → clear → repeat                    */
/* ------------------------------------------------------------------ */

/**
 * Streams a target string in token-like chunks (1-4 words at a time)
 * with brief pauses between — simulates an LLM streaming response.
 * After the full text is "generated", it holds, then clears and loops.
 *
 * Returns: { text, streaming } so consumers can show a generating
 * indicator while streaming, and a "Generated" badge when done.
 */
function useAiStream(
  target: string,
  opts: { chunkMs?: number; holdMs?: number; clearMs?: number } = {}
) {
  const { chunkMs = 110, holdMs = 2800, clearMs = 600 } = opts;
  const [text, setText] = useState("");
  const [streaming, setStreaming] = useState(true);

  useEffect(() => {
    let cancelled = false;
    // Pre-split target into word tokens so chunks are word-aligned (more
    // LLM-like than char-by-char).
    const tokens = target.split(/(\s+)/).filter((t) => t.length > 0);
    let tokenIdx = 0;
    let phase: "streaming" | "holding" | "clearing" = "streaming";
    let lastTick = Date.now();

    const tick = () => {
      if (cancelled) return;
      const now = Date.now();
      const dt = now - lastTick;

      if (phase === "streaming") {
        if (dt >= chunkMs) {
          // Stream 1-3 tokens at a time so chunks vary in length, like
          // a real streaming LLM that emits multi-char tokens.
          const advance = 1 + Math.floor(Math.random() * 3);
          tokenIdx = Math.min(tokenIdx + advance, tokens.length);
          setText(tokens.slice(0, tokenIdx).join(""));
          lastTick = now;
          if (tokenIdx >= tokens.length) {
            phase = "holding";
            setStreaming(false);
            lastTick = now;
          }
        }
      } else if (phase === "holding") {
        if (dt >= holdMs) {
          phase = "clearing";
          lastTick = now;
        }
      } else if (phase === "clearing") {
        if (dt >= clearMs) {
          tokenIdx = 0;
          setText("");
          setStreaming(true);
          phase = "streaming";
          lastTick = now;
        }
      }

      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
    return () => {
      cancelled = true;
    };
  }, [target, chunkMs, holdMs, clearMs]);

  return { text, streaming };
}

/* ------------------------------------------------------------------ */
/*  Collab cursor — moves smoothly between waypoints                  */
/* ------------------------------------------------------------------ */

function CollabCursor({
  name,
  color,
  path,
  duration,
  delay,
}: {
  name: string;
  color: string;
  path: { x: string[]; y: string[] };
  duration: number;
  delay: number;
}) {
  return (
    <motion.div
      animate={{ left: path.x, top: path.y }}
      className="pointer-events-none absolute z-20"
      initial={{ left: path.x[0], top: path.y[0] }}
      transition={{
        duration,
        delay,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
    >
      <svg
        aria-hidden="true"
        className="drop-shadow-sm"
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
        {name.split(" ")[0]}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main editor preview                                                */
/* ------------------------------------------------------------------ */

const LEAD_PARAGRAPH =
  "A headless, extensible editor framework built on Meta's Lexical. Ship a polished editor in minutes — own every line you customize.";

export function EditorPreview() {
  const { text: streamed, streaming } = useAiStream(LEAD_PARAGRAPH, {
    chunkMs: 110,
    holdMs: 3500,
    clearMs: 600,
  });

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.55, delay: 0.2, ease: "easeOut" }}
      viewport={{ once: true }}
      whileInView={{ opacity: 1, x: 0 }}
    >
      {/* Window frame */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-background shadow-sm sm:rounded-2xl">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-border/80 border-b bg-muted/30 px-3 py-2 sm:gap-3 sm:px-4 sm:py-2.5">
          <div className="flex items-center gap-1.5">
            <div className="size-2.5 rounded-full bg-muted-foreground/25" />
            <div className="size-2.5 rounded-full bg-muted-foreground/25" />
            <div className="size-2.5 rounded-full bg-muted-foreground/25" />
          </div>

          {/* Document name + saving status */}
          <div className="flex flex-1 items-center justify-center gap-2">
            <div className="hidden items-center gap-1.5 rounded-md px-2 py-0.5 transition-colors hover:bg-muted/60 sm:flex">
              <span className="font-medium text-[12px] text-foreground/85">
                Product Roadmap — Q4
              </span>
              <span className="text-muted-foreground/40">/</span>
              <span className="text-[11px] text-muted-foreground">
                Engineering
              </span>
            </div>
          </div>

          {/* Saved indicator + collaborators */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-1.5 sm:flex">
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                className="size-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400"
                transition={{
                  duration: 1.8,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
              <span className="text-[10.5px] text-muted-foreground">
                All changes saved
              </span>
            </div>

            <div className="-space-x-1.5 flex items-center">
              {collaborators.map((c) => (
                <div
                  className="relative flex size-5 items-center justify-center overflow-hidden rounded-full border-2 border-background bg-muted sm:size-6"
                  key={c.name}
                  title={c.name}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt={c.name}
                    className="size-full object-cover"
                    loading="lazy"
                    src={c.avatar}
                  />
                  <span className="absolute right-0 bottom-0 size-1.5 rounded-full border border-background bg-emerald-500 dark:bg-emerald-400" />
                </div>
              ))}
              <div className="flex size-5 items-center justify-center rounded-full border-2 border-background bg-muted/70 font-medium text-[9px] text-muted-foreground sm:size-6 sm:text-[10px]">
                +4
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="scrollbar-none flex items-center gap-1 overflow-x-auto border-border/80 border-b bg-background px-2 py-1.5 sm:px-3 sm:py-2">
          <div className="flex shrink-0 items-center gap-0.5">
            <ToolbarBtn icon={Undo} />
            <ToolbarBtn icon={Redo} />
          </div>

          <Separator
            className="!h-5 mx-1 shrink-0 sm:mx-1.5"
            orientation="vertical"
          />

          <div className="flex h-7 shrink-0 cursor-default items-center gap-1.5 rounded-md px-2 text-foreground/80 text-xs transition-colors hover:bg-muted">
            <Pilcrow className="size-3.5" />
            <span className="hidden min-[480px]:inline">Paragraph</span>
            <ChevronDown className="size-3 opacity-60" />
          </div>

          <Separator
            className="!h-5 mx-1 shrink-0 sm:mx-1.5"
            orientation="vertical"
          />

          <div className="flex shrink-0 items-center gap-0.5">
            <ToolbarBtn icon={Bold} />
            <ToolbarBtn icon={Italic} />
            <ToolbarBtn icon={Underline} />
            <ToolbarBtn className="hidden sm:flex" icon={Strikethrough} />
            <ToolbarBtn className="hidden sm:flex" icon={Code} />
          </div>

          <Separator
            className="!h-5 mx-1 hidden shrink-0 sm:mx-1.5 sm:block"
            orientation="vertical"
          />

          <div className="hidden shrink-0 items-center gap-0.5 sm:flex">
            <ToolbarBtn icon={Link2} />
            <ToolbarBtn icon={ImageIcon} />
            <ToolbarBtn icon={List} />
            <ToolbarBtn icon={ListOrdered} />
            <ToolbarBtn icon={Quote} />
          </div>
        </div>

        {/* Editor content */}
        <div className="relative space-y-4 px-5 py-6 sm:px-7 sm:py-7">
          {/* Heading (static) */}
          <h2 className="font-semibold text-[20px] text-foreground tracking-tight sm:text-[22px]">
            Welcome to Typix
          </h2>

          {/* Lead paragraph — AI-streamed, looping. While streaming, a
              pulsing sparkle sits at the end of the text. When done, a
              subtle "Generated with AI" footer appears for the hold. */}
          <div className="space-y-1.5">
            <p className="text-[13.5px] text-foreground/80 leading-[1.7] sm:text-[14px]">
              {streamed}
              {streaming ? (
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.05, 0.9] }}
                  className="ml-1 inline-flex translate-y-[2px] items-center"
                  transition={{
                    duration: 1.2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  <Sparkles className="size-3 text-emerald-500 dark:text-emerald-400" />
                </motion.span>
              ) : null}
            </p>
            {!streaming && (
              <motion.div
                animate={{ opacity: 1 }}
                className="flex items-center gap-1.5 text-[10.5px] text-muted-foreground"
                initial={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                <Sparkles className="size-2.5 text-emerald-500 dark:text-emerald-400" />
                <span>
                  Generated with{" "}
                  <span className="font-medium text-foreground/70">
                    Typix AI
                  </span>
                </span>
              </motion.div>
            )}
          </div>

          {/* Code block (static) */}
          <div className="overflow-hidden rounded-lg border border-border bg-muted/30">
            <div className="flex items-center justify-between border-border/70 border-b bg-muted/40 px-3 py-1.5">
              <span className="font-mono text-[10.5px] text-muted-foreground/80">
                editor.tsx
              </span>
              <span className="font-mono text-[10.5px] text-muted-foreground/60">
                tsx
              </span>
            </div>
            <pre className="scrollbar-none overflow-x-auto px-3 py-2.5 font-mono text-[11.5px] leading-[1.65] sm:text-[12px]">
              <code>
                <span className="text-emerald-600 dark:text-emerald-400">
                  import
                </span>{" "}
                <span className="text-muted-foreground/80">{"{"}</span>{" "}
                <span className="text-foreground">useTypixEditor</span>{" "}
                <span className="text-muted-foreground/80">{"}"}</span>{" "}
                <span className="text-emerald-600 dark:text-emerald-400">
                  from
                </span>{" "}
                <span className="text-amber-700 dark:text-amber-300">
                  &quot;@typix-editor/react&quot;
                </span>
                <span className="text-muted-foreground/80">;</span>
              </code>
            </pre>
          </div>

          {/* Bullet list (static) */}
          <ul className="space-y-2 pl-1">
            {[
              "Extension-based — install only what you need",
              "Slash commands, mentions, and floating menus",
              "Built on Lexical for performance at scale",
            ].map((line) => (
              <li className="flex items-start gap-3" key={line}>
                <span className="mt-[8px] size-1.5 shrink-0 rounded-full bg-foreground/40" />
                <span className="text-[13px] text-foreground/75 leading-[1.6] sm:text-[13.5px]">
                  {line}
                </span>
              </li>
            ))}
          </ul>

          {/* Blockquote */}
          <blockquote className="border-foreground/15 border-l-2 pl-4">
            <p className="text-[13px] text-muted-foreground italic leading-[1.6] sm:text-[13.5px]">
              The headless model means you never fight your editor to make it
              look the way you want.
            </p>
            <footer className="mt-1 text-[11.5px] text-muted-foreground/70 not-italic">
              — Alice, in{" "}
              <span className="text-foreground/70">#engineering</span>
            </footer>
          </blockquote>

          {/* Collaboration cursors — moving across the editor body */}
          <CollabCursor
            color="#e11d48"
            delay={0}
            duration={14}
            name="Alice"
            path={{
              x: ["18%", "52%", "38%", "22%", "18%"],
              y: ["28%", "22%", "55%", "72%", "28%"],
            }}
          />
          <CollabCursor
            color="#2563eb"
            delay={2}
            duration={16}
            name="Bob"
            path={{
              x: ["62%", "44%", "68%", "55%", "62%"],
              y: ["58%", "38%", "26%", "68%", "58%"],
            }}
          />
          <CollabCursor
            color="#7c3aed"
            delay={4}
            duration={18}
            name="Casey"
            path={{
              x: ["38%", "70%", "30%", "58%", "38%"],
              y: ["78%", "62%", "34%", "82%", "78%"],
            }}
          />
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between gap-3 border-border/80 border-t bg-muted/20 px-4 py-1.5 text-[11px] text-muted-foreground sm:px-5">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
              Connected
            </span>
            <span className="hidden text-muted-foreground/40 sm:inline">•</span>
            <span className="hidden tabular-nums sm:inline">
              <span className="text-foreground/70">142</span> words
            </span>
            <span className="hidden text-muted-foreground/40 min-[420px]:inline">
              •
            </span>
            <span className="hidden tabular-nums min-[420px]:inline">
              <span className="text-foreground/70">1</span> min read
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline">Markdown</span>
            <span className="hidden text-muted-foreground/40 sm:inline">•</span>
            <span className="tabular-nums">
              Ln <span className="text-foreground/70">12</span>, Col{" "}
              <span className="text-foreground/70">8</span>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
