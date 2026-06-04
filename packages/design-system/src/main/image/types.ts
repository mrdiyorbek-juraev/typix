import type { NodeKey, TypixEditor } from "@typix-editor/core";

export type ImageAlignment = "left" | "center" | "right" | "full-width";

export interface ImageFeatureFlags {
  contextMenu?: boolean;
  toolbar?: boolean;
  resizable?: boolean;
  caption?: boolean;
  alignment?: boolean;
}

export interface ImageContextMenuProps {
  children: React.ReactNode;
  src: string;
  alignment: ImageAlignment;
  showCaption: boolean;
  features: Required<ImageFeatureFlags>;
  onReplace: () => void;
  onCopyImage: () => void;
  onDownload: () => void;
  onToggleCaption: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onAlignmentChange: (alignment: ImageAlignment) => void;
}

export interface ImageComponentProps {
  nodeKey: NodeKey;
  src: string;
  altText: string;
  width: number | "inherit";
  height: number | "inherit";
  maxWidth: number;
  showCaption: boolean;
  caption: string;
  alignment: ImageAlignment;
  features?: ImageFeatureFlags;
}

export interface ImageResizerProps {
  editor: TypixEditor["_lexical"];
  imageRef: React.RefObject<HTMLImageElement | null>;
  maxWidth: number;
  onResizeEnd: (width: number | "inherit", height: number | "inherit") => void;
  onResizeStart: () => void;
}

export interface ImageToolbarProps {
  editor: TypixEditor["_lexical"];
  nodeKey: NodeKey;
  src: string;
  alignment: ImageAlignment;
  showCaption: boolean;
  onAlignmentChange: (alignment: ImageAlignment) => void;
  onToggleCaption: () => void;
  onDelete: () => void;
  onReplace: () => void;
  onDownload: () => void;
}

export interface ImageToolbarButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  isActive?: boolean;
}

export interface ImageCaptionProps {
  caption: string;
  onChange: (caption: string) => void;
  placeholder?: string;
}

export interface ImageAlignmentPopoverProps {
  alignment: ImageAlignment;
  onAlignmentChange: (alignment: ImageAlignment) => void;
}
