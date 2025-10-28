import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import {
    DragDropProvider,
    Draggable,
    DropZone,
    SortableList,
    DragHandle,
} from './DragDrop'

describe('DragDropProvider', () => {
    it('renders children', () => {
        render(
            <DragDropProvider>
                <div>Test Content</div>
            </DragDropProvider>
        )
        expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('provides context to children', () => {
        const TestComponent = () => {
            return (
                <DragDropProvider>
                    <Draggable data={{ id: 1 }}>
                        <div>Draggable Item</div>
                    </Draggable>
                </DragDropProvider>
            )
        }

        render(<TestComponent />)
        expect(screen.getByText('Draggable Item')).toBeInTheDocument()
    })
})

describe('Draggable', () => {
    it('renders draggable content', () => {
        render(
            <DragDropProvider>
                <Draggable data={{ id: 1 }}>
                    <div>Drag me</div>
                </Draggable>
            </DragDropProvider>
        )
        expect(screen.getByText('Drag me')).toBeInTheDocument()
    })

    it('has draggable attribute', () => {
        const { container } = render(
            <DragDropProvider>
                <Draggable data={{ id: 1 }}>
                    <div>Drag me</div>
                </Draggable>
            </DragDropProvider>
        )
        const draggable = container.querySelector('.draggable')
        expect(draggable).toHaveAttribute('draggable', 'true')
    })

    it('applies disabled state', () => {
        const { container } = render(
            <DragDropProvider>
                <Draggable data={{ id: 1 }} disabled>
                    <div>Disabled</div>
                </Draggable>
            </DragDropProvider>
        )
        const draggable = container.querySelector('.draggable')
        expect(draggable).toHaveClass('draggable--disabled')
        expect(draggable).toHaveAttribute('draggable', 'false')
    })

    it('calls onDragStart callback', () => {
        const handleDragStart = jest.fn()
        const { container } = render(
            <DragDropProvider>
                <Draggable data={{ id: 1 }} onDragStart={handleDragStart}>
                    <div>Drag me</div>
                </Draggable>
            </DragDropProvider>
        )

        const draggable = container.querySelector('.draggable')!
        fireEvent.dragStart(draggable)

        expect(handleDragStart).toHaveBeenCalledWith({ id: 1 }, undefined)
    })

    it('calls onDragEnd callback', () => {
        const handleDragEnd = jest.fn()
        const { container } = render(
            <DragDropProvider>
                <Draggable data={{ id: 1 }} onDragEnd={handleDragEnd}>
                    <div>Drag me</div>
                </Draggable>
            </DragDropProvider>
        )

        const draggable = container.querySelector('.draggable')!
        fireEvent.dragEnd(draggable)

        expect(handleDragEnd).toHaveBeenCalledWith({ id: 1 }, undefined)
    })

    it('applies custom className', () => {
        const { container } = render(
            <DragDropProvider>
                <Draggable data={{ id: 1 }} className="custom-class">
                    <div>Drag me</div>
                </Draggable>
            </DragDropProvider>
        )
        const draggable = container.querySelector('.draggable')
        expect(draggable).toHaveClass('custom-class')
    })

    it('applies dragging state', () => {
        const { container } = render(
            <DragDropProvider>
                <Draggable data={{ id: 1 }}>
                    <div>Drag me</div>
                </Draggable>
            </DragDropProvider>
        )

        const draggable = container.querySelector('.draggable')!
        fireEvent.dragStart(draggable)

        expect(draggable).toHaveClass('draggable--dragging')
    })
})

describe('DropZone', () => {
    it('renders drop zone content', () => {
        render(
            <DragDropProvider>
                <DropZone onDrop={jest.fn()}>
                    <div>Drop here</div>
                </DropZone>
            </DragDropProvider>
        )
        expect(screen.getByText('Drop here')).toBeInTheDocument()
    })

    it('calls onDrop callback', () => {
        const handleDrop = jest.fn()
        const { container } = render(
            <DragDropProvider>
                <Draggable data={{ id: 1 }}>
                    <div>Drag me</div>
                </Draggable>
                <DropZone onDrop={handleDrop}>
                    <div>Drop here</div>
                </DropZone>
            </DragDropProvider>
        )

        const draggable = container.querySelector('.draggable')!
        const dropZone = container.querySelector('.drop-zone')!

        fireEvent.dragStart(draggable)
        fireEvent.dragOver(dropZone)
        fireEvent.drop(dropZone)

        expect(handleDrop).toHaveBeenCalledWith({ id: 1 }, undefined)
    })

    it('shows drop indicator on drag over', () => {
        const { container } = render(
            <DragDropProvider>
                <DropZone onDrop={jest.fn()}>
                    <div>Drop here</div>
                </DropZone>
            </DragDropProvider>
        )

        const dropZone = container.querySelector('.drop-zone')!
        fireEvent.dragEnter(dropZone)

        expect(
            container.querySelector('.drop-zone__indicator')
        ).toBeInTheDocument()
    })

    it('hides indicator when showDropIndicator is false', () => {
        const { container } = render(
            <DragDropProvider>
                <DropZone onDrop={jest.fn()} showDropIndicator={false}>
                    <div>Drop here</div>
                </DropZone>
            </DragDropProvider>
        )

        const dropZone = container.querySelector('.drop-zone')!
        fireEvent.dragEnter(dropZone)

        expect(
            container.querySelector('.drop-zone__indicator')
        ).not.toBeInTheDocument()
    })

    it('applies disabled state', () => {
        const handleDrop = jest.fn()
        const { container } = render(
            <DragDropProvider>
                <DropZone onDrop={handleDrop} disabled>
                    <div>Drop here</div>
                </DropZone>
            </DragDropProvider>
        )

        const dropZone = container.querySelector('.drop-zone')!
        expect(dropZone).toHaveClass('drop-zone--disabled')

        fireEvent.drop(dropZone)
        expect(handleDrop).not.toHaveBeenCalled()
    })

    it('applies over state', () => {
        const { container } = render(
            <DragDropProvider>
                <DropZone onDrop={jest.fn()}>
                    <div>Drop here</div>
                </DropZone>
            </DragDropProvider>
        )

        const dropZone = container.querySelector('.drop-zone')!
        fireEvent.dragEnter(dropZone)

        expect(dropZone).toHaveClass('drop-zone--over')
    })

    it('applies custom className', () => {
        const { container } = render(
            <DragDropProvider>
                <DropZone onDrop={jest.fn()} className="custom-drop">
                    <div>Drop here</div>
                </DropZone>
            </DragDropProvider>
        )

        const dropZone = container.querySelector('.drop-zone')
        expect(dropZone).toHaveClass('custom-drop')
    })
})

describe('SortableList', () => {
    const items = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' },
    ]

    it('renders all items', () => {
        render(
            <DragDropProvider>
                <SortableList
                    items={items}
                    onReorder={jest.fn()}
                    renderItem={(item) => (
                        <div>{(item as (typeof items)[0]).name}</div>
                    )}
                />
            </DragDropProvider>
        )

        expect(screen.getByText('Item 1')).toBeInTheDocument()
        expect(screen.getByText('Item 2')).toBeInTheDocument()
        expect(screen.getByText('Item 3')).toBeInTheDocument()
    })

    it('shows drag handles when showHandle is true', () => {
        const { container } = render(
            <DragDropProvider>
                <SortableList
                    items={items}
                    onReorder={jest.fn()}
                    renderItem={(item) => (
                        <div>{(item as (typeof items)[0]).name}</div>
                    )}
                    showHandle
                />
            </DragDropProvider>
        )

        const handles = container.querySelectorAll('.sortable-list__handle')
        expect(handles).toHaveLength(3)
    })

    it('calls onReorder when items are reordered', () => {
        const handleReorder = jest.fn()
        const { container } = render(
            <DragDropProvider>
                <SortableList
                    items={items}
                    onReorder={handleReorder}
                    renderItem={(item) => (
                        <div>{(item as (typeof items)[0]).name}</div>
                    )}
                />
            </DragDropProvider>
        )

        const itemElements = container.querySelectorAll('.sortable-list__item')
        fireEvent.dragStart(itemElements[0])
        fireEvent.drop(itemElements[2])

        expect(handleReorder).toHaveBeenCalled()
    })

    it('applies disabled state', () => {
        const { container } = render(
            <DragDropProvider>
                <SortableList
                    items={items}
                    onReorder={jest.fn()}
                    renderItem={(item) => (
                        <div>{(item as (typeof items)[0]).name}</div>
                    )}
                    disabled
                />
            </DragDropProvider>
        )

        const list = container.querySelector('.sortable-list')
        expect(list).toHaveClass('sortable-list--disabled')
    })

    it('applies custom className', () => {
        const { container } = render(
            <DragDropProvider>
                <SortableList
                    items={items}
                    onReorder={jest.fn()}
                    renderItem={(item) => (
                        <div>{(item as (typeof items)[0]).name}</div>
                    )}
                    className="custom-list"
                />
            </DragDropProvider>
        )

        const list = container.querySelector('.sortable-list')
        expect(list).toHaveClass('custom-list')
    })

    it('updates when items prop changes', () => {
        const { rerender } = render(
            <DragDropProvider>
                <SortableList
                    items={items}
                    onReorder={jest.fn()}
                    renderItem={(item) => (
                        <div>{(item as (typeof items)[0]).name}</div>
                    )}
                />
            </DragDropProvider>
        )

        const newItems = [{ id: 4, name: 'Item 4' }]
        rerender(
            <DragDropProvider>
                <SortableList
                    items={newItems}
                    onReorder={jest.fn()}
                    renderItem={(item) => (
                        <div>{(item as (typeof newItems)[0]).name}</div>
                    )}
                />
            </DragDropProvider>
        )

        expect(screen.getByText('Item 4')).toBeInTheDocument()
        expect(screen.queryByText('Item 1')).not.toBeInTheDocument()
    })
})

describe('DragHandle', () => {
    it('renders default handle icon', () => {
        const { container } = render(
            <DragDropProvider>
                <DragHandle />
            </DragDropProvider>
        )

        expect(container.querySelector('.drag-handle')).toBeInTheDocument()
        expect(container.querySelector('svg')).toBeInTheDocument()
    })

    it('renders custom content', () => {
        render(
            <DragDropProvider>
                <DragHandle>
                    <span>Custom Handle</span>
                </DragHandle>
            </DragDropProvider>
        )

        expect(screen.getByText('Custom Handle')).toBeInTheDocument()
    })

    it('applies custom className', () => {
        const { container } = render(
            <DragDropProvider>
                <DragHandle className="custom-handle" />
            </DragDropProvider>
        )

        const handle = container.querySelector('.drag-handle')
        expect(handle).toHaveClass('custom-handle')
    })

    it('is draggable', () => {
        const { container } = render(
            <DragDropProvider>
                <DragHandle />
            </DragDropProvider>
        )

        const handle = container.querySelector('.drag-handle')
        expect(handle).toHaveAttribute('draggable', 'true')
    })
})

describe('Integration', () => {
    it('allows dragging between drop zones', () => {
        const handleDrop1 = jest.fn()
        const handleDrop2 = jest.fn()

        const { container } = render(
            <DragDropProvider>
                <Draggable data={{ id: 1 }}>
                    <div>Item</div>
                </Draggable>
                <DropZone onDrop={handleDrop1} id="zone1">
                    <div>Zone 1</div>
                </DropZone>
                <DropZone onDrop={handleDrop2} id="zone2">
                    <div>Zone 2</div>
                </DropZone>
            </DragDropProvider>
        )

        const draggable = container.querySelector('.draggable')!
        const dropZone2 = container.querySelectorAll('.drop-zone')[1]

        fireEvent.dragStart(draggable)
        fireEvent.drop(dropZone2)

        expect(handleDrop2).toHaveBeenCalledWith({ id: 1 }, undefined)
    })
})
