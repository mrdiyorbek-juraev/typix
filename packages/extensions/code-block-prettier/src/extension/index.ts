import { signal, type Signal } from "@typix-editor/core/lexical/extension";
import { $isCodeNode } from "@typix-editor/core/lexical/code";
import {
  $getNodeByKey,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  defineExtension,
  safeCast,
  type LexicalEditor,
} from "lexical";
import {
  registerTypixMeta,
  registerExtensionOutput,
} from "@typix-editor/core";

// ─── Parser map (Prettier v3 plugin paths) ───────────────────────────────────

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
  formatting: Signal<Set<string>>;
  errors: Signal<Map<string, string>>;
}

// ─── Config ──────────────────────────────────────────────────────────────────

export interface PrettierFormatterConfig {
  printOptions?: Record<string, unknown>;
  onFormat?: (formatted: string, nodeKey: string) => void;
  onError?: (err: unknown, nodeKey: string) => void;
}

// ─── Commands ────────────────────────────────────────────────────────────────

export const TYPIX_FORMAT_WITH_PRETTIER = createCommand<{ nodeKey: string }>(
  "TYPIX_FORMAT_WITH_PRETTIER"
);

// ─── Extension ───────────────────────────────────────────────────────────────

export const PrettierFormatterExtension = defineExtension({
  name: "@typix/code-block-prettier",

  config: safeCast<PrettierFormatterConfig>({
    printOptions: {},
  }),

  mergeConfig(
    a: PrettierFormatterConfig,
    b: Partial<PrettierFormatterConfig>
  ): PrettierFormatterConfig {
    return { ...a, ...b };
  },

  build(editor: LexicalEditor) {
    const output: PrettierOutput = {
      formatting: signal<Set<string>>(new Set()),
      errors: signal<Map<string, string>>(new Map()),
    };
    registerExtensionOutput(editor, PrettierFormatterExtension, output);
    return output;
  },

  register(editor: LexicalEditor, _config: PrettierFormatterConfig, state: any) {
    const output = state.getOutput() as PrettierOutput;

    return editor.registerCommand(
      TYPIX_FORMAT_WITH_PRETTIER,
      ({ nodeKey }) => {
        if (!output) return false;

        const snapshot = editor.getEditorState().read(() => {
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
          _config.onError?.(
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

            const plugins = pluginModules.map(
              (m: unknown) => (m as Record<string, unknown>).default ?? m
            );

            const formatted = await (format as Function)(snapshot.code, {
              parser: mapping.parser,
              plugins,
              ..._config.printOptions,
            });

            editor.update(() => {
              const node = $getNodeByKey(nodeKey);
              if (!$isCodeNode(node)) return;
              const selection = node.select(0);
              selection.insertText((formatted as string).trimEnd());
            });

            _config.onFormat?.(formatted as string, nodeKey);
          } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            const errs = new Map(output.errors.value);
            errs.set(nodeKey, msg);
            output.errors.value = errs;
            _config.onError?.(err, nodeKey);
          } finally {
            const next = new Set(output.formatting.value);
            next.delete(nodeKey);
            output.formatting.value = next;
          }
        })();

        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  },
});

registerTypixMeta(PrettierFormatterExtension, {
  commands: {
    formatWithPrettier: TYPIX_FORMAT_WITH_PRETTIER,
  },
});



declare module "@typix-editor/core" {
  interface TypixCommands<R> {
    formatWithPrettier(attrs: { nodeKey: string }): R;
  }
}
