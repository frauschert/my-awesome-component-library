import React, {
    createContext,
    useContext,
    useState,
    useRef,
    useCallback,
    useEffect,
} from 'react'
import './DragDrop.scss'

// Context for drag state
type DragContextValue<T = unknown> = {
    draggedItem: T | null
    draggedIndex: number | null
    draggedFrom: string | null
    setDraggedItem: (item: T | null) => void
    setDraggedIndex: (index: number | null) => void
    setDraggedFrom: (from: string | null) => void
}

const DragContext = createContext<DragContextValue<unknown> | null>(null)

const useDragContext = <T = unknown,>() => {
    const context = useContext(DragContext) as DragContextValue<T> | null
    if (!context) {
        throw new Error('Drag components must be used within DragDropProvider')
    }
    return context
}

// Provider
export type DragDropProviderProps = {
    children: React.ReactNode
}

export const DragDropProvider = ({ children }: DragDropProviderProps) => {
    const [draggedItem, setDraggedItem] = useState<unknown>(null)
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
    const [draggedFrom, setDraggedFrom] = useState<string | null>(null)

    return (
        <DragContext.Provider
            value={
                {
                    draggedItem,
                    draggedIndex,
                    draggedFrom,
                    setDraggedItem,
                    setDraggedIndex,
                    setDraggedFrom,
                } as DragContextValue<unknown>
            }
        >
            {children}
        </DragContext.Provider>
    )
}

// Draggable Component
export type DraggableProps<T = unknown> = {
    children: React.ReactNode
    data: T
    index?: number
    disabled?: boolean
    handle?: boolean
    className?: string
    onDragStart?: (data: T, index?: number) => void
    onDragEnd?: (data: T, index?: number) => void
}

export const Draggable = <T = unknown,>({
    children,
    data,
    index,
    disabled = false,
    handle = false,
    className = '',
    onDragStart,
    onDragEnd,
}: DraggableProps<T>) => {
    const context = useDragContext<T>()
    const [isDragging, setIsDragging] = useState(false)
    const dragRef = useRef<HTMLDivElement>(null)

    const handleDragStart = useCallback(
        (e: React.DragEvent) => {
            if (disabled) return

            setIsDragging(true)
            context.setDraggedItem(data)
            context.setDraggedIndex(index ?? null)

            if (e.dataTransfer) {
                e.dataTransfer.effectAllowed = 'move'
                e.dataTransfer.setData('text/plain', JSON.stringify(data))
            }

            onDragStart?.(data, index)
        },
        [data, index, disabled, context, onDragStart]
    )

    const handleDragEnd = useCallback(
        (_e: React.DragEvent) => {
            setIsDragging(false)
            onDragEnd?.(data, index)
        },
        [data, index, onDragEnd]
    )

    const draggableClasses = [
        'draggable',
        className,
        isDragging && 'draggable--dragging',
        disabled && 'draggable--disabled',
        handle && 'draggable--handle',
    ]
        .filter(Boolean)
        .join(' ')

    return (
        <div
            ref={dragRef}
            className={draggableClasses}
            draggable={!disabled && !handle}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            {children}
        </div>
    )
}

// Drop Zone Component
export type DropZoneProps<T = unknown> = {
    children: React.ReactNode
    onDrop: (data: T, index?: number) => void
    accept?: string[]
    id?: string
    className?: string
    disabled?: boolean
    showDropIndicator?: boolean
    style?: React.CSSProperties
}

export const DropZone = <T = unknown,>({
    children,
    onDrop,
    accept,
    id,
    className = '',
    disabled = false,
    showDropIndicator = true,
    style,
}: DropZoneProps<T>) => {
    const context = useDragContext<T>()
    const [isOver, setIsOver] = useState(false)
    const [canDrop, setCanDrop] = useState(true)

    const handleDragOver = useCallback(
        (e: React.DragEvent) => {
            if (disabled) return
            e.preventDefault()
            e.stopPropagation()
            if (e.dataTransfer) {
                e.dataTransfer.dropEffect = 'move'
            }
        },
        [disabled]
    )

    const handleDragEnter = useCallback(
        (e: React.DragEvent) => {
            if (disabled) return
            e.preventDefault()
            e.stopPropagation()
            setIsOver(true)

            // Check if the dragged item is acceptable
            if (accept && context.draggedItem) {
                const item = context.draggedItem as Record<string, unknown>
                const itemType = item.type as string
                setCanDrop(accept.includes(itemType))
            }
        },
        [disabled, accept, context.draggedItem]
    )

    const handleDragLeave = useCallback(
        (e: React.DragEvent) => {
            if (disabled) return
            e.preventDefault()
            e.stopPropagation()
            setIsOver(false)
        },
        [disabled]
    )

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            if (disabled || !canDrop) return
            e.preventDefault()
            e.stopPropagation()
            setIsOver(false)

            const data =
                context.draggedItem ??
                (JSON.parse(e.dataTransfer.getData('text/plain')) as T)
            const index = context.draggedIndex

            onDrop(data, index ?? undefined)
        },
        [disabled, canDrop, context.draggedItem, context.draggedIndex, onDrop]
    )

    const dropZoneClasses = [
        'drop-zone',
        className,
        isOver && 'drop-zone--over',
        isOver && !canDrop && 'drop-zone--reject',
        disabled && 'drop-zone--disabled',
    ]
        .filter(Boolean)
        .join(' ')

    return (
        <div
            className={dropZoneClasses}
            style={style}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            data-dropzone-id={id}
        >
            {children}
            {showDropIndicator && isOver && canDrop && (
                <div className="drop-zone__indicator">Drop here</div>
            )}
        </div>
    )
}

