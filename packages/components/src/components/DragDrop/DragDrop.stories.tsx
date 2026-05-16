import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import {
    DragDropProvider,
    Draggable,
    DropZone,
    SortableList,
    DragHandle,
} from './DragDrop'
import type { SortableItem } from './DragDrop'

const meta: Meta = {
    title: 'Components/DragDrop',
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
}

export default meta

// Basic Draggable Story
export const BasicDraggable: StoryObj = {
    render: () => (
        <DragDropProvider>
            <div style={{ padding: '2rem' }}>
                <Draggable data={{ id: 1, name: 'Drag me!' }}>
                    <div
                        style={{
                            padding: '1rem',
                            backgroundColor: '#f8f9fa',
                            border: '2px solid #dee2e6',
                            borderRadius: '0.375rem',
                            cursor: 'grab',
                            textAlign: 'center',
                            fontWeight: 500,
                        }}
                    >
                        🎯 Drag Me
                    </div>
                </Draggable>
            </div>
        </DragDropProvider>
    ),
}

// Drop Zone Story
export const BasicDropZone: StoryObj = {
    render: () => {
        const DropZoneDemo = () => {
            const [dropped, setDropped] = useState<string[]>([])

            return (
                <DragDropProvider>
                    <div
                        style={{
                            display: 'flex',
                            gap: '2rem',
                            padding: '2rem',
                        }}
                    >
                        <Draggable data={{ id: 1, name: 'Item 1' }}>
                            <div
                                style={{
                                    padding: '1rem',
                                    backgroundColor: '#408bbd',
                                    color: 'white',
                                    borderRadius: '0.375rem',
                                    cursor: 'grab',
                                }}
                            >
                                📦 Item 1
                            </div>
                        </Draggable>

                        <DropZone
                            onDrop={(data) => {
                                const item = data as { name: string }
                                setDropped([...dropped, item.name])
                            }}
                            style={{ flex: 1 }}
                        >
                            <div
                                style={{
                                    padding: '2rem',
                                    border: '2px dashed #dee2e6',
                                    borderRadius: '0.375rem',
                                    minHeight: '200px',
                                    textAlign: 'center',
                                }}
                            >
                                <h3>Drop Zone</h3>
                                <p>Drag items here</p>
                                {dropped.length > 0 && (
                                    <div style={{ marginTop: '1rem' }}>
                                        <strong>Dropped:</strong>
                                        <ul
                                            style={{
                                                listStyle: 'none',
                                                padding: 0,
                                            }}
                                        >
                                            {dropped.map((item, idx) => (
                                                <li key={idx}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </DropZone>
                    </div>
                </DragDropProvider>
            )
        }

        return <DropZoneDemo />
    },
}

// Sortable List Story
export const BasicSortableList: StoryObj = {
    render: () => {
        const SortableDemo = () => {
            const [items, setItems] = useState([
                { id: 1, name: 'Task 1', completed: false },
                { id: 2, name: 'Task 2', completed: true },
                { id: 3, name: 'Task 3', completed: false },
                { id: 4, name: 'Task 4', completed: false },
            ])

            return (
                <DragDropProvider>
                    <div
                        style={{
                            maxWidth: '500px',
                            margin: '0 auto',
                            padding: '2rem',
                        }}
                    >
                        <h2>Todo List (Drag to Reorder)</h2>
                        <SortableList
                            items={items}
                            onReorder={setItems}
                            renderItem={(item) => {
                                return (
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={item.completed}
                                            onChange={() => {}}
                                        />
                                        <span
                                            style={{
                                                textDecoration: item.completed
                                                    ? 'line-through'
                                                    : 'none',
                                            }}
                                        >
                                            {item.name}
                                        </span>
                                    </div>
                                )
                            }}
                        />
                    </div>
                </DragDropProvider>
            )
        }

        return <SortableDemo />
    },
}

// Sortable List with Handles
export const SortableWithHandles: StoryObj = {
    render: () => {
        const SortableHandleDemo = () => {
            const [items, setItems] = useState([
                { id: 1, title: 'Introduction', pages: 10 },
                { id: 2, title: 'Chapter 1', pages: 25 },
                { id: 3, title: 'Chapter 2', pages: 30 },
                { id: 4, title: 'Conclusion', pages: 5 },
            ])

            return (
                <DragDropProvider>
                    <div
                        style={{
                            maxWidth: '600px',
                            margin: '0 auto',
                            padding: '2rem',
                        }}
                    >
                        <h2>Book Chapters (Reorder with Handle)</h2>
                        <SortableList
                            items={items}
                            onReorder={setItems}
                            showHandle
                            renderItem={(item) => {
                                return (
                                    <div>
                                        <div style={{ fontWeight: 600 }}>
                                            {item.title}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: '0.875rem',
                                                color: '#6c757d',
                                            }}
                                        >
                                            {item.pages} pages
                                        </div>
                                    </div>
                                )
                            }}
                        />
                    </div>
                </DragDropProvider>
            )
        }

        return <SortableHandleDemo />
    },
}

// Multiple Drop Zones
export const MultipleDropZones: StoryObj = {
    render: () => {
        const MultiDropDemo = () => {
            const [backlog, setBacklog] = useState([
                'Task A',
                'Task B',
                'Task C',
            ])
            const [inProgress, setInProgress] = useState<string[]>([])
            const [done, setDone] = useState<string[]>([])

            const handleDrop = (
                list: string[],
                setList: React.Dispatch<React.SetStateAction<string[]>>,
                item: string
            ) => {
                // Remove from all lists
                setBacklog((prev) => prev.filter((i) => i !== item))
                setInProgress((prev) => prev.filter((i) => i !== item))
                setDone((prev) => prev.filter((i) => i !== item))
                // Add to target list
                setList((prev) => [...prev, item])
            }

            const renderList = (
                items: string[],
                setList: React.Dispatch<React.SetStateAction<string[]>>,
                title: string,
                color: string
            ) => (
                <DropZone
                    onDrop={(data) =>
                        handleDrop(
                            items,
                            setList,
                            (data as { name: string }).name
                        )
                    }
                >
                    <div
                        style={{
                            padding: '1rem',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '0.375rem',
                            minHeight: '200px',
                        }}
                    >
                        <h3 style={{ margin: '0 0 1rem 0', color }}>{title}</h3>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.5rem',
                            }}
                        >
                            {items.map((item) => (
                                <Draggable key={item} data={{ name: item }}>
                                    <div
                                        style={{
                                            padding: '0.75rem',
                                            backgroundColor: 'white',
                                            border: `2px solid ${color}`,
                                            borderRadius: '0.375rem',
                                            cursor: 'grab',
                                        }}
                                    >
                                        {item}
                                    </div>
                                </Draggable>
                            ))}
                        </div>
                    </div>
                </DropZone>
            )

            return (
                <DragDropProvider>
                    <div style={{ padding: '2rem' }}>
                        <h2>Kanban Board</h2>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr 1fr',
                                gap: '1rem',
                            }}
                        >
                            {renderList(
                                backlog,
                                setBacklog,
                                'Backlog',
                                '#6c757d'
                            )}
                            {renderList(
                                inProgress,
                                setInProgress,
                                'In Progress',
                                '#408bbd'
                            )}
                            {renderList(done, setDone, 'Done', '#28a745')}
                        </div>
                    </div>
                </DragDropProvider>
            )
        }

        return <MultiDropDemo />
    },
}

