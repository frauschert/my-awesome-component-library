import React from 'react'
import { Meta } from '@storybook/react/types-6-0'
import { Story } from '@storybook/react'
import ContextMenu from './ContextMenu'

export default {
    title: 'Components/ContextMenu',
    component: ContextMenu,
} as Meta

// Create a master template for mapping args to render the Input component
const Template: Story = () => (
    <ContextMenu>
        <li>Share to..</li>
        <li>Cut</li>
        <li>Copy</li>
        <li>Paste</li>
        <hr />
        <li>Refresh</li>
        <li>Exit</li>
    </ContextMenu>
)

export const Example = Template.bind({})
