import React from 'react'
import './alert.scss'
import { classNames } from '../../utility/classnames'

export type AlertVariant = 'info' | 'success' | 'warning' | 'error'
export type AlertSize = 'sm' | 'md' | 'lg'

export interface AlertProps {
    /**
     * Alert content
     */
    children: React.ReactNode

    /**
     * Visual variant
     * @default 'info'
     */
    variant?: AlertVariant

    /**
     * Size variant
     * @default 'md'
     */
    size?: AlertSize

    /**
     * Alert title
     */
    title?: string

    /**
     * Icon to display (overrides default variant icon)
     */
    icon?: React.ReactNode

    /**
     * Show icon
     * @default true
     */
    showIcon?: boolean

    /**
     * Make the alert dismissible
     * @default false
     */
    dismissible?: boolean

    /**
     * Callback when alert is dismissed
     */
    onDismiss?: () => void

    /**
     * Additional CSS class names
     */
    className?: string

    /**
     * Custom styles
     */
    style?: React.CSSProperties

    /**
     * ARIA role
     * @default 'alert' for error/warning, 'status' for info/success
     */
    role?: string

    /**
     * Show border
     * @default false
     */
    bordered?: boolean

    /**
     * Fill background (solid color)
     * @default false
     */
    filled?: boolean
}

const defaultIcons: Record<AlertVariant, React.ReactNode> = {
    info: (
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
        >
            <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
            />
        </svg>
    ),
    success: (
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
        >
            <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
            />
        </svg>
    ),
    warning: (
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
        >
            <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
            />
        </svg>
    ),
    error: (
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
        >
            <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
            />
        </svg>
    ),
}

const Alert: React.FC<AlertProps> = ({
    children,
    variant = 'info',
    size = 'md',
    title,
    icon,
    showIcon = true,
    dismissible = false,
    onDismiss,
    className,
    style,
    role,
    bordered = false,
    filled = false,
}) => {
    const [isVisible, setIsVisible] = React.useState(true)

    const handleDismiss = () => {
        setIsVisible(false)
        onDismiss?.()
    }

    if (!isVisible) {
        return null
    }

    const alertRole =
        role ||
        (variant === 'error' || variant === 'warning' ? 'alert' : 'status')
    const displayIcon = icon !== undefined ? icon : defaultIcons[variant]

    const alertClasses = classNames(
        'alert',
        `alert--${variant}`,
        `alert--${size}`,
        {
            'alert--bordered': bordered,
            'alert--filled': filled,
            'alert--with-title': !!title,
        },
        className
    )

    return (
        <div
            className={alertClasses}
            role={alertRole}
            aria-live="polite"
            aria-atomic="true"
            style={style}
        >
            {showIcon && displayIcon && (
                <div className="alert__icon">{displayIcon}</div>
            )}
            <div className="alert__content">
                {title && <div className="alert__title">{title}</div>}
                <div className="alert__message">{children}</div>
            </div>
            {dismissible && (
                <button
                    type="button"
                    className="alert__close"
                    onClick={handleDismiss}
                    aria-label="Dismiss alert"
                >
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        aria-hidden="true"
                    >
                        <path d="M1 1l12 12M13 1L1 13" />
                    </svg>
                </button>
            )}
        </div>
    )
}

export default Alert
