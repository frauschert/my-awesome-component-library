import React from 'react'
import type { StoryObj, Meta } from '@storybook/react'
import Ellipsis from './Ellipsis'
import hex from '../../../utility/hex'

const meta: Meta<typeof Ellipsis> = {
    title: 'Components/Spinner/Ellipsis',
    component: Ellipsis,
    argTypes: {
        color: { control: { type: 'color' } },
        size: { control: { type: 'range', min: 1, max: 128, step: 1 } },
    },
}

export default meta

type Story = StoryObj<typeof Ellipsis>

export const Template: Story = {
    render: (args) => <Ellipsis {...args} />,
    args: {
        color: hex('#000'),
        size: 32,
    },
    name: 'Default',
}
