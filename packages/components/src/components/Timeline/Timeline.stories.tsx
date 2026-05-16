import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import Timeline from './Timeline'

export default {
    title: 'Components/Timeline',
    component: Timeline,
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'compact', 'detailed'],
        },
        position: {
            control: 'select',
            options: ['left', 'right', 'alternate'],
        },
    },
} as Meta<typeof Timeline>

type Story = StoryObj<typeof Timeline>

const basicItems = [
    {
        title: 'Project Created',
        description: 'Initial project setup and configuration',
        timestamp: '2024-01-15 10:30 AM',
        status: 'success' as const,
    },
    {
        title: 'Development Started',
        description: 'Team began working on core features',
        timestamp: '2024-01-20 09:00 AM',
        status: 'info' as const,
    },
    {
        title: 'First Release',
        description: 'Version 1.0.0 deployed to production',
        timestamp: '2024-02-01 02:15 PM',
        status: 'success' as const,
    },
    {
        title: 'Bug Reported',
        description: 'Critical bug found in payment system',
        timestamp: '2024-02-03 11:45 AM',
        status: 'error' as const,
    },
    {
        title: 'Hotfix Deployed',
        description: 'Emergency patch released to fix payment issue',
        timestamp: '2024-02-03 04:30 PM',
        status: 'warning' as const,
    },
]

export const Default: Story = {
    args: {
        items: basicItems,
        variant: 'default',
        position: 'right',
    },
}

export const LeftAligned: Story = {
    args: {
        items: basicItems,
        variant: 'default',
        position: 'left',
    },
}

export const Alternate: Story = {
    args: {
        items: basicItems,
        variant: 'default',
        position: 'alternate',
    },
}

export const Compact: Story = {
    args: {
        items: basicItems,
        variant: 'compact',
        position: 'right',
    },
}

export const Detailed: Story = {
    args: {
        items: basicItems,
        variant: 'detailed',
        position: 'right',
    },
}

export const WithIcons: Story = {
    args: {
        items: [
            {
                title: 'Order Placed',
                description: 'Your order has been received',
                timestamp: 'Today, 10:30 AM',
                status: 'success',
                icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                    </svg>
                ),
            },
            {
                title: 'Processing',
                description: 'Your order is being prepared',
                timestamp: 'Today, 11:00 AM',
                status: 'info',
                icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                ),
            },
            {
                title: 'Shipped',
                description: 'Package is on its way',
                timestamp: 'Today, 2:30 PM',
                status: 'default',
                icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18 18.5a1.5 1.5 0 0 1-1.5-1.5 1.5 1.5 0 0 1 1.5-1.5 1.5 1.5 0 0 1 1.5 1.5 1.5 1.5 0 0 1-1.5 1.5m1.5-9l1.96 2.5H17V9.5M6 18.5A1.5 1.5 0 0 1 4.5 17 1.5 1.5 0 0 1 6 15.5 1.5 1.5 0 0 1 7.5 17 1.5 1.5 0 0 1 6 18.5M20 8h-3V4H3c-1.11 0-2 .89-2 2v11h2a3 3 0 0 0 3 3 3 3 0 0 0 3-3h6a3 3 0 0 0 3 3 3 3 0 0 0 3-3h2v-5l-3-4z" />
                    </svg>
                ),
            },
            {
                title: 'Out for Delivery',
                description: 'Expected delivery today',
                timestamp: 'Today, 3:00 PM',
                status: 'default',
                icon: '🚚',
            },
        ],
        variant: 'default',
        position: 'right',
    },
}

export const WithCustomContent: Story = {
    args: {
        items: [
            {
                title: 'Pull Request Created',
                description: 'Feature/new-component branch',
                timestamp: '2 hours ago',
                status: 'info',
                children: (
                    <div
                        style={{
                            padding: '0.75rem',
                            backgroundColor: '#f5f5f5',
                            borderRadius: '4px',
                        }}
                    >
                        <code style={{ fontSize: '0.875rem' }}>
                            git checkout -b feature/new-component
                        </code>
                    </div>
                ),
            },
            {
                title: 'Code Review',
                description: 'Team members reviewed changes',
                timestamp: '1 hour ago',
                status: 'warning',
                children: (
                    <div
                        style={{
                            display: 'flex',
                            gap: '0.5rem',
                            marginTop: '0.5rem',
                        }}
                    >
                        <span
                            style={{
                                padding: '0.25rem 0.5rem',
                                backgroundColor: '#ffc107',
                                color: '#000',
                                borderRadius: '4px',
                                fontSize: '0.75rem',
                            }}
                        >
                            2 comments
                        </span>
                        <span
                            style={{
                                padding: '0.25rem 0.5rem',
                                backgroundColor: '#007bff',
                                color: '#fff',
                                borderRadius: '4px',
                                fontSize: '0.75rem',
                            }}
                        >
                            1 approval
                        </span>
                    </div>
                ),
            },
            {
                title: 'Merged to Main',
                description: 'All checks passed successfully',
                timestamp: '30 minutes ago',
                status: 'success',
                children: (
                    <div
                        style={{
                            padding: '0.75rem',
                            backgroundColor: '#d4edda',
                            borderRadius: '4px',
                            color: '#155724',
                        }}
                    >
                        ✓ All 15 tests passed
                    </div>
                ),
            },
        ],
        variant: 'default',
        position: 'right',
    },
}

