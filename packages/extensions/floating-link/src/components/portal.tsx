import type { Dispatch, JSX, ReactNode, SetStateAction } from 'react';
import type { TypixEditor } from '@typix-editor/react';
import { useFloatingLinkEditor } from '../hooks/use-floating-link-editor';
import type { FloatingLinkRenderProps } from '../types';
import { DefaultFloatingLinkUI } from './default-ui';

export function FloatingLinkEditorPortal({
  editor,
  isLink,
  setIsLink,
  children,
  verticalOffset,
}: {
  editor: TypixEditor['_lexicalEditor'];
  isLink: boolean;
  setIsLink: Dispatch<SetStateAction<boolean>>;
  children?: (props: FloatingLinkRenderProps) => ReactNode;
  verticalOffset: number;
}): JSX.Element {
  const { editorRef, renderProps } = useFloatingLinkEditor({
    editor,
    isLink,
    setIsLink,
    verticalOffset,
  });

  return (
    <div
      ref={editorRef}
      className="typix-floating-link"
      onMouseDown={(e) => {
        // Prevent clicks inside the floating link from stealing
        // focus away from the editor, which would close the panel.
        if (e.target !== editorRef.current) {
          e.preventDefault();
        }
      }}
    >
      {!isLink ? null : children ? (
        children(renderProps)
      ) : (
        <DefaultFloatingLinkUI {...renderProps} />
      )}
    </div>
  );
}
