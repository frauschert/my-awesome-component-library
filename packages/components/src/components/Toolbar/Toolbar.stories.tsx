import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import Toolbar, { ToolbarProps } from './Toolbar'
import { ThemeProvider, ThemeSwitcher } from '../Theme'
import Button from '../Button'

const meta: Meta<typeof Toolbar> = {
    title: 'Components/Toolbar',
    component: Toolbar,
    parameters: {
        docs: {
            description: {
                component:
                    'A flexible toolbar component for navigation, actions, and content organization. Supports multiple layouts, variants, and positioning options.',
            },
        },
    },
    argTypes: {
        variant: {
            control: { type: 'inline-radio' },
            options: ['default', 'elevated', 'filled'],
            description: 'Visual style variant',
        },
        size: {
            control: { type: 'inline-radio' },
            options: ['sm', 'md', 'lg'],
            description: 'Size variant',
        },
        position: {
            control: { type: 'inline-radio' },
            options: ['static', 'top', 'bottom'],
            description: 'Position of the toolbar',
        },
    },
    render: (args) => (
        <ThemeProvider>
            <Toolbar {...args} />
            <ThemeSwitcher />
        </ThemeProvider>
    ),
}

export default meta
type Story = StoryObj<ToolbarProps>

// Basic Examples
export const Default: Story = {
    args: {
        children: (
            <>
                <button>Save</button>
                <button>Edit</button>
                <button>Delete</button>
            </>
        ),
    },
}

export const WithSections: Story = {
    args: {
        leftContent: (
            <>
                <button className="toolbar-icon-button">☰</button>
                <span className="toolbar-title">My Application</span>
            </>
        ),
        rightContent: (
            <>
                <button className="toolbar-icon-button">🔔</button>
                <button className="toolbar-icon-button">👤</button>
            </>
        ),
    },
}

export const ThreeSections: Story = {
    args: {
        leftContent: (
            <>
                <button>Back</button>
                <div className="toolbar-divider" />
                <button>Forward</button>
            </>
        ),
        centerContent: <span className="toolbar-title">Document Title</span>,
        rightContent: (
            <>
                <button>Share</button>
                <button>Settings</button>
            </>
        ),
    },
}

// Size Variants
export const SmallSize: Story = {
    args: {
        size: 'sm',
        leftContent: <span className="toolbar-title">Small Toolbar</span>,
        rightContent: (
            <>
                <button>Action 1</button>
                <button>Action 2</button>
            </>
        ),
    },
}

export const MediumSize: Story = {
    args: {
        size: 'md',
        leftContent: <span className="toolbar-title">Medium Toolbar</span>,
        rightContent: (
            <>
                <button>Action 1</button>
                <button>Action 2</button>
            </>
        ),
    },
}

export const LargeSize: Story = {
    args: {
        size: 'lg',
        leftContent: <span className="toolbar-title">Large Toolbar</span>,
        rightContent: (
            <>
                <button>Action 1</button>
                <button>Action 2</button>
            </>
        ),
    },
}

// Visual Variants
export const ElevatedVariant: Story = {
    args: {
        variant: 'elevated',
        leftContent: (
            <>
                <button className="toolbar-icon-button">☰</button>
                <span className="toolbar-title">Elevated Toolbar</span>
            </>
        ),
        rightContent: (
            <>
                <button>Save</button>
                <button>Cancel</button>
            </>
        ),
    },
}

export const FilledVariant: Story = {
    args: {
        variant: 'filled',
        leftContent: (
            <>
                <button className="toolbar-icon-button">☰</button>
                <span className="toolbar-title">Filled Toolbar</span>
            </>
        ),
        rightContent: (
            <>
                <button>Save</button>
                <button>Cancel</button>
            </>
        ),
    },
}

// Position Variants
export const TopPosition: Story = {
    args: {
        position: 'top',
        variant: 'elevated',
        leftContent: <span className="toolbar-title">Fixed Top Toolbar</span>,
        rightContent: <button>Action</button>,
    },
    render: (args) => (
        <ThemeProvider>
            <Toolbar {...args} />
            <div style={{ marginTop: '80px', padding: '20px' }}>
                <p>
                    Content below the toolbar. Scroll to see the fixed
                    positioning.
                </p>
                {Array.from({ length: 20 }, (_, i) => (
                    <p key={i}>Paragraph {i + 1}</p>
                ))}
            </div>
            <ThemeSwitcher />
        </ThemeProvider>
    ),
}

export const BottomPosition: Story = {
    args: {
        position: 'bottom',
        variant: 'elevated',
        centerContent: (
            <>
                <button className="toolbar-icon-button">🏠</button>
                <button className="toolbar-icon-button">🔍</button>
                <button className="toolbar-icon-button">⭐</button>
                <button className="toolbar-icon-button">⚙️</button>
            </>
        ),
    },
    render: (args) => (
        <ThemeProvider>
            <div style={{ padding: '20px', paddingBottom: '100px' }}>
                <p>Content above the toolbar.</p>
                {Array.from({ length: 10 }, (_, i) => (
                    <p key={i}>Paragraph {i + 1}</p>
                ))}
            </div>
            <Toolbar {...args} />
            <ThemeSwitcher />
        </ThemeProvider>
    ),
}

// Real-world Examples
export const EditorToolbar: Story = {
    args: {
        variant: 'default',
        size: 'md',
        leftContent: (
            <>
                <button>📁</button>
                <button>💾</button>
                <div className="toolbar-divider" />
                <button>↶</button>
                <button>↷</button>
                <div className="toolbar-divider" />
                <button>
                    <strong>B</strong>
                </button>
                <button>
                    <em>I</em>
                </button>
                <button>
                    <u>U</u>
                </button>
            </>
        ),
        rightContent: (
            <>
                <button>Preview</button>
                <button>Publish</button>
            </>
        ),
    },
}

export const AppHeader: Story = {
    args: {
        variant: 'elevated',
        leftContent: (
            <>
                <button className="toolbar-icon-button">☰</button>
                <span className="toolbar-title">My App</span>
            </>
        ),
        centerContent: (
            <>
                <button>Dashboard</button>
                <button>Projects</button>
                <button>Team</button>
                <button>Reports</button>
            </>
        ),
        rightContent: (
            <>
                <button>🔔</button>
                <button>⚙️</button>
                <button>👤</button>
            </>
        ),
    },
}

export const MobileBottomNav: Story = {
    args: {
        position: 'bottom',
        variant: 'elevated',
        size: 'lg',
        children: (
            <div
                style={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'space-around',
                }}
            >
                <button
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                    }}
                >
                    <span>🏠</span>
                    <span style={{ fontSize: '0.75rem' }}>Home</span>
                </button>
                <button
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                    }}
                >
                    <span>🔍</span>
                    <span style={{ fontSize: '0.75rem' }}>Search</span>
                </button>
                <button
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                    }}
                >
                    <span>⭐</span>
                    <span style={{ fontSize: '0.75rem' }}>Favorites</span>
                </button>
                <button
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                    }}
                >
                    <span>👤</span>
                    <span style={{ fontSize: '0.75rem' }}>Profile</span>
                </button>
            </div>
        ),
    },
}

export const WithCustomButtons: Story = {
    args: {
        variant: 'default',
        leftContent: (
            <>
                <Button variant="secondary">Cancel</Button>
                <Button variant="secondary">Save Draft</Button>
            </>
        ),
        rightContent: (
            <>
                <Button variant="secondary">Preview</Button>
                <Button variant="primary">Publish</Button>
            </>
        ),
    },
}
