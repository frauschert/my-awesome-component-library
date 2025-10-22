import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import Alert from './Alert'
import Button from '../Button'

const meta: Meta<typeof Alert> = {
    title: 'Components/Alert',
    component: Alert,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'Alert component for displaying important messages, warnings, and notifications inline. Supports multiple variants, sizes, and features like dismissibility.',
            },
        },
    },
    argTypes: {
        variant: {
            control: 'select',
            options: ['info', 'success', 'warning', 'error'],
            description: 'Visual variant of the alert',
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
            description: 'Size of the alert',
        },
        showIcon: {
            control: 'boolean',
            description: 'Show/hide the icon',
        },
        dismissible: {
            control: 'boolean',
            description: 'Make the alert dismissible',
        },
        bordered: {
            control: 'boolean',
            description: 'Add border to the alert',
        },
        filled: {
            control: 'boolean',
            description: 'Fill the alert with solid color',
        },
    },
}

export default meta
type Story = StoryObj<typeof Alert>

// Basic Examples
export const Info: Story = {
    args: {
        variant: 'info',
        children: 'This is an informational message for the user.',
    },
}

export const Success: Story = {
    args: {
        variant: 'success',
        children: 'Your changes have been saved successfully!',
    },
}

export const Warning: Story = {
    args: {
        variant: 'warning',
        children: 'Please review your information before submitting.',
    },
}

export const Error: Story = {
    args: {
        variant: 'error',
        children: 'An error occurred while processing your request.',
    },
}

// With Titles
export const WithTitle: Story = {
    args: {
        variant: 'info',
        title: 'Information',
        children: 'This alert includes a title for additional context.',
    },
}

export const AllVariantsWithTitles: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Alert variant="info" title="Information">
                New features are now available in your dashboard.
            </Alert>
            <Alert variant="success" title="Success">
                Your profile has been updated successfully.
            </Alert>
            <Alert variant="warning" title="Warning">
                Your subscription will expire in 3 days.
            </Alert>
            <Alert variant="error" title="Error">
                Failed to connect to the server. Please try again.
            </Alert>
        </div>
    ),
}

// Sizes
export const Sizes: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Alert variant="info" size="sm" title="Small Alert">
                This is a small alert with reduced padding.
            </Alert>
            <Alert variant="info" size="md" title="Medium Alert">
                This is a medium alert (default size).
            </Alert>
            <Alert variant="info" size="lg" title="Large Alert">
                This is a large alert with increased padding.
            </Alert>
        </div>
    ),
}

// Dismissible
export const Dismissible: Story = {
    args: {
        variant: 'success',
        title: 'Dismissible Alert',
        children: 'Click the × button to dismiss this alert.',
        dismissible: true,
    },
}

export const DismissibleWithCallback: Story = {
    render: () => {
        const [dismissed, setDismissed] = React.useState(false)

        return (
            <div>
                {!dismissed && (
                    <Alert
                        variant="warning"
                        title="Cookie Consent"
                        dismissible
                        onDismiss={() => {
                            setDismissed(true)
                            console.log('Alert dismissed!')
                        }}
                    >
                        We use cookies to improve your experience. By
                        continuing, you agree to our cookie policy.
                    </Alert>
                )}
                {dismissed && (
                    <Button onClick={() => setDismissed(false)}>
                        Show Alert Again
                    </Button>
                )}
            </div>
        )
    },
}

// Bordered
export const Bordered: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Alert variant="info" bordered>
                This alert has a colored border.
            </Alert>
            <Alert variant="success" bordered title="Success">
                Operation completed with bordered style.
            </Alert>
            <Alert variant="warning" bordered title="Warning">
                Bordered warning alert.
            </Alert>
            <Alert variant="error" bordered title="Error">
                Bordered error alert.
            </Alert>
        </div>
    ),
}

// Filled
export const Filled: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Alert variant="info" filled>
                This alert has a solid filled background.
            </Alert>
            <Alert variant="success" filled title="Success">
                Operation completed with filled style.
            </Alert>
            <Alert variant="warning" filled title="Warning">
                Filled warning alert.
            </Alert>
            <Alert variant="error" filled title="Error">
                Filled error alert.
            </Alert>
        </div>
    ),
}

// Without Icon
export const WithoutIcon: Story = {
    args: {
        variant: 'info',
        showIcon: false,
        children: 'This alert does not display an icon.',
    },
}

