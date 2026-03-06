import { effect, namedSignals } from "@typix-editor/core/lexical/extension";
import { registerLexicalTextEntity } from "@typix-editor/core/lexical/text";
import { defineExtension, mergeRegister, safeCast } from "lexical";
import {
  defineTypixExtension,
  type TypixExtensionConfig,
} from "@typix-editor/core";
import { $createKeywordNode, KeywordNode } from "../node";

// Use Unicode property escapes (\p{L}) instead of manually listing Unicode ranges.
// The original Lexical playground regex had hand-written ranges that can break
// across different encodings ("Range out of order in character class").
export const KEYWORDS_REGEX =
  /(^|$|[^\p{L}])(congrats|congratulations|gratuluju|gratuluji|gratulujeme|blahopřeju|blahopřeji|blahopřejeme|Til lykke|Tillykke|Glückwunsch|Gratuliere|felicitaciones|enhorabuena|paljon onnea|onnittelut|Félicitations|gratula|gratulálok|gratulálunk|congratulazioni|complimenti|おめでとう|おめでとうございます|축하해|축하해요|gratulerer|Gefeliciteerd|gratulacje|Parabéns|parabéns|felicitações|felicitări|мои поздравления|поздравляем|поздравляю|gratulujem|blahoželám|ยินดีด้วย|ขอแสดงความยินดี|tebrikler|tebrik ederim|恭喜|祝贺你|恭喜你|恭喜|恭喜|baie geluk|veels geluk|অভিনন্দন|Čestitam|Čestitke|Čestitamo|Συγχαρητήρια|Μπράβο|અભિનંદન|badhai|बधाई|अभिनंदन|Честитам|Свака част|hongera|வாழ்த்துகள்|வாழ்த்துக்கள்|అభినందనలు|അഭിനന്ദനങ്ങൾ|Chúc mừng|מזל טוב|mazel tov|mazal tov)(^|$|[^\p{L}])/iu;

function buildKeywordRegex(keywords: string[], caseSensitive: boolean): RegExp {
  // Escape special regex characters in each keyword
  const escaped = keywords.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const flags = caseSensitive ? "u" : "iu";
  return new RegExp(
    `(^|$|[^\\p{L}])(${escaped.join("|")})(^|$|[^\\p{L}])`,
    flags
  );
}

function makeGetKeywordMatch(regex: RegExp) {
  return function getKeywordMatch(text: string) {
    const matchArr = regex.exec(text);
    if (matchArr === null) return null;

    const hashtagLength = matchArr[2].length;
    const startOffset = matchArr.index + matchArr[1].length;
    const endOffset = startOffset + hashtagLength;
    return { end: endOffset, start: startOffset };
  };
}

export interface KeywordsConfig extends TypixExtensionConfig {
  /** Set to true to temporarily disable keyword detection. */
  disabled: boolean;
  /**
   * Custom list of keywords to highlight.
   * When provided, the built-in congratulatory word list is replaced entirely.
   */
  keywords?: string[];
  /**
   * When `true`, keyword matching is case-sensitive.
   * Only applies when a custom `keywords` list is provided.
   * @default false
   */
  caseSensitive?: boolean;
}

export const KeywordsExtension = (userConfig: Partial<KeywordsConfig> = {}) => {
  const resolvedConfig: KeywordsConfig = {
    disabled: false,
    caseSensitive: false,
    ...userConfig,
  };

  // Build the regex once at extension creation time
  const activeRegex =
    resolvedConfig.keywords && resolvedConfig.keywords.length > 0
      ? buildKeywordRegex(
          resolvedConfig.keywords,
          resolvedConfig.caseSensitive ?? false
        )
      : KEYWORDS_REGEX;

  const getKeywordMatch = makeGetKeywordMatch(activeRegex);

  const lexicalExt = defineExtension({
    name: "@typix/keywords",

    nodes: () => [KeywordNode],

    config: safeCast<KeywordsConfig>(resolvedConfig),

    build(_editor, config) {
      return namedSignals(config);
    },

    register(editor, _config, state) {
      const { disabled } = state.getOutput();

      return effect(() => {
        if (disabled.value) return;

        return mergeRegister(
          ...registerLexicalTextEntity(
            editor,
            getKeywordMatch,
            KeywordNode,
            (textNode) => $createKeywordNode(textNode.getTextContent())
          )
        );
      });
    },
  });

  return defineTypixExtension({
    name: "keywords",
    typix: lexicalExt,
    config: resolvedConfig,
  });
};
