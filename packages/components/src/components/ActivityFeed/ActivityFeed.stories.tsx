import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import ActivityFeed, { ActivityItem, ActivityType } from './ActivityFeed'

const meta: Meta<typeof ActivityFeed> = {
    title: 'Components/ActivityFeed',
    component: ActivityFeed,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'compact', 'detailed', 'timeline'],
        },
        showAvatars: { control: 'boolean' },
        showTimestamps: { control: 'boolean' },
        showIcons: { control: 'boolean' },
        groupByDate: { control: 'boolean' },
        showUnreadOnly: { control: 'boolean' },
        loading: { control: 'boolean' },
        animateNew: { control: 'boolean' },
        maxHeight: { control: 'text' },
    },
}

export default meta
type Story = StoryObj<typeof ActivityFeed>

// Sample activities
const sampleActivities: ActivityItem[] = [
    {
        id: 1,
        type: 'comment',
        user: {
            name: 'Sarah Chen',
            avatar: 'https://i.pravatar.cc/150?img=1',
        },
        title: 'commented on your post',
        description: 'This looks amazing! Great work on the design.',
        timestamp: new Date(Date.now() - 5 * 60000),
        read: false,
    },
    {
        id: 2,
        type: 'like',
        user: {
            name: 'Michael Brown',
            avatar: 'https://i.pravatar.cc/150?img=2',
        },
        title: 'liked your photo',
        timestamp: new Date(Date.now() - 15 * 60000),
        read: false,
    },
    {
        id: 3,
        type: 'follow',
        user: {
            name: 'Emma Davis',
            avatar: 'https://i.pravatar.cc/150?img=3',
        },
        title: 'started following you',
        timestamp: new Date(Date.now() - 2 * 3600000),
        read: true,
    },
    {
        id: 4,
        type: 'share',
        user: {
            name: 'James Wilson',
            avatar: 'https://i.pravatar.cc/150?img=4',
        },
        title: 'shared your article',
        description: 'Shared: "10 Tips for Better UI Design"',
        timestamp: new Date(Date.now() - 5 * 3600000),
        read: true,
    },
    {
        id: 5,
        type: 'upload',
        user: {
            name: 'Olivia Martinez',
            avatar: 'https://i.pravatar.cc/150?img=5',
        },
        title: 'uploaded a new file',
        description: 'project-design-final.fig',
        timestamp: new Date(Date.now() - 86400000),
        read: true,
    },
    {
        id: 6,
        type: 'edit',
        user: {
            name: 'William Lee',
            avatar: 'https://i.pravatar.cc/150?img=6',
        },
        title: 'edited the document',
        description: 'Updated section 3 with new data',
        timestamp: new Date(Date.now() - 2 * 86400000),
        read: true,
    },
    {
        id: 7,
        type: 'success',
        title: 'Build completed successfully',
        description: 'Your production build is ready to deploy',
        timestamp: new Date(Date.now() - 3 * 86400000),
        read: true,
    },
    {
        id: 8,
        type: 'warning',
        title: 'API rate limit warning',
        description: 'You are approaching your API quota (80% used)',
        timestamp: new Date(Date.now() - 4 * 86400000),
        read: true,
    },
]

const systemActivities: ActivityItem[] = [
    {
        id: 101,
        type: 'success',
        title: 'Deployment successful',
        description: 'Your application was deployed to production',
        timestamp: new Date(Date.now() - 10 * 60000),
        read: false,
    },
    {
        id: 102,
        type: 'error',
        title: 'Database connection failed',
        description: 'Failed to connect to database server at 192.168.1.100',
        timestamp: new Date(Date.now() - 30 * 60000),
        read: false,
    },
    {
        id: 103,
        type: 'warning',
        title: 'High memory usage detected',
        description: 'Server memory usage is at 85%',
        timestamp: new Date(Date.now() - 3600000),
        read: true,
    },
    {
        id: 104,
        type: 'info',
        title: 'System update available',
        description: 'Version 2.5.0 is now available for download',
        timestamp: new Date(Date.now() - 2 * 3600000),
        read: true,
    },
]

export const Default: Story = {
    args: {
        activities: sampleActivities.slice(0, 5),
    },
    decorators: [
        (Story) => (
            <div style={{ width: '600px', maxWidth: '100%' }}>
                <Story />
            </div>
        ),
    ],
}

