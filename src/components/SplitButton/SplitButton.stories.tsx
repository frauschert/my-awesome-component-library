import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import SplitButton from './SplitButton'
import type { SplitButtonAction } from './SplitButton'

const meta: Meta<typeof SplitButton> = {
    title: 'Components/SplitButton',
    component: SplitButton,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component:
                    'A split button combines a primary action button with a dropdown menu of additional related actions.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        label: {
            description: 'Primary button label',
            control: 'text',
        },
        variant: {
            description: 'Visual style variant',
            control: 'select',
            options: ['primary', 'secondary', 'danger'],
        },
        size: {
            description: 'Button size',
            control: 'select',
            options: ['small', 'medium', 'large'],
        },
        disabled: {
            description: 'Disabled state',
            control: 'boolean',
        },
        loading: {
            description: 'Loading state',
            control: 'boolean',
        },
    },
}

export default meta
type Story = StoryObj<typeof SplitButton>

const defaultActions: SplitButtonAction[] = [
    {
        label: 'Save as Draft',
        onClick: () => console.log('Save as draft'),
    },
    {
        label: 'Save as Template',
        onClick: () => console.log('Save as template'),
    },
    {
        label: 'Save and Close',
        onClick: () => console.log('Save and close'),
    },
]

export const Default: Story = {
    args: {
        label: 'Save',
        onClick: () => console.log('Save clicked'),
        actions: defaultActions,
        variant: 'primary',
        size: 'medium',
    },
}

export const Secondary: Story = {
    args: {
        label: 'Export',
        onClick: () => console.log('Export clicked'),
        actions: [
            {
                label: 'Export as PDF',
                onClick: () => console.log('Export as PDF'),
            },
            {
                label: 'Export as CSV',
                onClick: () => console.log('Export as CSV'),
            },
            {
                label: 'Export as Excel',
                onClick: () => console.log('Export as Excel'),
            },
        ],
        variant: 'secondary',
        size: 'medium',
    },
}

export const Danger: Story = {
    args: {
        label: 'Delete',
        onClick: () => console.log('Delete clicked'),
        actions: [
            {
                label: 'Delete Permanently',
                onClick: () => console.log('Delete permanently'),
            },
            {
                label: 'Delete and Archive',
                onClick: () => console.log('Delete and archive'),
            },
        ],
        variant: 'danger',
        size: 'medium',
    },
}

export const Small: Story = {
    args: {
        label: 'Send',
        onClick: () => console.log('Send clicked'),
        actions: [
            {
                label: 'Send Now',
                onClick: () => console.log('Send now'),
            },
            {
                label: 'Schedule Send',
                onClick: () => console.log('Schedule send'),
            },
            {
                label: 'Send Test',
                onClick: () => console.log('Send test'),
            },
        ],
        size: 'small',
    },
}

export const Large: Story = {
    args: {
        label: 'Publish',
        onClick: () => console.log('Publish clicked'),
        actions: [
            {
                label: 'Publish Now',
                onClick: () => console.log('Publish now'),
            },
            {
                label: 'Schedule Publish',
                onClick: () => console.log('Schedule publish'),
            },
            {
                label: 'Publish Draft',
                onClick: () => console.log('Publish draft'),
            },
        ],
        size: 'large',
    },
}

export const WithIcons: Story = {
    args: {
        label: 'Share',
        onClick: () => console.log('Share clicked'),
        leftIcon: (
            <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
        ),
        actions: [
            {
                label: 'Share via Email',
                onClick: () => console.log('Share via email'),
                icon: (
                    <svg viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                ),
            },
            {
                label: 'Share via Link',
                onClick: () => console.log('Share via link'),
                icon: (
                    <svg viewBox="0 0 20 20" fill="currentColor">
                        <path
                            fillRule="evenodd"
                            d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                            clipRule="evenodd"
                        />
                    </svg>
                ),
            },
            {
                label: 'Share on Social',
                onClick: () => console.log('Share on social'),
                icon: (
                    <svg viewBox="0 0 20 20" fill="currentColor">
                        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                    </svg>
                ),
            },
        ],
        size: 'medium',
    },
}

export const WithDividers: Story = {
    args: {
        label: 'File',
        onClick: () => console.log('File clicked'),
        actions: [
            {
                label: 'New',
                onClick: () => console.log('New'),
            },
            {
                label: 'Open',
                onClick: () => console.log('Open'),
            },
            {
                label: '',
                onClick: () => {},
                divider: true,
            },
            {
                label: 'Save',
                onClick: () => console.log('Save'),
            },
            {
                label: 'Save As',
                onClick: () => console.log('Save as'),
            },
            {
                label: '',
                onClick: () => {},
                divider: true,
            },
            {
                label: 'Close',
                onClick: () => console.log('Close'),
            },
        ],
        variant: 'secondary',
        size: 'medium',
    },
}

export const WithDisabledActions: Story = {
    args: {
        label: 'Actions',
        onClick: () => console.log('Actions clicked'),
        actions: [
            {
                label: 'Available Action',
                onClick: () => console.log('Available action'),
            },
            {
                label: 'Disabled Action',
                onClick: () => console.log('This should not fire'),
                disabled: true,
            },
            {
                label: 'Another Available',
                onClick: () => console.log('Another available'),
            },
        ],
        size: 'medium',
    },
}

export const Disabled: Story = {
    args: {
        label: 'Save',
        onClick: () => console.log('Save clicked'),
        actions: defaultActions,
        disabled: true,
        size: 'medium',
    },
}

export const Loading: Story = {
    args: {
        label: 'Processing',
        onClick: () => console.log('Processing clicked'),
        actions: defaultActions,
        loading: true,
        size: 'medium',
    },
}

export const AllVariants: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
            <SplitButton
                label="Primary"
                onClick={() => console.log('Primary')}
                actions={defaultActions}
                variant="primary"
            />
            <SplitButton
                label="Secondary"
                onClick={() => console.log('Secondary')}
                actions={defaultActions}
                variant="secondary"
            />
            <SplitButton
                label="Danger"
                onClick={() => console.log('Danger')}
                actions={defaultActions}
                variant="danger"
            />
        </div>
    ),
}

export const AllSizes: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <SplitButton
                label="Small"
                onClick={() => console.log('Small')}
                actions={defaultActions}
                size="small"
            />
            <SplitButton
                label="Medium"
                onClick={() => console.log('Medium')}
                actions={defaultActions}
                size="medium"
            />
            <SplitButton
                label="Large"
                onClick={() => console.log('Large')}
                actions={defaultActions}
                size="large"
            />
        </div>
    ),
}
