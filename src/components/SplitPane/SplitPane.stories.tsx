import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import SplitPane, { Pane } from './SplitPane'

const meta: Meta<typeof SplitPane> = {
    title: 'Components/SplitPane',
    component: SplitPane,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
    argTypes: {
        direction: {
            control: 'select',
            options: ['horizontal', 'vertical'],
            description: 'Split direction',
        },
        splitterSize: {
            control: { type: 'number', min: 4, max: 16, step: 1 },
            description: 'Splitter size in pixels',
        },
        showGutters: {
            control: 'boolean',
            description: 'Show splitter gutters',
        },
        collapsible: {
            control: 'boolean',
            description: 'Allow panes to collapse',
        },
    },
}

export default meta
type Story = StoryObj<typeof SplitPane>

// Basic Horizontal Split
export const HorizontalSplit: Story = {
    render: () => (
        <div style={{ height: '500px', border: '1px solid #ccc' }}>
            <SplitPane direction="horizontal" initialSizes={[50, 50]}>
                <Pane>
                    <div
                        style={{
                            padding: '2rem',
                            backgroundColor: 'var(--theme-bg-secondary)',
                            height: '100%',
                        }}
                    >
                        <h3>Left Pane</h3>
                        <p>Drag the splitter to resize</p>
                    </div>
                </Pane>
                <Pane>
                    <div
                        style={{
                            padding: '2rem',
                            backgroundColor: 'var(--theme-bg-tertiary)',
                            height: '100%',
                        }}
                    >
                        <h3>Right Pane</h3>
                        <p>Content here...</p>
                    </div>
                </Pane>
            </SplitPane>
        </div>
    ),
}

// Vertical Split
export const VerticalSplit: Story = {
    render: () => (
        <div style={{ height: '500px', border: '1px solid #ccc' }}>
            <SplitPane direction="vertical" initialSizes={[40, 60]}>
                <Pane>
                    <div
                        style={{
                            padding: '2rem',
                            backgroundColor: 'var(--theme-bg-secondary)',
                            height: '100%',
                        }}
                    >
                        <h3>Top Pane</h3>
                        <p>Drag the splitter to resize</p>
                    </div>
                </Pane>
                <Pane>
                    <div
                        style={{
                            padding: '2rem',
                            backgroundColor: 'var(--theme-bg-tertiary)',
                            height: '100%',
                        }}
                    >
                        <h3>Bottom Pane</h3>
                        <p>Content here...</p>
                    </div>
                </Pane>
            </SplitPane>
        </div>
    ),
}

// Three Panes
export const ThreePanes: Story = {
    render: () => (
        <div style={{ height: '500px', border: '1px solid #ccc' }}>
            <SplitPane
                direction="horizontal"
                initialSizes={[33.33, 33.33, 33.34]}
            >
                <Pane>
                    <div
                        style={{
                            padding: '2rem',
                            backgroundColor: 'var(--theme-bg-secondary)',
                            height: '100%',
                        }}
                    >
                        <h3>Left</h3>
                    </div>
                </Pane>
                <Pane>
                    <div
                        style={{
                            padding: '2rem',
                            backgroundColor: 'var(--theme-bg-tertiary)',
                            height: '100%',
                        }}
                    >
                        <h3>Middle</h3>
                    </div>
                </Pane>
                <Pane>
                    <div
                        style={{
                            padding: '2rem',
                            backgroundColor: 'var(--theme-bg-secondary)',
                            height: '100%',
                        }}
                    >
                        <h3>Right</h3>
                    </div>
                </Pane>
            </SplitPane>
        </div>
    ),
}

// Collapsible Panes
export const CollapsiblePanes: Story = {
    render: () => (
        <div style={{ height: '500px', border: '1px solid #ccc' }}>
            <SplitPane
                direction="horizontal"
                initialSizes={[30, 70]}
                collapsible
            >
                <Pane>
                    <div
                        style={{
                            padding: '2rem',
                            backgroundColor: 'var(--theme-bg-secondary)',
                            height: '100%',
                        }}
                    >
                        <h3>Sidebar</h3>
                        <p>Click the arrow on the splitter to collapse me</p>
                    </div>
                </Pane>
                <Pane>
                    <div
                        style={{
                            padding: '2rem',
                            backgroundColor: 'var(--theme-bg-tertiary)',
                            height: '100%',
                        }}
                    >
                        <h3>Main Content</h3>
                        <p>This pane expands when sidebar collapses</p>
                    </div>
                </Pane>
            </SplitPane>
        </div>
    ),
}

