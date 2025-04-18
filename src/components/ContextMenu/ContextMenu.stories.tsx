import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import { ContextMenuProvider } from './ContextMenuProvider'
import type { MenuEntry } from './types'

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
        ],
    },
}
