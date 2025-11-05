import { useEffect, useRef, useCallback } from 'react'

/**
 * Hook that returns a function to check if the component is currently mounted.
 * Useful for preventing state updates on unmounted components, which can cause memory leaks.
 *
 * @returns Function that returns true if component is mounted, false otherwise
 *
 * @example
 * ```tsx
 * function DataFetcher() {
 *   const [data, setData] = useState(null)
 *   const isMounted = useIsMounted()
 *
 *   useEffect(() => {
 *     fetchData().then(result => {
 *       if (isMounted()) {
 *         setData(result)
 *       }
 *     })
 *   }, [])
 *
 *   return <div>{data}</div>
 * }
 * ```
 */
export default function useIsMounted(): () => boolean {
    const isMountedRef = useRef(false)

    useEffect(() => {
        isMountedRef.current = true

        return () => {
            isMountedRef.current = false
        }
    }, [])

    const isMounted = useCallback(() => isMountedRef.current, [])

    return isMounted
}
