import React from 'react'
import { classNames } from '../../utility/classnames'
import './badge.scss'

export type BadgeVariant =
    | 'default'
    | 'primary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'

export type BadgeSize = 'sm' | 'md' | 'lg'

export interface BadgeProps {
    /**
     * The content to display inside the badge
     */
    children?: React.ReactNode

    /**
     * Visual style variant
     * @default 'default'
     */
    variant?: BadgeVariant

    /**
     * Size of the badge
     * @default 'md'
     */
    size?: BadgeSize

    /**
     * Show a dot indicator instead of content
     * @default false
     */
    dot?: boolean

    /**
     * Make the badge rounded (pill shape)
     * @default true
     */
    rounded?: boolean

    /**
     * Additional CSS class names
     */
    className?: string

    /**
     * Accessible label for the badge
     */
    ariaLabel?: string

    /**
     * Click handler
     */
    onClick?: (event: React.MouseEvent<HTMLSpanElement>) => void
}

/**
 * Badge component for displaying status indicators, counts, and labels
 */
const Badge: React.FC<BadgeProps> = ({
    children,
    variant = 'default',
    size = 'md',
    dot = false,
    rounded = true,
    className,
    ariaLabel,
    onClick,
}) => {
    const badgeClasses = classNames(
        'badge',
        `badge--${variant}`,
        `badge--${size}`,
        {
            'badge--dot': dot,
            'badge--rounded': rounded,
            'badge--clickable': !!onClick,
        },
        className
    )

    return (
        <span
            className={badgeClasses}
            aria-label={ariaLabel}
            onClick={onClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={
                onClick
                    ? (e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              onClick(
                                  e as unknown as React.MouseEvent<HTMLSpanElement>
                              )
                          }
                      }
                    : undefined
            }
        >
            {!dot && children}
        </span>
    )
}

export default Badge
