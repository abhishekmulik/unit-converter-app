'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { UnitConfig } from '@/lib/conversions';

interface UnitSelectorProps {
  /** Currently selected unit ID */
  value: string;
  /** Callback when unit selection changes */
  onChange: (unitId: string) => void;
  /** Available units to display in dropdown */
  units: UnitConfig[];
  /** Accessible label for the selector */
  label: string;
  /** Placeholder text when no selection */
  placeholder?: string;
}

/**
 * Dropdown selector for choosing a unit.
 * 
 * Displays unit label with symbol for clarity.
 * Uses shadcn Select component for consistent styling.
 */
export function UnitSelector({
  value,
  onChange,
  units,
  label,
  placeholder = 'Select unit',
}: UnitSelectorProps) {
  // Find the currently selected unit for display
  const selectedUnit = units.find((u) => u.id === value);
  
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full" aria-label={label}>
        <SelectValue placeholder={placeholder}>
          {selectedUnit && (
            <span>
              {selectedUnit.label}{' '}
              <span className="text-muted-foreground">({selectedUnit.symbol})</span>
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {units.map((unit) => (
          <SelectItem key={unit.id} value={unit.id}>
            {unit.label}{' '}
            <span className="text-muted-foreground">({unit.symbol})</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
