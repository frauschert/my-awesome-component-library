import React, { useContext } from 'react'
import type {
    MenuEntry,
    MenuItem as ContextMenuItem,
    MenuDivider,
    MenuSubmenu,
} from './types'
import { useContextMenu } from './ContextMenuProvider'

type ContextMenuEntryProps = MenuEntry & { index: number }

export function ContextMenuEntry({ index, ...rest }: ContextMenuEntryProps) {
    if (rest.type === 'divider') {
        return <ContextMenuDivider {...rest} />
    }
    if (rest.type === 'submenu') {
        return <ContextMenuSubmenu {...rest} index={index} />
    }

    return <ContextMenuItem {...rest} />
}

function ContextMenuItem(props: ContextMenuItem) {
    const { hideMenu } = useContextMenu()
    return (
        <li
            className={`menu-item ${props.disabled ? 'disabled' : ''}`}
            onClick={() => {
                props.onClick()
                hideMenu()
            }}
        >
            {props.icon && <span className="icon">{props.icon}</span>}
            {props.label}
            {props.shortcut && (
                <span className="shortcut">{props.shortcut}</span>
            )}
        </li>
    )
}
export function ContextMenuDivider(props: MenuDivider) {
    return <li className="menu-divider" />
}

export function ContextMenuSubmenu(props: MenuSubmenu & { index: number }) {
    const [open, setOpen] = React.useState(false)
    let timeout: NodeJS.Timeout | null = null

    // Open submenu on hover, close on mouse leave with delay for better UX
    const handleMouseEnter = () => {
        if (timeout) clearTimeout(timeout)
        setOpen(true)
    }
    const handleMouseLeave = () => {
        timeout = setTimeout(() => setOpen(false), 120)
    }

    return (
        <li
            className="menu-submenu"
            tabIndex={0}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onFocus={handleMouseEnter}
            onBlur={handleMouseLeave}
            aria-haspopup="menu"
            aria-expanded={open}
        >
            {props.icon && <span className="icon">{props.icon}</span>}
            {props.label}
            {open && (
                <ul className="submenu">
                    {props.children.map((entry, idx) => (
                        <ContextMenuEntry key={idx} index={idx} {...entry} />
                    ))}
                </ul>
            )}
        </li>
    )
}
