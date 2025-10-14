import React from 'react'
import { Meta, StoryObj } from '@storybook/react-vite'
import { action } from 'storybook/actions'
import { ContextMenuProvider } from './ContextMenuProvider'
import type { MenuEntry } from './types'

// Common story wrapper
const StoryWrapper: React.FC<{
    children: React.ReactNode
    height?: string
}> = ({ children, height = '100vh' }) => (
    <div
        style={{
            width: '100%',
            height,
            padding: '20px',
            background: '#f5f5f5',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
        }}
    >
        {children}
    </div>
)

const meta: Meta<typeof ContextMenuProvider> = {
    title: 'Components/ContextMenu',
    component: ContextMenuProvider,
    parameters: {
        docs: {
            description: {
                component:
                    'A flexible context menu component that supports nested menus, icons, shortcuts, and keyboard navigation. Right-click on any area to trigger the menu.',
            },
        },
    },
    argTypes: {
        menuEntries: {
            description: 'Array of menu entries (items, dividers, submenus)',
            control: false, // Complex object, disable control
        },
        children: {
            description: 'Content that will receive the context menu',
            control: false,
        },
    },
    render: (args) => (
        <ContextMenuProvider {...args}>
            <StoryWrapper>
                <h1>Context Menu Demo</h1>
                <p>
                    <strong>Right-click anywhere</strong> to see the context
                    menu
                </p>
                <p>
                    <strong>Left-click anywhere</strong> to close the context
                    menu
                </p>
                <p>
                    <strong>Press Escape</strong> to close with keyboard
                </p>
                <div
                    style={{
                        background: 'white',
                        padding: '40px',
                        borderRadius: '8px',
                        border: '2px dashed #ccc',
                        textAlign: 'center',
                        marginTop: '20px',
                    }}
                >
                    Context menu area - Try right-clicking here!
                </div>
            </StoryWrapper>
        </ContextMenuProvider>
    ),
}
export default meta

type Story = StoryObj<React.ComponentProps<typeof ContextMenuProvider>>

// Basic example showcasing all features
export const Default: Story = {
    name: 'Complete Example',
    parameters: {
        docs: {
            description: {
                story: 'A comprehensive example showing all context menu features including icons, shortcuts, disabled items, dividers, and nested submenus.',
            },
        },
    },
    args: {
        menuEntries: [
            {
                type: 'item',
                label: 'Cut',
                icon: <span>✂️</span>,
                shortcut: 'Ctrl+X',
                onClick: action('Cut clicked'),
            },
            {
                type: 'item',
                label: 'Copy',
                icon: <span>📋</span>,
                shortcut: 'Ctrl+C',
                onClick: action('Copy clicked'),
            },
            {
                type: 'item',
                label: 'Paste',
                icon: <span>📄</span>,
                shortcut: 'Ctrl+V',
                disabled: true,
                onClick: action('Paste clicked'),
            },
            {
                type: 'divider',
            },
            {
                type: 'item',
                label: 'Select All',
                shortcut: 'Ctrl+A',
                onClick: action('Select All clicked'),
            },
            {
                type: 'divider',
            },
            {
                type: 'submenu',
                label: 'Share',
                icon: <span>📤</span>,
                children: [
                    {
                        type: 'item',
                        label: 'Email',
                        icon: <span>📧</span>,
                        onClick: action('Email clicked'),
                    },
                    {
                        type: 'item',
                        label: 'Social Media',
                        icon: <span>📱</span>,
                        onClick: action('Social Media clicked'),
                    },
                    {
                        type: 'item',
                        label: 'Copy Link',
                        icon: <span>🔗</span>,
                        onClick: action('Copy Link clicked'),
                    },
                ],
            },
            {
                type: 'submenu',
                label: 'More Actions',
                icon: <span>⚙️</span>,
                children: [
                    {
                        type: 'item',
                        label: 'Properties',
                        onClick: action('Properties clicked'),
                    },
                    {
                        type: 'item',
                        label: 'Rename',
                        onClick: action('Rename clicked'),
                    },
                    {
                        type: 'divider',
                    },
                    {
                        type: 'submenu',
                        label: 'Advanced',
                        children: [
                            {
                                type: 'item',
                                label: 'Export',
                                onClick: action('Export clicked'),
                            },
                            {
                                type: 'item',
                                label: 'Import',
                                onClick: action('Import clicked'),
                            },
                        ],
                    },
                ],
            },
            {
                type: 'divider',
            },
            {
                type: 'item',
                label: 'Delete',
                icon: <span>🗑️</span>,
                shortcut: 'Del',
                onClick: action('Delete clicked'),
            },
        ],
    },
}

