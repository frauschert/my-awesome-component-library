import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import useDraggable from './useDraggable'

const meta: Meta = {
    title: 'Hooks/useDraggable',
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj

// Basic draggable box component
const DraggableBox: React.FC<{
    options?: Parameters<typeof useDraggable>[0]
    label?: string
    style?: React.CSSProperties
}> = ({ options, label = 'Drag me!', style = {} }) => {
    const { ref, position, isDragging } = useDraggable<HTMLDivElement>(options)

    return (
        <div
            ref={ref}
            style={{
                position: 'absolute',
                transform: `translate(${position.x}px, ${position.y}px)`,
                padding: '20px 30px',
                backgroundColor: isDragging ? '#4CAF50' : '#2196F3',
                color: 'white',
                borderRadius: '8px',
                cursor: isDragging ? 'grabbing' : 'grab',
                userSelect: 'none',
                boxShadow: isDragging
                    ? '0 8px 16px rgba(0,0,0,0.3)'
                    : '0 4px 8px rgba(0,0,0,0.2)',
                transition: isDragging
                    ? 'none'
                    : 'background-color 0.2s, box-shadow 0.2s',
                fontWeight: 600,
                ...style,
            }}
        >
            {label}
            <div style={{ fontSize: '12px', marginTop: '8px', opacity: 0.9 }}>
                x: {Math.round(position.x)}, y: {Math.round(position.y)}
            </div>
        </div>
    )
}

// Container component
const Container: React.FC<{
    children: React.ReactNode
    style?: React.CSSProperties
}> = ({ children, style }) => (
    <div
        style={{
            position: 'relative',
            width: '600px',
            height: '400px',
            border: '2px dashed #ccc',
            borderRadius: '8px',
            backgroundColor: '#f5f5f5',
            overflow: 'hidden',
            ...style,
        }}
    >
        {children}
    </div>
)

export const Basic: Story = {
    render: () => (
        <Container>
            <DraggableBox label="Basic Draggable" />
        </Container>
    ),
}

export const WithInitialPosition: Story = {
    render: () => (
        <Container>
            <DraggableBox
                options={{
                    initialPosition: { x: 200, y: 150 },
                }}
                label="Starts at (200, 150)"
            />
        </Container>
    ),
}

export const BoundedToParent: Story = {
    render: () => (
        <Container>
            <DraggableBox
                options={{
                    initialPosition: { x: 50, y: 50 },
                    bounds: 'parent',
                }}
                label="Can't leave parent"
            />
            <div
                style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '10px',
                    fontSize: '12px',
                    color: '#666',
                }}
            >
                Try dragging outside the dashed border
            </div>
        </Container>
    ),
}

export const CustomBounds: Story = {
    render: () => (
        <Container>
            <DraggableBox
                options={{
                    initialPosition: { x: 100, y: 100 },
                    bounds: { left: 50, right: 400, top: 50, bottom: 300 },
                }}
                label="Custom bounds"
            />
            <div
                style={{
                    position: 'absolute',
                    left: '50px',
                    top: '50px',
                    width: '400px',
                    height: '300px',
                    border: '2px solid #ff9800',
                    borderRadius: '4px',
                    pointerEvents: 'none',
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '10px',
                    fontSize: '12px',
                    color: '#666',
                }}
            >
                Constrained to orange rectangle
            </div>
        </Container>
    ),
}

export const HorizontalOnly: Story = {
    render: () => (
        <Container>
            <DraggableBox
                options={{
                    initialPosition: { x: 50, y: 150 },
                    axis: 'x',
                }}
                label="Horizontal only"
            />
            <div
                style={{
                    position: 'absolute',
                    left: 0,
                    top: '150px',
                    width: '100%',
                    height: '2px',
                    backgroundColor: '#ff9800',
                    pointerEvents: 'none',
                }}
            />
        </Container>
    ),
}

export const VerticalOnly: Story = {
    render: () => (
        <Container>
            <DraggableBox
                options={{
                    initialPosition: { x: 250, y: 50 },
                    axis: 'y',
                }}
                label="Vertical only"
            />
            <div
                style={{
                    position: 'absolute',
                    left: '250px',
                    top: 0,
                    width: '2px',
                    height: '100%',
                    backgroundColor: '#ff9800',
                    pointerEvents: 'none',
                }}
            />
        </Container>
    ),
}

