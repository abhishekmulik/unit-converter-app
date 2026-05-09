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
  /** Label for the input */
  label: string;
  /** Placeholder text */
  placeholder?: string;
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
  label,
  placeholder = 'Enter value',
  className,
}: InputFieldProps) {
  const hasError = Boolean(error);
  
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Label htmlFor="converter-input" className="text-sm font-medium">
        {label}
      </Label>
      <Input
        id="converter-input"
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={hasError}
        aria-describedby={hasError ? 'input-error' : undefined}
        className={cn(
          'text-lg font-mono',
          hasError && 'border-destructive focus-visible:ring-destructive/50'
        )}
      />
      {hasError && (
        <p id="input-error" className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
