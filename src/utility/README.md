# Utility: curry

A lightweight curry helper for fixed-arity functions.

## Usage

-   Provide arguments across multiple calls until the functionâ€™s arity (`fn.length`) is met.
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

-   `get(): T` â€” reads current value (may recompute derived)
-   `subscribe(cb, notifyImmediately = true): () => void` â€” subscribe to changes
-   `_subscribers(): number` â€” number of active subscribers

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

- `timeout` (number): Time in milliseconds of inactivity before considered idle
- `options` (UseIdleOptions, optional):
  - `events`: Array of event names to track (default: `['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'wheel']`)
  - `initialState`: Initial idle state (default: `false`)

## Returns

- `boolean`: `true` when user has been idle for the specified timeout, `false` when active

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
                <p>You've been inactive. Your session will expire in 5 minutes.</p>
                <button onClick={() => window.location.reload()}>Stay Logged In</button>
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
            {isIdle && <div className="idle-overlay">Move mouse to continue</div>}
        </div>
    )
}
```

```tsx
// Custom events (track only mouse movement)
function MouseIdleTracker() {
    const isIdle = useIdle(5000, {
        events: ['mousemove']
    })
    
    return <div>Mouse idle: {isIdle ? 'Yes' : 'No'}</div>
}
```

```tsx
// Start as idle
function IdleIndicator() {
    const isIdle = useIdle(3000, {
        initialState: true // Starts as idle until first interaction
    })
    
    return (
        <div className={isIdle ? 'status-idle' : 'status-active'}>
            {isIdle ? 'í²¤ Idle' : 'âœ… Active'}
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
                page: window.location.pathname
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

- Sets up event listeners on the `window` object for the specified events
- Starts a timeout when the component mounts
- Resets the timeout whenever any tracked event fires
- Sets idle state to `true` when timeout expires without activity
- Sets idle state to `false` when activity is detected after becoming idle
- Cleans up event listeners and timeout on unmount

## When to use

- Session timeout warnings and auto-logout
- Auto-save drafts when user stops typing/interacting
- Auto-pause media content
- Analytics and user engagement tracking
- Screen dimming or screensaver activation
- Hiding UI elements during inactivity
- Reducing resource consumption during idle periods
- Warning before background task execution
- Gaming AFK (away from keyboard) detection
- Chat/messaging away status

## Notes

- Works in browser environments only (SSR-safe with `typeof window` check)
- Uses capture phase for event listeners to catch all activity
- All event listeners are passive and don't affect page performance
- Timeout resets on any activity, not just significant interactions
- Custom events must be valid DOM event names
- Consider longer timeouts for mobile devices (touch-based interaction)
- Be mindful of accessibility - avoid auto-logout with short timeouts
- Combines well with `useLocalStorage` to persist idle state across sessions

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

- `ColorScheme`: The current color scheme - either `'light'` or `'dark'`

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
    
    return (
        <link
            rel="stylesheet"
            href={`/styles/${colorScheme}.css`}
        />
    )
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
        border: `1px solid ${colorScheme === 'dark' ? '#555' : '#ddd'}`
    }
    
    return <div style={styles}>{children}</div>
}
```

```tsx
// Preload images based on theme
function ThemedImage({ lightSrc, darkSrc, alt }) {
    const colorScheme = useColorScheme()
    
    return (
        <img
            src={colorScheme === 'dark' ? darkSrc : lightSrc}
            alt={alt}
        />
    )
}
```

```tsx
// Analytics tracking
function ThemeAnalytics() {
    const colorScheme = useColorScheme()
    
    useEffect(() => {
        analytics.track('color_scheme_detected', {
            scheme: colorScheme,
            timestamp: Date.now()
        })
    }, [colorScheme])
    
    return null
}
```

```tsx
// Complex theme system with localStorage override
function AdvancedThemeProvider() {
    const systemScheme = useColorScheme()
    const [userPreference, setUserPreference] = useLocalStorage<'light' | 'dark' | 'auto'>('theme', 'auto')
    
    const effectiveTheme = userPreference === 'auto' ? systemScheme : userPreference
    
    return (
        <ThemeContext.Provider value={{ 
            theme: effectiveTheme, 
            userPreference,
            setUserPreference,
            systemScheme 
        }}>
            <div data-theme={effectiveTheme}>
                <App />
            </div>
        </ThemeContext.Provider>
    )
}
```

## How it works

- Queries `window.matchMedia('(prefers-color-scheme: dark)')` to detect initial preference
- Returns `'dark'` if the media query matches, otherwise `'light'`
- Sets up an event listener for changes to the color scheme preference
- Automatically updates when the user changes their system/browser theme
- Supports both modern (`addEventListener`) and legacy (`addListener`) APIs for maximum compatibility
- Cleans up event listener on unmount

## When to use

- Respecting user's system theme preference
- Auto-switching between light and dark themes
- Loading theme-appropriate resources (images, stylesheets)
- Providing seamless theme experience without manual toggle
- Analytics on user theme preferences
- Conditional rendering based on theme
- Initial theme detection for theme systems
- Combining with manual theme toggles (system as fallback)

## Notes

- Works in browser environments only (SSR-safe with `typeof window` check)
- Returns `'light'` as default in SSR or when `matchMedia` is not supported
- Detects system-level preference (OS setting) not just browser theme
- Changes are detected automatically - no polling required
- Works alongside CSS `prefers-color-scheme` media queries
- Consider combining with `useLocalStorage` for user overrides
- Initial value is available immediately (no flash of wrong theme)
- Does not automatically apply themes - returns preference only
- Use CSS variables or class names to apply actual theme styling
- On iOS/macOS, detects Light/Dark appearance setting
- On Windows 10/11, detects Light/Dark mode in Settings

## Browser support

All modern browsers supporting `prefers-color-scheme` media query:
- Chrome 76+
- Firefox 67+
- Safari 12.1+
- Edge 79+
- Opera 63+

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

- `url` (string | null): WebSocket URL to connect to (ws:// or wss://)
- `options` (UseWebSocketOptions, optional):
  - `protocols`: WebSocket sub-protocols
  - `autoConnect`: Automatically connect on mount (default: true)
  - `reconnect`: Enable automatic reconnection (default: false)
  - `reconnectAttempts`: Max reconnection attempts, 0 for infinite (default: 0)
  - `reconnectInterval`: Delay between reconnection attempts in ms (default: 3000)
  - `onOpen`: Callback when connection opens
  - `onClose`: Callback when connection closes
  - `onError`: Callback when error occurs
  - `onMessage`: Callback when message is received

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
            setData(prev => [...prev, parsed])
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
                {data.map((item, i) => <li key={i}>{JSON.stringify(item)}</li>)}
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
            onError: (error) => console.error('WebSocket error:', error)
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
    
    const { lastMessage } = useWebSocket('wss://api.example.com/notifications', {
        onMessage: (event) => {
            const notification = JSON.parse(event.data)
            toast.info(notification.message)
        }
    })
    
    useEffect(() => {
        if (lastMessage) {
            const notification = JSON.parse(lastMessage.data)
            setNotifications(prev => [notification, ...prev].slice(0, 10))
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
            }
        }
    )
    
    const [messages, setMessages] = useState([])
    const [typingUsers, setTypingUsers] = useState([])
    
    useEffect(() => {
        if (lastMessage) {
            const msg = JSON.parse(lastMessage.data)
            if (msg.type === 'message') {
                setMessages(prev => [...prev, msg])
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
            }
        }
    )
    
    useEffect(() => {
        if (lastMessage) {
            const update = JSON.parse(lastMessage.data)
            setPrices(prev => ({ ...prev, [update.symbol]: update.price }))
        }
    }, [lastMessage])
    
    return (
        <div>
            <div>Connection: {readyState}</div>
            {symbols.map(symbol => (
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
    
    const { sendJsonMessage, lastMessage, readyState, getWebSocket } = useWebSocket(
        'wss://game.example.com/room/123',
        {
            reconnect: true,
            reconnectInterval: 5000,
            onOpen: () => {
                sendJsonMessage({ type: 'join', player: playerId })
            },
            onClose: (event) => {
                if (!event.wasClean) {
                    toast.error('Connection lost. Reconnecting...')
                }
            }
        }
    )
    
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
            setMetrics(prev => [...prev.slice(-99), metric]) // Keep last 100
        }
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
            }
        }
    )
    
    useEffect(() => {
        if (lastMessage) {
            const msg = JSON.parse(lastMessage.data)
            if (msg.type === 'edit' && msg.user !== userId) {
                setContent(msg.content)
            } else if (msg.type === 'cursor') {
                setCursors(prev => ({ ...prev, [msg.user]: msg.position }))
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
        <Editor
            content={content}
            onChange={handleChange}
            cursors={cursors}
        />
    )
}
```

