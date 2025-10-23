import React, { useState, useCallback, useEffect, ReactNode } from 'react'
import { classNames } from '../../utility/classnames'
import './sidebar.scss'

export interface SidebarItem {
    id: string
    label: string
    icon?: ReactNode
    badge?: string | number
    href?: string
    onClick?: (id: string) => void
    children?: SidebarItem[]
    disabled?: boolean
    divider?: boolean
}

export type SidebarVariant = 'default' | 'floating' | 'bordered'
export type SidebarPosition = 'left' | 'right'
export type SidebarWidth = 'narrow' | 'normal' | 'wide'

export interface SidebarProps {
    items: SidebarItem[]
    collapsed?: boolean
    defaultCollapsed?: boolean
    onCollapsedChange?: (collapsed: boolean) => void
    selectedId?: string
    defaultSelectedId?: string
    onSelect?: (id: string, item: SidebarItem) => void
    expandedIds?: string[]
    defaultExpandedIds?: string[]
    onExpandedChange?: (expandedIds: string[]) => void
    variant?: SidebarVariant
    position?: SidebarPosition
    width?: SidebarWidth
    collapsible?: boolean
    showCollapseButton?: boolean
    collapseIcon?: ReactNode
    expandIcon?: ReactNode
    header?: ReactNode
    footer?: ReactNode
    className?: string
    style?: React.CSSProperties
    renderItem?: (
        item: SidebarItem,
        isSelected: boolean,
        level: number
    ) => ReactNode
}

