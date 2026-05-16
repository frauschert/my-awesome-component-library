import { useState, useCallback } from 'react'

export interface UseStackActions<T> {
    push: (item: T) => void
    pop: () => T | undefined
    peek: () => T | undefined
    clear: () => void
    remove: (predicate: (item: T) => boolean) => void
    toArray: () => T[]
}

export interface UseStackReturn<T> extends UseStackActions<T> {
    stack: T[]
    size: number
    isEmpty: boolean
    isFull: boolean
}

/**
 * Hook for managing a LIFO (Last-In-First-Out) stack data structure.
 * Provides methods for push, pop, peek, and other stack operations.
 *
 * @param initialStack - Initial stack items
 * @param maxSize - Maximum stack size (optional, unlimited if not specified)
 * @returns Stack state and operations
 *
 * @example
 * ```tsx
 * const { stack, push, pop, peek, size, isEmpty } = useStack<string>()
 *
 * push('first')
 * push('second')
 * console.log(peek()) // 'second'
 * console.log(pop()) // 'second'
 * console.log(size) // 1
 * ```
 */
export default function useStack<T>(
    initialStack: T[] = [],
    maxSize?: number
): UseStackReturn<T> {
    const [stack, setStack] = useState<T[]>(initialStack)

    // Push: Add item to the top of the stack
    const push = useCallback(
        (item: T) => {
            setStack((prev) => {
                // Check max size constraint
                if (maxSize !== undefined && prev.length >= maxSize) {
                    console.warn(`Stack is full (max size: ${maxSize})`)
                    return prev
                }
                return [...prev, item]
            })
        },
        [maxSize]
    )

    // Pop: Remove and return the top item from the stack
    const pop = useCallback((): T | undefined => {
        const currentStack = stack

        if (currentStack.length === 0) {
            return undefined
        }

        const removed = currentStack[currentStack.length - 1]
        setStack(currentStack.slice(0, -1))

        return removed
    }, [stack])

    // Peek: Return the top item without removing it
    const peek = useCallback((): T | undefined => {
        return stack[stack.length - 1]
    }, [stack])

    // Clear: Remove all items from the stack
    const clear = useCallback(() => {
        setStack([])
    }, [])

    // Remove: Remove items matching a predicate
    const remove = useCallback((predicate: (item: T) => boolean) => {
        setStack((prev) => prev.filter((item) => !predicate(item)))
    }, [])

    // ToArray: Return a copy of the stack as an array
    const toArray = useCallback((): T[] => {
        return [...stack]
    }, [stack])

    // Computed properties
    const size = stack.length
    const isEmpty = stack.length === 0
    const isFull = maxSize !== undefined && stack.length >= maxSize

    return {
        stack,
        size,
        isEmpty,
        isFull,
        push,
        pop,
        peek,
        clear,
        remove,
        toArray,
    }
}
