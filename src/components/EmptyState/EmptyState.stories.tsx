import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import EmptyState from './EmptyState'
import Button from '../Button'

const meta: Meta<typeof EmptyState> = {
    title: 'Components/EmptyState',
    component: EmptyState,
    args: {
        title: 'Nothing here yet',
        description: 'Get started by creating your first item.',
        size: 'medium',
    },
}

export default meta
type Story = StoryObj<typeof EmptyState>

export const Default: Story = {}

export const WithIcon: Story = {
    args: {
        icon: <span style={{ fontSize: '3rem' }}>📭</span>,
    },
}

export const WithAction: Story = {
    args: {
        icon: <span style={{ fontSize: '3rem' }}>📂</span>,
        action: <Button variant="primary">Create item</Button>,
    },
}

export const SearchResult: Story = {
    args: {
        icon: <span style={{ fontSize: '3rem' }}>🔍</span>,
        title: 'No results found',
        description: 'Try adjusting your search terms or filters.',
        action: <Button variant="secondary">Clear filters</Button>,
    },
}

export const Small: Story = {
    args: {
        size: 'small',
        icon: <span>📭</span>,
        title: 'Nothing here',
    },
}

export const Large: Story = {
    args: {
        size: 'large',
        icon: <span>🗂</span>,
        action: <Button variant="primary">Get started</Button>,
    },
}
