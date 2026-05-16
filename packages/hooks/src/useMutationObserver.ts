import { useEffect, useRef } from 'react'

export interface UseMutationObserverOptions extends MutationObserverInit {
    enabled?: boolean
}

/**
 * Hook to observe DOM mutations using MutationObserver API
 * @param callback - Function called when mutations are observed
 * @param targetRef - Ref to the element to observe
 * @param options - MutationObserver configuration options
 */
function useMutationObserver<T extends HTMLElement>(
    callback: MutationCallback,
    targetRef: React.RefObject<T | null>,
    options: UseMutationObserverOptions = {}
): void {
    const {
        enabled = true,
        attributes,
        attributeFilter,
        attributeOldValue,
        characterData,
        characterDataOldValue,
        childList,
        subtree,
    } = options

    const callbackRef = useRef(callback)

    // Update callback ref when it changes
    useEffect(() => {
        callbackRef.current = callback
    }, [callback])

    useEffect(() => {
        const target = targetRef.current

        if (!enabled || !target || typeof MutationObserver === 'undefined') {
            return
        }

        const observer = new MutationObserver((mutations, obs) => {
            callbackRef.current(mutations, obs)
        })

        const config: MutationObserverInit = {
            attributes,
            attributeFilter,
            attributeOldValue,
            characterData,
            characterDataOldValue,
            childList,
            subtree,
        }

        observer.observe(target, config)

        return () => {
            observer.disconnect()
        }
    }, [
        enabled,
        targetRef,
        attributes,
        attributeFilter,
        attributeOldValue,
        characterData,
        characterDataOldValue,
        childList,
        subtree,
    ])
}

export default useMutationObserver
