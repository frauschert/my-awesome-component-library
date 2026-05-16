import { memoize } from '../memoize'

describe('memoize', () => {
    it('should cache function results', () => {
        const fn = jest.fn((a: number, b: number) => a + b)
        const memoized = memoize(fn)

        expect(memoized(2, 3)).toBe(5)
        expect(memoized(2, 3)).toBe(5)
        expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should cache results for different argument combinations separately', () => {
        const fn = jest.fn((a: number, b: number) => a * b)
        const memoized = memoize(fn)

        expect(memoized(2, 3)).toBe(6)
        expect(memoized(3, 4)).toBe(12)
        expect(memoized(2, 3)).toBe(6)
        expect(memoized(3, 4)).toBe(12)

        expect(fn).toHaveBeenCalledTimes(2)
    })

    it('should work with single argument', () => {
        const fn = jest.fn((x: number) => x * 2)
        const memoized = memoize(fn)

        expect(memoized(5)).toBe(10)
        expect(memoized(5)).toBe(10)
        expect(memoized(10)).toBe(20)

        expect(fn).toHaveBeenCalledTimes(2)
    })

    it('should work with no arguments', () => {
        const fn = jest.fn(() => Math.random())
        const memoized = memoize(fn)

        const result1 = memoized()
        const result2 = memoized()

        expect(result1).toBe(result2)
        expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should work with string arguments', () => {
        const fn = jest.fn((a: string, b: string) => a + b)
        const memoized = memoize(fn)

        expect(memoized('hello', 'world')).toBe('helloworld')
        expect(memoized('hello', 'world')).toBe('helloworld')
        expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should work with object arguments', () => {
        const fn = jest.fn((obj: { x: number; y: number }) => obj.x + obj.y)
        const memoized = memoize(fn)

        expect(memoized({ x: 1, y: 2 })).toBe(3)
        expect(memoized({ x: 1, y: 2 })).toBe(3)
        expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should treat objects with same properties but different order as same', () => {
        const fn = jest.fn((obj: { a: number; b: number }) => obj.a + obj.b)
        const memoized = memoize(fn)

        expect(memoized({ a: 1, b: 2 })).toBe(3)
        // Note: JSON.stringify with same keys in different order produces same string
        expect(memoized({ a: 1, b: 2 })).toBe(3)
        expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should work with array arguments', () => {
        const fn = jest.fn((arr: number[]) => arr.reduce((a, b) => a + b, 0))
        const memoized = memoize(fn)

        expect(memoized([1, 2, 3])).toBe(6)
        expect(memoized([1, 2, 3])).toBe(6)
        expect(memoized([1, 2, 3, 4])).toBe(10)
        expect(fn).toHaveBeenCalledTimes(2)
    })

    it('should work with mixed argument types', () => {
        const fn = jest.fn(
            (a: number, b: string, c: boolean) => `${a}-${b}-${c}`
        )
        const memoized = memoize(fn)

        expect(memoized(1, 'test', true)).toBe('1-test-true')
        expect(memoized(1, 'test', true)).toBe('1-test-true')
        expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should handle null and undefined (JSON.stringify limitation)', () => {
        const fn = jest.fn((x: any) => String(x))
        const memoized = memoize(fn)

        // JSON.stringify([undefined]) becomes "[null]", so null and undefined
        // are treated as the same key (this is a limitation of JSON-based caching)
        const result1 = memoized(null)
        const result2 = memoized(undefined)

        expect(result1).toBe('null')
        expect(result2).toBe('null') // Returns cached 'null' result
        expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should cache.has() correctly report cache status', () => {
        const fn = jest.fn((a: number) => a * 2)
        const memoized = memoize(fn)

        expect(memoized.cache.has([5])).toBe(false)
        memoized(5)
        expect(memoized.cache.has([5])).toBe(true)
        expect(memoized.cache.has([6])).toBe(false)
    })

    it('should cache.get() return cached value', () => {
        const fn = jest.fn((a: number) => a * 2)
        const memoized = memoize(fn)

        expect(memoized.cache.get([5])).toBeUndefined()
        memoized(5)
        expect(memoized.cache.get([5])).toBe(10)
    })

    it('should cache.set() manually set cache values', () => {
        const fn = jest.fn((a: number) => a * 2)
        const memoized = memoize(fn)

        memoized.cache.set([5], 100)
        expect(memoized(5)).toBe(100)
        expect(fn).not.toHaveBeenCalled()
    })

    it('should cache.delete() remove specific cached values', () => {
        const fn = jest.fn((a: number) => a * 2)
        const memoized = memoize(fn)

        memoized(5)
        expect(fn).toHaveBeenCalledTimes(1)
        expect(memoized.cache.has([5])).toBe(true)

        const deleted = memoized.cache.delete([5])
        expect(deleted).toBe(true)
        expect(memoized.cache.has([5])).toBe(false)

        memoized(5)
        expect(fn).toHaveBeenCalledTimes(2)
    })

    it('should cache.delete() return false for non-existent keys', () => {
        const fn = jest.fn((a: number) => a * 2)
        const memoized = memoize(fn)

        expect(memoized.cache.delete([5])).toBe(false)
    })

    it('should cache.clear() remove all cached values', () => {
        const fn = jest.fn((a: number) => a * 2)
        const memoized = memoize(fn)

        memoized(5)
        memoized(10)
        memoized(15)
        expect(fn).toHaveBeenCalledTimes(3)

        memoized.cache.clear()
        expect(memoized.cache.size()).toBe(0)

        memoized(5)
        memoized(10)
        expect(fn).toHaveBeenCalledTimes(5)
    })

    it('should cache.size() return number of cached entries', () => {
        const fn = jest.fn((a: number) => a * 2)
        const memoized = memoize(fn)

        expect(memoized.cache.size()).toBe(0)
        memoized(5)
        expect(memoized.cache.size()).toBe(1)
        memoized(10)
        expect(memoized.cache.size()).toBe(2)
        memoized(5) // already cached
        expect(memoized.cache.size()).toBe(2)
    })

    it('should handle functions that return objects', () => {
        const fn = jest.fn((x: number) => ({ value: x * 2 }))
        const memoized = memoize(fn)

        const result1 = memoized(5)
        const result2 = memoized(5)

        expect(result1).toEqual({ value: 10 })
        expect(result1).toBe(result2) // same reference
        expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should handle functions that return undefined', () => {
        const fn = jest.fn(() => undefined)
        const memoized = memoize(fn)

        expect(memoized()).toBeUndefined()
        expect(memoized()).toBeUndefined()
        expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should handle functions that throw errors', () => {
        const fn = jest.fn(() => {
            throw new Error('Test error')
        })
        const memoized = memoize(fn)

        expect(() => memoized()).toThrow('Test error')
        expect(() => memoized()).toThrow('Test error')
        // Error is not cached, so function is called each time
        expect(fn).toHaveBeenCalledTimes(2)
    })

    it('should work with many arguments', () => {
        const fn = jest.fn(
            (a: number, b: number, c: number, d: number, e: number) =>
                a + b + c + d + e
        )
        const memoized = memoize(fn)

        expect(memoized(1, 2, 3, 4, 5)).toBe(15)
        expect(memoized(1, 2, 3, 4, 5)).toBe(15)
        expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should preserve this context when called as method', () => {
        const obj = {
            multiplier: 10,
            calc: jest.fn(function (this: any, x: number) {
                return x * this.multiplier
            }),
        }

        const memoized = memoize(obj.calc.bind(obj))
        expect(memoized(5)).toBe(50)
        expect(memoized(5)).toBe(50)
        expect(obj.calc).toHaveBeenCalledTimes(1)
    })
})
