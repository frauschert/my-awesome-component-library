import distinctBy from '../distinctBy'

describe('distinctBy', () => {
    it('should remove duplicates by property key', () => {
        const users = [
            { id: 1, name: 'Alice' },
            { id: 2, name: 'Bob' },
            { id: 1, name: 'Alice Clone' },
            { id: 3, name: 'Charlie' },
            { id: 2, name: 'Bob Clone' },
        ]

        expect(distinctBy(users, 'id')).toEqual([
            { id: 1, name: 'Alice' },
            { id: 2, name: 'Bob' },
            { id: 3, name: 'Charlie' },
        ])
    })

    it('should remove duplicates by selector function', () => {
        const users = [
            { id: 1, email: 'ALICE@example.com' },
            { id: 2, email: 'bob@example.com' },
            { id: 3, email: 'alice@example.com' },
            { id: 4, email: 'charlie@example.com' },
        ]

        expect(distinctBy(users, (u) => u.email.toLowerCase())).toEqual([
            { id: 1, email: 'ALICE@example.com' },
            { id: 2, email: 'bob@example.com' },
            { id: 4, email: 'charlie@example.com' },
        ])
    })

    it('should preserve the first occurrence', () => {
        const items = [
            { id: 1, value: 'first' },
            { id: 1, value: 'second' },
            { id: 1, value: 'third' },
        ]

        expect(distinctBy(items, 'id')).toEqual([{ id: 1, value: 'first' }])
    })

    it('should work with primitive arrays using selector', () => {
        const numbers = [1, 2, 3, 11, 12, 13, 21, 22]

        expect(distinctBy(numbers, (n) => n % 10)).toEqual([1, 2, 3])
    })

    it('should handle empty arrays', () => {
        expect(distinctBy([], 'id')).toEqual([])
        expect(distinctBy([], (x) => x)).toEqual([])
    })

    it('should handle arrays with no duplicates', () => {
        const users = [
            { id: 1, name: 'Alice' },
            { id: 2, name: 'Bob' },
            { id: 3, name: 'Charlie' },
        ]

        expect(distinctBy(users, 'id')).toEqual(users)
    })

    it('should handle arrays where all items are duplicates', () => {
        const items = [
            { type: 'A', value: 1 },
            { type: 'A', value: 2 },
            { type: 'A', value: 3 },
        ]

        expect(distinctBy(items, 'type')).toEqual([{ type: 'A', value: 1 }])
    })

    it('should work with nested property access via selector', () => {
        const users = [
            { id: 1, profile: { country: 'US' } },
            { id: 2, profile: { country: 'UK' } },
            { id: 3, profile: { country: 'US' } },
            { id: 4, profile: { country: 'CA' } },
        ]

        expect(distinctBy(users, (u) => u.profile.country)).toEqual([
            { id: 1, profile: { country: 'US' } },
            { id: 2, profile: { country: 'UK' } },
            { id: 4, profile: { country: 'CA' } },
        ])
    })

    it('should handle complex selector logic', () => {
        const products = [
            { name: 'Widget', price: 10.5 },
            { name: 'Gadget', price: 10.7 },
            { name: 'Doohickey', price: 15.2 },
            { name: 'Thingamajig', price: 10.3 },
        ]

        // Group by rounded price
        expect(distinctBy(products, (p) => Math.round(p.price))).toEqual([
            { name: 'Widget', price: 10.5 },
            { name: 'Doohickey', price: 15.2 },
            { name: 'Thingamajig', price: 10.3 },
        ])
    })

    it('should work with string arrays using identity selector', () => {
        const tags = ['react', 'typescript', 'react', 'jest', 'typescript']

        expect(distinctBy(tags, (tag) => tag)).toEqual([
            'react',
            'typescript',
            'jest',
        ])
    })

    it('should handle null and undefined values', () => {
        const items = [
            { id: 1, optional: null },
            { id: 2, optional: undefined },
            { id: 3, optional: null },
            { id: 4, optional: 'value' },
        ]

        expect(distinctBy(items, 'optional')).toEqual([
            { id: 1, optional: null },
            { id: 2, optional: undefined },
            { id: 4, optional: 'value' },
        ])
    })
})
