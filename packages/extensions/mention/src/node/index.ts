import {
    $applyNodeReplacement,
    type DOMConversionMap,
    type DOMConversionOutput,
    type DOMExportOutput,
    type EditorConfig,
    type LexicalNode,
    type NodeKey,
    type SerializedTextNode,
    type Spread,
    TextNode,
} from 'lexical';

/**
 * Serialized representation of a MentionNode.
 */
export type SerializedMentionNode = Spread<
    {
        mentionId: string;
        mentionName: string;
        mentionTrigger: string;
        mentionData?: Record<string, unknown>;
    },
    SerializedTextNode
>;

/**
 * Configuration for MentionNode appearance and behavior.
 */
export interface MentionNodeOptions {
    className?: string;
    style?: string;
    includeTrigger?: boolean;
}

// Default configuration
const DEFAULT_CLASS_NAME = 'typix-mention';
const DEFAULT_INCLUDE_TRIGGER = true;

// Module-level configuration that can be set before node registration
let globalMentionNodeOptions: MentionNodeOptions = {};

/**
 * Configure global MentionNode options.
 * Call this before registering nodes with the editor.
 *
 * @example
 * ```ts
 * configureMentionNode({
 *   className: 'my-mention-class',
 *   style: 'color: blue;',
 *   includeTrigger: false,
 * });
 * ```
 */
export function configureMentionNode(options: MentionNodeOptions): void {
    globalMentionNodeOptions = { ...globalMentionNodeOptions, ...options };
}

/**
 * Reset MentionNode configuration to defaults.
 */
export function resetMentionNodeConfig(): void {
    globalMentionNodeOptions = {};
}

function $convertMentionElement(
    domNode: HTMLElement,
): DOMConversionOutput | null {
    const textContent = domNode.textContent;
    const mentionId = domNode.getAttribute('data-typix-mention-id');
    const mentionName = domNode.getAttribute('data-typix-mention-name');
    const mentionTrigger = domNode.getAttribute('data-typix-mention-trigger') || '@';
    const mentionDataAttr = domNode.getAttribute('data-typix-mention-data');

    if (textContent !== null && mentionId !== null) {
        let mentionData: Record<string, unknown> | undefined;
        if (mentionDataAttr) {
            try {
                mentionData = JSON.parse(mentionDataAttr);
            } catch {
                // Invalid JSON, ignore
            }
        }

        const node = $createMentionNode({
            id: mentionId,
            name: mentionName || textContent,
            trigger: mentionTrigger,
            data: mentionData,
        });
        return { node };
    }

    return null;
}

/**
 * A Lexical node representing a mention (@user, #tag, etc.).
 *
 * @example
 * ```ts
 * // Register in your editor config
 * const nodes = [MentionNode];
 *
 * // Create programmatically
 * const mention = $createMentionNode({
 *   id: 'user-123',
 *   name: 'John Doe',
 *   trigger: '@',
 * });
 * ```
 */
export class MentionNode extends TextNode {
    __mentionId: string;
    __mentionName: string;
    __mentionTrigger: string;
    __mentionData?: Record<string, unknown>;

    static getType(): string {
        return 'mention';
    }

    static clone(node: MentionNode): MentionNode {
        return new MentionNode(
            node.__mentionId,
            node.__mentionName,
            node.__mentionTrigger,
            node.__text,
            node.__mentionData,
            node.__key,
        );
    }

    static importJSON(serializedNode: SerializedMentionNode): MentionNode {
        const node = new MentionNode(
            serializedNode.mentionId,
            serializedNode.mentionName,
            serializedNode.mentionTrigger,
            serializedNode.text,
            serializedNode.mentionData,
        );
        node.setFormat(serializedNode.format);
        node.setDetail(serializedNode.detail);
        node.setMode(serializedNode.mode);
        node.setStyle(serializedNode.style);
        return node;
    }

    constructor(
        mentionId: string,
        mentionName: string,
        mentionTrigger: string,
        text?: string,
        mentionData?: Record<string, unknown>,
        key?: NodeKey,
    ) {
        const includeTrigger = globalMentionNodeOptions.includeTrigger ?? DEFAULT_INCLUDE_TRIGGER;
        const displayText = text ?? (includeTrigger ? `${mentionTrigger}${mentionName}` : mentionName);
        super(displayText, key);
        this.__mentionId = mentionId;
        this.__mentionName = mentionName;
        this.__mentionTrigger = mentionTrigger;
        this.__mentionData = mentionData;
    }

