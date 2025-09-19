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
    const menuRef = React.useRef<HTMLUListElement>(null)
    const containerRef = React.useRef<HTMLDivElement>(null)

    const adjustPosition = (x: number, y: number) => {
        const menuWidth = 200 // Estimated menu width
        const menuHeight = 300 // Estimated menu height
        const padding = 10

        const adjustedX = Math.min(x, window.innerWidth - menuWidth - padding)
        const adjustedY = Math.min(y, window.innerHeight - menuHeight - padding)

        return {
            left: Math.max(padding, adjustedX),
            top: Math.max(padding, adjustedY),
        }
    }

    const showMenu = (e: React.MouseEvent) => {
        e.preventDefault()
        const adjustedPosition = adjustPosition(e.pageX, e.pageY)
        setMenuVisible(true)
        setPosition(adjustedPosition)

        // Focus menu for accessibility
        setTimeout(() => {
            if (menuRef.current) {
                menuRef.current.focus()
            }
        }, 0)
    }

    const hideMenu = () => {
        setMenuVisible(false)
    }

    // Outside click detection
    React.useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                menuVisible &&
                menuRef.current &&
                !menuRef.current.contains(e.target as Node) &&
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                hideMenu()
            }
        }

        if (menuVisible) {
            document.addEventListener('mousedown', handleClickOutside)
            return () =>
                document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [menuVisible])

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!menuVisible) return

        switch (e.key) {
            case 'Escape':
                e.preventDefault()
                hideMenu()
                break
            case 'ArrowDown':
                e.preventDefault()
                // Focus next menu item logic would go here
                break
            case 'ArrowUp':
                e.preventDefault()
                // Focus previous menu item logic would go here
                break
        }
    }

    return (
        <ContextMenuContext.Provider
            value={{ menuVisible, position, showMenu, hideMenu }}
        >
            <div
                ref={containerRef}
                onContextMenu={showMenu}
                onClick={hideMenu}
                onKeyDown={handleKeyDown}
            >
                {children}
                {menuVisible && (
                    <ul
                        ref={menuRef}
                        className="contextmenu"
                        role="menu"
                        aria-label="Context menu"
                        tabIndex={-1}
                        style={{
                            top: position.top,
                            left: position.left,
                        }}
                    >
                        {menuEntries.map((menuEntry, index) => (
                            <ContextMenuEntry
                                key={index}
                                {...menuEntry}
                                index={index}
                            />
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
