import React, { ReactNode, useState } from 'react'
import { ThemeContext, ThemeKey, themes } from './ThemeContext'

const initialState: ThemeKey = 'light'

type ThemeProviderProps = {
    children: ReactNode[]
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const [theme, setTheme] = useState<ThemeKey>(initialState)

    return (
        <ThemeContext.Provider value={{ theme: themes[theme], setTheme }}>
            <div className={`theme--${theme}`}>{children}</div>
        </ThemeContext.Provider>
    )
}

export default ThemeProvider
