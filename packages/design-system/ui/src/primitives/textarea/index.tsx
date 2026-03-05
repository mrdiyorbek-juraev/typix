"use client"

import * as React from "react"
import TextareaAutosizeComponent, { type TextareaAutosizeProps } from "react-textarea-autosize"
import { cn } from "../../lib/utils"

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaAutosizeProps>(
  ({ className, ...props }, ref) => (
    <TextareaAutosizeComponent
      ref={ref}
      className={cn(
        "flex w-full min-h-[80px] resize-none rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
)
Textarea.displayName = "Textarea"

export { Textarea }
