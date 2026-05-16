import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import NavBar, { NavBarItem } from './NavBar'
import Button from '../Button'

const meta: Meta<typeof NavBar> = {
    title: 'Components/NavBar',
    component: NavBar,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof NavBar>

// Sample navigation items
const basicItems: NavBarItem[] = [
    { id: 'home', label: 'Home', href: '#home' },
    { id: 'about', label: 'About', href: '#about' },
    { id: 'services', label: 'Services', href: '#services' },
    { id: 'contact', label: 'Contact', href: '#contact' },
]

const itemsWithIcons: NavBarItem[] = [
    {
        id: 'home',
        label: 'Home',
        href: '#home',
        icon: (
            <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
        ),
    },
    {
        id: 'dashboard',
        label: 'Dashboard',
        href: '#dashboard',
        icon: (
            <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
            </svg>
        ),
    },
    {
        id: 'messages',
        label: 'Messages',
        href: '#messages',
        icon: (
            <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
        ),
        badge: 3,
    },
    {
        id: 'settings',
        label: 'Settings',
        href: '#settings',
        icon: (
            <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v6m0 6v6m5.2-13.2l-4.2 4.2m-6 6l-4.2 4.2M23 12h-6m-6 0H1m18.2 5.2l-4.2-4.2m-6-6l-4.2-4.2" />
            </svg>
        ),
    },
]

const itemsWithDropdown: NavBarItem[] = [
    { id: 'home', label: 'Home', href: '#home' },
    {
        id: 'products',
        label: 'Products',
        items: [
            { id: 'product-1', label: 'Widgets', href: '#widgets' },
            { id: 'product-2', label: 'Gadgets', href: '#gadgets' },
            { id: 'product-3', label: 'Tools', href: '#tools' },
        ],
    },
    {
        id: 'company',
        label: 'Company',
        items: [
            { id: 'about', label: 'About Us', href: '#about' },
            { id: 'team', label: 'Team', href: '#team' },
            { id: 'careers', label: 'Careers', href: '#careers', badge: 'New' },
        ],
    },
    { id: 'contact', label: 'Contact', href: '#contact' },
]

// Stories
export const Default: Story = {
    args: {
        brand: <strong>MyApp</strong>,
        items: basicItems,
        activeId: 'home',
    },
}

export const WithIcons: Story = {
    args: {
        brand: (
            <div
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
                <span
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '32px',
                        height: '32px',
                        borderRadius: '6px',
                        background: 'var(--theme-primary)',
                        color: 'white',
                        fontWeight: 'bold',
                    }}
                >
                    M
                </span>
                <strong>MyApp</strong>
            </div>
        ),
        items: itemsWithIcons,
        activeId: 'home',
    },
}

export const WithDropdowns: Story = {
    args: {
        brand: <strong>MyCompany</strong>,
        items: itemsWithDropdown,
        activeId: 'home',
    },
}

export const WithActions: Story = {
    args: {
        brand: <strong>MyApp</strong>,
        items: basicItems,
        activeId: 'home',
        actions: (
            <>
                <Button variant="secondary" size="small">
                    Sign In
                </Button>
                <Button variant="primary" size="small">
                    Sign Up
                </Button>
            </>
        ),
    },
}

export const Elevated: Story = {
    args: {
        brand: <strong>MyApp</strong>,
        items: basicItems,
        activeId: 'home',
        variant: 'elevated',
    },
}

export const Bordered: Story = {
    args: {
        brand: <strong>MyApp</strong>,
        items: basicItems,
        activeId: 'home',
        variant: 'bordered',
    },
}

export const Sticky: Story = {
    render: () => (
        <div>
            <NavBar
                brand={<strong>Sticky NavBar</strong>}
                items={basicItems}
                activeId="home"
                position="sticky"
                variant="elevated"
            />
            <div style={{ padding: '2rem' }}>
                <h1 style={{ color: 'var(--theme-text-primary)' }}>
                    Scroll down to see sticky behavior
                </h1>
                {Array.from({ length: 30 }).map((_, i) => (
                    <p
                        key={i}
                        style={{
                            color: 'var(--theme-text-secondary)',
                            marginBottom: '1rem',
                        }}
                    >
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua.
                    </p>
                ))}
            </div>
        </div>
    ),
}

export const WithBadges: Story = {
    args: {
        brand: <strong>Dashboard</strong>,
        items: [
            { id: 'home', label: 'Home', href: '#home' },
            {
                id: 'notifications',
                label: 'Notifications',
                href: '#notifications',
                badge: 12,
            },
            { id: 'messages', label: 'Messages', href: '#messages', badge: 3 },
            { id: 'updates', label: 'Updates', href: '#updates', badge: 'New' },
        ],
        activeId: 'home',
    },
}

