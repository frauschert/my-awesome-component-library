import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import Select from './Select'
import type { SelectOption } from './Select'

const meta: Meta<typeof Select> = {
    title: 'Components/Select',
    component: Select,
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
        },
        variant: {
            control: 'select',
            options: ['default', 'filled', 'outlined'],
        },
        multiple: {
            control: 'boolean',
        },
        searchable: {
            control: 'boolean',
        },
        clearable: {
            control: 'boolean',
        },
        disabled: {
            control: 'boolean',
        },
        error: {
            control: 'boolean',
        },
    },
    decorators: [
        (Story) => (
            <div style={{ padding: '2rem', minHeight: '400px' }}>
                <Story />
            </div>
        ),
    ],
}

export default meta
type Story = StoryObj<typeof Select>

const fruits: SelectOption[] = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
    { value: 'date', label: 'Date' },
    { value: 'elderberry', label: 'Elderberry' },
    { value: 'fig', label: 'Fig' },
    { value: 'grape', label: 'Grape' },
    { value: 'honeydew', label: 'Honeydew' },
]

export const Default: Story = {
    args: {
        options: fruits,
        placeholder: 'Select a fruit',
    },
}

export const WithLabel: Story = {
    args: {
        options: fruits,
        label: 'Favorite Fruit',
        placeholder: 'Choose one',
    },
}

export const Required: Story = {
    args: {
        options: fruits,
        label: 'Favorite Fruit',
        required: true,
        placeholder: 'Choose one',
    },
}

export const WithDefaultValue: Story = {
    args: {
        options: fruits,
        label: 'Favorite Fruit',
        defaultValue: 'banana',
    },
}

export const Clearable: Story = {
    args: {
        options: fruits,
        label: 'Favorite Fruit',
        defaultValue: 'banana',
        clearable: true,
    },
}

export const Searchable: Story = {
    args: {
        options: fruits,
        label: 'Favorite Fruit',
        searchable: true,
        placeholder: 'Search fruits...',
    },
}

export const MultiSelect: Story = {
    args: {
        options: fruits,
        label: 'Favorite Fruits',
        multiple: true,
        placeholder: 'Select multiple fruits',
    },
}

export const MultiSelectWithDefaults: Story = {
    args: {
        options: fruits,
        label: 'Favorite Fruits',
        multiple: true,
        defaultValue: ['apple', 'banana', 'cherry'],
    },
}

export const SearchableMultiSelect: Story = {
    args: {
        options: fruits,
        label: 'Favorite Fruits',
        multiple: true,
        searchable: true,
        clearable: true,
        placeholder: 'Search and select',
    },
}

export const Disabled: Story = {
    args: {
        options: fruits,
        label: 'Favorite Fruit',
        disabled: true,
        defaultValue: 'apple',
    },
}

export const WithError: Story = {
    args: {
        options: fruits,
        label: 'Favorite Fruit',
        error: true,
        helperText: 'Please select a fruit',
    },
}

export const WithHelperText: Story = {
    args: {
        options: fruits,
        label: 'Favorite Fruit',
        helperText: 'Choose your favorite fruit from the list',
    },
}

export const SmallSize: Story = {
    args: {
        options: fruits,
        label: 'Favorite Fruit',
        size: 'sm',
    },
}

export const LargeSize: Story = {
    args: {
        options: fruits,
        label: 'Favorite Fruit',
        size: 'lg',
    },
}

export const FilledVariant: Story = {
    args: {
        options: fruits,
        label: 'Favorite Fruit',
        variant: 'filled',
    },
}

export const OutlinedVariant: Story = {
    args: {
        options: fruits,
        label: 'Favorite Fruit',
        variant: 'outlined',
    },
}

