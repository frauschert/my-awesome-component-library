import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { useState, useEffect } from 'react'
import { ProgressBar } from './ProgressBar'

const meta: Meta<typeof ProgressBar> = {
    title: 'Components/ProgressBar',
    component: ProgressBar,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ProgressBar>

export const Default: Story = {
    args: {
        value: 60,
    },
}

export const Colors: Story = {
    render: () => (
        <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
            <div>
                <p
                    style={{
                        marginBottom: '0.5rem',
                        color: 'var(--theme-text-primary)',
                    }}
                >
                    Primary
                </p>
                <ProgressBar value={75} color="primary" />
            </div>
            <div>
                <p
                    style={{
                        marginBottom: '0.5rem',
                        color: 'var(--theme-text-primary)',
                    }}
                >
                    Secondary
                </p>
                <ProgressBar value={60} color="secondary" />
            </div>
            <div>
                <p
                    style={{
                        marginBottom: '0.5rem',
                        color: 'var(--theme-text-primary)',
                    }}
                >
                    Success
                </p>
                <ProgressBar value={85} color="success" />
            </div>
            <div>
                <p
                    style={{
                        marginBottom: '0.5rem',
                        color: 'var(--theme-text-primary)',
                    }}
                >
                    Warning
                </p>
                <ProgressBar value={45} color="warning" />
            </div>
            <div>
                <p
                    style={{
                        marginBottom: '0.5rem',
                        color: 'var(--theme-text-primary)',
                    }}
                >
                    Danger
                </p>
                <ProgressBar value={25} color="danger" />
            </div>
            <div>
                <p
                    style={{
                        marginBottom: '0.5rem',
                        color: 'var(--theme-text-primary)',
                    }}
                >
                    Info
                </p>
                <ProgressBar value={50} color="info" />
            </div>
        </div>
    ),
}

export const Sizes: Story = {
    render: () => (
        <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
            <div>
                <p
                    style={{
                        marginBottom: '0.5rem',
                        color: 'var(--theme-text-primary)',
                    }}
                >
                    Small
                </p>
                <ProgressBar value={60} size="small" />
            </div>
            <div>
                <p
                    style={{
                        marginBottom: '0.5rem',
                        color: 'var(--theme-text-primary)',
                    }}
                >
                    Medium
                </p>
                <ProgressBar value={60} size="medium" />
            </div>
            <div>
                <p
                    style={{
                        marginBottom: '0.5rem',
                        color: 'var(--theme-text-primary)',
                    }}
                >
                    Large
                </p>
                <ProgressBar value={60} size="large" />
            </div>
        </div>
    ),
}

export const Variants: Story = {
    render: () => (
        <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
            <div>
                <p
                    style={{
                        marginBottom: '0.5rem',
                        color: 'var(--theme-text-primary)',
                    }}
                >
                    Default
                </p>
                <ProgressBar value={70} variant="default" />
            </div>
            <div>
                <p
                    style={{
                        marginBottom: '0.5rem',
                        color: 'var(--theme-text-primary)',
                    }}
                >
                    Striped
                </p>
                <ProgressBar value={70} variant="striped" />
            </div>
            <div>
                <p
                    style={{
                        marginBottom: '0.5rem',
                        color: 'var(--theme-text-primary)',
                    }}
                >
                    Animated
                </p>
                <ProgressBar value={70} variant="animated" />
            </div>
        </div>
    ),
}

export const WithPercentage: Story = {
    render: () => (
        <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
            <div>
                <p
                    style={{
                        marginBottom: '0.5rem',
                        color: 'var(--theme-text-primary)',
                    }}
                >
                    Inside Label
                </p>
                <ProgressBar
                    value={65}
                    showPercentage
                    labelPosition="inside"
                    size="large"
                />
            </div>
            <div>
                <p
                    style={{
                        marginBottom: '0.5rem',
                        color: 'var(--theme-text-primary)',
                    }}
                >
                    Outside Label
                </p>
                <ProgressBar
                    value={65}
                    showPercentage
                    labelPosition="outside"
                />
            </div>
            <div>
                <p
                    style={{
                        marginBottom: '0.5rem',
                        color: 'var(--theme-text-primary)',
                    }}
                >
                    No Label
                </p>
                <ProgressBar value={65} labelPosition="none" />
            </div>
        </div>
    ),
}

export const CustomLabels: Story = {
    render: () => (
        <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
            <div>
                <p
                    style={{
                        marginBottom: '0.5rem',
                        color: 'var(--theme-text-primary)',
                    }}
                >
                    Custom Text Inside
                </p>
                <ProgressBar
                    value={40}
                    label="40/100 Files"
                    labelPosition="inside"
                    size="large"
                />
            </div>
            <div>
                <p
                    style={{
                        marginBottom: '0.5rem',
                        color: 'var(--theme-text-primary)',
                    }}
                >
                    Custom Text Outside
                </p>
                <ProgressBar
                    value={75}
                    label="75 MB / 100 MB"
                    labelPosition="outside"
                    color="success"
                />
            </div>
        </div>
    ),
}

export const Indeterminate: Story = {
    render: () => (
        <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
            <div>
                <p
                    style={{
                        marginBottom: '0.5rem',
                        color: 'var(--theme-text-primary)',
                    }}
                >
                    Loading...
                </p>
                <ProgressBar value={0} indeterminate />
            </div>
            <div>
                <p
                    style={{
                        marginBottom: '0.5rem',
                        color: 'var(--theme-text-primary)',
                    }}
                >
                    Processing...
                </p>
                <ProgressBar value={0} indeterminate color="success" />
            </div>
            <div>
                <p
                    style={{
                        marginBottom: '0.5rem',
                        color: 'var(--theme-text-primary)',
                    }}
                >
                    Uploading...
                </p>
                <ProgressBar
                    value={0}
                    indeterminate
                    variant="animated"
                    color="info"
                />
            </div>
        </div>
    ),
}

export const Animated: Story = {
    render: () => {
        const [progress, setProgress] = useState(0)

        useEffect(() => {
            const interval = window.setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) return 0
                    return prev + 1
                })
            }, 50)
            return () => window.clearInterval(interval)
        }, [])

        return (
            <div>
                <p
                    style={{
                        marginBottom: '0.5rem',
                        color: 'var(--theme-text-primary)',
                    }}
                >
                    Auto-incrementing progress
                </p>
                <ProgressBar
                    value={progress}
                    showPercentage
                    labelPosition="outside"
                />
            </div>
        )
    },
}

