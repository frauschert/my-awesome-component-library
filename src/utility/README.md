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

## Tests

See `src/utility/__tests__/toggle.test.ts` for comprehensive tests covering basic functionality, data types, independence, edge cases, practical use cases, composition, type inference, and performance.

---

# Utility: lens

Functional lens library for composable, immutable data transformations. Lenses provide a way to focus on a specific part of a data structure and update it immutably.

## API

```ts
// Core lens operations
createLens<A, B>(
    get: (a: A) => B,
    set: (a: A, value: B) => A
): Lens<A, B>

composeLens<T1, T2, T3>(
    first: Lens<T1, T2>,
    second: Lens<T2, T3>
): Lens<T1, T3>

// Helper functions for creating lenses
prop<T, K extends keyof T>(key: K): Lens<T, T[K]>
index<T>(idx: number): Lens<T[], T | undefined>
path<T, K1, K2, K3>(...keys): Lens<T, nested>

// Operations on lenses
view<A, B>(lens: Lens<A, B>, obj: A): B
set<A, B>(lens: Lens<A, B>, obj: A, value: B): A
over<A, B>(lens: Lens<A, B>, obj: A, fn: (value: B) => B): A
```

## Usage

### Creating lenses with `prop`

```ts
interface Person {
    name: string
    age: number
}

const nameLens = prop<Person, 'name'>('name')
const person = { name: 'Alice', age: 30 }

// Get value
view(nameLens, person) // 'Alice'
nameLens.get(person) // 'Alice'

// Set value immutably
const updated = set(nameLens, person, 'Bob')
// { name: 'Bob', age: 30 }
// person is unchanged
```

### Nested paths with `path`

```ts
interface Person {
    name: string
    address: {
        street: string
        city: string
    }
}

const person = {
    name: 'Alice',
    address: { street: '123 Main St', city: 'New York' },
}

// Two-level path
const cityLens = path<Person, 'address', 'city'>('address', 'city')
view(cityLens, person) // 'New York'

// Set nested value immutably
const updated = set(cityLens, person, 'Boston')
// { name: 'Alice', address: { street: '123 Main St', city: 'Boston' } }
// Both person and person.address are unchanged (new objects created)
```

### Array lenses with `index`

```ts
const numbers = [1, 2, 3, 4, 5]
const secondLens = index<number>(1)

view(secondLens, numbers) // 2
set(secondLens, numbers, 10) // [1, 10, 3, 4, 5]
```

### Transforming values with `over`

```ts
const ageLens = prop<Person, 'age'>('age')
const person = { name: 'Alice', age: 30 }

// Increment age
const older = over(ageLens, person, (age) => age + 1)
// { name: 'Alice', age: 31 }

// Transform string
const nameLens = prop<Person, 'name'>('name')
const uppercase = over(nameLens, person, (name) => name.toUpperCase())
// { name: 'ALICE', age: 30 }
```

### Composing lenses

```ts
interface Person {
    profile: {
        settings: {
            theme: string
        }
    }
}

const profileLens = prop<Person, 'profile'>('profile')
const settingsLens = prop<Profile, 'settings'>('settings')
const themeLens = prop<Settings, 'theme'>('theme')

// Compose step by step
const userThemeLens = composeLens(
    composeLens(profileLens, settingsLens),
    themeLens
)

// Or use path helper for nested properties
const userThemeLens = path<Person, 'profile', 'settings', 'theme'>(
    'profile',
    'settings',
    'theme'
)
```

### React state updates

```ts
const [user, setUser] = useState({
    name: 'Alice',
    address: { city: 'New York', zip: '10001' },
})

const cityLens = path<User, 'address', 'city'>('address', 'city')

// Update nested state immutably
const updateCity = (newCity: string) => {
    setUser((prev) => set(cityLens, prev, newCity))
}

// Or transform existing value
const uppercaseCity = () => {
    setUser((prev) => over(cityLens, prev, (city) => city.toUpperCase()))
}
```

### Form field updates

```ts
interface FormData {
    user: {
        profile: {
            email: string
            phone: string
        }
    }
}

const emailLens = path<FormData, 'user', 'profile', 'email'>(
    'user',
    'profile',
    'email'
)

const [formData, setFormData] = useState<FormData>({
    user: { profile: { email: '', phone: '' } },
})

const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => set(emailLens, prev, e.target.value))
}
```

### Data normalization

```ts
interface Company {
    employees: Array<{ id: number; salary: number }>
}

const company = {
    employees: [
        { id: 1, salary: 50000 },
        { id: 2, salary: 60000 },
    ],
}

// Update a specific employee's salary
const firstEmployeeSalary = composeLens(
    prop<Company, 'employees'>('employees'),
    composeLens(index<Employee>(0), prop<Employee, 'salary'>('salary'))
)

const updated = set(firstEmployeeSalary, company, 55000)
// All objects along the path are new, deeply immutable
```

## Behavior and limitations

-   All lens operations create new objects/arrays - never mutate originals
-   `prop` and `path` use object spreading for immutability (`{ ...obj, key: value }`)
-   `index` uses array spreading for immutability (`[...arr.slice(0, i), value, ...arr.slice(i+1)]`)
-   `path` supports up to 3 levels with full type safety (overloaded signatures)
-   For deeper nesting, use `path(...keys)` with `any` type or compose manually
-   Lenses preserve type safety through generics
-   `index` returns `T | undefined` since arrays may be shorter than expected
-   Composed lenses maintain full type information through the chain
-   Setting through a lens creates new intermediate objects along the entire path
-   `over` allows functional transformations while maintaining immutability

## Common use cases

-   Updating deeply nested React state immutably
-   Form field updates without mutation
-   Data normalization and denormalization
-   Composable data transformations
-   Redux-style immutable state updates
-   Type-safe nested object updates
-   Functional programming patterns in TypeScript
-   Building reusable data accessors
-   Avoiding manual object spreading chains

## Type safety

-   `prop<T, K>()` enforces `K extends keyof T` - only valid keys allowed
-   `path()` uses overloaded signatures for 1-3 level paths with full inference
-   Return types are precisely inferred: `Lens<Person, string>` for name lens
-   Composed lenses maintain type chain: `Lens<A, B>` + `Lens<B, C>` = `Lens<A, C>`
-   TypeScript catches invalid key paths at compile time

## Tests

See `src/utility/__tests__/lens.test.ts` for 42 comprehensive tests covering:

-   `createLens` - custom getter/setter functions (3 tests)
-   `prop` - object property lenses with immutability (4 tests)
-   `index` - array element lenses with bounds checking (5 tests)
-   `path` - nested property paths up to 3 levels (4 tests)
-   `composeLens` - manual lens composition (2 tests)
-   `view` - reading values through lenses (3 tests)
-   `set` - setting values immutably through lenses (4 tests)
-   `over` - transforming values through lenses (5 tests)
-   Immutability guarantees - verifying no mutations (4 tests)
-   Practical use cases - React state, forms, data normalization (4 tests)
-   Edge cases - undefined, empty arrays, shared references (3 tests)

````

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
````

---

# Hook: useIdle

Detects when the user has been idle (no interaction) for a specified duration. Tracks mouse, keyboard, touch, and scroll events to determine activity.

## API

```ts
useIdle(timeout: number, options?: UseIdleOptions): boolean

interface UseIdleOptions {
    events?: string[]
    initialState?: boolean
}
```

## Parameters

-   `timeout` (number): Time in milliseconds of inactivity before considered idle
-   `options` (UseIdleOptions, optional):
    -   `events`: Array of event names to track (default: `['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'wheel']`)
    -   `initialState`: Initial idle state (default: `false`)

## Returns

-   `boolean`: `true` when user has been idle for the specified timeout, `false` when active

## Usage

```tsx
import { useIdle } from 'my-awesome-component-library'

// Basic idle detection (5 minutes)
function AutoSaveComponent() {
    const isIdle = useIdle(5 * 60 * 1000)

    useEffect(() => {
        if (isIdle) {
            console.log('User is idle, auto-saving...')
            saveDraft()
        }
    }, [isIdle])

    return <div>Editing... {isIdle && <span>Auto-saved</span>}</div>
}
```

```tsx
// Session timeout warning
function SessionManager() {
    const isIdle = useIdle(10 * 60 * 1000) // 10 minutes

    if (isIdle) {
        return (
            <Modal>
                <h2>Session Timeout Warning</h2>
                <p>
                    You've been inactive. Your session will expire in 5 minutes.
                </p>
                <button onClick={() => window.location.reload()}>
                    Stay Logged In
                </button>
            </Modal>
        )
    }

    return <App />
}
```

```tsx
// Auto-pause video when idle
function VideoPlayer({ src }) {
    const isIdle = useIdle(30 * 1000) // 30 seconds
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        if (isIdle && videoRef.current && !videoRef.current.paused) {
            videoRef.current.pause()
            toast.info('Video paused due to inactivity')
        }
    }, [isIdle])

    return <video ref={videoRef} src={src} controls />
}
```

```tsx
// Dim screen when idle
function IdleScreenDimmer() {
    const isIdle = useIdle(15 * 1000) // 15 seconds

    return (
        <div className={isIdle ? 'dimmed' : ''}>
            <AppContent />
            {isIdle && (
                <div className="idle-overlay">Move mouse to continue</div>
            )}
        </div>
    )
}
```

```tsx
// Custom events (track only mouse movement)
function MouseIdleTracker() {
    const isIdle = useIdle(5000, {
        events: ['mousemove'],
    })

    return <div>Mouse idle: {isIdle ? 'Yes' : 'No'}</div>
}
```

```tsx
// Start as idle
function IdleIndicator() {
    const isIdle = useIdle(3000, {
        initialState: true, // Starts as idle until first interaction
    })

    return (
        <div className={isIdle ? 'status-idle' : 'status-active'}>
            {isIdle ? '��� Idle' : '✅ Active'}
        </div>
    )
}
```

```tsx
// Analytics tracking
function IdleAnalytics() {
    const isIdle = useIdle(60 * 1000) // 1 minute

    useEffect(() => {
        if (isIdle) {
            analytics.track('user_idle', {
                timestamp: Date.now(),
                page: window.location.pathname,
            })
        } else {
            analytics.track('user_active')
        }
    }, [isIdle])

    return null
}
```

```tsx
// Complex idle workflow
function IdleWorkflow() {
    const isIdle = useIdle(2 * 60 * 1000) // 2 minutes
    const [showWarning, setShowWarning] = useState(false)

    useEffect(() => {
        if (isIdle) {
            setShowWarning(true)
            const timer = setTimeout(() => {
                logout()
            }, 60 * 1000) // Logout after 1 more minute

            return () => clearTimeout(timer)
        } else {
            setShowWarning(false)
        }
    }, [isIdle])

    return (
        <>
            {showWarning && (
                <Banner>
                    You'll be logged out in 1 minute due to inactivity
                </Banner>
            )}
            <AppContent />
        </>
    )
}
```

## How it works

-   Sets up event listeners on the `window` object for the specified events
-   Starts a timeout when the component mounts
-   Resets the timeout whenever any tracked event fires
-   Sets idle state to `true` when timeout expires without activity
-   Sets idle state to `false` when activity is detected after becoming idle
-   Cleans up event listeners and timeout on unmount

## When to use

-   Session timeout warnings and auto-logout
-   Auto-save drafts when user stops typing/interacting
-   Auto-pause media content
-   Analytics and user engagement tracking
-   Screen dimming or screensaver activation
-   Hiding UI elements during inactivity
-   Reducing resource consumption during idle periods
-   Warning before background task execution
-   Gaming AFK (away from keyboard) detection
-   Chat/messaging away status

## Notes

-   Works in browser environments only (SSR-safe with `typeof window` check)
-   Uses capture phase for event listeners to catch all activity
-   All event listeners are passive and don't affect page performance
-   Timeout resets on any activity, not just significant interactions
-   Custom events must be valid DOM event names
-   Consider longer timeouts for mobile devices (touch-based interaction)
-   Be mindful of accessibility - avoid auto-logout with short timeouts
-   Combines well with `useLocalStorage` to persist idle state across sessions

## Browser support

All modern browsers (uses `setTimeout`, `addEventListener`, and standard DOM events)

## Tests

