import { useCallback, useEffect, useRef, useState, RefObject } from 'react'

export interface PointerMovement {
    /** Horizontal delta since last mousemove event (px, unbounded) */
    x: number
    /** Vertical delta since last mousemove event (px, unbounded) */
    y: number
}

export interface UsePointerLockOptions {
    /**
     * Callback fired when pointer lock is acquired
     */
    onLock?: () => void
    /**
     * Callback fired when pointer lock is released
     */
    onUnlock?: () => void
    /**
     * Callback fired when requestPointerLock fails
     */
    onError?: (error: Error) => void
}

export interface UsePointerLockReturn {
    /**
     * Whether the pointer is currently locked to the target element
     */
    isLocked: boolean
    /**
     * Raw mouse movement deltas — only non-zero while locked
     */
    movement: PointerMovement
    /**
     * Request pointer lock on the target element
     */
    lock: () => void
    /**
     * Release pointer lock
     */
    unlock: () => void
    /**
     * Toggle pointer lock on/off
     */
    toggle: () => void
    /**
     * Whether the Pointer Lock API is supported in this browser
     */
    isSupported: boolean
}

/**
 * Hook for the Pointer Lock API. Hides the OS cursor and provides raw,
 * unbounded mouse movement deltas — ideal for games, 3D viewers, and
 * canvas-based tools where the cursor should not be clamped to the viewport.
 *
 * @param ref - Ref to the element to lock the pointer to
 * @param options - Optional callbacks for lock/unlock/error events
 * @returns Pointer lock state and controls
 *
 * @example
 * ```tsx
 * const canvasRef = useRef<HTMLCanvasElement>(null)
 * const { isLocked, movement, toggle } = usePointerLock(canvasRef, {
 *   onLock: () => console.log('locked'),
 * })
 *
 * // Use movement.x / movement.y for camera rotation, etc.
 * ```
 */
const usePointerLock = <T extends HTMLElement = HTMLElement>(
    ref: RefObject<T | null>,
    options: UsePointerLockOptions = {}
): UsePointerLockReturn => {
    const { onLock, onUnlock, onError } = options

    const isSupported =
        typeof document !== 'undefined' && 'exitPointerLock' in document

    const [isLocked, setIsLocked] = useState(false)
    const [movement, setMovement] = useState<PointerMovement>({ x: 0, y: 0 })

    // Keep callbacks in refs to avoid re-registering listeners on every render
    const onLockRef = useRef(onLock)
    const onUnlockRef = useRef(onUnlock)
    const onErrorRef = useRef(onError)
    onLockRef.current = onLock
    onUnlockRef.current = onUnlock
    onErrorRef.current = onError

    const lock = useCallback(() => {
        const element = ref.current
        if (!isSupported || !element) return
        element.requestPointerLock()
    }, [ref, isSupported])

    const unlock = useCallback(() => {
        if (!isSupported) return
        if (document.pointerLockElement) {
            document.exitPointerLock()
        }
    }, [isSupported])

    const toggle = useCallback(() => {
        if (document.pointerLockElement === ref.current) {
            unlock()
        } else {
            lock()
        }
    }, [ref, lock, unlock])

    useEffect(() => {
        if (!isSupported) return

        const handleChange = () => {
            const locked = document.pointerLockElement === ref.current
            setIsLocked(locked)
            if (locked) {
                onLockRef.current?.()
            } else {
                setMovement({ x: 0, y: 0 })
                onUnlockRef.current?.()
            }
        }

        const handleError = () => {
            onErrorRef.current?.(new Error('Pointer lock request failed'))
        }

        const handleMouseMove = (e: MouseEvent) => {
            if (document.pointerLockElement !== ref.current) return
            setMovement({ x: e.movementX, y: e.movementY })
        }

        document.addEventListener('pointerlockchange', handleChange)
        document.addEventListener('pointerlockerror', handleError)
        document.addEventListener('mousemove', handleMouseMove)

        return () => {
            document.removeEventListener('pointerlockchange', handleChange)
            document.removeEventListener('pointerlockerror', handleError)
            document.removeEventListener('mousemove', handleMouseMove)
            // Release lock if the component unmounts while locked
            if (document.pointerLockElement === ref.current) {
                document.exitPointerLock()
            }
        }
    }, [ref, isSupported])

    return { isLocked, movement, lock, unlock, toggle, isSupported }
}

export default usePointerLock
