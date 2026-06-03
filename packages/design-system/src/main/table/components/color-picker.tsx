import { cn } from "../../../lib/utils";
import { CELL_COLORS } from "../constants";

export function ColorPicker({
  onSelect,
}: {
  onSelect: (color: string | null) => void;
}) {
  return (
    <div className="grid grid-cols-5 gap-1 p-1">
      {CELL_COLORS.map((c) => (
        <button
          key={c.label}
          title={c.label}
          className={cn(
            "size-5 cursor-pointer rounded ring-offset-1 transition-shadow hover:ring-2 hover:ring-ring",
            !c.cssVar && "bg-background border"
          )}
          style={c.cssVar ? { backgroundColor: `var(${c.cssVar})` } : undefined}
          onClick={() => onSelect(c.cssVar ? `var(${c.cssVar})` : null)}
        />
      ))}
    </div>
  );
}
