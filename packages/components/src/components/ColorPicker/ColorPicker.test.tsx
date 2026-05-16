import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ColorPicker } from './ColorPicker'

describe('ColorPicker', () => {
    it('renders with label', () => {
        render(<ColorPicker label="Pick a color" />)
        expect(screen.getByText('Pick a color')).toBeInTheDocument()
    })

    it('shows required indicator when required', () => {
        render(<ColorPicker label="Color" required />)
        expect(screen.getByText('*')).toBeInTheDocument()
    })

    it('displays the current color value', () => {
        render(<ColorPicker value="#ff0000" />)
        const textInput = screen.getByLabelText('Color value')
        expect(textInput).toHaveValue('#ff0000')
    })

    it('renders color swatch with correct background', () => {
        const { container } = render(<ColorPicker value="#00ff00" />)
        const swatch = container.querySelector(
            '.colorpicker__swatch'
        ) as HTMLElement
        expect(swatch).toHaveStyle({ backgroundColor: '#00ff00' })
    })

    it('opens dropdown when swatch is clicked', async () => {
        const user = userEvent.setup()
        const { container } = render(<ColorPicker />)

        const swatch = container.querySelector(
            '.colorpicker__swatch'
        ) as HTMLElement
        await user.click(swatch)

        expect(
            container.querySelector('.colorpicker__dropdown')
        ).toBeInTheDocument()
    })

    it('closes dropdown when clicking outside', async () => {
        const user = userEvent.setup()
        render(
            <div>
                <ColorPicker label="Color" />
                <button>Outside</button>
            </div>
        )

        const swatch = screen.getByLabelText('Open color picker')
        await user.click(swatch)

        expect(screen.getByText('Presets')).toBeInTheDocument()

        const outsideButton = screen.getByText('Outside')
        await user.click(outsideButton)

        expect(screen.queryByText('Presets')).not.toBeInTheDocument()
    })

    it('calls onChange when color input changes with valid hex', async () => {
        const user = userEvent.setup()
        const handleChange = jest.fn()
        render(<ColorPicker onChange={handleChange} value="#000000" />)

        const input = screen.getByLabelText('Color value')
        await user.clear(input)
        await user.type(input, '#ff0000')

        expect(handleChange).toHaveBeenCalledWith('#ff0000')
    })

    it('does not call onChange for invalid hex values', async () => {
        const user = userEvent.setup()
        const handleChange = jest.fn()
        render(<ColorPicker onChange={handleChange} value="#000000" />)

        const input = screen.getByLabelText('Color value')
        await user.clear(input)
        await user.type(input, 'invalid')

        expect(handleChange).not.toHaveBeenCalled()
    })

    it('calls onChange when preset color is clicked', async () => {
        const user = userEvent.setup()
        const handleChange = jest.fn()
        const { container } = render(
            <ColorPicker
                onChange={handleChange}
                presets={['#ff0000', '#00ff00']}
            />
        )

        const swatch = container.querySelector(
            '.colorpicker__swatch'
        ) as HTMLElement
        await user.click(swatch)

        const redSwatch = screen.getByLabelText('#ff0000')
        await user.click(redSwatch)

        expect(handleChange).toHaveBeenCalledWith('#ff0000')
    })

    it('shows recent colors section when enabled', async () => {
        const user = userEvent.setup()
        const { container } = render(<ColorPicker showRecent />)

        const swatch = container.querySelector(
            '.colorpicker__swatch'
        ) as HTMLElement
        await user.click(swatch)

        // Initially no recent colors
        expect(screen.queryByText('Recent')).not.toBeInTheDocument()
    })

    it('renders preset colors', async () => {
        const user = userEvent.setup()
        const presets = ['#ff0000', '#00ff00', '#0000ff']
        const { container } = render(<ColorPicker presets={presets} />)

        const swatch = container.querySelector(
            '.colorpicker__swatch'
        ) as HTMLElement
        await user.click(swatch)

        expect(screen.getByText('Presets')).toBeInTheDocument()
        expect(screen.getByLabelText('#ff0000')).toBeInTheDocument()
        expect(screen.getByLabelText('#00ff00')).toBeInTheDocument()
        expect(screen.getByLabelText('#0000ff')).toBeInTheDocument()
    })

    it('highlights selected preset color', async () => {
        const user = userEvent.setup()
        const { container } = render(
            <ColorPicker value="#ff0000" presets={['#ff0000', '#00ff00']} />
        )

        const swatch = container.querySelector(
            '.colorpicker__swatch'
        ) as HTMLElement
        await user.click(swatch)

        const selectedSwatch = screen.getByLabelText('#ff0000')
        expect(selectedSwatch).toHaveClass(
            'colorpicker__palette-swatch--selected'
        )
    })

    it('hides input when showInput is false', () => {
        const { container } = render(
            <ColorPicker showInput={false} value="#ff0000" />
        )
        expect(
            container.querySelector('.colorpicker__input')
        ).not.toBeInTheDocument()
    })

    it('renders native color picker', () => {
        const { container } = render(<ColorPicker value="#ff0000" />)
        const nativeInput = container.querySelector('input[type="color"]')
        expect(nativeInput).toBeInTheDocument()
        expect(nativeInput).toHaveValue('#ff0000')
    })

    it('calls onChange when native color picker changes', () => {
        const handleChange = jest.fn()
        const { container } = render(
            <ColorPicker onChange={handleChange} value="#000000" />
        )

        const nativeInput = container.querySelector(
            'input[type="color"]'
        ) as HTMLInputElement

        // Simulate native color picker change
        fireEvent.change(nativeInput, { target: { value: '#ff0000' } })

        expect(handleChange).toHaveBeenCalledWith('#ff0000')
    })

    it('renders error message', () => {
        render(<ColorPicker error="Invalid color" />)
        expect(screen.getByText('Invalid color')).toBeInTheDocument()
        expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    it('renders helper text', () => {
        render(<ColorPicker helperText="Choose your theme color" />)
        expect(screen.getByText('Choose your theme color')).toBeInTheDocument()
    })

    it('does not show helper text when error is present', () => {
        render(<ColorPicker error="Error" helperText="Helper" />)
        expect(screen.getByText('Error')).toBeInTheDocument()
        expect(screen.queryByText('Helper')).not.toBeInTheDocument()
    })

    it('is disabled when disabled prop is true', () => {
        const { container } = render(<ColorPicker disabled label="Color" />)
        const swatch = screen.getByLabelText('Open color picker')
        const input = screen.getByLabelText('Color')
        const nativeInput = container.querySelector('input[type="color"]')

        expect(swatch).toBeDisabled()
        expect(input).toBeDisabled()
        expect(nativeInput).toBeDisabled()
    })

    it('applies size classes', () => {
        const { container, rerender } = render(<ColorPicker size="small" />)
        expect(
            container.querySelector('.colorpicker--small')
        ).toBeInTheDocument()

        rerender(<ColorPicker size="large" />)
        expect(
            container.querySelector('.colorpicker--large')
        ).toBeInTheDocument()
    })

    it('applies custom className', () => {
        const { container } = render(<ColorPicker className="custom-picker" />)
        expect(container.querySelector('.custom-picker')).toBeInTheDocument()
    })

    it('limits input to 7 characters (# + 6 hex digits)', () => {
        render(<ColorPicker value="#ff0000" />)
        const input = screen.getByLabelText('Color value') as HTMLInputElement
        expect(input.maxLength).toBe(7)
    })
})
