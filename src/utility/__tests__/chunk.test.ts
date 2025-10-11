import { chunk } from '../chunk'

describe('chunk', () => {
    it('should split array into chunks of specified size', () => {
        expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])
    })

    it('should handle evenly divisible arrays', () => {
        expect(chunk([1, 2, 3, 4, 5, 6], 3)).toEqual([
            [1, 2, 3],
            [4, 5, 6],
        ])
    })

    it('should handle chunk size equal to array length', () => {
        expect(chunk([1, 2, 3], 3)).toEqual([[1, 2, 3]])
    })

    it('should handle chunk size greater than array length', () => {
        expect(chunk([1, 2, 3], 5)).toEqual([[1, 2, 3]])
    })

    it('should handle chunk size of 1', () => {
        expect(chunk([1, 2, 3], 1)).toEqual([[1], [2], [3]])
    })

    it('should handle empty array', () => {
        expect(chunk([], 2)).toEqual([])
    })

    it('should work with string arrays', () => {
        expect(chunk(['a', 'b', 'c', 'd'], 2)).toEqual([
            ['a', 'b'],
            ['c', 'd'],
        ])
    })

    it('should work with object arrays', () => {
        const objs = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }]
        expect(chunk(objs, 2)).toEqual([
            [{ id: 1 }, { id: 2 }],
            [{ id: 3 }, { id: 4 }],
            [{ id: 5 }],
        ])
    })

    it('should work with mixed type arrays', () => {
        expect(chunk([1, 'a', true, null, undefined], 2)).toEqual([
            [1, 'a'],
            [true, null],
            [undefined],
        ])
    })

    it('should not mutate the original array', () => {
        const original = [1, 2, 3, 4, 5]
        const copy = [...original]
        chunk(original, 2)
        expect(original).toEqual(copy)
    })

    it('should throw error for zero size', () => {
        expect(() => chunk([1, 2, 3], 0)).toThrow(
            'Chunk size must be a positive integer'
        )
    })

    it('should throw error for negative size', () => {
        expect(() => chunk([1, 2, 3], -1)).toThrow(
            'Chunk size must be a positive integer'
        )
    })

    it('should throw error for non-integer size', () => {
        expect(() => chunk([1, 2, 3], 2.5)).toThrow(
            'Chunk size must be a positive integer'
        )
    })

    it('should throw error for NaN size', () => {
        expect(() => chunk([1, 2, 3], NaN)).toThrow(
            'Chunk size must be a positive integer'
        )
    })

    it('should handle large arrays efficiently', () => {
        const large = Array.from({ length: 10000 }, (_, i) => i)
        const chunks = chunk(large, 100)

        expect(chunks).toHaveLength(100)
        expect(chunks[0]).toHaveLength(100)
        expect(chunks[99]).toHaveLength(100)
        expect(chunks[0][0]).toBe(0)
        expect(chunks[99][99]).toBe(9999)
    })

    it('should handle single element array', () => {
        expect(chunk([42], 1)).toEqual([[42]])
        expect(chunk([42], 2)).toEqual([[42]])
    })

    it('should work with nested arrays', () => {
        expect(
            chunk(
                [
                    [1, 2],
                    [3, 4],
                    [5, 6],
                ],
                2
            )
        ).toEqual([
            [
                [1, 2],
                [3, 4],
            ],
            [[5, 6]],
        ])
    })

    it('should preserve element references in chunks', () => {
        const obj1 = { id: 1 }
        const obj2 = { id: 2 }
        const result = chunk([obj1, obj2], 1)

        expect(result[0][0]).toBe(obj1)
        expect(result[1][0]).toBe(obj2)
    })

    it('should handle readonly arrays', () => {
        const readonly: readonly number[] = [1, 2, 3, 4, 5]
        expect(chunk(readonly, 2)).toEqual([[1, 2], [3, 4], [5]])
    })

    it('should work with boolean arrays', () => {
        expect(chunk([true, false, true, false], 2)).toEqual([
            [true, false],
            [true, false],
        ])
    })

    it('should handle arrays with undefined and null', () => {
        expect(chunk([1, null, 3, undefined, 5], 2)).toEqual([
            [1, null],
            [3, undefined],
            [5],
        ])
    })
})
