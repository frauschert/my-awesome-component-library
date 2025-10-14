import React, { useState } from 'react'
import { StoryObj, Meta } from '@storybook/react-vite'
import { Resizable } from './Resizable'

const meta: Meta<typeof Resizable> = {
    title: 'Components/Resizable',
    component: Resizable,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
    },
}

export default meta

type Story = StoryObj<typeof Resizable>

// Wrapper component for examples
const ExampleContent: React.FC = () => (
    <div style={{ padding: '20px', height: '100%', overflow: 'auto' }}>
        <h3 style={{ margin: '0 0 10px 0' }}>Resizable Content</h3>
        <p>
            Drag any of the resize handles to change the size of this container.
        </p>
        <p>Try dragging from edges or corners!</p>
    </div>
)

export const Default: Story = {
    args: {
        width: 400,
        height: 300,
        children: <ExampleContent />,
    },
}

export const AllHandles: Story = {
    args: {
        width: 400,
        height: 300,
        children: <ExampleContent />,
        handles: [
            'top',
            'right',
            'bottom',
            'left',
            'topLeft',
            'topRight',
            'bottomLeft',
            'bottomRight',
        ],
    },
}

export const OnlyEdges: Story = {
    args: {
        width: 400,
        height: 300,
        children: <ExampleContent />,
        handles: ['top', 'right', 'bottom', 'left'],
    },
}

export const OnlyCorners: Story = {
    args: {
        width: 400,
        height: 300,
        children: <ExampleContent />,
        handles: ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'],
    },
}

export const RightAndBottom: Story = {
    args: {
        width: 400,
        height: 300,
        children: <ExampleContent />,
        handles: ['right', 'bottom', 'bottomRight'],
    },
}

export const WithConstraints: Story = {
    args: {
        width: 300,
        height: 200,
        minWidth: 200,
        minHeight: 150,
        maxWidth: 600,
        maxHeight: 400,
        children: (
            <div style={{ padding: '20px' }}>
                <h3>With Min/Max Constraints</h3>
                <p>Min: 200x150px</p>
                <p>Max: 600x400px</p>
                <p>Try resizing beyond these limits!</p>
            </div>
        ),
    },
}

export const WithStepSnapping: Story = {
    args: {
        width: 300,
        height: 200,
        step: 20,
        children: (
            <div style={{ padding: '20px' }}>
                <h3>Snaps to 20px Grid</h3>
                <p>Notice how the size jumps in 20px increments</p>
            </div>
        ),
    },
}

