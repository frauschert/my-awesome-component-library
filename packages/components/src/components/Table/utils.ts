import {
    ColumnDefinitionType,
    PaginationConfig,
    RowDefinitionType,
} from './types'

export function tableSearch<T, K extends keyof T>(
    rows: RowDefinitionType<T>[],
    columns: ColumnDefinitionType<T, K>[],
    query: string
): RowDefinitionType<T>[] {
    if (query === '') {
        return rows
    }

    const searchableColumns = columns.filter((col) => col.searchable !== false)
    const colKeys = searchableColumns.map((col) => col.key)

    return rows.filter((row) =>
        colKeys.some((key) => {
            const value = row.data[key]
            if (typeof value === 'string' || typeof value === 'number') {
                return value
                    .toString()
                    .toLowerCase()
                    .includes(query.toLowerCase())
            }
            // Handle boolean, date, etc.
            if (typeof value === 'boolean' || value instanceof Date) {
                return value
                    .toString()
                    .toLowerCase()
                    .includes(query.toLowerCase())
            }
            return false
        })
    )
}

export function tableSort<T, K extends keyof T>(
    rows: RowDefinitionType<T>[],
    sortKey: K,
    direction: 'ascending' | 'descending'
): RowDefinitionType<T>[] {
    // FIX: Create a copy to avoid mutating original array
    return [...rows].sort((a, b) => {
        const aValue = a.data[sortKey]
        const bValue = b.data[sortKey]

        // Handle null/undefined
        if (aValue == null && bValue == null) return 0
        if (aValue == null) return direction === 'ascending' ? 1 : -1
        if (bValue == null) return direction === 'ascending' ? -1 : 1

        // Handle different types
        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return direction === 'ascending'
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue)
        }

        if (aValue < bValue) {
            return direction === 'ascending' ? -1 : 1
        }
        if (aValue > bValue) {
            return direction === 'ascending' ? 1 : -1
        }
        return 0
    })
}

export function paginateRows<T>(
    rows: RowDefinitionType<T>[],
    config: PaginationConfig
): RowDefinitionType<T>[] {
    const { page, pageSize } = config
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    return rows.slice(startIndex, endIndex)
}

export function getTotalPages(totalRows: number, pageSize: number): number {
    return Math.ceil(totalRows / pageSize)
}

export function getPageRange(
    currentPage: number,
    totalPages: number,
    maxVisible: number = 5
): number[] {
    if (totalPages <= maxVisible) {
        return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const half = Math.floor(maxVisible / 2)
    let start = Math.max(1, currentPage - half)
    let end = Math.min(totalPages, start + maxVisible - 1)

    if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1)
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}
