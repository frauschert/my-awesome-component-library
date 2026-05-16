import React, { ReactNode, CSSProperties } from 'react'
import { classNames } from '../../utility/classnames'
import './Form.scss'

export type FormGroupProps = {
    /**
     * Form field element (Input, Select, etc.)
     */
    children: ReactNode
    /**
     * Label text for the field
     */
    label?: string
    /**
     * Field description/help text
     */
    description?: string
    /**
     * Error message to display
     */
    error?: string
    /**
     * Hint text to display
     */
    hint?: string
    /**
     * Whether the field is required
     */
    required?: boolean
    /**
     * Additional className
     */
    className?: string
    /**
     * Additional inline styles
     */
    style?: CSSProperties
    /**
     * HTML for attribute for label
     */
    htmlFor?: string
}

/**
 * FormGroup component for wrapping form fields with labels, descriptions, and error messages.
 *
 * @example
 * ```tsx
 * <FormGroup label="Email" error={errors.email} required>
 *   <Input name="email" type="email" />
 * </FormGroup>
 * ```
 */
export const FormGroup: React.FC<FormGroupProps> = ({
    children,
    label,
    description,
    error,
    hint,
    required,
    className,
    style,
    htmlFor,
}) => {
    const groupClassName = classNames('form-group', className)

    return (
        <div className={groupClassName} style={style}>
            {label && (
                <label className="form-group__label" htmlFor={htmlFor}>
                    {label}
                    {required && (
                        <span
                            aria-label="required"
                            style={{
                                color: 'var(--theme-error, #dc2626)',
                                marginLeft: '0.25rem',
                            }}
                        >
                            *
                        </span>
                    )}
                </label>
            )}
            {description && (
                <div className="form-group__description">{description}</div>
            )}
            {children}
            {error && (
                <div className="form-group__error" role="alert">
                    {error}
                </div>
            )}
            {!error && hint && <div className="form-group__hint">{hint}</div>}
        </div>
    )
}

export default FormGroup
