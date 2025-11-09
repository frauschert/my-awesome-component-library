import React from 'react'
import { forwardRef } from 'react'
import { classNames } from '../../utility/classnames'
import './ActivityFeed.scss'

export type ActivityType =
    | 'comment'
    | 'like'
    | 'share'
    | 'follow'
    | 'upload'
    | 'download'
    | 'edit'
    | 'delete'
    | 'create'
    | 'update'
    | 'login'
    | 'logout'
    | 'error'
    | 'warning'
    | 'success'
    | 'info'

export interface ActivityItem {
    id: string | number
    type: ActivityType
    user?: {
        name: string
        avatar?: string
        role?: string
    }
    title: string
    description?: string
    timestamp: Date | string
    icon?: React.ReactNode
    link?: string
    metadata?: Record<string, unknown>
    read?: boolean
}

export interface ActivityGroup {
    date: string
    items: ActivityItem[]
}

export interface ActivityFeedProps {
    /** Array of activity items */
    activities: ActivityItem[]
    /** Visual variant */
    variant?: 'default' | 'compact' | 'detailed' | 'timeline'
    /** Show avatars */
    showAvatars?: boolean
    /** Show timestamps */
    showTimestamps?: boolean
    /** Show type icons */
    showIcons?: boolean
    /** Group activities by date */
    groupByDate?: boolean
    /** Filter by activity type */
    filterTypes?: ActivityType[]
    /** Show only unread items */
    showUnreadOnly?: boolean
    /** Custom icon renderer */
    iconRenderer?: (type: ActivityType) => React.ReactNode
    /** Callback when activity is clicked */
    onActivityClick?: (activity: ActivityItem) => void
    /** Callback when activity is marked as read */
    onMarkAsRead?: (activityId: string | number) => void
    /** Maximum height (enables scrolling) */
    maxHeight?: string | number
    /** Loading state */
    loading?: boolean
    /** Empty state message */
    emptyMessage?: string
    /** Show load more button */
    showLoadMore?: boolean
    /** Load more callback */
    onLoadMore?: () => void
    /** Loading more state */
    loadingMore?: boolean
    /** Animate new items */
    animateNew?: boolean
    /** Custom className */
    className?: string
    /** Custom styles */
    style?: React.CSSProperties
}

const defaultIcons: Record<ActivityType, string> = {
    comment: '💬',
    like: '❤️',
    share: '🔄',
    follow: '👤',
    upload: '📤',
    download: '📥',
    edit: '✏️',
    delete: '🗑️',
    create: '✨',
    update: '🔄',
    login: '🔑',
    logout: '🚪',
    error: '❌',
    warning: '⚠️',
    success: '✅',
    info: 'ℹ️',
}

