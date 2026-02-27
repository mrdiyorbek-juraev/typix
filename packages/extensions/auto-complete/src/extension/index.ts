import { $isAtNodeEnd } from "@lexical/selection";
import { mergeRegister } from "@lexical/utils";
import type { BaseSelection, NodeKey, TextNode } from "lexical";
import {
  $addUpdateTag,
  $createTextNode,
  $getNodeByKey,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  $setSelection,
  COMMAND_PRIORITY_LOW,
  HISTORY_MERGE_TAG,
  KEY_ARROW_RIGHT_COMMAND,
  KEY_TAB_COMMAND,
  defineExtension,
  safeCast,
} from "lexical";

import DICTIONARY from "../dictionary";
import { uuid } from "../lib";
import { addSwipeRightListener } from "../lib/swipe";
import { $createAutocompleteNode, AutocompleteNode } from "../node";

export interface AutocompleteConfig {
  /** Set to true to temporarily disable autocomplete. */
  disabled: boolean;
}

const HISTORY_MERGE = { tag: HISTORY_MERGE_TAG };
const MIN_SEARCH_LENGTH = 4;
const QUERY_LATENCY_MS = 200;
const MAX_CACHE_SIZE = 100;

declare global {
  interface Navigator {
    userAgentData?: {
      mobile: boolean;
    };
  }
}

type SearchPromise = {
  dismiss: () => void;
  promise: Promise<null | string>;
};

function $search(selection: null | BaseSelection): [boolean, string] {
  if (!($isRangeSelection(selection) && selection.isCollapsed())) {
    return [false, ""];
  }
  const node = selection.getNodes()[0];

  if (!($isTextNode(node) && node.isSimpleText())) {
    return [false, ""];
  }

  const anchor = selection.anchor;

  if (!$isAtNodeEnd(anchor)) {
    return [false, ""];
  }

  const text = node.getTextContent();
  const endIndex = anchor.offset;

  let startIndex = endIndex - 1;
  while (startIndex >= 0 && text[startIndex] !== " ") {
    startIndex--;
  }

  startIndex++;

  if (startIndex >= endIndex) {
    return [false, ""];
  }

  const word = text.substring(startIndex, endIndex);
  return [true, word];
}

function formatSuggestionText(suggestion: string): string {
  const userAgentData = window.navigator.userAgentData;
  const isMobile =
    userAgentData !== undefined
      ? userAgentData.mobile
      : window.innerWidth <= 800 && window.innerHeight <= 600;

  return `${suggestion} ${isMobile ? "(SWIPE \u2B95)" : "(TAB)"}`;
}

class AutocompleteServer {
  DATABASE = DICTIONARY;
  LATENCY = QUERY_LATENCY_MS;
  private cache = new Map<string, string | null>();

  query = (searchText: string): SearchPromise => {
    if (this.cache.has(searchText)) {
      const cached = this.cache.get(searchText)!;
      return {
        dismiss: () => {},
        promise: Promise.resolve(cached),
      };
    }

    let isDismissed = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const dismiss = () => {
      isDismissed = true;
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };

    const promise: Promise<null | string> = new Promise((resolve, reject) => {
      timeoutId = setTimeout(() => {
        if (isDismissed) {
          return reject("Dismissed");
        }

        const result = this.performSearch(searchText);
        this.addToCache(searchText, result);
        resolve(result);
      }, this.LATENCY);
    });

    return { dismiss, promise };
  };

  private performSearch(searchText: string): string | null {
    const searchTextLength = searchText.length;

    if (searchText === "" || searchTextLength < MIN_SEARCH_LENGTH) {
      return null;
    }

    const char0 = searchText.charCodeAt(0);
    const isCapitalized = char0 >= 65 && char0 <= 90;
    const caseInsensitiveSearchText = isCapitalized
      ? String.fromCharCode(char0 + 32) + searchText.substring(1)
      : searchText;

    const match = this.DATABASE.find((dictionaryWord) =>
      dictionaryWord.startsWith(caseInsensitiveSearchText)
    );

    if (match === undefined) {
      return null;
    }

    const matchCapitalized = isCapitalized
      ? String.fromCharCode(match.charCodeAt(0) - 32) + match.substring(1)
      : match;

    const autocompleteChunk = matchCapitalized.substring(searchTextLength);
    return autocompleteChunk === "" ? null : autocompleteChunk;
  }

  private addToCache(key: string, value: string | null) {
    if (this.cache.size >= MAX_CACHE_SIZE) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey!);
    }
    this.cache.set(key, value);
  }
}

