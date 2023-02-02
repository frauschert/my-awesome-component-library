type Guard<T> = (x: unknown) => x is T
type PropertyGuards<A extends Record<string, unknown>> = {
    [K in keyof A]: Guard<A[K]>
}

export type TypeOf<T> = T extends Guard<infer U> ? U : never

export declare type EnumLike = {
    [k: string]: string | number
    [nu: number]: string
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

const isType =
    <T extends Record<string, unknown>>(
        propertyGuards: PropertyGuards<T>
    ): Guard<T> =>
    (x: unknown): x is T =>
        typeof x == 'object' &&
        !isNull(x) &&
        Object.entries(x).every(([key, value]) => propertyGuards[key](value))

const isRecord =
    <T>(guard: Guard<T>): Guard<Record<string, T>> =>
    (x: unknown): x is Record<string, T> =>
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
        values.includes(x as any) || (isString(x) && keys.includes(x))
}

const isLiteral =
    <T extends Primitive>(value: T): Guard<T> =>
    (x: unknown): x is T =>
        x === value

const oneOf =
    <U extends string | number, T extends readonly [U, ...U[]]>(
        values: T
    ): Guard<T[number]> =>
    (x: unknown): x is T[number] =>
        values.some((v) => v === x)

const or = <T, U>(a: Guard<T>, b: Guard<U>) => union([a, b])

const union =
    <T extends readonly [Guard<any>, ...Guard<any>[]]>(
        guards: T
    ): Guard<TypeOf<T[number]>> =>
    (x: unknown): x is TypeOf<T[number]> =>
        guards.some((guard) => guard(x))

const and =
    <T, U>(a: Guard<T>, b: Guard<U>): Guard<T & U> =>
    (x: unknown): x is T & U =>
        a(x) && b(x)

const intersection =
    <T extends readonly [Guard<any>, ...Guard<any>[]]>(
        guards: T
    ): Guard<UnionToIntersection<TypeOf<T[number]>>> =>
    (x: unknown): x is UnionToIntersection<TypeOf<T[number]>> =>
        guards.every((guard) => guard(x))

export {
    isArrayOf,
    isType,
    isNumber,
    isString,
    isBoolean,
    isEnum,
    isLiteral,
    isRecord,
    oneOf,
    or,
    and,
    union,
    intersection,
}
