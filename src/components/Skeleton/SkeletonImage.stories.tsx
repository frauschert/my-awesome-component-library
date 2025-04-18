import type { StoryObj, Meta } from '@storybook/react'
import { SkeletonImage } from './Skeleton'
import React from 'react'

const meta: Meta<typeof SkeletonImage> = {
    title: 'Components/Skeleton/SkeletonImage',
    component: SkeletonImage,
}

export default meta

type Story = StoryObj<typeof SkeletonImage>

export const Template: Story = {
    render: () => <SkeletonImage />,
    args: {
        width: 200,
        height: 200,
        borderRadius: 8,
        animate: true,
    },
    name: 'Default',
}
