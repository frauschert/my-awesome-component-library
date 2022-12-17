import { useCallback, useReducer } from 'react'
import generateUniqueID from '../../utility/uniqueId'
import { toastReducer } from './reducer'
import type { ToastItemWithoutId } from './types'

export function useToasts() {
    const [toasts, dispatch] = useReducer(toastReducer, [])

    const add = useCallback((item: ToastItemWithoutId) => {
        const id = generateUniqueID()

        dispatch({ type: 'add', payload: { id, ...item } })
    }, [])

    const remove = useCallback(
        (id: string) => dispatch({ type: 'remove', payload: { id } }),
        []
    )

    return [toasts, add, remove] as const
}