export const AutocompleteExtension = defineExtension({
  name: "@typix/auto-complete",

  nodes: () => [AutocompleteNode],

  config: safeCast<AutocompleteConfig>({ disabled: false }),

  register(editor) {
    const server = new AutocompleteServer();

    let autocompleteNodeKey: null | NodeKey = null;
    let lastMatch: null | string = null;
    let lastSuggestion: null | string = null;
    let searchPromise: null | SearchPromise = null;
    let prevNodeFormat = 0;

    function $clearSuggestion() {
      const autocompleteNode =
        autocompleteNodeKey !== null
          ? $getNodeByKey(autocompleteNodeKey)
          : null;
      if (autocompleteNode !== null && autocompleteNode.isAttached()) {
        autocompleteNode.remove();
        autocompleteNodeKey = null;
      }
      if (searchPromise !== null) {
        searchPromise.dismiss();
        searchPromise = null;
      }
      lastMatch = null;
      lastSuggestion = null;
      prevNodeFormat = 0;
    }

    function updateAsyncSuggestion(
      refSearchPromise: SearchPromise,
      newSuggestion: null | string
    ) {
      if (searchPromise !== refSearchPromise || newSuggestion === null) {
        return;
      }
      editor.update(() => {
        const selection = $getSelection();
        const [hasMatch, match] = $search(selection);
        if (!hasMatch || match !== lastMatch || !$isRangeSelection(selection)) {
          return;
        }
        const selectionCopy = selection.clone();
        const prevNode = selection.getNodes()[0] as TextNode;
        prevNodeFormat = prevNode.getFormat();
        const node = $createAutocompleteNode(
          formatSuggestionText(newSuggestion),
          uuid
        )
          .setFormat(prevNodeFormat)
          .setStyle(`font-size: ${14}px`);
        autocompleteNodeKey = node.getKey();
        selection.insertNodes([node]);
        $setSelection(selectionCopy);
        lastSuggestion = newSuggestion;
      }, HISTORY_MERGE);
    }

    function $handleAutocompleteNodeTransform(node: AutocompleteNode) {
      const key = node.getKey();
      if (node.__uuid === uuid && key !== autocompleteNodeKey) {
        $clearSuggestion();
      }
    }

    function handleUpdate() {
      editor.update(() => {
        const selection = $getSelection();
        const [hasMatch, match] = $search(selection);

        if (!hasMatch) {
          $clearSuggestion();
          return;
        }

        if (match === lastMatch) {
          return;
        }
        $clearSuggestion();

        searchPromise = server.query(match);

        searchPromise.promise
          .then((newSuggestion) => {
            if (searchPromise !== null) {
              updateAsyncSuggestion(searchPromise, newSuggestion);
            }
          })
          .catch((e) => {
            if (e !== "Dismissed") {
              console.error("[AutocompleteExtension] Query failed:", e);
            }
          });
        lastMatch = match;
      }, HISTORY_MERGE);
    }

    function $handleAutocompleteIntent(): boolean {
      if (lastSuggestion === null || autocompleteNodeKey === null) {
        return false;
      }
      const autocompleteNode = $getNodeByKey(autocompleteNodeKey);
      if (autocompleteNode === null) {
        return false;
      }

      const textNode = $createTextNode(lastSuggestion).setStyle(
        `font-size: ${14}`
      );
      autocompleteNode.replace(textNode);
      textNode.selectNext();
      $clearSuggestion();
      return true;
    }

    function $handleKeypressCommand(e: Event) {
      if ($handleAutocompleteIntent()) {
        e.preventDefault();
        return true;
      }
      return false;
    }

    function handleSwipeRight(_force: number, e: TouchEvent) {
      editor.update(() => {
        if ($handleAutocompleteIntent()) {
          e.preventDefault();
        } else {
          $addUpdateTag(HISTORY_MERGE.tag);
        }
      });
    }

    function unmountSuggestion() {
      editor.update(() => {
        $clearSuggestion();
      }, HISTORY_MERGE);
    }

    const rootElem = editor.getRootElement();

    return mergeRegister(
      editor.registerNodeTransform(
        AutocompleteNode,
        $handleAutocompleteNodeTransform
      ),
      editor.registerUpdateListener(handleUpdate),
      editor.registerCommand(
        KEY_TAB_COMMAND,
        $handleKeypressCommand,
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_ARROW_RIGHT_COMMAND,
        $handleKeypressCommand,
        COMMAND_PRIORITY_LOW
      ),
      ...(rootElem !== null
        ? [addSwipeRightListener(rootElem, handleSwipeRight)]
        : []),
      unmountSuggestion
    );
  },
});
