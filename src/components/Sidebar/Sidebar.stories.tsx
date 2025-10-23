import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import Sidebar, { SidebarItem } from './Sidebar'

const meta: Meta<typeof Sidebar> = {
    title: 'Components/Sidebar',
    component: Sidebar,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Sidebar>

const basicItems: SidebarItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', href: '#dashboard' },
    {
        id: 'projects',
        label: 'Projects',
        icon: '📁',
        badge: 5,
        href: '#projects',
    },
    { id: 'tasks', label: 'Tasks', icon: '✓', badge: 12, href: '#tasks' },
    { id: 'calendar', label: 'Calendar', icon: '📅', href: '#calendar' },
    { id: 'reports', label: 'Reports', icon: '📈', href: '#reports' },
]

const nestedItems: SidebarItem[] = [
    { id: 'home', label: 'Home', icon: '🏠' },
    {
        id: 'products',
        label: 'Products',
        icon: '📦',
        children: [
            { id: 'all-products', label: 'All Products', badge: 150 },
            { id: 'categories', label: 'Categories' },
            { id: 'inventory', label: 'Inventory' },
        ],
    },
    {
        id: 'customers',
        label: 'Customers',
        icon: '👥',
        children: [
            { id: 'all-customers', label: 'All Customers' },
            { id: 'segments', label: 'Segments' },
        ],
    },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
]

const complexItems: SidebarItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'divider-1', label: '', divider: true },
    {
        id: 'workspace',
        label: 'Workspace',
        icon: '💼',
        children: [
            { id: 'projects', label: 'Projects', badge: 8 },
            { id: 'team', label: 'Team Members' },
            { id: 'files', label: 'Files', badge: 23 },
        ],
    },
    {
        id: 'communication',
        label: 'Communication',
        icon: '💬',
        children: [
            { id: 'messages', label: 'Messages', badge: 'New' },
            { id: 'notifications', label: 'Notifications', badge: 5 },
        ],
    },
    { id: 'divider-2', label: '', divider: true },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'help', label: 'Help & Support', icon: '❓' },
    { id: 'disabled', label: 'Disabled Item', icon: '🚫', disabled: true },
]

const SidebarWrapper: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => (
    <div
        style={{
            display: 'flex',
            height: '600px',
            border: '1px solid #e5e7eb',
        }}
    >
        {children}
        <div style={{ flex: 1, padding: '20px', backgroundColor: '#f9fafb' }}>
            <h2>Main Content</h2>
            <p>
                This is the main content area. The sidebar navigation is on the
                left.
            </p>
        </div>
    </div>
)

export const Default: Story = {
    render: () => (
        <SidebarWrapper>
            <Sidebar items={basicItems} defaultSelectedId="dashboard" />
        </SidebarWrapper>
    ),
}

export const Collapsed: Story = {
    render: () => (
        <SidebarWrapper>
            <Sidebar
                items={basicItems}
                defaultCollapsed
                defaultSelectedId="projects"
            />
        </SidebarWrapper>
    ),
}

export const WithNestedItems: Story = {
    render: () => (
        <SidebarWrapper>
            <Sidebar
                items={nestedItems}
                defaultSelectedId="home"
                defaultExpandedIds={['products']}
            />
        </SidebarWrapper>
    ),
}

export const ComplexNavigation: Story = {
    render: () => (
        <SidebarWrapper>
            <Sidebar
                items={complexItems}
                defaultSelectedId="dashboard"
                defaultExpandedIds={['workspace']}
            />
        </SidebarWrapper>
    ),
}

export const FloatingVariant: Story = {
    render: () => (
        <SidebarWrapper>
            <Sidebar
                items={basicItems}
                variant="floating"
                defaultSelectedId="tasks"
            />
        </SidebarWrapper>
    ),
}

export const BorderedVariant: Story = {
    render: () => (
        <SidebarWrapper>
            <Sidebar
                items={basicItems}
                variant="bordered"
                defaultSelectedId="calendar"
            />
        </SidebarWrapper>
    ),
}

export const RightPosition: Story = {
    render: () => (
        <div
            style={{
                display: 'flex',
                height: '600px',
                border: '1px solid #e5e7eb',
            }}
        >
            <div
                style={{ flex: 1, padding: '20px', backgroundColor: '#f9fafb' }}
            >
                <h2>Main Content</h2>
                <p>
                    This is the main content area. The sidebar navigation is on
                    the right.
                </p>
            </div>
            <Sidebar
                items={basicItems}
                position="right"
                defaultSelectedId="reports"
            />
        </div>
    ),
}

export const NarrowWidth: Story = {
    render: () => (
        <SidebarWrapper>
            <Sidebar
                items={basicItems}
                width="narrow"
                defaultSelectedId="dashboard"
            />
        </SidebarWrapper>
    ),
}

