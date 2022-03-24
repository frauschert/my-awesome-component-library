import React, { RefObject, useRef } from 'react'
import useClickOutside from '../../utility/hooks/useClickOutside'
import useContextMenu from '../../utility/hooks/useContextMenu'

import './contextmenu.scss'

export type ContextMenuProps = {
    targetRef: RefObject<HTMLElement>
    children?: React.ReactNode
}

const ContextMenu = ({ targetRef, children }: ContextMenuProps) => {
    const ulRef = useRef<HTMLUListElement>(null)
    const { xPos, yPos, showMenu, close } = useContextMenu(targetRef)

    useClickOutside(ulRef, close)

    return showMenu ? (
        // TODO: consider using react portal here
        <ul
            ref={ulRef}
            className="contextmenu"
            style={{
                top: yPos,
                left: xPos,
            }}
        >
            {children}
        </ul>
    ) : null
}

export default ContextMenu
