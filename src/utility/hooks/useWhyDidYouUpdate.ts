import { useEffect, useRef } from 'react'

/**
 * Hook to debug why a component re-rendered by logging which props changed
 *
 * @param name - A name to identify the component in console logs
 * @param props - The props object to track
 *
 * @example
 * ```tsx
 * function MyComponent({ count, user, items }) {
 *   useWhyDidYouUpdate('MyComponent', { count, user, items })
 *
 *   return <div>...</div>
 * }
 *
 * // Console output when count changes:
 * // [why-did-you-update] MyComponent
 * // count: 1 -> 2
 * ```
 */
export default function useWhyDidYouUpdate<T extends Record<string, unknown>>(
    name: string,
    props: T
): void {
    // Store previous props in a ref
    const previousProps = useRef<T | undefined>(undefined)

    useEffect(() => {
        if (previousProps.current) {
            // Get all keys from current and previous props
            const allKeys = Object.keys({ ...previousProps.current, ...props })

            // Track what changed
            const changedProps: Record<string, { from: unknown; to: unknown }> =
                {}

            allKeys.forEach((key) => {
                const prevValue = previousProps.current
                    ? previousProps.current[key as keyof T]
                    : undefined
                const currentValue = props[key]

                // Compare values
                if (prevValue !== currentValue) {
                    changedProps[key] = {
                        from: prevValue,
                        to: currentValue,
                    }
                }
            })

            // Log changes if any occurred
            if (Object.keys(changedProps).length > 0) {
                // eslint-disable-next-line no-console
                console.log('[why-did-you-update]', name)
                Object.entries(changedProps).forEach(([key, value]) => {
                    // eslint-disable-next-line no-console
                    console.log(`  ${key}:`, value.from, '->', value.to)
                })
            }
        }

        // Update previous props for next comparison
        previousProps.current = props
    })
}
