import groupBy from './groupBy'

test('should group vehicles by make', () =>
    expect(
        groupBy(
            [
                { make: 'tesla', model: '3', price: 1000 },
                { make: 'tesla', model: 'y', price: 2000 },
                { make: 'ford', model: 'mach-e', price: 1000 },
            ],
            'make'
        )
    ).toEqual({
        tesla: [
            {
                make: 'tesla',
                model: '3',
                price: 1000,
            },
            {
                make: 'tesla',
                model: 'y',
                price: 2000,
            },
        ],
        ford: [
            {
                make: 'ford',
                model: 'mach-e',
                price: 1000,
            },
        ],
    }))
