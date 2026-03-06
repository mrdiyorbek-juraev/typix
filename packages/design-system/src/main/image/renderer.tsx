import React from "react";
import { ImageComponent } from "./components/image-component";
import type { ImageComponentProps } from "./types";

/**
 * Pre-wrapped renderer for ImageExtension.
 *
 * Pass this instead of `ImageComponent` directly:
 * ```ts
 * import { imageRenderer } from "@typix-editor/ui";
 * ImageExtension({ component: imageRenderer })
 * ```
 *
 * `React.createElement(ImageComponent, props)` returns a React element
 * descriptor — it does NOT invoke the function. Lexical renders it through
 * React's reconciler, which correctly handles hooks. Calling
 * `ImageComponent(props)` directly (outside the reconciler) violates Rules of
 * Hooks and throws "Invalid hook call".
 */
export function imageRenderer(
  props: Omit<ImageComponentProps, "features">,
): React.ReactElement {
  return React.createElement(ImageComponent, props);
}
