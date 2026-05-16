import type { Preview } from '@storybook/react-vite'
import React, { useEffect } from 'react'
import { Provider } from '../src/components/Theme/ThemeContext'
import type { ThemeKey } from '../src/components/Theme/ThemeContext'

// Import Inter font
import '@fontsource/inter/300.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'

const preview: Preview = {
    tags: ['autodocs'],

    // Define global types for the toolbar
    globalTypes: {
        theme: {
            description: 'Global theme for components',
            defaultValue: 'light',
            toolbar: {
                title: 'Theme',
                icon: 'circlehollow',
                items: [
                    { value: 'light', icon: 'sun', title: 'Light' },
                    { value: 'dark', icon: 'moon', title: 'Dark' },
                ],
                dynamicTitle: true,
            },
        },
    },

    decorators: [
        (Story, context) => {
            const theme = context.globals.theme as ThemeKey

            // Apply theme class directly to html element
            useEffect(() => {
                document.documentElement.classList.remove(
                    'theme--light',
                    'theme--dark'
                )
                document.documentElement.classList.add(`theme--${theme}`)
            }, [theme])

            return (
                <Provider>
                    <div style={{ padding: '1rem' }}>
                        <Story />
                    </div>
                </Provider>
            )
        },
    ],
}

export default preview
