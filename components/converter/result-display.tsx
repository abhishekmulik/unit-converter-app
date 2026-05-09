import { cn } from '@/lib/utils';
import type { UnitConfig } from '@/lib/conversions';

interface ResultDisplayProps {
  /** Formatted result value (or null if no result) */
  value: string | null;
  /** Target unit for display */
  unit?: UnitConfig;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Displays the conversion result with unit symbol.
 * 
 * Shows a placeholder when no result is available.
 * Uses monospace font for numeric values to aid readability.
 */
export function ResultDisplay({ value, unit, className }: ResultDisplayProps) {
  const hasResult = value !== null && unit;
  
  return (
    <div
      className={cn(
        'flex flex-col gap-2 rounded-lg bg-muted/50 p-4',
        className
      )}
      role="region"
      aria-label="Conversion result"
      aria-live="polite"
    >
      <span className="text-sm font-medium text-muted-foreground">Result</span>
      {hasResult ? (
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-mono font-semibold text-foreground">
            {value}
          </span>
          <span className="text-lg text-muted-foreground">
            {unit.symbol}
          </span>
        </div>
      ) : (
        <span className="text-2xl font-mono text-muted-foreground/50">
          —
        </span>
      )}
    </div>
  );
}