export const Compact: Story = {
    args: {
        activities: sampleActivities,
        variant: 'compact',
    },
    decorators: [
        (Story) => (
            <div style={{ width: '500px', maxWidth: '100%' }}>
                <Story />
            </div>
        ),
    ],
}

export const Detailed: Story = {
    args: {
        activities: sampleActivities.slice(0, 4),
        variant: 'detailed',
    },
    decorators: [
        (Story) => (
            <div style={{ width: '700px', maxWidth: '100%' }}>
                <Story />
            </div>
        ),
    ],
}

export const Timeline: Story = {
    args: {
        activities: sampleActivities,
        variant: 'timeline',
    },
    decorators: [
        (Story) => (
            <div style={{ width: '700px', maxWidth: '100%' }}>
                <Story />
            </div>
        ),
    ],
}

export const WithGrouping: Story = {
    args: {
        activities: sampleActivities,
        groupByDate: true,
    },
    decorators: [
        (Story) => (
            <div style={{ width: '600px', maxWidth: '100%' }}>
                <Story />
            </div>
        ),
    ],
}

export const UnreadOnly: Story = {
    args: {
        activities: sampleActivities,
        showUnreadOnly: true,
    },
    decorators: [
        (Story) => (
            <div style={{ width: '600px', maxWidth: '100%' }}>
                <Story />
            </div>
        ),
    ],
}

export const SystemNotifications: Story = {
    args: {
        activities: systemActivities,
        showAvatars: false,
    },
    decorators: [
        (Story) => (
            <div style={{ width: '600px', maxWidth: '100%' }}>
                <Story />
            </div>
        ),
    ],
}

export const WithMaxHeight: Story = {
    args: {
        activities: sampleActivities,
        maxHeight: '400px',
    },
    decorators: [
        (Story) => (
            <div style={{ width: '600px', maxWidth: '100%' }}>
                <Story />
            </div>
        ),
    ],
}

export const WithLoadMore: Story = {
    args: {
        activities: sampleActivities.slice(0, 4),
        showLoadMore: true,
        onLoadMore: () => alert('Load more clicked!'),
    },
    decorators: [
        (Story) => (
            <div style={{ width: '600px', maxWidth: '100%' }}>
                <Story />
            </div>
        ),
    ],
}

export const Loading: Story = {
    args: {
        activities: [],
        loading: true,
    },
    decorators: [
        (Story) => (
            <div style={{ width: '600px', maxWidth: '100%' }}>
                <Story />
            </div>
        ),
    ],
}

export const Empty: Story = {
    args: {
        activities: [],
        emptyMessage: 'No activities yet. Start by creating something!',
    },
    decorators: [
        (Story) => (
            <div style={{ width: '600px', maxWidth: '100%' }}>
                <Story />
            </div>
        ),
    ],
}

export const WithAnimation: Story = {
    args: {
        activities: sampleActivities.slice(0, 5),
        animateNew: true,
    },
    decorators: [
        (Story) => (
            <div style={{ width: '600px', maxWidth: '100%' }}>
                <Story />
            </div>
        ),
    ],
}

export const Interactive: Story = {
    args: {
        activities: sampleActivities,
        onActivityClick: (activity) => {
            alert(`Clicked: ${activity.title}`)
        },
        onMarkAsRead: (id) => {
            console.log(`Marked as read: ${id}`)
        },
    },
    decorators: [
        (Story) => (
            <div style={{ width: '600px', maxWidth: '100%' }}>
                <Story />
            </div>
        ),
    ],
}

export const FilteredByType: Story = {
    args: {
        activities: sampleActivities,
        filterTypes: ['comment', 'like', 'share'] as ActivityType[],
    },
    decorators: [
        (Story) => (
            <div style={{ width: '600px', maxWidth: '100%' }}>
                <Story />
            </div>
        ),
    ],
}

export const CustomIcons: Story = {
    args: {
        activities: sampleActivities.slice(0, 5),
        iconRenderer: (type: ActivityType) => {
            const icons: Record<ActivityType, string> = {
                comment: '🗨️',
                like: '👍',
                share: '📢',
                follow: '➕',
                upload: '⬆️',
                download: '⬇️',
                edit: '📝',
                delete: '❌',
                create: '➕',
                update: '🔄',
                login: '🔓',
                logout: '🔒',
                error: '🔴',
                warning: '🟡',
                success: '🟢',
                info: '🔵',
            }
            return icons[type]
        },
    },
    decorators: [
        (Story) => (
            <div style={{ width: '600px', maxWidth: '100%' }}>
                <Story />
            </div>
        ),
    ],
}

