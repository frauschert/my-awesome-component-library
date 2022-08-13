import none from '../none'

test('should return true', () =>
    expect(none((x) => x % 2 === 0, [1, 3, 5])).toEqual(true))
test('should return false', () =>
    expect(none((x) => x % 2 === 0, [1, 3, 4])).toEqual(false))
