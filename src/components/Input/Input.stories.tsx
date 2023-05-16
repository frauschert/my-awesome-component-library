import { Meta, StoryObj } from '@storybook/react'
import Input from './Input'

const meta: Meta<typeof Input> = {
    title: 'Components/Input',
    component: Input,
}

export default meta

type Story = StoryObj<typeof Input>

export const NumberInput: Story = {
    args: {
        type: 'number',
        initialValue: 0,
    },
}

export const TextInput: Story = {
    args: {
        type: 'text',
        initialValue: 'Test',
    },
}
