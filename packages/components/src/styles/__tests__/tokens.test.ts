import {
    tokens,
    createStyles,
    responsive,
    pseudo,
    mergeStyles,
    rem,
    cssVar,
} from '../index'
import type { BaseTheme } from '../index'

describe('CSS-in-JS Tokens', () => {
    it('exports color tokens', () => {
        expect(tokens.colors.primary.base).toBe('#384ea9')
        expect(tokens.colors.success.light).toBe('#dcfce7')
    })

    it('exports typography tokens', () => {
        expect(tokens.typography.fontSize.base).toBe('1rem')
        expect(tokens.typography.fontWeight.bold).toBe(700)
    })

    it('exports spacing tokens', () => {
        expect(tokens.spacing[4]).toBe('1rem')
        expect(tokens.spacing[8]).toBe('2rem')
    })

    it('exports theme objects', () => {
        expect(tokens.lightTheme.backgroundColor).toBe('#ffffff')
        expect(tokens.darkTheme.backgroundColor).toBe('#222')
    })
})

describe('createStyles', () => {
    it('creates styles with light theme', () => {
        const styles = createStyles(
            (theme: BaseTheme) => ({
                backgroundColor: theme.backgroundColor,
                color: theme.textColor,
            }),
            'light'
        )

        const result = styles.getStyles()
        expect(result.backgroundColor).toBe('#ffffff')
        expect(result.color).toBe('#408bbd')
    })

    it('creates styles with dark theme', () => {
        const styles = createStyles(
            (theme: BaseTheme) => ({
                backgroundColor: theme.backgroundColor,
                color: theme.textColor,
            }),
            'dark'
        )

        const result = styles.getStyles()
        expect(result.backgroundColor).toBe('#222')
        expect(result.color).toBe('#ddd')
    })

    it('creates styles with props', () => {
        interface ButtonProps {
            variant: 'primary' | 'secondary'
        }

        const styles = createStyles((theme: BaseTheme, props?: ButtonProps) => {
            return {
                backgroundColor:
                    props?.variant === 'primary'
                        ? theme.primaryColor
                        : theme.backgroundColor,
            }
        }, 'light')

        const primaryResult = styles.getStyles({ variant: 'primary' })
        expect(primaryResult.backgroundColor).toBe('#408bbd')

        const secondaryResult = styles.getStyles({ variant: 'secondary' })
        expect(secondaryResult.backgroundColor).toBe('#ffffff')
    })

    it('converts to inline styles', () => {
        const styles = createStyles(
            () => ({
                padding: '1rem',
                margin: '0.5rem',
                '&:hover': {
                    backgroundColor: 'blue',
                },
            }),
            'light'
        )

        const inlineStyles = styles.toInlineStyles()
        expect(inlineStyles.padding).toBe('1rem')
        expect(inlineStyles.margin).toBe('0.5rem')
        // Nested styles are not included in inline styles
    })

    it('converts to CSS string', () => {
        const styles = createStyles(
            () => ({
                padding: '1rem',
                backgroundColor: 'blue',
            }),
            'light'
        )

        const css = styles.toCss('.button')
        expect(css).toContain('padding: 1rem')
        expect(css).toContain('background-color: blue')
    })
})

describe('responsive', () => {
    it('creates responsive styles', () => {
        const styles = responsive({
            base: {
                fontSize: '14px',
            },
            md: {
                fontSize: '16px',
            },
            lg: {
                fontSize: '18px',
            },
        })

        expect(styles.fontSize).toBe('14px')
        expect(styles['@media (min-width: 768px)']).toEqual({
            fontSize: '16px',
        })
        expect(styles['@media (min-width: 1024px)']).toEqual({
            fontSize: '18px',
        })
    })
})

describe('pseudo', () => {
    it('creates pseudo selector styles', () => {
        const styles = pseudo({
            base: {
                color: 'blue',
            },
            hover: {
                color: 'darkblue',
            },
            focus: {
                outline: '2px solid blue',
            },
        })

        expect(styles.color).toBe('blue')
        expect(styles['&:hover']).toEqual({ color: 'darkblue' })
        expect(styles['&:focus']).toEqual({ outline: '2px solid blue' })
    })
})

describe('mergeStyles', () => {
    it('merges multiple style objects', () => {
        const base = {
            padding: '1rem',
            color: 'black',
        }

        const variant = {
            color: 'white',
            backgroundColor: 'blue',
        }

        const merged = mergeStyles(base, variant)
        expect(merged.padding).toBe('1rem')
        expect(merged.color).toBe('white')
        expect(merged.backgroundColor).toBe('blue')
    })

    it('deeply merges nested objects', () => {
        const base = {
            '&:hover': {
                color: 'red',
                backgroundColor: 'blue',
            },
        }

        const override = {
            '&:hover': {
                color: 'green',
            },
        }

        const merged = mergeStyles(base, override)
        const hover = merged['&:hover'] as Record<string, string>
        expect(hover.color).toBe('green')
        expect(hover.backgroundColor).toBe('blue')
    })
})

describe('utility functions', () => {
    it('rem converts px to rem', () => {
        expect(rem(16)).toBe('1rem')
        expect(rem(24)).toBe('1.5rem')
        expect(rem(32, 16)).toBe('2rem')
    })

    it('cssVar creates CSS variable reference', () => {
        expect(cssVar('primary-color')).toBe('var(--primary-color)')
        expect(cssVar('primary-color', '#blue')).toBe(
            'var(--primary-color, #blue)'
        )
    })
})
