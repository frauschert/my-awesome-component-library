import React, { PropsWithChildren } from 'react'
import { createPortal } from 'react-dom'

type ModalProps = any

const Modal = ({ children }: PropsWithChildren<ModalProps>) => {
    return createPortal(
        <div style={{ margin: '10px', border: '1px solid black' }}>
            {children}
        </div>,
        document.body
    )
}

export default Modal
