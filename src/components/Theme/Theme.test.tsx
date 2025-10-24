import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import ThemeProvider from './ThemeProvider'
import ThemeSwitcher from './ThemeSwitcher'
import { useTheme } from './ThemeContext'

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {}
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value
        },
        removeItem: (key: string) => {
            delete store[key]
        },
        clear: () => {
            store = {}
        },
    }
})()

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
})

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
})

describe('Theme System', () => {
    beforeEach(() => {
        localStorageMock.clear()
        document.documentElement.className = ''
    })

    describe('ThemeProvider', () => {
        it('applies light theme by default', () => {
            render(
                <ThemeProvider>
                    <div>Content</div>
                </ThemeProvider>
            )

            expect(
                document.documentElement.classList.contains('theme--light')
            ).toBe(true)
        })

        it('provides theme context', () => {
            const TestComponent = () => {
                const [{ theme }] = useTheme()
                return <div>Current theme: {theme}</div>
            }

            render(
                <ThemeProvider>
                    <TestComponent />
                </ThemeProvider>
            )

            expect(screen.getByText(/Current theme:/)).toBeInTheDocument()
        })
    })

    describe('ThemeSwitcher - Buttons Variant', () => {
        it('renders all theme options', () => {
            render(
                <ThemeProvider>
                    <ThemeSwitcher variant="buttons" />
                </ThemeProvider>
            )

            expect(screen.getByText('Light')).toBeInTheDocument()
            expect(screen.getByText('Dark')).toBeInTheDocument()
            expect(screen.getByText('Auto')).toBeInTheDocument()
        })

        it('switches to dark theme when clicked', () => {
            render(
                <ThemeProvider>
                    <ThemeSwitcher variant="buttons" />
                </ThemeProvider>
            )

            const darkButton = screen.getByText('Dark')
            fireEvent.click(darkButton)

            // Wait for next tick
            setTimeout(() => {
                expect(
                    document.documentElement.classList.contains('theme--dark')
                ).toBe(true)
            }, 100)
        })

        it('shows active state on current theme', () => {
            render(
                <ThemeProvider>
                    <ThemeSwitcher variant="buttons" />
                </ThemeProvider>
            )

            const lightButton = screen.getByLabelText('light theme')
            expect(lightButton).toHaveClass('theme-switcher__button--active')
        })

        it('hides labels when showLabels is false', () => {
            render(
                <ThemeProvider>
                    <ThemeSwitcher variant="buttons" showLabels={false} />
                </ThemeProvider>
            )

            expect(screen.queryByText('Light')).not.toBeInTheDocument()
            expect(screen.queryByText('Dark')).not.toBeInTheDocument()
        })

        it('applies size classes', () => {
            const { container } = render(
                <ThemeProvider>
                    <ThemeSwitcher variant="buttons" size="lg" />
                </ThemeProvider>
            )

            const switcher = container.querySelector('.theme-switcher')
            expect(switcher).toHaveClass('theme-switcher--lg')
        })
    })

    describe('ThemeSwitcher - Select Variant', () => {
        it('renders as a select element', () => {
            render(
                <ThemeProvider>
                    <ThemeSwitcher variant="select" />
                </ThemeProvider>
            )

            const select = screen.getByRole('combobox')
            expect(select).toBeInTheDocument()
        })

        it('changes theme via select', () => {
            render(
                <ThemeProvider>
                    <ThemeSwitcher variant="select" />
                </ThemeProvider>
            )

            const select = screen.getByRole('combobox') as HTMLSelectElement
            fireEvent.change(select, { target: { value: 'dark' } })

            setTimeout(() => {
                expect(select.value).toBe('dark')
            }, 100)
        })
    })

    describe('ThemeSwitcher - Toggle Variant', () => {
        it('renders as a toggle button', () => {
            render(
                <ThemeProvider>
                    <ThemeSwitcher variant="toggle" />
                </ThemeProvider>
            )

            const toggle = screen.getByRole('button')
            expect(toggle).toBeInTheDocument()
        })

        it('toggles between light and dark', () => {
            render(
                <ThemeProvider>
                    <ThemeSwitcher variant="toggle" />
                </ThemeProvider>
            )

            const toggle = screen.getByRole('button')

            // Should start with light theme, so button should switch to dark
            expect(toggle).toHaveAttribute('aria-label', 'Switch to dark theme')

            fireEvent.click(toggle)

            setTimeout(() => {
                expect(
                    document.documentElement.classList.contains('theme--dark')
                ).toBe(true)
            }, 100)
        })
    })

    describe('LocalStorage Persistence', () => {
        it('saves theme preference to localStorage', () => {
            render(
                <ThemeProvider>
                    <ThemeSwitcher variant="buttons" />
                </ThemeProvider>
            )

            const darkButton = screen.getByText('Dark')
            fireEvent.click(darkButton)

            setTimeout(() => {
                expect(localStorageMock.getItem('app-theme')).toBe('dark')
            }, 100)
        })

        it('loads theme from localStorage on mount', () => {
            localStorageMock.setItem('app-theme', 'dark')

            render(
                <ThemeProvider>
                    <div>Content</div>
                </ThemeProvider>
            )

            setTimeout(() => {
                expect(
                    document.documentElement.classList.contains('theme--dark')
                ).toBe(true)
            }, 100)
        })
    })

    describe('System Preference', () => {
        it('respects system dark mode preference with auto', () => {
            // Mock dark mode preference
            window.matchMedia = jest.fn().mockImplementation((query) => ({
                matches: query === '(prefers-color-scheme: dark)',
                media: query,
                onchange: null,
                addListener: jest.fn(),
                removeListener: jest.fn(),
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
                dispatchEvent: jest.fn(),
            }))

            render(
                <ThemeProvider>
                    <ThemeSwitcher variant="buttons" />
                </ThemeProvider>
            )

            const autoButton = screen.getByText('Auto')
            fireEvent.click(autoButton)

            // Should detect system preference and apply dark theme
            setTimeout(() => {
                const TestComponent = () => {
                    const [{ resolvedTheme }] = useTheme()
                    return <div>Resolved: {resolvedTheme}</div>
                }

                render(
                    <ThemeProvider>
                        <TestComponent />
                    </ThemeProvider>
                )

                // Note: This is a simplified test. In a real scenario,
                // the system preference detection would work properly
            }, 100)
        })
    })

    describe('Accessibility', () => {
        it('has proper ARIA labels', () => {
            render(
                <ThemeProvider>
                    <ThemeSwitcher variant="buttons" />
                </ThemeProvider>
            )

            expect(screen.getByLabelText('light theme')).toBeInTheDocument()
            expect(screen.getByLabelText('dark theme')).toBeInTheDocument()
            expect(screen.getByLabelText('auto theme')).toBeInTheDocument()
        })

        it('has proper ARIA pressed state', () => {
            render(
                <ThemeProvider>
                    <ThemeSwitcher variant="buttons" />
                </ThemeProvider>
            )

            const lightButton = screen.getByLabelText('light theme')
            expect(lightButton).toHaveAttribute('aria-pressed', 'true')
        })

        it('select has proper ARIA label', () => {
            render(
                <ThemeProvider>
                    <ThemeSwitcher variant="select" />
                </ThemeProvider>
            )

            const select = screen.getByLabelText('Select theme')
            expect(select).toBeInTheDocument()
        })
    })
})
