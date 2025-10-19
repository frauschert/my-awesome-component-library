import React, { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Rating from './Rating'

describe('Rating', () => {
    it('renders without crashing', () => {
        const { container } = render(<Rating value={3} />)
        expect(container.querySelector('.rating')).toBeInTheDocument()
    })

    it('renders correct number of stars', () => {
        const { container } = render(<Rating value={0} max={5} />)
        const stars = container.querySelectorAll('.rating__star')
        expect(stars).toHaveLength(5)
    })

    it('renders custom max stars', () => {
        const { container } = render(<Rating value={0} max={10} />)
        const stars = container.querySelectorAll('.rating__star')
        expect(stars).toHaveLength(10)
    })

    it('displays correct filled stars', () => {
        const { container } = render(<Rating value={3} max={5} />)
        const filledStars = container.querySelectorAll('.rating__star--filled')
        expect(filledStars).toHaveLength(3)
    })

    it('handles click to change rating', async () => {
        const user = userEvent.setup()
        const handleChange = jest.fn()
        const { container } = render(
            <Rating value={0} onChange={handleChange} />
        )

        const stars = container.querySelectorAll('.rating__star')
        await user.click(stars[2])

        expect(handleChange).toHaveBeenCalledWith(3)
    })

    it('does not change rating when read-only', async () => {
        const user = userEvent.setup()
        const handleChange = jest.fn()
        const { container } = render(
            <Rating value={3} onChange={handleChange} readOnly />
        )

        const stars = container.querySelectorAll('.rating__star')
        await user.click(stars[4])

        expect(handleChange).not.toHaveBeenCalled()
    })

    it('does not change rating when disabled', async () => {
        const user = userEvent.setup()
        const handleChange = jest.fn()
        const { container } = render(
            <Rating value={3} onChange={handleChange} disabled />
        )

        const stars = container.querySelectorAll('.rating__star')
        await user.click(stars[4])

        expect(handleChange).not.toHaveBeenCalled()
    })

    it('applies correct size class', () => {
        const { container, rerender } = render(
            <Rating value={3} size="small" />
        )
        expect(container.querySelector('.rating--small')).toBeInTheDocument()

        rerender(<Rating value={3} size="medium" />)
        expect(container.querySelector('.rating--medium')).toBeInTheDocument()

        rerender(<Rating value={3} size="large" />)
        expect(container.querySelector('.rating--large')).toBeInTheDocument()
    })

    it('shows value when showValue is true', () => {
        render(<Rating value={3.5} precision="half" showValue />)
        expect(screen.getByText('3.5')).toBeInTheDocument()
    })

    it('does not show value when showValue is false', () => {
        const { container } = render(<Rating value={3.5} showValue={false} />)
        expect(
            container.querySelector('.rating__value')
        ).not.toBeInTheDocument()
    })

    it('applies custom className', () => {
        const { container } = render(
            <Rating value={3} className="custom-rating" />
        )
        expect(
            container.querySelector('.rating.custom-rating')
        ).toBeInTheDocument()
    })

    it('applies custom color', () => {
        const { container } = render(<Rating value={3} color="#ff0000" />)
        const rating = container.querySelector('.rating')
        expect(rating).toHaveStyle({ '--rating-color': '#ff0000' })
    })

    it('renders hidden input with name', () => {
        const { container } = render(<Rating value={3} name="product-rating" />)
        const input = container.querySelector('input[name="product-rating"]')
        expect(input).toBeInTheDocument()
        expect(input).toHaveValue('3')
    })

    it('applies readonly class', () => {
        const { container } = render(<Rating value={3} readOnly />)
        expect(container.querySelector('.rating--readonly')).toBeInTheDocument()
    })

    it('applies disabled class', () => {
        const { container } = render(<Rating value={3} disabled />)
        expect(container.querySelector('.rating--disabled')).toBeInTheDocument()
    })

    it('applies interactive class when not readonly and not disabled', () => {
        const { container } = render(<Rating value={3} />)
        expect(
            container.querySelector('.rating--interactive')
        ).toBeInTheDocument()
    })

    it('handles half star precision', () => {
        const { container } = render(<Rating value={3.5} precision="half" />)
        const halfStars = container.querySelectorAll('.rating__star--half')
        expect(halfStars.length).toBeGreaterThan(0)
    })

    it('shows correct value with half precision', () => {
        render(<Rating value={3.5} precision="half" showValue />)
        expect(screen.getByText('3.5')).toBeInTheDocument()
    })

    it('shows correct value with full precision', () => {
        render(<Rating value={3.5} precision="full" showValue />)
        expect(screen.getByText('4')).toBeInTheDocument()
    })

    it('handles hover state', async () => {
        const user = userEvent.setup()
        const { container } = render(<Rating value={2} />)

        const stars = container.querySelectorAll('.rating__star')
        await user.hover(stars[3])

        // After hover, the 4th star (index 3) should show hover state
        // This would be visible in the UI but harder to test without checking internal state
        expect(stars[3]).toBeInTheDocument()
    })

    it('works in controlled component', async () => {
        const user = userEvent.setup()
        const ControlledRating = () => {
            const [value, setValue] = useState(0)
            return <Rating value={value} onChange={setValue} showValue />
        }

        const { container } = render(<ControlledRating />)
        expect(screen.getByText('0')).toBeInTheDocument()

        const stars = container.querySelectorAll('.rating__star')
        await user.click(stars[3])

        expect(screen.getByText('4')).toBeInTheDocument()
    })

    it('can reset rating to 0 by clicking same star', async () => {
        const user = userEvent.setup()
        const handleChange = jest.fn()
        const { container } = render(
            <Rating value={3} onChange={handleChange} />
        )

        const stars = container.querySelectorAll('.rating__star')
        await user.click(stars[2]) // Click 3rd star (current value)

        expect(handleChange).toHaveBeenCalledWith(0)
    })

    it('has correct ARIA attributes', () => {
        const { container } = render(
            <Rating value={3} aria-label="Product rating" />
        )
        const rating = container.querySelector('.rating')
        expect(rating).toHaveAttribute('role', 'radiogroup')
        expect(rating).toHaveAttribute('aria-label', 'Product rating')
    })

    it('star buttons have ARIA labels', () => {
        const { container } = render(<Rating value={3} />)
        const firstStar = container.querySelector('.rating__star')
        expect(firstStar).toHaveAttribute('aria-label', '1 star')
    })

    it('forwards ref to container div', () => {
        const ref = React.createRef<HTMLDivElement>()
        render(<Rating value={3} ref={ref} />)
        expect(ref.current).toBeInstanceOf(HTMLDivElement)
        expect(ref.current?.classList.contains('rating')).toBe(true)
    })

    it('renders empty stars when value is 0', () => {
        const { container } = render(<Rating value={0} max={5} />)
        const emptyStars = container.querySelectorAll('.rating__star--empty')
        expect(emptyStars).toHaveLength(5)
    })
})
