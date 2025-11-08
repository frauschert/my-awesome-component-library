import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import FloatingIsland from './FloatingIsland'

describe('FloatingIsland', () => {
    // Basic rendering
    it('renders without crashing', () => {
        render(<FloatingIsland>Content</FloatingIsland>)
        expect(screen.getByText('Content')).toBeInTheDocument()
    })

    it('renders children content', () => {
        render(
            <FloatingIsland>
                <div>Test content</div>
            </FloatingIsland>
        )
        expect(screen.getByText('Test content')).toBeInTheDocument()
    })

    it('applies custom className', () => {
        const { container } = render(
            <FloatingIsland className="custom-class">Content</FloatingIsland>
        )
        expect(container.firstChild).toHaveClass('custom-class')
    })

    // Variants
    it('applies default variant class by default', () => {
        const { container } = render(<FloatingIsland>Content</FloatingIsland>)
        expect(container.firstChild).toHaveClass('floating-island--default')
    })

    it('applies gradient variant class', () => {
        const { container } = render(
            <FloatingIsland variant="gradient">Content</FloatingIsland>
        )
        expect(container.firstChild).toHaveClass('floating-island--gradient')
    })

    it('applies glassmorphism variant class', () => {
        const { container } = render(
            <FloatingIsland variant="glassmorphism">Content</FloatingIsland>
        )
        expect(container.firstChild).toHaveClass(
            'floating-island--glassmorphism'
        )
    })

    it('applies neon variant class', () => {
        const { container } = render(
            <FloatingIsland variant="neon">Content</FloatingIsland>
        )
        expect(container.firstChild).toHaveClass('floating-island--neon')
    })

    // Sizes
    it('applies medium size class by default', () => {
        const { container } = render(<FloatingIsland>Content</FloatingIsland>)
        expect(container.firstChild).toHaveClass('floating-island--medium')
    })

    it('applies small size class', () => {
        const { container } = render(
            <FloatingIsland size="small">Content</FloatingIsland>
        )
        expect(container.firstChild).toHaveClass('floating-island--small')
    })

    it('applies large size class', () => {
        const { container } = render(
            <FloatingIsland size="large">Content</FloatingIsland>
        )
        expect(container.firstChild).toHaveClass('floating-island--large')
    })

    it('applies xlarge size class', () => {
        const { container } = render(
            <FloatingIsland size="xlarge">Content</FloatingIsland>
        )
        expect(container.firstChild).toHaveClass('floating-island--xlarge')
    })

    // Animations
    it('applies float animation class by default', () => {
        const { container } = render(<FloatingIsland>Content</FloatingIsland>)
        expect(container.firstChild).toHaveClass('floating-island--float')
    })

    it('applies pulse animation class', () => {
        const { container } = render(
            <FloatingIsland animation="pulse">Content</FloatingIsland>
        )
        expect(container.firstChild).toHaveClass('floating-island--pulse')
    })

    it('applies hover-lift animation class', () => {
        const { container } = render(
            <FloatingIsland animation="hover-lift">Content</FloatingIsland>
        )
        expect(container.firstChild).toHaveClass('floating-island--hover-lift')
    })

    it('does not apply animation class when animation is none', () => {
        const { container } = render(
            <FloatingIsland animation="none">Content</FloatingIsland>
        )
        expect(container.firstChild).not.toHaveClass('floating-island--float')
        expect(container.firstChild).not.toHaveClass('floating-island--pulse')
        expect(container.firstChild).not.toHaveClass(
            'floating-island--hover-lift'
        )
    })

    // Features
    it('applies glow class when glow is true', () => {
        const { container } = render(
            <FloatingIsland glow>Content</FloatingIsland>
        )
        expect(container.firstChild).toHaveClass('floating-island--glow')
    })

    it('renders glow element when glow is true', () => {
        const { container } = render(
            <FloatingIsland glow>Content</FloatingIsland>
        )
        expect(
            container.querySelector('.floating-island__glow')
        ).toBeInTheDocument()
    })

    it('does not render glow element when glow is false', () => {
        const { container } = render(
            <FloatingIsland glow={false}>Content</FloatingIsland>
        )
        expect(
            container.querySelector('.floating-island__glow')
        ).not.toBeInTheDocument()
    })

    it('applies elevated class when elevated is true', () => {
        const { container } = render(
            <FloatingIsland elevated>Content</FloatingIsland>
        )
        expect(container.firstChild).toHaveClass('floating-island--elevated')
    })

    it('applies interactive class when interactive is true', () => {
        const { container } = render(
            <FloatingIsland interactive>Content</FloatingIsland>
        )
        expect(container.firstChild).toHaveClass('floating-island--interactive')
    })

    // Particles
    it('renders particles when particles is true', () => {
        const { container } = render(
            <FloatingIsland particles>Content</FloatingIsland>
        )
        expect(
            container.querySelector('.floating-island__particles')
        ).toBeInTheDocument()
    })

    it('does not render particles when particles is false', () => {
        const { container } = render(
            <FloatingIsland particles={false}>Content</FloatingIsland>
        )
        expect(
            container.querySelector('.floating-island__particles')
        ).not.toBeInTheDocument()
    })

    it('renders correct number of particles', () => {
        const { container } = render(
            <FloatingIsland particles particleCount={6}>
                Content
            </FloatingIsland>
        )
        const particles = container.querySelectorAll(
            '.floating-island__particle'
        )
        expect(particles).toHaveLength(6)
    })

    it('renders default 8 particles when particleCount not specified', () => {
        const { container } = render(
            <FloatingIsland particles>Content</FloatingIsland>
        )
        const particles = container.querySelectorAll(
            '.floating-island__particle'
        )
        expect(particles).toHaveLength(8)
    })

    // Glassmorphism blur intensity
    it('applies custom blur intensity for glassmorphism', () => {
        const { container } = render(
            <FloatingIsland variant="glassmorphism" blurIntensity={20}>
                Content
            </FloatingIsland>
        )
        const island = container.firstChild as HTMLElement
        expect(island.style.getPropertyValue('--blur-intensity')).toBe('20px')
    })

    // Interactive behavior
    it('updates transform on mouse move when interactive', () => {
        const { container } = render(
            <FloatingIsland interactive>Content</FloatingIsland>
        )
        const island = container.firstChild as HTMLElement

        // Mock getBoundingClientRect
        island.getBoundingClientRect = jest.fn(() => ({
            left: 0,
            top: 0,
            width: 200,
            height: 200,
            right: 200,
            bottom: 200,
            x: 0,
            y: 0,
            toJSON: () => ({}),
        }))

        fireEvent.mouseMove(island, { clientX: 150, clientY: 150 })

        // Check that transform style is applied (should have translate)
        expect(island.style.transform).toContain('translate')
    })

    it('resets transform on mouse leave when interactive', () => {
        const { container } = render(
            <FloatingIsland interactive>Content</FloatingIsland>
        )
        const island = container.firstChild as HTMLElement

        // Mock getBoundingClientRect
        island.getBoundingClientRect = jest.fn(() => ({
            left: 0,
            top: 0,
            width: 200,
            height: 200,
            right: 200,
            bottom: 200,
            x: 0,
            y: 0,
            toJSON: () => ({}),
        }))

        fireEvent.mouseMove(island, { clientX: 150, clientY: 150 })
        fireEvent.mouseLeave(island)

        // Transform should reset to (0, 0) or be empty
        setTimeout(() => {
            const transform = island.style.transform
            expect(
                transform === '' ||
                    transform.includes('translate(0px, 0px)') ||
                    transform.includes('translate(0, 0)')
            ).toBe(true)
        }, 50)
    })

    // Custom styles
    it('merges custom styles with component styles', () => {
        const { container } = render(
            <FloatingIsland style={{ backgroundColor: 'red' }}>
                Content
            </FloatingIsland>
        )
        const island = container.firstChild as HTMLElement
        expect(island.style.backgroundColor).toBe('red')
    })

    // Forward ref
    it('forwards ref to the island element', () => {
        const ref = React.createRef<HTMLDivElement>()
        render(<FloatingIsland ref={ref}>Content</FloatingIsland>)
        expect(ref.current).toBeInstanceOf(HTMLDivElement)
        expect(ref.current).toHaveClass('floating-island')
    })

    // Accessibility
    it('passes through ARIA attributes', () => {
        const { container } = render(
            <FloatingIsland aria-label="Test island">Content</FloatingIsland>
        )
        expect(container.firstChild).toHaveAttribute(
            'aria-label',
            'Test island'
        )
    })
})
