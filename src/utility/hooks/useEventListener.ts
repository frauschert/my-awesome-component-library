import { RefObject, useEffect, useRef } from 'react'

const isRefObject = <T extends HTMLElement>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any
): value is RefObject<T> =>
    !!value && typeof value == 'object' && 'current' in value

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
    element: RefObject<T> | null | undefined,
    type: K,
    handler: (event: HTMLElementEventMap[K]) => void
): void

function useEventListener<
    KW extends keyof WindowEventMap,
    KD extends keyof DocumentEventMap,
    KH extends keyof HTMLElementEventMap,
    T extends HTMLElement
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
        const target = isRefObject(element) ? element.current : element
        if (!target) return

        const listener: typeof handler = (e) =>
            handlerRef.current.call(element, e)

        target.addEventListener(type, listener)
        return () => target.removeEventListener(type, listener)
    }, [type, element])
}

export default useEventListener
