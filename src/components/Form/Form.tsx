import React, { FormEvent, ReactNode, CSSProperties } from 'react'
import { classNames } from '../../utility/classnames'
import './Form.scss'

export type FormLayout = 'vertical' | 'horizontal' | 'inline'
export type FormSize = 'sm' | 'md' | 'lg'

export type FormProps = {
    /**
     * Form content (inputs, buttons, etc.)
     */
    children: ReactNode
    /**
     * Form submission handler
     */
    onSubmit?: (event: FormEvent<HTMLFormElement>) => void
    /**
     * Called when form is invalid (validation fails)
     */
    onError?: (errors: Record<string, string>) => void
    /**
     * Form layout style
     * @default 'vertical'
     */
    layout?: FormLayout
    /**
     * Form size (affects spacing and input sizes)
     * @default 'md'
     */
    size?: FormSize
    /**
     * Whether to show validation immediately or on submit
     * @default false
     */
    validateOnChange?: boolean
    /**
     * Whether to disable all form inputs
     * @default false
     */
    disabled?: boolean
    /**
     * Additional className for the form
     */
    className?: string
    /**
     * Additional inline styles
     */
    style?: CSSProperties
    /**
     * Form id attribute
     */
    id?: string
    /**
     * ARIA label for accessibility
     */
    'aria-label'?: string
    /**
     * ARIA labelledby for accessibility
     */
    'aria-labelledby'?: string
    /**
     * Whether form should not validate on HTML5 validation
     * @default true
     */
    noValidate?: boolean
    /**
     * Autocomplete attribute
     * @default 'off'
     */
    autoComplete?: 'on' | 'off'
}

/**
 * Form component that wraps form elements with consistent styling and behavior.
 * Integrates with Input, Select, Checkbox, RadioGroup and other form components.
 *
 * @example
 * ```tsx
 * <Form onSubmit={(e) => handleSubmit(e)}>
 *   <Input label="Name" name="name" required />
 *   <Input label="Email" name="email" type="email" required />
 *   <Button type="submit">Submit</Button>
 * </Form>
 * ```
 */
const Form: React.FC<FormProps> = ({
    children,
    onSubmit,
    onError,
    layout = 'vertical',
    size = 'md',
    validateOnChange = false,
    disabled = false,
    className,
    style,
    id,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    noValidate = true,
    autoComplete = 'off',
}) => {
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const form = event.currentTarget

        // HTML5 validation check
        if (!form.checkValidity()) {
            const errors: Record<string, string> = {}
            const elements = form.elements

            for (let i = 0; i < elements.length; i++) {
                const element = elements[i] as HTMLInputElement
                if (element.validity && !element.validity.valid) {
                    errors[element.name] = element.validationMessage
                }
            }

            onError?.(errors)
            return
        }

        onSubmit?.(event)
    }

    const formClassName = classNames(
        'form',
        `form--${layout}`,
        `form--${size}`,
        {
            'form--disabled': disabled,
            'form--validate-on-change': validateOnChange,
        },
        className
    )

    return (
        <form
            className={formClassName}
            onSubmit={handleSubmit}
            style={style}
            id={id}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby}
            noValidate={noValidate}
            autoComplete={autoComplete}
        >
            <fieldset disabled={disabled} className="form__fieldset">
                {children}
            </fieldset>
        </form>
    )
}

export default Form
