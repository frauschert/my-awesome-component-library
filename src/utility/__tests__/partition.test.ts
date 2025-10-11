import { partition } from '../partition'

describe('partition', () => {
    it('should split array based on predicate', () => {
        const [even, odd] = partition([1, 2, 3, 4, 5], (x) => x % 2 === 0)
        expect(even).toEqual([2, 4])
        expect(odd).toEqual([1, 3, 5])
    })

    it('should work with string arrays', () => {
        const [startsWithA, others] = partition(
            ['apple', 'banana', 'avocado', 'cherry'],
            (s) => s.startsWith('a')
        )
        expect(startsWithA).toEqual(['apple', 'avocado'])
        expect(others).toEqual(['banana', 'cherry'])
    })

    it('should handle empty array', () => {
        const [pass, fail] = partition([], (_) => true)
        expect(pass).toEqual([])
        expect(fail).toEqual([])
    })

    it('should handle all elements passing', () => {
        const [pass, fail] = partition([1, 2, 3], (x) => x > 0)
        expect(pass).toEqual([1, 2, 3])
        expect(fail).toEqual([])
    })

    it('should handle all elements failing', () => {
        const [pass, fail] = partition([1, 2, 3], (x) => x > 10)
        expect(pass).toEqual([])
        expect(fail).toEqual([1, 2, 3])
    })

    it('should work with object arrays', () => {
        const users = [
            { name: 'Alice', active: true },
            { name: 'Bob', active: false },
            { name: 'Charlie', active: true },
            { name: 'Dave', active: false },
        ]

        const [active, inactive] = partition(users, (u) => u.active)

        expect(active).toEqual([
            { name: 'Alice', active: true },
            { name: 'Charlie', active: true },
        ])
        expect(inactive).toEqual([
            { name: 'Bob', active: false },
            { name: 'Dave', active: false },
        ])
    })

    it('should pass index to predicate', () => {
        const indices: number[] = []
        partition([10, 20, 30], (_, i) => {
            indices.push(i)
            return i % 2 === 0
        })
        expect(indices).toEqual([0, 1, 2])
    })

    it('should pass array to predicate', () => {
        let arrayArg: readonly number[] | undefined
        const arr = [1, 2, 3]
        partition(arr, (_, __, array) => {
            arrayArg = array
            return true
        })
        expect(arrayArg).toBe(arr)
    })

    it('should use index in predicate logic', () => {
        const [evenIndices, oddIndices] = partition(
            ['a', 'b', 'c', 'd', 'e'],
            (_, i) => i % 2 === 0
        )
        expect(evenIndices).toEqual(['a', 'c', 'e'])
        expect(oddIndices).toEqual(['b', 'd'])
    })

    it('should not mutate original array', () => {
        const original = [1, 2, 3, 4, 5]
        const copy = [...original]
        partition(original, (x) => x % 2 === 0)
        expect(original).toEqual(copy)
    })

    it('should preserve element references', () => {
        const obj1 = { id: 1 }
        const obj2 = { id: 2 }
        const obj3 = { id: 3 }

        const [pass, fail] = partition(
            [obj1, obj2, obj3],
            (o) => o.id % 2 === 0
        )

        expect(pass[0]).toBe(obj2)
        expect(fail[0]).toBe(obj1)
        expect(fail[1]).toBe(obj3)
    })

    it('should handle boolean values', () => {
        const [truthy, falsy] = partition([true, false, true, false], (x) => x)
        expect(truthy).toEqual([true, true])
        expect(falsy).toEqual([false, false])
    })

    it('should handle null and undefined', () => {
        const [notNull, isNull] = partition(
            [1, null, 2, undefined, 3],
            (x) => x != null
        )
        expect(notNull).toEqual([1, 2, 3])
        expect(isNull).toEqual([null, undefined])
    })

    it('should work with complex predicates', () => {
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        const [selected, rejected] = partition(
            numbers,
            (x) => x % 2 === 0 && x > 5
        )
        expect(selected).toEqual([6, 8, 10])
        expect(rejected).toEqual([1, 2, 3, 4, 5, 7, 9])
    })

    it('should handle single element array', () => {
        const [pass, fail] = partition([42], (x) => x > 40)
        expect(pass).toEqual([42])
        expect(fail).toEqual([])
    })

    it('should handle large arrays', () => {
        const large = Array.from({ length: 10000 }, (_, i) => i)
        const [even, odd] = partition(large, (x) => x % 2 === 0)

        expect(even).toHaveLength(5000)
        expect(odd).toHaveLength(5000)
        expect(even[0]).toBe(0)
        expect(odd[0]).toBe(1)
    })

    it('should work with readonly arrays', () => {
        const readonly: readonly number[] = [1, 2, 3, 4, 5]
        const [even, odd] = partition(readonly, (x) => x % 2 === 0)
        expect(even).toEqual([2, 4])
        expect(odd).toEqual([1, 3, 5])
    })

    it('should handle nested arrays', () => {
        const nested = [[1, 2], [3], [4, 5, 6], [7]]
        const [longArrays, shortArrays] = partition(
            nested,
            (arr) => arr.length > 2
        )
        expect(longArrays).toEqual([[4, 5, 6]])
        expect(shortArrays).toEqual([[1, 2], [3], [7]])
    })

    it('should work with predicates that use array argument', () => {
        const [aboveAverage, belowAverage] = partition(
            [1, 2, 3, 4, 5],
            (x, _, arr) => {
                const avg = arr.reduce((sum, n) => sum + n, 0) / arr.length
                return x > avg
            }
        )
        expect(aboveAverage).toEqual([4, 5])
        expect(belowAverage).toEqual([1, 2, 3])
    })

    it('should handle mixed types', () => {
        const mixed: (number | string)[] = [1, 'a', 2, 'b', 3]
        const [numbers, strings] = partition(
            mixed,
            (x) => typeof x === 'number'
        )
        expect(numbers).toEqual([1, 2, 3])
        expect(strings).toEqual(['a', 'b'])
    })

    it('should preserve order', () => {
        const [pass, fail] = partition([5, 1, 8, 3, 9, 2], (x) => x > 4)
        expect(pass).toEqual([5, 8, 9])
        expect(fail).toEqual([1, 3, 2])
    })

    it('should handle predicate with side effects', () => {
        const called: number[] = []
        partition([1, 2, 3], (x) => {
            called.push(x)
            return x % 2 === 0
        })
        expect(called).toEqual([1, 2, 3])
    })

    it('should work for filtering by type guards', () => {
        interface User {
            type: 'user'
            name: string
        }
        interface Admin {
            type: 'admin'
            name: string
            level: number
        }

        type Person = User | Admin

        const people: Person[] = [
            { type: 'user', name: 'Alice' },
            { type: 'admin', name: 'Bob', level: 5 },
            { type: 'user', name: 'Charlie' },
        ]

        const [admins, users] = partition(
            people,
            (p): p is Admin => p.type === 'admin'
        )

        expect(admins).toHaveLength(1)
        expect(users).toHaveLength(2)
        // Type assertion needed for test
        if (admins[0]) {
            expect((admins[0] as Admin).level).toBe(5)
        }
    })
})
