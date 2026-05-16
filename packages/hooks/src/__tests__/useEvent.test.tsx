import { renderHook, act } from '@testing-library/react'
import { useEffect, useState } from 'react'
import useEvent from '../useEvent'

describe('useEvent', () => {
    it('should return a function', () => {
        const { result } = renderHook(() => useEvent(() => {}))

        expect(typeof result.current).toBe('function')
    })

    it('should return a stable reference across re-renders', () => {
        const { result, rerender } = renderHook(() => useEvent(() => {}))

        const firstRef = result.current
        rerender()
        const secondRef = result.current

        expect(firstRef).toBe(secondRef)
    })

    it('should call the handler with correct arguments', () => {
        const handler = jest.fn()
        const { result } = renderHook(() => useEvent(handler))

        act(() => {
            result.current('arg1', 'arg2', 'arg3')
        })

        expect(handler).toHaveBeenCalledWith('arg1', 'arg2', 'arg3')
        expect(handler).toHaveBeenCalledTimes(1)
    })

    it('should return the value from the handler', () => {
        const handler = jest.fn(() => 'return value')
        const { result } = renderHook(() => useEvent(handler))

        let returnValue: string
        act(() => {
            returnValue = result.current()
        })

        expect(returnValue!).toBe('return value')
    })

    it('should always call the latest handler', () => {
        const { result, rerender } = renderHook(
            ({ handler }) => useEvent(handler),
            {
                initialProps: { handler: jest.fn(() => 'first') },
            }
        )

        const stableRef = result.current

        let returnValue: string
        act(() => {
            returnValue = stableRef()
        })
        expect(returnValue!).toBe('first')

        // Change the handler
        rerender({ handler: jest.fn(() => 'second') })

        act(() => {
            returnValue = stableRef()
        })
        expect(returnValue!).toBe('second')
        expect(result.current).toBe(stableRef) // Still the same reference
    })

    it('should capture latest state in closure', () => {
        const { result } = renderHook(() => {
            const [count, setCount] = useState(0)
            const handleClick = useEvent(() => count)

            return { handleClick, setCount, count }
        })

        expect(result.current.handleClick()).toBe(0)

        act(() => {
            result.current.setCount(5)
        })

        expect(result.current.handleClick()).toBe(5)

        act(() => {
            result.current.setCount(10)
        })

        expect(result.current.handleClick()).toBe(10)
    })

    it('should work with async functions', async () => {
        const { result } = renderHook(() =>
            useEvent(async (value: number) => {
                await new Promise((resolve) => setTimeout(resolve, 10))
                return value * 2
            })
        )

        let returnValue: number
        await act(async () => {
            returnValue = await result.current(5)
        })

        expect(returnValue!).toBe(10)
    })

    it('should maintain reference stability with changing dependencies', () => {
        const { result, rerender } = renderHook(
            ({ count }) => {
                const handler = useEvent(() => count * 2)
                return handler
            },
            { initialProps: { count: 1 } }
        )

        const firstRef = result.current

        rerender({ count: 2 })
        expect(result.current).toBe(firstRef)

        rerender({ count: 3 })
        expect(result.current).toBe(firstRef)

        rerender({ count: 100 })
        expect(result.current).toBe(firstRef)
    })

    it('should work in useEffect without causing infinite loops', () => {
        const effectFn = jest.fn()

        renderHook(() => {
            const [count, setCount] = useState(0)
            const handleIncrement = useEvent(() => setCount((c) => c + 1))

            // This would cause infinite loop with regular useCallback
            useEffect(() => {
                effectFn()
            }, [handleIncrement])

            return { handleIncrement, count }
        })

        // Effect should only run once
        expect(effectFn).toHaveBeenCalledTimes(1)
    })

    it('should handle multiple arguments correctly', () => {
        const handler = jest.fn((a: number, b: string, c: boolean) => ({
            a,
            b,
            c,
        }))
        const { result } = renderHook(() => useEvent(handler))

        let returnValue: { a: number; b: string; c: boolean }
        act(() => {
            returnValue = result.current(42, 'test', true)
        })

        expect(returnValue!).toEqual({ a: 42, b: 'test', c: true })
        expect(handler).toHaveBeenCalledWith(42, 'test', true)
    })

    it('should handle no arguments', () => {
        const handler = jest.fn(() => 'no args')
        const { result } = renderHook(() => useEvent(handler))

        let returnValue: string
        act(() => {
            returnValue = result.current()
        })

        expect(returnValue!).toBe('no args')
        expect(handler).toHaveBeenCalledWith()
    })

    it('should work with handlers that throw errors', () => {
        const error = new Error('Test error')
        const handler = jest.fn(() => {
            throw error
        })
        const { result } = renderHook(() => useEvent(handler))

        expect(() => {
            result.current()
        }).toThrow(error)

        expect(handler).toHaveBeenCalled()
    })

    it('should not preserve this context when called', () => {
        const obj = {
            value: 42,
            getValue() {
                return this.value
            },
        }

        const { result } = renderHook(() => useEvent(obj.getValue))

        // Note: useEvent doesn't preserve 'this' context by design
        // This is expected behavior - the function is called without context
        expect(() => {
            result.current()
        }).toThrow(TypeError)
    })

    it('should allow passing the handler as a prop', () => {
        const parentHandler = jest.fn((value: string) => value.toUpperCase())

        const { result, rerender } = renderHook(
            ({ handler }) => useEvent(handler),
            { initialProps: { handler: parentHandler } }
        )

        let returnValue: string
        act(() => {
            returnValue = result.current('hello')
        })

        expect(returnValue!).toBe('HELLO')
        expect(parentHandler).toHaveBeenCalledWith('hello')

        // Change parent handler
        const newHandler = jest.fn((value: string) => value.toLowerCase())
        rerender({ handler: newHandler })

        act(() => {
            returnValue = result.current('WORLD')
        })

        expect(returnValue!).toBe('world')
        expect(newHandler).toHaveBeenCalledWith('WORLD')
    })

    it('should work with event handlers', () => {
        const onClick = jest.fn((event: MouseEvent) => {
            event.preventDefault()
        })

        const { result } = renderHook(() => useEvent(onClick))

        const mockEvent = {
            preventDefault: jest.fn(),
        } as unknown as MouseEvent

        act(() => {
            result.current(mockEvent)
        })

        expect(onClick).toHaveBeenCalledWith(mockEvent)
        expect(mockEvent.preventDefault).toHaveBeenCalled()
    })

    it('should update immediately within the same render', () => {
        const { result } = renderHook(() => {
            const [value, setValue] = useState('initial')
            const getValue = useEvent(() => value)

            return { getValue, setValue }
        })

        expect(result.current.getValue()).toBe('initial')

        act(() => {
            result.current.setValue('updated')
        })

        expect(result.current.getValue()).toBe('updated')
    })

    it('should work with multiple useEvent hooks', () => {
        const { result } = renderHook(() => {
            const [count, setCount] = useState(0)
            const increment = useEvent(() => setCount((c) => c + 1))
            const decrement = useEvent(() => setCount((c) => c - 1))
            const getCount = useEvent(() => count)

            return { increment, decrement, getCount, count }
        })

        expect(result.current.getCount()).toBe(0)

        act(() => {
            result.current.increment()
        })
        expect(result.current.count).toBe(1)

        act(() => {
            result.current.increment()
        })
        expect(result.current.count).toBe(2)

        act(() => {
            result.current.decrement()
        })
        expect(result.current.count).toBe(1)

        expect(result.current.getCount()).toBe(1)
    })

    it('should handle handlers that return undefined', () => {
        const handler = jest.fn(() => undefined)
        const { result } = renderHook(() => useEvent(handler))

        let returnValue: undefined
        act(() => {
            returnValue = result.current()
        })

        expect(returnValue).toBeUndefined()
        expect(handler).toHaveBeenCalled()
    })

    it('should handle handlers that return null', () => {
        const handler = jest.fn(() => null)
        const { result } = renderHook(() => useEvent(handler))

        let returnValue: null
        act(() => {
            returnValue = result.current()
        })

        expect(returnValue).toBeNull()
        expect(handler).toHaveBeenCalled()
    })

    it('should handle handlers that return objects', () => {
        const obj = { foo: 'bar', num: 42 }
        const handler = jest.fn(() => obj)
        const { result } = renderHook(() => useEvent(handler))

        let returnValue: typeof obj
        act(() => {
            returnValue = result.current()
        })

        expect(returnValue).toBe(obj)
        expect(returnValue).toEqual({ foo: 'bar', num: 42 })
    })
})
