import { useState, useCallback } from 'react'

/**
 * Options for useClipboard hook
 */
export interface UseClipboardOptions {
    /**
     * Duration in ms to keep success state
     * @default 2000
     */
    successDuration?: number
    /**
     * Callback when copy succeeds
     */
    onSuccess?: (text: string) => void
    /**
     * Callback when copy fails
     */
    onError?: (error: Error) => void
}

/**
 * Return type for useClipboard hook
 */
export interface UseClipboardReturn {
    /** Current clipboard text (from read operation) */
    text: string | null
    /** Whether copy operation was successful */
    copied: boolean
    /** Error if operation failed */
    error: Error | null
    /** Whether API is supported */
    isSupported: boolean
    /** Copy text to clipboard */
    copy: (text: string) => Promise<void>
    /** Read text from clipboard */
    read: () => Promise<void>
    /** Clear clipboard (writes empty string) */
    clear: () => Promise<void>
}

/**
 * Hook for reading from and writing to the system clipboard.
 * Provides both modern Clipboard API and fallback methods.
 *
 * @param options - Configuration options
 * @returns Clipboard state and control functions
 *
 * @example
 * ```tsx
 * function CopyButton() {
 *   const { copy, copied } = useClipboard()
 *
 *   return (
 *     <button onClick={() => copy('Hello World')}>
 *       {copied ? 'Copied!' : 'Copy'}
 *     </button>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Read from clipboard
 * function PasteButton() {
 *   const { text, read } = useClipboard()
 *
 *   return (
 *     <div>
 *       <button onClick={read}>Paste</button>
 *       {text && <p>Pasted: {text}</p>}
 *     </div>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With callbacks
 * const { copy } = useClipboard({
 *   onSuccess: (text) => console.log('Copied:', text),
 *   onError: (err) => console.error('Failed:', err),
 *   successDuration: 3000
 * })
 * ```
 */
export function useClipboard(
    options: UseClipboardOptions = {}
): UseClipboardReturn {
    const { successDuration = 2000, onSuccess, onError } = options

    const [text, setText] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    // Check if Clipboard API is supported
    const isSupported =
        typeof window !== 'undefined' &&
        typeof window.navigator !== 'undefined' &&
        'clipboard' in window.navigator

    // Copy text to clipboard
    const copy = useCallback(
        async (value: string) => {
            if (!isSupported) {
                const err = new Error('Clipboard API not supported')
                setError(err)
                onError?.(err)
                return
            }

            try {
                // Try modern Clipboard API first
                await window.navigator.clipboard.writeText(value)

                setText(value)
                setError(null)
                setCopied(true)
                onSuccess?.(value)

                // Reset copied state after duration
                setTimeout(() => {
                    setCopied(false)
                }, successDuration)
            } catch {
                // Fallback to execCommand for older browsers
                try {
                    const textarea = document.createElement('textarea')
                    textarea.value = value
                    textarea.style.position = 'fixed'
                    textarea.style.opacity = '0'
                    document.body.appendChild(textarea)
                    textarea.select()

                    const success = document.execCommand('copy')
                    document.body.removeChild(textarea)

                    if (success) {
                        setText(value)
                        setError(null)
                        setCopied(true)
                        onSuccess?.(value)

                        setTimeout(() => {
                            setCopied(false)
                        }, successDuration)
                    } else {
                        throw new Error('Copy command failed')
                    }
                } catch (fallbackErr) {
                    const finalErr =
                        fallbackErr instanceof Error
                            ? fallbackErr
                            : new Error('Failed to copy to clipboard')
                    setError(finalErr)
                    setCopied(false)
                    onError?.(finalErr)
                }
            }
        },
        [isSupported, successDuration, onSuccess, onError]
    )

    // Read text from clipboard
    const read = useCallback(async () => {
        if (!isSupported) {
            const err = new Error('Clipboard API not supported')
            setError(err)
            onError?.(err)
            return
        }

        try {
            const clipboardText = await window.navigator.clipboard.readText()
            setText(clipboardText)
            setError(null)
        } catch (err) {
            const readErr =
                err instanceof Error
                    ? err
                    : new Error('Failed to read from clipboard')
            setError(readErr)
            setText(null)
            onError?.(readErr)
        }
    }, [isSupported, onError])

    // Clear clipboard
    const clear = useCallback(async () => {
        if (!isSupported) {
            const err = new Error('Clipboard API not supported')
            setError(err)
            onError?.(err)
            return
        }

        try {
            await window.navigator.clipboard.writeText('')
            setText('')
            setError(null)
        } catch (err) {
            const clearErr =
                err instanceof Error
                    ? err
                    : new Error('Failed to clear clipboard')
            setError(clearErr)
            onError?.(clearErr)
        }
    }, [isSupported, onError])

    return {
        text,
        copied,
        error,
        isSupported,
        copy,
        read,
        clear,
    }
}

export default useClipboard
