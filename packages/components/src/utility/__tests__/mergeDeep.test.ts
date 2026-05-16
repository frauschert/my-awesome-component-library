import { mergeDeep } from '../mergeDeep'

describe('mergeDeep', () => {
    describe('basic merging', () => {
        it('should merge two simple objects', () => {
            const result = mergeDeep({ a: 1, b: 2 }, { b: 3, c: 4 } as any)
            expect(result).toEqual({ a: 1, b: 3, c: 4 })
        })

        it('should merge empty objects', () => {
            const result = mergeDeep({}, {})
            expect(result).toEqual({})
        })

        it('should handle single object', () => {
            const result = mergeDeep({ a: 1, b: 2 })
            expect(result).toEqual({ a: 1, b: 2 })
        })

        it('should merge multiple objects', () => {
            const result = mergeDeep({ a: 1 }, { b: 2 }, { c: 3 })
            expect(result).toEqual({ a: 1, b: 2, c: 3 })
        })

        it('should give precedence to later objects', () => {
            const result = mergeDeep({ a: 1 }, { a: 2 }, { a: 3 })
            expect(result).toEqual({ a: 3 })
        })
    })

    describe('nested object merging', () => {
        it('should deep merge nested objects', () => {
            const result = mergeDeep({ a: { x: 1, y: 2 } }, {
                a: { y: 3, z: 4 },
            } as any)
            expect(result).toEqual({ a: { x: 1, y: 3, z: 4 } })
        })

        it('should merge deeply nested objects', () => {
            const result = mergeDeep({ a: { b: { c: 1 } } }, {
                a: { b: { d: 2 } },
            } as any)
            expect(result).toEqual({ a: { b: { c: 1, d: 2 } } })
        })

        it('should handle three levels of nesting', () => {
            const result = mergeDeep({ user: { profile: { name: 'Alice' } } }, {
                user: { profile: { age: 25 }, email: 'alice@example.com' },
            } as any)
            expect(result).toEqual({
                user: {
                    profile: { name: 'Alice', age: 25 },
                    email: 'alice@example.com',
                },
            })
        })

        it('should merge complex nested structures', () => {
            const result = mergeDeep(
                {
                    user: {
                        name: 'Alice',
                        settings: {
                            theme: 'dark',
                            notifications: { email: true },
                        },
                    },
                },
                {
                    user: {
                        age: 25,
                        settings: {
                            language: 'en',
                            notifications: { sms: false },
                        },
                    },
                } as any
            )
            expect(result).toEqual({
                user: {
                    name: 'Alice',
                    age: 25,
                    settings: {
                        theme: 'dark',
                        language: 'en',
                        notifications: { email: true, sms: false },
                    },
                },
            })
        })
    })

    describe('array handling', () => {
        it('should replace arrays, not merge them', () => {
            const result = mergeDeep({ arr: [1, 2] }, { arr: [3, 4] })
            expect(result).toEqual({ arr: [3, 4] })
        })

        it('should handle nested arrays', () => {
            const result = mergeDeep(
                { data: { items: [1, 2] } },
                { data: { items: [3, 4, 5] } }
            )
            expect(result).toEqual({ data: { items: [3, 4, 5] } })
        })

        it('should replace empty array with non-empty', () => {
            const result = mergeDeep({ arr: [] }, { arr: [1, 2, 3] })
            expect(result).toEqual({ arr: [1, 2, 3] })
        })

        it('should replace non-empty array with empty', () => {
            const result = mergeDeep({ arr: [1, 2, 3] }, { arr: [] })
            expect(result).toEqual({ arr: [] })
        })

        it('should handle arrays of objects', () => {
            const result = mergeDeep(
                { items: [{ id: 1 }, { id: 2 }] },
                { items: [{ id: 3 }] }
            )
            expect(result).toEqual({ items: [{ id: 3 }] })
        })
    })

    describe('null and undefined', () => {
        it('should replace value with null', () => {
            const result = mergeDeep({ a: 1 }, { a: null } as any)
            expect(result).toEqual({ a: null })
        })

        it('should replace value with undefined', () => {
            const result = mergeDeep({ a: 1 }, { a: undefined })
            expect(result).toEqual({ a: undefined })
        })

        it('should replace null with value', () => {
            const result = mergeDeep({ a: null } as any, { a: 1 } as any)
            expect(result).toEqual({ a: 1 })
        })

        it('should replace undefined with value', () => {
            const result = mergeDeep({ a: undefined }, { a: 1 } as any)
            expect(result).toEqual({ a: 1 })
        })

        it('should skip null objects in arguments', () => {
            const result = mergeDeep({ a: 1 }, null as any, { b: 2 } as any)
            expect(result).toEqual({ a: 1, b: 2 })
        })

        it('should skip undefined objects in arguments', () => {
            const result = mergeDeep(
                { a: 1 },
                undefined as any,
                { b: 2 } as any
            )
            expect(result).toEqual({ a: 1, b: 2 })
        })
    })

    describe('primitive type handling', () => {
        it('should handle string values', () => {
            const result = mergeDeep({ name: 'Alice' }, { name: 'Bob' })
            expect(result).toEqual({ name: 'Bob' })
        })

        it('should handle number values', () => {
            const result = mergeDeep({ count: 5 }, { count: 10 })
            expect(result).toEqual({ count: 10 })
        })

        it('should handle boolean values', () => {
            const result = mergeDeep({ active: true }, { active: false })
            expect(result).toEqual({ active: false })
        })

        it('should replace object with primitive', () => {
            const result = mergeDeep({ a: { x: 1 } }, { a: 'string' } as any)
            expect(result).toEqual({ a: 'string' })
        })

        it('should replace primitive with object', () => {
            const result = mergeDeep({ a: 'string' }, { a: { x: 1 } } as any)
            expect(result).toEqual({ a: { x: 1 } })
        })
    })

    describe('special object types', () => {
        it('should replace Date objects', () => {
            const date1 = new Date('2024-01-01')
            const date2 = new Date('2024-12-31')
            const result = mergeDeep({ date: date1 }, { date: date2 })
            expect(result.date).toBe(date2)
        })

        it('should replace RegExp objects', () => {
            const result = mergeDeep({ pattern: /abc/ }, { pattern: /xyz/ })
            expect(result.pattern).toEqual(/xyz/)
        })

        it('should replace Map objects', () => {
            const map1 = new Map([['a', 1]])
            const map2 = new Map([['b', 2]])
            const result = mergeDeep({ map: map1 }, { map: map2 })
            expect(result.map).toBe(map2)
        })

        it('should replace Set objects', () => {
            const set1 = new Set([1, 2])
            const set2 = new Set([3, 4])
            const result = mergeDeep({ set: set1 }, { set: set2 })
            expect(result.set).toBe(set2)
        })

        it('should handle Error objects', () => {
            const error = new Error('test')
            const result = mergeDeep({ error: null } as any, { error } as any)
            expect(result.error).toBe(error)
        })
    })

    describe('immutability', () => {
        it('should not mutate source objects', () => {
            const obj1 = { a: 1, b: 2 }
            const obj2 = { b: 3, c: 4 }
            const obj1Copy = { ...obj1 }
            const obj2Copy = { ...obj2 }

            mergeDeep(obj1, obj2)

            expect(obj1).toEqual(obj1Copy)
            expect(obj2).toEqual(obj2Copy)
        })

        it('should not mutate nested objects', () => {
            const obj1 = { a: { x: 1 } }
            const obj2 = { a: { y: 2 } }
            const obj1Copy = JSON.parse(JSON.stringify(obj1))
            const obj2Copy = JSON.parse(JSON.stringify(obj2))

            mergeDeep(obj1, obj2 as any)

            expect(obj1).toEqual(obj1Copy)
            expect(obj2).toEqual(obj2Copy)
        })

        it('should return new object reference', () => {
            const obj1 = { a: 1 }
            const result = mergeDeep(obj1, { b: 2 } as any)
            expect(result).not.toBe(obj1)
        })

        it('should return new nested object references', () => {
            const obj1 = { a: { x: 1 } }
            const result = mergeDeep(obj1, { a: { y: 2 } } as any)
            expect(result.a).not.toBe(obj1.a)
        })
    })

    describe('edge cases', () => {
        it('should handle objects created with Object.create(null)', () => {
            const obj1 = Object.create(null)
            obj1.a = 1
            const obj2 = Object.create(null)
            obj2.b = 2
            const result = mergeDeep(obj1, obj2)
            expect(result).toEqual({ a: 1, b: 2 })
        })

        it('should not merge inherited properties', () => {
            const proto = { inherited: 'value' }
            const obj1 = Object.create(proto)
            obj1.own = 'own1'
            const obj2 = { own: 'own2' }
            const result = mergeDeep(obj1, obj2)
            expect(result).toEqual({ own: 'own2' })
            expect(result).not.toHaveProperty('inherited')
        })

        it('should handle empty nested objects', () => {
            const result = mergeDeep({ a: {} }, { a: {} })
            expect(result).toEqual({ a: {} })
        })

        it('should handle function values', () => {
            const fn1 = () => 1
            const fn2 = () => 2
            const result = mergeDeep({ fn: fn1 }, { fn: fn2 })
            expect(result.fn).toBe(fn2)
        })

        it('should handle symbol keys', () => {
            const sym = Symbol('test')
            const obj1 = { [sym]: 1, a: 1 }
            const obj2 = { [sym]: 2, b: 2 }
            const result = mergeDeep(obj1 as any, obj2 as any)
            // Symbols are handled like regular properties in for...in
            expect(result.a).toBe(1)
            expect(result.b).toBe(2)
        })
    })

    describe('practical use cases', () => {
        it('should merge configuration objects', () => {
            const defaultConfig = {
                api: { url: '/api', timeout: 5000 },
                features: { auth: true, analytics: false },
            }
            const userConfig = {
                api: { timeout: 10000 },
                features: { analytics: true },
            }
            const result = mergeDeep(defaultConfig, userConfig)
            expect(result).toEqual({
                api: { url: '/api', timeout: 10000 },
                features: { auth: true, analytics: true },
            })
        })

        it('should merge user settings with defaults', () => {
            const defaults = {
                theme: 'light',
                editor: { fontSize: 14, tabSize: 2, wordWrap: true },
            }
            const userSettings = {
                theme: 'dark',
                editor: { fontSize: 16 },
            }
            const result = mergeDeep(defaults, userSettings)
            expect(result).toEqual({
                theme: 'dark',
                editor: { fontSize: 16, tabSize: 2, wordWrap: true },
            })
        })

        it('should merge API response with cached data', () => {
            const cached = {
                user: { id: 1, name: 'Alice' },
                metadata: { lastFetch: 123456 },
            }
            const fresh = {
                user: { name: 'Alice Smith', email: 'alice@example.com' },
                metadata: { lastFetch: 789012 },
            }
            const result = mergeDeep(cached, fresh as any)
            expect(result).toEqual({
                user: {
                    id: 1,
                    name: 'Alice Smith',
                    email: 'alice@example.com',
                },
                metadata: { lastFetch: 789012 },
            })
        })

        it('should merge form data with partial updates', () => {
            const formData = {
                personal: { name: 'John', age: 30 },
                contact: { email: 'john@example.com', phone: '123-456' },
            }
            const update = {
                personal: { age: 31 },
            }
            const result = mergeDeep(formData, update)
            expect(result).toEqual({
                personal: { name: 'John', age: 31 },
                contact: { email: 'john@example.com', phone: '123-456' },
            })
        })

        it('should build complex state from multiple sources', () => {
            const initialState = { loading: false, data: null, error: null }
            const loadingState = { loading: true }
            const dataState = { loading: false, data: { items: [1, 2, 3] } }
            const result = mergeDeep(initialState, loadingState, dataState)
            expect(result).toEqual({
                loading: false,
                data: { items: [1, 2, 3] },
                error: null,
            })
        })
    })

    describe('multiple object merging', () => {
        it('should merge four objects', () => {
            const result = mergeDeep(
                { a: 1 },
                { b: 2 } as any,
                { c: 3 } as any,
                { d: 4 } as any
            )
            expect(result).toEqual({ a: 1, b: 2, c: 3, d: 4 })
        })

        it('should handle overlapping keys in multiple objects', () => {
            const result = mergeDeep(
                { a: 1, b: 1 },
                { b: 2, c: 2 } as any,
                { c: 3, d: 3 } as any
            )
            expect(result).toEqual({ a: 1, b: 2, c: 3, d: 3 })
        })

        it('should deeply merge multiple nested objects', () => {
            const result = mergeDeep(
                { config: { api: { url: '/api' } } },
                { config: { api: { timeout: 5000 } } } as any,
                { config: { api: { retry: 3 } } } as any
            )
            expect(result).toEqual({
                config: { api: { url: '/api', timeout: 5000, retry: 3 } },
            })
        })
    })
})
