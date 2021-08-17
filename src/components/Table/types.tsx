export type ColumnDefinitionType<T, K extends keyof T> = {
  key: K;
  header: string;
  width?: number;
};

export type TableProps<T, K extends keyof T> = {
  data: T[];
  columns: ColumnDefinitionType<T, K>[];
};

export type TableHeaderProps<T, K extends keyof T> = Pick<
  TableProps<T, K>,
  'columns'
> & {
  onClick: (value: K) => void;
};

export type SortConfig<T, K extends keyof T> = {
  sortKey: K | undefined;
  sortDirection: 'ascending' | 'descending';
};
