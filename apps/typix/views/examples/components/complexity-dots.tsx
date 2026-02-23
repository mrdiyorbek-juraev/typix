import type { ExampleComplexity } from "../data";

const levels: Record<ExampleComplexity, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
};

interface ComplexityDotsProps {
  complexity?: ExampleComplexity;
}

export function ComplexityDots({ complexity }: ComplexityDotsProps) {
  const filled = complexity ? levels[complexity] : 0;
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3].map((n) => (
        <span
          key={n}
          className={`inline-block h-1.5 w-1.5 rounded-full ${
            n <= filled ? "bg-emerald-500" : "bg-muted-foreground/30"
          }`}
        />
      ))}
      {complexity && (
        <span className="ml-1 text-[10px] text-muted-foreground capitalize">
          {complexity}
        </span>
      )}
    </div>
  );
}
