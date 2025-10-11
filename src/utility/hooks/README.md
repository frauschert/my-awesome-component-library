# React Hooks

Custom React hooks for common use cases in the component library.

## Table of Contents

-   [useKeyPress](#usekeypress)
-   [useDebounce](#usedebounce)
-   [usePrevious](#useprevious)
-   [useLocalStorage](#uselocalstorage)
-   [useSessionStorage](#usesessionstorage)
-   [useOnClickOutside](#useonclickoutside)

---

## useKeyPress

Detects when a specific key or keys are pressed.

### API

```ts
useKeyPress(
  targetKey: string | string[],
  eventTarget?: EventTarget
): boolean
```

### Parameters

-   **targetKey**: The key(s) to listen for (e.g., `'Enter'`, `'Escape'`, `['a', 'A']`)
-   **eventTarget** (optional): The target to attach the event listener to (defaults to `window`)

### Returns

`boolean` - `true` if the key is currently pressed, `false` otherwise

### Usage

```tsx
import { useKeyPress } from './utility/hooks'

function Modal({ onClose }) {
    const escapePressed = useKeyPress('Escape')

    useEffect(() => {
        if (escapePressed) {
            onClose()
        }
    }, [escapePressed, onClose])

    return <div>Modal content</div>
}
```

```tsx
// Multiple keys (case-insensitive)
function SearchBox() {
    const cmdPressed = useKeyPress(['Meta', 'Control']) // Cmd on Mac, Ctrl on Windows
    const kPressed = useKeyPress(['k', 'K'])

    useEffect(() => {
        if (cmdPressed && kPressed) {
            // Handle Cmd+K or Ctrl+K
            console.log('Search shortcut triggered')
        }
    }, [cmdPressed, kPressed])

    return <input type="text" placeholder="Search..." />
}
```

```tsx
// Keyboard navigation
function List({ items }) {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const upPressed = useKeyPress('ArrowUp')
    const downPressed = useKeyPress('ArrowDown')
    const enterPressed = useKeyPress('Enter')

    useEffect(() => {
        if (upPressed && selectedIndex > 0) {
            setSelectedIndex((i) => i - 1)
        }
    }, [upPressed])

    useEffect(() => {
        if (downPressed && selectedIndex < items.length - 1) {
            setSelectedIndex((i) => i + 1)
        }
    }, [downPressed])

    useEffect(() => {
        if (enterPressed) {
            console.log('Selected:', items[selectedIndex])
        }
    }, [enterPressed])

    return (
        <ul>
            {items.map((item, i) => (
                <li
                    key={i}
                    style={{
                        background: i === selectedIndex ? 'blue' : 'white',
                    }}
                >
                    {item}
                </li>
            ))}
        </ul>
    )
}
```

```tsx
// Custom event target (specific element)
function GameCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const spacePressed = useKeyPress(' ', canvasRef.current)

    useEffect(() => {
        if (spacePressed) {
            // Jump!
        }
    }, [spacePressed])

    return <canvas ref={canvasRef} tabIndex={0} />
}
```

### Behavior and limitations

-   Returns `true` when key is pressed down, `false` when released
-   Supports single key or array of keys
-   Case-sensitive by default (use array for case-insensitive: `['a', 'A']`)
-   Works with special keys: `Enter`, `Escape`, `Tab`, `Space`, arrow keys, function keys
-   Works with modifier keys: `Shift`, `Control`, `Alt`, `Meta`
-   Event listeners are automatically cleaned up on unmount
-   Can listen to custom event targets (useful for specific elements)

### Common use cases

-   Modal dismiss on Escape
-   Form submission on Enter
-   Keyboard shortcuts (Cmd+K, Ctrl+S)
-   Keyboard navigation (arrow keys)
-   Game controls (WASD, Space)
-   Accessibility features
-   Search box activation
-   Quick actions

### Tests

See `src/utility/hooks/__tests__/useKeyPress.test.tsx` for comprehensive tests covering basic functionality, multiple keys, special keys, custom targets, dynamic changes, practical use cases, cleanup, and edge cases.

---

## useDebounce

Debounces a value, delaying updates until after a specified delay period.

### Usage

```tsx
import { useDebounce } from './utility/hooks'

function SearchInput() {
    const [searchTerm, setSearchTerm] = useState('')
    const debouncedSearch = useDebounce.default(searchTerm, 500)

    useEffect(() => {
        // API call with debounced value
        fetchResults(debouncedSearch)
    }, [debouncedSearch])

    return (
        <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
    )
}
```

---

## usePrevious

Returns the previous value of a state or prop.

### Usage

```tsx
import { usePrevious } from './utility/hooks'

function Counter() {
    const [count, setCount] = useState(0)
    const previousCount = usePrevious.default(count)

    return (
        <div>
            <p>Current: {count}</p>
            <p>Previous: {previousCount}</p>
            <button onClick={() => setCount(count + 1)}>Increment</button>
        </div>
    )
}
```

---

## useLocalStorage

Syncs state with localStorage.

### API

```ts
useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void]
```

### Usage

```tsx
import { useLocalStorage } from './utility/hooks'

function ThemeSwitcher() {
    const [theme, setTheme] = useLocalStorage('theme', 'light')

    return (
        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
            Current theme: {theme}
        </button>
    )
}
```

### Behavior

-   Automatically persists to localStorage
-   Updates from other tabs/windows are synced
-   Returns tuple: `[value, setValue]`
-   Handles JSON serialization/deserialization
-   Falls back to initialValue if parsing fails

---

## useSessionStorage

Syncs state with sessionStorage (similar to useLocalStorage but per-session).

### API

```ts
useSessionStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void]
```

### Usage

```tsx
import { useSessionStorage } from './utility/hooks'

function FormWizard() {
    const [formData, setFormData] = useSessionStorage('wizardData', {})

    return (
        <form>{/* Form persists across page refreshes in same session */}</form>
    )
}
```

---

## useOnClickOutside

Detects clicks outside of a referenced element.

### API

```ts
useOnClickOutside(
  ref: RefObject<HTMLElement>,
  handler: (event: MouseEvent | TouchEvent) => void
): void
```

### Usage

```tsx
import { useOnClickOutside } from './utility/hooks'

function Dropdown() {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useOnClickOutside(dropdownRef, () => {
        setIsOpen(false)
    })

    return (
        <div ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
            {isOpen && <div>Dropdown content</div>}
        </div>
    )
}
```

### Behavior

-   Triggers handler when clicking outside the referenced element
-   Supports both mouse and touch events
-   Automatically cleans up event listeners
-   Common for dropdowns, modals, popovers

---

## Additional Hooks (Implemented but not yet exported)

The following hooks are implemented in the codebase but not yet exported from the main hooks index. They can be imported directly if needed:

-   `useToggle` - Boolean state toggling
-   `useCounter` - Counter with increment/reset
-   `useEventListener` - Managed event listeners
-   `useHover` - Track element hover state
-   `useAsync` - Async operation state management
-   `useTimeout` - Managed setTimeout
-   `useEffectOnce` - Run effect only once
-   `useLatestRef` - Always-current ref
-   `useMemoCompare` - Memoize with custom comparison
-   `useSize` - Track element size
-   `useOnScreen` - Intersection Observer
-   `useLongPress` - Detect long press
-   `useDoubleClick` - Detect double clicks
-   `useUndoRedo` - Undo/redo state
-   `useIdleEffect` - Run effects when idle
-   `useScrollIntoView` - Scroll element into view

See individual hook files for usage documentation.
