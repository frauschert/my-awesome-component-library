import isNil from '../isNil'

test('should be nil', () => {
    expect(isNil(null)).toBe(true)
    expect(isNil(undefined)).toBe(true)
})
test('should not be nil', () => expect(isNil({})).toBe(false))