export const PreserveAspectRatio: Story = {
    args: {
        width: 400,
        height: 400,
        preserveAspectRatio: true,
        children: (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h3>Aspect Ratio Locked</h3>
                <div
                    style={{
                        width: '80%',
                        height: '80%',
                        margin: '10px auto',
                        background:
                            'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                    }}
                >
                    Square
                </div>
            </div>
        ),
    },
}

export const ShowHandlesOnHover: Story = {
    args: {
        width: 400,
        height: 300,
        showHandlesOnHover: true,
        children: (
            <div style={{ padding: '20px' }}>
                <h3>Hover to See Handles</h3>
                <p>Handles only appear when you hover over this component</p>
            </div>
        ),
    },
}

export const Disabled: Story = {
    args: {
        width: 400,
        height: 300,
        disabled: true,
        children: (
            <div style={{ padding: '20px' }}>
                <h3>Disabled State</h3>
                <p>This component cannot be resized</p>
            </div>
        ),
    },
}

export const ControlledMode: Story = {
    render: () => {
        const [size, setSize] = useState({ width: 400, height: 300 })

        return (
            <div>
                <div
                    style={{
                        marginBottom: '20px',
                        padding: '10px',
                        background: '#f5f5f5',
                        borderRadius: '4px',
                    }}
                >
                    <p style={{ margin: '0 0 10px 0' }}>
                        <strong>Current Size:</strong> {size.width}px ×{' '}
                        {size.height}px
                    </p>
                    <button
                        onClick={() => setSize({ width: 300, height: 200 })}
                        style={{ marginRight: '10px', padding: '5px 10px' }}
                    >
                        Set 300×200
                    </button>
                    <button
                        onClick={() => setSize({ width: 500, height: 400 })}
                        style={{ padding: '5px 10px' }}
                    >
                        Set 500×400
                    </button>
                </div>
                <Resizable
                    width={size.width}
                    height={size.height}
                    onResize={setSize}
                >
                    <div style={{ padding: '20px' }}>
                        <h3>Controlled Size</h3>
                        <p>Size is controlled by parent component</p>
                        <p>
                            Current: {size.width}×{size.height}
                        </p>
                    </div>
                </Resizable>
            </div>
        )
    },
}

export const WithCallbacks: Story = {
    render: () => {
        const [logs, setLogs] = useState<string[]>([])

        const addLog = (message: string) => {
            setLogs((prev) => [
                ...prev.slice(-4),
                `${new Date().toLocaleTimeString()}: ${message}`,
            ])
        }

        return (
            <div>
                <Resizable
                    width={400}
                    height={300}
                    onResizeStart={(size) =>
                        addLog(`Started - ${size.width}×${size.height}`)
                    }
                    onResize={(size) =>
                        addLog(`Resizing - ${size.width}×${size.height}`)
                    }
                    onResizeEnd={(size) =>
                        addLog(`Ended - ${size.width}×${size.height}`)
                    }
                >
                    <div style={{ padding: '20px' }}>
                        <h3>Resize Callbacks</h3>
                        <div
                            style={{
                                marginTop: '10px',
                                padding: '10px',
                                background: '#f5f5f5',
                                borderRadius: '4px',
                                maxHeight: '200px',
                                overflow: 'auto',
                            }}
                        >
                            <strong>Event Log:</strong>
                            {logs.length === 0 && (
                                <p>Start resizing to see events...</p>
                            )}
                            {logs.map((log, i) => (
                                <div
                                    key={i}
                                    style={{
                                        fontSize: '12px',
                                        marginTop: '4px',
                                    }}
                                >
                                    {log}
                                </div>
                            ))}
                        </div>
                    </div>
                </Resizable>
            </div>
        )
    },
}

export const CustomStyling: Story = {
    args: {
        width: 400,
        height: 300,
        className: 'custom-resizable',
        style: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            color: 'white',
        },
        children: (
            <div style={{ padding: '30px', textAlign: 'center' }}>
                <h2 style={{ margin: '0 0 10px 0' }}>Custom Styled</h2>
                <p>With gradient background and shadow</p>
            </div>
        ),
    },
}

export const MultipleResizables: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <Resizable
                width={250}
                height={200}
                style={{
                    border: '2px solid #667eea',
                    borderRadius: '8px',
                    background: '#f0f4ff',
                }}
            >
                <div style={{ padding: '15px' }}>
                    <h4 style={{ margin: '0 0 8px 0' }}>Panel 1</h4>
                    <p style={{ margin: 0, fontSize: '14px' }}>Resize me!</p>
                </div>
            </Resizable>

            <Resizable
                width={250}
                height={200}
                style={{
                    border: '2px solid #f093fb',
                    borderRadius: '8px',
                    background: '#fef0ff',
                }}
            >
                <div style={{ padding: '15px' }}>
                    <h4 style={{ margin: '0 0 8px 0' }}>Panel 2</h4>
                    <p style={{ margin: 0, fontSize: '14px' }}>
                        Independent resize!
                    </p>
                </div>
            </Resizable>

            <Resizable
                width={250}
                height={200}
                style={{
                    border: '2px solid #4facfe',
                    borderRadius: '8px',
                    background: '#f0f9ff',
                }}
            >
                <div style={{ padding: '15px' }}>
                    <h4 style={{ margin: '0 0 8px 0' }}>Panel 3</h4>
                    <p style={{ margin: 0, fontSize: '14px' }}>
                        Try all three!
                    </p>
                </div>
            </Resizable>
        </div>
    ),
}

export const RealWorldExample: Story = {
    render: () => {
        const [size, setSize] = useState({ width: 400, height: 500 })

        return (
            <Resizable
                width={size.width}
                height={size.height}
                minWidth={300}
                minHeight={400}
                maxWidth={800}
                onResize={setSize}
                style={{
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    background: 'white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                    }}
                >
                    <div
                        style={{
                            padding: '15px',
                            borderBottom: '1px solid #e0e0e0',
                            background: '#f8f9fa',
                        }}
                    >
                        <h3 style={{ margin: 0 }}>Inspector Panel</h3>
                    </div>
                    <div style={{ flex: 1, padding: '20px', overflow: 'auto' }}>
                        <div style={{ marginBottom: '20px' }}>
                            <label
                                style={{
                                    display: 'block',
                                    fontWeight: 'bold',
                                    marginBottom: '5px',
                                }}
                            >
                                Width
                            </label>
                            <input
                                type="range"
                                value={size.width}
                                onChange={(e) =>
                                    setSize((s) => ({
                                        ...s,
                                        width: Number(e.target.value),
                                    }))
                                }
                                min="300"
                                max="800"
                                style={{ width: '100%' }}
                            />
                            <span>{size.width}px</span>
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <label
                                style={{
                                    display: 'block',
                                    fontWeight: 'bold',
                                    marginBottom: '5px',
                                }}
                            >
                                Height
                            </label>
                            <input
                                type="range"
                                value={size.height}
                                onChange={(e) =>
                                    setSize((s) => ({
                                        ...s,
                                        height: Number(e.target.value),
                                    }))
                                }
                                min="400"
                                max="800"
                                style={{ width: '100%' }}
                            />
                            <span>{size.height}px</span>
                        </div>
                        <div
                            style={{
                                padding: '15px',
                                background: '#f5f5f5',
                                borderRadius: '4px',
                                marginTop: '20px',
                            }}
                        >
                            <p
                                style={{
                                    margin: '0 0 10px 0',
                                    fontSize: '14px',
                                }}
                            >
                                <strong>Properties:</strong>
                            </p>
                            <ul
                                style={{
                                    margin: 0,
                                    paddingLeft: '20px',
                                    fontSize: '13px',
                                }}
                            >
                                <li>
                                    Size: {size.width} × {size.height}
                                </li>
                                <li>Min: 300 × 400</li>
                                <li>Max: 800 × 800</li>
                                <li>Handles: All 8 directions</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </Resizable>
        )
    },
}
