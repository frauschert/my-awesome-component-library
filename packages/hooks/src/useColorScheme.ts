import { useState, useEffect } from 'react'

export type ColorScheme = 'light' | 'dark'

/**
 * Detects and tracks the user's color scheme preference (light or dark mode).
 * Listens to system/browser preference changes in real-time.
 *
 * @returns The current color scheme: 'light' or 'dark'
 *
 * @example
 * ```tsx
 * function ThemedComponent() {
 *   const colorScheme = useColorScheme()
 *   return <div className={colorScheme === 'dark' ? 'dark-theme' : 'light-theme'}>
 *     Current theme: {colorScheme}
 *   </div>
 * }
 * ```
 */
export default function useColorScheme(): ColorScheme {
    const getColorScheme = (): ColorScheme => {
        if (typeof window === 'undefined') {
            return 'light'
        }

        if (
            window.matchMedia &&
            window.matchMedia('(prefers-color-scheme: dark)').matches
        ) {
            return 'dark'
        }

        return 'light'
    }

    const [colorScheme, setColorScheme] = useState<ColorScheme>(getColorScheme)

    useEffect(() => {
        if (typeof window === 'undefined' || !window.matchMedia) {
            return
        }

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

        const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
            setColorScheme(e.matches ? 'dark' : 'light')
        }

        // Modern browsers
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleChange)
            return () => mediaQuery.removeEventListener('change', handleChange)
        }
        // Legacy browsers (Safari < 14)
        else if (mediaQuery.addListener) {
            mediaQuery.addListener(handleChange)
            return () => mediaQuery.removeListener(handleChange)
        }
    }, [])

    return colorScheme
}