export const WithDisabledItems: Story = {
    args: {
        brand: <strong>MyApp</strong>,
        items: [
            { id: 'home', label: 'Home', href: '#home' },
            { id: 'about', label: 'About', href: '#about' },
            {
                id: 'coming-soon',
                label: 'Coming Soon',
                href: '#coming-soon',
                disabled: true,
            },
            { id: 'contact', label: 'Contact', href: '#contact' },
        ],
        activeId: 'home',
    },
}

export const Interactive: Story = {
    render: () => {
        const [activeId, setActiveId] = useState('home')

        const items: NavBarItem[] = [
            {
                id: 'home',
                label: 'Home',
                onClick: () => setActiveId('home'),
            },
            {
                id: 'products',
                label: 'Products',
                onClick: () => setActiveId('products'),
            },
            {
                id: 'about',
                label: 'About',
                onClick: () => setActiveId('about'),
            },
            {
                id: 'contact',
                label: 'Contact',
                onClick: () => setActiveId('contact'),
            },
        ]

        return (
            <div>
                <NavBar
                    brand={<strong>Interactive NavBar</strong>}
                    items={items}
                    activeId={activeId}
                />
                <div style={{ padding: '2rem' }}>
                    <h2 style={{ color: 'var(--theme-text-primary)' }}>
                        Active Page: {activeId}
                    </h2>
                    <p style={{ color: 'var(--theme-text-secondary)' }}>
                        Click on navigation items to see the active state
                        change.
                    </p>
                </div>
            </div>
        )
    },
}

export const ResponsiveDemo: Story = {
    args: {
        brand: (
            <div
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
                <span
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'var(--theme-primary)',
                        color: 'white',
                        fontWeight: 'bold',
                    }}
                >
                    R
                </span>
                <strong>Responsive</strong>
            </div>
        ),
        items: itemsWithIcons,
        activeId: 'home',
        actions: (
            <>
                <Button variant="secondary" size="small">
                    Login
                </Button>
            </>
        ),
        variant: 'elevated',
    },
}

export const FullExample: Story = {
    render: () => {
        const [activeId, setActiveId] = useState('dashboard')

        const fullItems: NavBarItem[] = [
            {
                id: 'dashboard',
                label: 'Dashboard',
                icon: '📊',
                onClick: () => setActiveId('dashboard'),
            },
            {
                id: 'projects',
                label: 'Projects',
                icon: '📁',
                items: [
                    {
                        id: 'all-projects',
                        label: 'All Projects',
                        onClick: () => setActiveId('all-projects'),
                    },
                    {
                        id: 'my-projects',
                        label: 'My Projects',
                        onClick: () => setActiveId('my-projects'),
                    },
                    {
                        id: 'shared',
                        label: 'Shared with me',
                        onClick: () => setActiveId('shared'),
                    },
                ],
            },
            {
                id: 'team',
                label: 'Team',
                icon: '👥',
                onClick: () => setActiveId('team'),
            },
            {
                id: 'messages',
                label: 'Messages',
                icon: '💬',
                badge: 5,
                onClick: () => setActiveId('messages'),
            },
            {
                id: 'settings',
                label: 'Settings',
                icon: '⚙️',
                onClick: () => setActiveId('settings'),
            },
        ]

        return (
            <div>
                <NavBar
                    brand={
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                            }}
                        >
                            <div
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '8px',
                                    background:
                                        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontWeight: 'bold',
                                }}
                            >
                                A
                            </div>
                            <strong>Acme Inc</strong>
                        </div>
                    }
                    items={fullItems}
                    activeId={activeId}
                    variant="elevated"
                    position="sticky"
                    actions={
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                            }}
                        >
                            <button
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '1.25rem',
                                    position: 'relative',
                                }}
                                title="Notifications"
                            >
                                🔔
                                <span
                                    style={{
                                        position: 'absolute',
                                        top: '-4px',
                                        right: '-4px',
                                        width: '8px',
                                        height: '8px',
                                        background: 'var(--theme-danger)',
                                        borderRadius: '50%',
                                    }}
                                />
                            </button>
                            <div
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    background: 'var(--theme-primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                }}
                                title="User Profile"
                            >
                                JD
                            </div>
                        </div>
                    }
                />
                <div style={{ padding: '2rem' }}>
                    <h1 style={{ color: 'var(--theme-text-primary)' }}>
                        {activeId.charAt(0).toUpperCase() + activeId.slice(1)}{' '}
                        Page
                    </h1>
                    <p style={{ color: 'var(--theme-text-secondary)' }}>
                        This is a full-featured navigation example with icons,
                        dropdowns, badges, and user actions.
                    </p>
                </div>
            </div>
        )
    },
}
