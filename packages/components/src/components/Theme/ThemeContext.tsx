import { createContext } from '../../utility/createContext'

export const themes = {
    light: 'light',
    dark: 'dark',
    auto: 'auto', // Follows system preference
} as const

export type ThemeKey = keyof typeof themes

type ThemeContextProps = {
    theme: ThemeKey
    resolvedTheme: 'light' | 'dark' // The actual theme being used (resolves 'auto')
    systemTheme: 'light' | 'dark' // The system preference
}

export const { Provider, useStore: useTheme } =
    createContext<ThemeContextProps>({
        theme: 'light',
        resolvedTheme: 'light',
        systemTheme: 'light',
    })
