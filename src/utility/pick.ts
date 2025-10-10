/**
 * Creates a new object with only the specified keys picked from the source object.
 *
 * @template T - The type of the source object
 * @template K - The keys to pick from the object
 *
 * @param obj - The source object to pick properties from
 * @param keys - The keys to include in the new object
 * @returns A new object containing only the specified keys
 *
 * @example
 * // Pick specific properties
 * pick({ a: 1, b: 2, c: 3 }, 'a', 'c');
 * // => { a: 1, c: 3 }
 *
 * @example
 * // Pick single property
 * pick({ name: 'Alice', age: 30, city: 'NYC' }, 'name');
 * // => { name: 'Alice' }
 *
 * @example
 * // Pick with no keys returns empty object
 * pick({ a: 1, b: 2 });
 * // => {}
 *
 * @example
 * // Non-existent keys are ignored
 * pick({ a: 1, b: 2 }, 'a', 'x' as any);
 * // => { a: 1 }
 */
const pick = <T extends Record<PropertyKey, unknown>, K extends keyof T>(
    obj: T,
    ...keys: K[]
): Pick<T, K> => {
    const result = {} as Pick<T, K>
    for (const key of keys) {
        if (key in obj) {
            result[key] = obj[key]
        }
    }
    return result
}

export default pick
