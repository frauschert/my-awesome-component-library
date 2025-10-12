# React Hooks

Custom React hooks for common use cases in the component library.

## Table of Contents

-   [useKeyPress](#usekeypress)
-   [useOnScreen](#useonscreen)
-   [useEventListener](#useeventlistener)
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

## useOnScreen

Detects when an element enters or leaves the viewport using the IntersectionObserver API.

### API

```ts
useOnScreen(
  ref: RefObject<HTMLElement>,
  rootMargin?: string
): boolean
```

### Parameters

-   **ref**: A React ref object pointing to the element to observe
-   **rootMargin** (optional): Margin around the root element for early/late detection (default: `'0px'`)
    -   Accepts CSS margin values: `'0px'`, `'100px'`, `'-50px'`, `'50px 0px'`, etc.
    -   Positive values trigger earlier, negative values trigger later

### Returns

`boolean` - `true` when the element is visible in the viewport, `false` otherwise

### Usage

```tsx
import { useOnScreen } from './utility/hooks'
import { useRef } from 'react'

// Lazy loading images
function LazyImage({ src, alt }) {
    const imgRef = useRef<HTMLImageElement>(null)
    const isVisible = useOnScreen(imgRef, '200px') // Load 200px before visible

    return (
        <img ref={imgRef} src={isVisible ? src : 'placeholder.jpg'} alt={alt} />
    )
}
```

```tsx
// Scroll animations
function AnimatedSection({ children }) {
    const sectionRef = useRef<HTMLDivElement>(null)
    const isVisible = useOnScreen(sectionRef)

    return (
        <div ref={sectionRef} className={isVisible ? 'fade-in' : 'fade-out'}>
            {children}
        </div>
    )
}
```

```tsx
// Infinite scroll
function InfiniteList({ items, onLoadMore }) {
    const sentinelRef = useRef<HTMLDivElement>(null)
    const isVisible = useOnScreen(sentinelRef, '500px') // Trigger 500px early

    useEffect(() => {
        if (isVisible) {
            onLoadMore()
        }
    }, [isVisible, onLoadMore])

    return (
        <div>
            {items.map((item) => (
                <Item key={item.id} {...item} />
            ))}
            <div ref={sentinelRef} />
        </div>
    )
}
```

```tsx
// Video autoplay
function VideoPlayer({ src }) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const isVisible = useOnScreen(videoRef)

    useEffect(() => {
        if (videoRef.current) {
            if (isVisible) {
                videoRef.current.play()
            } else {
                videoRef.current.pause()
            }
        }
    }, [isVisible])

    return <video ref={videoRef} src={src} />
}
```

### Behavior and limitations

-   Uses native IntersectionObserver API (not supported in older browsers)
-   Returns `false` initially until first intersection check
-   Observer is created only when `ref.current` is not null
-   Automatically cleans up observer on unmount or when `rootMargin` changes
-   Changing `ref.current` after mount won't create a new observer (depends on `ref` object)
-   Performance-efficient—uses browser's native intersection detection

### Common use cases

-   Lazy loading images and components
-   Scroll animations and reveals
-   Infinite scroll triggers
-   Analytics tracking (impression tracking)
-   Video/audio autoplay on viewport entry
-   Progressive content loading
-   Skeleton placeholders
-   Performance optimization

### Tests

See `src/utility/hooks/__tests__/useOnScreen.test.tsx` for comprehensive tests covering basic functionality, rootMargin options, ref handling, cleanup, practical use cases, edge cases, and performance scenarios.

---

## useEventListener

Attaches an event listener to a DOM element with automatic cleanup and proper TypeScript typing.

### API

```ts
useEventListener(
  element: Window | Document | HTMLElement | RefObject<HTMLElement> | null | undefined,
  type: string,
  handler: (event: Event) => void,
  options?: boolean | AddEventListenerOptions
): void
```

### Parameters

-   **element**: The target to attach the event listener to
    -   `Window` - Browser window object
    -   `Document` - Document object
    -   `HTMLElement` - Any HTML element
    -   `RefObject<HTMLElement>` - React ref object
    -   `null` or `undefined` - Listener won't attach (useful for conditional listeners)
-   **type**: The event type (e.g., `'click'`, `'scroll'`, `'keydown'`)
-   **handler**: Event handler function (automatically uses latest version without re-subscribing)
-   **options** (optional): Event listener options
    -   Boolean `true` for capture phase
    -   Object with `capture`, `once`, `passive` properties

### Usage

```tsx
import { useEventListener } from './utility/hooks'
import { useRef } from 'react'

// Window events (resize, scroll)
function ResponsiveLayout() {
    const [width, setWidth] = useState(window.innerWidth)

    useEventListener(window, 'resize', () => {
        setWidth(window.innerWidth)
    })

    return <div>Window width: {width}px</div>
}
```

```tsx
// Document events (keyboard shortcuts)
function KeyboardShortcuts() {
    useEventListener(document, 'keydown', (e) => {
        if (e.metaKey && e.key === 'k') {
            e.preventDefault()
            openSearch()
        }
    })

    return <div>Press Cmd+K to search</div>
}
```

```tsx
// Element events with ref
function ClickableCard() {
    const cardRef = useRef<HTMLDivElement>(null)
    const [clicks, setClicks] = useState(0)

    useEventListener(cardRef, 'click', () => {
        setClicks((c) => c + 1)
    })

    return <div ref={cardRef}>Clicked {clicks} times</div>
}
```

```tsx
// Event listener options
function PassiveScrollListener() {
    const listRef = useRef<HTMLDivElement>(null)

    useEventListener(
        listRef,
        'touchstart',
        (e) => {
            console.log('Touch started')
        },
        { passive: true } // Improves scroll performance
    )

    return <div ref={listRef}>Scrollable content</div>
}
```

```tsx
// One-time event listener
function LoadOnce() {
    useEventListener(
        window,
        'load',
        () => {
            console.log('Page loaded')
        },
        { once: true }
    )

    return <div>Loading...</div>
}
```

```tsx
// Conditional event listener
function ConditionalListener({ enabled }) {
    const elementRef = useRef<HTMLDivElement>(null)

    // Only attaches when enabled is true
    useEventListener(enabled ? elementRef : null, 'click', () =>
        console.log('Clicked')
    )

    return <div ref={elementRef}>Click me</div>
}
```

### Behavior and limitations

-   Handler automatically uses latest version without re-subscribing (prevents stale closures)
-   Options are also tracked to avoid unnecessary re-subscriptions when passing objects
-   Event listener is automatically removed on unmount
-   Listener is re-attached when `element` or `type` changes
-   Works with Window, Document, HTMLElements, and React refs
-   Full TypeScript support with correct event types for each element/event combination
-   Does not attach listener when element is `null` or `undefined`
-   Cleanup is guaranteed even if element changes or component unmounts

### Common use cases

-   Window resize/scroll handlers
-   Document keyboard shortcuts
-   Click outside detection
-   Custom keyboard navigation
-   Mouse tracking and interactions
-   Touch/pointer events
-   Form input events
-   Media events (video/audio)
-   Custom events
-   Drag and drop
-   WebSocket/server-sent events wrapper

### Tests

See `src/utility/hooks/__tests__/useEventListener.test.tsx` for comprehensive tests covering basic functionality, event types, listener options, null handling, cleanup, handler updates, practical use cases, edge cases, and TypeScript type safety.

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
