import type { Config } from 'jest'

const config: Config = {
    testEnvironment: 'jsdom',
    testPathIgnorePatterns: ['<rootDir>/node_modules', '<rootDir>/lib'],
    moduleNameMapper: {
        '\\.(css|less|sass|scss)$': '<rootDir>/../../__mocks__/styleMock.js',
        '\\.(svg)$': '<rootDir>/../../__mocks__/svgMock.js',
    },
    moduleDirectories: ['node_modules', '<rootDir>/src'],
    setupFilesAfterEnv: ['<rootDir>/src/jest-setup.ts'],
    transform: {
        '^.+\\.(js|ts|jsx|tsx)$': 'babel-jest',
    },
    collectCoverageFrom: [
        '<rootDir>/src/**/*.ts',
        '<rootDir>/src/**/*.tsx',
        '!<rootDir>/src/**/*.stories.tsx',
        '!<rootDir>/src/**/types.ts',
        '!<rootDir>/src/**/index.ts',
    ],
}

export default config
