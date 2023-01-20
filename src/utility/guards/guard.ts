type Guard<T = any> = (x: unknown) => x is T
type PropertyGuards<A extends Record<string, unknown>> = {
    [K in keyof A]: Guard<A[K]>
}

const isArrayOf =
    <A>(itemGuard: Guard<A>): Guard<A[]> =>
    (x: unknown): x is A[] =>
        Array.isArray(x) && x.every(itemGuard)

const isString: Guard<string> = (x: unknown): x is string =>
    typeof x == 'string'
const isNumber: Guard<number> = (x: unknown): x is number =>
    typeof x == 'number'
const isBoolean: Guard<boolean> = (x: unknown): x is boolean =>
    typeof x == 'boolean'
const isNull: Guard<null> = (x: unknown): x is null => x == null

const isType =
    <T extends Record<string, unknown>>(
        propertyGuards: PropertyGuards<T>
    ): Guard<T> =>
    (x: unknown): x is T =>
        typeof x == 'object' &&
        !isNull(x) &&
        Object.entries(x).every(([key, value]) => propertyGuards[key](value))

function isEnum<T extends Record<string, unknown>>(e: T): Guard<T[keyof T]> {
    const keys = Object.keys(e).filter((k) => {
        return !/^\d/.test(k)
    })
    const values = keys.map((k) => {
        return e[k]
    })
    return (x: unknown): x is T[keyof T] =>
        values.includes(x) || (isString(x) && keys.includes(x))
}

const or =
    <T, U>(a: Guard<T>, b: Guard<U>): Guard<T | U> =>
    (x: unknown): x is T | U =>
        a(x) || b(x)

const and =
    <T, U>(a: Guard<T>, b: Guard<U>): Guard<T & U> =>
    (x: unknown): x is T & U =>
        a(x) && b(x)

export { isArrayOf, isType, isNumber, isString, isBoolean, isEnum, or, and }
