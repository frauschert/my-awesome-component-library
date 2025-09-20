import React, { forwardRef } from 'react'
import './button.scss'
import { classNames } from '../../utility/classnames'

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'link'
export type ButtonSize = 'small' | 'medium' | 'large'

export interface ButtonProps
    extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
    /** Visual style */
    variant?: ButtonVariant
    /** Size variant */
    size?: ButtonSize
    /** Stretch to full container width */
    fullWidth?: boolean
    /** Show loading state (disables interactions) */
    loading?: boolean
    /** Optional inline background color override (back-compat) */
    backgroundColor?: string
    /** Left adornment */
    leftIcon?: React.ReactNode
    /** Right adornment */
    rightIcon?: React.ReactNode
    /** Text label (back-compat). Prefer children for rich content */
    label?: string
}

/**
 * Primary UI component for user interaction
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = 'primary',
            size = 'medium',
            fullWidth = false,
            loading = false,
            backgroundColor,
            leftIcon,
            rightIcon,
            label,
            type = 'button',
            disabled,
            className,
            children,
            onClick,
            ...rest
        },
        ref
    ) => {
        const isDisabled = disabled || loading
        const classes = classNames(
            'button',
            `button--${size}`,
            `button--${variant}`,
            className,
            {
                'is-loading': !!loading,
                'is-fullwidth': !!fullWidth,
            }
        )

        const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
            if (isDisabled) {
                e.preventDefault()
                e.stopPropagation()
                return
            }
            onClick?.(e)
        }

        const style = backgroundColor
            ? ({ backgroundColor } as React.CSSProperties)
            : undefined

        return (
            <button
                ref={ref}
                type={type}
                className={classes}
                style={style}
                disabled={isDisabled}
                aria-busy={loading || undefined}
                onClick={handleClick}
                {...rest}
            >
                {loading && (
                    <span className="button__spinner" aria-hidden="true" />
                )}
                {leftIcon && (
                    <span className="button__icon button__icon--left">
                        {leftIcon}
                    </span>
                )}
                <span className="button__content">{children ?? label}</span>
                {rightIcon && (
                    <span className="button__icon button__icon--right">
                        {rightIcon}
                    </span>
                )}
            </button>
        )
    }
)

Button.displayName = 'Button'

export default Button
