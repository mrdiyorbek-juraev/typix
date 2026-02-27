import { effect, namedSignals } from "@lexical/extension";
import { registerLexicalTextEntity } from "@lexical/text";
import { defineExtension, mergeRegister, safeCast } from "lexical";
import { $createKeywordNode, KeywordNode } from "../node";

// Use Unicode property escapes (\p{L}) instead of manually listing Unicode ranges.
// The original Lexical playground regex had hand-written ranges that can break
// across different encodings ("Range out of order in character class").
export const KEYWORDS_REGEX = /(^|$|[^\p{L}])(congrats|congratulations|gratuluju|gratuluji|gratulujeme|blahopřeju|blahopřeji|blahopřejeme|Til lykke|Tillykke|Glückwunsch|Gratuliere|felicitaciones|enhorabuena|paljon onnea|onnittelut|Félicitations|gratula|gratulálok|gratulálunk|congratulazioni|complimenti|おめでとう|おめでとうございます|축하해|축하해요|gratulerer|Gefeliciteerd|gratulacje|Parabéns|parabéns|felicitações|felicitări|мои поздравления|поздравляем|поздравляю|gratulujem|blahoželám|ยินดีด้วย|ขอแสดงความยินดี|tebrikler|tebrik ederim|恭喜|祝贺你|恭喜你|恭喜|恭喜|baie geluk|veels geluk|অভিনন্দন|Čestitam|Čestitke|Čestitamo|Συγχαρητήρια|Μπράβο|અભિનંદન|badhai|बधाई|अभिनंदन|Честитам|Свака част|hongera|வாழ்த்துகள்|வாழ்த்துக்கள்|అభినందనలు|അഭിനന്ദനങ്ങൾ|Chúc mừng|מזל טוב|mazel tov|mazal tov)(^|$|[^\p{L}])/iu;

function getKeywordMatch(text: string) {
  const matchArr = KEYWORDS_REGEX.exec(text);
  if (matchArr === null) return null;

  const hashtagLength = matchArr[2].length;
  const startOffset = matchArr.index + matchArr[1].length;
  const endOffset = startOffset + hashtagLength;
  return { end: endOffset, start: startOffset };
}

export interface KeywordsConfig {
  /** Set to true to temporarily disable keyword detection. */
  disabled: boolean;
}

export const KeywordsExtension = defineExtension({
  name: "@typix/keywords",

  nodes: () => [KeywordNode],

  config: safeCast<KeywordsConfig>({ disabled: false }),

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
