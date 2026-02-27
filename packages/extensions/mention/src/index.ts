export { MentionExtension, type MentionConfig } from "./extension";
export type {
  CreateMentionNodeParams,
  MentionNodeOptions,
  SerializedMentionNode,
} from "./node";
export {
  $createMentionNode,
  $isMentionNode,
  configureMentionNode,
  MentionNode,
  resetMentionNodeConfig,
} from "./node";

export type {
  MentionItem,
  MentionMatch,
  MentionMenuItemProps,
  MentionNodeConfig,
  MentionSearchFn,
  MentionTriggerConfig,
  UseMentionSearchResult,
} from "./types";

export { checkForMentionMatch, buildMentionRegex } from "./lib";
