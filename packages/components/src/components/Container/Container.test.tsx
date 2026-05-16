import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Container from '../Container'

describe('Container', () => {
    it('renders children', () => {
        render(
            <Container>
                <div data-testid="child">Child</div>
            </Container>
        )
        expect(screen.getByTestId('child')).toBeInTheDocument()
    })

    it('applies default size', () => {
        const { container } = render(<Container>Content</Container>)
        expect(container.firstChild).toHaveClass('container--lg')
    })

    it('applies custom size', () => {
        const { container } = render(<Container size="md">Content</Container>)
        expect(container.firstChild).toHaveClass('container--md')
    })

    it('applies small size', () => {
        const { container } = render(<Container size="sm">Content</Container>)
        expect(container.firstChild).toHaveClass('container--sm')
    })

    it('applies extra large size', () => {
        const { container } = render(<Container size="xl">Content</Container>)
        expect(container.firstChild).toHaveClass('container--xl')
    })

    it('applies full size', () => {
        const { container } = render(<Container size="full">Content</Container>)
        expect(container.firstChild).toHaveClass('container--full')
    })

    it('centers by default', () => {
        const { container } = render(<Container>Content</Container>)
        expect(container.firstChild).toHaveClass('container--center')
    })

    it('does not center when center is false', () => {
        const { container } = render(
            <Container center={false}>Content</Container>
        )
        expect(container.firstChild).not.toHaveClass('container--center')
    })

    it('applies gutter by default', () => {
        const { container } = render(<Container>Content</Container>)
        expect(container.firstChild).toHaveClass('container--gutter')
    })

    it('does not apply gutter when gutter is false', () => {
        const { container } = render(
            <Container gutter={false}>Content</Container>
        )
        expect(container.firstChild).not.toHaveClass('container--gutter')
    })

    it('applies fluid class', () => {
        const { container } = render(<Container fluid>Content</Container>)
        expect(container.firstChild).toHaveClass('container--fluid')
    })

    it('does not apply size class when fluid', () => {
        const { container } = render(
            <Container fluid size="lg">
                Content
            </Container>
        )
        expect(container.firstChild).toHaveClass('container--fluid')
        expect(container.firstChild).not.toHaveClass('container--lg')
    })

    it('applies custom className', () => {
        const { container } = render(
            <Container className="custom">Content</Container>
        )
        expect(container.firstChild).toHaveClass('container')
        expect(container.firstChild).toHaveClass('custom')
    })

    it('renders as custom element', () => {
        const { container } = render(
            <Container as="section">Content</Container>
        )
        expect(container.firstChild?.nodeName).toBe('SECTION')
    })

    it('applies inline styles', () => {
        const { container } = render(
            <Container style={{ backgroundColor: 'red' }}>Content</Container>
        )
        const containerElement = container.firstChild as HTMLElement
        expect(containerElement.style.backgroundColor).toBe('red')
    })
})
