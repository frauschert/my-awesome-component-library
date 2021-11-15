import React from 'react'
import { Meta } from '@storybook/react/types-6-0'
import { Story } from '@storybook/react'
import { ToastProvider, useToast } from './'
import Button from '../Button'

const ButtonWrapper = () => {
    const { add } = useToast()

    return <Button label="ToastButton" onClick={() => add('Blub')} />
}

export default {
    title: 'Components/Toast',
    component: ButtonWrapper,
} as Meta

const Template: Story = (args) => {
    return (
        <ToastProvider position="top-right">
            <ButtonWrapper />
        </ToastProvider>
    )
}

export const Default = Template.bind({})
