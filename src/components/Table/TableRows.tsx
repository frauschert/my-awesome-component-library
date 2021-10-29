import React, { useState } from 'react'
import { RowDefinitionType, TableRowProps } from './types'

const TableRows = <T, K extends keyof T>({
    rowDefinitions,
    columnDefinitions,
}: TableRowProps<T, K>) => {
    const [rowValues, setRowValues] = useState(rowDefinitions)

    const handleOnSelect = (row: RowDefinitionType<T>, index: number) => {
        const selectedRow = { ...row, selected: !row.selected }
        setRowValues(
            rowValues.map((value, i) => (i !== index ? value : selectedRow))
        )
    }
    const rows = rowValues.map((row, index) => {
        return (
            <tr
                key={`row-${index}`}
                className={row.selected ? 'active-row' : undefined}
                onClick={() => handleOnSelect(row, index)}
            >
                {columnDefinitions.map((column, index2) => {
                    return (
                        <td key={`cell-${index2}`}>{row.data[column.key]}</td>
                    )
                })}
            </tr>
        )
    })

    return <tbody>{rows}</tbody>
}

export default TableRows