See `src/utility/hooks/__tests__/useIdle.test.tsx` for comprehensive tests covering initialization, timeout behavior, event resets, custom events, rapid activity, dynamic timeouts, cleanup, and edge cases.

---

# Hook: useColorScheme

Detects and tracks the user's color scheme preference (light or dark mode). Automatically listens to system/browser preference changes in real-time.

## API

```ts
useColorScheme(): ColorScheme

type ColorScheme = 'light' | 'dark'
```

## Returns

-   `ColorScheme`: The current color scheme - either `'light'` or `'dark'`

## Usage

```tsx
import { useColorScheme } from 'my-awesome-component-library'

// Basic theme detection
function ThemeDisplay() {
    const colorScheme = useColorScheme()

    return (
        <div className={colorScheme === 'dark' ? 'dark-theme' : 'light-theme'}>
            Current theme: {colorScheme}
        </div>
    )
}
```

```tsx
// Apply theme class to entire app
function App() {
    const colorScheme = useColorScheme()

    useEffect(() => {
        document.body.className = colorScheme
    }, [colorScheme])

    return <AppContent />
}
```

```tsx
// Conditional rendering based on theme
function ThemedIcon() {
    const colorScheme = useColorScheme()

    return colorScheme === 'dark' ? <MoonIcon /> : <SunIcon />
}
```

```tsx
// Load different stylesheets
function ThemeStylesheet() {
    const colorScheme = useColorScheme()

    return <link rel="stylesheet" href={`/styles/${colorScheme}.css`} />
}
```

```tsx
// Sync with React state
function ThemeManager() {
    const systemScheme = useColorScheme()
    const [theme, setTheme] = useState(systemScheme)

    useEffect(() => {
        // Respect user override or fall back to system
        const savedTheme = localStorage.getItem('theme')
        if (!savedTheme) {
            setTheme(systemScheme)
        }
    }, [systemScheme])

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            <App />
        </ThemeContext.Provider>
    )
}
```

```tsx
// Show notification when theme changes
function ThemeChangeNotifier() {
    const colorScheme = useColorScheme()
    const prevScheme = usePrevious(colorScheme)

    useEffect(() => {
        if (prevScheme && prevScheme !== colorScheme) {
            toast.info(`Switched to ${colorScheme} mode`)
        }
    }, [colorScheme, prevScheme])

    return null
}
```

```tsx
// Adjust component styling
function Card({ children }) {
    const colorScheme = useColorScheme()

    const styles = {
        backgroundColor: colorScheme === 'dark' ? '#333' : '#fff',
        color: colorScheme === 'dark' ? '#fff' : '#000',
        border: `1px solid ${colorScheme === 'dark' ? '#555' : '#ddd'}`,
    }

    return <div style={styles}>{children}</div>
}
```

```tsx
// Preload images based on theme
function ThemedImage({ lightSrc, darkSrc, alt }) {
    const colorScheme = useColorScheme()

    return <img src={colorScheme === 'dark' ? darkSrc : lightSrc} alt={alt} />
}
```

```tsx
// Analytics tracking
function ThemeAnalytics() {
    const colorScheme = useColorScheme()

    useEffect(() => {
        analytics.track('color_scheme_detected', {
            scheme: colorScheme,
            timestamp: Date.now(),
        })
    }, [colorScheme])

    return null
}
```

```tsx
// Complex theme system with localStorage override
function AdvancedThemeProvider() {
    const systemScheme = useColorScheme()
    const [userPreference, setUserPreference] = useLocalStorage<
        'light' | 'dark' | 'auto'
    >('theme', 'auto')

    const effectiveTheme =
        userPreference === 'auto' ? systemScheme : userPreference

    return (
        <ThemeContext.Provider
            value={{
                theme: effectiveTheme,
                userPreference,
                setUserPreference,
                systemScheme,
            }}
        >
            <div data-theme={effectiveTheme}>
                <App />
            </div>
        </ThemeContext.Provider>
    )
}
```

## How it works

-   Queries `window.matchMedia('(prefers-color-scheme: dark)')` to detect initial preference
-   Returns `'dark'` if the media query matches, otherwise `'light'`
-   Sets up an event listener for changes to the color scheme preference
-   Automatically updates when the user changes their system/browser theme
-   Supports both modern (`addEventListener`) and legacy (`addListener`) APIs for maximum compatibility
-   Cleans up event listener on unmount

## When to use

-   Respecting user's system theme preference
-   Auto-switching between light and dark themes
-   Loading theme-appropriate resources (images, stylesheets)
-   Providing seamless theme experience without manual toggle
-   Analytics on user theme preferences
-   Conditional rendering based on theme
-   Initial theme detection for theme systems
-   Combining with manual theme toggles (system as fallback)

## Notes

-   Works in browser environments only (SSR-safe with `typeof window` check)
-   Returns `'light'` as default in SSR or when `matchMedia` is not supported
-   Detects system-level preference (OS setting) not just browser theme
-   Changes are detected automatically - no polling required
-   Works alongside CSS `prefers-color-scheme` media queries
-   Consider combining with `useLocalStorage` for user overrides
-   Initial value is available immediately (no flash of wrong theme)
-   Does not automatically apply themes - returns preference only
-   Use CSS variables or class names to apply actual theme styling
-   On iOS/macOS, detects Light/Dark appearance setting
-   On Windows 10/11, detects Light/Dark mode in Settings

## Browser support

All modern browsers supporting `prefers-color-scheme` media query:

-   Chrome 76+
-   Firefox 67+
-   Safari 12.1+
-   Edge 79+
-   Opera 63+

Gracefully falls back to `'light'` in older browsers.

## Tests

See `src/utility/hooks/__tests__/useColorScheme.test.tsx` for comprehensive tests covering default detection, dark mode detection, preference changes, rapid changes, cleanup, legacy browser support, SSR handling, and re-render stability.

---

# Hook: useWebSocket

Manages WebSocket connections with automatic reconnection, message handling, and connection state tracking.

## API

```ts
useWebSocket(url: string | null, options?: UseWebSocketOptions): UseWebSocketReturn

interface UseWebSocketOptions {
    protocols?: string | string[]
    autoConnect?: boolean // default: true
    reconnect?: boolean // default: false
    reconnectAttempts?: number // default: 0 (infinite)
    reconnectInterval?: number // default: 3000ms
    onOpen?: (event: Event) => void
    onClose?: (event: CloseEvent) => void
    onError?: (event: Event) => void
    onMessage?: (event: MessageEvent) => void
}

interface UseWebSocketReturn {
    lastMessage: MessageEvent | null
    sendMessage: (message: string | ArrayBuffer | Blob) => void
    sendJsonMessage: (message: any) => void
    readyState: 'CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED'
    connect: () => void
    disconnect: () => void
    getWebSocket: () => WebSocket | null
}
```

## Parameters

-   `url` (string | null): WebSocket URL to connect to (ws:// or wss://)
-   `options` (UseWebSocketOptions, optional):
    -   `protocols`: WebSocket sub-protocols
    -   `autoConnect`: Automatically connect on mount (default: true)
    -   `reconnect`: Enable automatic reconnection (default: false)
    -   `reconnectAttempts`: Max reconnection attempts, 0 for infinite (default: 0)
    -   `reconnectInterval`: Delay between reconnection attempts in ms (default: 3000)
    -   `onOpen`: Callback when connection opens
    -   `onClose`: Callback when connection closes
    -   `onError`: Callback when error occurs
    -   `onMessage`: Callback when message is received

## Returns

Object with WebSocket state and control methods

## Usage

```tsx
import { useWebSocket } from 'my-awesome-component-library'

// Basic WebSocket connection
function ChatComponent() {
    const { lastMessage, sendMessage, readyState } = useWebSocket(
        'ws://localhost:8080/chat'
    )

    const handleSend = () => {
        sendMessage('Hello, server!')
    }

    return (
        <div>
            <div>Status: {readyState}</div>
            <div>Last message: {lastMessage?.data}</div>
            <button onClick={handleSend} disabled={readyState !== 'OPEN'}>
                Send Message
            </button>
        </div>
    )
}
```

```tsx
// With JSON messages
function RealtimeData() {
    const { lastMessage, sendJsonMessage, readyState } = useWebSocket(
        'wss://api.example.com/stream'
    )

    const [data, setData] = useState([])

    useEffect(() => {
        if (lastMessage) {
            const parsed = JSON.parse(lastMessage.data)
            setData((prev) => [...prev, parsed])
        }
    }, [lastMessage])

    const requestData = () => {
        sendJsonMessage({ action: 'getData', filter: 'active' })
    }

    return (
        <div>
            <button onClick={requestData} disabled={readyState !== 'OPEN'}>
                Request Data
            </button>
            <ul>
                {data.map((item, i) => (
                    <li key={i}>{JSON.stringify(item)}</li>
                ))}
            </ul>
        </div>
    )
}
```

```tsx
// With automatic reconnection
function ResilientConnection() {
    const { lastMessage, readyState } = useWebSocket(
        'wss://api.example.com/updates',
        {
            reconnect: true,
            reconnectAttempts: 5,
            reconnectInterval: 3000,
            onOpen: () => console.log('Connected to WebSocket'),
            onClose: () => console.log('Disconnected from WebSocket'),
            onError: (error) => console.error('WebSocket error:', error),
        }
    )

    return (
        <div>
            <StatusIndicator status={readyState} />
            {lastMessage && <Message data={lastMessage.data} />}
        </div>
    )
}
```

```tsx
// Manual connection control
function ManualConnection() {
    const { connect, disconnect, readyState, sendMessage } = useWebSocket(
        'ws://localhost:8080',
        { autoConnect: false }
    )

    return (
        <div>
            {readyState === 'CLOSED' && (
                <button onClick={connect}>Connect</button>
            )}
            {readyState === 'OPEN' && (
                <>
                    <button onClick={() => sendMessage('ping')}>Ping</button>
                    <button onClick={disconnect}>Disconnect</button>
                </>
            )}
        </div>
    )
}
```

```tsx
// Real-time notifications
function NotificationCenter() {
    const [notifications, setNotifications] = useState([])

    const { lastMessage } = useWebSocket(
        'wss://api.example.com/notifications',
        {
            onMessage: (event) => {
                const notification = JSON.parse(event.data)
                toast.info(notification.message)
            },
        }
    )

    useEffect(() => {
        if (lastMessage) {
            const notification = JSON.parse(lastMessage.data)
            setNotifications((prev) => [notification, ...prev].slice(0, 10))
        }
    }, [lastMessage])

    return (
        <div>
            <h3>Recent Notifications</h3>
            {notifications.map((n, i) => (
                <Notification key={i} {...n} />
            ))}
        </div>
    )
}
```

```tsx
// Live chat with typing indicator
function LiveChat() {
    const { sendJsonMessage, lastMessage, readyState } = useWebSocket(
        'wss://chat.example.com',
        {
            reconnect: true,
            onOpen: () => {
                sendJsonMessage({ type: 'join', user: userId })
            },
        }
    )

    const [messages, setMessages] = useState([])
    const [typingUsers, setTypingUsers] = useState([])

    useEffect(() => {
        if (lastMessage) {
            const msg = JSON.parse(lastMessage.data)
            if (msg.type === 'message') {
                setMessages((prev) => [...prev, msg])
            } else if (msg.type === 'typing') {
                setTypingUsers(msg.users)
            }
        }
    }, [lastMessage])

    const handleSend = (text) => {
        sendJsonMessage({ type: 'message', text, user: userId })
    }

    const handleTyping = () => {
        sendJsonMessage({ type: 'typing', user: userId })
    }

    return (
        <ChatUI
            messages={messages}
            typingUsers={typingUsers}
            onSend={handleSend}
            onTyping={handleTyping}
            connected={readyState === 'OPEN'}
        />
    )
}
```

```tsx
// Stock price ticker
function StockTicker({ symbols }) {
    const [prices, setPrices] = useState({})

    const { sendJsonMessage, lastMessage, readyState } = useWebSocket(
        'wss://market-data.example.com',
        {
            reconnect: true,
            reconnectAttempts: 0, // infinite
            onOpen: () => {
                sendJsonMessage({ action: 'subscribe', symbols })
            },
        }
    )

    useEffect(() => {
        if (lastMessage) {
            const update = JSON.parse(lastMessage.data)
            setPrices((prev) => ({ ...prev, [update.symbol]: update.price }))
        }
    }, [lastMessage])

    return (
        <div>
            <div>Connection: {readyState}</div>
            {symbols.map((symbol) => (
                <div key={symbol}>
                    {symbol}: ${prices[symbol] || 'Loading...'}
                </div>
            ))}
        </div>
    )
}
```

```tsx
// Game server connection
function GameConnection() {
    const [gameState, setGameState] = useState(null)

    const { sendJsonMessage, lastMessage, readyState, getWebSocket } =
        useWebSocket('wss://game.example.com/room/123', {
            reconnect: true,
            reconnectInterval: 5000,
            onOpen: () => {
                sendJsonMessage({ type: 'join', player: playerId })
            },
            onClose: (event) => {
                if (!event.wasClean) {
                    toast.error('Connection lost. Reconnecting...')
                }
            },
        })

    useEffect(() => {
        if (lastMessage) {
            const data = JSON.parse(lastMessage.data)
            if (data.type === 'state') {
                setGameState(data.state)
            }
        }
    }, [lastMessage])

    const sendAction = (action) => {
        sendJsonMessage({ type: 'action', action, player: playerId })
    }

    return (
        <GameUI
            state={gameState}
            onAction={sendAction}
            connected={readyState === 'OPEN'}
        />
    )
}
```

```tsx
// IoT device monitoring
function DeviceMonitor({ deviceId }) {
    const [metrics, setMetrics] = useState([])

    const url = deviceId ? `wss://iot.example.com/device/${deviceId}` : null

    const { lastMessage, readyState } = useWebSocket(url, {
        reconnect: true,
        onMessage: (event) => {
            const metric = JSON.parse(event.data)
            setMetrics((prev) => [...prev.slice(-99), metric]) // Keep last 100
        },
    })

    return (
        <div>
            <h3>Device {deviceId}</h3>
            <StatusBadge status={readyState} />
            <MetricsChart data={metrics} />
        </div>
    )
}
```

```tsx
// Collaborative editing
function CollaborativeEditor() {
    const [content, setContent] = useState('')
    const [cursors, setCursors] = useState({})
    const lastChangeRef = useRef(null)

    const { sendJsonMessage, lastMessage } = useWebSocket(
        'wss://collab.example.com/doc/abc123',
        {
            reconnect: true,
            onOpen: () => {
                sendJsonMessage({ type: 'join', user: userId })
            },
        }
    )

    useEffect(() => {
        if (lastMessage) {
            const msg = JSON.parse(lastMessage.data)
            if (msg.type === 'edit' && msg.user !== userId) {
                setContent(msg.content)
            } else if (msg.type === 'cursor') {
                setCursors((prev) => ({ ...prev, [msg.user]: msg.position }))
            }
        }
    }, [lastMessage])

    const handleChange = (newContent) => {
        if (newContent !== lastChangeRef.current) {
            setContent(newContent)
            sendJsonMessage({ type: 'edit', content: newContent, user: userId })
            lastChangeRef.current = newContent
        }
    }

    return (
        <Editor content={content} onChange={handleChange} cursors={cursors} />
    )
}
```

## How it works

-   Creates WebSocket connection using native WebSocket API
-   Tracks connection state (CONNECTING, OPEN, CLOSING, CLOSED)
-   Stores the most recent message received
-   Provides methods to send string or JSON messages
-   Supports automatic reconnection with configurable attempts and intervals
-   Allows manual connection control (connect/disconnect)
-   Cleans up connection and timers on unmount
-   Handles URL changes by reconnecting to new endpoint

## When to use

-   Real-time chat applications
-   Live data streams (stock prices, sports scores, etc.)
-   Notifications and alerts
-   Collaborative editing
-   Multiplayer games
-   IoT device monitoring
-   Live dashboards and metrics
-   Server-sent updates
-   Bidirectional client-server communication
-   Push notifications

## Notes

-   URL can be null to defer connection
-   Set `autoConnect: false` for manual connection control
-   Reconnection is disabled by default - enable with `reconnect: true`
-   `reconnectAttempts: 0` means infinite reconnection attempts
-   Messages are not queued - sending while disconnected logs a warning
-   `lastMessage` updates on every message, store in state if history is needed
-   Use `sendJsonMessage` for automatic JSON serialization
-   Access raw WebSocket with `getWebSocket()` for advanced use cases
-   Reconnection resets after successful connection
-   Manual `disconnect()` disables automatic reconnection
-   Supports both `ws://` (insecure) and `wss://` (secure) protocols
-   No automatic ping/pong - implement at application level if needed
-   Consider message rate limiting to avoid overwhelming the connection

