import React, { useContext } from 'react'
import { Theme, ThemeContext, themes } from './ThemeContext'

const ThemeSwitcher = () => {
    const { theme, setTheme } = useContext(ThemeContext)
    const handleOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault()
        setTheme?.(e.target.value as Theme)
    }

    return (
        <>
            <h1>{theme === 'dark' ? '🌙' : '🌞'}</h1>
            <select className={theme} onChange={handleOnChange}>
                {Object.values(themes).map((themeKey) => (
                    <option value={themeKey}>{themeKey}</option>
                ))}
            </select>
        </>
    )
}

export default ThemeSwitcher
