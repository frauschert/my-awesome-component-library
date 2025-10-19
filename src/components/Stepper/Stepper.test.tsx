import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Stepper, Step } from './Stepper'

const mockSteps: Step[] = [
    { id: 'step1', label: 'First Step', description: 'First description' },
    { id: 'step2', label: 'Second Step', description: 'Second description' },
    { id: 'step3', label: 'Third Step', description: 'Third description' },
]

describe('Stepper', () => {
    it('renders all steps', () => {
        render(<Stepper steps={mockSteps} activeStep={0} />)

        expect(screen.getByText('First Step')).toBeInTheDocument()
        expect(screen.getByText('Second Step')).toBeInTheDocument()
        expect(screen.getByText('Third Step')).toBeInTheDocument()
    })

    it('renders step descriptions', () => {
        render(<Stepper steps={mockSteps} activeStep={0} />)

        expect(screen.getByText('First description')).toBeInTheDocument()
        expect(screen.getByText('Second description')).toBeInTheDocument()
        expect(screen.getByText('Third description')).toBeInTheDocument()
    })

    it('renders step numbers by default', () => {
        render(<Stepper steps={mockSteps} activeStep={0} />)

        expect(screen.getByText('1')).toBeInTheDocument()
        expect(screen.getByText('2')).toBeInTheDocument()
        expect(screen.getByText('3')).toBeInTheDocument()
    })

    it('hides step numbers when showStepNumbers is false', () => {
        render(
            <Stepper steps={mockSteps} activeStep={0} showStepNumbers={false} />
        )

        expect(screen.queryByText('1')).not.toBeInTheDocument()
        expect(screen.queryByText('2')).not.toBeInTheDocument()
        expect(screen.queryByText('3')).not.toBeInTheDocument()
    })

    it('applies correct classes for step status', () => {
        const { container } = render(
            <Stepper steps={mockSteps} activeStep={1} />
        )

        const steps = container.querySelectorAll('.stepper__step')
        expect(steps[0]).toHaveClass('stepper__step--completed')
        expect(steps[1]).toHaveClass('stepper__step--active')
        expect(steps[2]).toHaveClass('stepper__step--pending')
    })

    it('shows checkmark icon for completed steps', () => {
        const { container } = render(
            <Stepper steps={mockSteps} activeStep={1} />
        )

        const checkmark = container.querySelector(
            '.stepper__step--completed svg'
        )
        expect(checkmark).toBeInTheDocument()
    })

    it('calls onStepClick when a step is clicked', async () => {
        const user = userEvent.setup()
        const handleStepClick = jest.fn()

        render(
            <Stepper
                steps={mockSteps}
                activeStep={0}
                onStepClick={handleStepClick}
            />
        )

        await user.click(screen.getByText('Second Step'))
        expect(handleStepClick).toHaveBeenCalledWith(1)
    })

    it('does not call onStepClick for disabled steps', async () => {
        const user = userEvent.setup()
        const handleStepClick = jest.fn()
        const stepsWithDisabled = [
            ...mockSteps.slice(0, 1),
            { ...mockSteps[1], disabled: true },
            ...mockSteps.slice(2),
        ]

        render(
            <Stepper
                steps={stepsWithDisabled}
                activeStep={0}
                onStepClick={handleStepClick}
            />
        )

        await user.click(screen.getByText('Second Step'))
        expect(handleStepClick).not.toHaveBeenCalled()
    })

    it('respects linear mode', async () => {
        const user = userEvent.setup()
        const handleStepClick = jest.fn()

        render(
            <Stepper
                steps={mockSteps}
                activeStep={0}
                onStepClick={handleStepClick}
                linear
            />
        )

        // Should allow clicking the current step
        await user.click(screen.getByText('First Step'))
        expect(handleStepClick).toHaveBeenCalledWith(0)

        handleStepClick.mockClear()

        // Should not allow clicking future steps in linear mode
        await user.click(screen.getByText('Third Step'))
        expect(handleStepClick).not.toHaveBeenCalled()
    })

    it('applies vertical orientation class', () => {
        const { container } = render(
            <Stepper steps={mockSteps} activeStep={0} orientation="vertical" />
        )

        expect(
            container.querySelector('.stepper--vertical')
        ).toBeInTheDocument()
    })

    it('applies compact variant class', () => {
        const { container } = render(
            <Stepper steps={mockSteps} activeStep={0} variant="compact" />
        )

        expect(container.querySelector('.stepper--compact')).toBeInTheDocument()
    })

    it('hides descriptions in compact mode', () => {
        render(<Stepper steps={mockSteps} activeStep={0} variant="compact" />)

        expect(screen.queryByText('First description')).not.toBeInTheDocument()
    })

    it('applies custom className', () => {
        const { container } = render(
            <Stepper
                steps={mockSteps}
                activeStep={0}
                className="custom-stepper"
            />
        )

        expect(container.querySelector('.custom-stepper')).toBeInTheDocument()
    })

    it('renders custom icons when provided', () => {
        const stepsWithIcons = [
            { id: 'step1', label: 'Step 1', icon: <span>🎯</span> },
            { id: 'step2', label: 'Step 2', icon: <span>🚀</span> },
        ]

        render(<Stepper steps={stepsWithIcons} activeStep={0} />)

        expect(screen.getByText('🎯')).toBeInTheDocument()
        expect(screen.getByText('🚀')).toBeInTheDocument()
    })

    it('has proper accessibility attributes', () => {
        const { container } = render(
            <Stepper steps={mockSteps} activeStep={1} />
        )

        const stepper = container.querySelector('.stepper')
        expect(stepper).toHaveAttribute('role', 'navigation')
        expect(stepper).toHaveAttribute('aria-label', 'Progress steps')

        const steps = container.querySelectorAll('.stepper__step')
        expect(steps[1]).toHaveAttribute('aria-current', 'step')
    })

    it('supports keyboard navigation', async () => {
        const user = userEvent.setup()
        const handleStepClick = jest.fn()

        render(
            <Stepper
                steps={mockSteps}
                activeStep={0}
                onStepClick={handleStepClick}
            />
        )

        const secondStep = screen
            .getByText('Second Step')
            .closest('.stepper__step') as HTMLElement
        secondStep?.focus()

        await user.keyboard('{Enter}')
        expect(handleStepClick).toHaveBeenCalledWith(1)

        handleStepClick.mockClear()

        await user.keyboard(' ')
        expect(handleStepClick).toHaveBeenCalledWith(1)
    })

    it('hides connectors when showConnectors is false', () => {
        const { container } = render(
            <Stepper steps={mockSteps} activeStep={0} showConnectors={false} />
        )

        expect(
            container.querySelector('.stepper__connector')
        ).not.toBeInTheDocument()
    })
})
