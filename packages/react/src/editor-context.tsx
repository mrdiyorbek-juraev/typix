"use client";

import { createContext } from "react";
import type { TypixEditor } from "@typix-editor/core";

/**
 * Context shape for the active TypixEditor. Read via
 * `useCurrentTypixEditor()`; provide via `<TypixEditorProvider>` or by
 * wrapping descendants in `<TypixEditorContext.Provider>` manually.
 */
export interface TypixEditorContextValue {
  editor: TypixEditor | null;
}

export const TypixEditorContext =
  createContext<TypixEditorContextValue | null>(null);
