import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import Accordion, { AccordionProps } from './Accordion'
import { ThemeProvider, ThemeSwitcher } from '../Theme'

const meta: Meta<typeof Accordion> = {
    title: 'Components/Accordion',
    component: Accordion,
    parameters: {
        docs: {
            description: {
                component:
                    'A flexible accordion component with support for single/multiple expansion modes, controlled/uncontrolled states, variants, sizes, animations, and custom icons. Fully accessible with ARIA attributes and keyboard navigation.',
            },
        },
    },
    argTypes: {
        mode: {
            control: { type: 'inline-radio' },
            options: ['single', 'multiple'],
            description:
                'Expansion mode: single allows only one item expanded at a time',
        },
        variant: {
            control: { type: 'inline-radio' },
            options: ['default', 'bordered', 'filled'],
            description: 'Visual style variant',
        },
        size: {
            control: { type: 'inline-radio' },
            options: ['sm', 'md', 'lg'],
            description: 'Size variant affecting padding and font sizes',
        },
        allowToggle: {
            control: 'boolean',
            description: 'Allow collapsing the active item in single mode',
        },
        disabled: {
            control: 'boolean',
            description: 'Disable all accordion items',
        },
    },
    render: (args) => (
        <ThemeProvider>
            <Accordion {...args} />
            <ThemeSwitcher />
        </ThemeProvider>
    ),
}
export default meta

type Story = StoryObj<AccordionProps>

const sampleItems = [
    {
        id: '1',
        title: 'What is React?',
        content:
            'React is a JavaScript library for building user interfaces. It lets you compose complex UIs from small, isolated pieces of code called components.',
    },
    {
        id: '2',
        title: 'What are React Hooks?',
        content:
            'Hooks are functions that let you use state and other React features in functional components. Common hooks include useState, useEffect, useContext, and more.',
    },
    {
        id: '3',
        title: 'What is JSX?',
        content:
            'JSX is a syntax extension for JavaScript that looks similar to HTML. It allows you to write markup inside your JavaScript code, making it easier to create React elements.',
    },
]

// Basic Stories
export const Default: Story = {
    args: {
        items: sampleItems,
    },
}

export const DefaultExpanded: Story = {
    args: {
        items: sampleItems,
        defaultExpandedItems: ['1'],
    },
}

export const MultipleExpanded: Story = {
    args: {
        items: sampleItems,
        defaultExpandedItems: ['1', '2'],
    },
}

// Mode Variants
export const SingleMode: Story = {
    args: {
        items: sampleItems,
        mode: 'single',
        defaultExpandedItems: ['1'],
    },
}

export const SingleModeWithToggle: Story = {
    args: {
        items: sampleItems,
        mode: 'single',
        allowToggle: true,
        defaultExpandedItems: ['1'],
    },
}

export const MultipleMode: Story = {
    args: {
        items: sampleItems,
        mode: 'multiple',
        defaultExpandedItems: ['1', '3'],
    },
}

// Visual Variants
export const BorderedVariant: Story = {
    args: {
        items: sampleItems,
        variant: 'bordered',
        defaultExpandedItems: ['1'],
    },
}

export const FilledVariant: Story = {
    args: {
        items: sampleItems,
        variant: 'filled',
        defaultExpandedItems: ['1'],
    },
}

// Size Variants
export const SmallSize: Story = {
    args: {
        items: sampleItems,
        size: 'sm',
        defaultExpandedItems: ['1'],
    },
}

export const MediumSize: Story = {
    args: {
        items: sampleItems,
        size: 'md',
        defaultExpandedItems: ['1'],
    },
}

export const LargeSize: Story = {
    args: {
        items: sampleItems,
        size: 'lg',
        defaultExpandedItems: ['1'],
    },
}

// State Variants
export const Disabled: Story = {
    args: {
        items: sampleItems,
        disabled: true,
        defaultExpandedItems: ['1'],
    },
}

export const IndividualDisabled: Story = {
    args: {
        items: [
            {
                id: '1',
                title: 'Enabled Item 1',
                content: 'This item is enabled.',
            },
            {
                id: '2',
                title: 'Disabled Item',
                content: 'This item is disabled.',
                disabled: true,
            },
            {
                id: '3',
                title: 'Enabled Item 2',
                content: 'This item is also enabled.',
            },
        ],
        defaultExpandedItems: ['1'],
    },
}

// Custom Icons
export const CustomIcons: Story = {
    args: {
        items: sampleItems,
        expandIcon: <span>➕</span>,
        collapseIcon: <span>➖</span>,
        defaultExpandedItems: ['1'],
    },
}

// Rich Content
export const WithRichContent: Story = {
    args: {
        items: [
            {
                id: '1',
                title: 'Section with HTML',
                content: (
                    <div>
                        <p>
                            <strong>Bold content</strong> and{' '}
                            <em>italic content</em>.
                        </p>
                        <ul>
                            <li>List item 1</li>
                            <li>List item 2</li>
                            <li>List item 3</li>
                        </ul>
                    </div>
                ),
            },
            {
                id: '2',
                title: 'Section with Code',
                content: (
                    <div>
                        <p>Here's a code snippet:</p>
                        <pre
                            style={{
                                background: '#f4f4f4',
                                padding: '12px',
                                borderRadius: '4px',
                            }}
                        >
                            <code>{`const greeting = "Hello, World!";
console.log(greeting);`}</code>
                        </pre>
                    </div>
                ),
            },
            {
                id: '3',
                title: 'Section with Links',
                content: (
                    <div>
                        <p>Check out these resources:</p>
                        <ul>
                            <li>
                                <a
                                    href="https://react.dev"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    React Documentation
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://storybook.js.org"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Storybook
                                </a>
                            </li>
                        </ul>
                    </div>
                ),
            },
        ],
        defaultExpandedItems: ['1'],
    },
}

