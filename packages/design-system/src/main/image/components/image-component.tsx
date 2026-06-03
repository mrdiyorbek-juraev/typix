import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";
import { mergeRegister } from "@lexical/utils";
import {
  $applyNodeReplacement,
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
} from "lexical";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "../../../lib/utils";
import type {
  ImageAlignment,
  ImageComponentProps,
  ImageFeatureFlags,
} from "../types";
import { ImageCaption } from "./image-caption";
import { ImageContextMenu } from "./image-context-menu";
import { ImageResizer } from "./image-resizer";
import { ImageToolbar } from "./image-toolbar";

const defaultFeatures: Required<ImageFeatureFlags> = {
  contextMenu: true,
  toolbar: true,
  resizable: true,
  caption: true,
  alignment: true,
};

const alignmentClasses: Record<ImageAlignment, string> = {
  right: "flex flex-col items-end",
  left: "flex flex-col items-start",
  center: "flex flex-col items-center",
  "full-width": "flex flex-col items-center",
};

function convertToPng(blob: Blob): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas not supported"));
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((result) => {
        if (result) resolve(result);
        else reject(new Error("Conversion failed"));
      }, "image/png");
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Image load failed"));
    };
    img.src = objectUrl;
  });
}

export function ImageComponent({
  nodeKey,
  src,
  altText,
  width,
  height,
  maxWidth,
  showCaption,
  caption,
  alignment,
  features: featuresProp,
}: ImageComponentProps) {
  const features = useMemo<Required<ImageFeatureFlags>>(
    () => ({ ...defaultFeatures, ...featuresProp }),
    [
      featuresProp?.contextMenu,
      featuresProp?.toolbar,
      featuresProp?.resizable,
      featuresProp?.caption,
      featuresProp?.alignment,
    ]
  );
  const [editor] = useLexicalComposerContext();
  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey);
  const isEditable = useLexicalEditable();
  const imageRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const onMouseEnter = useCallback(() => setIsHovered(true), []);
  const onMouseLeave = useCallback(() => setIsHovered(false), []);

  // --- Node update helpers ---
  const updateNode = useCallback(
    (fn: (node: import("lexical").LexicalNode) => void) => {
      editor.update(() => {
        const node = $getNodeByKey(nodeKey);
        if (node) fn(node);
      });
    },
    [editor, nodeKey]
  );

  // --- Keyboard delete ---
  const $onDelete = useCallback(
    (event: KeyboardEvent) => {
      if (isSelected && $isNodeSelection($getSelection())) {
        event.preventDefault();
        const node = $getNodeByKey(nodeKey);
        if (node) {
          node.remove();
          return true;
        }
      }
      return false;
    },
    [isSelected, nodeKey]
  );

  // --- Command registration ---
  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        CLICK_COMMAND,
        (event: MouseEvent) => {
          const target = event.target as HTMLElement;
          if (
            target.closest(".typix-image-caption") ||
            target.closest(".typix-image-toolbar")
          ) {
            return false;
          }
          if (imageRef.current === event.target) {
            if (event.shiftKey) {
              setSelected(!isSelected);
            } else {
              clearSelection();
              setSelected(true);
            }
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_DELETE_COMMAND,
        $onDelete,
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        $onDelete,
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, isSelected, setSelected, clearSelection, $onDelete]);

  // --- Resize handlers ---
  const handleResizeEnd = useCallback(
    (nextWidth: number | "inherit", nextHeight: number | "inherit") => {
      setIsResizing(false);
      updateNode((node: any) => {
        node.setWidthAndHeight(nextWidth, nextHeight);
      });
    },
    [updateNode]
  );

  const handleResizeStart = useCallback(() => {
    setIsResizing(true);
  }, []);

  // --- Toolbar action handlers ---
  const handleAlignmentChange = useCallback(
    (newAlignment: ImageAlignment) => {
      updateNode((node: any) => {
        node.setAlignment(newAlignment);
      });
    },
    [updateNode]
  );

  const handleToggleCaption = useCallback(() => {
    updateNode((node: any) => {
      node.setShowCaption(!node.getShowCaption());
    });
  }, [updateNode]);

  const handleCaptionChange = useCallback(
    (text: string) => {
      updateNode((node: any) => {
        node.setCaption(text);
      });
    },
    [updateNode]
  );

  const handleDelete = useCallback(() => {
    updateNode((node) => {
      node.remove();
    });
  }, [updateNode]);

  const handleReplace = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        updateNode((node: any) => {
          node.setSrc(result);
        });
      };
      reader.readAsDataURL(file);
      event.target.value = "";
    },
    [updateNode]
  );

  const handleDownload = useCallback(() => {
    const a = document.createElement("a");
    a.href = src;
    a.download = altText || "image";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [src, altText]);

  const handleDuplicate = useCallback(() => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if (node) {
        const clone = (node.constructor as any).clone(node);
        clone.__key = undefined;
        node.insertAfter($applyNodeReplacement(clone));
      }
    });
  }, [editor, nodeKey]);

  const handleCopyImage = useCallback(async () => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const pngBlob =
        blob.type === "image/png" ? blob : await convertToPng(blob);
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": pngBlob }),
      ]);
    } catch {
      // Fallback: copy the URL to clipboard
      try {
        await navigator.clipboard.writeText(src);
      } catch {
        // Clipboard not available
      }
    }
  }, [src]);

  const effectiveMaxWidth =
    alignment === "full-width" ? "100%" : `${maxWidth}px`;

  const imgStyle = useMemo<React.CSSProperties>(
    () => ({
      width:
        alignment === "full-width"
          ? "100%"
          : width !== "inherit"
            ? width
            : undefined,
      height: height !== "inherit" ? height : undefined,
      transition: "filter 0.2s, opacity 0.2s",
    }),
    [alignment, width, height]
  );

  const showToolbar = features.toolbar && isHovered && isEditable && !hasError;
  const showResizer =
    features.resizable &&
    isSelected &&
    isEditable &&
    !hasError &&
    alignment !== "full-width";

  const content = (
    <div className={cn(alignmentClasses[alignment])}>
      <div
        className={cn(
          "relative inline-block select-none",
          alignment === "full-width" && "w-full"
        )}
        style={{ maxWidth: effectiveMaxWidth }}
        draggable={false}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {hasError ? (
          <div className="flex h-[100px] w-[200px] items-center justify-center rounded bg-muted text-sm text-muted-foreground">
            Failed to load image
          </div>
        ) : (
          <>
            <img
              ref={imageRef}
              src={src}
              alt={altText}
              draggable={false}
              className={cn(
                "block max-w-full rounded",
                isSelected && "outline-2 outline-offset-2 outline-blue-500",
                isLoading && "blur-sm opacity-70",
                alignment === "full-width" && "w-full"
              )}
              style={imgStyle}
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setHasError(true);
              }}
            />
            {isLoading && (
              <div
                className="absolute bottom-2 right-2 h-5 w-5 rounded-full border-2 border-gray-200 border-t-blue-500"
                style={{
                  animation: "typix-image-spin 0.6s linear infinite",
                }}
              />
            )}
          </>
        )}

        {/* Floating toolbar — shown on hover, top-right */}
        {showToolbar && (
          <ImageToolbar
            editor={editor}
            nodeKey={nodeKey}
            src={src}
            alignment={alignment}
            showCaption={showCaption}
            onAlignmentChange={handleAlignmentChange}
            onToggleCaption={handleToggleCaption}
            onDelete={handleDelete}
            onReplace={handleReplace}
            onDownload={handleDownload}
          />
        )}

        {/* Resize handles — stay mounted during drag so listeners aren't lost */}
        {showResizer && (
          <ImageResizer
            editor={editor}
            imageRef={imageRef}
            maxWidth={maxWidth}
            onResizeStart={handleResizeStart}
            onResizeEnd={handleResizeEnd}
          />
        )}

        {/* Hidden file input for replace */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Caption — below the image */}
      {features.caption && showCaption && (
        <div
          className="typix-image-caption w-full"
          style={{ maxWidth: effectiveMaxWidth }}
        >
          <ImageCaption caption={caption} onChange={handleCaptionChange} />
        </div>
      )}
    </div>
  );

  if (features.contextMenu && isEditable) {
    return (
      <ImageContextMenu
        src={src}
        alignment={alignment}
        showCaption={showCaption}
        features={features}
        onReplace={handleReplace}
        onCopyImage={handleCopyImage}
        onDownload={handleDownload}
        onToggleCaption={handleToggleCaption}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
        onAlignmentChange={handleAlignmentChange}
      >
        {content}
      </ImageContextMenu>
    );
  }

  return content;
}
