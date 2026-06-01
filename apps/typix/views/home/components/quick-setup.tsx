"use client";

import { Check, ChevronRight, Copy, RotateCcw, Terminal } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

/* ============================================================================
   CLI flow types & data
   ========================================================================== */

type PickerItem = { label: string; selected: boolean };

type Picker = {
  prompt: string;
  items: PickerItem[];
  /** Text shown after the picker confirms (✓ Installed 4 extensions…). */
  confirmation: string;
};

type Step = {
  command: string;
  output?: string[];
  picker?: Picker;
  /** ms to leave this step on screen after its content finishes */
  hold?: number;
};

const FLOW: Step[] = [
  {
    command: "npx @typix-editor/cli init",
    output: [
      "✓ Detected pnpm",
      "✓ Created typix.json",
      "✓ Component dir: ./components/typix",
    ],
  },
  {
    command: "npx typix add",
    picker: {
      prompt: "Select extensions to install",
      items: [
        { label: "starter-kit", selected: true },
        { label: "auto-complete", selected: false },
        { label: "image", selected: true },
        { label: "table", selected: false },
        { label: "mention", selected: true },
        { label: "code-block", selected: true },
        { label: "collapsible", selected: false },
      ],
      confirmation: "✓ Installed 4 extensions in 4.1s",
    },
  },
  {
    command: "npx typix ui add",
    picker: {
      prompt: "Select UI components to vendor",
      items: [
        { label: "floating-link", selected: true },
        { label: "mention", selected: true },
        { label: "slash-command", selected: false },
        { label: "code-block", selected: true },
        { label: "table", selected: false },
        { label: "context-menu", selected: false },
      ],
      confirmation: "✓ Copied 24 files to ./components/typix",
    },
  },
  {
    command: "",
    output: ["Ready. Import from @/components/typix in your app."],
    hold: 10000,
  },
];

const READY_SNIPPET = `"use client";
import {
  EditorContent,
  TypixEditorContext,
  defaultTheme,
  useTypixEditor,
} from "@typix-editor/react";
import { StarterKit } from "@typix-editor/extension-starter-kit";
import { FloatingLinkUI } from "@/components/typix/main/floating-link";

const extensions = [StarterKit()];

export function Editor() {
  const editor = useTypixEditor({
    extensions,
    theme: defaultTheme,
    namespace: "my-editor",
  });

  return (
    <TypixEditorContext.Provider value={{ editor }}>
      <EditorContent editor={editor} placeholder="Start typing…" />
      <FloatingLinkUI />
    </TypixEditorContext.Provider>
  );
}`;

/* ============================================================================
   Shell tokenizer — colors each token of a CLI command
   ========================================================================== */

type ShellTokenKind = "cmd" | "sub" | "pkg" | "flag" | "arg" | "ws";
type ShellToken = { text: string; kind: ShellTokenKind };

const SHELL_COMMANDS = new Set(["npx", "pnpm", "npm", "yarn", "bun", "typix"]);
const SHELL_SUBCOMMANDS = new Set([
  "init",
  "add",
  "remove",
  "upgrade",
  "list",
  "install",
  "create",
  "ui",
]);

function tokenizeShell(input: string): ShellToken[] {
  const tokens: ShellToken[] = [];
  const parts = input.split(/(\s+)/);
  let seenCommand = false;

  for (const part of parts) {
    if (part.length === 0) continue;
    if (/^\s+$/.test(part)) {
      tokens.push({ text: part, kind: "ws" });
      continue;
    }
    let kind: ShellTokenKind;
    if (SHELL_COMMANDS.has(part)) {
      kind = "cmd";
      seenCommand = true;
    } else if (part.startsWith("@")) {
      kind = "pkg";
    } else if (part.startsWith("-")) {
      kind = "flag";
    } else if (seenCommand && SHELL_SUBCOMMANDS.has(part)) {
      kind = "sub";
    } else {
      kind = "arg";
    }
    tokens.push({ text: part, kind });
  }
  return tokens;
}

