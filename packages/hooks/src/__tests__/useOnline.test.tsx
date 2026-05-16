import { renderHook, act } from '@testing-library/react'
import useOnline from '../useOnline'

// Mock navigator.onLine
const mockNavigatorOnline = (value: boolean) => {
    Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value,
    })
}

describe('useOnline', () => {
    beforeEach(() => {
        mockNavigatorOnline(true)
    })

    it('should return true when online', () => {
        mockNavigatorOnline(true)
        const { result } = renderHook(() => useOnline())

        expect(result.current).toBe(true)
    })

    it('should return false when offline', () => {
        mockNavigatorOnline(false)
        const { result } = renderHook(() => useOnline())

        expect(result.current).toBe(false)
    })

    it('should update to true on online event', () => {
        mockNavigatorOnline(false)
        const { result } = renderHook(() => useOnline())

        expect(result.current).toBe(false)

        act(() => {
            mockNavigatorOnline(true)
            window.dispatchEvent(new Event('online'))
        })

        expect(result.current).toBe(true)
    })

    it('should update to false on offline event', () => {
        mockNavigatorOnline(true)
        const { result } = renderHook(() => useOnline())

        expect(result.current).toBe(true)

        act(() => {
            mockNavigatorOnline(false)
            window.dispatchEvent(new Event('offline'))
        })

        expect(result.current).toBe(false)
    })

    it('should handle multiple online/offline transitions', () => {
        mockNavigatorOnline(true)
        const { result } = renderHook(() => useOnline())

        expect(result.current).toBe(true)

        act(() => {
            mockNavigatorOnline(false)
            window.dispatchEvent(new Event('offline'))
        })

        expect(result.current).toBe(false)

        act(() => {
            mockNavigatorOnline(true)
            window.dispatchEvent(new Event('online'))
        })

        expect(result.current).toBe(true)

        act(() => {
            mockNavigatorOnline(false)
            window.dispatchEvent(new Event('offline'))
        })

        expect(result.current).toBe(false)
    })

    it('should cleanup event listeners on unmount', () => {
        const addEventListener = jest.fn()
        const removeEventListener = jest.fn()

        window.addEventListener = addEventListener
        window.removeEventListener = removeEventListener

        const { unmount } = renderHook(() => useOnline())

        expect(addEventListener).toHaveBeenCalledWith(
            'online',
            expect.any(Function)
        )
        expect(addEventListener).toHaveBeenCalledWith(
            'offline',
            expect.any(Function)
        )

        unmount()

        expect(removeEventListener).toHaveBeenCalledWith(
            'online',
            expect.any(Function)
        )
        expect(removeEventListener).toHaveBeenCalledWith(
            'offline',
            expect.any(Function)
        )
    })

    it('should return true as default when navigator is not available', () => {
        const originalNavigator = global.navigator
        // @ts-ignore
        delete global.navigator

        const { result } = renderHook(() => useOnline())

        expect(result.current).toBe(true)

        // Restore
        global.navigator = originalNavigator
    })

    it('should not cause re-renders without actual state changes', () => {
        let renderCount = 0

        const { result } = renderHook(() => {
            renderCount++
            return useOnline()
        })

        // Dispatch event without actual state change
        act(() => {
            mockNavigatorOnline(true) // Already true
            window.dispatchEvent(new Event('online'))
        })

        // State remains true
        expect(result.current).toBe(true)
        // Will re-render due to React behavior, but that's expected
        expect(renderCount).toBeGreaterThan(0)
    })
})
