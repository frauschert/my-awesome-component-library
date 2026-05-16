import React, { useRef } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import ScrollArea from './ScrollArea'
import type { ScrollAreaRef } from './ScrollArea'
import Button from '../Button'
import Card from '../Card'

const meta: Meta<typeof ScrollArea> = {
    title: 'Components/ScrollArea',
    component: ScrollArea,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component:
                    'ScrollArea provides a container with custom styled scrollbars that work consistently across browsers.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
        },
        type: {
            control: 'select',
            options: ['auto', 'always', 'hover', 'scroll'],
        },
    },
}

export default meta
type Story = StoryObj<typeof ScrollArea>

const SampleContent = ({ count = 20 }: { count?: number }) => (
    <>
        {Array.from({ length: count }, (_, i) => (
            <div
                key={i}
                style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--theme-border)',
                }}
            >
                <strong>Item {i + 1}</strong>
                <p
                    style={{
                        margin: '4px 0 0',
                        color: 'var(--theme-text-secondary)',
                    }}
                >
                    This is a sample item with some descriptive text to
                    demonstrate scrolling behavior.
                </p>
            </div>
        ))}
    </>
)

/**
 * Default scroll area with vertical scrolling.
 */
export const Default: Story = {
    args: {
        height: 300,
        children: <SampleContent />,
    },
}

/**
 * Different scrollbar sizes for various use cases.
 */
export const Sizes: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '24px' }}>
            <div>
                <h4 style={{ marginBottom: '8px' }}>Small</h4>
                <ScrollArea
                    height={200}
                    size="sm"
                    style={{ border: '1px solid var(--theme-border)' }}
                >
                    <SampleContent count={15} />
                </ScrollArea>
            </div>
            <div>
                <h4 style={{ marginBottom: '8px' }}>Medium (default)</h4>
                <ScrollArea
                    height={200}
                    size="md"
                    style={{ border: '1px solid var(--theme-border)' }}
                >
                    <SampleContent count={15} />
                </ScrollArea>
            </div>
            <div>
                <h4 style={{ marginBottom: '8px' }}>Large</h4>
                <ScrollArea
                    height={200}
                    size="lg"
                    style={{ border: '1px solid var(--theme-border)' }}
                >
                    <SampleContent count={15} />
                </ScrollArea>
            </div>
        </div>
    ),
}

/**
 * Control when scrollbars are visible.
 */
export const ScrollbarTypes: Story = {
    render: () => (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '24px',
            }}
        >
            <div>
                <h4 style={{ marginBottom: '8px' }}>Auto (default)</h4>
                <p
                    style={{
                        fontSize: '12px',
                        color: 'var(--theme-text-secondary)',
                        marginBottom: '8px',
                    }}
                >
                    Shows when content overflows
                </p>
                <ScrollArea
                    height={150}
                    type="auto"
                    style={{ border: '1px solid var(--theme-border)' }}
                >
                    <SampleContent count={10} />
                </ScrollArea>
            </div>
            <div>
                <h4 style={{ marginBottom: '8px' }}>Always</h4>
                <p
                    style={{
                        fontSize: '12px',
                        color: 'var(--theme-text-secondary)',
                        marginBottom: '8px',
                    }}
                >
                    Always visible
                </p>
                <ScrollArea
                    height={150}
                    type="always"
                    style={{ border: '1px solid var(--theme-border)' }}
                >
                    <SampleContent count={10} />
                </ScrollArea>
            </div>
            <div>
                <h4 style={{ marginBottom: '8px' }}>Hover</h4>
                <p
                    style={{
                        fontSize: '12px',
                        color: 'var(--theme-text-secondary)',
                        marginBottom: '8px',
                    }}
                >
                    Shows on hover or while scrolling
                </p>
                <ScrollArea
                    height={150}
                    type="hover"
                    style={{ border: '1px solid var(--theme-border)' }}
                >
                    <SampleContent count={10} />
                </ScrollArea>
            </div>
            <div>
                <h4 style={{ marginBottom: '8px' }}>Hidden</h4>
                <p
                    style={{
                        fontSize: '12px',
                        color: 'var(--theme-text-secondary)',
                        marginBottom: '8px',
                    }}
                >
                    Scrollable but no visible scrollbar
                </p>
                <ScrollArea
                    height={150}
                    hideScrollbar
                    style={{ border: '1px solid var(--theme-border)' }}
                >
                    <SampleContent count={10} />
                </ScrollArea>
            </div>
        </div>
    ),
}

