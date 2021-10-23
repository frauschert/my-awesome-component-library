import React from 'react'
import { Meta } from '@storybook/react/types-6-0'
import { Story } from '@storybook/react'
import { SkeletonImage } from './Skeleton'

export default {
    title: 'Components/Skeleton/SkeletonImage',
    component: SkeletonImage,
} as Meta

const Template: Story = (args) => <SkeletonImage {...args} />

export const Default = Template.bind({})
Default.parameters = {
    layout: 'centered',
}