// Custom Icon
export const CustomIcon: Story = {
    args: {
        variant: 'success',
        icon: <span style={{ fontSize: '20px' }}>🎉</span>,
        title: 'Congratulations!',
        children: 'You have completed all tasks.',
    },
}

// With Links and Actions
export const WithLinks: Story = {
    render: () => (
        <Alert variant="info" title="Update Available">
            A new version of the application is available.{' '}
            <a href="#" onClick={(e) => e.preventDefault()}>
                View release notes
            </a>{' '}
            or{' '}
            <a href="#" onClick={(e) => e.preventDefault()}>
                update now
            </a>
            .
        </Alert>
    ),
}

export const WithActions: Story = {
    render: () => (
        <Alert variant="warning" title="Unsaved Changes">
            <div>
                <p style={{ margin: '0 0 0.75rem 0' }}>
                    You have unsaved changes. Would you like to save them before
                    leaving?
                </p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button variant="primary" size="small">
                        Save Changes
                    </Button>
                    <Button variant="secondary" size="small">
                        Discard
                    </Button>
                </div>
            </div>
        </Alert>
    ),
}

// Complex Content
export const ComplexContent: Story = {
    render: () => (
        <Alert variant="error" title="Multiple Validation Errors" dismissible>
            <div>
                <p style={{ margin: '0 0 0.5rem 0' }}>
                    Please fix the following errors:
                </p>
                <ul style={{ margin: '0', paddingLeft: '1.25rem' }}>
                    <li>Email address is required</li>
                    <li>Password must be at least 8 characters</li>
                    <li>Terms and conditions must be accepted</li>
                </ul>
            </div>
        </Alert>
    ),
}

// Real-world Examples
export const FormValidation: Story = {
    render: () => (
        <div style={{ maxWidth: '600px' }}>
            <Alert variant="error" size="sm" dismissible>
                Please correct the errors below before submitting the form.
            </Alert>
        </div>
    ),
}

export const Banner: Story = {
    render: () => (
        <Alert
            variant="info"
            filled
            size="lg"
            style={{ borderRadius: 0, marginBottom: '2rem' }}
        >
            <div style={{ textAlign: 'center' }}>
                <strong>Limited Time Offer:</strong> Get 50% off on all premium
                plans. Use code{' '}
                <code
                    style={{
                        background: 'rgba(0,0,0,0.2)',
                        padding: '2px 6px',
                        borderRadius: '3px',
                    }}
                >
                    SAVE50
                </code>{' '}
                at checkout.
            </div>
        </Alert>
    ),
}

export const SystemStatus: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Alert variant="success" size="sm">
                <strong>All Systems Operational</strong> - All services are
                running normally.
            </Alert>
            <Alert variant="warning" size="sm">
                <strong>Scheduled Maintenance</strong> - System will be under
                maintenance on Sunday, 2:00 AM - 4:00 AM UTC.
            </Alert>
            <Alert variant="error" size="sm">
                <strong>Service Disruption</strong> - Payment processing is
                currently experiencing issues.
            </Alert>
        </div>
    ),
}

export const InlineNotification: Story = {
    render: () => (
        <div style={{ maxWidth: '500px' }}>
            <h3>Profile Settings</h3>
            <Alert
                variant="success"
                size="sm"
                dismissible
                style={{ marginBottom: '1rem' }}
            >
                Your password was changed successfully.
            </Alert>
            <p>Manage your account settings and preferences.</p>
        </div>
    ),
}

// All Combinations
export const AllCombinations: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4>Default Style</h4>
            <Alert variant="info">Info - Default</Alert>
            <Alert variant="success">Success - Default</Alert>
            <Alert variant="warning">Warning - Default</Alert>
            <Alert variant="error">Error - Default</Alert>

            <h4 style={{ marginTop: '1.5rem' }}>Bordered Style</h4>
            <Alert variant="info" bordered>
                Info - Bordered
            </Alert>
            <Alert variant="success" bordered>
                Success - Bordered
            </Alert>
            <Alert variant="warning" bordered>
                Warning - Bordered
            </Alert>
            <Alert variant="error" bordered>
                Error - Bordered
            </Alert>

            <h4 style={{ marginTop: '1.5rem' }}>Filled Style</h4>
            <Alert variant="info" filled>
                Info - Filled
            </Alert>
            <Alert variant="success" filled>
                Success - Filled
            </Alert>
            <Alert variant="warning" filled>
                Warning - Filled
            </Alert>
            <Alert variant="error" filled>
                Error - Filled
            </Alert>
        </div>
    ),
}
