import React, { useState, useCallback, useRef, useEffect } from 'react'
import { classNames } from '../../utility/classnames'
import './accordion.scss'

export type AccordionMode = 'single' | 'multiple'
export type AccordionVariant = 'default' | 'bordered' | 'filled'
export type AccordionSize = 'sm' | 'md' | 'lg'

export interface AccordionItem {
    id: string
    title: React.ReactNode
    content: React.ReactNode
    disabled?: boolean
    icon?: React.ReactNode
}

export interface AccordionProps {
    /** Array of accordion items */
    items: AccordionItem[]
    /** Controlled expanded item IDs */
    expandedItems?: string[]
    /** Default expanded item IDs (uncontrolled) */
    defaultExpandedItems?: string[]
    /** Expansion mode: 'single' allows only one item open, 'multiple' allows many */
    mode?: AccordionMode
    /** Called when expansion state changes */
    onChange?: (expandedItems: string[]) => void
    /** Called when an item expands */
    onExpand?: (itemId: string) => void
    /** Called when an item collapses */
    onCollapse?: (itemId: string) => void
    /** Visual variant */
    variant?: AccordionVariant
    /** Size variant */
    size?: AccordionSize
    /** Allow toggling (clicking an open item closes it) */
    allowToggle?: boolean
    /** Disable all items */
    disabled?: boolean
    /** Custom expand icon */
    expandIcon?: React.ReactNode
    /** Custom collapse icon */
    collapseIcon?: React.ReactNode
    /** Additional CSS class */
    className?: string
    /** Additional CSS class for items */
    itemClassName?: string
}

const Accordion: React.FC<AccordionProps> = React.memo(
    ({
        items,
        expandedItems: controlledExpandedItems,
        defaultExpandedItems = [],
        mode = 'single',
        onChange,
        onExpand,
        onCollapse,
        variant = 'default',
        size = 'md',
        allowToggle = true,
        disabled = false,
        expandIcon,
        collapseIcon,
        className,
        itemClassName,
    }) => {
        // Controlled vs Uncontrolled
        const isControlled = controlledExpandedItems !== undefined
        const [internalExpandedItems, setInternalExpandedItems] =
            useState<string[]>(defaultExpandedItems)

        const expandedItems = isControlled
            ? controlledExpandedItems
            : internalExpandedItems

        const handleToggle = useCallback(
            (itemId: string, itemDisabled: boolean) => {
                if (disabled || itemDisabled) return

                let newExpandedItems: string[]

                if (expandedItems.includes(itemId)) {
                    // Collapse
                    if (allowToggle) {
                        newExpandedItems = expandedItems.filter(
                            (id) => id !== itemId
                        )
                        onCollapse?.(itemId)
                    } else {
                        return
                    }
                } else {
                    // Expand
                    if (mode === 'single') {
                        newExpandedItems = [itemId]
                        // Collapse previously expanded item
                        expandedItems.forEach((id) => {
                            if (id !== itemId) onCollapse?.(id)
                        })
                    } else {
                        newExpandedItems = [...expandedItems, itemId]
                    }
                    onExpand?.(itemId)
                }

                if (!isControlled) {
                    setInternalExpandedItems(newExpandedItems)
                }

                onChange?.(newExpandedItems)
            },
            [
                disabled,
                expandedItems,
                allowToggle,
                mode,
                isControlled,
                onChange,
                onExpand,
                onCollapse,
            ]
        )

        const accordionClasses = classNames(
            'accordion',
            `accordion--${variant}`,
            `accordion--${size}`,
            className
        )

        return (
            <div className={accordionClasses}>
                {items.map((item, index) => (
                    <AccordionItem
                        key={item.id}
                        item={item}
                        isExpanded={expandedItems.includes(item.id)}
                        onToggle={handleToggle}
                        disabled={disabled}
                        variant={variant}
                        size={size}
                        expandIcon={expandIcon}
                        collapseIcon={collapseIcon}
                        className={itemClassName}
                        isFirst={index === 0}
                        isLast={index === items.length - 1}
                    />
                ))}
            </div>
        )
    }
)

Accordion.displayName = 'Accordion'

interface AccordionItemComponentProps {
    item: AccordionItem
    isExpanded: boolean
    onToggle: (itemId: string, disabled: boolean) => void
    disabled: boolean
    variant: AccordionVariant
    size: AccordionSize
    expandIcon?: React.ReactNode
    collapseIcon?: React.ReactNode
    className?: string
    isFirst: boolean
    isLast: boolean
}

const AccordionItem: React.FC<AccordionItemComponentProps> = React.memo(
    ({
        item,
        isExpanded,
        onToggle,
        disabled,
        variant,
        size,
        expandIcon,
        collapseIcon,
        className,
        isFirst,
        isLast,
    }) => {
        const contentRef = useRef<HTMLDivElement>(null)
        const [contentHeight, setContentHeight] = useState<number>(0)
        const itemDisabled = disabled || item.disabled || false

        const headingId = `accordion-heading-${item.id}`
        const panelId = `accordion-panel-${item.id}`

        // Measure content height for animation
        useEffect(() => {
            if (contentRef.current) {
                setContentHeight(contentRef.current.scrollHeight)
            }
        }, [item.content, isExpanded])

        const handleClick = () => {
            onToggle(item.id, itemDisabled)
        }

        const handleKeyDown = (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onToggle(item.id, itemDisabled)
            }
        }

        const itemClasses = classNames(
            'accordion-item',
            {
                'accordion-item--expanded': isExpanded,
                'accordion-item--disabled': itemDisabled,
                'accordion-item--first': isFirst,
                'accordion-item--last': isLast,
            },
            className
        )

        const buttonClasses = classNames('accordion-button', {
            'accordion-button--expanded': isExpanded,
        })

        const icon = item.icon || (
            <span className="accordion-icon" aria-hidden="true">
                {isExpanded ? collapseIcon || '−' : expandIcon || '+'}
            </span>
        )

        return (
            <div className={itemClasses}>
                <h3 className="accordion-heading" id={headingId}>
                    <button
                        type="button"
                        className={buttonClasses}
                        onClick={handleClick}
                        onKeyDown={handleKeyDown}
                        aria-expanded={isExpanded}
                        aria-controls={panelId}
                        disabled={itemDisabled}
                    >
                        <span className="accordion-title">{item.title}</span>
                        {icon}
                    </button>
                </h3>
                <div
                    id={panelId}
                    role="region"
                    aria-labelledby={headingId}
                    className={classNames('accordion-panel', {
                        'accordion-panel--expanded': isExpanded,
                        'accordion-panel--collapsed': !isExpanded,
                    })}
                    style={{
                        maxHeight: isExpanded ? `${contentHeight}px` : 0,
                    }}
                >
                    <div ref={contentRef} className="accordion-content">
                        {item.content}
                    </div>
                </div>
            </div>
        )
    }
)

AccordionItem.displayName = 'AccordionItem'

export default Accordion
