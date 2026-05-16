import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import Popover from './Popover'
import Button from '../Button'
import './Popover.scss'

const meta: Meta<typeof Popover> = {
    title: 'Components/Popover',
    component: Popover,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        placement: {
            control: 'select',
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
        trigger: {
            control: 'select',
            options: ['click', 'hover', 'focus', 'manual'],
        },
    },
}

export default meta
type Story = StoryObj<typeof Popover>

export const Default: Story = {
    args: {
        content: 'This is a simple popover with some helpful information.',
        placement: 'bottom',
        trigger: 'click',
        showArrow: true,
        children: <Button>Click me</Button>,
    },
}

export const Placements: Story = {
    render: () => (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 120px)',
                gap: '80px',
                padding: '100px',
            }}
        >
            <Popover content="Top start popover" placement="top-start">
                <Button>Top Start</Button>
            </Popover>
            <Popover content="Top center popover" placement="top">
                <Button>Top</Button>
            </Popover>
            <Popover content="Top end popover" placement="top-end">
                <Button>Top End</Button>
            </Popover>

            <Popover content="Left start popover" placement="left-start">
                <Button>Left Start</Button>
            </Popover>
            <div />
            <Popover content="Right start popover" placement="right-start">
                <Button>Right Start</Button>
            </Popover>

            <Popover content="Left center popover" placement="left">
                <Button>Left</Button>
            </Popover>
            <div />
            <Popover content="Right center popover" placement="right">
                <Button>Right</Button>
            </Popover>

            <Popover content="Left end popover" placement="left-end">
                <Button>Left End</Button>
            </Popover>
            <div />
            <Popover content="Right end popover" placement="right-end">
                <Button>Right End</Button>
            </Popover>

            <Popover content="Bottom start popover" placement="bottom-start">
                <Button>Bottom Start</Button>
            </Popover>
            <Popover content="Bottom center popover" placement="bottom">
                <Button>Bottom</Button>
            </Popover>
            <Popover content="Bottom end popover" placement="bottom-end">
                <Button>Bottom End</Button>
            </Popover>
        </div>
    ),
}

export const HoverTrigger: Story = {
    args: {
        content: 'This popover appears when you hover over the button.',
        trigger: 'hover',
        mouseEnterDelay: 100,
        mouseLeaveDelay: 100,
        children: <Button>Hover me</Button>,
    },
}

export const FocusTrigger: Story = {
    args: {
        content: 'This popover appears when the button receives focus.',
        trigger: 'focus',
        children: <Button>Focus me</Button>,
    },
}

export const WithoutArrow: Story = {
    args: {
        content: 'This popover has no arrow.',
        showArrow: false,
        children: <Button>No arrow</Button>,
    },
}

export const RichContent: Story = {
    args: {
        content: (
            <div style={{ minWidth: '250px' }}>
                <h3
                    style={{
                        margin: '0 0 8px 0',
                        fontSize: '16px',
                        fontWeight: 600,
                    }}
                >
                    User Profile
                </h3>
                <p style={{ margin: '0 0 12px 0', color: '#666' }}>
                    Manage your account settings and preferences.
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Button size="small">View Profile</Button>
                    <Button size="small" variant="secondary">
                        Settings
                    </Button>
                </div>
            </div>
        ),
        placement: 'bottom-start',
        children: <Button>Open Profile Menu</Button>,
    },
}

export const FormContent: Story = {
    args: {
        content: (
            <div style={{ width: '300px' }}>
                <h3
                    style={{
                        margin: '0 0 12px 0',
                        fontSize: '14px',
                        fontWeight: 600,
                    }}
                >
                    Quick Reply
                </h3>
                <textarea
                    placeholder="Type your message..."
                    style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #e5e5e5',
                        borderRadius: '4px',
                        fontSize: '14px',
                        resize: 'vertical',
                        minHeight: '80px',
                        fontFamily: 'inherit',
                    }}
                />
                <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                    <Button size="small">Send</Button>
                    <Button size="small" variant="secondary">
                        Cancel
                    </Button>
                </div>
            </div>
        ),
        placement: 'bottom',
        closeOnClickOutside: false,
        children: <Button>Reply</Button>,
    },
}

export const ControlledPopover: Story = {
    render: () => {
        const [open, setOpen] = useState(false)

        return (
            <div>
                <div
                    style={{
                        marginBottom: '16px',
                        display: 'flex',
                        gap: '8px',
                    }}
                >
                    <Button size="small" onClick={() => setOpen(true)}>
                        Open Popover
                    </Button>
                    <Button size="small" onClick={() => setOpen(false)}>
                        Close Popover
                    </Button>
                </div>
                <Popover
                    content="This is a controlled popover. Use the buttons above to control it."
                    trigger="manual"
                    open={open}
                    onOpenChange={setOpen}
                >
                    <Button>Controlled Target</Button>
                </Popover>
            </div>
        )
    },
}

export const CustomOffset: Story = {
    args: {
        content: 'This popover has a custom offset of 24px.',
        offset: 24,
        children: <Button>Custom offset</Button>,
    },
}

export const DisabledState: Story = {
    args: {
        content: 'This should not appear.',
        disabled: true,
        children: <Button disabled>Disabled</Button>,
    },
}

export const LongContent: Story = {
    args: {
        content: (
            <div style={{ maxWidth: '400px' }}>
                <h3 style={{ margin: '0 0 8px 0' }}>Terms and Conditions</h3>
                <p
                    style={{
                        margin: '0 0 8px 0',
                        fontSize: '13px',
                        lineHeight: '1.6',
                    }}
                >
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris.
                </p>
                <p style={{ margin: '0', fontSize: '13px', lineHeight: '1.6' }}>
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur.
                </p>
            </div>
        ),
        placement: 'right',
        children: <Button>Read more</Button>,
    },
}

export const MultiplePopovers: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '16px', padding: '50px' }}>
            <Popover content="Popover 1" placement="top">
                <Button>Popover 1</Button>
            </Popover>
            <Popover content="Popover 2" placement="bottom">
                <Button>Popover 2</Button>
            </Popover>
            <Popover content="Popover 3" placement="left">
                <Button>Popover 3</Button>
            </Popover>
            <Popover content="Popover 4" placement="right">
                <Button>Popover 4</Button>
            </Popover>
        </div>
    ),
}

export const WithCustomClassName: Story = {
    render: () => (
        <>
            <style>
                {`
                    .custom-popover {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        border: none;
                        color: white;
                    }
                    .custom-popover .popover__content {
                        color: white;
                    }
                    .custom-popover .popover__arrow {
                        background: #667eea;
                        border: none;
                    }
                `}
            </style>
            <Popover
                content="This is a custom styled popover with gradient background!"
                className="custom-popover"
            >
                <Button>Custom style</Button>
            </Popover>
        </>
    ),
}

export const InfoPopover: Story = {
    render: () => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Hover for more information</span>
            <Popover
                content="This provides additional context or help information about the feature."
                trigger="hover"
                placement="top"
            >
                <span
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        background: '#3b82f6',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        cursor: 'help',
                    }}
                >
                    ?
                </span>
            </Popover>
        </div>
    ),
}
