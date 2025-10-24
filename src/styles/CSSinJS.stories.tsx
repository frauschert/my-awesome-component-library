import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import {
    tokens,
    createStyles,
    responsive,
    pseudo,
    useThemeStyles,
} from '../index'

const meta: Meta = {
    title: 'Styling/CSS-in-JS',
    parameters: {
        layout: 'padded',
    },
}

export default meta

// Example 1: Basic Tokens
export const DesignTokens: StoryObj = {
    render: () => (
        <div style={{ padding: '2rem' }}>
            <h2>Design Tokens</h2>

            <section style={{ marginBottom: '2rem' }}>
                <h3>Colors</h3>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {Object.entries(tokens.colors).map(([name, shades]) => (
                        <div key={name} style={{ textAlign: 'center' }}>
                            <div
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    backgroundColor: shades.base,
                                    borderRadius: '8px',
                                    marginBottom: '0.5rem',
                                }}
                            />
                            <div style={{ fontSize: '0.875rem' }}>{name}</div>
                            <div
                                style={{
                                    fontSize: '0.75rem',
                                    color: '#666',
                                }}
                            >
                                {shades.base}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h3>Spacing</h3>
                <div
                    style={{ display: 'flex', gap: '1rem', alignItems: 'end' }}
                >
                    {Object.entries(tokens.spacing)
                        .slice(0, 8)
                        .map(([key, value]) => (
                            <div key={key} style={{ textAlign: 'center' }}>
                                <div
                                    style={{
                                        width: '40px',
                                        height: value,
                                        backgroundColor:
                                            tokens.colors.primary.base,
                                        marginBottom: '0.5rem',
                                    }}
                                />
                                <div style={{ fontSize: '0.75rem' }}>
                                    {key}: {value}
                                </div>
                            </div>
                        ))}
                </div>
            </section>

            <section>
                <h3>Typography</h3>
                {Object.entries(tokens.typography.fontSize)
                    .slice(0, 7)
                    .map(([key, value]) => (
                        <div
                            key={key}
                            style={{ fontSize: value, marginBottom: '0.5rem' }}
                        >
                            {key}: The quick brown fox ({value})
                        </div>
                    ))}
            </section>
        </div>
    ),
}

// Example 2: createStyles with Theme
const CardExample: React.FC<{ theme: 'light' | 'dark' }> = ({ theme }) => {
    const styles = createStyles(
        (currentTheme) => ({
            backgroundColor: currentTheme.cardBackground,
            border: `1px solid ${currentTheme.borderColor}`,
            borderRadius: tokens.borderRadius.lg,
            padding: tokens.spacing[6],
            boxShadow: tokens.shadows.md,
            color: currentTheme.textColor,
        }),
        theme
    )

    return (
        <div style={styles.toInlineStyles()}>
            <h3 style={{ marginTop: 0 }}>Card with {theme} theme</h3>
            <p>This card uses createStyles with theme support.</p>
        </div>
    )
}

export const ThemedCard: StoryObj = {
    render: () => (
        <div style={{ display: 'flex', gap: '2rem', padding: '2rem' }}>
            <CardExample theme="light" />
            <div style={{ backgroundColor: '#1a1a1a', padding: '2rem' }}>
                <CardExample theme="dark" />
            </div>
        </div>
    ),
}

// Example 3: Responsive Styles
const ResponsiveBoxes: React.FC = () => {
    const styles = responsive({
        base: {
            padding: tokens.spacing[2],
            fontSize: tokens.typography.fontSize.sm,
            backgroundColor: tokens.colors.primary.light,
            borderRadius: tokens.borderRadius.md,
        },
        sm: {
            padding: tokens.spacing[4],
            fontSize: tokens.typography.fontSize.base,
        },
        md: {
            padding: tokens.spacing[6],
            fontSize: tokens.typography.fontSize.lg,
        },
        lg: {
            padding: tokens.spacing[8],
            fontSize: tokens.typography.fontSize.xl,
        },
    })

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Responsive Styles</h2>
            <p>Resize the window to see the box adapt</p>
            <div style={styles as React.CSSProperties}>
                This box changes padding and font size at different breakpoints
            </div>
        </div>
    )
}

export const ResponsiveDemo: StoryObj = {
    render: () => <ResponsiveBoxes />,
}

