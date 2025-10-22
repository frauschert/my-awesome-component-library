import React, { useState, useRef, useEffect } from 'react'
import './kanban.scss'
import { classNames } from '../../utility/classnames'

export interface KanbanCard {
    id: string
    title: string
    description?: string
    tags?: string[]
    assignee?: string
    priority?: 'low' | 'medium' | 'high'
    dueDate?: string
    metadata?: Record<string, any>
}

export interface KanbanColumn {
    id: string
    title: string
    cards: KanbanCard[]
    color?: string
    maxCards?: number
    collapsed?: boolean
}

export interface KanbanProps {
    /** Columns with cards */
    columns: KanbanColumn[]
    /** Callback when a card is moved */
    onCardMove?: (
        cardId: string,
        fromColumnId: string,
        toColumnId: string,
        newIndex: number
    ) => void
    /** Callback when a card is clicked */
    onCardClick?: (card: KanbanCard, columnId: string) => void
    /** Callback when column is collapsed/expanded */
    onColumnToggle?: (columnId: string, collapsed: boolean) => void
    /** Custom card renderer */
    renderCard?: (card: KanbanCard, columnId: string) => React.ReactNode
    /** Custom column header renderer */
    renderColumnHeader?: (column: KanbanColumn) => React.ReactNode
    /** Enable drag and drop */
    enableDragDrop?: boolean
    /** Show card count in column header */
    showCardCount?: boolean
    /** Column minimum width */
    columnMinWidth?: number
    /** Additional CSS class */
    className?: string
    /** Additional styles */
    style?: React.CSSProperties
}

interface DragState {
    cardId: string
    columnId: string
    cardIndex: number
}

