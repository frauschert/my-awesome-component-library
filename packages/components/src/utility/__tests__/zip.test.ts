import zip from '../zip'

test('should zip every value of a to its corresponding value of b', () =>
    expect(zip(['a', 'b', 'c', 'd'], [1, 2, 3, 4])).toEqual([
        ['a', 1],
        ['b', 2],
        ['c', 3],
        ['d', 4],
    ]))