export const ActivityFeed = forwardRef<HTMLDivElement, ActivityFeedProps>(
    (
        {
            activities,
            variant = 'default',
            showAvatars = true,
            showTimestamps = true,
            showIcons = true,
            groupByDate = false,
            filterTypes,
            showUnreadOnly = false,
            iconRenderer,
            onActivityClick,
            onMarkAsRead,
            maxHeight,
            loading = false,
            emptyMessage = 'No activities to display',
            showLoadMore = false,
            onLoadMore,
            loadingMore = false,
            animateNew = false,
            className,
            style,
            ...rest
        },
        ref
    ) => {
        // Filter activities
        const filteredActivities = React.useMemo(() => {
            let filtered = [...activities]

            if (filterTypes && filterTypes.length > 0) {
                filtered = filtered.filter((activity) =>
                    filterTypes.includes(activity.type)
                )
            }

            if (showUnreadOnly) {
                filtered = filtered.filter((activity) => !activity.read)
            }

            return filtered
        }, [activities, filterTypes, showUnreadOnly])

        // Group activities by date if needed
        const groupedActivities = React.useMemo(() => {
            if (!groupByDate) {
                return null
            }

            const groups: ActivityGroup[] = []
            const groupMap = new Map<string, ActivityItem[]>()

            filteredActivities.forEach((activity) => {
                const date = new Date(activity.timestamp)
                const dateKey = date.toLocaleDateString()

                if (!groupMap.has(dateKey)) {
                    groupMap.set(dateKey, [])
                }
                groupMap.get(dateKey)?.push(activity)
            })

            groupMap.forEach((items, date) => {
                groups.push({ date, items })
            })

            // Sort groups by date (newest first)
            groups.sort((a, b) => {
                const dateA = new Date(a.items[0].timestamp)
                const dateB = new Date(b.items[0].timestamp)
                return dateB.getTime() - dateA.getTime()
            })

            return groups
        }, [filteredActivities, groupByDate])

        // Format timestamp
        const formatTimestamp = (timestamp: Date | string) => {
            const date = new Date(timestamp)
            const now = new Date()
            const diffMs = now.getTime() - date.getTime()
            const diffMins = Math.floor(diffMs / 60000)
            const diffHours = Math.floor(diffMs / 3600000)
            const diffDays = Math.floor(diffMs / 86400000)

            if (diffMins < 1) return 'Just now'
            if (diffMins < 60) return `${diffMins}m ago`
            if (diffHours < 24) return `${diffHours}h ago`
            if (diffDays < 7) return `${diffDays}d ago`

            return date.toLocaleDateString()
        }

        // Get activity icon
        const getActivityIcon = (activity: ActivityItem) => {
            if (activity.icon) return activity.icon
            if (iconRenderer) return iconRenderer(activity.type)
            return defaultIcons[activity.type] || '•'
        }

        // Handle activity click
        const handleActivityClick = (activity: ActivityItem) => {
            if (onActivityClick) {
                onActivityClick(activity)
            }
            if (onMarkAsRead && !activity.read) {
                onMarkAsRead(activity.id)
            }
        }

        // Render activity item
        const renderActivityItem = (activity: ActivityItem, index: number) => {
            const itemClasses = classNames(
                'activity-feed__item',
                `activity-feed__item--${activity.type}`,
                {
                    'activity-feed__item--unread': !activity.read,
                    'activity-feed__item--clickable': !!(
                        onActivityClick || activity.link
                    ),
                    'activity-feed__item--animate-in': animateNew && index < 5,
                }
            )

            return (
                <div
                    key={activity.id}
                    className={itemClasses}
                    onClick={() => handleActivityClick(activity)}
                    role={onActivityClick ? 'button' : undefined}
                    tabIndex={onActivityClick ? 0 : undefined}
                    onKeyDown={(e) => {
                        if (
                            onActivityClick &&
                            (e.key === 'Enter' || e.key === ' ')
                        ) {
                            e.preventDefault()
                            handleActivityClick(activity)
                        }
                    }}
                    style={
                        animateNew && index < 5
                            ? ({
                                  '--animation-delay': `${index * 0.1}s`,
                              } as React.CSSProperties)
                            : undefined
                    }
                >
                    {showIcons && (
                        <div className="activity-feed__icon">
                            {getActivityIcon(activity)}
                        </div>
                    )}
                    <div className="activity-feed__content">
                        <div className="activity-feed__header">
                            {showAvatars && activity.user?.avatar && (
                                <img
                                    src={activity.user.avatar}
                                    alt={activity.user.name}
                                    className="activity-feed__avatar"
                                />
                            )}
                            <div className="activity-feed__info">
                                <div className="activity-feed__title">
                                    {activity.user && (
                                        <span className="activity-feed__user">
                                            {activity.user.name}
                                        </span>
                                    )}
                                    <span className="activity-feed__action">
                                        {activity.title}
                                    </span>
                                </div>
                                {activity.description && (
                                    <div className="activity-feed__description">
                                        {activity.description}
                                    </div>
                                )}
                            </div>
                        </div>
                        {showTimestamps && (
                            <div className="activity-feed__timestamp">
                                {formatTimestamp(activity.timestamp)}
                            </div>
                        )}
                    </div>
                    {!activity.read && (
                        <div className="activity-feed__unread-indicator" />
                    )}
                </div>
            )
        }

        const classes = classNames(
            'activity-feed',
            `activity-feed--${variant}`,
            {
                'activity-feed--loading': loading,
            },
            className
        )

        const containerStyle: React.CSSProperties = {
            ...style,
            ...(maxHeight ? { maxHeight, overflowY: 'auto' } : {}),
        }

        if (loading) {
            return (
                <div
                    ref={ref}
                    className={classes}
                    style={containerStyle}
                    {...rest}
                >
                    <div className="activity-feed__loading">
                        <div className="activity-feed__spinner" />
                        <span>Loading activities...</span>
                    </div>
                </div>
            )
        }

        if (filteredActivities.length === 0) {
            return (
                <div
                    ref={ref}
                    className={classes}
                    style={containerStyle}
                    {...rest}
                >
                    <div className="activity-feed__empty">{emptyMessage}</div>
                </div>
            )
        }

        return (
            <div ref={ref} className={classes} style={containerStyle} {...rest}>
                <div className="activity-feed__list">
                    {groupedActivities
                        ? groupedActivities.map((group) => (
                              <div
                                  key={group.date}
                                  className="activity-feed__group"
                              >
                                  <div className="activity-feed__group-header">
                                      {group.date}
                                  </div>
                                  <div className="activity-feed__group-items">
                                      {group.items.map((activity, index) =>
                                          renderActivityItem(activity, index)
                                      )}
                                  </div>
                              </div>
                          ))
                        : filteredActivities.map((activity, index) =>
                              renderActivityItem(activity, index)
                          )}
                </div>
                {showLoadMore && onLoadMore && (
                    <div className="activity-feed__load-more">
                        <button
                            className="activity-feed__load-more-button"
                            onClick={onLoadMore}
                            disabled={loadingMore}
                        >
                            {loadingMore ? (
                                <>
                                    <div className="activity-feed__spinner activity-feed__spinner--small" />
                                    Loading...
                                </>
                            ) : (
                                'Load More'
                            )}
                        </button>
                    </div>
                )}
            </div>
        )
    }
)

ActivityFeed.displayName = 'ActivityFeed'

export default ActivityFeed
