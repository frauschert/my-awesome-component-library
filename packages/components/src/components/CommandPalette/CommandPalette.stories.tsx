import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import CommandPalette from './CommandPalette'
import Button from '../Button'

const meta: Meta<typeof CommandPalette> = {
    title: 'Components/CommandPalette',
    component: CommandPalette,
    parameters: { layout: 'fullscreen' },
}

export default meta

const commands = [
    {
        id: '1',
        title: 'Open Settings',
        description: 'Open the settings panel',
        icon: '⚙️',
        shortcut: 'Ctrl+,',
        group: 'Navigation',
    },
    {
        id: '2',
        title: 'New File',
        description: 'Create a new file',
        icon: '📄',
        shortcut: 'Ctrl+N',
        group: 'File',
    },
    {
        id: '3',
        title: 'Open File',
        description: 'Open an existing file',
        icon: '📂',
        shortcut: 'Ctrl+O',
        group: 'File',
    },
    {
        id: '4',
        title: 'Toggle Sidebar',
        description: 'Show or hide the sidebar',
        icon: '🔲',
        shortcut: 'Ctrl+B',
        group: 'View',
    },
    {
        id: '5',
        title: 'Search in Project',
        description: 'Search across project files',
        icon: '🔍',
        shortcut: 'Ctrl+Shift+F',
        group: 'Navigation',
    },
]

type Story = StoryObj<typeof CommandPalette>

export const Default: Story = {
    render: () => {
        const [open, setOpen] = useState(false)
        return (
            <div style={{ padding: 80 }}>
                <div style={{ marginBottom: 12 }}>
                    <Button onClick={() => setOpen(true)}>
                        Open Command Palette
                    </Button>
                </div>
                <CommandPalette
                    commands={commands}
                    open={open}
                    onOpenChange={setOpen}
                    shortcut="Ctrl+K"
                />
            </div>
        )
    },
}

export const KeyboardOnly: Story = {
    render: () => (
        <CommandPalette commands={commands} defaultOpen shortcut="Ctrl+K" />
    ),
}

export const Grouped: Story = {
    render: () => (
        <CommandPalette
            commands={commands.map((c) => ({ ...c, group: c.group || 'Misc' }))}
            defaultOpen
        />
    ),
}

export const WithCustomIcons: Story = {
    render: () => {
        const customCommands = [
            {
                id: '1',
                title: 'Copy',
                description: 'Copy to clipboard',
                shortcut: 'Ctrl+C',
                icon: (
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                    >
                        <path d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V2Z" />
                        <path d="M2 6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1H6a3 3 0 0 1-3-3V6H2Z" />
                    </svg>
                ),
                group: 'Edit',
            },
            {
                id: '2',
                title: 'Paste',
                description: 'Paste from clipboard',
                shortcut: 'Ctrl+V',
                icon: (
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                    >
                        <path d="M4.5 3a2.5 2.5 0 0 1 5 0v.5h1V3a3.5 3.5 0 1 0-7 0v.5h1V3Z" />
                        <path d="M3 4.5a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6.5a2 2 0 0 0-2-2H3Z" />
                    </svg>
                ),
                group: 'Edit',
            },
            {
                id: '3',
                title: 'Save',
                description: 'Save current file',
                shortcut: 'Ctrl+S',
                icon: (
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                    >
                        <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2Z" />
                    </svg>
                ),
                group: 'File',
            },
        ]
        return <CommandPalette commands={customCommands} defaultOpen />
    },
}

