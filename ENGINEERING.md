# Engineering Write-up: Unit Converter

## Overview

This document details the engineering approach, design decisions, challenges encountered, and improvements made during the development of the Unit Converter application.

---

## Approach

### Phase 1: Architecture Design

Before writing any code, I designed a config-driven architecture that separates concerns:

1. **Conversion Logic** (`lib/conversions/`) - Pure functions and configuration
2. **State Management** (`hooks/use-converter.ts`) - Centralized hook for all state
3. **UI Components** (`components/converter/`) - Controlled, presentational components

This separation ensures that adding new units requires zero changes to UI or state logic.

### Phase 2: Core Implementation

Built in feature-order to enable incremental testing:

1. Type definitions and conversion configs
2. Core conversion algorithm (via base unit)
3. State management hook with memoization
4. UI components with accessibility

### Phase 3: Polish and Edge Cases

Systematic review of edge cases, followed by targeted improvements to validation, UX, and documentation.

---

## Design Decisions

### 1. Base Unit Conversion Strategy

**Decision**: Each unit converts to/from a category's base unit (e.g., meters for length, Kelvin for temperature).

**Rationale**: 
- O(n) conversion functions vs O(n²) direct conversions
- Adding a unit = adding one config object
- Single point of truth for conversion accuracy

**Trade-off**: Slight precision loss from two-step conversion, mitigated by 6-decimal precision.

### 2. String Input Storage

**Decision**: Store input as string, not number.

**Rationale**:
- Allows typing partial input (`-`, `.`, `1.`) without immediate parse errors
- Avoids browser number input quirks
- Full control over validation messaging

**Trade-off**: Requires careful parsing before conversion.

### 3. Controlled Components with Centralized State

**Decision**: All form state lives in `useConverter` hook; components are purely controlled.

**Rationale**:
- Single source of truth
- Predictable data flow
- Enables comprehensive memoization
- Easier unit testing

### 4. No External State Library

**Decision**: Use React's built-in hooks only.

**Rationale**:
- App scope is small (single form)
- No cross-page state requirements
- Reduces bundle size and complexity
- Demonstrates core React patterns

---

## Challenges

### Challenge 1: Partial Input Validation

**Problem**: Users type `-` or `.` as intermediate steps. Immediate validation errors are annoying.

**Solution**: Validation recognizes partial patterns as "valid but incomplete" - no error shown, but conversion doesn't trigger until input is complete.

```typescript
// Allow typing without errors
if (trimmed === '-' || trimmed === '.' || /^[+-]?\d+\.$/.test(trimmed)) {
  return { isValid: true };
}
```

### Challenge 2: Temperature Edge Cases

**Problem**: Temperature has unique requirements:
- Negative values allowed (unlike length/weight)
- Absolute zero is a physical limit
- Different formulas (not simple ratios)

**Solution**: 
- `allowNegative` flag per category
- `validateTemperature()` function for absolute zero warnings
- Custom `toBase`/`fromBase` formulas handle offsets correctly

### Challenge 3: Floating-Point Precision

**Problem**: `0.1 + 0.2 = 0.30000000000000004`

**Solution**: `formatResult()` uses `toFixed(6)` then `parseFloat()` to remove trailing zeros while maintaining precision.

---

## Improvements Made

### Edge Case Handling

- Partial input recognition (no premature errors)
- Absolute zero warnings for temperature
- Scientific notation for extreme values
- Invalid character detection with regex

### UX Enhancements

- Auto-focus on input field
- Copy result to clipboard with visual feedback
- Keyboard shortcut (Ctrl+Shift+S) to swap units
- Tooltip showing shortcut hint
- Warning states (yellow border) distinct from errors (red)

### Accessibility

- `aria-invalid` on inputs with errors
- `aria-describedby` linking inputs to error/warning messages
- `aria-live="polite"` on result for screen reader announcements
- `role="alert"` on error messages
- Proper `<label>` associations

### Performance

- `useMemo` for validation, conversion, and derived state
- `useCallback` for action functions to prevent child re-renders
- O(1) category lookup with Map

---

## Code Quality

### Type Safety

- Strict TypeScript mode enabled
- No `any` types
- Explicit interface definitions
- Discriminated unions for category IDs

### Documentation

- JSDoc comments on all public functions
- Design decision comments in complex logic
- README with architecture, assumptions, and extensibility guide

### Testing Considerations

The architecture supports easy testing:
- Pure conversion functions are trivially testable
- Hook can be tested with `@testing-library/react-hooks`
- Components are controlled, making props-based testing straightforward

---

## Future Enhancements

If this were a production application, I would consider:

1. **Unit Tests**: Jest tests for conversion accuracy, validation logic
2. **E2E Tests**: Playwright tests for critical user flows
3. **History Feature**: localStorage for recent conversions
4. **Currency Category**: API-based conversion with caching
5. **PWA Support**: Offline capability for field use
6. **Internationalization**: RTL support, number formatting per locale

---

## Conclusion

This implementation demonstrates production-quality frontend engineering:

- **Scalable architecture** that grows without refactoring
- **Robust edge case handling** for real-world inputs
- **Accessible, polished UX** with attention to detail
- **Clean, documented code** that future developers can maintain

The config-driven approach means this codebase can support dozens of new units with minimal changes, while the centralized state management ensures predictable behavior across all user interactions.
