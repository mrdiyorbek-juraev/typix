import { useEditor } from './hooks/useEditor'
import { useMouseListener } from "./hooks/useMouseListener"
import { useRange } from './hooks/useRange';
import { defaultTheme } from "./theme";


export {
    defaultTheme,
}

export {
    useEditor,
    useMouseListener,
    useRange,
}


export {
    createCommand,
    createEditorConfig,
    type CommandConfig,
    type CreateEditorConfigOptions,
} from "./config";

export {
    EditorCommandProvider,
    useEditorCommand,
    type EditorCommandContextValue,
} from "./context";

export {
    EditorBubbleMenu,
    type EditorBubbleMenuProps,
    EditorBubbleItem,
    type EditorBubbleItemProps,

    EditorCommand,
    type EditorCommandProps,

    EditorCommandList,
    type EditorCommandListProps,

    // Command Empty
    EditorCommandEmpty,
    type EditorCommandEmptyProps,


    EditorCommandItem,
    type EditorCommandItemBaseProps,
    type EditorCommandItemRenderProps,

    EditorContent,
    type EditorContentProps,

    EditorRoot,
    type EditorRootProps,
} from "./core";



export {
    // LEXICAL COMMANDS
    FORMAT_TEXT_COMMAND,


    // LEXICAL DEFAULT NODES
    HeadingNode,
    ParagraphNode,
    TextNode,
    QuoteNode,
    ListNode,
    ListItemNode,
    LinkNode,
    OverflowNode,
    HashtagNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    CodeNode,
    CodeHighlightNode,
    AutoLinkNode,

    // LEXICAL UTILS
    $createParagraphNode,
    $getSelection,
    $isRangeSelection,
    $setBlocksType,
    $createHeadingNode,
} from "./lib/editor"


// LEXICAL CORE TYPES
export type {
    Klass,
    LexicalNode,
    LexicalNodeReplacement,
} from "./lib/editor";


export {
    cn,
    findFirstFocusableDescendant,
    focusNearestDescendant,
    isKeyboardInput
} from "./utils";

export { defaultExtensionNodes } from "./shared";

