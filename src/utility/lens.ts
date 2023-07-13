/**
 * Represents a Lens, which provides a way to get and set a specific property within an object.
 *
 * @template A The type of the source object.
 * @template B The type of the property value.
 */
type Lens<A, B> = {
    /**
     * Gets the property value from the source object.
     *
     * @param a The source object.
     * @returns The property value.
     */
    get: (a: A) => B

    /**
     * Sets the property value in the source object and returns the updated object.
     *
     * @param a The source object.
     * @param b The new property value.
     * @returns The updated source object.
     */
    set: (a: A, b: B) => A
}

/**
 * Creates a Lens for a specific property of an object.
 *
 * @template T The type of the source object.
 * @template K The key of the property to focus on.
 * @param {(a: T) => T[K]} get The getter function that retrieves the property value from the source object.
 * @param {(a: T, b: T[K]) => T} set The setter function that sets the property value in the source object.
 * @returns {Lens<T, T[K]>} The created Lens.
 */
export function createLens<T, K extends keyof T>(
    get: (a: T) => T[K],
    set: (a: T, b: T[K]) => T
): Lens<T, T[K]> {
    return { get, set }
}

/**
 * Composes two lenses to create a new Lens that focuses on a property deeper within the object hierarchy.
 *
 * @template T1 The type of the intermediate object.
 * @template T2 The type of the target property value.
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
