type Guard<T> = (x: unknown) => x is T
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
    <A extends Record<string, unknown>>(
        propertyGuards: PropertyGuards<A>
    ): Guard<A> =>
    (x: unknown): x is A =>
        typeof x == 'object' &&
        !isNull(x) &&
        Object.entries(x).every(([key, value]) => propertyGuards[key](value))

export { isArrayOf, isType, isNumber, isString, isBoolean }
