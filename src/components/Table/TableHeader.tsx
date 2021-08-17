import React from 'react';
import { TableHeaderProps } from "./types";

const TableHeader = <T, K extends keyof T>({ columns, onClick }: TableHeaderProps<T, K>) => {
    const headers = columns.map((column, index) => {
        const style = {
            width: column.width ?? 100, // 100 is our default value if width is not defined
            borderBottom: '2px solid black'
        };

        return (
            <th
                key={`headCell-${index}`}
                style={style}
                onClick={() => onClick(column.key)}
            >
                {column.header}
            </th>
        );
    });

    return (
        <thead>
            <tr>{headers}</tr>
        </thead>
    );
}

export default TableHeader;