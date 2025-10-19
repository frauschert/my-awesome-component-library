import React from 'react'
import { classNames } from '../../utility/classnames'
import './Stepper.scss'

export interface Step {
    /** Unique identifier for the step */
    id: string
    /** Label displayed for the step */
    label: string
    /** Optional description/subtitle */
    description?: string
    /** Optional custom icon */
    icon?: React.ReactNode
    /** Whether this step is disabled */
    disabled?: boolean
}

export interface StepperProps {
    /** Array of steps */
    steps: Step[]
    /** Current active step index */
    activeStep: number
    /** Callback when a step is clicked */
    onStepClick?: (stepIndex: number) => void
    /** Orientation of the stepper */
    orientation?: 'horizontal' | 'vertical'
    /** Whether steps can only be accessed sequentially */
    linear?: boolean
    /** Whether to show step numbers */
    showStepNumbers?: boolean
    /** Whether to show connector lines between steps */
    showConnectors?: boolean
    /** Custom className */
    className?: string
    /** Variant style */
    variant?: 'default' | 'compact'
}

export const Stepper: React.FC<StepperProps> = ({
    steps,
    activeStep,
    onStepClick,
    orientation = 'horizontal',
    linear = false,
    showStepNumbers = true,
    showConnectors = true,
    className,
    variant = 'default',
}) => {
    const getStepStatus = (
        stepIndex: number
    ): 'completed' | 'active' | 'pending' => {
        if (stepIndex < activeStep) return 'completed'
        if (stepIndex === activeStep) return 'active'
        return 'pending'
    }

    const isStepClickable = (stepIndex: number, step: Step): boolean => {
        if (step.disabled) return false
        if (!onStepClick) return false
        if (linear) {
            // In linear mode, only completed steps and the next step are clickable
            return stepIndex <= activeStep
        }
        return true
    }

    const handleStepClick = (stepIndex: number, step: Step) => {
        if (isStepClickable(stepIndex, step)) {
            onStepClick?.(stepIndex)
        }
    }

    return (
        <div
            className={classNames(
                'stepper',
                `stepper--${orientation}`,
                `stepper--${variant}`,
                className
            )}
            role="navigation"
            aria-label="Progress steps"
        >
            {steps.map((step, index) => {
                const status = getStepStatus(index)
                const isClickable = isStepClickable(index, step)
                const isLast = index === steps.length - 1

                return (
                    <React.Fragment key={step.id}>
                        <div
                            className={classNames('stepper__step', {
                                'stepper__step--completed':
                                    status === 'completed',
                                'stepper__step--active': status === 'active',
                                'stepper__step--pending': status === 'pending',
                                'stepper__step--disabled': step.disabled,
                                'stepper__step--clickable': isClickable,
                            })}
                            onClick={() => handleStepClick(index, step)}
                            role="button"
                            tabIndex={isClickable ? 0 : -1}
                            aria-current={
                                status === 'active' ? 'step' : undefined
                            }
                            aria-disabled={step.disabled || !isClickable}
                            onKeyDown={(e) => {
                                if (
                                    isClickable &&
                                    (e.key === 'Enter' || e.key === ' ')
                                ) {
                                    e.preventDefault()
                                    handleStepClick(index, step)
                                }
                            }}
                        >
                            <div className="stepper__step-indicator">
                                <div className="stepper__step-icon">
                                    {status === 'completed' && !step.icon ? (
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 16 16"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M13.3334 4L6.00002 11.3333L2.66669 8"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    ) : step.icon ? (
                                        step.icon
                                    ) : showStepNumbers ? (
                                        index + 1
                                    ) : null}
                                </div>
                            </div>
                            <div className="stepper__step-content">
                                <div className="stepper__step-label">
                                    {step.label}
                                </div>
                                {step.description && variant !== 'compact' && (
                                    <div className="stepper__step-description">
                                        {step.description}
                                    </div>
                                )}
                            </div>
                        </div>
                        {!isLast && showConnectors && (
                            <div
                                className={classNames('stepper__connector', {
                                    'stepper__connector--completed':
                                        status === 'completed',
                                })}
                            />
                        )}
                    </React.Fragment>
                )
            })}
        </div>
    )
}

export default Stepper
