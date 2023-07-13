type Lens<A, B> = {
    get: (a: A) => B
    set: (a: A, b: B) => A
}

export function createLens<T, K extends keyof T>(
    get: (a: T) => T[K],
    set: (a: T, b: T[K]) => T
): Lens<T, T[K]> {
    return { get, set }
}

export function composeLens<TResult, T1, T2>(
    first: Lens<TResult, T1>,
    second: Lens<T1, T2>
): Lens<TResult, T2> {
    return {
        get: (a) => second.get(first.get(a)),
        set: (a, c) => first.set(a, second.set(first.get(a), c)),
    }
}
