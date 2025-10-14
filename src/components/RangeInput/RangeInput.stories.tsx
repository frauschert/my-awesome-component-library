import React, { useState } from 'react'
import { StoryObj, Meta } from '@storybook/react'
import RangeInput from './RangeInput'

const meta: Meta<typeof RangeInput> = {
    title: 'Components/RangeInput',
    component: RangeInput,
    argTypes: {
        min: { control: { type: 'number' } },
        max: { control: { type: 'number' } },
        step: { control: { type: 'number' } },
        variant: {
            control: { type: 'select' },
            options: ['primary', 'secondary', 'success', 'error', 'warning'],
        },
        size: {
            control: { type: 'select' },
            options: ['sm', 'md', 'lg'],
        },
        debounce: { control: { type: 'number' } },
    },
}

export default meta

type Story = StoryObj<typeof RangeInput>

export const Default: Story = {
    args: {
        defaultValue: 50,
        min: 0,
        max: 100,
        label: 'Volume',
    },
}

export const WithTooltip: Story = {
    args: {
        defaultValue: 75,
        min: 0,
        max: 100,
        label: 'Brightness',
        showTooltip: true,
    },
}

export const WithMinMaxLabels: Story = {
    args: {
        defaultValue: 50,
        min: 0,
        max: 100,
        label: 'Temperature',
        showMinMax: true,
    },
}

export const WithFormatter: Story = {
    args: {
        defaultValue: 50,
        min: 0,
        max: 100,
        label: 'Progress',
        showTooltip: true,
        showMinMax: true,
        formatValue: (value: number) => `${value}%`,
    },
}

export const PriceRange: Story = {
    args: {
        defaultValue: 500,
        min: 0,
        max: 1000,
        step: 10,
        label: 'Price',
        showTooltip: true,
        showMinMax: true,
        formatValue: (value: number) => `$${value}`,
        variant: 'success',
    },
}

export const WithoutNumberInput: Story = {
    args: {
        defaultValue: 50,
        min: 0,
        max: 100,
        label: 'Volume',
        showNumberInput: false,
        showTooltip: true,
    },
}

export const SmallSize: Story = {
    args: {
        defaultValue: 30,
        min: 0,
        max: 100,
        label: 'Small Range',
        size: 'sm',
        variant: 'primary',
    },
}

export const LargeSize: Story = {
    args: {
        defaultValue: 70,
        min: 0,
        max: 100,
        label: 'Large Range',
        size: 'lg',
        variant: 'warning',
    },
}

export const Success: Story = {
    args: {
        defaultValue: 80,
        min: 0,
        max: 100,
        label: 'Success Variant',
        variant: 'success',
        showTooltip: true,
    },
}

export const Error: Story = {
    args: {
        defaultValue: 20,
        min: 0,
        max: 100,
        label: 'Error Variant',
        variant: 'error',
        showTooltip: true,
    },
}

export const Disabled: Story = {
    args: {
        defaultValue: 50,
        min: 0,
        max: 100,
        label: 'Disabled Range',
        disabled: true,
    },
}

export const DecimalSteps: Story = {
    args: {
        defaultValue: 0.5,
        min: 0,
        max: 1,
        step: 0.1,
        label: 'Opacity',
        showTooltip: true,
        showMinMax: true,
        formatValue: (value: number) => value.toFixed(1),
    },
}

export const NegativeRange: Story = {
    args: {
        defaultValue: -50,
        min: -100,
        max: 0,
        label: 'Temperature (°C)',
        showTooltip: true,
        showMinMax: true,
    },
}

export const Controlled: Story = {
    render: () => {
        const [value, setValue] = useState(50)

        return (
            <div>
                <RangeInput
                    value={value}
                    onChange={setValue}
                    min={0}
                    max={100}
                    label="Controlled Volume"
                    showTooltip
                />
                <p style={{ marginTop: '20px' }}>Current value: {value}</p>
                <button onClick={() => setValue(75)}>Set to 75</button>
            </div>
        )
    },
}

export const WithDebounce: Story = {
    render: () => {
        const [value, setValue] = useState(50)
        const [callCount, setCallCount] = useState(0)

        const handleChange = (newValue: number) => {
            setValue(newValue)
            setCallCount((c) => c + 1)
        }

        return (
            <div>
                <RangeInput
                    value={value}
                    onChange={handleChange}
                    min={0}
                    max={100}
                    debounce={500}
                    label="Debounced (500ms)"
                    showTooltip
                />
                <p style={{ marginTop: '20px' }}>
                    Value: {value} | onChange called: {callCount} times
                </p>
                <small>
                    onChange is debounced by 500ms - move the slider quickly!
                </small>
            </div>
        )
    },
}

export const WithLifecycleCallbacks: Story = {
    render: () => {
        const [value, setValue] = useState(50)
        const [isDragging, setIsDragging] = useState(false)

        return (
            <div>
                <RangeInput
                    value={value}
                    onChange={setValue}
                    onChangeStart={() => setIsDragging(true)}
                    onChangeEnd={() => setIsDragging(false)}
                    min={0}
                    max={100}
                    label="With Lifecycle Callbacks"
                    showTooltip
                />
                <p style={{ marginTop: '20px' }}>
                    Value: {value} | Status:{' '}
                    {isDragging ? '🎯 Dragging' : '⏸️ Idle'}
                </p>
            </div>
        )
    },
}

export const AllFeatures: Story = {
    args: {
        defaultValue: 750,
        min: 0,
        max: 1000,
        step: 25,
        label: 'Budget Allocation',
        showTooltip: true,
        showMinMax: true,
        formatValue: (value: number) => `$${value.toLocaleString()}`,
        variant: 'primary',
        size: 'lg',
    },
}
