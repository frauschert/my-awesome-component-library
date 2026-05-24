import { act, renderHook } from '@testing-library/react'
import useScreenOrientation from '../useScreenOrientation'

type TestScreenOrientationType =
    | 'portrait-primary'
    | 'portrait-secondary'
    | 'landscape-primary'
    | 'landscape-secondary'

type TestScreenOrientationLockType =
    | 'any'
    | 'natural'
    | 'landscape'
    | 'portrait'
    | 'portrait-primary'
    | 'portrait-secondary'
    | 'landscape-primary'
    | 'landscape-secondary'

class MockScreenOrientation {
    type: TestScreenOrientationType = 'portrait-primary'
    angle = 0
    lock = jest.fn(async (orientation: TestScreenOrientationLockType) => {
        if (
            orientation === 'landscape' ||
            orientation === 'landscape-primary'
        ) {
            this.type = 'landscape-primary'
            this.angle = 90
            return
        }

        if (
            orientation === 'landscape-secondary' ||
            orientation === 'portrait-secondary'
        ) {
            this.type = orientation
            this.angle = orientation === 'landscape-secondary' ? 270 : 180
            return
        }

        this.type = 'portrait-primary'
        this.angle = 0
    })
    unlock = jest.fn()

    private listeners = new Set<() => void>()

    addEventListener = jest.fn((event: 'change', listener: () => void) => {
        if (event === 'change') {
            this.listeners.add(listener)
        }
    })

    removeEventListener = jest.fn((event: 'change', listener: () => void) => {
        if (event === 'change') {
            this.listeners.delete(listener)
        }
    })

    emitChange() {
        this.listeners.forEach((listener) => listener())
    }
}

const originalScreenOrientation = Object.getOwnPropertyDescriptor(
    window.screen,
    'orientation'
)
const originalWindowOrientation = Object.getOwnPropertyDescriptor(
    window,
    'orientation'
)
const originalOnOrientationChange = Object.getOwnPropertyDescriptor(
    window,
    'onorientationchange'
)

let mockScreenOrientation: MockScreenOrientation

beforeEach(() => {
    mockScreenOrientation = new MockScreenOrientation()

    Object.defineProperty(window.screen, 'orientation', {
        value: mockScreenOrientation,
        configurable: true,
        writable: true,
    })

    Object.defineProperty(window, 'orientation', {
        value: undefined,
        configurable: true,
        writable: true,
    })

    Object.defineProperty(window, 'onorientationchange', {
        value: null,
        configurable: true,
        writable: true,
    })
})

afterEach(() => {
    if (originalScreenOrientation) {
        Object.defineProperty(
            window.screen,
            'orientation',
            originalScreenOrientation
        )
    } else {
        delete (window.screen as Screen & { orientation?: unknown }).orientation
    }

    if (originalWindowOrientation) {
        Object.defineProperty(window, 'orientation', originalWindowOrientation)
    } else {
        delete (window as Window & { orientation?: unknown }).orientation
    }

    if (originalOnOrientationChange) {
        Object.defineProperty(
            window,
            'onorientationchange',
            originalOnOrientationChange
        )
    } else {
        delete (window as Window & { onorientationchange?: unknown })
            .onorientationchange
    }

    jest.clearAllMocks()
})

describe('useScreenOrientation', () => {
    it('initialises from the Screen Orientation API', () => {
        const { result } = renderHook(() => useScreenOrientation())

        expect(result.current.isSupported).toBe(true)
        expect(result.current.isLockSupported).toBe(true)
        expect(result.current.orientation).toEqual({
            type: 'portrait-primary',
            angle: 0,
            isPortrait: true,
            isLandscape: false,
        })
        expect(result.current.error).toBe(null)
    })

    it('updates orientation state and calls onChange when the orientation changes', () => {
        const onChange = jest.fn()
        const { result } = renderHook(() => useScreenOrientation({ onChange }))

        act(() => {
            mockScreenOrientation.type = 'landscape-primary'
            mockScreenOrientation.angle = 90
            mockScreenOrientation.emitChange()
        })

        expect(result.current.orientation).toEqual({
            type: 'landscape-primary',
            angle: 90,
            isPortrait: false,
            isLandscape: true,
        })
        expect(onChange).toHaveBeenCalledWith({
            type: 'landscape-primary',
            angle: 90,
            isPortrait: false,
            isLandscape: true,
        })
    })

    it('locks and unlocks the screen orientation through the Screen Orientation API', async () => {
        const { result } = renderHook(() => useScreenOrientation())

        await act(async () => {
            await result.current.lock('landscape-primary')
        })

        expect(mockScreenOrientation.lock).toHaveBeenCalledWith(
            'landscape-primary'
        )
        expect(result.current.orientation).toEqual({
            type: 'landscape-primary',
            angle: 90,
            isPortrait: false,
            isLandscape: true,
        })

        act(() => {
            result.current.unlock()
        })

        expect(mockScreenOrientation.unlock).toHaveBeenCalledTimes(1)
    })

    it('falls back to window.orientation and orientationchange when screen.orientation is unavailable', () => {
        Object.defineProperty(window.screen, 'orientation', {
            value: undefined,
            configurable: true,
            writable: true,
        })

        Object.defineProperty(window, 'orientation', {
            value: 90,
            configurable: true,
            writable: true,
        })

        const { result } = renderHook(() => useScreenOrientation())

        expect(result.current.orientation).toEqual({
            type: 'landscape-primary',
            angle: 90,
            isPortrait: false,
            isLandscape: true,
        })

        act(() => {
            Object.defineProperty(window, 'orientation', {
                value: 0,
                configurable: true,
                writable: true,
            })
            window.dispatchEvent(new Event('orientationchange'))
        })

        expect(result.current.orientation).toEqual({
            type: 'portrait-primary',
            angle: 0,
            isPortrait: true,
            isLandscape: false,
        })
    })

    it('reports unsupported browsers and surfaces lock errors', async () => {
        Object.defineProperty(window.screen, 'orientation', {
            value: undefined,
            configurable: true,
            writable: true,
        })

        Object.defineProperty(window, 'orientation', {
            value: undefined,
            configurable: true,
            writable: true,
        })

        Object.defineProperty(window, 'onorientationchange', {
            value: undefined,
            configurable: true,
            writable: true,
        })

        const onError = jest.fn()
        const { result } = renderHook(() => useScreenOrientation({ onError }))

        await act(async () => {
            await result.current.lock('portrait')
        })

        expect(result.current.isSupported).toBe(false)
        expect(result.current.isLockSupported).toBe(false)
        expect(result.current.orientation).toBe(null)
        expect(result.current.error?.message).toBe(
            'Screen orientation locking is not supported by this browser'
        )
        expect(onError).toHaveBeenCalledWith(
            expect.objectContaining({
                message:
                    'Screen orientation locking is not supported by this browser',
            })
        )
    })

    it('cleans up the screen-orientation change listener on unmount', () => {
        const { unmount } = renderHook(() => useScreenOrientation())

        unmount()

        expect(mockScreenOrientation.removeEventListener).toHaveBeenCalledWith(
            'change',
            expect.any(Function)
        )
    })
})
