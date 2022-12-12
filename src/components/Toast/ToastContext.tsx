import React, {
    createContext,
    PropsWithChildren,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useReducer,
} from 'react'
import { classNames } from '../../utility/classnames'
import { createSubscribable } from '../../utility/createSubscribable'
import generateUniqueID from '../../utility/uniqueId'
import Portal from '../Portal'
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

const ToastContext = createContext<ToastContextState | null>(null)

type ToastAdd = {
    type: 'add'
    payload: ToastItem
}

type ToastRemove = {
    type: 'remove'
    payload: {
        id: string
    }
}

type ToastAction = ToastAdd | ToastRemove

type ToastState = {
    toasts: ToastItem[]
}

function toastReducer(state: ToastState, action: ToastAction) {
    switch (action.type) {
        case 'add':
            return {
                ...state,
                toasts: [...state.toasts, action.payload],
            }
        case 'remove':
            return {
                ...state,
                toasts: state.toasts.filter((t) => t.id !== action.payload.id),
            }
        default:
            return state
    }
}

const subscribable = createSubscribable<ReactNode>()

const ToastProvider = ({ children, position }: ToastProviderProps) => {
    const [state, dispatch] = useReducer(toastReducer, { toasts: [] })

    const add = useCallback((content: ReactNode) => {
        const id = generateUniqueID()

        dispatch({ type: 'add', payload: { id, content } })
    }, [])

    const remove = useCallback(
        (id: string) => dispatch({ type: 'remove', payload: { id } }),
        []
    )

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
                        {state.toasts.map((t) => (
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
