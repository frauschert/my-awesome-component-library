import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import FloatingActionButton from './FloatingActionButton'

const meta: Meta<typeof FloatingActionButton> = {
    title: 'Components/FloatingActionButton',
    component: FloatingActionButton,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component:
                    'A floating action button (FAB) that represents the primary action on a screen. Can be circular with just an icon or extended with a label.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        icon: {
            description: 'Icon element to display',
            control: false,
        },
        label: {
            description: 'Optional text label for extended FAB',
            control: 'text',
        },
        size: {
            description: 'Size of the FAB',
            control: 'select',
            options: ['small', 'medium', 'large'],
        },
        variant: {
            description: 'Color variant',
            control: 'select',
            options: ['primary', 'secondary', 'danger'],
        },
        position: {
            description: 'Screen position when fixed',
            control: 'select',
            options: ['bottom-right', 'bottom-left', 'top-right', 'top-left'],
        },
        fixed: {
            description: 'Use fixed positioning',
            control: 'boolean',
        },
        elevated: {
            description: 'Show with elevation/shadow',
            control: 'boolean',
        },
        disabled: {
            description: 'Disable the button',
            control: 'boolean',
        },
    },
}

export default meta
type Story = StoryObj<typeof FloatingActionButton>

// Icons
const PlusIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
    </svg>
)

const EditIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
    </svg>
)

const TrashIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
    </svg>
)

const ShareIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
    </svg>
)

const ChatIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
    </svg>
)

export const Default: Story = {
    args: {
        icon: <PlusIcon />,
        'aria-label': 'Add item',
        size: 'medium',
        variant: 'primary',
    },
}

export const WithLabel: Story = {
    args: {
        icon: <PlusIcon />,
        label: 'Add Item',
        'aria-label': 'Add item',
        size: 'medium',
        variant: 'primary',
    },
}

export const Secondary: Story = {
    args: {
        icon: <EditIcon />,
        'aria-label': 'Edit',
        variant: 'secondary',
    },
}

export const Danger: Story = {
    args: {
        icon: <TrashIcon />,
        'aria-label': 'Delete',
        variant: 'danger',
    },
}

export const SmallSize: Story = {
    args: {
        icon: <PlusIcon />,
        'aria-label': 'Add',
        size: 'small',
    },
}

export const LargeSize: Story = {
    args: {
        icon: <PlusIcon />,
        'aria-label': 'Add',
        size: 'large',
    },
}

export const ExtendedSmall: Story = {
    args: {
        icon: <ShareIcon />,
        label: 'Share',
        'aria-label': 'Share content',
        size: 'small',
    },
}

export const ExtendedMedium: Story = {
    args: {
        icon: <ChatIcon />,
        label: 'New Message',
        'aria-label': 'Create new message',
        size: 'medium',
    },
}

export const ExtendedLarge: Story = {
    args: {
        icon: <PlusIcon />,
        label: 'Create Project',
        'aria-label': 'Create new project',
        size: 'large',
    },
}

export const NoElevation: Story = {
    args: {
        icon: <PlusIcon />,
        'aria-label': 'Add',
        elevated: false,
    },
}

export const Disabled: Story = {
    args: {
        icon: <PlusIcon />,
        'aria-label': 'Add',
        disabled: true,
    },
}

export const DisabledExtended: Story = {
    args: {
        icon: <PlusIcon />,
        label: 'Add Item',
        'aria-label': 'Add item',
        disabled: true,
    },
}

// Fixed positioning examples (requires wrapper for demo)
export const FixedBottomRight: Story = {
    args: {
        icon: <PlusIcon />,
        'aria-label': 'Add',
        fixed: true,
        position: 'bottom-right',
    },
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                story: 'FAB fixed to bottom-right corner. Note: In production, the FAB will be positioned relative to the viewport.',
            },
        },
    },
    decorators: [
        (Story) => (
            <div
                style={{
                    position: 'relative',
                    height: '400px',
                    border: '1px dashed #ccc',
                }}
            >
                <p style={{ padding: '1rem' }}>
                    The FAB is positioned in the bottom-right corner
                </p>
                <Story />
            </div>
        ),
    ],
}

export const FixedBottomLeft: Story = {
    args: {
        icon: <ChatIcon />,
        label: 'Chat',
        'aria-label': 'Open chat',
        fixed: true,
        position: 'bottom-left',
    },
    parameters: {
        layout: 'fullscreen',
    },
    decorators: [
        (Story) => (
            <div
                style={{
                    position: 'relative',
                    height: '400px',
                    border: '1px dashed #ccc',
                }}
            >
                <p style={{ padding: '1rem' }}>
                    Extended FAB fixed to bottom-left corner
                </p>
                <Story />
            </div>
        ),
    ],
}

export const FixedTopRight: Story = {
    args: {
        icon: <ShareIcon />,
        'aria-label': 'Share',
        fixed: true,
        position: 'top-right',
        variant: 'secondary',
    },
    parameters: {
        layout: 'fullscreen',
    },
    decorators: [
        (Story) => (
            <div
                style={{
                    position: 'relative',
                    height: '400px',
                    border: '1px dashed #ccc',
                }}
            >
                <p style={{ padding: '1rem' }}>FAB fixed to top-right corner</p>
                <Story />
            </div>
        ),
    ],
}

export const AllVariants: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <FloatingActionButton
                icon={<PlusIcon />}
                aria-label="Primary"
                variant="primary"
            />
            <FloatingActionButton
                icon={<EditIcon />}
                aria-label="Secondary"
                variant="secondary"
            />
            <FloatingActionButton
                icon={<TrashIcon />}
                aria-label="Danger"
                variant="danger"
            />
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: 'All color variants displayed together.',
            },
        },
    },
}

export const AllSizes: Story = {
    render: () => (
        <div
            style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'center',
                flexWrap: 'wrap',
            }}
        >
            <FloatingActionButton
                icon={<PlusIcon />}
                aria-label="Small"
                size="small"
            />
            <FloatingActionButton
                icon={<PlusIcon />}
                aria-label="Medium"
                size="medium"
            />
            <FloatingActionButton
                icon={<PlusIcon />}
                aria-label="Large"
                size="large"
            />
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: 'All size variants displayed together.',
            },
        },
    },
}

export const ExtendedVariants: Story = {
    render: () => (
        <div
            style={{
                display: 'flex',
                gap: '1rem',
                flexDirection: 'column',
                alignItems: 'flex-start',
            }}
        >
            <FloatingActionButton
                icon={<PlusIcon />}
                label="Add Item"
                aria-label="Add item"
                variant="primary"
            />
            <FloatingActionButton
                icon={<EditIcon />}
                label="Edit Content"
                aria-label="Edit content"
                variant="secondary"
            />
            <FloatingActionButton
                icon={<TrashIcon />}
                label="Delete All"
                aria-label="Delete all"
                variant="danger"
            />
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: 'Extended FABs with labels in all color variants.',
            },
        },
    },
}
