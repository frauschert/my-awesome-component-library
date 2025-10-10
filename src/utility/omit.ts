/**
 * Creates a new object with the specified keys omitted from the source object.
 * This is the inverse of the pick function.
 *
 * @template T - The type of the source object
 * @template K - The keys to omit from the object
 *
 * @param obj - The source object to omit properties from
 * @param keys - The keys to exclude from the new object
 * @returns A new object without the specified keys
 *
 * @example
 * // Omit specific properties
 * omit({ a: 1, b: 2, c: 3 }, 'a', 'c');
 * // => { b: 2 }
 *
 * @example
 * // Omit single property
 * omit({ name: 'Alice', age: 30, city: 'NYC' }, 'age');
 * // => { name: 'Alice', city: 'NYC' }
 *
 * @example
 * // Omit with no keys returns copy of original
 * omit({ a: 1, b: 2 });
 * // => { a: 1, b: 2 }
 *
 * @example
 * // Useful for removing sensitive data
 * const user = { name: 'Alice', password: 'secret', email: 'alice@example.com' };
 * const publicUser = omit(user, 'password');
 * // => { name: 'Alice', email: 'alice@example.com' }
 */
const omit = <T extends Record<PropertyKey, unknown>, K extends keyof T>(
    obj: T,
    ...keys: K[]
): Omit<T, K> =>
    Object.fromEntries(
        Object.entries(obj).filter(([k]) => !keys.includes(k as K))
    ) as Omit<T, K>

export default omit
