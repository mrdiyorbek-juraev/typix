import type { HistoryState } from "@lexical/react/LexicalHistoryPlugin";
import {
  createEmptyHistoryState,
  HistoryPlugin,
} from "@lexical/react/LexicalHistoryPlugin";
import type * as React from "react";
import type { JSX } from "react";
import { createContext, type ReactNode, useContext, useMemo } from "react";

export type ContextShape = {
  historyState?: HistoryState;
};

const Context: React.Context<ContextShape> = createContext({});

export const SharedHistoryContext = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const historyContext = useMemo(
    () => ({ historyState: createEmptyHistoryState() }),
    []
  );
  return <Context.Provider value={historyContext}>{children}</Context.Provider>;
};

export const useSharedHistoryContext = (): ContextShape => useContext(Context);

export const History = () => {
  const { historyState } = useSharedHistoryContext();
  return <HistoryPlugin externalHistoryState={historyState} />;
};
