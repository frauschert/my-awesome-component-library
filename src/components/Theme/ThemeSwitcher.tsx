import React from 'react'
import { ThemeKey, themes, useTheme } from './ThemeContext'

const ThemeSwitcher = () => {
    const [{ theme }, setTheme] = useTheme()
    const handleOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault()
        setTheme?.({ theme: e.target.value as ThemeKey })
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
