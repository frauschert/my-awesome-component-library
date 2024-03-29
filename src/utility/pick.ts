/**
 * From `obj`, create a new object that only includes `keys`.
 *
 * @example
 * ```
 * pick({ a: 1, b: 2, c: 3 }, 'a', 'c') // { a: 1, c: 3 }
 * ```
 */
const pick = <T extends Record<PropertyKey, unknown>, K extends keyof T>(
    obj: T,
    ...keys: K[]
): Pick<T, K> =>
    Object.fromEntries(
        Object.entries(obj).filter(([k]) => keys.includes(k as K))
    ) as Pick<T, K>

export default pick
