import { useCallback, useEffect, useRef, useState } from 'react'

export interface EyeDropperResult {
    /** Picked color in sRGB hex format, such as `#RRGGBB`. */
    sRGBHex: string
}

export interface UseEyeDropperOptions {
    /**
     * Called when the eyedropper UI is opened.
     */
    onOpen?: () => void
    /**
     * Called when a color is picked successfully.
     */
    onPick?: (result: EyeDropperResult) => void
    /**
     * Called when the eyedropper UI closes, including after abort.
     */
    onClose?: () => void
    /**
     * Called when opening the eyedropper fails.
     * AbortError is treated as user cancellation and does not trigger this callback.
     */
    onError?: (error: Error) => void
}

export interface UseEyeDropperReturn {
    /** Latest picked color result, or null when nothing has been selected yet. */
    result: EyeDropperResult | null
    /** Latest picked sRGB hex string, or null when nothing has been selected yet. */
    sRGBHex: string | null
    /** Last eyedropper-related error, if any. */
    error: Error | null
    /** Whether the EyeDropper API is available in this browser. */
    isSupported: boolean
    /** Whether an eyedropper session is currently open. */
    isOpen: boolean
    /** Open the eyedropper UI and resolve with the selected color, or null on cancel. */
    open: () => Promise<EyeDropperResult | null>
    /** Abort the active eyedropper session, if one is open. */
    abort: () => void
}

interface EyeDropperOpenOptions {
    signal?: AbortSignal
}

interface EyeDropperInstance {
    open: (options?: EyeDropperOpenOptions) => Promise<EyeDropperResult>
}

interface EyeDropperCtor {
    new (): EyeDropperInstance
}

function getEyeDropperCtor(): EyeDropperCtor | null {
    if (typeof window === 'undefined') return null

    const w = window as Window & {
        EyeDropper?: EyeDropperCtor
    }

    return w.EyeDropper ?? null
}

/**
 * Hook for the EyeDropper API.
 *
 * @param options - Eyedropper lifecycle callbacks
 * @returns Eyedropper state and imperative controls
 *
 * @example
 * ```tsx
 * function ColorPicker() {
 *   const { sRGBHex, open, isSupported } = useEyeDropper()
 *
 *   if (!isSupported) return null
 *
 *   return (
 *     <button onClick={() => void open()}>
 *       {sRGBHex ?? 'Pick color'}
 *     </button>
 *   )
 * }
 * ```
 */
export default function useEyeDropper(
    options: UseEyeDropperOptions = {}
): UseEyeDropperReturn {
    const { onOpen, onPick, onClose, onError } = options

    const EyeDropperCtor = getEyeDropperCtor()
    const isSupported = EyeDropperCtor !== null

    const [result, setResult] = useState<EyeDropperResult | null>(null)
    const [error, setError] = useState<Error | null>(null)
    const [isOpen, setIsOpen] = useState(false)

    const mountedRef = useRef(true)
    const isOpenRef = useRef(false)
    const requestIdRef = useRef(0)
    const abortControllerRef = useRef<AbortController | null>(null)
    const onOpenRef = useRef(onOpen)
    const onPickRef = useRef(onPick)
    const onCloseRef = useRef(onClose)
    const onErrorRef = useRef(onError)

    useEffect(() => {
        onOpenRef.current = onOpen
    }, [onOpen])

    useEffect(() => {
        onPickRef.current = onPick
    }, [onPick])

    useEffect(() => {
        onCloseRef.current = onClose
    }, [onClose])

    useEffect(() => {
        onErrorRef.current = onError
    }, [onError])

    const abort = useCallback(() => {
        const controller = abortControllerRef.current
        if (!controller) {
            return
        }

        requestIdRef.current += 1
        abortControllerRef.current = null
        controller.abort()

        if (mountedRef.current) {
            isOpenRef.current = false
            setIsOpen(false)
            onCloseRef.current?.()
        }
    }, [])

    const open = useCallback(async () => {
        if (!EyeDropperCtor) {
            const unsupportedError = new Error(
                'EyeDropper is not supported by this browser'
            )
            setError(unsupportedError)
            onErrorRef.current?.(unsupportedError)
            return null
        }

        if (isOpenRef.current) {
            return null
        }

        const requestId = requestIdRef.current + 1
        requestIdRef.current = requestId

        const controller =
            typeof AbortController !== 'undefined'
                ? new AbortController()
                : null

        abortControllerRef.current = controller
        isOpenRef.current = true
        setIsOpen(true)
        setError(null)
        onOpenRef.current?.()

        try {
            const eyeDropper = new EyeDropperCtor()
            const nextResult = await eyeDropper.open({
                signal: controller?.signal,
            })

            if (!mountedRef.current || requestIdRef.current !== requestId) {
                return null
            }

            setResult(nextResult)
            onPickRef.current?.(nextResult)
            return nextResult
        } catch (err) {
            const resolvedError =
                err instanceof Error
                    ? err
                    : new Error('EyeDropper failed to pick a color')

            if (!mountedRef.current || requestIdRef.current !== requestId) {
                return null
            }

            if (resolvedError.name !== 'AbortError') {
                setError(resolvedError)
                onErrorRef.current?.(resolvedError)
            }

            return null
        } finally {
            if (mountedRef.current && requestIdRef.current === requestId) {
                abortControllerRef.current = null
                isOpenRef.current = false
                setIsOpen(false)
                onCloseRef.current?.()
            }
        }
    }, [EyeDropperCtor])

    useEffect(() => {
        return () => {
            mountedRef.current = false
            requestIdRef.current += 1
            abortControllerRef.current?.abort()
            abortControllerRef.current = null
            isOpenRef.current = false
        }
    }, [])

    return {
        result,
        sRGBHex: result?.sRGBHex ?? null,
        error,
        isSupported,
        isOpen,
        open,
        abort,
    }
}
