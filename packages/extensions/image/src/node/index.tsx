import {
    $applyNodeReplacement,
    DecoratorNode,
    type DOMConversionMap,
    type DOMConversionOutput,
    type DOMExportOutput,
    type LexicalEditor,
    type LexicalNode,
    type NodeKey,
    type SerializedLexicalNode,
    type Spread,
} from "lexical";

export type ImageAlignment = "left" | "center" | "right" | "full-width";

export type ImageDecoratorRenderer = (data: ImageDecoratorData) => unknown;

/**
 * Per-editor component registry. Stores the image renderer keyed by editor
 * instance so multiple editors on the same page each have their own renderer.
 */
const _renderers = new WeakMap<LexicalEditor, ImageDecoratorRenderer>();

export function _setImageRenderer(
    editor: LexicalEditor,
    renderer: ImageDecoratorRenderer,
): void {
    _renderers.set(editor, renderer);
}

/**
 * Plain data descriptor passed to the image renderer. The renderer function
 * (provided via ImageExtension({ component })) receives this and returns the
 * framework-specific element (JSX, Vue VNode, etc.).
 */
export interface ImageDecoratorData {
    nodeKey: string;
    src: string;
    altText: string;
    width: number | "inherit";
    height: number | "inherit";
    maxWidth: number;
    showCaption: boolean;
    caption: string;
    alignment: ImageAlignment;
}

export type SerializedImageNode = Spread<
    {
        src: string;
        altText: string;
        width: number;
        height: number;
        maxWidth: number;
        showCaption: boolean;
        caption: string;
        alignment: ImageAlignment;
    },
    SerializedLexicalNode
>;

function $convertImgElement(domNode: Node): DOMConversionOutput | null {
    const img = domNode as HTMLImageElement;
    if (img.src) {
        const figure = img.closest("figure");
        const figcaption = figure?.querySelector("figcaption");
        const alignment =
            (figure?.getAttribute("data-alignment") as ImageAlignment) || "center";
        const caption = figcaption?.textContent || "";

        const node = $createImageNode({
            src: img.src,
            altText: img.alt || "",
            width: img.width || "inherit",
            height: img.height || "inherit",
            alignment,
            caption,
            showCaption: !!caption,
        });
        return { node };
    }
    return null;
}

/**
 * Headless ImageNode — stores all image data and handles serialization /
 * DOM import-export. decorate() returns null; the framework-specific node
 * (scaffolded into the consumer's project via `typix add image`) subclasses
 * this and overrides decorate() to return JSX / Vue component / etc.
 */
export class ImageNode extends DecoratorNode<unknown> {
    __src: string;
    __altText: string;
    __width: number | "inherit";
    __height: number | "inherit";
    __maxWidth: number;
    __showCaption: boolean;
    __caption: string;
    __alignment: ImageAlignment;

    static getType(): string {
        return "image";
    }

    static clone(node: ImageNode): ImageNode {
        return new ImageNode(
            node.__src,
            node.__altText,
            node.__width,
            node.__height,
            node.__maxWidth,
            node.__showCaption,
            node.__caption,
            node.__alignment,
            node.__key
        );
    }

    constructor(
        src: string,
        altText: string,
        width: number | "inherit" = "inherit",
        height: number | "inherit" = "inherit",
        maxWidth: number = 800,
        showCaption: boolean = false,
        caption: string = "",
        alignment: ImageAlignment = "center",
        key?: NodeKey
    ) {
        super(key);
        this.__src = src;
        this.__altText = altText;
        this.__width = width;
        this.__height = height;
        this.__maxWidth = maxWidth;
        this.__showCaption = showCaption;
        this.__caption = caption;
        this.__alignment = alignment;
    }

    static importJSON(serializedNode: SerializedImageNode): ImageNode {
        return $createImageNode({
            src: serializedNode.src,
            altText: serializedNode.altText,
            width: serializedNode.width === 0 ? "inherit" : serializedNode.width,
            height: serializedNode.height === 0 ? "inherit" : serializedNode.height,
            maxWidth: serializedNode.maxWidth,
            showCaption: serializedNode.showCaption ?? false,
            caption: serializedNode.caption ?? "",
            alignment: serializedNode.alignment ?? "center",
        });
    }

