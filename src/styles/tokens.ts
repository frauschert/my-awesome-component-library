/**
 * Design tokens exported from SCSS for CSS-in-JS usage
 * These tokens mirror the values defined in _colors.scss and _themes.scss
 */

export const colors = {
    primary: {
        base: '#384ea9',
        light: '#e4efff',
        dark: '#273677',
    },
    accent: {
        base: '#f08110',
        light: '#ff8100',
        dark: '#e47f17',
    },
    info: {
        base: '#2563eb',
        light: '#dbeafe',
        dark: '#1d4ed8',
    },
    success: {
        base: '#16a34a',
        light: '#dcfce7',
        dark: '#166534',
    },
    warn: {
        base: '#d97706',
        light: '#fef3c7',
        dark: '#92400e',
    },
    error: {
        base: '#dc2626',
        light: '#fee2e2',
        dark: '#991b1b',
    },
    foreground: {
        base: '#393939',
        light: '#6e6e6e',
        dark: '#111',
    },
    background: {
        base: '#f8f5f5',
        light: '#fff',
        dark: '#ddd',
    },
} as const

export const contrast = {
    dark: {
        primary: 'rgb(255, 255, 255)',
        secondary: 'rgba(255, 255, 255, 0.7)',
        disabled: 'rgba(255, 255, 255, 0.5)',
        hint: 'rgba(255, 255, 255, 0.12)',
    },
    light: {
        primary: 'rgba(0, 0, 0, 0.87)',
        secondary: 'rgba(0, 0, 0, 0.54)',
        disabled: 'rgba(0, 0, 0, 0.38)',
        hint: 'rgba(0, 0, 0, 0.12)',
    },
} as const

export const typography = {
    fontFamily: {
        base: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, "Cascadia Code", "Liberation Mono", "Courier New", monospace',
    },
    fontSize: {
        xs: '0.75rem', // 12px
        sm: '0.875rem', // 14px
        base: '1rem', // 16px
        lg: '1.125rem', // 18px
        xl: '1.25rem', // 20px
        '2xl': '1.5rem', // 24px
        '3xl': '1.875rem', // 30px
        '4xl': '2.25rem', // 36px
        '5xl': '3rem', // 48px
        '6xl': '3.75rem', // 60px
    },
    fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
    },
    lineHeight: {
        none: 1,
        tight: 1.25,
        snug: 1.375,
        normal: 1.5,
        relaxed: 1.625,
        loose: 2,
    },
    letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0em',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em',
    },
} as const

export const spacing = {
    0: '0',
    1: '0.25rem', // 4px
    2: '0.5rem', // 8px
    3: '0.75rem', // 12px
    4: '1rem', // 16px
    5: '1.25rem', // 20px
    6: '1.5rem', // 24px
    8: '2rem', // 32px
    10: '2.5rem', // 40px
    12: '3rem', // 48px
    16: '4rem', // 64px
    20: '5rem', // 80px
    24: '6rem', // 96px
    32: '8rem', // 128px
} as const

export const borderRadius = {
    none: '0',
    sm: '0.125rem', // 2px
    base: '0.25rem', // 4px
    md: '0.375rem', // 6px
    lg: '0.5rem', // 8px
    xl: '0.75rem', // 12px
    '2xl': '1rem', // 16px
    '3xl': '1.5rem', // 24px
    full: '9999px',
} as const

export const shadows = {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
} as const

export const breakpoints = {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
} as const

export const zIndex = {
    hide: -1,
    base: 0,
    dropdown: 1000,
    sticky: 1100,
    fixed: 1200,
    modalBackdrop: 1300,
    modal: 1400,
    popover: 1500,
    tooltip: 1600,
    toast: 1700,
} as const

export const transitions = {
    duration: {
        fast: '150ms',
        base: '200ms',
        slow: '300ms',
        slower: '500ms',
    },
    timing: {
        ease: 'ease',
        easeIn: 'ease-in',
        easeOut: 'ease-out',
        easeInOut: 'ease-in-out',
        linear: 'linear',
    },
} as const

/**
 * Light theme tokens
 */
