# RangeInput

A fully accessible, feature-rich range slider component with dual input controls (slider + number input), built with React and TypeScript.

## Features

-   🎯 **Dual Input Controls**: Visual slider with synchronized number input
-   ♿ **Fully Accessible**: WCAG 2.1 compliant with complete ARIA support
-   🎨 **Customizable**: 3 sizes, 5 color variants, custom formatting
-   ⚡ **Performance**: React.memo optimization prevents unnecessary re-renders
-   🎛️ **Controlled & Uncontrolled**: Supports both patterns
-   🔔 **Lifecycle Callbacks**: Track drag start/end events
-   ⏱️ **Debounce Support**: Optional debouncing for expensive onChange handlers
-   📱 **Touch-Friendly**: Works seamlessly on mobile devices
-   🎨 **Theming**: CSS custom properties for easy theming
-   🔢 **Flexible**: Supports integers, decimals, negative ranges

## Installation

```tsx
import { RangeInput } from 'my-awesome-component-library'
```

## Basic Usage

### Uncontrolled

```tsx
function VolumeControl() {
    return (
        <RangeInput
            defaultValue={50}
            min={0}
            max={100}
            label="Volume"
            onChange={(value) => console.log('Volume:', value)}
        />
    )
}
```

### Controlled

```tsx
function BrightnessControl() {
    const [brightness, setBrightness] = useState(75)

    return (
        <RangeInput
            value={brightness}
            onChange={setBrightness}
            min={0}
            max={100}
            label="Brightness"
            showTooltip
        />
    )
}
```

## Props API

| Prop              | Type                                                            | Default        | Description                                   |
| ----------------- | --------------------------------------------------------------- | -------------- | --------------------------------------------- |
| `value`           | `number`                                                        | `undefined`    | Controlled value (makes component controlled) |
| `defaultValue`    | `number`                                                        | `0`            | Initial value for uncontrolled component      |
| `min`             | `number`                                                        | **Required**   | Minimum value                                 |
| `max`             | `number`                                                        | **Required**   | Maximum value                                 |
| `step`            | `number`                                                        | `1`            | Step increment (supports decimals)            |
| `onChange`        | `(value: number) => void`                                       | `undefined`    | Called when value changes                     |
| `onChangeStart`   | `() => void`                                                    | `undefined`    | Called when dragging starts                   |
| `onChangeEnd`     | `() => void`                                                    | `undefined`    | Called when dragging ends                     |
| `debounce`        | `number`                                                        | `0`            | Debounce delay in ms (0 = instant)            |
| `showTooltip`     | `boolean`                                                       | `false`        | Show value tooltip above thumb                |
| `showMinMax`      | `boolean`                                                       | `false`        | Show min/max labels below track               |
| `showNumberInput` | `boolean`                                                       | `true`         | Show number input field                       |
| `disabled`        | `boolean`                                                       | `false`        | Disable the input                             |
| `label`           | `string`                                                        | **Required**   | Accessible label for screen readers           |
| `formatValue`     | `(value: number) => string`                                     | `String`       | Custom formatter for display values           |
| `size`            | `'sm' \| 'md' \| 'lg'`                                          | `'md'`         | Visual size variant                           |
| `variant`         | `'primary' \| 'secondary' \| 'success' \| 'error' \| 'warning'` | `'primary'`    | Color theme                                   |
| `className`       | `string`                                                        | `undefined`    | Additional CSS classes                        |
| `id`              | `string`                                                        | auto-generated | Custom element ID                             |

## Advanced Examples

### Price Range with Formatting

```tsx
function PriceFilter() {
    const [price, setPrice] = useState(500)

    return (
        <RangeInput
            value={price}
            onChange={setPrice}
            min={0}
            max={1000}
            step={10}
            label="Maximum Price"
            formatValue={(value) => `$${value.toLocaleString()}`}
            showTooltip
            showMinMax
            variant="success"
        />
    )
}
```

### Temperature with Negative Range

```tsx
function TemperatureControl() {
    return (
        <RangeInput
            defaultValue={-20}
            min={-100}
            max={0}
            label="Freezer Temperature"
            formatValue={(value) => `${value}°C`}
            showTooltip
            variant="primary"
        />
    )
}
```

### Opacity with Decimal Steps

```tsx
function OpacityControl() {
    const [opacity, setOpacity] = useState(1)

    return (
        <RangeInput
            value={opacity}
            onChange={setOpacity}
            min={0}
            max={1}
            step={0.1}
            label="Opacity"
            formatValue={(value) => value.toFixed(1)}
            showTooltip
            showMinMax
        />
    )
}
```

### Debounced onChange

```tsx
function ExpensiveOperation() {
    const handleChange = (value: number) => {
        // Expensive API call or calculation
        console.log('Expensive operation:', value)
    }

    return (
        <RangeInput
            defaultValue={50}
            min={0}
            max={100}
            label="Quality"
            onChange={handleChange}
            debounce={500} // Only call onChange after 500ms of inactivity
            showTooltip
        />
    )
}
```

### Track Dragging State

```tsx
function AudioPlayer() {
    const [volume, setVolume] = useState(50)
    const [isDragging, setIsDragging] = useState(false)

    return (
        <div>
            <RangeInput
                value={volume}
                onChange={setVolume}
                onChangeStart={() => setIsDragging(true)}
                onChangeEnd={() => setIsDragging(false)}
                min={0}
                max={100}
                label="Volume"
                showTooltip
            />
            {isDragging && <p>Adjusting volume...</p>}
        </div>
    )
}
```

### Slider Only (No Number Input)

