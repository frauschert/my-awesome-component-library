import { renderHook, act, waitFor } from '@testing-library/react'
import useGeolocation from '../useGeolocation'

describe('useGeolocation', () => {
    let getCurrentPositionMock: jest.Mock
    let watchPositionMock: jest.Mock
    let clearWatchMock: jest.Mock

    const mockPosition: GeolocationPosition = {
        coords: {
            latitude: 40.7128,
            longitude: -74.006,
            accuracy: 10,
            altitude: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null,
        },
        timestamp: Date.now(),
    }

    beforeEach(() => {
        getCurrentPositionMock = jest.fn()
        watchPositionMock = jest.fn()
        clearWatchMock = jest.fn()

        Object.defineProperty(navigator, 'geolocation', {
            writable: true,
            configurable: true,
            value: {
                getCurrentPosition: getCurrentPositionMock,
                watchPosition: watchPositionMock,
                clearWatch: clearWatchMock,
            },
        })
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    test('detects API support', () => {
        const { result } = renderHook(() => useGeolocation())

        expect(result.current.isSupported).toBe(true)
    })

    test('detects no support when API is unavailable', () => {
        const originalGeolocation = window.navigator.geolocation

        // @ts-expect-error - Deleting for test
        delete window.navigator.geolocation

        const { result } = renderHook(() => useGeolocation())

        expect(result.current.isSupported).toBe(false)

        // Restore
        Object.defineProperty(window.navigator, 'geolocation', {
            writable: true,
            configurable: true,
            value: originalGeolocation,
        })
    })

    test('initial state is correct', () => {
        const { result } = renderHook(() => useGeolocation())

        expect(result.current.position).toBeNull()
        expect(result.current.error).toBeNull()
        expect(result.current.loading).toBe(false)
    })

    test('getPosition retrieves current location', async () => {
        getCurrentPositionMock.mockImplementation((success) => {
            success(mockPosition)
        })

        const { result } = renderHook(() => useGeolocation())

        act(() => {
            result.current.getPosition()
        })

        await waitFor(() => {
            expect(result.current.position).toEqual({
                coords: mockPosition.coords,
                timestamp: mockPosition.timestamp,
            })
            expect(result.current.loading).toBe(false)
            expect(result.current.error).toBeNull()
        })

        expect(getCurrentPositionMock).toHaveBeenCalledTimes(1)
    })

    test('getPosition sets loading state', () => {
        getCurrentPositionMock.mockImplementation(() => {
            // Don't call success/error to keep loading
        })

        const { result } = renderHook(() => useGeolocation())

        act(() => {
            result.current.getPosition()
        })

        expect(result.current.loading).toBe(true)
    })

    test('getPosition handles errors', async () => {
        const mockError: GeolocationPositionError = {
            code: 1,
            message: 'User denied geolocation',
            PERMISSION_DENIED: 1,
            POSITION_UNAVAILABLE: 2,
            TIMEOUT: 3,
        }

        getCurrentPositionMock.mockImplementation((_, error) => {
            error(mockError)
        })

        const { result } = renderHook(() => useGeolocation())

        act(() => {
            result.current.getPosition()
        })

        await waitFor(() => {
            expect(result.current.error).toEqual({
                code: 1,
                message: 'User denied geolocation',
            })
            expect(result.current.loading).toBe(false)
            expect(result.current.position).toBeNull()
        })
    })

    test('calls onSuccess callback', async () => {
        const onSuccess = jest.fn()

        getCurrentPositionMock.mockImplementation((success) => {
            success(mockPosition)
        })

        const { result } = renderHook(() => useGeolocation({ onSuccess }))

        act(() => {
            result.current.getPosition()
        })

        await waitFor(() => {
            expect(onSuccess).toHaveBeenCalledWith({
                coords: mockPosition.coords,
                timestamp: mockPosition.timestamp,
            })
        })
    })

    test('calls onError callback', async () => {
        const onError = jest.fn()
        const mockError: GeolocationPositionError = {
            code: 3,
            message: 'Timeout',
            PERMISSION_DENIED: 1,
            POSITION_UNAVAILABLE: 2,
            TIMEOUT: 3,
        }

        getCurrentPositionMock.mockImplementation((_, error) => {
            error(mockError)
        })

        const { result } = renderHook(() => useGeolocation({ onError }))

        act(() => {
            result.current.getPosition()
        })

        await waitFor(() => {
            expect(onError).toHaveBeenCalledWith({
                code: 3,
                message: 'Timeout',
            })
        })
    })

    test('startWatching begins continuous position tracking', () => {
        watchPositionMock.mockReturnValue(123)

        const { result } = renderHook(() => useGeolocation())

        act(() => {
            result.current.startWatching()
        })

        expect(watchPositionMock).toHaveBeenCalledTimes(1)
        expect(result.current.loading).toBe(true)
    })

    test('startWatching updates position on changes', async () => {
        let watchCallback: PositionCallback

        watchPositionMock.mockImplementation((success) => {
            watchCallback = success
            return 123
        })

        const { result } = renderHook(() => useGeolocation())

        act(() => {
            result.current.startWatching()
        })

        // Simulate position update
        act(() => {
            watchCallback(mockPosition)
        })

        await waitFor(() => {
            expect(result.current.position).toEqual({
                coords: mockPosition.coords,
                timestamp: mockPosition.timestamp,
            })
            expect(result.current.loading).toBe(false)
        })
    })

    test('stopWatching clears watch', () => {
        watchPositionMock.mockReturnValue(123)

        const { result } = renderHook(() => useGeolocation())

        act(() => {
            result.current.startWatching()
        })

        act(() => {
            result.current.stopWatching()
        })

        expect(clearWatchMock).toHaveBeenCalledWith(123)
        expect(result.current.loading).toBe(false)
    })

    test('handles immediate option', async () => {
        getCurrentPositionMock.mockImplementation((success) => {
            success(mockPosition)
        })

        renderHook(() => useGeolocation({ immediate: true }))

        await waitFor(() => {
            expect(getCurrentPositionMock).toHaveBeenCalledTimes(1)
        })
    })

    test('passes position options to API', () => {
        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 5000,
        }

        const { result } = renderHook(() => useGeolocation(options))

        act(() => {
            result.current.getPosition()
        })

        expect(getCurrentPositionMock).toHaveBeenCalledWith(
            expect.any(Function),
            expect.any(Function),
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 5000,
            }
        )
    })

    test('handles unsupported API on getPosition', () => {
        const originalGeolocation = window.navigator.geolocation

        // @ts-expect-error - Deleting for test
        delete window.navigator.geolocation

        const onError = jest.fn()
        const { result } = renderHook(() => useGeolocation({ onError }))

        act(() => {
            result.current.getPosition()
        })

        expect(result.current.error).toEqual({
            code: 0,
            message: 'Geolocation is not supported by this browser',
        })
        expect(onError).toHaveBeenCalled()

        // Restore
        Object.defineProperty(window.navigator, 'geolocation', {
            writable: true,
            configurable: true,
            value: originalGeolocation,
        })
    })

    test('handles unsupported API on startWatching', () => {
        const originalGeolocation = window.navigator.geolocation

        // @ts-expect-error - Deleting for test
        delete window.navigator.geolocation

        const onError = jest.fn()
        const { result } = renderHook(() => useGeolocation({ onError }))

        act(() => {
            result.current.startWatching()
        })

        expect(result.current.error).toEqual({
            code: 0,
            message: 'Geolocation is not supported by this browser',
        })
        expect(onError).toHaveBeenCalled()

        // Restore
        Object.defineProperty(window.navigator, 'geolocation', {
            writable: true,
            configurable: true,
            value: originalGeolocation,
        })
    })

    test('clears watch on unmount', () => {
        watchPositionMock.mockReturnValue(456)

        const { result, unmount } = renderHook(() => useGeolocation())

        act(() => {
            result.current.startWatching()
        })

        unmount()

        expect(clearWatchMock).toHaveBeenCalledWith(456)
    })

    test('replaces existing watch when startWatching is called again', () => {
        watchPositionMock.mockReturnValueOnce(111).mockReturnValueOnce(222)

        const { result } = renderHook(() => useGeolocation())

        act(() => {
            result.current.startWatching()
        })

        expect(watchPositionMock).toHaveBeenCalledTimes(1)

        act(() => {
            result.current.startWatching()
        })

        expect(clearWatchMock).toHaveBeenCalledWith(111)
        expect(watchPositionMock).toHaveBeenCalledTimes(2)
    })

    test('handles all coordinate properties', async () => {
        const fullPosition = {
            coords: {
                latitude: 40.7128,
                longitude: -74.006,
                accuracy: 10,
                altitude: 100,
                altitudeAccuracy: 5,
                heading: 180,
                speed: 5.5,
            },
            timestamp: Date.now(),
        }

        getCurrentPositionMock.mockImplementation((success) => {
            success(fullPosition)
        })

        const { result } = renderHook(() => useGeolocation())

        act(() => {
            result.current.getPosition()
        })

        await waitFor(() => {
            expect(result.current.position?.coords).toEqual(fullPosition.coords)
        })
    })
})