    exportJSON(): SerializedMentionNode {
        return {
            ...super.exportJSON(),
            mentionId: this.__mentionId,
            mentionName: this.__mentionName,
            mentionTrigger: this.__mentionTrigger,
            mentionData: this.__mentionData,
        };
    }

    createDOM(config: EditorConfig): HTMLElement {
        const dom = super.createDOM(config);
        const className = globalMentionNodeOptions.className ?? DEFAULT_CLASS_NAME;
        const style = globalMentionNodeOptions.style;

        dom.className = className; 
        if (style) {
            dom.style.cssText = style;
        } 
        dom.spellcheck = false;
        dom.setAttribute('data-typix-mention', 'true');
        dom.setAttribute('data-typix-mention-id', this.__mentionId);

        return dom;
    }

    updateDOM(prevNode: this, dom: HTMLElement, config: EditorConfig): boolean {
        
        const isUpdated = super.updateDOM(prevNode, dom, config); 

        // Update attributes if mention data changed
        if (prevNode.__mentionId !== this.__mentionId) {
            dom.setAttribute('data-typix-mention-id', this.__mentionId);
        }

        return isUpdated;
    }

    exportDOM(): DOMExportOutput {
        const element = document.createElement('span');
        element.setAttribute('data-typix-mention', 'true');
        element.setAttribute('data-typix-mention-id', this.__mentionId);
        element.setAttribute('data-typix-mention-name', this.__mentionName);
        element.setAttribute('data-typix-mention-trigger', this.__mentionTrigger);

        if (this.__mentionData) {
            element.setAttribute('data-typix-mention-data', JSON.stringify(this.__mentionData));
        }

        const className = globalMentionNodeOptions.className ?? DEFAULT_CLASS_NAME;
        element.className = className;
        element.textContent = this.__text;

        return { element };
    }

    static importDOM(): DOMConversionMap | null {
        return {
            span: (domNode: HTMLElement) => {
                if (!domNode.hasAttribute('data-typix-mention')) {
                    return null;
                }
                return {
                    conversion: $convertMentionElement,
                    priority: 1,
                };
            },
        };
    }

    /**
     * Get the mention's unique identifier.
     */
    getMentionId(): string {
        return this.__mentionId;
    }

    /**
     * Get the mention's display name.
     */
    getMentionName(): string {
        return this.__mentionName;
    }

    /**
     * Get the trigger character used for this mention.
     */
    getMentionTrigger(): string {
        return this.__mentionTrigger;
    }

    /**
     * Get any additional data associated with the mention.
     */
    getMentionData(): Record<string, unknown> | undefined {
        return this.__mentionData;
    }

    isTextEntity(): true {
        return true;
    }

    canInsertTextBefore(): boolean {
        return false;
    }

    canInsertTextAfter(): boolean {
        return false;
    }
}

/**
 * Parameters for creating a MentionNode.
 */
export interface CreateMentionNodeParams {
    /**
     * Unique identifier for the mention.
     */
    id: string;

    /**
     * Display name for the mention.
     */
    name: string;

    /**
     * Trigger character (e.g., '@', '#').
     * @default '@'
     */
    trigger?: string;

    /**
     * Optional custom display text.
     * If not provided, uses trigger + name or just name based on config.
     */
    text?: string;

    /**
     * Additional data to attach to the mention.
     */
    data?: Record<string, unknown>;
}

/**
 * Create a new MentionNode.
 *
 * @example
 * ```ts
 * const mention = $createMentionNode({
 *   id: 'user-123',
 *   name: 'John Doe',
 *   trigger: '@',
 *   data: { avatar: '/avatars/john.jpg' },
 * });
 * ```
 */
export function $createMentionNode(params: CreateMentionNodeParams): MentionNode {
    const { id, name, trigger = '@', text, data } = params;
    const mentionNode = new MentionNode(id, name, trigger, text, data);
    mentionNode.setMode('segmented').toggleDirectionless();
    return $applyNodeReplacement(mentionNode);
}

/**
 * Check if a node is a MentionNode.
 *
 * @example
 * ```ts
 * if ($isMentionNode(node)) {
 *   console.log(node.getMentionName());
 * }
 * ```
 */
export function $isMentionNode(
    node: LexicalNode | null | undefined,
): node is MentionNode {
    return node instanceof MentionNode;
}
