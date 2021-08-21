import React, { useState } from 'react';
import TableHeader from './TableHeader';
import TableRows from './TableRows';
import { SortConfig, TableProps } from './types';
import { search } from '../../utility/search';
import { sort } from '../../utility/sort';
import "./table.css";

function Table<T, K extends keyof T>({ data, columns, sortConfig }: TableProps<T, K>) {
  const [sortLocalConfig, setSortLocalConfig] = useState<SortConfig<T, K>>(sortConfig ? sortConfig : {
    sortKey: undefined,
    sortDirection: 'ascending',
  });
  const [searchString, setSearchString] = useState('');
  const { sortKey, sortDirection } = sortLocalConfig;

  const onTableHeaderClick = (value: K) =>
    setSortLocalConfig(
      sortDirection === 'ascending'
        ? { sortKey: value, sortDirection: 'descending' }
        : { sortKey: value, sortDirection: 'ascending' },
    );

  const handleSearch = (event: React.FormEvent<HTMLInputElement>) => {
    setSearchString(event.currentTarget.value);
  };

  const searchedData = search(
    data,
    columns.map(col => col.key),
    searchString,
  );

  const sortedData =
    sortKey !== undefined
      ? sort(searchedData, sortKey, sortDirection)
      : searchedData;

  return (
    <>
      <label htmlFor="search">
        Search:
        <input id="search" type="text" onChange={handleSearch} />
      </label>
      <table className="table" aria-labelledby="tableLabel">
        <TableHeader columns={columns} onClick={onTableHeaderClick} />
        <TableRows data={sortedData} columns={columns} />
      </table>
    </>
  );
}

export default Table;
