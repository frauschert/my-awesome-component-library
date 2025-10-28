import React, { forwardRef, useState, useId, ChangeEvent } from 'react'
import './checkbox.scss'

export type CheckboxSize = 'sm' | 'md' | 'lg'

export interface CheckboxProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
    /** Label text for the checkbox */
    label?: string
    /** Size variant */
    size?: CheckboxSize
    /** Checked state (controlled) */
    checked?: boolean
    /** Default checked state (uncontrolled) */
    defaultChecked?: boolean
    /** Indeterminate state (neither checked nor unchecked) */
    indeterminate?: boolean
    /** Change handler */
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void
    /** Disabled state */
    disabled?: boolean
    /** Error state */
    error?: boolean
    /** Helper text below checkbox */
    helperText?: string
    /** Required indicator */
    required?: boolean
    /** Additional class name */
    className?: string
    /** Input name attribute */
    name?: string
    /** Input value attribute */
    value?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    (
        {
            label,
            size = 'md',
            checked: controlledChecked,
            defaultChecked,
            indeterminate = false,
            onChange,
            disabled = false,
            error = false,
            helperText,
            required = false,
            className = '',
            id: providedId,
            name,
            value,
            ...rest
        },
        ref
    ) => {
        const generatedId = useId()
        const id = providedId || generatedId

        // Handle controlled vs uncontrolled
        const isControlled = controlledChecked !== undefined
        const [internalChecked, setInternalChecked] = useState(
            defaultChecked || false
        )
        const checked = isControlled ? controlledChecked : internalChecked

        const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
            if (disabled) return
            if (!isControlled) {
                setInternalChecked(event.target.checked)
            }
            onChange?.(event)
        }

        // Apply indeterminate state via ref
        const inputRef = React.useRef<HTMLInputElement>(null)
        React.useImperativeHandle(ref, () => inputRef.current!)

        React.useEffect(() => {
            if (inputRef.current) {
                inputRef.current.indeterminate = indeterminate
            }
        }, [indeterminate])

        return (
            <div
                className={`checkbox-wrapper checkbox-wrapper--${size} ${className}`}
            >
                <div className="checkbox-container">
                    <div
                        className={`checkbox ${
                            checked ? 'checkbox--checked' : ''
                        } ${indeterminate ? 'checkbox--indeterminate' : ''} ${
                            disabled ? 'checkbox--disabled' : ''
                        } ${error ? 'checkbox--error' : ''}`}
                    >
                        <input
                            ref={inputRef}
                            type="checkbox"
                            id={id}
                            name={name}
                            value={value}
                            checked={checked}
                            onChange={handleChange}
                            disabled={disabled}
                            required={required}
                            className="checkbox__input"
                            aria-invalid={error}
                            aria-describedby={
                                helperText ? `${id}-helper` : undefined
                            }
                            {...rest}
                        />
                        <div className="checkbox__box">
                            {indeterminate ? (
                                <svg
                                    className="checkbox__icon"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M5 12h14"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            ) : checked ? (
                                <svg
                                    className="checkbox__icon"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M5 12l5 5L20 7"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            ) : null}
                        </div>
                    </div>
                    {label && (
                        <label htmlFor={id} className="checkbox__label">
                            {label}
                            {required && (
                                <span className="checkbox__required">*</span>
                            )}
                        </label>
                    )}
                </div>
                {helperText && (
                    <div
                        id={`${id}-helper`}
                        className={`checkbox-helper ${
                            error ? 'checkbox-helper--error' : ''
                        }`}
                    >
                        {helperText}
                    </div>
                )}
            </div>
        )
    }
)

Checkbox.displayName = 'Checkbox'

export default Checkbox
