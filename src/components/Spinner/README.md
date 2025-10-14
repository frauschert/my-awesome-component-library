# Spinner Components

Loading indicators to provide visual feedback during asynchronous operations.

## Components

### SpinCoin

A 3D spinning circular indicator that rotates on the Y-axis, creating a coin-flip effect.

**Best for:**

-   Single action loading states
-   Button loading indicators
-   Inline loading feedback
-   Minimalist designs

**Example:**

```tsx
import { SpinCoin } from './components/Spinner'

function App() {
    return (
        <>
            {/* Using theme variant */}
            <SpinCoin variant="primary" size="lg" label="Loading data" />

            {/* Using custom color */}
            <SpinCoin color={hex('#8b5cf6')} size={48} speed={1.5} />

            {/* Using semantic size */}
            <SpinCoin variant="success" size="sm" />
        </>
    )
}
```

### Ellipsis

An animated ellipsis with four bouncing dots, creating a wave-like motion.

**Best for:**

-   Text-based loading states ("Loading...")
-   Content placeholders
-   Subtle, non-intrusive feedback
-   Chat/messaging interfaces

**Example:**

```tsx
import { Ellipsis } from './components/Spinner'

function App() {
    return (
        <>
            {/* Using theme variant */}
            <Ellipsis variant="error" size="md" label="Sending message" />

            {/* Using custom color */}
            <Ellipsis color={hex('#10b981')} size={64} />
        </>
    )
}
```

## Props

Both spinner components accept the same props:

| Prop        | Type                                                                      | Default     | Description                                  |
| ----------- | ------------------------------------------------------------------------- | ----------- | -------------------------------------------- |
| `color`     | `Color`                                                                   | -           | Hex color (overrides variant)                |
| `variant`   | `'primary' \| 'secondary' \| 'success' \| 'error' \| 'warning' \| 'info'` | -           | Theme color variant                          |
| `size`      | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| number`                          | `'md'`      | Semantic size or custom pixel value          |
| `className` | `string`                                                                  | -           | Additional CSS class names                   |
| `label`     | `string`                                                                  | `'Loading'` | Accessible label for screen readers          |
| `speed`     | `number`                                                                  | `1`         | Animation speed multiplier (higher = faster) |

### Size Reference

| Size | Pixels | Use Case                          |
| ---- | ------ | --------------------------------- |
| `xs` | 16px   | Inline text, small buttons        |
| `sm` | 24px   | Form inputs, compact UI           |
| `md` | 40px   | Standard buttons, cards           |
| `lg` | 64px   | Modal dialogs, main content       |
| `xl` | 96px   | Full-page loading, splash screens |

### Theme Variants

| Variant     | Color            | Use Case                              |
| ----------- | ---------------- | ------------------------------------- |
| `primary`   | Blue (#3b82f6)   | Primary actions, main content         |
| `secondary` | Gray (#6b7280)   | Secondary actions, less emphasis      |
| `success`   | Green (#10b981)  | Success states, confirmations         |
| `error`     | Red (#ef4444)    | Errors, warnings, destructive actions |
| `warning`   | Orange (#f59e0b) | Caution, pending states               |
| `info`      | Cyan (#06b6d4)   | Information, tips                     |

## Hooks & Wrappers

### useSpinner Hook

A hook for managing loading states with automatic promise handling.

**Example:**

```tsx
import { useSpinner, SpinCoin } from './components/Spinner'

function DataLoader() {
    const { loading, withSpinner } = useSpinner()

    const loadData = async () => {
        await withSpinner(fetchData())
    }

    return (
        <div>
            <button onClick={loadData} disabled={loading}>
                Load Data
            </button>
            {loading && <SpinCoin label="Loading data" />}
        </div>
    )
}
```

### LoadingBoundary Component

A wrapper component that conditionally renders a spinner or children.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `loading` | `boolean` | - | Whether to show spinner |
| `label` | `string` | `'Loading'` | Spinner accessibility label |
| `spinner` | `ComponentType` | `SpinCoin` | Which spinner to use |
| `spinnerProps` | `SpinnerProps` | - | Props to pass to spinner |
| `children` | `ReactNode` | - | Content to show when not loading |
| `className` | `string` | `'loading-boundary'` | Container className |

**Example:**

```tsx
import { LoadingBoundary, Ellipsis, useSpinner } from './components/Spinner'

