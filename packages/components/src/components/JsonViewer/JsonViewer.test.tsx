import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import JsonViewer from './JsonViewer'

const sampleData = {
    name: 'John Doe',
    age: 30,
    isActive: true,
    balance: null,
    address: {
        street: '123 Main St',
        city: 'New York',
        zipCode: 10001,
    },
    hobbies: ['reading', 'gaming', 'coding'],
    metadata: {
        created: '2024-01-01',
        updated: '2024-01-15',
    },
}

describe('JsonViewer', () => {
    describe('Rendering', () => {
        it('should render JSON data correctly', () => {
            render(<JsonViewer data={sampleData} />)
            expect(screen.getByText('"John Doe"')).toBeInTheDocument()
            expect(screen.getByText('30')).toBeInTheDocument()
            expect(screen.getByText('true')).toBeInTheDocument()
            expect(screen.getByText('null')).toBeInTheDocument()
        })

        it('should render keys correctly', () => {
            render(<JsonViewer data={sampleData} />)
            expect(screen.getByText('name')).toBeInTheDocument()
            expect(screen.getByText('age')).toBeInTheDocument()
            expect(screen.getByText('address')).toBeInTheDocument()
        })

        it('should render nested objects', () => {
            render(<JsonViewer data={sampleData} />)
            expect(screen.getByText('street')).toBeInTheDocument()
            expect(screen.getByText('"123 Main St"')).toBeInTheDocument()
        })

        it('should render arrays', () => {
            render(<JsonViewer data={sampleData} />)
            expect(screen.getByText('"reading"')).toBeInTheDocument()
            expect(screen.getByText('"gaming"')).toBeInTheDocument()
            expect(screen.getByText('"coding"')).toBeInTheDocument()
        })

        it('should render with custom root name', () => {
            render(<JsonViewer data={sampleData} rootName="user" />)
            expect(screen.getByText('user')).toBeInTheDocument()
        })
    })

    describe('Collapse/Expand', () => {
        it('should render expand/collapse buttons', () => {
            render(<JsonViewer data={sampleData} />)
            const toggleButtons = screen.getAllByRole('button', {
                name: /collapse|expand/i,
            })
            expect(toggleButtons.length).toBeGreaterThan(0)
        })

        it('should collapse nodes when toggled', () => {
            render(<JsonViewer data={sampleData} />)
            const toggleButton = screen.getAllByLabelText('Collapse')[0]
            fireEvent.click(toggleButton)
            expect(screen.queryByText('"123 Main St"')).not.toBeInTheDocument()
        })

        it('should expand collapsed nodes', () => {
            render(<JsonViewer data={sampleData} collapsed={true} />)
            expect(screen.queryByText('"John Doe"')).not.toBeInTheDocument()
            const toggleButton = screen.getByLabelText('Expand')
            fireEvent.click(toggleButton)
            expect(screen.getByText('"John Doe"')).toBeInTheDocument()
        })

        it('should collapse all nodes', () => {
            render(<JsonViewer data={sampleData} enableCollapse={true} />)
            const collapseAllButton = screen.getByText('Collapse All')
            fireEvent.click(collapseAllButton)
            expect(screen.queryByText('"John Doe"')).not.toBeInTheDocument()
        })

        it('should expand all nodes', () => {
            render(
                <JsonViewer
                    data={sampleData}
                    collapsed={true}
                    enableCollapse={true}
                />
            )
            const expandAllButton = screen.getByText('Expand All')
            fireEvent.click(expandAllButton)
            expect(screen.getByText('"John Doe"')).toBeInTheDocument()
        })

        it('should collapse at specific depth level', () => {
            render(<JsonViewer data={sampleData} collapsed={1} />)
            // Root level properties should be visible
            expect(screen.getByText('name')).toBeInTheDocument()
            expect(screen.getByText('address')).toBeInTheDocument()
            // But nested object contents at level 1 (address contents) should be collapsed
            // First expand the address to verify the test
            const addressKey = screen.getByText('address')
            const addressLine = addressKey.closest('.jsonviewer__line')
            const expandButton = addressLine?.querySelector(
                '.jsonviewer__toggle'
            )
            if (expandButton) {
                // Address is initially collapsed at level 1, expand it to see its contents
                fireEvent.click(expandButton)
                // Now we should see the street
                expect(screen.getByText('"123 Main St"')).toBeInTheDocument()
            }
        })
    })

    describe('Search', () => {
        it('should render search input when enabled', () => {
            render(<JsonViewer data={sampleData} enableSearch={true} />)
            expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
        })

        it('should not render search input when disabled', () => {
            render(<JsonViewer data={sampleData} enableSearch={false} />)
            expect(
                screen.queryByPlaceholderText('Search...')
            ).not.toBeInTheDocument()
        })

        it('should filter and highlight search results', () => {
            render(<JsonViewer data={sampleData} enableSearch={true} />)
            const searchInput = screen.getByPlaceholderText('Search...')
            fireEvent.change(searchInput, { target: { value: 'John' } })
            const highlights = document.querySelectorAll(
                '.jsonviewer__highlight'
            )
            expect(highlights.length).toBeGreaterThan(0)
        })
    })

    describe('Copy Functionality', () => {
        beforeEach(() => {
            Object.assign(global.navigator, {
                clipboard: {
                    writeText: jest.fn(() => Promise.resolve()),
                },
            })
        })

        it('should render copy button when enabled', () => {
            render(<JsonViewer data={sampleData} enableCopy={true} />)
            expect(screen.getByText('Copy')).toBeInTheDocument()
        })

        it('should not render copy button when disabled', () => {
            render(<JsonViewer data={sampleData} enableCopy={false} />)
            expect(screen.queryByText('Copy')).not.toBeInTheDocument()
        })

        it('should copy JSON to clipboard', async () => {
            const writeTextMock = jest.fn(() => Promise.resolve())
            Object.assign(global.navigator, {
                clipboard: {
                    writeText: writeTextMock,
                },
            })

            render(<JsonViewer data={sampleData} enableCopy={true} />)
            const copyButton = screen.getByText('Copy')
            fireEvent.click(copyButton)

            await waitFor(() => {
                expect(writeTextMock).toHaveBeenCalledWith(
                    JSON.stringify(sampleData, null, 2)
                )
            })
        })

        it('should show copied notification', async () => {
            Object.assign(global.navigator, {
                clipboard: {
                    writeText: jest.fn(() => Promise.resolve()),
                },
            })

            render(<JsonViewer data={sampleData} enableCopy={true} />)
            const copyButton = screen.getByText('Copy')
            fireEvent.click(copyButton)

            await waitFor(() => {
                expect(screen.getByText('✓ Copied')).toBeInTheDocument()
            })
        })
    })

    describe('Sizes', () => {
        it('should apply small size', () => {
            const { container } = render(
                <JsonViewer data={sampleData} size="small" />
            )
            expect(
                container.querySelector('.jsonviewer--small')
            ).toBeInTheDocument()
        })

        it('should apply medium size', () => {
            const { container } = render(
                <JsonViewer data={sampleData} size="medium" />
            )
            expect(
                container.querySelector('.jsonviewer--medium')
            ).toBeInTheDocument()
        })

        it('should apply large size', () => {
            const { container } = render(
                <JsonViewer data={sampleData} size="large" />
            )
            expect(
                container.querySelector('.jsonviewer--large')
            ).toBeInTheDocument()
        })
    })

    describe('Line Numbers', () => {
        it('should show line numbers when enabled', () => {
            const { container } = render(
                <JsonViewer data={sampleData} enableLineNumbers={true} />
            )
            expect(
                container.querySelector('.jsonviewer__line-numbers')
            ).toBeInTheDocument()
        })

        it('should not show line numbers when disabled', () => {
            const { container } = render(
                <JsonViewer data={sampleData} enableLineNumbers={false} />
            )
            expect(
                container.querySelector('.jsonviewer__line-numbers')
            ).not.toBeInTheDocument()
        })
    })

    describe('Custom Rendering', () => {
        it('should use custom renderer when provided', () => {
            const renderCustom = (value: any) => {
                if (typeof value === 'string' && value.includes('@')) {
                    return <span className="custom-email">{value}</span>
                }
                return undefined
            }

            const dataWithEmail = { email: 'test@example.com' }
            const { container } = render(
                <JsonViewer data={dataWithEmail} renderCustom={renderCustom} />
            )
            expect(container.querySelector('.custom-email')).toBeInTheDocument()
        })
    })

    describe('Selection', () => {
        it('should call onSelect when node is clicked', () => {
            const onSelectMock = jest.fn()
            render(<JsonViewer data={sampleData} onSelect={onSelectMock} />)
            const nameValue = screen.getByText('"John Doe"')
            fireEvent.click(nameValue.closest('.jsonviewer__line')!)
            expect(onSelectMock).toHaveBeenCalled()
        })
    })

    describe('Styling', () => {
        it('should apply custom className', () => {
            const { container } = render(
                <JsonViewer data={sampleData} className="custom-class" />
            )
            expect(container.querySelector('.custom-class')).toBeInTheDocument()
        })

        it('should apply custom style', () => {
            const { container } = render(
                <JsonViewer
                    data={sampleData}
                    style={{ border: '2px solid red' }}
                />
            )
            const viewer = container.querySelector('.jsonviewer')
            expect(viewer).toHaveStyle({ border: '2px solid red' })
        })

        it('should apply maxHeight', () => {
            const { container } = render(
                <JsonViewer data={sampleData} maxHeight={300} />
            )
            const viewer = container.querySelector('.jsonviewer')
            expect(viewer).toHaveStyle({ maxHeight: '300px' })
        })
    })

    describe('Edge Cases', () => {
        it('should handle empty object', () => {
            render(<JsonViewer data={{}} />)
            expect(screen.getByText('root')).toBeInTheDocument()
        })

        it('should handle empty array', () => {
            render(<JsonViewer data={[]} />)
            expect(screen.getByText('root')).toBeInTheDocument()
        })

        it('should handle primitive values', () => {
            render(<JsonViewer data="simple string" />)
            expect(screen.getByText('"simple string"')).toBeInTheDocument()
        })

        it('should handle deeply nested structures', () => {
            const deepData = {
                level1: {
                    level2: {
                        level3: {
                            level4: {
                                value: 'deep',
                            },
                        },
                    },
                },
            }
            render(<JsonViewer data={deepData} />)
            expect(screen.getByText('"deep"')).toBeInTheDocument()
        })
    })
})
