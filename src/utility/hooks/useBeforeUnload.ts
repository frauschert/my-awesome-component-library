import { useEffect } from 'react'
import { useLatestRef } from './useLatestRef'

export interface UseBeforeUnloadOptions {
    /** Whether the handler is active. Defaults to true. */
    enabled?: boolean
    /** Custom message shown in the browser's confirm dialog (ignored by most modern browsers). */
    message?: string
}

/**
 * Fires a callback before the page/tab is unloaded, and optionally shows
 * the browser's "Leave site?" confirmation dialog.
 *
 * Pass `preventDefault: true` (via the callback returning a string or calling
 * `event.preventDefault()`) to trigger the native dialog.
 *
 * @param handler - Called with the `BeforeUnloadEvent`. Return a non-empty
 *   string or call `event.preventDefault()` to show the browser's confirmation.
 * @param options - Configuration options.
 *
 * @example
 * // Show leave-site dialog when there are unsaved changes
 * useBeforeUnload(
 *   (event) => { event.preventDefault() },
 *   { enabled: isDirty }
 * )
 *
 * @example
 * // Fire-and-forget side effect (e.g. analytics) without dialog
 * useBeforeUnload(() => { analytics.track('page_leave') })
 */
export default function useBeforeUnload(
    handler: (event: BeforeUnloadEvent) => void,
    options: UseBeforeUnloadOptions = {}
): void {
    const { enabled = true } = options
    const handlerRef = useLatestRef(handler)

    useEffect(() => {
        if (!enabled) return

        const listener = (event: BeforeUnloadEvent) => {
            handlerRef.current(event)
        }

        window.addEventListener('beforeunload', listener)

        return () => {
            window.removeEventListener('beforeunload', listener)
        }
    }, [enabled, handlerRef])
}
