# Theming Guide

## Overview

This component library uses **CSS Custom Properties (CSS Variables)** for theming. This approach provides several advantages:

-   ✅ Works in Portals (Select dropdowns, ContextMenus, Modals)
-   ✅ Runtime theme switching
-   ✅ No duplicate CSS
-   ✅ Easy to override at component level
-   ✅ Better performance

## How It Works

### 1. Theme Variables are Defined Globally

All theme variables are defined in `src/styles/_theme-vars.scss`:

```scss
:root {
    --theme-primary: #408bbd;
    --theme-text-primary: #408bbd;
    --theme-bg-primary: #ffffff;
    // ... etc
}

.theme--dark {
    --theme-primary: #61b0e7;
    --theme-text-primary: #dddddd;
    --theme-bg-primary: #222222;
    // ... etc
}
```

### 2. Theme Class is Applied to Document Root

The `ThemeProvider` component applies `theme--light` or `theme--dark` to `<html>` element:

```tsx
<ThemeProvider>
    <App />
</ThemeProvider>
```

This affects **all** elements in the document, including Portals.

### 3. Components Use CSS Variables

Instead of the old `themify()` mixin approach, use CSS variables directly:

**❌ OLD WAY (doesn't work in Portals):**

```scss
.button {
    @include themify() {
        background-color: themed('primaryColor');
        color: themed('textColor');
    }
}
```

**✅ NEW WAY (works everywhere):**

```scss
.button {
    background-color: var(--theme-primary);
    color: var(--theme-text-on-primary);
}
```

## Migration Guide

### For New Components

1. Import the theme variables file:

```scss
@import '../../styles/theme-vars';
```

2. Use CSS variables directly:

```scss
.my-component {
    background-color: var(--theme-bg-primary);
    color: var(--theme-text-primary);
    border: 1px solid var(--theme-border-color);

    &:hover {
        background-color: var(--theme-hover-bg);
    }
}
```

### For Existing Components

Replace `themify()` usage with CSS variables:

**Before:**

```scss
.select__option {
    @include themify() {
        color: themed('textColor');
        background-color: themed('backgroundColor');
    }

    &:hover {
        @include themify() {
            background-color: themed('primaryColor');
        }
    }
}
```

**After:**

```scss
.select__option {
    color: var(--theme-text-primary);
    background-color: var(--theme-bg-primary);

    &:hover {
        background-color: var(--theme-primary);
        color: var(--theme-text-on-primary);
    }
}
```

## Available Theme Variables

### Colors

**Backgrounds:**

-   `--theme-bg-primary` - Main background
-   `--theme-bg-secondary` - Secondary background
-   `--theme-bg-tertiary` - Tertiary background

**Text:**

-   `--theme-text-primary` - Primary text
-   `--theme-text-secondary` - Secondary text
-   `--theme-text-muted` - Muted text
-   `--theme-text-on-primary` - Text on primary color

**Brand:**

-   `--theme-primary` - Primary brand color
-   `--theme-primary-dark` - Darker primary
-   `--theme-primary-light` - Lighter primary

**Semantic:**

-   `--theme-danger` - Error/danger color
-   `--theme-danger-bg` - Danger background
-   `--theme-success` - Success color
-   `--theme-warning` - Warning color
-   `--theme-info` - Info color

**Interactive:**

-   `--theme-hover-bg` - Hover background
-   `--theme-selected-bg` - Selected background
-   `--theme-focus-ring` - Focus ring color

**Borders & Shadows:**

-   `--theme-border-color` - Border color
-   `--theme-border-radius` - Border radius
-   `--theme-shadow-sm/md/lg` - Box shadows

## Components with Portals

Components that use `createPortal` (Select, ContextMenu, Modal, Tooltip) **no longer need** to:

-   Pass theme through props
-   Apply theme class manually
-   Use hardcoded colors

The theme class on `<html>` makes CSS variables available everywhere!

**Example - Select Component:**

```scss
// Before: Had to use hardcoded colors for Portal
.theme--light .select__option:hover {
    background-color: #408bbd;
    color: white;
}

.theme--dark .select__option:hover {
    background-color: #61b0e7;
    color: #222;
}

// After: CSS variables work automatically
.select__option:hover {
    background-color: var(--theme-primary);
    color: var(--theme-text-on-primary);
}
```

## Runtime Theme Switching

Theme switching is handled by the ThemeProvider:

```tsx
import { useTheme } from './components/Theme/ThemeContext'

function App() {
    const [{ theme }, setTheme] = useTheme()

    const toggleTheme = () => {
        setTheme({ theme: theme === 'light' ? 'dark' : 'light' })
    }

    return <button onClick={toggleTheme}>Toggle Theme</button>
}
```

## Adding New Theme Variables

1. Add to both `:root` and `.theme--dark` in `_theme-vars.scss`
2. Use descriptive, semantic names
3. Document in this guide
4. Use the new variable in components

Example:

```scss
:root {
    --theme-code-bg: #f5f5f5;
}

.theme--dark {
    --theme-code-bg: #1e1e1e;
}
```

## Best Practices

1. **Always use variables** - Never hardcode theme-dependent colors
2. **Use semantic names** - `--theme-primary` not `--theme-blue`
3. **Provide fallbacks** - `var(--theme-primary, #408bbd)` for safety
4. **Test both themes** - Use ThemeSwitcher in Storybook
5. **Group related variables** - Backgrounds together, text together, etc.

## Troubleshooting

**Q: Portal content doesn't update on theme change**
A: Make sure ThemeProvider wraps your entire app and you're using CSS variables (not themify mixin)

**Q: Component has wrong colors**
A: Check if you're using hardcoded colors instead of CSS variables

**Q: Theme doesn't persist**
A: ThemeProvider doesn't have persistence by default. Add localStorage logic if needed.
