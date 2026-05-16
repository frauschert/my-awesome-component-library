import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import Breadcrumb from './Breadcrumb'
import type { BreadcrumbItem } from './Breadcrumb'

const meta: Meta<typeof Breadcrumb> = {
    title: 'Components/Breadcrumb',
    component: Breadcrumb,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Breadcrumb>

const basicItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Electronics', href: '/products/electronics' },
    { label: 'Laptop' },
]

export const Default: Story = {
    args: {
        items: basicItems,
    },
}

export const WithCustomSeparator: Story = {
    args: {
        items: basicItems,
        separator: '>',
    },
}

export const WithIconSeparator: Story = {
    args: {
        items: basicItems,
        separator: '›',
    },
}

export const WithClickHandlers: Story = {
    args: {
        items: [
            {
                label: 'Home',
                onClick: (e) => {
                    e.preventDefault()
                    alert('Navigating to Home')
                },
            },
            {
                label: 'Settings',
                onClick: (e) => {
                    e.preventDefault()
                    alert('Navigating to Settings')
                },
            },
            { label: 'Profile' },
        ],
    },
}

export const ShortPath: Story = {
    args: {
        items: [{ label: 'Home', href: '/' }, { label: 'About' }],
    },
}

export const LongPath: Story = {
    args: {
        items: [
            { label: 'Home', href: '/' },
            { label: 'Documents', href: '/documents' },
            { label: 'Projects', href: '/documents/projects' },
            { label: '2024', href: '/documents/projects/2024' },
            { label: 'Q4', href: '/documents/projects/2024/q4' },
            { label: 'Reports', href: '/documents/projects/2024/q4/reports' },
            { label: 'Final Report.pdf' },
        ],
    },
}

export const CollapsedPath: Story = {
    args: {
        items: [
            { label: 'Home', href: '/' },
            { label: 'Documents', href: '/documents' },
            { label: 'Projects', href: '/documents/projects' },
            { label: '2024', href: '/documents/projects/2024' },
            { label: 'Q4', href: '/documents/projects/2024/q4' },
            { label: 'Reports', href: '/documents/projects/2024/q4/reports' },
            { label: 'Final Report.pdf' },
        ],
        maxItems: 4,
        itemsBeforeCollapse: 1,
        itemsAfterCollapse: 2,
    },
}

export const SingleItem: Story = {
    args: {
        items: [{ label: 'Current Page' }],
    },
}

export const NoLinks: Story = {
    args: {
        items: [
            { label: 'Step 1' },
            { label: 'Step 2' },
            { label: 'Step 3' },
            { label: 'Current Step' },
        ],
    },
}

export const CustomStyling: Story = {
    args: {
        items: basicItems,
        className: 'custom-breadcrumb',
        separator: '→',
    },
    decorators: [
        (Story) => (
            <div>
                <style>{`
                    .custom-breadcrumb {
                        padding: 1rem;
                        background: var(--theme-bg-secondary);
                        border-radius: 0.5rem;
                    }
                `}</style>
                <Story />
            </div>
        ),
    ],
}
