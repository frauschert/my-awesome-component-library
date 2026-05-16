import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import HoverCard from './HoverCard'
import { ThemeProvider, ThemeSwitcher } from '../Theme'
import Button from '../Button'

const meta: Meta<typeof HoverCard> = {
    title: 'Components/HoverCard',
    component: HoverCard,
    parameters: {
        docs: {
            description: {
                component:
                    'A hover-triggered card that displays rich content such as profile previews or link previews. Unlike Tooltip, HoverCard accepts arbitrary content and has a hover bridge — the card stays open as the cursor moves from the trigger into the card.',
            },
        },
    },
    argTypes: {
        placement: {
            control: { type: 'select' },
            options: [
                'top',
                'top-start',
                'top-end',
                'bottom',
                'bottom-start',
                'bottom-end',
                'left',
                'left-start',
                'left-end',
                'right',
                'right-start',
                'right-end',
            ],
        },
        openDelay: { control: { type: 'number' } },
        closeDelay: { control: { type: 'number' } },
        showArrow: { control: { type: 'boolean' } },
        disabled: { control: { type: 'boolean' } },
    },
}

export default meta
type Story = StoryObj<typeof HoverCard>

const ProfileCard = () => (
    <div
        style={{
            padding: '16px',
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start',
        }}
    >
        <div
            style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'var(--theme-primary, #408bbd)',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 600,
                fontSize: 18,
            }}
        >
            JD
        </div>
        <div>
            <div style={{ fontWeight: 600, marginBottom: 2 }}>Jane Doe</div>
            <div
                style={{
                    fontSize: 13,
                    color: 'var(--theme-text-secondary, #666)',
                    marginBottom: 8,
                }}
            >
                Senior Engineer · Acme Corp
            </div>
            <div
                style={{
                    fontSize: 13,
                    color: 'var(--theme-text-secondary, #666)',
                }}
            >
                Building great things one component at a time.
            </div>
        </div>
    </div>
)

export const Default: Story = {
    render: () => (
        <div
            style={{
                padding: '80px',
                display: 'flex',
                justifyContent: 'center',
            }}
        >
            <HoverCard content={<ProfileCard />}>
                <Button>Hover over me</Button>
            </HoverCard>
        </div>
    ),
}

export const AllPlacements: Story = {
    render: () => (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, auto)',
                gap: 12,
                justifyContent: 'center',
                padding: 120,
            }}
        >
            {(
                [
                    'top-start',
                    'top',
                    'top-end',
                    'left-start',
                    '',
                    'right-start',
                    'left',
                    '',
                    'right',
                    'left-end',
                    '',
                    'right-end',
                    'bottom-start',
                    'bottom',
                    'bottom-end',
                ] as const
            ).map((p, i) =>
                p ? (
                    <HoverCard
                        key={p}
                        placement={p}
                        content={
                            <div style={{ padding: 12, fontSize: 13 }}>
                                Placement: <strong>{p}</strong>
                            </div>
                        }
                    >
                        <Button variant="secondary" size="small">
                            {p}
                        </Button>
                    </HoverCard>
                ) : (
                    <div key={i} />
                )
            )}
        </div>
    ),
}

export const CustomDelay: Story = {
    render: () => (
        <div
            style={{
                padding: '80px',
                display: 'flex',
                gap: 16,
                justifyContent: 'center',
            }}
        >
            <HoverCard
                openDelay={0}
                closeDelay={0}
                content={
                    <div style={{ padding: 12 }}>
                        No delay — instant open/close
                    </div>
                }
            >
                <Button>No delay</Button>
            </HoverCard>

            <HoverCard
                openDelay={800}
                closeDelay={500}
                content={
                    <div style={{ padding: 12 }}>
                        Slow open (800ms) and slow close (500ms)
                    </div>
                }
            >
                <Button>Slow</Button>
            </HoverCard>
        </div>
    ),
}

export const Controlled: Story = {
    render: () => {
        const [open, setOpen] = useState(false)
        return (
            <div
                style={{
                    padding: '80px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 16,
                }}
            >
                <HoverCard
                    open={open}
                    onOpenChange={setOpen}
                    content={
                        <div style={{ padding: 12 }}>
                            Controlled card — currently{' '}
                            {open ? 'open' : 'closed'}
                        </div>
                    }
                >
                    <Button>Hover me (controlled)</Button>
                </HoverCard>
                <div style={{ display: 'flex', gap: 8 }}>
                    <Button size="small" onClick={() => setOpen(true)}>
                        Force open
                    </Button>
                    <Button
                        size="small"
                        variant="secondary"
                        onClick={() => setOpen(false)}
                    >
                        Force close
                    </Button>
                </div>
            </div>
        )
    },
}

export const WithTheme: Story = {
    render: () => (
        <ThemeProvider>
            <div style={{ padding: 16 }}>
                <ThemeSwitcher />
                <div
                    style={{
                        marginTop: 40,
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <HoverCard content={<ProfileCard />}>
                        <Button>Hover — try both themes</Button>
                    </HoverCard>
                </div>
            </div>
        </ThemeProvider>
    ),
}
