import { useState, useCallback } from 'react'

export interface UseSpinnerReturn {
    /** Current loading state */
    loading: boolean
    /** Set loading state manually */
    setLoading: (loading: boolean) => void
    /** Wrap a promise to automatically manage loading state */
    withSpinner: <T>(promise: Promise<T>) => Promise<T>
}

/**
 * Hook for managing loading states with automatic spinner control
 *
 * @example
 * ```tsx
 * const { loading, withSpinner } = useSpinner()
 *
 * const handleSubmit = async () => {
 *     await withSpinner(api.saveData(data))
 * }
 *
 * return (
 *     <div>
 *         {loading && <SpinCoin />}
 *         <button onClick={handleSubmit}>Submit</button>
 *     </div>
 * )
 * ```
 */
export function useSpinner(initialLoading = false): UseSpinnerReturn {
    const [loading, setLoading] = useState(initialLoading)

    const withSpinner = useCallback(
        async <T>(promise: Promise<T>): Promise<T> => {
            setLoading(true)
            try {
                const result = await promise
                return result
            } finally {
                setLoading(false)
            }
        },
        []
    )

    return { loading, setLoading, withSpinner }
}