/**
 * Shadow indicators show scroll position.
 */
export const WithShadows: Story = {
    render: () => (
        <ScrollArea
            height={300}
            shadowOnScroll
            style={{
                border: '1px solid var(--theme-border)',
                borderRadius: '8px',
            }}
        >
            <SampleContent count={25} />
        </ScrollArea>
    ),
}

/**
 * Horizontal scrolling for wide content.
 */
export const Horizontal: Story = {
    render: () => (
        <ScrollArea
            height={200}
            horizontal
            vertical={false}
            shadowOnScroll
            style={{ border: '1px solid var(--theme-border)' }}
        >
            <div
                style={{
                    display: 'flex',
                    gap: '16px',
                    padding: '16px',
                    width: 'max-content',
                }}
            >
                {Array.from({ length: 15 }, (_, i) => (
                    <Card key={i} style={{ minWidth: '200px', flexShrink: 0 }}>
                        <Card.Header>Card {i + 1}</Card.Header>
                        <Card.Body>
                            <p>Horizontal scrolling content</p>
                        </Card.Body>
                    </Card>
                ))}
            </div>
        </ScrollArea>
    ),
}

/**
 * Both horizontal and vertical scrolling.
 */
export const BothDirections: Story = {
    render: () => (
        <ScrollArea
            height={300}
            width={400}
            horizontal
            vertical
            shadowOnScroll
            style={{ border: '1px solid var(--theme-border)' }}
        >
            <div style={{ width: '800px', padding: '16px' }}>
                <h3>Wide and Tall Content</h3>
                <p>
                    This content is wider and taller than the container,
                    allowing scrolling in both directions.
                </p>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 180px)',
                        gap: '16px',
                        marginTop: '16px',
                    }}
                >
                    {Array.from({ length: 20 }, (_, i) => (
                        <div
                            key={i}
                            style={{
                                padding: '16px',
                                background: 'var(--theme-bg-secondary)',
                                borderRadius: '8px',
                            }}
                        >
                            Item {i + 1}
                        </div>
                    ))}
                </div>
            </div>
        </ScrollArea>
    ),
}

/**
 * Programmatic scroll control using ref.
 */
export const ProgrammaticControl: Story = {
    render: () => {
        const scrollRef = useRef<ScrollAreaRef>(null)

        return (
            <div>
                <div
                    style={{
                        display: 'flex',
                        gap: '8px',
                        marginBottom: '16px',
                    }}
                >
                    <Button
                        size="sm"
                        onClick={() => scrollRef.current?.scrollToTop('smooth')}
                    >
                        Scroll to Top
                    </Button>
                    <Button
                        size="sm"
                        onClick={() =>
                            scrollRef.current?.scrollToBottom('smooth')
                        }
                    >
                        Scroll to Bottom
                    </Button>
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                            scrollRef.current?.scrollBy({
                                top: 100,
                                behavior: 'smooth',
                            })
                        }
                    >
                        Scroll Down 100px
                    </Button>
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                            scrollRef.current?.scrollBy({
                                top: -100,
                                behavior: 'smooth',
                            })
                        }
                    >
                        Scroll Up 100px
                    </Button>
                </div>
                <ScrollArea
                    ref={scrollRef}
                    height={300}
                    shadowOnScroll
                    style={{ border: '1px solid var(--theme-border)' }}
                >
                    <SampleContent count={30} />
                </ScrollArea>
            </div>
        )
    },
}

/**
 * Callbacks for scroll position events.
 */
export const ScrollCallbacks: Story = {
    render: () => {
        const [status, setStatus] = React.useState('Scroll to see events')

        return (
            <div>
                <div
                    style={{
                        padding: '8px 16px',
                        marginBottom: '16px',
                        background: 'var(--theme-bg-secondary)',
                        borderRadius: '4px',
                    }}
                >
                    Status: <strong>{status}</strong>
                </div>
                <ScrollArea
                    height={250}
                    shadowOnScroll
                    onScrollToTop={() => setStatus('Reached top!')}
                    onScrollToBottom={() => setStatus('Reached bottom!')}
                    style={{ border: '1px solid var(--theme-border)' }}
                >
                    <SampleContent count={20} />
                </ScrollArea>
            </div>
        )
    },
}

