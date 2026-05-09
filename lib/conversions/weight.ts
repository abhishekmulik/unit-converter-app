    import type { ConversionCategory, UnitConfig } from './types';

/**
 * Weight/Mass units configuration.
 * Base unit: kilograms
 * 
 * Note: We use "weight" as the category name for user-friendliness,
 * though technically these are mass units.
 */
const units: UnitConfig[] = [
  {
    id: 'kilograms',
    label: 'Kilograms',
    symbol: 'kg',
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  {
    id: 'grams',
    label: 'Grams',
    symbol: 'g',
    toBase: (v) => v / 1000,
    fromBase: (v) => v * 1000,
  },
  {
    id: 'milligrams',
    label: 'Milligrams',
    symbol: 'mg',
    toBase: (v) => v / 1_000_000,
    fromBase: (v) => v * 1_000_000,
  },
  {
    id: 'metric-tons',
    label: 'Metric Tons',
    symbol: 't',
    toBase: (v) => v * 1000,
    fromBase: (v) => v / 1000,
  },
  {
    id: 'pounds',
    label: 'Pounds',
    symbol: 'lb',
    toBase: (v) => v * 0.45359237,
    fromBase: (v) => v / 0.45359237,
  },
  {
    id: 'ounces',
    label: 'Ounces',
    symbol: 'oz',
    toBase: (v) => v * 0.028349523125,
    fromBase: (v) => v / 0.028349523125,
  },
  {
    id: 'stones',
    label: 'Stones',
    symbol: 'st',
    toBase: (v) => v * 6.35029318,
    fromBase: (v) => v / 6.35029318,
  },
];

export const weightCategory: ConversionCategory = {
  id: 'weight',
  label: 'Weight',
  baseUnit: 'kilograms',
  units,
  allowNegative: false,
};
