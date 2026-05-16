import { useState, useCallback } from 'react'

interface CopyToClipboardResult {
    /** The currently copied value */
    copiedText: string | null
    /** Function to copy text to clipboard */
    copy: (text: string) => Promise<boolean>
    /** Whether the copy operation succeeded */
    isSuccess: boolean
    /** Whether a copy operation is in progress */
    isCopying: boolean
    /** Error that occurred during copy, if any */
    error: Error | null
    /** Reset the state */
    reset: () => void
}

/**
 * Hook to copy text to the clipboard with status tracking
 *
 * @returns Object with copy function and status
 *
 * @example
 * ```tsx
 * // Basic usage
 * function CopyButton({ text }) {
 *   const { copy, isSuccess } = useCopyToClipboard()
 *
 *   return (
 *     <button onClick={() => copy(text)}>
 *       {isSuccess ? 'Copied!' : 'Copy'}
 *     </button>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With error handling
 * function CopyWithFeedback({ text }) {
 *   const { copy, isSuccess, error, isCopying } = useCopyToClipboard()
 *
 *   const handleCopy = async () => {
 *     const success = await copy(text)
 *     if (!success) {
 *       alert('Failed to copy')
 *     }
 *   }
 *
 *   return (
 *     <div>
 *       <button onClick={handleCopy} disabled={isCopying}>
 *         {isCopying ? 'Copying...' : isSuccess ? 'Copied!' : 'Copy'}
 *       </button>
 *       {error && <span>Error: {error.message}</span>}
 *     </div>
 *   )
 * }
 * ```
 */
export default function useCopyToClipboard(): CopyToClipboardResult {
    const [copiedText, setCopiedText] = useState<string | null>(null)
    const [isSuccess, setIsSuccess] = useState(false)
    const [isCopying, setIsCopying] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    const copy = useCallback(async (text: string): Promise<boolean> => {
        if (!text) {
            setError(new Error('No text provided'))
            setIsSuccess(false)
            return false
        }

        setIsCopying(true)
        setError(null)

        try {
            // Try modern Clipboard API first
            if (
                typeof window !== 'undefined' &&
                window.navigator?.clipboard?.writeText
            ) {
                await window.navigator.clipboard.writeText(text)
                setCopiedText(text)
                setIsSuccess(true)
                setIsCopying(false)
                return true
            }

            // Fallback to legacy execCommand method
            if (typeof document === 'undefined') {
                throw new Error('Document is not available')
            }
            const textArea = document.createElement('textarea')
            textArea.value = text
            textArea.style.position = 'fixed'
            textArea.style.left = '-999999px'
            textArea.style.top = '-999999px'
            document.body.appendChild(textArea)
            textArea.focus()
            textArea.select()

            const successful = document.execCommand('copy')
            document.body.removeChild(textArea)

            if (successful) {
                setCopiedText(text)
                setIsSuccess(true)
                setIsCopying(false)
                return true
            } else {
                throw new Error('Copy command was unsuccessful')
            }
        } catch (err) {
            const error =
                err instanceof Error ? err : new Error('Failed to copy text')
            setError(error)
            setIsSuccess(false)
            setIsCopying(false)
            return false
        }
    }, [])

    const reset = useCallback(() => {
        setCopiedText(null)
        setIsSuccess(false)
        setIsCopying(false)
        setError(null)
    }, [])

    return {
        copiedText,
        copy,
        isSuccess,
        isCopying,
        error,
        reset,
    }
}
