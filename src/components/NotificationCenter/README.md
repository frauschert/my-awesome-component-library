# NotificationCenter

A persistent notification inbox that stores toast history, allowing users to review past notifications they might have missed.

## Features

-   📬 **Persistent History** - Stores all notifications in an inbox
-   🔔 **Unread Counter** - Badge showing unread notification count
-   🎨 **Variants** - Info, success, warning, and error styles
-   📅 **Date Grouping** - Automatically groups by Today, Yesterday, Earlier
-   ⏱️ **Timestamps** - Shows relative time (e.g., "5m ago", "2h ago")
-   🎯 **Actions** - Add custom action buttons to notifications
-   ✅ **Read/Unread** - Track which notifications have been seen
-   🧹 **Clear All** - Bulk delete all notifications
-   ♿ **Accessible** - Full keyboard navigation and ARIA support
-   📱 **Responsive** - Adapts to mobile screens

## Installation

```tsx
import NotificationCenter, {
    NotificationCenterProvider,
    useNotificationCenter,
} from '@frauschert/my-awesome-component-library'
```

## Basic Usage

Wrap your app with `NotificationCenterProvider` and add the `NotificationCenter` component:

```tsx
import {
    NotificationCenterProvider,
    NotificationCenter,
} from './components/NotificationCenter'

function App() {
    return (
        <NotificationCenterProvider maxNotifications={50}>
            <header>
                <NotificationCenter />
            </header>
            <main>{/* Your app content */}</main>
        </NotificationCenterProvider>
    )
}
```

## Adding Notifications

Use the `useNotificationCenter` hook to add notifications:

```tsx
import { useNotificationCenter } from './components/NotificationCenter'

function MyComponent() {
    const { addNotification } = useNotificationCenter()

    const handleAction = () => {
        addNotification({
            content: 'Operation completed successfully!',
            variant: 'success',
        })
    }

    return <button onClick={handleAction}>Do Something</button>
}
```

## Props

### NotificationCenterProvider

| Prop               | Type      | Default | Description                              |
| ------------------ | --------- | ------- | ---------------------------------------- |
| `children`         | ReactNode | -       | Your application components              |
| `maxNotifications` | number    | 50      | Maximum number of notifications to store |

### NotificationCenter

| Prop                   | Type                   | Default            | Description                           |
| ---------------------- | ---------------------- | ------------------ | ------------------------------------- |
| `position`             | 'right' \| 'left'      | 'right'            | Position of the notification panel    |
| `trigger`              | ReactNode              | Bell icon          | Custom trigger button                 |
| `onNotificationClick`  | (notification) => void | -                  | Callback when notification is clicked |
| `onNotificationRemove` | (id) => void           | -                  | Callback when notification is removed |
| `onClearAll`           | () => void             | -                  | Callback when all cleared             |
| `emptyMessage`         | string                 | 'No notifications' | Custom empty state message            |
| `showTimestamp`        | boolean                | true               | Show relative timestamps              |
| `groupByDate`          | boolean                | true               | Group notifications by date           |
| `className`            | string                 | -                  | Additional CSS class                  |

## Notification Item Type

```typescript
type NotificationItem = {
    content: React.ReactNode // Notification message
    variant?: 'info' | 'success' | 'warn' | 'error' // Visual style
    title?: string // Optional title
    actions?: NotificationAction[] // Optional action buttons
}

type NotificationAction = {
    label: string // Button text
    onClick: (id: string) => void // Click handler with notification ID
    variant?: 'primary' | 'secondary' | 'danger' // Button style
}
```

## Hook API

The `useNotificationCenter` hook provides:

```typescript
const {
    notifications, // Array of all notifications
    addNotification, // Add a new notification
    removeNotification, // Remove by ID
    markAsRead, // Mark single as read
    markAllAsRead, // Mark all as read
    clearAll, // Remove all notifications
    unreadCount, // Number of unread notifications
} = useNotificationCenter()
```

## Examples

### Simple Notification

```tsx
addNotification({
    content: 'File uploaded successfully',
    variant: 'success',
})
```

### With Title

```tsx
addNotification({
    title: 'New Message',
    content: 'You have received a message from John',
    variant: 'info',
})
```

