/* eslint-disable @typescript-eslint/no-explicit-any */
type Curried<A extends unknown[], R> = <P extends unknown[]>(
    ...args: P & (A extends [...P, ...unknown[]] ? P : never)
) => A extends [...P, ...infer S] ? (S extends [] ? R : Curried<S, R>) : never

/**
 * Curry a fixed-arity function.
 *
 * Behavior
 * - Allows supplying arguments over multiple calls until the original function’s arity (fn.length) is met.
 * - Supports providing multiple arguments per step: curry(f)(a)(b, c) === curry(f)(a, b)(c).
 * - Extra arguments beyond the original arity are forwarded to the function (ignored by typical JS functions).
 * - Preserves `this` across partial applications.
 *
 * Limitations
 * - Uses fn.length to determine completion. Functions with default parameters or rest parameters have length 0,
 *   so the curried function will execute immediately on the first invocation (even with no args). Example:
 *   const f = (a = 1, b = 2) => a + b; curry(f)() === 3, curry(f)(5) === 7.
 * - Placeholders are not supported.
 *
 * Examples
 * const add3 = (a: number, b: number, c: number) => a + b + c
 * curry(add3)(1)(2)(3)            // 6
 * curry(add3)(1, 2)(3)            // 6
 * curry(add3)(1)(2, 3)            // 6
 */
function curry<A extends unknown[], R>(fn: (...args: A) => R): Curried<A, R> {
    function curried(this: any, ...args: unknown[]): unknown {
        if (args.length >= fn.length) {
            return fn.apply(this, args as A)
        }
        return (...next: unknown[]) => curried.apply(this, [...args, ...next])
    }
    return curried as any
}

export default curry
