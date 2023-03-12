type Guard<T> = (x: unknown) => x is T
type Assert<T> = (x: unknown) => asserts x is T
type ParseSuccess<T> = { success: true; data: T }
type ParseError = { success: false; error: Error }
type ParseResult<T> = ParseSuccess<T> | ParseError
type Parser<T> = {
    parse: (x: unknown) => ParseResult<T>
}
type ParserFactory<T> = () => Parser<T>

type PropertyGuards<A extends Record<string, unknown>> = {
    [K in keyof A]: Guard<A[K]>
}

export type TypeOf<T> = T extends Guard<infer U> ? U : never

export declare type EnumLike = {
    [k: string]: string | number
    [nu: number]: string
}

function parseSuccess<T>(arg: T): ParseResult<T> {
    return {
        success: true,
        data: arg,
    }
}

function parseError(val: unknown, typeName: string): ParseError {
    return {
        success: false,
        error: new Error(`\`${val}\` is not a ${typeName}`),
    }
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

const isnt = (val: unknown, typeName: string) =>
    new Error(`\`${val}\` is not a ${typeName}`)

const isArrayOf =
    <A>(itemGuard: Guard<A>): Guard<A[]> =>
    (x: unknown): x is A[] =>
        Array.isArray(x) && x.every(itemGuard)

const isString: Guard<string> = (x: unknown): x is string =>
    typeof x == 'string'

function assertString(x: unknown): asserts x is string {
    if (!isString(x)) throw isnt(x, 'string')
}

const parseFn =
    <T>(guard: Guard<T>, typeName: string) =>
    (x: unknown) =>
        guard(x) ? parseSuccess(x) : parseError(x, typeName)

const createParser = <T>(guard: Guard<T>, typeName: string): Parser<T> => ({
    parse: parseFn(guard, typeName),
})

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

type Infer<T extends Parser<unknown>> = T extends Parser<infer U> ? U : never

function objectParser<S extends Record<string, Parser<T>>, T = unknown>(
    schema: S
): Parser<{
    [K in keyof S]: Infer<S[K]>
}> {
    return {
        parse: (x: unknown) => {
            if (!x) return parseError(x, 'object')
            if (typeof x !== 'object') return parseError(x, 'object')
            if (Array.isArray(x)) return parseError(x, 'object')
            return Object.keys(schema)
                .filter((k) => k in x)
                .map((k) => schema[k].parse((x as any)[k]))
                .every((res) => res.success)
                ? parseSuccess(
                      x as {
                          [K in keyof S]: Infer<S[K]>
                      }
                  )
                : parseError(x, 'object')
        },
    }
}

const p = {
    string: () => createParser(isString, 'string'),
    number: () => createParser(isNumber, 'number'),
    boolean: () => createParser(isBoolean, 'boolean'),
    literal: <T extends Primitive>(val: T) =>
        createParser(isLiteral(val), 'literal'),
    isOneOf: <U extends string | number, T extends readonly [U, ...U[]]>(
        val: T
    ) => createParser(isOneOf(val), 'oneof'),
    object: objectParser,
}

const parser = p.object({
    name: p.string(),
    age: p.number(),
    role: p.isOneOf(['admin', 'user']),
})

parser.parse({ name: 'John Doe', age: 25 })

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
