import React from 'react'
import { TableHeaderProps } from './types'
import './table.scss'
import DownArrow from '../../icons/downArrow.svg'
import UpArrow from '../../icons/upArrow.svg'

const TableHeader = <T, K extends keyof T>({
    columnDefinitions,
    onClick,
    sortConfig,
}: TableHeaderProps<T, K>) => {
    const { sortKey, sortDirection } = sortConfig
    const headers = columnDefinitions.map((column, index) => {
        const style = {
            width: column.width ?? 100,
        }
        const sortIcon =
            column.key === sortKey ? (
                sortDirection === 'descending' ? (
                    <DownArrow width={16} height={16} />
                ) : (
                    <UpArrow width={16} height={16} />
                )
            ) : null

        return (
            <th
                key={`headCell-${index}`}
                style={style}
                onClick={(e) => {
                    e.stopPropagation()
                    onClick(column.key)
                }}
            >
                {column.header}
                {sortIcon}
            </th>
        )
    })

    return (
        <thead>
            <tr>{headers}</tr>
        </thead>
    )
}

export default TableHeader
