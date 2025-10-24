import React from 'react'
import { ThemeKey, themes, useTheme } from './ThemeContext'
import './theme-switcher.scss'

type ThemeSwitcherProps = {
    variant?: 'select' | 'buttons' | 'toggle'
    showLabels?: boolean
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
    variant = 'buttons',
    showLabels = true,
    size = 'md',
    className = '',
}) => {
    const [{ theme, resolvedTheme }, setTheme] = useTheme()

    const handleChange = (newTheme: ThemeKey) => {
        setTheme?.({
            theme: newTheme,
            resolvedTheme,
            systemTheme: resolvedTheme,
        })
    }

    if (variant === 'select') {
        return (
            <select
                className={`theme-switcher-select theme-switcher-select--${size} ${className}`}
                value={theme}
                onChange={(e) => handleChange(e.target.value as ThemeKey)}
                aria-label="Select theme"
            >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
            </select>
        )
    }

    if (variant === 'toggle') {
        // Simple light/dark toggle (ignores auto)
        const isLight = resolvedTheme === 'light'
        return (
            <button
                className={`theme-switcher-toggle theme-switcher-toggle--${size} ${className}`}
                onClick={() => handleChange(isLight ? 'dark' : 'light')}
                aria-label={`Switch to ${isLight ? 'dark' : 'light'} theme`}
                title={`Switch to ${isLight ? 'dark' : 'light'} theme`}
            >
                {isLight ? (
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                ) : (
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <circle cx="12" cy="12" r="5" />
                        <line x1="12" y1="1" x2="12" y2="3" />
                        <line x1="12" y1="21" x2="12" y2="23" />
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                        <line x1="1" y1="12" x2="3" y2="12" />
                        <line x1="21" y1="12" x2="23" y2="12" />
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                    </svg>
                )}
            </button>
        )
    }

    // Buttons variant (default)
    return (
        <div
            className={`theme-switcher theme-switcher--${size} ${className}`}
            role="group"
            aria-label="Theme switcher"
        >
            {Object.entries(themes).map(([key, value]) => {
                const isActive = theme === value
                const Icon = getThemeIcon(value)
                return (
                    <button
                        key={key}
                        className={`theme-switcher__button ${
                            isActive ? 'theme-switcher__button--active' : ''
                        }`}
                        onClick={() => handleChange(value as ThemeKey)}
                        aria-label={`${key} theme`}
                        aria-pressed={isActive}
                        title={`${
                            key.charAt(0).toUpperCase() + key.slice(1)
                        } theme`}
                    >
                        <Icon />
                        {showLabels && (
                            <span className="theme-switcher__label">
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                            </span>
                        )}
                    </button>
                )
            })}
        </div>
    )
}

// Icon components for each theme
const getThemeIcon = (theme: string) => {
    switch (theme) {
        case 'light':
            return () => (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
            )
        case 'dark':
            return () => (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
            )
        case 'auto':
            return () => (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="9" y1="3" x2="9" y2="21" />
                </svg>
            )
        default:
            return () => null
    }
}

export default ThemeSwitcher