export const Kanban: React.FC<KanbanProps> = ({
    columns,
    onCardMove,
    onCardClick,
    onColumnToggle,
    renderCard,
    renderColumnHeader,
    enableDragDrop = true,
    showCardCount = true,
    columnMinWidth = 280,
    className,
    style,
}) => {
    const [draggedCard, setDraggedCard] = useState<DragState | null>(null)
    const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
    const dragImageRef = useRef<HTMLDivElement>(null)

    const handleDragStart = (
        e: React.DragEvent,
        card: KanbanCard,
        columnId: string,
        cardIndex: number
    ) => {
        if (!enableDragDrop) return

        setDraggedCard({ cardId: card.id, columnId, cardIndex })

        // Create custom drag image
        if (dragImageRef.current) {
            e.dataTransfer.setDragImage(dragImageRef.current, 0, 0)
        }

        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setData('text/html', card.id)
    }

    const handleDragEnd = () => {
        setDraggedCard(null)
        setDragOverColumn(null)
        setDragOverIndex(null)
    }

    const handleDragOver = (
        e: React.DragEvent,
        columnId: string,
        index?: number
    ) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'

        setDragOverColumn(columnId)
        if (index !== undefined) {
            setDragOverIndex(index)
        }
    }

    const handleDrop = (
        e: React.DragEvent,
        toColumnId: string,
        dropIndex: number
    ) => {
        e.preventDefault()

        if (!draggedCard) return

        const {
            cardId,
            columnId: fromColumnId,
            cardIndex: fromIndex,
        } = draggedCard

        // Don't do anything if dropping in the same position
        if (fromColumnId === toColumnId && fromIndex === dropIndex) {
            handleDragEnd()
            return
        }

        // Calculate the actual new index
        let newIndex = dropIndex
        if (fromColumnId === toColumnId && fromIndex < dropIndex) {
            newIndex = dropIndex - 1
        }

        onCardMove?.(cardId, fromColumnId, toColumnId, newIndex)
        handleDragEnd()
    }

    const handleColumnDragOver = (e: React.DragEvent, columnId: string) => {
        e.preventDefault()
        setDragOverColumn(columnId)

        const column = columns.find((col) => col.id === columnId)
        if (column) {
            setDragOverIndex(column.cards.length)
        }
    }

    const handleColumnDrop = (e: React.DragEvent, columnId: string) => {
        e.preventDefault()

        if (!draggedCard) return

        const column = columns.find((col) => col.id === columnId)
        if (!column) return

        handleDrop(e, columnId, column.cards.length)
    }

    const getPriorityColor = (priority?: 'low' | 'medium' | 'high') => {
        switch (priority) {
            case 'high':
                return '#ef4444'
            case 'medium':
                return '#f59e0b'
            case 'low':
                return '#10b981'
            default:
                return undefined
        }
    }

    const defaultRenderCard = (card: KanbanCard, columnId: string) => (
        <div className="kanban__card-content">
            <div className="kanban__card-header">
                <h4 className="kanban__card-title">{card.title}</h4>
                {card.priority && (
                    <span
                        className={classNames(
                            'kanban__card-priority',
                            `kanban__card-priority--${card.priority}`
                        )}
                        style={{
                            backgroundColor: getPriorityColor(card.priority),
                        }}
                    />
                )}
            </div>
            {card.description && (
                <p className="kanban__card-description">{card.description}</p>
            )}
            {card.tags && card.tags.length > 0 && (
                <div className="kanban__card-tags">
                    {card.tags.map((tag, idx) => (
                        <span key={idx} className="kanban__card-tag">
                            {tag}
                        </span>
                    ))}
                </div>
            )}
            {(card.assignee || card.dueDate) && (
                <div className="kanban__card-footer">
                    {card.assignee && (
                        <div
                            className="kanban__card-assignee"
                            title={card.assignee}
                        >
                            {card.assignee.charAt(0).toUpperCase()}
                        </div>
                    )}
                    {card.dueDate && (
                        <span className="kanban__card-due-date">
                            {card.dueDate}
                        </span>
                    )}
                </div>
            )}
        </div>
    )

    const defaultRenderColumnHeader = (column: KanbanColumn) => (
        <>
            <div className="kanban__column-title-wrapper">
                <h3 className="kanban__column-title">{column.title}</h3>
                {showCardCount && (
                    <span className="kanban__column-count">
                        {column.cards.length}
                    </span>
                )}
            </div>
            {column.maxCards && (
                <span className="kanban__column-max">/ {column.maxCards}</span>
            )}
        </>
    )

    const boardClasses = classNames('kanban', className)

    return (
        <div className={boardClasses} style={style}>
            <div className="kanban__board">
                {columns.map((column) => {
                    const isCollapsed = column.collapsed
                    const isDragOver = dragOverColumn === column.id
                    const isMaxed =
                        column.maxCards &&
                        column.cards.length >= column.maxCards

                    const columnClasses = classNames(
                        'kanban__column',
                        isCollapsed && 'kanban__column--collapsed',
                        isDragOver && 'kanban__column--drag-over',
                        isMaxed && 'kanban__column--maxed'
                    )

                    return (
                        <div
                            key={column.id}
                            className={columnClasses}
                            style={{
                                minWidth: isCollapsed ? 'auto' : columnMinWidth,
                                borderTopColor: column.color,
                            }}
                            onDragOver={(e) =>
                                handleColumnDragOver(e, column.id)
                            }
                            onDrop={(e) => handleColumnDrop(e, column.id)}
                        >
                            <div className="kanban__column-header">
                                <button
                                    type="button"
                                    className="kanban__column-toggle"
                                    onClick={() =>
                                        onColumnToggle?.(
                                            column.id,
                                            !isCollapsed
                                        )
                                    }
                                    aria-label={
                                        isCollapsed
                                            ? 'Expand column'
                                            : 'Collapse column'
                                    }
                                    aria-expanded={!isCollapsed}
                                >
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M6 4L10 8L6 12"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>
                                {renderColumnHeader
                                    ? renderColumnHeader(column)
                                    : defaultRenderColumnHeader(column)}
                            </div>

                            {!isCollapsed && (
                                <div className="kanban__column-content">
                                    {column.cards.map((card, index) => {
                                        const isDragging =
                                            draggedCard?.cardId === card.id &&
                                            draggedCard?.columnId === column.id
                                        const showDropIndicator =
                                            isDragOver &&
                                            dragOverIndex === index &&
                                            !(
                                                draggedCard?.columnId ===
                                                    column.id &&
                                                draggedCard?.cardIndex === index
                                            )

                                        return (
                                            <React.Fragment key={card.id}>
                                                {showDropIndicator && (
                                                    <div className="kanban__drop-indicator" />
                                                )}
                                                <div
                                                    className={classNames(
                                                        'kanban__card',
                                                        isDragging &&
                                                            'kanban__card--dragging'
                                                    )}
                                                    draggable={enableDragDrop}
                                                    onDragStart={(e) =>
                                                        handleDragStart(
                                                            e,
                                                            card,
                                                            column.id,
                                                            index
                                                        )
                                                    }
                                                    onDragEnd={handleDragEnd}
                                                    onDragOver={(e) =>
                                                        handleDragOver(
                                                            e,
                                                            column.id,
                                                            index
                                                        )
                                                    }
                                                    onDrop={(e) =>
                                                        handleDrop(
                                                            e,
                                                            column.id,
                                                            index
                                                        )
                                                    }
                                                    onClick={() =>
                                                        onCardClick?.(
                                                            card,
                                                            column.id
                                                        )
                                                    }
                                                >
                                                    {renderCard
                                                        ? renderCard(
                                                              card,
                                                              column.id
                                                          )
                                                        : defaultRenderCard(
                                                              card,
                                                              column.id
                                                          )}
                                                </div>
                                            </React.Fragment>
                                        )
                                    })}
                                    {isDragOver &&
                                        dragOverIndex ===
                                            column.cards.length && (
                                            <div className="kanban__drop-indicator" />
                                        )}
                                    {column.cards.length === 0 && (
                                        <div className="kanban__column-empty">
                                            Drop cards here
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Hidden drag image */}
            <div
                ref={dragImageRef}
                className="kanban__drag-image"
                style={{ position: 'absolute', top: -1000, left: -1000 }}
            />
        </div>
    )
}

export default Kanban