export const GridSnapping: Story = {
    render: () => {
        const gridSize = 50

        return (
            <Container>
                {/* Grid background */}
                <svg
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        pointerEvents: 'none',
                    }}
                >
                    <defs>
                        <pattern
                            id="grid"
                            width={gridSize}
                            height={gridSize}
                            patternUnits="userSpaceOnUse"
                        >
                            <rect
                                width={gridSize}
                                height={gridSize}
                                fill="none"
                            />
                            <path
                                d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
                                fill="none"
                                stroke="#ddd"
                                strokeWidth="1"
                            />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>

                <DraggableBox
                    options={{
                        initialPosition: { x: 100, y: 100 },
                        grid: [gridSize, gridSize],
                    }}
                    label="Snaps to 50px grid"
                />
            </Container>
        )
    },
}

export const WithHandle: Story = {
    render: () => {
        const DraggableCard = () => {
            const { ref, position, isDragging } = useDraggable({
                initialPosition: { x: 100, y: 50 },
                handle: '.drag-handle',
            })

            return (
                <div
                    ref={ref}
                    style={{
                        position: 'absolute',
                        transform: `translate(${position.x}px, ${position.y}px)`,
                        width: '300px',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        boxShadow: isDragging
                            ? '0 8px 16px rgba(0,0,0,0.3)'
                            : '0 4px 8px rgba(0,0,0,0.2)',
                        overflow: 'hidden',
                    }}
                >
                    <div
                        className="drag-handle"
                        style={{
                            padding: '15px',
                            backgroundColor: '#2196F3',
                            color: 'white',
                            cursor: isDragging ? 'grabbing' : 'grab',
                            userSelect: 'none',
                            fontWeight: 600,
                        }}
                    >
                        ⋮⋮ Drag Handle
                    </div>
                    <div style={{ padding: '20px' }}>
                        <p style={{ margin: 0, color: '#333' }}>
                            This content is not draggable. Only the blue header
                            can be used to drag this card.
                        </p>
                        <button
                            style={{ marginTop: '10px', padding: '8px 16px' }}
                        >
                            Clickable Button
                        </button>
                    </div>
                </div>
            )
        }

        return (
            <Container>
                <DraggableCard />
            </Container>
        )
    },
}

