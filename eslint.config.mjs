import js from '@eslint/js'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import storybookPlugin from 'eslint-plugin-storybook'

export default [
    // Global ignores
    {
        ignores: [
            'lib/**',
            'storybook-static/**',
            'node_modules/**',
            'coverage/**',
            '*.config.js',
            '*.config.mjs',
            'rollup.config.mjs',
            'babel.config.js',
        ],
    },

    // Base JavaScript config
    js.configs.recommended,

    // Storybook story files (must come before src/**/*.tsx to take precedence)
    {
        files: ['**/*.stories.{ts,tsx,js,jsx}'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true,
                },
                // No project option for stories
            },
            globals: {
                React: 'readonly',
                window: 'readonly',
                document: 'readonly',
                console: 'readonly',
                alert: 'readonly',
                setTimeout: 'readonly',
                HTMLElement: 'readonly',
                HTMLDivElement: 'readonly',
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            react: reactPlugin,
            storybook: storybookPlugin,
        },
        rules: {
            ...storybookPlugin.configs.recommended.rules,
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },

    // TypeScript and React files
    {
        files: ['src/**/*.{ts,tsx}'],
        ignores: [
            '**/*.stories.{ts,tsx}',
            '**/*.test.{ts,tsx}',
            '**/__tests__/**',
        ], // Exclude story and test files
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true,
                },
                project: './tsconfig.json',
            },
            globals: {
                React: 'readonly',
                JSX: 'readonly',
                window: 'readonly',
                document: 'readonly',
                console: 'readonly',
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
                setInterval: 'readonly',
                clearInterval: 'readonly',
                process: 'readonly',
                queueMicrotask: 'readonly',
                fetch: 'readonly',
                NodeJS: 'readonly',
                global: 'readonly',
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            react: reactPlugin,
            'react-hooks': reactHooksPlugin,
        },
        rules: {
            // TypeScript rules
            ...tsPlugin.configs.recommended.rules,
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                },
            ],
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-non-null-assertion': 'warn',

            // React rules
            ...reactPlugin.configs.recommended.rules,
            'react/react-in-jsx-scope': 'off', // Not needed in React 17+
            'react/prop-types': 'off', // Using TypeScript
            'react/display-name': 'warn',

            // React Hooks rules (CRITICAL for catching useEffect issues)
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',

            // General best practices
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            'no-debugger': 'warn',
            'prefer-const': 'warn',
            'no-var': 'error',
            'no-redeclare': 'off', // Conflicts with TypeScript function overloads
            '@typescript-eslint/no-redeclare': 'off', // Allow TypeScript overloads
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },

    // Configuration and mock files (without type-aware linting)
    {
        files: [
            '.storybook/**/*.{ts,js,mjs}',
            'jest.config.ts',
            '__mocks__/**/*.{ts,js}',
            '*.config.{ts,js,mjs}',
        ],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                // No project option - disable type-aware linting for config files
            },
            globals: {
                console: 'readonly',
                process: 'readonly',
                module: 'readonly',
                require: 'readonly',
                __dirname: 'readonly',
                document: 'readonly',
                window: 'readonly',
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },

    // Test files
    {
        files: [
            '**/*.test.{ts,tsx,js,jsx}',
            '**/__tests__/**/*.{ts,tsx,js,jsx}',
        ],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true,
                },
                // No project option for test files
            },
            globals: {
                React: 'readonly',
                window: 'readonly',
                document: 'readonly',
                describe: 'readonly',
                it: 'readonly',
                test: 'readonly',
                expect: 'readonly',
                beforeEach: 'readonly',
                afterEach: 'readonly',
                beforeAll: 'readonly',
                afterAll: 'readonly',
                jest: 'readonly',
                Element: 'readonly',
                global: 'readonly',
                string: 'readonly',
                number: 'readonly',
                unknown: 'readonly',
                console: 'readonly',
                setTimeout: 'readonly',
                HTMLElement: 'readonly',
                HTMLDivElement: 'readonly',
                HTMLButtonElement: 'readonly',
                HTMLInputElement: 'readonly',
                HTMLSelectElement: 'readonly',
                HTMLCanvasElement: 'readonly',
                HTMLImageElement: 'readonly',
                HTMLVideoElement: 'readonly',
                Event: 'readonly',
                MouseEvent: 'readonly',
                KeyboardEvent: 'readonly',
                TouchEvent: 'readonly',
                FocusEvent: 'readonly',
                CustomEvent: 'readonly',
                IntersectionObserver: 'readonly',
                IntersectionObserverCallback: 'readonly',
                IntersectionObserverInit: 'readonly',
                IntersectionObserverEntry: 'readonly',
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            react: reactPlugin,
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },
]
