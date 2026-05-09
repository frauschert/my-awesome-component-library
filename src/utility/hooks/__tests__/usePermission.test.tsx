import { renderHook, act, waitFor } from '@testing-library/react'
import usePermission from '../usePermission'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

class MockPermissionStatus extends EventTarget {
    state: PermissionState
    private _listeners: Record<string, Array<EventListener>> = {}

    constructor(state: PermissionState) {
        super()
        this.state = state
    }

    addEventListener(type: string, listener: EventListener) {
        if (!this._listeners[type]) this._listeners[type] = []
        this._listeners[type].push(listener)
        super.addEventListener(type, listener)
    }

    removeEventListener(type: string, listener: EventListener) {
        if (this._listeners[type]) {
            this._listeners[type] = this._listeners[type].filter(
                (l) => l !== listener
            )
        }
        super.removeEventListener(type, listener)
    }

    simulateChange(newState: PermissionState) {
        this.state = newState
        this.dispatchEvent(new Event('change'))
    }
}

const makeNavigatorWithPermissions = (defaultState: PermissionState = 'prompt') => {
    const statusMap = new Map<string, MockPermissionStatus>()

    return {
        permissions: {
            query: jest.fn(async ({ name }: { name: string }) => {
                if (!statusMap.has(name)) {
                    statusMap.set(name, new MockPermissionStatus(defaultState))
                }
                return statusMap.get(name)!
            }),
        },
        _statusMap: statusMap,
    }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('usePermission', () => {
    let originalNavigator: typeof navigator
    let mockNav: ReturnType<typeof makeNavigatorWithPermissions>

    beforeEach(() => {
        originalNavigator = global.navigator
        mockNav = makeNavigatorWithPermissions('prompt')

        Object.defineProperty(global, 'navigator', {
            value: { ...originalNavigator, ...mockNav },
            writable: true,
            configurable: true,
        })
    })

    afterEach(() => {
        Object.defineProperty(global, 'navigator', {
            value: originalNavigator,
            writable: true,
            configurable: true,
        })
        jest.clearAllMocks()
    })

    // -----------------------------------------------------------------------

    test('initial state before query resolves', () => {
        const { result } = renderHook(() => usePermission('camera'))

        // Before async query resolves: state is null, loading is true
        expect(result.current.state).toBeNull()
        expect(result.current.loading).toBe(true)
        expect(result.current.isGranted).toBe(false)
        expect(result.current.isDenied).toBe(false)
        expect(result.current.isPrompt).toBe(false)
        expect(result.current.error).toBeNull()
        expect(result.current.isSupported).toBe(true)
    })

    test('resolves to prompt state on mount', async () => {
        const { result } = renderHook(() => usePermission('camera'))

        await waitFor(() => expect(result.current.loading).toBe(false))

        expect(result.current.state).toBe('prompt')
        expect(result.current.isPrompt).toBe(true)
        expect(result.current.isGranted).toBe(false)
        expect(result.current.isDenied).toBe(false)
    })

    test('resolves to granted state', async () => {
        mockNav = makeNavigatorWithPermissions('granted')
        Object.defineProperty(global, 'navigator', {
            value: { ...originalNavigator, ...mockNav },
            writable: true,
            configurable: true,
        })

        const { result } = renderHook(() => usePermission('camera'))

        await waitFor(() => expect(result.current.loading).toBe(false))

        expect(result.current.state).toBe('granted')
        expect(result.current.isGranted).toBe(true)
        expect(result.current.isDenied).toBe(false)
        expect(result.current.isPrompt).toBe(false)
    })

    test('resolves to denied state', async () => {
        mockNav = makeNavigatorWithPermissions('denied')
        Object.defineProperty(global, 'navigator', {
            value: { ...originalNavigator, ...mockNav },
            writable: true,
            configurable: true,
        })

        const { result } = renderHook(() => usePermission('microphone'))

        await waitFor(() => expect(result.current.loading).toBe(false))

        expect(result.current.state).toBe('denied')
        expect(result.current.isDenied).toBe(true)
        expect(result.current.isGranted).toBe(false)
        expect(result.current.isPrompt).toBe(false)
    })

    test('detects unsupported browser', () => {
        Object.defineProperty(global, 'navigator', {
            value: {},
            writable: true,
            configurable: true,
        })

        const { result } = renderHook(() => usePermission('camera'))

        expect(result.current.isSupported).toBe(false)
        expect(result.current.loading).toBe(false)
        expect(result.current.state).toBeNull()
    })

    test('calls onGranted callback', async () => {
        mockNav = makeNavigatorWithPermissions('granted')
        Object.defineProperty(global, 'navigator', {
            value: { ...originalNavigator, ...mockNav },
            writable: true,
            configurable: true,
        })

        const onGranted = jest.fn()
        renderHook(() => usePermission('camera', { onGranted }))

        await waitFor(() => expect(onGranted).toHaveBeenCalledTimes(1))
    })

    test('calls onDenied callback', async () => {
        mockNav = makeNavigatorWithPermissions('denied')
        Object.defineProperty(global, 'navigator', {
            value: { ...originalNavigator, ...mockNav },
            writable: true,
            configurable: true,
        })

        const onDenied = jest.fn()
        renderHook(() => usePermission('camera', { onDenied }))

        await waitFor(() => expect(onDenied).toHaveBeenCalledTimes(1))
    })

    test('calls onPrompt callback', async () => {
        const onPrompt = jest.fn()
        renderHook(() => usePermission('camera', { onPrompt }))

        await waitFor(() => expect(onPrompt).toHaveBeenCalledTimes(1))
    })

    test('calls onChange callback with state value', async () => {
        const onChange = jest.fn()
        renderHook(() => usePermission('camera', { onChange }))

        await waitFor(() =>
            expect(onChange).toHaveBeenCalledWith('prompt')
        )
    })

    test('updates state when permission changes', async () => {
        const { result } = renderHook(() => usePermission('notifications'))

        await waitFor(() => expect(result.current.loading).toBe(false))
        expect(result.current.state).toBe('prompt')

        const status = mockNav._statusMap.get('notifications')!

        act(() => {
            status.simulateChange('granted')
        })

        await waitFor(() => expect(result.current.state).toBe('granted'))
        expect(result.current.isGranted).toBe(true)
    })

    test('calls onChange when permission changes', async () => {
        const onChange = jest.fn()
        renderHook(() => usePermission('notifications', { onChange }))

        await waitFor(() => expect(onChange).toHaveBeenCalledWith('prompt'))

        const status = mockNav._statusMap.get('notifications')!

        act(() => {
            status.simulateChange('granted')
        })

        await waitFor(() =>
            expect(onChange).toHaveBeenCalledWith('granted')
        )
    })

    test('cleans up event listener on unmount', async () => {
        const { unmount } = renderHook(() => usePermission('camera'))

        await waitFor(() =>
            expect(mockNav._statusMap.has('camera')).toBe(true)
        )

        const status = mockNav._statusMap.get('camera')!
        const removeEventListenerSpy = jest.spyOn(status, 'removeEventListener')

        unmount()

        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            'change',
            expect.any(Function)
        )
    })

    test('sets error when query throws', async () => {
        Object.defineProperty(global, 'navigator', {
            value: {
                ...originalNavigator,
                permissions: {
                    query: jest.fn().mockRejectedValue(new Error('Not allowed')),
                },
            },
            writable: true,
            configurable: true,
        })

        const { result } = renderHook(() => usePermission('camera'))

        await waitFor(() => expect(result.current.loading).toBe(false))

        expect(result.current.error).toBeInstanceOf(Error)
        expect(result.current.error?.message).toBe('Not allowed')
        expect(result.current.state).toBeNull()
    })

    test('loading is false after query resolves', async () => {
        const { result } = renderHook(() => usePermission('geolocation'))

        expect(result.current.loading).toBe(true)
        await waitFor(() => expect(result.current.loading).toBe(false))
    })

    test('manual query() re-queries permission', async () => {
        const { result } = renderHook(() => usePermission('camera'))

        await waitFor(() => expect(result.current.loading).toBe(false))
        expect(result.current.state).toBe('prompt')

        // Manually change the underlying state and re-query
        const status = mockNav._statusMap.get('camera')!
        status.state = 'granted'

        await act(async () => {
            await result.current.query()
        })

        expect(result.current.state).toBe('granted')
    })

    test('works with multiple different permission names', async () => {
        mockNav = makeNavigatorWithPermissions('granted')
        Object.defineProperty(global, 'navigator', {
            value: { ...originalNavigator, ...mockNav },
            writable: true,
            configurable: true,
        })

        const { result: cameraResult } = renderHook(() =>
            usePermission('camera')
        )
        const { result: micResult } = renderHook(() =>
            usePermission('microphone')
        )
        const { result: notifResult } = renderHook(() =>
            usePermission('notifications')
        )

        await waitFor(() => {
            expect(cameraResult.current.loading).toBe(false)
            expect(micResult.current.loading).toBe(false)
            expect(notifResult.current.loading).toBe(false)
        })

        expect(cameraResult.current.isGranted).toBe(true)
        expect(micResult.current.isGranted).toBe(true)
        expect(notifResult.current.isGranted).toBe(true)

        expect(mockNav.permissions.query).toHaveBeenCalledWith({
            name: 'camera',
        })
        expect(mockNav.permissions.query).toHaveBeenCalledWith({
            name: 'microphone',
        })
        expect(mockNav.permissions.query).toHaveBeenCalledWith({
            name: 'notifications',
        })
    })

    test('query() does nothing when unsupported', async () => {
        Object.defineProperty(global, 'navigator', {
            value: {},
            writable: true,
            configurable: true,
        })

        const { result } = renderHook(() => usePermission('camera'))

        await act(async () => {
            await result.current.query()
        })

        expect(result.current.state).toBeNull()
        expect(result.current.loading).toBe(false)
    })
})