export const WithCancelSelector: Story = {
    render: () => {
        const DraggableWithInput = () => {
            const { ref, position, isDragging } = useDraggable({
                initialPosition: { x: 100, y: 100 },
                cancel: 'input, button',
            })

            return (
                <div
                    ref={ref}
                    style={{
                        position: 'absolute',
                        transform: `translate(${position.x}px, ${position.y}px)`,
                        padding: '20px',
                        backgroundColor: isDragging ? '#4CAF50' : '#2196F3',
                        color: 'white',
                        borderRadius: '8px',
                        cursor: isDragging ? 'grabbing' : 'grab',
                        userSelect: 'none',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                    }}
                >
                    <h4 style={{ margin: '0 0 10px 0' }}>Draggable Form</h4>
                    <input
                        type="text"
                        placeholder="Type here (not draggable)"
                        style={{
                            padding: '8px',
                            marginBottom: '10px',
                            width: '100%',
                            boxSizing: 'border-box',
                        }}
                    />
                    <button
                        style={{
                            padding: '8px 16px',
                            backgroundColor: 'white',
                            color: '#2196F3',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                    >
                        Click me (not draggable)
                    </button>
                </div>
            )
        }

        return (
            <Container>
                <DraggableWithInput />
            </Container>
        )
    },
}

export const MultipleItems: Story = {
    render: () => (
        <Container>
            <DraggableBox
                options={{ initialPosition: { x: 50, y: 50 } }}
                label="Item 1"
                style={{ backgroundColor: '#2196F3' }}
            />
            <DraggableBox
                options={{ initialPosition: { x: 200, y: 100 } }}
                label="Item 2"
                style={{ backgroundColor: '#4CAF50' }}
            />
            <DraggableBox
                options={{ initialPosition: { x: 350, y: 50 } }}
                label="Item 3"
                style={{ backgroundColor: '#FF9800' }}
            />
            <DraggableBox
                options={{ initialPosition: { x: 150, y: 250 } }}
                label="Item 4"
                style={{ backgroundColor: '#9C27B0' }}
            />
        </Container>
    ),
}

export const WithCallbacks: Story = {
    render: () => {
        const CallbackDemo = () => {
            const [events, setEvents] = useState<string[]>([])

            const addEvent = (event: string) => {
                setEvents((prev) => [...prev.slice(-4), event])
            }

            const { ref, position, isDragging } = useDraggable({
                initialPosition: { x: 150, y: 100 },
                onDragStart: (pos) =>
                    addEvent(
                        `Start: (${Math.round(pos.x)}, ${Math.round(pos.y)})`
                    ),
                onDrag: (pos) =>
                    addEvent(
                        `Drag: (${Math.round(pos.x)}, ${Math.round(pos.y)})`
                    ),
                onDragEnd: (pos) =>
                    addEvent(
                        `End: (${Math.round(pos.x)}, ${Math.round(pos.y)})`
                    ),
            })

            return (
                <>
                    <div
                        ref={ref}
                        style={{
                            position: 'absolute',
                            transform: `translate(${position.x}px, ${position.y}px)`,
                            padding: '20px 30px',
                            backgroundColor: isDragging ? '#4CAF50' : '#2196F3',
                            color: 'white',
                            borderRadius: '8px',
                            cursor: isDragging ? 'grabbing' : 'grab',
                            userSelect: 'none',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                            fontWeight: 600,
                        }}
                    >
                        Drag me!
                    </div>

                    <div
                        style={{
                            position: 'absolute',
                            bottom: '10px',
                            left: '10px',
                            right: '10px',
                            padding: '10px',
                            backgroundColor: 'white',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontFamily: 'monospace',
                            maxHeight: '100px',
                            overflow: 'auto',
                        }}
                    >
                        <div
                            style={{ fontWeight: 'bold', marginBottom: '5px' }}
                        >
                            Events:
                        </div>
                        {events.map((event, i) => (
                            <div key={i}>{event}</div>
                        ))}
                    </div>
                </>
            )
        }

        return (
            <Container>
                <CallbackDemo />
            </Container>
        )
    },
}

export const Disabled: Story = {
    render: () => {
        const DisabledDemo = () => {
            const [disabled, setDisabled] = useState(false)

            return (
                <Container>
                    <DraggableBox
                        options={{
                            initialPosition: { x: 150, y: 100 },
                            disabled,
                        }}
                        label={disabled ? 'Disabled' : 'Enabled'}
                    />

                    <div
                        style={{
                            position: 'absolute',
                            top: '10px',
                            left: '10px',
                        }}
                    >
                        <label
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={disabled}
                                onChange={(e) => setDisabled(e.target.checked)}
                            />
                            <span>Disable dragging</span>
                        </label>
                    </div>
                </Container>
            )
        }

        return <DisabledDemo />
    },
}

export const WithResetButton: Story = {
    render: () => {
        const ResetDemo = () => {
            const { ref, position, isDragging, reset } = useDraggable({
                initialPosition: { x: 200, y: 150 },
            })

            return (
                <Container>
                    <div
                        ref={ref}
                        style={{
                            position: 'absolute',
                            transform: `translate(${position.x}px, ${position.y}px)`,
                            padding: '20px 30px',
                            backgroundColor: isDragging ? '#4CAF50' : '#2196F3',
                            color: 'white',
                            borderRadius: '8px',
                            cursor: isDragging ? 'grabbing' : 'grab',
                            userSelect: 'none',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                            fontWeight: 600,
                        }}
                    >
                        Drag me!
                    </div>

                    <button
                        onClick={reset}
                        style={{
                            position: 'absolute',
                            bottom: '20px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            padding: '10px 20px',
                            backgroundColor: '#FF5722',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 600,
                        }}
                    >
                        Reset Position
                    </button>
                </Container>
            )
        }

        return <ResetDemo />
    },
}

export const DraggableModal: Story = {
    render: () => {
        const Modal = () => {
            const { ref, position, isDragging } = useDraggable({
                initialPosition: { x: 150, y: 50 },
                handle: '.modal-header',
                bounds: 'parent',
            })

            return (
                <div
                    ref={ref}
                    style={{
                        position: 'absolute',
                        transform: `translate(${position.x}px, ${position.y}px)`,
                        width: '320px',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        boxShadow: isDragging
                            ? '0 10px 25px rgba(0,0,0,0.3)'
                            : '0 5px 15px rgba(0,0,0,0.2)',
                        overflow: 'hidden',
                    }}
                >
                    <div
                        className="modal-header"
                        style={{
                            padding: '15px 20px',
                            backgroundColor: '#2196F3',
                            color: 'white',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            cursor: isDragging ? 'grabbing' : 'grab',
                            userSelect: 'none',
                        }}
                    >
                        <h3
                            style={{
                                margin: 0,
                                fontSize: '16px',
                                fontWeight: 600,
                            }}
                        >
                            Draggable Modal
                        </h3>
                        <button
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'white',
                                fontSize: '20px',
                                cursor: 'pointer',
                                padding: 0,
                                lineHeight: 1,
                            }}
                        >
                            ×
                        </button>
                    </div>
                    <div style={{ padding: '20px' }}>
                        <p style={{ margin: '0 0 15px 0', color: '#333' }}>
                            This modal can be dragged by its header. The content
                            area is interactive.
                        </p>
                        <input
                            type="text"
                            placeholder="Type something..."
                            style={{
                                width: '100%',
                                padding: '8px',
                                marginBottom: '10px',
                                boxSizing: 'border-box',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                            }}
                        />
                        <div
                            style={{
                                display: 'flex',
                                gap: '10px',
                                justifyContent: 'flex-end',
                            }}
                        >
                            <button
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#f5f5f5',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#2196F3',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                }}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <Container style={{ height: '500px' }}>
                <Modal />
            </Container>
        )
    },
}

export const ComplexExample: Story = {
    render: () => {
        const ComplexDemo = () => {
            const [items, setItems] = useState([
                { id: 1, color: '#2196F3', x: 50, y: 50 },
                { id: 2, color: '#4CAF50', x: 200, y: 100 },
                { id: 3, color: '#FF9800', x: 350, y: 150 },
            ])

            const DraggableItem = ({
                item,
                onPositionChange,
            }: {
                item: (typeof items)[0]
                onPositionChange: (id: number, x: number, y: number) => void
            }) => {
                const { ref, position, isDragging } =
                    useDraggable<HTMLDivElement>({
                        initialPosition: { x: item.x, y: item.y },
                        bounds: 'parent',
                        grid: [25, 25],
                        onDragEnd: (pos) =>
                            onPositionChange(item.id, pos.x, pos.y),
                    })

                return (
                    <div
                        ref={ref}
                        style={{
                            position: 'absolute',
                            transform: `translate(${position.x}px, ${position.y}px)`,
                            width: '60px',
                            height: '60px',
                            backgroundColor: item.color,
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '20px',
                            cursor: isDragging ? 'grabbing' : 'grab',
                            userSelect: 'none',
                            boxShadow: isDragging
                                ? '0 8px 16px rgba(0,0,0,0.3)'
                                : '0 4px 8px rgba(0,0,0,0.2)',
                            transition: isDragging ? 'none' : 'box-shadow 0.2s',
                        }}
                    >
                        {item.id}
                    </div>
                )
            }

            const handlePositionChange = (id: number, x: number, y: number) => {
                setItems((prev) =>
                    prev.map((item) =>
                        item.id === id ? { ...item, x, y } : item
                    )
                )
            }

            return (
                <>
                    <Container style={{ height: '500px' }}>
                        {items.map((item) => (
                            <DraggableItem
                                key={item.id}
                                item={item}
                                onPositionChange={handlePositionChange}
                            />
                        ))}
                    </Container>
                    <div
                        style={{
                            marginTop: '20px',
                            padding: '15px',
                            backgroundColor: 'white',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontFamily: 'monospace',
                        }}
                    >
                        <div
                            style={{ fontWeight: 'bold', marginBottom: '10px' }}
                        >
                            Item Positions:
                        </div>
                        {items.map((item) => (
                            <div key={item.id}>
                                Item {item.id}: ({item.x}, {item.y})
                            </div>
                        ))}
                    </div>
                </>
            )
        }

        return <ComplexDemo />
    },
}
