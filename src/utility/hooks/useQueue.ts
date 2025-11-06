import { useState, useCallback } from 'react'

export interface UseQueueActions<T> {
    enqueue: (item: T) => void
    dequeue: () => T | undefined
    peek: () => T | undefined
    clear: () => void
    remove: (predicate: (item: T) => boolean) => void
    toArray: () => T[]
}

export interface UseQueueReturn<T> extends UseQueueActions<T> {
    queue: T[]
    size: number
    isEmpty: boolean
    isFull: boolean
}

/**
 * Hook for managing a FIFO (First-In-First-Out) queue data structure.
 * Provides methods for enqueue, dequeue, peek, and other queue operations.
 *
 * @param initialQueue - Initial queue items
 * @param maxSize - Maximum queue size (optional, unlimited if not specified)
 * @returns Queue state and operations
 *
 * @example
 * ```tsx
 * const { queue, enqueue, dequeue, peek, size, isEmpty } = useQueue<string>()
 *
 * enqueue('first')
 * enqueue('second')
 * console.log(peek()) // 'first'
 * console.log(dequeue()) // 'first'
 * console.log(size) // 1
 * ```
 */
export default function useQueue<T>(
    initialQueue: T[] = [],
    maxSize?: number
): UseQueueReturn<T> {
    const [queue, setQueue] = useState<T[]>(initialQueue)

    // Enqueue: Add item to the end of the queue
    const enqueue = useCallback(
        (item: T) => {
            setQueue((prev) => {
                // Check max size constraint
                if (maxSize !== undefined && prev.length >= maxSize) {
                    console.warn(`Queue is full (max size: ${maxSize})`)
                    return prev
                }
                return [...prev, item]
            })
        },
        [maxSize]
    )

    // Dequeue: Remove and return the first item from the queue
    const dequeue = useCallback((): T | undefined => {
        const currentQueue = queue

        if (currentQueue.length === 0) {
            return undefined
        }

        const removed = currentQueue[0]
        setQueue(currentQueue.slice(1))

        return removed
    }, [queue])

    // Peek: Return the first item without removing it
    const peek = useCallback((): T | undefined => {
        return queue[0]
    }, [queue])

    // Clear: Remove all items from the queue
    const clear = useCallback(() => {
        setQueue([])
    }, [])

    // Remove: Remove items matching a predicate
    const remove = useCallback((predicate: (item: T) => boolean) => {
        setQueue((prev) => prev.filter((item) => !predicate(item)))
    }, [])

    // ToArray: Return a copy of the queue as an array
    const toArray = useCallback((): T[] => {
        return [...queue]
    }, [queue])

    // Computed properties
    const size = queue.length
    const isEmpty = queue.length === 0
    const isFull = maxSize !== undefined && queue.length >= maxSize

    return {
        queue,
        size,
        isEmpty,
        isFull,
        enqueue,
        dequeue,
        peek,
        clear,
        remove,
        toArray,
    }
}
