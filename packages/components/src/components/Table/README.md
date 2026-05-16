# Table Component

A full-featured, accessible data table component with sorting, pagination, search, selection, expandable rows, and custom rendering capabilities.

## Features

-   ✅ **Sorting**: Click column headers to sort ascending/descending/unsorted
-   ✅ **Pagination**: Built-in pagination with configurable page sizes
-   ✅ **Search**: Global search across all columns
-   ✅ **Selection**: Single or multiple row selection with select-all
-   ✅ **Custom Renderers**: Render custom content in any cell
-   ✅ **Row Actions**: Add action buttons to each row
-   ✅ **Bulk Actions**: Perform actions on multiple selected rows
-   ✅ **Expandable Rows**: Show additional details for any row
-   ✅ **Loading/Empty/Error States**: Built-in UI states
-   ✅ **Sticky Header**: Keep headers visible while scrolling
-   ✅ **Responsive**: Mobile-friendly design
-   ✅ **Accessible**: Full ARIA support and keyboard navigation
-   ✅ **Themed**: Integrates with your theme system
-   ✅ **TypeScript**: Fully typed with generic support

## Installation

```tsx
import Table from './components/Table'
import type {
    RowDefinitionType,
    ColumnDefinitionType,
} from './components/Table/types'
```

## Basic Usage

```tsx
import Table from './components/Table'

type User = {
    name: string
    email: string
    role: string
}

const rows: RowDefinitionType<User>[] = [
    {
        id: 1,
        data: { name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    },
    {
        id: 2,
        data: { name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
    },
]

const columns: ColumnDefinitionType<User, keyof User>[] = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role' },
]

function MyTable() {
    return <Table rowDefinitions={rows} columnDefinitions={columns} />
}
```

## API Reference

### TableProps<T, K>

| Prop                 | Type                                       | Default               | Description                    |
| -------------------- | ------------------------------------------ | --------------------- | ------------------------------ |
| `rowDefinitions`     | `RowDefinitionType<T>[]`                   | **required**          | Array of row data              |
| `columnDefinitions`  | `ColumnDefinitionType<T, K>[]`             | **required**          | Array of column configurations |
| `sortConfig`         | `SortConfig<T, K>`                         | `undefined`           | Controlled sort state          |
| `onSortChange`       | `(config: SortConfig) => void`             | `undefined`           | Sort change callback           |
| `sortable`           | `boolean`                                  | `true`                | Enable sorting                 |
| `pagination`         | `PaginationConfig`                         | `undefined`           | Controlled pagination state    |
| `onPaginationChange` | `(config: PaginationConfig) => void`       | `undefined`           | Pagination change callback     |
| `selectionMode`      | `'none' \| 'single' \| 'multiple'`         | `'none'`              | Row selection mode             |
| `selectedRows`       | `Array<string \| number>`                  | `undefined`           | Controlled selected row IDs    |
| `onSelectionChange`  | `(ids: Array<string \| number>) => void`   | `undefined`           | Selection change callback      |
| `searchString`       | `string`                                   | `undefined`           | Controlled search value        |
| `onSearchChange`     | `(search: string) => void`                 | `undefined`           | Search change callback         |
| `searchable`         | `boolean`                                  | `true`                | Show search input              |
| `searchPlaceholder`  | `string`                                   | `'Search...'`         | Search input placeholder       |
| `rowActions`         | `RowAction<T>[]`                           | `undefined`           | Array of row actions           |
| `onRowClick`         | `(row: RowDefinitionType<T>) => void`      | `undefined`           | Row click callback             |
| `onRowDoubleClick`   | `(row: RowDefinitionType<T>) => void`      | `undefined`           | Row double-click callback      |
| `bulkActions`        | `BulkAction<T>[]`                          | `undefined`           | Array of bulk actions          |
| `expandable`         | `boolean`                                  | `false`               | Enable row expansion           |
| `renderExpandedRow`  | `(row: RowDefinitionType<T>) => ReactNode` | `undefined`           | Render expanded row content    |
| `onExpandChange`     | `(ids: Array<string \| number>) => void`   | `undefined`           | Expand change callback         |
| `loading`            | `boolean`                                  | `false`               | Show loading state             |
| `loadingMessage`     | `string`                                   | `'Loading...'`        | Loading message                |
| `emptyMessage`       | `string`                                   | `'No data available'` | Empty state message            |
| `error`              | `string`                                   | `undefined`           | Error message to display       |
| `className`          | `string`                                   | `undefined`           | Container class name           |
| `classNameTable`     | `string`                                   | `undefined`           | Table element class name       |
| `stickyHeader`       | `boolean`                                  | `false`               | Sticky header on scroll        |
| `striped`            | `boolean`                                  | `true`                | Alternate row colors           |
| `hoverable`          | `boolean`                                  | `true`                | Highlight rows on hover        |
| `bordered`           | `boolean`                                  | `false`               | Add borders to cells           |
| `compact`            | `boolean`                                  | `false`               | Reduce cell padding            |
| `ariaLabel`          | `string`                                   | `'Data table'`        | ARIA label                     |
| `ariaDescribedBy`    | `string`                                   | `undefined`           | ARIA described-by ID           |

