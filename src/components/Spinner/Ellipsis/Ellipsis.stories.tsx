import type { StoryObj, Meta } from '@storybook/react'
import Ellipsis from './Ellipsis'

const meta: Meta<typeof Ellipsis> = {
    title: 'Components/Spinner/Ellipsis',
    component: Ellipsis,
    argTypes: {
        color: { control: { type: 'color' } },
        size: { control: { type: 'range', min: 1, max: 128, step: 1 } },
    },
}

export default meta

type Story = StoryObj<typeof Ellipsis>

export const Template: Story = {}
