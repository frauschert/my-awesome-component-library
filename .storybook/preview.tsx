import type { Preview } from '@storybook/react-vite'
import React, { useEffect } from 'react'
import ThemeProvider from '../src/components/Theme/ThemeProvider'
import { useTheme } from '../src/components/Theme/ThemeContext'
import type { ThemeKey } from '../src/components/Theme/ThemeContext'

// Import Inter font
import '@fontsource/inter/300.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'

// Wrapper component to sync Storybook global theme with context AND apply to document
function ThemeSync({
    theme,
    children,
}: {
    theme: ThemeKey
    children: React.ReactNode
}) {
    const [, setTheme] = useTheme((s) => s.theme)

    useEffect(() => {
        console.log('ThemeSync: Setting theme to', theme)
        // Update context
        setTheme({ theme })
    }, [theme, setTheme])

    return <>{children}</>
}

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

            return (
                <ThemeProvider>
                    <ThemeSync theme={theme}>
                        <div style={{ padding: '1rem' }}>
                            <Story />
                        </div>
                    </ThemeSync>
                </ThemeProvider>
            )
        },
    ],
}

export default preview
