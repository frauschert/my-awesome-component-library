import React, { useState, useCallback, useRef, useEffect } from 'react'
import { classNames } from '../../utility/classnames'
import './jsonviewer.scss'

export type JsonValue =
    | string
    | number
    | boolean
    | null
    | JsonObject
    | Array<JsonValue>
export interface JsonObject {
    [key: string]: JsonValue
}

export type JsonViewerSize = 'small' | 'medium' | 'large'

export interface JsonViewerProps {
    data: JsonValue
    size?: JsonViewerSize
    collapsed?: boolean | number
    enableSearch?: boolean
    enableCopy?: boolean
    enableLineNumbers?: boolean
    enableCollapse?: boolean
    highlightUpdates?: boolean
    maxHeight?: string | number
    rootName?: string
    indentWidth?: number
    className?: string
    style?: React.CSSProperties
    onSelect?: (path: string[], value: JsonValue) => void
    renderCustom?: (
        value: JsonValue,
        path: string[]
    ) => React.ReactNode | undefined
}

interface NodeProps {
    keyName: string | null
    value: JsonValue
    path: string[]
    level: number
    isLast: boolean
    isNodeCollapsed: (path: string[]) => boolean
    onToggle: (path: string[]) => void
    onSelect?: (path: string[], value: JsonValue) => void
    searchTerm: string
    indentWidth: number
    renderCustom?: (
        value: JsonValue,
        path: string[]
    ) => React.ReactNode | undefined
    highlightUpdates?: boolean
}

