import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Chip } from './Chip'

const meta: Meta<typeof Chip> = {
    title: 'Components/Chip',
    component: Chip,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Chip>

export const Default: Story = {
    args: {
        label: 'Chip',
    },
}

export const Variants: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Chip label="Filled" variant="filled" color="primary" />
            <Chip label="Outlined" variant="outlined" color="primary" />
            <Chip label="Light" variant="light" color="primary" />
        </div>
    ),
}

export const Colors: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Chip label="Default" color="default" />
                <Chip label="Primary" color="primary" />
                <Chip label="Secondary" color="secondary" />
                <Chip label="Success" color="success" />
                <Chip label="Warning" color="warning" />
                <Chip label="Danger" color="danger" />
                <Chip label="Info" color="info" />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Chip label="Default" color="default" variant="outlined" />
                <Chip label="Primary" color="primary" variant="outlined" />
                <Chip label="Secondary" color="secondary" variant="outlined" />
                <Chip label="Success" color="success" variant="outlined" />
                <Chip label="Warning" color="warning" variant="outlined" />
                <Chip label="Danger" color="danger" variant="outlined" />
                <Chip label="Info" color="info" variant="outlined" />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Chip label="Default" color="default" variant="light" />
                <Chip label="Primary" color="primary" variant="light" />
                <Chip label="Secondary" color="secondary" variant="light" />
                <Chip label="Success" color="success" variant="light" />
                <Chip label="Warning" color="warning" variant="light" />
                <Chip label="Danger" color="danger" variant="light" />
                <Chip label="Info" color="info" variant="light" />
            </div>
        </div>
    ),
}

export const Sizes: Story = {
    render: () => (
        <div
            style={{
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'center',
                flexWrap: 'wrap',
            }}
        >
            <Chip label="Small" size="small" color="primary" />
            <Chip label="Medium" size="medium" color="primary" />
            <Chip label="Large" size="large" color="primary" />
        </div>
    ),
}

export const WithIcons: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Chip
                label="Home"
                icon={
                    <svg viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                }
                color="primary"
            />
            <Chip
                label="Delete"
                icon={
                    <svg viewBox="0 0 20 20" fill="currentColor">
                        <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                }
                color="danger"
            />
            <Chip
                label="Star"
                icon={
                    <svg viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                }
                color="warning"
                variant="outlined"
            />
        </div>
    ),
}

export const WithAvatars: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Chip
                label="John Doe"
                avatar={<span>JD</span>}
                color="primary"
                variant="light"
            />
            <Chip
                label="Jane Smith"
                avatar={<span>JS</span>}
                color="success"
                variant="light"
            />
            <Chip
                label="Alex Johnson"
                avatar={
                    <img src="https://i.pravatar.cc/150?img=33" alt="Alex" />
                }
                color="info"
                variant="light"
            />
        </div>
    ),
}

export const Dismissible: Story = {
    render: () => {
        const [chips, setChips] = useState([
            { id: 1, label: 'React', color: 'primary' as const },
            { id: 2, label: 'TypeScript', color: 'info' as const },
            { id: 3, label: 'JavaScript', color: 'warning' as const },
            { id: 4, label: 'CSS', color: 'success' as const },
        ])

        const handleDismiss = (id: number) => {
            setChips(chips.filter((chip) => chip.id !== id))
        }

        return (
            <div>
                <div
                    style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}
                >
                    {chips.map((chip) => (
                        <Chip
                            key={chip.id}
                            label={chip.label}
                            color={chip.color}
                            dismissible
                            onDismiss={() => handleDismiss(chip.id)}
                        />
                    ))}
                </div>
                {chips.length === 0 && (
                    <p
                        style={{
                            marginTop: '1rem',
                            color: 'var(--theme-text-secondary)',
                        }}
                    >
                        All chips dismissed! Refresh to reset.
                    </p>
                )}
            </div>
        )
    },
}

export const Clickable: Story = {
    render: () => {
        const [selected, setSelected] = useState<string | null>(null)

        return (
            <div>
                <div
                    style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}
                >
                    {['Apple', 'Banana', 'Cherry', 'Date'].map((fruit) => (
                        <Chip
                            key={fruit}
                            label={fruit}
                            color="primary"
                            variant="outlined"
                            onClick={() => setSelected(fruit)}
                            selected={selected === fruit}
                        />
                    ))}
                </div>
                <p
                    style={{
                        marginTop: '1rem',
                        color: 'var(--theme-text-primary)',
                    }}
                >
                    Selected: <strong>{selected || 'None'}</strong>
                </p>
            </div>
        )
    },
}

