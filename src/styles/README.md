# CSS-in-JS Styling Utilities

This library provides both **SCSS** and **CSS-in-JS** styling options. While components are built with SCSS for optimal performance and smaller bundle sizes, you can use the CSS-in-JS utilities to create dynamic, theme-aware styles in your application code.

## Table of Contents

-   [Quick Start](#quick-start)
-   [Design Tokens](#design-tokens)
-   [Creating Styles](#creating-styles)
-   [Theme Integration](#theme-integration)
-   [Utilities](#utilities)
-   [Examples](#examples)

## Quick Start

```tsx
import {
    tokens,
    createStyles,
    useThemeStyles,
} from '@frauschert/my-awesome-component-library'

// Access design tokens
const primaryColor = tokens.colors.primary.base
const spacing = tokens.spacing[4]

// Create theme-aware styles
const buttonStyles = createStyles(
    (theme) => ({
        backgroundColor: theme.primaryColor,
        color: theme.primaryTextColor,
        padding: tokens.spacing[3],
        borderRadius: tokens.borderRadius.md,
    }),
    'light'
)
```

## Design Tokens

All design tokens from SCSS are available as JavaScript/TypeScript constants.

### Colors

```tsx
import { colors } from '@frauschert/my-awesome-component-library'

const primaryBase = colors.primary.base // '#384ea9'
const primaryLight = colors.primary.light // '#e4efff'
const primaryDark = colors.primary.dark // '#273677'

// Available color scales
colors.primary
colors.accent
colors.info
colors.success
colors.warn
colors.error
colors.foreground
colors.background
```

### Typography

```tsx
import { typography } from '@frauschert/my-awesome-component-library'

const font = typography.fontFamily.base
const size = typography.fontSize.lg
const weight = typography.fontWeight.bold
const lineHeight = typography.lineHeight.normal
```

### Spacing

```tsx
import { spacing } from '@frauschert/my-awesome-component-library'

const padding = spacing[4] // '1rem' (16px)
const margin = spacing[8] // '2rem' (32px)
```

### Other Tokens

```tsx
import {
    borderRadius,
    shadows,
    breakpoints,
    zIndex,
    transitions,
} from '@frauschert/my-awesome-component-library'

const rounded = borderRadius.lg
const shadow = shadows.md
const tablet = breakpoints.md
const modalZ = zIndex.modal
const duration = transitions.duration.base
```

## Creating Styles

### Basic Style Creation

```tsx
import { createStyles } from '@frauschert/my-awesome-component-library'

const cardStyles = createStyles((theme) => ({
  backgroundColor: theme.cardBackground,
  border: `1px solid ${theme.borderColor}`,
  borderRadius: '8px',
  padding: '1rem',
  boxShadow: theme.boxShadow,
}), 'light')

// Use as inline styles
<div style={cardStyles.toInlineStyles()}>Card content</div>

// Or generate CSS string
const css = cardStyles.toCss('.card')
```

### With Props

```tsx
interface ButtonProps {
    variant: 'primary' | 'secondary'
    size: 'sm' | 'md' | 'lg'
}

const buttonStyles = createStyles((theme, props?: ButtonProps) => {
    const sizes = {
        sm: '0.5rem 1rem',
        md: '0.75rem 1.5rem',
        lg: '1rem 2rem',
    }

    return {
        backgroundColor:
            props?.variant === 'primary'
                ? theme.primaryColor
                : theme.backgroundColor,
        color: theme.textColor,
        padding: sizes[props?.size || 'md'],
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    }
}, 'light')

const styles = buttonStyles.getStyles({ variant: 'primary', size: 'lg' })
```

### Responsive Styles

```tsx
import { responsive } from '@frauschert/my-awesome-component-library'

const containerStyles = responsive({
    base: {
        padding: '1rem',
        fontSize: '14px',
    },
    md: {
        padding: '2rem',
        fontSize: '16px',
    },
    lg: {
        padding: '3rem',
        fontSize: '18px',
    },
})
```

### Pseudo Selectors

```tsx
import { pseudo } from '@frauschert/my-awesome-component-library'

const linkStyles = pseudo({
    base: {
        color: 'blue',
        textDecoration: 'none',
    },
    hover: {
        textDecoration: 'underline',
    },
    focus: {
        outline: '2px solid blue',
    },
    active: {
        color: 'darkblue',
    },
})
```

### Merge Styles

```tsx
import { mergeStyles } from '@frauschert/my-awesome-component-library'

const baseStyles = {
    padding: '1rem',
    color: 'black',
}

const variantStyles = {
    backgroundColor: 'blue',
    color: 'white',
}

const combined = mergeStyles(baseStyles, variantStyles)
// Result: { padding: '1rem', backgroundColor: 'blue', color: 'white' }
```

## Theme Integration

### Using Theme Tokens

```tsx
import {
    themes,
    lightTheme,
    darkTheme,
} from '@frauschert/my-awesome-component-library'

// Access theme values
const lightBg = lightTheme.backgroundColor
const darkBg = darkTheme.backgroundColor

// Or use the themes object
const theme = themes.light
```

### React Hook

```tsx
import { useThemeStyles } from '@frauschert/my-awesome-component-library'

function MyComponent({ variant }: { variant: 'primary' | 'secondary' }) {
    const { inlineStyles, css } = useThemeStyles(
        (theme, props) => ({
            backgroundColor:
                props.variant === 'primary'
                    ? theme.primaryColor
                    : theme.backgroundColor,
            color: theme.textColor,
            padding: '1rem',
            '&:hover': {
                backgroundColor: theme.hoverBackgroundColor,
            },
        }),
        'light',
        { variant }
    )

    return <button style={inlineStyles}>Click me</button>
}
```

## Utilities

### CSS Variables

```tsx
import { cssVar } from '@frauschert/my-awesome-component-library'

const color = cssVar('primary-color', '#408bbd')
// Result: 'var(--primary-color, #408bbd)'
```

### Unit Conversion

```tsx
import { rem, em } from '@frauschert/my-awesome-component-library'

const padding = rem(24) // '1.5rem'
const margin = em(16) // '1em'
```

### Keyframes

```tsx
import { keyframes } from '@frauschert/my-awesome-component-library'

const fadeIn = keyframes('fadeIn', {
    '0%': { opacity: 0 },
    '100%': { opacity: 1 },
})

// Use in CSS
const animation = {
    animation: 'fadeIn 200ms ease-in',
}
```

### Style Object to CSS

```tsx
import { styleObjectToCss } from '@frauschert/my-awesome-component-library'

const styles = {
    padding: '1rem',
    backgroundColor: 'blue',
    '&:hover': {
        backgroundColor: 'darkblue',
    },
}

const css = styleObjectToCss(styles, '.button')
/*
.button {
  padding: 1rem;
  background-color: blue;
}

.button:hover {
  background-color: darkblue;
}
*/
```

## Examples

### Complete Component with CSS-in-JS

```tsx
import React from 'react'
import {
    createStyles,
    tokens,
    responsive,
} from '@frauschert/my-awesome-component-library'

interface CardProps {
    variant?: 'elevated' | 'outlined'
    children: React.ReactNode
}

export const Card: React.FC<CardProps> = ({
    variant = 'elevated',
    children,
}) => {
    const styles = createStyles((theme, props) => {
        const baseStyles = responsive({
            base: {
                padding: tokens.spacing[4],
                borderRadius: tokens.borderRadius.lg,
                backgroundColor: theme.cardBackground,
                color: theme.textColor,
            },
            md: {
                padding: tokens.spacing[6],
            },
        })

        const variantStyles =
            props.variant === 'elevated'
                ? { boxShadow: tokens.shadows.md }
                : { border: `1px solid ${theme.borderColor}` }

        return { ...baseStyles, ...variantStyles }
    }, 'light')

    return <div style={styles.toInlineStyles({ variant })}>{children}</div>
}
```

### Dynamic Theme Switching

```tsx
import { useState } from 'react'
import {
    createStyles,
    type ThemeMode,
} from '@frauschert/my-awesome-component-library'

export const ThemedButton = () => {
    const [theme, setTheme] = useState<ThemeMode>('light')

    const styles = createStyles(
        (theme) => ({
            backgroundColor: theme.primaryColor,
            color: theme.primaryTextColor,
            padding: '1rem 2rem',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
        }),
        theme
    )

    return (
        <div>
            <button style={styles.toInlineStyles()}>Themed Button</button>
            <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
                Toggle Theme
            </button>
        </div>
    )
}
```

### Complex Nested Styles

```tsx
import { createStyles, tokens } from '@frauschert/my-awesome-component-library'

const navigationStyles = createStyles(
    (theme) => ({
        backgroundColor: theme.headerBackgroundColor,
        padding: tokens.spacing[4],

        '.nav-item': {
            padding: tokens.spacing[2],
            color: theme.textColor,
            textDecoration: 'none',

            '&:hover': {
                backgroundColor: theme.hoverBackgroundColor,
                color: theme.primaryColor,
            },

            '&.active': {
                color: theme.primaryColor,
                fontWeight: tokens.typography.fontWeight.bold,
            },
        },

        '@media (max-width: 768px)': {
            padding: tokens.spacing[2],

            '.nav-item': {
                display: 'block',
                width: '100%',
            },
        },
    }),
    'light'
)

// Generate CSS for injection
const css = navigationStyles.toCss('.navigation')
```

## Best Practices

1. **Use tokens**: Prefer design tokens over hardcoded values for consistency
2. **Theme awareness**: Always use theme values for colors and backgrounds
3. **Responsive design**: Use the `responsive()` helper for breakpoint-based styles
4. **Type safety**: Leverage TypeScript types for better autocomplete and validation
5. **Performance**: For static styles, prefer SCSS. Use CSS-in-JS for dynamic/runtime styles
6. **Memoization**: When using hooks, ensure props are memoized to prevent unnecessary recalculations

## Type Safety

All tokens and theme values are fully typed:

```tsx
import type {
    Theme,
    ThemeMode,
    StyleObject,
} from '@frauschert/my-awesome-component-library'

const theme: Theme = lightTheme
const mode: ThemeMode = 'dark'
const styles: StyleObject = { padding: '1rem' }
```

## Integration with Existing Components

You can mix SCSS and CSS-in-JS:

```tsx
import './MyComponent.scss'
import { tokens } from '@frauschert/my-awesome-component-library'

export const MyComponent = () => {
    const dynamicPadding = tokens.spacing[4]

    return (
        <div className="my-component" style={{ padding: dynamicPadding }}>
            Content
        </div>
    )
}
```
