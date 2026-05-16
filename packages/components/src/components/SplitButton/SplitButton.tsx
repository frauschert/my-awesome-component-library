import React, { useState, useRef, useCallback } from 'react'
import { classNames } from '../../utility/classnames'
import Portal from '../Portal'
import './splitbutton.scss'

export type SplitButtonVariant = 'primary' | 'secondary' | 'danger'
export type SplitButtonSize = 'small' | 'medium' | 'large'

export interface SplitButtonAction {
    label: string
    onClick: () => void
    disabled?: boolean
    icon?: React.ReactNode
    divider?: boolean
}

export interface SplitButtonProps {
    /** Primary action label */
    label: string
    /** Primary action handler */
    onClick: () => void
    /** Additional actions in dropdown */
    actions: SplitButtonAction[]
    /** Visual variant */
    variant?: SplitButtonVariant
    /** Size variant */
    size?: SplitButtonSize
    /** Disabled state */
    disabled?: boolean
    /** Loading state */
    loading?: boolean
    /** Left icon for primary button */
    leftIcon?: React.ReactNode
    /** Additional CSS class */
    className?: string
    /** Accessible label for dropdown trigger */
    'aria-label'?: string
}

const SplitButton: React.FC<SplitButtonProps> = ({
    label,
    onClick,
    actions,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    leftIcon,
    className,
    'aria-label': ariaLabel,
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const triggerRef = useRef<HTMLButtonElement>(null)
    const menuRef = useRef<HTMLDivElement>(null)

    const handlePrimaryClick = useCallback(() => {
        if (!disabled && !loading) {
            onClick()
        }
    }, [disabled, loading, onClick])

    const handleDropdownClick = useCallback(() => {
        if (!disabled && !loading) {
            setIsOpen((prev) => !prev)
        }
    }, [disabled, loading])

    const handleActionClick = useCallback((action: SplitButtonAction) => {
        if (!action.disabled) {
            action.onClick()
            setIsOpen(false)
        }
    }, [])

    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node)
        ) {
            setIsOpen(false)
        }
    }, [])

    React.useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
            return () => {
                document.removeEventListener('mousedown', handleClickOutside)
            }
        }
    }, [isOpen, handleClickOutside])

    React.useEffect(() => {
        if (isOpen && menuRef.current && triggerRef.current) {
            const triggerRect = triggerRef.current.getBoundingClientRect()
            const menuRect = menuRef.current.getBoundingClientRect()
            const viewportHeight = window.innerHeight

            // Position below trigger by default
            menuRef.current.style.top = `${triggerRect.bottom + 4}px`
            menuRef.current.style.left = `${triggerRect.left}px`

            // Check if menu would overflow viewport
            if (triggerRect.bottom + menuRect.height + 4 > viewportHeight) {
                // Position above trigger instead
                menuRef.current.style.top = `${
                    triggerRect.top - menuRect.height - 4
                }px`
            }
        }
    }, [isOpen])

    const buttonClasses = classNames(
        'splitbutton',
        `splitbutton--${variant}`,
        `splitbutton--${size}`,
        {
            'splitbutton--disabled': disabled,
            'splitbutton--loading': loading,
            'splitbutton--open': isOpen,
        },
        className
    )

    return (
        <div className={buttonClasses} ref={dropdownRef}>
            <button
                type="button"
                className="splitbutton__primary"
                onClick={handlePrimaryClick}
                disabled={disabled || loading}
                aria-busy={loading}
            >
                {loading && (
                    <span className="splitbutton__spinner" aria-hidden="true">
                        ⟳
                    </span>
                )}
                {!loading && leftIcon && (
                    <span className="splitbutton__icon" aria-hidden="true">
                        {leftIcon}
                    </span>
                )}
                <span className="splitbutton__label">{label}</span>
            </button>

            <button
                ref={triggerRef}
                type="button"
                className="splitbutton__trigger"
                onClick={handleDropdownClick}
                disabled={disabled || loading}
                aria-label={ariaLabel || 'Show more options'}
                aria-expanded={isOpen}
                aria-haspopup="menu"
            >
                <svg
                    className="splitbutton__chevron"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            {isOpen && (
                <Portal>
                    <div
                        ref={menuRef}
                        className="splitbutton__menu"
                        role="menu"
                    >
                        {actions.map((action, index) => {
                            if (action.divider) {
                                return (
                                    <div
                                        key={`divider-${index}`}
                                        className="splitbutton__divider"
                                        role="separator"
                                    />
                                )
                            }

                            return (
                                <button
                                    key={index}
                                    type="button"
                                    className={classNames(
                                        'splitbutton__menu-item',
                                        {
                                            'splitbutton__menu-item--disabled':
                                                action.disabled,
                                        }
                                    )}
                                    onClick={() => handleActionClick(action)}
                                    disabled={action.disabled}
                                    role="menuitem"
                                >
                                    {action.icon && (
                                        <span
                                            className="splitbutton__menu-icon"
                                            aria-hidden="true"
                                        >
                                            {action.icon}
                                        </span>
                                    )}
                                    <span className="splitbutton__menu-label">
                                        {action.label}
                                    </span>
                                </button>
                            )
                        })}
                    </div>
                </Portal>
            )}
        </div>
    )
}

export default SplitButton
