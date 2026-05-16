/**
 * Represents a Lens, which provides a way to get and set a specific property within an object immutably.
 *
 * @template A The type of the source object.
 * @template B The type of the property value.
 */
export type Lens<A, B> = {
    /**
     * Gets the property value from the source object.
     *
     * @param a The source object.
     * @returns The property value.
     */
    get: (a: A) => B

    /**
     * Sets the property value in the source object and returns a new updated object.
     *
     * @param a The source object.
     * @param b The new property value.
     * @returns A new source object with the updated value.
     */
    set: (a: A, b: B) => A
}

/**
 * Creates a Lens for a specific property of an object.
 *
 * @template T The type of the source object.
 * @template K The key of the property to focus on.
 * @param {(a: T) => T[K]} get The getter function that retrieves the property value from the source object.
 * @param {(a: T, b: T[K]) => T} set The setter function that sets the property value in the source object immutably.
 * @returns {Lens<T, T[K]>} The created Lens.
 */
export function createLens<T, K extends keyof T>(
    get: (a: T) => T[K],
    set: (a: T, b: T[K]) => T
): Lens<T, T[K]> {
    return { get, set }
}

/**
 * Creates a Lens for a specific property key of an object.
 * Automatically creates getter and setter that work immutably.
 *
 * @template T The type of the source object.
 * @template K The key of the property to focus on.
 * @param {K} key The property key.
 * @returns {Lens<T, T[K]>} A Lens focused on the specified property.
 *
 * @example
 * const nameLens = prop<Person>('name')
 * const person = { name: 'Alice', age: 30 }
 * const name = view(nameLens, person) // 'Alice'
 * const updated = set(nameLens, person, 'Bob') // { name: 'Bob', age: 30 }
 */
export function prop<T, K extends keyof T>(key: K): Lens<T, T[K]> {
    return {
        get: (obj) => obj[key],
        set: (obj, value) => ({ ...obj, [key]: value }),
    }
}

/**
 * Creates a Lens for a specific index in an array.
 * Works immutably by creating new arrays.
 *
 * @template T The type of array elements.
 * @param {number} idx The array index.
 * @returns {Lens<T[], T | undefined>} A Lens focused on the specified index.
 *
 * @example
 * const firstLens = index<number>(0)
 * const arr = [1, 2, 3]
 * const first = view(firstLens, arr) // 1
 * const updated = set(firstLens, arr, 10) // [10, 2, 3]
 */
export function index<T>(idx: number): Lens<T[], T | undefined> {
    return {
        get: (arr) => arr[idx],
        set: (arr, value) => {
            const newArr = [...arr]
            if (value !== undefined) {
                newArr[idx] = value
            }
            return newArr
        },
    }
}

/**
 * Creates a Lens for a nested path in an object.
 *
 * @template T The type of the source object.
 * @template K1 First level key.
 * @param {K1} key1 First property key.
 * @returns {Lens<T, T[K1]>} A Lens focused on the nested path.
 */
export function path<T, K1 extends keyof T>(key1: K1): Lens<T, T[K1]>
/**
 * Creates a Lens for a nested path in an object.
 *
 * @template T The type of the source object.
 * @template K1 First level key.
 * @template K2 Second level key.
 * @param {K1} key1 First property key.
 * @param {K2} key2 Second property key.
 * @returns {Lens<T, T[K1][K2]>} A Lens focused on the nested path.
 */
export function path<T, K1 extends keyof T, K2 extends keyof T[K1]>(
    key1: K1,
    key2: K2
): Lens<T, T[K1][K2]>
/**
 * Creates a Lens for a nested path in an object.
 *
 * @template T The type of the source object.
 * @template K1 First level key.
 * @template K2 Second level key.
 * @template K3 Third level key.
 * @param {K1} key1 First property key.
 * @param {K2} key2 Second property key.
 * @param {K3} key3 Third property key.
 * @returns {Lens<T, T[K1][K2][K3]>} A Lens focused on the nested path.
 */
