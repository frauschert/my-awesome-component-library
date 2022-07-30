import { RefObject, useCallback, useRef } from 'react'
import useEventListener from './useEventListener'
import type { Permutations } from '../../utility/types'

//  indicates the device type (mouse, pen, touch or all) for
export type LongPressType = Permutations<'mouse' | 'pen' | 'touch'>

const useLongPress = (
    ref: RefObject<HTMLElement>,
    callback: (event: PointerEvent) => void,
    delay: number = 250,
    type: LongPressType = 'mouse pen touch'
) => {
    const timeout = useRef<ReturnType<typeof setTimeout>>()

    const clear = useCallback(() => {
        timeout.current && clearTimeout(timeout.current)
    }, [])

    const set = useCallback(
        (event: PointerEvent) => {
            if (!type.includes(event.pointerType)) return
            clear()

            timeout.current = setTimeout(() => callback(event), delay)
        },
        [callback, delay, type, clear]
    )

    useEventListener(ref, 'pointerdown', set)

    useEventListener(ref, 'pointerup', clear)
    useEventListener(ref, 'pointerleave', clear)
}

export default useLongPress
