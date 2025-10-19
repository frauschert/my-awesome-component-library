import type { Meta, StoryObj } from '@storybook/react'
import DataGrid from './DataGrid'

interface User extends Record<string, unknown> {
    id: number
    name: string
    email: string
    role: string
    department: string
    salary: number
    joinDate: string
    status: 'active' | 'inactive'
}

const generateUsers = (count: number): User[] => {
    const roles = ['Admin', 'Developer', 'Designer', 'Manager', 'Analyst']
    const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance']
    const statuses: ('active' | 'inactive')[] = ['active', 'inactive']

    return Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        role: roles[i % roles.length],
        department: departments[i % departments.length],
        salary: 50000 + Math.floor(Math.random() * 100000),
        joinDate: new Date(2020 + Math.floor(i / 365), i % 12, 1)
            .toISOString()
            .split('T')[0],
        status: statuses[i % statuses.length],
    }))
}

const smallData = generateUsers(10)
const largeData = generateUsers(10000)

const meta: Meta<typeof DataGrid> = {
    title: 'Components/DataGrid',
    component: DataGrid,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof DataGrid>

export const Basic: Story = {
    args: {
        data: smallData,
        columns: [
            { id: 'id', header: 'ID', accessor: 'id', width: 80 },
            { id: 'name', header: 'Name', accessor: 'name', width: 150 },
            { id: 'email', header: 'Email', accessor: 'email', width: 220 },
            { id: 'role', header: 'Role', accessor: 'role', width: 120 },
            {
                id: 'department',
                header: 'Department',
                accessor: 'department',
                width: 150,
            },
        ],
        height: 400,
    },
}

export const WithVirtualScrolling: Story = {
    args: {
        data: largeData,
        columns: [
            { id: 'id', header: 'ID', accessor: 'id', width: 80 },
            { id: 'name', header: 'Name', accessor: 'name', width: 150 },
            { id: 'email', header: 'Email', accessor: 'email', width: 220 },
            { id: 'role', header: 'Role', accessor: 'role', width: 120 },
            {
                id: 'department',
                header: 'Department',
                accessor: 'department',
                width: 150,
            },
            {
                id: 'salary',
                header: 'Salary',
                accessor: 'salary',
                width: 120,
                cell: (value) => `$${(value as number).toLocaleString()}`,
            },
        ],
        virtualScroll: true,
        height: 500,
    },
}

export const WithPinnedColumns: Story = {
    args: {
        data: smallData,
        columns: [
            {
                id: 'id',
                header: 'ID',
                accessor: 'id',
                width: 80,
                pinned: 'left',
            },
            {
                id: 'name',
                header: 'Name',
                accessor: 'name',
                width: 150,
                pinned: 'left',
            },
            { id: 'email', header: 'Email', accessor: 'email', width: 220 },
            { id: 'role', header: 'Role', accessor: 'role', width: 120 },
            {
                id: 'department',
                header: 'Department',
                accessor: 'department',
                width: 150,
            },
            { id: 'salary', header: 'Salary', accessor: 'salary', width: 120 },
            {
                id: 'status',
                header: 'Status',
                accessor: 'status',
                width: 100,
                pinned: 'right',
            },
        ],
        height: 400,
    },
}

export const WithResizableColumns: Story = {
    args: {
        data: smallData,
        columns: [
            {
                id: 'id',
                header: 'ID',
                accessor: 'id',
                width: 80,
                resizable: true,
            },
            {
                id: 'name',
                header: 'Name',
                accessor: 'name',
                width: 150,
                resizable: true,
            },
            {
                id: 'email',
                header: 'Email',
                accessor: 'email',
                width: 220,
                resizable: true,
            },
            {
                id: 'role',
                header: 'Role',
                accessor: 'role',
                width: 120,
                resizable: true,
            },
            {
                id: 'department',
                header: 'Department',
                accessor: 'department',
                width: 150,
                resizable: true,
            },
        ],
        resizable: true,
        height: 400,
        onColumnResize: (columnId, width) => {
            console.log('Column resized:', columnId, width)
        },
    },
}

export const WithReorderableColumns: Story = {
    args: {
        data: smallData,
        columns: [
            { id: 'id', header: 'ID', accessor: 'id', width: 80 },
            { id: 'name', header: 'Name', accessor: 'name', width: 150 },
            { id: 'email', header: 'Email', accessor: 'email', width: 220 },
            { id: 'role', header: 'Role', accessor: 'role', width: 120 },
            {
                id: 'department',
                header: 'Department',
                accessor: 'department',
                width: 150,
            },
        ],
        reorderable: true,
        height: 400,
        onColumnReorder: (columnIds) => {
            console.log('Columns reordered:', columnIds)
        },
    },
}

export const WithSorting: Story = {
    args: {
        data: smallData,
        columns: [
            {
                id: 'id',
                header: 'ID',
                accessor: 'id',
                width: 80,
                sortable: true,
            },
            {
                id: 'name',
                header: 'Name',
                accessor: 'name',
                width: 150,
                sortable: true,
            },
            {
                id: 'email',
                header: 'Email',
                accessor: 'email',
                width: 220,
                sortable: true,
            },
            {
                id: 'role',
                header: 'Role',
                accessor: 'role',
                width: 120,
                sortable: true,
            },
            {
                id: 'department',
                header: 'Department',
                accessor: 'department',
                width: 150,
                sortable: true,
            },
            {
                id: 'salary',
                header: 'Salary',
                accessor: 'salary',
                width: 120,
                sortable: true,
                cell: (value) => `$${(value as number).toLocaleString()}`,
            },
        ],
        sortable: true,
        height: 400,
        onSortChange: (sortBy) => {
            console.log('Sort changed:', sortBy)
        },
    },
}

export const WithCustomCellRenderer: Story = {
    args: {
        data: smallData,
        columns: [
            { id: 'id', header: 'ID', accessor: 'id', width: 80 },
            { id: 'name', header: 'Name', accessor: 'name', width: 150 },
            { id: 'email', header: 'Email', accessor: 'email', width: 220 },
            {
                id: 'salary',
                header: 'Salary',
                accessor: 'salary',
                width: 120,
                cell: (value) => (
                    <span
                        style={{
                            color:
                                (value as number) > 100000
                                    ? 'green'
                                    : 'inherit',
                        }}
                    >
                        ${(value as number).toLocaleString()}
                    </span>
                ),
            },
            {
                id: 'status',
                header: 'Status',
                accessor: 'status',
                width: 100,
                cell: (value) => (
                    <span
                        style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            backgroundColor:
                                value === 'active' ? '#e7f7ed' : '#fee',
                            color: value === 'active' ? '#0f6d31' : '#c41e3a',
                        }}
                    >
                        {value as string}
                    </span>
                ),
            },
        ],
        height: 400,
    },
}

