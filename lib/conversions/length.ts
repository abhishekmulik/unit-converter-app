import type { ConversionCategory, UnitConfig } from './types';

/**
 * Length units configuration.
 * Base unit: meters
 * 
 * All conversions go through meters as the intermediate unit.
 * This ensures O(n) complexity for adding new units instead of O(n²).
 */
const units: UnitConfig[] = [
  {
    id: 'meters',
    label: 'Meters',
    symbol: 'm',
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  {
    id: 'kilometers',
    label: 'Kilometers',
    symbol: 'km',
    toBase: (v) => v * 1000,
    fromBase: (v) => v / 1000,
  },
  {
    id: 'centimeters',
    label: 'Centimeters',
    symbol: 'cm',
    toBase: (v) => v / 100,
    fromBase: (v) => v * 100,
  },
  {
    id: 'millimeters',
    label: 'Millimeters',
    symbol: 'mm',
    toBase: (v) => v / 1000,
    fromBase: (v) => v * 1000,
  },
  {
    id: 'miles',
    label: 'Miles',
    symbol: 'mi',
    toBase: (v) => v * 1609.344,
    fromBase: (v) => v / 1609.344,
  },
  {
    id: 'yards',
    label: 'Yards',
    symbol: 'yd',
    toBase: (v) => v * 0.9144,
    fromBase: (v) => v / 0.9144,
  },
  {
    id: 'feet',
    label: 'Feet',
    symbol: 'ft',
    toBase: (v) => v * 0.3048,
    fromBase: (v) => v / 0.3048,
  },
  {
    id: 'inches',
    label: 'Inches',
    symbol: 'in',
    toBase: (v) => v * 0.0254,
    fromBase: (v) => v / 0.0254,
  },
];

export const lengthCategory: ConversionCategory = {
  id: 'length',
  label: 'Length',
  baseUnit: 'meters',
  units,
  allowNegative: false,
};
