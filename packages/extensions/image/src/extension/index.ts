import { effect, namedSignals } from "@typix-editor/core/lexical/extension";
import { $insertNodeToNearestRoot } from "@typix-editor/core/lexical/utils";
import {
  $getNodeByKey,
  COMMAND_PRIORITY_EDITOR,
  defineExtension,
  safeCast,
} from "lexical";
import {
  defineTypixExtension,
  type TypixExtensionConfig,
} from "@typix-editor/core";
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

export interface ImageConfig extends TypixExtensionConfig {
  disabled: boolean;
  maxWidth?: number;
  /**
   * A render function that receives image data and returns a framework-specific
   * element (JSX, Vue VNode, etc.). Registered per-editor so multiple editors
   * on the same page can each use a different renderer.
   *
   * @example
   * import { ImageComponent } from "@typix-editor/ui"
   * ImageExtension({ component: ImageComponent })
   */
  component?: (data: ImageDecoratorData) => unknown;
  /**
   * Called after an image is successfully inserted into the editor.
   */
  onInsert?: (payload: InsertImagePayload) => void;
  /**
   * Called when an image node is removed from the editor.
   * Receives the `src` of the deleted image so you can clean up remote assets.
   */
  onDelete?: (src: string) => void;
  /**
   * Allowed MIME types for images inserted via drag-and-drop or paste.
   * @example ['image/png', 'image/jpeg']
   */
  allowedTypes?: string[];
}

export const ImageExtension = (userConfig: Partial<ImageConfig> = {}) => {
  const resolvedConfig: ImageConfig = {
    disabled: false,
    maxWidth: 800,
    ...userConfig,
  };

  const lexicalExt = defineExtension({
    name: "@typix/image",

    nodes: () => [ImageNode],

    config: safeCast<ImageConfig>(resolvedConfig),

    build(_editor, config) {
      return namedSignals(config);
    },

    register(editor, _config, state) {
      const { disabled, maxWidth } = state.getOutput();

      // Register the consumer's renderer for this editor instance.
      if (resolvedConfig.component) {
        _setImageRenderer(editor, resolvedConfig.component);
      }

      return effect(() => {
        if (disabled?.value) return;

        return editor.registerCommand(
          INSERT_IMAGE_COMMAND,
          (payload: InsertImagePayload) => {
            const allowed = resolvedConfig.allowedTypes;
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
            resolvedConfig.onInsert?.(payload);
            return true;
          },
          COMMAND_PRIORITY_EDITOR
        );
      });
    },
  });

  return defineTypixExtension({
    name: "image",
    typix: lexicalExt,
    config: resolvedConfig,
    commands: {
      insertImage: () => (ctx, attrs?: Record<string, unknown>) => {
        ctx.editor.dispatchCommand(
          INSERT_IMAGE_COMMAND,
          attrs as unknown as InsertImagePayload
        );
        return true;
      },
      setImageAlignment: () => (ctx, attrs?: Record<string, unknown>) => {
        const payload = attrs as
          | { nodeKey: string; alignment: ImageAlignment }
          | undefined;
        if (!payload) return false;
        ctx.editor.update(() => {
          const node = $getNodeByKey(payload.nodeKey);
          if ($isImageNode(node)) {
            node.setAlignment(payload.alignment);
          }
        });
        return true;
      },
      toggleImageCaption: () => (ctx, attrs?: Record<string, unknown>) => {
        const payload = attrs as { nodeKey: string } | undefined;
        if (!payload) return false;
        ctx.editor.update(() => {
          const node = $getNodeByKey(payload.nodeKey);
          if ($isImageNode(node)) {
            node.setShowCaption(!node.getShowCaption());
          }
        });
        return true;
      },
      deleteImage: () => (ctx, attrs?: Record<string, unknown>) => {
        const payload = attrs as { nodeKey: string } | undefined;
        if (!payload) return false;
        ctx.editor.update(() => {
          const node = $getNodeByKey(payload.nodeKey);
          if ($isImageNode(node)) {
            const src = node.getSrc();
            node.remove();
            resolvedConfig.onDelete?.(src);
          }
        });
        return true;
      },
      duplicateImage: () => (ctx, attrs?: Record<string, unknown>) => {
        const payload = attrs as { nodeKey: string } | undefined;
        if (!payload) return false;
        ctx.editor.update(() => {
          const node = $getNodeByKey(payload.nodeKey);
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
    },
  });
};
