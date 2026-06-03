"use client";

/**
 * ExamplePreview — shared wrapper for every example on /examples and in docs.
 *
 * Each preview file boils down to ~10 lines:
 *
 *   export default function MyExample() {
 *     return (
 *       <ExamplePreview
 *         namespace="example-my-feature"
 *         extensions={[StarterKit(), MyExtension]}
 *         placeholder="Try it..."
 *         overlays={<MyExtensionUI />}
 *       />
 *     );
 *   }
 *
 * Toolbar uses shipped @typix-editor/ui components — same surface the
 * playground uses. No hand-rolled toggle handlers per example.
 *
 * Height behavior:
 *   - Default: `min-h-[280px]` for safe inline embedding (docs MDX where the
 *     parent has no defined height).
 *   - `stretch={true}`: editor + contentEditable fill the parent's full
 *     height. Use in fixed-height containers like the featured-card right
 *     column.
 */

import type { ReactNode } from "react";
import type { SerializedContent } from "@typix-editor/core";
import {
  EditorContent,
  TypixEditorContext,
  type UseTypixEditorOptions,
  defaultTheme,
  useTypixEditor,
} from "@typix-editor/react";
import {
  BlockquoteButton,
  CodeBlockButton,
  EditorContextMenu,
  type EditorContextMenuItem,
  HeadingButton,
  ListDropdownMenu,
  MarkButton,
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
  UndoRedoButton,
} from "@typix-editor/ui";
import { cn } from "@/lib/cn";

// Derive the extensions type from useTypixEditor's own options, so we never
// import directly from lexical (consumers should only need @typix-editor/*).
type ExtensionsList = UseTypixEditorOptions["extensions"];

export type ToolbarPreset = "none" | "minimal" | "full";

export interface ExamplePreviewProps {
  /** Unique namespace — keeps multiple editors on the same page isolated. */
  namespace: string;
  /** Extension args — exactly what useTypixEditor accepts. */
  extensions: ExtensionsList;
  /** Initial content pre-loaded into the editor — HTML string or Lexical serialized state. */
  content?: SerializedContent | string;
  /** Placeholder shown when the editor is empty. */
  placeholder?: string;
  /** Which preset toolbar to render. Pass "none" if the extension ships its own. */
  toolbar?: ToolbarPreset;
  /**
   * Extra buttons appended to the right side of the toolbar.
   * Use for extension-specific actions like image insert.
   */
  toolbarExtra?: ReactNode;
  /**
   * When provided, wraps the editor in an EditorContextMenu.
   * Pass the menu items array — see EditorContextMenuItem.
   */
  contextMenuItems?: EditorContextMenuItem[];
  /**
   * UI overlays (FloatingLinkUI, MentionUI, SlashDropdownMenu, CodeBlockUI,
   * TableUI, etc.) rendered inside the provider so they have editor context.
   */
  overlays?: ReactNode;
  /**
   * Content rendered below EditorContent but inside the provider.
   * Use for counters, status bars, or anything that must sit outside the
   * scrollable editor area (e.g. CharacterLimit).
   */
  footer?: ReactNode;
  /**
   * When `true`, the editor stretches to fill its parent's full height.
   * Use in fixed-height containers (e.g. the featured-card right column).
   * When `false` (default), uses `min-h-[280px]` for safe inline embedding
   * in docs/MDX where the parent has no defined height.
   */
  stretch?: boolean;
  /** Override the outer wrapper className. */
  className?: string;
  /** Override the editor content className. */
  contentClassName?: string;
}

function FullToolbar({ extra }: { extra?: ReactNode }) {
  return (
    <Toolbar className="flex-wrap border-fd-border border-b px-2 py-1">
      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>
      <ToolbarSeparator className="mx-1 h-5 w-px bg-fd-border" />
      <ToolbarGroup>
        <HeadingButton level={1} />
        <HeadingButton level={2} />
        <HeadingButton level={3} />
        <BlockquoteButton />
        <CodeBlockButton />
      </ToolbarGroup>
      <ToolbarSeparator className="mx-1 h-5 w-px bg-fd-border" />
      <ToolbarGroup>
        <ListDropdownMenu />
      </ToolbarGroup>
      <ToolbarSeparator className="mx-1 h-5 w-px bg-fd-border" />
      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="underline" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
      </ToolbarGroup>
      {extra && (
        <>
          <ToolbarSeparator className="mx-1 h-5 w-px bg-fd-border" />
          <ToolbarGroup>{extra}</ToolbarGroup>
        </>
      )}
    </Toolbar>
  );
}

function MinimalToolbar() {
  return (
    <Toolbar className="border-fd-border border-b px-2 py-1">
      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="underline" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
      </ToolbarGroup>
    </Toolbar>
  );
}

export function ExamplePreview({
  namespace,
  extensions,
  content,
  placeholder = "Start typing...",
  toolbar = "full",
  toolbarExtra,
  overlays,
  footer,
  contextMenuItems,
  stretch = false,
  className,
  contentClassName,
}: ExamplePreviewProps) {
  const editor = useTypixEditor({
    extensions,
    theme: defaultTheme,
    namespace,
    content,
    immediatelyRender: false,
  });

  if (!editor) {
    return (
      <div
        className={cn(
          "w-full animate-pulse bg-muted/20",
          stretch ? "h-full min-h-[280px]" : "min-h-[280px]"
        )}
      />
    );
  }

  return (
    <TypixEditorContext.Provider value={{ editor }}>
      <div
        className={cn(
          "relative w-full overflow-hidden bg-background",
          stretch ? "flex h-full flex-col" : "block",
          className
        )}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {toolbar === "full" && <FullToolbar extra={toolbarExtra} />}
        {toolbar === "minimal" && <MinimalToolbar />}
        {/* IMPORTANT: overlays (MentionUI, FloatingLinkUI, SlashDropdownMenu,
            etc.) must be CHILDREN of EditorContent, not siblings — they call
            useLexicalComposerContext() which only resolves inside the
            ReactRoot/LexicalComposer that EditorContent creates internally.
            Rendering them as siblings throws "cannot find a LexicalComposerContext". */}
        {contextMenuItems ? (
          <EditorContextMenu items={contextMenuItems}>
            <EditorContent
              editor={editor}
              className={cn(
                stretch
                  ? "flex flex-1 flex-col overflow-y-auto text-sm"
                  : "min-h-[280px] overflow-y-auto text-sm",
                contentClassName
              )}
              classNames={
                stretch
                  ? {
                      scroller: "flex flex-1 flex-col",
                      container: "flex flex-1 flex-col",
                      contentEditable:
                        "min-h-full flex-1 px-4 py-3 outline-none",
                    }
                  : {
                      contentEditable: "px-4 py-3 outline-none",
                    }
              }
              placeholder={placeholder}
            >
              {overlays}
            </EditorContent>
          </EditorContextMenu>
        ) : (
          <EditorContent
            editor={editor}
            className={cn(
              stretch
                ? "flex flex-1 flex-col overflow-y-auto text-sm"
                : "min-h-[280px] overflow-y-auto text-sm",
              contentClassName
            )}
            classNames={
              stretch
                ? {
                    scroller: "flex flex-1 flex-col",
                    container: "flex flex-1 flex-col",
                    contentEditable: "min-h-full flex-1 px-4 py-3 outline-none",
                  }
                : {
                    contentEditable: "px-4 py-3 outline-none",
                  }
            }
            placeholder={placeholder}
          >
            {overlays}
          </EditorContent>
        )}
        {footer && <div className="border-fd-border border-t">{footer}</div>}
      </div>
    </TypixEditorContext.Provider>
  );
}
