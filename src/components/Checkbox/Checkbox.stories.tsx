import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import Checkbox from './Checkbox'
import ThemeProvider from '../Theme/ThemeProvider'
import ThemeSwitcher from '../Theme/ThemeSwitcher'

const meta: Meta<typeof Checkbox> = {
    title: 'Components/Checkbox',
    component: Checkbox,
    decorators: [
        (Story) => (
            <ThemeProvider>
                <Story />
                <ThemeSwitcher />
            </ThemeProvider>
        ),
    ],
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Checkbox>

export const Default: Story = {
    args: {
        label: 'Accept terms and conditions',
    },
}

export const Checked: Story = {
    args: {
        label: 'I agree',
        defaultChecked: true,
    },
}

export const Unchecked: Story = {
    args: {
        label: 'Subscribe to newsletter',
        defaultChecked: false,
    },
}

export const Indeterminate: Story = {
    args: {
        label: 'Select all',
        indeterminate: true,
    },
}

export const WithoutLabel: Story = {
    args: {},
}

export const Required: Story = {
    args: {
        label: 'I agree to the privacy policy',
        required: true,
    },
}

export const Disabled: Story = {
    args: {
        label: 'This option is disabled',
        disabled: true,
    },
}

export const DisabledChecked: Story = {
    args: {
        label: 'Pre-selected and disabled',
        disabled: true,
        defaultChecked: true,
    },
}

export const WithError: Story = {
    args: {
        label: 'Accept terms',
        error: true,
        helperText: 'You must accept the terms to continue',
    },
}

export const WithHelperText: Story = {
    args: {
        label: 'Enable notifications',
        helperText: 'You will receive email notifications about updates',
    },
}

export const SmallSize: Story = {
    args: {
        label: 'Small checkbox',
        size: 'sm',
    },
}

export const MediumSize: Story = {
    args: {
        label: 'Medium checkbox',
        size: 'md',
    },
}

export const LargeSize: Story = {
    args: {
        label: 'Large checkbox',
        size: 'lg',
    },
}

export const Controlled: Story = {
    render: () => {
        const [checked, setChecked] = useState(false)
        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                }}
            >
                <Checkbox
                    label="Controlled checkbox"
                    checked={checked}
                    onChange={(e) => setChecked(e.target.checked)}
                />
                <button onClick={() => setChecked(!checked)}>
                    Toggle (Currently: {checked ? 'Checked' : 'Unchecked'})
                </button>
            </div>
        )
    },
}

export const IndeterminateControlled: Story = {
    render: () => {
        const [checkedItems, setCheckedItems] = useState([false, false, false])

        const allChecked = checkedItems.every(Boolean)
        const someChecked = checkedItems.some(Boolean) && !allChecked

        const handleParentChange = () => {
            setCheckedItems(
                allChecked ? [false, false, false] : [true, true, true]
            )
        }

        const handleChildChange = (index: number) => {
            const newItems = [...checkedItems]
            newItems[index] = !newItems[index]
            setCheckedItems(newItems)
        }

        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                }}
            >
                <Checkbox
                    label="Select all"
                    checked={allChecked}
                    indeterminate={someChecked}
                    onChange={handleParentChange}
                />
                <div
                    style={{
                        marginLeft: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                    }}
                >
                    <Checkbox
                        label="Option 1"
                        checked={checkedItems[0]}
                        onChange={() => handleChildChange(0)}
                    />
                    <Checkbox
                        label="Option 2"
                        checked={checkedItems[1]}
                        onChange={() => handleChildChange(1)}
                    />
                    <Checkbox
                        label="Option 3"
                        checked={checkedItems[2]}
                        onChange={() => handleChildChange(2)}
                    />
                </div>
            </div>
        )
    },
}

export const MultipleCheckboxes: Story = {
    render: () => (
        <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
        >
            <Checkbox label="JavaScript" defaultChecked />
            <Checkbox label="TypeScript" defaultChecked />
            <Checkbox label="Python" />
            <Checkbox label="Rust" />
            <Checkbox label="Go" />
        </div>
    ),
}

export const InlineLayout: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Checkbox label="Option 1" />
            <Checkbox label="Option 2" />
            <Checkbox label="Option 3" />
            <Checkbox label="Option 4" />
        </div>
    ),
}

export const FormIntegration: Story = {
    render: () => {
        const [formData, setFormData] = useState({
            terms: false,
            newsletter: false,
            updates: false,
        })

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault()
            alert(JSON.stringify(formData, null, 2))
        }

        return (
            <form
                onSubmit={handleSubmit}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    minWidth: '300px',
                }}
            >
                <h3 style={{ margin: 0 }}>Sign Up Form</h3>
                <Checkbox
                    name="terms"
                    label="I accept the terms and conditions"
                    required
                    checked={formData.terms}
                    onChange={(e) =>
                        setFormData({ ...formData, terms: e.target.checked })
                    }
                    error={!formData.terms}
                    helperText={!formData.terms ? 'Required' : ''}
                />
                <Checkbox
                    name="newsletter"
                    label="Subscribe to newsletter"
                    checked={formData.newsletter}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            newsletter: e.target.checked,
                        })
                    }
                    helperText="Get weekly updates in your inbox"
                />
                <Checkbox
                    name="updates"
                    label="Receive product updates"
                    checked={formData.updates}
                    onChange={(e) =>
                        setFormData({ ...formData, updates: e.target.checked })
                    }
                />
                <button type="submit">Submit</button>
            </form>
        )
    },
}

export const AllSizes: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Checkbox label="Small size" size="sm" defaultChecked />
            <Checkbox label="Medium size (default)" size="md" defaultChecked />
            <Checkbox label="Large size" size="lg" defaultChecked />
        </div>
    ),
}

export const AllStates: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Checkbox label="Unchecked" />
            <Checkbox label="Checked" defaultChecked />
            <Checkbox label="Indeterminate" indeterminate />
            <Checkbox label="Disabled unchecked" disabled />
            <Checkbox label="Disabled checked" disabled defaultChecked />
            <Checkbox
                label="Error state"
                error
                helperText="This field is required"
            />
            <Checkbox
                label="With helper text"
                helperText="Additional information"
            />
        </div>
    ),
}
