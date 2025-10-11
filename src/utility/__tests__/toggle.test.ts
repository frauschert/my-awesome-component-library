import { toggle } from '../toggle'

describe('toggle', () => {
    describe('basic functionality', () => {
        it('should toggle between two strings', () => {
            const t = toggle('a', 'b')
            expect(t()).toBe('a')
            expect(t()).toBe('b')
            expect(t()).toBe('a')
            expect(t()).toBe('b')
        })

        it('should toggle between two numbers', () => {
            const t = toggle(1, 2)
            expect(t()).toBe(1)
            expect(t()).toBe(2)
            expect(t()).toBe(1)
        })

        it('should toggle between two booleans', () => {
            const t = toggle(true, false)
            expect(t()).toBe(true)
            expect(t()).toBe(false)
            expect(t()).toBe(true)
            expect(t()).toBe(false)
        })

        it('should start with the first value', () => {
            const t = toggle('first', 'second')
            expect(t()).toBe('first')
        })

        it('should maintain sequence across many calls', () => {
            const t = toggle('on', 'off')
            const results: string[] = []

            for (let i = 0; i < 10; i++) {
                results.push(t())
            }

            expect(results).toEqual([
                'on',
                'off',
                'on',
                'off',
                'on',
                'off',
                'on',
                'off',
                'on',
                'off',
            ])
        })
    })

    describe('data types', () => {
        it('should toggle between objects', () => {
            const objA = { name: 'A' }
            const objB = { name: 'B' }
            const t = toggle(objA, objB)

            expect(t()).toBe(objA)
            expect(t()).toBe(objB)
            expect(t()).toBe(objA)
        })

        it('should toggle between arrays', () => {
            const arrA = [1, 2]
            const arrB = [3, 4]
            const t = toggle(arrA, arrB)

            expect(t()).toBe(arrA)
            expect(t()).toBe(arrB)
            expect(t()).toBe(arrA)
        })

        it('should toggle between functions', () => {
            const fnA = () => 'A'
            const fnB = () => 'B'
            const t = toggle(fnA, fnB)

            expect(t()).toBe(fnA)
            expect(t()).toBe(fnB)
        })

        it('should toggle between null and undefined', () => {
            const t = toggle(null, undefined)
            expect(t()).toBe(null)
            expect(t()).toBe(undefined)
            expect(t()).toBe(null)
        })

        it('should toggle between mixed types', () => {
            const t = toggle(42, 'forty-two')
            expect(t()).toBe(42)
            expect(t()).toBe('forty-two')
            expect(t()).toBe(42)
        })

        it('should toggle between symbols', () => {
            const symA = Symbol('a')
            const symB = Symbol('b')
            const t = toggle(symA, symB)

            expect(t()).toBe(symA)
            expect(t()).toBe(symB)
        })
    })

    describe('independence', () => {
        it('should maintain independent state for different toggles', () => {
            const t1 = toggle('a', 'b')
            const t2 = toggle('x', 'y')

            expect(t1()).toBe('a')
            expect(t2()).toBe('x')
            expect(t1()).toBe('b')
            expect(t2()).toBe('y')
            expect(t1()).toBe('a')
            expect(t2()).toBe('x')
        })

        it('should create new independent instances', () => {
            const t1 = toggle(1, 2)
            const t2 = toggle(1, 2)

            expect(t1()).toBe(1)
            expect(t1()).toBe(2)
            expect(t2()).toBe(1) // Independent state
            expect(t2()).toBe(2)
        })
    })

    describe('edge cases', () => {
        it('should toggle between identical values', () => {
            const t = toggle('same', 'same')
            expect(t()).toBe('same')
            expect(t()).toBe('same')
        })

        it('should toggle between zero and negative zero', () => {
            const t = toggle(0, -0)
            expect(t()).toBe(0)
            expect(Object.is(t(), -0)).toBe(true)
        })

        it('should toggle between NaN values', () => {
            const t = toggle(NaN, NaN)
            expect(Number.isNaN(t())).toBe(true)
            expect(Number.isNaN(t())).toBe(true)
        })

        it('should handle empty string and string with space', () => {
            const t = toggle('', ' ')
            expect(t()).toBe('')
            expect(t()).toBe(' ')
        })
    })

    describe('practical use cases', () => {
        it('should toggle theme between light and dark', () => {
            const toggleTheme = toggle('light', 'dark')

            expect(toggleTheme()).toBe('light')
            expect(toggleTheme()).toBe('dark')
            expect(toggleTheme()).toBe('light')
        })

        it('should toggle boolean state', () => {
            const toggleEnabled = toggle(false, true)
            let enabled = toggleEnabled()

            expect(enabled).toBe(false)
            enabled = toggleEnabled()
            expect(enabled).toBe(true)
            enabled = toggleEnabled()
            expect(enabled).toBe(false)
        })

        it('should toggle between play and pause icons', () => {
            const toggleIcon = toggle('▶️', '⏸️')

            expect(toggleIcon()).toBe('▶️')
            expect(toggleIcon()).toBe('⏸️')
        })

        it('should toggle sort order', () => {
            const toggleSort = toggle('asc', 'desc')
            const orders: string[] = []

            for (let i = 0; i < 4; i++) {
                orders.push(toggleSort())
            }

            expect(orders).toEqual(['asc', 'desc', 'asc', 'desc'])
        })

        it('should toggle visibility states', () => {
            type Visibility = 'visible' | 'hidden'
            const toggleVisibility = toggle<Visibility, Visibility>(
                'visible',
                'hidden'
            )

            expect(toggleVisibility()).toBe('visible')
            expect(toggleVisibility()).toBe('hidden')
        })

        it('should toggle array indexes for pagination', () => {
            const togglePage = toggle(0, 1)
            const pages: number[] = []

            for (let i = 0; i < 6; i++) {
                pages.push(togglePage())
            }

            expect(pages).toEqual([0, 1, 0, 1, 0, 1])
        })

        it('should toggle language codes', () => {
            const toggleLang = toggle('en', 'de')

            expect(toggleLang()).toBe('en')
            expect(toggleLang()).toBe('de')
        })

        it('should toggle between config objects', () => {
            const devConfig = { env: 'development', debug: true }
            const prodConfig = { env: 'production', debug: false }
            const toggleConfig = toggle(devConfig, prodConfig)

            expect(toggleConfig()).toBe(devConfig)
            expect(toggleConfig()).toBe(prodConfig)
        })

        it('should cycle between two classes for animation', () => {
            const toggleClass = toggle('fade-in', 'fade-out')
            const classes: string[] = []

            for (let i = 0; i < 4; i++) {
                classes.push(toggleClass())
            }

            expect(classes).toEqual([
                'fade-in',
                'fade-out',
                'fade-in',
                'fade-out',
            ])
        })

        it('should toggle between grid and list view', () => {
            const toggleView = toggle('grid', 'list')

            expect(toggleView()).toBe('grid')
            expect(toggleView()).toBe('list')
            expect(toggleView()).toBe('grid')
        })
    })

    describe('composition', () => {
        it('should work with multiple toggles in sequence', () => {
            const t1 = toggle('a', 'b')
            const t2 = toggle('x', 'y')

            const results: string[] = []

            for (let i = 0; i < 4; i++) {
                results.push(t1())
                results.push(t2())
            }

            expect(results).toEqual(['a', 'x', 'b', 'y', 'a', 'x', 'b', 'y'])
        })

        it('should be assignable to variables', () => {
            const toggler = toggle(1, 2)
            const fn = toggler

            expect(fn()).toBe(1)
            expect(fn()).toBe(2)
        })

        it('should work in array methods', () => {
            const t = toggle('even', 'odd')
            const results = [0, 1, 2, 3].map(() => t())

            expect(results).toEqual(['even', 'odd', 'even', 'odd'])
        })

        it('should work with setTimeout simulation', () => {
            const t = toggle('tick', 'tock')
            const sounds: string[] = []

            for (let i = 0; i < 6; i++) {
                sounds.push(t())
            }

            expect(sounds).toEqual([
                'tick',
                'tock',
                'tick',
                'tock',
                'tick',
                'tock',
            ])
        })
    })

    describe('type inference', () => {
        it('should infer union type for different types', () => {
            const t = toggle(42, 'string')
            const result: number | string = t()
            expect(
                typeof result === 'number' || typeof result === 'string'
            ).toBe(true)
        })

        it('should preserve specific types', () => {
            const t = toggle<'on', 'off'>('on', 'off')
            const result: 'on' | 'off' = t()
            expect(['on', 'off']).toContain(result)
        })

        it('should handle same type toggles', () => {
            const t = toggle<number, number>(1, 2)
            const result: number = t()
            expect(typeof result).toBe('number')
        })
    })

    describe('performance', () => {
        it('should handle many toggles efficiently', () => {
            const t = toggle(0, 1)
            let count = 0

            for (let i = 0; i < 10000; i++) {
                count += t()
            }

            expect(count).toBe(5000) // Half 0s, half 1s
        })

        it('should not leak memory with many calls', () => {
            const t = toggle('a', 'b')

            for (let i = 0; i < 100000; i++) {
                t()
            }

            expect(t()).toBe('a') // Still works after many calls
        })
    })
})
