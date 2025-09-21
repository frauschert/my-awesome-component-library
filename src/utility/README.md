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
