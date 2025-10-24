# Layout Primitives

This library provides three fundamental layout components: **Grid**, **Stack**, and **Container**. These components work together to create flexible, responsive layouts with minimal effort.

## Quick Overview

-   **Grid** - CSS Grid-based 2D layouts with responsive columns, gaps, and alignment
-   **Stack** - Flexbox-based 1D layouts (vertical/horizontal) with spacing and dividers
-   **Container** - Responsive max-width wrapper for centering and constraining content

---

## Grid

CSS Grid-based layout system with responsive columns, flexible gaps, and powerful alignment.

### Basic Usage

```tsx
import { Grid, GridItem } from '@frauschert/my-awesome-component-library'

// Simple grid
<Grid columns={3} gap="md">
    <div>Item 1</div>
    <div>Item 2</div>
    <div>Item 3</div>
</Grid>

// Responsive columns
<Grid columns={{ xs: 1, md: 2, lg: 3 }} gap="lg">
    <div>Responsive item 1</div>
    <div>Responsive item 2</div>
    <div>Responsive item 3</div>
</Grid>

// GridItem with custom spans
<Grid columns={12}>
    <GridItem colSpan={{ xs: 12, md: 6, lg: 4 }}>
        Responsive column span
    </GridItem>
    <GridItem colSpan={8}>
        Spans 8 columns
    </GridItem>
</Grid>
```

### Props

**Grid Props:**

-   `columns?: number | ResponsiveValue` - Number of columns (default: 12)
-   `gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'` - Gap between items (default: 'md')
-   `autoFit?: boolean` - Auto-fit columns to available space
-   `autoFill?: boolean` - Auto-fill with minimum column size
-   `minColWidth?: string` - Minimum column width for auto-fit/fill (e.g., '200px')
-   `justifyItems?: 'start' | 'end' | 'center' | 'stretch'` - Justify items within cells
-   `alignItems?: 'start' | 'end' | 'center' | 'stretch'` - Align items within cells
-   `justifyContent?: 'start' | 'end' | 'center' | 'stretch' | 'space-between' | 'space-around' | 'space-evenly'`
-   `alignContent?: 'start' | 'end' | 'center' | 'stretch' | 'space-between' | 'space-around' | 'space-evenly'`

**GridItem Props:**

-   `colSpan?: number | ResponsiveValue` - Number of columns to span
-   `rowSpan?: number | ResponsiveValue` - Number of rows to span
-   `colStart?: number | ResponsiveValue` - Starting column position
-   `colEnd?: number | ResponsiveValue` - Ending column position
-   `rowStart?: number | ResponsiveValue` - Starting row position
-   `rowEnd?: number | ResponsiveValue` - Ending row position

**ResponsiveValue:** `{ xs?: T; sm?: T; md?: T; lg?: T; xl?: T }`

### Gap Sizes

-   `none`: 0
-   `xs`: 0.25rem (4px)
-   `sm`: 0.5rem (8px)
-   `md`: 1rem (16px)
-   `lg`: 1.5rem (24px)
-   `xl`: 2rem (32px)

### Breakpoints

-   `xs`: 480px
-   `sm`: 640px
-   `md`: 768px
-   `lg`: 1024px
-   `xl`: 1280px

---

## Stack

Flexbox-based layout for vertical or horizontal stacking with spacing and optional dividers.

### Basic Usage

```tsx
import { Stack } from '@frauschert/my-awesome-component-library'

// Vertical stack (default)
<Stack gap="md">
    <div>Item 1</div>
    <div>Item 2</div>
    <div>Item 3</div>
</Stack>

// Horizontal stack
<Stack direction="horizontal" gap="lg">
    <button>Action 1</button>
    <button>Action 2</button>
</Stack>

// With dividers
<Stack direction="horizontal" gap="md" divider>
    <span>Option A</span>
    <span>Option B</span>
    <span>Option C</span>
</Stack>

// Responsive direction
<Stack direction={{ xs: 'vertical', md: 'horizontal' }} gap="md">
    <div>Stacks vertically on mobile</div>
    <div>Horizontal on desktop</div>
</Stack>
```

### Props

-   `direction?: 'vertical' | 'horizontal' | ResponsiveDirection` - Stack direction (default: 'vertical')
-   `gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'` - Space between items (default: 'md')
-   `align?: 'start' | 'end' | 'center' | 'stretch' | 'baseline'` - Cross-axis alignment
-   `justify?: 'start' | 'end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'` - Main-axis alignment
-   `wrap?: boolean` - Allow items to wrap (default: false)
-   `reverse?: boolean` - Reverse item order (default: false)
-   `fill?: boolean` - Children take equal space (default: false)
-   `divider?: boolean | ReactNode` - Show divider between items

