module.exports = {
    babel: async (options) => {
        options.plugins.push('babel-plugin-inline-react-svg')
        return options
    },

    stories: ['../src/**/*.stories.tsx'],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-controls',
    ],
}
