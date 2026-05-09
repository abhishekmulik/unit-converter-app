'use client';

import { useConverter } from '@/hooks/use-converter';
import { CategoryTabs } from './category-tabs';
import { UnitSelector } from './unit-selector';
import { InputField } from './input-field';
import { ResultDisplay } from './result-display';
import { SwapButton } from './swap-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

/**
 * Main converter form that orchestrates all conversion UI.
 * 
 * This component:
 * 1. Uses the useConverter hook for all state management
 * 2. Passes props down to controlled child components
 * 3. Handles layout and visual hierarchy
 * 
 * The form does NOT have a submit button - conversions happen in real-time.
 */
export function ConverterForm() {
  const {
    category,
    inputValue,
    fromUnitId,
    toUnitId,
    availableCategories,
    availableUnits,
    fromUnit,
    toUnit,
    result,
    error,
    warning,
    setCategory,
    setInputValue,
    setFromUnit,
    setToUnit,
    swapUnits,
  } = useConverter('length');
  
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl">Unit Converter</CardTitle>
        <CardDescription>
          Convert between different units of measurement
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {/* Category Selection */}
        <CategoryTabs
          value={category}
          onChange={setCategory}
          categories={availableCategories}
        />
        
        {/* Input Value */}
        <InputField
          value={inputValue}
          onChange={setInputValue}
          error={error}
          warning={warning}
          label="Value"
          placeholder="Enter a number"
          autoFocus
        />
        
        {/* Unit Selection Row */}
        <div className="flex flex-col gap-4">
          {/* From Unit */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">From</Label>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <UnitSelector
                  value={fromUnitId}
                  onChange={setFromUnit}
                  units={availableUnits}
                  label="Convert from unit"
                />
              </div>
            </div>
          </div>
          
          {/* Swap Button */}
          <div className="flex justify-center">
            <SwapButton onSwap={swapUnits} />
          </div>
          
          {/* To Unit */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">To</Label>
            <UnitSelector
              value={toUnitId}
              onChange={setToUnit}
              units={availableUnits}
              label="Convert to unit"
            />
          </div>
        </div>
        
        {/* Result Display */}
        <ResultDisplay value={result} unit={toUnit} />
      </CardContent>
    </Card>
  );
}
