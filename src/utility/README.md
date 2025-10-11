# Utility: curry

A lightweight curry helper for fixed-arity functions.

## Usage

-   Provide arguments across multiple calls until the function’s arity (`fn.length`) is met.
-   You can pass multiple arguments per step.

Examples:

-   const add3 = (a: number, b: number, c: number) => a + b + c
-   curry(add3)(1)(2)(3) // 6
-   curry(add3)(1, 2)(3) // 6
-   curry(add3)(1)(2, 3) // 6

## Behavior and limitations

-   Completion uses `fn.length`. Functions with default or rest parameters have `length === 0` and will execute immediately on first invocation. This is expected and matches how JS reports arity.
-   Extra arguments beyond the original arity are forwarded to the function. Most JS functions ignore extras.
-   `this` is preserved across partial applications (works with `.call`/`.bind`).
-   Placeholders are not supported.

## Tests

See `src/utility/__tests__/curry.test.ts` for grouped-argument, zero-arity, default-parameter, and extra-argument cases.

---

# Utility: range

Creates an array of numbers from start to end (inclusive), optionally with a step.

## API

```ts
range(start: number, end: number, step?: number): number[]
```

## Usage

```ts
range(1, 5)
// [1, 2, 3, 4, 5]

range(0, 10, 2)
// [0, 2, 4, 6, 8, 10]

range(5, 1)
// [5, 4, 3, 2, 1] (auto-detects descending)

range(5, 1, -2)
// [5, 3, 1]

range(-3, 3)
// [-3, -2, -1, 0, 1, 2, 3]

// Common use cases
range(1, 100).map((i) => fetchPage(i)) // Fetch pages 1-100
range(0, 9).map((i) => <Item key={i} />) // Render 10 items
range(1, 12).map((m) => getMonthData(m)) // Process all months
```

## Behavior and limitations

-   End value is inclusive (unlike some implementations that are exclusive)
-   Auto-detects direction: step defaults to 1 for ascending, -1 for descending
-   Supports fractional steps (e.g., 0.5, 0.1)
-   Throws error if step is zero
-   Throws error if step direction conflicts with start/end (e.g., positive step with start > end)
-   May not land exactly on end if step doesn't divide evenly

## Common use cases

-   Generating pagination numbers
-   Creating test data arrays
-   Iterating over numeric sequences
-   Rendering repeated components
-   Countdown timers

## Tests

See `src/utility/__tests__/range.test.ts` for comprehensive tests covering ascending/descending ranges, custom steps, edge cases, and floating point handling.

---

# Utility: chunk

Splits an array into smaller arrays (chunks) of a specified size.

## API

```ts
chunk<T>(array: readonly T[], size: number): T[][]
```

## Usage

```ts
chunk([1, 2, 3, 4, 5], 2)
// [[1, 2], [3, 4], [5]]

chunk(['a', 'b', 'c', 'd'], 2)
// [['a', 'b'], ['c', 'd']]

chunk([1, 2, 3, 4, 5, 6], 3)
// [[1, 2, 3], [4, 5, 6]]

// Common use cases
const items = Array.from({ length: 100 }, (_, i) => i)
const pages = chunk(items, 10) // Pagination: 10 pages of 10 items

const gridItems = ['a', 'b', 'c', 'd', 'e', 'f']
const rows = chunk(gridItems, 3) // Grid layout: 2 rows of 3 columns
```

## Behavior and limitations

-   Last chunk may contain fewer elements if array length is not evenly divisible
-   Size must be a positive integer (throws error otherwise)
-   Returns empty array for empty input
-   Does not mutate the original array
-   Preserves element references

## Tests

See `src/utility/__tests__/chunk.test.ts` for comprehensive tests covering edge cases, error handling, and various data types.

---

# Utility: partition

Splits an array into two arrays based on a predicate function.

## API

```ts
partition<T>(
    array: readonly T[],
    predicate: (value: T, index: number, array: readonly T[]) => boolean
): [T[], T[]]
```

Returns a tuple `[pass, fail]` where:

-   `pass` - Elements that satisfy the predicate
-   `fail` - Elements that don't satisfy the predicate

## Usage

