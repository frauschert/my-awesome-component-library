import { useEffect, useRef } from 'react'

/**
 * Hook to manage document.title dynamically.
 * Automatically restores the previous title when the component unmounts.
 *
 * @param {string} title - The title to set
 * @param {UseTitleOptions} options - Configuration options
 *
 * @example
 * useTitle('Dashboard | My App')
 *
 * @example
 * useTitle('New Messages (3)', { restoreOnUnmount: false })
 */
export default function useTitle(
    title: string,
    options: UseTitleOptions = {}
): void {
    const { restoreOnUnmount = true } = options
    const prevTitleRef = useRef<string | null>(null)

    useEffect(() => {
        // Store the previous title on first mount
        if (prevTitleRef.current === null) {
            prevTitleRef.current = document.title
        }

        // Set the new title
        document.title = title
    }, [title])

    useEffect(() => {
        return () => {
            // Restore the previous title on unmount if enabled
            if (restoreOnUnmount && prevTitleRef.current !== null) {
                document.title = prevTitleRef.current
            }
        }
    }, [restoreOnUnmount])
}

export interface UseTitleOptions {
    /**
     * Whether to restore the previous title when the component unmounts
     * @default true
     */
    restoreOnUnmount?: boolean
}