export const lightTheme = {
    fontFamily: typography.fontFamily.base,
    backgroundColor: '#ffffff',
    backgroundColorAlt: '#f8f9fa',
    cardBackground: '#ffffff',
    textColor: '#408bbd',
    textColorMuted: '#6c757d',
    buttonTextColor: '#408bbd',
    buttonTextTransform: 'none' as const,
    buttonTextHoverColor: '#61b0e7',
    buttonColor: '#fff',
    buttonBorder: '2px solid #408bbd',
    boxShadow: '0 0 20px rgba(255, 255, 255, 0.15)',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    borderColor: '#dee2e6',
    primaryColor: '#408bbd',
    primaryColorDark: '#306a94',
    primaryTextColor: '#ffffff',
    dangerColor: '#dc3545',
    dangerBackgroundColor: '#f8d7da',
    inputBackground: '#ffffff',
    headerBackgroundColor: '#f8f9fa',
    hoverBackgroundColor: '#e9ecef',
    selectedBackgroundColor: '#e7f3ff',
    focusRing: 'rgba(64, 139, 189, 0.25)',
    tooltipBackgroundColor: '#333',
    tooltipTextColor: '#ffffff',
    badgeDefaultBackground: '#e9ecef',
    badgeDefaultText: '#495057',
    badgeDefaultBorder: '#dee2e6',
    badgePrimaryBackground: '#408bbd',
    badgePrimaryText: '#ffffff',
    badgePrimaryBorder: '#408bbd',
    badgeSuccessBackground: '#28a745',
    badgeSuccessText: '#ffffff',
    badgeSuccessBorder: '#28a745',
    badgeWarningBackground: '#ffc107',
    badgeWarningText: '#212529',
    badgeWarningBorder: '#ffc107',
    badgeDangerBackground: '#dc3545',
    badgeDangerText: '#ffffff',
    badgeDangerBorder: '#dc3545',
    badgeInfoBackground: '#17a2b8',
    badgeInfoText: '#ffffff',
    badgeInfoBorder: '#17a2b8',
} as const

/**
 * Dark theme tokens
 */
export const darkTheme = {
    fontFamily: typography.fontFamily.base,
    backgroundColor: '#222',
    backgroundColorAlt: '#2a2a2a',
    cardBackground: '#2a2a2a',
    textColor: '#ddd',
    textColorMuted: '#999',
    buttonTextColor: '#aaa',
    buttonTextTransform: 'uppercase' as const,
    buttonTextHoverColor: '#ddd',
    buttonColor: '#333',
    buttonBorder: '1px solid #333',
    boxShadow: '0 0 20px rgba(34, 34, 34, 0.15)',
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    borderColor: '#444',
    primaryColor: '#61b0e7',
    primaryColorDark: '#408bbd',
    primaryTextColor: '#222',
    dangerColor: '#ff6b6b',
    dangerBackgroundColor: '#4a2c2c',
    inputBackground: '#333',
    headerBackgroundColor: '#2a2a2a',
    hoverBackgroundColor: '#333',
    selectedBackgroundColor: '#2a3f4f',
    focusRing: 'rgba(97, 176, 231, 0.25)',
    tooltipBackgroundColor: '#f8f9fa',
    tooltipTextColor: '#222',
    badgeDefaultBackground: '#495057',
    badgeDefaultText: '#f8f9fa',
    badgeDefaultBorder: '#6c757d',
    badgePrimaryBackground: '#61b0e7',
    badgePrimaryText: '#222',
    badgePrimaryBorder: '#61b0e7',
    badgeSuccessBackground: '#51cf66',
    badgeSuccessText: '#222',
    badgeSuccessBorder: '#51cf66',
    badgeWarningBackground: '#ffd43b',
    badgeWarningText: '#222',
    badgeWarningBorder: '#ffd43b',
    badgeDangerBackground: '#ff6b6b',
    badgeDangerText: '#ffffff',
    badgeDangerBorder: '#ff6b6b',
    badgeInfoBackground: '#22b8cf',
    badgeInfoText: '#222',
    badgeInfoBorder: '#22b8cf',
} as const

/**
 * Combined theme object
 */
export const themes = {
    light: lightTheme,
    dark: darkTheme,
} as const

/**
 * Type definitions for themes
 */
export type ThemeMode = keyof typeof themes
export type LightTheme = typeof lightTheme
export type DarkTheme = typeof darkTheme
export type Theme = LightTheme | DarkTheme
export type ThemeKey = keyof LightTheme

/**
 * Helper function to get theme value
 */
export function getThemeValue(theme: ThemeMode, key: ThemeKey): string {
    return themes[theme][key]
}

/**
 * Default export containing all tokens
 */
const tokens = {
    colors,
    contrast,
    typography,
    spacing,
    borderRadius,
    shadows,
    breakpoints,
    zIndex,
    transitions,
    themes,
    lightTheme,
    darkTheme,
}

export default tokens
