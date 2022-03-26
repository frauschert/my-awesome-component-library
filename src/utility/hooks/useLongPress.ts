import { RefObject } from 'react'
import useEffectOnce from './useEffectOnce'
import useEventListener from './useEventListener'
import useTimeout from './useTimeout'

const useLongPress = (
    ref: RefObject<HTMLElement>,
    callback: () => void,
    delay: number = 250
) => {
    const { reset, clear } = useTimeout(callback, delay)
    useEffectOnce(clear)

    useEventListener(ref, 'mousedown', reset)
    useEventListener(ref, 'touchstart', reset)

    useEventListener(ref, 'mouseup', clear)
    useEventListener(ref, 'mouseleave', clear)
    useEventListener(ref, 'touchend', clear)
}

export default useLongPress
