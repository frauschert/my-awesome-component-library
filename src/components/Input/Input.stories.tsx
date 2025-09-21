import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import Input from './Input'
import { TextField, NumberField } from './'

const meta: Meta<typeof Input> = {
    title: 'Components/Input',
    component: Input,
}

export default meta

type Story = StoryObj<typeof Input>

export const NumberInput: Story = {
    args: {},
    render: (args) => (
        <NumberField
            label="Amount"
            helperText="Enter a number"
            defaultValue={0}
        />
    ),
}

export const TextInput: Story = {
    args: {
        // TextField wrapper usage
    },
    render: () => <TextField label="Your name" defaultValue="Test" />,
}

export const WithError: Story = {
    args: {
        // TextField wrapper usage
    },
    render: () => (
        <TextField
            label="Email"
            errorText="Please enter a valid email"
            invalid
            defaultValue=""
        />
    ),
}

export const Sizes: Story = {
    render: () => (
        <div style={{ display: 'grid', gap: 12, maxWidth: 360 }}>
            <TextField sizeVariant="sm" label="Small" defaultValue="" />
            <TextField sizeVariant="md" label="Medium" defaultValue="" />
            <TextField sizeVariant="lg" label="Large" defaultValue="" />
        </div>
    ),
}

export const WithAdornments: Story = {
    render: () => (
        <div style={{ display: 'grid', gap: 12, maxWidth: 360 }}>
            <TextField
                label="Search"
                startAdornment={
                    <span role="img" aria-label="search">
                        🔍
                    </span>
                }
                defaultValue=""
            />
            <TextField
                label="Amount"
                endAdornment={<span>EUR</span>}
                defaultValue=""
            />
        </div>
    ),
}

export const Clearable: Story = {
    render: () => <TextField label="Username" clearable defaultValue="john" />,
}

export const NumberStepping: Story = {
    render: () => <NumberField label="Qty" defaultValue={1} min={0} step={1} />,
}
