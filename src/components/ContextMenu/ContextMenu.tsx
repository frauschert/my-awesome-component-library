import React, { RefObject, useRef } from 'react'
import useClickOutside from '../../utility/hooks/useClickOutside'
import useContextMenu from '../../utility/hooks/useContextMenu'

import './contextmenu.scss'

export type ContextMenuProps<T extends HTMLElement> = {
    targetRef: RefObject<T>
    children?: React.ReactNode
}

const ContextMenu = <T extends HTMLElement>({
    targetRef,
    children,
}: ContextMenuProps<T>) => {
    const ulRef = useRef<HTMLUListElement>(null)
    const { xPos, yPos, showMenu, close } = useContextMenu(targetRef, 'touch')

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
