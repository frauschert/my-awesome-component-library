import React from 'react'
import { Meta } from '@storybook/react/types-6-0'
import { Story } from '@storybook/react'
import Layout from './Layout'

export default {
    title: 'Components/Layout',
    component: Layout,
} as Meta

const Template: Story<any> = (args) => (
    <>
        <Layout>
            <p>First column</p>
            <p>Second column</p>
            <p>Third column</p>
        </Layout>
        <Layout>
            <p>First column</p>
            <p>Second column</p>
            <p>Third column</p>
        </Layout>
    </>
)

export const Example = Template.bind({})
Example.parameters = {
    layout: 'centered',
}
