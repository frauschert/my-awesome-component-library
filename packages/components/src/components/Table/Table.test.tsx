import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Table from './Table'
import {
    RowDefinitionType,
    ColumnDefinitionType,
    PaginationConfig,
} from './types'
import { ThemeProvider } from '../Theme'

// Test data
type TestData = {
    name: string
    age: number
    email: string
    active: boolean
}

const testRows: RowDefinitionType<TestData>[] = [
    {
        id: 1,
        data: { name: 'Alice', age: 30, email: 'alice@test.com', active: true },
    },
    {
        id: 2,
        data: { name: 'Bob', age: 25, email: 'bob@test.com', active: false },
    },
    {
        id: 3,
        data: {
            name: 'Charlie',
            age: 35,
            email: 'charlie@test.com',
            active: true,
        },
    },
]

const testColumns: ColumnDefinitionType<TestData, keyof TestData>[] = [
    { key: 'name', header: 'Name' },
    { key: 'age', header: 'Age' },
    { key: 'email', header: 'Email' },
    { key: 'active', header: 'Active' },
]

const renderWithTheme = (ui: React.ReactElement) => {
    return render(<ThemeProvider>{ui}</ThemeProvider>)
}

describe('Table Component', () => {
    describe('Rendering', () => {
        it('renders table with data', () => {
            renderWithTheme(
                <Table
                    rowDefinitions={testRows}
                    columnDefinitions={testColumns}
                />
            )

            expect(screen.getByRole('table')).toBeInTheDocument()
            expect(screen.getByText('Alice')).toBeInTheDocument()
            expect(screen.getByText('Bob')).toBeInTheDocument()
            expect(screen.getByText('Charlie')).toBeInTheDocument()
        })

        it('renders column headers', () => {
            renderWithTheme(
                <Table
                    rowDefinitions={testRows}
                    columnDefinitions={testColumns}
                />
            )

            expect(screen.getByText('Name')).toBeInTheDocument()
            expect(screen.getByText('Age')).toBeInTheDocument()
            expect(screen.getByText('Email')).toBeInTheDocument()
            expect(screen.getByText('Active')).toBeInTheDocument()
        })

        it('renders empty state when no data', () => {
            renderWithTheme(
                <Table rowDefinitions={[]} columnDefinitions={testColumns} />
            )

            expect(screen.getByText('No data available')).toBeInTheDocument()
        })

        it('renders custom empty message', () => {
            renderWithTheme(
                <Table
                    rowDefinitions={[]}
                    columnDefinitions={testColumns}
                    emptyMessage="No results found"
                />
            )

            expect(screen.getByText('No results found')).toBeInTheDocument()
        })
    })

    describe('Loading and Error States', () => {
        it('renders loading state', () => {
            renderWithTheme(
                <Table
                    rowDefinitions={testRows}
                    columnDefinitions={testColumns}
                    loading
                />
            )

            expect(screen.getByText('Loading...')).toBeInTheDocument()
            expect(screen.getByRole('status')).toBeInTheDocument()
        })

        it('renders custom loading message', () => {
            renderWithTheme(
                <Table
                    rowDefinitions={testRows}
                    columnDefinitions={testColumns}
                    loading
                    loadingMessage="Fetching data..."
                />
            )

            expect(screen.getByText('Fetching data...')).toBeInTheDocument()
        })

        it('renders error state', () => {
            renderWithTheme(
                <Table
                    rowDefinitions={testRows}
                    columnDefinitions={testColumns}
                    error="Failed to load"
                />
            )

            expect(screen.getByText('Failed to load')).toBeInTheDocument()
            expect(screen.getByRole('alert')).toBeInTheDocument()
        })
    })

    describe('Sorting', () => {
        it('calls onSortChange when column header is clicked', () => {
            const handleSortChange = jest.fn()

            renderWithTheme(
                <Table
                    rowDefinitions={testRows}
                    columnDefinitions={testColumns}
                    onSortChange={handleSortChange}
                />
            )

            const nameHeader = screen.getByText('Name').closest('th')
            fireEvent.click(nameHeader!)

            expect(handleSortChange).toHaveBeenCalledWith({
                sortKey: 'name',
                sortDirection: 'ascending',
            })
        })

        it('toggles sort direction', () => {
            const handleSortChange = jest.fn()
            const { rerender } = renderWithTheme(
                <Table
                    rowDefinitions={testRows}
                    columnDefinitions={testColumns}
                    sortConfig={{ sortKey: 'name', sortDirection: 'ascending' }}
                    onSortChange={handleSortChange}
                />
            )

            const nameHeader = screen.getByText('Name').closest('th')
            fireEvent.click(nameHeader!)

            expect(handleSortChange).toHaveBeenCalledWith({
                sortKey: 'name',
                sortDirection: 'descending',
            })
        })

        it('does not sort when sortable is false', () => {
            const handleSortChange = jest.fn()

            renderWithTheme(
                <Table
                    rowDefinitions={testRows}
                    columnDefinitions={testColumns}
                    sortable={false}
                    onSortChange={handleSortChange}
                />
            )

            const nameHeader = screen.getByText('Name').closest('th')
            fireEvent.click(nameHeader!)

            expect(handleSortChange).not.toHaveBeenCalled()
        })
    })

    describe('Search', () => {
        it('renders search input when searchable', () => {
            renderWithTheme(
                <Table
                    rowDefinitions={testRows}
                    columnDefinitions={testColumns}
                    searchable
                />
            )

            expect(screen.getByLabelText('Search table')).toBeInTheDocument()
        })

        it('does not render search input when searchable is false', () => {
            renderWithTheme(
                <Table
                    rowDefinitions={testRows}
                    columnDefinitions={testColumns}
                    searchable={false}
                />
            )

            expect(
                screen.queryByLabelText('Search table')
            ).not.toBeInTheDocument()
        })

        it('calls onSearchChange when typing', () => {
            const handleSearchChange = jest.fn()

            renderWithTheme(
                <Table
                    rowDefinitions={testRows}
                    columnDefinitions={testColumns}
                    searchable
                    onSearchChange={handleSearchChange}
                />
            )

            const searchInput = screen.getByLabelText('Search table')
            fireEvent.change(searchInput, { target: { value: 'Alice' } })

            expect(handleSearchChange).toHaveBeenCalledWith('Alice')
        })

        it('uses custom search placeholder', () => {
            renderWithTheme(
                <Table
                    rowDefinitions={testRows}
                    columnDefinitions={testColumns}
                    searchable
                    searchPlaceholder="Find users..."
                />
            )

            expect(
                screen.getByPlaceholderText('Find users...')
            ).toBeInTheDocument()
        })
    })

    describe('Selection', () => {
        describe('Single Selection', () => {
            it('renders radio buttons for single selection', () => {
                renderWithTheme(
                    <Table
                        rowDefinitions={testRows}
                        columnDefinitions={testColumns}
                        selectionMode="single"
                    />
                )

                const radios = screen.getAllByRole('radio')
                expect(radios).toHaveLength(testRows.length)
            })

            it('calls onSelectionChange when row is selected', () => {
                const handleSelectionChange = jest.fn()

                renderWithTheme(
                    <Table
                        rowDefinitions={testRows}
                        columnDefinitions={testColumns}
                        selectionMode="single"
                        onSelectionChange={handleSelectionChange}
                    />
                )

                const firstRadio = screen.getAllByRole('radio')[0]
                fireEvent.click(firstRadio)

                expect(handleSelectionChange).toHaveBeenCalledWith([1])
            })
        })

        describe('Multiple Selection', () => {
            it('renders checkboxes for multiple selection', () => {
                renderWithTheme(
                    <Table
                        rowDefinitions={testRows}
                        columnDefinitions={testColumns}
                        selectionMode="multiple"
                    />
                )

                // +1 for select-all checkbox
                const checkboxes = screen.getAllByRole('checkbox')
                expect(checkboxes).toHaveLength(testRows.length + 1)
            })

            it('calls onSelectionChange when row is selected', () => {
                const handleSelectionChange = jest.fn()

                renderWithTheme(
                    <Table
                        rowDefinitions={testRows}
                        columnDefinitions={testColumns}
                        selectionMode="multiple"
                        onSelectionChange={handleSelectionChange}
                    />
                )

                const checkboxes = screen.getAllByRole('checkbox')
                const firstRowCheckbox = checkboxes[1] // Skip select-all

                fireEvent.click(firstRowCheckbox)

                expect(handleSelectionChange).toHaveBeenCalledWith([1])
            })

            it('selects all rows when select-all is clicked', () => {
                const handleSelectionChange = jest.fn()

                renderWithTheme(
                    <Table
                        rowDefinitions={testRows}
                        columnDefinitions={testColumns}
                        selectionMode="multiple"
                        onSelectionChange={handleSelectionChange}
                    />
                )

                const selectAllCheckbox = screen.getByRole('checkbox', {
                    name: 'Select all rows',
                }) as HTMLInputElement
                fireEvent.click(selectAllCheckbox)

                expect(handleSelectionChange).toHaveBeenCalledWith([1, 2, 3])
            })

            it('does not select disabled rows', () => {
                const rowsWithDisabled: RowDefinitionType<TestData>[] = [
                    ...testRows.slice(0, 2),
                    { ...testRows[2], disabled: true },
                ]

                const handleSelectionChange = jest.fn()

                renderWithTheme(
                    <Table
                        rowDefinitions={rowsWithDisabled}
                        columnDefinitions={testColumns}
                        selectionMode="multiple"
                        onSelectionChange={handleSelectionChange}
                    />
                )

                const selectAllCheckbox = screen.getByRole('checkbox', {
                    name: 'Select all rows',
                }) as HTMLInputElement
                fireEvent.click(selectAllCheckbox)

                // Should only select non-disabled rows
                expect(handleSelectionChange).toHaveBeenCalledWith([1, 2])
            })
        })

        describe('No Selection', () => {
            it('does not render selection controls', () => {
                renderWithTheme(
                    <Table
                        rowDefinitions={testRows}
                        columnDefinitions={testColumns}
                        selectionMode="none"
                    />
                )

                expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
                expect(screen.queryByRole('radio')).not.toBeInTheDocument()
            })
        })
    })

    describe('Pagination', () => {
        it('renders pagination controls', () => {
            const pagination: PaginationConfig = {
                page: 1,
                pageSize: 2,
                totalRows: 3,
            }

            renderWithTheme(
                <Table
                    rowDefinitions={testRows}
                    columnDefinitions={testColumns}
                    pagination={pagination}
                />
            )

            expect(
                screen.getByText('Showing 1 to 2 of 3 rows')
            ).toBeInTheDocument()
            expect(screen.getByLabelText('Previous page')).toBeInTheDocument()
            expect(screen.getByLabelText('Next page')).toBeInTheDocument()
        })

        it('calls onPaginationChange when page is changed', () => {
            const handlePaginationChange = jest.fn()
            const pagination: PaginationConfig = {
                page: 1,
                pageSize: 2,
                totalRows: 3,
            }

            renderWithTheme(
                <Table
                    rowDefinitions={testRows}
                    columnDefinitions={testColumns}
                    pagination={pagination}
                    onPaginationChange={handlePaginationChange}
                />
            )

            const nextButton = screen.getByLabelText('Next page')
            fireEvent.click(nextButton)

            expect(handlePaginationChange).toHaveBeenCalledWith({
                page: 2,
                pageSize: 2,
                totalRows: 3,
            })
        })

        it('disables previous button on first page', () => {
            const pagination: PaginationConfig = {
                page: 1,
                pageSize: 2,
                totalRows: 3,
            }

            renderWithTheme(
                <Table
                    rowDefinitions={testRows}
                    columnDefinitions={testColumns}
                    pagination={pagination}
                />
            )

            const prevButton = screen.getByLabelText('Previous page')
            expect(prevButton).toBeDisabled()
        })

        it('disables next button on last page', () => {
            const pagination: PaginationConfig = {
                page: 2,
                pageSize: 2,
                totalRows: 3,
            }

            renderWithTheme(
                <Table
                    rowDefinitions={testRows}
                    columnDefinitions={testColumns}
                    pagination={pagination}
                />
            )

            const nextButton = screen.getByLabelText('Next page')
            expect(nextButton).toBeDisabled()
        })

        it('changes page size', () => {
            const handlePaginationChange = jest.fn()
            const pagination: PaginationConfig = {
                page: 1,
                pageSize: 2,
                totalRows: 3,
            }

            renderWithTheme(
                <Table
                    rowDefinitions={testRows}
                    columnDefinitions={testColumns}
                    pagination={pagination}
                    onPaginationChange={handlePaginationChange}
                />
            )

            const pageSizeSelect = screen.getByRole(
                'combobox'
            ) as HTMLSelectElement
            fireEvent.change(pageSizeSelect, { target: { value: '10' } })

            expect(handlePaginationChange).toHaveBeenCalledWith({
                page: 1,
                pageSize: 10,
                totalRows: 3,
            })
        })
    })

    describe('Custom Cell Renderers', () => {
        it('renders custom cell content', () => {
            const columnsWithRenderer: ColumnDefinitionType<
                TestData,
                keyof TestData
            >[] = [
                {
                    key: 'name',
                    header: 'Name',
                    render: (value) => (
                        <strong data-testid="custom-cell">{value}</strong>
                    ),
                },
                { key: 'age', header: 'Age' },
            ]

            renderWithTheme(
                <Table
                    rowDefinitions={testRows}
                    columnDefinitions={columnsWithRenderer}
                />
            )

            const customCells = screen.getAllByTestId('custom-cell')
            expect(customCells).toHaveLength(testRows.length)
            expect(customCells[0]).toHaveTextContent('Alice')
        })

        it('renders boolean values correctly', () => {
            renderWithTheme(
                <Table
                    rowDefinitions={testRows}
                    columnDefinitions={testColumns}
                />
            )

            expect(screen.getAllByText('Yes')).toHaveLength(2) // Alice and Charlie
            expect(screen.getByText('No')).toBeInTheDocument() // Bob
        })
    })

    describe('Row Actions', () => {
        it('renders row actions', () => {
            renderWithTheme(
                <Table
                    rowDefinitions={testRows}
                    columnDefinitions={testColumns}
                    rowActions={[
                        { label: 'Edit', onClick: jest.fn() },
                        { label: 'Delete', onClick: jest.fn() },
                    ]}
                />
            )

            expect(screen.getAllByLabelText('Edit')).toHaveLength(
                testRows.length
            )
            expect(screen.getAllByLabelText('Delete')).toHaveLength(
                testRows.length
            )
        })

        it('calls action onClick when clicked', () => {
            const handleEdit = jest.fn()

            renderWithTheme(
                <Table
                    rowDefinitions={testRows}
                    columnDefinitions={testColumns}
                    rowActions={[{ label: 'Edit', onClick: handleEdit }]}
                />
            )

            const editButtons = screen.getAllByLabelText('Edit')
            fireEvent.click(editButtons[0])

            expect(handleEdit).toHaveBeenCalledWith(testRows[0])
        })

        it('disables actions conditionally', () => {
            renderWithTheme(
                <Table
                    rowDefinitions={testRows}
                    columnDefinitions={testColumns}
                    rowActions={[
                        {
                            label: 'Delete',
                            onClick: jest.fn(),
                            disabled: (row) => row.data.active,
                        },
                    ]}
                />
            )

            const deleteButtons = screen.getAllByLabelText('Delete')
            expect(deleteButtons[0]).toBeDisabled() // Alice is active
            expect(deleteButtons[1]).not.toBeDisabled() // Bob is not active
            expect(deleteButtons[2]).toBeDisabled() // Charlie is active
        })

        it('hides actions conditionally', () => {
            renderWithTheme(
                <Table
                    rowDefinitions={testRows}
                    columnDefinitions={testColumns}
                    rowActions={[
                        {
                            label: 'Edit',
                            onClick: jest.fn(),
                            hidden: (row) => !row.data.active,
                        },
                    ]}
                />
            )

            const editButtons = screen.queryAllByLabelText('Edit')
            expect(editButtons).toHaveLength(2) // Only Alice and Charlie
        })
    })

    describe('Bulk Actions', () => {
        it('shows bulk actions when rows are selected', () => {
            renderWithTheme(
                <Table
                    rowDefinitions={testRows}
                    columnDefinitions={testColumns}
                    selectionMode="multiple"
                    selectedRows={[1, 2]}
                    bulkActions={[
                        { label: 'Delete Selected', onClick: jest.fn() },
                    ]}
                />
            )

            expect(screen.getByText('2 selected')).toBeInTheDocument()
            expect(screen.getByText('Delete Selected')).toBeInTheDocument()
        })

        it('calls bulk action onClick with selected rows', () => {
            const handleBulkDelete = jest.fn()

            renderWithTheme(
                <Table
                    rowDefinitions={testRows}
                    columnDefinitions={testColumns}
                    selectionMode="multiple"
                    selectedRows={[1, 2]}
                    bulkActions={[
                        { label: 'Delete Selected', onClick: handleBulkDelete },
                    ]}
                />
            )

            const deleteButton = screen.getByText('Delete Selected')
            fireEvent.click(deleteButton)

            expect(handleBulkDelete).toHaveBeenCalledWith([
                testRows[0],
                testRows[1],
            ])
        })
    })

    describe('Expandable Rows', () => {
        it('renders expand buttons when expandable', () => {
            renderWithTheme(
                <Table
                    rowDefinitions={testRows}
                    columnDefinitions={testColumns}
                    expandable
                    renderExpandedRow={() => <div>Expanded content</div>}
                />
            )

            const expandButtons = screen.getAllByLabelText('Expand row')
            expect(expandButtons).toHaveLength(testRows.length)
        })

        it('shows expanded content when expand button is clicked', () => {
            renderWithTheme(
                <Table
                    rowDefinitions={testRows}
                    columnDefinitions={testColumns}
                    expandable
                    renderExpandedRow={(row) => (
                        <div>{row.data.name} details</div>
                    )}
                />
            )

            const firstExpandButton = screen.getAllByLabelText('Expand row')[0]
            fireEvent.click(firstExpandButton)

            expect(screen.getByText('Alice details')).toBeInTheDocument()
        })
    })

    describe('Row Interactions', () => {
        it('calls onRowClick when row is clicked', () => {
            const handleRowClick = jest.fn()

            renderWithTheme(
                <Table
                    rowDefinitions={testRows}
                    columnDefinitions={testColumns}
                    onRowClick={handleRowClick}
                />
            )

            const rows = screen.getAllByRole('row')
            // Skip header row
            fireEvent.click(rows[1])

            expect(handleRowClick).toHaveBeenCalledWith(testRows[0])
        })

        it('calls onRowDoubleClick when row is double-clicked', () => {
            const handleRowDoubleClick = jest.fn()

            renderWithTheme(
                <Table
                    rowDefinitions={testRows}
                    columnDefinitions={testColumns}
                    onRowDoubleClick={handleRowDoubleClick}
                />
            )

            const rows = screen.getAllByRole('row')
            fireEvent.doubleClick(rows[1])

            expect(handleRowDoubleClick).toHaveBeenCalledWith(testRows[0])
        })
    })

    describe('Styling Options', () => {
        it('applies sticky header class', () => {
            const { container } = renderWithTheme(
                <Table
                    rowDefinitions={testRows}
                    columnDefinitions={testColumns}
                    stickyHeader
                />
            )

            expect(
                container.querySelector('.table-container--sticky-header')
            ).toBeInTheDocument()
        })

        it('applies striped class', () => {
            const { container } = renderWithTheme(
                <Table
                    rowDefinitions={testRows}
                    columnDefinitions={testColumns}
                    striped
                />
            )

            expect(
                container.querySelector('.table--striped')
            ).toBeInTheDocument()
        })

        it('applies bordered class', () => {
            const { container } = renderWithTheme(
                <Table
                    rowDefinitions={testRows}
                    columnDefinitions={testColumns}
                    bordered
                />
            )

            expect(
                container.querySelector('.table--bordered')
            ).toBeInTheDocument()
        })

        it('applies compact class', () => {
            const { container } = renderWithTheme(
                <Table
                    rowDefinitions={testRows}
                    columnDefinitions={testColumns}
                    compact
                />
            )

            expect(
                container.querySelector('.table--compact')
            ).toBeInTheDocument()
        })
    })

    describe('Accessibility', () => {
        it('has correct ARIA roles', () => {
            renderWithTheme(
                <Table
                    rowDefinitions={testRows}
                    columnDefinitions={testColumns}
                />
            )

            expect(screen.getByRole('region')).toBeInTheDocument()
            expect(screen.getByRole('table')).toBeInTheDocument()
        })

        it('uses custom aria-label', () => {
            renderWithTheme(
                <Table
                    rowDefinitions={testRows}
                    columnDefinitions={testColumns}
                    ariaLabel="Users table"
                />
            )

            const region = screen.getByRole('region', { name: 'Users table' })
            expect(region).toBeInTheDocument()
            expect(region).toHaveAttribute('aria-label', 'Users table')
        })

        it('sets aria-sort on sorted columns', () => {
            renderWithTheme(
                <Table
                    rowDefinitions={testRows}
                    columnDefinitions={testColumns}
                    sortConfig={{ sortKey: 'name', sortDirection: 'ascending' }}
                />
            )

            const nameHeader = screen.getByText('Name').closest('th')
            expect(nameHeader).toHaveAttribute('aria-sort', 'ascending')
        })
    })
})
