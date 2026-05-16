import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ButtonGroup, ButtonGroupButton } from './ButtonGroup'

const meta: Meta<typeof ButtonGroup> = {
    title: 'Components/ButtonGroup',
    component: ButtonGroup,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ButtonGroup>

const basicButtons: ButtonGroupButton[] = [
    { id: 'left', label: 'Left' },
    { id: 'center', label: 'Center' },
    { id: 'right', label: 'Right' },
]

const iconButtons: ButtonGroupButton[] = [
    {
        id: 'bold',
        label: 'Bold',
        icon: (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
                <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
            </svg>
        ),
    },
    {
        id: 'italic',
        label: 'Italic',
        icon: (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <line x1="19" y1="4" x2="10" y2="4" />
                <line x1="14" y1="20" x2="5" y2="20" />
                <line x1="15" y1="4" x2="9" y2="20" />
            </svg>
        ),
    },
    {
        id: 'underline',
        label: 'Underline',
        icon: (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" />
                <line x1="4" y1="21" x2="20" y2="21" />
            </svg>
        ),
    },
]

const viewButtons: ButtonGroupButton[] = [
    {
        id: 'list',
        label: 'List',
        icon: (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
        ),
    },
    {
        id: 'grid',
        label: 'Grid',
        icon: (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
            </svg>
        ),
    },
]

export const Default: Story = {
    args: {
        buttons: basicButtons,
        selectionMode: 'none',
    },
}

export const SingleSelection: Story = {
    render: () => {
        const [selected, setSelected] = useState<string | string[] | null>(
            'center'
        )

        return (
            <div style={{ padding: '2rem' }}>
                <ButtonGroup
                    buttons={basicButtons}
                    selectionMode="single"
                    selected={selected as string}
                    onChange={setSelected}
                />
                <div
                    style={{
                        marginTop: '1rem',
                        fontSize: '0.875rem',
                        color: '#6b7280',
                    }}
                >
                    Selected: {selected || 'none'}
                </div>
            </div>
        )
    },
}

export const MultipleSelection: Story = {
    render: () => {
        const [selected, setSelected] = useState<string | string[] | null>([
            'bold',
        ])

        return (
            <div style={{ padding: '2rem' }}>
                <ButtonGroup
                    buttons={iconButtons}
                    selectionMode="multiple"
                    selected={selected as string[]}
                    onChange={setSelected}
                />
                <div
                    style={{
                        marginTop: '1rem',
                        fontSize: '0.875rem',
                        color: '#6b7280',
                    }}
                >
                    Selected:{' '}
                    {Array.isArray(selected) ? selected.join(', ') : 'none'}
                </div>
            </div>
        )
    },
}

export const WithIcons: Story = {
    render: () => {
        const [selected, setSelected] = useState<string | string[] | null>(
            'list'
        )

        return (
            <ButtonGroup
                buttons={viewButtons}
                selectionMode="single"
                selected={selected as string}
                onChange={setSelected}
            />
        )
    },
}

export const Outlined: Story = {
    render: () => {
        const [selected, setSelected] = useState<string | string[] | null>(
            'center'
        )

        return (
            <ButtonGroup
                buttons={basicButtons}
                variant="outlined"
                selectionMode="single"
                selected={selected as string}
                onChange={setSelected}
            />
        )
    },
}

export const Contained: Story = {
    render: () => {
        const [selected, setSelected] = useState<string | string[] | null>(
            'center'
        )

        return (
            <ButtonGroup
                buttons={basicButtons}
                variant="contained"
                selectionMode="single"
                selected={selected as string}
                onChange={setSelected}
            />
        )
    },
}

export const Sizes: Story = {
    render: () => {
        const [smallSelected, setSmallSelected] = useState<
            string | string[] | null
        >('left')
        const [mediumSelected, setMediumSelected] = useState<
            string | string[] | null
        >('center')
        const [largeSelected, setLargeSelected] = useState<
            string | string[] | null
        >('right')

        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem',
                    padding: '2rem',
                }}
            >
                <div>
                    <div
                        style={{
                            marginBottom: '0.5rem',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                        }}
                    >
                        Small
                    </div>
                    <ButtonGroup
                        buttons={basicButtons}
                        size="small"
                        selectionMode="single"
                        selected={smallSelected as string}
                        onChange={setSmallSelected}
                    />
                </div>
                <div>
                    <div
                        style={{
                            marginBottom: '0.5rem',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                        }}
                    >
                        Medium
                    </div>
                    <ButtonGroup
                        buttons={basicButtons}
                        size="medium"
                        selectionMode="single"
                        selected={mediumSelected as string}
                        onChange={setMediumSelected}
                    />
                </div>
                <div>
                    <div
                        style={{
                            marginBottom: '0.5rem',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                        }}
                    >
                        Large
                    </div>
                    <ButtonGroup
                        buttons={basicButtons}
                        size="large"
                        selectionMode="single"
                        selected={largeSelected as string}
                        onChange={setLargeSelected}
                    />
                </div>
            </div>
        )
    },
}

