import React, { useState, useRef, useCallback, useMemo } from 'react'
import { classNames } from '../../utility/classnames'
import './DataGrid.scss'

export type DataGridColumnPinning = 'left' | 'right' | 'none'

export interface DataGridColumn<T> {
    /**
     * Unique identifier for the column
     */
    id: string
    /**
     * Header text or element
     */
    header: string | React.ReactNode
    /**
     * Accessor function or key
     */
    accessor: keyof T | ((row: T) => unknown)
    /**
     * Column width (pixels)
     */
    width?: number
    /**
     * Minimum width (pixels)
     */
    minWidth?: number
    /**
     * Maximum width (pixels)
     */
    maxWidth?: number
    /**
     * Whether column is resizable
     */
    resizable?: boolean
    /**
     * Whether column is sortable
     */
    sortable?: boolean
    /**
     * Custom cell renderer
     */
    cell?: (value: unknown, row: T, rowIndex: number) => React.ReactNode
    /**
     * Text alignment
     */
    align?: 'left' | 'center' | 'right'
    /**
     * Column pinning
     */
    pinned?: DataGridColumnPinning
    /**
     * Whether column is visible
     */
    visible?: boolean
    /**
     * Whether column is editable
     */
    editable?: boolean
}

export interface DataGridProps<T> {
    /**
     * Data rows
     */
    data: T[]
    /**
     * Column definitions
     */
    columns: DataGridColumn<T>[]
    /**
     * Row key accessor
     */
    getRowId?: (row: T, index: number) => string | number
    /**
     * Enable virtual scrolling
     */
    virtualScroll?: boolean
    /**
     * Row height for virtual scrolling
     */
    rowHeight?: number
    /**
     * Enable column resizing
     */
    resizable?: boolean
    /**
     * Enable column reordering
     */
    reorderable?: boolean
    /**
     * Enable sorting
     */
    sortable?: boolean
    /**
     * Sort state
     */
    sortBy?: { columnId: string; direction: 'asc' | 'desc' }
    /**
     * Sort change handler
     */
    onSortChange?: (
        sortBy: { columnId: string; direction: 'asc' | 'desc' } | null
    ) => void
    /**
     * Column resize handler
     */
    onColumnResize?: (columnId: string, width: number) => void
    /**
     * Column reorder handler
     */
    onColumnReorder?: (columnIds: string[]) => void
    /**
     * Cell edit handler
     */
    onCellEdit?: (
        rowId: string | number,
        columnId: string,
        value: unknown
    ) => void
    /**
     * Container height
     */
    height?: number | string
    /**
     * Sticky header
     */
    stickyHeader?: boolean
    /**
     * Striped rows
     */
    striped?: boolean
    /**
     * Show borders
     */
    bordered?: boolean
    /**
     * Custom className
     */
    className?: string
    /**
     * Loading state
     */
    loading?: boolean
    /**
     * Empty state message
     */
    emptyMessage?: string
}

