import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Tabs from './Tabs'

// JSDOM doesn't implement scrollIntoView
beforeAll(() => {
    Element.prototype.scrollIntoView = jest.fn()
})

const items = [
    { id: 'tab1', label: 'Tab 1', content: <div>Content 1</div> },
    { id: 'tab2', label: 'Tab 2', content: <div>Content 2</div> },
    {
        id: 'tab3',
        label: 'Tab 3',
        content: <div>Content 3</div>,
        disabled: true,
    },
]

describe('Tabs', () => {
    it('renders all tab buttons', () => {
        render(<Tabs items={items} />)
        expect(screen.getByRole('tablist')).toBeInTheDocument()
        expect(screen.getAllByRole('tab')).toHaveLength(3)
    })

    it('shows the first tab content by default', () => {
        render(<Tabs items={items} />)
        expect(screen.getByText('Content 1')).toBeInTheDocument()
    })

    it('switches tabs on click', () => {
        render(<Tabs items={items} />)
        fireEvent.click(screen.getByRole('tab', { name: 'Tab 2' }))
        expect(screen.getByText('Content 2')).toBeInTheDocument()
    })

    it('does not switch to a disabled tab', () => {
        render(<Tabs items={items} />)
        fireEvent.click(screen.getByRole('tab', { name: 'Tab 3' }))
        expect(screen.getByText('Content 1')).toBeInTheDocument()
    })

    it('supports controlled mode via activeId', () => {
        const { rerender } = render(<Tabs items={items} activeId="tab2" />)
        expect(screen.getByText('Content 2')).toBeInTheDocument()

        rerender(<Tabs items={items} activeId="tab1" />)
        expect(screen.getByText('Content 1')).toBeInTheDocument()
    })

    it('calls onChange when a tab is clicked', () => {
        const handleChange = jest.fn()
        render(<Tabs items={items} onChange={handleChange} />)
        fireEvent.click(screen.getByRole('tab', { name: 'Tab 2' }))
        expect(handleChange).toHaveBeenCalledWith('tab2')
    })

    it('marks the active tab with aria-selected', () => {
        render(<Tabs items={items} />)
        expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute(
            'aria-selected',
            'true'
        )
        expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute(
            'aria-selected',
            'false'
        )
    })

    it('navigates with arrow keys', () => {
        render(<Tabs items={items} />)
        const firstTab = screen.getByRole('tab', { name: 'Tab 1' })
        fireEvent.keyDown(firstTab, { key: 'ArrowRight' })
        expect(screen.getByText('Content 2')).toBeInTheDocument()
    })

    it('navigates to first/last with Home/End', () => {
        render(<Tabs items={items} defaultActiveId="tab2" />)
        const tab = screen.getByRole('tab', { name: 'Tab 2' })
        fireEvent.keyDown(tab, { key: 'Home' })
        expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute(
            'aria-selected',
            'true'
        )
    })

    it('applies variant and size classes', () => {
        const { container } = render(
            <Tabs items={items} variant="card" size="lg" />
        )
        expect(container.firstChild).toHaveClass('tabs--card')
        expect(container.firstChild).toHaveClass('tabs--size-lg')
    })

    it('renders icons and badges', () => {
        const iconItems = [
            {
                id: 'a',
                label: 'A',
                content: <div>A</div>,
                icon: <span data-testid="icon">I</span>,
                badge: <span data-testid="badge">3</span>,
            },
        ]
        render(<Tabs items={iconItems} />)
        expect(screen.getByTestId('icon')).toBeInTheDocument()
        expect(screen.getByTestId('badge')).toBeInTheDocument()
    })

    it('applies fullWidth class', () => {
        const { container } = render(<Tabs items={items} fullWidth />)
        expect(container.firstChild).toHaveClass('tabs--full-width')
    })
})
