import React from 'react'
import { Meta } from '@storybook/react/types-6-0'
import { Story } from '@storybook/react'
import DropdownMenu from './DropdownMenu'

export default {
    title: 'Components/DropdownMenu',
    component: DropdownMenu,
} as Meta

// Create a master template for mapping args to render the Input component
const Template: Story = (args) => <DropdownMenu {...args} />

export const Default = Template.bind({})
