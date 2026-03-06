import type { JSX } from "react"
import * as React from "react"
import { Check, ExternalLink, Link, Pencil, Trash2, X } from "lucide-react"
import { sanitizeUrl } from "@typix-editor/react"
import { cn } from "../../../lib/utils"
import { Button } from "../../../primitives/button"
import { Separator } from "../../../primitives/separator"
import type { FloatingLinkRenderProps } from "../types"

export function DefaultFloatingLinkUI({
  isEditing,
  linkUrl,
  editedUrl,
  isValidUrl,
  setEditedUrl,
  submitLink,
  cancelEdit,
  startEdit,
  deleteLink,
  inputRef,
}: FloatingLinkRenderProps): JSX.Element {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault()
      submitLink()
    } else if (event.key === "Escape") {
      event.preventDefault()
      cancelEdit()
    }
  }

  if (isEditing) {
    return (
      <div className="flex w-full items-center gap-1 p-1.5">
        <div
          className={cn(
            "flex flex-1 items-center gap-1.5 rounded-md border border-input bg-background px-2 h-8 min-w-0",
            "transition-[border-color,box-shadow] duration-150 ease-out",
            "focus-within:border-ring focus-within:ring-1 focus-within:ring-ring",
          )}
        >
          <Link className="size-3.5 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            className="flex-1 min-w-0 border-0 bg-transparent text-[13px] leading-snug text-foreground outline-none placeholder:text-muted-foreground"
            value={editedUrl}
            onChange={(e) => setEditedUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Paste or type a link..."
            aria-label="Link URL"
            spellCheck={false}
            autoComplete="off"
          />
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="size-7 text-muted-foreground hover:text-foreground"
            aria-label="Cancel"
            title="Cancel"
            onClick={cancelEdit}
            onMouseDown={(e) => e.preventDefault()}
          >
            <X className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 text-foreground hover:bg-accent disabled:text-muted-foreground/40"
            aria-label="Apply link"
            title="Apply"
            disabled={!isValidUrl}
            onClick={(e) => {
              e.preventDefault()
              submitLink()
            }}
            onMouseDown={(e) => e.preventDefault()}
          >
            <Check className="size-3.5" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-full items-center gap-1 py-1.5 pl-2.5 pr-1.5">
      <a
        className={cn(
          "inline-flex flex-1 items-center gap-1.5 min-w-0 rounded-md px-1.5 py-1",
          "text-[13px] leading-snug text-foreground no-underline",
          "transition-colors duration-150 ease-out",
          "hover:bg-accent",
        )}
        href={sanitizeUrl(linkUrl)}
        target="_blank"
        rel="noopener noreferrer"
        title={linkUrl}
      >
        <span className="truncate max-w-[240px]">{linkUrl}</span>
        <ExternalLink className="size-3 shrink-0 text-muted-foreground/50" />
      </a>
      <Separator orientation="vertical" className="mx-0.5 h-4.5 shrink-0" />
      <Button
        variant="ghost"
        size="icon"
        className="size-7 text-muted-foreground hover:text-foreground"
        aria-label="Edit link"
        title="Edit"
        onClick={(e) => {
          e.preventDefault()
          startEdit()
        }}
        onMouseDown={(e) => e.preventDefault()}
      >
        <Pencil className="size-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="size-7 text-muted-foreground hover:text-destructive"
        aria-label="Remove link"
        title="Remove"
        onClick={deleteLink}
        onMouseDown={(e) => e.preventDefault()}
      >
        <Trash2 className="size-3.5" />
      </Button>
    </div>
  )
}
