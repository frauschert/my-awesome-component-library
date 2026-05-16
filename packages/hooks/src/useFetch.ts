import { useEffect, useCallback, useRef } from 'react'
import useAsync from './useAsync'

export function useFetch<T = unknown>(
    request: RequestInfo,
    init?: RequestInit
) {
    const abortControllerRef = useRef<AbortController>(undefined)

    useEffect(() => {
        abortControllerRef.current = new AbortController()

        return () => abortControllerRef.current?.abort()
    }, [request, init])

    const fetchMethod = useCallback(async () => {
        const response = await fetch(request, {
            ...init,
            signal: abortControllerRef.current?.signal,
        })

        if (response.ok) {
            return (await response.json()) as T
        }

        throw new Error(
            `Failed to fetch: ${response.status} - ${response.statusText}`
        )
    }, [request, init])

    const { execute, ...asyncResult } = useAsync(fetchMethod)

    const reload = useCallback(async () => {
        abortControllerRef.current?.abort()
        abortControllerRef.current = new AbortController()
        await execute()
    }, [execute])

    return {
        ...asyncResult,
        execute,
        reload,
        cancel: () => abortControllerRef.current?.abort(),
    }
}
