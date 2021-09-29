import React from 'react'
import { Meta } from '@storybook/react/types-6-0'
import { Story } from '@storybook/react'
import Input from './Input'
import { InputProps } from './types'

export default {
    title: 'Components/Input',
    component: Input,
} as Meta

// Create a master template for mapping args to render the Input component
const Template: Story<InputProps> = (args) => <Input {...args} />

export const Default = Template.bind({})

export const Secondary = Template.bind({})
Secondary.args = { initialValue: 'Test' }
