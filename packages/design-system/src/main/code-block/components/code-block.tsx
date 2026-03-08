"use client";

import { useEffect, useState } from "react";
import { useTypixEditorState, useSignal } from "@typix-editor/react";
import { getCodeBlockOutput } from "@typix-editor/extension-code-block";
import { CodeBlockToolbar } from "./code-block-toolbar";

export function CodeBlockUI() {
    const editor = useTypixEditorState();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const output = getCodeBlockOutput(editor.lexical);
    const nodeKeys = useSignal(output!.nodeKeys);

    if (!mounted || !output) return null;

    return (
        <>
            {[...nodeKeys].map((key) => (
                <CodeBlockToolbar key={key} nodeKey={key} />
            ))}
        </>
    );
}
