import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import Card from './Card'
import Button from '../Button'
import Badge from '../Badge'

const meta: Meta<typeof Card> = {
    title: 'Components/Card',
    component: Card,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'outlined', 'elevated'],
        },
        padding: {
            control: 'select',
            options: ['none', 'sm', 'md', 'lg'],
        },
        clickable: {
            control: 'boolean',
        },
    },
}

export default meta
type Story = StoryObj<typeof Card>

// Basic examples
export const Default: Story = {
    args: {
        children: (
            <>
                <Card.Header>Card Title</Card.Header>
                <Card.Body>
                    <p>
                        This is a basic card with a header and body. Cards are
                        great for displaying grouped content.
                    </p>
                </Card.Body>
            </>
        ),
    },
}

export const SimpleCard: Story = {
    args: {
        children: <p>This is a simple card without header or footer.</p>,
    },
}

export const WithFooter: Story = {
    args: {
        children: (
            <>
                <Card.Header>Complete Card</Card.Header>
                <Card.Body>
                    <p>This card has a header, body, and footer section.</p>
                </Card.Body>
                <Card.Footer>
                    <Button variant="primary">Action</Button>
                    <Button variant="secondary">Cancel</Button>
                </Card.Footer>
            </>
        ),
    },
}

// Variant examples
export const AllVariants: Story = {
    render: () => (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem',
            }}
        >
            <Card variant="default">
                <Card.Header>Default Card</Card.Header>
                <Card.Body>
                    <p>Standard card with a subtle border.</p>
                </Card.Body>
            </Card>
            <Card variant="outlined">
                <Card.Header>Outlined Card</Card.Header>
                <Card.Body>
                    <p>Card with a prominent colored border.</p>
                </Card.Body>
            </Card>
            <Card variant="elevated">
                <Card.Header>Elevated Card</Card.Header>
                <Card.Body>
                    <p>Card with shadow for depth and elevation.</p>
                </Card.Body>
            </Card>
        </div>
    ),
}

export const OutlinedVariant: Story = {
    args: {
        variant: 'outlined',
        children: (
            <>
                <Card.Header>Outlined Card</Card.Header>
                <Card.Body>
                    <p>This card has a prominent outline border.</p>
                </Card.Body>
            </>
        ),
    },
}

export const ElevatedVariant: Story = {
    args: {
        variant: 'elevated',
        children: (
            <>
                <Card.Header>Elevated Card</Card.Header>
                <Card.Body>
                    <p>This card appears to float with shadow effects.</p>
                </Card.Body>
            </>
        ),
    },
}

// Clickable examples
export const ClickableCard: Story = {
    args: {
        variant: 'elevated',
        clickable: true,
        onClick: () => alert('Card clicked!'),
        children: (
            <>
                <Card.Header>Click Me</Card.Header>
                <Card.Body>
                    <p>
                        This card is clickable and will trigger an action on
                        click.
                    </p>
                </Card.Body>
            </>
        ),
    },
}

// Header with actions
export const HeaderWithActions: Story = {
    args: {
        variant: 'elevated',
        children: (
            <>
                <Card.Header
                    actions={
                        <>
                            <Button variant="link">Edit</Button>
                            <Button variant="link">Delete</Button>
                        </>
                    }
                >
                    Card with Actions
                </Card.Header>
                <Card.Body>
                    <p>
                        This card has action buttons in the header for quick
                        access.
                    </p>
                </Card.Body>
            </>
        ),
    },
}

// Padding examples
export const PaddingVariants: Story = {
    render: () => (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem',
            }}
        >
            <Card variant="outlined" padding="none">
                <Card.Body padding="none">
                    <p style={{ margin: 0 }}>No padding</p>
                </Card.Body>
            </Card>
            <Card variant="outlined" padding="sm">
                <Card.Body padding="sm">
                    <p>Small padding</p>
                </Card.Body>
            </Card>
            <Card variant="outlined" padding="md">
                <Card.Body padding="md">
                    <p>Medium padding (default)</p>
                </Card.Body>
            </Card>
            <Card variant="outlined" padding="lg">
                <Card.Body padding="lg">
                    <p>Large padding</p>
                </Card.Body>
            </Card>
        </div>
    ),
}

