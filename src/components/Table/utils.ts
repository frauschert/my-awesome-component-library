import { ColumnDefinitionType, RowDefinitionType } from './types'

export function tableSearch<T, K extends keyof T>(
    rows: RowDefinitionType<T>[],
    columns: ColumnDefinitionType<T, K>[],
    query: string
): RowDefinitionType<T>[] {
    if (query === '') {
        return rows
    }

    const colKeys = columns.map((col) => col.key)
    return rows.filter((row) =>
        colKeys.some((key) => {
            const value = row.data[key]
            if (typeof value === 'string' || typeof value === 'number') {
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
    return rows.sort((a, b) => {
        if (a.data[sortKey] < b.data[sortKey]) {
            return direction === 'ascending' ? -1 : 1
        }
        if (a.data[sortKey] > b.data[sortKey]) {
            return direction === 'ascending' ? 1 : -1
        }
        return 0
    })
}
