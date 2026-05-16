import { useCallback, useEffect, useRef, useState } from 'react'

export interface UseUserMediaOptions {
    /**
     * Default media constraints used by `start()` when no override is provided.
     */
    constraints?: MediaStreamConstraints
    /**
     * Whether to request access immediately on mount.
     * @default false
     */
    immediate?: boolean
    /**
     * Called when a stream is acquired successfully.
     */
    onSuccess?: (stream: MediaStream) => void
    /**
     * Called when media access fails.
     */
    onError?: (error: Error) => void
}

export interface UseUserMediaReturn {
    /** Active media stream, or null when idle / unavailable. */
    stream: MediaStream | null
    /** Error produced by the most recent request, if any. */
    error: Error | null
    /** Whether a media request is currently in flight. */
    loading: boolean
    /** Whether `navigator.mediaDevices.getUserMedia` is available. */
    isSupported: boolean
    /** Whether the hook currently holds an active stream. */
    isActive: boolean
    /** Request a media stream using the default or provided constraints. */
    start: (constraints?: MediaStreamConstraints) => Promise<MediaStream | null>
    /** Stop all active media tracks and clear the current stream. */
    stop: () => void
}

function hasUsableConstraints(
    constraints: MediaStreamConstraints | undefined
): constraints is MediaStreamConstraints {
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
 * Hook for requesting and managing camera / microphone streams via
 * `navigator.mediaDevices.getUserMedia`.
 *
 * @param options - Default constraints and lifecycle callbacks
 * @returns Current stream state and imperative controls
 *
 * @example
 * ```tsx
 * function CameraPreview() {
 *   const { stream, start, stop, loading, error } = useUserMedia({
 *     constraints: { video: true },
 *   })
 *
 *   return (
 *     <div>
 *       <button onClick={() => void start()}>Start camera</button>
 *       <button onClick={stop}>Stop camera</button>
 *       {loading && <p>Requesting camera…</p>}
 *       {error && <p>{error.message}</p>}
 *       <p>{stream ? 'Camera active' : 'Camera inactive'}</p>
 *     </div>
 *   )
 * }
 * ```
 */
export default function useUserMedia(
    options: UseUserMediaOptions = {}
): UseUserMediaReturn {
    const { constraints, immediate = false, onSuccess, onError } = options

    const isSupported =
        typeof navigator !== 'undefined' &&
        typeof navigator.mediaDevices !== 'undefined' &&
        typeof navigator.mediaDevices.getUserMedia === 'function'

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
        async (overrideConstraints?: MediaStreamConstraints) => {
            if (!isSupported) {
                const unsupportedError = new Error(
                    'MediaDevices.getUserMedia is not supported by this browser'
                )

                setError(unsupportedError)
                setLoading(false)
                onErrorRef.current?.(unsupportedError)
                return null
            }

            const nextConstraints =
                overrideConstraints ?? constraintsRef.current

            if (!hasUsableConstraints(nextConstraints)) {
                const constraintsError = new Error(
                    'useUserMedia requires audio and/or video constraints'
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
                const nextStream = await navigator.mediaDevices.getUserMedia(
                    nextConstraints
                )

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
                        : new Error('Failed to acquire user media')

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
