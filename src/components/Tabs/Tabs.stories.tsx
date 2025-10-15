import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import Tabs from './Tabs'
import type { TabItem } from './Tabs'
import Card from '../Card'
import Badge from '../Badge'
import { ThemeProvider, ThemeSwitcher } from '../Theme'

const meta: Meta<typeof Tabs> = {
    title: 'Components/Tabs',
    component: Tabs,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'card', 'line'],
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
        },
        fullWidth: {
            control: 'boolean',
        },
        animated: {
            control: 'boolean',
        },
    },
    decorators: [
        (Story) => (
            <ThemeProvider>
                <Story />
                <ThemeSwitcher />
            </ThemeProvider>
        ),
    ],
}

export default meta
type Story = StoryObj<typeof Tabs>

// Basic tabs
const basicItems: TabItem[] = [
    {
        id: 'tab1',
        label: 'Tab 1',
        content: <p>Content for the first tab.</p>,
    },
    {
        id: 'tab2',
        label: 'Tab 2',
        content: <p>Content for the second tab.</p>,
    },
    {
        id: 'tab3',
        label: 'Tab 3',
        content: <p>Content for the third tab.</p>,
    },
]

export const Default: Story = {
    args: {
        items: basicItems,
    },
}

// With icons
const iconItems: TabItem[] = [
    {
        id: 'home',
        label: 'Home',
        icon: '🏠',
        content: (
            <p>
                Welcome to the home tab. This is where you can see an overview.
            </p>
        ),
    },
    {
        id: 'settings',
        label: 'Settings',
        icon: '⚙️',
        content: <p>Configure your preferences and settings here.</p>,
    },
    {
        id: 'notifications',
        label: 'Notifications',
        icon: '🔔',
        content: <p>Check your notifications and updates.</p>,
    },
    {
        id: 'profile',
        label: 'Profile',
        icon: '👤',
        content: <p>View and edit your profile information.</p>,
    },
]

export const WithIcons: Story = {
    args: {
        items: iconItems,
    },
}

// With badges
const badgeItems: TabItem[] = [
    {
        id: 'inbox',
        label: 'Inbox',
        badge: 5,
        content: (
            <div>
                <p>You have 5 new messages</p>
            </div>
        ),
    },
    {
        id: 'drafts',
        label: 'Drafts',
        badge: 2,
        content: <p>You have 2 draft messages.</p>,
    },
    {
        id: 'sent',
        label: 'Sent',
        badge: 0,
        content: <p>Your sent messages appear here.</p>,
    },
    {
        id: 'archive',
        label: 'Archive',
        content: <p>Your archived messages appear here.</p>,
    },
]

export const WithBadges: Story = {
    args: {
        items: badgeItems,
    },
}

// Variants
export const AllVariants: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
                <h3 style={{ marginBottom: '1rem' }}>Default Variant</h3>
                <Tabs
                    variant="default"
                    items={basicItems}
                    ariaLabel="Default tabs"
                />
            </div>
            <div>
                <h3 style={{ marginBottom: '1rem' }}>Card Variant</h3>
                <Tabs variant="card" items={basicItems} ariaLabel="Card tabs" />
            </div>
            <div>
                <h3 style={{ marginBottom: '1rem' }}>Line Variant</h3>
                <Tabs variant="line" items={basicItems} ariaLabel="Line tabs" />
            </div>
        </div>
    ),
}

export const CardVariant: Story = {
    args: {
        variant: 'card',
        items: basicItems,
    },
}

export const LineVariant: Story = {
    args: {
        variant: 'line',
        items: basicItems,
    },
}

// Sizes
export const AllSizes: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
                <h3 style={{ marginBottom: '1rem' }}>Small</h3>
                <Tabs size="sm" items={basicItems} ariaLabel="Small tabs" />
            </div>
            <div>
                <h3 style={{ marginBottom: '1rem' }}>Medium (default)</h3>
                <Tabs size="md" items={basicItems} ariaLabel="Medium tabs" />
            </div>
            <div>
                <h3 style={{ marginBottom: '1rem' }}>Large</h3>
                <Tabs size="lg" items={basicItems} ariaLabel="Large tabs" />
            </div>
        </div>
    ),
}

export const SmallSize: Story = {
    args: {
        size: 'sm',
        items: basicItems,
    },
}

export const LargeSize: Story = {
    args: {
        size: 'lg',
        items: basicItems,
    },
}

// Full width
export const FullWidth: Story = {
    args: {
        fullWidth: true,
        items: basicItems,
    },
}

// Disabled tabs
const disabledItems: TabItem[] = [
    {
        id: 'tab1',
        label: 'Enabled',
        content: <p>This tab is enabled.</p>,
    },
    {
        id: 'tab2',
        label: 'Disabled',
        disabled: true,
        content: <p>This tab is disabled.</p>,
    },
    {
        id: 'tab3',
        label: 'Also Enabled',
        content: <p>This tab is enabled too.</p>,
    },
]

export const DisabledTabs: Story = {
    args: {
        items: disabledItems,
    },
}

