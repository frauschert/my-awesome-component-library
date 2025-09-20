import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import { userEvent, within, expect } from '@storybook/test'
import Button, { ButtonProps } from './Button'
import { ThemeProvider, ThemeSwitcher } from '../Theme'

const meta: Meta<typeof Button> = {
    title: 'Components/Button',
    component: Button,
    parameters: {
        docs: {
            description: {
                component:
                    'A flexible button component with variants, sizes, loading, icons, and full-width support. These stories include lightweight interaction checks using Storybook play functions without extra testing libs.',
            },
            page: () => (
                <>
                    <h1>Button</h1>
                    <p>
                        Stories below include simple interaction tests via play
                        functions. They use plain DOM events and checks (no
                        extra testing libraries) so they run out of the box in
                        Storybook.
                    </p>
                    <ul>
                        <li>
                            SubmitAndReset: clicks submit and reset, asserts
                            status text
                        </li>
                        <li>
                            KeyboardFocus: focuses the button and checks
                            document.activeElement
                        </li>
                        <li>
                            InteractiveState: clicks and asserts counter text
                        </li>
                        <li>
                            DisabledDoesNotClick: ensures disabled button does
                            not change state
                        </li>
                    </ul>
                </>
            ),
        },
    },
    argTypes: {
        variant: {
            control: { type: 'select' },
            options: ['primary', 'secondary', 'danger', 'link'],
        },
        size: {
            control: { type: 'inline-radio' },
            options: ['small', 'medium', 'large'],
        },
        fullWidth: { control: 'boolean' },
        loading: { control: 'boolean' },
        disabled: { control: 'boolean' },
        backgroundColor: { control: 'color' },
        onClick: { action: 'clicked' },
    },
}

export default meta

type Story = StoryObj<ButtonProps>

export const Primary: Story = {
    args: {
        children: 'Primary',
        variant: 'primary',
        size: 'medium',
    },
}

export const Secondary: Story = {
    args: {
        children: 'Secondary',
        variant: 'secondary',
        size: 'medium',
    },
}

export const Danger: Story = {
    args: {
        children: 'Delete',
        variant: 'danger',
        size: 'medium',
    },
}

export const Link: Story = {
    args: {
        children: 'Learn more',
        variant: 'link',
    },
}

export const Sizes: Story = {
    render: (args) => (
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Button {...args} size="small">
                Small
            </Button>
            <Button {...args} size="medium">
                Medium
            </Button>
            <Button {...args} size="large">
                Large
            </Button>
        </div>
    ),
    args: {
        variant: 'primary',
    },
}

export const Disabled: Story = {
    args: {
        children: 'Disabled',
        disabled: true,
    },
}

export const Loading: Story = {
    args: {
        children: 'Loading…',
        loading: true,
    },
}

export const WithIcons: Story = {
    args: {
        children: 'Download',
        leftIcon: <span aria-hidden>⬇️</span>,
        rightIcon: <span aria-hidden>📦</span>,
        variant: 'secondary',
    },
}

export const IconOnlyAccessible: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Icon-only buttons must include an accessible name via aria-label or title.',
            },
            source: {
                code: `<Button aria-label="Download" leftIcon={<span aria-hidden>⬇️</span>} />`,
            },
        },
    },
    args: {
        'aria-label': 'Download',
        leftIcon: <span aria-hidden>⬇️</span>,
        variant: 'primary',
        children: undefined,
    },
}

export const FullWidth: Story = {
    render: (args) => (
        <div style={{ width: 360, border: '1px dashed #ddd', padding: 12 }}>
            <Button {...args}>Full width button</Button>
        </div>
    ),
    args: {
        fullWidth: true,
    },
}

