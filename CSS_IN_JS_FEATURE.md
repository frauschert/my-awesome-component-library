# CSS-in-JS Export Feature

## Overview

Your component library now exports **CSS-in-JS utilities** alongside the existing SCSS styling system. This allows users to:

1. Access design tokens programmatically in JavaScript/TypeScript
2. Create dynamic, theme-aware styles at runtime
3. Build custom components with full theme integration
4. Mix SCSS and CSS-in-JS approaches as needed

## What Was Added

### Core Files

#### `src/styles/tokens.ts` (350 lines)

-   Exports all design tokens as JavaScript constants
-   Includes: colors, typography, spacing, borders, shadows, breakpoints, z-index, transitions
-   Provides light and dark theme objects matching your SCSS themes
-   Fully typed with TypeScript

#### `src/styles/createStyles.ts` (260 lines)

-   `createStyles()` - Create theme-aware styles with props support
-   `responsive()` - Build responsive styles with breakpoint support
-   `pseudo()` - Add pseudo-selector styles (hover, focus, active, etc.)
-   `mergeStyles()` - Combine multiple style objects
-   `keyframes()` - Define CSS animations
-   `cssVar()`, `rem()`, `em()` - Utility functions
-   `styleObjectToCss()` - Convert style objects to CSS strings

#### `src/styles/useThemeStyles.ts` (50 lines)

-   `useThemeStyles()` - React hook for theme-aware styling
-   `useThemeMode()` - Get current theme mode from context

#### `src/styles/index.ts`

-   Main export file that re-exports all CSS-in-JS utilities
-   Exported from main `src/index.ts` via `export * from './styles'`

### Documentation

#### `src/styles/README.md` (450 lines)

-   Comprehensive documentation with examples
-   Quick start guide
-   API reference for all utilities
-   Best practices
-   Integration patterns

#### `EXAMPLES_CSS_IN_JS.tsx` (400 lines)

-   Complete working examples
-   8 different patterns demonstrated:
    1. Using design tokens directly
    2. Theme-aware components
    3. Dynamic styles with props
    4. Responsive styles
    5. Using hooks
    6. Merging styles
    7. Utility functions
    8. Complete AlertBox component

#### `src/styles/CSSinJS.stories.tsx` (350 lines)

-   Storybook stories showcasing CSS-in-JS features
-   Interactive demos of:
    -   Design tokens visualization
    -   Themed cards
    -   Responsive components
    -   Interactive buttons
    -   Dynamic styling
    -   Hook usage

### Tests

#### `src/styles/__tests__/tokens.test.ts` (180 lines)

-   15 comprehensive tests
-   All tests passing ✅
-   Coverage includes:
    -   Token exports
    -   Theme creation
    -   Style functions with props
    -   Responsive utilities
    -   Style merging
    -   Utility functions

## Build Output

The CSS-in-JS exports are properly included in the built library:

```
lib/
├── styles/
│   ├── index.d.ts         # Type definitions
│   ├── tokens.d.ts        # Design token types
│   ├── createStyles.d.ts  # Style utility types
│   └── useThemeStyles.d.ts # Hook types
├── index.js               # CJS bundle (includes styles)
├── index.esm.js           # ESM bundle (includes styles)
└── index.d.ts             # Main type definitions (exports * from './styles')
```

## Usage Examples

### Import Tokens

```typescript
import {
    tokens,
    colors,
    spacing,
    typography,
} from '@frauschert/my-awesome-component-library'

// Use tokens directly
;<div
    style={{
        backgroundColor: colors.primary.base,
        padding: spacing[6],
        fontSize: typography.fontSize.lg,
    }}
/>
```

### Create Theme-Aware Styles

```typescript
import { createStyles } from '@frauschert/my-awesome-component-library'

const cardStyles = createStyles((theme) => ({
  backgroundColor: theme.cardBackground,
  color: theme.textColor,
  border: `1px solid ${theme.borderColor}`,
  padding: '1rem',
  boxShadow: theme.boxShadow,
}), 'light')

<div style={cardStyles.toInlineStyles()}>Card content</div>
```

### Dynamic Styles with Props

```typescript
import { createStyles, type BaseTheme } from '@frauschert/my-awesome-component-library'

interface ButtonProps {
  variant: 'primary' | 'secondary'
}

const styles = createStyles((theme: BaseTheme, props?: ButtonProps) => ({
  backgroundColor: props?.variant === 'primary'
    ? theme.primaryColor
    : theme.backgroundColor,
  color: theme.textColor,
}), 'light')

<button style={styles.toInlineStyles({ variant: 'primary' })}>Click</button>
```

### Using React Hook

