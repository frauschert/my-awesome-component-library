import capitalize from '../capitalize'

describe('capitalize', () => {
    it('should capitalize the first letter of a lowercase string', () => {
        expect(capitalize('hello')).toBe('Hello')
    })

    it('should keep already capitalized strings unchanged', () => {
        expect(capitalize('Hello')).toBe('Hello')
    })

    it('should handle all uppercase strings', () => {
        expect(capitalize('HELLO')).toBe('HELLO')
    })

    it('should handle single character strings', () => {
        expect(capitalize('a')).toBe('A')
        expect(capitalize('A')).toBe('A')
    })

    it('should handle empty strings', () => {
        expect(capitalize('')).toBe('')
    })

    it('should capitalize only the first character', () => {
        expect(capitalize('hello world')).toBe('Hello world')
    })

    it('should work with strings starting with numbers', () => {
        expect(capitalize('123abc')).toBe('123abc')
    })

    it('should work with strings starting with special characters', () => {
        expect(capitalize('!hello')).toBe('!hello')
        expect(capitalize('@world')).toBe('@world')
    })

    it('should handle Unicode characters', () => {
        expect(capitalize('école')).toBe('École')
        expect(capitalize('ñoño')).toBe('Ñoño')
        expect(capitalize('über')).toBe('Über')
    })

    it('should handle strings with only whitespace at start', () => {
        expect(capitalize(' hello')).toBe(' hello')
    })

    it('should handle mixed case strings', () => {
        expect(capitalize('hElLo')).toBe('HElLo')
    })

    it('should work with camelCase', () => {
        expect(capitalize('camelCase')).toBe('CamelCase')
    })

    it('should work with sentences', () => {
        expect(capitalize('the quick brown fox')).toBe('The quick brown fox')
    })

    it('should handle strings with newlines', () => {
        expect(capitalize('hello\nworld')).toBe('Hello\nworld')
    })
})
