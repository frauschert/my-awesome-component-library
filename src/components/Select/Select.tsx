import React, { useRef, useState, useEffect } from 'react'
import './select.scss'
import Portal from '../Portal'
import { useTheme } from '../Theme/ThemeContext'

export type SelectOption = {
    value: string
    label: string
    disabled?: boolean
    group?: string
}

export type SelectSize = 'sm' | 'md' | 'lg'
export type SelectVariant = 'default' | 'filled' | 'outlined'

export interface SelectProps {
    options: SelectOption[]
    value?: string | string[]
    defaultValue?: string | string[]
    onChange?: (value: string | string[]) => void
    placeholder?: string
    disabled?: boolean
    multiple?: boolean
    searchable?: boolean
    clearable?: boolean
    size?: SelectSize
    variant?: SelectVariant
    error?: boolean
    helperText?: string
    label?: string
    required?: boolean
    maxHeight?: number
    renderOption?: (option: SelectOption) => React.ReactNode
    renderValue?: (value: string | string[]) => React.ReactNode
    className?: string
    id?: string
    name?: string
}

const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
    (
        {
            options,
            value: controlledValue,
            defaultValue,
            onChange,
            placeholder = 'Select...',
            disabled = false,
            multiple = false,
            searchable = false,
            clearable = false,
            size = 'md',
            variant = 'default',
            error = false,
            helperText,
            label,
            required = false,
            maxHeight = 300,
            renderOption,
            renderValue,
            className = '',
            id,
            name,
        },
        ref
    ) => {
        const [isOpen, setIsOpen] = useState(false)
        const [internalValue, setInternalValue] = useState<string | string[]>(
            defaultValue || (multiple ? [] : '')
        )
        const [searchTerm, setSearchTerm] = useState('')
        const [highlightedIndex, setHighlightedIndex] = useState(-1)
        const [dropdownPosition, setDropdownPosition] = useState<{
            top: number
            left: number
            width: number
        }>({ top: 0, left: 0, width: 0 })

        const containerRef = useRef<HTMLDivElement>(null)
        const searchInputRef = useRef<HTMLInputElement>(null)
        const dropdownRef = useRef<HTMLDivElement>(null)

        // Get theme from context, with selector to get just the theme value
        const [theme] = useTheme((state) => state.theme)

        const isControlled = controlledValue !== undefined
        const currentValue = isControlled ? controlledValue : internalValue

        // Filter options based on search term
        const filteredOptions = searchTerm
            ? options.filter((option) =>
                  option.label.toLowerCase().includes(searchTerm.toLowerCase())
              )
            : options

        // Group options if they have group property
        const groupedOptions = filteredOptions.reduce((acc, option) => {
            const group = option.group || '__default__'
            if (!acc[group]) acc[group] = []
            acc[group].push(option)
            return acc
        }, {} as Record<string, SelectOption[]>)

        const hasGroups = Object.keys(groupedOptions).length > 1

        // Get selected option(s)
        const selectedOptions = Array.isArray(currentValue)
            ? options.filter((opt) => currentValue.includes(opt.value))
            : options.find((opt) => opt.value === currentValue)

        // Handle value change
        const handleSelect = (optionValue: string) => {
            let newValue: string | string[]

            if (multiple) {
                const currentArray = Array.isArray(currentValue)
                    ? currentValue
                    : []
                newValue = currentArray.includes(optionValue)
                    ? currentArray.filter((v) => v !== optionValue)
                    : [...currentArray, optionValue]
            } else {
                newValue = optionValue
                setIsOpen(false)
            }

            if (!isControlled) {
                setInternalValue(newValue)
            }
            onChange?.(newValue)
            setSearchTerm('')
        }

        // Clear selection
        const handleClear = (e: React.MouseEvent) => {
            e.stopPropagation()
            const newValue = multiple ? [] : ''
            if (!isControlled) {
                setInternalValue(newValue)
            }
            onChange?.(newValue)
        }

        // Toggle dropdown
        const toggleDropdown = () => {
            if (disabled) return
            setIsOpen((prev) => !prev)
        }

        // Calculate dropdown position
        const updateDropdownPosition = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect()
                setDropdownPosition({
                    top: rect.bottom + window.scrollY,
                    left: rect.left + window.scrollX,
                    width: rect.width,
                })
            }
        }

        // Update position when opened
        useEffect(() => {
            if (isOpen) {
                updateDropdownPosition()
                if (searchable && searchInputRef.current) {
                    searchInputRef.current.focus()
                }
            } else {
                setSearchTerm('')
                setHighlightedIndex(-1)
            }
        }, [isOpen, searchable])

        // Handle click outside
        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (
                    isOpen &&
                    containerRef.current &&
                    !containerRef.current.contains(event.target as Node) &&
                    dropdownRef.current &&
                    !dropdownRef.current.contains(event.target as Node)
                ) {
                    setIsOpen(false)
                }
            }

            document.addEventListener('mousedown', handleClickOutside)
            return () =>
                document.removeEventListener('mousedown', handleClickOutside)
        }, [isOpen])

        // Keyboard navigation
        const handleKeyDown = (e: React.KeyboardEvent) => {
            if (disabled) return

            switch (e.key) {
                case 'Enter':
                case ' ':
                    if (!isOpen) {
                        e.preventDefault()
                        setIsOpen(true)
                    } else if (filteredOptions[highlightedIndex]) {
                        e.preventDefault()
                        handleSelect(filteredOptions[highlightedIndex].value)
                    }
                    break
                case 'Escape':
                    e.preventDefault()
                    setIsOpen(false)
                    break
                case 'ArrowDown':
                    e.preventDefault()
                    if (!isOpen) {
                        setIsOpen(true)
                    } else {
                        setHighlightedIndex((prev) =>
                            Math.min(prev + 1, filteredOptions.length - 1)
                        )
                    }
                    break
                case 'ArrowUp':
                    e.preventDefault()
                    if (isOpen) {
                        setHighlightedIndex((prev) => Math.max(prev - 1, 0))
                    }
                    break
                case 'Tab':
                    if (isOpen) {
                        setIsOpen(false)
                    }
                    break
            }
        }

        // Render display value
        const renderDisplayValue = () => {
            if (renderValue) {
                return renderValue(currentValue)
            }

            if (Array.isArray(currentValue)) {
                if (currentValue.length === 0) return placeholder
                return `${currentValue.length} selected`
            }

            if (!currentValue) return placeholder

            const selected = options.find((opt) => opt.value === currentValue)
            return selected?.label || placeholder
        }

        const hasValue = Array.isArray(currentValue)
            ? currentValue.length > 0
            : !!currentValue

        return (
            <div
                className={`select-container select-container--${size} ${className}`}
            >
                {label && (
                    <label
                        htmlFor={id}
                        className={`select-label ${
                            required ? 'select-label--required' : ''
                        }`}
                    >
                        {label}
                    </label>
                )}
                <div
                    ref={containerRef}
                    className={`select select--${variant} select--${size} ${
                        isOpen ? 'select--open' : ''
                    } ${disabled ? 'select--disabled' : ''} ${
                        error ? 'select--error' : ''
                    }`}
                >
                    <button
                        ref={ref}
                        type="button"
                        className="select__trigger"
                        onClick={toggleDropdown}
                        onKeyDown={handleKeyDown}
                        disabled={disabled}
                        aria-haspopup="listbox"
                        aria-expanded={isOpen}
                        aria-labelledby={label ? id : undefined}
                        id={id}
                    >
                        <span
                            className={`select__value ${
                                !hasValue ? 'select__value--placeholder' : ''
                            }`}
                        >
                            {renderDisplayValue()}
                        </span>
                        <div className="select__icons">
                            {clearable && hasValue && !disabled && (
                                <span
                                    className="select__clear"
                                    onClick={handleClear}
                                    role="button"
                                    aria-label="Clear selection"
                                >
                                    ✕
                                </span>
                            )}
                            <span
                                className={`select__arrow ${
                                    isOpen ? 'select__arrow--open' : ''
                                }`}
                            >
                                ▼
                            </span>
                        </div>
                    </button>

                    {isOpen && (
                        <Portal>
                            <div
                                ref={dropdownRef}
                                className={`select__dropdown theme--${theme}`}
                                style={{
                                    position: 'absolute',
                                    top: `${dropdownPosition.top}px`,
                                    left: `${dropdownPosition.left}px`,
                                    width: `${dropdownPosition.width}px`,
                                    maxHeight: `${maxHeight}px`,
                                }}
                                role="listbox"
                                aria-multiselectable={multiple}
                            >
                                {searchable && (
                                    <div className="select__search">
                                        <input
                                            ref={searchInputRef}
                                            type="text"
                                            className="select__search-input"
                                            placeholder="Search..."
                                            value={searchTerm}
                                            onChange={(e) =>
                                                setSearchTerm(e.target.value)
                                            }
                                            onKeyDown={(e) => {
                                                if (
                                                    e.key === 'ArrowDown' ||
                                                    e.key === 'ArrowUp'
                                                ) {
                                                    e.preventDefault()
                                                    handleKeyDown(e)
                                                }
                                            }}
                                        />
                                    </div>
                                )}

                                <div className="select__options">
                                    {filteredOptions.length === 0 ? (
                                        <div className="select__empty">
                                            No options found
                                        </div>
                                    ) : hasGroups ? (
                                        Object.entries(groupedOptions).map(
                                            ([group, groupOptions]) => (
                                                <div
                                                    key={group}
                                                    className="select__group"
                                                >
                                                    {group !==
                                                        '__default__' && (
                                                        <div className="select__group-label">
                                                            {group}
                                                        </div>
                                                    )}
                                                    {groupOptions.map(
                                                        (option, index) => {
                                                            const isSelected =
                                                                Array.isArray(
                                                                    currentValue
                                                                )
                                                                    ? currentValue.includes(
                                                                          option.value
                                                                      )
                                                                    : currentValue ===
                                                                      option.value
                                                            const globalIndex =
                                                                filteredOptions.indexOf(
                                                                    option
                                                                )

                                                            return (
                                                                <div
                                                                    key={
                                                                        option.value
                                                                    }
                                                                    className={`select__option ${
                                                                        isSelected
                                                                            ? 'select__option--selected'
                                                                            : ''
                                                                    } ${
                                                                        option.disabled
                                                                            ? 'select__option--disabled'
                                                                            : ''
                                                                    } ${
                                                                        highlightedIndex ===
                                                                        globalIndex
                                                                            ? 'select__option--highlighted'
                                                                            : ''
                                                                    }`}
                                                                    onClick={() => {
                                                                        if (
                                                                            !option.disabled
                                                                        ) {
                                                                            handleSelect(
                                                                                option.value
                                                                            )
                                                                        }
                                                                    }}
                                                                    role="option"
                                                                    aria-selected={
                                                                        isSelected
                                                                    }
                                                                    aria-disabled={
                                                                        option.disabled
                                                                    }
                                                                >
                                                                    {multiple && (
                                                                        <span
                                                                            className={`select__checkbox ${
                                                                                isSelected
                                                                                    ? 'select__checkbox--checked'
                                                                                    : ''
                                                                            }`}
                                                                        >
                                                                            {isSelected &&
                                                                                '✓'}
                                                                        </span>
                                                                    )}
                                                                    {renderOption ? (
                                                                        renderOption(
                                                                            option
                                                                        )
                                                                    ) : (
                                                                        <span>
                                                                            {
                                                                                option.label
                                                                            }
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            )
                                                        }
                                                    )}
                                                </div>
                                            )
                                        )
                                    ) : (
                                        filteredOptions.map((option, index) => {
                                            const isSelected = Array.isArray(
                                                currentValue
                                            )
                                                ? currentValue.includes(
                                                      option.value
                                                  )
                                                : currentValue === option.value

                                            return (
                                                <div
                                                    key={option.value}
                                                    className={`select__option ${
                                                        isSelected
                                                            ? 'select__option--selected'
                                                            : ''
                                                    } ${
                                                        option.disabled
                                                            ? 'select__option--disabled'
                                                            : ''
                                                    } ${
                                                        highlightedIndex ===
                                                        index
                                                            ? 'select__option--highlighted'
                                                            : ''
                                                    }`}
                                                    onClick={() => {
                                                        if (!option.disabled) {
                                                            handleSelect(
                                                                option.value
                                                            )
                                                        }
                                                    }}
                                                    role="option"
                                                    aria-selected={isSelected}
                                                    aria-disabled={
                                                        option.disabled
                                                    }
                                                >
                                                    {multiple && (
                                                        <span
                                                            className={`select__checkbox ${
                                                                isSelected
                                                                    ? 'select__checkbox--checked'
                                                                    : ''
                                                            }`}
                                                        >
                                                            {isSelected && '✓'}
                                                        </span>
                                                    )}
                                                    {renderOption ? (
                                                        renderOption(option)
                                                    ) : (
                                                        <span>
                                                            {option.label}
                                                        </span>
                                                    )}
                                                </div>
                                            )
                                        })
                                    )}
                                </div>
                            </div>
                        </Portal>
                    )}
                </div>
                {helperText && (
                    <span
                        className={`select-helper ${
                            error ? 'select-helper--error' : ''
                        }`}
                    >
                        {helperText}
                    </span>
                )}
                {name && (
                    <input
                        type="hidden"
                        name={name}
                        value={
                            Array.isArray(currentValue)
                                ? currentValue.join(',')
                                : currentValue
                        }
                    />
                )}
            </div>
        )
    }
)

Select.displayName = 'Select'

export default Select
