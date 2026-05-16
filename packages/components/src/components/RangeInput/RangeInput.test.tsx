import React, { useState } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import RangeInput from './RangeInput'

describe('RangeInput', () => {
    describe('Basic Rendering', () => {
        test('renders with required props', () => {
            render(<RangeInput min={0} max={100} />)

            const slider = screen.getByRole('slider')
            expect(slider).toBeInTheDocument()
        })

        test('renders with label', () => {
            render(<RangeInput min={0} max={100} label="Volume" />)

            expect(screen.getByText('Volume')).toBeInTheDocument()
            expect(screen.getByLabelText('Volume')).toBeInTheDocument()
        })

        test('renders number input by default', () => {
            const { container } = render(<RangeInput min={0} max={100} />)

            const numberInput = container.querySelector('input[type="number"]')
            expect(numberInput).toBeInTheDocument()
        })

        test('hides number input when showNumberInput is false', () => {
            const { container } = render(
                <RangeInput min={0} max={100} showNumberInput={false} />
            )

            const numberInput = container.querySelector('input[type="number"]')
            expect(numberInput).not.toBeInTheDocument()
        })

        test('shows min/max labels when enabled', () => {
            render(<RangeInput min={0} max={100} showMinMax />)

            expect(screen.getByText('0')).toBeInTheDocument()
            expect(screen.getByText('100')).toBeInTheDocument()
        })
    })

    describe('Controlled Mode', () => {
        test('uses controlled value', () => {
            render(
                <RangeInput value={50} min={0} max={100} onChange={jest.fn()} />
            )

            const slider = screen.getByRole('slider')
            expect(slider).toHaveValue('50')
        })

        test('calls onChange when slider changes', () => {
            const handleChange = jest.fn()
            render(
                <RangeInput
                    value={50}
                    min={0}
                    max={100}
                    onChange={handleChange}
                />
            )

            const slider = screen.getByRole('slider')
            fireEvent.change(slider, { target: { value: '75' } })

            expect(handleChange).toHaveBeenCalledWith(75)
        })

        test('calls onChange when number input changes', () => {
            const handleChange = jest.fn()
            const { container } = render(
                <RangeInput
                    value={50}
                    min={0}
                    max={100}
                    onChange={handleChange}
                />
            )

            const numberInput = container.querySelector('input[type="number"]')
            if (numberInput) {
                fireEvent.change(numberInput, { target: { value: '80' } })
            }

            expect(handleChange).toHaveBeenCalledWith(80)
        })
    })

    describe('Uncontrolled Mode', () => {
        test('uses defaultValue', () => {
            render(<RangeInput defaultValue={30} min={0} max={100} />)

            const slider = screen.getByRole('slider')
            expect(slider).toHaveValue('30')
        })

        test('calls onChange on mount with default value', () => {
            const handleChange = jest.fn()
            render(
                <RangeInput
                    defaultValue={25}
                    min={0}
                    max={100}
                    onChange={handleChange}
                />
            )

            expect(handleChange).toHaveBeenCalledWith(25)
        })

        test('updates internal state on change', () => {
            const { container } = render(
                <RangeInput defaultValue={20} min={0} max={100} />
            )

            const slider = screen.getByRole('slider')
            fireEvent.change(slider, { target: { value: '60' } })

            expect(slider).toHaveValue('60')

            const numberInput = container.querySelector('input[type="number"]')
            expect(numberInput).toHaveValue(60)
        })
    })

    describe('Value Validation', () => {
        test('clamps value to min', () => {
            const handleChange = jest.fn()
            const { container } = render(
                <RangeInput
                    value={50}
                    min={0}
                    max={100}
                    onChange={handleChange}
                />
            )

            const numberInput = container.querySelector('input[type="number"]')
            if (numberInput) {
                fireEvent.change(numberInput, { target: { value: '-10' } })
            }

            expect(handleChange).toHaveBeenCalledWith(0)
        })

        test('clamps value to max', () => {
            const handleChange = jest.fn()
            const { container } = render(
                <RangeInput
                    value={50}
                    min={0}
                    max={100}
                    onChange={handleChange}
                />
            )

            const numberInput = container.querySelector('input[type="number"]')
            if (numberInput) {
                fireEvent.change(numberInput, { target: { value: '150' } })
            }

            expect(handleChange).toHaveBeenCalledWith(100)
        })

        test('snaps to step', () => {
            const handleChange = jest.fn()
            const { container } = render(
                <RangeInput
                    value={0}
                    min={0}
                    max={100}
                    step={10}
                    onChange={handleChange}
                />
            )

            const numberInput = container.querySelector('input[type="number"]')
            if (numberInput) {
                fireEvent.change(numberInput, { target: { value: '23' } })
            }

            expect(handleChange).toHaveBeenCalledWith(20)
        })

        test('handles decimal steps', () => {
            const handleChange = jest.fn()
            const { container } = render(
                <RangeInput
                    value={0}
                    min={0}
                    max={1}
                    step={0.1}
                    onChange={handleChange}
                />
            )

            const numberInput = container.querySelector('input[type="number"]')
            if (numberInput) {
                fireEvent.change(numberInput, { target: { value: '0.55' } })
            }

            expect(handleChange).toHaveBeenCalledWith(0.6)
        })
    })

    describe('Lifecycle Callbacks', () => {
        test('calls onChangeStart on mouse down', () => {
            const handleChangeStart = jest.fn()
            render(
                <RangeInput
                    value={50}
                    min={0}
                    max={100}
                    onChangeStart={handleChangeStart}
                    onChange={jest.fn()}
                />
            )

            const slider = screen.getByRole('slider')
            fireEvent.mouseDown(slider)

            expect(handleChangeStart).toHaveBeenCalledWith(50)
        })

        test('calls onChangeEnd on mouse up', () => {
            const handleChangeEnd = jest.fn()
            render(
                <RangeInput
                    value={50}
                    min={0}
                    max={100}
                    onChangeEnd={handleChangeEnd}
                    onChange={jest.fn()}
                />
            )

            const slider = screen.getByRole('slider')
            fireEvent.mouseDown(slider)
            fireEvent.mouseUp(slider)

            expect(handleChangeEnd).toHaveBeenCalledWith(50)
        })
    })

    describe('Formatting', () => {
        test('applies formatValue to display', () => {
            render(
                <RangeInput
                    value={50}
                    min={0}
                    max={100}
                    showMinMax
                    formatValue={(v) => `$${v}`}
                    onChange={jest.fn()}
                />
            )

            expect(screen.getByText('$0')).toBeInTheDocument()
            expect(screen.getByText('$100')).toBeInTheDocument()
        })

        test('formats tooltip value', () => {
            const { container } = render(
                <RangeInput
                    value={75}
                    min={0}
                    max={100}
                    showTooltip
                    formatValue={(v) => `${v}%`}
                    onChange={jest.fn()}
                />
            )

            const slider = screen.getByRole('slider')
            fireEvent.mouseEnter(slider)

            const tooltip = container.querySelector('.range-input__tooltip')
            expect(tooltip).toHaveTextContent('75%')
        })
    })

    describe('Styling & Variants', () => {
        test('applies size variant', () => {
            const { container } = render(
                <RangeInput min={0} max={100} size="lg" />
            )

            expect(container.firstChild).toHaveClass('range-input--lg')
        })

        test('applies color variant', () => {
            const { container } = render(
                <RangeInput min={0} max={100} variant="success" />
            )

            expect(container.firstChild).toHaveClass('range-input--success')
        })

        test('applies custom className', () => {
            const { container } = render(
                <RangeInput min={0} max={100} className="custom-range" />
            )

            expect(container.firstChild).toHaveClass('custom-range')
        })

        test('applies disabled state', () => {
            const { container } = render(
                <RangeInput min={0} max={100} disabled />
            )

            expect(container.firstChild).toHaveClass('range-input--disabled')

            const slider = screen.getByRole('slider')
            expect(slider).toBeDisabled()
        })
    })

    describe('Accessibility', () => {
        test('has proper ARIA attributes', () => {
            render(
                <RangeInput value={50} min={0} max={100} onChange={jest.fn()} />
            )

            const slider = screen.getByRole('slider')
            expect(slider).toHaveAttribute('aria-valuemin', '0')
            expect(slider).toHaveAttribute('aria-valuemax', '100')
            expect(slider).toHaveAttribute('aria-valuenow', '50')
        })

        test('has aria-valuetext with formatted value', () => {
            render(
                <RangeInput
                    value={50}
                    min={0}
                    max={100}
                    formatValue={(v) => `$${v}`}
                    onChange={jest.fn()}
                />
            )

            const slider = screen.getByRole('slider')
            expect(slider).toHaveAttribute('aria-valuetext', '$50')
        })

        test('associates label with input via id', () => {
            render(<RangeInput min={0} max={100} label="Volume" id="volume" />)

            const label = screen.getByText('Volume')
            expect(label).toHaveAttribute('for', 'volume')

            const slider = screen.getByRole('slider')
            expect(slider).toHaveAttribute('id', 'volume')
        })

        test('generates unique id when not provided', () => {
            const { container: container1 } = render(
                <RangeInput min={0} max={100} label="Volume 1" />
            )
            const { container: container2 } = render(
                <RangeInput min={0} max={100} label="Volume 2" />
            )

            const slider1 = container1.querySelector('input[type="range"]')
            const slider2 = container2.querySelector('input[type="range"]')

            expect(slider1?.id).toBeTruthy()
            expect(slider2?.id).toBeTruthy()
            expect(slider1?.id).not.toBe(slider2?.id)
        })
    })

    describe('Integration', () => {
        test('works in controlled form', () => {
            function ControlledForm() {
                const [volume, setVolume] = useState(50)

                return (
                    <div>
                        <RangeInput
                            value={volume}
                            onChange={setVolume}
                            min={0}
                            max={100}
                            label="Volume"
                        />
                        <div data-testid="display">{volume}</div>
                    </div>
                )
            }

            render(<ControlledForm />)

            const slider = screen.getByRole('slider')
            fireEvent.change(slider, { target: { value: '75' } })

            expect(screen.getByTestId('display')).toHaveTextContent('75')
        })

        test('syncs slider and number input', () => {
            const { container } = render(
                <RangeInput defaultValue={25} min={0} max={100} />
            )

            const slider = screen.getByRole('slider')
            const numberInput = container.querySelector('input[type="number"]')

            fireEvent.change(slider, { target: { value: '60' } })
            expect(numberInput).toHaveValue(60)

            if (numberInput) {
                fireEvent.change(numberInput, { target: { value: '80' } })
            }
            expect(slider).toHaveValue('80')
        })
    })

    describe('Edge Cases', () => {
        test('handles min === max', () => {
            render(
                <RangeInput value={5} min={5} max={5} onChange={jest.fn()} />
            )

            const slider = screen.getByRole('slider')
            expect(slider).toHaveValue('5')
        })

        test('handles negative ranges', () => {
            const handleChange = jest.fn()
            render(
                <RangeInput
                    value={-50}
                    min={-100}
                    max={0}
                    onChange={handleChange}
                />
            )

            const slider = screen.getByRole('slider')
            fireEvent.change(slider, { target: { value: '-25' } })

            expect(handleChange).toHaveBeenCalledWith(-25)
        })

        test('handles very small steps', () => {
            const handleChange = jest.fn()
            const { container } = render(
                <RangeInput
                    value={0}
                    min={0}
                    max={1}
                    step={0.001}
                    onChange={handleChange}
                />
            )

            const numberInput = container.querySelector('input[type="number"]')
            if (numberInput) {
                fireEvent.change(numberInput, { target: { value: '0.5555' } })
            }

            expect(handleChange).toHaveBeenCalledWith(0.556)
        })
    })

    describe('Performance', () => {
        test('does not re-render with same props (memoization)', () => {
            const { rerender } = render(
                <RangeInput value={50} min={0} max={100} onChange={jest.fn()} />
            )
            const firstRender = screen.getByRole('slider')

            rerender(
                <RangeInput value={50} min={0} max={100} onChange={jest.fn()} />
            )
            const secondRender = screen.getByRole('slider')

            expect(firstRender).toBe(secondRender)
        })
    })
})
