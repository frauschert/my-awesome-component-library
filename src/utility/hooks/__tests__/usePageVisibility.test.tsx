import { renderHook, act } from '@testing-library/react'
import usePageVisibility from '../usePageVisibility'

describe('usePageVisibility', () => {
    let originalHidden: PropertyDescriptor | undefined
    let originalVisibilityState: PropertyDescriptor | undefined

    beforeEach(() => {
        // Store original descriptors
        originalHidden = Object.getOwnPropertyDescriptor(
            Document.prototype,
            'hidden'
        )
        originalVisibilityState = Object.getOwnPropertyDescriptor(
            Document.prototype,
            'visibilityState'
        )

        // Setup initial state as visible
        Object.defineProperty(document, 'hidden', {
            writable: true,
            configurable: true,
            value: false,
        })

        Object.defineProperty(document, 'visibilityState', {
            writable: true,
            configurable: true,
            value: 'visible',
        })
    })

    afterEach(() => {
        // Restore original descriptors
        if (originalHidden) {
            Object.defineProperty(Document.prototype, 'hidden', originalHidden)
        }
        if (originalVisibilityState) {
            Object.defineProperty(
                Document.prototype,
                'visibilityState',
                originalVisibilityState
            )
        }
    })

    test('initial state is visible', () => {
        const { result } = renderHook(() => usePageVisibility())

        expect(result.current.isVisible).toBe(true)
        expect(result.current.visibilityState).toBe('visible')
        expect(result.current.isSupported).toBe(true)
    })

    test('initial state is hidden when document is hidden', () => {
        Object.defineProperty(document, 'hidden', {
            writable: true,
            configurable: true,
            value: true,
        })

        Object.defineProperty(document, 'visibilityState', {
            writable: true,
            configurable: true,
            value: 'hidden',
        })

        const { result } = renderHook(() => usePageVisibility())

        expect(result.current.isVisible).toBe(false)
        expect(result.current.visibilityState).toBe('hidden')
    })

    test('detects when page becomes hidden', () => {
        const { result } = renderHook(() => usePageVisibility())

        expect(result.current.isVisible).toBe(true)

        act(() => {
            Object.defineProperty(document, 'hidden', {
                writable: true,
                configurable: true,
                value: true,
            })

            Object.defineProperty(document, 'visibilityState', {
                writable: true,
                configurable: true,
                value: 'hidden',
            })

            document.dispatchEvent(new Event('visibilitychange'))
        })

        expect(result.current.isVisible).toBe(false)
        expect(result.current.visibilityState).toBe('hidden')
    })

    test('detects when page becomes visible', () => {
        // Start hidden
        Object.defineProperty(document, 'hidden', {
            writable: true,
            configurable: true,
            value: true,
        })

        Object.defineProperty(document, 'visibilityState', {
            writable: true,
            configurable: true,
            value: 'hidden',
        })

        const { result } = renderHook(() => usePageVisibility())

        expect(result.current.isVisible).toBe(false)

        act(() => {
            Object.defineProperty(document, 'hidden', {
                writable: true,
                configurable: true,
                value: false,
            })

            Object.defineProperty(document, 'visibilityState', {
                writable: true,
                configurable: true,
                value: 'visible',
            })

            document.dispatchEvent(new Event('visibilitychange'))
        })

        expect(result.current.isVisible).toBe(true)
        expect(result.current.visibilityState).toBe('visible')
    })

    test('calls onChange callback', () => {
        const onChange = jest.fn()
        renderHook(() => usePageVisibility({ onChange }))

        // Should be called once on mount
        expect(onChange).toHaveBeenCalledWith(true, 'visible')

        act(() => {
            Object.defineProperty(document, 'hidden', {
                writable: true,
                configurable: true,
                value: true,
            })

            Object.defineProperty(document, 'visibilityState', {
                writable: true,
                configurable: true,
                value: 'hidden',
            })

            document.dispatchEvent(new Event('visibilitychange'))
        })

        expect(onChange).toHaveBeenCalledWith(false, 'hidden')
    })

    test('calls onShow callback when page becomes visible', () => {
        const onShow = jest.fn()

        // Start hidden
        Object.defineProperty(document, 'hidden', {
            writable: true,
            configurable: true,
            value: true,
        })

        Object.defineProperty(document, 'visibilityState', {
            writable: true,
            configurable: true,
            value: 'hidden',
        })

        renderHook(() => usePageVisibility({ onShow }))

        act(() => {
            Object.defineProperty(document, 'hidden', {
                writable: true,
                configurable: true,
                value: false,
            })

            Object.defineProperty(document, 'visibilityState', {
                writable: true,
                configurable: true,
                value: 'visible',
            })

            document.dispatchEvent(new Event('visibilitychange'))
        })

        expect(onShow).toHaveBeenCalled()
    })

    test('calls onHide callback when page becomes hidden', () => {
        const onHide = jest.fn()
        renderHook(() => usePageVisibility({ onHide }))

        act(() => {
            Object.defineProperty(document, 'hidden', {
                writable: true,
                configurable: true,
                value: true,
            })

            Object.defineProperty(document, 'visibilityState', {
                writable: true,
                configurable: true,
                value: 'hidden',
            })

            document.dispatchEvent(new Event('visibilitychange'))
        })

        expect(onHide).toHaveBeenCalled()
    })

    test('does not call onShow when becoming hidden', () => {
        const onShow = jest.fn()
        renderHook(() => usePageVisibility({ onShow }))

        onShow.mockClear()

        act(() => {
            Object.defineProperty(document, 'hidden', {
                writable: true,
                configurable: true,
                value: true,
            })

            Object.defineProperty(document, 'visibilityState', {
                writable: true,
                configurable: true,
                value: 'hidden',
            })

            document.dispatchEvent(new Event('visibilitychange'))
        })

        expect(onShow).not.toHaveBeenCalled()
    })

    test('does not call onHide when becoming visible', () => {
        const onHide = jest.fn()

        // Start hidden
        Object.defineProperty(document, 'hidden', {
            writable: true,
            configurable: true,
            value: true,
        })

        Object.defineProperty(document, 'visibilityState', {
            writable: true,
            configurable: true,
            value: 'hidden',
        })

        renderHook(() => usePageVisibility({ onHide }))

        onHide.mockClear()

        act(() => {
            Object.defineProperty(document, 'hidden', {
                writable: true,
                configurable: true,
                value: false,
            })

            Object.defineProperty(document, 'visibilityState', {
                writable: true,
                configurable: true,
                value: 'visible',
            })

            document.dispatchEvent(new Event('visibilitychange'))
        })

        expect(onHide).not.toHaveBeenCalled()
    })

    test('cleans up event listener on unmount', () => {
        const removeEventListenerSpy = jest.spyOn(
            document,
            'removeEventListener'
        )

        const { unmount } = renderHook(() => usePageVisibility())

        unmount()

        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            'visibilitychange',
            expect.any(Function)
        )

        removeEventListenerSpy.mockRestore()
    })

    test('handles multiple visibility changes', () => {
        const onChange = jest.fn()
        const { result } = renderHook(() => usePageVisibility({ onChange }))

        onChange.mockClear()

        // Hide
        act(() => {
            Object.defineProperty(document, 'hidden', {
                writable: true,
                configurable: true,
                value: true,
            })

            Object.defineProperty(document, 'visibilityState', {
                writable: true,
                configurable: true,
                value: 'hidden',
            })

            document.dispatchEvent(new Event('visibilitychange'))
        })

        expect(result.current.isVisible).toBe(false)
        expect(onChange).toHaveBeenCalledWith(false, 'hidden')

        // Show
        act(() => {
            Object.defineProperty(document, 'hidden', {
                writable: true,
                configurable: true,
                value: false,
            })

            Object.defineProperty(document, 'visibilityState', {
                writable: true,
                configurable: true,
                value: 'visible',
            })

            document.dispatchEvent(new Event('visibilitychange'))
        })

        expect(result.current.isVisible).toBe(true)
        expect(onChange).toHaveBeenCalledWith(true, 'visible')

        // Hide again
        act(() => {
            Object.defineProperty(document, 'hidden', {
                writable: true,
                configurable: true,
                value: true,
            })

            Object.defineProperty(document, 'visibilityState', {
                writable: true,
                configurable: true,
                value: 'hidden',
            })

            document.dispatchEvent(new Event('visibilitychange'))
        })

        expect(result.current.isVisible).toBe(false)
        expect(onChange).toHaveBeenCalledWith(false, 'hidden')

        expect(onChange).toHaveBeenCalledTimes(3)
    })

    test('handles prerender state as visible', () => {
        Object.defineProperty(document, 'visibilityState', {
            writable: true,
            configurable: true,
            value: 'prerender',
        })

        Object.defineProperty(document, 'hidden', {
            writable: true,
            configurable: true,
            value: false,
        })

        const { result } = renderHook(() => usePageVisibility())

        expect(result.current.visibilityState).toBe('visible')
        expect(result.current.isVisible).toBe(true)
    })

    test('works without callbacks', () => {
        const { result } = renderHook(() => usePageVisibility())

        expect(result.current.isVisible).toBe(true)

        act(() => {
            Object.defineProperty(document, 'hidden', {
                writable: true,
                configurable: true,
                value: true,
            })

            Object.defineProperty(document, 'visibilityState', {
                writable: true,
                configurable: true,
                value: 'hidden',
            })

            document.dispatchEvent(new Event('visibilitychange'))
        })

        expect(result.current.isVisible).toBe(false)
    })

    test('updates with new callback references', () => {
        const onChange1 = jest.fn()
        const { rerender } = renderHook(
            ({ onChange }) => usePageVisibility({ onChange }),
            { initialProps: { onChange: onChange1 } }
        )

        onChange1.mockClear()

        const onChange2 = jest.fn()
        rerender({ onChange: onChange2 })

        act(() => {
            Object.defineProperty(document, 'hidden', {
                writable: true,
                configurable: true,
                value: true,
            })

            Object.defineProperty(document, 'visibilityState', {
                writable: true,
                configurable: true,
                value: 'hidden',
            })

            document.dispatchEvent(new Event('visibilitychange'))
        })

        expect(onChange2).toHaveBeenCalled()
    })
})
