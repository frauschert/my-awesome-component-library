# Integrating Toast and NotificationCenter

This guide shows how to use Toast and NotificationCenter together for the best user experience.

## Pattern: Temporary Toast + Persistent History

**Toast** - For immediate, temporary feedback that auto-dismisses  
**NotificationCenter** - For persistent history that users can review later

### Setup

```tsx
import { ToastProvider, notify } from '@frauschert/my-awesome-component-library'
import {
    NotificationCenterProvider,
    NotificationCenter,
    useNotificationCenter,
} from '@frauschert/my-awesome-component-library'

function App() {
    return (
        <ToastProvider position="bottom-right" maxVisible={3}>
            <NotificationCenterProvider maxNotifications={50}>
                <AppHeader />
                <AppContent />
            </NotificationCenterProvider>
        </ToastProvider>
    )
}

function AppHeader() {
    return (
        <header>
            <nav>{/* ... */}</nav>
            <NotificationCenter />
        </header>
    )
}
```

## Use Cases

### 1. Important Actions (Show Both)

For important operations, show a toast for immediate feedback AND save to notification center for history:

```tsx
import { notify } from './Toast'
import { useNotificationCenter } from './NotificationCenter'

function DataExportButton() {
    const { addNotification } = useNotificationCenter()

    const handleExport = async () => {
        try {
            await exportData()

            const message = 'Data exported successfully'

            // Temporary toast (auto-dismisses)
            notify({
                content: message,
                variant: 'success',
                duration: 3000,
            })

            // Persistent notification with action
            addNotification({
                title: 'Export Complete',
                content: 'Your data export is ready to download',
                variant: 'success',
                actions: [
                    {
                        label: 'Download',
                        variant: 'primary',
                        onClick: (id) => {
                            downloadFile()
                            removeNotification(id)
                        },
                    },
                ],
            })
        } catch (error) {
            notify({
                content: 'Export failed',
                variant: 'error',
                duration: 5000,
            })

            addNotification({
                title: 'Export Failed',
                content: error.message,
                variant: 'error',
            })
        }
    }

    return <button onClick={handleExport}>Export Data</button>
}
```

### 2. Quick Feedback (Toast Only)

For simple confirmations that don't need history:

```tsx
function SaveButton() {
    const handleSave = () => {
        // Quick feedback, no need for history
        notify({
            content: 'Settings saved',
            variant: 'success',
            duration: 2000,
        })
    }

    return <button onClick={handleSave}>Save</button>
}
```

### 3. User Interactions (NotificationCenter Only)

For social/collaboration features that users may want to review:

```tsx
function useSocialNotifications() {
    const { addNotification } = useNotificationCenter()

    useEffect(() => {
        // Listen to WebSocket or polling
        socket.on('friend-request', (data) => {
            addNotification({
                title: 'Friend Request',
                content: `${data.user.name} wants to connect`,
                variant: 'info',
                actions: [
                    {
                        label: 'Accept',
                        variant: 'primary',
                        onClick: async (id) => {
                            await acceptFriendRequest(data.requestId)
                            removeNotification(id)
                            notify({
                                content: 'Friend request accepted',
                                variant: 'success',
                            })
                        },
                    },
                    {
                        label: 'Decline',
                        variant: 'secondary',
                        onClick: (id) => {
                            declineFriendRequest(data.requestId)
                            removeNotification(id)
                        },
                    },
                ],
            })
        })
    }, [addNotification])
}
```

### 4. Background Processes (Both with Different Timing)

Show toast when starting, notification when complete:

```tsx
function LongRunningTask() {
    const { addNotification } = useNotificationCenter()

    const startTask = async () => {
        // Immediate feedback
        notify({
            content: 'Processing started...',
            variant: 'info',
            duration: 2000,
        })

        try {
            const result = await processLargeFile() // Takes 30 seconds

            // Save to history (user might not be watching)
            addNotification({
                title: 'Processing Complete',
                content: `Processed ${result.count} items`,
                variant: 'success',
                actions: [
                    {
                        label: 'View Results',
                        variant: 'primary',
                        onClick: (id) => {
                            navigate('/results')
                            removeNotification(id)
                        },
                    },
                ],
            })

            // Also show toast for immediate feedback if still on page
            notify({
                content: 'Processing complete!',
                variant: 'success',
                duration: 4000,
            })
        } catch (error) {
            addNotification({
                title: 'Processing Failed',
                content: error.message,
                variant: 'error',
            })

            notify({
                content: 'Processing failed',
                variant: 'error',
                duration: 5000,
            })
        }
    }

    return <button onClick={startTask}>Start Processing</button>
}
```

