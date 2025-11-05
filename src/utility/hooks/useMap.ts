import { useState, useCallback } from 'react'

export interface UseMapActions<K, V> {
    /**
     * Set a value for a key
     */
    set: (key: K, value: V) => void

    /**
     * Set multiple key-value pairs at once
     */
    setAll: (entries: Iterable<readonly [K, V]>) => void

    /**
     * Delete a key
     */
    remove: (key: K) => void

    /**
     * Clear all entries
     */
    clear: () => void

    /**
     * Reset to initial state
     */
    reset: () => void
}

export type UseMapReturn<K, V> = [
    Map<K, V>,
    {
        set: (key: K, value: V) => void
        setAll: (entries: Iterable<readonly [K, V]>) => void
        remove: (key: K) => void
        clear: () => void
        reset: () => void
        get: (key: K) => V | undefined
        has: (key: K) => boolean
        size: number
    }
]

/**
 * Hook to manage a Map state with helper methods.
 * Provides a reactive Map with methods for common operations.
 *
 * @param initialMap - Initial Map or entries
 * @returns Tuple of [map, actions]
 *
 * @example
 * ```tsx
 * function UserList() {
 *   const [users, { set, remove, clear }] = useMap<string, User>()
 *
 *   return (
 *     <div>
 *       <button onClick={() => set('1', { name: 'Alice' })}>
 *         Add Alice
 *       </button>
 *       <button onClick={() => remove('1')}>Remove Alice</button>
 *       <button onClick={clear}>Clear All</button>
 *       <p>Total users: {users.size}</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function useMap<K = unknown, V = unknown>(
    initialMap: Map<K, V> | Iterable<readonly [K, V]> = new Map()
): UseMapReturn<K, V> {
    const [map, setMap] = useState<Map<K, V>>(() => {
        if (initialMap instanceof Map) {
            return new Map(initialMap)
        }
        return new Map(initialMap)
    })

    const set = useCallback((key: K, value: V) => {
        setMap((prevMap) => {
            const newMap = new Map(prevMap)
            newMap.set(key, value)
            return newMap
        })
    }, [])

    const setAll = useCallback((entries: Iterable<readonly [K, V]>) => {
        setMap((prevMap) => {
            const newMap = new Map(prevMap)
            for (const [key, value] of entries) {
                newMap.set(key, value)
            }
            return newMap
        })
    }, [])

    const remove = useCallback((key: K) => {
        setMap((prevMap) => {
            const newMap = new Map(prevMap)
            newMap.delete(key)
            return newMap
        })
    }, [])

    const clear = useCallback(() => {
        setMap(new Map())
    }, [])

    const reset = useCallback(() => {
        setMap(() => {
            if (initialMap instanceof Map) {
                return new Map(initialMap)
            }
            return new Map(initialMap)
        })
    }, [initialMap])

    const get = useCallback(
        (key: K): V | undefined => {
            return map.get(key)
        },
        [map]
    )

    const has = useCallback(
        (key: K): boolean => {
            return map.has(key)
        },
        [map]
    )

    return [
        map,
        {
            set,
            setAll,
            remove,
            clear,
            reset,
            get,
            has,
            size: map.size,
        },
    ]
}

export default useMap
