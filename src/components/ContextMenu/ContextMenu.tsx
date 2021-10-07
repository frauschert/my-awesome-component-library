import React, { PropsWithChildren } from 'react'
import useContextMenu from '../../utility/hooks/useContextMenu'

import './contextmenu.css'

const ContextMenu = (props: PropsWithChildren<{}>) => {
    const { xPos, yPos, showMenu } = useContextMenu()

    const { children } = props

    return showMenu ? (
        <ul
            className="menu"
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
