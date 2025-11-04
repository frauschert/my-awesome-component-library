import { useRef } from 'react'

/**
 * useIsFirstRender returns true on the first render and false on subsequent renders.
 * Useful for conditional logic that should only run after the initial render.
 *
 * @returns boolean - true if this is the first render, false otherwise
 *
 * @example
 * ```tsx
 * function Component() {
 *   const isFirstRender = useIsFirstRender()
 *
 *   useEffect(() => {
 *     if (isFirstRender) {
 *       console.log('Initial mount')
 *     } else {
 *       console.log('Subsequent update')
 *     }
 *   })
 * }
 * ```
 */
export default function useIsFirstRender(): boolean {
    const isFirst = useRef(true)

    if (isFirst.current) {
        isFirst.current = false
        return true
    }

    return false
}
