import { signal, type Signal } from "@typix-editor/core/lexical/extension";
import { $isCodeNode } from "@typix-editor/core/lexical/code";
import {
  $getNodeByKey,
  defineExtension,
  safeCast,
  type LexicalEditor,
} from "lexical";
import {
  defineTypixExtension,
  type TypixExtensionConfig,
} from "@typix-editor/core";

// ─── Parser map (Prettier v3 plugin paths) ───────────────────────────────────

/**
 * Lexical/Prism language key → { parser name, plugin loaders }
 * Mirrors the PRETTIER_PARSER_MODULES pattern from the Lexical playground,
 * updated for Prettier v3 plugin paths.
 */
const LANG_MAP: Record<
  string,
  { parser: string; load: Array<() => Promise<unknown>> }
> = {
  javascript: {
    parser: "babel-ts",
    load: [
      () => import("prettier/plugins/babel"),
      () => import("prettier/plugins/estree"),
    ],
  },
  js: {
    parser: "babel-ts",
    load: [
      () => import("prettier/plugins/babel"),
      () => import("prettier/plugins/estree"),
    ],
  },
  jsx: {
    parser: "babel-ts",
    load: [
      () => import("prettier/plugins/babel"),
      () => import("prettier/plugins/estree"),
    ],
  },
  typescript: {
    parser: "typescript",
    load: [
      () => import("prettier/plugins/typescript"),
      () => import("prettier/plugins/estree"),
    ],
  },
  ts: {
    parser: "typescript",
    load: [
      () => import("prettier/plugins/typescript"),
      () => import("prettier/plugins/estree"),
    ],
  },
  tsx: {
    parser: "typescript",
    load: [
      () => import("prettier/plugins/typescript"),
      () => import("prettier/plugins/estree"),
    ],
  },
  css: {
    parser: "css",
    load: [() => import("prettier/plugins/postcss")],
  },
  scss: {
    parser: "scss",
    load: [() => import("prettier/plugins/postcss")],
  },
  less: {
    parser: "less",
    load: [() => import("prettier/plugins/postcss")],
  },
  html: {
    parser: "html",
    load: [() => import("prettier/plugins/html")],
  },
  markdown: {
    parser: "markdown",
    load: [() => import("prettier/plugins/markdown")],
  },
  md: {
    parser: "markdown",
    load: [() => import("prettier/plugins/markdown")],
  },
  json: {
    parser: "json",
    load: [
      () => import("prettier/plugins/babel"),
      () => import("prettier/plugins/estree"),
    ],
  },
  graphql: {
    parser: "graphql",
    load: [() => import("prettier/plugins/graphql")],
  },
};

/** Returns true if Prettier supports formatting the given language key. */
export function canFormatWithPrettier(lang: string): boolean {
  return lang.toLowerCase() in LANG_MAP;
}

// ─── Output ──────────────────────────────────────────────────────────────────

export interface PrettierOutput {
  /** Set of nodeKeys currently being formatted. Reactive via `useSignal`. */
  formatting: Signal<Set<string>>;
  /** Per-node error message from the last failed format. Reactive via `useSignal`. */
  errors: Signal<Map<string, string>>;
}

const _map = new WeakMap<LexicalEditor, PrettierOutput>();

/**
 * Retrieve the PrettierFormatterExtension's runtime output for a given editor.
 *
 * @example
 * const out = getPrettierOutput(editor.lexical);
 * const isLoading = useSignal(out!.formatting).has(nodeKey);
 * const error    = useSignal(out!.errors).get(nodeKey);
 */
export function getPrettierOutput(
  editor: LexicalEditor
): PrettierOutput | undefined {
  return _map.get(editor);
}

// ─── Config ──────────────────────────────────────────────────────────────────

export interface PrettierFormatterConfig extends TypixExtensionConfig {
  /** Prettier printer options forwarded to every `format()` call. */
  printOptions?: Record<string, unknown>;
  /** Called after formatting succeeds. */
  onFormat?: (formatted: string, nodeKey: string) => void;
  /** Called when formatting fails (e.g. syntax error). */
  onError?: (err: unknown, nodeKey: string) => void;
}

// ─── Extension ───────────────────────────────────────────────────────────────

