import { renderHook, act } from '@testing-library/react'
import useStack from '../useStack'

describe('useStack', () => {
    describe('initialization', () => {
        it('should initialize with empty stack', () => {
            const { result } = renderHook(() => useStack<number>())

            expect(result.current.stack).toEqual([])
            expect(result.current.size).toBe(0)
            expect(result.current.isEmpty).toBe(true)
            expect(result.current.isFull).toBe(false)
        })

        it('should initialize with initial stack items', () => {
            const { result } = renderHook(() => useStack<number>([1, 2, 3]))

            expect(result.current.stack).toEqual([1, 2, 3])
            expect(result.current.size).toBe(3)
            expect(result.current.isEmpty).toBe(false)
        })

        it('should initialize with maxSize', () => {
            const { result } = renderHook(() => useStack<number>([], 5))

            expect(result.current.isFull).toBe(false)
            expect(result.current.size).toBe(0)
        })
    })

    describe('push', () => {
        it('should add item to top of stack', () => {
            const { result } = renderHook(() => useStack<string>())

            act(() => {
                result.current.push('first')
            })

            expect(result.current.stack).toEqual(['first'])
            expect(result.current.size).toBe(1)

            act(() => {
                result.current.push('second')
            })

            expect(result.current.stack).toEqual(['first', 'second'])
            expect(result.current.size).toBe(2)
        })

        it('should add multiple items in order', () => {
            const { result } = renderHook(() => useStack<number>())

            act(() => {
                result.current.push(1)
                result.current.push(2)
                result.current.push(3)
            })

            expect(result.current.stack).toEqual([1, 2, 3])
        })

        it('should respect maxSize constraint', () => {
            const consoleWarnSpy = jest
                .spyOn(console, 'warn')
                .mockImplementation()
            const { result } = renderHook(() => useStack<number>([], 2))

            act(() => {
                result.current.push(1)
                result.current.push(2)
            })

            expect(result.current.size).toBe(2)
            expect(result.current.isFull).toBe(true)

            act(() => {
                result.current.push(3)
            })

            expect(result.current.stack).toEqual([1, 2])
            expect(result.current.size).toBe(2)
            expect(consoleWarnSpy).toHaveBeenCalledWith(
                'Stack is full (max size: 2)'
            )

            consoleWarnSpy.mockRestore()
        })

        it('should update isEmpty when adding to empty stack', () => {
            const { result } = renderHook(() => useStack<string>())

            expect(result.current.isEmpty).toBe(true)

            act(() => {
                result.current.push('item')
            })

            expect(result.current.isEmpty).toBe(false)
        })
    })

    describe('pop', () => {
        it('should remove and return top item', () => {
            const { result } = renderHook(() =>
                useStack<string>(['first', 'second', 'third'])
            )

            let removed: string | undefined

            act(() => {
                removed = result.current.pop()
            })

            expect(removed).toBe('third')
            expect(result.current.stack).toEqual(['first', 'second'])
            expect(result.current.size).toBe(2)
        })

        it('should pop items in LIFO order', () => {
            const { result } = renderHook(() => useStack<number>([1, 2, 3]))

            let first: number | undefined
            let second: number | undefined

            act(() => {
                first = result.current.pop()
            })

            act(() => {
                second = result.current.pop()
            })

            expect(first).toBe(3)
            expect(second).toBe(2)
            expect(result.current.stack).toEqual([1])
        })

        it('should return undefined for empty stack', () => {
            const { result } = renderHook(() => useStack<number>())

            let removed: number | undefined

            act(() => {
                removed = result.current.pop()
            })

            expect(removed).toBeUndefined()
            expect(result.current.stack).toEqual([])
        })

        it('should update isEmpty when popping last item', () => {
            const { result } = renderHook(() => useStack<string>(['only-item']))

            expect(result.current.isEmpty).toBe(false)

            act(() => {
                result.current.pop()
            })

            expect(result.current.isEmpty).toBe(true)
        })

        it('should update isFull when popping from full stack', () => {
            const { result } = renderHook(() => useStack<number>([1, 2], 2))

            expect(result.current.isFull).toBe(true)

            act(() => {
                result.current.pop()
            })

            expect(result.current.isFull).toBe(false)
        })
    })

    describe('peek', () => {
        it('should return top item without removing it', () => {
            const { result } = renderHook(() =>
                useStack<string>(['first', 'second', 'third'])
            )

            const peeked = result.current.peek()

            expect(peeked).toBe('third')
            expect(result.current.stack).toEqual(['first', 'second', 'third'])
            expect(result.current.size).toBe(3)
        })

        it('should return undefined for empty stack', () => {
            const { result } = renderHook(() => useStack<number>())

            const peeked = result.current.peek()

            expect(peeked).toBeUndefined()
        })

        it('should return updated top item after pop', () => {
            const { result } = renderHook(() => useStack<number>([1, 2, 3]))

            expect(result.current.peek()).toBe(3)

            act(() => {
                result.current.pop()
            })

            expect(result.current.peek()).toBe(2)
        })
    })

    describe('clear', () => {
        it('should remove all items from stack', () => {
            const { result } = renderHook(() =>
                useStack<number>([1, 2, 3, 4, 5])
            )

            act(() => {
                result.current.clear()
            })

            expect(result.current.stack).toEqual([])
            expect(result.current.size).toBe(0)
            expect(result.current.isEmpty).toBe(true)
        })

        it('should work on already empty stack', () => {
            const { result } = renderHook(() => useStack<string>())

            act(() => {
                result.current.clear()
            })

            expect(result.current.stack).toEqual([])
            expect(result.current.isEmpty).toBe(true)
        })

        it('should update isFull after clearing', () => {
            const { result } = renderHook(() => useStack<number>([1, 2], 2))

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
                useStack<number>([1, 2, 3, 4, 5])
            )

            act(() => {
                result.current.remove((item) => item % 2 === 0)
            })

            expect(result.current.stack).toEqual([1, 3, 5])
            expect(result.current.size).toBe(3)
        })

        it('should remove specific item', () => {
            const { result } = renderHook(() =>
                useStack<string>(['a', 'b', 'c', 'd'])
            )

            act(() => {
                result.current.remove((item) => item === 'b')
            })

            expect(result.current.stack).toEqual(['a', 'c', 'd'])
        })

        it('should handle removing no items', () => {
            const { result } = renderHook(() => useStack<number>([1, 2, 3]))

            act(() => {
                result.current.remove((item) => item > 10)
            })

            expect(result.current.stack).toEqual([1, 2, 3])
        })

        it('should handle removing all items', () => {
            const { result } = renderHook(() => useStack<number>([1, 2, 3]))

            act(() => {
                result.current.remove(() => true)
            })

            expect(result.current.stack).toEqual([])
            expect(result.current.isEmpty).toBe(true)
        })
    })

    describe('toArray', () => {
        it('should return copy of stack as array', () => {
            const { result } = renderHook(() => useStack<number>([1, 2, 3]))

            const array = result.current.toArray()

            expect(array).toEqual([1, 2, 3])
            expect(array).not.toBe(result.current.stack)
        })

        it('should return empty array for empty stack', () => {
            const { result } = renderHook(() => useStack<string>())

            const array = result.current.toArray()

            expect(array).toEqual([])
        })

        it('should not affect original stack when modifying returned array', () => {
            const { result } = renderHook(() => useStack<number>([1, 2, 3]))

            const array = result.current.toArray()
            array.push(4)
            array[0] = 99

            expect(result.current.stack).toEqual([1, 2, 3])
        })
    })

    describe('complex scenarios', () => {
        it('should handle push and pop operations together', () => {
            const { result } = renderHook(() => useStack<number>())

            act(() => {
                result.current.push(1)
                result.current.push(2)
            })

            let first: number | undefined

            act(() => {
                first = result.current.pop()
            })

            expect(first).toBe(2)

            act(() => {
                result.current.push(3)
            })

            expect(result.current.stack).toEqual([1, 3])
        })

        it('should work with object items', () => {
            interface Command {
                id: number
                action: string
            }

            const { result } = renderHook(() => useStack<Command>())

            act(() => {
                result.current.push({ id: 1, action: 'Create' })
                result.current.push({ id: 2, action: 'Update' })
            })

            const peeked = result.current.peek()
            expect(peeked).toEqual({ id: 2, action: 'Update' })

            let popped: Command | undefined

            act(() => {
                popped = result.current.pop()
            })

            expect(popped).toEqual({ id: 2, action: 'Update' })
            expect(result.current.stack).toEqual([{ id: 1, action: 'Create' }])
        })

        it('should handle remove with objects', () => {
            interface Page {
                id: number
                title: string
            }

            const { result } = renderHook(() =>
                useStack<Page>([
                    { id: 1, title: 'Home' },
                    { id: 2, title: 'About' },
                    { id: 3, title: 'Contact' },
                ])
            )

            act(() => {
                result.current.remove((page) => page.id === 2)
            })

            expect(result.current.stack).toEqual([
                { id: 1, title: 'Home' },
                { id: 3, title: 'Contact' },
            ])
        })

        it('should maintain LIFO order with many operations', () => {
            const { result } = renderHook(() => useStack<number>())

            // Push 1-5
            act(() => {
                for (let i = 1; i <= 5; i++) {
                    result.current.push(i)
                }
            })

            // Pop top two (5, 4)
            act(() => {
                result.current.pop()
            })

            act(() => {
                result.current.pop()
            })

            // Push 6-8
            act(() => {
                result.current.push(6)
                result.current.push(7)
                result.current.push(8)
            })

            // Stack should be [1, 2, 3, 6, 7, 8]
            expect(result.current.stack).toEqual([1, 2, 3, 6, 7, 8])

            // Peek should return 8
            expect(result.current.peek()).toBe(8)
        })
    })

    describe('edge cases', () => {
        it('should handle maxSize of 0', () => {
            const consoleWarnSpy = jest
                .spyOn(console, 'warn')
                .mockImplementation()
            const { result } = renderHook(() => useStack<number>([], 0))

            expect(result.current.isFull).toBe(true)

            act(() => {
                result.current.push(1)
            })

            expect(result.current.stack).toEqual([])
            expect(consoleWarnSpy).toHaveBeenCalled()

            consoleWarnSpy.mockRestore()
        })

        it('should handle maxSize of 1', () => {
            const { result } = renderHook(() => useStack<string>([], 1))

            act(() => {
                result.current.push('first')
            })

            expect(result.current.isFull).toBe(true)
            expect(result.current.stack).toEqual(['first'])
        })

        it('should handle initial stack larger than maxSize', () => {
            const { result } = renderHook(() => useStack<number>([1, 2, 3], 2))

            // Initial stack is allowed to exceed maxSize
            expect(result.current.stack).toEqual([1, 2, 3])
            expect(result.current.size).toBe(3)

            // But new pushes should be blocked
            act(() => {
                result.current.push(4)
            })

            expect(result.current.stack).toEqual([1, 2, 3])
        })

        it('should handle undefined and null values', () => {
            const { result } = renderHook(() =>
                useStack<string | null | undefined>()
            )

            act(() => {
                result.current.push(null)
                result.current.push(undefined)
                result.current.push('value')
            })

            expect(result.current.stack).toEqual([null, undefined, 'value'])
            expect(result.current.size).toBe(3)

            let first: string | null | undefined

            act(() => {
                first = result.current.pop()
            })

            expect(first).toBe('value')
        })
    })

    describe('LIFO behavior', () => {
        it('should demonstrate LIFO order vs FIFO', () => {
            const { result } = renderHook(() => useStack<string>())

            // Add items
            act(() => {
                result.current.push('first')
                result.current.push('second')
                result.current.push('third')
            })

            // Pop returns last added (LIFO)
            let popped: string | undefined

            act(() => {
                popped = result.current.pop()
            })

            expect(popped).toBe('third') // Last in, first out
            expect(result.current.peek()).toBe('second')
        })

        it('should work as undo/redo stack', () => {
            interface Action {
                type: string
                data: unknown
            }

            const { result } = renderHook(() => useStack<Action>())

            // Perform actions
            act(() => {
                result.current.push({ type: 'ADD_TEXT', data: 'Hello' })
                result.current.push({ type: 'ADD_TEXT', data: ' World' })
                result.current.push({ type: 'DELETE_CHAR', data: null })
            })

            // Undo last action
            let undone: Action | undefined

            act(() => {
                undone = result.current.pop()
            })

            expect(undone?.type).toBe('DELETE_CHAR')
            expect(result.current.size).toBe(2)
        })
    })
})