// Controlled Component
export const Controlled: Story = {
    render: (args) => {
        const [expandedItems, setExpandedItems] = useState<string[]>(['1'])

        return (
            <ThemeProvider>
                <div>
                    <div style={{ marginBottom: '16px' }}>
                        <button
                            onClick={() => setExpandedItems(['1'])}
                            style={{ marginRight: '8px', padding: '8px 16px' }}
                        >
                            Expand First
                        </button>
                        <button
                            onClick={() => setExpandedItems(['2'])}
                            style={{ marginRight: '8px', padding: '8px 16px' }}
                        >
                            Expand Second
                        </button>
                        <button
                            onClick={() => setExpandedItems(['1', '2', '3'])}
                            style={{ marginRight: '8px', padding: '8px 16px' }}
                        >
                            Expand All
                        </button>
                        <button
                            onClick={() => setExpandedItems([])}
                            style={{ padding: '8px 16px' }}
                        >
                            Collapse All
                        </button>
                    </div>
                    <Accordion
                        {...args}
                        items={sampleItems}
                        expandedItems={expandedItems}
                        onChange={setExpandedItems}
                    />
                    <ThemeSwitcher />
                </div>
            </ThemeProvider>
        )
    },
}

// Callbacks
export const WithCallbacks: Story = {
    args: {
        items: sampleItems,
        onExpand: (id) => console.log('Expanded:', id),
        onCollapse: (id) => console.log('Collapsed:', id),
        onChange: (items) => console.log('Changed to:', items),
    },
}

// Edge Cases
export const SingleItem: Story = {
    args: {
        items: [
            {
                id: '1',
                title: 'Only Item',
                content: 'This is the only accordion item.',
            },
        ],
    },
}

export const EmptyContent: Story = {
    args: {
        items: [
            { id: '1', title: 'Item with Empty Content', content: '' },
            { id: '2', title: 'Item with Null Content', content: null as any },
            {
                id: '3',
                title: 'Item with Normal Content',
                content: 'Normal content here.',
            },
        ],
    },
}

export const LongContent: Story = {
    args: {
        items: [
            {
                id: '1',
                title: 'Item with Long Content',
                content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
            },
            {
                id: '2',
                title: 'Another Long Content Item',
                content: `Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.`,
            },
        ],
        defaultExpandedItems: ['1'],
    },
}

// Complex Example
export const ComplexExample: Story = {
    args: {
        items: [
            {
                id: '1',
                title: 'Account Settings',
                content: (
                    <div style={{ padding: '8px 0' }}>
                        <div style={{ marginBottom: '12px' }}>
                            <label
                                style={{
                                    display: 'block',
                                    marginBottom: '4px',
                                }}
                            >
                                Username
                            </label>
                            <input
                                type="text"
                                defaultValue="user@example.com"
                                style={{ width: '100%', padding: '8px' }}
                            />
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                            <label
                                style={{
                                    display: 'block',
                                    marginBottom: '4px',
                                }}
                            >
                                Display Name
                            </label>
                            <input
                                type="text"
                                defaultValue="John Doe"
                                style={{ width: '100%', padding: '8px' }}
                            />
                        </div>
                        <button style={{ padding: '8px 16px' }}>
                            Save Changes
                        </button>
                    </div>
                ),
            },
            {
                id: '2',
                title: 'Privacy Settings',
                content: (
                    <div style={{ padding: '8px 0' }}>
                        <div style={{ marginBottom: '12px' }}>
                            <label
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                }}
                            >
                                <input
                                    type="checkbox"
                                    defaultChecked
                                    style={{ marginRight: '8px' }}
                                />
                                Make profile public
                            </label>
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                            <label
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                }}
                            >
                                <input
                                    type="checkbox"
                                    style={{ marginRight: '8px' }}
                                />
                                Allow comments
                            </label>
                        </div>
                        <div>
                            <label
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                }}
                            >
                                <input
                                    type="checkbox"
                                    defaultChecked
                                    style={{ marginRight: '8px' }}
                                />
                                Email notifications
                            </label>
                        </div>
                    </div>
                ),
            },
            {
                id: '3',
                title: 'Danger Zone',
                content: (
                    <div style={{ padding: '8px 0' }}>
                        <p style={{ marginBottom: '12px', color: '#d32f2f' }}>
                            <strong>Warning:</strong> These actions cannot be
                            undone.
                        </p>
                        <button
                            style={{
                                padding: '8px 16px',
                                background: '#d32f2f',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }}
                        >
                            Delete Account
                        </button>
                    </div>
                ),
            },
        ],
        variant: 'bordered',
        size: 'md',
        mode: 'single',
        defaultExpandedItems: ['1'],
    },
}