// With Min/Max Sizes
export const WithConstraints: Story = {
    render: () => (
        <div style={{ height: '500px', border: '1px solid #ccc' }}>
            <SplitPane
                direction="horizontal"
                initialSizes={[50, 50]}
                minSizes={[200, 200]}
                maxSizes={[600, 800]}
            >
                <Pane>
                    <div
                        style={{
                            padding: '2rem',
                            backgroundColor: 'var(--theme-bg-secondary)',
                            height: '100%',
                        }}
                    >
                        <h3>Constrained Pane</h3>
                        <p>Min: 200px, Max: 600px</p>
                    </div>
                </Pane>
                <Pane>
                    <div
                        style={{
                            padding: '2rem',
                            backgroundColor: 'var(--theme-bg-tertiary)',
                            height: '100%',
                        }}
                    >
                        <h3>Constrained Pane</h3>
                        <p>Min: 200px, Max: 800px</p>
                    </div>
                </Pane>
            </SplitPane>
        </div>
    ),
}

// Nested Split Panes
export const NestedSplitPanes: Story = {
    render: () => (
        <div style={{ height: '600px', border: '1px solid #ccc' }}>
            <SplitPane direction="horizontal" initialSizes={[25, 75]}>
                <Pane>
                    <div
                        style={{
                            padding: '2rem',
                            backgroundColor: 'var(--theme-bg-secondary)',
                            height: '100%',
                        }}
                    >
                        <h3>Sidebar</h3>
                        <p>Navigation menu</p>
                    </div>
                </Pane>
                <Pane>
                    <SplitPane direction="vertical" initialSizes={[70, 30]}>
                        <Pane>
                            <div
                                style={{
                                    padding: '2rem',
                                    backgroundColor: 'var(--theme-bg-tertiary)',
                                    height: '100%',
                                }}
                            >
                                <h3>Main Content Area</h3>
                                <p>Your main application content goes here</p>
                            </div>
                        </Pane>
                        <Pane>
                            <div
                                style={{
                                    padding: '2rem',
                                    backgroundColor:
                                        'var(--theme-bg-secondary)',
                                    height: '100%',
                                    overflow: 'auto',
                                }}
                            >
                                <h3>Console / Output Panel</h3>
                                <p>Logs and debugging information</p>
                            </div>
                        </Pane>
                    </SplitPane>
                </Pane>
            </SplitPane>
        </div>
    ),
}

// IDE-like Layout
export const IDELayout: Story = {
    render: () => (
        <div style={{ height: '700px', border: '1px solid #ccc' }}>
            <SplitPane
                direction="horizontal"
                initialSizes={[20, 60, 20]}
                collapsible={[true, false, true]}
            >
                <Pane>
                    <div
                        style={{
                            padding: '1rem',
                            backgroundColor: 'var(--theme-bg-secondary)',
                            height: '100%',
                        }}
                    >
                        <h4>File Explorer</h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li>📁 src</li>
                            <li style={{ paddingLeft: '1rem' }}>📄 index.ts</li>
                            <li style={{ paddingLeft: '1rem' }}>📄 App.tsx</li>
                            <li>📁 components</li>
                            <li>📁 utils</li>
                        </ul>
                    </div>
                </Pane>
                <Pane>
                    <SplitPane direction="vertical" initialSizes={[75, 25]}>
                        <Pane>
                            <div
                                style={{
                                    padding: '1rem',
                                    backgroundColor: 'var(--theme-bg-tertiary)',
                                    height: '100%',
                                    fontFamily: 'monospace',
                                }}
                            >
                                <h4>Editor</h4>
                                <pre style={{ margin: 0 }}>
                                    {`import React from 'react'

export const App = () => {
  return (
    <div>
      <h1>Hello World</h1>
    </div>
  )
}`}
                                </pre>
                            </div>
                        </Pane>
                        <Pane>
                            <div
                                style={{
                                    padding: '1rem',
                                    backgroundColor:
                                        'var(--theme-bg-secondary)',
                                    height: '100%',
                                    fontFamily: 'monospace',
                                    fontSize: '0.875rem',
                                }}
                            >
                                <h4>Terminal</h4>
                                <div style={{ color: '#00ff00' }}>
                                    $ npm start
                                    <br />
                                    Starting development server...
                                    <br />
                                    Compiled successfully!
                                </div>
                            </div>
                        </Pane>
                    </SplitPane>
                </Pane>
                <Pane>
                    <div
                        style={{
                            padding: '1rem',
                            backgroundColor: 'var(--theme-bg-secondary)',
                            height: '100%',
                        }}
                    >
                        <h4>Properties</h4>
                        <div style={{ fontSize: '0.875rem' }}>
                            <p>
                                <strong>Type:</strong> Component
                            </p>
                            <p>
                                <strong>Props:</strong> 3
                            </p>
                            <p>
                                <strong>State:</strong> Local
                            </p>
                        </div>
                    </div>
                </Pane>
            </SplitPane>
        </div>
    ),
}

