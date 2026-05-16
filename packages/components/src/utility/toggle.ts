/**
 * Creates a toggle function that alternates between two values.
 * Each call returns the next value in the sequence.
 *
 * @param a - The first value
 * @param b - The second value
 * @returns A function that toggles between the two values
 *
 * @example
 * const toggleTheme = toggle('light', 'dark');
 * toggleTheme(); // 'light'
 * toggleTheme(); // 'dark'
 * toggleTheme(); // 'light'
 *
 * @example
 * const toggleState = toggle(true, false);
 * toggleState(); // true
 * toggleState(); // false
 */
export function toggle<A, B>(a: A, b: B): () => A | B {
    let current = false

    return () => {
        const value = current ? b : a
        current = !current
        return value
    }
}
