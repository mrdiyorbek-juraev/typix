"use client";

import {
  createEditorConfig,
  defaultExtensionNodes,
  defaultTheme,
  EditorContent,
  EditorRoot,
  useActiveFormats,
  useTypixEditor,
} from "@typix-editor/react";
import "@typix-editor/react/src/styles/main.css";
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo,
  Strikethrough,
  Underline,
  Undo,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const config = createEditorConfig({
  extensionNodes: defaultExtensionNodes,
  theme: defaultTheme,
});

function Separator() {
  return <div className="mx-0.5 h-4 w-px bg-fd-border" />;
}

function Toolbar() {
  const editor = useTypixEditor();
  const { isActive } = useActiveFormats({
    formats: ["bold", "italic", "underline", "strikethrough", "code"],
  });
  const [blockType, setBlockType] = useState<string | null>(null);

  useEffect(
    () =>
      editor.onUpdate(() => {
        setBlockType(editor.getBlockType());
      }),
    [editor]
  );

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-fd-border border-b px-2 py-1.5">
      <Button
        onClick={() => editor.undo()}
        size="icon-sm"
        title="Undo"
        variant="ghost"
      >
        <Undo />
      </Button>
      <Button
        onClick={() => editor.redo()}
        size="icon-sm"
        title="Redo"
        variant="ghost"
      >
        <Redo />
      </Button>

      <Separator />

      <Button
        onClick={() => editor.toggleBold()}
        size="icon-sm"
        variant={isActive("bold") ? "secondary" : "ghost"}
      >
        <Bold />
      </Button>
      <Button
        onClick={() => editor.toggleItalic()}
        size="icon-sm"
        variant={isActive("italic") ? "secondary" : "ghost"}
      >
        <Italic />
      </Button>
      <Button
        onClick={() => editor.toggleUnderline()}
        size="icon-sm"
        variant={isActive("underline") ? "secondary" : "ghost"}
      >
        <Underline />
      </Button>
      <Button
        onClick={() => editor.toggleStrikethrough()}
        size="icon-sm"
        variant={isActive("strikethrough") ? "secondary" : "ghost"}
      >
        <Strikethrough />
      </Button>
      <Button
        onClick={() => editor.toggleCode()}
        size="icon-sm"
        variant={isActive("code") ? "secondary" : "ghost"}
      >
        <Code />
      </Button>

      <Separator />

      <Button
        onClick={() => editor.toggleHeading({ level: 1 })}
        size="icon-sm"
        variant={blockType === "h1" ? "secondary" : "ghost"}
      >
        <Heading1 />
      </Button>
      <Button
        onClick={() => editor.toggleHeading({ level: 2 })}
        size="icon-sm"
        variant={blockType === "h2" ? "secondary" : "ghost"}
      >
        <Heading2 />
      </Button>
      <Button
        onClick={() => editor.toggleQuote()}
        size="icon-sm"
        variant={blockType === "quote" ? "secondary" : "ghost"}
      >
        <Quote />
      </Button>
      <Button
        onClick={() => editor.toggleBulletList()}
        size="icon-sm"
        variant={blockType === "bullet" ? "secondary" : "ghost"}
      >
        <List />
      </Button>
      <Button
        onClick={() => editor.toggleOrderedList()}
        size="icon-sm"
        variant={blockType === "number" ? "secondary" : "ghost"}
      >
        <ListOrdered />
      </Button>
    </div>
  );
}

export default function QuickExample() {
  return (
    <EditorRoot config={config}>
      <div className="w-full overflow-hidden rounded-md border border-fd-border bg-background">
        <Toolbar />
        <EditorContent
          className="max-h-[300px] min-h-[120px] overflow-y-auto text-sm"
          placeholder="Start typing..."
        />
      </div>
    </EditorRoot>
  );
}

export const files = [
  {
    name: "Editor.tsx",
    lang: "tsx",
    code: `import {
  EditorRoot,
  EditorContent,
  createEditorConfig,
  defaultExtensionNodes,
} from '@typix-editor/react';
import { Toolbar } from './Toolbar';

const config = createEditorConfig({
  extensionNodes: defaultExtensionNodes,
});

export default function MyEditor() {
  return (
    <EditorRoot config={config}>
      <Toolbar />
      <EditorContent placeholder="Start typing..." />
    </EditorRoot>
  );
}`,
  },
  {
    name: "Toolbar.tsx",
    lang: "tsx",
    code: `import { useEffect, useState } from 'react';
import {
  useTypixEditor,
  useActiveFormats,
} from '@typix-editor/react';
import {
  Bold, Italic, Underline, Strikethrough, Code,
  Heading1, Heading2, Quote, List, ListOrdered,
  Undo, Redo,
} from 'lucide-react';

export function Toolbar() {
  const editor = useTypixEditor();
  const { isActive } = useActiveFormats({
    formats: ['bold', 'italic', 'underline', 'strikethrough', 'code'],
  });
  const [blockType, setBlockType] = useState(null);

  useEffect(() => {
    return editor.onUpdate(() => {
      setBlockType(editor.getBlockType());
    });
  }, [editor]);

  return (
    <div>
      <button onClick={() => editor.undo()}><Undo /></button>
      <button onClick={() => editor.redo()}><Redo /></button>

      <button onClick={() => editor.toggleBold()} data-active={isActive('bold')}><Bold /></button>
      <button onClick={() => editor.toggleItalic()} data-active={isActive('italic')}><Italic /></button>
      <button onClick={() => editor.toggleUnderline()} data-active={isActive('underline')}><Underline /></button>
      <button onClick={() => editor.toggleStrikethrough()} data-active={isActive('strikethrough')}><Strikethrough /></button>
      <button onClick={() => editor.toggleCode()} data-active={isActive('code')}><Code /></button>

      <button onClick={() => editor.toggleHeading({ level: 1 })} data-active={blockType === 'h1'}><Heading1 /></button>
      <button onClick={() => editor.toggleHeading({ level: 2 })} data-active={blockType === 'h2'}><Heading2 /></button>
      <button onClick={() => editor.toggleQuote()} data-active={blockType === 'quote'}><Quote /></button>
      <button onClick={() => editor.toggleBulletList()} data-active={blockType === 'bullet'}><List /></button>
      <button onClick={() => editor.toggleOrderedList()} data-active={blockType === 'number'}><ListOrdered /></button>
    </div>
  );
}`,
  },
];