export const Themed: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Shows Buttons across light and dark themes. Use the ThemeSwitcher to change the current theme or inspect both side-by-side.',
            },
        },
    },
    render: (args) => {
        const Row = ({
            title,
            size,
        }: {
            title: string
            size: ButtonProps['size']
        }) => (
            <div
                style={{
                    display: 'flex',
                    gap: 12,
                    alignItems: 'center',
                    marginBottom: 8,
                }}
            >
                <span style={{ width: 80, opacity: 0.7 }}>{title}</span>
                <Button {...args} size={size} variant="primary">
                    Primary
                </Button>
                <Button {...args} size={size} variant="secondary">
                    Secondary
                </Button>
                <Button {...args} size={size} variant="danger">
                    Danger
                </Button>
                <Button {...args} size={size} variant="link">
                    Link
                </Button>
            </div>
        )

        return (
            <ThemeProvider>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 16,
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            gap: 8,
                            alignItems: 'center',
                        }}
                    >
                        <strong>Theme: </strong>
                        <ThemeSwitcher />
                    </div>
                    <div
                        style={{
                            border: '1px solid #e5e5e5',
                            padding: 12,
                            borderRadius: 8,
                        }}
                    >
                        <Row title="Default" size="medium" />
                        <Row title="Small" size="small" />
                        <Row title="Large" size="large" />
                    </div>
                    <div style={{ display: 'flex', gap: 16 }}>
                        <div
                            style={{
                                flex: 1,
                                padding: 12,
                                borderRadius: 8,
                                background: '#fff',
                            }}
                        >
                            <h4 style={{ marginTop: 0 }}>Light preview</h4>
                            <div className="theme--light">
                                <Row title="Default" size="medium" />
                                <Row title="Small" size="small" />
                                <Row title="Large" size="large" />
                            </div>
                        </div>
                        <div
                            style={{
                                flex: 1,
                                padding: 12,
                                borderRadius: 8,
                                background: '#111',
                                color: '#eee',
                            }}
                        >
                            <h4 style={{ marginTop: 0 }}>Dark preview</h4>
                            <div className="theme--dark">
                                <Row title="Default" size="medium" />
                                <Row title="Small" size="small" />
                                <Row title="Large" size="large" />
                            </div>
                        </div>
                    </div>
                </div>
            </ThemeProvider>
        )
    },
    args: {
        size: 'medium',
    },
}

export const SubmitAndReset: Story = {
    render: () => {
        const Demo: React.FC = () => {
            const [status, setStatus] = React.useState<
                'idle' | 'submitted' | 'reset'
            >('idle')
            return (
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        setStatus('submitted')
                    }}
                    onReset={() => setStatus('reset')}
                >
                    <div style={{ display: 'flex', gap: 8 }}>
                        <Button
                            data-testid="submit-btn"
                            type="submit"
                            variant="primary"
                        >
                            Submit
                        </Button>
                        <Button
                            data-testid="reset-btn"
                            type="reset"
                            variant="secondary"
                        >
                            Reset
                        </Button>
                        <div
                            data-testid="form-status"
                            style={{ marginLeft: 8 }}
                        >
                            {status}
                        </div>
                    </div>
                </form>
            )
        }
        return <Demo />
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await userEvent.click(canvas.getByTestId('submit-btn'))
        await expect(canvas.getByTestId('form-status')).toHaveTextContent(
            'submitted'
        )
        await userEvent.click(canvas.getByTestId('reset-btn'))
        await expect(canvas.getByTestId('form-status')).toHaveTextContent(
            'reset'
        )
    },
}

export const KeyboardFocus: Story = {
    args: {
        children: 'Focusable',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await userEvent.tab()
        await expect(
            canvas.getByRole('button', { name: /focusable/i })
        ).toHaveFocus()
    },
}

export const InteractiveState: Story = {
    render: () => {
        const ReactDemo: React.FC = () => {
            const [count, setCount] = React.useState(0)
            return (
                <Button
                    data-testid="counter-btn"
                    onClick={() => setCount((c) => c + 1)}
                >
                    Clicks: {count}
                </Button>
            )
        }
        return <ReactDemo />
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const btn = canvas.getByTestId('counter-btn')
        await userEvent.click(btn)
        await expect(btn).toHaveTextContent(/Clicks:\s*1/i)
    },
}

export const DisabledDoesNotClick: Story = {
    render: () => {
        const Demo: React.FC = () => {
            const [clicked, setClicked] = React.useState(false)
            return (
                <div>
                    <Button
                        data-testid="disabled-btn"
                        disabled
                        onClick={() => setClicked(true)}
                    >
                        Won't click
                    </Button>
                    <div data-testid="status">
                        {clicked ? 'clicked' : 'idle'}
                    </div>
                </div>
            )
        }
        return <Demo />
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await userEvent.click(canvas.getByTestId('disabled-btn'))
        await expect(canvas.getByTestId('status')).toHaveTextContent('idle')
    },
}
