import { RefObject, useCallback, useEffect, useRef } from 'react'
import useEventListener from './useEventListener'

type PointerType = 'mouse' | 'pen' | 'touch'
//  indicates the device type (mouse, pen, touch or all) for
export type LongPressType = PointerType | PointerType[]

function isPointerType(type: string): type is PointerType {
    return type === 'mouse' || type === 'pen' || type === 'touch'
}

/**
 * Shared core for long press logic.
 */
function useLongPressCore(
    callback: (event: PointerEvent) => void,
    delay: number = 250,
    type: LongPressType = ['mouse', 'pen', 'touch']
) {
    const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)

    const clear = useCallback(() => {
        if (timeout.current) clearTimeout(timeout.current)
    }, [])

    const set = useCallback(
        (event: PointerEvent) => {
            if (
                isPointerType(event.pointerType) &&
                !type.includes(event.pointerType)
            )
                return
            clear()
            timeout.current = setTimeout(() => callback(event), delay)
        },
        [callback, delay, type, clear]
    )
    return { set, clear }
}

/**
 * useLongPressHandlers is a React-idiomatic hook that returns event handlers for long press detection.
 * Spread the returned handlers onto your element.
 *
 * @example
 *   const handlers = useLongPressHandlers(onLongPress, 500, 'mouse')
 *   return <div {...handlers}>Press and hold me!</div>
 */
export function useLongPressHandlers(
    callback: (event: PointerEvent) => void,
    delay: number = 250,
    type: LongPressType = ['mouse', 'pen', 'touch']
) {
    const { set, clear } = useLongPressCore(callback, delay, type)
    // Handlers are stable
    return {
        onPointerDown: set,
        onPointerUp: clear,
        onPointerLeave: clear,
    }
}

/**
 * useLongPress (default): ref-based API for long press detection.
 *
 * @example
 *   const ref = useRef(null)
 *   useLongPress(ref, onLongPress, 500, 'mouse')
 *   return <div ref={ref}>Press and hold me!</div>
 */
export default function useLongPress(
    ref: RefObject<HTMLElement>,
    callback: (event: PointerEvent) => void,
    delay: number = 250,
    type: LongPressType = ['mouse', 'pen', 'touch']
) {
    const { set, clear } = useLongPressCore(callback, delay, type)
    useEventListener(ref, 'pointerdown', set)
    useEventListener(ref, 'pointerup', clear)
    useEventListener(ref, 'pointerleave', clear)
    useEffect(() => clear, [clear])
}
