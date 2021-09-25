import { RequiredBy } from '../../utility/types'

export type ColumnDefinitionType<T, K extends keyof T> = {
    key: K
    header: string
    width?: number
}

export type TableProps<T, K extends keyof T> = {
    data: T[]
    columns: ColumnDefinitionType<T, K>[]
    sortConfig?: SortConfig<T, K>
    classNameTable?: string
}

export type TableHeaderProps<T, K extends keyof T> = RequiredBy<
    Pick<TableProps<T, K>, 'columns' | 'sortConfig'> & {
        onClick: (value: K) => void
    },
    'sortConfig'
>

export type TableRowProps<T, K extends keyof T> = Pick<
    TableProps<T, K>,
    'columns' | 'data'
>

export type SortConfig<T, K extends keyof T> = {
    sortKey: K | undefined
    sortDirection: 'ascending' | 'descending'
}
