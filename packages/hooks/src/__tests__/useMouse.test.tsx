import { renderHook, act } from '@testing-library/react'
import { useRef } from 'react'
import { useMouse } from '../useMouse'

describe('useMouse', () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })

    afterEach(() => {
        jest.runOnlyPendingTimers()
        jest.useRealTimers()
    })

    it('should initialize with default values', () => {
        const { result } = renderHook(() => useMouse())

        expect(result.current.x).toBe(0)
        expect(result.current.y).toBe(0)
        expect(result.current.elementX).toBe(0)
        expect(result.current.elementY).toBe(0)
        expect(result.current.buttons).toBe(0)
        expect(result.current.ctrlKey).toBe(false)
        expect(result.current.shiftKey).toBe(false)
        expect(result.current.altKey).toBe(false)
        expect(result.current.metaKey).toBe(false)
    })

    it('should track mouse position on window', () => {
        const { result } = renderHook(() => useMouse())

        act(() => {
            const event = new MouseEvent('mousemove', {
                clientX: 100,
                clientY: 200,
                buttons: 1,
            })
            window.dispatchEvent(event)
        })

        expect(result.current.x).toBe(100)
        expect(result.current.y).toBe(200)
        expect(result.current.buttons).toBe(1)
    })

    it('should track modifier keys', () => {
        const { result } = renderHook(() => useMouse())

        act(() => {
            const event = new MouseEvent('mousemove', {
                clientX: 50,
                clientY: 50,
                ctrlKey: true,
                shiftKey: true,
                altKey: true,
                metaKey: true,
            })
            window.dispatchEvent(event)
        })

        expect(result.current.ctrlKey).toBe(true)
        expect(result.current.shiftKey).toBe(true)
        expect(result.current.altKey).toBe(true)
        expect(result.current.metaKey).toBe(true)
    })

    it('should track element-relative position', () => {
        const element = document.createElement('div')
        Object.defineProperty(element, 'getBoundingClientRect', {
            value: jest.fn(() => ({
                left: 50,
                top: 100,
                width: 200,
                height: 300,
                right: 250,
                bottom: 400,
                x: 50,
                y: 100,
                toJSON: () => {},
            })),
        })

        const { result } = renderHook(() => {
            const ref = useRef<HTMLDivElement>(element as HTMLDivElement)
            return useMouse(ref)
        })

        act(() => {
            const event = new MouseEvent('mousemove', {
                clientX: 150, // 150 - 50 = 100px from element left
                clientY: 250, // 250 - 100 = 150px from element top
            })
            window.dispatchEvent(event)
        })

        expect(result.current.x).toBe(150)
        expect(result.current.y).toBe(250)
        expect(result.current.elementX).toBe(100)
        expect(result.current.elementY).toBe(150)
    })

    it('should calculate percentage position', () => {
        const element = document.createElement('div')
        Object.defineProperty(element, 'getBoundingClientRect', {
            value: jest.fn(() => ({
                left: 0,
                top: 0,
                width: 200,
                height: 100,
                right: 200,
                bottom: 100,
                x: 0,
                y: 0,
                toJSON: () => {},
            })),
        })

        const { result } = renderHook(() => {
            const ref = useRef<HTMLDivElement>(element as HTMLDivElement)
            return useMouse(ref)
        })

        act(() => {
            const event = new MouseEvent('mousemove', {
                clientX: 100, // 50% of 200px width
                clientY: 50, // 50% of 100px height
            })
            window.dispatchEvent(event)
        })

        expect(result.current.elementPositionX).toBe(50)
        expect(result.current.elementPositionY).toBe(50)
    })

    it('should clamp percentage position to 0-100', () => {
        const element = document.createElement('div')
        Object.defineProperty(element, 'getBoundingClientRect', {
            value: jest.fn(() => ({
                left: 100,
                top: 100,
                width: 200,
                height: 200,
                right: 300,
                bottom: 300,
                x: 100,
                y: 100,
                toJSON: () => {},
            })),
        })

        const { result } = renderHook(() => {
            const ref = useRef<HTMLDivElement>(element as HTMLDivElement)
            return useMouse(ref)
        })

        // Mouse outside element (negative position)
        act(() => {
            const event = new MouseEvent('mousemove', {
                clientX: 50, // Before element left
                clientY: 50, // Before element top
            })
            window.dispatchEvent(event)
        })

        expect(result.current.elementPositionX).toBe(0)
        expect(result.current.elementPositionY).toBe(0)

        // Mouse outside element (beyond 100%)
        act(() => {
            const event = new MouseEvent('mousemove', {
                clientX: 400, // After element right
                clientY: 400, // After element bottom
            })
            window.dispatchEvent(event)
        })

        expect(result.current.elementPositionX).toBe(100)
        expect(result.current.elementPositionY).toBe(100)
    })

    it('should not track outside element when trackOutside is false', () => {
        const element = document.createElement('div')
        Object.defineProperty(element, 'getBoundingClientRect', {
            value: jest.fn(() => ({
                left: 0,
                top: 0,
                width: 100,
                height: 100,
                right: 100,
                bottom: 100,
                x: 0,
                y: 0,
                toJSON: () => {},
            })),
        })

        const { result } = renderHook(() => {
            const ref = useRef<HTMLDivElement>(element as HTMLDivElement)
            return useMouse(ref, { trackOutside: false })
        })

        // Window event should not be tracked
        act(() => {
            const event = new MouseEvent('mousemove', {
                clientX: 50,
                clientY: 50,
            })
            window.dispatchEvent(event)
        })

        expect(result.current.x).toBe(0)
        expect(result.current.y).toBe(0)

        // Element event should be tracked
        act(() => {
            const event = new MouseEvent('mousemove', {
                clientX: 50,
                clientY: 50,
            })
            element.dispatchEvent(event)
        })

        expect(result.current.x).toBe(50)
        expect(result.current.y).toBe(50)
    })

    it('should reset on exit when resetOnExit is true', () => {
        const element = document.createElement('div')
        Object.defineProperty(element, 'getBoundingClientRect', {
            value: jest.fn(() => ({
                left: 0,
                top: 0,
                width: 100,
                height: 100,
                right: 100,
                bottom: 100,
                x: 0,
                y: 0,
                toJSON: () => {},
            })),
        })

        const { result } = renderHook(() => {
            const ref = useRef<HTMLDivElement>(element as HTMLDivElement)
            return useMouse(ref, { resetOnExit: true })
        })

        // Move mouse
        act(() => {
            const event = new MouseEvent('mousemove', {
                clientX: 50,
                clientY: 50,
                buttons: 1,
            })
            window.dispatchEvent(event)
        })

        expect(result.current.x).toBe(50)
        expect(result.current.y).toBe(50)
        expect(result.current.buttons).toBe(1)

        // Mouse leaves element
        act(() => {
            const event = new MouseEvent('mouseleave')
            element.dispatchEvent(event)
        })

        expect(result.current.x).toBe(0)
        expect(result.current.y).toBe(0)
        expect(result.current.buttons).toBe(0)
    })

    it('should throttle updates', () => {
        const { result } = renderHook(() => useMouse(undefined, { throttleMs: 100 }))

        // First update should go through
        act(() => {
            const event = new MouseEvent('mousemove', {
                clientX: 10,
                clientY: 10,
            })
            window.dispatchEvent(event)
        })

        expect(result.current.x).toBe(10)

        // Second update within throttle window should be ignored
        act(() => {
            const event = new MouseEvent('mousemove', {
                clientX: 20,
                clientY: 20,
            })
            window.dispatchEvent(event)
        })

        expect(result.current.x).toBe(10) // Still old value

        // Advance time beyond throttle
        act(() => {
            jest.advanceTimersByTime(100)
        })

        // Third update after throttle should go through
        act(() => {
            const event = new MouseEvent('mousemove', {
                clientX: 30,
                clientY: 30,
            })
            window.dispatchEvent(event)
        })

        expect(result.current.x).toBe(30)
    })

    it('should handle multiple button states', () => {
        const { result } = renderHook(() => useMouse())

        // Left button
        act(() => {
            const event = new MouseEvent('mousemove', {
                clientX: 10,
                clientY: 10,
                buttons: 1,
            })
            window.dispatchEvent(event)
        })

        expect(result.current.buttons).toBe(1)

        // Right button
        act(() => {
            const event = new MouseEvent('mousemove', {
                clientX: 10,
                clientY: 10,
                buttons: 2,
            })
            window.dispatchEvent(event)
        })

        expect(result.current.buttons).toBe(2)

        // Both buttons
        act(() => {
            const event = new MouseEvent('mousemove', {
                clientX: 10,
                clientY: 10,
                buttons: 3,
            })
            window.dispatchEvent(event)
        })

        expect(result.current.buttons).toBe(3)
    })

    it('should cleanup event listeners on unmount', () => {
        const addEventListenerSpy = jest.spyOn(window, 'addEventListener')
        const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener')

        const { unmount } = renderHook(() => useMouse())

        expect(addEventListenerSpy).toHaveBeenCalledWith(
            'mousemove',
            expect.any(Function)
        )

        unmount()

        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            'mousemove',
            expect.any(Function)
        )

        addEventListenerSpy.mockRestore()
        removeEventListenerSpy.mockRestore()
    })

    it('should update when options change', () => {
        const { result, rerender } = renderHook(
            ({ throttle }) => useMouse(undefined, { throttleMs: throttle }),
            { initialProps: { throttle: 0 } }
        )

        act(() => {
            const event = new MouseEvent('mousemove', {
                clientX: 100,
                clientY: 100,
            })
            window.dispatchEvent(event)
        })

        expect(result.current.x).toBe(100)

        // Change throttle
        rerender({ throttle: 1000 })

        act(() => {
            const event = new MouseEvent('mousemove', {
                clientX: 200,
                clientY: 200,
            })
            window.dispatchEvent(event)
        })

        // Should be throttled now
        expect(result.current.x).toBe(100)
    })

    it('should handle element without dimensions', () => {
        const element = document.createElement('div')
        Object.defineProperty(element, 'getBoundingClientRect', {
            value: jest.fn(() => ({
                left: 0,
                top: 0,
                width: 0,
                height: 0,
                right: 0,
                bottom: 0,
                x: 0,
                y: 0,
                toJSON: () => {},
            })),
        })

        const { result } = renderHook(() => {
            const ref = useRef<HTMLDivElement>(element as HTMLDivElement)
            return useMouse(ref)
        })

        act(() => {
            const event = new MouseEvent('mousemove', {
                clientX: 50,
                clientY: 50,
            })
            window.dispatchEvent(event)
        })

        expect(result.current.elementPositionX).toBe(0)
        expect(result.current.elementPositionY).toBe(0)
    })
})
