"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { $getNodeByKey } from "lexical";
import { $isCodeNode } from "@typix-editor/core/lexical/code";
import { useTypixEditorState, useSignal } from "@typix-editor/react";
import { Copy, Trash2, Check, Wand2, AlertCircle } from "lucide-react";
import { LanguageSelector } from "./language-selector";
import {
  canFormatWithPrettier,
  PrettierFormatterExtension,
  type PrettierOutput,
} from "@typix-editor/extension-code-block-prettier";
import { getExtensionOutput, type TypixEditor } from "@typix-editor/core";

// ─── Prettier button ──────────────────────────────────────────────────────────

function PrettierButton({
  nodeKey,
  language,
  editor,
}: {
  nodeKey: string;
  language: string;
  editor: TypixEditor;
}) {
  const output = getExtensionOutput<PrettierOutput>(editor.lexical, PrettierFormatterExtension)!;
  const formatting = useSignal(output.formatting);
  const errors = useSignal(output.errors);

  const isRunning = formatting.has(nodeKey);
  const error = errors.get(nodeKey);

  if (!canFormatWithPrettier(language)) return null;

  return (
    <div className="relative group">
      <button
        type="button"
        title={error ? "Prettier error — hover to see" : "Format with Prettier"}
        disabled={isRunning}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() =>
          editor.chain().formatWithPrettier({ nodeKey }).run()
        }
        className={`flex items-center rounded p-1 transition-colors disabled:opacity-40 ${
          error
            ? "text-destructive hover:bg-destructive/10"
            : "text-muted-foreground hover:bg-accent hover:text-foreground"
        }`}
      >
        {error ? (
          <AlertCircle className="size-3" />
        ) : (
          <Wand2 className={`size-3 ${isRunning ? "animate-pulse" : ""}`} />
        )}
      </button>

      {error && (
        <div className="pointer-events-none absolute bottom-full right-0 z-50 mb-1.5 hidden w-64 rounded-md border border-border bg-popover p-2 shadow-md group-hover:block">
          <p className="text-[10px] font-medium text-destructive">
            Prettier error
          </p>
          <pre className="mt-1 whitespace-pre-wrap break-all text-[9px] text-muted-foreground">
            {error}
          </pre>
        </div>
      )}
    </div>
  );
}

// ─── Main toolbar ─────────────────────────────────────────────────────────────

interface CodeBlockToolbarProps {
  nodeKey: string;
}

export function CodeBlockToolbar({ nodeKey }: CodeBlockToolbarProps) {
  const editor = useTypixEditorState();
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [language, setLanguage] = useState("javascript");
  const [copied, setCopied] = useState(false);

  const hasPrettier = !!getExtensionOutput<PrettierOutput>(editor.lexical, PrettierFormatterExtension);

  useEffect(() => {
    const sync = () => {
      const el = editor.lexical.getElementByKey(nodeKey);
      if (el) setRect(el.getBoundingClientRect());
      editor.lexical.getEditorState().read(() => {
        const node = $getNodeByKey(nodeKey);
        if ($isCodeNode(node)) setLanguage(node.getLanguage() ?? "javascript");
      });
    };

    sync();
    const unregister = editor.lexical.registerUpdateListener(sync);
    const onScroll = () => {
      const el = editor.lexical.getElementByKey(nodeKey);
      if (el) setRect(el.getBoundingClientRect());
    };
    window.addEventListener("scroll", onScroll, true);
    return () => {
      unregister();
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [editor, nodeKey]);

  if (!rect) return null;

  const handleCopy = () => {
    editor.chain().copyCode({ nodeKey }).run();
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDelete = () => {
    editor.chain().deleteCodeBlock({ nodeKey }).run();
  };

  return createPortal(
    <div
      style={{
        position: "fixed",
        top: rect.top + 6,
        right: window.innerWidth - rect.right + 6,
        zIndex: 40,
        pointerEvents: "auto",
      }}
      className="flex items-center gap-0.5 rounded-md border border-border/60 bg-background/90 px-1 py-0.5 shadow-sm backdrop-blur-sm"
    >
      <LanguageSelector
        nodeKey={nodeKey}
        language={language}
        onSelect={(lang) =>
          editor.chain().setCodeLanguage({ nodeKey, language: lang }).run()
        }
      />

      {<div className="mx-0.5 h-3 w-px bg-border" />}

      {hasPrettier && (
        <PrettierButton nodeKey={nodeKey} language={language} editor={editor} />
      )}

      {<div className="mx-0.5 h-3 w-px bg-border" />}

      <button
        type="button"
        title="Copy code"
        onMouseDown={(e) => e.preventDefault()}
        onClick={handleCopy}
        className="flex items-center rounded p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        {copied ? (
          <Check className="size-3 text-green-500" />
        ) : (
          <Copy className="size-3" />
        )}
      </button>

      <button
        type="button"
        title="Delete code block"
        onMouseDown={(e) => e.preventDefault()}
        onClick={handleDelete}
        className="flex items-center rounded p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
      >
        <Trash2 className="size-3" />
      </button>
    </div>,
    document.body
  );
}
