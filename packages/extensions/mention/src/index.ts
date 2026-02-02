// Extension
export { MentionExtension } from "./extension";
export type { MentionExtensionProps } from "./extension";

// Node
export {
  MentionNode,
  $createMentionNode,
  $isMentionNode,
  configureMentionNode,
  resetMentionNodeConfig,
} from "./node";
export type {
  SerializedMentionNode,
  MentionNodeOptions,
  CreateMentionNodeParams,
} from "./node";

// Types
export type {
  MentionItem,
  MentionMenuItemProps,
  MentionMenuProps,
  MentionTriggerConfig,
  MentionNodeConfig,
  MentionSearchFn,
  MentionMatch,
  UseMentionSearchResult,
} from "./types";
