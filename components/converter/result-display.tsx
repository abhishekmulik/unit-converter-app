'use client';

import { useState, useCallback } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
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
 * Features:
 * - Shows a placeholder when no result is available
 * - Uses monospace font for numeric values to aid readability
 * - Copy to clipboard functionality with visual feedback
 * - Accessible with proper ARIA attributes
 */
export function ResultDisplay({ value, unit, className }: ResultDisplayProps) {
  const [copied, setCopied] = useState(false);
  const hasResult = value !== null && unit;
  
  const copyToClipboard = useCallback(async () => {
    if (!value) return;
    
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      console.error('Failed to copy:', err);
    }
  }, [value]);
  
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
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">Result</span>
        {hasResult && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            aria-label={copied ? 'Copied!' : 'Copy result'}
            className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            {copied ? (
              <>
                <Check className="size-3.5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="size-3.5" />
                <span>Copy</span>
              </>
            )}
          </Button>
        )}
      </div>
      {/* Fixed height container to prevent layout shift */}
      <div className="h-8 flex items-baseline">
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
    </div>
  );
}
