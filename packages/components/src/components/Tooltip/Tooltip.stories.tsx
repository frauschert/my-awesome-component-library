import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import Tooltip, { TooltipProps } from './Tooltip'
import { ThemeProvider, ThemeSwitcher } from '../Theme'
import Button from '../Button'

const meta: Meta<typeof Tooltip> = {
    title: 'Components/Tooltip',
    component: Tooltip,
    parameters: {
        docs: {
            description: {
                component:
                    'A flexible tooltip component that displays contextual information on hover, click, or focus. Supports multiple placements, triggers, and full accessibility.',
            },
        },
    },
    argTypes: {
        placement: {
            control: { type: 'select' },
            options: [
                'top',
                'top-start',
                'top-end',
                'bottom',
                'bottom-start',
                'bottom-end',
                'left',
                'left-start',
                'left-end',
                'right',
                'right-start',
                'right-end',
            ],
            description: 'Position of tooltip relative to trigger',
        },
        trigger: {
            control: { type: 'select' },
            options: ['hover', 'click', 'focus', 'manual'],
            description: 'How tooltip is triggered',
        },
        showDelay: {
            control: { type: 'number' },
            description: 'Delay before showing (ms)',
        },
        hideDelay: {
            control: { type: 'number' },
            description: 'Delay before hiding (ms)',
        },
        showArrow: {
            control: { type: 'boolean' },
            description: 'Show arrow pointing to trigger',
        },
        disabled: {
            control: { type: 'boolean' },
            description: 'Disable tooltip',
        },
    },
    render: (args) => (
        <ThemeProvider>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '200px',
                }}
            >
                <Tooltip {...args} />
            </div>
            <ThemeSwitcher />
        </ThemeProvider>
    ),
}

export default meta
type Story = StoryObj<TooltipProps>

// Basic Examples
export const Default: Story = {
    args: {
        content: 'This is a tooltip',
        children: <button>Hover me</button>,
    },
}

export const WithLongContent: Story = {
    args: {
        content:
            'This is a longer tooltip with more information that might wrap to multiple lines. It demonstrates how tooltips handle longer content.',
        children: <button>Hover for info</button>,
    },
}

export const WithButton: Story = {
    args: {
        content: 'Click to save changes',
        children: <Button variant="primary">Save</Button>,
    },
}

// Placement Variants
export const TopPlacement: Story = {
    args: {
        content: 'Tooltip on top',
        placement: 'top',
        children: <button>Top</button>,
    },
}

export const BottomPlacement: Story = {
    args: {
        content: 'Tooltip on bottom',
        placement: 'bottom',
        children: <button>Bottom</button>,
    },
}

export const LeftPlacement: Story = {
    args: {
        content: 'Tooltip on left',
        placement: 'left',
        children: <button>Left</button>,
    },
}

export const RightPlacement: Story = {
    args: {
        content: 'Tooltip on right',
        placement: 'right',
        children: <button>Right</button>,
    },
}

export const AllPlacements: Story = {
    render: () => (
        <ThemeProvider>
            <div style={{ padding: '100px', textAlign: 'center' }}>
                <div style={{ marginBottom: '50px' }}>
                    <Tooltip content="Top Start" placement="top-start">
                        <button style={{ margin: '10px' }}>Top Start</button>
                    </Tooltip>
                    <Tooltip content="Top" placement="top">
                        <button style={{ margin: '10px' }}>Top</button>
                    </Tooltip>
                    <Tooltip content="Top End" placement="top-end">
                        <button style={{ margin: '10px' }}>Top End</button>
                    </Tooltip>
                </div>

                <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                    <div>
                        <Tooltip content="Left Start" placement="left-start">
                            <button style={{ margin: '10px' }}>
                                Left Start
                            </button>
                        </Tooltip>
                        <br />
                        <Tooltip content="Left" placement="left">
                            <button style={{ margin: '10px' }}>Left</button>
                        </Tooltip>
                        <br />
                        <Tooltip content="Left End" placement="left-end">
                            <button style={{ margin: '10px' }}>Left End</button>
                        </Tooltip>
                    </div>

                    <div>
                        <Tooltip content="Right Start" placement="right-start">
                            <button style={{ margin: '10px' }}>
                                Right Start
                            </button>
                        </Tooltip>
                        <br />
                        <Tooltip content="Right" placement="right">
                            <button style={{ margin: '10px' }}>Right</button>
                        </Tooltip>
                        <br />
                        <Tooltip content="Right End" placement="right-end">
                            <button style={{ margin: '10px' }}>
                                Right End
                            </button>
                        </Tooltip>
                    </div>
                </div>

                <div style={{ marginTop: '50px' }}>
                    <Tooltip content="Bottom Start" placement="bottom-start">
                        <button style={{ margin: '10px' }}>Bottom Start</button>
                    </Tooltip>
                    <Tooltip content="Bottom" placement="bottom">
                        <button style={{ margin: '10px' }}>Bottom</button>
                    </Tooltip>
                    <Tooltip content="Bottom End" placement="bottom-end">
                        <button style={{ margin: '10px' }}>Bottom End</button>
                    </Tooltip>
                </div>
            </div>
            <ThemeSwitcher />
        </ThemeProvider>
    ),
}

