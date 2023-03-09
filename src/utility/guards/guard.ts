type Guard<T> = (x: unknown) => x is T
type PropertyGuards<A extends Record<string, unknown>> = {
    [K in keyof A]: Guard<A[K]>
}

export type TypeOf<T> = T extends Guard<infer U> ? U : never

export declare type EnumLike = {
    [k: string]: string | number
    [nu: number]: string
}

function assert<T, G extends Guard<T>>(
    val: unknown,
    guard: G
): asserts val is T {
    if (!guard(val)) throw new Error('')
}

const genericFetch = <T, G extends Guard<T>>(url: string, guard: G) => {
    return fetch(url)
        .then((res) => res.json())
        .then((result) => {
            assert<T, G>(result, guard)
            return result
        })
}

type Primitive = string | number | boolean | bigint

type UnionToIntersection<T> = (T extends any ? (x: T) => any : never) extends (
    x: infer R
) => any
    ? R
    : never

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

const isObject =
    <T extends Record<string, unknown>>(
        propertyGuards: PropertyGuards<T>
    ): Guard<T> =>
    (x: unknown): x is T =>
        typeof x == 'object' &&
        !isNull(x) &&
        Object.entries(propertyGuards).every(([key, value]) =>
            value((x as any)[key])
        )

const isRecord =
    <T>(guard: Guard<T>): Guard<Record<string, T>> =>
    (x: unknown): x is Record<string | number | symbol, T> =>
        typeof x == 'object' &&
        !isNull(x) &&
        Object.entries(x).every(([key, value]) => isString(key) && guard(value))

function isEnum<T extends EnumLike>(e: T): Guard<T[keyof T]> {
    const keys = Object.keys(e).filter((k) => {
        return !/^\d/.test(k)
    })
    const values = keys.map((k) => {
        return e[k]
    })
    return (x: unknown): x is T[keyof T] =>
        (or(isString, isNumber)(x) && values.includes(x)) ||
        (isString(x) && keys.includes(x))
}

const isLiteral =
    <T extends Primitive>(value: T): Guard<T> =>
    (x: unknown): x is T =>
        x === value

const isOneOf =
    <U extends string | number, T extends readonly [U, ...U[]]>(
        values: T
    ): Guard<T[number]> =>
    (x: unknown): x is T[number] =>
        values.some((v) => v === x)

const or = <T, U>(a: Guard<T>, b: Guard<U>) => isUnion([a, b])

const isUnion =
    <T extends readonly [Guard<unknown>, ...Guard<unknown>[]]>(
        guards: T
    ): Guard<TypeOf<T[number]>> =>
    (x: unknown): x is TypeOf<T[number]> =>
        guards.some((guard) => guard(x))

const and =
    <T, U>(a: Guard<T>, b: Guard<U>): Guard<T & U> =>
    (x: unknown): x is T & U =>
        a(x) && b(x)

const isIntersection =
    <T extends readonly [Guard<any>, ...Guard<any>[]]>(
        guards: T
    ): Guard<UnionToIntersection<TypeOf<T[number]>>> =>
    (x: unknown): x is UnionToIntersection<TypeOf<T[number]>> =>
        guards.every((guard) => guard(x))

const isOptional =
    <T>(guard: Guard<T>) =>
    (x: unknown): x is T | undefined =>
        x === undefined || guard(x)

export {
    isArrayOf,
    isObject,
    isNumber,
    isString,
    isBoolean,
    isEnum,
    isLiteral,
    isRecord,
    isOneOf,
    or,
    and,
    isUnion,
    isIntersection,
    isOptional,
}
