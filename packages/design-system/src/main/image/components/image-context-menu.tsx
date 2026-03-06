import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "../../../primitives/context-menu";
import {
  AlignCenter,
  AlignLeft,
  ArrowLeftRight,
  Copy,
  Download,
  ImageIcon,
  MoreHorizontal,
  Trash2,
  Type,
} from "lucide-react";
import type { ImageContextMenuProps } from "../types";

const FullWidthIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect
      x="1"
      y="3"
      width="14"
      height="10"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);

export function ImageContextMenu({
  children,
  src,
  alignment,
  showCaption,
  features,
  onReplace,
  onCopyImage,
  onDownload,
  onToggleCaption,
  onDuplicate,
  onDelete,
  onAlignmentChange,
}: ImageContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        {/* Replace */}
        <ContextMenuItem onClick={onReplace}>
          <ArrowLeftRight className="mr-2 h-4 w-4" />
          Replace
        </ContextMenuItem>

        {/* Copy image */}
        <ContextMenuItem onClick={onCopyImage}>
          <ImageIcon className="mr-2 h-4 w-4" />
          Copy image
        </ContextMenuItem>

        {/* Download */}
        <ContextMenuItem onClick={onDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download
        </ContextMenuItem>

        <ContextMenuSeparator />

        {/* Caption */}
        {features.caption && (
          <ContextMenuItem onClick={onToggleCaption}>
            <Type className="mr-2 h-4 w-4" />
            {showCaption ? "Hide caption" : "Caption"}
            <ContextMenuShortcut>Ctrl+Alt+M</ContextMenuShortcut>
          </ContextMenuItem>
        )}

        {/* Duplicate */}
        <ContextMenuItem onClick={onDuplicate}>
          <Copy className="mr-2 h-4 w-4" />
          Duplicate
          <ContextMenuShortcut>Ctrl+D</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuSeparator />

        {/* Delete */}
        <ContextMenuItem
          onClick={onDelete}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
          <ContextMenuShortcut>Del</ContextMenuShortcut>
        </ContextMenuItem>

        {/* More options → Alignment submenu */}
        {features.alignment && (
          <>
            <ContextMenuSeparator />
            <ContextMenuSub>
              <ContextMenuSubTrigger>
                <MoreHorizontal className="mr-2 h-4 w-4" />
                More options
              </ContextMenuSubTrigger>
              <ContextMenuSubContent className="w-44">
                <ContextMenuItem
                  onClick={() => onAlignmentChange("left")}
                  className={alignment === "left" ? "bg-accent" : ""}
                >
                  <AlignLeft className="mr-2 h-4 w-4" />
                  Align left
                </ContextMenuItem>
                <ContextMenuItem
                  onClick={() => onAlignmentChange("center")}
                  className={alignment === "center" ? "bg-accent" : ""}
                >
                  <AlignCenter className="mr-2 h-4 w-4" />
                  Align center
                </ContextMenuItem>
                <ContextMenuItem
                  onClick={() => onAlignmentChange("full-width")}
                  className={alignment === "full-width" ? "bg-accent" : ""}
                >
                  <FullWidthIcon />
                  <span className="ml-2">Full width</span>
                </ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}