function DataGrid<T extends Record<string, unknown>>({
    data,
    columns: initialColumns,
    getRowId = (_, index) => index,
    virtualScroll = false,
    rowHeight = 48,
    resizable = true,
    reorderable = true,
    sortable = true,
    sortBy,
    onSortChange,
    onColumnResize,
    onColumnReorder,
    onCellEdit: _onCellEdit,
    height = 600,
    stickyHeader = true,
    striped = true,
    bordered = false,
    className,
    loading = false,
    emptyMessage = 'No data available',
}: DataGridProps<T>) {
    const [columns, setColumns] = useState(initialColumns)
    const [columnWidths, setColumnWidths] = useState<Record<string, number>>({})
    const [resizingColumn, setResizingColumn] = useState<string | null>(null)
    const [draggedColumn, setDraggedColumn] = useState<string | null>(null)
    const [scrollTop, setScrollTop] = useState(0)
    const [internalSortBy, setInternalSortBy] = useState<{
        columnId: string
        direction: 'asc' | 'desc'
    } | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const headerRef = useRef<HTMLDivElement>(null)
    const bodyRef = useRef<HTMLDivElement>(null)
    const resizeStartX = useRef<number>(0)
    const resizeStartWidth = useRef<number>(0)

    // Use controlled or uncontrolled sort state
    const activeSortBy = sortBy !== undefined ? sortBy : internalSortBy

    // Get visible columns
    const visibleColumns = useMemo(
        () => columns.filter((col) => col.visible !== false),
        [columns]
    )

    // Separate pinned columns
    const { leftColumns, centerColumns, rightColumns } = useMemo(() => {
        const left = visibleColumns.filter((col) => col.pinned === 'left')
        const right = visibleColumns.filter((col) => col.pinned === 'right')
        const center = visibleColumns.filter(
            (col) => !col.pinned || col.pinned === 'none'
        )
        return { leftColumns: left, centerColumns: center, rightColumns: right }
    }, [visibleColumns])

    // Sorted data
    const sortedData = useMemo(() => {
        if (!activeSortBy) return data

        const column = columns.find((col) => col.id === activeSortBy.columnId)
        if (!column) return data

        return [...data].sort((a, b) => {
            let aValue: unknown
            let bValue: unknown

            if (typeof column.accessor === 'function') {
                aValue = column.accessor(a)
                bValue = column.accessor(b)
            } else {
                aValue = a[column.accessor]
                bValue = b[column.accessor]
            }

            if (aValue === bValue) return 0

            const comparison =
                (aValue as string | number) > (bValue as string | number)
                    ? 1
                    : -1
            return activeSortBy.direction === 'asc' ? comparison : -comparison
        })
    }, [data, activeSortBy, columns])

    // Virtual scrolling calculations
    const visibleRowCount = virtualScroll
        ? Math.ceil((typeof height === 'number' ? height : 600) / rowHeight) + 1
        : sortedData.length

    const startIndex = virtualScroll ? Math.floor(scrollTop / rowHeight) : 0
    const endIndex = Math.min(startIndex + visibleRowCount, sortedData.length)
    const visibleData = sortedData.slice(startIndex, endIndex)
    const totalHeight = sortedData.length * rowHeight
    const offsetY = startIndex * rowHeight

    // Handlers
    const handleSort = (columnId: string) => {
        if (!sortable) return

        const column = columns.find((col) => col.id === columnId)
        if (!column?.sortable) return

        let newSortBy: { columnId: string; direction: 'asc' | 'desc' } | null =
            null

        if (!activeSortBy || activeSortBy.columnId !== columnId) {
            newSortBy = { columnId, direction: 'asc' }
        } else if (activeSortBy.direction === 'asc') {
            newSortBy = { columnId, direction: 'desc' }
        } else {
            newSortBy = null
        }

        if (onSortChange) {
            onSortChange(newSortBy)
        } else {
            setInternalSortBy(newSortBy)
        }
    }

    const handleResizeStart = (columnId: string, e: React.MouseEvent) => {
        if (!resizable) return

        e.preventDefault()
        setResizingColumn(columnId)

        const column = columns.find((col) => col.id === columnId)
        resizeStartX.current = e.clientX
        resizeStartWidth.current =
            columnWidths[columnId] || column?.width || 150
    }

    const handleResizeMove = useCallback(
        (e: MouseEvent) => {
            if (!resizingColumn) return

            const delta = e.clientX - resizeStartX.current
            const newWidth = Math.max(50, resizeStartWidth.current + delta)

            setColumnWidths((prev) => ({ ...prev, [resizingColumn]: newWidth }))
            onColumnResize?.(resizingColumn, newWidth)
        },
        [resizingColumn, onColumnResize]
    )

    const handleResizeEnd = useCallback(() => {
        setResizingColumn(null)
    }, [])

    React.useEffect(() => {
        if (resizingColumn) {
            document.addEventListener('mousemove', handleResizeMove)
            document.addEventListener('mouseup', handleResizeEnd)
            return () => {
                document.removeEventListener('mousemove', handleResizeMove)
                document.removeEventListener('mouseup', handleResizeEnd)
            }
        }
    }, [resizingColumn, handleResizeMove, handleResizeEnd])

    // Sync scrollbar width to header padding
    React.useEffect(() => {
        const updateScrollbarWidth = () => {
            if (bodyRef.current && headerRef.current) {
                const scrollbarWidth =
                    bodyRef.current.offsetWidth - bodyRef.current.clientWidth
                headerRef.current.style.paddingRight = `${scrollbarWidth}px`
            }
        }

        updateScrollbarWidth()
        // Update on window resize and data changes
        window.addEventListener('resize', updateScrollbarWidth)
        return () => window.removeEventListener('resize', updateScrollbarWidth)
    }, [sortedData.length, height])

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget
        if (virtualScroll) {
            setScrollTop(target.scrollTop)
        }
        // Sync header horizontal scroll
        if (headerRef.current) {
            headerRef.current.scrollLeft = target.scrollLeft
        }
    }

    const handleDragStart = (columnId: string) => {
        if (!reorderable) return
        setDraggedColumn(columnId)
    }

    const handleDragOver = (e: React.DragEvent, columnId: string) => {
        e.preventDefault()
        if (!draggedColumn || draggedColumn === columnId) return

        const newColumns = [...columns]
        const draggedIndex = newColumns.findIndex(
            (col) => col.id === draggedColumn
        )
        const targetIndex = newColumns.findIndex((col) => col.id === columnId)

        const [draggedItem] = newColumns.splice(draggedIndex, 1)
        newColumns.splice(targetIndex, 0, draggedItem)

        setColumns(newColumns)
        onColumnReorder?.(newColumns.map((col) => col.id))
    }

    const handleDragEnd = () => {
        setDraggedColumn(null)
    }

    const getCellValue = (row: T, column: DataGridColumn<T>) => {
        if (typeof column.accessor === 'function') {
            return column.accessor(row)
        }
        return row[column.accessor]
    }

    const renderCell = (
        row: T,
        column: DataGridColumn<T>,
        rowIndex: number
    ) => {
        const value = getCellValue(row, column)
        if (column.cell) {
            return column.cell(value, row, rowIndex)
        }
        return value?.toString() || ''
    }

    const renderColumnGroup = (
        cols: DataGridColumn<T>[],
        isPinned: boolean = false
    ) => {
        return cols.map((column) => {
            const width = columnWidths[column.id] || column.width || 150
            const sortDirection =
                activeSortBy?.columnId === column.id
                    ? activeSortBy.direction
                    : undefined

            return (
                <div
                    key={column.id}
                    className={classNames('datagrid__column', {
                        'datagrid__column--pinned': isPinned,
                        'datagrid__column--resizing':
                            resizingColumn === column.id,
                    })}
                    style={{
                        width,
                        minWidth: column.minWidth,
                        maxWidth: column.maxWidth,
                    }}
                >
                    <div
                        role="columnheader"
                        aria-sort={
                            sortDirection
                                ? sortDirection === 'asc'
                                    ? 'ascending'
                                    : 'descending'
                                : undefined
                        }
                        className={classNames('datagrid__header-cell', {
                            'datagrid__header-cell--sortable':
                                column.sortable && sortable,
                            'datagrid__header-cell--sorted': !!sortDirection,
                        })}
                        onClick={() => handleSort(column.id)}
                        draggable={reorderable}
                        onDragStart={() => handleDragStart(column.id)}
                        onDragOver={(e) => handleDragOver(e, column.id)}
                        onDragEnd={handleDragEnd}
                    >
                        <span className="datagrid__header-text">
                            {column.header}
                        </span>
                        {sortDirection && (
                            <span className="datagrid__sort-icon">
                                {sortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                        )}
                    </div>
                    {column.resizable !== false && resizable && (
                        <div
                            className="datagrid__resize-handle"
                            onMouseDown={(e) => handleResizeStart(column.id, e)}
                        />
                    )}
                </div>
            )
        })
    }

    return (
        <div
            ref={containerRef}
            role="table"
            className={classNames('datagrid', className, {
                'datagrid--bordered': bordered,
                'datagrid--striped': striped,
            })}
            style={{ height }}
        >
            {/* Header */}
            <div
                ref={headerRef}
                className={classNames('datagrid__header', {
                    'datagrid__header--sticky': stickyHeader,
                })}
            >
                <div className="datagrid__header-row" role="row">
                    {leftColumns.length > 0 && (
                        <div className="datagrid__pinned-left">
                            {renderColumnGroup(leftColumns, true)}
                        </div>
                    )}
                    <div className="datagrid__center">
                        {renderColumnGroup(centerColumns)}
                    </div>
                    {rightColumns.length > 0 && (
                        <div className="datagrid__pinned-right">
                            {renderColumnGroup(rightColumns, true)}
                        </div>
                    )}
                </div>
            </div>

            {/* Body */}
            <div
                ref={bodyRef}
                className="datagrid__body"
                onScroll={handleScroll}
            >
                {loading ? (
                    <div className="datagrid__loading">Loading...</div>
                ) : sortedData.length === 0 ? (
                    <div className="datagrid__empty">{emptyMessage}</div>
                ) : (
                    <div
                        className="datagrid__viewport"
                        style={
                            virtualScroll ? { height: totalHeight } : undefined
                        }
                    >
                        <div
                            className="datagrid__rows"
                            style={
                                virtualScroll
                                    ? { transform: `translateY(${offsetY}px)` }
                                    : undefined
                            }
                        >
                            {visibleData.map((row, index) => {
                                const rowId = getRowId(row, startIndex + index)
                                return (
                                    <div
                                        key={rowId}
                                        data-row-id={rowId}
                                        role="row"
                                        className="datagrid__row"
                                        style={
                                            virtualScroll
                                                ? { height: rowHeight }
                                                : undefined
                                        }
                                    >
                                        {leftColumns.length > 0 && (
                                            <div className="datagrid__pinned-left">
                                                {leftColumns.map((column) => {
                                                    const width =
                                                        columnWidths[
                                                            column.id
                                                        ] ||
                                                        column.width ||
                                                        150
                                                    return (
                                                        <div
                                                            key={column.id}
                                                            className="datagrid__cell"
                                                            style={{
                                                                width,
                                                                textAlign:
                                                                    column.align,
                                                            }}
                                                        >
                                                            {renderCell(
                                                                row,
                                                                column,
                                                                startIndex +
                                                                    index
                                                            )}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        )}
                                        <div className="datagrid__center">
                                            {centerColumns.map((column) => {
                                                const width =
                                                    columnWidths[column.id] ||
                                                    column.width ||
                                                    150
                                                return (
                                                    <div
                                                        key={column.id}
                                                        role="cell"
                                                        className="datagrid__cell"
                                                        style={{
                                                            width,
                                                            textAlign:
                                                                column.align,
                                                        }}
                                                    >
                                                        {renderCell(
                                                            row,
                                                            column,
                                                            startIndex + index
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        {rightColumns.length > 0 && (
                                            <div className="datagrid__pinned-right">
                                                {rightColumns.map((column) => {
                                                    const width =
                                                        columnWidths[
                                                            column.id
                                                        ] ||
                                                        column.width ||
                                                        150
                                                    return (
                                                        <div
                                                            key={column.id}
                                                            role="cell"
                                                            className="datagrid__cell"
                                                            style={{
                                                                width,
                                                                textAlign:
                                                                    column.align,
                                                            }}
                                                        >
                                                            {renderCell(
                                                                row,
                                                                column,
                                                                startIndex +
                                                                    index
                                                            )}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default DataGrid
