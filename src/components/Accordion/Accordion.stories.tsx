import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import Accordion from './Accordion'
import { ThemeProvider, ThemeSwitcher } from '../Theme'

const meta: Meta<typeof Accordion> = {
    title: 'Components/Accordion',
    component: Accordion,
    tags: ['autodocs'],
    render: (args) => (
        <ThemeProvider>
            <Accordion {...args} />
            <ThemeSwitcher />
        </ThemeProvider>
    ),
}
export default meta

type Story = StoryObj<React.ComponentProps<typeof Accordion>>
