import type { Preview } from '@storybook/react-vite'
import React from 'react'
import ThemeProvider from '../src/components/Theme/ThemeProvider'
import ThemeSwitcher from '../src/components/Theme/ThemeSwitcher'

// Import Inter font
import '@fontsource/inter/300.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'

const preview: Preview = {
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <ThemeProvider>
                <div style={{ padding: '1rem' }}>
                    <Story />
                </div>
                <div style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 9999 }}>
                    <ThemeSwitcher />
                </div>
            </ThemeProvider>
        ),
    ],
}

export default preview