// Sortable List Component
export type SortableItem = {
    id: string | number
    [key: string]: unknown
}

export type SortableListProps<T extends SortableItem> = {
    items: T[]
    onReorder: (items: T[]) => void
    renderItem: (item: T, index: number) => React.ReactNode
    className?: string
    disabled?: boolean
    showHandle?: boolean
}

export const SortableList = <T extends SortableItem>({
    items,
    onReorder,
    renderItem,
    className = '',
    disabled = false,
    showHandle = false,
}: SortableListProps<T>) => {
    const [localItems, setLocalItems] = useState(items)
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

    useEffect(() => {
        setLocalItems(items)
    }, [items])

    const handleDragStart = useCallback((index: number) => {
        setDraggedIndex(index)
    }, [])

    const handleDragEnd = useCallback(() => {
        setDraggedIndex(null)
        setDragOverIndex(null)
    }, [])

    const handleDragOver = useCallback(
        (e: React.DragEvent, index: number) => {
            if (disabled) return
            e.preventDefault()
            setDragOverIndex(index)
        },
        [disabled]
    )

    const handleDrop = useCallback(
        (e: React.DragEvent, dropIndex: number) => {
            if (disabled || draggedIndex === null) return
            e.preventDefault()

            const newItems = [...localItems]
            const [draggedItem] = newItems.splice(draggedIndex, 1)
            newItems.splice(dropIndex, 0, draggedItem)

            setLocalItems(newItems)
            onReorder(newItems)
            setDraggedIndex(null)
            setDragOverIndex(null)
        },
        [disabled, draggedIndex, localItems, onReorder]
    )

    const sortableClasses = [
        'sortable-list',
        className,
        disabled && 'sortable-list--disabled',
    ]
        .filter(Boolean)
        .join(' ')

    return (
        <div className={sortableClasses}>
            {localItems.map((item, index) => {
                const isDragging = draggedIndex === index
                const isOver = dragOverIndex === index

                const itemClasses = [
                    'sortable-list__item',
                    isDragging && 'sortable-list__item--dragging',
                    isOver && 'sortable-list__item--over',
                ]
                    .filter(Boolean)
                    .join(' ')

                return (
                    <div
                        key={item.id}
                        className={itemClasses}
                        draggable={!disabled}
                        onDragStart={() => handleDragStart(index)}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDrop={(e) => handleDrop(e, index)}
                    >
                        {showHandle && (
                            <div
                                className="sortable-list__handle"
                                aria-label="Drag handle"
                            >
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                >
                                    <circle cx="4" cy="4" r="1.5" />
                                    <circle cx="4" cy="8" r="1.5" />
                                    <circle cx="4" cy="12" r="1.5" />
                                    <circle cx="12" cy="4" r="1.5" />
                                    <circle cx="12" cy="8" r="1.5" />
                                    <circle cx="12" cy="12" r="1.5" />
                                </svg>
                            </div>
                        )}
                        <div className="sortable-list__content">
                            {renderItem(item, index)}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

// Drag Handle Component (for use with Draggable handle mode)
export type DragHandleProps = {
    children?: React.ReactNode
    className?: string
}

export const DragHandle: React.FC<DragHandleProps> = ({
    children,
    className = '',
}) => {
    return (
        <div className={`drag-handle ${className}`} draggable={true}>
            {children || (
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                >
                    <circle cx="4" cy="4" r="1.5" />
                    <circle cx="4" cy="8" r="1.5" />
                    <circle cx="4" cy="12" r="1.5" />
                    <circle cx="12" cy="4" r="1.5" />
                    <circle cx="12" cy="8" r="1.5" />
                    <circle cx="12" cy="12" r="1.5" />
                </svg>
            )}
        </div>
    )
}
