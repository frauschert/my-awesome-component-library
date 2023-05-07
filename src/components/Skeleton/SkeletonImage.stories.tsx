import { StoryObj, Meta } from '@storybook/react'
import { SkeletonImage } from './Skeleton'

const meta: Meta<typeof SkeletonImage> = {
    title: 'Components/Skeleton/SkeletonImage',
    component: SkeletonImage,
}

export default meta

type Story = StoryObj<typeof SkeletonImage>

export const Template: Story = {}
