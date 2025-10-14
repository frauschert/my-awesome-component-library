import React from 'react'
import { StoryObj, Meta } from '@storybook/react-vite'
import ThemeProvider from './ThemeProvider'
import ThemeSwitcher from './ThemeSwitcher'

const meta: Meta<typeof ThemeSwitcher> = {
    title: 'Components/ThemeSwitcher',
    component: ThemeSwitcher,
}

export default meta

type Story = StoryObj<typeof ThemeSwitcher>

export const NoTheme: Story = {}

export const WithTheme: Story = {}
WithTheme.decorators = [
    (Story) => (
        <ThemeProvider>
            <Story />
        </ThemeProvider>
    ),
]
