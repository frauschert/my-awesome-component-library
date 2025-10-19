import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Divider } from './Divider'

const meta: Meta<typeof Divider> = {
    title: 'Components/Divider',
    component: Divider,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Divider>

export const Default: Story = {
    render: () => (
        <div>
            <p style={{ color: 'var(--theme-text-primary)' }}>Content above</p>
            <Divider />
            <p style={{ color: 'var(--theme-text-primary)' }}>Content below</p>
        </div>
    ),
}

export const WithLabel: Story = {
    render: () => (
        <div>
            <p style={{ color: 'var(--theme-text-primary)' }}>Section 1</p>
            <Divider label="OR" />
            <p style={{ color: 'var(--theme-text-primary)' }}>Section 2</p>
        </div>
    ),
}

export const LabelLeft: Story = {
    render: () => (
        <div>
            <p style={{ color: 'var(--theme-text-primary)' }}>Main content</p>
            <Divider label="Additional Info" labelAlign="left" />
            <p style={{ color: 'var(--theme-text-primary)' }}>Extra details</p>
        </div>
    ),
}

export const LabelRight: Story = {
    render: () => (
        <div>
            <p style={{ color: 'var(--theme-text-primary)' }}>Main content</p>
            <Divider label="See more" labelAlign="right" />
            <p style={{ color: 'var(--theme-text-primary)' }}>
                Additional content
            </p>
        </div>
    ),
}

export const Dashed: Story = {
    render: () => (
        <div>
            <p style={{ color: 'var(--theme-text-primary)' }}>Content above</p>
            <Divider variant="dashed" />
            <p style={{ color: 'var(--theme-text-primary)' }}>Content below</p>
        </div>
    ),
}

export const Dotted: Story = {
    render: () => (
        <div>
            <p style={{ color: 'var(--theme-text-primary)' }}>Content above</p>
            <Divider variant="dotted" />
            <p style={{ color: 'var(--theme-text-primary)' }}>Content below</p>
        </div>
    ),
}

export const PrimaryColor: Story = {
    render: () => (
        <div>
            <p style={{ color: 'var(--theme-text-primary)' }}>Content above</p>
            <Divider color="primary" />
            <p style={{ color: 'var(--theme-text-primary)' }}>Content below</p>
        </div>
    ),
}

export const SecondaryColor: Story = {
    render: () => (
        <div>
            <p style={{ color: 'var(--theme-text-primary)' }}>Content above</p>
            <Divider color="secondary" />
            <p style={{ color: 'var(--theme-text-primary)' }}>Content below</p>
        </div>
    ),
}

export const SmallSpacing: Story = {
    render: () => (
        <div>
            <p style={{ color: 'var(--theme-text-primary)' }}>Content above</p>
            <Divider spacing="small" />
            <p style={{ color: 'var(--theme-text-primary)' }}>Content below</p>
        </div>
    ),
}

export const LargeSpacing: Story = {
    render: () => (
        <div>
            <p style={{ color: 'var(--theme-text-primary)' }}>Content above</p>
            <Divider spacing="large" />
            <p style={{ color: 'var(--theme-text-primary)' }}>Content below</p>
        </div>
    ),
}

export const NoSpacing: Story = {
    render: () => (
        <div>
            <p style={{ color: 'var(--theme-text-primary)' }}>Content above</p>
            <Divider spacing="none" />
            <p style={{ color: 'var(--theme-text-primary)' }}>Content below</p>
        </div>
    ),
}

export const Vertical: Story = {
    render: () => (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                minHeight: '100px',
            }}
        >
            <div
                style={{ color: 'var(--theme-text-primary)', padding: '1rem' }}
            >
                Left content
            </div>
            <Divider orientation="vertical" />
            <div
                style={{ color: 'var(--theme-text-primary)', padding: '1rem' }}
            >
                Right content
            </div>
        </div>
    ),
}

export const VerticalWithSpacing: Story = {
    render: () => (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                minHeight: '100px',
            }}
        >
            <div
                style={{ color: 'var(--theme-text-primary)', padding: '1rem' }}
            >
                Left
            </div>
            <Divider orientation="vertical" spacing="large" />
            <div
                style={{ color: 'var(--theme-text-primary)', padding: '1rem' }}
            >
                Middle
            </div>
            <Divider orientation="vertical" spacing="large" />
            <div
                style={{ color: 'var(--theme-text-primary)', padding: '1rem' }}
            >
                Right
            </div>
        </div>
    ),
}

export const VerticalDashed: Story = {
    render: () => (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                minHeight: '100px',
            }}
        >
            <div
                style={{ color: 'var(--theme-text-primary)', padding: '1rem' }}
            >
                Left content
            </div>
            <Divider orientation="vertical" variant="dashed" />
            <div
                style={{ color: 'var(--theme-text-primary)', padding: '1rem' }}
            >
                Right content
            </div>
        </div>
    ),
}

export const InList: Story = {
    render: () => (
        <div>
            <div
                style={{
                    padding: '1rem 0',
                    color: 'var(--theme-text-primary)',
                }}
            >
                List Item 1
            </div>
            <Divider spacing="none" />
            <div
                style={{
                    padding: '1rem 0',
                    color: 'var(--theme-text-primary)',
                }}
            >
                List Item 2
            </div>
            <Divider spacing="none" />
            <div
                style={{
                    padding: '1rem 0',
                    color: 'var(--theme-text-primary)',
                }}
            >
                List Item 3
            </div>
        </div>
    ),
}

export const SectionSeparator: Story = {
    render: () => (
        <div style={{ maxWidth: '600px' }}>
            <h2 style={{ color: 'var(--theme-text-primary)' }}>User Profile</h2>
            <p style={{ color: 'var(--theme-text-secondary)' }}>
                Basic information about the user
            </p>
            <Divider
                label="Personal Details"
                labelAlign="left"
                spacing="large"
            />
            <div style={{ color: 'var(--theme-text-primary)' }}>
                <p>Name: John Doe</p>
                <p>Email: john@example.com</p>
            </div>
            <Divider
                label="Account Settings"
                labelAlign="left"
                spacing="large"
            />
            <div style={{ color: 'var(--theme-text-primary)' }}>
                <p>Username: johndoe</p>
                <p>Member since: 2024</p>
            </div>
        </div>
    ),
}

export const FormSections: Story = {
    render: () => (
        <div style={{ maxWidth: '500px' }}>
            <h2 style={{ color: 'var(--theme-text-primary)' }}>
                Registration Form
            </h2>
            <Divider label="Step 1: Account" spacing="large" />
            <div style={{ color: 'var(--theme-text-primary)' }}>
                <p>Email and password fields would go here</p>
            </div>
            <Divider label="Step 2: Profile" spacing="large" />
            <div style={{ color: 'var(--theme-text-primary)' }}>
                <p>Name and bio fields would go here</p>
            </div>
            <Divider label="Step 3: Preferences" spacing="large" />
            <div style={{ color: 'var(--theme-text-primary)' }}>
                <p>Notification settings would go here</p>
            </div>
        </div>
    ),
}
