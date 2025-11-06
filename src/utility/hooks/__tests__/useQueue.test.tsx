import { renderHook, act } from '@testing-library/react'
import useQueue from '../useQueue'

describe('useQueue', () => {
    describe('initialization', () => {
        it('should initialize with empty queue', () => {
            const { result } = renderHook(() => useQueue<number>())

            expect(result.current.queue).toEqual([])
            expect(result.current.size).toBe(0)
            expect(result.current.isEmpty).toBe(true)
            expect(result.current.isFull).toBe(false)
        })

        it('should initialize with initial queue items', () => {
            const { result } = renderHook(() => useQueue<number>([1, 2, 3]))

            expect(result.current.queue).toEqual([1, 2, 3])
            expect(result.current.size).toBe(3)
            expect(result.current.isEmpty).toBe(false)
        })

        it('should initialize with maxSize', () => {
            const { result } = renderHook(() => useQueue<number>([], 5))

            expect(result.current.isFull).toBe(false)
            expect(result.current.size).toBe(0)
        })
    })

    describe('enqueue', () => {
        it('should add item to end of queue', () => {
            const { result } = renderHook(() => useQueue<string>())

            act(() => {
                result.current.enqueue('first')
            })

            expect(result.current.queue).toEqual(['first'])
            expect(result.current.size).toBe(1)

            act(() => {
                result.current.enqueue('second')
            })

            expect(result.current.queue).toEqual(['first', 'second'])
            expect(result.current.size).toBe(2)
        })

        it('should add multiple items in order', () => {
            const { result } = renderHook(() => useQueue<number>())

            act(() => {
                result.current.enqueue(1)
                result.current.enqueue(2)
                result.current.enqueue(3)
            })

            expect(result.current.queue).toEqual([1, 2, 3])
        })

        it('should respect maxSize constraint', () => {
            const consoleWarnSpy = jest
                .spyOn(console, 'warn')
                .mockImplementation()
            const { result } = renderHook(() => useQueue<number>([], 2))

            act(() => {
                result.current.enqueue(1)
                result.current.enqueue(2)
            })

            expect(result.current.size).toBe(2)
            expect(result.current.isFull).toBe(true)

            act(() => {
                result.current.enqueue(3)
            })

            expect(result.current.queue).toEqual([1, 2])
            expect(result.current.size).toBe(2)
            expect(consoleWarnSpy).toHaveBeenCalledWith(
                'Queue is full (max size: 2)'
            )

            consoleWarnSpy.mockRestore()
        })

        it('should update isEmpty when adding to empty queue', () => {
            const { result } = renderHook(() => useQueue<string>())

            expect(result.current.isEmpty).toBe(true)

            act(() => {
                result.current.enqueue('item')
            })

            expect(result.current.isEmpty).toBe(false)
        })
    })

    describe('dequeue', () => {
        it('should remove and return first item', () => {
            const { result } = renderHook(() =>
                useQueue<string>(['first', 'second', 'third'])
            )

            let removed: string | undefined

            act(() => {
                removed = result.current.dequeue()
            })

            expect(removed).toBe('first')
            expect(result.current.queue).toEqual(['second', 'third'])
            expect(result.current.size).toBe(2)
        })

        it('should dequeue items in FIFO order', () => {
            const { result } = renderHook(() => useQueue<number>([1, 2, 3]))

            let first: number | undefined
            let second: number | undefined

            act(() => {
                first = result.current.dequeue()
            })

            act(() => {
                second = result.current.dequeue()
            })

            expect(first).toBe(1)
            expect(second).toBe(2)
            expect(result.current.queue).toEqual([3])
        })

        it('should return undefined for empty queue', () => {
            const { result } = renderHook(() => useQueue<number>())

            let removed: number | undefined

            act(() => {
                removed = result.current.dequeue()
            })

            expect(removed).toBeUndefined()
            expect(result.current.queue).toEqual([])
        })

        it('should update isEmpty when dequeuing last item', () => {
            const { result } = renderHook(() => useQueue<string>(['only-item']))

            expect(result.current.isEmpty).toBe(false)

            act(() => {
                result.current.dequeue()
            })

            expect(result.current.isEmpty).toBe(true)
        })

        it('should update isFull when dequeuing from full queue', () => {
            const { result } = renderHook(() => useQueue<number>([1, 2], 2))

            expect(result.current.isFull).toBe(true)

            act(() => {
                result.current.dequeue()
            })

            expect(result.current.isFull).toBe(false)
        })
    })

    describe('peek', () => {
        it('should return first item without removing it', () => {
            const { result } = renderHook(() =>
                useQueue<string>(['first', 'second', 'third'])
            )

            const peeked = result.current.peek()

            expect(peeked).toBe('first')
            expect(result.current.queue).toEqual(['first', 'second', 'third'])
            expect(result.current.size).toBe(3)
        })

        it('should return undefined for empty queue', () => {
            const { result } = renderHook(() => useQueue<number>())

            const peeked = result.current.peek()

            expect(peeked).toBeUndefined()
        })

        it('should return updated first item after dequeue', () => {
            const { result } = renderHook(() => useQueue<number>([1, 2, 3]))

            expect(result.current.peek()).toBe(1)

            act(() => {
                result.current.dequeue()
            })

            expect(result.current.peek()).toBe(2)
        })
    })

    describe('clear', () => {
        it('should remove all items from queue', () => {
            const { result } = renderHook(() =>
                useQueue<number>([1, 2, 3, 4, 5])
            )

            act(() => {
                result.current.clear()
            })

            expect(result.current.queue).toEqual([])
            expect(result.current.size).toBe(0)
            expect(result.current.isEmpty).toBe(true)
        })

        it('should work on already empty queue', () => {
            const { result } = renderHook(() => useQueue<string>())

            act(() => {
                result.current.clear()
            })

            expect(result.current.queue).toEqual([])
            expect(result.current.isEmpty).toBe(true)
        })

        it('should update isFull after clearing', () => {
            const { result } = renderHook(() => useQueue<number>([1, 2], 2))

            expect(result.current.isFull).toBe(true)

            act(() => {
                result.current.clear()
            })

            expect(result.current.isFull).toBe(false)
        })
    })

    describe('remove', () => {
        it('should remove items matching predicate', () => {
            const { result } = renderHook(() =>
                useQueue<number>([1, 2, 3, 4, 5])
            )

            act(() => {
                result.current.remove((item) => item % 2 === 0)
            })

            expect(result.current.queue).toEqual([1, 3, 5])
            expect(result.current.size).toBe(3)
        })

        it('should remove specific item', () => {
            const { result } = renderHook(() =>
                useQueue<string>(['a', 'b', 'c', 'd'])
            )

            act(() => {
                result.current.remove((item) => item === 'b')
            })

            expect(result.current.queue).toEqual(['a', 'c', 'd'])
        })

        it('should handle removing no items', () => {
            const { result } = renderHook(() => useQueue<number>([1, 2, 3]))

            act(() => {
                result.current.remove((item) => item > 10)
            })

            expect(result.current.queue).toEqual([1, 2, 3])
        })

        it('should handle removing all items', () => {
            const { result } = renderHook(() => useQueue<number>([1, 2, 3]))

            act(() => {
                result.current.remove(() => true)
            })

            expect(result.current.queue).toEqual([])
            expect(result.current.isEmpty).toBe(true)
        })
    })

    describe('toArray', () => {
        it('should return copy of queue as array', () => {
            const { result } = renderHook(() => useQueue<number>([1, 2, 3]))

            const array = result.current.toArray()

            expect(array).toEqual([1, 2, 3])
            expect(array).not.toBe(result.current.queue)
        })

        it('should return empty array for empty queue', () => {
            const { result } = renderHook(() => useQueue<string>())

            const array = result.current.toArray()

            expect(array).toEqual([])
        })

        it('should not affect original queue when modifying returned array', () => {
            const { result } = renderHook(() => useQueue<number>([1, 2, 3]))

            const array = result.current.toArray()
            array.push(4)
            array[0] = 99

            expect(result.current.queue).toEqual([1, 2, 3])
        })
    })

    describe('complex scenarios', () => {
        it('should handle enqueue and dequeue operations together', () => {
            const { result } = renderHook(() => useQueue<number>())

            act(() => {
                result.current.enqueue(1)
                result.current.enqueue(2)
            })

            let first: number | undefined

            act(() => {
                first = result.current.dequeue()
            })

            expect(first).toBe(1)

            act(() => {
                result.current.enqueue(3)
            })

            expect(result.current.queue).toEqual([2, 3])
        })

        it('should work with object items', () => {
            interface Task {
                id: number
                name: string
            }

            const { result } = renderHook(() => useQueue<Task>())

            act(() => {
                result.current.enqueue({ id: 1, name: 'Task 1' })
                result.current.enqueue({ id: 2, name: 'Task 2' })
            })

            const peeked = result.current.peek()
            expect(peeked).toEqual({ id: 1, name: 'Task 1' })

            let dequeued: Task | undefined

            act(() => {
                dequeued = result.current.dequeue()
            })

            expect(dequeued).toEqual({ id: 1, name: 'Task 1' })
            expect(result.current.queue).toEqual([{ id: 2, name: 'Task 2' }])
        })

        it('should handle remove with objects', () => {
            interface User {
                id: number
                name: string
            }

            const { result } = renderHook(() =>
                useQueue<User>([
                    { id: 1, name: 'Alice' },
                    { id: 2, name: 'Bob' },
                    { id: 3, name: 'Charlie' },
                ])
            )

            act(() => {
                result.current.remove((user) => user.id === 2)
            })

            expect(result.current.queue).toEqual([
                { id: 1, name: 'Alice' },
                { id: 3, name: 'Charlie' },
            ])
        })

        it('should maintain FIFO order with many operations', () => {
            const { result } = renderHook(() => useQueue<number>())

            // Add 1-5
            act(() => {
                for (let i = 1; i <= 5; i++) {
                    result.current.enqueue(i)
                }
            })

            // Remove first two (1, 2)
            act(() => {
                result.current.dequeue()
            })

            act(() => {
                result.current.dequeue()
            })

            // Add 6-8
            act(() => {
                result.current.enqueue(6)
                result.current.enqueue(7)
                result.current.enqueue(8)
            })

            // Queue should be [3, 4, 5, 6, 7, 8]
            expect(result.current.queue).toEqual([3, 4, 5, 6, 7, 8])

            // Peek should return 3
            expect(result.current.peek()).toBe(3)
        })
    })

    describe('edge cases', () => {
        it('should handle maxSize of 0', () => {
            const consoleWarnSpy = jest
                .spyOn(console, 'warn')
                .mockImplementation()
            const { result } = renderHook(() => useQueue<number>([], 0))

            expect(result.current.isFull).toBe(true)

            act(() => {
                result.current.enqueue(1)
            })

            expect(result.current.queue).toEqual([])
            expect(consoleWarnSpy).toHaveBeenCalled()

            consoleWarnSpy.mockRestore()
        })

        it('should handle maxSize of 1', () => {
            const { result } = renderHook(() => useQueue<string>([], 1))

            act(() => {
                result.current.enqueue('first')
            })

            expect(result.current.isFull).toBe(true)
            expect(result.current.queue).toEqual(['first'])
        })

        it('should handle initial queue larger than maxSize', () => {
            const { result } = renderHook(() => useQueue<number>([1, 2, 3], 2))

            // Initial queue is allowed to exceed maxSize
            expect(result.current.queue).toEqual([1, 2, 3])
            expect(result.current.size).toBe(3)

            // But new enqueues should be blocked
            act(() => {
                result.current.enqueue(4)
            })

            expect(result.current.queue).toEqual([1, 2, 3])
        })

        it('should handle undefined and null values', () => {
            const { result } = renderHook(() =>
                useQueue<string | null | undefined>()
            )

            act(() => {
                result.current.enqueue(null)
                result.current.enqueue(undefined)
                result.current.enqueue('value')
            })

            expect(result.current.queue).toEqual([null, undefined, 'value'])
            expect(result.current.size).toBe(3)

            let first: string | null | undefined

            act(() => {
                first = result.current.dequeue()
            })

            expect(first).toBeNull()
        })
    })
})