const SHELL_COLORS: Record<ShellTokenKind, string> = {
  cmd: "text-emerald-600 dark:text-emerald-400",
  sub: "text-sky-600 dark:text-sky-400",
  pkg: "text-violet-600 dark:text-violet-300",
  flag: "text-orange-600 dark:text-orange-400",
  arg: "text-amber-700 dark:text-amber-300",
  ws: "",
};

function renderShellTokens(input: string, charLimit?: number) {
  const tokens = tokenizeShell(input);
  let remaining = charLimit ?? input.length;
  const out: React.ReactNode[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (remaining <= 0) break;
    const visible = t.text.slice(0, remaining);
    if (visible.length === 0) break;
    remaining -= visible.length;
    if (t.kind === "ws") {
      out.push(<span key={i}>{visible}</span>);
    } else {
      out.push(
        <span className={SHELL_COLORS[t.kind]} key={i}>
          {visible}
        </span>
      );
    }
  }
  return out;
}

/* ============================================================================
   Typewriter — types a string char by char
   ========================================================================== */

function useTypewriter(target: string, speedMs: number, active: boolean) {
  const [out, setOut] = useState("");
  useEffect(() => {
    if (!active) {
      setOut("");
      return;
    }
    if (target.length === 0) {
      setOut("");
      return;
    }
    let i = 0;
    setOut("");
    const id = setInterval(() => {
      i += 1;
      setOut(target.slice(0, i));
      if (i >= target.length) clearInterval(id);
    }, speedMs);
    return () => clearInterval(id);
  }, [target, speedMs, active]);
  return out;
}

/* ============================================================================
   CopyButton
   ========================================================================== */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 1800);
  }, [text]);

  return (
    <button
      aria-label="Copy to clipboard"
      className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      onClick={handleCopy}
      type="button"
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
    </button>
  );
}

/* ============================================================================
   Output line — fades in
   ========================================================================== */

function OutputLine({ text, index }: { text: string; index: number }) {
  const checkmark = text.startsWith("✓");
  const body = checkmark ? text.slice(1).trimStart() : text;

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-2 pl-6"
      initial={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.25, delay: 0.15 + index * 0.25 }}
    >
      {checkmark ? (
        <Check
          className="mt-[3px] size-3 shrink-0 text-emerald-600 dark:text-emerald-400"
          strokeWidth={2.5}
        />
      ) : (
        <span className="mt-[3px] size-3 shrink-0" />
      )}
      <span className="text-[12.5px] text-muted-foreground sm:text-[13px]">
        {body}
      </span>
    </motion.div>
  );
}

/* ============================================================================
   PickerRow — single row in the interactive picker
   ========================================================================== */