```ts
// Separate even and odd numbers
partition([1, 2, 3, 4, 5], (x) => x % 2 === 0)
// [[2, 4], [1, 3, 5]]

// Separate by string prefix
partition(['apple', 'banana', 'avocado', 'cherry'], (s) => s.startsWith('a'))
// [['apple', 'avocado'], ['banana', 'cherry']]

// Separate active/inactive users
const users = [
    { name: 'Alice', active: true },
    { name: 'Bob', active: false },
    { name: 'Charlie', active: true },
]
const [activeUsers, inactiveUsers] = partition(users, (u) => u.active)
// activeUsers: [{ name: 'Alice', ... }, { name: 'Charlie', ... }]
// inactiveUsers: [{ name: 'Bob', ... }]

// Use index in predicate
partition(['a', 'b', 'c', 'd'], (_, i) => i % 2 === 0)
// [['a', 'c'], ['b', 'd']]
```

## Behavior and limitations

-   Predicate receives value, index, and array (like Array.filter)
-   Preserves order within each result array
-   Does not mutate the original array
-   Preserves element references
-   More efficient than running filter twice

## Common use cases

-   Separating valid/invalid data
-   Splitting active/inactive records
-   Categorizing by type or property
-   Conditional batch processing

## Tests

See `src/utility/__tests__/partition.test.ts` for comprehensive tests covering predicates with indices, type guards, and edge cases.

---

# Utility: pipe

Performs left-to-right function composition.

## API

```ts
pipe<A, B>(f1: (...args: A) => B): (...args: A) => B
pipe<A, B, C>(f1: (...args: A) => B, f2: (x: B) => C): (...args: A) => C
// ... up to 8 functions
```

## Usage

```ts
const addOne = (x: number) => x + 1
const double = (x: number) => x * 2
const square = (x: number) => x * x

const transform = pipe(addOne, double, square)
transform(3) // ((3 + 1) * 2) ^ 2 = 64

// More readable than nested calls:
// square(double(addOne(3)))
```

```ts
// String processing pipeline
const process = pipe(
    (s: string) => s.trim(),
    (s) => s.toLowerCase(),
    (s) => s.replace(/\s+/g, '-')
)
process('  Hello World  ') // 'hello-world'
```

```ts
// Data transformation pipeline
const users = [
    { name: 'Alice', age: 30 },
    { name: 'Bob', age: 25 },
]

const getAdultNames = pipe(
    (users: typeof users) => users.filter((u) => u.age >= 18),
    (users) => users.map((u) => u.name),
    (names) => names.sort()
)
getAdultNames(users) // ['Alice', 'Bob']
```

## Behavior and limitations

-   First function can accept multiple arguments
-   Subsequent functions receive single argument (result of previous function)
-   Executes functions left-to-right (opposite of `compose`)
-   Supports up to 8 functions with full type inference
-   More functions supported but lose type inference

## Common use cases

-   Data transformation pipelines
-   String processing
-   Functional programming workflows
-   Making nested function calls more readable

## Tests

See `src/utility/__tests__/pipe.test.ts` for comprehensive tests covering multiple functions, type transformations, and async patterns.

---

# Utility: memoize

Creates a memoized version of a function that caches results based on arguments.

## API

```ts
memoize<Args, Result>(fn: (...args: Args) => Result)
```

Returns a memoized function with cache control methods:

-   `cache.get(args)` - Get cached value
-   `cache.set(args, value)` - Manually set cache value
-   `cache.has(args)` - Check if args are cached
-   `cache.delete(args)` - Remove specific cached entry
-   `cache.clear()` - Clear all cache entries
-   `cache.size()` - Get number of cached entries

## Usage

```ts
const expensive = (a: number, b: number) => {
    console.log('Computing...')
    return a * b
}

const memoized = memoize(expensive)
memoized(5, 10) // logs "Computing...", returns 50
memoized(5, 10) // returns cached 50 (no log)
memoized(5, 11) // logs "Computing...", returns 55

// Cache control
memoized.cache.clear() // Clear all
memoized.cache.delete([5, 10]) // Clear specific
memoized.cache.has([5, 10]) // Check if cached
```

## Behavior and limitations

-   Uses `JSON.stringify` for cache keys, so arguments must be serializable
-   Functions, symbols, and circular references cannot be cached
-   `undefined` in arguments is treated as `null` (JSON limitation)
-   Errors are not cached; function is re-executed on each call
-   Object property order doesn't affect caching (same JSON string)

## Tests

See `src/utility/__tests__/memoize.test.ts` for comprehensive tests covering primitives, objects, arrays, cache control, and edge cases.

---

# Utility: throttle

Creates a throttled version of a function that only executes at most once per specified interval.

