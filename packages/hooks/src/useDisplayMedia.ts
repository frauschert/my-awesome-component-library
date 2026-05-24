import { useCallback, useEffect, useRef, useState } from 'react'

export interface DisplayMediaConstraints {
    audio?: boolean | MediaTrackConstraints
    video?: boolean | MediaTrackConstraints
}

export interface UseDisplayMediaOptions {
    /**
     * Default constraints used by `start()` when no override is provided.
     * Defaults to screen-video capture.
     */
    constraints?: DisplayMediaConstraints
    /**
     * Whether to request access immediately on mount.
     * @default false
     */
    immediate?: boolean
    /**
     * Called when a display stream is acquired successfully.
     */
    onSuccess?: (stream: MediaStream) => void
    /**
     * Called when display-media access fails.
     */
    onError?: (error: Error) => void
}

export interface UseDisplayMediaReturn {
    /** Active display stream, or null when idle / unavailable. */
    stream: MediaStream | null
    /** Error produced by the most recent request, if any. */
    error: Error | null
    /** Whether a display-media request is currently in flight. */
    loading: boolean
    /** Whether `navigator.mediaDevices.getDisplayMedia` is available. */
    isSupported: boolean
    /** Whether the hook currently holds an active display stream. */
    isActive: boolean
    /** Request a display-media stream using the default or provided constraints. */
    start: (
        constraints?: DisplayMediaConstraints
    ) => Promise<MediaStream | null>
    /** Stop all active display tracks and clear the current stream. */
    stop: () => void
}

type MediaDevicesWithDisplayCapture = {
    getDisplayMedia?: (
        constraints?: DisplayMediaConstraints
    ) => Promise<MediaStream>
}

const DEFAULT_CONSTRAINTS: DisplayMediaConstraints = {
    video: true,
}

function hasUsableConstraints(
    constraints: DisplayMediaConstraints | undefined
): constraints is DisplayMediaConstraints {
    if (!constraints) return false

    const hasAudio =
        constraints.audio !== undefined && constraints.audio !== false
    const hasVideo =
        constraints.video !== undefined && constraints.video !== false

    return hasAudio || hasVideo
}

function stopTracks(stream: MediaStream | null) {
    stream?.getTracks().forEach((track) => track.stop())
}

/**
 * Hook for requesting and managing screen / window / tab capture streams via
 * `navigator.mediaDevices.getDisplayMedia`.
 *
 * @param options - Default constraints and lifecycle callbacks
 * @returns Current display stream state and imperative controls
 *
 * @example
 * ```tsx
 * function ScreenShareButton() {
 *   const { stream, start, stop, loading } = useDisplayMedia()
 *
 *   return (
 *     <div>
 *       <button onClick={() => void start()}>Share screen</button>
 *       <button onClick={stop}>Stop sharing</button>
 *       <p>{loading ? 'Requesting…' : stream ? 'Sharing' : 'Idle'}</p>
 *     </div>
 *   )
 * }
 * ```
 */
export default function useDisplayMedia(
    options: UseDisplayMediaOptions = {}
): UseDisplayMediaReturn {
    const { constraints, immediate = false, onSuccess, onError } = options

    const isSupported =
        typeof navigator !== 'undefined' &&
        typeof navigator.mediaDevices !== 'undefined' &&
        typeof (navigator.mediaDevices as MediaDevicesWithDisplayCapture)
            .getDisplayMedia === 'function'

    const [stream, setStream] = useState<MediaStream | null>(null)
    const [error, setError] = useState<Error | null>(null)
    const [loading, setLoading] = useState(false)

    const streamRef = useRef<MediaStream | null>(null)
    const requestIdRef = useRef(0)
    const mountedRef = useRef(true)
    const constraintsRef = useRef(constraints)
    const onSuccessRef = useRef(onSuccess)
    const onErrorRef = useRef(onError)

    useEffect(() => {
        constraintsRef.current = constraints
    }, [constraints])

    useEffect(() => {
        onSuccessRef.current = onSuccess
    }, [onSuccess])

    useEffect(() => {
        onErrorRef.current = onError
    }, [onError])

    const stop = useCallback(() => {
        requestIdRef.current += 1
        stopTracks(streamRef.current)
        streamRef.current = null
        setStream(null)
        setLoading(false)
    }, [])

    const start = useCallback(
        async (overrideConstraints?: DisplayMediaConstraints) => {
            const getDisplayMedia = (
                navigator.mediaDevices as
                    | MediaDevicesWithDisplayCapture
                    | undefined
            )?.getDisplayMedia

            if (!isSupported || typeof getDisplayMedia !== 'function') {
                const unsupportedError = new Error(
                    'MediaDevices.getDisplayMedia is not supported by this browser'
                )

                setError(unsupportedError)
                setLoading(false)
                onErrorRef.current?.(unsupportedError)
                return null
            }

            const nextConstraints =
                overrideConstraints ??
                constraintsRef.current ??
                DEFAULT_CONSTRAINTS

            if (!hasUsableConstraints(nextConstraints)) {
                const constraintsError = new Error(
                    'useDisplayMedia requires audio and/or video constraints'
                )

                setError(constraintsError)
                setLoading(false)
                onErrorRef.current?.(constraintsError)
                return null
            }

            const requestId = requestIdRef.current + 1
            requestIdRef.current = requestId

            stopTracks(streamRef.current)
            streamRef.current = null

            setStream(null)
            setError(null)
            setLoading(true)

            try {
                const nextStream = await getDisplayMedia(nextConstraints)

                if (!mountedRef.current || requestIdRef.current !== requestId) {
                    stopTracks(nextStream)
                    return null
                }

                streamRef.current = nextStream
                setStream(nextStream)
                setLoading(false)
                onSuccessRef.current?.(nextStream)
                return nextStream
            } catch (err) {
                const resolvedError =
                    err instanceof Error
                        ? err
                        : new Error('Failed to acquire display media')

                if (!mountedRef.current || requestIdRef.current !== requestId) {
                    return null
                }

                setStream(null)
                setError(resolvedError)
                setLoading(false)
                onErrorRef.current?.(resolvedError)
                return null
            }
        },
        [isSupported]
    )

    useEffect(() => {
        if (immediate) {
            void start()
        }
    }, [immediate, start])

    useEffect(() => {
        return () => {
            mountedRef.current = false
            requestIdRef.current += 1
            stopTracks(streamRef.current)
            streamRef.current = null
        }
    }, [])

    return {
        stream,
        error,
        loading,
        isSupported,
        isActive: stream !== null,
        start,
        stop,
    }
}
