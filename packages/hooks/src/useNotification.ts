import { useCallback, useEffect, useRef, useState } from 'react'

export type NotificationPermissionState = 'default' | 'denied' | 'granted'

interface NotificationInstance {
    close(): void
    onshow: ((event: Event) => void) | null
    onclick: ((event: Event) => void) | null
    onclose: ((event: Event) => void) | null
    onerror: ((event: Event) => void) | null
}

interface NotificationCtor {
    new (title: string, options?: NotificationOptions): NotificationInstance
    permission: NotificationPermissionState
    requestPermission: () =>
        | NotificationPermissionState
        | Promise<NotificationPermissionState>
}

export interface UseNotificationOptions {
    /**
     * Default options merged into every notification shown by the hook.
     */
    defaultOptions?: NotificationOptions
    /**
     * Automatically close each notification after the given number of milliseconds.
     * `null` disables auto-close.
     * @default null
     */
    autoClose?: number | null
    /**
     * Called when a notification is shown.
     */
    onShow?: () => void
    /**
     * Called when the active notification is clicked.
     */
    onClick?: () => void
    /**
     * Called when the active notification is closed.
     */
    onClose?: () => void
    /**
     * Called when permission or notification creation fails.
     */
    onError?: (error: Error) => void
}

export interface UseNotificationReturn {
    /** Current Notification permission state. */
    permission: NotificationPermissionState
    /** Whether the Notification API is available. */
    isSupported: boolean
    /** Whether permission is granted. */
    isGranted: boolean
    /** Whether permission is denied. */
    isDenied: boolean
    /** Whether permission is still at the browser default prompt state. */
    isDefault: boolean
    /** The currently active notification instance, if any. */
    notification: NotificationInstance | null
    /** The last notification-related error, if any. */
    error: Error | null
    /** Request notification permission from the browser. */
    requestPermission: () => Promise<NotificationPermissionState>
    /** Show a notification, requesting permission first if needed. */
    show: (
        title: string,
        options?: NotificationOptions
    ) => Promise<NotificationInstance | null>
    /** Close the current active notification. */
    close: () => void
}

function getNotificationCtor(): NotificationCtor | null {
    if (typeof window === 'undefined') return null

    const w = window as Window & {
        Notification?: NotificationCtor
    }

    return w.Notification ?? null
}

function resolvePermission(): NotificationPermissionState {
    return getNotificationCtor()?.permission ?? 'default'
}

/**
 * Hook for working with the browser Notification API.
 *
 * @param options - Default notification settings and lifecycle callbacks
 * @returns Permission state, active notification state, and imperative controls
 *
 * @example
 * ```tsx
 * function NotifyButton() {
 *   const { show, permission } = useNotification({
 *     defaultOptions: { body: 'Build finished successfully.' },
 *   })
 *
 *   return (
 *     <button onClick={() => void show('Deployment complete')}>
 *       Notify ({permission})
 *     </button>
 *   )
 * }
 * ```
 */
