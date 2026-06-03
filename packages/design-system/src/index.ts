// Utilities
export { cn } from "./lib/utils";
export { composeRefs } from "./lib/compose-refs";
export { useControllableState } from "./lib/use-controllable-state";

// Primitives
export { Avatar, AvatarImage, AvatarFallback } from "./primitives/avatar";
export { Button, buttonVariants, type ButtonProps } from "./primitives/button";
export { Kbd } from "./primitives/kbd";
export { Badge, badgeVariants, type BadgeProps } from "./primitives/badge";
export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "./primitives/tooltip";
export { Switch } from "./primitives/switch";
export { Checkbox } from "./primitives/checkbox";
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from "./primitives/dropdown-menu";
export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
} from "./primitives/popover";
export {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from "./primitives/command";
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "./primitives/card";
export { Textarea } from "./primitives/textarea";
export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
} from "./primitives/context-menu";
export { Calendar, type CalendarProps } from "./primitives/calendar";
export { Input, type InputProps } from "./primitives/input";
export { Label } from "./primitives/label";
export { Separator } from "./primitives/separator";
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from "./primitives/select";
export { Tabs, TabsList, TabsTrigger, TabsContent } from "./primitives/tabs";
export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./primitives/dialog";
export { ScrollArea, ScrollBar } from "./primitives/scroll-area";
export { Toggle, toggleVariants } from "./primitives/toggle";
export { ToggleGroup, ToggleGroupItem } from "./primitives/toggle-group";
export { Skeleton } from "./primitives/skeleton";
export { RadioGroup, RadioGroupItem } from "./primitives/radio-group";
export { Slider } from "./primitives/slider";
export {
  ColorSelector,
  type ColorSelectorProps,
} from "./primitives/color-selector";
export {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
  ToolbarSpacer,
  ToolbarButton,
  ToolbarToggleGroup,
  ToolbarToggleItem,
  ToolbarLink,
  toolbarVariants,
} from "./primitives/toolbar";

// Main editor components
export {
  ImageComponent,
  imageRenderer,
  ImageResizer,
  ImageToolbar,
  ImageToolbarButton,
  ImageCaption,
  ImageContextMenu,
  ImageAlignmentPopover,
} from "./main/image";
export type {
  ImageAlignment,
  ImageFeatureFlags,
  ImageComponentProps,
  ImageResizerProps,
  ImageToolbarProps,
  ImageToolbarButtonProps,
  ImageCaptionProps,
  ImageAlignmentPopoverProps,
  ImageContextMenuProps,
} from "./main/image";

export {
  CharacterLimit,
  CharacterLimitCounter,
  useCharacterCount,
} from "./main/character-limit";
export type {
  CharacterLimitProps,
  CharacterLimitCounterProps,
  CharacterLimitCharset,
  CharacterCountStats,
  UseCharacterCountOptions,
} from "./main/character-limit";

export {
  EditorContextMenu,
  EditorContextMenu as ContextMenuUI,
} from "./main/context-menu";
export type {
  EditorContextMenuProps,
  EditorContextMenuItem,
} from "./main/context-menu";

export { CodeBlockUI } from "./main/code-block";
export type { CodeBlockUIProps } from "./main/code-block";

export { TableUI, TableCellResizer } from "./main/table";
export type { TableHoverInfo } from "./main/table";

export {
  DraggableBlock,
  DraggableBlock as DraggableBlockUI,
} from "./main/draggable-block";
export type { DraggableBlockProps } from "./main/draggable-block";

export { FloatingLinkUI, DefaultFloatingLinkUI } from "./main/floating-link";
export type {
  FloatingLinkUIProps,
  FloatingLinkRenderProps,
} from "./main/floating-link";

export { MentionUI, MentionDefaultMenuItem } from "./main/mention";
export type { MentionUIProps, MentionMenuProps } from "./main/mention";

export { useSpeechToText, SpeechToTextButton } from "./main/speech-to-text";
export type {
  UseSpeechToTextOptions,
  UseSpeechToTextReturn,
  SpeechToTextButtonProps,
} from "./main/speech-to-text";

