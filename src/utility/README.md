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

# Utility: isEmpty

Checks if a value is empty. Works with arrays, objects, strings, Maps, Sets, null, and undefined.

## API

```ts
isEmpty(value: unknown): boolean
```

## Usage

```ts
isEmpty([])
// true

isEmpty({})
// true

isEmpty('')
// true

isEmpty(null)
// true

isEmpty(undefined)
// true

isEmpty(new Map())
// true

isEmpty(new Set())
// true

isEmpty([1, 2, 3])
// false

isEmpty({ a: 1 })
// false

isEmpty('hello')
// false

isEmpty(0)
// false (number zero is not considered empty)

isEmpty(false)
// false (boolean false is not considered empty)
```

## Behavior and limitations

-   Arrays: empty if length is 0
-   Objects: empty if no enumerable own properties (uses `Object.keys()`)
-   Strings: empty if length is 0 (whitespace-only strings are NOT empty)
-   Maps/Sets: empty if size is 0
-   null/undefined: always empty
-   Built-in objects (Date, RegExp, Error, Promise): never empty
-   Numbers, booleans, functions, symbols: never empty
-   Objects with only non-enumerable properties are considered empty
-   Objects with prototype properties but no own properties are considered empty

## Common use cases

-   Validating form inputs (empty string check)
-   Checking if API responses have data
-   Conditional rendering based on array/object content
-   Guard clauses to handle null/undefined
-   Validating required fields

## Tests

See `src/utility/__tests__/isEmpty.test.ts` for 46 comprehensive tests covering all data types and edge cases.

---

# Utility: mapValues

Creates a new object with the same keys as the input object, but with values transformed by a mapper function.

## API

```ts
mapValues<T extends Record<string, unknown>, U>(
    obj: T,
    mapper: (value: T[keyof T], key: keyof T, object: T) => U
): Record<keyof T, U>
```

## Usage

```ts
mapValues({ a: 1, b: 2, c: 3 }, (v) => v * 2)
// { a: 2, b: 4, c: 6 }

mapValues({ name: 'john', city: 'paris' }, (v) => v.toUpperCase())
// { name: 'JOHN', city: 'PARIS' }

mapValues({ a: 1, b: 2 }, (v, key) => `${key}:${v}`)
// { a: 'a:1', b: 'b:2' }

// Type transformations
const user = { name: 'Alice', age: 25 }
mapValues(user, (v) => String(v).length)
// { name: 5, age: 2 }

// Extract nested properties
const users = {
    user1: { name: 'Alice', age: 25 },
    user2: { name: 'Bob', age: 30 },
}
mapValues(users, (user) => user.name)
// { user1: 'Alice', user2: 'Bob' }

// Apply defaults
const settings = { volume: 0, brightness: undefined }
mapValues(settings, (v) => v ?? 100)
// { volume: 0, brightness: 100 }
```

## Behavior and limitations

-   Only processes own enumerable properties (uses `for...in` with `hasOwnProperty`)
-   Does not process inherited or non-enumerable properties
-   Returns a new object (does not mutate the original)
-   Mapper receives three arguments: value, key, and the original object
-   Key types are preserved in the result type
-   Works with any value types (primitives, objects, arrays, functions, etc.)

## Common use cases

-   Transform all values in a configuration object
-   Extract specific properties from nested objects
-   Apply default values to optional properties
-   Convert data types (strings to numbers, etc.)
-   Normalize or format data for APIs
-   Compute derived values (prices with tax, distances in different units)
-   Build lookup tables or indices

## Tests

See `src/utility/__tests__/mapValues.test.ts` for 34 comprehensive tests covering transformations, type changes, immutability, and edge cases.

---

# Utility: flatten

Flattens a nested array structure by a specified depth.

## API

```ts
flatten<T>(array: readonly T[], depth?: number): T[]
```

## Usage

```ts
flatten([1, [2, 3], [4, [5]]])
// [1, 2, 3, 4, [5]] (default depth is 1)

flatten([1, [2, [3, [4]]]], 2)
// [1, 2, 3, [4]]

flatten([1, [2, [3, [4]]]], Infinity)
// [1, 2, 3, 4] (completely flat)

flatten([1, 2, 3])
// [1, 2, 3] (no change if not nested)

// Flatten simple nested arrays
flatten([
    [1, 2],
    [3, 4],
    [5, 6],
])
// [1, 2, 3, 4, 5, 6]

// Control depth
flatten([1, [2, [3, [4, [5]]]]], 3)
// [1, 2, 3, 4, [5]]

// Don't flatten with depth 0
flatten([1, [2, [3]]], 0)
// [1, [2, [3]]] (no change)
```

## Behavior and limitations

-   Default depth is 1 (flattens one level)
-   Use `Infinity` as depth to flatten completely
-   Depth of 0 or negative values returns a copy without flattening
-   Uses recursive approach with reduce
-   Does not mutate the original array
-   Preserves order of elements
-   Works with any data types (primitives, objects, functions, etc.)
-   Empty nested arrays are removed when flattened

