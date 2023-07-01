/**
 * From `obj`, create a new object that does not include `keys`.
 *
 * @example
 * ```
 * omit({ a: 1, b: 2, c: 3 }, 'a', 'c') // { b: 2 }
 * ```
 */
const omit = <T extends Record<PropertyKey, unknown>, K extends keyof T>(
    obj: T,
    ...keys: K[]
): Omit<T, K> =>
    Object.fromEntries(
        Object.entries(obj).filter(([k]) => !keys.includes(k as K))
    ) as Omit<T, K>

export default omit
