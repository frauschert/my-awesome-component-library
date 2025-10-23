import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import Avatar from './Avatar'
import AvatarGroup from './AvatarGroup'

const meta: Meta<typeof Avatar> = {
    title: 'Components/Avatar',
    component: Avatar,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component:
                    'Avatar component displays user profile images with fallback initials, status indicators, and various size options.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        src: {
            description: 'Image source URL',
            control: 'text',
        },
        name: {
            description: 'Name to generate initials from',
            control: 'text',
        },
        alt: {
            description: 'Alt text for the image',
            control: 'text',
        },
        initials: {
            description: 'Custom initials (overrides name)',
            control: 'text',
        },
        size: {
            description: 'Size variant',
            control: 'select',
            options: ['xs', 'sm', 'md', 'lg', 'xl'],
        },
        status: {
            description: 'Status indicator',
            control: 'select',
            options: [undefined, 'online', 'offline', 'busy', 'away'],
        },
        clickable: {
            description: 'Whether the avatar is clickable',
            control: 'boolean',
        },
    },
}

export default meta
type Story = StoryObj<typeof Avatar>

// Sample image URL
const sampleImage = 'https://i.pravatar.cc/150?img=1'

export const Default: Story = {
    args: {
        name: 'John Doe',
        size: 'md',
    },
}

export const WithImage: Story = {
    args: {
        src: sampleImage,
        alt: 'User avatar',
        name: 'Jane Smith',
        size: 'md',
    },
}

export const WithStatus: Story = {
    args: {
        src: sampleImage,
        name: 'Alice Johnson',
        status: 'online',
        size: 'md',
    },
}

export const Sizes: Story = {
    render: () => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Avatar name="Extra Small" size="xs" />
            <Avatar name="Small Size" size="sm" />
            <Avatar name="Medium Size" size="md" />
            <Avatar name="Large Size" size="lg" />
            <Avatar name="Extra Large" size="xl" />
        </div>
    ),
}

export const StatusIndicators: Story = {
    render: () => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Avatar src={sampleImage} name="Online" status="online" />
            <Avatar src={sampleImage} name="Offline" status="offline" />
            <Avatar src={sampleImage} name="Busy" status="busy" />
            <Avatar src={sampleImage} name="Away" status="away" />
        </div>
    ),
}

export const Initials: Story = {
    render: () => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Avatar name="Alice Brown" />
            <Avatar name="Bob Smith" />
            <Avatar name="Charlie Davis" />
            <Avatar name="Diana Prince" />
            <Avatar name="Eve Williams" />
        </div>
    ),
}

export const CustomInitials: Story = {
    args: {
        name: 'John Doe',
        initials: 'AB',
        size: 'lg',
    },
}

export const FallbackIcon: Story = {
    render: () => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Avatar size="xs" />
            <Avatar size="sm" />
            <Avatar size="md" />
            <Avatar size="lg" />
            <Avatar size="xl" />
        </div>
    ),
}

export const Clickable: Story = {
    args: {
        src: sampleImage,
        name: 'Clickable Avatar',
        clickable: true,
        onClick: () => alert('Avatar clicked!'),
    },
}

export const ImageLoadError: Story = {
    args: {
        src: 'https://invalid-url-that-will-fail.jpg',
        name: 'Fallback User',
        alt: 'Will fallback to initials',
    },
}

// AvatarGroup stories
export const GroupDefault: StoryObj<typeof AvatarGroup> = {
    render: () => (
        <AvatarGroup
            avatars={[
                {
                    name: 'Alice Johnson',
                    src: 'https://i.pravatar.cc/150?img=1',
                },
                { name: 'Bob Smith', src: 'https://i.pravatar.cc/150?img=2' },
                {
                    name: 'Charlie Brown',
                    src: 'https://i.pravatar.cc/150?img=3',
                },
                { name: 'Diana Prince' },
                { name: 'Eve Williams' },
            ]}
            max={5}
        />
    ),
}

export const GroupWithOverflow: StoryObj<typeof AvatarGroup> = {
    render: () => (
        <AvatarGroup
            avatars={[
                {
                    name: 'Alice Johnson',
                    src: 'https://i.pravatar.cc/150?img=1',
                },
                { name: 'Bob Smith', src: 'https://i.pravatar.cc/150?img=2' },
                {
                    name: 'Charlie Brown',
                    src: 'https://i.pravatar.cc/150?img=3',
                },
                {
                    name: 'Diana Prince',
                    src: 'https://i.pravatar.cc/150?img=4',
                },
                {
                    name: 'Eve Williams',
                    src: 'https://i.pravatar.cc/150?img=5',
                },
                {
                    name: 'Frank Miller',
                    src: 'https://i.pravatar.cc/150?img=6',
                },
                {
                    name: 'Grace Hopper',
                    src: 'https://i.pravatar.cc/150?img=7',
                },
                { name: 'Henry Ford', src: 'https://i.pravatar.cc/150?img=8' },
            ]}
            max={4}
        />
    ),
}

export const GroupSizes: StoryObj<typeof AvatarGroup> = {
    render: () => {
        const avatars = [
            { name: 'Alice Johnson' },
            { name: 'Bob Smith' },
            { name: 'Charlie Brown' },
            { name: 'Diana Prince' },
        ]

        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px',
                }}
            >
                <AvatarGroup avatars={avatars} size="xs" />
                <AvatarGroup avatars={avatars} size="sm" />
                <AvatarGroup avatars={avatars} size="md" />
                <AvatarGroup avatars={avatars} size="lg" />
                <AvatarGroup avatars={avatars} size="xl" />
            </div>
        )
    },
}

export const GroupClickableOverflow: StoryObj<typeof AvatarGroup> = {
    render: () => {
        const [clicked, setClicked] = useState(false)

        return (
            <div>
                <AvatarGroup
                    avatars={[
                        { name: 'Alice Johnson' },
                        { name: 'Bob Smith' },
                        { name: 'Charlie Brown' },
                        { name: 'Diana Prince' },
                        { name: 'Eve Williams' },
                        { name: 'Frank Miller' },
                        { name: 'Grace Hopper' },
                    ]}
                    max={3}
                    onOverflowClick={() => setClicked(!clicked)}
                />
                {clicked && (
                    <p style={{ marginTop: '16px', fontSize: '14px' }}>
                        Overflow clicked! You can show a modal with all users
                        here.
                    </p>
                )}
            </div>
        )
    },
}

export const GroupMixedContent: StoryObj<typeof AvatarGroup> = {
    render: () => (
        <AvatarGroup
            avatars={[
                { src: 'https://i.pravatar.cc/150?img=1' },
                { name: 'Bob Smith' },
                { initials: 'CD' },
                {
                    name: 'Diana Prince',
                    src: 'https://i.pravatar.cc/150?img=4',
                },
                { name: 'Eve Williams' },
            ]}
            max={5}
        />
    ),
}
