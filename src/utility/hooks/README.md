# React Hooks

Custom React hooks for common use cases in the component library.

## Table of Contents

-   [useKeyPress](#usekeypress)
-   [useOnScreen](#useonscreen)
-   [useEventListener](#useeventlistener)
-   [useSize](#usesize)
-   [useOnClickOutside](#useonclickoutside)
-   [useTimeout](#usetimeout)
-   [useMediaQuery](#usemediaquery)
-   [useWhyDidYouUpdate](#usewhydidyouupdate)
-   [useCopyToClipboard](#usecopytoclipboard)
-   [useInterval](#useinterval)
-   [useWindowSize](#usewindowsize)
-   [useDebounce (value)](#usedebounce-value)
-   [useThrottle](#usethrottle)
-   [useResizeObserver](#useresizeobserver)
-   [useIntersectionObserver](#useintersectionobserver)
-   [useIsFirstRender](#useisfirstrender)
-   [useClickAway](#useclickaway)
-   [useDebounce (effect)](#usedebounce)
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

## useMediaQuery

Detects when a CSS media query matches. Useful for responsive design, dark mode detection, and accessibility preferences.

### API

```ts
useMediaQuery(query: string): boolean
```

### Parameters

-   **query**: The media query string (e.g., `'(min-width: 768px)'`)
    -   Use standard CSS media query syntax
    -   Can include multiple conditions with `and`, `or`, `not`
    -   Supports all CSS media features: `min-width`, `max-width`, `orientation`, `prefers-color-scheme`, etc.

### Returns

`boolean` - `true` when the media query matches, `false` otherwise

### Usage

```tsx
import { useMediaQuery } from './utility/hooks'

// Responsive breakpoints
function ResponsiveComponent() {
    const isMobile = useMediaQuery('(max-width: 767px)')
    const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)')
    const isDesktop = useMediaQuery('(min-width: 1024px)')

    if (isMobile) return <MobileLayout />
    if (isTablet) return <TabletLayout />
    return <DesktopLayout />
}
```

```tsx
// Dark mode detection
function ThemeAware() {
    const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')

    return (
        <div style={{ background: prefersDark ? '#000' : '#fff' }}>
            {prefersDark ? 'Dark mode' : 'Light mode'}
        </div>
    )
}
```

```tsx
// Orientation detection
function OrientationDisplay() {
    const isPortrait = useMediaQuery('(orientation: portrait)')
    const isLandscape = useMediaQuery('(orientation: landscape)')

    return (
        <div>
            {isPortrait && <p>Please rotate your device to landscape</p>}
            {isLandscape && <VideoPlayer />}
        </div>
    )
}
```

```tsx
// Accessibility - reduced motion preference
function AnimatedCard() {
    const prefersReducedMotion = useMediaQuery(
        '(prefers-reduced-motion: reduce)'
    )

    return (
        <div
            className={prefersReducedMotion ? 'no-animation' : 'animated-fade'}
        >
            Content
        </div>
    )
}
```

```tsx
// Print styles
function Document() {
    const isPrint = useMediaQuery('print')

    return (
        <div>
            {!isPrint && <Navigation />}
            <Content />
            {!isPrint && <Footer />}
        </div>
    )
}
```

```tsx
// High contrast mode
function AccessibleText() {
    const highContrast = useMediaQuery('(prefers-contrast: high)')

    return (
        <p style={{ fontWeight: highContrast ? 'bold' : 'normal' }}>
            This text adapts to user preferences
        </p>
    )
}
```

```tsx
// Retina display detection
function ImageOptimizer({ src }) {
    const isRetina = useMediaQuery('(min-resolution: 2dppx)')

    return <img src={isRetina ? `${src}@2x.jpg` : `${src}.jpg`} />
}
```

```tsx
// Complex media query
function TabletLandscape() {
    const isTabletLandscape = useMediaQuery(
        '(min-width: 768px) and (max-width: 1023px) and (orientation: landscape)'
    )

    return isTabletLandscape ? <SpecialLayout /> : <DefaultLayout />
}
```

```tsx
// Conditional feature rendering
function FeatureToggle() {
    const hasHover = useMediaQuery('(hover: hover)')
    const hasPointer = useMediaQuery('(pointer: fine)')

    return (
        <div>
            {hasHover && <TooltipOnHover />}
            {!hasPointer && <LargeClickTargets />}
        </div>
    )
}
```

### Common Media Queries

**Breakpoints:**

-   `'(max-width: 767px)'` - Mobile
-   `'(min-width: 768px)'` - Tablet and up
-   `'(min-width: 1024px)'` - Desktop and up
-   `'(min-width: 1280px)'` - Large desktop
-   `'(min-width: 768px) and (max-width: 1023px)'` - Tablet only

**User Preferences:**

-   `'(prefers-color-scheme: dark)'` - Dark mode
-   `'(prefers-color-scheme: light)'` - Light mode
-   `'(prefers-reduced-motion: reduce)'` - Reduced motion
-   `'(prefers-contrast: high)'` - High contrast
-   `'(prefers-reduced-transparency: reduce)'` - Reduced transparency

**Device Features:**

-   `'(orientation: portrait)'` - Portrait orientation
-   `'(orientation: landscape)'` - Landscape orientation
-   `'(hover: hover)'` - Device supports hover
-   `'(pointer: fine)'` - Fine pointer (mouse)
-   `'(pointer: coarse)'` - Coarse pointer (touch)

**Display:**

-   `'(min-resolution: 2dppx)'` - Retina/high-DPI
-   `'print'` - Print media
-   `'screen'` - Screen media

### Behavior and limitations

-   Returns `false` in SSR environments (when `window` is undefined)
-   Uses native `window.matchMedia` API
-   Automatically updates when media query match changes
-   Supports both modern `addEventListener` and legacy `addListener` APIs
-   Event listeners are automatically cleaned up on unmount
-   When query string changes, hook re-subscribes to new media query
-   Initial state is set synchronously to avoid flash of incorrect content
-   Safe to use in server-side rendering (returns `false` server-side)

### Common use cases

-   Responsive component layouts (container queries alternative)
-   Dark mode detection and theming
-   Orientation-based UI changes (mobile games, video players)
-   Accessibility: reduced motion, high contrast, forced colors
-   Print-specific layouts
-   Retina display image optimization
-   Touch vs mouse input detection
-   Conditional feature rendering based on device capabilities
-   Mobile-first or desktop-first responsive design
-   Adaptive loading (serve smaller assets on mobile)

### Tests

See `src/utility/hooks/__tests__/useMediaQuery.test.tsx` for comprehensive tests covering basic functionality, match state changes, different query types, event listener cleanup, legacy API support, SSR handling, practical use cases (breakpoints, dark mode, orientation, accessibility), and complex media queries.

---

## useWhyDidYouUpdate

Debug hook that logs which props changed between renders to help identify the cause of unnecessary re-renders.

### API

```ts
useWhyDidYouUpdate<T extends Record<string, unknown>>(
  name: string,
  props: T
): void
```

### Parameters

-   **name**: A descriptive name to identify the component in console logs
-   **props**: The props object to track (typically all props or a subset you want to monitor)

### Returns

`void` - This hook logs to the console but doesn't return anything

### Usage

```tsx
import { useWhyDidYouUpdate } from './utility/hooks'

// Basic usage - track all props
function ExpensiveComponent({ count, user, items, onUpdate }) {
    useWhyDidYouUpdate('ExpensiveComponent', { count, user, items, onUpdate })

    return <div>{/* Expensive render logic */}</div>
}

// Console output when count changes from 1 to 2:
// [why-did-you-update] ExpensiveComponent
//   count: 1 -> 2
```

```tsx
// Debug object/array recreation issues
function UserCard({ user, settings }) {
    useWhyDidYouUpdate('UserCard', { user, settings })

    return (
        <div>
            <h1>{user.name}</h1>
            <p>Theme: {settings.theme}</p>
        </div>
    )
}

// If parent recreates objects on each render:
// [why-did-you-update] UserCard
//   user: {id: 1, name: 'John'} -> {id: 1, name: 'John'}
//   settings: {theme: 'dark'} -> {theme: 'dark'}
// This reveals that objects are being recreated even though values are the same
```

```tsx
// Debug callback recreation
function DataTable({ data, onSort, onFilter, onExport }) {
    useWhyDidYouUpdate('DataTable', { data, onSort, onFilter, onExport })

    return <table>{/* table implementation */}</table>
}

// Console might show:
// [why-did-you-update] DataTable
//   onSort: ƒ -> ƒ
//   onFilter: ƒ -> ƒ
// Indicates callbacks are being recreated (need useCallback)
```

```tsx
// Track subset of props
function Dashboard({ users, products, orders, settings, theme }) {
    // Only track the props you suspect are causing issues
    useWhyDidYouUpdate('Dashboard', { users, products, orders })

    return <div>{/* dashboard content */}</div>
}
```

```tsx
// Use in development only
function MyComponent(props) {
    if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useWhyDidYouUpdate('MyComponent', props)
    }

    return <div>{/* content */}</div>
}
```

```tsx
// Track computed/derived values
function ProductList({ products, filter, sortBy }) {
    const filteredProducts = useMemo(
        () => products.filter(filter),
        [products, filter]
    )

    useWhyDidYouUpdate('ProductList', {
        products,
        filter,
        sortBy,
        filteredProducts,
    })

    return (
        <ul>
            {filteredProducts.map((p) => (
                <li key={p.id}>{p.name}</li>
            ))}
        </ul>
    )
}
```

```tsx
// Debug context-related re-renders
function ChildComponent({ data }) {
    const contextValue = useContext(MyContext)

    useWhyDidYouUpdate('ChildComponent', { data, contextValue })

    return <div>{/* content */}</div>
}
```

### Console Output Format

When props change, the hook logs:

```
[why-did-you-update] ComponentName
  propName1: oldValue -> newValue
  propName2: oldValue -> newValue
```

**Examples of different value types:**

```
// Primitives
  count: 1 -> 2
  name: 'John' -> 'Jane'
  isActive: false -> true

// Objects (shows reference change)
  user: {id: 1} -> {id: 1}

// Arrays
  items: [1, 2, 3] -> [1, 2, 3]

// Functions
  onClick: ƒ -> ƒ

// Special values
  value: undefined -> null
  data: null -> {id: 1}
```

### Behavior and limitations

-   **Shallow comparison** - Uses `===` to compare prop values (reference equality)
    -   Two objects with identical content but different references will show as changed
    -   This is intentional - helps identify unnecessary object recreation
-   **No output on first render** - Only logs on subsequent renders
-   **Logs all changes** - If multiple props change, all are logged
-   **Development tool** - Should typically be removed in production builds
-   **Console only** - Output goes to `console.log` (not console.error or console.warn)
-   **Type-safe** - Accepts any object with string keys and unknown values
-   **No deep comparison** - Does not compare nested object properties

### Common use cases

-   **Performance debugging** - Identify what's causing expensive re-renders
-   **Unnecessary re-renders** - Find components re-rendering when props haven't changed
-   **Object recreation** - Detect when parent components recreate objects/arrays unnecessarily
-   **Callback issues** - Identify when callbacks are being recreated without `useCallback`
-   **Context debugging** - Track context value changes causing re-renders
-   **useMemo/useCallback validation** - Verify memoization is working
-   **Prop drilling issues** - Track how props change as they flow down the tree
-   **Third-party component debugging** - Understand re-render behavior of library components

### Best practices

1. **Remove in production** - Wrap in `process.env.NODE_ENV === 'development'` check
2. **Be specific** - Track only the props you're investigating, not all props
3. **Use meaningful names** - Component names should be descriptive
4. **Combine with React DevTools Profiler** - Use both tools together for full picture
5. **Fix root causes** - Use insights to add `useMemo`, `useCallback`, or restructure code
6. **Check object recreation** - Look for props that change reference but not content
7. **Consider extraction** - If a component re-renders too much, consider splitting it

### Solutions to common problems identified

**Problem: Object/array recreation**

```tsx
// ❌ Bad - recreates object on every render
<Child user={{ id: userId, name: userName }} />

// ✅ Good - stable reference with useMemo
const user = useMemo(() => ({ id: userId, name: userName }), [userId, userName])
<Child user={user} />
```

**Problem: Callback recreation**

```tsx
// ❌ Bad - new function on every render
<Child onUpdate={(data) => handleUpdate(data)} />

// ✅ Good - stable reference with useCallback
const handleUpdateCallback = useCallback((data) => handleUpdate(data), [handleUpdate])
<Child onUpdate={handleUpdateCallback} />
```

**Problem: Passing all props**

```tsx
// ❌ Bad - passing entire props object
<Child {...props} />

// ✅ Good - only pass what's needed
<Child data={props.data} onUpdate={props.onUpdate} />
```

### Tests

See `src/utility/hooks/__tests__/useWhyDidYouUpdate.test.tsx` for comprehensive tests covering prop changes, object/array references, function references, added/removed props, edge cases (null, undefined, 0, empty string), and practical debugging scenarios.

---

## useCopyToClipboard

Copy text to clipboard with modern Clipboard API and legacy fallback support.

### Signature

```ts
function useCopyToClipboard(): {
    copiedText: string | null
    isCopying: boolean
    isSuccess: boolean
    error: Error | null
    copy: (text: string) => Promise<boolean>
    reset: () => void
}
```

### Features

-   🚀 Modern Clipboard API with `execCommand` fallback
-   ⚡ Async status tracking (copying, success, error)
-   🔄 Reset state for multiple copies
-   🧪 SSR-safe (checks for browser environment)
-   📦 Returns copied text for verification
-   ⚠️ Comprehensive error handling

### Parameters

None. Returns an object with the following properties:

-   `copiedText`: The last successfully copied text (or `null`)
-   `isCopying`: Boolean indicating if a copy operation is in progress
-   `isSuccess`: Boolean indicating if the last copy was successful
-   `error`: Error object if the last copy failed (or `null`)
-   `copy`: Async function that copies text to clipboard, returns `Promise<boolean>`
-   `reset`: Function to reset all state to initial values

### Usage

```tsx
import { useCopyToClipboard } from './utility/hooks'
import { Button } from './components/Button'

// Basic copy button
function CopyButton() {
    const { copy, isSuccess, isCopying } = useCopyToClipboard()

    return (
        <Button onClick={() => copy('Hello, World!')} disabled={isCopying}>
            {isSuccess ? 'Copied!' : 'Copy'}
        </Button>
    )
}
```

```tsx
// Code snippet copy with feedback
function CodeBlock({ code }: { code: string }) {
    const { copy, copiedText, isSuccess, error } = useCopyToClipboard()

    return (
        <div>
            <pre>{code}</pre>
            <Button onClick={() => copy(code)}>
                {isSuccess && copiedText === code ? '✓ Copied' : 'Copy'}
            </Button>
            {error && <span>Failed to copy: {error.message}</span>}
        </div>
    )
}
```

```tsx
// Copy with reset after timeout
function ShareButton({ url }: { url: string }) {
    const { copy, isSuccess, reset } = useCopyToClipboard()

    const handleCopy = async () => {
        const success = await copy(url)
        if (success) {
            setTimeout(reset, 2000) // Reset after 2 seconds
        }
    }

    return (
        <Button onClick={handleCopy}>
            {isSuccess ? 'Link Copied!' : 'Share'}
        </Button>
    )
}
```

```tsx
// Copy multiple items with state tracking
function ApiKeyDisplay({ apiKey }: { apiKey: string }) {
    const clipboard = useCopyToClipboard()

    return (
        <div>
            <code>{apiKey}</code>
            <Button
                onClick={() => clipboard.copy(apiKey)}
                disabled={clipboard.isCopying}
            >
                {clipboard.isCopying
                    ? 'Copying...'
                    : clipboard.isSuccess
                    ? '✓ Copied'
                    : 'Copy API Key'}
            </Button>
            {clipboard.error && (
                <div>
                    <p>Failed to copy: {clipboard.error.message}</p>
                    <Button onClick={clipboard.reset}>Try Again</Button>
                </div>
            )}
        </div>
    )
}
```

```tsx
// Copy JSON data formatted
function DataExporter({ data }: { data: object }) {
    const { copy, isSuccess } = useCopyToClipboard()

    const handleExport = () => {
        const json = JSON.stringify(data, null, 2)
        copy(json)
    }

    return (
        <Button onClick={handleExport}>
            {isSuccess ? '✓ Exported' : 'Export as JSON'}
        </Button>
    )
}
```

### Tests

See `src/utility/hooks/__tests__/useCopyToClipboard.test.tsx` for comprehensive tests covering Clipboard API, execCommand fallback, async status tracking, error handling, reset functionality, and practical use cases (code snippets, URLs, JSON, emails).

---

## useInterval

Run a callback function on a specified interval with automatic cleanup. Pass `null` as the delay to pause the interval.

### Signature

```ts
function useInterval(callback: () => void, delay: number | null): void
```

### Features

-   🔄 Runs callback repeatedly at specified interval
-   ⏸️ Pause by passing `null` as delay
-   🧹 Automatic cleanup on unmount
-   🔄 Updates callback without restarting interval
-   📦 Properly handles delay changes

### Parameters

-   `callback`: Function to call on each interval tick
-   `delay`: Interval delay in milliseconds, or `null` to pause

### Usage

```tsx
import { useInterval } from './utility/hooks'
import { useState } from 'react'

// Simple counter
function Counter() {
    const [count, setCount] = useState(0)

    useInterval(() => {
        setCount((c) => c + 1)
    }, 1000)

    return <div>Count: {count}</div>
}
```

```tsx
// Pausable interval
function Timer() {
    const [seconds, setSeconds] = useState(0)
    const [isPaused, setIsPaused] = useState(false)

    useInterval(
        () => {
            setSeconds((s) => s + 1)
        },
        isPaused ? null : 1000
    )

    return (
        <div>
            <div>Elapsed: {seconds}s</div>
            <button onClick={() => setIsPaused(!isPaused)}>
                {isPaused ? 'Resume' : 'Pause'}
            </button>
        </div>
    )
}
```

```tsx
// Countdown timer
function Countdown({ initialSeconds }: { initialSeconds: number }) {
    const [seconds, setSeconds] = useState(initialSeconds)

    useInterval(
        () => {
            setSeconds((s) => s - 1)
        },
        seconds > 0 ? 1000 : null, // Pause when reaching zero
    )

    return <div>{seconds > 0 ? `${seconds}s remaining` : 'Time's up!'}</div>
}
```

```tsx
// Polling data from API
function LiveData() {
    const [data, setData] = useState(null)
    const [isPolling, setIsPolling] = useState(true)

    useInterval(
        async () => {
            const response = await fetch('/api/data')
            const json = await response.json()
            setData(json)
        },
        isPolling ? 5000 : null // Poll every 5 seconds
    )

    return (
        <div>
            <div>Data: {JSON.stringify(data)}</div>
            <button onClick={() => setIsPolling(!isPolling)}>
                {isPolling ? 'Stop Polling' : 'Start Polling'}
            </button>
        </div>
    )
}
```

```tsx
// Auto-save form
function AutoSaveForm() {
    const [formData, setFormData] = useState({ title: '', content: '' })
    const [lastSaved, setLastSaved] = useState<Date | null>(null)

    useInterval(() => {
        // Save to API
        fetch('/api/save', {
            method: 'POST',
            body: JSON.stringify(formData),
        })
        setLastSaved(new Date())
    }, 30000) // Auto-save every 30 seconds

    return (
        <div>
            <input
                value={formData.title}
                onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                }
            />
            <textarea
                value={formData.content}
                onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                }
            />
            {lastSaved && (
                <small>Last saved: {lastSaved.toLocaleTimeString()}</small>
            )}
        </div>
    )
}
```

```tsx
// Dynamic interval speed
function AnimationSpeed() {
    const [frame, setFrame] = useState(0)
    const [speed, setSpeed] = useState<'slow' | 'normal' | 'fast'>('normal')

    const delays = { slow: 100, normal: 50, fast: 16 }

    useInterval(() => {
        setFrame((f) => f + 1)
    }, delays[speed])

    return (
        <div>
            <div>Frame: {frame}</div>
            <button onClick={() => setSpeed('slow')}>Slow</button>
            <button onClick={() => setSpeed('normal')}>Normal</button>
            <button onClick={() => setSpeed('fast')}>Fast</button>
        </div>
    )
}
```

### Tests

See `src/utility/hooks/__tests__/useInterval.test.tsx` for tests covering basic intervals, pause/resume, callback updates, cleanup, and practical use cases.

---

## useWindowSize

Track the browser window's dimensions and get updates on resize. Essential for responsive layouts and conditional rendering based on viewport size.

### Signature

```ts
interface WindowSize {
    width: number
    height: number
}

function useWindowSize(): WindowSize
```

### Features

-   📏 Real-time window width and height tracking
-   🔄 Automatic updates on window resize
-   🧹 Automatic cleanup on unmount
-   🌐 SSR-safe (returns 0 for width/height on server)
-   ⚡ Lightweight with single resize listener

### Returns

Object with `width` and `height` properties representing the current window dimensions in pixels.

### Usage

```tsx
import { useWindowSize } from './utility/hooks'

// Basic responsive layout
function ResponsiveLayout() {
    const { width, height } = useWindowSize()

    return (
        <div>
            <h1>Window Size</h1>
            <p>
                Width: {width}px, Height: {height}px
            </p>
        </div>
    )
}
```

```tsx
// Conditional rendering based on viewport
function AdaptiveUI() {
    const { width } = useWindowSize()

    const isMobile = width < 768
    const isTablet = width >= 768 && width < 1024
    const isDesktop = width >= 1024

    return (
        <div>
            {isMobile && <MobileNav />}
            {isTablet && <TabletNav />}
            {isDesktop && <DesktopNav />}
        </div>
    )
}
```

```tsx
// Responsive columns
function ResponsiveGrid({ items }: { items: any[] }) {
    const { width } = useWindowSize()

    const columns = width < 768 ? 1 : width < 1024 ? 2 : width < 1440 ? 3 : 4

    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gap: '1rem',
            }}
        >
            {items.map((item, i) => (
                <div key={i}>{item}</div>
            ))}
        </div>
    )
}
```

```tsx
// Aspect ratio calculation
function VideoPlayer() {
    const { width, height } = useWindowSize()
    const aspectRatio = width / height
    const isWideScreen = aspectRatio > 16 / 9

    return (
        <video
            style={{
                width: isWideScreen ? 'auto' : '100%',
                height: isWideScreen ? '100%' : 'auto',
            }}
        />
    )
}
```

```tsx
// Orientation detection
function OrientationAware() {
    const { width, height } = useWindowSize()
    const isLandscape = width > height
    const isPortrait = height > width

    return (
        <div>
            <p>Orientation: {isLandscape ? 'Landscape' : 'Portrait'}</p>
            {isPortrait && <PortraitLayout />}
            {isLandscape && <LandscapeLayout />}
        </div>
    )
}
```

```tsx
// Responsive font sizing
function AdaptiveTypography() {
    const { width } = useWindowSize()

    const fontSize = Math.max(16, Math.min(24, width / 50))

    return (
        <div
            style={{
                fontSize: `${fontSize}px`,
            }}
        >
            <h1>Responsive Text</h1>
            <p>This text scales with the viewport width</p>
        </div>
    )
}
```

```tsx
// Breakpoint-based component switching
function MediaQuery() {
    const { width } = useWindowSize()

    const breakpoints = {
        xs: width < 576,
        sm: width >= 576 && width < 768,
        md: width >= 768 && width < 992,
        lg: width >= 992 && width < 1200,
        xl: width >= 1200,
    }

    return (
        <div>
            {breakpoints.xs && <ExtraSmallLayout />}
            {breakpoints.sm && <SmallLayout />}
            {breakpoints.md && <MediumLayout />}
            {breakpoints.lg && <LargeLayout />}
            {breakpoints.xl && <ExtraLargeLayout />}
        </div>
    )
}
```

```tsx
// Dynamic chart sizing
function ResponsiveChart({ data }: { data: any[] }) {
    const { width, height } = useWindowSize()

    const chartWidth = Math.min(width * 0.9, 1200)
    const chartHeight = Math.min(height * 0.6, 600)

    return <Chart data={data} width={chartWidth} height={chartHeight} />
}
```

### Tests

See `src/utility/hooks/__tests__/useWindowSize.test.tsx` for comprehensive tests covering initial size, resize events, cleanup, edge cases (mobile/tablet/desktop viewports), and practical use cases (orientation, aspect ratio, breakpoints).

---

## useDebounce (value)

Debounces a value, delaying updates until after the specified delay. Perfect for search inputs, form validation, API calls, and any scenario where you want to wait for user input to stabilize.

### Signature

```ts
function useDebounce<T>(value: T, delay: number): T
```

### Features

-   ⏱️ Delays value updates until after specified delay
-   🔄 Resets timer on each value change
-   🧹 Automatic cleanup on unmount
-   📦 Works with any value type (string, number, object, array, etc.)
-   ⚡ Prevents unnecessary API calls or expensive operations

### Parameters

-   `value`: The value to debounce (any type)
-   `delay`: Delay in milliseconds before updating the debounced value

### Returns

The debounced value (same type as input).

### Usage

```tsx
import { useDebounce } from './utility/hooks'
import { useState, useEffect } from 'react'

// Search input with debounced API calls
function SearchInput() {
    const [searchTerm, setSearchTerm] = useState('')
    const debouncedSearch = useDebounce(searchTerm, 500)

    useEffect(() => {
        if (debouncedSearch) {
            // API call only happens after user stops typing for 500ms
            searchAPI(debouncedSearch)
        }
    }, [debouncedSearch])

    return (
        <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
        />
    )
}
```

```tsx
// Form validation with debounce
function UsernameInput() {
    const [username, setUsername] = useState('')
    const debouncedUsername = useDebounce(username, 800)
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null)

    useEffect(() => {
        if (debouncedUsername.length >= 3) {
            // Check availability only after user stops typing
            checkUsernameAvailability(debouncedUsername).then(setIsAvailable)
        }
    }, [debouncedUsername])

    return (
        <div>
            <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            {isAvailable === true && <span>✓ Available</span>}
            {isAvailable === false && <span>✗ Taken</span>}
        </div>
    )
}
```

```tsx
// Auto-save with debounce
function AutoSaveEditor() {
    const [content, setContent] = useState('')
    const debouncedContent = useDebounce(content, 2000)

    useEffect(() => {
        if (debouncedContent) {
            // Auto-save 2 seconds after user stops typing
            saveToServer(debouncedContent)
        }
    }, [debouncedContent])

    return (
        <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
        />
    )
}
```

```tsx
// Responsive resize handling
function ResponsiveComponent() {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    const debouncedWidth = useDebounce(windowWidth, 200)

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // Expensive calculations only run after resize settles
    const layout = calculateLayout(debouncedWidth)

    return <div>{layout}</div>
}
```

```tsx
// Filter list with debounce
function FilterableList({ items }: { items: any[] }) {
    const [filterText, setFilterText] = useState('')
    const debouncedFilter = useDebounce(filterText, 300)

    const filteredItems = items.filter((item) =>
        item.name.toLowerCase().includes(debouncedFilter.toLowerCase())
    )

    return (
        <div>
            <input
                type="text"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                placeholder="Filter..."
            />
            <ul>
                {filteredItems.map((item) => (
                    <li key={item.id}>{item.name}</li>
                ))}
            </ul>
        </div>
    )
}
```

```tsx
// Debounce slider value for expensive operations
function SliderControl() {
    const [sliderValue, setSliderValue] = useState(50)
    const debouncedValue = useDebounce(sliderValue, 100)

    useEffect(() => {
        // Expensive operation only runs when slider settles
        performExpensiveCalculation(debouncedValue)
    }, [debouncedValue])

    return (
        <div>
            <input
                type="range"
                min="0"
                max="100"
                value={sliderValue}
                onChange={(e) => setSliderValue(Number(e.target.value))}
            />
            <span>Value: {sliderValue}</span>
        </div>
    )
}
```

```tsx
// Debounce API parameters
function DataFetcher() {
    const [params, setParams] = useState({
        page: 1,
        pageSize: 10,
        sort: 'name',
    })
    const debouncedParams = useDebounce(params, 500)

    useEffect(() => {
        // Fetch data only after params stabilize
        fetchData(debouncedParams)
    }, [debouncedParams])

    return (
        <div>
            <button
                onClick={() => setParams({ ...params, page: params.page + 1 })}
            >
                Next Page
            </button>
            <select
                value={params.sort}
                onChange={(e) => setParams({ ...params, sort: e.target.value })}
            >
                <option value="name">Name</option>
                <option value="date">Date</option>
            </select>
        </div>
    )
}
```

### Tests

See `src/utility/hooks/__tests__/useDebounce.test.tsx` for comprehensive tests covering basic debouncing, rapid changes, timer resets, different delays, various value types (string, number, boolean, object, array, null, undefined), cleanup, and practical use cases (search input, resize handling, API throttling).

---

## useThrottle

Throttles a value, ensuring it only updates at most once per specified delay period. Unlike debouncing which delays updates until changes stop, throttling guarantees updates at regular intervals during continuous changes.

### API

```ts
useThrottle<T>(value: T, delay: number): T
```

### Parameters

-   **value**: The value to throttle (can be any type)
-   **delay**: The throttle delay in milliseconds

### Returns

The throttled value that updates at most once per delay period

### Features

-   **Generic type support**: Works with any value type (string, number, boolean, object, array, etc.)
-   **Leading edge execution**: First change happens immediately, subsequent changes are throttled
-   **Trailing edge update**: Final value is guaranteed to update after throttle period
-   **Automatic cleanup**: Clears timeouts on unmount
-   **Performance optimized**: Ideal for high-frequency events (scroll, resize, mouse move)

### Usage

**Basic throttling:**

```tsx
import { useThrottle } from './utility/hooks'

function ScrollTracker() {
    const [scrollY, setScrollY] = useState(0)
    const throttledScrollY = useThrottle(scrollY, 200)

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return <div>Scroll position: {throttledScrollY}px</div>
}
```

**Mouse tracking with throttle:**

```tsx
function MouseTracker() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
    const throttledPos = useThrottle(mousePos, 100)

    useEffect(() => {
        const handleMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY })
        }
        window.addEventListener('mousemove', handleMove)
        return () => window.removeEventListener('mousemove', handleMove)
    }, [])

    return (
        <div>
            Mouse: {throttledPos.x}, {throttledPos.y}
        </div>
    )
}
```

**Resize tracking:**

```tsx
function ResponsiveComponent() {
    const [width, setWidth] = useState(window.innerWidth)
    const throttledWidth = useThrottle(width, 250)

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return <div>Width: {throttledWidth}px</div>
}
```

**API rate limiting:**

```tsx
function SearchWithThrottle() {
    const [query, setQuery] = useState('')
    const throttledQuery = useThrottle(query, 500)

    useEffect(() => {
        if (throttledQuery) {
            // API call happens at most once per 500ms
            searchAPI(throttledQuery)
        }
    }, [throttledQuery])

    return (
        <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
        />
    )
}
```

**Gaming input throttle:**

```tsx
function GameController() {
    const [position, setPosition] = useState(0)
    const throttledPosition = useThrottle(position, 16) // ~60fps

    const handleMove = (direction: number) => {
        setPosition((prev) => prev + direction)
    }

    return (
        <div>
            <button onClick={() => handleMove(-1)}>Left</button>
            <div>Position: {throttledPosition}</div>
            <button onClick={() => handleMove(1)}>Right</button>
        </div>
    )
}
```

**Network status monitoring:**

```tsx
function NetworkMonitor() {
    const [bandwidth, setBandwidth] = useState(0)
    const throttledBandwidth = useThrottle(bandwidth, 1000)

    useEffect(() => {
        const interval = setInterval(() => {
            // Measure bandwidth frequently
            setBandwidth(measureBandwidth())
        }, 100)
        return () => clearInterval(interval)
    }, [])

    return <div>Bandwidth: {throttledBandwidth} Mbps</div>
}
```

**Canvas drawing optimization:**

```tsx
function DrawingCanvas() {
    const [brushSize, setBrushSize] = useState(5)
    const throttledBrushSize = useThrottle(brushSize, 50)

    // Use throttledBrushSize for render-heavy operations
    useEffect(() => {
        updateCanvasSettings(throttledBrushSize)
    }, [throttledBrushSize])

    return (
        <input
            type="range"
            min="1"
            max="50"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
        />
    )
}
```

### When to use throttle vs debounce

-   **Use throttle** when you want regular updates during continuous changes:
    -   Scroll position tracking
    -   Mouse movement tracking
    -   Window resize events
    -   Real-time gaming inputs
    -   Progress bar updates
-   **Use debounce** when you want to wait until changes stop:
    -   Search input (wait for user to stop typing)
    -   Form validation
    -   Auto-save functionality
    -   API calls based on user input

### Tests

See `src/utility/hooks/__tests__/useThrottle.test.tsx` for comprehensive tests covering basic throttling, rapid changes, timing behavior, different delays, various value types, cleanup, and edge cases.

---

## useResizeObserver

Observes size changes of an element using the modern ResizeObserver API. This hook provides more accurate and performant resize detection compared to window resize events or polling.

### API

```ts
useResizeObserver<T extends HTMLElement>(
  ref: RefObject<T>,
  options?: UseResizeObserverOptions
): ResizeObserverEntry | null
```

### Parameters

-   **ref**: Reference to the element to observe
-   **options** (optional):
    -   **box**: Observation box type (`'border-box'` | `'content-box'` | `'device-pixel-content-box'`) - defaults to `'content-box'`
    -   **onResize**: Callback function called on each resize with the entry

### Returns

`ResizeObserverEntry | null` - The latest resize observation entry or null if not yet observed

### Features

-   **Modern API**: Uses the native ResizeObserver API for accurate size tracking
-   **Multiple box types**: Observe border-box, content-box, or device-pixel-content-box
-   **Callback support**: Optional callback for side effects on resize
-   **Automatic cleanup**: Disconnects observer on unmount
-   **SSR safe**: Checks for ResizeObserver availability
-   **Detailed metrics**: Access to contentRect, borderBoxSize, contentBoxSize, and devicePixelContentBoxSize

### Usage

**Basic element size tracking:**

```tsx
import { useResizeObserver } from './utility/hooks'

function ResizableComponent() {
    const ref = useRef<HTMLDivElement>(null)
    const entry = useResizeObserver(ref)

    return (
        <div
            ref={ref}
            style={{ resize: 'both', overflow: 'auto', border: '1px solid' }}
        >
            {entry && (
                <div>
                    Width: {Math.round(entry.contentRect.width)}px
                    <br />
                    Height: {Math.round(entry.contentRect.height)}px
                </div>
            )}
            Resize me!
        </div>
    )
}
```

**With callback:**

```tsx
function ComponentWithCallback() {
    const ref = useRef<HTMLDivElement>(null)

    useResizeObserver(ref, {
        onResize: (entry) => {
            console.log('Element resized:', entry.contentRect)
        },
    })

    return <div ref={ref}>Content that triggers callback on resize</div>
}
```

**Border-box observation:**

```tsx
function BorderBoxObserver() {
    const ref = useRef<HTMLDivElement>(null)
    const entry = useResizeObserver(ref, { box: 'border-box' })

    return (
        <div ref={ref} style={{ padding: 20, border: '10px solid' }}>
            {entry?.borderBoxSize && (
                <div>
                    Border box size: {entry.borderBoxSize[0].inlineSize} x{' '}
                    {entry.borderBoxSize[0].blockSize}
                </div>
            )}
        </div>
    )
}
```

**Responsive layout adaptation:**

```tsx
function ResponsiveCard() {
    const ref = useRef<HTMLDivElement>(null)
    const entry = useResizeObserver(ref)
    const width = entry?.contentRect.width ?? 0

    const layout = width < 300 ? 'compact' : width < 600 ? 'normal' : 'expanded'

    return (
        <div ref={ref} className={`card card--${layout}`}>
            <h2>Responsive Card</h2>
            <p>Layout: {layout}</p>
            <p>Current width: {Math.round(width)}px</p>
        </div>
    )
}
```

**Chart that adapts to container:**

```tsx
function AdaptiveChart({ data }) {
    const containerRef = useRef<HTMLDivElement>(null)
    const entry = useResizeObserver(containerRef)

    const chartWidth = entry?.contentRect.width ?? 400
    const chartHeight = entry?.contentRect.height ?? 300

    return (
        <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
            <svg width={chartWidth} height={chartHeight}>
                {/* Chart renders with exact container dimensions */}
            </svg>
        </div>
    )
}
```

**Performance monitoring:**

```tsx
function PerformanceMonitor() {
    const ref = useRef<HTMLDivElement>(null)
    const [resizeCount, setResizeCount] = useState(0)

    useResizeObserver(ref, {
        onResize: (entry) => {
            setResizeCount((c) => c + 1)
            console.log('Resize detected:', {
                width: entry.contentRect.width,
                height: entry.contentRect.height,
                timestamp: Date.now(),
            })
        },
    })

    return (
        <div ref={ref} style={{ resize: 'both', overflow: 'auto' }}>
            <p>Resize count: {resizeCount}</p>
            <p>Resize this element to test</p>
        </div>
    )
}
```

**Grid item auto-sizing:**

```tsx
function AutoSizingGridItem() {
    const ref = useRef<HTMLDivElement>(null)
    const entry = useResizeObserver(ref)
    const area = entry ? entry.contentRect.width * entry.contentRect.height : 0

    const fontSize = Math.max(12, Math.min(24, Math.sqrt(area) / 10))

    return (
        <div ref={ref} style={{ fontSize }}>
            <h3>Auto-sizing Content</h3>
            <p>Font size adapts to element size</p>
            <small>Area: {Math.round(area)}px²</small>
        </div>
    )
}
```

### Browser Support

ResizeObserver is supported in all modern browsers. The hook includes a check and warning for older browsers that don't support it.

### Performance Notes

-   ResizeObserver fires efficiently on actual size changes only
-   More performant than polling or window resize listeners
-   Fires before paint for smooth visual updates
-   Use the callback option for side effects to avoid unnecessary re-renders

### Comparison with other hooks

-   **vs useSize**: useResizeObserver uses the modern API and provides more detailed metrics
-   **vs useWindowSize**: useResizeObserver tracks specific elements, not the window
-   **vs useResize**: useResizeObserver is read-only observation, useResize is for interactive resizing

### Tests

See `src/utility/hooks/__tests__/useResizeObserver.test.tsx` for comprehensive tests covering observation, callbacks, box types, multiple resize events, cleanup, browser support detection, and ref changes.

---

## useIntersectionObserver

Observes visibility changes of an element using the IntersectionObserver API. Provides more control and flexibility than useOnScreen with full access to IntersectionObserver options and intersection details.

### API

```ts
useIntersectionObserver<T extends HTMLElement>(
  ref: RefObject<T>,
  options?: UseIntersectionObserverOptions
): IntersectionObserverEntry | null
```

### Parameters

-   **ref**: Reference to the element to observe
-   **options** (optional):
    -   **root**: The element used as viewport for checking visibility (defaults to browser viewport)
    -   **rootMargin**: Margin around root (e.g., `'10px 20px'`) - defaults to `'0px'`
    -   **threshold**: Number or array of numbers between 0 and 1 indicating visibility percentage(s) to trigger callback - defaults to `0`
    -   **freezeOnceVisible**: If true, stops observing after element becomes visible once - defaults to `false`
    -   **onChange**: Callback function called on each intersection change with the entry

### Returns

`IntersectionObserverEntry | null` - The latest intersection entry or null if not yet observed

### Features

-   **Flexible visibility detection**: Control when callbacks fire with threshold options
-   **Root viewport control**: Observe relative to any scrollable ancestor
-   **Root margin support**: Trigger earlier/later with margin offsets
-   **Freeze on visible**: Optimize performance by stopping observation once visible
-   **Detailed intersection data**: Access full IntersectionObserverEntry with ratios, bounds, and timing
-   **Automatic cleanup**: Disconnects observer on unmount
-   **SSR safe**: Checks for IntersectionObserver availability

### Usage

**Basic visibility detection:**

```tsx
import { useIntersectionObserver } from './utility/hooks'

function LazyImage({ src, alt }) {
    const ref = useRef<HTMLImageElement>(null)
    const entry = useIntersectionObserver(ref, { threshold: 0.1 })
    const isVisible = entry?.isIntersecting

    return (
        <img
            ref={ref}
            src={isVisible ? src : undefined}
            alt={alt}
            loading="lazy"
        />
    )
}
```

**Lazy load with freeze (load once):**

```tsx
function LazyLoadedComponent() {
    const ref = useRef<HTMLDivElement>(null)
    const entry = useIntersectionObserver(ref, {
        threshold: 0.5,
        freezeOnceVisible: true,
    })

    const shouldLoad = entry?.isIntersecting

    return (
        <div ref={ref}>
            {shouldLoad ? <ExpensiveComponent /> : <Placeholder />}
        </div>
    )
}
```

**Scroll-triggered animation:**

```tsx
function AnimateOnScroll({ children }) {
    const ref = useRef<HTMLDivElement>(null)
    const entry = useIntersectionObserver(ref, {
        threshold: 0.3,
        rootMargin: '-50px',
    })

    const isVisible = entry?.isIntersecting

    return (
        <div
            ref={ref}
            className={cn('transition-all duration-700', {
                'opacity-100 translate-y-0': isVisible,
                'opacity-0 translate-y-10': !isVisible,
            })}
        >
            {children}
        </div>
    )
}
```

**Progress tracking with multiple thresholds:**

```tsx
function ProgressTracker() {
    const ref = useRef<HTMLDivElement>(null)
    const [progress, setProgress] = useState(0)

    useIntersectionObserver(ref, {
        threshold: [0, 0.25, 0.5, 0.75, 1],
        onChange: (entry) => {
            setProgress(Math.round(entry.intersectionRatio * 100))
        },
    })

    return (
        <div ref={ref} style={{ height: '200vh' }}>
            <div style={{ position: 'sticky', top: 0 }}>
                Progress: {progress}%
            </div>
        </div>
    )
}
```

**Viewport-relative observation:**

```tsx
function ScrollContainer() {
    const containerRef = useRef<HTMLDivElement>(null)
    const itemRef = useRef<HTMLDivElement>(null)

    const entry = useIntersectionObserver(itemRef, {
        root: containerRef.current,
        threshold: 1.0, // Fully visible within container
    })

    return (
        <div ref={containerRef} style={{ height: 400, overflow: 'auto' }}>
            <div style={{ height: 800 }}>
                <div ref={itemRef}>
                    {entry?.isIntersecting
                        ? 'Fully visible in container'
                        : 'Not fully visible'}
                </div>
            </div>
        </div>
    )
}
```

**Analytics tracking:**

```tsx
function ArticleView({ articleId }) {
    const ref = useRef<HTMLDivElement>(null)
    const [viewed, setViewed] = useState(false)

    useIntersectionObserver(ref, {
        threshold: 0.75, // 75% visible
        onChange: (entry) => {
            if (entry.isIntersecting && !viewed) {
                trackArticleView(articleId)
                setViewed(true)
            }
        },
    })

    return (
        <article ref={ref}>
            <h1>Article Title</h1>
            <p>Content...</p>
        </article>
    )
}
```

**Infinite scroll:**

```tsx
function InfiniteList() {
    const loadMoreRef = useRef<HTMLDivElement>(null)
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(false)

    useIntersectionObserver(loadMoreRef, {
        threshold: 1.0,
        onChange: async (entry) => {
            if (entry.isIntersecting && !loading) {
                setLoading(true)
                const newItems = await fetchMoreItems()
                setItems((prev) => [...prev, ...newItems])
                setLoading(false)
            }
        },
    })

    return (
        <div>
            {items.map((item) => (
                <div key={item.id}>{item.content}</div>
            ))}
            <div ref={loadMoreRef}>{loading ? 'Loading...' : 'Load more'}</div>
        </div>
    )
}
```

**Visibility percentage tracking:**

```tsx
function VisibilityMeter() {
    const ref = useRef<HTMLDivElement>(null)
    const entry = useIntersectionObserver(ref, {
        threshold: Array.from({ length: 101 }, (_, i) => i / 100), // 0%, 1%, 2%, ... 100%
    })

    const visiblePercent = Math.round((entry?.intersectionRatio ?? 0) * 100)

    return (
        <div ref={ref} style={{ height: 300 }}>
            <div>Visible: {visiblePercent}%</div>
            <div
                style={{
                    width: `${visiblePercent}%`,
                    height: 4,
                    background: 'green',
                }}
            />
        </div>
    )
}
```

### Browser Support

IntersectionObserver is supported in all modern browsers. The hook includes a check and warning for older browsers that don't support it.

### Performance Tips

-   Use `freezeOnceVisible: true` for one-time visibility checks (lazy loading)
-   Keep threshold arrays reasonable (avoid hundreds of values unless necessary)
-   Use `onChange` callback for side effects to avoid unnecessary re-renders
-   Consider `rootMargin` for earlier/later triggering without changing thresholds

### Comparison with other hooks

-   **vs useOnScreen**: useIntersectionObserver provides full IntersectionObserver API access with more options
-   **vs useResizeObserver**: useIntersectionObserver tracks visibility/position, useResizeObserver tracks size
-   **vs useScrollPosition**: useIntersectionObserver is more efficient for visibility detection

### Tests

See `src/utility/hooks/__tests__/useIntersectionObserver.test.tsx` for comprehensive tests covering observation, callbacks, thresholds, root margins, freeze behavior, multiple updates, and browser support detection.

---

## useIsFirstRender

Returns `true` if the component is on its first render, `false` otherwise. Useful for skipping effects on mount or handling first-render-only logic.

### API

```tsx
const isFirstRender: boolean = useIsFirstRender()
```

### Parameters

None

### Returns

-   `boolean` - `true` if this is the first render, `false` for all subsequent renders

### Features

-   ✅ Extremely lightweight (single ref)
-   ✅ Stable reference (doesn't change identity)
-   ✅ Each hook instance independent
-   ✅ Works in React 18+ strict mode
-   ✅ TypeScript support
-   ✅ No dependencies

### Usage

```tsx
import { useIsFirstRender } from './utility/hooks'

// Skip effect on first render
function MyComponent() {
    const [count, setCount] = useState(0)
    const isFirstRender = useIsFirstRender()

    useEffect(() => {
        if (!isFirstRender) {
            console.log('Count changed:', count)
        }
    }, [count, isFirstRender])

    return <button onClick={() => setCount(count + 1)}>Count: {count}</button>
}

// Show different UI on first render
function WelcomeMessage() {
    const isFirstRender = useIsFirstRender()

    return (
        <div>
            {isFirstRender ? <h1>Welcome! 🎉</h1> : <h1>Welcome back!</h1>}
        </div>
    )
}

// Conditional effect execution
function DataFetcher({ id }) {
    const isFirstRender = useIsFirstRender()

    useEffect(() => {
        // Only fetch on ID changes, not on mount
        if (!isFirstRender) {
            fetchData(id)
        }
    }, [id, isFirstRender])
}

// Debug render count
function DebugComponent() {
    const isFirstRender = useIsFirstRender()
    const renderCount = useRef(0)

    renderCount.current++

    console.log(`Render #${renderCount.current} - First: ${isFirstRender}`)

    return <div>Check console</div>
}
```

### How it works

The hook uses a `useRef` to track whether the component has rendered before. The ref is initialized to `true` on mount. On the first call (first render), it returns `true` and sets the ref to `false`. All subsequent calls return `false`.

### When to use

-   **Skip mount effects**: Run effects only on updates, not on mount
-   **First-render UI**: Show different content on first vs subsequent renders
-   **Conditional logic**: Execute code based on whether it's the first render
-   **Debug rendering**: Track whether a component just mounted

### Notes

-   Each instance of `useIsFirstRender` has its own independent state
-   The hook returns `true` on the first render even in React 18 strict mode (which double-renders)
-   The returned value doesn't change identity, so it's safe to use in dependency arrays
-   For checking if a component is mounted (not unmounted), consider a different pattern

### Tests

See `src/utility/hooks/__tests__/useIsFirstRender.test.tsx` for comprehensive tests covering basic behavior, state updates, multiple instances, unmount/remount, strict mode, and consistency.

---

## useClickAway

Detects clicks outside of specified element(s). A more feature-rich alternative to `useOnClickOutside`, `useClickOutside`, and `useDetectOutsideClick` with support for multiple refs, custom event types, and configurable options.

### API

```tsx
useClickAway<T extends HTMLElement>(
    refs: RefObject<T | null> | Array<RefObject<T | null>>,
    handler: (event: MouseEvent | TouchEvent | FocusEvent) => void,
    options?: {
        events?: Array<'mousedown' | 'mouseup' | 'touchstart' | 'touchend' | 'focusin'>
        capture?: boolean
    }
): void
```

### Parameters

-   `refs` - Single ref or array of refs to monitor. Clicks outside all these elements will trigger the handler
-   `handler` - Callback function invoked when a click occurs outside
-   `options` (optional)
    -   `events` - Array of event types to listen for (default: `['mousedown', 'touchstart']`)
    -   `capture` - Whether to use event capture phase (default: `true`)

### Features

-   ✅ Support for single or multiple refs
-   ✅ Customizable event types (mouse, touch, focus)
-   ✅ Event capture control
-   ✅ Stable handler reference (doesn't re-attach listeners on handler change)
-   ✅ Automatic cleanup on unmount
-   ✅ Handles nested elements correctly
-   ✅ Graceful handling of null refs
-   ✅ TypeScript support with generic types

### Usage

```tsx
import { useClickAway } from './utility/hooks'

// Basic usage - single ref
function Dropdown() {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useClickAway(ref, () => setOpen(false))

    return (
        <div ref={ref}>
            <button onClick={() => setOpen(!open)}>Toggle</button>
            {open && <div>Dropdown content</div>}
        </div>
    )
}

// Multiple refs
function ComplexModal() {
    const [open, setOpen] = useState(true)
    const modalRef = useRef<HTMLDivElement>(null)
    const triggerRef = useRef<HTMLButtonElement>(null)

    // Click outside both modal AND trigger button closes modal
    useClickAway([modalRef, triggerRef], () => setOpen(false))

    return (
        <>
            <button ref={triggerRef}>Open Modal</button>
            {open && (
                <div ref={modalRef}>
                    <h2>Modal Content</h2>
                </div>
            )}
        </>
    )
}

// Custom events
function FocusAwareMenu() {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    // Close on click, touch, or focus outside
    useClickAway(ref, () => setOpen(false), {
        events: ['mousedown', 'touchstart', 'focusin'],
    })

    return (
        <div ref={ref}>
            <input placeholder="Menu stays open on focus" />
        </div>
    )
}

// Mouse up events
function ContextMenu() {
    const [position, setPosition] = useState<{ x: number; y: number } | null>(
        null
    )
    const ref = useRef<HTMLDivElement>(null)

    useClickAway(ref, () => setPosition(null), {
        events: ['mouseup'], // Close on mouse up instead of mouse down
    })

    return position ? (
        <div
            ref={ref}
            style={{ position: 'absolute', left: position.x, top: position.y }}
        >
            Context menu
        </div>
    ) : null
}

// With event details
function SmartPopover() {
    const [open, setOpen] = useState(true)
    const ref = useRef<HTMLDivElement>(null)

    useClickAway(ref, (event) => {
        console.log('Clicked outside at:', event.target)
        setOpen(false)
    })

    return open ? <div ref={ref}>Popover</div> : null
}

// Conditional closing
function AdvancedMenu() {
    const [open, setOpen] = useState(false)
    const [locked, setLocked] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useClickAway(ref, () => {
        if (!locked) setOpen(false)
    })

    return (
        <div ref={ref}>
            <button onClick={() => setLocked(!locked)}>
                {locked ? 'Unlock' : 'Lock'}
            </button>
            {open && <div>Menu content</div>}
        </div>
    )
}

// Null ref handling
function LazyComponent() {
    const [loaded, setLoaded] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    // Safe to use before ref is attached
    useClickAway(ref, () => console.log('Clicked outside'))

    useEffect(() => {
        setTimeout(() => setLoaded(true), 1000)
    }, [])

    return loaded ? <div ref={ref}>Content</div> : <div>Loading...</div>
}
```

### Comparison with other hooks

-   **vs useOnClickOutside**: useClickAway supports multiple refs and custom event types
-   **vs useClickOutside**: useClickAway has a more flexible API with options
-   **vs useDetectOutsideClick**: useClickAway provides better TypeScript support and more features

### When to use

-   **Dropdowns & Menus**: Close when clicking outside
-   **Modals & Dialogs**: Dismiss on backdrop click
-   **Popovers & Tooltips**: Hide when focus moves away
-   **Context Menus**: Close on outside interaction
-   **Date Pickers**: Collapse when clicking elsewhere
-   **Search Suggestions**: Hide results when clicking away

### Notes

-   The handler ref is updated without re-attaching event listeners for better performance
-   Events are attached to `document` with optional capture phase control
-   Supports React 18+ and works correctly with strict mode
-   When using multiple refs, ALL refs must be clicked outside for the handler to trigger
-   Null refs are treated as "not containing the click" (i.e., outside)
-   The `capture` option affects event propagation order - `true` means handler runs during capture phase

### Tests

See `src/utility/hooks/__tests__/useClickAway.test.tsx` for comprehensive tests covering single/multiple refs, custom events, handler updates, null refs, cleanup, nested elements, capture option, and all event types.

---

## useDebounce (effect)

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
