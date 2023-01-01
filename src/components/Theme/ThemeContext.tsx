import { createContext } from '../../utility/createContext'

export const themes = {
    light: 'light',
    dark: 'dark',
} as const

export type ThemeKey = keyof typeof themes

type ThemeContextProps = { theme: ThemeKey }
export const { Provider, useStore: useTheme } =
    createContext<ThemeContextProps>({ theme: 'light' })