export const RealTimeSimulation: Story = {
    render: () => {
        const [activities, setActivities] = React.useState<ActivityItem[]>(
            sampleActivities.slice(0, 3)
        )

        React.useEffect(() => {
            const interval = setInterval(() => {
                const newActivity: ActivityItem = {
                    id: Date.now(),
                    type: ['comment', 'like', 'share'][
                        Math.floor(Math.random() * 3)
                    ] as ActivityType,
                    user: {
                        name: 'New User',
                        avatar: `https://i.pravatar.cc/150?img=${Math.floor(
                            Math.random() * 70
                        )}`,
                    },
                    title: 'performed an action',
                    timestamp: new Date(),
                    read: false,
                }
                setActivities((prev) => [newActivity, ...prev.slice(0, 9)])
            }, 3000)

            return () => clearInterval(interval)
        }, [])

        return (
            <div style={{ width: '600px', maxWidth: '100%' }}>
                <div
                    style={{
                        marginBottom: '1rem',
                        padding: '0.5rem',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '4px',
                        textAlign: 'center',
                    }}
                >
                    New activities appear every 3 seconds
                </div>
                <ActivityFeed activities={activities} animateNew />
            </div>
        )
    },
}

export const SocialMediaFeed: Story = {
    args: {
        activities: [
            {
                id: 1,
                type: 'like',
                user: {
                    name: 'Alex Johnson',
                    avatar: 'https://i.pravatar.cc/150?img=11',
                },
                title: 'and 12 others liked your photo',
                timestamp: new Date(Date.now() - 2 * 60000),
                read: false,
            },
            {
                id: 2,
                type: 'comment',
                user: {
                    name: 'Sophie Turner',
                    avatar: 'https://i.pravatar.cc/150?img=12',
                },
                title: 'replied to your comment',
                description: "@you That's exactly what I was thinking!",
                timestamp: new Date(Date.now() - 10 * 60000),
                read: false,
            },
            {
                id: 3,
                type: 'follow',
                user: {
                    name: 'Chris Evans',
                    avatar: 'https://i.pravatar.cc/150?img=13',
                },
                title: 'started following you',
                timestamp: new Date(Date.now() - 30 * 60000),
                read: true,
            },
            {
                id: 4,
                type: 'share',
                user: {
                    name: 'Rachel Green',
                    avatar: 'https://i.pravatar.cc/150?img=14',
                },
                title: 'shared your post',
                description: 'Must read! 📚',
                timestamp: new Date(Date.now() - 3600000),
                read: true,
            },
        ],
        variant: 'detailed',
        onActivityClick: (activity) => console.log('Clicked:', activity),
    },
    decorators: [
        (Story) => (
            <div style={{ width: '700px', maxWidth: '100%' }}>
                <Story />
            </div>
        ),
    ],
}

export const DashboardNotifications: Story = {
    args: {
        activities: [
            {
                id: 1,
                type: 'success',
                title: 'Server deployed successfully',
                description: 'Production environment is now live',
                timestamp: new Date(Date.now() - 5 * 60000),
                read: false,
            },
            {
                id: 2,
                type: 'warning',
                title: 'High CPU usage detected',
                description: 'Server load is at 92% capacity',
                timestamp: new Date(Date.now() - 15 * 60000),
                read: false,
            },
            {
                id: 3,
                type: 'error',
                title: 'Payment processing failed',
                description:
                    'Transaction #12345 failed due to insufficient funds',
                timestamp: new Date(Date.now() - 30 * 60000),
                read: true,
            },
            {
                id: 4,
                type: 'info',
                title: 'New user registered',
                description: 'john.doe@example.com joined your platform',
                timestamp: new Date(Date.now() - 3600000),
                read: true,
            },
        ],
        variant: 'compact',
        showAvatars: false,
        maxHeight: '500px',
    },
    decorators: [
        (Story) => (
            <div
                style={{
                    width: '400px',
                    maxWidth: '100%',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    overflow: 'hidden',
                }}
            >
                <div
                    style={{
                        padding: '1rem',
                        borderBottom: '1px solid #e0e0e0',
                        fontWeight: 600,
                    }}
                >
                    System Notifications
                </div>
                <Story />
            </div>
        ),
    ],
}
