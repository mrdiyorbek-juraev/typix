import { effect, namedSignals } from "@typix-editor/core/lexical/extension";
import { $getRoot, defineExtension, safeCast } from "lexical";
import {
  defineTypixExtension,
  type TypixExtensionConfig,
} from "@typix-editor/core";

export interface CharacterLimitConfig extends TypixExtensionConfig {
  /** Maximum number of characters allowed. */
  maxLength: number;
  /**
   * Charset used for counting.
   * UTF-16 counts each JS character as 1 (like `string.length`).
   * UTF-8 counts actual byte size (multi-byte for non-ASCII).
   * @default "UTF-16"
   */
  charset: "UTF-8" | "UTF-16";
  /** Set to true to temporarily disable the character limit behavior. */
  disabled: boolean;
  /**
   * Called whenever the character count changes.
   * Receives the current count and the configured maximum.
   */
  onChange?: (count: number, max: number) => void;
}

function countUtf8Bytes(str: string): number {
  let bytes = 0;
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (code < 0x80) bytes += 1;
    else if (code < 0x800) bytes += 2;
    else if (code < 0xd800 || code >= 0xe000) bytes += 3;
    else {
      // Surrogate pair → one code point → 4 bytes
      i++;
      bytes += 4;
    }
  }
  return bytes;
}

export const CharacterLimitExtension = (
  userConfig: Partial<CharacterLimitConfig> = {}
) => {
  const resolvedConfig: CharacterLimitConfig = {
    maxLength: 280,
    charset: "UTF-16",
    disabled: false,
    ...userConfig,
  };

  const lexicalExt = defineExtension({
    name: "@typix/character-limit",

    config: safeCast<CharacterLimitConfig>(resolvedConfig),

    build(_editor, config) {
      return namedSignals(config);
    },

    register(editor, _config, state) {
      const { disabled, maxLength, charset } = state.getOutput();

      return effect(() => {
        if (disabled.value) return;

        const max = maxLength.value;
        const encoding = charset.value;
        const onChange = resolvedConfig.onChange;

        return editor.registerUpdateListener(({ editorState }) => {
          editorState.read(() => {
            const text = $getRoot().getTextContent();
            const count =
              encoding === "UTF-8" ? countUtf8Bytes(text) : text.length;
            onChange?.(count, max);
          });
        });
      });
    },
  });

  return defineTypixExtension({
    name: "character-limit",
    typix: lexicalExt,
    config: resolvedConfig,
  });
};
