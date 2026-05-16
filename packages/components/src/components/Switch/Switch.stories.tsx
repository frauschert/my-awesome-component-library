import React, { useState } from 'react'
import { Meta, StoryObj } from '@storybook/react'
import Switch from './Switch'

export default {
    title: 'Components/Switch',
    component: Switch,
    argTypes: {
        size: {
            control: 'select',
            options: ['small', 'medium', 'large'],
        },
        labelPosition: {
            control: 'select',
            options: ['left', 'right'],
        },
    },
} as Meta<typeof Switch>

type Story = StoryObj<typeof Switch>

export const Default: Story = {
    args: {
        checked: false,
        disabled: false,
        size: 'medium',
    },
    render: (args) => {
        const [checked, setChecked] = useState(args.checked || false)
        return (
            <Switch
                {...args}
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
            />
        )
    },
}

export const WithLabel: Story = {
    args: {
        label: 'Enable notifications',
        checked: false,
        size: 'medium',
    },
    render: (args) => {
        const [checked, setChecked] = useState(args.checked || false)
        return (
            <Switch
                {...args}
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
            />
        )
    },
}

export const LabelLeft: Story = {
    args: {
        label: 'Dark mode',
        labelPosition: 'left',
        checked: false,
        size: 'medium',
    },
    render: (args) => {
        const [checked, setChecked] = useState(args.checked || false)
        return (
            <Switch
                {...args}
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
            />
        )
    },
}

export const Sizes: Story = {
    render: () => {
        const [small, setSmall] = useState(false)
        const [medium, setMedium] = useState(true)
        const [large, setLarge] = useState(false)

        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem',
                }}
            >
                <Switch
                    size="small"
                    label="Small"
                    checked={small}
                    onChange={(e) => setSmall(e.target.checked)}
                />
                <Switch
                    size="medium"
                    label="Medium (default)"
                    checked={medium}
                    onChange={(e) => setMedium(e.target.checked)}
                />
                <Switch
                    size="large"
                    label="Large"
                    checked={large}
                    onChange={(e) => setLarge(e.target.checked)}
                />
            </div>
        )
    },
}

export const Disabled: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Switch
                label="Disabled (unchecked)"
                disabled={false}
                checked={false}
            />
            <Switch label="Disabled (checked)" disabled={true} checked={true} />
        </div>
    ),
}

export const ControlledExample: Story = {
    render: () => {
        const [settings, setSettings] = useState({
            notifications: true,
            darkMode: false,
            autoSave: true,
            soundEffects: false,
        })

        const handleChange =
            (key: keyof typeof settings) =>
            (e: { target: { checked: boolean } }) => {
                setSettings((prev) => ({ ...prev, [key]: e.target.checked }))
            }

        return (
            <div style={{ padding: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Settings</h3>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        maxWidth: '300px',
                    }}
                >
                    <Switch
                        label="Enable notifications"
                        checked={settings.notifications}
                        onChange={handleChange('notifications')}
                    />
                    <Switch
                        label="Dark mode"
                        checked={settings.darkMode}
                        onChange={handleChange('darkMode')}
                    />
                    <Switch
                        label="Auto-save"
                        checked={settings.autoSave}
                        onChange={handleChange('autoSave')}
                    />
                    <Switch
                        label="Sound effects"
                        checked={settings.soundEffects}
                        onChange={handleChange('soundEffects')}
                    />
                </div>
                <div
                    style={{
                        marginTop: '2rem',
                        padding: '1rem',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '4px',
                    }}
                >
                    <strong>Current Settings:</strong>
                    <pre style={{ marginTop: '0.5rem' }}>
                        {JSON.stringify(settings, null, 2)}
                    </pre>
                </div>
            </div>
        )
    },
}

export const FormIntegration: Story = {
    render: () => {
        const [formData, setFormData] = useState({
            terms: false,
            newsletter: false,
            privacy: false,
        })

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault()
            alert(`Form submitted:\n${JSON.stringify(formData, null, 2)}`)
        }

        return (
            <form
                onSubmit={handleSubmit}
                style={{ padding: '2rem', maxWidth: '400px' }}
            >
                <h3 style={{ marginBottom: '1.5rem' }}>Sign Up</h3>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                    }}
                >
                    <Switch
                        name="terms"
                        label="I agree to the terms and conditions"
                        required
                        checked={formData.terms}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                terms: e.target.checked,
                            }))
                        }
                    />
                    <Switch
                        name="newsletter"
                        label="Subscribe to newsletter"
                        checked={formData.newsletter}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                newsletter: e.target.checked,
                            }))
                        }
                    />
                    <Switch
                        name="privacy"
                        label="I have read the privacy policy"
                        required
                        checked={formData.privacy}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                privacy: e.target.checked,
                            }))
                        }
                    />
                </div>
                <button
                    type="submit"
                    style={{
                        marginTop: '1.5rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                >
                    Submit
                </button>
            </form>
        )
    },
}

export const AllStates: Story = {
    render: () => (
        <div style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>All Switch States</h3>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem',
                }}
            >
                <div>
                    <h4
                        style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}
                    >
                        Unchecked
                    </h4>
                    <Switch
                        label="Unchecked switch"
                        checked={false}
                        onChange={() => {}}
                    />
                </div>
                <div>
                    <h4
                        style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}
                    >
                        Checked
                    </h4>
                    <Switch
                        label="Checked switch"
                        checked={true}
                        onChange={() => {}}
                    />
                </div>
                <div>
                    <h4
                        style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}
                    >
                        Disabled (unchecked)
                    </h4>
                    <Switch
                        label="Disabled unchecked"
                        disabled
                        checked={false}
                        onChange={() => {}}
                    />
                </div>
                <div>
                    <h4
                        style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}
                    >
                        Disabled (checked)
                    </h4>
                    <Switch
                        label="Disabled checked"
                        disabled
                        checked={true}
                        onChange={() => {}}
                    />
                </div>
            </div>
        </div>
    ),
}
