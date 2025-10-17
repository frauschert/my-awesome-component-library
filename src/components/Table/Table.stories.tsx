import React, { useState } from 'react'
import { Meta, StoryObj } from '@storybook/react-vite'
import Table from './Table'
import type {
    ColumnDefinitionType,
    RowDefinitionType,
    SortConfig,
    TableProps,
    PaginationConfig,
} from './types'

const meta: Meta<typeof Table> = {
    title: 'Components/Table',
    component: Table,
    decorators: [
        (Story) => (
            <div style={{ padding: '2rem' }}>
                <Story />
            </div>
        ),
    ],
}
export default meta

type Story = StoryObj<typeof Table>

// Sample data types
type User = {
    name: string
    email: string
    role: string
    status: 'Active' | 'Inactive'
    joinDate: Date
    salary: number
}

type Product = {
    name: string
    category: string
    price: number
    stock: number
    available: boolean
}

// Sample data
const users: RowDefinitionType<User>[] = [
    {
        id: 1,
        data: {
            name: 'John Doe',
            email: 'john@example.com',
            role: 'Admin',
            status: 'Active',
            joinDate: new Date('2023-01-15'),
            salary: 75000,
        },
    },
    {
        id: 2,
        data: {
            name: 'Jane Smith',
            email: 'jane@example.com',
            role: 'Developer',
            status: 'Active',
            joinDate: new Date('2023-03-20'),
            salary: 65000,
        },
    },
    {
        id: 3,
        data: {
            name: 'Bob Johnson',
            email: 'bob@example.com',
            role: 'Designer',
            status: 'Inactive',
            joinDate: new Date('2022-11-10'),
            salary: 60000,
        },
    },
    {
        id: 4,
        data: {
            name: 'Alice Williams',
            email: 'alice@example.com',
            role: 'Manager',
            status: 'Active',
            joinDate: new Date('2022-08-05'),
            salary: 80000,
        },
    },
    {
        id: 5,
        data: {
            name: 'Charlie Brown',
            email: 'charlie@example.com',
            role: 'Developer',
            status: 'Active',
            joinDate: new Date('2023-06-12'),
            salary: 68000,
        },
    },
]

// Generate large dataset for pagination demo
const generateLargeDataset = (count: number): RowDefinitionType<User>[] => {
    const roles = ['Admin', 'Developer', 'Designer', 'Manager', 'Analyst']
    const statuses: Array<'Active' | 'Inactive'> = ['Active', 'Inactive']

    return Array.from({ length: count }, (_, index) => ({
        id: index + 1,
        data: {
            name: `User ${index + 1}`,
            email: `user${index + 1}@example.com`,
            role: roles[index % roles.length],
            status: statuses[index % 2],
            joinDate: new Date(
                2020 + (index % 4),
                index % 12,
                (index % 28) + 1
            ),
            salary: 50000 + (index % 10) * 5000,
        },
    }))
}

const userColumns: ColumnDefinitionType<User, keyof User>[] = [
    { key: 'name', header: 'Name', width: 150 },
    { key: 'email', header: 'Email', width: 200 },
    { key: 'role', header: 'Role', width: 120 },
    { key: 'status', header: 'Status', width: 100 },
    { key: 'joinDate', header: 'Join Date', width: 120 },
    { key: 'salary', header: 'Salary', width: 120, align: 'right' },
]

// Basic Table
export const Basic: Story = {
    args: {
        rowDefinitions: users.slice(0, 3),
        columnDefinitions: userColumns,
        sortable: true,
        searchable: true,
    },
}

// With Sorting
export const WithSorting: Story = {
    render: () => {
        const [sortConfig, setSortConfig] = useState<
            SortConfig<User, keyof User>
        >({
            sortKey: 'name',
            sortDirection: 'ascending',
        })

        return (
            <Table
                rowDefinitions={users}
                columnDefinitions={userColumns}
                sortConfig={sortConfig}
                onSortChange={setSortConfig}
            />
        )
    },
}

// With Pagination
export const WithPagination: Story = {
    render: () => {
        const largeDataset = generateLargeDataset(50)
        const [pagination, setPagination] = useState<PaginationConfig>({
            page: 1,
            pageSize: 10,
            totalRows: largeDataset.length,
        })

        return (
            <Table
                rowDefinitions={largeDataset}
                columnDefinitions={userColumns}
                pagination={pagination}
                onPaginationChange={setPagination}
            />
        )
    },
}

// With Single Selection
export const WithSingleSelection: Story = {
    render: () => {
        const [selected, setSelected] = useState<Array<string | number>>([])

        return (
            <div>
                <p>Selected: {selected.join(', ') || 'None'}</p>
                <Table
                    rowDefinitions={users}
                    columnDefinitions={userColumns}
                    selectionMode="single"
                    selectedRows={selected}
                    onSelectionChange={setSelected}
                />
            </div>
        )
    },
}

