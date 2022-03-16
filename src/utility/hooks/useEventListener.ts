import { RefObject, useEffect, useRef } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isRefObject<T>(value: any): value is RefObject<T> {
    return 'current' in value
}

function useEventListener<K extends keyof WindowEventMap>(
    element: Window | null | undefined,
    type: K,
    handler: (event: WindowEventMap[K]) => void
): void
function useEventListener<K extends keyof DocumentEventMap>(
    element: Document | null | undefined,
    type: K,
    handler: (event: DocumentEventMap[K]) => void
): void
function useEventListener<
    K extends keyof HTMLElementEventMap,
    T extends HTMLElement = HTMLDivElement
>(
    element: RefObject<T>,
    type: K,
    handler: (event: HTMLElementEventMap[K]) => void
): void

function useEventListener<
    KW extends keyof WindowEventMap,
    KD extends keyof DocumentEventMap,
    KH extends keyof HTMLElementEventMap,
    T extends HTMLElement | void = void
>(
    element: Window | Document | RefObject<T> | null | undefined,
    type: KW | KD | KH,
    handler: (
        this: typeof element,
        e:
            | WindowEventMap[KW]
            | DocumentEventMap[KD]
            | HTMLElementEventMap[KH]
            | Event
    ) => void
) {
    const handlerRef = useRef(handler)

    useEffect(() => {
        handlerRef.current = handler
    }, [handler])

    useEffect(() => {
        const targetElement = isRefObject(element) ? element.current : element
        if (!targetElement) return

        const listener: typeof handler = (e) =>
            handlerRef.current.call(element, e)

        targetElement.addEventListener(type, listener)
        return () => targetElement.removeEventListener(type, listener)
    }, [type, element])
}

export default useEventListener