## Common use cases

-   Combining paginated API results into a single array
-   Merging grouped or categorized data
-   Processing nested task or menu structures
-   Flattening array chunks back into a single array
-   Simplifying deeply nested data structures
-   Preparing nested data for rendering or iteration

## Tests

See `src/utility/__tests__/flatten.test.ts` for 38 comprehensive tests covering depth control, data types, immutability, and practical use cases.

---

# Utility: mergeDeep

Deep merges multiple objects into a new object. Later objects take precedence over earlier ones. Arrays are replaced, not merged.

## API

```ts
mergeDeep<T extends Record<string, unknown>>(
    ...objects: Array<Record<string, unknown> | null | undefined>
): T
```

## Usage

```ts
mergeDeep({ a: 1, b: 2 }, { b: 3, c: 4 })
// { a: 1, b: 3, c: 4 }

mergeDeep({ a: { x: 1, y: 2 } }, { a: { y: 3, z: 4 } })
// { a: { x: 1, y: 3, z: 4 } } (deep merge)

mergeDeep({ arr: [1, 2] }, { arr: [3, 4] })
// { arr: [3, 4] } (arrays are replaced, not merged)

mergeDeep({ a: 1 }, { b: 2 }, { c: 3 })
// { a: 1, b: 2, c: 3 } (multiple objects)

// Merge configuration with defaults
const defaults = {
    api: { url: '/api', timeout: 5000 },
    features: { auth: true, analytics: false },
}
const userConfig = {
    api: { timeout: 10000 },
    features: { analytics: true },
}
mergeDeep(defaults, userConfig)
// {
//   api: { url: '/api', timeout: 10000 },
//   features: { auth: true, analytics: true }
// }

// Null and undefined handling
mergeDeep({ a: 1 }, { a: null })
// { a: null } (null replaces value)

mergeDeep({ a: 1 }, null, { b: 2 })
// { a: 1, b: 2 } (null arguments are skipped)
```

## Behavior and limitations

-   Deep merges plain objects recursively
-   Arrays are replaced entirely, not merged element-by-element
-   Later objects take precedence over earlier ones
-   Null and undefined values replace existing values
-   Null or undefined arguments are skipped
-   Only merges plain objects (excludes Date, RegExp, Map, Set, etc.)
-   Special objects (Date, RegExp, Error, etc.) are replaced, not merged
-   Does not mutate input objects - returns new object
-   Only processes own enumerable properties
-   Does not merge inherited or non-enumerable properties

## Common use cases

-   Merging configuration objects with defaults
-   Combining user settings with system defaults
-   Updating nested state immutably
-   Merging API responses with cached data
-   Building complex objects from multiple sources
-   Applying partial updates to form data
-   Creating configuration overrides

## Tests

See `src/utility/__tests__/mergeDeep.test.ts` for 47 comprehensive tests covering nested merging, arrays, null handling, immutability, and practical use cases.

---

# Utility: times

Executes a function n times and returns an array of the results. The function receives the current iteration index (0-based) as an argument.

## API

```ts
times<T>(n: number, fn: (index: number) => T): T[]
```

## Usage

```ts
times(5, (i) => i * 2)
// [0, 2, 4, 6, 8]

times(3, (i) => `item-${i}`)
// ['item-0', 'item-1', 'item-2']

times(0, (i) => i)
// []

// Generate array of objects
times(3, (i) => ({ id: i, name: `User ${i}` }))
// [
//   { id: 0, name: 'User 0' },
//   { id: 1, name: 'User 1' },
//   { id: 2, name: 'User 2' }
// ]

// Create test data
times(5, (i) => ({
    id: i + 1,
    title: `Post ${i + 1}`,
    published: true,
}))

// Generate repeated elements
times(10, () => 'x').join('')
// 'xxxxxxxxxx'

// Create pagination numbers
times(5, (i) => i + 1)
// [1, 2, 3, 4, 5]

// Generate matrix
times(3, (row) => times(3, (col) => row * 3 + col))
// [[0, 1, 2], [3, 4, 5], [6, 7, 8]]
```

## Behavior and limitations

-   Function receives the current index (0 to n-1) as its argument
-   Returns an array containing all function results
-   n must be a non-negative integer
-   Throws error if n is negative, NaN, Infinity, or not an integer
-   Uses a simple for loop (no recursion, safe for large n)
-   Function is called sequentially, not in parallel
-   If function throws during execution, the error propagates immediately

## Common use cases

-   Generate test data or mock API responses
-   Create arrays of placeholder/skeleton elements for loading states
-   Build pagination page numbers
-   Generate repeated strings or patterns
-   Create arrays of React keys
-   Initialize arrays with computed values
-   Generate coordinates or grid positions
-   Create arrays of promises for batch operations
-   Build matrices or nested arrays
-   Render repeated components in loops

## Tests

