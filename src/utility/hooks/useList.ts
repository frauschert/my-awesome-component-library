import { useState, useCallback } from 'react'

export interface UseListActions<T> {
    /**
     * Set the entire list
     */
    set: (newList: T[]) => void

    /**
     * Add item(s) to the end of the list
     */
    push: (...items: T[]) => void

    /**
     * Remove and return the last item
     */
    pop: () => T | undefined

    /**
     * Add item(s) to the beginning of the list
     */
    unshift: (...items: T[]) => void

    /**
     * Remove and return the first item
     */
    shift: () => T | undefined

    /**
     * Remove item at index
     */
    removeAt: (index: number) => void

    /**
     * Insert item at index
     */
    insertAt: (index: number, item: T) => void

    /**
     * Update item at index
     */
    updateAt: (index: number, item: T) => void

    /**
     * Clear the list
     */
    clear: () => void

    /**
     * Filter the list
     */
    filter: (predicate: (item: T, index: number) => boolean) => void

    /**
     * Sort the list
     */
    sort: (compareFn?: (a: T, b: T) => number) => void

    /**
     * Reverse the list
     */
    reverse: () => void

    /**
     * Remove first occurrence of item
     */
    remove: (item: T) => void

    /**
     * Remove all occurrences of item
     */
    removeAll: (item: T) => void

    /**
     * Map over the list and update
     */
    map: (mapper: (item: T, index: number) => T) => void

    /**
     * Concat arrays to the list
     */
    concat: (...arrays: T[][]) => void

    /**
     * Reset to initial value
     */
    reset: () => void
}

export type UseListReturn<T> = [T[], UseListActions<T>]

/**
 * Hook for managing array state with built-in helper methods.
 *
 * @param initialValue - Initial array value
 * @returns Tuple of [list, actions]
 *
 * @example
 * ```tsx
 * function TodoList() {
 *   const [todos, { push, removeAt, updateAt, clear }] = useList([
 *     { id: 1, text: 'Learn React', done: false }
 *   ])
 *
 *   const addTodo = (text: string) => {
 *     push({ id: Date.now(), text, done: false })
 *   }
 *
 *   const toggleTodo = (index: number) => {
 *     updateAt(index, { ...todos[index], done: !todos[index].done })
 *   }
 *
 *   return (
 *     <div>
 *       {todos.map((todo, i) => (
 *         <TodoItem
 *           key={todo.id}
 *           todo={todo}
 *           onToggle={() => toggleTodo(i)}
 *           onDelete={() => removeAt(i)}
 *         />
 *       ))}
 *     </div>
 *   )
 * }
 * ```
 */
export default function useList<T = unknown>(
    initialValue: T[] = []
): UseListReturn<T> {
    const [list, setList] = useState<T[]>(initialValue)

    const set = useCallback((newList: T[]) => {
        setList(newList)
    }, [])

    const push = useCallback((...items: T[]) => {
        setList((prev) => [...prev, ...items])
    }, [])

    const pop = useCallback(() => {
        const poppedItem = list[list.length - 1]
        setList((prev) => (prev.length === 0 ? prev : prev.slice(0, -1)))
        return poppedItem
    }, [list])

    const unshift = useCallback((...items: T[]) => {
        setList((prev) => [...items, ...prev])
    }, [])

    const shift = useCallback(() => {
        const shiftedItem = list[0]
        setList((prev) => (prev.length === 0 ? prev : prev.slice(1)))
        return shiftedItem
    }, [list])

    const removeAt = useCallback((index: number) => {
        setList((prev) => {
            if (index < 0 || index >= prev.length) return prev
            return [...prev.slice(0, index), ...prev.slice(index + 1)]
        })
    }, [])

    const insertAt = useCallback((index: number, item: T) => {
        setList((prev) => {
            const clampedIndex = Math.max(0, Math.min(index, prev.length))
            return [
                ...prev.slice(0, clampedIndex),
                item,
                ...prev.slice(clampedIndex),
            ]
        })
    }, [])

    const updateAt = useCallback((index: number, item: T) => {
        setList((prev) => {
            if (index < 0 || index >= prev.length) return prev
            return [...prev.slice(0, index), item, ...prev.slice(index + 1)]
        })
    }, [])

    const clear = useCallback(() => {
        setList([])
    }, [])

    const filter = useCallback(
        (predicate: (item: T, index: number) => boolean) => {
            setList((prev) => prev.filter(predicate))
        },
        []
    )

    const sort = useCallback((compareFn?: (a: T, b: T) => number) => {
        setList((prev) => [...prev].sort(compareFn))
    }, [])

    const reverse = useCallback(() => {
        setList((prev) => [...prev].reverse())
    }, [])

    const remove = useCallback((item: T) => {
        setList((prev) => {
            const index = prev.indexOf(item)
            if (index === -1) return prev
            return [...prev.slice(0, index), ...prev.slice(index + 1)]
        })
    }, [])

    const removeAll = useCallback((item: T) => {
        setList((prev) => prev.filter((i) => i !== item))
    }, [])

    const map = useCallback((mapper: (item: T, index: number) => T) => {
        setList((prev) => prev.map(mapper))
    }, [])

    const concat = useCallback((...arrays: T[][]) => {
        setList((prev) => prev.concat(...arrays))
    }, [])

    const reset = useCallback(() => {
        setList(initialValue)
    }, [initialValue])

    const actions: UseListActions<T> = {
        set,
        push,
        pop,
        unshift,
        shift,
        removeAt,
        insertAt,
        updateAt,
        clear,
        filter,
        sort,
        reverse,
        remove,
        removeAll,
        map,
        concat,
        reset,
    }

    return [list, actions]
}
