import React from 'react'
import { RowDefinitionType, TableRowProps } from './types'
import { classNames } from '../../utility/classnames'

const TableRows = <T, K extends keyof T>({
    rowDefinitions,
    columnDefinitions,
    selectedRows,
    expandedRows,
    selectionMode,
    onRowSelect,
    onRowClick,
    onRowDoubleClick,
    rowActions,
    expandable,
    renderExpandedRow,
    onExpandToggle,
    hoverable,
}: TableRowProps<T, K>) => {
    const handleRowClick = (
        row: RowDefinitionType<T>,
        event: React.MouseEvent<HTMLTableRowElement>
    ) => {
        // Don't trigger row click if clicking on interactive elements
        const target = event.target as HTMLElement
        if (
            target.tagName === 'BUTTON' ||
            target.tagName === 'INPUT' ||
            target.closest('button') ||
            target.closest('input')
        ) {
            return
        }

        onRowClick?.(row)
    }

    const handleRowDoubleClick = (row: RowDefinitionType<T>) => {
        onRowDoubleClick?.(row)
    }

    const handleCheckboxChange = (row: RowDefinitionType<T>) => {
        if (!row.disabled) {
            onRowSelect(row.id)
        }
    }

    const handleExpandClick = (
        row: RowDefinitionType<T>,
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.stopPropagation()
        onExpandToggle(row.id)
    }

    const renderCell = (
        row: RowDefinitionType<T>,
        column: (typeof columnDefinitions)[number]
    ) => {
        const value = row.data[column.key]

        if (column.render) {
            return column.render(value, row, column)
        }

        // Default rendering
        if (value == null) {
            return <span className="table-cell__empty">—</span>
        }

        if (typeof value === 'boolean') {
            return (
                <span className="table-cell__boolean">
                    {value ? 'Yes' : 'No'}
                </span>
            )
        }

        if (value instanceof Date) {
            return (
                <span className="table-cell__date">
                    {value.toLocaleDateString()}
                </span>
            )
        }

        return <span>{String(value)}</span>
    }

    if (rowDefinitions.length === 0) {
        return (
            <tbody className="table-body">
                <tr>
                    <td
                        colSpan={
                            columnDefinitions.length +
                            (selectionMode !== 'none' ? 1 : 0) +
                            (expandable ? 1 : 0) +
                            (rowActions ? 1 : 0)
                        }
                        className="table-cell table-cell--empty"
                    >
                        No data available
                    </td>
                </tr>
            </tbody>
        )
    }

    return (
        <tbody className="table-body" role="rowgroup">
            {rowDefinitions.map((row) => {
                const isSelected = selectedRows.includes(row.id)
                const isExpanded = expandedRows.includes(row.id)
                const isDisabled = row.disabled || false

                return (
                    <React.Fragment key={row.id}>
                        <tr
                            className={classNames('table-row', {
                                'table-row--selected': isSelected,
                                'table-row--disabled': isDisabled,
                                'table-row--hoverable':
                                    hoverable && !isDisabled,
                                'table-row--expanded': isExpanded,
                            })}
                            role="row"
                            aria-selected={isSelected || undefined}
                            aria-disabled={isDisabled || undefined}
                            onClick={(e) => handleRowClick(row, e)}
                            onDoubleClick={() => handleRowDoubleClick(row)}
                        >
                            {/* Expand Cell */}
                            {expandable && (
                                <td
                                    className="table-cell table-cell--expand"
                                    role="cell"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <button
                                        className={classNames(
                                            'table-expand-button',
                                            {
                                                'table-expand-button--expanded':
                                                    isExpanded,
                                            }
                                        )}
                                        onClick={(e) =>
                                            handleExpandClick(row, e)
                                        }
                                        aria-label={
                                            isExpanded
                                                ? 'Collapse row'
                                                : 'Expand row'
                                        }
                                        aria-expanded={isExpanded}
                                    >
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 16 16"
                                            fill="currentColor"
                                        >
                                            <path d="M4 6l4 4 4-4z" />
                                        </svg>
                                    </button>
                                </td>
                            )}

                            {/* Selection Cell */}
                            {selectionMode !== 'none' && (
                                <td
                                    className="table-cell table-cell--select"
                                    role="cell"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <input
                                        type={
                                            selectionMode === 'multiple'
                                                ? 'checkbox'
                                                : 'radio'
                                        }
                                        className="table-row__checkbox"
                                        checked={isSelected}
                                        onChange={() =>
                                            handleCheckboxChange(row)
                                        }
                                        disabled={isDisabled}
                                        aria-label={`Select row ${row.id}`}
                                    />
                                </td>
                            )}

                            {/* Data Cells */}
                            {columnDefinitions.map((column, cellIndex) => (
                                <td
                                    key={`cell-${row.id}-${cellIndex}`}
                                    className={classNames(
                                        'table-cell',
                                        column.align
                                            ? `table-cell--${column.align}`
                                            : undefined
                                    )}
                                    role="cell"
                                >
                                    {renderCell(row, column)}
                                </td>
                            ))}

                            {/* Actions Cell */}
                            {rowActions && rowActions.length > 0 && (
                                <td
                                    className="table-cell table-cell--actions"
                                    role="cell"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="table-row-actions">
                                        {rowActions.map(
                                            (action, actionIndex) => {
                                                const isHidden =
                                                    action.hidden?.(row) ??
                                                    false
                                                const isActionDisabled =
                                                    action.disabled?.(row) ??
                                                    false

                                                if (isHidden) return null

                                                return (
                                                    <button
                                                        key={actionIndex}
                                                        className="table-row-actions__button"
                                                        onClick={() =>
                                                            action.onClick(row)
                                                        }
                                                        disabled={
                                                            isActionDisabled ||
                                                            isDisabled
                                                        }
                                                        aria-label={
                                                            action.label
                                                        }
                                                        title={action.label}
                                                    >
                                                        {action.icon ? (
                                                            <span className="table-row-actions__icon">
                                                                {action.icon}
                                                            </span>
                                                        ) : (
                                                            action.label
                                                        )}
                                                    </button>
                                                )
                                            }
                                        )}
                                    </div>
                                </td>
                            )}
                        </tr>

                        {/* Expanded Row Content */}
                        {expandable && isExpanded && renderExpandedRow && (
                            <tr
                                className="table-row table-row--expanded-content"
                                role="row"
                            >
                                <td
                                    colSpan={
                                        columnDefinitions.length +
                                        (selectionMode !== 'none' ? 1 : 0) +
                                        1 + // expand column
                                        (rowActions ? 1 : 0)
                                    }
                                    className="table-cell table-cell--expanded"
                                    role="cell"
                                >
                                    <div className="table-expanded-content">
                                        {renderExpandedRow(row)}
                                    </div>
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                )
            })}
        </tbody>
    )
}

export default TableRows
