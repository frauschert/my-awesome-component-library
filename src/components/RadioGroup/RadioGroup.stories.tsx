import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { RadioGroup, RadioOption } from './RadioGroup'

const meta: Meta<typeof RadioGroup> = {
    title: 'Components/RadioGroup',
    component: RadioGroup,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof RadioGroup>

const basicOptions: RadioOption[] = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
]

const optionsWithDescriptions: RadioOption[] = [
    {
        value: 'basic',
        label: 'Basic Plan',
        description: 'Perfect for individuals and small projects',
    },
    {
        value: 'pro',
        label: 'Pro Plan',
        description: 'For growing teams with advanced needs',
    },
    {
        value: 'enterprise',
        label: 'Enterprise Plan',
        description: 'Unlimited everything with priority support',
    },
]

const RadioGroupWrapper = (args: any) => {
    const [value, setValue] = useState(args.value || '')

    return <RadioGroup {...args} value={value} onChange={setValue} />
}

export const Default: Story = {
    render: (args) => <RadioGroupWrapper {...args} />,
    args: {
        name: 'default',
        label: 'Choose an option',
        options: basicOptions,
    },
}

export const WithDescriptions: Story = {
    render: (args) => <RadioGroupWrapper {...args} />,
    args: {
        name: 'plans',
        label: 'Select your plan',
        options: optionsWithDescriptions,
    },
}

export const HorizontalLayout: Story = {
    render: (args) => <RadioGroupWrapper {...args} />,
    args: {
        name: 'horizontal',
        label: 'Choose a size',
        orientation: 'horizontal',
        options: [
            { value: 'small', label: 'Small' },
            { value: 'medium', label: 'Medium' },
            { value: 'large', label: 'Large' },
        ],
    },
}

export const WithHelperText: Story = {
    render: (args) => <RadioGroupWrapper {...args} />,
    args: {
        name: 'helper',
        label: 'Notification preference',
        helperText: 'Choose how you want to receive notifications',
        options: [
            { value: 'email', label: 'Email' },
            { value: 'sms', label: 'SMS' },
            { value: 'push', label: 'Push notifications' },
        ],
    },
}

export const WithError: Story = {
    render: (args) => <RadioGroupWrapper {...args} />,
    args: {
        name: 'error',
        label: 'Payment method',
        error: 'Please select a payment method',
        required: true,
        options: [
            { value: 'credit', label: 'Credit Card' },
            { value: 'paypal', label: 'PayPal' },
            { value: 'bank', label: 'Bank Transfer' },
        ],
    },
}

export const Required: Story = {
    render: (args) => <RadioGroupWrapper {...args} />,
    args: {
        name: 'required',
        label: 'Gender',
        required: true,
        options: [
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' },
            { value: 'prefer-not', label: 'Prefer not to say' },
        ],
    },
}

export const DisabledGroup: Story = {
    render: (args) => <RadioGroupWrapper {...args} />,
    args: {
        name: 'disabled-group',
        label: 'Disabled options',
        disabled: true,
        value: 'option2',
        options: basicOptions,
    },
}

export const WithDisabledOptions: Story = {
    render: (args) => <RadioGroupWrapper {...args} />,
    args: {
        name: 'disabled-options',
        label: 'Shipping method',
        options: [
            {
                value: 'standard',
                label: 'Standard (5-7 days)',
                description: 'Free shipping',
            },
            {
                value: 'express',
                label: 'Express (2-3 days)',
                description: '$10.00',
                disabled: true,
            },
            {
                value: 'overnight',
                label: 'Overnight',
                description: 'Currently unavailable',
                disabled: true,
            },
        ],
    },
}

export const SmallSize: Story = {
    render: (args) => <RadioGroupWrapper {...args} />,
    args: {
        name: 'small',
        label: 'Small radio buttons',
        size: 'small',
        options: basicOptions,
    },
}

export const LargeSize: Story = {
    render: (args) => <RadioGroupWrapper {...args} />,
    args: {
        name: 'large',
        label: 'Large radio buttons',
        size: 'large',
        options: optionsWithDescriptions,
    },
}

export const Preselected: Story = {
    render: (args) => <RadioGroupWrapper {...args} />,
    args: {
        name: 'preselected',
        label: 'Choose a color',
        value: 'blue',
        options: [
            { value: 'red', label: 'Red' },
            { value: 'blue', label: 'Blue' },
            { value: 'green', label: 'Green' },
        ],
    },
}

export const ManyOptions: Story = {
    render: (args) => <RadioGroupWrapper {...args} />,
    args: {
        name: 'many',
        label: 'Select a country',
        options: [
            { value: 'us', label: 'United States' },
            { value: 'uk', label: 'United Kingdom' },
            { value: 'ca', label: 'Canada' },
            { value: 'au', label: 'Australia' },
            { value: 'de', label: 'Germany' },
            { value: 'fr', label: 'France' },
            { value: 'jp', label: 'Japan' },
            { value: 'cn', label: 'China' },
        ],
    },
}

export const FormExample: Story = {
    render: () => {
        const [formData, setFormData] = useState({
            plan: '',
            billing: '',
            notifications: '',
        })

        const updateField = (field: string) => (value: string) => {
            setFormData((prev) => ({ ...prev, [field]: value }))
        }

        return (
            <div style={{ maxWidth: '500px' }}>
                <h2
                    style={{
                        marginBottom: '1.5rem',
                        color: 'var(--theme-text-primary)',
                    }}
                >
                    Account Settings
                </h2>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem',
                    }}
                >
                    <RadioGroup
                        name="plan"
                        label="Subscription Plan"
                        value={formData.plan}
                        onChange={updateField('plan')}
                        required
                        options={[
                            {
                                value: 'free',
                                label: 'Free',
                                description: '$0/month - Basic features',
                            },
                            {
                                value: 'pro',
                                label: 'Pro',
                                description: '$9/month - All features',
                            },
                            {
                                value: 'team',
                                label: 'Team',
                                description: '$29/month - Unlimited users',
                            },
                        ]}
                    />
                    <RadioGroup
                        name="billing"
                        label="Billing Cycle"
                        value={formData.billing}
                        onChange={updateField('billing')}
                        orientation="horizontal"
                        options={[
                            { value: 'monthly', label: 'Monthly' },
                            { value: 'yearly', label: 'Yearly (Save 20%)' },
                        ]}
                    />
                    <RadioGroup
                        name="notifications"
                        label="Email Notifications"
                        value={formData.notifications}
                        onChange={updateField('notifications')}
                        helperText="Choose your notification preferences"
                        options={[
                            { value: 'all', label: 'All notifications' },
                            { value: 'important', label: 'Important only' },
                            { value: 'none', label: 'None' },
                        ]}
                    />
                </div>
                <div
                    style={{
                        marginTop: '1.5rem',
                        padding: '1rem',
                        backgroundColor: 'var(--theme-bg-secondary, #f5f5f5)',
                        borderRadius: '4px',
                    }}
                >
                    <strong>Selected values:</strong>
                    <pre style={{ marginTop: '0.5rem' }}>
                        {JSON.stringify(formData, null, 2)}
                    </pre>
                </div>
            </div>
        )
    },
}
