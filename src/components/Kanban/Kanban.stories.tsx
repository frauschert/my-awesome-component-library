import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Kanban, KanbanColumn, KanbanCard } from './Kanban'

const meta: Meta<typeof Kanban> = {
    title: 'Components/Kanban',
    component: Kanban,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Kanban>

const sampleColumns: KanbanColumn[] = [
    {
        id: 'todo',
        title: 'To Do',
        color: '#6b7280',
        cards: [
            {
                id: 'card-1',
                title: 'Design new landing page',
                description:
                    'Create mockups and prototypes for the new landing page',
                tags: ['design', 'ui/ux'],
                priority: 'high',
                assignee: 'John Doe',
                dueDate: '2025-10-30',
            },
            {
                id: 'card-2',
                title: 'Update documentation',
                description: 'Review and update API documentation',
                tags: ['docs'],
                priority: 'medium',
                assignee: 'Jane Smith',
            },
        ],
    },
    {
        id: 'in-progress',
        title: 'In Progress',
        color: '#408bbd',
        cards: [
            {
                id: 'card-3',
                title: 'Implement authentication',
                description: 'Add JWT-based authentication to the API',
                tags: ['backend', 'security'],
                priority: 'high',
                assignee: 'Bob Wilson',
                dueDate: '2025-10-25',
            },
        ],
    },
    {
        id: 'review',
        title: 'Review',
        color: '#f59e0b',
        cards: [
            {
                id: 'card-4',
                title: 'Code review: Payment integration',
                description:
                    'Review pull request for payment gateway integration',
                tags: ['review', 'payment'],
                priority: 'high',
                assignee: 'Alice Johnson',
            },
        ],
    },
    {
        id: 'done',
        title: 'Done',
        color: '#10b981',
        cards: [
            {
                id: 'card-5',
                title: 'Fix mobile responsiveness',
                description: 'Fixed layout issues on mobile devices',
                tags: ['bug', 'mobile'],
                priority: 'low',
            },
            {
                id: 'card-6',
                title: 'Setup CI/CD pipeline',
                description: 'Configured GitHub Actions for automated testing',
                tags: ['devops'],
                priority: 'medium',
                assignee: 'Charlie Brown',
            },
        ],
    },
]

export const Default: Story = {
    render: () => {
        const [columns, setColumns] = useState(sampleColumns)

        const handleCardMove = (
            cardId: string,
            fromColumnId: string,
            toColumnId: string,
            newIndex: number
        ) => {
            setColumns((prevColumns) => {
                const newColumns = [...prevColumns]
                const fromColumn = newColumns.find(
                    (col) => col.id === fromColumnId
                )
                const toColumn = newColumns.find((col) => col.id === toColumnId)

                if (!fromColumn || !toColumn) return prevColumns

                const cardIndex = fromColumn.cards.findIndex(
                    (c) => c.id === cardId
                )
                if (cardIndex === -1) return prevColumns

                const [card] = fromColumn.cards.splice(cardIndex, 1)
                toColumn.cards.splice(newIndex, 0, card)

                return newColumns
            })
        }

        return (
            <div style={{ height: '100vh' }}>
                <Kanban columns={columns} onCardMove={handleCardMove} />
            </div>
        )
    },
}

export const WithMaxCards: Story = {
    render: () => {
        const columnsWithMax: KanbanColumn[] = [
            { ...sampleColumns[0], maxCards: 3 },
            { ...sampleColumns[1], maxCards: 2 },
            { ...sampleColumns[2] },
            { ...sampleColumns[3] },
        ]

        const [columns, setColumns] = useState(columnsWithMax)

        const handleCardMove = (
            cardId: string,
            fromColumnId: string,
            toColumnId: string,
            newIndex: number
        ) => {
            setColumns((prevColumns) => {
                const newColumns = [...prevColumns]
                const fromColumn = newColumns.find(
                    (col) => col.id === fromColumnId
                )
                const toColumn = newColumns.find((col) => col.id === toColumnId)

                if (!fromColumn || !toColumn) return prevColumns

                // Check max cards limit
                if (
                    toColumn.maxCards &&
                    toColumn.cards.length >= toColumn.maxCards &&
                    fromColumnId !== toColumnId
                ) {
                    alert(
                        `Cannot add more cards to ${toColumn.title}. Maximum is ${toColumn.maxCards}.`
                    )
                    return prevColumns
                }

                const cardIndex = fromColumn.cards.findIndex(
                    (c) => c.id === cardId
                )
                if (cardIndex === -1) return prevColumns

                const [card] = fromColumn.cards.splice(cardIndex, 1)
                toColumn.cards.splice(newIndex, 0, card)

                return newColumns
            })
        }

        return (
            <div style={{ height: '100vh' }}>
                <Kanban columns={columns} onCardMove={handleCardMove} />
            </div>
        )
    },
}

export const CustomCardRenderer: Story = {
    render: () => {
        const [columns, setColumns] = useState(sampleColumns)

        const handleCardMove = (
            cardId: string,
            fromColumnId: string,
            toColumnId: string,
            newIndex: number
        ) => {
            setColumns((prevColumns) => {
                const newColumns = [...prevColumns]
                const fromColumn = newColumns.find(
                    (col) => col.id === fromColumnId
                )
                const toColumn = newColumns.find((col) => col.id === toColumnId)

                if (!fromColumn || !toColumn) return prevColumns

                const cardIndex = fromColumn.cards.findIndex(
                    (c) => c.id === cardId
                )
                if (cardIndex === -1) return prevColumns

                const [card] = fromColumn.cards.splice(cardIndex, 1)
                toColumn.cards.splice(newIndex, 0, card)

                return newColumns
            })
        }

        const renderCard = (card: KanbanCard) => (
            <div style={{ padding: '0.5rem' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    {card.title}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {card.description}
                </div>
                {card.tags && (
                    <div
                        style={{
                            marginTop: '0.5rem',
                            display: 'flex',
                            gap: '0.25rem',
                        }}
                    >
                        {card.tags.map((tag, idx) => (
                            <span
                                key={idx}
                                style={{
                                    padding: '0.125rem 0.5rem',
                                    fontSize: '0.75rem',
                                    backgroundColor: '#f3f4f6',
                                    borderRadius: '4px',
                                }}
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        )

        return (
            <div style={{ height: '100vh' }}>
                <Kanban
                    columns={columns}
                    onCardMove={handleCardMove}
                    renderCard={renderCard}
                />
            </div>
        )
    },
}

export const WithCardClick: Story = {
    render: () => {
        const [columns, setColumns] = useState(sampleColumns)

        const handleCardMove = (
            cardId: string,
            fromColumnId: string,
            toColumnId: string,
            newIndex: number
        ) => {
            setColumns((prevColumns) => {
                const newColumns = [...prevColumns]
                const fromColumn = newColumns.find(
                    (col) => col.id === fromColumnId
                )
                const toColumn = newColumns.find((col) => col.id === toColumnId)

                if (!fromColumn || !toColumn) return prevColumns

                const cardIndex = fromColumn.cards.findIndex(
                    (c) => c.id === cardId
                )
                if (cardIndex === -1) return prevColumns

                const [card] = fromColumn.cards.splice(cardIndex, 1)
                toColumn.cards.splice(newIndex, 0, card)

                return newColumns
            })
        }

        const handleCardClick = (card: KanbanCard, columnId: string) => {
            alert(`Card clicked: ${card.title} in column: ${columnId}`)
        }

        return (
            <div style={{ height: '100vh' }}>
                <Kanban
                    columns={columns}
                    onCardMove={handleCardMove}
                    onCardClick={handleCardClick}
                />
            </div>
        )
    },
}

export const CollapsibleColumns: Story = {
    render: () => {
        const [columns, setColumns] = useState(sampleColumns)

        const handleCardMove = (
            cardId: string,
            fromColumnId: string,
            toColumnId: string,
            newIndex: number
        ) => {
            setColumns((prevColumns) => {
                const newColumns = [...prevColumns]
                const fromColumn = newColumns.find(
                    (col) => col.id === fromColumnId
                )
                const toColumn = newColumns.find((col) => col.id === toColumnId)

                if (!fromColumn || !toColumn) return prevColumns

                const cardIndex = fromColumn.cards.findIndex(
                    (c) => c.id === cardId
                )
                if (cardIndex === -1) return prevColumns

                const [card] = fromColumn.cards.splice(cardIndex, 1)
                toColumn.cards.splice(newIndex, 0, card)

                return newColumns
            })
        }

        const handleColumnToggle = (columnId: string, collapsed: boolean) => {
            setColumns((prevColumns) =>
                prevColumns.map((col) =>
                    col.id === columnId ? { ...col, collapsed } : col
                )
            )
        }

        return (
            <div style={{ height: '100vh' }}>
                <Kanban
                    columns={columns}
                    onCardMove={handleCardMove}
                    onColumnToggle={handleColumnToggle}
                />
            </div>
        )
    },
}

export const NoDragDrop: Story = {
    render: () => {
        return (
            <div style={{ height: '100vh' }}>
                <Kanban columns={sampleColumns} enableDragDrop={false} />
            </div>
        )
    },
}

export const MinimalCards: Story = {
    render: () => {
        const minimalColumns: KanbanColumn[] = [
            {
                id: 'backlog',
                title: 'Backlog',
                color: '#6b7280',
                cards: [
                    { id: 'c1', title: 'Task 1' },
                    { id: 'c2', title: 'Task 2' },
                    { id: 'c3', title: 'Task 3' },
                ],
            },
            {
                id: 'doing',
                title: 'Doing',
                color: '#408bbd',
                cards: [{ id: 'c4', title: 'Task 4' }],
            },
            {
                id: 'complete',
                title: 'Complete',
                color: '#10b981',
                cards: [],
            },
        ]

        const [columns, setColumns] = useState(minimalColumns)

        const handleCardMove = (
            cardId: string,
            fromColumnId: string,
            toColumnId: string,
            newIndex: number
        ) => {
            setColumns((prevColumns) => {
                const newColumns = [...prevColumns]
                const fromColumn = newColumns.find(
                    (col) => col.id === fromColumnId
                )
                const toColumn = newColumns.find((col) => col.id === toColumnId)

                if (!fromColumn || !toColumn) return prevColumns

                const cardIndex = fromColumn.cards.findIndex(
                    (c) => c.id === cardId
                )
                if (cardIndex === -1) return prevColumns

                const [card] = fromColumn.cards.splice(cardIndex, 1)
                toColumn.cards.splice(newIndex, 0, card)

                return newColumns
            })
        }

        return (
            <div style={{ height: '100vh' }}>
                <Kanban columns={columns} onCardMove={handleCardMove} />
            </div>
        )
    },
}

export const ManyColumns: Story = {
    render: () => {
        const manyColumns: KanbanColumn[] = [
            {
                id: 'col1',
                title: 'Backlog',
                color: '#6b7280',
                cards: [
                    { id: 'c1', title: 'Feature request 1', priority: 'low' },
                    {
                        id: 'c2',
                        title: 'Feature request 2',
                        priority: 'medium',
                    },
                ],
            },
            {
                id: 'col2',
                title: 'Selected',
                color: '#8b5cf6',
                cards: [
                    { id: 'c3', title: 'Priority feature', priority: 'high' },
                ],
            },
            {
                id: 'col3',
                title: 'Design',
                color: '#ec4899',
                cards: [{ id: 'c4', title: 'UI mockups' }],
            },
            {
                id: 'col4',
                title: 'Development',
                color: '#408bbd',
                cards: [{ id: 'c5', title: 'Implement feature' }],
            },
            {
                id: 'col5',
                title: 'Testing',
                color: '#f59e0b',
                cards: [],
            },
            {
                id: 'col6',
                title: 'Ready',
                color: '#84cc16',
                cards: [],
            },
            {
                id: 'col7',
                title: 'Done',
                color: '#10b981',
                cards: [{ id: 'c6', title: 'Completed feature' }],
            },
        ]

        const [columns, setColumns] = useState(manyColumns)

        const handleCardMove = (
            cardId: string,
            fromColumnId: string,
            toColumnId: string,
            newIndex: number
        ) => {
            setColumns((prevColumns) => {
                const newColumns = [...prevColumns]
                const fromColumn = newColumns.find(
                    (col) => col.id === fromColumnId
                )
                const toColumn = newColumns.find((col) => col.id === toColumnId)

                if (!fromColumn || !toColumn) return prevColumns

                const cardIndex = fromColumn.cards.findIndex(
                    (c) => c.id === cardId
                )
                if (cardIndex === -1) return prevColumns

                const [card] = fromColumn.cards.splice(cardIndex, 1)
                toColumn.cards.splice(newIndex, 0, card)

                return newColumns
            })
        }

        return (
            <div style={{ height: '100vh' }}>
                <Kanban
                    columns={columns}
                    onCardMove={handleCardMove}
                    columnMinWidth={240}
                />
            </div>
        )
    },
}
