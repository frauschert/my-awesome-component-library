import clamp from './clamp'

test('should return value', () => expect(clamp(0, 10, 5)).toBe(5))
test('should return min', () => expect(clamp(0, 10, -1)).toBe(0))
test('should return max', () => expect(clamp(0, 10, 11)).toBe(10))
test('should throw error', () =>
    expect(() => clamp(0, -1, 5)).toThrow('min cannot be greater than max'))
