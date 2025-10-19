import React, { useEffect } from 'react'
import { useTheme } from './ThemeContext'

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
    const [theme] = useTheme((s) => s.theme)

    useEffect(() => {
        console.log('ThemeWrapper: Applying theme class:', `theme--${theme}`)
        document.documentElement.classList.remove('theme--light', 'theme--dark')
        document.documentElement.classList.add(`theme--${theme}`)
        console.log(
            'ThemeWrapper: Document classes:',
            document.documentElement.className
        )

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
