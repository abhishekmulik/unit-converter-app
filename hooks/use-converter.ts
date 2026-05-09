'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  categories,
  convert,
  formatResult,
  validateInput,
  validateTemperature,
  parseInput,
  getCategory,
  getUnit,
  type CategoryId,
  type UnitConfig,
} from '@/lib/conversions';

/**
 * State shape for the converter.
 */
interface ConverterState {
  category: CategoryId;
  inputValue: string;
  fromUnitId: string;
  toUnitId: string;
}

/**
 * Return type of the useConverter hook.
 * Provides all state, derived values, and actions needed by the UI.
 */
interface UseConverterReturn {
  // State
  category: CategoryId;
  inputValue: string;
  fromUnitId: string;
  toUnitId: string;
  
  // Derived values
  availableCategories: typeof categories;
  availableUnits: UnitConfig[];
  fromUnit: UnitConfig | undefined;
  toUnit: UnitConfig | undefined;
  result: string | null;
  error: string | null;
  warning: string | null;
  isValid: boolean;
  
  // Actions
  setCategory: (category: CategoryId) => void;
  setInputValue: (value: string) => void;
  setFromUnit: (unitId: string) => void;
  setToUnit: (unitId: string) => void;
  swapUnits: () => void;
}

/**
 * Get default units for a category.
 * Returns [firstUnit, secondUnit] or fallback to first unit for both.
 */
function getDefaultUnits(categoryId: CategoryId): [string, string] {
  const category = getCategory(categoryId);
  if (!category || category.units.length === 0) {
    return ['', ''];
  }
  
  const first = category.units[0].id;
  const second = category.units.length > 1 ? category.units[1].id : first;
  
  return [first, second];
}

/**
 * Custom hook for unit conversion logic.
 * 
 * Design decisions:
 * 1. inputValue is stored as string to allow partial input (e.g., "-", "1.")
 * 2. Validation runs on every change but doesn't block input
 * 3. Result is computed only when input is valid and non-empty
 * 4. useMemo prevents unnecessary recalculations
 * 
 * @param initialCategory - Starting category (default: 'length')
 */
export function useConverter(initialCategory: CategoryId = 'length'): UseConverterReturn {
  // Get initial units for the starting category
  const [initialFrom, initialTo] = getDefaultUnits(initialCategory);
  
  // Core state
  const [state, setState] = useState<ConverterState>({
    category: initialCategory,
    inputValue: '',
    fromUnitId: initialFrom,
    toUnitId: initialTo,
  });
  
  // Memoized category lookup
  const currentCategory = useMemo(
    () => getCategory(state.category),
    [state.category]
  );
  
  // Memoized unit lookups
  const fromUnit = useMemo(
    () => getUnit(state.category, state.fromUnitId),
    [state.category, state.fromUnitId]
  );
  
  const toUnit = useMemo(
    () => getUnit(state.category, state.toUnitId),
    [state.category, state.toUnitId]
  );
  
  // Memoized validation
  const validation = useMemo(() => {
    const allowNegative = currentCategory?.allowNegative ?? false;
    return validateInput(state.inputValue, allowNegative);
  }, [state.inputValue, currentCategory?.allowNegative]);
  
  // Memoized temperature warning (only for temperature category)
  const warning = useMemo(() => {
    if (state.category !== 'temperature') return null;
    
    const parsed = parseInput(state.inputValue);
    if (parsed === null) return null;
    
    return validateTemperature(parsed, state.fromUnitId);
  }, [state.category, state.inputValue, state.fromUnitId]);
  
  // Memoized conversion result
  const result = useMemo(() => {
    // Don't compute if invalid or empty
    if (!validation.isValid || state.inputValue.trim() === '') {
      return null;
    }
    
    const parsed = parseInput(state.inputValue);
    if (parsed === null || !fromUnit || !toUnit) {
      return null;
    }
    
    const converted = convert(parsed, fromUnit, toUnit);
    return formatResult(converted);
  }, [state.inputValue, validation.isValid, fromUnit, toUnit]);
  
  // Actions
  const setCategory = useCallback((category: CategoryId) => {
    const [newFrom, newTo] = getDefaultUnits(category);
    setState((prev) => ({
      ...prev,
      category,
      fromUnitId: newFrom,
      toUnitId: newTo,
      // Optionally clear input on category change for cleaner UX
      // inputValue: '',
    }));
  }, []);
  
  const setInputValue = useCallback((value: string) => {
    setState((prev) => ({ ...prev, inputValue: value }));
  }, []);
  
  const setFromUnit = useCallback((unitId: string) => {
    setState((prev) => ({ ...prev, fromUnitId: unitId }));
  }, []);
  
  const setToUnit = useCallback((unitId: string) => {
    setState((prev) => ({ ...prev, toUnitId: unitId }));
  }, []);
  
  const swapUnits = useCallback(() => {
    setState((prev) => ({
      ...prev,
      fromUnitId: prev.toUnitId,
      toUnitId: prev.fromUnitId,
    }));
  }, []);
  
  return {
    // State
    category: state.category,
    inputValue: state.inputValue,
    fromUnitId: state.fromUnitId,
    toUnitId: state.toUnitId,
    
    // Derived values
    availableCategories: categories,
    availableUnits: currentCategory?.units ?? [],
    fromUnit,
    toUnit,
    result,
    error: validation.error ?? null,
    warning,
    isValid: validation.isValid,
    
    // Actions
    setCategory,
    setInputValue,
    setFromUnit,
    setToUnit,
    swapUnits,
  };
}
