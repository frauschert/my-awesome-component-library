import React from 'react'
import { render, screen } from '@testing-library/react'
import { ProgressBar } from './ProgressBar'

describe('ProgressBar', () => {
    it('renders with value', () => {
        const { container } = render(<ProgressBar value={50} />)
        expect(container.querySelector('.progressbar')).toBeInTheDocument()
    })

    it('calculates percentage correctly', () => {
        const { container } = render(<ProgressBar value={50} />)
        const fill = container.querySelector(
            '.progressbar__fill'
        ) as HTMLElement
        expect(fill.style.width).toBe('50%')
    })

    it('calculates percentage with custom max', () => {
        const { container } = render(<ProgressBar value={25} max={50} />)
        const fill = container.querySelector(
            '.progressbar__fill'
        ) as HTMLElement
        expect(fill.style.width).toBe('50%')
    })

    it('caps percentage at 100%', () => {
        const { container } = render(<ProgressBar value={150} />)
        const fill = container.querySelector(
            '.progressbar__fill'
        ) as HTMLElement
        expect(fill.style.width).toBe('100%')
    })

    it('ensures minimum percentage of 0%', () => {
        const { container } = render(<ProgressBar value={-10} />)
        const fill = container.querySelector(
            '.progressbar__fill'
        ) as HTMLElement
        expect(fill.style.width).toBe('0%')
    })

    it('applies color classes', () => {
        const { container, rerender } = render(
            <ProgressBar value={50} color="primary" />
        )
        expect(
            container.querySelector('.progressbar__track--primary')
        ).toBeInTheDocument()

        rerender(<ProgressBar value={50} color="success" />)
        expect(
            container.querySelector('.progressbar__track--success')
        ).toBeInTheDocument()

        rerender(<ProgressBar value={50} color="danger" />)
        expect(
            container.querySelector('.progressbar__track--danger')
        ).toBeInTheDocument()
    })

    it('applies size classes', () => {
        const { container, rerender } = render(
            <ProgressBar value={50} size="small" />
        )
        expect(
            container.querySelector('.progressbar--small')
        ).toBeInTheDocument()

        rerender(<ProgressBar value={50} size="large" />)
        expect(
            container.querySelector('.progressbar--large')
        ).toBeInTheDocument()
    })

    it('applies variant classes', () => {
        const { container, rerender } = render(
            <ProgressBar value={50} variant="default" />
        )
        expect(
            container.querySelector('.progressbar__fill--default')
        ).toBeInTheDocument()

        rerender(<ProgressBar value={50} variant="striped" />)
        expect(
            container.querySelector('.progressbar__fill--striped')
        ).toBeInTheDocument()

        rerender(<ProgressBar value={50} variant="animated" />)
        expect(
            container.querySelector('.progressbar__fill--animated')
        ).toBeInTheDocument()
    })

    it('shows percentage when showPercentage is true', () => {
        render(<ProgressBar value={75} showPercentage labelPosition="inside" />)
        expect(screen.getByText('75%')).toBeInTheDocument()
    })

    it('displays custom label', () => {
        render(
            <ProgressBar
                value={50}
                label="50/100 Files"
                labelPosition="inside"
            />
        )
        expect(screen.getByText('50/100 Files')).toBeInTheDocument()
    })

    it('displays label inside when labelPosition is inside', () => {
        const { container } = render(
            <ProgressBar value={50} label="Test" labelPosition="inside" />
        )
        expect(
            container.querySelector('.progressbar__label')
        ).toBeInTheDocument()
        expect(
            container.querySelector('.progressbar__label-outside')
        ).not.toBeInTheDocument()
    })

    it('displays label outside when labelPosition is outside', () => {
        const { container } = render(
            <ProgressBar value={50} label="Test" labelPosition="outside" />
        )
        expect(
            container.querySelector('.progressbar__label-outside')
        ).toBeInTheDocument()
        expect(
            container.querySelector('.progressbar__label')
        ).not.toBeInTheDocument()
    })

    it('hides label when labelPosition is none', () => {
        const { container } = render(
            <ProgressBar value={50} label="Test" labelPosition="none" />
        )
        expect(
            container.querySelector('.progressbar__label')
        ).not.toBeInTheDocument()
        expect(
            container.querySelector('.progressbar__label-outside')
        ).not.toBeInTheDocument()
    })

    it('renders indeterminate state', () => {
        const { container } = render(<ProgressBar value={0} indeterminate />)
        expect(
            container.querySelector('.progressbar--indeterminate')
        ).toBeInTheDocument()
        expect(
            container.querySelector('.progressbar__fill--indeterminate')
        ).toBeInTheDocument()
    })

    it('does not show label in indeterminate state', () => {
        render(
            <ProgressBar
                value={0}
                label="Test"
                indeterminate
                labelPosition="inside"
            />
        )
        expect(screen.queryByText('Test')).not.toBeInTheDocument()
    })

    it('has proper ARIA attributes', () => {
        render(<ProgressBar value={60} max={100} />)
        const progressbar = screen.getByRole('progressbar')
        expect(progressbar).toHaveAttribute('aria-valuenow', '60')
        expect(progressbar).toHaveAttribute('aria-valuemin', '0')
        expect(progressbar).toHaveAttribute('aria-valuemax', '100')
    })

    it('has proper ARIA attributes for indeterminate', () => {
        render(<ProgressBar value={0} indeterminate />)
        const progressbar = screen.getByRole('progressbar')
        expect(progressbar).not.toHaveAttribute('aria-valuenow')
        expect(progressbar).toHaveAttribute('aria-label', 'Loading')
    })

    it('applies custom aria-label', () => {
        render(<ProgressBar value={50} aria-label="Custom progress label" />)
        const progressbar = screen.getByRole('progressbar')
        expect(progressbar).toHaveAttribute(
            'aria-label',
            'Custom progress label'
        )
    })

    it('applies custom className', () => {
        const { container } = render(
            <ProgressBar value={50} className="custom-class" />
        )
        expect(container.querySelector('.custom-class')).toBeInTheDocument()
    })

    it('defaults to 100 for max value', () => {
        render(<ProgressBar value={50} />)
        const progressbar = screen.getByRole('progressbar')
        expect(progressbar).toHaveAttribute('aria-valuemax', '100')
    })

    it('rounds percentage for display', () => {
        render(
            <ProgressBar
                value={33.333333}
                showPercentage
                labelPosition="inside"
            />
        )
        expect(screen.getByText('33%')).toBeInTheDocument()
    })

    it('prioritizes custom label over percentage', () => {
        render(
            <ProgressBar
                value={50}
                label="Custom"
                showPercentage
                labelPosition="inside"
            />
        )
        expect(screen.getByText('Custom')).toBeInTheDocument()
        expect(screen.queryByText('50%')).not.toBeInTheDocument()
    })
})