    static importDOM(): DOMConversionMap | null {
        return {
            img: () => ({
                conversion: $convertImgElement,
                priority: 0,
            }),
        };
    }

    exportJSON(): SerializedImageNode {
        return {
            type: "image",
            version: 1,
            src: this.__src,
            altText: this.__altText,
            width: this.__width === "inherit" ? 0 : this.__width,
            height: this.__height === "inherit" ? 0 : this.__height,
            maxWidth: this.__maxWidth,
            showCaption: this.__showCaption,
            caption: this.__caption,
            alignment: this.__alignment,
        };
    }

    exportDOM(): DOMExportOutput {
        const figure = document.createElement("figure");
        figure.setAttribute("data-alignment", this.__alignment);

        const img = document.createElement("img");
        img.setAttribute("src", this.__src);
        img.setAttribute("alt", this.__altText);
        if (this.__width !== "inherit") {
            img.setAttribute("width", String(this.__width));
        }
        if (this.__height !== "inherit") {
            img.setAttribute("height", String(this.__height));
        }
        img.style.maxWidth = `${this.__maxWidth}px`;
        figure.appendChild(img);

        if (this.__showCaption && this.__caption) {
            const figcaption = document.createElement("figcaption");
            figcaption.textContent = this.__caption;
            figure.appendChild(figcaption);
        }

        return { element: figure };
    }

    createDOM(): HTMLElement {
        const figure = document.createElement("figure");
        figure.setAttribute("data-alignment", this.__alignment);
        return figure;
    }

    updateDOM(prevNode: ImageNode): boolean {
        return prevNode.__alignment !== this.__alignment;
    }

    /**
     * Calls the renderer registered via ImageExtension({ component }).
     * Returns null if no renderer has been registered for this editor.
     */
    decorate(editor: LexicalEditor): unknown {
        const render = _renderers.get(editor);
        if (!render) return null;
        return render({
            nodeKey: this.getKey(),
            src: this.__src,
            altText: this.__altText,
            width: this.__width,
            height: this.__height,
            maxWidth: this.__maxWidth,
            showCaption: this.__showCaption,
            caption: this.__caption,
            alignment: this.__alignment,
        });
    }

    // ─── Getters ─────────────────────────────────────────────────────────────

    getSrc(): string { return this.__src; }
    getAltText(): string { return this.__altText; }
    getShowCaption(): boolean { return this.__showCaption; }
    getCaption(): string { return this.__caption; }
    getAlignment(): ImageAlignment { return this.__alignment; }

    // ─── Setters ─────────────────────────────────────────────────────────────

    setWidthAndHeight(width: number | "inherit", height: number | "inherit"): void {
        const w = this.getWritable();
        w.__width = width;
        w.__height = height;
    }

    setSrc(src: string): void {
        this.getWritable().__src = src;
    }

    setShowCaption(showCaption: boolean): void {
        this.getWritable().__showCaption = showCaption;
    }

    setCaption(caption: string): void {
        this.getWritable().__caption = caption;
    }

    setAlignment(alignment: ImageAlignment): void {
        this.getWritable().__alignment = alignment;
    }

    isInline(): boolean {
        return false;
    }
}

export function $createImageNode({
    src,
    altText = "",
    width = "inherit",
    height = "inherit",
    maxWidth = 800,
    showCaption = false,
    caption = "",
    alignment = "center",
    key,
}: {
    src: string;
    altText?: string;
    width?: number | "inherit";
    height?: number | "inherit";
    maxWidth?: number;
    showCaption?: boolean;
    caption?: string;
    alignment?: ImageAlignment;
    key?: NodeKey;
}): ImageNode {
    return $applyNodeReplacement(
        new ImageNode(src, altText, width, height, maxWidth, showCaption, caption, alignment, key)
    );
}

export function $isImageNode(
    node: LexicalNode | null | undefined
): node is ImageNode {
    return node instanceof ImageNode;
}