// Controlled tabs
export const ControlledTabs: Story = {
    render: () => {
        const [activeId, setActiveId] = useState('tab1')

        return (
            <div>
                <div style={{ marginBottom: '1rem' }}>
                    <p>
                        Active Tab: <strong>{activeId}</strong>
                    </p>
                    <button onClick={() => setActiveId('tab1')}>
                        Go to Tab 1
                    </button>
                    <button
                        onClick={() => setActiveId('tab2')}
                        style={{ marginLeft: '0.5rem' }}
                    >
                        Go to Tab 2
                    </button>
                    <button
                        onClick={() => setActiveId('tab3')}
                        style={{ marginLeft: '0.5rem' }}
                    >
                        Go to Tab 3
                    </button>
                </div>
                <Tabs
                    items={basicItems}
                    activeId={activeId}
                    onChange={setActiveId}
                />
            </div>
        )
    },
}

// Real-world use cases
const documentationItems: TabItem[] = [
    {
        id: 'overview',
        label: 'Overview',
        icon: '📖',
        content: (
            <Card>
                <Card.Body>
                    <h3>Overview</h3>
                    <p>
                        Tabs are a great way to organize content into logical
                        sections. They allow users to switch between different
                        views without leaving the page.
                    </p>
                </Card.Body>
            </Card>
        ),
    },
    {
        id: 'usage',
        label: 'Usage',
        icon: '💻',
        content: (
            <Card>
                <Card.Body>
                    <h3>Usage</h3>
                    <pre
                        style={{
                            backgroundColor: '#f5f5f5',
                            padding: '1rem',
                            borderRadius: '0.5rem',
                            overflow: 'auto',
                        }}
                    >
                        {`<Tabs
  items={items}
  variant="default"
  onChange={(id) => console.log(id)}
/>`}
                    </pre>
                </Card.Body>
            </Card>
        ),
    },
    {
        id: 'api',
        label: 'API',
        icon: '⚙️',
        content: (
            <Card>
                <Card.Body>
                    <h3>Props</h3>
                    <ul>
                        <li>
                            <strong>items</strong> - Array of TabItem
                        </li>
                        <li>
                            <strong>variant</strong> - 'default' | 'card' |
                            'line'
                        </li>
                        <li>
                            <strong>activeId</strong> - Controlled active tab
                        </li>
                        <li>
                            <strong>onChange</strong> - Callback on tab change
                        </li>
                        <li>
                            <strong>size</strong> - 'sm' | 'md' | 'lg'
                        </li>
                        <li>
                            <strong>fullWidth</strong> - Stretch tabs to full
                            width
                        </li>
                    </ul>
                </Card.Body>
            </Card>
        ),
    },
]

export const Documentation: Story = {
    render: () => <Tabs items={documentationItems} variant="card" size="md" />,
}

// Dashboard tabs
const dashboardItems: TabItem[] = [
    {
        id: 'overview',
        label: 'Overview',
        icon: '📊',
        badge: 'New',
        content: (
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                }}
            >
                <Card variant="elevated">
                    <Card.Body>
                        <div style={{ color: '#6c757d' }}>Total Users</div>
                        <div
                            style={{
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                                color: '#408bbd',
                            }}
                        >
                            12,345
                        </div>
                    </Card.Body>
                </Card>
                <Card variant="elevated">
                    <Card.Body>
                        <div style={{ color: '#6c757d' }}>Revenue</div>
                        <div
                            style={{
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                                color: '#28a745',
                            }}
                        >
                            $45,678
                        </div>
                    </Card.Body>
                </Card>
                <Card variant="elevated">
                    <Card.Body>
                        <div style={{ color: '#6c757d' }}>Conversion</div>
                        <div
                            style={{
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                                color: '#17a2b8',
                            }}
                        >
                            3.24%
                        </div>
                    </Card.Body>
                </Card>
            </div>
        ),
    },
    {
        id: 'analytics',
        label: 'Analytics',
        icon: '📈',
        content: (
            <Card>
                <Card.Body>
                    <h3>Analytics Data</h3>
                    <p>
                        Detailed analytics and performance metrics would be
                        displayed here.
                    </p>
                    <ul style={{ marginTop: '1rem' }}>
                        <li>Page views: 54,321</li>
                        <li>Unique visitors: 12,345</li>
                        <li>Bounce rate: 34.2%</li>
                        <li>Avg session: 3m 24s</li>
                    </ul>
                </Card.Body>
            </Card>
        ),
    },
    {
        id: 'reports',
        label: 'Reports',
        icon: '📄',
        badge: 3,
        content: (
            <div>
                <h3>Available Reports</h3>
                <Card style={{ marginTop: '1rem' }}>
                    <Card.Header
                        actions={
                            <Badge variant="success" size="sm">
                                Complete
                            </Badge>
                        }
                    >
                        Q3 Performance Report
                    </Card.Header>
                    <Card.Body>
                        <p>Comprehensive performance analysis for Q3 2024.</p>
                    </Card.Body>
                </Card>
                <Card style={{ marginTop: '1rem' }}>
                    <Card.Header
                        actions={
                            <Badge variant="warning" size="sm">
                                Pending
                            </Badge>
                        }
                    >
                        Customer Feedback Analysis
                    </Card.Header>
                    <Card.Body>
                        <p>
                            Detailed customer feedback review and sentiment
                            analysis.
                        </p>
                    </Card.Body>
                </Card>
            </div>
        ),
    },
    {
        id: 'settings',
        label: 'Settings',
        icon: '⚙️',
        content: (
            <Card>
                <Card.Body>
                    <h3>Dashboard Settings</h3>
                    <form
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                            marginTop: '1rem',
                        }}
                    >
                        <label>
                            <input type="checkbox" defaultChecked /> Show
                            notifications
                        </label>
                        <label>
                            <input type="checkbox" defaultChecked /> Enable dark
                            mode
                        </label>
                        <label>
                            <input type="checkbox" /> Show advanced metrics
                        </label>
                    </form>
                </Card.Body>
            </Card>
        ),
    },
]