### With Actions

```tsx
const { addNotification, removeNotification } = useNotificationCenter()

addNotification({
    title: 'Friend Request',
    content: 'Jane Doe wants to connect with you',
    variant: 'info',
    actions: [
        {
            label: 'Accept',
            variant: 'primary',
            onClick: (id) => {
                // Handle accept
                console.log('Accepted')
                removeNotification(id)
            },
        },
        {
            label: 'Decline',
            variant: 'secondary',
            onClick: (id) => {
                // Handle decline
                removeNotification(id)
            },
        },
    ],
})
```

### Confirmation Dialog Pattern

```tsx
addNotification({
    title: 'Confirm Delete',
    content: 'Are you sure you want to delete this item?',
    variant: 'warn',
    actions: [
        {
            label: 'Delete',
            variant: 'danger',
            onClick: (id) => {
                performDelete()
                removeNotification(id)
            },
        },
        {
            label: 'Cancel',
            variant: 'secondary',
            onClick: (id) => removeNotification(id),
        },
    ],
})
```

### Different Variants

```tsx
// Info (default - blue)
addNotification({
    content: 'System maintenance scheduled',
    variant: 'info',
})

// Success (green)
addNotification({
    content: 'Changes saved successfully',
    variant: 'success',
})

// Warning (yellow)
addNotification({
    content: 'Your session will expire soon',
    variant: 'warn',
})

// Error (red)
addNotification({
    content: 'Failed to connect to server',
    variant: 'error',
})
```

### Custom Trigger

```tsx
<NotificationCenter
    trigger={
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Inbox</span>
            <span style={{ color: 'red' }}>{unreadCount}</span>
        </div>
    }
/>
```

### Handling Callbacks

```tsx
<NotificationCenter
    onNotificationClick={(notification) => {
        console.log('Clicked:', notification)
        // Navigate to related page, open modal, etc.
    }}
    onNotificationRemove={(id) => {
        console.log('Removed:', id)
        // Analytics tracking
    }}
    onClearAll={() => {
        console.log('Cleared all notifications')
    }}
/>
```

## Integration with Toast

The NotificationCenter works alongside your Toast system. Here's a pattern to show a toast AND save to notification center:

```tsx
import { notify } from './components/Toast'
import { useNotificationCenter } from './components/NotificationCenter'

function MyComponent() {
    const { addNotification } = useNotificationCenter()

    const handleImportantAction = () => {
        const message = 'Data exported successfully'

        // Show temporary toast
        notify({ content: message, variant: 'success', duration: 3000 })

        // Also save to notification center for history
        addNotification({
            title: 'Export Complete',
            content: message,
            variant: 'success',
        })
    }

    return <button onClick={handleImportantAction}>Export Data</button>
}
```

## Styling

The component uses CSS custom properties for theming:

```css
--theme-primary: Main color
--theme-surface: Background color
--theme-background: Page background
--theme-border: Border color
--theme-text: Primary text color
--theme-text-secondary: Secondary text
--theme-text-tertiary: Tertiary text
--theme-hover: Hover state background
--theme-error: Error/danger color
--theme-success: Success color
--theme-warning: Warning color
--theme-info: Info color
--theme-unread: Unread notification background
```

## Keyboard Navigation

-   **Tab** - Navigate between notifications and buttons
-   **Enter/Space** - Click notification or button
-   **Escape** - Close notification panel

## Accessibility

-   ARIA labels and roles for screen readers
-   Keyboard navigation support
-   Focus management
-   Proper semantic HTML

## Best Practices

1. **Limit history size** - Use `maxNotifications` prop to prevent memory issues
2. **Important notifications** - Add to NotificationCenter for history, show Toast for immediate attention
3. **Action buttons** - Keep 2-3 actions maximum for clarity
4. **Clear content** - Write concise notification messages
5. **Variants** - Use appropriate variants to indicate urgency/type

## Performance

-   Notifications are stored in React state (not persisted)
-   Automatic cleanup when exceeding `maxNotifications`
-   Efficient re-renders using React.memo where appropriate
-   Date grouping computed with useMemo

## Browser Support

Works in all modern browsers with React 18+ support.
