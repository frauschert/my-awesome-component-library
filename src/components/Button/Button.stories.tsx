import { Meta, StoryObj } from '@storybook/react'
import Button from './Button'

const meta: Meta<typeof Button> = {
    title: 'Components/Button',
    component: Button,
    argTypes: {
        backgroundColor: { control: 'color' },
    },
}

export default meta

type Story = StoryObj<typeof Button>

export const Primary: Story = {
    args: {
        label: 'Primary 😃',
        size: 'large',
    },
}

export const Secondary: Story = {
    args: { ...Primary.args, primary: false, label: 'Secondary 😇' },
}
