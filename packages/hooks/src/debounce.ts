/**
 * Creates a debounced function that delays invoking callback until after delay milliseconds
 * have elapsed since the last time the debounced function was invoked.
 *
 * @template T - The type of the function to debounce
 * @param callback - The function to debounce
 * @param delay - The number of milliseconds to delay (default: 500)
 * @returns A debounced version of the callback with cancel and flush methods
 *
 * @example
 * // Basic usage
 * const saveData = debounce((data: string) => {
 *   console.log('Saving:', data);
 * }, 1000);
 *
 * saveData('hello');  // Will not execute immediately
 * saveData('world');  // Cancels previous call
 * // After 1 second: logs "Saving: world"
 *
 * @example
 * // With cancel
 * const debouncedFn = debounce(() => console.log('Executed'), 1000);
 * debouncedFn();
 * debouncedFn.cancel(); // Cancels the pending execution
 *
 * @example
 * // With flush
 * const debouncedFn = debounce(() => console.log('Executed'), 1000);
 * debouncedFn();
 * debouncedFn.flush(); // Executes immediately instead of waiting
 */
export default function debounce<T extends (...args: never[]) => unknown>(
    callback: T,
    delay: number = 500
): ((...args: Parameters<T>) => void) & {
    cancel: () => void
    flush: () => void
} {
    let timer: ReturnType<typeof setTimeout> | undefined
    let lastArgs: Parameters<T> | undefined

    const debounced = (...args: Parameters<T>) => {
        lastArgs = args
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
            callback(...args)
            timer = undefined
            lastArgs = undefined
        }, delay)
    }

    debounced.cancel = () => {
        if (timer) {
            clearTimeout(timer)
            timer = undefined
            lastArgs = undefined
        }
    }

    debounced.flush = () => {
        if (timer && lastArgs) {
            clearTimeout(timer)
            callback(...lastArgs)
            timer = undefined
            lastArgs = undefined
        }
    }

    return debounced
}
