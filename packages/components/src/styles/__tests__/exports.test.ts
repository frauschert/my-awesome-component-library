/**
 * Integration test to verify CSS-in-JS exports from main package
 */

import {
    // Verify design tokens are exported
    tokens,
    colors,
    contrast,
    typography,
    spacing,
    borderRadius,
    shadows,
    breakpoints,
    zIndex,
    transitions,

    // Verify theme objects are exported
    themes,
    lightTheme,
    darkTheme,
    getThemeValue,

    // Verify style utilities are exported
    createStyles,
    mergeStyles,
    responsive,
    pseudo,
    keyframes,
    cssVar,
    rem,
    em,
    styleObjectToCss,

    // Verify hooks are exported
    useThemeStyles,

    // Verify types are exported
    type ThemeMode,
    type Theme,
    type ThemeKey,
    type StyleObject,
    type StyleFunction,
    type BaseTheme,
} from '../index'

describe('CSS-in-JS Package Exports', () => {
    describe('Design Tokens', () => {
        it('exports tokens object', () => {
            expect(tokens).toBeDefined()
            expect(tokens.colors).toBeDefined()
            expect(tokens.typography).toBeDefined()
            expect(tokens.spacing).toBeDefined()
        })

        it('exports individual token categories', () => {
            expect(colors).toBeDefined()
            expect(contrast).toBeDefined()
            expect(typography).toBeDefined()
            expect(spacing).toBeDefined()
            expect(borderRadius).toBeDefined()
            expect(shadows).toBeDefined()
            expect(breakpoints).toBeDefined()
            expect(zIndex).toBeDefined()
            expect(transitions).toBeDefined()
        })
    })

    describe('Theme Objects', () => {
        it('exports theme objects', () => {
            expect(themes).toBeDefined()
            expect(themes.light).toBeDefined()
            expect(themes.dark).toBeDefined()
        })

        it('exports individual themes', () => {
            expect(lightTheme).toBeDefined()
            expect(darkTheme).toBeDefined()
        })

        it('exports theme helper function', () => {
            expect(typeof getThemeValue).toBe('function')
            const value = getThemeValue('light', 'primaryColor')
            expect(value).toBe('#408bbd')
        })
    })

    describe('Style Utilities', () => {
        it('exports createStyles', () => {
            expect(typeof createStyles).toBe('function')
            const styles = createStyles(
                (theme: BaseTheme) => ({
                    color: theme.textColor,
                }),
                'light'
            )
            expect(styles.getStyles).toBeDefined()
            expect(styles.toCss).toBeDefined()
            expect(styles.toInlineStyles).toBeDefined()
        })

        it('exports responsive utility', () => {
            expect(typeof responsive).toBe('function')
            const styles = responsive({
                base: { padding: '1rem' },
                md: { padding: '2rem' },
            })
            expect(styles.padding).toBe('1rem')
        })

        it('exports pseudo utility', () => {
            expect(typeof pseudo).toBe('function')
            const styles = pseudo({
                base: { color: 'blue' },
                hover: { color: 'red' },
            })
            expect(styles.color).toBe('blue')
            expect(styles['&:hover']).toEqual({ color: 'red' })
        })

        it('exports mergeStyles', () => {
            expect(typeof mergeStyles).toBe('function')
            const merged = mergeStyles({ padding: '1rem' }, { margin: '1rem' })
            expect(merged.padding).toBe('1rem')
            expect(merged.margin).toBe('1rem')
        })

        it('exports keyframes', () => {
            expect(typeof keyframes).toBe('function')
            const animation = keyframes('fade', {
                '0%': { opacity: 0 },
                '100%': { opacity: 1 },
            })
            expect(animation).toContain('@keyframes fade')
        })

        it('exports styleObjectToCss', () => {
            expect(typeof styleObjectToCss).toBe('function')
            const css = styleObjectToCss({ padding: '1rem' }, '.test')
            expect(css).toContain('padding: 1rem')
        })
    })

    describe('Utility Functions', () => {
        it('exports cssVar', () => {
            expect(typeof cssVar).toBe('function')
            expect(cssVar('test')).toBe('var(--test)')
            expect(cssVar('test', 'blue')).toBe('var(--test, blue)')
        })

        it('exports rem', () => {
            expect(typeof rem).toBe('function')
            expect(rem(16)).toBe('1rem')
            expect(rem(32)).toBe('2rem')
        })

        it('exports em', () => {
            expect(typeof em).toBe('function')
            expect(em(16)).toBe('1em')
            expect(em(32)).toBe('2em')
        })
    })

    describe('React Hooks', () => {
        it('exports useThemeStyles', () => {
            expect(typeof useThemeStyles).toBe('function')
        })
    })

    describe('TypeScript Types', () => {
        it('has correct type exports', () => {
            // This test verifies types compile correctly
            const mode: ThemeMode = 'light'
            const theme: Theme = lightTheme
            const key: ThemeKey = 'primaryColor'
            const styleObj: StyleObject = { padding: '1rem' }
            const styleFn: StyleFunction = (theme: BaseTheme) => ({
                color: theme.textColor,
            })

            expect(mode).toBe('light')
            expect(theme).toBeDefined()
            expect(key).toBe('primaryColor')
            expect(styleObj).toBeDefined()
            expect(typeof styleFn).toBe('function')
        })
    })

    describe('Integration Test', () => {
        it('can create a complete styled component', () => {
            // This tests the full workflow
            const styles = createStyles((theme: BaseTheme) => {
                const baseStyles = responsive({
                    base: {
                        padding: spacing[4],
                        fontSize: typography.fontSize.base,
                    },
                    md: {
                        padding: spacing[6],
                    },
                })

                const interactiveStyles = pseudo({
                    base: {
                        backgroundColor: theme.primaryColor,
                        color: theme.primaryTextColor,
                    },
                    hover: {
                        backgroundColor: theme.primaryColorDark,
                    },
                })

                return mergeStyles(baseStyles, interactiveStyles)
            }, 'light')

            const inlineStyles = styles.toInlineStyles()
            expect(inlineStyles.padding).toBe('1rem')
            expect(inlineStyles.backgroundColor).toBe('#408bbd')
            expect(inlineStyles.color).toBe('#ffffff')
        })
    })
})
