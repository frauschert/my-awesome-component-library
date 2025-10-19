import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Chip } from './Chip'

describe('Chip', () => {
    it('renders with label', () => {
        render(<Chip label="Test Chip" />)
        expect(screen.getByText('Test Chip')).toBeInTheDocument()
    })

    it('applies variant classes', () => {
        const { container, rerender } = render(
            <Chip label="Test" variant="filled" />
        )
        expect(container.querySelector('.chip--filled')).toBeInTheDocument()

        rerender(<Chip label="Test" variant="outlined" />)
        expect(container.querySelector('.chip--outlined')).toBeInTheDocument()

        rerender(<Chip label="Test" variant="light" />)
        expect(container.querySelector('.chip--light')).toBeInTheDocument()
    })

    it('applies color classes', () => {
        const { container, rerender } = render(
            <Chip label="Test" color="primary" />
        )
        expect(container.querySelector('.chip--primary')).toBeInTheDocument()

        rerender(<Chip label="Test" color="success" />)
        expect(container.querySelector('.chip--success')).toBeInTheDocument()

        rerender(<Chip label="Test" color="danger" />)
        expect(container.querySelector('.chip--danger')).toBeInTheDocument()
    })

    it('applies size classes', () => {
        const { container, rerender } = render(
            <Chip label="Test" size="small" />
        )
        expect(container.querySelector('.chip--small')).toBeInTheDocument()

        rerender(<Chip label="Test" size="large" />)
        expect(container.querySelector('.chip--large')).toBeInTheDocument()
    })

    it('renders icon when provided', () => {
        const { container } = render(
            <Chip label="Test" icon={<span data-testid="icon">Icon</span>} />
        )
        expect(screen.getByTestId('icon')).toBeInTheDocument()
        expect(container.querySelector('.chip--has-icon')).toBeInTheDocument()
    })

    it('renders avatar when provided', () => {
        const { container } = render(
            <Chip label="Test" avatar={<span data-testid="avatar">JD</span>} />
        )
        expect(screen.getByTestId('avatar')).toBeInTheDocument()
        expect(container.querySelector('.chip__avatar')).toBeInTheDocument()
    })

    it('prioritizes avatar over icon', () => {
        render(
            <Chip
                label="Test"
                avatar={<span data-testid="avatar">JD</span>}
                icon={<span data-testid="icon">Icon</span>}
            />
        )
        expect(screen.getByTestId('avatar')).toBeInTheDocument()
        expect(screen.queryByTestId('icon')).not.toBeInTheDocument()
    })

    it('renders dismiss button when dismissible', () => {
        render(<Chip label="Test" dismissible />)
        expect(screen.getByLabelText('Remove Test')).toBeInTheDocument()
    })

    it('calls onDismiss when dismiss button is clicked', async () => {
        const user = userEvent.setup()
        const handleDismiss = jest.fn()
        render(<Chip label="Test" dismissible onDismiss={handleDismiss} />)

        const dismissButton = screen.getByLabelText('Remove Test')
        await user.click(dismissButton)

        expect(handleDismiss).toHaveBeenCalledTimes(1)
    })

    it('calls onClick when chip is clicked', async () => {
        const user = userEvent.setup()
        const handleClick = jest.fn()
        render(<Chip label="Test" onClick={handleClick} />)

        const chip = screen.getByText('Test').closest('.chip') as HTMLElement
        await user.click(chip)

        expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('does not call onClick when dismiss button is clicked', async () => {
        const user = userEvent.setup()
        const handleClick = jest.fn()
        const handleDismiss = jest.fn()
        render(
            <Chip
                label="Test"
                onClick={handleClick}
                dismissible
                onDismiss={handleDismiss}
            />
        )

        const dismissButton = screen.getByLabelText('Remove Test')
        await user.click(dismissButton)

        expect(handleDismiss).toHaveBeenCalledTimes(1)
        expect(handleClick).not.toHaveBeenCalled()
    })

    it('applies clickable class when onClick is provided', () => {
        const { container } = render(<Chip label="Test" onClick={() => {}} />)
        expect(container.querySelector('.chip--clickable')).toBeInTheDocument()
    })

    it('has button role when clickable', () => {
        render(<Chip label="Test" onClick={() => {}} />)
        expect(screen.getByRole('button', { name: 'Test' })).toBeInTheDocument()
    })

    it('has tabIndex 0 when clickable and not disabled', () => {
        const { container } = render(<Chip label="Test" onClick={() => {}} />)
        const chip = container.querySelector('.chip')
        expect(chip).toHaveAttribute('tabIndex', '0')
    })

    it('responds to Enter key when clickable', async () => {
        const user = userEvent.setup()
        const handleClick = jest.fn()
        render(<Chip label="Test" onClick={handleClick} />)

        const chip = screen.getByRole('button', { name: 'Test' })
        chip.focus()
        await user.keyboard('{Enter}')

        expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('responds to Space key when clickable', async () => {
        const user = userEvent.setup()
        const handleClick = jest.fn()
        render(<Chip label="Test" onClick={handleClick} />)

        const chip = screen.getByRole('button', { name: 'Test' })
        chip.focus()
        await user.keyboard(' ')

        expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('applies selected class when selected', () => {
        const { container } = render(<Chip label="Test" selected />)
        expect(container.querySelector('.chip--selected')).toBeInTheDocument()
    })

    it('applies disabled class when disabled', () => {
        const { container } = render(<Chip label="Test" disabled />)
        expect(container.querySelector('.chip--disabled')).toBeInTheDocument()
    })

    it('does not call onClick when disabled', async () => {
        const user = userEvent.setup()
        const handleClick = jest.fn()
        render(<Chip label="Test" onClick={handleClick} disabled />)

        const chip = screen.getByText('Test').closest('.chip') as HTMLElement
        await user.click(chip)

        expect(handleClick).not.toHaveBeenCalled()
    })

    it('disables dismiss button when chip is disabled', () => {
        render(<Chip label="Test" dismissible disabled />)
        const dismissButton = screen.getByLabelText('Remove Test')
        expect(dismissButton).toBeDisabled()
    })

    it('applies custom className', () => {
        const { container } = render(
            <Chip label="Test" className="custom-class" />
        )
        expect(container.querySelector('.custom-class')).toBeInTheDocument()
    })

    it('applies custom aria-label', () => {
        render(
            <Chip label="Test" onClick={() => {}} aria-label="Custom Label" />
        )
        expect(
            screen.getByRole('button', { name: 'Custom Label' })
        ).toBeInTheDocument()
    })

    it('applies aria-disabled attribute when disabled', () => {
        const { container } = render(<Chip label="Test" disabled />)
        const chip = container.querySelector('.chip')
        expect(chip).toHaveAttribute('aria-disabled', 'true')
    })

    it('renders dismissible chip with all variants', () => {
        const { rerender } = render(
            <Chip label="Test" dismissible variant="filled" />
        )
        expect(screen.getByLabelText('Remove Test')).toBeInTheDocument()

        rerender(<Chip label="Test" dismissible variant="outlined" />)
        expect(screen.getByLabelText('Remove Test')).toBeInTheDocument()

        rerender(<Chip label="Test" dismissible variant="light" />)
        expect(screen.getByLabelText('Remove Test')).toBeInTheDocument()
    })

    it('renders with icon and dismissible', () => {
        render(
            <Chip
                label="Test"
                icon={<span data-testid="icon">Icon</span>}
                dismissible
            />
        )
        expect(screen.getByTestId('icon')).toBeInTheDocument()
        expect(screen.getByLabelText('Remove Test')).toBeInTheDocument()
    })
})
