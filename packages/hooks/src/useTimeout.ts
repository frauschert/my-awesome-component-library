import { useEffect, useRef } from 'react'
import { useLatestRef } from './useLatestRef'

/**
 * A custom hook that manages a timeout with the ability to start, clear, and reset it.
 * The timeout does NOT start automatically - you must call `start()` or `reset()`.
 *
 * @param callback - The function to be called after the delay.
 * @param delay - The delay in milliseconds before the callback is executed.
 * @returns An object containing `start`, `clear`, `reset`, and `isActive` functions.
 */
export default function useTimeout(callback: () => void, delay: number) {
    const callbackRef = useLatestRef(callback)
    const timeoutRef = useRef<number | undefined>(undefined)

    const clear = () => {
        if (timeoutRef.current != null) {
            window.clearTimeout(timeoutRef.current)
            timeoutRef.current = undefined
        }
    }

    const start = () => {
        clear() // Clear any existing timeout
        timeoutRef.current = window.setTimeout(() => {
            timeoutRef.current = undefined
            callbackRef.current()
        }, delay)
    }

    const reset = () => {
        start()
    }

    const isActive = () => {
        return timeoutRef.current != null
    }

    // Cleanup on unmount
    useEffect(() => {
        return clear
    }, [])

    return { start, clear, reset, isActive }
}
