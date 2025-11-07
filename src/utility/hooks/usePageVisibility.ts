import { useState, useEffect, useRef } from 'react'

export type VisibilityState = 'visible' | 'hidden'

export interface UsePageVisibilityOptions {
    /**
     * Callback when visibility changes
     */
    onChange?: (isVisible: boolean, visibilityState: VisibilityState) => void
    /**
     * Callback when page becomes visible
     */
    onShow?: () => void
    /**
     * Callback when page becomes hidden
     */
    onHide?: () => void
}

export interface UsePageVisibilityReturn {
    /**
     * Whether the page is currently visible
     */
    isVisible: boolean
    /**
     * Current document visibility state
     */
    visibilityState: VisibilityState
    /**
     * Whether the Page Visibility API is supported
     */
    isSupported: boolean
}

/**
 * Hook for tracking page visibility state using the Page Visibility API
 *
 * Useful for pausing/resuming videos, animations, polling, or other activities
 * when the user switches tabs or minimizes the browser.
 *
 * @param options - Configuration options
 * @returns Page visibility state
 *
 * @example
 * ```tsx
 * const { isVisible, visibilityState } = usePageVisibility({
 *   onShow: () => console.log('Page is now visible'),
 *   onHide: () => console.log('Page is now hidden'),
 * })
 *
 * // Pause video when tab is hidden
 * useEffect(() => {
 *   if (!isVisible) {
 *     videoRef.current?.pause()
 *   }
 * }, [isVisible])
 * ```
 */
const usePageVisibility = (
    options: UsePageVisibilityOptions = {}
): UsePageVisibilityReturn => {
    const { onChange, onShow, onHide } = options

    // Use refs to store callbacks to avoid effect re-runs when they change
    const onChangeRef = useRef(onChange)
    const onShowRef = useRef(onShow)
    const onHideRef = useRef(onHide)

    // Update refs when callbacks change
    useEffect(() => {
        onChangeRef.current = onChange
        onShowRef.current = onShow
        onHideRef.current = onHide
    }, [onChange, onShow, onHide])

    const [isVisible, setIsVisible] = useState(() => {
        if (typeof document === 'undefined') return true
        return !document.hidden
    })

    const [visibilityState, setVisibilityState] = useState<VisibilityState>(
        () => {
            if (typeof document === 'undefined') return 'visible'
            return document.visibilityState === 'hidden' ? 'hidden' : 'visible'
        }
    )

    const isSupported =
        typeof document !== 'undefined' &&
        typeof document.hidden !== 'undefined'

    useEffect(() => {
        if (!isSupported) return

        let isInitialMount = true

        const handleVisibilityChange = () => {
            const hidden = document.hidden
            const state: VisibilityState =
                document.visibilityState === 'hidden' ? 'hidden' : 'visible'
            const visible = !hidden

            setIsVisible(visible)
            setVisibilityState(state)

            // Call callbacks using refs
            if (onChangeRef.current) {
                onChangeRef.current(visible, state)
            }

            if (visible && onShowRef.current) {
                onShowRef.current()
            } else if (!visible && onHideRef.current) {
                onHideRef.current()
            }
        }

        // Call once on initial mount to sync with current state
        if (isInitialMount) {
            handleVisibilityChange()
            isInitialMount = false
        }

        // Add event listener
        document.addEventListener('visibilitychange', handleVisibilityChange)

        return () => {
            document.removeEventListener(
                'visibilitychange',
                handleVisibilityChange
            )
        }
    }, [isSupported])

    return {
        isVisible,
        visibilityState,
        isSupported,
    }
}

export default usePageVisibility
