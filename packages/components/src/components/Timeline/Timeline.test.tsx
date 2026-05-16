import React from 'react'
import { render, screen } from '@testing-library/react'
import Timeline from './Timeline'

const mockItems = [
    {
        title: 'First Event',
        description: 'First event description',
        timestamp: '10:00 AM',
        status: 'success' as const,
    },
    {
        title: 'Second Event',
        description: 'Second event description',
        timestamp: '11:00 AM',
        status: 'info' as const,
    },
]

describe('Timeline', () => {
    it('renders without crashing', () => {
        render(<Timeline items={mockItems} />)
        expect(screen.getByText('First Event')).toBeInTheDocument()
        expect(screen.getByText('Second Event')).toBeInTheDocument()
    })

    it('renders all timeline items', () => {
        render(<Timeline items={mockItems} />)
        expect(screen.getByText('First Event')).toBeInTheDocument()
        expect(screen.getByText('First event description')).toBeInTheDocument()
        expect(screen.getByText('10:00 AM')).toBeInTheDocument()
        expect(screen.getByText('Second Event')).toBeInTheDocument()
    })

    it('applies default variant class', () => {
        const { container } = render(<Timeline items={mockItems} />)
        expect(
            container.querySelector('.timeline--default')
        ).toBeInTheDocument()
    })

    it('applies compact variant class', () => {
        const { container } = render(
            <Timeline items={mockItems} variant="compact" />
        )
        expect(
            container.querySelector('.timeline--compact')
        ).toBeInTheDocument()
    })

    it('applies detailed variant class', () => {
        const { container } = render(
            <Timeline items={mockItems} variant="detailed" />
        )
        expect(
            container.querySelector('.timeline--detailed')
        ).toBeInTheDocument()
    })

    it('applies right position class by default', () => {
        const { container } = render(<Timeline items={mockItems} />)
        expect(container.querySelector('.timeline--right')).toBeInTheDocument()
    })

    it('applies left position class', () => {
        const { container } = render(
            <Timeline items={mockItems} position="left" />
        )
        expect(container.querySelector('.timeline--left')).toBeInTheDocument()
    })

    it('applies alternate position class', () => {
        const { container } = render(
            <Timeline items={mockItems} position="alternate" />
        )
        expect(
            container.querySelector('.timeline--alternate')
        ).toBeInTheDocument()
    })

    it('renders custom className', () => {
        const { container } = render(
            <Timeline items={mockItems} className="custom-timeline" />
        )
        expect(
            container.querySelector('.timeline.custom-timeline')
        ).toBeInTheDocument()
    })

    it('renders status classes correctly', () => {
        const { container } = render(<Timeline items={mockItems} />)
        expect(
            container.querySelector('.timeline-item--success')
        ).toBeInTheDocument()
        expect(
            container.querySelector('.timeline-item--info')
        ).toBeInTheDocument()
    })

    it('renders without timestamps', () => {
        const itemsWithoutTimestamp = [
            { title: 'Event', description: 'Description' },
        ]
        render(<Timeline items={itemsWithoutTimestamp} />)
        expect(screen.getByText('Event')).toBeInTheDocument()
        expect(screen.queryByRole('time')).not.toBeInTheDocument()
    })

    it('renders without descriptions', () => {
        const itemsWithoutDescription = [
            { title: 'Event', timestamp: '10:00 AM' },
        ]
        render(<Timeline items={itemsWithoutDescription} />)
        expect(screen.getByText('Event')).toBeInTheDocument()
        expect(screen.getByText('10:00 AM')).toBeInTheDocument()
    })

    it('renders custom icon', () => {
        const itemsWithIcon = [
            {
                title: 'Event',
                icon: <span data-testid="custom-icon">✓</span>,
            },
        ]
        render(<Timeline items={itemsWithIcon} />)
        expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
    })

    it('renders default dot when no icon provided', () => {
        const { container } = render(<Timeline items={mockItems} />)
        expect(container.querySelectorAll('.timeline-item__dot')).toHaveLength(
            2
        )
    })

    it('renders children content', () => {
        const itemsWithChildren = [
            {
                title: 'Event',
                children: (
                    <div data-testid="custom-content">Custom Content</div>
                ),
            },
        ]
        render(<Timeline items={itemsWithChildren} />)
        expect(screen.getByTestId('custom-content')).toBeInTheDocument()
    })

    it('renders alternate positioning correctly', () => {
        const { container } = render(
            <Timeline items={mockItems} position="alternate" />
        )
        expect(
            container.querySelector('.timeline-item--alternate-left')
        ).toBeInTheDocument()
        expect(
            container.querySelector('.timeline-item--alternate-right')
        ).toBeInTheDocument()
    })

    it('applies all status variants', () => {
        const allStatusItems = [
            { title: 'Default', status: 'default' as const },
            { title: 'Success', status: 'success' as const },
            { title: 'Error', status: 'error' as const },
            { title: 'Warning', status: 'warning' as const },
            { title: 'Info', status: 'info' as const },
        ]
        const { container } = render(<Timeline items={allStatusItems} />)
        expect(
            container.querySelector('.timeline-item--default')
        ).toBeInTheDocument()
        expect(
            container.querySelector('.timeline-item--success')
        ).toBeInTheDocument()
        expect(
            container.querySelector('.timeline-item--error')
        ).toBeInTheDocument()
        expect(
            container.querySelector('.timeline-item--warning')
        ).toBeInTheDocument()
        expect(
            container.querySelector('.timeline-item--info')
        ).toBeInTheDocument()
    })

    it('renders empty timeline', () => {
        const { container } = render(<Timeline items={[]} />)
        expect(container.querySelector('.timeline')).toBeInTheDocument()
        expect(container.querySelectorAll('.timeline-item')).toHaveLength(0)
    })

    it('applies item custom className', () => {
        const itemsWithClass = [{ title: 'Event', className: 'custom-item' }]
        const { container } = render(<Timeline items={itemsWithClass} />)
        expect(
            container.querySelector('.timeline-item.custom-item')
        ).toBeInTheDocument()
    })

    it('renders multiple items with different statuses', () => {
        const multipleItems = [
            { title: 'Event 1', status: 'success' as const },
            { title: 'Event 2', status: 'error' as const },
            { title: 'Event 3', status: 'warning' as const },
        ]
        render(<Timeline items={multipleItems} />)
        expect(screen.getByText('Event 1')).toBeInTheDocument()
        expect(screen.getByText('Event 2')).toBeInTheDocument()
        expect(screen.getByText('Event 3')).toBeInTheDocument()
    })
})
