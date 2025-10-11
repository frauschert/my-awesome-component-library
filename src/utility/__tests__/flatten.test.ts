import { flatten } from '../flatten'

describe('flatten', () => {
    describe('basic flattening', () => {
        it('should flatten one level by default', () => {
            const input = [1, [2, 3], [4, [5]]]
            const result = flatten(input)
            expect(result).toEqual([1, 2, 3, 4, [5]])
        })

        it('should flatten simple nested array', () => {
            const input = [
                [1, 2],
                [3, 4],
                [5, 6],
            ]
            const result = flatten(input)
            expect(result).toEqual([1, 2, 3, 4, 5, 6])
        })

        it('should return same array if not nested', () => {
            const input = [1, 2, 3, 4, 5]
            const result = flatten(input)
            expect(result).toEqual([1, 2, 3, 4, 5])
        })

        it('should handle empty array', () => {
            const result = flatten([])
            expect(result).toEqual([])
        })

        it('should handle array with single element', () => {
            const result = flatten([1])
            expect(result).toEqual([1])
        })

        it('should handle array with single nested element', () => {
            const result = flatten([[1]])
            expect(result).toEqual([1])
        })
    })

    describe('depth parameter', () => {
        it('should flatten to depth 1', () => {
            const input = [1, [2, [3, [4]]]]
            const result = flatten(input, 1)
            expect(result).toEqual([1, 2, [3, [4]]])
        })

        it('should flatten to depth 2', () => {
            const input = [1, [2, [3, [4]]]]
            const result = flatten(input, 2)
            expect(result).toEqual([1, 2, 3, [4]])
        })

        it('should flatten to depth 3', () => {
            const input = [1, [2, [3, [4]]]]
            const result = flatten(input, 3)
            expect(result).toEqual([1, 2, 3, 4])
        })

        it('should flatten completely with Infinity', () => {
            const input = [1, [2, [3, [4, [5, [6]]]]]]
            const result = flatten(input, Infinity)
            expect(result).toEqual([1, 2, 3, 4, 5, 6])
        })

        it('should not flatten with depth 0', () => {
            const input = [1, [2, [3]]]
            const result = flatten(input, 0)
            expect(result).toEqual([1, [2, [3]]])
        })

        it('should not flatten with negative depth', () => {
            const input = [1, [2, [3]]]
            const result = flatten(input, -1)
            expect(result).toEqual([1, [2, [3]]])
        })
    })

    describe('mixed nesting levels', () => {
        it('should handle mixed depth arrays', () => {
            const input = [1, [2], [[3]], [[[4]]]]
            const result = flatten(input)
            expect(result).toEqual([1, 2, [3], [[4]]])
        })

        it('should handle mixed depth with depth 2', () => {
            const input = [1, [2], [[3]], [[[4]]]]
            const result = flatten(input, 2)
            expect(result).toEqual([1, 2, 3, [4]])
        })

        it('should handle arrays at different positions', () => {
            const input = [1, 2, [3, 4], 5, [6, [7]], 8]
            const result = flatten(input)
            expect(result).toEqual([1, 2, 3, 4, 5, 6, [7], 8])
        })
    })

    describe('data types', () => {
        it('should flatten arrays of strings', () => {
            const input = [
                ['a', 'b'],
                ['c', 'd'],
            ]
            const result = flatten(input)
            expect(result).toEqual(['a', 'b', 'c', 'd'])
        })

        it('should flatten arrays of objects', () => {
            const input = [[{ id: 1 }, { id: 2 }], [{ id: 3 }]]
            const result = flatten(input)
            expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }])
        })

        it('should flatten mixed types', () => {
            const input = [1, ['a'], [true, [null]]]
            const result = flatten(input)
            expect(result).toEqual([1, 'a', true, [null]])
        })

        it('should handle arrays with null values', () => {
            const input = [1, [null, 2], [3, null]]
            const result = flatten(input)
            expect(result).toEqual([1, null, 2, 3, null])
        })

        it('should handle arrays with undefined values', () => {
            const input = [1, [undefined, 2], [3, undefined]]
            const result = flatten(input)
            expect(result).toEqual([1, undefined, 2, 3, undefined])
        })
    })

    describe('immutability', () => {
        it('should not mutate original array', () => {
            const input = [1, [2, 3], [4, [5]]]
            const inputCopy = JSON.parse(JSON.stringify(input))
            flatten(input)
            expect(input).toEqual(inputCopy)
        })

        it('should return new array reference', () => {
            const input = [1, [2, 3]]
            const result = flatten(input)
            expect(result).not.toBe(input)
        })

        it('should not mutate nested arrays', () => {
            const nested = [2, 3]
            const input = [1, nested, 4]
            flatten(input)
            expect(nested).toEqual([2, 3])
        })
    })

    describe('empty and sparse arrays', () => {
        it('should handle empty nested arrays', () => {
            const input = [1, [], 2, [[]], 3]
            const result = flatten(input)
            expect(result).toEqual([1, 2, [], 3])
        })

        it('should flatten array with only empty arrays', () => {
            const input = [[], [[]], [[[]]]]
            const result = flatten(input, Infinity)
            expect(result).toEqual([])
        })

        it('should handle arrays with explicit undefined', () => {
            const input = [1, undefined, 2, [3, undefined, 4]]
            const result = flatten(input)
            expect(result).toEqual([1, undefined, 2, 3, undefined, 4])
        })
    })

    describe('large arrays', () => {
        it('should handle large flat arrays', () => {
            const input = Array.from({ length: 1000 }, (_, i) => i)
            const result = flatten(input)
            expect(result).toHaveLength(1000)
            expect(result[0]).toBe(0)
            expect(result[999]).toBe(999)
        })

        it('should handle large nested arrays', () => {
            const input = Array.from({ length: 100 }, (_, i) => [i, i + 1])
            const result = flatten(input)
            expect(result).toHaveLength(200)
        })

        it('should handle deeply nested array', () => {
            let nested: unknown = 1
            for (let i = 0; i < 10; i++) {
                nested = [nested]
            }
            const result = flatten(nested as number[], Infinity)
            expect(result).toEqual([1])
        })
    })

    describe('practical use cases', () => {
        it('should flatten pagination results', () => {
            const pages = [
                [{ id: 1 }, { id: 2 }],
                [{ id: 3 }, { id: 4 }],
                [{ id: 5 }],
            ]
            const allItems = flatten(pages)
            expect(allItems).toHaveLength(5)
            expect(allItems[0]).toEqual({ id: 1 })
        })

        it('should merge grouped data', () => {
            const grouped = [
                ['apple', 'banana'],
                ['carrot', 'daikon'],
                ['eggplant'],
            ]
            const all = flatten(grouped)
            expect(all).toEqual([
                'apple',
                'banana',
                'carrot',
                'daikon',
                'eggplant',
            ])
        })

        it('should flatten nested categories', () => {
            const categories = [
                ['Electronics', ['Phones', 'Laptops']],
                ['Clothing', ['Shirts', ['T-Shirts', 'Dress Shirts']]],
            ]
            const level1 = flatten(categories, 1)
            expect(level1).toEqual([
                'Electronics',
                ['Phones', 'Laptops'],
                'Clothing',
                ['Shirts', ['T-Shirts', 'Dress Shirts']],
            ])
        })

        it('should process nested task lists', () => {
            const tasks = [
                ['Task 1', 'Task 2'],
                ['Task 3', ['Subtask 3.1', 'Subtask 3.2']],
            ]
            const flatTasks = flatten(tasks, 2)
            expect(flatTasks).toEqual([
                'Task 1',
                'Task 2',
                'Task 3',
                'Subtask 3.1',
                'Subtask 3.2',
            ])
        })

        it('should combine array chunks', () => {
            const chunks = [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9],
            ]
            const combined = flatten(chunks)
            expect(combined).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9])
        })
    })

    describe('edge cases', () => {
        it('should handle array with only undefined', () => {
            const input = [undefined, [undefined], [[undefined]]]
            const result = flatten(input, Infinity)
            expect(result).toEqual([undefined, undefined, undefined])
        })

        it('should handle array with only null', () => {
            const input = [null, [null], [[null]]]
            const result = flatten(input, Infinity)
            expect(result).toEqual([null, null, null])
        })

        it('should preserve order', () => {
            const input = [
                [3, 2, 1],
                [6, 5, 4],
                [9, 8, 7],
            ]
            const result = flatten(input)
            expect(result).toEqual([3, 2, 1, 6, 5, 4, 9, 8, 7])
        })

        it('should handle function values', () => {
            const fn1 = () => 1
            const fn2 = () => 2
            const input = [[fn1], [fn2]]
            const result = flatten(input)
            expect(result).toHaveLength(2)
            expect(result[0]).toBe(fn1)
            expect(result[1]).toBe(fn2)
        })
    })
})
