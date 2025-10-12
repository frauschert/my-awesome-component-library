# React Hooks

Custom React hooks for common use cases in the component library.

## Table of Contents

-   [useKeyPress](#usekeypress)
-   [useOnScreen](#useonscreen)
-   [useEventListener](#useeventlistener)
-   [useSize](#usesize)
-   [useOnClickOutside](#useonclickoutside)
-   [useTimeout](#usetimeout)
-   [useDebounce](#usedebounce)
-   [usePrevious](#useprevious)
-   [useLocalStorage](#uselocalstorage)
-   [useSessionStorage](#usesessionstorage)

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
-   Event listener is automatically removed on unmount
-   Listener is re-attached when `element`, `type`, or `options` changes
-   When passing options as an object, avoid creating new objects on each render (use `useMemo` or define outside component) to prevent unnecessary re-subscriptions
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

## useSize

Tracks the size (width and height) of a DOM element using the ResizeObserver API.

### API

```ts
useSize(
  ref: RefObject<HTMLElement>
): { width: number; height: number } | undefined
```

### Parameters

-   **ref**: A React ref object pointing to the element to measure

### Returns

`{ width: number; height: number } | undefined` - The current dimensions of the element, or `undefined` if the element is not mounted

### Usage

```tsx
import { useSize } from './utility/hooks'
import { useRef } from 'react'

// Basic size tracking
function ResizableBox() {
    const boxRef = useRef<HTMLDivElement>(null)
    const size = useSize(boxRef)

    return (
        <div
            ref={boxRef}
            style={{ resize: 'both', overflow: 'auto', border: '1px solid' }}
        >
            {size ? (
                <p>
                    Size: {size.width}px × {size.height}px
                </p>
            ) : (
                <p>Measuring...</p>
            )}
        </div>
    )
}
```

```tsx
// Responsive component based on container size
function ResponsiveCard() {
    const cardRef = useRef<HTMLDivElement>(null)
    const size = useSize(cardRef)

    const isSmall = size && size.width < 300
    const isMedium = size && size.width >= 300 && size.width < 600
    const isLarge = size && size.width >= 600

    return (
        <div ref={cardRef} className="card">
            {isSmall && <SmallLayout />}
            {isMedium && <MediumLayout />}
            {isLarge && <LargeLayout />}
        </div>
    )
}
```

```tsx
// Canvas sizing
function DynamicCanvas() {
    const containerRef = useRef<HTMLDivElement>(null)
    const size = useSize(containerRef)

    return (
        <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
            {size && (
                <canvas
                    width={size.width}
                    height={size.height}
                    style={{ display: 'block' }}
                />
            )}
        </div>
    )
}
```

```tsx
// Aspect ratio calculations
function AspectRatioDisplay() {
    const boxRef = useRef<HTMLDivElement>(null)
    const size = useSize(boxRef)

    const aspectRatio =
        size && size.height > 0 ? (size.width / size.height).toFixed(2) : 'N/A'

    return (
        <div ref={boxRef} style={{ width: '100%', height: '400px' }}>
            <p>Aspect Ratio: {aspectRatio}</p>
        </div>
    )
}
```

```tsx
// Conditional rendering based on size
function AdaptiveGrid() {
    const gridRef = useRef<HTMLDivElement>(null)
    const size = useSize(gridRef)

    const columns = size ? (size.width < 600 ? 1 : size.width < 900 ? 2 : 3) : 1

    return (
        <div
            ref={gridRef}
            style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gap: '1rem',
            }}
        >
            {items.map((item) => (
                <GridItem key={item.id} {...item} />
            ))}
        </div>
    )
}
```

```tsx
// Image scaling
function ScaledImage({ src, alt }) {
    const containerRef = useRef<HTMLDivElement>(null)
    const size = useSize(containerRef)

    return (
        <div ref={containerRef} style={{ width: '100%' }}>
            {size && (
                <img
                    src={src}
                    alt={alt}
                    style={{
                        width: size.width,
                        height: size.height,
                        objectFit: 'cover',
                    }}
                />
            )}
        </div>
    )
}
```

### Behavior and limitations

-   Uses native ResizeObserver API (not supported in older browsers)
-   Returns `undefined` initially until element is mounted and measured
-   Size updates are debounced (100ms) to prevent excessive re-renders during rapid resizing
-   Falls back gracefully when ResizeObserver is not available (returns initial size only)
-   Automatically measures initial size on mount using `getBoundingClientRect`
-   Observer is only created when `ref.current` is not null
-   Automatically cleans up observer on unmount
-   Cancels pending debounced updates on unmount to prevent memory leaks
-   Reports fractional pixel values (e.g., 123.456)
-   Effect re-runs when the ref object itself changes (not when `ref.current` changes)

### Common use cases

-   Container query implementations (responsive components based on container size)
-   Canvas sizing (matching canvas dimensions to container)
-   Aspect ratio calculations and constraints
-   Conditional rendering based on available space
-   Text scaling and truncation
-   Responsive layouts without media queries
-   Image gallery layouts
-   Dashboard widgets that adapt to panel size
-   Virtual scrolling with dynamic item sizes
-   Chart and visualization sizing

### Tests

See `src/utility/hooks/__tests__/useSize.test.tsx` for comprehensive tests covering basic functionality, resize updates, debouncing behavior, cleanup, null ref handling, ResizeObserver support detection, practical use cases (responsive containers, aspect ratios, canvas sizing), and edge cases (zero dimensions, very large dimensions, negative dimensions).

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

Detects clicks or touches outside of one or more referenced elements.

### API

```ts
useOnClickOutside(
  refs: RefObject<HTMLElement | null>[] | RefObject<HTMLElement | null>,
  handler: (event: MouseEvent | TouchEvent) => void
): void
```

### Parameters

-   **refs**: A single ref or array of refs pointing to elements to monitor
    -   `RefObject<HTMLElement | null>` - Single element to monitor
    -   `RefObject<HTMLElement | null>[]` - Array of elements to monitor
-   **handler**: Callback function invoked when clicking/touching outside the element(s)
    -   Receives the original `MouseEvent` or `TouchEvent`
    -   Always uses the latest version without re-subscribing (prevents stale closures)

### Usage

```tsx
import { useOnClickOutside } from './utility/hooks'
import { useRef, useState } from 'react'

// Basic dropdown
function Dropdown() {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useOnClickOutside(dropdownRef, () => {
        setIsOpen(false)
    })

    return (
        <div ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
            {isOpen && (
                <ul>
                    <li>Item 1</li>
                    <li>Item 2</li>
                    <li>Item 3</li>
                </ul>
            )}
        </div>
    )
}
```

```tsx
// Modal with backdrop
function Modal({ onClose, children }) {
    const modalRef = useRef<HTMLDivElement>(null)

    useOnClickOutside(modalRef, onClose)

    return (
        <div className="backdrop">
            <div ref={modalRef} className="modal">
                {children}
            </div>
        </div>
    )
}
```

```tsx
// Multiple refs (trigger + dropdown)
function SearchBox() {
    const [showSuggestions, setShowSuggestions] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const suggestionsRef = useRef<HTMLDivElement>(null)

    // Close when clicking outside both input and suggestions
    useOnClickOutside([inputRef, suggestionsRef], () => {
        setShowSuggestions(false)
    })

    return (
        <div>
            <input
                ref={inputRef}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search..."
            />
            {showSuggestions && (
                <div ref={suggestionsRef} className="suggestions">
                    <div>Suggestion 1</div>
                    <div>Suggestion 2</div>
                </div>
            )}
        </div>
    )
}
```

```tsx
// Accessing event details
function Popover() {
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const popoverRef = useRef<HTMLDivElement>(null)

    useOnClickOutside(popoverRef, (event) => {
        console.log('Clicked at:', event.clientX, event.clientY)
        // Close popover...
    })

    return <div ref={popoverRef}>Popover content</div>
}
```

```tsx
// Tooltip with close on outside click
function Tooltip({ children, content }) {
    const [isVisible, setIsVisible] = useState(false)
    const tooltipRef = useRef<HTMLDivElement>(null)

    useOnClickOutside(tooltipRef, () => {
        setIsVisible(false)
    })

    return (
        <div>
            <button onClick={() => setIsVisible(!isVisible)}>{children}</button>
            {isVisible && (
                <div ref={tooltipRef} className="tooltip">
                    {content}
                </div>
            )}
        </div>
    )
}
```

```tsx
// Context menu
function ContextMenu() {
    const [menuPosition, setMenuPosition] = useState<{
        x: number
        y: number
    } | null>(null)
    const menuRef = useRef<HTMLDivElement>(null)

    useOnClickOutside(menuRef, () => {
        setMenuPosition(null)
    })

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault()
        setMenuPosition({ x: e.clientX, y: e.clientY })
    }

    return (
        <div onContextMenu={handleContextMenu}>
            Right-click me
            {menuPosition && (
                <div
                    ref={menuRef}
                    style={{
                        position: 'fixed',
                        left: menuPosition.x,
                        top: menuPosition.y,
                    }}
                >
                    <button>Action 1</button>
                    <button>Action 2</button>
                </div>
            )}
        </div>
    )
}
```

### Behavior and limitations

-   Listens to both `mousedown` and `touchstart` events on the document
-   Handler automatically uses the latest version without re-subscribing (prevents stale closures and unnecessary re-renders)
-   Event listeners are automatically cleaned up on unmount
-   Works with nested children—clicking any descendant of the ref'd element counts as "inside"
-   When using multiple refs, clicking inside ANY of them prevents the handler from firing
-   Handler receives the original event object for access to coordinates, target, etc.
-   Does not fire when `refs` parameter is `undefined` or `null`
-   Handles refs with `null` current values gracefully
-   Uses `mousedown`/`touchstart` instead of `click` to detect events before they bubble

### Common use cases

-   Dropdown menus and select boxes
-   Modal dialogs and overlays
-   Popovers and tooltips
-   Context menus
-   Search boxes with autocomplete suggestions
-   Date pickers and time pickers
-   Color pickers
-   Comboboxes and multiselects
-   Sidebar navigation (mobile)
-   Notification dismissal
-   Inline editors
-   Floating action buttons with menus

### Tests

See `src/utility/hooks/__tests__/useOnClickOutside.test.tsx` for comprehensive tests covering basic functionality, multiple refs, nested elements, handler updates without re-subscribing, cleanup, null ref handling, practical use cases (dropdowns, modals, tooltips, search boxes), and edge cases.

---

## useTimeout

Manages a timeout with the ability to start, clear, reset, and check if it's active. Unlike native `setTimeout`, this hook:

-   Does NOT start automatically (must call `start()` or `reset()`)
-   Always uses the latest callback without re-subscribing
-   Automatically cleans up on unmount
-   Provides status checking with `isActive()`

### API

```ts
useTimeout(
  callback: () => void,
  delay: number
): {
  start: () => void
  clear: () => void
  reset: () => void
  isActive: () => boolean
}
```

### Parameters

-   **callback**: Function to be called after the delay
    -   Always uses the latest version without re-subscribing
    -   Captures current state/props when timeout fires
-   **delay**: Delay in milliseconds before the callback executes

### Returns

Object with four methods:

-   **start()**: Starts the timeout (clears any existing timeout first)
-   **clear()**: Cancels the timeout if active
-   **reset()**: Clears and restarts the timeout (alias for `clear()` then `start()`)
-   **isActive()**: Returns `true` if timeout is currently active, `false` otherwise

### Usage

```tsx
import { useTimeout } from './utility/hooks'
import { useState } from 'react'

// Basic usage - manual start
function Notification() {
    const [show, setShow] = useState(false)
    const timeout = useTimeout(() => setShow(false), 3000)

    const showNotification = () => {
        setShow(true)
        timeout.start() // Start timeout manually
    }

    return (
        <div>
            <button onClick={showNotification}>Show</button>
            {show && <div>This will hide in 3 seconds</div>}
        </div>
    )
}
```

```tsx
// Auto-save with debounce
function Editor() {
    const [content, setContent] = useState('')
    const [saved, setSaved] = useState(true)

    const saveTimeout = useTimeout(() => {
        // Save to server
        saveToServer(content)
        setSaved(true)
    }, 2000)

    const handleChange = (e) => {
        setContent(e.target.value)
        setSaved(false)
        saveTimeout.reset() // Reset timer on each keystroke
    }

    return (
        <div>
            <textarea value={content} onChange={handleChange} />
            <span>{saved ? 'Saved' : 'Saving...'}</span>
        </div>
    )
}
```

```tsx
// Delayed action with cancellation
function DeleteButton({ onDelete, item }) {
    const [deleting, setDeleting] = useState(false)

    const deleteTimeout = useTimeout(() => {
        onDelete(item)
        setDeleting(false)
    }, 5000)

    const handleDelete = () => {
        setDeleting(true)
        deleteTimeout.start()
    }

    const handleUndo = () => {
        deleteTimeout.clear()
        setDeleting(false)
    }

    return (
        <div>
            {deleting ? (
                <div>
                    Deleting in 5 seconds...
                    <button onClick={handleUndo}>Undo</button>
                </div>
            ) : (
                <button onClick={handleDelete}>Delete</button>
            )}
        </div>
    )
}
```

```tsx
// Checking if timeout is active
function Timer() {
    const [count, setCount] = useState(0)
    const timeout = useTimeout(() => setCount((c) => c + 1), 1000)

    const start = () => {
        if (!timeout.isActive()) {
            timeout.start()
        }
    }

    const stop = () => {
        timeout.clear()
    }

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={start} disabled={timeout.isActive()}>
                Start
            </button>
            <button onClick={stop} disabled={!timeout.isActive()}>
                Stop
            </button>
            <p>Status: {timeout.isActive() ? 'Running' : 'Stopped'}</p>
        </div>
    )
}
```

```tsx
// Toast notification system
function ToastManager() {
    const [toasts, setToasts] = useState([])
    const timeout = useTimeout(() => {
        setToasts((prev) => prev.slice(1))
    }, 3000)

    const addToast = (message) => {
        setToasts((prev) => [...prev, message])
        timeout.reset() // Reset for each new toast
    }

    return (
        <div>
            <button onClick={() => addToast('New notification')}>
                Add Toast
            </button>
            <div>
                {toasts.map((toast, i) => (
                    <div key={i}>{toast}</div>
                ))}
            </div>
        </div>
    )
}
```

```tsx
// Search with debounced API call
function SearchBox() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [searching, setSearching] = useState(false)

    const searchTimeout = useTimeout(async () => {
        if (query.trim()) {
            const data = await searchAPI(query)
            setResults(data)
        }
        setSearching(false)
    }, 500)

    const handleSearch = (e) => {
        const value = e.target.value
        setQuery(value)

        if (value.trim()) {
            setSearching(true)
            searchTimeout.reset()
        } else {
            searchTimeout.clear()
            setResults([])
            setSearching(false)
        }
    }

    return (
        <div>
            <input
                value={query}
                onChange={handleSearch}
                placeholder="Search..."
            />
            {searching && <div>Searching...</div>}
            <ul>
                {results.map((result) => (
                    <li key={result.id}>{result.name}</li>
                ))}
            </ul>
        </div>
    )
}
```

### Behavior and limitations

-   **Does NOT start automatically** - You must call `start()` or `reset()` to begin the timeout
-   Callback always uses the latest version without re-subscribing (prevents stale closures)
-   Automatically cleans up timeout on unmount to prevent memory leaks
-   `start()` clears any existing timeout before starting a new one
-   `clear()` can be called safely even when no timeout is active
-   `reset()` is equivalent to calling `clear()` then `start()`
-   `isActive()` reflects current timeout state immediately
-   Timeout is cleared but not restarted when `delay` changes between renders
-   Callback fires only once per `start()`/`reset()` call
-   Uses `window.setTimeout` and `window.clearTimeout` internally

### Common use cases

-   Auto-save functionality (debounced saves)
-   Delayed notifications and toasts
-   Search input debouncing
-   Undo/delete confirmations with delay
-   Polling with delay between requests
-   UI animations and transitions
-   Session timeout warnings
-   Rate limiting user actions
-   Delayed form validation
-   Auto-hide messages
-   Game timers and countdowns
-   Delayed loading states
-   Throttled scroll handlers

### Tests

See `src/utility/hooks/__tests__/useTimeout.test.ts` for comprehensive tests covering basic functionality, clear/reset/start operations, isActive status, callback updates without re-subscribing, cleanup on unmount, edge cases (zero delay, very long delays, rapid calls), and practical use cases (auto-save, debounced actions, delayed notifications).

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
