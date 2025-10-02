import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import DropdownMenu from './DropdownMenu'

const meta: Meta<typeof DropdownMenu> = {
    title: 'Components/DropdownMenu',
    component: DropdownMenu,
    tags: ['autodocs'],
    args: {
        items: [
            { id: 1, label: 'Option 1', value: 'option1' },
            { id: 2, label: 'Option 2', value: 'option2' },
            { id: 3, label: 'Option 3', value: 'option3', disabled: true },
            { id: 4, label: 'Option 4', value: 'option4' },
        ],
        trigger: 'Select an option',
    },
}

export default meta
type Story = StoryObj<typeof DropdownMenu>

export const Default: Story = {
    args: {},
}

export const WithSearch: Story = {
    args: {
        searchable: true,
        searchPlaceholder: 'Type to search...',
    },
}

export const MultiSelect: Story = {
    args: {
        multiple: true,
        closeOnSelect: false,
        trigger: 'Select multiple options',
    },
}

export const WithIcons: Story = {
    args: {
        items: [
            { id: 1, label: 'Edit', value: 'edit', icon: '✏️' },
            { id: 2, label: 'Copy', value: 'copy', icon: '📋' },
            {
                id: 3,
                label: 'Delete',
                value: 'delete',
                icon: '🗑️',
                disabled: true,
            },
            { id: 4, label: 'Share', value: 'share', icon: '🔗' },
        ],
        trigger: 'Actions',
    },
}

export const Variants: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '1rem' }}>
            <DropdownMenu
                items={meta.args?.items || []}
                trigger="Default"
                variant="default"
            />
            <DropdownMenu
                items={meta.args?.items || []}
                trigger="Primary"
                variant="primary"
            />
            <DropdownMenu
                items={meta.args?.items || []}
                trigger="Secondary"
                variant="secondary"
            />
        </div>
    ),
}

export const Sizes: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <DropdownMenu
                items={meta.args?.items || []}
                trigger="Small"
                size="small"
            />
            <DropdownMenu
                items={meta.args?.items || []}
                trigger="Medium"
                size="medium"
            />
            <DropdownMenu
                items={meta.args?.items || []}
                trigger="Large"
                size="large"
            />
        </div>
    ),
}

export const Controlled: Story = {
    args: {
        value: 'option1',
        onChange: (value) => console.log('Selected:', value),
        onOpenChange: (isOpen) => console.log('Open state:', isOpen),
    },
}

export const OnDarkBackground: Story = {
    render: () => (
        <div style={{ background: '#222', padding: 40, minHeight: 200 }}>
            <DropdownMenu items={meta.args?.items || []} trigger="Dark Theme" />
        </div>
    ),
}

export const CustomRendering: Story = {
    args: {
        items: [
            {
                id: 1,
                label: 'User Profile',
                value: 'profile',
                icon: '👤',
                children: [
                    {
                        id: 'edit',
                        label: 'Edit Profile',
                        value: 'edit_profile',
                    },
                    { id: 'settings', label: 'Settings', value: 'settings' },
                ],
            },
            {
                id: 2,
                label: 'Messages',
                value: 'messages',
                icon: '💬',
            },
            {
                id: 3,
                label: 'Logout',
                value: 'logout',
                icon: '🚪',
            },
        ],
        renderItem: (item) => (
            <div
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
                <span style={{ fontSize: '1.2em' }}>{item.icon}</span>
                <div>
                    <div style={{ fontWeight: 500 }}>{item.label}</div>
                    {item.children && (
                        <div
                            style={{
                                fontSize: '0.875em',
                                color: 'var(--text-muted)',
                            }}
                        >
                            {item.children.length} subitems
                        </div>
                    )}
                </div>
            </div>
        ),
        trigger: 'Custom Rendering',
    },
}
