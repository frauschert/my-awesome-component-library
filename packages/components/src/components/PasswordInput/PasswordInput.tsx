import React, { forwardRef, useRef, useState } from 'react'
import { classNames } from '../../utility/classnames'
import uniqueId from '../../utility/uniqueId'
import './PasswordInput.scss'

export type PasswordInputSize = 'sm' | 'md' | 'lg'

export interface PasswordInputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
    /** Label displayed above the input */
    label?: string
    /** Helper text shown below the input */
    helperText?: React.ReactNode
    /** Error message; also sets aria-invalid */
    errorText?: React.ReactNode
    /** Whether the field is in an invalid state */
    invalid?: boolean
    /** Size variant */
    sizeVariant?: PasswordInputSize
    /** Leading adornment */
    startAdornment?: React.ReactNode
    /** Show the strength meter bar */
    showStrengthMeter?: boolean
    /** Custom strength evaluation. Returns 0–4 (0=none, 4=strong). Default is built-in heuristic. */
    getStrength?: (value: string) => 0 | 1 | 2 | 3 | 4
}

const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong'] as const
const STRENGTH_CLASSES = [
    '',
    'password-input__strength--weak',
    'password-input__strength--fair',
    'password-input__strength--good',
    'password-input__strength--strong',
] as const

function defaultGetStrength(value: string): 0 | 1 | 2 | 3 | 4 {
    if (!value) return 0
    let score = 0
    if (value.length >= 8) score++
    if (value.length >= 12) score++
    if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++
    if (/[0-9]/.test(value)) score++
    if (/[^A-Za-z0-9]/.test(value)) score++
    return Math.min(4, score) as 0 | 1 | 2 | 3 | 4
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
    (
        {
            label,
            helperText,
            errorText,
            invalid,
            sizeVariant = 'md',
            startAdornment,
            showStrengthMeter = false,
            getStrength = defaultGetStrength,
            id: idProp,
            className,
            disabled,
            onChange,
            value,
            defaultValue,
            ...rest
        },
        ref
    ) => {
        const [visible, setVisible] = useState(false)
        const [internalValue, setInternalValue] = useState(
            (defaultValue as string) ?? ''
        )

        const isControlled = value !== undefined
        const currentValue = isControlled ? (value as string) : internalValue

        const generatedId = useRef(`password-input-${uniqueId()}`)
        const id = idProp ?? generatedId.current
        const helperId = helperText ? `${id}-helper` : undefined
        const errorId = errorText ? `${id}-error` : undefined
        const describedBy =
            [helperId, errorId].filter(Boolean).join(' ') || undefined

        const strength = showStrengthMeter ? getStrength(currentValue) : 0

        const hasValue = currentValue.length > 0
        const isFocussed = hasValue // floating label behaviour mirrors Input

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (!isControlled) setInternalValue(e.target.value)
            onChange?.(e)
        }

        const toggleVisibility = () => setVisible((v) => !v)

        const fieldClasses = classNames(
            'field',
            `field--${sizeVariant}`,
            isFocussed && 'focussed',
            disabled && 'field--disabled',
            (invalid || !!errorText) && 'field--invalid',
            className
        )

        return (
            <div
                className={classNames(
                    'password-input',
                    `password-input--${sizeVariant}`
                )}
            >
                <div className={fieldClasses}>
                    {startAdornment && (
                        <div
                            className="field__adornment field__adornment--start"
                            aria-hidden
                        >
                            {startAdornment}
                        </div>
                    )}

                    <input
                        ref={ref}
                        id={id}
                        type={visible ? 'text' : 'password'}
                        value={isControlled ? value : internalValue}
                        disabled={disabled}
                        aria-invalid={invalid || !!errorText || undefined}
                        aria-describedby={describedBy}
                        placeholder={rest.placeholder ?? label}
                        onChange={handleChange}
                        className="password-input__input"
                        {...rest}
                    />

                    {label && (
                        <label
                            htmlFor={id}
                            className={
                                invalid || !!errorText ? 'error' : undefined
                            }
                        >
                            {label}
                        </label>
                    )}

                    <div className="field__adornment field__adornment--end">
                        <button
                            type="button"
                            className="password-input__toggle"
                            aria-label={
                                visible ? 'Hide password' : 'Show password'
                            }
                            aria-pressed={visible}
                            onClick={toggleVisibility}
                            tabIndex={-1}
                            disabled={disabled}
                        >
                            {visible ? (
                                // Eye-off icon
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                >
                                    <path d="M17.94 17.94A10.06 10.06 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                                    <line x1="1" y1="1" x2="23" y2="23" />
                                </svg>
                            ) : (
                                // Eye icon
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                >
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {showStrengthMeter && currentValue.length > 0 && (
                    <div
                        className="password-input__strength-meter"
                        aria-live="polite"
                        aria-label={`Password strength: ${STRENGTH_LABELS[strength]}`}
                    >
                        <div className="password-input__strength-bar">
                            {[1, 2, 3, 4].map((level) => (
                                <div
                                    key={level}
                                    className={classNames(
                                        'password-input__strength-segment',
                                        strength >= level &&
                                            STRENGTH_CLASSES[strength]
                                    )}
                                />
                            ))}
                        </div>
                        <span className="password-input__strength-label">
                            {STRENGTH_LABELS[strength]}
                        </span>
                    </div>
                )}

                {helperText && !errorText && (
                    <div id={helperId} className="field__helper">
                        {helperText}
                    </div>
                )}
                {errorText && (
                    <div id={errorId} className="field__error">
                        {errorText}
                    </div>
                )}
            </div>
        )
    }
)

PasswordInput.displayName = 'PasswordInput'

export default PasswordInput
