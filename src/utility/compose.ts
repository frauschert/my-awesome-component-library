/* eslint-disable @typescript-eslint/no-explicit-any */
export function compose<TIn, T1>(func: (input: TIn) => T1): (input: TIn) => T1

export function compose<TIn, T1, T2>(
    func: (input: TIn) => T1,
    func2: (input: T1) => T2
): (input: TIn) => T2

export function compose<TIn, T1, T2, T3>(
    func: (input: TIn) => T1,
    func2: (input: T1) => T2,
    func3: (input: T2) => T3
): (input: TIn) => T3

export function compose<TIn, T1, T2, T3, T4>(
    func: (input: TIn) => T1,
    func2: (input: T1) => T2,
    func3: (input: T2) => T3,
    func4: (input: T3) => T4
): (input: TIn) => T4

export function compose<TIn, T1, T2, T3, T4, T5>(
    func: (input: TIn) => T1,
    func2: (input: T1) => T2,
    func3: (input: T2) => T3,
    func4: (input: T3) => T4,
    func5: (input: T4) => T5
): (input: TIn) => T5

export function compose(...args: any[]) {
    return (x: any) => args.reduce((acc, curr) => curr(acc), x)
}
