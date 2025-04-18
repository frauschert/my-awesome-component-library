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
    const [submenuIndex, setSubmenuIndex] = React.useState<number | null>(null)
    return (
        <li
            className="menu-submenu"
            onMouseEnter={() => setSubmenuIndex(props.index)}
            onMouseLeave={() => setSubmenuIndex(null)}
        >
            {props.icon && <span className="icon">{props.icon}</span>}
            {props.label}
            {submenuIndex === props.index && (
                <ul className="submenu">
                    {props.children.map((entry, index) => (
                        <ContextMenuEntry
                            key={index}
                            index={index}
                            {...entry}
                        />
                    ))}
                </ul>
            )}
        </li>
    )
}
