import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Drawer } from './Drawer'
import Button from '../Button'

const meta: Meta<typeof Drawer> = {
    title: 'Components/Drawer',
    component: Drawer,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Drawer>

const DrawerWrapper = (args: any) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div style={{ padding: '2rem' }}>
            <Button onClick={() => setIsOpen(true)}>Open Drawer</Button>
            <Drawer {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
                {args.children}
            </Drawer>
        </div>
    )
}

export const Default: Story = {
    render: (args) => <DrawerWrapper {...args} />,
    args: {
        title: 'Drawer Title',
        children: (
            <div>
                <p>This is the drawer content.</p>
                <p>You can put any content here.</p>
            </div>
        ),
    },
}

export const LeftPlacement: Story = {
    render: (args) => <DrawerWrapper {...args} />,
    args: {
        title: 'Left Drawer',
        placement: 'left',
        children: (
            <div>
                <p>This drawer slides in from the left.</p>
                <p>Perfect for navigation menus.</p>
            </div>
        ),
    },
}

export const TopPlacement: Story = {
    render: (args) => <DrawerWrapper {...args} />,
    args: {
        title: 'Top Drawer',
        placement: 'top',
        size: 'medium',
        children: (
            <div>
                <p>This drawer slides in from the top.</p>
                <p>Good for notifications or filters.</p>
            </div>
        ),
    },
}

export const BottomPlacement: Story = {
    render: (args) => <DrawerWrapper {...args} />,
    args: {
        title: 'Bottom Drawer',
        placement: 'bottom',
        size: 'medium',
        children: (
            <div>
                <p>This drawer slides in from the bottom.</p>
                <p>Great for mobile-style bottom sheets.</p>
            </div>
        ),
    },
}

export const SmallSize: Story = {
    render: (args) => <DrawerWrapper {...args} />,
    args: {
        title: 'Small Drawer',
        size: 'small',
        children: (
            <div>
                <p>This is a small drawer (300px).</p>
            </div>
        ),
    },
}

export const LargeSize: Story = {
    render: (args) => <DrawerWrapper {...args} />,
    args: {
        title: 'Large Drawer',
        size: 'large',
        children: (
            <div>
                <p>This is a large drawer (600px).</p>
                <p>Perfect for complex forms or detailed content.</p>
            </div>
        ),
    },
}

export const CustomSize: Story = {
    render: (args) => <DrawerWrapper {...args} />,
    args: {
        title: 'Custom Size',
        size: '80vw',
        children: (
            <div>
                <p>This drawer uses a custom size (80vw).</p>
                <p>You can use any CSS value.</p>
            </div>
        ),
    },
}

export const NoBackdrop: Story = {
    render: (args) => <DrawerWrapper {...args} />,
    args: {
        title: 'No Backdrop',
        showBackdrop: false,
        children: (
            <div>
                <p>This drawer has no backdrop.</p>
                <p>The background is not dimmed.</p>
            </div>
        ),
    },
}

export const NoCloseButton: Story = {
    render: (args) => <DrawerWrapper {...args} />,
    args: {
        title: 'No Close Button',
        showCloseButton: false,
        closeOnBackdropClick: true,
        children: (
            <div>
                <p>This drawer has no close button.</p>
                <p>Click the backdrop or press Escape to close.</p>
            </div>
        ),
    },
}

export const NoTitle: Story = {
    render: (args) => <DrawerWrapper {...args} />,
    args: {
        children: (
            <div>
                <h3 style={{ marginTop: 0 }}>Custom Header</h3>
                <p>This drawer has no title prop.</p>
                <p>You can create your own header in the content.</p>
            </div>
        ),
    },
}

export const PreventBackdropClose: Story = {
    render: (args) => <DrawerWrapper {...args} />,
    args: {
        title: 'Modal Drawer',
        closeOnBackdropClick: false,
        closeOnEscape: false,
        children: (
            <div>
                <p>This drawer can only be closed using the close button.</p>
                <p>Clicking the backdrop or pressing Escape won't work.</p>
            </div>
        ),
    },
}

export const WithForm: Story = {
    render: (args) => <DrawerWrapper {...args} />,
    args: {
        title: 'Settings',
        size: 'medium',
        children: (
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    alert('Form submitted!')
                }}
            >
                <div style={{ marginBottom: '1rem' }}>
                    <label
                        htmlFor="name"
                        style={{ display: 'block', marginBottom: '0.5rem' }}
                    >
                        Name:
                    </label>
                    <input
                        id="name"
                        type="text"
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                        }}
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label
                        htmlFor="email"
                        style={{ display: 'block', marginBottom: '0.5rem' }}
                    >
                        Email:
                    </label>
                    <input
                        id="email"
                        type="email"
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                        }}
                    />
                </div>
                <Button type="submit">Save Changes</Button>
            </form>
        ),
    },
}

export const WithLongContent: Story = {
    render: (args) => <DrawerWrapper {...args} />,
    args: {
        title: 'Long Content',
        children: (
            <div>
                {Array.from({ length: 50 }, (_, i) => (
                    <p key={i}>
                        This is paragraph {i + 1}. The drawer content is
                        scrollable.
                    </p>
                ))}
            </div>
        ),
    },
}
