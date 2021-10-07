import { useCallback, useEffect, useState } from 'react'

const useContextMenu = () => {
    const [xPos, setXPos] = useState(0)
    const [yPos, setYPos] = useState(0)
    const [showMenu, setShowMenu] = useState(false)

    const handleContextMenu = useCallback(
        (e: MouseEvent) => {
            e.preventDefault()

            setXPos(e.pageX)
            setYPos(e.pageY)
            setShowMenu(true)
        },
        [setXPos, setYPos]
    )

    const handleClick = useCallback(() => {
        showMenu && setShowMenu(false)
    }, [showMenu])

    useEffect(() => {
        document.addEventListener('click', handleClick)
        document.addEventListener('contextmenu', handleContextMenu)
        return () => {
            document.removeEventListener('click', handleClick)
            document.removeEventListener('contextmenu', handleContextMenu)
        }
    })

    return { xPos, yPos, showMenu }
}

export default useContextMenu
