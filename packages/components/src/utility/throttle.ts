/**
 * Creates a throttled version of a function that only executes at most once per specified interval.
 * The first call executes immediately, subsequent calls within the interval are ignored.
 * A trailing call can be scheduled to execute after the interval if calls were made during throttle period.
 *
 * @template Args - Tuple type of function arguments
 * @template Result - Return type of the function
 * @param fn - The function to throttle
 * @param wait - Milliseconds to wait between executions
 * @param options - Configuration options
 * @param options.leading - Execute on the leading edge (default: true)
 * @param options.trailing - Execute on the trailing edge (default: false)
 * @returns A throttled version of the function with cancel method
 *
 * @example
 * ```ts
 * const handleScroll = throttle(() => {
 *   console.log('Scroll handler');
 * }, 1000);
 *
 * window.addEventListener('scroll', handleScroll);
 *
 * // Cancel pending trailing execution
 * handleScroll.cancel();
 * ```
 *
 * @example
 * ```ts
 * // With trailing execution
 * const saveData = throttle((data: string) => {
 *   api.save(data);
 * }, 2000, { trailing: true });
 *
 * // Called rapidly - first executes immediately, last executes after 2s
 * saveData('1');
 * saveData('2');
 * saveData('3');
 * ```
 */
export function throttle<Args extends readonly unknown[], Result>(
    fn: (...args: Args) => Result,
    wait: number,
    options: { leading?: boolean; trailing?: boolean } = {}
): ((...args: Args) => Result | undefined) & { cancel: () => void } {
    const { leading = true, trailing = false } = options

    let lastExecuteTime = 0
    let timeoutId: ReturnType<typeof setTimeout> | null = null
    let lastArgs: Args | null = null
    let lastResult: Result | undefined

    const throttled = (...args: Args): Result | undefined => {
        const now = Date.now()
        const timeSinceLastExecute = now - lastExecuteTime

        // Store arguments for potential trailing call
        lastArgs = args

        // Clear any pending trailing execution
        if (timeoutId !== null) {
            clearTimeout(timeoutId)
            timeoutId = null
        }

        // Execute immediately if leading and enough time has passed
        if (
            leading &&
            (lastExecuteTime === 0 || timeSinceLastExecute >= wait)
        ) {
            lastExecuteTime = now
            lastArgs = null // Consumed
            lastResult = fn(...args)
            return lastResult
        }

        // Schedule trailing execution if enabled and not already scheduled
        if (trailing && lastArgs !== null) {
            const remainingWait = wait - timeSinceLastExecute
            timeoutId = setTimeout(
                () => {
                    lastExecuteTime = Date.now()
                    timeoutId = null
                    if (lastArgs !== null) {
                        lastResult = fn(...lastArgs)
                        lastArgs = null
                    }
                },
                remainingWait > 0 ? remainingWait : wait
            )
        }

        return lastResult
    }

    throttled.cancel = () => {
        if (timeoutId !== null) {
            clearTimeout(timeoutId)
            timeoutId = null
        }
        lastArgs = null
        lastExecuteTime = 0
    }

    return throttled
}

export default throttle
