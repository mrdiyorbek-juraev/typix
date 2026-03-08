import * as React from "react";
import * as ToolbarPrimitive from "@radix-ui/react-toolbar";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

/* ------------------------------------------------------------------ */
/*  Toolbar (root)                                                     */
/* ------------------------------------------------------------------ */

const toolbarVariants = cva(
  "flex items-center gap-0.5 p-1",
  {
    variants: {
      variant: {
        default: "border-b border-border bg-muted/30",
        floating:
          "w-auto rounded-lg border border-border bg-background shadow-md",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

const Toolbar = React.forwardRef<
  React.ElementRef<typeof ToolbarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToolbarPrimitive.Root> &
    VariantProps<typeof toolbarVariants>
>(({ className, variant, ...props }, ref) => (
  <ToolbarPrimitive.Root
    ref={ref}
    className={cn(toolbarVariants({ variant, className }))}
    {...props}
  />
));
Toolbar.displayName = "Toolbar";

/* ------------------------------------------------------------------ */
/*  ToolbarGroup                                                       */
/* ------------------------------------------------------------------ */

const ToolbarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="group"
    className={cn("flex items-center gap-0.5", className)}
    {...props}
  />
));
ToolbarGroup.displayName = "ToolbarGroup";

/* ------------------------------------------------------------------ */
/*  ToolbarSeparator                                                   */
/* ------------------------------------------------------------------ */

const ToolbarSeparator = React.forwardRef<
  React.ElementRef<typeof ToolbarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof ToolbarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <ToolbarPrimitive.Separator
    ref={ref}
    className={cn("shrink-0 bg-border mx-0.5", className)}
    {...props}
  />
));
ToolbarSeparator.displayName = "ToolbarSeparator";

/* ------------------------------------------------------------------ */
/*  ToolbarSpacer                                                      */
/* ------------------------------------------------------------------ */

const ToolbarSpacer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex-1", className)} {...props} />
));
ToolbarSpacer.displayName = "ToolbarSpacer";

/* ------------------------------------------------------------------ */
/*  ToolbarButton                                                      */
/* ------------------------------------------------------------------ */

const ToolbarButton = React.forwardRef<
  React.ElementRef<typeof ToolbarPrimitive.Button>,
  React.ComponentPropsWithoutRef<typeof ToolbarPrimitive.Button>
>(({ className, onMouseDown, ...props }, ref) => (
  <ToolbarPrimitive.Button
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-md p-1.5 text-sm font-medium text-muted-foreground transition-colors",
      "hover:bg-accent hover:text-accent-foreground",
      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
      "disabled:pointer-events-none disabled:opacity-50",
      "data-[active]:bg-accent data-[active]:text-accent-foreground",
      "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      className
    )}
    onMouseDown={(e) => {
      e.preventDefault();
      onMouseDown?.(e);
    }}
    {...props}
  />
));
ToolbarButton.displayName = "ToolbarButton";

/* ------------------------------------------------------------------ */
/*  ToolbarToggleGroup                                                 */
/* ------------------------------------------------------------------ */

const ToolbarToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToolbarPrimitive.ToggleGroup>,
  React.ComponentPropsWithoutRef<typeof ToolbarPrimitive.ToggleGroup>
>(({ className, ...props }, ref) => (
  <ToolbarPrimitive.ToggleGroup
    ref={ref}
    className={cn("flex items-center gap-0.5", className)}
    {...props}
  />
));
ToolbarToggleGroup.displayName = "ToolbarToggleGroup";

/* ------------------------------------------------------------------ */
/*  ToolbarToggleItem                                                  */
/* ------------------------------------------------------------------ */

const ToolbarToggleItem = React.forwardRef<
  React.ElementRef<typeof ToolbarPrimitive.ToggleItem>,
  React.ComponentPropsWithoutRef<typeof ToolbarPrimitive.ToggleItem>
>(({ className, ...props }, ref) => (
  <ToolbarPrimitive.ToggleItem
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-md p-1.5 text-sm font-medium text-muted-foreground transition-colors",
      "hover:bg-accent hover:text-accent-foreground",
      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
      "disabled:pointer-events-none disabled:opacity-50",
      "data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
      "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      className
    )}
    {...props}
  />
));
ToolbarToggleItem.displayName = "ToolbarToggleItem";

/* ------------------------------------------------------------------ */
/*  ToolbarLink                                                        */
/* ------------------------------------------------------------------ */

const ToolbarLink = React.forwardRef<
  React.ElementRef<typeof ToolbarPrimitive.Link>,
  React.ComponentPropsWithoutRef<typeof ToolbarPrimitive.Link>
>(({ className, ...props }, ref) => (
  <ToolbarPrimitive.Link
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-md p-1.5 text-sm font-medium text-muted-foreground underline-offset-4 transition-colors",
      "hover:text-accent-foreground hover:underline",
      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
      className
    )}
    {...props}
  />
));
ToolbarLink.displayName = "ToolbarLink";

/* ------------------------------------------------------------------ */
/*  Exports                                                            */
/* ------------------------------------------------------------------ */

export {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
  ToolbarSpacer,
  ToolbarButton,
  ToolbarToggleGroup,
  ToolbarToggleItem,
  ToolbarLink,
  toolbarVariants,
};
