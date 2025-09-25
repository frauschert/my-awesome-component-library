import React from 'react'

import { StoryObj, Meta } from '@storybook/react'
import { ToastProvider, ToastProviderProps, notify } from './'
import Button from '../Button'

const ButtonWrapper = () => {
    //const { add } = useToast()

    const positions = [
        'bottom-left',
        'bottom-right',
        'top-left',
        'top-right',
    ] as const
    const variants = ['info', 'success', 'warn', 'error'] as const
    return (
        <Button
            label="ToastButton"
            onClick={() =>
                notify({
                    content: 'A toast message',
                    variant:
                        variants[Math.floor(Math.random() * variants.length)],
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
} as Meta<typeof ButtonWrapper>

export const Template: StoryObj<ToastProviderProps> = {
    args: {
        position: 'bottom-right',
        maxVisible: 3,
        dismissOnEscape: true,
    },
    render: (args) => (
        <ToastProvider {...args}>
            <ButtonWrapper />
        </ToastProvider>
    ),
}
