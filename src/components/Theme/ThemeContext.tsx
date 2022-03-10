import { createContext } from 'react'

export const themes = {
    light: 'light',
    dark: 'dark',
    purple: 'purple',
} as const

export type ThemeKey = keyof typeof themes
export type ThemeName = typeof themes[ThemeKey]

export type ThemeContextProps = {
    theme: ThemeName | undefined
    setTheme: (theme: ThemeKey) => void
}

export const ThemeContext = createContext<Partial<ThemeContextProps>>({})
