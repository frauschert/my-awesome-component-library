import React from 'react'
import { Meta } from '@storybook/react/types-6-0'
import { Story } from '@storybook/react'
import { SkeletonLine, SkeletonLineProps } from './Skeleton'

export default {
    title: 'Components/Skeleton/SkeletonLine',
    component: SkeletonLine,
} as Meta

const Template: Story<SkeletonLineProps> = (args) => {
    return <SkeletonLine {...args} />
}

export const Default = Template.bind({})
Default.parameters = {
    layout: 'padded',
}
