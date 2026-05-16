import React, { useEffect, useState } from 'react'
import { ThemeKey, useTheme } from './ThemeContext'

const THEME_STORAGE_KEY = 'app-theme'

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
    const [state, setState] = useTheme()
    const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light')

    // Detect system theme preference
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

        const updateSystemTheme = (e: MediaQueryList | MediaQueryListEvent) => {
            const newSystemTheme = e.matches ? 'dark' : 'light'
            setSystemTheme(newSystemTheme)
            setState?.((prev) => ({ ...prev, systemTheme: newSystemTheme }))
        }

        // Set initial system theme
        updateSystemTheme(mediaQuery)

        // Listen for changes
        const listener = (e: MediaQueryListEvent) => updateSystemTheme(e)
        mediaQuery.addEventListener('change', listener)

        return () => mediaQuery.removeEventListener('change', listener)
    }, [setState])

    // Load theme from localStorage on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeKey
        if (
            savedTheme &&
            (savedTheme === 'light' ||
                savedTheme === 'dark' ||
                savedTheme === 'auto')
        ) {
            setState?.({
                theme: savedTheme,
                resolvedTheme: 'light',
                systemTheme: 'light',
            })
        }
    }, [setState])

    // Calculate resolved theme
    useEffect(() => {
        const resolvedTheme = state.theme === 'auto' ? systemTheme : state.theme
        setState?.((prev) => ({ ...prev, resolvedTheme }))
    }, [state.theme, systemTheme, setState])

    // Apply theme to DOM and save to localStorage
    useEffect(() => {
        const resolvedTheme = state.theme === 'auto' ? systemTheme : state.theme

        // Remove all theme classes
        document.documentElement.classList.remove('theme--light', 'theme--dark')

        // Add the resolved theme class
        document.documentElement.classList.add(`theme--${resolvedTheme}`)

        // Save to localStorage
        localStorage.setItem(THEME_STORAGE_KEY, state.theme)

        // Update meta theme-color for mobile browsers
        const metaThemeColor = document.querySelector(
            'meta[name="theme-color"]'
        )
        if (metaThemeColor) {
            metaThemeColor.setAttribute(
                'content',
                resolvedTheme === 'dark' ? '#1e1e1e' : '#ffffff'
            )
        }

        // Cleanup on unmount
        return () => {
            document.documentElement.classList.remove(
                'theme--light',
                'theme--dark'
            )
        }
    }, [state.theme, systemTheme])

    return <>{children}</>
}