export { useBlockquote, BlockquoteButton } from "./main/blockquote-button";
export type {
  UseBlockquoteOptions,
  UseBlockquoteReturn,
  BlockquoteButtonProps,
} from "./main/blockquote-button";

export { useCodeBlock, CodeBlockButton } from "./main/code-block-button";
export type {
  UseCodeBlockOptions,
  UseCodeBlockReturn,
  CodeBlockButtonProps,
} from "./main/code-block-button";

export {
  useColorHighlight,
  HIGHLIGHT_COLORS,
  HIGHLIGHT_COLOR_VALUES,
  ColorHighlightButton,
} from "./main/color-highlight-button";
export type {
  HighlightColorKey,
  UseColorHighlightOptions,
  UseColorHighlightReturn,
  ColorHighlightButtonProps,
} from "./main/color-highlight-button";

export {
  useColorText,
  TEXT_COLORS as TEXT_COLORS_TEXT,
  TEXT_COLOR_VALUES,
  ColorTextButton,
} from "./main/color-text-button";
export type {
  TextColorKey,
  UseColorTextOptions,
  UseColorTextReturn,
  ColorTextButtonProps,
} from "./main/color-text-button";

export { SlashDropdownMenu, useSlashDropdownMenu } from "./main/slash-command";
export type {
  SlashDropdownMenuProps,
  SlashMenuConfig,
  SlashMenuItem,
  SlashMenuItemType,
  UseSlashDropdownMenuReturn,
} from "./main/slash-command";

export {
  useMark,
  isMarkActive,
  canToggleMark,
  toggleMark,
  MarkButton,
} from "./main/mark-button";
export type {
  MarkType,
  UseMarkOptions,
  UseMarkReturn,
  MarkButtonProps,
} from "./main/mark-button";

export {
  useList,
  isListActive,
  canToggleList,
  toggleList,
  ListButton,
} from "./main/list-button";
export type {
  ListType,
  UseListOptions,
  UseListReturn,
  ListButtonProps,
} from "./main/list-button";

export {
  useListDropdownMenu,
  isAnyListActive,
  canToggleAnyList,
  getActiveListType,
  ListDropdownMenu,
} from "./main/list-dropdown-menu";
export type {
  UseListDropdownMenuOptions,
  UseListDropdownMenuReturn,
  ListItemConfig,
  ListDropdownMenuProps,
} from "./main/list-dropdown-menu";

export {
  useTextAlign,
  canSetTextAlign,
  setTextAlign,
  TextAlignButton,
} from "./main/text-align-button";
export type {
  TextAlign,
  UseTextAlignOptions,
  UseTextAlignReturn,
  TextAlignButtonProps,
} from "./main/text-align-button";

export {
  useHeading,
  isHeadingActive,
  canToggleHeading,
  toggleHeading,
  HeadingButton,
} from "./main/heading-button";
export type {
  HeadingLevel,
  UseHeadingOptions,
  UseHeadingReturn,
  HeadingButtonProps,
} from "./main/heading-button";

export {
  useFontFamilyDropdownMenu,
  FontFamilyDropdownMenu,
} from "./main/font-family-dropdown-menu";
export type {
  FontFamilyItem,
  UseFontFamilyDropdownMenuOptions,
  UseFontFamilyDropdownMenuReturn,
  FontFamilyDropdownMenuProps,
} from "./main/font-family-dropdown-menu";

export {
  useUndoRedo,
  canExecuteUndoRedo,
  executeUndoRedo,
  UndoRedoButton,
} from "./main/undo-redo-button";
export type {
  UndoRedoAction,
  UseUndoRedoOptions,
  UseUndoRedoReturn,
  UndoRedoButtonProps,
} from "./main/undo-redo-button";

export {
  useFontSize,
  getFontSize,
  setFontSize,
  increaseFontSize,
  decreaseFontSize,
  FontSizeInput,
} from "./main/font-size-input";
export type {
  UseFontSizeOptions,
  UseFontSizeReturn,
  FontSizeInputProps,
} from "./main/font-size-input";

export {
  useClearFormatting,
  ClearFormattingButton,
} from "./main/clear-formatting-button";
export type {
  UseClearFormattingOptions,
  UseClearFormattingReturn,
  ClearFormattingButtonProps,
} from "./main/clear-formatting-button";
