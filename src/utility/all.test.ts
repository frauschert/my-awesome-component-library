import all from './all'

test('should return true', () =>
    expect(all((x) => x === 3, [3, 3, 3])).toEqual(true))
test('should return false', () =>
    expect(all((x) => x === 3, [3, 2, 3])).toEqual(false))