## How it works

- Creates WebSocket connection using native WebSocket API
- Tracks connection state (CONNECTING, OPEN, CLOSING, CLOSED)
- Stores the most recent message received
- Provides methods to send string or JSON messages
- Supports automatic reconnection with configurable attempts and intervals
- Allows manual connection control (connect/disconnect)
- Cleans up connection and timers on unmount
- Handles URL changes by reconnecting to new endpoint

## When to use

- Real-time chat applications
- Live data streams (stock prices, sports scores, etc.)
- Notifications and alerts
- Collaborative editing
- Multiplayer games
- IoT device monitoring
- Live dashboards and metrics
- Server-sent updates
- Bidirectional client-server communication
- Push notifications

## Notes

- URL can be null to defer connection
- Set `autoConnect: false` for manual connection control
- Reconnection is disabled by default - enable with `reconnect: true`
- `reconnectAttempts: 0` means infinite reconnection attempts
- Messages are not queued - sending while disconnected logs a warning
- `lastMessage` updates on every message, store in state if history is needed
- Use `sendJsonMessage` for automatic JSON serialization
- Access raw WebSocket with `getWebSocket()` for advanced use cases
- Reconnection resets after successful connection
- Manual `disconnect()` disables automatic reconnection
- Supports both `ws://` (insecure) and `wss://` (secure) protocols
- No automatic ping/pong - implement at application level if needed
- Consider message rate limiting to avoid overwhelming the connection

## Browser support

All modern browsers supporting WebSocket API:
- Chrome 16+
- Firefox 11+
- Safari 7+
- Edge (all versions)
- Opera 12.1+

## Tests

See `src/utility/hooks/__tests__/useWebSocket.test.tsx` for comprehensive tests covering connection lifecycle, message handling, automatic reconnection, manual control, error handling, cleanup, and URL changes.