export const ActivityLog: Story = {
    args: {
        items: [
            {
                title: 'John Doe logged in',
                timestamp: '2 minutes ago',
                status: 'default',
            },
            {
                title: 'Jane Smith updated profile',
                description: 'Changed profile picture and bio',
                timestamp: '15 minutes ago',
                status: 'info',
            },
            {
                title: 'System backup completed',
                description: 'All data successfully backed up to cloud storage',
                timestamp: '1 hour ago',
                status: 'success',
            },
            {
                title: 'Failed login attempt',
                description: 'IP: 192.168.1.100',
                timestamp: '2 hours ago',
                status: 'error',
            },
            {
                title: 'Server maintenance scheduled',
                description: 'Scheduled for tonight at 2:00 AM',
                timestamp: '3 hours ago',
                status: 'warning',
            },
            {
                title: 'New user registered',
                description: 'Bob Johnson created an account',
                timestamp: '5 hours ago',
                status: 'success',
            },
        ],
        variant: 'compact',
        position: 'right',
    },
}

export const ProjectMilestones: Story = {
    args: {
        items: [
            {
                title: 'Q1 2024 - Planning',
                description: 'Project kickoff and requirements gathering',
                timestamp: 'January 2024',
                status: 'success',
                children: (
                    <ul
                        style={{
                            margin: 0,
                            paddingLeft: '1.25rem',
                            fontSize: '0.875rem',
                        }}
                    >
                        <li>Stakeholder meetings</li>
                        <li>Technical specifications</li>
                        <li>Resource allocation</li>
                    </ul>
                ),
            },
            {
                title: 'Q2 2024 - Development',
                description: 'Core feature implementation',
                timestamp: 'April 2024',
                status: 'success',
                children: (
                    <ul
                        style={{
                            margin: 0,
                            paddingLeft: '1.25rem',
                            fontSize: '0.875rem',
                        }}
                    >
                        <li>Backend API development</li>
                        <li>Frontend UI components</li>
                        <li>Database design</li>
                    </ul>
                ),
            },
            {
                title: 'Q3 2024 - Testing',
                description: 'QA and user acceptance testing',
                timestamp: 'July 2024',
                status: 'info',
                children: (
                    <ul
                        style={{
                            margin: 0,
                            paddingLeft: '1.25rem',
                            fontSize: '0.875rem',
                        }}
                    >
                        <li>Unit testing</li>
                        <li>Integration testing</li>
                        <li>User testing sessions</li>
                    </ul>
                ),
            },
            {
                title: 'Q4 2024 - Launch',
                description: 'Production deployment and monitoring',
                timestamp: 'October 2024',
                status: 'default',
            },
        ],
        variant: 'detailed',
        position: 'alternate',
    },
}

export const AllStatuses: Story = {
    render: () => (
        <div style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>All Timeline Statuses</h3>
            <Timeline
                items={[
                    {
                        title: 'Default Status',
                        description: 'Used for neutral or in-progress items',
                        timestamp: 'Just now',
                        status: 'default',
                    },
                    {
                        title: 'Success Status',
                        description: 'Used for completed or successful actions',
                        timestamp: '5 minutes ago',
                        status: 'success',
                    },
                    {
                        title: 'Error Status',
                        description: 'Used for failed or critical issues',
                        timestamp: '10 minutes ago',
                        status: 'error',
                    },
                    {
                        title: 'Warning Status',
                        description: 'Used for warnings or caution',
                        timestamp: '15 minutes ago',
                        status: 'warning',
                    },
                    {
                        title: 'Info Status',
                        description: 'Used for informational items',
                        timestamp: '20 minutes ago',
                        status: 'info',
                    },
                ]}
                position="right"
            />
        </div>
    ),
}
