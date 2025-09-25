import React, { useEffect, ReactNode, useRef } from 'react'
import { useLatestRef } from '../../utility/hooks/useLatestRef'
import './toast.css'

type ToastProps = {
    children: ReactNode
    remove: () => void
    duration?: number
}

function Toast({ children, remove, duration = -1 }: ToastProps) {
    const removeRef = useLatestRef(remove)
    const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const remainingRef = useRef<number>(duration)
    const startRef = useRef<number | null>(null)

    // Schedule or clear the auto-dismiss timer
    useEffect(() => {
        // No auto-dismiss if duration is negative
        if (duration < 0) return
        remainingRef.current = duration
        startRef.current = Date.now()
        timeoutIdRef.current = setTimeout(() => {
            removeRef.current()
        }, remainingRef.current)
        return () => {
            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current)
                timeoutIdRef.current = null
            }
        }
    }, [removeRef, duration])

    const pauseTimer = () => {
        if (duration < 0) return
        if (timeoutIdRef.current && startRef.current != null) {
            clearTimeout(timeoutIdRef.current)
            timeoutIdRef.current = null
            const elapsed = Date.now() - startRef.current
            remainingRef.current = Math.max(0, remainingRef.current - elapsed)
            startRef.current = null
        }
    }

    const resumeTimer = () => {
        if (duration < 0) return
        if (timeoutIdRef.current == null && remainingRef.current > 0) {
            startRef.current = Date.now()
            timeoutIdRef.current = setTimeout(() => {
                removeRef.current()
            }, remainingRef.current)
        }
    }

    return (
        <div
            className={'toast'}
            role="status"
            aria-live="polite"
            aria-atomic="true"
            onMouseEnter={pauseTimer}
            onMouseLeave={resumeTimer}
            onFocus={pauseTimer}
            onBlur={resumeTimer}
            onClick={removeRef.current}
        >
            <div className="toast__text">{children}</div>
            <div>
                <button
                    onClick={removeRef.current}
                    className="toast__close-btn"
                    aria-label="Dismiss notification"
                >
                    x
                </button>
            </div>
        </div>
    )
}

export default Toast
