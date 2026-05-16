import none from '../none'

describe('none', () => {
    it('should return true when no elements satisfy predicate', () => {
        expect(none((x) => x % 2 === 0, [1, 3, 5])).toBe(true)
    })

    it('should return false when at least one element satisfies predicate', () => {
        expect(none((x) => x % 2 === 0, [1, 3, 4])).toBe(false)
    })

    it('should return false when first element satisfies predicate', () => {
        expect(none((x) => x > 5, [6, 1, 2])).toBe(false)
    })

    it('should return false when middle element satisfies predicate', () => {
        expect(none((x) => x > 5, [1, 6, 2])).toBe(false)
    })

    it('should return false when last element satisfies predicate', () => {
        expect(none((x) => x > 5, [1, 2, 6])).toBe(false)
    })

    it('should return true for empty array', () => {
        expect(none((x) => x > 0, [])).toBe(true)
    })

    it('should work with single element arrays - true case', () => {
        expect(none((x) => x > 5, [3])).toBe(true)
    })

    it('should work with single element arrays - false case', () => {
        expect(none((x) => x > 5, [10])).toBe(false)
    })

    it('should work with string predicates', () => {
        expect(none((s) => s.length > 5, ['hi', 'bye', 'ok'])).toBe(true)
        expect(none((s) => s.length > 5, ['hi', 'goodbye', 'ok'])).toBe(false)
    })

    it('should work with object predicates', () => {
        const users = [
            { age: 20, name: 'Alice' },
            { age: 25, name: 'Bob' },
            { age: 30, name: 'Charlie' },
        ]
        expect(none((u) => u.age > 40, users)).toBe(true)
        expect(none((u) => u.age > 25, users)).toBe(false)
    })

    it('should handle all elements matching', () => {
        expect(none((x) => x > 0, [1, 2, 3, 4, 5])).toBe(false)
    })

    it('should short-circuit on first match', () => {
        let callCount = 0
        const predicate = (x: number) => {
            callCount++
            return x > 5
        }
        none(predicate, [1, 2, 10, 20, 30])
        // Should stop after finding 10
        expect(callCount).toBe(3)
    })
})
