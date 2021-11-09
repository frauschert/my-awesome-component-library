import React from 'react'
import { Meta } from '@storybook/react/types-6-0'
import { Story } from '@storybook/react'
import Ellipsis from './Ellipsis'
import { SpinnerProps } from '../types'
import { defaultProps } from '../utils'

export default {
    title: 'Components/Spinner/Ellipsis',
    component: Ellipsis,
    argTypes: {
        color: { control: { type: 'color' } },
        size: { control: { type: 'range', min: 1, max: 128, step: 1 } },
    },
} as Meta

const Template: Story<SpinnerProps> = (args) => {
    return <Ellipsis {...args} />
}

export const Default = Template.bind({})
Default.args = { ...defaultProps }
