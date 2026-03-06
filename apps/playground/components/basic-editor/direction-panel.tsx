"use client";

import { useTypixEditorState, useSignal } from "@typix-editor/react";
import { getDirectionState, type DirectionValue } from "@typix-editor/extension-starter-kit";
import { cn } from "@/lib/utils";

const GLOBAL_DIRS: { label: string; value: DirectionValue }[] = [
  { label: "None", value: null },
  { label: "LTR", value: "ltr" },
  { label: "RTL", value: "rtl" },
  { label: "Auto", value: "auto" },
];

function DirButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseDown={(e) => e.preventDefault()}
      className={cn(
        "rounded px-2.5 py-1 text-xs font-medium transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
    >
      {label}
    </button>
  );
}

export function DirectionPanel() {
  const editor = useTypixEditorState();
  const state = getDirectionState(editor.lexical);
  const globalDir = useSignal(state!.globalDirection);

  return (
    <div className="flex flex-col gap-2 border-b border-border bg-muted/20 px-4 py-2.5 text-sm">
      {/* Global direction */}
      <div className="flex items-center gap-2">
        <span className="w-36 shrink-0 font-medium text-foreground">
          Global Direction:
        </span>
        <div className="flex items-center gap-1">
          {GLOBAL_DIRS.map(({ label, value }) => (
            <DirButton
              key={String(value)}
              label={label}
              active={globalDir === value}
              onClick={() =>
                editor.chain().focus().setGlobalDirection({ direction: value }).run()
              }
            />
          ))}
        </div>
      </div>

      {/* Per-selection direction */}
      <div className="flex items-center gap-2">
        <span className="w-36 shrink-0 font-medium text-foreground">
          Set Direction on Selection:
        </span>
        <div className="flex items-center gap-1">
          <DirButton
            label="Set LTR"
            onClick={() => editor.chain().focus().setLTR().run()}
          />
          <DirButton
            label="Set RTL"
            onClick={() => editor.chain().focus().setRTL().run()}
          />
          <DirButton
            label="Set Auto"
            onClick={() => editor.chain().focus().setAutoDirection().run()}
          />
          <DirButton
            label="Unset Direction"
            onClick={() => editor.chain().focus().unsetDirection().run()}
          />
        </div>
      </div>
    </div>
  );
}