### ColumnDefinitionType<T, K>

| Property       | Type                            | Default      | Description                    |
| -------------- | ------------------------------- | ------------ | ------------------------------ |
| `key`          | `K`                             | **required** | Data property key              |
| `header`       | `string \| ReactNode`           | **required** | Column header content          |
| `width`        | `number`                        | `undefined`  | Fixed column width             |
| `minWidth`     | `number`                        | `undefined`  | Minimum column width           |
| `maxWidth`     | `number`                        | `undefined`  | Maximum column width           |
| `sortable`     | `boolean`                       | `true`       | Enable sorting for this column |
| `searchable`   | `boolean`                       | `true`       | Include in search              |
| `align`        | `'left' \| 'center' \| 'right'` | `'left'`     | Cell text alignment            |
| `render`       | `CellRenderer<T, K>`            | `undefined`  | Custom cell renderer           |
| `headerRender` | `() => ReactNode`               | `undefined`  | Custom header renderer         |

### RowDefinitionType<T>

| Property   | Type               | Default      | Description              |
| ---------- | ------------------ | ------------ | ------------------------ |
| `id`       | `string \| number` | **required** | Unique row identifier    |
| `data`     | `T`                | **required** | Row data object          |
| `selected` | `boolean`          | `false`      | Initially selected       |
| `expanded` | `boolean`          | `false`      | Initially expanded       |
| `disabled` | `boolean`          | `false`      | Disable row interactions |

## Examples

### Sorting

```tsx
function SortableTable() {
    const [sortConfig, setSortConfig] = useState<SortConfig<User, keyof User>>({
        sortKey: 'name',
        sortDirection: 'ascending',
    })

    return (
        <Table
            rowDefinitions={rows}
            columnDefinitions={columns}
            sortConfig={sortConfig}
            onSortChange={setSortConfig}
        />
    )
}
```

### Pagination

```tsx
function PaginatedTable() {
    const [pagination, setPagination] = useState<PaginationConfig>({
        page: 1,
        pageSize: 10,
        totalRows: 100,
    })

    return (
        <Table
            rowDefinitions={rows}
            columnDefinitions={columns}
            pagination={pagination}
            onPaginationChange={setPagination}
        />
    )
}
```

### Row Selection

```tsx
function SelectableTable() {
    const [selectedRows, setSelectedRows] = useState<Array<string | number>>([])

    return (
        <>
            <p>Selected: {selectedRows.join(', ')}</p>
            <Table
                rowDefinitions={rows}
                columnDefinitions={columns}
                selectionMode="multiple"
                selectedRows={selectedRows}
                onSelectionChange={setSelectedRows}
            />
        </>
    )
}
```

### Custom Cell Renderers

```tsx
const columns: ColumnDefinitionType<User, keyof User>[] = [
    {
        key: 'name',
        header: 'Name',
        render: (value) => <strong>{value}</strong>,
    },
    {
        key: 'email',
        header: 'Email',
        render: (value) => <a href={`mailto:${value}`}>{value}</a>,
    },
    {
        key: 'status',
        header: 'Status',
        render: (value) => (
            <span
                style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: value === 'Active' ? '#28a745' : '#dc3545',
                    color: 'white',
                }}
            >
                {value}
            </span>
        ),
    },
]
```

### Row Actions

```tsx
<Table
    rowDefinitions={rows}
    columnDefinitions={columns}
    rowActions={[
        {
            label: 'Edit',
            onClick: (row) => handleEdit(row),
        },
        {
            label: 'Delete',
            onClick: (row) => handleDelete(row),
            disabled: (row) => row.data.status === 'Active',
        },
    ]}
/>
```

### Bulk Actions

```tsx
<Table
    rowDefinitions={rows}
    columnDefinitions={columns}
    selectionMode="multiple"
    selectedRows={selectedRows}
    onSelectionChange={setSelectedRows}
    bulkActions={[
        {
            label: 'Delete Selected',
            onClick: (rows) => handleBulkDelete(rows),
        },
        {
            label: 'Export',
            onClick: (rows) => handleExport(rows),
        },
    ]}
/>
```

### Expandable Rows

```tsx
<Table
    rowDefinitions={rows}
    columnDefinitions={columns}
    expandable
    renderExpandedRow={(row) => (
        <div style={{ padding: '1rem' }}>
            <h4>Details for {row.data.name}</h4>
            <p>Email: {row.data.email}</p>
            <p>Role: {row.data.role}</p>
        </div>
    )}
/>
```

### Loading State

```tsx
<Table
    rowDefinitions={rows}
    columnDefinitions={columns}
    loading={isLoading}
    loadingMessage="Fetching users..."
/>
```

### Empty State

```tsx
<Table
    rowDefinitions={[]}
    columnDefinitions={columns}
    emptyMessage="No users found. Try adjusting your filters."
/>
```