// Real-world use cases
export const ProductCard: Story = {
    render: () => (
        <div style={{ maxWidth: '350px' }}>
            <Card variant="elevated" clickable padding="none">
                <img
                    src="https://via.placeholder.com/350x200/408bbd/ffffff?text=Product+Image"
                    alt="Product"
                    style={{
                        width: '100%',
                        margin: 0,
                        borderRadius: '0.5rem 0.5rem 0 0',
                    }}
                />
                <Card.Body>
                    <div style={{ marginBottom: '0.5rem' }}>
                        <Badge variant="success" size="sm">
                            New
                        </Badge>
                        <Badge
                            variant="warning"
                            size="sm"
                            style={{ marginLeft: '0.5rem' }}
                        >
                            Sale
                        </Badge>
                    </div>
                    <h3 style={{ margin: '0 0 0.5rem 0' }}>
                        Premium Wireless Headphones
                    </h3>
                    <p style={{ color: '#6c757d', margin: '0 0 0.75rem 0' }}>
                        High-quality audio with active noise cancellation
                    </p>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <div>
                            <span
                                style={{
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                    color: '#408bbd',
                                }}
                            >
                                $199.99
                            </span>
                            <span
                                style={{
                                    textDecoration: 'line-through',
                                    color: '#999',
                                    marginLeft: '0.5rem',
                                }}
                            >
                                $299.99
                            </span>
                        </div>
                    </div>
                </Card.Body>
                <Card.Footer>
                    <Button variant="primary" style={{ flex: 1 }}>
                        Add to Cart
                    </Button>
                </Card.Footer>
            </Card>
        </div>
    ),
}

export const UserProfileCard: Story = {
    render: () => (
        <div style={{ maxWidth: '350px' }}>
            <Card variant="elevated">
                <Card.Body style={{ textAlign: 'center' }}>
                    <div
                        style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            backgroundColor: '#408bbd',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            margin: '0 auto 1rem',
                        }}
                    >
                        JD
                    </div>
                    <h3 style={{ margin: '0 0 0.25rem 0' }}>John Doe</h3>
                    <p style={{ color: '#6c757d', margin: '0 0 1rem 0' }}>
                        Software Engineer
                    </p>
                    <div
                        style={{
                            display: 'flex',
                            gap: '0.5rem',
                            justifyContent: 'center',
                            marginBottom: '1rem',
                        }}
                    >
                        <Badge variant="primary" size="sm">
                            React
                        </Badge>
                        <Badge variant="primary" size="sm">
                            TypeScript
                        </Badge>
                        <Badge variant="success" size="sm">
                            Node.js
                        </Badge>
                    </div>
                </Card.Body>
                <Card.Footer style={{ justifyContent: 'center' }}>
                    <Button variant="primary">View Profile</Button>
                    <Button variant="secondary">Message</Button>
                </Card.Footer>
            </Card>
        </div>
    ),
}

export const StatCards: Story = {
    render: () => (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.5rem',
            }}
        >
            <Card variant="elevated">
                <Card.Body>
                    <div style={{ color: '#6c757d', fontSize: '0.875rem' }}>
                        Total Users
                    </div>
                    <div
                        style={{
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            color: '#408bbd',
                            margin: '0.5rem 0',
                        }}
                    >
                        12,345
                    </div>
                    <div style={{ color: '#28a745', fontSize: '0.875rem' }}>
                        ↑ 12% from last month
                    </div>
                </Card.Body>
            </Card>

            <Card variant="elevated">
                <Card.Body>
                    <div style={{ color: '#6c757d', fontSize: '0.875rem' }}>
                        Revenue
                    </div>
                    <div
                        style={{
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            color: '#408bbd',
                            margin: '0.5rem 0',
                        }}
                    >
                        $45,678
                    </div>
                    <div style={{ color: '#28a745', fontSize: '0.875rem' }}>
                        ↑ 8% from last month
                    </div>
                </Card.Body>
            </Card>

            <Card variant="elevated">
                <Card.Body>
                    <div style={{ color: '#6c757d', fontSize: '0.875rem' }}>
                        Active Projects
                    </div>
                    <div
                        style={{
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            color: '#408bbd',
                            margin: '0.5rem 0',
                        }}
                    >
                        89
                    </div>
                    <div style={{ color: '#dc3545', fontSize: '0.875rem' }}>
                        ↓ 3% from last month
                    </div>
                </Card.Body>
            </Card>
        </div>
    ),
}

