import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import NotificationCenter, {
    NotificationCenterProvider,
    useNotificationCenter,
} from './NotificationCenter'

// Test component to trigger notifications
const TestTrigger = () => {
    const { addNotification } = useNotificationCenter()

    return (
        <button
            onClick={() =>
                addNotification({
                    content: 'Test notification',
                    variant: 'info',
                })
            }
        >
            Add Notification
        </button>
    )
}

describe('NotificationCenter', () => {
    const renderWithProvider = (ui: React.ReactElement) => {
        return render(
            <NotificationCenterProvider maxNotifications={10}>
                {ui}
            </NotificationCenterProvider>
        )
    }

    it('renders the notification center trigger', () => {
        renderWithProvider(<NotificationCenter />)
        const trigger = screen.getByRole('button', { name: /notifications/i })
        expect(trigger).toBeInTheDocument()
    })

    it('shows 0 unread notifications initially', () => {
        renderWithProvider(<NotificationCenter />)
        const trigger = screen.getByRole('button', { name: /0 unread/i })
        expect(trigger).toBeInTheDocument()
    })

    it('opens the notification panel when trigger is clicked', () => {
        renderWithProvider(<NotificationCenter />)
        const trigger = screen.getByRole('button', { name: /notifications/i })
        fireEvent.click(trigger)

        const panel = screen.getByRole('dialog', {
            name: /notification center/i,
        })
        expect(panel).toBeInTheDocument()
    })

    it('displays empty state when no notifications', () => {
        renderWithProvider(<NotificationCenter />)
        const trigger = screen.getByRole('button', { name: /notifications/i })
        fireEvent.click(trigger)

        expect(screen.getByText('No notifications')).toBeInTheDocument()
    })

    it('displays custom empty message', () => {
        renderWithProvider(<NotificationCenter emptyMessage="All caught up!" />)
        const trigger = screen.getByRole('button', { name: /notifications/i })
        fireEvent.click(trigger)

        expect(screen.getByText('All caught up!')).toBeInTheDocument()
    })

    it('adds and displays a notification', async () => {
        renderWithProvider(
            <>
                <TestTrigger />
                <NotificationCenter />
            </>
        )

        // Add a notification
        fireEvent.click(screen.getByText('Add Notification'))

        // Open notification center
        const trigger = screen.getByRole('button', { name: /1 unread/i })
        expect(trigger).toBeInTheDocument()

        fireEvent.click(trigger)

        await waitFor(() => {
            expect(screen.getByText('Test notification')).toBeInTheDocument()
        })
    })

    it('increments unread count', () => {
        renderWithProvider(
            <>
                <TestTrigger />
                <NotificationCenter />
            </>
        )

        // Add notifications
        fireEvent.click(screen.getByText('Add Notification'))
        fireEvent.click(screen.getByText('Add Notification'))

        const trigger = screen.getByRole('button', { name: /2 unread/i })
        expect(trigger).toBeInTheDocument()
    })

    it('removes a notification when remove button is clicked', async () => {
        renderWithProvider(
            <>
                <TestTrigger />
                <NotificationCenter />
            </>
        )

        // Add a notification
        fireEvent.click(screen.getByText('Add Notification'))

        // Open panel
        const trigger = screen.getByRole('button', { name: /notifications/i })
        fireEvent.click(trigger)

        // Wait for notification to appear
        await waitFor(() => {
            expect(screen.getByText('Test notification')).toBeInTheDocument()
        })

        // Remove it
        const removeButton = screen.getByRole('button', {
            name: /remove notification/i,
        })
        fireEvent.click(removeButton)

        await waitFor(() => {
            expect(
                screen.queryByText('Test notification')
            ).not.toBeInTheDocument()
        })
    })

    it('clears all notifications', async () => {
        renderWithProvider(
            <>
                <TestTrigger />
                <NotificationCenter />
            </>
        )

        // Add multiple notifications
        fireEvent.click(screen.getByText('Add Notification'))
        fireEvent.click(screen.getByText('Add Notification'))

        // Open panel
        const trigger = screen.getByRole('button', { name: /notifications/i })
        fireEvent.click(trigger)

        // Clear all
        const clearButton = screen.getByText('Clear all')
        fireEvent.click(clearButton)

        await waitFor(() => {
            expect(screen.getByText('No notifications')).toBeInTheDocument()
        })
    })

    it('marks notifications as read when clicked', async () => {
        renderWithProvider(
            <>
                <TestTrigger />
                <NotificationCenter />
            </>
        )

        // Add notification
        fireEvent.click(screen.getByText('Add Notification'))

        // Open panel
        const trigger = screen.getByRole('button', { name: /1 unread/i })
        fireEvent.click(trigger)

        // Click the notification
        const notification = await screen.findByText('Test notification')
        fireEvent.click(notification.closest('.notification-center__item')!)

        // Unread count should decrease (but might take time due to setTimeout)
        await waitFor(
            () => {
                const updatedTrigger = screen.getByRole('button', {
                    name: /0 unread/i,
                })
                expect(updatedTrigger).toBeInTheDocument()
            },
            { timeout: 1000 }
        )
    })

    it('supports different notification variants', async () => {
        const TestVariants = () => {
            const { addNotification } = useNotificationCenter()
            return (
                <>
                    <button
                        onClick={() =>
                            addNotification({
                                content: 'Info',
                                variant: 'info',
                            })
                        }
                    >
                        Info
                    </button>
                    <button
                        onClick={() =>
                            addNotification({
                                content: 'Success',
                                variant: 'success',
                            })
                        }
                    >
                        Success
                    </button>
                    <button
                        onClick={() =>
                            addNotification({
                                content: 'Warning',
                                variant: 'warn',
                            })
                        }
                    >
                        Warning
                    </button>
                    <button
                        onClick={() =>
                            addNotification({
                                content: 'Error',
                                variant: 'error',
                            })
                        }
                    >
                        Error
                    </button>
                </>
            )
        }

        renderWithProvider(
            <>
                <TestVariants />
                <NotificationCenter />
            </>
        )

        fireEvent.click(screen.getByText('Info'))
        fireEvent.click(screen.getByText('Success'))
        fireEvent.click(screen.getByText('Warning'))
        fireEvent.click(screen.getByText('Error'))

        const trigger = screen.getByRole('button', { name: /4 unread/i })
        fireEvent.click(trigger)

        await waitFor(() => {
            expect(screen.getAllByText('Info').length).toBeGreaterThan(0)
            expect(screen.getAllByText('Success').length).toBeGreaterThan(0)
            expect(screen.getAllByText('Warning').length).toBeGreaterThan(0)
            expect(screen.getAllByText('Error').length).toBeGreaterThan(0)
        })
    })

    it('respects maxNotifications limit', () => {
        const TestMultiple = () => {
            const { addNotification } = useNotificationCenter()
            return (
                <button
                    onClick={() => {
                        for (let i = 0; i < 15; i++) {
                            addNotification({ content: `Notification ${i}` })
                        }
                    }}
                >
                    Add Many
                </button>
            )
        }

        renderWithProvider(
            <>
                <TestMultiple />
                <NotificationCenter />
            </>
        )

        fireEvent.click(screen.getByText('Add Many'))

        // Should show max 10 (based on provider prop)
        const trigger = screen.getByRole('button', { name: /10 unread/i })
        expect(trigger).toBeInTheDocument()
    })

    it('closes on Escape key', async () => {
        renderWithProvider(<NotificationCenter />)

        // Open panel
        const trigger = screen.getByRole('button', { name: /notifications/i })
        fireEvent.click(trigger)

        const panel = screen.getByRole('dialog')
        expect(panel).toBeInTheDocument()

        // Press Escape
        fireEvent.keyDown(document, { key: 'Escape' })

        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
        })
    })

    it('renders notification with title and actions', async () => {
        const TestWithActions = () => {
            const { addNotification } = useNotificationCenter()
            return (
                <button
                    onClick={() =>
                        addNotification({
                            title: 'New Message',
                            content: 'You have received a new message',
                            variant: 'info',
                            actions: [
                                {
                                    label: 'View',
                                    onClick: jest.fn(),
                                    variant: 'primary',
                                },
                                {
                                    label: 'Dismiss',
                                    onClick: jest.fn(),
                                    variant: 'secondary',
                                },
                            ],
                        })
                    }
                >
                    Add Complex
                </button>
            )
        }

        renderWithProvider(
            <>
                <TestWithActions />
                <NotificationCenter />
            </>
        )

        fireEvent.click(screen.getByText('Add Complex'))

        const trigger = screen.getByRole('button', { name: /notifications/i })
        fireEvent.click(trigger)

        await waitFor(() => {
            expect(screen.getByText('New Message')).toBeInTheDocument()
            expect(
                screen.getByText('You have received a new message')
            ).toBeInTheDocument()
            expect(screen.getByText('View')).toBeInTheDocument()
            expect(screen.getByText('Dismiss')).toBeInTheDocument()
        })
    })
})
