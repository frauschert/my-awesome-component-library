import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { classNames } from '../../utility/classnames'
import Portal from '../Portal'
import './notification-center.scss'

export type NotificationItem = {
    id: string
    content: React.ReactNode
    variant?: 'info' | 'success' | 'warn' | 'error'
    timestamp: number
    read?: boolean
    title?: string
    actions?: NotificationAction[]
}

export type NotificationAction = {
    label: string
    onClick: (id: string) => void
    variant?: 'primary' | 'secondary' | 'danger'
}

export type NotificationCenterProps = {
    /** Maximum number of notifications to store (older ones are removed) */
    maxNotifications?: number
    /** Position of the notification center panel */
    position?: 'right' | 'left'
    /** Custom trigger button (if not provided, uses default bell icon) */
    trigger?: React.ReactNode
    /** Callback when a notification is clicked */
    onNotificationClick?: (notification: NotificationItem) => void
    /** Callback when a notification is removed */
    onNotificationRemove?: (id: string) => void
    /** Callback when all notifications are cleared */
    onClearAll?: () => void
    /** Custom empty state message */
    emptyMessage?: string
    /** Whether to show timestamp */
    showTimestamp?: boolean
    /** Whether to group by date */
    groupByDate?: boolean
    /** Additional CSS class */
    className?: string
}

type NotificationCenterContextValue = {
    notifications: NotificationItem[]
    addNotification: (
        notification: Omit<NotificationItem, 'id' | 'timestamp'>
    ) => void
    removeNotification: (id: string) => void
    markAsRead: (id: string) => void
    markAllAsRead: () => void
    clearAll: () => void
    unreadCount: number
}

const NotificationCenterContext =
    React.createContext<NotificationCenterContextValue | null>(null)

export const useNotificationCenter = () => {
    const context = React.useContext(NotificationCenterContext)
    if (!context) {
        throw new Error(
            'useNotificationCenter must be used within NotificationCenterProvider'
        )
    }
    return context
}