export const Dashboard: Story = {
    render: () => (
        <Tabs
            items={dashboardItems}
            variant="default"
            size="md"
            ariaLabel="Dashboard navigation"
        />
    ),
}

// Settings tabs
const settingsItems: TabItem[] = [
    {
        id: 'general',
        label: 'General',
        content: (
            <Card>
                <Card.Body>
                    <h3>General Settings</h3>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                            marginTop: '1rem',
                        }}
                    >
                        <div>
                            <label htmlFor="siteName">Site Name</label>
                            <input
                                id="siteName"
                                type="text"
                                defaultValue="My Awesome Site"
                                style={{ width: '100%', padding: '0.5rem' }}
                            />
                        </div>
                        <div>
                            <label htmlFor="timezone">Timezone</label>
                            <select
                                id="timezone"
                                style={{ width: '100%', padding: '0.5rem' }}
                            >
                                <option>UTC</option>
                                <option>EST</option>
                                <option>PST</option>
                            </select>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        ),
    },
    {
        id: 'security',
        label: 'Security',
        content: (
            <Card>
                <Card.Body>
                    <h3>Security Settings</h3>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                            marginTop: '1rem',
                        }}
                    >
                        <label>
                            <input type="checkbox" defaultChecked /> Require 2FA
                        </label>
                        <label>
                            <input type="checkbox" /> IP whitelist
                        </label>
                        <label>
                            <input type="checkbox" defaultChecked /> Session
                            timeout
                        </label>
                    </div>
                </Card.Body>
            </Card>
        ),
    },
    {
        id: 'notifications',
        label: 'Notifications',
        content: (
            <Card>
                <Card.Body>
                    <h3>Notification Preferences</h3>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                            marginTop: '1rem',
                        }}
                    >
                        <label>
                            <input type="checkbox" defaultChecked /> Email
                            notifications
                        </label>
                        <label>
                            <input type="checkbox" defaultChecked /> Push
                            notifications
                        </label>
                        <label>
                            <input type="checkbox" /> SMS alerts
                        </label>
                    </div>
                </Card.Body>
            </Card>
        ),
    },
]

export const Settings: Story = {
    render: () => (
        <Tabs
            items={settingsItems}
            variant="card"
            size="md"
            ariaLabel="Settings navigation"
        />
    ),
}

// Long content tabs
const longItems: TabItem[] = [
    {
        id: 'description',
        label: 'Description',
        content: (
            <div>
                <h3>Product Description</h3>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p>
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                </p>
            </div>
        ),
    },
    {
        id: 'details',
        label: 'Details',
        content: (
            <div>
                <h3>Specifications</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                        <tr style={{ borderBottom: '1px solid #dee2e6' }}>
                            <td style={{ padding: '0.5rem' }}>Color</td>
                            <td style={{ padding: '0.5rem' }}>Black</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #dee2e6' }}>
                            <td style={{ padding: '0.5rem' }}>Size</td>
                            <td style={{ padding: '0.5rem' }}>M, L, XL</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #dee2e6' }}>
                            <td style={{ padding: '0.5rem' }}>Material</td>
                            <td style={{ padding: '0.5rem' }}>100% Cotton</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '0.5rem' }}>Weight</td>
                            <td style={{ padding: '0.5rem' }}>250g</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        ),
    },
    {
        id: 'reviews',
        label: 'Reviews',
        badge: '24',
        content: (
            <div>
                <h3>Customer Reviews</h3>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        marginTop: '1rem',
                    }}
                >
                    <Card variant="outlined">
                        <Card.Body>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '0.5rem',
                                }}
                            >
                                <strong>Sarah M.</strong>
                                <span>⭐⭐⭐⭐⭐</span>
                            </div>
                            <p>"Great product! Highly recommend."</p>
                        </Card.Body>
                    </Card>
                    <Card variant="outlined">
                        <Card.Body>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '0.5rem',
                                }}
                            >
                                <strong>John D.</strong>
                                <span>⭐⭐⭐⭐</span>
                            </div>
                            <p>"Good quality, arrived quickly."</p>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        ),
    },
]

export const WithLongContent: Story = {
    render: () => (
        <Tabs items={longItems} variant="default" size="md" animated />
    ),
}