// Trigger Variants
export const ClickTrigger: Story = {
    args: {
        content: 'Click to toggle',
        trigger: 'click',
        children: <button>Click me</button>,
    },
}

export const FocusTrigger: Story = {
    args: {
        content: 'Focused!',
        trigger: 'focus',
        children: <input type="text" placeholder="Focus me" />,
    },
}

export const MultipleTriggers: Story = {
    args: {
        content: 'Hover or click',
        trigger: ['hover', 'click'],
        children: <button>Hover or Click</button>,
    },
}

// Controlled Example
export const Controlled: Story = {
    render: () => {
        const [visible, setVisible] = useState(false)

        return (
            <ThemeProvider>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '20px',
                        padding: '50px',
                    }}
                >
                    <div>
                        <button onClick={() => setVisible(!visible)}>
                            Toggle Tooltip: {visible ? 'Visible' : 'Hidden'}
                        </button>
                    </div>

                    <Tooltip
                        content="Controlled tooltip"
                        visible={visible}
                        onVisibleChange={setVisible}
                        trigger="manual"
                    >
                        <button>Target Element</button>
                    </Tooltip>
                </div>
                <ThemeSwitcher />
            </ThemeProvider>
        )
    },
}

// Customization
export const WithoutArrow: Story = {
    args: {
        content: 'Tooltip without arrow',
        showArrow: false,
        children: <button>No Arrow</button>,
    },
}

export const CustomMaxWidth: Story = {
    args: {
        content:
            'This tooltip has a custom max width of 400px, so it can display more content before wrapping.',
        maxWidth: 400,
        children: <button>Wide Tooltip</button>,
    },
}

export const WithDelay: Story = {
    args: {
        content: 'Takes 1 second to show',
        showDelay: 1000,
        hideDelay: 300,
        children: <button>Delayed Tooltip</button>,
    },
}

export const Disabled: Story = {
    args: {
        content: "You won't see me",
        disabled: true,
        children: <button>Disabled Tooltip</button>,
    },
}

// Real-world Examples
export const IconButtons: Story = {
    render: () => (
        <ThemeProvider>
            <div
                style={{
                    display: 'flex',
                    gap: '10px',
                    justifyContent: 'center',
                    padding: '50px',
                }}
            >
                <Tooltip content="Save">
                    <button
                        style={{
                            width: '40px',
                            height: '40px',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        💾
                    </button>
                </Tooltip>

                <Tooltip content="Edit">
                    <button
                        style={{
                            width: '40px',
                            height: '40px',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        ✏️
                    </button>
                </Tooltip>

                <Tooltip content="Delete">
                    <button
                        style={{
                            width: '40px',
                            height: '40px',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        🗑️
                    </button>
                </Tooltip>

                <Tooltip content="Settings">
                    <button
                        style={{
                            width: '40px',
                            height: '40px',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        ⚙️
                    </button>
                </Tooltip>
            </div>
            <ThemeSwitcher />
        </ThemeProvider>
    ),
}

export const FormHelp: Story = {
    render: () => (
        <ThemeProvider>
            <div style={{ maxWidth: '400px', margin: '50px auto' }}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>
                        Username{' '}
                        <Tooltip content="Must be 3-20 characters, alphanumeric only">
                            <span
                                style={{
                                    cursor: 'help',
                                    color: '#666',
                                    fontSize: '0.875rem',
                                }}
                            >
                                ⓘ
                            </span>
                        </Tooltip>
                    </label>
                    <input
                        type="text"
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>
                        Email{' '}
                        <Tooltip content="We'll never share your email">
                            <span
                                style={{
                                    cursor: 'help',
                                    color: '#666',
                                    fontSize: '0.875rem',
                                }}
                            >
                                ⓘ
                            </span>
                        </Tooltip>
                    </label>
                    <input
                        type="email"
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>
                        Password{' '}
                        <Tooltip content="At least 8 characters with uppercase, lowercase, number, and special character">
                            <span
                                style={{
                                    cursor: 'help',
                                    color: '#666',
                                    fontSize: '0.875rem',
                                }}
                            >
                                ⓘ
                            </span>
                        </Tooltip>
                    </label>
                    <input
                        type="password"
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
            </div>
            <ThemeSwitcher />
        </ThemeProvider>
    ),
}

export const RichContent: Story = {
    args: {
        content: (
            <div>
                <strong>Feature Name</strong>
                <p style={{ margin: '5px 0' }}>This is a premium feature</p>
                <small style={{ color: '#ccc' }}>Available in Pro plan</small>
            </div>
        ),
        maxWidth: 200,
        children: <button>Hover for details</button>,
    },
}
