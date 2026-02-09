"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSpeechToText } from "@typix-editor/extension-speech-to-text";
import {
    sanitizeUrl,
    useActiveFormats,
    useTypixEditor,
} from "@typix-editor/react";
import {
    Undo2,
    Redo2,
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Code,
    Subscript,
    Superscript,
    Highlighter,
    Quote,
    List,
    ListOrdered,
    CheckSquare,
    Minus,
    Plus,
    Mic,
    MicOff,
    Type,
    Heading1,
    Heading2,
    Heading3,
} from "lucide-react";

const ToolbarDivider = () => <div className="mx-1.5 h-5 w-px bg-border/60" />;

type ToolbarButtonProps = {
    onClick: () => void;
    active?: boolean;
    title: string;
    children: React.ReactNode;
    size?: "sm" | "md";
};

const ToolbarButton = ({
    onClick,
    active,
    title,
    children,
    size = "sm",
}: ToolbarButtonProps) => {
    return (
        <Button
            variant="ghost"
            size="icon"
            className={cn(
                "h-8 w-8 rounded-md transition-all hover:bg-accent",
                size === "sm" && "h-7 w-7",
                active && "bg-primary/10 text-primary hover:bg-primary/20"
            )}
            onClick={onClick}
            title={title}
            type="button"
        >
            {children}
        </Button>
    );
};

export function Toolbar() {
    const editor = useTypixEditor();
    const { isActive } = useActiveFormats();
    const { isListening, isSupported, toggle } = useSpeechToText();

    return (
        <div className="flex items-center gap-1 rounded-lg border bg-card/50 backdrop-blur-sm px-3 py-2 shadow-sm overflow-x-auto mb-4">
            {/* History */}
            <div className="flex items-center gap-0.5">
                <ToolbarButton onClick={() => editor.undo()} title="Undo (Ctrl+Z)">
                    <Undo2 className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.redo()} title="Redo (Ctrl+Y)">
                    <Redo2 className="h-4 w-4" />
                </ToolbarButton>
            </div>

            <ToolbarDivider />

            {/* Text Formatting */}
            <div className="flex items-center gap-0.5">
                <ToolbarButton
                    active={isActive("bold")}
                    onClick={() => editor.toggleBold()}
                    title="Bold (Ctrl+B)"
                >
                    <Bold className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    active={isActive("italic")}
                    onClick={() => editor.toggleItalic()}
                    title="Italic (Ctrl+I)"
                >
                    <Italic className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    active={isActive("underline")}
                    onClick={() => editor.toggleUnderline()}
                    title="Underline (Ctrl+U)"
                >
                    <Underline className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    active={isActive("strikethrough")}
                    onClick={() => editor.toggleStrikethrough()}
                    title="Strikethrough"
                >
                    <Strikethrough className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    active={isActive("code")}
                    onClick={() => editor.toggleCode()}
                    title="Inline Code"
                >
                    <Code className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    active={isActive("highlight")}
                    onClick={() => editor.toggleHighlight()}
                    title="Highlight"
                >
                    <Highlighter className="h-4 w-4" />
                </ToolbarButton>
            </div>

            <ToolbarDivider />

            {/* Headings */}
            <div className="flex items-center gap-0.5">
                <ToolbarButton
                    active={editor.isBlockActive("paragraph")}
                    onClick={() => editor.setParagraph()}
                    title="Paragraph"
                >
                    <Type className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    active={editor.isBlockActive("h1")}
                    onClick={() => editor.toggleHeading({ level: 1 })}
                    title="Heading 1"
                >
                    <Heading1 className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    active={editor.isBlockActive("h2")}
                    onClick={() => editor.toggleHeading({ level: 2 })}
                    title="Heading 2"
                >
                    <Heading2 className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    active={editor.isBlockActive("h3")}
                    onClick={() => editor.toggleHeading({ level: 3 })}
                    title="Heading 3"
                >
                    <Heading3 className="h-4 w-4" />
                </ToolbarButton>
            </div>

            <ToolbarDivider />

            {/* Lists & Blocks */}
            <div className="flex items-center gap-0.5">
                <ToolbarButton
                    active={editor.isBlockActive("bullet")}
                    onClick={() => editor.toggleBulletList()}
                    title="Bullet List"
                >
                    <List className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    active={editor.isBlockActive("number")}
                    onClick={() => editor.toggleOrderedList()}
                    title="Numbered List"
                >
                    <ListOrdered className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    active={editor.isBlockActive("check")}
                    onClick={() => editor.toggleCheckList()}
                    title="Checklist"
                >
                    <CheckSquare className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    active={editor.isBlockActive("quote")}
                    onClick={() => editor.toggleQuote()}
                    title="Quote"
                >
                    <Quote className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    active={editor.isBlockActive("code")}
                    onClick={() => editor.toggleCodeBlock()}
                    title="Code Block"
                >
                    <Code className="h-4 w-4" />
                </ToolbarButton>
            </div>

            <ToolbarDivider />

            {/* Font Size */}
            <div className="flex items-center gap-1">
                <ToolbarButton
                    onClick={() => editor.decrementFontSize(2)}
                    title="Decrease Font Size"
                >
                    <Minus className="h-3.5 w-3.5" />
                </ToolbarButton>
                <span className="min-w-[40px] text-center font-mono text-xs text-muted-foreground">
                    {editor.getFontSize()}px
                </span>
                <ToolbarButton
                    onClick={() => editor.incrementFontSize(2)}
                    title="Increase Font Size"
                >
                    <Plus className="h-3.5 w-3.5" />
                </ToolbarButton>
            </div>

            {isSupported && (
                <>
                    <ToolbarDivider />
                    <button
                        className={cn(
                            "rounded-md px-3 py-1.5 font-medium text-xs transition-all flex items-center gap-1.5",
                            "hover:opacity-80 active:scale-95",
                            isListening
                                ? "bg-red-500 text-white"
                                : "bg-muted hover:bg-muted/80"
                        )}
                        onClick={toggle}
                        title={isListening ? "Stop listening" : "Start speech-to-text"}
                        type="button"
                    >
                        {isListening ? (
                            <MicOff className="h-3.5 w-3.5" />
                        ) : (
                            <Mic className="h-3.5 w-3.5" />
                        )}
                        <span>{isListening ? "Stop" : "Mic"}</span>
                    </button>
                </>
            )}

            <ToolbarDivider />

            {/* Status */}
            <div className="ml-auto flex items-center gap-3 text-xs text-muted-foreground">
                <span className="hidden sm:inline">
                    {editor.getBlockType() || "none"}
                </span>
                <span
                    className={cn(
                        "hidden sm:inline px-1.5 py-0.5 rounded text-[10px] font-medium",
                        editor.isEditable()
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    )}
                >
                    {editor.isEditable() ? "Editable" : "Read-only"}
                </span>
            </div>
        </div>
    );
}