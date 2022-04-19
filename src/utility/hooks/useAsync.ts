import { useEffect, useState, useCallback } from 'react'

const useAsync = <T>(asyncFunction: () => Promise<T>, immediate = true) => {
    const [loading, setLoading] = useState(false)
    const [value, setValue] = useState<T | null>(null)
    const [error, setError] = useState<Error | null>(null)

    // The execute function wraps asyncFunction and
    // handles setting state for pending, value, and error.
    // useCallback ensures the below useEffect is not called
    // on every render, but only if asyncFunction changes.
    const execute = useCallback(() => {
        setLoading(true)
        setValue(null)
        setError(null)

        return asyncFunction()
            .then((response) => {
                setValue(response)
            })
            .catch((error) => {
                setError(error)
            })
            .finally(() => setLoading(false))
    }, [asyncFunction])

    // Call execute if we want to fire it right away.
    // Otherwise execute can be called later, such as
    // in an onClick handler.
    useEffect(() => {
        if (immediate) {
            execute()
        }
    }, [execute, immediate])

    return { execute, loading, value, error }
}

export default useAsync