function PickerRow({
  item,
  index,
  cursorAt,
  ticked,
  revealed,
}: {
  item: PickerItem;
  index: number;
  cursorAt: number;
  ticked: boolean;
  revealed: boolean;
}) {
  const isCursor = index === cursorAt;

  return (
    <motion.div
      animate={revealed ? { opacity: 1, x: 0 } : { opacity: 0, x: -6 }}
      className="grid grid-cols-[14px_14px_1fr] items-center gap-2 pl-6 font-mono text-[12.5px] sm:text-[13px]"
      initial={{ opacity: 0, x: -6 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
    >
      {/* Cursor */}
      <span
        className={
          isCursor
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-transparent"
        }
      >
        ❯
      </span>
      {/* Checkbox */}
      <span
        className={
          ticked
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-muted-foreground/40"
        }
      >
        {ticked ? "◉" : "◯"}
      </span>
      {/* Label */}
      <span
        className={
          ticked
            ? "text-foreground"
            : isCursor
              ? "text-foreground/80"
              : "text-muted-foreground"
        }
      >
        {item.label}
      </span>
    </motion.div>
  );
}

/* ============================================================================
   ActivePicker — animated CLI picker with cursor + checks
   ========================================================================== */

function ActivePicker({
  picker,
  onDone,
}: {
  picker: Picker;
  onDone: () => void;
}) {
  // Item count first
  const N = picker.items.length;
  // State: cursor position, set of ticked indices, phase
  const [cursorAt, setCursorAt] = useState(-1);
  const [ticked, setTicked] = useState<Set<number>>(new Set());
  const [phase, setPhase] = useState<"selecting" | "confirmed">("selecting");

  // Drive cursor through items
  useEffect(() => {
    if (phase !== "selecting") return;
    const stepMs = 380;

    const timeouts: ReturnType<typeof setTimeout>[] = [];

    for (let i = 0; i < N; i++) {
      timeouts.push(
        setTimeout(
          () => {
            setCursorAt(i);
            if (picker.items[i]?.selected) {
              setTicked((t) => new Set(t).add(i));
            }
          },
          250 + i * stepMs
        )
      );
    }
    // After last item, "confirm" the selection
    timeouts.push(
      setTimeout(
        () => {
          setCursorAt(-1);
          setPhase("confirmed");
        },
        250 + N * stepMs
      )
    );

    return () => {
      for (const t of timeouts) clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // After confirmation message has been shown, advance
  useEffect(() => {
    if (phase !== "confirmed") return;
    const id = setTimeout(onDone, 1100);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const tickedCount = ticked.size;

  return (
    <div className="space-y-1">
      {/* Prompt */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-2 pl-6"
        initial={{ opacity: 0, y: 4 }}
        transition={{ duration: 0.2 }}
      >
        <span className="font-mono text-[12.5px] text-emerald-600 dark:text-emerald-400 sm:text-[13px]">
          ?
        </span>
        <span className="text-[12.5px] text-foreground/80 sm:text-[13px]">
          {picker.prompt}{" "}
          <span className="text-muted-foreground/60">
            (↑↓ select · enter confirm)
          </span>
        </span>
      </motion.div>

      {/* Items */}
      <div className="space-y-[3px] py-1">
        {picker.items.map((item, i) => (
          <PickerRow
            cursorAt={cursorAt}
            index={i}
            item={item}
            key={item.label}
            revealed
            ticked={ticked.has(i)}
          />
        ))}
      </div>

      {/* Confirmation */}
      <AnimatePresence>
        {phase === "confirmed" && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="space-y-1"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex items-start gap-2 pl-6">
              <span className="mt-[3px] size-3 shrink-0" />
              <span className="text-[12.5px] text-muted-foreground sm:text-[13px]">
                Selected {tickedCount} item{tickedCount === 1 ? "" : "s"}…
              </span>
            </div>
            <div className="flex items-start gap-2 pl-6">
              <Check
                className="mt-[3px] size-3 shrink-0 text-emerald-600 dark:text-emerald-400"
                strokeWidth={2.5}
              />
              <span className="text-[12.5px] text-muted-foreground sm:text-[13px]">
                {picker.confirmation.replace(/^✓\s*/, "")}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============================================================================
   CompletedStep — past steps stay visible, dimmed
   ========================================================================== */

function CompletedStep({ step }: { step: Step }) {
  return (
    <div className="space-y-1 opacity-60">
      {step.command && (
        <div className="flex items-center gap-2 font-mono text-[13px]">
          <ChevronRight className="size-3.5 shrink-0 text-muted-foreground/60" />
          <span>{renderShellTokens(step.command)}</span>
        </div>
      )}
      {/* Picker summary (collapsed) */}
      {step.picker && (
        <div className="flex items-start gap-2 pl-6">
          <Check
            className="mt-[3px] size-3 shrink-0 text-emerald-600/70 dark:text-emerald-400/70"
            strokeWidth={2.5}
          />
          <span className="text-[12.5px] text-muted-foreground/70 sm:text-[13px]">
            {step.picker.confirmation.replace(/^✓\s*/, "")}
          </span>
        </div>
      )}
      {/* Static output */}
      {step.output?.map((line) => {
        const checkmark = line.startsWith("✓");
        const body = checkmark ? line.slice(1).trimStart() : line;
        return (
          <div className="flex items-start gap-2 pl-6" key={line}>
            {checkmark ? (
              <Check
                className="mt-[3px] size-3 shrink-0 text-emerald-600/70 dark:text-emerald-400/70"
                strokeWidth={2.5}
              />
            ) : (
              <span className="mt-[3px] size-3 shrink-0" />
            )}
            <span className="text-[12.5px] text-muted-foreground/70 sm:text-[13px]">
              {body}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ============================================================================
   ActiveStep — typewriter + (picker OR output) reveal
   ========================================================================== */

function ActiveStep({ step, onDone }: { step: Step; onDone: () => void }) {
  const typed = useTypewriter(step.command, 38, true);
  const isDoneTyping = typed === step.command;
  const [contentVisible, setContentVisible] = useState(false);

  // After command finishes typing, reveal content (output or picker),
  // then advance — but if content is a picker, the picker drives advance.
  useEffect(() => {
    if (!isDoneTyping) {
      setContentVisible(false);
      return;
    }
    const showId = setTimeout(() => setContentVisible(true), 250);
    let advanceId: ReturnType<typeof setTimeout> | null = null;
    if (!step.picker) {
      const advanceMs =
        350 + (step.output?.length ?? 0) * 250 + (step.hold ?? 800);
      advanceId = setTimeout(onDone, advanceMs);
    }
    return () => {
      clearTimeout(showId);
      if (advanceId) clearTimeout(advanceId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDoneTyping]);

  return (
    <div className="space-y-1">
      {step.command && (
        <div className="flex items-center gap-2 font-mono text-[13px]">
          <ChevronRight className="size-3.5 shrink-0 text-foreground/60" />
          <span>{renderShellTokens(step.command, typed.length)}</span>
          {!step.picker && (
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              className="inline-block h-[14px] w-[7px] bg-foreground/80"
              transition={{ duration: 0.9, repeat: Number.POSITIVE_INFINITY }}
            />
          )}
        </div>
      )}
      {contentVisible &&
        (step.picker ? (
          <ActivePicker onDone={onDone} picker={step.picker} />
        ) : (
          step.output?.map((line, i) => (
            <OutputLine index={i} key={line} text={line} />
          ))
        ))}
    </div>
  );
}

/* ============================================================================
   StepIndicator — left-side dots
   ========================================================================== */

function StepIndicator({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div
            className={`size-1.5 rounded-full transition-colors ${
              done
                ? "bg-emerald-500/60 dark:bg-emerald-400/60"
                : active
                  ? "bg-emerald-500 dark:bg-emerald-400"
                  : "bg-muted-foreground/20"
            }`}
            // biome-ignore lint/suspicious/noArrayIndexKey: stable indicator dots
            key={i}
          />
        );
      })}
    </div>
  );
}

/* ============================================================================
   CodePreview — final ready-state snippet (real, copy-pasteable)
   ========================================================================== */

function CodePreview() {
  // JS syntax palette — emerald for keywords, sky for components,
  // amber for strings, violet for literals.
  const kw = "text-emerald-600 dark:text-emerald-400";
  const tag = "text-sky-600 dark:text-sky-400";
  const str = "text-amber-700 dark:text-amber-300";
  const attr = "text-foreground";
  const fn = "text-sky-600 dark:text-sky-400";
  const punc = "text-muted-foreground/70";

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-xl border border-border/60 bg-background/60 backdrop-blur-sm dark:bg-neutral-950/50"
      initial={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.45, delay: 0.1 }}
    >
      <div className="flex items-center justify-between border-border/60 border-b bg-muted/40 px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-emerald-500/60 dark:bg-emerald-400/60" />
          <span className="font-mono text-[11px] text-muted-foreground">
            components/editor.tsx
          </span>
        </div>
        <CopyButton text={READY_SNIPPET} />
      </div>
      <pre className="scrollbar-none overflow-x-auto px-4 py-3 font-mono text-[12px] leading-[1.7] sm:text-[12.5px]">
        <code>
          {/* "use client"; */}
          <span className={str}>&quot;use client&quot;</span>
          <span className={punc}>;</span>
          {"\n"}
          {/* import { ... } from "@typix-editor/react"; */}
          <span className={kw}>import</span> <span className={punc}>{"{"}</span>
          {"\n  "}
          <span className={tag}>EditorContent</span>
          <span className={punc}>,</span>
          {"\n  "}
          <span className={tag}>TypixEditorContext</span>
          <span className={punc}>,</span>
          {"\n  "}
          <span className={attr}>defaultTheme</span>
          <span className={punc}>,</span>
          {"\n  "}
          <span className={fn}>useTypixEditor</span>
          <span className={punc}>,</span>
          {"\n"}
          <span className={punc}>{"}"}</span> <span className={kw}>from</span>{" "}
          <span className={str}>&quot;@typix-editor/react&quot;</span>
          <span className={punc}>;</span>
          {"\n"}
          {/* import { StarterKit } from "@typix-editor/extension-starter-kit"; */}
          <span className={kw}>import</span>{" "}
          <span className={punc}>{"{ "}</span>
          <span className={tag}>StarterKit</span>
          <span className={punc}>{" } "}</span>
          <span className={kw}>from</span>{" "}
          <span className={str}>
            &quot;@typix-editor/extension-starter-kit&quot;
          </span>
          <span className={punc}>;</span>
          {"\n"}
          {/* import { FloatingLinkUI } from "@/components/typix/main/floating-link"; */}
          <span className={kw}>import</span>{" "}
          <span className={punc}>{"{ "}</span>
          <span className={tag}>FloatingLinkUI</span>
          <span className={punc}>{" } "}</span>
          <span className={kw}>from</span>{" "}
          <span className={str}>
            &quot;@/components/typix/main/floating-link&quot;
          </span>
          <span className={punc}>;</span>
          {"\n\n"}
          {/* const extensions = [StarterKit()]; */}
          <span className={kw}>const</span>{" "}
          <span className={attr}>extensions</span>
          <span className={punc}> = [</span>
          <span className={fn}>StarterKit</span>
          <span className={punc}>()];</span>
          {"\n\n"}
          {/* export function Editor() { */}
          <span className={kw}>export function</span>{" "}
          <span className={fn}>Editor</span>
          <span className={punc}>() {"{"}</span>
          {"\n  "}
          <span className={kw}>const</span> <span className={attr}>editor</span>
          <span className={punc}> = </span>
          <span className={fn}>useTypixEditor</span>
          <span className={punc}>{"({"}</span>
          {"\n    "}
          <span className={attr}>extensions</span>
          <span className={punc}>,</span>
          {"\n    "}
          <span className={attr}>theme</span>
          <span className={punc}>: </span>
          <span className={attr}>defaultTheme</span>
          <span className={punc}>,</span>
          {"\n    "}
          <span className={attr}>namespace</span>
          <span className={punc}>: </span>
          <span className={str}>&quot;my-editor&quot;</span>
          <span className={punc}>,</span>
          {"\n  "}
          <span className={punc}>{"});"}</span>
          {"\n\n"}
          {/* return ( */}
          <span className={kw}>return</span>
          <span className={punc}> (</span>
          {"\n    "}
          <span className={punc}>&lt;</span>
          <span className={tag}>TypixEditorContext.Provider</span>{" "}
          <span className={attr}>value</span>
          <span className={punc}>={"{{"}</span>{" "}
          <span className={attr}>editor</span>{" "}
          <span className={punc}>{"}}"}</span>
          <span className={punc}>&gt;</span>
          {"\n      "}
          <span className={punc}>&lt;</span>
          <span className={tag}>EditorContent</span>{" "}
          <span className={attr}>editor</span>
          <span className={punc}>={"{"}</span>
          <span className={attr}>editor</span>
          <span className={punc}>{"} "}</span>
          <span className={attr}>placeholder</span>
          <span className={punc}>=</span>
          <span className={str}>&quot;Start typing…&quot;</span>
          <span className={punc}> /&gt;</span>
          {"\n      "}
          <span className={punc}>&lt;</span>
          <span className={tag}>FloatingLinkUI</span>
          <span className={punc}> /&gt;</span>
          {"\n    "}
          <span className={punc}>&lt;/</span>
          <span className={tag}>TypixEditorContext.Provider</span>
          <span className={punc}>&gt;</span>
          {"\n  "}
          <span className={punc}>);</span>
          {"\n"}
          <span className={punc}>{"}"}</span>
        </code>
      </pre>
    </motion.div>
  );
}

/* ============================================================================
   Terminal — drives the flow
   ========================================================================== */

function Terminal_({ runKey }: { runKey: number }) {
  const [current, setCurrent] = useState(0);
  const completed = FLOW.slice(0, current);
  const active = FLOW[current];
  const isFinal = current >= FLOW.length;

  // Reset when re-played
  useEffect(() => {
    setCurrent(0);
  }, [runKey]);

  const handleDone = useCallback(() => {
    setCurrent((c) => Math.min(c + 1, FLOW.length));
  }, []);

  return (
    <div className="relative grid grid-cols-[auto_1fr] gap-4 sm:gap-5">
      <StepIndicator
        current={Math.min(current, FLOW.length - 1)}
        total={FLOW.length}
      />

      <div className="min-h-[320px] space-y-4 sm:min-h-[360px]">
        {completed.map((step, i) => (
          <CompletedStep key={`${runKey}-${i}-${step.command}`} step={step} />
        ))}
        {active && (
          <ActiveStep
            key={`${runKey}-active-${current}`}
            onDone={handleDone}
            step={active}
          />
        )}
        <AnimatePresence>
          {isFinal && (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              initial={{ opacity: 0, y: 8 }}
              key="ready"
              transition={{ duration: 0.4 }}
            >
              <CodePreview />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ============================================================================
   QuickSetup — main export
   ========================================================================== */

export function QuickSetup() {
  const [runKey, setRunKey] = useState(0);

  return (
    <section className="relative py-16 md:py-24 lg:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Heading */}
        <motion.div
          className="mb-10 text-center sm:mb-14"
          initial={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className="font-semibold text-3xl tracking-tight sm:text-4xl">
            From zero to{" "}
            <span className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 bg-clip-text text-transparent">
              editor
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-base text-muted-foreground sm:text-[17px]">
            Three commands. Watch it install, configure, and scaffold a working
            editor.
          </p>
        </motion.div>

        {/* Terminal frame */}
        <motion.div
          className="relative overflow-hidden rounded-2xl border border-border/70 bg-background/60 shadow-sm backdrop-blur-sm dark:bg-neutral-950/50"
          initial={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          {/* Title bar */}
          <div className="flex items-center justify-between border-border/60 border-b bg-muted/40 px-4 py-2.5">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="size-2.5 rounded-full bg-muted-foreground/25" />
                <div className="size-2.5 rounded-full bg-muted-foreground/25" />
                <div className="size-2.5 rounded-full bg-muted-foreground/25" />
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Terminal className="size-3.5" />
                <span className="font-mono text-[12px]">my-app — zsh</span>
              </div>
            </div>
            <button
              aria-label="Replay"
              className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              onClick={() => setRunKey((k) => k + 1)}
              type="button"
            >
              <RotateCcw className="size-3" />
              <span>Replay</span>
            </button>
          </div>

          {/* Terminal body */}
          <div className="px-5 py-6 sm:px-7 sm:py-7">
            <Terminal_ runKey={runKey} />
          </div>
        </motion.div>

        {/* Subtle hint */}
        <p className="mt-6 text-center text-[12.5px] text-muted-foreground/70">
          Vendored UI lives in your repo — own the code, customize anything.
        </p>
      </div>
    </section>
  );
}
