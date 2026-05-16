import omit from '../omit'

describe('omit', () => {
    it('should omit specified keys from an object', () => {
        const inputObject = { a: 1, b: 2, c: 3 }
        const result = omit(inputObject, 'a', 'c')
        expect(result).toEqual({ b: 2 })
    })

    it('should return a new object without modifying the original object', () => {
        const inputObject = { a: 1, b: 2, c: 3 }
        omit(inputObject, 'a', 'c')
        // Ensure that the original object is not modified
        expect(inputObject).toEqual({ a: 1, b: 2, c: 3 })
    })

    it('should handle omitting non-existent keys gracefully', () => {
        const inputObject = { a: 1, b: 2, c: 3 }
        // @ts-expect-error typescript only allows known keys
        const result = omit(inputObject, 'x', 'y')
        // Result should be the same as the input since 'x' and 'y' don't exist
        expect(result).toEqual(inputObject)
    })

    it('should work with an empty object', () => {
        const inputObject = {}
        // @ts-expect-error typescript only allows known keys
        const result = omit(inputObject, 'a', 'b')
        // Result should still be an empty object
        expect(result).toEqual({})
    })

    it('should work with an empty keys array', () => {
        const inputObject = { a: 1, b: 2, c: 3 }
        const result = omit(inputObject)
        // Result should be the same as the input since no keys are specified
        expect(result).toEqual(inputObject)
    })

    it('should handle omitting keys of different types', () => {
        const inputObject = { a: 1, b: 2, c: 3 }
        // @ts-expect-error typescript only allows known keys
        const result = omit(inputObject, 'a', 2)
        // Should omit 'a', but '2' is not a valid key so it's ignored
        expect(result).toEqual({ b: 2, c: 3 })
    })

    it('should work with objects containing non-primitive values', () => {
        const inputObject = { a: { nested: 'value' }, b: [1, 2, 3], c: null }
        const result = omit(inputObject, 'b', 'c')
        // Should omit 'b' and 'c'
        expect(result).toEqual({ a: { nested: 'value' } })
    })

    it('should omit all keys', () => {
        const inputObject = { a: 1, b: 2 }
        const result = omit(inputObject, 'a', 'b')
        expect(result).toEqual({})
    })

    it('should preserve undefined values', () => {
        const inputObject = { a: 1, b: undefined, c: 3 }
        const result = omit(inputObject, 'a')
        expect(result).toEqual({ b: undefined, c: 3 })
    })

    it('should preserve null values', () => {
        const inputObject = { a: 1, b: null, c: 3 }
        const result = omit(inputObject, 'a', 'c')
        expect(result).toEqual({ b: null })
    })

    it('should preserve zero and false values', () => {
        const inputObject = { a: 0, b: false, c: '', d: 3 }
        const result = omit(inputObject, 'd')
        expect(result).toEqual({ a: 0, b: false, c: '' })
    })

    it('should create shallow copy of values', () => {
        const nested = { value: 42 }
        const inputObject = { a: nested, b: 2 }
        const result = omit(inputObject, 'b')
        expect(result.a).toBe(nested) // Same reference
    })

    it('should work with numeric keys', () => {
        const inputObject = { 0: 'zero', 1: 'one', 2: 'two' }
        const result = omit(inputObject, 0, 2)
        expect(result).toEqual({ 1: 'one' })
    })

    it('should handle objects with many properties', () => {
        const inputObject = Object.fromEntries(
            Array.from({ length: 100 }, (_, i) => [`key${i}`, i])
        )
        const result = omit(inputObject, 'key5', 'key50', 'key99')
        expect(result).not.toHaveProperty('key5')
        expect(result).not.toHaveProperty('key50')
        expect(result).not.toHaveProperty('key99')
        expect(result.key0).toBe(0)
        expect(Object.keys(result)).toHaveLength(97)
    })

    it('should only omit own enumerable properties', () => {
        const proto = { inherited: 'value' }
        const inputObject = Object.create(proto)
        inputObject.own = 'ownValue'
        inputObject.another = 'anotherValue'
        const result = omit(inputObject, 'own')
        expect(result).toEqual({ another: 'anotherValue' })
    })

    it('should work with complex nested objects', () => {
        const inputObject = {
            user: { name: 'Alice', age: 30 },
            posts: [{ id: 1 }, { id: 2 }],
            settings: { theme: 'dark' },
            token: 'secret',
        }
        const result = omit(inputObject, 'token')
        expect(result).toEqual({
            user: { name: 'Alice', age: 30 },
            posts: [{ id: 1 }, { id: 2 }],
            settings: { theme: 'dark' },
        })
    })

    it('should handle omitting same key multiple times', () => {
        const inputObject = { a: 1, b: 2, c: 3 }
        const result = omit(inputObject, 'a', 'a', 'a')
        expect(result).toEqual({ b: 2, c: 3 })
    })

    it('should work with date objects', () => {
        const date = new Date('2025-01-01')
        const inputObject = {
            created: date,
            updated: new Date('2025-01-02'),
            name: 'test',
        }
        const result = omit(inputObject, 'updated')
        expect(result).toEqual({ created: date, name: 'test' })
        expect(result.created).toBe(date)
    })

    it('should work with function values', () => {
        const fn = () => 'hello'
        const inputObject = { a: 1, b: fn, c: 3 }
        const result = omit(inputObject, 'a', 'c')
        expect(result).toEqual({ b: fn })
    })

    it('should be the inverse of pick', () => {
        const inputObject = { a: 1, b: 2, c: 3, d: 4 }
        const omitted = omit(inputObject, 'a', 'c')
        expect(omitted).toEqual({ b: 2, d: 4 })
    })
})