// Simple menu for basic use cases
export const Simple: Story = {
    name: 'Simple Menu',
    parameters: {
        docs: {
            description: {
                story: 'A basic context menu with just a few essential items.',
            },
        },
    },
    args: {
        menuEntries: [
            {
                type: 'item',
                label: 'Edit',
                onClick: action('Edit clicked'),
            },
            {
                type: 'item',
                label: 'Delete',
                onClick: action('Delete clicked'),
            },
        ],
    },
}

// Menu with icons and shortcuts
export const WithIconsAndShortcuts: Story = {
    name: 'Icons & Shortcuts',
    parameters: {
        docs: {
            description: {
                story: 'Context menu showcasing icons and keyboard shortcuts.',
            },
        },
    },
    args: {
        menuEntries: [
            {
                type: 'item',
                label: 'New File',
                icon: <span>📄</span>,
                shortcut: 'Ctrl+N',
                onClick: action('New File clicked'),
            },
            {
                type: 'item',
                label: 'Open',
                icon: <span>📁</span>,
                shortcut: 'Ctrl+O',
                onClick: action('Open clicked'),
            },
            {
                type: 'item',
                label: 'Save',
                icon: <span>💾</span>,
                shortcut: 'Ctrl+S',
                onClick: action('Save clicked'),
            },
            {
                type: 'divider',
            },
            {
                type: 'item',
                label: 'Exit',
                icon: <span>🚪</span>,
                shortcut: 'Alt+F4',
                onClick: action('Exit clicked'),
            },
        ],
    },
}

// Menu with disabled items
export const WithDisabledItems: Story = {
    name: 'Disabled Items',
    parameters: {
        docs: {
            description: {
                story: 'Shows how disabled menu items appear and behave.',
            },
        },
    },
    args: {
        menuEntries: [
            {
                type: 'item',
                label: 'Available Action',
                icon: <span>✅</span>,
                onClick: action('Available Action clicked'),
            },
            {
                type: 'item',
                label: 'Disabled Action',
                icon: <span>❌</span>,
                disabled: true,
                onClick: action('Disabled Action clicked'), // Won't fire
            },
            {
                type: 'item',
                label: 'Another Disabled',
                shortcut: 'Ctrl+D',
                disabled: true,
                onClick: action('Another Disabled clicked'), // Won't fire
            },
            {
                type: 'divider',
            },
            {
                type: 'item',
                label: 'Normal Item',
                onClick: action('Normal Item clicked'),
            },
        ],
    },
}

