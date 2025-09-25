import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useLayoutEffect,
    useRef,
} from 'react'
import { classNames } from '../../utility/classnames'
import { createSubscribable } from '../../utility/createSubscribable'
import groupBy from '../../utility/groupBy'
import Portal from '../Portal'
import Toast from './Toast'

import './toast.css'
import type { Position, ToastItem, ToastItemWithoutId } from './types'
import { useToasts } from './useToasts'

type ToastContextState = {
    add: (item: ToastItem) => void
    remove: (id: string) => void
}

type ToastProviderProps = {
    children: ReactNode
    position: Position
    maxVisible?: number
    dismissOnEscape?: boolean
}

const ToastContext = createContext<ToastContextState | null>(null)

const { subscribe, publish: notify } = createSubscribable<ToastItemWithoutId>()

const ToastProvider = ({
    children,
    position,
    maxVisible,
    dismissOnEscape = true,
}: ToastProviderProps) => {
    const [toasts, add, remove] = useToasts()

    // Subscribe immediately to avoid dropping early notifications
    const unsubRef = useRef<null | (() => void)>(null)
    if (!unsubRef.current) {
        unsubRef.current = subscribe(add)
    }
    useEffect(() => {
        return () => {
            unsubRef.current?.()
            unsubRef.current = null
        }
    }, [add])

    // Allow Escape to dismiss the most recent toast (across positions)
    useEffect(() => {
        if (!dismissOnEscape) return
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                const last = toasts[toasts.length - 1]
                if (last) remove(last.id)
            }
        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [dismissOnEscape, toasts, remove])

    const providerValue = useMemo(() => {
        return { add, remove }
    }, [add, remove])

    return (
        <ToastContext.Provider value={providerValue}>
            <>
                {children}
                <Portal wrapperId="toast-wrapper">
                    {Array.from(
                        groupBy(toasts, (item) => item.position ?? position)
                    ).map(([itemPos, items]) => {
                        const visible =
                            typeof maxVisible === 'number' && maxVisible > 0
                                ? items.slice(-maxVisible)
                                : items
                        return (
                            <div
                                key={itemPos}
                                className={classNames(
                                    'toasts-wrapper',
                                    itemPos
                                )}
                            >
                                {visible.map((item) => (
                                    <Toast
                                        key={item.id}
                                        remove={() => remove(item.id)}
                                        duration={item.duration}
                                        variant={item.variant}
                                    >
                                        {item.content}
                                    </Toast>
                                ))}
                            </div>
                        )
                    })}
                </Portal>
            </>
        </ToastContext.Provider>
    )
}

const useToast = () => {
    const context = useContext(ToastContext)

    if (!context) {
        throw new Error('Context was null!')
    }

    return context
}

export { ToastContext, ToastProvider, useToast, notify }
export type { ToastProviderProps }
