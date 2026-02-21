import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import PasswordInput from './PasswordInput'

const meta: Meta<typeof PasswordInput> = {
    title: 'Components/PasswordInput',
    component: PasswordInput,
    decorators: [
        (Story) => (
            <div style={{ padding: '2rem', maxWidth: 360 }}>
                <Story />
            </div>
        ),
    ],
    args: {
        label: 'Password',
        sizeVariant: 'md',
        disabled: false,
        showStrengthMeter: false,
    },
}

export default meta
type Story = StoryObj<typeof PasswordInput>

export const Default: Story = {}

export const WithStrengthMeter: Story = {
    args: {
        label: 'Create a password',
        showStrengthMeter: true,
        helperText: 'Use at least 8 characters, one uppercase, one number.',
    },
    render: (args) => {
        const [value, setValue] = React.useState('')
        return (
            <PasswordInput
                {...args}
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
        )
    },
}

export const WithError: Story = {
    args: {
        label: 'Password',
        defaultValue: 'short',
        errorText: 'Password must be at least 8 characters.',
    },
}

export const WithHelperText: Story = {
    args: {
        label: 'New Password',
        helperText: 'Must be at least 8 characters.',
    },
}

export const Disabled: Story = {
    args: {
        label: 'Password',
        defaultValue: 'secret',
        disabled: true,
    },
}

export const Small: Story = {
    args: { label: 'Password', sizeVariant: 'sm' },
}

export const Large: Story = {
    args: { label: 'Password', sizeVariant: 'lg' },
}
