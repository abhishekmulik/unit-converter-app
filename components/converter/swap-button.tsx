'use client';

import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SwapButtonProps {
  /** Callback when swap is triggered */
  onSwap: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Button to swap the from/to units.
 * 
 * Uses an icon-only button with proper aria-label for accessibility.
 * Provides visual feedback through hover/active states.
 */
export function SwapButton({ onSwap, className }: SwapButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={onSwap}
      aria-label="Swap units"
      className={cn('shrink-0', className)}
    >
      <ArrowUpDown className="size-4" />
    </Button>
  );
}
