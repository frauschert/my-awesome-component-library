import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { ColorPicker } from './ColorPicker'

const meta: Meta<typeof ColorPicker> = {
    title: 'Components/ColorPicker',
    component: ColorPicker,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ColorPicker>

const ColorPickerWrapper = (args: any) => {
    const [color, setColor] = useState(args.value || '#3b82f6')

    return (
        <div style={{ minHeight: '400px' }}>
            <ColorPicker {...args} value={color} onChange={setColor} />
            <div
                style={{
                    marginTop: '1rem',
                    padding: '0.5rem',
                    backgroundColor: 'var(--theme-bg-secondary, #f5f5f5)',
                    borderRadius: '4px',
                    color: 'var(--theme-text-primary, #000000)',
                }}
            >
                <strong>Selected:</strong> {color}
            </div>
        </div>
    )
}

export const Default: Story = {
    render: (args) => <ColorPickerWrapper {...args} />,
    args: {
        label: 'Choose a color',
    },
}

export const WithDefaultValue: Story = {
    render: (args) => <ColorPickerWrapper {...args} />,
    args: {
        label: 'Brand color',
        value: '#ef4444',
    },
}

export const WithHelperText: Story = {
    render: (args) => <ColorPickerWrapper {...args} />,
    args: {
        label: 'Theme color',
        helperText: 'Select your primary theme color',
    },
}

export const Required: Story = {
    render: (args) => <ColorPickerWrapper {...args} />,
    args: {
        label: 'Primary color',
        required: true,
    },
}

export const WithError: Story = {
    render: (args) => <ColorPickerWrapper {...args} />,
    args: {
        label: 'Color selection',
        error: 'Please select a valid color',
    },
}

export const Disabled: Story = {
    render: (args) => <ColorPickerWrapper {...args} />,
    args: {
        label: 'Disabled picker',
        value: '#8b5cf6',
        disabled: true,
    },
}

export const WithoutInput: Story = {
    render: (args) => <ColorPickerWrapper {...args} />,
    args: {
        label: 'Color (swatch only)',
        showInput: false,
    },
}

export const WithoutRecent: Story = {
    render: (args) => <ColorPickerWrapper {...args} />,
    args: {
        label: 'No recent colors',
        showRecent: false,
    },
}

export const CustomPresets: Story = {
    render: (args) => <ColorPickerWrapper {...args} />,
    args: {
        label: 'Brand colors',
        presets: [
            '#1e40af',
            '#3b82f6',
            '#60a5fa',
            '#93c5fd',
            '#dc2626',
            '#ef4444',
            '#f87171',
            '#fca5a5',
            '#059669',
            '#10b981',
            '#34d399',
            '#6ee7b7',
            '#7c3aed',
            '#8b5cf6',
            '#a78bfa',
            '#c4b5fd',
        ],
    },
}

export const SmallSize: Story = {
    render: (args) => <ColorPickerWrapper {...args} />,
    args: {
        label: 'Small color picker',
        size: 'small',
    },
}

export const LargeSize: Story = {
    render: (args) => <ColorPickerWrapper {...args} />,
    args: {
        label: 'Large color picker',
        size: 'large',
    },
}

export const MinimalPresets: Story = {
    render: (args) => <ColorPickerWrapper {...args} />,
    args: {
        label: 'Simple palette',
        presets: [
            '#000000',
            '#ffffff',
            '#3b82f6',
            '#ef4444',
            '#10b981',
            '#f59e0b',
        ],
    },
}

export const GrayscalePalette: Story = {
    render: (args) => <ColorPickerWrapper {...args} />,
    args: {
        label: 'Grayscale',
        presets: [
            '#000000',
            '#171717',
            '#262626',
            '#404040',
            '#525252',
            '#737373',
            '#a3a3a3',
            '#d4d4d4',
            '#e5e5e5',
            '#f5f5f5',
            '#fafafa',
            '#ffffff',
        ],
    },
}

export const ThemeBuilder: Story = {
    render: () => {
        const [colors, setColors] = useState({
            primary: '#3b82f6',
            secondary: '#8b5cf6',
            success: '#10b981',
            warning: '#f59e0b',
            danger: '#ef4444',
        })

        const updateColor = (key: string) => (value: string) => {
            setColors((prev) => ({ ...prev, [key]: value }))
        }

        return (
            <div style={{ maxWidth: '500px', minHeight: '600px' }}>
                <h2
                    style={{
                        marginBottom: '1.5rem',
                        color: 'var(--theme-text-primary)',
                    }}
                >
                    Theme Builder
                </h2>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                    }}
                >
                    <ColorPicker
                        label="Primary Color"
                        value={colors.primary}
                        onChange={updateColor('primary')}
                        required
                    />
                    <ColorPicker
                        label="Secondary Color"
                        value={colors.secondary}
                        onChange={updateColor('secondary')}
                        required
                    />
                    <ColorPicker
                        label="Success Color"
                        value={colors.success}
                        onChange={updateColor('success')}
                        required
                    />
                    <ColorPicker
                        label="Warning Color"
                        value={colors.warning}
                        onChange={updateColor('warning')}
                        required
                    />
                    <ColorPicker
                        label="Danger Color"
                        value={colors.danger}
                        onChange={updateColor('danger')}
                        required
                    />
                </div>
                <div
                    style={{
                        marginTop: '1.5rem',
                        padding: '1rem',
                        backgroundColor: 'var(--theme-bg-secondary, #f5f5f5)',
                        borderRadius: '4px',
                        color: 'var(--theme-text-primary, #000000)',
                    }}
                >
                    <strong>Theme Preview:</strong>
                    <div
                        style={{
                            marginTop: '1rem',
                            display: 'flex',
                            gap: '0.5rem',
                        }}
                    >
                        {Object.entries(colors).map(([key, color]) => (
                            <div
                                key={key}
                                style={{
                                    width: '3rem',
                                    height: '3rem',
                                    backgroundColor: color,
                                    borderRadius: '4px',
                                    border: '2px solid var(--theme-border-primary, #e0e0e0)',
                                }}
                                title={`${key}: ${color}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        )
    },
}
