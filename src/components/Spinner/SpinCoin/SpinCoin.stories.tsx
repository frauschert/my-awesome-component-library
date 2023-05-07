import { StoryObj, Meta } from '@storybook/react'
import SpinCoin from './SpinCoin'

const meta: Meta<typeof SpinCoin> = {
    title: 'Components/Spinner/SpinCoin',
    component: SpinCoin,
    argTypes: {
        color: { control: { type: 'color' } },
        size: { control: { type: 'range', min: 1, max: 128, step: 1 } },
    },
}

export default meta

type Story = StoryObj<typeof SpinCoin>

export const Template: Story = {}