export const Sidebar: React.FC<SidebarProps> = ({
    items,
    collapsed: controlledCollapsed,
    defaultCollapsed = false,
    onCollapsedChange,
    selectedId: controlledSelectedId,
    defaultSelectedId,
    onSelect,
    expandedIds: controlledExpandedIds,
    defaultExpandedIds = [],
    onExpandedChange,
    variant = 'default',
    position = 'left',
    width = 'normal',
    collapsible = true,
    showCollapseButton = true,
    collapseIcon,
    expandIcon,
    header,
    footer,
    className,
    style,
    renderItem,
}) => {
    // Collapsed state management
    const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed)
    const isCollapsed =
        controlledCollapsed !== undefined
            ? controlledCollapsed
            : internalCollapsed

    // Selected state management
    const [internalSelectedId, setInternalSelectedId] =
        useState(defaultSelectedId)
    const selectedId =
        controlledSelectedId !== undefined
            ? controlledSelectedId
            : internalSelectedId

    // Expanded state management
    const [internalExpandedIds, setInternalExpandedIds] =
        useState<string[]>(defaultExpandedIds)
    const expandedIds =
        controlledExpandedIds !== undefined
            ? controlledExpandedIds
            : internalExpandedIds

    const handleCollapsedToggle = useCallback(() => {
        const newCollapsed = !isCollapsed
        setInternalCollapsed(newCollapsed)
        onCollapsedChange?.(newCollapsed)
    }, [isCollapsed, onCollapsedChange])

    const handleItemClick = useCallback(
        (item: SidebarItem, event: React.MouseEvent) => {
            if (item.disabled) {
                event.preventDefault()
                return
            }

            // If item has children, toggle expansion
            if (item.children && item.children.length > 0) {
                event.preventDefault()
                const newExpandedIds = expandedIds.includes(item.id)
                    ? expandedIds.filter((id) => id !== item.id)
                    : [...expandedIds, item.id]

                setInternalExpandedIds(newExpandedIds)
                onExpandedChange?.(newExpandedIds)
            }

            // Handle selection
            setInternalSelectedId(item.id)
            onSelect?.(item.id, item)

            // Handle custom onClick
            item.onClick?.(item.id)

            // If item has href and no children, let the link work normally
            if (!item.children && item.href) {
                // Link will navigate
            }
        },
        [expandedIds, onExpandedChange, onSelect]
    )

    const renderSidebarItem = (
        item: SidebarItem,
        level: number = 0
    ): ReactNode => {
        if (item.divider) {
            return (
                <div
                    key={`divider-${item.id}`}
                    className="sidebar__divider"
                    role="separator"
                />
            )
        }

        const isSelected = selectedId === item.id
        const isExpanded = expandedIds.includes(item.id)
        const hasChildren = item.children && item.children.length > 0

        // Custom render
        if (renderItem) {
            return (
                <div key={item.id}>{renderItem(item, isSelected, level)}</div>
            )
        }

        const itemContent = (
            <>
                {item.icon && (
                    <span className="sidebar__item-icon" aria-hidden="true">
                        {item.icon}
                    </span>
                )}
                {!isCollapsed && (
                    <>
                        <span className="sidebar__item-label">
                            {item.label}
                        </span>
                        {item.badge !== undefined && (
                            <span
                                className="sidebar__item-badge"
                                aria-label={`${item.badge} items`}
                            >
                                {item.badge}
                            </span>
                        )}
                        {hasChildren && (
                            <span
                                className="sidebar__item-arrow"
                                aria-hidden="true"
                            >
                                {isExpanded ? '▼' : '▶'}
                            </span>
                        )}
                    </>
                )}
            </>
        )

        const itemClasses = classNames(
            'sidebar__item',
            isSelected && 'sidebar__item--selected',
            item.disabled && 'sidebar__item--disabled',
            hasChildren && 'sidebar__item--has-children',
            isExpanded && 'sidebar__item--expanded',
            isCollapsed && 'sidebar__item--collapsed'
        )

        const itemElement =
            item.href && !item.disabled && !hasChildren ? (
                <a
                    href={item.href}
                    className={itemClasses}
                    style={{ paddingLeft: `${level * 20 + 16}px` }}
                    onClick={(e) => handleItemClick(item, e)}
                    aria-current={isSelected ? 'page' : undefined}
                    aria-disabled={item.disabled}
                >
                    {itemContent}
                </a>
            ) : (
                <button
                    type="button"
                    className={itemClasses}
                    style={{ paddingLeft: `${level * 20 + 16}px` }}
                    onClick={(e) => handleItemClick(item, e)}
                    disabled={item.disabled}
                    aria-current={isSelected ? 'page' : undefined}
                    aria-expanded={hasChildren ? isExpanded : undefined}
                >
                    {itemContent}
                </button>
            )

        return (
            <div key={item.id} className="sidebar__item-wrapper">
                {itemElement}
                {hasChildren && isExpanded && !isCollapsed && (
                    <div className="sidebar__children" role="group">
                        {item.children!.map((child) =>
                            renderSidebarItem(child, level + 1)
                        )}
                    </div>
                )}
            </div>
        )
    }

    const sidebarClasses = classNames(
        'sidebar',
        `sidebar--${variant}`,
        `sidebar--${position}`,
        `sidebar--${width}`,
        isCollapsed && 'sidebar--collapsed',
        className
    )

    return (
        <aside
            className={sidebarClasses}
            style={style}
            role="navigation"
            aria-label="Sidebar navigation"
        >
            {header && <div className="sidebar__header">{header}</div>}
            <div className="sidebar__nav">
                {items.map((item) => renderSidebarItem(item))}
            </div>
            {footer && !isCollapsed && (
                <div className="sidebar__footer">{footer}</div>
            )}
            {collapsible && showCollapseButton && (
                <button
                    type="button"
                    className="sidebar__collapse-button"
                    onClick={handleCollapsedToggle}
                    aria-label={
                        isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'
                    }
                    aria-expanded={!isCollapsed}
                >
                    {isCollapsed
                        ? expandIcon || <span aria-hidden="true">→</span>
                        : collapseIcon || <span aria-hidden="true">←</span>}
                </button>
            )}
        </aside>
    )
}

export default Sidebar
