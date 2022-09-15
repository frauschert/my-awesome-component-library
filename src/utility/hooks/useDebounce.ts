import { DependencyList, useEffect } from 'react'
import useEffectOnce from './useEffectOnce'
import useTimeout from './useTimeout'

export default function useDebounce(
    callback: () => void,
    delay: number,
    dependencies: DependencyList
) {
    const { reset, clear } = useTimeout(callback, delay)
    useEffect(reset, [...dependencies, reset])
    useEffectOnce(clear)
}
