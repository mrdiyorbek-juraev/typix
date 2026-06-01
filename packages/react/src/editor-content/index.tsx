"use client";

import { forwardRef, useMemo, type ReactNode } from "react";
import { getExtensionDependencyFromEditor } from "@lexical/extension";
import { ReactExtension } from "@lexical/react/ReactExtension";
import type { TypixEditor } from "@typix-editor/core";
import { RootContext, useRootContext } from "../root-context";
import { SharedHistoryContext } from "./history-context";
import { DefaultPlugins } from "./default-plugins";
import { RichTextExtension } from "./rich-text-plugin";

interface EditorContentProps {
  /**
   * The TypixEditor instance, typically created via `useTypixEditor`.
   * Required — EditorContent renders no editor on its own.
   */
  editor: TypixEditor;

  /** Children rendered alongside the editable surface (e.g. floating UI). */
  children?: ReactNode;

  /** Placeholder text displayed when the editor is empty. */
  placeholder?: string;

  /** CSS class applied to the outer wrapper. */
  className?: string;

  /** Granular class names for inner layers. */
  classNames?: {
    scroller?: string;
    container?: string;
    contentEditable?: string;
    placeholder?: string;
  };

  /**
   * Override the default plugin tree. When omitted, EditorContent renders
   * `<DefaultPlugins />` (History + AutoFocus + Shortcuts + SafeListPlugin).
   * When provided, only these plugins are rendered.
   */
  plugins?: ReactNode;
}

const EditorContent = forwardRef<HTMLDivElement, EditorContentProps>(
  (
    { editor, children, className, placeholder, classNames, plugins },
    ref,
  ) => {
    // The ReactExtension's `output.Component` provides
    // `LexicalComposerContext.Provider` + decorator portals so React
    // decorator nodes (images, mentions, etc.) render. Without this the
    // editor would work for plain text but decorators would be invisible.
    const ReactRoot = useMemo(() => {
      return getExtensionDependencyFromEditor(editor.lexical, ReactExtension)
        .output.Component;
    }, [editor]);

    return (
      <div className={className} ref={ref}>
        <ReactRoot>
          <RootContext>
            <SharedHistoryContext>
              {plugins ?? <DefaultPlugins />}
              <EditableBody
                placeholder={placeholder}
                classNames={classNames}
              />
              {children}
            </SharedHistoryContext>
          </RootContext>
        </ReactRoot>
      </div>
    );
  },
);

EditorContent.displayName = "Typix.EditorContent";

/**
 * Renders the contenteditable surface and registers the floating anchor
 * element with RootContext so bubble menus / floating UI can position
 * against it.
 */
function EditableBody({
  placeholder,
  classNames,
}: {
  placeholder?: string;
  classNames?: EditorContentProps["classNames"];
}) {
  const { setFloatingAnchorElem } = useRootContext();
  const onRef = (node: HTMLDivElement | null): void => {
    if (node !== null) setFloatingAnchorElem(node);
  };
  return (
    <RichTextExtension
      classNames={classNames}
      editorRef={onRef}
      placeholder={placeholder}
    />
  );
}

export { EditorContent, type EditorContentProps };
