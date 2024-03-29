import deepEqual from '../deepEqual'

const testObj = {
    id: 1,
    name: 'John',
    someOtherObject: {
        age: 18,
    },
}

test('should return true', () => {
    const result = deepEqual(testObj, testObj)
    expect(result).toBe(true)
})

test('should return false', () => {
    const result = deepEqual(testObj, {
        ...testObj,
        someOtherObject: { age: 200 },
    })
    expect(result).toBe(false)
})

test('should return false (different key length)', () => {
    const result = deepEqual(testObj, {
        ...testObj,
        onKeyMore: true,
    } as never)
    expect(result).toBe(false)
})
