import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Stepper, Step } from './Stepper'
import Button from '../Button'

const meta: Meta<typeof Stepper> = {
    title: 'Components/Stepper',
    component: Stepper,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Stepper>

const basicSteps: Step[] = [
    { id: 'step1', label: 'Account Info', description: 'Enter your details' },
    { id: 'step2', label: 'Address', description: 'Shipping information' },
    { id: 'step3', label: 'Payment', description: 'Billing details' },
    { id: 'step4', label: 'Review', description: 'Confirm your order' },
]

const StepperWithControls = (args: any) => {
    const [activeStep, setActiveStep] = useState(0)

    const handleNext = () => {
        if (activeStep < args.steps.length - 1) {
            setActiveStep(activeStep + 1)
        }
    }

    const handleBack = () => {
        if (activeStep > 0) {
            setActiveStep(activeStep - 1)
        }
    }

    const handleReset = () => {
        setActiveStep(0)
    }

    return (
        <div>
            <Stepper
                {...args}
                activeStep={activeStep}
                onStepClick={setActiveStep}
            />
            <div style={{ marginTop: '2rem', display: 'flex', gap: '0.5rem' }}>
                <Button onClick={handleBack} disabled={activeStep === 0}>
                    Back
                </Button>
                <Button
                    onClick={handleNext}
                    disabled={activeStep === args.steps.length - 1}
                    variant="primary"
                >
                    Next
                </Button>
                <Button onClick={handleReset} variant="secondary">
                    Reset
                </Button>
            </div>
            <div
                style={{
                    marginTop: '2rem',
                    padding: '1rem',
                    backgroundColor: 'var(--theme-bg-secondary, #f5f5f5)',
                    borderRadius: '4px',
                }}
            >
                <h3 style={{ margin: '0 0 0.5rem 0' }}>
                    Step {activeStep + 1}: {args.steps[activeStep].label}
                </h3>
                <p
                    style={{
                        margin: 0,
                        color: 'var(--theme-text-secondary, #666)',
                    }}
                >
                    {args.steps[activeStep].description}
                </p>
            </div>
        </div>
    )
}

export const Default: Story = {
    render: (args) => <StepperWithControls {...args} />,
    args: {
        steps: basicSteps,
    },
}

export const Vertical: Story = {
    render: (args) => <StepperWithControls {...args} />,
    args: {
        steps: basicSteps,
        orientation: 'vertical',
    },
}

export const LinearNavigation: Story = {
    render: (args) => <StepperWithControls {...args} />,
    args: {
        steps: basicSteps,
        linear: true,
    },
}

export const Compact: Story = {
    render: (args) => <StepperWithControls {...args} />,
    args: {
        steps: basicSteps,
        variant: 'compact',
    },
}

export const CompactVertical: Story = {
    render: (args) => <StepperWithControls {...args} />,
    args: {
        steps: basicSteps,
        variant: 'compact',
        orientation: 'vertical',
    },
}

export const WithoutNumbers: Story = {
    render: (args) => <StepperWithControls {...args} />,
    args: {
        steps: basicSteps,
        showStepNumbers: false,
    },
}

export const WithoutConnectors: Story = {
    render: (args) => <StepperWithControls {...args} />,
    args: {
        steps: basicSteps,
        showConnectors: false,
    },
}

export const WithCustomIcons: Story = {
    render: (args) => <StepperWithControls {...args} />,
    args: {
        steps: [
            {
                id: 'step1',
                label: 'Cart',
                description: 'Review items',
                icon: (
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                    >
                        <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
                    </svg>
                ),
            },
            {
                id: 'step2',
                label: 'Shipping',
                description: 'Delivery address',
                icon: (
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                    >
                        <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5v-7zm1.294 7.456A1.999 1.999 0 0 1 4.732 11h5.536a2.01 2.01 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456z" />
                    </svg>
                ),
            },
            {
                id: 'step3',
                label: 'Payment',
                description: 'Billing info',
                icon: (
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                    >
                        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1H2zm13 4H1v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7z" />
                    </svg>
                ),
            },
            {
                id: 'step4',
                label: 'Complete',
                description: 'Order confirmed',
                icon: (
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                    >
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                    </svg>
                ),
            },
        ],
    },
}

export const WithDisabledSteps: Story = {
    render: (args) => {
        const [activeStep, setActiveStep] = useState(0)
        return (
            <Stepper
                {...args}
                activeStep={activeStep}
                onStepClick={setActiveStep}
            />
        )
    },
    args: {
        steps: [
            { id: 'step1', label: 'Step 1', description: 'First step' },
            { id: 'step2', label: 'Step 2', description: 'Second step' },
            {
                id: 'step3',
                label: 'Step 3 (Disabled)',
                description: 'Cannot access',
                disabled: true,
            },
            { id: 'step4', label: 'Step 4', description: 'Fourth step' },
        ],
    },
}

export const ThreeSteps: Story = {
    render: (args) => <StepperWithControls {...args} />,
    args: {
        steps: [
            {
                id: 'step1',
                label: 'Select Plan',
                description: 'Choose your subscription',
            },
            {
                id: 'step2',
                label: 'Create Account',
                description: 'Sign up details',
            },
            {
                id: 'step3',
                label: 'Get Started',
                description: "You're all set!",
            },
        ],
    },
}

export const ManySteps: Story = {
    render: (args) => <StepperWithControls {...args} />,
    args: {
        steps: [
            { id: 'step1', label: 'Step 1' },
            { id: 'step2', label: 'Step 2' },
            { id: 'step3', label: 'Step 3' },
            { id: 'step4', label: 'Step 4' },
            { id: 'step5', label: 'Step 5' },
            { id: 'step6', label: 'Step 6' },
        ],
        variant: 'compact',
    },
}

export const PartiallyCompleted: Story = {
    render: (args) => {
        const [activeStep, setActiveStep] = useState(2)
        return (
            <Stepper
                {...args}
                activeStep={activeStep}
                onStepClick={setActiveStep}
            />
        )
    },
    args: {
        steps: basicSteps,
    },
}