export default function useNotification(
    options: UseNotificationOptions = {}
): UseNotificationReturn {
    const {
        defaultOptions,
        autoClose = null,
        onShow,
        onClick,
        onClose,
        onError,
    } = options

    const isSupported = getNotificationCtor() !== null

    const [permission, setPermission] =
        useState<NotificationPermissionState>(resolvePermission)
    const [notification, setNotification] =
        useState<NotificationInstance | null>(null)
    const [error, setError] = useState<Error | null>(null)

    const notificationRef = useRef<NotificationInstance | null>(null)
    const autoCloseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
        null
    )
    const defaultOptionsRef = useRef(defaultOptions)
    const autoCloseRef = useRef(autoClose)
    const onShowRef = useRef(onShow)
    const onClickRef = useRef(onClick)
    const onCloseRef = useRef(onClose)
    const onErrorRef = useRef(onError)

    useEffect(() => {
        defaultOptionsRef.current = defaultOptions
    }, [defaultOptions])

    useEffect(() => {
        autoCloseRef.current = autoClose
    }, [autoClose])

    useEffect(() => {
        onShowRef.current = onShow
    }, [onShow])

    useEffect(() => {
        onClickRef.current = onClick
    }, [onClick])

    useEffect(() => {
        onCloseRef.current = onClose
    }, [onClose])

    useEffect(() => {
        onErrorRef.current = onError
    }, [onError])

    const clearAutoCloseTimeout = useCallback(() => {
        if (autoCloseTimeoutRef.current) {
            clearTimeout(autoCloseTimeoutRef.current)
            autoCloseTimeoutRef.current = null
        }
    }, [])

    const close = useCallback(() => {
        clearAutoCloseTimeout()

        const currentNotification = notificationRef.current
        notificationRef.current = null
        setNotification(null)

        if (currentNotification) {
            currentNotification.close()
        }
    }, [clearAutoCloseTimeout])

    const requestPermission = useCallback(async () => {
        const NotificationCtor = getNotificationCtor()

        if (!NotificationCtor) {
            const unsupportedError = new Error(
                'Notification is not supported by this browser'
            )

            setError(unsupportedError)
            onErrorRef.current?.(unsupportedError)
            return 'default'
        }

        setError(null)

        try {
            const nextPermission = await Promise.resolve(
                NotificationCtor.requestPermission()
            )
            setPermission(nextPermission)
            return nextPermission
        } catch (err) {
            const permissionError =
                err instanceof Error
                    ? err
                    : new Error('Failed to request notification permission')

            setError(permissionError)
            onErrorRef.current?.(permissionError)
            return resolvePermission()
        }
    }, [])

    const show = useCallback(
        async (title: string, options?: NotificationOptions) => {
            const NotificationCtor = getNotificationCtor()

            if (!NotificationCtor) {
                const unsupportedError = new Error(
                    'Notification is not supported by this browser'
                )

                setError(unsupportedError)
                onErrorRef.current?.(unsupportedError)
                return null
            }

            let nextPermission = NotificationCtor.permission

            if (nextPermission !== 'granted') {
                nextPermission = await requestPermission()
            }

            setPermission(nextPermission)

            if (nextPermission !== 'granted') {
                const permissionError = new Error(
                    'Notification permission has not been granted'
                )

                setError(permissionError)
                onErrorRef.current?.(permissionError)
                return null
            }

            close()
            setError(null)

            const mergedOptions = {
                ...(defaultOptionsRef.current ?? {}),
                ...(options ?? {}),
            }

            const nextNotification = new NotificationCtor(title, mergedOptions)

            nextNotification.onshow = () => {
                onShowRef.current?.()
            }

            nextNotification.onclick = () => {
                onClickRef.current?.()
            }

            nextNotification.onclose = () => {
                if (notificationRef.current === nextNotification) {
                    notificationRef.current = null
                    setNotification(null)
                }

                clearAutoCloseTimeout()
                onCloseRef.current?.()
            }

            nextNotification.onerror = () => {
                const notificationError = new Error('Notification failed')
                setError(notificationError)
                onErrorRef.current?.(notificationError)
            }

            notificationRef.current = nextNotification
            setNotification(nextNotification)

            if (autoCloseRef.current !== null && autoCloseRef.current > 0) {
                clearAutoCloseTimeout()
                autoCloseTimeoutRef.current = setTimeout(() => {
                    nextNotification.close()
                }, autoCloseRef.current)
            }

            return nextNotification
        },
        [clearAutoCloseTimeout, close, requestPermission]
    )

    useEffect(() => {
        setPermission(resolvePermission())
    }, [isSupported])

    useEffect(() => {
        return () => {
            close()
            clearAutoCloseTimeout()
        }
    }, [clearAutoCloseTimeout, close])

    return {
        permission,
        isSupported,
        isGranted: permission === 'granted',
        isDenied: permission === 'denied',
        isDefault: permission === 'default',
        notification,
        error,
        requestPermission,
        show,
        close,
    }
}
