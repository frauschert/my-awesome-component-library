import React from 'react'
import { render, screen } from '@testing-library/react'
import LaserSpinner from './LaserSpinner'

describe('LaserSpinner', () => {
    it('renders without crashing', () => {
        render(<LaserSpinner />)
        expect(screen.getByRole('status')).toBeInTheDocument()
    })

    it('has default accessible label', () => {
        render(<LaserSpinner />)
        expect(screen.getByLabelText('Loading')).toBeInTheDocument()
    })

    it('displays custom label', () => {
        render(<LaserSpinner label="Welding..." />)
        expect(screen.getByText('Welding...')).toBeInTheDocument()
        expect(screen.getByLabelText('Welding...')).toBeInTheDocument()
    })

    it('applies size class', () => {
        const { container } = render(<LaserSpinner size="lg" />)
        const spinner = container.querySelector('.laser-spinner')
        expect(spinner).toHaveClass('laser-spinner--lg')
    })

    it('applies variant class', () => {
        const { container } = render(<LaserSpinner variant="electric" />)
        const spinner = container.querySelector('.laser-spinner')
        expect(spinner).toHaveClass('laser-spinner--electric')
    })

    it('applies glow class when showGlow is true', () => {
        const { container } = render(<LaserSpinner showGlow />)
        const spinner = container.querySelector('.laser-spinner')
        expect(spinner).toHaveClass('laser-spinner--glow')
    })

    it('does not apply glow class when showGlow is false', () => {
        const { container } = render(<LaserSpinner showGlow={false} />)
        const spinner = container.querySelector('.laser-spinner')
        expect(spinner).not.toHaveClass('laser-spinner--glow')
    })

    it('applies custom className', () => {
        const { container } = render(
            <LaserSpinner className="custom-spinner" />
        )
        const spinner = container.querySelector('.laser-spinner')
        expect(spinner).toHaveClass('custom-spinner')
    })

    it('renders correct number of sparks', () => {
        const { container } = render(<LaserSpinner sparks={10} />)
        const sparkContainers = container.querySelectorAll(
            '.laser-spinner__spark-container'
        )
        expect(sparkContainers).toHaveLength(10)
    })

    it('renders default 8 sparks when not specified', () => {
        const { container } = render(<LaserSpinner />)
        const sparkContainers = container.querySelectorAll(
            '.laser-spinner__spark-container'
        )
        expect(sparkContainers).toHaveLength(8)
    })

    it('positions sparks with correct rotation', () => {
        const { container } = render(<LaserSpinner sparks={4} />)
        const sparkContainers = container.querySelectorAll(
            '.laser-spinner__spark-container'
        )

        expect(sparkContainers[0]).toHaveStyle({ transform: 'rotate(0deg)' })
        expect(sparkContainers[1]).toHaveStyle({ transform: 'rotate(90deg)' })
        expect(sparkContainers[2]).toHaveStyle({ transform: 'rotate(180deg)' })
        expect(sparkContainers[3]).toHaveStyle({ transform: 'rotate(270deg)' })
    })

    it('sets custom animation speed', () => {
        const { container } = render(<LaserSpinner speed={2000} />)
        const spinner = container.querySelector('.laser-spinner')
        expect(spinner).toHaveStyle({
            '--laser-spinner-speed': '2000ms',
        })
    })

    it('renders all structural elements', () => {
        const { container } = render(<LaserSpinner showGlow />)

        expect(
            container.querySelector('.laser-spinner__ring')
        ).toBeInTheDocument()
        expect(
            container.querySelector('.laser-spinner__glow')
        ).toBeInTheDocument()
        expect(
            container.querySelector('.laser-spinner__bloom')
        ).toBeInTheDocument()
        expect(
            container.querySelector('.laser-spinner__center')
        ).toBeInTheDocument()
        expect(
            container.querySelector('.laser-spinner__hotspot')
        ).toBeInTheDocument()
        expect(
            container.querySelector('.laser-spinner__sparks')
        ).toBeInTheDocument()
    })

    it('does not render glow elements when showGlow is false', () => {
        const { container } = render(<LaserSpinner showGlow={false} />)
        expect(
            container.querySelector('.laser-spinner__glow')
        ).not.toBeInTheDocument()
        expect(
            container.querySelector('.laser-spinner__bloom')
        ).not.toBeInTheDocument()
    })

    it('renders spark structure correctly', () => {
        const { container } = render(<LaserSpinner sparks={2} />)

        const sparkCores = container.querySelectorAll(
            '.laser-spinner__spark-core'
        )
        const sparkTrails = container.querySelectorAll(
            '.laser-spinner__spark-trail'
        )
        const sparkParticles = container.querySelectorAll(
            '.laser-spinner__spark-particle'
        )

        expect(sparkCores).toHaveLength(2)
        expect(sparkTrails).toHaveLength(2)
        expect(sparkParticles).toHaveLength(2)
    })

    it('does not render label when not provided', () => {
        const { container } = render(<LaserSpinner />)
        expect(
            container.querySelector('.laser-spinner__label')
        ).not.toBeInTheDocument()
    })

    it('has correct ARIA attributes', () => {
        render(<LaserSpinner label="Custom loading" />)
        const spinner = screen.getByRole('status')

        expect(spinner).toHaveAttribute('aria-live', 'polite')
        expect(spinner).toHaveAttribute('aria-label', 'Custom loading')
    })

    it('handles multiple size variants', () => {
        const sizes = ['sm', 'md', 'lg', 'xl'] as const

        sizes.forEach((size) => {
            const { container } = render(<LaserSpinner size={size} />)
            const spinner = container.querySelector('.laser-spinner')
            expect(spinner).toHaveClass(`laser-spinner--${size}`)
        })
    })

    it('handles multiple welding variants', () => {
        const variants = ['primary', 'hot', 'electric', 'plasma'] as const

        variants.forEach((variant) => {
            const { container } = render(<LaserSpinner variant={variant} />)
            const spinner = container.querySelector('.laser-spinner')
            expect(spinner).toHaveClass(`laser-spinner--${variant}`)
        })
    })

    it('handles edge case: few sparks', () => {
        const { container } = render(<LaserSpinner sparks={4} />)
        const sparkContainers = container.querySelectorAll(
            '.laser-spinner__spark-container'
        )
        expect(sparkContainers).toHaveLength(4)
    })

    it('handles edge case: many sparks', () => {
        const { container } = render(<LaserSpinner sparks={16} />)
        const sparkContainers = container.querySelectorAll(
            '.laser-spinner__spark-container'
        )
        expect(sparkContainers).toHaveLength(16)
    })
})
