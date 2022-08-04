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

const isType =
    <A extends Record<string, unknown>>(
        propertyGuards: PropertyGuards<A>
    ): Guard<A> =>
    (x: unknown): x is A =>
        typeof x == 'object' &&
        x !== null &&
        Object.entries(x).every((val) => propertyGuards[val[0]](val[1]))

export { isArrayOf, isType, isNumber, isString }