// File Upload Simulation
export const FileUploadSimulation: StoryObj = {
    render: () => {
        const FileUploadDemo = () => {
            const [files, setFiles] = useState<
                Array<{ id: number; name: string; size: string }>
            >([])

            return (
                <DragDropProvider>
                    <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
                        <h2>File Upload Simulation</h2>
                        <DropZone
                            onDrop={(data) => {
                                const file = data as {
                                    id: number
                                    name: string
                                    size: string
                                }
                                if (!files.find((f) => f.id === file.id)) {
                                    setFiles([...files, file])
                                }
                            }}
                        >
                            <div
                                style={{
                                    padding: '3rem',
                                    border: '3px dashed #dee2e6',
                                    borderRadius: '0.5rem',
                                    textAlign: 'center',
                                    backgroundColor: '#f8f9fa',
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: '3rem',
                                        marginBottom: '1rem',
                                    }}
                                >
                                    📁
                                </div>
                                <h3>Drop files here</h3>
                                <p style={{ color: '#6c757d' }}>
                                    Drag and drop files to upload
                                </p>
                            </div>
                        </DropZone>

                        {files.length > 0 && (
                            <div style={{ marginTop: '2rem' }}>
                                <h3>Uploaded Files</h3>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '0.5rem',
                                    }}
                                >
                                    {files.map((file) => (
                                        <div
                                            key={file.id}
                                            style={{
                                                padding: '1rem',
                                                backgroundColor: 'white',
                                                border: '1px solid #dee2e6',
                                                borderRadius: '0.375rem',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <span>📄 {file.name}</span>
                                            <span style={{ color: '#6c757d' }}>
                                                {file.size}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Draggable files for demo */}
                        <div style={{ marginTop: '2rem' }}>
                            <h3>Available Files (Drag these)</h3>
                            <div
                                style={{
                                    display: 'flex',
                                    gap: '0.5rem',
                                    flexWrap: 'wrap',
                                }}
                            >
                                {[
                                    {
                                        id: 1,
                                        name: 'document.pdf',
                                        size: '2.5 MB',
                                    },
                                    {
                                        id: 2,
                                        name: 'image.png',
                                        size: '1.2 MB',
                                    },
                                    {
                                        id: 3,
                                        name: 'data.xlsx',
                                        size: '500 KB',
                                    },
                                ].map((file) => (
                                    <Draggable key={file.id} data={file}>
                                        <div
                                            style={{
                                                padding: '0.5rem 1rem',
                                                backgroundColor: '#408bbd',
                                                color: 'white',
                                                borderRadius: '0.375rem',
                                                cursor: 'grab',
                                            }}
                                        >
                                            {file.name}
                                        </div>
                                    </Draggable>
                                ))}
                            </div>
                        </div>
                    </div>
                </DragDropProvider>
            )
        }

        return <FileUploadDemo />
    },
}

// Drag Handle Component
export const DragHandleExample: StoryObj = {
    render: () => (
        <DragDropProvider>
            <div
                style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}
            >
                <h2>Drag Handle Component</h2>
                <p>Use the handle on the left to drag</p>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '1rem',
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #dee2e6',
                        borderRadius: '0.375rem',
                    }}
                >
                    <DragHandle />
                    <span>Content with drag handle</span>
                </div>
            </div>
        </DragDropProvider>
    ),
}

// Complex Nested Example
export const NestedDragDrop: StoryObj = {
    render: () => {
        const NestedDemo = () => {
            const [columns, setColumns] = useState<
                Array<{ id: number; title: string; items: SortableItem[] }>
            >([
                {
                    id: 1,
                    title: 'Column 1',
                    items: [
                        { id: 11, text: 'Item 1.1' },
                        { id: 12, text: 'Item 1.2' },
                    ],
                },
                {
                    id: 2,
                    title: 'Column 2',
                    items: [
                        { id: 21, text: 'Item 2.1' },
                        { id: 22, text: 'Item 2.2' },
                    ],
                },
            ])

            return (
                <DragDropProvider>
                    <div style={{ padding: '2rem' }}>
                        <h2>Nested Sortable Lists</h2>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '2rem',
                            }}
                        >
                            {columns.map((column) => (
                                <div key={column.id}>
                                    <h3>{column.title}</h3>
                                    <SortableList
                                        items={column.items}
                                        onReorder={(newItems) => {
                                            setColumns(
                                                columns.map((col) =>
                                                    col.id === column.id
                                                        ? {
                                                              ...col,
                                                              items: newItems,
                                                          }
                                                        : col
                                                )
                                            )
                                        }}
                                        renderItem={(item) => {
                                            const typedItem = item as {
                                                id: number
                                                text: string
                                            }
                                            return <div>{typedItem.text}</div>
                                        }}
                                        showHandle
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </DragDropProvider>
            )
        }

        return <NestedDemo />
    },
}

// Disabled State
export const DisabledState: StoryObj = {
    render: () => (
        <DragDropProvider>
            <div
                style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}
            >
                <h2>Disabled Drag & Drop</h2>
                <Draggable data={{ id: 1 }} disabled>
                    <div
                        style={{
                            padding: '1rem',
                            backgroundColor: '#f8f9fa',
                            border: '2px solid #dee2e6',
                            borderRadius: '0.375rem',
                            opacity: 0.6,
                            textAlign: 'center',
                        }}
                    >
                        ⛔ Cannot Drag (Disabled)
                    </div>
                </Draggable>
            </div>
        </DragDropProvider>
    ),
}
