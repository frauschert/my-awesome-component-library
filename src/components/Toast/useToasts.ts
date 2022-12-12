import { ReactNode, useCallback, useReducer } from 'react'
import generateUniqueID from '../../utility/uniqueId'
import { toastReducer } from './reducer'

export function useToasts() {
    const [toasts, dispatch] = useReducer(toastReducer, [])

    const add = useCallback((content: ReactNode) => {
        const id = generateUniqueID()

        dispatch({ type: 'add', payload: { id, content } })
    }, [])

    const remove = useCallback(
        (id: string) => dispatch({ type: 'remove', payload: { id } }),
        []
    )

    return [toasts, add, remove] as const
}