/**
 * With max-height for dynamic content.
 */
export const MaxHeight: Story = {
    render: () => {
        const [itemCount, setItemCount] = React.useState(3)

        return (
            <div>
                <div
                    style={{
                        display: 'flex',
                        gap: '8px',
                        marginBottom: '16px',
                    }}
                >
                    <Button
                        size="sm"
                        onClick={() => setItemCount((c) => c + 3)}
                    >
                        Add Items
                    </Button>
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setItemCount((c) => Math.max(1, c - 3))}
                    >
                        Remove Items
                    </Button>
                    <span
                        style={{
                            alignSelf: 'center',
                            color: 'var(--theme-text-secondary)',
                        }}
                    >
                        {itemCount} items
                    </span>
                </div>
                <ScrollArea
                    maxHeight={300}
                    shadowOnScroll
                    style={{ border: '1px solid var(--theme-border)' }}
                >
                    <SampleContent count={itemCount} />
                </ScrollArea>
            </div>
        )
    },
}

/**
 * Code editor-like scrollable area.
 */
export const CodeEditor: Story = {
    render: () => (
        <ScrollArea
            height={400}
            horizontal
            vertical
            size="sm"
            style={{
                border: '1px solid var(--theme-border)',
                borderRadius: '8px',
                background: '#1e1e1e',
            }}
        >
            <pre
                style={{
                    margin: 0,
                    padding: '16px',
                    fontFamily: 'monospace',
                    fontSize: '13px',
                    lineHeight: 1.5,
                    color: '#d4d4d4',
                    whiteSpace: 'pre',
                }}
            >
                {`import React from 'react';
import { ScrollArea } from '@frauschert/my-awesome-component-library';

export function CodeViewer({ code }: { code: string }) {
    return (
        <ScrollArea
            height={400}
            horizontal
            vertical
            size="sm"
        >
            <pre>{code}</pre>
        </ScrollArea>
    );
}

// Example usage with very long lines that will cause horizontal scrolling to demonstrate the component
const veryLongVariableName = "This is a very long string that will definitely cause the content to overflow horizontally";

function anotherExample() {
    const items = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        name: \`Item \${i}\`,
        description: 'A sample description',
    }));

    return items.map(item => (
        <div key={item.id}>
            {item.name}: {item.description}
        </div>
    ));
}

export default CodeViewer;`}
            </pre>
        </ScrollArea>
    ),
}

/**
 * Chat-like interface with scroll area.
 */
export const ChatMessages: Story = {
    render: () => {
        const scrollRef = useRef<ScrollAreaRef>(null)
        const [messages, setMessages] = React.useState(
            Array.from({ length: 15 }, (_, i) => ({
                id: i,
                text: `Message ${
                    i + 1
                }: Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
                sender: i % 2 === 0 ? 'user' : 'other',
            }))
        )

        const addMessage = () => {
            setMessages((prev) => [
                ...prev,
                {
                    id: prev.length,
                    text: `New message ${prev.length + 1}`,
                    sender: prev.length % 2 === 0 ? 'user' : 'other',
                },
            ])
            // Scroll to bottom after adding
            setTimeout(() => scrollRef.current?.scrollToBottom('smooth'), 50)
        }

        return (
            <div style={{ width: '400px' }}>
                <ScrollArea
                    ref={scrollRef}
                    height={350}
                    style={{
                        border: '1px solid var(--theme-border)',
                        borderRadius: '8px 8px 0 0',
                    }}
                >
                    <div
                        style={{
                            padding: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                        }}
                    >
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                style={{
                                    alignSelf:
                                        msg.sender === 'user'
                                            ? 'flex-end'
                                            : 'flex-start',
                                    maxWidth: '80%',
                                    padding: '8px 12px',
                                    borderRadius: '12px',
                                    background:
                                        msg.sender === 'user'
                                            ? 'var(--theme-primary)'
                                            : 'var(--theme-bg-secondary)',
                                    color:
                                        msg.sender === 'user'
                                            ? 'var(--theme-text-on-primary)'
                                            : 'var(--theme-text)',
                                }}
                            >
                                {msg.text}
                            </div>
                        ))}
                    </div>
                </ScrollArea>
                <Button
                    onClick={addMessage}
                    style={{
                        width: '100%',
                        borderRadius: '0 0 8px 8px',
                    }}
                >
                    Send Message
                </Button>
            </div>
        )
    },
}
