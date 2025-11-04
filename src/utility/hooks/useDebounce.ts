import { useState, useEffect } from 'react'

/**
 * Debounces a value, delaying updates until after the specified delay.
 * Useful for search inputs, API calls, and other scenarios where you want to
 * wait for user input to stabilize before triggering an action.
 *
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds
 * @returns The debounced value
 *
 * @example
 * ```tsx
 * const [searchTerm, setSearchTerm] = useState('')
 * const debouncedSearchTerm = useDebounce(searchTerm, 500)
 *
 * useEffect(() => {
 *   if (debouncedSearchTerm) {
 *     searchAPI(debouncedSearchTerm)
 *   }
 * }, [debouncedSearchTerm])
 * ```
 */
export default function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value)

    useEffect(() => {
        // Set up the timeout
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        // Cleanup function that clears the timeout
        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])

    return debouncedValue
}