## Browser support

All modern browsers supporting WebSocket API:

-   Chrome 16+
-   Firefox 11+
-   Safari 7+
-   Edge (all versions)
-   Opera 12.1+

## Tests

See `src/utility/hooks/__tests__/useWebSocket.test.tsx` for comprehensive tests covering connection lifecycle, message handling, automatic reconnection, manual control, error handling, cleanup, and URL changes.

---

# Hook: usePromise

Manages promise lifecycle with loading, error, and result states. Perfect for handling async operations with automatic state management and race condition protection.

## API

```ts
usePromise<T, Args>(
    promiseFunction: (...args: Args) => Promise<T>,
    options?: UsePromiseOptions<Args>
): UsePromiseResult<T, Args>

interface UsePromiseOptions<Args> {
    immediate?: boolean // default: false
    initialArgs?: Args
}

interface UsePromiseResult<T, Args> {
    data: T | null
    error: Error | null
    status: 'idle' | 'pending' | 'resolved' | 'rejected'
    isLoading: boolean
    isIdle: boolean
    isResolved: boolean
    isRejected: boolean
    execute: (...args: Args) => Promise<T>
    reset: () => void
}
```

## Parameters

-   `promiseFunction` ((...args: Args) => Promise<T>): Function that returns a promise
-   `options` (UsePromiseOptions, optional):
    -   `immediate`: Execute promise on mount (default: false)
    -   `initialArgs`: Arguments for immediate execution

## Returns

Object with promise state and control methods

## Usage

```tsx
import { usePromise } from 'my-awesome-component-library'

// Basic data fetching
function UserProfile({ userId }) {
    const { data, isLoading, error, execute } = usePromise((id: string) =>
        fetch(`/api/users/${id}`).then((r) => r.json())
    )

    useEffect(() => {
        execute(userId)
    }, [userId])

    if (isLoading) return <Spinner />
    if (error) return <Error message={error.message} />
    if (data) return <User {...data} />
    return null
}
```

```tsx
// Manual execution with button
function SearchUsers() {
    const [query, setQuery] = useState('')
    const { data, isLoading, execute } = usePromise((searchTerm: string) =>
        fetch(`/api/search?q=${searchTerm}`).then((r) => r.json())
    )

    const handleSearch = () => {
        execute(query)
    }

    return (
        <div>
            <input value={query} onChange={(e) => setQuery(e.target.value)} />
            <button onClick={handleSearch} disabled={isLoading}>
                {isLoading ? 'Searching...' : 'Search'}
            </button>
            {data && <Results items={data} />}
        </div>
    )
}
```

```tsx
// Immediate execution on mount
function Dashboard() {
    const { data, isLoading, error } = usePromise(
        () => fetch('/api/dashboard').then((r) => r.json()),
        { immediate: true }
    )

    if (isLoading) return <Skeleton />
    if (error) return <ErrorBoundary error={error} />
    return <DashboardView data={data} />
}
```

```tsx
// With initial arguments
function ProductDetails({ productId }) {
    const { data, isLoading, reset } = usePromise(
        (id: string) => fetch(`/api/products/${id}`).then((r) => r.json()),
        { immediate: true, initialArgs: [productId] }
    )

    useEffect(() => {
        reset()
        // Re-fetch when productId changes
    }, [productId])

    return isLoading ? <Loader /> : <Product data={data} />
}
```

```tsx
// Form submission with status feedback
function CreatePost() {
    const { execute, isLoading, isResolved, error, reset } = usePromise(
        (postData: PostData) =>
            fetch('/api/posts', {
                method: 'POST',
                body: JSON.stringify(postData),
            }).then((r) => r.json())
    )

    const handleSubmit = async (data: PostData) => {
        try {
            await execute(data)
            toast.success('Post created!')
        } catch (err) {
            toast.error('Failed to create post')
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <PostForm />
            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Post'}
            </button>
            {isResolved && <Redirect to="/posts" />}
            {error && <FormError message={error.message} />}
        </form>
    )
}
```

```tsx
// Multi-step wizard with promise states
function Wizard() {
    const [step, setStep] = useState(1)

    const step1Promise = usePromise((data) => api.validateStep1(data))

    const step2Promise = usePromise((data) => api.validateStep2(data))

    const submitPromise = usePromise((allData) => api.submitWizard(allData))

    const handleStep1Next = async (data) => {
        try {
            await step1Promise.execute(data)
            setStep(2)
        } catch (err) {
            // Handle validation error
        }
    }

    return (
        <div>
            {step === 1 && (
                <Step1
                    onNext={handleStep1Next}
                    isLoading={step1Promise.isLoading}
                    error={step1Promise.error}
                />
            )}
            {step === 2 && (
                <Step2
                    onNext={handleStep2Next}
                    isLoading={step2Promise.isLoading}
                />
            )}
            {step === 3 && (
                <Review
                    onSubmit={submitPromise.execute}
                    isSubmitting={submitPromise.isLoading}
                />
            )}
        </div>
    )
}
```

```tsx
// File upload with progress
function FileUploader() {
    const { execute, isLoading, isResolved, error, data, reset } = usePromise(
        async (file: File) => {
            const formData = new FormData()
            formData.append('file', file)

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            return response.json()
        }
    )

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            await execute(file)
        }
    }

    return (
        <div>
            <input type="file" onChange={handleFile} disabled={isLoading} />
            {isLoading && <ProgressBar indeterminate />}
            {isResolved && <Success url={data.url} />}
            {error && <ErrorMessage error={error} onRetry={reset} />}
        </div>
    )
}
```

```tsx
// Polling with manual control
function LiveData() {
    const { data, execute, isLoading } = usePromise(() =>
        fetch('/api/live-data').then((r) => r.json())
    )

    useEffect(() => {
        execute() // Initial fetch

        const interval = setInterval(() => {
            execute() // Poll every 5 seconds
        }, 5000)

        return () => clearInterval(interval)
    }, [execute])

    return (
        <div>
            {isLoading && !data && <Skeleton />}
            {data && <DataDisplay data={data} refreshing={isLoading} />}
        </div>
    )
}
```

```tsx
// Dependent promises (sequential)
function OrderCheckout() {
    const validateCart = usePromise((cartId) => api.validateCart(cartId))

    const processPayment = usePromise((paymentData) =>
        api.processPayment(paymentData)
    )

    const createOrder = usePromise((orderData) => api.createOrder(orderData))

    const handleCheckout = async (cartId, paymentData) => {
        try {
            // Step 1: Validate cart
            await validateCart.execute(cartId)

            // Step 2: Process payment
            const payment = await processPayment.execute(paymentData)

            // Step 3: Create order
            const order = await createOrder.execute({
                cartId,
                paymentId: payment.id,
            })

            router.push(`/orders/${order.id}`)
        } catch (err) {
            toast.error(err.message)
        }
    }

    const isProcessing =
        validateCart.isLoading ||
        processPayment.isLoading ||
        createOrder.isLoading

    return (
        <CheckoutForm onSubmit={handleCheckout} isProcessing={isProcessing} />
    )
}
```

```tsx
// Optimistic updates with rollback
function TodoList() {
    const [todos, setTodos] = useState([])

    const deleteTodo = usePromise(async (id: string) => {
        const response = await fetch(`/api/todos/${id}`, {
            method: 'DELETE',
        })
        if (!response.ok) throw new Error('Delete failed')
        return id
    })

    const handleDelete = async (id: string) => {
        // Optimistic update
        const previousTodos = todos
        setTodos(todos.filter((t) => t.id !== id))

        try {
            await deleteTodo.execute(id)
            toast.success('Todo deleted')
        } catch (err) {
            // Rollback on error
            setTodos(previousTodos)
            toast.error('Failed to delete')
        }
    }

    return (
        <ul>
            {todos.map((todo) => (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    onDelete={handleDelete}
                    isDeleting={deleteTodo.isLoading}
                />
            ))}
        </ul>
    )
}
```

