/**
 * Deep merges multiple objects into a new object.
 * Later objects take precedence over earlier ones.
 * Arrays are replaced, not merged.
 *
 * @param objects - The objects to merge
 * @returns A new deeply merged object
 *
 * @example
 * ```ts
 * mergeDeep({ a: 1, b: 2 }, { b: 3, c: 4 });
 * // { a: 1, b: 3, c: 4 }
 *
 * mergeDeep({ a: { x: 1, y: 2 } }, { a: { y: 3, z: 4 } });
 * // { a: { x: 1, y: 3, z: 4 } }
 *
 * mergeDeep({ arr: [1, 2] }, { arr: [3, 4] });
 * // { arr: [3, 4] } (arrays are replaced, not merged)
 *
 * mergeDeep({ a: 1 }, { b: 2 }, { c: 3 });
 * // { a: 1, b: 2, c: 3 }
 *
 * // Deep nested merge
 * mergeDeep(
 *     { user: { name: 'Alice', settings: { theme: 'dark' } } },
 *     { user: { age: 25, settings: { language: 'en' } } }
 * );
 * // { user: { name: 'Alice', age: 25, settings: { theme: 'dark', language: 'en' } } }
 *
 * // Null/undefined handling
 * mergeDeep({ a: 1 }, { a: null });
 * // { a: null } (null replaces the value)
 *
 * mergeDeep({ a: 1 }, { a: undefined });
 * // { a: undefined } (undefined replaces the value)
 * ```
 */
export function mergeDeep<
    T extends Record<string, unknown> = Record<string, unknown>
>(...objects: Array<Record<string, unknown> | null | undefined>): T {
    const result: Record<string, unknown> = {}

    for (const obj of objects) {
        if (obj == null) {
            continue
        }

        for (const key in obj) {
            if (!Object.prototype.hasOwnProperty.call(obj, key)) {
                continue
            }

            const value = obj[key]

            // If the value doesn't exist in result yet, just assign it
            if (!(key in result)) {
                result[key] = value
                continue
            }

            const existing = result[key]

            // If both are plain objects, merge recursively
            if (isPlainObject(existing) && isPlainObject(value)) {
                result[key] = mergeDeep(
                    existing as Record<string, unknown>,
                    value as Record<string, unknown>
                )
            } else {
                // Otherwise, replace (including arrays, primitives, null, undefined)
                result[key] = value
            }
        }
    }

    return result as T
}

/**
 * Checks if a value is a plain object (not an array, null, Date, etc.)
 */
function isPlainObject(value: unknown): boolean {
    if (typeof value !== 'object' || value === null) {
        return false
    }

    // Check if it's a plain object created with {} or new Object()
    // This excludes arrays, dates, regexes, etc.
    const proto = Object.getPrototypeOf(value)
    return proto === Object.prototype || proto === null
}

export default mergeDeep
