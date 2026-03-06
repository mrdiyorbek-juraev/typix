import type { JSX, ReactNode } from "react"
import type {
  MentionItem,
  MentionMenuItemProps,
  MentionSearchFn,
} from "@typix-editor/extension-mention"

export interface MentionMenuProps {
  anchorElement: HTMLElement | null
  items: MentionItem[]
  selectedIndex: number | null
  onSelectItem: (index: number) => void
  onHighlightItem: (index: number) => void
  isLoading?: boolean
  query: string | null
  renderItem?: (props: MentionMenuItemProps) => ReactNode
}

export interface MentionUIProps {
  /** Function to search for mention suggestions. */
  onSearch: MentionSearchFn
  /** Callback when a mention is selected. */
  onSelect?: (item: MentionItem) => void
  /** Callback when the mention menu opens. */
  onMenuOpen?: () => void
  /** Callback when the mention menu closes. */
  onMenuClose?: () => void
  /** Trigger configuration. */
  triggerConfig?: {
    trigger?: string
    minLength?: number
    maxLength?: number
    allowSpaces?: boolean
  }
  /**
   * Whether to include the trigger character in the displayed mention text.
   * @default true (matches MentionExtension default)
   */
  includeTrigger?: boolean
  /** Maximum number of suggestions to display. @default 10 */
  maxSuggestions?: number
  /** Debounce delay in milliseconds for search requests. @default 200 */
  debounceMs?: number
  /** Custom menu renderer for complete control over the dropdown UI. */
  renderMenu?: (props: MentionMenuProps) => JSX.Element | null
  /** Custom menu item renderer. */
  renderMenuItem?: (props: MentionMenuItemProps) => ReactNode
  /** Content to show while loading results. */
  loadingContent?: ReactNode
  /** Content to show when no results are found. */
  emptyContent?: ReactNode
  /** Parent element for the menu portal. */
  menuPortalTarget?: HTMLElement | null
  /** Additional class name for the menu container. */
  menuClassName?: string
  /** Whether the extension is disabled. @default false */
  disabled?: boolean
}
