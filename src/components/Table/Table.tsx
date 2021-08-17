import React, { useState } from 'react';
import TableHeader from './TableHeader';
import TableRows from './TableRows';
import { SortConfig, TableProps } from './types';
import { search } from '../../utility/search';
import { sort } from '../../utility/sort';

function Table<T, K extends keyof T>({ data, columns }: TableProps<T, K>) {
  const [sortConfig, setSortConfig] = useState<SortConfig<T, K>>({
    sortKey: undefined,
    sortDirection: 'ascending',
  });
  const [searchString, setSearchString] = useState('');
  const { sortKey, sortDirection } = sortConfig;

  const onTableHeaderClick = (value: K) =>
    setSortConfig(
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
      <table className="table table-striped" aria-labelledby="tabelLabel">
        <TableHeader columns={columns} onClick={onTableHeaderClick} />
        <TableRows data={sortedData} columns={columns} />
      </table>
    </>
  );
}

export default Table;
