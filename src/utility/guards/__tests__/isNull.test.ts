import isNull from '../isNull'

test('should be null', () => expect(isNull(null)).toBe(true))
test('should not be null', () => expect(isNull({})).toBe(false))
