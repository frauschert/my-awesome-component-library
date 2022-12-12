import React from 'react'
import { Meta } from '@storybook/react/types-6-0'
import { Story } from '@storybook/react'
import { ToastProvider, useToast, ToastProviderProps, notify } from './'
import Button from '../Button'

const ButtonWrapper = () => {
    //const { add } = useToast()

    return <Button label="ToastButton" onClick={() => notify('Blub')} />
}

export default {
    title: 'Components/Toast',
    component: ButtonWrapper,
} as Meta

const Template: Story<ToastProviderProps> = (args) => {
    return (
        <ToastProvider {...args}>
            <ButtonWrapper />
        </ToastProvider>
    )
}

export const Default = Template.bind({})
Default.args = {
    position: 'bottom-right',
}
