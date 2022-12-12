import React, {
    createContext,
    PropsWithChildren,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
} from 'react'
import { classNames } from '../../utility/classnames'
import { createSubscribable } from '../../utility/createSubscribable'
import Portal from '../Portal'
import Toast from './Toast'

import './toast.css'
import { useToasts } from './useToasts'

type Position = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'

type ToastContextState = {
    add: (content: ReactNode) => void
    remove: (id: string) => void
}

type ToastProviderProps = PropsWithChildren<{ position: Position }>

const ToastContext = createContext<ToastContextState | null>(null)

const subscribable = createSubscribable<ReactNode>()

const ToastProvider = ({ children, position }: ToastProviderProps) => {
    const [toasts, add, remove] = useToasts()

    useEffect(() => subscribable.subscribe(add), [add])

    const providerValue = useMemo(() => {
        return { add, remove }
    }, [add, remove])

    return (
        <ToastContext.Provider value={providerValue}>
            <>
                {children}
                <Portal wrapperId="toast-wrapper">
                    <div className={classNames('toasts-wrapper', position)}>
                        {toasts.map((t) => (
                            <Toast key={t.id} remove={() => remove(t.id)}>
                                {t.content}
                            </Toast>
                        ))}
                    </div>
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

const notify = subscribable.publish

export { ToastContext, ToastProvider, useToast, notify }
export type { ToastProviderProps }
