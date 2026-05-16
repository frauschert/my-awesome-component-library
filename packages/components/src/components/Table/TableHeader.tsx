import React from 'react'
import { TableHeaderProps } from './types'
import './table.scss'
import DownArrow from '../../icons/downArrow.svg'
import UpArrow from '../../icons/upArrow.svg'

const TableHeader = <T, K extends keyof T>({
    columnDefinitions,
    sortConfig,
    onSortClick,
    selectionMode,
    allSelected,
    someSelected,
    onSelectAll,
    hasRowActions,
    expandable,
}: TableHeaderProps<T, K>) => {
    const { sortKey, sortDirection } = sortConfig

    const getSortIcon = (columnKey: K) => {
        if (columnKey !== sortKey) return null

        return sortDirection === 'descending' ? (
            <DownArrow
                width={16}
                height={16}
                className="table-header__sort-icon"
            />
        ) : sortDirection === 'ascending' ? (
            <UpArrow
                width={16}
                height={16}
                className="table-header__sort-icon"
            />
        ) : null
    }

    const handleHeaderClick = (column: (typeof columnDefinitions)[number]) => {
        if (column.sortable !== false) {
            onSortClick(column.key)
        }
    }

    const handleKeyDown = (
        event: React.KeyboardEvent,
        column: (typeof columnDefinitions)[number]
    ) => {
        if (
            column.sortable !== false &&
            (event.key === 'Enter' || event.key === ' ')
        ) {
            event.preventDefault()
            onSortClick(column.key)
        }
    }

    return (
        <thead className="table-header" role="rowgroup">
            <tr role="row">
                {/* Expand Column */}
                {expandable && (
                    <th
                        className="table-header__cell table-header__cell--expand"
                        role="columnheader"
                        aria-label="Expand"
                    >
                        {/* Empty header for expand column */}
                    </th>
                )}

                {/* Selection Column */}
                {selectionMode === 'multiple' && (
                    <th
                        className="table-header__cell table-header__cell--select"
                        role="columnheader"
                        aria-label="Select all rows"
                    >
                        <input
                            type="checkbox"
                            className="table-header__checkbox"
                            checked={allSelected}
                            ref={(input) => {
                                if (input) {
                                    input.indeterminate = someSelected
                                }
                            }}
                            onChange={onSelectAll}
                            aria-label="Select all rows"
                        />
                    </th>
                )}

                {selectionMode === 'single' && (
                    <th
                        className="table-header__cell table-header__cell--select"
                        role="columnheader"
                        aria-label="Select"
                    >
                        {/* Empty header for single selection */}
                    </th>
                )}

                {/* Data Columns */}
                {columnDefinitions.map((column, index) => {
                    const isSortable = column.sortable !== false
                    const isSorted = column.key === sortKey
                    const style: React.CSSProperties = {}

                    if (column.width) {
                        style.width = column.width
                    }
                    if (column.minWidth) {
                        style.minWidth = column.minWidth
                    }
                    if (column.maxWidth) {
                        style.maxWidth = column.maxWidth
                    }

                    return (
                        <th
                            key={`header-${index}`}
                            className={`table-header__cell ${
                                isSortable ? 'table-header__cell--sortable' : ''
                            } ${isSorted ? 'table-header__cell--sorted' : ''} ${
                                column.align
                                    ? `table-header__cell--${column.align}`
                                    : ''
                            }`}
                            style={style}
                            role="columnheader"
                            aria-sort={
                                isSorted
                                    ? sortDirection === 'ascending'
                                        ? 'ascending'
                                        : sortDirection === 'descending'
                                        ? 'descending'
                                        : 'none'
                                    : undefined
                            }
                            onClick={() => handleHeaderClick(column)}
                            onKeyDown={(e) => handleKeyDown(e, column)}
                            tabIndex={isSortable ? 0 : undefined}
                        >
                            <div className="table-header__content">
                                {column.headerRender ? (
                                    column.headerRender()
                                ) : (
                                    <span className="table-header__label">
                                        {column.header}
                                    </span>
                                )}
                                {isSortable && (
                                    <span className="table-header__sort">
                                        {getSortIcon(column.key)}
                                        {!isSorted && (
                                            <span className="table-header__sort-placeholder" />
                                        )}
                                    </span>
                                )}
                            </div>
                        </th>
                    )
                })}

                {/* Row Actions Column */}
                {hasRowActions && (
                    <th
                        className="table-header__cell table-header__cell--actions"
                        role="columnheader"
                        aria-label="Actions"
                    >
                        Actions
                    </th>
                )}
            </tr>
        </thead>
    )
}

export default TableHeader
