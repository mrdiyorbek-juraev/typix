"use client";

import {
  AtSign,
  Blocks,
  Code,
  GripVertical,
  Hash,
  Keyboard,
  Link2,
  ListChecks,
  Mic,
  MousePointerClick,
  Paintbrush,
  Palette,
  Scissors,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const sectionVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

/* ------------------------------------------------------------------ */
/*  Shared card wrapper                                                */
/* ------------------------------------------------------------------ */

function BentoCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={`group relative overflow-hidden rounded-xl border border-border/60 bg-card p-5 transition-all duration-300 hover:border-border hover:shadow-lg hover:shadow-emerald-500/5 sm:p-6 ${className}`}
      // @ts-expect-error
      variants={cardVariants}
    >
      {/* Hover gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/[0.03] via-transparent to-green-500/[0.03] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative">{children}</div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Card A — Headless / Full Control (large, 2col × 2row)             */
/* ------------------------------------------------------------------ */

const uiVariants = [
  {
    label: "Clean",
    accent:
      "bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200",
    toolbar: "bg-muted/30",
    content: "bg-card",
    heading: "Getting Started with Typix",
    body: "A minimal, distraction-free writing experience. Just you and your words.",
    tag: "Documentation",
    tagClass:
      "bg-neutral-200/60 text-neutral-600 dark:bg-neutral-700/60 dark:text-neutral-300",
    highlight: "bg-neutral-200/50 dark:bg-neutral-700/40",
  },
  {
    label: "Notion",
    accent: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    toolbar: "bg-[#fbfaf8] dark:bg-amber-950/20",
    content: "bg-[#fbfaf8] dark:bg-card",
    heading: "Team Meeting Notes",
    body: "Discuss Q2 roadmap, assign owners, and track progress across teams.",
    tag: "Workspace",
    tagClass:
      "bg-amber-100/80 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
    highlight: "bg-amber-200/40 dark:bg-amber-500/10",
  },
  {
    label: "Custom",
    accent: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white",
    toolbar: "bg-emerald-50/60 dark:bg-emerald-950/20",
    content: "bg-emerald-50/20 dark:bg-card",
    heading: "Launch Announcement",
    body: "Introducing our new editor — built for speed, designed for developers.",
    tag: "Published",
    tagClass:
      "bg-emerald-100/80 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
    highlight: "bg-emerald-200/40 dark:bg-emerald-500/10",
  },
] as const;

function HeadlessCard() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setActive((p) => (p + 1) % uiVariants.length),
      3500
    );
    return () => clearInterval(id);
  }, []);

  return (
    <BentoCard className="flex flex-col md:col-span-2 md:row-span-2">
      {/* Accent border */}
      <div className="absolute top-1 bottom-4 left-0 w-[3px] rounded-full bg-gradient-to-b from-emerald-500 to-green-500" />

      <div className="mb-5 ml-2 pl-2">
        <h3 className="font-bold text-lg tracking-tight sm:text-xl">
          Headless by Design
        </h3>
        <p className="mt-1.5 max-w-xs text-muted-foreground text-sm leading-relaxed">
          Zero opinions on UI. Same editor core, endless looks — you own every
          pixel.
        </p>
      </div>

      {/* Variant pills */}
      <div className="mb-3 ml-2 flex items-center gap-1.5">
        {uiVariants.map((v, i) => (
          <button
            className={`rounded-full px-3 py-1 font-medium text-[10px] transition-all duration-200 sm:text-xs ${i === active ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/25" : "text-muted-foreground hover:text-foreground"}`}
            key={v.label}
            onClick={() => setActive(i)}
            type="button"
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* Stacked card deck */}
      <div className="relative mt-auto ml-4 min-h-[200px] flex-1 sm:min-h-[240px]">
        {uiVariants.map((v, i) => {
          const offset = i - active;
          const isActive = i === active;
          return (
            <motion.div
              animate={{
                y: isActive ? 0 : 20 + Math.abs(offset) * 28,
                scale: isActive ? 1 : 1 - Math.abs(offset) * 0.05,
                opacity: isActive ? 1 : 0.5 - Math.abs(offset) * 0.15,
                zIndex: isActive ? 10 : 5 - Math.abs(offset),
              }}
              className="absolute inset-x-0 overflow-hidden rounded-xl border border-border/60 bg-card shadow-md"
              key={v.label}
              transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
            >
              {/* Mini toolbar */}
              <div
                className={`flex items-center gap-1 border-border/40 border-b px-2.5 py-1.5 sm:gap-1.5 sm:px-3 ${v.toolbar}`}
              >
                {["B", "I", "U"].map((b) => (
                  <div
                    className={`flex size-5 items-center justify-center rounded font-bold text-[9px] sm:size-6 sm:text-[10px] ${v.accent}`}
                    key={b}
                  >
                    {b}
                  </div>
                ))}
                <div className="mx-1 h-3.5 w-px bg-border/40 sm:mx-1.5" />
                <div className="flex h-5 items-center rounded px-1.5 text-[9px] text-muted-foreground sm:h-6 sm:px-2 sm:text-[10px]">
                  Paragraph
                </div>
                <div className="ml-auto flex items-center gap-1.5">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[8px] font-medium sm:text-[9px] ${v.tagClass}`}
                  >
                    {v.tag}
                  </span>
                </div>
              </div>
              {/* Content */}
              <div className={`space-y-2.5 p-3 sm:p-4 ${v.content}`}>
                <div className="font-bold text-xs tracking-tight sm:text-sm">
                  {v.heading}
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed sm:text-xs">
                  {v.body}
                </p>
                <div className="flex items-center gap-2 pt-0.5">
                  <div className={`h-1.5 w-12 rounded-full ${v.highlight}`} />
                  <div className={`h-1.5 w-20 rounded-full ${v.highlight}`} />
                  <div className={`h-1.5 w-8 rounded-full ${v.highlight}`} />
                </div>
                <div className="flex items-center gap-2 pt-0.5">
                  <div
                    className={`h-5 w-16 rounded-md ${v.accent} opacity-70`}
                  />
                  <div className="h-2 w-16 rounded-full bg-muted-foreground/8" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </BentoCard>
  );
}

/* ------------------------------------------------------------------ */
/*  Card B — Extension System (wide)                                   */
/* ------------------------------------------------------------------ */

const extensions = [
  { name: "Rich Text", icon: Paintbrush },
  { name: "Mentions", icon: AtSign },
  { name: "Auto Link", icon: Link2 },
  { name: "Drag & Drop", icon: GripVertical },
  { name: "Code Highlight", icon: Code },
  { name: "Keywords", icon: Hash },
  { name: "Shortcuts", icon: Keyboard },
  { name: "Collapsible", icon: ListChecks },
  { name: "Context Menu", icon: MousePointerClick },
  { name: "Speech to Text", icon: Mic },
  { name: "Max Length", icon: Scissors },
  { name: "Tab Focus", icon: Blocks },
  { name: "Auto Complete", icon: Sparkles },
  { name: "Link", icon: Link2 },
  { name: "Draggable Block", icon: GripVertical },
  { name: "Themes", icon: Palette },
];

function ExtensionsCard() {
  return (
    <BentoCard className="md:col-span-2">
      <h3 className="font-bold text-lg tracking-tight sm:text-xl">
        16+ Extensions
      </h3>
      <p className="mt-1 text-muted-foreground text-sm">
        Modular architecture. Add only what you need.
      </p>

      {/* Marquee */}
      <div className="-mx-5 sm:-mx-6 relative mt-4 overflow-hidden">
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-card to-transparent sm:w-16" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-card to-transparent sm:w-16" />

        <div className="flex animate-marquee gap-3">
          {[...extensions, ...extensions].map((ext, i) => (
            <div
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-border/60 bg-muted/40 px-3 py-1.5 font-medium text-muted-foreground text-xs"
              key={`${ext.name}-${i}`}
            >
              <ext.icon className="size-3.5 text-emerald-400" />
              {ext.name}
            </div>
          ))}
        </div>
      </div>
    </BentoCard>
  );
}

/* ------------------------------------------------------------------ */
/*  Card C — Type-Safe (small)                                         */
/* ------------------------------------------------------------------ */

function TypeSafeCard() {
  return (
    <BentoCard className="md:col-span-1">
      <h3 className="font-bold text-base tracking-tight sm:text-lg">
        Fully Typed
      </h3>
      <p className="mt-1 text-muted-foreground text-xs sm:text-sm">
        End-to-end TypeScript. Autocomplete everywhere.
      </p>

      <div className="mt-4 overflow-hidden rounded-lg border border-border/60 bg-neutral-950 p-3 font-mono text-[10px] leading-relaxed sm:text-xs dark:bg-neutral-900/60">
        <div>
          <span className="text-purple-400">const</span>
          <span className="text-neutral-300"> editor </span>
          <span className="text-purple-400">=</span>
          <span className="text-blue-400"> useEditor</span>
          <span className="text-neutral-400">{"<"}</span>
        </div>
        <div className="pl-3">
          <span className="text-sky-400">RichTextExtension</span>
          <span className="text-neutral-400">,</span>
        </div>
        <div className="pl-3">
          <span className="text-sky-400">LinkExtension</span>
        </div>
        <div>
          <span className="text-neutral-400">{">"}</span>
          <span className="text-neutral-400">()</span>
          <motion.span
            animate={{ opacity: [1, 0] }}
            className="ml-px inline-block h-3.5 w-[2px] translate-y-[1px] bg-emerald-400"
            transition={{
              duration: 0.6,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        </div>
        <div className="mt-1 text-neutral-500">{"// ^ Full IntelliSense"}</div>
      </div>
    </BentoCard>
  );
}

/* ------------------------------------------------------------------ */
/*  Card D — Performance (small)                                       */
/* ------------------------------------------------------------------ */

function PerformanceCard() {
  return (
    <BentoCard className="md:col-span-1">
      <h3 className="font-bold text-base tracking-tight sm:text-lg">
        Blazing Fast
      </h3>
      <p className="mt-1 text-muted-foreground text-xs sm:text-sm">
        Built on Meta's Lexical engine.
      </p>

      {/* Gauge */}
      <div className="mt-4 flex flex-col items-center">
        <svg className="w-full max-w-[160px]" viewBox="0 0 120 70">
          {/* Track */}
          <path
            className="text-muted/60"
            d="M 15 65 A 50 50 0 0 1 105 65"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="8"
          />
          {/* Fill */}
          <motion.path
            d="M 15 65 A 50 50 0 0 1 105 65"
            fill="none"
            initial={{ pathLength: 0 }}
            stroke="url(#gauge-grad)"
            strokeLinecap="round"
            strokeWidth="8"
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
            viewport={{ once: true }}
            whileInView={{ pathLength: 0.92 }}
          />
          <defs>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              id="gauge-grad"
              x1="15"
              x2="105"
              y1="65"
              y2="65"
            >
              <stop stopColor="#34d399" />
              <stop offset="0.5" stopColor="#22c55e" />
              <stop offset="1" stopColor="#14b8a6" />
            </linearGradient>
          </defs>
        </svg>

        <motion.div
          className="mt-1 text-center"
          initial={{ opacity: 0 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1 }}
        >
          <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text font-bold text-2xl text-transparent sm:text-3xl">
            {"<1ms"}
          </span>
          <p className="mt-0.5 text-[10px] text-muted-foreground sm:text-xs">
            render time
          </p>
        </motion.div>
      </div>
    </BentoCard>
  );
}

/* ------------------------------------------------------------------ */
/*  Card E — AI Ready (wide)                                           */
/* ------------------------------------------------------------------ */

function AiReadyCard() {
  return (
    <BentoCard className="md:col-span-2">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 font-bold text-lg tracking-tight sm:text-xl">
            <Sparkles className="size-5 text-violet-400" />
            AI Ready
          </h3>
          <p className="mt-1 max-w-sm text-muted-foreground text-sm">
            First-class AI extension support. Autocomplete, rewrite, summarize —
            plug in any LLM.
          </p>
        </div>
        <Badge
          className="shrink-0 border-violet-500/30 text-[10px] text-violet-400 sm:text-xs"
          variant="outline"
        >
          Coming Soon
        </Badge>
      </div>

      {/* AI ghost text demo */}
      <div className="mt-4 rounded-lg border border-border/60 bg-muted/30 p-3 text-muted-foreground text-xs leading-relaxed sm:p-4 sm:text-[13px]">
        <span className="text-foreground">
          The editor supports modular extensions that
        </span>
        <AiGhostText text=" enable powerful AI-assisted writing, including autocomplete suggestions, tone adjustments, and content summarization." />
      </div>

      {/* AI action chips */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {["Autocomplete", "Rewrite", "Summarize", "Translate"].map((action) => (
          <div
            className="flex items-center gap-1.5 rounded-full border border-violet-500/20 bg-violet-500/5 px-2.5 py-1 font-medium text-[10px] text-violet-400 sm:text-xs"
            key={action}
          >
            <Sparkles className="size-3" />
            {action}
          </div>
        ))}
      </div>
    </BentoCard>
  );
}

function AiGhostText({ text }: { text: string }) {
  return (
    <motion.span
      animate={{ opacity: [0, 0.5, 0.5, 0] }}
      className="text-muted-foreground/30 italic"
      initial={{ opacity: 0 }}
      transition={{
        duration: 5,
        repeat: Number.POSITIVE_INFINITY,
        repeatDelay: 2,
        times: [0, 0.15, 0.75, 1],
      }}
    >
      {text}
    </motion.span>
  );
}

/* ------------------------------------------------------------------ */
/*  Card F — Collaboration (wide)                                      */
/* ------------------------------------------------------------------ */

const collabCursors = [
  {
    name: "Alice",
    color: "#f43f5e",
    path: { x: ["15%", "45%", "30%", "15%"], y: ["20%", "30%", "60%", "20%"] },
  },
  {
    name: "Bob",
    color: "#3b82f6",
    path: { x: ["70%", "50%", "65%", "70%"], y: ["50%", "25%", "40%", "50%"] },
  },
  {
    name: "Carol",
    color: "#a855f7",
    path: { x: ["40%", "75%", "55%", "40%"], y: ["70%", "60%", "30%", "70%"] },
  },
];

function CollaborationCard() {
  return (
    <BentoCard className="md:col-span-2">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-lg tracking-tight sm:text-xl">
            Real-Time Collaboration
          </h3>
          <p className="mt-1 text-muted-foreground text-sm">
            Multiple cursors, presence awareness, and conflict-free editing.
          </p>
        </div>
        <Badge
          className="shrink-0 border-blue-500/30 text-[10px] text-blue-400 sm:text-xs"
          variant="outline"
        >
          Coming Soon
        </Badge>
      </div>

      {/* Collab demo */}
      <div className="relative mt-4 min-h-[100px] overflow-hidden rounded-lg border border-border/60 bg-muted/20 p-4 sm:min-h-[120px]">
        {/* Mock text lines */}
        <div className="space-y-2.5">
          {[1, 0.85, 0.7, 0.55].map((w, i) => (
            <div
              className="h-2 rounded-full bg-muted-foreground/10"
              key={i}
              style={{ width: `${w * 100}%` }}
            />
          ))}
        </div>

        {/* Selection highlight */}
        <div className="absolute top-[38px] left-[20%] h-4 w-[30%] rounded-sm bg-rose-500/10" />
        <div className="absolute top-[54px] left-[45%] h-4 w-[25%] rounded-sm bg-blue-500/10" />

        {/* Animated cursors */}
        {collabCursors.map((cursor) => (
          <motion.div
            animate={{
              left: cursor.path.x,
              top: cursor.path.y,
            }}
            className="pointer-events-none absolute z-10"
            key={cursor.name}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <svg
              className="drop-shadow-sm"
              fill="none"
              height="14"
              viewBox="0 0 12 16"
              width="10"
            >
              <path
                d="M0.5 0.5L11 8L5.5 8.5L3 15L0.5 0.5Z"
                fill={cursor.color}
                stroke="white"
                strokeWidth="0.8"
              />
            </svg>
            <div
              className="-mt-0.5 ml-2 whitespace-nowrap rounded px-1 py-0.5 font-medium text-[8px] text-white shadow-sm sm:text-[9px]"
              style={{ backgroundColor: cursor.color }}
            >
              {cursor.name}
            </div>
          </motion.div>
        ))}
      </div>
    </BentoCard>
  );
}

/* ------------------------------------------------------------------ */
/*  Main section                                                       */
/* ------------------------------------------------------------------ */

export function WhyTypix() {
  return (
    <section className="relative py-16 md:py-24 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        {/* Section heading */}
        <motion.div
          className="mb-10 text-center sm:mb-14"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className="font-bold text-3xl tracking-tight sm:text-4xl">
            Why{" "}
            <span className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 bg-clip-text text-transparent">
              Typix
            </span>
            ?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-base text-muted-foreground sm:text-lg">
            Everything you need to build world-class editing experiences.
          </p>
        </motion.div>

        {/* Bento grid */}
        <motion.div
          className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-5"
          initial="hidden"
          variants={sectionVariants}
          viewport={{ once: true, amount: 0.1 }}
          whileInView="show"
        >
          <HeadlessCard />
          <ExtensionsCard />
          <TypeSafeCard />
          <PerformanceCard />
          <AiReadyCard />
          <CollaborationCard />
        </motion.div>
      </div>
    </section>
  );
}
