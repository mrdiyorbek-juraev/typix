import {
  $createLinkNode,
  $isAutoLinkNode,
  $isLinkNode,
  TOGGLE_LINK_COMMAND,
} from '@lexical/link';
import { $findMatchingParent, mergeRegister } from '@lexical/utils';
import {
  $getSelection,
  $isNodeSelection,
  $isRangeSelection,
  type BaseSelection,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  getDOMSelection,
  KEY_ESCAPE_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import type * as React from 'react';
import {
  getSelectedNode,
  sanitizeUrl,
  setFloatingElemPositionForLinkEditor,
  type TypixEditor,
  useRootContext,
  validateUrl,
} from '@typix-editor/react';
import type { FloatingLinkRenderProps } from '../types';

export function useFloatingLinkEditor({
  editor,
  isLink,
  setIsLink,
  verticalOffset,
}: {
  editor: TypixEditor['_lexicalEditor'];
  isLink: boolean;
  setIsLink: Dispatch<SetStateAction<boolean>>;
  verticalOffset: number;
}): {
  editorRef: React.RefObject<HTMLDivElement | null>;
  renderProps: FloatingLinkRenderProps;
} {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const { floatingAnchorElem } = useRootContext();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [editedLinkUrl, setEditedLinkUrl] = useState('https://');
  const [isLinkEditMode, setIsLinkEditMode] = useState(false);
  const [lastSelection, setLastSelection] = useState<BaseSelection | null>(
    null,
  );
  const isLinkRef = useRef(isLink);
  useEffect(() => {
    isLinkRef.current = isLink;
  }, [isLink]);

  const $updateLinkEditor = useCallback(() => {
    const editorElem = editorRef.current;

    // Hide the floating element when no link is active
    if (!isLinkRef.current && editorElem && floatingAnchorElem) {
      setFloatingElemPositionForLinkEditor(null, editorElem, floatingAnchorElem);
      return;
    }

    const selection = $getSelection();

    // Resolve current link URL using a local variable
    // to avoid stale closure issues with React state
    let currentUrl = '';

    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection);
      const linkParent = $findMatchingParent(node, $isLinkNode);

      if (linkParent) {
        currentUrl = linkParent.getURL();
      } else if ($isLinkNode(node)) {
        currentUrl = node.getURL();
      }
    } else if ($isNodeSelection(selection)) {
      const nodes = selection.getNodes();
      if (nodes.length > 0) {
        const node = nodes[0];
        const parent = node.getParent();
        if ($isLinkNode(parent)) {
          currentUrl = parent.getURL();
        } else if ($isLinkNode(node)) {
          currentUrl = node.getURL();
        }
      }
    }

    setLinkUrl(currentUrl);

    const nativeSelection = getDOMSelection(editor._window);
    const activeElement = document.activeElement;

    if (editorElem === null) {
      return;
    }

    const rootElement = editor.getRootElement();

    if (
      selection !== null &&
      rootElement !== null &&
      editor.isEditable() &&
      floatingAnchorElem
    ) {
      let domRect: DOMRect | undefined;

      if ($isNodeSelection(selection)) {
        const nodes = selection.getNodes();
        if (nodes.length > 0) {
          const element = editor.getElementByKey(nodes[0].getKey());
          if (element) {
            domRect = element.getBoundingClientRect();
          }
        }
      } else if (
        nativeSelection !== null &&
        rootElement.contains(nativeSelection.anchorNode)
      ) {
        domRect =
          nativeSelection.focusNode?.parentElement?.getBoundingClientRect();
      }

      if (domRect) {
        domRect.y += verticalOffset;
        setFloatingElemPositionForLinkEditor(
          domRect,
          editorElem,
          floatingAnchorElem,
        );
      }
      setLastSelection(selection);
    } else if (!activeElement || !editorElem.contains(activeElement)) {
      if (rootElement !== null && floatingAnchorElem) {
        setFloatingElemPositionForLinkEditor(
          null,
          editorElem,
          floatingAnchorElem,
        );
      }
      setLastSelection(null);
      setIsLinkEditMode(false);
      setLinkUrl('');
    }

    return true;
  }, [floatingAnchorElem, editor, verticalOffset]);

  // Position update on resize/scroll
  useEffect(() => {
    const scrollerElem = floatingAnchorElem?.parentElement;

    const update = () => {
      editor.getEditorState().read(() => {
        $updateLinkEditor();
      });
    };

    window.addEventListener('resize', update);

    if (scrollerElem) {
      scrollerElem.addEventListener('scroll', update);
    }

    return () => {
      window.removeEventListener('resize', update);
      if (scrollerElem) {
        scrollerElem.removeEventListener('scroll', update);
      }
    };
  }, [floatingAnchorElem?.parentElement, editor, $updateLinkEditor]);

  // Editor state updates & keyboard handling
  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateLinkEditor();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          $updateLinkEditor();
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_ESCAPE_COMMAND,
        () => {
          if (isLink) {
            setIsLink(false);
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_HIGH,
      ),
    );
  }, [editor, $updateLinkEditor, setIsLink, isLink]);

  // Initial sync
  useEffect(() => {
    editor.getEditorState().read(() => {
      $updateLinkEditor();
    });
  }, [editor, $updateLinkEditor]);

  // Auto-focus input when entering edit mode
  useEffect(() => {
    if (isLinkEditMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLinkEditMode, isLink]);

  // Close editor when focus leaves the floating element
  useEffect(() => {
    const editorElement = editorRef.current;
    if (editorElement === null) return;

    const handleBlur = (event: FocusEvent) => {
      if (
        !editorElement.contains(event.relatedTarget as Element) &&
        isLink
      ) {
        setIsLink(false);
        setIsLinkEditMode(false);
      }
    };

    editorElement.addEventListener('focusout', handleBlur);
    return () => {
      editorElement.removeEventListener('focusout', handleBlur);
    };
  }, [setIsLink, isLink]);

  // ─── Actions ─────────────────────────────────────────────────

  const submitLink = useCallback(() => {
    if (lastSelection === null) return;
    if (editedLinkUrl.trim() === '' || editedLinkUrl === 'https://') return;

    editor.update(() => {
      editor.dispatchCommand(
        TOGGLE_LINK_COMMAND,
        sanitizeUrl(editedLinkUrl),
      );
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const parent = getSelectedNode(selection).getParent();
        if ($isAutoLinkNode(parent)) {
          const linkNode = $createLinkNode(parent.getURL(), {
            rel: parent.__rel,
            target: parent.__target,
            title: parent.__title,
          });
          parent.replace(linkNode, true);
        }
      }
    });

    setEditedLinkUrl('https://');
    setIsLinkEditMode(false);
  }, [editor, editedLinkUrl, lastSelection]);

  const cancelEdit = useCallback(() => {
    setIsLinkEditMode(false);
    setEditedLinkUrl(linkUrl || 'https://');
  }, [linkUrl]);

  const startEdit = useCallback(() => {
    setEditedLinkUrl(linkUrl);
    setIsLinkEditMode(true);
  }, [linkUrl]);

  const deleteLink = useCallback(() => {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
  }, [editor]);

  const isValidUrl =
    editedLinkUrl === 'https://' || validateUrl(editedLinkUrl);

  return {
    editorRef,
    renderProps: {
      isEditing: isLinkEditMode,
      linkUrl,
      editedUrl: editedLinkUrl,
      isValidUrl,
      setEditedUrl: setEditedLinkUrl,
      submitLink,
      cancelEdit,
      startEdit,
      deleteLink,
      inputRef,
    },
  };
}