export const Vertical: Story = {
    render: () => {
        const [selected, setSelected] = useState<string | string[] | null>(
            'center'
        )

        return (
            <ButtonGroup
                buttons={basicButtons}
                orientation="vertical"
                selectionMode="single"
                selected={selected as string}
                onChange={setSelected}
            />
        )
    },
}

export const FullWidth: Story = {
    render: () => {
        const [selected, setSelected] = useState<string | string[] | null>(
            'center'
        )

        return (
            <div style={{ width: '400px', padding: '2rem' }}>
                <ButtonGroup
                    buttons={basicButtons}
                    fullWidth
                    selectionMode="single"
                    selected={selected as string}
                    onChange={setSelected}
                />
            </div>
        )
    },
}

export const WithDisabledButton: Story = {
    render: () => {
        const buttonsWithDisabled: ButtonGroupButton[] = [
            { id: 'option1', label: 'Option 1' },
            { id: 'option2', label: 'Option 2', disabled: true },
            { id: 'option3', label: 'Option 3' },
        ]

        const [selected, setSelected] = useState<string | string[] | null>(
            'option1'
        )

        return (
            <ButtonGroup
                buttons={buttonsWithDisabled}
                selectionMode="single"
                selected={selected as string}
                onChange={setSelected}
            />
        )
    },
}

export const DisabledGroup: Story = {
    args: {
        buttons: basicButtons,
        selectionMode: 'single',
        defaultSelected: 'center',
        disabled: true,
    },
}

export const AllowDeselect: Story = {
    render: () => {
        const [selected, setSelected] = useState<string | string[] | null>(
            'center'
        )

        return (
            <div style={{ padding: '2rem' }}>
                <ButtonGroup
                    buttons={basicButtons}
                    selectionMode="single"
                    selected={selected as string}
                    onChange={setSelected}
                    allowDeselect
                />
                <div
                    style={{
                        marginTop: '1rem',
                        fontSize: '0.875rem',
                        color: '#6b7280',
                    }}
                >
                    Selected: {selected || 'none'} (Click again to deselect)
                </div>
            </div>
        )
    },
}

export const TextFormattingToolbar: Story = {
    render: () => {
        const [formatting, setFormatting] = useState<string | string[] | null>(
            []
        )

        return (
            <div style={{ padding: '2rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <ButtonGroup
                        buttons={iconButtons}
                        selectionMode="multiple"
                        selected={formatting as string[]}
                        onChange={setFormatting}
                        variant="outlined"
                    />
                </div>
                <div
                    style={{
                        padding: '1rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '4px',
                        minHeight: '100px',
                        fontWeight:
                            Array.isArray(formatting) &&
                            formatting.includes('bold')
                                ? 'bold'
                                : 'normal',
                        fontStyle:
                            Array.isArray(formatting) &&
                            formatting.includes('italic')
                                ? 'italic'
                                : 'normal',
                        textDecoration:
                            Array.isArray(formatting) &&
                            formatting.includes('underline')
                                ? 'underline'
                                : 'none',
                    }}
                >
                    Sample text with formatting applied
                </div>
            </div>
        )
    },
}

export const ViewSwitcher: Story = {
    render: () => {
        const [view, setView] = useState<string | string[] | null>('grid')

        return (
            <div style={{ padding: '2rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <ButtonGroup
                        buttons={viewButtons}
                        selectionMode="single"
                        selected={view as string}
                        onChange={setView}
                        variant="contained"
                    />
                </div>
                <div
                    style={{
                        display: view === 'grid' ? 'grid' : 'flex',
                        gridTemplateColumns:
                            view === 'grid' ? 'repeat(3, 1fr)' : undefined,
                        flexDirection: view === 'list' ? 'column' : undefined,
                        gap: '1rem',
                        padding: '1rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '4px',
                    }}
                >
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <div
                            key={item}
                            style={{
                                padding: '1rem',
                                backgroundColor: '#f3f4f6',
                                borderRadius: '4px',
                                textAlign: 'center',
                            }}
                        >
                            Item {item}
                        </div>
                    ))}
                </div>
            </div>
        )
    },
}