export const FileUpload: Story = {
    render: () => {
        const [progress, setProgress] = useState(0)
        const [isUploading, setIsUploading] = useState(false)

        const startUpload = () => {
            setIsUploading(true)
            setProgress(0)
            const interval = window.setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        window.clearInterval(interval)
                        setTimeout(() => setIsUploading(false), 500)
                        return 100
                    }
                    return prev + Math.random() * 10
                })
            }, 200)
        }

        return (
            <div>
                <button
                    onClick={startUpload}
                    disabled={isUploading}
                    style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: 'var(--theme-primary, #007bff)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: isUploading ? 'not-allowed' : 'pointer',
                        opacity: isUploading ? 0.6 : 1,
                        marginBottom: '1rem',
                    }}
                >
                    {isUploading ? 'Uploading...' : 'Start Upload'}
                </button>
                <ProgressBar
                    value={progress}
                    showPercentage
                    labelPosition="outside"
                    color="success"
                    variant="animated"
                />
            </div>
        )
    },
}

export const DiskSpace: Story = {
    render: () => {
        const used = 67.3
        const total = 100

        return (
            <div>
                <div
                    style={{
                        marginBottom: '0.5rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    <span style={{ color: 'var(--theme-text-primary)' }}>
                        Disk Space
                    </span>
                    <span style={{ color: 'var(--theme-text-secondary)' }}>
                        {used} GB / {total} GB
                    </span>
                </div>
                <ProgressBar
                    value={used}
                    max={total}
                    color={
                        used > 80 ? 'danger' : used > 60 ? 'warning' : 'success'
                    }
                />
            </div>
        )
    },
}

export const MultipleSteps: Story = {
    render: () => {
        const [currentStep, setCurrentStep] = useState(2)
        const totalSteps = 5

        return (
            <div>
                <div style={{ marginBottom: '1rem' }}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '0.5rem',
                        }}
                    >
                        <span
                            style={{
                                color: 'var(--theme-text-primary)',
                                fontWeight: 600,
                            }}
                        >
                            Step {currentStep} of {totalSteps}
                        </span>
                        <span style={{ color: 'var(--theme-text-secondary)' }}>
                            {Math.round((currentStep / totalSteps) * 100)}%
                            Complete
                        </span>
                    </div>
                    <ProgressBar
                        value={currentStep}
                        max={totalSteps}
                        color="primary"
                        size="large"
                    />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        onClick={() =>
                            setCurrentStep(Math.max(1, currentStep - 1))
                        }
                        disabled={currentStep === 1}
                        style={{
                            padding: '0.5rem 1rem',
                            border: '1px solid var(--theme-border-primary)',
                            borderRadius: '4px',
                            backgroundColor: 'transparent',
                            cursor:
                                currentStep === 1 ? 'not-allowed' : 'pointer',
                            opacity: currentStep === 1 ? 0.5 : 1,
                            color: 'var(--theme-text-primary)',
                        }}
                    >
                        Previous
                    </button>
                    <button
                        onClick={() =>
                            setCurrentStep(
                                Math.min(totalSteps, currentStep + 1)
                            )
                        }
                        disabled={currentStep === totalSteps}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: 'var(--theme-primary, #007bff)',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor:
                                currentStep === totalSteps
                                    ? 'not-allowed'
                                    : 'pointer',
                            opacity: currentStep === totalSteps ? 0.5 : 1,
                        }}
                    >
                        {currentStep === totalSteps ? 'Complete' : 'Next'}
                    </button>
                </div>
            </div>
        )
    },
}

