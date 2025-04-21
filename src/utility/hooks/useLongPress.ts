import { RefObject, useCallback, useEffect, useRef } from 'react'
import useEventListener from './useEventListener'

type PointerType = 'mouse' | 'pen' | 'touch'
//  indicates the device type (mouse, pen, touch or all) for
export type LongPressType = PointerType | PointerType[]

function isPointerType(type: string): type is PointerType {
    return type === 'mouse' || type === 'pen' || type === 'touch'
}
/**
 * useLongPress is a custom hook that detects long press events on a given element.
 * It uses the PointerEvent API to handle different input types (mouse, pen, touch).
 *
 * @param ref - A ref to the target element.
 * @param callback - The function to call when a long press is detected.
 * @param delay - The duration (in milliseconds) for which the press must be held to trigger the callback.
 * @param type - The type of pointer events to listen for (default: 'mouse pen touch').
 */
// @example
// const ref = useRef(null)
// const handleLongPress = (event) => {
//     console.log('Long press detected!', event)
// }
// useLongPress(ref, handleLongPress, 500, 'mouse')
// const MyComponent = () => {
//     return <div ref={ref}>Press and hold me!</div>
// }
// export const Box = forwardRef<HTMLDivElement, BoxProps<'div'>>(
//     ({ children, ...props }, ref) => (
//         <div ref={ref} {...props}>
//             {children}
//         </div>
//     )
// )
// )
export default function useLongPress(
    ref: RefObject<HTMLElement>,
    callback: (event: PointerEvent) => void,
    delay: number = 250,
    type: LongPressType = ['mouse', 'pen', 'touch']
) {
    const timeout = useRef<ReturnType<typeof setTimeout>>()

    const clear = useCallback(() => {
        timeout.current && clearTimeout(timeout.current)
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

    useEventListener(ref, 'pointerdown', set)

    useEventListener(ref, 'pointerup', clear)
    useEventListener(ref, 'pointerleave', clear)

    // Cleanup on unmount
    useEffect(() => clear, [clear])
}
