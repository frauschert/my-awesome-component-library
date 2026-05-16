import React from 'react'

interface ContextMenuContextProps {
    menuVisible: boolean
    position: { top: number; left: number }
    showMenu: (e: React.MouseEvent) => void
    hideMenu: () => void
    focusedIndex: number
    setFocusedIndex: (index: number) => void
}

export const ContextMenuContext = React.createContext<
    ContextMenuContextProps | undefined
>(undefined)

export function useContextMenu() {
    const context = React.useContext(ContextMenuContext)
    if (!context) {
        throw new Error(
            'useContextMenu must be used within a ContextMenuProvider'
        )
    }
    return context
}
