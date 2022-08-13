import intersectionBy from '../intersectionBy'

test('should return Peter', () =>
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
    ).toEqual([{ name: 'Peter' }]))
