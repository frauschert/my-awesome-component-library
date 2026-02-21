import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import Autocomplete from './Autocomplete'

const fruits = [
    { label: 'Apple', value: 'apple' },
    { label: 'Apricot', value: 'apricot' },
    { label: 'Banana', value: 'banana' },
    { label: 'Blueberry', value: 'blueberry' },
    { label: 'Cherry', value: 'cherry' },
    { label: 'Date', value: 'date' },
    { label: 'Fig', value: 'fig' },
    { label: 'Grape', value: 'grape' },
    { label: 'Kiwi', value: 'kiwi', disabled: true },
    { label: 'Lemon', value: 'lemon' },
    { label: 'Mango', value: 'mango' },
    { label: 'Orange', value: 'orange' },
]

const meta: Meta<typeof Autocomplete> = {
    title: 'Components/Autocomplete',
    component: Autocomplete,
    decorators: [
        (Story) => (
            <div style={{ padding: '2rem', maxWidth: 360 }}>
                <Story />
            </div>
        ),
    ],
}

export default meta
type Story = StoryObj<typeof Autocomplete>

export const Default: Story = {
    render: () => {
        const [value, setValue] = React.useState('')
        return (
            <Autocomplete
                label="Favourite fruit"
                placeholder="Type to search…"
                value={value}
                onChange={setValue}
                options={fruits}
            />
        )
    },
}

export const PreFiltered: Story = {
    render: () => {
        const [value, setValue] = React.useState('a')
        return (
            <Autocomplete
                label="Fruit"
                value={value}
                onChange={setValue}
                options={fruits}
            />
        )
    },
}

export const Loading: Story = {
    render: () => {
        const [value, setValue] = React.useState('')
        return (
            <Autocomplete
                label="Fruit"
                placeholder="Loading options…"
                value={value}
                onChange={setValue}
                options={[]}
                loading
            />
        )
    },
}

export const FreeSolo: Story = {
    render: () => {
        const [value, setValue] = React.useState('')
        return (
            <Autocomplete
                label="Fruit (free-form)"
                placeholder="Type anything…"
                value={value}
                onChange={setValue}
                options={fruits}
                freeSolo
            />
        )
    },
}

export const Disabled: Story = {
    render: () => (
        <Autocomplete
            label="Fruit"
            value="Apple"
            onChange={() => {}}
            options={fruits}
            disabled
        />
    ),
}

export const Small: Story = {
    render: () => {
        const [value, setValue] = React.useState('')
        return (
            <Autocomplete
                label="Fruit (small)"
                value={value}
                onChange={setValue}
                options={fruits}
                size="small"
            />
        )
    },
}

export const Large: Story = {
    render: () => {
        const [value, setValue] = React.useState('')
        return (
            <Autocomplete
                label="Fruit (large)"
                value={value}
                onChange={setValue}
                options={fruits}
                size="large"
            />
        )
    },
}
