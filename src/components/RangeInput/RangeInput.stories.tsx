import React from 'react'
import { Meta } from '@storybook/react/types-6-0'
import { Story } from '@storybook/react'
import RangeInput, { RangeInputProps } from './RangeInput'

export default {
    title: 'Components/RangeInput',
    component: RangeInput,
} as Meta

// Create a master template for mapping args to render the Input component
const Template: Story<RangeInputProps> = (args) => <RangeInput {...args} />

export const Default = Template.bind({})
Default.args = { initialValue: 50, minValue: 0, maxValue: 100 }
