import React, { createRef } from 'react'
import { Meta, StoryObj } from '@storybook/react-vite'
import Box from './'

const meta: Meta<typeof Box> = {
    title: 'Components/Box',
    component: Box,
}
export default meta

type Story = StoryObj<any>

export const AsDiv: Story = {
    args: {
        children: 'I am a div',
    },
}

export const AsSection: Story = {
    args: {
        as: 'section',
        children: 'I am a section',
    },
}

export const AsButton: Story = {
    args: {
        as: 'button',
        children: 'Click me',
        onClick: () => alert('clicked'),
    },
}

export const AsAnchor: Story = {
    args: {
        as: 'a',
        href: 'https://example.com',
        children: 'Go to example.com',
        target: '_blank',
        rel: 'noreferrer',
    },
}

export const WithRef: Story = {
    render: () => {
        const ref = createRef<HTMLDivElement>()
        return (
            <>
                <Box ref={ref} style={{ padding: 8, border: '1px solid #ddd' }}>
                    With ref
                </Box>
                <div style={{ fontSize: 12, opacity: 0.7, marginTop: 8 }}>
                    Current ref: {ref.current ? ref.current.tagName : 'null'}
                </div>
            </>
        )
    },
}
