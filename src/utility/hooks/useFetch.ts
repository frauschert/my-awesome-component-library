import { useState, useEffect } from 'react'

export function useFetch(request: RequestInfo, init?: RequestInit) {
    const [response, setResponse] = useState<null | Response>(null)
    const [error, setError] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const abortController = new AbortController()
        setIsLoading(true)
        ;(async () => {
            try {
                const response = await fetch(request, {
                    ...init,
                    signal: abortController.signal,
                })
                setResponse(await response?.json())
            } catch (error) {
                setError(true)
            } finally {
                setIsLoading(false)
            }
        })()
        return () => {
            abortController.abort()
        }
    }, [init, request])

    return { response, error, isLoading }
}