export const ManyCommands: Story = {
    render: () => {
        const manyCommands = [
            // File operations
            {
                id: 'f1',
                title: 'New File',
                description: 'Create a new file',
                icon: '📄',
                shortcut: 'Ctrl+N',
                group: 'File',
            },
            {
                id: 'f2',
                title: 'Open File',
                description: 'Open an existing file',
                icon: '📂',
                shortcut: 'Ctrl+O',
                group: 'File',
            },
            {
                id: 'f3',
                title: 'Save',
                description: 'Save current file',
                icon: '💾',
                shortcut: 'Ctrl+S',
                group: 'File',
            },
            {
                id: 'f4',
                title: 'Save As',
                description: 'Save with new name',
                icon: '💾',
                shortcut: 'Ctrl+Shift+S',
                group: 'File',
            },
            {
                id: 'f5',
                title: 'Save All',
                description: 'Save all open files',
                icon: '💾',
                group: 'File',
            },
            {
                id: 'f6',
                title: 'Close File',
                description: 'Close current file',
                icon: '✖️',
                shortcut: 'Ctrl+W',
                group: 'File',
            },
            {
                id: 'f7',
                title: 'Close All',
                description: 'Close all files',
                icon: '✖️',
                group: 'File',
            },
            {
                id: 'f8',
                title: 'Reopen Closed File',
                description: 'Reopen recently closed',
                icon: '🔄',
                shortcut: 'Ctrl+Shift+T',
                group: 'File',
            },
            // Edit operations
            {
                id: 'e1',
                title: 'Undo',
                description: 'Undo last action',
                icon: '↶',
                shortcut: 'Ctrl+Z',
                group: 'Edit',
            },
            {
                id: 'e2',
                title: 'Redo',
                description: 'Redo last action',
                icon: '↷',
                shortcut: 'Ctrl+Y',
                group: 'Edit',
            },
            {
                id: 'e3',
                title: 'Cut',
                description: 'Cut selection',
                icon: '✂️',
                shortcut: 'Ctrl+X',
                group: 'Edit',
            },
            {
                id: 'e4',
                title: 'Copy',
                description: 'Copy selection',
                icon: '📋',
                shortcut: 'Ctrl+C',
                group: 'Edit',
            },
            {
                id: 'e5',
                title: 'Paste',
                description: 'Paste from clipboard',
                icon: '📋',
                shortcut: 'Ctrl+V',
                group: 'Edit',
            },
            {
                id: 'e6',
                title: 'Select All',
                description: 'Select entire document',
                icon: '⬚',
                shortcut: 'Ctrl+A',
                group: 'Edit',
            },
            {
                id: 'e7',
                title: 'Find',
                description: 'Find in file',
                icon: '🔍',
                shortcut: 'Ctrl+F',
                group: 'Edit',
            },
            {
                id: 'e8',
                title: 'Replace',
                description: 'Find and replace',
                icon: '🔄',
                shortcut: 'Ctrl+H',
                group: 'Edit',
            },
            // View operations
            {
                id: 'v1',
                title: 'Toggle Sidebar',
                description: 'Show/hide sidebar',
                icon: '📑',
                shortcut: 'Ctrl+B',
                group: 'View',
            },
            {
                id: 'v2',
                title: 'Toggle Panel',
                description: 'Show/hide bottom panel',
                icon: '▭',
                shortcut: 'Ctrl+J',
                group: 'View',
            },
            {
                id: 'v3',
                title: 'Toggle Terminal',
                description: 'Show/hide terminal',
                icon: '⌨️',
                shortcut: 'Ctrl+`',
                group: 'View',
            },
            {
                id: 'v4',
                title: 'Zoom In',
                description: 'Increase zoom level',
                icon: '🔍',
                shortcut: 'Ctrl+=',
                group: 'View',
            },
            {
                id: 'v5',
                title: 'Zoom Out',
                description: 'Decrease zoom level',
                icon: '🔍',
                shortcut: 'Ctrl+-',
                group: 'View',
            },
            {
                id: 'v6',
                title: 'Reset Zoom',
                description: 'Reset to 100%',
                icon: '🔍',
                shortcut: 'Ctrl+0',
                group: 'View',
            },
            {
                id: 'v7',
                title: 'Full Screen',
                description: 'Toggle full screen',
                icon: '⛶',
                shortcut: 'F11',
                group: 'View',
            },
            {
                id: 'v8',
                title: 'Split Editor',
                description: 'Split into columns',
                icon: '⬌',
                shortcut: 'Ctrl+\\',
                group: 'View',
            },
            // Navigation
            {
                id: 'n1',
                title: 'Go to File',
                description: 'Quick file navigation',
                icon: '📄',
                shortcut: 'Ctrl+P',
                group: 'Navigation',
            },
            {
                id: 'n2',
                title: 'Go to Line',
                description: 'Jump to line number',
                icon: '#️⃣',
                shortcut: 'Ctrl+G',
                group: 'Navigation',
            },
            {
                id: 'n3',
                title: 'Go to Symbol',
                description: 'Navigate to symbol',
                icon: '@',
                shortcut: 'Ctrl+Shift+O',
                group: 'Navigation',
            },
            {
                id: 'n4',
                title: 'Go Back',
                description: 'Navigate backwards',
                icon: '←',
                shortcut: 'Alt+Left',
                group: 'Navigation',
            },
            {
                id: 'n5',
                title: 'Go Forward',
                description: 'Navigate forwards',
                icon: '→',
                shortcut: 'Alt+Right',
                group: 'Navigation',
            },
            {
                id: 'n6',
                title: 'Next Error',
                description: 'Jump to next error',
                icon: '⚠️',
                shortcut: 'F8',
                group: 'Navigation',
            },
            {
                id: 'n7',
                title: 'Previous Error',
                description: 'Jump to previous error',
                icon: '⚠️',
                shortcut: 'Shift+F8',
                group: 'Navigation',
            },
            // Git operations
            {
                id: 'g1',
                title: 'Git Commit',
                description: 'Commit changes',
                icon: '✓',
                shortcut: 'Ctrl+Enter',
                group: 'Git',
            },
            {
                id: 'g2',
                title: 'Git Push',
                description: 'Push to remote',
                icon: '↑',
                group: 'Git',
            },
            {
                id: 'g3',
                title: 'Git Pull',
                description: 'Pull from remote',
                icon: '↓',
                group: 'Git',
            },
            {
                id: 'g4',
                title: 'Git Sync',
                description: 'Sync with remote',
                icon: '⟳',
                group: 'Git',
            },
            {
                id: 'g5',
                title: 'Git Checkout',
                description: 'Switch branch',
                icon: '⎇',
                group: 'Git',
            },
        ]
        return (
            <CommandPalette
                commands={manyCommands}
                defaultOpen
                maxResults={50}
                placeholder="Try arrow keys to see scrolling..."
            />
        )
    },
}

export const EmptyState: Story = {
    render: () => {
        return (
            <CommandPalette
                commands={commands}
                defaultOpen
                placeholder="Type 'xyz' to see empty state..."
                emptyStateMessage="No matching commands"
            />
        )
    },
}

export const RecentCommands: Story = {
    render: () => {
        return (
            <div>
                <p style={{ marginBottom: '16px', color: '#666' }}>
                    Click on commands to execute them. Recently used commands
                    will appear at the top with a "Recent" badge when you reopen
                    the palette.
                </p>
                <CommandPalette
                    commands={commands}
                    defaultOpen
                    showRecentCommands={true}
                    maxRecentCommands={5}
                    placeholder="Execute commands to see them as recent..."
                />
            </div>
        )
    },
}
