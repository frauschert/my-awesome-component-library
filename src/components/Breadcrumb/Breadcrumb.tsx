import React from 'react'
import { classNames } from '../../utility/classnames'
import './Breadcrumb.scss'

export interface BreadcrumbItem {
    label: string
    href?: string
    onClick?: (e: React.MouseEvent) => void
}

export interface BreadcrumbProps {
    items: BreadcrumbItem[]
    separator?: React.ReactNode
    className?: string
    maxItems?: number
    itemsBeforeCollapse?: number
    itemsAfterCollapse?: number
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
    items,
    separator = '/',
    className,
    maxItems,
    itemsBeforeCollapse = 1,
    itemsAfterCollapse = 1,
}) => {
    const shouldCollapse = maxItems && items.length > maxItems

    const getDisplayItems = (): BreadcrumbItem[] => {
        if (!shouldCollapse) return items

        const beforeItems = items.slice(0, itemsBeforeCollapse)
        const afterItems = items.slice(items.length - itemsAfterCollapse)

        return [
            ...beforeItems,
            { label: '...', href: undefined },
            ...afterItems,
        ]
    }

    const displayItems = getDisplayItems()

    return (
        <nav
            aria-label="Breadcrumb"
            className={classNames('breadcrumb', className)}
        >
            <ol className="breadcrumb__list">
                {displayItems.map((item, index) => {
                    const isLast = index === displayItems.length - 1
                    const isCollapsed = item.label === '...'

                    return (
                        <li
                            key={index}
                            className={classNames('breadcrumb__item', {
                                'breadcrumb__item--current': isLast,
                                'breadcrumb__item--collapsed': isCollapsed,
                            })}
                        >
                            {!isLast && (
                                <>
                                    {item.href || item.onClick ? (
                                        <a
                                            href={item.href}
                                            onClick={item.onClick}
                                            className="breadcrumb__link"
                                            role={
                                                !item.href && item.onClick
                                                    ? 'link'
                                                    : undefined
                                            }
                                        >
                                            {item.label}
                                        </a>
                                    ) : (
                                        <span className="breadcrumb__text">
                                            {item.label}
                                        </span>
                                    )}
                                    <span
                                        className="breadcrumb__separator"
                                        aria-hidden="true"
                                    >
                                        {separator}
                                    </span>
                                </>
                            )}
                            {isLast && (
                                <span
                                    className="breadcrumb__text breadcrumb__text--current"
                                    aria-current="page"
                                >
                                    {item.label}
                                </span>
                            )}
                        </li>
                    )
                })}
            </ol>
        </nav>
    )
}

export default Breadcrumb
