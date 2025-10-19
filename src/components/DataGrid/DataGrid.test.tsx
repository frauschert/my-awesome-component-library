import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import DataGrid from './DataGrid'
import type { DataGridColumn } from './DataGrid'

interface TestData extends Record<string, unknown> {
    id: number
    name: string
    age: number
}

const testData: TestData[] = [
    { id: 1, name: 'Alice', age: 30 },
    { id: 2, name: 'Bob', age: 25 },
    { id: 3, name: 'Charlie', age: 35 },
]

const testColumns: DataGridColumn<TestData>[] = [
    { id: 'id', header: 'ID', accessor: 'id', width: 80 },
    { id: 'name', header: 'Name', accessor: 'name', width: 150 },
    { id: 'age', header: 'Age', accessor: 'age', width: 100 },
]

describe('DataGrid', () => {
    describe('Rendering', () => {
        it('should render with data', () => {
            render(<DataGrid data={testData} columns={testColumns} />)

            expect(screen.getByText('ID')).toBeInTheDocument()
            expect(screen.getByText('Name')).toBeInTheDocument()
            expect(screen.getByText('Age')).toBeInTheDocument()
            expect(screen.getByText('Alice')).toBeInTheDocument()
            expect(screen.getByText('Bob')).toBeInTheDocument()
        })

        it('should render empty state when no data', () => {
            render(
                <DataGrid
                    data={[]}
                    columns={testColumns}
                    emptyMessage="No data"
                />
            )

            expect(screen.getByText('No data')).toBeInTheDocument()
        })

        it('should render loading state', () => {
            render(<DataGrid data={testData} columns={testColumns} loading />)

            expect(screen.getByText('Loading...')).toBeInTheDocument()
        })

        it('should apply custom className', () => {
            const { container } = render(
                <DataGrid
                    data={testData}
                    columns={testColumns}
                    className="custom-grid"
                />
            )

            expect(container.querySelector('.datagrid')).toHaveClass(
                'custom-grid'
            )
        })

        it('should render with striped rows', () => {
            const { container } = render(
                <DataGrid data={testData} columns={testColumns} striped />
            )

            expect(container.querySelector('.datagrid')).toHaveClass(
                'datagrid--striped'
            )
        })

        it('should render with borders', () => {
            const { container } = render(
                <DataGrid data={testData} columns={testColumns} bordered />
            )

            expect(container.querySelector('.datagrid')).toHaveClass(
                'datagrid--bordered'
            )
        })

        it('should apply sticky header', () => {
            const { container } = render(
                <DataGrid data={testData} columns={testColumns} stickyHeader />
            )

            expect(container.querySelector('.datagrid__header')).toHaveClass(
                'datagrid__header--sticky'
            )
        })
    })

    describe('Custom Cell Renderers', () => {
        it('should use custom cell renderer', () => {
            const customColumns: DataGridColumn<TestData>[] = [
                { id: 'id', header: 'ID', accessor: 'id', width: 80 },
                {
                    id: 'name',
                    header: 'Name',
                    accessor: 'name',
                    width: 150,
                    cell: (value) => <span>Custom: {value as string}</span>,
                },
            ]

            render(<DataGrid data={testData} columns={customColumns} />)

            expect(screen.getByText('Custom: Alice')).toBeInTheDocument()
        })

        it('should use function accessor', () => {
            const customColumns: DataGridColumn<TestData>[] = [
                { id: 'id', header: 'ID', accessor: 'id', width: 80 },
                {
                    id: 'fullInfo',
                    header: 'Full Info',
                    accessor: (row) => `${row.name} (${row.age})`,
                    width: 200,
                },
            ]

            render(<DataGrid data={testData} columns={customColumns} />)

            expect(screen.getByText('Alice (30)')).toBeInTheDocument()
        })
    })

    describe('Sorting', () => {
        it('should render sort indicators when sortable', () => {
            const sortableColumns = testColumns.map((col) => ({
                ...col,
                sortable: true,
            }))

            render(
                <DataGrid data={testData} columns={sortableColumns} sortable />
            )

            const headers = screen.getAllByRole('columnheader')
            headers.forEach((header) => {
                expect(header).toHaveClass('datagrid__header-cell--sortable')
            })
        })

        it('should call onSortChange when header clicked', () => {
            const onSortChange = jest.fn()
            const sortableColumns = testColumns.map((col) => ({
                ...col,
                sortable: true,
            }))

            render(
                <DataGrid
                    data={testData}
                    columns={sortableColumns}
                    sortable
                    onSortChange={onSortChange}
                />
            )

            fireEvent.click(screen.getByText('Name'))

            expect(onSortChange).toHaveBeenCalledWith({
                columnId: 'name',
                direction: 'asc',
            })
        })

        it('should toggle sort direction on multiple clicks', () => {
            const onSortChange = jest.fn()
            const sortableColumns = testColumns.map((col) => ({
                ...col,
                sortable: true,
            }))

            const { rerender } = render(
                <DataGrid
                    data={testData}
                    columns={sortableColumns}
                    sortable
                    onSortChange={onSortChange}
                    sortBy={{ columnId: 'name', direction: 'asc' }}
                />
            )

            const nameHeader = screen.getByText('Name')

            fireEvent.click(nameHeader)
            expect(onSortChange).toHaveBeenCalledWith({
                columnId: 'name',
                direction: 'desc',
            })

            rerender(
                <DataGrid
                    data={testData}
                    columns={sortableColumns}
                    sortable
                    onSortChange={onSortChange}
                    sortBy={{ columnId: 'name', direction: 'desc' }}
                />
            )

            fireEvent.click(nameHeader)
            expect(onSortChange).toHaveBeenCalledWith(null)
        })

        it('should sort data internally', () => {
            const sortableColumns = testColumns.map((col) => ({
                ...col,
                sortable: true,
            }))

            const { rerender } = render(
                <DataGrid
                    data={testData}
                    columns={sortableColumns}
                    sortable
                    sortBy={{ columnId: 'name', direction: 'asc' }}
                />
            )

            const rows = screen.getAllByRole('row').slice(1) // Skip header
            expect(rows[0]).toHaveTextContent('Alice')
            expect(rows[1]).toHaveTextContent('Bob')
            expect(rows[2]).toHaveTextContent('Charlie')

            rerender(
                <DataGrid
                    data={testData}
                    columns={sortableColumns}
                    sortable
                    sortBy={{ columnId: 'name', direction: 'desc' }}
                />
            )

            const rowsDesc = screen.getAllByRole('row').slice(1)
            expect(rowsDesc[0]).toHaveTextContent('Charlie')
            expect(rowsDesc[1]).toHaveTextContent('Bob')
            expect(rowsDesc[2]).toHaveTextContent('Alice')
        })
    })

    describe('Column Resizing', () => {
        it('should show resize handles when resizable', () => {
            const resizableColumns = testColumns.map((col) => ({
                ...col,
                resizable: true,
            }))

            const { container } = render(
                <DataGrid
                    data={testData}
                    columns={resizableColumns}
                    resizable
                />
            )

            const handles = container.querySelectorAll(
                '.datagrid__resize-handle'
            )
            expect(handles.length).toBeGreaterThan(0)
        })

        it('should call onColumnResize when resize handle dragged', () => {
            const onColumnResize = jest.fn()
            const resizableColumns = testColumns.map((col) => ({
                ...col,
                resizable: true,
            }))

            const { container } = render(
                <DataGrid
                    data={testData}
                    columns={resizableColumns}
                    resizable
                    onColumnResize={onColumnResize}
                />
            )

            const handle = container.querySelector(
                '.datagrid__resize-handle'
            ) as Element

            fireEvent.mouseDown(handle, { clientX: 100 })
            fireEvent.mouseMove(document, { clientX: 150 })
            fireEvent.mouseUp(document)

            expect(onColumnResize).toHaveBeenCalled()
        })
    })

    describe('Column Reordering', () => {
        it('should make headers draggable when reorderable', () => {
            const { container } = render(
                <DataGrid data={testData} columns={testColumns} reorderable />
            )

            const headers = container.querySelectorAll('.datagrid__header-cell')
            headers.forEach((header) => {
                expect(header).toHaveAttribute('draggable', 'true')
            })
        })

        it('should call onColumnReorder when columns reordered', () => {
            const onColumnReorder = jest.fn()

            render(
                <DataGrid
                    data={testData}
                    columns={testColumns}
                    reorderable
                    onColumnReorder={onColumnReorder}
                />
            )

            const nameHeader = screen.getByText('Name')
            const ageHeader = screen.getByText('Age')

            fireEvent.dragStart(nameHeader)
            fireEvent.dragOver(ageHeader)
            fireEvent.drop(ageHeader)

            expect(onColumnReorder).toHaveBeenCalled()
        })
    })

    describe('Pinned Columns', () => {
        it('should render pinned left columns', () => {
            const pinnedColumns: DataGridColumn<TestData>[] = [
                {
                    id: 'id',
                    header: 'ID',
                    accessor: 'id',
                    width: 80,
                    pinned: 'left',
                },
                { id: 'name', header: 'Name', accessor: 'name', width: 150 },
                { id: 'age', header: 'Age', accessor: 'age', width: 100 },
            ]

            const { container } = render(
                <DataGrid data={testData} columns={pinnedColumns} />
            )

            expect(
                container.querySelector('.datagrid__pinned-left')
            ).toBeInTheDocument()
        })

        it('should render pinned right columns', () => {
            const pinnedColumns: DataGridColumn<TestData>[] = [
                { id: 'id', header: 'ID', accessor: 'id', width: 80 },
                { id: 'name', header: 'Name', accessor: 'name', width: 150 },
                {
                    id: 'age',
                    header: 'Age',
                    accessor: 'age',
                    width: 100,
                    pinned: 'right',
                },
            ]

            const { container } = render(
                <DataGrid data={testData} columns={pinnedColumns} />
            )

            expect(
                container.querySelector('.datagrid__pinned-right')
            ).toBeInTheDocument()
        })

        it('should render center columns', () => {
            const { container } = render(
                <DataGrid data={testData} columns={testColumns} />
            )

            expect(
                container.querySelector('.datagrid__center')
            ).toBeInTheDocument()
        })
    })

    describe('Virtual Scrolling', () => {
        it('should render only visible rows when virtual scrolling enabled', () => {
            const largeData = Array.from({ length: 1000 }, (_, i) => ({
                id: i,
                name: `User ${i}`,
                age: 20 + (i % 50),
            }))

            const { container } = render(
                <DataGrid
                    data={largeData}
                    columns={testColumns}
                    virtualScroll
                    height={400}
                    rowHeight={48}
                />
            )

            const rows = container.querySelectorAll('.datagrid__row')
            // Should render only visible rows, not all 1000
            expect(rows.length).toBeLessThan(1000)
        })

        it('should apply viewport transform for virtual scrolling', () => {
            const largeData = Array.from({ length: 1000 }, (_, i) => ({
                id: i,
                name: `User ${i}`,
                age: 20 + (i % 50),
            }))

            const { container } = render(
                <DataGrid
                    data={largeData}
                    columns={testColumns}
                    virtualScroll
                    height={400}
                    rowHeight={48}
                />
            )

            const rows = container.querySelector(
                '.datagrid__rows'
            ) as HTMLElement
            const transform = rows?.style.transform || ''
            expect(transform).toMatch(/translateY\(-?\d+px\)/)
        })
    })

    describe('Height and Sizing', () => {
        it('should apply numeric height', () => {
            const { container } = render(
                <DataGrid data={testData} columns={testColumns} height={400} />
            )

            expect(container.querySelector('.datagrid')).toHaveStyle({
                height: '400px',
            })
        })

        it('should apply string height', () => {
            const { container } = render(
                <DataGrid data={testData} columns={testColumns} height="50vh" />
            )

            expect(container.querySelector('.datagrid')).toHaveStyle({
                height: '50vh',
            })
        })

        it('should apply column widths', () => {
            const { container } = render(
                <DataGrid data={testData} columns={testColumns} />
            )

            const firstColumn = container.querySelector('.datagrid__column')
            expect(firstColumn).toHaveStyle({ width: '80px' })
        })
    })

    describe('Accessibility', () => {
        it('should have proper ARIA roles', () => {
            render(<DataGrid data={testData} columns={testColumns} />)

            expect(screen.getByRole('table')).toBeInTheDocument()
            expect(screen.getAllByRole('row').length).toBeGreaterThan(0)
            expect(screen.getAllByRole('columnheader').length).toBe(3)
        })

        it('should have proper ARIA sort attributes', () => {
            const sortableColumns = testColumns.map((col) => ({
                ...col,
                sortable: true,
            }))

            render(
                <DataGrid
                    data={testData}
                    columns={sortableColumns}
                    sortable
                    sortBy={{ columnId: 'name', direction: 'asc' }}
                />
            )

            const nameHeader = screen
                .getByText('Name')
                .closest('[role="columnheader"]')
            expect(nameHeader).toHaveAttribute('aria-sort', 'ascending')
        })
    })

    describe('Custom Row ID', () => {
        it('should use custom getRowId function', () => {
            const getRowId = (row: TestData) => `row-${row.id}`

            const { container } = render(
                <DataGrid
                    data={testData}
                    columns={testColumns}
                    getRowId={getRowId}
                />
            )

            const rows = container.querySelectorAll('.datagrid__row')
            expect(rows[0]).toHaveAttribute('data-row-id', 'row-1')
        })

        it('should use index as default row ID', () => {
            const { container } = render(
                <DataGrid data={testData} columns={testColumns} />
            )

            const rows = container.querySelectorAll('.datagrid__row')
            expect(rows[0]).toHaveAttribute('data-row-id', '0')
        })
    })
})
