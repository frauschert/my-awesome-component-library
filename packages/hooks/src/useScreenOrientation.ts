import { useCallback, useEffect, useRef, useState } from 'react'

export type ScreenOrientationType =
    | 'portrait-primary'
    | 'portrait-secondary'
    | 'landscape-primary'
    | 'landscape-secondary'
    | 'unknown'

export type ScreenOrientationLockType =
    | 'any'
    | 'natural'
    | 'landscape'
    | 'portrait'
    | 'portrait-primary'
    | 'portrait-secondary'
    | 'landscape-primary'
    | 'landscape-secondary'

export interface ScreenOrientationData {
    /** Current screen orientation type. */
    type: ScreenOrientationType
    /** Current screen orientation angle in degrees. */
    angle: number
    /** Whether the screen is currently in a portrait orientation. */
    isPortrait: boolean
    /** Whether the screen is currently in a landscape orientation. */
    isLandscape: boolean
}

export interface UseScreenOrientationOptions {
    /**
     * Called whenever the screen orientation changes.
     */
    onChange?: (orientation: ScreenOrientationData) => void
    /**
     * Called when lock/unlock or orientation detection fails.
     */
    onError?: (error: Error) => void
}

export interface UseScreenOrientationReturn {
    /** Latest screen orientation state, or null when unsupported. */
    orientation: ScreenOrientationData | null
    /** Last screen-orientation-related error, if any. */
    error: Error | null
    /** Whether screen orientation can be observed in this browser. */
    isSupported: boolean
    /** Whether programmatic orientation locking is supported. */
    isLockSupported: boolean
    /** Attempt to lock the screen to a given orientation. */
    lock: (orientation: ScreenOrientationLockType) => Promise<void>
    /** Release any active orientation lock. */
    unlock: () => void
}

interface ScreenOrientationInstance {
    type?: string
    angle?: number
    lock?: (orientation: ScreenOrientationLockType) => Promise<void>
    unlock?: () => void
    addEventListener?: (event: 'change', listener: () => void) => void
    removeEventListener?: (event: 'change', listener: () => void) => void
}

function getScreenOrientation(): ScreenOrientationInstance | null {
    if (typeof window === 'undefined') return null

    const screenLike = window.screen as Screen & {
        orientation?: ScreenOrientationInstance
    }

    return screenLike.orientation ?? null
}

function getWindowOrientationAngle(): number | null {
    if (typeof window === 'undefined') return null

    const w = window as Window & {
        orientation?: number
    }

    return typeof w.orientation === 'number' ? w.orientation : null
}

function getIsSupported() {
    if (typeof window === 'undefined') return false

    const w = window as Window & {
        orientation?: number
        onorientationchange?: unknown
    }

    return (
        getScreenOrientation() !== null ||
        typeof w.orientation === 'number' ||
        typeof w.onorientationchange !== 'undefined'
    )
}

function normalizeAngle(angle: number) {
    const normalized = angle % 360
    return normalized < 0 ? normalized + 360 : normalized
}

function deriveOrientationType(
    angle: number,
    fallbackLandscape: boolean
): ScreenOrientationType {
    switch (normalizeAngle(angle)) {
        case 0:
            return 'portrait-primary'
        case 90:
            return 'landscape-primary'
        case 180:
            return 'portrait-secondary'
        case 270:
            return 'landscape-secondary'
        default:
            return fallbackLandscape ? 'landscape-primary' : 'portrait-primary'
    }
}

function isKnownOrientationType(
    type: string | undefined
): type is Exclude<ScreenOrientationType, 'unknown'> {
    return (
        type === 'portrait-primary' ||
        type === 'portrait-secondary' ||
        type === 'landscape-primary' ||
        type === 'landscape-secondary'
    )
}

