import React from 'react'
import { Meta } from '@storybook/react/types-6-0'
import { Story } from '@storybook/react'
import ContextMenu from './ContextMenu'

export default {
    title: 'Components/ContextMenu',
    component: ContextMenu,
} as Meta

// Create a master template for mapping args to render the Input component
const Template: Story = (args) => (
    <ContextMenu>
        <>
            <div>Create</div>
            <div>Download</div>
        </>
    </ContextMenu>
)

export const Example = Template.bind({})
