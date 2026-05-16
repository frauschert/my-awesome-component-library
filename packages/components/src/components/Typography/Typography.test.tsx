import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import Typography from './Typography'

describe('Typography', () => {
    it('renders children correctly', () => {
        render(<Typography>Test text</Typography>)
        expect(screen.getByText('Test text')).toBeInTheDocument()
    })

    it('applies default variant body1', () => {
        render(<Typography>Test</Typography>)
        const element = screen.getByText('Test')
        expect(element).toHaveClass('typography--body1')
    })

    it('renders correct HTML element for h1 variant', () => {
        render(<Typography variant="h1">Heading 1</Typography>)
        const element = screen.getByText('Heading 1')
        expect(element.tagName).toBe('H1')
    })

    it('renders correct HTML element for h2 variant', () => {
        render(<Typography variant="h2">Heading 2</Typography>)
        const element = screen.getByText('Heading 2')
        expect(element.tagName).toBe('H2')
    })

    it('renders correct HTML element for body1 variant', () => {
        render(<Typography variant="body1">Body text</Typography>)
        const element = screen.getByText('Body text')
        expect(element.tagName).toBe('P')
    })

    it('renders custom component when specified', () => {
        render(
            <Typography variant="h1" component="div">
                Custom div
            </Typography>
        )
        const element = screen.getByText('Custom div')
        expect(element.tagName).toBe('DIV')
        expect(element).toHaveClass('typography--h1')
    })

    it('applies alignment classes', () => {
        const { rerender } = render(
            <Typography align="center">Centered</Typography>
        )
        expect(screen.getByText('Centered')).toHaveClass(
            'typography--align-center'
        )

        rerender(<Typography align="right">Right</Typography>)
        expect(screen.getByText('Right')).toHaveClass('typography--align-right')
    })

    it('applies color classes', () => {
        const { rerender } = render(
            <Typography color="primary">Primary</Typography>
        )
        expect(screen.getByText('Primary')).toHaveClass(
            'typography--color-primary'
        )

        rerender(<Typography color="error">Error</Typography>)
        expect(screen.getByText('Error')).toHaveClass('typography--color-error')
    })

    it('applies weight classes', () => {
        render(<Typography weight="bold">Bold text</Typography>)
        expect(screen.getByText('Bold text')).toHaveClass(
            'typography--weight-bold'
        )
    })

    it('applies noWrap class when specified', () => {
        render(<Typography noWrap>No wrap text</Typography>)
        expect(screen.getByText('No wrap text')).toHaveClass(
            'typography--no-wrap'
        )
    })

    it('applies gutterBottom class when specified', () => {
        render(<Typography gutterBottom>Gutter bottom</Typography>)
        expect(screen.getByText('Gutter bottom')).toHaveClass(
            'typography--gutter-bottom'
        )
    })

    it('applies custom className', () => {
        render(<Typography className="custom-class">Custom</Typography>)
        expect(screen.getByText('Custom')).toHaveClass('custom-class')
    })

    it('applies inline styles', () => {
        render(
            <Typography style={{ fontSize: '20px' }}>Styled text</Typography>
        )
        const element = screen.getByText('Styled text')
        expect(element).toHaveStyle({ fontSize: '20px' })
    })

    it('handles click events', async () => {
        const handleClick = jest.fn()
        const user = userEvent.setup()

        render(<Typography onClick={handleClick}>Clickable</Typography>)

        await user.click(screen.getByText('Clickable'))
        expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('applies id attribute', () => {
        render(<Typography id="test-id">ID test</Typography>)
        expect(screen.getByText('ID test')).toHaveAttribute('id', 'test-id')
    })

    it('applies title attribute', () => {
        render(<Typography title="Tooltip text">Hover me</Typography>)
        expect(screen.getByText('Hover me')).toHaveAttribute(
            'title',
            'Tooltip text'
        )
    })

    it('applies aria-label', () => {
        render(<Typography ariaLabel="Accessible label">Text</Typography>)
        expect(screen.getByText('Text')).toHaveAttribute(
            'aria-label',
            'Accessible label'
        )
    })

    it('renders all heading variants correctly', () => {
        const { rerender } = render(<Typography variant="h1">H1</Typography>)
        expect(screen.getByText('H1').tagName).toBe('H1')

        rerender(<Typography variant="h2">H2</Typography>)
        expect(screen.getByText('H2').tagName).toBe('H2')

        rerender(<Typography variant="h3">H3</Typography>)
        expect(screen.getByText('H3').tagName).toBe('H3')

        rerender(<Typography variant="h4">H4</Typography>)
        expect(screen.getByText('H4').tagName).toBe('H4')

        rerender(<Typography variant="h5">H5</Typography>)
        expect(screen.getByText('H5').tagName).toBe('H5')

        rerender(<Typography variant="h6">H6</Typography>)
        expect(screen.getByText('H6').tagName).toBe('H6')
    })

    it('renders subtitle variants as paragraphs', () => {
        const { rerender } = render(
            <Typography variant="subtitle1">Subtitle 1</Typography>
        )
        expect(screen.getByText('Subtitle 1').tagName).toBe('P')

        rerender(<Typography variant="subtitle2">Subtitle 2</Typography>)
        expect(screen.getByText('Subtitle 2').tagName).toBe('P')
    })

    it('renders button variant as span', () => {
        render(<Typography variant="button">Button text</Typography>)
        expect(screen.getByText('Button text').tagName).toBe('SPAN')
    })

    it('does not apply inherit color class', () => {
        render(<Typography color="inherit">Inherit</Typography>)
        expect(screen.getByText('Inherit')).not.toHaveClass(
            'typography--color-inherit'
        )
    })

    it('does not apply inherit alignment class', () => {
        render(<Typography align="inherit">Inherit</Typography>)
        expect(screen.getByText('Inherit')).not.toHaveClass(
            'typography--align-inherit'
        )
    })

    it('combines multiple props correctly', () => {
        render(
            <Typography
                variant="h3"
                color="primary"
                align="center"
                weight="bold"
                gutterBottom
                className="custom"
            >
                Combined
            </Typography>
        )
        const element = screen.getByText('Combined')
        expect(element).toHaveClass('typography--h3')
        expect(element).toHaveClass('typography--color-primary')
        expect(element).toHaveClass('typography--align-center')
        expect(element).toHaveClass('typography--weight-bold')
        expect(element).toHaveClass('typography--gutter-bottom')
        expect(element).toHaveClass('custom')
    })
})
