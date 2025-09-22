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
