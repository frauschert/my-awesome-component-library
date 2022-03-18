import { useCallback, useState } from 'react'
import isTouchEvent from '../guards/isTouchEvent'
import useEventListener from './useEventListener'
import useLongPress from './useLongPress'

const useContextMenu = () => {
    const [xPos, setXPos] = useState(0)
    const [yPos, setYPos] = useState(0)
    const [showMenu, setShowMenu] = useState(false)

    const handleContextMenu = useCallback(
        (e: MouseEvent | TouchEvent) => {
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

    const handleClick = useCallback(() => {
        showMenu && setShowMenu(false)
    }, [showMenu])

    const { onMouseDown, onMouseUp, onMouseLeave, onTouchStart, onTouchEnd } =
        useLongPress(handleContextMenu, () => console.log('Click triggered!'), {
            shouldPreventDefault: true,
            delay: 5000,
        })

    useEventListener(document, 'click', handleClick)
    useEventListener(document, 'contextmenu', handleContextMenu)
    useEventListener(document, 'mousedown', onMouseDown)
    useEventListener(document, 'mouseup', onMouseUp)
    useEventListener(document, 'mouseleave', onMouseLeave)
    useEventListener(document, 'touchstart', onTouchStart)
    useEventListener(document, 'touchend', onTouchEnd)

    return { xPos, yPos, showMenu }
}

export default useContextMenu
