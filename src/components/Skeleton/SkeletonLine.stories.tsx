import React from 'react'
import { Meta, Story } from '@storybook/react'
import { SkeletonLine, SkeletonLineProps } from './Skeleton'

export default {
    title: 'Components/Skeleton/SkeletonLine (Deprecated)',
    component: SkeletonLine,
} as Meta

const Template: Story<SkeletonLineProps> = (args) => {
    return <SkeletonLine {...args} />
}

export const Short = Template.bind({})
Short.args = {
    size: 'short',
}

export const Medium = Template.bind({})
Medium.args = {
    size: 'medium',
}

export const Large = Template.bind({})
Large.args = {
    size: 'large',
}

export const CustomWidth = Template.bind({})
CustomWidth.args = {
    width: 300,
    height: 24,
}
