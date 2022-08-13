import pluck from '../pluck'

test('should return ["Batman", "Robin", "Joker"]', () =>
    expect(
        pluck('name', [
            { name: 'Batman' },
            { name: 'Robin' },
            { name: 'Joker' },
        ])
    ).toEqual(['Batman', 'Robin', 'Joker']))
