import React, { FC, useReducer } from 'react'
import { ThemeContext, Theme } from './ThemeContext'
import './themes.css'

const initialState: Theme = 'light'

const themeReducer = (state: Theme, theme: Theme): Theme => {
    switch (theme) {
        case 'light':
            return 'light'
        case 'dark':
            return 'dark'
        default:
            return state
    }
}

const ThemeProvider: FC = ({ children }) => {
    const [theme, setTheme] = useReducer(themeReducer, initialState)

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeProvider
