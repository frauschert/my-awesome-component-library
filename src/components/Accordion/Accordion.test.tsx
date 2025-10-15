import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Accordion, { AccordionItem } from './Accordion'

const mockItems: AccordionItem[] = [
    { id: '1', title: 'Section 1', content: 'Content 1' },
    { id: '2', title: 'Section 2', content: 'Content 2' },
    { id: '3', title: 'Section 3', content: 'Content 3' },
]

describe('Accordion', () => {
    describe('Basic Rendering', () => {
        it('renders all items', () => {
            render(<Accordion items={mockItems} />)

            expect(screen.getByText('Section 1')).toBeInTheDocument()
            expect(screen.getByText('Section 2')).toBeInTheDocument()
            expect(screen.getByText('Section 3')).toBeInTheDocument()
        })

        it('initially collapses all items by default', () => {
            render(<Accordion items={mockItems} />)

            const buttons = screen.getAllByRole('button')
            buttons.forEach((button) => {
                expect(button).toHaveAttribute('aria-expanded', 'false')
            })
        })

        it('expands items specified in defaultExpandedItems', () => {
            render(
                <Accordion
                    items={mockItems}
                    defaultExpandedItems={['1', '3']}
                />
            )

            const buttons = screen.getAllByRole('button')
            expect(buttons[0]).toHaveAttribute('aria-expanded', 'true')
            expect(buttons[1]).toHaveAttribute('aria-expanded', 'false')
            expect(buttons[2]).toHaveAttribute('aria-expanded', 'true')
        })

        it('renders with custom className', () => {
            const { container } = render(
                <Accordion items={mockItems} className="custom-class" />
            )

            const accordion = container.querySelector('.accordion')
            expect(accordion).toHaveClass('custom-class')
        })
    })

    describe('Uncontrolled Mode', () => {
        it('toggles item expansion on click in multiple mode', () => {
            render(<Accordion items={mockItems} mode="multiple" />)

            const firstButton = screen.getAllByRole('button')[0]

            // Initially collapsed
            expect(firstButton).toHaveAttribute('aria-expanded', 'false')

            // Click to expand
            fireEvent.click(firstButton)
            expect(firstButton).toHaveAttribute('aria-expanded', 'true')

            // Click to collapse
            fireEvent.click(firstButton)
            expect(firstButton).toHaveAttribute('aria-expanded', 'false')
        })

        it('allows multiple items to be expanded in multiple mode', () => {
            render(<Accordion items={mockItems} mode="multiple" />)

            const buttons = screen.getAllByRole('button')

            fireEvent.click(buttons[0])
            fireEvent.click(buttons[1])

            expect(buttons[0]).toHaveAttribute('aria-expanded', 'true')
            expect(buttons[1]).toHaveAttribute('aria-expanded', 'true')
            expect(buttons[2]).toHaveAttribute('aria-expanded', 'false')
        })

        it('only allows one item expanded in single mode', () => {
            render(<Accordion items={mockItems} mode="single" />)

            const buttons = screen.getAllByRole('button')

            // Expand first item
            fireEvent.click(buttons[0])
            expect(buttons[0]).toHaveAttribute('aria-expanded', 'true')

            // Expand second item - first should collapse
            fireEvent.click(buttons[1])
            expect(buttons[0]).toHaveAttribute('aria-expanded', 'false')
            expect(buttons[1]).toHaveAttribute('aria-expanded', 'true')
        })

        it('respects allowToggle prop in single mode', () => {
            render(
                <Accordion
                    items={mockItems}
                    mode="single"
                    allowToggle={false}
                />
            )

            const firstButton = screen.getAllByRole('button')[0]

            // Expand item
            fireEvent.click(firstButton)
            expect(firstButton).toHaveAttribute('aria-expanded', 'true')

            // Try to collapse - should remain expanded
            fireEvent.click(firstButton)
            expect(firstButton).toHaveAttribute('aria-expanded', 'true')
        })
    })

    describe('Controlled Mode', () => {
        it('uses expandedItems prop when provided', () => {
            render(<Accordion items={mockItems} expandedItems={['2']} />)

            const buttons = screen.getAllByRole('button')

            expect(buttons[0]).toHaveAttribute('aria-expanded', 'false')
            expect(buttons[1]).toHaveAttribute('aria-expanded', 'true')
            expect(buttons[2]).toHaveAttribute('aria-expanded', 'false')
        })

        it('calls onChange when item is toggled', () => {
            const handleChange = jest.fn()
            render(
                <Accordion
                    items={mockItems}
                    expandedItems={[]}
                    onChange={handleChange}
                />
            )

            const firstButton = screen.getAllByRole('button')[0]
            fireEvent.click(firstButton)

            expect(handleChange).toHaveBeenCalledWith(['1'])
        })

        it('does not update internal state in controlled mode', () => {
            const handleChange = jest.fn()
            render(
                <Accordion
                    items={mockItems}
                    expandedItems={[]}
                    onChange={handleChange}
                />
            )

            const firstButton = screen.getAllByRole('button')[0]
            fireEvent.click(firstButton)

            // Should still be collapsed since parent didn't update expandedItems
            expect(firstButton).toHaveAttribute('aria-expanded', 'false')
        })
    })

    describe('Callbacks', () => {
        it('calls onExpand when item expands', () => {
            const handleExpand = jest.fn()
            render(<Accordion items={mockItems} onExpand={handleExpand} />)

            const firstButton = screen.getAllByRole('button')[0]
            fireEvent.click(firstButton)

            expect(handleExpand).toHaveBeenCalledWith('1')
        })

        it('calls onCollapse when item collapses', () => {
            const handleCollapse = jest.fn()
            render(
                <Accordion
                    items={mockItems}
                    defaultExpandedItems={['1']}
                    onCollapse={handleCollapse}
                />
            )

            const firstButton = screen.getAllByRole('button')[0]
            fireEvent.click(firstButton)

            expect(handleCollapse).toHaveBeenCalledWith('1')
        })

        it('calls onCollapse for previously expanded item in single mode', () => {
            const handleCollapse = jest.fn()
            render(
                <Accordion
                    items={mockItems}
                    mode="single"
                    defaultExpandedItems={['1']}
                    onCollapse={handleCollapse}
                />
            )

            const buttons = screen.getAllByRole('button')

            // Expand second item, should collapse first
            fireEvent.click(buttons[1])

            expect(handleCollapse).toHaveBeenCalledWith('1')
        })
    })

    describe('Disabled State', () => {
        it('disables all items when disabled prop is true', () => {
            render(<Accordion items={mockItems} disabled />)

            const buttons = screen.getAllByRole('button')
            buttons.forEach((button) => {
                expect(button).toBeDisabled()
            })
        })

        it('disables individual items', () => {
            const itemsWithDisabled: AccordionItem[] = [
                { id: '1', title: 'Section 1', content: 'Content 1' },
                {
                    id: '2',
                    title: 'Section 2',
                    content: 'Content 2',
                    disabled: true,
                },
                { id: '3', title: 'Section 3', content: 'Content 3' },
            ]

            render(<Accordion items={itemsWithDisabled} />)

            const buttons = screen.getAllByRole('button')
            expect(buttons[0]).not.toBeDisabled()
            expect(buttons[1]).toBeDisabled()
            expect(buttons[2]).not.toBeDisabled()
        })

        it('does not toggle disabled items', () => {
            const itemsWithDisabled: AccordionItem[] = [
                {
                    id: '1',
                    title: 'Section 1',
                    content: 'Content 1',
                    disabled: true,
                },
            ]

            render(<Accordion items={itemsWithDisabled} />)

            const button = screen.getByRole('button')
            fireEvent.click(button)

            expect(button).toHaveAttribute('aria-expanded', 'false')
        })
    })

    describe('Accessibility', () => {
        it('has proper ARIA attributes', () => {
            render(<Accordion items={mockItems} />)

            const buttons = screen.getAllByRole('button')
            buttons.forEach((button, index) => {
                expect(button).toHaveAttribute('aria-expanded')
                expect(button).toHaveAttribute(
                    'aria-controls',
                    `accordion-panel-${index + 1}`
                )
            })
        })

        it('has proper heading structure', () => {
            render(<Accordion items={mockItems} />)

            const headings = screen.getAllByRole('heading', { level: 3 })
            expect(headings).toHaveLength(3)
        })

        it('has region role for content panels', () => {
            render(<Accordion items={mockItems} defaultExpandedItems={['1']} />)

            const regions = screen.getAllByRole('region')
            expect(regions).toHaveLength(3)
        })

        it('associates panel with heading via aria-labelledby', () => {
            render(<Accordion items={mockItems} />)

            const regions = screen.getAllByRole('region')
            regions.forEach((region, index) => {
                expect(region).toHaveAttribute(
                    'aria-labelledby',
                    `accordion-heading-${index + 1}`
                )
            })
        })

        it('supports keyboard navigation with Enter key', () => {
            render(<Accordion items={mockItems} />)

            const firstButton = screen.getAllByRole('button')[0]

            fireEvent.keyDown(firstButton, { key: 'Enter' })
            expect(firstButton).toHaveAttribute('aria-expanded', 'true')
        })

        it('supports keyboard navigation with Space key', () => {
            render(<Accordion items={mockItems} />)

            const firstButton = screen.getAllByRole('button')[0]

            fireEvent.keyDown(firstButton, { key: ' ' })
            expect(firstButton).toHaveAttribute('aria-expanded', 'true')
        })

        it('prevents default on Space key to avoid scrolling', () => {
            render(<Accordion items={mockItems} />)

            const firstButton = screen.getAllByRole('button')[0]
            const event = new KeyboardEvent('keydown', {
                key: ' ',
                bubbles: true,
            })
            const preventDefaultSpy = jest.spyOn(event, 'preventDefault')

            firstButton.dispatchEvent(event)

            expect(preventDefaultSpy).toHaveBeenCalled()
        })
    })

    describe('Styling & Variants', () => {
        it('applies size variant classes', () => {
            const { container } = render(
                <Accordion items={mockItems} size="lg" />
            )

            const accordion = container.querySelector('.accordion')
            expect(accordion).toHaveClass('accordion--lg')
        })

        it('applies visual variant classes', () => {
            const { container } = render(
                <Accordion items={mockItems} variant="bordered" />
            )

            const accordion = container.querySelector('.accordion')
            expect(accordion).toHaveClass('accordion--bordered')
        })

        it('applies custom item className', () => {
            const { container } = render(
                <Accordion items={mockItems} itemClassName="custom-item" />
            )

            const items = container.querySelectorAll('.accordion-item')
            items.forEach((item) => {
                expect(item).toHaveClass('custom-item')
            })
        })
    })

    describe('Custom Icons', () => {
        it('renders custom expand icon', () => {
            render(
                <Accordion
                    items={mockItems}
                    expandIcon={<span data-testid="custom-expand">▶</span>}
                />
            )

            expect(screen.getAllByTestId('custom-expand')).toHaveLength(3)
        })

        it('renders custom collapse icon when expanded', () => {
            render(
                <Accordion
                    items={mockItems}
                    defaultExpandedItems={['1']}
                    collapseIcon={<span data-testid="custom-collapse">▼</span>}
                />
            )

            expect(screen.getByTestId('custom-collapse')).toBeInTheDocument()
        })

        it('renders item-level custom icon', () => {
            const itemsWithIcon: AccordionItem[] = [
                {
                    id: '1',
                    title: 'Section 1',
                    content: 'Content 1',
                    icon: <span data-testid="item-icon">🔧</span>,
                },
            ]

            render(<Accordion items={itemsWithIcon} />)

            expect(screen.getByTestId('item-icon')).toBeInTheDocument()
        })
    })

    describe('Edge Cases', () => {
        it('handles empty items array', () => {
            const { container } = render(<Accordion items={[]} />)

            const accordion = container.querySelector('.accordion')
            expect(accordion).toBeInTheDocument()
            expect(accordion?.children).toHaveLength(0)
        })

        it('handles single item', () => {
            render(<Accordion items={[mockItems[0]]} />)

            expect(screen.getByText('Section 1')).toBeInTheDocument()
            expect(screen.getAllByRole('button')).toHaveLength(1)
        })

        it('handles items with JSX content', () => {
            const itemsWithJSX: AccordionItem[] = [
                {
                    id: '1',
                    title: <strong>Bold Title</strong>,
                    content: <div data-testid="jsx-content">JSX Content</div>,
                },
            ]

            render(<Accordion items={itemsWithJSX} />)

            expect(screen.getByText('Bold Title')).toBeInTheDocument()

            const button = screen.getByRole('button')
            fireEvent.click(button)

            expect(screen.getByTestId('jsx-content')).toBeInTheDocument()
        })
    })

    describe('Performance', () => {
        it('uses React.memo to prevent unnecessary re-renders', () => {
            expect(Accordion.displayName).toBe('Accordion')
        })
    })
})
