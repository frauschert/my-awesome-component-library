import { renderHook, act } from '@testing-library/react'
import useList from '../useList'

describe('useList', () => {
    it('initializes with empty array by default', () => {
        const { result } = renderHook(() => useList())
        const [list] = result.current

        expect(list).toEqual([])
    })

    it('initializes with provided initial value', () => {
        const { result } = renderHook(() => useList([1, 2, 3]))
        const [list] = result.current

        expect(list).toEqual([1, 2, 3])
    })

    it('sets the entire list', () => {
        const { result } = renderHook(() => useList([1, 2, 3]))

        act(() => {
            result.current[1].set([4, 5, 6])
        })

        expect(result.current[0]).toEqual([4, 5, 6])
    })

    it('pushes items to the end', () => {
        const { result } = renderHook(() => useList([1, 2]))

        act(() => {
            result.current[1].push(3)
        })

        expect(result.current[0]).toEqual([1, 2, 3])

        act(() => {
            result.current[1].push(4, 5)
        })

        expect(result.current[0]).toEqual([1, 2, 3, 4, 5])
    })

    it('pops item from the end', () => {
        const { result } = renderHook(() => useList([1, 2, 3]))

        let popped: number | undefined
        act(() => {
            popped = result.current[1].pop()
        })

        expect(popped).toBe(3)
        expect(result.current[0]).toEqual([1, 2])
    })

    it('returns undefined when popping from empty list', () => {
        const { result } = renderHook(() => useList<number>([]))

        let popped: number | undefined
        act(() => {
            popped = result.current[1].pop()
        })

        expect(popped).toBeUndefined()
        expect(result.current[0]).toEqual([])
    })

    it('unshifts items to the beginning', () => {
        const { result } = renderHook(() => useList([3, 4]))

        act(() => {
            result.current[1].unshift(2)
        })

        expect(result.current[0]).toEqual([2, 3, 4])

        act(() => {
            result.current[1].unshift(0, 1)
        })

        expect(result.current[0]).toEqual([0, 1, 2, 3, 4])
    })

    it('shifts item from the beginning', () => {
        const { result } = renderHook(() => useList([1, 2, 3]))

        let shifted: number | undefined
        act(() => {
            shifted = result.current[1].shift()
        })

        expect(shifted).toBe(1)
        expect(result.current[0]).toEqual([2, 3])
    })

    it('returns undefined when shifting from empty list', () => {
        const { result } = renderHook(() => useList<number>([]))

        let shifted: number | undefined
        act(() => {
            shifted = result.current[1].shift()
        })

        expect(shifted).toBeUndefined()
        expect(result.current[0]).toEqual([])
    })

    it('removes item at index', () => {
        const { result } = renderHook(() => useList([1, 2, 3, 4]))

        act(() => {
            result.current[1].removeAt(2)
        })

        expect(result.current[0]).toEqual([1, 2, 4])
    })

    it('does nothing when removing at invalid index', () => {
        const { result } = renderHook(() => useList([1, 2, 3]))

        act(() => {
            result.current[1].removeAt(-1)
        })

        expect(result.current[0]).toEqual([1, 2, 3])

        act(() => {
            result.current[1].removeAt(10)
        })

        expect(result.current[0]).toEqual([1, 2, 3])
    })

    it('inserts item at index', () => {
        const { result } = renderHook(() => useList([1, 3, 4]))

        act(() => {
            result.current[1].insertAt(1, 2)
        })

        expect(result.current[0]).toEqual([1, 2, 3, 4])
    })

    it('inserts at beginning when index is negative', () => {
        const { result } = renderHook(() => useList([2, 3]))

        act(() => {
            result.current[1].insertAt(-1, 1)
        })

        expect(result.current[0]).toEqual([1, 2, 3])
    })

    it('inserts at end when index exceeds length', () => {
        const { result } = renderHook(() => useList([1, 2]))

        act(() => {
            result.current[1].insertAt(10, 3)
        })

        expect(result.current[0]).toEqual([1, 2, 3])
    })

    it('updates item at index', () => {
        const { result } = renderHook(() => useList([1, 2, 3]))

        act(() => {
            result.current[1].updateAt(1, 20)
        })

        expect(result.current[0]).toEqual([1, 20, 3])
    })

    it('does nothing when updating at invalid index', () => {
        const { result } = renderHook(() => useList([1, 2, 3]))

        act(() => {
            result.current[1].updateAt(-1, 10)
        })

        expect(result.current[0]).toEqual([1, 2, 3])

        act(() => {
            result.current[1].updateAt(10, 10)
        })

        expect(result.current[0]).toEqual([1, 2, 3])
    })

    it('clears the list', () => {
        const { result } = renderHook(() => useList([1, 2, 3]))

        act(() => {
            result.current[1].clear()
        })

        expect(result.current[0]).toEqual([])
    })

    it('filters the list', () => {
        const { result } = renderHook(() => useList([1, 2, 3, 4, 5]))

        act(() => {
            result.current[1].filter((item) => item % 2 === 0)
        })

        expect(result.current[0]).toEqual([2, 4])
    })

    it('sorts the list', () => {
        const { result } = renderHook(() => useList([3, 1, 4, 1, 5, 9, 2, 6]))

        act(() => {
            result.current[1].sort()
        })

        expect(result.current[0]).toEqual([1, 1, 2, 3, 4, 5, 6, 9])
    })

    it('sorts with custom compare function', () => {
        const { result } = renderHook(() => useList([3, 1, 4, 1, 5]))

        act(() => {
            result.current[1].sort((a, b) => b - a)
        })

        expect(result.current[0]).toEqual([5, 4, 3, 1, 1])
    })

    it('reverses the list', () => {
        const { result } = renderHook(() => useList([1, 2, 3, 4]))

        act(() => {
            result.current[1].reverse()
        })

        expect(result.current[0]).toEqual([4, 3, 2, 1])
    })

    it('removes first occurrence of item', () => {
        const { result } = renderHook(() => useList([1, 2, 3, 2, 4]))

        act(() => {
            result.current[1].remove(2)
        })

        expect(result.current[0]).toEqual([1, 3, 2, 4])
    })

    it('does nothing when removing non-existent item', () => {
        const { result } = renderHook(() => useList([1, 2, 3]))

        act(() => {
            result.current[1].remove(5)
        })

        expect(result.current[0]).toEqual([1, 2, 3])
    })

    it('removes all occurrences of item', () => {
        const { result } = renderHook(() => useList([1, 2, 3, 2, 4, 2]))

        act(() => {
            result.current[1].removeAll(2)
        })

        expect(result.current[0]).toEqual([1, 3, 4])
    })

    it('maps over the list', () => {
        const { result } = renderHook(() => useList([1, 2, 3]))

        act(() => {
            result.current[1].map((item) => item * 2)
        })

        expect(result.current[0]).toEqual([2, 4, 6])
    })

    it('concatenates arrays', () => {
        const { result } = renderHook(() => useList([1, 2]))

        act(() => {
            result.current[1].concat([3, 4], [5, 6])
        })

        expect(result.current[0]).toEqual([1, 2, 3, 4, 5, 6])
    })

    it('resets to initial value', () => {
        const { result } = renderHook(() => useList([1, 2, 3]))

        act(() => {
            result.current[1].push(4, 5)
        })

        expect(result.current[0]).toEqual([1, 2, 3, 4, 5])

        act(() => {
            result.current[1].reset()
        })

        expect(result.current[0]).toEqual([1, 2, 3])
    })

    it('works with complex objects', () => {
        interface Todo {
            id: number
            text: string
            done: boolean
        }

        const initialTodos: Todo[] = [
            { id: 1, text: 'Task 1', done: false },
            { id: 2, text: 'Task 2', done: true },
        ]

        const { result } = renderHook(() => useList(initialTodos))

        act(() => {
            result.current[1].push({ id: 3, text: 'Task 3', done: false })
        })

        expect(result.current[0]).toHaveLength(3)
        expect(result.current[0][2]).toEqual({
            id: 3,
            text: 'Task 3',
            done: false,
        })

        act(() => {
            result.current[1].updateAt(0, {
                ...result.current[0][0],
                done: true,
            })
        })

        expect(result.current[0][0].done).toBe(true)
    })

    it('handles chained operations', () => {
        const { result } = renderHook(() => useList([1, 2, 3, 4, 5]))

        act(() => {
            result.current[1].filter((item) => item > 2)
        })

        expect(result.current[0]).toEqual([3, 4, 5])

        act(() => {
            result.current[1].map((item) => item * 2)
        })

        expect(result.current[0]).toEqual([6, 8, 10])

        act(() => {
            result.current[1].reverse()
        })

        expect(result.current[0]).toEqual([10, 8, 6])
    })

    it('maintains stable action references', () => {
        const { result, rerender } = renderHook(() => useList([1, 2, 3]))

        const actions1 = result.current[1]

        rerender()

        const actions2 = result.current[1]

        expect(actions1.push).toBe(actions2.push)
        expect(actions1.pop).toBe(actions2.pop)
        expect(actions1.clear).toBe(actions2.clear)
    })

    it('handles empty list operations gracefully', () => {
        const { result } = renderHook(() => useList<number>([]))

        act(() => {
            result.current[1].filter((item) => item > 0)
        })

        expect(result.current[0]).toEqual([])

        act(() => {
            result.current[1].sort()
        })

        expect(result.current[0]).toEqual([])

        act(() => {
            result.current[1].reverse()
        })

        expect(result.current[0]).toEqual([])
    })

    it('handles single item operations', () => {
        const { result } = renderHook(() => useList([42]))

        act(() => {
            result.current[1].reverse()
        })

        expect(result.current[0]).toEqual([42])

        let popped: number | undefined
        act(() => {
            popped = result.current[1].pop()
        })

        expect(popped).toBe(42)
        expect(result.current[0]).toEqual([])
    })
})