// Complex nested menu
export const NestedSubmenus: Story = {
    name: 'Nested Submenus',
    parameters: {
        docs: {
            description: {
                story: 'Demonstrates deeply nested submenus with multiple levels.',
            },
        },
    },
    args: {
        menuEntries: [
            {
                type: 'item',
                label: 'Top Level Item',
                onClick: action('Top Level clicked'),
            },
            {
                type: 'submenu',
                label: 'Level 1 Submenu',
                icon: <span>📁</span>,
                children: [
                    {
                        type: 'item',
                        label: 'Level 1 Item',
                        onClick: action('Level 1 Item clicked'),
                    },
                    {
                        type: 'submenu',
                        label: 'Level 2 Submenu',
                        children: [
                            {
                                type: 'item',
                                label: 'Level 2 Item A',
                                onClick: action('Level 2 Item A clicked'),
                            },
                            {
                                type: 'item',
                                label: 'Level 2 Item B',
                                onClick: action('Level 2 Item B clicked'),
                            },
                            {
                                type: 'submenu',
                                label: 'Level 3 Submenu',
                                children: [
                                    {
                                        type: 'item',
                                        label: 'Deep Nested Item',
                                        icon: <span>🎯</span>,
                                        onClick: action(
                                            'Deep Nested Item clicked'
                                        ),
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
}

// File manager style menu
export const FileManagerStyle: Story = {
    name: 'File Manager Style',
    parameters: {
        docs: {
            description: {
                story: 'A realistic example mimicking a file manager context menu.',
            },
        },
    },
    render: (args) => (
        <ContextMenuProvider {...args}>
            <StoryWrapper height="80vh">
                <h2>File Manager Demo</h2>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns:
                            'repeat(auto-fill, minmax(100px, 1fr))',
                        gap: '16px',
                        background: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                    }}
                >
                    {[
                        'Document.pdf',
                        'Image.jpg',
                        'Folder',
                        'Spreadsheet.xlsx',
                    ].map((name) => (
                        <div
                            key={name}
                            style={{
                                padding: '16px',
                                textAlign: 'center',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }}
                        >
                            <div
                                style={{
                                    fontSize: '24px',
                                    marginBottom: '8px',
                                }}
                            >
                                {name.includes('Folder')
                                    ? '📁'
                                    : name.includes('.pdf')
                                    ? '📄'
                                    : name.includes('.jpg')
                                    ? '🖼️'
                                    : '📊'}
                            </div>
                            <div style={{ fontSize: '12px' }}>{name}</div>
                        </div>
                    ))}
                </div>
                <p style={{ marginTop: '16px', color: '#666' }}>
                    Right-click on any file or folder above
                </p>
            </StoryWrapper>
        </ContextMenuProvider>
    ),
    args: {
        menuEntries: [
            {
                type: 'item',
                label: 'Open',
                icon: <span>📂</span>,
                onClick: action('Open clicked'),
            },
            {
                type: 'item',
                label: 'Open with...',
                icon: <span>🔧</span>,
                onClick: action('Open with clicked'),
            },
            {
                type: 'divider',
            },
            {
                type: 'item',
                label: 'Cut',
                icon: <span>✂️</span>,
                shortcut: 'Ctrl+X',
                onClick: action('Cut clicked'),
            },
            {
                type: 'item',
                label: 'Copy',
                icon: <span>📋</span>,
                shortcut: 'Ctrl+C',
                onClick: action('Copy clicked'),
            },
            {
                type: 'item',
                label: 'Paste',
                icon: <span>📄</span>,
                shortcut: 'Ctrl+V',
                disabled: true,
                onClick: action('Paste clicked'),
            },
            {
                type: 'divider',
            },
            {
                type: 'submenu',
                label: 'Send to',
                icon: <span>📤</span>,
                children: [
                    {
                        type: 'item',
                        label: 'Desktop (create shortcut)',
                        onClick: action('Send to Desktop clicked'),
                    },
                    {
                        type: 'item',
                        label: 'Mail recipient',
                        onClick: action('Send to Mail clicked'),
                    },
                    {
                        type: 'item',
                        label: 'Compressed folder',
                        onClick: action('Send to Zip clicked'),
                    },
                ],
            },
            {
                type: 'divider',
            },
            {
                type: 'item',
                label: 'Rename',
                shortcut: 'F2',
                onClick: action('Rename clicked'),
            },
            {
                type: 'item',
                label: 'Delete',
                icon: <span>🗑️</span>,
                shortcut: 'Del',
                onClick: action('Delete clicked'),
            },
            {
                type: 'divider',
            },
            {
                type: 'item',
                label: 'Properties',
                icon: <span>ℹ️</span>,
                shortcut: 'Alt+Enter',
                onClick: action('Properties clicked'),
            },
        ],
    },
}

// Minimal menu with only dividers
export const OnlyDividers: Story = {
    name: 'Edge Case: Only Dividers',
    parameters: {
        docs: {
            description: {
                story: 'Edge case showing a menu with only dividers (not recommended for real use).',
            },
        },
    },
    args: {
        menuEntries: [
            { type: 'divider' },
            { type: 'divider' },
            { type: 'divider' },
        ],
    },
}

// Empty menu
export const Empty: Story = {
    name: 'Edge Case: Empty Menu',
    parameters: {
        docs: {
            description: {
                story: 'Edge case with an empty menu array.',
            },
        },
    },
    args: {
        menuEntries: [],
    },
}
