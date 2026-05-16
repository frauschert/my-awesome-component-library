/**
 * React hook for using theme-based styles
 */

import { useMemo } from 'react'
import { createStyles, type StyleFunction } from './createStyles'
import type { ThemeMode } from './tokens'

/**
 * Hook to create theme-aware styles
 *
 * @example
 * ```tsx
 * const MyComponent = ({ variant }: { variant: 'primary' | 'secondary' }) => {
 *   const styles = useThemeStyles(
 *     (theme, props) => ({
 *       backgroundColor: props.variant === 'primary'
 *         ? theme.primaryColor
 *         : theme.backgroundColor,
 *       color: theme.textColor,
 *       padding: '1rem',
 *       '&:hover': {
 *         backgroundColor: theme.hoverBackgroundColor,
 *       },
 *     }),
 *     'light',
 *     { variant }
 *   )
 *
 *   return <div style={styles.toInlineStyles()}>Content</div>
 * }
 * ```
 */
export function useThemeStyles<T = unknown>(
    stylesFn: StyleFunction<T>,
    themeMode: ThemeMode = 'light',
    props?: T
) {
    return useMemo(() => {
        const stylesInstance = createStyles(stylesFn, themeMode)

        return {
            styles: stylesInstance.getStyles(props),
            css: stylesInstance.toCss(props),
            inlineStyles: stylesInstance.toInlineStyles(props),
        }
    }, [stylesFn, themeMode, props])
}

/**
 * Hook to get current theme mode from context
 * Note: This requires ThemeProvider to be in the component tree
 */
export function useThemeMode(): ThemeMode {
    // This is a placeholder. In a real implementation, this would use
    // React context to get the current theme from ThemeProvider

    // For now, check if there's a theme class on document body
    if (typeof document !== 'undefined') {
        const isDark = document.body.classList.contains('theme--dark')
        return isDark ? 'dark' : 'light'
    }

    return 'light'
}
