import { renderHook, act } from '@testing-library/react'
import useVibrate from '../useVibrate'

describe('useVibrate', () => {
    let vibrateMock: jest.Mock

    beforeEach(() => {
        jest.useFakeTimers()
        vibrateMock = jest.fn().mockReturnValue(true)

        // Mock navigator.vibrate
        Object.defineProperty(window.navigator, 'vibrate', {
            writable: true,
            configurable: true,
            value: vibrateMock,
        })
    })

    afterEach(() => {
        jest.runOnlyPendingTimers()
        jest.useRealTimers()
    })

    test('detects API support when available', () => {
        const { result } = renderHook(() => useVibrate())

        expect(result.current.isSupported).toBe(true)
    })

    test('detects no support when API is unavailable', () => {
        // Remove vibrate from navigator
        Object.defineProperty(window.navigator, 'vibrate', {
            writable: true,
            configurable: true,
            value: undefined,
        })

        const { result } = renderHook(() => useVibrate())

        expect(result.current.isSupported).toBe(false)
    })

    test('vibrates with default pattern', () => {
        const { result } = renderHook(() => useVibrate())

        act(() => {
            result.current.vibrate()
        })

        expect(vibrateMock).toHaveBeenCalledWith(200)
    })

    test('vibrates with custom single duration', () => {
        const { result } = renderHook(() => useVibrate())

        act(() => {
            result.current.vibrate(100)
        })

        expect(vibrateMock).toHaveBeenCalledWith(100)
    })

    test('vibrates with custom pattern array', () => {
        const { result } = renderHook(() => useVibrate())

        act(() => {
            result.current.vibrate([200, 100, 200])
        })

        expect(vibrateMock).toHaveBeenCalledWith([200, 100, 200])
    })

    test('uses custom default pattern from options', () => {
        const { result } = renderHook(() => useVibrate({ defaultPattern: 50 }))

        act(() => {
            result.current.vibrate()
        })

        expect(vibrateMock).toHaveBeenCalledWith(50)
    })

    test('stops vibration', () => {
        const { result } = renderHook(() => useVibrate())

        act(() => {
            result.current.vibrate(1000)
        })

        expect(vibrateMock).toHaveBeenCalledWith(1000)

        act(() => {
            result.current.stop()
        })

        expect(vibrateMock).toHaveBeenCalledWith(0)
    })

    test('does nothing when vibrate is called without support', () => {
        Object.defineProperty(window.navigator, 'vibrate', {
            writable: true,
            configurable: true,
            value: undefined,
        })

        const { result } = renderHook(() => useVibrate())

        act(() => {
            result.current.vibrate(100)
        })

        expect(vibrateMock).not.toHaveBeenCalled()
    })

    test('does nothing when stop is called without support', () => {
        Object.defineProperty(window.navigator, 'vibrate', {
            writable: true,
            configurable: true,
            value: undefined,
        })

        const { result } = renderHook(() => useVibrate())

        act(() => {
            result.current.stop()
        })

        expect(vibrateMock).not.toHaveBeenCalled()
    })

    test('calls onNotSupported when API is unavailable', () => {
        const onNotSupported = jest.fn()

        Object.defineProperty(window.navigator, 'vibrate', {
            writable: true,
            configurable: true,
            value: undefined,
        })

        renderHook(() => useVibrate({ onNotSupported }))

        expect(onNotSupported).toHaveBeenCalledTimes(1)
    })

    test('does not call onNotSupported when API is available', () => {
        const onNotSupported = jest.fn()

        renderHook(() => useVibrate({ onNotSupported }))

        expect(onNotSupported).not.toHaveBeenCalled()
    })

    test('clears timeout when vibrating again', () => {
        const { result } = renderHook(() => useVibrate())

        act(() => {
            result.current.vibrate(500)
        })

        expect(vibrateMock).toHaveBeenCalledWith(500)

        // Vibrate again before first pattern completes
        act(() => {
            result.current.vibrate(200)
        })

        expect(vibrateMock).toHaveBeenCalledWith(200)
        expect(vibrateMock).toHaveBeenCalledTimes(2)
    })

    test('handles vibration API errors gracefully', () => {
        const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()
        vibrateMock.mockImplementation(() => {
            throw new Error('Vibration failed')
        })

        const { result } = renderHook(() => useVibrate())

        act(() => {
            result.current.vibrate(100)
        })

        expect(consoleWarnSpy).toHaveBeenCalledWith(
            'Vibration API error:',
            expect.any(Error)
        )

        consoleWarnSpy.mockRestore()
    })

    test('stops vibration on unmount', () => {
        const { result, unmount } = renderHook(() => useVibrate())

        act(() => {
            result.current.vibrate(1000)
        })

        expect(vibrateMock).toHaveBeenCalledWith(1000)

        unmount()

        expect(vibrateMock).toHaveBeenCalledWith(0)
    })

    test('complex pattern with multiple vibrations', () => {
        const { result } = renderHook(() => useVibrate())

        // SOS pattern: short, short, short, pause, long, long, long
        const sosPattern = [100, 50, 100, 50, 100, 200, 300, 50, 300, 50, 300]

        act(() => {
            result.current.vibrate(sosPattern)
        })

        expect(vibrateMock).toHaveBeenCalledWith(sosPattern)
    })

    test('handles failed vibration gracefully', () => {
        vibrateMock.mockReturnValue(false)

        const { result } = renderHook(() => useVibrate())

        act(() => {
            result.current.vibrate(100)
        })

        // Should not throw, just fail silently
        expect(vibrateMock).toHaveBeenCalledWith(100)
    })
})
