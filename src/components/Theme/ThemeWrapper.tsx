import React, { useEffect } from 'react'
import { useTheme } from './ThemeContext'

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
    const [theme] = useTheme((s) => s.theme)

    useEffect(() => {
        document.documentElement.classList.remove('theme--light', 'theme--dark')
        document.documentElement.classList.add(`theme--${theme}`)

        // Cleanup on unmount
        return () => {
            document.documentElement.classList.remove(
                'theme--light',
                'theme--dark'
            )
        }
    }, [theme])

    return <>{children}</>
}
