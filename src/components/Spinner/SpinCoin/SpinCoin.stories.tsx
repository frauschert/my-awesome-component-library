import React from 'react'
import { Meta } from '@storybook/react/types-6-0'
import { Story } from '@storybook/react'
import SpinCoin, { defaultProps } from './SpinCoin'
import { SpinnerProps } from '../types'

export default {
    title: 'Components/Spinner/SpinCoin',
    component: SpinCoin,
    argTypes: {
        color: { control: { type: 'color' } },
        size: { control: { type: 'range', min: 1, max: 128, step: 1 } },
    },
} as Meta

const Template: Story<SpinnerProps> = (args) => {
    return <SpinCoin {...args} />
}

export const Default = Template.bind({})
Default.args = { ...defaultProps }