```tsx
function MinimalSlider() {
    return (
        <RangeInput
            defaultValue={50}
            min={0}
            max={100}
            label="Preference"
            showNumberInput={false}
            showTooltip
            size="lg"
        />
    )
}
```

## Styling

### Size Variants

-   **`sm`**: Compact size (16px thumb, 4px track, 60px number input)
-   **`md`**: Default size (20px thumb, 6px track, 80px number input)
-   **`lg`**: Large size (24px thumb, 8px track, 100px number input)

### Color Variants

-   **`primary`**: Blue (#3b82f6)
-   **`secondary`**: Gray (#6b7280)
-   **`success`**: Green (#10b981)
-   **`error`**: Red (#ef4444)
-   **`warning`**: Yellow/Orange (#f59e0b)

### Custom Theming

Override CSS custom properties for full control:

```css
.custom-range {
    --range-thumb-color: #8b5cf6;
    --range-track-bg: #e9d5ff;
    --range-track-fill-bg: #8b5cf6;
    --range-number-focus-color: #8b5cf6;
}
```

## Accessibility

RangeInput is built with accessibility as a priority:

-   ✅ **Keyboard Navigation**: Full keyboard support (arrow keys, Page Up/Down, Home/End)
-   ✅ **Screen Reader Support**: Proper ARIA attributes (`role="slider"`, `aria-valuemin/max/now/text`)
-   ✅ **Label Association**: Explicit label linking with unique IDs
-   ✅ **Focus Management**: Visible focus indicators with high contrast
-   ✅ **Value Announcements**: Screen readers announce current value and label
-   ✅ **Semantic HTML**: Uses proper form controls with native behavior

### ARIA Attributes

The component automatically sets:

-   `role="slider"` on the range input
-   `aria-valuemin` and `aria-valuemax` for bounds
-   `aria-valuenow` for current value
-   `aria-valuetext` for formatted value (when `formatValue` is provided)
-   `aria-labelledby` linking to the label

## Controlled vs Uncontrolled

### Uncontrolled (Recommended for Simple Cases)

Use `defaultValue` when you don't need to programmatically control the value:

```tsx
<RangeInput
    defaultValue={50}
    min={0}
    max={100}
    label="Volume"
    onChange={(value) => console.log(value)}
/>
```

The component manages its own state internally. `onChange` is called with the initial value on mount and whenever the value changes.

### Controlled (Recommended for Forms)

Use `value` when you need external control:

```tsx
const [volume, setVolume] = useState(50)

<RangeInput
    value={volume}
    onChange={setVolume}
    min={0}
    max={100}
    label="Volume"
/>

<button onClick={() => setVolume(75)}>Set to 75</button>
```

The component is fully controlled by the parent. You can programmatically change the value at any time.

## Value Validation

RangeInput automatically validates and corrects values:

1. **Clamping**: Values are clamped to `[min, max]` range
2. **Step Snapping**: Values snap to the nearest valid step
3. **Floating Point Precision**: Handles decimal steps correctly

```tsx
<RangeInput defaultValue={23} min={0} max={100} step={10} label="Quantity" />
// Value will snap to 20 (nearest step)
```

## Performance

-   **React.memo**: Component is memoized to prevent re-renders when props haven't changed
-   **Optimized Debounce**: Debouncing only applied to `onChange`, not to internal state updates
-   **Efficient Event Handling**: Uses React's synthetic events with proper cleanup

## Browser Support

-   ✅ Chrome/Edge (latest 2 versions)
-   ✅ Firefox (latest 2 versions)
-   ✅ Safari (latest 2 versions)
-   ✅ Mobile browsers (iOS Safari, Chrome Android)

## Common Patterns

### Form Integration

```tsx
function SettingsForm() {
    const [settings, setSettings] = useState({
        volume: 50,
        brightness: 75,
        contrast: 100,
    })

    const handleChange = (field: string) => (value: number) => {
        setSettings((prev) => ({ ...prev, [field]: value }))
    }

    return (
        <form>
            <RangeInput
                value={settings.volume}
                onChange={handleChange('volume')}
                min={0}
                max={100}
                label="Volume"
            />
            <RangeInput
                value={settings.brightness}
                onChange={handleChange('brightness')}
                min={0}
                max={100}
                label="Brightness"
            />
            <RangeInput
                value={settings.contrast}
                onChange={handleChange('contrast')}
                min={0}
                max={200}
                label="Contrast"
            />
        </form>
    )
}
```

### Validation with External State

```tsx
function ValidatedRange() {
    const [value, setValue] = useState(50)
    const [error, setError] = useState<string | null>(null)

    const handleChange = (newValue: number) => {
        setValue(newValue)

        if (newValue < 30) {
            setError('Value too low (minimum recommended: 30)')
        } else if (newValue > 80) {
            setError('Value too high (maximum recommended: 80)')
        } else {
            setError(null)
        }
    }

    return (
        <div>
            <RangeInput
                value={value}
                onChange={handleChange}
                min={0}
                max={100}
                label="Power Level"
                variant={error ? 'error' : 'success'}
                showTooltip
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    )
}
```

## Tips

1. **Use `formatValue` for units**: Always show units (%, $, °, etc.) for clarity
2. **Enable `showTooltip` for better UX**: Helps users see exact values while dragging
3. **Use `debounce` for expensive operations**: Prevents performance issues with frequent updates
4. **Prefer controlled mode in forms**: Easier to manage form state and validation
5. **Use semantic variants**: Match the variant to the context (error for low battery, success for good values, etc.)
6. **Choose appropriate step sizes**: Too small steps can be frustrating, too large can be imprecise

## License

MIT
