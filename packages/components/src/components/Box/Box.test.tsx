import React, { createRef } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Box } from './Box'

describe('Box', () => {
    it('renders as a div by default', () => {
        render(<Box data-testid="box">Hello</Box>)
        const box = screen.getByTestId('box')
        expect(box.tagName).toBe('DIV')
        expect(box).toHaveTextContent('Hello')
    })

    it('renders as a different HTML element when "as" prop is provided', () => {
        render(
            <Box as="section" data-testid="box">
                Section
            </Box>
        )
        const box = screen.getByTestId('box')
        expect(box.tagName).toBe('SECTION')
        expect(box).toHaveTextContent('Section')
    })

    it('forwards props to the rendered element', () => {
        render(
            <Box as="a" href="https://example.com" data-testid="box">
                Link
            </Box>
        )
        const box = screen.getByTestId('box')
        expect(box).toHaveAttribute('href', 'https://example.com')
    })

    it('forwards refs to the underlying element', () => {
        const ref = createRef<HTMLButtonElement>()
        render(
            <Box as="button" ref={ref}>
                Click
            </Box>
        )
        expect(ref.current).toBeInstanceOf(HTMLButtonElement)
        expect(ref.current?.tagName).toBe('BUTTON')
    })

    it('handles click events', () => {
        const handleClick = jest.fn()
        render(
            <Box as="button" onClick={handleClick}>
                Click me
            </Box>
        )
        fireEvent.click(screen.getByText('Click me'))
        expect(handleClick).toHaveBeenCalled()
    })
})
