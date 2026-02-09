import {
    $createHeadingNode,
    $createParagraphNode,
    $getSelection,
    $isRangeSelection,
    $setBlocksType,
    createCommand,
} from "@typix-editor/react";
// Slash commands
export const ParagraphCommand = createCommand({
    title: "Text",
    icon: <div className="text-lg">¶</div>,
    keywords: ["text", "p", "paragraph"],
    description: "Plain text paragraph",
    onSelect: (_, editor) => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createParagraphNode());
            }
        });
    },
});

export const Heading1Command = createCommand({
    title: "Heading 1",
    icon: <div className="font-bold"> H1 </div>,
    keywords: ["heading", "header", "h1"],
    description: "Large section heading",
    onSelect: (_, editor) =>
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createHeadingNode("h1"));
            }
        }),
});

export const Heading2Command = createCommand({
    title: "Heading 2",
    icon: <div className="font-bold"> H2 </div>,
    keywords: ["heading", "header", "h2"],
    description: "Medium section heading",
    onSelect: (_, editor) =>
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createHeadingNode("h2"));
            }
        }),
});

export const Heading3Command = createCommand({
    title: "Heading 3",
    icon: <div className="font-bold"> H3 </div>,
    keywords: ["heading", "header", "h3"],
    description: "Small section heading",
    onSelect: (_, editor) =>
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createHeadingNode("h3"));
            }
        }),
});

export const slashCommands = [
    ParagraphCommand,
    Heading1Command,
    Heading2Command,
    Heading3Command,
];