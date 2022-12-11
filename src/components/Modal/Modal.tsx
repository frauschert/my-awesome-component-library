import React, { PropsWithChildren } from 'react'
import Portal from '../Portal'

const Modal = ({ children }: PropsWithChildren) => {
    return (
        <Portal wrapperId="modal-wrapper">
            <div style={{ margin: '10px', border: '1px solid black' }}>
                {children}
            </div>
        </Portal>
    )
}

export default Modal
