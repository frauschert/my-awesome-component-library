import { ReactNode } from 'react'

export interface DropdownMenuItem<T = any> {
    id: string | number
    label: string | ReactNode
    value: T
    disabled?: boolean
    icon?: ReactNode
    children?: DropdownMenuItem<T>[]
}

export interface DropdownMenuProps<T = any> {
    // Required props
    items: DropdownMenuItem<T>[]

    // Control props
    value?: T | T[]
    defaultValue?: T | T[]
    onChange?: (value: T | T[]) => void
    onOpenChange?: (isOpen: boolean) => void
    open?: boolean
    defaultOpen?: boolean

    // Customization
    trigger?: ReactNode
    renderItem?: (item: DropdownMenuItem<T>) => ReactNode
    placement?: 'top' | 'bottom' | 'left' | 'right'

    // Behavior options
    closeOnSelect?: boolean
    multiple?: boolean
    searchable?: boolean
    searchPlaceholder?: string
    maxHeight?: number | string

    // Styling
    className?: string
    variant?: 'default' | 'primary' | 'secondary'
    size?: 'small' | 'medium' | 'large'

    // Accessibility
    'aria-label'?: string
    disabled?: boolean
}

export interface DropdownContextValue<T = any> {
    selectedValues: T[]
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    onSelect: (value: T) => void
    multiple?: boolean
}
