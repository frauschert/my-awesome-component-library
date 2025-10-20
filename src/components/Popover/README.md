# Popover

A versatile positioned floating container component that can be used for menus, forms, tooltips, or detailed information displays.

## Features

-   ✅ **12 placement options** - top, bottom, left, right with start/center/end variations
-   ✅ **Multiple triggers** - click, hover, focus, or manual control
-   ✅ **Smart positioning** - Automatically stays within viewport bounds
-   ✅ **Portal rendering** - Renders in document.body to avoid z-index issues
-   ✅ **Controlled & uncontrolled** - Flexible state management
-   ✅ **Arrow indicator** - Optional arrow pointing to trigger element
-   ✅ **Customizable delays** - Configure hover enter/leave delays
-   ✅ **Click outside handling** - Optional close on outside click
-   ✅ **Keyboard support** - Close with Escape key
-   ✅ **Dark theme support** - Automatic theme adaptation
-   ✅ **TypeScript support** - Full type definitions
-   ✅ **Accessible** - Proper ARIA attributes

## Installation

```typescript
import { Popover } from 'my-awesome-component-library'
import type {
    PopoverProps,
    PopoverPlacement,
    PopoverTrigger,
} from 'my-awesome-component-library'
```

## Basic Usage

```tsx
<Popover content="This is helpful information">
    <Button>Click me</Button>
</Popover>
```

## Triggers

### Click Trigger (Default)

```tsx
<Popover content="Opens on click" trigger="click">
    <Button>Click me</Button>
</Popover>
```

### Hover Trigger

```tsx
<Popover
    content="Opens on hover"
    trigger="hover"
    mouseEnterDelay={100}
    mouseLeaveDelay={100}
>
    <Button>Hover me</Button>
</Popover>
```

### Focus Trigger

```tsx
<Popover content="Opens on focus" trigger="focus">
    <Button>Focus me</Button>
</Popover>
```

### Manual Control

```tsx
function ControlledPopover() {
    const [open, setOpen] = useState(false)

    return (
        <Popover
            content="Manually controlled"
            trigger="manual"
            open={open}
            onOpenChange={setOpen}
        >
            <Button onClick={() => setOpen(!open)}>Toggle</Button>
        </Popover>
    )
}
```

## Placements

Popover supports 12 different placements:

-   **Top**: `top`, `top-start`, `top-end`
-   **Bottom**: `bottom`, `bottom-start`, `bottom-end`
-   **Left**: `left`, `left-start`, `left-end`
-   **Right**: `right`, `right-start`, `right-end`

```tsx
<Popover content="Content" placement="top-start">
    <Button>Top Start</Button>
</Popover>
```

## Rich Content

Popovers can contain any React content:

```tsx
<Popover
    content={
        <div>
            <h3>User Profile</h3>
            <p>Manage your account settings</p>
            <Button>View Profile</Button>
        </div>
    }
>
    <Button>Profile Menu</Button>
</Popover>
```

## Form Content

```tsx
<Popover
    closeOnClickOutside={false}
    content={
        <form>
            <textarea placeholder="Your message..." />
            <Button type="submit">Send</Button>
        </form>
    }
>
    <Button>Quick Reply</Button>
</Popover>
```

## Customization

### Custom Arrow

```tsx
<Popover content="No arrow" showArrow={false}>
    <Button>No Arrow</Button>
</Popover>
```

### Custom Offset

```tsx
<Popover content="Custom spacing" offset={20}>
    <Button>More Space</Button>
</Popover>
```

### Custom Z-Index

```tsx
<Popover content="Higher z-index" zIndex={2000}>
    <Button>On Top</Button>
</Popover>
```

### Custom Styling

```tsx
<Popover content="Styled popover" className="custom-popover">
    <Button>Custom Style</Button>
</Popover>
```

```css
.custom-popover {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    color: white;
}
```

## Props

