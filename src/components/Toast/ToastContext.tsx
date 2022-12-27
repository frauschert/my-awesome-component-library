import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
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
}

const ToastContext = createContext<ToastContextState | null>(null)

const { subscribe, publish: notify } = createSubscribable<ToastItemWithoutId>()

const ToastProvider = ({ children, position }: ToastProviderProps) => {
    const [toasts, add, remove] = useToasts()

    useEffect(() => subscribe(add), [add])

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
                    ).map(([itemPos, items]) => (
                        <div
                            key={itemPos}
                            className={classNames('toasts-wrapper', itemPos)}
                        >
                            {items.map((item) => (
                                <Toast
                                    key={item.id}
                                    remove={() => remove(item.id)}
                                    {...item}
                                >
                                    {item.content}
                                </Toast>
                            ))}
                        </div>
                    ))}
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
