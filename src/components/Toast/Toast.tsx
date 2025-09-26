import React, { useEffect, ReactNode, useRef } from 'react'
import { useLatestRef } from '../../utility/hooks/useLatestRef'
import './toast.css'
import Button from '../Button'

type ToastProps = {
    children: ReactNode
    remove: () => void
    duration?: number
    variant?: 'info' | 'success' | 'warn' | 'error'
}

function Toast({
    children,
    remove,
    duration = -1,
    variant = 'info',
}: ToastProps) {
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

    const role = variant === 'error' || variant === 'warn' ? 'alert' : 'status'
    return (
        <div
            className={`toast toast--${variant}`}
            role={role}
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
                <Button
                    variant="circle"
                    aria-label="Dismiss notification"
                    title="Dismiss"
                    onClick={removeRef.current}
                >
                    ×
                </Button>
            </div>
        </div>
    )
}

export default Toast