export const ContentCard: Story = {
    render: () => (
        <div style={{ maxWidth: '600px' }}>
            <Card variant="outlined">
                <Card.Header
                    actions={
                        <Badge variant="info" size="sm">
                            Tutorial
                        </Badge>
                    }
                >
                    Getting Started with React
                </Card.Header>
                <Card.Body>
                    <p>
                        React is a JavaScript library for building user
                        interfaces. It lets you compose complex UIs from small
                        and isolated pieces of code called "components".
                    </p>
                    <p>
                        In this tutorial, we'll walk through the basics of
                        creating your first React application.
                    </p>
                    <div
                        style={{
                            display: 'flex',
                            gap: '0.5rem',
                            marginTop: '1rem',
                        }}
                    >
                        <Badge variant="primary" size="sm">
                            React
                        </Badge>
                        <Badge variant="primary" size="sm">
                            JavaScript
                        </Badge>
                        <Badge variant="default" size="sm">
                            Beginner
                        </Badge>
                    </div>
                </Card.Body>
                <Card.Footer>
                    <span style={{ color: '#6c757d', fontSize: '0.875rem' }}>
                        5 min read • Posted 2 days ago
                    </span>
                    <Button variant="primary" style={{ marginLeft: 'auto' }}>
                        Read More
                    </Button>
                </Card.Footer>
            </Card>
        </div>
    ),
}

export const NotificationCard: Story = {
    render: () => (
        <div style={{ maxWidth: '400px' }}>
            <Card variant="default" clickable>
                <Card.Body>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                backgroundColor: '#408bbd',
                                flexShrink: 0,
                            }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    marginBottom: '0.25rem',
                                }}
                            >
                                <strong>Sarah Johnson</strong>
                                <Badge variant="danger" size="sm" dot />
                            </div>
                            <p
                                style={{
                                    margin: '0 0 0.5rem 0',
                                    color: '#6c757d',
                                }}
                            >
                                Commented on your post: "Great article! Looking
                                forward to more content like this."
                            </p>
                            <span
                                style={{
                                    fontSize: '0.75rem',
                                    color: '#999',
                                }}
                            >
                                2 minutes ago
                            </span>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </div>
    ),
}

export const DashboardCards: Story = {
    render: () => (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem',
            }}
        >
            <Card variant="elevated">
                <Card.Header
                    actions={
                        <Badge variant="success" size="sm">
                            Active
                        </Badge>
                    }
                >
                    System Status
                </Card.Header>
                <Card.Body>
                    <div style={{ marginBottom: '1rem' }}>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '0.5rem',
                            }}
                        >
                            <span>CPU Usage</span>
                            <strong>45%</strong>
                        </div>
                        <div
                            style={{
                                height: '8px',
                                backgroundColor: '#e9ecef',
                                borderRadius: '4px',
                                overflow: 'hidden',
                            }}
                        >
                            <div
                                style={{
                                    width: '45%',
                                    height: '100%',
                                    backgroundColor: '#28a745',
                                }}
                            />
                        </div>
                    </div>
                    <div>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '0.5rem',
                            }}
                        >
                            <span>Memory Usage</span>
                            <strong>78%</strong>
                        </div>
                        <div
                            style={{
                                height: '8px',
                                backgroundColor: '#e9ecef',
                                borderRadius: '4px',
                                overflow: 'hidden',
                            }}
                        >
                            <div
                                style={{
                                    width: '78%',
                                    height: '100%',
                                    backgroundColor: '#ffc107',
                                }}
                            />
                        </div>
                    </div>
                </Card.Body>
                <Card.Footer>
                    <Button variant="link">View Details</Button>
                </Card.Footer>
            </Card>

            <Card variant="elevated">
                <Card.Header>Recent Activity</Card.Header>
                <Card.Body padding="sm">
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem',
                        }}
                    >
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <Badge variant="success" size="sm" dot />
                            <div style={{ flex: 1 }}>
                                <div>User logged in</div>
                                <span
                                    style={{
                                        fontSize: '0.75rem',
                                        color: '#999',
                                    }}
                                >
                                    2 min ago
                                </span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <Badge variant="warning" size="sm" dot />
                            <div style={{ flex: 1 }}>
                                <div>Database backup started</div>
                                <span
                                    style={{
                                        fontSize: '0.75rem',
                                        color: '#999',
                                    }}
                                >
                                    10 min ago
                                </span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <Badge variant="danger" size="sm" dot />
                            <div style={{ flex: 1 }}>
                                <div>API error detected</div>
                                <span
                                    style={{
                                        fontSize: '0.75rem',
                                        color: '#999',
                                    }}
                                >
                                    15 min ago
                                </span>
                            </div>
                        </div>
                    </div>
                </Card.Body>
                <Card.Footer>
                    <Button variant="link">View All</Button>
                </Card.Footer>
            </Card>
        </div>
    ),
}
