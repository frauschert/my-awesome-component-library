import { act, renderHook } from '@testing-library/react'
import useNotification from '../useNotification'

type NotificationPermissionState = 'default' | 'denied' | 'granted'

class MockNotification {
    static permission: NotificationPermissionState = 'default'
    static requestPermission = jest.fn(async () => MockNotification.permission)

    title: string
    options?: NotificationOptions
    onshow: ((event: Event) => void) | null = null
    onclick: ((event: Event) => void) | null = null
    onclose: ((event: Event) => void) | null = null
    onerror: ((event: Event) => void) | null = null
    close = jest.fn(() => {
        this.onclose?.(new Event('close'))
    })

    constructor(title: string, options?: NotificationOptions) {
        this.title = title
        this.options = options
        mockNotificationInstance = this
    }

    emitShow() {
        this.onshow?.(new Event('show'))
    }

    emitClick() {
        this.onclick?.(new Event('click'))
    }

    emitError() {
        this.onerror?.(new Event('error'))
    }
}

const originalNotification = (window as Window & { Notification?: unknown })
    .Notification

let mockNotificationInstance: MockNotification | null

beforeEach(() => {
    mockNotificationInstance = null
    MockNotification.permission = 'default'
    MockNotification.requestPermission.mockImplementation(
        async () => MockNotification.permission
    )

    Object.defineProperty(window, 'Notification', {
        value: MockNotification,
        configurable: true,
        writable: true,
    })
})

afterEach(() => {
    Object.defineProperty(window, 'Notification', {
        value: originalNotification,
        configurable: true,
        writable: true,
    })

    jest.useRealTimers()
    jest.clearAllMocks()
})

describe('useNotification', () => {
    it('initialises with current permission and support state', () => {
        MockNotification.permission = 'granted'

        const { result } = renderHook(() => useNotification())

        expect(result.current.isSupported).toBe(true)
        expect(result.current.permission).toBe('granted')
        expect(result.current.isGranted).toBe(true)
        expect(result.current.notification).toBe(null)
        expect(result.current.error).toBe(null)
    })

    it('requests permission and updates permission state', async () => {
        MockNotification.requestPermission.mockImplementation(async () => {
            MockNotification.permission = 'granted'
            return 'granted'
        })

        const { result } = renderHook(() => useNotification())

        await act(async () => {
            await result.current.requestPermission()
        })

        expect(MockNotification.requestPermission).toHaveBeenCalledTimes(1)
        expect(result.current.permission).toBe('granted')
    })

    it('shows a notification with merged default and override options', async () => {
        MockNotification.permission = 'granted'

        const { result } = renderHook(() =>
            useNotification({
                defaultOptions: { body: 'Default body', tag: 'build' },
            })
        )

        let notification: MockNotification | null = null

        await act(async () => {
            notification = (await result.current.show('Build complete', {
                body: 'Override body',
                icon: '/icon.png',
            })) as MockNotification | null
        })

        expect(notification?.title).toBe('Build complete')
        expect(notification?.options).toEqual({
            body: 'Override body',
            tag: 'build',
            icon: '/icon.png',
        })
        expect(result.current.notification).toBe(notification)
    })

    it('fires lifecycle callbacks and clears state when the notification closes', async () => {
        MockNotification.permission = 'granted'
        const onShow = jest.fn()
        const onClick = jest.fn()
        const onClose = jest.fn()

        const { result } = renderHook(() =>
            useNotification({ onShow, onClick, onClose })
        )

        await act(async () => {
            await result.current.show('Hello')
        })

        act(() => {
            mockNotificationInstance?.emitShow()
            mockNotificationInstance?.emitClick()
            mockNotificationInstance?.close()
        })

        expect(onShow).toHaveBeenCalledTimes(1)
        expect(onClick).toHaveBeenCalledTimes(1)
        expect(onClose).toHaveBeenCalledTimes(1)
        expect(result.current.notification).toBe(null)
    })

    it('auto-closes notifications when configured', async () => {
        jest.useFakeTimers()
        MockNotification.permission = 'granted'

        const { result } = renderHook(() =>
            useNotification({ autoClose: 5000 })
        )

        await act(async () => {
            await result.current.show('Auto close')
        })

        act(() => {
            jest.advanceTimersByTime(5000)
        })

        expect(mockNotificationInstance?.close).toHaveBeenCalledTimes(1)
    })

    it('closes the current notification manually', async () => {
        MockNotification.permission = 'granted'

        const { result } = renderHook(() => useNotification())

        await act(async () => {
            await result.current.show('Manual close')
        })

        act(() => {
            result.current.close()
        })

        expect(mockNotificationInstance?.close).toHaveBeenCalledTimes(1)
        expect(result.current.notification).toBe(null)
    })

    it('reports unsupported browsers', async () => {
        Object.defineProperty(window, 'Notification', {
            value: undefined,
            configurable: true,
            writable: true,
        })

        const onError = jest.fn()
        const { result } = renderHook(() => useNotification({ onError }))

        await act(async () => {
            await result.current.show('Unsupported')
        })

        expect(result.current.isSupported).toBe(false)
        expect(result.current.error?.message).toBe(
            'Notification is not supported by this browser'
        )
        expect(onError).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Notification is not supported by this browser',
            })
        )
    })

    it('returns null and surfaces an error when permission remains denied', async () => {
        MockNotification.permission = 'denied'

        const onError = jest.fn()
        const { result } = renderHook(() => useNotification({ onError }))

        let notification: MockNotification | null = null

        await act(async () => {
            notification = (await result.current.show(
                'Denied'
            )) as MockNotification | null
        })

        expect(notification).toBe(null)
        expect(result.current.error?.message).toBe(
            'Notification permission has not been granted'
        )
        expect(onError).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Notification permission has not been granted',
            })
        )
    })

    it('surfaces notification runtime errors', async () => {
        MockNotification.permission = 'granted'
        const onError = jest.fn()

        const { result } = renderHook(() => useNotification({ onError }))

        await act(async () => {
            await result.current.show('Failure')
        })

        act(() => {
            mockNotificationInstance?.emitError()
        })

        expect(result.current.error?.message).toBe('Notification failed')
        expect(onError).toHaveBeenCalledWith(
            expect.objectContaining({ message: 'Notification failed' })
        )
    })
})
