import React, { useState, useMemo, useCallback } from 'react'
import TableHeader from './TableHeader'
import TableRows from './TableRows'
import { SortConfig, TableProps, PaginationConfig } from './types'
import { classNames } from '../../utility/classnames'
import { useTheme } from '../Theme'
import './table.scss'
import {
    tableSearch,
    tableSort,
    paginateRows,
    getTotalPages,
    getPageRange,
} from './utils'

function Table<T, K extends keyof T>({
    // Data
    rowDefinitions,
    columnDefinitions,

    // Sorting
    sortConfig: externalSortConfig,
    onSortChange,
    sortable = true,

    // Pagination
    pagination: externalPagination,
    onPaginationChange,

    // Selection
    selectionMode = 'none',
    selectedRows: externalSelectedRows,
    onSelectionChange,

    // Search
    searchString: externalSearchString,
    onSearchChange,
    searchable = true,
    searchPlaceholder = 'Search...',

    // Row Actions
    rowActions,
    onRowClick,
    onRowDoubleClick,

    // Bulk Actions
    bulkActions,

    // Expandable Rows
    expandable = false,
    renderExpandedRow,
    onExpandChange,

    // States
    loading = false,
    loadingMessage = 'Loading...',
    emptyMessage = 'No data available',
    error,

    // Styling
    className,
    classNameTable,
    stickyHeader = false,
    striped = true,
    hoverable = true,
    bordered = false,
    compact = false,

    // Accessibility
    ariaLabel = 'Data table',
    ariaDescribedBy,
}: TableProps<T, K>) {
    const [{ theme }] = useTheme()

    // Internal state for uncontrolled mode
    const [internalSortConfig, setInternalSortConfig] = useState<
        SortConfig<T, K>
    >({
        sortKey: undefined,
        sortDirection: undefined,
    })
    const [internalSearchString, setInternalSearchString] = useState('')
    const [internalSelectedRows, setInternalSelectedRows] = useState<
        Array<string | number>
    >([])
    const [internalExpandedRows, setInternalExpandedRows] = useState<
        Array<string | number>
    >([])
    const [internalPagination, setInternalPagination] =
        useState<PaginationConfig>({
            page: 1,
            pageSize: 10,
            totalRows: 0,
        })

    // Use external or internal state
    const sortConfig = externalSortConfig ?? internalSortConfig
    const searchString = externalSearchString ?? internalSearchString
    const selectedRows = externalSelectedRows ?? internalSelectedRows
    const expandedRows = internalExpandedRows
    const pagination = externalPagination ?? internalPagination

    // Handle sort
    const handleSortChange = useCallback(
        (key: K) => {
            if (!sortable) return

            const currentDirection =
                sortConfig.sortKey === key
                    ? sortConfig.sortDirection
                    : undefined
            const newDirection =
                currentDirection === 'ascending'
                    ? 'descending'
                    : currentDirection === 'descending'
                    ? undefined
                    : 'ascending'

            const newConfig: SortConfig<T, K> = {
                sortKey: newDirection ? key : undefined,
                sortDirection: newDirection,
            }

            if (onSortChange) {
                onSortChange(newConfig)
            } else {
                setInternalSortConfig(newConfig)
            }
        },
        [sortable, sortConfig, onSortChange]
    )

    // Handle search
    const handleSearchChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value
            if (onSearchChange) {
                onSearchChange(value)
            } else {
                setInternalSearchString(value)
                // Reset to page 1 on search
                if (!externalPagination) {
                    setInternalPagination((prev) => ({ ...prev, page: 1 }))
                }
            }
        },
        [onSearchChange, externalPagination]
    )

    // Handle row selection
    const handleRowSelect = useCallback(
        (id: string | number) => {
            let newSelection: Array<string | number>

            if (selectionMode === 'single') {
                newSelection = selectedRows.includes(id) ? [] : [id]
            } else if (selectionMode === 'multiple') {
                newSelection = selectedRows.includes(id)
                    ? selectedRows.filter((rowId) => rowId !== id)
                    : [...selectedRows, id]
            } else {
                return
            }

            if (onSelectionChange) {
                onSelectionChange(newSelection)
            } else {
                setInternalSelectedRows(newSelection)
            }
        },
        [selectionMode, selectedRows, onSelectionChange]
    )

    // Handle select all
    const handleSelectAll = useCallback(() => {
        if (selectionMode !== 'multiple') return

        const allIds = rowDefinitions
            .filter((row) => !row.disabled)
            .map((row) => row.id)
        const allSelected = allIds.every((id) => selectedRows.includes(id))
        const newSelection = allSelected ? [] : allIds

        if (onSelectionChange) {
            onSelectionChange(newSelection)
        } else {
            setInternalSelectedRows(newSelection)
        }
    }, [selectionMode, rowDefinitions, selectedRows, onSelectionChange])

    // Handle expand toggle
    const handleExpandToggle = useCallback(
        (id: string | number) => {
            const newExpanded = expandedRows.includes(id)
                ? expandedRows.filter((rowId) => rowId !== id)
                : [...expandedRows, id]

            setInternalExpandedRows(newExpanded)
            if (onExpandChange) {
                onExpandChange(newExpanded)
            }
        },
        [expandedRows, onExpandChange]
    )

    // Handle pagination
    const handlePageChange = useCallback(
        (newPage: number) => {
            const newConfig = { ...pagination, page: newPage }
            if (onPaginationChange) {
                onPaginationChange(newConfig)
            } else {
                setInternalPagination(newConfig)
            }
        },
        [pagination, onPaginationChange]
    )

    const handlePageSizeChange = useCallback(
        (event: React.ChangeEvent<HTMLSelectElement>) => {
            const newPageSize = parseInt(event.target.value, 10)
            const newConfig = { ...pagination, pageSize: newPageSize, page: 1 }
            if (onPaginationChange) {
                onPaginationChange(newConfig)
            } else {
                setInternalPagination(newConfig)
            }
        },
        [pagination, onPaginationChange]
    )

    // Process data: search -> sort -> paginate
    const processedData = useMemo(() => {
        let data = rowDefinitions

        // Search
        if (searchString && searchable) {
            data = tableSearch(data, columnDefinitions, searchString)
        }

        // Sort
        if (sortConfig.sortKey && sortConfig.sortDirection) {
            data = tableSort(data, sortConfig.sortKey, sortConfig.sortDirection)
        }

        // Update total rows for pagination
        const totalRows = data.length
        if (!externalPagination && internalPagination.totalRows !== totalRows) {
            setInternalPagination((prev) => ({ ...prev, totalRows }))
        }

        // Paginate
        if (externalPagination || pagination.pageSize > 0) {
            data = paginateRows(data, pagination)
        }

        return data
    }, [
        rowDefinitions,
        searchString,
        searchable,
        columnDefinitions,
        sortConfig,
        pagination,
        externalPagination,
        internalPagination.totalRows,
    ])

    // Calculate selection state
    const selectableRows = rowDefinitions.filter((row) => !row.disabled)
    const allSelected =
        selectionMode === 'multiple' &&
        selectableRows.length > 0 &&
        selectableRows.every((row) => selectedRows.includes(row.id))
    const someSelected =
        selectionMode === 'multiple' && selectedRows.length > 0 && !allSelected

    // Bulk actions
    const selectedRowData = rowDefinitions.filter((row) =>
        selectedRows.includes(row.id)
    )
    const hasBulkActions =
        bulkActions && bulkActions.length > 0 && selectedRows.length > 0

    // Pagination info
    const totalPages = getTotalPages(
        externalPagination
            ? externalPagination.totalRows
            : internalPagination.totalRows,
        pagination.pageSize
    )
    const pageRange = getPageRange(pagination.page, totalPages)
    const showPagination =
        externalPagination || internalPagination.totalRows > pagination.pageSize

    return (
        <div
            className={classNames(
                'table-container',
                theme,
                {
                    'table-container--sticky-header': stickyHeader,
                    'table-container--loading': loading,
                },
                className
            )}
            role="region"
            aria-label={ariaLabel}
            aria-describedby={ariaDescribedBy}
        >
            {/* Search and Bulk Actions Bar */}
            {(searchable || hasBulkActions) && (
                <div className="table-toolbar">
                    {searchable && (
                        <div className="table-search">
                            <input
                                id="table-search"
                                type="text"
                                className="table-search__input"
                                placeholder={searchPlaceholder}
                                value={searchString}
                                onChange={handleSearchChange}
                                aria-label="Search table"
                            />
                        </div>
                    )}

                    {hasBulkActions && (
                        <div className="table-bulk-actions">
                            <span className="table-bulk-actions__count">
                                {selectedRows.length} selected
                            </span>
                            {bulkActions?.map((action, index) => {
                                const disabled =
                                    action.disabled?.(selectedRowData) ?? false
                                return (
                                    <button
                                        key={index}
                                        className="table-bulk-actions__button"
                                        onClick={() =>
                                            action.onClick(selectedRowData)
                                        }
                                        disabled={disabled}
                                        aria-label={action.label}
                                    >
                                        {action.icon && (
                                            <span className="table-bulk-actions__icon">
                                                {action.icon}
                                            </span>
                                        )}
                                        {action.label}
                                    </button>
                                )
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="table-error" role="alert">
                    {error}
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="table-loading" role="status" aria-live="polite">
                    <div className="table-loading__spinner" />
                    <span>{loadingMessage}</span>
                </div>
            )}

            {/* Table */}
            {!loading && !error && (
                <>
                    {processedData.length === 0 ? (
                        <div className="table-empty" role="status">
                            {emptyMessage}
                        </div>
                    ) : (
                        <div className="table-wrapper">
                            <table
                                className={classNames(
                                    'table',
                                    {
                                        'table--striped': striped,
                                        'table--hoverable': hoverable,
                                        'table--bordered': bordered,
                                        'table--compact': compact,
                                    },
                                    classNameTable
                                )}
                                role="table"
                                aria-label={ariaLabel}
                            >
                                <TableHeader
                                    columnDefinitions={columnDefinitions}
                                    sortConfig={sortConfig}
                                    onSortClick={handleSortChange}
                                    selectionMode={selectionMode}
                                    allSelected={allSelected}
                                    someSelected={someSelected}
                                    onSelectAll={handleSelectAll}
                                    hasRowActions={
                                        !!(rowActions && rowActions.length > 0)
                                    }
                                    expandable={expandable}
                                />
                                <TableRows
                                    rowDefinitions={processedData}
                                    columnDefinitions={columnDefinitions}
                                    selectedRows={selectedRows}
                                    expandedRows={expandedRows}
                                    selectionMode={selectionMode}
                                    onRowSelect={handleRowSelect}
                                    onRowClick={onRowClick}
                                    onRowDoubleClick={onRowDoubleClick}
                                    rowActions={rowActions}
                                    expandable={expandable}
                                    renderExpandedRow={renderExpandedRow}
                                    onExpandToggle={handleExpandToggle}
                                    hoverable={hoverable}
                                />
                            </table>
                        </div>
                    )}
                </>
            )}

            {/* Pagination */}
            {showPagination &&
                !loading &&
                !error &&
                processedData.length > 0 && (
                    <div
                        className="table-pagination"
                        role="navigation"
                        aria-label="Pagination"
                    >
                        <div className="table-pagination__info">
                            Showing{' '}
                            {(pagination.page - 1) * pagination.pageSize + 1} to{' '}
                            {Math.min(
                                pagination.page * pagination.pageSize,
                                externalPagination
                                    ? externalPagination.totalRows
                                    : internalPagination.totalRows
                            )}{' '}
                            of{' '}
                            {externalPagination
                                ? externalPagination.totalRows
                                : internalPagination.totalRows}{' '}
                            rows
                        </div>

                        <div className="table-pagination__controls">
                            <button
                                className="table-pagination__button"
                                onClick={() =>
                                    handlePageChange(pagination.page - 1)
                                }
                                disabled={pagination.page === 1}
                                aria-label="Previous page"
                            >
                                Previous
                            </button>

                            {pageRange.map((page) => (
                                <button
                                    key={page}
                                    className={classNames(
                                        'table-pagination__button',
                                        {
                                            'table-pagination__button--active':
                                                page === pagination.page,
                                        }
                                    )}
                                    onClick={() => handlePageChange(page)}
                                    aria-label={`Page ${page}`}
                                    aria-current={
                                        page === pagination.page
                                            ? 'page'
                                            : undefined
                                    }
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                className="table-pagination__button"
                                onClick={() =>
                                    handlePageChange(pagination.page + 1)
                                }
                                disabled={pagination.page === totalPages}
                                aria-label="Next page"
                            >
                                Next
                            </button>
                        </div>

                        <div className="table-pagination__page-size">
                            <label htmlFor="page-size-select">
                                Rows per page:
                            </label>
                            <select
                                id="page-size-select"
                                value={pagination.pageSize}
                                onChange={handlePageSizeChange}
                                className="table-pagination__select"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                        </div>
                    </div>
                )}
        </div>
    )
}

export default Table
