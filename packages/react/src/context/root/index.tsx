import { BaseSelection } from 'lexical';
import type { JSX } from 'react';
import * as React from 'react';
import { createContext, ReactNode, useContext, useState } from 'react';
import { DEFAULT_PREFIX, getDefaultClassNames, mergeClassNames, TypixConfig } from '../../config';

type RootContextShape = {
    floatingAnchorElem: HTMLElement | null;
    setFloatingAnchorElem: (elem: HTMLElement | null) => void;
    selection: BaseSelection | null;
    setSelection: (selection: BaseSelection | null) => void;
};

const Context: React.Context<RootContextShape> = createContext<RootContextShape>({
    floatingAnchorElem: null,
    setFloatingAnchorElem: (_elem: HTMLElement | null) => {
        throw new Error('setFloatingAnchorElem must be used within RootContext');
    },
    selection: null,
    setSelection: (_selection: BaseSelection | null) => {
        throw new Error('setSelection must be used within RootContext');
    },
});

export const RootContext = ({
    children,
    config = {},
}: {
    children: ReactNode;
    config?: TypixConfig;
}): JSX.Element => {
    const [floatingAnchorElem, setFloatingAnchorElem] =
        useState<HTMLElement | null>(null);

    const [selection, setSelection] = useState<BaseSelection | null>(null);

    const contextValue = {
        floatingAnchorElem,
        setFloatingAnchorElem,
        selection,
        setSelection,
        config,
    };
    return (
        <Context.Provider value={contextValue}>
            {children}
        </Context.Provider>
    );
};

export const useRootContext = (): RootContextShape => {
    const context = useContext(Context);
    if (!context) {
        throw new Error('useRootContext must be used within RootContext');
    }
    return context;
};