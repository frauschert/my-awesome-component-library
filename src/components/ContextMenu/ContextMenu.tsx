/* eslint-disable react/prop-types */
import React, { forwardRef, RefObject } from 'react'
import useContextMenu from '../../utility/hooks/useContextMenu'

import './contextmenu.css'

export type ContextMenuProps = { children?: React.ReactNode }

const ContextMenu = forwardRef<HTMLElement, ContextMenuProps>((props, ref) => {
    const { xPos, yPos, showMenu } = useContextMenu(
        ref as RefObject<HTMLElement>
    )

    return showMenu ? (
        <ul
            className="contextmenu"
            style={{
                top: yPos,
                left: xPos,
            }}
        >
            {props.children}
        </ul>
    ) : null
})

ContextMenu.displayName = 'ContextMenu'

export default ContextMenu
