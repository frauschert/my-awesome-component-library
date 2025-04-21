import { RefObject, useEffect, useRef } from 'react'

const isRefObject = <T extends HTMLElement>(
    value: unknown
): value is RefObject<T> =>
    !!value && typeof value == 'object' && 'current' in value

/**
 * Custom hook to add an event listener to a DOM element.
 *
 * @param {Window | Document | HTMLElement | RefObject<HTMLElement> | null | undefined} element - The target element to attach the event listener to.
 * @param {string} type - The type of event to listen for (e.g., 'click', 'scroll').
 * @param {function} handler - The event handler function to be called when the event occurs.
 * @param {boolean | AddEventListenerOptions | undefined} options - Options for the event listener (e.g., capture, passive).
 * @returns {void}
 */
function useEventListener<K extends keyof WindowEventMap>(
    element: Window | null | undefined,
    type: K,
    handler: (event: WindowEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions | undefined
): void
function useEventListener<K extends keyof DocumentEventMap>(
    element: Document | null | undefined,
    type: K,
    handler: (event: DocumentEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions | undefined
): void
function useEventListener<
    K extends keyof HTMLElementEventMap,
    T extends HTMLElement = HTMLDivElement
>(
    element: T | null | undefined,
    type: K,
    handler: (event: HTMLElementEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions | undefined
): void
function useEventListener<
    K extends keyof HTMLElementEventMap,
    T extends HTMLElement = HTMLDivElement
>(
    element: RefObject<T> | null | undefined,
    type: K,
    handler: (event: HTMLElementEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions | undefined
): void

function useEventListener<
    KW extends keyof WindowEventMap,
    KD extends keyof DocumentEventMap,
    KH extends keyof HTMLElementEventMap,
    T extends HTMLElement
>(
    element: Window | Document | T | RefObject<T> | null | undefined,
    type: KW | KD | KH,
    handler: (
        this: typeof element,
        e:
            | WindowEventMap[KW]
            | DocumentEventMap[KD]
            | HTMLElementEventMap[KH]
            | Event
    ) => void,
    options?: boolean | AddEventListenerOptions | undefined
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

        target.addEventListener(type, listener, options)
        return () => target.removeEventListener(type, listener, options)
    }, [type, element, options])
}

export default useEventListener
