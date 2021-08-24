import { createContext } from 'react'

export const themes = {
    light: 'light',
    dark: 'dark',
} as const

export type Theme = keyof typeof themes

export type ThemeContextProps = {
    theme: Theme | undefined
    setTheme: (theme: Theme) => void
}

export const ThemeContext = createContext<Partial<ThemeContextProps>>({})
