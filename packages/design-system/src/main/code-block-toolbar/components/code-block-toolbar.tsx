"use client";

import { createPortal } from "react-dom";
import { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  Clipboard,
  Sparkles,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "../../../lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../../../primitives/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "../../../primitives/command";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../../primitives/dropdown-menu";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "../../../primitives/tooltip";
import { useCodeBlockToolbar } from "../hooks/use-code-block-toolbar";
import {
  searchLanguages,
  getLanguageDisplayName,
} from "@typix-editor/extension-code-block";
import type { CodeBlockToolbarProps } from "../types";

export function CodeBlockToolbar({ className }: CodeBlockToolbarProps) {
  const {
    activeNodeKey,
    language,
    canFormat,
    copied,
    anchorElem,
    setLocked,
    handleLanguageChange,
    handleCopy,
    handleFormat,
    handleDelete,
  } = useCodeBlockToolbar();

  const [langPickerOpen, setLangPickerOpen] = useState(false);
  const [langQuery, setLangQuery] = useState("");

  // Lock toolbar visibility while dropdowns are open
  useEffect(() => {
    setLocked(langPickerOpen);
  }, [langPickerOpen, setLocked]);

  // Close language picker when active node changes
  useEffect(() => {
    setLangPickerOpen(false);
    setLangQuery("");
  }, [activeNodeKey]);

  const filteredLangs = useMemo(
    () => searchLanguages(langQuery).slice(0, 12),
    [langQuery],
  );

  if (!activeNodeKey || !anchorElem) return null;

  const displayLang = getLanguageDisplayName(language);

  const toolbar = (
    <div
      className={cn(
        "typix-code-block-toolbar",
        "absolute z-50 flex items-center gap-0.5 rounded-lg p-1 shadow-lg",
        "animate-in fade-in-0 duration-150",
        className,
      )}
      style={{
        backgroundColor: "#1f1f1f",
        top: 8,
        right: 8,
      }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.preventDefault()}
    >
      <TooltipProvider delayDuration={300}>
        {/* Language selector — Popover + Command */}
        <Popover open={langPickerOpen} onOpenChange={setLangPickerOpen}>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "flex h-7 items-center gap-1 rounded-sm px-2 text-xs transition-colors",
                    "text-white/80 hover:bg-white/10 hover:text-white",
                  )}
                >
                  {displayLang}
                  <ChevronDown className="size-3 opacity-50" />
                </button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              Change language
            </TooltipContent>
          </Tooltip>

          <PopoverContent
            className="w-48 p-0 border-white/10"
            style={{ backgroundColor: "#1f1f1f" }}
            side="bottom"
            align="start"
            sideOffset={4}
          >
            <Command className="bg-transparent" shouldFilter={false}>
              <CommandInput
                placeholder="Search…"
                value={langQuery}
                onValueChange={setLangQuery}
                className="h-8 text-xs text-white placeholder:text-white/40"
              />
              <CommandList className="max-h-48">
                <CommandEmpty className="py-2 text-center text-xs text-white/40">
                  No languages found
                </CommandEmpty>
                <CommandGroup>
                  {filteredLangs.map((item) => (
                    <CommandItem
                      key={item.key}
                      value={item.key}
                      onSelect={() => {
                        handleLanguageChange(item.key);
                        setLangPickerOpen(false);
                        setLangQuery("");
                      }}
                      className={cn(
                        "text-xs text-white/80 aria-selected:bg-white/10 aria-selected:text-white",
                        item.key === language && "text-white",
                      )}
                    >
                      {item.key === language && <Check className="size-3" />}
                      {item.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <ToolbarSeparator />

        {/* Copy */}
        <ToolbarBtn
          icon={copied ? <Check size={15} /> : <Clipboard size={15} />}
          label={copied ? "Copied!" : "Copy code"}
          onClick={handleCopy}
        />

        {/* Prettier */}
        {canFormat && (
          <ToolbarBtn
            icon={<Sparkles size={15} />}
            label="Format with Prettier"
            onClick={handleFormat}
          />
        )}

        <ToolbarSeparator />

        {/* More menu — DropdownMenu */}
        <DropdownMenu onOpenChange={setLocked}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-sm transition-colors",
                    "text-white/80 hover:bg-white/10 hover:text-white",
                  )}
                  aria-label="More"
                >
                  <MoreHorizontal size={15} />
                </button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              More
            </TooltipContent>
          </Tooltip>

          <DropdownMenuContent
            className="min-w-[140px] border-white/10"
            style={{ backgroundColor: "#1f1f1f" }}
            side="bottom"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-red-400 focus:bg-white/10 focus:text-red-400"
            >
              <Trash2 size={14} />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TooltipProvider>
    </div>
  );

  return createPortal(toolbar, anchorElem);
}

CodeBlockToolbar.displayName = "Typix.CodeBlockToolbar";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ToolbarBtn({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onClick}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-sm transition-colors",
            "text-white/80 hover:bg-white/10 hover:text-white",
          )}
          aria-label={label}
        >
          {icon}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

function ToolbarSeparator() {
  return <div className="mx-0.5 h-4 w-px bg-white/20" />;
}
