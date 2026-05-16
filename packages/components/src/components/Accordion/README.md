# Accordion

A flexible and accessible accordion component with support for single/multiple expansion modes, controlled/uncontrolled states, variants, and custom styling.

## Features

-   ✅ **Single & Multiple Expansion Modes** - Control whether one or multiple items can be open
-   ✅ **Controlled & Uncontrolled** - Use as controlled or uncontrolled component
-   ✅ **Visual Variants** - Default, bordered, and filled styles
-   ✅ **Size Variants** - Small, medium, and large sizes
-   ✅ **Smooth Animations** - Animated expand/collapse transitions
-   ✅ **Custom Icons** - Override default chevron icons
-   ✅ **Disabled State** - Disable entire accordion or individual items
-   ✅ **Rich Content** - Support for JSX/React nodes in titles and content
-   ✅ **Fully Accessible** - ARIA attributes, keyboard navigation, and semantic HTML
-   ✅ **Theme Support** - Integrates with theme system

## Installation

```bash
npm install @frauschert/my-awesome-component-library
# or
yarn add @frauschert/my-awesome-component-library
```

## Basic Usage

```tsx
import { Accordion } from '@frauschert/my-awesome-component-library'

const items = [
    {
        id: '1',
        title: 'What is React?',
        content: 'React is a JavaScript library for building user interfaces.',
    },
    {
        id: '2',
        title: 'What are Hooks?',
        content:
            'Hooks let you use state and other React features in functional components.',
    },
]

function App() {
    return <Accordion items={items} />
}
```

## Props

### AccordionProps

| Prop                   | Type                                  | Default      | Description                                |
| ---------------------- | ------------------------------------- | ------------ | ------------------------------------------ |
| `items`                | `AccordionItem[]`                     | **required** | Array of accordion items to display        |
| `expandedItems`        | `string[]`                            | `undefined`  | Controlled expanded item IDs               |
| `defaultExpandedItems` | `string[]`                            | `[]`         | Default expanded items (uncontrolled mode) |
| `mode`                 | `'single' \| 'multiple'`              | `'single'`   | Expansion behavior                         |
| `onChange`             | `(items: string[]) => void`           | `undefined`  | Called when expansion state changes        |
| `onExpand`             | `(itemId: string) => void`            | `undefined`  | Called when an item expands                |
| `onCollapse`           | `(itemId: string) => void`            | `undefined`  | Called when an item collapses              |
| `variant`              | `'default' \| 'bordered' \| 'filled'` | `'default'`  | Visual style variant                       |
| `size`                 | `'sm' \| 'md' \| 'lg'`                | `'md'`       | Size variant                               |
| `allowToggle`          | `boolean`                             | `true`       | Allow collapsing active item (single mode) |
| `disabled`             | `boolean`                             | `false`      | Disable all items                          |
| `expandIcon`           | `React.ReactNode`                     | chevron      | Custom expand icon                         |
| `collapseIcon`         | `React.ReactNode`                     | chevron      | Custom collapse icon                       |
| `className`            | `string`                              | `undefined`  | Additional CSS class for container         |
| `itemClassName`        | `string`                              | `undefined`  | Additional CSS class for items             |

### AccordionItem

| Prop       | Type              | Description                    |
| ---------- | ----------------- | ------------------------------ |
| `id`       | `string`          | Unique identifier for the item |
| `title`    | `React.ReactNode` | Item title/header              |
| `content`  | `React.ReactNode` | Item content/body              |
| `disabled` | `boolean`         | Disable this specific item     |
| `icon`     | `React.ReactNode` | Custom icon for this item      |

## Examples

### Uncontrolled Mode

Default behavior with internal state management:

```tsx
<Accordion items={items} defaultExpandedItems={['1']} mode="single" />
```

### Controlled Mode

Full control over expansion state:

```tsx
function ControlledAccordion() {
    const [expandedItems, setExpandedItems] = useState(['1'])

    return (
        <div>
            <button onClick={() => setExpandedItems([])}>Collapse All</button>
            <Accordion
                items={items}
                expandedItems={expandedItems}
                onChange={setExpandedItems}
            />
        </div>
    )
}
```

