import type { StoryObj, Meta } from '@storybook/react-vite'
import { Skeleton, SkeletonImage } from './Skeleton'
import React from 'react'

const meta: Meta<typeof Skeleton> = {
    title: 'Components/Skeleton',
    component: Skeleton,
    argTypes: {
        variant: {
            control: 'select',
            options: ['text', 'circular', 'rectangular'],
        },
        width: { control: 'text' },
        height: { control: 'text' },
        borderRadius: { control: 'text' },
        animate: { control: 'boolean' },
    },
}

export default meta

type Story = StoryObj<typeof Skeleton>

export const Text: Story = {
    args: {
        variant: 'text',
        width: 200,
        height: 20,
    },
}

export const Circular: Story = {
    args: {
        variant: 'circular',
        width: 40,
        height: 40,
    },
}

export const Rectangular: Story = {
    args: {
        variant: 'rectangular',
        width: 200,
        height: 200,
        borderRadius: 8,
    },
}

export const NoAnimation: Story = {
    args: {
        variant: 'rectangular',
        width: 200,
        height: 100,
        animate: false,
    },
}

export const CustomSizes: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="75%" />
            <Skeleton variant="text" width="50%" />
            <Skeleton variant="text" width="25%" />
        </div>
    ),
}

export const UserCard: Story = {
    render: () => (
        <div
            style={{
                display: 'flex',
                gap: '1rem',
                padding: '1rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                maxWidth: '400px',
            }}
        >
            <Skeleton variant="circular" width={60} height={60} />
            <div style={{ flex: 1 }}>
                <Skeleton variant="text" width="60%" height={20} />
                <Skeleton variant="text" width="80%" height={16} />
                <Skeleton variant="text" width="40%" height={16} />
            </div>
        </div>
    ),
}

export const CompoundAPI: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Skeleton.Text width={200} height={20} />
            <Skeleton.Circle width={50} height={50} />
            <Skeleton.Rectangle width="100%" height={150} />
        </div>
    ),
}

export const LegacySkeletonImage: Story = {
    render: () => <SkeletonImage width={200} height={200} borderRadius={8} />,
    name: 'Legacy SkeletonImage (Deprecated)',
}
