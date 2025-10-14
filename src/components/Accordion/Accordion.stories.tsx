import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import Accordion from './Accordion'
import { ThemeProvider, ThemeSwitcher } from '../Theme'

const meta: Meta<typeof Accordion> = {
    title: 'Components/Accordion',
    component: Accordion,
    render: (args) => (
        <ThemeProvider>
            <Accordion {...args} />
            <ThemeSwitcher />
        </ThemeProvider>
    ),
}
export default meta

type Story = StoryObj<React.ComponentProps<typeof Accordion>>

export const Basic: Story = {
    args: {
        items: [
            { title: 'Section 1', content: 'Content for section 1.' },
            { title: 'Section 2', content: 'Content for section 2.' },
            { title: 'Section 3', content: 'Content for section 3.' },
        ],
    },
}

export const SingleItem: Story = {
    args: {
        items: [
            { title: 'Only Section', content: 'This is the only section.' },
        ],
    },
}

export const WithRichContent: Story = {
    args: {
        items: [
            {
                title: 'Section with JSX',
                content: (
                    <div>
                        <strong>Bold content</strong> and{' '}
                        <em>italic content</em>.<br />
                        <ul>
                            <li>List item 1</li>
                            <li>List item 2</li>
                        </ul>
                    </div>
                ),
            },
            {
                title: 'Another Section',
                content: <span>Plain text content.</span>,
            },
        ],
    },
}
