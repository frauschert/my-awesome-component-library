import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Kanban, KanbanColumn } from './Kanban'

const sampleColumns: KanbanColumn[] = [
    {
        id: 'todo',
        title: 'To Do',
        cards: [
            {
                id: 'card-1',
                title: 'Task 1',
                description: 'Description 1',
                tags: ['tag1', 'tag2'],
                priority: 'high',
                assignee: 'John Doe',
                dueDate: '2025-10-30',
            },
            {
                id: 'card-2',
                title: 'Task 2',
            },
        ],
    },
    {
        id: 'done',
        title: 'Done',
        cards: [],
    },
]

describe('Kanban', () => {
    describe('Rendering', () => {
        it('should render all columns', () => {
            render(<Kanban columns={sampleColumns} />)
            expect(screen.getByText('To Do')).toBeInTheDocument()
            expect(screen.getByText('Done')).toBeInTheDocument()
        })

        it('should render all cards', () => {
            render(<Kanban columns={sampleColumns} />)
            expect(screen.getByText('Task 1')).toBeInTheDocument()
            expect(screen.getByText('Task 2')).toBeInTheDocument()
        })

        it('should render card details', () => {
            render(<Kanban columns={sampleColumns} />)
            expect(screen.getByText('Description 1')).toBeInTheDocument()
            expect(screen.getByText('tag1')).toBeInTheDocument()
            expect(screen.getByText('tag2')).toBeInTheDocument()
            expect(screen.getByText('2025-10-30')).toBeInTheDocument()
        })

        it('should render card count when showCardCount is true', () => {
            render(<Kanban columns={sampleColumns} showCardCount={true} />)
            expect(screen.getByText('2')).toBeInTheDocument()
            expect(screen.getByText('0')).toBeInTheDocument()
        })

        it('should not render card count when showCardCount is false', () => {
            render(<Kanban columns={sampleColumns} showCardCount={false} />)
            const counts = screen.queryAllByText(/^\d+$/)
            expect(counts.length).toBe(0)
        })

        it('should render empty state for columns with no cards', () => {
            render(<Kanban columns={sampleColumns} />)
            expect(screen.getByText('Drop cards here')).toBeInTheDocument()
        })

        it('should apply custom className', () => {
            const { container } = render(
                <Kanban columns={sampleColumns} className="custom-class" />
            )
            expect(container.querySelector('.kanban')).toHaveClass(
                'custom-class'
            )
        })
    })

    describe('Card Priority', () => {
        it('should render priority indicator for high priority', () => {
            const { container } = render(<Kanban columns={sampleColumns} />)
            const priorityIndicator = container.querySelector(
                '.kanban__card-priority--high'
            )
            expect(priorityIndicator).toBeInTheDocument()
        })

        it('should render priority indicators for different levels', () => {
            const columns: KanbanColumn[] = [
                {
                    id: 'col',
                    title: 'Column',
                    cards: [
                        { id: '1', title: 'Low', priority: 'low' },
                        { id: '2', title: 'Medium', priority: 'medium' },
                        { id: '3', title: 'High', priority: 'high' },
                    ],
                },
            ]
            const { container } = render(<Kanban columns={columns} />)
            expect(
                container.querySelector('.kanban__card-priority--low')
            ).toBeInTheDocument()
            expect(
                container.querySelector('.kanban__card-priority--medium')
            ).toBeInTheDocument()
            expect(
                container.querySelector('.kanban__card-priority--high')
            ).toBeInTheDocument()
        })
    })

    describe('Card Assignee', () => {
        it('should render assignee initials', () => {
            render(<Kanban columns={sampleColumns} />)
            expect(screen.getByText('J')).toBeInTheDocument()
        })

        it('should have title attribute with full name', () => {
            render(<Kanban columns={sampleColumns} />)
            const assignee = screen.getByTitle('John Doe')
            expect(assignee).toBeInTheDocument()
        })
    })

    describe('Card Click', () => {
        it('should call onCardClick when card is clicked', () => {
            const handleCardClick = jest.fn()
            render(
                <Kanban columns={sampleColumns} onCardClick={handleCardClick} />
            )

            const card = screen.getByText('Task 1').closest('.kanban__card')
            fireEvent.click(card!)

            expect(handleCardClick).toHaveBeenCalledTimes(1)
            expect(handleCardClick).toHaveBeenCalledWith(
                sampleColumns[0].cards[0],
                'todo'
            )
        })
    })

    describe('Column Collapse', () => {
        it('should render collapse toggle button', () => {
            render(<Kanban columns={sampleColumns} />)
            const toggleButtons = screen.getAllByLabelText(
                /Expand column|Collapse column/
            )
            expect(toggleButtons.length).toBeGreaterThan(0)
        })

        it('should call onColumnToggle when toggle button is clicked', () => {
            const handleColumnToggle = jest.fn()
            render(
                <Kanban
                    columns={sampleColumns}
                    onColumnToggle={handleColumnToggle}
                />
            )

            const toggleButton = screen.getAllByLabelText('Collapse column')[0]
            fireEvent.click(toggleButton)

            expect(handleColumnToggle).toHaveBeenCalledWith('todo', true)
        })

        it('should hide cards when column is collapsed', () => {
            const collapsedColumns: KanbanColumn[] = [
                { ...sampleColumns[0], collapsed: true },
                sampleColumns[1],
            ]
            render(<Kanban columns={collapsedColumns} />)

            expect(screen.queryByText('Task 1')).not.toBeInTheDocument()
            expect(screen.queryByText('Task 2')).not.toBeInTheDocument()
        })

        it('should show collapse button label correctly', () => {
            const collapsedColumns: KanbanColumn[] = [
                { ...sampleColumns[0], collapsed: true },
            ]
            render(<Kanban columns={collapsedColumns} />)

            expect(screen.getByLabelText('Expand column')).toBeInTheDocument()
        })
    })

    describe('Column Max Cards', () => {
        it('should render max cards indicator', () => {
            const columnsWithMax: KanbanColumn[] = [
                { ...sampleColumns[0], maxCards: 5 },
            ]
            render(<Kanban columns={columnsWithMax} />)
            expect(screen.getByText('/ 5')).toBeInTheDocument()
        })

        it('should apply maxed class when at capacity', () => {
            const columnsWithMax: KanbanColumn[] = [
                { ...sampleColumns[0], maxCards: 2 },
            ]
            const { container } = render(<Kanban columns={columnsWithMax} />)
            const column = container.querySelector('.kanban__column--maxed')
            expect(column).toBeInTheDocument()
        })
    })

    describe('Custom Renderers', () => {
        it('should use custom card renderer', () => {
            const renderCard = jest.fn(() => <div>Custom Card</div>)
            render(<Kanban columns={sampleColumns} renderCard={renderCard} />)

            expect(screen.getAllByText('Custom Card').length).toBe(2)
            expect(renderCard).toHaveBeenCalledWith(
                sampleColumns[0].cards[0],
                'todo'
            )
        })

        it('should use custom column header renderer', () => {
            const renderColumnHeader = jest.fn(() => <div>Custom Header</div>)
            render(
                <Kanban
                    columns={sampleColumns}
                    renderColumnHeader={renderColumnHeader}
                />
            )

            expect(screen.getAllByText('Custom Header').length).toBe(2)
            expect(renderColumnHeader).toHaveBeenCalledWith(sampleColumns[0])
        })
    })

    describe('Drag and Drop', () => {
        it('should make cards draggable when enableDragDrop is true', () => {
            const { container } = render(
                <Kanban columns={sampleColumns} enableDragDrop={true} />
            )
            const cards = container.querySelectorAll('.kanban__card')
            cards.forEach((card) => {
                expect(card).toHaveAttribute('draggable', 'true')
            })
        })

        it('should not make cards draggable when enableDragDrop is false', () => {
            const { container } = render(
                <Kanban columns={sampleColumns} enableDragDrop={false} />
            )
            const cards = container.querySelectorAll('.kanban__card')
            cards.forEach((card) => {
                expect(card).toHaveAttribute('draggable', 'false')
            })
        })

        it('should call onCardMove when drag and drop completes', () => {
            const handleCardMove = jest.fn()
            const { container } = render(
                <Kanban
                    columns={sampleColumns}
                    onCardMove={handleCardMove}
                    enableDragDrop={true}
                />
            )

            const cards = container.querySelectorAll('.kanban__card')
            const firstCard = cards[0]

            fireEvent.dragStart(firstCard, {
                dataTransfer: {
                    effectAllowed: 'move',
                    setData: jest.fn(),
                    setDragImage: jest.fn(),
                },
            })

            fireEvent.dragOver(firstCard, {
                dataTransfer: { dropEffect: 'move' },
            })

            fireEvent.drop(firstCard, {
                dataTransfer: { getData: () => 'card-1' },
            })

            // Should be called after drop
            expect(handleCardMove).toHaveBeenCalled()
        })
    })

    describe('Column Colors', () => {
        it('should apply custom column color', () => {
            const columnsWithColor: KanbanColumn[] = [
                { ...sampleColumns[0], color: '#ff0000' },
            ]
            const { container } = render(<Kanban columns={columnsWithColor} />)
            const column = container.querySelector('.kanban__column')
            expect(column).toHaveStyle({ borderTopColor: '#ff0000' })
        })
    })

    describe('Column Min Width', () => {
        it('should apply custom column min width', () => {
            const { container } = render(
                <Kanban columns={sampleColumns} columnMinWidth={350} />
            )
            const column = container.querySelector('.kanban__column')
            expect(column).toHaveStyle({ minWidth: '350px' })
        })
    })

    describe('Accessibility', () => {
        it('should have proper aria labels on toggle buttons', () => {
            render(<Kanban columns={sampleColumns} />)
            expect(screen.getAllByLabelText('Collapse column')).toHaveLength(2)
        })

        it('should have aria-expanded attribute on toggle buttons', () => {
            render(<Kanban columns={sampleColumns} />)
            const toggleButtons = screen.getAllByLabelText('Collapse column')
            toggleButtons.forEach((button) => {
                expect(button).toHaveAttribute('aria-expanded', 'true')
            })
        })
    })
})
