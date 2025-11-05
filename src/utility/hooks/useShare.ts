import { useState, useCallback } from 'react'

export interface ShareData {
    /**
     * Title of the content to share
     */
    title?: string

    /**
     * Text/description to share
     */
    text?: string

    /**
     * URL to share
     */
    url?: string

    /**
     * Files to share (if supported)
     */
    files?: File[]
}

export interface UseShareOptions {
    /**
     * Callback when share is successful
     */
    onSuccess?: () => void

    /**
     * Callback when share is cancelled or fails
     */
    onError?: (error: Error) => void
}

export interface UseShareReturn {
    /**
     * Share content using the native share dialog
     */
    share: (data: ShareData) => Promise<void>

    /**
     * Whether sharing is in progress
     */
    isSharing: boolean

    /**
     * Whether the Web Share API is supported
     */
    isSupported: boolean

    /**
     * Whether sharing files is supported
     */
    canShareFiles: boolean

    /**
     * Check if specific files can be shared
     */
    canShare: (data: ShareData) => boolean
}

/**
 * Hook to share content using the Web Share API.
 * Provides access to the native share dialog on supported devices.
 * Perfect for sharing articles, products, media, or any content.
 *
 * @param options - Configuration options
 * @returns Share functions and state
 *
 * @example
 * ```tsx
 * function Article({ title, url }) {
 *   const { share, isSupported } = useShare()
 *
 *   if (!isSupported) return null
 *
 *   return (
 *     <button onClick={() => share({ title, url })}>
 *       Share Article
 *     </button>
 *   )
 * }
 * ```
 */
export function useShare(options: UseShareOptions = {}): UseShareReturn {
    const { onSuccess, onError } = options

    const [isSharing, setIsSharing] = useState(false)

    // Check if Web Share API is supported
    const isSupported =
        typeof window !== 'undefined' && 'share' in window.navigator

    // Check if sharing files is supported
    const canShareFiles =
        typeof window !== 'undefined' &&
        'canShare' in window.navigator &&
        typeof window.navigator.canShare === 'function'

    /**
     * Check if specific data can be shared
     */
    const canShare = useCallback(
        (data: ShareData): boolean => {
            if (!isSupported) return false

            if (typeof window.navigator.canShare === 'function') {
                // Build the share data object
                const shareData: Partial<ShareData> = {}
                if (data.title) shareData.title = data.title
                if (data.text) shareData.text = data.text
                if (data.url) shareData.url = data.url
                if (data.files && data.files.length > 0)
                    shareData.files = data.files

                try {
                    return window.navigator.canShare(shareData)
                } catch {
                    return false
                }
            }

            // If canShare is not available, assume basic share is possible
            // unless files are provided (files need canShare to check)
            return !data.files || data.files.length === 0
        },
        [isSupported]
    )

    /**
     * Share content using native share dialog
     */
    const share = useCallback(
        async (data: ShareData): Promise<void> => {
            if (!isSupported) {
                const error = new Error(
                    'Web Share API is not supported in this browser'
                )
                onError?.(error)
                throw error
            }

            // Validate that at least one field is provided
            if (
                !data.title &&
                !data.text &&
                !data.url &&
                (!data.files || data.files.length === 0)
            ) {
                const error = new Error(
                    'Share data must contain at least one of: title, text, url, or files'
                )
                onError?.(error)
                throw error
            }

            setIsSharing(true)

            try {
                // Build share data object
                const shareData: Partial<ShareData> = {}
                if (data.title) shareData.title = data.title
                if (data.text) shareData.text = data.text
                if (data.url) shareData.url = data.url
                if (data.files && data.files.length > 0)
                    shareData.files = data.files

                await window.navigator.share(shareData)
                onSuccess?.()
            } catch (error) {
                // User cancelled the share or an error occurred
                const err =
                    error instanceof Error ? error : new Error('Share failed')

                // Don't call onError if user just cancelled (AbortError)
                if (err.name !== 'AbortError') {
                    onError?.(err)
                }

                throw err
            } finally {
                setIsSharing(false)
            }
        },
        [isSupported, onSuccess, onError]
    )

    return {
        share,
        isSharing,
        isSupported,
        canShareFiles,
        canShare,
    }
}

export default useShare