export const DownloadProgress: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div
                style={{
                    padding: '1rem',
                    backgroundColor: 'var(--theme-bg-secondary, #f5f5f5)',
                    borderRadius: '8px',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '0.5rem',
                    }}
                >
                    <span
                        style={{
                            fontWeight: 600,
                            color: 'var(--theme-text-primary)',
                        }}
                    >
                        document.pdf
                    </span>
                    <span
                        style={{
                            color: 'var(--theme-text-secondary)',
                            fontSize: '0.875rem',
                        }}
                    >
                        3.2 MB / 5.0 MB
                    </span>
                </div>
                <ProgressBar value={64} color="info" variant="animated" />
            </div>
            <div
                style={{
                    padding: '1rem',
                    backgroundColor: 'var(--theme-bg-secondary, #f5f5f5)',
                    borderRadius: '8px',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '0.5rem',
                    }}
                >
                    <span
                        style={{
                            fontWeight: 600,
                            color: 'var(--theme-text-primary)',
                        }}
                    >
                        image.jpg
                    </span>
                    <span
                        style={{
                            color: 'var(--theme-text-secondary)',
                            fontSize: '0.875rem',
                        }}
                    >
                        Complete
                    </span>
                </div>
                <ProgressBar value={100} color="success" />
            </div>
            <div
                style={{
                    padding: '1rem',
                    backgroundColor: 'var(--theme-bg-secondary, #f5f5f5)',
                    borderRadius: '8px',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '0.5rem',
                    }}
                >
                    <span
                        style={{
                            fontWeight: 600,
                            color: 'var(--theme-text-primary)',
                        }}
                    >
                        video.mp4
                    </span>
                    <span
                        style={{
                            color: 'var(--theme-text-secondary)',
                            fontSize: '0.875rem',
                        }}
                    >
                        Waiting...
                    </span>
                </div>
                <ProgressBar value={0} />
            </div>
        </div>
    ),
}

export const SkillLevels: Story = {
    render: () => (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                maxWidth: '500px',
            }}
        >
            <div>
                <div
                    style={{
                        marginBottom: '0.5rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    <span
                        style={{
                            color: 'var(--theme-text-primary)',
                            fontWeight: 500,
                        }}
                    >
                        React
                    </span>
                    <span style={{ color: 'var(--theme-text-secondary)' }}>
                        Expert
                    </span>
                </div>
                <ProgressBar value={90} color="success" />
            </div>
            <div>
                <div
                    style={{
                        marginBottom: '0.5rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    <span
                        style={{
                            color: 'var(--theme-text-primary)',
                            fontWeight: 500,
                        }}
                    >
                        TypeScript
                    </span>
                    <span style={{ color: 'var(--theme-text-secondary)' }}>
                        Advanced
                    </span>
                </div>
                <ProgressBar value={80} color="primary" />
            </div>
            <div>
                <div
                    style={{
                        marginBottom: '0.5rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    <span
                        style={{
                            color: 'var(--theme-text-primary)',
                            fontWeight: 500,
                        }}
                    >
                        Node.js
                    </span>
                    <span style={{ color: 'var(--theme-text-secondary)' }}>
                        Intermediate
                    </span>
                </div>
                <ProgressBar value={60} color="info" />
            </div>
            <div>
                <div
                    style={{
                        marginBottom: '0.5rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    <span
                        style={{
                            color: 'var(--theme-text-primary)',
                            fontWeight: 500,
                        }}
                    >
                        GraphQL
                    </span>
                    <span style={{ color: 'var(--theme-text-secondary)' }}>
                        Beginner
                    </span>
                </div>
                <ProgressBar value={30} color="warning" />
            </div>
        </div>
    ),
}
