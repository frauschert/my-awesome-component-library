import React, { ComponentProps } from 'react'
import { Meta } from '@storybook/react/types-6-0'
import { Story } from '@storybook/react'
import ProgressCircular from './ProgressCircular'

export default {
    title: 'Components/ProgressCircular',
    component: ProgressCircular,
} as Meta

// Create a master template for mapping args to render the Input component
const Template: Story<ComponentProps<typeof ProgressCircular>> = (args) => {
    return <ProgressCircular {...args} />
}

export const Default = Template.bind({})
