'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { CategoryId, ConversionCategory } from '@/lib/conversions';

interface CategoryTabsProps {
  /** Currently selected category */
  value: CategoryId;
  /** Callback when category changes */
  onChange: (category: CategoryId) => void;
  /** Available categories to display */
  categories: ConversionCategory[];
}

/**
 * Tab navigation for switching between conversion categories.
 * 
 * This is a controlled component - it receives value and onChange from parent.
 * The parent (useConverter hook) handles resetting units when category changes.
 */
export function CategoryTabs({ value, onChange, categories }: CategoryTabsProps) {
  return (
    <Tabs
      value={value}
      onValueChange={(v) => onChange(v as CategoryId)}
      className="w-full"
    >
      <TabsList className="w-full">
        {categories.map((category) => (
          <TabsTrigger
            key={category.id}
            value={category.id}
            className="flex-1"
          >
            {category.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
