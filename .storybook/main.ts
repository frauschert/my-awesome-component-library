import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
    // Required
    framework: '@storybook/react-vite',
    stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    addons: ['@storybook/addon-essentials'],
    docs: {
        autodocs: true,
    },
}

export default config
