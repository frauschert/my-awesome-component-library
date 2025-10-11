/**
 * Creates a promise that resolves after a specified delay.
 * Optionally resolves with a provided value.
 *
 * @param ms - The delay in milliseconds
 * @param value - Optional value to resolve with
 * @returns A promise that resolves after the delay
 *
 * @example
 * ```ts
 * await delay(1000);
 * // Waits 1 second
 *
 * const result = await delay(500, 'done');
 * // result === 'done' (after 500ms)
 *
 * // Chain with other async operations
 * await delay(1000);
 * console.log('Executed after 1 second');
 *
 * // Use in async functions
 * async function fetchWithDelay() {
 *     await delay(2000);
 *     return fetch('/api/data');
 * }
 *
 * // Simulate loading states
 * setLoading(true);
 * await delay(500);
 * setLoading(false);
 *
 * // Add delays between operations
 * for (const item of items) {
 *     await processItem(item);
 *     await delay(100); // 100ms pause between items
 * }
 *
 * // Debounce in tests
 * await delay(0); // Next tick
 *
 * // Return values
 * const data = await delay(1000, { status: 'ready' });
 * // data === { status: 'ready' }
 * ```
 */
export function delay<T = void>(ms: number, value?: T): Promise<T> {
    if (!Number.isFinite(ms)) {
        throw new Error('delay: ms must be a finite number')
    }

    if (ms < 0) {
        throw new Error('delay: ms must be non-negative')
    }

    return new Promise<T>((resolve) => {
        setTimeout(() => {
            resolve(value as T)
        }, ms)
    })
}

export default delay