## API

```ts
throttle<Args, Result>(
    fn: (...args: Args) => Result,
    wait: number,
    options?: { leading?: boolean; trailing?: boolean }
)
```

Returns a throttled function with `cancel()` method.

Options:

-   `leading` (default: `true`) - Execute on the leading edge (first call)
-   `trailing` (default: `false`) - Execute on the trailing edge (after wait period with latest args)

## Usage

```ts
// Basic throttle - executes immediately, ignores subsequent calls for 1s
const handleScroll = throttle(() => {
    console.log('Scroll position:', window.scrollY)
}, 1000)

window.addEventListener('scroll', handleScroll)

// With trailing execution - first call executes immediately,
// last call within period executes after wait time
const saveData = throttle(
    (data: string) => {
        api.save(data)
    },
    2000,
    { trailing: true }
)

saveData('1') // Executes immediately
saveData('2') // Throttled
saveData('3') // Throttled, but will execute after 2s with '3'

// Cancel pending trailing execution
handleScroll.cancel()
```

## Behavior and limitations

-   First call with `leading: true` executes immediately
-   Subsequent calls within the wait period are throttled
-   With `trailing: true`, the last call's arguments are used for the trailing execution
-   Trailing execution is cancelled if `cancel()` is called
-   Returns last execution's result when throttled
-   Returns `undefined` if `leading: false` and no execution yet

## Common use cases

-   Scroll/resize event handlers (`leading: true`)
-   Auto-save with latest data (`leading: true, trailing: true`)
-   Rate-limiting API calls

## Tests

See `src/utility/__tests__/throttle.test.ts` for comprehensive tests covering leading/trailing behavior, cancellation, and edge cases.

---

# Utility: scan

Applies a reducer over an array, returning the intermediate accumulator values (one per input element).

## Overloads

-   scan(reducer, initialValue, array): R[]
-   scan(reducer, array): T[] // Uses first element as seed; [] -> []

## Examples

-   scan((acc, n) => acc + n, 0, [1,2,3]) -> [1,3,6]
-   scan((a, b) => a + b, [1,2,3]) -> [1,3,6]
-   scan((a, b) => a + b, ['a','b','c']) -> ['a','ab','abc']
-   scan<string[], number>((acc, n) => [...acc, String(n)], [], [1,2,3]) -> [["1"],["1","2"],["1","2","3"]]

## Lazy variant

-   Array.from(scanIter([1,2,3], (a,n) => a+n, 0)) -> [1,3,6]
-   Array.from(scanIter(new Set([1,2,3]), (a,n) => a+n, 0)) -> [1,3,6]

---

# Utility: atom and hooks

Atoms provide a tiny observable store primitive with derived values, lazy dependency tracking, and React hooks.

## API

-   `atom(initial: T): WritableAtom<T>`
-   `atom(get => T): ReadOnlyAtom<T>`

Read-only atoms compute from other atoms using the provided getter. Writable atoms hold a value and expose `set`.

All atoms support:

-   `get(): T` — reads current value (may recompute derived)
-   `subscribe(cb, notifyImmediately = true): () => void` — subscribe to changes
-   `_subscribers(): number` — number of active subscribers

## Hooks

-   `useAtom(atom: WritableAtom<T>): [T, (next: T) => void]`
-   `useAtomValue(atom: ReadOnlyAtom<T> | WritableAtom<T>): T`
-   `useSetAtom(atom: WritableAtom<T>): (next: T) => void`
-   `useAtomSelector(atom, selector, equals = Object.is): Selected`

Notes:

-   Hooks use `useSyncExternalStore` for React 18 safety.
-   `useAtomSelector` only re-renders when the selected slice changes (by `equals`).

## Examples

Writable:

```tsx
const count = atom(0)
const [value, setValue] = useAtom(count)
const setOnly = useSetAtom(count)
const doubled = useAtomSelector(count, (n) => n * 2)
```

Derived:

```tsx
const count = atom(2)
const doubled = atom((get) => get(count) * 2) // ReadOnlyAtom<number>
const v = useAtomValue(doubled) // 4
```

Type safety:

-   `useAtom(doubled)` is a TypeScript error (read-only atom).
-   `doubled.set(...)` is a TypeScript error; at runtime it throws if forced.

Behavior:

-   Derived atoms coalesce multiple dependency updates into a single notification per tick.
-   Derived atoms subscribe to dependencies only when they have subscribers (lazy).
