import { renderHook, act } from '@testing-library/react'
import useSet from '../useSet'

describe('useSet', () => {
    it('should initialize with empty set', () => {
        const { result } = renderHook(() => useSet())
        const [set] = result.current

        expect(set.size).toBe(0)
        expect(set).toBeInstanceOf(Set)
    })

    it('should initialize with array', () => {
        const { result } = renderHook(() => useSet([1, 2, 3]))
        const [set] = result.current

        expect(set.size).toBe(3)
        expect(set.has(1)).toBe(true)
        expect(set.has(2)).toBe(true)
        expect(set.has(3)).toBe(true)
    })

    it('should initialize with Set', () => {
        const initialSet = new Set(['a', 'b', 'c'])
        const { result } = renderHook(() => useSet(initialSet))
        const [set] = result.current

        expect(set.size).toBe(3)
        expect(set.has('a')).toBe(true)
        expect(set.has('b')).toBe(true)
        expect(set.has('c')).toBe(true)
    })

    it('should handle duplicate values in initial array', () => {
        const { result } = renderHook(() => useSet([1, 2, 2, 3, 3, 3]))
        const [set] = result.current

        expect(set.size).toBe(3)
    })

    it('should add value', () => {
        const { result } = renderHook(() => useSet<number>())

        act(() => {
            result.current[1].add(1)
        })

        expect(result.current[0].has(1)).toBe(true)
        expect(result.current[0].size).toBe(1)
    })

    it('should add multiple values', () => {
        const { result } = renderHook(() => useSet<number>())

        act(() => {
            result.current[1].add(1)
            result.current[1].add(2)
            result.current[1].add(3)
        })

        expect(result.current[0].size).toBe(3)
        expect(result.current[0].has(1)).toBe(true)
        expect(result.current[0].has(2)).toBe(true)
        expect(result.current[0].has(3)).toBe(true)
    })

    it('should not add duplicate values', () => {
        const { result } = renderHook(() => useSet([1, 2]))

        act(() => {
            result.current[1].add(1)
        })

        expect(result.current[0].size).toBe(2)
    })

    it('should add all values from iterable', () => {
        const { result } = renderHook(() => useSet([1]))

        act(() => {
            result.current[1].addAll([2, 3, 4])
        })

        expect(result.current[0].size).toBe(4)
        expect(result.current[0].has(2)).toBe(true)
        expect(result.current[0].has(3)).toBe(true)
        expect(result.current[0].has(4)).toBe(true)
    })

    it('should delete value', () => {
        const { result } = renderHook(() => useSet([1, 2, 3]))

        act(() => {
            result.current[1].delete(2)
        })

        expect(result.current[0].size).toBe(2)
        expect(result.current[0].has(2)).toBe(false)
        expect(result.current[0].has(1)).toBe(true)
        expect(result.current[0].has(3)).toBe(true)
    })

    it('should delete non-existent value without error', () => {
        const { result } = renderHook(() => useSet([1, 2]))

        act(() => {
            result.current[1].delete(99)
        })

        expect(result.current[0].size).toBe(2)
    })

    it('should delete all values from iterable', () => {
        const { result } = renderHook(() => useSet([1, 2, 3, 4, 5]))

        act(() => {
            result.current[1].deleteAll([2, 3, 4])
        })

        expect(result.current[0].size).toBe(2)
        expect(result.current[0].has(1)).toBe(true)
        expect(result.current[0].has(5)).toBe(true)
        expect(result.current[0].has(2)).toBe(false)
    })

    it('should clear all values', () => {
        const { result } = renderHook(() => useSet([1, 2, 3, 4, 5]))

        act(() => {
            result.current[1].clear()
        })

        expect(result.current[0].size).toBe(0)
    })

    it('should reset to initial state', () => {
        const { result } = renderHook(() => useSet([1, 2, 3]))

        act(() => {
            result.current[1].add(4)
            result.current[1].delete(1)
        })

        expect(result.current[0].size).toBe(3)

        act(() => {
            result.current[1].reset()
        })

        expect(result.current[0].size).toBe(3)
        expect(result.current[0].has(1)).toBe(true)
        expect(result.current[0].has(2)).toBe(true)
        expect(result.current[0].has(3)).toBe(true)
        expect(result.current[0].has(4)).toBe(false)
    })

    it('should reset to empty when initialized empty', () => {
        const { result } = renderHook(() => useSet<number>())

        act(() => {
            result.current[1].add(1)
            result.current[1].add(2)
        })

        expect(result.current[0].size).toBe(2)

        act(() => {
            result.current[1].reset()
        })

        expect(result.current[0].size).toBe(0)
    })

    it('should toggle value (add when not present)', () => {
        const { result } = renderHook(() => useSet([1, 2]))

        act(() => {
            result.current[1].toggle(3)
        })

        expect(result.current[0].has(3)).toBe(true)
        expect(result.current[0].size).toBe(3)
    })

    it('should toggle value (remove when present)', () => {
        const { result } = renderHook(() => useSet([1, 2, 3]))

        act(() => {
            result.current[1].toggle(2)
        })

        expect(result.current[0].has(2)).toBe(false)
        expect(result.current[0].size).toBe(2)
    })

    it('should toggle value multiple times', () => {
        const { result } = renderHook(() => useSet([1]))

        act(() => {
            result.current[1].toggle(2)
        })
        expect(result.current[0].has(2)).toBe(true)

        act(() => {
            result.current[1].toggle(2)
        })
        expect(result.current[0].has(2)).toBe(false)

        act(() => {
            result.current[1].toggle(2)
        })
        expect(result.current[0].has(2)).toBe(true)
    })

    it('should check if value exists with has', () => {
        const { result } = renderHook(() => useSet([1, 2, 3]))

        expect(result.current[1].has(2)).toBe(true)
        expect(result.current[1].has(99)).toBe(false)
    })

    it('should track size', () => {
        const { result } = renderHook(() => useSet([1, 2, 3]))

        expect(result.current[1].size).toBe(3)

        act(() => {
            result.current[1].add(4)
        })

        expect(result.current[1].size).toBe(4)

        act(() => {
            result.current[1].delete(1)
        })

        expect(result.current[1].size).toBe(3)
    })

    it('should work with string values', () => {
        const { result } = renderHook(() => useSet(['a', 'b', 'c']))

        act(() => {
            result.current[1].add('d')
            result.current[1].delete('b')
        })

        expect(result.current[0].has('a')).toBe(true)
        expect(result.current[0].has('b')).toBe(false)
        expect(result.current[0].has('d')).toBe(true)
        expect(result.current[0].size).toBe(3)
    })

    it('should work with object values', () => {
        const obj1 = { id: 1 }
        const obj2 = { id: 2 }
        const obj3 = { id: 3 }

        const { result } = renderHook(() => useSet([obj1, obj2]))

        act(() => {
            result.current[1].add(obj3)
        })

        expect(result.current[0].has(obj1)).toBe(true)
        expect(result.current[0].has(obj2)).toBe(true)
        expect(result.current[0].has(obj3)).toBe(true)
        expect(result.current[0].size).toBe(3)
    })

    it('should maintain immutability', () => {
        const { result } = renderHook(() => useSet([1, 2]))
        const firstSet = result.current[0]

        act(() => {
            result.current[1].add(3)
        })

        const secondSet = result.current[0]

        expect(firstSet).not.toBe(secondSet)
        expect(firstSet.size).toBe(2)
        expect(secondSet.size).toBe(3)
    })

    it('should handle complex sequential operations', () => {
        const { result } = renderHook(() => useSet([1, 2, 3]))

        act(() => {
            result.current[1].add(4)
            result.current[1].delete(2)
            result.current[1].toggle(5)
            result.current[1].toggle(1)
            result.current[1].addAll([6, 7])
            result.current[1].deleteAll([3, 4])
        })

        expect(result.current[0].size).toBe(3)
        expect(result.current[0].has(1)).toBe(false)
        expect(result.current[0].has(5)).toBe(true)
        expect(result.current[0].has(6)).toBe(true)
        expect(result.current[0].has(7)).toBe(true)
    })

    it('should handle empty array in addAll', () => {
        const { result } = renderHook(() => useSet([1]))

        act(() => {
            result.current[1].addAll([])
        })

        expect(result.current[0].size).toBe(1)
    })

    it('should handle empty array in deleteAll', () => {
        const { result } = renderHook(() => useSet([1, 2]))

        act(() => {
            result.current[1].deleteAll([])
        })

        expect(result.current[0].size).toBe(2)
    })
})
