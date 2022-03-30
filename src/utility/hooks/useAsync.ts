import { useReducer, useEffect, DependencyList } from 'react'
import { Awaited } from '../types'

type LoadingAction = {
    type: 'LOADING'
}

type SuccessAction<T> = {
    type: 'SUCCESS'
    data: T
}

type ErrorAction = {
    type: 'ERROR'
    error: Error
}

type AsyncAction<D> = LoadingAction | SuccessAction<D> | ErrorAction

export type AsyncState<D> = {
    loading: boolean
    data: D | null
    error: Error | null
}

function asyncReducer<D>(
    state: AsyncState<D>,
    action: AsyncAction<D>
): AsyncState<D> {
    switch (action.type) {
        case 'LOADING':
            return {
                loading: true,
                data: null,
                error: null,
            }
        case 'SUCCESS':
            return {
                loading: false,
                data: action.data,
                error: null,
            }
        case 'ERROR':
            return {
                loading: false,
                data: null,
                error: action.error,
            }
    }
}

type PromiseFn<T> = (...args: any) => Promise<T>

function useAsync<D, F extends PromiseFn<D>>(promiseFn: F) {
    const [state, dispatch] = useReducer(asyncReducer, {
        loading: false,
        data: null,
        error: null,
    } as AsyncState<Awaited<F>>)

    async function run(...params: Parameters<F>) {
        dispatch({ type: 'LOADING' })
        try {
            const data = await promiseFn(...params)
            dispatch({
                type: 'SUCCESS',
                data,
            })
        } catch (e) {
            dispatch({
                type: 'ERROR',
                error: e instanceof Error ? e : new Error('Unknown error'),
            })
        }
    }

    return [state, run] as const
}

function useAsyncEffect<D, F extends PromiseFn<D>>(
    promiseFn: F,
    params: Parameters<F>,
    deps: DependencyList[]
) {
    const [state, run] = useAsync(promiseFn)
    useEffect(
        () => {
            run(...params)
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        deps
    )

    return [state, run] as const
}

export default useAsync
export { useAsyncEffect }
