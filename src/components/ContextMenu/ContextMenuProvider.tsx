import './contextmenu.scss'
import React from 'react'
import { createPortal } from 'react-dom'
import type { MenuEntry } from './types'
import { ContextMenuEntry } from './MenuEntry'
import { ContextMenuContext } from './ContextMenuContext'

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
    const [isPositioned, setIsPositioned] = React.useState(false)
    const [focusedIndex, setFocusedIndex] = React.useState(0)
    const menuRef = React.useRef<HTMLUListElement>(null)
    const containerRef = React.useRef<HTMLDivElement>(null)

    const adjustPosition = (x: number, y: number, rect?: DOMRect) => {
        const menuWidth = rect?.width || 200
        const menuHeight = rect?.height || 300
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
        // In some tests or environments, pageX/pageY may be undefined.
        // Fallback to clientX/clientY or 0 to avoid NaN styles.
        const nativeEvent = e.nativeEvent as MouseEvent
        const x = nativeEvent.pageX ?? e.clientX ?? 0
        const y = nativeEvent.pageY ?? e.clientY ?? 0

        setPosition({ left: x, top: y })
        setMenuVisible(true)
        setIsPositioned(false)
        setFocusedIndex(0)

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

    // Adjust position after menu renders with actual dimensions
    React.useEffect(() => {
        if (menuVisible && !isPositioned && menuRef.current) {
            const rect = menuRef.current.getBoundingClientRect()
            const adjustedPosition = adjustPosition(
                position.left,
                position.top,
                rect
            )
            setPosition(adjustedPosition)
            setIsPositioned(true)
        }
    }, [menuVisible, isPositioned, position.left, position.top])

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

        const focusableItems = menuEntries.filter(
            (entry): entry is Extract<MenuEntry, { type: 'item' }> =>
                entry.type === 'item' && !entry.disabled
        )

        switch (e.key) {
            case 'Escape':
                e.preventDefault()
                hideMenu()
                break
            case 'ArrowDown':
                e.preventDefault()
                setFocusedIndex((prev) =>
                    Math.min(prev + 1, focusableItems.length - 1)
                )
                break
            case 'ArrowUp':
                e.preventDefault()
                setFocusedIndex((prev) => Math.max(prev - 1, 0))
                break
        }
    }

    return (
        <ContextMenuContext.Provider
            value={{
                menuVisible,
                position,
                showMenu,
                hideMenu,
                focusedIndex,
                setFocusedIndex,
            }}
        >
            <div
                ref={containerRef}
                onContextMenu={showMenu}
                onKeyDown={handleKeyDown}
            >
                {children}
            </div>
            {menuVisible &&
                createPortal(
                    <ul
                        ref={menuRef}
                        className="contextmenu"
                        role="menu"
                        aria-label="Context menu"
                        tabIndex={-1}
                        style={{
                            top: `${position.top}px`,
                            left: `${position.left}px`,
                            position: 'fixed',
                        }}
                    >
                        {menuEntries.map((menuEntry, index) => (
                            <ContextMenuEntry
                                key={`menu-${index}-${menuEntry.type}`}
                                {...menuEntry}
                                index={index}
                            />
                        ))}
                    </ul>,
                    document.body
                )}
        </ContextMenuContext.Provider>
    )
}
