import type { StoryObj, Meta } from '@storybook/react'
import SpinCoin from './SpinCoin'
import hex from '../../../utility/hex'

const meta: Meta<typeof SpinCoin> = {
    title: 'Components/Spinner/SpinCoin',
    component: SpinCoin,
    argTypes: {
        color: { control: { type: 'color' } },
        variant: {
            control: { type: 'select' },
            options: [
                'primary',
                'secondary',
                'success',
                'error',
                'warning',
                'info',
            ],
        },
        size: {
            control: { type: 'select' },
            options: ['xs', 'sm', 'md', 'lg', 'xl', 16, 32, 64, 96, 128],
        },
        speed: { control: { type: 'range', min: 0.5, max: 3, step: 0.1 } },
        label: { control: { type: 'text' } },
    },
}

export default meta

type Story = StoryObj<typeof SpinCoin>

export const Default: Story = {
    args: {
        label: 'Loading',
    },
}

export const Primary: Story = {
    args: {
        variant: 'primary',
        label: 'Loading data',
    },
}

export const Success: Story = {
    args: {
        variant: 'success',
        label: 'Processing',
    },
}

export const Error: Story = {
    args: {
        variant: 'error',
        label: 'Failed to load',
    },
}

export const CustomColor: Story = {
    args: {
        color: hex('#8b5cf6'),
        label: 'Custom color',
    },
}

export const ExtraSmall: Story = {
    args: {
        size: 'xs',
        variant: 'primary',
        label: 'Loading',
    },
}

export const Small: Story = {
    args: {
        size: 'sm',
        variant: 'success',
        label: 'Loading',
    },
}

export const Medium: Story = {
    args: {
        size: 'md',
        variant: 'warning',
        label: 'Loading',
    },
}

export const Large: Story = {
    args: {
        size: 'lg',
        variant: 'error',
        label: 'Loading',
    },
}

export const ExtraLarge: Story = {
    args: {
        size: 'xl',
        variant: 'info',
        label: 'Loading',
    },
}

export const FastSpeed: Story = {
    args: {
        size: 'lg',
        variant: 'primary',
        speed: 2,
        label: 'Fast loading',
    },
}

export const SlowSpeed: Story = {
    args: {
        size: 'lg',
        variant: 'secondary',
        speed: 0.5,
        label: 'Slow loading',
    },
}
