import isUndefined from '../isUndefined'

test('should be undefined', () => expect(isUndefined(undefined)).toBe(true))
test('should not be undefined', () => expect(isUndefined({})).toBe(false))
