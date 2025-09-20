import React, {
    PropsWithChildren,
    useCallback,
    useEffect,
    useMemo,
    useRef,
} from 'react'
import Portal from '../Portal'
import './modal.scss'

type ModalBaseProps = PropsWithChildren<{
    open: boolean
    onClose?: () => void
    title?: React.ReactNode
    footer?: React.ReactNode
    ariaLabel?: string
    ariaDescribedBy?: string
    role?: 'dialog' | 'alertdialog'
    initialFocusRef?: React.RefObject<HTMLElement>
    closeOnOverlayClick?: boolean
    closeOnEsc?: boolean
    trapFocus?: boolean
    lockScroll?: boolean
    zIndex?: number
    size?: 'sm' | 'md' | 'lg' | 'xl'
    className?: string
    contentClassName?: string
    overlayClassName?: string
}>

function getFocusable(container: HTMLElement): HTMLElement[] {
    const focusableSelectors = [
        'a[href]',
        'button:not([disabled])',
        'textarea:not([disabled])',
        'input:not([type="hidden"]):not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
    ]
    return Array.from(
        container.querySelectorAll<HTMLElement>(focusableSelectors.join(','))
    ).filter(
        (el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden')
    )
}

const Modal = ({
    open,
    onClose,
    title,
    footer,
    ariaLabel,
    ariaDescribedBy,
    role = 'dialog',
    initialFocusRef,
    closeOnOverlayClick = true,
    closeOnEsc = true,
    trapFocus = true,
    lockScroll = true,
    zIndex,
    size = 'md',
    className,
    contentClassName,
    overlayClassName,
    children,
}: ModalBaseProps) => {
    const overlayRef = useRef<HTMLDivElement | null>(null)
    const contentRef = useRef<HTMLDivElement | null>(null)
    const previouslyFocused = useRef<HTMLElement | null>(null)
    const titleId = useMemo(
        () => (title ? `modal-title-${uniqueId()}` : undefined),
        [title]
    )

    // Generate a simple unique id without external deps
    function uniqueId() {
        return Math.random().toString(36).slice(2, 9)
    }

    // Manage body scroll lock
    useEffect(() => {
        if (!open || !lockScroll) return
        const prev = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = prev
        }
    }, [open, lockScroll])

    // Save and restore focus
    useEffect(() => {
        if (open) {
            previouslyFocused.current =
                (document.activeElement as HTMLElement) || null
        } else if (!open && previouslyFocused.current) {
            previouslyFocused.current.focus?.()
            previouslyFocused.current = null
        }
    }, [open])

    // Move focus into modal on open
    useEffect(() => {
        if (!open) return
        const timer = window.setTimeout(() => {
            const contentEl = contentRef.current
            if (!contentEl) return
            const target =
                initialFocusRef?.current || getFocusable(contentEl)[0]
            if (target) target.focus()
            else contentEl.focus()
        }, 0)
        return () => window.clearTimeout(timer)
    }, [open, initialFocusRef])

    // Close on ESC
    useEffect(() => {
        if (!open || !closeOnEsc) return
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose?.()
            }
        }
        document.addEventListener('keydown', onKeyDown)
        return () => document.removeEventListener('keydown', onKeyDown)
    }, [open, closeOnEsc, onClose])

    // Basic focus trap
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (!trapFocus || e.key !== 'Tab') return
            const container = contentRef.current
            if (!container) return
            const focusables = getFocusable(container)
            if (focusables.length === 0) {
                e.preventDefault()
                container.focus()
                return
            }
            const first = focusables[0]
            const last = focusables[focusables.length - 1]
            const active = document.activeElement as HTMLElement
            const idx = focusables.indexOf(active)
            let target: HTMLElement
            if (e.shiftKey) {
                if (idx <= 0) target = last
                else target = focusables[idx - 1]
            } else {
                if (idx === -1) target = first
                else if (idx >= focusables.length - 1) target = first
                else target = focusables[idx + 1]
            }
            e.preventDefault()
            target.focus()
        },
        [trapFocus]
    )

    const handleOverlayClick = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (!closeOnOverlayClick) return
            if (e.target === e.currentTarget) onClose?.()
        },
        [closeOnOverlayClick, onClose]
    )

    if (!open) return null

    return (
        <Portal wrapperId="modal-root">
            <div
                ref={overlayRef}
                className={['modal__overlay', overlayClassName]
                    .filter(Boolean)
                    .join(' ')}
                style={zIndex ? { zIndex } : undefined}
                onMouseDown={handleOverlayClick}
                data-testid="modal-overlay"
            >
                <div
                    ref={contentRef}
                    role={role}
                    aria-modal="true"
                    aria-labelledby={title ? titleId : undefined}
                    aria-label={!title ? ariaLabel : undefined}
                    aria-describedby={ariaDescribedBy}
                    className={[
                        'modal__content',
                        `modal__content--${size}`,
                        className,
                        contentClassName,
                    ]
                        .filter(Boolean)
                        .join(' ')}
                    tabIndex={-1}
                    onKeyDown={handleKeyDown}
                    data-testid="modal-content"
                >
                    {title ? (
                        <div className="modal__header">
                            <h2 id={titleId} className="modal__title">
                                {title}
                            </h2>
                            {onClose && (
                                <button
                                    type="button"
                                    className="modal__close"
                                    aria-label="Close"
                                    onClick={onClose}
                                    data-testid="modal-close"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    ) : null}
                    <div className="modal__body">{children}</div>
                    {footer ? (
                        <div className="modal__footer">{footer}</div>
                    ) : null}
                </div>
            </div>
        </Portal>
    )
}

export default Modal
