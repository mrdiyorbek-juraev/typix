"use client";

type ToolbarButtonProps = {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md";
};

export function ToolbarButton({
  onClick,
  active,
  title,
  children,
  size = "sm",
}: ToolbarButtonProps) {
  return (
    <button
      className={[
        "inline-flex items-center justify-center rounded-md transition-all",
        "hover:bg-accent",
        size === "sm" ? "h-7 w-7" : "h-8 w-8",
        active ? "bg-primary/10 text-primary hover:bg-primary/20" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={onClick}
      title={title}
      type="button"
    >
      {children}
    </button>
  );
}

export function ToolbarDivider() {
  return <div className="mx-1.5 h-5 w-px bg-border/60" />;
}
