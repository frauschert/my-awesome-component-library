import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import JsonViewer from './JsonViewer'

const meta: Meta<typeof JsonViewer> = {
    title: 'Components/JsonViewer',
    component: JsonViewer,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component:
                    'A powerful JSON viewer component with syntax highlighting, search, collapsible nodes, and copy functionality.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        data: {
            description: 'The JSON data to display',
            control: 'object',
        },
        size: {
            description: 'Size of the viewer',
            control: 'select',
            options: ['small', 'medium', 'large'],
        },
        collapsed: {
            description: 'Initial collapsed state (boolean or depth level)',
            control: 'number',
        },
        enableSearch: {
            description: 'Enable search functionality',
            control: 'boolean',
        },
        enableCopy: {
            description: 'Enable copy to clipboard',
            control: 'boolean',
        },
        enableLineNumbers: {
            description: 'Show line numbers',
            control: 'boolean',
        },
        enableCollapse: {
            description: 'Show collapse/expand all buttons',
            control: 'boolean',
        },
        highlightUpdates: {
            description: 'Highlight nodes when data changes',
            control: 'boolean',
        },
        maxHeight: {
            description: 'Maximum height of the viewer',
            control: 'text',
        },
        rootName: {
            description: 'Name of the root node',
            control: 'text',
        },
        indentWidth: {
            description: 'Width of indentation in pixels',
            control: 'number',
        },
    },
}

export default meta
type Story = StoryObj<typeof JsonViewer>

const sampleUserData = {
    id: 12345,
    username: 'johndoe',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    age: 30,
    isActive: true,
    balance: 1250.75,
    role: 'admin',
    permissions: ['read', 'write', 'delete'],
    address: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        coordinates: {
            lat: 40.7128,
            lng: -74.006,
        },
    },
    preferences: {
        theme: 'dark',
        notifications: {
            email: true,
            push: false,
            sms: true,
        },
        language: 'en-US',
    },
    createdAt: '2024-01-15T10:30:00Z',
    lastLogin: '2024-10-20T14:25:00Z',
    metadata: null,
}

const apiResponseData = {
    status: 'success',
    code: 200,
    message: 'Data retrieved successfully',
    data: {
        users: [
            { id: 1, name: 'Alice', active: true },
            { id: 2, name: 'Bob', active: false },
            { id: 3, name: 'Charlie', active: true },
        ],
        pagination: {
            page: 1,
            perPage: 10,
            total: 3,
            totalPages: 1,
        },
    },
    timestamp: 1698765432000,
}

const complexNestedData = {
    company: {
        name: 'TechCorp',
        founded: 2010,
        employees: 500,
        departments: {
            engineering: {
                name: 'Engineering',
                employees: 200,
                teams: {
                    frontend: {
                        name: 'Frontend',
                        members: 50,
                        technologies: ['React', 'TypeScript', 'CSS'],
                    },
                    backend: {
                        name: 'Backend',
                        members: 80,
                        technologies: ['Node.js', 'Python', 'PostgreSQL'],
                    },
                    mobile: {
                        name: 'Mobile',
                        members: 40,
                        technologies: ['React Native', 'Swift', 'Kotlin'],
                    },
                },
            },
            sales: {
                name: 'Sales',
                employees: 150,
                regions: ['North America', 'Europe', 'Asia'],
            },
            hr: {
                name: 'Human Resources',
                employees: 50,
                policies: ['Remote Work', 'Health Insurance', '401k'],
            },
        },
    },
}

export const Default: Story = {
    args: {
        data: sampleUserData,
        size: 'medium',
    },
}

export const WithMediumSize: Story = {
    args: {
        data: sampleUserData,
        size: 'medium',
    },
}

export const SmallSize: Story = {
    args: {
        data: sampleUserData,
        size: 'small',
    },
}

export const LargeSize: Story = {
    args: {
        data: sampleUserData,
        size: 'large',
    },
}

export const CollapsedByDefault: Story = {
    args: {
        data: sampleUserData,
        collapsed: true,
    },
}

export const CollapsedAtDepth: Story = {
    args: {
        data: complexNestedData,
        collapsed: 2,
        rootName: 'company',
    },
    parameters: {
        docs: {
            description: {
                story: 'Collapse all nodes at or deeper than the specified depth level.',
            },
        },
    },
}

export const WithLineNumbers: Story = {
    args: {
        data: sampleUserData,
        enableLineNumbers: true,
        maxHeight: '400px',
    },
}

export const WithSearch: Story = {
    args: {
        data: apiResponseData,
        enableSearch: true,
        rootName: 'response',
    },
}

export const DisabledFeatures: Story = {
    args: {
        data: sampleUserData,
        enableSearch: false,
        enableCopy: false,
        enableCollapse: false,
    },
    parameters: {
        docs: {
            description: {
                story: 'A minimal viewer with all toolbar features disabled.',
            },
        },
    },
}

