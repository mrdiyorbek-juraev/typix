import { effect, namedSignals } from "@typix-editor/core/lexical/extension";
import { $insertNodeToNearestRoot } from "@typix-editor/core/lexical/utils";
import {
  $getNodeByKey,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  defineExtension,
  safeCast,
} from "lexical";
import { registerTypixMeta } from "@typix-editor/core";
import {
  INSERT_IMAGE_COMMAND,
  type InsertImagePayload,
} from "@typix-editor/extension-drag-drop-paste";

import {
  $createImageNode,
  $isImageNode,
  ImageNode,
  _setImageRenderer,
  type ImageAlignment,
  type ImageDecoratorData,
} from "../node";

export interface ImageConfig {
  disabled: boolean;
  maxWidth?: number;
  /**
   * A render function that receives image data and returns a framework-specific
   * element (JSX, Vue VNode, etc.). Registered per-editor so multiple editors
   * on the same page can each use a different renderer.
   */
  component?: (data: ImageDecoratorData) => unknown;
  /**
   * Called after an image is successfully inserted into the editor.
   */
  onInsert?: (payload: InsertImagePayload) => void;
  /**
   * Called when an image node is removed from the editor.
   */
  onDelete?: (src: string) => void;
  /**
   * Allowed MIME types for images inserted via drag-and-drop or paste.
   */
  allowedTypes?: string[];
}

export const TYPIX_SET_IMAGE_ALIGNMENT = createCommand<{
  nodeKey: string;
  alignment: ImageAlignment;
}>("TYPIX_SET_IMAGE_ALIGNMENT");

export const TYPIX_TOGGLE_IMAGE_CAPTION = createCommand<{ nodeKey: string }>(
  "TYPIX_TOGGLE_IMAGE_CAPTION"
);

export const TYPIX_DELETE_IMAGE = createCommand<{ nodeKey: string }>(
  "TYPIX_DELETE_IMAGE"
);

export const TYPIX_DUPLICATE_IMAGE = createCommand<{ nodeKey: string }>(
  "TYPIX_DUPLICATE_IMAGE"
);

export const ImageExtension = defineExtension({
  name: "@typix/image",

  nodes: () => [ImageNode],

  config: safeCast<ImageConfig>({
    disabled: false,
    maxWidth: 800,
  }),

  mergeConfig(a: ImageConfig, b: Partial<ImageConfig>): ImageConfig {
    return { ...a, ...b };
  },

  build(_editor: any, config: ImageConfig) {
    return namedSignals(config);
  },

  register(editor: any, _config: ImageConfig, state: any) {
    const { disabled, maxWidth } = state.getOutput();

    // Register the consumer's renderer for this editor instance.
    if (_config.component) {
      _setImageRenderer(editor, _config.component);
    }

    return effect(() => {
      if (disabled?.value) return;

      const d0 = editor.registerCommand(
        INSERT_IMAGE_COMMAND,
        (payload: InsertImagePayload) => {
          const allowed = _config.allowedTypes;
          if (allowed && allowed.length > 0) {
            const src = payload.src ?? "";
            const mimeMatch = src.match(/^data:([^;]+);/);
            const mimeType = mimeMatch?.[1] ?? (payload as any).type ?? "";
            if (!allowed.some((t) => t === mimeType)) {
              return false;
            }
          }

          const imageNode = $createImageNode({
            src: payload.src,
            altText: payload.altText ?? "",
            width: payload.width ?? "inherit",
            height: payload.height ?? "inherit",
            maxWidth: payload.maxWidth ?? maxWidth?.value ?? 800,
          });
          $insertNodeToNearestRoot(imageNode);
          _config.onInsert?.(payload);
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      );

      const d1 = editor.registerCommand(
        TYPIX_SET_IMAGE_ALIGNMENT,
        ({
          nodeKey,
          alignment,
        }: {
          nodeKey: string;
          alignment: ImageAlignment;
        }) => {
          editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            if ($isImageNode(node)) {
              node.setAlignment(alignment);
            }
          });
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      );

      const d2 = editor.registerCommand(
        TYPIX_TOGGLE_IMAGE_CAPTION,
        ({ nodeKey }: { nodeKey: string }) => {
          editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            if ($isImageNode(node)) {
              node.setShowCaption(!node.getShowCaption());
            }
          });
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      );

      const d3 = editor.registerCommand(
        TYPIX_DELETE_IMAGE,
        ({ nodeKey }: { nodeKey: string }) => {
          editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            if ($isImageNode(node)) {
              const src = node.getSrc();
              node.remove();
              _config.onDelete?.(src);
            }
          });
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      );

      const d4 = editor.registerCommand(
        TYPIX_DUPLICATE_IMAGE,
        ({ nodeKey }: { nodeKey: string }) => {
          editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            if ($isImageNode(node)) {
              const clone = $createImageNode({
                src: node.getSrc(),
                altText: node.getAltText(),
                width: node.__width,
                height: node.__height,
                maxWidth: node.__maxWidth,
                showCaption: node.getShowCaption(),
                caption: node.getCaption(),
                alignment: node.getAlignment(),
              });
              node.insertAfter(clone);
            }
          });
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      );

      return () => {
        d0();
        d1();
        d2();
        d3();
        d4();
      };
    });
  },
});

registerTypixMeta(ImageExtension, {
  commands: {
    insertImage: INSERT_IMAGE_COMMAND,
    setImageAlignment: TYPIX_SET_IMAGE_ALIGNMENT,
    toggleImageCaption: TYPIX_TOGGLE_IMAGE_CAPTION,
    deleteImage: TYPIX_DELETE_IMAGE,
    duplicateImage: TYPIX_DUPLICATE_IMAGE,
  },
});

declare module "@typix-editor/core" {
  interface TypixCommands<R> {
    insertImage(attrs: {
      src: string;
      altText?: string;
      width?: number | "inherit";
      height?: number | "inherit";
      maxWidth?: number;
      showCaption?: boolean;
      caption?: string;
      key?: string;
    }): R;
    setImageAlignment(attrs: {
      nodeKey: string;
      alignment: "left" | "center" | "right";
    }): R;
    toggleImageCaption(attrs: { nodeKey: string }): R;
    deleteImage(attrs: { nodeKey: string }): R;
    duplicateImage(attrs: { nodeKey: string }): R;
  }
}
