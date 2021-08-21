import React from 'react';
import { TableHeaderProps } from "./types";
import "./table.css";

const TableHeader = <T, K extends keyof T>({ columns, onClick }: TableHeaderProps<T, K>) => {
    const headers = columns.map((column, index) => {
        const style = {
            width: column.width ?? 100, // 100 is our default value if width is not defined
        };

        return (
            <th
                key={`headCell-${index}`}
                className="table-header"
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