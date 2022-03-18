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

    useEventListener(ref.current, 'mousedown', reset)
    useEventListener(ref.current, 'touchstart', reset)

    useEventListener(ref.current, 'mouseup', clear)
    useEventListener(ref.current, 'mouseleave', clear)
    useEventListener(ref.current, 'touchend', clear)
}

export default useLongPress
