import { useCallback, useEffect, useRef, useState } from 'react'

export type AnimationFrameCallback = (
    deltaTime: number,
    timestamp: number
) => void

export interface UseAnimationFrameOptions {
    /**
     * Whether to start the animation loop automatically on mount.
     * @default true
     */
    autoStart?: boolean
    /**
     * Called when the loop starts.
     */
    onStart?: () => void
    /**
     * Called when the loop stops manually.
     */
    onStop?: () => void
}

export interface UseAnimationFrameReturn {
    /** Whether requestAnimationFrame is supported. */
    isSupported: boolean
    /** Whether the loop is currently active. */
    isRunning: boolean
    /** Start the animation loop if it is not already running. */
    start: () => void
    /** Stop the animation loop if it is running. */
    stop: () => void
}

/**
 * Hook for running a callback on every animation frame with frame delta timing.
 *
 * @param callback - Callback invoked each frame with delta time and timestamp
 * @param options - Animation loop configuration
 * @returns Loop controls and status state
 *
 * @example
 * ```tsx
 * function Spinner() {
 *   const [rotation, setRotation] = useState(0)
 *   const { stop, start, isRunning } = useAnimationFrame((deltaTime) => {
 *     setRotation((prev) => prev + deltaTime * 0.1)
 *   })
 *
 *   return (
 *     <button onClick={isRunning ? stop : start}>
 *       {Math.round(rotation)}
 *     </button>
 *   )
 * }
 * ```
 */
export default function useAnimationFrame(
    callback: AnimationFrameCallback,
    options: UseAnimationFrameOptions = {}
): UseAnimationFrameReturn {
    const { autoStart = true, onStart, onStop } = options

    const isSupported =
        typeof window !== 'undefined' &&
        typeof window.requestAnimationFrame === 'function' &&
        typeof window.cancelAnimationFrame === 'function'

    const [isRunning, setIsRunning] = useState(false)

    const frameIdRef = useRef<number | null>(null)
    const lastTimestampRef = useRef<number | null>(null)
    const runningRef = useRef(false)
    const callbackRef = useRef(callback)
    const onStartRef = useRef(onStart)
    const onStopRef = useRef(onStop)

    useEffect(() => {
        callbackRef.current = callback
    }, [callback])

    useEffect(() => {
        onStartRef.current = onStart
    }, [onStart])

    useEffect(() => {
        onStopRef.current = onStop
    }, [onStop])

    const cancelLoop = useCallback(() => {
        if (isSupported && frameIdRef.current !== null) {
            window.cancelAnimationFrame(frameIdRef.current)
        }

        frameIdRef.current = null
        lastTimestampRef.current = null
        runningRef.current = false
    }, [isSupported])

    const step = useCallback((timestamp: number) => {
        if (!runningRef.current || typeof window === 'undefined') {
            return
        }

        const previousTimestamp = lastTimestampRef.current
        const deltaTime =
            previousTimestamp === null ? 0 : timestamp - previousTimestamp

        lastTimestampRef.current = timestamp
        callbackRef.current(deltaTime, timestamp)
        frameIdRef.current = window.requestAnimationFrame(step)
    }, [])

    const start = useCallback(() => {
        if (!isSupported || runningRef.current) {
            return
        }

        runningRef.current = true
        lastTimestampRef.current = null
        setIsRunning(true)
        onStartRef.current?.()
        frameIdRef.current = window.requestAnimationFrame(step)
    }, [isSupported, step])

    const stop = useCallback(() => {
        if (!runningRef.current) {
            return
        }

        cancelLoop()
        setIsRunning(false)
        onStopRef.current?.()
    }, [cancelLoop])

    useEffect(() => {
        if (!autoStart) {
            return () => {
                cancelLoop()
            }
        }

        start()

        return () => {
            cancelLoop()
        }
    }, [autoStart, cancelLoop, start])

    return {
        isSupported,
        isRunning,
        start,
        stop,
    }
}