## Decision Matrix

| Use Case                  | Toast | NotificationCenter | Both |
| ------------------------- | ----- | ------------------ | ---- |
| Form saved                | ✅    | ❌                 |      |
| Copied to clipboard       | ✅    | ❌                 |      |
| Item deleted              | ✅    | ❌                 |      |
| File uploaded (quick)     | ✅    | ❌                 |      |
| File uploaded (important) |       |                    | ✅   |
| Export completed          |       |                    | ✅   |
| Friend request            | ❌    | ✅                 |      |
| New message               | ❌    | ✅                 |      |
| Background task complete  |       |                    | ✅   |
| Payment processed         |       |                    | ✅   |
| System alert              | ❌    | ✅                 |      |
| Error (needs user action) |       |                    | ✅   |
| Error (informational)     | ✅    | ❌                 |      |

## Best Practices

### 1. Use Toast for Transient Feedback

```tsx
// ✅ Good - Simple confirmation
notify({ content: 'Copied!', variant: 'success', duration: 2000 })

// ❌ Bad - This doesn't need to persist
addNotification({ content: 'Copied!', variant: 'success' })
```

### 2. Use NotificationCenter for Actions

```tsx
// ✅ Good - User can take action later
addNotification({
    title: 'New Comment',
    content: 'John replied to your post',
    actions: [
        { label: 'Reply', onClick: () => navigate('/post/123') },
        { label: 'Dismiss', onClick: (id) => removeNotification(id) },
    ],
})

// ❌ Bad - Toast disappears before user can click
notify({
    content: 'John replied (click to view)',
    duration: 3000,
})
```

### 3. Use Both for Important Events

```tsx
// ✅ Good - Immediate feedback + history
const handleImportantAction = async () => {
    const result = await doSomething()

    notify({ content: 'Done!', variant: 'success', duration: 3000 })

    addNotification({
        title: 'Action Complete',
        content: `Processed ${result.count} items`,
        variant: 'success',
    })
}
```

### 4. Error Handling

```tsx
// ✅ Good - Different approaches for different error types
try {
    await saveData()
} catch (error) {
    if (error.type === 'validation') {
        // User can fix immediately - just toast
        notify({ content: error.message, variant: 'error', duration: 5000 })
    } else if (error.type === 'network') {
        // Might need action later - both
        notify({ content: 'Network error', variant: 'error', duration: 4000 })

        addNotification({
            title: 'Save Failed',
            content: 'Network connection lost',
            variant: 'error',
            actions: [
                { label: 'Retry', onClick: () => saveData() },
                { label: 'Dismiss', onClick: (id) => removeNotification(id) },
            ],
        })
    }
}
```

## Helper Function

Create a utility to handle both:

```tsx
import { notify } from './Toast'
import { useNotificationCenter } from './NotificationCenter'

export function useNotifications() {
    const { addNotification, removeNotification } = useNotificationCenter()

    const notifyAll = (options: {
        title?: string
        content: ReactNode
        variant?: 'info' | 'success' | 'warn' | 'error'
        toastDuration?: number
        persistent?: boolean
        actions?: NotificationAction[]
    }) => {
        // Show toast for immediate feedback
        notify({
            content: options.content,
            variant: options.variant,
            duration: options.toastDuration ?? 3000,
        })

        // Add to notification center if persistent or has actions
        if (options.persistent || options.actions) {
            addNotification({
                title: options.title,
                content: options.content,
                variant: options.variant,
                actions: options.actions,
            })
        }
    }

    return {
        notifyAll,
        addNotification,
        removeNotification,
        toast: notify,
    }
}

// Usage
function MyComponent() {
    const { notifyAll } = useNotifications()

    const handleExport = async () => {
        const result = await exportData()

        notifyAll({
            title: 'Export Complete',
            content: `Exported ${result.count} items`,
            variant: 'success',
            persistent: true,
            toastDuration: 3000,
            actions: [
                {
                    label: 'Download',
                    variant: 'primary',
                    onClick: () => downloadFile(),
                },
            ],
        })
    }

    return <button onClick={handleExport}>Export</button>
}
```

## Summary

-   **Toast** = Temporary, auto-dismissing, for immediate feedback
-   **NotificationCenter** = Persistent, action-oriented, for review
-   **Both** = Important events that need immediate attention AND history
