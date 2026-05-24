import { useCallback, useEffect, useRef, useState } from 'react'

export type IdleDetectorPermissionState =
    | 'granted'
    | 'denied'
    | 'prompt'
    | 'unsupported'

export type IdleDetectorUserState = 'active' | 'idle'

export type IdleDetectorScreenState = 'locked' | 'unlocked'

export interface IdleDetectorState {
    /** Whether the user is currently considered active or idle. */
    userState: IdleDetectorUserState
    /** Whether the screen is currently locked or unlocked. */
    screenState: IdleDetectorScreenState
    /** Convenience boolean derived from `userState`. */
    isIdle: boolean
    /** Convenience boolean derived from `screenState`. */
    isScreenLocked: boolean
}

export interface UseIdleDetectorOptions {
    /**
     * Idle threshold passed to `IdleDetector.start()` in milliseconds.
     * @default 60000
     */
    threshold?: number
    /**
     * Whether to start detection on mount.
     * @default false
     */
    immediate?: boolean
    /**
     * Called whenever the detector reports a new idle state.
     */
    onChange?: (state: IdleDetectorState) => void
    /**
     * Called when permission, startup, or detector errors occur.
     */
    onError?: (error: Error) => void
}

export interface UseIdleDetectorReturn {
    /** Latest idle-detector state, or null before the detector starts. */
    idleState: IdleDetectorState | null
    /** Current user activity state. */
    userState: IdleDetectorUserState | null
    /** Current screen lock state. */
    screenState: IdleDetectorScreenState | null
    /** Whether the user is currently idle. */
    isIdle: boolean
    /** Whether the screen is currently locked. */
    isScreenLocked: boolean
    /** Last idle-detector-related error, if any. */
    error: Error | null
    /** Whether the Idle Detection API is available. */
    isSupported: boolean
    /** Whether a detector instance is currently running. */
    isRunning: boolean
    /** Current idle-detection permission state. */
    permissionState: IdleDetectorPermissionState
    /** Request idle-detection permission if required by the browser. */
    requestPermission: () => Promise<IdleDetectorPermissionState>
    /** Start the detector with the configured threshold. */
    start: () => Promise<void>
    /** Stop the detector and clean up subscriptions. */
    stop: () => void
}

interface IdleDetectorStartOptions {
    threshold: number
    signal?: AbortSignal
}

interface IdleDetectorInstance {
    userState?: IdleDetectorUserState
    screenState?: IdleDetectorScreenState
    start: (options: IdleDetectorStartOptions) => Promise<void>
    addEventListener?: (event: 'change', listener: () => void) => void
    removeEventListener?: (event: 'change', listener: () => void) => void
}

interface IdleDetectorCtor {
    new (): IdleDetectorInstance
    requestPermission?: () =>
        | Promise<'granted' | 'denied' | 'prompt'>
        | 'granted'
        | 'denied'
        | 'prompt'
}

const DEFAULT_THRESHOLD = 60000

function getIdleDetectorCtor(): IdleDetectorCtor | null {
    if (typeof window === 'undefined') return null

    const w = window as Window & {
        IdleDetector?: IdleDetectorCtor
    }

    return w.IdleDetector ?? null
}

function getIsSupported() {
    return getIdleDetectorCtor() !== null
}

function getInitialPermissionState(): IdleDetectorPermissionState {
    if (!getIsSupported()) return 'unsupported'
    return 'prompt'
}

function isKnownUserState(
    userState: IdleDetectorUserState | undefined
): userState is IdleDetectorUserState {
    return userState === 'active' || userState === 'idle'
}

function isKnownScreenState(
    screenState: IdleDetectorScreenState | undefined
): screenState is IdleDetectorScreenState {
    return screenState === 'locked' || screenState === 'unlocked'
}

function toIdleDetectorState(
    detector: IdleDetectorInstance | null
): IdleDetectorState | null {
    if (
        !detector ||
        !isKnownUserState(detector.userState) ||
        !isKnownScreenState(detector.screenState)
    ) {
        return null
    }

    return {
        userState: detector.userState,
        screenState: detector.screenState,
        isIdle: detector.userState === 'idle',
        isScreenLocked: detector.screenState === 'locked',
    }
}

/**
 * Hook for the Idle Detection API.
 *
 * Exposes permission state, the current user/screen idle status, and explicit
 * controls for starting and stopping an `IdleDetector` instance.
 *
 * @param options - Detector configuration and lifecycle callbacks
 * @returns Idle state, permission state, and imperative detector controls
 *
 * @example
 * ```tsx
 * function PresenceIndicator() {
 *   const { idleState, start, stop, permissionState } = useIdleDetector({
 *     threshold: 30000,
 *   })
 *
 *   return (
 *     <div>
 *       <button onClick={() => void start()}>Start</button>
 *       <button onClick={stop}>Stop</button>
 *       <p>{permissionState}</p>
 *       <p>{idleState?.userState ?? 'unknown'}</p>
 *     </div>
 *   )
 * }
 * ```
 */
