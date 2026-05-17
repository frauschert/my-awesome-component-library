import { act, renderHook } from '@testing-library/react'
import useAnimationFrame from '../useAnimationFrame'

const originalRequestAnimationFrame = window.requestAnimationFrame
const originalCancelAnimationFrame = window.cancelAnimationFrame

let nextFrameId = 1
let frameCallbacks = new Map<number, FrameRequestCallback>()

function runFrame(timestamp: number) {
    const callbacks = Array.from(frameCallbacks.entries())
    frameCallbacks.clear()

    callbacks.forEach(([, callback]) => {
        callback(timestamp)
    })
}

beforeEach(() => {
    nextFrameId = 1
    frameCallbacks = new Map<number, FrameRequestCallback>()

    Object.defineProperty(window, 'requestAnimationFrame', {
        value: jest.fn((callback: FrameRequestCallback) => {
            const id = nextFrameId++
            frameCallbacks.set(id, callback)
            return id
        }),
        configurable: true,
        writable: true,
    })

    Object.defineProperty(window, 'cancelAnimationFrame', {
        value: jest.fn((id: number) => {
            frameCallbacks.delete(id)
        }),
        configurable: true,
        writable: true,
    })
})

afterEach(() => {
    Object.defineProperty(window, 'requestAnimationFrame', {
        value: originalRequestAnimationFrame,
        configurable: true,
        writable: true,
    })

    Object.defineProperty(window, 'cancelAnimationFrame', {
        value: originalCancelAnimationFrame,
        configurable: true,
        writable: true,
    })

    jest.clearAllMocks()
})

describe('useAnimationFrame', () => {
    it('initialises idle when autoStart is false', () => {
        const callback = jest.fn()

        const { result } = renderHook(() =>
            useAnimationFrame(callback, { autoStart: false })
        )

        expect(result.current.isSupported).toBe(true)
        expect(result.current.isRunning).toBe(false)
        expect(window.requestAnimationFrame).not.toHaveBeenCalled()
    })

    it('starts automatically by default and fires onStart', () => {
        const callback = jest.fn()
        const onStart = jest.fn()

        const { result } = renderHook(() =>
            useAnimationFrame(callback, { onStart })
        )

        expect(result.current.isRunning).toBe(true)
        expect(window.requestAnimationFrame).toHaveBeenCalledTimes(1)
        expect(onStart).toHaveBeenCalledTimes(1)
    })

    it('runs the callback with delta time and timestamp', () => {
        const callback = jest.fn()

        renderHook(() => useAnimationFrame(callback))

        act(() => {
            runFrame(100)
        })
        act(() => {
            runFrame(116)
        })

        expect(callback).toHaveBeenNthCalledWith(1, 0, 100)
        expect(callback).toHaveBeenNthCalledWith(2, 16, 116)
    })

    it('stops the loop and fires onStop', () => {
        const callback = jest.fn()
        const onStop = jest.fn()

        const { result } = renderHook(() =>
            useAnimationFrame(callback, { autoStart: false, onStop })
        )

        act(() => {
            result.current.start()
        })

        expect(result.current.isRunning).toBe(true)

        act(() => {
            result.current.stop()
        })

        expect(result.current.isRunning).toBe(false)
        expect(window.cancelAnimationFrame).toHaveBeenCalledTimes(1)
        expect(onStop).toHaveBeenCalledTimes(1)

        act(() => {
            runFrame(100)
        })

        expect(callback).not.toHaveBeenCalled()
    })

    it('resets frame delta when restarted', () => {
        const callback = jest.fn()

        const { result } = renderHook(() =>
            useAnimationFrame(callback, { autoStart: false })
        )

        act(() => {
            result.current.start()
        })
        act(() => {
            runFrame(100)
        })
        act(() => {
            result.current.stop()
        })
        act(() => {
            result.current.start()
        })
        act(() => {
            runFrame(200)
        })

        expect(callback).toHaveBeenNthCalledWith(1, 0, 100)
        expect(callback).toHaveBeenNthCalledWith(2, 0, 200)
    })

    it('reports unsupported browsers and no-ops on start', () => {
        Object.defineProperty(window, 'requestAnimationFrame', {
            value: undefined,
            configurable: true,
            writable: true,
        })

        Object.defineProperty(window, 'cancelAnimationFrame', {
            value: undefined,
            configurable: true,
            writable: true,
        })

        const callback = jest.fn()
        const { result } = renderHook(() =>
            useAnimationFrame(callback, { autoStart: false })
        )

        act(() => {
            result.current.start()
        })

        expect(result.current.isSupported).toBe(false)
        expect(result.current.isRunning).toBe(false)
    })

    it('cancels the pending frame on unmount', () => {
        const callback = jest.fn()
        const { unmount } = renderHook(() =>
            useAnimationFrame(callback, { autoStart: false })
        )

        act(() => {
            runFrame(100)
        })

        unmount()

        expect(window.cancelAnimationFrame).not.toHaveBeenCalled()

        const { result, unmount: unmountRunning } = renderHook(() =>
            useAnimationFrame(callback, { autoStart: false })
        )

        act(() => {
            result.current.start()
        })

        unmountRunning()

        expect(window.cancelAnimationFrame).toHaveBeenCalledTimes(1)
    })
})
