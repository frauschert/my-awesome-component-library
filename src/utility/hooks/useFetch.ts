import { useEffect, useCallback, useRef } from 'react'
import useAsync from './useAsync'

export function useFetch(request: RequestInfo, init?: RequestInit) {
    const abortControllerRef = useRef<AbortController>()
    useEffect(() => {
        abortControllerRef.current = new AbortController()

        return () => abortControllerRef.current?.abort()
    }, [request, init])

    const fetchMethod = useCallback(async () => {
        const response = await fetch(request, {
            ...init,
            signal: abortControllerRef.current?.signal,
        })
        return response?.json()
    }, [request, init])

    return useAsync(fetchMethod)
}
