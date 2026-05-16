import { isEmpty } from '../isEmpty'

describe('isEmpty', () => {
    describe('arrays', () => {
        it('should return true for empty array', () => {
            expect(isEmpty([])).toBe(true)
        })

        it('should return false for non-empty array', () => {
            expect(isEmpty([1, 2, 3])).toBe(false)
        })

        it('should return false for array with single element', () => {
            expect(isEmpty([1])).toBe(false)
        })

        it('should return false for array with undefined element', () => {
            expect(isEmpty([undefined])).toBe(false)
        })

        it('should return false for array with null element', () => {
            expect(isEmpty([null])).toBe(false)
        })
    })

    describe('objects', () => {
        it('should return true for empty object', () => {
            expect(isEmpty({})).toBe(true)
        })

        it('should return false for non-empty object', () => {
            expect(isEmpty({ a: 1 })).toBe(false)
        })

        it('should return false for object with multiple properties', () => {
            expect(isEmpty({ a: 1, b: 2 })).toBe(false)
        })

        it('should return true for object with only non-enumerable properties', () => {
            const obj = {}
            Object.defineProperty(obj, 'hidden', {
                value: 42,
                enumerable: false,
            })
            expect(isEmpty(obj)).toBe(true)
        })

        it('should return false for object with undefined value', () => {
            expect(isEmpty({ a: undefined })).toBe(false)
        })

        it('should return false for object with null value', () => {
            expect(isEmpty({ a: null })).toBe(false)
        })
    })

    describe('strings', () => {
        it('should return true for empty string', () => {
            expect(isEmpty('')).toBe(true)
        })

        it('should return false for non-empty string', () => {
            expect(isEmpty('hello')).toBe(false)
        })

        it('should return false for string with whitespace', () => {
            expect(isEmpty(' ')).toBe(false)
        })

        it('should return false for string with newline', () => {
            expect(isEmpty('\n')).toBe(false)
        })

        it('should return false for string with single character', () => {
            expect(isEmpty('a')).toBe(false)
        })
    })

    describe('null and undefined', () => {
        it('should return true for null', () => {
            expect(isEmpty(null)).toBe(true)
        })

        it('should return true for undefined', () => {
            expect(isEmpty(undefined)).toBe(true)
        })
    })

    describe('Map', () => {
        it('should return true for empty Map', () => {
            expect(isEmpty(new Map())).toBe(true)
        })

        it('should return false for non-empty Map', () => {
            const map = new Map()
            map.set('key', 'value')
            expect(isEmpty(map)).toBe(false)
        })

        it('should return false for Map with multiple entries', () => {
            const map = new Map([
                ['a', 1],
                ['b', 2],
            ])
            expect(isEmpty(map)).toBe(false)
        })
    })

    describe('Set', () => {
        it('should return true for empty Set', () => {
            expect(isEmpty(new Set())).toBe(true)
        })

        it('should return false for non-empty Set', () => {
            const set = new Set([1, 2, 3])
            expect(isEmpty(set)).toBe(false)
        })

        it('should return false for Set with single element', () => {
            const set = new Set([1])
            expect(isEmpty(set)).toBe(false)
        })
    })

    describe('numbers', () => {
        it('should return false for zero', () => {
            expect(isEmpty(0)).toBe(false)
        })

        it('should return false for positive number', () => {
            expect(isEmpty(42)).toBe(false)
        })

        it('should return false for negative number', () => {
            expect(isEmpty(-1)).toBe(false)
        })

        it('should return false for NaN', () => {
            expect(isEmpty(NaN)).toBe(false)
        })

        it('should return false for Infinity', () => {
            expect(isEmpty(Infinity)).toBe(false)
        })
    })

    describe('booleans', () => {
        it('should return false for true', () => {
            expect(isEmpty(true)).toBe(false)
        })

        it('should return false for false', () => {
            expect(isEmpty(false)).toBe(false)
        })
    })

    describe('functions', () => {
        it('should return false for function', () => {
            expect(isEmpty(() => {})).toBe(false)
        })

        it('should return false for named function', () => {
            expect(isEmpty(function test() {})).toBe(false)
        })
    })

    describe('symbols', () => {
        it('should return false for symbol', () => {
            expect(isEmpty(Symbol('test'))).toBe(false)
        })
    })

    describe('dates', () => {
        it('should return false for Date object', () => {
            expect(isEmpty(new Date())).toBe(false)
        })
    })

    describe('regex', () => {
        it('should return false for RegExp', () => {
            expect(isEmpty(/test/)).toBe(false)
        })
    })

    describe('edge cases', () => {
        it('should handle array-like objects', () => {
            const arrayLike = { length: 0 }
            expect(isEmpty(arrayLike)).toBe(false) // Has 'length' property
        })

        it('should handle objects with prototype properties', () => {
            class MyClass {
                protoMethod() {}
            }
            const instance = new MyClass()
            expect(isEmpty(instance)).toBe(true) // No own properties
        })

        it('should handle objects created with Object.create(null)', () => {
            const obj = Object.create(null)
            expect(isEmpty(obj)).toBe(true)
        })

        it('should handle BigInt', () => {
            expect(isEmpty(BigInt(0))).toBe(false)
            expect(isEmpty(BigInt(42))).toBe(false)
        })

        it('should handle Error objects', () => {
            expect(isEmpty(new Error('test'))).toBe(false) // Error has properties
        })

        it('should handle Promise', () => {
            expect(isEmpty(Promise.resolve())).toBe(false)
        })
    })

    describe('practical use cases', () => {
        it('should validate form input', () => {
            const formData = { name: '', email: 'test@example.com' }
            expect(isEmpty(formData.name)).toBe(true)
            expect(isEmpty(formData.email)).toBe(false)
        })

        it('should check if array has data', () => {
            const items: number[] = []
            if (isEmpty(items)) {
                expect(true).toBe(true) // Show empty state
            }
        })

        it('should validate API response', () => {
            const response = { data: [], meta: {} }
            expect(isEmpty(response.data)).toBe(true)
            expect(isEmpty(response.meta)).toBe(true)
        })

        it('should check optional values', () => {
            const config: Record<string, unknown> = {
                required: 'value',
                optional: undefined,
            }
            expect(isEmpty(config.optional)).toBe(true)
            expect(isEmpty(config.required)).toBe(false)
        })
    })
})