export const Selectable: Story = {
    render: () => {
        const [selectedTags, setSelectedTags] = useState<string[]>([
            'TypeScript',
        ])

        const tags = [
            'JavaScript',
            'TypeScript',
            'React',
            'Vue',
            'Angular',
            'Svelte',
        ]

        const toggleTag = (tag: string) => {
            setSelectedTags((prev) =>
                prev.includes(tag)
                    ? prev.filter((t) => t !== tag)
                    : [...prev, tag]
            )
        }

        return (
            <div>
                <div
                    style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}
                >
                    {tags.map((tag) => (
                        <Chip
                            key={tag}
                            label={tag}
                            color="primary"
                            variant="light"
                            onClick={() => toggleTag(tag)}
                            selected={selectedTags.includes(tag)}
                        />
                    ))}
                </div>
                <p
                    style={{
                        marginTop: '1rem',
                        color: 'var(--theme-text-primary)',
                    }}
                >
                    Selected:{' '}
                    <strong>{selectedTags.join(', ') || 'None'}</strong>
                </p>
            </div>
        )
    },
}

export const Disabled: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Chip label="Disabled" color="primary" disabled />
            <Chip
                label="Disabled"
                color="success"
                variant="outlined"
                disabled
            />
            <Chip label="Disabled" color="danger" dismissible disabled />
            <Chip label="Disabled" color="info" onClick={() => {}} disabled />
        </div>
    ),
}

export const LongText: Story = {
    render: () => (
        <div style={{ maxWidth: '300px' }}>
            <Chip
                label="This is a very long chip label that will be truncated"
                color="primary"
                dismissible
            />
        </div>
    ),
}

export const FilterExample: Story = {
    render: () => {
        const [activeFilters, setActiveFilters] = useState<string[]>([
            'In Stock',
            'Free Shipping',
        ])

        const availableFilters = [
            { label: 'In Stock', color: 'success' as const },
            { label: 'Free Shipping', color: 'info' as const },
            { label: 'On Sale', color: 'danger' as const },
            { label: 'New Arrivals', color: 'primary' as const },
            { label: 'Top Rated', color: 'warning' as const },
        ]

        const removeFilter = (filter: string) => {
            setActiveFilters(activeFilters.filter((f) => f !== filter))
        }

        return (
            <div>
                <h3
                    style={{
                        marginBottom: '0.5rem',
                        color: 'var(--theme-text-primary)',
                    }}
                >
                    Active Filters:
                </h3>
                <div
                    style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}
                >
                    {activeFilters.map((filter) => {
                        const config = availableFilters.find(
                            (f) => f.label === filter
                        )
                        return (
                            <Chip
                                key={filter}
                                label={filter}
                                color={config?.color}
                                dismissible
                                onDismiss={() => removeFilter(filter)}
                            />
                        )
                    })}
                    {activeFilters.length === 0 && (
                        <span style={{ color: 'var(--theme-text-secondary)' }}>
                            No active filters
                        </span>
                    )}
                </div>
            </div>
        )
    },
}

export const TagInput: Story = {
    render: () => {
        const [tags, setTags] = useState(['Design', 'Development', 'Marketing'])
        const [inputValue, setInputValue] = useState('')

        const addTag = () => {
            if (inputValue.trim() && !tags.includes(inputValue.trim())) {
                setTags([...tags, inputValue.trim()])
                setInputValue('')
            }
        }

        const removeTag = (tag: string) => {
            setTags(tags.filter((t) => t !== tag))
        }

        return (
            <div>
                <div
                    style={{
                        display: 'flex',
                        gap: '0.5rem',
                        flexWrap: 'wrap',
                        padding: '0.5rem',
                        border: '1px solid var(--theme-border-primary)',
                        borderRadius: '4px',
                        minHeight: '3rem',
                    }}
                >
                    {tags.map((tag) => (
                        <Chip
                            key={tag}
                            label={tag}
                            color="primary"
                            variant="light"
                            dismissible
                            onDismiss={() => removeTag(tag)}
                        />
                    ))}
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault()
                                addTag()
                            }
                        }}
                        placeholder="Add tag..."
                        style={{
                            border: 'none',
                            outline: 'none',
                            flex: 1,
                            minWidth: '100px',
                            fontSize: '0.875rem',
                            backgroundColor: 'transparent',
                            color: 'var(--theme-text-primary)',
                        }}
                    />
                </div>
                <p
                    style={{
                        marginTop: '0.5rem',
                        fontSize: '0.75rem',
                        color: 'var(--theme-text-secondary)',
                    }}
                >
                    Type and press Enter to add tags
                </p>
            </div>
        )
    },
}

export const StatusChips: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div
                style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
            >
                <span style={{ color: 'var(--theme-text-primary)' }}>
                    Order Status:
                </span>
                <Chip label="Pending" color="warning" size="small" />
            </div>
            <div
                style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
            >
                <span style={{ color: 'var(--theme-text-primary)' }}>
                    Payment:
                </span>
                <Chip label="Completed" color="success" size="small" />
            </div>
            <div
                style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
            >
                <span style={{ color: 'var(--theme-text-primary)' }}>
                    Delivery:
                </span>
                <Chip label="Failed" color="danger" size="small" />
            </div>
            <div
                style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
            >
                <span style={{ color: 'var(--theme-text-primary)' }}>
                    Support:
                </span>
                <Chip
                    label="Active"
                    color="info"
                    size="small"
                    variant="light"
                />
            </div>
        </div>
    ),
}
