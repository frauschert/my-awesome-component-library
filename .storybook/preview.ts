import type { Preview } from '@storybook/react-vite'

// Import Lato font from Google Fonts CDN
if (typeof document !== 'undefined') {
    const link = document.createElement('link')
    link.href =
        'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
}

const preview: Preview = {
    tags: ['autodocs'],
}

export default preview
