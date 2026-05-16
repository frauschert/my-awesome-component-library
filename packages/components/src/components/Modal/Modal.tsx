import React, {
    PropsWithChildren,
    useCallback,
    useEffect,
    useMemo,
    useRef,
} from 'react'
import Portal from '../Portal'
import Button from '../Button'
import useFocusTrap from '../../utility/hooks/useFocusTrap'
import useScrollLock from '../../utility/hooks/useScrollLock'
import './modal.scss'

export type ModalProps = PropsWithChildren<{
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

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl'

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
}: ModalProps) => {
    const overlayRef = useRef<HTMLDivElement | null>(null)
    const titleId = useMemo(
        () => (title ? `modal-title-${uniqueId()}` : undefined),
        [title]
    )

    // Generate a simple unique id without external deps
    function uniqueId() {
        return Math.random().toString(36).slice(2, 9)
    }

    useScrollLock({ enabled: open && lockScroll })
    const { containerRef, onKeyDown: handleFocusTrapKeyDown } = useFocusTrap({
        enabled: open && trapFocus,
        initialFocusRef,
        restoreFocus: true,
    })

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
                    ref={containerRef as React.Ref<HTMLDivElement>}
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
                    onKeyDown={handleFocusTrapKeyDown}
                    data-testid="modal-content"
                >
                    {title ? (
                        <div className="modal__header">
                            <h2 id={titleId} className="modal__title">
                                {title}
                            </h2>
                            {onClose && (
                                <Button
                                    type="button"
                                    className="modal__close"
                                    variant="circle"
                                    aria-label="Close"
                                    onClick={onClose}
                                    data-testid="modal-close"
                                >
                                    ×
                                </Button>
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
