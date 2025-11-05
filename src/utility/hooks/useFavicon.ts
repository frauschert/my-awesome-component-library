import { useEffect, useRef } from 'react'

/**
 * Hook to dynamically change the favicon.
 * Automatically restores the previous favicon when the component unmounts.
 *
 * @param {string} href - The URL/path to the favicon image
 * @param {UseFaviconOptions} options - Configuration options
 *
 * @example
 * useFavicon('/notification-icon.ico')
 *
 * @example
 * useFavicon('data:image/svg+xml,...', { type: 'image/svg+xml' })
 */
export default function useFavicon(
    href: string,
    options: UseFaviconOptions = {}
): void {
    const { rel = 'icon', type, restoreOnUnmount = true } = options

    const prevFaviconRef = useRef<{
        href: string
        rel: string
        type?: string
    } | null>(null)

    useEffect(() => {
        // Find existing favicon link
        const existingLink = document.querySelector<HTMLLinkElement>(
            `link[rel*="${rel}"]`
        )

        // Store the previous favicon on first mount
        if (prevFaviconRef.current === null && existingLink) {
            prevFaviconRef.current = {
                href: existingLink.href,
                rel: existingLink.rel,
                type: existingLink.type || undefined,
            }
        }

        // Create or update favicon link
        let link = existingLink

        if (!link) {
            link = document.createElement('link')
            link.rel = rel
            document.head.appendChild(link)
        }

        link.href = href
        if (type) {
            link.type = type
        }

        return () => {
            // Restore the previous favicon on unmount if enabled
            if (restoreOnUnmount && prevFaviconRef.current && link) {
                link.href = prevFaviconRef.current.href
                link.rel = prevFaviconRef.current.rel
                if (prevFaviconRef.current.type) {
                    link.type = prevFaviconRef.current.type
                }
            }
        }
    }, [href, rel, type, restoreOnUnmount])
}

export interface UseFaviconOptions {
    /**
     * The rel attribute for the link element
     * @default 'icon'
     */
    rel?: string
    /**
     * The type attribute for the link element (e.g., 'image/png', 'image/svg+xml')
     */
    type?: string
    /**
     * Whether to restore the previous favicon when the component unmounts
     * @default true
     */
    restoreOnUnmount?: boolean
}