```tsx
// Debounced search with race condition protection
function SmartSearch() {
    const [query, setQuery] = useState('')
    const debouncedQuery = useDebounce(query, 500)

    const { data, isLoading, execute } = usePromise((searchTerm: string) =>
        fetch(`/api/search?q=${searchTerm}`).then((r) => r.json())
    )

    useEffect(() => {
        if (debouncedQuery) {
            execute(debouncedQuery)
        }
    }, [debouncedQuery])

    return (
        <div>
            <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
            />
            {isLoading && <Spinner />}
            {data && <SearchResults results={data} />}
        </div>
    )
}
```

## How it works

-   Wraps promise function with state management
-   Tracks four states: idle, pending, resolved, rejected
-   Provides boolean helpers (isLoading, isIdle, isResolved, isRejected)
-   Prevents state updates on unmounted components
-   Handles race conditions - only latest promise updates state
-   Converts non-Error rejections to Error objects
-   Allows manual execution with `execute()`
-   Provides `reset()` to return to idle state
-   Returns promise from `execute()` for chaining
-   Supports immediate execution on mount

## When to use

-   Data fetching from APIs
-   Form submissions
-   File uploads
-   Authentication operations
-   Multi-step workflows
-   Any async operation needing state tracking
-   Replacing useState + useEffect patterns for promises
-   When you need loading/error states
-   Operations with user-triggered execution
-   Debounced or throttled async operations

## Notes

-   Does NOT execute automatically unless `immediate: true`
-   Race condition safe - only latest promise updates state
-   Component unmount protection prevents memory leaks
-   `execute()` returns the promise for await/catch
-   Errors are rethrown from `execute()` for manual handling
-   `reset()` clears data/error and returns to idle
-   Non-Error rejections are converted to Error objects
-   Promise function changes trigger new `execute` callback
-   State updates are synchronous after promise resolves
-   Use with `useEffect` for automatic execution on deps
-   Combine with `useDebounce` for debounced searches
-   Works great with optimistic updates pattern

## Browser support

All modern browsers (uses standard Promise API)

## Tests

See `src/utility/hooks/__tests__/usePromise.test.tsx` for comprehensive tests covering execution, resolution, rejection, arguments, immediate mode, initial args, reset, multiple executions, error handling, race conditions, unmount protection, error conversion, return values, function changes, async functions, complex data, and stable references.

---

# Hook: useList

Manages array state with built-in helper methods for common operations. Eliminates boilerplate for array manipulation and provides a clean, chainable API.

## API

```ts
useList<T>(initialValue?: T[]): [T[], UseListActions<T>]

interface UseListActions<T> {
    set: (newList: T[]) => void
    push: (...items: T[]) => void
    pop: () => T | undefined
    unshift: (...items: T[]) => void
    shift: () => T | undefined
    removeAt: (index: number) => void
    insertAt: (index: number, item: T) => void
    updateAt: (index: number, item: T) => void
    clear: () => void
    filter: (predicate: (item: T, index: number) => boolean) => void
    sort: (compareFn?: (a: T, b: T) => number) => void
    reverse: () => void
    remove: (item: T) => void
    removeAll: (item: T) => void
    map: (mapper: (item: T, index: number) => T) => void
    concat: (...arrays: T[][]) => void
    reset: () => void
}
```

## Parameters

-   `initialValue` (T[], optional): Initial array value (default: [])

## Returns

Tuple of [list, actions]:

-   `list` (T[]): Current array state
-   `actions` (UseListActions): Object with helper methods

## Usage

```tsx
import { useList } from 'my-awesome-component-library'

// Basic todo list
function TodoList() {
    const [todos, { push, removeAt, updateAt, clear }] = useList([
        { id: 1, text: 'Learn React', done: false },
        { id: 2, text: 'Build app', done: false },
    ])

    const addTodo = (text: string) => {
        push({ id: Date.now(), text, done: false })
    }

    const toggleTodo = (index: number) => {
        const todo = todos[index]
        updateAt(index, { ...todo, done: !todo.done })
    }

    return (
        <div>
            <button onClick={() => addTodo('New task')}>Add</button>
            <button onClick={clear}>Clear All</button>
            {todos.map((todo, i) => (
                <div key={todo.id}>
                    <input
                        type="checkbox"
                        checked={todo.done}
                        onChange={() => toggleTodo(i)}
                    />
                    <span>{todo.text}</span>
                    <button onClick={() => removeAt(i)}>×</button>
                </div>
            ))}
        </div>
    )
}
```

```tsx
// Shopping cart
function ShoppingCart() {
    const [cart, { push, removeAt, updateAt, clear }] = useList([])

    const addToCart = (product: Product) => {
        const existing = cart.findIndex((item) => item.id === product.id)
        if (existing >= 0) {
            const item = cart[existing]
            updateAt(existing, { ...item, quantity: item.quantity + 1 })
        } else {
            push({ ...product, quantity: 1 })
        }
    }

    const updateQuantity = (index: number, quantity: number) => {
        if (quantity <= 0) {
            removeAt(index)
        } else {
            updateAt(index, { ...cart[index], quantity })
        }
    }

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    )

    return (
        <div>
            <h2>Cart ({cart.length})</h2>
            {cart.map((item, i) => (
                <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={(qty) => updateQuantity(i, qty)}
                    onRemove={() => removeAt(i)}
                />
            ))}
            <div>Total: ${total.toFixed(2)}</div>
            <button onClick={clear}>Clear Cart</button>
        </div>
    )
}
```

```tsx
// Tag input with chips
function TagInput() {
    const [tags, { push, removeAt, remove }] = useList(['react', 'typescript'])
    const [input, setInput] = useState('')

    const addTag = () => {
        if (input.trim() && !tags.includes(input.trim())) {
            push(input.trim())
            setInput('')
        }
    }

    return (
        <div>
            <div className="tags">
                {tags.map((tag, i) => (
                    <Chip key={i} label={tag} onDelete={() => removeAt(i)} />
                ))}
            </div>
            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
                placeholder="Add tag..."
            />
        </div>
    )
}
```

```tsx
// Drag and drop reorder
function DraggableList() {
    const [items, { set, updateAt }] = useList([
        { id: 1, text: 'Item 1' },
        { id: 2, text: 'Item 2' },
        { id: 3, text: 'Item 3' },
    ])

    const moveItem = (fromIndex: number, toIndex: number) => {
        const newItems = [...items]
        const [removed] = newItems.splice(fromIndex, 1)
        newItems.splice(toIndex, 0, removed)
        set(newItems)
    }

    return (
        <div>
            {items.map((item, i) => (
                <DraggableItem
                    key={item.id}
                    item={item}
                    index={i}
                    onMove={moveItem}
                />
            ))}
        </div>
    )
}
```

```tsx
// Undo/redo stack
function UndoRedoEditor() {
    const [history, historyActions] = useList([''])
    const [currentIndex, setCurrentIndex] = useState(0)

    const current = history[currentIndex]
    const canUndo = currentIndex > 0
    const canRedo = currentIndex < history.length - 1

    const setText = (text: string) => {
        // Remove future history
        historyActions.set(history.slice(0, currentIndex + 1))
        historyActions.push(text)
        setCurrentIndex(currentIndex + 1)
    }

    const undo = () => {
        if (canUndo) setCurrentIndex(currentIndex - 1)
    }

    const redo = () => {
        if (canRedo) setCurrentIndex(currentIndex + 1)
    }

    return (
        <div>
            <button onClick={undo} disabled={!canUndo}>
                Undo
            </button>
            <button onClick={redo} disabled={!canRedo}>
                Redo
            </button>
            <textarea
                value={current}
                onChange={(e) => setText(e.target.value)}
            />
        </div>
    )
}
```

```tsx
// Bulk operations
function BulkActions() {
    const [items, { filter, map, sort, reverse, clear }] = useList([
        { id: 1, name: 'Alice', age: 25, active: true },
        { id: 2, name: 'Bob', age: 30, active: false },
        { id: 3, name: 'Charlie', age: 20, active: true },
    ])

    const removeInactive = () => {
        filter((item) => item.active)
    }

    const incrementAges = () => {
        map((item) => ({ ...item, age: item.age + 1 }))
    }

    const sortByAge = () => {
        sort((a, b) => a.age - b.age)
    }

    const sortByName = () => {
        sort((a, b) => a.name.localeCompare(b.name))
    }

    return (
        <div>
            <button onClick={sortByAge}>Sort by Age</button>
            <button onClick={sortByName}>Sort by Name</button>
            <button onClick={reverse}>Reverse</button>
            <button onClick={incrementAges}>+1 Year All</button>
            <button onClick={removeInactive}>Remove Inactive</button>
            <button onClick={clear}>Clear All</button>
            <UserList items={items} />
        </div>
    )
}
```

```tsx
// Queue implementation
function MessageQueue() {
    const [queue, { push, shift }] = useList([])

    const enqueue = (message: string) => {
        push({ id: Date.now(), text: message })
    }

    const dequeue = () => {
        const item = shift()
        if (item) {
            console.log('Processing:', item.text)
        }
    }

    return (
        <div>
            <input
                placeholder="Message..."
                onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        enqueue(e.currentTarget.value)
                        e.currentTarget.value = ''
                    }
                }}
            />
            <button onClick={dequeue} disabled={queue.length === 0}>
                Process Next
            </button>
            <div>Queue size: {queue.length}</div>
            {queue.map((msg, i) => (
                <div key={msg.id}>
                    {i + 1}. {msg.text}
                </div>
            ))}
        </div>
    )
}
```

```tsx
// Stack implementation
function NavigationStack() {
    const [stack, { push, pop }] = useList(['/home'])

    const navigate = (path: string) => {
        push(path)
    }

    const goBack = () => {
        if (stack.length > 1) {
            pop()
        }
    }

    const current = stack[stack.length - 1]

    return (
        <div>
            <button onClick={goBack} disabled={stack.length === 1}>
                ← Back
            </button>
            <div>Current: {current}</div>
            <div>History: {stack.join(' → ')}</div>
            <nav>
                <button onClick={() => navigate('/profile')}>Profile</button>
                <button onClick={() => navigate('/settings')}>Settings</button>
            </nav>
        </div>
    )
}
```

```tsx
// Multi-select with bulk operations
function MultiSelect() {
    const [items] = useState([
        { id: 1, name: 'Apple' },
        { id: 2, name: 'Banana' },
        { id: 3, name: 'Cherry' },
    ])
    const [selected, { push, remove, clear, set }] = useList([])

    const toggleItem = (item: (typeof items)[0]) => {
        if (selected.includes(item.id)) {
            remove(item.id)
        } else {
            push(item.id)
        }
    }

    const selectAll = () => {
        set(items.map((item) => item.id))
    }

    const deleteSelected = () => {
        // Perform delete operation
        console.log('Deleting:', selected)
        clear()
    }

    return (
        <div>
            <button onClick={selectAll}>Select All</button>
            <button onClick={clear}>Clear Selection</button>
            <button onClick={deleteSelected} disabled={selected.length === 0}>
                Delete ({selected.length})
            </button>
            {items.map((item) => (
                <label key={item.id}>
                    <input
                        type="checkbox"
                        checked={selected.includes(item.id)}
                        onChange={() => toggleItem(item)}
                    />
                    {item.name}
                </label>
            ))}
        </div>
    )
}
```

```tsx
// Form with dynamic fields
function DynamicForm() {
    const [fields, { push, removeAt, updateAt, reset }] = useList([
        { id: 1, label: 'Name', value: '' },
    ])

    const addField = () => {
        push({ id: Date.now(), label: '', value: '' })
    }

    const updateField = (
        index: number,
        updates: Partial<(typeof fields)[0]>
    ) => {
        updateAt(index, { ...fields[index], ...updates })
    }

    const handleSubmit = () => {
        const data = fields.reduce((acc, field) => {
            if (field.label) {
                acc[field.label] = field.value
            }
            return acc
        }, {})
        console.log('Form data:', data)
    }

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                handleSubmit()
            }}
        >
            {fields.map((field, i) => (
                <div key={field.id}>
                    <input
                        placeholder="Label"
                        value={field.label}
                        onChange={(e) =>
                            updateField(i, { label: e.target.value })
                        }
                    />
                    <input
                        placeholder="Value"
                        value={field.value}
                        onChange={(e) =>
                            updateField(i, { value: e.target.value })
                        }
                    />
                    <button type="button" onClick={() => removeAt(i)}>
                        ×
                    </button>
                </div>
            ))}
            <button type="button" onClick={addField}>
                + Add Field
            </button>
            <button type="button" onClick={reset}>
                Reset
            </button>
            <button type="submit">Submit</button>
        </form>
    )
}
```

