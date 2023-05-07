import { StoryObj, Meta } from '@storybook/react'
import RangeInput from './RangeInput'

const meta: Meta<typeof RangeInput> = {
    title: 'Components/RangeInput',
    component: RangeInput,
}

export default meta

type Story = StoryObj<typeof RangeInput>

export const Template: Story = {
    args: {
        initialValue: 50,
        minValue: 0,
        maxValue: 100,
    },
}
