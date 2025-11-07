import { renderHook, act } from '@testing-library/react'
import { useRef } from 'react'
import useSwipe from '../useSwipe'

describe('useSwipe', () => {
    let element: HTMLDivElement

    beforeEach(() => {
        element = document.createElement('div')
        document.body.appendChild(element)
    })

    afterEach(() => {
        document.body.removeChild(element)
    })

    const createTouchEvent = (
        type: string,
        clientX: number,
        clientY: number
    ): TouchEvent => {
        const touch = {
            clientX,
            clientY,
            identifier: 0,
            pageX: clientX,
            pageY: clientY,
            screenX: clientX,
            screenY: clientY,
            target: element,
        } as Touch

        const event = new Event(type, {
            bubbles: true,
            cancelable: true,
        }) as TouchEvent
        Object.defineProperty(event, 'touches', {
            value: type === 'touchend' ? [] : [touch],
            writable: false,
        })
        Object.defineProperty(event, 'changedTouches', {
            value: [touch],
            writable: false,
        })

        return event
    }

    const simulateSwipe = (
        startX: number,
        startY: number,
        endX: number,
        endY: number
    ) => {
        act(() => {
            element.dispatchEvent(
                createTouchEvent('touchstart', startX, startY)
            )
        })
        act(() => {
            element.dispatchEvent(createTouchEvent('touchmove', endX, endY))
        })
        act(() => {
            element.dispatchEvent(createTouchEvent('touchend', endX, endY))
        })
    }

    test('detects swipe left', () => {
        const onSwipeLeft = jest.fn()
        const ref = { current: element }

        renderHook(() => useSwipe(ref, { onSwipeLeft }))

        simulateSwipe(200, 100, 50, 100) // Swipe from right to left

        expect(onSwipeLeft).toHaveBeenCalledWith(
            expect.objectContaining({
                direction: 'left',
                deltaX: expect.any(Number),
                deltaY: expect.any(Number),
            })
        )
    })

    test('detects swipe right', () => {
        const onSwipeRight = jest.fn()
        const ref = { current: element }

        renderHook(() => useSwipe(ref, { onSwipeRight }))

        simulateSwipe(50, 100, 200, 100) // Swipe from left to right

        expect(onSwipeRight).toHaveBeenCalledWith(
            expect.objectContaining({
                direction: 'right',
            })
        )
    })

    test('detects swipe up', () => {
        const onSwipeUp = jest.fn()
        const ref = { current: element }

        renderHook(() => useSwipe(ref, { onSwipeUp }))

        simulateSwipe(100, 200, 100, 50) // Swipe from bottom to top

        expect(onSwipeUp).toHaveBeenCalledWith(
            expect.objectContaining({
                direction: 'up',
            })
        )
    })

    test('detects swipe down', () => {
        const onSwipeDown = jest.fn()
        const ref = { current: element }

        renderHook(() => useSwipe(ref, { onSwipeDown }))

        simulateSwipe(100, 50, 100, 200) // Swipe from top to bottom

        expect(onSwipeDown).toHaveBeenCalledWith(
            expect.objectContaining({
                direction: 'down',
            })
        )
    })

    test('calls general onSwipe callback', () => {
        const onSwipe = jest.fn()
        const ref = { current: element }

        renderHook(() => useSwipe(ref, { onSwipe }))

        simulateSwipe(50, 100, 200, 100)

        expect(onSwipe).toHaveBeenCalledWith(
            expect.objectContaining({
                direction: 'right',
                velocity: expect.any(Number),
                distance: expect.any(Number),
            })
        )
    })

    test('respects custom threshold', () => {
        const onSwipe = jest.fn()
        const ref = { current: element }

        renderHook(() => useSwipe(ref, { onSwipe, threshold: 100 }))

        // Swipe less than threshold
        simulateSwipe(100, 100, 130, 100)

        expect(onSwipe).not.toHaveBeenCalled()

        // Swipe more than threshold
        simulateSwipe(100, 100, 220, 100)

        expect(onSwipe).toHaveBeenCalled()
    })

    test('provides swipe event details', () => {
        const onSwipe = jest.fn()
        const ref = { current: element }

        renderHook(() => useSwipe(ref, { onSwipe }))

        simulateSwipe(100, 100, 250, 100)

        expect(onSwipe).toHaveBeenCalledWith(
            expect.objectContaining({
                direction: 'right',
                deltaX: 150,
                deltaY: 0,
                velocity: expect.any(Number),
                distance: expect.any(Number),
            })
        )
    })

    test('calls onSwipeStart callback', () => {
        const onSwipeStart = jest.fn()
        const ref = { current: element }

        renderHook(() => useSwipe(ref, { onSwipeStart }))

        act(() => {
            element.dispatchEvent(createTouchEvent('touchstart', 100, 100))
        })

        expect(onSwipeStart).toHaveBeenCalledWith({ x: 100, y: 100 })
    })

    test('calls onSwipeMove callback', () => {
        const onSwipeMove = jest.fn()
        const ref = { current: element }

        renderHook(() => useSwipe(ref, { onSwipeMove }))

        act(() => {
            element.dispatchEvent(createTouchEvent('touchstart', 100, 100))
        })
        act(() => {
            element.dispatchEvent(createTouchEvent('touchmove', 150, 120))
        })

        expect(onSwipeMove).toHaveBeenCalledWith({
            x: 150,
            y: 120,
            deltaX: 50,
            deltaY: 20,
        })
    })

    test('calls onSwipeEnd callback', () => {
        const onSwipeEnd = jest.fn()
        const ref = { current: element }

        renderHook(() => useSwipe(ref, { onSwipeEnd }))

        simulateSwipe(100, 100, 250, 100)

        expect(onSwipeEnd).toHaveBeenCalled()
    })

    test('returns isSwiping state', () => {
        const ref = { current: element }

        const { result } = renderHook(() => useSwipe(ref))

        expect(result.current.isSwiping).toBe(false)

        act(() => {
            element.dispatchEvent(createTouchEvent('touchstart', 100, 100))
        })

        // Note: isSwiping is stored in a ref, so we can't directly test its change
        // This test verifies the initial state
        expect(result.current.isSwiping).toBe(false)
    })

    test('tracks mouse events when trackMouse is true', () => {
        const onSwipe = jest.fn()
        const ref = { current: element }

        renderHook(() => useSwipe(ref, { onSwipe, trackMouse: true }))

        act(() => {
            element.dispatchEvent(
                new MouseEvent('mousedown', {
                    bubbles: true,
                    clientX: 100,
                    clientY: 100,
                })
            )
        })
        act(() => {
            window.dispatchEvent(
                new MouseEvent('mousemove', {
                    bubbles: true,
                    clientX: 250,
                    clientY: 100,
                })
            )
        })
        act(() => {
            window.dispatchEvent(
                new MouseEvent('mouseup', {
                    bubbles: true,
                    clientX: 250,
                    clientY: 100,
                })
            )
        })

        expect(onSwipe).toHaveBeenCalledWith(
            expect.objectContaining({
                direction: 'right',
            })
        )
    })

    test('does not track mouse when trackMouse is false', () => {
        const onSwipe = jest.fn()
        const ref = { current: element }

        renderHook(() => useSwipe(ref, { onSwipe, trackMouse: false }))

        act(() => {
            element.dispatchEvent(
                new MouseEvent('mousedown', {
                    bubbles: true,
                    clientX: 100,
                    clientY: 100,
                })
            )
        })
        act(() => {
            window.dispatchEvent(
                new MouseEvent('mousemove', {
                    bubbles: true,
                    clientX: 250,
                    clientY: 100,
                })
            )
        })
        act(() => {
            window.dispatchEvent(
                new MouseEvent('mouseup', {
                    bubbles: true,
                    clientX: 250,
                    clientY: 100,
                })
            )
        })

        expect(onSwipe).not.toHaveBeenCalled()
    })

    test('handles null ref', () => {
        const onSwipe = jest.fn()

        const { result } = renderHook(() => useSwipe(null, { onSwipe }))

        expect(result.current.isSwiping).toBe(false)
        expect(result.current.direction).toBeNull()
    })

    test('does not trigger swipe for small movements', () => {
        const onSwipe = jest.fn()
        const ref = { current: element }

        renderHook(() => useSwipe(ref, { onSwipe, threshold: 50 }))

        simulateSwipe(100, 100, 120, 105) // Small movement

        expect(onSwipe).not.toHaveBeenCalled()
    })

    test('calculates velocity correctly', () => {
        const onSwipe = jest.fn()
        const ref = { current: element }

        renderHook(() => useSwipe(ref, { onSwipe, minVelocity: 0 }))

        simulateSwipe(100, 100, 250, 100)

        expect(onSwipe).toHaveBeenCalledWith(
            expect.objectContaining({
                velocity: expect.any(Number),
            })
        )

        const velocity = onSwipe.mock.calls[0][0].velocity
        expect(velocity).toBeGreaterThan(0)
    })

    test('does not trigger swipe if velocity too low', () => {
        jest.useFakeTimers()
        const onSwipe = jest.fn()
        const ref = { current: element }

        renderHook(() => useSwipe(ref, { onSwipe, minVelocity: 100 })) // Very high velocity requirement

        act(() => {
            element.dispatchEvent(createTouchEvent('touchstart', 100, 100))
        })

        // Advance time to make velocity very low
        jest.advanceTimersByTime(1000)

        act(() => {
            element.dispatchEvent(createTouchEvent('touchend', 250, 100))
        })

        expect(onSwipe).not.toHaveBeenCalled()

        jest.useRealTimers()
    })

    test('detects horizontal swipes over vertical', () => {
        const onSwipeLeft = jest.fn()
        const onSwipeUp = jest.fn()
        const ref = { current: element }

        renderHook(() => useSwipe(ref, { onSwipeLeft, onSwipeUp }))

        // Diagonal swipe with more horizontal movement
        simulateSwipe(200, 100, 50, 70)

        expect(onSwipeLeft).toHaveBeenCalled()
        expect(onSwipeUp).not.toHaveBeenCalled()
    })

    test('detects vertical swipes over horizontal', () => {
        const onSwipeDown = jest.fn()
        const onSwipeRight = jest.fn()
        const ref = { current: element }

        renderHook(() => useSwipe(ref, { onSwipeDown, onSwipeRight }))

        // Diagonal swipe with more vertical movement
        simulateSwipe(100, 50, 130, 200)

        expect(onSwipeDown).toHaveBeenCalled()
        expect(onSwipeRight).not.toHaveBeenCalled()
    })

    test('cleans up event listeners', () => {
        const ref = { current: element }
        const removeEventListenerSpy = jest.spyOn(
            element,
            'removeEventListener'
        )
        const windowRemoveEventListenerSpy = jest.spyOn(
            window,
            'removeEventListener'
        )

        const { unmount } = renderHook(() => useSwipe(ref))

        unmount()

        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            'touchstart',
            expect.any(Function)
        )
        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            'touchmove',
            expect.any(Function)
        )
        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            'touchend',
            expect.any(Function)
        )
        expect(windowRemoveEventListenerSpy).toHaveBeenCalledWith(
            'mousemove',
            expect.any(Function)
        )
        expect(windowRemoveEventListenerSpy).toHaveBeenCalledWith(
            'mouseup',
            expect.any(Function)
        )

        removeEventListenerSpy.mockRestore()
        windowRemoveEventListenerSpy.mockRestore()
    })
})