```typescript
import { useThemeStyles } from '@frauschert/my-awesome-component-library'

function MyComponent() {
    const { inlineStyles } = useThemeStyles(
        (theme) => ({
            backgroundColor: theme.primaryColor,
            padding: '1rem',
        }),
        'light'
    )

    return <div style={inlineStyles}>Content</div>
}
```

## API Reference

### Design Tokens

-   `tokens` - Default export with all tokens
-   `colors` - Color palette (primary, accent, success, error, etc.)
-   `contrast` - Contrast colors for light/dark backgrounds
-   `typography` - Font families, sizes, weights, line heights
-   `spacing` - Spacing scale (0-32)
-   `borderRadius` - Border radius values
-   `shadows` - Box shadow presets
-   `breakpoints` - Responsive breakpoints
-   `zIndex` - Z-index scale
-   `transitions` - Animation durations and timing functions

### Theme Objects

-   `themes` - Object containing light and dark themes
-   `lightTheme` - Light theme token values
-   `darkTheme` - Dark theme token values
-   `getThemeValue(theme, key)` - Helper to get theme value

### Style Functions

-   `createStyles(styleFn, theme)` - Create theme-aware styles
    -   `.getStyles(props)` - Get style object
    -   `.toCss(props, selector)` - Convert to CSS string
    -   `.toInlineStyles(props)` - Get React inline styles
-   `responsive({ base, sm, md, lg, xl, 2xl })` - Responsive styles
-   `pseudo({ base, hover, focus, active, ... })` - Pseudo-selector styles
-   `mergeStyles(...styles)` - Merge style objects
-   `keyframes(name, frames)` - Create CSS animation
-   `styleObjectToCss(styles, selector)` - Convert to CSS string

### Utilities

-   `cssVar(name, fallback?)` - Create CSS variable reference
-   `rem(px, base?)` - Convert px to rem
-   `em(px, base?)` - Convert px to em

### React Hooks

-   `useThemeStyles(styleFn, theme, props)` - Create styles in component
-   `useThemeMode()` - Get current theme mode

### TypeScript Types

-   `ThemeMode` - 'light' | 'dark'
-   `Theme` - Union of LightTheme and DarkTheme
-   `BaseTheme` - Common theme interface
-   `ThemeKey` - Keys of theme object
-   `StyleObject` - Style object type
-   `StyleFunction<T>` - Function that returns styles

## Integration with Existing Components

Your existing components continue to use SCSS for optimal performance and bundle size. The CSS-in-JS utilities are **additive** features that:

1. ✅ Don't break any existing components
2. ✅ Provide runtime styling flexibility
3. ✅ Enable theme-aware custom components
4. ✅ Allow mixing SCSS and CSS-in-JS
5. ✅ Export design tokens for consistency

## Performance Considerations

-   **SCSS**: Compiled at build time, minimal runtime cost, smaller bundles
    -   **Use for**: Component library internals
-   **CSS-in-JS**: Computed at runtime, provides flexibility
    -   **Use for**: Application-level customization, dynamic theming, user-created components

## Testing

All CSS-in-JS utilities are tested:

-   ✅ 15/15 tests passing
-   ✅ Token exports validated
-   ✅ Theme creation verified
-   ✅ Style functions with props tested
-   ✅ Responsive and pseudo utilities covered
-   ✅ Utility functions tested

## Build Verification

-   ✅ TypeScript compilation successful
-   ✅ Rollup build completes cleanly (13.8s)
-   ✅ Type definitions generated in `lib/styles/`
-   ✅ Exports properly included in main bundle
-   ✅ No circular dependencies
-   ✅ No build errors or warnings

## Future Enhancements

Possible additions:

1. CSS-in-JS adapter for styled-components or emotion
2. Runtime CSS injection utilities
3. Theme builder/customizer
4. Additional token categories (animations, etc.)
5. Design token sync with Figma

## Summary

Your library now provides a **complete styling solution**:

-   **50+ pre-built components** using SCSS (optimized, production-ready)
-   **Full design token access** for JavaScript/TypeScript (350+ tokens)
-   **Theme-aware styling utilities** for custom components
-   **Responsive and dynamic styling** support
-   **React hooks** for theme integration
-   **Type-safe API** with full TypeScript support
-   **Comprehensive documentation** and examples

Users can now:

1. Use your components directly (SCSS-based)
2. Access design tokens programmatically
3. Create custom components matching your design system
4. Build theme-aware applications
5. Mix static (SCSS) and dynamic (CSS-in-JS) styling as needed

The CSS-in-JS export fills a critical gap by enabling **runtime styling flexibility** without compromising the **performance benefits** of your SCSS-based components.
