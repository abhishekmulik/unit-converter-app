'use client';

import { useEffect } from 'react';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SwapButtonProps {
  /** Callback when swap is triggered */
  onSwap: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Button to swap the from/to units.
 * 
 * Features:
 * - Icon-only button with proper aria-label for accessibility
 * - Keyboard shortcut (Ctrl/Cmd + S) for power users
 * - Tooltip showing the shortcut hint
 * - Visual feedback through hover/active states
 */
export function SwapButton({ onSwap, className }: SwapButtonProps) {
  // Keyboard shortcut: Ctrl/Cmd + Shift + S to swap units
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 's') {
        e.preventDefault();
        onSwap();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSwap]);
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onSwap}
            aria-label="Swap units (Ctrl+Shift+S)"
            className={cn('shrink-0 transition-transform hover:scale-105', className)}
          >
            <ArrowUpDown className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Swap units <kbd className="ml-1 rounded bg-muted px-1 py-0.5 text-xs">Ctrl+Shift+S</kbd></p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
