# Theme System

A complete theming system with light mode, dark mode, and automatic system preference detection. Built with CSS custom properties for maximum flexibility.

## Features

-   🌓 **Light & Dark Modes** - Beautifully crafted color schemes
-   🤖 **Auto Mode** - Follows system preferences automatically
-   💾 **Persistent** - Saves user preference to localStorage
-   ⚡ **Fast** - CSS custom properties enable instant theme switching
-   ♿ **Accessible** - WCAG compliant color contrasts
-   🎨 **Customizable** - Override any theme variable
-   📱 **Mobile-Friendly** - Updates meta theme-color for mobile browsers
-   🔧 **3 Variants** - Buttons, Select, or Toggle UI

## Installation

```tsx
import {
    ThemeProvider,
    ThemeSwitcher,
    useTheme,
} from '@frauschert/my-awesome-component-library'
```

## Quick Start

Wrap your app with `ThemeProvider`:

```tsx
import { ThemeProvider } from './components/Theme'

function App() {
    return (
        <ThemeProvider>
            <YourApp />
        </ThemeProvider>
    )
}
```

Add a theme switcher anywhere:

```tsx
import { ThemeSwitcher } from './components/Theme'

function NavBar() {
    return (
        <nav>
            <Logo />
            <ThemeSwitcher variant="toggle" />
        </nav>
    )
}
```

## ThemeProvider

The provider that enables theming throughout your app.

### Props

None required - just wrap your app!

### Features

-   **System Preference Detection** - Automatically detects `prefers-color-scheme`
-   **localStorage Persistence** - Saves and restores user preference
-   **Meta Theme Color** - Updates mobile browser chrome color
-   **Context API** - Provides theme state to all children

### Usage

```tsx
<ThemeProvider>
    <App />
</ThemeProvider>
```

## ThemeSwitcher

UI component for switching themes.

### Props

| Prop         | Type                                    | Default     | Description                             |
| ------------ | --------------------------------------- | ----------- | --------------------------------------- |
| `variant`    | `'buttons'` \| `'select'` \| `'toggle'` | `'buttons'` | UI variant                              |
| `showLabels` | boolean                                 | `true`      | Show text labels (buttons variant only) |
| `size`       | `'sm'` \| `'md'` \| `'lg'`              | `'md'`      | Size of the switcher                    |
| `className`  | string                                  | `''`        | Additional CSS class                    |

### Variants

#### Buttons (default)

Three-button group showing all options:

```tsx
<ThemeSwitcher variant="buttons" />
```

#### Select

Dropdown select element:

```tsx
<ThemeSwitcher variant="select" />
```

#### Toggle

Simple button that toggles between light and dark (no auto option):

```tsx
<ThemeSwitcher variant="toggle" />
```

### Examples

```tsx
// In a navigation bar
<nav>
    <Logo />
    <ThemeSwitcher variant="toggle" size="md" />
</nav>

// In settings page
<div>
    <h2>Appearance</h2>
    <ThemeSwitcher variant="buttons" size="lg" />
</div>

// Compact version without labels
<ThemeSwitcher variant="buttons" showLabels={false} size="sm" />

// Dropdown for minimal space
<ThemeSwitcher variant="select" size="sm" />
```

## useTheme Hook

Access and control theme programmatically.

### API

```tsx
const [state, setState] = useTheme()

// state shape:
{
    theme: 'light' | 'dark' | 'auto',
    resolvedTheme: 'light' | 'dark', // actual theme after resolving 'auto'
    systemTheme: 'light' | 'dark'    // system preference
}
```

### Examples

```tsx
import { useTheme } from './components/Theme'

function MyComponent() {
    const [{ theme, resolvedTheme }, setTheme] = useTheme()

    return (
        <div>
            <p>Current theme: {theme}</p>
            <p>Actual display: {resolvedTheme}</p>

            <button
                onClick={() =>
                    setTheme({
                        theme: 'dark',
                        resolvedTheme,
                        systemTheme: resolvedTheme,
                    })
                }
            >
                Force Dark Mode
            </button>
        </div>
    )
}
```

