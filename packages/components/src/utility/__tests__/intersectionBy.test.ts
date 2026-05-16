import intersectionBy from '../intersectionBy'

describe('intersectionBy', () => {
    it('should return items from listA that exist in listB by property key', () => {
        const usersA = [
            { id: 1, name: 'Alice' },
            { id: 2, name: 'Bob' },
            { id: 3, name: 'Charlie' },
        ]
        const usersB = [
            { id: 1, name: 'Alice Clone' },
            { id: 3, name: 'Charlie Clone' },
            { id: 4, name: 'David' },
        ]

        expect(intersectionBy(usersA, usersB, 'id')).toEqual([
            { id: 1, name: 'Alice' },
            { id: 3, name: 'Charlie' },
        ])
    })

    it('should remove duplicates from listA', () => {
        expect(
            intersectionBy(
                [
                    { name: 'Peter' },
                    { name: 'Tony' },
                    { name: 'Natasha' },
                    { name: 'Peter' },
                ],
                [{ name: 'Peter' }, { name: 'Steven' }],
                'name'
            )
        ).toEqual([{ name: 'Peter' }])
    })

    it('should work with selector functions', () => {
        const listA = [
            { id: 1, email: 'ALICE@example.com' },
            { id: 2, email: 'bob@example.com' },
            { id: 3, email: 'charlie@example.com' },
        ]
        const listB = [
            { id: 10, email: 'alice@example.com' },
            { id: 20, email: 'charlie@example.com' },
        ]

        expect(
            intersectionBy(listA, listB, (u) => u.email.toLowerCase())
        ).toEqual([
            { id: 1, email: 'ALICE@example.com' },
            { id: 3, email: 'charlie@example.com' },
        ])
    })

    it('should work with primitives using selector functions', () => {
        const numbersA = [11, 12, 21, 22, 31]
        const numbersB = [41, 12, 52]

        expect(intersectionBy(numbersA, numbersB, (n) => n % 10)).toEqual([
            11, 12,
        ])
    })

    it('should return empty array when no intersection', () => {
        const usersA = [
            { id: 1, name: 'Alice' },
            { id: 2, name: 'Bob' },
        ]
        const usersB = [
            { id: 3, name: 'Charlie' },
            { id: 4, name: 'David' },
        ]

        expect(intersectionBy(usersA, usersB, 'id')).toEqual([])
    })

    it('should handle empty arrays', () => {
        const users = [{ id: 1, name: 'Alice' }]

        expect(intersectionBy([], users, 'id')).toEqual([])
        expect(intersectionBy(users, [], 'id')).toEqual([])
        expect(intersectionBy([], [], 'id')).toEqual([])
    })

    it('should return all unique items from listA when all exist in listB', () => {
        const usersA = [
            { id: 1, name: 'Alice' },
            { id: 2, name: 'Bob' },
            { id: 1, name: 'Alice Duplicate' },
        ]
        const usersB = [
            { id: 1, name: 'Alice Clone' },
            { id: 2, name: 'Bob Clone' },
            { id: 3, name: 'Charlie' },
        ]

        expect(intersectionBy(usersA, usersB, 'id')).toEqual([
            { id: 1, name: 'Alice' },
            { id: 2, name: 'Bob' },
        ])
    })

    it('should preserve order from listA', () => {
        const usersA = [
            { id: 3, name: 'Charlie' },
            { id: 1, name: 'Alice' },
            { id: 2, name: 'Bob' },
        ]
        const usersB = [
            { id: 1, name: 'Alice' },
            { id: 2, name: 'Bob' },
            { id: 3, name: 'Charlie' },
        ]

        expect(intersectionBy(usersA, usersB, 'id')).toEqual([
            { id: 3, name: 'Charlie' },
            { id: 1, name: 'Alice' },
            { id: 2, name: 'Bob' },
        ])
    })

    it('should work with complex selector logic', () => {
        const productsA = [
            { name: 'Widget', price: 10.5 },
            { name: 'Gadget', price: 20.7 },
            { name: 'Doohickey', price: 10.3 },
        ]
        const productsB = [
            { name: 'Thing', price: 10.8 },
            { name: 'Stuff', price: 30.2 },
        ]

        // Match by rounded price
        expect(
            intersectionBy(productsA, productsB, (p) => Math.round(p.price))
        ).toEqual([{ name: 'Widget', price: 10.5 }])
    })

    it('should handle string arrays', () => {
        const tagsA = ['react', 'typescript', 'jest', 'react']
        const tagsB = ['typescript', 'node', 'express']

        expect(intersectionBy(tagsA, tagsB, (tag) => tag)).toEqual([
            'typescript',
        ])
    })

    it('should handle null and undefined values', () => {
        const itemsA = [
            { id: 1, optional: null },
            { id: 2, optional: undefined },
            { id: 3, optional: 'value' },
        ]
        const itemsB = [
            { id: 10, optional: null },
            { id: 20, optional: 'value' },
        ]

        expect(intersectionBy(itemsA, itemsB, 'optional')).toEqual([
            { id: 1, optional: null },
            { id: 3, optional: 'value' },
        ])
    })
})
