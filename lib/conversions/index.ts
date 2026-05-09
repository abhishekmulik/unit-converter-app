import { lengthCategory } from './length';
import { weightCategory } from './weight';
import { temperatureCategory } from './temperature';
import type { CategoryId, ConversionCategory, UnitConfig, ValidationResult } from './types';

// Re-export types for convenience
export type { CategoryId, ConversionCategory, UnitConfig, ValidationResult, ConversionResult } from './types';

/**
 * All available conversion categories.
 * Adding a new category is as simple as importing and adding it here.
 */
export const categories: ConversionCategory[] = [
  lengthCategory,
  weightCategory,
  temperatureCategory,
];

/**
 * Map for O(1) category lookup by ID.
 */
const categoryMap = new Map<CategoryId, ConversionCategory>(
  categories.map((cat) => [cat.id, cat])
);

/**
 * Get a category by its ID.
 * Returns undefined if not found.
 */
export function getCategory(id: CategoryId): ConversionCategory | undefined {
  return categoryMap.get(id);
}

/**
 * Get a unit from a category by unit ID.
 * Returns undefined if category or unit not found.
 */
export function getUnit(categoryId: CategoryId, unitId: string): UnitConfig | undefined {
  const category = getCategory(categoryId);
  return category?.units.find((u) => u.id === unitId);
}

/**
 * Default precision for formatting results.
 * 6 decimal places provides good precision for most conversions
 * while avoiding floating-point noise.
 */
const DEFAULT_PRECISION = 6;

/**
 * Core conversion function.
 * 
 * Algorithm:
 * 1. Convert input value to base unit using `from.toBase()`
 * 2. Convert base unit value to target unit using `to.fromBase()`
 * 
 * This two-step approach means we only need O(n) conversion functions
 * for n units, instead of O(n²) direct conversions.
 * 
 * @param value - The numeric value to convert
 * @param from - Source unit configuration
 * @param to - Target unit configuration
 * @returns The converted value
 */
export function convert(value: number, from: UnitConfig, to: UnitConfig): number {
  // Step 1: Convert to base unit
  const baseValue = from.toBase(value);
  
  // Step 2: Convert from base unit to target
  const result = to.fromBase(baseValue);
  
  return result;
}

/**
 * Format a conversion result for display.
 * Removes unnecessary trailing zeros while maintaining precision.
 * 
 * @param value - The numeric value to format
 * @param precision - Number of decimal places (default: 6)
 * @returns Formatted string
 */
export function formatResult(value: number, precision: number = DEFAULT_PRECISION): string {
  // Handle edge cases
  if (!Number.isFinite(value)) {
    return value.toString();
  }
  
  // Use toFixed for consistent decimal places, then parseFloat to remove trailing zeros
  const fixed = value.toFixed(precision);
  const parsed = parseFloat(fixed);
  
  // If the number is very large or very small, use exponential notation
  if (Math.abs(parsed) >= 1e9 || (Math.abs(parsed) < 1e-6 && parsed !== 0)) {
    return parsed.toExponential(precision);
  }
  
  return parsed.toString();
}

/**
 * Validate numeric input.
 * 
 * Handles edge cases:
 * - Empty input: valid (shows placeholder)
 * - Partial input ("-", ".", "1."): valid but won't trigger conversion
 * - Invalid characters: clear error message
 * - Overflow values: warns about size
 * - Negative values: context-dependent based on category
 * 
 * @param input - Raw string input from user
 * @param allowNegative - Whether negative values are permitted
 * @returns Validation result with error message if invalid
 */
export function validateInput(input: string, allowNegative: boolean): ValidationResult {
  const trimmed = input.trim();
  
  // Empty input is valid (just shows no result)
  if (trimmed === '') {
    return { isValid: true };
  }
  
  // Allow partial input while typing (these are "valid" but won't convert)
  // This prevents annoying errors when user is mid-typing
  if (trimmed === '-' || trimmed === '.' || trimmed === '-.' || 
      trimmed === '+' || trimmed === '+.') {
    return { isValid: true }; // Valid syntax, just incomplete
  }
  
  // Check for trailing decimal (e.g., "123.")
  if (/^[+-]?\d+\.$/.test(trimmed)) {
    return { isValid: true }; // User is typing decimals
  }
  
  // Check for invalid characters (anything not a number, +/-, decimal, or e/E for scientific)
  if (!/^[+-]?(\d+\.?\d*|\d*\.?\d+)([eE][+-]?\d+)?$/.test(trimmed)) {
    return { isValid: false, error: 'Please enter a valid number' };
  }
  
  // Check for valid number format
  const value = parseFloat(trimmed);
  
  if (isNaN(value)) {
    return { isValid: false, error: 'Please enter a valid number' };
  }
  
  if (!Number.isFinite(value)) {
    return { isValid: false, error: 'Value is too large or too small' };
  }
  
  // Check for extremely large values that might cause display issues
  if (Math.abs(value) > Number.MAX_SAFE_INTEGER) {
    // Still valid, but will use scientific notation
    return { isValid: true };
  }
  
  // Check for negative values when not allowed
  if (!allowNegative && value < 0) {
    return { isValid: false, error: 'Negative values are not allowed for this unit type' };
  }
  
  return { isValid: true };
}

/**
 * Parse input string to number.
 * Returns null for empty or invalid input.
 */
export function parseInput(input: string): number | null {
  const trimmed = input.trim();
  if (trimmed === '') return null;
  
  const value = parseFloat(trimmed);
  return isNaN(value) ? null : value;
}

/**
 * Absolute zero constants for temperature validation.
 */
const ABSOLUTE_ZERO = {
  kelvin: 0,
  celsius: -273.15,
  fahrenheit: -459.67,
} as const;

/**
 * Validate temperature against absolute zero.
 * Returns a warning if below absolute zero (physically impossible).
 * 
 * @param value - The numeric value
 * @param unitId - The temperature unit ID
 * @returns Warning message or null if valid
 */
export function validateTemperature(value: number, unitId: string): string | null {
  const minTemp = ABSOLUTE_ZERO[unitId as keyof typeof ABSOLUTE_ZERO];
  
  if (minTemp !== undefined && value < minTemp) {
    return `Temperature cannot be below absolute zero (${minTemp}${unitId === 'kelvin' ? 'K' : unitId === 'celsius' ? '°C' : '°F'})`;
  }
  
  return null;
}
