import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import { ContextMenuProvider } from './ContextMenuProvider'

const meta: Meta<typeof ContextMenuProvider> = {
    title: 'Components/ContextMenu',
    component: ContextMenuProvider,
    render: (args) => (
        <ContextMenuProvider {...args}>
            <div style={{ width: '100%', height: '100vh' }}>
                <h1>Context Menu</h1>
                <p>Right click to see the context menu</p>
                <p>Click anywhere to close the context menu</p>
            </div>
        </ContextMenuProvider>
    ),
}
export default meta

type Story = StoryObj<React.ComponentProps<typeof ContextMenuProvider>>

export const Story: Story = {
    args: {
        menuEntries: [
            {
                type: 'item',
                label: 'Share to..',
                onClick: () => console.log('Share to..'),
            },
            {
                type: 'item',
                label: 'Copy',
                disabled: true,
                shortcut: 'Ctrl + C',
                onClick: () => console.log('Copy'),
            },
            {
                type: 'item',
                label: 'Paste',
                icon: <span>📋</span>,
                shortcut: 'Ctrl + V',
                onClick: () => console.log('Paste'),
            },
            {
                type: 'divider',
            },
            {
                type: 'item',
                label: 'Settings',
                icon: <span>⚙️</span>,
                onClick: () => console.log('Settings'),
            },
            {
                type: 'submenu',
                label: 'More',
                icon: <span>➡️</span>,
                children: [
                    {
                        type: 'item',
                        label: 'Item 1',
                        onClick: () => console.log('Item 1'),
                    },
                    {
                        type: 'item',
                        label: 'Item 2',
                        onClick: () => console.log('Item 2'),
                    },
                    {
                        type: 'divider',
                    },
                    {
                        type: 'item',
                        label: 'Item 3',
                        onClick: () => console.log('Item 3'),
                    },
                    {
                        type: 'submenu',
                        label: 'Item 4',
                        children: [
                            {
                                type: 'item',
                                label: 'Item 4.1',
                                onClick: () => console.log('Item 4.1'),
                            },
                            {
                                type: 'item',
                                label: 'Item 4.2',
                                onClick: () => console.log('Item 4.2'),
                            },
                        ],
                    },
                ],
            },
        ],
    },
}
