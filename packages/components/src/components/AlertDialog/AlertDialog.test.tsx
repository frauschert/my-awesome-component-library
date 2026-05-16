import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'
import AlertDialog from './AlertDialog'

describe('AlertDialog', () => {
    const defaultProps = {
        open: true,
        onClose: jest.fn(),
        onConfirm: jest.fn(),
        title: 'Delete item?',
        description: 'This action cannot be undone.',
    }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('should render title and description', () => {
        render(<AlertDialog {...defaultProps} />)
        expect(screen.getByText('Delete item?')).toBeInTheDocument()
        expect(
            screen.getByText('This action cannot be undone.')
        ).toBeInTheDocument()
    })

    it('should not render when closed', () => {
        render(<AlertDialog {...defaultProps} open={false} />)
        expect(screen.queryByText('Delete item?')).not.toBeInTheDocument()
    })

    it('should call onConfirm when confirm button is clicked', () => {
        render(<AlertDialog {...defaultProps} />)
        fireEvent.click(screen.getByTestId('alert-dialog-confirm'))
        expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1)
    })

    it('should call onClose when cancel button is clicked', () => {
        render(<AlertDialog {...defaultProps} />)
        fireEvent.click(screen.getByTestId('alert-dialog-cancel'))
        expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
    })

    it('should render custom button labels', () => {
        render(
            <AlertDialog
                {...defaultProps}
                confirmLabel="Yes, delete"
                cancelLabel="No, keep"
            />
        )
        expect(screen.getByText('Yes, delete')).toBeInTheDocument()
        expect(screen.getByText('No, keep')).toBeInTheDocument()
    })

    it('should render default button labels', () => {
        render(<AlertDialog {...defaultProps} />)
        expect(screen.getByText('Confirm')).toBeInTheDocument()
        expect(screen.getByText('Cancel')).toBeInTheDocument()
    })

    it('should show loading state', () => {
        render(<AlertDialog {...defaultProps} loading />)
        expect(screen.getByText('Loading…')).toBeInTheDocument()
    })

    it('should not call onConfirm when loading', () => {
        render(<AlertDialog {...defaultProps} loading />)
        fireEvent.click(screen.getByTestId('alert-dialog-confirm'))
        expect(defaultProps.onConfirm).not.toHaveBeenCalled()
    })

    it('should render icon when provided', () => {
        render(
            <AlertDialog
                {...defaultProps}
                icon={<span data-testid="icon">⚠️</span>}
            />
        )
        expect(screen.getByTestId('icon')).toBeInTheDocument()
    })

    it('should use alertdialog role', () => {
        render(<AlertDialog {...defaultProps} />)
        expect(screen.getByRole('alertdialog')).toBeInTheDocument()
    })

    it('should have no accessibility violations', async () => {
        const { container } = render(<AlertDialog {...defaultProps} />)
        const results = await axe(container)
        expect(results).toHaveNoViolations()
    })
})
