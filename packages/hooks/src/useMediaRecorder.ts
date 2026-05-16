import { useCallback, useEffect, useRef, useState } from 'react'

export type MediaRecorderStatus = 'inactive' | 'recording' | 'paused'

export interface UseMediaRecorderOptions {
    /**
     * MIME type for the recorded media, if supported by the browser.
     */
    mimeType?: string
    /**
     * Aggregate target bitrate for the recording.
     */
    bitsPerSecond?: number
    /**
     * Target bitrate for audio tracks.
     */
    audioBitsPerSecond?: number
    /**
     * Target bitrate for video tracks.
     */
    videoBitsPerSecond?: number
    /**
     * Called when recording starts.
     */
    onStart?: () => void
    /**
     * Called whenever a data chunk becomes available.
     */
    onDataAvailable?: (chunk: Blob) => void
    /**
     * Called when recording pauses.
     */
    onPause?: () => void
    /**
     * Called when recording resumes.
     */
    onResume?: () => void
    /**
     * Called when recording stops.
     */
    onStop?: (blob: Blob | null, chunks: Blob[]) => void
    /**
     * Called when recording fails.
     */
    onError?: (error: Error) => void
}

export interface UseMediaRecorderReturn {
    /** The current MediaRecorder state. */
    status: MediaRecorderStatus
    /** Whether the MediaRecorder API is supported. */
    isSupported: boolean
    /** Whether recording is currently active. */
    isRecording: boolean
    /** Whether recording is currently paused. */
    isPaused: boolean
    /** Collected media chunks for the current or most recent recording. */
    chunks: Blob[]
    /** A combined Blob built when recording stops. */
    blob: Blob | null
    /** The recorder MIME type selected for the current or most recent recording. */
    mimeType: string | null
    /** The last recorder error, if any. */
    error: Error | null
    /** Start recording the provided stream. */
    start: (timeslice?: number) => void
    /** Stop the current recording. */
    stop: () => void
    /** Pause the current recording. */
    pause: () => void
    /** Resume a paused recording. */
    resume: () => void
    /** Request an immediate `dataavailable` event. */
    requestData: () => void
    /** Clear chunks, blob, and error state. */
    reset: () => void
}

interface RecorderDataEvent {
    data: Blob
}

interface RecorderErrorEvent {
    error?: Error | DOMException | null
}

interface MediaRecorderConfig {
    mimeType?: string
    bitsPerSecond?: number
    audioBitsPerSecond?: number
    videoBitsPerSecond?: number
}

interface MediaRecorderInstance {
    state: MediaRecorderStatus
    mimeType: string
    onstart: (() => void) | null
    onstop: (() => void) | null
    onpause: (() => void) | null
    onresume: (() => void) | null
    ondataavailable: ((event: RecorderDataEvent) => void) | null
    onerror: ((event: RecorderErrorEvent) => void) | null
    start(timeslice?: number): void
    stop(): void
    pause(): void
    resume(): void
    requestData(): void
}

interface MediaRecorderCtor {
    new (
        stream: MediaStream,
        options?: MediaRecorderConfig
    ): MediaRecorderInstance
    isTypeSupported?: (mimeType: string) => boolean
}

function getMediaRecorderCtor(): MediaRecorderCtor | null {
    if (typeof window === 'undefined') return null

    const w = window as Window & {
        MediaRecorder?: MediaRecorderCtor
    }

    return w.MediaRecorder ?? null
}

function detachRecorderHandlers(recorder: MediaRecorderInstance | null) {
    if (!recorder) return

    recorder.onstart = null
    recorder.onstop = null
    recorder.onpause = null
    recorder.onresume = null
    recorder.ondataavailable = null
    recorder.onerror = null
}

function toError(error: unknown, fallbackMessage: string) {
    return error instanceof Error ? error : new Error(fallbackMessage)
}

