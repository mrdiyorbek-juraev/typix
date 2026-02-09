import type { BundledTheme, CodeOptionsThemes, HighlighterCore } from "shiki";
export type Awaitable<T> = T | PromiseLike<T>;

const defaultThemes = {
  themes: {
    light: "github-light",
    dark: "github-dark",
  },
};

export const configDefault = defineShikiConfig({
  defaultThemes,
  async createHighlighter() {
    const { createHighlighter } = await import("shiki");
    const { createJavaScriptRegexEngine } = await import(
      "shiki/engine/javascript"
    );

    return createHighlighter({
      langs: [],
      themes: [],
      engine: createJavaScriptRegexEngine(),
    });
  },
});

export interface ShikiConfig {
  createHighlighter: () => Awaitable<HighlighterCore>;
  defaultThemes: CodeOptionsThemes<BundledTheme>;
}

export interface ResolvedShikiConfig extends ShikiConfig {
  id: symbol;
}

/** define shared configurations for Shiki */
export function defineShikiConfig(config: ShikiConfig): ResolvedShikiConfig {
  let created: Awaitable<HighlighterCore> | undefined;

  return {
    id: Symbol(),
    defaultThemes: config.defaultThemes,
    createHighlighter() {
      if (created) return created;

      created = config.createHighlighter();
      if ("then" in created) {
        created = created.then((v) => (created = v));
      }
      return created;
    },
  };
}

export const shikiConfig: ResolvedShikiConfig = {
  ...configDefault,
  defaultThemes: {
    themes: {
      light: "github-light",
      dark: "vesper",
    },
  },
};
