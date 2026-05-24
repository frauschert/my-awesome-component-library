import { act, renderHook } from '@testing-library/react'
import useIdleDetector from '../useIdleDetector'

type TestIdleDetectorPermissionState = 'granted' | 'denied' | 'prompt'

class MockIdleDetector {
    userState: 'active' | 'idle' = 'active'
    screenState: 'locked' | 'unlocked' = 'unlocked'
    start = jest.fn(async () => {})

    private listeners = new Set<() => void>()

    constructor() {
        mockDetectors.push(this)
    }

    static requestPermission() {
        return requestPermissionMock()
    }

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

const originalIdleDetector = Object.getOwnPropertyDescriptor(
    window,
    'IdleDetector'
)

let requestPermissionMock: jest.Mock<
    Promise<TestIdleDetectorPermissionState>,
    []
>
let mockDetectors: MockIdleDetector[]

beforeEach(() => {
    requestPermissionMock = jest.fn(async () => 'granted')
    mockDetectors = []

    Object.defineProperty(window, 'IdleDetector', {
        value: MockIdleDetector,
        configurable: true,
        writable: true,
    })
})

afterEach(() => {
    if (originalIdleDetector) {
        Object.defineProperty(window, 'IdleDetector', originalIdleDetector)
    } else {
        delete (window as Window & { IdleDetector?: unknown }).IdleDetector
    }

    jest.clearAllMocks()
})

describe('useIdleDetector', () => {
    it('initialises with supported prompt state', () => {
        const { result } = renderHook(() => useIdleDetector())

        expect(result.current.isSupported).toBe(true)
        expect(result.current.permissionState).toBe('prompt')
        expect(result.current.isRunning).toBe(false)
        expect(result.current.idleState).toBe(null)
        expect(result.current.userState).toBe(null)
        expect(result.current.screenState).toBe(null)
        expect(result.current.isIdle).toBe(false)
        expect(result.current.isScreenLocked).toBe(false)
        expect(result.current.error).toBe(null)
    })

    it('requests permission and starts the detector', async () => {
        const { result } = renderHook(() =>
            useIdleDetector({ threshold: 5000 })
        )

        await act(async () => {
            await result.current.start()
        })

        expect(requestPermissionMock).toHaveBeenCalledTimes(1)
        expect(mockDetectors).toHaveLength(1)
        expect(mockDetectors[0].start).toHaveBeenCalledWith(
            expect.objectContaining({ threshold: 5000 })
        )
        expect(result.current.permissionState).toBe('granted')
        expect(result.current.isRunning).toBe(true)
        expect(result.current.idleState).toEqual({
            userState: 'active',
            screenState: 'unlocked',
            isIdle: false,
            isScreenLocked: false,
        })
    })

    it('updates state and calls onChange when the detector changes', async () => {
        const onChange = jest.fn()
        const { result } = renderHook(() => useIdleDetector({ onChange }))

        await act(async () => {
            await result.current.start()
        })

        act(() => {
            mockDetectors[0].userState = 'idle'
            mockDetectors[0].screenState = 'locked'
            mockDetectors[0].emitChange()
        })

        expect(result.current.idleState).toEqual({
            userState: 'idle',
            screenState: 'locked',
            isIdle: true,
            isScreenLocked: true,
        })
        expect(result.current.userState).toBe('idle')
        expect(result.current.screenState).toBe('locked')
        expect(result.current.isIdle).toBe(true)
        expect(result.current.isScreenLocked).toBe(true)
        expect(onChange).toHaveBeenCalledWith({
            userState: 'idle',
            screenState: 'locked',
            isIdle: true,
            isScreenLocked: true,
        })
    })

    it('stops the detector and ignores later change events', async () => {
        const { result } = renderHook(() => useIdleDetector())

        await act(async () => {
            await result.current.start()
        })

        act(() => {
            mockDetectors[0].userState = 'idle'
            mockDetectors[0].screenState = 'locked'
            mockDetectors[0].emitChange()
        })

        expect(result.current.idleState?.userState).toBe('idle')

        act(() => {
            result.current.stop()
        })

        act(() => {
            mockDetectors[0].userState = 'active'
            mockDetectors[0].screenState = 'unlocked'
            mockDetectors[0].emitChange()
        })

        expect(result.current.isRunning).toBe(false)
        expect(mockDetectors[0].removeEventListener).toHaveBeenCalledWith(
            'change',
            expect.any(Function)
        )
        expect(result.current.idleState).toEqual({
            userState: 'idle',
            screenState: 'locked',
            isIdle: true,
            isScreenLocked: true,
        })
    })

    it('surfaces denied permission', async () => {
        requestPermissionMock.mockResolvedValue('denied')
        const onError = jest.fn()

        const { result } = renderHook(() => useIdleDetector({ onError }))

        await act(async () => {
            await result.current.start()
        })

        expect(result.current.permissionState).toBe('denied')
        expect(result.current.isRunning).toBe(false)
        expect(result.current.error?.message).toBe(
            'IdleDetector permission denied'
        )
        expect(onError).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'IdleDetector permission denied',
            })
        )
    })

    it('reports unsupported browsers', async () => {
        Object.defineProperty(window, 'IdleDetector', {
            value: undefined,
            configurable: true,
            writable: true,
        })

        const onError = jest.fn()
        const { result } = renderHook(() => useIdleDetector({ onError }))

        await act(async () => {
            await result.current.start()
        })

        expect(result.current.isSupported).toBe(false)
        expect(result.current.permissionState).toBe('unsupported')
        expect(result.current.idleState).toBe(null)
        expect(result.current.error?.message).toBe(
            'IdleDetector is not supported by this browser'
        )
        expect(onError).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'IdleDetector is not supported by this browser',
            })
        )
    })

    it('starts immediately when immediate is true and cleans up on unmount', async () => {
        const { result, unmount } = renderHook(() =>
            useIdleDetector({ immediate: true })
        )

        await act(async () => {
            await Promise.resolve()
        })

        expect(requestPermissionMock).toHaveBeenCalledTimes(1)
        expect(result.current.isRunning).toBe(true)

        const detector = mockDetectors[0]

        unmount()

        expect(detector.removeEventListener).toHaveBeenCalledWith(
            'change',
            expect.any(Function)
        )
    })
})
