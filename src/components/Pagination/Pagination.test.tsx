import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Pagination from './Pagination'

describe('Pagination', () => {
    const onChange = jest.fn()

    beforeEach(() => onChange.mockClear())

    it('renders the correct page buttons for small page count', () => {
        render(<Pagination page={1} totalPages={5} onPageChange={onChange} />)
        expect(screen.getByLabelText('Page 1')).toBeInTheDocument()
        expect(screen.getByLabelText('Page 5')).toBeInTheDocument()
    })

    it('marks current page with aria-current', () => {
        render(<Pagination page={3} totalPages={5} onPageChange={onChange} />)
        expect(screen.getByLabelText('Page 3')).toHaveAttribute(
            'aria-current',
            'page'
        )
    })

    it('calls onPageChange when a page button is clicked', () => {
        render(<Pagination page={1} totalPages={5} onPageChange={onChange} />)
        fireEvent.click(screen.getByLabelText('Page 3'))
        expect(onChange).toHaveBeenCalledWith(3)
    })

    it('calls onPageChange with next page on next button click', () => {
        render(<Pagination page={2} totalPages={5} onPageChange={onChange} />)
        fireEvent.click(screen.getByLabelText('Next page'))
        expect(onChange).toHaveBeenCalledWith(3)
    })

    it('calls onPageChange with previous page on prev button click', () => {
        render(<Pagination page={3} totalPages={5} onPageChange={onChange} />)
        fireEvent.click(screen.getByLabelText('Previous page'))
        expect(onChange).toHaveBeenCalledWith(2)
    })

    it('disables prev/first buttons on first page', () => {
        render(<Pagination page={1} totalPages={5} onPageChange={onChange} />)
        expect(screen.getByLabelText('Previous page')).toBeDisabled()
        expect(screen.getByLabelText('First page')).toBeDisabled()
    })

    it('disables next/last buttons on last page', () => {
        render(<Pagination page={5} totalPages={5} onPageChange={onChange} />)
        expect(screen.getByLabelText('Next page')).toBeDisabled()
        expect(screen.getByLabelText('Last page')).toBeDisabled()
    })

    it('does not call onPageChange when clicking current page', () => {
        render(<Pagination page={2} totalPages={5} onPageChange={onChange} />)
        fireEvent.click(screen.getByLabelText('Page 2'))
        expect(onChange).not.toHaveBeenCalled()
    })

    it('does not render first/last buttons when showFirstLast is false', () => {
        render(
            <Pagination
                page={1}
                totalPages={5}
                onPageChange={onChange}
                showFirstLast={false}
            />
        )
        expect(screen.queryByLabelText('First page')).not.toBeInTheDocument()
        expect(screen.queryByLabelText('Last page')).not.toBeInTheDocument()
    })

    it('shows dots for large page counts', () => {
        render(<Pagination page={5} totalPages={20} onPageChange={onChange} />)
        expect(screen.getAllByText('…').length).toBeGreaterThan(0)
    })

    it('is disabled when disabled prop is set', () => {
        render(
            <Pagination
                page={3}
                totalPages={5}
                onPageChange={onChange}
                disabled
            />
        )
        fireEvent.click(screen.getByLabelText('Page 1'))
        expect(onChange).not.toHaveBeenCalled()
    })

    it('navigates to first page via first button', () => {
        render(<Pagination page={4} totalPages={5} onPageChange={onChange} />)
        fireEvent.click(screen.getByLabelText('First page'))
        expect(onChange).toHaveBeenCalledWith(1)
    })

    it('navigates to last page via last button', () => {
        render(<Pagination page={2} totalPages={5} onPageChange={onChange} />)
        fireEvent.click(screen.getByLabelText('Last page'))
        expect(onChange).toHaveBeenCalledWith(5)
    })
})
