import { useEffect, useReducer, useCallback } from 'react'

type AsyncAction<T> =
    | { type: 'loading' }
    | { type: 'success'; payload: T }
    | { type: 'error'; payload: Error }

type AsyncState<T> = {
    isLoading: boolean
    isError: boolean
    isSuccess: boolean
    data: T | undefined
    error: Error | undefined
}

const asyncReducer = <T>(
    state: AsyncState<T>,
    action: AsyncAction<T>
): AsyncState<T> => {
    switch (action.type) {
        case 'loading':
            return {
                isLoading: true,
                isError: false,
                isSuccess: false,
                data: undefined,
                error: undefined,
            }
        case 'success':
            return {
                isSuccess: true,
                isLoading: false,
                isError: false,
                data: action.payload,
                error: undefined,
            }
        case 'error':
            return {
                isError: true,
                isSuccess: false,
                isLoading: false,
                data: undefined,
                error: action.payload,
            }
    }
}

type UseAsyncReturn<T> = AsyncState<T> & { execute: () => Promise<void> }

const useAsync = <T>(
    asyncFunction: () => Promise<T>,
    immediate = true
): UseAsyncReturn<T> => {
    const [state, dispatch] = useReducer(
        asyncReducer as React.Reducer<AsyncState<T>, AsyncAction<T>>,
        {
            isLoading: false,
            isError: false,
            isSuccess: false,
            data: undefined,
            error: undefined,
        }
    )

    // The execute function wraps asyncFunction and
    // dispatches state updates for pending, value, and error.
    // useCallback ensures the below useEffect is not called
    // on every render, but only if asyncFunction changes.
    const execute = useCallback(async () => {
        dispatch({ type: 'loading' })

        try {
            const response = await asyncFunction()
            dispatch({ type: 'success', payload: response })
        } catch (error) {
            if (error instanceof Error)
                dispatch({ type: 'error', payload: error })
            else
                dispatch({ type: 'error', payload: new Error('Unknown error') })
        }
    }, [asyncFunction])

    // Call execute if we want to fire it right away.
    // Otherwise execute can be called later, such as
    // in an onClick handler.
    useEffect(() => {
        if (immediate) {
            execute()
        }
    }, [execute, immediate])

    return { execute, ...state }
}

export default useAsync
