// Extension

export type { MentionExtensionProps } from "./extension";
export { MentionExtension } from "./extension";
export type {
  CreateMentionNodeParams,
  MentionNodeOptions,
  SerializedMentionNode,
} from "./node";
// Node
export {
  $createMentionNode,
  $isMentionNode,
  configureMentionNode,
  MentionNode,
  resetMentionNodeConfig,
} from "./node";

// Types
export type {
  MentionItem,
  MentionMatch,
  MentionMenuItemProps,
  MentionMenuProps,
  MentionNodeConfig,
  MentionSearchFn,
  MentionTriggerConfig,
  UseMentionSearchResult,
} from "./types";
