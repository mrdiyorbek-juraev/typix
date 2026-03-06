"use client";

import { useRef, useState } from "react";
import { useTypixEditorState } from "@typix-editor/react";
import { Upload, Link } from "lucide-react";

type Tab = "upload" | "link";

interface ImageInsertPopoverProps {
  onClose: () => void;
}

export function ImageInsertPopover({ onClose }: ImageInsertPopoverProps) {
  const editor = useTypixEditorState();
  const [activeTab, setActiveTab] = useState<Tab>("upload");
  const [url, setUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;
      editor
        .chain()
        .focus()
        .insertImage({ src, altText: file.name } as Record<string, unknown>)
        .run();
      onClose();
    };
    reader.readAsDataURL(file);
  };

  const handleUrlSubmit = () => {
    const trimmed = url.trim();
    if (!trimmed) return;
    editor
      .chain()
      .focus()
      .insertImage({ src: trimmed, altText: "Image" } as Record<
        string,
        unknown
      >)
      .run();
    onClose();
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-1 rounded-md bg-muted p-0.5">
        <button
          type="button"
          onClick={() => setActiveTab("upload")}
          className={`flex-1 rounded-sm px-3 py-1.5 text-xs font-medium transition-colors ${
            activeTab === "upload"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Upload className="mr-1.5 inline-block size-3" />
          Upload
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("link")}
          className={`flex-1 rounded-sm px-3 py-1.5 text-xs font-medium transition-colors ${
            activeTab === "link"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Link className="mr-1.5 inline-block size-3" />
          Link
        </button>
      </div>

      <div className={activeTab === "upload" ? "block" : "hidden"}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-border px-3 py-4 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
        >
          <Upload className="size-4" />
          Upload file
        </button>
      </div>
      <div className={activeTab === "link" ? "flex flex-col gap-2" : "hidden"}>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste the image link..."
          className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-xs outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleUrlSubmit();
          }}
        />
        <button
          type="button"
          onClick={handleUrlSubmit}
          disabled={!url.trim()}
          className="w-full rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
        >
          Embed image
        </button>
        <p className="text-[10px] text-muted-foreground">
          Works with any image from the web
        </p>
      </div>
    </div>
  );
}
