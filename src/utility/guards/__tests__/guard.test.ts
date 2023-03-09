import {
    isArrayOf,
    isNumber,
    isString,
    isObject,
    or,
    isUnion,
    isIntersection,
    isLiteral,
    isOneOf,
    isEnum,
} from '../guard'

test('isArrayOf', () => {
    const isStringArray = isArrayOf(isString)
    expect(isStringArray(['This', 'is', 'just', 'a', 'test'])).toBeTruthy()
    expect(isStringArray(['This', 'is', 1, 'other', 'test'])).toBeFalsy()
})

test('isObject', () => {
    const typeGuard = isObject({ name: isString, age: isNumber })
    expect(typeGuard({ name: 'John', age: 42 })).toBeTruthy()
    expect(typeGuard({ age: 42 })).toBeFalsy()
})

test('or', () => {
    const isStringOrNumber = or(isString, isNumber)
    expect(isStringOrNumber(42)).toBeTruthy()
    expect(isStringOrNumber('42')).toBeTruthy()
    expect(isStringOrNumber(true)).toBeFalsy()
})

test('isUnion', () => {
    const isStringOrNumber = isUnion([isString, isNumber])
    expect(isStringOrNumber(42)).toBeTruthy()
    expect(isStringOrNumber('42')).toBeTruthy()
    expect(isStringOrNumber(true)).toBeFalsy()
})

test('isIntersection', () => {
    const typeGuard = isIntersection([
        isObject({ name: isString }),
        isObject({ age: isNumber }),
    ])
    expect(typeGuard({ name: 'John', age: 42 })).toBeTruthy()
    expect(typeGuard({ name: 'John' })).toBeFalsy()
    expect(typeGuard({ name: 'John', age: '42' })).toBeFalsy()
})

test('isLiteral', () => {
    const isJohn = isLiteral('John')
    expect(isJohn('John')).toBeTruthy()
    expect(isJohn('Doe')).toBeFalsy()
})

test('isOneOf', () => {
    const isAOrBOrC = isOneOf(['A', 'B', 'C'])
    expect(isAOrBOrC('A')).toBeTruthy()
    expect(isAOrBOrC('B')).toBeTruthy()
    expect(isAOrBOrC('C')).toBeTruthy()
    expect(isAOrBOrC('D')).toBeFalsy()
})

test('isEnum', () => {
    enum Level {
        Info,
        Warning,
        Error,
    }
    const isLevelEnum = isEnum(Level)
    expect(isLevelEnum('Info')).toBeTruthy()
    expect(isLevelEnum(0)).toBeTruthy()
    expect(isLevelEnum(Level.Error)).toBeTruthy()
    expect(isLevelEnum('Fatal')).toBeFalsy()
    expect(isLevelEnum(3)).toBeFalsy()
})
