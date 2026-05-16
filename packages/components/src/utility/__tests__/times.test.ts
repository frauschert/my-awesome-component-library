import { times } from '../times'

describe('times', () => {
    describe('basic functionality', () => {
        it('should execute function n times', () => {
            const result = times(5, (i) => i)
            expect(result).toEqual([0, 1, 2, 3, 4])
        })

        it('should pass index to function', () => {
            const indices: number[] = []
            times(3, (i) => {
                indices.push(i)
                return i
            })
            expect(indices).toEqual([0, 1, 2])
        })

        it('should collect function results', () => {
            const result = times(4, (i) => i * 2)
            expect(result).toEqual([0, 2, 4, 6])
        })

        it('should handle n = 0', () => {
            const result = times(0, (i) => i)
            expect(result).toEqual([])
        })

        it('should handle n = 1', () => {
            const result = times(1, (i) => i)
            expect(result).toEqual([0])
        })

        it('should handle large n', () => {
            const result = times(1000, (i) => i)
            expect(result).toHaveLength(1000)
            expect(result[0]).toBe(0)
            expect(result[999]).toBe(999)
        })
    })

    describe('return types', () => {
        it('should return array of numbers', () => {
            const result = times(3, (i) => i * 10)
            expect(result).toEqual([0, 10, 20])
        })

        it('should return array of strings', () => {
            const result = times(3, (i) => `item-${i}`)
            expect(result).toEqual(['item-0', 'item-1', 'item-2'])
        })

        it('should return array of booleans', () => {
            const result = times(3, (i) => i % 2 === 0)
            expect(result).toEqual([true, false, true])
        })

        it('should return array of objects', () => {
            const result = times(3, (i) => ({ id: i, name: `User ${i}` }))
            expect(result).toEqual([
                { id: 0, name: 'User 0' },
                { id: 1, name: 'User 1' },
                { id: 2, name: 'User 2' },
            ])
        })

        it('should return array of arrays', () => {
            const result = times(3, (i) => [i, i * 2])
            expect(result).toEqual([
                [0, 0],
                [1, 2],
                [2, 4],
            ])
        })

        it('should return array of functions', () => {
            const result = times(3, (i) => () => i)
            expect(result).toHaveLength(3)
            expect(result[0]()).toBe(0)
            expect(result[1]()).toBe(1)
            expect(result[2]()).toBe(2)
        })
    })

    describe('edge cases with n', () => {
        it('should throw error for negative n', () => {
            expect(() => times(-1, (i) => i)).toThrow(
                'times: n must be non-negative'
            )
        })

        it('should throw error for negative zero', () => {
            // -0 is still 0 in JavaScript, so this should work
            const result = times(-0, (i) => i)
            expect(result).toEqual([])
        })

        it('should throw error for non-integer n', () => {
            expect(() => times(3.5, (i) => i)).toThrow(
                'times: n must be an integer'
            )
        })

        it('should throw error for NaN', () => {
            expect(() => times(NaN, (i) => i)).toThrow(
                'times: n must be an integer'
            )
        })

        it('should throw error for Infinity', () => {
            expect(() => times(Infinity, (i) => i)).toThrow(
                'times: n must be an integer'
            )
        })
    })

    describe('function behavior', () => {
        it('should call function correct number of times', () => {
            let callCount = 0
            times(5, () => {
                callCount++
                return callCount
            })
            expect(callCount).toBe(5)
        })

        it('should not call function when n is 0', () => {
            let called = false
            times(0, () => {
                called = true
                return 0
            })
            expect(called).toBe(false)
        })

        it('should handle function that returns undefined', () => {
            const result = times(3, () => undefined)
            expect(result).toEqual([undefined, undefined, undefined])
        })

        it('should handle function that returns null', () => {
            const result = times(3, () => null)
            expect(result).toEqual([null, null, null])
        })

        it('should handle function with side effects', () => {
            const sideEffects: number[] = []
            times(3, (i) => {
                sideEffects.push(i * 10)
                return i
            })
            expect(sideEffects).toEqual([0, 10, 20])
        })

        it('should handle function that throws on certain iterations', () => {
            expect(() => {
                times(5, (i) => {
                    if (i === 3) {
                        throw new Error('Error at index 3')
                    }
                    return i
                })
            }).toThrow('Error at index 3')
        })
    })

    describe('practical use cases', () => {
        it('should generate test data', () => {
            const posts = times(5, (i) => ({
                id: i + 1,
                title: `Post ${i + 1}`,
                content: `Content for post ${i + 1}`,
                published: true,
            }))
            expect(posts).toHaveLength(5)
            expect(posts[0]).toEqual({
                id: 1,
                title: 'Post 1',
                content: 'Content for post 1',
                published: true,
            })
        })

        it('should generate repeated string', () => {
            const result = times(10, () => 'x').join('')
            expect(result).toBe('xxxxxxxxxx')
        })

        it('should create array of incrementing values', () => {
            const result = times(5, (i) => i + 1)
            expect(result).toEqual([1, 2, 3, 4, 5])
        })

        it('should generate coordinates', () => {
            const coords = times(3, (i) => ({ x: i * 10, y: i * 20 }))
            expect(coords).toEqual([
                { x: 0, y: 0 },
                { x: 10, y: 20 },
                { x: 20, y: 40 },
            ])
        })

        it('should create mock API responses', () => {
            const users = times(3, (i) => ({
                id: i,
                username: `user${i}`,
                email: `user${i}@example.com`,
                active: i % 2 === 0,
            }))
            expect(users).toHaveLength(3)
            expect(users[1].username).toBe('user1')
        })

        it('should generate array of React keys', () => {
            const keys = times(5, (i) => `item-${i}`)
            expect(keys).toEqual([
                'item-0',
                'item-1',
                'item-2',
                'item-3',
                'item-4',
            ])
        })

        it('should create pagination page numbers', () => {
            const totalPages = 5
            const pages = times(totalPages, (i) => i + 1)
            expect(pages).toEqual([1, 2, 3, 4, 5])
        })

        it('should generate placeholder data for loading states', () => {
            const skeletons = times(3, (i) => ({
                id: `skeleton-${i}`,
                loading: true,
            }))
            expect(skeletons).toHaveLength(3)
            expect(skeletons.every((s) => s.loading)).toBe(true)
        })

        it('should create array of promises', async () => {
            const promises = times(3, (i) => Promise.resolve(i * 2))
            const results = await Promise.all(promises)
            expect(results).toEqual([0, 2, 4])
        })

        it('should generate matrix rows', () => {
            const matrix = times(3, (row) => times(3, (col) => row * 3 + col))
            expect(matrix).toEqual([
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
            ])
        })
    })

    describe('composition with other utilities', () => {
        it('should work with map', () => {
            const result = times(3, (i) => i).map((x) => x * 2)
            expect(result).toEqual([0, 2, 4])
        })

        it('should work with filter', () => {
            const result = times(10, (i) => i).filter((x) => x % 2 === 0)
            expect(result).toEqual([0, 2, 4, 6, 8])
        })

        it('should work with reduce', () => {
            const result = times(5, (i) => i + 1).reduce((sum, x) => sum + x, 0)
            expect(result).toBe(15) // 1 + 2 + 3 + 4 + 5
        })

        it('should work with join', () => {
            const result = times(3, (i) => `part${i}`).join('-')
            expect(result).toBe('part0-part1-part2')
        })
    })

    describe('type safety', () => {
        it('should infer return type from function', () => {
            const numbers: number[] = times(3, (i) => i)
            expect(numbers).toEqual([0, 1, 2])

            const strings: string[] = times(3, (i) => `${i}`)
            expect(strings).toEqual(['0', '1', '2'])
        })

        it('should handle complex return types', () => {
            interface User {
                id: number
                name: string
            }
            const users: User[] = times(2, (i) => ({
                id: i,
                name: `User ${i}`,
            }))
            expect(users).toHaveLength(2)
        })
    })

    describe('performance', () => {
        it('should handle large iterations efficiently', () => {
            const start = Date.now()
            const result = times(10000, (i) => i)
            const duration = Date.now() - start

            expect(result).toHaveLength(10000)
            expect(result[0]).toBe(0)
            expect(result[9999]).toBe(9999)
            expect(duration).toBeLessThan(100) // Should complete in under 100ms
        })

        it('should not stack overflow with large n', () => {
            expect(() => {
                times(100000, (i) => i)
            }).not.toThrow()
        })
    })
})
