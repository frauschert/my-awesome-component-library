import React from 'react'
import { useTheme } from './ThemeContext'

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
    const [{ theme }] = useTheme()
    return <div className={`theme--${theme}`}>{children}</div>
}
