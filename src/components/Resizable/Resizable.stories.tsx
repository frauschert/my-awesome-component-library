import React from 'react'
import { Meta } from '@storybook/react/types-6-0'
import { Story } from '@storybook/react'
import Resizable, { ResizableComponentProps } from './Resizable'

export default {
    title: 'Components/Resizable',
    component: Resizable,
} as Meta

const Template: Story<ResizableComponentProps> = (args) => (
    <>
        <Resizable {...args}>
            <div>Test</div>
            <div>Test2</div>
        </Resizable>
        <div>Test3</div>
    </>
)

export const Default = Template.bind({})
Default.args = { options: { step: 10, axis: 'both' } }
Default.parameters = {
    layout: 'centered',
}
