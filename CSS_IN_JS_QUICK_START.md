# CSS-in-JS Quick Start Guide

## Installation

If using from the built library:

```bash
npm install @frauschert/my-awesome-component-library
```

## Basic Usage

### 1. Import Design Tokens

```typescript
import {
    colors,
    spacing,
    typography,
} from '@frauschert/my-awesome-component-library'

;<div
    style={{
        backgroundColor: colors.primary.base,
        padding: spacing[6],
        fontSize: typography.fontSize.lg,
    }}
/>
```

### 2. Create Theme-Aware Styles

```typescript
import { createStyles, type BaseTheme } from '@frauschert/my-awesome-component-library'

const styles = createStyles((theme: BaseTheme) => ({
  backgroundColor: theme.cardBackground,
  color: theme.textColor,
  padding: '1rem',
}), 'light')

<div style={styles.toInlineStyles()}>Content</div>
```

### 3. Dynamic Styles with Props

```typescript
import { createStyles, tokens } from '@frauschert/my-awesome-component-library'

interface ButtonProps {
    variant: 'primary' | 'secondary'
}

const Button = ({ variant }: ButtonProps) => {
    const styles = createStyles(
        (theme, props?: ButtonProps) => ({
            backgroundColor:
                props?.variant === 'primary'
                    ? theme.primaryColor
                    : theme.backgroundColor,
            padding: tokens.spacing[4],
        }),
        'light'
    )

    return <button style={styles.toInlineStyles({ variant })}>Click</button>
}
```

### 4. Use React Hook

```typescript
import { useThemeStyles } from '@frauschert/my-awesome-component-library'

function MyComponent() {
    const { inlineStyles } = useThemeStyles(
        (theme) => ({
            backgroundColor: theme.primaryColor,
            color: theme.primaryTextColor,
        }),
        'light'
    )

    return <div style={inlineStyles}>Themed content</div>
}
```

## Available Exports

### Design Tokens

-   `tokens` - All tokens in one object
-   `colors` - Color palette
-   `typography` - Font settings
-   `spacing` - Spacing scale
-   `borderRadius` - Border radii
-   `shadows` - Box shadows
-   `breakpoints` - Responsive breakpoints
-   `zIndex` - Z-index layers
-   `transitions` - Animation settings

### Themes

-   `lightTheme` - Light theme values
-   `darkTheme` - Dark theme values
-   `themes` - Both themes in object

### Style Utilities

-   `createStyles()` - Create theme-aware styles
-   `responsive()` - Responsive breakpoint styles
-   `pseudo()` - Pseudo-selector styles
-   `mergeStyles()` - Combine style objects
-   `keyframes()` - Define animations

### Helpers

-   `rem(px)` - Convert px to rem
-   `em(px)` - Convert px to em
-   `cssVar(name)` - Create CSS variable

### React Hooks

-   `useThemeStyles()` - Theme-aware styling hook
-   `useThemeMode()` - Get current theme mode

## Common Patterns

### Responsive Component

```typescript
import { responsive, tokens } from '@frauschert/my-awesome-component-library'

const styles = responsive({
    base: { padding: tokens.spacing[4] },
    md: { padding: tokens.spacing[6] },
    lg: { padding: tokens.spacing[8] },
})
```

### Interactive Button

```typescript
import {
    pseudo,
    tokens,
    colors,
} from '@frauschert/my-awesome-component-library'

const buttonStyles = pseudo({
    base: {
        backgroundColor: colors.primary.base,
        padding: tokens.spacing[3],
        border: 'none',
        cursor: 'pointer',
    },
    hover: {
        backgroundColor: colors.primary.dark,
    },
})
```

### Alert Component

```typescript
import {
    createStyles,
    colors,
    spacing,
} from '@frauschert/my-awesome-component-library'

interface AlertProps {
    type: 'info' | 'success' | 'error'
}

const Alert = ({ type, message }: AlertProps & { message: string }) => {
    const colorMap = {
        info: colors.info,
        success: colors.success,
        error: colors.error,
    }

    const styles = createStyles(
        () => ({
            backgroundColor: colorMap[type].light,
            border: `1px solid ${colorMap[type].base}`,
            padding: spacing[4],
        }),
        'light'
    )

    return <div style={styles.toInlineStyles()}>{message}</div>
}
```

## TypeScript Support

All exports are fully typed:

```typescript
import type {
    ThemeMode,
    Theme,
    BaseTheme,
    StyleObject,
    StyleFunction,
} from '@frauschert/my-awesome-component-library'
```

## Documentation

-   Full API docs: `src/styles/README.md`
-   Complete examples: `EXAMPLES_CSS_IN_JS.tsx`
-   Feature overview: `CSS_IN_JS_FEATURE.md`
-   Storybook: See "Styling/CSS-in-JS" stories

## When to Use CSS-in-JS vs SCSS

**Use SCSS (library components):**

-   Static styles
-   Component internals
-   Best performance
-   Smaller bundle size

**Use CSS-in-JS (your app):**

-   Dynamic theming
-   Runtime style computation
-   User customization
-   Accessing design tokens
-   Building custom components

## Testing

All CSS-in-JS utilities are tested:

-   ✅ 32/32 tests passing
-   ✅ Full coverage of all features
-   ✅ Integration tests included

## Examples

See `EXAMPLES_CSS_IN_JS.tsx` for 8 complete working examples including:

1. Direct token usage
2. Themed components
3. Dynamic props
4. Responsive layouts
5. React hooks
6. Style merging
7. Utility functions
8. Complete AlertBox component

## Need Help?

-   Check `src/styles/README.md` for detailed documentation
-   Run Storybook to see interactive examples
-   Look at test files for usage patterns
-   See `EXAMPLES_CSS_IN_JS.tsx` for real implementations
