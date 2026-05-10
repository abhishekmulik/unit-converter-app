"use client";

import { memo } from "react";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
 * - Visual feedback through hover/active states
 */
function SwapButton({ onSwap, className }: SwapButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onSwap}
            aria-label="Swap units"
            className={cn(
              "shrink-0 transition-transform hover:scale-105 cursor-pointer",
              className,
            )}
          >
            <ArrowUpDown className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Swap units</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default memo(SwapButton);