const JsonNode: React.FC<NodeProps> = ({
    keyName,
    value,
    path,
    level,
    isLast,
    isNodeCollapsed,
    onToggle,
    onSelect,
    searchTerm,
    indentWidth,
    renderCustom,
    highlightUpdates,
}) => {
    const [isUpdated, setIsUpdated] = useState(false)
    const prevValueRef = useRef(value)

    useEffect(() => {
        if (highlightUpdates && prevValueRef.current !== value) {
            setIsUpdated(true)
            const timer = setTimeout(() => setIsUpdated(false), 1000)
            prevValueRef.current = value
            return () => clearTimeout(timer)
        }
    }, [value, highlightUpdates])

    const handleClick = useCallback(() => {
        onSelect?.(path, value)
    }, [path, value, onSelect])

    const handleToggle = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation()
            onToggle(path)
        },
        [path, onToggle]
    )

    const isObject =
        typeof value === 'object' && value !== null && !Array.isArray(value)
    const isArray = Array.isArray(value)
    const isExpandable = isObject || isArray
    const collapsed = isNodeCollapsed(path)

    const highlightMatch = (text: string) => {
        if (!searchTerm) return text
        const regex = new RegExp(`(${searchTerm})`, 'gi')
        const parts = text.split(regex)
        return parts.map((part, i) =>
            regex.test(part) ? (
                <mark key={i} className="jsonviewer__highlight">
                    {part}
                </mark>
            ) : (
                part
            )
        )
    }

    // Check for custom renderer
    const customNode = renderCustom?.(value, path)
    if (customNode) {
        return <div className="jsonviewer__custom-node">{customNode}</div>
    }

    const renderValue = () => {
        if (value === null) {
            return (
                <span className="jsonviewer__value jsonviewer__value--null">
                    null
                </span>
            )
        }
        if (typeof value === 'boolean') {
            return (
                <span className="jsonviewer__value jsonviewer__value--boolean">
                    {value.toString()}
                </span>
            )
        }
        if (typeof value === 'number') {
            return (
                <span className="jsonviewer__value jsonviewer__value--number">
                    {value}
                </span>
            )
        }
        if (typeof value === 'string') {
            return (
                <span className="jsonviewer__value jsonviewer__value--string">
                    &quot;{highlightMatch(value)}&quot;
                </span>
            )
        }
        return null
    }

    const getPreview = () => {
        if (isArray) {
            return collapsed ? `Array[${value.length}]` : ''
        }
        if (isObject) {
            const keys = Object.keys(value as JsonObject)
            return collapsed ? `Object{${keys.length}}` : ''
        }
        return ''
    }

    const getBracket = () => {
        if (isArray) return collapsed ? '[...]' : '['
        if (isObject) return collapsed ? '{...}' : '{'
        return ''
    }

    const getClosingBracket = () => {
        if (isArray) return ']'
        if (isObject) return '}'
        return ''
    }

    const nodeClasses = classNames(
        'jsonviewer__node',
        isUpdated && 'jsonviewer__node--updated',
        isExpandable && 'jsonviewer__node--expandable',
        collapsed && 'jsonviewer__node--collapsed'
    )

    return (
        <div
            className={nodeClasses}
            style={{ marginLeft: `${level * indentWidth}px` }}
        >
            <div className="jsonviewer__line" onClick={handleClick}>
                {isExpandable && (
                    <button
                        type="button"
                        className="jsonviewer__toggle"
                        onClick={handleToggle}
                        aria-label={collapsed ? 'Expand' : 'Collapse'}
                        aria-expanded={!collapsed}
                    >
                        {collapsed ? '▶' : '▼'}
                    </button>
                )}
                {keyName !== null && (
                    <>
                        <span className="jsonviewer__key">
                            {highlightMatch(keyName)}
                        </span>
                        <span className="jsonviewer__colon">: </span>
                    </>
                )}
                {!isExpandable ? (
                    renderValue()
                ) : (
                    <>
                        <span className="jsonviewer__bracket">
                            {getBracket()}
                        </span>
                        {collapsed && (
                            <span className="jsonviewer__preview">
                                {getPreview()}
                            </span>
                        )}
                    </>
                )}
                {!collapsed && isExpandable && (
                    <span className="jsonviewer__comma" />
                )}
                {!isExpandable && !isLast && (
                    <span className="jsonviewer__comma">,</span>
                )}
            </div>
            {!collapsed && isExpandable && (
                <div className="jsonviewer__children">
                    {isArray
                        ? value.map((item, index) => (
                              <JsonNode
                                  key={index}
                                  keyName={null}
                                  value={item}
                                  path={[...path, String(index)]}
                                  level={level + 1}
                                  isLast={index === value.length - 1}
                                  isNodeCollapsed={isNodeCollapsed}
                                  onToggle={onToggle}
                                  onSelect={onSelect}
                                  searchTerm={searchTerm}
                                  indentWidth={indentWidth}
                                  renderCustom={renderCustom}
                                  highlightUpdates={highlightUpdates}
                              />
                          ))
                        : Object.entries(value as JsonObject).map(
                              ([key, val], index, arr) => (
                                  <JsonNode
                                      key={key}
                                      keyName={key}
                                      value={val}
                                      path={[...path, key]}
                                      level={level + 1}
                                      isLast={index === arr.length - 1}
                                      isNodeCollapsed={isNodeCollapsed}
                                      onToggle={onToggle}
                                      onSelect={onSelect}
                                      searchTerm={searchTerm}
                                      indentWidth={indentWidth}
                                      renderCustom={renderCustom}
                                      highlightUpdates={highlightUpdates}
                                  />
                              )
                          )}
                    <div
                        className="jsonviewer__line"
                        style={{ marginLeft: `${level * indentWidth}px` }}
                    >
                        <span className="jsonviewer__bracket">
                            {getClosingBracket()}
                        </span>
                        {!isLast && (
                            <span className="jsonviewer__comma">,</span>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export const JsonViewer: React.FC<JsonViewerProps> = ({
    data,
    size = 'medium',
    collapsed: defaultCollapsed = false,
    enableSearch = true,
    enableCopy = true,
    enableLineNumbers = false,
    enableCollapse = true,
    highlightUpdates = false,
    maxHeight,
    rootName = 'root',
    indentWidth = 20,
    className,
    style,
    onSelect,
    renderCustom,
}) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set())
    const [copiedNotification, setCopiedNotification] = useState(false)
    const [lineCount, setLineCount] = useState(0)

    // Initialize collapsed state
    useEffect(() => {
        if (typeof defaultCollapsed === 'number' && defaultCollapsed >= 0) {
            // Collapse all nodes at or deeper than the specified level
            const nodesToCollapse = new Set<string>()
            const traverse = (
                obj: JsonValue,
                path: string[],
                level: number
            ) => {
                if (typeof obj === 'object' && obj !== null) {
                    if (level >= defaultCollapsed) {
                        nodesToCollapse.add(path.join('.'))
                    }
                    const entries = Array.isArray(obj)
                        ? obj.map(
                              (val, idx) =>
                                  [String(idx), val] as [string, JsonValue]
                          )
                        : Object.entries(obj)
                    entries.forEach(([key, val]) => {
                        traverse(val, [...path, key], level + 1)
                    })
                }
            }
            traverse(data, [], 0)
            setCollapsedNodes(nodesToCollapse)
        } else if (defaultCollapsed === true) {
            // Collapse root level
            setCollapsedNodes(new Set(['']))
        }
    }, [defaultCollapsed, data])

    // Count lines
    useEffect(() => {
        const count = JSON.stringify(data, null, 2).split('\n').length
        setLineCount(count)
    }, [data])

    const handleToggle = useCallback((path: string[]) => {
        setCollapsedNodes((prev) => {
            const newSet = new Set(prev)
            const pathKey = path.join('.')
            if (newSet.has(pathKey)) {
                newSet.delete(pathKey)
            } else {
                newSet.add(pathKey)
            }
            return newSet
        })
    }, [])

    const handleCopy = useCallback(() => {
        const jsonString = JSON.stringify(data, null, 2)
        window.navigator.clipboard.writeText(jsonString).then(() => {
            setCopiedNotification(true)
            setTimeout(() => setCopiedNotification(false), 2000)
        })
    }, [data])

    const handleCollapseAll = useCallback(() => {
        const nodesToCollapse = new Set<string>()
        const traverse = (obj: JsonValue, path: string[]) => {
            if (typeof obj === 'object' && obj !== null) {
                nodesToCollapse.add(path.join('.'))
                const entries = Array.isArray(obj)
                    ? obj.map(
                          (val, idx) =>
                              [String(idx), val] as [string, JsonValue]
                      )
                    : Object.entries(obj)
                entries.forEach(([key, val]) => {
                    traverse(val, [...path, key])
                })
            }
        }
        traverse(data, [])
        setCollapsedNodes(nodesToCollapse)
    }, [data])

    const handleExpandAll = useCallback(() => {
        setCollapsedNodes(new Set())
    }, [])

    const isNodeCollapsed = useCallback(
        (path: string[]) => {
            return collapsedNodes.has(path.join('.'))
        },
        [collapsedNodes]
    )

    const viewerClasses = classNames(
        'jsonviewer',
        `jsonviewer--${size}`,
        enableLineNumbers && 'jsonviewer--line-numbers',
        className
    )

    const viewerStyle: React.CSSProperties = {
        ...style,
        ...(maxHeight && {
            maxHeight:
                typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
        }),
    }

    return (
        <div className={viewerClasses} style={viewerStyle}>
            {(enableSearch || enableCopy || enableCollapse) && (
                <div className="jsonviewer__toolbar">
                    {enableSearch && (
                        <input
                            type="text"
                            className="jsonviewer__search"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            aria-label="Search JSON"
                        />
                    )}
                    {enableCollapse && (
                        <div className="jsonviewer__collapse-controls">
                            <button
                                type="button"
                                className="jsonviewer__button"
                                onClick={handleCollapseAll}
                                title="Collapse all"
                                aria-label="Collapse all nodes"
                            >
                                Collapse All
                            </button>
                            <button
                                type="button"
                                className="jsonviewer__button"
                                onClick={handleExpandAll}
                                title="Expand all"
                                aria-label="Expand all nodes"
                            >
                                Expand All
                            </button>
                        </div>
                    )}
                    {enableCopy && (
                        <button
                            type="button"
                            className="jsonviewer__button jsonviewer__button--copy"
                            onClick={handleCopy}
                            title="Copy JSON"
                            aria-label="Copy JSON to clipboard"
                        >
                            {copiedNotification ? '✓ Copied' : 'Copy'}
                        </button>
                    )}
                </div>
            )}
            <div className="jsonviewer__content">
                {enableLineNumbers && (
                    <div className="jsonviewer__line-numbers">
                        {Array.from({ length: lineCount }, (_, i) => (
                            <div key={i} className="jsonviewer__line-number">
                                {i + 1}
                            </div>
                        ))}
                    </div>
                )}
                <div className="jsonviewer__body">
                    <JsonNode
                        keyName={rootName}
                        value={data}
                        path={[]}
                        level={0}
                        isLast={true}
                        isNodeCollapsed={isNodeCollapsed}
                        onToggle={handleToggle}
                        onSelect={onSelect}
                        searchTerm={searchTerm}
                        indentWidth={indentWidth}
                        renderCustom={renderCustom}
                        highlightUpdates={highlightUpdates}
                    />
                </div>
            </div>
        </div>
    )
}

export default JsonViewer
