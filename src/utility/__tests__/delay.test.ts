import { delay } from '../delay'

describe('delay', () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })

    afterEach(() => {
        jest.useRealTimers()
    })

    describe('basic functionality', () => {
        it('should resolve after specified delay', async () => {
            const promise = delay(1000)
            jest.advanceTimersByTime(1000)
            await expect(promise).resolves.toBeUndefined()
        })

        it('should resolve with undefined by default', async () => {
            const promise = delay(500)
            jest.advanceTimersByTime(500)
            const result = await promise
            expect(result).toBeUndefined()
        })

        it('should resolve with provided value', async () => {
            const promise = delay(500, 'done')
            jest.advanceTimersByTime(500)
            const result = await promise
            expect(result).toBe('done')
        })

        it('should handle zero delay', async () => {
            const promise = delay(0)
            jest.advanceTimersByTime(0)
            await expect(promise).resolves.toBeUndefined()
        })

        it('should not resolve before delay elapses', async () => {
            let resolved = false
            const promise = delay(1000).then(() => {
                resolved = true
            })

            jest.advanceTimersByTime(500)
            await Promise.resolve() // Flush microtasks
            expect(resolved).toBe(false)

            jest.advanceTimersByTime(500)
            await promise
            expect(resolved).toBe(true)
        })
    })

    describe('return values', () => {
        it('should resolve with number', async () => {
            const promise = delay(100, 42)
            jest.advanceTimersByTime(100)
            const result = await promise
            expect(result).toBe(42)
        })

        it('should resolve with string', async () => {
            const promise = delay(100, 'hello')
            jest.advanceTimersByTime(100)
            const result = await promise
            expect(result).toBe('hello')
        })

        it('should resolve with boolean', async () => {
            const promise = delay(100, true)
            jest.advanceTimersByTime(100)
            const result = await promise
            expect(result).toBe(true)
        })

        it('should resolve with object', async () => {
            const obj = { id: 1, name: 'test' }
            const promise = delay(100, obj)
            jest.advanceTimersByTime(100)
            const result = await promise
            expect(result).toBe(obj)
        })

        it('should resolve with array', async () => {
            const arr = [1, 2, 3]
            const promise = delay(100, arr)
            jest.advanceTimersByTime(100)
            const result = await promise
            expect(result).toBe(arr)
        })

        it('should resolve with null', async () => {
            const promise = delay(100, null)
            jest.advanceTimersByTime(100)
            const result = await promise
            expect(result).toBe(null)
        })

        it('should resolve with function', async () => {
            const fn = () => 'test'
            const promise = delay(100, fn)
            jest.advanceTimersByTime(100)
            const result = await promise
            expect(result).toBe(fn)
        })
    })

    describe('error handling', () => {
        it('should throw error for negative delay', () => {
            expect(() => delay(-100)).toThrow('delay: ms must be non-negative')
        })

        it('should throw error for NaN', () => {
            expect(() => delay(NaN)).toThrow(
                'delay: ms must be a finite number'
            )
        })

        it('should throw error for Infinity', () => {
            expect(() => delay(Infinity)).toThrow(
                'delay: ms must be a finite number'
            )
        })

        it('should throw error for negative Infinity', () => {
            expect(() => delay(-Infinity)).toThrow(
                'delay: ms must be a finite number'
            )
        })

        it('should handle positive zero', async () => {
            const promise = delay(0, 'zero')
            jest.advanceTimersByTime(0)
            await expect(promise).resolves.toBe('zero')
        })

        it('should handle negative zero', async () => {
            const promise = delay(-0, 'negative zero')
            jest.advanceTimersByTime(0)
            await expect(promise).resolves.toBe('negative zero')
        })
    })

    describe('timing precision', () => {
        it('should wait exact milliseconds', async () => {
            const promise = delay(1234)
            jest.advanceTimersByTime(1234)
            await expect(promise).resolves.toBeUndefined()
        })

        it('should not resolve early', async () => {
            let resolved = false
            delay(1000).then(() => {
                resolved = true
            })

            jest.advanceTimersByTime(999)
            await Promise.resolve()
            expect(resolved).toBe(false)
        })

        it('should handle fractional milliseconds', async () => {
            const promise = delay(100.5, 'done')
            jest.advanceTimersByTime(101)
            await expect(promise).resolves.toBe('done')
        })
    })

    describe('concurrent delays', () => {
        it('should handle multiple delays independently', async () => {
            const promise1 = delay(100, 'first')
            const promise2 = delay(200, 'second')
            const promise3 = delay(300, 'third')

            jest.advanceTimersByTime(100)
            await expect(promise1).resolves.toBe('first')

            jest.advanceTimersByTime(100)
            await expect(promise2).resolves.toBe('second')

            jest.advanceTimersByTime(100)
            await expect(promise3).resolves.toBe('third')
        })

        it('should resolve multiple delays at same time', async () => {
            const promise1 = delay(100, 'a')
            const promise2 = delay(100, 'b')

            jest.advanceTimersByTime(100)

            const [result1, result2] = await Promise.all([promise1, promise2])
            expect(result1).toBe('a')
            expect(result2).toBe('b')
        })
    })

    describe('practical use cases', () => {
        it('should simulate API loading delay', async () => {
            let loading = true
            const fetchData = async () => {
                await delay(1000)
                loading = false
                return { data: 'test' }
            }

            const promise = fetchData()
            expect(loading).toBe(true)

            jest.advanceTimersByTime(1000)
            const result = await promise

            expect(loading).toBe(false)
            expect(result).toEqual({ data: 'test' })
        })

        it('should create timeout in tests', async () => {
            const promise = delay(0)
            jest.advanceTimersByTime(0)
            await promise
            // Next tick
            expect(true).toBe(true)
        })
    })

    describe('chaining and composition', () => {
        it('should chain with then', async () => {
            const promise = delay(100, 5).then((n) => n * 2)
            jest.advanceTimersByTime(100)
            const result = await promise
            expect(result).toBe(10)
        })

        it('should chain multiple delays', async () => {
            const promise = delay(100, 'a')
                .then((v) => delay(100, v + 'b'))
                .then((v) => delay(100, v + 'c'))

            jest.advanceTimersByTime(100)
            await Promise.resolve()
            await Promise.resolve()
            jest.advanceTimersByTime(100)
            await Promise.resolve()
            await Promise.resolve()
            jest.advanceTimersByTime(100)

            const result = await promise
            expect(result).toBe('abc')
        })

        it('should work with Promise.all', async () => {
            const promise = Promise.all([
                delay(100, 1),
                delay(100, 2),
                delay(100, 3),
            ])

            jest.advanceTimersByTime(100)
            const results = await promise
            expect(results).toEqual([1, 2, 3])
        })

        it('should work with Promise.race', async () => {
            const promise = Promise.race([
                delay(100, 'slow'),
                delay(50, 'fast'),
            ])

            jest.advanceTimersByTime(50)
            const result = await promise
            expect(result).toBe('fast')
        })
    })

    describe('type inference', () => {
        it('should infer void type by default', async () => {
            const promise = delay(100)
            jest.advanceTimersByTime(100)
            const result: void = await promise
            expect(result).toBeUndefined()
        })

        it('should infer type from value', async () => {
            const promise = delay(100, 42)
            jest.advanceTimersByTime(100)
            const result: number = await promise
            expect(result).toBe(42)
        })

        it('should work with explicit type parameter', async () => {
            const promise = delay<string>(100, 'test')
            jest.advanceTimersByTime(100)
            const result: string = await promise
            expect(result).toBe('test')
        })
    })
})
