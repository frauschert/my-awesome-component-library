import { range } from '../range'

describe('range', () => {
    it('should create ascending range', () => {
        expect(range(1, 5)).toEqual([1, 2, 3, 4, 5])
    })

    it('should create descending range', () => {
        expect(range(5, 1)).toEqual([5, 4, 3, 2, 1])
    })

    it('should create range with custom step', () => {
        expect(range(0, 10, 2)).toEqual([0, 2, 4, 6, 8, 10])
    })

    it('should create descending range with custom step', () => {
        expect(range(10, 0, -2)).toEqual([10, 8, 6, 4, 2, 0])
    })

    it('should handle single element range', () => {
        expect(range(5, 5)).toEqual([5])
    })

    it('should create range starting from zero', () => {
        expect(range(0, 4)).toEqual([0, 1, 2, 3, 4])
    })

    it('should create range with negative numbers', () => {
        expect(range(-3, 3)).toEqual([-3, -2, -1, 0, 1, 2, 3])
    })

    it('should create descending range with negative numbers', () => {
        expect(range(3, -3)).toEqual([3, 2, 1, 0, -1, -2, -3])
    })

    it('should handle large ranges efficiently', () => {
        const result = range(1, 1000)
        expect(result).toHaveLength(1000)
        expect(result[0]).toBe(1)
        expect(result[999]).toBe(1000)
    })

    it('should create range with step larger than 1', () => {
        expect(range(0, 20, 5)).toEqual([0, 5, 10, 15, 20])
    })

    it('should create descending range with step larger than 1', () => {
        expect(range(20, 0, -5)).toEqual([20, 15, 10, 5, 0])
    })

    it('should handle fractional steps', () => {
        expect(range(0, 2, 0.5)).toEqual([0, 0.5, 1, 1.5, 2])
    })

    it('should handle negative fractional steps', () => {
        expect(range(2, 0, -0.5)).toEqual([2, 1.5, 1, 0.5, 0])
    })

    it('should throw error for zero step', () => {
        expect(() => range(1, 5, 0)).toThrow('Step cannot be zero')
    })

    it('should throw error for positive step with descending range', () => {
        expect(() => range(5, 1, 1)).toThrow(
            'Step must be negative when start > end'
        )
    })

    it('should throw error for negative step with ascending range', () => {
        expect(() => range(1, 5, -1)).toThrow(
            'Step must be positive when start < end'
        )
    })

    it('should handle ranges that do not land exactly on end', () => {
        expect(range(0, 10, 3)).toEqual([0, 3, 6, 9])
    })

    it('should handle descending ranges that do not land exactly on end', () => {
        expect(range(10, 0, -3)).toEqual([10, 7, 4, 1])
    })

    it('should work with very small numbers', () => {
        expect(range(0.1, 0.5, 0.1)).toHaveLength(5)
        expect(range(0.1, 0.5, 0.1)[0]).toBeCloseTo(0.1)
        expect(range(0.1, 0.5, 0.1)[4]).toBeCloseTo(0.5)
    })

    it('should create empty-like range when step skips end', () => {
        expect(range(1, 2, 5)).toEqual([1])
    })

    it('should handle negative start and end', () => {
        expect(range(-5, -1)).toEqual([-5, -4, -3, -2, -1])
    })

    it('should handle negative descending range', () => {
        expect(range(-1, -5)).toEqual([-1, -2, -3, -4, -5])
    })

    it('should work with step of 1 explicitly', () => {
        expect(range(1, 5, 1)).toEqual([1, 2, 3, 4, 5])
    })

    it('should work with step of -1 explicitly', () => {
        expect(range(5, 1, -1)).toEqual([5, 4, 3, 2, 1])
    })

    it('should handle range from negative to positive with step', () => {
        expect(range(-10, 10, 5)).toEqual([-10, -5, 0, 5, 10])
    })

    it('should handle range from positive to negative with step', () => {
        expect(range(10, -10, -5)).toEqual([10, 5, 0, -5, -10])
    })

    it('should create range useful for array indices', () => {
        const indices = range(0, 9)
        expect(indices).toHaveLength(10)
        expect(indices[0]).toBe(0)
        expect(indices[9]).toBe(9)
    })

    it('should work with large steps', () => {
        expect(range(0, 100, 25)).toEqual([0, 25, 50, 75, 100])
    })

    it('should handle floating point precision issues gracefully', () => {
        const result = range(0, 1, 0.1)
        expect(result).toHaveLength(11)
        // Check approximate values due to floating point
        expect(result[0]).toBeCloseTo(0)
        expect(result[5]).toBeCloseTo(0.5)
        expect(result[10]).toBeCloseTo(1)
    })

    it('should work for pagination scenarios', () => {
        const pages = range(1, 10)
        expect(pages).toHaveLength(10)
        expect(pages[0]).toBe(1)
        expect(pages[9]).toBe(10)
    })

    it('should work for countdown scenarios', () => {
        const countdown = range(10, 0)
        expect(countdown).toHaveLength(11)
        expect(countdown[0]).toBe(10)
        expect(countdown[10]).toBe(0)
    })
})
