import React, { useState, useCallback, useRef } from 'react'
import { classNames } from '../../utility/classnames'
import './tabs.scss'

export type TabVariant = 'default' | 'card' | 'line'

export interface TabItem {
    /**
     * Unique identifier for the tab
     */
    id: string

    /**
     * Tab label/title
     */
    label: React.ReactNode

    /**
     * Optional icon to display before label
     */
    icon?: React.ReactNode

    /**
     * Tab content
     */
    content: React.ReactNode

    /**
     * Disable this specific tab
     * @default false
     */
    disabled?: boolean

    /**
     * Optional badge/count to display
     */
    badge?: React.ReactNode
}

export interface TabsProps {
    /**
     * Array of tab items
     */
    items: TabItem[]

    /**
     * Visual style variant
     * @default 'default'
     */
    variant?: TabVariant

    /**
     * Currently active tab ID (controlled mode)
     */
    activeId?: string

    /**
     * Initial active tab ID (uncontrolled mode)
     * @default First tab ID
     */
    defaultActiveId?: string

    /**
     * Callback when active tab changes
     */
    onChange?: (tabId: string) => void

    /**
     * Additional CSS class names
     */
    className?: string

    /**
     * Accessible label for the tabs
     */
    ariaLabel?: string

    /**
     * Size of tabs
     * @default 'md'
     */
    size?: 'sm' | 'md' | 'lg'

    /**
     * Animate the content transition
     * @default true
     */
    animated?: boolean

    /**
     * Allow scrolling for overflow tabs (mobile)
     * @default true
     */
    scrollable?: boolean

    /**
     * Full width tabs
     * @default false
     */
    fullWidth?: boolean
}

/**
 * Tabs component for organizing content into labeled sections
 */
const Tabs: React.FC<TabsProps> = ({
    items,
    variant = 'default',
    activeId,
    defaultActiveId,
    onChange,
    className,
    ariaLabel,
    size = 'md',
    animated = true,
    scrollable = true,
    fullWidth = false,
}) => {
    // Determine if controlled or uncontrolled
    const isControlled = activeId !== undefined
    const [internalActiveId, setInternalActiveId] = useState(
        defaultActiveId || items[0]?.id || ''
    )

    const currentActiveId = isControlled ? activeId : internalActiveId

    const tabsRef = useRef<HTMLDivElement>(null)
    const activeTabRef = useRef<HTMLButtonElement>(null)

    // Handle tab change
    const handleTabChange = useCallback(
        (newTabId: string) => {
            const tab = items.find((item) => item.id === newTabId)
            if (tab?.disabled) return

            if (!isControlled) {
                setInternalActiveId(newTabId)
            }
            onChange?.(newTabId)

            // Scroll active tab into view on mobile
            if (scrollable && activeTabRef.current) {
                activeTabRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center',
                })
            }
        },
        [items, isControlled, onChange, scrollable]
    )

    // Keyboard navigation
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLButtonElement>) => {
            const enabledTabs = items.filter((item) => !item.disabled)
            const currentIndex = enabledTabs.findIndex(
                (item) => item.id === currentActiveId
            )

            let nextIndex: number | null = null

            switch (e.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault()
                    nextIndex =
                        currentIndex > 0
                            ? currentIndex - 1
                            : enabledTabs.length - 1
                    break
                case 'ArrowRight':
                case 'ArrowDown':
                    e.preventDefault()
                    nextIndex =
                        currentIndex < enabledTabs.length - 1
                            ? currentIndex + 1
                            : 0
                    break
                case 'Home':
                    e.preventDefault()
                    nextIndex = 0
                    break
                case 'End':
                    e.preventDefault()
                    nextIndex = enabledTabs.length - 1
                    break
                default:
                    return
            }

            if (nextIndex !== null && enabledTabs[nextIndex]) {
                handleTabChange(enabledTabs[nextIndex].id)
            }
        },
        [items, currentActiveId, handleTabChange]
    )

    const tabsContainerClasses = classNames(
        'tabs',
        `tabs--${variant}`,
        `tabs--size-${size}`,
        {
            'tabs--scrollable': scrollable,
            'tabs--full-width': fullWidth,
            'tabs--animated': animated,
        },
        className
    )

    const activeTab = items.find((item) => item.id === currentActiveId)

    return (
        <div className={tabsContainerClasses} ref={tabsRef}>
            <div className="tabs__list" role="tablist" aria-label={ariaLabel}>
                {items.map((tab) => (
                    <button
                        key={tab.id}
                        ref={tab.id === currentActiveId ? activeTabRef : null}
                        className={classNames('tabs__tab', {
                            'tabs__tab--active': tab.id === currentActiveId,
                            'tabs__tab--disabled': tab.disabled,
                        })}
                        id={`tab-${tab.id}`}
                        aria-selected={tab.id === currentActiveId}
                        aria-controls={`tabpanel-${tab.id}`}
                        role="tab"
                        onClick={() => handleTabChange(tab.id)}
                        onKeyDown={handleKeyDown}
                        disabled={tab.disabled}
                        tabIndex={tab.id === currentActiveId ? 0 : -1}
                    >
                        {tab.icon && (
                            <span className="tabs__tab-icon">{tab.icon}</span>
                        )}
                        <span className="tabs__tab-label">{tab.label}</span>
                        {tab.badge && (
                            <span className="tabs__tab-badge">{tab.badge}</span>
                        )}
                    </button>
                ))}
            </div>

            {activeTab && (
                <div
                    className="tabs__content"
                    id={`tabpanel-${activeTab.id}`}
                    role="tabpanel"
                    aria-labelledby={`tab-${activeTab.id}`}
                >
                    {activeTab.content}
                </div>
            )}
        </div>
    )
}

export default Tabs