/**
 * PrettierFormatterExtension — format Typix code blocks with Prettier.
 *
 * Install alongside `CodeBlockExtension`. Adds the `formatWithPrettier`
 * chain command. Formatting is async; loading and error state are exposed
 * as reactive signals via `getPrettierOutput(editor.lexical)`.
 *
 * ### Supported languages
 * `javascript` · `js` · `jsx` · `typescript` · `ts` · `tsx` ·
 * `css` · `scss` · `less` · `html` · `markdown` · `json` · `graphql`
 *
 * @example
 * ```ts
 * createTypix({
 *   extensions: [
 *     CodeBlockExtension(),
 *     PrettierFormatterExtension({ printOptions: { tabWidth: 2 } }),
 *   ],
 * })
 *
 * editor.chain().formatWithPrettier({ nodeKey }).run()
 * ```
 */
export const PrettierFormatterExtension = (
  userConfig: Partial<PrettierFormatterConfig> = {}
) => {
  const resolvedConfig: PrettierFormatterConfig = {
    printOptions: {},
    ...userConfig,
  };

  const lexicalExt = defineExtension({
    name: "@typix/code-block-prettier",
    config: safeCast<PrettierFormatterConfig>(resolvedConfig),

    build(editor) {
      const output: PrettierOutput = {
        formatting: signal<Set<string>>(new Set()),
        errors: signal<Map<string, string>>(new Map()),
      };
      _map.set(editor, output);
      return output;
    },

    register() {
      return () => {};
    },
  });

  return defineTypixExtension({
    name: "code-block-prettier",
    typix: lexicalExt,
    config: resolvedConfig,

    commands: {
      /**
       * Format the code block identified by `attrs.nodeKey` with Prettier.
       * Returns `true` immediately; the write-back is async.
       */
      formatWithPrettier: (config) => (ctx, attrs) => {
        const nodeKey = attrs?.nodeKey as string | undefined;
        if (!nodeKey) return false;

        const output = _map.get(ctx.editor);
        if (!output) return false;

        // Read code + language synchronously
        const snapshot = ctx.editor.getEditorState().read(() => {
          const node = $getNodeByKey(nodeKey);
          if (!$isCodeNode(node)) return null;
          return {
            code: node.getTextContent(),
            lang: (node.getLanguage() ?? "javascript").toLowerCase(),
          };
        });

        if (!snapshot) return false;

        const mapping = LANG_MAP[snapshot.lang];
        if (!mapping) {
          const errs = new Map(output.errors.value);
          errs.set(
            nodeKey,
            `No Prettier parser for language "${snapshot.lang}"`
          );
          output.errors.value = errs;
          config.onError?.(
            new Error(`No Prettier parser for "${snapshot.lang}"`),
            nodeKey
          );
          return false;
        }

        // Mark loading
        output.formatting.value = new Set([
          ...output.formatting.value,
          nodeKey,
        ]);

        // Clear stale error
        if (output.errors.value.has(nodeKey)) {
          const errs = new Map(output.errors.value);
          errs.delete(nodeKey);
          output.errors.value = errs;
        }

        void (async () => {
          try {
            const [{ format }, ...pluginModules] = await Promise.all([
              import("prettier/standalone"),
              ...mapping.load.map((fn) => fn()),
            ]);

            // Some plugins export as .default, others as the module itself
            const plugins = pluginModules.map(
              (m: unknown) => (m as Record<string, unknown>).default ?? m
            );

            const formatted = await (format as Function)(snapshot.code, {
              parser: mapping.parser,
              plugins,
              ...config.printOptions,
            });

            // Write back using the same select(0)+insertText approach
            // as the official Lexical playground PrettierButton.
            ctx.editor.update(() => {
              const node = $getNodeByKey(nodeKey);
              if (!$isCodeNode(node)) return;
              const selection = node.select(0);
              selection.insertText((formatted as string).trimEnd());
            });

            config.onFormat?.(formatted as string, nodeKey);
          } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            const errs = new Map(output.errors.value);
            errs.set(nodeKey, msg);
            output.errors.value = errs;
            config.onError?.(err, nodeKey);
          } finally {
            const next = new Set(output.formatting.value);
            next.delete(nodeKey);
            output.formatting.value = next;
          }
        })();

        return true;
      },
    },
  });
};