// Example 4: Pseudo Selectors
const InteractiveButtons: React.FC = () => {
    const buttonStyles = pseudo({
        base: {
            padding: `${tokens.spacing[3]} ${tokens.spacing[6]}`,
            fontSize: tokens.typography.fontSize.base,
            fontWeight: tokens.typography.fontWeight.medium.toString(),
            border: 'none',
            borderRadius: tokens.borderRadius.md,
            cursor: 'pointer',
            backgroundColor: tokens.colors.primary.base,
            color: 'white',
            transition: 'all 150ms ease',
        },
        hover: {
            backgroundColor: tokens.colors.primary.dark,
            transform: 'translateY(-2px)',
            boxShadow: tokens.shadows.md,
        },
        active: {
            transform: 'translateY(0)',
        },
    })

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Interactive Button</h2>
            <button style={buttonStyles as React.CSSProperties}>
                Hover me
            </button>
            <p
                style={{
                    marginTop: '1rem',
                    fontSize: '0.875rem',
                    color: '#666',
                }}
            >
                Note: Pseudo-selectors work when converted to CSS, but inline
                styles only show base styles
            </p>
        </div>
    )
}

export const PseudoSelectors: StoryObj = {
    render: () => <InteractiveButtons />,
}

// Example 5: Dynamic Props
interface ButtonProps {
    variant: 'primary' | 'secondary' | 'danger'
    size: 'sm' | 'md' | 'lg'
}

const DynamicButton: React.FC<ButtonProps & { children: React.ReactNode }> = ({
    variant,
    size,
    children,
}) => {
    const styles = createStyles((theme, props?: ButtonProps) => {
        const variants = {
            primary: {
                backgroundColor: theme.primaryColor,
                color: theme.primaryTextColor,
            },
            secondary: {
                backgroundColor: theme.backgroundColor,
                color: theme.textColor,
                border: `2px solid ${theme.borderColor}`,
            },
            danger: {
                backgroundColor: theme.dangerColor,
                color: 'white',
            },
        }

        const sizes = {
            sm: {
                padding: `${tokens.spacing[2]} ${tokens.spacing[3]}`,
                fontSize: tokens.typography.fontSize.sm,
            },
            md: {
                padding: `${tokens.spacing[3]} ${tokens.spacing[5]}`,
                fontSize: tokens.typography.fontSize.base,
            },
            lg: {
                padding: `${tokens.spacing[4]} ${tokens.spacing[6]}`,
                fontSize: tokens.typography.fontSize.lg,
            },
        }

        return {
            ...variants[props?.variant || 'primary'],
            ...sizes[props?.size || 'md'],
            border: 'none',
            borderRadius: tokens.borderRadius.md,
            cursor: 'pointer',
            fontWeight: tokens.typography.fontWeight.medium.toString(),
        }
    }, 'light')

    return (
        <button style={styles.toInlineStyles({ variant, size })}>
            {children}
        </button>
    )
}

export const DynamicStyles: StoryObj = {
    render: () => (
        <div style={{ padding: '2rem' }}>
            <h2>Dynamic Button Styles</h2>

            <div style={{ marginBottom: '2rem' }}>
                <h3>Variants</h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <DynamicButton variant="primary" size="md">
                        Primary
                    </DynamicButton>
                    <DynamicButton variant="secondary" size="md">
                        Secondary
                    </DynamicButton>
                    <DynamicButton variant="danger" size="md">
                        Danger
                    </DynamicButton>
                </div>
            </div>

            <div>
                <h3>Sizes</h3>
                <div
                    style={{
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'center',
                    }}
                >
                    <DynamicButton variant="primary" size="sm">
                        Small
                    </DynamicButton>
                    <DynamicButton variant="primary" size="md">
                        Medium
                    </DynamicButton>
                    <DynamicButton variant="primary" size="lg">
                        Large
                    </DynamicButton>
                </div>
            </div>
        </div>
    ),
}

// Example 6: Using Hook
const HookExample: React.FC = () => {
    const { inlineStyles } = useThemeStyles(
        (theme) => ({
            backgroundColor: theme.selectedBackgroundColor,
            color: theme.textColor,
            padding: tokens.spacing[6],
            borderRadius: tokens.borderRadius.lg,
            border: `2px solid ${theme.primaryColor}`,
        }),
        'light'
    )

    return (
        <div style={{ padding: '2rem' }}>
            <h2>useThemeStyles Hook</h2>
            <div style={inlineStyles}>
                <p>
                    This component uses the <code>useThemeStyles</code> hook for
                    theme-aware styling.
                </p>
            </div>
        </div>
    )
}

export const UsingHook: StoryObj = {
    render: () => <HookExample />,
}
