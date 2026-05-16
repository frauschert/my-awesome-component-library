# Skeleton Component

A flexible and accessible skeleton loading component for displaying placeholder content while data is loading.

## Features

-   ✅ **Three variants**: text, circular, rectangular
-   ✅ **Fully customizable**: width, height, border-radius
-   ✅ **Accessible**: ARIA attributes, reduced motion support
-   ✅ **Theme-integrated**: Uses SCSS theme colors
-   ✅ **Animation control**: Enable/disable shimmer effect
-   ✅ **TypeScript strict**: Full type safety
-   ✅ **Compound API**: `Skeleton.Text`, `Skeleton.Circle`, `Skeleton.Rectangle`
-   ✅ **47 comprehensive tests**: Full coverage

## Basic Usage

```tsx
import { Skeleton } from '@frauschert/my-awesome-component-library'

// Text skeleton
<Skeleton variant="text" width={200} height={20} />

// Circular skeleton (avatar)
<Skeleton variant="circular" width={40} height={40} />

// Rectangular skeleton (image)
<Skeleton variant="rectangular" width="100%" height={200} />
```

## Compound Component API

```tsx
// Cleaner syntax using compound components
<Skeleton.Text width={200} height={20} />
<Skeleton.Circle width={40} height={40} />
<Skeleton.Rectangle width="100%" height={200} />
```

## Props

### Skeleton

| Prop           | Type                                    | Default        | Description                         |
| -------------- | --------------------------------------- | -------------- | ----------------------------------- |
| `variant`      | `'text' \| 'circular' \| 'rectangular'` | `'text'`       | Shape variant                       |
| `width`        | `number \| string`                      | `undefined`    | Width in pixels or CSS unit         |
| `height`       | `number \| string`                      | `undefined`    | Height in pixels or CSS unit        |
| `borderRadius` | `number \| string`                      | variant-based  | Border radius (px or CSS unit)      |
| `animate`      | `boolean`                               | `true`         | Enable shimmer animation            |
| `className`    | `string`                                | `undefined`    | Additional CSS classes              |
| `aria-label`   | `string`                                | `'Loading...'` | Accessible label for screen readers |
| `aria-busy`    | `boolean`                               | `true`         | Loading state indicator             |
| `data-testid`  | `string`                                | `undefined`    | Test identifier                     |

### Default Border Radius by Variant

-   **text**: `4px`
-   **circular**: `50%`
-   **rectangular**: `8px`

## Examples

### User Profile Card

```tsx
<div style={{ display: 'flex', gap: '1rem', padding: '1rem' }}>
    <Skeleton.Circle width={60} height={60} />
    <div style={{ flex: 1 }}>
        <Skeleton.Text width="60%" height={20} />
        <Skeleton.Text width="80%" height={16} />
        <Skeleton.Text width="40%" height={16} />
    </div>
</div>
```

### Text Content Loading

```tsx
<div>
    <Skeleton.Text width="100%" />
    <Skeleton.Text width="75%" />
    <Skeleton.Text width="50%" />
</div>
```

### Image Gallery

```tsx
<div
    style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem',
    }}
>
    <Skeleton.Rectangle width="100%" height={200} />
    <Skeleton.Rectangle width="100%" height={200} />
    <Skeleton.Rectangle width="100%" height={200} />
</div>
```

### Disable Animation

```tsx
<Skeleton variant="text" width={200} animate={false} />
```

### Custom Dimensions and Styling

```tsx
<Skeleton
    variant="rectangular"
    width="50vw"
    height="10rem"
    borderRadius="16px"
    className="custom-skeleton"
/>
```

## Accessibility

The Skeleton component follows accessibility best practices:

-   **ARIA role**: `role="status"` indicates dynamic content loading
-   **ARIA label**: Customizable `aria-label` for screen reader users
-   **ARIA busy**: `aria-busy` attribute indicates loading state
-   **Reduced motion**: Respects `prefers-reduced-motion` media query

```tsx
<Skeleton variant="text" aria-label="Loading user profile" aria-busy={true} />
```

### Reduced Motion Support

The component automatically disables animations for users who prefer reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
    .skeleton::before {
        animation: none !important;
    }
}
```

## Theme Integration

The Skeleton component uses SCSS theme variables:

```scss
$skeleton-bg: theme-color('background', 'dark'); // #ddd
$skeleton-shimmer-color: rgba(255, 255, 255, 0.5);
$skeleton-animation-duration: 1.5s;
```

## Migration from Legacy Components

### SkeletonLine (Deprecated)

**Before:**

```tsx
<SkeletonLine size="medium" />
```

**After:**

```tsx
<Skeleton.Text width="50%" height={20} />
```

### SkeletonImage (Deprecated)

**Before:**

```tsx
<SkeletonImage />
```

**After:**

```tsx
<Skeleton.Rectangle width={300} height={300} borderRadius={4} />
```

The legacy components are still available for backward compatibility but are marked as deprecated.

## TypeScript

Full TypeScript support with strict typing:

```tsx
import {
    Skeleton,
    SkeletonProps,
} from '@frauschert/my-awesome-component-library'

const CustomSkeleton = (props: SkeletonProps) => {
    return <Skeleton {...props} />
}

// Compound components also have proper types
const TextSkeleton = (props: Omit<SkeletonProps, 'variant'>) => {
    return <Skeleton.Text {...props} />
}
```

## Testing

The component includes 47 comprehensive tests covering:

-   ✅ Basic rendering for all variants
-   ✅ Animation control
-   ✅ Dimension handling (numbers, strings, units)
-   ✅ Border radius customization
-   ✅ Accessibility attributes
-   ✅ Class name handling
-   ✅ Compound component API
-   ✅ Legacy component backward compatibility
-   ✅ Edge cases (zero dimensions, large values, mixed units)

Run tests:

```bash
npm test -- Skeleton.test.tsx
```

## Browser Support

-   Modern browsers with CSS animations support
-   Gracefully degrades in older browsers (no shimmer animation)
-   Respects user motion preferences

## Best Practices

1. **Use appropriate variants**: Choose `text` for text content, `circular` for avatars, `rectangular` for images
2. **Match content dimensions**: Set skeleton dimensions to match the actual content
3. **Group related skeletons**: Wrap multiple skeletons in semantic containers
4. **Provide context**: Use descriptive `aria-label` values
5. **Consider animation**: Disable animation for performance-critical scenarios or dense layouts

## Performance

-   Lightweight: Minimal CSS, no heavy animations
-   GPU-accelerated: Uses `transform` for smooth animations
-   Optimized: Single CSS animation, no JavaScript calculations
-   Lazy: Animation only runs when `animate={true}`

## Related Components

-   **Spinner**: For active loading indicators
-   **ProgressCircular**: For determinate progress
-   **Portal**: For loading overlays

## License

MIT
