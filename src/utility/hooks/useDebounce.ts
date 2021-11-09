import { DependencyList, useCallback, useEffect, useState } from 'react'
import debounce from '../debounce'
import useTimeoutFn from './useTimeoutFn'

function useDebounce<T>(value: T, delay?: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay || 500)

        return () => {
            clearTimeout(timer)
        }
    }, [value, delay])

    return debouncedValue
}

export default useDebounce

export function useDebounceCallback<
    T extends (...args: unknown[]) => ReturnType<T>
>(fn: T, delay = 500) {
    const [value, setValue] = useState<Parameters<T> | undefined>()

    const debouncefn = useCallback(debounce(fn, delay), [fn, delay])

    useEffect(() => {
        if (value !== undefined) {
            debouncefn(...value)
        }
    }, [value, debouncefn])

    const values = value ? { ...value } : undefined

    return [values, (...args: Parameters<T>) => setValue(args)] as const
}

export type UseDebounceReturn = [() => boolean | null, () => void]

export function useDebounceFn<T extends (...args: any[]) => ReturnType<T>>(
    fn: T,
    ms: number = 500,
    deps: DependencyList = []
): UseDebounceReturn {
    const [isReady, cancel, reset] = useTimeoutFn(fn, ms)

    useEffect(reset, deps)

    return [isReady, cancel]
}