export function path<
    T,
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2]
>(key1: K1, key2: K2, key3: K3): Lens<T, T[K1][K2][K3]>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function path<T>(...keys: (keyof any)[]): Lens<T, any> {
    if (keys.length === 0) {
        throw new Error('path requires at least one key')
    }

    if (keys.length === 1) {
        return prop(keys[0] as keyof T)
    }

    // Build the lens by composing prop lenses, starting from the first key
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result: Lens<any, any> = prop(keys[0] as keyof T)

    for (let i = 1; i < keys.length; i++) {
        const nextProp = createLens(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (obj: any) => obj?.[keys[i]],
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (obj: any, value: any) => (obj ? { ...obj, [keys[i]]: value } : obj)
        )
        result = composeLens(result, nextProp)
    }

    return result
}

/**
 * Composes two lenses to create a new Lens that focuses on a property deeper within the object hierarchy.
 *
 * @template T1 The type of the source object.
 * @template T2 The type of the intermediate property value.
 * @template T3 The type of the final property value.
 * @param {Lens<T1, T2>} first The first Lens that focuses on the intermediate property.
 * @param {Lens<T2, T3>} second The second Lens that focuses on the final property.
 * @returns {Lens<T1, T3>} The composed Lens.
 */
export function composeLens<T1, T2, T3>(
    first: Lens<T1, T2>,
    second: Lens<T2, T3>
): Lens<T1, T3> {
    return {
        /**
         * Gets the property value from the source object by applying both lenses in sequence.
         *
         * @param a The source object.
         * @returns The property value.
         */
        get: (a) => second.get(first.get(a)),

        /**
         * Sets the property value in the source object by applying both lenses in sequence.
         *
         * @param a The source object.
         * @param c The new property value.
         * @returns The updated source object.
         */
        set: (a, c) => first.set(a, second.set(first.get(a), c)),
    }
}

/**
 * Views (gets) a value through a lens.
 *
 * @template A The type of the source object.
 * @template B The type of the property value.
 * @param {Lens<A, B>} lens The lens to use.
 * @param {A} obj The source object.
 * @returns {B} The property value.
 *
 * @example
 * const nameLens = prop<Person>('name')
 * const person = { name: 'Alice', age: 30 }
 * const name = view(nameLens, person) // 'Alice'
 */
export function view<A, B>(lens: Lens<A, B>, obj: A): B {
    return lens.get(obj)
}

/**
 * Sets a value through a lens immutably.
 *
 * @template A The type of the source object.
 * @template B The type of the property value.
 * @param {Lens<A, B>} lens The lens to use.
 * @param {A} obj The source object.
 * @param {B} value The new value.
 * @returns {A} A new object with the updated value.
 *
 * @example
 * const nameLens = prop<Person>('name')
 * const person = { name: 'Alice', age: 30 }
 * const updated = set(nameLens, person, 'Bob') // { name: 'Bob', age: 30 }
 */
export function set<A, B>(lens: Lens<A, B>, obj: A, value: B): A {
    return lens.set(obj, value)
}

/**
 * Modifies a value through a lens using a transformation function.
 *
 * @template A The type of the source object.
 * @template B The type of the property value.
 * @param {Lens<A, B>} lens The lens to use.
 * @param {A} obj The source object.
 * @param {(value: B) => B} fn The transformation function.
 * @returns {A} A new object with the modified value.
 *
 * @example
 * const ageLens = prop<Person>('age')
 * const person = { name: 'Alice', age: 30 }
 * const older = over(ageLens, person, age => age + 1) // { name: 'Alice', age: 31 }
 */
export function over<A, B>(lens: Lens<A, B>, obj: A, fn: (value: B) => B): A {
    return lens.set(obj, fn(lens.get(obj)))
}

export default {
    createLens,
    prop,
    index,
    path,
    composeLens,
    view,
    set,
    over,
}
