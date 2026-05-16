import all from '../all'

describe('all', () => {
    it('should return true when all elements satisfy predicate', () => {
        expect(all((x) => x === 3, [3, 3, 3])).toBe(true)
    })

    it('should return false when at least one element does not satisfy predicate', () => {
        expect(all((x) => x === 3, [3, 2, 3])).toBe(false)
    })

    it('should return false when first element does not satisfy predicate', () => {
        expect(all((x) => x > 5, [1, 10, 20])).toBe(false)
    })

    it('should return false when middle element does not satisfy predicate', () => {
        expect(all((x) => x > 5, [10, 2, 20])).toBe(false)
    })

    it('should return false when last element does not satisfy predicate', () => {
        expect(all((x) => x > 5, [10, 20, 2])).toBe(false)
    })

    it('should return true for empty array', () => {
        expect(all((x) => x > 0, [])).toBe(true)
    })

    it('should work with single element arrays - true case', () => {
        expect(all((x) => x > 5, [10])).toBe(true)
    })

    it('should work with single element arrays - false case', () => {
        expect(all((x) => x > 5, [3])).toBe(false)
    })

    it('should work with string predicates', () => {
        expect(all((s) => s.length > 2, ['hello', 'world', 'foo'])).toBe(true)
        expect(all((s) => s.length > 2, ['hello', 'hi', 'world'])).toBe(false)
    })

    it('should work with object predicates', () => {
        const users = [
            { age: 20, name: 'Alice' },
            { age: 25, name: 'Bob' },
            { age: 30, name: 'Charlie' },
        ]
        expect(all((u) => u.age >= 18, users)).toBe(true)
        expect(all((u) => u.age >= 25, users)).toBe(false)
    })

    it('should handle all elements failing', () => {
        expect(all((x) => x > 100, [1, 2, 3, 4, 5])).toBe(false)
    })

    it('should short-circuit on first failing element', () => {
        let callCount = 0
        const predicate = (x: number) => {
            callCount++
            return x > 5
        }
        all(predicate, [10, 20, 2, 30, 40])
        // Should stop after 2 (third element)
        expect(callCount).toBe(3)
    })

    it('should call predicate for all elements if all pass', () => {
        let callCount = 0
        const predicate = (x: number) => {
            callCount++
            return x > 0
        }
        all(predicate, [1, 2, 3, 4, 5])
        expect(callCount).toBe(5)
    })

    it('should work with boolean values', () => {
        expect(all((b) => b === true, [true, true, true])).toBe(true)
        expect(all((b) => b === true, [true, false, true])).toBe(false)
    })

    it('should work with mixed truthy/falsy checks', () => {
        expect(all((x) => !!x, [1, 2, 3])).toBe(true)
        expect(all((x) => !!x, [1, 0, 3])).toBe(false)
    })

    it('should handle negative numbers', () => {
        expect(all((x) => x < 0, [-1, -2, -3])).toBe(true)
        expect(all((x) => x < 0, [-1, 5, -3])).toBe(false)
    })
})
