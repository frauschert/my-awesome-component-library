import React, { PropsWithChildren } from 'react'
import Portal from '../Portal'

type ModalProps = any

const Modal = ({ children }: PropsWithChildren<ModalProps>) => {
    return (
        <Portal wrapperId="modal-wrapper">
            <div style={{ margin: '10px', border: '1px solid black' }}>
                {children}
            </div>
        </Portal>
    )
}

export default Modal
