import { RequiredBy } from '../../utility/types'

export type RowDefinitionType<T> = {
    id: string | number
    data: T
    selected?: boolean
}

export type ColumnDefinitionType<T, K extends keyof T> = {
    key: K
    header: string
    width?: number
}

export type TableProps<T, K extends keyof T> = {
    rowDefinitions: RowDefinitionType<T>[]
    columnDefinitions: ColumnDefinitionType<T, K>[]
    sortConfig?: SortConfig<T, K>
    classNameTable?: string
}

export type TableHeaderProps<T, K extends keyof T> = RequiredBy<
    Pick<TableProps<T, K>, 'columnDefinitions' | 'sortConfig'> & {
        onClick: (value: K) => void
    },
    'sortConfig'
>

export type TableRowProps<T, K extends keyof T> = Pick<
    TableProps<T, K>,
    'rowDefinitions' | 'columnDefinitions'
>

export type SortConfig<T, K extends keyof T> = {
    sortKey: K | undefined
    sortDirection: 'ascending' | 'descending'
}
