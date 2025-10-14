// Mock SVG imports as React components for tests
const React = require('react')

module.exports = React.forwardRef((props, ref) => {
    return React.createElement('svg', {
        ...props,
        ref,
        'data-testid': 'svg-mock',
    })
})

module.exports.default = module.exports
