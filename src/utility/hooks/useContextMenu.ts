import { RefObject, useCallback, useState } from 'react'
import useEventListener from './useEventListener'
import useLongPress, { LongPressType } from './useLongPress'

function isTouchEvent(event: unknown): event is TouchEvent {
    return !!event && typeof event === 'object' && 'touches' in event
}

const useContextMenu = <T extends HTMLElement>(
    ref: RefObject<T>,
    type: LongPressType = 'mouse pen touch'
) => {
    const [xPos, setXPos] = useState(0)
    const [yPos, setYPos] = useState(0)
    const [showMenu, setShowMenu] = useState(false)

    const handleContextMenu = useCallback(
        (e: MouseEvent | TouchEvent | PointerEvent) => {
            e.preventDefault()

            if (!isTouchEvent(e)) {
                setXPos(e.pageX)
                setYPos(e.pageY)
            } else {
                const touch = e.touches[0]
                setXPos(touch.pageX)
                setYPos(touch.pageY)
            }
            setShowMenu(true)
        },
        [setXPos, setYPos]
    )

    const close = useCallback(() => {
        showMenu && setShowMenu(false)
    }, [showMenu])

    useEventListener(ref, 'contextmenu', handleContextMenu)

    useLongPress(ref, handleContextMenu, 500, type)

    return { xPos, yPos, showMenu, close }
}

export default useContextMenu
