import type { StorybookConfig } from '@storybook/react-vite'
import { mergeConfig } from 'vite'

const config: StorybookConfig = {
    // Required
    framework: '@storybook/react-vite',

    stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    addons: ['@storybook/addon-docs'],

    async viteFinal(config) {
        return mergeConfig(config, {
            plugins: [
                {
                    name: 'svg-react-component',
                    transform(code, id) {
                        if (id.endsWith('.svg')) {
                            return {
                                code: `
                                    import React from 'react';
                                    export default React.forwardRef((props, ref) => 
                                        React.createElement('svg', { ...props, ref, 'data-testid': 'svg-mock' })
                                    );
                                `,
                                map: null,
                            }
                        }
                    },
                },
            ],
        })
    }
}

export default config
