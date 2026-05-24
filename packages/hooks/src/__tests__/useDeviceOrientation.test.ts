import { act, renderHook } from '@testing-library/react'
import useDeviceOrientation from '../useDeviceOrientation'

type PermissionState = 'granted' | 'denied'

const originalDeviceOrientationEvent = (
    window as Window & { DeviceOrientationEvent?: unknown }
).DeviceOrientationEvent
const originalOnDeviceOrientation = (
    window as Window & { ondeviceorientation?: unknown }
).ondeviceorientation

let requestPermissionMock: jest.Mock<Promise<PermissionState>, []>

function emitDeviceOrientation(values: {
    alpha: number | null
    beta: number | null
    gamma: number | null
    absolute?: boolean
}) {
    const event = new Event('deviceorientation') as Event & {
        alpha: number | null
        beta: number | null
        gamma: number | null
        absolute?: boolean
    }

    Object.assign(event, values)
    window.dispatchEvent(event)
}

beforeEach(() => {
    requestPermissionMock = jest.fn(async () => 'granted')

    Object.defineProperty(window, 'DeviceOrientationEvent', {
        value: {
            requestPermission: requestPermissionMock,
        },
        configurable: true,
        writable: true,
    })

    Object.defineProperty(window, 'ondeviceorientation', {
        value: null,
        configurable: true,
        writable: true,
    })
})

afterEach(() => {
    Object.defineProperty(window, 'DeviceOrientationEvent', {
        value: originalDeviceOrientationEvent,
        configurable: true,
        writable: true,
    })

    Object.defineProperty(window, 'ondeviceorientation', {
        value: originalOnDeviceOrientation,
        configurable: true,
        writable: true,
    })

    jest.clearAllMocks()
})

describe('useDeviceOrientation', () => {
    it('initialises with supported prompt state when permission is required', () => {
        const { result } = renderHook(() => useDeviceOrientation())

        expect(result.current.isSupported).toBe(true)
        expect(result.current.permissionState).toBe('prompt')
        expect(result.current.isListening).toBe(false)
        expect(result.current.orientation).toBe(null)
        expect(result.current.error).toBe(null)
    })

    it('requests permission and starts listening', async () => {
        const { result } = renderHook(() => useDeviceOrientation())

        await act(async () => {
            await result.current.start()
        })

        expect(requestPermissionMock).toHaveBeenCalledTimes(1)
        expect(result.current.permissionState).toBe('granted')
        expect(result.current.isListening).toBe(true)
    })

    it('updates orientation state and calls onChange when events arrive', async () => {
        const onChange = jest.fn()
        const { result } = renderHook(() => useDeviceOrientation({ onChange }))

        await act(async () => {
            await result.current.start()
        })

        act(() => {
            emitDeviceOrientation({
                alpha: 10,
                beta: 20,
                gamma: 30,
                absolute: true,
            })
        })

        expect(result.current.orientation).toEqual({
            alpha: 10,
            beta: 20,
            gamma: 30,
            absolute: true,
        })
        expect(onChange).toHaveBeenCalledWith({
            alpha: 10,
            beta: 20,
            gamma: 30,
            absolute: true,
        })
    })

    it('stops listening and ignores later events after stop()', async () => {
        const { result } = renderHook(() => useDeviceOrientation())

        await act(async () => {
            await result.current.start()
        })

        act(() => {
            emitDeviceOrientation({
                alpha: 1,
                beta: 2,
                gamma: 3,
                absolute: false,
            })
        })

        expect(result.current.orientation?.alpha).toBe(1)

        act(() => {
            result.current.stop()
        })

        act(() => {
            emitDeviceOrientation({
                alpha: 4,
                beta: 5,
                gamma: 6,
                absolute: true,
            })
        })

        expect(result.current.isListening).toBe(false)
        expect(result.current.orientation).toEqual({
            alpha: 1,
            beta: 2,
            gamma: 3,
            absolute: false,
        })
    })

    it('surfaces denied permission', async () => {
        requestPermissionMock.mockResolvedValue('denied')
        const onError = jest.fn()

        const { result } = renderHook(() => useDeviceOrientation({ onError }))

        await act(async () => {
            await result.current.start()
        })

        expect(result.current.permissionState).toBe('denied')
        expect(result.current.isListening).toBe(false)
        expect(result.current.error?.message).toBe(
            'Device orientation permission denied'
        )
        expect(onError).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Device orientation permission denied',
            })
        )
    })

    it('reports unsupported browsers', async () => {
        Object.defineProperty(window, 'DeviceOrientationEvent', {
            value: undefined,
            configurable: true,
            writable: true,
        })

        Object.defineProperty(window, 'ondeviceorientation', {
            value: undefined,
            configurable: true,
            writable: true,
        })

        const onError = jest.fn()
        const { result } = renderHook(() => useDeviceOrientation({ onError }))

        await act(async () => {
            await result.current.start()
        })

        expect(result.current.isSupported).toBe(false)
        expect(result.current.permissionState).toBe('unsupported')
        expect(result.current.error?.message).toBe(
            'Device orientation is not supported by this browser'
        )
        expect(onError).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Device orientation is not supported by this browser',
            })
        )
    })

    it('starts immediately when immediate is true and cleans up on unmount', async () => {
        const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener')
        const { result, unmount } = renderHook(() =>
            useDeviceOrientation({ immediate: true })
        )

        expect(requestPermissionMock).toHaveBeenCalledTimes(1)

        await act(async () => {
            await Promise.resolve()
        })

        expect(result.current.isListening).toBe(true)

        unmount()

        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            'deviceorientation',
            expect.any(Function)
        )

        removeEventListenerSpy.mockRestore()
    })
})