### Error State

```tsx
<Table
    rowDefinitions={rows}
    columnDefinitions={columns}
    error="Failed to load data. Please try again."
/>
```

## Accessibility

The Table component follows WAI-ARIA best practices:

-   **Keyboard Navigation**: Tab through interactive elements, Enter/Space to sort
-   **ARIA Roles**: Proper `role` attributes for table structure
-   **ARIA Labels**: Descriptive labels for screen readers
-   **ARIA Sort**: Sort direction announced to screen readers
-   **Focus Management**: Visible focus indicators
-   **Selection Announcement**: Selected state announced

### Keyboard Shortcuts

| Key               | Action                                  |
| ----------------- | --------------------------------------- |
| `Tab`             | Navigate between interactive elements   |
| `Shift + Tab`     | Navigate backwards                      |
| `Enter` / `Space` | Sort column, toggle selection           |
| `Arrow Keys`      | Navigate table cells (in some browsers) |

## Styling

The Table component uses BEM-style class names and integrates with your theme system.

### Main Classes

-   `.table-container` - Main wrapper
-   `.table` - Table element
-   `.table-header` - Table header
-   `.table-body` - Table body
-   `.table-row` - Table row
-   `.table-cell` - Table cell
-   `.table-pagination` - Pagination controls

### Modifiers

-   `.table--striped` - Alternating row colors
-   `.table--hoverable` - Row hover effect
-   `.table--bordered` - Cell borders
-   `.table--compact` - Reduced padding
-   `.table-container--sticky-header` - Sticky header

### Theme Variables

The component uses the following theme variables:

-   `backgroundColor` - Main background
-   `backgroundColorAlt` - Alternate row background
-   `textColor` - Text color
-   `textColorMuted` - Muted text
-   `primaryColor` - Primary accent
-   `borderColor` - Border color
-   `hoverBackgroundColor` - Hover state
-   `selectedBackgroundColor` - Selected state
-   `focusRing` - Focus outline

## Performance

### Large Datasets

For tables with 100+ rows, use pagination:

```tsx
<Table
    rowDefinitions={largeDataset}
    columnDefinitions={columns}
    pagination={{ page: 1, pageSize: 25, totalRows: largeDataset.length }}
/>
```

### Optimizing Renders

Use `React.memo` for custom cell renderers:

```tsx
const StatusBadge = React.memo(({ value }: { value: string }) => (
    <span className={`badge badge--${value}`}>{value}</span>
))

const columns = [
    {
        key: 'status',
        header: 'Status',
        render: (value) => <StatusBadge value={value} />,
    },
]
```

## Best Practices

1. **Use Controlled State for Critical Features**: Control sorting, pagination, and selection state when you need to sync with backend APIs.

2. **Memoize Data**: Use `useMemo` for data transformations to avoid unnecessary re-renders.

3. **Keep Custom Renderers Simple**: Complex renderers can impact performance. Consider memoization.

4. **Provide Meaningful Labels**: Use descriptive `ariaLabel` and column headers for accessibility.

5. **Handle Loading States**: Always show loading indicators when fetching data.

6. **Validate Data Structure**: Ensure each row has a unique `id` and matches the column keys.

## Common Issues

### Sorting Not Working

Ensure `sortable` is not disabled and you're handling `onSortChange`:

```tsx
<Table sortable onSortChange={setSortConfig} sortConfig={sortConfig} />
```

### Custom Renderer Not Updating

Wrap in `React.memo` or ensure dependencies are stable:

```tsx
const columns = useMemo(() => [...], [dependencies])
```

### Selection State Out of Sync

Use controlled `selectedRows` and `onSelectionChange`:

```tsx
const [selected, setSelected] = useState([])
<Table selectedRows={selected} onSelectionChange={setSelected} />
```

## TypeScript

The Table component is fully typed. Use generics for type safety:

```tsx
type User = {
    name: string
    age: number
}

const rows: RowDefinitionType<User>[] = [...]
const columns: ColumnDefinitionType<User, keyof User>[] = [...]

<Table<User, keyof User>
    rowDefinitions={rows}
    columnDefinitions={columns}
/>
```

## Migration from v1

If you're upgrading from the old Table component:

**Before:**

```tsx
<Table
    rowDefinitions={rows}
    columnDefinitions={columns}
    sortConfig={sortConfig}
    classNameTable="my-table"
/>
```

**After:**

```tsx
<Table
    rowDefinitions={rows}
    columnDefinitions={columns}
    sortConfig={sortConfig}
    onSortChange={setSortConfig} // Now required for controlled sorting
    classNameTable="my-table"
/>
```

**Key Changes:**

-   ✅ Fixed sort mutation bug (no longer mutates original array)
-   ✅ Added `onSortChange` callback (required for controlled sorting)
-   ✅ Selection state now controlled via `selectedRows` and `onSelectionChange`
-   ✅ Search now integrated with optional `searchable` prop
-   ✅ All hardcoded colors replaced with theme variables

## License

MIT