export const MaxHeight: Story = {
    args: {
        data: complexNestedData,
        maxHeight: 300,
        rootName: 'data',
    },
    parameters: {
        docs: {
            description: {
                story: 'Viewer with a maximum height and scrollable content.',
            },
        },
    },
}

export const APIResponse: Story = {
    args: {
        data: apiResponseData,
        rootName: 'apiResponse',
        enableLineNumbers: true,
    },
    parameters: {
        docs: {
            description: {
                story: 'Viewing a typical API response structure.',
            },
        },
    },
}

export const DeeplyNested: Story = {
    args: {
        data: complexNestedData,
        collapsed: 1,
        enableCollapse: true,
    },
    parameters: {
        docs: {
            description: {
                story: 'Viewing deeply nested data with collapse controls.',
            },
        },
    },
}

export const CustomIndentation: Story = {
    args: {
        data: sampleUserData,
        indentWidth: 30,
    },
    parameters: {
        docs: {
            description: {
                story: 'Increased indentation width for better readability.',
            },
        },
    },
}

export const PrimitiveValues: Story = {
    args: {
        data: {
            string: 'Hello World',
            number: 42,
            boolean: true,
            nullValue: null,
            array: [1, 2, 3, 4, 5],
            emptyObject: {},
            emptyArray: [],
        },
        rootName: 'primitives',
    },
    parameters: {
        docs: {
            description: {
                story: 'Displaying different primitive value types.',
            },
        },
    },
}

export const WithSelection: Story = {
    render: () => {
        const [selectedPath, setSelectedPath] = useState<string>('')
        const [selectedValue, setSelectedValue] = useState<any>(null)

        return (
            <div>
                <JsonViewer
                    data={sampleUserData}
                    onSelect={(path, value) => {
                        setSelectedPath(path.join('.'))
                        setSelectedValue(value)
                    }}
                />
                {selectedPath && (
                    <div
                        style={{
                            marginTop: '16px',
                            padding: '12px',
                            background: '#f3f4f6',
                            borderRadius: '8px',
                        }}
                    >
                        <strong>Selected:</strong> {selectedPath}
                        <br />
                        <strong>Value:</strong> {JSON.stringify(selectedValue)}
                    </div>
                )}
            </div>
        )
    },
    parameters: {
        docs: {
            description: {
                story: 'Click on any node to see its path and value.',
            },
        },
    },
}

export const CustomRenderer: Story = {
    args: {
        data: {
            name: 'John Doe',
            email: 'john@example.com',
            website: 'https://example.com',
            phone: '+1-555-0123',
            avatar: 'https://i.pravatar.cc/150?img=1',
        },
        renderCustom: (value: any, path: string[]) => {
            const key = path[path.length - 1]
            if (typeof value === 'string') {
                if (key === 'email' && value.includes('@')) {
                    return (
                        <a
                            href={`mailto:${value}`}
                            style={{ color: '#3b82f6' }}
                        >
                            {value}
                        </a>
                    )
                }
                if (key === 'website' && value.startsWith('http')) {
                    return (
                        <a
                            href={value}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#3b82f6' }}
                        >
                            {value}
                        </a>
                    )
                }
                if (key === 'avatar') {
                    return (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                            }}
                        >
                            <img
                                src={value}
                                alt="avatar"
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                }}
                            />
                            <span style={{ color: '#059669' }}>"{value}"</span>
                        </div>
                    )
                }
            }
            return undefined
        },
    },
    parameters: {
        docs: {
            description: {
                story: 'Custom rendering for specific value types (emails, URLs, images).',
            },
        },
    },
}

export const LiveUpdates: Story = {
    render: () => {
        const [data, setData] = useState({
            counter: 0,
            timestamp: new Date().toISOString(),
            randomValue: Math.random(),
        })

        return (
            <div>
                <div style={{ marginBottom: '16px' }}>
                    <button
                        onClick={() =>
                            setData({
                                counter: data.counter + 1,
                                timestamp: new Date().toISOString(),
                                randomValue: Math.random(),
                            })
                        }
                        style={{
                            padding: '8px 16px',
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                    >
                        Update Data
                    </button>
                </div>
                <JsonViewer data={data} highlightUpdates={true} />
            </div>
        )
    },
    parameters: {
        docs: {
            description: {
                story: 'Values flash green when they change. Click the button to see the highlight effect.',
            },
        },
    },
}

export const AllFeatures: Story = {
    args: {
        data: complexNestedData,
        size: 'medium',
        collapsed: 2,
        enableSearch: true,
        enableCopy: true,
        enableLineNumbers: true,
        enableCollapse: true,
        maxHeight: '500px',
        rootName: 'company',
        indentWidth: 20,
    },
    parameters: {
        docs: {
            description: {
                story: 'A fully-featured JsonViewer with all options enabled.',
            },
        },
    },
}
