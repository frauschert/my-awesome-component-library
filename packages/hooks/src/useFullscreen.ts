import { useCallback, useEffect, useState, RefObject } from 'react'

// Vendor-prefixed types for fullscreen API
interface DocumentWithFullscreen extends Document {
    webkitFullscreenEnabled?: boolean
    mozFullScreenEnabled?: boolean
    msFullscreenEnabled?: boolean
    webkitFullscreenElement?: Element
    mozFullScreenElement?: Element
    msFullscreenElement?: Element
    webkitExitFullscreen?: () => Promise<void>
    mozCancelFullScreen?: () => Promise<void>
    msExitFullscreen?: () => Promise<void>
}

interface ElementWithFullscreen extends HTMLElement {
    webkitRequestFullscreen?: () => Promise<void>
    mozRequestFullScreen?: () => Promise<void>
    msRequestFullscreen?: () => Promise<void>
}

interface UseFullscreenOptions {
    /**
     * Callback when entering fullscreen
     */
    onEnter?: () => void
    /**
     * Callback when exiting fullscreen
     */
    onExit?: () => void
    /**
     * Callback when fullscreen operation fails
     */
    onError?: (error: Error) => void
}

interface UseFullscreenReturn {
    /**
     * Whether the element is currently in fullscreen
     */
    isFullscreen: boolean
    /**
     * Enter fullscreen mode
     */
    enter: () => Promise<void>
    /**
     * Exit fullscreen mode
     */
    exit: () => Promise<void>
    /**
     * Toggle fullscreen mode
     */
    toggle: () => Promise<void>
    /**
     * Whether fullscreen is supported
     */
    isSupported: boolean
}

/**
 * Hook that manages fullscreen mode for an element.
 * Returns state and controls for entering/exiting fullscreen.
 *
 * @param elementRef - Ref to the element to make fullscreen
 * @param options - Optional callbacks for enter, exit, and error events
 * @returns Object with fullscreen state and control functions
 *
 * @example
 * const ref = useRef<HTMLDivElement>(null)
 * const { isFullscreen, enter, exit, toggle, isSupported } = useFullscreen(ref)
 *
 * return (
 *   <div ref={ref}>
 *     {isSupported && (
 *       <button onClick={toggle}>
 *         {isFullscreen ? 'Exit' : 'Enter'} Fullscreen
 *       </button>
 *     )}
 *   </div>
 * )
 *
 * @example
 * // Video player
 * function VideoPlayer() {
 *   const videoRef = useRef<HTMLVideoElement>(null)
 *   const { isFullscreen, toggle } = useFullscreen(videoRef, {
 *     onEnter: () => console.log('Entered fullscreen'),
 *     onExit: () => console.log('Exited fullscreen')
 *   })
 *
 *   return (
 *     <div>
 *       <video ref={videoRef} src="video.mp4" />
 *       <button onClick={toggle}>
 *         {isFullscreen ? '⊗' : '⛶'} Fullscreen
 *       </button>
 *     </div>
 *   )
 * }
 */
export default function useFullscreen(
    elementRef: RefObject<HTMLElement | null>,
    options: UseFullscreenOptions = {}
): UseFullscreenReturn {
    const { onEnter, onExit, onError } = options
    const [isFullscreen, setIsFullscreen] = useState(false)

    // Check if fullscreen is supported
    const isSupported =
        typeof document !== 'undefined' &&
        !!(
            document.fullscreenEnabled ||
            (document as DocumentWithFullscreen).webkitFullscreenEnabled ||
            (document as DocumentWithFullscreen).mozFullScreenEnabled ||
            (document as DocumentWithFullscreen).msFullscreenEnabled
        )

    const getFullscreenElement = useCallback(() => {
        const doc = document as DocumentWithFullscreen
        return (
            document.fullscreenElement ||
            doc.webkitFullscreenElement ||
            doc.mozFullScreenElement ||
            doc.msFullscreenElement ||
            null
        )
    }, [])

    const enter = useCallback(async () => {
        if (!isSupported) {
            const error = new Error('Fullscreen API is not supported')
            onError?.(error)
            throw error
        }

        const element = elementRef.current
        if (!element) {
            const error = new Error('Element ref is not attached')
            onError?.(error)
            throw error
        }

        try {
            const el = element as ElementWithFullscreen
            if (element.requestFullscreen) {
                await element.requestFullscreen()
            } else if (el.webkitRequestFullscreen) {
                await el.webkitRequestFullscreen()
            } else if (el.mozRequestFullScreen) {
                await el.mozRequestFullScreen()
            } else if (el.msRequestFullscreen) {
                await el.msRequestFullscreen()
            }
        } catch (error) {
            onError?.(error as Error)
            throw error
        }
    }, [elementRef, isSupported, onError])

    const exit = useCallback(async () => {
        if (!isSupported) {
            const error = new Error('Fullscreen API is not supported')
            onError?.(error)
            throw error
        }

        try {
            const doc = document as DocumentWithFullscreen
            if (document.exitFullscreen) {
                await document.exitFullscreen()
            } else if (doc.webkitExitFullscreen) {
                await doc.webkitExitFullscreen()
            } else if (doc.mozCancelFullScreen) {
                await doc.mozCancelFullScreen()
            } else if (doc.msExitFullscreen) {
                await doc.msExitFullscreen()
            }
        } catch (error) {
            onError?.(error as Error)
            throw error
        }
    }, [isSupported, onError])

    const toggle = useCallback(async () => {
        if (isFullscreen) {
            await exit()
        } else {
            await enter()
        }
    }, [isFullscreen, enter, exit])

    useEffect(() => {
        const handleChange = () => {
            const fullscreenElement = getFullscreenElement()
            const isCurrentlyFullscreen =
                fullscreenElement === elementRef.current

            setIsFullscreen(isCurrentlyFullscreen)

            if (isCurrentlyFullscreen) {
                onEnter?.()
            } else if (fullscreenElement === null) {
                // Only call onExit if we're exiting from our element
                if (isFullscreen) {
                    onExit?.()
                }
            }
        }

        // Listen to fullscreen change events (with vendor prefixes)
        document.addEventListener('fullscreenchange', handleChange)
        document.addEventListener('webkitfullscreenchange', handleChange)
        document.addEventListener('mozfullscreenchange', handleChange)
        document.addEventListener('MSFullscreenChange', handleChange)

        // Check initial state
        handleChange()

        return () => {
            document.removeEventListener('fullscreenchange', handleChange)
            document.removeEventListener('webkitfullscreenchange', handleChange)
            document.removeEventListener('mozfullscreenchange', handleChange)
            document.removeEventListener('MSFullscreenChange', handleChange)
        }
    }, [elementRef, getFullscreenElement, onEnter, onExit, isFullscreen])

    return {
        isFullscreen,
        enter,
        exit,
        toggle,
        isSupported,
    }
}