**ResponsiveDirection:** `{ xs?: Direction; sm?: Direction; md?: Direction; lg?: Direction; xl?: Direction }`

### Gap Sizes

Same as Grid: `none`, `xs`, `sm`, `md`, `lg`, `xl`

---

## Container

Responsive max-width wrapper for centering and constraining content.

### Basic Usage

```tsx
import { Container } from '@frauschert/my-awesome-component-library'

// Default container (1024px max)
<Container>
    <h1>Page content</h1>
</Container>

// Small container
<Container size="sm">
    <p>Narrower content area</p>
</Container>

// Full width with gutters
<Container size="full" gutter>
    <div>Full width with padding</div>
</Container>

// Fluid container (no max-width)
<Container fluid>
    <div>Stretches to viewport width</div>
</Container>
```

### Props

-   `size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'` - Maximum width (default: 'lg')
-   `center?: boolean` - Center horizontally (default: true)
-   `gutter?: boolean` - Add horizontal padding (default: true)
-   `fluid?: boolean` - No max-width constraint (default: false)

### Sizes

-   `sm`: 640px
-   `md`: 768px
-   `lg`: 1024px (default)
-   `xl`: 1280px
-   `full`: 100%

### Gutter Padding

-   Mobile (< 640px): 1rem (16px)
-   Tablet (640px+): 1.5rem (24px)
-   Desktop (768px+): 2rem (32px)

---

## Common Patterns

### Page Layout

```tsx
<Container size="xl">
    <Stack gap="lg">
        <header>
            <h1>Page Title</h1>
        </header>
        <Grid columns={{ xs: 1, md: 3 }} gap="md">
            <Card>Feature 1</Card>
            <Card>Feature 2</Card>
            <Card>Feature 3</Card>
        </Grid>
    </Stack>
</Container>
```

### Dashboard Layout

```tsx
<Container size="full" gutter>
    <Grid columns={12} gap="md">
        <GridItem colSpan={{ xs: 12, lg: 3 }}>
            <Sidebar />
        </GridItem>
        <GridItem colSpan={{ xs: 12, lg: 9 }}>
            <Stack gap="lg">
                <DashboardHeader />
                <Grid columns={{ xs: 1, sm: 2, lg: 3 }} gap="md">
                    <Widget />
                    <Widget />
                    <Widget />
                </Grid>
            </Stack>
        </GridItem>
    </Grid>
</Container>
```

### Form Layout

```tsx
<Container size="md">
    <Stack gap="lg">
        <h2>Contact Form</h2>
        <Grid columns={{ xs: 1, md: 2 }} gap="md">
            <Input label="First Name" />
            <Input label="Last Name" />
            <GridItem colSpan={{ xs: 1, md: 2 }}>
                <Input label="Email" />
            </GridItem>
            <GridItem colSpan={{ xs: 1, md: 2 }}>
                <Input label="Message" multiline />
            </GridItem>
        </Grid>
        <Stack direction="horizontal" justify="end" gap="sm">
            <Button variant="secondary">Cancel</Button>
            <Button variant="primary">Submit</Button>
        </Stack>
    </Stack>
</Container>
```

### Navigation Bar

```tsx
<Container size="full" gutter>
    <Stack direction="horizontal" justify="space-between" align="center">
        <Logo />
        <Stack direction="horizontal" gap="md" align="center">
            <NavLink>Home</NavLink>
            <NavLink>About</NavLink>
            <NavLink>Contact</NavLink>
            <Button>Sign In</Button>
        </Stack>
    </Stack>
</Container>
```

---

## Best Practices

1. **Use Container for page-level layouts** - Wrap your main content in Container for consistent max-widths
2. **Stack for linear flows** - Use Stack for forms, navigation, lists, and any vertical/horizontal sequences
3. **Grid for 2D layouts** - Use Grid when you need both rows and columns
4. **Combine components** - Stack inside Grid, Container wrapping Grid, etc.
5. **Responsive by default** - Leverage responsive props for mobile-first designs
6. **Semantic HTML** - Use the `as` prop to render appropriate semantic elements

## Accessibility

All three components:

-   Support custom `className` and `style` props
-   Forward all HTML attributes
-   Can render as any HTML element via the `as` prop
-   Work with screen readers and keyboard navigation
-   Support ARIA attributes

---

## Examples

See the Storybook documentation for interactive examples:

-   Grid: Basic layouts, responsive columns, dashboard layouts
-   Stack: Forms, navigation, dividers, responsive direction
-   Container: Page layouts, content areas, max-width control
