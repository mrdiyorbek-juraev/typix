"use client";

import { Check, Copy, Terminal } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

/* ------------------------------------------------------------------ */
/*  CopyButton                                                         */
/* ------------------------------------------------------------------ */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 2000);
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

/* ------------------------------------------------------------------ */
/*  InstallBlock                                                       */
/* ------------------------------------------------------------------ */

const packageManagers = [
  { label: "pnpm", command: "pnpm add @typix-editor/react" },
  { label: "npm", command: "npm install @typix-editor/react" },
  { label: "yarn", command: "yarn add @typix-editor/react" },
] as const;

function InstallBlock() {
  const [active, setActive] = useState(0);
  const pm = packageManagers[active];

  return (
    <motion.div
      className="mx-auto w-full max-w-2xl"
      // @ts-expect-error
      variants={itemVariants}
    >
      <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-neutral-100 transition-all duration-300 hover:border-border hover:shadow-lg hover:shadow-emerald-500/5 dark:border-white/[0.08] dark:bg-neutral-950 dark:hover:border-white/[0.15]">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/[0.04] via-transparent to-green-500/[0.04] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Package manager tabs */}
        <div className="relative flex items-center gap-1 border-border/60 border-b px-4 pt-3 pb-0 dark:border-white/[0.06]">
          {packageManagers.map((pm, i) => (
            <button
              className={`relative rounded-t-md px-3 py-1.5 font-mono text-xs transition-colors ${i === active ? "text-foreground" : "text-muted-foreground hover:text-foreground/70"}`}
              key={pm.label}
              onClick={() => setActive(i)}
              type="button"
            >
              {pm.label}
              {i === active && (
                <motion.div
                  className="absolute inset-x-0 -bottom-px h-px bg-emerald-500"
                  layoutId="pm-tab"
                  transition={{ duration: 0.2 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Command */}
        <div className="relative flex items-center gap-3 px-5 py-4">
          <Terminal className="size-4 shrink-0 text-emerald-500" />
          <code className="scrollbar-none flex-1 overflow-x-auto font-mono text-sm sm:text-base">
            <span className="text-muted-foreground">$ </span>
            <span className="text-foreground/80">
              {pm.command.split(" ").slice(0, -1).join(" ")}{" "}
            </span>
            <span className="text-emerald-600 dark:text-emerald-400">
              @typix-editor/react
            </span>
          </code>
          <CopyButton text={pm.command} />
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  CodeBlock — reusable card wrapper                                  */
/* ------------------------------------------------------------------ */

function CodeBlock({
  label,
  copyText,
  children,
}: {
  label: string;
  copyText: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className="group relative overflow-hidden rounded-2xl border border-border/60 bg-neutral-100 transition-all duration-300 hover:border-border hover:shadow-lg hover:shadow-emerald-500/5 dark:border-white/[0.08] dark:bg-neutral-950 dark:hover:border-white/[0.15]"
      // @ts-expect-error
      variants={itemVariants}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/[0.04] via-transparent to-green-500/[0.04] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Header */}
      <div className="relative flex items-center border-border/60 border-b px-4 py-3 dark:border-white/[0.06]">
        {/* Traffic-light dots */}
        <div className="flex items-center gap-1.5">
          <div className="size-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700/80" />
          <div className="size-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700/80" />
          <div className="size-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700/80" />
        </div>

        {/* Label centered */}
        <span className="absolute inset-x-0 text-center font-medium text-muted-foreground text-xs">
          {label}
        </span>

        {/* Right side actions */}
        <div className="ml-auto flex items-center gap-2">
          <span className="rounded-md bg-neutral-200 px-2 py-0.5 font-medium text-[11px] text-muted-foreground dark:bg-neutral-800/80">
            tsx
          </span>
          <CopyButton text={copyText} />
        </div>
      </div>

      {/* Code area */}
      <div className="scrollbar-none relative overflow-x-auto p-5 font-mono text-xs leading-[1.8] sm:text-sm">
        {children}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  StructureCode — left panel                                         */
/* ------------------------------------------------------------------ */

const structureText = `<EditorRoot>
  <EditorContent>
    <EditorCommand>
      <EditorCommandItem />
      <EditorCommandItem />
      <EditorCommandItem />
    </EditorCommand>
    <EditorBubble>
      <EditorBubbleItem />
      <EditorBubbleItem />
      <EditorBubbleItem />
    </EditorBubble>
  </EditorContent>
</EditorRoot>`;

function StructureCode() {
  const tag = "text-sky-600 dark:text-sky-400";
  const punc = "text-neutral-500 dark:text-neutral-400";

  const Tag = ({
    name,
    indent = 0,
    selfClosing = false,
    closing = false,
  }: {
    name: string;
    indent?: number;
    selfClosing?: boolean;
    closing?: boolean;
  }) => (
    <div style={{ paddingLeft: indent }}>
      <span className={punc}>{closing ? "</" : "<"}</span>
      <span className={tag}>{name}</span>
      <span className={punc}>{selfClosing ? " />" : ">"}</span>
    </div>
  );

  return (
    <CodeBlock copyText={structureText} label="Structure">
      <Tag name="EditorRoot" />
      <Tag indent={20} name="EditorContent" />
      <Tag indent={40} name="EditorCommand" />
      {[0, 1, 2].map((i) => (
        <Tag indent={60} key={i} name="EditorCommandItem" selfClosing />
      ))}
      <Tag closing indent={40} name="EditorCommand" />
      <Tag indent={40} name="EditorBubble" />
      {[0, 1, 2].map((i) => (
        <Tag indent={60} key={i} name="EditorBubbleItem" selfClosing />
      ))}
      <Tag closing indent={40} name="EditorBubble" />
      <Tag closing indent={20} name="EditorContent" />
      <Tag closing name="EditorRoot" />
    </CodeBlock>
  );
}

/* ------------------------------------------------------------------ */
/*  SetupCode — right panel                                            */
/* ------------------------------------------------------------------ */

const setupText = `import {
  EditorRoot,
  EditorContent,
} from "@typix-editor/react"
import {
  RichTextExtension,
} from "@typix-editor/extension-rich-text"

export function MyEditor() {
  return (
    <EditorRoot>
      <EditorContent
        extensions={[RichTextExtension()]}
        placeholder="Start typing..."
        onContentChange={(state) => {
          // save to your backend
          console.log(state)
        }}
      />
    </EditorRoot>
  )
}`;

function SetupCode() {
  const kw = "text-purple-600 dark:text-purple-400";
  const tag = "text-sky-600 dark:text-sky-400";
  const str = "text-green-600 dark:text-green-400";
  const attr = "text-orange-600 dark:text-orange-300";
  const punc = "text-neutral-500 dark:text-neutral-400";
  const comment = "text-neutral-400 dark:text-neutral-500";
  const fn = "text-blue-600 dark:text-blue-400";
  const param = "text-amber-600 dark:text-amber-300";

  return (
    <CodeBlock copyText={setupText} label="Minimal Setup">
      {/* import { EditorRoot, EditorContent } from "..." */}
      <div>
        <span className={kw}>import</span>
        <span className={punc}>{" {"}</span>
      </div>
      <div className="pl-5">
        <span className={tag}>EditorRoot</span>
        <span className={punc}>,</span>
      </div>
      <div className="pl-5">
        <span className={tag}>EditorContent</span>
        <span className={punc}>,</span>
      </div>
      <div>
        <span className={punc}>{"} "}</span>
        <span className={kw}>from</span>
        <span className={punc}> </span>
        <span className={str}>"@typix-editor/react"</span>
      </div>

      <div className="h-4" />

      {/* export function MyEditor() { */}
      <div>
        <span className={kw}>export function</span>
        <span className={punc}> </span>
        <span className={fn}>MyEditor</span>
        <span className={punc}>() {"{"}</span>
      </div>

      {/* return ( */}
      <div className="pl-5">
        <span className={kw}>return</span>
        <span className={punc}> (</span>
      </div>

      {/* <EditorRoot> */}
      <div className="pl-10">
        <span className={punc}>{"<"}</span>
        <span className={tag}>EditorRoot</span>
        <span className={punc}>{">"}</span>
      </div>

      {/* <EditorContent */}
      <div className="pl-[3.75rem]">
        <span className={punc}>{"<"}</span>
        <span className={tag}>EditorContent</span>
      </div>

      {/* placeholder="Start typing..." */}
      <div className="pl-20">
        <span className={attr}>placeholder</span>
        <span className={punc}>=</span>
        <span className={str}>"Start typing..."</span>
      </div>

      {/* onContentChange={(state) => { */}
      <div className="pl-20">
        <span className={attr}>onContentChange</span>
        <span className={punc}>={"{"}(</span>
        <span className={param}>state</span>
        <span className={punc}>)</span>
        <span className={kw}> =&gt;</span>
        <span className={punc}> {"{"}</span>
      </div>

      {/* // save to your backend */}
      <div className="pl-[6.25rem]">
        <span className={comment}>{"// save to your backend"}</span>
      </div>

      {/* console.log(state) */}
      <div className="pl-[6.25rem]">
        <span className={punc}>console.</span>
        <span className={fn}>log</span>
        <span className={punc}>(</span>
        <span className={param}>state</span>
        <span className={punc}>)</span>
      </div>

      {/* }} */}
      <div className="pl-20">
        <span className={punc}>{"}}"}</span>
      </div>

      {/* /> */}
      <div className="pl-[3.75rem]">
        <span className={punc}>/{">"}</span>
      </div>

      {/* </EditorRoot> */}
      <div className="pl-10">
        <span className={punc}>{"</"}</span>
        <span className={tag}>EditorRoot</span>
        <span className={punc}>{">"}</span>
      </div>

      {/* ) */}
      <div className="pl-5">
        <span className={punc}>)</span>
      </div>

      {/* } */}
      <div>
        <span className={punc}>{"}"}</span>
      </div>
    </CodeBlock>
  );
}

/* ------------------------------------------------------------------ */
/*  QuickSetup — main export                                           */
/* ------------------------------------------------------------------ */

export function QuickSetup() {
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
            Get Started with{" "}
            <span className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 bg-clip-text text-transparent">
              Typix
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-base text-muted-foreground sm:text-lg">
            Up and running in under a minute.
          </p>
        </motion.div>

        {/* Content */}
        <motion.div
          className="flex flex-col gap-6"
          initial="hidden"
          variants={containerVariants}
          viewport={{ once: true, amount: 0.1 }}
          whileInView="show"
        >
          {/* Install command */}
          <InstallBlock />

          {/* Code panels */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <StructureCode />
            <SetupCode />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
