import { pipe } from '../pipe'

describe('pipe', () => {
    it('should pipe single function', () => {
        const addOne = (x: number) => x + 1
        const fn = pipe(addOne)
        expect(fn(5)).toBe(6)
    })

    it('should pipe two functions left-to-right', () => {
        const addOne = (x: number) => x + 1
        const double = (x: number) => x * 2

        const fn = pipe(addOne, double)
        expect(fn(3)).toBe(8) // (3 + 1) * 2 = 8
    })

    it('should pipe three functions left-to-right', () => {
        const addOne = (x: number) => x + 1
        const double = (x: number) => x * 2
        const square = (x: number) => x * x

        const fn = pipe(addOne, double, square)
        expect(fn(3)).toBe(64) // ((3 + 1) * 2) ^ 2 = 64
    })

    it('should work with string transformations', () => {
        const trim = (s: string) => s.trim()
        const lower = (s: string) => s.toLowerCase()
        const dashify = (s: string) => s.replace(/\s+/g, '-')

        const transform = pipe(trim, lower, dashify)
        expect(transform('  Hello World  ')).toBe('hello-world')
    })

    it('should work with array operations', () => {
        const numbers = [1, 2, 3, 4, 5]

        const sumEvenDoubled = pipe(
            (arr: number[]) => arr.filter((x) => x % 2 === 0),
            (arr) => arr.map((x) => x * 2),
            (arr) => arr.reduce((sum, x) => sum + x, 0)
        )

        expect(sumEvenDoubled(numbers)).toBe(12) // (2 + 4) * 2 = 12
    })

    it('should pass multiple arguments to first function', () => {
        const add = (a: number, b: number) => a + b
        const double = (x: number) => x * 2

        const fn = pipe(add, double)
        expect(fn(3, 5)).toBe(16) // (3 + 5) * 2 = 16
    })

    it('should work with four functions', () => {
        const f1 = (x: number) => x + 1
        const f2 = (x: number) => x * 2
        const f3 = (x: number) => x - 3
        const f4 = (x: number) => x / 4

        const fn = pipe(f1, f2, f3, f4)
        expect(fn(5)).toBe(2.25) // (((5 + 1) * 2) - 3) / 4 = 2.25
    })

    it('should work with five functions', () => {
        const f1 = (x: number) => x + 1
        const f2 = (x: number) => x * 2
        const f3 = (x: number) => x - 3
        const f4 = (x: number) => x / 4
        const f5 = (x: number) => Math.floor(x)

        const fn = pipe(f1, f2, f3, f4, f5)
        expect(fn(5)).toBe(2) // floor((((5 + 1) * 2) - 3) / 4) = 2
    })

    it('should work with different return types', () => {
        const toNumber = (s: string) => parseInt(s, 10)
        const double = (x: number) => x * 2
        const toString = (x: number) => `Result: ${x}`

        const fn = pipe(toNumber, double, toString)
        expect(fn('5')).toBe('Result: 10')
    })

    it('should handle object transformations', () => {
        interface User {
            name: string
            age: number
        }

        const user: User = { name: 'Alice', age: 30 }

        const transform = pipe(
            (u: User) => ({ ...u, age: u.age + 1 }),
            (u) => ({ ...u, name: u.name.toUpperCase() }),
            (u) => `${u.name} is ${u.age} years old`
        )

        expect(transform(user)).toBe('ALICE is 31 years old')
    })

    it('should work with array methods as functions', () => {
        const numbers = [1, 2, 3, 4, 5]

        const process = pipe(
            (arr: number[]) => arr.slice(1, 4),
            (arr) => arr.reverse(),
            (arr) => arr.join('-')
        )

        expect(process(numbers)).toBe('4-3-2')
    })

    it('should preserve this context when needed', () => {
        const obj = {
            value: 10,
            addValue: function (x: number) {
                return x + this.value
            },
        }

        const fn = pipe(obj.addValue.bind(obj), (x: number) => x * 2)

        expect(fn(5)).toBe(30) // (5 + 10) * 2 = 30
    })

    it('should work with boolean logic', () => {
        const isPositive = (x: number) => x > 0
        const negate = (b: boolean) => !b

        const isNonPositive = pipe(isPositive, negate)
        expect(isNonPositive(5)).toBe(false)
        expect(isNonPositive(-5)).toBe(true)
    })

    it('should handle functions returning undefined', () => {
        const fn = pipe(
            (x: number) => x + 1,
            (_) => undefined,
            (x) => x ?? 'default'
        )

        expect(fn(5)).toBe('default')
    })

    it('should work with six functions', () => {
        const fn = pipe(
            (x: number) => x + 1,
            (x) => x * 2,
            (x) => x - 3,
            (x) => x / 4,
            (x) => x + 10,
            (x) => x.toFixed(2)
        )

        expect(fn(5)).toBe('12.25')
    })

    it('should work with seven functions', () => {
        const fn = pipe(
            (x: number) => x + 1,
            (x) => x * 2,
            (x) => x - 3,
            (x) => x / 4,
            (x) => x + 10,
            (x) => x.toFixed(2),
            (x) => `Value: ${x}`
        )

        expect(fn(5)).toBe('Value: 12.25')
    })

    it('should work with eight functions', () => {
        const fn = pipe(
            (x: number) => x + 1,
            (x) => x * 2,
            (x) => x - 3,
            (x) => x / 4,
            (x) => x + 10,
            (x) => x.toFixed(2),
            (x) => `Value: ${x}`,
            (x) => x.toUpperCase()
        )

        expect(fn(5)).toBe('VALUE: 12.25')
    })

    it('should work with complex data pipelines', () => {
        interface Product {
            name: string
            price: number
            inStock: boolean
        }

        const products: Product[] = [
            { name: 'Apple', price: 1.5, inStock: true },
            { name: 'Banana', price: 0.5, inStock: false },
            { name: 'Cherry', price: 2.0, inStock: true },
        ]

        const getInStockTotal = pipe(
            (prods: Product[]) => prods.filter((p) => p.inStock),
            (prods) => prods.map((p) => p.price),
            (prices) => prices.reduce((sum, p) => sum + p, 0),
            (total) => total.toFixed(2)
        )

        expect(getInStockTotal(products)).toBe('3.50')
    })

    it('should handle identity-like pipelines', () => {
        const identity = pipe((x: number) => x)
        expect(identity(42)).toBe(42)
    })

    it('should work with null and undefined values', () => {
        const fn = pipe(
            (x: number | null) => x ?? 0,
            (x) => x + 10
        )

        expect(fn(null)).toBe(10)
        expect(fn(5)).toBe(15)
    })

    it('should compose with other piped functions', () => {
        const addOne = (x: number) => x + 1
        const double = (x: number) => x * 2
        const square = (x: number) => x * x

        const step1 = pipe(addOne, double)
        const step2 = pipe(square)

        const combined = pipe(step1, step2)
        expect(combined(3)).toBe(64) // ((3 + 1) * 2) ^ 2 = 64
    })

    it('should handle functions with side effects', () => {
        const calls: number[] = []

        const fn = pipe(
            (x: number) => {
                calls.push(1)
                return x + 1
            },
            (x) => {
                calls.push(2)
                return x * 2
            },
            (x) => {
                calls.push(3)
                return x - 3
            }
        )

        expect(fn(5)).toBe(9)
        expect(calls).toEqual([1, 2, 3])
    })

    it('should work with async-like patterns', async () => {
        const fn = pipe(
            (x: number) => Promise.resolve(x + 1),
            (p) => p.then((x) => x * 2)
        )

        const result = await fn(5)
        expect(result).toBe(12)
    })
})
