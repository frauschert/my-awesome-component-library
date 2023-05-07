import { Meta, StoryObj } from '@storybook/react'
import ProgressCircular from './ProgressCircular'

const meta: Meta<typeof ProgressCircular> = {
    title: 'Components/ProgressCircular',
    component: ProgressCircular,
}

export default meta

type Story = StoryObj<typeof ProgressCircular>

export const Template: Story = {
    args: {
        progress: 20,
    },
}

export const SpinnerMode: Story = {
    args: {
        ...Template.args,
        spinnerMode: true,
    },
}
