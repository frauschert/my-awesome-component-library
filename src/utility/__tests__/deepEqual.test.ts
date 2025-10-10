import deepEqual from '../deepEqual'

const testObj = {
    id: 1,
    name: 'John',
    someOtherObject: {
        age: 18,
    },
}

describe('deepEqual', () => {
    describe('primitives', () => {
        it('should compare numbers', () => {
            expect(deepEqual(1, 1)).toBe(true)
            expect(deepEqual(1, 2)).toBe(false)
            expect(deepEqual(0, -0)).toBe(true)
        })

        it('should compare strings', () => {
            expect(deepEqual('hello', 'hello')).toBe(true)
            expect(deepEqual('hello', 'world')).toBe(false)
        })

        it('should compare booleans', () => {
            expect(deepEqual(true, true)).toBe(true)
            expect(deepEqual(false, false)).toBe(true)
            expect(deepEqual(true, false)).toBe(false)
        })

        it('should handle NaN', () => {
            expect(deepEqual(NaN, NaN)).toBe(true)
        })

        it('should handle null and undefined', () => {
            expect(deepEqual(null, null)).toBe(true)
            expect(deepEqual(undefined, undefined)).toBe(true)
            expect(deepEqual(null, undefined)).toBe(false)
        })
    })

    describe('objects', () => {
        it('should return true for same reference', () => {
            const result = deepEqual(testObj, testObj)
            expect(result).toBe(true)
        })

        it('should return false for different nested values', () => {
            const result = deepEqual(testObj, {
                ...testObj,
                someOtherObject: { age: 200 },
            })
            expect(result).toBe(false)
        })

        it('should return false for different key length', () => {
            const result = deepEqual(testObj, {
                ...testObj,
                onKeyMore: true,
            } as never)
            expect(result).toBe(false)
        })

        it('should compare empty objects', () => {
            expect(deepEqual({}, {})).toBe(true)
        })

        it('should compare nested objects', () => {
            const obj1 = { a: { b: { c: 1 } } }
            const obj2 = { a: { b: { c: 1 } } }
            expect(deepEqual(obj1, obj2)).toBe(true)
        })

        it('should return false for different nested structures', () => {
            const obj1 = { a: { b: { c: 1 } } }
            const obj2 = { a: { b: { c: 2 } } }
            expect(deepEqual(obj1, obj2)).toBe(false)
        })
    })

    describe('arrays', () => {
        it('should compare arrays', () => {
            expect(deepEqual([1, 2, 3], [1, 2, 3])).toBe(true)
            expect(deepEqual([1, 2, 3], [1, 2, 4])).toBe(false)
        })

        it('should compare empty arrays', () => {
            expect(deepEqual([], [])).toBe(true)
        })

        it('should return false for different array lengths', () => {
            expect(deepEqual([1, 2], [1, 2, 3])).toBe(false)
        })

        it('should compare nested arrays', () => {
            expect(
                deepEqual(
                    [
                        [1, 2],
                        [3, 4],
                    ],
                    [
                        [1, 2],
                        [3, 4],
                    ]
                )
            ).toBe(true)
            expect(
                deepEqual(
                    [
                        [1, 2],
                        [3, 4],
                    ],
                    [
                        [1, 2],
                        [3, 5],
                    ]
                )
            ).toBe(false)
        })

        it('should compare arrays of objects', () => {
            expect(
                deepEqual([{ id: 1 }, { id: 2 }], [{ id: 1 }, { id: 2 }])
            ).toBe(true)
            expect(
                deepEqual([{ id: 1 }, { id: 2 }], [{ id: 1 }, { id: 3 }])
            ).toBe(false)
        })
    })

    describe('dates', () => {
        it('should compare dates', () => {
            const date1 = new Date('2025-01-01')
            const date2 = new Date('2025-01-01')
            expect(deepEqual(date1, date2)).toBe(true)
        })

        it('should return false for different dates', () => {
            const date1 = new Date('2025-01-01')
            const date2 = new Date('2025-01-02')
            expect(deepEqual(date1, date2)).toBe(false)
        })

        it('should compare invalid dates', () => {
            const invalid1 = new Date('invalid')
            const invalid2 = new Date('invalid')
            expect(deepEqual(invalid1, invalid2)).toBe(true)
        })
    })

    describe('RegExp', () => {
        it('should compare RegExp', () => {
            expect(deepEqual(/abc/g, /abc/g)).toBe(true)
            expect(deepEqual(/abc/i, /abc/i)).toBe(true)
        })

        it('should return false for different RegExp', () => {
            expect(deepEqual(/abc/, /def/)).toBe(false)
            expect(deepEqual(/abc/g, /abc/i)).toBe(false)
        })
    })

    describe('mixed types', () => {
        it('should return false for different types', () => {
            expect(deepEqual(1, '1')).toBe(false)
            expect(deepEqual([], {})).toBe(false)
            expect(deepEqual(null, {})).toBe(false)
            expect(deepEqual(undefined, null)).toBe(false)
        })

        it('should handle complex nested structures', () => {
            const obj1 = {
                user: {
                    name: 'Alice',
                    tags: ['admin', 'user'],
                    created: new Date('2025-01-01'),
                    settings: {
                        theme: 'dark',
                        notifications: true,
                    },
                },
            }
            const obj2 = {
                user: {
                    name: 'Alice',
                    tags: ['admin', 'user'],
                    created: new Date('2025-01-01'),
                    settings: {
                        theme: 'dark',
                        notifications: true,
                    },
                },
            }
            expect(deepEqual(obj1, obj2)).toBe(true)
        })

        it('should detect differences in complex nested structures', () => {
            const obj1 = {
                user: {
                    name: 'Alice',
                    tags: ['admin', 'user'],
                },
            }
            const obj2 = {
                user: {
                    name: 'Alice',
                    tags: ['admin', 'moderator'],
                },
            }
            expect(deepEqual(obj1, obj2)).toBe(false)
        })
    })

    describe('edge cases', () => {
        it('should handle objects with array properties', () => {
            expect(deepEqual({ arr: [1, 2, 3] }, { arr: [1, 2, 3] })).toBe(true)
            expect(deepEqual({ arr: [1, 2, 3] }, { arr: [1, 2, 4] })).toBe(
                false
            )
        })

        it('should handle arrays with object elements', () => {
            expect(deepEqual([{ a: 1 }, { b: 2 }], [{ a: 1 }, { b: 2 }])).toBe(
                true
            )
        })

        it('should handle null in objects', () => {
            expect(deepEqual({ a: null }, { a: null })).toBe(true)
            expect(deepEqual({ a: null }, { a: undefined })).toBe(false)
        })

        it('should handle undefined in arrays', () => {
            expect(deepEqual([1, undefined, 3], [1, undefined, 3])).toBe(true)
            expect(deepEqual([1, undefined, 3], [1, null, 3])).toBe(false)
        })
    })
})
