import { isArrayOf, isNumber, isString, isType, or } from '../guard'

test('isArrayOf', () => {
    const isStringArray = isArrayOf(isString)
    expect(isStringArray(['This', 'is', 'just', 'a', 'test'])).toBeTruthy()
    expect(isStringArray(['This', 'is', 1, 'other', 'test'])).toBeFalsy()
})

test('isType', () => {
    const typeGuard = isType({ name: isString, age: isNumber })
    expect(typeGuard({ name: 'John', age: 42 })).toBeTruthy()
    expect(typeGuard({ name: 'John', age: '42' })).toBeFalsy()
})

test('or', () => {
    const isStringOrNumber = or(isString, isNumber)
    expect(isStringOrNumber(42)).toBeTruthy()
    expect(isStringOrNumber('42')).toBeTruthy()
    expect(isStringOrNumber(true)).toBeFalsy()
})
