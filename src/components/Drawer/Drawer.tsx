import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { classNames } from '../../utility/classnames'
import './Drawer.scss'

export interface DrawerProps {
    /** Whether the drawer is open */
    isOpen: boolean
    /** Callback when the drawer should close */
    onClose: () => void
    /** Where the drawer slides in from */
    placement?: 'left' | 'right' | 'top' | 'bottom'
    /** Size of the drawer (width for left/right, height for top/bottom) */
    size?: 'small' | 'medium' | 'large' | string
    /** Whether clicking the backdrop closes the drawer */
    closeOnBackdropClick?: boolean
    /** Whether pressing Escape closes the drawer */
    closeOnEscape?: boolean
    /** Whether to show the backdrop overlay */
    showBackdrop?: boolean
    /** Custom className for the drawer */
    className?: string
    /** Content of the drawer */
    children: React.ReactNode
    /** Optional title for the drawer */
    title?: string
    /** Whether to show a close button */
    showCloseButton?: boolean
}

const SIZE_MAP = {
    small: '300px',
    medium: '400px',
    large: '600px',
}

export const Drawer: React.FC<DrawerProps> = ({
    isOpen,
    onClose,
    placement = 'right',
    size = 'medium',
    closeOnBackdropClick = true,
    closeOnEscape = true,
    showBackdrop = true,
    className,
    children,
    title,
    showCloseButton = true,
}) => {
    const drawerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!isOpen || !closeOnEscape) return

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose()
            }
        }

        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [isOpen, closeOnEscape, onClose])

    useEffect(() => {
        if (isOpen) {
            // Prevent body scroll when drawer is open
            document.body.style.overflow = 'hidden'
            // Focus the drawer
            drawerRef.current?.focus()
        } else {
            document.body.style.overflow = ''
        }

        return () => {
            document.body.style.overflow = ''
        }
    }, [isOpen])

    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (closeOnBackdropClick && event.target === event.currentTarget) {
            onClose()
        }
    }

    if (!isOpen) return null

    const drawerSize = SIZE_MAP[size as keyof typeof SIZE_MAP] || size
    const isHorizontal = placement === 'left' || placement === 'right'

    const drawerStyle: React.CSSProperties = isHorizontal
        ? { width: drawerSize }
        : { height: drawerSize }

    const content = (
        <div
            className={classNames('drawer-overlay', {
                'drawer-overlay--no-backdrop': !showBackdrop,
            })}
            onClick={handleBackdropClick}
            role="presentation"
        >
            <div
                ref={drawerRef}
                className={classNames(
                    'drawer',
                    `drawer--${placement}`,
                    className
                )}
                style={drawerStyle}
                role="dialog"
                aria-modal="true"
                aria-label={title || 'Drawer'}
                tabIndex={-1}
            >
                {(title || showCloseButton) && (
                    <div className="drawer__header">
                        {title && <h2 className="drawer__title">{title}</h2>}
                        {showCloseButton && (
                            <button
                                className="drawer__close"
                                onClick={onClose}
                                aria-label="Close drawer"
                                type="button"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                )}
                <div className="drawer__content">{children}</div>
            </div>
        </div>
    )

    return createPortal(content, document.body)
}

export default Drawer
