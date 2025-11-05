import { renderHook, act } from '@testing-library/react'
import { useMap } from '../useMap'

describe('useMap', () => {
    it('should initialize with empty map', () => {
        const { result } = renderHook(() => useMap())

        expect(result.current[0]).toBeInstanceOf(Map)
        expect(result.current[0].size).toBe(0)
        expect(result.current[1].size).toBe(0)
    })

    it('should initialize with entries', () => {
        const { result } = renderHook(() =>
            useMap([
                ['key1', 'value1'],
                ['key2', 'value2'],
            ])
        )

        expect(result.current[0].size).toBe(2)
        expect(result.current[0].get('key1')).toBe('value1')
        expect(result.current[0].get('key2')).toBe('value2')
    })

    it('should initialize with existing Map', () => {
        const initialMap = new Map([
            ['a', 1],
            ['b', 2],
        ])
        const { result } = renderHook(() => useMap(initialMap))

        expect(result.current[0].size).toBe(2)
        expect(result.current[0].get('a')).toBe(1)
        expect(result.current[0].get('b')).toBe(2)
    })

    it('should set a value', () => {
        const { result } = renderHook(() => useMap<string, number>())

        act(() => {
            result.current[1].set('key1', 100)
        })

        expect(result.current[0].get('key1')).toBe(100)
        expect(result.current[1].size).toBe(1)
    })

    it('should update existing value', () => {
        const { result } = renderHook(() => useMap([['key1', 'old']]))

        act(() => {
            result.current[1].set('key1', 'new')
        })

        expect(result.current[0].get('key1')).toBe('new')
        expect(result.current[1].size).toBe(1)
    })

    it('should set multiple values with setAll', () => {
        const { result } = renderHook(() => useMap<string, number>())

        act(() => {
            result.current[1].setAll([
                ['a', 1],
                ['b', 2],
                ['c', 3],
            ])
        })

        expect(result.current[0].size).toBe(3)
        expect(result.current[0].get('a')).toBe(1)
        expect(result.current[0].get('b')).toBe(2)
        expect(result.current[0].get('c')).toBe(3)
    })

    it('should setAll and update existing values', () => {
        const { result } = renderHook(() =>
            useMap([
                ['a', 1],
                ['b', 2],
            ])
        )

        act(() => {
            result.current[1].setAll([
                ['b', 20],
                ['c', 3],
            ])
        })

        expect(result.current[0].size).toBe(3)
        expect(result.current[0].get('a')).toBe(1)
        expect(result.current[0].get('b')).toBe(20)
        expect(result.current[0].get('c')).toBe(3)
    })

    it('should remove a value', () => {
        const { result } = renderHook(() =>
            useMap([
                ['key1', 'value1'],
                ['key2', 'value2'],
            ])
        )

        act(() => {
            result.current[1].remove('key1')
        })

        expect(result.current[0].has('key1')).toBe(false)
        expect(result.current[0].has('key2')).toBe(true)
        expect(result.current[1].size).toBe(1)
    })

    it('should handle removing non-existent key', () => {
        const { result } = renderHook(() => useMap([['key1', 'value1']]))

        act(() => {
            result.current[1].remove('nonexistent')
        })

        expect(result.current[0].size).toBe(1)
        expect(result.current[0].get('key1')).toBe('value1')
    })

    it('should clear all values', () => {
        const { result } = renderHook(() =>
            useMap([
                ['key1', 'value1'],
                ['key2', 'value2'],
                ['key3', 'value3'],
            ])
        )

        act(() => {
            result.current[1].clear()
        })

        expect(result.current[0].size).toBe(0)
        expect(result.current[1].size).toBe(0)
    })

    it('should reset to initial state', () => {
        const initialMap = new Map([
            ['a', 1],
            ['b', 2],
        ])
        const { result } = renderHook(() => useMap(initialMap))

        act(() => {
            result.current[1].set('c', 3)
            result.current[1].remove('a')
        })

        expect(result.current[0].size).toBe(2)

        act(() => {
            result.current[1].reset()
        })

        expect(result.current[0].size).toBe(2)
        expect(result.current[0].get('a')).toBe(1)
        expect(result.current[0].get('b')).toBe(2)
        expect(result.current[0].has('c')).toBe(false)
    })

    it('should get a value', () => {
        const { result } = renderHook(() => useMap([['key1', 'value1']]))

        expect(result.current[1].get('key1')).toBe('value1')
        expect(result.current[1].get('nonexistent')).toBeUndefined()
    })

    it('should check if key exists with has', () => {
        const { result } = renderHook(() => useMap([['key1', 'value1']]))

        expect(result.current[1].has('key1')).toBe(true)
        expect(result.current[1].has('nonexistent')).toBe(false)
    })

    it('should return correct size', () => {
        const { result } = renderHook(() => useMap())

        expect(result.current[1].size).toBe(0)

        act(() => {
            result.current[1].set('a', 1)
        })

        expect(result.current[1].size).toBe(1)

        act(() => {
            result.current[1].set('b', 2)
            result.current[1].set('c', 3)
        })

        expect(result.current[1].size).toBe(3)

        act(() => {
            result.current[1].remove('b')
        })

        expect(result.current[1].size).toBe(2)
    })

    it('should work with different key types', () => {
        const { result } = renderHook(() => useMap<number, string>())

        act(() => {
            result.current[1].set(1, 'one')
            result.current[1].set(2, 'two')
        })

        expect(result.current[0].get(1)).toBe('one')
        expect(result.current[0].get(2)).toBe('two')
    })

    it('should work with object keys', () => {
        const key1 = { id: 1 }
        const key2 = { id: 2 }
        const { result } = renderHook(() => useMap<object, string>())

        act(() => {
            result.current[1].set(key1, 'value1')
            result.current[1].set(key2, 'value2')
        })

        expect(result.current[0].get(key1)).toBe('value1')
        expect(result.current[0].get(key2)).toBe('value2')
        expect(result.current[1].size).toBe(2)
    })

    it('should work with complex value types', () => {
        interface User {
            name: string
            age: number
        }

        const { result } = renderHook(() => useMap<string, User>())

        act(() => {
            result.current[1].set('user1', { name: 'Alice', age: 30 })
            result.current[1].set('user2', { name: 'Bob', age: 25 })
        })

        expect(result.current[0].get('user1')).toEqual({
            name: 'Alice',
            age: 30,
        })
        expect(result.current[0].get('user2')).toEqual({ name: 'Bob', age: 25 })
    })

    it('should maintain immutability', () => {
        const { result } = renderHook(() => useMap([['key1', 'value1']]))

        const mapBefore = result.current[0]

        act(() => {
            result.current[1].set('key2', 'value2')
        })

        const mapAfter = result.current[0]

        expect(mapBefore).not.toBe(mapAfter)
        expect(mapBefore.size).toBe(1)
        expect(mapAfter.size).toBe(2)
    })

    it('should handle multiple operations in sequence', () => {
        const { result } = renderHook(() => useMap<string, number>())

        act(() => {
            result.current[1].set('a', 1)
            result.current[1].set('b', 2)
            result.current[1].set('c', 3)
        })

        expect(result.current[1].size).toBe(3)

        act(() => {
            result.current[1].remove('b')
        })

        expect(result.current[1].size).toBe(2)
        expect(result.current[1].has('b')).toBe(false)

        act(() => {
            result.current[1].set('d', 4)
        })

        expect(result.current[1].size).toBe(3)

        act(() => {
            result.current[1].clear()
        })

        expect(result.current[1].size).toBe(0)
    })

    it('should handle setAll with empty array', () => {
        const { result } = renderHook(() => useMap([['key1', 'value1']]))

        act(() => {
            result.current[1].setAll([])
        })

        expect(result.current[1].size).toBe(1)
        expect(result.current[0].get('key1')).toBe('value1')
    })

    it('should allow setting same key multiple times', () => {
        const { result } = renderHook(() => useMap<string, number>())

        act(() => {
            result.current[1].set('key', 1)
        })

        expect(result.current[0].get('key')).toBe(1)

        act(() => {
            result.current[1].set('key', 2)
        })

        expect(result.current[0].get('key')).toBe(2)

        act(() => {
            result.current[1].set('key', 3)
        })

        expect(result.current[0].get('key')).toBe(3)
        expect(result.current[1].size).toBe(1)
    })

    it('should work with undefined and null values', () => {
        const { result } = renderHook(() => useMap<string, any>())

        act(() => {
            result.current[1].set('undefined', undefined)
            result.current[1].set('null', null)
        })

        expect(result.current[0].get('undefined')).toBeUndefined()
        expect(result.current[0].get('null')).toBeNull()
        expect(result.current[1].has('undefined')).toBe(true)
        expect(result.current[1].has('null')).toBe(true)
        expect(result.current[1].size).toBe(2)
    })
})
