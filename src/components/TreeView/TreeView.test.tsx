import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import TreeView, { TreeNode } from './TreeView'

const mockData: TreeNode[] = [
    {
        id: '1',
        label: 'Parent 1',
        children: [
            { id: '1-1', label: 'Child 1-1' },
            { id: '1-2', label: 'Child 1-2' },
        ],
    },
    {
        id: '2',
        label: 'Parent 2',
        children: [
            {
                id: '2-1',
                label: 'Child 2-1',
                children: [{ id: '2-1-1', label: 'Grandchild 2-1-1' }],
            },
        ],
    },
    { id: '3', label: 'Leaf Node' },
]

describe('TreeView', () => {
    describe('Rendering', () => {
        it('should render tree nodes', () => {
            render(<TreeView data={mockData} />)

            expect(screen.getByText('Parent 1')).toBeInTheDocument()
            expect(screen.getByText('Parent 2')).toBeInTheDocument()
            expect(screen.getByText('Leaf Node')).toBeInTheDocument()
        })

        it('should not render children by default', () => {
            render(<TreeView data={mockData} />)

            expect(screen.queryByText('Child 1-1')).not.toBeInTheDocument()
            expect(screen.queryByText('Child 1-2')).not.toBeInTheDocument()
        })

        it('should apply custom className', () => {
            const { container } = render(
                <TreeView data={mockData} className="custom-tree" />
            )

            expect(container.querySelector('.custom-tree')).toBeInTheDocument()
        })

        it('should render with show line class', () => {
            const { container } = render(<TreeView data={mockData} showLine />)

            expect(
                container.querySelector('.tree-view--show-line')
            ).toBeInTheDocument()
        })
    })

    describe('Expand/Collapse', () => {
        it('should expand node when clicking chevron', () => {
            render(<TreeView data={mockData} />)

            const parent1 = screen.getByText('Parent 1')
            const expandIcon = parent1.parentElement?.querySelector(
                '.tree-node__expand-icon'
            )

            expect(screen.queryByText('Child 1-1')).not.toBeInTheDocument()

            fireEvent.click(expandIcon!)

            expect(screen.getByText('Child 1-1')).toBeInTheDocument()
            expect(screen.getByText('Child 1-2')).toBeInTheDocument()
        })

        it('should collapse node when clicking chevron again', () => {
            render(<TreeView data={mockData} />)

            const parent1 = screen.getByText('Parent 1')
            const expandIcon = parent1.parentElement?.querySelector(
                '.tree-node__expand-icon'
            )

            fireEvent.click(expandIcon!)
            expect(screen.getByText('Child 1-1')).toBeInTheDocument()

            fireEvent.click(expandIcon!)
            expect(screen.queryByText('Child 1-1')).not.toBeInTheDocument()
        })

        it('should respect defaultExpandedKeys', () => {
            render(
                <TreeView data={mockData} defaultExpandedKeys={['1', '2']} />
            )

            expect(screen.getByText('Child 1-1')).toBeInTheDocument()
            expect(screen.getByText('Child 2-1')).toBeInTheDocument()
        })

        it('should expand all nodes with defaultExpandAll', () => {
            render(<TreeView data={mockData} defaultExpandAll />)

            expect(screen.getByText('Child 1-1')).toBeInTheDocument()
            expect(screen.getByText('Child 1-2')).toBeInTheDocument()
            expect(screen.getByText('Child 2-1')).toBeInTheDocument()
            expect(screen.getByText('Grandchild 2-1-1')).toBeInTheDocument()
        })

        it('should call onExpand callback', () => {
            const onExpand = jest.fn()
            render(<TreeView data={mockData} onExpand={onExpand} />)

            const parent1 = screen.getByText('Parent 1')
            const expandIcon = parent1.parentElement?.querySelector(
                '.tree-node__expand-icon'
            )

            fireEvent.click(expandIcon!)

            expect(onExpand).toHaveBeenCalledWith(['1'])
        })
    })

    describe('Selection', () => {
        it('should select node on click', () => {
            const onSelect = jest.fn()
            render(<TreeView data={mockData} onSelect={onSelect} />)

            fireEvent.click(screen.getByText('Leaf Node'))

            expect(onSelect).toHaveBeenCalledWith(
                ['3'],
                expect.objectContaining({ id: '3' })
            )
        })

        it('should deselect node on second click', () => {
            const onSelect = jest.fn()
            const { rerender } = render(
                <TreeView
                    data={mockData}
                    selectedKeys={[]}
                    onSelect={onSelect}
                />
            )

            const leafNode = screen.getByText('Leaf Node')

            // First click - select
            fireEvent.click(leafNode)
            expect(onSelect).toHaveBeenCalledWith(
                ['3'],
                expect.objectContaining({ id: '3' })
            )

            // Rerender with selected state
            rerender(
                <TreeView
                    data={mockData}
                    selectedKeys={['3']}
                    onSelect={onSelect}
                />
            )

            // Second click - deselect
            fireEvent.click(leafNode)
            expect(onSelect).toHaveBeenCalledWith(
                [],
                expect.objectContaining({ id: '3' })
            )
        })

        it('should support multiple selection', () => {
            const onSelect = jest.fn()
            const { rerender } = render(
                <TreeView
                    data={mockData}
                    multiple
                    selectedKeys={[]}
                    onSelect={onSelect}
                />
            )

            // First click
            fireEvent.click(screen.getByText('Parent 1'))
            expect(onSelect).toHaveBeenCalledWith(
                ['1'],
                expect.objectContaining({ id: '1' })
            )

            // Rerender with selected state
            rerender(
                <TreeView
                    data={mockData}
                    multiple
                    selectedKeys={['1']}
                    onSelect={onSelect}
                />
            )

            // Second click
            fireEvent.click(screen.getByText('Leaf Node'))
            expect(onSelect).toHaveBeenLastCalledWith(
                ['1', '3'],
                expect.objectContaining({ id: '3' })
            )
        })
        it('should not select when selectable is false', () => {
            const onSelect = jest.fn()
            render(
                <TreeView
                    data={mockData}
                    selectable={false}
                    onSelect={onSelect}
                />
            )

            fireEvent.click(screen.getByText('Leaf Node'))

            expect(onSelect).not.toHaveBeenCalled()
        })

        it('should not select disabled nodes', () => {
            const onSelect = jest.fn()
            const dataWithDisabled: TreeNode[] = [
                { id: '1', label: 'Enabled Node' },
                { id: '2', label: 'Disabled Node', disabled: true },
            ]

            render(<TreeView data={dataWithDisabled} onSelect={onSelect} />)

            fireEvent.click(screen.getByText('Disabled Node'))

            expect(onSelect).not.toHaveBeenCalled()
        })
    })

    describe('Checkable', () => {
        it('should render checkboxes when checkable', () => {
            render(<TreeView data={mockData} checkable />)

            const checkboxes = screen.getAllByRole('checkbox')
            expect(checkboxes.length).toBeGreaterThan(0)
        })

        it('should check node and descendants', () => {
            const onCheck = jest.fn()
            render(
                <TreeView
                    data={mockData}
                    checkable
                    onCheck={onCheck}
                    defaultExpandAll
                />
            )

            const parentCheckbox = screen
                .getByText('Parent 1')
                .parentElement?.querySelector('input[type="checkbox"]')

            fireEvent.click(parentCheckbox!)

            expect(onCheck).toHaveBeenCalledWith(
                ['1', '1-1', '1-2'],
                expect.objectContaining({ id: '1' })
            )
        })

        it('should uncheck node and descendants', () => {
            const onCheck = jest.fn()
            render(
                <TreeView
                    data={mockData}
                    checkable
                    onCheck={onCheck}
                    checkedKeys={['1', '1-1', '1-2']}
                    defaultExpandAll
                />
            )

            const parentCheckbox = screen
                .getByText('Parent 1')
                .parentElement?.querySelector('input[type="checkbox"]')

            fireEvent.click(parentCheckbox!)

            expect(onCheck).toHaveBeenCalledWith(
                [],
                expect.objectContaining({ id: '1' })
            )
        })

        it('should not check disabled nodes', () => {
            const onCheck = jest.fn()
            const dataWithDisabled: TreeNode[] = [
                { id: '1', label: 'Disabled', disabled: true },
            ]

            render(
                <TreeView data={dataWithDisabled} checkable onCheck={onCheck} />
            )

            const checkbox = screen.getByRole('checkbox')
            fireEvent.click(checkbox)

            expect(onCheck).not.toHaveBeenCalled()
        })
    })

    describe('Expand on Click Node', () => {
        it('should expand node when clicking the node label', () => {
            render(<TreeView data={mockData} expandOnClickNode />)

            expect(screen.queryByText('Child 1-1')).not.toBeInTheDocument()

            fireEvent.click(screen.getByText('Parent 1'))

            expect(screen.getByText('Child 1-1')).toBeInTheDocument()
        })

        it('should select leaf nodes even with expandOnClickNode', () => {
            const onSelect = jest.fn()
            render(
                <TreeView
                    data={mockData}
                    expandOnClickNode
                    onSelect={onSelect}
                />
            )

            fireEvent.click(screen.getByText('Leaf Node'))

            expect(onSelect).toHaveBeenCalledWith(
                ['3'],
                expect.objectContaining({ id: '3' })
            )
        })
    })

    describe('Filtering', () => {
        it('should filter nodes by text', () => {
            render(
                <TreeView data={mockData} filterText="Leaf" defaultExpandAll />
            )

            expect(screen.getByText('Leaf Node')).toBeInTheDocument()
            expect(screen.queryByText('Parent 1')).not.toBeInTheDocument()
        })

        it('should show parent if child matches filter', () => {
            render(
                <TreeView
                    data={mockData}
                    filterText="Child 1-1"
                    defaultExpandAll
                />
            )

            expect(screen.getByText('Parent 1')).toBeInTheDocument()
            expect(screen.getByText('Child 1-1')).toBeInTheDocument()
        })

        it('should show empty message when no matches', () => {
            render(<TreeView data={mockData} filterText="nonexistent" />)

            expect(
                screen.getByText('No matching nodes found')
            ).toBeInTheDocument()
        })
    })

    describe('Custom Rendering', () => {
        it('should use custom renderNode function', () => {
            render(
                <TreeView
                    data={mockData}
                    renderNode={(node) => (
                        <span data-testid="custom-node">
                            {node.label.toUpperCase()}
                        </span>
                    )}
                />
            )

            expect(screen.getByText('PARENT 1')).toBeInTheDocument()
            expect(screen.getAllByTestId('custom-node').length).toBeGreaterThan(
                0
            )
        })

        it('should render custom icons', () => {
            const dataWithIcon: TreeNode[] = [
                {
                    id: '1',
                    label: 'Custom',
                    icon: <span data-testid="custom-icon">★</span>,
                },
            ]

            render(<TreeView data={dataWithIcon} />)

            expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
        })
    })

    describe('Event Callbacks', () => {
        it('should call onNodeClick', () => {
            const onNodeClick = jest.fn()
            render(<TreeView data={mockData} onNodeClick={onNodeClick} />)

            fireEvent.click(screen.getByText('Leaf Node'))

            expect(onNodeClick).toHaveBeenCalledWith(
                expect.objectContaining({ id: '3' }),
                expect.any(Object)
            )
        })

        it('should call onNodeRightClick', () => {
            const onNodeRightClick = jest.fn()
            render(
                <TreeView data={mockData} onNodeRightClick={onNodeRightClick} />
            )

            fireEvent.contextMenu(screen.getByText('Leaf Node'))

            expect(onNodeRightClick).toHaveBeenCalledWith(
                expect.objectContaining({ id: '3' }),
                expect.any(Object)
            )
        })

        it('should prevent default on right click', () => {
            const onNodeRightClick = jest.fn()
            render(
                <TreeView data={mockData} onNodeRightClick={onNodeRightClick} />
            )

            const event = new MouseEvent('contextmenu', {
                bubbles: true,
                cancelable: true,
            })
            const preventDefault = jest.spyOn(event, 'preventDefault')

            fireEvent(screen.getByText('Leaf Node'), event)

            expect(preventDefault).toHaveBeenCalled()
        })
    })

    describe('Icons', () => {
        it('should not render icons when showIcon is false', () => {
            const { container } = render(
                <TreeView data={mockData} showIcon={false} />
            )

            expect(
                container.querySelector('.tree-node__icon')
            ).not.toBeInTheDocument()
        })

        it('should render folder and file icons by default', () => {
            const { container } = render(<TreeView data={mockData} showIcon />)

            expect(
                container.querySelectorAll('.tree-node__icon').length
            ).toBeGreaterThan(0)
        })
    })

    describe('Controlled Mode', () => {
        it('should work in controlled mode for expansion', () => {
            const { rerender } = render(
                <TreeView data={mockData} expandedKeys={[]} />
            )

            expect(screen.queryByText('Child 1-1')).not.toBeInTheDocument()

            rerender(<TreeView data={mockData} expandedKeys={['1']} />)

            expect(screen.getByText('Child 1-1')).toBeInTheDocument()
        })

        it('should work in controlled mode for selection', () => {
            const { container, rerender } = render(
                <TreeView data={mockData} selectedKeys={[]} />
            )

            expect(
                container.querySelector('.tree-node--selected')
            ).not.toBeInTheDocument()

            rerender(<TreeView data={mockData} selectedKeys={['3']} />)

            expect(
                container.querySelector('.tree-node--selected')
            ).toBeInTheDocument()
        })

        it('should work in controlled mode for checking', () => {
            const { rerender } = render(
                <TreeView data={mockData} checkable checkedKeys={[]} />
            )

            const checkbox = screen.getAllByRole('checkbox')[0]
            expect(checkbox).not.toBeChecked()

            rerender(<TreeView data={mockData} checkable checkedKeys={['1']} />)

            const updatedCheckbox = screen.getAllByRole('checkbox')[0]
            expect(updatedCheckbox).toBeChecked()
        })
    })
})
