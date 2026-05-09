'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface InputFieldProps {
  /** Current input value (controlled) */
  value: string;
  /** Callback when value changes */
  onChange: (value: string) => void;
  /** Error message to display (if any) */
  error?: string | null;
  /** Warning message to display (if any) */
  warning?: string | null;
  /** Label for the input */
  label: string;
  /** Placeholder text */
  placeholder?: string;
  /** Whether to auto-focus on mount */
  autoFocus?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Numeric input field with validation feedback.
 * 
 * Design decisions:
 * 1. Uses type="text" instead of type="number" for better UX:
 *    - Allows typing "-" and "." without the browser blocking
 *    - Avoids browser-specific number input quirks
 *    - We handle validation ourselves for more control
 * 2. inputMode="decimal" shows numeric keyboard on mobile
 * 3. Error state shown via aria-invalid for accessibility
 */
export function InputField({
  value,
  onChange,
  error,
  warning,
  label,
  placeholder = 'Enter value',
  autoFocus = false,
  className,
}: InputFieldProps) {
  const hasError = Boolean(error);
  const hasWarning = Boolean(warning) && !hasError;
  const feedbackId = hasError ? 'input-error' : hasWarning ? 'input-warning' : undefined;
  
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Label htmlFor="converter-input" className="text-sm font-medium">
        {label}
      </Label>
      <Input
        id="converter-input"
        type="text"
        inputMode="decimal"
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={hasError}
        aria-describedby={feedbackId}
        className={cn(
          'text-lg font-mono',
          hasError && 'border-destructive focus-visible:ring-destructive/50',
          hasWarning && 'border-yellow-500 focus-visible:ring-yellow-500/50'
        )}
      />
      {/* Reserved space for feedback message to prevent layout shift */}
      <div className="min-h-5">
        {hasError && (
          <p id="input-error" className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        {hasWarning && (
          <p id="input-warning" className="text-sm text-yellow-600 dark:text-yellow-500" role="status">
            {warning}
          </p>
        )}
      </div>
    </div>
  );
}
