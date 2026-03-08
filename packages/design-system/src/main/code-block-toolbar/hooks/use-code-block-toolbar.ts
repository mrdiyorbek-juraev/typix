import { useCallback, useEffect, useRef, useState } from "react";
import { $getNodeByKey } from "lexical";
import { $isCodeNode } from "@typix-editor/core/lexical/code";
import { useTypixEditor } from "@typix-editor/react";
import { canFormatWithPrettier } from "@typix-editor/extension-code-block-prettier";

export function useCodeBlockToolbar() {
  const editor = useTypixEditor();

  const [activeNodeKey, setActiveNodeKey] = useState<string | null>(null);
  const [language, setLanguage] = useState("javascript");
  const [anchorElem, setAnchorElem] = useState<HTMLElement | null>(null);
  const [copied, setCopied] = useState(false);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lockedRef = useRef(false);

  const setLocked = useCallback((value: boolean) => {
    lockedRef.current = value;
    if (value && hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  }, []);

  // Find the Lexical nodeKey for a given DOM element
  const findNodeKey = useCallback(
    (codeEl: HTMLElement): string | null => {
      const state = editor.lexical.getEditorState();
      let foundKey: string | null = null;
      state.read(() => {
        const nodeMap = state._nodeMap as Map<string, unknown>;
        for (const key of nodeMap.keys()) {
          if (editor.lexical.getElementByKey(key) === codeEl) {
            foundKey = key;
            break;
          }
        }
      });
      return foundKey;
    },
    [editor],
  );

  // Hover detection
  useEffect(() => {
    const rootElement = editor.lexical.getRootElement();
    if (!rootElement) return;

    const show = (codeEl: HTMLElement) => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }

      const key = findNodeKey(codeEl);
      if (!key) return;

      const lang = editor.lexical.getEditorState().read(() => {
        const node = $getNodeByKey(key);
        return $isCodeNode(node) ? node.getLanguage() || "javascript" : "javascript";
      });

      setActiveNodeKey(key);
      setLanguage(lang);
      setAnchorElem(codeEl);
    };

    const scheduleHide = () => {
      if (lockedRef.current) return;
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = setTimeout(() => {
        if (lockedRef.current) return;
        setActiveNodeKey(null);
        setAnchorElem(null);
      }, 150);
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const codeEl = target.closest("code.typix-code") as HTMLElement | null;
      const toolbarEl = target.closest(".typix-code-block-toolbar");
      const radixEl = target.closest("[data-radix-popper-content-wrapper]");

      if (codeEl) {
        show(codeEl);
      } else if (toolbarEl || radixEl) {
        // Keep showing when hovering toolbar or its dropdowns
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
          hideTimeoutRef.current = null;
        }
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const related = e.relatedTarget as HTMLElement | null;
      if (
        related?.closest("code.typix-code") ||
        related?.closest(".typix-code-block-toolbar") ||
        related?.closest("[data-radix-popper-content-wrapper]")
      ) {
        return;
      }
      scheduleHide();
    };

    // Listen on document to catch toolbar events too
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);

    return () => {
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [editor, findNodeKey]);

  const handleLanguageChange = useCallback(
    (lang: string) => {
      if (!activeNodeKey) return;
      (editor.chain() as any)
        .setCodeLanguage({ nodeKey: activeNodeKey, language: lang })
        .run();
      setLanguage(lang);
    },
    [editor, activeNodeKey],
  );

  const handleCopy = useCallback(() => {
    if (!activeNodeKey) return;
    (editor.chain() as any).copyCode({ nodeKey: activeNodeKey }).run();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [editor, activeNodeKey]);

  const handleFormat = useCallback(() => {
    if (!activeNodeKey) return;
    (editor.chain() as any)
      .formatWithPrettier({ nodeKey: activeNodeKey })
      .run();
  }, [editor, activeNodeKey]);

  const handleDelete = useCallback(() => {
    if (!activeNodeKey) return;
    (editor.chain() as any)
      .deleteCodeBlock({ nodeKey: activeNodeKey })
      .run();
    setActiveNodeKey(null);
    setAnchorElem(null);
  }, [editor, activeNodeKey]);

  return {
    activeNodeKey,
    language,
    canFormat: canFormatWithPrettier(language),
    copied,
    anchorElem,
    setLocked,
    handleLanguageChange,
    handleCopy,
    handleFormat,
    handleDelete,
  };
}
