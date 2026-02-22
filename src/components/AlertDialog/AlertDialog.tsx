import React from 'react'
import Modal from '../Modal'
import Button from '../Button'
import './AlertDialog.scss'

export type AlertDialogVariant = 'info' | 'warning' | 'danger'

export interface AlertDialogProps {
    /** Whether the alert dialog is open */
    open: boolean
    /** Called when the dialog should close */
    onClose: () => void
    /** Called when the confirm action is triggered */
    onConfirm: () => void
    /** Dialog title */
    title: string
    /** Dialog description / message */
    description: React.ReactNode
    /** Label for the confirm button */
    confirmLabel?: string
    /** Label for the cancel button */
    cancelLabel?: string
    /** Visual variant affecting the confirm button */
    variant?: AlertDialogVariant
    /** Whether the confirm action is in a loading state */
    loading?: boolean
    /** Optional icon to display in the header */
    icon?: React.ReactNode
    /** Size of the dialog */
    size?: 'sm' | 'md'
    /** Additional CSS class */
    className?: string
}

const VARIANT_BUTTON_CLASS: Record<AlertDialogVariant, string> = {
    info: 'alert-dialog__confirm--info',
    warning: 'alert-dialog__confirm--warning',
    danger: 'alert-dialog__confirm--danger',
}

const AlertDialog: React.FC<AlertDialogProps> = ({
    open,
    onClose,
    onConfirm,
    title,
    description,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'info',
    loading = false,
    icon,
    size = 'sm',
    className,
}) => {
    const handleConfirm = () => {
        if (!loading) {
            onConfirm()
        }
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            role="alertdialog"
            size={size}
            closeOnOverlayClick={false}
            closeOnEsc={!loading}
            className={['alert-dialog', className].filter(Boolean).join(' ')}
        >
            <div className="alert-dialog__body">
                {icon && (
                    <div className="alert-dialog__icon" aria-hidden="true">
                        {icon}
                    </div>
                )}
                <h2 className="alert-dialog__title">{title}</h2>
                <p className="alert-dialog__description">{description}</p>
            </div>
            <div className="alert-dialog__actions">
                <Button
                    variant="secondary"
                    onClick={onClose}
                    disabled={loading}
                    className="alert-dialog__cancel"
                    data-testid="alert-dialog-cancel"
                >
                    {cancelLabel}
                </Button>
                <Button
                    variant="primary"
                    onClick={handleConfirm}
                    disabled={loading}
                    className={[
                        'alert-dialog__confirm',
                        VARIANT_BUTTON_CLASS[variant],
                    ].join(' ')}
                    data-testid="alert-dialog-confirm"
                >
                    {loading ? 'Loading…' : confirmLabel}
                </Button>
            </div>
        </Modal>
    )
}

export default AlertDialog