#### Conditional Rendering

```tsx
function Logo() {
    const [{ resolvedTheme }] = useTheme()

    return resolvedTheme === 'dark' ? <LogoDark /> : <LogoLight />
}
```

#### Custom Theme Logic

```tsx
function AdvancedSettings() {
    const [{ theme, systemTheme }, setTheme] = useTheme()

    const handleCustomTheme = () => {
        // Follow system only during business hours
        const hour = new Date().getHours()
        const businessHours = hour >= 9 && hour <= 17

        setTheme({
            theme: businessHours ? systemTheme : 'dark',
            resolvedTheme: businessHours ? systemTheme : 'dark',
            systemTheme,
        })
    }

    return <button onClick={handleCustomTheme}>Business Hours Mode</button>
}
```

## Theme Modes

### Light Mode (default)

Clean, modern light theme optimized for readability.

```tsx
setTheme({ theme: 'light', resolvedTheme: 'light', systemTheme: 'light' })
```

### Dark Mode

Rich, deep dark theme inspired by modern code editors like VS Code.

```tsx
setTheme({ theme: 'dark', resolvedTheme: 'dark', systemTheme: 'dark' })
```

### Auto Mode

Automatically follows system `prefers-color-scheme` setting. Listens for changes in real-time.

```tsx
setTheme({ theme: 'auto', resolvedTheme, systemTheme })
```

## CSS Custom Properties

All components use CSS custom properties for theming. Override any variable for customization.

### Color Tokens

#### Backgrounds

```css
--theme-background: Page background
--theme-surface: Card/panel surfaces
--theme-bg-primary: Primary background
--theme-bg-secondary: Secondary background
--theme-bg-tertiary: Tertiary background
```

#### Text

```css
--theme-text: Primary text color
--theme-text-primary: Primary colored text
--theme-text-secondary: Secondary text
--theme-text-tertiary: Tertiary text
--theme-text-muted: Muted text
--theme-text-on-primary: Text on primary backgrounds
```

#### Brand Colors

```css
--theme-primary: Primary brand color
--theme-primary-dark: Darker variant
--theme-primary-light: Lighter variant
```

#### Semantic Colors

```css
--theme-success: Success color
--theme-warning: Warning color
--theme-error: Error color
--theme-danger: Danger color
--theme-info: Info color
```

#### Borders & Interactive

```css
--theme-border: Border color
--theme-hover: Hover background
--theme-focus-ring: Focus ring color
--theme-selected-bg: Selected state background
```

#### Shadows

```css
--theme-shadow-sm: Small shadow
--theme-shadow-md: Medium shadow
--theme-shadow-lg: Large shadow
--theme-shadow-xl: Extra large shadow
```

### Customization

Override theme variables in your own CSS:

```css
:root {
    --theme-primary: #ff6b6b;
    --theme-primary-dark: #ee5a52;
}

.theme--dark {
    --theme-primary: #ffa94d;
    --theme-surface: #1a1b1e;
}
```

Or use inline styles:

```tsx
<div
    style={{
        backgroundColor: 'var(--theme-surface)',
        color: 'var(--theme-text)',
        borderColor: 'var(--theme-border)',
    }}
>
    Themed content
</div>
```

## Best Practices

### 1. Use Theme Variables

Always use theme variables instead of hardcoded colors:

```tsx
// ✅ Good
<div style={{ color: 'var(--theme-text)' }}>Text</div>

// ❌ Bad
<div style={{ color: '#333' }}>Text</div>
```

### 2. Provide Fallbacks

Provide fallback colors for variables:

```css
color: var(--theme-text, #333);
background: var(--theme-surface, #fff);
```

### 3. Test Both Themes

Always test your components in both light and dark modes:

```tsx
// In Storybook or tests
<ThemeProvider>
    <ThemeSwitcher />
    <YourComponent />
</ThemeProvider>
```

### 4. Respect System Preferences

Enable "auto" mode by default for the best user experience:

```tsx
// ThemeProvider defaults to 'auto' mode
<ThemeProvider>
    <App />
</ThemeProvider>
```

### 5. Avoid Theme-Specific Logic

Let CSS custom properties handle theming. Avoid conditional rendering:

```tsx
// ✅ Good - CSS handles theme switching
<button className="primary-button">Click me</button>

// ❌ Bad - Conditional logic
const [{ theme }] = useTheme()
<button style={{ backgroundColor: theme === 'dark' ? '#555' : '#eee' }}>
    Click me
</button>
```

## localStorage

Theme preferences are automatically saved to localStorage with the key `app-theme`.

### Manual Control

```tsx
// Save
localStorage.setItem('app-theme', 'dark')

// Load
const savedTheme = localStorage.getItem('app-theme')

// Clear
localStorage.removeItem('app-theme')
```

## System Integration

### Mobile Browser Chrome

The theme system automatically updates `<meta name="theme-color">` for mobile browsers:

```html
<!-- Light mode -->
<meta name="theme-color" content="#ffffff" />

<!-- Dark mode -->
<meta name="theme-color" content="#1e1e1e" />
```

### System Preference Detection

Uses `prefers-color-scheme` media query:

```tsx
// Automatically detected by ThemeProvider
window.matchMedia('(prefers-color-scheme: dark)')
```

Listens for changes in real-time - if user changes system preference, the app updates automatically (when using auto mode).

## TypeScript

Full TypeScript support with exported types:

```tsx
import type { ThemeKey } from './components/Theme'

const theme: ThemeKey = 'dark' // 'light' | 'dark' | 'auto'

type ThemeContextProps = {
    theme: ThemeKey
    resolvedTheme: 'light' | 'dark'
    systemTheme: 'light' | 'dark'
}
```

## Accessibility

-   **Keyboard Navigation** - All theme switchers are fully keyboard accessible
-   **ARIA Labels** - Proper labeling for screen readers
-   **Focus Indicators** - Clear focus states
-   **Color Contrast** - WCAG AA compliant in both themes
-   **Prefers Reduced Motion** - Respects user preference

## Browser Support

-   Chrome/Edge 88+
-   Firefox 76+
-   Safari 14+
-   All modern mobile browsers

Requires:

-   CSS Custom Properties
-   `prefers-color-scheme` media query
-   localStorage API
-   matchMedia API

## Migration Guide

### From Old Theme System

If you had a basic theme system:

```tsx
// Old
const [isDark, setIsDark] = useState(false)

// New
const [{ resolvedTheme }, setTheme] = useTheme()
const isDark = resolvedTheme === 'dark'
```

### Adding to Existing App

1. Wrap app with `ThemeProvider`
2. Replace hardcoded colors with CSS variables
3. Add `ThemeSwitcher` to your UI
4. Test in both modes

## Examples

See Storybook for interactive examples:

-   Buttons variant
-   Select variant
-   Toggle variant
-   Different sizes
-   In navigation bars
-   Complete theme demos

## Troubleshooting

### Theme not applying

Make sure you've wrapped your app with `ThemeProvider`:

```tsx
<ThemeProvider>
    <App />
</ThemeProvider>
```

### Colors not changing

Use theme variables instead of hardcoded colors:

```css
/* Use this */
color: var(--theme-text);

/* Not this */
color: #333;
```

### Flash of unstyled content

The theme is loaded from localStorage on mount. To prevent flash:

```tsx
// Add to index.html <head>
<script>
    const theme = localStorage.getItem('app-theme') || 'auto';
    if (theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('theme--dark');
    } else {
        document.documentElement.classList.add('theme--light');
    }
</script>
```

## Performance

-   **Instant Switching** - CSS custom properties enable instantaneous theme changes
-   **No Re-renders** - Theme changes don't cause React re-renders (unless accessing theme state)
-   **Minimal Bundle Size** - Core theme logic is ~2KB gzipped

## Contributing

Want to add a new theme or improve existing ones? The theme definitions are in `src/styles/_theme-vars.scss`.