### Multiple Expansion Mode

Allow multiple items to be expanded simultaneously:

```tsx
<Accordion items={items} mode="multiple" defaultExpandedItems={['1', '3']} />
```

### Single Mode without Toggle

Prevent collapsing the active item in single mode:

```tsx
<Accordion
    items={items}
    mode="single"
    allowToggle={false}
    defaultExpandedItems={['1']}
/>
```

### Visual Variants

```tsx
// Bordered
<Accordion items={items} variant="bordered" />

// Filled
<Accordion items={items} variant="filled" />
```

### Size Variants

```tsx
// Small
<Accordion items={items} size="sm" />

// Medium (default)
<Accordion items={items} size="md" />

// Large
<Accordion items={items} size="lg" />
```

### Custom Icons

```tsx
<Accordion
    items={items}
    expandIcon={<span>+</span>}
    collapseIcon={<span>−</span>}
/>
```

### Rich Content

```tsx
const items = [
    {
        id: '1',
        title: <strong>Important Section</strong>,
        content: (
            <div>
                <p>Paragraph content</p>
                <ul>
                    <li>List item 1</li>
                    <li>List item 2</li>
                </ul>
            </div>
        ),
    },
]
```

### Disabled State

```tsx
// Disable all items
;<Accordion items={items} disabled />

// Disable individual items
const items = [
    { id: '1', title: 'Enabled', content: 'Can be toggled' },
    {
        id: '2',
        title: 'Disabled',
        content: 'Cannot be toggled',
        disabled: true,
    },
]
```

### Event Callbacks

```tsx
<Accordion
    items={items}
    onExpand={(id) => console.log('Expanded:', id)}
    onCollapse={(id) => console.log('Collapsed:', id)}
    onChange={(ids) => console.log('Current state:', ids)}
/>
```

## Styling

The component uses CSS modules with BEM naming convention. You can override styles using:

```scss
// Custom class
<Accordion className='my-accordion' / > .my-accordion {
    /* Override container styles */
}

// Item class
<Accordion itemClassName='my-item' / > .my-item {
    /* Override item styles */
}
```

### CSS Variables (Theme)

The component respects theme CSS variables:

```scss
--color-primary
--color-text
--color-bg
--color-border
--border-radius
--transition-duration
```

## Accessibility

The Accordion component follows WAI-ARIA accordion pattern:

-   **ARIA Attributes**
    -   `aria-expanded` on buttons indicates expansion state
    -   `aria-controls` links button to panel
    -   `aria-labelledby` links panel to heading
    -   `role="region"` on content panels
-   **Keyboard Navigation**

    -   `Enter` or `Space` - Toggle accordion item
    -   Focus management maintained through interactions

-   **Semantic HTML**
    -   Proper heading hierarchy (h3 by default)
    -   Button elements for interactive headers
    -   Semantic structure for screen readers

## TypeScript

Full TypeScript support with exported types:

```tsx
import type {
    AccordionProps,
    AccordionItem,
    AccordionMode,
    AccordionVariant,
    AccordionSize,
} from '@frauschert/my-awesome-component-library'
```

## Browser Support

-   Chrome (latest)
-   Firefox (latest)
-   Safari (latest)
-   Edge (latest)

## Related Components

-   **Button** - Interactive button component
-   **Modal** - Dialog component
-   **Tabs** - Tab-based navigation

## Best Practices

1. **Use Controlled Mode for Complex State** - When accordion state needs to sync with other components
2. **Provide Unique IDs** - Always use unique, stable IDs for items
3. **Keep Content Light** - Avoid heavy content that causes layout shifts
4. **Single vs Multiple Mode** - Choose based on content relationship (mutually exclusive vs independent)
5. **Accessibility** - Always provide meaningful titles for screen readers

## Examples in Storybook

See comprehensive examples in Storybook:

-   Default behavior
-   All mode variants
-   All visual variants
-   Size variations
-   Disabled states
-   Custom icons
-   Rich content
-   Controlled component
-   Edge cases

## Contributing

Contributions are welcome! Please follow the project's coding standards and include tests for new features.

## License

MIT
