import { DependencyList, EffectCallback, useEffect, useRef } from 'react'

const useDidUpdate = (effect: EffectCallback, deps?: DependencyList) => {
    const didMountRef = useRef(false)

    useEffect(() => {
        if (!didMountRef.current) {
            didMountRef.current = true
        } else {
            return effect()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps)
}

export default useDidUpdate
