# Typography Component

A versatile Typography component for consistent text styling across your application.

## Features

-   ✅ 13 predefined variants (h1-h6, subtitle1-2, body1-2, button, caption, overline)
-   ✅ Semantic HTML elements (automatically maps variants to appropriate tags)
-   ✅ Custom component override
-   ✅ Color variants (primary, secondary, success, error, warning, info, muted)
-   ✅ Text alignment (left, center, right, justify)
-   ✅ Font weight control (light, regular, medium, semibold, bold)
-   ✅ Responsive typography (scales on mobile)
-   ✅ Text truncation with ellipsis
-   ✅ Gutter spacing
-   ✅ Dark theme support
-   ✅ Accessibility features
-   ✅ Full TypeScript support

## Usage

### Basic Examples

```tsx
import { Typography } from '@frauschert/my-awesome-component-library'

// Headings
<Typography variant="h1">Main Heading</Typography>
<Typography variant="h2">Section Title</Typography>

// Body Text
<Typography variant="body1">
    This is body text with comfortable reading size.
</Typography>

// Small Text
<Typography variant="caption">Small supplementary text</Typography>

// With Color
<Typography color="primary">Primary colored text</Typography>
<Typography color="error">Error message</Typography>

// With Alignment
<Typography align="center">Centered text</Typography>

// With Custom Weight
<Typography variant="h3" weight="light">Light Heading</Typography>

// Truncated Text
<Typography noWrap>
    This long text will be truncated with ellipsis
</Typography>

// With Bottom Margin
<Typography variant="h2" gutterBottom>
    Title with spacing
</Typography>
```

### Custom Component

Override the default HTML element:

```tsx
<Typography variant="h4" component="span">
    Heading styled but rendered as span
</Typography>

<Typography variant="body1" component="div">
    Body text as a div
</Typography>
```

### Article Layout

```tsx
<article>
    <Typography variant="overline" color="primary" gutterBottom>
        Category
    </Typography>
    <Typography variant="h1" gutterBottom>
        Article Title
    </Typography>
    <Typography variant="subtitle1" color="muted" gutterBottom>
        Article subtitle or lead paragraph
    </Typography>
    <Typography variant="body1" gutterBottom>
        Main article content with comfortable reading size...
    </Typography>
</article>
```

## Props

| Prop           | Type                                                      | Default     | Description                    |
| -------------- | --------------------------------------------------------- | ----------- | ------------------------------ |
| `variant`      | `TypographyVariant`                                       | `'body1'`   | Typography style variant       |
| `component`    | `React.ElementType`                                       | auto        | HTML element to render         |
| `align`        | `'left' \| 'center' \| 'right' \| 'justify' \| 'inherit'` | `'inherit'` | Text alignment                 |
| `color`        | `TypographyColor`                                         | `'inherit'` | Text color                     |
| `weight`       | `TypographyWeight`                                        | -           | Font weight override           |
| `noWrap`       | `boolean`                                                 | `false`     | Prevent wrapping with ellipsis |
| `gutterBottom` | `boolean`                                                 | `false`     | Add bottom margin              |
| `className`    | `string`                                                  | -           | Additional CSS classes         |
| `style`        | `CSSProperties`                                           | -           | Inline styles                  |
| `onClick`      | `function`                                                | -           | Click handler                  |
| `id`           | `string`                                                  | -           | HTML id attribute              |
| `title`        | `string`                                                  | -           | Tooltip text                   |
| `ariaLabel`    | `string`                                                  | -           | Accessibility label            |

## Variants

### Heading Variants

-   `h1` - Largest heading (40px / 32px mobile)
-   `h2` - Section heading (32px / 28px mobile)
-   `h3` - Subsection heading (28px / 24px mobile)
-   `h4` - Component title (24px / 20px mobile)
-   `h5` - Small heading (20px / 18px mobile)
-   `h6` - Smallest heading (18px / 16px mobile)

### Body Variants

-   `subtitle1` - Larger subtitle (16px, medium weight)
-   `subtitle2` - Smaller subtitle (14px, medium weight)
-   `body1` - Default body text (16px)
-   `body2` - Dense body text (14px)

### Utility Variants

-   `button` - Button text style (14px, uppercase)
-   `caption` - Small text (12px)
-   `overline` - Label style (12px, uppercase)

## Color Variants

-   `inherit` - Inherit from parent (default)
-   `primary` - Brand primary color
-   `secondary` - Secondary text color
-   `success` - Success/positive color
-   `error` - Error/danger color
-   `warning` - Warning color
-   `info` - Information color
-   `muted` - Muted/subtle text

## Font Weights

-   `light` - 300
-   `regular` - 400
-   `medium` - 500
-   `semibold` - 600
-   `bold` - 700

## Accessibility

The Typography component includes:

-   Semantic HTML elements based on variant
-   Proper heading hierarchy
-   Support for aria-label
-   Title attributes for tooltips
-   High contrast mode support
-   Print-optimized styles

## Responsive Design

Typography automatically scales on smaller screens:

-   Mobile breakpoint: 768px
-   Small mobile breakpoint: 480px
-   Headings reduce size by 10-25% on mobile

## Theming

Typography respects theme variables:

-   `--theme-font-family` - Font family
-   `--theme-text-primary` - Primary text color
-   `--theme-text-secondary` - Secondary text color
-   `--theme-text-muted` - Muted text color
-   Theme-specific colors (primary, success, error, etc.)

## Best Practices

1. **Use semantic variants**: Choose h1-h6 for actual headings to maintain document structure
2. **Override component when needed**: Use `component` prop to change HTML element while keeping styles
3. **Maintain heading hierarchy**: Don't skip heading levels (h1 → h2 → h3, not h1 → h3)
4. **Use colors purposefully**: Color variants should convey meaning (error for errors, success for confirmations)
5. **Leverage gutterBottom**: Add spacing between text blocks for better readability
6. **Consider noWrap**: Use for single-line text that should truncate (breadcrumbs, navigation, etc.)

## Examples in the Wild

### Card Header

```tsx
<Card.Header>
    <Typography variant="h5" gutterBottom>
        Card Title
    </Typography>
    <Typography variant="body2" color="muted">
        Card description
    </Typography>
</Card.Header>
```

### Error Message

```tsx
<Typography variant="caption" color="error">
    This field is required
</Typography>
```

### Dashboard Stats

```tsx
<Typography variant="overline" color="muted">
    Total Sales
</Typography>
<Typography variant="h3" color="success">
    $48,352
</Typography>
```

### Footer

```tsx
<Typography variant="caption" color="secondary" align="center">
    © 2025 Your Company. All rights reserved.
</Typography>
```