function getCurrentOrientation(): ScreenOrientationData | null {
    if (!getIsSupported() || typeof window === 'undefined') {
        return null
    }

    const screenOrientation = getScreenOrientation()
    const fallbackLandscape = window.innerWidth > window.innerHeight
    const fallbackAngle = fallbackLandscape ? 90 : 0

    const angle =
        typeof screenOrientation?.angle === 'number'
            ? screenOrientation.angle
            : getWindowOrientationAngle() ?? fallbackAngle

    const type = isKnownOrientationType(screenOrientation?.type)
        ? screenOrientation.type
        : deriveOrientationType(angle, fallbackLandscape)

    return {
        type,
        angle,
        isPortrait: type.startsWith('portrait'),
        isLandscape: type.startsWith('landscape'),
    }
}

/**
 * Hook for observing and controlling screen orientation via the Screen Orientation API.
 * Falls back to the legacy `window.orientation` / `orientationchange` path when needed.
 *
 * @param options - Orientation callbacks
 * @returns Current orientation state and lock/unlock controls
 *
 * @example
 * ```tsx
 * function OrientationStatus() {
 *   const { orientation, lock, unlock } = useScreenOrientation()
 *
 *   return (
 *     <div>
 *       <p>{orientation?.type ?? 'unsupported'}</p>
 *       <button onClick={() => void lock('landscape')}>Landscape</button>
 *       <button onClick={unlock}>Unlock</button>
 *     </div>
 *   )
 * }
 * ```
 */
export default function useScreenOrientation(
    options: UseScreenOrientationOptions = {}
): UseScreenOrientationReturn {
    const { onChange, onError } = options

    const isSupported = getIsSupported()
    const isLockSupported = typeof getScreenOrientation()?.lock === 'function'

    const [orientation, setOrientation] =
        useState<ScreenOrientationData | null>(getCurrentOrientation)
    const [error, setError] = useState<Error | null>(null)

    const onChangeRef = useRef(onChange)
    const onErrorRef = useRef(onError)

    useEffect(() => {
        onChangeRef.current = onChange
    }, [onChange])

    useEffect(() => {
        onErrorRef.current = onError
    }, [onError])

    const syncOrientation = useCallback((shouldNotify: boolean) => {
        const nextOrientation = getCurrentOrientation()
        setOrientation(nextOrientation)

        if (shouldNotify && nextOrientation) {
            onChangeRef.current?.(nextOrientation)
        }
    }, [])

    const lock = useCallback(
        async (nextOrientation: ScreenOrientationLockType) => {
            const screenOrientation = getScreenOrientation()

            if (!screenOrientation?.lock) {
                const unsupportedError = new Error(
                    'Screen orientation locking is not supported by this browser'
                )

                setError(unsupportedError)
                onErrorRef.current?.(unsupportedError)
                return
            }

            setError(null)

            try {
                await screenOrientation.lock(nextOrientation)
                syncOrientation(false)
            } catch (err) {
                const lockError =
                    err instanceof Error
                        ? err
                        : new Error('Failed to lock screen orientation')

                setError(lockError)
                onErrorRef.current?.(lockError)
            }
        },
        [syncOrientation]
    )

    const unlock = useCallback(() => {
        const screenOrientation = getScreenOrientation()
        if (!screenOrientation?.unlock) return

        try {
            setError(null)
            screenOrientation.unlock()
            syncOrientation(false)
        } catch (err) {
            const unlockError =
                err instanceof Error
                    ? err
                    : new Error('Failed to unlock screen orientation')

            setError(unlockError)
            onErrorRef.current?.(unlockError)
        }
    }, [syncOrientation])

    useEffect(() => {
        if (!isSupported || typeof window === 'undefined') {
            return
        }

        const handleChange = () => {
            syncOrientation(true)
        }

        const screenOrientation = getScreenOrientation()

        if (screenOrientation?.addEventListener) {
            screenOrientation.addEventListener('change', handleChange)

            return () => {
                screenOrientation.removeEventListener?.('change', handleChange)
            }
        }

        window.addEventListener('orientationchange', handleChange)

        return () => {
            window.removeEventListener('orientationchange', handleChange)
        }
    }, [isSupported, syncOrientation])

    return {
        orientation,
        error,
        isSupported,
        isLockSupported,
        lock,
        unlock,
    }
}
