import React, { forwardRef, useId } from 'react'
import './Autocomplete.scss'
import { classNames } from '../../utility/classnames'

export type AutocompleteSize = 'small' | 'medium' | 'large'

export interface AutocompleteOption {
    label: string
    value: string
    disabled?: boolean
}

export interface AutocompleteProps
    extends Omit<
        React.InputHTMLAttributes<HTMLInputElement>,
        'size' | 'value' | 'onChange' | 'onSelect'
    > {
    /** Current input value */
    value: string
    /** Called when input value changes */
    onChange: (value: string) => void
    /** Called when an option is selected from the list */
    onSelect?: (option: AutocompleteOption) => void
    /** Options to display in the dropdown */
    options: AutocompleteOption[]
    /** Label for the input */
    label?: string
    /** Placeholder text */
    placeholder?: string
    /** Size variant */
    size?: AutocompleteSize
    /** Disable the input */
    disabled?: boolean
    /** Show a loading indicator in the dropdown */
    loading?: boolean
    /** Text shown when no options match */
    noOptionsText?: string
    /** Allow free-form text that doesn't have to match an option */
    freeSolo?: boolean
    /** Clear input when user presses Escape */
    clearOnEscape?: boolean
}

const Autocomplete = forwardRef<HTMLInputElement, AutocompleteProps>(
    (
        {
            value,
            onChange,
            onSelect,
            options,
            label,
            placeholder,
            size = 'medium',
            disabled = false,
            loading = false,
            noOptionsText = 'No options',
            freeSolo = false,
            clearOnEscape = false,
            className,
            id: idProp,
            ...rest
        },
        ref
    ) => {
        const generatedId = useId()
        const id = idProp ?? generatedId
        const listboxId = `${id}-listbox`

        const [open, setOpen] = React.useState(false)
        const [activeIndex, setActiveIndex] = React.useState(-1)
        const containerRef = React.useRef<HTMLDivElement>(null)

        const filteredOptions = React.useMemo(() => {
            if (!value) return options
            const lower = value.toLowerCase()
            return options.filter((o) => o.label.toLowerCase().includes(lower))
        }, [options, value])

        const showDropdown =
            open && (loading || filteredOptions.length > 0 || !freeSolo)

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            onChange(e.target.value)
            setOpen(true)
            setActiveIndex(-1)
        }

        const handleSelect = (option: AutocompleteOption) => {
            if (option.disabled) return
            onChange(option.label)
            onSelect?.(option)
            setOpen(false)
            setActiveIndex(-1)
        }

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (!open) {
                if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                    setOpen(true)
                }
                return
            }

            const enabledOptions = filteredOptions.filter((o) => !o.disabled)

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault()
                    setActiveIndex((prev) =>
                        Math.min(prev + 1, enabledOptions.length - 1)
                    )
                    break
                case 'ArrowUp':
                    e.preventDefault()
                    setActiveIndex((prev) => Math.max(prev - 1, 0))
                    break
                case 'Enter':
                    if (activeIndex >= 0 && enabledOptions[activeIndex]) {
                        e.preventDefault()
                        handleSelect(enabledOptions[activeIndex])
                    }
                    break
                case 'Escape':
                    e.preventDefault()
                    setOpen(false)
                    setActiveIndex(-1)
                    if (clearOnEscape) onChange('')
                    break
                case 'Tab':
                    setOpen(false)
                    setActiveIndex(-1)
                    break
            }
        }

        // Close on outside click
        React.useEffect(() => {
            const handleClickOutside = (e: MouseEvent) => {
                if (
                    containerRef.current &&
                    !containerRef.current.contains(e.target as Node)
                ) {
                    setOpen(false)
                    setActiveIndex(-1)
                }
            }
            document.addEventListener('mousedown', handleClickOutside)
            return () =>
                document.removeEventListener('mousedown', handleClickOutside)
        }, [])

        const enabledOptions = filteredOptions.filter((o) => !o.disabled)
        const activeOptionId =
            activeIndex >= 0 && enabledOptions[activeIndex]
                ? `${id}-option-${activeIndex}`
                : undefined

        return (
            <div
                ref={containerRef}
                className={classNames(
                    'autocomplete',
                    `autocomplete--${size}`,
                    { 'autocomplete--open': showDropdown },
                    { 'autocomplete--disabled': disabled },
                    className
                )}
            >
                {label && (
                    <label htmlFor={id} className="autocomplete__label">
                        {label}
                    </label>
                )}
                <div className="autocomplete__input-wrapper">
                    <input
                        ref={ref}
                        id={id}
                        role="combobox"
                        aria-autocomplete="list"
                        aria-expanded={showDropdown}
                        aria-controls={listboxId}
                        aria-activedescendant={activeOptionId}
                        aria-haspopup="listbox"
                        autoComplete="off"
                        value={value}
                        disabled={disabled}
                        placeholder={placeholder}
                        className="autocomplete__input"
                        onChange={handleInputChange}
                        onFocus={() => setOpen(true)}
                        onKeyDown={handleKeyDown}
                        {...rest}
                    />
                </div>

                {showDropdown && (
                    <ul
                        id={listboxId}
                        role="listbox"
                        aria-label={label ?? 'Suggestions'}
                        className="autocomplete__listbox"
                    >
                        {loading ? (
                            <li
                                className="autocomplete__option autocomplete__option--loading"
                                aria-live="polite"
                            >
                                Loading…
                            </li>
                        ) : filteredOptions.length === 0 ? (
                            <li className="autocomplete__option autocomplete__option--no-options">
                                {noOptionsText}
                            </li>
                        ) : (
                            filteredOptions.map((option, i) => {
                                const enabledIdx =
                                    enabledOptions.indexOf(option)
                                const isActive = enabledIdx === activeIndex
                                return (
                                    <li
                                        key={option.value}
                                        id={
                                            enabledIdx >= 0
                                                ? `${id}-option-${enabledIdx}`
                                                : undefined
                                        }
                                        role="option"
                                        aria-selected={isActive}
                                        aria-disabled={option.disabled}
                                        className={classNames(
                                            'autocomplete__option',
                                            {
                                                'autocomplete__option--active':
                                                    isActive,
                                                'autocomplete__option--disabled':
                                                    !!option.disabled,
                                            }
                                        )}
                                        onMouseDown={(e) => {
                                            // Prevent blur before click fires
                                            e.preventDefault()
                                            handleSelect(option)
                                        }}
                                    >
                                        {option.label}
                                    </li>
                                )
                            })
                        )}
                    </ul>
                )}
            </div>
        )
    }
)

Autocomplete.displayName = 'Autocomplete'

export default Autocomplete
