import type { Signal } from "@typix-editor/core/lexical/extension";

export interface SlashCommandConfig {
  /** Trigger character(s) that activate slash command mode. @default '/' */
  trigger: string;
  /** Whether the extension is disabled. @default false */
  disabled: boolean;
}

export interface SlashCommandOutput {
  /** True when the cursor is in slash-command mode (after trigger, start of block). */
  isActive: Signal<boolean>;
  /** The current search query (text after trigger), or null when not active. */
  query: Signal<string | null>;
}
