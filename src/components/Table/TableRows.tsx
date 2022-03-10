import React, { useState } from 'react'
import { RowDefinitionType, TableRowProps } from './types'

const TableRows = <T, K extends keyof T>({
    rowDefinitions,
    columnDefinitions,
}: TableRowProps<T, K>) => {
    const [selectedIds, setSelectedIds] = useState(
        rowDefinitions.filter((row) => row.selected).map((row) => row.id)
    )

    const rowValues = rowDefinitions.map((row) =>
        selectedIds.includes(row.id)
            ? { ...row, selected: true }
            : { ...row, selected: false }
    )

    const handleOnSelect = (row: RowDefinitionType<T>) => {
        const id = row.id

        if (!selectedIds.includes(id)) {
            setSelectedIds([...selectedIds, id])
        } else if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((sId) => sId !== id))
        }
    }
    const rows = rowValues.map((row) => {
        return (
            <tr
                key={`row-${row.id}`}
                className={row.selected ? 'active-row' : undefined}
                onClick={() => handleOnSelect(row)}
            >
                {columnDefinitions.map((column, index2) => (
                    <td key={`cell-${index2}`}>{row.data[column.key]}</td>
                ))}
            </tr>
        )
    })

    return <tbody>{rows}</tbody>
}

export default TableRows
