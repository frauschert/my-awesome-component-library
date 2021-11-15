import React, {
    createContext,
    PropsWithChildren,
    ReactNode,
    useContext,
    useMemo,
    useState,
} from 'react'
import { createPortal } from 'react-dom'
import { classNames } from '../../utility/classnames'
import Toast from './Toast'

import './toast.css'

type Position = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'

type ToastItem = {
    id: string
    content: ReactNode
}

type ToastContextState = {
    add: (content: ReactNode) => void
    remove: (id: string) => void
}

type ToastProviderProps = PropsWithChildren<{ position: Position }>

// Create a random ID
function generateUEID() {
    let first: string | number = (Math.random() * 46656) | 0
    let second: string | number = (Math.random() * 46656) | 0
    first = ('000' + first.toString(36)).slice(-3)
    second = ('000' + second.toString(36)).slice(-3)

    return first + second
}

const ToastContext = createContext<ToastContextState | null>(null)

const ToastProvider = ({ children, position }: ToastProviderProps) => {
    const [toasts, setToasts] = useState<ToastItem[]>([])

    const add = (content: ReactNode) => {
        const id = generateUEID()

        setToasts([...toasts, { id, content }])
    }

    const remove = (id: string) => setToasts(toasts.filter((t) => t.id !== id))
    const providerValue = useMemo<ToastContextState>(() => {
        return { add, remove }
    }, [toasts])

    return (
        <ToastContext.Provider value={providerValue}>
            {children}
            {createPortal(
                <div className={classNames('toasts-wrapper', position)}>
                    {toasts.map((t) => (
                        <Toast key={t.id} remove={() => remove(t.id)}>
                            {t.content}
                        </Toast>
                    ))}
                </div>,
                document.body
            )}
        </ToastContext.Provider>
    )
}

const useToast = () => {
    const context = useContext(ToastContext)

    if (!context) {
        throw new Error('Context was null!')
    }

    return { ...context }
}

export { ToastContext, ToastProvider, useToast }
