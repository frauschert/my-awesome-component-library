/**
 * CSS-in-JS utilities for creating dynamic styles
 */

import type { ThemeMode } from './tokens'
import { themes } from './tokens'

/**
 * Style object that can contain nested objects and media queries
 */
export type StyleObject = {
    [key: string]: string | number | StyleObject
}

/**
 * Base theme interface - contains properties common to both themes
 */
export interface BaseTheme {
    fontFamily: string
    backgroundColor: string
    backgroundColorAlt: string
    cardBackground: string
    textColor: string
    textColorMuted: string
    buttonTextColor: string
    buttonTextTransform: string
    buttonTextHoverColor: string
    buttonColor: string
    buttonBorder: string
    boxShadow: string
    shadowColor: string
    borderColor: string
    primaryColor: string
    primaryColorDark: string
    primaryTextColor: string
    dangerColor: string
    dangerBackgroundColor: string
    inputBackground: string
    headerBackgroundColor: string
    hoverBackgroundColor: string
    selectedBackgroundColor: string
    focusRing: string
    tooltipBackgroundColor: string
    tooltipTextColor: string
    badgeDefaultBackground: string
    badgeDefaultText: string
    badgeDefaultBorder: string
    badgePrimaryBackground: string
    badgePrimaryText: string
    badgePrimaryBorder: string
    badgeSuccessBackground: string
    badgeSuccessText: string
    badgeSuccessBorder: string
    badgeWarningBackground: string
    badgeWarningText: string
    badgeWarningBorder: string
    badgeDangerBackground: string
    badgeDangerText: string
    badgeDangerBorder: string
    badgeInfoBackground: string
    badgeInfoText: string
    badgeInfoBorder: string
}

/**
 * Creates a style function that has access to the theme
 */
export type StyleFunction<T = unknown> = (
    theme: BaseTheme,
    props?: T
) => StyleObject

/**
 * Convert style object to CSS string
 */
export function styleObjectToCss(styles: StyleObject, selector = ''): string {
    let css = ''
    const rules: string[] = []
    const nested: Record<string, StyleObject> = {}

    // Separate regular properties from nested selectors/media queries
    for (const [key, value] of Object.entries(styles)) {
        if (typeof value === 'object' && value !== null) {
            nested[key] = value
        } else {
            // Convert camelCase to kebab-case
            const cssKey = key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)
            rules.push(`  ${cssKey}: ${value};`)
        }
    }

    // Build CSS for current selector
    if (rules.length > 0) {
        css += selector
            ? `${selector} {\n${rules.join('\n')}\n}\n\n`
            : rules.join('\n') + '\n'
    }

    // Process nested selectors and media queries
    for (const [key, value] of Object.entries(nested)) {
        if (key.startsWith('@media')) {
            // Media query
            const nestedCss = styleObjectToCss(value, selector)
            css += `${key} {\n${nestedCss}}\n\n`
        } else if (key.startsWith('&')) {
            // Nested selector with parent reference
            const nestedSelector = key.replace('&', selector)
            css += styleObjectToCss(value, nestedSelector)
        } else {
            // Regular nested selector
            const nestedSelector = selector ? `${selector} ${key}` : key
            css += styleObjectToCss(value, nestedSelector)
        }
    }

    return css
}

/**
 * Create styles with theme support
 */
export function createStyles<T = unknown>(
    stylesFn: StyleFunction<T>,
    themeMode: ThemeMode = 'light'
) {
    const theme = themes[themeMode]

    return {
        /**
         * Get the style object for given props
         */
        getStyles: (props?: T): StyleObject => {
            return stylesFn(theme, props)
        },

        /**
         * Convert styles to CSS string
         */
        toCss: (props?: T, selector?: string): string => {
            const styles = stylesFn(theme, props)
            return styleObjectToCss(styles, selector)
        },

        /**
         * Get inline styles (only top-level properties)
         */
        toInlineStyles: (props?: T): React.CSSProperties => {
            const styles = stylesFn(theme, props)
            const inlineStyles: Record<string, string | number> = {}

            for (const [key, value] of Object.entries(styles)) {
                if (typeof value !== 'object') {
                    inlineStyles[key] = value
                }
            }

            return inlineStyles as React.CSSProperties
        },
    }
}

/**
 * Merge multiple style objects
 */
export function mergeStyles(...styles: StyleObject[]): StyleObject {
    const merged: StyleObject = {}

    for (const style of styles) {
        for (const [key, value] of Object.entries(style)) {
            if (
                typeof value === 'object' &&
                value !== null &&
                !Array.isArray(value)
            ) {
                // Recursively merge nested objects
                merged[key] = mergeStyles(
                    (merged[key] as StyleObject) || {},
                    value as StyleObject
                )
            } else {
                merged[key] = value
            }
        }
    }

    return merged
}

/**
 * Create responsive styles with breakpoint support
 */
export function responsive(styles: {
    base?: StyleObject
    xs?: StyleObject
    sm?: StyleObject
    md?: StyleObject
    lg?: StyleObject
    xl?: StyleObject
    '2xl'?: StyleObject
}): StyleObject {
    const breakpoints = {
        xs: '320px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
    }

    const result: StyleObject = {}

    if (styles.base) {
        Object.assign(result, styles.base)
    }

    const responsiveKeys = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const

    for (const breakpoint of responsiveKeys) {
        const breakpointStyles = styles[breakpoint]
        if (breakpointStyles) {
            result[`@media (min-width: ${breakpoints[breakpoint]})`] =
                breakpointStyles
        }
    }

    return result
}

/**
 * Create pseudo-selector styles
 */
export function pseudo(styles: {
    base?: StyleObject
    hover?: StyleObject
    focus?: StyleObject
    active?: StyleObject
    disabled?: StyleObject
    visited?: StyleObject
    checked?: StyleObject
}): StyleObject {
    const result: StyleObject = {}

    if (styles.base) {
        Object.assign(result, styles.base)
    }

    if (styles.hover) result['&:hover'] = styles.hover
    if (styles.focus) result['&:focus'] = styles.focus
    if (styles.active) result['&:active'] = styles.active
    if (styles.disabled) result['&:disabled'] = styles.disabled
    if (styles.visited) result['&:visited'] = styles.visited
    if (styles.checked) result['&:checked'] = styles.checked

    return result
}

/**
 * Create keyframe animation
 */
export function keyframes(
    name: string,
    frames: Record<string, StyleObject>
): string {
    let css = `@keyframes ${name} {\n`

    for (const [key, styles] of Object.entries(frames)) {
        css += `  ${key} {\n`
        for (const [prop, value] of Object.entries(styles)) {
            if (typeof value !== 'object') {
                const cssKey = prop.replace(
                    /[A-Z]/g,
                    (m) => `-${m.toLowerCase()}`
                )
                css += `    ${cssKey}: ${value};\n`
            }
        }
        css += `  }\n`
    }

    css += '}\n'
    return css
}

/**
 * CSS variable helper
 */
export function cssVar(name: string, fallback?: string): string {
    return fallback ? `var(--${name}, ${fallback})` : `var(--${name})`
}

/**
 * Calculate rem from px
 */
export function rem(px: number, base = 16): string {
    return `${px / base}rem`
}

/**
 * Calculate em from px
 */
export function em(px: number, base = 16): string {
    return `${px / base}em`
}
