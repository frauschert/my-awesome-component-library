import React from 'react'
import { classNames } from '../../utility/classnames'
import './card.scss'

export type CardVariant = 'default' | 'outlined' | 'elevated'
export type CardPadding = 'none' | 'sm' | 'md' | 'lg'

export interface CardHeaderProps {
    /**
     * Header content
     */
    children: React.ReactNode

    /**
     * Additional CSS class names
     */
    className?: string

    /**
     * Optional action buttons/elements to display on the right
     */
    actions?: React.ReactNode
}

export interface CardBodyProps {
    /**
     * Body content
     */
    children: React.ReactNode

    /**
     * Additional CSS class names
     */
    className?: string

    /**
     * Custom padding for the body
     */
    padding?: CardPadding
}

export interface CardFooterProps {
    /**
     * Footer content
     */
    children: React.ReactNode

    /**
     * Additional CSS class names
     */
    className?: string
}

export interface CardProps {
    /**
     * Card content
     */
    children: React.ReactNode

    /**
     * Visual style variant
     * @default 'default'
     */
    variant?: CardVariant

    /**
     * Padding applied to the card (when not using Header/Body/Footer)
     * @default 'md'
     */
    padding?: CardPadding

    /**
     * Make the card clickable with hover effects
     * @default false
     */
    clickable?: boolean

    /**
     * Additional CSS class names
     */
    className?: string

    /**
     * Click handler (makes card clickable automatically)
     */
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void

    /**
     * Accessible label for the card
     */
    ariaLabel?: string

    /**
     * Custom styles
     */
    style?: React.CSSProperties
}

/**
 * Card component for displaying grouped content
 */
const Card: React.FC<CardProps> & {
    Header: React.FC<CardHeaderProps>
    Body: React.FC<CardBodyProps>
    Footer: React.FC<CardFooterProps>
} = ({
    children,
    variant = 'default',
    padding = 'md',
    clickable = false,
    className,
    onClick,
    ariaLabel,
    style,
}) => {
    const isClickable = clickable || !!onClick

    const cardClasses = classNames(
        'card',
        `card--${variant}`,
        `card--padding-${padding}`,
        {
            'card--clickable': isClickable,
        },
        className
    )

    return (
        <div
            className={cardClasses}
            onClick={onClick}
            aria-label={ariaLabel}
            role={isClickable ? 'button' : undefined}
            tabIndex={isClickable ? 0 : undefined}
            onKeyDown={
                onClick
                    ? (e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              onClick(
                                  e as unknown as React.MouseEvent<HTMLDivElement>
                              )
                          }
                      }
                    : undefined
            }
            style={style}
        >
            {children}
        </div>
    )
}

/**
 * Card Header subcomponent
 */
const CardHeader: React.FC<CardHeaderProps> = ({
    children,
    className,
    actions,
}) => {
    const headerClasses = classNames('card__header', className)

    return (
        <div className={headerClasses}>
            <div className="card__header-content">{children}</div>
            {actions && <div className="card__header-actions">{actions}</div>}
        </div>
    )
}

/**
 * Card Body subcomponent
 */
const CardBody: React.FC<CardBodyProps> = ({
    children,
    className,
    padding = 'md',
}) => {
    const bodyClasses = classNames(
        'card__body',
        `card__body--padding-${padding}`,
        className
    )

    return <div className={bodyClasses}>{children}</div>
}

/**
 * Card Footer subcomponent
 */
const CardFooter: React.FC<CardFooterProps> = ({ children, className }) => {
    const footerClasses = classNames('card__footer', className)

    return <div className={footerClasses}>{children}</div>
}

// Attach subcomponents
Card.Header = CardHeader
Card.Body = CardBody
Card.Footer = CardFooter

export default Card
