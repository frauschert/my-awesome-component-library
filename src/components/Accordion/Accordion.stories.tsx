import React from 'react'
import { Meta } from '@storybook/react/types-6-0'
import { Story } from '@storybook/react'
import Accordion from './Accordion'
import { ThemeProvider, ThemeSwitcher } from '../Theme'

export default {
    title: 'Components/Accordion',
    component: Accordion,
    argTypes: {
        backgroundColor: { control: 'color' },
    },
} as Meta

const Template: Story = (args) => <Accordion {...args} />

export const Default = Template.bind({})
export const WithTheme = Template.bind({})
WithTheme.decorators = [
    (Story) => (
        <ThemeProvider>
            <Story />
            <ThemeSwitcher />
        </ThemeProvider>
    ),
]
