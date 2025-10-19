import React, { useState, useRef, useEffect } from 'react'
import { classNames } from '../../utility/classnames'
import './ColorPicker.scss'

export interface ColorPickerProps {
    /** Selected color value (hex format) */
    value?: string
    /** Callback when color changes */
    onChange?: (color: string) => void
    /** Preset color palette */
    presets?: string[]
    /** Whether to show recent colors */
    showRecent?: boolean
    /** Maximum number of recent colors to store */
    maxRecent?: number
    /** Label for the input */
    label?: string
    /** Error message */
    error?: string
    /** Helper text */
    helperText?: string
    /** Whether the field is required */
    required?: boolean
    /** Whether the field is disabled */
    disabled?: boolean
    /** Input size */
    size?: 'small' | 'medium' | 'large'
    /** Custom className */
    className?: string
    /** Whether to show the color input field */
    showInput?: boolean
}

const DEFAULT_PRESETS = [
    '#000000',
    '#ffffff',
    '#ef4444',
    '#f97316',
    '#f59e0b',
    '#eab308',
    '#84cc16',
    '#22c55e',
    '#10b981',
    '#14b8a6',
    '#06b6d4',
    '#0ea5e9',
    '#3b82f6',
    '#6366f1',
    '#8b5cf6',
    '#a855f7',
    '#d946ef',
    '#ec4899',
]

export const ColorPicker: React.FC<ColorPickerProps> = ({
    value = '#000000',
    onChange,
    presets = DEFAULT_PRESETS,
    showRecent = true,
    maxRecent = 8,
    label,
    error,
    helperText,
    required = false,
    disabled = false,
    size = 'medium',
    className,
    showInput = true,
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [recentColors, setRecentColors] = useState<string[]>([])
    const [inputValue, setInputValue] = useState(value)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setInputValue(value)
    }, [value])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
            return () =>
                document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    const handleColorChange = (color: string) => {
        setInputValue(color)
        onChange?.(color)

        // Add to recent colors
        if (showRecent && color !== value) {
            setRecentColors((prev) => {
                const filtered = prev.filter((c) => c !== color)
                return [color, ...filtered].slice(0, maxRecent)
            })
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setInputValue(newValue)

        // Validate hex color
        if (/^#[0-9A-Fa-f]{6}$/.test(newValue)) {
            handleColorChange(newValue)
        }
    }

    const handleSwatchClick = (color: string) => {
        handleColorChange(color)
        setIsOpen(false)
    }

    const inputId = `colorpicker-${Math.random().toString(36).substr(2, 9)}`

    return (
        <div
            ref={containerRef}
            className={classNames(
                'colorpicker',
                `colorpicker--${size}`,
                {
                    'colorpicker--error': !!error,
                    'colorpicker--disabled': disabled,
                    'colorpicker--open': isOpen,
                },
                className
            )}
        >
            {label && (
                <label htmlFor={inputId} className="colorpicker__label">
                    {label}
                    {required && (
                        <span className="colorpicker__required">*</span>
                    )}
                </label>
            )}
            <div className="colorpicker__input-wrapper">
                <button
                    type="button"
                    className="colorpicker__swatch"
                    style={{ backgroundColor: value }}
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    disabled={disabled}
                    aria-label="Open color picker"
                />
                {showInput && (
                    <input
                        id={inputId}
                        type="text"
                        className="colorpicker__input"
                        value={inputValue}
                        onChange={handleInputChange}
                        disabled={disabled}
                        placeholder="#000000"
                        maxLength={7}
                        aria-label={label || 'Color value'}
                        aria-required={required}
                        aria-invalid={!!error}
                    />
                )}
                <input
                    type="color"
                    className="colorpicker__native"
                    value={value}
                    onChange={(e) => handleColorChange(e.target.value)}
                    disabled={disabled}
                    aria-label="Pick color"
                />
            </div>
            {isOpen && (
                <div className="colorpicker__dropdown">
                    {showRecent && recentColors.length > 0 && (
                        <div className="colorpicker__section">
                            <div className="colorpicker__section-title">
                                Recent
                            </div>
                            <div className="colorpicker__palette">
                                {recentColors.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        className={classNames(
                                            'colorpicker__palette-swatch',
                                            {
                                                'colorpicker__palette-swatch--selected':
                                                    color === value,
                                            }
                                        )}
                                        style={{ backgroundColor: color }}
                                        onClick={() => handleSwatchClick(color)}
                                        aria-label={color}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                    {presets.length > 0 && (
                        <div className="colorpicker__section">
                            <div className="colorpicker__section-title">
                                Presets
                            </div>
                            <div className="colorpicker__palette">
                                {presets.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        className={classNames(
                                            'colorpicker__palette-swatch',
                                            {
                                                'colorpicker__palette-swatch--selected':
                                                    color === value,
                                            }
                                        )}
                                        style={{ backgroundColor: color }}
                                        onClick={() => handleSwatchClick(color)}
                                        aria-label={color}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
            {error && (
                <div className="colorpicker__error" role="alert">
                    {error}
                </div>
            )}
            {helperText && !error && (
                <div className="colorpicker__helper-text">{helperText}</div>
            )}
        </div>
    )
}

export default ColorPicker
