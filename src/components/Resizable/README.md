# Resizable Component

A flexible wrapper component that adds VS Code-style resize handles to any content. Supports 8 resize directions (4 edges + 4 corners), constraints, aspect ratio preservation, and full keyboard accessibility.

## Features

-   ✅ **8 Resize Directions**: Top, right, bottom, left + 4 corners
-   ✅ **Size Constraints**: Min/max width and height
-   ✅ **Step Snapping**: Snap to grid increments
-   ✅ **Aspect Ratio**: Lock aspect ratio during resize
-   ✅ **Controlled/Uncontrolled**: Use as controlled or uncontrolled component
-   ✅ **Keyboard Support**: Resize with arrow keys (with Shift for larger increments)
-   ✅ **Accessibility**: Full ARIA support, keyboard navigation
-   ✅ **Visual Feedback**: Hover states and active resize indicators
-   ✅ **Customizable**: Custom handles, styling, and behavior
-   ✅ **TypeScript**: Full type safety

## Basic Usage

```tsx
import { Resizable } from './components/Resizable'

function App() {
    return (
        <Resizable width={400} height={300}>
            <div>Your content here</div>
        </Resizable>
    )
}
```

## Props

| Prop                  | Type                | Default    | Description                            |
| --------------------- | ------------------- | ---------- | -------------------------------------- |
| `children`            | `React.ReactNode`   | required   | Content to wrap with resize handles    |
| `width`               | `number`            | -          | Initial or controlled width in pixels  |
| `height`              | `number`            | -          | Initial or controlled height in pixels |
| `minWidth`            | `number`            | `50`       | Minimum width in pixels                |
| `minHeight`           | `number`            | `50`       | Minimum height in pixels               |
| `maxWidth`            | `number`            | `Infinity` | Maximum width in pixels                |
| `maxHeight`           | `number`            | `Infinity` | Maximum height in pixels               |
| `step`                | `number`            | `1`        | Snap resize to step increments         |
| `handles`             | `ResizableHandle[]` | all 8      | Which resize handles to show           |
| `className`           | `string`            | -          | Additional CSS class for wrapper       |
| `style`               | `CSSProperties`     | -          | Additional inline styles for wrapper   |
| `onResize`            | `(size) => void`    | -          | Callback fired during resize           |
| `onResizeStart`       | `(size) => void`    | -          | Callback fired when resize starts      |
| `onResizeEnd`         | `(size) => void`    | -          | Callback fired when resize ends        |
| `preserveAspectRatio` | `boolean`           | `false`    | Lock aspect ratio during resize        |
| `showHandlesOnHover`  | `boolean`           | `false`    | Only show handles on hover             |
| `disabled`            | `boolean`           | `false`    | Disable resizing                       |

### ResizableHandle Type

```typescript
type ResizableHandle =
    | 'top'
    | 'right'
    | 'bottom'
    | 'left'
    | 'topLeft'
    | 'topRight'
    | 'bottomLeft'
    | 'bottomRight'
```

## Examples

### Basic Resize

```tsx
<Resizable width={400} height={300}>
    <div>Resizable content</div>
</Resizable>
```

### With Constraints

```tsx
<Resizable
    width={300}
    height={200}
    minWidth={200}
    minHeight={150}
    maxWidth={600}
    maxHeight={400}
>
    <div>Content with size limits</div>
</Resizable>
```

### Specific Handles Only

```tsx
<Resizable
    width={400}
    height={300}
    handles={['right', 'bottom', 'bottomRight']}
>
    <div>Only resize from right and bottom</div>
</Resizable>
```

### Grid Snapping

```tsx
<Resizable width={300} height={200} step={20}>
    <div>Snaps to 20px grid</div>
</Resizable>
```

### Preserve Aspect Ratio

```tsx
<Resizable width={400} height={400} preserveAspectRatio>
    <div>Square that stays square</div>
</Resizable>
```

### Controlled Mode

```tsx
function ControlledExample() {
    const [size, setSize] = useState({ width: 400, height: 300 })

    return (
        <>
            <button onClick={() => setSize({ width: 300, height: 200 })}>
                Reset Size
            </button>
            <Resizable
                width={size.width}
                height={size.height}
                onResize={setSize}
            >
                <div>
                    Current size: {size.width} × {size.height}
                </div>
            </Resizable>
        </>
    )
}
```

### With Callbacks

```tsx
<Resizable
    width={400}
    height={300}
    onResizeStart={(size) => console.log('Started:', size)}
    onResize={(size) => console.log('Resizing:', size)}
    onResizeEnd={(size) => console.log('Ended:', size)}
>
    <div>Track resize events</div>
</Resizable>
```

### Show Handles on Hover

```tsx
<Resizable width={400} height={300} showHandlesOnHover>
    <div>Handles appear on hover</div>
</Resizable>
```

### Custom Styling

```tsx
<Resizable
    width={400}
    height={300}
    className="my-resizable"
    style={{
        border: '2px solid blue',
        borderRadius: '8px',
        background: '#f5f5f5',
    }}
>
    <div>Styled container</div>
</Resizable>
```

