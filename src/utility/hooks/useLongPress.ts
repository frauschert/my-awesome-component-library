import { useCallback, useRef, useState } from 'react'
import isTouchEvent from '../guards/isTouchEvent'

const useLongPress = (
    onLongPress: (e: MouseEvent | TouchEvent) => void,
    onClick: () => void,
    { shouldPreventDefault = true, delay = 300 } = {}
) => {
    const [longPressTriggered, setLongPressTriggered] = useState(false)
    const timeout = useRef<ReturnType<typeof setTimeout>>()
    const target = useRef<EventTarget>()

    const start = useCallback(
        (event: MouseEvent | TouchEvent) => {
            if (shouldPreventDefault && event.target) {
                event.target.addEventListener(
                    'touchend',
                    () => preventDefault(event),
                    {
                        passive: false,
                    }
                )
                target.current = event.target
            }
            timeout.current = setTimeout(() => {
                onLongPress(event)
                setLongPressTriggered(true)
            }, delay)
        },
        [onLongPress, delay, shouldPreventDefault]
    )

    const clear = useCallback(
        (event: MouseEvent | TouchEvent, shouldTriggerClick = true) => {
            timeout.current && clearTimeout(timeout.current)
            shouldTriggerClick && !longPressTriggered && onClick()
            setLongPressTriggered(false)
            if (shouldPreventDefault && target.current) {
                target.current.removeEventListener('touchend', () =>
                    preventDefault(event)
                )
            }
        },
        [shouldPreventDefault, onClick, longPressTriggered]
    )

    return {
        onMouseDown: (e: MouseEvent) => start(e),
        onTouchStart: (e: TouchEvent) => start(e),
        onMouseUp: (e: MouseEvent) => clear(e),
        onMouseLeave: (e: MouseEvent) => clear(e, false),
        onTouchEnd: (e: TouchEvent) => clear(e),
    }
}

const preventDefault = (event: MouseEvent | TouchEvent) => {
    if (!isTouchEvent(event)) return

    if (event.touches.length < 2 && event.preventDefault) {
        event.preventDefault()
    }
}

export default useLongPress