export default function useIdleDetector(
    options: UseIdleDetectorOptions = {}
): UseIdleDetectorReturn {
    const {
        threshold = DEFAULT_THRESHOLD,
        immediate = false,
        onChange,
        onError,
    } = options

    const isSupported = getIsSupported()

    const [idleState, setIdleState] = useState<IdleDetectorState | null>(null)
    const [error, setError] = useState<Error | null>(null)
    const [isRunning, setIsRunning] = useState(false)
    const [permissionState, setPermissionState] =
        useState<IdleDetectorPermissionState>(getInitialPermissionState)

    const detectorRef = useRef<IdleDetectorInstance | null>(null)
    const abortControllerRef = useRef<AbortController | null>(null)
    const runningRef = useRef(false)
    const startingRef = useRef(false)
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

    const syncIdleState = useCallback((shouldNotify: boolean) => {
        const nextIdleState = toIdleDetectorState(detectorRef.current)
        setIdleState(nextIdleState)

        if (shouldNotify && nextIdleState) {
            onChangeRef.current?.(nextIdleState)
        }
    }, [])

    const detectorChangeListener = useCallback(() => {
        syncIdleState(true)
    }, [syncIdleState])

    const stop = useCallback(() => {
        const currentDetector = detectorRef.current

        currentDetector?.removeEventListener?.('change', detectorChangeListener)

        abortControllerRef.current?.abort()
        abortControllerRef.current = null
        detectorRef.current = null
        runningRef.current = false
        startingRef.current = false
        setIsRunning(false)
    }, [detectorChangeListener])

    const requestPermission = useCallback(async () => {
        if (!isSupported) {
            permissionStateRef.current = 'unsupported'
            setPermissionState('unsupported')
            return 'unsupported'
        }

        const IdleDetectorCtor = getIdleDetectorCtor()

        if (typeof IdleDetectorCtor?.requestPermission !== 'function') {
            permissionStateRef.current = 'granted'
            setPermissionState('granted')
            return 'granted'
        }

        setError(null)

        try {
            const nextPermission = await Promise.resolve(
                IdleDetectorCtor.requestPermission()
            )

            const nextState: IdleDetectorPermissionState =
                nextPermission === 'granted'
                    ? 'granted'
                    : nextPermission === 'denied'
                    ? 'denied'
                    : 'prompt'

            permissionStateRef.current = nextState
            setPermissionState(nextState)

            if (nextState === 'denied') {
                const permissionError = new Error(
                    'IdleDetector permission denied'
                )
                setError(permissionError)
                onErrorRef.current?.(permissionError)
            }

            return nextState
        } catch (err) {
            const permissionError =
                err instanceof Error
                    ? err
                    : new Error('Failed to request idle-detection permission')

            setError(permissionError)
            onErrorRef.current?.(permissionError)
            return permissionStateRef.current
        }
    }, [isSupported])

    const start = useCallback(async () => {
        if (!isSupported) {
            const unsupportedError = new Error(
                'IdleDetector is not supported by this browser'
            )

            setError(unsupportedError)
            onErrorRef.current?.(unsupportedError)
            return
        }

        if (!Number.isFinite(threshold) || threshold < 0) {
            const thresholdError = new Error(
                'IdleDetector threshold must be a non-negative finite number'
            )

            setError(thresholdError)
            onErrorRef.current?.(thresholdError)
            return
        }

        if (runningRef.current || startingRef.current) {
            return
        }

        let nextPermission = permissionStateRef.current

        if (nextPermission === 'prompt') {
            nextPermission = await requestPermission()
        }

        if (nextPermission !== 'granted') {
            return
        }

        const IdleDetectorCtor = getIdleDetectorCtor()

        if (!IdleDetectorCtor) {
            const unsupportedError = new Error(
                'IdleDetector is not supported by this browser'
            )

            setError(unsupportedError)
            onErrorRef.current?.(unsupportedError)
            return
        }

        const nextDetector = new IdleDetectorCtor()
        const nextAbortController =
            typeof AbortController !== 'undefined'
                ? new AbortController()
                : null

        startingRef.current = true
        setError(null)
        detectorRef.current = nextDetector
        abortControllerRef.current = nextAbortController
        nextDetector.addEventListener?.('change', detectorChangeListener)

        try {
            await nextDetector.start({
                threshold,
                signal: nextAbortController?.signal,
            })

            if (nextAbortController?.signal.aborted) {
                return
            }

            runningRef.current = true
            setIsRunning(true)
            syncIdleState(false)
        } catch (err) {
            if (nextAbortController?.signal.aborted) {
                return
            }

            nextDetector.removeEventListener?.('change', detectorChangeListener)
            detectorRef.current = null
            abortControllerRef.current = null

            const startError =
                err instanceof Error
                    ? err
                    : new Error('Failed to start idle detector')

            setError(startError)
            onErrorRef.current?.(startError)
        } finally {
            startingRef.current = false
        }
    }, [
        detectorChangeListener,
        isSupported,
        requestPermission,
        syncIdleState,
        threshold,
    ])

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
        idleState,
        userState: idleState?.userState ?? null,
        screenState: idleState?.screenState ?? null,
        isIdle: idleState?.isIdle ?? false,
        isScreenLocked: idleState?.isScreenLocked ?? false,
        error,
        isSupported,
        isRunning,
        permissionState,
        requestPermission,
        start,
        stop,
    }
}
