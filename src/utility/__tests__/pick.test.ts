import pick from '../pick'

describe('pick', () => {
    it('should pick specified keys from object', () => {
        const obj = { a: 1, b: 2, c: 3 }
        expect(pick(obj, 'a', 'c')).toEqual({ a: 1, c: 3 })
    })

    it('should pick single key', () => {
        const obj = { name: 'Alice', age: 30, city: 'NYC' }
        expect(pick(obj, 'name')).toEqual({ name: 'Alice' })
    })

    it('should return empty object when no keys provided', () => {
        const obj = { a: 1, b: 2, c: 3 }
        expect(pick(obj)).toEqual({})
    })

    it('should handle empty object', () => {
        const obj = {}
        expect(pick(obj)).toEqual({})
    })

    it('should pick all keys', () => {
        const obj = { a: 1, b: 2 }
        expect(pick(obj, 'a', 'b')).toEqual({ a: 1, b: 2 })
    })

    it('should work with different value types', () => {
        const obj = {
            str: 'hello',
            num: 42,
            bool: true,
            arr: [1, 2, 3],
            obj: { nested: 'value' },
            nil: null,
            undef: undefined,
        }
        expect(pick(obj, 'str', 'bool', 'obj')).toEqual({
            str: 'hello',
            bool: true,
            obj: { nested: 'value' },
        })
    })

    it('should preserve undefined values', () => {
        const obj = { a: 1, b: undefined, c: 3 }
        expect(pick(obj, 'a', 'b')).toEqual({ a: 1, b: undefined })
    })

    it('should preserve null values', () => {
        const obj = { a: 1, b: null, c: 3 }
        expect(pick(obj, 'b', 'c')).toEqual({ b: null, c: 3 })
    })

    it('should preserve zero and false values', () => {
        const obj = { a: 0, b: false, c: '', d: 3 }
        expect(pick(obj, 'a', 'b', 'c')).toEqual({ a: 0, b: false, c: '' })
    })

    it('should not modify original object', () => {
        const obj = { a: 1, b: 2, c: 3 }
        const original = { ...obj }
        pick(obj, 'a', 'c')
        expect(obj).toEqual(original)
    })

    it('should create shallow copy of values', () => {
        const nested = { value: 42 }
        const obj = { a: nested, b: 2 }
        const result = pick(obj, 'a')
        expect(result.a).toBe(nested) // Same reference
    })

    it('should work with numeric keys', () => {
        const obj = { 0: 'zero', 1: 'one', 2: 'two' }
        expect(pick(obj, 0, 2)).toEqual({ 0: 'zero', 2: 'two' })
    })

    it('should handle objects with many properties', () => {
        const obj = Object.fromEntries(
            Array.from({ length: 100 }, (_, i) => [`key${i}`, i])
        )
        expect(pick(obj, 'key5', 'key50', 'key99')).toEqual({
            key5: 5,
            key50: 50,
            key99: 99,
        })
    })

    it('should only pick own enumerable properties', () => {
        const proto = { inherited: 'value' }
        const obj = Object.create(proto)
        obj.own = 'ownValue'
        expect(pick(obj, 'own')).toEqual({ own: 'ownValue' })
    })

    it('should work with complex nested objects', () => {
        const obj = {
            user: { name: 'Alice', age: 30 },
            posts: [{ id: 1 }, { id: 2 }],
            settings: { theme: 'dark' },
        }
        expect(pick(obj, 'user', 'settings')).toEqual({
            user: { name: 'Alice', age: 30 },
            settings: { theme: 'dark' },
        })
    })

    it('should handle picking same key multiple times', () => {
        const obj = { a: 1, b: 2 }
        expect(pick(obj, 'a', 'a', 'a')).toEqual({ a: 1 })
    })

    it('should work with date objects', () => {
        const date = new Date('2025-01-01')
        const obj = { created: date, updated: new Date('2025-01-02') }
        const result = pick(obj, 'created')
        expect(result).toEqual({ created: date })
        expect(result.created).toBe(date)
    })

    it('should work with function values', () => {
        const fn = () => 'hello'
        const obj = { a: 1, b: fn, c: 3 }
        expect(pick(obj, 'b')).toEqual({ b: fn })
    })
})
