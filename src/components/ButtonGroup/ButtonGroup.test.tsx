import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ButtonGroup, ButtonGroupButton } from './ButtonGroup'

const basicButtons: ButtonGroupButton[] = [
    { id: 'btn1', label: 'Button 1' },
    { id: 'btn2', label: 'Button 2' },
    { id: 'btn3', label: 'Button 3' },
]

describe('ButtonGroup', () => {
    describe('Rendering', () => {
        it('should render all buttons', () => {
            render(<ButtonGroup buttons={basicButtons} />)
            expect(screen.getByText('Button 1')).toBeInTheDocument()
            expect(screen.getByText('Button 2')).toBeInTheDocument()
            expect(screen.getByText('Button 3')).toBeInTheDocument()
        })

        it('should render with custom className', () => {
            const { container } = render(
                <ButtonGroup buttons={basicButtons} className="custom-class" />
            )
            expect(container.querySelector('.button-group')).toHaveClass(
                'custom-class'
            )
        })

        it('should render with icons', () => {
            const buttonsWithIcons: ButtonGroupButton[] = [
                { id: 'btn1', label: 'Button 1', icon: <span>📄</span> },
            ]
            render(<ButtonGroup buttons={buttonsWithIcons} />)
            expect(screen.getByText('📄')).toBeInTheDocument()
        })

        it('should apply aria-label', () => {
            render(
                <ButtonGroup
                    buttons={basicButtons}
                    selectionMode="single"
                    aria-label="Test group"
                />
            )
            expect(screen.getByLabelText('Test group')).toBeInTheDocument()
        })
    })

    describe('Variants', () => {
        it('should apply default variant', () => {
            const { container } = render(
                <ButtonGroup buttons={basicButtons} variant="default" />
            )
            expect(container.querySelector('.button-group')).toHaveClass(
                'button-group--default'
            )
        })

        it('should apply outlined variant', () => {
            const { container } = render(
                <ButtonGroup buttons={basicButtons} variant="outlined" />
            )
            expect(container.querySelector('.button-group')).toHaveClass(
                'button-group--outlined'
            )
        })

        it('should apply contained variant', () => {
            const { container } = render(
                <ButtonGroup buttons={basicButtons} variant="contained" />
            )
            expect(container.querySelector('.button-group')).toHaveClass(
                'button-group--contained'
            )
        })
    })

    describe('Sizes', () => {
        it('should apply small size', () => {
            const { container } = render(
                <ButtonGroup buttons={basicButtons} size="small" />
            )
            expect(container.querySelector('.button-group')).toHaveClass(
                'button-group--small'
            )
        })

        it('should apply medium size', () => {
            const { container } = render(
                <ButtonGroup buttons={basicButtons} size="medium" />
            )
            expect(container.querySelector('.button-group')).toHaveClass(
                'button-group--medium'
            )
        })

        it('should apply large size', () => {
            const { container } = render(
                <ButtonGroup buttons={basicButtons} size="large" />
            )
            expect(container.querySelector('.button-group')).toHaveClass(
                'button-group--large'
            )
        })
    })

    describe('Orientation', () => {
        it('should apply horizontal orientation', () => {
            const { container } = render(
                <ButtonGroup buttons={basicButtons} orientation="horizontal" />
            )
            expect(container.querySelector('.button-group')).toHaveClass(
                'button-group--horizontal'
            )
        })

        it('should apply vertical orientation', () => {
            const { container } = render(
                <ButtonGroup buttons={basicButtons} orientation="vertical" />
            )
            expect(container.querySelector('.button-group')).toHaveClass(
                'button-group--vertical'
            )
        })
    })

    describe('Selection Mode - None', () => {
        it('should not add selection classes when selectionMode is none', () => {
            const { container } = render(
                <ButtonGroup buttons={basicButtons} selectionMode="none" />
            )
            const buttons = container.querySelectorAll('.button-group__button')
            buttons.forEach((button) => {
                expect(button).not.toHaveClass('button-group__button--selected')
            })
        })

        it('should not call onChange when clicked in none mode', () => {
            const handleChange = jest.fn()
            render(
                <ButtonGroup
                    buttons={basicButtons}
                    selectionMode="none"
                    onChange={handleChange}
                />
            )
            fireEvent.click(screen.getByText('Button 1'))
            expect(handleChange).not.toHaveBeenCalled()
        })
    })

    describe('Selection Mode - Single', () => {
        it('should select button when clicked', () => {
            const handleChange = jest.fn()
            render(
                <ButtonGroup
                    buttons={basicButtons}
                    selectionMode="single"
                    onChange={handleChange}
                />
            )
            fireEvent.click(screen.getByText('Button 1'))
            expect(handleChange).toHaveBeenCalledWith('btn1')
        })

        it('should display selected button with selected class', () => {
            const { container } = render(
                <ButtonGroup
                    buttons={basicButtons}
                    selectionMode="single"
                    selected="btn2"
                />
            )
            const button2 = screen.getByText('Button 2').closest('button')
            expect(button2).toHaveClass('button-group__button--selected')
        })

        it('should switch selection when another button is clicked', () => {
            const handleChange = jest.fn()
            render(
                <ButtonGroup
                    buttons={basicButtons}
                    selectionMode="single"
                    selected="btn1"
                    onChange={handleChange}
                />
            )
            fireEvent.click(screen.getByText('Button 2'))
            expect(handleChange).toHaveBeenCalledWith('btn2')
        })

        it('should not deselect by default when clicking selected button', () => {
            const handleChange = jest.fn()
            render(
                <ButtonGroup
                    buttons={basicButtons}
                    selectionMode="single"
                    selected="btn1"
                    onChange={handleChange}
                />
            )
            fireEvent.click(screen.getByText('Button 1'))
            expect(handleChange).not.toHaveBeenCalled()
        })

        it('should deselect when allowDeselect is true', () => {
            const handleChange = jest.fn()
            render(
                <ButtonGroup
                    buttons={basicButtons}
                    selectionMode="single"
                    selected="btn1"
                    onChange={handleChange}
                    allowDeselect
                />
            )
            fireEvent.click(screen.getByText('Button 1'))
            expect(handleChange).toHaveBeenCalledWith(null)
        })

        it('should have aria-pressed attribute', () => {
            render(
                <ButtonGroup
                    buttons={basicButtons}
                    selectionMode="single"
                    selected="btn1"
                />
            )
            const button1 = screen.getByText('Button 1').closest('button')
            const button2 = screen.getByText('Button 2').closest('button')
            expect(button1).toHaveAttribute('aria-pressed', 'true')
            expect(button2).toHaveAttribute('aria-pressed', 'false')
        })
    })

    describe('Selection Mode - Multiple', () => {
        it('should select multiple buttons', () => {
            const handleChange = jest.fn()
            render(
                <ButtonGroup
                    buttons={basicButtons}
                    selectionMode="multiple"
                    selected={['btn1']}
                    onChange={handleChange}
                />
            )
            fireEvent.click(screen.getByText('Button 2'))
            expect(handleChange).toHaveBeenCalledWith(['btn1', 'btn2'])
        })

        it('should deselect button when clicked again', () => {
            const handleChange = jest.fn()
            render(
                <ButtonGroup
                    buttons={basicButtons}
                    selectionMode="multiple"
                    selected={['btn1', 'btn2']}
                    onChange={handleChange}
                />
            )
            fireEvent.click(screen.getByText('Button 1'))
            expect(handleChange).toHaveBeenCalledWith(['btn2'])
        })

        it('should display all selected buttons with selected class', () => {
            render(
                <ButtonGroup
                    buttons={basicButtons}
                    selectionMode="multiple"
                    selected={['btn1', 'btn3']}
                />
            )
            const button1 = screen.getByText('Button 1').closest('button')
            const button2 = screen.getByText('Button 2').closest('button')
            const button3 = screen.getByText('Button 3').closest('button')
            expect(button1).toHaveClass('button-group__button--selected')
            expect(button2).not.toHaveClass('button-group__button--selected')
            expect(button3).toHaveClass('button-group__button--selected')
        })
    })

    describe('Disabled State', () => {
        it('should disable entire group when disabled prop is true', () => {
            const { container } = render(
                <ButtonGroup buttons={basicButtons} disabled />
            )
            expect(container.querySelector('.button-group')).toHaveClass(
                'button-group--disabled'
            )
        })

        it('should not call onChange when group is disabled', () => {
            const handleChange = jest.fn()
            render(
                <ButtonGroup
                    buttons={basicButtons}
                    selectionMode="single"
                    onChange={handleChange}
                    disabled
                />
            )
            fireEvent.click(screen.getByText('Button 1'))
            expect(handleChange).not.toHaveBeenCalled()
        })

        it('should disable specific button', () => {
            const buttonsWithDisabled: ButtonGroupButton[] = [
                { id: 'btn1', label: 'Button 1' },
                { id: 'btn2', label: 'Button 2', disabled: true },
            ]
            render(<ButtonGroup buttons={buttonsWithDisabled} />)
            const button2 = screen.getByText('Button 2').closest('button')
            expect(button2).toBeDisabled()
            expect(button2).toHaveClass('button-group__button--disabled')
        })

        it('should not call onChange when disabled button is clicked', () => {
            const handleChange = jest.fn()
            const buttonsWithDisabled: ButtonGroupButton[] = [
                { id: 'btn1', label: 'Button 1' },
                { id: 'btn2', label: 'Button 2', disabled: true },
            ]
            render(
                <ButtonGroup
                    buttons={buttonsWithDisabled}
                    selectionMode="single"
                    onChange={handleChange}
                />
            )
            fireEvent.click(screen.getByText('Button 2'))
            expect(handleChange).not.toHaveBeenCalled()
        })
    })

    describe('Full Width', () => {
        it('should apply full width class', () => {
            const { container } = render(
                <ButtonGroup buttons={basicButtons} fullWidth />
            )
            expect(container.querySelector('.button-group')).toHaveClass(
                'button-group--full-width'
            )
        })
    })

    describe('Tooltips', () => {
        it('should render tooltip on button', () => {
            const buttonsWithTooltip: ButtonGroupButton[] = [
                { id: 'btn1', label: 'Button 1', tooltip: 'Tooltip text' },
            ]
            render(<ButtonGroup buttons={buttonsWithTooltip} />)
            const button = screen.getByText('Button 1').closest('button')
            expect(button).toHaveAttribute('title', 'Tooltip text')
        })
    })

    describe('Uncontrolled Mode', () => {
        it('should work with defaultSelected', () => {
            const { container } = render(
                <ButtonGroup
                    buttons={basicButtons}
                    selectionMode="single"
                    defaultSelected="btn2"
                />
            )
            const button2 = screen.getByText('Button 2').closest('button')
            expect(button2).toHaveClass('button-group__button--selected')
        })

        it('should update selection internally', () => {
            const { container } = render(
                <ButtonGroup buttons={basicButtons} selectionMode="single" />
            )
            fireEvent.click(screen.getByText('Button 1'))
            const button1 = screen.getByText('Button 1').closest('button')
            expect(button1).toHaveClass('button-group__button--selected')
        })
    })

    describe('First and Last Button Classes', () => {
        it('should add first class to first button', () => {
            const { container } = render(<ButtonGroup buttons={basicButtons} />)
            const button1 = screen.getByText('Button 1').closest('button')
            expect(button1).toHaveClass('button-group__button--first')
        })

        it('should add last class to last button', () => {
            const { container } = render(<ButtonGroup buttons={basicButtons} />)
            const button3 = screen.getByText('Button 3').closest('button')
            expect(button3).toHaveClass('button-group__button--last')
        })
    })
})
