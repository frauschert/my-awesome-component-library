import React from 'react'
import { StoryObj, Meta } from '@storybook/react-vite'
import ThemeProvider from './ThemeProvider'
import ThemeSwitcher from './ThemeSwitcher'
import { useTheme } from './ThemeContext'
import Card from '../Card'
import Button from '../Button'
import Alert from '../Alert'
import Badge from '../Badge'

const meta: Meta<typeof ThemeSwitcher> = {
    title: 'Theming/ThemeSwitcher',
    component: ThemeSwitcher,
    decorators: [
        (Story) => (
            <ThemeProvider>
                <Story />
            </ThemeProvider>
        ),
    ],
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof ThemeSwitcher>

// Demo component to show theme in action
const ThemeDemo = () => {
    const [{ theme, resolvedTheme }] = useTheme()
    return (
        <div style={{ padding: '2rem', minWidth: '600px' }}>
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <p
                    style={{
                        color: 'var(--theme-text-secondary)',
                        fontSize: '0.875rem',
                        marginBottom: '1rem',
                    }}
                >
                    Current: <strong>{theme}</strong> (Resolved:{' '}
                    <strong>{resolvedTheme}</strong>)
                </p>
            </div>

            <Card style={{ marginBottom: '1.5rem' }}>
                <Card.Header>
                    <h3 style={{ margin: 0 }}>Theme Preview</h3>
                </Card.Header>
                <Card.Body>
                    <p>
                        This card demonstrates how components adapt to the
                        theme.
                    </p>
                    <div
                        style={{
                            display: 'flex',
                            gap: '0.5rem',
                            marginTop: '1rem',
                            flexWrap: 'wrap',
                        }}
                    >
                        <Button variant="primary">Primary</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="danger">Danger</Button>
                    </div>
                </Card.Body>
            </Card>

            <div style={{ display: 'grid', gap: '1rem' }}>
                <Alert variant="info">
                    This is an info alert in {resolvedTheme} mode
                </Alert>
                <Alert variant="success">
                    This is a success alert in {resolvedTheme} mode
                </Alert>
                <Alert variant="warn">
                    This is a warning alert in {resolvedTheme} mode
                </Alert>
                <Alert variant="error">
                    This is an error alert in {resolvedTheme} mode
                </Alert>
            </div>

            <div
                style={{
                    display: 'flex',
                    gap: '0.5rem',
                    marginTop: '1.5rem',
                    flexWrap: 'wrap',
                }}
            >
                <Badge variant="default">Default</Badge>
                <Badge variant="primary">Primary</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="danger">Danger</Badge>
                <Badge variant="info">Info</Badge>
            </div>
        </div>
    )
}

export const ButtonsVariant: Story = {
    render: () => (
        <div>
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <ThemeSwitcher variant="buttons" />
            </div>
            <ThemeDemo />
        </div>
    ),
}

export const ButtonsWithoutLabels: Story = {
    render: () => (
        <div>
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <ThemeSwitcher variant="buttons" showLabels={false} />
            </div>
            <ThemeDemo />
        </div>
    ),
}

export const SelectVariant: Story = {
    render: () => (
        <div>
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <ThemeSwitcher variant="select" />
            </div>
            <ThemeDemo />
        </div>
    ),
}

export const ToggleVariant: Story = {
    render: () => (
        <div>
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <ThemeSwitcher variant="toggle" />
                <p
                    style={{
                        color: 'var(--theme-text-secondary)',
                        fontSize: '0.875rem',
                        marginTop: '0.5rem',
                    }}
                >
                    Toggle variant only switches between light and dark (no auto
                    option)
                </p>
            </div>
            <ThemeDemo />
        </div>
    ),
}

export const SmallSize: Story = {
    render: () => (
        <div
            style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'center',
                flexWrap: 'wrap',
            }}
        >
            <ThemeSwitcher variant="buttons" size="sm" />
            <ThemeSwitcher variant="select" size="sm" />
            <ThemeSwitcher variant="toggle" size="sm" />
        </div>
    ),
}

export const MediumSize: Story = {
    render: () => (
        <div
            style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'center',
                flexWrap: 'wrap',
            }}
        >
            <ThemeSwitcher variant="buttons" size="md" />
            <ThemeSwitcher variant="select" size="md" />
            <ThemeSwitcher variant="toggle" size="md" />
        </div>
    ),
}

export const LargeSize: Story = {
    render: () => (
        <div
            style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'center',
                flexWrap: 'wrap',
            }}
        >
            <ThemeSwitcher variant="buttons" size="lg" />
            <ThemeSwitcher variant="select" size="lg" />
            <ThemeSwitcher variant="toggle" size="lg" />
        </div>
    ),
}

export const InNavBar: Story = {
    render: () => (
        <div style={{ width: '100%', minWidth: '800px' }}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem 2rem',
                    backgroundColor: 'var(--theme-surface)',
                    borderBottom: '1px solid var(--theme-border)',
                    marginBottom: '2rem',
                }}
            >
                <h2 style={{ margin: 0 }}>My App</h2>
                <ThemeSwitcher variant="toggle" size="md" />
            </div>
            <ThemeDemo />
        </div>
    ),
}

export const AllVariants: Story = {
    render: () => (
        <div style={{ padding: '2rem' }}>
            <div style={{ marginBottom: '3rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Buttons Variant</h3>
                <ThemeSwitcher variant="buttons" />
            </div>
            <div style={{ marginBottom: '3rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Buttons without Labels</h3>
                <ThemeSwitcher variant="buttons" showLabels={false} />
            </div>
            <div style={{ marginBottom: '3rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Select Variant</h3>
                <ThemeSwitcher variant="select" />
            </div>
            <div style={{ marginBottom: '3rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Toggle Variant</h3>
                <ThemeSwitcher variant="toggle" />
            </div>
            <ThemeDemo />
        </div>
    ),
}
