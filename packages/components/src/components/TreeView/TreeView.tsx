import React, { useState, useCallback, useMemo } from 'react'
import { flushSync } from 'react-dom'
import { classNames } from '../../utility/classnames'
import './treeview.scss'

export interface TreeNode {
    id: string | number
    label: string
    children?: TreeNode[]
    icon?: React.ReactNode
    disabled?: boolean
    metadata?: Record<string, unknown>
}

export interface TreeViewProps {
    data: TreeNode[]
    className?: string
    defaultExpandedKeys?: (string | number)[]
    expandedKeys?: (string | number)[]
    onExpand?: (expandedKeys: (string | number)[]) => void
    selectedKeys?: (string | number)[]
    onSelect?: (selectedKeys: (string | number)[], node: TreeNode) => void
    checkable?: boolean
    checkedKeys?: (string | number)[]
    onCheck?: (checkedKeys: (string | number)[], node: TreeNode) => void
    showLine?: boolean
    showIcon?: boolean
    selectable?: boolean
    multiple?: boolean
    expandOnClickNode?: boolean
    defaultExpandAll?: boolean
    renderNode?: (node: TreeNode) => React.ReactNode
    filterText?: string
    onNodeClick?: (node: TreeNode, event: React.MouseEvent) => void
    onNodeRightClick?: (node: TreeNode, event: React.MouseEvent) => void
}

const ChevronRight = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path
            d="M6 4l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
        />
    </svg>
)

const ChevronDown = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
        />
    </svg>
)

const FolderIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M1 3h5l1 2h7a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3z" />
    </svg>
)

const FileIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M3 1h6l4 4v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" />
    </svg>
)