export const WideWidth: Story = {
    render: () => (
        <SidebarWrapper>
            <Sidebar
                items={basicItems}
                width="wide"
                defaultSelectedId="projects"
            />
        </SidebarWrapper>
    ),
}

export const WithHeaderAndFooter: Story = {
    render: () => (
        <SidebarWrapper>
            <Sidebar
                items={basicItems}
                defaultSelectedId="dashboard"
                header={
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                        }}
                    >
                        <div
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '8px',
                                backgroundColor: '#3b82f6',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 'bold',
                            }}
                        >
                            AC
                        </div>
                        <div>
                            <div style={{ fontWeight: 600, fontSize: '14px' }}>
                                Acme Corp
                            </div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                Pro Plan
                            </div>
                        </div>
                    </div>
                }
                footer={
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                        }}
                    >
                        <div
                            style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                backgroundColor: '#e5e7eb',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            👤
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 600, fontSize: '13px' }}>
                                John Doe
                            </div>
                            <div
                                style={{
                                    fontSize: '11px',
                                    color: '#6b7280',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                john@example.com
                            </div>
                        </div>
                    </div>
                }
            />
        </SidebarWrapper>
    ),
}

export const NoCollapseButton: Story = {
    render: () => (
        <SidebarWrapper>
            <Sidebar
                items={basicItems}
                showCollapseButton={false}
                defaultSelectedId="tasks"
            />
        </SidebarWrapper>
    ),
}

export const CustomIcons: Story = {
    render: () => (
        <SidebarWrapper>
            <Sidebar
                items={basicItems}
                defaultSelectedId="dashboard"
                collapseIcon={<span style={{ fontSize: '16px' }}>◀</span>}
                expandIcon={<span style={{ fontSize: '16px' }}>▶</span>}
            />
        </SidebarWrapper>
    ),
}

export const Interactive: Story = {
    render: () => {
        const [selectedId, setSelectedId] = useState('dashboard')
        const [collapsed, setCollapsed] = useState(false)
        const [expandedIds, setExpandedIds] = useState<string[]>(['products'])

        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                }}
            >
                <div
                    style={{
                        padding: '20px',
                        backgroundColor: '#f9fafb',
                        borderRadius: '8px',
                    }}
                >
                    <h3>Controls</h3>
                    <div
                        style={{
                            display: 'flex',
                            gap: '10px',
                            marginTop: '10px',
                        }}
                    >
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '6px',
                                border: '1px solid #d1d5db',
                                backgroundColor: 'white',
                                cursor: 'pointer',
                            }}
                        >
                            {collapsed ? 'Expand' : 'Collapse'} Sidebar
                        </button>
                        <button
                            onClick={() => setSelectedId('tasks')}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '6px',
                                border: '1px solid #d1d5db',
                                backgroundColor: 'white',
                                cursor: 'pointer',
                            }}
                        >
                            Select Tasks
                        </button>
                    </div>
                    <div
                        style={{
                            marginTop: '10px',
                            fontSize: '14px',
                            color: '#6b7280',
                        }}
                    >
                        Selected: <strong>{selectedId}</strong>
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        Expanded:{' '}
                        <strong>{expandedIds.join(', ') || 'none'}</strong>
                    </div>
                </div>

                <SidebarWrapper>
                    <Sidebar
                        items={nestedItems}
                        selectedId={selectedId}
                        onSelect={setSelectedId}
                        collapsed={collapsed}
                        onCollapsedChange={setCollapsed}
                        expandedIds={expandedIds}
                        onExpandedChange={setExpandedIds}
                    />
                </SidebarWrapper>
            </div>
        )
    },
}

export const CustomRenderer: Story = {
    render: () => (
        <SidebarWrapper>
            <Sidebar
                items={basicItems}
                defaultSelectedId="dashboard"
                renderItem={(item, isSelected) => (
                    <div
                        style={{
                            padding: '12px 16px',
                            backgroundColor: isSelected
                                ? '#dbeafe'
                                : 'transparent',
                            borderLeft: isSelected
                                ? '3px solid #3b82f6'
                                : 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            cursor: 'pointer',
                        }}
                    >
                        <span style={{ fontSize: '20px' }}>{item.icon}</span>
                        <span style={{ fontWeight: isSelected ? 600 : 400 }}>
                            {item.label}
                        </span>
                        {item.badge && (
                            <span
                                style={{
                                    marginLeft: 'auto',
                                    backgroundColor: '#ef4444',
                                    color: 'white',
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                }}
                            >
                                {item.badge}
                            </span>
                        )}
                    </div>
                )}
            />
        </SidebarWrapper>
    ),
}
