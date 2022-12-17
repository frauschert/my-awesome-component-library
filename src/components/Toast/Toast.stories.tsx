import React from 'react'
import { Meta } from '@storybook/react/types-6-0'
import { Story } from '@storybook/react'
import { ToastProvider, useToast, ToastProviderProps, notify } from './'
import Button from '../Button'

const ButtonWrapper = () => {
    //const { add } = useToast()

    const positions = [
        'bottom-left',
        'bottom-right',
        'top-left',
        'top-right',
    ] as const
    return (
        <Button
            label="ToastButton"
            onClick={() =>
                notify({
                    content: 'Blub',
                    position:
                        positions[Math.floor(Math.random() * (3 - 0 + 1) + 0)],
                })
            }
        />
    )
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
