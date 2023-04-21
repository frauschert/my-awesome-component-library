const path = require('path')
module.exports = {
    babel: async (options) => {
        options.plugins.push('babel-plugin-inline-react-svg')
        return options
    },
    stories: ['../src/**/*.stories.tsx'],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        {
          name: '@storybook/addon-styling',
          options: {
            sass: {
              implementation: require('sass'),
            },
          },
        },
        '@storybook/addon-controls',
        '@storybook/addon-mdx-gfm',
        'storybook-css-modules',
    ],
    webpackFinal: async (config, { configType }) => {
        // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
        // You can change the configuration based on that.
        // 'PRODUCTION' is used when building the static version of storybook.

        // Make whatever fine-grained changes you need
        // config.module.rules.push({
        //     test: /\.scss$/,
        //     use: ['style-loader', 'css-loader?url=false', 'sass-loader'],
        //     include: path.resolve(__dirname, '../'),
        // })

        // Return the altered config
        return config
    },
    framework: {
        name: '@storybook/react-webpack5',
        options: {},
    },
    docs: {
        autodocs: true,
    },
}
