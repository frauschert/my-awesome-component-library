import React from 'react'
import { classNames } from '../../utility/classnames'
import './Chip.scss'

export interface ChipProps {
    /** Chip label text */
    label: string
    /** Visual variant */
    variant?: 'filled' | 'outlined' | 'light'
    /** Color scheme */
    color?:
        | 'default'
        | 'primary'
        | 'secondary'
        | 'success'
        | 'warning'
        | 'danger'
        | 'info'
    /** Size variant */
    size?: 'small' | 'medium' | 'large'
    /** Icon to display before label */
    icon?: React.ReactNode
    /** Avatar to display before label */
    avatar?: React.ReactNode
    /** Whether the chip can be dismissed */
    dismissible?: boolean
    /** Callback when chip is dismissed */
    onDismiss?: () => void
    /** Callback when chip is clicked */
    onClick?: () => void
    /** Whether the chip is disabled */
    disabled?: boolean
    /** Whether the chip is selected (toggle state) */
    selected?: boolean
    /** Custom className */
    className?: string
    /** Custom aria-label */
    'aria-label'?: string
}

export const Chip: React.FC<ChipProps> = ({
    label,
    variant = 'filled',
    color = 'default',
    size = 'medium',
    icon,
    avatar,
    dismissible = false,
    onDismiss,
    onClick,
    disabled = false,
    selected = false,
    className,
    'aria-label': ariaLabel,
}) => {
    const isClickable = !!onClick && !disabled
    const hasLeadingElement = !!(icon || avatar)

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isClickable) {
            onClick()
        }
    }

    const handleDismiss = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        onDismiss?.()
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            onClick()
        }
    }

    const Component = isClickable ? 'div' : 'div'

    return (
        <Component
            className={classNames(
                'chip',
                `chip--${variant}`,
                `chip--${color}`,
                `chip--${size}`,
                {
                    'chip--clickable': isClickable,
                    'chip--disabled': disabled,
                    'chip--selected': selected,
                    'chip--has-icon': hasLeadingElement,
                    'chip--dismissible': dismissible,
                },
                className
            )}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            role={isClickable ? 'button' : undefined}
            tabIndex={isClickable && !disabled ? 0 : undefined}
            aria-label={ariaLabel || label}
            aria-disabled={disabled}
        >
            {avatar && <span className="chip__avatar">{avatar}</span>}
            {icon && !avatar && <span className="chip__icon">{icon}</span>}
            <span className="chip__label">{label}</span>
            {dismissible && (
                <button
                    type="button"
                    className="chip__dismiss"
                    onClick={handleDismiss}
                    aria-label={`Remove ${label}`}
                    disabled={disabled}
                    tabIndex={-1}
                >
                    <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M9 3L3 9M3 3L9 9"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        />
                    </svg>
                </button>
            )}
        </Component>
    )
}

export default Chip
