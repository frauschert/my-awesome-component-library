import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import RichTextEditor from './RichTextEditor'
import type { ToolbarItem } from './RichTextEditor'

const meta: Meta<typeof RichTextEditor> = {
    title: 'Components/RichTextEditor',
    component: RichTextEditor,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof RichTextEditor>

export const Default: Story = {
    args: {
        placeholder: 'Start typing your content...',
    },
}

export const WithDefaultContent: Story = {
    args: {
        defaultValue: `
            <h1>Welcome to Rich Text Editor</h1>
            <p>This editor supports <strong>bold</strong>, <em>italic</em>, and <u>underline</u> text.</p>
            <h2>Features</h2>
            <ul>
                <li>Multiple heading levels</li>
                <li>Lists (ordered and unordered)</li>
                <li>Links and images</li>
                <li>Code blocks</li>
            </ul>
            <blockquote>Blockquotes are also supported for highlighting important information.</blockquote>
        `,
    },
}

export const Controlled: Story = {
    render: () => {
        const ControlledEditor = () => {
            const [value, setValue] = useState(
                '<p>This is a controlled editor.</p>'
            )

            return (
                <div>
                    <RichTextEditor value={value} onChange={setValue} />
                    <div
                        style={{
                            marginTop: '1rem',
                            padding: '1rem',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '0.375rem',
                        }}
                    >
                        <strong>Current HTML:</strong>
                        <pre
                            style={{
                                marginTop: '0.5rem',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                            }}
                        >
                            {value}
                        </pre>
                    </div>
                </div>
            )
        }

        return <ControlledEditor />
    },
}

export const CustomToolbar: Story = {
    args: {
        toolbarItems: [
            'bold',
            'italic',
            'underline',
            'link',
            'clear',
        ] as ToolbarItem[],
        placeholder: 'Editor with custom toolbar items...',
    },
}

export const MinimalToolbar: Story = {
    args: {
        toolbarItems: ['bold', 'italic', 'link'] as ToolbarItem[],
        placeholder: 'Minimal editor with basic formatting...',
    },
}

export const WithoutToolbar: Story = {
    args: {
        showToolbar: false,
        placeholder: 'Plain editor without toolbar...',
    },
}

export const CustomHeight: Story = {
    args: {
        minHeight: '400px',
        maxHeight: '600px',
        placeholder: 'Editor with custom height constraints...',
    },
}

export const SmallEditor: Story = {
    args: {
        minHeight: '150px',
        placeholder: 'Compact editor...',
    },
}

export const Disabled: Story = {
    args: {
        disabled: true,
        defaultValue: '<p>This editor is disabled and cannot be edited.</p>',
    },
}

export const ReadOnly: Story = {
    args: {
        readOnly: true,
        defaultValue: `
            <h1>Read-Only Content</h1>
            <p>This content can be viewed but not edited.</p>
            <p>Perfect for displaying formatted content without allowing modifications.</p>
        `,
    },
}

export const AutoFocus: Story = {
    args: {
        autoFocus: true,
        placeholder: 'This editor automatically focuses on mount...',
    },
}

export const BlogPost: Story = {
    render: () => {
        const BlogEditor = () => {
            const [content, setContent] = useState(`
                <h1>My First Blog Post</h1>
                <p>Today I want to share my thoughts about...</p>
            `)

            return (
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <h2 style={{ marginBottom: '0.5rem' }}>
                            Blog Post Editor
                        </h2>
                        <p style={{ color: '#6c757d', fontSize: '0.875rem' }}>
                            Write and format your blog post using the rich text
                            editor below.
                        </p>
                    </div>
                    <RichTextEditor
                        value={content}
                        onChange={setContent}
                        minHeight="500px"
                        placeholder="Write your blog post here..."
                    />
                    <div
                        style={{
                            marginTop: '1rem',
                            display: 'flex',
                            gap: '0.5rem',
                            justifyContent: 'flex-end',
                        }}
                    >
                        <button
                            style={{
                                padding: '0.5rem 1rem',
                                border: '1px solid #dee2e6',
                                borderRadius: '0.375rem',
                                backgroundColor: 'white',
                                cursor: 'pointer',
                            }}
                            onClick={() => setContent('')}
                        >
                            Clear
                        </button>
                        <button
                            style={{
                                padding: '0.5rem 1rem',
                                border: 'none',
                                borderRadius: '0.375rem',
                                backgroundColor: '#408bbd',
                                color: 'white',
                                cursor: 'pointer',
                            }}
                            onClick={() => alert('Post published!')}
                        >
                            Publish
                        </button>
                    </div>
                </div>
            )
        }

        return <BlogEditor />
    },
}

export const CommentEditor: Story = {
    args: {
        minHeight: '100px',
        placeholder: 'Write a comment...',
        toolbarItems: ['bold', 'italic', 'link', 'code'] as ToolbarItem[],
    },
}

export const EmailComposer: Story = {
    render: () => {
        const EmailEditor = () => {
            const [to, setTo] = useState('')
            const [subject, setSubject] = useState('')
            const [body, setBody] = useState('')

            return (
                <div
                    style={{
                        maxWidth: '900px',
                        margin: '0 auto',
                        border: '1px solid #dee2e6',
                        borderRadius: '0.375rem',
                    }}
                >
                    <div
                        style={{
                            padding: '1rem',
                            borderBottom: '1px solid #dee2e6',
                        }}
                    >
                        <h2 style={{ margin: '0 0 1rem 0' }}>New Email</h2>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.75rem',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                }}
                            >
                                <label
                                    style={{
                                        minWidth: '60px',
                                        fontWeight: 500,
                                    }}
                                >
                                    To:
                                </label>
                                <input
                                    type="email"
                                    value={to}
                                    onChange={(e) => setTo(e.target.value)}
                                    placeholder="recipient@example.com"
                                    style={{
                                        flex: 1,
                                        padding: '0.5rem',
                                        border: '1px solid #dee2e6',
                                        borderRadius: '0.375rem',
                                    }}
                                />
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                }}
                            >
                                <label
                                    style={{
                                        minWidth: '60px',
                                        fontWeight: 500,
                                    }}
                                >
                                    Subject:
                                </label>
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="Email subject"
                                    style={{
                                        flex: 1,
                                        padding: '0.5rem',
                                        border: '1px solid #dee2e6',
                                        borderRadius: '0.375rem',
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <RichTextEditor
                        value={body}
                        onChange={setBody}
                        minHeight="300px"
                        placeholder="Compose your email..."
                        toolbarItems={
                            [
                                'bold',
                                'italic',
                                'underline',
                                'h2',
                                'h3',
                                'unorderedList',
                                'orderedList',
                                'link',
                                'image',
                            ] as ToolbarItem[]
                        }
                    />
                    <div
                        style={{
                            padding: '1rem',
                            borderTop: '1px solid #dee2e6',
                            display: 'flex',
                            gap: '0.5rem',
                            justifyContent: 'flex-end',
                        }}
                    >
                        <button
                            style={{
                                padding: '0.5rem 1rem',
                                border: '1px solid #dee2e6',
                                borderRadius: '0.375rem',
                                backgroundColor: 'white',
                                cursor: 'pointer',
                            }}
                        >
                            Save Draft
                        </button>
                        <button
                            style={{
                                padding: '0.5rem 1rem',
                                border: 'none',
                                borderRadius: '0.375rem',
                                backgroundColor: '#408bbd',
                                color: 'white',
                                cursor: 'pointer',
                            }}
                            onClick={() => alert('Email sent!')}
                        >
                            Send
                        </button>
                    </div>
                </div>
            )
        }

        return <EmailEditor />
    },
}

export const DocumentationEditor: Story = {
    args: {
        defaultValue: `
            <h1>API Documentation</h1>
            <h2>Installation</h2>
            <pre>npm install my-package</pre>
            <h2>Usage</h2>
            <p>Import the component:</p>
            <pre>import { Component } from 'my-package'</pre>
            <h2>Examples</h2>
            <p>Here's a basic example:</p>
            <pre>&lt;Component prop="value" /&gt;</pre>
        `,
        minHeight: '600px',
    },
}

export const AllFormattingOptions: Story = {
    args: {
        defaultValue: `
            <h1>Heading 1</h1>
            <h2>Heading 2</h2>
            <h3>Heading 3</h3>
            <p>Regular paragraph with <strong>bold</strong>, <em>italic</em>, <u>underline</u>, and <s>strikethrough</s> text.</p>
            <p>Here's a <a href="https://example.com">link to a website</a>.</p>
            <h3>Ordered List</h3>
            <ol>
                <li>First item</li>
                <li>Second item</li>
                <li>Third item</li>
            </ol>
            <h3>Unordered List</h3>
            <ul>
                <li>Bullet point</li>
                <li>Another point</li>
                <li>Last point</li>
            </ul>
            <blockquote>This is a blockquote for highlighting important information or quotes.</blockquote>
            <h3>Code</h3>
            <p>Inline <code>code</code> looks like this.</p>
            <pre>// Code block
function example() {
    return 'Hello World';
}</pre>
            <hr>
            <p>Content after horizontal rule.</p>
        `,
        minHeight: '600px',
    },
}
