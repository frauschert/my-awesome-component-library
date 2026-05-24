import { useCallback, useEffect, useRef, useState } from 'react'

export type DeviceOrientationPermissionState =
    | 'granted'
    | 'denied'
    | 'prompt'
    | 'unsupported'

export interface DeviceOrientationData {
    /** Rotation around the z-axis in degrees. */
    alpha: number | null
    /** Front-to-back tilt in degrees. */
    beta: number | null
    /** Left-to-right tilt in degrees. */
    gamma: number | null
    /** Whether the orientation is provided in the earth coordinate frame. */
    absolute: boolean | null
}

export interface UseDeviceOrientationOptions {
    /**
     * Whether to start listening on mount.
     * @default false
     */
    immediate?: boolean
    /**
     * Called whenever a new orientation event is received.
     */
    onChange?: (orientation: DeviceOrientationData) => void
    /**
     * Called when permission or event subscription fails.
     */
    onError?: (error: Error) => void
}

export interface UseDeviceOrientationReturn {
    /** Latest orientation reading, or null before the first event. */
    orientation: DeviceOrientationData | null
    /** Last device-orientation-related error, if any. */
    error: Error | null
    /** Whether the Device Orientation API is available. */
    isSupported: boolean
    /** Whether the hook is actively listening for orientation events. */
    isListening: boolean
    /** Current sensor permission state. */
    permissionState: DeviceOrientationPermissionState
    /** Request permission if the browser requires it. */
    requestPermission: () => Promise<DeviceOrientationPermissionState>
    /** Start listening for orientation events. */
    start: () => Promise<void>
    /** Stop listening for orientation events. */
    stop: () => void
}

interface DeviceOrientationEventData {
    alpha: number | null
    beta: number | null
    gamma: number | null
    absolute?: boolean
}

interface DeviceOrientationEventCtor {
    requestPermission?: () => Promise<'granted' | 'denied'>
}

function getDeviceOrientationCtor(): DeviceOrientationEventCtor | null {
    if (typeof window === 'undefined') return null

    const w = window as Window & {
        DeviceOrientationEvent?: DeviceOrientationEventCtor
    }

    return w.DeviceOrientationEvent ?? null
}

function getIsSupported() {
    if (typeof window === 'undefined') return false

    const w = window as Window & {
        DeviceOrientationEvent?: DeviceOrientationEventCtor
        ondeviceorientation?: unknown
    }

    return (
        typeof w.DeviceOrientationEvent !== 'undefined' ||
        typeof w.ondeviceorientation !== 'undefined'
    )
}

function getInitialPermissionState(): DeviceOrientationPermissionState {
    if (!getIsSupported()) return 'unsupported'

    const ctor = getDeviceOrientationCtor()
    return typeof ctor?.requestPermission === 'function' ? 'prompt' : 'granted'
}

/**
 * Hook for reading device orientation from the Device Orientation API.
 *
 * @param options - Subscription and callback configuration
 * @returns Orientation state, permission state, and start/stop controls
 *
 * @example
 * ```tsx
 * function TiltPreview() {
 *   const { orientation, start, stop, isListening } = useDeviceOrientation()
 *
 *   return (
 *     <div>
 *       <button onClick={() => void start()}>
 *         {isListening ? 'Listening' : 'Start'}
 *       </button>
 *       <button onClick={stop}>Stop</button>
 *       <p>{orientation?.beta ?? 0}</p>
 *     </div>
 *   )
 * }
 * ```
 */
export default function useDeviceOrientation(
    options: UseDeviceOrientationOptions = {}
): UseDeviceOrientationReturn {
    const { immediate = false, onChange, onError } = options

    const isSupported = getIsSupported()

    const [orientation, setOrientation] =
        useState<DeviceOrientationData | null>(null)
    const [error, setError] = useState<Error | null>(null)
    const [isListening, setIsListening] = useState(false)
    const [permissionState, setPermissionState] =
        useState<DeviceOrientationPermissionState>(getInitialPermissionState)

    const listeningRef = useRef(false)
    const permissionStateRef = useRef(permissionState)
    const onChangeRef = useRef(onChange)
    const onErrorRef = useRef(onError)

    useEffect(() => {
        permissionStateRef.current = permissionState
    }, [permissionState])

    useEffect(() => {
        onChangeRef.current = onChange
    }, [onChange])

    useEffect(() => {
        onErrorRef.current = onError
    }, [onError])

    const handleOrientation = useCallback(
        (event: DeviceOrientationEventData) => {
            const nextOrientation: DeviceOrientationData = {
                alpha: event.alpha,
                beta: event.beta,
                gamma: event.gamma,
                absolute:
                    typeof event.absolute === 'boolean' ? event.absolute : null,
            }

            setOrientation(nextOrientation)
            onChangeRef.current?.(nextOrientation)
        },
        []
    )

    const orientationListener = useCallback(
        (event: Event) => {
            handleOrientation(event as unknown as DeviceOrientationEventData)
        },
        [handleOrientation]
    )

    const stop = useCallback(() => {
        if (!listeningRef.current || typeof window === 'undefined') {
            return
        }

        window.removeEventListener('deviceorientation', orientationListener)
        listeningRef.current = false
        setIsListening(false)
    }, [orientationListener])

    const requestPermission = useCallback(async () => {
        if (!isSupported) {
            setPermissionState('unsupported')
            return 'unsupported'
        }

        const ctor = getDeviceOrientationCtor()

        if (typeof ctor?.requestPermission !== 'function') {
            setPermissionState('granted')
            return 'granted'
        }

        setError(null)

        try {
            const nextPermission = await ctor.requestPermission()
            const nextState: DeviceOrientationPermissionState =
                nextPermission === 'granted' ? 'granted' : 'denied'

            permissionStateRef.current = nextState
            setPermissionState(nextState)

            if (nextState === 'denied') {
                const permissionError = new Error(
                    'Device orientation permission denied'
                )
                setError(permissionError)
                onErrorRef.current?.(permissionError)
            }

            return nextState
        } catch (err) {
            const permissionError =
                err instanceof Error
                    ? err
                    : new Error(
                          'Failed to request device orientation permission'
                      )

            setError(permissionError)
            onErrorRef.current?.(permissionError)
            return permissionStateRef.current
        }
    }, [isSupported])

    const start = useCallback(async () => {
        if (!isSupported) {
            const unsupportedError = new Error(
                'Device orientation is not supported by this browser'
            )

            setError(unsupportedError)
            onErrorRef.current?.(unsupportedError)
            return
        }

        if (listeningRef.current || typeof window === 'undefined') {
            return
        }

        let nextPermission = permissionStateRef.current

        if (nextPermission === 'prompt') {
            nextPermission = await requestPermission()
        }

        if (nextPermission !== 'granted') {
            return
        }

        setError(null)
        window.addEventListener('deviceorientation', orientationListener)
        listeningRef.current = true
        setIsListening(true)
    }, [isSupported, orientationListener, requestPermission])

    useEffect(() => {
        const nextPermissionState = getInitialPermissionState()
        permissionStateRef.current = nextPermissionState
        setPermissionState(nextPermissionState)
    }, [isSupported])

    useEffect(() => {
        if (immediate) {
            void start()
        }

        return () => {
            stop()
        }
    }, [immediate, start, stop])

    return {
        orientation,
        error,
        isSupported,
        isListening,
        permissionState,
        requestPermission,
        start,
        stop,
    }
}