| Prop                  | Type                      | Default     | Description                       |
| --------------------- | ------------------------- | ----------- | --------------------------------- |
| `content`             | `ReactNode`               | required    | Content to display in the popover |
| `children`            | `ReactNode`               | required    | Element that triggers the popover |
| `placement`           | `PopoverPlacement`        | `'bottom'`  | Placement relative to trigger     |
| `trigger`             | `PopoverTrigger`          | `'click'`   | How the popover is triggered      |
| `open`                | `boolean`                 | `undefined` | Controlled open state             |
| `defaultOpen`         | `boolean`                 | `false`     | Default open state (uncontrolled) |
| `onOpenChange`        | `(open: boolean) => void` | `undefined` | Called when open state changes    |
| `showArrow`           | `boolean`                 | `true`      | Show arrow pointing to trigger    |
| `offset`              | `number`                  | `8`         | Distance from trigger (pixels)    |
| `closeOnClickOutside` | `boolean`                 | `true`      | Close on click outside            |
| `closeOnEscape`       | `boolean`                 | `true`      | Close on Escape key               |
| `className`           | `string`                  | `undefined` | Custom className for content      |
| `mouseEnterDelay`     | `number`                  | `100`       | Delay before showing (ms)         |
| `mouseLeaveDelay`     | `number`                  | `100`       | Delay before hiding (ms)          |
| `disabled`            | `boolean`                 | `false`     | Disable the popover               |
| `zIndex`              | `number`                  | `1000`      | Z-index of the popover            |

## Types

### PopoverPlacement

```typescript
type PopoverPlacement =
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end'
    | 'right'
    | 'right-start'
    | 'right-end'
```

### PopoverTrigger

```typescript
type PopoverTrigger = 'click' | 'hover' | 'focus' | 'manual'
```

## Common Patterns

### Info Popover

```tsx
<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <span>Hover for more information</span>
    <Popover
        content="Additional context about this feature"
        trigger="hover"
        placement="top"
    >
        <InfoIcon />
    </Popover>
</div>
```

### Menu Popover

```tsx
<Popover
    content={
        <div>
            <MenuItem>Edit</MenuItem>
            <MenuItem>Delete</MenuItem>
            <MenuItem>Share</MenuItem>
        </div>
    }
    placement="bottom-end"
>
    <Button>Actions</Button>
</Popover>
```

### Confirmation Popover

```tsx
<Popover
    closeOnClickOutside={false}
    content={
        <div>
            <p>Are you sure?</p>
            <Button onClick={handleConfirm}>Yes</Button>
            <Button onClick={() => setOpen(false)}>No</Button>
        </div>
    }
    open={open}
    onOpenChange={setOpen}
>
    <Button>Delete</Button>
</Popover>
```

## Accessibility

-   Uses `role="dialog"` for proper screen reader support
-   Sets `aria-modal="false"` as popovers are non-modal
-   Supports keyboard navigation (Escape to close)
-   Maintains focus management for trigger elements
-   Proper ARIA labeling for interactive content

## Best Practices

1. **Choose the right trigger** - Use `hover` for non-critical info, `click` for interactive content
2. **Limit content size** - Keep popovers concise and focused
3. **Consider placement** - Test placement on different screen sizes
4. **Use proper delays** - Give users time to move mouse without flickering
5. **Handle edge cases** - Test near viewport edges
6. **Accessible content** - Ensure popover content is keyboard accessible
7. **Close mechanisms** - Always provide a way to close (outside click, escape, or button)

## Dark Theme

Popover automatically adapts to dark theme:

```tsx
<div data-theme="dark">
    <Popover content="Dark theme popover">
        <Button>Open</Button>
    </Popover>
</div>
```

## Browser Support

-   Chrome (latest)
-   Firefox (latest)
-   Safari (latest)
-   Edge (latest)

## Related Components

-   **Tooltip** - For simple text hints
-   **Dropdown** - For select menus
-   **Modal** - For blocking dialogs
-   **ContextMenu** - For right-click menus