// With Multiple Selection
export const WithMultipleSelection: Story = {
    render: () => {
        const [selected, setSelected] = useState<Array<string | number>>([])

        return (
            <div>
                <p>Selected: {selected.join(', ') || 'None'}</p>
                <Table
                    rowDefinitions={users}
                    columnDefinitions={userColumns}
                    selectionMode="multiple"
                    selectedRows={selected}
                    onSelectionChange={setSelected}
                />
            </div>
        )
    },
}

// With Custom Cell Renderers
export const WithCustomRenderers: Story = {
    render: () => {
        const columnsWithRenderers: ColumnDefinitionType<User, keyof User>[] = [
            { key: 'name', header: 'Name', width: 150 },
            {
                key: 'email',
                header: 'Email',
                width: 200,
                render: (value) => (
                    <a href={`mailto:${value}`} style={{ color: '#408bbd' }}>
                        {value}
                    </a>
                ),
            },
            {
                key: 'role',
                header: 'Role',
                width: 120,
                render: (value) => (
                    <span
                        style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            backgroundColor:
                                value === 'Admin'
                                    ? '#408bbd'
                                    : value === 'Manager'
                                    ? '#6c757d'
                                    : '#28a745',
                            color: 'white',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                        }}
                    >
                        {value}
                    </span>
                ),
            },
            {
                key: 'status',
                header: 'Status',
                width: 100,
                render: (value) => (
                    <span
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                        }}
                    >
                        <span
                            style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor:
                                    value === 'Active' ? '#28a745' : '#dc3545',
                            }}
                        />
                        {value}
                    </span>
                ),
            },
            {
                key: 'salary',
                header: 'Salary',
                width: 120,
                align: 'right',
                render: (value) => `$${value.toLocaleString()}`,
            },
        ]

        return (
            <Table
                rowDefinitions={users}
                columnDefinitions={columnsWithRenderers}
            />
        )
    },
}

// With Row Actions
export const WithRowActions: Story = {
    render: () => {
        return (
            <Table
                rowDefinitions={users}
                columnDefinitions={userColumns}
                rowActions={[
                    {
                        label: 'Edit',
                        onClick: (row) => alert(`Edit: ${row.data.name}`),
                    },
                    {
                        label: 'Delete',
                        onClick: (row) => alert(`Delete: ${row.data.name}`),
                        disabled: (row) => row.data.status === 'Active',
                    },
                    {
                        label: 'View',
                        onClick: (row) => alert(`View: ${row.data.name}`),
                    },
                ]}
            />
        )
    },
}

// With Bulk Actions
export const WithBulkActions: Story = {
    render: () => {
        const [selected, setSelected] = useState<Array<string | number>>([])

        return (
            <Table
                rowDefinitions={users}
                columnDefinitions={userColumns}
                selectionMode="multiple"
                selectedRows={selected}
                onSelectionChange={setSelected}
                bulkActions={[
                    {
                        label: 'Delete Selected',
                        onClick: (rows) => alert(`Delete ${rows.length} users`),
                    },
                    {
                        label: 'Export Selected',
                        onClick: (rows) => alert(`Export ${rows.length} users`),
                    },
                    {
                        label: 'Deactivate',
                        onClick: (rows) =>
                            alert(`Deactivate ${rows.length} users`),
                        disabled: (rows) =>
                            rows.some((r) => r.data.status === 'Inactive'),
                    },
                ]}
            />
        )
    },
}

// With Expandable Rows
export const WithExpandableRows: Story = {
    render: () => {
        return (
            <Table
                rowDefinitions={users}
                columnDefinitions={userColumns}
                expandable
                renderExpandedRow={(row) => (
                    <div
                        style={{ padding: '1rem', backgroundColor: '#f8f9fa' }}
                    >
                        <h4>Additional Information</h4>
                        <p>
                            <strong>Full Name:</strong> {row.data.name}
                        </p>
                        <p>
                            <strong>Email:</strong> {row.data.email}
                        </p>
                        <p>
                            <strong>Role:</strong> {row.data.role}
                        </p>
                        <p>
                            <strong>Joined:</strong>{' '}
                            {row.data.joinDate.toDateString()}
                        </p>
                        <p>
                            <strong>Annual Salary:</strong> $
                            {row.data.salary.toLocaleString()}
                        </p>
                    </div>
                )}
            />
        )
    },
}