export const TreeView: React.FC<TreeViewProps> = ({
    data,
    className,
    defaultExpandedKeys = [],
    expandedKeys: controlledExpandedKeys,
    onExpand,
    selectedKeys: controlledSelectedKeys = [],
    onSelect,
    checkable = false,
    checkedKeys: controlledCheckedKeys = [],
    onCheck,
    showLine = false,
    showIcon = true,
    selectable = true,
    multiple = false,
    expandOnClickNode = false,
    defaultExpandAll = false,
    renderNode,
    filterText = '',
    onNodeClick,
    onNodeRightClick,
}) => {
    // Collect all node IDs if defaultExpandAll is true
    const allNodeIds = useMemo(() => {
        const ids: (string | number)[] = []
        const collectIds = (nodes: TreeNode[]) => {
            nodes.forEach((node) => {
                if (node.children && node.children.length > 0) {
                    ids.push(node.id)
                    collectIds(node.children)
                }
            })
        }
        if (defaultExpandAll) {
            collectIds(data)
        }
        return ids
    }, [data, defaultExpandAll])

    const [internalExpandedKeys, setInternalExpandedKeys] = useState<
        (string | number)[]
    >(defaultExpandAll ? allNodeIds : defaultExpandedKeys)
    const [internalSelectedKeys, setInternalSelectedKeys] = useState<
        (string | number)[]
    >([])
    const [internalCheckedKeys, setInternalCheckedKeys] = useState<
        (string | number)[]
    >([])

    const expandedKeys = controlledExpandedKeys ?? internalExpandedKeys
    const selectedKeys = controlledSelectedKeys ?? internalSelectedKeys
    const checkedKeys = controlledCheckedKeys ?? internalCheckedKeys

    const handleToggleExpand = useCallback(
        (nodeId: string | number) => {
            const newExpandedKeys = expandedKeys.includes(nodeId)
                ? expandedKeys.filter((key) => key !== nodeId)
                : [...expandedKeys, nodeId]

            if (controlledExpandedKeys === undefined) {
                setInternalExpandedKeys(newExpandedKeys)
            }
            onExpand?.(newExpandedKeys)
        },
        [expandedKeys, controlledExpandedKeys, onExpand]
    )

    const handleSelectNode = useCallback(
        (node: TreeNode) => {
            if (!selectable || node.disabled) return

            if (controlledSelectedKeys === undefined) {
                // Uncontrolled: use functional update to get latest state
                let newKeys: (string | number)[] = []
                flushSync(() => {
                    setInternalSelectedKeys((prev) => {
                        if (multiple) {
                            newKeys = prev.includes(node.id)
                                ? prev.filter((key) => key !== node.id)
                                : [...prev, node.id]
                        } else {
                            newKeys = prev.includes(node.id) ? [] : [node.id]
                        }
                        return newKeys
                    })
                })
                onSelect?.(newKeys, node)
            } else {
                // Controlled: use prop value
                let newSelectedKeys: (string | number)[]
                if (multiple) {
                    newSelectedKeys = selectedKeys.includes(node.id)
                        ? selectedKeys.filter((key) => key !== node.id)
                        : [...selectedKeys, node.id]
                } else {
                    newSelectedKeys = selectedKeys.includes(node.id)
                        ? []
                        : [node.id]
                }
                onSelect?.(newSelectedKeys, node)
            }
        },
        [selectable, multiple, selectedKeys, controlledSelectedKeys, onSelect]
    )

    const getAllDescendantIds = useCallback(
        (node: TreeNode): (string | number)[] => {
            const ids: (string | number)[] = [node.id]
            if (node.children) {
                node.children.forEach((child) => {
                    ids.push(...getAllDescendantIds(child))
                })
            }
            return ids
        },
        []
    )

    const handleCheckNode = useCallback(
        (node: TreeNode, checked: boolean) => {
            if (node.disabled) return

            const descendantIds = getAllDescendantIds(node)
            let newCheckedKeys: (string | number)[]

            if (checked) {
                newCheckedKeys = [
                    ...new Set([...checkedKeys, ...descendantIds]),
                ]
            } else {
                newCheckedKeys = checkedKeys.filter(
                    (key) => !descendantIds.includes(key)
                )
            }

            if (controlledCheckedKeys === undefined) {
                setInternalCheckedKeys(newCheckedKeys)
            }
            onCheck?.(newCheckedKeys, node)
        },
        [checkedKeys, controlledCheckedKeys, onCheck, getAllDescendantIds]
    )

    const handleNodeClick = useCallback(
        (node: TreeNode, event: React.MouseEvent) => {
            onNodeClick?.(node, event)

            if (
                expandOnClickNode &&
                node.children &&
                node.children.length > 0
            ) {
                handleToggleExpand(node.id)
            } else if (selectable) {
                handleSelectNode(node)
            }
        },
        [
            expandOnClickNode,
            selectable,
            handleToggleExpand,
            handleSelectNode,
            onNodeClick,
        ]
    )

    const handleNodeRightClick = useCallback(
        (node: TreeNode, event: React.MouseEvent) => {
            event.preventDefault()
            onNodeRightClick?.(node, event)
        },
        [onNodeRightClick]
    )

    const matchesFilter = useCallback(
        (node: TreeNode): boolean => {
            if (!filterText) return true
            const lowerFilter = filterText.toLowerCase()
            return node.label.toLowerCase().includes(lowerFilter)
        },
        [filterText]
    )

    const hasMatchingDescendant = useCallback(
        (node: TreeNode): boolean => {
            if (matchesFilter(node)) return true
            if (node.children) {
                return node.children.some((child) =>
                    hasMatchingDescendant(child)
                )
            }
            return false
        },
        [matchesFilter]
    )

    const renderTreeNode = useCallback(
        (
            node: TreeNode,
            level: number = 0,
            isLast: boolean = false,
            parentLines: boolean[] = []
        ) => {
            const hasChildren = node.children && node.children.length > 0
            const isExpanded = expandedKeys.includes(node.id)
            const isSelected = selectedKeys.includes(node.id)
            const isChecked = checkedKeys.includes(node.id)
            const shouldDisplay = !filterText || hasMatchingDescendant(node)

            if (!shouldDisplay) return null

            const nodeClasses = classNames('tree-node', {
                'tree-node--selected': isSelected,
                'tree-node--disabled': node.disabled,
                'tree-node--expanded': isExpanded,
            })

            const contentClasses = classNames('tree-node__content', {
                'tree-node__content--has-children': hasChildren,
            })

            return (
                <div key={node.id} className={nodeClasses}>
                    <div
                        className={contentClasses}
                        style={{ paddingLeft: `${level * 20 + 4}px` }}
                        onClick={(e) =>
                            !node.disabled && handleNodeClick(node, e)
                        }
                        onContextMenu={(e) =>
                            !node.disabled && handleNodeRightClick(node, e)
                        }
                    >
                        {showLine && (
                            <div className="tree-node__lines">
                                {parentLines.map((hasLine, idx) => (
                                    <span
                                        key={idx}
                                        className={classNames(
                                            'tree-node__line-segment',
                                            {
                                                'tree-node__line-segment--visible':
                                                    hasLine,
                                            }
                                        )}
                                    />
                                ))}
                                <span
                                    className={classNames(
                                        'tree-node__line-segment',
                                        'tree-node__line-segment--branch',
                                        {
                                            'tree-node__line-segment--last':
                                                isLast,
                                        }
                                    )}
                                />
                            </div>
                        )}

                        {hasChildren && (
                            <span
                                className="tree-node__expand-icon"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleToggleExpand(node.id)
                                }}
                            >
                                {isExpanded ? (
                                    <ChevronDown />
                                ) : (
                                    <ChevronRight />
                                )}
                            </span>
                        )}

                        {!hasChildren && (
                            <span className="tree-node__expand-icon tree-node__expand-icon--placeholder" />
                        )}

                        {checkable && (
                            <input
                                type="checkbox"
                                className="tree-node__checkbox"
                                checked={isChecked}
                                disabled={node.disabled}
                                onChange={(e) => {
                                    e.stopPropagation()
                                    handleCheckNode(node, e.target.checked)
                                }}
                            />
                        )}

                        {showIcon && (
                            <span className="tree-node__icon">
                                {node.icon ||
                                    (hasChildren ? (
                                        <FolderIcon />
                                    ) : (
                                        <FileIcon />
                                    ))}
                            </span>
                        )}

                        <span className="tree-node__label">
                            {renderNode ? renderNode(node) : node.label}
                        </span>
                    </div>

                    {hasChildren && isExpanded && node.children && (
                        <div className="tree-node__children">
                            {node.children.map((child, idx) =>
                                renderTreeNode(
                                    child,
                                    level + 1,
                                    idx ===
                                        (node.children
                                            ? node.children.length - 1
                                            : 0),
                                    [...parentLines, !isLast]
                                )
                            )}
                        </div>
                    )}
                </div>
            )
        },
        [
            expandedKeys,
            selectedKeys,
            checkedKeys,
            filterText,
            showLine,
            showIcon,
            checkable,
            renderNode,
            handleNodeClick,
            handleNodeRightClick,
            handleToggleExpand,
            handleCheckNode,
            hasMatchingDescendant,
        ]
    )

    const treeClasses = classNames('tree-view', className, {
        'tree-view--show-line': showLine,
        'tree-view--checkable': checkable,
    })

    return (
        <div className={treeClasses}>
            {data.map((node, idx) =>
                renderTreeNode(node, 0, idx === data.length - 1, [])
            )}
            {filterText &&
                data.every((node) => !hasMatchingDescendant(node)) && (
                    <div className="tree-view__empty">
                        No matching nodes found
                    </div>
                )}
        </div>
    )
}

export default TreeView
