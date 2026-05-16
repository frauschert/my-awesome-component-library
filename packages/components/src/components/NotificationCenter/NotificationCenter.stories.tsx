import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import NotificationCenter, {
    NotificationCenterProvider,
    useNotificationCenter,
} from './NotificationCenter'
import Button from '../Button'
import Stack from '../Stack'

const meta: Meta<typeof NotificationCenter> = {
    title: 'Feedback/NotificationCenter',
    component: NotificationCenter,
    decorators: [
        (Story) => (
            <NotificationCenterProvider maxNotifications={50}>
                <Story />
            </NotificationCenterProvider>
        ),
    ],
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof NotificationCenter>

// Demo component to add notifications
const NotificationDemo = () => {
    const { addNotification } = useNotificationCenter()

    return (
        <Stack gap="md" direction="horizontal">
            <NotificationCenter />
            <Button
                onClick={() =>
                    addNotification({
                        content: 'This is an info notification',
                        variant: 'info',
                    })
                }
            >
                Add Info
            </Button>
            <Button
                onClick={() =>
                    addNotification({
                        content: 'Operation completed successfully!',
                        variant: 'success',
                    })
                }
            >
                Add Success
            </Button>
            <Button
                onClick={() =>
                    addNotification({
                        content: 'Please check your input',
                        variant: 'warn',
                    })
                }
            >
                Add Warning
            </Button>
            <Button
                onClick={() =>
                    addNotification({
                        content: 'An error occurred',
                        variant: 'error',
                    })
                }
            >
                Add Error
            </Button>
        </Stack>
    )
}

export const Default: Story = {
    render: () => <NotificationDemo />,
}

export const WithTitles: Story = {
    render: () => {
        const Demo = () => {
            const { addNotification } = useNotificationCenter()

            return (
                <Stack gap="md" direction="horizontal">
                    <NotificationCenter />
                    <Button
                        onClick={() =>
                            addNotification({
                                title: 'New Message',
                                content:
                                    'You have received a new message from John',
                                variant: 'info',
                            })
                        }
                    >
                        New Message
                    </Button>
                    <Button
                        onClick={() =>
                            addNotification({
                                title: 'Task Completed',
                                content: 'Your export has finished processing',
                                variant: 'success',
                            })
                        }
                    >
                        Task Done
                    </Button>
                </Stack>
            )
        }
        return <Demo />
    },
}

export const WithActions: Story = {
    render: () => {
        const Demo = () => {
            const { addNotification, removeNotification } =
                useNotificationCenter()

            return (
                <Stack gap="md" direction="horizontal">
                    <NotificationCenter />
                    <Button
                        onClick={() =>
                            addNotification({
                                title: 'Friend Request',
                                content: 'John Doe wants to connect with you',
                                variant: 'info',
                                actions: [
                                    {
                                        label: 'Accept',
                                        variant: 'primary',
                                        onClick: (id) => {
                                            console.log('Accepted')
                                            removeNotification(id)
                                        },
                                    },
                                    {
                                        label: 'Decline',
                                        variant: 'secondary',
                                        onClick: (id) => {
                                            console.log('Declined')
                                            removeNotification(id)
                                        },
                                    },
                                ],
                            })
                        }
                    >
                        Friend Request
                    </Button>
                    <Button
                        onClick={() =>
                            addNotification({
                                title: 'Confirm Delete',
                                content:
                                    'Are you sure you want to delete this item?',
                                variant: 'warn',
                                actions: [
                                    {
                                        label: 'Delete',
                                        variant: 'danger',
                                        onClick: (id) => {
                                            console.log('Deleted')
                                            removeNotification(id)
                                        },
                                    },
                                    {
                                        label: 'Cancel',
                                        variant: 'secondary',
                                        onClick: (id) => {
                                            removeNotification(id)
                                        },
                                    },
                                ],
                            })
                        }
                    >
                        Delete Confirmation
                    </Button>
                </Stack>
            )
        }
        return <Demo />
    },
}

export const LeftPosition: Story = {
    render: () => {
        const Demo = () => {
            const { addNotification } = useNotificationCenter()

            return (
                <Stack gap="md" direction="horizontal">
                    <NotificationCenter position="left" />
                    <Button
                        onClick={() =>
                            addNotification({
                                content: 'Notification on the left side',
                                variant: 'info',
                            })
                        }
                    >
                        Add Notification
                    </Button>
                </Stack>
            )
        }
        return <Demo />
    },
}

export const CustomEmptyMessage: Story = {
    render: () => (
        <Stack gap="md" direction="horizontal">
            <NotificationCenter emptyMessage="You're all caught up! 🎉" />
            <div style={{ padding: '1rem' }}>
                <p>Open the notification center to see custom empty state</p>
            </div>
        </Stack>
    ),
}

export const WithoutTimestamp: Story = {
    render: () => {
        const Demo = () => {
            const { addNotification } = useNotificationCenter()

            return (
                <Stack gap="md" direction="horizontal">
                    <NotificationCenter showTimestamp={false} />
                    <Button
                        onClick={() =>
                            addNotification({
                                title: 'System Alert',
                                content: 'Notification without timestamp',
                                variant: 'info',
                            })
                        }
                    >
                        Add Notification
                    </Button>
                </Stack>
            )
        }
        return <Demo />
    },
}

export const WithoutGrouping: Story = {
    render: () => {
        const Demo = () => {
            const { addNotification } = useNotificationCenter()

            return (
                <Stack gap="md" direction="horizontal">
                    <NotificationCenter groupByDate={false} />
                    <Button
                        onClick={() => {
                            addNotification({
                                content: 'Recent notification',
                                variant: 'info',
                            })
                            // Simulate older notification
                            setTimeout(() => {
                                addNotification({
                                    content: 'Another notification',
                                    variant: 'success',
                                })
                            }, 100)
                        }}
                    >
                        Add Multiple
                    </Button>
                </Stack>
            )
        }
        return <Demo />
    },
}

export const ManyNotifications: Story = {
    render: () => {
        const Demo = () => {
            const { addNotification } = useNotificationCenter()

            const addMany = () => {
                const variants = ['info', 'success', 'warn', 'error'] as const
                for (let i = 1; i <= 20; i++) {
                    setTimeout(() => {
                        addNotification({
                            title: `Notification ${i}`,
                            content: `This is notification number ${i}`,
                            variant: variants[i % 4],
                        })
                    }, i * 100)
                }
            }

            return (
                <Stack gap="md" direction="horizontal">
                    <NotificationCenter />
                    <Button onClick={addMany}>Add 20 Notifications</Button>
                </Stack>
            )
        }
        return <Demo />
    },
}

export const RealWorldScenario: Story = {
    render: () => {
        const Demo = () => {
            const { addNotification, removeNotification } =
                useNotificationCenter()

            const scenarios = [
                {
                    label: 'New Comment',
                    notification: {
                        title: 'New Comment',
                        content: 'Sarah commented on your post',
                        variant: 'info' as const,
                        actions: [
                            {
                                label: 'Reply',
                                variant: 'primary' as const,
                                onClick: (id: string) => {
                                    console.log('Replying...')
                                    removeNotification(id)
                                },
                            },
                            {
                                label: 'View',
                                variant: 'secondary' as const,
                                onClick: (id: string) => {
                                    console.log('Viewing...')
                                    removeNotification(id)
                                },
                            },
                        ],
                    },
                },
                {
                    label: 'File Upload',
                    notification: {
                        title: 'Upload Complete',
                        content: 'document.pdf has been uploaded successfully',
                        variant: 'success' as const,
                    },
                },
                {
                    label: 'Low Storage',
                    notification: {
                        title: 'Storage Warning',
                        content: 'You are running low on storage space',
                        variant: 'warn' as const,
                        actions: [
                            {
                                label: 'Manage Storage',
                                variant: 'primary' as const,
                                onClick: (id: string) => {
                                    console.log('Managing storage...')
                                    removeNotification(id)
                                },
                            },
                        ],
                    },
                },
                {
                    label: 'Payment Failed',
                    notification: {
                        title: 'Payment Failed',
                        content: 'Your payment could not be processed',
                        variant: 'error' as const,
                        actions: [
                            {
                                label: 'Retry',
                                variant: 'danger' as const,
                                onClick: (id: string) => {
                                    console.log('Retrying payment...')
                                    removeNotification(id)
                                },
                            },
                            {
                                label: 'Update Card',
                                variant: 'secondary' as const,
                                onClick: (id: string) => {
                                    console.log('Updating card...')
                                    removeNotification(id)
                                },
                            },
                        ],
                    },
                },
            ]

            return (
                <Stack gap="md">
                    <Stack gap="md" direction="horizontal">
                        <NotificationCenter />
                        {scenarios.map((scenario) => (
                            <Button
                                key={scenario.label}
                                onClick={() =>
                                    addNotification(scenario.notification)
                                }
                            >
                                {scenario.label}
                            </Button>
                        ))}
                    </Stack>
                    <p
                        style={{
                            marginTop: '1rem',
                            color: '#666',
                            fontSize: '0.875rem',
                        }}
                    >
                        Click the notification bell to view your notifications
                    </p>
                </Stack>
            )
        }
        return <Demo />
    },
}
