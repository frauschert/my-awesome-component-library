import React, { useState, useRef, useEffect } from 'react'
import './navbar.scss'
import { classNames } from '../../utility/classnames'

export interface NavBarItem {
    id: string
    label: string
    href?: string
    icon?: React.ReactNode
    badge?: number | string
    disabled?: boolean
    items?: NavBarItem[] // Nested items for dropdowns
    onClick?: (event: React.MouseEvent<HTMLElement>) => void
}

export type NavBarVariant = 'default' | 'elevated' | 'bordered'
export type NavBarPosition = 'static' | 'sticky' | 'fixed'

export interface NavBarProps {
    /** Brand/logo content (left side) */
    brand?: React.ReactNode
    /** Navigation items */
    items?: NavBarItem[]
    /** Right-aligned content (e.g., user menu, actions) */
    actions?: React.ReactNode
    /** Visual variant */
    variant?: NavBarVariant
    /** Positioning behavior */
    position?: NavBarPosition
    /** Active item ID */
    activeId?: string
    /** Show mobile menu toggle button */
    showMobileToggle?: boolean
    /** Collapsed state (controlled) */
    collapsed?: boolean
    /** Callback when collapse state changes */
    onCollapseChange?: (collapsed: boolean) => void
    /** Additional CSS class */
    className?: string
    /** Additional styles */
    style?: React.CSSProperties
    /** ARIA label */
    'aria-label'?: string
}

export const NavBar: React.FC<NavBarProps> = ({
    brand,
    items = [],
    actions,
    variant = 'default',
    position = 'static',
    activeId,
    showMobileToggle = true,
    collapsed: controlledCollapsed,
    onCollapseChange,
    className,
    style,
    'aria-label': ariaLabel = 'Main navigation',
}) => {
    const [internalCollapsed, setInternalCollapsed] = useState(true)
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
    const navRef = useRef<HTMLElement>(null)

    const isCollapsed =
        controlledCollapsed !== undefined
            ? controlledCollapsed
            : internalCollapsed

    const handleToggle = () => {
        const newCollapsed = !isCollapsed
        setInternalCollapsed(newCollapsed)
        onCollapseChange?.(newCollapsed)
    }

    const handleItemClick = (
        item: NavBarItem,
        event: React.MouseEvent<HTMLElement>
    ) => {
        if (item.disabled) {
            event.preventDefault()
            return
        }

        // Toggle dropdown if it has nested items
        if (item.items && item.items.length > 0) {
            event.preventDefault()
            setOpenDropdownId(openDropdownId === item.id ? null : item.id)
            return
        }

        // Call custom onClick
        item.onClick?.(event)

        // Close mobile menu after clicking a link
        if (window.innerWidth < 768) {
            setInternalCollapsed(true)
            onCollapseChange?.(true)
        }
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                navRef.current &&
                !navRef.current.contains(event.target as Node)
            ) {
                setOpenDropdownId(null)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () =>
            document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const renderNavItem = (item: NavBarItem, isNested = false) => {
        const hasDropdown = item.items && item.items.length > 0
        const isOpen = openDropdownId === item.id
        const isActive = activeId === item.id

        const itemClasses = classNames(
            'navbar__item',
            isNested && 'navbar__item--nested',
            isActive && 'navbar__item--active',
            item.disabled && 'navbar__item--disabled',
            hasDropdown && 'navbar__item--dropdown',
            isOpen && 'navbar__item--open'
        )

        const content = (
            <>
                {item.icon && (
                    <span className="navbar__item-icon">{item.icon}</span>
                )}
                <span className="navbar__item-label">{item.label}</span>
                {item.badge !== undefined && (
                    <span className="navbar__item-badge">{item.badge}</span>
                )}
                {hasDropdown && (
                    <span className="navbar__item-arrow">
                        <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M3 4.5L6 7.5L9 4.5"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </span>
                )}
            </>
        )

        return (
            <li key={item.id} className={itemClasses}>
                {item.href && !hasDropdown ? (
                    <a
                        href={item.href}
                        className="navbar__item-link"
                        onClick={(e) => handleItemClick(item, e)}
                        aria-current={isActive ? 'page' : undefined}
                        aria-disabled={item.disabled}
                    >
                        {content}
                    </a>
                ) : (
                    <button
                        type="button"
                        className="navbar__item-button"
                        onClick={(e) => handleItemClick(item, e)}
                        disabled={item.disabled}
                        aria-expanded={hasDropdown ? isOpen : undefined}
                        aria-haspopup={hasDropdown ? 'true' : undefined}
                    >
                        {content}
                    </button>
                )}
                {hasDropdown && isOpen && (
                    <ul className="navbar__dropdown" role="menu">
                        {item.items?.map((nestedItem) =>
                            renderNavItem(nestedItem, true)
                        )}
                    </ul>
                )}
            </li>
        )
    }

    const navClasses = classNames(
        'navbar',
        `navbar--${variant}`,
        `navbar--${position}`,
        !isCollapsed && 'navbar--expanded',
        className
    )

    return (
        <nav
            ref={navRef}
            className={navClasses}
            style={style}
            aria-label={ariaLabel}
        >
            <div className="navbar__container">
                {brand && <div className="navbar__brand">{brand}</div>}

                {showMobileToggle && (
                    <button
                        type="button"
                        className="navbar__toggle"
                        onClick={handleToggle}
                        aria-expanded={!isCollapsed}
                        aria-label="Toggle navigation menu"
                    >
                        <span className="navbar__toggle-icon">
                            <span />
                            <span />
                            <span />
                        </span>
                    </button>
                )}

                <div className="navbar__content">
                    {items.length > 0 && (
                        <ul className="navbar__items" role="menubar">
                            {items.map((item) => renderNavItem(item))}
                        </ul>
                    )}

                    {actions && (
                        <div className="navbar__actions">{actions}</div>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default NavBar
