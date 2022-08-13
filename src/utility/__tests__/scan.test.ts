import scan from './scan'

test('should add every number from 1-6', () =>
    expect(scan((x, y) => x + y, 0, [1, 2, 3, 4, 5, 6])).toEqual([
        1, 3, 6, 10, 15, 21,
    ]))
