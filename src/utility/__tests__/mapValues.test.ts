import { mapValues } from '../mapValues'

describe('mapValues', () => {
    describe('basic transformations', () => {
        it('should transform numeric values', () => {
            const input = { a: 1, b: 2, c: 3 }
            const result = mapValues(input, (v) => v * 2)
            expect(result).toEqual({ a: 2, b: 4, c: 6 })
        })

        it('should transform string values', () => {
            const input = { name: 'john', city: 'paris' }
            const result = mapValues(input, (v) => v.toUpperCase())
            expect(result).toEqual({ name: 'JOHN', city: 'PARIS' })
        })

        it('should handle empty object', () => {
            const result = mapValues({}, (v) => v)
            expect(result).toEqual({})
        })

        it('should handle single property', () => {
            const result = mapValues({ x: 10 }, (v) => v * 2)
            expect(result).toEqual({ x: 20 })
        })
    })

    describe('mapper function parameters', () => {
        it('should pass value to mapper', () => {
            const input = { a: 1, b: 2 }
            const values: number[] = []
            mapValues(input, (v) => {
                values.push(v)
                return v
            })
            expect(values).toEqual([1, 2])
        })

        it('should pass key to mapper', () => {
            const input = { a: 1, b: 2 }
            const keys: string[] = []
            mapValues(input, (v, key) => {
                keys.push(key as string)
                return v
            })
            expect(keys).toEqual(['a', 'b'])
        })

        it('should pass entire object to mapper', () => {
            const input = { a: 1, b: 2 }
            let passedObject: typeof input | undefined
            mapValues(input, (v, key, obj) => {
                passedObject = obj
                return v
            })
            expect(passedObject).toBe(input)
        })

        it('should use all parameters in transformation', () => {
            const input = { a: 1, b: 2 }
            const result = mapValues(input, (v, key) => `${key}:${v}`)
            expect(result).toEqual({ a: 'a:1', b: 'b:2' })
        })
    })

    describe('type transformations', () => {
        it('should transform numbers to strings', () => {
            const input = { a: 1, b: 2, c: 3 }
            const result = mapValues(input, (v) => String(v))
            expect(result).toEqual({ a: '1', b: '2', c: '3' })
        })

        it('should transform strings to numbers', () => {
            const input = { a: '10', b: '20' }
            const result = mapValues(input, (v) => Number(v))
            expect(result).toEqual({ a: 10, b: 20 })
        })

        it('should transform to boolean', () => {
            const input = { a: 1, b: 0, c: 'yes', d: '' }
            const result = mapValues(input, (v) => Boolean(v))
            expect(result).toEqual({ a: true, b: false, c: true, d: false })
        })

        it('should transform to arrays', () => {
            const input = { a: 1, b: 2 }
            const result = mapValues(input, (v) => [v])
            expect(result).toEqual({ a: [1], b: [2] })
        })

        it('should transform to objects', () => {
            const input = { a: 1, b: 2 }
            const result = mapValues(input, (v, key) => ({ key, value: v }))
            expect(result).toEqual({
                a: { key: 'a', value: 1 },
                b: { key: 'b', value: 2 },
            })
        })
    })

    describe('immutability', () => {
        it('should not mutate original object', () => {
            const input = { a: 1, b: 2 }
            const inputCopy = { ...input }
            mapValues(input, (v) => v * 2)
            expect(input).toEqual(inputCopy)
        })

        it('should return new object reference', () => {
            const input = { a: 1, b: 2 }
            const result = mapValues(input, (v) => v)
            expect(result).not.toBe(input)
        })
    })

    describe('edge cases with values', () => {
        it('should handle null values', () => {
            const input = { a: null, b: 2 }
            const result = mapValues(input, (v) => v ?? 'default')
            expect(result).toEqual({ a: 'default', b: 2 })
        })

        it('should handle undefined values', () => {
            const input = { a: undefined, b: 2 }
            const result = mapValues(input, (v) => v ?? 'default')
            expect(result).toEqual({ a: 'default', b: 2 })
        })

        it('should handle mixed types', () => {
            const input = { a: 1, b: 'two', c: true, d: null }
            const result = mapValues(input, (v) => String(v))
            expect(result).toEqual({ a: '1', b: 'two', c: 'true', d: 'null' })
        })

        it('should handle array values', () => {
            const input = { a: [1, 2], b: [3, 4] }
            const result = mapValues(input, (v) => v.length)
            expect(result).toEqual({ a: 2, b: 2 })
        })

        it('should handle object values', () => {
            const input = { user1: { age: 25 }, user2: { age: 30 } }
            const result = mapValues(input, (v) => v.age)
            expect(result).toEqual({ user1: 25, user2: 30 })
        })

        it('should handle function values', () => {
            const input = { add: (a: number, b: number) => a + b }
            const result = mapValues(input, (v) => typeof v)
            expect(result).toEqual({ add: 'function' })
        })
    })

    describe('own properties only', () => {
        it('should only process own properties', () => {
            const proto = { inherited: 'value' }
            const input = Object.create(proto)
            input.own = 'own'
            const result = mapValues(input, (v) => v)
            expect(result).toEqual({ own: 'own' })
            expect(result).not.toHaveProperty('inherited')
        })

        it('should not process non-enumerable properties', () => {
            const input: Record<string, string> = { visible: 'yes' }
            Object.defineProperty(input, 'hidden', {
                value: 'no',
                enumerable: false,
            })
            const result = mapValues(input, (v) => v)
            expect(result).toEqual({ visible: 'yes' })
            expect(result).not.toHaveProperty('hidden')
        })
    })

    describe('complex transformations', () => {
        it('should compute derived values', () => {
            const prices = { apple: 1.5, banana: 0.8, orange: 2.0 }
            const withTax = mapValues(prices, (price) => price * 1.2)
            expect(withTax.apple).toBeCloseTo(1.8)
            expect(withTax.banana).toBeCloseTo(0.96)
            expect(withTax.orange).toBeCloseTo(2.4)
        })

        it('should normalize data', () => {
            const raw = { NAME: 'Alice', AGE: '25', CITY: 'NYC' }
            const normalized = mapValues(raw, (v) => String(v).toLowerCase())
            expect(normalized).toEqual({
                NAME: 'alice',
                AGE: '25',
                CITY: 'nyc',
            })
        })

        it('should validate and transform', () => {
            const input = { a: 5, b: -3, c: 0 }
            const result = mapValues(input, (v) => (v > 0 ? v : 0))
            expect(result).toEqual({ a: 5, b: 0, c: 0 })
        })

        it('should create lookups', () => {
            const items = { item1: 'apple', item2: 'banana' }
            const lengths = mapValues(items, (v) => v.length)
            expect(lengths).toEqual({ item1: 5, item2: 6 })
        })
    })

    describe('practical use cases', () => {
        it('should format configuration values', () => {
            const config = { apiUrl: '/api', timeout: 5000, debug: true }
            const formatted = mapValues(config, (v) => JSON.stringify(v))
            expect(formatted).toEqual({
                apiUrl: '"/api"',
                timeout: '5000',
                debug: 'true',
            })
        })

        it('should extract nested properties', () => {
            const users = {
                user1: { name: 'Alice', age: 25 },
                user2: { name: 'Bob', age: 30 },
            }
            const names = mapValues(users, (user) => user.name)
            expect(names).toEqual({ user1: 'Alice', user2: 'Bob' })
        })

        it('should apply default values', () => {
            const settings = { volume: 0, brightness: undefined, contrast: 50 }
            const withDefaults = mapValues(settings, (v) => v ?? 100)
            expect(withDefaults).toEqual({
                volume: 0,
                brightness: 100,
                contrast: 50,
            })
        })

        it('should convert units', () => {
            const distancesKm = { home: 5, work: 12, gym: 3 }
            const distancesMiles = mapValues(distancesKm, (km) =>
                Number((km * 0.621371).toFixed(2))
            )
            expect(distancesMiles).toEqual({
                home: 3.11,
                work: 7.46,
                gym: 1.86,
            })
        })

        it('should build API request payloads', () => {
            const formData = { username: 'john', email: 'john@example.com' }
            const payload = mapValues(formData, (v) => String(v).trim())
            expect(payload).toEqual({
                username: 'john',
                email: 'john@example.com',
            })
        })
    })

    describe('type inference', () => {
        it('should preserve key types', () => {
            const input = { a: 1, b: 2 } as const
            const result = mapValues(input, (v) => v * 2)
            // TypeScript should infer Record<'a' | 'b', number>
            expect(result.a).toBe(2)
            expect(result.b).toBe(4)
        })

        it('should allow access to all original keys', () => {
            const input = { x: 1, y: 2, z: 3 }
            const result = mapValues(input, (v) => v)
            expect(result).toHaveProperty('x')
            expect(result).toHaveProperty('y')
            expect(result).toHaveProperty('z')
        })
    })
})