const countries: SelectOption[] = [
    { value: 'us', label: 'United States', group: 'North America' },
    { value: 'ca', label: 'Canada', group: 'North America' },
    { value: 'mx', label: 'Mexico', group: 'North America' },
    { value: 'br', label: 'Brazil', group: 'South America' },
    { value: 'ar', label: 'Argentina', group: 'South America' },
    { value: 'uk', label: 'United Kingdom', group: 'Europe' },
    { value: 'de', label: 'Germany', group: 'Europe' },
    { value: 'fr', label: 'France', group: 'Europe' },
    { value: 'jp', label: 'Japan', group: 'Asia' },
    { value: 'cn', label: 'China', group: 'Asia' },
    { value: 'in', label: 'India', group: 'Asia' },
]

export const GroupedOptions: Story = {
    args: {
        options: countries,
        label: 'Country',
        searchable: true,
        placeholder: 'Select a country',
    },
}

const optionsWithDisabled: SelectOption[] = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2 (disabled)', disabled: true },
    { value: '3', label: 'Option 3' },
    { value: '4', label: 'Option 4 (disabled)', disabled: true },
    { value: '5', label: 'Option 5' },
]

export const WithDisabledOptions: Story = {
    args: {
        options: optionsWithDisabled,
        label: 'Choose an option',
        placeholder: 'Some options are disabled',
    },
}

export const CustomOptionRender: Story = {
    args: {
        options: fruits,
        label: 'Favorite Fruit',
        renderOption: (option) => (
            <div
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
                <span style={{ fontSize: '1.25rem' }}>🍎</span>
                <strong>{option.label}</strong>
            </div>
        ),
    },
}

export const CustomValueRender: Story = {
    args: {
        options: fruits,
        label: 'Favorite Fruit',
        defaultValue: 'apple',
        renderValue: (value) => (
            <span style={{ fontWeight: 'bold', color: '#408bbd' }}>
                Selected: {Array.isArray(value) ? value.join(', ') : value}
            </span>
        ),
    },
}

export const Controlled: Story = {
    render: (args) => {
        const [value, setValue] = useState<string>('banana')
        return (
            <div>
                <Select
                    {...args}
                    value={value}
                    onChange={(newValue) => setValue(newValue as string)}
                />
                <p style={{ marginTop: '1rem' }}>
                    Selected value: <strong>{value}</strong>
                </p>
                <button
                    onClick={() => setValue('cherry')}
                    style={{ marginTop: '0.5rem' }}
                >
                    Set to Cherry
                </button>
            </div>
        )
    },
    args: {
        options: fruits,
        label: 'Controlled Select',
    },
}

export const ControlledMultiple: Story = {
    render: (args) => {
        const [value, setValue] = useState<string[]>(['apple', 'banana'])
        return (
            <div>
                <Select
                    {...args}
                    value={value}
                    onChange={(newValue) => setValue(newValue as string[])}
                    multiple
                />
                <p style={{ marginTop: '1rem' }}>
                    Selected values: <strong>{value.join(', ')}</strong>
                </p>
                <button
                    onClick={() => setValue(['cherry', 'date'])}
                    style={{ marginTop: '0.5rem' }}
                >
                    Set to Cherry & Date
                </button>
            </div>
        )
    },
    args: {
        options: fruits,
        label: 'Controlled Multi-Select',
    },
}

const manyOptions: SelectOption[] = Array.from({ length: 100 }, (_, i) => ({
    value: `option-${i + 1}`,
    label: `Option ${i + 1}`,
}))

export const ManyOptions: Story = {
    args: {
        options: manyOptions,
        label: 'Select from many options',
        searchable: true,
        placeholder: 'Search from 100 options',
    },
}

export const FormIntegration: Story = {
    render: (args) => {
        const [value, setValue] = useState<string>('apple')

        return (
            <div>
                <Select
                    {...args}
                    name="fruit"
                    value={value}
                    onChange={(newValue) => setValue(newValue as string)}
                />
                <p style={{ marginTop: '1rem' }}>
                    Form value: <strong>{value}</strong>
                </p>
            </div>
        )
    },
    args: {
        options: fruits,
        label: 'Favorite Fruit',
    },
}
