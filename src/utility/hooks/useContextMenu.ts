import { RefObject, useCallback, useState } from 'react'
import isTouchEvent from '../guards/isTouchEvent'
import useEventListener from './useEventListener'

const useContextMenu = <T extends HTMLElement>(ref: RefObject<T>) => {
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

    const close = useCallback(() => {
        showMenu && setShowMenu(false)
    }, [showMenu])

    useEventListener(ref, 'contextmenu', handleContextMenu)

    //TODO: support for long press...

    return { xPos, yPos, showMenu, close }
}

export default useContextMenu
