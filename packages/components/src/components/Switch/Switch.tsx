import React, { InputHTMLAttributes, forwardRef } from 'react'
import { classNames } from '../../utility/classnames'
import './Switch.scss'

export type SwitchSize = 'small' | 'medium' | 'large'

export interface SwitchProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
    /**
     * Whether the switch is checked
     */
    checked?: boolean
    /**
     * Callback when the switch state changes
     */
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
    /**
     * Whether the switch is disabled
     */
    disabled?: boolean
    /**
     * Size of the switch
     */
    size?: SwitchSize
    /**
     * Optional label text
     */
    label?: string
    /**
     * Position of the label relative to the switch
     */
    labelPosition?: 'left' | 'right'
    /**
     * Additional class name
     */
    className?: string
    /**
     * Name attribute for the input
     */
    name?: string
    /**
     * Whether the switch is required
     */
    required?: boolean
    /**
     * Accessible label for screen readers (when label prop is not provided)
     */
    'aria-label'?: string
}

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
    (
        {
            checked = false,
            onChange,
            disabled = false,
            size = 'medium',
            label,
            labelPosition = 'right',
            className,
            name,
            required = false,
            'aria-label': ariaLabel,
            ...rest
        },
        ref
    ) => {
        const switchClasses = classNames(
            'switch',
            `switch--${size}`,
            {
                'switch--disabled': disabled,
                'switch--checked': checked,
            },
            className
        )

        const labelClasses = classNames('switch__label', {
            'switch__label--left': labelPosition === 'left',
            'switch__label--disabled': disabled,
        })

        const switchElement = (
            <label className={switchClasses}>
                <input
                    ref={ref}
                    type="checkbox"
                    className="switch__input"
                    checked={checked}
                    onChange={onChange}
                    disabled={disabled}
                    name={name}
                    required={required}
                    aria-label={ariaLabel || label}
                    {...rest}
                />
                <span className="switch__track">
                    <span className="switch__thumb" />
                </span>
            </label>
        )

        if (label) {
            return (
                <div
                    className={classNames('switch-wrapper', {
                        'switch-wrapper--reverse': labelPosition === 'left',
                    })}
                >
                    {labelPosition === 'left' && (
                        <span className={labelClasses}>{label}</span>
                    )}
                    {switchElement}
                    {labelPosition === 'right' && (
                        <span className={labelClasses}>{label}</span>
                    )}
                </div>
            )
        }

        return switchElement
    }
)

Switch.displayName = 'Switch'

export default Switch
