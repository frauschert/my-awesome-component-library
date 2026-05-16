import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Drawer } from './Drawer'

describe('Drawer', () => {
    const defaultProps = {
        isOpen: true,
        onClose: jest.fn(),
        children: <div>Drawer content</div>,
    }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    afterEach(() => {
        // Clean up body overflow style
        document.body.style.overflow = ''
    })

    it('renders when open', () => {
        render(<Drawer {...defaultProps} />)
        expect(screen.getByText('Drawer content')).toBeInTheDocument()
    })

    it('does not render when closed', () => {
        render(<Drawer {...defaultProps} isOpen={false} />)
        expect(screen.queryByText('Drawer content')).not.toBeInTheDocument()
    })

    it('renders title when provided', () => {
        render(<Drawer {...defaultProps} title="My Drawer" />)
        expect(screen.getByText('My Drawer')).toBeInTheDocument()
    })

    it('renders close button by default', () => {
        render(<Drawer {...defaultProps} title="Test" />)
        expect(
            screen.getByRole('button', { name: 'Close drawer' })
        ).toBeInTheDocument()
    })

    it('hides close button when showCloseButton is false', () => {
        render(<Drawer {...defaultProps} showCloseButton={false} />)
        expect(
            screen.queryByRole('button', { name: 'Close drawer' })
        ).not.toBeInTheDocument()
    })

    it('calls onClose when close button is clicked', async () => {
        const user = userEvent.setup()
        const onClose = jest.fn()
        render(<Drawer {...defaultProps} onClose={onClose} title="Test" />)

        const closeButton = screen.getByRole('button', { name: 'Close drawer' })
        await user.click(closeButton)

        expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('calls onClose when Escape is pressed', async () => {
        const user = userEvent.setup()
        const onClose = jest.fn()
        render(<Drawer {...defaultProps} onClose={onClose} />)

        await user.keyboard('{Escape}')

        expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('does not call onClose when Escape is pressed if closeOnEscape is false', async () => {
        const user = userEvent.setup()
        const onClose = jest.fn()
        render(
            <Drawer {...defaultProps} onClose={onClose} closeOnEscape={false} />
        )

        await user.keyboard('{Escape}')

        expect(onClose).not.toHaveBeenCalled()
    })

    it('calls onClose when backdrop is clicked', async () => {
        const user = userEvent.setup()
        const onClose = jest.fn()
        render(<Drawer {...defaultProps} onClose={onClose} />)

        const overlay = screen.getByRole('presentation')
        await user.click(overlay)

        expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('does not call onClose when backdrop is clicked if closeOnBackdropClick is false', async () => {
        const user = userEvent.setup()
        const onClose = jest.fn()
        render(
            <Drawer
                {...defaultProps}
                onClose={onClose}
                closeOnBackdropClick={false}
            />
        )

        const overlay = screen.getByRole('presentation')
        await user.click(overlay)

        expect(onClose).not.toHaveBeenCalled()
    })

    it('applies correct placement class', () => {
        const { rerender } = render(
            <Drawer {...defaultProps} placement="left" />
        )
        expect(screen.getByRole('dialog')).toHaveClass('drawer--left')

        rerender(<Drawer {...defaultProps} placement="right" />)
        expect(screen.getByRole('dialog')).toHaveClass('drawer--right')

        rerender(<Drawer {...defaultProps} placement="top" />)
        expect(screen.getByRole('dialog')).toHaveClass('drawer--top')

        rerender(<Drawer {...defaultProps} placement="bottom" />)
        expect(screen.getByRole('dialog')).toHaveClass('drawer--bottom')
    })

    it('applies custom className', () => {
        render(<Drawer {...defaultProps} className="custom-drawer" />)
        expect(screen.getByRole('dialog')).toHaveClass('custom-drawer')
    })

    it('prevents body scroll when open', () => {
        render(<Drawer {...defaultProps} />)
        expect(document.body.style.overflow).toBe('hidden')
    })

    it('restores body scroll when closed', () => {
        const { rerender } = render(<Drawer {...defaultProps} />)
        expect(document.body.style.overflow).toBe('hidden')

        rerender(<Drawer {...defaultProps} isOpen={false} />)
        expect(document.body.style.overflow).toBe('')
    })

    it('has proper accessibility attributes', () => {
        render(<Drawer {...defaultProps} title="Test Drawer" />)
        const dialog = screen.getByRole('dialog')

        expect(dialog).toHaveAttribute('aria-modal', 'true')
        expect(dialog).toHaveAttribute('aria-label', 'Test Drawer')
        expect(dialog).toHaveAttribute('tabIndex', '-1')
    })

    it('uses default aria-label when no title provided', () => {
        render(<Drawer {...defaultProps} />)
        const dialog = screen.getByRole('dialog')

        expect(dialog).toHaveAttribute('aria-label', 'Drawer')
    })
})
