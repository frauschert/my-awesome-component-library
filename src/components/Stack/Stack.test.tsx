import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Stack from '../Stack'

describe('Stack', () => {
    it('renders children', () => {
        render(
            <Stack>
                <div data-testid="child">Child</div>
            </Stack>
        )
        expect(screen.getByTestId('child')).toBeInTheDocument()
    })

    it('applies vertical direction by default', () => {
        const { container } = render(<Stack>Content</Stack>)
        expect(container.firstChild).toHaveClass('stack--vertical')
    })

    it('applies horizontal direction', () => {
        const { container } = render(
            <Stack direction="horizontal">Content</Stack>
        )
        expect(container.firstChild).toHaveClass('stack--horizontal')
    })

    it('applies responsive direction', () => {
        const { container } = render(
            <Stack direction={{ xs: 'vertical', md: 'horizontal' }}>
                Content
            </Stack>
        )
        const stack = container.firstChild
        expect(stack).toHaveClass('stack--xs-vertical')
        expect(stack).toHaveClass('stack--md-horizontal')
    })

    it('applies gap size', () => {
        const { container } = render(<Stack gap="xl">Content</Stack>)
        expect(container.firstChild).toHaveClass('stack--gap-xl')
    })

    it('applies alignment', () => {
        const { container } = render(<Stack align="center">Content</Stack>)
        expect(container.firstChild).toHaveClass('stack--align-center')
    })

    it('applies justify', () => {
        const { container } = render(
            <Stack justify="space-between">Content</Stack>
        )
        expect(container.firstChild).toHaveClass('stack--justify-space-between')
    })

    it('applies wrap', () => {
        const { container } = render(<Stack wrap>Content</Stack>)
        expect(container.firstChild).toHaveClass('stack--wrap')
    })

    it('applies reverse', () => {
        const { container } = render(<Stack reverse>Content</Stack>)
        expect(container.firstChild).toHaveClass('stack--reverse')
    })

    it('applies fill', () => {
        const { container } = render(<Stack fill>Content</Stack>)
        expect(container.firstChild).toHaveClass('stack--fill')
    })

    it('applies custom className', () => {
        const { container } = render(<Stack className="custom">Content</Stack>)
        expect(container.firstChild).toHaveClass('stack')
        expect(container.firstChild).toHaveClass('custom')
    })

    it('renders as custom element', () => {
        const { container } = render(<Stack as="section">Content</Stack>)
        expect(container.firstChild?.nodeName).toBe('SECTION')
    })

    it('renders dividers between items', () => {
        const { container } = render(
            <Stack divider={<hr />}>
                <div>Item 1</div>
                <div>Item 2</div>
                <div>Item 3</div>
            </Stack>
        )
        const dividers = container.querySelectorAll('.stack__divider')
        expect(dividers).toHaveLength(2) // Between 3 items, 2 dividers
    })

    it('does not render divider after last item', () => {
        const { container } = render(
            <Stack divider={<hr />}>
                <div>Single Item</div>
            </Stack>
        )
        const dividers = container.querySelectorAll('.stack__divider')
        expect(dividers).toHaveLength(0)
    })
})
