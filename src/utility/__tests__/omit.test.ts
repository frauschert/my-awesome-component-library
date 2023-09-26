import omit from '../omit' // Import your omit function here

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
})
