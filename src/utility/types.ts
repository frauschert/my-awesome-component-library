export type Primitive = string | number | boolean | bigint
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>

type HexDigit =
    | '0'
    | '1'
    | '2'
    | '3'
    | '4'
    | '5'
    | '6'
    | '7'
    | '8'
    | '9'
    | 'a'
    | 'b'
    | 'c'
    | 'd'
    | 'e'
    | 'f'
    | 'A'
    | 'B'
    | 'C'
    | 'D'
    | 'E'
    | 'F'
export type HexColor<T extends string> =
    T extends `#${HexDigit}${HexDigit}${HexDigit}${infer Rest}`
        ? Rest extends ``
            ? T // three-digit hex color
            : Rest extends `${HexDigit}${HexDigit}${HexDigit}`
            ? T // six-digit hex color
            : never
        : never

export type Color = string & { __type: 'HexColor' }

export type Awaited<T> = T extends PromiseLike<infer U> ? U : T

export type Permutations<
    T extends string,
    U extends string = T
> = T extends unknown ? T | `${T} ${Permutations<Exclude<U, T>>}` : never
