import React from 'react'

export type RowDefinitionType<T> = {
    id: string | number
    data: T
    selected?: boolean
    expanded?: boolean
    disabled?: boolean
}

export type CellRenderer<T, K extends keyof T> = (
    value: T[K],
    row: RowDefinitionType<T>,
    column: ColumnDefinitionType<T, K>
) => React.ReactNode

export type ColumnDefinitionType<T, K extends keyof T> = {
    key: K
    header: string | React.ReactNode
    width?: number
    minWidth?: number
    maxWidth?: number
    sortable?: boolean
    searchable?: boolean
    resizable?: boolean
    align?: 'left' | 'center' | 'right'
    render?: CellRenderer<T, K>
    headerRender?: () => React.ReactNode
}

export type SortConfig<T, K extends keyof T> = {
    sortKey: K | undefined
    sortDirection: 'ascending' | 'descending' | undefined
}

export type PaginationConfig = {
    page: number
    pageSize: number
    totalRows: number
}

export type SelectionMode = 'none' | 'single' | 'multiple'

export type RowAction<T> = {
    label: string
    icon?: React.ReactNode
    onClick: (row: RowDefinitionType<T>) => void
    disabled?: (row: RowDefinitionType<T>) => boolean
    hidden?: (row: RowDefinitionType<T>) => boolean
}

export type BulkAction<T> = {
    label: string
    icon?: React.ReactNode
    onClick: (rows: RowDefinitionType<T>[]) => void
    disabled?: (rows: RowDefinitionType<T>[]) => boolean
}

export type TableProps<T, K extends keyof T> = {
    // Data
    rowDefinitions: RowDefinitionType<T>[]
    columnDefinitions: ColumnDefinitionType<T, K>[]

    // Sorting
    sortConfig?: SortConfig<T, K>
    onSortChange?: (config: SortConfig<T, K>) => void
    sortable?: boolean

    // Pagination
    pagination?: PaginationConfig
    onPaginationChange?: (config: PaginationConfig) => void

    // Selection
    selectionMode?: SelectionMode
    selectedRows?: Array<string | number>
    onSelectionChange?: (selectedIds: Array<string | number>) => void

    // Search
    searchString?: string
    onSearchChange?: (search: string) => void
    searchable?: boolean
    searchPlaceholder?: string

    // Row Actions
    rowActions?: RowAction<T>[]
    onRowClick?: (row: RowDefinitionType<T>) => void
    onRowDoubleClick?: (row: RowDefinitionType<T>) => void

    // Bulk Actions
    bulkActions?: BulkAction<T>[]

    // Expandable Rows
    expandable?: boolean
    renderExpandedRow?: (row: RowDefinitionType<T>) => React.ReactNode
    onExpandChange?: (expandedIds: Array<string | number>) => void

    // States
    loading?: boolean
    loadingMessage?: string
    emptyMessage?: string
    error?: string

    // Styling
    className?: string
    classNameTable?: string
    stickyHeader?: boolean
    striped?: boolean
    hoverable?: boolean
    bordered?: boolean
    compact?: boolean

    // Accessibility
    ariaLabel?: string
    ariaDescribedBy?: string
}

export type TableHeaderProps<T, K extends keyof T> = {
    columnDefinitions: ColumnDefinitionType<T, K>[]
    sortConfig: SortConfig<T, K>
    onSortClick: (value: K) => void
    selectionMode: SelectionMode
    allSelected: boolean
    someSelected: boolean
    onSelectAll: () => void
    hasRowActions: boolean
    expandable: boolean
    onColumnResize?: (key: K, width: number) => void
}

export type TableRowProps<T, K extends keyof T> = {
    rowDefinitions: RowDefinitionType<T>[]
    columnDefinitions: ColumnDefinitionType<T, K>[]
    selectedRows: Array<string | number>
    expandedRows: Array<string | number>
    selectionMode: SelectionMode
    onRowSelect: (id: string | number) => void
    onRowClick?: (row: RowDefinitionType<T>) => void
    onRowDoubleClick?: (row: RowDefinitionType<T>) => void
    rowActions?: RowAction<T>[]
    expandable: boolean
    renderExpandedRow?: (row: RowDefinitionType<T>) => React.ReactNode
    onExpandToggle: (id: string | number) => void
    hoverable: boolean
}