// Loading State
export const LoadingState: Story = {
    args: {
        rowDefinitions: users,
        columnDefinitions: userColumns,
        loading: true,
        loadingMessage: 'Loading users...',
    },
}

// Empty State
export const EmptyState: Story = {
    args: {
        rowDefinitions: [],
        columnDefinitions: userColumns,
        emptyMessage: 'No users found. Try adjusting your search criteria.',
    },
}

// Error State
export const ErrorState: Story = {
    args: {
        rowDefinitions: users,
        columnDefinitions: userColumns,
        error: 'Failed to load data. Please try again later.',
    },
}

// Sticky Header
export const StickyHeader: Story = {
    render: () => {
        const largeDataset = generateLargeDataset(50)

        return (
            <Table
                rowDefinitions={largeDataset}
                columnDefinitions={userColumns}
                stickyHeader
                pagination={{
                    page: 1,
                    pageSize: 50,
                    totalRows: largeDataset.length,
                }}
            />
        )
    },
}

// Compact Mode
export const CompactMode: Story = {
    args: {
        rowDefinitions: users,
        columnDefinitions: userColumns,
        compact: true,
    },
}

// Bordered Table
export const Bordered: Story = {
    args: {
        rowDefinitions: users,
        columnDefinitions: userColumns,
        bordered: true,
    },
}

// Without Stripes
export const WithoutStripes: Story = {
    args: {
        rowDefinitions: users,
        columnDefinitions: userColumns,
        striped: false,
    },
}

// Without Hover
export const WithoutHover: Story = {
    args: {
        rowDefinitions: users,
        columnDefinitions: userColumns,
        hoverable: false,
    },
}

// Full Featured
export const FullFeatured: Story = {
    render: () => {
        const largeDataset = generateLargeDataset(100)
        const [pagination, setPagination] = useState<PaginationConfig>({
            page: 1,
            pageSize: 10,
            totalRows: largeDataset.length,
        })
        const [selected, setSelected] = useState<Array<string | number>>([])
        const [sortConfig, setSortConfig] = useState<
            SortConfig<User, keyof User>
        >({
            sortKey: undefined,
            sortDirection: undefined,
        })

        const columnsWithRenderers: ColumnDefinitionType<User, keyof User>[] = [
            { key: 'name', header: 'Name', width: 150 },
            {
                key: 'email',
                header: 'Email',
                width: 200,
                render: (value) => (
                    <a href={`mailto:${value}`} style={{ color: '#408bbd' }}>
                        {value}
                    </a>
                ),
            },
            {
                key: 'role',
                header: 'Role',
                width: 120,
                render: (value) => (
                    <span
                        style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            backgroundColor:
                                value === 'Admin'
                                    ? '#408bbd'
                                    : value === 'Manager'
                                    ? '#6c757d'
                                    : '#28a745',
                            color: 'white',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                        }}
                    >
                        {value}
                    </span>
                ),
            },
            {
                key: 'status',
                header: 'Status',
                width: 100,
                render: (value) => (
                    <span
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                        }}
                    >
                        <span
                            style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor:
                                    value === 'Active' ? '#28a745' : '#dc3545',
                            }}
                        />
                        {value}
                    </span>
                ),
            },
            {
                key: 'salary',
                header: 'Salary',
                width: 120,
                align: 'right',
                render: (value) => `$${value.toLocaleString()}`,
            },
        ]

        return (
            <Table
                rowDefinitions={largeDataset}
                columnDefinitions={columnsWithRenderers}
                pagination={pagination}
                onPaginationChange={setPagination}
                selectionMode="multiple"
                selectedRows={selected}
                onSelectionChange={setSelected}
                sortConfig={sortConfig}
                onSortChange={setSortConfig}
                searchable
                expandable
                renderExpandedRow={(row) => (
                    <div style={{ padding: '1rem' }}>
                        <p>
                            <strong>Join Date:</strong>{' '}
                            {row.data.joinDate.toDateString()}
                        </p>
                        <p>
                            <strong>Annual Salary:</strong> $
                            {row.data.salary.toLocaleString()}
                        </p>
                    </div>
                )}
                rowActions={[
                    {
                        label: 'Edit',
                        onClick: (row) => alert(`Edit: ${row.data.name}`),
                    },
                    {
                        label: 'Delete',
                        onClick: (row) => alert(`Delete: ${row.data.name}`),
                    },
                ]}
                bulkActions={[
                    {
                        label: 'Delete Selected',
                        onClick: (rows) => alert(`Delete ${rows.length} users`),
                    },
                    {
                        label: 'Export',
                        onClick: (rows) => alert(`Export ${rows.length} users`),
                    },
                ]}
                onRowClick={(row) => console.log('Row clicked:', row)}
            />
        )
    },
}
