type Lens<A, B> = {
    get: (a: A) => B
    set: (a: A, b: B) => A
}

export default function createLens<A, B>(
    get: (a: A) => B,
    set: (a: A, b: B) => A
): Lens<A, B> {
    return { get, set }
}

export function composeLens<A, B, C>(
    first: Lens<A, B>,
    second: Lens<B, C>
): Lens<A, C> {
    return {
        get: (a) => second.get(first.get(a)),
        set: (a, c) => first.set(a, second.set(first.get(a), c)),
    }
}
