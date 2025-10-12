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
        e:
            | WindowEventMap[KW]
            | DocumentEventMap[KD]
            | HTMLElementEventMap[KH]
            | Event
    ) => void,
    options?: boolean | AddEventListenerOptions | undefined
) {
    const handlerRef = useRef(handler)
    const optionsRef = useRef(options)

    useEffect(() => {
        handlerRef.current = handler
    }, [handler])

    useEffect(() => {
        optionsRef.current = options
    }, [options])

    useEffect(() => {
        const eventTarget = isRefObject(element) ? element.current : element
        if (!eventTarget) return

        const listener = (event: Event) => handlerRef.current(event)
        eventTarget.addEventListener(type, listener, optionsRef.current)
        return () => {
            eventTarget.removeEventListener(type, listener, optionsRef.current)
        }
    }, [element, type])
}

export default useEventListener
