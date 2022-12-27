import React, { useEffect, ReactNode } from 'react'
import { useLatestRef } from '../../utility/hooks/useLatestRef'
import './toast.css'

type ToastProps = {
    children: ReactNode
    remove: () => void
    duration?: number
}

function Toast({ children, remove, duration = -1 }: ToastProps) {
    const removeRef = useLatestRef(remove)

    useEffect(() => {
        const id =
            duration >= 0
                ? setTimeout(() => removeRef.current(), duration)
                : undefined

        return () => clearTimeout(id)
    }, [removeRef, duration])

    return (
        <div className={'toast'}>
            <div className="toast__text">{children}</div>
            <div>
                <button
                    onClick={removeRef.current}
                    className="toast__close-btn"
                >
                    x
                </button>
            </div>
        </div>
    )
}

export default Toast