/**
 * Hook for recording media from an existing `MediaStream` using the
 * MediaRecorder API.
 *
 * @param stream - Media stream to record, typically from `useUserMedia`
 * @param options - Recorder configuration and lifecycle callbacks
 * @returns Media recorder state and controls
 *
 * @example
 * ```tsx
 * function AudioRecorder() {
 *   const { stream } = useUserMedia({ constraints: { audio: true } })
 *   const { start, stop, status, blob } = useMediaRecorder(stream, {
 *     mimeType: 'audio/webm',
 *   })
 *
 *   return (
 *     <div>
 *       <button onClick={() => start()}>Record</button>
 *       <button onClick={stop}>Stop</button>
 *       <p>{status}</p>
 *       <p>{blob ? 'Recording ready' : 'No recording yet'}</p>
 *     </div>
 *   )
 * }
 * ```
 */
export default function useMediaRecorder(
    stream: MediaStream | null,
    options: UseMediaRecorderOptions = {}
): UseMediaRecorderReturn {
    const {
        mimeType,
        bitsPerSecond,
        audioBitsPerSecond,
        videoBitsPerSecond,
        onStart,
        onDataAvailable,
        onPause,
        onResume,
        onStop,
        onError,
    } = options

    const MediaRecorderCtor = getMediaRecorderCtor()
    const isSupported = MediaRecorderCtor !== null

    const [status, setStatus] = useState<MediaRecorderStatus>('inactive')
    const [chunks, setChunks] = useState<Blob[]>([])
    const [blob, setBlob] = useState<Blob | null>(null)
    const [currentMimeType, setCurrentMimeType] = useState<string | null>(null)
    const [error, setError] = useState<Error | null>(null)

    const mountedRef = useRef(true)
    const recorderRef = useRef<MediaRecorderInstance | null>(null)
    const chunksRef = useRef<Blob[]>([])
    const previousStreamRef = useRef<MediaStream | null>(stream)
    const onStartRef = useRef(onStart)
    const onDataAvailableRef = useRef(onDataAvailable)
    const onPauseRef = useRef(onPause)
    const onResumeRef = useRef(onResume)
    const onStopRef = useRef(onStop)
    const onErrorRef = useRef(onError)

    useEffect(() => {
        onStartRef.current = onStart
    }, [onStart])

    useEffect(() => {
        onDataAvailableRef.current = onDataAvailable
    }, [onDataAvailable])

    useEffect(() => {
        onPauseRef.current = onPause
    }, [onPause])

    useEffect(() => {
        onResumeRef.current = onResume
    }, [onResume])

    useEffect(() => {
        onStopRef.current = onStop
    }, [onStop])

    useEffect(() => {
        onErrorRef.current = onError
    }, [onError])

    const reset = useCallback(() => {
        chunksRef.current = []
        setChunks([])
        setBlob(null)
        setError(null)
    }, [])

    const stop = useCallback(() => {
        const recorder = recorderRef.current
        if (!recorder || recorder.state === 'inactive') return
        recorder.stop()
    }, [])

    const pause = useCallback(() => {
        const recorder = recorderRef.current
        if (!recorder || recorder.state !== 'recording') return
        recorder.pause()
    }, [])

    const resume = useCallback(() => {
        const recorder = recorderRef.current
        if (!recorder || recorder.state !== 'paused') return
        recorder.resume()
    }, [])

    const requestData = useCallback(() => {
        const recorder = recorderRef.current
        if (!recorder || recorder.state === 'inactive') return
        recorder.requestData()
    }, [])

    const start = useCallback(
        (timeslice?: number) => {
            if (!MediaRecorderCtor) {
                const unsupportedError = new Error(
                    'MediaRecorder is not supported by this browser'
                )

                setError(unsupportedError)
                onErrorRef.current?.(unsupportedError)
                return
            }

            if (!stream) {
                const missingStreamError = new Error(
                    'useMediaRecorder requires an active MediaStream'
                )

                setError(missingStreamError)
                onErrorRef.current?.(missingStreamError)
                return
            }

            if (
                recorderRef.current &&
                recorderRef.current.state !== 'inactive'
            ) {
                return
            }

            if (
                mimeType &&
                typeof MediaRecorderCtor.isTypeSupported === 'function' &&
                !MediaRecorderCtor.isTypeSupported(mimeType)
            ) {
                const mimeTypeError = new Error(
                    `MediaRecorder does not support MIME type: ${mimeType}`
                )

                setError(mimeTypeError)
                onErrorRef.current?.(mimeTypeError)
                return
            }

            chunksRef.current = []
            setChunks([])
            setBlob(null)
            setError(null)

            const recorderOptions: MediaRecorderConfig = {}
            if (mimeType !== undefined) recorderOptions.mimeType = mimeType
            if (bitsPerSecond !== undefined) {
                recorderOptions.bitsPerSecond = bitsPerSecond
            }
            if (audioBitsPerSecond !== undefined) {
                recorderOptions.audioBitsPerSecond = audioBitsPerSecond
            }
            if (videoBitsPerSecond !== undefined) {
                recorderOptions.videoBitsPerSecond = videoBitsPerSecond
            }

            let recorder: MediaRecorderInstance

            try {
                recorder = new MediaRecorderCtor(stream, recorderOptions)
            } catch (err) {
                const startError = toError(
                    err,
                    'Failed to create MediaRecorder'
                )
                setError(startError)
                onErrorRef.current?.(startError)
                return
            }

            recorder.onstart = () => {
                if (!mountedRef.current) return
                setStatus('recording')
                setCurrentMimeType(recorder.mimeType || mimeType || null)
                onStartRef.current?.()
            }

            recorder.ondataavailable = (event: RecorderDataEvent) => {
                if (event.data.size === 0) return

                chunksRef.current = [...chunksRef.current, event.data]

                if (mountedRef.current) {
                    setChunks((prev) => [...prev, event.data])
                }

                onDataAvailableRef.current?.(event.data)
            }

            recorder.onpause = () => {
                if (!mountedRef.current) return
                setStatus('paused')
                onPauseRef.current?.()
            }

            recorder.onresume = () => {
                if (!mountedRef.current) return
                setStatus('recording')
                onResumeRef.current?.()
            }

            recorder.onerror = (event: RecorderErrorEvent) => {
                const recorderError = toError(
                    event.error,
                    'MediaRecorder failed'
                )

                recorderRef.current = null
                detachRecorderHandlers(recorder)

                if (!mountedRef.current) return

                setStatus('inactive')
                setError(recorderError)
                onErrorRef.current?.(recorderError)
            }

            recorder.onstop = () => {
                const nextMimeType = recorder.mimeType || mimeType || null
                const recordedChunks = [...chunksRef.current]
                const nextBlob =
                    recordedChunks.length > 0
                        ? new Blob(
                              recordedChunks,
                              nextMimeType ? { type: nextMimeType } : undefined
                          )
                        : null

                recorderRef.current = null
                detachRecorderHandlers(recorder)

                if (mountedRef.current) {
                    setStatus('inactive')
                    setBlob(nextBlob)
                    setCurrentMimeType(nextMimeType)
                }

                onStopRef.current?.(nextBlob, recordedChunks)
            }

            recorderRef.current = recorder

            try {
                recorder.start(timeslice)
            } catch (err) {
                recorderRef.current = null
                detachRecorderHandlers(recorder)

                const startError = toError(err, 'Failed to start recording')
                setError(startError)
                onErrorRef.current?.(startError)
            }
        },
        [
            MediaRecorderCtor,
            stream,
            mimeType,
            bitsPerSecond,
            audioBitsPerSecond,
            videoBitsPerSecond,
        ]
    )

    useEffect(() => {
        if (
            previousStreamRef.current !== stream &&
            recorderRef.current &&
            recorderRef.current.state !== 'inactive'
        ) {
            recorderRef.current.stop()
        }

        previousStreamRef.current = stream
    }, [stream])

    useEffect(() => {
        return () => {
            mountedRef.current = false

            const recorder = recorderRef.current
            recorderRef.current = null

            if (!recorder) return

            const shouldStop = recorder.state !== 'inactive'
            detachRecorderHandlers(recorder)

            if (shouldStop) {
                recorder.stop()
            }
        }
    }, [])

    return {
        status,
        isSupported,
        isRecording: status === 'recording',
        isPaused: status === 'paused',
        chunks,
        blob,
        mimeType: currentMimeType,
        error,
        start,
        stop,
        pause,
        resume,
        requestData,
        reset,
    }
}
