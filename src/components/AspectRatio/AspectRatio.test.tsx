import React from 'react'
import { render, screen } from '@testing-library/react'
import AspectRatio from './AspectRatio'

describe('AspectRatio', () => {
    it('renders children', () => {
        render(
            <AspectRatio>
                <img src="test.jpg" alt="test" />
            </AspectRatio>
        )
        expect(screen.getByRole('img')).toBeInTheDocument()
    })

    it('applies default 16/9 ratio', () => {
        const { container } = render(<AspectRatio>content</AspectRatio>)
        const el = container.firstElementChild as HTMLElement
        expect(el.style.getPropertyValue('--aspect-ratio-padding')).toBe(
            '56.25%'
        )
    })

    it('applies custom ratio', () => {
        const { container } = render(
            <AspectRatio ratio={4 / 3}>content</AspectRatio>
        )
        const el = container.firstElementChild as HTMLElement
        expect(el.style.getPropertyValue('--aspect-ratio-padding')).toBe('75%')
    })

    it('applies 1:1 ratio', () => {
        const { container } = render(
            <AspectRatio ratio={1}>content</AspectRatio>
        )
        const el = container.firstElementChild as HTMLElement
        expect(el.style.getPropertyValue('--aspect-ratio-padding')).toBe('100%')
    })

    it('forwards ref', () => {
        const ref = React.createRef<HTMLDivElement>()
        render(<AspectRatio ref={ref}>content</AspectRatio>)
        expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })

    it('applies custom className', () => {
        const { container } = render(
            <AspectRatio className="custom">content</AspectRatio>
        )
        expect(container.firstElementChild).toHaveClass(
            'aspect-ratio',
            'custom'
        )
    })

    it('merges custom style', () => {
        const { container } = render(
            <AspectRatio style={{ border: '1px solid red' }}>
                content
            </AspectRatio>
        )
        const el = container.firstElementChild as HTMLElement
        expect(el.style.border).toBe('1px solid red')
    })

    it('passes through additional HTML attributes', () => {
        render(
            <AspectRatio data-testid="aspect" role="img" aria-label="photo">
                content
            </AspectRatio>
        )
        const el = screen.getByTestId('aspect')
        expect(el).toHaveAttribute('role', 'img')
        expect(el).toHaveAttribute('aria-label', 'photo')
    })
})
