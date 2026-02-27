import { createHeadlessEditor } from "@lexical/headless";
import { $isMarkNode, $unwrapMarkNode } from "@lexical/mark";
import { $getRoot, $isElementNode, type Klass, type LexicalNode, type LexicalNodeReplacement } from "lexical";

type EditorNodes =
  | ReadonlyArray<Klass<LexicalNode> | LexicalNodeReplacement>
  | null
  | undefined;

const documentStates = new Map<
  string,
  {
    editorState: string;
    lastUpdated: number;
  }
>();

const editorInstances = new Map<
  string,
  ReturnType<typeof createHeadlessEditor>
>();

const getOrCreateEditor = (documentId: string, nodes: EditorNodes) => {
  if (!editorInstances.has(documentId)) {
    const editor = createHeadlessEditor({
      namespace: `validation-${documentId}`,
      nodes: (nodes ?? undefined) as NonNullable<Parameters<typeof createHeadlessEditor>[0]>["nodes"],
      onError: (error) => console.error(error),
    });
    editorInstances.set(documentId, editor);
  }
  return editorInstances.get(documentId)!;
};

const $sanitizeNode = (node: LexicalNode): void => {
  if ($isMarkNode(node)) {
    $unwrapMarkNode(node);
    return;
  }
  if ($isElementNode(node)) {
    const children = node.getChildren();
    for (const child of children) {
      $sanitizeNode(child);
    }
  }
};

export const validateEditorState = async (
  documentId: string,
  stringifiedJSON: string,
  nodes: EditorNodes
): Promise<boolean> => {
  const editor = getOrCreateEditor(documentId, nodes);
  const currentState = documentStates.get(documentId);

  if (currentState?.editorState === stringifiedJSON) {
    return true;
  }

  const prevEditorState = editor.getEditorState();

  try {
    const nextEditorState = editor.parseEditorState(stringifiedJSON);

    editor.setEditorState(nextEditorState);
    editor.update(() => {
      const root = $getRoot();
      $sanitizeNode(root);
    });

    await Promise.resolve().then();

    const sanitizedJSON = JSON.stringify(editor.getEditorState().toJSON());

    if (currentState) {
      const success = sanitizedJSON === currentState.editorState;
      if (success) {
        // Update the last updated time
        documentStates.set(documentId, {
          editorState: sanitizedJSON,
          lastUpdated: Date.now(),
        });
      } else {
        console.log(`Editor state rejected for document ${documentId}`);
        editor.setEditorState(prevEditorState);
      }
      return success;
    }
    console.log(`Initial state set for document ${documentId}`);
    documentStates.set(documentId, {
      editorState: sanitizedJSON,
      lastUpdated: Date.now(),
    });
    return true;
  } catch (error) {
    console.error(`Validation error for document ${documentId}:`, error);
    editor.setEditorState(prevEditorState);
    return false;
  }
};

// Helper to initialize a document's baseline state
export const initializeDocumentState = async (
  documentId: string,
  initialEditorState: string,
  nodes: EditorNodes
): Promise<void> => {
  await validateEditorState(documentId, initialEditorState, nodes);
};

// Helper to clear a document's state (cleanup)
export const clearDocumentState = (documentId: string): void => {
  documentStates.delete(documentId);
  const editor = editorInstances.get(documentId);
  if (editor) {
    editorInstances.delete(documentId);
  }
};