export const NotificationCenterProvider: React.FC<{
    children: React.ReactNode
    maxNotifications?: number
}> = ({ children, maxNotifications = 50 }) => {
    const [notifications, setNotifications] = useState<NotificationItem[]>([])

    const addNotification = useCallback(
        (notification: Omit<NotificationItem, 'id' | 'timestamp'>) => {
            const newNotification: NotificationItem = {
                ...notification,
                id: `notif-${Date.now()}-${Math.random()
                    .toString(36)
                    .substr(2, 9)}`,
                timestamp: Date.now(),
                read: false,
            }

            setNotifications((prev) => {
                const updated = [newNotification, ...prev]
                // Keep only maxNotifications
                return updated.slice(0, maxNotifications)
            })
        },
        [maxNotifications]
    )

    const removeNotification = useCallback((id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id))
    }, [])

    const markAsRead = useCallback((id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        )
    }, [])

    const markAllAsRead = useCallback(() => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    }, [])

    const clearAll = useCallback(() => {
        setNotifications([])
    }, [])

    const unreadCount = useMemo(
        () => notifications.filter((n) => !n.read).length,
        [notifications]
    )

    const value = useMemo(
        () => ({
            notifications,
            addNotification,
            removeNotification,
            markAsRead,
            markAllAsRead,
            clearAll,
            unreadCount,
        }),
        [
            notifications,
            addNotification,
            removeNotification,
            markAsRead,
            markAllAsRead,
            clearAll,
            unreadCount,
        ]
    )

    return (
        <NotificationCenterContext.Provider value={value}>
            {children}
        </NotificationCenterContext.Provider>
    )
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
    position = 'right',
    trigger,
    onNotificationClick,
    onNotificationRemove,
    onClearAll,
    emptyMessage = 'No notifications',
    showTimestamp = true,
    groupByDate = true,
    className,
}) => {
    const {
        notifications,
        removeNotification,
        markAsRead,
        markAllAsRead,
        clearAll,
        unreadCount,
    } = useNotificationCenter()

    const [isOpen, setIsOpen] = useState(false)

    // Close on Escape key
    useEffect(() => {
        if (!isOpen) return

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsOpen(false)
            }
        }

        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [isOpen])

    // Close when clicking outside
    useEffect(() => {
        if (!isOpen) return

        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            if (
                !target.closest('.notification-center') &&
                !target.closest('.notification-center__trigger')
            ) {
                setIsOpen(false)
            }
        }

        // Add delay to avoid immediate close on open
        const timeoutId = setTimeout(() => {
            document.addEventListener('mousedown', handleClickOutside)
        }, 100)

        return () => {
            clearTimeout(timeoutId)
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    const handleToggle = () => {
        setIsOpen((prev) => !prev)
        if (!isOpen && unreadCount > 0) {
            // Mark all as read when opening
            setTimeout(() => markAllAsRead(), 500)
        }
    }

    const handleNotificationClick = (notification: NotificationItem) => {
        if (!notification.read) {
            markAsRead(notification.id)
        }
        onNotificationClick?.(notification)
    }

    const handleRemove = (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        removeNotification(id)
        onNotificationRemove?.(id)
    }

    const handleClearAll = () => {
        clearAll()
        onClearAll?.()
    }

    const formatTimestamp = (timestamp: number) => {
        const now = Date.now()
        const diff = now - timestamp
        const seconds = Math.floor(diff / 1000)
        const minutes = Math.floor(seconds / 60)
        const hours = Math.floor(minutes / 60)
        const days = Math.floor(hours / 24)

        if (seconds < 60) return 'Just now'
        if (minutes < 60) return `${minutes}m ago`
        if (hours < 24) return `${hours}h ago`
        if (days < 7) return `${days}d ago`

        const date = new Date(timestamp)
        return date.toLocaleDateString()
    }

    const groupedNotifications = useMemo(() => {
        if (!groupByDate) {
            return [{ title: '', notifications }]
        }

        const now = Date.now()
        const today = new Date(now).setHours(0, 0, 0, 0)
        const yesterday = today - 24 * 60 * 60 * 1000

        const groups: { title: string; notifications: NotificationItem[] }[] =
            []

        const todayItems = notifications.filter((n) => n.timestamp >= today)
        const yesterdayItems = notifications.filter(
            (n) => n.timestamp >= yesterday && n.timestamp < today
        )
        const olderItems = notifications.filter((n) => n.timestamp < yesterday)

        if (todayItems.length > 0) {
            groups.push({ title: 'Today', notifications: todayItems })
        }
        if (yesterdayItems.length > 0) {
            groups.push({ title: 'Yesterday', notifications: yesterdayItems })
        }
        if (olderItems.length > 0) {
            groups.push({ title: 'Earlier', notifications: olderItems })
        }

        return groups
    }, [notifications, groupByDate])

    return (
        <>
            <button
                className={classNames(
                    'notification-center__trigger',
                    className
                )}
                onClick={handleToggle}
                aria-label={`Notifications (${unreadCount} unread)`}
                aria-expanded={isOpen}
                aria-haspopup="dialog"
            >
                {trigger || (
                    <div className="notification-center__bell">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                        {unreadCount > 0 && (
                            <span className="notification-center__badge">
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                        )}
                    </div>
                )}
            </button>

            {isOpen && (
                <Portal wrapperId="notification-center-portal">
                    <div
                        className={classNames(
                            'notification-center',
                            `notification-center--${position}`,
                            { 'notification-center--open': isOpen }
                        )}
                        role="dialog"
                        aria-label="Notification Center"
                        aria-modal="false"
                    >
                        <div className="notification-center__header">
                            <h2 className="notification-center__title">
                                Notifications
                            </h2>
                            {notifications.length > 0 && (
                                <button
                                    className="notification-center__clear"
                                    onClick={handleClearAll}
                                    type="button"
                                >
                                    Clear all
                                </button>
                            )}
                        </div>

                        <div className="notification-center__body">
                            {notifications.length === 0 ? (
                                <div className="notification-center__empty">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                                    </svg>
                                    <p>{emptyMessage}</p>
                                </div>
                            ) : (
                                <div className="notification-center__list">
                                    {groupedNotifications.map(
                                        (group, groupIndex) => (
                                            <div key={groupIndex}>
                                                {group.title && (
                                                    <div className="notification-center__group-title">
                                                        {group.title}
                                                    </div>
                                                )}
                                                {group.notifications.map(
                                                    (notification) => (
                                                        <div
                                                            key={
                                                                notification.id
                                                            }
                                                            className={classNames(
                                                                'notification-center__item',
                                                                `notification-center__item--${
                                                                    notification.variant ||
                                                                    'info'
                                                                }`,
                                                                {
                                                                    'notification-center__item--unread':
                                                                        !notification.read,
                                                                }
                                                            )}
                                                            onClick={() =>
                                                                handleNotificationClick(
                                                                    notification
                                                                )
                                                            }
                                                            role="button"
                                                            tabIndex={0}
                                                            onKeyDown={(e) => {
                                                                if (
                                                                    e.key ===
                                                                        'Enter' ||
                                                                    e.key ===
                                                                        ' '
                                                                ) {
                                                                    e.preventDefault()
                                                                    handleNotificationClick(
                                                                        notification
                                                                    )
                                                                }
                                                            }}
                                                        >
                                                            <div className="notification-center__item-indicator" />
                                                            <div className="notification-center__item-content">
                                                                {notification.title && (
                                                                    <div className="notification-center__item-title">
                                                                        {
                                                                            notification.title
                                                                        }
                                                                    </div>
                                                                )}
                                                                <div className="notification-center__item-text">
                                                                    {
                                                                        notification.content
                                                                    }
                                                                </div>
                                                                {showTimestamp && (
                                                                    <div className="notification-center__item-timestamp">
                                                                        {formatTimestamp(
                                                                            notification.timestamp
                                                                        )}
                                                                    </div>
                                                                )}
                                                                {notification.actions &&
                                                                    notification
                                                                        .actions
                                                                        .length >
                                                                        0 && (
                                                                        <div className="notification-center__item-actions">
                                                                            {notification.actions.map(
                                                                                (
                                                                                    action,
                                                                                    idx
                                                                                ) => (
                                                                                    <button
                                                                                        key={
                                                                                            idx
                                                                                        }
                                                                                        className={classNames(
                                                                                            'notification-center__item-action',
                                                                                            `notification-center__item-action--${
                                                                                                action.variant ||
                                                                                                'secondary'
                                                                                            }`
                                                                                        )}
                                                                                        onClick={(
                                                                                            e
                                                                                        ) => {
                                                                                            e.stopPropagation()
                                                                                            action.onClick(
                                                                                                notification.id
                                                                                            )
                                                                                        }}
                                                                                        type="button"
                                                                                    >
                                                                                        {
                                                                                            action.label
                                                                                        }
                                                                                    </button>
                                                                                )
                                                                            )}
                                                                        </div>
                                                                    )}
                                                            </div>
                                                            <button
                                                                className="notification-center__item-remove"
                                                                onClick={(e) =>
                                                                    handleRemove(
                                                                        notification.id,
                                                                        e
                                                                    )
                                                                }
                                                                aria-label="Remove notification"
                                                                type="button"
                                                            >
                                                                <svg
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                >
                                                                    <line
                                                                        x1="18"
                                                                        y1="6"
                                                                        x2="6"
                                                                        y2="18"
                                                                    />
                                                                    <line
                                                                        x1="6"
                                                                        y1="6"
                                                                        x2="18"
                                                                        y2="18"
                                                                    />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </Portal>
            )}
        </>
    )
}

export default NotificationCenter
