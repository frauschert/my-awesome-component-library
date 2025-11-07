import { renderHook, act } from '@testing-library/react'
import { useRef } from 'react'
import usePinch from '../usePinch'

describe('usePinch', () => {
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
        touches: Array<{ clientX: number; clientY: number }>
    ): TouchEvent => {
        const touchList = touches.map(
            (t, index) =>
                ({
                    clientX: t.clientX,
                    clientY: t.clientY,
                    identifier: index,
                    pageX: t.clientX,
                    pageY: t.clientY,
                    screenX: t.clientX,
                    screenY: t.clientY,
                    target: element,
                } as Touch)
        )

        const event = new Event(type, {
            bubbles: true,
            cancelable: true,
        }) as TouchEvent
        Object.defineProperty(event, 'touches', {
            value:
                type === 'touchend' || type === 'touchcancel' ? [] : touchList,
            writable: false,
        })
        Object.defineProperty(event, 'changedTouches', {
            value: touchList,
            writable: false,
        })

        return event
    }

    const simulatePinch = (
        initialDistance: number,
        finalDistance: number,
        centerX = 200,
        centerY = 200
    ) => {
        const halfInitial = initialDistance / 2
        const halfFinal = finalDistance / 2

        // Start with two touches
        act(() => {
            element.dispatchEvent(
                createTouchEvent('touchstart', [
                    { clientX: centerX - halfInitial, clientY: centerY },
                    { clientX: centerX + halfInitial, clientY: centerY },
                ])
            )
        })

        // Move to final distance
        act(() => {
            element.dispatchEvent(
                createTouchEvent('touchmove', [
                    { clientX: centerX - halfFinal, clientY: centerY },
                    { clientX: centerX + halfFinal, clientY: centerY },
                ])
            )
        })

        // End
        act(() => {
            element.dispatchEvent(
                createTouchEvent('touchend', [
                    { clientX: centerX - halfFinal, clientY: centerY },
                    { clientX: centerX + halfFinal, clientY: centerY },
                ])
            )
        })
    }

    test('initial state', () => {
        const ref = { current: element }
        const { result } = renderHook(() => usePinch(ref))

        expect(result.current.scale).toBe(1)
        expect(result.current.isPinching).toBe(false)
    })

    test('detects pinch zoom in', () => {
        const onPinch = jest.fn()
        const ref = { current: element }

        renderHook(() => usePinch(ref, { onPinch }))

        simulatePinch(100, 200) // Pinch out (zoom in)

        expect(onPinch).toHaveBeenCalled()
        const lastCall = onPinch.mock.calls[onPinch.mock.calls.length - 1][0]
        expect(lastCall.scale).toBeGreaterThan(1)
        expect(lastCall.direction).toBe('in')
    })

    test('detects pinch zoom out', () => {
        const onPinch = jest.fn()
        const ref = { current: element }

        renderHook(() => usePinch(ref, { onPinch }))

        simulatePinch(200, 100) // Pinch in (zoom out)

        expect(onPinch).toHaveBeenCalled()
        const lastCall = onPinch.mock.calls[onPinch.mock.calls.length - 1][0]
        expect(lastCall.scale).toBeLessThan(1)
        expect(lastCall.direction).toBe('out')
    })

    test('updates scale state', () => {
        const ref = { current: element }
        const { result } = renderHook(() => usePinch(ref))

        expect(result.current.scale).toBe(1)

        simulatePinch(100, 200)

        expect(result.current.scale).toBeGreaterThan(1)
    })

    test('calls onPinchStart callback', () => {
        const onPinchStart = jest.fn()
        const ref = { current: element }

        renderHook(() => usePinch(ref, { onPinchStart }))

        act(() => {
            element.dispatchEvent(
                createTouchEvent('touchstart', [
                    { clientX: 150, clientY: 200 },
                    { clientX: 250, clientY: 200 },
                ])
            )
        })

        expect(onPinchStart).toHaveBeenCalledWith(
            expect.objectContaining({
                scale: 1,
                center: expect.any(Object),
                distance: expect.any(Number),
            })
        )
    })

    test('calls onPinchEnd callback', () => {
        const onPinchEnd = jest.fn()
        const ref = { current: element }

        renderHook(() => usePinch(ref, { onPinchEnd }))

        simulatePinch(100, 150)

        expect(onPinchEnd).toHaveBeenCalled()
    })

    test('sets isPinching state during gesture', () => {
        const ref = { current: element }
        const { result } = renderHook(() => usePinch(ref))

        expect(result.current.isPinching).toBe(false)

        act(() => {
            element.dispatchEvent(
                createTouchEvent('touchstart', [
                    { clientX: 150, clientY: 200 },
                    { clientX: 250, clientY: 200 },
                ])
            )
        })

        expect(result.current.isPinching).toBe(true)

        act(() => {
            element.dispatchEvent(
                createTouchEvent('touchend', [
                    { clientX: 150, clientY: 200 },
                    { clientX: 250, clientY: 200 },
                ])
            )
        })

        expect(result.current.isPinching).toBe(false)
    })

    test('respects minScale limit', () => {
        const ref = { current: element }
        const { result } = renderHook(() => usePinch(ref, { minScale: 0.5 }))

        // Try to zoom out beyond minimum
        simulatePinch(200, 20) // Very small distance

        expect(result.current.scale).toBeGreaterThanOrEqual(0.5)
    })

    test('respects maxScale limit', () => {
        const ref = { current: element }
        const { result } = renderHook(() => usePinch(ref, { maxScale: 2 }))

        // Try to zoom in beyond maximum
        simulatePinch(50, 500) // Very large distance

        expect(result.current.scale).toBeLessThanOrEqual(2)
    })

    test('applies sensitivity multiplier', () => {
        const onPinch = jest.fn()
        const ref = { current: element }

        renderHook(() => usePinch(ref, { onPinch, sensitivity: 2 }))

        simulatePinch(100, 150)

        expect(onPinch).toHaveBeenCalled()
        // With sensitivity 2, a 1.5x distance change should result in ~3x scale
        const lastCall = onPinch.mock.calls[onPinch.mock.calls.length - 1][0]
        expect(lastCall.scale).toBeGreaterThan(2)
    })

    test('reset function resets scale to 1', () => {
        const ref = { current: element }
        const { result } = renderHook(() => usePinch(ref))

        simulatePinch(100, 200)
        expect(result.current.scale).toBeGreaterThan(1)

        act(() => {
            result.current.reset()
        })

        expect(result.current.scale).toBe(1)
    })

    test('provides center point of gesture', () => {
        const onPinch = jest.fn()
        const ref = { current: element }

        renderHook(() => usePinch(ref, { onPinch }))

        simulatePinch(100, 150, 300, 400)

        expect(onPinch).toHaveBeenCalled()
        const event = onPinch.mock.calls[0][0]
        expect(event.center.x).toBe(300)
        expect(event.center.y).toBe(400)
    })

    test('calculates distance between touch points', () => {
        const onPinch = jest.fn()
        const ref = { current: element }

        renderHook(() => usePinch(ref, { onPinch }))

        simulatePinch(100, 150)

        expect(onPinch).toHaveBeenCalled()
        const event = onPinch.mock.calls[0][0]
        expect(event.distance).toBeCloseTo(150, 0)
    })

    test('provides delta between scale changes', () => {
        const onPinch = jest.fn()
        const ref = { current: element }

        renderHook(() => usePinch(ref, { onPinch }))

        act(() => {
            element.dispatchEvent(
                createTouchEvent('touchstart', [
                    { clientX: 150, clientY: 200 },
                    { clientX: 250, clientY: 200 },
                ])
            )
        })

        act(() => {
            element.dispatchEvent(
                createTouchEvent('touchmove', [
                    { clientX: 100, clientY: 200 },
                    { clientX: 300, clientY: 200 },
                ])
            )
        })

        expect(onPinch).toHaveBeenCalled()
        const event = onPinch.mock.calls[0][0]
        expect(event.delta).toBeDefined()
        expect(typeof event.delta).toBe('number')
    })

    test('handles null ref', () => {
        const { result } = renderHook(() => usePinch(null))

        expect(result.current.scale).toBe(1)
        expect(result.current.isPinching).toBe(false)
    })

    test('can be disabled', () => {
        const onPinch = jest.fn()
        const ref = { current: element }

        renderHook(() => usePinch(ref, { onPinch, enabled: false }))

        simulatePinch(100, 200)

        expect(onPinch).not.toHaveBeenCalled()
    })

    test('handles touchcancel event', () => {
        const onPinchEnd = jest.fn()
        const ref = { current: element }

        renderHook(() => usePinch(ref, { onPinchEnd }))

        act(() => {
            element.dispatchEvent(
                createTouchEvent('touchstart', [
                    { clientX: 150, clientY: 200 },
                    { clientX: 250, clientY: 200 },
                ])
            )
        })

        act(() => {
            element.dispatchEvent(
                createTouchEvent('touchcancel', [
                    { clientX: 150, clientY: 200 },
                    { clientX: 250, clientY: 200 },
                ])
            )
        })

        expect(onPinchEnd).toHaveBeenCalled()
    })

    test('ignores single touch', () => {
        const onPinch = jest.fn()
        const ref = { current: element }

        renderHook(() => usePinch(ref, { onPinch }))

        act(() => {
            element.dispatchEvent(
                createTouchEvent('touchstart', [{ clientX: 200, clientY: 200 }])
            )
        })

        expect(onPinch).not.toHaveBeenCalled()
    })

    test('ignores three or more touches', () => {
        const onPinch = jest.fn()
        const ref = { current: element }

        renderHook(() => usePinch(ref, { onPinch }))

        act(() => {
            element.dispatchEvent(
                createTouchEvent('touchstart', [
                    { clientX: 150, clientY: 200 },
                    { clientX: 250, clientY: 200 },
                    { clientX: 350, clientY: 200 },
                ])
            )
        })

        expect(onPinch).not.toHaveBeenCalled()
    })

    test('cleans up event listeners', () => {
        const ref = { current: element }
        const removeEventListenerSpy = jest.spyOn(
            element,
            'removeEventListener'
        )

        const { unmount } = renderHook(() => usePinch(ref))

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
        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            'touchcancel',
            expect.any(Function)
        )

        removeEventListenerSpy.mockRestore()
    })

    test('maintains scale across multiple pinches', () => {
        const ref = { current: element }
        const { result } = renderHook(() => usePinch(ref))

        // First pinch - zoom to 2x
        simulatePinch(100, 200)
        const firstScale = result.current.scale

        // Second pinch - zoom more from current scale
        simulatePinch(100, 150)
        const secondScale = result.current.scale

        expect(secondScale).toBeGreaterThan(firstScale)
    })
})
