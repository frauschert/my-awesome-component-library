import React, { forwardRef } from 'react'
import './EmptyState.scss'
import { classNames } from '../../utility/classnames'

export type EmptyStateSize = 'small' | 'medium' | 'large'

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Primary heading */
    title: string
    /** Supporting description */
    description?: string
    /** Icon or illustration rendered above the title */
    icon?: React.ReactNode
    /** Call-to-action content (e.g. a Button) */
    action?: React.ReactNode
    /** Size variant */
    size?: EmptyStateSize
}

const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
    (
        {
            title,
            description,
            icon,
            action,
            size = 'medium',
            className,
            ...rest
        },
        ref
    ) => {
        return (
            <div
                ref={ref}
                className={classNames(
                    'empty-state',
                    `empty-state--${size}`,
                    className
                )}
                role="status"
                {...rest}
            >
                {icon && (
                    <div className="empty-state__icon" aria-hidden="true">
                        {icon}
                    </div>
                )}
                <p className="empty-state__title">{title}</p>
                {description && (
                    <p className="empty-state__description">{description}</p>
                )}
                {action && <div className="empty-state__action">{action}</div>}
            </div>
        )
    }
)

EmptyState.displayName = 'EmptyState'

export default EmptyState
