import './contextmenu.scss'
import React from 'react'
import type { MenuEntry } from './types'
import { ContextMenuEntry } from './MenuEntry'

interface ContextMenuContextProps {
    menuVisible: boolean
    position: { top: number; left: number }
    showMenu: (e: React.MouseEvent) => void
    hideMenu: () => void
}

const ContextMenuContext = React.createContext<
    ContextMenuContextProps | undefined
>(undefined)

interface ContextMenuProviderProps {
    menuEntries: MenuEntry[]
    children: React.ReactNode
}

export function ContextMenuProvider({
    menuEntries,
    children,
}: ContextMenuProviderProps) {
    const [menuVisible, setMenuVisible] = React.useState(false)
    const [position, setPosition] = React.useState({ top: 0, left: 0 })

    const showMenu = (e: React.MouseEvent) => {
        e.preventDefault()
        setMenuVisible(true)
        setPosition({
            top: e.pageY,
            left: e.pageX,
        })
    }

    const hideMenu = () => {
        setMenuVisible(false)
    }

    return (
        <ContextMenuContext.Provider
            value={{ menuVisible, position, showMenu, hideMenu }}
        >
            <div onContextMenu={showMenu} onClick={hideMenu}>
                {children}
                {menuVisible && (
                    <ul
                        className="contextmenu"
                        style={{
                            top: position.top,
                            left: position.left,
                        }}
                    >
                        {menuEntries.map((menuEntry, index) => (
                            <ContextMenuEntry {...menuEntry} index={index} />
                        ))}
                    </ul>
                )}
            </div>
        </ContextMenuContext.Provider>
    )
}

export function useContextMenu() {
    const context = React.useContext(ContextMenuContext)
    if (!context) {
        throw new Error(
            'useContextMenu must be used within a ContextMenuProvider'
        )
    }
    return context
}
