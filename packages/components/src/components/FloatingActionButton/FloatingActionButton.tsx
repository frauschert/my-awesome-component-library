import React, { forwardRef } from 'react'
import { classNames } from '../../utility/classnames'
import './floatingactionbutton.scss'

export type FABSize = 'small' | 'medium' | 'large'
export type FABVariant = 'primary' | 'secondary' | 'danger'
export type FABPosition =
    | 'bottom-right'
    | 'bottom-left'
    | 'top-right'
    | 'top-left'

export interface FloatingActionButtonProps
    extends Omit<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        'children' | 'color'
    > {
    /** Icon to display in the FAB */
    icon: React.ReactNode
    /** Optional text label (for extended FAB) */
    label?: string
    /** Size variant */
    size?: FABSize
    /** Color variant */
    variant?: FABVariant
    /** Position on screen (for fixed positioning) */
    position?: FABPosition
    /** Whether to use fixed positioning */
    fixed?: boolean
    /** Whether to show with elevation/shadow */
    elevated?: boolean
    /** Accessible label (required if no text label) */
    'aria-label': string
}

/**
 * FloatingActionButton (FAB) - A circular button that floats above content
 * Used for primary actions on a screen
 */
const FloatingActionButton = forwardRef<
    HTMLButtonElement,
    FloatingActionButtonProps
>(
    (
        {
            icon,
            label,
            size = 'medium',
            variant = 'primary',
            position = 'bottom-right',
            fixed = false,
            elevated = true,
            className,
            disabled,
            'aria-label': ariaLabel,
            ...props
        },
        ref
    ) => {
        const fabClasses = classNames(
            'fab',
            `fab--${variant}`,
            `fab--${size}`,
            fixed && `fab--fixed fab--${position}`,
            label && 'fab--extended',
            elevated && 'fab--elevated',
            className
        )

        return (
            <button
                ref={ref}
                className={fabClasses}
                disabled={disabled}
                aria-label={ariaLabel}
                type="button"
                {...props}
            >
                <span className="fab__icon">{icon}</span>
                {label && <span className="fab__label">{label}</span>}
            </button>
        )
    }
)

FloatingActionButton.displayName = 'FloatingActionButton'

export default FloatingActionButton
