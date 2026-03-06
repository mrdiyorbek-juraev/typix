import { signal, type Signal } from "@typix-editor/core/lexical/extension";
import { $isAtNodeEnd } from "@typix-editor/core/lexical/selection";
import {
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  defineExtension,
  safeCast,
  type LexicalEditor,
} from "lexical";
import {
  defineTypixExtension,
  type TypixExtensionConfig,
} from "@typix-editor/core";
import { MentionNode } from "../node";
import type { MentionItem, MentionSearchFn } from "../types";

// ─── Output ─────────────────────────────────────────────────────────────────

export interface MentionOutput {
  /** The current search query (text after the trigger), or null when not searching. */
  query: Signal<string | null>;
  /** Resolved suggestions for the current query. Updated asynchronously. */
  suggestions: Signal<MentionItem[]>;
}

const _outputByEditor = new WeakMap<LexicalEditor, MentionOutput>();

export function getMentionOutput(
  editor: LexicalEditor
): MentionOutput | undefined {
  return _outputByEditor.get(editor);
}

// ─── Config ──────────────────────────────────────────────────────────────────

export interface MentionConfig extends TypixExtensionConfig {
  /** Character(s) that trigger the mention menu. @default '@' */
  trigger: string;
  /** Minimum number of characters after trigger before searching. @default 0 */
  minLength: number;
  /** Maximum length of the mention query. @default 75 */
  maxLength: number;
  /** Whether to allow spaces in mention queries. @default true */
  allowSpaces: boolean;
  /** Maximum number of suggestions to display. @default 10 */
  maxSuggestions: number;
  /** Debounce delay in milliseconds for search requests. @default 200 */
  debounceMs: number;
  /** Whether to include the trigger character in the displayed mention text. @default true */
  includeTrigger: boolean;
  /** Whether the extension is disabled. @default false */
  disabled: boolean;
  /**
   * Suggestion source for the mention typeahead.
   * Can be a static array of items or an async function that receives the
   * current query string and trigger character and returns items.
   *
   * @example
   * // Static list
   * suggestions: [{ id: '1', name: 'Alice' }, { id: '2', name: 'Bob' }]
   *
   * // Dynamic async lookup
   * suggestions: async (query) => fetch(`/api/users?q=${query}`).then(r => r.json())
   */
  suggestions?: MentionItem[] | MentionSearchFn;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Extract the mention query from the current selection, or null if not in a mention. */
function getMentionQuery(
  trigger: string,
  minLength: number,
  maxLength: number,
  allowSpaces: boolean
): string | null {
  const selection = $getSelection();
  if (!$isRangeSelection(selection) || !selection.isCollapsed()) return null;

  const anchor = selection.anchor;
  const node = anchor.getNode();
  if (!$isTextNode(node) || !$isAtNodeEnd(anchor)) return null;

  const text = node.getTextContent();
  const offset = anchor.offset;

  // Walk backwards from cursor to find the trigger
  let start = offset - 1;
  while (start >= 0) {
    const ch = text[start];
    if (ch === trigger) break;
    if (!allowSpaces && ch === " ") return null;
    start--;
  }

  if (start < 0 || text[start] !== trigger) return null;

  const query = text.substring(start + trigger.length, offset);
  if (query.length < minLength || query.length > maxLength) return null;

  return query;
}

// ─── Extension ───────────────────────────────────────────────────────────────

export const MentionExtension = (userConfig: Partial<MentionConfig> = {}) => {
  const resolvedConfig: MentionConfig = {
    trigger: "@",
    minLength: 0,
    maxLength: 75,
    allowSpaces: true,
    maxSuggestions: 10,
    debounceMs: 200,
    includeTrigger: true,
    disabled: false,
    ...userConfig,
  };

  const lexicalExt = defineExtension({
    name: "@typix/mention",

    nodes: () => [MentionNode],

    config: safeCast<MentionConfig>(resolvedConfig),

    build(editor) {
      const query = signal<string | null>(null);
      const suggestions = signal<MentionItem[]>([]);
      const output: MentionOutput = { query, suggestions };
      _outputByEditor.set(editor, output);
      return output;
    },

    register(editor, _config, state) {
      const { query, suggestions } = state.getOutput();

      const {
        trigger,
        minLength,
        maxLength,
        allowSpaces,
        maxSuggestions,
        debounceMs,
      } = resolvedConfig;

      let debounceTimer: ReturnType<typeof setTimeout> | null = null;

      async function resolveSuggestions(q: string): Promise<void> {
        const src = resolvedConfig.suggestions;
        if (!src) {
          suggestions.value = [];
          return;
        }

        let items: MentionItem[];
        if (typeof src === "function") {
          items = await src(q, trigger);
        } else {
          // Static array — filter by prefix
          const lower = q.toLowerCase();
          items = src.filter((item) =>
            item.name.toLowerCase().startsWith(lower)
          );
        }

        suggestions.value = items.slice(0, maxSuggestions);
      }

      function scheduleSearch(q: string) {
        if (debounceTimer !== null) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          resolveSuggestions(q).catch((err) => {
            console.error("[MentionExtension] suggestions error:", err);
          });
        }, debounceMs);
      }

      return editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          const q = getMentionQuery(trigger, minLength, maxLength, allowSpaces);
          const prev = query.value;

          if (q !== prev) {
            query.value = q;
            if (q !== null) {
              scheduleSearch(q);
            } else {
              if (debounceTimer !== null) {
                clearTimeout(debounceTimer);
                debounceTimer = null;
              }
              suggestions.value = [];
            }
          }
        });
      });
    },
  });

  return defineTypixExtension({
    name: "mention",
    typix: lexicalExt,
    config: resolvedConfig,
  });
};
