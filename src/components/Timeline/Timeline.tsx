import React, { ReactNode } from 'react'
import { classNames } from '../../utility/classnames'
import './Timeline.scss'

export type TimelineItemStatus =
    | 'default'
    | 'success'
    | 'error'
    | 'warning'
    | 'info'
export type TimelineVariant = 'default' | 'compact' | 'detailed'
export type TimelinePosition = 'left' | 'right' | 'alternate'

export interface TimelineItemProps {
    /**
     * Title of the timeline item
     */
    title: string
    /**
     * Optional description or content
     */
    description?: ReactNode
    /**
     * Timestamp or date
     */
    timestamp?: string
    /**
     * Status/color of the timeline item
     */
    status?: TimelineItemStatus
    /**
     * Custom icon (replaces default dot)
     */
    icon?: ReactNode
    /**
     * Additional content below description
     */
    children?: ReactNode
    /**
     * Custom className for the item
     */
    className?: string
}

export interface TimelineProps {
    /**
     * Timeline items
     */
    items: TimelineItemProps[]
    /**
     * Visual variant
     */
    variant?: TimelineVariant
    /**
     * Position of content relative to timeline
     */
    position?: TimelinePosition
    /**
     * Custom className
     */
    className?: string
}

const TimelineItem: React.FC<
    TimelineItemProps & {
        variant: TimelineVariant
        position: TimelinePosition
        index: number
    }
> = ({
    title,
    description,
    timestamp,
    status = 'default',
    icon,
    children,
    className,
    variant,
    position,
    index,
}) => {
    const itemClasses = classNames(
        'timeline-item',
        `timeline-item--${status}`,
        {
            'timeline-item--compact': variant === 'compact',
            'timeline-item--detailed': variant === 'detailed',
            'timeline-item--alternate-left':
                position === 'alternate' && index % 2 === 0,
            'timeline-item--alternate-right':
                position === 'alternate' && index % 2 === 1,
        },
        className
    )

    return (
        <div className={itemClasses}>
            <div className="timeline-item__marker">
                {icon ? (
                    <div className="timeline-item__icon">{icon}</div>
                ) : (
                    <div className="timeline-item__dot" />
                )}
            </div>
            <div className="timeline-item__content">
                {timestamp && (
                    <div className="timeline-item__timestamp">{timestamp}</div>
                )}
                <div className="timeline-item__title">{title}</div>
                {description && (
                    <div className="timeline-item__description">
                        {description}
                    </div>
                )}
                {children && (
                    <div className="timeline-item__children">{children}</div>
                )}
            </div>
        </div>
    )
}

const Timeline: React.FC<TimelineProps> = ({
    items,
    variant = 'default',
    position = 'right',
    className,
}) => {
    const timelineClasses = classNames(
        'timeline',
        `timeline--${variant}`,
        `timeline--${position}`,
        className
    )

    return (
        <div className={timelineClasses}>
            {items.map((item, index) => (
                <TimelineItem
                    key={index}
                    {...item}
                    variant={variant}
                    position={position}
                    index={index}
                />
            ))}
        </div>
    )
}

export default Timeline