export const StripedAndBordered: Story = {
    args: {
        data: smallData,
        columns: [
            { id: 'id', header: 'ID', accessor: 'id', width: 80 },
            { id: 'name', header: 'Name', accessor: 'name', width: 150 },
            { id: 'email', header: 'Email', accessor: 'email', width: 220 },
            { id: 'role', header: 'Role', accessor: 'role', width: 120 },
            {
                id: 'department',
                header: 'Department',
                accessor: 'department',
                width: 150,
            },
        ],
        striped: true,
        bordered: true,
        height: 400,
    },
}

export const WithStickyHeader: Story = {
    args: {
        data: generateUsers(50),
        columns: [
            { id: 'id', header: 'ID', accessor: 'id', width: 80 },
            { id: 'name', header: 'Name', accessor: 'name', width: 150 },
            { id: 'email', header: 'Email', accessor: 'email', width: 220 },
            { id: 'role', header: 'Role', accessor: 'role', width: 120 },
            {
                id: 'department',
                header: 'Department',
                accessor: 'department',
                width: 150,
            },
            {
                id: 'salary',
                header: 'Salary',
                accessor: 'salary',
                width: 120,
                cell: (value) => `$${(value as number).toLocaleString()}`,
            },
        ],
        stickyHeader: true,
        height: 400,
    },
}

export const EmptyState: Story = {
    args: {
        data: [],
        columns: [
            { id: 'id', header: 'ID', accessor: 'id', width: 80 },
            { id: 'name', header: 'Name', accessor: 'name', width: 150 },
            { id: 'email', header: 'Email', accessor: 'email', width: 220 },
        ],
        height: 400,
        emptyMessage: 'No data available',
    },
}

export const LoadingState: Story = {
    args: {
        data: smallData,
        columns: [
            { id: 'id', header: 'ID', accessor: 'id', width: 80 },
            { id: 'name', header: 'Name', accessor: 'name', width: 150 },
            { id: 'email', header: 'Email', accessor: 'email', width: 220 },
        ],
        loading: true,
        height: 400,
    },
}

export const FullFeatured: Story = {
    args: {
        data: largeData,
        columns: [
            {
                id: 'id',
                header: 'ID',
                accessor: 'id',
                width: 80,
                pinned: 'left',
                sortable: true,
            },
            {
                id: 'name',
                header: 'Name',
                accessor: 'name',
                width: 150,
                resizable: true,
                sortable: true,
            },
            {
                id: 'email',
                header: 'Email',
                accessor: 'email',
                width: 220,
                resizable: true,
                sortable: true,
            },
            {
                id: 'role',
                header: 'Role',
                accessor: 'role',
                width: 120,
                resizable: true,
                sortable: true,
            },
            {
                id: 'department',
                header: 'Department',
                accessor: 'department',
                width: 150,
                resizable: true,
                sortable: true,
            },
            {
                id: 'salary',
                header: 'Salary',
                accessor: 'salary',
                width: 120,
                resizable: true,
                sortable: true,
                cell: (value) => `$${(value as number).toLocaleString()}`,
            },
            {
                id: 'joinDate',
                header: 'Join Date',
                accessor: 'joinDate',
                width: 120,
                sortable: true,
            },
            {
                id: 'status',
                header: 'Status',
                accessor: 'status',
                width: 100,
                pinned: 'right',
                cell: (value) => (
                    <span
                        style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            backgroundColor:
                                value === 'active' ? '#e7f7ed' : '#fee',
                            color: value === 'active' ? '#0f6d31' : '#c41e3a',
                        }}
                    >
                        {value as string}
                    </span>
                ),
            },
        ],
        virtualScroll: true,
        resizable: true,
        reorderable: true,
        sortable: true,
        stickyHeader: true,
        striped: true,
        bordered: true,
        height: 600,
        onColumnResize: (columnId, width) => {
            console.log('Column resized:', columnId, width)
        },
        onColumnReorder: (columnIds) => {
            console.log('Columns reordered:', columnIds)
        },
        onSortChange: (sortBy) => {
            console.log('Sort changed:', sortBy)
        },
    },
}
