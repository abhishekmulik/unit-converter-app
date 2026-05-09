# Unit Converter

A production-quality, real-time unit converter built with Next.js 16, React 19, and TypeScript. Supports Length, Weight, and Temperature conversions with instant feedback and robust edge case handling.

## Features

- **Real-time conversion** - Results update instantly as you type
- **Config-driven architecture** - Add new units by adding config objects, no logic changes needed
- **Type-safe** - Full TypeScript coverage with strict mode
- **Accessible** - ARIA attributes, keyboard navigation, screen reader support
- **Edge case handling** - Graceful handling of negative temperatures, very large numbers, and invalid inputs
- **UX polish** - Copy to clipboard, keyboard shortcuts, responsive design

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run production build
pnpm start
```

## Architecture

### Folder Structure

```
lib/
├── conversions/
│   ├── types.ts        # Type definitions
│   ├── length.ts       # Length units config
│   ├── weight.ts       # Weight units config
│   ├── temperature.ts  # Temperature units config
│   └── index.ts        # Core conversion logic

components/
└── converter/
    ├── converter-form.tsx  # Main form orchestrator
    ├── category-tabs.tsx   # Category selection
    ├── unit-selector.tsx   # Unit dropdown
    ├── input-field.tsx     # Validated input
    ├── result-display.tsx  # Result with copy
    └── swap-button.tsx     # Swap from/to

hooks/
└── use-converter.ts    # State management hook
```

### Design Decisions

#### 1. Config-Driven Conversions

Each unit defines `toBase` and `fromBase` functions:

```typescript
{
  id: 'celsius',
  label: 'Celsius',
  symbol: '°C',
  toBase: (v) => v + 273.15,      // to Kelvin
  fromBase: (v) => v - 273.15,    // from Kelvin
}
```

**Why?** O(n) complexity instead of O(n²). Adding a new unit requires only adding a config object.

#### 2. String Input Storage

Input is stored as a raw string, not a number:

```typescript
const [inputValue, setInputValue] = useState('');
```

**Why?** Allows partial input like `-`, `.`, `1.` without parse errors while typing.

#### 3. Controlled Components

All child components are controlled - they receive props and emit events:

```typescript
<InputField
  value={inputValue}
  onChange={setInputValue}
  error={error}
/>
```

**Why?** Single source of truth in the hook, predictable data flow, easier testing.

#### 4. Memoized Derived State

Validation and conversion results are memoized:

```typescript
const result = useMemo(() => {
  // Only recomputes when dependencies change
}, [inputValue, fromUnit, toUnit]);
```

**Why?** Prevents unnecessary recalculations on unrelated state changes.

### Conversion Strategy

1. **Parse input** - Convert string to number, handle edge cases
2. **Validate** - Check for negative values, absolute zero, overflow
3. **Convert to base unit** - Using `fromUnit.toBase(value)`
4. **Convert to target unit** - Using `toUnit.fromBase(baseValue)`
5. **Format result** - Remove trailing zeros, use scientific notation for extremes

## Edge Cases Handled

| Case | Behavior |
|------|----------|
| Empty input | Shows placeholder, no error |
| Partial input (`-`, `.`) | Valid syntax, waits for completion |
| Invalid characters | Clear error message |
| Very large numbers | Scientific notation |
| Negative temperatures | Allowed with absolute zero warning |
| Same from/to unit | Identity conversion (shows same value) |
| Category switch | Resets units to category defaults |

## Assumptions

- **Precision**: Results rounded to 6 decimal places
- **Negative values**: Allowed for temperature, blocked for length/weight
- **Absolute zero**: Warning shown, conversion still computed
- **Scientific notation**: Used for values ≥1e9 or <1e-6
- **No persistence**: Stateless app, values not saved

## Tradeoffs

| Decision | Trade-off |
|----------|-----------|
| Client-side only | Instant response, but no server validation |
| No debounce | Smooth UX, but more compute on rapid typing |
| String input | Better partial input UX, but requires careful parsing |
| Base unit intermediary | O(n) complexity, but slight precision loss possible |

## Scalability

### Adding New Units

1. Add unit config to `lib/conversions/{category}.ts`
2. Done - UI automatically picks it up

### Adding New Categories

1. Create `lib/conversions/{category}.ts`
2. Export category in `lib/conversions/index.ts`
3. Done - tabs and dropdowns update automatically

### Extensibility Hooks

The architecture supports future enhancements:
- Custom formatters per unit
- Precision control per category
- Unit grouping (Metric vs Imperial)
- Favorites/history (localStorage)
- API-based conversions (currency)

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: React hooks (no external state library)

## License

MIT
