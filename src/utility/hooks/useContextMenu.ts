import { useCallback, useEffect, useState } from 'react'
import isTouchEvent from '../guards/isTouchEvent'
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

    useEffect(() => {
        document.addEventListener('click', handleClick)
        document.addEventListener('contextmenu', handleContextMenu)
        document.addEventListener('mousedown', onMouseDown)
        document.addEventListener('mouseup', onMouseUp)
        document.addEventListener('mouseleave', onMouseLeave)
        document.addEventListener('touchstart', onTouchStart)
        document.addEventListener('touchend', onTouchEnd)
        return () => {
            document.removeEventListener('click', handleClick)
            document.removeEventListener('contextmenu', handleContextMenu)
            document.removeEventListener('mousedown', onMouseDown)
            document.removeEventListener('mouseup', onMouseUp)
            document.removeEventListener('mouseleave', onMouseLeave)
            document.removeEventListener('touchstart', onTouchStart)
            document.removeEventListener('touchend', onTouchEnd)
        }
    })

    return { xPos, yPos, showMenu }
}

export default useContextMenu
