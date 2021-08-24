import React from 'react'
import { Meta } from '@storybook/react/types-6-0'
import { Story } from '@storybook/react'
import ThemeProvider from './ThemeProvider'
import ThemeSwitcher from './ThemeSwitcher'

export default {
    title: 'Components/ThemeSwitcher',
    component: ThemeSwitcher,
} as Meta

// Create a master template for mapping args to render the ThemeSwitcher component
const Template: Story = () => <ThemeSwitcher />

// Reuse that template for creating different stories
export const NoTheme = Template.bind({})
export const WithTheme = Template.bind({})
WithTheme.decorators = [
    (Story) => (
        <ThemeProvider>
            <Story />
        </ThemeProvider>
    ),
]
