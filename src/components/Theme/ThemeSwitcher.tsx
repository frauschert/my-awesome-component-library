import React, { useContext } from 'react'
import { ThemeKey, ThemeContext, themes } from './ThemeContext'

const ThemeSwitcher = () => {
    const { theme, setTheme } = useContext(ThemeContext)
    const handleOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault()
        setTheme?.(e.target.value as ThemeKey)
    }

    return (
        <select className={theme} onChange={handleOnChange}>
            {Object.entries(themes).map(([key, value]) => (
                <option key={key} value={value}>
                    {key}
                </option>
            ))}
        </select>
    )
}

export default ThemeSwitcher
