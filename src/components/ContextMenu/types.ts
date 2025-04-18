export type MenuItem = {
    type: 'item'
    label: string
    onClick: () => void
    icon?: React.ReactNode
    disabled?: boolean
    shortcut?: string
}

export type MenuDivider = {
    type: 'divider'
}

export type MenuSubmenu = {
    type: 'submenu'
    label: string
    children: MenuEntry[]
    icon?: React.ReactNode
}

export type MenuEntry = MenuItem | MenuSubmenu | MenuDivider