// With Size Change Callback
export const WithSizeCallback: Story = {
    render: () => {
        const [sizes, setSizes] = useState<number[]>([50, 50])

        return (
            <div>
                <div
                    style={{
                        padding: '1rem',
                        marginBottom: '1rem',
                        backgroundColor: 'var(--theme-bg-secondary)',
                    }}
                >
                    <h4>Current Sizes:</h4>
                    <p>
                        Left: {sizes[0]?.toFixed(1)}% | Right:{' '}
                        {sizes[1]?.toFixed(1)}%
                    </p>
                </div>
                <div style={{ height: '400px', border: '1px solid #ccc' }}>
                    <SplitPane
                        direction="horizontal"
                        initialSizes={[50, 50]}
                        onSizeChange={setSizes}
                    >
                        <Pane>
                            <div
                                style={{
                                    padding: '2rem',
                                    backgroundColor: 'var(--theme-bg-tertiary)',
                                    height: '100%',
                                }}
                            >
                                <h3>Left Pane</h3>
                                <p>Resize to see the callback in action</p>
                            </div>
                        </Pane>
                        <Pane>
                            <div
                                style={{
                                    padding: '2rem',
                                    backgroundColor:
                                        'var(--theme-bg-secondary)',
                                    height: '100%',
                                }}
                            >
                                <h3>Right Pane</h3>
                            </div>
                        </Pane>
                    </SplitPane>
                </div>
            </div>
        )
    },
}

// Persistent Layout (with localStorage)
export const PersistentLayout: Story = {
    render: () => (
        <div>
            <div
                style={{
                    padding: '1rem',
                    marginBottom: '1rem',
                    backgroundColor: 'var(--theme-bg-secondary)',
                }}
            >
                <p>
                    Resize the panes and refresh the page - your layout will be
                    saved!
                </p>
            </div>
            <div style={{ height: '500px', border: '1px solid #ccc' }}>
                <SplitPane
                    direction="horizontal"
                    initialSizes={[30, 70]}
                    storageKey="my-app-layout"
                    collapsible
                >
                    <Pane>
                        <div
                            style={{
                                padding: '2rem',
                                backgroundColor: 'var(--theme-bg-secondary)',
                                height: '100%',
                            }}
                        >
                            <h3>Persistent Sidebar</h3>
                            <p>Your size preference is saved</p>
                        </div>
                    </Pane>
                    <Pane>
                        <div
                            style={{
                                padding: '2rem',
                                backgroundColor: 'var(--theme-bg-tertiary)',
                                height: '100%',
                            }}
                        >
                            <h3>Main Content</h3>
                        </div>
                    </Pane>
                </SplitPane>
            </div>
        </div>
    ),
}

// Custom Gutter
export const CustomGutter: Story = {
    render: () => (
        <div style={{ height: '500px', border: '1px solid #ccc' }}>
            <SplitPane
                direction="horizontal"
                initialSizes={[50, 50]}
                splitterSize={12}
                renderGutter={() => (
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background:
                                'linear-gradient(90deg, #667eea, #764ba2)',
                            color: 'white',
                            fontSize: '20px',
                        }}
                    >
                        ⋮
                    </div>
                )}
            >
                <Pane>
                    <div
                        style={{
                            padding: '2rem',
                            backgroundColor: 'var(--theme-bg-secondary)',
                            height: '100%',
                        }}
                    >
                        <h3>Left Pane</h3>
                        <p>Custom gradient splitter</p>
                    </div>
                </Pane>
                <Pane>
                    <div
                        style={{
                            padding: '2rem',
                            backgroundColor: 'var(--theme-bg-tertiary)',
                            height: '100%',
                        }}
                    >
                        <h3>Right Pane</h3>
                    </div>
                </Pane>
            </SplitPane>
        </div>
    ),
}
