import React from 'react'
import { classNames } from '../../utility/classnames'
import './RadioGroup.scss'

export interface RadioOption {
    /** Unique value for this option */
    value: string
    /** Label text for the option */
    label: string
    /** Optional description/helper text */
    description?: string
    /** Whether this option is disabled */
    disabled?: boolean
}

export interface RadioGroupProps {
    /** Name attribute for the radio group */
    name: string
    /** Array of radio options */
    options: RadioOption[]
    /** Currently selected value */
    value?: string
    /** Callback when selection changes */
    onChange?: (value: string) => void
    /** Label for the radio group */
    label?: string
    /** Error message to display */
    error?: string
    /** Helper text to display */
    helperText?: string
    /** Whether the field is required */
    required?: boolean
    /** Whether the entire group is disabled */
    disabled?: boolean
    /** Layout orientation */
    orientation?: 'vertical' | 'horizontal'
    /** Size variant */
    size?: 'small' | 'medium' | 'large'
    /** Custom className */
    className?: string
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
    name,
    options,
    value,
    onChange,
    label,
    error,
    helperText,
    required = false,
    disabled = false,
    orientation = 'vertical',
    size = 'medium',
    className,
}) => {
    const handleChange = (optionValue: string) => {
        if (!disabled) {
            onChange?.(optionValue)
        }
    }

    const groupId = `radio-group-${name}`
    const errorId = error ? `${groupId}-error` : undefined
    const helperTextId = helperText ? `${groupId}-helper` : undefined

    return (
        <div
            className={classNames(
                'radio-group',
                `radio-group--${orientation}`,
                `radio-group--${size}`,
                {
                    'radio-group--error': !!error,
                    'radio-group--disabled': disabled,
                },
                className
            )}
        >
            {label && (
                <div className="radio-group__label" id={groupId}>
                    {label}
                    {required && (
                        <span className="radio-group__required">*</span>
                    )}
                </div>
            )}
            <div
                className="radio-group__options"
                role="radiogroup"
                aria-labelledby={label ? groupId : undefined}
                aria-describedby={
                    [errorId, helperTextId].filter(Boolean).join(' ') ||
                    undefined
                }
                aria-required={required}
            >
                {options.map((option) => {
                    const isChecked = value === option.value
                    const isDisabled = disabled || option.disabled
                    const radioId = `${name}-${option.value}`

                    return (
                        <label
                            key={option.value}
                            className={classNames('radio-group__option', {
                                'radio-group__option--checked': isChecked,
                                'radio-group__option--disabled': isDisabled,
                            })}
                            htmlFor={radioId}
                        >
                            <input
                                type="radio"
                                id={radioId}
                                name={name}
                                value={option.value}
                                checked={isChecked}
                                disabled={isDisabled}
                                onChange={() => handleChange(option.value)}
                                className="radio-group__input"
                                aria-describedby={
                                    option.description
                                        ? `${radioId}-desc`
                                        : undefined
                                }
                            />
                            <span className="radio-group__radio">
                                <span className="radio-group__radio-dot" />
                            </span>
                            <span className="radio-group__content">
                                <span className="radio-group__option-label">
                                    {option.label}
                                </span>
                                {option.description && (
                                    <span
                                        className="radio-group__option-description"
                                        id={`${radioId}-desc`}
                                    >
                                        {option.description}
                                    </span>
                                )}
                            </span>
                        </label>
                    )
                })}
            </div>
            {error && (
                <div className="radio-group__error" id={errorId} role="alert">
                    {error}
                </div>
            )}
            {helperText && !error && (
                <div className="radio-group__helper-text" id={helperTextId}>
                    {helperText}
                </div>
            )}
        </div>
    )
}

export default RadioGroup