See `src/utility/__tests__/times.test.ts` for 41 comprehensive tests covering basic functionality, return types, edge cases, practical use cases, and performance.

---

# Utility: delay

Creates a promise that resolves after a specified delay (in milliseconds). Optionally resolves with a provided value.

## API

```ts
delay<T = void>(ms: number, value?: T): Promise<T>
```

## Usage

```ts
// Basic delay
await delay(1000) // Wait 1 second

// Delay with a return value
const result = await delay(1000, 'done')
// result === 'done'

// Delay in async operations
async function fetchData() {
    await delay(500) // Simulate API latency
    return { data: 'loaded' }
}

// Sequential delays
await delay(100)
console.log('first')
await delay(100)
console.log('second')

// Chained delays
delay(100, 'a')
    .then((v) => delay(100, v + 'b'))
    .then((v) => console.log(v)) // 'ab'

// Timeout pattern
const timeout = delay(5000, 'timeout')
const operation = fetchData()
const result = await Promise.race([operation, timeout])

// Debounced/throttled operations
async function processWithDelay(item) {
    await delay(100)
    return process(item)
}

// Animation timing
for (let i = 0; i < 10; i++) {
    updateFrame(i)
    await delay(16) // ~60fps
}

// Retry with delay
async function retryOperation() {
    try {
        return await apiCall()
    } catch {
        await delay(1000)
        return await apiCall()
    }
}

// Concurrent delays with Promise.all
await Promise.all([delay(100, 1), delay(100, 2), delay(100, 3)])
// All resolve after 100ms (not 300ms)

// Type inference
const num = await delay(100, 42) // num: number
const str = await delay(100, 'hello') // str: string
const none = await delay(100) // none: void
```

## Behavior and limitations

-   Uses `setTimeout` internally for the delay
-   ms must be non-negative and finite (throws error otherwise)
-   Supports fractional milliseconds (e.g., 16.67 for precise timing)
-   Zero delay (delay(0)) schedules callback on next event loop tick
-   Returns a Promise that resolves after the specified time
-   Generic type parameter T infers from the value argument
-   When called without a value, returns Promise<void>
-   Delays are not cancelable once created (use AbortController pattern if needed)
-   Not suitable for precise real-time operations (browser timer resolution varies)
-   Multiple concurrent delays run independently

## Common use cases

-   Simulating API latency in tests or demos
-   Adding delays between operations (rate limiting, throttling)
-   Implementing retry logic with exponential backoff
-   Creating timeouts with Promise.race
-   Animating UI changes with frame delays
-   Debouncing user actions
-   Pausing execution in async workflows
-   Staggering concurrent operations
-   Testing asynchronous code with Jest fake timers
-   Building simple polling mechanisms

## Tests

See `src/utility/__tests__/delay.test.ts` for 32 comprehensive tests covering basic functionality, return values, error handling, timing precision, concurrent delays, chaining, and type inference.

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

---

# Utility: toggle

Creates a function that alternates between two values on each call.

## API

```ts
toggle<A, B>(a: A, b: B): () => A | B
```

## Usage

```ts
const t = toggle('a', 'b')
t() // 'a'
t() // 'b'
t() // 'a'
t() // 'b'
```

```ts
// Toggle theme
const toggleTheme = toggle('light', 'dark')
const theme1 = toggleTheme() // 'light'
const theme2 = toggleTheme() // 'dark'
const theme3 = toggleTheme() // 'light'
```

```ts
// Toggle boolean state
const toggleEnabled = toggle(false, true)
let enabled = toggleEnabled() // false
enabled = toggleEnabled() // true
enabled = toggleEnabled() // false
```

```ts
// Toggle between objects
const devConfig = { env: 'development', debug: true }
const prodConfig = { env: 'production', debug: false }
const toggleConfig = toggle(devConfig, prodConfig)

const config1 = toggleConfig() // devConfig
const config2 = toggleConfig() // prodConfig
```

```ts
// Toggle sort order
const toggleSort = toggle('asc', 'desc')
const sortOrder = [1, 2, 3, 4].map(() => toggleSort())
// ['asc', 'desc', 'asc', 'desc']
```

## Behavior and limitations

-   First call always returns the first value (`a`)
-   Subsequent calls alternate between `a` and `b`
-   Each toggle instance maintains independent state
-   Works with any types including primitives, objects, arrays, functions
-   Returns union type `A | B` for full type safety
-   State is preserved across all calls to the same toggle instance
-   No way to reset state - create a new toggle instance if needed

## Common use cases

-   Theme switching (light/dark mode)
-   Sort order toggling (asc/desc)
-   View mode switching (grid/list)
-   Play/pause state
-   Visibility toggling (visible/hidden)
-   Icon switching
-   Language switching
-   Config switching
-   Animation class cycling
-   Pagination direction

## Tests

See `src/utility/__tests__/toggle.test.ts` for comprehensive tests covering basic functionality, data types, independence, edge cases, practical use cases, composition, type inference, and performance.
