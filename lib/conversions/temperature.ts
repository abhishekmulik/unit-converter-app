import type { ConversionCategory, UnitConfig } from './types';

/**
 * Temperature units configuration.
 * Base unit: Kelvin (chosen because it's the SI unit and has no negative values)
 * 
 * Temperature conversions are NOT simple multiplication like length/weight.
 * Each formula must account for offset (e.g., Celsius 0° = 273.15K).
 */
const units: UnitConfig[] = [
  {
    id: 'kelvin',
    label: 'Kelvin',
    symbol: 'K',
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  {
    id: 'celsius',
    label: 'Celsius',
    symbol: '°C',
    // Celsius to Kelvin: K = C + 273.15
    toBase: (v) => v + 273.15,
    // Kelvin to Celsius: C = K - 273.15
    fromBase: (v) => v - 273.15,
  },
  {
    id: 'fahrenheit',
    label: 'Fahrenheit',
    symbol: '°F',
    // Fahrenheit to Kelvin: K = (F - 32) × 5/9 + 273.15
    toBase: (v) => ((v - 32) * 5) / 9 + 273.15,
    // Kelvin to Fahrenheit: F = (K - 273.15) × 9/5 + 32
    fromBase: (v) => ((v - 273.15) * 9) / 5 + 32,
  },
];

export const temperatureCategory: ConversionCategory = {
  id: 'temperature',
  label: 'Temperature',
  baseUnit: 'kelvin',
  units,
  allowNegative: true, // Celsius and Fahrenheit can be negative
};
