import React, { FC, useState } from 'react'
import { ThemeContext, ThemeKey, themes } from './ThemeContext'

const initialState: ThemeKey = 'light'

const ThemeProvider: FC = ({ children }) => {
    const [theme, setTheme] = useState<ThemeKey>(initialState)

    return (
        <ThemeContext.Provider value={{ theme: themes[theme], setTheme }}>
            <div className={`theme--${theme}`}>{children}</div>
        </ThemeContext.Provider>
    )
}

export default ThemeProvider
