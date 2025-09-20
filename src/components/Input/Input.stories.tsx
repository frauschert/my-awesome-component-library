import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import Input from './Input'

const meta: Meta<typeof Input> = {
    title: 'Components/Input',
    component: Input,
}

export default meta

type Story = StoryObj<typeof Input>

export const NumberInput: Story = {
    args: {
        type: 'number',
        initialValue: 0,
        label: 'Amount',
        helperText: 'Enter a number',
    },
}

export const TextInput: Story = {
    args: {
        type: 'text',
        initialValue: 'Test',
        label: 'Your name',
    },
}

export const WithError: Story = {
    args: {
        type: 'text',
        initialValue: '',
        label: 'Email',
        errorText: 'Please enter a valid email',
        invalid: true,
    },
}

export const Sizes: Story = {
    render: () => (
        <div style={{ display: 'grid', gap: 12, maxWidth: 360 }}>
            <Input
                type="text"
                sizeVariant="sm"
                label="Small"
                initialValue=""
                onChange={() => {}}
            />
            <Input
                type="text"
                sizeVariant="md"
                label="Medium"
                initialValue=""
                onChange={() => {}}
            />
            <Input
                type="text"
                sizeVariant="lg"
                label="Large"
                initialValue=""
                onChange={() => {}}
            />
        </div>
    ),
}
