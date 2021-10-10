import React from 'react'
import { Meta } from '@storybook/react/types-6-0'
import { Story } from '@storybook/react'
import Skeleton from './Skeleton'

export default {
    title: 'Components/Skeleton',
    component: Skeleton,
} as Meta

// Create a master template for mapping args to render the Input component
const Template: Story = (args) => <Skeleton {...args} />

export const Default = Template.bind({})
