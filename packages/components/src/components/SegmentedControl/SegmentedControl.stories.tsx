import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import SegmentedControl from './SegmentedControl'

const meta: Meta<typeof SegmentedControl> = {
    title: 'Components/SegmentedControl',
    component: SegmentedControl,
    decorators: [
        (Story) => (
            <div style={{ padding: '2rem' }}>
                <Story />
            </div>
        ),
    ],
    args: {
        size: 'medium',
        orientation: 'horizontal',
        disabled: false,
        fullWidth: false,
    },
}

export default meta
type Story = StoryObj<typeof SegmentedControl>

const calendarItems = [
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: 'year', label: 'Year' },
]

export const Default: Story = {
    render: (args) => {
        const [value, setValue] = React.useState('week')
        return (
            <SegmentedControl
                {...args}
                items={calendarItems}
                value={value}
                onChange={setValue}
                aria-label="Calendar view"
            />
        )
    },
}

export const WithIcons: Story = {
    render: (args) => {
        const [value, setValue] = React.useState('list')
        return (
            <SegmentedControl
                {...args}
                items={[
                    { value: 'list', label: 'List', icon: '☰' },
                    { value: 'grid', label: 'Grid', icon: '⊞' },
                    { value: 'table', label: 'Table', icon: '▦' },
                ]}
                value={value}
                onChange={setValue}
                aria-label="View mode"
            />
        )
    },
}

export const IconOnly: Story = {
    render: (args) => {
        const [value, setValue] = React.useState('list')
        return (
            <SegmentedControl
                {...args}
                items={[
                    { value: 'list', label: '☰', 'aria-label': 'List view' },
                    { value: 'grid', label: '⊞', 'aria-label': 'Grid view' },
                    { value: 'table', label: '▦', 'aria-label': 'Table view' },
                ]}
                value={value}
                onChange={setValue}
                aria-label="View mode"
            />
        )
    },
}

export const WithDisabledItem: Story = {
    render: (args) => {
        const [value, setValue] = React.useState('day')
        return (
            <SegmentedControl
                {...args}
                items={[
                    { value: 'day', label: 'Day' },
                    { value: 'week', label: 'Week', disabled: true },
                    { value: 'month', label: 'Month' },
                ]}
                value={value}
                onChange={setValue}
                aria-label="Calendar view"
            />
        )
    },
}

export const Disabled: Story = {
    render: (args) => (
        <SegmentedControl
            {...args}
            items={calendarItems}
            defaultValue="month"
            disabled
            aria-label="Calendar view"
        />
    ),
}

export const FullWidth: Story = {
    render: (args) => {
        const [value, setValue] = React.useState('week')
        return (
            <div style={{ maxWidth: 480 }}>
                <SegmentedControl
                    {...args}
                    items={calendarItems}
                    value={value}
                    onChange={setValue}
                    fullWidth
                    aria-label="Calendar view"
                />
            </div>
        )
    },
}

export const Vertical: Story = {
    render: (args) => {
        const [value, setValue] = React.useState('week')
        return (
            <SegmentedControl
                {...args}
                items={calendarItems}
                value={value}
                onChange={setValue}
                orientation="vertical"
                aria-label="Calendar view"
            />
        )
    },
}

export const Small: Story = {
    render: (args) => {
        const [value, setValue] = React.useState('week')
        return (
            <SegmentedControl
                {...args}
                items={calendarItems}
                value={value}
                onChange={setValue}
                size="small"
                aria-label="Calendar view"
            />
        )
    },
}

export const Large: Story = {
    render: (args) => {
        const [value, setValue] = React.useState('week')
        return (
            <SegmentedControl
                {...args}
                items={calendarItems}
                value={value}
                onChange={setValue}
                size="large"
                aria-label="Calendar view"
            />
        )
    },
}
