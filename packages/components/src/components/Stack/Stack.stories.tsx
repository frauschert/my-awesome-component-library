import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import Stack from './Stack'

const meta: Meta<typeof Stack> = {
    title: 'Layout/Stack',
    component: Stack,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Stack>

const ItemBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div
        style={{
            backgroundColor: '#408bbd',
            color: 'white',
            padding: '1rem',
            textAlign: 'center',
            borderRadius: '4px',
        }}
    >
        {children}
    </div>
)

export const VerticalDefault: Story = {
    render: () => (
        <Stack>
            <ItemBox>Item 1</ItemBox>
            <ItemBox>Item 2</ItemBox>
            <ItemBox>Item 3</ItemBox>
        </Stack>
    ),
}

export const Horizontal: Story = {
    render: () => (
        <Stack direction="horizontal">
            <ItemBox>Item 1</ItemBox>
            <ItemBox>Item 2</ItemBox>
            <ItemBox>Item 3</ItemBox>
        </Stack>
    ),
}

export const ResponsiveDirection: Story = {
    render: () => (
        <Stack direction={{ xs: 'vertical', md: 'horizontal' }}>
            <ItemBox>Responsive 1</ItemBox>
            <ItemBox>Responsive 2</ItemBox>
            <ItemBox>Responsive 3</ItemBox>
        </Stack>
    ),
}

export const GapSizes: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
                <h3>Extra Small Gap</h3>
                <Stack gap="xs">
                    <ItemBox>Item 1</ItemBox>
                    <ItemBox>Item 2</ItemBox>
                    <ItemBox>Item 3</ItemBox>
                </Stack>
            </div>
            <div>
                <h3>Small Gap</h3>
                <Stack gap="sm">
                    <ItemBox>Item 1</ItemBox>
                    <ItemBox>Item 2</ItemBox>
                    <ItemBox>Item 3</ItemBox>
                </Stack>
            </div>
            <div>
                <h3>Large Gap</h3>
                <Stack gap="lg">
                    <ItemBox>Item 1</ItemBox>
                    <ItemBox>Item 2</ItemBox>
                    <ItemBox>Item 3</ItemBox>
                </Stack>
            </div>
            <div>
                <h3>Extra Large Gap</h3>
                <Stack gap="xl">
                    <ItemBox>Item 1</ItemBox>
                    <ItemBox>Item 2</ItemBox>
                    <ItemBox>Item 3</ItemBox>
                </Stack>
            </div>
        </div>
    ),
}

export const AlignCenter: Story = {
    render: () => (
        <Stack align="center" style={{ border: '2px dashed #ccc' }}>
            <ItemBox>Centered Item 1</ItemBox>
            <div style={{ width: '200px' }}>
                <ItemBox>Centered Item 2</ItemBox>
            </div>
            <ItemBox>Centered Item 3</ItemBox>
        </Stack>
    ),
}

export const JustifySpaceBetween: Story = {
    render: () => (
        <Stack
            justify="space-between"
            style={{ minHeight: '300px', border: '2px dashed #ccc' }}
        >
            <ItemBox>Top</ItemBox>
            <ItemBox>Middle</ItemBox>
            <ItemBox>Bottom</ItemBox>
        </Stack>
    ),
}

export const HorizontalCentered: Story = {
    render: () => (
        <Stack
            direction="horizontal"
            align="center"
            justify="center"
            style={{ minHeight: '200px', border: '2px dashed #ccc' }}
        >
            <ItemBox>Centered 1</ItemBox>
            <ItemBox>Centered 2</ItemBox>
            <ItemBox>Centered 3</ItemBox>
        </Stack>
    ),
}

export const WithWrap: Story = {
    render: () => (
        <Stack direction="horizontal" wrap gap="md">
            <ItemBox>Item 1</ItemBox>
            <ItemBox>Item 2</ItemBox>
            <ItemBox>Item 3</ItemBox>
            <ItemBox>Item 4</ItemBox>
            <ItemBox>Item 5</ItemBox>
            <ItemBox>Item 6</ItemBox>
            <ItemBox>Item 7</ItemBox>
            <ItemBox>Item 8</ItemBox>
        </Stack>
    ),
}

export const Reverse: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '2rem' }}>
            <div>
                <h3>Normal</h3>
                <Stack>
                    <ItemBox>First</ItemBox>
                    <ItemBox>Second</ItemBox>
                    <ItemBox>Third</ItemBox>
                </Stack>
            </div>
            <div>
                <h3>Reversed</h3>
                <Stack reverse>
                    <ItemBox>First</ItemBox>
                    <ItemBox>Second</ItemBox>
                    <ItemBox>Third</ItemBox>
                </Stack>
            </div>
        </div>
    ),
}

export const Fill: Story = {
    render: () => (
        <Stack direction="horizontal" fill gap="md">
            <ItemBox>Equal Width 1</ItemBox>
            <ItemBox>Equal Width 2</ItemBox>
            <ItemBox>Equal Width 3</ItemBox>
        </Stack>
    ),
}

export const WithDivider: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
                <h3>Vertical with Divider</h3>
                <Stack
                    divider={
                        <hr
                            style={{
                                width: '100%',
                                border: 'none',
                                borderTop: '1px solid #ccc',
                            }}
                        />
                    }
                >
                    <ItemBox>Section 1</ItemBox>
                    <ItemBox>Section 2</ItemBox>
                    <ItemBox>Section 3</ItemBox>
                </Stack>
            </div>
            <div>
                <h3>Horizontal with Divider</h3>
                <Stack
                    direction="horizontal"
                    divider={
                        <div
                            style={{
                                width: '1px',
                                height: '40px',
                                backgroundColor: '#ccc',
                            }}
                        />
                    }
                >
                    <ItemBox>Item 1</ItemBox>
                    <ItemBox>Item 2</ItemBox>
                    <ItemBox>Item 3</ItemBox>
                </Stack>
            </div>
        </div>
    ),
}

export const FormLayout: Story = {
    render: () => (
        <Stack gap="lg" style={{ maxWidth: '500px' }}>
            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                    Name
                </label>
                <input
                    type="text"
                    style={{
                        width: '100%',
                        padding: '0.5rem',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                    }}
                    placeholder="Enter your name"
                />
            </div>
            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                    Email
                </label>
                <input
                    type="email"
                    style={{
                        width: '100%',
                        padding: '0.5rem',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                    }}
                    placeholder="Enter your email"
                />
            </div>
            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                    Message
                </label>
                <textarea
                    style={{
                        width: '100%',
                        padding: '0.5rem',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        minHeight: '100px',
                    }}
                    placeholder="Enter your message"
                />
            </div>
            <Stack direction="horizontal" justify="end" gap="md">
                <button
                    style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        backgroundColor: 'white',
                    }}
                >
                    Cancel
                </button>
                <button
                    style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        border: 'none',
                        backgroundColor: '#408bbd',
                        color: 'white',
                    }}
                >
                    Submit
                </button>
            </Stack>
        </Stack>
    ),
}

export const NavigationBar: Story = {
    render: () => (
        <Stack
            direction="horizontal"
            justify="space-between"
            align="center"
            style={{ backgroundColor: '#333', color: 'white', padding: '1rem' }}
        >
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Logo</div>
            <Stack direction="horizontal" gap="lg">
                <a href="#" style={{ color: 'white', textDecoration: 'none' }}>
                    Home
                </a>
                <a href="#" style={{ color: 'white', textDecoration: 'none' }}>
                    About
                </a>
                <a href="#" style={{ color: 'white', textDecoration: 'none' }}>
                    Contact
                </a>
            </Stack>
        </Stack>
    ),
}
