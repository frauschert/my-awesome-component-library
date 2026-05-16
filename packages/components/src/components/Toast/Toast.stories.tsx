import React from 'react'
import { StoryObj, Meta } from '@storybook/react-vite'
import { ToastProvider, ToastProviderProps, notify } from './'
import Button from '../Button'

const ToastDemo = () => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                padding: '2rem',
            }}
        >
            <div>
                <h3 style={{ marginBottom: '0.5rem' }}>Toast Notifications</h3>
                <p style={{ color: '#666', marginBottom: '1.5rem' }}>
                    Click buttons to show toasts. Hover over toasts to pause
                    auto-dismiss. Press Escape to dismiss the latest toast.
                </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Button
                    onClick={() =>
                        notify({
                            content: 'This is an informational message',
                            variant: 'info',
                            duration: 4000,
                        })
                    }
                >
                    Show Info
                </Button>
                <Button
                    onClick={() =>
                        notify({
                            content: 'Operation completed successfully!',
                            variant: 'success',
                            duration: 4000,
                        })
                    }
                >
                    Show Success
                </Button>
                <Button
                    onClick={() =>
                        notify({
                            content: 'Warning: This action cannot be undone',
                            variant: 'warn',
                            duration: 4000,
                        })
                    }
                >
                    Show Warning
                </Button>
                <Button
                    onClick={() =>
                        notify({
                            content: 'Error: Something went wrong',
                            variant: 'error',
                            duration: 4000,
                        })
                    }
                >
                    Show Error
                </Button>
            </div>

            <div
                style={{
                    display: 'flex',
                    gap: '0.5rem',
                    flexWrap: 'wrap',
                    marginTop: '1rem',
                }}
            >
                <Button
                    variant="secondary"
                    onClick={() =>
                        notify({
                            content:
                                'This toast will stay until you dismiss it',
                            variant: 'info',
                            duration: -1,
                        })
                    }
                >
                    Persistent Toast
                </Button>
                <Button
                    variant="secondary"
                    onClick={() =>
                        notify({
                            content: 'Quick notification (1 second)',
                            variant: 'success',
                            duration: 1000,
                        })
                    }
                >
                    Quick Toast
                </Button>
                <Button
                    variant="secondary"
                    onClick={() =>
                        notify({
                            content:
                                'This is a much longer message that demonstrates how the toast handles more content. It wraps nicely and remains readable even with multiple lines of text.',
                            variant: 'info',
                            duration: 6000,
                        })
                    }
                >
                    Long Message
                </Button>
            </div>

            <div style={{ marginTop: '1rem' }}>
                <Button
                    variant="secondary"
                    onClick={() => {
                        notify({
                            content: 'First notification',
                            variant: 'info',
                            duration: 5000,
                        })
                        setTimeout(
                            () =>
                                notify({
                                    content: 'Second notification',
                                    variant: 'success',
                                    duration: 5000,
                                }),
                            300
                        )
                        setTimeout(
                            () =>
                                notify({
                                    content: 'Third notification',
                                    variant: 'warn',
                                    duration: 5000,
                                }),
                            600
                        )
                        setTimeout(
                            () =>
                                notify({
                                    content: 'Fourth notification',
                                    variant: 'error',
                                    duration: 5000,
                                }),
                            900
                        )
                    }}
                >
                    Show Multiple
                </Button>
            </div>
        </div>
    )
}

export default {
    title: 'Components/Toast',
    component: ToastProvider,
} as Meta<typeof ToastProvider>

export const BottomRight: StoryObj<ToastProviderProps> = {
    args: {
        position: 'bottom-right',
        maxVisible: 5,
        dismissOnEscape: true,
    },
    render: (args) => (
        <ToastProvider {...args}>
            <ToastDemo />
        </ToastProvider>
    ),
}

export const BottomLeft: StoryObj<ToastProviderProps> = {
    args: {
        position: 'bottom-left',
        maxVisible: 5,
        dismissOnEscape: true,
    },
    render: (args) => (
        <ToastProvider {...args}>
            <ToastDemo />
        </ToastProvider>
    ),
}

export const TopRight: StoryObj<ToastProviderProps> = {
    args: {
        position: 'top-right',
        maxVisible: 5,
        dismissOnEscape: true,
    },
    render: (args) => (
        <ToastProvider {...args}>
            <ToastDemo />
        </ToastProvider>
    ),
}

export const TopLeft: StoryObj<ToastProviderProps> = {
    args: {
        position: 'top-left',
        maxVisible: 5,
        dismissOnEscape: true,
    },
    render: (args) => (
        <ToastProvider {...args}>
            <ToastDemo />
        </ToastProvider>
    ),
}

export const LimitedQueue: StoryObj<ToastProviderProps> = {
    args: {
        position: 'bottom-right',
        maxVisible: 3,
        dismissOnEscape: true,
    },
    render: (args) => (
        <ToastProvider {...args}>
            <div style={{ padding: '2rem' }}>
                <p style={{ marginBottom: '1rem' }}>
                    Max visible toasts: {args.maxVisible}. Try showing multiple
                    toasts to see the queue limit.
                </p>
                <ToastDemo />
            </div>
        </ToastProvider>
    ),
}

export const NoEscapeDismiss: StoryObj<ToastProviderProps> = {
    args: {
        position: 'bottom-right',
        maxVisible: 5,
        dismissOnEscape: false,
    },
    render: (args) => (
        <ToastProvider {...args}>
            <div style={{ padding: '2rem' }}>
                <p style={{ marginBottom: '1rem' }}>
                    Escape key is disabled. You must click the X button to
                    dismiss.
                </p>
                <ToastDemo />
            </div>
        </ToastProvider>
    ),
}