## Keyboard Support

When a resize handle is focused:

-   **Arrow Keys**: Resize by 10px in the corresponding direction
-   **Shift + Arrow Keys**: Resize by 50px in the corresponding direction
-   **Tab**: Navigate between resize handles
-   **Escape**: Cancel resize operation

## Accessibility

The Resizable component follows ARIA best practices:

-   Each handle has `role="separator"`
-   Handles have descriptive `aria-label` attributes
-   Edge handles have `aria-orientation` ("horizontal" or "vertical")
-   Handles are keyboard focusable (`tabIndex="0"`)
-   Visual focus indicators for keyboard navigation
-   Respects `prefers-reduced-motion` for animations

## Styling

The component uses BEM-style CSS classes:

-   `.resizable` - Main wrapper
-   `.resizable__content` - Content wrapper
-   `.resizable__handle` - Handle element
-   `.resizable__handle--{direction}` - Handle for specific direction
-   `.resizable--resizing` - Applied during resize
-   `.resizable--hover-handles` - Applied when `showHandlesOnHover` is true
-   `.resizable--disabled` - Applied when disabled

### Custom Styling Example

```scss
.my-resizable {
    .resizable__handle::before {
        background-color: red;
    }

    &.resizable--resizing {
        box-shadow: 0 0 0 2px blue;
    }
}
```

## Real-World Use Cases

### Inspector Panel

```tsx
function Inspector() {
    const [size, setSize] = useState({ width: 400, height: 600 })

    return (
        <Resizable
            width={size.width}
            height={size.height}
            minWidth={300}
            minHeight={400}
            handles={['left', 'topLeft', 'bottomLeft']}
            onResize={setSize}
        >
            <div className="inspector-panel">{/* Panel content */}</div>
        </Resizable>
    )
}
```

### Sidebar

```tsx
<Resizable width={250} minWidth={200} maxWidth={400} handles={['right']}>
    <nav className="sidebar">{/* Navigation items */}</nav>
</Resizable>
```

### Modal Dialog

```tsx
<Resizable
    width={600}
    height={400}
    minWidth={400}
    minHeight={300}
    maxWidth={1000}
    maxHeight={800}
>
    <div className="modal-content">{/* Modal content */}</div>
</Resizable>
```

### Image Cropper

```tsx
<Resizable width={300} height={300} preserveAspectRatio step={1}>
    <img src="photo.jpg" alt="Crop area" />
</Resizable>
```

## Browser Support

Works in all modern browsers that support:

-   CSS Grid
-   Pointer Events
-   CSS Custom Properties

## Performance Notes

-   Uses `requestAnimationFrame` internally for smooth resize operations
-   Event listeners are properly cleaned up on unmount
-   Pointer capture prevents event leaks
-   Optimized for 60fps resize operations

## Comparison to Similar Libraries

Unlike many resize libraries, this component:

-   ✅ Has zero dependencies
-   ✅ Supports all 8 resize directions out of the box
-   ✅ Includes full keyboard and accessibility support
-   ✅ Works as both controlled and uncontrolled component
-   ✅ Properly cleans up event listeners (no memory leaks)
-   ✅ Respects user motion preferences
-   ✅ TypeScript-first with complete type safety

## Common Patterns

### Persistent Size with localStorage

```tsx
function PersistentResizable() {
    const [size, setSize] = useState(() => {
        const saved = localStorage.getItem('panel-size')
        return saved ? JSON.parse(saved) : { width: 400, height: 300 }
    })

    const handleResize = (newSize) => {
        setSize(newSize)
        localStorage.setItem('panel-size', JSON.stringify(newSize))
    }

    return (
        <Resizable
            width={size.width}
            height={size.height}
            onResize={handleResize}
        >
            <div>Content with persistent size</div>
        </Resizable>
    )
}
```

### Responsive Constraints

```tsx
function ResponsiveResizable() {
    const [maxSize, setMaxSize] = useState({ width: 800, height: 600 })

    useEffect(() => {
        const updateMax = () => {
            setMaxSize({
                width: window.innerWidth - 100,
                height: window.innerHeight - 100,
            })
        }
        window.addEventListener('resize', updateMax)
        return () => window.removeEventListener('resize', updateMax)
    }, [])

    return (
        <Resizable
            width={400}
            height={300}
            maxWidth={maxSize.width}
            maxHeight={maxSize.height}
        >
            <div>Respects viewport size</div>
        </Resizable>
    )
}
```

## Troubleshooting

### Resize not working

-   Ensure the component has a defined size (width/height props or CSS)
-   Check that `disabled` prop is not set to `true`
-   Verify handles are in the `handles` array

### Jumpy resize behavior

-   Use the `step` prop to snap to increments
-   Check for conflicting CSS that might affect sizing

### Performance issues

-   Throttle the `onResize` callback if performing expensive operations
-   Use `onResizeEnd` instead of `onResize` for heavy computations
-   Consider debouncing state updates in controlled mode

## License

MIT
