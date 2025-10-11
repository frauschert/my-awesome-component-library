/**
 * Creates a new object with the same keys as the input object, but with values
 * transformed by the provided mapper function.
 *
 * @param obj - The object to map over
 * @param mapper - Function that transforms each value. Receives (value, key, object)
 * @returns A new object with transformed values
 *
 * @example
 * ```ts
 * mapValues({ a: 1, b: 2, c: 3 }, (v) => v * 2);
 * // { a: 2, b: 4, c: 6 }
 *
 * mapValues({ name: 'john', age: '30' }, (v) => String(v).toUpperCase());
 * // { name: 'JOHN', age: '30' }
 *
 * mapValues({ a: 1, b: 2 }, (v, key) => `${key}:${v}`);
 * // { a: 'a:1', b: 'b:2' }
 *
 * // Type-safe transformations
 * const user = { name: 'Alice', age: 25 };
 * const lengths = mapValues(user, (v) => String(v).length);
 * // { name: 5, age: 2 }
 *
 * // Works with nested objects
 * const config = { api: '/api', timeout: 5000 };
 * const withDefaults = mapValues(config, (v) => v || 'default');
 * // { api: '/api', timeout: 5000 }
 * ```
 */
export function mapValues<T extends Record<string, unknown>, U>(
    obj: T,
    mapper: (value: T[keyof T], key: keyof T, object: T) => U
): Record<keyof T, U> {
    const result = {} as Record<keyof T, U>

    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            result[key] = mapper(obj[key], key, obj)
        }
    }

    return result
}

export default mapValues
