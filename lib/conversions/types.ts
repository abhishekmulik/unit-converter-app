/**
 * Represents a single unit within a conversion category.
 * Each unit knows how to convert to/from the category's base unit.
 */
export interface UnitConfig {
  /** Unique identifier for the unit (e.g., 'meters', 'celsius') */
  id: string;
  /** Human-readable label (e.g., 'Meters', 'Celsius') */
  label: string;
  /** Unit symbol for display (e.g., 'm', '°C') */
  symbol: string;
  /** Convert a value in this unit TO the base unit */
  toBase: (value: number) => number;
  /** Convert a value FROM the base unit to this unit */
  fromBase: (value: number) => number;
}

/**
 * Represents a category of related units (e.g., Length, Weight, Temperature).
 */
export interface ConversionCategory {
  /** Unique identifier for the category */
  id: CategoryId;
  /** Human-readable label */
  label: string;
  /** The base unit used for intermediate conversions */
  baseUnit: string;
  /** Array of units in this category */
  units: UnitConfig[];
  /** Whether negative values are allowed (e.g., true for temperature) */
  allowNegative: boolean;
}

/**
 * Supported category identifiers.
 * Using a union type ensures compile-time safety when referencing categories.
 */
export type CategoryId = 'length' | 'weight' | 'temperature';

/**
 * Result of a validation operation.
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Result of a conversion operation.
 */
export interface ConversionResult {
  /** The converted numeric value */
  value: number;
  /** Formatted string representation */
  formatted: string;
  /** Source unit configuration */
  fromUnit: UnitConfig;
  /** Target unit configuration */
  toUnit: UnitConfig;
}
