import React, { useContext, useState } from 'react'
import TableHeader from './TableHeader'
import TableRows from './TableRows'
import { SortConfig, TableProps } from './types'
import { classNames } from '../../utility/classnames'
import { ThemeContext } from '../Theme'
import './table.css'
import { tableSearch, tableSort } from './utils'

function Table<T, K extends keyof T>({
    rowDefinitions,
    columnDefinitions,
    sortConfig,
    classNameTable,
}: TableProps<T, K>) {
    const [sortLocalConfig, setSortLocalConfig] = useState<SortConfig<T, K>>(
        sortConfig ?? {
            sortKey: undefined,
            sortDirection: 'ascending',
        }
    )
    const [searchString, setSearchString] = useState('')
    const { theme } = useContext(ThemeContext)
    const { sortKey, sortDirection } = sortLocalConfig

    const onTableHeaderClick = (value: K) =>
        setSortLocalConfig(
            sortDirection === 'ascending'
                ? { sortKey: value, sortDirection: 'descending' }
                : { sortKey: value, sortDirection: 'ascending' }
        )

    const handleSearch = (event: React.FormEvent<HTMLInputElement>) => {
        setSearchString(event.currentTarget.value)
    }

    const searchedData = tableSearch(
        rowDefinitions,
        columnDefinitions,
        searchString
    )

    const sortedData =
        sortKey !== undefined
            ? tableSort(searchedData, sortKey, sortDirection)
            : searchedData

    return (
        <>
            <div className="container">
                <label htmlFor="search">
                    Search:
                    <input id="search" type="text" onChange={handleSearch} />
                </label>
                <table
                    className={classNames(theme, 'table', classNameTable)}
                    aria-labelledby="tableLabel"
                >
                    <TableHeader
                        columnDefinitions={columnDefinitions}
                        onClick={onTableHeaderClick}
                        sortConfig={sortLocalConfig}
                    />
                    <TableRows
                        rowDefinitions={sortedData}
                        columnDefinitions={columnDefinitions}
                    />
                </table>
            </div>
        </>
    )
}

export default Table
