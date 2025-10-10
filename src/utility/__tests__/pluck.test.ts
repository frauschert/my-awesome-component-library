import pluck from '../pluck'

describe('pluck', () => {
    it('should pluck string values', () => {
        expect(
            pluck('name', [
                { name: 'Batman' },
                { name: 'Robin' },
                { name: 'Joker' },
            ])
        ).toEqual(['Batman', 'Robin', 'Joker'])
    })

    it('should pluck numeric values', () => {
        const items = [
            { id: 1, price: 10.5 },
            { id: 2, price: 20.0 },
            { id: 3, price: 15.75 },
        ]
        expect(pluck('price', items)).toEqual([10.5, 20.0, 15.75])
    })

    it('should pluck from empty array', () => {
        expect(pluck('name', [])).toEqual([])
    })

    it('should handle single item', () => {
        expect(pluck('name', [{ name: 'Solo' }])).toEqual(['Solo'])
    })

    it('should pluck nested objects', () => {
        const data = [
            { user: { name: 'Alice' } },
            { user: { name: 'Bob' } },
            { user: { name: 'Charlie' } },
        ]
        expect(pluck('user', data)).toEqual([
            { name: 'Alice' },
            { name: 'Bob' },
            { name: 'Charlie' },
        ])
    })

    it('should pluck arrays', () => {
        const data = [
            { tags: ['a', 'b'] },
            { tags: ['c', 'd'] },
            { tags: ['e'] },
        ]
        expect(pluck('tags', data)).toEqual([['a', 'b'], ['c', 'd'], ['e']])
    })

    it('should pluck undefined values', () => {
        const data = [
            { name: 'Alice', age: undefined },
            { name: 'Bob', age: undefined },
        ]
        expect(pluck('age', data)).toEqual([undefined, undefined])
    })

    it('should pluck null values', () => {
        const data = [
            { name: 'Alice', value: null },
            { name: 'Bob', value: null },
        ]
        expect(pluck('value', data)).toEqual([null, null])
    })

    it('should pluck boolean values', () => {
        const data = [
            { name: 'Alice', active: true },
            { name: 'Bob', active: false },
            { name: 'Charlie', active: true },
        ]
        expect(pluck('active', data)).toEqual([true, false, true])
    })

    it('should pluck mixed types', () => {
        const data: Array<{ value: string | number | boolean }> = [
            { value: 'string' },
            { value: 42 },
            { value: true },
        ]
        expect(pluck('value', data)).toEqual(['string', 42, true])
    })

    it('should pluck from large arrays', () => {
        const largeArray = Array.from({ length: 1000 }, (_, i) => ({
            id: i,
            value: i * 2,
        }))
        const result = pluck('value', largeArray)
        expect(result).toHaveLength(1000)
        expect(result[0]).toBe(0)
        expect(result[999]).toBe(1998)
    })

    it('should not modify original array', () => {
        const original = [
            { name: 'Alice', age: 30 },
            { name: 'Bob', age: 25 },
        ]
        const copy = [...original]
        pluck('name', original)
        expect(original).toEqual(copy)
    })

    it('should preserve order', () => {
        const data = [
            { order: 3 },
            { order: 1 },
            { order: 2 },
            { order: 5 },
            { order: 4 },
        ]
        expect(pluck('order', data)).toEqual([3, 1, 2, 5, 4])
    })

    it('should work with date objects', () => {
        const date1 = new Date('2025-01-01')
        const date2 = new Date('2025-02-01')
        const data = [
            { name: 'Event 1', date: date1 },
            { name: 'Event 2', date: date2 },
        ]
        expect(pluck('date', data)).toEqual([date1, date2])
    })

    it('should work with function values', () => {
        const fn1 = () => 'a'
        const fn2 = () => 'b'
        const data = [{ fn: fn1 }, { fn: fn2 }]
        expect(pluck('fn', data)).toEqual([fn1, fn2])
    })
})