## How it works

-   Wraps `useState` for array state
-   All methods use `useCallback` with stable references
-   Methods mutate by creating new arrays (immutable updates)
-   `pop()` and `shift()` return the removed item
-   Index-based methods validate bounds before mutation
-   `filter`, `sort`, `map` modify the list in place
-   `reset()` returns to initial value

## When to use

-   Managing lists of items (todos, cart, tags)
-   Form arrays (dynamic fields, multi-select)
-   History/undo functionality
-   Queue/stack implementations
-   Bulk operations on arrays
-   Drag and drop lists
-   Any array state needing frequent manipulation
-   Replacing complex `useState` + array spread patterns
-   When you need many array operations
-   Building list-based UI components

## Notes

-   All action methods have stable references (won't change on re-render)
-   Methods that accept index validate bounds (no-op if invalid)
-   `pop()` and `shift()` return `undefined` for empty arrays
-   `insertAt()` clamps index to valid range [0, length]
-   `remove()` only removes first occurrence, `removeAll()` removes all
-   `filter`, `sort`, `map`, `reverse` modify list in place
-   `reset()` uses initial value, even if initial value changes
-   TypeScript generics infer type from initial value
-   Works with primitives and complex objects
-   Combine operations by calling multiple methods
-   For complex state, consider using `useReducer` instead

## Browser support

All modern browsers (uses standard array methods)

## Tests

See `src/utility/hooks/__tests__/useList.test.tsx` for comprehensive tests covering initialization, push, pop, shift, unshift, insert, update, remove, filter, sort, reverse, map, concat, reset, complex objects, chained operations, stable references, empty lists, and single item operations (32 tests).

---

# Hook: useHotkeys

Manages keyboard shortcuts with support for modifier keys (ctrl, shift, alt, meta). Perfect for implementing keyboard navigation, shortcuts, and accessibility features.

## API

```ts
useHotkeys(
    hotkey: string,
    callback: (event: KeyboardEvent) => void,
    options?: UseHotkeysOptions
): void

useHotkeysMap(
    hotkeys: Record<string, (event: KeyboardEvent) => void>,
    options?: UseHotkeysOptions
): void

interface UseHotkeysOptions {
    enabled?: boolean // default: true
    enableOnFormTags?: boolean // default: false
    enableOnContentEditable?: boolean // default: false
    preventDefault?: boolean // default: true
    stopPropagation?: boolean // default: false
    description?: string
}
```

## Parameters

-   `hotkey` (string): Hotkey combination (e.g., "ctrl+s", "shift+alt+k")
-   `callback` ((event: KeyboardEvent) => void): Function called when hotkey is pressed
-   `options` (UseHotkeysOptions, optional): Configuration options

## Options

-   `enabled`: Enable/disable the hotkey
-   `enableOnFormTags`: Allow hotkey in input/textarea/select elements
-   `enableOnContentEditable`: Allow hotkey in contentEditable elements
-   `preventDefault`: Prevent default browser behavior
-   `stopPropagation`: Stop event propagation
-   `description`: Optional description for documentation

## Usage

```tsx
import { useHotkeys, useHotkeysMap } from 'my-awesome-component-library'

// Basic save shortcut
function Editor() {
    useHotkeys('ctrl+s', () => {
        console.log('Save!')
    })

    return <textarea />
}
```

```tsx
// Multiple modifiers
function App() {
    useHotkeys('ctrl+shift+p', () => {
        console.log('Open command palette')
    })

    useHotkeys('alt+f4', () => {
        console.log('Close window')
    })

    return <div>Press Ctrl+Shift+P</div>
}
```

```tsx
// Keyboard navigation
function List({ items }) {
    const [selected, setSelected] = useState(0)

    useHotkeys('up', () => {
        setSelected(Math.max(0, selected - 1))
    })

    useHotkeys('down', () => {
        setSelected(Math.min(items.length - 1, selected + 1))
    })

    useHotkeys('enter', () => {
        console.log('Selected:', items[selected])
    })

    return (
        <ul>
            {items.map((item, i) => (
                <li key={i} className={i === selected ? 'selected' : ''}>
                    {item}
                </li>
            ))}
        </ul>
    )
}
```

```tsx
// Enable on form inputs
function SearchBox() {
    const inputRef = useRef()

    useHotkeys(
        'ctrl+f',
        () => {
            inputRef.current?.focus()
        },
        { enableOnFormTags: true }
    )

    return <input ref={inputRef} placeholder="Search..." />
}
```

```tsx
// Conditional hotkeys
function Modal({ isOpen, onClose }) {
    useHotkeys('esc', onClose, { enabled: isOpen })

    if (!isOpen) return null

    return (
        <div className="modal">
            <p>Press Esc to close</p>
            <button onClick={onClose}>Close</button>
        </div>
    )
}
```

```tsx
// Multiple hotkeys with useHotkeysMap
function TextEditor() {
    const [content, setContent] = useState('')

    useHotkeysMap({
        'ctrl+s': () => console.log('Save'),
        'ctrl+o': () => console.log('Open'),
        'ctrl+p': () => console.log('Print'),
        'ctrl+z': () => console.log('Undo'),
        'ctrl+y': () => console.log('Redo'),
        'ctrl+b': () => console.log('Bold'),
        'ctrl+i': () => console.log('Italic'),
        'ctrl+u': () => console.log('Underline'),
    })

    return (
        <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
        />
    )
}
```

```tsx
// Custom action shortcuts
function CommandPalette() {
    const [open, setOpen] = useState(false)

    useHotkeys('ctrl+k', () => {
        setOpen(!open)
    })

    useHotkeysMap(
        {
            escape: () => setOpen(false),
            enter: () => {
                console.log('Execute command')
                setOpen(false)
            },
        },
        { enabled: open }
    )

    if (!open) return null

    return (
        <div className="command-palette">
            <input placeholder="Type a command..." />
        </div>
    )
}
```

```tsx
// Special keys
function Game() {
    useHotkeysMap({
        space: () => console.log('Jump'),
        enter: () => console.log('Interact'),
        escape: () => console.log('Pause'),
        up: () => console.log('Move up'),
        down: () => console.log('Move down'),
        left: () => console.log('Move left'),
        right: () => console.log('Move right'),
    })

    return <canvas />
}
```

```tsx
// Prevent default vs allow default
function Form() {
    // Prevent Ctrl+S from showing save dialog
    useHotkeys(
        'ctrl+s',
        () => {
            console.log('Custom save')
        },
        { preventDefault: true }
    )

    // Allow browser's Ctrl+F
    useHotkeys(
        'ctrl+shift+f',
        () => {
            console.log('App search')
        },
        { preventDefault: false }
    )

    return <form />
}
```

```tsx
// Global shortcuts with descriptions
function App() {
    const shortcuts = [
        { key: 'ctrl+s', action: 'Save', handler: () => console.log('Save') },
        { key: 'ctrl+o', action: 'Open', handler: () => console.log('Open') },
        { key: 'ctrl+p', action: 'Print', handler: () => console.log('Print') },
    ]

    shortcuts.forEach(({ key, handler, action }) => {
        useHotkeys(key, handler, {
            description: action,
        })
    })

    return (
        <div>
            <h2>Keyboard Shortcuts</h2>
            <ul>
                {shortcuts.map(({ key, action }) => (
                    <li key={key}>
                        <kbd>{key}</kbd>: {action}
                    </li>
                ))}
            </ul>
        </div>
    )
}
```

```tsx
// Tab navigation
function TabbedInterface() {
    const [tab, setTab] = useState(0)

    useHotkeysMap({
        'ctrl+1': () => setTab(0),
        'ctrl+2': () => setTab(1),
        'ctrl+3': () => setTab(2),
        'ctrl+tab': () => setTab((tab + 1) % 3),
        'ctrl+shift+tab': () => setTab((tab + 2) % 3),
    })

    return (
        <div>
            <nav>
                <button onClick={() => setTab(0)}>Tab 1 (Ctrl+1)</button>
                <button onClick={() => setTab(1)}>Tab 2 (Ctrl+2)</button>
                <button onClick={() => setTab(2)}>Tab 3 (Ctrl+3)</button>
            </nav>
            <div>{`Content ${tab + 1}`}</div>
        </div>
    )
}
```

## Supported Keys

-   **Modifiers**: `ctrl`, `shift`, `alt`, `meta` (cmd on Mac)
-   **Letters**: `a-z`
-   **Numbers**: `0-9`
-   **Special**: `enter`, `escape` (or `esc`), `space`, `tab`
-   **Arrows**: `up`, `down`, `left`, `right`
-   **Function**: `f1`-`f12`
-   **Symbols**: Any key that produces a character

## Key Aliases

-   `return` → `enter`
-   `esc` → `escape`
-   `spacebar` → `space`
-   `control` → `ctrl`
-   `cmd`/`command` → `meta`

## How it works

-   Parses hotkey string into modifier + key combination
-   Registers window-level `keydown` listener
-   Matches event against parsed hotkey
-   Filters based on target element (form tags, contentEditable)
-   Calls callback if match found
-   Prevents default and stops propagation if configured
-   Cleans up listener on unmount
-   Updates callback without re-registering listener

## When to use

-   Application-wide keyboard shortcuts
-   Editor keyboard bindings
-   Keyboard navigation
-   Accessibility features
-   Modal/dialog close on Escape
-   Form submission on Ctrl+Enter
-   Game controls
-   Command palettes
-   Quick actions
-   Tab/window management
-   Custom keyboard interfaces

## Notes

-   Hotkeys are case-insensitive ("CTRL+S" = "ctrl+s")
-   Multiple modifiers can be combined in any order
-   By default, ignores events from input/textarea/select elements
-   Set `enableOnFormTags: true` to allow hotkeys in form elements
-   Set `preventDefault: false` to allow default browser behavior
-   `useHotkeysMap` triggers only the first matching hotkey
-   Callback updates don't re-register the listener (performance)
-   Works with any key that produces a character
-   Modifier keys must match exactly (no extra modifiers allowed)
-   Uses window-level listener (captures all keyboard events)
-   Safe to use multiple times in same component

## Browser support

All modern browsers (uses standard KeyboardEvent API)

## Tests

See `src/utility/hooks/__tests__/useHotkeys.test.tsx` for comprehensive tests covering single/multiple modifiers, special keys, key normalization, enable/disable, form element filtering, contentEditable filtering, preventDefault, callback updates, hotkey updates, cleanup, case insensitivity, and multiple hotkeys with useHotkeysMap (30 tests).

---

# Hook: useIsMounted

Returns a function that checks if a component is currently mounted. This is essential for preventing memory leaks by avoiding state updates on unmounted components, especially when dealing with async operations.

## API

```ts
useIsMounted(): () => boolean
```

## Returns

A stable function that returns `true` if the component is mounted, `false` otherwise.

## Usage

### Basic usage with async operations

```tsx
import { useIsMounted } from 'my-awesome-component-library'

function UserProfile({ userId }: { userId: string }) {
    const [user, setUser] = useState<User | null>(null)
    const isMounted = useIsMounted()

    useEffect(() => {
        fetchUser(userId).then((data) => {
            // Only update state if component is still mounted
            if (isMounted()) {
                setUser(data)
            }
        })
    }, [userId, isMounted])

    return <div>{user?.name}</div>
}
```

### With fetch and setState pattern

```tsx
function DataComponent() {
    const [data, setData] = useState(null)
    const isMounted = useIsMounted()

    useEffect(() => {
        fetch('/api/data')
            .then((res) => res.json())
            .then((result) => {
                if (isMounted()) {
                    setData(result)
                }
            })
            .catch((error) => {
                if (isMounted()) {
                    console.error(error)
                }
            })
    }, [isMounted])

    return <div>{data}</div>
}
```

### With setTimeout/setInterval

```tsx
function DelayedMessage() {
    const [message, setMessage] = useState('')
    const isMounted = useIsMounted()

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (isMounted()) {
                setMessage('Hello after 3 seconds!')
            }
        }, 3000)

        return () => clearTimeout(timeoutId)
    }, [isMounted])

    return <div>{message}</div>
}
```

### With WebSocket/EventSource

```tsx
function RealtimeData() {
    const [messages, setMessages] = useState<string[]>([])
    const isMounted = useIsMounted()

    useEffect(() => {
        const ws = new WebSocket('wss://example.com/data')

        ws.onmessage = (event) => {
            if (isMounted()) {
                setMessages((prev) => [...prev, event.data])
            }
        }

        return () => ws.close()
    }, [isMounted])

    return (
        <ul>
            {messages.map((msg, i) => (
                <li key={i}>{msg}</li>
            ))}
        </ul>
    )
}
```

### Multiple async operations

```tsx
function Dashboard() {
    const [stats, setStats] = useState(null)
    const [notifications, setNotifications] = useState([])
    const isMounted = useIsMounted()

    useEffect(() => {
        // Fetch stats
        fetchStats().then((data) => {
            if (isMounted()) setStats(data)
        })

        // Fetch notifications
        fetchNotifications().then((data) => {
            if (isMounted()) setNotifications(data)
        })
    }, [isMounted])

    return (
        <div>
            <Stats data={stats} />
            <Notifications items={notifications} />
        </div>
    )
}
```

### Animation frame cancellation

```tsx
function AnimatedValue() {
    const [value, setValue] = useState(0)
    const isMounted = useIsMounted()

    useEffect(() => {
        let rafId: number

        const animate = () => {
            setValue((v) => v + 1)
            if (isMounted()) {
                rafId = requestAnimationFrame(animate)
            }
        }

        rafId = requestAnimationFrame(animate)

        return () => cancelAnimationFrame(rafId)
    }, [isMounted])

    return <div>Value: {value}</div>
}
```

### Subscription cleanup pattern

```tsx
function EventSubscriber() {
    const [events, setEvents] = useState<Event[]>([])
    const isMounted = useIsMounted()

    useEffect(() => {
        const subscription = eventEmitter.subscribe((event) => {
            if (isMounted()) {
                setEvents((prev) => [...prev, event])
            }
        })

        return () => subscription.unsubscribe()
    }, [isMounted])

    return <EventList events={events} />
}
```

### Error handling in async operations

```tsx
function RobustDataFetcher() {
    const [data, setData] = useState(null)
    const [error, setError] = useState<Error | null>(null)
    const [loading, setLoading] = useState(false)
    const isMounted = useIsMounted()

    useEffect(() => {
        setLoading(true)

        fetchData()
            .then((result) => {
                if (isMounted()) {
                    setData(result)
                    setError(null)
                }
            })
            .catch((err) => {
                if (isMounted()) {
                    setError(err)
                    setData(null)
                }
            })
            .finally(() => {
                if (isMounted()) {
                    setLoading(false)
                }
            })
    }, [isMounted])

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error.message}</div>
    return <div>{data}</div>
}
```

## Key features

-   **Memory leak prevention**: Prevents setState calls on unmounted components
-   **Stable reference**: Returns the same function instance across re-renders
-   **Zero dependencies**: Uses only useRef, useEffect, and useCallback
-   **TypeScript support**: Fully typed with proper return types
-   **Simple API**: Just call `isMounted()` to check mount status
-   **Cleanup safety**: Properly handles component lifecycle

## Common patterns

### Pattern 1: Async/await with isMounted

```tsx
useEffect(() => {
    const loadData = async () => {
        const data = await fetchData()
        if (isMounted()) {
            setData(data)
        }
    }
    loadData()
}, [isMounted])
```

### Pattern 2: Promise chain with isMounted

```tsx
useEffect(() => {
    Promise.all([fetchUser(), fetchPosts()]).then(([user, posts]) => {
        if (isMounted()) {
            setUser(user)
            setPosts(posts)
        }
    })
}, [isMounted])
```

### Pattern 3: Cleanup with isMounted check

```tsx
useEffect(() => {
    const interval = setInterval(() => {
        if (isMounted()) {
            setCount((c) => c + 1)
        } else {
            clearInterval(interval)
        }
    }, 1000)

    return () => clearInterval(interval)
}, [isMounted])
```

## When to use

-   Any async operation that updates state (fetch, timers, promises)
-   Event listeners that trigger state updates
-   WebSocket/SSE connections that update state
-   Animation frames that update state
-   Subscriptions that update state
-   Any scenario where component might unmount before async completes

## When NOT to use

-   Synchronous state updates (no risk of unmounted updates)
-   Effects with proper cleanup that cancels async operations
-   When using libraries that handle cleanup automatically (e.g., React Query)

## Browser support

All modern browsers and React 16.8+

## Tests

See `src/utility/hooks/__tests__/useIsMounted.test.tsx` for comprehensive tests covering mount/unmount states, async operations, stable references, multiple re-renders, rapid mount/unmount cycles, useEffect cleanup, fetch patterns, and multiple async operations (12 tests).

---

# Hook: useMutationObserver

Observes DOM mutations using the MutationObserver API. Perfect for watching dynamic content changes, monitoring DOM updates, tracking element modifications, and responding to structural changes in real-time.

## API

```ts
useMutationObserver<T extends HTMLElement>(
    callback: MutationCallback,
    targetRef: React.RefObject<T>,
    options?: UseMutationObserverOptions
): void

type MutationCallback = (mutations: MutationRecord[], observer: MutationObserver) => void

interface UseMutationObserverOptions extends MutationObserverInit {
    enabled?: boolean // default: true
    // MutationObserverInit options:
    attributes?: boolean
    attributeFilter?: string[]
    attributeOldValue?: boolean
    characterData?: boolean
    characterDataOldValue?: boolean
    childList?: boolean
    subtree?: boolean
}
```

## Parameters

-   `callback` (MutationCallback): Function called when mutations occur
-   `targetRef` (RefObject<T>): React ref to the element to observe
-   `options` (UseMutationObserverOptions, optional): Configuration options

## Options

-   `enabled`: Enable/disable the observer
-   `attributes`: Watch attribute changes
-   `attributeFilter`: Array of specific attributes to watch
-   `attributeOldValue`: Include old attribute values in mutation records
-   `characterData`: Watch text content changes
-   `characterDataOldValue`: Include old character data in mutation records
-   `childList`: Watch child element additions/removals
-   `subtree`: Observe all descendants, not just direct children

## Usage

### Watch for child additions/removals

```tsx
import { useRef } from 'react'
import { useMutationObserver } from 'my-awesome-component-library'

function DynamicList() {
    const listRef = useRef<HTMLUListElement>(null)

    useMutationObserver(
        (mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    console.log('Added:', mutation.addedNodes.length)
                    console.log('Removed:', mutation.removedNodes.length)
                }
            })
        },
        listRef,
        { childList: true }
    )

    return (
        <ul ref={listRef}>
            <li>Item 1</li>
            <li>Item 2</li>
        </ul>
    )
}
```

### Watch for attribute changes

```tsx
function AttributeWatcher() {
    const divRef = useRef<HTMLDivElement>(null)
    const [log, setLog] = useState<string[]>([])

    useMutationObserver(
        (mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes') {
                    setLog((prev) => [
                        ...prev,
                        `${mutation.attributeName} changed to ${(
                            mutation.target as Element
                        ).getAttribute(mutation.attributeName!)}`,
                    ])
                }
            })
        },
        divRef,
        { attributes: true, attributeOldValue: true }
    )

    return (
        <div>
            <div ref={divRef} className="watched">
                Watched element
            </div>
            <button onClick={() => divRef.current?.classList.toggle('active')}>
                Toggle Class
            </button>
            <ul>
                {log.map((entry, i) => (
                    <li key={i}>{entry}</li>
                ))}
            </ul>
        </div>
    )
}
```

### Watch specific attributes only

```tsx
function ClassWatcher() {
    const elementRef = useRef<HTMLDivElement>(null)

    useMutationObserver(
        (mutations) => {
            mutations.forEach((mutation) => {
                console.log(
                    'Class changed:',
                    (mutation.target as Element).className
                )
            })
        },
        elementRef,
        {
            attributes: true,
            attributeFilter: ['class'], // Only watch class attribute
        }
    )

    return <div ref={elementRef}>Element with watched class</div>
}
```

### Watch text content changes

```tsx
function TextWatcher() {
    const textRef = useRef<HTMLParagraphElement>(null)
    const [changes, setChanges] = useState(0)

    useMutationObserver(
        (mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'characterData') {
                    setChanges((c) => c + 1)
                    console.log('Old:', mutation.oldValue)
                    console.log('New:', mutation.target.textContent)
                }
            })
        },
        textRef,
        {
            characterData: true,
            characterDataOldValue: true,
            subtree: true,
        }
    )

    return (
        <div>
            <p ref={textRef}>Editable text</p>
            <p>Changes: {changes}</p>
        </div>
    )
}
```

### Watch entire subtree

```tsx
function SubtreeWatcher() {
    const containerRef = useRef<HTMLDivElement>(null)
    const [mutationCount, setMutationCount] = useState(0)

    useMutationObserver(
        (mutations) => {
            setMutationCount((c) => c + mutations.length)
        },
        containerRef,
        {
            childList: true,
            attributes: true,
            characterData: true,
            subtree: true, // Watch all descendants
        }
    )

    return (
        <div ref={containerRef}>
            <p>Mutations detected: {mutationCount}</p>
            <div>
                <span>Nested content</span>
            </div>
        </div>
    )
}
```

### Enable/disable dynamically

```tsx
function ConditionalObserver({ shouldWatch }: { shouldWatch: boolean }) {
    const elementRef = useRef<HTMLDivElement>(null)

    useMutationObserver(
        (mutations) => {
            console.log('Mutations:', mutations.length)
        },
        elementRef,
        {
            childList: true,
            enabled: shouldWatch, // Dynamic enable/disable
        }
    )

    return <div ref={elementRef}>Watched element</div>
}
```

### Track DOM changes in real-time

```tsx
function LiveDOMTracker() {
    const containerRef = useRef<HTMLDivElement>(null)
    const [stats, setStats] = useState({
        addedNodes: 0,
        removedNodes: 0,
        attributeChanges: 0,
    })

    useMutationObserver(
        (mutations) => {
            let added = 0
            let removed = 0
            let attrs = 0

            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    added += mutation.addedNodes.length
                    removed += mutation.removedNodes.length
                } else if (mutation.type === 'attributes') {
                    attrs++
                }
            })

            setStats((prev) => ({
                addedNodes: prev.addedNodes + added,
                removedNodes: prev.removedNodes + removed,
                attributeChanges: prev.attributeChanges + attrs,
            }))
        },
        containerRef,
        {
            childList: true,
            attributes: true,
            subtree: true,
        }
    )

    return (
        <div>
            <div ref={containerRef}>
                <p>Container content</p>
            </div>
            <div>
                <p>Added: {stats.addedNodes}</p>
                <p>Removed: {stats.removedNodes}</p>
                <p>Attributes: {stats.attributeChanges}</p>
            </div>
        </div>
    )
}
```

### Monitor dynamic content loading

```tsx
function ContentLoader() {
    const contentRef = useRef<HTMLDivElement>(null)
    const [isLoading, setIsLoading] = useState(true)

    useMutationObserver(
        (mutations) => {
            const hasContent = mutations.some(
                (m) =>
                    m.addedNodes.length > 0 && m.target === contentRef.current
            )
            if (hasContent) {
                setIsLoading(false)
            }
        },
        contentRef,
        { childList: true }
    )

    return (
        <div>
            {isLoading && <p>Loading...</p>}
            <div ref={contentRef} id="dynamic-content" />
        </div>
    )
}
```

### Watch for class changes with callback updates

```tsx
function ThemeWatcher() {
    const bodyRef = useRef(document.body)
    const [theme, setTheme] = useState('light')

    useMutationObserver(
        (mutations) => {
            mutations.forEach((mutation) => {
                const element = mutation.target as HTMLElement
                if (element.classList.contains('dark')) {
                    setTheme('dark')
                } else {
                    setTheme('light')
                }
            })
        },
        bodyRef,
        {
            attributes: true,
            attributeFilter: ['class'],
        }
    )

    return <p>Current theme: {theme}</p>
}
```

### Monitor form field additions

```tsx
function DynamicForm() {
    const formRef = useRef<HTMLFormElement>(null)
    const [fieldCount, setFieldCount] = useState(0)

    useMutationObserver(
        (mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (
                        node.nodeName === 'INPUT' ||
                        node.nodeName === 'TEXTAREA' ||
                        node.nodeName === 'SELECT'
                    ) {
                        setFieldCount((c) => c + 1)
                    }
                })
            })
        },
        formRef,
        { childList: true, subtree: true }
    )

    return (
        <form ref={formRef}>
            <p>Fields: {fieldCount}</p>
        </form>
    )
}
```

### Watch inline style changes

```tsx
function StyleWatcher() {
    const elementRef = useRef<HTMLDivElement>(null)
    const [styleLog, setStyleLog] = useState<string[]>([])

    useMutationObserver(
        (mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'style') {
                    const newStyle = (
                        mutation.target as HTMLElement
                    ).getAttribute('style')
                    setStyleLog((prev) => [...prev, newStyle || 'none'])
                }
            })
        },
        elementRef,
        {
            attributes: true,
            attributeFilter: ['style'],
            attributeOldValue: true,
        }
    )

    return (
        <div>
            <div ref={elementRef} style={{ color: 'blue' }}>
                Styled element
            </div>
            <ul>
                {styleLog.map((style, i) => (
                    <li key={i}>{style}</li>
                ))}
            </ul>
        </div>
    )
}
```

### Detect element removal

```tsx
function RemovalDetector() {
    const containerRef = useRef<HTMLDivElement>(null)

    useMutationObserver(
        (mutations) => {
            mutations.forEach((mutation) => {
                mutation.removedNodes.forEach((node) => {
                    if (node.nodeName === 'DIV') {
                        console.log('Div removed:', node.textContent)
                    }
                })
            })
        },
        containerRef,
        { childList: true }
    )

    return <div ref={containerRef}>Container</div>
}
```

## Key features

-   **DOM change tracking**: Monitor any type of DOM mutation
-   **Flexible configuration**: Watch attributes, children, text, or all changes
-   **Subtree support**: Observe entire element trees
-   **Attribute filtering**: Watch specific attributes only
-   **Old value tracking**: Access previous attribute/text values
-   **Dynamic enable/disable**: Turn observer on/off conditionally
-   **Callback stability**: Updates callback without reconnecting observer
-   **Automatic cleanup**: Disconnects observer on unmount
-   **TypeScript support**: Fully typed with generic element types
-   **Performance optimized**: Uses native MutationObserver API

## Common patterns

### Pattern 1: Track specific changes

```tsx
useMutationObserver(
    (mutations) => {
        mutations.forEach((m) => {
            if (m.type === 'attributes' && m.attributeName === 'data-value') {
                // Handle data-value changes
            }
        })
    },
    ref,
    { attributes: true, attributeFilter: ['data-value'] }
)
```

### Pattern 2: Count mutations

```tsx
const [count, setCount] = useState(0)
useMutationObserver(() => setCount((c) => c + 1), ref, { childList: true })
```

### Pattern 3: Batch processing

```tsx
useMutationObserver(
    (mutations) => {
        const allAdded = mutations.flatMap((m) => Array.from(m.addedNodes))
        processNodes(allAdded)
    },
    ref,
    { childList: true, subtree: true }
)
```

## When to use

-   Monitoring dynamically loaded content
-   Tracking third-party DOM changes
-   Watching for class/style changes
-   Detecting element additions/removals
-   Observing attribute modifications
-   Monitoring WYSIWYG editors
-   Tracking DOM-based animations
-   Detecting form field changes
-   Watching iframe content
-   Monitoring web component updates

## When NOT to use

-   For state that you control (use React state instead)
-   For simple event handlers (use standard event listeners)
-   For performance-critical tight loops
-   When you can use React lifecycle methods instead

## Performance notes

-   MutationObserver is generally performant
-   Watching entire subtrees can be expensive on large DOMs
-   Filter observations to minimum needed
-   Batch process multiple mutations
-   Consider debouncing callback for high-frequency changes

## Browser support

All modern browsers (IE11+, uses native MutationObserver API)

## Tests

See `src/utility/hooks/__tests__/useMutationObserver.test.tsx` for comprehensive tests covering child list mutations, attribute mutations, character data mutations, attribute filtering, subtree observation, enable/disable, callback updates, disconnection, null refs, ref changes, multiple mutation types, observer instance, useRef integration, and dynamic enable/disable toggle (14 tests).

---

# Hook: usePreferredLanguage

Returns the user's preferred language from the browser. Automatically updates when the browser language changes. Perfect for internationalization (i18n) and localization (l10n) features.

## API

```ts
usePreferredLanguage(): string
```

## Returns

The user's preferred language code (e.g., 'en-US', 'fr', 'es-ES', 'zh-CN'). Defaults to 'en-US' if unavailable.

## Usage

### Basic usage

```tsx
import { usePreferredLanguage } from 'my-awesome-component-library'

function LanguageDisplay() {
    const language = usePreferredLanguage()

    return <p>Your language: {language}</p>
}
```

### Dynamic content localization

```tsx
function LocalizedGreeting() {
    const language = usePreferredLanguage()

    const greetings: Record<string, string> = {
        en: 'Hello',
        'en-US': 'Hello',
        'en-GB': 'Hello',
        fr: 'Bonjour',
        'fr-FR': 'Bonjour',
        es: 'Hola',
        'es-ES': 'Hola',
        de: 'Guten Tag',
        'de-DE': 'Guten Tag',
        it: 'Ciao',
        ja: 'こんにちは',
        zh: '你好',
        ko: '안녕하세요',
    }

    const greeting =
        greetings[language] || greetings[language.split('-')[0]] || 'Hello'

    return <h1>{greeting}!</h1>
}
```

### Language-based content switching

```tsx
function LocalizedContent() {
    const language = usePreferredLanguage()
    const langCode = language.split('-')[0] // Get base language code

    const content = {
        en: {
            title: 'Welcome',
            description: 'This is an English description',
        },
        fr: {
            title: 'Bienvenue',
            description: 'Ceci est une description en français',
        },
        es: {
            title: 'Bienvenido',
            description: 'Esta es una descripción en español',
        },
    }

    const text = content[langCode as keyof typeof content] || content.en

    return (
        <div>
            <h1>{text.title}</h1>
            <p>{text.description}</p>
        </div>
    )
}
```

### Integration with i18n library

```tsx
import { useEffect } from 'react'
import i18n from 'i18next'

function App() {
    const language = usePreferredLanguage()

    useEffect(() => {
        // Update i18n when browser language changes
        i18n.changeLanguage(language.split('-')[0])
    }, [language])

    return <YourApp />
}
```

### Display language selector with detected language

```tsx
function LanguageSelector() {
    const detectedLanguage = usePreferredLanguage()
    const [selectedLanguage, setSelectedLanguage] = useState(detectedLanguage)

    const languages = [
        { code: 'en-US', name: 'English (US)' },
        { code: 'en-GB', name: 'English (UK)' },
        { code: 'fr-FR', name: 'Français' },
        { code: 'es-ES', name: 'Español' },
        { code: 'de-DE', name: 'Deutsch' },
        { code: 'ja-JP', name: '日本語' },
        { code: 'zh-CN', name: '中文' },
    ]

    return (
        <div>
            <p>Detected: {detectedLanguage}</p>
            <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
            >
                {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                        {lang.name}
                    </option>
                ))}
            </select>
        </div>
    )
}
```

### Format dates based on language

```tsx
function LocalizedDate({ date }: { date: Date }) {
    const language = usePreferredLanguage()

    const formattedDate = new Intl.DateTimeFormat(language, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(date)

    return <p>{formattedDate}</p>
}
```

### Format numbers based on language

```tsx
function LocalizedNumber({ value }: { value: number }) {
    const language = usePreferredLanguage()

    const formattedNumber = new Intl.NumberFormat(language).format(value)

    return <p>{formattedNumber}</p>
}
```

### Currency formatting

```tsx
function LocalizedPrice({
    amount,
    currency,
}: {
    amount: number
    currency: string
}) {
    const language = usePreferredLanguage()

    const formattedPrice = new Intl.NumberFormat(language, {
        style: 'currency',
        currency,
    }).format(amount)

    return <p>{formattedPrice}</p>
}
```

### Language-aware text direction

```tsx
function LocalizedLayout() {
    const language = usePreferredLanguage()

    // Right-to-left languages
    const rtlLanguages = ['ar', 'he', 'fa', 'ur']
    const langCode = language.split('-')[0]
    const isRTL = rtlLanguages.includes(langCode)

    return (
        <div dir={isRTL ? 'rtl' : 'ltr'} lang={language}>
            <p>Content flows in the correct direction</p>
        </div>
    )
}
```

### Load language-specific resources

```tsx
function LocalizedApp() {
    const language = usePreferredLanguage()
    const [translations, setTranslations] = useState<Record<
        string,
        string
    > | null>(null)

    useEffect(() => {
        const langCode = language.split('-')[0]

        // Load translations for the detected language
        import(`./translations/${langCode}.json`)
            .then((module) => setTranslations(module.default))
            .catch(() => {
                // Fallback to English
                import('./translations/en.json').then((module) =>
                    setTranslations(module.default)
                )
            })
    }, [language])

    if (!translations) {
        return <div>Loading...</div>
    }

    return <div>{translations.welcome}</div>
}
```

### Automatic language detection with fallback

```tsx
function SmartLocalizedContent() {
    const preferredLanguage = usePreferredLanguage()

    const getContent = (langCode: string) => {
        // Try exact match (e.g., 'en-US')
        if (content[langCode]) {
            return content[langCode]
        }

        // Try base language (e.g., 'en')
        const baseCode = langCode.split('-')[0]
        if (content[baseCode]) {
            return content[baseCode]
        }

        // Fallback to English
        return content['en']
    }

    const content: Record<string, { title: string; text: string }> = {
        en: { title: 'Hello', text: 'Welcome' },
        'en-US': { title: 'Hello', text: 'Welcome to our site' },
        fr: { title: 'Bonjour', text: 'Bienvenue' },
        es: { title: 'Hola', text: 'Bienvenido' },
    }

    const localizedContent = getContent(preferredLanguage)

    return (
        <div>
            <h1>{localizedContent.title}</h1>
            <p>{localizedContent.text}</p>
        </div>
    )
}
```

### Language-specific font loading

```tsx
function LocalizedText() {
    const language = usePreferredLanguage()
    const langCode = language.split('-')[0]

    // Different fonts for different scripts
    const fontFamily =
        {
            en: 'Roboto, sans-serif',
            zh: 'Noto Sans SC, sans-serif',
            ja: 'Noto Sans JP, sans-serif',
            ko: 'Noto Sans KR, sans-serif',
            ar: 'Noto Sans Arabic, sans-serif',
        }[langCode] || 'Roboto, sans-serif'

    return <div style={{ fontFamily }}>Localized content</div>
}
```

## Key features

-   **Browser language detection**: Reads `navigator.language`
-   **Automatic updates**: Listens to `languagechange` event
-   **SSR-safe**: Returns default value server-side
-   **Standard format**: Returns BCP 47 language tags
-   **Fallback support**: Returns 'en-US' if unavailable
-   **Zero dependencies**: Pure React implementation
-   **TypeScript support**: Fully typed return value
-   **Automatic cleanup**: Removes event listener on unmount

## Language code formats

The hook returns standard BCP 47 language tags:

-   **Base language**: `en`, `fr`, `es`, `de`, `ja`, `zh`
-   **Language + Region**: `en-US`, `en-GB`, `fr-FR`, `es-ES`
-   **With script**: `zh-Hans`, `zh-Hant`, `sr-Cyrl`, `sr-Latn`
-   **Full format**: `zh-Hans-CN`, `sr-Latn-RS`

## Common patterns

### Pattern 1: Base language extraction

```tsx
const language = usePreferredLanguage()
const baseLanguage = language.split('-')[0] // 'en-US' -> 'en'
```

### Pattern 2: Fallback chain

```tsx
const text =
    translations[language] ||
    translations[language.split('-')[0]] ||
    translations['en']
```

### Pattern 3: React-Intl integration

```tsx
const language = usePreferredLanguage()
return (
    <IntlProvider locale={language} messages={messages[language]}>
        ...
    </IntlProvider>
)
```

## When to use

-   Internationalization (i18n) implementations
-   Automatic language detection for multi-language apps
-   Locale-aware formatting (dates, numbers, currency)
-   Language-specific resource loading
-   Content localization
-   Text direction (LTR/RTL) detection
-   Language preferences without server
-   Client-side translation systems

## When NOT to use

-   When language preference is stored server-side
-   When you need all browser languages (use `navigator.languages`)
-   For user-selected language persistence (combine with localStorage)

## Browser support

All modern browsers (uses `navigator.language` and `languagechange` event)

## Notes

-   Returns the first language from browser preferences
-   Updates automatically when user changes browser language
-   SSR returns 'en-US' by default
-   Language format follows BCP 47 standard
-   Consider combining with localStorage for persistence

## Tests

See `src/utility/hooks/__tests__/usePreferredLanguage.test.tsx` for comprehensive tests covering browser language detection, different language codes, languages without region, language change events, multiple changes, event listener cleanup, default fallback, common language codes, stable references, script subtags, lowercase codes, and various language formats (14 tests).

---

# Hook: useWakeLock

Prevents the screen from sleeping using the Screen Wake Lock API. Perfect for presentations, video players, reading apps, and any scenario where you want to keep the screen active.

## API

```ts
useWakeLock(options?: UseWakeLockOptions): UseWakeLockReturn

interface UseWakeLockOptions {
    requestOnMount?: boolean // default: false
    onAcquire?: () => void
    onRelease?: () => void
    onError?: (error: Error) => void
}

interface UseWakeLockReturn {
    isActive: boolean // Whether wake lock is currently active
    isSupported: boolean // Whether API is supported
    request: () => Promise<void> // Request wake lock
    release: () => Promise<void> // Release wake lock
}
```

## Parameters

-   `options.requestOnMount` (boolean, optional): Automatically request wake lock on mount
-   `options.onAcquire` (function, optional): Callback when lock is acquired
-   `options.onRelease` (function, optional): Callback when lock is released
-   `options.onError` (function, optional): Callback when errors occur

## Returns

-   `isActive`: Whether a wake lock is currently active
-   `isSupported`: Whether the Screen Wake Lock API is supported
-   `request()`: Async function to request a wake lock
-   `release()`: Async function to release the current wake lock

## Usage

### Basic usage

```tsx
import { useWakeLock } from 'my-awesome-component-library'

function VideoPlayer() {
    const { isActive, isSupported, request, release } = useWakeLock()

    if (!isSupported) {
        return <p>Wake Lock API not supported</p>
    }

    return (
        <div>
            <video onPlay={request} onPause={release} />
            <p>Screen lock: {isActive ? 'Active' : 'Inactive'}</p>
        </div>
    )
}
```

### Automatic activation on mount

```tsx
function Presentation() {
    const { isActive } = useWakeLock({ requestOnMount: true })

    return (
        <div>
            <h1>Presentation Mode</h1>
            <p>Screen will stay awake: {isActive ? '✓' : '✗'}</p>
        </div>
    )
}
```

### Reading app with manual controls

```tsx
function EbookReader() {
    const { isActive, request, release } = useWakeLock()
    const [keepAwake, setKeepAwake] = useState(false)

    useEffect(() => {
        if (keepAwake) {
            request()
        } else {
            release()
        }
    }, [keepAwake])

    return (
        <div>
            <article>{/* Book content */}</article>
            <label>
                <input
                    type="checkbox"
                    checked={keepAwake}
                    onChange={(e) => setKeepAwake(e.target.checked)}
                />
                Keep screen awake while reading
            </label>
            <p>Status: {isActive ? 'Active' : 'Inactive'}</p>
        </div>
    )
}
```

### Video player with callbacks

```tsx
function StreamingPlayer() {
    const { isActive, request, release } = useWakeLock({
        onAcquire: () => console.log('Screen will stay awake'),
        onRelease: () => console.log('Screen can sleep now'),
        onError: (error) => console.error('Wake lock error:', error),
    })

    const [playing, setPlaying] = useState(false)

    const handlePlay = () => {
        setPlaying(true)
        request()
    }

    const handlePause = () => {
        setPlaying(false)
        release()
    }

    return (
        <div>
            <video onPlay={handlePlay} onPause={handlePause} />
            <button onClick={playing ? handlePause : handlePlay}>
                {playing ? 'Pause' : 'Play'}
            </button>
            <p>{isActive ? '🔒 Screen locked' : '💤 Screen can sleep'}</p>
        </div>
    )
}
```

### Conditional wake lock for specific content

```tsx
function MediaViewer({ type }: { type: 'image' | 'video' }) {
    const { request, release } = useWakeLock()

    useEffect(() => {
        // Only keep screen awake for videos
        if (type === 'video') {
            request()
        }

        return () => {
            release()
        }
    }, [type])

    return <div>{/* Media content */}</div>
}
```

### Dashboard with auto-refresh

```tsx
function LiveDashboard() {
    const { isActive, isSupported, request } = useWakeLock({
        requestOnMount: true,
        onError: (error) => {
            console.warn('Could not keep screen awake:', error.message)
        },
    })

    if (!isSupported) {
        return <p>⚠️ This dashboard works best with wake lock support</p>
    }

    return (
        <div>
            <h1>Live Dashboard</h1>
            <p>Auto-refresh enabled {isActive && '(Screen stays awake)'}</p>
            {/* Dashboard content */}
        </div>
    )
}
```

### Exercise timer

```tsx
function WorkoutTimer() {
    const [isWorkingOut, setIsWorkingOut] = useState(false)
    const { isActive, request, release } = useWakeLock()

    const startWorkout = async () => {
        setIsWorkingOut(true)
        await request()
    }

    const endWorkout = async () => {
        setIsWorkingOut(false)
        await release()
    }

    return (
        <div>
            <h2>Workout Timer</h2>
            <button onClick={isWorkingOut ? endWorkout : startWorkout}>
                {isWorkingOut ? 'End Workout' : 'Start Workout'}
            </button>
            {isActive && <p>✓ Screen will stay on during workout</p>}
        </div>
    )
}
```

### Recipe viewer

```tsx
function RecipeViewer() {
    const [isCooking, setIsCooking] = useState(false)
    const { request, release, isActive } = useWakeLock()

    const toggleCookingMode = () => {
        if (isCooking) {
            release()
        } else {
            request()
        }
        setIsCooking(!isCooking)
    }

    return (
        <div>
            <h1>Recipe</h1>
            <button onClick={toggleCookingMode}>
                {isCooking ? '✓ Cooking Mode Active' : 'Start Cooking Mode'}
            </button>
            {isActive && <p>📱 Screen will stay on while you cook</p>}
            <div>{/* Recipe steps */}</div>
        </div>
    )
}
```

### Slideshow presentation

```tsx
function Slideshow() {
    const [currentSlide, setCurrentSlide] = useState(0)
    const { isActive, request, release } = useWakeLock()

    const startPresentation = async () => {
        await request()
        setCurrentSlide(0)
    }

    const endPresentation = async () => {
        await release()
    }

    return (
        <div>
            {currentSlide === 0 ? (
                <button onClick={startPresentation}>Start Presentation</button>
            ) : (
                <>
                    <div>Slide {currentSlide}</div>
                    <button onClick={() => setCurrentSlide(currentSlide + 1)}>
                        Next
                    </button>
                    <button onClick={endPresentation}>End</button>
                    {isActive && <p>🔒 Presentation mode active</p>}
                </>
            )}
        </div>
    )
}
```

### Music player with lyrics

```tsx
function MusicPlayerWithLyrics() {
    const [isPlaying, setIsPlaying] = useState(false)
    const [showLyrics, setShowLyrics] = useState(false)
    const { request, release, isActive } = useWakeLock()

    useEffect(() => {
        // Keep screen awake when playing AND showing lyrics
        if (isPlaying && showLyrics) {
            request()
        } else {
            release()
        }
    }, [isPlaying, showLyrics])

    return (
        <div>
            <audio
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
            />
            <label>
                <input
                    type="checkbox"
                    checked={showLyrics}
                    onChange={(e) => setShowLyrics(e.target.checked)}
                />
                Show lyrics
            </label>
            {isActive && <p>Screen will stay on for lyrics</p>}
        </div>
    )
}
```

### Game with pause functionality

```tsx
function Game() {
    const [isPaused, setIsPaused] = useState(false)
    const { isActive, request, release } = useWakeLock({
        requestOnMount: true,
    })

    const togglePause = () => {
        if (isPaused) {
            request()
        } else {
            release()
        }
        setIsPaused(!isPaused)
    }

    return (
        <div>
            <canvas />
            <button onClick={togglePause}>
                {isPaused ? 'Resume' : 'Pause'}
            </button>
            {isActive && <p>Game active - screen stays on</p>}
        </div>
    )
}
```

### Conference call viewer

```tsx
function ConferenceCall() {
    const [inCall, setInCall] = useState(false)
    const { request, release, isSupported } = useWakeLock({
        onAcquire: () => console.log('Screen locked for call'),
        onRelease: () => console.log('Call ended, screen can sleep'),
    })

    const joinCall = async () => {
        setInCall(true)
        if (isSupported) {
            await request()
        }
    }

    const leaveCall = async () => {
        setInCall(false)
        await release()
    }

    return (
        <div>
            <h2>Conference Call</h2>
            {inCall ? (
                <>
                    <video />
                    <button onClick={leaveCall}>Leave Call</button>
                </>
            ) : (
                <button onClick={joinCall}>Join Call</button>
            )}
        </div>
    )
}
```

## How it works

1. Uses the Screen Wake Lock API (`navigator.wakeLock.request('screen')`)
2. Requests a wake lock when `request()` is called
3. Monitors lock state and handles automatic releases
4. Listens to the lock's `release` event (e.g., when tab is hidden)
5. Attempts to reacquire lock when tab becomes visible again
6. Automatically releases lock on component unmount
7. Handles errors gracefully when API is unavailable

## When to use

-   Video/audio players during playback
-   Presentations and slideshows
-   Reading apps and e-books
-   Recipe viewers during cooking
-   Exercise timers and workout apps
-   Live dashboards with auto-refresh
-   Games and interactive content
-   Conference calls and video chats
-   Any long-form content consumption
-   Navigation apps

## When NOT to use

-   For background tasks (wake lock only works when tab is visible)
-   When content doesn't require visual attention
-   If battery life is a critical concern
-   For short interactions (< 30 seconds)

## Key features

-   **Automatic reacquisition**: Reacquires lock when tab becomes visible
-   **Auto-cleanup**: Releases lock on unmount
-   **Error handling**: Graceful fallback when API unavailable
-   **State tracking**: Know when lock is active
-   **Browser support detection**: Check if API is available
-   **Callback support**: React to acquire/release/error events
-   **TypeScript support**: Fully typed API

## Browser support

Modern browsers (Chrome 84+, Edge 84+, Safari 16.4+). Check `isSupported` before using.

## Notes

-   Wake lock is automatically released when tab is hidden
-   Some browsers require user interaction before granting wake lock
-   Wake lock doesn't prevent device from sleeping when screen is off
-   Permission may be denied on low battery
-   Only one wake lock per tab is allowed
-   Tab must be visible for wake lock to be active
-   Reacquisition happens automatically on visibility change

## Common patterns

### Pattern 1: Media playback

```tsx
<video onPlay={request} onPause={release} />
```

### Pattern 2: Toggle button

```tsx
const toggle = () => (isActive ? release() : request())
```

### Pattern 3: Conditional based on user preference

```tsx
useEffect(() => {
    if (userPreference.keepScreenOn) {
        request()
    }
}, [userPreference])
```

## Tests

See `src/utility/hooks/__tests__/useWakeLock.test.tsx` for comprehensive tests covering initial state, unsupported browsers, request/release, callbacks (onAcquire, onRelease, onError), requestOnMount option, unmount cleanup, release events from sentinel, visibility change handling, releasing before new requests, rapid requests, and error handling (17 tests).
