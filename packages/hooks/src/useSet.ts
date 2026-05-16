import { useCallback, useState } from 'react'

/**
 * Hook for managing Set state with immutable updates and helper methods.
 *
 * @template T - The type of values in the set
 * @param {Iterable<T> | Set<T>} [initialSet] - Initial values (array, Set, or any iterable)
 * @returns {[Set<T>, UseSetActions<T>]} A tuple containing the current Set and actions object
 *
 * @example
 * const [tags, { add, delete: remove, has, toggle }] = useSet(['react', 'typescript'])
 * add('hooks')
 * remove('react')
 * toggle('vue')
 */
export default function useSet<T = unknown>(
    initialSet?: Iterable<T> | Set<T>
): [Set<T>, UseSetActions<T>] {
    const [set, setSet] = useState<Set<T>>(() => {
        if (initialSet instanceof Set) {
            return new Set(initialSet)
        }
        if (initialSet) {
            return new Set(initialSet)
        }
        return new Set<T>()
    })

    const add = useCallback((value: T) => {
        setSet((prevSet) => {
            const newSet = new Set(prevSet)
            newSet.add(value)
            return newSet
        })
    }, [])

    const addAll = useCallback((values: Iterable<T>) => {
        setSet((prevSet) => {
            const newSet = new Set(prevSet)
            for (const value of values) {
                newSet.add(value)
            }
            return newSet
        })
    }, [])

    const deleteValue = useCallback((value: T) => {
        setSet((prevSet) => {
            const newSet = new Set(prevSet)
            newSet.delete(value)
            return newSet
        })
    }, [])

    const deleteAll = useCallback((values: Iterable<T>) => {
        setSet((prevSet) => {
            const newSet = new Set(prevSet)
            for (const value of values) {
                newSet.delete(value)
            }
            return newSet
        })
    }, [])

    const clear = useCallback(() => {
        setSet(new Set<T>())
    }, [])

    const reset = useCallback(() => {
        if (initialSet instanceof Set) {
            setSet(new Set(initialSet))
        } else if (initialSet) {
            setSet(new Set(initialSet))
        } else {
            setSet(new Set<T>())
        }
    }, [initialSet])

    const toggle = useCallback((value: T) => {
        setSet((prevSet) => {
            const newSet = new Set(prevSet)
            if (newSet.has(value)) {
                newSet.delete(value)
            } else {
                newSet.add(value)
            }
            return newSet
        })
    }, [])

    const has = useCallback(
        (value: T) => {
            return set.has(value)
        },
        [set]
    )

    const size = set.size

    return [
        set,
        {
            add,
            addAll,
            delete: deleteValue,
            deleteAll,
            clear,
            reset,
            toggle,
            has,
            size,
        },
    ]
}

export interface UseSetActions<T> {
    /**
     * Add a value to the set
     */
    add: (value: T) => void
    /**
     * Add multiple values to the set
     */
    addAll: (values: Iterable<T>) => void
    /**
     * Remove a value from the set
     */
    delete: (value: T) => void
    /**
     * Remove multiple values from the set
     */
    deleteAll: (values: Iterable<T>) => void
    /**
     * Remove all values from the set
     */
    clear: () => void
    /**
     * Reset the set to its initial state
     */
    reset: () => void
    /**
     * Toggle a value (add if not present, remove if present)
     */
    toggle: (value: T) => void
    /**
     * Check if a value exists in the set
     */
    has: (value: T) => boolean
    /**
     * Current size of the set
     */
    size: number
}
