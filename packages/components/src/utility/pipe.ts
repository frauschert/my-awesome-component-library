/**
 * Performs left-to-right function composition.
 * The first function can accept any number of arguments, while subsequent functions
 * must accept a single argument (the result of the previous function).
 *
 * This is the opposite of `compose`, which works right-to-left.
 * `pipe` is often more intuitive to read as it follows the natural order of execution.
 *
 * @param fns - Functions to compose, executed from left to right
 * @returns A function that pipes its input through all provided functions
 *
 * @example
 * ```ts
 * const addOne = (x: number) => x + 1;
 * const double = (x: number) => x * 2;
 * const square = (x: number) => x * x;
 *
 * const transform = pipe(addOne, double, square);
 * transform(3); // ((3 + 1) * 2) ^ 2 = 64
 *
 * // More readable than nested calls:
 * // square(double(addOne(3)))
 * ```
 *
 * @example
 * ```ts
 * // String processing pipeline
 * const process = pipe(
 *   (s: string) => s.trim(),
 *   (s) => s.toLowerCase(),
 *   (s) => s.replace(/\s+/g, '-')
 * );
 * process('  Hello World  '); // 'hello-world'
 * ```
 *
 * @example
 * ```ts
 * // Data transformation pipeline
 * const users = [
 *   { name: 'Alice', age: 30 },
 *   { name: 'Bob', age: 25 },
 * ];
 *
 * const getAdultNames = pipe(
 *   (users: typeof users) => users.filter(u => u.age >= 18),
 *   (users) => users.map(u => u.name),
 *   (names) => names.sort()
 * );
 * getAdultNames(users); // ['Alice', 'Bob']
 * ```
 */
export function pipe<A extends readonly unknown[], B>(
    f1: (...args: A) => B
): (...args: A) => B

export function pipe<A extends readonly unknown[], B, C>(
    f1: (...args: A) => B,
    f2: (x: B) => C
): (...args: A) => C

export function pipe<A extends readonly unknown[], B, C, D>(
    f1: (...args: A) => B,
    f2: (x: B) => C,
    f3: (x: C) => D
): (...args: A) => D

export function pipe<A extends readonly unknown[], B, C, D, E>(
    f1: (...args: A) => B,
    f2: (x: B) => C,
    f3: (x: C) => D,
    f4: (x: D) => E
): (...args: A) => E

export function pipe<A extends readonly unknown[], B, C, D, E, F>(
    f1: (...args: A) => B,
    f2: (x: B) => C,
    f3: (x: C) => D,
    f4: (x: D) => E,
    f5: (x: E) => F
): (...args: A) => F

export function pipe<A extends readonly unknown[], B, C, D, E, F, G>(
    f1: (...args: A) => B,
    f2: (x: B) => C,
    f3: (x: C) => D,
    f4: (x: D) => E,
    f5: (x: E) => F,
    f6: (x: F) => G
): (...args: A) => G

export function pipe<A extends readonly unknown[], B, C, D, E, F, G, H>(
    f1: (...args: A) => B,
    f2: (x: B) => C,
    f3: (x: C) => D,
    f4: (x: D) => E,
    f5: (x: E) => F,
    f6: (x: F) => G,
    f7: (x: G) => H
): (...args: A) => H

export function pipe<A extends readonly unknown[], B, C, D, E, F, G, H, I>(
    f1: (...args: A) => B,
    f2: (x: B) => C,
    f3: (x: C) => D,
    f4: (x: D) => E,
    f5: (x: E) => F,
    f6: (x: F) => G,
    f7: (x: G) => H,
    f8: (x: H) => I
): (...args: A) => I

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function pipe(...fns: Array<(x: any) => any>): (...args: any[]) => any {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (...args: any[]) => {
        if (fns.length === 0) {
            return args[0]
        }

        // @ts-expect-error - Generic args cannot be spread typed
        let result = fns[0](...args)

        for (let i = 1; i < fns.length; i++) {
            result = fns[i](result)
        }

        return result
    }
}

export default pipe
