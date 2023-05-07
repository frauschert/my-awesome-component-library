import React from 'react'
import { StoryObj, Meta } from '@storybook/react'
import Resizable from './Resizable'

const meta: Meta<typeof Resizable> = {
    title: 'Components/Resizable',
    component: Resizable,
}

export default meta

type Story = StoryObj<typeof Resizable>

export const Template: Story = {
    args: {
        options: {
            step: 10,
            axis: 'both',
        },
        children: (
            <>
                <div>Test</div>
                <div>Test2</div>
            </>
        ),
    },
}
