import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import Badge from './Badge'

const meta: Meta<typeof Badge> = {
    title: 'Components/Badge',
    component: Badge,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: [
                'default',
                'primary',
                'success',
                'warning',
                'danger',
                'info',
            ],
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
        },
        dot: {
            control: 'boolean',
        },
        rounded: {
            control: 'boolean',
        },
    },
}

export default meta
type Story = StoryObj<typeof Badge>

// Basic examples
export const Default: Story = {
    args: {
        children: 'Badge',
    },
}

export const WithNumber: Story = {
    args: {
        children: '5',
    },
}

export const WithLongText: Story = {
    args: {
        children: 'New Feature',
    },
}

// Variant examples
export const AllVariants: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Badge variant="default">Default</Badge>
            <Badge variant="primary">Primary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="danger">Danger</Badge>
            <Badge variant="info">Info</Badge>
        </div>
    ),
}

export const PrimaryVariant: Story = {
    args: {
        children: 'Primary',
        variant: 'primary',
    },
}

export const SuccessVariant: Story = {
    args: {
        children: 'Success',
        variant: 'success',
    },
}

export const WarningVariant: Story = {
    args: {
        children: 'Warning',
        variant: 'warning',
    },
}

export const DangerVariant: Story = {
    args: {
        children: 'Danger',
        variant: 'danger',
    },
}

export const InfoVariant: Story = {
    args: {
        children: 'Info',
        variant: 'info',
    },
}

// Size examples
export const AllSizes: Story = {
    render: () => (
        <div
            style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'center',
                flexWrap: 'wrap',
            }}
        >
            <Badge size="sm" variant="primary">
                Small
            </Badge>
            <Badge size="md" variant="primary">
                Medium
            </Badge>
            <Badge size="lg" variant="primary">
                Large
            </Badge>
        </div>
    ),
}

export const SmallSize: Story = {
    args: {
        children: 'Small',
        size: 'sm',
        variant: 'primary',
    },
}

export const MediumSize: Story = {
    args: {
        children: 'Medium',
        size: 'md',
        variant: 'primary',
    },
}

export const LargeSize: Story = {
    args: {
        children: 'Large',
        size: 'lg',
        variant: 'primary',
    },
}

// Dot indicator examples
export const DotIndicator: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span>
                Notifications{' '}
                <Badge dot variant="danger" ariaLabel="New notifications" />
            </span>
            <span>
                Online <Badge dot variant="success" ariaLabel="Online status" />
            </span>
            <span>
                Away <Badge dot variant="warning" ariaLabel="Away status" />
            </span>
        </div>
    ),
}

export const DotAllVariants: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Badge dot variant="default" ariaLabel="Default" />
            <Badge dot variant="primary" ariaLabel="Primary" />
            <Badge dot variant="success" ariaLabel="Success" />
            <Badge dot variant="warning" ariaLabel="Warning" />
            <Badge dot variant="danger" ariaLabel="Danger" />
            <Badge dot variant="info" ariaLabel="Info" />
        </div>
    ),
}

// Shape examples
export const SquareBadges: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Badge rounded={false} variant="default">
                Default
            </Badge>
            <Badge rounded={false} variant="primary">
                Primary
            </Badge>
            <Badge rounded={false} variant="success">
                99+
            </Badge>
            <Badge rounded={false} variant="danger">
                5
            </Badge>
        </div>
    ),
}

// Interactive examples
export const Clickable: Story = {
    args: {
        children: 'Click me',
        variant: 'primary',
        onClick: () => alert('Badge clicked!'),
    },
}

export const ClickableWithKeyboard: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Badge
                variant="primary"
                onClick={() => alert('Filter: Active')}
                ariaLabel="Filter by active status"
            >
                Active
            </Badge>
            <Badge
                variant="success"
                onClick={() => alert('Filter: Completed')}
                ariaLabel="Filter by completed status"
            >
                Completed
            </Badge>
            <Badge
                variant="warning"
                onClick={() => alert('Filter: Pending')}
                ariaLabel="Filter by pending status"
            >
                Pending
            </Badge>
        </div>
    ),
}

// Real-world use cases
export const NotificationCounts: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div
                style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
            >
                <span>Messages</span>
                <Badge variant="danger">3</Badge>
            </div>
            <div
                style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
            >
                <span>Notifications</span>
                <Badge variant="primary">12</Badge>
            </div>
            <div
                style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
            >
                <span>Updates</span>
                <Badge variant="info">99+</Badge>
            </div>
        </div>
    ),
}

export const StatusIndicators: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div
                style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
            >
                <span>Server Status:</span>
                <Badge variant="success">Online</Badge>
            </div>
            <div
                style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
            >
                <span>Build Status:</span>
                <Badge variant="warning">Pending</Badge>
            </div>
            <div
                style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
            >
                <span>API Status:</span>
                <Badge variant="danger">Error</Badge>
            </div>
            <div
                style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
            >
                <span>Database:</span>
                <Badge variant="info">Syncing</Badge>
            </div>
        </div>
    ),
}

export const TagLabels: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Badge variant="primary">React</Badge>
            <Badge variant="primary">TypeScript</Badge>
            <Badge variant="success">Open Source</Badge>
            <Badge variant="info">Documentation</Badge>
            <Badge variant="warning">Beta</Badge>
            <Badge variant="default">v2.0.0</Badge>
        </div>
    ),
}

export const UserRoles: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div
                style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
            >
                <span>John Doe</span>
                <Badge size="sm" variant="danger">
                    Admin
                </Badge>
            </div>
            <div
                style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
            >
                <span>Jane Smith</span>
                <Badge size="sm" variant="primary">
                    Editor
                </Badge>
            </div>
            <div
                style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
            >
                <span>Bob Johnson</span>
                <Badge size="sm" variant="default">
                    Viewer
                </Badge>
            </div>
        </div>
    ),
}

export const ProductBadges: Story = {
    render: () => (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '1rem',
            }}
        >
            <div
                style={{
                    padding: '1rem',
                    border: '1px solid #dee2e6',
                    borderRadius: '0.5rem',
                }}
            >
                <div style={{ marginBottom: '0.5rem' }}>
                    <strong>Premium T-Shirt</strong>
                </div>
                <div
                    style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}
                >
                    <Badge size="sm" variant="danger">
                        Sale
                    </Badge>
                    <Badge size="sm" variant="warning">
                        Limited
                    </Badge>
                </div>
            </div>
            <div
                style={{
                    padding: '1rem',
                    border: '1px solid #dee2e6',
                    borderRadius: '0.5rem',
                }}
            >
                <div style={{ marginBottom: '0.5rem' }}>
                    <strong>Wireless Headphones</strong>
                </div>
                <div
                    style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}
                >
                    <Badge size="sm" variant="success">
                        New
                    </Badge>
                    <Badge size="sm" variant="info">
                        Trending
                    </Badge>
                </div>
            </div>
            <div
                style={{
                    padding: '1rem',
                    border: '1px solid #dee2e6',
                    borderRadius: '0.5rem',
                }}
            >
                <div style={{ marginBottom: '0.5rem' }}>
                    <strong>Smart Watch</strong>
                </div>
                <div
                    style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}
                >
                    <Badge size="sm" variant="default">
                        Out of Stock
                    </Badge>
                </div>
            </div>
        </div>
    ),
}
