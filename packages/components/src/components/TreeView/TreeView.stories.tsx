import React, { useState } from 'react'
import { Meta, StoryObj } from '@storybook/react'
import TreeView, { TreeNode } from './TreeView'

const meta: Meta<typeof TreeView> = {
    title: 'Components/TreeView',
    component: TreeView,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof TreeView>

const fileSystemData: TreeNode[] = [
    {
        id: '1',
        label: 'src',
        children: [
            {
                id: '1-1',
                label: 'components',
                children: [
                    { id: '1-1-1', label: 'Button.tsx' },
                    { id: '1-1-2', label: 'Input.tsx' },
                    { id: '1-1-3', label: 'Modal.tsx' },
                ],
            },
            {
                id: '1-2',
                label: 'utils',
                children: [
                    { id: '1-2-1', label: 'helpers.ts' },
                    { id: '1-2-2', label: 'constants.ts' },
                ],
            },
            { id: '1-3', label: 'App.tsx' },
            { id: '1-4', label: 'index.tsx' },
        ],
    },
    {
        id: '2',
        label: 'public',
        children: [
            { id: '2-1', label: 'index.html' },
            { id: '2-2', label: 'favicon.ico' },
        ],
    },
    { id: '3', label: 'package.json' },
    { id: '4', label: 'tsconfig.json' },
    { id: '5', label: 'README.md' },
]

const organizationData: TreeNode[] = [
    {
        id: 'eng',
        label: 'Engineering',
        children: [
            {
                id: 'eng-fe',
                label: 'Frontend',
                children: [
                    { id: 'eng-fe-1', label: 'Alice Johnson' },
                    { id: 'eng-fe-2', label: 'Bob Smith' },
                    { id: 'eng-fe-3', label: 'Carol White' },
                ],
            },
            {
                id: 'eng-be',
                label: 'Backend',
                children: [
                    { id: 'eng-be-1', label: 'David Brown' },
                    { id: 'eng-be-2', label: 'Eve Davis' },
                ],
            },
            {
                id: 'eng-devops',
                label: 'DevOps',
                children: [{ id: 'eng-devops-1', label: 'Frank Miller' }],
            },
        ],
    },
    {
        id: 'design',
        label: 'Design',
        children: [
            { id: 'design-1', label: 'Grace Lee' },
            { id: 'design-2', label: 'Henry Wilson' },
        ],
    },
    {
        id: 'product',
        label: 'Product',
        children: [
            { id: 'product-1', label: 'Irene Martinez' },
            { id: 'product-2', label: 'Jack Anderson' },
        ],
    },
]

const categoryData: TreeNode[] = [
    {
        id: 'electronics',
        label: 'Electronics',
        children: [
            {
                id: 'computers',
                label: 'Computers',
                children: [
                    { id: 'laptops', label: 'Laptops' },
                    { id: 'desktops', label: 'Desktops' },
                    { id: 'tablets', label: 'Tablets' },
                ],
            },
            {
                id: 'phones',
                label: 'Phones',
                children: [
                    { id: 'smartphones', label: 'Smartphones' },
                    { id: 'feature-phones', label: 'Feature Phones' },
                ],
            },
            { id: 'accessories', label: 'Accessories' },
        ],
    },
    {
        id: 'clothing',
        label: 'Clothing',
        children: [
            {
                id: 'mens',
                label: "Men's",
                children: [
                    { id: 'mens-shirts', label: 'Shirts' },
                    { id: 'mens-pants', label: 'Pants' },
                ],
            },
            {
                id: 'womens',
                label: "Women's",
                children: [
                    { id: 'womens-dresses', label: 'Dresses' },
                    { id: 'womens-tops', label: 'Tops' },
                ],
            },
        ],
    },
    {
        id: 'home',
        label: 'Home & Garden',
        children: [
            { id: 'furniture', label: 'Furniture' },
            { id: 'decor', label: 'Decor' },
            { id: 'kitchen', label: 'Kitchen' },
        ],
    },
]

export const Default: Story = {
    args: {
        data: fileSystemData,
    },
}

export const DefaultExpandAll: Story = {
    args: {
        data: fileSystemData,
        defaultExpandAll: true,
    },
}

export const WithLines: Story = {
    args: {
        data: fileSystemData,
        showLine: true,
        defaultExpandedKeys: ['1', '1-1'],
    },
}

export const Checkable: Story = {
    render: () => {
        const [checkedKeys, setCheckedKeys] = useState<(string | number)[]>([])

        return (
            <div>
                <div style={{ marginBottom: '16px' }}>
                    <strong>Checked Items:</strong>{' '}
                    {checkedKeys.join(', ') || 'None'}
                </div>
                <TreeView
                    data={fileSystemData}
                    checkable
                    checkedKeys={checkedKeys}
                    onCheck={setCheckedKeys}
                    defaultExpandedKeys={['1', '1-1']}
                />
            </div>
        )
    },
}

export const MultipleSelection: Story = {
    render: () => {
        const [selectedKeys, setSelectedKeys] = useState<(string | number)[]>(
            []
        )

        return (
            <div>
                <div style={{ marginBottom: '16px' }}>
                    <strong>Selected:</strong>{' '}
                    {selectedKeys.join(', ') || 'None'}
                </div>
                <TreeView
                    data={organizationData}
                    multiple
                    selectedKeys={selectedKeys}
                    onSelect={setSelectedKeys}
                    defaultExpandAll
                />
            </div>
        )
    },
}

export const ExpandOnClick: Story = {
    args: {
        data: categoryData,
        expandOnClickNode: true,
        defaultExpandedKeys: ['electronics'],
    },
}

export const WithSearch: Story = {
    render: () => {
        const [filterText, setFilterText] = useState('')

        return (
            <div>
                <input
                    type="text"
                    placeholder="Search nodes..."
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '8px',
                        marginBottom: '16px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                    }}
                />
                <TreeView
                    data={fileSystemData}
                    filterText={filterText}
                    defaultExpandAll
                />
            </div>
        )
    },
}

export const CustomIcons: Story = {
    render: () => {
        const StarIcon = () => (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1l2 5h5l-4 3 1.5 5L8 11l-4.5 3L5 9 1 6h5z" />
            </svg>
        )

        const dataWithIcons: TreeNode[] = [
            {
                id: '1',
                label: 'Favorites',
                icon: <StarIcon />,
                children: [
                    {
                        id: '1-1',
                        label: 'Important Project',
                        icon: <StarIcon />,
                    },
                    { id: '1-2', label: 'Client Work', icon: <StarIcon /> },
                ],
            },
            {
                id: '2',
                label: 'Documents',
                children: [
                    { id: '2-1', label: 'Report.pdf' },
                    { id: '2-2', label: 'Proposal.docx' },
                ],
            },
        ]

        return <TreeView data={dataWithIcons} defaultExpandAll />
    },
}

export const DisabledNodes: Story = {
    render: () => {
        const dataWithDisabled: TreeNode[] = [
            {
                id: '1',
                label: 'Active Projects',
                children: [
                    { id: '1-1', label: 'Project A' },
                    {
                        id: '1-2',
                        label: 'Project B (archived)',
                        disabled: true,
                    },
                    { id: '1-3', label: 'Project C' },
                ],
            },
            {
                id: '2',
                label: 'Archived (read-only)',
                disabled: true,
                children: [
                    { id: '2-1', label: 'Old Project 1' },
                    { id: '2-2', label: 'Old Project 2' },
                ],
            },
        ]

        return <TreeView data={dataWithDisabled} checkable defaultExpandAll />
    },
}

export const CustomRenderer: Story = {
    render: () => {
        const dataWithMetadata: TreeNode[] = [
            {
                id: '1',
                label: 'Documents',
                metadata: { count: 24 },
                children: [
                    {
                        id: '1-1',
                        label: 'Work',
                        metadata: { count: 12, size: '2.4 MB' },
                    },
                    {
                        id: '1-2',
                        label: 'Personal',
                        metadata: { count: 12, size: '1.8 MB' },
                    },
                ],
            },
            {
                id: '2',
                label: 'Photos',
                metadata: { count: 156, size: '45.2 MB' },
            },
        ]

        return (
            <TreeView
                data={dataWithMetadata}
                defaultExpandAll
                renderNode={(node) => (
                    <span>
                        {node.label}
                        {node.metadata && (
                            <span
                                style={{
                                    marginLeft: '8px',
                                    color: '#999',
                                    fontSize: '12px',
                                }}
                            >
                                {node.metadata.count &&
                                    `(${node.metadata.count})`}
                                {node.metadata.size &&
                                    ` - ${node.metadata.size}`}
                            </span>
                        )}
                    </span>
                )}
            />
        )
    },
}

export const ContextMenu: Story = {
    render: () => {
        const [contextMenu, setContextMenu] = useState<{
            node: TreeNode
            x: number
            y: number
        } | null>(null)

        const handleRightClick = (node: TreeNode, event: React.MouseEvent) => {
            setContextMenu({
                node,
                x: event.clientX,
                y: event.clientY,
            })
        }

        const handleAction = (action: string) => {
            alert(`${action} on: ${contextMenu?.node.label}`)
            setContextMenu(null)
        }

        return (
            <div onClick={() => setContextMenu(null)}>
                <p style={{ marginBottom: '16px', color: '#666' }}>
                    Right-click on any node to see context menu
                </p>
                <TreeView
                    data={fileSystemData}
                    onNodeRightClick={handleRightClick}
                    defaultExpandedKeys={['1', '1-1']}
                />
                {contextMenu && (
                    <div
                        style={{
                            position: 'fixed',
                            left: contextMenu.x,
                            top: contextMenu.y,
                            background: 'white',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            padding: '4px 0',
                            minWidth: '150px',
                            zIndex: 1000,
                        }}
                    >
                        <div
                            style={{ padding: '8px 16px', cursor: 'pointer' }}
                            onClick={() => handleAction('Open')}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.background = '#f5f5f5')
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.background = 'white')
                            }
                        >
                            Open
                        </div>
                        <div
                            style={{ padding: '8px 16px', cursor: 'pointer' }}
                            onClick={() => handleAction('Rename')}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.background = '#f5f5f5')
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.background = 'white')
                            }
                        >
                            Rename
                        </div>
                        <div
                            style={{ padding: '8px 16px', cursor: 'pointer' }}
                            onClick={() => handleAction('Delete')}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.background = '#f5f5f5')
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.background = 'white')
                            }
                        >
                            Delete
                        </div>
                    </div>
                )}
            </div>
        )
    },
}

export const LargeDataset: Story = {
    render: () => {
        const generateLargeTree = (
            depth: number,
            breadth: number,
            prefix = ''
        ): TreeNode[] => {
            if (depth === 0) return []

            return Array.from({ length: breadth }, (_, i) => ({
                id: `${prefix}${i}`,
                label: `Node ${prefix}${i}`,
                children:
                    depth > 1
                        ? generateLargeTree(
                              depth - 1,
                              breadth,
                              `${prefix}${i}-`
                          )
                        : undefined,
            }))
        }

        const largeData = generateLargeTree(4, 5)

        return (
            <div>
                <p style={{ marginBottom: '16px', color: '#666' }}>
                    Tree with 5 branches at each level, 4 levels deep (780 total
                    nodes)
                </p>
                <div
                    style={{
                        height: '500px',
                        overflow: 'auto',
                        border: '1px solid #ddd',
                    }}
                >
                    <TreeView data={largeData} />
                </div>
            </div>
        )
    },
}