function UserProfile() {
    const { loading } = useSpinner()

    return (
        <LoadingBoundary
            loading={loading}
            label="Loading profile"
            spinner={Ellipsis}
            spinnerProps={{ size: 'lg', variant: 'primary' }}
        >
            <ProfileContent />
        </LoadingBoundary>
    )
}
```

## Accessibility

All spinners are fully accessible and WCAG 2.1 Level AAA compliant:

-   **ARIA role**: `role="status"` for dynamic content changes
-   **Live region**: `aria-live="polite"` announces state to screen readers
-   **Labels**: `aria-label` provides context about what's loading
-   **Screen reader text**: Hidden text repeats the label
-   **Reduced motion**: Respects `prefers-reduced-motion` preference

### Reduced Motion Support

For users with motion sensitivity disorders:

### Reduced Motion Support

For users with motion sensitivity or vestibular disorders, animations are automatically replaced with subtle opacity pulses when `prefers-reduced-motion` is enabled:

```tsx
<SpinCoin variant="primary" label="Uploading file" />
// With prefers-reduced-motion: gentle opacity pulse instead of rotation
// Screen reader still announces: "Uploading file"
```

**What happens:**

-   **SpinCoin**: 3D rotation → gentle opacity fade (0.4 to 1.0)
-   **Ellipsis**: Bouncing dots → static dots with gradient opacity
-   **Screen readers**: Continue to announce loading states normally

## Usage Patterns

### Inline Loading

```tsx
function SubmitButton() {
    const { loading, withSpinner } = useSpinner()

    const handleSubmit = async () => {
        await withSpinner(api.submit(data))
    }

    return (
        <button onClick={handleSubmit} disabled={loading}>
            {loading ? (
                <SpinCoin size="xs" variant="secondary" label="Submitting" />
            ) : (
                'Submit'
            )}
        </button>
    )
}
```

### Content Loading with Boundary

```tsx
function UserProfile({ userId }) {
    const { loading, withSpinner } = useSpinner(true)

    useEffect(() => {
        withSpinner(loadUser(userId))
    }, [userId])

    return (
        <LoadingBoundary loading={loading} label="Loading profile">
            <Profile />
        </LoadingBoundary>
    )
}
```

### Multiple States

```tsx
function DataTable() {
    const [state, setState] = useState<'loading' | 'processing' | 'ready'>(
        'loading'
    )

    return (
        <div>
            {state === 'loading' && (
                <SpinCoin variant="primary" label="Loading data" />
            )}
            {state === 'processing' && (
                <Ellipsis variant="warning" label="Processing results" />
            )}
            {state === 'ready' && <Table data={data} />}
        </div>
    )
}
```

### With Speed Control

```tsx
// Fast for quick operations
<SpinCoin variant="success" speed={2} label="Saving" />

// Slow for background processes
<Ellipsis variant="info" speed={0.7} label="Syncing" />
```

## Styling

### Semantic Sizes

```tsx
// Use semantic sizes for consistency
<SpinCoin size="xs" />  // 16px - inline
<SpinCoin size="sm" />  // 24px - buttons
<SpinCoin size="md" />  // 40px - cards (default)
<SpinCoin size="lg" />  // 64px - modals
<SpinCoin size="xl" />  // 96px - full-page
```

### Theme Variants

```tsx
// Use variants that match your design system
<SpinCoin variant="primary" />   // Primary brand color
<SpinCoin variant="success" />   // Success actions
<SpinCoin variant="error" />     // Error states
<SpinCoin variant="warning" />   // Warnings
<SpinCoin variant="info" />      // Information
<SpinCoin variant="secondary" /> // Secondary actions
```

### Custom Colors

```tsx
import hex from './utility/hex'

// Custom colors override variants
<SpinCoin color={hex('#8b5cf6')} label="Loading" />
<Ellipsis color={hex('#ec4899')} label="Processing" />
```

### Custom Classes

```tsx
<SpinCoin className="my-spinner" variant="primary" />

// CSS:
.my-spinner {
    opacity: 0.8;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}
```

## Animation Details

### SpinCoin

-   **Duration**: 2.4 seconds per cycle
-   **Rotation**: 10 full rotations (3600deg)
-   **Easing**: Custom cubic-bezier for smooth acceleration/deceleration
-   **Axis**: Y-axis (3D flip effect)

### Ellipsis

-   **Duration**: 0.6 seconds per cycle
-   **Dots**: 4 animated circles
-   **Effects**: Scale in (left), translate (middle two), scale out (right)
-   **Timing**: Staggered for wave effect

## Testing

Both components include comprehensive test coverage:

```tsx
import { render, screen } from '@testing-library/react'
import { SpinCoin, Ellipsis } from './components/Spinner'

test('spinner has accessible label', () => {
    render(<SpinCoin label="Loading data" />)

    const spinner = screen.getByRole('status')
    expect(spinner).toHaveAttribute('aria-label', 'Loading data')
})
```

## Performance

-   **Pure CSS animations**: No JavaScript required after mount
-   **Lightweight**: < 1KB per component (gzipped)
-   **No re-renders**: Static after initial render
-   **GPU accelerated**: Uses transform for smooth 60fps animations

## Browser Support

-   Chrome/Edge: ✅ Full support
-   Firefox: ✅ Full support
-   Safari: ✅ Full support (iOS 12+)
-   IE11: ⚠️ SpinCoin needs `transform-style: preserve-3d` polyfill

## Best Practices

1. **Always provide a meaningful label**: Helps screen reader users understand context
2. **Match color to context**: Use error colors for error loading, etc.
3. **Size appropriately**: Small for inline, large for full-page
4. **Remove when done**: Don't leave spinners running indefinitely
5. **Consider timeout**: Show error message if loading takes too long

```tsx
function LoadingWithTimeout() {
    const [loading, setLoading] = useState(true)
    const [timedOut, setTimedOut] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setTimedOut(true), 10000)
        return () => clearTimeout(timer)
    }, [])

    if (timedOut) return <ErrorMessage />
    if (loading) return <SpinCoin label="Loading data" />
    return <Content />
}
```

## Related Components

-   **Skeleton**: For content placeholders
-   **ProgressCircular**: For determinate progress
-   **Toast**: For background operation notifications
